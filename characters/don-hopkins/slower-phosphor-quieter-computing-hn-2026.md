# Slower phosphor, not faster refresh — quieter computing (HN, Aug 2026)

**Thread:** [I Dream of Quieter Computing](https://news.ycombinator.com/item?id=49405682) — [Henry From Online](https://henry.codes/writing/i-dream-of-quieter-computing/) (Aug 2026). A small-web manifesto: forested internet, hand-made webrings, hackable hardware, personal computers made personal again — not nostalgia, a build-forward dream.

**Parent comment:** [mrob](https://news.ycombinator.com/item?id=49406990), replying to Henry's "glass and refresh rates" line — argues the *opposite* hardware fix: higher refresh rate is metaphorically *quieter* because discrete frames introduce latency, phantom-array strobe, and sample-and-hold blur; a tool that disappears into the body needs **at least 1000 Hz**.

**Don's replies:** [49407686](https://news.ycombinator.com/item?id=49407686) (phosphor) · [49407938](https://news.ycombinator.com/item?id=49407938) (slow computers + pie menus — **edited** with full PIXIE hardware dump + listing recovery)

**mrob's rebuttals:** [49407821](https://news.ycombinator.com/item?id=49407821) (slow phosphors also artifact; 1000 Hz ≈ reality) · [49407984](https://news.ycombinator.com/item?id=49407984) (keyboard-only OK at low Hz; graphics need a mouse)

**skydhash → mrob:** [49408091](https://news.ycombinator.com/item?id=49408091) — viewport = spacemouse; tracing = pen; mouse is cheap, not best.

**Don → skydhash (Buxton 1983):** [49408130](https://news.ycombinator.com/item?id=49408130) — cites [Lexical and Pragmatic Considerations of Input Structures](sources/buxton-1983-lexical-pragmatic-input-structures.md); **edited** to add Miyamoto (hands/face, [prior post with all keynote videos](https://news.ycombinator.com/item?id=27918255)) and **Heinz's draftsman-template origin story** for PIXIE's radial menus — archived at [`../heinz-lemke/sources/2026-08-23-draftsman-template-radial-menus.md`](../heinz-lemke/sources/2026-08-23-draftsman-template-radial-menus.md).

---

## The comments (verbatim)

### Don → mrob (phosphor)

> We don't need faster refresh rates, we need slower phosphor.
>
> https://youtu.be/1EWQYAfuMYw?t=832

### mrob → Don

> We need faster refresh rates. Slow phosphors also cause unnatural visual artifacts. 1000Hz is roughly the point where you get motion quality that, except for a rare few test signals (e.g. multiplexed displays), is easily mistaken for reality.

### Don → mrob (slow computers, pie menus — edited on HN)

> Naw, we just need better software and slower computers, like the PDP-1, that don't require such fast refresh rates, just slow phosphor.
>
> But slow computers still need fast and reliable user interfaces, like radial pie menus.
>
> Flight of the PIXIE - Yuja Wang:
>
> https://www.youtube.com/watch?v=jDrqR9XssJI
>
> PIXIE: A New Approach to Graphical Man-Machine Communication:
>
> https://www.donhopkins.com/home/documents/PIXIE%20a%20new%20approach%20to%20man-machine%20communication.pdf
>
> The computer shown in that video is a much more advanced and faster PDP-7, talking to an even bigger and faster Titan mainframe over a custom network!
>
> https://en.wikipedia.org/wiki/Titan_(1963_computer)
>
> It proves that slow computers can still be usable with better software, and that today's unusable computers are pissing away enourmous amounts of power, but still suck.
>
> Edit: I just showed you a video of a computer with a light pen. Did you check that out? It's only two minutes, and I made it to musically highlight PIXIE, because most people don't want to sit through silent hours of the original digitized films from Cambridge.
>
> PIXIE is not one box. It is a network distributed CAD workstation (1967–1972) — like AJAX, but with P7 two-layer cascade phosphor on a 16ADP7A radar tube instead of HTML:
>
> Interactive front end: DEC PDP-7 + Type 340 CRT. Real-time drawing, light pen, radial "control lightbuttons", graph model in core.
>
> Compute / storage host: Titan (Cambridge's Ferranti/ICT Atlas 2 prototype). RAINBOW apps: CONN, COMPACT, PLOT, LADAN circuit analysis, file store.
>
> Wire between them: Wiseman link (Cambridge custom) + Lang's supervisor software. Move typed ring-structure models blocklet-by-blocklet.
>
> Word size: 18 bits. Core (PIXIE design target): 8K words — "only 8K of 18 bit words ... no auxiliary storage". Core (likely installed): 8K–16K (GUIDE: "here likely 16K"). Cycle time: ~1.75 µs. ~571K cycles/s. Addressing: 13-bit + indirect bit. Registers: One accumulator + link bit.
>
> DEC made lots of "instruction sets in a chassie" extension boxes, and Wiseman at Cambridge rolled his own network with its own custom instructions.
>
> Extended Arithmetic Element: Type 177 EAE. Multiply, divide, shifts, normalize (64xxxx op family in listing).
>
> Precision incremental display: Type 340. Required — second processor + DMA display file.
>
> Light pen: Type 370. Pen flag IOTs; diagnostic 7-78-M in pdp-7 reference.
>
> Symbol generator: Type 342. 6-bit character codes → stroke sequences in display file.
>
> Subroutine option: Type 347. DJS / DJP — display jump-to-subroutine (subpictures as display subroutines)
>
> Titan link interface: Cambridge custom (Wiseman) Undocumented IOTs: LCF, LSF, LKE, LLB6, LLB18, LRB18, LLAM, LSA, LKD — networking as instructions.
>
> The 340 display was an amazing ensembel of hardware, and could plug into a PDP-1 as well. The SIMH emulator supports it well.
>
> Model: DEC Type 340 Precision Incremental CRT System (H-340, Nov 1964). Tube lineage: Type 30E → 16ADP7A radar tube, P7 phosphor, 1024×1024 address grid. CPU coupling: Cycle steal / data break — 340 fetches display words from PDP-7 core while CPU runs. Vector timing: ~1.5 µs incremental vectors (vs Type 30 ~50 µs per CPU-plotted dot). Display word types: Parameter, point, vector, vector-continue, increment, character; with 347: DJS/DJP subroutines. Light pen: Per-word pen-enable bits; tracking uses cross + recovery spiral (~2× cross size) — spec in Ch. 5.
>
> The 340 executes its own instruction set in memory (display file = program). PIXIE's subpictures are literally display subroutines — Myer & Sutherland's "wheel of reincarnation".
>
> The Titan mainframe it communicated woth was another story, a big deal at the time! It ran RAINBOW: BCPL + FORTRAN analysis (e.g. LADAN), file store, COMPACT/PLOT/CONN/CONNMAP pipeline.
>
> Identity: Ferranti/ICT Atlas 2 prototype; Cambridge name Titan (1964–Oct 1973). Word size: 48 bits (8×6-bit chars or 2×24-bit halfwords). Core growth: 32K → 64K → 128K words. Addressing: Base/limit registers; user address ORed with base (not added). "Cache": Tunnel-diode operand slave store — Cambridge claims first cache. Software "instructions": Up to 512 extracodes (supervisor code in main store). OS: Titan Supervisor / Cambridge Multiple-Access System — public 22 Mar 1967. Storage: Two Data Products 16M-word discs; tape; card/punch. Terminals: Cambridge 64-line multiplexor — 73 registered, 26 simultaneous; modems from 1967.
>
> I've been able to gather together and shared all this information about it, thanks to an ongoing discussion with Heinz Lemke, the guy operating the lightpen in the video. He has recently unearthed 128 pages of PIXIE source code in PDP-7 assembly source and octal machine language, and we're scanning it in, and working on reincarnating it with SIMH and a virtual lightpen!

*(Verbatim from HN API, Aug 2026. Don's spellings: enourmous, chassie, ensembel, woth.)*

### mrob → Don (graphics need a mouse)

> You can get away with slower refresh rate if you're using keyboard input only, but keyboard input is annoyingly restrictive for many common tasks. Anything involving graphics (even just looking at graphics, e.g. zooming in on a graph) is much easier with a mouse.

### skydhash → mrob (pen beats mouse for tracing)

> Anything that involves manipulating a viewport is better with a joystick like device (spacemouse) and anything that involves tracing is better done with a pen. A mouse (and trackpad) is just a cheaper solution, not a better one.

### Don → skydhash (Buxton 1983 — later edited)

> The classic paper about this topic is:
> Buxton, W. (1983). Lexical and Pragmatic Considerations of Input Structures. Computer Graphics, 17 (1), 31-37.
>
> https://www.billbuxton.com/lexical.html

Don then edited [49408130](https://news.ycombinator.com/item?id=49408130) into a full closer:
a Buxton TLDR (lexical vs pragmatic, Figure 1, chunking), Miyamoto's design-from-the-hands
(Will Wright quote, [Master of Play](https://www.newyorker.com/magazine/2010/12/20/master-of-play))
and design-from-the-face (GDC 2007), pointers to
[his earlier post with all the keynote videos](https://news.ycombinator.com/item?id=27918255),
and **Heinz's draftsman-template origin story** for PIXIE's radial menus — pencil + symbol
template on a tilted drawing board, translated to light pen + radial menu. Heinz's full quote:
[`../heinz-lemke/sources/2026-08-23-draftsman-template-radial-menus.md`](../heinz-lemke/sources/2026-08-23-draftsman-template-radial-menus.md).

---

## The riff

Three answers to "quieter computing" sit in one thread:

| Voice | Prescription | Axis |
|-------|--------------|------|
| [Henry](https://henry.codes/writing/i-dream-of-quieter-computing/) | Smaller web, handmade sites, hackable hardware | **Culture** — less feed, more forest |
| [mrob](https://news.ycombinator.com/item?id=49406990) | 1000 Hz displays | **Frame rate** — kill strobe and sample-and-hold |
| **Don** | Slower phosphor | **Persistence** — let the beam leave a trail |

Henry and mrob are not wrong; they are optimizing different quietnesses. Henry wants less *social* noise. mrob wants less *temporal* quantization — the display as a strobe rather than a continuous field. Don's correction names a third variable mrob's frame-rate math leaves out: **afterglow**.

Modern LCD/OLED panels chase Hz because they have almost no persistence. Each frame is a snapshot; motion blur and phantom arrays are the price of holding a still image between refreshes. Old radar and scope tubes — and the [PDP-1](https://www.computerhistory.org/revolution/digital-logic/12/261) display at the [Computer History Museum](https://www.computerhistory.org/) — worked the other way: the **P7 phosphor** flashes blue-white on impact, then decays through yellow-green over hundreds of milliseconds. The image *integrates* in time. [Spacewar!](https://www.masswerk.at/spacewar/) ships and exhaust leave comet trails not because the game draws motion blur, but because the tube remembers.

That is the link Don pasted: [CuriousMarc — Lyle Bickley explains the PDP-1](https://www.youtube.com/watch?v=1EWQYAfuMYw) at **13:52** ([`?t=832`](https://youtu.be/1EWQYAfuMYw?t=832)), loading and playing the original [Steve Russell](https://en.wikipedia.org/wiki/Spacewar!) game. Lyle calls out the **P7** explicitly (~7:47 in the same video): short-timescale white flash, long-timescale yellow-green persistence — a radar tube repurposed as the first bitmap game monitor. The cone hoods on old radar scopes existed to make the afterglow readable; [Star Trek's](https://en.wikipedia.org/wiki/Star_Trek:_The_Original_Series) bridge displays were the same callback.

So "quieter" can mean: fewer frames fighting your eye (**mrob**), or fewer frames *needed* because the phosphor smooths between them (**Don**). Persistence is temporal low-pass filtering built into the display chemistry — the opposite of glass-and-Hz modernism. [Norbert Landsteiner's browser PDP-1](https://www.masswerk.at/spacewar/) and the [FPG-1 Verilog replica](https://github.com/hrvach/fpg1) still cheat with software trails; the real tube did it for free.

Don's second beat widens the argument: the problem is not just the display — it is **software and hardware bloat**. A [PDP-1](https://www.computerhistory.org/) with P7 phosphor did not need 1000 Hz; neither did a [PDP-7 with PIXIE radial menus](https://www.youtube.com/watch?v=jDrqR9XssJI) talking to [Titan](https://en.wikipedia.org/wiki/Titan_(1963_computer)) over a custom network ([`../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md`](../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md)). Slow machine, fast *interface* — pie menus as the gestural answer to cognitive load, not more Hz.

Don then **edited the comment on HN** into a full hardware inventory — PDP-7 geometry (18-bit, 8K, ~1.75 µs), Type 340/342/347/370 options, Wiseman link IOTs, Titan extracodes — and announced Heinz's **128-page listing recovery** + SIMH resurrection. Canonical repo sheet: [`../heinz-lemke/pixie-hardware.md`](../heinz-lemke/pixie-hardware.md). The edit ends with a direct challenge: *"I just showed you a video of a computer with a light pen. Did you see that?"*

The thread then forks on **input device**, not Hz:

| Voice | Claim | Don's implicit answer |
|-------|-------|----------------------|
| [mrob](https://news.ycombinator.com/item?id=49407984) | Low refresh OK for keyboard; graphics need a **mouse** | PIXIE used a **light pen** on a vector display — tracing without a mouse |
| [skydhash](https://news.ycombinator.com/item?id=49408091) | Viewport = spacemouse; tracing = **pen**; mouse is cheap | Agrees on pen for tracing; PIXIE + radial menus are the 1969 receipt |
| **Don** → [Buxton 1983](sources/buxton-1983-lexical-pragmatic-input-structures.md) | Device taxonomy — lexical ≠ pragmatic; locators are not interchangeable | Figure 1: light pen ≠ mouse ≠ tablet; formal backup for skydhash |

So "quieter computing" here is also **fewer wrong input abstractions** — not everything is a mouse problem. Buxton's **Figure 1** (1983) puts light pens and touch screens in a different pragmatic class than mice and tablets — the paper Don linked is the textbook answer to mrob's mouse default.

Thread neighbors worth the same quiet:

- [lproven](https://news.ycombinator.com/item?id=49407429) → [Ascetic Computing](https://ratfactor.com/ascetic-computing) — adjacent manifesto, different monastery
- [benrutter](https://news.ycombinator.com/item?id=49406210) → [What is the small web?](https://ar.al/2020/08/07/what-is-the-small-web/) — Henry's forest, named
- [walrus01](https://news.ycombinator.com/item?id=49407273) — serious talk moved to Signal; shitposting stays on the ruins

---

## Show hooks

| Beat | Guest / prop |
|------|----------------|
| Play Spacewar on the restored PDP-1 (or Landsteiner sim) while Henry's essay scrolls | [Lyle Bickley](https://www.youtube.com/watch?v=1EWQYAfuMYw) / CHM |
| P7 vs sample-and-hold — draw the triangle: persistence × refresh × cognitive load | Don + display historian |
| "Artisan internet" vs "artisan phosphor" — Henry's small web meets Don's radar tube | Calm-tech episode — [`connectedtv-touch-tuning-finger-pies.md`](connectedtv-touch-tuning-finger-pies.md) |
| mrob's 1000 Hz vs Don's slower phosphor — live demo with motion test patterns | Audience vote |
| mrob says mouse; skydhash says pen/spacemouse — **PIXIE light pen on air** | [`../heinz-lemke/pixie-hardware.md`](../heinz-lemke/pixie-hardware.md) + Lars SIMH |
| Don cites **Buxton 1983** — read Figure 1 device taxonomy on air | [`sources/buxton-1983-lexical-pragmatic-input-structures.md`](sources/buxton-1983-lexical-pragmatic-input-structures.md) |
| Don's HN hardware dump → listing OCR → virtual light pen | [`../heinz-lemke/sources/pixie-assembler-listing-1972/README.md`](../heinz-lemke/sources/pixie-assembler-listing-1972/README.md) |

---

## Repo context

| File | Why |
|------|-----|
| [`connectedtv-touch-tuning-finger-pies.md`](connectedtv-touch-tuning-finger-pies.md) | Calm technology in the dark — same "disappearing into the body" axis |
| [`../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md`](../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md) | Early interactive graphics lineage (PDP-7 PIXIE → pie menus) |
| [`../heinz-lemke/pixie-hardware.md`](../heinz-lemke/pixie-hardware.md) | Canonical iron inventory — source for Don's edited HN comment |
| [`../heinz-lemke/sources/pixie-assembler-listing-1972/README.md`](../heinz-lemke/sources/pixie-assembler-listing-1972/README.md) | 128-page listing recovery Don announced on HN |
| [`../heinz-lemke/pixie-source-recovery.md`](../heinz-lemke/pixie-source-recovery.md) | Heinz email + architecture correction |
| [`sources/buxton-1983-lexical-pragmatic-input-structures.md`](sources/buxton-1983-lexical-pragmatic-input-structures.md) | Don's HN cite — pen vs mouse vs tablet taxonomy |
| [`../heinz-lemke/sources/2008-bill-buxton-pixie-memory-lane.md`](../heinz-lemke/sources/2008-bill-buxton-pixie-memory-lane.md) | Buxton ↔ PIXIE correspondence arc |
| [`../lars-brinkhoff/ideas.md`](../lars-brinkhoff/ideas.md) | PDP restoration orbit — Landsteiner, CHM, FPGA Spacewar |
| [`hypercard-network-hyperlook-hn-2026.md`](hypercard-network-hyperlook-hn-2026.md) | Sibling HN archive — handmade microworlds vs feed troughs |
| [`../keith-lynch/README.md`](../keith-lynch/README.md) | 1977 ARPAnet entry on TI Silent 700 — same terminal class, thermal paper quiet |
| [`its-first-social-network-hn-2026.md`](its-first-social-network-hn-2026.md) | Sibling comment — ITS as artisan social network on same thread |

## External receipts

| What | URL |
|------|-----|
| HN story | https://news.ycombinator.com/item?id=49405682 |
| Don's comment (phosphor) | https://news.ycombinator.com/item?id=49407686 |
| mrob rebuttal | https://news.ycombinator.com/item?id=49407821 |
| Don's comment (slow computers + pie menus) | https://news.ycombinator.com/item?id=49407938 |
| mrob → Don (graphics need mouse) | https://news.ycombinator.com/item?id=49407984 |
| skydhash → mrob (pen/spacemouse) | https://news.ycombinator.com/item?id=49408091 |
| Don → skydhash (Buxton 1983) | https://news.ycombinator.com/item?id=49408130 |
| Buxton (1983) — full paper | https://www.billbuxton.com/lexical.html |
| Buxton paper (repo summary) | [`sources/buxton-1983-lexical-pragmatic-input-structures.md`](sources/buxton-1983-lexical-pragmatic-input-structures.md) |
| PIXIE hardware sheet (repo) | [`../heinz-lemke/pixie-hardware.md`](../heinz-lemke/pixie-hardware.md) |
| PIXIE / PDP-7 pie menus (Cambridge film) | https://www.youtube.com/watch?v=jDrqR9XssJI |
| Henry's essay | https://henry.codes/writing/i-dream-of-quieter-computing/ |
| CuriousMarc PDP-1 tour | https://www.youtube.com/watch?v=1EWQYAfuMYw |
| Phosphor moment (Spacewar load) | https://youtu.be/1EWQYAfuMYw?t=832 |
| P7 phosphor callout (~7:47) | https://youtu.be/1EWQYAfuMYw?t=467 |
| Browser Spacewar | https://www.masswerk.at/spacewar/ |
| Inside Spacewar! (Landsteiner) | https://masswerk.at/spacewar/inside/ |
| FPG-1 Verilog PDP-1 | https://github.com/hrvach/fpg1 |
| Computer History Museum | https://www.computerhistory.org/ |
| Steven Levy — *Hackers* (Spacewar chapter) | https://en.wikipedia.org/wiki/Hackers:_Heroes_of_the_Computer_Revolution |
