# Logo Adventure — C64 Terrapin Logo (1983)

## The hook

Terrapin wanted something on the **utilities disk** that was not another turtle demo: a
simple non-graphical game that showed **list processing** and **functional Logo**. Don shipped
**Logo Adventure** — and the parser is the Logo interpreter itself.

## No main program

There is no separate adventure engine and no hand-written parser. The game **extends the Logo
top-level read-eval-print loop**: words like `LOOK`, `N`, `S`, `E`, `W`, `TAKE`, `EXAMINE` are
Logo procedures. The world is Logo data; the REPL is the command processor.

Don on [Hacker News (2016)](https://news.ycombinator.com/item?id=12207532):

> The nice thing was that there was no "main program" or parser, it just extended the Logo
> interpreter top level to be an adventure game!

Leigh Klotz remembered the disk blurb differently — *"written by a typical 14-year-old"* —
which everyone found funny. Overlays with `LOAD` navigated across roomsets.

## Read the originals

- [Medium article](https://donhopkins.medium.com/logo-adventure-for-c64-terrapin-logo-4c684a240b53) — `CMD` / `TOPLEVEL`, `INITITEMS`, implementation notes
- [adventure.logo](http://donhopkins.com/home/archive/logo/adventure.logo) — source on Don's archive
- Longer room-level write-up: [`../logo-adventure-c64-terrapin.md`](../logo-adventure-c64-terrapin.md)

## Why the show cares

- **Constructionist cheat code:** players who inspect and patch the running world learn Logo —
  same spirit as Brian's "computing is your birthright," different artifact.
- **REPL-as-parser** foreshadows microworld stacks where the language shell *is* the simulation
  (MOOLLM, Repo Show rooms).
- **Functional + lists** without graphics — the complement to turtle-forward pedagogy in
  [*Computer Science Logo Style*](../../brian-harvey/sources/computer-science-logo-style.md).
- **The mirror image exists:** Andrew Plotkin's *Lists and Lists* (1996) is a Lisp tutorial
  with a Lisp interpreter running inside the Z-machine's 64K, built by a man who says of
  Lisp "Yes! I hate it!" He put the language inside the game; Logo Adventure put the game
  inside the language. And in 1989 Don had told him to use an existing interactive language,
  without mentioning he had already shipped the proof at seventeen. Comparison table in
  [the Plotkin interview digest](../../andrew-plotkin/sources/2024-12-digital-antiquarian-interview.md).

## HN archaeology

| Thread | What landed |
|--------|-------------|
| [12207532](https://news.ycombinator.com/item?id=12207532) | Papert memorial; Leigh's utilities-disk story; Don on REPL-as-parser |
| [36755727](https://news.ycombinator.com/item?id=36755727) | 1974 Logo manual; Don links Adventure + LLogo |
| [38016554](https://news.ycombinator.com/item?id=38016554) | Teaching functions; Don on list/functional Adventure |

↑ [Sources index](README.md) · [Don's room](../README.md) · [LLogo rescue](llogo-maclisp-its.md)
