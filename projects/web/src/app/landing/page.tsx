"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, ArrowRight, Coins } from "lucide-react";

export default function LandingPage() {
  const { login, authenticated, logout } = usePrivy();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-cyan-200">
      {/* HEADER HERO WITH VIDEO BACKGROUND */}
      <header className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-80"
        >
          <source src="/assets/video/bg_video.mp4" type="video/mp4" />
        </video>

        {/* Ambient Overlay for Light Celestial Theme */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/30 via-white/50 to-white backdrop-blur-[2px]" />

        {/* Navbar */}
        <nav className="absolute top-0 w-full px-8 py-6 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center border border-cyan-300 shadow-sm">
              🛡️
            </div>
            <span className="text-xl font-black text-cyan-950 tracking-wide uppercase">Atheria</span>
          </div>
          <div>
            {!authenticated ? (
              <button
                onClick={login}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                Connect Wallet <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">Wallet Connected</span>
                <button
                  onClick={logout}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-full font-bold text-sm shadow-sm transition-all"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-cyan-200 px-4 py-1.5 rounded-full mb-6 shadow-sm"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-cyan-900 tracking-wider">BUILT ON MONAD TESTNET</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6 tracking-tight drop-shadow-sm"
          >
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-500">Yield Raiding</span> Strategy Game
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl font-medium text-slate-700 mb-10 max-w-2xl"
          >
            Build your celestial base, stake your assets, and raid opponents in a lossless DeFi strategy game powered by Monad's 400ms parallel EVM.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {!authenticated ? (
              <button
                onClick={login}
                className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-10 py-4 rounded-full font-black text-lg shadow-[0_8px_30px_rgba(8,145,178,0.3)] transition-all hover:scale-105 flex items-center gap-3"
              >
                START PLAYING <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <a
                href="/"
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-10 py-4 rounded-full font-black text-lg shadow-[0_8px_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105 flex items-center gap-3 inline-flex"
              >
                ENTER CITADEL <ArrowRight className="w-5 h-5" />
              </a>
            )}
          </motion.div>
        </div>
      </header>

      {/* CONTENT SECTION */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Core Gameplay Loops</h2>
            <p className="text-slate-600 font-medium max-w-2xl mx-auto">Experience a new era of decentralized gaming where your strategy directly impacts your real yield.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:border-cyan-200 transition-all group">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Coins className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lossless Staking</h3>
              <p className="text-slate-600 font-medium">Stake your USDC into the Atheria Vault. Your principal is always safe, generating yield that powers the game economy.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:border-cyan-200 transition-all group">
              <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Base Defense</h3>
              <p className="text-slate-600 font-medium">Build your Citadel and Arcane Towers. Defend your generated yield from incoming raiders using strategic placements.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:border-cyan-200 transition-all group">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Yield Raiding</h3>
              <p className="text-slate-600 font-medium">Deploy troops to attack other players' bases. Break through their defenses to steal a portion of their accumulated yield!</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800 relative z-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-cyan-900/50 rounded-lg flex items-center justify-center border border-cyan-700">
              🛡️
            </div>
            <span className="text-lg font-black text-white tracking-wide uppercase">Atheria</span>
          </div>
          <div className="text-slate-400 font-medium text-sm">
            © 2026 Atheria Yield Wars. Built for Monad.
          </div>
        </div>
      </footer>
    </div>
  );
}
