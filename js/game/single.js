// ===================== Single Mode =====================
import { state } from "../state.js";
import { LEVEL_LABEL, LEVEL_RANGE } from "../config.js";
import { $, showScreen, renderTips } from "../dom.js";
import { newGame, checkGuess } from "./logic.js";

export function applyLevelToInputs() {
  const { min, max } = LEVEL_RANGE[state.level];
  const ph = `${min}–${max}`;
  ["singleInput", "p1Input", "p2Input"].forEach((id) => {
    const el = $(id);
    el.min = min;
    el.max = max;
    el.placeholder = ph;
  });
  // perbarui teks range di baris sendiri (di layar permainan, bukan beranda)
  const rangeText = `Range angka: ${min}–${max}`;
  $("singleRange").textContent = rangeText;
  $("doubleRange").textContent = rangeText;
}

export function startSingle() {
  state.score = 0;
  state.tries = 0;
  state.singleTipCount = 0;
  $("singleScore").textContent = "0";
  $("singleTries").textContent = "0";
  $("singleLevel").textContent = LEVEL_LABEL[state.level];
  applyLevelToInputs();
  showScreen("single");
  nextSingle();
}

export function nextSingle() {
  $("singleFeedback").textContent = "";
  $("singleFeedback").className = "feedback";
  $("singleTips").innerHTML = "";
  state.singleTipCount = 0;
  $("singleInput").value = "";
  $("singleInput").disabled = false;
  $("singleSubmit").disabled = false;
  $("singleNext").classList.add("hidden");
  $("singleInput").focus();
  newGame();
}

export function submitSingle() {
  const val = $("singleInput").value.trim();
  if (val === "") return;
  const guess = parseInt(val, 10);
  if (isNaN(guess)) return;
  const out = checkGuess(1, guess);
  state.tries += 1;
  $("singleTries").textContent = state.tries;

  if (out.correct) {
    state.score += 1;
    $("singleInput").disabled = true;
    $("singleSubmit").disabled = true;
    const fb = $("singleFeedback");
    fb.textContent = `✅ Benar! Angkanya ${guess}`;
    fb.className = "feedback good";
    $("singleNext").classList.remove("hidden");
  } else {
    // tips keluar satu per satu: tiap tebakan salah nambah 1 tips baru
    state.singleTipCount = Math.min(state.singleTipCount + 1, out.tips.length);
    const shown = out.tips.slice(0, state.singleTipCount);
    renderTips("singleTips", shown);
    $("singleFeedback").textContent = "❌ Belum tepat, lihat tips di atas 👆";
    $("singleFeedback").className = "feedback bad";
    $("singleInput").value = "";
    $("singleInput").focus();
  }
  $("singleScore").textContent = state.score;
}
