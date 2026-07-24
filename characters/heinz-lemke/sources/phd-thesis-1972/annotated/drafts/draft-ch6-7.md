<!-- PDF indices 128–150; thesis pages 119–120 (Ch.5 tail, skipped) and 121–141 (Ch.6–7). Chapter 6 begins pdf.130 / p.121; Chapter 8 not reached (range ends p.141 / pdf.150, Fig. 7.4). -->

<!-- p.121 / pdf.130 -->

## 6. CAD OF SPECIAL PURPOSE TRANSLATOR SYSTEMS

### Summary

Work on a translator system started because a syntax analyser was needed for an application in control systems design. A transfer function had to be checked for syntactic correctness and modelled in some form in the computer. This required the writing of a syntax analyser with suitable input and output formats.

It became apparent that RAINBOW could assist in the design of the syntax analyser, in particular in the representation of input and output.

Because of the rather novel approach taken in this application a detailed justification for this is given in the introduction of this chapter. The RAINBOW representation of syntax and parse tree are then compared with other methods. Finally, the different parts of the syntax analyser are discussed.

<!-- p.122 / pdf.131 -->

### 6.1 Introduction

Research to automate the task of translator writing such as designing compilers, interpreters and assemblers has produced a number of translator writing systems (TWS). A state-of-the-art survey has been given by Feldman and Gries (Feld 68) and more recently Cheatham and Thomas (Cheat 70).

In general, these systems can be used for a large class of languages. Often they also have extensive bootstrapping facilities allowing for easy transfer from one machine to another. Nevertheless, it usually requires a good command of some metalanguage to actually use such a system efficiently. This is unfortunate if translation of only a very simple language is envisaged and the user is an engineer with only limited computer experience. A typical language considered here would be to express transfer functions in control and electrical engineering or Boolean expressions.

In an integrated CAD system it is desirable to have a facility which allows for easy definition and translation of such languages. A translator can be considered as a program which converts information from one format to another. This process is directed by user supplied data such as a syntactical description of the source information to be translated. The source is usually represented by an alpha-numeric string but could conceivably also be a drawing, for example, an electronic network.

Fig. 6.1 shows how the translator is embedded in RAINBOW. Syntax and source string are set up by man-machine communication programs. From this the translator produces some intermediate code, e.g. a parse tree, which is then processed further by application programs.

<!-- p.123 / pdf.132 -->

> **Fig. 6.1 — The translator in RAINBOW.** [visual: Block diagram with TTY and CRT feeding MAN-MACHINE COMMUNICATION PROGRAMS, which produce SOURCE STRING, SYNTAX, and INTERM CODE; TRANSLATOR PROGRAMS take SOURCE STRING and SYNTAX and produce INTERM CODE; APPLICATION PROGRAMS consume INTERM CODE.]

<!-- p.124 / pdf.133 -->

Of particular interest is the method and format employed in representing the syntax. Descriptions of the syntax can be fixed and built into the translator as in the UP-and DOWNCOMPILER of PIXIE or dynamic to the translator as in many meta or compiler-compiler systems.

In a dynamic system the syntax description can take various forms: the more common ones are BNF like metalanguages, tables and graphs. In the compiler this information is either stored in arrays (Sim 69), matrices (Hex 70) or other special tables (Floy 64). Different formats can also be found in the output of the translator during or after syntax analysis, typical are Polish strings, trees or list structures (Gard 68).

The efficiency of the translator is partly dependent on the modelling techniques employed for the input and output. Simple one or two-dimensional arrays can be processed faster and require less storage space. When conditions similar to the one given for an integrated CAD system prevail, i.e. special purpose languages whose syntax have a limited vocabulary or source language documents with a small number of strings, fast compiling speed and efficient core utilization are not the primary objective. Emphasis will be rather on speed of implementing the compiler, on the ease with which the language description can be changed and on the design of an appropriate interface to other systems programs. This led to the following approach:

(a) Representation of the syntax of the language in the form of a syntax graph. To obtain a data structure model the graph is drawn with PIXIE.
(b) Representation of the output of the syntax analysis phase in form of a parse tree whose data structure

<!-- p.125 / pdf.134 -->

is standard to RAINBOW. Such a data structure can also be obtained by drawing the parse tree with PIXIE.

Experiments with the syntax can easily be carried out with PIXIE, e.g. terminals and nonterminals can be redefined, deleted and amended. In addition, semantic information can be entered into the drawing in the normal manner. Processing of the semantics is not done by the system as implemented but is left to the user.

### 6.2 A user's view

In its present form the user typically will position the translator at the front end of an application program. That is, the parse tree produced by the translator will have to be processed by a user supplied program, if such a program is not already available in RAINBOW. The following programs are useful for building the special purpose translator.

(a) PIXIE, for graphical input of syntax graphs and parse trees.
(b) CONN, to produce a connectivity data structure of the syntax graph and parse tree for SYNTANAL and the parse tree processor respectively.
(c) SYNTANAL, for parsing a source language string to produce a parse tree.
(d) JOINUP, for joining up subgraphs of the syntax or subtrees (if any).
(e) CONNMAP, for teletypewriter or lineprinter listing of connectivity information of syntax graphs or parse trees.
(f) PLOT, for graph plotter output of syntax graphs or parse trees.

<!-- p.126 / pdf.135 -->

Typically, the user draws a syntax graph of his language with PIXIE on the CRT screen (more specific information about these graphs will be given in section 6.3.1 ). After filing the PIXIE data structure in the usual manner (see PIXIE manual, section 10), a connectivity data structure of the syntax graph must be generated. The source string of the language can be entered to the syntax analyser as data of branches of a CONN structure.

On successful analysis of the source string a parse tree is generated. An error message will be given if the parse is unsuccessful.

### 6.3 Systems description

A systems chart of the programs and data required for a translation process is given in Fig.6.2. PIXIE and CONN are used to produce a CONN structure of a syntax graph. This structure and a source string, which can itself be embedded in some data structure are the input to the syntax analyser (SYNTANAL). On a successful parse a CONN data structure of a parse tree is produced which can be processed further by some application program. In addition, a picture of this structure can be produced when the proposed program TOPIX is available.

An alternative path for obtaining a parse tree is by drawing it with PIXIE. This is a facility useful in the debugging stage of an application program.

Of particular interest in this system is the representation of the syntax of a language or, rather informally, that part of the language which can be described by some syntactic metalanguage. More formal definitions of

<!-- p.127 / pdf.136 -->

> **Fig. 6.2 — Translation process.** [visual: Flowchart from CRT through PIXIE to SYNTNX GRAPH, CONN, CONN DS, SYNTANA (with STRING IN L input), PARSE TREE, and APPLIC. PROGRAM; feedback loop from PARSE TREE through TOPIX and PIXIE DS back to PIXIE.]

> **Fig. 6.3 — Syntax graph symbol.** [visual: Rectangular symbol labelled SG ELEM with input arrow at top (1) and three downward attachment points (2, 3, 4) in the bottom row.]

<!-- p.128 / pdf.137 -->

language and grammar as used in this thesis are given in Appendix 2. It is based on Feldman (Feld 68) and Wirth (Wir 66).

#### 6.3.1 Syntax

To specify the syntax of a phrase structure language different notations have been developed. The most frequently used are Backus Naur Form like (BNF) and syntax graph representations of grammars.

Graphical representation of a language is particularly useful for the understanding and checking of the syntax. A typical example is the syntactical chart of Algol 60. Representation of a grammar based on a directed graph has been given by Ingerman (Ing 66).

Recently, a related graphical syntax representation similar to a list structure form has been suggested (Coh 70). This representation is essentially equivalent to Cheatham's tables for grammars in a syntax-directed compilation (Chea 64) and is the basis to the method employed in RAINBOW.

Terminals and nonterminals of a language are represented by PIXIE user-built symbols. The symbol which is shown in Fig. 6.3 has 4 attachment points. One or more of these points may be empty, i.e. not connected to any line. Attachment point 1 serves as the input to the symbol and 2, 3 and 4 point to the definition, alternative and successor of symbols respectively.

An empty definition, alternative or successor is represented by a ringstart in the 2nd, 3rd or 4th position in the head of the syntax graph element. In addition, a terminal syntactic type is identified by an apostrophe in the printname.

An example of an unreduced syntax graph of a transfer function language is given in Fig. 6.4.

<!-- p.129 / pdf.138 -->

> **Fig. 6.4 — Unreduced syntax graph.** [visual: Large directed graph of rectangular syntax nodes (TF, NUM, DENOM, POLYN, TRM, ROP, MOP, RN, INT, DIGIT, etc.) connected by lines, with node identifiers N1–N33.]

<!-- p.130 / pdf.139 -->

#### 6.3.2 The parse tree

There are several reasons for making the syntax analyser produce a parse tree in the list structure format rather than, for example, a Polish string.

First, subsequent optimisation during the code generation process is simpler for list structures than for Polish string notations. Reordering of subexpressions in the former can be easy by exchange of pointers, whereas in Polish string notation this represents a non-trivial problem. This is demonstrated in (Gard 68).

Second, the RAINBOW system provides suitable data management routines which make the data structure parse tree conveniently accessable to the user.

Also, the strings given to the syntax analyser are considered to be short in order to produce a small parse tree. This should keep the storage required for the tree and the time required to analyse it to a minimum.

It is left to the user to keep syntactic classes defined for purely grammatical reasons to a minimum. This causes tree nodes of little value to be introduced. No special facilities are provided to remove them or to insert pointers down the most important paths through the tree.

Although there are many ways of representing trees in a computer (Knu 68), for the obvious reason of compatibility within RAINBOW, a CONN structure has been chosen. An example of a parse tree is given in chapter 7.

### 6.4 Syntax directed analysis

In a syntax directed analyser the output is considered to be a function of the syntax description of the input

<!-- p.131 / pdf.140 -->

language. It is assumed that the analyser uses as data an encoding of the syntax description rather than having it embedded into an algorithm.

Typically, such an analyser is augmented with a lexical analyser, a recogniser and a generator. Due to the rather simple languages considered, no lexical analyser is supplied with the system considered here. The recogniser and generator are discussed in sections 6.4.2 and 6.4.3 respectively.

#### 6.4.1 The analyser algorithm

A simple recursive algorithm has been selected for a top-down analysis of source strings in LR(0) grammars. Strings are defined by the syntax graph. On entry its goal is the Starting Type of the syntax graph. Subgoals are then created when arriving at the definition, alternative or successor of the current goal. Thus, to find a match the analyser must traverse some partial graph of the syntax graph consisting of nonterminal nodes.

When a terminal element becomes the current goal the recogniser is called, for example, to recognise a sequence of digits or characters. The analyser identifies a terminal element by a ringstart in the 2nd position in the respective RSP element.

On successful matching a goal or subgoal with part of the input string the generator part of the analyser produces some output, i.e. parts of the parse tree.

#### 6.4.2 Recogniser

A double check is made on entry to the recogniser that the current syntax graph element is really a terminal by testing for an apostrophe in the printname. Then a test is made whether the part of the input string considered is a digit.

<!-- p.132 / pdf.141 -->

letter or some other character. Apart from a sequence of digits and letters no other successive character strings (e.g. :=, //, A->B) are recognised.

#### 6.4.3 Generator

Two ASP elements are created and then interconnected by the generator. One of these elements represents a node of the parse tree and carries in its printname the part of the source string successfully matched. If a nonterminal was the goal, the printname of the corresponding syntax graph element is copied into the printname of the node.

Arcs of the parse tree are modelled by ASP elements with 2 headpointers for connectivity information and a count in the printname. Parse tree nodes and arcs are inserted in the PEG branch and node ring respectively.

<!-- p.133 / pdf.142 -->

## 7. CAD OF CONTROL SYSTEMS

### Summary

This chapter briefly describes an interface of the data base to an application program. The data structure to be processed is a parse tree of a transfer function of the type discussed in chapter 6. An example is given of the unparsing of this tree into a format suitable for input to some analysis program.

<!-- p.134 / pdf.143 -->

### 7.1 Introduction

The objective of this application in feedback control systems design is to demonstrate the use of PIXIE and the syntax analyser described in chapter 6. It does not aim to judge which CAD methods are best.

The analysis methods selected are classical type, e.g. Bode or Nyquist plots. Transfer functions, together with drawings, serve as the main input to RAINBOW. The output is the frequency response of the system, which is represented by a data structure of a coordinate graph suitable for display with PIXIE. The system must be of the single loop type.

### 7.2 A user's view

The user draws the control system with PIXIE and inserts transfer functions as data into the individual control elements. He then files the data structure and initiates several RAINBOW programs to analyse the system.

(a) CONN, for obtaining a CONN structure of the control system.
(b) HLFC, for checking the PIXIE drawing for single loop.
(c) HLSA, for producing a parse tree of the transfer function.
(d) HLSE, for unparsing the parse tree to produce numeric data for the frequency analysis phase.
(e) HLFR, for the frequency response calculation.

<!-- p.135 / pdf.144 -->

(f) GRAPH, for producing a frequency versus magnitude plot.

### 7.3 Systems description

A system chart of various programs useful for a control systems design is given in Fig.7.1. The design loop starts with PIXIE which produces a data structure of the transfer function syntax graph and the control system. The feedback control systems which can be analysed by this system fall into the category of single loop systems, as for example Fig.7.2. It is therefore necessary to check the drawing for this criteria. The program HLFC carries out this check on the connectivity data structure of the control system. The syntax analyser then checks the transfer function in the control element and produces a parse tree if it is correct.

Unparsing of the parse tree is done by a recursive program which is written in BCPL but uses a BCPL-FORTRAN interface for the transfer of data to the frequency analysis program. Output of this program is a single 2-dimensional array of frequency and magnitude which is converted by the GRAPH program to a PIXIE structure. Showing this coordinate graph with PIXIE closes the design loop on the screen. If output on the graphic terminal is not required PLOT can be used instead.

### 7.4 Syntax analysis of the transfer functions

The need for using the syntax analyser to analyse transfer functions is justified by many different forms transfer functions or transmittances may take in control or electrical engineering. Usually these are rational functions given in

<!-- p.136 / pdf.145 -->

> **Fig. 7.1 — Control systems analysis.** [visual: Data-flow diagram from CRT and PIXIE through TFSS, FCS, CONN, TFSCD, FCSCD; branches to SYNTANAL HLSR (parse tree) and CHECKLOOP HLFC; FREQUENCY HLFR produces DATA converted by GRAPH to GRAPH DS feeding back to PIXIE.]

> **Fig. 7.2 — Single loop feedback control system.** [visual: Block diagram with reference R(jω), summing junction producing error E(jω), forward path G(s) to output C(jω), and feedback path H(s) returning B(jω) to the summing junction.]

<!-- p.137 / pdf.146 -->

forms such as:

K(s) = k ∏ᵢ₌₁ᵐ (s - s'ᵢ) / ∏ᵢ₌₁ⁿ (s - sᵢ) = (∑ᵢ₌₀ᵐ aᵢ sⁱ) / (∑ᵢ₌₀ⁿ bᵢ sⁱ) = (M₁ + N₁)/(M₂ + N₂) = A(s)/B(s)

with the degree of the numerator less than the degree of the denominator.

Aᵢ, Bᵢ = real constants
B(s) = polynomial with zeros lying only in left half plane
A(s) = polynomial whose zeros may lie in whole complex plane (it may also be equal to a constant)
M₁, M₂ = even polynomials in s,
N₁, N₂ = odd polynomials in s,
s'ᵢ = aᵢ + jbᵢ = zeros
sᵢ = cᵢ + jdᵢ = poles

The format of the transfer function selected for this application allows for 5 polynomials in the numerator and denominator, with a maximum of 10 terms with unequal exponents,

K(s) = ∏ⱼ₌₀ᶠ (∑ᵢ₌₀ᵐ Aᵢ sⁱ)ⱼ / ∏ⱼ₌₀ᶠ (∑ᵢ₌₀ⁿ Bᵢ sⁱ)ⱼ

where f <= 5 and m, n <= 10.

<!-- p.138 / pdf.147 -->

To obtain a formal description of this expression Backus Normal Form has been chosen as the metalanguage. Table 7.1 gives the syntax of the transfer function. A syntax graph is then produced as discussed in section 6.3.1 and is shown in its reduced form in Fig.7.3. From this representation a connectivity structure is obtained which is then used to drive the syntax analyser. Before entering the syntax analyser a pointer is moved to the first character of a transfer function of the given control system. This pointer serves then as the argument to the analyser call SYNTANAL (FRSTCHAR).

### 7.5 Semantic analysis of parse tree

The semantic analysis of the parse tree, sometimes referred to as unparsing or code generation is the last step before the actual execution of the frequency analysis program. On entry, a pointer points to the top node of the parse tree, e.g. LAFT in Fig.7.4. A recursive algorithm parses the tree to find the terminals (leaves of the tree) which are then processed and entered into a special matrix. Together with some other data generated by this program the matrix is then evaluated by the FORTRAN frequency analysis program.

### 7.6 Frequency analysis

The frequency analysis program evaluates the polynomials of the transfer function and produces a table of frequencies and magnitudes. This table is then converted by the GRAPH program into a PIXIE data structure. An example of analysing the transfer function 1/(1+s12) in the band from 10 to 20 cycles/sec is shown in Fig.7.5 and Fig.7.6. Because of

<!-- p.139 / pdf.148 -->

some numeric inaccuracies produced by the GRAPH program, plotting was done with labels turned off and the coordinate values were added to the graphs manually.

The control systems design application was intended as a demonstration of the PIXIE system for a complete design loop (i.e. graphical input and output) rather than as a production-ready application. The frequency analysis program has been kept very simple, while the syntax analyser was developed further and used by the Plessey Company for register transfer language analysis.

**Table 7.1 — Syntax of transfer function**

| | |
|---|---|
| TF | := `<NUM>` / `<DENOM>` |
| DENOM | := `<NUM>` |
| NUM | := `<POLYN>` \| `<NUM>` `<MOP>` ( `<POLYN>` ) |
| POLYN | := `<TRM>` \| `<AOP>` `<TRM>` \| `<POLYN>` `<AOP>` `<TRM>` |
| TRM | := `<RN>` \| `<RN>` `<MOP>` S \| `<RN>` `<MOP>` S ↑ `<DIGIT>` |
| RN | := `<INT>` \| `<INT>` . `<INT>` |
| INT | := `<DIGIT>` \| `<INT>` `<DIGIT>` |
| DIGIT | := 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 0 |
| MOP | := * |
| AOP | := + \| - |

<!-- p.140 / pdf.149 -->

> **Fig. 7.3 — Syntax graph of transfer function.** [visual: Reduced syntax graph of rectangular nodes (LHTF, NUM, DEN, POL, TRM, RN, INT, etc.) with attachment-point sub-boxes and labelled connecting arcs N1–N28.]

<!-- p.141 / pdf.150 -->

> **Fig. 7.4 — Parse tree of 16.2*S/(1+S↑2).** [visual: Tree diagram with circular nodes labelled EXP, NUM, DEN, PDL, TRM, RN, INT, OP, and terminal symbols for 16, ., 2, *, S, (, ), 1, +, ↑; node identifiers N1–N27 on branches.]
