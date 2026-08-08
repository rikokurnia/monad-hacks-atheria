"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import anime from "animejs";

export type UnitType = "NONE" | "CITADEL" | "ARCANE_TOWER" | "CRYSTAL_BARRICADE" | "ARCANE_MAGE" | "SERAPH_GLIDER";

export interface HexTileData {
  x: number;
  y: number;
  owner: string | null;
  unitType: UnitType;
  hp: number;
  maxHp: number;
  isBaseTile?: boolean;
  lastDamage?: number;
  isHit?: boolean;
}

export interface HexGridProps {
  gridSize?: number;
  gridData: HexTileData[];
  selectedTile: { x: number; y: number } | null;
  onTileClick: (x: number, y: number) => void;
  isEditMode?: boolean;
  gameMode?: "HOME" | "RAID";
  activeAttacks?: Array<{
    id?: string;
    attackerX: number;
    attackerY: number;
    targetX: number;
    targetY: number;
    unitType: UnitType;
  }>;
  selectedBuildingToDeploy?: UnitType | null;
  onSelectBuildingToDeploy?: (unitType: UnitType | null) => void;
}

// Floating Yield Coins Animation Component for Citadel (top of file so React reference remains stable across re-renders)
const FloatingCitadelCoins: React.FC = () => {
  const coins = [
    { src: "/assets/effects/coinbtc.png", delay: 0 },
    { src: "/assets/effects/coineth.png", delay: 1.2 },
    { src: "/assets/effects/cointhether.png", delay: 2.4 },
  ];

  return (
    <div className="absolute -top-[75px] left-1/2 -translate-x-1/2 pointer-events-none z-[100] w-10 h-10 flex justify-center items-center">
      {coins.map((coin, index) => (
        <motion.img
          key={index}
          src={coin.src}
          className="absolute w-9 h-9 object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.9)] brightness-125"
          initial={{ opacity: 0, y: 10, scale: 0.5 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [0, -25, -50],
            scale: [0.6, 1.25, 1, 0.6],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            delay: coin.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export const HexGrid: React.FC<HexGridProps> = (props) => {
  const {
    gridSize = 10,
    gridData,
    selectedTile,
    onTileClick,
    isEditMode = false,
    gameMode = "HOME",
    activeAttacks = [],
    selectedBuildingToDeploy = null,
    onSelectBuildingToDeploy,
  } = props;

  const [spriteToggle, setSpriteToggle] = useState<boolean>(false);
  const [hoveredTile, setHoveredTile] = useState<{ x: number, y: number } | null>(null);

  // Toggle sprite frame for live troop walking animation every 600ms
  useEffect(() => {
    const interval = setInterval(() => {
      setSpriteToggle((prev) => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const getTileData = (x: number, y: number): HexTileData => {
    const found = gridData.find((t) => t.x === x && t.y === y);
    return (
      found || {
        x,
        y,
        owner: null,
        unitType: "NONE",
        hp: 0,
        maxHp: 0,
        isBaseTile: x >= 3 && x <= 6 && y >= 3 && y <= 6,
      }
    );
  };

  // Helper to check if a tile is occupied by a Citadel's 2x2 footprint
  const getOccupyingCitadel = (x: number, y: number) => {
    return gridData.find(
      (t) =>
        t.unitType === "CITADEL" &&
        ((t.x === x && t.y === y) ||
         (t.x === x - 1 && t.y === y) ||
         (t.x === x && t.y === y - 1) ||
         (t.x === x - 1 && t.y === y - 1))
    );
  };

  const renderUnitSprite = (unitType: UnitType, isAttacking: boolean, colIndex: number = 0, rowIndex: number = 0) => {
    const isGrassTile = colIndex >= 3 && colIndex <= 6 && rowIndex >= 3 && rowIndex <= 6;

    switch (unitType) {
      case "CITADEL":
        return (
          <img 
            src="/assets/buildings/citadel_vault.png" 
            className="absolute pointer-events-none drop-shadow-2xl object-contain max-w-none max-h-none" 
            style={{ width: "170px", height: "170px", bottom: isGrassTile ? "-45px" : "-52px", left: "50%", transform: "translateX(-50%)" }} 
            alt="Citadel" 
          />
        );
      case "ARCANE_TOWER":
        return (
          <img 
            src="/assets/buildings/tower.png" 
            className="absolute pointer-events-none drop-shadow-xl object-contain max-w-none max-h-none" 
            style={{ width: "80px", height: "120px", bottom: isGrassTile ? "42px" : "33px", left: "50%", transform: "translateX(-50%)" }} 
            alt="Tower" 
          />
        );
      case "CRYSTAL_BARRICADE":
        return (
          <div className="absolute w-9 h-9 rounded bg-blue-400/50 border border-cyan-300 shadow-[0_0_10px_#00F0FF] flex items-center justify-center text-base z-10 backdrop-blur-sm"
               style={{ bottom: "15px", left: "50%", transform: "translateX(-50%)" }}>
            🛡️
          </div>
        );
      case "ARCANE_MAGE":
        return (
          <img 
            src={isAttacking ? "/assets/units/unit_arcane_mage2.png" : (spriteToggle ? "/assets/units/unit_arcane_mage1.png" : "/assets/units/unit_arcane_mage1.png")} 
            className={`absolute pointer-events-none drop-shadow-lg object-contain max-w-none max-h-none ${spriteToggle && !isAttacking ? "-translate-y-1" : ""}`} 
            style={{ width: "75px", height: "75px", bottom: "15px", left: "50%", transform: "translateX(-50%)" }} 
            alt="Arcane Mage" 
          />
        );
      case "SERAPH_GLIDER":
        return (
          <img 
            src={isAttacking ? "/assets/units/unitserapguilder2.png" : (spriteToggle ? "/assets/units/unitserapguilder1.png" : "/assets/units/unitserapguilder1.png")} 
            className={`absolute pointer-events-none drop-shadow-lg object-contain max-w-none max-h-none ${spriteToggle && !isAttacking ? "-translate-y-2" : ""}`} 
            style={{ width: "85px", height: "85px", bottom: "25px", left: "50%", transform: "translateX(-50%)" }} 
            alt="Seraph Glider" 
          />
        );
      default:
        return null;
    }
  };

  // Get dynamic projectile image based on attacker
  const renderProjectile = (unitType: UnitType) => {
    switch (unitType) {
      case "ARCANE_TOWER":
        return (
          <div className="relative flex items-center justify-center w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-cyan-400/50 blur-lg animate-pulse" />
            <img src="/assets/effects/lasertower.png" className="w-full h-full object-contain rotate-90 brightness-150 relative z-10" alt="Tower Laser" />
          </div>
        );
      case "ARCANE_MAGE":
        return (
          <div className="relative flex items-center justify-center w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-amber-400/50 blur-lg animate-pulse" />
            <img src="/assets/effects/bolamage.png" className="w-full h-full object-contain brightness-150 relative z-10" alt="Mage Orb" />
          </div>
        );
      case "SERAPH_GLIDER":
        return (
          <div className="relative flex items-center justify-center w-40 h-20">
            <div className="absolute inset-0 rounded-full bg-sky-300/50 blur-lg animate-pulse" />
            <img src="/assets/effects/laser_seraph_guilder.png" className="w-full h-full object-contain rotate-45 brightness-150 relative z-10" alt="Glider Spear" />
          </div>
        );
      default:
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full bg-cyan-400 blur-sm animate-ping" />
            <div className="bg-cyan-300 shadow-[0_0_20px_#00F0FF] h-6 w-6 rounded-full relative z-10" />
          </div>
        );
    }
  };

  // TRUE ISOMETRIC MATH CONSTANTS
  const ISO_W_HALF = 56; // Horizontal spacing step (widened for clear gaps)
  const ISO_H_HALF = 32; // Vertical spacing step (widened for clear gaps)
  
  const getIsoPos = (x: number, y: number) => ({
    left: (x - y) * ISO_W_HALF,
    top: (x + y) * ISO_H_HALF,
  });

  // Framer Motion Projectile Component
  const Projectile = ({ attack, getIsoPos }: any) => {
    const startPos = getIsoPos(attack.attackerX, attack.attackerY);
    const endPos = getIsoPos(attack.targetX, attack.targetY);

    let src = "/assets/effects/efekserangforkarakter.png";
    let width = "w-32";
    let height = "h-32";
    let rotate = 0;
    
    if (attack.unitType === "ARCANE_TOWER") {
      src = "/assets/effects/lasertower.png";
      width = "w-40";
      height = "h-40";
      rotate = 90;
    } else if (attack.unitType === "ARCANE_MAGE") {
      src = "/assets/effects/bolamage.png";
      width = "w-32";
      height = "h-32";
      rotate = 0;
    } else if (attack.unitType === "SERAPH_GLIDER") {
      src = "/assets/effects/laser_seraph_guilder.png";
      width = "w-40";
      height = "h-20";
      rotate = 45;
    }

    return (
      <motion.div
        className="absolute top-0 left-0 z-[999] pointer-events-none"
        initial={{ x: startPos.left, y: startPos.top - 20, scale: 0.5, opacity: 0 }}
        animate={{ x: endPos.left, y: endPos.top - 20, scale: [0.5, 2, 1.5], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
           <img 
             src={src} 
             className={`${width} ${height} object-contain brightness-150 drop-shadow-[0_0_20px_#00E5FF]`} 
             style={{ transform: `rotate(${rotate}deg)` }}
             alt="projectile" 
           />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-8 px-4 flex justify-center items-center overflow-hidden h-[850px]">
      {/* 2D Isometric Map Container (No 3D CSS Hacks) */}
      <div className="relative w-0 h-0" style={{ transform: "translate(0px, -270px) scale(1.05)" }}>
        {Array.from({ length: gridSize }).map((_, rowIndex) =>
          Array.from({ length: gridSize }).map((_, colIndex) => {
            const tile = getTileData(colIndex, rowIndex);
            const isSelected = selectedTile?.x === colIndex && selectedTile?.y === rowIndex;
            const isAttacking = activeAttacks.some(a => a.attackerX === colIndex && a.attackerY === rowIndex);
            const isTarget = activeAttacks.some(a => a.targetX === colIndex && a.targetY === rowIndex);
            
            // Layer Ring Logic:
            let tileSrc = "/assets/tiles/tilegrass2.png";

            // Ring 0: Outer edge (1 tile before fence) -> tilegrass1.png
            if (colIndex === 0 || rowIndex === 0 || colIndex === 9 || rowIndex === 9) {
              tileSrc = "/assets/tiles/tilegrass1.png";
            } 
            // Ring 1: Fence Ring (Index 1 and Index 8)
            else if (colIndex === 1 && rowIndex >= 1 && rowIndex <= 8) {
              tileSrc = "/assets/tiles/tile_fence_nw.png";
            } else if (rowIndex === 1 && colIndex >= 1 && colIndex <= 8) {
              tileSrc = "/assets/tiles/tile_fence_ne.png";
            } else if (rowIndex === 8 && colIndex >= 1 && colIndex <= 8) {
              tileSrc = "/assets/tiles/tile_fence_sw.png";
            } else if (colIndex === 8 && rowIndex >= 1 && rowIndex <= 8) {
              tileSrc = "/assets/tiles/tile_fence_se.png";
            }
            // Ring 2: 1 tile inside fence (Index 2 and Index 7) -> tile_marble1.png
            else if (colIndex === 2 || rowIndex === 2 || colIndex === 7 || rowIndex === 7) {
              tileSrc = "/assets/tiles/tile_marble1.png";
            }
            // Ring 3..6: Inner center area -> tilegrass2.png
            else {
              tileSrc = "/assets/tiles/tilegrass2.png";
            }

            // Hover & Placement Preview Logic
            let isHovered = false;
            let hoverColor = "cyan"; // 'cyan' or 'red'
            
            const occupyingCitadel = getOccupyingCitadel(colIndex, rowIndex);
            
            if (isEditMode && hoveredTile) {
              if (selectedBuildingToDeploy === "CITADEL") {
                // User clicked Citadel button in HUD -> 4-tile placement preview
                const hx = hoveredTile.x;
                const hy = hoveredTile.y;
                // Check if current tile (colIndex, rowIndex) falls in the 2x2 footprint of hoveredTile
                if (
                  (colIndex === hx && rowIndex === hy) ||
                  (colIndex === hx + 1 && rowIndex === hy) ||
                  (colIndex === hx && rowIndex === hy + 1) ||
                  (colIndex === hx + 1 && rowIndex === hy + 1)
                ) {
                  isHovered = true;
                  // Validity check for 2x2 Citadel placement:
                  // All 4 tiles must be inside fence (2 to 7) and empty
                  const isValidArea =
                    hx >= 2 && hx <= 6 && hy >= 2 && hy <= 6 &&
                    [
                      getTileData(hx, hy),
                      getTileData(hx + 1, hy),
                      getTileData(hx, hy + 1),
                      getTileData(hx + 1, hy + 1),
                    ].every((t) => t.unitType === "NONE");

                  hoverColor = isValidArea ? "cyan" : "red";
                }
              } else if (selectedBuildingToDeploy === "ARCANE_TOWER") {
                // User clicked Tower button in HUD -> 1-tile placement preview
                if (colIndex === hoveredTile.x && rowIndex === hoveredTile.y) {
                  isHovered = true;
                  const isValid =
                    colIndex >= 2 && colIndex <= 7 &&
                    rowIndex >= 2 && rowIndex <= 7 &&
                    tile.unitType === "NONE";
                  hoverColor = isValid ? "cyan" : "red";
                }
              } else {
                // No building selected in HUD: Normal hover / inspect mode
                const hCitadel = getOccupyingCitadel(hoveredTile.x, hoveredTile.y);
                if (hCitadel) {
                  if (occupyingCitadel && occupyingCitadel.x === hCitadel.x && occupyingCitadel.y === hCitadel.y) {
                    isHovered = true;
                    hoverColor = "cyan";
                  }
                } else if (colIndex === hoveredTile.x && rowIndex === hoveredTile.y) {
                  isHovered = true;
                  hoverColor = tile.unitType !== "NONE" ? "red" : "cyan";
                }
              }
            }

            // Calculate exact isometric position
            const pos = getIsoPos(colIndex, rowIndex);
            // Z-Index calculation: strictly preserve isometric depth order.
            // Citadel spans 2x2, so its bottom reaches (colIndex+1, rowIndex+1).
            // Give it +3 so it draws over ground tile (colIndex+1, rowIndex+1) [which is +2], but under tile (colIndex+2, rowIndex+2) [which is +4].
            const zIndex = colIndex + rowIndex + (tile.unitType === "CITADEL" ? 3 : 0);

            return (
              <div
                key={`tile-${colIndex}-${rowIndex}`}
                className={`absolute flex flex-col items-center justify-center pointer-events-none group`}
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: 90,
                  height: 100,
                  transform: "translate(-50%, -50%)", // Center anchor point
                  zIndex: zIndex,
                }}
                onMouseEnter={() => setHoveredTile({ x: colIndex, y: rowIndex })}
                onMouseLeave={() => setHoveredTile(null)}
              >
                {/* Tile Base Image - Glow & Hover active in Edit Mode */}
                <motion.img 
                  src={tileSrc} 
                  animate={{ 
                    y: isHovered && isEditMode ? -6 : 0 
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-[90px] h-[100px] object-contain pointer-events-none transition-all duration-300 ${
                    isEditMode
                      ? isSelected 
                        ? "brightness-125 saturate-150 drop-shadow-[0_0_20px_rgba(0,240,255,0.9)]" 
                        : isHovered
                          ? hoverColor === "red" 
                            ? "brightness-110 hue-rotate-15 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]"
                            : "brightness-110 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]"
                          : "brightness-95"
                      : "brightness-100"
                  } ${isTarget ? "brightness-110 hue-rotate-15 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]" : ""}`} 
                  alt="Hex Tile"
                />

                {/* Clickable Hitbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isEditMode || gameMode === "RAID") onTileClick(colIndex, rowIndex);
                  }}
                  className={`absolute w-[56px] h-[48px] rounded-full pointer-events-auto focus:outline-none transition-colors ${
                    (isEditMode || gameMode === "RAID") ? "cursor-pointer hover:bg-cyan-400/20" : "cursor-default bg-transparent"
                  }`}
                  style={{ top: "35%", left: "50%", transform: "translate(-50%, -50%)" }}
                  title={`Tile (${colIndex}, ${rowIndex})`}
                />

                {/* Coordinate Tooltip - Edit Mode Only */}
                {isEditMode && (
                  <span className={`absolute -top-4 text-[10px] font-mono font-bold text-white bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-md border border-white/30 pointer-events-none transition-opacity duration-200 shadow-lg ${isSelected ? "opacity-100 z-50" : "opacity-0 group-hover:opacity-100"}`}>
                    {colIndex},{rowIndex}
                  </span>
                )}

                {/* Unit Display Container */}
                {tile.unitType !== "NONE" && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Floating Yield Coins Effect for Citadel */}
                    {tile.unitType === "CITADEL" && (
                      <FloatingCitadelCoins />
                    )}

                    {tile.hp > 0 ? (
                      <>
                        {(gameMode === "RAID" || (tile.unitType !== "ARCANE_MAGE" && tile.unitType !== "SERAPH_GLIDER")) && 
                          renderUnitSprite(tile.unitType, isAttacking, colIndex, rowIndex)}

                        {/* Floating Overhead HP Bar for all Units & Buildings */}
                        {tile.maxHp > 0 && (
                          <div 
                            className="absolute left-1/2 -translate-x-1/2 w-14 h-2.5 bg-black/85 rounded-full p-0.5 border border-white/60 shadow-[0_0_12px_rgba(0,0,0,0.9)] backdrop-blur-md z-40 pointer-events-none"
                            style={{
                              top: tile.unitType === "CITADEL" ? "-35px" : tile.unitType === "ARCANE_TOWER" ? "-45px" : "-20px"
                            }}
                          >
                            <div className="w-full h-full bg-slate-950 rounded-full overflow-hidden relative">
                              <div
                                className={`h-full transition-all duration-300 rounded-full ${
                                  tile.hp / tile.maxHp > 0.5 
                                    ? "bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_8px_#34D399]" 
                                    : tile.hp / tile.maxHp > 0.25 
                                      ? "bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_8px_#F59E0B]"
                                      : "bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_8px_#EF4444]"
                                }`}
                                style={{ width: `${Math.max(0, (tile.hp / tile.maxHp) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* Floating Damage Text */}
                        <AnimatePresence>
                          {tile.isHit && tile.lastDamage && tile.lastDamage > 0 && (
                            <motion.div
                              key={`dmg-${tile.hp}`}
                              initial={{ opacity: 0, y: 0, scale: 0.5 }}
                              animate={{ opacity: [0, 1, 0], y: -30, scale: [0.5, 1.2, 1] }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8 }}
                              className="absolute bottom-[30px] left-1/2 -translate-x-1/2 text-yellow-400 font-black text-sm z-50 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] pointer-events-none"
                            >
                              -{Math.round(tile.lastDamage)}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Hit Explosion Overlay */}
                        <AnimatePresence>
                          {tile.isHit && (
                            <motion.img
                              key={`hit-${tile.hp}`}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 1.6] }}
                              transition={{ duration: 0.4 }}
                              src={
                                tile.unitType === "CITADEL" || tile.unitType === "ARCANE_TOWER"
                                  ? "/assets/effects/efek_ledakanfortower2.png"
                                  : "/assets/effects/efek_ledakanforkarakter.png"
                              }
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 object-contain mix-blend-screen pointer-events-none z-40"
                            />
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <motion.img 
                         initial={{ opacity: 1, scale: 0.5 }}
                         animate={{ opacity: 0, scale: 2 }}
                         transition={{ duration: 1.5, ease: "easeOut" }}
                         src={
                           tile.unitType === "CITADEL" || tile.unitType === "ARCANE_TOWER" 
                           ? "/assets/effects/efek_ledakanfortower1.png" 
                           : "/assets/effects/efek_ledakanforkarakter.png"
                         }
                         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 object-contain mix-blend-screen pointer-events-none z-50"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Dynamic Projectile Animation via anime.js */}
        <div className="absolute inset-0 pointer-events-none z-[100]">
          {activeAttacks.map((attack, i) => (
            <Projectile
              key={attack.id || `proj-${attack.attackerX}-${attack.attackerY}-${attack.targetX}-${attack.targetY}-${i}`}
              attack={attack}
              getIsoPos={getIsoPos}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
