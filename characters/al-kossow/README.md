# Al Kossow 💾

Invitation portrayal — **not** Al Kossow. [Standards](../../schemas/portrayal-standards.md)

**Field:** computer history, software preservation, reading old media

[Invitation](invitation.md) · [Hooks](ideas.md) · [Sources](CHARACTER.yml)

## Who he is

Al Kossow created [bitsavers](http://bitsavers.org/), one of the largest online archives of
documentation and software for historic computers: manuals, schematics, listings, and the bits
read off old tapes and disks. In July 2006 the Computer History Museum named him its Robert N.
Miner Software Curator, responsible for the growth and preservation of its software collection
([CHM press release](https://computerhistory.org/press-releases/robert-n-miner-software-curator-named-for-computer-history-museum/)).
Before that he was a senior software engineer at Apple from 1986 to 2005, working on interactive
graphics, operating systems, real-time control, and as software liaison to CPU vendors, and a
long-time museum volunteer on the team that restored its PDP-1. In 2007 he became chairman of the
museum's Software Preservation Group
([SCC announcement](https://softwarepreservation.computerhistory.org/scc_active/2007-May/001051.html)).

## Why he's here

Much of this repository stands on bitsavers. The [cabinet](../../packages/cabinet/README.md), the
PDP-7 and Type 340 emulator that runs in a web page, was built from the DEC manuals Al scanned: the
340 Display Programming Manual, the PDP-7 instruction list, the MACRO-9 manual, and the MIT AI memos
behind the Logo turtle. About forty files here cite bitsavers.

He also reads tapes nobody else can. In November 2023 he read 1/4-inch Sun cartridge tapes from the
Turing Institute in Glasgow, where Don worked with [Arthur van Hoff](../arthur-van-hoff/README.md)
on HyperNeWS and HyperLook in the early 1990s. One came back as a tar file; another was a raw dump in
SunOS's `bar` format, which Al identified ("it came with sunos 4"). Among what came back was the
VideoPIX frame-grabber library Don wrote at the Institute, and a frame it had captured: the view
out of the Institute's window onto the corner of North Frederick Street and George Street.

The `bar` tape is why this repository now has [`@wwsff/sunos-bar`](../../packages/sunos-bar/README.md),
a TypeScript reader for bar archives. It reads all 1,130 entries of that tape, decompresses
`compress(1)` files, and found and worked around the one block the dump had lost.

## Connections

- [David Rosenthal](../david-rosenthal/README.md): emulation and preservation; David's 2015 report
  for the Mellon Foundation on emulation as a preservation strategy, and his story of the Cambridge
  PDP-7, which led to the cabinet.
- [Jason Scott](../jason-scott/README.md) and [Brewster Kahle](../brewster-kahle/README.md): the
  Internet Archive, where much of what bitsavers holds is mirrored.
- [Bruce Tognazzini](../bruce-tognazzini/README.md): Don asked Al and Arthur for advice on
  preserving asktog.com.
- [Lars Brinkhoff](../lars-brinkhoff/README.md): ITS and PDP-10 restoration, which leans on the same
  scans.

↑ [characters](../README.md)
