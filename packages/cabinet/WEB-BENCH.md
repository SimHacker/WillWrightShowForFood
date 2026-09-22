# Web bench — what working browser emulators teach us

Survey of the emulators that actually work in browsers (22 Sep 2026), and the
browser features the cabinet should use. No WASM anywhere in our plan — the
interesting finding is that the best precedents for *us* never needed it
either. Companion to [SIMH-MAP.md](SIMH-MAP.md) and [DESIGN.md](DESIGN.md).

## The field

**PCjs** (Jeff Parsons, pcjs.org) — the existence proof for this whole bench.
Pure JavaScript, no WASM, no plugins; IBM PC, PDP-11, PDP-10 and more; runs
"with or without a web server." Its load-bearing ideas:

- **Machines are declarative documents.** A page embeds a machine as config
  (XML v1, JSON v2) listing components wired by id — CPU, RAM, ROM, video,
  debugger. Our cabinet manifest (YAML jazz) is the same move.
- **Predefined state files**: a page can open a machine *already booted into
  a demo*. For us: a URL that opens SYMELEC mid-drawing.
- **`autoType` / `autoMount`**: scripted keyboard input and media at boot —
  the browser twin of SIMH's EXPECT/SEND, and our TTY test harness.
- **The debugger is just another component** you enable in config.

**masswerk Spacewar!** (Norbert Landsteiner) — pure-JS PDP-1 with the Type 30
CRT done *right*: dual P7 phosphor (bright blue flash under the beam, long
yellow-green afterglow), seven intensities as spot sizes, internal 1024²
rendered with sub-pixel spots, on **canvas 2D at full frame rate**. Direct
prior art for our 340 — same tube family (16ADP7), same phosphor, one
machine generation earlier. Proves the pretty-pass needs no WebGPU in v1.
Also a taste lesson: he deliberately runs fixed frame pacing instead of
reproducing the original's frame-rate jitter — choose which fidelity matters.

**Internet Archive (Emularity)** — loader UX over emscripten MAME/DOSBox
(WASM, so architecture not applicable; lessons are all operational):
click-to-play with progress; media fetched per item; a read-only ZIP overlaid
with a writable in-memory FS, persisted to IndexedDB. And one cautionary
tale we adopt as a rule: **MAME's binary save states were not portable even
between builds of the same emulator.** Snapshots must be portable by
construction.

**EmulatorJS / RomM (2025–26)** — WASM RetroArch cores; still two lessons:
save/state flows through browser storage with change listeners and optional
server sync (shape of our filestore sync later), and a bug note worth
framing: reading state from a running threaded core races the worker and
yields torn buffers — **pause, then serialize.** Single-threaded TS makes
this free.

**v86, jslinux** — WASM/asm.js x86. Wrong lineage for us; skipped.

## Decisions for the cabinet's browser bench

1. **Main loop:** fixed-timestep accumulator under `requestAnimationFrame`;
   clamp the measured delta (~250 ms) so a stall is a hiccup, not a debt;
   on `visibilitychange` reset the timestamp — never simulate the backlog.
   Background tab = machine pauses (correct for an interactive CAD station;
   a worker-tick "keep running" toggle is a later option, not v1).
2. **Threading: none.** The PDP-7 ran ~571K cycles/s; one 2026 core emulates
   that with two orders of magnitude to spare, and masswerk runs a PDP-1
   cycle-accurately on the main thread. No Web Workers in v1, no
   SharedArrayBuffer ever if we can help it (it drags COOP/COEP header
   requirements into every deployment). OffscreenCanvas + worker is a
   dimensional control for later, not a foundation.
3. **Persistence: OPFS** (`navigator.storage.getDirectory()`) — baseline in
   all engines since March 2023, secure-context only, **no permission
   prompt**, file-shaped like our Titan filestore. Store: tapes, ring files,
   snapshots, segment-log recordings. Call `navigator.storage.persist()` and
   check the result. One store; skip IndexedDB entirely.
4. **User-visible files:** the File System Access pickers are
   Chromium-desktop-only (Firefox/Safari ship OPFS but refuse the pickers),
   so the universal path is **drag-and-drop in, blob download out** —
   which is also the right UX for "feed it a paper tape."
5. **Snapshots: versioned JSON**, portable by construction (the MAME
   lesson), pause-then-serialize (the RomM lesson), plus PCjs-style
   **boot-state URLs**: a link opens a cabinet already running a chosen
   demo state. Demo states are repo files, not just user storage.
6. **Input: Pointer Events only** — one API unifies mouse, touch, stylus.
   `pointerType === "pen"` means an Apple Pencil on an iPad is *literally a
   light pen on a tilted drawing board* — Heinz's draftsman setup, back.
   Finger gets a wider aperture than mouse; that is the whole device table.
   **Every pointer is a pen, and the 340 takes any number** (pens OR onto
   the one LPHIT line; see the Type340 plugin). `setPointerCapture(pointerId)`
   per contact + `touch-action: none` on the tube canvas: drags survive
   leaving the canvas, and one multitouch tablet is already several local
   pens. Remote pens ride a presence channel over the bench's WebSocket —
   the Cursor Party pattern (Matt Webb / PartyKit: multiplayer cursors,
   cursor chat, quiet mode, one script tag) with the cursors landing on
   the tube as pens. PIXIE has exactly one tracking cross, so the
   multi-user etiquette is period-emergent: whoever captures the cross
   drags it; everyone else pokes lightbuttons. (Pointer *Lock* is the
   other API — hidden-cursor relative motion; maybe right for seizing
   sim-Heinz's wrist in the portrait, never for the tube.)
7. **Video out:** the segment log is primary (deterministic replay); live
   capture via `canvas.captureStream()` + MediaRecorder → WebM when wanted.
8. **Embedding:** a cabinet manifest per page, PCjs-style — so a HyperTIES
   storyboard can transclude a *running* PDP-7 the way it transcludes demos.
9. **Offline/PWA:** service worker later; nothing in v1 depends on it.

## Credit

Jeff Parsons (PCjs) proved the no-WASM multi-machine museum. Norbert
Landsteiner (masswerk) proved the dual-phosphor point display on canvas and
set the bar for period fidelity with taste. Jason Scott, db48x and the
Internet Archive normalized click-to-play emulation at library scale.
Their scars about state portability and serialization races are adopted
above as rules.

↑ [SIMH-MAP.md](SIMH-MAP.md) · [DESIGN.md](DESIGN.md) · [README](README.md)
