# Mapping one machine's memory into another's

The cabinet's promise is that "every machine can see every other
machine" ([MANIFESTO.md](MANIFESTO.md#every-machine-can-see-every-other-machine)):
segments, maps and locks managed by tiny-titan
([TINY-TITAN.md](TINY-TITAN.md#what-it-could-do)). It turns out MIT's AI
Lab built exactly that, in hardware, in the 1970s, and used it for years:
a PDP-10 timesharing job could map the memory of a PDP-11, a Lisp
Machine or a chess machine into its own address space and poke it. This
document is that history, from the surviving sources, and then the design
it gives us. The CPU it runs on is in [PDP10.md](PDP10.md).

## The Rubin 10/11 interface

David Moon, who maintained it
([Hardware info](https://github.com/PDP-10/its/wiki/Hardware-info-from-David-Moon)):

> MIT-AI also had a device, which was heavily used for many years
> although it never worked reliably, that mapped portions of the pdp10's
> address space into eight pdp-11 Unibuses. The pdp-11's in question
> (they weren't all real pdp-11's; one was a Lisp machine and one was a
> Chess machine) were scattered around the lab; some were I/O controllers
> for the pdp-10, while others were independent machines that just used
> this device as a high-speed link to the timesharing system. The effect
> of this hardware was to make pdp-11 memory look like extremely slow
> pdp-10 memory with the right-hand 4 bits of each word missing. A user
> program in the timesharing system could issue a system call to map an
> arbitrary portion of an arbitrary pdp-11's memory into its virtual
> address space and could then do whatever it wanted to it. These
> references were mapped through the usual virtual-to-physical page map
> and then again through a pdp-10-physical to pdp-11-physical page map
> located inside the 10/11 interface device.

**Two maps.** A job's virtual address goes through the ITS pager to a
PDP-10 physical address, and if that lands in the interface's range, a
second map turns it into a machine number and a PDP-11 address. Protection
lives in both.

### The map word

The system call is `T11MP`, documented in ITS's
[`_calls`](https://github.com/PDP-10/its/blob/master/doc/sysdoc/_calls.127):
the first argument is a page of the job's address space, the second a
map word. The interface owns physical memory `3,,0`–`3,,777777`, 256
pages of 1024 words, and its map is 256 words at `3,,776000`. Bits in ITS
notation (4.9 is the top bit, 1.1 the bottom):

| Bits | Field | SIMH ([ka10_ten11.c](https://github.com/simh/simh/blob/master/PDP10/ka10_ten11.c)) |
|---|---|---|
| 4.9 | valid | `T11VALID 0400000000000` |
| 4.8 | write allowed | `T11WRITE 0200000000000` |
| 4.2–3.9 | which PDP-11, 0–7 | `T11PDP11 0003400000000` |
| 3.8–2.2 | relocation: PDP-11 byte address ÷ 4 | `T11ADDR 0000377776000` |
| 2.1–1.1 | protection: a limit on the offset within the page | `T11LIMIT 01777` |

### Packing two widths

A PDP-11 word is 16 bits; a PDP-10 word is 36. One PDP-10 word holds
two PDP-11 words, left-justified, and the bottom four bits read as zero.
SIMH: `data = word0 << 20 | word1 << 4`, from PDP-11 address
`(relocation + offset) × 4`.

- **Writes can spare a half.** The four spare bits were put to work: on
  a write, bit 1.4 set leaves PDP-11 word 0 unchanged and bit 1.3 leaves
  word 1. A PDP-10 can store one PDP-11 word without a read-modify-write
  across a slow, unreliable cable.
- **Bytes come out in the order 1, 0, 3, 2.** A PDP-10 byte pointer reads
  left to right; a PDP-11 keeps the low-addressed byte in the low half of
  each word. So `ILDB` with 8-bit bytes works, and `_calls` documents
  the order rather than hiding it.

### What was on the other end

`_calls` lists them as of 4/2/76, with two added later:

| # | Machine |
|---|---|
| 0 | the Knight TV system ("TV IS PDP-11 NUMBER 0", [tv.147](https://github.com/PDP-10/its/blob/master/src/system/tv.147)) |
| 1 | the XGP, the Xerox Graphics Printer |
| 2 | the Lisp Machine, through a GT40 |
| 3 | the chess machine, "not really a pdp11" |
| 4 | the Logo 11/45 |
| 5 | Micro-Automation (robotics) 11/45 |
| 6 | vision, an 11/40 (later) |
| 7 | the Chaosnet interface 11 (later) |

### The door and the elevator

The best-documented use is also the silliest, which is why everyone
remembers it. On a Lisp Machine, Terminal-D buzzed the ninth-floor door
of 545 Technology Square and Terminal-E called the elevator. The whole
path survives:

1. The Lisp Machine's `CALL-ELEVATOR`
   ([chsaux.112](https://github.com/PDP-10/its-vault/blob/master/files/lmio/chsaux.112))
   looks up its own console's floor. On 8 or 9 it calls `HACK-DOOR`;
   anywhere else, `"I don't know how to get an elevator to your location."`
   `BUZZ-DOOR` works only from the ninth floor.
2. `HACK-DOOR` opens a Chaosnet connection to MIT-AI, service `DOOR`.
3. The `DOOR` server on AI, [door.1](https://github.com/PDP-10/its/blob/master/src/lmio1/door.1),
   calls `T11MP` with `3_34.+0_26.+<764050/4>_10.+0`: valid and
   writable, PDP-11 number 0, relocation `764050/4`. That maps the Knight
   TV system's keyboard multiplexer status register into the server's
   own address space at `100000`.
4. It sets a bit, waits, and clears it:

   | Bit | Wired to | Held |
   |---|---|---|
   | 8 | call the elevator to floor 8 | about ⅓ s |
   | 9 | call the elevator to floor 9 | about ⅓ s |
   | 10 | spare | |
   | 11 | buzz the ninth-floor door | 3 s |
   | 12, 13 | video hardcopy sources | |

The TV-11 did the same thing itself for Knight TV users: `Escape D` and
`Escape E` in tv.147, "ELEVATOR CODE 2/13/79 BY DANNY & HIC", with a
table from keyboard number to floor.

So a building's door was one bit in a PDP-11 device register, on a
second machine, reached by a third machine through a network service on a
fourth, which mapped that register into a user program as an ordinary
memory word. Nobody wrote a door driver. They wrote a store.

## Other shared memory in the same family

- **The PDP-6 slave.** MIT-AI kept its PDP-6 running beside the KA10,
  sharing memory with it, with interrupts between the processors. SIMH
  models it in [pdp6_slave.c](https://github.com/simh/simh/blob/master/PDP10/pdp6_slave.c),
  and in [ka10_auxcpu.c](https://github.com/simh/simh/blob/master/PDP10/ka10_auxcpu.c),
  an auxiliary processor by shared memory and inter-processor interrupts.
  Moon notes that on one machine "a pdp6 involved, which had its own idea
  of the meanings of some of the memory bus lines".
- **KL-UDGE.** MIT-MC's homebrew box beside the KL10: the IMP interface
  to the ARPANET, a calendar clock, a 60 Hz interrupt and 36 programmable
  console lights ([PDP-10/its#622](https://github.com/PDP-10/its/issues/622)).
  It is an I/O box, not a pager or a memory map, but it is the same habit:
  when the machine lacked something, MIT wire-wrapped it.

## BIBOP: the type is in the address

MACLISP's storage was a **Big Bag Of Pages**: each block of memory holds
objects of one type, and a table indexed by block number says which. The
definitions are in [defns.240](https://github.com/PDP-10/its/blob/master/src/l/defns.240),
"DEFINITIONS OF BIBOP TYPE BITS FOR USE IN THE SEGMENT TABLE" (`ST.LS`
list, `ST.FX` fixnum, `ST.FL` flonum, `ST.SY` symbol, …), and the type
test is the `SKOTT` macro, four instructions:

```
HRRZ TT,X          ; the pointer
LSH  TT,-SEGLOG    ; its segment number
MOVE TT,ST(TT)     ; the segment table entry
TLNN TT,type       ; is it this type?
```

Pointers stay a full 18 bits, so a cons is one 36-bit word, car in the
left half and cdr in the right, with no tag bits. And the test reads the
table, never the object, so it does not touch the object's page. The
table is a map like the pager's, but it answers a different question:
the pager says where a page is and who may touch it; BIBOP says what
lives there. MACLISP's segment size need not be the pager's page size.

The idea outlived MACLISP: deriving an object's properties from the
block that contains it is how many allocators and garbage collectors
find an object's size class or type today.

## What the cabinet takes from this

The tiny-titan design already has segments, maps (a segment mapped into a
VM at an address, read-write or read-only) and locks
([TINY-TITAN.md](TINY-TITAN.md#what-it-could-do)), and
[DESIGN.md](DESIGN.md#the-application-layer--packagespixie-separate-module)
says the PDP-7 needs "a window map in `Pdp7.read`/`write`". The 10/11
interface fills in what those plans left open.

### A map entry is the 10/11's map word

```ts
type MapEntry = {
  valid: boolean;
  write: boolean;
  machine: string;    // which VM on the backplane: the 10/11's 3-bit number, by name
  base: number;       // relocation: the first word in the other machine
  limit: number;      // words visible through this entry
  packing: Packing;   // how the two word sizes meet
};
```

Each VM keeps a table of these, one per page or window, and its `read`
and `write` consult it before core. It is the second of Moon's two maps:
a PDP-10's own pager runs first, and the cabinet's map turns the physical
address into another machine's word. On the PDP-7, which has no pager,
it is the only map.

### Packing rules

The 10/11 had one rule, 16 into 36. The cabinet has more word sizes, and
each pair needs a rule that loses nothing it can avoid losing:

| From → into | Rule |
|---|---|
| same width | one word for one word |
| 18 → 36 (PDP-7 or PDP-1 core in a PDP-10) | two 18-bit words per PDP-10 word, `left,,right`. Nothing is lost, and half-word instructions (`HLRZ`, `HRRM`) address each PDP-7 word directly. |
| 36 → 18 (a PDP-10 page in a PDP-7) | each PDP-10 word appears as two PDP-7 words, left half first |
| 16 → 36 (a PDP-11) | the 10/11 rule: two words left-justified, low four bits zero, bits 1.4 and 1.3 spare a half on write |
| 8 → 18 or 36 (an Apple ][) | a byte per word, or packed and documented like the 10/11's byte order |

### `MemoryPort` is already the adapter

The Turing engine runs over a `MemoryPort { read, write }` and a
`TmShape` ([turing.ts](src/plugins/turing.ts),
[TURING-ENGINE.md](TURING-ENGINE.md)). A map entry with a packing rule
*is* a `MemoryPort` from one machine's words onto another's. So the same
engine can run on a PDP-10 over a tape that lives in a PDP-7's core, or a
PDP-7 Forth can watch a tape the PDP-10 is writing.

### Device registers are memory too

The door bit was a device register reached through the map. The cabinet
can do the same: a map entry whose target is a device rather than a core
segment. The Ultimate Machine's switch and lid ([TEACHING.md](TEACHING.md#the-simplest-device-device-56-registers-and-iots))
could appear as a word in a PDP-10 job, which could then turn the machine
on, and watch the arm come out and turn it off, with a store and a load.

### Locks

Both machines lock the same way. ITS's convention is a word holding −1
when free, taken with `AOSE` (add one, skip if the result is zero); the
PDP-7 locks in [DESIGN.md](DESIGN.md#the-application-layer--packagespixie-separate-module)
use `ISZ` on `777777`, the same idea in 18 bits. Across a packing rule
the words differ in width, so a shared lock lives in one machine's word,
and the backplane, which steps every machine in one thread, keeps the
increment and the test indivisible.

### Unlike the original

The 10/11 interface "never worked reliably", and SIMH's model talks to
separate PDP-11 emulators over a network socket. Here every machine is
in one process, so the map is a function call, and a debugger can show
both ends of a mapped word at once.

## Sources

- David Moon, [Hardware info](https://github.com/PDP-10/its/wiki/Hardware-info-from-David-Moon).
- ITS: [`_calls`](https://github.com/PDP-10/its/blob/master/doc/sysdoc/_calls.127)
  (`T11MP`), [door.1](https://github.com/PDP-10/its/blob/master/src/lmio1/door.1),
  [tv.147](https://github.com/PDP-10/its/blob/master/src/system/tv.147),
  [defns.240](https://github.com/PDP-10/its/blob/master/src/l/defns.240).
- Lisp Machine: [chsaux.112](https://github.com/PDP-10/its-vault/blob/master/files/lmio/chsaux.112).
- SIMH: [ka10_ten11.c](https://github.com/simh/simh/blob/master/PDP10/ka10_ten11.c)
  (Lars Brinkhoff), [pdp6_slave.c](https://github.com/simh/simh/blob/master/PDP10/pdp6_slave.c),
  [ka10_auxcpu.c](https://github.com/simh/simh/blob/master/PDP10/ka10_auxcpu.c).
- [KL-UDGE](https://github.com/PDP-10/its/issues/622).
- Richard Greenblatt, [Running ITS on the KL-10](https://gunkies.org/wiki/Running_ITS_(the_Incompatible_Timesharing_System)_on_the_KL-10).
