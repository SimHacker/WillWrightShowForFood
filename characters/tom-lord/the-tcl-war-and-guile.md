# Tom Lord, GEL/Guile, and the Tcl War — a history dossier

Deep background for the [memorial](memorial.md). Everything here is sourced: Tom's own published
account, the archived flamewar, project histories, and Don's firsthand testimony (marked as such).

---

## Before the war: GEL (1993)

Tom Lord, working at Cygnus, forked Aubrey Jaffer's **SCM** interpreter into an embeddable
library he called **GEL** — a Scheme designed to be linked into applications as their extension
language, the way Emacs Lisp lives inside Emacs. He talked RMS into blessing it as the official
**GNU extension language**. The rename to **Guile** came after trademark trouble, partly because
it sounds a bit like "Guy L." (Guy L. Steele Jr., co-creator of Scheme).

The design argument Tom was making in 1993: one general Scheme engine underneath, many surface
languages and applications on top — including, in the grand plan, a repaired Tcl and eventually
Emacs Lisp itself.

Guile existed **before** the Tcl War, not because of it. The war is why the world heard about it.

## The war (1994)

The sequence, per Tom's own account:

1. **Sun declared Tcl would be "the ubiquitous scripting language of the Internet."** Sun had
   hired John Ousterhout and was positioning Tcl as a standard.
2. **A Cygnus colleague skunked Tom's Scheme-based GDB GUI project** with a quick Tcl/Tk one.
3. Tom, in his own words: "I mentioned these developments to RMS, seeking council."
4. Shortly afterward, **"Why you should not use Tcl"** landed on comp.lang.tcl, and the flamewar
   was on: Ousterhout's reply, weeks of Usenet combat, the GNU extension language announcement.

**Who actually posted it stayed deliberately murky.** The Cygnus NNTP server showed it coming
from Tom's dormant gnu.org account; some archived messages carry RMS in the From line with Tom's
signature at the bottom; Tom would only ever call it a semi-prank by "the Scheme underground."

An Account of the Tcl War, by Thomas Lord:

https://web.archive.org/web/20110102015130/http://basiscraft.com/0800-0100-the-tcl-war.html

Glenn Vanderburg's archive of the original flamewar:

http://vanderburg.org/old_pages/Tcl/war/

**The Rush footnote:** RMS's GNU extension language announcement cited **Rush** by name — Adam
Sah's Tcl-feel language (built with Jon Blow at Berkeley) that compiled to Scheme at 50-300x
stock Tcl speed. Sah's earlier TC thesis (1994, first reader: Ousterhout himself) had already
shown 5-10x from caching parsed value representations, essentially the design Tcl 8.0 later
adopted. The Rush source is lost, which is a small tragedy.

**Nobody stays pure:** Tom, patron saint of the embeddable Scheme interpreter, compiled the
performance-critical parts of his own Scheme editor with the **Hobbit** compiler. His account
says so plainly.

## Don's side of the war (firsthand testimony)

Don was on all sides at once: he had hacked on **Elk** (Oliver Laumann's Extension Language Kit,
the other embeddable Scheme, for which Don wrote the SPARC port) before the war, and during it he
was shipping **SimCity for Unix on Tcl/Tk** — Tk being the draw, Tcl being the reason Tk never
had to badly reinvent a scripting language. He demoed multiplayer SimCity to Ousterhout in his
Berkeley office. He and Tom argued about all of it, for decades, the way you can only argue with
someone who has actually built the thing being argued about.

The full history, written as a tribute:

[The Part Where It Compiles](../don-hopkins/the-part-where-it-compiles-hn-2026.md) —
[HN 48870736](https://news.ycombinator.com/item?id=48870736)

## After the war: why Guile didn't take over the world

The plan was always grander than the resources. Emacs Lisp turned out to be immovable — not just
a Lisp but a deeply weird one (dynamic scoping by default, buffer-local variables, text
properties, semantics tangled into the C core of the editor). Decades of plans and experiments
to put Emacs on Guile never budged the ecosystem; Guile 2.x even shipped an Elisp compiler on
its VM. In the end Emacs went the other way and grew its own native compiler (Emacs 28,
libgccjit).

Guile's own arc vindicated Tom's architecture late: **Andy Wingo** gave it a real compiler in
2.0, a register VM in 2.2, and a native JIT in 3.0, and it found its killer app in **Guix** —
not the ubiquitous extension language of GNU, but a living demonstration of the universal-engine
argument Tom made in 1993.

Guix developers marking his passing ("an early — or the first? — maintainer of Guile"):

https://lists.gnu.org/r/guix-devel/2022-07/msg00227.html

## GNU arch (2001-2006)

In 2001 Tom started **GNU arch** — command name `tla`, "Tom Lord's Arch" — one of the earliest
distributed version control systems, beginning as shell scripts offering an alternative to CVS.
It became a GNU project in 2003. Canonical's first Bazaar (`baz`) began as a fork of tla.
Arch's central argument — that version control should be distributed — won completely, even
though arch itself was eclipsed by git. He later sketched a successor, revc, that he never had
the resources to finish.

https://en.wikipedia.org/wiki/GNU_arch

## The 1998 XML vs S-expressions debate

Five years before arch and four years after the war, Tom was still making the substrate
argument: structured text should be isomorphic to Scheme S-expressions, GNU applications should
standardize on it, and RMS should put his foot down. Don argued back, at full Don volume, for
XML. RMS was cc'd. The email is preserved:

[XML vs S-expressions, January 1998](sources/1998-01-16-xml-vs-sexpressions-email.md)

It's the same Tom as the war and the same Tom as Guile: find the universal substrate, control
the parenthesized core, let surface syntaxes be surface. He lost the XML round too. Twenty-five
years later, half the world's config files are YAML pretending not to be S-expressions, and
LLMs eat structured text in whatever syntax you feed them. The argument outlived the verdicts.

## Berkeley (2004-2022)

From 2004 Tom lived in Berkeley and poured the same intensity into civic life: writing for the
Berkeley Daily Planet, appointed to the City Housing Advisory Commission in 2016, advocating on
housing, displacement, and homelessness. After the IPCC's SR15 report in 2018 he became a
tireless advocate for speaking the truth about the climate emergency and treating it as an
actual emergency. He volunteered coaching young writers at Longfellow Middle School. People's
Park held great meaning for him from his first Berkeley years in the mid-90s.

He died unexpectedly of a massive brain hemorrhage in June 2022, at 56.

Obituary by Trina Pundurs, Berkeley Daily Planet:

https://berkeleydailyplanet.com/issue/2022-06-26/article/49837

Tom Lord RIP, LWN:

https://lwn.net/Articles/901807/

Thomas Lord, an LtU regular, dies at 56 — Lambda the Ultimate:

http://lambda-the-ultimate.org/node/5653

## The legacy, in one paragraph

Tom's projects are easy to score wrong if you count only market share. Guile didn't replace
Emacs Lisp; arch didn't become git; S-expressions didn't beat XML. But the war he ignited forced
free software to think hard about what an extension language owes its users; the universal-engine
architecture he argued for in 1993 now runs Guix; the distributed version control argument he
shipped in 2001 is how all software is built today; and his philosophical writing about
extension languages, universal engines, and who gets to control the substrate remains a rich
source of wisdom that hardly anybody mines. He was early, load-bearing, and right more often
than he was credited. His friends knew.
