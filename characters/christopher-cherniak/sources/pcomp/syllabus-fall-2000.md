# PHIL 209P / HONR 258N — Philosophy and Computers, Fall 2000

Christopher Cherniak's course page at the University of Maryland, as captured by
the Wayback Machine on 3 February 2002:
[web.archive.org/web/20020203013851/http://www.glue.umd.edu/~cherniak/philcomp](https://web.archive.org/web/20020203013851/http://www.glue.umd.edu/~cherniak/philcomp/)
(19 captures, 2002–2023). Text below is the capture's, with the archive's navigation removed.

```text
PHIL 209P / HONR 258N                       Christopher Cherniak
PHILOSOPHY AND COMPUTERS:                   Office: 1103B Skinner
From Logic to Thinking Machines?            Office Hrs: by appt, &
Tu, Th 2:00-3:15                            Tu 3:30-4:30,
Fall 2000                                   Th 3:15-4:00

Summary:

During the past century, formal logic made its greatest progress since
Aristotle.  Its achievements are perhaps comparable to better-known
ones of our era--for instance, of relativity theory or quantum
mechanics.  Paradoxically, the main results of mathematical logic are
negative, demonstrating absolute as well as practical limits on all
computing:  simple, clear problems that an ideal machine the size of
the Universe could never solve.

This research on the abstract theory of computation led directly to
the engineering technology of real-world digital computers
(principally in connection with weapons projects of WW II and the Cold
War; practical large-scale computation was essential in the design of
nuclear weapons).  A more positive outcome of the emergence of real-
world computing hardware has been research on machine intelligence.
Indeed, the computer model of the human mind serves as a central
unifying conceptual framework of the cognitive sciences.

This course proceeds from an introduction to computation theory, to
some philosophy of mind--that is, from the unsolvability results of
computation theory to questions regarding whether machines can (ever)
think.  The first half of the course is organized around the key
concept of computation theory, that of the algorithm or program-
schematic.  The second half focusses on the philosophical adequacy of
computational psychology, the information-processing model of mind;
more concretely, what are the possibilities, prospects, and
limitations of artificial intelligence?

PHIL 209P / HONR 258N is in the area of Mathematics and the Sciences--
Mathematics and Formal Reasoning (Non-Lab)-MS in the CORE Distributive
Studies category.  There will be homework problem assignments in
connection with the first part of the course (some of them to be
worked out using PC software developed for the course by the
University of Maryland Philosophy Department).  For the second half of
the course, the main requirement will be three short papers (about 5
pages each: typed, double-spaced, with 1" margins) on assigned,
well-defined questions.  This is not a programming course, nor does it
require any programming background.  Students not majoring in
philosophy are welcome.

Principal texts (in order of use):
     D. Harel, Algorithmics, 2nd ed, 1992.
    (A. Dewdney, The (New) Turing Omnibus, 1993.)
    [A. Anderson, ed., Minds and Machines, 1964.]
     H. Dreyfus, What Computers Still Can't Do, "3rd" ed, 1992.
    (W. Lycan, ed., Mind and Cognition, 1990.)
    (J. Haugeland, ed., Mind Design II, 2nd ed, 1997.)

Copies of some additional material will be distributed in class.

Other suggested readings:
     M. Minsky, Computation: Finite and Infinite Machines, 1967.
     R. Courant and H. Robbins, What is Mathematics?, 1969.
     S. Kleene, Mathematical Logic, 1967.
     D. Dennett, Brainstorms, 1978.
     P. Winston, Artificial Intelligence, 2nd ed., 1984.

Software packages at Lefrak BSOS Computer Laboratory:
     PCOMP logic engine simulator (TM* & RAM*)         )  UM
     THERMO parallel computation modeller              )  CogSci
     Micro-SHRDLU blocks-world natural-language        )  Courseware
       "understander"
     ELIZA "psychiatrist" program,  J. Weizenbaum
     RACTER conversationalist program,  INRAC Associates

Outline

I. The Nature of Computation

   1. The concept of an algorithm: a finite, completely specified set
       of instructions.
       Harel, Part I, especially ch 1
       (Minsky, ch 5)
       (Kleene, pp. 223-231)

   2. Turing machines: a standard format for algorithms.
       Harel, ch 9, especially 223-238
       TM* PC onscreen Turing machine simulator/interpreter (on PCOMP)

   3. The universal Turing machine: an idealized computer that can
       execute any algorithm.
       Harel, ch 9, especially 242-244
       (Minsky, ch 7)
       UTM on TM* on PCOMP

   4. Unsolvability: the Halting Problem cannot be solved by any
       Turing machine.
       Harel, ch 8, especially 203-211
       (Minsky, ch 8)
       Kleene, pp. 175-183, 246
       (Courant & Robbins, pp. 77-88 (countability & uncountability))
       W. Quine, "The Ways of Paradox," in The Ways of Paradox, 1966

     [Computational intractability vs absolute unsolvability.
       H. Lewis & C. Papadimitriou, "The Efficiency of Algorithms,"
         Scientific American, Jan 1978
       L. Stockmeyer & A. Chandra, "Intrinsically Difficult Problems,"
         Scientific American, May 1979
       Harel, ch 7

   5. The organization of von Neumann machines: a simple model of a
       random-access memory computer.
       RAM* PC onscreen von Neumann machine simulator/interpreter
         (on PCOMP)
       (Dewdney, chs 17 (& 48))

  [6. Parallel computation: out of the von Neumann bottleneck?
       S. Kirkpatrick, C. Gelatt, & M. Vecchi, "Optimization by
         Simulated Annealing," Science 220, 1983
       THERMO parallel computation modeller
       D. Tank & J. Hopfield, "Collective Computation in Neuronlike
         Circuits," Scientific American 257, 1987
       (Harel, ch 10)

(Additional readings for Part I are based on parts of a draft-in-
progress of The Art and Science of Computing, by M. Tuttle (EECS
Department, UC Berkeley); copies of those readings will be distributed
in class.)

II. The Computer as Model of the Mind

   1. Are minds machines: implications of unsolvability theorems?
       D. Dennett, "The Abilities of Men and Machines," in Brainstorms
       (J. Lucas, "Minds, Machines, and Godel," in Anderson)
       Lucas, The Freedom of the Will (1970) chs 24-26
       (R. Penrose, The Emperor's New Mind (1989) ch 4)

   2. Can machines think: Turing's test.
       Harel, ch 12
       A. Turing, "Computing Machinery and Intelligence," in Anderson
       ELIZA "psychiatrist" program & RACTER conversationalist program
        vs  M-SHRDLU "blocks-world" natural language understander
       (Winograd, ch. 1, Understanding Natural Language)

   3. What are mental states: computational psychology.
       H. Putnam, "Robots: Machines or Artificially Created Life?"
       (Putnam, "Minds and Machines," in Anderson)
       (J. Fodor, "The Mind-Body Problem," Scientific American, Jan
        1981)
       N. Block, "The Computer Model of the Mind"
       C. Cherniak, "The Wager," AI Magazine, Aug 1986

   4. Against artificial intelligence: a phenomenological critique.
       H. Dreyfus, Introduction to 2nd Edition (1979), What Computers
         Still Can't Do; also, Introduction to "3rd" Edition (1992)
        (Dreyfus, pp. 155-227, 285-305)
       [C. Cherniak, "Undebuggability and Cognitive Science,"
        Communications of the Association for Computing Machinery,
          April 1988]
```

## What the page says about the software

- **PCOMP** was the lab name for TM\* and RAM\*; the disk also carries AB\*. It is
  recovered in [`disk/`](disk/) and converted in
  [`packages/turing/`](../../../../packages/turing/PCOMP.md).
- **THERMO** ("parallel computation modeller", paired with simulated annealing
  and Hopfield nets) and **Micro-SHRDLU** are listed as UM CogSci Courseware
  alongside PCOMP. Neither is recovered.
- **ELIZA** and **RACTER** are the outside programs, set against Micro-SHRDLU in
  the Turing-test week: two programs that talk without understanding, one that
  understands a tiny blocks world.
