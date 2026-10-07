# SIMH → Cabinet — actual and aspirational alignment

This comparison uses two references with different scope. The attached
*Writing a Simulator for the SIMH System* describes SIMH V3.8-1 (2008); it is
an interface guide, not a complete specification of current SIMH. Bob Supnik's
site now lists the classic V3.12-5 stream, while the substantially enhanced V4
stream is maintained as [Open SIMH](https://github.com/open-simh/simh). The
source-level observations below were checked against Open SIMH master on 22
Sep 2026. The [classic SIMH site](https://simh.trailing-edge.com/) explains
that distinction.

SIMH is a portable C framework and a broad family of host-running historical
system simulators. Cabinet is a browser-oriented TypeScript emulator platform
whose implemented machine is currently the PDP-7 with its Type 340 display
processor and selected devices. Cabinet borrows useful contracts and reference
behavior; it is not a port of SIMH's SCP. Companion to
[DESIGN.md](DESIGN.md).

## Comparison by status

| Area | SIMH model | Cabinet today | Status / direction |
|------|------------|---------------|--------------------|
| CPU run loop | `sim_instr()` runs until a stop condition; SCP owns RUN/CONT/STEP and stop reporting. | `Cpu.step()` executes one instruction and returns a small result; `Cabinet.run(budget)` repeats steps up to a bound or halt. | **Aligned in shape, intentionally smaller.** There is no general stop-code, breakpoint, or multi-CPU framework. |
| Memory inspection | Device `examine`/`deposit` hooks support SCP's generic EXAMINE/DEPOSIT commands. | `Monitor` resolves PDP-7 symbols and peeks/pokes core; `Cpu` also provides `read`, `write`, and `deposit`. The browser has memory/source views. | **Partial alignment.** The monitor is core-focused, not a generic inspector for every device's registers. |
| Device model | `DEVICE`, `UNIT`, `REG`, and `MTAB` describe devices, per-unit state, registers, options, and lifecycle hooks. | `Device` exposes a name, claimed IOT codes, an IOT handler, optional `tick`, `irq`, and `reset`; a `Cpu` is supplied separately to `Cabinet`. | **Shared device/backplane idea, different contract.** Cabinet has no generic UNIT arrays, SET/SHOW modifiers, attach/detach lifecycle, or self-describing register schema. |
| Timing | SCP's active queue schedules unit service via `sim_activate`; CPU time and optional wall-clock calibration drive it. | `Cabinet.step()` calls every installed device's `tick(1)` once per instruction and increments `cycles`. The page budgets runs from its browser frame loop; the clock is a device. | **Not the same scheduler.** Current stepping is deterministic and simple; an event queue is a possible future optimization or timing model, not implemented Cabinet behavior. |
| Interrupts | Each VM defines its interrupt model; devices commonly update flags and CPU-visible request state. | The backplane ORs installed devices' `irq()` values onto one `cpu.irqLine`; the CPU plugin decides how to honor it. | **Concrete, narrow alignment.** No generic priority controller or independently declared interrupt routes. |
| Operator controls | SCP provides a textual command interpreter, device-specific SET/SHOW, breakpoints, scripting, LOAD, ATTACH, SAVE, and RESTORE. | The app has browser controls, a PDP-7/340 display, teletype and pointer input, step/run/pause, and core inspection/deposit. | **Different host surface.** There is no full SCP command language or generic breakpoint system. |
| Persistence and replay | SAVE/RESTORE saves simulator state through SIMH's VM/device conventions. | `SessionRecorder` records external inputs with machine-cycle timestamps; the app stores/exports those event logs and replays them from a fresh boot. | **Replay, not checkpointing.** There is no generic whole-machine snapshot/restore API. Persistent disk media is separate from a CPU/device checkpoint. |
| Display | SIMH's Type 340 state machine calls host-independent memory, flag, and pen hooks; a window-system layer handles presentation. | Cabinet ports the Type 340 behavior, connects it to PDP-7 memory and IOTs, and emits vector segments with provenance for browser renderers and tools. | **Strong semantic alignment, different output boundary.** Cabinet preserves an inspectable segment stream rather than making SIMH's host pixels its public contract. |
| Machine definition | SIMH VM source registers its devices and tables with shared SCP globals and build conventions. | Current program setup is JavaScript in the app; `Cabinet` accepts a CPU and device list. Cartridge files and machine manifests are still being designed. | **Composition is real; declarative configuration is aspirational.** |
| Breadth | One framework supports many CPU families, peripheral libraries, host platforms, and operating systems. | PDP-7 is the implemented CPU plugin; the PDP-7's Type 340, teletype, clock, paper tape, RB09, and experimental devices are composed as needed. | **Intentionally not at parity.** Apple II, PDP-10, MIX, and other CPU candidates are plans, not current Cabinet support. |

The compact contracts live in [`src/bus.ts`](src/bus.ts), the backplane in
[`src/cabinet.ts`](src/cabinet.ts), core inspection in
[`src/monitor.ts`](src/monitor.ts), and cycle-stamped input replay in
[`src/session.ts`](src/session.ts). The app wiring and panels live in
[`apps/ties/src/lib/CabinetApplet.svelte`](../../apps/ties/src/lib/CabinetApplet.svelte).

## SIMH's cross-cutting architecture, inventoried

These are the important SIMH ideas for comparison; their presence in SIMH
does not mean Cabinet has implemented the corresponding general framework:

1. **The device schema** (`sim_defs.h`): every device is a `DEVICE` record —
   name, `UNIT[]`, `REG[]` (registers with named `BITFIELD`s), `MTAB`
    modifiers (SET/SHOW verbs), examine/deposit hooks, reset/boot/attach/
    detach lifecycle, `DEBTAB` debug channels. Because devices are declared,
    SCP can provide generic controls over their state. This breadth comes from
    the schema and the runtime built around it.
2. **The event queue**: a `UNIT` is also a timer (`action` + `time`);
    `sim_activate` schedules device service in simulated time; clocks and
    asynchronous device work use that mechanism.
3. **The VM loop contract**: `sim_instr()` runs until a stop reason;
   breakpoints, step counts, and device stops are all just return codes.
4. **The command surface** (`scp.c`, 16.8k lines): EXAMINE / DEPOSIT / RUN /
   STEP / BREAK / SET / SHOW / SAVE / RESTORE / LOAD / DO scripts /
   EXPECT+SEND (scripted console I/O for tests) / remote console.
5. **Debug streams**: per-device named channels (`DBG_IOT`, `DBG_IRQ`…),
   switchable at runtime.
6. **The display stack** (`display/`): `type340.c` (Budne 2003–2018, wired
   for the PDP-7 by Brinkhoff 2019/2026) is a **host-independent 340 state
   machine** behind five callbacks — `ty340_fetch`/`ty340_store` (memory),
   `ty340_lp_int` (pen), `ty340_rfd`, `sense`/`clear` (flags). Below it,
   `display.c` ages phosphor points and computes pen-on-beam hits by radius
   against `ws_lp_x/y`; `ws.h` is a nine-function window-system seam.

## Map — port with credit

| SIMH | Cabinet | Notes |
|------|---------|-------|
| `ty340_instruction()` decode | `Type340` display processor | Port nearly line-by-line: PARAM/POINT/SLAVE/CHAR/VECTOR/VCONT/INCR/SUBR modes, per-word `lp_ena`, stop + stop-interrupt, h/v edge, scale/intensity, 347 DJS/DJP **with return linkage stored to core** — exactly the locations 3/5 PIXIE reads. Keep DEC bit numbering (MSB = bit 0) verbatim; it is where the bugs live. Validate the decode against the listing's own octal+mnemonic pairs. |
| `pdp18b_dpy.c` device split | display IOT dispatch | Lars's dpy05/06/07/10 match the SYMELEC IOT map word for word. In `dpy07`, IDRC's X/Y readback is stubbed as `dat |= 0; // X, Y`. Cabinet packs the latched pen coordinates into AC using the bit layout exercised by SYMELEC's TRCR routine. |
| pen hit radius (`display.c`) | `LightPen.aperture` | Distance-squared against fresh intensification. Same idea, ours carries provenance. |
| `stop_inst = 0` | unknown IOT = no-op | Already shipped. |
| `sim_activate` event queue | `Device.tick(1)` on each `Cabinet.step()` | **Actual difference:** Cabinet ticks all installed devices synchronously per guest instruction. There is no `{dueCycle, fn}` queue or SIMH-style wall-clock calibration. |
| `sim_instr()` and stop statuses | `Cpu.step()` / `Cabinet.run(budget)` | **Actual, minimal analogue:** a step result can signal halt; `run` is bounded. A shared `StopReason` taxonomy and general breakpoint support are not present. |
| `REG` / `BITFIELD` declarations | CPU fields, `Monitor`, symbols, app memory/source views | **Partial analogue:** core and selected CPU state are inspectable, but devices do not publish a standard named-register schema. |
| SAVE / RESTORE | cycle-stamped `Session` input log | **Not equivalent:** recorded inputs replay from boot; the log is not a serialized CPU, device, memory, and scheduler checkpoint. |
| EXPECT / SEND | headless tests and app input/replay | **Pattern borrowed:** tests drive keys and assert output. No general console-expect scripting language is implemented. |
| `DEBTAB` channels | segment log and selected debug/inspection tools | **Partial analogue:** the segment stream is inspectable; there is no uniform runtime-configurable debug-channel API per device. |
| `sim_load` / ATTACH | cartridge boot/load steps and concrete tape/disk devices | **Partial analogue:** loading and media are program/device-specific; generic SIMH attach lifecycle is not provided by `Device`. |
| `pdp18b_g2tty.c` TCP attach | `LinkPort` design | **A precedent, not an implementation:** a transport-neutral port is planned; the SIMH socket code is not reused. |

### Verified against the source, 22 Sep 2026

Read in full before rung 2. **Lift:** the mode-machine bit fields, the
status-word-as-stop-mechanism (`status == 0` means running, so
stop/resume falls out free), edge clip semantics, scale-as-multiplier
(1/2/4/8), the 347 jump encodings, and the 342 `chars[]` table — the
display-word codec cross-check we wanted beside the H-340 manual.
**Pen semantics co-signed:** `display_point` returns hit iff the mouse
is within radius of the point being intensified *right now* — the blue
flash, never the afterglow, same sentence as DESIGN. **Keep different:**
SIMH draws pixels and pen-tests pixels; we emit segments with
provenance and pen-test segments, because PIXIE needs to know *what*
was hit and the portrait needs the segment log as its one stream.
**The differential test for rung 2:** same display file through
`ty340_instruction` and through our `Type340`, diff the points. **The
open sockets in the glue** (empty `ty340_lp_int`, `dat |= 0; // X, Y`
readback): our IDRC packing fills them; candidate upstream patch.

## Cabinet-specific work already implemented

- **Light pen as a first-class input API.** SIMH smuggles the pen through
  two globals (`ws_lp_x/y`) set by the window backend; no touch, no per-
  program aperture, tip switch only on the 377A model. Ours: pointer/touch
  events → pen state `{x, y, aimed, aperture}`, hits computed against
  freshly intensified segments *with display-file provenance*, and the
  honest/assist tracking modes (DESIGN.md).
- **The web UI.** Canvas renderer consuming the segment log; front-panel
  run/pause/step and AC/PC display; teletype, memory/source views, and pointer
  input. Touch input is a natural light-pen adapter.
- **The segment stream.** SIMH's display layer renders and ages points.
  Cabinet exposes segments with provenance to renderers and tools, including
  SVG/PNG export, video capture, phosphor treatment, and pen hit-testing. This
  is a display-event stream, distinct from the input `Session` replay log.
- **Mini-Titan.** Blocklet codec, `TitanApplication` plug-in surface, ring
  codec (`packages/pixie`, planned). SIMH has nothing here — g2tty is a
  dumb pipe, which is the right *lower* layer and nothing more.
- **Media modules.** Lineprinter lister (diffable against the 1972 listing
  itself), SVG/PNG snapshots, recorder. DESIGN.md § Media.

## Aspirational alignments

SIMH is a useful source of patterns, not a checklist Cabinet must reproduce.
These capabilities have a design home, but should be treated as future work
until their implementation and tests exist:

- **Scheduled device events.** Replace per-instruction polling only when a
  measured need or device timing model warrants it. Preserve deterministic
  machine-cycle ordering; do not copy SIMH's wall-clock calibration by default.
- **Declared device inspection.** Add named registers, widths, status fields,
  and debug categories if multiple devices need uniform tools. Prefer explicit
  TypeScript metadata over rebuilding SIMH's C macro machinery.
- **Generic stop and breakpoint results.** Expand the small `Step` result only
  when the debugger or another CPU needs a shared stop taxonomy, watchpoints,
  or breakpoints.
- **Whole-machine snapshots.** Define versioned CPU/device/memory state and
  restore compatibility separately from external-input session replay.
- **Declarative cartridge machine wiring.** Cartridge manifests may describe
  CPU, memory, devices, ports, timing, interrupts, media, and panels, then be
  validated before boot. Current program setup is still app JavaScript; see
  [CARTRIDGES.md](CARTRIDGES.md).
- **Transport-backed devices.** A LinkPort or other host transport can follow
  SIMH's attachable-device precedent, but must fit browser security, lifecycle,
  and deterministic replay.

## What Cabinet intentionally does not inherit

SIMH's complete SCP command language, every host backend, broad family of
machine/device libraries, and generic file attachment model serve its
multi-system C project. Cabinet's current goal is to run and inspect selected
historical programs in a browser. Keep the proven guest semantics and borrow
useful patterns; do not treat SCP parity or SIMH's implementation structure
as a requirement.

The SCP command-language surface, `sim_tmxr` Telnet multiplexing,
`sim_timer` wall-clock calibration, generic socket/tape/card/Ethernet
libraries, the multi-machine build system, SDL/X11/Win32 backends, pthread
asynchronous I/O, and the C macro system are not part of Cabinet's current
browser runtime. Some capabilities may later have browser-native analogues;
their absence is a scope choice, not a claim that they are poor designs.
Quite the opposite: we are in awe of its design and history, and are 
grateful to stand on its authors' shoulders!

## Credit

Bob Supnik built the architecture and the 18-bit family. Philip Budne and
Douglas Gwyn wrote the display core and the 340 state machine. Lars Brinkhoff
wired the 340 to the PDP-7 (2019, 2026) and mirrored the manual shelf. The
Open SIMH project keeps it alive. Where our stepped instruction or display
word disagrees with theirs, they are right until a DEC manual says otherwise
— and anything we fix that they stubbed (the pen readback) goes back as a
patch offer.

↑ [DESIGN.md](DESIGN.md) · [README](README.md) · [emulation plan](reference/EMULATION-PLAN.md)
