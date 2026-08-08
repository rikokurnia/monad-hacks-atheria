"use client";

import React from "react";
import { UnitType } from "../game/HexGrid";
import { Coins, ShieldCheck, Zap, Sword, Sparkles, RefreshCw, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HUDProps {
  usdcBalance: number;
  stakedPrincipal: number;
  unclaimedYield: number;
  selectedTile: { x: number; y: number } | null;
  selectedTileUnit: UnitType;
  hasBase: boolean;
  citadelPlaced: boolean;
  towerCount: number;
  warningMsg: string | null;
  isEditMode: boolean;
  gameMode: "HOME" | "RAID";
  battleState?: string;
  onSetGameMode: (mode: "HOME" | "RAID") => void;
  onToggleEditMode: () => void;
  onFaucetClick: () => void;
  onDepositClick?: () => void;
  onClaimYieldClick?: () => void;
  onDeployUnit: (unitType: UnitType) => void;
  onAttackClick?: () => void;
  isLoading: boolean;
  selectedBuildingToDeploy?: UnitType | null;
  onSelectBuildingToDeploy?: (unitType: UnitType | null) => void;
  onTriggerWarning?: (msg: string) => void;
  mageCount?: number;
  gliderCount?: number;
}

export const HUD: React.FC<HUDProps> = ({
  usdcBalance,
  stakedPrincipal,
  unclaimedYield,
  selectedTile,
  selectedTileUnit,
  hasBase,
  citadelPlaced,
  towerCount,
  warningMsg,
  isEditMode,
  gameMode,
  battleState,
  onSetGameMode,
  onToggleEditMode,
  onFaucetClick,
  onDepositClick,
  onClaimYieldClick,
  onDeployUnit,
  onAttackClick,
  isLoading,
  selectedBuildingToDeploy = null,
  onSelectBuildingToDeploy,
  onTriggerWarning,
  mageCount = 0,
  gliderCount = 0,
}) => {
  const isInsideFence = selectedTile ? selectedTile.x >= 2 && selectedTile.x <= 7 && selectedTile.y >= 2 && selectedTile.y <= 7 : false;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 p-6 overflow-hidden">
      
      {/* Top Left: Branding & Action (Floating) */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 flex flex-col gap-3 pointer-events-auto"
      >
        <div className="flex items-center gap-3 bg-black/90 border border-white/20 p-3 rounded-sm">
          <div className="w-10 h-10 rounded-sm bg-cyan-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div className="pr-2">
            <h1 className="text-lg font-bold text-white tracking-wide uppercase">
              ATHERIA <span className="text-cyan-400">YIELD WARS</span>
            </h1>
            <div className="flex items-center gap-1 text-[10px] font-medium text-cyan-200 uppercase tracking-widest mt-0.5">
              <ShieldCheck className="w-3 h-3" />
              <span>Monad 400ms Parallel EVM</span>
            </div>
          </div>
        </div>

        {gameMode === "HOME" ? (
          <button
            onClick={onFaucetClick}
            disabled={isLoading}
            className="self-start px-4 py-2 text-xs font-bold rounded-sm bg-white text-black hover:bg-gray-200 border border-white transition-all flex items-center gap-2 active:scale-95 uppercase tracking-wide"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Faucet $1K</span>
          </button>
        ) : (
          <button
            onClick={() => onSetGameMode("HOME")}
            disabled={isLoading}
            className="self-start px-4 py-2 text-xs font-bold rounded-sm bg-red-600 hover:bg-red-500 text-white border border-red-500 transition-all flex items-center gap-2 active:scale-95 uppercase tracking-wide"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Surrender</span>
          </button>
        )}
      </motion.div>

      {/* Top Right: Resources (Floating Stack) */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 right-6 flex flex-col items-end gap-2 pointer-events-auto"
      >
        <div className="flex items-center gap-3 bg-black/90 border border-white/10 px-4 py-2 rounded-sm w-48 justify-between">
          <Coins className="w-4 h-4 text-emerald-400" />
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">USDC Wallet</span>
            <span className="text-sm font-bold font-mono text-white">
              ${usdcBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/90 border border-white/10 px-4 py-2 rounded-sm w-48 justify-between">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Staked Principal</span>
            <span className="text-sm font-bold font-mono text-white">
              ${stakedPrincipal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/90 border border-amber-500/30 px-4 py-2 rounded-sm w-48 justify-between">
          <Zap className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">{gameMode === 'HOME' ? 'Unclaimed Yield' : 'Available Loot'}</span>
            <span className="text-sm font-bold font-mono text-white">
              +${(gameMode === 'RAID' ? 5.000 : unclaimedYield).toFixed(4)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Floating Warning Center Top */}
      <AnimatePresence>
        {warningMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-auto bg-black text-white px-6 py-3 rounded-sm border border-cyan-400 text-xs font-bold font-mono tracking-wide"
          >
            {warningMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls based on Mode */}
      <AnimatePresence mode="wait">
        {gameMode === "HOME" ? (
          <motion.div 
            key="home-hud"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none"
          >
            {/* Left: Build Tools */}
            <div className="flex flex-col gap-3 pointer-events-auto">
              <button
                onClick={onToggleEditMode}
                className={`self-start px-4 py-2.5 rounded-sm text-xs font-bold transition-all flex items-center gap-2 border uppercase tracking-wider ${
                  isEditMode
                    ? "bg-emerald-950 text-emerald-400 border-emerald-500"
                    : "bg-black/90 text-gray-400 border-white/20"
                }`}
              >
                <span>{isEditMode ? "🔓 EDIT: ON" : "🔒 EDIT: OFF"}</span>
              </button>

              <AnimatePresence>
                {isEditMode && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="flex gap-3 bg-black/90 p-4 rounded-sm border border-white/20"
                  >
                    {/* Citadel Card */}
                    <button
                      onClick={() => onSelectBuildingToDeploy?.(selectedBuildingToDeploy === "CITADEL" ? null : "CITADEL")}
                      disabled={isLoading || citadelPlaced}
                      className={`relative group w-28 h-36 rounded-sm bg-gray-900 border-2 transition-all flex flex-col items-center justify-end pb-3 active:scale-95 disabled:opacity-40 overflow-hidden ${
                        selectedBuildingToDeploy === "CITADEL"
                          ? "border-cyan-400"
                          : "border-gray-700 hover:border-cyan-400"
                      }`}
                    >
                      <img
                        src="/assets/buildings/citadel_vault.png"
                        className={`absolute top-2 w-20 h-20 object-contain transition-transform ${
                          selectedBuildingToDeploy === "CITADEL" ? "scale-110" : "group-hover:scale-110"
                        }`}
                        alt="Citadel"
                      />
                      <div className="flex flex-col items-center z-10">
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${selectedBuildingToDeploy === "CITADEL" ? "text-cyan-400" : "text-white"}`}>
                          Citadel
                        </span>
                        <span className="text-[9px] font-mono text-gray-400">
                          {citadelPlaced ? "(1/1)" : selectedBuildingToDeploy === "CITADEL" ? "SELECTED" : "(0/1)"}
                        </span>
                      </div>
                    </button>

                    {/* Tower Card */}
                    <button
                      onClick={() => onSelectBuildingToDeploy?.(selectedBuildingToDeploy === "ARCANE_TOWER" ? null : "ARCANE_TOWER")}
                      disabled={isLoading || towerCount >= 3}
                      className={`relative group w-28 h-36 rounded-sm bg-gray-900 border-2 transition-all flex flex-col items-center justify-end pb-3 active:scale-95 disabled:opacity-40 overflow-hidden ${
                        selectedBuildingToDeploy === "ARCANE_TOWER"
                          ? "border-cyan-400"
                          : "border-gray-700 hover:border-cyan-400"
                      }`}
                    >
                      <img
                        src="/assets/buildings/tower.png"
                        className={`absolute top-2 w-16 h-20 object-contain transition-transform ${
                          selectedBuildingToDeploy === "ARCANE_TOWER" ? "scale-110" : "group-hover:scale-110"
                        }`}
                        alt="Tower"
                      />
                      <div className="flex flex-col items-center z-10">
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${selectedBuildingToDeploy === "ARCANE_TOWER" ? "text-cyan-400" : "text-white"}`}>
                          Tower
                        </span>
                        <span className="text-[9px] font-mono text-gray-400">
                          {towerCount >= 3 ? "(3/3)" : selectedBuildingToDeploy === "ARCANE_TOWER" ? "SELECTED" : `(${towerCount}/3)`}
                        </span>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Center: Selected Tile Info */}
            <div className="flex flex-col items-center gap-2 mb-2 pointer-events-auto">
              {isEditMode && (
                <div className="bg-black/90 border border-white/20 px-6 py-2 rounded-sm flex items-center gap-4">
                  <div className="text-cyan-400 font-mono font-bold text-sm">
                    {selectedTile ? `(${selectedTile.x},${selectedTile.y})` : "(-,-)"}
                  </div>
                  <div className="w-px h-4 bg-white/20" />
                  <div className="text-white text-xs font-bold uppercase tracking-wider">
                    {selectedTile ? selectedTileUnit : "SELECT TILE"}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col gap-3 items-end pointer-events-auto">
              <div className="flex gap-2">
                <button
                  onClick={onDepositClick}
                  disabled={isLoading}
                  className="px-5 py-3 rounded-sm bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-widest border border-cyan-400 transition-all active:scale-95"
                >
                  Stake USDC
                </button>
                <button
                  onClick={onClaimYieldClick}
                  disabled={isLoading || unclaimedYield <= 0}
                  className="px-5 py-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest border border-amber-400 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                  Claim Yield
                </button>
              </div>

              <button
                onClick={() => {
                  if (isEditMode) {
                    onTriggerWarning?.("⚠️ Matikan/Confirm mode EDIT (🔒 EDIT: OFF) terlebih dahulu sebelum mencari lawan!");
                    return;
                  }
                  onSetGameMode("RAID");
                }}
                disabled={isLoading}
                className={`mt-2 w-full px-6 py-4 rounded-sm text-white text-sm font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${
                  isEditMode 
                    ? "bg-gray-800 border-gray-600 cursor-not-allowed opacity-60" 
                    : "bg-red-600 hover:bg-red-500 border-red-500 active:scale-95 shadow-lg shadow-red-950/40"
                }`}
              >
                <Sword className="w-5 h-5" />
                <span>{isEditMode ? "LOCK EDIT TO FIGHT" : "Find Match"}</span>
              </button>
            </div>

          </motion.div>
        ) : (
          <motion.div 
            key="raid-hud"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="absolute bottom-6 left-6 flex flex-col items-start gap-3 pointer-events-none"
          >
            {/* Troop Deck (Left Side) */}
            <div className="flex gap-3 pointer-events-auto bg-black/90 p-4 rounded-sm border border-white/20">
              <button
                onClick={() => onSelectBuildingToDeploy?.(selectedBuildingToDeploy === "ARCANE_MAGE" ? null : "ARCANE_MAGE")}
                disabled={isLoading || (mageCount ?? 0) >= 3}
                className={`relative group w-28 h-36 rounded-sm bg-gray-900 border-2 transition-all flex flex-col items-center justify-end pb-3 active:scale-95 disabled:opacity-50 overflow-hidden ${
                  selectedBuildingToDeploy === "ARCANE_MAGE" ? "border-amber-400 bg-amber-950/30" : "border-gray-700 hover:border-amber-400"
                }`}
              >
                <div className="absolute top-1 right-1 bg-amber-500/30 border border-amber-400 text-amber-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm z-20">
                  {mageCount ?? 0}/3
                </div>
                <img src="/assets/units/unit_arcane_mage1.png" className={`absolute top-2 w-20 h-20 object-contain transition-transform ${selectedBuildingToDeploy === "ARCANE_MAGE" ? "scale-110" : "group-hover:scale-110"}`} alt="Mage" />
                <div className="flex flex-col items-center z-10">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${selectedBuildingToDeploy === "ARCANE_MAGE" ? "text-amber-400" : "text-white"}`}>
                    Mage
                  </span>
                  <span className="text-[9px] font-mono text-amber-300">
                    {(mageCount ?? 0) >= 3 ? "MAX (3/3)" : selectedBuildingToDeploy === "ARCANE_MAGE" ? "READY" : "DEPLOY"}
                  </span>
                </div>
              </button>

              <button
                onClick={() => onSelectBuildingToDeploy?.(selectedBuildingToDeploy === "SERAPH_GLIDER" ? null : "SERAPH_GLIDER")}
                disabled={isLoading || (gliderCount ?? 0) >= 3}
                className={`relative group w-28 h-36 rounded-sm bg-gray-900 border-2 transition-all flex flex-col items-center justify-end pb-3 active:scale-95 disabled:opacity-50 overflow-hidden ${
                  selectedBuildingToDeploy === "SERAPH_GLIDER" ? "border-sky-400 bg-sky-950/30" : "border-gray-700 hover:border-sky-400"
                }`}
              >
                <div className="absolute top-1 right-1 bg-sky-500/30 border border-sky-400 text-sky-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm z-20">
                  {gliderCount ?? 0}/3
                </div>
                <img src="/assets/units/unitserapguilder1.png" className={`absolute top-2 w-20 h-20 object-contain transition-transform ${selectedBuildingToDeploy === "SERAPH_GLIDER" ? "scale-110" : "group-hover:scale-110"}`} alt="Glider" />
                <div className="flex flex-col items-center z-10">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${selectedBuildingToDeploy === "SERAPH_GLIDER" ? "text-sky-400" : "text-white"}`}>
                    Glider
                  </span>
                  <span className="text-[9px] font-mono text-sky-300">
                    {(gliderCount ?? 0) >= 3 ? "MAX (3/3)" : selectedBuildingToDeploy === "SERAPH_GLIDER" ? "READY" : "DEPLOY"}
                  </span>
                </div>
              </button>
            </div>

            <button
              onClick={onAttackClick}
              disabled={isLoading}
              className="pointer-events-auto px-6 py-3.5 rounded-sm bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest border border-red-500 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 w-full"
            >
              <Sword className="w-4 h-4" />
              <span>Launch Attack</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
