# 📦 Arsip Level (Test of Luck & Skill Based)

Dokumen ini mengarsipkan dua level yang **dihapus dari kode** pada **v2.2** saat fokus pengembangan beralih ke **Mode Pro (Brain Burn)**. Level-level ini tidak lagi tersedia di UI, namun disimpan di sini sebagai referensi desain & logika.

---

## 🎲 Test of Luck (1–10)

- **Range:** 1–10
- **Karakter:** Murni hoki, tips paling sedikit.
- **Tips yang diberikan:**
  - 🔼 Terlalu kecil / 🔽 Terlalu besar (arah saja)
  - 🔢 Angkanya ganjil/genap
- **Catatan kode (arsip):** Pada `tipsFor()`, level `luck` langsung `return tips` setelah tip arah — tidak ada tip tambahan.

```js
// Arsip logika (sudah dihapus dari app.js)
const LEVEL_RANGE = {
  luck: { min: 1, max: 10 },
  // ...
};

function tipsFor(secret, guess, level) {
  const tips = [];
  if (guess < secret) tips.push("🔼 Terlalu kecil");
  else if (guess > secret) tips.push("🔽 Terlalu besar");
  if (level === "luck") return tips; // hanya arah
  // ...
}
```

---

## 🎯 Skill Based (10–100)

- **Range:** 10–100
- **Karakter:** Campuran hoki & logika dasar.
- **Tips yang diberikan:**
  - 🔼 Terlalu kecil / 🔽 Terlalu besar (arah)
  - 🔢 Angkanya ganjil/genap
  - ➗ Habis dibagi 3: Ya/Tidak
  - 🌟 Bilangan prima: Ya/Tidak
- **Catatan kode (arsip):** Tips prima hanya muncul di level `skill` (tidak di `brain`).

```js
// Arsip logika (sudah dihapus dari app.js)
const LEVEL_RANGE = {
  skill: { min: 10, max: 100 },
  // ...
};

// Dalam tipsFor():
tips.push("🔢 Angkanya " + (secret % 2 ? "ganjil" : "genap"));
if (level === "skill" || level === "brain") {
  tips.push("➗ Habis dibagi 3: " + (secret % 3 === 0 ? "Ya" : "Tidak"));
  if (level === "skill") {
    tips.push("🌟 Bilangan prima: " + (isPrime(secret) ? "Ya" : "Tidak"));
  }
}
```

---

## 🧠 Mode Pro (Brain Burn) — Level Aktif

Sebagai pembanding, level yang **tetap ada** di kode:

- **Range:** 100–1000
- **Tips:** arah + ganjil/genap + habis dibagi 3 + perkalian digit + pengurangan digit (kiri→kanan) + penjumlahan digit.

---

## Ringkasan Perubahan v2.2

| Item | Status |
|------|--------|
| UI pilihan level (`#levelChoices`) | Dihapus dari `index.html` |
| `luck` & `skill` di `LEVEL_RANGE` | Dihapus dari `app.js` |
| `luck` & `skill` di `LEVEL_LABEL` | Dihapus dari `app.js` |
| Cabang `luck`/`skill` di `tipsFor()` | Dihapus dari `app.js` |
| Default `state.level` | Diubah ke `"brain"` |
| Arsip dokumentasi | Disimpan di `arsip-level.md` ini |
