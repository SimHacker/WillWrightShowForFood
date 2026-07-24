# References · Appendices 1–3

Thesis pp. 171–186 · [annotated edition index](README.md) · [← chapters 8–9](05-chapters-8-9.md) · [PIXIE User Manual →](07-appendix-4-pixie-user-manual.md)

> ✎ **Highlights.** The 44-entry citation graph places PIXIE precisely:
> [Sutherland's Sketchpad](https://en.wikipedia.org/wiki/Sketchpad) (Suth 63) and
> [Engelbart](https://en.wikipedia.org/wiki/Douglas_Engelbart)'s *Augmenting Human
> Intellect* (Eng 62) above; Wiseman & Hiles' ring structure processor (Wis 68a),
> [Cheney's GC](https://en.wikipedia.org/wiki/Cheney%27s_algorithm) (Chen 70),
> [Richards' BCPL](https://en.wikipedia.org/wiki/BCPL) (Rich 69), and
> [Hartley's Cambridge Multiple-Access System manual](https://en.wikipedia.org/wiki/Titan_(1963_computer))
> (Har 68) as the load-bearing walls; Lowe's PIXIE-on-a-satellite MSc (Low 70) and
> Etherton's application-programs notes (Eth 71) as the family. Appendix 3 excerpts the
> RAINBOW manual's Titan-side operating instructions — the online (`SET RAINBOW`) and
> off-line job description formats. Its final page (thesis p. 186) is not yet
> transcribed; the scan has it.

---
<!-- PDF indices 180–193; thesis pages 171–184. REFERENCES (173–176), Appendix 1 (177–178), Appendix 2 (179–180), Appendix 3 RAINBOW manual extract (181–184, continues). Appendix 4 (PIXIE User Manual) not reached. -->

<!-- p.171 / pdf.180 -->

> **Fig. 9.8 — Capability segments for co-ordinator.** [visual: Block diagram with CCS column linked by arrows to RCS, DOWN COMP, and DS segments, which in turn point to APPLICATION DATA BASE, PRIVATE SEGMENT, DISPLAY FILE, and other capability segments.]

<!-- p.172 / pdf.181 -->

system should be made independent of a particular device type, i.e. the system should easily cope with slightly different but functional equivalent hardware.

One of the changes to the DOWN compiler would therefore include the building of a *virtual* display file. Device dependent display files can then easily be built by some 'Code Generator'. Similarly, the input to the UP compiler should consist of a *virtual* display file built by some conversion program from a *real device* display file. In addition, *virtual* display files simplify the plotting program for the graphic plotter.

Other improvements to PIXIE might include:
(a) A different data structure, e.g. a structure which leaves the *interpretation* of a connected sequence of line segments (i.e. node) to be done outside the PIXIE system.
(b) An improved *annotation mechanism*, e.g. boundary lines, text, alignment markers etc., which may or may not be of the data structure the user sends to an application program.
(c) A facility for drawing lines with given dimensions.

It is also desirable when redesigning PIXIE to use a higher level language whenever possible. For example, all data handling routines could easily be rewritten in BCPL. Any store and computational inefficiencies introduced when using BCPL are compensated for by the ease with which code can be modified. Important are also the self documenting feature of a BCPL program and the reduced effort with which PIXIE can be moved from one machine to another.

<!-- p.173 / pdf.182 -->

## REFERENCES

Bar. 71 Barney, G.C. and Hambury, J.N. "The Connection of Storage Display Terminals to a Time Sharing Computer". The Computer Bulletin, Jan. 1971 pp. 24-28.

Ber. 58 Berge, C. "Théorie des Graphes et ses Application". Dunod, Paris. 1958.

Cheat. 64 Cheatham, T.E. and Sattley, K. "Syntax Directed Compiling". Proc. AFIFS, 1964. SJCC, Vol. 25, pp. 31-57.

Cheat. 70 Cheatham, T.E. and Standish, T.A. "Optimisation Aspects of Compilers-Compilers". SIGPLAN Notices, Oct. 1970. pp. 10-17.

Chen. 70 Cheney, C.J. "A Nonrecursive List Compacting Algorithm". CACM, Vol. 13, No. 11, Nov. 1970. pp. 677-678.

COD. 71 CODASYL Systems Committee report. "Feature Analysis of Generalised Data Base Management Systems". The Computer Bulletin, April, 1971.

Coh. 70 Cohen, D.J. and Gotlieb, C.C. "A List Structure Form of Grammars for Syntactic Analysis". Comp. Surveys of the ACM, March 1970. pp. 65-82

Cro. 70 Crockett, E.D., et al. "Computer-Aided Systems Design", Proc. of the FJCC, 1970. pp. 287-296.

Dodd 66 Dodd, G.G. "APL-A Language for Associative Data Handling in PL/1". Proc. of FJCC, 1966. pp. 677-686.

Eng. 62 Engelbart, D.C. "Augmenting Human Intellect: A Graphical framework", Summary Report SRI Project No. 3578.

Eth. 71 Etherton, M. "Application Programs". Lecture notes of CRC Seminar. April 1971.

Feld. 68 Feldman, J. and Gries, D. "Translator Writing Systems". CACM, Vol. 11, Feb. 1968. pp. 77-113.

Fen. 69 Fenichel, R.R. and Yochelson, J.C. "A LISP Garbage-Collector for Virtual-Memory Computer Systems". CACM, Vol. 12, No. 11, Nov. 1969. pp. 611-612.

Floy. 64 Floyd, R.W. "The Syntax of Programming Languages-A Survey". IEEE, Vol. EC-13, Aug. 1964. pp. 346-353.

<!-- p.174 / pdf.183 -->

Fri. 69 Friedman, I.D. "Methods Used in an Automatic Logic Design Generator (ALERT)". IEEE Transactions on Computers, Vol. C-18, No.7, July, 1969.

Gard. 68 Gardner, R.I. "The development of a Metacompiler Containing List Processing Capabilities". UCLA Report No. 68-65, Dec. 1968.

Gos. 68 Gosling, W. "Design Research". Electronic Design. IEEE Conference Publication N.45, Sept. 1968

Greg. 66 Gregory, S.A. "The Design Method". Butterworths 1966.

Har. 68 Hartley, D.F. "The Cambridge Multiple Access System; User's Reference Manual". The University Mathematical Laboratory, Cambridge.

Hex. 70 Hext, J.B. and Roberts, P.S. "Syntax Analysis by Domolski's Algorithm". The Computer Journal. Vol. 13, Aug. 1970 pp.263-271.

Hil. 70 Hiles, J.O. "Computer Techniques for the Automatic Analysis of Circuits". Ph.D. Thesis, University of Cambridge. Oct. 1970.

Hur. 70 Hurst, R.C. and Rosenstein, A.B. "Integrated Computer-Aided Design Systems". Proc. of the FJCC, 1970. pp.297-314.

Ing. 66 Ingerman, P.Z. "A Syntax Oriented Translator". Academic Press, N.Y. 1966.

Jon. 63 Jones, J.C. and Thornley, D.G. "Conference on Design Methods". Pergamon 1963.

Knu. 68 Knuth, D. "The Art of Computer Programming". Vol.1, Addison-Wesley, 1968. pp.305-422.

Lef. 69 Lefkovitz, D. "File Structures for On-Line Systems" Spartan Books, N.Y. 1969.

Low. 70 Lowe, N.A. "PIXIE, Use of a CRT Display on a Satellite Computer". M.Sc. Thesis, Institute of Computer Science, University of London, Sept. 1970.

Man. 69 Mandel, R.L. "Tools for the Construction of Design Automation Systems". UCLA Report, No.6-69 Jan. 1969.

Mar. 69 Martin, J. "Telecommunications and the Computer". Prentice-Hall, Inc. N.J. 1969. Page 52.

Mich. 68 Michie, D. Fleming, J.G. and Oldfield, J.V "A Comparison of Heuristic, Interactive and Unaided Methods of Solving a Shortest-Route Problem". Machine Intelligence 3, University Press, Edinburgh.

<!-- p.175 / pdf.184 -->

New. 68 Newman, W.M. "A System for Interactive Graphic Programming". Proc. 1968. Spring Joint Computer Conference, page 47.

Rich. 69a Richards, M. "The BCPL Reference Manual". Memorandum-69/1. The University Mathematical Laboratory, Cambridge, England. Jan. 1969.

Rich. 69b Richards, M. "BCPL: A Tool for Compiler Writing and System Programming". Proc. of the SJCC. 1969. pp.557-566.

Rob. 64 Roberts, L.G. "Graphical Communication and Control Languages". Second Congree on Information System Sciences, Spartan Books, Washington, D.C. 1964.

Ross. 67 Ross, D.T. "The AED Free Storage Package". Communication of the ACM, Vol.10, No. 8.Aug.1967.

Sim. 69 Simpson, H.B. "A Compact Form of a One-Track Syntax Analyser". The Computer Journal. Vol.12, No.1, Aug.1969. pp.233-243.

Suf. 69 Sufrin, B.A. "A BCPL Implementation". M.Sc.Thesis of the University os Essex, 1969.

Suth. 63 Sutherland, I.E. "Sketchpad, a Man-Machine Graphical Communication System". AFIPS Proc.SJCC, 1963, pp.329-345.

Urw. 70 Urwich Technology Management Ltd., "The Scope for Computer Aids to Design in the Engineering Industry". Pilot Survey for the Ministry of Technology, 1970.

Wal. 69 Wallace, V.L. "On the Representation of Markovian Systems by Network Models". University of Michigan, SEL Technical Report 42, Aug. 1969.

Weiz. 70 Weizenbaum, J. "Man-Machine Communication in the Light of Artificial Intelligence". ACM International Computing Symposium, Bonn, 1970. Part 4. pp.155-175.

Wil. 66 Wilkes, M.V. "Computer Graphics". Centro Studi Calcolatrici Elettroniche, Pisa, Publication No.100, 1969.

Wir. 66 Wirth, N. and Weber, H. "EULER: A Generalisation of ALGOL and its Formal Definition". Part.1.CACM, Vol.9, Jan. 1966.

Wis. 68a Wiseman, N.E. and Hiles, J.O. "A Ring Structure Processor for a Small Computer". Computer Journal, Vol.10, No.4, Feb.1968.

Wis. 68b Wiseman, N.E. "A Note on Compiling Display File from a Data Structure". The Computer Journal, Vol.11, No.2, Aug. 1968.

<!-- p.176 / pdf.185 -->

Wis. 70c Wiseman, N.E. "Man-Machine Communication". Lecture Notes for Le Breau Summer School, 1970. page 56.

<!-- p.177 / pdf.186 -->

## APPENDIX 1
### GRAPH THEORETIC DEFINITIONS

It is common to adopt for the definitions of graphs a shorthand notation which is based on the symbolism used in set theory. The notation employed here is similar to the one used by C.Berge (Ber 58).

#### Definition A 1.1 Graph

A graph is defined as a multi-valued function mapping of the set X into X. This is written as
G = (X, Γ) or G = (X, U)
Where U is the set of arcs of the graph.
Here the set X = {x | x is a point in the plane} and Γ is a function of the form such that if x and y are two points, y ∈ Γx.
This is represented by a continous line with an arrowhead from x to y. An example is the graph model of a flow system.

#### Definition A 1.2 Subgraph

Given a graph G(X, Γ) a subgraph is defined to be a graph GA = (A, ΓA)
Here A ⊂ X and the function ΓA is defined by
ΓA x = Γx ∩ A
An example is a rung of a filter circuit.

#### Definition A 1.3 Partial graph

Introducing Δ as another function mapping X into X than for a graph G = (X, Γ) a partial graph is defined to be of the form (X, Δ) where
X = {x | Δx ⊂ Γx}
An example is the definional paths of a syntax graph.

<!-- p.178 / pdf.187 -->

#### Definition A 1.4 *Arc, path and circuit*

An arc is directed and consists of an initial and terminal vertex. Denoting an arc by u, a path is a sequence (u1,u2,...) of arcs of G=(X,Γ) such that the terminal vertex of each arc coincides with the initial vertex of the succeeding arc. A circuit is a finite sequence (u1,u2,...) of arcs of G=(X,Γ) such that the terminal vertex of the sequence coincides with the initial vertex of the sequence.

<!-- p.179 / pdf.188 -->

## APPENDIX 2
### GRAMMATICAL DEFINITIONS

As references for the definition of syntax etc. served N. Wirth and H. Weber (Wir 66) and others.

#### Definition A 2.1 *Phrase structure syntax*

A phrase structure syntax G is defined as the quadruple
G = (N, T, S, P) .

N is a given set of nonterminal symbols.
T is a given set of terminal symbols (called also basic symbols)
P is a finite set of productions (called also syntactic rules), of the form α → β (α derives β).
S is the distinguished symbol (also called the special start symbol).
α and β are strings in V*. V* is the set of all strings taken from V = N ∪ T. A *string* is a finite sequence of symbols including the null string (empty string) Λ.

#### Definition A 2.2 *Context free phrase structure syntax*

A context free phrase structure syntax constrains the production α → β such that
(1) each α is a nonterminal symbol
(2) each β is a nonempty string whose symbols are in the vocabulary V.

#### Definition A 2.3 *Phrase structure language*

A phrase structure language L(G) as defined by a context free phrase structure syntax is the set of all strings (sentences) which can be produced from the distinguished symbol S with x consisting only of terminal symbols.
L(G) = { x | S →* x ∧ x ∈ T* }
The symbol →* signifies a chain of production.

<!-- p.180 / pdf.189 -->

#### Definition A 2.4 *Definition, Alternative, Successor*

For example, in a production of the form

A → B|C+D

B is considered to be the definition of A and C+D an alternative to B. The + sign and D are successors to C.

<!-- p.181 / pdf.190 -->

## APPENDIX 3
### EXTRACT OF THE
### RAINBOW SYSTEM MANUAL

#### 1.5 The Cambridge On-Line System

Even when using RAINBOW off-line, it is desirable for the user to have some knowledge of the on-line system.

To begin an on-line session at a terminal, the user must first 'log in', so that the system can check that he is a valid user and is allowed to have the resources (such as amounts of computing time, core store, priority) he requests. Having logged in, he then types a 'command', which causes a program to be run. The program reads input from, and sends output to, 'streams' which contain binary or character information and are accessed sequentially, and 'BSDs' (short for 'backing store devices') which contain core images and may be accessed randomly. An input stream may come from a file or it may be an output stream written by the same or previous command or it may be read from the terminal. An output stream is usually sent initially to the disc, when the stream is 'closed' it may be retained as a file, copied to a peripheral or to the terminal, renamed as an input stream, or thrown away. A BSD is either a file or an area of temporary working space on the disc.

When the program finishes the 'results' stream is renamed as input 252 and a copy of it is typed on the terminal. The user can then type another command. The command in fact consists of three parts, the 'command name' which indicates which program is to be run, an 'environment declaration'

<!-- p.182 / pdf.191 -->

which sets up any streams etc, that may be required, and an 'argument string' which may be used to control the action of the program.

Brief details of how to use the system may be found in "An Introduction of the Cambridge Multiple-Access System" and a fuller description in "The Cambridge Multiple-Access System User's Reference Manual". Details of the commands available are published in "The Cambridge Multiple-Access System Command Specifications."

#### 1.6 Use of RAINBOW on-line

Programs of the RAINBOW system are run using the command RAINBOW/RUN. The format is:

`RAINBOW/RUN environment program argument`

where *environment* is an optional environment declaration (URM 4.2.2)
and *program* is the name of the particular RAINBOW program to be run (e.g. CONN)
and *argument* is any argument string the program may require.

In general data structures read by RAINBOW programs are expected on input stream 1, structures are output to a stream which is renamed as input 1 at the end of the program. Other output is sent to the results stream (which is typed on the teletype) or to output 1 which the user should send to an appropriate peripheral. However, a full description of each program is given in section 2.

As an example, assume the file /LADDER/PIX contains a PIXIE-structure representing a drawing of a ladder network.

<!-- p.183 / pdf.192 -->

Then in the command

`RAINBOW/RUN (/LADDER/PIX) CONN`

the environment declaration (/LADDER/PIX) sets up input 1 to come from /LADDER/PIX and the program CONN is then run, this leaves the CONN-structure on input 1. This may be preserved in a file by the command

`FILE /LADDER/NETWORK`

(which also leaves in on input 1) and a description typed by RAINBOW/RUN CONNKAP

A copy of this description can be produced on the lineprinter by

`PRINT Z`

An analysis of the network giving results in the form of a table for frequencies 1,2,3,...,10 MHz, the internal resistance of the source being 1 and the resistance of the load 100, could be performed by

```
RAINBOW/RUN (I2  *:
0  1.  10.   1.   1.   100.
:
) LADAN
```

If the first number on the second line is 1 instead of 0, the results can be converted by

`RAINBOW/RUN (%) GRAPH`

into a graph which can be plotted by

`RAINBOW/RUN PLOT S1`

or transmitted to PIXIE by

`PDP  W`

If the user then wishes to try again with different values for some components - say with R3=100 - this can be done by

<!-- p.184 / pdf.193 -->

```
RAINBOW/RUN (LADDER/NETWORK) EDIT SE3;E;R;R=100;W;
RAINBOW/RUN (I2  *:
0  1.  10.   1.   1.   100.
:
) LADAN
```

#### 1.7 Use of RAINBOW off-line

#### 4. Off-line jobs

An off-line job, which may be submitted off-line on paper tape or cards, or on-line by means of the RUNJOB or QUEUEJOB command, must have a job description, this is described fully in "The Titan Operating System", which is Chapter 10 of the Titan Machine-code Programming Manual, but is also available separately. In this section sufficient of the facilities are described to allow RAINBOW jobs to be run under control of the COMMAND program.

The first line of the job description consists of the word COMMAND and a title enclosed in parentheses. A title consists of a project number, a user identifier, a slash, and a string of characters not including parentheses or slashes. The first sixteen characters of the title must not be the same for two jobs in the system at the same time.

Example.
`COMMAND (102?RAINBOW/FIRST JOB)`

The following sections may follow in any order:
(a) Input section, the word INPUT followed by any number of lines of the form
`<stream number> <source>`
The stream number must not be greater than 15.


---

*Editor's gap patch — p. 185, Appendix 3 off-line job description format (transcribed
from the scan by the editor):*

<!-- p.185 / pdf.194 -->

The source may be one of:

(i) \<document titles\> —see B. This form must not be used with RUNJOBS or QUEUEJOBS

(ii) FILE (\<file title\>)

(iii) HERE — the stream consists of the following lines up to (but not including) a line
consisting of the characters \*\*\*Z

Examples:

```
(i)   INPUT 2 FILE (RAINBOW/CIRCUIT)
(ii)  INPUT
      1  (ABC123/PROGRAM)
      3  HERE
      1.2   2.3   4.8
      24
      ***Z
      4  (XYZ/MORE DATA)
```

(b) COMP n MINS or COMP n SECS — Sets the time limit for the job. If this section is
omitted, COMP 30 SECS is assumed.

(c) LIMSTORE n K — If this section is omitted, LIMSTORE 12K is assumed for the job
description starting with COMMAND. This is sufficient for most RAINBOW programs, if a
program requires a larger LIMSTORE this is indicated in the appropriate section of 2.

(d) Notes section: the word NOTES on a line by itself, followed by commands as for
on-line working terminated by \*\*\*Z unless it is the last section.

> ✎ Titan batch-job description language: input streams by document title, file, or
> inline heredoc (`HERE … ***Z` — the shell heredoc, 1972 edition), CPU-time and core
> limits per job. Page 186 concludes Appendix 3 and remains untranscribed in this
> edition; the [scan](../PIXIE-PhD-Thesis-HULEMKE-Interactive-Graphics-in-an-integrated-CAD-system-1972.pdf) has it.

Next: [Appendix 4 — the PIXIE User Manual →](07-appendix-4-pixie-user-manual.md)
