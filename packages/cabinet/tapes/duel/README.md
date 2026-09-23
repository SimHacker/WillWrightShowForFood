# DUEL, DECUS 7-40

A two-player space duel for the PDP-7 and Type 340 display, written by
Peterson and Viner at the Cambridge Mathematical Laboratory and
distributed by DECUS in June 1968: the lab, and the kind of machine,
that SYMELEC was written for four years later.

The binary tape survived at the University of Oslo, among the PDP-7
tapes read in 2026 ([thread](https://forum.vcfed.org/index.php?threads/university-of-oslo-pdp7-paper-tapes-vs.1257172/),
[archive](https://archive.org/details/oslo-pdp-7)). It is in DEC's
FunnyFormat, with its own loader on the front, and no symbols.

The files here are from Lars Brinkhoff's
[PDP-9/DUEL](https://github.com/PDP-9/DUEL) repository:

- `rim.pt`: a RIM loader, entered by hardware read-in at 17763.
- `duel.pt`: the DUEL tape. The RIM loader reads the FunnyFormat loader
  off its front, and that loader reads the rest.

Frode van der Meeren worked out how to run it under SIMH: load to 646,
then five words that restart the display from the clock interrupt,
since SIMH's timing does not suit the original wait loop. The cabinet
loads the same way, with the same five words:

| Address | Word | |
|---|---|---|
| 1446 | 700606 | IDLA |
| 1447 | 201650 | LAC 1650 |
| 1467 | 604002 | JMP 4002 |
| 4002 | 777776 | clock preset |
| 4006 | 604006 | JMP 4006 |

## Controls

Ten of the eighteen console switches. A switch is active when it is
**down** (0); DUEL starts with all eighteen up. Bit 0 is the leftmost.

| Left player | Switch | Right player | Switch |
|---|---|---|---|
| turn left | 0 | turn left | 13 |
| turn right | 1 | turn right | 14 |
| thrust back | 2 | thrust back | 15 |
| thrust forward | 3 | thrust forward | 16 |
| fire | 4 | fire | 17 |

When a round ends the machine halts at 721; start again at 4000.

↑ [cabinet README](../../README.md)
