# Ideas to explore with Phil Budne 🖥️

*Conversation hooks for a Repo Show: topics Don would like to follow with Phil, each grounded in
Phil's public work and documented connections to this repository. Not quotes, not claims about
what he thinks.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest · consent not_asked

## What Phil has done

Wrote SIMH's simulator-independent Type 340 display processor and maintained its XY display
model; helped bring PDP-7 UNIX back from scanned listings (kernel typed in, disk layout worked
out, a shell, `ls` and a bootstrap written in PDP-7 assembler) and resurrected TMG; maintains
CSNOBOL4. Before that: DEC's FORTRAN-10/20 team and the SAFE RISC project, BU's Distributed
Systems Group, Shiva's router firmware. See [README](README.md) and [CHARACTER.yml](CHARACTER.yml).

## The hooks

### 1. The 340 as its own machine

His `type340.c` models the display processor itself, not one host's interface to it, which is
why it served the PDP-6/10 first and the PDP-7 later, and why Cabinet could port it to
TypeScript. Where did that boundary come from (the VT11 simulator, 2003)? What did he leave
out, and what would he model now? Show him Cabinet's 340 running PIXIE, Mitch's Forth and the
Ultimate Hand, and ask what looks wrong.

### 2. PDP-7 UNIX, booted in a browser

The `pdp7-unix` restoration boots in Cabinet off an emulated RB09 disk
([systems/pdp-7-unix](https://hyperties.org/cabinet/systems/pdp-7-unix/)). Walk through it
with one of the people who typed it in: what the listings got wrong, how the disk layout was
found, what writing a shell for a system with no shell felt like.

### 3. TMG and the languages before C

TMG built early UNIX's languages. What did it take to resurrect it, and could it run in
Cabinet next to the Forth?

### 4. SNOBOL patterns

CSNOBOL4 and spipatjs: patterns as first-class values, decades before regex engines caught
up. A short segment: one SNOBOL pattern, shown in C, in JavaScript, and on the page.

### 5. DEC's Large Computer Group

FORTRAN-10/20 extended addressing; SAFE, which begat PRISM, which begat Alpha. A first-hand
account of 36-bit DEC in the early 1980s, which connects to Lars Brinkhoff's ITS thread.

### 6. 1986 to now: the lists

The 1986 FIGIL request for an Apple IIe Forth ([source](sources/1986-09-figil-apple-forth.md)),
Rick Adams's FTP in 1990, and his 2026 TUHS question about the VAX-11/780's time-of-year
clock ([source](sources/2026-05-tuhs-toy-clock.md)). Forty years of mailing-list systems
craft, and what the lists did for people working in public.

### 7. Shiva and the protocol zoo

ShivOS carried AppleTalk, IP, IPX, DECnet and SLIP in one firmware. How he layered it, and what
he'd keep.

### 7a. ITS tourists

He was BUDD on ITS, "a typo that stuck"; Don was A2DEH on MC. His finger page keeps MC's last
days ("The ITS machines are being shut down"). Finger, Fido, WHOIS: the small, friendly town
the net was, and what the ITS tools taught Unix. With Lars, who boots ITS again.

### 7b. SAFE, PRISM, Alpha

He wrote the code scheduler for VAST, the VAX to SAFE Translator, on Alan Kotok's 64-bit RISC
project, before it became PRISM and, some say, Alpha ("Almost eXactly Prism"). Kotok signed
his 36-bit anniversary booklet. The PDP-1 and Spacewar connect Kotok to the 340.

### 7c. One display simulator, three displays

`display.c` drives the PDP-1 Type 30, the VT11 and the 340. Cabinet ported the 340 path. Would
the Type 30 and Spacewar be the next thing to bring to the browser?

### 8. Lost causes

His home page files XY display simulation, SNOBOL4, LIL, Finger and the PDP-10 under "The
outmoded, the ill-fated, the overlooked, the doomed, and other lost causes", next to airships
and flying boats. Cabinet is a museum of lost causes that run. Ask him which one he'd bring
back next, and whether Cabinet's terminals should click like his VT52 sound file.

### 9. The Apple II Forth he asked for in 1986

Don's own Apple II Forth boots in Cabinet. Forty years late, here's an answer to the FIGIL
request.

## Format

Async suits him as it suits Lars: a recorded walk through Cabinet's 340 with comments on the
[SIMH source map](../../packages/cabinet/SIMH-MAP.md), or written answers. Pair segments with
[Lars Brinkhoff](../lars-brinkhoff/README.md) (the PDP-7 glue) and
[Bob Supnik](../bob-supnik/README.md) (the CPU).

↑ [Phil Budne](README.md)
