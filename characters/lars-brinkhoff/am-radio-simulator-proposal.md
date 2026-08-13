# Proposal for Lars — AM Radio Simulator beside the big iron

*Don’s proposal to [Lars Brinkhoff](README.md) — not Lars’s words.*
[Portrayal standards](../../schemas/portrayal-standards.md) · consent not_yet_asked

## The pitch

Run the **big-iron emulators throttled to wall-clock real time** — so a PDP-7 / Type 340
munch or Life generation takes as long as it did on living iron — and sit an **AM radio
simulator** next to them that beeps and boops the way a transistor radio did when you set it
on the Type 347 controller.

On living hardware, MIT AI Lab hackers called Munching Squares’ RFI **Munching Tunes**.
Emulators usually throw that soundtrack away. We want it back — as a first-class organelle,
not a YouTube nostalgia clip.

| Layer | Job |
|-------|-----|
| **Big iron emulator** ([SIMH](https://github.com/open-simh/simh) / [Lars’s forks](pdp7-development.md)) | PDP-7 + Type 340 (+ light pen path); **throttle** so cycle time ≈ historic wall clock |
| **AM radio simulator** | Turn display-controller / bus activity into AM-band audio — beeps, boops, munching tunes |
| **[GNU Radio](https://www.gnuradio.org/)** path | Software-defined AM TX/RX in the box — [AM transmitter & receiver tutorial](https://wiki.gnuradio.org/index.php/Simulation_example:_AM_transmitter_and_receiver) · [AM Demod](https://wiki.gnuradio.org/index.php/AM_Demod) — no stolen spectrum; speaker is the “radio” |
| **Front panel / PadCrafter** | Sense switches that *change the tune* — pair with [Edd Coates / PadCrafter blinkenlights](../edd-coates/ideas.md#pixie-pdp-7-light-pens-engelbart-emulators-padcrafter-blinkenlights) |

**Why throttle matters:** modern hosts are too fast; RFI “music” only makes sense when the
compute rate lands in the audio / AM-interference band the way the original iron did. Slow
the iron to real time; let the radio sing in real time.

**Show fit:** [PIXIE on PDP-7](../../repo-shows/pixie-pie-menus-pdp7/README.md) ·
[Lars show seed](../../repo-shows/lars-brinkhoff/) · async segments already green-lit
([correspondence](correspondence.yml)).

---

## Wonderful videos (watch with sound on)

YouTube originals for the SDF / LCM PDP-7 demos have a habit of vanishing — cite **live**
links where they still work, and **Wayback** mirrors for the classics Don posted on HN in 2020.

### PDP-7 + Type 340 + AM radio (the core demos)

| Demo | Links | Notes |
|------|-------|--------|
| **Munching Squares + Spirograph** on PDP-7 sn 129 / Type 340 | YouTube (may be dead): [watch?v=V4oRHv-Svwc](https://www.youtube.com/watch?v=V4oRHv-Svwc) · **Wayback:** [2020-04-19 snapshot](https://web.archive.org/web/20200419194925/https://www.youtube.com/watch?v=V4oRHv-Svwc) · Forum write-up: [Retro Computing Forum](https://retrocomputingforum.com/t/munching-squares-and-spirograph-demo-pdp-7-and-type-340-display/4856) · [jwz](https://www.jwz.org/blog/2020/03/munching-squares/) · Don on HN: [22853988](https://news.ycombinator.com/item?id=22853988) | P7 phosphor afterglow; AM radio on Type 347 → **Munching Tunes**; left switches reshape the pattern |
| **Conway’s Life** (Gosper guns etc.) on PDP-7 / Type 340 + AM | YouTube (may be dead): [watch?v=hB78NXH77s4](https://www.youtube.com/watch?v=hB78NXH77s4) · **Wayback:** [2020-04-13 snapshot](https://web.archive.org/web/20200413075431/https://www.youtube.com/watch?v=hB78NXH77s4) · HN: [22853920](https://news.ycombinator.com/item?id=22853920) (Don) | Yaesu FT1XD in AM mode on Type 347 RFI — “bytebeat music” without the one-liner constraint |

### Still-live companions

| Demo | Link | Notes |
|------|------|--------|
| **Spacewar!** on the real PDP-1 | [Lyle Bickley explains the PDP-1 (and we play the original Spacewar!)](https://www.youtube.com/watch?v=1EWQYAfuMYw) | Vector-console ancestry next to PIXIE / munch culture |
| **Flight of the PIXIE** | [Yuja Wang — Flight of the PIXIE](https://www.youtube.com/watch?v=jDrqR9XssJI) · [tribute notes](../yuja-wang/sources/flight-of-the-pixie-tribute.md) · [CHM/TLG broadcast](../don-hopkins/sources/2020-04-06-flight-of-pixie-chm-tlg-broadcast.md) | Cambridge CAD film energy; pairs with [PIXIE show](../../repo-shows/pixie-pie-menus-pdp7/README.md) |

### Code / history anchors (not video, but link them anyway)

| What | Link |
|------|------|
| HAKMEM Item 146 — Munching Squares origins (PDP-1, Jackson Wright, 1962) | [HAKMEM (MIT AI Memo 239)](https://dspace.mit.edu/handle/1721.1/6086) · [jwz summary](https://www.jwz.org/blog/2020/03/munching-squares/) |
| PDP-1 Munching Squares (software archive) | [archive.org — pdp1_munchingsquares](https://archive.org/details/pdp1_munchingsquares) |
| Lars — Emacs / VT220 munch ports | [munching-squares.el](https://github.com/larsbrinkhoff/munching-squares.el) · [vt220-munching-squares](https://github.com/larsbrinkhoff/vt220-munching-squares) |
| Lars — KA10 + Type 340 path | [ka10-simh](https://github.com/larsbrinkhoff/ka10-simh) · [pdp7-development.md](pdp7-development.md) |
| Type 340 programming manual | [bitsavers PDF](http://bitsavers.trailing-edge.com/pdf/dec/graphics/7-13_340_Display_Programming_Manual.pdf) · [local sidecar](media/reference/dec-7-13-type-340-display-programming-manual.yml) |
| Cambridge hardware stack (340 / 347 / light pen) | [cambridge-pixie-hardware-stack.yml](media/reference/cambridge-pixie-hardware-stack.yml) |
| Don’s HN physics of AM RFI (slow iron sings; phones don’t) | [comment on 22723884](https://news.ycombinator.com/item?id=22723884) |

---

## Design sketch (for Lars to shred)

1. **Throttle** — emulator option: lock PDP-7 / 340 refresh to historic timing (or a calibrated “museum tempo”).
2. **Tap points** — export a cheap activity stream from Type 347 / display-list / memory traffic (not full RF physics on day one — a musically honest caricature is fine).
3. **AM radio sim** —
   - **v0:** map activity → audio oscillator / noise bed (local speakers = the radio).
   - **v1:** [GNU Radio](https://wiki.gnuradio.org/index.php/Simulation_example:_AM_transmitter_and_receiver) flowgraph — AM modulate a carrier, demodulate to Audio Sink; knob for “tuning” and antenna position metaphors.
4. **Switches change the song** — front-panel / PadCrafter layouts ([Edd proposal](../edd-coates/ideas.md#pixie-pdp-7-light-pens-engelbart-emulators-padcrafter-blinkenlights)) drive the same sense switches the SDF demos read.
5. **A/B on stream** — play Wayback munching tunes, then live throttled emulator + radio sim; audience votes with their ears.

Optional stretch: RTL-SDR / real AM radio next to a PiDP or museum visit — but the **default** path is all software so every Repo Show viewer can reproduce from [`SETUP.md`](../../rigs/_TEMPLATE.SETUP.md).

---

## Ask

Lars — when you’re back from Swedish July vacation ([async pivot](outbound-2026-07-03-async-pivot.md)):

**No obligation to write any code — just jam about how it would work.**
([Brainstorm heartbeat](../../process/brainstorm-heartbeat.md) — talk designs; we throw them in the
repo; others play.)

1. How would *you* go about a **real-time throttle + AM radio organelle** beside PDP-7 / 340?
2. Tradeoffs: caricature audio from display-list stats vs a serious [GNU Radio](https://wiki.gnuradio.org/index.php/Simulation_example:_AM_transmitter_and_receiver) IQ toy — what’s elegant?
3. Want this as its own short async atom (munch + radio) before the PIXIE pie segment — conversation only?

Zero homework. Zero coding. Homefun only for whoever gets excited later.

— Don
