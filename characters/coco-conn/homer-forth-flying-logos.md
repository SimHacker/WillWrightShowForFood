# HOMER & Assoc — Forth, Charles Moore, and Flying Logos

*Invitation portrayal — grounded in Coco Conn and Paul Rother's public HN account (Don reposted with
Coco's permission), Paul Rother's history page, and Don's SIGGRAPH anecdotes. Not Coco's words
unless quoted and sourced.*
[Portrayal standards](../../schemas/portrayal-standards.md) · consent level 2 · authored by Don Hopkins

## Who & where

**Peter Conn** and **Coco Conn** ran **HOMER & Assoc.** at **Sunset Gower Studios** from **1977 until
1997** — music videos, commercials, and computer graphics / special effects for feature films. One
public note from Coco: they worked with **Paul Verhoeven** on **RoboCop** (1986) and the **x-ray scene**
in **Total Recall** (1989).

**HOMER** stood for **Hybrid Optical Montage Electronically Reproduced** — a **real-time visual mixing
console** their in-house engineer spent **1978–1981** designing and building from scratch. Coco helped
**solder LEDs** and **run cables**. Peter built his own **optical printer**. When the engineer finished
the console and moved to England, they still had no software — until **Paul Rother** joined.

## Homer II — performance UI you play with your hands

Paul Rother's public description (1982):

| Piece | Detail |
|-------|--------|
| **Inputs** | **16 slide projectors**, **4 movie projectors**, **4-track** tape |
| **Channels** | **24 visual channels**, each with its own **Z80** |
| **Master** | **Z80** on **S100 bus** |
| **Controls** | Touch-sensitive **slider pads** (no dials — Coco recalls **Allison?** faders); **"joy stick bumper"** like a **1964 Mustang** gear shift — bump to the **next line of code** (fade, cut, dissolve…) |
| **Workflow** | Program or **perform** a sequence; **record** it; **overdub** corrections like an audio mixer; **hero take** → **8" floppy** + slide trays → **optical printer** → **IP film** (**10–15 passes** per composite was normal) → video edit |

Coco's account: you could **crossfade** by programming **or by performing**. Everything was
**recorded** and played back on the next round. **Peter** would do countless passes until perfect.
**Rube Goldberg** is too weak a word — but it **worked**.

## Forth & Charles Moore

When they needed software for Homer II, they **hired Forth, Inc.** and got **Charles Moore** — inventor
of **Forth** — to program the **console host computer**.

From Coco and Paul's public write-up:

- **Paul Rother** learned **Forth** working with **Charles Moore**; programmed **2K byte EPROM** in
  each visual channel.
- **Master Z80**: **PolyForth** multitasking in **32K bytes** (+ **16K RAM** for buffers); ~**four
  tasks** (Paul's memory, ~20 years later).
- Coco: she learned **Forth** from Charles too — **factoring** into small reusable **WORD**s,
  **vectors**, **OOP without knowing it** — *"they never taught me in computer programming school."*

Don did **not** work with Charles Moore (that was Coco's shop); Don **did** work with **Mitch Bradley**
at Sun on **Open Firmware** Forth — a parallel thread on the same HN discussions.

## CAT-700 — paint system in 32K

After Homer II could record to the optical printer, Peter wanted **video assist** for the printer —
**prior frame vs. current frame**. They found a **CAT-700** (**7-bit** S100 frame buffer; the **8th bit
never worked**) via a recycler in **Truckee**, met the French designer in **Palo Alto** (hand-routed
traces *"like a Van Gogh painting"*), and Paul got it running in **Forth**.

In that **32K**: **optical-printer control**, **paint system**, **OS**, **compiler**, **debugger**.
**Summagraphics Bitpad** for drawing on digitized frames; **two optical printers** (digitize vs.
record); **filter wheels** on **stepper motors** — *"it made music."*

First uses Coco remembered publicly: **Steve Miller — *Abracadabra***, **George Clinton — *Atomic Dog***.

## Music videos & film (public links)

| Work | Link |
|------|------|
| **George Clinton — Atomic Dog** | https://www.youtube.com/watch?v=LMVZ36VA0wg |
| **Steve Miller — Abracadabra** | https://www.youtube.com/watch?v=tY8B0uQpwZs |
| **Steve Miller — Bongo Bongo** | https://www.youtube.com/watch?v=_NrsRZdMI-A |
| **Flying Logos** (SIGGRAPH 1989 Electronic Theater) | https://www.youtube.com/watch?v=9hIOfEiy4lc |

## Flying Logos — sneaking the demo reel into SIGGRAPH

**1989 SIGGRAPH Electronic Theater** — *Flying Logos* got a **rave response** and **Niccograph of Japan**
that year.

**Coco (public HN):** The year before, the committee decided **demos weren't the way to go**. **Peter
Conn** wrote *Flying Logos* to **sneak their demo reel into the film show** by turning it into a
**story** — a client calls **Flying Logos, Inc.** to visualize a logo; technical vs. anticipated,
imagination vs. possibility. It worked.

Landmark claim in the thread: debut of the **PC as a broadcast-quality production system** — work that
had been **million-dollar workstation** territory.

**Don (public HN):** *"I truly believe that in some other alternate dimension, there is a **Flying Logo
Heaven** where the souls of dead flying logos go… Somewhere the **Sun Logo** and the **SGI Logo** are
still dancing together."*

## Don ↔ Coco (firsthand, separate eras)

| When | What |
|------|------|
| **1980s HOMER era** | Don indexed Coco & Paul's **Forth/HOMER** story on HN (with permission); **Flying Logos** lore |
| **SIGGRAPH SIGKids** | Don met Coco again in her **SIGKids** area — kids who couldn't walk the main floor got to **make and see** cool things. **Serendipity:** Don ran into **[David Levitt](../david-levitt/)** demoing **Bounce**'s animated band → lifelong collaboration. Don's words: Coco is **"royalty and a goddess."** |
| **Later** | **CitySpace** — collaborative virtual worlds for kids (stub — details to confirm with Coco) |

Same performance-UI family as Don's **[Dave Tristram](../dave-tristram/)** orbit (**Panel Library**,
**Electropaint**, **Raster Masters**) and Don's **NeWS** / **PSIBER** live-programming work — **hands on
the console**, code behind the glass.

## Repo Show hooks

- **Hire Charles Moore to write your animation system** — the procurement story, PolyForth in **32K**,
  **24 Z80s** each with **2K EPROM**.
- **Perform the crossfade** — Homer II as **MIDI-less** ancestor of live generative mixing; joystick
  **bumps** through the **score**.
- **HOMER → Faceball** — the performed-mix verbs (perform, record, overdub, hero take) reborn in the
  **[Faceball Construction Kit](../../apps/performance-space/faceball-construction-set.yml)** — the
  analog grandparent slot in its lineage table; via **Bounce** (David Levitt + Don at Interval) and
  **SimFaux** (2006).
- **Flying Logos → forkable repo** — corporate logo cinema as **open performance**; Don's **Flying Logo
  Heaven** as WebGPU screensaver?
- **Forth vs Lisp vs PostScript** — Don's HN threads; **Mitch Bradley** Open Firmware vs **Charles
  Moore** at HOMER; **[CAM6 Forth](../don-hopkins/cam6-cellular-automata-machine.md)** in the same
  lineage.
- **SIGKids** — where kids touched the future; **David Levitt** / **Bounce** origin story with Don.

## Sources (complete records in Paul's room)

Do not depend on leftbrain.us or the old Stanford blog — both **404** as of
26 Aug 2026. Readable copies:

- [Paul's 1982 memoir](../paul-rother/sources/homer-and-associates-1982.md)
- [Coco's 2021 Facebook post](../paul-rother/sources/2021-10-20-facebook-homer.md)
- [Flying Logos transcript](../paul-rother/sources/1989-flying-logos.md)
- [Stanford Peter Conn papers M2262](../paul-rother/sources/2019-05-17-stanford-peter-conn-papers.md)
- [HN 18 Nov 2021 as posted](../paul-rother/sources/2021-11-18-hn-homer-forth.md)

Live catalog: [archives.stanford.edu/catalog/m2262](https://archives.stanford.edu/catalog/m2262)
· [finding aid in this repo](../paul-rother/sources/stanford-m2262/GUIDE.md)
· [OAC](https://oac.cdlib.org/findaid/ark:/13030/c8n303pn/)

Peter's site (credits): https://www.milesconsulting.org/service.html

Don ↔ David: [`../david-levitt/don-and-david-history.md`](../david-levitt/don-and-david-history.md)
