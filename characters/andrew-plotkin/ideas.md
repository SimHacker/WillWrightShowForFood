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

### 4. Embedded languages for object behavior, 2026 edition

The question the 1989 thread argued is live again: what language should
objects speak? SimAntics answered it for The Sims; the
[plugin ladder and VPRL](../../catalogs/soul-city/object-shops.md) answer it
for Soul City; Inform 7 and Glulx answered it for IF. Three lineages, one
design question, thirty-seven years of returns.

### 5. Preservation as infrastructure

IFTF keeps the IF stack alive the way the Z-machine kept 1980 games playable
on 2026 hardware. That is the strongest working model for what
game preservation looks like when it is *engineering* rather than petition —
the theme running through the
[Bartle forensics](../richard-bartle/sources/1990-imucg-vs-tinymud-primary-record.md)
and the whole Soul City program.

## Sources (public)

- [`CHARACTER.yml`](CHARACTER.yml) · [`invitation.md`](invitation.md)
- [`sources/1989-12-midgaard-what-could-be.md`](sources/1989-12-midgaard-what-could-be.md)
- [eblong.com/zarf](https://eblong.com/zarf/) · [blog.zarfhome.com](https://blog.zarfhome.com/)
