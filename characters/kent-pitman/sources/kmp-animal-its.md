# KMP ANIMAL — MIT-MC learned tree

**Source in this repo:** [kmp-animal-its/animal-database-from-its.lisp.txt](kmp-animal-its/animal-database-from-its.lisp.txt) (74,246 bytes, one s-expression)  
**Also at:** [donhopkins.com/home/code/animal-database-from-its.lisp.txt](https://www.donhopkins.com/home/code/animal-database-from-its.lisp.txt)

## What this file is

Kent Pitman's **ANIMAL** (spring 1978, MacLISP on MIT-MC) stored its knowledge as a **binary decision
tree** in `*MEMORY*`. At shutdown or on demand, the program wrote that tree with `(PRINT *MEMORY*)` into
`animal.save` on the `(DSK GAMES)` device. The file you have is that dump: not source code, but the
**accumulated play** of many lab users — questions, animals, and author tags.

Fresh installs started from `(CONSTRUCT-TERMINAL 'DOG '|No one|)`. Everything else in this 74 KB blob
was learned in play.

## Tree shape (MacLISP sexpr)

From `animal.133`:

| Node kind | Structure |
|-----------|-----------|
| Question | `(QUESTION question-text author no-branch yes-branch)` |
| Terminal | `(TERMINAL animal-name author)` |

Branches are nested lists. Question text is not always plain English: the game's interpreter
turned player sentences into **internal forms** such as `HAS-STATE`, `HAS-ACTION`, `HAS-POSSESSION`,
`HAS-HABITAT`, `MAKES-NOISE`, then stored those as the `QUESTION` car.

Example opening of this database (truncated):

```lisp
(((((HAS-STATE))) A (REAL) (((((ANIMAL)))))) KMP
  ((HAS-STATE HORSE-LIKE) KMP
   ((HAS-ACTION BREATHES FIRE) ELIOT
    ...)))
```

So the "weird MacLisp syntax" is really **compiled game knowledge**: English went through `GAMES;PARSE`,
pattern rules (`DEF-INTERPRETATION`, `DEF-TRANSFORM`, …), and concept macros (`DEF-CONCEPT`, `DEF-MEANING`)
before it landed in the tree.

## Don's fingerprints

Don played as **A2DEH** on MIT-MC from Maryland over the ARPANET (high-school **TURIST** account era).
This tree tags **A2DEH** as `AUTHOR` on 42 nodes — jokes, meta entries, and normal animals alongside KMP,
ELIOT, GRAND, LAUREN, and dozens of other lab handles.

HN lore (Feb 2024, [item 39386175](https://news.ycombinator.com/item?id=39386175)): Don's secret animal was
the **Pope**; a distinguishing question involved bears and woods; the game's **foul-language filter**
tripped; ANIMAL **emailed KMP** (cc Don) and stayed mad until Don apologized (July 1982). That episode
is documented in correspondence and HN, not necessarily as the literal atom `POPE` in this communal
snapshot.

## ANIMAL as proto-character

ANIMAL II was more than a guessing game. From `animal.133`:

- `*FOUL-FLAG*`, `*FORGIVE-FLAG*`, `*APOLOGY-FLAG*` — relationship state
- `(REMEMBER 'FOUL)` — per-user persistence on the ARC archive device
- `SEND-MAIL` to KMP when foul count exceeds threshold
- `RECEIVE-APOLOGY` — multi-branch apology handler (including "Perhaps you should see a priest.")

That is an **emotional state machine with social consequences** — the same design move MOOLLM later
formalizes as character skills (see [Kent Pitman correspondence](../../../https://github.com/SimHacker/DonHopkins/blob/main/characters/don-hopkins/correspondence/kent-pitman.yml) in DonHopkins).

## Program and parser context

| Artifact | URL |
|----------|-----|
| `animal.133` — main source | [github.com/PDP-10/its/.../animal.133](https://github.com/PDP-10/its/blob/master/src/games/animal.133) |
| `animal.rules` — instructions | [github.com/PDP-10/its/.../animal.rules](https://github.com/PDP-10/its/blob/master/src/games/animal.rules) |
| `animal.save` — ITS mirror | [github.com/PDP-10/its/.../animal.save](https://github.com/PDP-10/its/blob/master/src/games/animal.save) |

ANIMAL loaded the same parser stack as other MIT-AI games: `GAMES;PARSE`, `GAMES;WORDS`, `GAMES;PATTRN`.
Zork on DM reused that parse package — Don's tourist path to Zork and ANIMAL is one ARPANET story
([HN 42767132](https://news.ycombinator.com/item?id=42767132)).

**Note:** Comments in source marked `JW` and `MARC` are author initials in the code (Jerry Wolper, Marc Blank),
not parser variable names. Parser specials are `PRSA`, `PRSO`, `PRSI`.

## Preservation

| Copy | Size | Notes |
|------|------|-------|
| Don hosted (2005-06-08) | 74,246 B | Canonical for this repo |
| PDP-10/its `animal.save` | 73,317 B | Lars Brinkhoff / tape restoration; ~1 KB delta |

## Show hooks

- **Kent Pitman room** — ANIMAL emotional state → Sims needs / MOOLLM skills
- **Parser craft episode** — natural language → tree updates; cousin of Adventure/Zork
- **Communal ITS data** — read a 1978 multiplayer knowledge base as literal sexpr
- **Don & KMP** — `:TEACH;LISP` tourist arc plus the apology email story

## See also

- [Kent Pitman CHARACTER.yml](../CHARACTER.yml)
- [LLogo ITS rescue](../../don-hopkins/sources/llogo-maclisp-its.md) — same lab, same MacLISP era
- [Palmhoo Logo shelf](../../../palmhoo/history-and-lore/logo-llogo-and-c64-adventure.md)
