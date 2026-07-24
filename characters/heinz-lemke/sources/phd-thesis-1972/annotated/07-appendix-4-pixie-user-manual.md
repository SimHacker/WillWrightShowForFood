# Appendix 4 — The PIXIE User Manual

Thesis pp. 187–209 · [annotated edition index](README.md) · [← references & appendices](06-references-appendices.md)

> ✎ **Highlights.** The operating instructions for the
> [resurrection bench](../../pdp7-reference/EMULATION-PLAN.md) — load paths (down the
> Titan link *or* from paper tape, address switches 17600 + READIN), clean start
> (switches 22 + START), recovery (23 + START). The interface geometry matters for
> [radial-menu history](../../../pixie-source-recovery.md): **twelve command
> light-buttons in a fixed column at the right edge, but six control buttons arranged
> around the tracking cross, traveling with it** — cursor-attached controls at the pen
> position, with A/B rotating between button sets. The `TITAN` teletype command freezes
> the picture for [link transfer](../../pdp7-reference/TITAN-LINK-PROTOCOL.md); NOTE 3/4/5
> are the checksum / not-PIXIE-data / file-too-large errors we found as `PXER2/PXER3/PXER1`
> in the [octal](../../pixie-assembler-listing-1972/README.md). When the drawing space
> jams: ship the structure to Titan, run `COMPACT` ([Cheney](https://en.wikipedia.org/wiki/Cheney%27s_algorithm)
> at mainframe scale), ship it back.

---
<!-- PDF indices 194–218; thesis pages 185–209. Appendix 4 (PIXIE User Manual) runs thesis p.187–209 (pdf 196–218). Pages 185–186 (pdf 194–195) are tail of Appendix 3 and omitted. -->

<!-- p.187 / pdf.196 -->

## APPENDIX 4

## PIXIE MANUAL

### CONTENT

1. Introduction
2. Loading and starting
3. Basic actions
4. Drawing mode
5. Pointing mode
6. Teletype commands
7. Messages given by PIXIE
8. Space jams
9. Nesting
10. Transmission of data
11. The data structure
12. Miscellaneous features

<!-- p.188 / pdf.197 -->

### 1. Introduction

PIXIE is an operating system for the PDP7/PDP9 and DEC 340 Display. Working at the screen of the display a user is able to draw, edit and assemble schematic diagrams and establish *hierarchical relationships* between their component parts. As he works PIXIE builds a machine readable *model* of his schematic in the form of a complex data structure, suitable for use in a variety of applications. The I/O features of PIXIE are shown in FIG.1.

The available core space in the PDP7/PDP9 allows for up to 35 or 50 nodes and branches. If larger schematics are needed or the drawing exceeds the reserved space, see section 8.

This document gives a simple description of the facilities provided by PIXIE and brief operating instructions.

> **Fig.1 — I/O features of PIXIE.** [visual: Block diagram labelled USER on the left and TITAN/ATLAS on the right, with central box labelled PIXIE / PDP7/9; arrows labelled GRAPHICAL AND ALPHA-NUMERIC INFORMATION between USER and PIXIE, and DATA STRUCTURE between PIXIE and TITAN/ATLAS, both bidirectional.]

<!-- p.189 / pdf.198 -->

### 2. Loading and starting

#### (a) From Titan or Atlas file. Linkboot in reader.

Address switches to 17600. Press READIN. Engage link.
Log into Titan/Atlas and type:

`PDP(RAINBOW/PIXIE/*) W A022 D022`

To speed up his drawing actions the user may load an additional symbol file by reloading the linkboot and typing:

`PDP(RAINBOW/ELEC/SYMB) W A022 D022` (for electronic symbols)

`PDP(RAINBOW/GEOM/SYMB) W A022 D022` (for geometrical symbols)

These symbol files can also be loaded after drawing has already started. The information on the screen is preserved. More detail about these symbols is given in section 4 under control buttons.

#### (b) From Paper Tape. PIXIE tape in reader. Address switches to 17600 and press READIN.

In either case PIXIE does a clean start after loading and displays a blank frame on the screen. A clean start can be obtained anytime by setting the address switches to 22 and pressing START. In the event of hardware/software failure, a restart can be attempted by setting 23 on the address switches and pressing START. This deletes any unfinished commands but preserves, if possible, the user's picture.

### 3. Basic actions

The user works with lightpen and teletype to construct a schematic diagram on a conceptual surface about 40 inches square which he views "through" the display. The screen thus serves as a 10 inch square *window* on the schematic and may be positioned anywhere on it.

The program operates in two major modes, drawing mode and pointing mode. The user induces effects in the program by

(a) typing on the teletype

(b) pointing the lightpen at light buttons on the screen

(c) pointing the lightpen at a small tracking cross on the screen and moving it about

Twelve command lightbuttons are displayed down the right-hand edge of the screen. These are used for selecting modes and carrying out gross actions. The tracking cross is always 'live' to the pen and can be moved regardless of the mode. Six control lightbuttons surround the tracking cross. These move with the cross so the user's hand is always nearby. To prevent clutter, only "legal" buttons for the current state are shown. The user can cycle through sets of buttons by pointing at one that acts as a "rotating switch".

<!-- p.190 / pdf.199 -->

### 4. Drawing mode

The top four command buttons refer to this mode.
They are:

**DR** Enter drawing mode, turn off blink.

**HV** Select line drawing constraints to horizontal.

**RU** Select "rubber band" line drawing.

**SF** Start or finish segment.

The following control buttons are provided:

**S** Start segment. After pointing at S it switches to F, meaning finish segment. The SF command button duplicates this control.

**F** Finish segment. Occupies the same physical position as S.

**A** Select second set of control buttons.

**B** Select first set of control buttons.

A and B occupy the same physical position.

If the user intentionally omits to give names to the symbols the type numbers (in octal) as given below can be used by a program in TITAN/Atlas as reference to the meaning of the symbol¹.

¹ Type numbers are given to basic symbols automatically.

<!-- p.191 / pdf.200 -->

*Electronic symbols:*

First set:

**R** Insert a resistor symbol in the current segment, provided HV constraints are on. The orientation of the symbol is automatically arranged to be in the current drawing direction. Type No. 1.

**C** As for R except insert a capacitor symbol. Type No. 2.

**L** As for R except insert an inductor symbol. Type No. 3.

**S** As for R except insert a switch symbol. Type No. 6.

Second set:

**V** As for R except insert a voltage source symbol. Type No. 4.

**I** As for R except insert a current source symbol. Type No. 5.

**U** As for R except insert a nullator symbol. Type No. 10.

**O** As for R except insert a norator symbol. Type No. 7.

<!-- p.192 / pdf.201 -->

*Geometrical symbols:*

First set:

**I** Insert an arc in the current segment, provided HV constraints are on. The orientation of the symbol is automatically arranged to be in the current drawing direction. Type No. 11.

**Q** As for I except insert a semicircle symbol. Type No. 12.

**M** As for I except insert a rule symbol (metric). Type No. 13.

As for I except insert an arrow symbol. Type No. 14.

Second set:

**S** As for I except insert rectangle symbol. Type No. 15.

**C** As for I except insert circle symbol. Type No. 16.

**T** As for I except insert triangle symbol. Type No. 17.

**D** As for I except insert diamond symbol. Type No. 20.

Starting with a blank frame (e.g. clean start) the user is able to track the cross to some desired initial position and point at the control button S (start segment) to commence drawing. When he continues to track the cross a trail of light appears on the screen joining the initial position with the current position of the cross. If rubber band line drawing is selected (command button RB has been hit) this trail of light forms a straight line between the start and current position. If however, constrained horizontal/vertical drawing is selected (default state or HV command button has been hit) then the path of the pen, suitably smoothed, is approximated by a series of horizontal and vertical lines.

Basic built-in symbols may be incorporated in the current segment by pointing at the appropriate control buttons. Lines and symbols in the current segment may be "undrawn" by simply tracking the cross backwards over its path. A very fast response

<!-- p.193 / pdf.202 -->

to the pen is obtained and the user may make any number of corrections to the current segment by undrawing and remaking parts of it. When satisfied with it the user points at control button F, or command button SF, which freezes the current segment and adds its features to the schematic being built. He then tracks the cross to some new position and starts another segment.

As he proceeds in this way a model of the schematic is assembled in core ready for later transmission to application programs in Titan/Atlas. This model represents the schematic basically as a graph structure of nodes and branches but if required it can be modified by the user via the grouping control button. Nodes contain an assortment of lines which serve to connect together the terminals of branches. Each such terminal is called an attachment point and branches are allowed any number of attachment points in their definition. The built-in symbols have two each initially, but additional attachment points can be added by the user.

When pointing at S or F control buttons the program tests whether:

(a) the cross is near a node (more precisely it tests whether the most recent pen-hit from a node was near to the current cross position) and, if so, it arranges that the segment will start and/or finish exactly on the node.

(b) the cross is near a branch, but not near to one of its attachment points (most recent pen-hit from branch was near to current cross position but was not an attachment point) and, if so, segment is not started/finished.

### 5. Pointing mode

The bottom light command buttons refer to this mode.
They are:

**PO** Enter pointing mode. Turn off blink.

<!-- p.194 / pdf.203 -->

**AT** If something is blinking, make current cross position an attachment point.

**IN** Change intensity. Not yet implemented.

**SC** Change scale. Not yet implemented.

**CA** If something is blinking, catalogue it.

**RE** If something is blinking, build a new catalogued item at half size without attachment points.

**RO** If something is blinking, build a new catalogued item rotated 90° without attachment points.

**EN** End current group. Turn off blink.

The control buttons are:

**C** If something is blinking, copy it and enter tracking mode.

**E** If something is blinking, erase it.

**T** If something is blinking, enter tracking mode.

**M** Change context marker to include more of picture.

**L** Change context marker to include less of picture.

**G** If something is blinking, add it to current group.

Pointing at any command or control button turns off the blink after the requested action is carried out.

The name PIXIE is displayed in the lower left-hand corner of the display. Pointing at the PIXIE name deletes all control light buttons for drawing mode and certain command light buttons (IN, SC, CA, RE, and RO). This extends the space available for the data structure and display file, allowing for a drawing with a maximum of about 50 nodes and branches. The user should make sure he does not need those buttons before deleting them to free up memory.

<!-- p.195 / pdf.204 -->

When in pointing mode, a pen-hit from the picture causes part or all of the picture to blink on and off at about twice per second. The amount which blinks, determined by a context marker, can be altered by pointing at M and L control buttons to include the whole picture, the individual nodes and branches which make it up or, at several levels, the internal structure of the nodes and branches right down to particular lines and basic symbols. A little experimenting with the lightpen will soon reveal the hierarchical details of the model under construction. When the desired portion is blinking it can be processed by further hits on command or control buttons. For example, control button E will erase the blinking portion. control button T will allow the blinking object to be moved around on the screen by tracking the cross (a constant displacement between the cross and the object is maintained).

PIXIE provides a mechanism by which the user is able to create his own basic symbols (branches). This is done as follows:

(a) a prototype basic symbol, or a picture containing the prototype, is drawn up by the user.

(b) in pointing mode the prototype is made to blink (in case the prototype requires scattered fragments, each fragment is separately blinked and added to a common group by pointing at G control button).

(c) the prototype is then catalogued as a new basic symbol either at full size (point at CA command button), one half full size (point at RE command button), rotated by 90 (point at RO command button). Reducing and rotating leave the prototype uncatalogued. Further reductions in size or rotations can be obtained by making the symbol blink and pointing at the RE or RO command button successively.

(d) finally, the terminals in the prototype are identified by positioning the cross at each attachment point in turn and hitting the AT command button.

<!-- p.196 / pdf.205 -->

Basic symbols may be treated like any other picture component except that they have no internal structure. Thus, for example, the individual line segments which make up a basic symbol cannot be individually blinked. They are useful however because they require a minute amount of core for storage compared with the fully structured model for the same picture. The PDP has a very small store and it will normally be necessary for the user to define new basic symbols whenever he can to minimise the amount of modelling space required to support his work.

Every basic symbol, node, branch and picture part is represented in the model in two distinct parts:

(a) as a prototype for the component, known as its subpicture

(b) as an occurrence of the component, known as an instance.

There may be many instances of a given subpicture, each with different value and environmental parameters (for example, various instances of a resistor subpicture each with its own value of resistance, wattage rating and size and connected into different nodes of a given circuit). The subpicture, on the other hand, needs to carry type information sufficient to define the meaning of "this kind of component" (e.g. a resistor, whose behaviour is simulated by routine R123).

A mechanism is provided for attaching information to subpictures and instances in the form of character strings. The user first enters pointing mode and blinks the desired picture part. Then he types on the teletype the required information. A character string (which may be empty) is terminated by carriage return and a line feed response is issued by PIXIE when the processing of the string is complete.

<!-- p.197 / pdf.206 -->

`/<character string>` adds the string as a line of parameter data to the blinking instance (the leading `/` is not included in the data).

`:<character string>` sets the type of the subpicture (for which the instance is blinking) equal to the string.

`<empty string>` (carriage return only) causes the teletype to list the name, all data, and the subpicture type of the blinking instance.

`<any other character string>` sets the name of the blinking instance to the string.

When an instance is created a two-digit numeric name is automatically attached as a default. Typing a query `(?)` before the terminating carriage return cancels the current typing.

### 6. Teletype commands

The following commands can be typed on the teletype at any time, provided nothing on the screen is blinking. They are typed as a single word or just the first three characters, followed by a carriage return. PIXIE responds with a line feed when the command is complete, or a query `(?)` if the command is unknown. Typing `(?)` also cancels the current line.

**START** Provides a clean start. Equivalent to setting address switches to 22 and pressing the START button.

**GRID** Forces drawing and tracking actions to snap to an invisible grid with a pitch of approximately 0.1 inches. This mode is turned off by a clean start or by typing LABEL or UNLABEL.

**LABEL** Annotates the picture on the screen with the names of all instances.

<!-- p.198 / pdf.207 -->

**UNLABEL** Remove names from the picture (but not from the data structure model, of course).

**TITAN** Freeze PIXIE in preparation for transmissions to/from TITAN/Atlas. The picture remains on the screen but all commands are disabled until the user types a further CR. This restores normal conditions and if any transfer was in hand at the time, it is abandoned.

### 7. Messages given by PIXIE

Certain system and operational malfunctions are detected by PIXIE and lead to the output of messages in form of Note n (1 ≤ n ≤ 8). If appropriate the user should take action as described below.

| Message | Meaning | User's action |
| :--- | :--- | :--- |
| **NOTE 1** | Data structure space jam. | See section 8 |
| **NOTE 2** | Display file space jam. | See section 8 |
| **NOTE 3** | Checksum failure in transfer between PDP and TITAN/Atlas | Try again |
| **NOTE 4** | Transfer from TITAN/Atlas is not PIXIE data. | Check the file |
| **NOTE 5** | Incoming file too large. | Try COMPACT Program in TITAN/Atlas |
| **NOTE 6** | Command referring to level of line is illegal, e.g. attachment points on line, line grouping, copying, cataloguing, reducing or attaching a message to a line. | Increase the level |
| **NOTE 7** | Command referring to upper level of schematic is illegal, e.g. grouping, copying, cataloguing or reducing. | Decrease level and group if necessary. |
| **NOTE 8** | Space jam in working stacks. | Core store limitations which can only be overcome by changing the PIXIE system itself. If NOTE 8 occurs frequently, contact the authors. |

<!-- p.199 / pdf.208 -->

### 8. Space jams

When a space jam occurs PIXIE notifies the user by typing on the teletype either NOTE 1 or NOTE 2. If NOTE 1 occurs the user should not add more than one or two lines, names, attachment points etc. It is recommended that he transfer his data to TITAN/Atlas via the command discussed in section 6. Once in TITAN/Atlas a compacting process can be initiated by the command

`RAINBOW/RUN(:01)COMPACT`

The compacted file can then be transferred back to the PDP computer and drawing or editing continued. If the user needs to add more than five nodes and five branches he should use the nesting procedure in section 9.

If NOTE 2 occurs it is similarly recommended that he save his file in TITAN/Atlas first. Compacting does not reduce the display file size. For large amounts of new information the nesting method in section 9 should be used. Space can be regained by tracking parts of the picture outside the window.

If the user ignores these notes and continues adding information, PIXIE may do a clean start automatically, without notice.

### 9. Nesting

Nesting is a facility provided by the RAINBOW system. When used with PIXIE it involves representing part of a network by a user-defined symbol.

<!-- p.200 / pdf.209 -->

The first step is to draw the network or "equivalent circuit", give attachment points to its terminals, a generic name and file it in TITAN. Several equivalent circuits can be drawn on the same file via the grouping command. The next step consists of drawing the symbol representing the network. Attachment points are then given to the symbol terminals in the same order as to the network, i.e. the first attachment point given to the network corresponds to the first attachment point of the symbol and so on. Finally, the symbol is catalogued and given the same generic name.

To resubstitute equivalent circuits for symbols REPLACE is called. The function of this program is to permit user-defined branches in a CONN structure on input stream 1 to be replaced by equivalent circuits separately defined on an arbitrary number of CONN structures on input streams 2, 3, etc.

For example, if the circuit is filed in /CIRCUIT and the equivalent circuits are on /REP/1, /REP/2 and /REP/3 then the command to do the substitution

`/RUN (/CIRCUIT /REP/1 /REP/2 /REP/3) REPLACE`

This causes /REP/1, /REP/2, /REP/3, in turn to be scanned for every occurrence of a user-defined symbol in /CIRCUIT. For each such symbol in /CIRCUIT, /REP/1 is scanned for a subcircuit with a matching generic name. Replacements are carried out at every successful match.

If any unreplaced user-defined symbols still exist in /CIRCUIT the process is repeated for /REP/2 and again for /REP/3 etc.

Any user-defined symbols in /CIRCUIT which remain unreplaced, are listed on the teletype. The "replaced" version of /CIRCUIT is left on stream 01.

<!-- p.201 / pdf.210 -->

### 10. Transmission of data

Transmission between the PDP and TITAN/Atlas will normally be carried out using the PDP command (see The Cambridge Multiple-Access system. Users Reference Manual. Edited by D.F.Hartley, University Mathematical Laboratory. November, 1968).

To read data from PIXIE and write it to a file called /DRAWING/1 a suitable TITAN command is

`PDP(O1 /DRAWING/1/.P)R N 3000`

To write data to PIXIE from file called DRAWING/1 a suitable command is

`PDP(/DRAWING/1)W`

A transfer in either direction has to be set up by typing TITAN on the PDP console (see section 6). On malfunctioning of a transfer a message will be typed on the PDP console (see section 7) or possibly on both.

### 11. The data structure

It is generally not necessary for the user to understand the internal computer representation of a picture (usually referred to as the data structure). Nevertheless, for the more sophisticated user a brief description will be given of how pictures are modelled by PIXIE.

Four different element types (BSP elements) are issued by PIXIE routines for the generation of a data structure. These are point, line, subpicture and instance elements. While the user is drawing or editing a picture, these elements are interconnected or modified automatically by PIXIE.

<!-- p.202 / pdf.211 -->

Interconnection is built on the assumption that the drawing to be modelled is a network. FIG. 2 shows two nodes and one branch with its data structure. This representation is one of several adopted in the RAINBOW system and is also referred to as the PIXIE data structure. Its definition is included in the RSP syntax given in Table 1.

> **TABLE 1 Extract of RSP syntax**

| Non-terminal | Definition |
| :--- | :--- |
| `<relation>` | `:: = son\|father` |
| `<element>` | `:: = <pixie element>\|<user element>` |
| `<pixie element>` | `:: = point\|line\|instance\|subpicture` |
| `<element relation>` | `:: = <relation> <element>\|<element relation> <relation> <element>` |
| `<path>` | `:: = <element> <element relation>` |
| `<data structure>` | `:: = <path>\|<data structure> <path>` |
| `<point relation>` | `:: = isolate\|<point relation>father line\|<point relation>father instance` |
| `<point path>` | `:: = point<point relation>` |
| `<line relation>` | `:: = son point son point\|<line relation> father subpicture` |
| `<line path>` | `:: = line<line relation>` |
| `<instance relation>` | `:: = son subpicture son point\|<instance relation> father subpicture` |
| `<instance path>` | `:: = instance<instance relation>` |
| `<subpicture relation>` | `:: = isolate\|<subpicture relation> <relation> instance\|<subpicture relation>son line` |
| `<subpicture path>` | `:: = subpicture<subpicture relation>` |
| `<pixie path>` | `:: = <point path>\|<line path>\|<instance path>\|<subpicture path>` |
| `<pixie data structure>` | `:: = <pixie path>\|<pixie data structure> <pixie path>` |

The definition of a user element is not necessary in order to understand picture structures and is omitted in Table 1.

<!-- p.203 / pdf.212 -->

> **Fig. 2 — The PIXIE data structure.** [visual: Upper schematic shows nodes N1 and N2 connected by lines L1–L3 and branch B1 with ports P1, P2. Lower block diagram shows INST and SUBP at root, with hierarchical links to N1/L1/L2, B1/P1/P2, and N2/L3.]

<!-- p.204 / pdf.213 -->

In RSP the relational features are represented by rings which associate elements with one another and the values (properties) are stored in the data areas of their respective elements. For example, the coordinates of a point might be regarded as the value of the point and would then be recorded in its data area, while the fact that the point was the attachment point of a subpicture would be shown by a ring connecting it to the element which represented the subpictures. A ring in RSP may pass through any number of elements, one (and only one) of which is the 'owner' of the ring. The owner is known as the *father* of all the other elements on the ring. Each such element is the *son* of the owner. The vocabulary word *isolate* indicates that the corresponding element can exist without relational features at all (i.e. no rings pass through it).

The notation used for the data structure in FIG.2 follows that proposed for the ASP data structure system in which boxes represent values of elements and triangles, circles and lines show the relation between elements. For our purpose it is sufficient to define the father-son relation as a path element — triangle — circle — element.

Further detailes, including how information is stored in the data areas of RSP elements, are given in Tables 2 and 3.

<!-- p.205 / pdf.214 -->

> **TABLE 2 Review of BSP element formats**

| POINT | INSTANCE | LINE | SUBPICTURE |
| :--- | :--- | :--- | :--- |
| atname | atname | atname | atname |
| headpointer | headpointer | headpointer | headpointer |
| 1 | 2 | 3 | 4 |
| 0 | `<blink, scale, brightness>*` | 0 | (see table 3) |
| Y | Y | Y | CST |
| X | X | X | CEP |
| | DATA (if any) | Y | DX |
| NIL | NIL | X | DY |
| | | NIL | NIL |

`*` for INSTANCE:

`004000` for blink this instance

`003000` for stop and interrupt before this instance

`000600` for spare (user) marking of this instance

`000160` for scale of this instance

`000017` for brightness of this instance

(the blink digit is removed by the compiler after being sensed)

CST (catalogue status) = 0 if uncatalogued, = 10000 if catalogued

CEP (catalogue entry pointer) = `<address of start of Block Data in List area, i.e. address of block data marker>` first word in display must be in SB mode.

DX and DY = amount by which beam is deflected by this subpicture = For permanently catalogued items these must be set by the programmer.

(1) The subpicture format given is for a branch. There is a NIL in the data area for a subpicture element of a node.

<!-- p.206 / pdf.215 -->

> **TABLE 3 Subpicture type word format**

[visual: Block diagram with fields RINGSTART TO INSTANCE, POINTER TO PRINTNAME (GENERIC TYPE), bit fields B/R/4, and DATA AREA rows.]

**A. BASIC SYMBOLS**

| Symbol | Code |
| :--- | :--- |
| Resistor | 1 |
| Capacitor | 2 |
| Inductor | 3 |
| Voltage source | 4 |
| Current | 5 |
| Switch | 6 |
| Norator | 7 |
| Nullator | 10 |
| Arc | 11 |
| Semi circle | 12 |
| Metric measure | 13 |
| Arrow | 14 |
| Rectangle | 15 |
| Circle | 16 |
| Triangle | 17 |
| Diamond | 20 |

**USER GENERATED SYMBOLS**

1st SYMBOL = 41, 2nd SYMBOL = 42, 3rd SYMBOL = 43, 4th SYMBOL = 44, 5th SYMBOL = 45, 6th SYMBOL = 46, 7th SYMBOL = 47, 8th SYMBOL = 50, 9th SYMBOL = 51, etc.

**B. DIRECTION OF BASIC SYMBOLS**

→ = 0, ↓ = 1, ← = 2, ↑ = 3

<!-- p.207 / pdf.216 -->

### 12. Miscellaneous features

PIXIE gives numeric names automatically to newly created nodes and branches of a schematic. Starting with 00 as the name for the complete schematic it issues consecutive numbers until 99 after which the naming mechanism restarts with 00. If a filed schematic is retrieved from TITAN/Atlas to PDP the naming mechanism restarts from 00. To avoid double naming the user may give all newly added nodes and branches his own names.

The position of names for built-in symbols and for nodes is appr. 1/8" below and to the right of the start of these entities. For user built symbols which were created by grouping parts on the screen before being catalogued, the position of the name is equal to that of the complete drawing (SAVINS).

With this feature the user can position names anywhere on a symbol (including modifying that of a built-in symbol) by simply tracking members of the group relative to the groups name. A built-in symbol will, when grouped and catalogued, lose of course its type number. Generic names should therefore be assigned to such symbols, e.g. RESISTOR to a resistor symbol etc. Fig.3 shows a drawing with the names displayed in the manner just described.

A drawing viewed through the window with no names displayed is shown in Fig.4. Note that Fig.3 and Fig.4 are in pointing and drawing mode respectively.

<!-- p.208 / pdf.217 -->

> **Fig. 3 — Drawing with names displayed.** [visual: DEC 340 photograph showing circuit schematic "INTERFACE LEVEL CHANGER-CIRCUIT" with component names (R1–R8, Q1–Q4, IN, OUT, ±6V). Right column command buttons DR, MU, RU, SF, PO, AT, CA, RE, EN. Radial control cluster around cursor: T, M, L, C, E, G. Status line "UML CAMBRIDGE: RAINBOW" at lower left.]

<!-- p.209 / pdf.218 -->

> **Fig. 4 — Drawing viewed through the window.** [visual: DEC 340 photograph showing block diagram with fewer labels; right column buttons DR, HU, RU, SF, PO, RT, CR, RE, EN; radial control letters V, B, I, F, U, O near lower right.]
