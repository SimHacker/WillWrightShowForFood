# Web bench: what working browser emulators teach us

A survey of the emulators that work in browsers (22 Sep 2026), and the
browser features the cabinet should use. No WASM anywhere in our plan; the
closest precedents for the cabinet never needed it either. Companion to
[SIMH-MAP.md](SIMH-MAP.md) and [DESIGN.md](DESIGN.md).

## The field

**PCjs** (Jeff Parsons, pcjs.org) shows that this approach works.
Pure JavaScript, no WASM, no plugins; IBM PC, PDP-11, PDP-10 and more; runs
"with or without a web server." Its main ideas:

- **Machines are declarative documents.** A page embeds a machine as config
  (XML v1, JSON v2) listing components wired by id: CPU, RAM, ROM, video,
  debugger. Our cabinet manifest (YAML) does the same.
- **Predefined state files**: a page can open a machine *already booted into
  a demo*. For us: a URL that opens SYMELEC mid-drawing.
- **`autoType` / `autoMount`**: scripted keyboard input and media at boot,
  the browser equivalent of SIMH's EXPECT/SEND, and of our TTY test harness.
- **The debugger is a component** you enable in config.

**masswerk Spacewar!** (Norbert Landsteiner): a pure-JS PDP-1 with an accurate
Type 30 CRT: dual P7 phosphor (bright blue flash under the beam, long
yellow-green afterglow), seven intensities as spot sizes, internal 1024²
rendered with sub-pixel spots, on **canvas 2D at full frame rate**. It is direct
prior art for our 340: same tube family (16ADP7), same phosphor, one
machine generation earlier. It shows the phosphor rendering needs no WebGPU in v1.
He deliberately runs fixed frame pacing instead of reproducing the original's
frame-rate jitter, a choice about which kind of fidelity to keep.

**Internet Archive (Emularity)**: loader UX over emscripten MAME/DOSBox
(WASM, so its architecture does not apply; the lessons are operational):
click-to-play with progress; media fetched per item; a read-only ZIP overlaid
with a writable in-memory FS, persisted to IndexedDB. One lesson we adopt as
a rule: **MAME's binary save states were not portable even between builds of
the same emulator.** Snapshots must be portable by construction.

**EmulatorJS / RomM (2025–26)**: WASM RetroArch cores, with two lessons.
Save state flows through browser storage with change listeners and optional
server sync (the shape of our filestore sync later). And reading state from a
running threaded core races the worker and yields torn buffers, so **pause,
then serialize.** Single-threaded TypeScript avoids the race.

**v86, jslinux**: WASM/asm.js x86. Not relevant to the cabinet; skipped.

**Apple ][ in TypeScript, two of them, both MIT** (checked 4 Oct 2026):

- **[apple2js](https://github.com/whscullin/apple2js)** (Will Scullin, since 2013): Apple ][,
  ][+ and //e, mostly TypeScript now, React UI. Its 6502 core and its Apple ][ color shader are
  git submodules (`cpu6502`, `apple2shader`), so the CPU is already a separate package.
- **[Apple2TS](https://github.com/ct6502/apple2ts)** (Chris Torrence and contributors): //e
  in TypeScript, Vite, expansion cards (Mockingboard, mouse card, Z-80 SoftCard, Disk II, SmartPort),
  a debugger with a memory heat map, save states, Internet Archive and DemoZoo loaders, and an
  AI agent that reads registers, the screen and memory and sets breakpoints. It is the closest
  of these to the cabinet.

**[microM8](https://paleotronic.com/software/microm8/)** (Paleotronic: [April](../../characters/april-ayres-griffiths/README.md) and
[Melody](../../characters/melody-ayres-griffiths/README.md) Ayres-Griffiths; designed and programmed by
April; free, for Windows, macOS
and Linux, with a WebAssembly subset, cyanIIde; Go source under the MIT license since September 2025,
[microm8-cln](https://github.com/paleotronic/microm8-cln)). It is not a browser emulator. It is
the model for the features the cabinet adds for the person using it, as the
[MANIFESTO](MANIFESTO.md#a-federation-of-emulators-after-microm8) says. Its MCP server and HTTP
API make it the first peer for the tiny-titan federation.

It runs the Apple ][, ][+ and //e with Mockingboard, mouse, Disk II,
SmartPort and Z-80 CP/M cards, and then "upcycles" them: renders the graphics in 3D and HD with
cameras you can move; records memory so you can rewind live ("never say die!"); lets GEOS and Dazzle
Draw, which expect a joystick, be driven by the mouse; lets a game ship as a **microPAK**, one file of presentation
for an old program (color remapping, 3D pixel shifting, music, backdrops, overlays, cheats and
control programs); keeps presets in YAML; and has a scriptable command line that can run a binary
without booting a DOS disk. microPAK is the nearest thing anywhere to the cabinet's cartridge.
([features](https://paleotronic.com/software/microm8/features/))

**Decision: use microM8, compiled to WebAssembly.** microM8 is the cabinet's inspiration and is
now MIT-licensed, so the cabinet's Apple ][ is microM8's own emulator rather than a new one.
Done: its Go core (the 6502 is `paleotronic.com/core/hardware/cpu/mos6502`; the Apple ][
hardware is under `paleotronic.com/core/hardware`) builds with `GOOS=js GOARCH=wasm` from our
branch and patches ([microm8/](microm8/README.md)), runs headless in the cabinet's page and in
Node, and draws through the cabinet's canvas instead of its desktop renderer
([MICROM8.md](MICROM8.md#microm8-as-a-webassembly-module-called-directly)). That is sufficient for
now. Still to do, longer term: put its memory on the backplane's memory map and its CPU behind the
`Cpu` interface by exposing more of its Go to the TypeScript wrapper, and perhaps translate the
Go to TypeScript. Anything for upstream goes to April first; she wrote it
([emulation roundtable](../../repo-shows/emulation-roundtable/README.md)).

We have done this kind of integration before.
[MicropolisCore](https://github.com/SimHacker/MicropolisCore) compiles SimCity's C++ simulation
to WebAssembly with Emscripten and Embind and drives it from a TypeScript web front end: the
simulation stays in its original language, and the web side reads its memory and calls its
entry points. microM8 follows the same split: the emulator stays in Go, and the cabinet's panels
are the front end. One difference: Go's WebAssembly target ships the Go runtime and talks to
JavaScript through `syscall/js`, where Emscripten and Embind generate bindings, so the size of
the build and the cost of calls across the boundary have to be measured, not assumed.

Then the Apple ][ joins the cabinet's machines with our panels (memory, trace, source maps, the
pointer as an input device), and ROADMAP §13's mash-ups (the keyset and the glove as Apple
paddles) have a machine to run on. apple2js and Apple2TS stay as references for a TypeScript
translation. Credit microM8 in the UI and in the source headers.
ROMs are Apple's: load them from the user, as microM8 and the others do, never commit them.

**Phosphor, borrowed:**

- **Lars Brinkhoff's [crt-simulation](https://github.com/larsbrinkhoff/crt-simulation)**: GLSL
  shaders (`phosphor.glsl`, `point.glsl` with a generalized Gaussian spot, `line.glsl`,
  `render.glsl`), a WebGL version (`crt.js`), and photos of a real Type 340 in `pics/`. Written
  for exactly our tubes: the Type 30, Type 340, GT40, Imlac. No license file yet: ask Lars, who
  is already on the show ([correspondence](../../characters/lars-brinkhoff/correspondence.md)),
  to add one, then port the shaders to WebGPU (or run them in WebGL2 first) fed by our segments.
- **masswerk's Spacewar** (Norbert Landsteiner, building on Barry and Brian Silverman's and Vadim
  Gerasimov's emulator): the best-looking P7 on canvas 2D, sub-pixel spots, seven intensities as
  spot sizes, with Steve Russell's account of the dual phosphor. Copyright Landsteiner, no open
  license: learn from it and ask before copying any code. He also wrote "Inside Spacewar!", the
  model for how to walk a 1962 program in prose.

## Decisions for the cabinet's browser bench

1. **Main loop:** fixed-timestep accumulator under `requestAnimationFrame`;
   clamp the measured delta (~250 ms) so a stall skips time instead of
   piling up cycles to run; on `visibilitychange` reset the timestamp and
   never simulate the backlog. A background tab pauses the machine (correct
   for an interactive CAD station; a worker-tick "keep running" toggle is a
   later option, not v1).
2. **Threading: none.** The PDP-7 ran ~571K cycles/s; one 2026 core emulates
   that with two orders of magnitude to spare, and masswerk runs a PDP-1
   cycle-accurately on the main thread. No Web Workers in v1, and no
   SharedArrayBuffer if we can avoid it (it requires COOP/COEP headers on
   every deployment). OffscreenCanvas with a worker is an option for later.

   **The worker boundary, planned but not built.** The machine (cabinet, CPU,
   devices, the Korz sea) may later move into a worker, with the page
   keeping the canvas and panels. Nothing wraps it today; new UI code keeps
   to these rules so the move stays cheap:

   - **Commands are plain calls with plain arguments**: `box.run(n)`,
     `box.step()`, `tty.type(code)`, setting switches, PC and halt, pen
     position. Each becomes one message.
   - **Computations over core take `read` and `write` functions, never the
     CPU**: `preview340`, `cornerAt`, `moveCorner`, `readTag`, `implant`, the
     RSPPIX heap walk. They run beside the machine and return plain results
     (segments, pokes, words), so they move with it unchanged. A PIXIE drag
     sends the pointer and gets pokes back; it never reads core word by
     word across the boundary.
   - **Display state is read once per frame**: cycles, registers, the
     340's frame and registers, the memory page. Read them in one place per
     frame, into plain values, rather than from the live objects in many
     places; that place becomes the snapshot message.
   - **Device output arrives through callbacks with plain data**: `onFrame`
     segments, `onPrint` characters, trace records. They become posted
     messages; segments can travel as typed arrays.
   - **Slots installed from the UI live in modules, named, with their
     guard and `by`**, not as closures over UI state. A function can't be
     posted to a worker; a module name and its arguments can.
3. **Persistence: OPFS** (`navigator.storage.getDirectory()`): baseline in
   all engines since March 2023, secure-context only, **no permission
   prompt**, file-shaped like our Titan filestore. Store: tapes, ring files,
   snapshots, segment-log recordings. Call `navigator.storage.persist()` and
   check the result. One store; skip IndexedDB entirely.
4. **User-visible files:** the File System Access pickers are
   Chromium-desktop-only (Firefox/Safari ship OPFS but refuse the pickers),
   so the universal path is **drag-and-drop in, blob download out**, which
   also suits loading a paper tape.
5. **Snapshots: versioned JSON**, portable by construction (the MAME
   lesson), pause-then-serialize (the RomM lesson), plus PCjs-style
   **boot-state URLs**: a link opens a cabinet already running a chosen
   demo state. Demo states are repo files, not just user storage.
6. **Input: Pointer Events only**: one API covers mouse, touch and stylus.
   With `pointerType === "pen"`, an Apple Pencil on an iPad is a light pen
   on a tilted drawing board, like Heinz's draftsman setup.
   A finger gets a wider aperture than a mouse; that is the whole device table.
   **Every pointer is a pen, and the 340 takes any number** (pens OR onto
   the one LPHIT line; see the Type340 plugin). `setPointerCapture(pointerId)`
   per contact and `touch-action: none` on the tube canvas keep drags going
   when they leave the canvas, and one multitouch tablet is already several
   local pens. Remote pens use a presence channel over the bench's WebSocket,
   following the Cursor Party pattern (Matt Webb / PartyKit: multiplayer
   cursors, cursor chat, quiet mode, one script tag), with the cursors
   arriving on the tube as pens. PIXIE has exactly one tracking cross, so
   with several users, whoever captures the cross drags it and everyone else
   pokes lightbuttons. (Pointer *Lock* is the other API, for hidden-cursor
   relative motion; possibly right for grabbing sim-Heinz's wrist in the
   portrait, never for the tube.)
7. **Video out:** the segment log is primary (deterministic replay); live
   capture via `canvas.captureStream()` + MediaRecorder → WebM when wanted.
8. **Embedding:** a cabinet manifest per page, PCjs-style, so a HyperTIES
   storyboard can transclude a *running* PDP-7 the way it transcludes demos.
9. **Offline/PWA:** service worker later; nothing in v1 depends on it.

## Credit

Jeff Parsons (PCjs) showed a multi-machine emulator museum without WASM. Norbert
Landsteiner (masswerk) showed the dual-phosphor point display on canvas.
Jason Scott, db48x and the Internet Archive made click-to-play emulation
common at library scale. Their findings on state portability and
serialization races are adopted above as rules.

↑ [SIMH-MAP.md](SIMH-MAP.md) · [DESIGN.md](DESIGN.md) · [README](README.md)
