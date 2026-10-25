# Emulation & Virtualization as Preservation Strategies (2015)

David S. H. Rosenthal, LOCKSS Program, Stanford University Libraries. A report for the Andrew W.
Mellon Foundation, October 2015. 37 pages.

**PDF:** [rosenthal-emulation-2015.pdf](rosenthal-emulation-2015.pdf), copied from the
[UNT Digital Library](https://digital.library.unt.edu/ark:/67531/metadc799755/m2/1/high_res_d/rosenthal-emulation-2015.pdf)
(ark:/67531/metadc799755) on 25 October 2026.

**License:** Copyright © 2015 Andrew W. Mellon Foundation, licensed under
[Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/),
as stated on its first page. Redistributed here unchanged under that license.

## What it says

Of the two basic digital preservation strategies, migration (converting files to current formats)
has been strongly favored over emulation (running the original software). The report argues that
web-based emulation frameworks, which make an emulator appear as an ordinary part of a web page,
removed the main barrier to emulation. Two barriers remain: the tools for creating preserved system
images are inadequate, and the legal basis for giving access to emulations is unclear, and highly
restrictive where it is clear.

It surveys the frameworks of the time (bwFLA, Olive at Carnegie Mellon, and the Internet Archive's
JSMESS and Emularity) and the collections built on them, follows how digital artefacts and
infrastructure changed over two decades, and ends with a ranked to-do list: standardize preserved
system images, how emulators obtain them and how emulations are exposed to readers; improve the
tools and metadata databases for preserving software; support emulators; and clarify the law.

## Two passages

From §2.3.2, *Internet Archive* (p. 10), with footnote 2:

> The Internet Archive's software collection currently holds nearly 36,000 items, including more
> than 7,300 for MS-DOS, 3,600 for Apple, 2,900 console games and 600 arcade games. Some can be
> downloaded, but most can only be streamed.
>
> The oldest is an emulation of a PDP-1 with a DEC 30 display running the Space War game from 1962
> [49], more than half a century ago. As I can testify having played this and similar games on
> Cambridge University's PDP-7 with a DEC 340 display seven years later, this emulation works well
> (Figure 13).²
>
> The quality of the others is mixed. Resources for QA and fixing problems are limited; with a
> collection this size problems are to be expected. Jason Scott crowdsources most of the QA; his
> method is to see if the software boots up and if so, put it up and wait to see whether visitors
> who remember it post comments identifying problems, or whether the copyright owner objects.
>
> ² The Computer History Museum has restored PDP-1 hardware [35] that runs Space War [12].

Reference [49] is the Archive's [Spacewar! for the PDP-1](https://archive.org/details/pdp1_spacewar).
The PDP-7 and 340 are the machine of
[My Introduction to Computer Graphics](https://blog.dshr.org/2026/07/my-introduction-to-computer-graphics.html),
and of Heinz Lemke's PIXIE, which now runs in the cabinet.

Later in §2.3.2, on sound, quoting Jason Scott:

> Sound has turned out to be one of the more difficult issues with JavaScript programs. Different
> browsers handle sound differently, and the human ear notices tiny differences in sound quality
> much more than they noticed microscopic slowdowns in video rendering. This is definitely on the
> list to be improved as soon as possible, as soon as we have the best solution in place.

The cabinet's [AM radio](../../../packages/cabinet/AM-RADIO.md) takes up that problem for the
PDP-7.

From §2.4.1, *Emulator Support* (p. 14):

> Jason Scott at the Internet Archive has been remarkably effective at encouraging emulator
> developers to work on problems relevant to preservation, but this is a personal rather than
> institutional effort. If emulation is to become a mainstream preservation technology some
> mechanism for commissioning fixes for critical problems from the emulation community will be
> needed.

The cabinet is one more result of that encouragement: Jason's answer about the Archive's Apple II
emulation in 2025 is what pointed Don toward emulation in the browser.

From §2.4.3, *Fidelity* (p. 15), on the same Spacewar emulation:

> The experience of pointing and clicking at the Internet Archive's web page, pressing LEFTCTRL and
> ENTER to start, watching a small patch in one window on your screen among many others, and
> controlling your spaceship from the keyboard is not the same as the original. That experience
> included loading the paper tape into the reader, entering the paper tape bootstrap from the
> switches, and pressing the Start switch (Figure 20). The program displayed on a large, round,
> flickering CRT.

He distinguishes execution fidelity, whether the emulation runs the program correctly, from
experiential fidelity, how close the user's experience is to the original user's.

## Sections

1. Introduction (history, terminology)
2. Looking backward: frameworks, collections, shared concerns
3. The last two decades of evolution: digital artefacts and infrastructure
4. Looking forward
5. Sustainability: emulators, frameworks, collections, business models
6. The to-do list (nine items, ranked)
7. Conclusion

## Why it's here

The PDP-7 cabinet is a browser emulator built on the path this report describes, and its notes
adopt lessons from the frameworks it surveys
([WEB-BENCH.md](../../../packages/cabinet/WEB-BENCH.md)). Its
[open letter to museums, libraries and archives](../../../packages/cabinet/FOR-MUSEUMS.md) takes up
the same questions: preserved system images, metadata, and access. The cabinet's
[portrait](../../../packages/cabinet/PORTRAIT.md), which plans to draw the PDP-7, the 340 and the
people at the console in 3D, is an attempt at the experiential fidelity §2.4.3 describes. And
§2.3.2 is where David described Jason Scott's work, years before introducing Don to him
([Jason Scott](../../jason-scott/README.md)).

↑ [David Rosenthal](../README.md)
