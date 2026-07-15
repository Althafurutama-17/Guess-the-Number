// ===================== Double Mode =====================
import { state } from "../state.js";
import { LEVEL_LABEL } from "../config.js";
import { $, showScreen, clearTipTimers, revealTipsOneByOne } from "../dom.js";
import { newGame, checkGuess } from "./logic.js";
import { applyLevelToInputs } from "./single.js";

export function startDouble() {
  state.p1Score = 0;
  state.p2Score = 0;
  state.p1TipCount = 0;
  state.p2TipCount = 0;
  state.doubleWinner = false;
  state.doubleRound = 1;
  state.doubleTurn = 1;
  clearTipTimers();
  $("p1Score").textContent = "0";
  $("p2Score").textContent = "0";
  $("doubleLevel").textContent = LEVEL_LABEL[state.level];
  applyLevelToInputs();
  showScreen("double");
  // buat angka rahasia sekali saja, dipakai terus sampai ada pemenang
  newGame();
  resetDoubleRound();
}

export function resetDoubleRound() {
  clearTipTimers();
  state.p1Locked = false;
  state.p2Locked = false;
  ["p1", "p2"].forEach((p) => {
    $(`${p}Input`).value = "";
    $(`${p}Input`).disabled = false;
    $(`${p}Status`).textContent = "Belum Dikunci";
    $(`${p}Status`).classList.remove("locked");
    $(`${p}Result`).textContent = "";
    $(`${p}Result`).className = "result hidden";
    $(`${p}Tips`).innerHTML = "";
    $(`${p}Input`).closest(".player").classList.remove("locked");
  });
  $("doubleFeedback").textContent = "";
  $("doubleFeedback").className = "feedback";
  updateRoundTurnDisplay();
  $("doubleNext").classList.add("hidden");
  $("doubleHint").textContent = "Tekan Enter untuk mengunci jawaban";
  $("p1Input").focus();
}

export function nextDouble() {
  // Hanya dipanggil saat ada pemenang (tombol Ronde Baru / Enter di fase result).
  // Mulai Round BARU: secret BARU, tips reset, Turn reset ke 1.
  state.p1TipCount = 0;
  state.p2TipCount = 0;
  state.doubleWinner = false;
  state.doubleRound += 1;
  state.doubleTurn = 1;
  newGame();
  resetDoubleRound();
}

export function lockPlayer(p) {
  const input = $(`${p}Input`);
  if (input.disabled) return;
  if (input.value.trim() === "") return;
  state[`${p}Locked`] = true;
  input.disabled = true;
  $(`${p}Status`).textContent = "🔒 Locked";
  $(`${p}Status`).classList.add("locked");
  input.closest(".player").classList.add("locked");
  if (state.p1Locked && state.p2Locked) revealDouble();
}

export function updateRoundTurnDisplay() {
  $("doubleRoundTurn").textContent = `Round ${state.doubleRound} · Turn ${state.doubleTurn}`;
}

export function revealDouble() {
  clearTipTimers();
  const p1 = parseInt($("p1Input").value.trim(), 10);
  const p2 = parseInt($("p2Input").value.trim(), 10);
  const r1 = checkGuess(1, p1);
  const r2 = checkGuess(2, p2);

  // tampilkan hasil bersamaan
  showResult("p1", r1.correct, p1);
  showResult("p2", r2.correct, p2);

  // tips akumulatif per Turn (secret sama dalam 1 Round)
  if (!r1.correct) {
    state.p1TipCount = Math.min(state.p1TipCount + 1, r1.tips.length);
    revealTipsOneByOne("p1Tips", r1.tips.slice(0, state.p1TipCount));
  }
  if (!r2.correct) {
    state.p2TipCount = Math.min(state.p2TipCount + 1, r2.tips.length);
    revealTipsOneByOne("p2Tips", r2.tips.slice(0, state.p2TipCount));
  }

  if (r1.correct && !r2.correct) {
    state.p1Score += 1;
    state.doubleWinner = true;
    $("doubleFeedback").textContent = "🟦 Pemain 1 menang ronde ini!";
    $("doubleFeedback").className = "feedback good";
    showLoserAnswer("p2", state.secret2);
    endRound();
  } else if (r2.correct && !r1.correct) {
    state.p2Score += 1;
    state.doubleWinner = true;
    $("doubleFeedback").textContent = "🟥 Pemain 2 menang ronde ini!";
    $("doubleFeedback").className = "feedback good";
    showLoserAnswer("p1", state.secret1);
    endRound();
  } else if (r1.correct && r2.correct) {
    $("doubleFeedback").textContent = "🤝 Seri! Dua-duanya benar.";
    $("doubleFeedback").className = "feedback";
    continueSameRound();
  } else {
    $("doubleFeedback").textContent = "🤝 Seri! Dua-duanya salah — Angka Rahasia tetap sama, coba lagi!";
    $("doubleFeedback").className = "feedback";
    continueSameRound();
  }
  $("p1Score").textContent = state.p1Score;
  $("p2Score").textContent = state.p2Score;
}

// Ada pemenang -> tampilkan tombol untuk mulai Round BARU
export function endRound() {
  $("doubleNext").classList.remove("hidden");
  $("doubleHint").textContent = "⌨ Enter untuk ronde baru →";
}

// Seri (draw) -> LANJUT Turn berikutnya dalam Round yang SAMA
// (secret tetap, tips akumulatif). Bukan round baru.
export function continueSameRound() {
  state.doubleTurn += 1;
  updateRoundTurnDisplay();
  ["p1", "p2"].forEach((p) => {
    $(`${p}Input`).value = "";
    $(`${p}Input`).disabled = false;
    $(`${p}Status`).textContent = "Belum Dikunci";
    $(`${p}Status`).classList.remove("locked");
    $(`${p}Result`).textContent = "";
    $(`${p}Result`).className = "result hidden";
    $(`${p}Input`).closest(".player").classList.remove("locked");
  });
  state.p1Locked = false;
  state.p2Locked = false;
  $("doubleHint").textContent = `Tekan Enter untuk mengunci jawaban`;
  $("p1Input").focus();
}

export function showResult(p, correct, guess) {
  const el = $(`${p}Result`);
  el.textContent = correct ? `✅ Benar (${guess})` : `❌ Salah (${guess})`;
  el.className = `result reveal ${correct ? "good" : "bad"}`;
}

export function showLoserAnswer(p, secret) {
  const el = $(`${p}Result`);
  el.textContent = `❌ Salah — Jawaban benar: ${secret}`;
  el.className = "result reveal bad";
}
