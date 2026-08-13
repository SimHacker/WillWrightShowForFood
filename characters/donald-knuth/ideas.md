# Ideas to explore with Donald Knuth

*Dream-guest hooks — grounded in public work. Invitation:* [`invitation.md`](invitation.md)
*(snail-mail only if ever sent).*

## 0. Centerpiece — Adventure in CWEB

Why recast the ur-game as literature? What does `advent.w` teach that playing Adventure alone
doesn't? Walk a few sections: vocabulary → travel table → dwarves → scoring.

Local: [`sources/adventure-knuth/`](sources/adventure-knuth/) ·
Upstream: [programs.html#advent](https://www-cs-faculty.stanford.edu/~knuth/programs.html#advent)

## 0.5. THE DREAM — the literate adventure code reading, with Don Woods

`advent.w`'s copyright line reads **"Don Woods and Don Knuth"**. Put both names in the room:
Woods narrates what the 1977 FORTRAN *did* and why; Knuth narrates why each section reads the
way it *reads*. Author beside annotator, walking the same cave twice.

The channel is real, not wishful: Woods saw Knuth at a SAIL reunion (~2025) — *"getting frail
but is still plenty sharp"* — and Knuth once wrote to Woods about a hack he'd found in
**INTERCAL's division routine** (2003, for TAOCP vol 4 credit; neither Woods nor Lyon could
remember whose it was). Knuth engaged seriously with both of Woods's masterpieces.

**Encore — the border crossing into Zork.** After the literate Adventure, visit the
neighboring realm while the party's assembled (GIVE TROLL TO TROLL is Zork's troll, not
Adventure's — the crossing is the point). Don Hopkins called the MDL Zork source
*"practically a form of literature"* on the Wikipedia Zork talk page in 2013 — Knuth's
`advent.w` thesis, stated fifteen years early about Adventure's own descendant. Read the
troll clause from `act1.mud` aloud: GIVE AXE TO TROLL, GIVE TROLL TO TROLL (self-devouring
via transitive containment), and the bug — **`TROLL-FLAG!-FLAG`** never cleared, so an empty
room still fends you off. Don's own black-box hypothesis from MIT-DM, confirmed in the
source decades later — which puts the host in the reading, so all **three Dons** close-read
code they each have history with. And Woods gets right of reply: Zork was MIT's answer to
his cave. Comparative NPC zoology rides along: Woods's toll-troll vs MIT's self-devouring
one, pirate vs thief, bird vs canary, pit vs grue, dwarves vs cyclops, the robot, and GDT.
([harvest](../don-hopkins/sources/zork-troll-flag-adventure-lineage-hn.md) ·
[MDL source](https://github.com/itafroma/zork-mdl))

Wiring: [Don Woods room](../don-woods/) · [correspondence digest](../don-woods/sources/correspondence-digest.md) ·
[don-woods-adventure seed](../../repo-shows/don-woods-adventure/README.md) (dream ensemble)

## 1. Literate programming × Repo Show

"Explain to humans what you want a computer to do." Facades, CARD/GLANCE/SKILL pyramid,
YAML Jazz — same instinct? Where we misunderstand WEB?

Quotes harvest: [`sources/literate-programming-site-quotes.md`](sources/literate-programming-site-quotes.md)

## 2. SHRDLU inside-out

Montfort / HN: Adventure as SHRDLU turned inside out (also a fancier WUMPUS).
Pair energy with [Terry Winograd](../terry-winograd/) — not a panel unless both want it.

Trail: [`sources/advent-shrdlu-wumpus-lineage.md`](sources/advent-shrdlu-wumpus-lineage.md)

## 3. LLMs as readers (and bad tangle)

Does a language model change who the "human reader" is? Can literate sections train better
agents than dumpster-fire repositories? What must stay human-ordered?

## 4. Optional deep ends (only if he opens the door)

- TeX as a program meant to be read
- Elegance / "Pulitzer for programs" half-joke
- Pipe organ / Musings — only if *he* steers there
- The 2003 INTERCAL division-routine letter (see hook 0.5)

## What we do **not** ask

- Unsolicited email
- A long live webinar
- "React to our startup"
- Bug-report addresses used as a back channel

↑ [`README.md`](README.md)
