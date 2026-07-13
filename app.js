// ===================== State =====================
const state = {
  mode: "single",
  level: "mudah",
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
};

const LEVEL_LABEL = { mudah: "Mudah", normal: "Normal", pro: "Pro" };

// ===================== Logika game (dulunya di backend Flask) =====================
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function tipsFor(secret, guess, level) {
  const tips = [];
  if (guess < secret) tips.push("🔼 Terlalu kecil");
  else if (guess > secret) tips.push("🔽 Terlalu besar");
  tips.push("🔢 Angkanya " + (secret % 2 ? "ganjil" : "genap"));
  if (level === "normal" || level === "pro") {
    tips.push("➗ Habis dibagi 3: " + (secret % 3 === 0 ? "Ya" : "Tidak"));
    tips.push("🌟 Bilangan prima: " + (isPrime(secret) ? "Ya" : "Tidak"));
  }
  if (level === "pro") {
    tips.push("∑ Jumlah digit: " + String(secret).split("").reduce((a, b) => a + Number(b), 0));
    tips.push("√ Akar dibulatkan: " + Math.round(Math.sqrt(secret)));
  }
  return tips;
}

function newGame() {
  state.secret1 = Math.floor(Math.random() * 100) + 1;
  if (state.mode === "double") {
    state.secret2 = Math.floor(Math.random() * 100) + 1;
    while (state.secret2 === state.secret1) {
      state.secret2 = Math.floor(Math.random() * 100) + 1;
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

$("levelChoices").addEventListener("click", (e) => {
  const btn = e.target.closest(".choice");
  if (!btn) return;
  $("levelChoices").querySelectorAll(".choice").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  state.level = btn.dataset.level;
});

$("startBtn").addEventListener("click", () => {
  if (state.mode === "single") startSingle();
  else startDouble();
});

// ===================== Single Mode =====================
function startSingle() {
  state.score = 0;
  state.tries = 0;
  state.singleTipCount = 0;
  $("singleScore").textContent = "0";
  $("singleTries").textContent = "0";
  $("singleLevel").textContent = LEVEL_LABEL[state.level];
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
    $("singleFeedback").textContent = "❌ Belum tepat, lihat tips di bawah 👇";
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
  // kalau belum ada pemenang, angka tetap sama, tip count dipertahankan
  resetDoubleRound();
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
}

function revealDouble() {
  const p1 = parseInt($("p1Input").value.trim(), 10);
  const p2 = parseInt($("p2Input").value.trim(), 10);
  const r1 = checkGuess(1, p1);
  const r2 = checkGuess(2, p2);

  // tampilkan hasil bersamaan
  showResult("p1", r1.correct, p1);
  showResult("p2", r2.correct, p2);

  // tips akumulatif lintas ronde: tiap ronde salah nambah 1 tips (sampai habis)
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
  } else if (r2.correct && !r1.correct) {
    state.p2Score += 1;
    state.doubleWinner = true;
    $("doubleFeedback").textContent = "🟥 Pemain 2 menang ronde ini!";
    $("doubleFeedback").className = "feedback good";
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
}

function showResult(p, correct, guess) {
  const el = $(`${p}Result`);
  el.textContent = correct ? `✅ Benar (${guess})` : `❌ Salah (${guess})`;
  el.className = `result reveal ${correct ? "good" : "bad"}`;
}

$("p1Input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") lockPlayer("p1");
});
$("p2Input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") lockPlayer("p2");
});
$("doubleNext").addEventListener("click", nextDouble);
$("doubleMenu").addEventListener("click", () => {
  clearTipTimers();
  showScreen("menu");
});

// ===================== Init =====================
showScreen("menu");
