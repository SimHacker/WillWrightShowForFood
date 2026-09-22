# AIM-33 — reader's guide

Marvin L. Minsky, MIT AI Memo 33. Typed original undated. Title as printed:

**Universality of (p=2) Tag Systems and a 4 Symbol 7 State Universal Turing Machine**

The 11 March 1981 ITS `*BBOARD` mail is not a generic TECO Turing-machine
interpreter. It *is* this memo's 7-state 4-symbol UTM. Paper `X` is TECO `y`;
paper `B` is TECO `A`; states `q1`–`q7` are Q-registers 1–7. Same table in
*Computation: Finite and Infinite Machines* (1967) §14.8.

The scan has no text layer. This page maps the memo. The PDF is the text of
record. The running machine lives next door.

| | |
|--|--|
| **Local PDF** | [AIM-033-universality-tag-systems-utm-1962.pdf](AIM-033-universality-tag-systems-utm-1962.pdf) |
| **Catalog card** | [AIM-033-universality-tag-systems-utm-1962.yml](AIM-033-universality-tag-systems-utm-1962.yml) |
| **Bitsavers** | https://bitsavers.org/pdf/mit/ai/aim/AIM-033.pdf |
| **Historic CSAIL PDF** (Wayback) | https://web.archive.org/web/20160304000000/http://publications.ai.mit.edu/ai-publications/pdf/AIM-033.pdf |
| **CSAIL browse card** (Wayback) | https://web.archive.org/web/20060913001624/www.ai.mit.edu/research/publications/browse/0000browse.shtml |
| **DSpace** | not in the [AI Memos collection](https://dspace.mit.edu/handle/1721.1/5460) — they have [AIM-52](https://dspace.mit.edu/handle/1721.1/6107), not this |
| **TECO room** | [../teco-utm/](../teco-utm/README.md) |
| **Table as the mail spells it** | [../teco-utm/table.yml](../teco-utm/table.yml) |
| **1981 mail** | [../teco-utm/minsky-TECO-turing-machine.txt](../teco-utm/minsky-TECO-turing-machine.txt) |
| **Step it in the browser** | [../teco-utm/simulator.html](../teco-utm/simulator.html) |

## Contents of the memo

16 typed pages, then two 1995 MIT Libraries scan sheets.

- [§0 Introduction](#0-introduction) (p. 1)
- [§1 Turing machines and *p* = 2 tag systems](#1-turing-machines-and-p--2-tag-systems) (pp. 2–5)
- [§2 Coding for the 4 × 7 UTM](#2-coding-for-the-4--7-utm) (pp. 6–11) — the TECO machine
- [§3 Two registers, two instructions](#3-two-registers-two-instructions) (pp. 12–14)
- [A 2-symbol 25-state encoding](#a-2-symbol-25-state-encoding) (p. 15)
- [References](#references) (p. 16)
- [Scan sheets](#scan-sheets) (pp. 17–18)

## §0 Introduction

Two results, one memo.

1. A simpler proof that Post tag systems can represent any computable process,
   with deletion number *p* = 2 (was *p* = 6 in the 1961 *Annals* paper).
   Dana Scott suggested the two-register representation of a Turing-machine
   instantaneous description. The *p* = 2 construction is joint with John Cocke.
2. A universal Turing machine with four symbols and seven states — "the
   smallest yet reported."

§2 is the 6-state 6-symbol UTM of the AMS paper, simplified and re-encoded
on the back of (1). §3 is a note on the arithmetic basis from [1].

CSAIL's historic card quotes the same two-point abstract and lists no date.

## §1 Turing machines and *p* = 2 tag systems

An instantaneous description is four numbers: the symbol under the head,
the state, and two integers *m* and *n* that encode the left and right
halves of a binary tape (Scott). A move is then double-or-halve on those
registers plus a transfer. Cocke's phase-shifting trick in the production
diagram drops the deletion number to 2: read one symbol, erase that and
the next, append the corresponding word.

This section is the ancestor of AIM-52 / JACM 1964. Those later papers
keep the tag proof and drop the UTM table. Do not fetch AIM-52 when you
want the 7×4.

## §2 Coding for the 4 × 7 UTM

This is the machine in the TECO mail.

Four symbols: `0 1 X B`. `0` is blank. The tape has three regions:

| Region | Alphabet | What |
|--------|----------|------|
| rules | `0`, `1` | tag productions, concatenated in descending symbol order |
| erased | `0` | already-deleted prefix of the working string; not shifted left |
| sequence | `X`, `B` | the working tag string |

A tag letter *A<sub>j</sub>* becomes a unary run of `X`s closed by `B`,
except the last letter needs no trailing `B`. Each production becomes a
binary rule string starting `11`, then unary encodings of the output
symbols in reverse. The machine locates a rule by counting `1`s leftward
from the first `B` of the current symbol, copies the rule word onto the
right of the sequence (inside-out, so `0`→`X` and `1`→`B`), then the
restitution pass erases the *next* symbol as well — deletion number 2.

Head starts on the first `X` of the sequence region, state 1. Halt is
state 3 reading `0`, which happens when two consecutive `B`s appear in
the sequence during the locate phase. That is the mail's `00L0`.

The 1981 TECO program compiles this table by search-and-replace on a
four-character notation, then runs it. The compiled rows live in
Q-registers 1–7; the dispatcher is Q-register B. Independent stepping
of that table reaches halt in 1,870 transitions:
[`../teco-utm/table.yml`](../teco-utm/table.yml).

Robinson (1991) still treated this 7×4 as minimal in the
decrease-one-parameter-without-increasing-the-other sense. Rogozhin's
later family keeps a 7×4 as one tradeoff point. Machines that beat 7×4
on one number usually move the other, or leave this model (infinite
periodic background, no halt). That is the "changed the rules" question
in [`../teco-utm/open-ask.md`](../teco-utm/open-ask.md) item 5.

## §3 Two registers, two instructions

Theorem I of [1] already reduced partial recursive functions to four
instruction types on two integer registers (add-1 / conditional-subtract
on each). Here the basis collapses to two, by merging exchange into add
and subtract, if both registers stay even. Acknowledgment: A. R. Tritter.

## A 2-symbol 25-state encoding

A straightforward recoding of the 4×7 symbols as two-bit blocks
(`0→00`, `1→01`, `X→10`, `B→11`). Each of the seven states becomes a
small decoding tree. He does not claim this is the best 2-symbol
translation of the same machine.

## References

As cited on p. 16 (titles cleaned):

1. M. Minsky, "Recursive Unsolvability of Post's Problem of Tag and
   Other Topics in Theory of Turing Machines," *Annals of Mathematics*
   74(3), November 1961, 437–455.
2. M. Minsky, "Size and Structure of Universal Turing Machines Using
   Tag Systems," *AMS Symposia on Pure Mathematics* vol. 5, 1961
   (marked "in press" here). The published symposium volume is 1962.
   Cocke & Minsky 1964 cite it as: "Size and structure of universal
   Turing machines using Tag systems: a 4-symbol 7-state machine,"
   *Proc. Symposium on Recursive Function Theory*, AMS, 1962.

The 1971 AI Lab bibliography says of AIM-33: a better version is
chapter 14 of *Computation: Finite and Infinite Machines*
(Prentice-Hall, 1967). The table we run is §14.8 of that book.

## Scan sheets

MIT Libraries CS-TR form: report `# AIM-33`, 16 original pages, mimeograph,
received 30 November 1995, scanned 12 February 1996. Funding note on the
agent target: CNRI / ARPA MDA972-92-J1029. Acrobat Distiller 4.0 stamped
the PDF on 20 June 2001. That is why Bitsavers and the old
`publications.ai.mit.edu` tree serve the same 1,875,240-byte file.

## What this is not

| Object | Relation |
|--------|----------|
| [AIM-52](https://dspace.mit.edu/handle/1721.1/6107) / [JACM 1964](https://doi.org/10.1145/321203.321206) | Cocke & Minsky, 1 April 1963. §1 rewritten. No 7×4 table. |
| [AIM-44](https://dspace.mit.edu/handle/1721.1/5460) | Minsky on Post's normal-form theorem. Different memo. |
| `@wwsff/tiny-teco` | Interprets the 1981 program. Does not replace this scan. |
| [`simulator.html`](../teco-utm/simulator.html) | Steps the compiled table, not TECO. |

## External

- Bitsavers copy (what we fetched, 2026-09-22): https://bitsavers.org/pdf/mit/ai/aim/AIM-033.pdf
- Same bytes on Wayback: https://web.archive.org/web/20160304000000/http://publications.ai.mit.edu/ai-publications/pdf/AIM-033.pdf
- CSAIL 0000-browse card (abstract, no date, FTP/PDF links): https://web.archive.org/web/20060913001624/www.ai.mit.edu/research/publications/browse/0000browse.shtml
- ACM title record: https://dl.acm.org/citation.cfm?id=889227
- 1961 *Annals* tag paper: https://doi.org/10.2307/1970319
- Cocke & Minsky 1964 (not the table): https://doi.org/10.1145/321203.321206
- Raphael M. Robinson, "Minsky's Small Universal Turing Machine," *Intl. J. Math.* 2(5), 1991 — operational writeup of this machine: https://doi.org/10.1142/S0129167X91000302
- 1971 AIM bibliography (entry *33, points at CFIM ch. 14): https://bitsavers.org/pdf/mit/ai/aim/AIM-191.pdf

↑ [papers](README.md) · [sources](../README.md) · [character room](../../README.md)
