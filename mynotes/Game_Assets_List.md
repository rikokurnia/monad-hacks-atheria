# Atheria: Yield Wars - Asset Requirements & Design System
**Theme:** Bright Celestial Kingdom (White Marble, Cyan Magic Crystals, Daylight)
**Graphic Style:** Clean 2D Isometric (Images) + Looping Cinematic Video (Background)

---

## 1. UI Design System (Colors & Typography)
* **Primary Color (Magic/Yield/Crystals):** Bright Cyan (`#00E5FF` sampai `#4DFFFF`)
* **Secondary Color (Architecture Trim/Premium):** Polished Gold (`#D4AF37` / `#F1C40F`)
* **Background/Glass Panels:** **Light Frosted Glass** / Putih Transparan (`rgba(255, 255, 255, 0.6)`) dengan *border* tipis warna Emas atau Cyan. (Sesuai dengan gambar, UI-nya *Light Mode*, bukan *Dark Mode*).
* **Text / Primary Font:** `Inter` atau `Space Grotesk` (Warna teks utama hitam/abu-abu tua ` #1F2937` agar terbaca di UI yang terang).
* **Heading / Kingdom Font:** `Cinzel` atau `Playfair Display` (Hanya untuk logo / nama markas).

---

## 2. Video Assets (Latar Belakang Game)
*ATURAN: Hanya untuk layer paling belakang agar game tidak kaku.*
* **`bg_celestial_sky.mp4`** 
  * **Ukuran:** 1920x1080 (16:9)
  * **Prompt Generator (RunwayML / Luma / Midjourney):** `A looping cinematic video of a bright celestial sky, floating white marble islands in the distance, glowing cyan magic particles slowly drifting in the air, bright daylight, hyper-realistic, 4k, serene atmosphere --ar 16:9`

---

## 3. Image Assets: Peta & Bangunan (Static Transparent PNG)
*ATURAN: Semua background harus dihapus (Transparent PNG) agar bisa ditumpuk di dalam game engine.*

### A. Hex Grid Tiles (Alas Peta)
* **Ukuran:** 256x256 pixel (Square 1:1)
* **`tile_marble.png` (Ubin Markas):** 
  * **Prompt:** `A single 2D isometric hexagonal tile made of pristine white marble with glowing cyan magic runes carved into it, white background, clean vector game asset style --ar 1:1`
* **`tile_grass.png` (Ubin Area Luar):** 
  * **Prompt:** `A single 2D isometric hexagonal tile of bright green magical grass with tiny glowing blue flowers, white background, clean vector game asset style --ar 1:1`

### B. Bangunan & Pertahanan (Buildings)
* **Ukuran:** 512x512 pixel (Square 1:1)
* **`bld_citadel_vault.png` (Markas Utama / Vault):** 
  * **Prompt:** `A 2D isometric game asset of a bright celestial kingdom citadel made of white marble and gold, a giant glowing cyan magic crystal floating at the top, white background, clean sleek vector style --ar 1:1`
* **`bld_arcane_tower.png` (Menara Pertahanan):** 
  * **Prompt:** `A 2D isometric game asset of a tall white marble defense tower, a glowing cyan magic orb floating at the pinnacle, gold accents, white background, clean sleek vector style --ar 1:1`

---

## 4. Image Assets: Pasukan / Troops (Sprite Animasi PNG)
*ATURAN: Gunakan fitur "Variation" di AI untuk membuat pose yang sedikit berbeda (berjalan).*
* **Ukuran:** 256x256 pixel (Square 1:1)

### A. Troop 1: Arcane Mage (Pasukan Jubah)
* **`troop_mage_walk_1.png` & `troop_mage_walk_2.png`:** 
  * **Prompt:** `A 2D isometric game character of a celestial mage wearing a flowing white and gold robe, holding a glowing cyan magic staff, walking forward, white background, clean sleek vector style --ar 1:1` *(Note: Minta AI buat variasi jubah berkibar).*
* **`troop_mage_attack.png`:** 
  * **Prompt:** `A 2D isometric game character of a celestial mage in a flowing white robe, pointing a glowing cyan magic staff forward casting a spell, white background, clean sleek vector style --ar 1:1`

### B. Troop 2: Seraph Glider (Pasukan Terbang)
* **`troop_flyer_fly_1.png` & `troop_flyer_fly_2.png`:** 
  * **Prompt:** `A 2D isometric game character of a celestial mechanical angel flying, sleek white armor with glowing cyan energy wings pointing upwards, white background, clean sleek vector style --ar 1:1` *(Note: Ubah posisi sayap ke atas dan ke bawah untuk 2 gambar).*
* **`troop_flyer_attack.png`:** 
  * **Prompt:** `A 2D isometric game character of a celestial mechanical angel flying, sleek white armor, glowing cyan energy wings, shooting a beam of light from its hands, white background, clean sleek vector style --ar 1:1`

---

## 5. Animasi Efek Serangan (Projectiles & Props)
*Efek serangan ditembakkan dari menara/pasukan dan melayang menuju target di dalam kode.*
* **Ukuran:** 128x128 pixel (Square 1:1)

* **`fx_tower_laser.png` (Tembakan Menara - Cyan Laser Beam):**
  * **Warna & Bentuk:** Sinar laser lurus Cyan terang (`#00E5FF`).
  * **Prompt:** `A 2D isometric game asset of a glowing cyan magical laser beam projectile, white background, clean vector style --ar 1:1`

* **`fx_mage_orb.png` (Tembakan Arcane Mage - Golden Magic Orb):**
  * **Warna & Bentuk:** Bola sihir bercahaya warna Emas (`#FFD700`) dengan aura energi melingkar.
  * **Prompt:** `A 2D isometric game asset of a glowing golden arcane energy orb projectile, swirling magic energy, white background, clean vector style --ar 1:1`

* **`fx_flyer_spear.png` (Tembakan Seraph Glider - White Light Bolt):**
  * **Warna & Bentuk:** Tombak/Panah cahaya warna Putih Silau (`#FFFFFF`) berujung tajam.
  * **Prompt:** `A 2D isometric game asset of a glowing bright white radiant bolt of light projectile, sharp energy spear, white background, clean vector style --ar 1:1`

* **`fx_explosion_hit.png` (Efek Ledakan saat Serangan Kena Target):**
  * **Prompt:** `A 2D isometric game asset of a glowing cyan and gold magic burst explosion, white background, clean vector style --ar 1:1`

* **`fx_yield_coin.png` (Koin yang melayang saat berhasil merampas Yield):**
  * **Prompt:** `A 2D isometric game asset of a glowing gold USDC crypto coin with ethereal glowing aura, white background, clean vector style --ar 1:1`

