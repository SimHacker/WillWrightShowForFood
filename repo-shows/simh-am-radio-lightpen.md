# SIMH AM Radio + Lightpen — design notes for the lander caper

Working notes for the retirement side project dared onto James Gosling and Nathaniel
Borenstein (31 Jul 2026): port `lander.ps` to emulated DEC iron, with a **virtual
lightpen input driver** and a **virtual AM radio audio output driver** for SIMH, "so you
can listen to it sing while it thinks."

Cast so far: Gosling (dared), Borenstein (dared), David Rosenthal (PDP-7 assembly
adviser), Lars Brinkhoff (PDP-7/Type 340 emulation bud —
[`pixie-pie-menus-pdp7.yml`](pixie-pie-menus-pdp7.yml)), Type 340 manuals archived at
[`characters/heinz-lemke/sources/pdp7-reference/`](../characters/heinz-lemke/sources/pdp7-reference/).

## Why an AM radio hears a computer at all

The party trick is older than most guests: a transistor radio on top of the cabinet
picks up switching transients from the CPU. A tight loop with period T radiates energy
at 1/T and its harmonics; change the loop, change the pitch; modulate loop selection
over time and you play a tune. Timbre comes from the instruction mix — how many bits
flip per cycle on the bus and registers. This is the benign end of the same physics as
van Eck phreaking / TEMPEST.

The delicious part: the **PDP-7 memory cycle is 1.75 microseconds**, so the fundamental
of a one-cycle loop sits at about **571 kHz — inside the AM broadcast band**
(530–1700 kHz), with second and third harmonics at ~1.14 and ~1.71 MHz also in or at
the edge of the band. Two-cycle instruction loops land the fundamental just below the
band but harmonics carry it in. The PDP-7 does not need help being an AM transmitter;
it needs help being emulated as one.

## Architecture: SIMH tap → GNU Radio → speaker

**Yes to GNU Radio.** It gives us the whole radio for free — the deliverable is a
flowgraph where the tuning dial is a literal slider.

1. **SIMH RFI tap (the new part).** A pseudo-device (`AMRADIO`?) that publishes
   per-cycle activity telemetry in real time: timestamp (emulated ns), and a cheap
   proxy for radiated energy — Hamming distance between successive AC/MB/bus states,
   or even just a pulse per memory cycle weighted by opcode class. SIMH already has
   real-time calibration, and there is direct precedent: the PiDP-8/PiDP-11 panels
   run on SIMH publishing front-panel register state at high rate. Same tap, different
   consumer. Ship it over a shared-memory ring buffer or UDP; GNU Radio eats either.

2. **GNU Radio flowgraph (the fun part).** Treat the pulse/activity stream as a
   baseband source; synthesize the "RF" as an impulse train convolved with a
   band-limited pulse; then a plain AM receiver chain: tunable bandpass (the dial) →
   envelope detector (magnitude + lowpass) → AGC → audio sink. Atmosphere layer:
   noise floor, a heterodyne whistle that moves with the dial, mains hum, occasional
   static bursts. Tune across the band and different loop harmonics fade in and out —
   exactly like the real trick, including finding the "good spot" on the dial.

3. **Optional live-show flourish:** feed the same flowgraph to a HackRF at microwatt
   power into a real antique tube radio on the desk. Software radio in, wooden radio
   out. (Legal at negligible power into a dummy-load-adjacent setup; the visual is
   worth it.)

## Neural net? Not for v1

Pull the simulation out of our ass with confidence — it is mostly deterministic
physics, and "vibe sounding it out" against reference recordings is the historically
authentic methodology (that is literally how the original hackers tuned their loops).
The activity→amplitude mapping has maybe four knobs: per-opcode energy weights, pulse
shape, band coupling, noise floor.

Where ML earns its keep later: a **dirt model** — record real big iron on a real AM
radio, run the same program in SIMH, and train a small residual/timbre-transfer model
mapping simulated traces to recorded audio. Train on real machines we can still reach
(1401, PDP-1), apply to machines we cannot (PDP-7). But get an ear first; the net
comes after we know what "right" sounds like.

## Prior art to steal from

- **System Bus Radio** (William Entriken, [github.com/fulldecent/system-bus-radio](https://github.com/fulldecent/system-bus-radio)) —
  plays AM music from a modern laptop by toggling the memory bus. Modern existence
  proof that instruction-level activity → AM audio is modelable; the modulation math
  is right there.
- **Tempest for Eliza** — classic Linux program playing music into an AM/shortwave
  radio via monitor RFI.
- **Steve Dompier, Homebrew Computer Club, 1975** — the Altair 8800 playing "The Fool
  on the Hill" into a transistor radio ("Music of a Sort"); the canonical demo of the
  genre, documented in Levy's *Hackers*.
- **IBM 1401 radio music** — the Reykjavík 1401 recordings behind Jóhann Jóhannsson's
  *IBM 1401, A User's Manual*; and the Computer History Museum's working 1401 demo lab
  has done the radio-on-the-console trick for visitors.
- **PiDP-8/PiDP-11 front-panel protocol** — the existing SIMH state-publishing tap to
  imitate.

## The lost videos, and recording new ones

Don linked YouTube videos of big iron singing on AM radio years ago; they appear gone.
Recovery plan:

1. **Dig up the old links** — search Don's HN/reddit comment history for youtube +
   radio/PDP/1401/Altair; dead IDs are still leads.
2. **Resolve dead IDs** — Wayback Machine snapshots of the watch pages give titles and
   uploaders; filmot.com indexes metadata for deleted videos; titles then find
   reuploads and archive.org mirrors.
3. **Record new ones** — CHM Mountain View has the working **IBM 1401** demo lab and
   the restored **PDP-1** (Spacewar! demos): bring a portable AM radio and a recorder.
   PDP-7s are the hard case — the LCM+L machine (the Unix v0 PDP-7) went dark with the
   museum's closure, which is exactly why the simulator matters: the emulated PDP-7
   radio may soon be the only way to hear one think.
4. **Ask the buds** — Lars Brinkhoff knows where every surviving PDP-7 is; Heinz may
   remember what the Cambridge machine room sounded like on a radio, which is show
   gold either way.

## Show beats

- Tune the dial live across the harmonics of the lander's main loop until it sings.
- Play the real 1401/Altair recordings A/B against the simulator — the vibe-tuning
  session *is* a segment.
- Land the Lunar Entry Module on the McDonald's while the radio plays the descent.
