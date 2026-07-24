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
