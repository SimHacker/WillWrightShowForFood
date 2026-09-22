# SIMH → cabinet map — what to lift, what to make fresh, what to shed

Read from the Open SIMH source (`~/GroundUp/git/simh`, master, 22 Sep 2026),
not from memory. SIMH is the reference bench and the idea mine; this file is
the mining plan. Companion to [DESIGN.md](DESIGN.md).

## SIMH's cross-cutting architecture, inventoried

Six load-bearing ideas run through all fifty machines:

1. **The device schema** (`sim_defs.h`): every device is a `DEVICE` record —
   name, `UNIT[]`, `REG[]` (registers with named `BITFIELD`s), `MTAB`
   modifiers (SET/SHOW verbs), examine/deposit hooks, reset/boot/attach/
   detach lifecycle, `DEBTAB` debug channels. Because devices are *declared*,
   the control package can examine, deposit, save, restore, and debug any of
   them without knowing what they are. The schema is the product.
2. **The event queue**: a `UNIT` is also a timer (`action` + `time`);
   `sim_activate` schedules device service in instruction-cycles or µs.
   Everything asynchronous is this one mechanism — TTY char delivery,
   display cycle (`DPY_CYCLE_US 100`), clocks.
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
| `pdp18b_dpy.c` device split | display IOT dispatch | Lars's dpy05/06/07/10 match the SYMELEC IOT map word for word. He stubbed the pen readback (`dat |= 0`); we implement the IDRC packing — and could contribute it back upstream. |
| pen hit radius (`display.c`) | `LightPen.aperture` | Distance-squared against fresh intensification. Same idea, ours carries provenance. |
| `stop_inst = 0` | unknown IOT = no-op | Already shipped. |
| event queue (`sim_activate`) | small `{dueCycle, fn}` heap on the backplane | Needed now: TTY at ~100 ms/char, clock blink, display cycle pacing. Do not tick every device every step. |
| VM loop stop codes | `Cabinet.run(budget) → StopReason` | Browser runs a cycles-per-frame budget under rAF. |
| `REG` + `BITFIELD` schema | `inspect()` convention on Device/Cpu | Named registers with widths and bitfield names. Powers the web debugger panel and JSON snapshots. TS reflection gives half; the *declared names* are the valuable half. |
| SAVE/RESTORE | JSON snapshots | Ours are portable and URL-shareable demo states; SIMH's are binary and version-fragile. |
| EXPECT/SEND | TTY test harness | Feed keyboard bytes, assert printer output — acceptance tests for the SYMELEC boot without a browser. |
| DEBTAB channels | per-device debug streams | The segment log is one such stream. |
| LOAD hook | tape module | `.oct` / `.rim`, diffable against Roy's converter. |
| `pdp18b_g2tty.c` TCP attach | LinkPort precedent | The pattern (device attaches to a socket), not the code. |

## Fresh — no SIMH equivalent, or the wrong shape there

- **Light pen as a first-class input API.** SIMH smuggles the pen through
  two globals (`ws_lp_x/y`) set by the window backend; no touch, no per-
  program aperture, tip switch only on the 377A model. Ours: pointer/touch
  events → pen state `{x, y, aimed, aperture}`, hits computed against
  freshly intensified segments *with display-file provenance*, and the
  honest/assist tracking modes (DESIGN.md).
- **The web UI.** Canvas renderer consuming the segment log; front panel
  (start/stop/step, AC/PC lights); TTY panel (film-loop skin later);
  debugger powered by the `inspect()` schema; finger = pen on touch — the
  light pen *was* direct pointing, so a tablet is the honest peripheral.
- **The segment log.** SIMH's display core ages points and forgets them.
  Ours is a recorded, replayable stream — snapshot (SVG with provenance
  attributes), video (timestamped JSONL → WebM), phosphor simulation, and
  the pen are four consumers of one stream. Bugs become replayable; the
  1969-film comparison becomes a diff.
- **Mini-Titan.** Blocklet codec, `TitanApplication` plug-in surface, ring
  codec (`packages/pixie`, planned). SIMH has nothing here — g2tty is a
  dumb pipe, which is the right *lower* layer and nothing more.
- **Media modules.** Lineprinter lister (diffable against the 1972 listing
  itself), SVG/PNG snapshots, recorder. DESIGN.md § Media.
- **Declarative machine config.** A cabinet manifest (YAML jazz: cpu,
  devices, media, dimensional controls) instead of imperative DO scripts.

## Shed — SIMH's accretion, named so we can refuse it

`scp.c` (16.8k lines of command language), `sim_tmxr` (6.4k, telnet mux),
`sim_timer` (3.4k of wall-clock calibration — we budget cycles per animation
frame instead), sim_sock/disk/tape/card/ether, the fifty-machine makefile,
SDL/X11/Win32/Carbon backends, pthreads async I/O, the C macro system that
exists because C cannot reflect. Each was right for SIMH's mission (every
machine, every host, one tree). None serves *run PIXIE in a browser*.

## Credit

Bob Supnik built the architecture and the 18-bit family. Philip Budne and
Douglas Gwyn wrote the display core and the 340 state machine. Lars Brinkhoff
wired the 340 to the PDP-7 (2019, 2026) and mirrored the manual shelf. The
Open SIMH project keeps it alive. Where our stepped instruction or display
word disagrees with theirs, they are right until a DEC manual says otherwise
— and anything we fix that they stubbed (the pen readback) goes back as a
patch offer.

↑ [DESIGN.md](DESIGN.md) · [README](README.md) · [emulation plan](../../characters/heinz-lemke/sources/pdp7-reference/EMULATION-PLAN.md)
