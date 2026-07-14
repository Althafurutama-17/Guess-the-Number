# 🔢 Math Duel — Tebak Angka

Game tebak angka rahasia **1–100** berbasis web (HTML + CSS + JavaScript murni, **tanpa backend/server**).
Bisa dimainkan sendiri (Single) atau berdua di satu device (Double) dengan sistem *lock* & *reveal* bersamaan.

## Fitur
- 🎯 **Mode Single** — tebak sendiri, tiap tebakan salah muncul 1 tips baru (akumulatif).
- 👥 **Mode Double** — 2 pemain, 1 device. Masing-masing angka rahasia **berbeda**. Kunci jawaban dengan `Enter`, hasil dibuka **bersamaan** saat keduanya lock.
- 📘 **3 Level (range angka + tips)**:
  - **🎲 Test of Luck (1–10)**: arah (besar/kecil) + ganjil/genap — murni hoki
  - **🎯 Skill Based (1–100)**: + habis dibagi 3 + bilangan prima
  - **🧠 Brain Burn (100–1000)**: + jumlah digit + akar dibulatkan
- Di Double, angka rahasia **tetap sama tiap ronde sampai ada pemenang**; tips akumulatif lintas ronde.

## Cara Main (lokal)
Buka `index.html` langsung di browser (double-click), atau lewat server statis:
```bash
# opsional, kalau mau lewat http
python -m http.server 8000
# buka http://localhost:8000
```
Tidak perlu install apa-apa — game 100% berjalan di browser.

## Deploy ke GitHub Pages (gratis)
1. Push repo ini ke GitHub.
2. **Settings → Pages** → Source: `main` (atau `master`), folder: `/root`.
3. Tunggu ±1 menit → link `https://<username>.github.io/<repo>/`.
4. Share link → orang lain buka di device apa pun, langsung main.

## Struktur File
```
index.html   # UI & menu
style.css    # styling
app.js       # semua logika game (generate angka + tips + mekanik)
```

## Catatan
- Game ini *single-device* untuk mode Double (2 orang bergantian di 1 keyboard), bukan multiplayer online.
- Karena tanpa server, angka rahasia di-generate di sisi browser (`Math.random`).
