# PIXIE resurrection — emulation plan

How to get the [recovered 1972 listing](../pixie-assembler-listing-1972/README.md) running,
light pen and all, with a Titan across the link. Companion to the [turist guide](GUIDE.md)
and the [reference library](README.md). Target: **CARS 2027 Berlin, 29 June 2027**.

## The shape of the problem

Three pieces, separable:

1. **A PDP-7 with a Type 340** — exists today in [Open SIMH](https://github.com/open-simh/simh)
   (`PDP18B/` CPU + `display/type340.c`), cloned at `~/GroundUp/git/simh`.
2. **A virtual Type 370 light pen** — the display engine already models pen-enable bits and
   fires `ty340_lp_int(x, y)`; the PDP-7 glue reads pen status back as a stub
   (`dat |= 0; // Light pen.` in `PDP18B/pdp18b_dpy.c`). One well-placed driver to write.
3. **A Titan** — not emulated anywhere, and not needed in full. PIXIE only ever saw Titan
   through Wiseman's link: blocklets with headers, word counts, checksums, and the `PXID`
   magic word. Emulate the *conversation*, not the computer.

## Does the PDP-7 emulator run in the browser?

Not today. Surveyed July 2026:

- **No JS/WASM PDP-7 with a 340 exists.** The PDP-7 UNIX world runs SIMH natively.
- **[SIMH-WebAssembly](https://github.com/OhmGeek/SIMH-WebAssembly)** is an experimental
  Emscripten wrapper (VAX-focused, ~5 stars). SIMH's pthreads + SDL + runtime `dlopen`
  make a port real work — proven possible by projects like PCem-WASM and RPCEmu-WASM
  (SharedArrayBuffer, COOP/COEP headers), but it fights the framework.
- **The PDP-7 itself is tiny**: 18-bit words, one accumulator, 4-bit opcode, ~8K–16K core.
  A purpose-built TypeScript core is a weekend-scale project, and the 340 is a *vector*
  display — canvas/SVG is its natural habitat. In software, the light pen inverts from
  hard to trivial: the emulator knows every segment it draws, so "pen sees beam" is a
  hit-test under the mouse. No photomultiplier physics required.

## Architecture — two benches, one protocol

### Bench A: SIMH, the lab bench (native, correctness)

The reference implementation, validated against DEC's own diagnostics.

- Build Open SIMH PDP-7 with 340 display (SDL2).
- Load `rsppix.oct` directly (deposit script or paper-tape image) — no assembler needed.
- **Write the light pen driver**: replace the stub in `pdp18b_dpy.c`, wiring mouse position
  through `type340.c`'s existing `lp_ena` / `ty340_lp_int` machinery. Acceptance test:
  DEC's Type 370 diagnostic ([7-78-M](DIGITAL-7-78-M_370LightPenDiag_Apr64.pdf)) passes.
- **Add the Titan link as a SIMH device**: model it on `PDP18B/pdp18b_g2tty.c` — the
  Graphics-2 terminal device the PDP-7 UNIX restoration added, which attaches to a TCP
  port (`att -U g2in 12345` → "Listening on port 12345"). Same pattern: a `LINK` device
  implementing Wiseman's IOTs, attached to a socket. This is the "extend the emulator
  with the custom networking instructions" work — precedent already merged upstream.

### Bench B: the browser (SvelteKit, for the turists)

Zero-install, clickable by anyone — the demo and teaching machine.

- **TypeScript PDP-7 core** (a `pdp7.svelte.ts` module — the machine state as runes,
  because why not watch the accumulator reactively): the instruction card, EAE subset
  PIXIE uses, interrupts.
- **340 as a canvas renderer**: display words interpreted into vector segments; P7
  phosphor persistence as a fade shader if we're feeling romantic.
- **Light pen = pointer events** hit-testing the segment list the renderer just drew.
- **Titan link IOTs** call into the link layer below.

### The Titan: a high-level protocol emulator, shared by both benches

Full protocol anatomy (decoded from the listing) and the TypeScript service architecture
with its `TitanApplication` plug-in surface: [**TITAN-LINK-PROTOCOL.md**](TITAN-LINK-PROTOCOL.md).

One implementation of the blocklet protocol (it is fully transcribed: headers, word
counts, checksums, retry-on-bad-header, error exits, the Titan→PDP relocation pass that
fixes ring pointers), packaged two ways:

- **A SvelteKit service** (`+server.ts` route or WebSocket endpoint): the "central Titan"
  — SIMH attaches its LINK device to it over TCP/WebSocket bridge; the browser bench calls
  it directly. It answers as user HL1470's application programs did: accept a PIXIE ring
  file, store it, send one back.
- **A local in-process mock** for offline runs — same protocol module, no network.

Titan does not need 48-bit words or extracodes to keep its side of a 1969 conversation.
If someone later builds a real Atlas 2 emulator (none exists; the Computer Conservation
Society only preserves Atlas 1), it can dock behind the same socket.

## Remote-controlling SIMH — any UI, not one UI

A light pen driver should not presume a particular user interface. Findings from the SIMH
source (verified in the local clone, July 2026):

- **Remote command console: built in.** `SET REMOTE TELNET=port` gives a multi-connection
  remote console over telnet — examine/deposit memory, attach devices, single-step, plus a
  master mode. No web server, but a WebSocket↔telnet bridge in the SvelteKit app is a
  few dozen lines. Full remote *control* is a solved problem.
- **Remote screen: not built in, but the seam is tiny.** SIMH's XY display core
  (`display/display.c`) talks to window systems through `display/ws.h` — nine functions
  (`ws_init`, `ws_display_point`, `ws_poll`, `ws_sync`, `ws_beep`, colors, shutdown) plus
  two globals. Existing backends: SDL (`sim_ws.c`), X11, Win32, Carbon. Writing one more —
  a **network backend** that streams intensified-point events to a socket and accepts
  pointer/keyboard events back — is a contained, few-hundred-line C module modeled on the
  SDL one. Batched points over localhost at frame rate is nothing.
- **The light pen mostly already exists.** The backend globals `ws_lp_x`/`ws_lp_y` carry
  the pointer position, and `display.c` *already computes pen-on-beam hits* from them with
  a configurable hit radius (that's how the PDP-1 side works). A remote pointer fed into
  those globals through the network backend **is** a light pen, for free, for every
  machine SIMH emulates. The only PDP-7-specific work remains the IOT read-back stub in
  `pdp18b_dpy.c`.

So the headless architecture is: SIMH runs anywhere with `SET REMOTE TELNET` + the network
display backend; the SvelteKit app bridges both sockets to the browser (canvas renders the
point stream with P7-phosphor fade; pointer events flow back); any other UI — native,
tablet, museum kiosk — speaks the same two sockets. Side effect: PDP-1 Spacewar in the
browser, since the display core is shared.

Point stream vs vector stream: start with `ws_display_point` events (universal across all
SIMH display machines); if bandwidth ever matters, add a higher-level tap in `type340.c`
that streams display words instead — the browser already knows how to execute those.

### Names on the table

For the Titan service: **TitanIC** (Titan + integrated circuit; unsinkable; failure modes
come pre-named) · **Titanopolis** · ~~SimTitan~~ (avoiding the Sim brand).

## Milestones

1. `make` SIMH pdp7 with display; run DEC's [340 display test](DIGITAL-7-60-N_Type34DisplayTest_Apr65.pdf).
2. Loader: `rsppix.oct` → SIMH deposit script. First attempt to start PIXIE; expect to
   learn things about missing SYMELEC linkage and entry conventions.
3. Light pen driver in `pdp18b_dpy.c` + mouse; pass the 370 diagnostic.
4. PIXIE tracking cross follows the mouse. (The 1969 film shows what right looks like.)
5. LINK device with Wiseman's IOTs; Titan protocol service answers a blocklet handshake.
6. Browser bench: TS core runs the same `.oct`, same Titan service.
7. Berlin: light buttons, radial menu question answered live, 58 years on.

## Open questions

- Assembler round-trip (Cambridge dialect cross-assembler, diff against `.oct`) — parallel
  track, not blocking: the octal is the binary truth.
- SYMELEC vs RSPPIX memory layout: do the two modules coexist in 16K, or bank-switch?
  The listing's location counters will tell.
- Character generator: PIXIE text uses the Type 342 — check SIMH's 340 implements the
  character mode PIXIE expects (`type340.c` has character support; verify stroke tables).

↑ [turist guide](GUIDE.md) · [reference library](README.md) · [PIXIE listing](../pixie-assembler-listing-1972/README.md) · [source recovery](../../pixie-source-recovery.md)
