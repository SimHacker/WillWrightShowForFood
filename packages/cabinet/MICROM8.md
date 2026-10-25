# Working with microM8 and turtleSpaces

How the cabinet can work with [April](../../characters/april-ayres-griffiths/README.md) and
[Melody](../../characters/melody-ayres-griffiths/README.md) Ayres-Griffiths's Apple ][ emulator,
microM8, and their 3D Logo, turtleSpaces: what each exposes, how tightly we can connect, what we'd
offer back, and how the cabinet's views could sit on top. Read from microM8's published source
([paleotronic/microm8-cln](https://github.com/paleotronic/microm8-cln), MIT, September 2025) and
turtleSpaces' reference, October 2026. Nothing here has been discussed with them yet.

## What microM8 exposes

| Surface | What it is | Use from the cabinet |
|---|---|---|
| **MCP server** | `microM8 -mcp`, over stdio or SSE (`-mcp-mode sse -mcp-port`). About 45 tools: `type_text`, `key_event`, `read_memory`, `write_memory`, `write_memory_range`, `screenshot`, `get_text_screen`, `get_graphics_screen`, `insert_disk`, `enable_live_rewind`, `rewind_back`, `assemble`, `disassemble`, `read_interpreter_code`, `write_interpreter_code`, `debug_breakpoint_add`, `debug_instruction_trace`, `debug_register_get`/`set` and more (`octalyzer/mcp_sdk.go`) | Agents drive it; tiny-titan's host side calls it for the federation demo ([TINY-TITAN.md](TINY-TITAN.md#first-demo-pixie-rings-to-microm8s-3d-turtle)) |
| **Debugger server** | An HTTP server microM8 runs itself (`debugger/api.go`): `GET /api/debug/screen/`, `POST /api/debug/asm/upload`, `POST /api/debug/upload`, `GET /api/debug/download/{mode}/{addr}/{size}`, and a JSON WebSocket at `/api/websocket/debug`. Its own debugger UI is plain HTML and JavaScript served from the same port (`octalyzer/debugger/index.html`, `js/ws.js`) | A SvelteKit app can speak the same WebSocket and be a second debugger front end, without touching microM8 |
| **Debug WebSocket commands** | `attach`/`detach`, `pause`/`continue`/`step`/`step-over`/`step-out`, `setbp`/`clrbp`/`setbpcounter`, `memory`, `memsearch`, `memset`, `set-val`, `setpc`, `trace`, `get-heatmap`/`set-heatmap`, `live-rewind`, `back`/`forwards`, `state-save`, `decode-dasm`, `getstack`, `sendkey`, `setwarp` (`debugger/websocket.go`) | Memory reads and writes, disassembly, breakpoints and rewind from our panels |
| **HTTP control API** | Plain HTTP on port 38911, with `-control-port` (and `-disable-border` for a frameless window). Window, input, disks, profiles, freeze, launch, settings, recorder, memory, text screen ([below](#the-http-control-api)) | tiny-titan drives microM8 with ordinary requests; a microPAK or disk launched by API |
| **Several machines at once** | microM8 runs several interpreter slots side by side (its "parallel virtual machine scripting") | One microM8 can be several federation members |
| **Source** | Go, MIT; builds with `lmake.sh`, including a `nox` build without X11 | Read, fork, contribute; a headless build is the starting point for anything in-browser |

**The web debugger, as its authors describe it** ([video and notes](https://www.youtube.com/watch?v=_4wTnaY8F2E),
Melody Ayres-Griffiths, October 2018): Control-Shift-B opens it, paused. It keeps the CPU state, the
program counter, recently executed instructions and a lookahead in view, with tabs for the video,
memory, soft switches, breakpoints and settings. The CPU's speed changes while it runs. The
**recorder** saves the CPU state at intervals (a tenth of a second by default, adjustable) and
**records memory changes in real time**, and plays back forwards or backwards at 0.25× to 4×, or
steps one or ten intervals, so you can go back to just before a crash and step from there. The memory
pane edits hex or ASCII in main or auxiliary memory, searches for strings and byte sequences, and can
ignore the high bit; the soft-switch pane toggles switches live (to look at another graphics page);
breakpoints can tell main from auxiliary memory; memory blocks load and save. The current
[help page](https://paleotronic.com/software/microm8/help/web-debugger/) adds a **100% recording mode
that "captures EVERYTHING"** (and uses a lot of disk), a heat map, the debugger reachable from the
menu (Tools, Web Debugger, choose a VM), and command-line flags that launch a disk, open the
debugger and run a control program, so debugging itself can be scripted.

What the heat map is today: 256 counters, each holding a 4-bit read intensity and a 4-bit write
intensity, either one per 256-byte page of the 64K, or one per byte within a chosen page, for main
or aux memory (`core/memory/mmu.go`, `HeatMapRead`/`HeatMapWrite`). There is also a combined execute mode,
instruction tracing, and settings for full CPU recording, to the debugger or to a file
(`DebugFullCPURecord`, `FileFullCPURecord`). Memory writes are already recorded in real time for the rewind, and the 100% mode records
everything. What's missing is less the data than the views: a per-address map of reads, writes and
executes over a whole recording, and an access history you can browse by address.

## What turtleSpaces exposes

- **A socket API**: the `api` primitive opens port 1967; each connection runs its Logo as its own
  worker (`api1`, `api2`, …), and `setwrite "api` sends output back down the connection
  ([reference](https://turtlespaces.org/reference/environment/#cmd-api)). This is the remote
  turtle protocol. The browser can't open TCP, so the cabinet reaches it through tiny-titan's host
  side or a few lines of Node, with the desktop app.
- **Embeddable players**: every published project has a Share link with an embeddable player, so
  an article can embed a turtleSpaces project beside a cabinet applet.
- **Shared containers and databases** inside Logo (`share`, `store`, `retrieve`), which a
  translator can fill.
- Source isn't published; turtleSpaces is their product, and the cabinet should send people to it,
  not around it ([LOGO-TURTLE.md](LOGO-TURTLE.md#where-the-line-goes-on-the-escalator-to-turtlespaces)).

## How tightly we can connect

From loosest to tightest:

1. **Side by side, today.** microM8 runs on the desktop; the cabinet runs in the page. tiny-titan's
   host side talks to microM8's MCP server or debug WebSocket, and to turtleSpaces' port 1967.
   Nothing on their side changes.
2. **Our views on their machine.** A SvelteKit panel connects to microM8's debug WebSocket and shows
   the cabinet's views of the Apple's memory (below). Read-only first, by polling `memory` and
   `get-heatmap`; then breakpoints, stepping and rewind, through the same commands their own
   debugger uses.
3. **Contributions upstream**, if they want them: small, opt-in additions to the debug server (next
   section), so our views get the data they need without polling.
4. **In the page, with direct calls.** A headless microM8 core compiled to WebAssembly, running
   beside the PDP-7 in one tab, no sockets
   ([proposal below](#proposal-microm8-as-a-webassembly-module-called-directly)). The most work, and
   the best result; their call.

Linking their Go code into our TypeScript directly isn't an option short of WebAssembly. Talking to
it over its own protocols is, and that keeps each project's code its own.

## What we'd offer back

The repository has issues enabled, no pull requests so far, and "Contribution guidelines to be
added." Ask before sending anything. What we would like to contribute, each behind a setting so
nothing changes unless it's turned on:

- **Access counters for every address at once**: `@counter.set` already counts reads, writes or
  executes for a chosen address; a mode that keeps all three for all 64K, with the cycle of the first
  and last, would feed a full map. A few megabytes.
- **Access history as a stream**: microM8 already records writes in real time and everything in
  its 100% mode. Exposing that recording as `(cycle, PC, address, kind, value)` records over the debug
  WebSocket, or to a WebAssembly host directly, would let a panel show what happened, where and when,
  and scrub through it with the rewind that exists. The work is an export and an index, not new
  capture.
- **Subscriptions**: the WebSocket pushes changes to a watched range or to the heat map instead of
  being polled.
- **Allowed origins** for the debug server, so a page from another host can connect when the user
  says so.
- **Memory region typing hooks**: a place to say "this range is a Logo node space" or "this is a
  display list", which their debugger and ours can both use.

## Proposal: microM8 as a WebAssembly module, called directly

The tightest connection has no sockets at all: microM8's emulation core compiled to WebAssembly and
loaded into the cabinet's SvelteKit component, with JavaScript and Go calling each other directly.
This is what we'd propose to April and Melody, and Don could write it and send it as a pull request
if they want it.

**What's there to build on.** Go compiles to WebAssembly (`GOOS=js GOARCH=wasm`), and
`syscall/js` lets Go register functions JavaScript can call and call JavaScript back. microM8
already separates a headless build: `settings_nox.go`, `vminit_nox.go`, `files_nox.go` and the
`nox` target in `lmake.sh` leave out X11, and its vendored audio library (`ebitengine/oto`) has a
browser driver. cyanIIde, their web Apple //e, may already be this, or most of it; ask first.

**The shape of the PR**, all behind a `js && wasm` build tag so the desktop build is untouched:

- A `wasmapi` package that boots one or more machines headless (the CPU, MMU, Disk II and SmartPort,
  soft switches, video memory, sound) with no GL, no UI and no network.
- Functions on a `microM8` object in JavaScript:
  `create(profile)`, `runCycles(n)`, `runFrame()`, `key(code)`, `paddle(n, value)`,
  `insertDisk(drive, bytes)`, `snapshot()`, `restore(state)`, `rewind(frames)`,
  `readMemory(addr, len)`, `writeMemory(addr, bytes)`, `registers()`, `setBreakpoint(addr)`,
  `disassemble(addr, n)`, `setHeatmap(mode)`, and `interpreterCode()` for its Go Logo and
  Applesoft.
- **Zero-copy views.** Go's memory is the module's linear memory, so `wasmapi` can return the
  address and length of the Apple's RAM, the framebuffer and the audio buffer, and JavaScript wraps
  them in `Uint8Array`s over the same bytes. The cabinet's panels then read every byte of the Apple
  every frame without a copy or a call.
- **Callbacks the other way**: an `onFrame`, `onBreakpoint` and, with the access counters
  ([above](#what-wed-offer-back)), a ring buffer of memory accesses that JavaScript drains each
  frame, rather than one call per access.
- A `make wasm` target and a test page that boots a disk and checks a screen.

**In the cabinet**, a `<MicroM8>` Svelte component loads `wasm_exec.js` and the module, draws the
framebuffer with the cabinet's renderer (or lets microM8's own 3D view live in its own canvas), and
registers the Apple on the backplane as a machine with a memory port
([MAPPING.md](MAPPING.md)). Then tiny-titan can map Apple memory into the PDP-7's and back
([CORE-LINKS.md](CORE-LINKS.md)), the federation demo runs in one page with no network, and every
cabinet view (memory, disassembly, heat maps, completion at the keyboard) works on the Apple.

**The pattern already works in Micropolis.** MicropolisCore runs the SimCity engine (C++ compiled
with Emscripten) in a SvelteKit page exactly this way, and it is the model for the microM8 module:

```
C++ Micropolis engine (WebAssembly)
    calls its callback
Embind JSCallback wrapper
    delegates to
MicropolisReactive.engineCallback
    updates
Svelte 5 $state / $derived runes
    re-render
UI components and the WebGPU tile renderer
```

- **Zero-copy map**: the renderer reads the engine's map and overlay arrays as `Uint16Array` views
  straight over the module's linear memory, no calls per tile
  ([`wasm/heap.ts`](https://github.com/SimHacker/MicropolisCore/blob/main/apps/micropolis/src/lib/wasm/heap.ts),
  [`MicropolisSimulator.ts`](https://github.com/SimHacker/MicropolisCore/blob/main/apps/micropolis/src/lib/MicropolisSimulator.ts)).
- **Events into runes**: the engine's callbacks (budget, messages, evaluation, map changes) land in
  one reactive class whose fields are runes, so any component that reads them updates by itself
  ([`MicropolisReactive.svelte.ts`](https://github.com/SimHacker/MicropolisCore/blob/main/apps/micropolis/src/lib/MicropolisReactive.svelte.ts),
  with integration, simulation and poke tests beside it).
- **The trap it found**: when the module's memory grows (loading a city), the old views detach and
  read nothing; `syncMapViews()` makes new ones. Go's WebAssembly memory grows too, so microM8's
  views of RAM, framebuffer and audio need the same re-binding, keyed to a generation counter the
  module bumps when memory moves.

For microM8 the chain is the same with Go in place of C++: `syscall/js` callbacks in place of
Embind, a `MicroM8Reactive.svelte.ts` holding the machine's registers, run state, breakpoints and
access-log counts as runes, and the cabinet's panels and display devices reading RAM through views.
The cabinet's own machines and microM8's would then look the same to every component.

**Costs to be honest about.** Go's WebAssembly output is large, often tens of megabytes before
compression; TinyGo is smaller but may not compile everything microM8 uses. Go's runtime in the
browser is single-threaded, so the Apple runs on the cabinet's clock or in a worker that posts
frames. None of that matters much for a 1 MHz 6502.

## Our views on their Apple, and on turtleSpaces

The cabinet's panels are views over typed memory
([DESIGN.md](DESIGN.md#typed-memory-core-as-typed-blocks)): core as a run of typed regions, each
type knowing how to decode, describe and draw itself. Pointed at microM8's memory through the debug
WebSocket, the same panels would give:

- **A 6502 disassembler**, alongside microM8's own `decode-dasm`, with source maps when the program
  came from source, and symbol tables from the assembler that built it.
- **Heat maps and history**: microM8's page-level heat map today, per-address read, write and
  execute maps once the counters exist, and a timeline of the access log you can scrub.
- **Data structure views**: Applesoft program lines and variables, ProDOS directories, the text
  and graphics screen memory as pictures, and for programs that have them, their own structures,
  declared once as types.
- **Completion and help at the keyboard**: Applesoft keywords, line numbers named by their `REM`s,
  and variables, read from the tokenized program in memory
  ([TELETYPE-DASHER.md](TELETYPE-DASHER.md#completion-and-help-basic-on-the-apple-)).
- **Forth on the Apple**: the same Forth dictionary and disassembler views the PDP-7 has, for an
  Apple ][ Forth.
- **Logo's insides**: microM8's Logo is rewritten in Go, so its procedures and turtles aren't in
  emulated memory. `read_interpreter_code` gives the source; a turtle-state view would need an API
  call from them.
- **turtleSpaces**: no memory to read, but its API connection can query state and, with `share`
  and `store`, publish it; a cabinet panel could show the turtles' paths and the procedures that
  drew them.

## The HTTP control API

microM8's [API Control](https://paleotronic.com/software/microm8/help/api-control/) page documents
it: start microM8 with `-control-port`, and it listens on port 38911; add `-disable-border` to run it
without a window frame. The endpoints, grouped:

| Group | Endpoints |
|---|---|
| **Window** | `POST window/position {x, y, w, h}`; `GET window/hide` (also suspends execution), `window/show`; `POST window/screen {path}` writes a PNG; `GET window/screenshot`; `GET window/focused` |
| **Input** | `POST input/keyevent {key, scancode, action, modifier}`; `GET input/meta/key/{key}/value/{value}`; `POST input/mouseevent {x, y}`; mouse button state get, set and click; `POST paste` with text |
| **Disks** | `POST hardware/disk/insert {path, drive}` (0 and 1 are Disk II, 2 is SmartPort); `eject/{drive}`, `blank/{drive}`, `swap`; write protect read and toggle |
| **System** | `reboot`; `profile/set/{apple2-plus\|apple2e\|apple2e-en\|apple2e-en-cpm}`, `profile/get`; `POST freeze/save {path}`, `freeze/restore {path}`; `catalog`, `help`; `camera/reset` |
| **Launch** | `POST system/launch {workingDir, disks[], pakfile, smartport, runfile, runcommand, dialect}`: boot disks, a microPAK, a SmartPort volume, or a BASIC, shell or Logo file or command |
| **Interpreters** | `GET interpreter/{fp\|int\|logo}` starts Applesoft, Integer BASIC or Logo in the VM |
| **Settings** | `POST settings/get {path, scope}`, `settings/update {path, scope, value, persist}` (for example scope `video`, path `current.fullscreen`) |
| **Recorder** | `GET recorder` (0 off, 1 live rewind, 2 file recording); `recorder/{start-file-recording\|start-live-recording\|stop-recording\|rewind\|play\|resume}` |
| **Memory and screen** | `GET memory/read/{address}`, `memory/write/{address}/{value}`; `GET memory/screen/text` returns the text screen |
| **VMs and control** | `GET vm`, `vm/{1-8}`; `pause`; `cpu/warp/{up\|down}`; `audio/{master\|speaker}/{up\|down}`; `POST osd/send` shows a message on screen; `health`; `quit` |

Paleotronic's own [GUI frontend](https://paleotronic.com/software/microm8/help/gui-frontend/) is a
separate program built on this API: a cross-platform interface written in FreePascal with Lazarus
that drives microM8 entirely over HTTP ([paleotronic/microm8-gui](https://github.com/paleotronic/microm8-gui),
releases for Windows, macOS and Linux; no license file yet). A cabinet panel in SvelteKit doing the
same is a second frontend on a path they already use.

What this gives the cabinet now, before any WebAssembly:

- **The federation demo over HTTP**: tiny-titan's host side starts microM8 in Logo
  (`interpreter/logo`), pastes the translated figure (`paste`), and grabs the result
  (`window/screen`).
- **microM8 beside the cabinet**: a frameless window placed with `window/position` next to the page,
  hidden and shown with it.
- **Cartridges that launch microPAKs**: `system/launch` with `pakfile` is how a cabinet cartridge
  would run an upcycled program in microM8.
- **Completion and help at the keyboard**: `memory/screen/text` and `memory/read` give the text
  screen and the tokenized program ([TELETYPE-DASHER.md](TELETYPE-DASHER.md)), one call per byte for
  now; a range read would be the obvious small addition.
- **Snapshots in cartridges**: `freeze/save` and `freeze/restore` by path.

## microBASIC's @functions: the scripting API inside the machine

microM8's enhanced Applesoft and Integer BASIC add `@` functions
([reference](https://paleotronic.com/software/microm8/help/functions/)). They are the in-machine half
of everything above, and several already do what this page proposes:

| Family | What it does | Cabinet counterpart |
|---|---|---|
| `@counter.set{mode, address, counter}`, `@counter.value`, `@counter.bump` | count `read`, `write` or `exec` accesses by the CPU to a chosen address | the per-address access counters, for addresses you pick |
| `@scan.sequence{file, …}`, `@scan.jumps{recording, count}` | search a recording for addresses written a given sequence of values, or jumped to a given number of times | finding a game's fields by changing one thing and seeing what moves ([apple-ii-floppy-bridge](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/apple-ii-floppy-bridge.md)) |
| `@mem.peek`, `@mem.poke`, `@mem.range`, `@mem.lock` | read, write, show memory; hold an address at a value | core links, patches |
| `@screen.read`, `@screen.contains` | read text off the screen | screen scraping, Dasher grammars |
| `@key.type`, `@paddle.value`, `@paddle.button` | type into a VM at a given rate; set paddles | input synthesis |
| `@vm.exec`, `@vm.redirect`, `@vm.var`, `@vm.select`, `@vm.enable`, `@system.new`, `@system.switch`, `@system.spawn{"fp"\|"int"\|"logo"\|"shell"}` | run commands in, read variables of, and redirect `@` functions to other VMs (eight in all) | machines on one backplane |
| `@share.connect{host, port, vm}`, `@share.command`, `@share.input`, `@share.transfer` | microLink: VMs connected to remote hosts, with ownership passed between users | the tiny-titan hub over a network |
| `@camera.*`, `@color.*` (palette, depth, offset, tint, rotate), `@light.*`, `@backdrop.*`, `@overlay.filename`, `@layer.pos{slotid, x, y, z}`, `@zone.define`, `@sprite.*`, `@cube.plot`, `@cube.line` | the upcycled presentation: cameras, palettes, voxel depth, backdrops, overlays, VM layers placed in 3D, per-zone rendering, sprites, 3D voxels | display devices, tile functions, the portrait |
| `@audio.*`, `@music.notes`, `@music.play` (microTracker), `@mixer.*`, `@restalgia.play` | sound and music, a note language, the 1-bit speaker's level | |
| `@video.record`, `@video.slice`, `@video.play` | record the VM's video and cut clips | scene recording |
| `@asm.build{input, output, cpu}` | assemble 6502 or 65C02 to a file or to memory | the cabinet's assemblers |
| `@bug.*`, `@feature.*` | file and discuss bug reports and feature requests from inside the emulator, with a memory capture | |

Three consequences for this page:

- **Counters exist per address**; what's missing is all addresses at once, and reads and executes in
  the recording.
- **The control programs in a microPAK are this API**, so a shared event model
  ([UPCYCLING-FORMATS.md](UPCYCLING-FORMATS.md#scripting-three-places-a-script-can-live)) maps onto
  `@counter`, `@mem.lock`, `@mem.poke`, `@key.type`, `@vm.exec` and `@share.command` directly.
- **microLink already networks VMs**, so the federation's hub should speak to microM8 through
  microLink as well as through MCP.

## Packages

microPAK, their package for an upcycled program, compared with the cabinet's cartridge and others,
with a shared vocabulary for upcycling metadata and scripts:
[UPCYCLING-FORMATS.md](UPCYCLING-FORMATS.md).

## Order of work

1. The federation demo over MCP: PDP-7 Forth to microM8's 3D turtle.
2. The `turtle.62` stream to turtleSpaces over port 1967.
3. A read-only SvelteKit memory panel on microM8's debug WebSocket: hex, 6502 disassembly, the heat
   map.
4. Write to April and Melody with all of the above working, and propose the WebAssembly module,
   offering to write it as a pull request.

↑ [README](README.md) · [MANIFESTO](MANIFESTO.md) · [TINY-TITAN](TINY-TITAN.md) · [WEB-BENCH](WEB-BENCH.md) · [LOGO-TURTLE](LOGO-TURTLE.md)
