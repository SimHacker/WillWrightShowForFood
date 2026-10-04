# Titan, the mainframe across the link

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

## Status

- **Done:** the link protocol decoded from the listing ([TITAN-LINK-PROTOCOL.md](TITAN-LINK-PROTOCOL.md));
  tiny-titan, a stand-in that speaks blocklets and receives PIXIE's drawings
  ([TINY-TITAN.md](../TINY-TITAN.md)).
- **Could:** a Titan emulator (no one has one; the Atlas 1 emulators are a start, the CUCPS
  archive has the manuals); the Titan-side application programs PIXIE talked to, rebuilt from
  the thesis.

↑ [GUIDE](GUIDE.md) · [reference library](README.md)
