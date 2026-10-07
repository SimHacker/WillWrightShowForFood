# CAM-8: a computer architecture based on cellular automata (Margolus, 1993), summarised

Norman Margolus, MIT Laboratory for Computer Science, Information Mechanics Group, 15 December
1993. ARPA grant N0014-89-J-1988. 10 pages. [PDF, cached](cam8.pdf) ·
[original](https://people.csail.mit.edu/nhm/cam8.pdf).

## The argument

The densest computation physics allows has to be spatially local, like physical law, and
uniform local computation is a cellular automaton. Ordinary computers run CA badly, which
discourages CA models. CAM-8 rearranges the hardware of a low-end workstation into a CA
multiprocessor that, in 1993, matched any supercomputer on large CA problems and scaled by orders
of magnitude, as a step toward fully parallel CA hardware.

## The machine

- **Modules, time-shared over space.** Each module is one processor that sweeps its chunk of
  space (up to millions of sites) in a fixed scan order, one site per clock: an assembly line,
  not a processor per cell. Modules form a 3D mesh that can be extended indefinitely, with one wire
  per bit-slice to each of six neighbours. A tree network connects them to the host workstation.
- **Lockstep and pipelined.** Every module holds the same step program and runs in lockstep, so
  computation and inter-module communication pipeline together. The host broadcasts the next
  step's parameters and reads back analysis data while the current scan runs.
- **DRAM bit-slices.** Site data lives in ordinary DRAM, scanned predictably at 100% of its
  bandwidth. Each DRAM chip is one bit-slice with its own address counter; one bit from every
  slice makes a hardware cell. **Data moves by changing the relative scan offset of a bit-slice**,
  not by copying.
- **Update by lookup.** Each hardware cell's bits go through an SRAM lookup table and back to where
  they came from. Tables are double-buffered so the host loads the next while the current runs;
  there is provision for pipelined logic in place of tables, and for external data and analysis
  hardware.
- **Prototype, 8 modules:** 25 MHz, 64 MB DRAM, 2 MB SRAM, about 2 million gates in 1.2 µm CMOS.
  At 1 bit per site, about 3 billion site updates a second on up to half a billion sites; at 16
  bits per site, about 200 million a second on 32 million sites. It drives a real-time video
  display and accepts camera input.

## The programmer's model

Programmable: number of dimensions; size and shape of the space (periodic in every dimension);
bits per site; initial state; directions and distances of data movement; and the rules for
data interaction. All can change from step to step at negligible cost.

- **No fixed neighbourhoods.** Earlier CAMs limited what a site could see. CAM-8 follows lattice
  gases instead: **bit-fields** (a bit at every site, a bit-plane in 2D) are **shifted uniformly**
  ("kicked") across space, each in one direction, and the bits that land at a site interact there.
  Sending data two ways means the interaction makes two copies. A shift can be as large as a whole
  module's sector, thousands of sites in 2D.
- **16-bit events.** In the prototype, 16 bit-fields move independently and 16 bits interact per
  lookup. A rule over more bits is composed as a sequence of 16-bit events: a **space-time event
  program**.

## What it was used for

- **Lattice gases**, the machine's heart: FHP 7-bit gas at 382 M updates/s (vortex streets on 2K×1K,
  a Kelvin–Helmholtz instability on 4K×2K); Rayleigh–Bénard convection with a 13-bit, 3-speed
  hexagonal gas (191 M/s); a 24-particle 3D FCHC gas (7 M/s). Jeff Yepez's geophysics group at
  Phillips Laboratory, Bruce Boghosian, Dan Rothman.
- **Measurement in hardware.** Event counters bin and count functions of the state; space and time
  averages, correlations, autocorrelation against a shifted copy, block-spin renormalisation.
- **Statistical mechanics**: high-quality random bits from large random shifts of randomly filled
  bit-fields; 3D thermalised annealing at 200 M/s on 16 M 16-bit sites, ray-traced as part of the
  dynamics; **DLA** on 1024² at 800 M/s, more than a hundred times what CAM-6 could do; Bar-Yam's
  polymer model; Griffeath's 11×11 voting rules (363 bits, about 70 composed steps); Creutz's Ising
  model at 3 billion updates a second.
- **Image processing**: real-time video; rotating a 512² bitmap through any angle in under 10 ms by
  permuting pixels; 3D rotations of MRI data in three scans; rendering by simulated photons; stereo
  pairs.
- **Spacetime circuitry**: simulate logic as a sea of gates with routing bits at each site, then add
  a dimension that holds the circuit as a pipeline evaluated once per stage, so a whole clock cycle
  of a logic circuit takes one scan.

## Software

- The software was written first, driving gate-level simulations of the chip, so it ran the real
  hardware on arrival.
- **A machine language at a clean boundary.** Figure 8's HPP gas is a rule (`define-rule`) plus a
  step (`define-step`: load the table, set data paths, kick four fields one site each way, run),
  about a dozen machine instructions, and it runs unchanged on any number of modules.
- **Zero-module scalability**: a software simulator of that machine language on a SPARCstation ran
  CA as fast as the best dedicated simulators. Margolus proposes the CAM-8 machine model as a
  standard for CA work.
- Libraries specialise CAM-8 to run CAM-6-style neighbourhoods. Wanted: compilers that split
  many-bit rules into 16-bit events, compilers for spacetime circuitry, arithmetic, and debugging
  tools.

## Why it matters here

It is the design target for a new CAM engine: CAM-6's neighbourhoods become a library over
CAM-8's bit-fields, kicks and lookups, and "zero-module scalability" is exactly what a browser
engine needs. Plan stub: [cabinet TODO](../../../packages/cabinet/TODO.md).
