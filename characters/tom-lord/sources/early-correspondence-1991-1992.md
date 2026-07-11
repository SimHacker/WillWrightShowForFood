# Early correspondence — Tom and Don, 1991–1992

Tom's **FSF years** — working for RMS on the GNU Project, after abruptly leaving Mountain View
for Massachusetts. Forwarded mail preserved verbatim where quoted; headers lightly
normalized for readability.

These are the years before GEL, before the Tcl War, before arch — Tom already forwarding the
good stuff, already `-t` and `:)` at the end of practical engineering notes.

## guess where i work (30 August 1991)

From: **`lord@gnu.ai.mit.edu`** (Tom Lord)  
To: `don.hopkins@Eng.sun.com`, `nix@sgi.com`

> -t  
>
> :)

The whole message. The punchline is the From line: **gnu.ai.mit.edu** — Tom was now at the FSF,
working with RMS, having abruptly moved from Mountain View to Massachusetts. No body text needed;
the header is the announcement. (His obituary confirms: FSF staff, developing for the GNU
Project, several years in the early 1990s.)

## comp.theory.cell-automata — CAM-PC (20 December 1991)

Tom forwards David Hiebeler's Automatrix CAM-PC press release from comp.theory.cell-automata —
a $1950 single-board 24-MIPS cellular automata machine for IBM PCs, Margolus neighborhoods in
hardware, Toffoli and Margolus textbook bundled. Tom's entire cover note:

> Newsgroups: comp.theory.cell-automata

The release is a period piece: SIMD RISC on a PC/XT board, real-time CA animation, lattice-gas
fluids, artificial life, "Fortune 1000" purchase orders. `campc@automatrix.com` for info.

## a la recherche du temps perdu (26 December 1991)

Subject: *a la recherche du temps perdu (how to recharge temporary chickens)*

Tom, digging through his restored CMU account, finds Don's 1987 **essay question** program in a
directory called `random code` and sends it back:

```c
/*
 * Date: Sun, 1 Feb 87 22:36:07 EST
 * From: Don Hopkins <don@brillig.umd.edu>
 * Subject: Essay question
 *
 * Without using anything but the calculator hanging off your belt,
 * your VI quick reference card, and the LCD alarm chronograph
 * mechanical pencil in your plastic pocket reinforce-omatic, describe
 * in minute detail the output of this program. Expound in depth on
 * the cultural and historical traditions behind every race condition
 * involved, including insightful commentary on the personality quirks
 * and religious practices of the parties responsible for each kernel
 * bug you refer to in your explanation. Make sure to mention every
 * operating system release in which your comments apply. Be concise
 * and to the point. You may not blame it on the compiler. For extra
 * credit, replace the fork() with vfork().
 *
 *	-Don
 */

#include <stdio.h>

main()
{
 printf("%d\n", foo() + (foo()<<1) + (foo()<<2) + (foo()<<3));
}

foo()
{
 return(fork() ? 1 : 0);
}
```

Tom saved it. Tom restored it. Tom sent it back. That's the friendship — a race-condition joke
kept for four years and returned like a love letter, under a Proust subject line about
recharging temporary chickens.

Nobody ever graded the exam. The room finally took it, 39 years late:

[The fork() essay question — an answer key](../fork-essay-answer.md)

## let yr fingers do the talking (4 January 1992)

Chord keyboard controller advice — two considerations Tom learned the hard way:

1. **Timestamping** — most computers are bad at it; let the device do it (resolution and
  accuracy matter, units don't).
2. **Up vs down transitions** — release lag on physical contacts can reorder events relative to
  other keys; Tom's driver artificially delayed down transitions to match hardware up-delay
   until a class of typos vanished.

Signed `-t`. P.S.: "have you considered some sort of upper body harness? harder to show off on
the street but has more practical applications."

## Hal Abelson on Solaris (9 January 1992)

Tom forwards Fritz Mueller's forward of Hal Abelson on `unix-haters@life.ai.mit.edu`:

> I see (from reading this august list) that Sun has chosen the name "Solaris" for their new
> operating system.
>
> In Stanislaw Lem's novel of the same name, Solaris was an alien planet/intelligence that human
> explorers found to be utterly incomprehensible and psychologically devastating. Encounters with
> Solaris drove them to madness and death.
>
> I'm glad that someone at Sun is finally getting it right.
>
> -Hal

Tom's kind of forward. Don would have appreciated it then and quoted it for decades after.

---

*Source: Don Hopkins forwarded-mail archive. Tom's From lines: `lord@gnu.ai.mit.edu`, later
`gnu.ai.mit.edu!lord@cygnus.com` and `andrew.cmu.edu!lord+@cygnus.com` (bang paths routing his GNU
and CMU identities; the cygnus.com hop is mail routing, not an employer claim — Cygnus employment
came later, by 1993, when GEL was born there).*