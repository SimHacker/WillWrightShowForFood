# Part 1 · Chapters 1–2 — Introduction; Integrated Computer-Aided Design

Thesis pp. 1–25 · [annotated edition index](README.md) · [← front matter](00-front-matter.md) · [chapters 3–4 →](02-chapters-3-4.md)

> ✎ **Highlights.** PIXIE is the only assembly-language program in RAINBOW: *"All other
> man-machine communication and data management programs are written in
> [BCPL](https://en.wikipedia.org/wiki/BCPL)"* — Martin Richards' language, born on this
> same [Titan](../../pdp7-reference/GUIDE.md) stack, later parent of B and C. §2.3.2
> praises BCPL's `rv` operator (today you'd say pointer dereference) and names
> *bootstrapping RAINBOW to other machines* as the design goal — software portability as
> strategy, 1972. §2.3.3 defines the RSP element vocabulary (Atom, Atname, Ringpointer,
> NIL-terminator, Ringstart, Block data — the same 5-bit type field the
> [link relocation pass](../../pdp7-reference/TITAN-LINK-PROTOCOL.md) walks). §2.3.3's
> compactor is [Cheney's algorithm](https://en.wikipedia.org/wiki/Cheney%27s_algorithm)
> (Chen 70), compared to Fenichel's. The industrial port target: an
> [ICL 1903A](https://en.wikipedia.org/wiki/ICT_1900_series) at
> [Plessey](https://en.wikipedia.org/wiki/Plessey).

---
<!-- PDF index range: 007–032. Thesis pages covered: 1–6 (Chapter 1), 7–20 and 22–23 (Chapter 2, section 2.3.3 incomplete). Front-matter pages vii–ix (pdf 007–009) skipped. Chapter 3 not reached. Thesis pages 21 and 24–25 not present in this PDF range. -->

## 1. INTRODUCTION

<!-- p.1 / pdf.010 -->

> Was sich überhaupt sagen lässt, lässt sich klar sagen;
> und worüber man nicht reden kann, darüber muss man schweigen.
>
> Ludwig Wittgenstein

### Summary

Many aspects of computer-aided design are difficult to quantify. Therefore, some assumptions have to be made when pursuing research in this field. It is the object of this introductory chapter to outline the author's approach to the subject. Specific technical details are given in subsequent chapters.

### 1.1 The design process

There is a twofold need to discuss the design process at the beginning of this thesis.

First, some knowledge of how an engineer designs complex hardware or software systems is required if a computer is to assist him in his activity.

Second, for the design of the CAD system itself, a design strategy is needed to arrive at a near optimum system, both economically and technically.

It is interesting to find many different interpretations

<!-- p.2 / pdf.011 -->

given to the design process by designers and authors in various fields of engineering (Jon 63, Greg 66). Little agreement is reached on questions such as : what processes of thought are involved before the designer draws his first lines on a sheet of paper; what knowledge and how much of it should be put at the designer's disposal; what is a good environment for design work or what are the best time patterns of working (Gos 68).

These are, on the whole, psychological problems, answers to which, if they could be found, would render the design of a CAD system less difficult.

If assumptions are made about the design behaviour of a designer or group of designers in a particular field of engineering, the problem will become easier. For example, different design environments can be assumed for creative and detailed design. Unfortunately, the resulting CAD system will then lose some of its generality.

In the context of this thesis the design process is considered to consist basically of three stages as illustrated in Fig. 1.1a. These are the creative, analytic and clerical stages. This is an oversimplified view because each stage contains some of the others, but it illustrates that design requires different intellectual efforts.

### 1.2 Computer-aided design

When a computer is included as a design tool in the design of complex systems it appears to be most effective when employed for clerical work. The graph in Fig. 1.1b shows a comparison of the effectiveness between the man and the computer.

<!-- p.3 / pdf.012 -->

> **Fig. 1.1 — The design process.** [visual: (a) Vertical flowchart from STATE OF THE ART and DESIGN NEED through CONCEPTUAL DESIGN (creative), DESIGN EVALUATION (analytical), and TESTING AND PRODUCTION (clerical), with feedback loops. (b) Effectiveness graph: MAN high at creative/low at clerical; COMPUTER the inverse; curves cross at analytical level.]

<!-- p.4 / pdf.013 -->

Clerical work arises principally in communicating design data from one design task to another. Typically, these are sketches, composite drawings, detailed drawings, graphs, parts list, manufacturing instructions etc. If a design consists of many tasks, the work involved in handling the data is large and human errors can easily be introduced. Although this problem is not completely resolved when using a computer, the control and checking of data by the machine will reduce significantly the likelihood of wrong designs. In addition to clerical tasks the computer can assist the engineer also in the analysis stage of a design (Urw 70). A system which provides an environment in which the designer works to carry out a variety of such tasks I have called an integrated computer-aided design (ICAD) system.

Such a system consists of some computer hardware and peripherals on which are implemented a suite of programs and data formats supporting the designer in his work. Much can be said about the hardware needed for an ICAD system. In this thesis, however, the discussion will concentrate on the software aspects. Points related to hardware will only be made when they fundamentally affect decisions in the software design.

An ICAD system is considered to consist of man-machine communication programs, a data base with a number of data management programs and application programs. To describe the aspects of the design of such a system it is thought necessary first to establish a framework or design strategy on which to base the discussion.

<!-- p.5 / pdf.014 -->

### 1.3 A design strategy

General principles of complex systems design such as CAD systems are difficult to establish. Although the concept of systems engineering has received much attention there is still no generally accepted design strategy or method. Systems design has often been defined as the use of scientific principles, technical information and imagination in the definition of a system to satisfy given objectives with the maximum economy and efficiency. It is with establishing the objectives that the characteristics of a system are determined.

For the purpose of designing the ICAD system RAINBOW the following overall objectives or design criteria are considered:

a) Generality
b) Flexibility
c) User convenience
d) Machine independence
e) Schedule
f) Performance
g) Cost
h) Maintainability
i) Life expectancy
j) Reliability

Although some of these criteria are dependent upon others a few will be discussed in separate sections in chapters 2 and 3. That is, generality, flexibility, user convenience, machine independence and schedule. User convenience is concerned principally with aspects of man-machine interaction such as the selection of the communication language, real-time response and accessibility. Computer graphics plays a major role when

<!-- p.6 / pdf.015 -->

considering user convenience and will be discussed in more detail. Criteria f) to j) are embedded in this thesis generally.

## 2. INTEGRATED COMPUTER-AIDED DESIGN

<!-- p.7 / pdf.016 -->

### Summary

This chapter is intended to give a perspective of published work related to the RAINBOW system and a discussion of the major design decisions made.

It has been found that the conceptual design of the data base lies at the heart of the subject discussed in this thesis. Some time is therefore spent on modelling techniques for flow systems within the computer.

Finally, BCPL and RSP are discussed briefly because of their relevance to the implementation of RAINBOW.

### 2.1 Introduction

The idea of using the computer in a variety of tasks for the design problem at hand has been investigated in a number of research programs in recent years. Although the design applications considered differ to some extent, certain trends in the tools developed can be observed.

(a) Development of a high level language which allows for speedy writing of CAD system programs such as translators and simulators.

An example is META/360 (Man 69) which is embedded in PL/1 and allows for extensive data structure manipulations.

(b) Development of a suite of programs the user can call to assist him in a particular design problem.

The ALERT system (Fri 69) is probably one of the

<!-- p.8 / pdf.017 -->

earliest examples. More recently more sophisticated systems such as CASD (Cro 70) have been proposed.

(c) Development of a number of programming languages, problem oriented languages and a control language to provide a set of engineering subsystems in a particular discipline of engineering design.

The Integrated Civil Engineering System (ICES) is designed with these objectives. With the built-in provisions for expansion and change the system has been modified to assist also in electronic design (Hur 70).

(d) Development of a data base and a suite of programs to aid in the design of a particular problem area.

This is the objective of RAINBOW developed at the University Computer Laboratory in Cambridge. The problem area chosen is that of flow systems or networks. Typical examples are electronic circuits, logic systems, Pert diagrams, control systems, flow charts etc.

It is generally agreed that an on-line implementation of an ICAD system is the right approach when frequent interaction by the engineer during the design process is expected. In addition, computer graphics (CG) facilities can provide effective man-machine communication for this kind of design. Both on-line and CG facilities have been available in Cambridge and RAINBOW makes use of whichever is appropriate. The CG operating system is known as PIXIE and was developed to provide cheap graphic interaction in RAINBOW.

Although much goes in favour for on-line mode, batch systems can also provide a useful aid to the designer. To gain

<!-- p.9 / pdf.018 -->

experience with this mode of working and the industrial use of RAINBOW, parts of the system have been implemented by the author on an ICL 1903A computer operating in batch mode at the Plessey Company.

### 2.2 Design criteria

With the few exceptions mentioned, not much experience has been gained in the design of an ICAD system. This lack of relevant data makes such a task a very individual affair and reflects strongly the likes and dislikes of its designers. However, it is by implementing complete systems that the data needed may be gathered and RAINBOW has been built primarily for this purpose. This also resulted in frequent redefinition of some of the criteria initially set out for the design of the system such as generality, flexibility, machine independence or mobility and user convenience.

#### 2.2.1 Generality

The design of a CAD system with unrestricted capabilities seems to be impossible. Certain limitations have to be accepted to make a practical system.

In RAINBOW, the first such limitation was a restriction to sequential or flow systems design. The throughput of these systems may be matter, energy or information. It is interesting to observe that the sought after CAD systems falls itself into this category, the throughput being information. When operational it could be used to design an improved CAD system and so on. A possible arrangement of some of the programs in RAINBOW which are designed to process these network-type applications is given in Fig.2.1. Not every design

<!-- p.10 / pdf.019 -->

> **Fig. 2.1 — General structure of RAINBOW.** [visual: Central DATA BASE box (PIXIE DS and CONN DS storage symbols) with bidirectional links to MAN-MACHINE COMMUNICATION PROGRAMS (CRT and TTY icons), APPLICATION PROGRAMS (CANDTRM, LADDM, ETC.), and DATA MANAGEMENT PROGRAMS (REPLACE, CONN, ETC.).]

<!-- p.11 / pdf.020 -->

application needs all the programs mentioned but as the complexity of a design increases so does the need for a larger spectrum of data manipulation programs.

Central to the RAINBOW system is its data base. It consists of data structures which represent the input and output to design applications. It is the way in which situations are modelled with these data structures which determines the generality of the system. Thus RAINBOW, while suitably equipped to represent flow systems, is unsuited for use in radically different application areas, such as materials technology.

#### 2.2.2 Flexibility

A second major design decision is with respect to the flexibility of the CAD system. Flexibility can be examined from two viewpoints, of the system programmer and the system user. Both are communicating with the computer, although on quite different levels. The system programmer usually communicates with the computer in lower level languages than the user and it is the selection of these languages and their use which determines, for example, with what ease the system can be transferred to different hardware, new applications can be incorporated into the system or existing programs can be altered to take account of new technologies and improved algorithms.

*Remarks for the systems programmer*

It is quite common to start, when implementing any large software system, with a search for a general purpose language and a suitable compiler which supplies all the facilities needed for writing the necessary programs. First, it must be estimated what these facilities should include.

<!-- p.12 / pdf.021 -->

For example, whether there are needs for:

1. A particularly fast compile time
2. A particularly efficient core utilisation
3. List processing capability
4. Character manipulation
5. Direct control over storage allocation
6. Recursive programming
7. Block structuring
8. Extensive debugging facilities
9. Efficient arithmetic operations

The requirements of the data manipulation programs may be different from those of the numerical calculation programs; it may be that none of the languages available is suitable for both. A possible solution then is to divide the programs according to the facilities needed and implement the parts in the language which most nearly provides the required facility.

Three programming languages have been used in RAINBOW. Assembly language has been used to write PIXIE. All other man-machine communication and data management programs are written in BCPL (Rich 69). Application programs are implemented either in BCPL or FORTRAN. A BCPL to FORTRAN and FORTRAN to BCPL interface is available for communication between programs written in these languages.

Although such an arrangement is not always satisfactory with respect to efficiency and elegance, it overcomes the lack of a generally available and more powerful programming language.

A further way of increasing flexibility is by defining the interfaces in the system such that new applications or other utility routines can be simply inserted. This philosophy

<!-- p.13 / pdf.022 -->

has been followed in RAINBOW and is the reason for the name "integrated CAD system".

*Remarks for the user*

Flexibility of an integrated CAD system with respect to the user depends on the

1. procedures available for stating design problems,
2. ease with which a design problem can be moved from one process to another.

#### 2.2.3 Machine independence

With respect to machine independence it is useful to consider the transfer of RAINBOW from an ATLAS to an ICL 1903A computer. Although the two machines run under an entirely different operating system and have very dissimilar hardware, no conceptual difficulties have arisen.

Most programs written in BCPL were easily transferred to the new machine after equipping it with a BCPL compiler. Changes in the programs were minimal and generally consisted of modifying I/O commands. Also the data base concept was easily adapted on the 1903A because both machines provide a 24 bit word length.

The RAINBOW program which requires complete rewriting when transferred to other than DEC PDP7/9/15 computers is PIXIE. Written in assembler language because of severe space restriction, in the process of transfer most of its routines might preferably be written in BCPL if space economy is not the main objective.

<!-- p.14 / pdf.023 -->

#### 2.2.4 Schedule

An approximate distribution of the effort in man-years in the design of RAINBOW is given in Table 2.1. An interesting feature is that the conceptual design of the data base was not the first work. Instead, it was designed in a continuous process after some of the other parts of RAINBOW were written and which provided information for specifying a data base.

Feedback from users of the system caused redesign and rewriting of many of the programs involved.

### 2.3 Data base design and management

Data base features are discussed in this section with respect to their applicability to CAD. The difference between this and more general data management systems such as SDC's TDMS, IBM's GIS Informatics MARK IV etc. is found mainly in the way in which data is represented rather than for example the languages used for implementation or their storage structures. Data management systems for business applications are far more common and better documented, therefore their terminology will be employed here (Cod 71).

Data items and records are stored in a GDM system with the objectives for easy definition, value entry and fast retrieval possibilities. In a CAD system the objectives are more directed towards an effective modelling of physical systems which usually implies the representation of complex relationship between the data items.

This is why circular lists, double linked lists and similar structures are more common in CAD systems than GDM systems. However, some complex structures can also be found in GDM systems, for example, in TRW System Group

<!-- p.15 / pdf.024 -->

**Table 2.1 Schedule for RAINBOW**

| Topic | No. of Graduates | 1967 | 1968 | 1969 | 1970 | men-years |
| --- | ---: | --- | --- | --- | --- | ---: |
| Ring Structure Processor RSP | 2 | 2 | | | | 1 |
| PIXIE | 2–1 | 2 | 1 | 1 | | 4 |
| Non-linear circuit analysis | 1 | 1 | 1 | 1 | 0.5 | 3.5 |
| Other electronic circuit analysis work | 1 | | 1 | 1 | 1 | 3 |
| Data base design | 1–3 | | 0.5 | 0.5 | | 1 |
| Other man-machine communication programs | 2–1 | | | 2 | 1 | 3 |
| Data management programs | 1 | | | 1 | 1 | 2 |
| Syntax analysis, control systems | 1 | | | | 1 | 1 |
| **Total for RAINBOW** | | | | | | **18.5** |

<!-- p.16 / pdf.025 -->

Generalised Information Management (GIM) and GE's Integrated Data Store (IDS). Both allow network type relationship to be defined by the user.

#### 2.3.1 Modelling techniques

Designing data structures is often influenced by the way information is represented outside the computer. For example, a flow system can be represented, in addition to building a physical model, either

(a) pictorially
(b) in alpha-numeric language or
(c) with a mathematical symbolism.

At present, no standardized representation of flow systems exists. It is quite common to model a flow system in more than one of the representations mentioned.

*Pictorial representation*

Modelling a flow system in a pictorial language is probably the most frequent form employed in the design process. An attempt has been made to define the syntax and semantics of such networks (Wal 69). Generally, a flow system diagram presented to RAINBOW is expected to consist of one or more symbols which are connected through lines. Each symbol has a characteristic shape determining its type. Input and output terminals are identified by attachment points. In a RAINBOW produced drawing these can be optionally indicated by crosses as in Fig. 2.2.

All symbols in Fig. 2.2 are drawn and declared by the user and can have any number of attachment points. For built-in RAINBOW symbols provided by the PIXIE program the number of declared attachment points is 2, although the user can modify

<!-- p.17 / pdf.026 -->

this by appropriate commands. A typical set of symbols provided for electronic circuit drawings is given in Fig. 2.3 and for flow charts in Fig. 2.4.

Any drawing containing such symbols is modelled in RAINBOW by a PIXIE data structure which usually is built by the PIXIE program. Examples of these data structures are given in sections 4.4 and 5.4.1.

In network type applications it is common to name the symbols as branches and the lines starting or terminating on attachment points as nodes. Each branch and node has a name and optionally one or more parameter values or other data items.

In addition to the syntactical description of a flow system some data must be given which determines its semantics or meaning. In RAINBOW the meaning of each symbol is determined by a type declaration. This is the generic name given by the user to the symbol. An automatic type generation is provided for built-in symbols. In some systems, as for example in QAS (Wal 69) a type description is also associated with the nodes but no need has arisen for these in RAINBOW.

If these data structures are not suitable as input to a particular task, translator programs in RAINBOW transform the data to the required format. Equally, output of an application program which is not in standard data base form are transformed by other translator programs into this format if it is to be processed by the system at some later stage.

*Mathematical representation*

Flow systems can be represented by an abstract graph. A CONN data structure is the RAINBOW representation of a graph and is built by a variety of programs. An example of a CONN structure is given in section 4.4.

<!-- p.18 / pdf.027 -->

> **Fig. 2.2 — User declared symbols.** [visual: DOCUMENT (wavy-bottom rectangle), CRT (pointed oval), STORAGE (concave-side rectangle), SG ELEM (box with grid base and numbered attachment points); two small circuit symbols with crossed terminals at top.]
>
> **Fig. 2.3 — Electronic circuit symbols.** [visual: resistor, capacitor, inductor, switch; four polygonal active-device symbols.]
>
> **Fig. 2.4 — Flow chart symbols.** [visual: arcs, arrow, scale line; rectangle, circle, triangle, diamond.]

<!-- p.19 / pdf.028 -->

When designing flow systems, graph theoretic concepts can therefore often be helpful. Typical graph theoretic operators in CAD problems are for example, determining descendance relations, shortest path calculation, tree parsing etc. A few definitions of graphs which are relevant to this thesis are given in Appendix I. The notation is based on Berge (Ber 58). Interconnection in a graph can be further abstracted with an adjacency or incidence matrix. Frequently, application programs in RAINBOW require a flow system to be presented in the form of these matrices. Such matrices are produced by special routines.

It is the feature of an ICAD system that many different processes are carried out on the data. Some of these processes are still unspecified during the conceptual design of the data base. This requires the data base to be made task independent within the application area selected.

#### 2.3.2 BCPL

BCPL (Rich 69b) was used as the principle language for writing RAINBOW programs which are concerned with data management. The reason for this was that it allows effective processing of data structures and provides the basis for bootstrapping RAINBOW to other machines (Suf 69). The formal syntax and informal semantics can be found in the BCPL manual (Rich 69a).

Currently, two phases are required to translate a BCPL program to a machine dependent object code. In the first phase the source language is translated into an intermediate object code OCODE. This is essentially the assembly code of a single virtual machine. The second phase is done by the code

<!-- p.20 / pdf.029 -->

generator which translates OCODE into a machine dependent code.

It is this code generator which must be supplied in order to move BCPL to a new machine. Such a program can be written in BCPL itself on a machine with a BCPL compiler and the compiled output loaded on the machine considered for its implementation.

Of great value in BCPL is the rv operator. It provides the mechanism for effectively manipulating vectors and data structures. Although for non-numeric problems this language is very powerful, real arithmetic can not be done. Therefore, a BCPL/FORTRAN interface is provided in RAINBOW to enable such computation to be done in FORTRAN.

#### 2.3.3 The Ring Structure Processor

The Ring Structure Processor (RSP) is a package of subroutines suitable for generating and manipulating data structures (Wis 68b). It is available on the following computers:

DEC PDP7/9/15
RCA SPECTRA-70
ICL ATLAS
ICL 1903A

Typical applications of this package have been for the modelling of electronic networks, logic diagrams, control systems, compiler syntax tables and parse trees, computer flow diagrams and general 2-D drawings. RSP is the principle tool for writing RAINBOW programs and as such its representation of data, storage management and programming features influence the design of most other RAINBOW programs.

<!-- p.22 / pdf.031 -->

> **Fig. 2.5 — RSP element.** [visual: Linked ring structure with ATNAME, PRINTNAME, DATA AREA boxes; TO RINGS and FROM RINGS pointers.]
>
> **Fig. 2.6 — Representation of a resistor in RSP.** [visual: Vertical stack of cells with pointers to instances, attachment points, printname, optional generic type, and display file; value 14 in one cell.]

<!-- p.23 / pdf.030 pdf.032 -->

*Representation of data*

Fundamental to any list or ring processing system is the way in which information or data is represented in storage. In RSP building blocks for creating data structures are called *elements*. Each element consists of a variable number of cells which can be consecutive and/or linked memory locations. A typical element is given in Fig.2.5. Each square box represents one cell and is called an *item*.

Structural information and the printname make up the head of an element. Any other information, for example, parameters or text is usually inserted in the data area.

A field of the five most significant bits in each cell is used as an identifier and determines its type. For the user the most important identifiers are:

| Identifier | Type |
| --- | --- |
| `00000` | Atom |
| `00010` | Atomic name (Atname) |
| `00100` | Ringpointer if remaining bits are non-zero; Terminator (Nil) if they are zero |
| `00110` | Ringstart |
| `10100` | Block data |

The use of these identifiers is illustrated by the example of Fig.2.6 which shows a typical RSP element representing a resistor. This is similar to the way a resistor or any other symbol is modelled in PIXIE.

The user program does of course not need to know the different storage locations of the cells of Fig.2.6 when moving from one item or element to another or processing a structure generally. Routines provided by the package take care of this automatically. Building blocks similar to the one described can also be found in other list processing systems, for example, APL (Dodd 66), CORAL (Rob 64), AED (Ross 67) or SKETCHPAD (Suth 63). Nevertheless, RSP elements distinguish themselves through a more compact storage utilisation.

*Storage management*

Whenever possible, RSP elements are built by the package from consecutive cells in the free list storage area. The free list is arranged as in many other list processors. Elements which have to be made up from fragmented parts of storage are connected through non-items. A non-item is indicated by a 10000 in the identifier field. When the free list is exhausted a garbage collector is called automatically.

Typically, RSP routines are accessed by calls with arguments from some host language. If this language is not freely recursive, routines are provided in RSP which facilitate recursive programming. In the PDP7/9 assembler implementation, pushdown storage is set up for this purpose automatically at assembly time. Such facilities are not required in the BCPL implementation of RSP unless RSP routines compiled by BCPL are called from a non-recursive language via the GLOBAL vector, as may be the case in the 1903A implementations. To allow a program written in PLAN utilising RSP to be recursive the pushdown stack required can be obtained by:

(a) using a stack in the list storage area as a linked list
(b) assigning some storage outside the list area for stacking space
(c) or utilising the BCPL stack required by the RSP routines in BCPL.


---

*Editor's gap patch — pp. 24–25, end of Chapter 2 (transcribed from the scan by the editor; the subagent range ended at p. 23):*

<!-- p.24 / pdf.033 -->

A useful storage management facility is a compacting program. This is for eliminating
non-items in addition to garbage in and between lists to provide a more effective usage
of active storage and filing space.

A non-recursive listcompacting algorithm (Chen 70) is provided in RSP for this purpose.
It is similar to the algorithm of R.R.Fenichel (Fen 69) with respect to copying the
original structure to a new list area and thereby freeing it of all non-items and
garbage.

### 2.3.4 File structuring

In order to file and retrieve information structures in an ICAD system some filing
system must be provided. Different concepts are usually developed for such a facility
depending on the operating mode of the system (on-line or off-line) and the complexity
and number of the files themselves. Common to most filing systems, is nevertheless, the
existence of a Reference File which contains various links to a Document File. The
latter contains all the information structures and other records of the ICAD system. To
enter or retrieve some information the user of the system will typically access the
Reference File first which then initialises corresponding requests on the Document File

On the ATLAS implementation of RAINBOW the filing system provided by the ATLAS operating
system has been used. For the 1903A implementation of RAINBOW a new Reference File
structure is being designed. However, the Document File is similer [sic] in both systems.

<!-- p.25 / pdf.034 -->

Various possibilities offer themselves for the design of a Reference File. Typically,
the structure can be a multiple threaded list (multi list), an inverted or partially
inverted list, a ring associative or set theoretic structure etc. In addition, cellular
partition (Lemk 69) can be introduced to decrease access time on a direct access store
device. A comparison of some structures with respect to retrieval time has been made
(Lemk 69).

> ✎ "Lemk 69" is Heinz citing his own 1969 work on file-structure retrieval times — a
> research thread predating the thesis.

Next: [Chapters 3–4 →](02-chapters-3-4.md)
