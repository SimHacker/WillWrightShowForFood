# Open ask — Marvin Minsky's TECO Universal Turing Machine

Same method as 2015. Don asked on HN whether anyone still had the TECO Turing-machine
program from Minsky's ITS directory. Harold Ancell (`hga`) posted the 1981-03-11
`*BBOARD` mail. That is still the closest public copy.

This is an ask to anyone, not to someone. The archive channel is separate:
Henry to Distinctive Collections — [`tots-request.md`](tots-request.md).

## What we have

- The 1981-03-11 mail `Re: too-short programs` (`MINSKY@MIT-MC`), recovered by Ancell:
  [`minsky-TECO-turing-machine.txt`](minsky-TECO-turing-machine.txt)
- Raw TECO bytes: [`minsky-utm.teco`](minsky-utm.teco)
- The HN thread that produced it: https://news.ycombinator.com/item?id=10161002
- The machine in that mail is the 7-state 4-symbol UTM from AI Memo 33 / AMS 1962.
  Table, tape, and a 1,870-step run are in [`table.yml`](table.yml).
- A browser stepping of that table: [`simulator.html`](simulator.html)

## What we still want

1. The original file on `AI:MINSKY;` — FN1, every FN2 (version), and the
   DUMP directory line: create, last-write, last-read. Public PDP-10/its
   `MINSKY` still has only `TVDIS`.
2. Neighbors on the same tapes: data files, READ-ME, AIM-33 / tag-system
   drafts — listings first.
3. Directory listings of `AI:MINSKY;` (and `MC:MINSKY;`) from every dump
   that has that directory, especially before 11 March 1981.
4. Anyone who ran it, printed it, or filed it off-machine.
5. How later "fewer states" machines differ in *rules* from the 1962 model
   (finite input on blank tape, one tape, explicit halt). Henry remembers Marvin
   answering a visitor that way and does not remember the distinction. The
   question is the distinction, not the visitor.

A byte-perfect image without dates is half a find. A last-read after the
mail would mean someone ran it; several FN2s would be the working history.

## Search strings

```
y0L1 0yR2 1AR2 AyR6
110101110000010011011
yyAyyAyy
Universal Turing Machine
too-short programs
AIM-33
AIM-033
```

Machine/directory: `AI:MINSKY;` (also `MC:MINSKY;`)
Period: all tapes; the memo is 1961–62, the mail is 11 March 1981.

## Two channels

| Who | Where | For |
|-----|--------|-----|
| Anyone | this page, HN, mail Don | a copy you already have |
| Henry | MIT Distinctive Collections, ToTS | listings, versions, DUMP dates — [`tots-request.md`](tots-request.md) |

The 2015 ask worked because someone still had the mail. The tapes may
still have the file *and* when it was written and read.
