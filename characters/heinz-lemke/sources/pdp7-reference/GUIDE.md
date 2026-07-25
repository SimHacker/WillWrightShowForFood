# PIXIE's hardware — a student / hacker / turist guide

The machines behind the [PIXIE listing](../pixie-assembler-listing-1972/README.md): what a
PDP-7 is, how plugging in a device literally added instructions to it, why the Type 340
display is a second computer, and what Titan — the mainframe across the link — was. Written
for anyone spending precious time here; manuals are in [README.md](README.md).

## Why "turist"

Not a typo — a credential. **TURIST** is MIT AI Lab / ITS spelling: SIXBIT filenames held
six characters, so TOURIST lost its O and U and the Jargon File enshrined the result — a
guest on ITS, there to explore, welcome by default. ITS shipped with no passwords; the door
was open on purpose, and turists who behaved (and some who didn't) became hackers.

Don was a turist at MIT-AI, and testifies that **ITS was the first social network**:
`:WHOJ` showed who was on, `:SEND` fired a message onto someone's screen, `:RMAIL` read
your mail, `:UNTALK` chatted back and forth in split screen — and DDT incantations like
`DPTSTOK/-1 $$^X` let you reach into another user's running job and hack it live.
Presence, messaging, mail, chat, and writable-by-design shared state, a decade before
anyone said "social network."

This guide extends the same open door: a new generation of turists is invited to explore
and *run* this code — the PIXIE listing, the emulators, the light pen quest. The machines
are documented below; the door has no lock; try not to crash the PDP-7, and if you do,
write up what you learned.

## The machine you're visiting

The **DEC PDP-7** (1965): 18-bit words, 8K (here likely 16K) of core memory, ~1.75 µs cycle.
One accumulator, a link bit, 13-bit addressing with an indirect bit, and a 4-bit opcode —
which is why the whole memory-reference instruction set fits on an index card: `CAL DAC JMS DZM LAC XOR ADD TAD XCT ISZ AND SAD JMP`, plus operate-class micro-instructions (`CLA SZA SNA SKP CMA...`), `LAW`, the optional EAE, and `IOT`. That last one is the door everything
else walks through.

## How devices add instructions — electrically

Every word starting `70xxxx` is an **IOT** (Input/Output Transfer). The processor does not
know what any IOT does. It puts the instruction's device-select bits on the I/O bus, fires
up to three timed pulses, and whatever device recognizes its own select code acts: clear a
flag, gate data onto the bus, skip the next instruction if a flag is up. **Plug in a device
and its instructions start existing; unplug it and they become no-ops.**

The PIXIE listing shows the standard ones (display and light pen IOTs, `ION`/`IOF`) and a
set no DEC manual ever documented: **Wiseman's Titan link instructions.** The link-transfer
pages are full of `70xxxx` words with names like `LKEILLB6`, `LRB18ILLAM`, `LSA`, `LKD`,
`LCF` — Cambridge built a network interface, and the network interface added networking
*instructions* to the machine. When you see `JMS WAITLK` followed by a bare link IOT, you
are reading 1969 network driver code.

Same mechanism, other boxes:


| Device                                          | Instructions it adds                                                                                                                                        |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **EAE** (Extended Arithmetic Element, Type 177) | Multiply, divide, shifts, normalize — the `64xxxx` family (`LRS`, `LLS`, `GSM`... all over the listing). Without the cabinet, those words do nothing useful |
| **Type 370 light pen**                          | Pen flag skip/clear IOTs — pointing as an instruction                                                                                                       |
| **Titan link** (Cambridge custom)               | Read/write link words, status, control — networking as instructions                                                                                         |
| **x87 FPU** (1980, same trick reborn)           | 8086 reserved `ESC` opcodes it didn't decode; the 8087 watched the bus for them. Buy the chip, gain `FMUL`                                                  |
| **PDP-11 options** (FP11, KE11, CIS)            | DEC kept selling instructions in boxes for two more decades                                                                                                 |




## The display is a second computer

Beyond its IOTs, the **Type 340** fetches *display words* from the same core memory by DMA
(data break) and executes them itself: parameter words, point words, vector / vector-continue
/ increment words, character words (with the Type 342 Symbol Generator — 6-bit codes
expanding to stroke sequences), and — with the Type 347 option — `DJS`/`DJP`, **display
jump-to-subroutine**. A whole second instruction set cohabiting in memory, which is why
PIXIE's display files read like programs and its subpictures are display subroutines.

Myer & Sutherland formalized the consequence in 1968 as the **wheel of reincarnation**: give
a display a subroutine capability, then conditionals, then registers, and you've built
another computer — so you offload *its* display work to something simpler, and around the
wheel goes. The 340 is the canonical first turn; the modern GPU executing command buffers
(long literally called *display lists*) is the same wheel, many revolutions later. The IBM
System/360 channels — processors executing Channel Command Word programs from main memory,
contemporaries of the 340 — are the same idea at datacenter scale.

## Titan — the mainframe across the link

**What it was.** Cambridge's main computer between EDSAC 2 and Phoenix: the prototype
**Ferranti/ICT Atlas 2**, operational 1964 to 7 October 1973. Cambridge had £250,000;
an Atlas cost £2,000,000. Ferranti's Peter Hall offered the Atlas CPU at works cost, with
Cambridge designing the memory and peripheral coordinator — **David Wheeler** as design
authority, **Roger Needham** drawing the wiring diagrams *on EDSAC 2*. Ferranti's marketing
renamed it Atlas 2; in Cambridge the name Titan stuck.

**Architecture.** 48-bit words (addressable as eight 6-bit characters or two 24-bit
halfwords), core store grown 32K → 64K → 128K words. Atlas's famous one-level store
(paging + drum) was *removed* to save money: instead, base/limit relocation registers —
with the quirk that the user address was **OR**ed (not added) with the base, which made
memory allocation a puzzle. A tunnel-diode operand slave store makes Titan, by the
Cambridge Computing Society's account, the first computer with a cache. (The matching
instruction cache parity-faulted every five minutes; Barry Landy trapped the fault and
rewrote all of memory to flush it, and the system ran on with a net speedup.)

**Software adds instructions too.** The Atlas instruction had a 10-bit function field; with
the top bit set, the remaining bits selected one of up to 512 **extracodes** — instructions
implemented by supervisor code in main memory (fixed store on Atlas 1). File I/O, tape,
floating functions: all "instructions" that were really software. Note the symmetry with
the PDP-7 across the link: **one machine extends its instruction set with hardware (IOT),
the other with software (extracode)** — the two halves of PIXIE meet in the middle.

**The time-sharing story.** Titan was designed as a batch job shop. In 1965 Wilkes used
CTSS at MIT, demonstrated it in Cambridge over a transatlantic telex line at 10 characters
per second, and insisted the supervisor be redesigned mid-flight. The result — the **Titan
Supervisor / Cambridge Multiple-Access System**, by David Hartley, Roger Needham, Barry
Landy, David Barron and colleagues — went public on 22 March 1967 and is arguably the first
*commercially sold* time-sharing OS (CTSS and PLATO were one-offs). Detail for the credits
roll: **Steve Bourne wrote its editor** (the shell came later), **Sandy Fraser** built the
access control and file backup (then went to Bell Labs and invented cell networking), and
Needham's one-way-function password scheme — hash the password, store the hash — debuted
here before becoming universal practice.

**What hung off it.** Two Data Products 16M-word discs (the first a gift from Basil de
Ferranti) with fixed-head regions used as drums; magnetic tape decks; card and paper-tape
gear; a Cambridge-built 64-line terminal multiplexor (73 terminals registered, 26
simultaneous); from 1967, modems; the One-Mile Radio Telescope's inverse Fourier transforms
(Ryle's Nobel data) as the big batch customer; and — via **Wiseman's high-speed data link**,
with link software by **Charles Lang** (C.A. Lang) of the CAD group — the PDP-7 + Type 340 running
PIXIE. Heinz: *"I used this link for about 3 years on a daily basis (actually nightly
basis) connecting PIXIE with some application programs on Titan."* Lang's own
**2 Dec 1965** supervisor plan for that software —
[Planning Document 10](cambridge-supervisor/pd10-titan-pdp7-link.md)
([CUCPS](https://cucps.soc.srcf.net/titan/supplan/pd10.htm); found in the Facebook
thread by Ric Werme) — specifies Titan-as-master core transfers, Project MAC–style
**Attentions** (light-pen / display events queued on the PDP-7), disk access via a
Titan peer program, and a **second teletype** on the Multiplexer rather than one
shared TTY. That last item is the blueprint for the two-chair workflow in Heinz's
thesis Figs 8.6/8.7.

**The application link protocol is in the listing.** `/LINK TRANSFER ROUTINE FOR PIXIE (PDP7-TITAN)`:
data moves in "blocklets" with headers, word counts and checksums; a retry loop ("try again
if header format wrong"); error exits for checksum failure, oversize files, and "not PIXIE
data"; and a relocation pass that fixes up ring-structure pointers after transfer (Titan →
PDP only). Serialized structured data feeding local interactive feedback — the
browser/server split, the NeWS split, AJAX — in 1969, over a homemade link, between a
mainframe with software instructions and a minicomputer with hardware ones.

**Afterlife.** ICT's unsold third Atlas 2 became the founding machine of the **CADCentre**
in Cambridge, running the Cambridge Supervisor — UK CAD industrialized directly out of this
lab. Titan's successor Phoenix (IBM 370/165) arrived 1972; Titan switched off October 1973.

## Emulation status — and what you actually need

- **PDP-7 + Type 340: emulated today.** [Open SIMH](https://github.com/open-simh/simh) has
the PDP-7 with 340 display support, built on the shared display library that already
carries light-pen plumbing from the PDP-1 side. The missing piece is the **virtual Type
370 light pen driver** — mission brief in [README.md](README.md).
- **Titan: no emulator exists.** The Computer Conservation Society preserves two **Atlas 1**
emulators, but Atlas 2/Titan (different memory system, extracodes in main store) has
none. Documentation survives: the [CUCPS Titan archive](https://cucps.soc.srcf.net/titan/)
has supervisor planning documents and the machine-code programming manual.
- **The good news: PIXIE doesn't need Titan.** The listing is the PDP-7 side, complete. For
a live demo, the link can idle — or a small mock peer can speak the blocklet protocol
(header, word count, checksum, `PXID` magic word: it's all transcribed) and answer as a
pocket Titan. A Titan emulator is a magnificent open quest, but it is not on the critical
path to clicking a 1969 radial menu.

The concrete plan — SIMH lab bench, browser bench in SvelteKit, and a shared high-level
Titan protocol service speaking blocklets over a socket — lives in
[EMULATION-PLAN.md](EMULATION-PLAN.md); the link protocol itself, decoded word by word
from the listing, in [TITAN-LINK-PROTOCOL.md](TITAN-LINK-PROTOCOL.md).



## Further reading

- Barry Landy, *[Atlas 2 at Cambridge Mathematical Laboratory (and Aldermaston and CAD Centre)](https://curation.cs.manchester.ac.uk/atlas/docs/Atlas2%20Barry%20Final%2014th%20December.pdf)* — the insider memoir most of the Titan section above draws on
- [CUCPS Titan archive](https://cucps.soc.srcf.net/titan/) — supervisor planning docs, programming manual, by permission of Landy/Needham/Hartley
- [Titan (1963 computer), Wikipedia](https://en.wikipedia.org/wiki/Titan_(1963_computer))
- [Computer Conservation Society software & emulators](https://computerconservationsociety.org/software/software-index.htm) — the Atlas 1 emulators
- Myer & Sutherland, *On the Design of Display Processors* (CACM, 1968) — the wheel of reincarnation
- [Type 340 Precision Incremental Display, Computer History Wiki](https://gunkies.org/wiki/Type_340_Precision_Incremental_Display)

↑ [reference library](README.md) · [PIXIE listing](../pixie-assembler-listing-1972/README.md) · [transcription report](../pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md) · [character README](../../README.md)