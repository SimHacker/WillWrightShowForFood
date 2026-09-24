# THERMO — parallel computation modeller

Title screen: **T H E R M O — Christopher Cherniak and Robert Winkler — COGSCI COURSEWARE — 1991.**

A "thermodynamic computation" simulator. A search particle random-walks over a
bird's-eye terrain looking for a global minimum; the student tunes the walk. It is
the syllabus's week on parallel computation, next to Kirkpatrick, Gelatt & Vecchi
on simulated annealing and Tank & Hopfield on neuronlike circuits, and Cherniak's
own argument for quick-but-dirty algorithms (*Minimal Rationality* ch. 4;
"Undebuggability", CACM 31:402–412), which the help cites.

Written in Microsoft C "under an IBM AEP grant by the University of Maryland
COGSCI COURSEWARE Project". `THERMO.EXE` and `THERMOM.EXE` (math coprocessor)
are both dated 21 May 1991; `readme.thm` is November 1999, with the note that on a
Pentium the particles run too fast unless the snail trail is set to 99.

## In this room

| Path | What |
|------|------|
| [`disk/readme.thm`](disk/readme.thm) | The only text file in the archive, byte-identical |
| [`MANIFEST.yml`](MANIFEST.yml) | All three files with size, DOS date, sha256; Wayback source URL |
| [`help-from-exe.md`](help-from-exe.md) | Every help screen, extracted from the executable |

The two executables are University of Maryland copyright and not committed.

## The exercise

| Menu | Terrain | What the student tunes | The help's answer |
|------|---------|------------------------|-------------------|
| Global Min Only | one basin | trajectory length (5 to the screen diagonal, 698 EGA / 744 VGA) | between the extremes; long beats short |
| Local & Global Min | basin plus 3–6 traps | + particle velocity ("temperature", 1–10) | 7–8; 1–6 get trapped, 9–10 too hot to be caught at all |
| Terraced Global Min | basin with a subminimum | + a 1–5 stage velocity schedule, 5–30 s each | "warm then cool", e.g. 8, 8, 6 |
| Maze Runner | random rectangles as walls | the same parameters | — |

A run aborts at 50,000 pixels. The results screen reports average distance on
success, percent successful, and their ratio. "Suppress display" writes results to
a file for batch statistics. The logon password `easy`, `medium` or `hard` decides
how much the help screens give away and which knobs the run screens expose.

## Rebuilding it

Everything a reimplementation needs is in the help: terrain types, parameter
ranges and defaults, the abort distance, the three statistics, and the expected
answers to check against. The terrains are random each run, so a rebuild can be
tested only statistically: velocity 7–8 should beat 5 and 10 on the trapped
terrain, and a warm-then-cool schedule should beat any single velocity on the
terraced one.
