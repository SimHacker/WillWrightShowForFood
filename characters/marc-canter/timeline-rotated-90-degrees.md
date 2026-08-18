# The timeline rotated 90° — Director's score, PSIBER, and the repo as cast

*Don's firsthand recollection of a remark by Marc Canter; not a quote transcript. Stewart Sharp
described from Don's memory of the scene.*
[Portrayal standards](../../schemas/portrayal-standards.md)

## The anecdote

Don and Marc were looking at a performance **Stewart Sharp** — one of the best old-school Director
artists/programmers — had just dropped on Marc: the piece itself, and under it the **cast**, the
**timeline**, and the **scripts** that made it go. Marc, self-effacingly, explained the trick of his
own invention:

> **A Director timeline is just a BASIC program with line numbers, rotated 90° clockwise.**

Line numbers become **frames**. Statements become **sprite channels**. `GOTO` becomes the playback
head jumping the score. The revolutionary multimedia authoring tool was — proudly, usefully — an
old idea turned sideways so artists could see time as space and **direct** it.

Don got it instantly, because he'd done the same rotation in another axis: **[PSIBER](../don-hopkins/visual-programming-excel-and-dimensionality.md)**
(*[The Shape of PSIBER Space](https://medium.com/@donhopkins/the-shape-of-psiber-space-october-1989-6bcdf7a3a1f5)*, 1989)
— a visual programming and debugging environment **written in the same PostScript it rendered,
explored, and edited**. The representation and the runtime were one substance. You didn't inspect
the program from outside; you walked around inside its live heap.

## Why this is in the show repo

Two rotations, one lesson: **a new medium is often an old program turned so you can inhabit it.**

| | Program | Rotated into | You become |
|--|---------|-------------|------------|
| **Director** | BASIC with line numbers | Score: frames × sprite channels | A director, not a coder |
| **PSIBER** | PostScript source | Navigable data landscape | An explorer inside the heap |
| **Repo Show** | A repo of YAML + markdown | A running simulation | A resident, not a reader |

The Repo Show's [deep move](../../process/vision-and-ambition.md#the-deep-move)
(`repo-as-simulation`) is the same rotation applied to GitHub. The **repo structure itself is the
simulation**: [`characters/`](../README.md) is the **cast window** — each performer defined by a
`CHARACTER.yml` and `CARD.yml` the way Director cast members carried their media and Lingo behaviors.
Git history is the **score**. Session logs are the playback. [MOOLLM](https://github.com/SimHacker/moollm)
is the Lingo runtime — and, like PSIBER, it is written in the same substance it simulates: the world
is YAML and markdown, and the characters can read the files that constitute them.

The lineage runs **MacroMind Director → Shockwave → Flash → Dynamic HTML** — each stage moving the
authored performance closer to the open substrate, until the browser itself was the player. The Repo
Show continues the walk: the **repo** is the player now, and the performance is version-controlled,
forkable, and inhabited.

Two more turns of the same rotation, from the same circle: [**Paul Haeberli's ConMan**](../paul-haeberli/README.md)
(SIGGRAPH 1988) connected live dataflow components on an IRIS — his abstract promised *"a dynamic
live performance that is orchestrated by the user."* And [**Jared Tarbell**](../jared-tarbell/README.md)
took Flash's cast/timeline/scripts and let **the script conjure the cast** — levitated.net's
performances weren't arranged on the timeline, they were *grown* by code. Jared is the artist who
opened Don's eyes to dynamically orchestrating the stage with scripts — the direct ancestor of this
repo's characters directing themselves.

## Show segment this wants to be

Marc on air, retelling the rotation joke himself — then Don rotates it once more, live: open
`characters/` as a cast window, open a session log as a score, and let a cast member
([Palm](../palm/README.md)) speak from inside the running piece. Director's cast/score/script
vocabulary maps one-to-one onto the repo on screen; Stewart Sharp's drop gets its salute.

*See also:* [`README.md`](README.md) · [`ideas.md`](ideas.md) ·
[visual programming patch-cord trail](../../process/trails/visual-programming-patch-cord.md) ·
[`moollm-stage.yml`](../../process/moollm-stage.md) ·
[David Levitt — Bounce/MMP lineage](../david-levitt/README.md)
