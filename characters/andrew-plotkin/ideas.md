# Ideas to explore with Andrew Plotkin 👤

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in Zarf's
public work and the documented 1989 correspondence. Things Don would love to follow
**with** Andrew Plotkin; not quotes, not claims about what he thinks.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest · consent not_yet_asked

## What Andrew has done

Andrew Plotkin ("Zarf") — interactive fiction author (*A Change in the Weather*,
*Spider and Web*, *Shade*, *Hadean Lands*) and the IF ecosystem's infrastructure
architect: Glulx VM, Glk I/O standard, Blorb packaging. Co-founder of the
Interactive Fiction Technology Foundation. In December 1989 he announced MIDgaard
on the TinyMUD list, and Don replied with the "what could be..." language letter.

## Shared ground

Don emailed Zarf on 4 December 1989 about embedded languages for MUD object
behavior — the full thread survives in
[the TinyMUD archive](../don-hopkins/sources/1989-tinymud-archive/README.md),
digested in [`sources/1989-12-midgaard-what-could-be.md`](sources/1989-12-midgaard-what-could-be.md).

## The hooks

### 1. The MIDgaard rematch: was the letter right?

Read the December 1989 thread on air, both principals present. Don argued:
never invent a language — implementation is a bitch, design is a big hairy
mother of a bitch, and the manual is the worst of all. Zarf then spent
decades doing precisely the forbidden things — a VM (Glulx), an I/O standard
(Glk), a packaging format (Blorb) — *and wrote the manuals*, which became
the field's specifications. Who won the argument: the advice, or the person
who ignored it well? What does "use PostScript" sound like in hindsight,
from the man who shipped the alternative?

### 2. "I'd do just about anything for original muddle Zork sources"

Don's most quotable 1989 line, addressed to Zarf. The wish came true: the
MDL Zork sources are public, and Don keeps a checkout (`act1.mud` and all).
Better still: when the Infocom ZIL dump landed in April 2019, it was Zarf who
wrote the definitive public explainer —
["What is ZIL anyway?"](sources/2019-04-what-is-zil-anyway.md) — with Zork
co-author Tim Anderson sending corrections. The wish and the explainer are
custodianship of the same lineage. Segment: open the muddle on air, two people
who each spent a career downstream of it — Don via SimAntics and NeWS, Zarf via
ZIL's whole descendant ecosystem.

### 3. Seltani closes the MIDgaard loop

MIDgaard promised object-oriented rooms, programmable behavior, everyone a
builder. Twenty-four years later Zarf shipped Seltani: a multiplayer
hypertext world with player-writable Ages, in the browser. Compare notes
with [Soul City](../../catalogs/soul-city/README.md) — writable districts,
web-native, everyone a builder — which descends from the same 1989 premise
by the other parent.

### 4. Praser 5: you built MOOLLM in the CMU filesystem in 1990

From the [2024 Digital Antiquarian interview](sources/2024-12-digital-antiquarian-interview.md):
*Praser 5* began as "a puzzle stuck inside the CMU filesystem. Every
'room' was a directory, connected by symlinks. ... The riddles were a
matter of running a small executable which was linked in each
directory. I used file permissions to give people access to more things
as they solved more puzzles."

Directories as rooms, symlinks as exits, `ls` as `look`, executables as
verbs, permissions as the progression gate, on a shared multi-user
machine. That is MOOLLM's premise, twenty-five years early. Meanwhile,
the same twelve months, Don was building the parallel room database
inside Emacs instead of inside the filesystem
([the client dig](../don-hopkins/sources/1989-tinymud-archive/clients/README.md)).
Two people at the same seam, choosing different substrates: whichever
tool you already live inside becomes the world. Segment: run both, argue
about which substrate won, and note that Zarf's stated goal was to
*subvert* the filesystem rather than teach it.

### 5. The seam neither of us named: Don proposed Glk in 1989

Zarf on the origin of Glk: two front ends times two virtual machines
made a matrix, and "all the virtual machine does is accept text input
and generate text output. ... I was doing the same thing that Infocom
did, just slicing it into more layers."

Don, TinyMUD list, 20 December 1989, arguing for typed output packets:
"(Idealy I'd like to be able to download PostScript procedures to the
mud server that tell it what format to send messages back to me. The
standard text-based user interface would be just one such procedure.)"

Same architectural move, nine years apart, from two people on the same
mailing list: type the output stream, separate world model from
presentation, demote the scrolling terminal to one renderer among many.
Don reached for NeWS, where the interface is code that travels to the
display. Zarf reached for a C API with a capability model, which is the
one that shipped and is still under Inform 7. The 1989 thread has always
been read as language advice; it was also two people circling the same
seam, and only one of them built it.

### 6. Embedded languages for object behavior, 2026 edition

The question the 1989 thread argued is live again: what language should
objects speak? SimAntics answered it for The Sims; the
[plugin ladder and VPRL](../../catalogs/soul-city/object-shops.md) answer it
for Soul City; Inform 7 and Glulx answered it for IF. Three lineages, one
design question, thirty-seven years of returns.

### 7. Lists and Lists vs Logo Adventure: which one hosts which?

Zarf, asked whether he has a special relationship with Lisp: "Yes! I
hate it!" And then *Lists and Lists* (1996) is a Lisp tutorial with a
Lisp interpreter running inside the Z-machine's 64K, because he had
written one as a college exercise and it "seemed doable."

Don shipped the mirror image in 1983 at seventeen, on Terrapin's C64
Logo utilities disk:
[Logo Adventure](../don-hopkins/sources/logo-adventure-c64-terrapin.md)
has no engine and no parser, because `LOOK`, `N`, `TAKE` are Logo
procedures, the world is Logo lists, and the REPL is the command
processor. One of them put the language inside the game; the other put
the game inside the language. Both end with a player typing expressions
at a fiction.

Which reframes the 1989 letter: when Don wrote "It's got to be an
interactive language ... You should be able to type in little chunks of
code to see what happens," he had already shipped the proof and never
said so. Segment: run both on screen, then jump to MOOLLM doing it a
third time with the LLM chat REPL as the parser and directories as
rooms.

### 8. "Someone has to actually do the work"

Zarf on LLMs and parser games, December 2024: he is more interested in
the input side than the output side ("I like hand-crafted output"),
observes that "the people who are interested in making parser games are
mostly old-fashioned artisans," and concludes: "Revolutions are the
result of one person getting involved and building something that takes
off. Someone has to actually do the work. And to this point, nobody has
done that."

Don is doing that work from the other direction: model routes intent,
human authors the artifact, which is the same input/output split Zarf
drew ([VPRL and the plugin ladder](../../catalogs/soul-city/object-shops.md),
[soul-chat](../../catalogs/soul-city/README.md)). Live question rather
than a pitch: where does a hand-craft artisan actually want the machine,
and where does its presence ruin the thing?

### 9. Second acts, and the money said plainly

Zarf, on refusing to be "a person who was famous for having been a big
game writer in the 1990s. That's a sucky position to be stuck in. There
needs to be a second act." And on the economics: *Hadean Lands* and Bob
Bates's *Thaumistry* pulled nearly identical backer counts, "the same
crowd showing up: 'Yeah, we still love ya!' But they're not enough to
make a living from."

That is the same wall the [membership model](../../catalogs/soul-city/membership-model.md)
is designed against. Two people who have each tried to monetize a niche
they helped create, comparing scars in public. NarraScope's format rules
are also directly usable as Repo Show precedent: catered lunch so people
stay and talk, long breaks, and badges that do not distinguish speakers
from attendees, because "we're all here, and we're not going to have
superstars."

### 10. Preservation as infrastructure

IFTF keeps the IF stack alive the way the Z-machine kept 1980 games playable
on 2026 hardware. That is the strongest working model for what
game preservation looks like when it is *engineering* rather than petition —
the theme running through the
[Bartle forensics](../richard-bartle/sources/1990-imucg-vs-tinymud-primary-record.md)
and the whole Soul City program.

## Sources (public)

- [`CHARACTER.yml`](CHARACTER.yml) · [`invitation.md`](invitation.md)
- [`sources/1989-12-midgaard-what-could-be.md`](sources/1989-12-midgaard-what-could-be.md)
- [`sources/2019-04-what-is-zil-anyway.md`](sources/2019-04-what-is-zil-anyway.md)
- [`sources/2024-12-digital-antiquarian-interview.md`](sources/2024-12-digital-antiquarian-interview.md)
- [eblong.com/zarf](https://eblong.com/zarf/) · [blog.zarfhome.com](https://blog.zarfhome.com/)
