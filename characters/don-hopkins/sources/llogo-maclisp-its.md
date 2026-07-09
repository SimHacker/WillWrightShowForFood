# LLogo — MacLISP on MIT-AI ITS

**Source in this repo:** [llogo-maclisp-its/llogo.lisp.txt](llogo-maclisp-its/llogo.lisp.txt) (12,480 lines)  
**Also at:** [donhopkins.com/home/code/llogo.lisp.txt](https://www.donhopkins.com/home/code/llogo.lisp.txt)

## The hook

Brian Harvey's [*Computer Science Logo Style*](https://people.eecs.berkeley.edu/~bh/volumes.html)
teaches Logo as a serious language for serious ideas — procedures, data, recursion, compilers.
**LLogo** is where that curriculum meets the **MIT AI Lab floor**: Logo implemented in MacLISP on
ITS, with optional loads for TV turtles, display turtles, Germland, music boxes, plotters, pots,
and the rest of the hardware menagerie.

Don's phrase, repeated across HN threads: *where the rubber meets the road.*

## Rescue and revival

Don copied the concatenated sources off ITS before the era passed. **Lars Brinkhoff** and
collaborators got LLogo running again under MacLisp on a PDP-10 emulator; output appears on an
emulated **Knight TV**. See [PDP-10/its#620](https://github.com/PDP-10/its/issues/620).

Lars also maintains a [list of Logo memos](https://github.com/pdp11/sits/wiki/List-of-Logo-memos)
and AIM scans:

- [AIM-307](http://bitsavers.org/pdf/mit/ai/aim/AIM-307.pdf) · [AIM-307a](http://bitsavers.org/pdf/mit/ai/aim/AIM-307a.pdf)
- [AIM-313](http://bitsavers.org/pdf/mit/ai/aim/AIM-313.pdf) · [AIM-315](http://bitsavers.org/pdf/mit/ai/aim/AIM-315.pdf) · [AIM-315a](http://bitsavers.org/pdf/mit/ai/aim/AIM-315a.pdf)

**Analysis status:** open — deeper hardware-driver walkthroughs from ongoing discussions will be
merged into this dossier.

## Architecture (sketch)

| Piece | Role |
|-------|------|
| **DEFINE** | Readmacros, compiler macros, `DEFINE` bootstrap |
| **SETUP** | Logo vs Lisp obarrays, `#` obarray switch, homonym checks |
| **READER / PARSER** | `LOGOREAD`, `PASS2`, infix, `PARSEMACRO` |
| **UNEDIT** | `TO` / `END`, line-numbered procedures |
| **PRIMIT / ERROR** | Primitives, `LOGOBREAK`, stack hacking |
| **TVRTLE / TURTLE / GERMLAND / MUSIC** | Optional FASL loads at startup |

On ITS, `ALLOCATOR` asks interactively which hardware packages to load — TV turtle, display
turtle (GT40 vs 340), Germland, music box. That is Logo as a **kernel plus pluggable worlds**.

Square-bracket readmacros (`[ITS ...]`, `[MULTICS ...]`) compile one source tree for multiple
hosts — the same portability instinct Brian later documents in cross-platform Logo teaching,
expressed here as 1970s MacLISP conditional compilation.

## HN archaeology

| Thread | Year | Notes |
|--------|------|-------|
| [36755727](https://news.ycombinator.com/item?id=36755727) | 2023 | 1974 Logo manual; Don dumps LLogo + Adventure links |
| [23054174](https://news.ycombinator.com/item?id=23054174) | 2020 | History of Logo; Lars on emulator progress |
| [28604773](https://news.ycombinator.com/item?id=28604773) | 2021 | Byte Logo issue; Don's LLogo repost |
| [12207532](https://news.ycombinator.com/item?id=12207532) | 2016 | Papert memorial; Adventure + LLogo in one breath |

Compendium: [`logo-archaeology-hn-digest.md`](logo-archaeology-hn-digest.md)

## Show hooks

- Pair with Brian's CSLS **compiler / program-as-data** chapters and the [Snap! metaprogramming digest](../../brian-harvey/sources/snap-macros-metaprogramming.md).
- **Logo → Scheme → Snap!** lineage: Brian wrote the textbooks; Don preserved the lab implementation.
- Community preservation with Lars — same shelf as AskTog / CS547 rescue lore in Palmhoo.

## Deeper into the multiverse

- [Logo Adventure (C64)](logo-adventure-c64-terrapin.md) — list/functional literacy without turtles
- [Brian's CSLS volumes](https://people.eecs.berkeley.edu/~bh/volumes.html)
- [Constructionist lineage trail](../../../process/trails/constructionist-lineage.md)
- [Palm on worms field notebook](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/palm-on-worms-fieldnotes.md)

↑ [Sources index](README.md) · [Don's room](../README.md) · [Brian's CSLS](../../brian-harvey/sources/computer-science-logo-style.md)
