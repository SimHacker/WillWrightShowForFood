# PIXIE's data: ring structures, from the ground up

**The problem.** A circuit drawing is not a tree. A node touches several branches, a branch
touches two nodes, and a symbol instance belongs to a group, a subpicture and a catalogue
at once. That needs many-to-many relationships, walkable both ways.

**The idea.** Each element is a small block of words. A **ring** is a circular linked list
that threads through its members and comes back to its owner. Go round a node's ring to
list its branches; keep going from any member to get back to the owner. An element sits on
as many rings as it has relationships. Insert and delete are pointer splices; nothing moves.

**Lineage** (citations to check against the thesis references): Sutherland's **Sketchpad**
(1963) kept points, lines, constraints and instances in rings, and its generic delete,
merge and copy worked on any element type. **CORAL** (Lincoln Lab) and **ASP** (Lang &
Gray, Cambridge, 1968: the same C. A. Lang who wrote the Titan link software) followed.
Wiseman & Hiles, *A ring structure processor for a small computer* (Computer Journal,
1968) is very likely the RSP inside PIXIE; the thesis schedule dates "Ring Structure
Processor RSP" to 1967. Bachman's IDS carried owner/member chains into databases (CODASYL
"sets"); the Linux kernel's `list_head` is the same ring today.

**Names.** RSP is the library. A ring structure built with it we call a **pixie**, lower
case, after Heinz's manual, which says the representation "is also referred to as the PIXIE
data structure". PIXIE in capitals is his program. A ring in a pixie is a pixie ring, and
pixie rings in a meadow are mushrooms around a centre, joined underground by a mycelium
nobody sees, which is a ring structure, and drawn around its centre, a pie menu
([TINY-ITS.md](../TINY-ITS.md#pixie-rings-are-pie-menus)).

**PIXIE's variant** is a hybrid: Lisp-style two-word cells used to build rings. Word
classes, as decoded in [`packages/pixie`](../../pixie/src/words.ts):

| Word | Meaning |
|---|---|
| top 5 bits zero | atom: a 13-bit value (character, count, coordinate) |
| `100000`, the `JMS` opcode | NIL |
| `100000` + address | a *name*: a pointer the machine can indirect through |
| `020000` + length | block header; that many raw words follow and are never relocated |
| sign bit set | *nonitem*: forward to the low 13 bits. Reads as how a list closes into a ring (`PUSH`/`POP` "JOIN UP" with `XOR (500000`) |
| `200000` | the garbage collector's mark bit |

On top: `CAR`/`CDR`, `PUSH`/`POP`, printnames, a free list, and a recursive garbage
collector. The thesis says one RSP served circuits, syntax graphs (ch. 6) and control
systems (ch. 7): general purpose within RAINBOW.

**Compared with the formats you know:**

| | Shape | Sharing / cycles | Identity | Code as data | Text form |
|---|---|---|---|---|---|
| Lisp sexprs | cons cells, trees by convention | yes in memory; printing needs `#1=`/`#1#` | address | yes | the printed sexpr |
| JSON | tree of objects and arrays | no | none | no | the text *is* the data |
| PostScript | arrays, dicts, strings as shared references | yes; `==` prints trees | reference | yes (executable arrays) | no standard graph serialization |
| YAML | tree plus anchors `&a` / aliases `*a` | sharing yes; cycles legal, unevenly supported | anchor names | no | yes |
| Ring structures | typed blocks on many rings | many-to-many and cyclic by design | core address | PIXIE's names *are* `JMS` words | none known |

JSON and sexprs are about **containment**; rings are about **membership**. A ring structure
is closer to a graph database stored as pointers than to a document.

**Text format?** None found from 1972. The interchange format was the binary transfer image
(`PXID`/`DSBEG`/`DSEND`/`SAVINS` heading, the words from `BEG` to `END`, a relocation
pass on arrival: [TITAN-LINK-PROTOCOL.md](TITAN-LINK-PROTOCOL.md)). The nearest text was
what Titan programs generated *from* the structure: netlists for the LADAN and CANOTRAN
analysers, CONN/CONNMAP. Today the repo's `.oct` files (`addr word` lines) are the de
facto text form. The plan for a viewer, an editor and text formats is in the cabinet's
[DESIGN.md](../DESIGN.md#the-application-layer--packagespixie-separate-module);
a Forth vocabulary for rings is in [FORTH-TURTLE-340.md](FORTH-TURTLE-340.md#9-rings-as-a-forth-data-type).

## Names are `JMS` words

`JMS` is the PDP-7's subroutine call: opcode 02, top bits `100000`, then a 13-bit address. A
PIXIE name is exactly that word: `100000` ORed with the address of what it names, and NIL is
`JMS 0`. So one word is both a pointer and an instruction.

**As a pointer.** The low 13 bits are the address, so `LAC I` through the word that holds a name
reaches the named thing, and the relocation pass knows a name by its top bits and adds the
offset. The `JMS` bits are a type tag the hardware happens to ignore when indirecting.

**As an instruction.** Execute a name (`XCT` it, or let control fall into it) and the machine
calls the named address as a subroutine, leaving the return address in its first word. That is
the same trick as a Forth code field, and close to Mitch's Forth, whose threaded cells are real
PDP-7 instructions that `next` runs with `xct i 010`: in both, data is shaped so the CPU can run
it. Whether and where PIXIE actually executes names, rather than only following them, is
unverified: an open question for a reader of the listing ([TODO](../TODO.md)).

## Status

- **Done:** `packages/pixie` decodes the word classes, walks `CAR`/`CDR`, builds rings
  (`RingBuilder`), relocates, and encodes the transfer format; the RINGS panel in the cabinet
  shows a live structure.
- **Next:** decode the rest of SYMELEC's element format, so every element can be found and
  edited ([DESIGN.md](../DESIGN.md#a-universal-340-editor)).
- **Will:** PIXIE rings as one spoke of the universal drawing: lift any picture into rings, and
  rings into the drawing.
- **Could:** find how PIXIE uses names as `JMS` words; a YAML form for rings with anchors for
  sharing; rings as a Forth data type.

↑ [GUIDE](GUIDE.md) · [reference library](README.md)
