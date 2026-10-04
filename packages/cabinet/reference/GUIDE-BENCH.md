# The browser bench, every layer

From the hardware up to the page. All TypeScript and Svelte; nothing below JavaScript.

| Layer | Where | What it is |
|---|---|---|
| Runtime | Node 22 for tests, the browser for the page | ES modules; `tsc` then `node --test`; no DOM in the emulator |
| Backplane | `packages/cabinet/src/cabinet.ts`, `bus.ts` | `Cabinet.step()`: OR every device's `irq()` onto one line, step the CPU, hand any IOT to the device that claims its code, `tick` every device. Devices never see each other |
| CPU | `plugins/pdp7.ts` | 18-bit words in a `Uint32Array`, 4K to 32K in 8K banks with extend mode, one interrupt level (PC to 0, jump to 1), auto-index 10–17, `XCT`, the EAE ops programs use. Ported from SIMH's `pdp18b_cpu.c` |
| Display | `plugins/type340.ts` | The 340 as a processor: fetches display words from core, runs PARAM, POINT, VECTOR, VCONT, INCR, CHAR (Type 342 glyphs from SIMH), SUBR (Type 347 `DJS`/`DJP`/`DDS`, one save register). Emits **segments** with provenance (display address, cycle, frame, subroutine, pen bit, glyph); a frame closes at each `IDLA`. Owns the pen IOTs (dev 07) because the hardware did, plus the `IDPN` extension (dev 11) |
| Pens | `plugins/lightpen.ts` | Input adapters, not devices: a position, an aperture, a colour. Any number, ORed into one pen input; `IDPN` tells which fired |
| Other devices | `teletype.ts`, `clock.ts`, `papertape.ts`, `rb09.ts`, `tiny-titan.ts` | Each is a `Device`: the IOT codes it claims, `iot()`, `tick()`, `irq()` |
| Assemblers | `asm/` | DEC and Cambridge dialects, `as7` for Mitch's Forth and UNIX; every word tied to its source line |
| Tools on core | `monitor.ts`, `disasm.ts`, `source.ts`, `trace.ts`, `core.ts`, `media.ts`, `session.ts` | Peek and poke by symbol, disassembly, source maps, the instruction trace, whole-core raw/JSON/YAML, SVG and YAML captures, recorded sessions that replay to the same core |
| Shadow 340 | `preview340.ts`, `edit340.ts` | Runs a display file to its stop all at once, without the CPU or the clock, for steady drawing and the low-level instruction editor; decode, encode and clamp vector words |
| Programs | `symelec-*.ts`, `lp370.ts`, `forth.ts`, `unixv0.ts`, `duel.ts`, `hilo.ts`, `lander.ts`, `tapes/` | Boot recipes, demo scripts that are acceptance tests, halt explanations |
| Rings | `packages/pixie` | PIXIE's word classes, `CAR`/`CDR`, `RingBuilder`, relocation, the transfer encoding, graphs and scenes |
| Applet | `apps/ties/src/lib/CabinetApplet.svelte` | The machine on a page: a `requestAnimationFrame` loop that runs cycles in slices (so pen moves land between refreshes), integrates the last 48 refreshes into one picture ([GUIDE-PHOSPHOR](GUIDE-PHOSPHOR.md)), draws on a 1024² canvas, and the panels: memory (octal, code, source, trace), rings, teletype, config, the tool menu (eight pens and the instruction editor) |
| Pages | `CabinetPage.svelte`, `routes/cabinet/[program]`, `cabinet-programs.js` | One route per program; the same applet embeds in any HyperTIES article (`Article.svelte`) |
| Server | SvelteKit, `apps/ties` | Static build by default, `SVELTE_ADAPTER=node` for the server; deployed by `scripts/server-deploy.sh hyperties` to hyperties.org, releases kept on the data disk |

**Where to start reading:** `cabinet.ts` (60 lines), then `type340.ts`'s `instruction()`, then
`CabinetApplet.svelte`'s `bootMachine()` and `loop()`. Run `pnpm --filter @wwsff/cabinet test`;
the house demo is a test SYMELEC has to pass.

**Plans above the bench** (designs in the cabinet's DESIGN.md, ROADMAP.md, MANIFESTO.md):

- *Phosphor and colour:* [GUIDE-PHOSPHOR](GUIDE-PHOSPHOR.md).
- *Editing any 340 program's screen:* the universal drawing and a paused drawing editor beside
  the low-level instruction editor ([DESIGN.md](../DESIGN.md#a-universal-340-editor)); the
  longer-term questions in [DRAWING-CONSTRAINTS.md](../DRAWING-CONSTRAINTS.md).
- *The machine.* A photorealistic PDP-7 rebuilt from photographs, with abstract people at it:
  retro Sims 1 characters (Heinz at the pen, Mitch at his Forth, Ken and dmr at UNIX, a robot
  for AI) animated by [VitaMoo](https://vitamoo.space), Don's TypeScript reimplementation of the
  Sims 1 animation system. Scott McCloud's masking effect: a simple character in a realistic
  scene is easy to step into.


## Emulation status — and what you actually need

- **PDP-7 + Type 340: emulated today, twice.** [Open SIMH](https://github.com/open-simh/simh)
has the PDP-7 with 340 display support natively; its PDP-7 light pen readback is still a
stub. Our own TypeScript emulator, [the cabinet](../README.md),
reimplements the PDP-7, 340 and 370 light pen using SIMH's source as the design spec and
oracle, and runs PIXIE in the browser with the pointer as the pen:
[PIXIE live](https://hyperties.org/databases/pixie/pixie-live/).
- **Titan: no emulator exists.** The Computer Conservation Society preserves two **Atlas 1**
emulators, but Atlas 2/Titan (different memory system, extracodes in main store) has
none. Documentation survives: the [CUCPS Titan archive](https://cucps.soc.srcf.net/titan/)
has supervisor planning documents and the machine-code programming manual.
- **The good news: PIXIE doesn't need Titan.** The listing is the PDP-7 side, complete, and
the other end of the link has a stand-in: [tiny-titan](../TINY-TITAN.md),
which speaks the blocklet protocol (header, word count, checksum, `PXID` magic word) and
receives PIXIE's drawings. A Titan emulator is a magnificent open quest, but it is not on
the critical path to clicking a 1969 radial menu.

The concrete plan — SIMH lab bench, browser bench in SvelteKit, and a shared high-level
Titan protocol service speaking blocklets over a socket — lives in
[EMULATION-PLAN.md](EMULATION-PLAN.md); the link protocol itself, decoded word by word
from the listing, in [TITAN-LINK-PROTOCOL.md](TITAN-LINK-PROTOCOL.md).

## Status

The ranked list of what's next, will and could is [TODO.md](../TODO.md); the big work in order
is [ROADMAP.md](../ROADMAP.md). Good first contributions for students: a test for a program
that has none, a CONFIG knob, an English comment table for the disassembler, a link fixed.

↑ [GUIDE](GUIDE.md) · [reference library](README.md)
