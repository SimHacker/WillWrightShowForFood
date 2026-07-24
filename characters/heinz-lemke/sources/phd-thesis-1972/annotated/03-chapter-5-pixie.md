# Part 2 · Chapter 5 — The PIXIE Subsystem

Thesis pp. 52–120 · [annotated edition index](README.md) · [← chapters 3–4](02-chapters-3-4.md) · [chapters 6–7 →](04-chapters-6-7.md)

> ✎ **Highlights.** This is the [assembler listing](../../pixie-assembler-listing-1972/README.md)
> in prose. §5.3.1: display files execute on the [Type 340](../../pdp7-reference/GUIDE.md)
> by cycle stealing while the CPU runs — and *"minimum use should be made of the link to
> the TITAN computer"* was a design constraint. §5.4: subpicture instances as display
> subroutine calls ("flow of control is considered to pass along the rings"). §5.5.1:
> light-pen tracking = cross + recovery **spiral** "about twice the cross size" — the
> spec for the [virtual light pen](../../pdp7-reference/EMULATION-PLAN.md). §5.5.4: the
> teleprinter is PIXIE's message channel (~100 ms/char via the `OUT` interrupt routine —
> the [MESOUT/OUT code](../../pixie-assembler-listing-1972/symelec-listing.txt) we
> transcribed). §5.5.8 + Fig 5.20: the five teletype commands, including **TITAN =
> EXECUTE LINK** — the verb that fires [Etherton's link routine](../../pdp7-reference/TITAN-LINK-PROTOCOL.md).
> §5.7 (gap-patched below): PIXIE ran at **RCA Laboratories Princeton**, the **Institute
> of Computer Science London** (INDRA PDP-9 port, Low 70), and the
> **[CAD Centre](https://en.wikipedia.org/wiki/CADCentre)** — it traveled.

---
<!-- PDF indices 061–080; thesis pages 52–71 (Chapter 5 opening through mid–5.4.2) -->

## CHAPTER 5

## THE PIXIE SUBSYSTEM

<!-- p.52 / pdf.061 -->

*Summary*

This chapter describes in some detail the design philosophy of PIXIE. It is assumed that the reader is familiar with the PIXIE manual in appendix 4.

The main topics outlined are concerned with the co-ordination of the various tasks in PIXIE, the representation of data, real-time processes and data handling routines. All topics are discussed with reference to the design objectives of PIXIE which are stated at the begining of the chapter.

Other PIXIE implementations are mentioned only briefly.

### 5.1 Introduction

<!-- p.53 / pdf.062 -->

PIXIE is a self-contained operating system embedded within RAINBOW. It is a special purpose package designed to support the graphics activities of the RAINBOW system. It is concerned with network-like drawings. 3-dimensional drawings and arbitrarily curved shapes cannot be handled efficiently. All drawings are modelled in a data structure which can be built by PIXIE or independently by an application program.

The primary objective of PIXIE is to provide an economical graphical man-machine communication facility with the following capabilities:

(a) To allow a user to enter graphical data as naturally as possible.

(b) To provide a fast response to prevent user frustration.

(c) To build automatically a model of the input data showing its geometrical and topological features. This model should be task-independent.

(d) To keep operating costs low through efficient hardware use. This implies implementation on a small satellite computer having only 8K of 18 bit words of core store and no auxiliary storage. It also implies minimising interaction with a large computer.

<!-- p.54 / pdf.063 -->

Typically, PIXIE should be able to hold and edit drawings with 30-35 nodes and branches without assistance from a large computer.

*INPUT/OUTPUT*

Input to PIXIE can come from two sources:

(i) as a result of human activities involving the screen and light pen or teletype;

(ii) as a ready made data structure received from the main machine via a data link.

Output from PIXIE consists of two representations of the design data structure which it currently holds;

(i) a graphical image on the display screen coupled with textual information on the teletype;

(ii) a structural model of the data which may be sent to the main machine via the data link for further processing or storage.

### 5.2 A user's view

Though a manual is provided for the PIXIE user, experience has shown that elementary operations such as the drawing of lines and simple schematics can be done after only a few minutes familiarisation with the light pen. More sophisticated operations, such as grouping subnetworks or building user symbols, require an appreciation of the modelling philosophy of PIXIE. In particular, one needs to understand the 'level' mechanism which permits selection and manipulation of groups of objects on the screen. However, knowledge of the details of a PIXIE data structure is not

<!-- p.55 / pdf.064 -->

required for operating the system.

Two modes of working are available. In drawing mode one may create or delete sequences of lines and symbols. For more sophisticated operations on the drawing (copying, naming, moving around, etc.) one must enter pointing mode. The system does not prescribe the sequence of actions the user should make in either mode but reacts to illegal operations with messages on the teletype.

### 5.3 Systems description

In this section only a brief summary of PIXIE will be given. Details are discussed in sections 5.4 - 5.7.

The routines needed to transform input to output are summarised in Fig. 5.1. There it is shown that response to the user's actions on the screen and teletype is governed by a real-time program. In drawing mode graphical information added to the picture is entered by an interrupt routine into a temporary display file (TDF); parts of this TDF may be erased by back tracking over the picture. Before moving to another part of the screen the user terminates a connected sequence of line segments and symbols by hitting a light button, which subsequently causes the UP compiler to convert the TDF into data structure. The DOWN compiler then recompiles the new total data structure into a permanent display file (PDF). Thus, the net effect is to integrate the completed segment of the picture into the total picture.

In pointing mode, by pointing with the light pen attention can be directed to component parts of the picture, which blink for easy identification. Then any of the operations

<!-- p.56 / pdf.065 -->

> **Fig. 5.1 — The PIXIE system.** [visual: block diagram showing data flow between central computer and RSP data structure via up/down compilers; TEMP DF and PERM DF feed CRT display; light pen and TTY input to real-time program which writes TEMP DF]

<!-- p.57 / pdf.066 -->

copy, track, erase, group, catalogue, reduce, rotate, create terminals, give name, give value, give type can be performed. Any changes in the graphical information are executed on the data structure and cause a new PDF subsequently to be created from it by the DOWN compiler.

All these processes take place in the PDP and require less time to execute than the user needs for initialising a new process, for example, moving the pen from one light button to another. Thus, the design requirement (b), above, is thought to be met.

#### 5.3.1 Task co-ordination

The PIXIE system consists of stored programs and data as shown in Fig. 5.1. Programs are executed by the CPU of the PDP7/9 whereas some of the data (i.e. the display files) are processed by the display controller of the 340 CRT. Cycle stealing by the display controller allows these activities to be carried out simultaneously. The way in which these two resources are used for the various tasks in PIXIE requires co-ordination.

The program written for this purpose is called WAIT and is entered after initialising the PIXIE system as shown in Fig. 5.2. The initialisation sequence is carried out by setting the address switches on the PDP7/9 to 22 and pressing start. Before entering WAIT some registers are set (in case a previous initialisation left PIXIE in the state of limbo), the clock and display processor are started and all interrupts are enabled.

While in WAIT interrupts may occur which suspend WAIT

<!-- p.58 / pdf.067 -->

REQ = REQUEST
ENT = ENTER
DC = DOWN COMPILER
RET = RETURN
UC = UP COMPILER
DHR = DATA HANDLING ROUTINE
UNL = UNLOCK

> **Fig. 5.2 — The WAIT program.** [visual: flowchart from ENT through SERVICE DHR REQ; diamond decisions for NEED FOR DC, NEED FOR UC, REQ FOR UC, REQ FOR DC with unlock/enter compiler branches; SERVICE OTHER REQ to RET]

<!-- p.59 / pdf.068 -->

and force the execution of a special interrupt routine which itself cannot be interrupted. To secure a fast real time response the number of instructions obeyed to service any given interrupt is kept to the absolute minimum.

If an interrupt requires to initiate a long program or non-reentrant routines (e.g. HSP) then a request is set in the interrupt routine for such a process to be carried out in the WAIT program. Two chains of registers for holding requests and locks are used for activating the programs at the appropriate time. Although most of these programs are data handling routines and are discussed in section 5.6, their scheduling is the responsibility of the WAIT program.

As an example, consider the locking and request mechanism for the UP and DOWN compiler. WAIT will only start either program when a request for doing so has been received. However, no requests for the UP and DOWN compiler can be set while the display controller is processing the PDF. This is to prevent problems such as lightpen interrupts from the PDP during UP compilation which would overwrite and invalidate data from previous interrupts or the occurrence of spurious display modes when the display controller processes the old PDF while the DOWN compiler is generating a new PDF.

The latter occurs if the DOWN compiler enters PDF words into the PDF area in such a way that it 'overtakes' the display controller processing the old PDF or the display controller processing a new, not yet completed, PDF and overtakes the DOWN compiler.

When a demand for the UP or DOWN compiler arises in

<!-- p.60 / pdf.069 -->

one of the light button functions initiated by the user the WAIT program will set an unlocking request for the compiler. The request is sensed at an end of a display file (STOPCODE) in the appropriate interrupt routine. The compiler will then be unlocked and the display controller only be allowed to process the TDF. When resuming processing WAIT at some point the compiler is entered, again with all interrupts enabled. On exit of the UP compiler the PDF is not restarted because it does not represent the current PIXIE data structure. However, a request to unlock the DOWN compiler is set as shown in Fig. 5.2. Only after DOWN compilation has been completed will the PDF be freed for the display controller.

In Fig. 5.2 the servicing of sundry data handling requests is carried out as described above. The data handling routines are described in section 5.6. Servicing of other requests include the tracking mechanism and the processing of messages as already described in the PIXIE manual.

#### 5.3.2 Implementation

All routines in PIXIE are written in PDP7/9 assembly language and occupy about 5K of the satellite's core. At run time a further 1K is occupied by display file and working space, leaving about 2K for the data structure. This set up is adequate to produce drawings containing 30-50 nodes and branches, depending on the amount of grouping, textual information etc. For larger drawings, the services of the main computer have to be called upon. Although the data structure model of any picture generated by or sent to PIXIE

<!-- p.61 / pdf.070 -->

is basically composed of nodes (line segments) and branches (components), the pictures do not need to represent some physical network. A Cartesian co-ordinate graph, for example, can equally well be displayed.

### 5.4 Data representation in PIXIE

In this and the following sections it is assumed that the reader is familiar with the PIXIE manual, Appendix 4. It is important that the representation of data in PIXIE, for example, a network drawing, satisfies the following demands:

(a) it must allow processing by data management programs and application programs;

(b) it must allow efficient processing by real-time programs to secure a fast real-time response;

(c) it must be easy to edit;

(d) it must give the right visual effect;

When designing a data representation these demands have to be examined with respect to the constraints introduced by the hardware which stores and processes the data. On the DEC PDP7/9 and 340 display these are:

(e) a small core store and no backing store;

(f) small repertoire and low speed of machine instruction for the CPU and display controller;

(g) 18 bit word length;

An additional cost constraint was that minimum use should be made of the link to the TITAN computer.

To satisfy demand a) for the RAINBOW system implies some data structure which can represent a network-type drawing

<!-- p.62 / pdf.071 -->

consisting of nodes and branches. This is because most of the programs in a) will require data to reconstruct the topology of the network. Sufficient geometric data, however, must be included in the structure to allow programs to produce a drawing of the network on the graph plotter or to generate a display image on the screen when reloading the data structure file into PIXIE.

An ASP data structure was considered to be suitable for this task particularly for its advantage in compact data representation (Wis 68a). Also, at the time of writing PIXIE it was available on the PDP7.

#### 5.4.1 The PIXIE data structure

On a network level a PIXIE data structure can be considered to consist of nodes and branches. When seen as a picture, however, it consists of a collection of lines and symbols. To represent these two aspects in one structure a number of assumptions have been made:

(a) To keep the data structure simple it should consist of only a few element types. Those of a point, line, subpicture and instance element, were found necessary to represent the relationships in picture parts. They are described in more detail in the PIXIE manual.

(b) A node consisting of one or more lines shall be represented in the data structure by a subpicture element containing pointers to the respective line elements. An example of a subpicture of a node with two lines is shown in Fig.5.3a.

<!-- p.63 / pdf.072 -->

I = INSTANCE
S = SUBPICTURE
L = LINE
P = POINT

> **Fig. 5.3 — Representation of a node.** [visual: (a) subpicture S with pointers to lines L1 and L2; (b) instance I pointing to subpicture S which points to L1 and L2]

> **Fig. 5.4 — Representation of a branch.** [visual: (a) subpicture S with attachment points P1 and P2; (b) instance I pointing to branch subpicture S with P1 and P2]

> **Fig. 5.5 — The grouping mechanism.** [visual: nested rectangles I1/I2 before grouping (a), grouped as I3 (b), and with level marker on third level showing I1 and I2 separately again (c)]

<!-- p.64 / pdf.073 -->

An instance of such a node (of which there may be more than one) is shown in Fig.5.3b. The occurrence of a ringpointer in an instance pointing to the ringstart of a subpicture can be considered to represent symbolically the equivalent of a call to some subroutine. Similar to nested subroutines in a program there can be nested subpictures. Flow of control is considered to pass along the rings.

(c) One or more lines represent a branch if they are contained in a catalogued subpicture with attachment points. An example of a subpicture of a branch with two attachment points is shown in Fig.5.4a. An instance of such a branch (of which there may be more than one) is shown in Fig.5.4b. The catalogue entry pointer (CEP) in the data area of the subpicture points to the display file containing the drawing of the branch. For example, a catalogued resistor can be represented as follows with the catalogue status marker (CST) and (CEP) set to 10000 and 12367 respectively:

> [visual: resistor symbol with vector labels VEC ON 4 10 and VEC ON 10 0 at attachment points]

<!-- p.65 / pdf.074 -->

| Location | Word | Comment |
| --- | --- | --- |
| 12367/ | 32404 | /Block data marker |
| 12370/ | DDS VE 4 | /Save return address in location 4 /and set vector mode |
| 12371/ | VEC ON 10 0 | /Draw vector, grid increments are given /in octal for x and y respectively |
| 12372/ | VEC ON 4 10 | /Ditto |
| 12373/ | VEC ON 10 -20 | /Ditto |
| 12374/ | VEC ON 10 20 | /Ditto |
| 12375/ | VEC ON 10 -20 | /Ditto |
| 12376/ | VEC ON 10 20 | /Ditto |
| 12377/ | VEC ON 10 -20 | /Ditto |
| 12400/ | VEC ON 4 10 | /Ditto |
| 12401/ | VEC ES ON 10 0 | /Ditto and escape from vector to /parameter mode |
| 12402/ | PAR SB | /Set subroutine mode |
| 12403/ | DJP SB 4 | /Set subroutine mode and return |

(d) If a subpicture is catalogued but without attachment points, it is considered to be meaningless. Although such an element can be produced with PIXIE and will have the same visual appearance on the screen as proper subpictures, the drawing routine in PIXIE ensures that no lines are drawn from or to the element. No such checks, however, exist in the tracking routine which allows for such meaningless visual connections.

(e) One or more instances of nodes and branches represent a group if they are part of a subpicture immediately below SAVSUB (described in

<!-- p.66 / pdf.075 -->

the next paragraph). Subgroups can be generated by grouping groups. Up to 8 level groups can be produced in this way with PIXIE. The number 8 is set by the dimension of a special table. As an example consider the simple drawing of Fig.5.5. Before grouping, both items of Fig.5.5a. can be made blinking seperately when the level marker is on the second level. In the data structure of Fig.5.6 this is represented by two instances in the second level. After grouping, the two instances and their respective subpictures have been pushed down in the data structure as shown in Fig.5.7. A new instance I3 is created and put into the second level. The effect on the screen will be that in the second level only I3 (which contains I1 and I2) can be made blinking This is shown in Fig.5.5b. When the level marker is set for the third level, as shown in Fig.5.5c, instances I1 and I2 can be made blinking seperately again.

(f) One subpicture known as SAVSUB in the PIXIE data structure is used to hold all instances of branches and nodes of a drawing. An instance known as SAVINS of this subpicture represents the highest level of a structure and also its entry point.

#### 5.4.2 The temporary display files

In addition to application programs, the PIXIE data structure can also be processed by programs which work in a real-time environment, e.g. data structure editing programs

<!-- p.67 / pdf.076 -->

> **Fig. 5.6 — Data structure before grouping.** [visual: SAVINS/SAVSUB at top with instances I1 and I2 each pointing to subpictures containing S and L elements]

> **Fig. 5.7 — Data structure after grouping.** [visual: new instance I3 and subpicture S added at second level; I1 and I2 pushed down beneath grouped subpicture]

<!-- p.68 / pdf.077 -->

in PIXIE. For user actions, however, which require a fast response such as the drawing and 'undrawing' with the light pen, a different data representation is needed. The TDF and some special stacks have been designed to enable a fast response to the users drawing actions.

When the user has selected drawing mode no updates are made to the PIXIE data structure. All line segments and symbols drawn since the last activation of the S button are entered into the TDF. An example of a TDF for the RCL circuit of Fig. 5.8. is shown below. All numbers are given in octal.

| Address | Instruction | Octal | Comment |
| --- | --- | --- | --- |
| TEMPDF 0/ | PAR PO SCO IN7 | : 30117 | /Scale 0, intensity 7 |
| TEMPDF 1/ | POH PO 330 | : 20330 | /Set x co-ordinate register /and set point mode |
| TEMPDF 2/ | POV VE ON 1076 | : 303076 | /Set y co-ordinate register /and set vector mode |
| TEMPDF 3/ | VEC ON 0 164 | : 272000 | /Draw vector |
| TEMPDF 4/ | VEC ON 177 0 | : 200177 | |
| TEMPDF 5/ | VEC ES ON 54 0 | : 600054 | /Escape |
| TEMPDF 6/ | PAR SB | : 160000 | /Set subroutine mode |
| TEMPDF 7/ | DJS VE RES1 | : 702443 | /Display jump and save /to resistor subpicture |
| TEMPDF 10/ | PAR VE | : 100000 | |
| TEMPDF 11/ | VEC ON 140 0 | : 200140 | |
| TEMPDF 12/ | VEC ON 0 -177 | : 377400 | |
| TEMPDF 13/ | VEC ES ON 0 -34 | : 716000 | |
| TEMPDF 14/ | PAR SB | : 160000 | |
| TEMPDF 15/ | DJS VE CAP2 | : 702552 | /Display jump and save to /capacitor subpicture |
| TEMPDF 16/ | PAR VE | : 100000 | |
| TEMPDF 17/ | VEC ON 0 -177 | : 377400 | |
| TEMPDF 20/ | VEC ON 0 -10 | : 304000 | |
| TEMPDF 21/ | VEC ES ON -142 0 | : 600342 | |

<!-- p.69 / pdf.078 -->

| Address | Instruction | Octal | Comment |
| --- | --- | --- | --- |
| TEMPDF 22/ | PAR SB | : 160000 | |
| TEMPDF 23/ | DJS VE IND3 | : 702651 | /Display jump and save to /inductor subpicture |
| TEMPDF 24/ | PAR VE | : 100000 | |
| TEMPDF 25/ | VEC ON -177 0 | : 200377 | |
| TEMPDF 26/ | VEC ON -60 0 | : 200260 | |
| TEMPDF 27/ | VEC ES ON 0 166 | : 673000 | |
| TEMPDF 30/ | PAR SB | : 160000 | |
| TEMPDF 31/ | DJP PA TOTEMP 1 | : 400121 | /Display jump |

RES1, CAP2, IND3 are the entry points of display subroutines which are a part of the PIXIE system. As can be seen, no branch or node information is explicitly shown in the TDF. Deleting is achieved by updating the TDF on a last in first out method, i.e. the most recently drawn line segment or symbol is deleted first.

Because all vectors in the TDF are relative and the tracking cross which provides the end point of the current line segment works on absolute positioning, a co-ordinate stack is used to speed up the undrawing action. This stack holds the absolute position of all lines drawn. An example of the state of this and some other stacks while drawing the last line of Fig.5.8 is given on the next page.

<!-- p.70 / pdf.079 -->

> [visual: three stacks — Co-ordinate stack (X1 Y1 … X8 Y8), Symbol stack (0, 0, -1, 0, 1, 0, -1, 0), Direction stack (-1, 3, 0, 0, 1, 1, 2, 2)]

A 0 is entered in the symbol stack when there is no symbol after the line, a -1 or +1 indicates a symbol in the x or y direction respectively. A -1 is entered in the direction stack when the starting point is stacked. When returning to this entry after popping the stack the drawing program is re-initialised. The other entries in the direction stack are similar to the direction markers of table 3 in section 11 of the PIXIE manual.

As an example, consider lines L8 and L7 to be undrawn by the light pen. The co-ordinates X8, Y8 and X7, Y7 will be popped from the stack as well as a 0 and -1 from the symbol stack.

<!-- p.71 / pdf.080 -->

> **Fig. 5.8 — RCL circuit.** [visual: rectangular RCL loop with coordinate labels X1,Y1 through X8,Y8 and line labels L1–L8; resistor on top, capacitor on right, inductor on bottom]

> **Fig. 5.10 — Drawing of the PDF of Fig. 1.9.** [visual: vertical branch from B1 through L1 to B2, resistor R1 to B3, L2 down and L3 horizontal to right; nodes N1 and N2 labelled]
<!-- PDF index range: 081–103. Thesis pages found: 72–94 (continues mid-section from prior agent; next agent starts at pdf 104). -->

<!-- p.72 / pdf.081 -->

The -1 will give the program the directive to allow the light pen to be positioned anywhere over the inductor without erasing it. Only when the light pen reaches line L6 will the inductor also be popped from the PDF.

Information about the drawing direction could equally well be calculated from the co-ordinate stack rather than unstacked from the direction stack. The philosophy followed, however, was to minimise CPU time in interrupt routines and the use of a direction stack assists in achieving this.

<!-- p.73 / pdf.082 -->

> **Fig. 5.9 — A PDF.** [visual: display-file listing for the circuit of Fig. 5.10; DJS/DDS pairs save atnames (SAVINS, N2, L2, L3, B1, N1, L1) and vector/label instructions for each element.]

```
12601/ 34117  /PA FO PN SCO IN7
12602/ 221777  /POV PC 1777
12603/ 160001  /POR SB 0001
12604/ 772506  /DJS SB
12605/ 3000
12606/ 372627  /DDS SB<END INST>     //WHEN EXECUTED, TAKES THE RETURN ADDRESS IN ASR
12607/ 772611  /DDS SB .+2           //GENERATED BY THE PREVIOUS DDS ADDING A DJP
12610/ 52235   /<NAME OF SAVINS>     //AND PUTS IT INTO THE ADDRESS GIVEN IN THE
12611/ 213401  /DDS <SAVE ADDR>      //DDS INSTRUCTION
12612/ 100100  /PAR VE SCO           //AS PREVIOUS DDS
12613/ 177524  /VEC                  //POSITION BEAM
12614/ 177525  /VEC
12615/ 557500  /VEC ES
12616/ 100000  /PAR VE
12617/ 512005  /VEC ES 5 -24         //OFFSET FOR START OF LABEL
12620/ 60120   /PA CH SC1
12621/ 606037  /CO ES                //LABEL OF SAVINS, I.E. CO
12622/ 100100  /PAR VEC SCO
12623/ 412235  /VEC ES               //RETURN BEAM TO POSITION BEFORE LABEL
12624/ 160000  /PAR SB
12625/ 772743  /DDS SB <SUBPICTURE>
12626/ 160000  /PAR SB
12627/ 412605  /DJP                  //RETURN ADDRESS ENTERED ON EXECUTION OF DDS
12630/ 372650                         //AT BEGIN OF INST ROUTINE
12631/ 772633
12632/ 53450   /<NAME OF N2>
12633/ 213402
12634/ 100100  /PAR VE SCO
12635/ 177400
12636/ 521400
12637/ 100000  /PAR VE
12640/ 512005  /VEC ES
12641/ 60120   /PAR CH SC1
12642/ 606337  /03 ES                //LABEL OF N2, I.E. 03
12643/ 100100  /PAR VE SCO
12644/ 412235  /VEC ES
12645/ 160000  /PAR SB
12646/ 772551  /DDS SB <SUBPICTURE>
12647/ 160000
12650/ 412746  /DJP
12651/ 212667  /DDS
12652/ 160000
12653/ 772655
12654/ 52475   /<NAME OF L2>
12655/ 213403
12656/ 100100  /PAR VEC SCO
12657/ 766000  /VEC ES -Y
12660/ 160000
12661/ 772663
12662/ 52216   /<NAME OF L3>
12663/ 213403
12664/ 100100  /PAR VEC
12665/ 600120  /VEC ES +X
12666/ 160000
12667/ 412647
12670/ 372710
12671/ 772573
12672/ 52340   /<NAME OF B1>
12673/ 213402
```

Continued

<!-- p.74 / pdf.083 -->

```
12674/ 100100  /PAR VEC SCO
12675/ 177400
12676/ 521400
12677/ 100000  /PAR VE
12700/ 512005  /VEC ES
12702/ 606237  /02 ES                //LABEL OF B1, I.E. 02
12706/ 772370  /DJS <SUBPICTURE>      //DJS TO DISPLAY FILE OF RESISTOR IN DATA
                                      //STRUCTURE (BLOCK DATA)
12710/ 160000
12711/ 372711
12712/ 772733
12713/ 52266   /<NAME OF N1>
12723/ 606137  /01 ES                //LABEL OF N1, I.E. 01
12727/ 772732  /DJS <SUBPICTURE>
12731/ 412727  /DJP
12732/ 212753  /DDS
12735/ 52313   /<NAME OF L1>
12743/ 212753  /DDS PA
12745/ 772630  /DJS <N2>
12747/ 772670  /DJS <B1>
12751/ 772711  /DJS <N1>
12753/ 412626  /DJP <return>
```

<!-- p.75 / pdf.084 -->

### 5.4.3 The permanent display file

Although parts of the PIXIE data structure represent pictorial data it is not in the format required to drive the display controller which produces the corresponding image on the screen of the CRT display. To drive the controller directly from a PIXIE like data structure would necessitate a program for generating windowed display commands fast enough to maintain the refresh rate. Such a program would make CPU time scarce and therefore disable the real-time drawing actions.

The PDF is a data representation in PIXIE designed to overcome this problem. It provides the interface between the user on the screen and his data structure in core. A data structure is traversed only once to produce a PDF. The PDF is then processed by the display controller until the user initiates some editing actions, e.g. pointing at or manipulating items in the PDF.

All lines, subpictures and instances in a PIXIE data structure are represented in a similar hierarchical structure in the PDF. Special pointers are included in the PDF which point to the corresponding elements in the PIXIE data structure. In the PDF of Fig.5.9 such pointers can be seen in location 12610, 12632, 12654, 12662, 12672, 12713 and 12735. All pointers point to the atnames of the respective data structure elements, e.g. the data structure of the drawing of Fig.5.10. A simplified representation of the PDF of Fig. 5.9 is given on the next page.

<!-- p.76 / pdf.085 -->

> **Fig. 5.10 — Simplified representation of the PDF of Fig. 5.9.** [visual: vertical memory map with curved return/jump arrows linking SAVINS, instances of N2/B1/N1, their subpictures, and SAVSUB; addresses 12601–12753 labelled at right.]

| Address | Label |
| --- | --- |
| 12601/ | START OF PDF |
| 12606/ | START OF SAVINS |
| 12627/ | END OF SAVINS |
| 12630/ | START OF INSTANCE OF N2 |
| 12650/ | END OF INSTANCE OF N2 |
| 12651/ | START OF SUBPICTURE OF N2 |
| 12667/ | END OF SUBPICTURE OF N2 |
| 12670/ | START OF INSTANCE OF B1 |
| 12706/ | JUMP TO SUBPICTURE DISPLAY FILE |
| 12710/ | END OF INSTANCE OF B1 |
| 12711/ | START OF INSTANCE OF N1 |
| 12731/ | END OF INSTANCE OF N1 |
| 12732/ | START OF SUBPICTURE OF N1 |
| 12742/ | END OF SUBPICTURE OF N1 |
| 12743/ | START OF SAVSUB |
| 12753/ | END OF SAVSUB |

<!-- p.77 / pdf.086 -->

The pointers to the atnames of lines and instances are saved automatically during execution of the display in a table known as the name list. The mechanism described below is attributed to J.V. Oldfield. It consists of maintaining the name list by executing a Display Jump and Save (DJS) and a Display Deposit and Save (DDS) instruction of the format given below.

```
        DJS LAB2
LAB1,   <NAME>
LAB2,   DDS LAB3
```

DJS preserves the current content of the Display Address Counter, i.e. LAB1, in the Address Save Register (ASR) and then jumps to the address given, i.e. LAB2. The DDS instruction then writes the content of the ASR and some special bits into the address given, i.e. LAB3. Many such combinations of DJSs and DDSs can be found in a typical PDF. Suitable selection of the LAB3 and the `<NAME>` by the DOWN compiler enables the building of a list which reflects the multilevel PIXIE data structure of a drawing. The `<NAME>` is a duplicate of the atname of an instance or line element in the data structure.

On executing a PDF, for example, the file shown in Fig. 5.9, such a name list is generated. Entries in this list are required by the UP compiler and by pointing mode routines when amending and editing the data structure.

The name list for Fig. 5.9 at the time L3 is being drawn, e.g. the Display Address Counter contains 12666, is as follows:

<!-- p.78 / pdf.087 -->

```
13401/ 412610      //SAVINS
13402/ 412632      //N2
13403/ 412662      //L3
13404/ 0
13405/ 0
13406/ 0
13407/ 0
13410/ 0
```

On a light pen hit a routine snapshots the name list. WAIT then uses this list maybe to induce blinking. The following peculiarity, however, should be noted. Referring again to Fig. 5.9 when B1 is drawn the name list changes to

```
13401/ 412610      //SAVINS
13402/ 412672      //B1
13403/ 412662      //L3
13404/
13405/
13406/
13407/
13410/
```

As can be seen L3 is still in the table. This will result in L3 blinking when the level marker is set to the 3rd level even though the user may have pointed at the resistor. Although an unexpected result, the visual effect obtained on the screen gives appropriate feedback to the user and therefore it was not considered worth the effort to correct this feature.

<!-- p.79 / pdf.088 -->

There are various limitations in the 340 display hardware which have produced some restrictions on the actions available:

(a) Limited vector length. This has made it impossible to edit the PDF, for example, during tracking. A fresh downcompile is required for almost every action. Real-time responses are delayed correspondingly.

(b) No scissoring. The window calculations are ponderous and slow.

(c) No subroutine/stack. The non-ideal naming system just described is a direct result of the lack of this facility.

All these limitations have either slowed the program response and/or lengthened the display file or program.

### 5.5 The real-time program

The real-time program (RTP) consists of a set of routines responsible for the service of interrupts on the PDP7/9. Devices which can interrupt the CPU include the light pen, display processor, keyboard, teleprinter and clock.

Interrupts are hardware detected only if the interrupt enable bit is set. On interrupts the hardware saves the program counter in location 0 and unsets the interrupt enable bit. Control is then transferred to a location which in our case contains a jump to a routine in PIXIE which saves the content of the accumulator, identifies the device causing the interrupt and enters the appropriate servicing routine. After terminating the routine the accumulator is re-loaded

<!-- p.80 / pdf.089 -->

with the saved value, the interrupt enable bit set and control returned to the proper location in the interrupted program.

#### 5.5.1 Light pen interrupts

The light pen can 'see' three different kinds of information on the screen, i.e. the tracking cross, light buttons and PDF. A light pen hit will stop any further display processing until it is resumed by an appropriate program instruction. Such an instruction is given at the end of the light pen service routines for the tracking cross, light buttons and PDF.

*Tracking cross*

A very simple routine which does not require any calculation services the tracking cross. In the picture below the tracking cross is shown to be smaller than the field of view of the light pen.

> [visual: in-text diagram — small + cross at X₁,Y₁; circle = pen field of view; cross repositioned to X₂,Y₂ on left edge of circle; arrow shows pen movement direction.]

The follow routine simply takes the first hit of any arm of the tracking cross to update the cross position. Thus, the cross is repositioned from X₁, Y₁ to X₂, Y₂ on the first interrupt and then stays there, on the edge of the field of view until the light pen is moved.

Whether the tracking cross will be able to follow the light pen, for example, in the direction indicated, depends on the refresh rate of the tracking cross. If no other information

<!-- p.81 / pdf.090 -->

needs to be processed by the display controller a refresh rate of several kilo cycles/sec is possible. No tracking problems are likely to occur at such speeds. When larger display files have to be processed, however, such as TDF and PDF, refresh rates may be as low as 10-20 cycles/sec. If for this refresh rate the pen movement is greater than 1 inch/sec and the arm length of the tracking cross does not exceed 1/10th of an inch it is easily seen that some additional facility is needed to maintain 'smooth' tracking. A spiral of about twice the cross size has been used for this purpose in PIXIE successfully. The spiral is displayed only when the tracking cross 'seen' and updated during the previous refresh cycle fails to be 'seen' by the light pen during the current refresh cycle.

*Light buttons*

With each light button on the screen is associated a segment of program. The address of this program is kept in store location 3 or 5 at the time the light button display commands are processed by the display controller. Addresses for light buttons which insert symbols are entered into location 5, all remaining light buttons are in location 3. This is because some common test is carried out on all routines accessed via location 5, e.g. whether the system is in drawing mode with horizontal/vertical constraint, and at least one line is drawn between symbols. More detailes about the meaning of the light buttons is given in the PIXIE manual.

*Permanent display file*

If the light pen hit comes from the PDF the tracking

<!-- p.82 / pdf.091 -->

cross will be relocated to the pen position. A test is then made whether a request is set by any of the control light buttons for copy, group and erase. If so, this PDF interrupt will be ignored by the system because it could have occurred accidentally due to a control light button being located physically near or 'over' the PDF.

When the system is in pointing mode a copy of the name list will be made which is used by a routine in WAIT which serves the blinking request. When the user draws, two copies of the name list can be preserved for the UP compiler giving the state of the name list at the start and end of the TDF. That is, if any pen hits on the PDF occurred while drawing. Otherwise, only one copy will be made to be used by a routine in WAIT which moves the tracking cross to the end of a line or attachment point if the pen hit was near to it.

#### 5.5.2 Display controller interrupts

STOPCODES in display files or edge violations cause the display controller to produce an interrupt. When a STOPCODE is found at the end of the TDF (more accurately at the end of the tracking cross which follows the TDF) or the PDF a STOPCODE servicing routine is entered. A few tests are then made as shown in Fig.5.11 and the display controller will be started to process the display file next after the one which caused the STOPCODE. In case no PDF is present this will always be the TDF.

Edge violations are processed as described in Fig.5.12. A PDF edge violation can occur when the start and end point

<!-- p.83 / pdf.092 -->

> **Fig. 5.11 — STOPCODE interrupts.** [visual: flowchart — ENT → REQ RESET TDF? (YES→RESET TDF) → REQ UNLOCK COMPILER? (YES→REQ COMPILER) → RESTART TDF OR PDF → RET.]

> **Fig. 5.12 — Edge violation interrupts.** [visual: flowchart — ENT → PDF INT? (NO→SHIFT CROSS) → START TDF → RET; note: INT = INTERRUPT.]

<!-- p.84 / pdf.093 -->

of a catalogued symbol fall within the window area (specified to the windowing routine of the DOWN compiler) but some of the line segments of the symbol fall outside this area. It is left to the user to track the symbol to a location which does not produce an edge violation in order to see the remaining parts of the PDF.

#### 5.5.3 Keyboard interrupts

Characters typed on the keyboard are processed by the interrupt routine INP. If an output of a message is in progress the keyboard flag will be cleared and no action taken. Also, if a response to a previous message typed on the keyboard has not been received (e.g. a ? or line feed) only the keyboard flag will be cleared.

#### 5.5.4 Teletypewriter interrupts

Output messages for the user are given on the teleprinter. An output of a message is initiated by a call to MESOUT in the WAIT program. As the case may be, this routine terminates any incoming message or waits for completion of outgoing message still in progress. The first character of the message is then loaded into the printer buffer and control returned to the calling program. All remaining characters of the message are loaded into the buffer by the interrupt routine OUT at approximately 100 msec/character.

#### 5.5.5 Clock interrupts

The real time clock is set such that it sets a flag approximately every ½ second. The clock routine entered is

<!-- p.85 / pdf.094 -->

described in Fig.5.13. Following the servicing of the blinking mechanism, i.e. the setting of intensity bits in the PDF, is the code which deals with switching and rotating light buttons. Although control light buttons A and B are displayed in alternation when seen by the light pen their operation is considered to be rotating rather than switching. This is because more than the currently two sets of basic symbols can be implemented and connected to light buttons if their associated display files are suitably small.

It is left to the user not to leave the light pen shutter open over the light buttons, S, F, A and B for longer than ½ second if only one entry into an associated code is desired. The setting to ½ second was based on experience gained with using the system.

#### 5.5.6 Drawing mode

The code of the interrupt program which deals with the various light buttons in drawing mode is shown in Fig. 5.14 and 5.15. When PIXIE is initialised or when the light button DR is pointed to by the light pen, drawing mode is entered. Active drawing of line segments, however, can take place only when pointing at S and when none of the compilers are busy. This is because the old TDF is only reset (i.e. deleted) when the UP compiler has finished processing and the DOWN compiler has generated a new image of it in the PDF.

Using information in the first copy of the name list (see section 5.5.1) some proximity tests are made in the S light button routine to establish whether the first line of the new TDF should start on some item in the PDF. Only the last

<!-- p.86 / pdf.095 -->

> **Fig. 5.13 — Clock interrupts.** [visual: flowchart — ENT → PDF IN CORE? (YES→SERVICE BLINK) → IN ACTIVE DRAW MODE? (YES→SET F CLB / NO→SET S CLB) → EXTENDED PIXIE? (NO→SERVICE ROTATING LBS) → SET CLOCK TO 1/2 SEC → RET; CLB = CONTROL LIGHT BUTTON.]

> **Fig. 5.14 — DR, HV, and RU command light buttons.** [visual: flowchart — ENT → SWITCH ON COMMAND LBS FOR DR MODE → branches DR (SET PROPER CONTROL LBS, STOP BLINK IF BLINK SET, RET), HV (SET HV DRAW MODE, RET), RU (SET RU DRAW MODE, RET); LBS = LIGHT BUTTONS.]

<!-- p.87 / pdf.096 -->

> **Fig. 5.15 — S and F control light buttons.** [visual: flowchart — ENT → SWITCH ON CONTROL LBS FOR DR MODE → S branch: COMPILER BUSY? / IN POINTING MODE? / LAST PDF INT NEAR CROSS? → SET REQ FOR DMR IN WAIT → SET ACTIVE DRAW MODE → SET OTHER REGISTERS → SET CLOCK TO 1/2 SEC → RET; F branch: SET CLOCK TO 1/2 SEC → UNSET ACTIVE DRAW MODE → LAST PDF INT NEAR CROSS? (YES→SET REQ FOR DMR IN WAIT, TERMINATE LINE ON PDF; NO→SET DEMAND TO UNLOCK PDF) → RET.]

<!-- p.88 / pdf.097 -->

interrupt data from the PDF will be used for this test. The Data Handling Routine (DHR) tests whether the drawing rule for joining to nodes and attachment points is not violated. If an interrupt from the PDF occurs after the tracking cross has been moved and the distance from the original tracking cross (i.e. when pointing at S) is less than 1/4 inch, a test will still be made in the DHR whether to join the line to PDF.

Apart from setting the active draw mode indicator other registers set include pointers to the drawing stacks and co-ordinate registers. The clock is set to enable the switch to the F button after 1/2 second.

Similar proximity tests are made in the F routine to ensure that the last line segment terminates on the PDF if an appropriate interrupt occurred before pointing at F. Again, the DHR will test whether any drawing rule is violated and if so, prohibit the TDF from being compiled.

#### 5.5.7 Pointing mode

When the light button PO is pointed to by the light pen a test is made whether the system is not in active draw mode; only then will the control light buttons for pointing mode be displayed and any blinking stopped. Figs. 5.16, 5.17, 5.18, and 5.19 show the code of the interrupt program which deals with the various light buttons in pointing mode.

Due to the limited core store available for program code a number of desirable actions are not implemented but will be tested for in the interrupt routines and rejected. For example, error messages will be given when an attempt is made to catalogue (CA), reduce (RE), rotate (RO), copy (C), or group

<!-- p.89 / pdf.098 -->

> **Fig. 5.16 — PO, AT and CA command light buttons.** [visual: flowchart — ENT → SWITCH ON COMMAND LBS FOR POINTING MODE → PO (IN ACTIVE DRAW MODE?→RET; else SET PROPER CONTROL LBS → STOP BLINK → RET), AT (ITEM BLINKING?→RET; else REQ HITPOINT → STOP BLINK → RET), CA (ITEM BLINKING?→RET; SAVING BLINKING?→REQ ERROR / else REQ CATALOGUE STOP PDF → STOP BLINK → RET).]

<!-- p.90 / pdf.099 -->

> **Fig. 5.17 — RE, RO and EN command light buttons.** [visual: flowchart — ENT → SWITCH ON COMMAND LBS IN POINTING MODE → RE (ITEM BL?→RET; SAVING BL?→REQ ERROR / else REQ REDUCE → STOP BLINK → RET), RO (ITEM BL?→RET; SAVING BL?→REQ ERROR / else REQ ROTATE → STOP BLINK → RET), EN (STOP GROUP → STOP BLINK → RET); BL = BLINKING.]

<!-- p.91 / pdf.100 -->

> **Fig. 5.18 — C, E and T control light buttons.** [visual: flowchart — ENT → SWITCH ON COMMAND LB'S IN POINTING MODE → C (ITEM BL?→RET; SAVING BL?→REQ ERROR / else REQ COPY → STOP BLINK → RET), E (ITEM BL?→RET; SAVING BL?→RESTART PIXIE / else REQ ERASE → STOP BLINK → RET), T (ITEM BL?→RET; else REQ TRACK → STOP BLINK → RET).]

<!-- p.92 / pdf.101 -->

> **Fig. 5.19 — M, L and G control light buttons.** [visual: flowchart — ENT → SWITCH ON CONTROL LBS FOR POINTING MODE → M (DISABLE CLBS FOR 1/2 SEC → ON TOP LEVEL?→STOP BLINK / else INCREASE LEVEL MARKER → STOP BLINK → RET), L (DISABLE CLBS FOR 1/2 SEC → ON LOWEST LEVEL?→STOP BLINK / else DECREASE LEVEL MARKER → STOP BLINK → RET), G (ITEM BL?→RET; SAVING BL?→REQ ERROR / else REQ GROUP → STOP BLINK → RET).]

<!-- p.93 / pdf.102 -->

(G) SAVINS. If these verbs were allowed the program code added would be for building a new SAVINS and SAVSUB and interconnecting them with the old structure.

The meaning of the other parts of the interrupt code is self-explanatory and will not be discussed further.

#### 5.5.8 Keyboard commands

Although the characters typed on the TTY are read into the system with an interrupt routine, the checking, whether they are part of a command or data entry, is done in the WAIT routine after the final carriage return. If nothing is blinking, then they are treated as a command and the program code shown in Fig.5.20 is entered.

The test on the first 3 characters consists of shifting and adding the characters into a special word called SUMB which is then compared with a table containing all legal commands. For example, if the character string starts with UNL and the initial content of SUMB = 0, the shift is 6 to the left and the characters are in ASCII, then the final content of SUMB is obtained as follows:

| SUMB | ACTION |
| --- | --- |
| `000 000 000 011 010 101` | / shift SUMB and add U |
| `000 011 011 000 001 110` | / shift SUMB and add N |
| `011 000 010 001 001 100` | / Shift SUMB and add L |

<!-- p.94 / pdf.103 -->

> **Fig. 5.20 — Teletypewriter commands.** [visual: flowchart — ENT → TEST FIRST 3 CHARACTERS → IS COMMAND? (NO→TYPE?→RET) → SWITCH ON TELETYPEWRITER COMMAND → LABEL (REQ LABEL) / UNLABEL (REQ UNLABEL) → DS IN CORE? (YES→UNLOCK DS → RET), START (START PIXIE → RET), GRID (SET GRID → PUT CROSS ON GRID POINT → RET), TITAN (EXECUTE LINK → ERROR IN TRANSFER? → REQ ERROR / UNLOCK DS RESTART PIXIE → RET); DS = DATA STRUCTURE.]
<!-- PDF index range: 104–127. Thesis printed pages: 95–118. End of Ch.5 §5.6; §5.7 not reached (expected ~p.120). -->

Currently the table contains only 5 entries. In octal
they are:

        170402        /  LABEL
        302114        /  UNLABEL
        271424        /  TITAN
        122511        /  GRID
        262701        /  START

As can be seen, the 2nd entry in the label matches the SUMB
obtained above. The code belonging to the various commands
is shown in Fig.5.20 and is not discussed further.

<!-- p.95 / pdf.104 -->

### 5.6 Data handling routines

       As indicated in section 5.3.1, data handling routines, in
particular those which require RSP routines are executed
outside the real-time program. Two of these routines in
particular, make PIXIE different from other interactive
graphic systems. These are the UP compiler and the DOWN compiler
(UP and DOWN are derived from the manner in which Fig.5.1 is
drawn).

       The reason for having an UP and DOWN compiler is based
on ergonomic consideration, that is, to allow the user of
PIXIE to draw and erase consecutive sequences of lines and
symbols on the screen as fast as with pencil and paper (or
faster). No data structure handling is required until it is
convenient for the user (i.e. by pointing at light button F).

#### 5.6.1 The UP compiler

       The UP compiler is responsible for creating and
amending the data structure from the information contained
in the temporary display file and, if applicable, some
interrupt data. Fig.5.21 shows the flow of control of the
UP compiler. On entry a test is made whether a data
structure is already in core. If this is not the case an
instance element named SAVINS is created which serves to
reference the data structure to be generated. A subpicture
element is then connected to SAVINS. All node, branch and
grouped instances of a drawing will be attached to this
subpicture.

       To prevent duplicating subpictures of basic symbols
in the data structure a list is set up into which pointers
to the atnames of catalogued symbols are inserted. Then an
instance and subpicture for the first node is generated;
this is because the drawing rule requires the TDF always to
start with one or more lines.

       Generation of line elements and subsequent branches
and nodes (if any) are carried out by the subroutine FOLBL
as shown in FIG.5.22. The input to this routine consists
only of the TDF. It equally well could have used the
information contained in the stacks for the undrawing
mechanism but using the TDF only keeps the interface simpler
although it increases the complexity of the UP compiler.

       The test for a line in FOLBL consists of examining
the TDF for a vector word. If such a word exists a line
element is generated with the start and the end points of
the line calculated from the respective vector word(s).

<!-- p.96 / pdf.105 -->

> **Fig. 5.21 — The UP compiler.** [visual: flowchart from ENT; if DS not in core create SAVINS/SAVSUB, symbol list, node instance/subpicture, enter FOLEL; if DS in core prepare name list and branch on pen hits at start/end/both of TDF to AMEND0/AMEND1/AMEND2 or find start position.]

> **Fig. 5.22 — Routine FOLEL.** [visual: loop over TDF creating lines into subpicture, then symbols, then node instances/subpictures; INST = INSTANCE, SUBP = SUBPICTURE.]

<!-- p.97 / pdf.106 -->

       The TDF is scanned by FOLBL to find all lines which are part of a node. Then a test for a symbol is made. A symbol can be detected through a subroutine call to a built-in display file. After generating the data structure for a symbol (if any) a test for a further node is made and so on. A 'DJP PA \<address>' display word terminates this process. Returning to Fig.5.21 a brief description will be given of how new information is added to the data structure already in core. A test is made of how the current line sequence in the TDF interconnects with the PDF. Different possible arrangements are given in Fig.5.23 with Fig.5.23a showing the initial PDF. The displayed printnames of the nodes and branches give an indication of how the other drawing parts have been added to the data structure. Only the first and last line of a TDF are allowed to join to the PDF, all other lines are considered to be crossovers.

       In the following paragraph it is assumed that pen hits occur only on line segments of the PDF which belong to nodes. Interrupts on line segments of branches (i.e. catalogued display files) will be discussed in a subsequent paragraph.

*Light pen hits on nodes*

       If a pen hit occurred at the start of the TDF only, a routine called AMEND0 will calculate the proper position for the first line to be entered into the respective node in the data structure. The rest of the TDF is then processed using FOLBL.

       For a pen hit only at the end of the PDF as in Fig.5.23f routine AMEND1 tests whether there are any catalogued symbols in the TDF. If not, each line in the TDF is simply added to

<!-- p.98 / pdf.107 -->

> **Fig. 5.23 — Amendments to the PDF.** [visual: four panels (a)–(d) showing two horizontal resistor branches (01–06) progressively joined by vertical segments and a loop, ending with resistors 07–08 and terminal 09.]

<!-- p.99 / pdf.108 -->

the respective node in the data structure. In case a symbol
is found the start of the TDF is calculated with respect to
SAVINS and FOLBL is called to process the TDF. After the
symbol is processed a test is made whether there are any
other symbols in the TDF. If not, each line after the last
symbol is added to the node which caused the interrupt.

       Pen hits at the start and end of the TDF as in
Fig.5.23b, c and d are processed by routine AMEND2. If the
TDF contains no symbols and both the start and end of the TDF
include amendments to the data structure then the two
corresponding nodes must be short circuited. An example of
this is shown in Fig.5.23b. Each line of the second node
and the TDF will be added to the first node. The instance
and subpicture of the second node are then deleted from the
data structure. If a symbol can be found in the TDF all
processing is similar to AMEND0 and AMEND1.

*Light pen hits on branches*

       A connection of a line sequence to a branch is
permitted by the drawing rule to be on attachment points
only, i.e. the pen hit on a branch must occur within a small
radius (10 grid positions) of an attachment point. Light
pen hits on branches which are not in the vicinity of an
attachment point and which occur at the beginning or the end
of the PDF will prohibit drawing or amendment of the data
structure respectively.

       Any line sequence starting or terminating with an
interrupt on an attachment point will not be connected to
any other line of a node also in the vicinity of the attachment
point. This is because only the last interrupt will be

<!-- p.100 / pdf.109 -->

saved by the system. If a connection to such a node is desired it is left to the user to assure that the interrupt will be on the node.

#### 5.6.2 The DOWN compiler

       Details about the DOWN compiler have been given
elsewhere (Wis 68b). Changes which have since been
incorporated include:
(a) No temporary cataloguing
(b) A mechanism for displaying printnames of instances
(c) Maintenance of an active list containing the
    addresses of all basic symbols.
(d) A faster windowing routine

*No temporary cataloguing*

       Two different modes of cataloguing have originally
been employed in PIXIE, these were permanent and temporary
cataloguing. A subpicture element is permanently catalogued
if it does not contain any ringpointers pointing to instances
or lines. In addition it must be identified by a 10000 in
its catalogue status (CST) word (see Table 2 in the PIXIE
manual).

       Temporary cataloguing was used to shorten the PDF and
downcompile time for subpictures which had ringpointers to
instances or lines. Once the display file for these items
was generated then the display of an instance of this
subpicture was carried out by simply inserting a reference
pointer in the catalogue entry point (CEP) word. If more
than one instance of this subpicture existed no new display
file needed to be generated. Since the length of the display

<!-- p.101 / pdf.110 -->

file could alter from one DOWN compilation to the next,
new entries into the CEP and CST were necessary at each
compilation. For this purpose an indicator word, CHK, was
maintained by the compiler to validate the cataloguing
mechanism.

       Experience with the system showed that multiple
instances of non-permanently catalogued subpictures (i.e.
nodes) rarely occured. This resulted in abandoning the
temporary cataloguing mechanism for the purpose of saving
core store and reducing compile time. In addition, no
special global uncataloguing of all temporary catalogued
subpictures in case of edge violation is now necessary.

*Displaying printnames*

       An option is available which allows the user of
PIXIE to see the printnames of instances displayed on the
screen. An entry into this code of the DOWN compiler is
achieved by typing LABEL on the teleprinter. The position
of the labels is fixed with respect to the start of the
labelled entity and was obtained by experimenting with
various offsets. Fig.5.9 shows a PDF of a simple drawing
and includes the labelling words, e.g. from location 12617
to 12621 for the labelling of SAVINS. If the first line of
a drawing is not tracked away from its initial position the
printnames of SAVINS and the node to which the line belongs
will occupy the same physical place on the screen.

*Maintenance of a basic symbol list*

       Considerable savings in core store space can be
achieved by keeping an account of all basic symbols which
have been entered into the data structure. A list is

<!-- p.102 / pdf.111 -->

therefore maintained by the DOWN compiler in the list area in which it enters all pointers to the atnames of basic symbol subpictures. This list is interrogated by the UP compiler when it finds a basic symbol in the TDF. The second control word of the symbol in the TDF is compared with the subpicture type word, i.e. the first data word of every subpicture found in the symbol list. As an example, consider the display file of a capacitor with the control words:

```
        12              / 1st control word
        24              / 2nd control word
CAPO,   DDS VE 4
        VEC ON 30 0
        VEC 0 17
        VEC ON 0 - 36
        VEC 20 0
        VEC 0 -17
        VEC ES ON 30 0
        PAR SB
        DJS SB 4
```

       The first control word gives the length of the display file in octal. This number is used to determine the block data length in the list area (could also be calculated, as even a display file with 50 words would take less than 0.5 msec to calculate and would not significantly affect real-time response) into which the display file will be copied by the UP compiler when found in the TDF. The least significant digit in the second control word serves, when copied, as the

<!-- p.103 / pdf.112 -->

subpicture type identifier and the most significant digit(s)
as the element identifier, e.g. 2 for capacitor.

       When a match of the relevant bits of the subpicture
data word with the second control word is found, only a new
instance is built of the subpicture. If the UP compiler
does not find any match a new subpicture is built in addition
to the instance and its address is put into the symbol list.

       Use is made by the DOWN compiler basic symbol and user
generated symbol display files in the list area by simply
inserting a DJS \<subpicture> in the PDF. Location 12706 of
Fig.5.9 is an example of such a call.

*Windowing*

       The part of the DOWN compiler which generates the display
code tests that the required part falls into a specified
rectangle. It is important that the co-ordinates of this
rectangle lie within the scope of the D/A converters of the
CRT deflection hardware, i.e. 10 bits on the DEC 340 display.

       In the old windowing routine a number of linear
equations of the form ax-b=0 had to be solved for every line
to test whether the line or parts of it fell outside the
rectangle (which used to be identical with the screen size).
These equations had also to be solved if a line was outside
the screen in such a way that none of its start or end points
could possibly enter the screen area. For example, consider
in the drawing below a line with start and end points in
region 1 and 3 respectively. It is obvious that a simpler test

```
               1 | 2 | 3
              ---|---|---
               4 | 5 | 6
              ---|---|---
               7 | 8 | 9
```

<!-- p.104 / pdf.113 -->

then solving a number of linear equations can determine
that the line does not enter region 5 (i.e. the screen area).

       In the new windowing routine the following tests
are made:

| | Start point in | End point in | |
| :--- | :--- | :--- | :--- |
| region | 1 | 1, 2, 3, 4, 7 | no action |
| region | 1 | 5, 6, 8, 9 | solve equations |
| region | 2 | 1, 2, 3 | no action |
| region | 2 | 4, 5, 6, 7, 8, 9 | solve equations |
| region | 3 | 1, 2, 3, 6, 9 | no action |

etc

       Region 5 is a rectangle reserved as the drawing area
and a small margin of the leftmost part of region 6 is
reserved for command light buttons.

       A considerable saving in downcompile time is made
particularly for drawings where many line segments fall
outside region 5.

<!-- p.105 / pdf.114 -->

#### 5.6.3 Sundry routines

       A number of data handling routines other than the UP and DOWN compilers are available for editing and parsing a data structure. They are entered from WAIT when requested. Generally, such requests are sent when the user points at the PDF or at one of the verbs displayed as light buttons on the screen or when messages are typed on the keyboard.

       Many of the data handling routines are implemented as program segments within WAIT and are made up of a number of statements and subroutine calls. Fig.5.24 shows a more detailed flow chart of the WAIT program indicating the name of the segment entered when a data handling request is issued.

       According to the program structure of WAIT, requests are processed sequentially. For example, while an attachment point request is executed a request to process a pen interrupt on the PDF will be delayed until the first process is terminated, some other requests are examined, WAIT exited and reentered and possibly an error message initiated. Also, some interrupt routines may have been executed during this time in addition to the one which set the request mentioned. These delays do not significantly increase the real-time response to the user on the screen. This is due to dedicating a CPU to the PIXIE system. Time-sharing the CPU could, however, lead to unacceptable response time.

       Parallel processing of some of the requests would be possible in a multiple CPU environment, e.g. an error request with any other request of FIG.5.24. With re-entrant RSP routines also the example given above (i.e. PDF pen interrupts and attachment point requests) could be processed in parallel.

<!-- p.106 / pdf.115 -->

> **Fig. 5.24 — The WAIT program.** [visual: two-column flowchart from ENT through request tests (ERROR, 1ST/2ND LIST, COPY, CATALOGUE, ATTACHMENT POINT, GROUP, ERASE, COMPILE) to WAIT segments WAIT14–WAIT0 and WAIT10, then RET.]

<!-- p.107 / pdf.116 -->

       Synchronisation of processes, however, would have to be
introduced in cases where the order in which the processes
are entered is significant. For example, when a cataloguing
request is processed no downcompile request should be served
until the cataloguing process has terminated. This is
because unpredictable effects may be obtained when the
DOWN compiler parses a data structure which is being
disconnected from the catalogued subpicture.

       In the following is a description of the program
segments which are in the WAIT program.

*Errors*

       An error message consists of characters comprising
the word NOTE, a space and a number (NOTE rather than ERROR
has been chosen for not offending a sensitive user!). The
part of PIXIE which issues an error request inserts only the
identifying number into the character string, which when
printed, helps the user to look up the meaning in the PIXIE
manual.

       No more elaborate error message is given because it
       (a) occupies store and
       (b) would only be required by the novice user (i.e.
           a more experienced user will often know from the
           simple rattling of the teleprinter what has
           gone wrong).

       When an error request is sensed in WAIT a routine
called MESOUT is called after loading the address of the first
character of the error string into the accumulator. All
remaining characters are printed with routine OUT, in response
to interrupts from the teletype.

<!-- p.108 / pdf.117 -->

*Name lists*

       Any interrupt on the PDF which occurs in pointing mode or in drawing mode before any line segment has been entered into the TDF is considered to be a first interrupt. A PDF interrupt after a line has been drawn is treated as a second interrupt.

       The interrupt routine saves a name list (see section 5.4.3) in each case. These are known as the first name list and the second name list respectively. When control next parses through WAIT and the first name list is loaded then WAIT11 deals with it as shown in Fig. 5.25. If CCOM is set to -1 and the data structure must be amended by the UP compiler a new node will be created for the first line segment(s) in the TDF.

       The second name list is only loaded after a TDF has been built, the F button hit and the last PDF interrupt is near the current tracking cross position (i.e. within approx. 1/8th of an inch). Fig. 5.26 shows the service for the second name list. Most significant is the setting of a special marker which stops the UP compiler processing the TDF but enables the resetting of the TDF if the interrupt was on a catalogued item but not within a specified distance to an attachment point. The request for upcompiling is set for other programming details, e.g. to save additional skip instructions.

       CCOM1 is set such that it indicates to the UP compiler whether the interrupt was near an attachment point or on a node.

<!-- p.109 / pdf.118 -->

> **Fig. 5.25 — Routine WAIT11.** [visual: flowchart testing interrupt near attachment point or end of line, tracking mode, cross on CRT item; sets CCOM1 = -1. CAT = CATALOGUED, TR = TRACKING.]

> **Fig. 5.26 — Routine WAIT12.** [visual: flowchart for interrupt on CRT item; may set marker to stop UP compile, then set request for UP compiler and CCOM1.]

<!-- p.110 / pdf.119 -->

*Copy request*

       The copy request is served by routine WAIT13 of Fig.5.24. The copy routine parses the data structure to find the co-ordinates of the item to be copied and to verify that the item is an instance. If not, an error message is given, otherwise a new instance will be created with the co-ordinates of the instance to be copied. Tracking mode is entered automatically to enable the user to move one of the instances to some desired location. Fig.5.27 shows a multi-level PIXIE data structure. If a copy of instance I1 is required the change to the data structure consists only of inserting I2 into the data structure as shown in Fig.5.28.

*Cataloguing request*

       The cataloguing request is set when the user points with the light pen at the CA, RE or RO command light buttons. Fundamental to all three commands is the generation of a simple display file which represents the geometry of the item which was blinking on entry to the command.

       Consider, for example, the data structure of Fig.5.27. If any instance of S1 (in this case only I1 is available) is made blinking, the cataloguing command CA will delete all the data structure below S1 with the exception of attachment points. The lost geometrical information, however, is replaced by inserting in the data area of S1 a pointer which references the display file refered to above. Fig.5.29 shows S1 of Fig. 5.27 after being catalogued. In summary the cataloguing mechanism does the following:

<!-- p.111 / pdf.120 -->

> **Fig. 5.27 — A multi-level PIXIE data structure.** [visual: ring-linked INST/SUBP/I1/S1/LINE hierarchy with nested instance/subpicture and POINT attachment.]

> **Fig. 5.28 — Copying subpicture S1 of Fig. 5.27.** [visual: same structure with added instance I2 linked to S1 via INST ring.]

<!-- p.112 / pdf.121 -->

> **Fig. 5.29 — Cataloguing subpicture S1 of Fig.5.27.** [visual: simplified S1 with substructure removed, POINT retained.]

> **Fig. 5.30 — Attachment points.** [visual: multi-level INST/SUBP/NODE/LINE/POINT pointer diagram with SUBP RES branch.]

<!-- p.113 / pdf.122 -->

(1) Create a simple display file from the permanent display file belonging to the data structure of the item. This conversion process is done by a display simulator which builds a new file containing a linear string of vector display commands only.

(2) Reference to this display file is from the subpicture by writing an appropriate pointer (CEP) into the subpicture data area.

(3) Set the catalogue marker (CST=10000) in the subpicture to indicate that it is catalogued.

(4) Disconnect the substructure of the subpicture with the exception of attachment points.

       Individual lines belonging to a catalogued item can obviously not be made blinking and therefore cannot be edited. The main advantage of the cataloguing mechanism is in the saving of list space.

       The commands RE and RO are different to CA only in that some transformation is applied to the display file before it is entered as block data into the list area. For RE all vectors are halved and for RO all vectors are clockwise rotated by 90°. Also, a new subpicture and instance are generated for the display file leaving the original subpicture with its associated structure in the list area. It is designed this way to give the user the option of deleting the old subpicture or making further use of it.

*Attachment points*

       Attachment points are HSP point elements which are connected by the service routine to subpictures. The format

<!-- p.114 / pdf.123 -->

of these attachment points is the same as those given automatically to built-in symbols.

       The only test in routine WAIT3 of FIG.5.24 is whether an attempt is being made to put an attachment point on a line. If this is the case an appropriate error message is sent out. An unlimited number of attachment points can be added to subpictures, some examples being shown in Fig.5.30.

*Group*

       Routine WAIT7 of Fig.5.24 serves the grouping request. A flow chart of WAIT7 is shown in Fig.5.31. On entry a test is made whether the item to be grouped is a line. If this is the case an appropriate error message is started and the routine is exited.

       If the current entry is the first grouping request a new subpicture and instance are generated. In Fig.5.32 instance I3 and subpicture S3 are considered to be the group subpicture and instance. The blinking item, e.g. I4 in Fig. 5.32, is then connected to the group subpicture and disconnected from its old subpicture. If an attempt is made to group the group instance to the current group subpicture the request is ignored. If the user, however, points at EN and restarts the grouping action the group just created can itself be grouped.

       Only instances of the same or lower level can be joined to a group subpicture.

*Erase*

       Anything which can be blinked can be erased by pointing at the E button. Thus, only lines and instances can be explicitly erased. In Fig.5.33 the disconnection of I3 and

<!-- p.115 / pdf.124 -->

> **Fig. 5.31 — Routine WAIT7.** [visual: flowchart from ENT; NEW LINE GROUPING? → REQ ERROR; else create group instance on first entry, get blinking instance, connect to group unless group instance.]

> **Fig. 5.32 — Grouping instance I4 and I5.** [visual: INST/SUBP/I5/S5/LINE linked to group I3/S3 and nested I4/SUBP/L3 structure.]

<!-- p.116 / pdf.125 -->

> **Fig. 5.33 — Erasing instance I1 and line L3.** [visual: pointer diagram with horizontal bars marking severed links for I1 and L3.]

> **Fig. 5.34 — Routine WAIT10.** [visual: flowchart handling mode change, tracking, blink request, SERVICE TTY, MESIN on complete input; MESS = MESSAGE.]

<!-- p.117 / pdf.126 -->

L3 from the active list is indicated by horizontal bars.
The space made available after erasing will be recovered
in the garbage collection. Erasing the top level instance IO
starts a SETUP automatically.

*Other requests*

       The remaining requests are serviced in routine WAIT10
as shown in Fig.5.34. If the mode is changed to trackmode
the position of the store location which hold the x and y
co-ordinates are evaluated and saved. On subsequent entries
to WAIT10 while in tracking mode these locations are used to
update the position of the tracked item. Because of the
limited vector length on the DEC 340 display only the x and y
co-ordinates of the item in the PIXIE data structure can be
updated directly from the tracking cross. A DOWN compile
request is then issued to reflect this change in the PDF.

       A request for blinking is also serviced in WAIT10.
Again, the item to be blinked is identified in the data
structure. A special blink digit is then set in the data
area of the item. This digit enables the DOWN compiler to
save the location in the PDF which contains the intensity
bits to be changed by the real-time clock.

       After the requests described above are served the
teleprinter is serviced. If an input message is complete a
line feed request is set and the routine MESIN as shown in
Fig.5.35 is entered.

       If no item is blinking when a message is processed by
MESIN the message is treated as a command and routine MESIN7
is entered. This routine tests the message as described in
section 5.5.8.

<!-- p.118 / pdf.127 -->


---

*Editor's gap patch — pp. 119–120, end of Chapter 5 (transcribed from the scan by the
editor; fell between subagent ranges):*

<!-- p.119 / pdf.128 -->

CR = CHARACTER RETURN

> **Fig.5.35 — Routine MESIN.** [visual: flowchart — ENT → "item is blinking?" (no →
> test for command → RET); yes → "a line?" (yes → req error → RET); no → "1st char=/?"
> (yes → enter as data → RET); no → "1st char=:?" (yes → enter as generic type → RET);
> no → "1st char=CR?" (no → enter as printname → RET); yes → print name, data and
> generic type → RET]

<!-- p.120 / pdf.129 -->

If an item is blinking and it is a line an error request is issued. If an instance is
blinking the first character of the message is examined and then entered into the data
structure as shown in Fig.5.35. A carriage return only as the input message results in
the printing of the printname, data and generic type of the instance.

### 5.7 Other PIXIE implementations

In addition to the implementation of PIXIE at the University Computer Laboratory the
PIXIE system or parts thereof are also in use at the RCA Laboratories, Princeton, the
Institute of Computer Science, London, and the Department of Trade and Industry CAD
Centre in Cambridge. The author participated only in the transfer of PIXIE to the INDRA
PDP-9 at the Institute of Computer Science (Low 70).

The object during this transfer was to take advantage of those features of the PDP-9
which were not available on the PDP-7 at the University Computer Laboratory. These
included an extra 8K of core store, a drum backing store, DEC tape and the DEC Advanced
Software System. Details of the most important modifications made to PIXIE are given by
A.Lowe (Low 70).

All implementations so far mentioned had a word length of at least 18 bits and therefore
no significant problems with the RSP data structure package arose. When implementing
PIXIE, however, on a 16 bit machine, substantial redesign of the data structure and the
routines concerned with its manipulation is necessary.

> ✎ Four sites, three cities, one program — and a portability post-mortem (18-bit vs
> 16-bit words) a year before C's `int` made word-size portability everybody's problem.
> The [CAD Centre](https://en.wikipedia.org/wiki/CADCentre) connection closes a loop from
> the [turist guide](../../pdp7-reference/GUIDE.md): its founding machine was the third
> Atlas 2, running the Cambridge Supervisor.

Next: [Chapters 6–7 — applications →](04-chapters-6-7.md)
