# Christopher C. Stacy

*A portrayal about Christopher Stacy, not Christopher Stacy. He may correct,
add to, or remove anything here. [Portrayal standards](../../schemas/portrayal-standards.md).*

**Christopher C. Stacy (CSTACY at MIT-MC)** wrote the MIT AI Lab's
orientation guide for newcomers and its crash-recovery manual for ITS. If you
want to know what it was like to sit down at a Knight TV in 1982, his guide is
where to look.

## The papers

**[Getting Started Computing at the AI Lab](sources/ai-wp-235-getting-started-1982/AI_WP_235.pdf)**,
AI Working Paper 235, 7 September 1982. Lisp Machines, ITS, TOPS-20, the
ARPANET and Chaosnet, mail etiquette, Emacs, the XGP and the Dover, and the
Knight TVs. Its abstract: "It is intended as an orientation document for
newcomers to the lab, and will be updated by the author from time to time."

Chapter 5, the Knight TV system:

> The Knight TVs are bit-mapped frame buffer displays controlled by a small
> PDP-11. The TV-11 is connected to the PDP-10 via a special PDP10-to-PDP11
> interface which allows the PDP-11's memory to be mapped into the PDP-10.
> ...
> The TV-11 is also connected to the elevators in NE43, and the ninth-floor
> door opener. There are commands to summon the elevator and open the door.

and Figure 5-2, the commands you type after ESCAPE:

> D — Buzz open the ninth floor door. Your screen flashes when the door has
> been buzzed.
>
> E — Summons the elevator to your floor. Your screen flashes when the
> elevator has been called.

It also describes MIT-AI itself: "a modified PDP-10 model KA processor with
Stardust Memories, a homebrew pager, PDP10/PDP11 computer interfaces, a 7
track tape drive, and eight Calcomp disk drives."

The guide is the contemporary record behind
[Call me an elevator](../kent-pitman/elevator-and-door.md), the story of
buzzing the ninth-floor door from a terminal, and behind
[the PDP-10/PDP-11 shared-memory history](../../packages/cabinet/MAPPING.md)
that the cabinet emulator's design borrows from.

**[A Guide to ITS Operations: Useful Spells And Incantations](sources/ai-wp-227-guide-to-its-operations/AI_WP_227.pdf)**,
AI Working Paper 227, 27 January 1982. Crash recovery for the KA-10s, for
people who are not system wizards. It opens:

> It is said that it is not wise to dabble in the Arts without care and
> caution, for the spell is at once subtle and dangerous: Look herein! For if
> you read carefully and closely, you can incant a Word of Magic, and the
> system might be revived.

and on the TV-11:

> The Knight TVs are controlled by the PDP-11 against the wall near the AI
> PDP-10. You can't miss it; it is the large rack with all the wires hanging
> out. It is extremely fragile.

To reload it you start the PDP-11 by hand and run `STUFF` under ITS, which
loads the PDP-11's program through the 10/11 interface.

Both are on [Stacy's sources page](sources/README.md), as PDFs and plain
text, with links to the copies on the ITS wiki and the Wayback Machine.

## In the record

- In the mail Don published as
  [How Jerry Pournelle got kicked off the ARPANET](http://www.art.net/~hopkins/Don/text/pourne-smut.html),
  the thread starts with Stacy's 19 January 1984 message about TACACS, and
  Kent Pitman's 31 May 1985 "I'd rather recycle his account for some bright
  12-yr-old..." is addressed to him. Kent's page on
  [`:TEACH;LISP` and the bright 12-year-olds](../kent-pitman/teach-lisp.md) quotes it.

## Conversation

Not invited yet. Things to ask him: how the guide was written and updated,
what newcomers got wrong most often, who kept the TV-11 alive, and what the
lab was like for a tourist from his side of the desk.

↑ [Characters](../README.md) · [Kent Pitman](../kent-pitman/README.md) ·
[Lars Brinkhoff](../lars-brinkhoff/)
