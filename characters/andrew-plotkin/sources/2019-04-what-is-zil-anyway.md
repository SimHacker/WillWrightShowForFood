# "What is ZIL anyway?" -- Zarf explains the Infocom stack (April 2019)

Digest of [Andrew Plotkin's blog post](https://blog.zarfhome.com/2019/04/what-is-zil-anyway.html),
written the week the [historicalsource](https://github.com/historicalsource/)
Infocom ZIL dump landed. Relevant here because it is Zarf doing
professionally, thirty years on, exactly what the
[1989 MIDgaard thread](1989-12-midgaard-what-could-be.md) was about:
explaining what language objects should speak, with the receipts.

## The argument, compressed

- **MDL Zork** (Anderson, Blank, Daniels, Lebling; MIT, ~1977-79) was
  written in MDL, "the MIT Design Language," a Lisp-family language on
  the PDP-10 -- the same MDL Don's 1989 letter called "muddle" while
  wishing for the sources.
- **ZIL** looks nearly identical to MDL on the page (Plotkin shows the
  same combat routine in both), but underneath it is "a completely
  different language... a C-like compiled language which operates
  entirely on fixed data structures" -- no lists, no garbage collector,
  because the Z-machine has neither.
- His explanation of why that works: "game logic is a fairly narrow
  sort of programming" -- property lookups, comparisons, and if-trees.
  The same observation that makes SimAntics, and the Soul City plugin
  ladder, viable.
- The lineage he traces: Z-machine shaped ZIL, ZIL and the Z-machine
  shaped Inform 6, and Inform 6 shaped **Glulx**, his own VM: "The
  chain of influence extends all the way from Joel Berez's coffee
  table to mine."

## The Tim Anderson annex

Zork co-author Tim Anderson sent Plotkin detailed corrections, included
verbatim in the post: MDL Zork already avoided consing (the garbage
collector could stop a shared PDP-10 for seconds), used vectors rather
than lists for rooms, declared types everywhere, and used no special
variables -- all of which made the later ZIL port (and the Fortran one)
tractable. The 1977 game was, unintentionally, already written in the
static subset that ZIL would formalize.

## Why it lives in this room

Don's 4 December 1989 letter told Zarf: use an existing interactive
language, mine ZIL/MDL for ideas, and "I'd do just about anything for
original muddle Zork sources." This post is Zarf, custodian of that
exact lineage, writing the definitive public explanation of MDL-vs-ZIL
days after the sources Don wished for went public. The wish and the
explainer arrived together.

Sources for the games themselves:
[historicalsource](https://github.com/historicalsource/) (ZIL) and the
MDL Zork tree Don keeps checked out.
