# ToTS request — Henry is the asker

Don, 22 September 2026: Henry already has material of Marvin's from the
Tapes of Tech Square. He is the right person to ask again. Family
precedent plus a scoped search is how Distinctive Collections has
released individual historical files without opening the rest of the
tree.

The public 2015-style ask stays in [`open-ask.md`](open-ask.md). This
is the archive channel.

Collection: [Tapes of Tech Square (ToTS)](https://archivesspace.mit.edu/repositories/2/resources/1265)
Contact: distinctive-collections@mit.edu
Best extracted tree (CSAIL): `tots/its20x`
Tool: `itstar` (PDP-10/its issue 154)
Access note on the finding aid: digital files are unprocessed and
restricted without prior approval; original creators may request their
own files. Henry is requesting his father's, not a dump of the lab.

## What to ask for (the bits are not the interesting part)

A Unix payload of one file is useful. The DUMP *directory line* is the
research object.

On ITS a file is `DIR; FN1 FN2`. FN2 is the version. A DUMP entry
carries at least:

- create date
- last-write / close date
- last-read / reference date
- word or byte count
- which tape image it came from, and that tape's dump date

Ask for every version (every FN2), not the newest. A TECO program that
compiled itself may have been written, run, overwritten, mailed. The
dates say which. A last-read after 11 March 1981 would mean someone
ran it after the `*BBOARD` mail.

Also ask for neighbors, not just the hit:

- other files in `AI:MINSKY;` (and `MC:MINSKY;` if present) on the
  same tapes — listings first, files on request
- data files the TECO would have read (tapes, tag-system encodings)
- documentation, READ-ME, `.INFO.`
- AI Memo 33 drafts, AIM-033, tag-system writeups, anything whose
  name or contents mention a 4-symbol 7-state machine
- the 11 March 1981 `*BBOARD` mail `Re: too-short programs` if a
  mail archive is on those tapes

Do not ask them to extract the whole MINSKY tree into public GitHub.
Listings and scoped hits. Unrelated private files stay closed.

## Search

Machine/directory: `AI:MINSKY;` (also try `MC:MINSKY;`)
Period: all tapes; the mail is 11 March 1981, the memo is 1961–62,
so earlier dumps matter more than later ones.

```
y0L1 0yR2 1AR2 AyR6
110101110000010011011
yyAyyAyy
Universal Turing Machine
too-short programs
AIM-33
AIM-033
tag system
```

Please return `itstar -l` (or the raw DUMP directory lines), not only
extracted files. Unix copies drop the ITS dates.

## Draft Henry can send

```
Subject: ToTS scoped request — Marvin Minsky, AI:MINSKY; TECO UTM and AIM-33

Hello —

I'm Henry Minsky. You've already pulled some of my father's files from
the Tapes of Tech Square collection for me. I'd like to ask for a
scoped search of the same collection, not a dump of the directory.

We have a 11 March 1981 ITS *BBOARD mail from MINSKY@MIT-MC, "Re:
too-short programs," that contains a TECO Universal Turing Machine.
That mail is the closest public copy. The current public ITS trees
show only TVDIS under MINSKY. We would like the original file on
AI:MINSKY; if it is there — and, as much as the bits, the DUMP
metadata and every version.

Please search tots/its20x (and raw images if the extracted tree
misses it) for AI:MINSKY; and MC:MINSKY;, all dates, using:

  y0L1 0yR2 1AR2 AyR6
  110101110000010011011
  yyAyyAyy
  Universal Turing Machine
  too-short programs
  AIM-33 / AIM-033
  tag system

For each hit, and for every FN2 (version) of that FN1, we would like:

  1. The raw ITS file (itstar extract is fine if the 36-bit image
     is also kept).
  2. The DUMP directory line: create date, last-write, last-read /
     reference date, size, tape image name, tape dump date.
  3. A directory listing of AI:MINSKY; (and MC:MINSKY;) on that
     same tape — names and dates, not necessarily every file body.

Also, if present on those tapes: data files the program used,
READ-ME / documentation, and drafts of AI Memo 33 (the 4-symbol
7-state UTM / p=2 tag systems paper).

We do not need unrelated private files from other directories.
Listings plus scoped hits are enough.

Thank you,
Henry Minsky
```
