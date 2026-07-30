# Roy Eagleson 🎓🖥️ *(educator · computer graphics history)*

*Portrayal of a real correspondent, written by Don — not Roy, and not his words. Roy may correct,
shape, reduce, or delete any of it.* [Portrayal standards](../../schemas/portrayal-standards.md) ·
on the PIXIE email thread, not a Repo Show bud · authored by Don Hopkins

## Who

**Roy Eagleson** — [Western University](https://www.uwo.ca/) (UWO) — teaches **computer science**
with a standing unit on the **history of computer graphics**. His HCI lectures normally anchor on
[**Ivan Sutherland's Sketchpad**](https://en.wikipedia.org/wiki/Sketchpad) (1963) — a **north star**
for this project alongside direct manipulation, constraints, and learn-by-doing mathematical software.

**Heinz U. Lemke** is Roy's friend. They discussed **PIXIE** at the **CARS 40th anniversary** in
Nagoya (July 2026). Heinz Cc'd Roy on the PIXIE Repo Show invitation thread; Roy asked to follow the
exchanges — MIT and Cambridge beginnings of computer graphics.

## Sketchpad → classroom → PIXIE

On **7 July 2026**, Roy was preparing that day's HCI lecture — *normally Sketchpad*, now **PIXIE**
— when Heinz's email arrived with the **complete PIXIE listing** offer and the architecture
correction. Roy was reading Don's [Buxton patent thread](../don-hopkins/sources/2008-2023-pixie-buxton-patent-thread.md)
when the messages landed. He asked whether to play [**Flight of the PIXIE**](https://www.youtube.com/watch?v=jDrqR9XssJI)
in class; Heinz sent the link an hour later.

Full lineage essay: [**Sketchpad to PIXIE — educators' bridge**](sketchpad-to-pixie-lineage.md)

## SIMH progress (28 July 2026)

Roy converted Don's extracted **`.oct`** listings to **`.rim`**, loaded PIXIE into
**SIMH**, and can **step** instruction-by-instruction. **`GO` still blanks** — next is
light-pen interrupts (X11 locally; web mouse for shareable).

→ [`sources/2026-07-28-simh-oct-to-rim-loaded.md`](sources/2026-07-28-simh-oct-to-rim-loaded.md) ·
[`../heinz-lemke/sources/pdp7-reference/EMULATION-PLAN.md`](../heinz-lemke/sources/pdp7-reference/EMULATION-PLAN.md)

## Background (as Roy tells it)

On **9 July 2026** Roy filled in his own backstory. In his telling: he worked as a
**midnight-shift computer operator** at his university Computing Centre from
**~1979 to the mid-1980s** — a **PDP-10**, a **PDP-11** driving an inkpen plotter,
and a **Cyber-73** — after first meeting computing on a high-school
**Honeywell GE-115**. (*"We love the musty smell of old lineprinter listings."*)

He began his PhD with cognitive scientist [**Zenon Pylyshyn**](https://en.wikipedia.org/wiki/Zenon_Pylyshyn),
whose own postdoc advisors, Roy notes, were [**Allen Newell**](https://en.wikipedia.org/wiki/Allen_Newell)
and [**John McCarthy**](https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist));
Pylyshyn directed the [**CIFAR**](https://en.wikipedia.org/wiki/Canadian_Institute_for_Advanced_Research)
AI-and-Robotics program that hired [**Geoffrey Hinton**](https://en.wikipedia.org/wiki/Geoffrey_Hinton),
was (with [**Jerry Fodor**](https://en.wikipedia.org/wiki/Jerry_Fodor)) a noted
critic of connectionism, and founded the Rutgers Cognitive Science program. Roy
says he has photos of Pylyshyn with Newell and McCarthy.

## How he teaches it — Sketchpad until they reinvent OOP

Roy's HCI course assigns students to **re-implement Sketchpad**. Doing so, they
rediscover the necessity of good **data structures** and end up **reinventing
object-oriented programming** from the bottom up — sometimes at assembly level.
It's the same wager this project makes: *run the old idea yourself and you'll
re-derive why it mattered.* His lectures carry the **Sutherland → Utah** genealogy
(Alan Kay, Jim Clark, Blinn, Phong, Gouraud, Fuchs, Catmull, Warnock).

## The storyline he's after

Roy has asked Heinz and Don to assemble the **Cambridge / TRE** storyline — the
named people behind PIXIE and Titan: **Maurice Wilkes, Neil Wiseman, John Hiles,
Cheney, Etherton**, the **Rainbow Project**, and the **PDP-7 vector display ↔
Titan** link. Heinz has begun answering with a memoir in installments, starting
from his **1967 origin story**. Roy also asked, half-joking, *"does Maurice Wilkes
have an avatar in the SIMs milieu?"* See the
[9 July thread](../heinz-lemke/sources/2026-07-09-pixie-storyline-thread.md).

## 10 July — Newman, Sproull, and the photo

On **10 July 2026** Roy read **Newman & Sproull** and found PIXIE buried at reference **520** as
an *"interesting idea"* with a **"movable menu"** — not credited as an early **radial / pie menu**
(cf. Don's Buxton ↔ Kurtenbach commentary). He discovered Heinz had **Buxton as CARS'09 keynote**,
noted **Ron Baecker** as a 1969 TX-2 contemporary, and called for a **~1968 PIXIE
re-implementation** (Thompson & Ritchie eating PDP-7 cycles with Unix/C, ha). He then recognized
**Heinz in a photo** he'd wondered about for years: *"Aha. It's you!"*

Full thread: [**10 July storyline**](../heinz-lemke/sources/2026-07-10-pixie-storyline-thread.md)

## 14 July — UWO students re-implement PIXIE

Roy confirmed **UWO students** want to re-implement **PIXIE** as an HCI exercise — same pedagogical
move as Sketchpad (rediscover data structures → OOP), now paired with his **hardware/software
co-design** course (design ISA + compiler from scratch). Asked Heinz for the PDP-7 assembly.

Heinz (15 Jul): **125 pages** to digitize; points students to thesis Appendix 4 + 1969 film first;
**CARS 2027 Berlin HCI session, 29 June 2027** as presentation target if they don't give up.

→ [`sources/2026-07-14-uwo-pixie-reimplementation.md`](sources/2026-07-14-uwo-pixie-reimplementation.md)

**Update (24–25 Jul):** the digitization landed and the student kit now exists — the full stack is
indexed in [Heinz's README, "For students, hackers, and turists"](../heinz-lemke/README.md):
the [turist guide](../heinz-lemke/sources/pdp7-reference/GUIDE.md) (PDP-7 / Type 340 / Titan
architecture), the [mirrored manual library](../heinz-lemke/sources/pdp7-reference/README.md),
the [recovered assembler source](../heinz-lemke/sources/pixie-assembler-listing-1972/README.md)
(clean `.asm` + octal), the
[PIXIE User Manual](../heinz-lemke/sources/phd-thesis-1972/annotated/07-appendix-4-pixie-user-manual.md)
from the [fully annotated thesis](../heinz-lemke/sources/phd-thesis-1972/annotated/README.md),
and the [emulation plan](../heinz-lemke/sources/pdp7-reference/EMULATION-PLAN.md) with the
[Titan link protocol decode](../heinz-lemke/sources/pdp7-reference/TITAN-LINK-PROTOCOL.md).

## Don welcomes Roy — 10 July 17:59

Don replied directly: **no Wilkes Sims avatar** — a [memorial room](../maurice-wilkes/memorial.md)
for willing contributions (stories, photos, lecture notes); Roy's Cambridge/TRE storyline request
is exactly what it's for. Opened [`roy-eagleson/`](.) and pointed to [`kelly-booth/`](../kelly-booth/).
Rant against reflexive **SUBMIT** buttons (Skinner-box UX; Alan Kay on mediocre defaults).
PDP-10 love; *The Americans* ARPANET scene going up unlisted for fair-use commentary; Worf
**DEC-10** pop quiz: [YouTube short](https://www.youtube.com/shorts/Xz-xq-d4jKk).

## Links

| | |
|---|---|
| **Heinz** (PIXIE co-author, friend) | [`../heinz-lemke/`](../heinz-lemke/) |
| **Email thread** | [`../heinz-lemke/sources/2026-07-07-pixie-trio-thread.md`](../heinz-lemke/sources/2026-07-07-pixie-trio-thread.md) |
| **Sutherland / Sketchpad** | [`../ivan-sutherland/`](../ivan-sutherland/) |
| **Kelly Booth** (his HCI mentor) | [`../kelly-booth/`](../kelly-booth/) |
| **14 Jul — UWO PIXIE project** | [`sources/2026-07-14-uwo-pixie-reimplementation.md`](sources/2026-07-14-uwo-pixie-reimplementation.md) |
| **Student kit** (guide, manuals, source, emulation plan) | [`../heinz-lemke/README.md`](../heinz-lemke/README.md) § For students, hackers, and turists |
| **16 Jul thread** (125 pages, CARS 2027, Armit archive) | [`../heinz-lemke/sources/2026-07-16-pixie-storyline-thread.md`](../heinz-lemke/sources/2026-07-16-pixie-storyline-thread.md) |
| **9 July storyline thread** | [`../heinz-lemke/sources/2026-07-09-pixie-storyline-thread.md`](../heinz-lemke/sources/2026-07-09-pixie-storyline-thread.md) |
| **Photo — Heinz at PDP-7** (Roy: *"Aha. It's you!"*) | [`../heinz-lemke/media/from-mail/roy-eagleson-identified-heinz-pdp7-light-pen.png`](../heinz-lemke/media/from-mail/roy-eagleson-identified-heinz-pdp7-light-pen.png) |
| **Wilkes memorial** (Don invited Roy's contributions) | [`../maurice-wilkes/memorial.md`](../maurice-wilkes/memorial.md) |
| **Show hooks** | [ideas.md](ideas.md) |
| **PIXIE show** | [`../../repo-shows/pixie-pie-menus-pdp7.yml`](../../repo-shows/pixie-pie-menus-pdp7.yml) |

[Correspondence digest](correspondence.yml) · [CHARACTER.yml](CHARACTER.yml)
