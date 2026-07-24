<!-- PDF indices 153–179; thesis pages 144–170. Chapter 8 (144–155), Chapter 9 (156–170, through start of 9.4). PDF 151–152 are Chapter 7 (Fig. 7.5–7.6) — skipped. REFERENCES not reached (begins thesis p.173 / pdf.180). -->

<!-- p.144 / pdf.153 -->

## 8. COMPUTER-AIDED CIRCUIT DESIGN

### Summary

Circuit analysis has been carried out with RAINBOW for some time and has served to test many of the systems facilities. An example of the analysis of a filter is therefore followed through. Emphasis is on the problem definition, but the actual analysis is also briefly described.

<!-- p.145 / pdf.154 -->

### 8.1 Introduction

A number of electronic circuit analysis programs are available in RAINBOW. Amongst the facilities provided are general linear and non-linear as well as special purpose programs. Most of the user feedback of RAINBOW has been obtained with these programs and therefore a typical example of using one of the programs is outlined in this chapter at length. Problems with respect to the numerical methods employed for circuit analysis in RAINBOW are not discussed but can be found in the references given.

### 8.2 A users view

To design and analyse electronic circuits with RAINBOW the user will have to be familiar with most of the RAINBOW systems programs which have been briefly described in chapter 4. A simple systems chart using some of the programs is given in Fig.8.1. The procedure involved in analysing a simple circuit is given in the example below.

It is assumed that some initial topology and component data of a circuit has been defined (in the example described it was supplied by the Plessey Company) and there is a need to investigate the behaviour of this circuit. Typically, the design procedure consists of defining the problem to the computer and of the analysis proper with the representation of results.

#### 8.2.1 Problem definition

The analysis of the band pass filter of Fig.8.2 is the example considered here. Suitable for this task is the RAINBOW frequency analysis program LADAN (Eth 71). It requires a CONN structure of the circuit on Stream 010 and some

<!-- p.146 / pdf.155 -->

> **Fig. 8.1 — Programs useful for circuit analysis.** [visual: Flowchart with TTY feeding CONSTRUCT → CONN DS, CRT feeding PIXIE → PIXIE DS → CONN → CONN DS, all converging on CIRCUIT ANALYSIS → ARRAY → GRAPH → PIXIE DS, with feedback loop from PIXIE DS to PIXIE on CRT and branch to PLOT → GP plotter.]

<!-- p.147 / pdf.156 -->

> **Fig. 8.2 — Band pass filter.** [visual: Computer-drawn schematic of a band-pass filter with capacitors C1–C15, inductors, IN and COMMON rails, and shunt branches.]
>
> **Fig. 8.3 — Filter after editing.** [visual: Same filter as Fig. 8.2 with resistor R inserted in the top rail between C2 and C3; oval highlight around R.]

<!-- p.148 / pdf.157 -->

auxiliary data on Stream 11.

In addition to PIXIE and CONN programs for generating a CONN structure, CONNSTRUCT can be used as an alternative. The computer printout of Fig. 8.4 shows the equivalent CONNSTRUCT description of the topology of Fig. 8.2.

Before the analysis of this structure the environment for running the BCPL and FORTRAN part of LADAN must be set up. In Fig. 8.5 the typed lines 3 to 7 are the environment declaration including the auxiliary data on line 5. The first data parameter specifies the output format. Option 0 is the request for a table. Next are in the order given the first frequency, last frequency, step size, input resistance and output resistance. After analysing the circuit, LADAN found a malformed rung in the specification of the topology. i.e. LADAN does not allow C3 and C4 to be on node 01.

In parallel to CONNSTRUCT, the circuit has also been drawn with PIXIE. Fig. 8.6 is a printout of the PDP7 teletypewriter of a typical sequence of listing and naming of components and entering data. Similarly, Fig. 8.7 is the printout of the session on the TITAN teletypewriter doing such tasks as loading PIXIE into the PDP, filing the filter in TITAN, running the COMPACT, PLOT and CONN programs and finally producing a connectivity map with the CONNMAP program. As can be seen from this map of the circuit of Fig. 8.3 a resistor R1 is included which produces a correct rung.

#### 8.2.2 Analysis

A new environment declaration is set up for the analysis with the COMMAND command and is filed on ENW1027/HL/LADAN/.P. Some editing on this file is done at

<!-- p.149 / pdf.158 -->

> **Fig. 8.4 — Printout of circuit topology.** [visual: Teletype listing of TYPE /DISC/FILTRE showing capacitor and inductor entries with node connections and values (C1–C14, L4), ending READY.]
>
> **Fig. 8.5 — Printout of TITAN commands.** [visual: Teletype session with SET TO RAINBOW, BCPL/LADAN job invocation with parameters `0 4.2 25 4.2 75 75`, column headers FREQ MHZ / R IN / X IN / LOSS DB / INS PH DEG, ending MALFORMED RUNG, MONITOR, FAULT 40 AT 96.]

<!-- p.150 / pdf.159 -->

> **Fig. 8.6 — Printout of PDP commands.** [visual: Interactive PDP terminal session listing component names and values (C5, C4, R1, C3, C2, C1) with prompts and parameter entry, ending with TIT.]

<!-- p.151 / pdf.160 -->

> **Fig. 8.7 — Printout of problem definition.** [visual: TITAN login session (USER HL1470 1027, EXEC 12, SET RAINBOW), PDP commands loading PIXIE and ECFILTER, /RUN COMPACT, PLOT, CONN, FILE ECFILTCO — Continued.]

<!-- p.152 / pdf.161 -->

> **Fig. 8.7 — Printout of problem definition (continued).** [visual: /RUN CONNMAP output listing NETWORK CCT = CIRCUIT with capacitor and inductor branch entries (C5, L7, C4, L4, L9, C9, C8, C10, C11, C14, C15, L13, C12, C13) — Continued.]

<!-- p.153 / pdf.162 -->

> **Fig. 8.7 — Printout of problem definition (continued).** [visual: Branch list (C7, C2, C1, C6, C3, R1) and NODE LIST (IN, 02, 03, COMMON, 04, 05, 06, OUT, 01, 09, 08, 07), ending READY.]

<!-- p.154 / pdf.163 -->

the beginning of the printout of Fig. 8.8. The circuit is then reanalysed by typing COMMAND BNW1027/HL/LADAN. SWITCH QUIET has not been set and therefore TITAN responds with typing the COMMAND command file and finally the result table. From this table interesting frequencies can then be extracted suitable for another analysis, perhaps also with different output options.

### 8.3 Non-linear analysis

A similar example of using PIXIE and the non-linear RAINBOW circuit analysis program CANOTRAN for the analysis of a simple tunnel diode circuit is described by J.Hiles (Hil 70). Non-linear branch data is considered to be piecewise linear and is supplied to the program by pairs of entries in a table. Two modes of analysis are possible:

(1) d.c. analysis and
(2) transient analysis.

<!-- p.155 / pdf.164 -->

> **Fig. 8.8 — Printout of analysis.** [visual: Teletype session editing ENW1027/HL/LADAN, COMMAND invocation with BCPL link, frequency table (4.0–25.0 MHz) with R IN, X IN, LOSS DB, INS PH DEG columns, ending READY.]

<!-- p.156 / pdf.165 -->

## 9. APPRAISAL AND FUTURE POSSIBILITIES

### 9.1 Introduction

Many of the facilities provided by the PIXIE system have demonstrated their usefulness, for example, in the applications of chapters 6 to 8. There are, however, a number of facilities which are either wrong or absent. Some of these are described in section 9.2.

From the present position it is possible to improve the functions of PIXIE only by ad hoc programming effort, mainly because it is currently very difficult to change the interrupt, locking and unlocking mechanism of the co-ordinator. A better approach, however, would be to establish a more flexible basis for co-ordination in which the development of new facilities could be easy. The design of a co-ordinator to meet this requirement is described in section 9.3.

### 9.2 Generality

The generality of the PIXIE system is determined by the data structure(s) it generates and can handle. To add another function (light button) or routine for manipulating the data structure represents generally no significant problem, however, changing the data structure itself will require a considerable effort in rewriting many parts of the system. The changes to the PIXIE system suggested below can therefore be implemented either by a routine in PIXIE or by a change of the data structure.

(a) When deleting a line, a mechanism is needed which generates a new node if the deletion of

<!-- p.157 / pdf.166 -->

the line produces two disjoint line segments. For example, after deleting line L2 in Fig.9.1a, lines L1 and L3 still belong to node N2 of Fig.9.1b. Now, if L3 is connected with some line segments to node N1 as in Fig.9.1c then N1 and N2 will be joined. This unexpected result could have been prevented by the user through deleting L3 of Fig.9.1a in addition to L2, however, it could be argued, that this requires too much knowledge from the user of how PIXIE builds a data structure.

(b) When tracking an endpoint of a line either explicitly or connected to a tracked branch a mechanism is needed which tracks all other line endpoints which coincide with any point on the line such that they stay connected to the line. For example, consider the drawing of Fig.9.2: a,b and c show how branches and nodes are tracked in the existing system. Fig.9.2d shows how it should be.

The problems associated with line deleting and tracking are caused by designing the data structure such that nodes and branches are the main building blocks. A data structure based on points and lines would simplify the handling of the problems discussed above considerably.

### 9.3 Flexibility

The most significant modification to PIXIE, however, should be with respect to flexibility, i.e. the redesign of the co-ordinator. Incorporated in such a redesign should be:

<!-- p.158 / pdf.167 -->

> **Fig. 9.1 — Deleting a line.** [visual: Three circuit diagrams (a) original with N1, R1, N2, L1, L2, L3, C1, R2, N3; (b) after deleting L2 with floating top branch; (c) final topology with R2 in parallel with R1–C1 branch.]

<!-- p.159 / pdf.168 -->

> **Fig. 9.2 — Tracking a line.** [visual: Four panels (a–d) showing BOX 1, BOX 2, BOX 3 connected by lines in T-junction, disassembled, broken, and diagonal configurations.]

<!-- p.160 / pdf.169 -->

(a) An open ended system which allows easy introduction of new program modules and the removal of old ones.
(b) A facility to allow the system to have processes run in parallel if multiple CPUs are available.
(c) A provision where multiple CRTs can be run by the co-ordinator without a further extensive redesign.

To accommodate hardware features such as multiple CPUs and muliple CRTs maybe with extensive core and backing store facilities represent a significant departure from the rather stringent hardware restrictions imposed on the existing PIXIE. The justification to design PIXIE for such an environment is based on:

(a) The experienced gained with the existing PIXIE system which shows for a typical 1 hour console session a CPU utilisation of about 5-10% and an effective core utilisation of the 8k store of about 20-30%.
(b) The availability of cheaper small and medium size computer systems with efficient time-sharing facilities.

A minimum hardware system on which the co-ordinator for PIXIE should be able to work effectively is shown in Fig. 9.3. More comprehensive, however, is the configuration of Fig.9.4.

It is quite obvious from Fig.9.4 that the PIXIE co-ordinator must permit multiple tasks to be processed in parallel if multiple CPUs are available or multiple CRTs have to be serviced. This is also true for the single CPU

<!-- p.161 / pdf.170 -->

> **Fig. 9.3 — A minimum system.** [visual: Block diagram with CPU and STORE on one side of a bus, CENTRAL COMPUTER via INTERFACE, DISC, DISPLAY CONTROLLER with CRT, on the other.]

<!-- p.162 / pdf.171 -->

> **Fig. 9.4 — A comprehensive system.** [visual: Multi-CPU architecture with two STORE blocks, three CPUs, DISC, DISPLAY CONTROLLER serving four CRTs, separate CPU CONTROLLER with CRT, and CENTRAL COMPUTER via INTERFACE on shared bus.]

<!-- p.163 / pdf.172 -->

system of Fig. 9.3 if it runs under a suitable time-sharing operating system.

The main function of the co-ordinator are:

(a) Allocating storage for TDF, PDF, list area etc.
(b) Initialise loading and dumping of PIXIE programs and data segments
(c) Scheduling and protecting of processes including the controlling of concurrent execution of processes
(d) Controlling interrupts.
(e) Providing clock services
(f) Attempting recovery or restart under exceptional conditions
(g) Initialising input/output operations
(h) Providing information on resource utilisation
(i) Control of idle time

For the control of these functions the co-ordinator requires some data base. It is postulated that if a substantial part of the control of the co-ordinator can be represented in the data base rather than encoded in the program, a very flexible graphic system can be designed. This holds true also if the co-ordinator is run as a normal processing task by some other (superior) co-ordinator.

A simple and yet elegant scheme for co-ordinating tasks was suggested by W. Newman (New 68). Here the flow of control is maintained by a state transition table. When the program is in any of the states contained in this table it will enter a polling loop waiting for some user action. A move to the next state takes place only when an expected user action is obtained (i.e. an action which is polled for). The program

<!-- p.164 / pdf.173 -->

segment(s) for the new state, however, can be loaded into core beforehand because of the built-in facility for work ahead.

This approach, while it clarifies the design task for a single thread co-ordinator has some shortcomings. In particular, it does not allow parallel processing of independent tasks. Also a more flexible locking and unlocking mechanism is desirable, maybe one to which the the designer or user of the system has direct access. The process co-ordinator described below is designed to provide these facilities.

A process in this conext is considered to be the execution of some PIXIE program module, e.g. the rotating DHR. A number of other processes can be created by such a process, some of which could run in parallel. For example, in the rotating DHR the display file simulator process can produce a rotated display file independent of some data structure building process which generates a new instance and subpicture. The rotating DHR process is completed when the new display file is inserted into the subpicture. An application is considered to be the set of programs and data segments which permit the user to build a data structure of some schematic.

Each graphic application (i.e. the set of program and data segments particular to a user) is allowed by the PIXIE co-ordinator to have its program segments in any of the states described below:

(a) Executing, i.e. a pointer to it is in some running list for the processors.

(b) Pending, i.e. a pointer to it is in some list containing pointers to all segments ready to be executed.

<!-- p.165 / pdf.174 -->

(c) Suspended, i.e. a pointer to it is in some list containing pointers to all segments which wait for some condition to become true to be put into the pending data structure.

(d) Dormant, i.e. the co-ordinator does not have any pointer to it at all.

A PIXIE program segment is considered to be in the active state when it is not dormant. The co-ordinator data base discussed below does not contain the list of program segments in the active state, however, it enables the co-ordinator to decide when to put a process in the active state, in particular, when to suspend or pend a process. It is the responsibility of a scheduler program to examine elements on the active list and choose the order in which they are executed.

#### The co-ordinator data base

In the following it is suggested that the co-ordinator data base consists of a CONN like data structure which shows all program and data segments of a graphic application. For example, consider a simple application requiring only line drawing (horizontal/vertical constraints) and a blink, cataloguing and erase mechanism.

An arrangement of the light buttons is shown in Fig. 9.6. The co-ordinator data base is shown in Fig. 9.7. Each program and data segment is represented by a data base element which has four attachment points (APs) as shown in Fig. 9.5.

In the following are some of the rules which could be coded into the co-ordinator to parse the data structure consisting of such data base elements with their interconnections:

<!-- p.166 / pdf.175 -->

> **Fig. 9.5 — Data base element.** [visual: Box labelled SEGMENT NAME / R.N.EX / PRIVAT/PUBLIC with four attachment points BP1–BP4 on a horizontal line.]
>
> **Fig. 9.6 — A simple graphic system.** [visual: Display rectangle with light-button column CA/SR/EX on right and crosshair with S and B labels on canvas.]

<!-- p.167 / pdf.176 -->

> **Fig. 9.7 — The co-ordinator data base.** [visual: Vertical stack of segment bars (TRCR, TDF, GTDF, PDP, UP COMP., DOWN COMP., DS, START DR, BLINK, CATALOGUE, ERASE, END, FINISH DR) with inter-segment pointer arrows. Key: DS = DATA STRUCTURE, TRCR = TRACKING CROSS ROUTINE, DR = DRAWING, GTDF = GENERATE TDF ROUTINE.]

<!-- p.168 / pdf.177 -->

(a) If AP1 of segment A is pointed at by AP2 of segment B and B is to be set into the pending state then a lock count (LC) in the data base element of A is incremented by 1. If LC (A) > 0 than A can not be set to the active state from the dormant state. If A, however, is already in the active state when the LC is incremented then B is suspended until A returns to the dormant state. When B goes from the active to the dormant state, LC of A is decremented by 1.
For example, if the finished drawing (FINISH DR) segment of Fig. 9.7 is to be set into the pending state, i.e. its LC=0, then the start drawing (START DR) segments LC will be incremented.

(b) If AP2 of segment A is pointed to from AP2 of segment B then A will be set to the pending state, after B has been executed and set to the dormant state and provided A's LC=0. If its LC ≠ 0 then A is suspended until its LC=0. For example, when the DOWN compiler goes into the dormant state the PDF can not be put into the pending state until its LC=0. In the example given, LC of the PDF will always be 0 after the DOWN compiler goes into the dormant state.

(c) If AP2 of segment A is pointed to by AP3 of segment B then A may be set to the pending state after B is set to the dormant state provided some condition in B is true and LC(A)=0. For example, if the tracking cross routine (TRCR) is in the pending

<!-- p.169 / pdf.178 -->

active draw mode, then the GTDF segment can only be put into the pending state after the TRCR has been set into the dormant state.

(d) If AP4 of segment A is pointed to by AP2 of segment B then the co-ordinator must insure that A is in core before B is set into the pending state. For example, the TDF must be in core before GTDF is set into the pending state.

From the data base elements the co-ordinator can extract the following information:
The segment name.
The access status. R=READ, W=WRITE, EX=EXECUTE.
Private or public, i.e. a marker which indicates if the segment is private to one application or can be shared by more than one application. For public segments which have the execute status bit set re-entrant code is assumed.

#### The system loader

When the data base is loaded an application capability segment (ACS) is generated. The ACS contains one capability entry for each private segment. An entry is described as follows:

WORD1: Base of the segment.
WORD2: Limit of the segment.
WORD3: Access status copied from the data base element, in/out status indicating if the segment is in core or on disc, Others?.

<!-- p.170 / pdf.179 -->

In addition, if a segment is a public segment then an entry is also made in the PIXIE co-ordinator capability segment (CCS) which provides the co-ordinator with information about different users of the system.

The loader also assigns the light buttons to segments marked for this purpose and then inserts into the light button display file the links to the respective elements in the data base.

A possible capability structure for a multi-user co-ordinator is shown in Fig.9.8. The following conventions are made in Fig.9.8:

(a) Entry 1 in the ACS points to the application data base
(b) Entry 2 in the ACS points to the display file to be put on the pending state when the application is initialised by the co-ordinator.
(c) Entry 1-10 of the CCS provide slots for 10 applications at a time. Each entry must be either NUL or point to an ACS.
(d) The remaining entries of the CCS are reserved for public segments, may be with a use count indicating how often it is referenced from the ACSs. This count could be used by the garbage collector.

### 9.4 Sundry changes

The general co-ordinator described above makes a mobile PIXIE possible. To be able to support many users on different types of hardware (e.g.CRTs) with minimum effort the PIXIE
