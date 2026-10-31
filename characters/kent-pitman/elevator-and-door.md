# Call me an elevator: the door, the elevator, and `ESCE`

At the MIT AI Lab in 545 Technology Square (NE43), you could buzz open the
ninth-floor door or call the elevator from your terminal. The wires ran from
a PDP-11, the commands ran through a PDP-10, and the last piece, a command for
people at plain ITS terminals, exists because Kent Pitman got jealous.

## The wire

The Knight TV terminals were bitmapped displays run by a PDP-11, the TV-11.
[Christopher Stacy](../christopher-stacy/README.md)'s 1982 orientation guide
for newcomers to the lab,
[*Getting Started Computing at the AI Lab*](../christopher-stacy/sources/ai-wp-235-getting-started-1982/AI_WP_235.pdf)
(MIT AI Working Paper 235, 64-page PDF), says:

> The TV-11 is also connected to the elevators in NE43, and the ninth-floor
> door opener. There are commands to summon the elevator and open the door.

Its table of Knight TV commands (Figure 5-2), typed after the ESCAPE key:

> D — Buzz open the ninth floor door. Your screen flashes when the door has
> been buzzed.
>
> E — Summons the elevator to your floor. Your screen flashes when the
> elevator has been called.

The wiring was spare bits in the TV-11's keyboard multiplexer status
register, Unibus address `764050`, as the `DOOR` server's comments lay out:

| Bit | Wired to | Held |
|---|---|---|
| 8 | call the elevator to floor 8 | about ⅓ s |
| 9 | call the elevator to floor 9 | about ⅓ s |
| 10 | spare | |
| 11 | buzz the ninth-floor door | 3 s |
| 12, 13 | video hardcopy sources | |

Setting a bit pressed the button. The TV-11's own code for ESC D and ESC E is
headed "ELEVATOR CODE 2/13/79 BY DANNY & HIC", with a table from keyboard
number to floor
([tv.147](https://github.com/PDP-10/its/blob/master/src/system/tv.147)).

Lars Brinkhoff, who leads the ITS restoration, confirmed it on HN in 2023 when
Don asked about the elevator and door
([36669251](https://news.ycombinator.com/item?id=36669251), replying to Don's
[36668810](https://news.ycombinator.com/item?id=36668810) in his
[ITS emulator thread](https://news.ycombinator.com/item?id=36664743)):

> The elevator and door hardware was in the TV-11. The IO pins are available
> in the emulator, but alas not connected to anything.

The emulated TV-11 still has the pins. Nothing is wired to them yet.

## The long way round: Lisp Machines

Lisp Machines had no wire to the building. Terminal-D and Terminal-E ran
`BUZZ-DOOR` and `CALL-ELEVATOR`
([chsaux.112](https://github.com/PDP-10/its-vault/blob/master/files/lmio/chsaux.112)):

```lisp
;;; "Physical Support Facilities"
(DEFUN CALL-ELEVATOR ()
  (COND ((TECH-SQUARE-FLOOR-P 8)
         (HACK-DOOR "8"))
        ((TECH-SQUARE-FLOOR-P 9)
         (HACK-DOOR "9"))
        ((FERROR NIL "I don't know how to get an elevator to your location."))))

(DEFUN BUZZ-DOOR ()
  (COND ((TECH-SQUARE-FLOOR-P 9) (HACK-DOOR "D"))
        ((FERROR NIL "I can only open the 9th floor door at Tech square"))))

(DEFUN HACK-DOOR (COMMAND)
  (LET ((RESULT (SIMPLE "AI" (STRING-APPEND "DOOR " COMMAND))))
    (COND ((STRINGP RESULT) (FERROR NIL "Failed trying to hack the door: ~A" RESULT))
          (T (RETURN-PKT RESULT) T))))
```

`HACK-DOOR` opens a Chaosnet connection to MIT-AI, contact name `DOOR`. The
`DOOR` server on MIT-AI's PDP-10, a modified KA10 running ITS
([door.1](https://github.com/PDP-10/its/blob/master/src/lmio1/door.1)) introduces
itself:

> A chaosnet server which performs useful functions like opening the 9th
> floor door to let urchins in to rip off virtually everything in the place.

It calls `T11MP` to map the TV-11's register into its own address space through
the Rubin 10/11 interface, sets the bit, waits, and clears it. How that
interface mapped PDP-11 memory into PDP-10 jobs, and what else it carried (the
XGP printer, the Logo PDP-11, LLOGO's turtle drawing straight into TV memory),
is in
[the 10/11 interface's history, and the cabinet emulator's plan to model its shared memory on it](../../packages/cabinet/MAPPING.md).

### The urchin's confession (from Don)

I only found that comment this year, and I can confirm it's accurate. I was
one of the urchins, a high school kid among several who found their way to
the ninth floor. The hackers at their Lisp Machines and Knight TVs and Ann 
Arbor Ambassadors were far too busy, and too lazy, to get up and see who was 
knocking, so if you knocked long enough somebody would buzz you in from their 
desk. I absconded with velobound piles of manuals and mailing list archives
printed on the Dover laser printer, and armloads of AI Lab memos from the
Publications Department, which were free to anyone who knew they were free. The
Publications Department also had a majestic espresso machine for anyone to use,
rumored to have been a factor in recruiting grad students. And all the
while I was using their PDP-10s for free over the ARPANET, under the lab's
[tourist policy](../don-hopkins/mit-ai-lab-tourist-policy.md), which says right
there in rule 12 that a tourist account "does not imply that the tourist has free
access to the laboratory premises." Guilty as charged, and grateful ever since,
as I've said on Hacker News
[many times over the years](../don-hopkins/mit-ai-lab-grateful-tourist-hn.md).

I was in good company. [Richard Stallman](../richard-stallman/README.md)
showed up in 1971, near the end of his first year at Harvard, and became a
programmer at the lab. When MIT's Laboratory for Computer Science added
passwords in 1977, he decrypted them and sent people their own passwords,
suggesting they change them to the empty string so anyone could log in.
About 20 percent did. Wikipedia's account of
[his years at the AI Lab](https://en.wikipedia.org/wiki/Richard_Stallman#Harvard_University_and_MIT)
tells it, citing Steven Levy's *Hackers*. And
[David Henkel-Wallace](../david-henkel-wallace/README.md), gumby, the same
gumby who remembers the 10/11 as "an arcane process I have thankfully
forgotten", was the youngest urchin ever to get his own office. Today's urchin
is tomorrow's door-buzzer.

## Kent's part

In October 2026 Don posted the `CALL-ELEVATOR` code on Facebook. Kent replied:

> Where's the code for RETURN-PKT? If this is MACLISP I would have expected it
> to valret ":ESCE 8" or ":ESCE 9" because I got jealous of only the people on
> CADR LispMs being able to call an elevator with ESC E and so I asked for a
> command on ITS (which I _think_ is SYS3;TS ESCE) that takes a floor name
> argument.

(It is Lisp Machine Lisp, not MACLISP. Facebook had turned `8)` into 😎 and
`(=` into 😊, which Kent spotted: "And, oh, I see it's taking some of the
parentheses as smileys. Sigh.")

His memory was right. [esce.12](https://github.com/PDP-10/its/blob/master/src/sysen1/esce.12),
titled "Call me an elevator", is built to `SYS3; TS ESCE` by the ITS build
([misc.tcl](https://github.com/PDP-10/its/blob/master/build/misc.tcl)), file
date July 1982. It sends the same Chaosnet request to AI, `DOOR ` plus D, 8
or 9. Given E it works out your floor from your console number, as the TV-11
and the Lisp Machine do. Success prints:

> The deed is done!

So there were three roads to the same register bits: the TV-11, which owned
them; the Lisp Machine, through the `DOOR` server; and `ESCE`, through the same
server, for everyone else.

When Don answered that he'd now need to make a PDP-10 emulator, a PDP-11 
emulator, an elevator emulator, and a door emulator to go with his PDP-7 
emulator, Kent wrote back:

> "need to" is the most interesting part of this odd sentence.

## Retellings

- Don on HN, 2018, the lobby-door etiquette:
  [16254494](https://news.ycombinator.com/item?id=16254494).
- Don on HN, 2022, the AI Lab's tourist policy, with the door:
  [33356932](https://news.ycombinator.com/item?id=33356932).
- gumby on HN, 2014: the Knight TV "was built on a PDP-11 ... the PDP-11 was
  memory mapped into the 36-bit PDP-6 through an arcane process I have
  thankfully forgotten" ([8615907](https://news.ycombinator.com/item?id=8615907)).
  It was the KA10, through the 10/11 interface.
- Lars Brinkhoff on HN, 2023: the hardware was in the TV-11, and the emulator
  exposes its IO pins, unconnected
  ([36669251](https://news.ycombinator.com/item?id=36669251)). Don had also
  asked about the ninth floor's wire-wrapping robot. Lars had heard of it but
  not who built it, and said "The boards were made by Augat."

Two of Don's HN retellings have the keys swapped
([36668810](https://news.ycombinator.com/item?id=36668810),
[49387117](https://news.ycombinator.com/item?id=49387117)). The guide and the
code agree: D is the door, E is the elevator.

↑ [Kent Pitman](README.md)
