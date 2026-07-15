// ===================== DOM Helpers =====================
export const $ = (id) => document.getElementById(id);

export function showScreen(id) {
  ["menu", "single", "double"].forEach((s) => $(s).classList.add("hidden"));
  $(id).classList.remove("hidden");
}

export function renderTips(listId, tips) {
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
export function clearTipTimers() {
  tipTimers.forEach((t) => clearTimeout(t));
  tipTimers = [];
}

export function revealTipsOneByOne(listId, tips, delay = 450) {
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
