# The 29 state rule, hands on: construction, signal crossing, auto-initialization

**Source:** Don Hopkins on Hacker News, on the *Von Neumann Universal Constructor* thread
(Mar 2020): [22737079](https://news.ycombinator.com/item?id=22737079) (the wall of text with
"inscrutable ascii graphics") and [22738598](https://news.ycombinator.com/item?id=22738598)
(the Buckley walkthrough). The hard-to-find companion text is William R. Buckley's paper.

**The paper:** "Signal crossing solutions in von Neumann self-replicating cellular automata",
pp. 453-503 of the Automata-2008 proceedings. The Wikipedia citation link is broken; working
copies:

- [donhopkins.com/home/documents/automata2008reducedsize.pdf](https://donhopkins.com/home/documents/automata2008reducedsize.pdf) (fast)
- [archive.org mirror of the original](https://web.archive.org/web/20081209155223/https://uncomp.uwe.ac.uk/free-books/automata2008reducedsize.pdf)

It has a great nuts-and-bolts explanation of how John von Neumann's 29 state rule and his
universal constructor work: basic building blocks, reusable components, higher level machines,
programming techniques, data representation and coding, and overall architecture.

## Don's implementations

- **CAM6 (JavaScript):**
  [github.com/SimHacker/CAM6](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js)
  -- based on older "jvn" C code by R. Nobili and U. Pesavento, rewritten to be symbolic and
  self documenting, with evocative names like `pointedToByExcitedOrdinaryOrSpecial` and
  `wellFlankedByExcitedNotNextExcitedConfluent`.
- **OpenLaszlo (2005, Flash, pie menu editing):** archived at
  [John von Neumann's 29 state Cellular Automata Implemented in OpenLaszlo](https://web.archive.org/web/20110720235050/https://www.donhopkins.com/drupal/node/22)
  -- "It can't run a lot of cells at once, but at least it's slow enough to watch it compute.
  Don't worry: there's not space for it to reproduce!"

## Constructing cells: the construction arm

You can only construct non-excited cells -- you'd get electrocuted if you tried to construct
machines with the power on, so to speak. You send bit sequences down a wire to an arrow
pointing into empty space; intermediate "Sensitized" states huffman-encode all the possible
cells you can create (Buckley, p. 457, "The mechanisms of construction"):

```javascript
// Instructions to the jvn29 construction arm, whose tip
// is an arrow pointing into an unexcited state, that
// creates a sensitized state which evolves into other
// states over time, given the following excitement inputs.

constructionInstructions: {
    OR:  '10000', // => S S0 S00 S000 OR
    OU:  '10001', // => S S0 S00 S000 OU
    OL:  '1001',  // => S S0 S00 OL
    OD:  '1010',  // => S S0 S01 OD
    SR:  '1011',  // => S S0 S01 SR
    SU:  '1100',  // => S S1 S10 SU
    SL:  '1101',  // => S S1 S10 SL
    SD:  '1110',  // => S S1 S11 SD
    C00: '1111'   // => S S1 S11 C00
},
```

The full 29 states (useful for an editor's user interface):

```javascript
cellStates: [
    { symbol: 'U',    value: 0x00, name: 'Unexcited'              },
    { symbol: 'S',    value: 0x01, name: 'Sensitized'             },
    { symbol: 'S0',   value: 0x02, name: 'Sensitized 0'           },
    { symbol: 'S1',   value: 0x03, name: 'Sensitized 1'           },
    { symbol: 'S00',  value: 0x04, name: 'Sensitized 00'          },
    { symbol: 'S01',  value: 0x05, name: 'Sensitized 01'          },
    { symbol: 'S10',  value: 0x06, name: 'Sensitized 10'          },
    { symbol: 'S11',  value: 0x07, name: 'Sensitized 11'          },
    { symbol: 'S000', value: 0x08, name: 'Sensitized 000'         },
    { symbol: 'C00',  value: 0x10, name: 'Confluent 00'           },
    { symbol: 'C10',  value: 0x11, name: 'Confluent 10'           },
    { symbol: 'C01',  value: 0x90, name: 'Confluent 01'           },
    { symbol: 'C11',  value: 0x91, name: 'Confluent 11'           },
    { symbol: 'OR',   value: 0x20, name: 'Ordinary Right'         },
    { symbol: 'OU',   value: 0x21, name: 'Ordinary Up'            },
    { symbol: 'OL',   value: 0x22, name: 'Ordinary Left'          },
    { symbol: 'OD',   value: 0x23, name: 'Ordinary Down'          },
    { symbol: 'SR',   value: 0x40, name: 'Special Right'          },
    { symbol: 'SU',   value: 0x41, name: 'Special Up'             },
    { symbol: 'SL',   value: 0x42, name: 'Special Left'           },
    { symbol: 'SD',   value: 0x43, name: 'Special Down'           },
    { symbol: 'ORX',  value: 0xa0, name: 'Ordinary Right Excited' },
    { symbol: 'OUX',  value: 0xa1, name: 'Ordinary Up Excited'    },
    { symbol: 'OLX',  value: 0xa2, name: 'Ordinary Left Excited'  },
    { symbol: 'ODX',  value: 0xa3, name: 'Ordinary Down Excited'  },
    { symbol: 'SRX',  value: 0xc0, name: 'Special Right Excited'  },
    { symbol: 'SUX',  value: 0xc1, name: 'Special Up Excited'     },
    { symbol: 'SLX',  value: 0xc2, name: 'Special Left Excited'   },
    { symbol: 'SDX',  value: 0xc3, name: 'Special Down Excited'   }
],
```

## The Factorio connection

Factorio players will recognize the tapes of construction instructions as 2D "blueprints" that
construction drones use to build patterns of factories and conveyor belts. After your drones
have built a blueprint in the unpowered, unsupplied state, you connect it to the power grid,
hook up pipes, run conveyor belts in and out, and it immediately starts doing its thing.
Playing Factorio is uncannily like von Neumann 29 state cellular automata programming, not by
coincidence. So it's a great way to get your head around cellular automata programming, GPU
programming, parallel programming, queuing systems, and data flow programming in general.

## Signal crossing: three organs, three philosophies

Signal crossing is difficult with this rule, which doesn't directly support it, so you have to
"emulate it in software" with multi-celled machines or "organs". Each solution has its own
problems and limitations. The `save` blocks below are initial configurations from Don's
OpenLaszlo implementation.

### 1. The Real Time Crossing (Buckley, p. 457) -- elegant but unconstructible

Like a road intersection that splits the two crossing lanes, uses traffic lights to give each
pair of lanes alternating turns to cross, then merges the lanes back together. Since each
intersection works at 50% throughput, you need to split, use two of them, and merge --
Factorio and Satisfactory players will get what that means in terms of conveyor belts,
splitters, mergers, and throughput.

The catch: it depends on a synchronized configuration of *excited* cells acting as clocks, and
you can only construct unexcited cells. It's essentially a "Garden of Eden" configuration that
had to have been constructed by the Hand of God, and can't be copied or constructed, or used as
part of a reproducible machine. Essentially it has a "spark of life" that is beyond the ability
of creatures living in the world to ignite. It's like a beautiful tiny crystal alien artifact
with perfectly blinking lights, that the laws of physics practically prohibit from ever being
constructed -- but there it is. Intelligent Design and DRM FTW! ;)

```
<save
    name="Real Time Crossing"
    rows="16" cols="16"
    description="This real time crossing is not easily constructible, but nonetheless here it is."
>
sssssw-----sbhb-
yggggggggg-wbyb-
hhhhhhhhhy-wbyb-
yggggggggg-wbyb-
------sssw-wbyb-
------w----wbyb-
------w----wbyb-
--ezshqaez-wbyb-
--yty--wyt-wbyb-
--shqshqsb-wbyb-
ssq-wezw-z-wbybs
--z-wyty-qswbybw
--shqshqsy--bybw
--ezw--wez--bybw
--ytyqswyt--bybw
-----w------hyhw
</save>
```

### 2. The Coded Channel Crossing (Buckley, p. 460) -- von Neumann's own

Two channels share the same wire using a coding system, so you have to somehow make sure
neither channel tries to send a message over that one wire at the same time (left as an
exercise for the reader ;), otherwise there will be a collision. This is the only kind of
signal crossing organ designed by von Neumann himself.

```
<save
    name="Coded Channel Crossing"
    rows="8" cols="64"
    description="Coded channel crossings have interference problems, demonstrated here."
>
-zaaaaaaa-----qsssesqsq-----------qhshqsssqsqsqsq---------------
-z------w-----w---w-z-z-----------w-------w-z---z---------------
-sshhsssqsssssqsqsq-ssssssssssssqsusqhesqsq-ssssshshssssssssssq-
--------------------------w-----z-------------------------------
zaagagaaa-thssqsssqsqsqsq-w-----b-tsssqsqsq---------------------
z-------w-w-------w-z---b-w-----b-w---w-z-z---------------------
ssssssssqsqsthqsqsq-ssssshw-----ssestsq-sshhsssssssssssssssssse-
----------------------------------------------------------------
</save>
```

### 3. The Autoinitializing Exclusive Or (Buckley, p. 473) -- self modifying code

The fun one, and the subject of Buckley's paper. It solves the signal crossing problem without
needing the intervention of a benevolent God to power up all your traffic lights with the right
synchronization. It has a literal boot sequence: you first send it a "reset" signal, part of it
initializes all the clocks the first time it's run, then it fires a bunch of "explosive bolts"
that cut off the auto-initialization circuitry and start up the exclusive-or gate. It's
literally self modifying code that pokes itself after it boots, to switch into run mode.
That's why it's so big and messy compared to the elegant but impossible-to-construct real time
crossing. (Kind of like a C++ constructor, that's only used once in the lifetime of an object.)

```
<save
    name="Autoinitializing Exclusive Or"
    rows="28" cols="40"
    description="William R. Buckley's autoinitializing exclusive-or is initialized by 11111 at each input."
>
sstsb-sqqssssssssssssssssssssssssz--szsz
y-z-b-wsw------------------------z--wzwz
w-b-b-w-sqqsqsssssssqfqssqsssssz-z--wzwz
y-z-b-qawsw----ssz--wsw--wsz---z-z--wzwz
w-b-b-qww-----sq-sqzqqz--wqaa--z-z--wzwz
y-z-z-w-qsq---wsqr-swwassz--w--z-z--wzwz
w-b-z-qaw-zcqsqsqsqssqsq-ssqw--z-z--wzwz
y-z-z-qww-zfw-zsqc-szzasqr-szssz-z--wzwz
w-b-zsw-w-z-w-sq-szwqqw--zqaqq-z-z--wzwz
yaa-sqz-w-q-w--sswswzsz--zsw-w-z-z--wzwz
------qsq-ssqsssssssqfqssqssqw-zsqz-wzwz
zga-sqw-z-ssqsssssssqfqssqssqszsq-szwzwz
b-y-wsz-z-wa---ssz--wsw--wsz--zwsqwzwzwz
z-w-w-q-z--w--sq-sssqqz--wqaaazw-w-zwzwz
b-y-w-z-z-qw--wsqr-wawassz---wzw-w-zwzwz
z-w-w-q-qswcqsqsqsqssqsq-ssqswsw-w-zwzwz
b-y-y-z-z--fw-zsqc-zazasqr-z---w-w-zwzwz
z-w-y-z-z---w-sq-sqsqqw--zqa---w-w-zwzwz
b-y-y-z-zsszw--ssw--zsz--zsw--qw-w-zwzwz
z-w-y-z-sq-sqsssssssqfqssqssssww-w-zwzwz
hstsy-z--sqsqsssssssqfqssqsssssw-w-zwzwz
------z-----z--ssz--wsw--wsz-----w-zwzwz
------z-----z-sq-sszqqz--wqaa----w-zwzwz
------z----fz-wsqr-swwasqc--w----w-zwzwz
------z----rqsqsqsqssqsq-sssw----w-zwzwz
------z----------------ssw-------w-zwzwz
------sssssssssssssssssssssssssssw-zwzwz
-----------------------------------swsww
</save>
```

Buckley, p. 473 ("rtco" means "Real Time Crossing Organ"):

> Auto-initialisation provides much more capability than that used in the rtco, the examples
> of clock synchronisation and trivial reconstruction being the simplest applications.
> Mechanisms used are signal sampling, portal closure, clock synchronisation, and staged
> initialisation. Our implementation uses three separate start signals; a staged
> initialisation. Each clock of the rtco has a separate auto-initialisation circuit. [...]
> In this way, synchronisation becomes a trivial concern.

## How self-reproduction actually works

A self replicating machine -- which was stupendously huge and complex for a program from the
1940s designed on graph paper without the help of computers, but is a microscopic speck
compared to Electron today -- first prints a powered-down copy of itself with the construction
arm (a 2D ink-jet printer head driven by a tape of instructions). Then it injects a copy of
its program into the storage device of the new copy through an "umbilical cord", and sends it
a reset signal to boot it to "life" -- breathing a copy of its "soul" into its new child
machine, so to speak.

The parent would typically print the copy offset in the same direction as its parent had
printed it, then shut down (or at least stop building and go into a deep state of meditation,
counting electric sheep or something) after reproducing once, so as not to hurt its child.
It's left as an exercise to the reader to design a self reproducing machine that knows how to
eat its parent to make more room to expand, or a parent that eats its children.

Up: [character README](../README.md) - [sources README](README.md)
