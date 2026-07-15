// ===================== Entry Point =====================
import { state } from "./state.js";
import { $, showScreen, clearTipTimers } from "./dom.js";
import { startSingle, submitSingle, nextSingle } from "./game/single.js";
import { startDouble, nextDouble, lockPlayer } from "./game/double.js";

// ===================== Menu =====================
$("modeChoices").addEventListener("click", (e) => {
  const btn = e.target.closest(".choice");
  if (!btn) return;
  $("modeChoices").querySelectorAll(".choice").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  state.mode = btn.dataset.mode;
});

$("startBtn").addEventListener("click", () => {
  if (state.mode === "single") startSingle();
  else startDouble();
});

// ===================== Single listeners =====================
$("singleSubmit").addEventListener("click", submitSingle);
$("singleInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitSingle();
});
$("singleNext").addEventListener("click", nextSingle);
$("singleMenu").addEventListener("click", () => showScreen("menu"));

// ===================== Double listeners =====================
$("doubleNext").addEventListener("click", nextDouble);
$("doubleMenu").addEventListener("click", () => {
  clearTipTimers();
  showScreen("menu");
});

// ===================== Enter flow (no mouse) =====================
// P1 dan P2 bisa lock dalam urutan apapun. Reveal saat keduanya locked.
// Handler terpusat agar tidak ada double-trigger antar listener.
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  if ($("double").classList.contains("hidden")) return; // hanya saat layar double aktif
  const t = e.target;
  if (t && t.tagName === "BUTTON" && t.id !== "doubleNext") return; // jangan tabrakan dgn tombol lain

  // Tentukan player berdasarkan input yang fokus
  const activeInput = document.activeElement;
  if (activeInput === $("p1Input") && !state.p1Locked) {
    if (activeInput.value.trim() === "") return;
    lockPlayer("p1");
    if (state.p2Locked) return; // reveal sudah dipicu di lockPlayer
    $("p2Input").focus();
  } else if (activeInput === $("p2Input") && !state.p2Locked) {
    if (activeInput.value.trim() === "") return;
    lockPlayer("p2");
    if (state.p1Locked) return; // reveal sudah dipicu di lockPlayer
    $("p1Input").focus();
  } else if (state.doubleWinner) {
    nextDouble();
  }
});

// ===================== Init =====================
showScreen("menu");
