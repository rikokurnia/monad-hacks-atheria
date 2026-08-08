# Product Requirements Document (PRD)
**Project Name:** Atheria: Yield Wars  
**Theme & Visual Style:** Bright Celestial Kingdom (Clean 2D Isometric, White Marble Castles, Glowing Cyan Magic Crystals, Light Frosted Glassmorphism UI)  
**Document Status:** Final (Hackathon Scope)  
**Target Platform:** Web Desktop (Primary 1920x1080) & Mobile Responsive / Monad Blockchain  
**Target Event:** Monad Blitz Jakarta 2026  

---

## 1. Executive Summary
**Atheria: Yield Wars** adalah game strategi berbasis *hex-grid* ber-tema **Bright Celestial Kingdom** (terinspirasi dari Clash of Clans) yang mengintegrasikan mekanik *DeFi yield-farming* secara langsung ke dalam *gameplay*. Game ini menonjolkan fitur **Lossless Yield Stealing**, di mana pemain saling menyerang markas kerajaan untuk merampas *yield* (bunga/keuntungan DeFi) yang dihasilkan oleh lawan, **tanpa** membahayakan modal awal (principal) pemain. 

Game ini dirancang khusus untuk memaksimalkan keunggulan utama blockchain Monad: **eksekusi paralel 10.000 TPS dan finalitas 400ms** untuk kalkulasi pertarungan *real-time* secara *on-chain*.

## 2. Problem & Solution
### Problem (Masalah Saat Ini)
1. **Risiko Tinggi di Web3 Gaming (Rage-Quit):** Game *play-to-earn* tradisional mengharuskan pemain mempertaruhkan aset asli. Jika aset mereka dicuri saat kalah atau *offline*, pemain akan merasa frustrasi dan meninggalkan game.
2. **Ekonomi Game yang Hancur (Ponzinomics):** Sebagian besar game Web3 mengandalkan token internal (inflasi) yang nilainya pasti hancur ke titik nol.
3. **UX & RPC Latency yang Buruk:** Pemain harus menyetujui *popup* dompet (MetaMask) untuk setiap tindakan, serta sering mengalami keterlambatan eksekusi akibat estimasi gas dan *nonce roundtrip* yang lambat.

### Solution (Solusi Atheria)
1. **Lossless Raiding:** Pemain menyimpan token universal (**USDC**) atau Mock $MON ke dalam "Celestial Citadel" (DeFi Vault). Saat diserang, lawan hanya bisa mencuri persentase dari *yield* yang belum diklaim, bukan modal awal.
2. **Single Universal Token Economy (USDC & Mock $MON):** Menggunakan **USDC** sebagai token staking universal utama. Untuk kebutuhan pengujian di Monad Testnet, sistem menyediakan Mock $MON Faucet built-in langsung di UI agar juri bisa menguji tanpa batasan rate-limit (berdasarkan rujukan [Monad Faucet](https://faucet.monad.xyz/)).
3. **Zero-Latency UX & High-Speed Monad Specs:** Menggunakan **Session Keys** (via Privy/Web3Auth) dipadukan dengan *Local Nonce Management* dan *Hardcoded Gas Limits* agar penempatan pasukan terasa secepat game Web2 tanpa *popup* dan tanpa *RPC lag*.

## 3. Target Audience
* **Web2 Casual Gamers:** Pemain game strategi (CoC, Clash Royale) yang mencari game kasual tanpa harus mengerti rumitnya *crypto wallet* dan tanpa risiko kehilangan uang jajan.
* **DeFi Degens:** Pengguna kripto yang memiliki aset *stablecoin* (USDC) / $MON menganggur dan ingin membuat aktivitas *yield farming* mereka menjadi interaktif dan kompetitif.

## 4. Core Gameplay Mechanics (Celestial Theme Aligned)
### A. Base Building & Staking (Farming)
* **Celestial Citadel (Inti Markas & Vault):** Berfungsi ganda sebagai *Town Hall* marmer putih dan *DeFi Vault*. Semua deposit USDC/Mock $MON pemain masuk ke sini dan secara otomatis di-*stake* ke protokol DeFi.
* **Pertahanan Pertukaran Sihir:** Pemain dapat menggunakan *yield* yang dihasilkan untuk membangun atau memperkuat Arcane Towers (menembakkan laser cyan), Crystal Barricades, dan Guardian Statues di atas peta *hexagonal*.

### B. Live Troop Deployment & Combat (PvP)
* **Real-time Deployment:** Saat menyerang markas lawan, pemain mengklik/mengetuk batas peta untuk menempatkan pasukan:
  * **Arcane Mage:** Pasukan darat berjubah putih yang menembakkan bola sihir Emas (*Golden Orb*).
  * **Seraph Glider:** Pasukan udara terbang bersayap energi cyan yang menembakkan tombak cahaya Putih (*Light Bolt*).
* **On-Chain Auto-Pathing:** Setelah ditempatkan, AI pasukan akan bergerak otomatis ke bangunan musuh terdekat. Seluruh kalkulasi darah (HP), serangan, dan pergerakan dihitung oleh *smart contract* Monad di setiap blok (400ms).

### C. Resolution (Hasil Pertarungan)
* **Menang (Attacker):** Merampas hingga 30% dari *yield* lawan yang belum diklaim (Unclaimed Yield).
* **Kalah (Attacker):** Kehilangan unit pasukan / energi penyerangan.
* **Bertahan (Defender):** Mempertahankan 100% *yield* mereka dan mendapatkan poin pertahanan (trofi). **Modal awal (USDC/MON) selalu 100% aman.**

## 5. Technical Architecture & Tech Stack (Monad Best Practices Aligned)

### A. Smart Contracts & Blockchain
* **Blockchain Network:** Monad Testnet
* **Smart Contract Tooling:** **Monad Foundry** (Custom fork Foundry khusus EVM Monad dengan dukungan precompile staking dan *human-readable trace decoding* - Ref: [Monad Tooling & Infra](https://docs.monad.xyz/tooling-and-infra)).
* **Agentic Payments / Rails:** Integrasi pembayaran rel agen untuk transaksi otomatis (Ref: [Monad Agentic Payments](https://docs.monad.xyz/tooling-and-infra/agentic-payments)).
* **Kontrak Utama:**
  1. `AtheriaVault.sol`: Mengelola deposit USDC / Mock $MON pemain, *routing* ke DeFi (Mock Aave), dan kalkulasi pembagian *yield*.
  2. `AtheriaBattle.sol`: Menyimpan *state* papan permainan (Grid State), memvalidasi penempatan pasukan, dan menjalankan loop pertarungan (kalkulasi *damage*).

### B. Frontend, UI & Design Stack
* **Framework:** Next.js (React) + Viem / Wagmi
* **Web3 Auth & Session:** Privy / Biconomy (Session Keys untuk transaksi tanpa *popup*).
* **UI Components & Glassmorphism:** [Kokonut UI](https://kokonutui.com/) & [Bklit](https://bklit.com/) (komponen Frosted Glass cerah) dipadukan dengan pedoman desain [Impeccable Style](https://impeccable.style/).
* **Micro-Animations:** [Anime.js](https://animejs.com/) (untuk animasi proyektil laser, efek ledakan, dan angka *floating damage*).
* **Visual Engine / Grid:** Clean 2D Isometric Grid (`react-hexgrid` / HTML5 Canvas).

### C. Monad Performance & Optimization Tricks (Wajib untuk Monad Speed Specs)
Berdasarkan rujukan resmi [Monad Developer Essentials: Best Practices](https://docs.monad.xyz/developer-essentials/best-practices):
1. **Hardcode Gas Limits:** Memlewati `eth_estimateGas` untuk transaksi statis (seperti pengerahan pasukan) untuk memangkas latensi RPC dan menghilangkan keterlambatan respon dompet.
2. **Reduce `eth_call` Latency:** Menggunakan **Multicall3** dan pembacaan paralel `Promise.all` di Viem untuk *batching* panggilan data markas & HP unit.
3. **Local Nonce Management:** Mengacak dan melacak *nonce* transaksi secara lokal di sisi *frontend* saat pemain mendeploy banyak pasukan secara cepat untuk menghindari *network roundtrip*.
4. **Concurrent Transaction Submission:** Mengirimkan transaksi penempatan beberapa pasukan secara paralel menggunakan `Promise.all` alih-alih sekuensial.
5. **State Indexing:** Menggunakan *indexer* (Envio / Goldsky / GhostGraph) untuk menyajikan data *battle log* dan riwayat *yield* secara instant tanpa melakukan *polling* `eth_getLogs` berulang-ulang.

### D. Developer Tools & Skill Agents Integration
* **Monad Skills Agent Integration:** Menggunakan [Devnads Skills](https://skills.devnads.com/) dan [Monad Agents](https://app.monad.xyz/agents) serta file `.monskills` untuk otomasi agen dan pengujian integrasi *smart contract*.
* **Developer Portal:** [Monad Developers](https://developers.monad.xyz/) & [Monad App Ecosystem](https://app.monad.xyz/).

## 6. User Journey (Alur Pengguna)
1. **Onboarding:** User buka web desktop -> Login dengan Google -> Dompet *smart account* dan *Session Key* otomatis dibuat di latar belakang.
2. **Built-in Faucet:** User menekan tombol "Claim Demo Tokens" di UI untuk mendapatkan Mock $MON / USDC tanpa antri faucet eksternal.
3. **Deposit & Build:** User mendepositkan token ke Citadel untuk mengaktifkan *yield generation* dan mendesain tata letak menara sihir di *hex grid*.
4. **Raid (Battle):** User menekan "Find Match", masuk ke markas lawan, mengklik untuk mendeploy Arcane Mage & Seraph Glider secara *live*, dan menonton pertarungan yang dieksekusi on-chain di Monad.
5. **Claim:** User mengklaim *yield* yang berhasil dirampas atau dipertahankan langsung ke dompet.

## 7. Monetization Strategy (Model Bisnis)
* **Performance Fee:** Platform memotong biaya **1% - 3%** dari total *yield* DeFi yang dihasilkan di seluruh ekosistem game.
* **Cosmetics:** Menjual skin (tampilan visual) premium untuk pasukan atau markas (menggunakan NFT atau *off-chain purchase*). Tidak ada mekanik *Pay-to-Win*.

## 8. Hackathon Scope (MVP - 48 Jam)
Dalam waktu 48 jam, ini adalah ruang lingkup pengerjaan yang *wajib* diselesaikan:
* [ ] UI Peta Hex-Grid isometrik 2D Bright Celestial (Marmer putih, kristal sihir, Light Frosted Glass UI via [Kokonut UI](https://kokonutui.com/) & [Bklit](https://bklit.com/)).
* [ ] Integrasi Login (Privy) + Session Keys (tanpa *popup*).
* [ ] Built-in Demo Faucet (USDC / Mock $MON) di UI (Link Faucet: [faucet.monad.xyz](https://faucet.monad.xyz/)).
* [ ] Kontrak `Vault` yang di-deploy dengan **Monad Foundry** (Ref: [Monad Tooling](https://docs.monad.xyz/tooling-and-infra)).
* [ ] Integrasi *Optimization Best Practices* (Hardcoded Gas Limit & Local Nonce Management) untuk penempatan pasukan *real-time* ([Monad Best Practices](https://docs.monad.xyz/developer-essentials/best-practices)).
* [ ] Mekanik pertarungan pasukan di sisi *smart contract* (deploy Arcane Mage / Seraph Glider -> menyerang otomatis di blok 400ms Monad).
* [ ] Transfer *yield* otomatis dari pihak yang kalah ke pemenang.

## 9. References & Resource Links
* **Monad Developer Portal:** [developers.monad.xyz](https://developers.monad.xyz/)
* **Monad Best Practices:** [docs.monad.xyz/developer-essentials/best-practices](https://docs.monad.xyz/developer-essentials/best-practices)
* **Monad Tooling & Infra:** [docs.monad.xyz/tooling-and-infra](https://docs.monad.xyz/tooling-and-infra)
* **Monad Agentic Payments:** [docs.monad.xyz/tooling-and-infra/agentic-payments](https://docs.monad.xyz/tooling-and-infra/agentic-payments)
* **Monad Official Faucet:** [faucet.monad.xyz](https://faucet.monad.xyz/)
* **Monad Ecosystem Apps:** [app.monad.xyz](https://app.monad.xyz/)
* **Devnads Skills Agent:** [skills.devnads.com](https://skills.devnads.com/) & [app.monad.xyz/agents](https://app.monad.xyz/agents)
* **Hackathon Showcase Reference:** [Monad Blitz Showcase](https://blitz.devnads.com/showcase?event=monad-blitz-jogja)
* **UI & Animation Libraries:**
  * [Anime.js (Animations)](https://animejs.com/)
  * [Kokonut UI (Glassmorphism Components)](https://kokonutui.com/)
  * [Bklit (Modern UI Assets)](https://bklit.com/)
  * [Impeccable Style (Design Guide)](https://impeccable.style/)

---
*Dibuat untuk persiapan Monad Blitz Jakarta 2026. Game Strategy Lossless Yield Pertama di Monad.*
