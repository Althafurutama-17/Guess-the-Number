// ===================== Game Logic =====================
import { state } from "../state.js";
import { LEVEL_RANGE } from "../config.js";

export function tipsFor(secret, guess, level) {
  const tips = [];
  if (guess < secret) tips.push("🔼 Terlalu kecil");
  else if (guess > secret) tips.push("🔽 Terlalu besar");
  tips.push("🔢 Angkanya " + (secret % 2 ? "ganjil" : "genap"));
  tips.push("➗ Habis dibagi 3: " + (secret % 3 === 0 ? "Ya" : "Tidak"));
  if (level === "brain") {
    const digits = String(secret).split("").map(Number);
    tips.push("✖ Hasil Perkalian Digit: " + digits.reduce((a, b) => a * b, 1));
    tips.push("− Pengurangan Digit dari kiri ke Kanan: " + digits.reduce((a, b) => a - b));
    tips.push("∑ Penjumlahan dari Digit: " + digits.reduce((a, b) => a + b, 0));
  }
  return tips;
}

export function randInRange(level) {
  const { min, max } = LEVEL_RANGE[level];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function newGame() {
  state.secret1 = randInRange(state.level);
  if (state.mode === "double") {
    state.secret2 = randInRange(state.level);
    while (state.secret2 === state.secret1) {
      state.secret2 = randInRange(state.level);
    }
  }
}

export function checkGuess(player, guess) {
  const secret = player === 2 && state.secret2 != null ? state.secret2 : state.secret1;
  const correct = guess === secret;
  const tips = correct ? [] : tipsFor(secret, guess, state.level);
  return { correct, tips };
}
