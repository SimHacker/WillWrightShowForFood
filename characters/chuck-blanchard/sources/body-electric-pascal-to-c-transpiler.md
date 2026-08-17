# Body Electric's Pascal-to-C translation — faking lexical scope with struct pointers

*Don's recollection (Aug 2026), plus candidate research. Open question
for Chuck: which translator was it?*

## The story

Body Electric was written in Pascal. When it was translated to C on an
HP workstation, the transpiler had to fake Pascal's nested-procedure
lexical scoping, which C doesn't have. Its trick: collect the parent
function's locals into a **struct definition**, allocate it on the
parent's stack, and pass the struct's address down into every nested
function as an **injected extra parameter** — rewriting the signatures
all the way down the nesting.

That trick has textbook names: the struct is a source-level **static
link** (the environment half of **closure conversion**), and hoisting
free variables into explicit parameters is **lambda lifting**. Pascal
compilers do this invisibly in the frame layout; a Pascal-to-C
translator has to do it *in the visible source*, which is why the
output C reads like a compiler's stack discipline written out longhand.

## Prime candidate: p2c (Dave Gillespie, Caltech)

**p2c** is almost certainly the one — the evidence stacks up:

- **It's the famous one.** Posted to comp.sources.unix Volume 21, March
  1990 (earlier versions circulated from Caltech before that); the
  [comp.lang.c FAQ](https://tuhs.superglobalmegacorp.com/Unix_Usenet/comp.lang.c/1990-October/018808.html)'s
  first answer for "convert Pascal to C."
- **It does exactly the described transform.** Gillespie explained it
  himself on Usenet in
  [March 1990](https://www.tuhs.org/Usenet/comp.lang.c/1990-March/032197.html):
  parent locals used by sub-procedures are collected into
  `struct LOC_<name>`; each sub-procedure gains a `LINK` pointer
  parameter; grandparent access chains through `LINK->LINK->v1`
  (a "display" optimization was considered and skipped — "few real
  programs need it").
- **The HP fingerprint.** HP Pascal was p2c's native reference dialect.
  The [man page](https://github.com/FranklinChen/p2c/blob/master/src/p2c.man)'s
  `StaticLinks` option exists specifically because *HP Pascal procedure
  pointers can point to nested procedures*, so p2c models them as a
  struct of {C function pointer, static link to parent locals} — "the
  HP format." A Pascal codebase being translated *on an HP workstation*
  is squarely in p2c's home territory.

Sketch of the transform, from Gillespie's own post:

```c
struct LOC_p1 { int v1; };
struct LOC_p2 { struct LOC_p1 *LINK; int v2; };

void p3(struct LOC_p2 *LINK) {
    printf("%d %d\n", LINK->LINK->v1, LINK->v2);  /* grandparent, parent */
}
void p2(struct LOC_p1 *LINK) {
    struct LOC_p2 V;
    V.LINK = LINK;
    p3(&V);
}
```

## Runner-up and alternatives

- **ptoc** — the other well-known free translator, earlier
  (comp.sources.unix Volume 10, 1987; patches in Volume 13), itself
  written in Pascal. If the translation predates ~1989, this is the
  likelier candidate.
- **Commercial translators** existed (the FAQ lists vendors like Cobalt
  Blue and Promula, though their flagship products were Fortran-to-C);
  a paid tool is possible but the free ones were what everyone actually
  used.
- **Hand-rolled or vendor tooling** — possible, but the described
  output (systematic struct-per-scope with injected pointer parameters)
  matches p2c's signature style too well to ignore.

**ASK Chuck:** which was it — p2c, ptoc, something commercial, or
in-house? And which HP workstation (HP 9000 series 300/800, HP-UX)?
Timing matters: p2c widely available 1989–90, ptoc from 1987.

## Kin: Gosling's Ace, the same era

The same late-80s move from the other direction:
[Ace](../../james-gosling/sources/ace-syntax-driven-preprocessor.md)
(Gosling, Sun, 1989) rewrote C *syntax trees* under programmer-declared
annotations — `$tradeoff`, `$P` probabilities, `$trips` loop counts —
to specialize the NeWS/Shapes rendering inner loops for space/time by
frequency of use. p2c and Ace bracket the era's theme: **the emitted C
was the IR** — one transpiler injecting scope structure Pascal had and
C lacked, the other injecting specialization knowledge the compiler
couldn't infer.

## Why it belongs in the show

The transform is a compiler internals lesson performed in public:
closures are just structs plus discipline, lexical scope is an argument
you didn't know you were passing, and a VPL about wiring dataflow
patches was itself rewired one signature at a time. Pairs with the
[dev-system thread](2020-02-17-body-electric-dev-system.md) (Chuck's
OS 9 + CodeWarrior reference box — meaning the C translation lived
alongside a surviving Pascal/Mac line worth mapping) and the
[patch-cords show](../../../repo-shows/patch-cords/patch-cords.yml).

↑ [character](../README.md)
