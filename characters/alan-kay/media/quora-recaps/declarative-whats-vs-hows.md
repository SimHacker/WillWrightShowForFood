# Declarative programming — whats, hows, Sketchpad, Nile, and TurboTax

*Guest hub:* [`../../README.md`](../../README.md) · *Recaps hub:* [`README.md`](README.md)

**Source:** Alan Kay's public **Quora** answer to *"What is declarative programming?"* — one of the longest
technical answers in the corpus (Sketchpad → DWIM → spreadsheets → Nile → Cyc procurement).

**Related:** [`oop-messaging-and-what-comes-next.md`](oop-messaging-and-what-comes-next.md) (relational
Sketchpad); [`steps-nile-runnable-math.md`](steps-nile-runnable-math.md); [`teitelman-dwim-programming-as-interaction.md`](teitelman-dwim-programming-as-interaction.md).

**Nature:** Summary with **short verbatim quotes**; verify against Quora. Credit: **Quora**. Governed by
[`portrayal-standards.md`](../../../../schemas/portrayal-standards.md).

---

## Hows vs. whats

Programming historically = **"how"** (tactics without blueprints). Declarative = **"what"** (plans/models)
with tactics referring back to strategy.

We start with vague whats, weak process to **vet the whats themselves** — working programs often aren't what
was desired. Perfect test suites *could* be declarative programs, but tests are incomplete and hard to turn
into running code automatically.

## Sketchpad — interactive declarative CAD+sim

Sutherland's Sketchpad (~1962): show the system **what you wanted** (pictures + **constraints** specifying
what must be true) → solver combines into instant solution → modify until desired artifact. First CAD tool +
integrated **simulation** to vet design. "Monumentally wonderful."

**Catch:** hard to guarantee every declarative statement has a solution worth using (like math with unreachable
truths). Knuth's **TeX** designed constraint language so most reasonable expressions were **within reach** of
the solver.

## Middle grounds

- **FORTRAN** — declarative arithmetic in a how-heavy language
- **SQL** — sort-of-declarative sets
- **Spreadsheets** — "pretty declarative"; surprising power at scale
- **Pure Lisp / Prolog** — declarative reading possible but programs carefully planned for execution

## Runnable meanings — Nile and STEPS

Under-explored ~25 years: **"runnable meanings" / "runnable math in the large"** — nail down semantics (whats)
with complete separation from optimizations (hows). Unit tests don't capture this unless a running system can
be **synthesized** from them.

**Dan Amelang's Nile** — modern runnable math; all 2–2.5D personal-computing rendering in **<500 lines**
(vs. 50K–100K lines C++ in STEPS). Turn off optimizations → slower/more storage, still correct.

**CAD↔SIM↔FAB** cycles: meanings as running models; fabrication as parallel organization of methods/heuristics.

## TurboTax programming — ask questions, synthesize

Don't require god-like programmers: ask questions in understandable formats, synthesize programs. Example:
**CYCorp for Marines** — auto-write enormous procurement documents; normalized 20 legacy databases so
"employee" etc. align.

## Michael Jackson / problem-oriented languages

POLs (60s) — any extensible language can become one. Smalltalk-80 + **Squeak/OMeta** (Alex Warth) + late
binding + live turtles → wide POL range for **STEPS**. Requirements qualitatively better = dominant need in
SE today (Kay agrees with Jackson's direction but wants **runnable** design philosophy, not schemes that can't
be implemented).

## Questions for Alan (show fodder)

- Is **Nile-style runnable math** the path to glass-box Micropolis/SimCity models?
- **TurboTax programming** for end-users — HyperCard missed this; Snap! has it?
- Declarative solvers that **can't explain failure** — still the blocker for Sketchpad-style everywhere?
- Would you sign a modern **Harmony-oriented architecture** thesis if it shipped runnable code?
