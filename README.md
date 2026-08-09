# 🛡️ Atheria: Yield Wars
> **The Ultimate Lossless DeFi Yield Raiding Strategy Game on Monad Testnet**  
> *Built for Monad Hackathon 2026 — Light Celestial Kingdom Theme*

[![Live Demo](https://img.shields.io/badge/🌐_Live_dApp-monad--hacks--atheria.vercel.app-06b6d4?style=for-the-badge)](https://monad-hacks-atheria.vercel.app/)
[![Monad Testnet](https://img.shields.io/badge/Chain-Monad_Testnet_10143-8b5cf6?style=for-the-badge)](https://testnet-rpc.monad.xyz)

![Atheria Celestial Logo](projects/web/public/assets/atherialogo.png)

---

## 🔗 Quick Links
- 🌐 **Live Application:** [https://monad-hacks-atheria.vercel.app/](https://monad-hacks-atheria.vercel.app/)
- ⚡ **Monad Testnet Explorer:** `Chain ID 10143`

---

## 🌟 Overview

**Atheria: Yield Wars** is a groundbreaking, 2D isometric lossless strategy game built on **Monad’s 400ms parallel EVM testnet**. Players stake capital into interest-bearing DeFi vaults, construct celestial base defenses (Citadel & Arcane Towers), and raid rival players' bases to steal accumulated yield—**all without risking their principal deposit**.

Combining real-time Web3 strategy, dynamic yield routing across Monad DEX protocols, Privy embedded authentication, and AAA-quality Light Celestial glassmorphic UI, Atheria redefines GameFi economics.

---

## 🚀 Key Features

- 🔒 **Lossless Principal Staking:** Deposit Mock USDC into `AtheriaVault.sol`. Your principal is locked safely; only generated yield is at stake in battle.
- ⚡ **Real-Time Yield Raiding:** Deploy Arcane Mages and Seraph Gliders in automated real-time battles (`AtheriaBattle.sol`) to pillage rival yield.
- ⏱️ **Monad 400ms Parallel Block Ticker:** Real-time block counter and 10k TPS simulation HUD built for high-throughput EVM performance.
- 🔮 **Light Celestial Glassmorphism UI:** Asset-backed AAA game interface using custom canvas, Framer Motion micro-interactions, and high-contrast typography.
- 🔐 **Seamless Web3 Onboarding (Privy):** One-click social and wallet login with automatic session routing between Landing Page (`/landing`) and Game Dashboard (`/`).
- 🎵 **Persistent Audio Experience:** Continuous celestial ambient soundtrack (`song-theme-atheria.mp3`) playing seamlessly across route transitions.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([🎮 Player]) -->|Privy Auth / Web3 Wallet| Frontend[⚡ Next.js 16 App Router]
    
    subgraph Frontend Layer ["Client Layer (Next.js + Tailwind + Framer Motion)"]
        Landing["🌐 Light Celestial Landing Page (/landing)"]
        Dashboard["🏰 Game Dashboard / HexGrid Canvas (/)"]
        HUDComp["🛡️ Asset-Based Glassmorphic HUD"]
        AuthRouter["🔄 AuthRouter & Privy Context"]
    end
    
    Frontend --> AuthRouter
    AuthRouter -->|Authenticated| Dashboard
    AuthRouter -->|Unauthenticated| Landing
    Dashboard --> HUDComp
    
    subgraph Blockchain Layer ["Monad Testnet (Chain ID 10143)"]
        VaultContract["🏦 AtheriaVault.sol"]
        BattleContract["⚔️ AtheriaBattle.sol"]
        USDCContract["🪙 MockUSDC.sol"]
    end
    
    Dashboard -->|Viem / Wagmi RPC Calls| Blockchain Layer
    VaultContract -->|Yield Distribution| BattleContract
    USDCContract -->|Staking / Faucet| VaultContract
```

### Architectural Highlights

1. **Frontend Architecture (`projects/web`)**:
   - **Next.js 16 (Turbopack) App Router:** High-speed client-side rendering with route protection.
   - **AuthRouter Component:** Intercepts authentication state from `@privy-io/react-auth` to automatically redirect users to `/` upon login or `/landing` upon disconnect.
   - **HexGrid Engine:** Custom 2D isometric grid system handling tile selection, building deployment, troop movement vectors, and collision logic.

2. **Smart Contract Architecture (`projects/contracts`)**:
   - **`MockUSDC.sol`**: ERC-20 token serving as primary staking collateral.
   - **`AtheriaVault.sol`**: Vault managing deposit, withdrawal, and yield accrual mechanisms.
   - **`AtheriaBattle.sol`**: Matchmaking and battle engine determining raid outcomes and loot transfers on-chain.

---

## 📜 Smart Contract Deployments (Monad Testnet)

| Contract | Address | Network | Chain ID |
| :--- | :--- | :--- | :--- |
| **Mock USDC** | `0xe242738c8235317105c5716fAAf1B7C7cC676FFA` | Monad Testnet | 10143 |
| **Atheria Vault** | `0x68Aef8dE7d7eAc00EdA743dC8BfFd29283566e33` | Monad Testnet | 10143 |
| **Atheria Battle** | `0x84b91D785C267500e7b59c94D62aa54813cD54c5` | Monad Testnet | 10143 |

**Monad RPC URL:** `https://testnet-rpc.monad.xyz`

---

## 📁 Repository Structure

```
monad-hacks-atheria/
├── projects/
│   ├── web/                     # Next.js 16 Web Application
│   │   ├── public/assets/       # Game images, background video & audio
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── page.tsx     # Game Dashboard (HexGrid + HUD)
│   │   │   │   ├── landing/     # Light Celestial Landing Page
│   │   │   │   └── layout.tsx   # Root Layout with Privy & AuthRouter
│   │   │   ├── components/
│   │   │   │   ├── game/        # Isometric HexGrid Engine
│   │   │   │   ├── ui/          # Asset-based HUD Component
│   │   │   │   ├── AuthRouter.tsx
│   │   │   │   └── Providers.tsx
│   │   └── package.json
│   └── contracts/               # Solidity Smart Contracts (Foundry)
│       └── src/
│           ├── AtheriaVault.sol
│           ├── AtheriaBattle.sol
│           └── MockUSDC.sol
├── mynotes/                     # Design Specs & Game Asset Requirements
├── vercel.json                  # Monorepo Deployment Config for Vercel
└── README.md
```

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js >= 18.0.0
- npm / pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rikokurnia/monad-hacks-atheria.git
   cd monad-hacks-atheria/projects/web
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables (`.env.local`):**
   Create a `.env.local` file inside `projects/web/`:
   ```env
   NEXT_PUBLIC_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
   NEXT_PUBLIC_MONAD_CHAIN_ID=10143

   NEXT_PUBLIC_MOCK_USDC_ADDRESS=your_mock_usdc_address_here
   NEXT_PUBLIC_ATHERIA_VAULT_ADDRESS=your_vault_address_here
   NEXT_PUBLIC_ATHERIA_BATTLE_ADDRESS=your_battle_address_here

   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
   PRIVY_APP_ID=your_privy_app_id_here
   PRIVY_APP_SECRET=your_privy_app_secret_here
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🌐 Deploying to Vercel

Since this repository is organized as a monorepo, configure Vercel with the following settings:

1. **Root Directory:** `projects/web`
2. **Framework Preset:** Next.js
3. **Build Command:** `npm run build`
4. **Environment Variables:** Add all variables from `.env.local` into **Vercel Settings > Environment Variables**.

---

## 👥 Team & License

- **Hackathon:** Monad Hackathon 2026
- **License:** MIT License
