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
| **HTTP control API** | Get and set any emulator setting by `scope/key` (`octalyzer/apisettings.go`) | Profiles: a cartridge can set microM8's video mode, camera, speed |
| **Several machines at once** | microM8 runs several interpreter slots side by side (its "parallel virtual machine scripting") | One microM8 can be several federation members |
| **Source** | Go, MIT; builds with `lmake.sh`, including a `nox` build without X11 | Read, fork, contribute; a headless build is the starting point for anything in-browser |

What the heat map is today: 256 counters, each holding a 4-bit read intensity and a 4-bit write
intensity, either one per 256-byte page of the 64K, or one per byte within a chosen page, for main
or aux memory (`core/memory/mmu.go`, `HeatMapRead`/`HeatMapWrite`). There is also a combined execute mode,
instruction tracing, and settings for full CPU recording, to the debugger or to a file
(`DebugFullCPURecord`, `FileFullCPURecord`). There is no per-address record of reads, writes and executes, and no access
history you can browse.

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

- **Per-address access counters**: for each address, separate read, write and execute counts, and
  the cycle of the first and last of each. 64K addresses times a few counters is a few megabytes.
- **An access log**: a ring buffer of `(cycle, PC, address, kind, value)` records, streamed over
  the debug WebSocket, so a panel can show what happened and when, and scrub back through it with
  live rewind.
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
