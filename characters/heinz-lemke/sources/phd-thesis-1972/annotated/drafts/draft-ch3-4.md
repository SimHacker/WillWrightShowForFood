<!-- PDF indices 035–058; thesis pages 26–49. Range begins at Chapter 3 (pdf 035); pdf 033–034 (thesis pp.24–25) omitted (end of Ch.2). Chapter 5 not reached; range ends mid Ch.4 §4.6 (thesis p.49). -->

## 3. MAN-MACHINE INTERACTION

<!-- p.26 / pdf.035 -->

*Summary*

Some psychological features of man-machine communication are discussed. This is to establish some criteria for the design of the PIXIE system. Emphasis is on communication language, real-time response and accessibility.

Consideration is also given to the economics of computer graphics with respect to its interaction with other parts of a CAD system.

### 3.1 Introduction

For the purpose of analysis as well as communicational reasons, the design ideas of an engineer require a formal representation. Sometimes this can be done by building a physical model but it is more common to do this with an invented code or symbolism such as character strings and drawings. If the machine is to assist the designer in recording and analysing the implications of his ideas, the information contained in these symbols must be entered into the computer. This and the representation of output from the computer require the design of a man-machine interface for providing an effective information flow from man to machine and machine to man. Two questions arise when designing such an interface:

(a) What constitutes an effective information flow ?

(b) Which tools and techniques can accomplish this most economically ?

<!-- p.27 / pdf.036 -->

### 3.2 Ergonomical considerations

When designing a man-machine interface it is desirable to have some knowledge about the communicational behaviour of the man. Such knowledge is virtually nonexistent. It is difficult to find a universally accepted description of the design process. To do this for the communication process seems to be even more troublesome as apparently everybody communicates in his own particular way with his environment. Unfortunately, many aspects of this behaviour defy measurement or prediction.

If a human being can be regarded as a subject of physiological and psychological processes the first step in the design of a man-machine interface should be to find properties in these processes which are relevant to the communicational process.

A process usually serves a purpose (!). To provide an effective communicational process therefore requires the identification and analysis of the purpose of the communication.

These communicational purposes could be categorised as to inform, persuade and entertain, that is if the environment consists of people. Here the transmitter and receiver of the man-man interface have desires, emotions and other human characteristics and are engaged in information exchange. A different approach has to be taken if one communicational partner is a machine as in Fig.3.1. Information is still exchanged but the categories of persuasion and entertainment are apparently absent in the relation of man to machine. The unemotional and generally "unlike-oneself" behaviour of the machine may be the principal barrier to effective communication.

<!-- p.28 / pdf.037 -->

> **Fig. 3.1 — Man-machine relation.** [visual: Two boxes labelled MAN (with INFORM, ENTERTAIN, PERSUADE under COMMUNICATIONAL PROCESSES) and MAN-MACHINE INTERFACE (with PATTERNS, STATES, OBJECTS); ACTIONS arrow from man to interface, STIMULI arrow back.]

> **Fig. 3.2 — A graph.** [visual: Directed graph with vertices V1, V2, V3 and edges R1 (V1→V2), R2 and R3 (both V2→V3, inner and outer arcs), R4 (V1→V3).]

> **Fig. 3.3 — Feedback control system.** [visual: Block diagram of a multiple-input multiloop system with inputs R1(S) and R2(S), blocks G1(S)–G4(S), summation points, nodes I1–I7 and 10, output C(S), and feedback paths H1(S) and H2(S).]

<!-- p.29 / pdf.038 -->

Although not everybody may feel the need to be entertained by the machine, in general such capability will contribute significantly to an effective information flow from man to machine and machine to man. Entertaining is considered here as something which pleases or increases interest. Entertaining features can be provided by

(a) pleasant selection of colours for the interface equipment

(b) agreeable representation of visual and aural information

(c) appropriate real-time response

(d) operating conditions as determined by anthropometric data which provide an inviting environment

(e) communicational languages familiar to the man with alpha-numeric and graphical symbols that can be entered into the interface in a natural manner

(f) an adjustable level of illumination and

(g) an acceptable noise level.

Endowing the machine side of the interface with more intellectual capability also reduces the communicational barrier (Weiz 70), but so far not much progress in this direction has been made. The literature on artificial intelligence illustrates the present status of this sort of work.

Another possibility for improving man-machine communication is to let the man adapt himself to the features of the machine by using his flexibility and learning capacity. If the capacity to adapt, say, to a social environment is assumed to be a reflection of certain attributes of a person

<!-- p.30 / pdf.039 -->

then the problem arises as to what are the attributes of a person adapting successfully to a machine. In particular, that of a designer adapting to the features of a man-machine communication system.

Of particular interest in this context are the communication language and the speed with which the system responds to the actions of the man. However, the need for exessive adaptation on the part of the man will dissuade him from using the system and should only be considered when all other possibilities have been exhausted. Thus, PIXIE was designed so that excessive adaptation is unnecessary.

#### 3.2.1 Communication language

Adapting to a new language is largely a matter of individual learning capability and experience and is generally rather time consuming. Although communication among human beings, including designers, is not always satisfactory, there is no shortage of languages available for communication, even if one ignores natural languages. It seems therefore appropriate to select a language for communicating with the computer from a set the designer already "speaks". Unfortunately, even if one considers only a single design field in engineering, e.g. digital systems design, there is still a large number of alpha-numeric and graphical languages available in which to state the problem and express results.

In this context it should also be worthwhile to examine the Neo-Whorfian hypothesis, which is effectively that rich languages cause sophisticated behaviour (Eng 62).

Whatever alpha-numeric language has been put at the disposal of the engineer, he will usually spend a considerable

<!-- p.31 / pdf.040 -->

amount of time familiarising himself with the syntax of the language. Although some problems cannot be expressed in other formats than alpha-numerics, of greater interest to the engineer is a language with a high graphical content such as orthographic projections of solid objects or network type drawings. To communicate with a computer by means of drawings is technically more difficult than with alpha-numeric languages. It requires either some form of pattern recognition device or, if the communication is carried out interactively, a real-time computer system support.

The type of language made available in an integrated CAD system determines significantly the usefulness of the system. In RAINBOW the principal graphic language is of a network type. These networks can take the form of flow charts, sometimes also referred to as throughput flow diagrams (TFD) or systems charts also referred to as block schematic diagrams (BSD). A few examples are given in Fig.3.2 to 3.4.

#### 3.2.2 Real-time response

Real-time response is relative to the context in which it is used and the definition given by J. Martin for real-time computer system (Mar 69) as "one which controls an environment by receiving data, processing them, and taking action or returning results fast enough to effect the functioning of the environment at that time", shows this clearly.

From the user point of view a real-time computer system consists of a computer to which are connected, through channels, a variety of input/output devices. These devices are the man-machine interfaces. A block schematic diagram of a man-machine communication system is given in Fig..3.5.

<!-- p.32 / pdf.041 -->

> **Fig. 3.4 — Wideband amplifier.** [visual: Two-stage transistor amplifier schematic with TX300 transistors, resistors R1–R7 (R1 8.2K, R7 6.8K), capacitors C1, C5, C6, CP1, CW1, nodes N1–N16, and +10 VOLTS supply.]

> **Fig. 3.5 — Real-time system.** [visual: Block diagram with HUMAN DESIGNER (MENTAL AND PHYSICAL PROCESSES), MAN-MACHINE INTERFACE (two DELAY blocks), and COMPUTER SYSTEM (PATH2→QUEUE→PROCESSES→QUEUE→PROCESSES loop with PATH1 bypass).]

<!-- p.33 / pdf.042 -->

A computer is considered to be a tightly coupled system to the designer if information flows along path 1. If waiting in a queue is necessary before or after the information is processed the system is considered loosely coupled

The signalling rate is defined as the maximum rate in which a cause-effect disturbance can pass round any loop. This determines the real-time response. Whether the designer works with a tightly or loosely coupled system, a satisfactory real-time response can only be achieved if the processes of the computer system are completed within a given period of time. In path 1 the process will have to assign high priorities to subprocesses which are real-time sensitive and in path 2 a time-sharing monitor will be needed to process the queues.

A further important consideration is the bandwidth or the rate with which information can be written into a communication channel. Selection of signalling rate and bandwidth depend of course on the applications the man-machine communication system is considered for. For example, high bandwidth and signalling rate are required for drawing on an interactive graphic terminal (Mis 700). With less interaction the signalling rate can be reduced, as for example, in information retrieval applications.

When selecting a man-machine communication system the user will have to consider in addition to signalling rate and bandwidth and other already discussed features, problems related to the access of the system.

#### 3.2.3 Accessibility

An organisational feature contributing significantly

<!-- p.34 / pdf.043 -->

to the success of a CAD system is the way in which it can be accessed by the user. The physical and economic access to a CAD process capability should be made as encouraging as possible. Restriction on physical access such as a long distance of a terminal to a computing facility from the designer's working place or an unsatisfactory queueing system for obtaining time on a terminal can inhibit an effective synergesis of designer and machine.

Economic access is concerned mainly with the distribution of costs for a computing facility. To encourage the use of a computer with graphic and other terminals, special cheaper charging arrangements should be made to allow the designer to familiarise himself with the facilities offered. Sometimes it can be of an advantage to adopt an accountancy procedure which charges a design department as a whole for a computing facility and not individual projects for computing time and terminal hours. This is of particular interest when potential applications for CAD exist and a suitable computing facility is underutilised.

### 3.3 Computer graphics

A graphic CRT display or computer graphic terminal is a computer peripheral device for enhancing man-machine communication. Although the roles and merits of some current computer graphic systems for CAD applications are in dispute, a considerable amount of effort has gone into developing hardware and software for such systems. Most frequent are:

1. Satellite computer driven refreshed displays

2. Main frame driven refreshed displays

3. Storage tubes

<!-- p.35 / pdf.044 -->

The cost of all graphic vector display systems are still relatively high compared to teletypewriters. However, many reports can be found in the literature encouraging their use. In most cases the purpose of interactive graphic systems has been to augment the input and output facilities with respect to some specific application program.

There is also considerable scope for integrating computer graphics into multi task design problems. RAINBOW provides such an environment. Here only one graphic operating system (PIXIE) is responsible for all graphic I/O communication, for example, drawing of flow systems or display of coordinate graphs. The obvious advantage is that only one operating manual needs to be read by the user. On the other hand, some functions like the static display of a coordinate graph are cheaper to implement on a storage tube. It is therefore desirable to have a variety of different CRT terminals available in an ICAD system. Some may be supported by a satellite computer. The use of such terminals will become easier if the predictions made in some investigations for lower cost dedicated computers and display hardware become true.

*Economics*

To equate the hardware and software development cost of a computer graphics system with the benefits, it is necessary to identify the advantages of doing engineering design with a computer graphics system. A well designed computer graphics system should give the following design assistance to a user:

1. Allow the engineer to communicate easily in a graphic language with the computer.

2. Provide an on-line environment in which the design cycle from specification to final product is significantly reduced.

<!-- p.36 / pdf.045 -->

3. Encourage the user to improve the design by trying many alternatives.

4. Automatically build a model of the system to be designed sufficiently general to permit the easy addition of new applications

5. Give the engineer access to large data banks for storage and retrieval of drawings and other design information.

Some of these benefits are tangible and can be expressed in £'s saved, e.g. reduction in design time, while others are intangible like expected improvement in design quality.

It is therefore incomplete when justifying computer graphics to simply apply one of the basic methods used to estimate the relative profitability of capital investments such as return on investment, pay back period, discounted cash flow or present-value analysis. Instead, strong considerations should also be given to the intangible benefits.

#### 3.3.1 Interaction with data base

Computer graphics can be regarded as a means to communicate with a data base. In many respects it is the most convenient, although not always the cheapest way of entering and retrieving information to and from a data base. When entering data, a certain transformation, usually unnoticed by the user, takes place. Each character, symbol or line entered by the user is structured in the computer according to some prearranged philosophy. Graphic visual feedback to the user is obtained by processing this structure or parts thereof to extract data for steering an electron beam over a CRT surface.

Many philosophies for structuring user data in the

<!-- p.37 / pdf.046 -->

computer have been developed resulting in data structures with varying degrees of generality. When a data structure is of a special purpose design, graphical interaction with it is limited to a particular application area. Advantages associated with this approach as opposed to a more general data structure are:

(a) The structure can be processed faster

(b) Less store is required

(c) Structural changes can be made without extensive reprogramming of data structure manipulation routines

(d) It is easier to comprehend

Restructuring and adding more data structure elements such as pointers and/or data cells in a meaningful way can make a data structure suitable for a wider spectrum of applications. Although the advantages of a more special purpose structure are lost, such data structures are essential for the design of an integrated CAD system. In particular, they allow a class of data management processes to be generalised, with dramatic improvements in the lifetime of the system.

#### 3.3.2 Interaction with programs

Programs which create or manipulate data structures whether containing graphic or nongraphic information are included in the set of data management or application programs. When these programs or routines are called at appropriate moments by the graphic interface software they could be considered as being a part of the man-machine communication system. Some of these routines may require only little core space and CPU time and as such do not represent a serious load on a computer system to provide a rapid real-time response to the user. An example

<!-- p.38 / pdf.047 -->

is the simple drawing of a network with the simultaneous generation of a data structure model.

Real-time response will be more demanding on computing resources when data management

(a) requests large core space for long periods

(b) requires extensive CPU time or, in satellite driven CG, if the power of the satellite computer is inadequate.

This can occur when the user manipulates a drawing under complex contraints which arise, for example, in layout and interconnection problems. In such cases it is usually worthwhile to re-examine the need for real-time response. Sometimes it might be possible to run such routines in an independent job external to the response loop.

A division of man-machine communication and data management routines similar to the way just discussed has been made at some places in the RAINBOW system. For example, the data management program COMPACT which is responsible for efficient core utilisation could equally well have been built into the graphic software instead of being run by the user as an independent job.

It is not always clear when constantly guiding a process through the man-machine interface, whether such a facility is justified on economic, technical or emotional grounds (or at all). In the PIXIE system a careful assessment of operational costs has been made because the cost of tight coupling between man and machine rises rapidly with the machine resources required to support it. Tight coupling with a process of modest computing needs may be only slightly more expensive than loose coupling, whereas tight coupling with a big and complex process may be many times more expensive than loose coupling with the same process.

<!-- p.39 / pdf.048 -->

#### 3.3.3 Satellite graphics

The use of a satellite computer to drive an interactive CRT terminal makes it relatively easy to provide tight coupling with simple tasks (those executed in the satellite) without requiring privileged access to processes in the main machine.

This philosophy has been supported for some time (Wil 66) and a large number of such systems are actually in use.

It is not a cheap way to add a graphics capability to a computing installation, but operationally it may show substantial cost savings. Various other factors in support of satellite supported terminals emerge:

(a) data compression when the terminal is remote from the main machine, and control of communication links

(b) minimum effect on main computer operating system when terminal is installed

(c) usefulness of small computer independent of main machine for purposes other than terminal support.

#### 3.3.4 Main frame driven graphics

Before the availability of relatively cheap satellite computers, CRT terminals usually were driven by the computer which also processed the application programs. Now the effectiveness of this philosophy of computer graphics depends largely on the quality of the computer's time-sharing system and the type of design application considered. In particular, consideration must be given to the load the graphic system puts onto the CPU and direct access memory of the driving computer.

Applications which require frequent dynamic interaction with complex processes can be assisted effectively by this type of graphic terminal connection. Infrequent use of the graphic terminal and no need to have a satellite computer for any other

<!-- p.40 / pdf.049 -->

purpose also supports the case for main frame driven graphics. Also, if the CRT terminal is of a storage tube type, the absence of a need for a refresh memory makes a satellite computer difficult to justify

#### 3.3.5 Storage tubes

Storage tubes are useful for text preparation and editing and for graphic input which requires little dynamic interaction. Such functions are more preferably done on a storage tube rather than on the more expensive refreshed type of display.

These terminals can be connected in the same way as a teletypewriter, using standard interfaces and software. Serial and asynchronous transmission of a sequence of characters is involved. Although teletypewriter speeds are standard, higher speeds up to 500 characters per second can be achieved through a synchronous connection. Storage tubes for CAD have been successfully implemented (Bar 71).

## 4. THE RAINBOW SYSTEM

<!-- p.41 / pdf.050 -->

*Summary*

This chapter is intended to give an appreciation of the facilities available in RAINBOW, particular those which are of interest to the application programs discussed in part 3. After a discussion of PIXIE and CONN data structures a number of man-machine communication and data management programs are briefly described. These include the CONNSTRUCT, CONN DSPRINT, CONNVAP, REPLACE, JOINUP, PLOT and GRAPH programs. Emphasis is given to their relevance to the PIXIE system.

<!-- p.42 / pdf.051 -->

### 4.1 Introduction

Effort in the design of RAINBOW was concentrated into four areas:

(a) The conceptual design of a data base which permits the modelling of flow systems.

(b) Design of a set of task independent data management programs.

(c) Design of task independent man-machine communication programs.

(d) Implementation of a suite of application programs which make use of the facilities provided under (a), (b), and (c).

Task independence is applied here to applications within the field of flow systems design. Thus, the programs of (b) and (c) should be able to generate and manipulate graphs. Typical manipulations include creating, editing and display of graphs in various forms, the joining of a subgraph to a graph, nesting of a graph etc.

The need for most of these programs arose from experience gained in the development and use of RAINBOW.

### 4.2 A user's view

From the users point of view RAINBOW can be utilised in two ways:

(a) by actually designing with the existing system some engineering object.

(b) by making use of the experience gained with RAINBOW, and extracting those programs and concepts of RAINBOW which might usefully support the development of a new CAD system.

<!-- p.43 / pdf.052 -->

In chapters 6, 7 and 8 examples are given to (a). An example of (b) is the implementation of parts of RAINBOW on the ICL 1903A at Plessey, initially for the purpose of providing a data management facility for digital systems design.

Some parts of the RAINBOW Manual are given in Appendix III to give an appreciation when using the system on the ATLAS/TITAN computer.

RAINBOW users on the TITAN/ATLAS computer must first learn how to use the multiple-access system (see the User's Reference Manual (Har 68)).

### 4.3 Systems description

A systems chart of the main components of RAINBOW is given in Fig. 4.1. The central position in this chart is occupied by the data base. Data structures in the data base are of two types, that is PIXIE structures for modelling geometrical data of graphs and CONN structures for topological data of graphs. The syntax of these structures is quite different and special programs are required to convert one structure into the other.

Interactions with these data structures are carried out only with the man-machine communication and data management programs. Typical functions of these programs are:

| Function | Program |
| --- | --- |
| (1) Creating and manipulating PIXIE structures. | PIXIE |
| (2) Creating CONN structures | PIXIE and CONNSTRUCT |
| (3) Editing RAINBOW data structures | PIXIE EDIT |
| (4) Listing RAINBOW data structures and features thereof. | DSPRINT CONNMAP |

<!-- p.44 / pdf.053 -->

> **Fig. 4.1 — The RAINBOW system.** [visual: Systems chart centred on DATA BASE (with internal DS blocks); CRT↔PIXIE↔DATA BASE; TTY↔CONNSTRUCT↔DATA BASE; TTY↔EDIT↔DATA BASE; PLOT and DSPRINT receive from DATA BASE to BP and LP; CONNMAP to TTY LP; REPLACE, CONN, GRAPH, SYNTANAL, JOINUP connect to DATA BASE; APPLICATION PROGRAMS (PR blocks) at bottom connect to DATA BASE.]

<!-- p.45 / pdf.054 -->

(5) Manipulating CONN structures

JOINUP

REPLACE

The flow of information of these programs with respect to the data base is indicated by arrows in Fig. 4.1.

### 4.4 Data structures

Depending on the nature of the design problem either a PIXIE or CONN data structure is chosen as the initial modelling tool. When generating a PIXIE structure at the beginning of a design phase the interactive graphic terminal would normally be used for this program, that is, the input would consist of a drawing. More flexibility is provided for CONN structures which can be generated either from the TTY with a suitable language and CONNSTRUCT, from PIXIE structures with the CONN program or by some other systems or user program.

Both data structures are built from ASP elements. A PIXIE structure of the simple logic network of Fig. 4.2 is given in Fig. 4.4. Its equivalent CONN structure is in Fig. 4.3. As can be seen, the connectivity information of a CONN structure is implicitly contained in a PIXIE structure. Although the former is void of any geometrical data, a RAINBOW program is currently being written which builds PIXIE structures from CONN structures with geometrical data from external sources.

The format of the individual elements in a PIXIE structure is given in Appendix 4.

CONN structures are built from three different types of elements. Two are of fixed length in the head, the peg with 5 and the node element with 3 headpointers. The length of the branch element is variable as it depends on the number of defined attachment points. Generally these are the I/O points

<!-- p.46 / pdf.055 -->

> **Fig. 4.2 — Simple logic network.** [visual: Logic diagram with inputs A and B, OR gate producing A+B, AND gate producing A(A+B).]

> **Fig. 4.3 — CONN data structure of logic network.** [visual: Grid of horizontal lines labelled PEG, A, B, A+B, A(A+B), AND, OR with vertical connections marked by inverted triangles and circled crosses at intersections.]

<!-- p.47 / pdf.056 -->

> **Fig. 4.4 — PIXIE data structure of logic network.** [visual: Hierarchical tree of INST and SUBP blocks branching to OR, RNW, A, B, A+B, A+A*B nodes, each with SUBP and POINT or LINE leaf elements connected by pointer lines.]

<!-- p.48 / pdf.057 -->

of the element. Details of the function of the individual items of the elements are given in Fig.4.5 to 4.7.

### 4.5 Man-machine communication programs

Two programs are available to the user for creating data structures in an on-line environment. These are the PIXIE and CONNSTRUCT programs. In addition, there is one data structure editing program called EDIT. This program has features similar to other editing programs and will not be further described here.

#### 4.5.1 PIXIE

Interactive computer graphic facilities are provided by PIXIE. It is a subsystem of RAINBOW with the prime objective of giving graphic input and output support to design tasks which require graphic information handling.

A detailed description of PIXIE is given in chapter 5.

#### 4.5.2 CONNSTRUCT

Certain tasks which do not require graphic interaction can be cheaply assisted by the CONNSTRUCT program. It is useful for constructing CONN-structures from a textual description. The syntax of strings in the language and other more detailed description of CONNSTRUCT is given in the RAINBOW Memo 24.

### 4.6 Data management programs

In this section only a very brief description of a number of RAINBOW programs will be given. Typically, these programs have one or more data structures as input or generate a data structure and are therefore considered to be data management programs. More detailed description of the programs

<!-- p.49 / pdf.058 -->

> **Fig. 4.5 — Peg element.** [visual: Vertical stack of cells with pointers labelled NODERING, BRANCHRING, ATTACHMENT NODES, COMPONENT SUBCIRCUITS, SAME-LEVEL SUBCIRCUITS, PRINTNAME, GENERIC NAME, loop-back link, and DATA block at base.]

> **Fig. 4.6 — Node element.** [visual: Vertical stack with BRANCHRING, OTHER ATTH NODES AND PEB, OTHER NODES AND PEB, PRINTNAME, GENERIC NAME, loop-back link, and DATA block.]

> **Fig. 4.7 — Branch element.** [visual: Vertical stack with TERMINAL J, TERMINAL N, TO OTHER BRANCHES AND PEB, PRINTNAME, GENERIC NAME, loop-back link, and DATA block.]
