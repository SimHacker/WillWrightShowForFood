# pdp-7

The Korz PDP-7. Sibling of [apple2](../apple2/).

The note for David Ungar, Randall Smith, Alan Kay, Lars Brinkhoff and the SIMH authors, including
the 18-bit line (PDP-4, 7, 9, 15) as one Korz dimension, is
[KORZ-MACHINES.md](../../../KORZ-MACHINES.md).

The running code is still in the parent directory, and moves here when a change touches it:

- [pdp7.ts](../pdp7.ts): the machine as slots
- [compile7.ts](../compile7.ts): compiled blocks
- [pdp7.test.ts](../pdp7.test.ts): lockstep against the oracle
- [plugins/pdp7.ts](../../plugins/pdp7.ts): the SIMH-style oracle
