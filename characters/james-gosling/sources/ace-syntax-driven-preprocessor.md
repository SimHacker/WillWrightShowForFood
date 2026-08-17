# Ace: Gosling's syntax-driven C preprocessor (1989)

**Paper:** James Gosling, *Ace: a syntax-driven C preprocessor*, Sun
Microsystems, July 1989 — [local PDF](gosling89ace.pdf), mirrored by
Russ Cox at [swtch.com/gosling89ace.pdf](https://swtch.com/gosling89ace.pdf).

Unlike cpp, which rewrites *characters*, Ace rewrites **syntax trees**:
`$replace pattern $with replacement` rules pattern-match against the
program's parse tree, with meta variables (`$0`, `$1`), side-effect-free
matchers (`$f0`), scoped rule sets (`$LET`), and prefix statements
(`$defprefix`) that turn annotations into control structure. Gosling
builds DeMorgan's laws, constant folding, and an `$assume` facility out
of about a dozen rules, then stacks `$pullout` on top: hoist a
loop-invariant test out of a loop by *replicating the loop body under
each assumption* — the code-motion-by-exponential-explosion no compiler
will do on its own, applied exactly where a human says it's worth it.

## Space/time tradeoffs by declared frequency of use

The part Don remembers it for — optimizing the NeWS/Shapes rendering
inner loops — is the tradeoff machinery:

- `$tradeoff(code1, code2)` — two equivalent fragments; Ace estimates
  time and space for each and picks
- `$replace $P(e); $with c;` — declare the **probability** a condition
  is true
- `$trips(100)` — declare expected loop trip count
- `pthresh` / `mingain` command-line parameters — how hot a path must
  be, and how much time a specialization must win, before Ace spends
  the space

That's profile-guided optimization with the profile supplied by the
programmer's head, in 1989. The paper's big example is the Shapes
library's Bresenham vector routine: *one* readable loop, prefixed by
`$switchout` on framebuffer depth (1/8/32 bpp), `$fastrops` on the 16
rasterop codes, and `$alwayspullout` on direction/axis/plane-enable
flags, expands to **20 pages** of specialized inner loops — every
combination of depth, rop, direction, and axis getting its own tight
`do { } while (--count != -1)`, which the 68020 compiles to a `dbra`.
The variations Don recalls (frequency of use, overlapping copies,
direction, depth) are exactly the dimensions being specialized.
Acknowledgements thank Patrick Naughton as guinea-pig user and "the
whole 'Shapes' team."

## Provenance in the NeWS lineage

[DVRC](https://news.ycombinator.com/user?id=DVRC) ("adopter of orphaned
technologies, aspiring NeWSmaker"), in the
[X Macros HN thread](https://news.ycombinator.com/item?id=43472143)
where Don posted the NeWS macrology tour: the BitSavers tape dump of
**X/NeWS 2.0** shows the SHAPES graphics library replacing CScript —
"and it needs the Ace preprocessor to build the device dependent
portion of the library." So Ace wasn't a lab curiosity; it was a load-
bearing build step of the shipping window system. (Same comment: DVRC
is porting NeWS 1.1 to NetBSD, screen already turns blue, currently
fighting 32-bit big-endian binary font formats.)

## Kin, and why it belongs in the story

Ace sits in a family this repo keeps meeting:

- **Macrology, one rung down** — Don's HN tour of NeWS's cpp abuse:
  [arctochain.c](https://donhopkins.com/home/NeWS/SUN/src/server/graphics/arctochain.c)
  (Pratt's conix "heavily massaged by Gosling," macros taking macro
  names and goto-riddled code fragments as arguments), the
  `case4`/`case16`/`case32` cascade in the PostScript parser, the
  Duff's-device main loop. Ace is Gosling's answer to his own cpp
  excesses: if you're going to rewrite programs, rewrite *trees*.
- **p2c, the same year** — the [Body Electric Pascal→C
  story](../../chuck-blanchard/sources/body-electric-pascal-to-c-transpiler.md):
  another source-to-source tree rewriter, faking lexical scope with
  injected struct pointers. Late-80s systems programming was full of
  programs writing programs; the C they emitted was the IR.
- **X macros** — the poor man's Ace: one table, many expansions,
  no syntax trees. The [HN thread](https://news.ycombinator.com/item?id=43472143)
  is the family reunion.
- **Partial evaluation, human-in-the-loop** — `$P`, `$trips`,
  `$assume`, `$tradeoff` are programmer-declared static knowledge
  driving specialization. The MOOLLM echo is direct: the
  [tiered-JIT thesis](../../david-ungar/sources/korz-paper-deep-dive-moollm-mapping.md)
  crystallizes LLM improvisations into deterministic fast paths the
  same way — judged knowledge in, specialized code out, deoptimize
  when assumptions break. Ace is that loop with a human as tier 0.
- **The Gosling arc** — Gosmacs Mocklisp → the Emacs
  [redisplay algorithm](EmacsRedisplayAlgorithm.pdf) (dynamic
  programming against terminal bandwidth) → NeWS + Ace (specialization
  against framebuffer bandwidth) → Java (specialization handed to the
  JIT). The constant: move the cleverness into a tool, keep the source
  readable.

↑ [character](../README.md) · [window systems lineage](../window-systems-lineage.md)
