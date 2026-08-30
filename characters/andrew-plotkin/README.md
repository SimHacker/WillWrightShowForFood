# Andrew Plotkin ("Zarf")

Invitation portrayal — **not** Andrew Plotkin. [Standards](../../schemas/portrayal-standards.md)

**Field:** Interactive fiction — author (*A Change in the Weather*, *Spider and Web*, *Shade*, *Hadean Lands*) and infrastructure architect (Glulx VM, Glk I/O standard, Blorb packaging); co-founder of the Interactive Fiction Technology Foundation; [eblong.com/zarf](https://eblong.com/zarf/) · [blog.zarfhome.com](https://blog.zarfhome.com/)

[Invitation](invitation.md) · [Conversation hooks](ideas.md) · [Sources](sources/)

## The 1989 thread

On 3 December 1989, as a CMU student, Zarf announced **MIDgaard** on the
TinyMUD mailing list — a "Multi-Implementor Dungeon" with object-oriented
rooms, object behavior programmable "in a cheapo Pascalish language," and a
real parser, explicitly rejecting the few-builders model: "To we of tinyMUD,
of course, that ruins the whole point of the game."

Don replied the next day with the **"what could be..." letter**: don't
invent a language ("language implementation is a bitch, language design is a
big hairy mother of a bitch, and the biggest nastiest bitch of them all is
writing the manual"); use an existing interactive one — PostScript/NeWS,
Scheme, Forth, Perl — and mine ZIL/MDL and DDL for ideas. Both messages
survive verbatim in [the TinyMUD archive](../don-hopkins/sources/1989-tinymud-archive/README.md);
the thread digest is in [`sources/1989-12-midgaard-what-could-be.md`](sources/1989-12-midgaard-what-could-be.md).

The epilogue writes itself: MIDgaard never shipped, and Plotkin spent the
following decades building exactly the load-bearing things the letter called
the hard part — a VM, an I/O standard, a packaging format — and writing the
manuals, which became the IF field's specifications. In 2013 his **Seltani**
shipped the MIDgaard idea for real: a multiplayer hypertext world with
player-writable Ages, in the browser.

And the letter's most quotable wish — "I'd do just about anything for
original muddle Zork sources" — came true: the MDL Zork sources are public
now, and Don keeps a checkout. When the Infocom ZIL dump landed in 2019, it
was Zarf who wrote the definitive explainer, digested here as
[`sources/2019-04-what-is-zil-anyway.md`](sources/2019-04-what-is-zil-anyway.md).

Verifiable sources in [`CHARACTER.yml`](CHARACTER.yml). Subject may request
correction or removal anytime.
