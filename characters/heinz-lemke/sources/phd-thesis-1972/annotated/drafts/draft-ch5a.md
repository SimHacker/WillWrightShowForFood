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
