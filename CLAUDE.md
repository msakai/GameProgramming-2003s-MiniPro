# CLAUDE.md

## Project overview

Browser port of a 2003 J-PHONE (Java ME) vertical-scrolling shooting game.
Vanilla JavaScript (ES6 classes + ES modules), no build step, no dependencies.

Original Java ME source is in `orig/Game/src/` (28 classes, ~1500 LOC).

See `DESIGN.md` for detailed porting strategy and technical decisions.

## Repository layout

```
index.html          — entry point (120x160 canvas, 4x CSS scaling)
js/                 — all game code as ES modules
  main.js           — game loop, object management, score, image preload
  math.js           — fixed-point sin8/cos8 tables, rand()
  gameObject.js     — base class
  renderer.js       — Canvas 2D wrapper matching Java ME Graphics API
  input.js          — keyboard handler (arrow keys, Space/Z/Enter)
  audio.js          — sound stubs (no-op play/stop)
  background.js     — scrolling checkerboard
  player.js         — player movement, auto-fire, collision
  bullet.js         — Bullet, SimpleBullet, EnemyBullet0
  enemy.js          — Enemy base + Enemy1–5
  boss.js           — Boss base + Boss1–3 (+ TwistingBullet, XBullet, YBullet)
  stage.js          — Stage1–3 wave scripts
  explosion.js      — expanding circle effect
  scoreItem.js      — falling score pickups
  title.js          — title screen
  gameOver.js       — game over / clear screen
res/                — sprite PNGs (copied from original)
orig/               — original Java ME source (read-only reference)
```

## How to run

```
python3 -m http.server 8000
# open http://localhost:8000
```

## Key conventions

- **No build step.** All JS is loaded directly via `<script type="module">`.
- **Original resolution.** Game logic assumes 120x160. Use `game.WIDTH` / `game.HEIGHT`, never query the DOM.
- **Coroutines are generators.** Enemy/boss/stage AI uses `yield` for per-tick suspension and `yield*` for delegation. Call `.return()` in `on_removed()` to clean up.
- **Fixed-point math.** `sin8()`/`cos8()` return values scaled by 256. Always use `>> 8` to convert back — do not use floating-point division.
- **Deferred removal.** Never splice `game.objects` during update. Always use `game.removeObject()` which queues for post-update cleanup.
- **`game` reference.** Every `GameObject` receives the `Game` instance via constructor. No global singletons.
