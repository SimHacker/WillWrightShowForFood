# David Crane 🕹️🏠

*Invitation drafted, not sent, no contact route identified yet.
[Portrayal standards](../../schemas/portrayal-standards.md) — public sources only, no invented quotes.*

| | |
|---|---|
| Known for | Activision founder (1979); Pitfall! (1982); Ghostbusters (1984); Little Computer People (1985); Absolute Entertainment (1986) |
| Why him | He made the first computer person interactive, and his email is the only public documentation of where that person's state lives on the disk |
| Proposed show | [`repo-shows/little-computer-people/`](../../repo-shows/little-computer-people/) |
| Co-guests | [Rich Gold](../rich-gold/) (memorial, co-creator), [Will Wright](../will-wright/), [Ell / Tiny Life](../ellpeck/) |
| The ask | [`invitation.md`](invitation.md) · hooks in [`ideas.md`](ideas.md) |

## The four things he said that this project is built on

**He added the interaction, against the designer's wishes.** *"When it was brought in-house, the
original plan was for it to be more like a fish-bowl, with no input from the user. I took it in and
rewrote about half of the original program to include the interactivity that ended up in the final
product."*

**Every disk was a different person, by manufacture.** Activision serialized each copy as it was
duplicated and used the number as a seed for a polynomial counter that set name, shirt colour and
personality. *"Each disk was effectively unique."* Procedural identity bound to a physical artifact,
in 1985, at the duplicator — nobody has done it that way since.

**The save file is 256 bytes and he can tell you where.** *"A 256 byte block of data on the disk held
the LCPs 'brain' to keep personality status as the LCP aged and developed... If it is a virgin
diskette that block will be in its initial state (probably all zeros)."* That is for the C64 version,
which he programmed himself. **The Apple ][ layout is undocumented**, and this repo's retro stack
targets Apple ][ first — so there is a real question only he can answer.

**He already framed the ambition and named the constraint.** In 2005: part of him wanted to make the
little person the smartest thing in computing, maybe pass the Turing test, *"but with the constraints
of time in the software business that was impractical."* The constraint he named is the one that
disappeared.

## What the show would do

Boot a real serialized 1985 disk in a browser emulator, read the brain block live, show him his own
creature's persistent state as editable text, and then move that person into a modern life sim that
has neighbours — which is [the sequel his producer dropped on the floor](../rich-gold/memorial.md#the-tribute),
executed from outside, forty years late.

The technical design, if he wants to check whether we are serious:
[apple-ii-floppy-bridge.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/apple-ii-floppy-bridge.md).

## Sources

- [Crane interview — genesis, in-house serialization, the dropped sequel](https://www.lemon64.com/doc/little-computer-people/353)
- [Crane's email on the 256-byte brain block](https://web.archive.org/web/20250103095311/http://www.softpres.org/article:game:little_computer_people)
- [Little Computer People — platforms, dates, Wright's citation](https://en.wikipedia.org/wiki/Little_Computer_People)

↑ [CHARACTER.yml](CHARACTER.yml) · [CARD.yml](CARD.yml) · [invitation.md](invitation.md) ·
[ideas.md](ideas.md) · [Rich Gold](../rich-gold/)
