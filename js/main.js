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
// P1 -> P2 -> Lihat Hasil -> Ronde Baru
// Handler terpusat agar tidak ada double-trigger antar listener.
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  if ($("double").classList.contains("hidden")) return; // hanya saat layar double aktif
  const t = e.target;
  if (t && t.tagName === "BUTTON" && t.id !== "doubleNext") return; // jangan tabrakan dgn tombol lain
  if (state.doublePhase === "p1") {
    const input = $("p1Input");
    if (input.value.trim() === "") return;
    lockPlayer("p1");
    state.doublePhase = "p2";
    $("p2Input").focus();
  } else if (state.doublePhase === "p2") {
    const input = $("p2Input");
    if (input.value.trim() === "") return;
    lockPlayer("p2"); // memicu reveal saat keduanya lock
    state.doublePhase = "result";
  } else if (state.doublePhase === "result") {
    nextDouble();
  }
});

// ===================== Init =====================
showScreen("menu");
