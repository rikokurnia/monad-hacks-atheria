"use client";

import React, { useState, useEffect } from "react";
import { HexGrid, HexTileData, UnitType } from "@/components/game/HexGrid";
import { HUD } from "@/components/ui/HUD";
import confetti from "canvas-confetti";

export default function Home() {
  const [usdcBalance, setUsdcBalance] = useState<number>(1000);
  const [stakedPrincipal, setStakedPrincipal] = useState<number>(500);
  const [unclaimedYield, setUnclaimedYield] = useState<number>(12.458);
  const [hasBase, setHasBase] = useState<boolean>(false);
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number } | null>({ x: 3, y: 3 });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [citadelPlaced, setCitadelPlaced] = useState<boolean>(false);
  const [towerCount, setTowerCount] = useState<number>(0);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<"HOME" | "RAID">("HOME");
  const [battleState, setBattleState] = useState<"DEPLOYING" | "FIGHTING" | "OVER">("OVER");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<{status: string, yield: number} | null>(null);
  const [selectedBuildingToDeploy, setSelectedBuildingToDeploy] = useState<UnitType | null>(null);

  const [activeAttacks, setActiveAttacks] = useState<Array<{
    attackerX: number;
    attackerY: number;
    targetX: number;
    targetY: number;
    unitType: UnitType;
  }>>([]);

  // Initialize Demo Hex Grid Data (Empty to show clean tile layout)
  const [gridData, setGridData] = useState<HexTileData[]>([]);
  const gridDataRef = React.useRef(gridData);
  
  useEffect(() => {
    gridDataRef.current = gridData;
  }, [gridData]);

  // Toggle Edit Position Mode
  const handleToggleEditMode = () => {
    setIsEditMode((prev) => {
      const nextState = !prev;
      triggerWarning(nextState ? "🔓 Mode Edit Posisi AKTIF: Bebas tempatkan / pindahkan unit!" : "🔒 Mode Edit Posisi TERKUNCI: Tata letak aman!");
      return nextState;
    });
  };

  // Sync Citadel & Tower counters with gridData
  useEffect(() => {
    const hasCitadel = gridData.some((t) => t.unitType === "CITADEL");
    const towers = gridData.filter((t) => t.unitType === "ARCANE_TOWER").length;
    setCitadelPlaced(hasCitadel);
    setTowerCount(towers);
    setHasBase(hasCitadel);
  }, [gridData]);

  // Real-time Yield Generation Ticker
  useEffect(() => {
    const yieldInterval = setInterval(() => {
      if (stakedPrincipal > 0) {
        setUnclaimedYield((prev) => prev + (stakedPrincipal * 0.0001));
      }
    }, 1000);
    return () => clearInterval(yieldInterval);
  }, [stakedPrincipal]);

  // Battle Mode Loop (MVP Auto-Damage & Movement)
  useEffect(() => {
    if (gameMode !== "RAID" || battleState !== "FIGHTING") return;

    let hasCitadel = false;
    let citadelDead = false;

    const battleInterval = setInterval(() => {
      const prev = gridDataRef.current;
      
      // First, plan movements and find targets
      const targets = prev.filter(t => (t.unitType === "CITADEL" || t.unitType === "ARCANE_TOWER") && t.hp > 0);
      const troops = prev.filter(t => (t.unitType === "ARCANE_MAGE" || t.unitType === "SERAPH_GLIDER") && t.hp > 0);
      
      const newAttacks: any[] = [];
      const occupiedCoords = new Set(prev.filter(t => t.hp > 0).map(t => `${t.x},${t.y}`));

      const newData = prev.map(t => {
        if (t.hp <= 0) return t;

        let damageTaken = 0;
        if (t.unitType === "CITADEL") damageTaken = 1000 / 25; // dies in 25s
        else if (t.unitType === "ARCANE_TOWER") {
          damageTaken = 600 / 20; // dies in 20s
          // Tower counter-attacks closest troop!
          if (troops.length > 0) {
            let closestTroop = troops[0];
            let minDist = Math.abs(t.x - closestTroop.x) + Math.abs(t.y - closestTroop.y);
            for (const trp of troops) {
              const dist = Math.abs(t.x - trp.x) + Math.abs(t.y - trp.y);
              if (dist < minDist) {
                minDist = dist;
                closestTroop = trp;
              }
            }
            newAttacks.push({
              id: `tower-atk-${t.x}-${t.y}-${closestTroop.x}-${closestTroop.y}-${Date.now()}`,
              attackerX: t.x, attackerY: t.y,
              targetX: closestTroop.x, targetY: closestTroop.y,
              unitType: t.unitType
            });
          }
        }
        else if (t.unitType === "ARCANE_MAGE" || t.unitType === "SERAPH_GLIDER") {
          damageTaken = 250 / 30; // troops die in 30s
          
          // Movement Logic for Troops
          if (targets.length > 0) {
            // Find closest target
            let closest = targets[0];
            let minDist = Math.abs(t.x - closest.x) + Math.abs(t.y - closest.y);
            for (const tgt of targets) {
              const dist = Math.abs(t.x - tgt.x) + Math.abs(t.y - tgt.y);
              if (dist < minDist) {
                minDist = dist;
                closest = tgt;
              }
            }

            // Stop 1 block away from target boundary to show ranged attack distance
            const stopDist = closest.unitType === "CITADEL" ? 3 : 2;

            if (minDist > stopDist) {
              const dx = Math.sign(closest.x - t.x);
              const dy = Math.sign(closest.y - t.y);
              
              // Move in X if possible, else Y
              let nextX = t.x + dx;
              let nextY = t.y + dy;
              
              // Try moving and prevent stacking
              if (dx !== 0 && !occupiedCoords.has(`${nextX},${t.y}`)) {
                occupiedCoords.delete(`${t.x},${t.y}`);
                occupiedCoords.add(`${nextX},${t.y}`);
                return { ...t, hp: Math.max(0, t.hp - damageTaken), x: nextX, isHit: true, lastDamage: damageTaken };
              } else if (dy !== 0 && !occupiedCoords.has(`${t.x},${nextY}`)) {
                occupiedCoords.delete(`${t.x},${t.y}`);
                occupiedCoords.add(`${t.x},${nextY}`);
                return { ...t, hp: Math.max(0, t.hp - damageTaken), y: nextY, isHit: true, lastDamage: damageTaken };
              }
            } else {
              // Troop shoots target!
              newAttacks.push({
                id: `troop-atk-${t.x}-${t.y}-${closest.x}-${closest.y}-${t.unitType}-${Date.now()}`,
                attackerX: t.x, attackerY: t.y,
                targetX: closest.x, targetY: closest.y,
                unitType: t.unitType
              });
            }
          }
        }

        const nextHp = Math.max(0, t.hp - damageTaken);
        return { ...t, hp: nextHp, lastDamage: damageTaken, isHit: damageTaken > 0 };
      });

      const citadel = newData.find(t => t.unitType === "CITADEL");
      if (citadel) {
        hasCitadel = true;
        if (citadel.hp <= 0) citadelDead = true;
      }

      // 1. Set the new grid state
      setGridData(newData);
      
      // 2. Set active attacks outside of the gridData setter!
      if (newAttacks.length > 0) {
        setActiveAttacks(newAttacks);
        setTimeout(() => setActiveAttacks([]), 1200);
      }

      // Check Game Over condition inside timeout to let state update
      setTimeout(() => {
        if (hasCitadel && citadelDead && !gameOver) {
          handleGameOver();
        }
      }, 100);

    }, 1500); // Slowed down from 1000ms to 1500ms to allow clearer attack animations

    return () => clearInterval(battleInterval);
  }, [gameMode, battleState, gameOver]);

  const handleStartMatchmaking = () => {
    if (isEditMode) {
      triggerWarning("⚠️ Matikan/Confirm mode EDIT (🔒 EDIT: OFF) terlebih dahulu sebelum mencari lawan!");
      return;
    }
    setIsSearching(true);
    // Reset map: Clear deployed troops and restore building HP
    setGridData(prev => prev.filter(t => t.unitType !== "ARCANE_MAGE" && t.unitType !== "SERAPH_GLIDER").map(t => ({...t, hp: t.maxHp, isHit: false, lastDamage: 0})));

    setTimeout(() => {
      setIsSearching(false);
      setGameMode("RAID");
      setBattleState("DEPLOYING");
      triggerWarning("⚔️ BATTLE STARTED! Deploy your troops!");
    }, 3000);
  };

  const handleGameOver = () => {
    setGameOver({ status: "VICTORY!", yield: 15.5 });
    setTimeout(() => {
      setGameMode("HOME");
      setBattleState("OVER");
      setGameOver(null);
      // Reset map: Clear deployed troops and restore building HP
      setGridData(prev => prev.filter(t => t.unitType !== "ARCANE_MAGE" && t.unitType !== "SERAPH_GLIDER").map(t => ({...t, hp: t.maxHp, isHit: false, lastDamage: 0})));
    }, 4000);
  };

  // Handle Tile Click: Either select tile or place currently selected building
  const handleTileClick = (x: number, y: number) => {
    setSelectedTile({ x, y });

    if ((isEditMode || battleState === "DEPLOYING") && selectedBuildingToDeploy) {
      executeDeployBuilding(selectedBuildingToDeploy, x, y);
    }
  };

  // Get Unit Type at Selected Tile
  const getSelectedTileUnit = (): UnitType => {
    if (!selectedTile) return "NONE";
    const found = gridData.find((t) => t.x === selectedTile.x && t.y === selectedTile.y);
    return found ? found.unitType : "NONE";
  };

  // Claim Faucet Demo Token
  const handleFaucet = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUsdcBalance((prev) => prev + 1000);
      setIsLoading(false);
    }, 400);
  };

  // Deposit USDC
  const handleDeposit = () => {
    if (usdcBalance < 100) return;
    setIsLoading(true);
    setTimeout(() => {
      setUsdcBalance((prev) => prev - 100);
      setStakedPrincipal((prev) => prev + 100);
      setIsLoading(false);
    }, 400);
  };

  // Claim Accrued Yield
  const handleClaimYield = () => {
    if (unclaimedYield <= 0) return;
    setIsLoading(true);
    setTimeout(() => {
      setUsdcBalance((prev) => prev + unclaimedYield);
      setUnclaimedYield(0);
      setIsLoading(false);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.2 } });
    }, 400);
  };

  // Trigger floating warning banner
  const triggerWarning = (msg: string) => {
    setWarningMsg(msg);
    setTimeout(() => {
      setWarningMsg(null);
    }, 3000);
  };

  // Actual execution of building placement
  const executeDeployBuilding = (unitType: UnitType, x: number, y: number) => {
    if (unitType === "CITADEL") {
      if (!isEditMode) return;
      if (citadelPlaced) {
        triggerWarning("⚠️ Citadel (1/1) sudah diletakkan!");
        return;
      }
      // Check 2x2 boundary: top-left (x,y) must allow (x+1, y+1) <= 7
      if (x < 2 || x > 6 || y < 2 || y > 6) {
        triggerWarning("⚠️ Area Citadel (2x2) HARUS muat di DALAM pagar!");
        return;
      }
      // Check 2x2 tile emptiness
      const tilesToCheck = [
        { x, y }, { x: x + 1, y }, { x, y: y + 1 }, { x: x + 1, y: y + 1 }
      ];
      const isOccupied = gridData.some((t) =>
        tilesToCheck.some((c) => c.x === t.x && c.y === t.y && t.unitType !== "NONE")
      );
      if (isOccupied) {
        triggerWarning("⚠️ Area (2x2) bertabrakan dengan bangunan lain!");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setGridData((prev) => [
          ...prev.filter((t) => !tilesToCheck.some((c) => c.x === t.x && c.y === t.y)),
          { x, y, owner: "0xPlayer", unitType: "CITADEL", hp: 1000, maxHp: 1000 },
        ]);
        setSelectedBuildingToDeploy(null);
        setIsLoading(false);
        triggerWarning(`✅ Base Citadel (2x2) berhasil diletakkan di (${x}, ${y})!`);
      }, 300);

    } else if (unitType === "ARCANE_TOWER") {
      if (!isEditMode) return;
      if (towerCount >= 3) {
        triggerWarning("⚠️ Batas maksimal Tower (3/3) telah dicapai!");
        return;
      }
      if (x < 2 || x > 7 || y < 2 || y > 7) {
        triggerWarning("⚠️ Tower HARUS diletakkan di DALAM pagar!");
        return;
      }
      const isOccupied = gridData.some((t) => t.x === x && t.y === y && t.unitType !== "NONE");
      if (isOccupied) {
        triggerWarning("⚠️ Petak ini sudah terisi!");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setGridData((prev) => [
          ...prev.filter((t) => !(t.x === x && t.y === y)),
          { x, y, owner: "0xPlayer", unitType: "ARCANE_TOWER", hp: 600, maxHp: 600 },
        ]);
        setSelectedBuildingToDeploy(null);
        setIsLoading(false);
        triggerWarning(`✅ Arcane Tower berhasil diletakkan di (${x}, ${y})!`);
      }, 300);
    } else if (unitType === "ARCANE_MAGE" || unitType === "SERAPH_GLIDER") {
      if (gameMode !== "RAID" || battleState !== "DEPLOYING") return;
      
      const mCount = gridData.filter(t => t.unitType === "ARCANE_MAGE").length;
      const gCount = gridData.filter(t => t.unitType === "SERAPH_GLIDER").length;

      if (unitType === "ARCANE_MAGE" && mCount >= 3) {
        triggerWarning("⚠️ Batas peleton Arcane Mage (3/3) telah dicapai!");
        return;
      }
      if (unitType === "SERAPH_GLIDER" && gCount >= 3) {
        triggerWarning("⚠️ Batas peleton Seraph Glider (3/3) telah dicapai!");
        return;
      }

      if (x >= 2 && x <= 7 && y >= 2 && y <= 7) {
        triggerWarning("⚠️ Pasukan harus diletakkan di area LUAR pagar!");
        return;
      }

      const isOccupied = gridData.some((t) => t.x === x && t.y === y && t.unitType !== "NONE");
      if (isOccupied) {
        triggerWarning("⚠️ Petak ini sudah terisi bangunan/pasukan lain!");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setGridData((prev) => [
          ...prev.filter((t) => !(t.x === x && t.y === y)),
          { x, y, owner: "0xPlayer", unitType, hp: 250, maxHp: 250 },
        ]);
        setSelectedBuildingToDeploy(null);
        setIsLoading(false);
        triggerWarning(`⚔️ ${unitType.replace('_', ' ')} dikerahkan!`);
      }, 200);
    }
  };

  const handleDeployUnit = (unitType: UnitType) => {
    if (!selectedTile) return;
    executeDeployBuilding(unitType, selectedTile.x, selectedTile.y);
  };

  // Execute Attack Raid
  const handleAttack = () => {
    if (battleState !== "DEPLOYING") {
      triggerWarning("⚠️ Tidak dapat memulai serangan saat ini!");
      return;
    }
    
    setBattleState("FIGHTING");
    triggerWarning("🔥 MENYERANG BASE! TROOPS BERGERAK OTOMATIS!");
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Background Video (HD Cinematic Loop) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-90 mix-blend-screen"
      >
        <source src="/assets/video/bg_video.mp4" type="video/mp4" />
      </video>

      {/* Background Ambient Glows */}
      <div className="absolute z-0 top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none mix-blend-screen" />
      <div className="absolute z-0 bottom-10 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none mix-blend-screen" />

      {/* Bottom Floating Command Bar (HUD) */}
      <HUD
        gameMode={gameMode}
        battleState={battleState}
        isEditMode={isEditMode}
        selectedTile={selectedTile}
        selectedTileUnit={getSelectedTileUnit()}
        usdcBalance={usdcBalance}
        stakedPrincipal={stakedPrincipal}
        unclaimedYield={unclaimedYield}
        hasBase={hasBase}
        citadelPlaced={citadelPlaced}
        towerCount={towerCount}
        warningMsg={warningMsg}
        mageCount={gridData.filter(t => t.unitType === "ARCANE_MAGE").length}
        gliderCount={gridData.filter(t => t.unitType === "SERAPH_GLIDER").length}
        onSetGameMode={(mode) => mode === "RAID" ? handleStartMatchmaking() : setGameMode(mode)}
        onToggleEditMode={() => setIsEditMode((prev) => !prev)}
        onFaucetClick={handleFaucet}
        onDepositClick={handleDeposit}
        onClaimYieldClick={handleClaimYield}
        onDeployUnit={handleDeployUnit}
        onAttackClick={() => setBattleState("FIGHTING")}
        onTriggerWarning={triggerWarning}
        isLoading={isLoading}
        selectedBuildingToDeploy={selectedBuildingToDeploy}
        onSelectBuildingToDeploy={setSelectedBuildingToDeploy}
      />

      {/* Center Hex Grid Canvas */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-auto">
        <HexGrid
          gridData={gridData}
          selectedTile={selectedTile}
          onTileClick={handleTileClick}
          activeAttacks={activeAttacks}
          isEditMode={isEditMode}
          gameMode={gameMode}
          selectedBuildingToDeploy={selectedBuildingToDeploy}
          onSelectBuildingToDeploy={setSelectedBuildingToDeploy}
        />
      </div>

      {/* MATCHMAKING OVERLAY */}
      {isSearching && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <div className="w-16 h-16 border-2 border-cyan-500 border-t-transparent animate-spin mb-8" />
          <h2 className="text-3xl font-bold text-white tracking-widest uppercase font-mono">
            SEARCHING FOR OPPONENT...
          </h2>
        </div>
      )}

      {/* GAME OVER OVERLAY */}
      {gameOver && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <h1 className="text-6xl font-bold text-amber-500 mb-6 uppercase tracking-widest">
            {gameOver.status}
          </h1>
          <p className="text-xl text-gray-300 font-bold mb-10 uppercase tracking-widest">
            Loot Stolen: <span className="text-emerald-400">+{gameOver.yield.toFixed(2)} MON</span>
          </p>
          <div className="text-cyan-500 font-mono text-sm uppercase tracking-widest">
            Returning to Home Base...
          </div>
        </div>
      )}
    </main>
  );
}
