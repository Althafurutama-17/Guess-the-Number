"""
Math Duel — Tebak Angka 1-100
Mode: Single & Double (1 device, lock bareng, reveal bareng)
Level: Mudah (SMP), Normal (SMA), Pro (Kuliah) -> tips matematika makin banyak
Di mode Double, tiap pemain punya angka rahasia BERBEDA (arah hint otomatis beda).
"""
import random
import uuid
from flask import Flask, request, jsonify, send_file, send_from_directory

app = Flask(__name__)

# id -> {"level":..., "secret1":int, "secret2":int|None}
_games = {}

LEVELS = ["mudah", "normal", "pro"]


# ---------------------------------------------------------------------------
# Generator soal per level
# ---------------------------------------------------------------------------
def is_prime(n):
    if n < 2:
        return False
    return all(n % i for i in range(2, int(n ** 0.5) + 1))


def tips_for(secret, guess, level):
    """Kumpulan petunjuk matematika sesuai level."""
    tips = []
    if guess < secret:
        tips.append("🔼 Terlalu kecil")
    elif guess > secret:
        tips.append("🔽 Terlalu besar")
    # dasar (semua level)
    tips.append("🔢 Angkanya " + ("ganjil" if secret % 2 else "genap"))
    if level in ("normal", "pro"):
        tips.append("➗ Habis dibagi 3: " + ("Ya" if secret % 3 == 0 else "Tidak"))
        tips.append("🌟 Bilangan prima: " + ("Ya" if is_prime(secret) else "Tidak"))
    if level == "pro":
        tips.append("∑ Jumlah digit: " + str(sum(int(d) for d in str(secret))))
        tips.append("√ Akar dibulatkan: " + str(round(secret ** 0.5)))
    return tips


@app.route("/")
def home():
    return send_file("index.html")


@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(".", filename)


@app.route("/api/new")
def api_new():
    mode = request.args.get("mode", "single")
    level = request.args.get("level", "mudah")
    if level not in LEVELS:
        level = "mudah"
    s1 = random.randint(1, 100)
    if mode == "double":
        s2 = random.randint(1, 100)
        while s2 == s1:  # pastikan angka berdua BEDA
            s2 = random.randint(1, 100)
        gid = str(uuid.uuid4())
        _games[gid] = {"level": level, "secret1": s1, "secret2": s2}
        return jsonify({"id": gid, "level": level, "secret1": s1, "secret2": s2})
    gid = str(uuid.uuid4())
    _games[gid] = {"level": level, "secret1": s1, "secret2": None}
    return jsonify({"id": gid, "level": level, "secret1": s1})


@app.route("/api/guess", methods=["POST"])
def api_guess():
    body = request.get_json(force=True)
    gid = body.get("id")
    player = body.get("player", 1)  # 1 atau 2 (double)
    try:
        guess = int(round(float(str(body.get("guess")).replace(",", "."))))
    except (ValueError, TypeError):
        return jsonify({"correct": False, "error": "Tebakan tidak valid"})

    game = _games.get(gid)
    if not game:
        return jsonify({"correct": False, "error": "Game tidak ditemukan"})

    secret = game["secret2"] if (player == 2 and game["secret2"] is not None) else game["secret1"]
    correct = guess == secret
    tips = [] if correct else tips_for(secret, guess, game["level"])
    return jsonify({"correct": bool(correct), "tips": tips})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
