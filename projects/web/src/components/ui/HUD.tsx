"use client";

import React, { useState, useEffect } from "react";
import { UnitType } from "../game/HexGrid";
import { Coins, ShieldCheck, Zap, Sword, Sparkles, RefreshCw, LogOut, ChevronDown, X, Layers, Flame, Waves, TrendingUp, CheckCircle2 } from "lucide-react";
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
  const [isDeFiMenuOpen, setIsDeFiMenuOpen] = useState(false);
  const [selectedDeFiProtocol, setSelectedDeFiProtocol] = useState<"AMBIENT" | "KURU" | "MAGMA" | "PORTFOLIO" | null>(null);
  const [activeStrategy, setActiveStrategy] = useState<"AMBIENT" | "KURU" | "MAGMA">("AMBIENT");
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [blockNumber, setBlockNumber] = useState(9295412);

  // Live Monad 400ms Block Ticker Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockNumber((prev) => prev + 1);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const isInsideFence = selectedTile ? selectedTile.x >= 2 && selectedTile.x <= 7 && selectedTile.y >= 2 && selectedTile.y <= 7 : false;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 p-6 overflow-hidden">
      
      {/* Top Center: Celestial Light Morphic Navbar (KokonutUI Inspired) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-auto hidden md:flex items-center z-40"
      >
        <div 
          className="relative flex items-center bg-white/30 border border-white/50 p-1.5 rounded-2xl shadow-[0_8px_32px_rgba(34,211,238,0.15)] backdrop-blur-xl"
          onMouseLeave={() => setHoveredNav(null)}
        >
          {/* Player Identity */}
          <div 
            className="relative px-3 py-2 cursor-pointer z-10"
            onMouseEnter={() => setHoveredNav('profile')}
          >
            {hoveredNav === 'profile' && (
              <motion.div
                layoutId="nav-hover"
                className="absolute inset-0 bg-white/60 rounded-xl -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-sm shadow-sm">
                🛡️
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-sm font-extrabold text-slate-800 tracking-wide">@YieldRider</span>
                  <span className="text-[10px] font-bold text-cyan-700 bg-cyan-100 px-1.5 py-0.5 rounded-full border border-cyan-200">Lv.20</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Monad Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-300/50 mx-1" />

          {/* Real-time Monad Performance Ticker */}
          <div 
            className="relative px-3 py-2 cursor-pointer z-10"
            onMouseEnter={() => setHoveredNav('engine')}
          >
            {hoveredNav === 'engine' && (
              <motion.div
                layoutId="nav-hover"
                className="absolute inset-0 bg-white/60 rounded-xl -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">BLOCK</span>
                <span className="text-sm font-extrabold text-slate-800 tracking-tight">#{blockNumber.toLocaleString()}</span>
                <span className="text-[9px] font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded-full border border-cyan-200 shadow-sm">400ms</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-600 font-extrabold">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm">10k TPS</span>
              </div>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-300/50 mx-1" />

          {/* Vitals & Defense Shield */}
          <div 
            className="relative px-3 py-2 cursor-pointer z-10"
            onMouseEnter={() => setHoveredNav('vitals')}
          >
            {hoveredNav === 'vitals' && (
              <motion.div
                layoutId="nav-hover"
                className="absolute inset-0 bg-white/60 rounded-xl -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 font-mono">
                <Zap className="w-4 h-4 text-cyan-500" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ENERGY</span>
                <span className="text-sm font-bold text-slate-800">6,420<span className="text-slate-400">/10k</span></span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-emerald-700 font-bold text-[10px] font-mono tracking-widest shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SHIELD 100%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
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
          <div className="flex flex-col items-start gap-2 relative">
            <button
              onClick={onFaucetClick}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-bold rounded-sm bg-white text-black hover:bg-gray-200 border border-white transition-all flex items-center gap-2 active:scale-95 uppercase tracking-wide"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Faucet 1,000 MON</span>
            </button>

            {/* Sub-menu Trigger Button below Faucet */}
            <button
              onClick={() => setIsDeFiMenuOpen(!isDeFiMenuOpen)}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-bold rounded-sm bg-cyan-950/90 text-cyan-400 hover:bg-cyan-900 border border-cyan-500/50 transition-all flex items-center gap-2 active:scale-95 uppercase tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Monad DeFi Menu</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDeFiMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Sub-menu Dropdown List */}
            <AnimatePresence>
              {isDeFiMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-20 left-0 w-64 bg-slate-950/95 border border-cyan-500/50 p-2 rounded-sm shadow-2xl backdrop-blur-xl flex flex-col gap-1 z-50 pointer-events-auto"
                >
                  <div className="px-3 py-1 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider border-b border-white/10 pb-1.5 mb-1 flex items-center justify-between">
                    <span>Monad Yield Engines</span>
                    <span className="text-gray-500">400ms</span>
                  </div>

                  <button
                    onClick={() => { setSelectedDeFiProtocol("AMBIENT"); setIsDeFiMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs rounded hover:bg-cyan-900/40 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 text-sm">🌊</span>
                      <div>
                        <div className="font-bold text-white group-hover:text-cyan-400">Ambient Finance</div>
                        <div className="text-[9px] text-gray-400">DEX Concentrated Liquidity</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">18.5%</span>
                  </button>

                  <button
                    onClick={() => { setSelectedDeFiProtocol("KURU"); setIsDeFiMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs rounded hover:bg-cyan-900/40 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 text-sm">⚡</span>
                      <div>
                        <div className="font-bold text-white group-hover:text-amber-400">Kuru DEX Vault</div>
                        <div className="text-[9px] text-gray-400">Orderbook Market Maker</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/30">24.2%</span>
                  </button>

                  <button
                    onClick={() => { setSelectedDeFiProtocol("MAGMA"); setIsDeFiMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs rounded hover:bg-cyan-900/40 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 text-sm">🔥</span>
                      <div>
                        <div className="font-bold text-white group-hover:text-purple-400">Magma Staking</div>
                        <div className="text-[9px] text-gray-400">gMON Liquid Staking</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-500/30">14.0%</span>
                  </button>

                  <div className="w-full h-px bg-white/10 my-1" />

                  <button
                    onClick={() => { setSelectedDeFiProtocol("PORTFOLIO"); setIsDeFiMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs rounded bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-bold transition-colors flex items-center gap-2"
                  >
                    <span>📊</span>
                    <span>DeFi Vault Routing & Stats</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">MON Wallet</span>
            <span className="text-sm font-bold font-mono text-white">
              {usdcBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} MON
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/90 border border-white/10 px-4 py-2 rounded-sm w-48 justify-between">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Staked MON</span>
            <span className="text-sm font-bold font-mono text-white">
              {stakedPrincipal.toLocaleString("en-US", { minimumFractionDigits: 2 })} MON
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/90 border border-amber-500/30 px-4 py-2 rounded-sm w-48 justify-between">
          <Zap className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">{gameMode === 'HOME' ? 'Unclaimed Yield' : 'Available Loot'}</span>
            <span className="text-sm font-bold font-mono text-white">
              +{(gameMode === 'RAID' ? 5.000 : unclaimedYield).toFixed(4)} MON
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
                  Stake MON
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

      {/* Monad DeFi Card Modal Overlay */}
      <AnimatePresence>
        {selectedDeFiProtocol && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-slate-950/95 border border-cyan-500/50 rounded-lg p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-white overflow-hidden"
            >
              {/* Top Glow Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-amber-400 to-purple-500" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedDeFiProtocol(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Card Header & Content based on selected protocol */}
              {selectedDeFiProtocol === "AMBIENT" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                      🌊
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white tracking-wide">Ambient Finance LP Vault</h2>
                        <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded">MONAD ECOSYSTEM</span>
                      </div>
                      <p className="text-xs text-gray-400">Concentrated Liquidity & Automated Swap Fee Vault</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/60 border border-cyan-500/20 p-3 rounded">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Estimated APY</div>
                      <div className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                        <TrendingUp className="w-4 h-4" /> 18.5%
                      </div>
                    </div>
                    <div className="bg-black/60 border border-cyan-500/20 p-3 rounded">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Strategy Defense Buff</div>
                      <div className="text-sm font-bold text-cyan-300 flex items-center gap-1 mt-1">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" /> Citadel HP +20%
                      </div>
                    </div>
                  </div>

                  <div className="bg-cyan-950/30 border border-cyan-500/30 p-3.5 rounded text-xs text-cyan-200 leading-relaxed flex flex-col gap-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-cyan-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Lossless Guarantee Active
                    </div>
                    <p className="text-gray-300 text-[11px]">
                      Your principal deposit is locked into Monad smart contracts and 100% safe from enemy raids. Attackers can only steal unclaimed yield!
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        onDepositClick?.();
                        setSelectedDeFiProtocol(null);
                      }}
                      className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-widest rounded border border-cyan-400 transition-all active:scale-95 shadow-lg shadow-cyan-950/50"
                    >
                      Allocate MON to Ambient LP
                    </button>
                  </div>
                </div>
              )}

              {selectedDeFiProtocol === "KURU" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                      ⚡
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white tracking-wide">Kuru DEX Orderbook Vault</h2>
                        <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded">400MS EVM</span>
                      </div>
                      <p className="text-xs text-gray-400">High-Frequency Market Maker on Monad Blocktime</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/60 border border-amber-500/20 p-3 rounded">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Estimated APY</div>
                      <div className="text-xl font-bold font-mono text-amber-400 flex items-center gap-1 mt-0.5">
                        <TrendingUp className="w-4 h-4" /> 24.2%
                      </div>
                    </div>
                    <div className="bg-black/60 border border-amber-500/20 p-3 rounded">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Strategy Defense Buff</div>
                      <div className="text-sm font-bold text-amber-300 flex items-center gap-1 mt-1">
                        <Zap className="w-4 h-4 text-amber-400" /> Troop Spawn +15%
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-950/30 border border-amber-500/30 p-3.5 rounded text-xs text-amber-200 leading-relaxed flex flex-col gap-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-amber-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" /> Monad Parallel Execution
                    </div>
                    <p className="text-gray-300 text-[11px]">
                      Leverages Monad's 10,000 TPS parallel throughput for instant order matching and max yield generation per block.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        onDepositClick?.();
                        setSelectedDeFiProtocol(null);
                      }}
                      className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-widest rounded border border-amber-400 transition-all active:scale-95 shadow-lg shadow-amber-950/50"
                    >
                      Allocate MON to Kuru Orderbook
                    </button>
                  </div>
                </div>
              )}

              {selectedDeFiProtocol === "MAGMA" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                      🔥
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white tracking-wide">Magma Liquid Staking (gMON)</h2>
                        <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-400 border border-purple-500/40 px-2 py-0.5 rounded">LIQUID STAKING</span>
                      </div>
                      <p className="text-xs text-gray-400">Monad Validator Rewards & Auto-Restaking</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/60 border border-purple-500/20 p-3 rounded">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Estimated APY</div>
                      <div className="text-xl font-bold font-mono text-purple-400 flex items-center gap-1 mt-0.5">
                        <TrendingUp className="w-4 h-4" /> 14.0%
                      </div>
                    </div>
                    <div className="bg-black/60 border border-purple-500/20 p-3 rounded">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Strategy Defense Buff</div>
                      <div className="text-sm font-bold text-purple-300 flex items-center gap-1 mt-1">
                        <Sparkles className="w-4 h-4 text-purple-400" /> HP Regen 5%/min
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-950/30 border border-purple-500/30 p-3.5 rounded text-xs text-purple-200 leading-relaxed flex flex-col gap-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-purple-300">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" /> Liquid Derivative Token
                    </div>
                    <p className="text-gray-300 text-[11px]">
                      Yield is accumulated automatically in gMON tokens without lockup penalties.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        onDepositClick?.();
                        setSelectedDeFiProtocol(null);
                      }}
                      className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-widest rounded border border-purple-400 transition-all active:scale-95 shadow-lg shadow-purple-950/50"
                    >
                      Allocate MON to Magma Staking
                    </button>
                  </div>
                </div>
              )}

              {selectedDeFiProtocol === "PORTFOLIO" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                      📊
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white tracking-wide">DeFi Vault Routing & Stats</h2>
                        <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded">MONAD AGGREGATOR</span>
                      </div>
                      <p className="text-xs text-gray-400">Live Breakdown of Staked Assets & Yield Routing</p>
                    </div>
                  </div>

                  {/* Portfolio Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/60 border border-white/10 p-3 rounded">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Staked Principal</div>
                      <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
                        {stakedPrincipal.toFixed(2)} MON
                      </div>
                      <span className="text-[9px] text-emerald-400 font-semibold">100% Protected</span>
                    </div>
                    <div className="bg-black/60 border border-white/10 p-3 rounded">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Unclaimed Yield</div>
                      <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                        +{unclaimedYield.toFixed(4)} MON
                      </div>
                      <span className="text-[9px] text-amber-300 font-semibold">Real-time Ticker</span>
                    </div>
                  </div>

                  {/* Routing Split Diagram */}
                  <div className="bg-black/60 border border-white/10 p-4 rounded flex flex-col gap-2.5">
                    <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                      Automated Protocol Allocation
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-cyan-400 font-semibold">🌊 Ambient Finance LP (40%)</span>
                          <span className="font-mono text-gray-400">${(stakedPrincipal * 0.4).toFixed(2)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="w-[40%] h-full bg-cyan-400" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-amber-400 font-semibold">⚡ Kuru DEX Vault (30%)</span>
                          <span className="font-mono text-gray-400">${(stakedPrincipal * 0.3).toFixed(2)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="w-[30%] h-full bg-amber-400" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-purple-400 font-semibold">🔥 Magma Staking gMON (30%)</span>
                          <span className="font-mono text-gray-400">${(stakedPrincipal * 0.3).toFixed(2)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="w-[30%] h-full bg-purple-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        onClaimYieldClick?.();
                        setSelectedDeFiProtocol(null);
                      }}
                      disabled={unclaimedYield <= 0}
                      className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-widest rounded border border-amber-400 transition-all active:scale-95 disabled:opacity-50"
                    >
                      Claim Unclaimed Yield
                    </button>
                    <button
                      onClick={() => {
                        onDepositClick?.();
                        setSelectedDeFiProtocol(null);
                      }}
                      className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-widest rounded border border-cyan-400 transition-all active:scale-95"
                    >
                      Stake More MON
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
