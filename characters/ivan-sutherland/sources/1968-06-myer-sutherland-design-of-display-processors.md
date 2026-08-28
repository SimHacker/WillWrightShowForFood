# On the Design of Display Processors (1968)

T. H. Myer (BBN) and I. E. Sutherland (Harvard; also BBN).
*Communications of the ACM* **11**(6), June 1968, pp. 410–414.
CR: 2.44, 6.22, 6.29, 6.35. ARPA Order 627.

PDF (Stanford CVA course copy — the URL carapace posted):
http://cva.stanford.edu/classes/cs99s/papers/myer-sutherland-design-of-display-processors.pdf

Arizona course mirror:
https://www2.cs.arizona.edu/~cscheid/reading/myer-sutherland-design-of-display-processors.pdf

ACM DL: https://dl.acm.org/doi/10.1145/363347.363368

Wikipedia: [Wheel of reincarnation (computing)](https://en.wikipedia.org/wiki/Wheel_of_reincarnation_(computing))

This is the paper. Do not dump it here. The OCR that sometimes travels with it
prepends a *different* CACM article (half-duplex ACK / alternation bits). That
other paper ends; this one starts at the title above.

They were specifying a research display for an SDS-940. Analog generators were
fine. No commercial *control* repertoire was. They designed the processor
themselves, added features until it was a computer, felt compelled to hang a
second processor off *that*, and named the cycle the **wheel of reincarnation**.

---

## The wheel

Start: a point plotter tied to the parent CPU. Each added “just a little more
money” feature — channel, halt, jump, subroutines, stack, conditionals,
addressable load/store, interrupt — turns the channel into a computer. Then
its idle refresh loop looks wasteful, so you add a *channel to the display
processor*, and the second lap begins.

They name landmarks:

| Position | Machine | What it is |
|----------|---------|------------|
| Start | MIT TX-0 (~1957); **PDP-1 + DEC Type 30** (~1960) | No processor. Load AC with *x*, IO with *y*, execute a display command, flash a point. Parent CPU tied up; concurrent compute flickers. |
| Half turn (“cardinal point”) | **DEC 340–347** | Jump + subroutine jump + store-exit. “Still thought to be a display channel.” Admit *x*/*y* are an accumulator and the display address is a PC. |
| ~1.25 turns | IDIIOM | Past one revolution |
| ~1.5 turns | **DEC 338** | Hardware pushdown stack (they thought the first domestic commercial; also NCR-ELLIOT 4100). |
| Exactly once around | *none they knew* | Small general-purpose computer with an integrated display and **one** program counter. Open design problem. |

Command set they list at the cardinal point:

- Load Immediate and Flash (point)
- Add Immediate and Flash (line)
- Halt, Jump, Subroutine Jump, Store Subroutine Exit

Store-exit writes a jump into shared memory at the end of the subroutine. That
mutates the display file the parent is using, and it makes light-pen hit
traceback through nested subpictures painful. The next increment is a
pushdown stack. PIXIE never took that increment.

Escape hatch they credit to **Daniel Bobrow**: the display processor should
*not* grow general compute. No addressable store. Stack items return only to
the register they came from. Job 4 — compile pictures from high-level user
data (rotation, scaling, curves) — belongs to the **central** computer. That
is how they got off the wheel.

Four jobs they enumerate for a display processor: (1) generate pictures from
an internal representation, including subroutine calls; (2) generate some
elements by procedure (tracking cross, rasters); (3) immediate interactive
feedback; (4) compile secondary display files from abstract structures. They
want (1) by executing display commands *embedded* in the structure, not by
interpreting it with a general CPU. (4) is not the display’s job.

Coupling: if the display can sit next to the parent, **share core**. Shipping
a display file to remote memory costs two cycles per word and blocks
experiments that merge picture data with program data. Time-sharing fights
that (memory contention, a display that can smash supervisor state). They
still prefer share-core and solving those problems. Remote memory is justified
when **bandwidth forces it**.

---

## Where PIXIE sits

Cambridge’s interactive front end is exactly the landmark they call the
cardinal point: **PDP-7 + Type 340**, with **347** (`DJS`/`DJP`) inferred from
the listing. Tube lineage is the paper’s starting machine: **Type 30E →
16ADP7A**, same P7 phosphor, ~50 µs/dot on a Type 30 vs ~1.5 µs incremental
vectors on a 340. Hardware sheet:
[`../../heinz-lemke/pixie-hardware.md`](../../heinz-lemke/pixie-hardware.md).
Turist guide:
[`../../heinz-lemke/sources/pdp7-reference/GUIDE.md`](../../heinz-lemke/sources/pdp7-reference/GUIDE.md).

Thesis §5.4.3: **no hardware subroutine stack** — software uses DJS/DJP.
That is store-exit era, not DEC-338 stack era. Subpictures are display
subroutines in a DMA file the 340 fetches from PDP-7 core (cycle steal). Two
program counters, shared memory: parent CPU + display processor. Myer &
Sutherland’s multiprocessor warning is the machine Heinz is sitting at.

They did not reincarnate the *340*. They put general compute elsewhere:

| Box | Wheel role |
|-----|------------|
| **Type 340 + 347** | Half-turn display processor. Refresh, vectors, subpictures. Not a general CPU. |
| **PDP-7** | Parent for the display: shares core, runs ~5000 words of satellite PIXIE, light pen, radial lightbuttons, graph model. |
| **Titan** (Atlas 2 prototype) | Remote host across the Wiseman/Lang link. Job 4: analysis, file store, RAINBOW. Bandwidth *did* force a tenuous connection — the case the paper says justifies local power. |

So: share-core at the console (340 ↔ PDP-7), remote at the building (Titan).
Closer to “more than one turn” in the *three-box* sense than to their
preferred “one parent, one display processor, same core, stop.” Graphic II
(Bell, PDP-9 + channel; structure followed in software while the channel
draws) is the cousin they describe for remote interactive boxes. PIXIE’s
cousin is that pattern with Titan as the far computer and the 340 left at
half-turn.

Don already named this from the hardware sheet, without a URL, in
[49407938](https://news.ycombinator.com/item?id=49407938)
(23 Aug 2026, *I Dream of Quieter Computing*):

> The 340 executes its own instruction set in memory (display file = program). PIXIE’s subpictures are literally display subroutines — Myer & Sutherland’s "wheel of reincarnation".

As-posted block:
[`../../don-hopkins/sources/2020-03-17-youtube-jDrqR9XssJI-flight-of-the-pixie/README.md`](../../don-hopkins/sources/2020-03-17-youtube-jDrqR9XssJI-flight-of-the-pixie/README.md).

---

## Later turns (not PIXIE, same wheel)

NeWS is a later lap: the display server grew a language (PostScript). The
thread that still cites this paper for that reason:

[Sun's NeWS was a mistake, as are all toolkit-in-server windowing systems (2013)](https://news.ycombinator.com/item?id=22455722)

carapace, 1 Mar 2020, [22458264](https://news.ycombinator.com/item?id=22458264),
as posted (wheel cite only; the rest of the comment is Joy/Prolog GUI options
and “Whither React?”):

```
Reminds me of the classic "Wheel of Reincarnation" paper: "On the Design of Display Processors" http://cva.stanford.edu/classes/cs99s/papers/myer-sutherland...
(Good work getting traction on this kick! ;-)
```

Browser-as-smart-display-processor is the 2020 restatement: HTML/CSS as the
display language, application logic kept off the wheel. Same question the
paper left open in 1968.

GPUs executing command buffers (still called display lists in the lineage)
are many revolutions later. IBM System/360 Channel Command Words are the
same idea at datacenter scale, contemporary with the 340 — already noted in
the GUIDE.

Sketchpad (1963) is the application north star in this room. This paper is
the *processor* paper, five years on, written while specifying hardware.
PIXIE (1969) is the Cambridge machine that occupies the 340–347 cell they
drew.

↑ [Sutherland room](../README.md) · [Sketchpad → PIXIE](../sketchpad-and-descendants.md) · [Heinz — Type 340](../../heinz-lemke/pixie-hardware.md)
