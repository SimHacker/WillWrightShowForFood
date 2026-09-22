# 2015 HN ask — Harold Ancell returns the mail

https://news.ycombinator.com/item?id=10161002

Parent: "The most obsolete infrastructure money could buy" (2015-09-02).

**DonHopkins, 2 Sept 2015:**

> I remember running across a Turing machine emulator implemented in TECO in
> Minsky's home directory that I'd REALLY love to get ahold of.

**hga (Harold Ancell), same day:**

> Ask and yea shall receive:

Then the 1981-03-11 `*BBOARD` mail, with non-printing characters interpolated
as GNU Emacs would show them (`escape` is `^]`, `^^` is one character, as is
`\356`). Ancell's own download of the same object:

http://ancell-ent.com/share/minsky-TECO-turing-machine.txt

Local copy: [`minsky-TECO-turing-machine.txt`](minsky-TECO-turing-machine.txt)
(690 bytes, 2026-09-22 fetch). Control bytes in that file:

| byte | meaning in this copy |
|------|----------------------|
| `0x1b` | TECO ESC (`^[`) |
| `0x1e` | TECO `^^` (ASCII-of-next-character) |
| `0xee` | Bawden evacuated standalone CR (octal 356), not a TECO opcode |
| `0x0a` | Unix LF — wrapping the recovered mail acquired |

Ancell: this is ITS TECO, "by far the most powerful version"; by the time he
showed up, learning it was no longer necessary.

**DonHopkins, 3 Sept 2015:**

> OOP ACK! It was a shot in the dark, but I am SO GLAD I asked!!! Thank you Harold!
> It looks just like I remember. ;)

Related later comments, same research:

| HN | What |
|----|------|
| https://news.ycombinator.com/item?id=10974280 | Don points at the TECO UTM again |
| https://news.ycombinator.com/item?id=10989396 | Tape *head* plus program-state *body* walking a graph of rooms |

Christopher Cherniak's Philosophy and Computers course (Maryland) assigned
trivial TMs on Cherniak's own simulator — copy and add unary, not a UTM.
https://terpconnect.umd.edu/~cherniak/philcomp/
