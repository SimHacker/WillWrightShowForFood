# Kees van Prooijen — show ideas

## Spore reunion beats

- The prototyping trio + Will: what the creature editor was before it
  was a product.
- Evolving nervous systems for locomotion — GA fitness as gait
  efficiency, prototyped in IL. Show the lineage to Karl Sims's
  evolved creatures and to Crutchfield's evolving CA.
- L-system body plans with linear genetic code — genotype/phenotype in
  a shipping toy.
- The any-number-of-legs walk: GDC 2005 demo → SIGGRAPH 2008
  "Real-time motion retargeting to highly varied user-created
  morphologies."
- Chaim × Kees: editor design meets editor engineering.

## Language design beats (the [Korz′ thread](../david-ungar/korz/README.md))

- Intercol → IL: what the shading language taught him about language
  design ("the lessons learned... were fully exploited as a new
  paradigm").
- IL is "based on intensional logic" — context-relative evaluation as
  the working core of an art tool. Put that next to Korz's subjective
  dispatch and Self's slots and let the designers argue.
- "I make my art by programming in my own computer language" — the
  scripting birthright taken to its logical extreme: build the whole
  language, keep it private, print 1/1.
- IL today: mesh growth by strictly local vertex ops (CA adjacent!),
  geometric algebra multivectors, autodiff, sound synthesis.

## Music and theory beats

- Bohlen–Pierce, independently, 1978, via continued fractions — and
  his graceful cession of the name. The Kees height as consolation
  crown.
- 13 tones in the tritave: play it live; compare notation systems.
- Sonology under Koenig; De Onbesuysde Steenhoop on PDP-15 assembly
  (1977) — pair with the workspace's simh/PDP archaeology thread.
- The Odd Golden Section: Tribonacci constant as aspect ratio —
  math-as-composition segment.

## PDP archaeology — PIXIE, AM radio, and Kees's machine

Kees composed **De Onbesuysde Steenhoop** (1977) in **PDP-15 assembly** —
real-time direct synthesis on a DEC-PDP-15 at the Institute for Sonology.
That's the *next* machine in the same 18-bit line as the PDP-7 this
workspace restores.

| | **PDP-7** | **PDP-15** |
|---|-----------|------------|
| Era | 1964 (transistor flip-chips) | 1970 (TTL integrated circuits) |
| Lineage | PDP-1 → 4 → **7** → 9 → **15** | Last of DEC's 18-bit machines |
| Word | 18 bits | 18 bits (same family) |
| Claim to fame here | Unix v0; **PIXIE** pie menus + Type 340 vector display (Cambridge, 1969) | Kees's 1977 synthesis; RSX-15 (ancestor of RSX-11); MUMPS also ran here |
| In SIMH | `pdp7-unix` + PDP18B simulator | Same **PDP18B** codebase — one simulator, multiple models |

**How alike?** Same architectural *species*: 18-bit words, same DEC
lineage, assembly idioms in the same family. Not the same box — the
PDP-15 is essentially a miniaturized, TTL **PDP-9** with more memory
(up to 128K words), optional hardware FP, X-Y vector display, and
real OSes (RSX-15, XVM/RSX). But a Sonology hacker who lived in
PDP-15 assembly would *recognize* a PDP-7 immediately — same word
size, same interrupt folklore, same habit of making the machine sing
if you know which bits to toggle.

**PIXIE restoration** — Don's
[pdp7-unix](https://github.com/DoctorWkt/pdp7-unix) resurrection,
[Flight of the PIXIE](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/don-hopkins/sources/2020-03-don-jwz-pdp7-munching-squares-pixie)
film, first pie menus on PDP-7 + Type 340 at Cambridge (Wiseman, Lemke,
Hiles, 1969). Kees is a natural guest: language designer, Sonology
alum, someone who made a PDP-15 *make sound* before sound was a
product category.

**AM Radio Simulator — listen to the simulator think.** Don's 2020
email to jwz:
[munching squares on AM radio](https://www.youtube.com/watch?v=V4oRHv-Svwc)
— the PDP-7 program whose RF leakage sounds glorious on a transistor
radio; "That's where Hypnotoad gets his power." The show beat: an
**AM Radio Simulator** that demodulates a running SIMH instance's
electrical ghost — listen to munching squares, listen to Kees's
synthesis loop, listen to PIXIE's vector display sweep. Two generations
of 18-bit machines, one ear. Sonic archaeology, not nostalgia.

Cross-links:
- [Don ↔ jwz PDP-7 munching squares](../don-hopkins/sources/2020-03-don-jwz-pdp7-munching-squares-pixie/)
- [SimRadio / MOODY](../don-hopkins/simradio-radio-on-internet.md) — different
  thread (1999 internet radio for Sims), but the *radio as meaning
  channel* rhyme is real
- SIMH `PDP18B/` — covers PDP-7 and PDP-15 in one tree


- **Filter Farm live**: evolve Photoshop filters on air, audience as
  fitness function.
- **IL render on air**: read("rtest") — first image in front of the
  audience.
- Gallery walk: Function series (Berg's Lyric Suite) and the
  PKD-remixed Enigma Variations titles.
