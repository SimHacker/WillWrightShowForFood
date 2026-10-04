# Did the ENIAC have a BIOS? — cold starts, toggles and paper tape

*Guest hub:* [`../../README.md`](../../README.md) · *Recaps hub:* [`README.md`](README.md)

**Source:** Alan Kay's public **Quora** answer to *"Did the ENIAC have a BIOS?"* (answered
19 Sep 2026) and its comment thread, including Don's comment. Captured 2026-09-27, the day
Don commented.

**Nature:** Readability recap of Alan's public writing: layout only, his wording, with two typos
fixed. Other commenters are paraphrased, not quoted. Governed by
[`portrayal-standards.md`](../../../../schemas/portrayal-standards.md).

---

## Alan's answer

"I'm pretty sure it neither had a BIOS, nor anything analogous to a BIOS. I'm on the side of
those who don't consider it to be a stored program computer (there were a few tricks you could
do along those lines, but not enough IMO to qualify)."

Then the more interesting question: does the program for "Basic IO" have to be in firmware to
count? "The letter of the law says 'yes', but I'm more with the spirit of the law, which doesn't
need a ROM to qualify."

In that spirit: "well into the 60s, many computers were started 'cold' with no code at all, but
by first using toggles or other kinds of switches, an operator would key in a few instructions
that would e.g. read in a paper tape full of more instructions. This was the case for most of
the early DEC computers." The CDC 6600 (1964–65) had a panel of switches for cold starts, "much
more convenient than toggles."

Wikipedia dates the first named BIOS to CP/M in 1975 and the "modern" sense to the IBM PC in
1981, both in ROM.

## The thread

- **The 6600's deadstart panel** was 12 rows of 12 bits, which one commenter remembers thinking
  an art form.
- **Hand-booting** went on for a long time: toggling in a loader of about 30 instructions on an
  early PDP-11/70 as late as 1985; keying in about 16 bytes to boot CP/M on machines without a
  boot ROM; a Ferranti FM1600B whose console switches had a drum beside them, so you pressed
  Reset, turned the drum full circle to a raucous clicking, and ran the stage-2 bootstrap tape.
- **Where CP/M's BIOS lived.** Several people pointed out that it was on the boot disk, loaded
  by a small bootstrap ROM. Alan brought Kildall's own words: "I was somewhat reluctant to adapt
  CP/M to yet another controller, and thus the notion of a separated Basic I/O System (BIOS)
  evolved." And he asked "where is 'the code that caused the CPU to read the first track/sector
  of Drive A?'" That, he said, would be the basic I/O system, or "Bootstrap ROM", which "could
  also be termed 'firmware'."
- **BIOS or bootstrap?** One commenter argued that a bootstrap is thrown away after boot while a
  BIOS stays around to do I/O, then noticed that modern systems ignore the BIOS after boot
  anyway.
- **The steel boot tape.** A commenter's old classmate, who had coded on the BESK, claimed the
  bootstrap paper tape wore out and was replaced by one made of steel. Alan doubted it: DEC
  sites kept "many verified copies of the critical paper tape (so steel wasn't necessary!)."

## Alan on DEC and research labs

Unlike IBM, CDC or Univac, which sent four to ten full-time engineers with each machine, DEC
supplied none on site, only "a 'quick call' to get them when necessary." The research labs Alan
worked in never called: they handled the hardware and software glitches themselves.

"I have vivid memories of Bob Sproull at the Stanford AI Lab in the late 60s in a 'holy fury'
when the PDP-10 crashed, debugging the OS with one hand and the HW with an oscilloscope in the
other." The PDP-10 had "sinful" jumpers and even a few one-shots, "one of the worst ideas of all
time, but were used in emergencies which was the usual mode in research computing back then."

## Don's comment

"Footstrapping is starting machine without a Bootstrap ROM, or Sneakernet, or even Network
Sockets — totally barefoot, by enumerating piggies, which keeps you on your toes."

Then Mitch Bradley's Open Firmware, "a rich luxurious FORTH programming system, which has its
own theme song," with the videos of Mitch singing the Open Firmware song and explaining it for
OLPC; and the news that Mitch had just written a PDP-7 Forth, with the description from his
README: XCT threading with a three-instruction NEXT, two-word headers, interactive control
structures, turtle graphics on the 340, source loaded from the emulated paper tape reader, and
a prelude compiled into the image at build time.

## Ties

- **Cold starts on the PDP-7.** The cabinet boots DUEL the way Alan describes: a RIM loader,
  read in from the console, reads the tape's own loader, which reads the game
  ([cabinet README](../../../../packages/cabinet/README.md)).
- **The loader that read backwards.** Supnik's 18-bit paper describes the PDP-4's one-pass
  assembler, whose output tape "was then read, upside down and backward, by the loader"
  ([guide, further reading](../../../../packages/cabinet/reference/GUIDE.md)).
- **Mitch's PDP-7 Forth** and why its threading is interesting:
  [PDP7-FORTH.md](../../../../packages/cabinet/reference/PDP7-FORTH.md).
- **Open Firmware as a command line**, and what tiny-its borrows from it:
  [TINY-ITS.md](../../../../packages/cabinet/TINY-ITS.md#start-from-open-firmware).

---

↑ [Alan Kay](../../README.md) · [Quora recaps](README.md)
