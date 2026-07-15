// ===================== State =====================
const state = {
  mode: "single",
  level: "brain",
  secret1: null,
  secret2: null,
  // single
  score: 0,
  tries: 0,
  singleTipCount: 0,
  // double
  p1Score: 0,
  p2Score: 0,
  p1Locked: false,
  p2Locked: false,
  p1TipCount: 0,
  p2TipCount: 0,
  doubleWinner: false,
  doublePhase: "p1", // p1 -> p2 -> result (alur Enter)
};

const LEVEL_LABEL = { brain: "Pro (Brain Burn)" };

// ===================== Logika game =====================
function tipsFor(secret, guess, level) {
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

const LEVEL_RANGE = {
  brain: { min: 100, max: 1000 },
};

function randInRange(level) {
  const { min, max } = LEVEL_RANGE[level];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newGame() {
  state.secret1 = randInRange(state.level);
  if (state.mode === "double") {
    state.secret2 = randInRange(state.level);
    while (state.secret2 === state.secret1) {
      state.secret2 = randInRange(state.level);
    }
  }
}

function checkGuess(player, guess) {
  const secret = player === 2 && state.secret2 != null ? state.secret2 : state.secret1;
  const correct = guess === secret;
  const tips = correct ? [] : tipsFor(secret, guess, state.level);
  return { correct, tips };
}

// ===================== Helpers DOM =====================
const $ = (id) => document.getElementById(id);

function showScreen(id) {
  ["menu", "single", "double"].forEach((s) => $(s).classList.add("hidden"));
  $(id).classList.remove("hidden");
}

function renderTips(listId, tips) {
  const ul = $(listId);
  ul.innerHTML = "";
  tips.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    li.classList.add("tip-in");
    ul.appendChild(li);
  });
}

// Tampilkan tips satu per satu dengan jeda (untuk mode double saat reveal)
let tipTimers = [];
function clearTipTimers() {
  tipTimers.forEach((t) => clearTimeout(t));
  tipTimers = [];
}

function revealTipsOneByOne(listId, tips, delay = 450) {
  const ul = $(listId);
  ul.innerHTML = "";
  tips.forEach((t, i) => {
    const id = setTimeout(() => {
      const li = document.createElement("li");
      li.textContent = t;
      li.classList.add("tip-in");
      ul.appendChild(li);
    }, i * delay);
    tipTimers.push(id);
  });
}

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

// ===================== Single Mode =====================
function applyLevelToInputs() {
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

function startSingle() {
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

function nextSingle() {
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

function submitSingle() {
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

$("singleSubmit").addEventListener("click", submitSingle);
$("singleInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitSingle();
});
$("singleNext").addEventListener("click", nextSingle);
$("singleMenu").addEventListener("click", () => showScreen("menu"));

// ===================== Double Mode =====================
function startDouble() {
  state.p1Score = 0;
  state.p2Score = 0;
  state.p1TipCount = 0;
  state.p2TipCount = 0;
  state.doubleWinner = false;
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

function resetDoubleRound() {
  clearTipTimers();
  state.p1Locked = false;
  state.p2Locked = false;
  ["p1", "p2"].forEach((p) => {
    $(`${p}Input`).value = "";
    $(`${p}Input`).disabled = false;
    $(`${p}Status`).textContent = "Belum lock";
    $(`${p}Status`).classList.remove("locked");
    $(`${p}Result`).textContent = "";
    $(`${p}Result`).className = "result hidden";
    $(`${p}Tips`).innerHTML = "";
    $(`${p}Input`).closest(".player").classList.remove("locked");
  });
  $("doubleFeedback").textContent = "";
  $("doubleFeedback").className = "feedback";
  $("doubleNext").classList.add("hidden");
  state.doublePhase = "p1";
  $("doubleHint").textContent = "⌨ P1 ketik angka lalu Enter → fokus pindah ke P2";
  $("p1Input").focus();
}

function nextDouble() {
  if (state.doubleWinner) {
    // ada pemenang -> angka baru, reset tip count
    state.p1TipCount = 0;
    state.p2TipCount = 0;
    state.doubleWinner = false;
    newGame();
  }
  // seri (dua-duanya salah): angka tetap sama agar tips akumulatif 1 per ronde
  resetDoubleRound();
  // cegah pemrosesan ganda: sembunyikan tombol sampai ronde berikutnya siap
  $("doubleNext").classList.add("hidden");
}

function lockPlayer(p) {
  const input = $(`${p}Input`);
  if (input.disabled) return;
  if (input.value.trim() === "") return;
  state[`${p}Locked`] = true;
  input.disabled = true;
  $(`${p}Status`).textContent = "🔒 Locked";
  $(`${p}Status`).classList.add("locked");
  input.closest(".player").classList.add("locked");
  if (state.p1Locked && state.p2Locked) revealDouble();
  else if (p === "p1") $("doubleHint").textContent = "⌨ P2 ketik angka lalu Enter → lihat hasil";
}

function revealDouble() {
  clearTipTimers();
  const p1 = parseInt($("p1Input").value.trim(), 10);
  const p2 = parseInt($("p2Input").value.trim(), 10);
  const r1 = checkGuess(1, p1);
  const r2 = checkGuess(2, p2);

  // tampilkan hasil bersamaan
  showResult("p1", r1.correct, p1);
  showResult("p2", r2.correct, p2);

  // tips akumulatif: tiap ronde salah nambah 1 tips (satu per satu, bukan sekaligus)
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
    // tampilkan jawaban benar untuk pemain yang kalah (P2)
    showLoserAnswer("p2", state.secret2);
  } else if (r2.correct && !r1.correct) {
    state.p2Score += 1;
    state.doubleWinner = true;
    $("doubleFeedback").textContent = "🟥 Pemain 2 menang ronde ini!";
    $("doubleFeedback").className = "feedback good";
    // tampilkan jawaban benar untuk pemain yang kalah (P1)
    showLoserAnswer("p1", state.secret1);
  } else if (r1.correct && r2.correct) {
    $("doubleFeedback").textContent = "🤝 Seri! Dua-duanya benar.";
    $("doubleFeedback").className = "feedback";
  } else {
    $("doubleFeedback").textContent = "🤝 Seri! Dua-duanya salah. Angka tetap sama, coba lagi!";
    $("doubleFeedback").className = "feedback";
  }
  $("p1Score").textContent = state.p1Score;
  $("p2Score").textContent = state.p2Score;
  $("doubleNext").classList.remove("hidden");
  state.doublePhase = "result";
  $("doubleHint").textContent = "⌨ Enter untuk ronde berikutnya →";
}

function showResult(p, correct, guess) {
  const el = $(`${p}Result`);
  el.textContent = correct ? `✅ Benar (${guess})` : `❌ Salah (${guess})`;
  el.className = `result reveal ${correct ? "good" : "bad"}`;
}

function showLoserAnswer(p, secret) {
  const el = $(`${p}Result`);
  el.textContent = `❌ Salah — Jawaban benar: ${secret}`;
  el.className = "result reveal bad";
}

// Alur Enter tanpa mouse: P1 -> P2 -> Lihat Hasil -> Ronde Berikutnya
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

$("doubleNext").addEventListener("click", nextDouble);
$("doubleMenu").addEventListener("click", () => {
  clearTipTimers();
  showScreen("menu");
});

// ===================== Init =====================
showScreen("menu");
