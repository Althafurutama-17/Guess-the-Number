# 🔢 Math Duel — Number Guessing Game

A web-based secret number guessing game (plain HTML + CSS + JavaScript, **no backend/server**).
The number range varies by level (1–10 / 1–100 / 100–1000).
Play alone (Single) or with a friend on one device (Double) using a *lock* & *reveal* system.

## Features
- 🎯 **Single Mode** — guess on your own; each wrong guess reveals 1 new tip (cumulative).
- 👥 **Double Mode** — 2 players, 1 device. Each player has a **different** secret number. Lock your answer with `Enter`; results are revealed **together** once both are locked.
- 🧠 **Pro Mode (Brain Burn, 100–1000)** — the only active level. Tips: direction (higher/lower), odd/even, divisible by 3, digit product, left-to-right digit subtraction, and digit sum.
- 🔁 **Round & Turn (Double):** 1 **Round** = 1 secret number. Each **Turn** = P1 & P2 guess once (tips cumulative per Turn). A Round ends when there is a winner; `Enter` / the **New Round** button starts the next Round with a **NEW** secret number and Turn reset to 1. A draw → continues to the next Turn within the **same** Round (number stays the same).

> 📦 The **Test of Luck** and **Skill Based** levels were removed from the code (see `arsip-level.md` for the archived documentation).

## How to Run (locally)
The game uses **ES Modules** (`<script type="module">`), so it **must** be served via a static server (double-clicking `file://` will not work due to CORS):
```bash
# from the project folder
python -m http.server 8000
# open http://localhost:8000
```
No installation needed — the game runs 100% in the browser. (On GitHub Pages it runs directly over HTTPS without a local server.)

## File Structure
```
index.html
css/
  style.css
  icons/        # local SVG icons (offline)
js/
  main.js        # entry point: init, listeners, Enter flow
  config.js      # LEVEL_LABEL, LEVEL_RANGE
  state.js       # state object (singleton)
  dom.js         # $, showScreen, renderTips, revealTipsOneByOne
  game/
    logic.js     # tipsFor, randInRange, newGame, checkGuess
    single.js    # startSingle, nextSingle, submitSingle
    double.js    # startDouble, resetDoubleRound, nextDouble,
                # revealDouble, endRound, continueSameRound, lockPlayer
```

## Notes
- This is a *single-device* game for Double mode (2 people take turns on 1 keyboard), not online multiplayer.
- Since there is no server, the secret number is generated in the browser (`Math.random`).

## 📌 Version History

**v1.0 (Initial Release)**
- Released the first version with Single & Double modes.
- Shipped 3 levels — **Easy (1–100)**, **Normal (1–100)**, **Pro (1–100)** — with tiered math tips.

**v2.0 (14 July 2026)**
- Overhauled the level system into 3 range-based levels — 🎲 **Test of Luck (1–10)**, 🎯 **Skill Based (1–100)**, 🧠 **Brain Burn (100–1000)**.
- Adjusted tips per level (Luck = basic, Skill = + divisible by 3 & prime, Brain = + digit sum & root).
- Made input `min`/`max`/`placeholder` follow the level dynamically.
- Removed the old Easy/Normal/Pro levels.
- Added this version history.

**v2.1 (14 July 2026)**
- Set the **Skill Based** range to **10–100**.
- Made the range text (subtitle, Single & Double questions) dynamic per level instead of hardcoded to 1–100.
- Showed the correct answer to the losing player when a player wins in Double mode.

**v2.2 (15 July 2026)**
- Removed the **Test of Luck** and **Skill Based** levels from the code and archived both to `arsip-level.md`.
- Removed the level picker UI; the game now uses Pro/Brain Burn (100–1000) directly.
- Simplified the game to Pro mode.
- Made the Enter button multi-purpose.
- Removed irrelevant code and files.

**v2.3 (15 July 2026)**
- Added terms "Round" and "Turn".
- Fixed bug on number not changing after next round.
- Split files into several folders of files.
- Added Iconify SVG icons (local, offline).
- Enhanced visuals with icons.
