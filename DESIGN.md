# Design Notes — J-PHONE Java ME to Browser Port

## Origin

The original game is a vertical-scrolling shooting game ("Tennis Ball Shooting")
written circa 2003 for J-PHONE handsets using Java ME (MIDP).  It consists of
28 Java classes totalling roughly 1500 lines, featuring 3 stages, 5 enemy types,
3 bosses, and coroutine-driven AI scripting.

This document records the porting strategy and the technical decisions made
during translation to HTML5 Canvas + vanilla JavaScript (ES modules, no build
step).

## Goals

1. **Faithful gameplay reproduction** — frame-for-frame matching of the original
   logic wherever practical.
2. **Zero dependencies** — ES modules loaded directly by the browser; no bundler,
   no framework.
3. **Pixel-art feel** — render at the original 120x160 resolution and use CSS
   integer scaling (4x → 480x640) with `image-rendering: pixelated`.

## File Mapping

Each JS module corresponds to one or more Java source files:

| JS module       | Java source(s)                          |
|-----------------|-----------------------------------------|
| main.js         | Game.java (loop, object list, score)    |
| input.js        | GameCanvas.java (key handling portion)  |
| renderer.js     | Graphics API adapter                    |
| gameObject.js   | GameObject.java                         |
| background.js   | Background.java                         |
| player.js       | Player.java                             |
| bullet.js       | Bullet.java, SimpleBullet, EnemyBullet0 |
| enemy.js        | Enemy.java, Enemy1–5                    |
| boss.js         | Boss.java, Boss1–3 (+inner classes)     |
| stage.js        | Stage1–3                                |
| explosion.js    | Explosion.java                          |
| scoreItem.js    | ScoreItem.java                          |
| title.js        | Title.java                              |
| gameOver.js     | GameOver.java                           |
| math.js         | MyMath.java                             |
| audio.js        | PhrasePlayer/PhraseTrack stubs          |

## Core Technical Translations

### 1. Coroutine → Generator

This is the most important transformation in the port.

The original `Coroutine.java` implements cooperative multitasking on top of Java
threads and `wait()`/`notify()`.  Each coroutine's `run()` method calls
`suspend()` to yield control back to the game loop; the game loop calls
`resume()` once per tick to advance it by one step.

JavaScript generators are a near-perfect replacement:

| Java (Coroutine)           | JavaScript (Generator)               |
|----------------------------|--------------------------------------|
| `suspend()`                | `yield`                              |
| `c.resume()`               | `gen.next()`                         |
| `c.terminate()`            | `gen.return()`                       |
| Nested Coroutine + resume  | Sub-generator + `yield*`             |
| `suspend_msec(ms)`         | `yield* waitMsec(ms)` helper         |

The `waitMsec` helper is a small generator that yields the appropriate number of
ticks:

```js
function* waitMsec(msec) {
    for (let i = 0; i < (msec / 20) | 0; i++) yield;
}
```

**Important subtlety (Boss1):** `pattern_b()` in the original is a plain method
(not a coroutine) — it executes a single step and returns, with `suspend()`
called once afterward in the main loop.  It is therefore translated as a regular
method, not a generator.  `pattern_c()` and `pattern_d()`, which contain
internal `suspend()` calls, become generators delegated via `yield*`.

**Nested coroutines (Boss2, Boss3):** The original creates a child `Coroutine`
whose `resume()` is called manually each tick from the parent coroutine.  In the
port this becomes a sub-generator whose `.next()` is called explicitly inside
the parent's loop, wrapped in `try/finally` so that `.return()` is called on
early termination — mirroring the Java `finally` block that calls
`c.terminate()`.

### 2. Game Loop

The original runs a simple `Thread.sleep(20)` loop (50 FPS target).

The port uses `requestAnimationFrame` with a fixed-timestep accumulator:

```
accumulator += (currentTime - lastTime)
while (accumulator >= 20ms):
    updateGame()
    accumulator -= 20ms
render()
```

The accumulator is capped at 200 ms to prevent a "spiral of death" when the
browser tab is backgrounded and then restored.

### 3. Graphics API Adapter

`Renderer` wraps the Canvas 2D context and exposes methods matching the Java ME
`Graphics` signatures that the game code actually uses:

| Java ME                              | Renderer method              |
|--------------------------------------|------------------------------|
| `g.setColor(0xRRGGBB)`              | `setColor(rgb)` → fillStyle  |
| `g.fillRect(x,y,w,h)`              | `fillRect(x,y,w,h)`         |
| `g.fillArc(x,y,w,h,0,360)`         | `fillArc()` → ellipse+fill  |
| `g.drawArc(x,y,w,h,0,360)`         | `drawArc()` → ellipse+stroke|
| `g.drawImage(img,x,y,anchor)`       | `drawImage()` with anchor    |
| `g.drawString(s,x,y,anchor)`        | `drawString()` → fillText   |

The anchor constants (`HCENTER`, `VCENTER`, `LEFT`, `TOP`, `BOTTOM`) are
exported as numeric flags matching the Java ME values, so call sites translate
directly.

### 4. Object Lifecycle

The original `Game.java` maintains two `Vector`s: `objects` (the live list) and
`removing_objects` (the deferred-removal list).  Objects are never removed during
the update loop; instead `remove_object()` enqueues them, and they are spliced
out after the loop finishes, with `on_removed()` called on each.

The port preserves this exactly:

- `game.objects` — an `Array` iterated by index during `updateGame()`.
- `game.removingObjects` — populated by `removeObject()`, drained after update.
- `on_removed()` — called during drain; generators call `.return()` here.

The `gameBreak` flag (`game_break` in Java) causes `updateGame()` to stop
iterating early when `gameover()` is called mid-update, preventing
use-after-remove errors.

### 5. Fixed-Point Math

`MyMath.sin8()` and `cos8()` use a 360-entry lookup table with 8-bit fractional
precision (multiply then `>> 8`).  JavaScript's bitwise operators convert
operands to signed 32-bit integers, so `>> 8` works identically to Java.

The table and the `rand()` helper are ported verbatim.

### 6. Input

The original `GameCanvas` maps J-PHONE d-pad and FIRE to boolean flags and
exposes `dx()`, `dy()`, `is_fireing()`.  The port maps arrow keys and
Space/Z/Enter to the same flags, with `e.preventDefault()` on arrow keys to
avoid page scrolling.

Player movement speed is `±3` pixels per tick (same as original).

### 7. Persistence

`RecordStore` (J2ME RMS) → `localStorage`.  The original encoded the high score
across 3 bytes in base-100; the port stores it as a plain integer string.

### 8. Sound

The original game uses Yamaha's SMAF-Phrase (`.spf`) format for sound effects
and SMAF (`.mmf`) for music, played via the J-PHONE `PhrasePlayer`/`PhraseTrack`
API.  Four sound slots are loaded:

| Slot | Original file  | Usage              | Playback   |
|------|----------------|--------------------|------------|
| 0    | bgm.spf        | Background music   | Loop       |
| 1    | Gun3.spf       | Enemy hit          | One-shot   |
| 2    | Click10.spf    | Score item pickup  | One-shot   |
| 3    | Hit4.spf       | Player hit         | One-shot   |

The SMAF-Phrase format is a proprietary Yamaha format for real-time game audio,
with no browser support and very limited converter availability (FFmpeg only
supports standard MMF, not SMAF-Phrase).  The sound files were converted to
standard audio formats by playing them through a Yamaha tool running under WINE
and capturing the output via a virtual audio loopback device (BlackHole).

The port uses the HTML5 `Audio` API.  Each sound slot wraps an `Audio` element
with `play(loop)` / `stop()` matching the original `PhraseTrack` interface, so
all call sites remain unchanged.  The `play()` parameter convention is preserved:
`0` for looping (BGM), non-zero for one-shot (effects).

Browser autoplay restrictions are handled by installing a one-time `keydown` /
`click` listener that retries BGM playback on first user interaction.

## Class Hierarchy

```
GameObject
├── Background          — scrolling checkerboard
├── Player              — movement, auto-fire, collision, invincibility timer
├── Bullet
│   └── SimpleBullet
│       └── EnemyBullet0
├── Enemy
│   ├── Enemy1–5
│   └── Boss (abstract)
│       ├── Boss1
│       ├── Boss2       (contains TwistingBullet inner class)
│       └── Boss3       (contains XBullet, YBullet inner classes)
├── Explosion
├── ScoreItem
├── Stage1–3
├── Title
└── GameOver
```

All classes receive the `game` instance via their constructor (replacing Java's
`Game.instance` singleton pattern).

## Known Differences from Original

- **Auto-fire is always on.** The original code has `is_fireing()` commented out
  in `Player.update()`, so bullets fire every 3 ticks regardless of input.  The
  port matches this behavior.
- **Font metrics differ.** The 8px monospace font used by `Renderer` does not
  match J-PHONE's built-in font.  Text positioning may be slightly off.
- **Sound source differs.** The audio files were re-recorded from the original
  SMAF-Phrase data via a virtual audio device, not decoded losslessly.  The BGM
  has been replaced with a different track.
- **Bit class omitted.** `Bit.java` (an orbiting companion object) is defined in
  the original source but never instantiated by any game code.
