# 🔢 Math Duel — Tebak Angka

Game tebak angka rahasia berbasis web (HTML + CSS + JavaScript murni, **tanpa backend/server**).
Range angka bervariasi tergantung level (1–10 / 1–100 / 100–1000).
Bisa dimainkan sendiri (Single) atau berdua di satu device (Double) dengan sistem *lock* & *reveal* bersamaan.

## Fitur
- 🎯 **Mode Single** — tebak sendiri, tiap tebakan salah muncul 1 tips baru (akumulatif).
- 👥 **Mode Double** — 2 pemain, 1 device. Masing-masing angka rahasia **berbeda**. Kunci jawaban dengan `Enter`, hasil dibuka **bersamaan** saat keduanya lock.
- 📘 **3 Level (range angka + tips)**:
  - **🎲 Test of Luck (1–10)**: arah (besar/kecil) + ganjil/genap — murni hoki
  - **🎯 Skill Based (10–100)**: + habis dibagi 3 + bilangan prima
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

## 📌 Riwayat Versi

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| **v1.0** | — | Rilis awal. Mode Single & Double. 3 level: **Mudah (1–100)**, **Normal (1–100)**, **Pro (1–100)** dengan tips matematika bertingkat. |
| **v2.0** | 2026-07-14 | **Diubah:** Sistem level dirombak total menjadi 3 level berbasis range angka — 🎲 **Test of Luck (1–10)**, 🎯 **Skill Based (1–100)**, 🧠 **Brain Burn (100–1000)**. Tips disesuaikan per level (Luck = dasar, Skill = + bagi 3 & prima, Brain = + jumlah digit & akar). Input `min`/`max`/`placeholder` mengikuti level secara dinamis. **Dihapus:** level Mudah/Normal/Pro lama. **Ditambah:** tabel riwayat versi ini. |
| **v2.1** | 2026-07-14 | **Diubah:** range **Skill Based** menjadi **10–100**. Teks range (subtitle, pertanyaan Single & Double) kini dinamis mengikuti level (tidak lagi hardcoded 1–100). **Ditambah:** di mode Double, bila satu pemain menang, jawaban benar ditampilkan untuk pemain yang kalah. |
