# HN — SUPDUP line saving, then Gosling's redisplay (7 Nov 2021)

Don Hopkins, [29144157](https://news.ycombinator.com/item?id=29144157), on [Ask HN: What was it like to use BBS?](https://news.ycombinator.com/item?id=29144157).

The Gosling redisplay half of this comment repeats the 12 Apr 2020 post, already filed:
[`2020-04-12-hn-redisplay-algorithm.md`](2020-04-12-hn-redisplay-algorithm.md)
([22849522](https://news.ycombinator.com/item?id=22849522)). This page keeps what 2021 adds, and the permalink.

## What 2021 adds: ITS Emacs and SUPDUP

ITS Emacs (the original TECO version), over the **SUPDUP** display protocol, supported **line saving**. The editor could tell the terminal to stash a line before overwriting it, then put that line back almost instantly when you scrolled to it. That mattered at 300 baud, and at 1200. Modems cost about a dollar a baud.

SUPDUP spec, the line-saving section Don linked: https://github.com/PDP-10/supdup/blob/master/supdup.mss#L635

He then points at the Apr 2020 comment for the Gosling algorithm RMS rewrote, and restates the trail:

- UniPress pulled the display-update code out from under RMS. Gosling's optimizer was ugly and brilliant dynamic programming, with a skull-and-crossbones in the comments. RMS rewrote it for GNU Emacs. Faster modems, then window systems, made an "ultra-hot screen management package" less urgent. Gosling published the algorithm.
- The skull is **Brian Reid's**, from Scribe, and is not copyrighted. Room: [`../../brian-reid/`](../../brian-reid/). Copies: [skull](https://donhopkins.com/home/archive/emacs/skull-and-crossbones.txt) · [`display.c`](https://donhopkins.com/home/archive/emacs/mw/display.c) · [paper PDF](https://donhopkins.com/home/documents/EmacsRedisplayAlgorithm.pdf) · [ACM](https://dl.acm.org/doi/10.1145/1159890.806463)
- The cost-matrix comment in `display.c` is quoted in full in the 2020 source. M[i,j] is the minimum cost of rearranging the first i lines onto the first j.
- Gosling's conclusion, which the 2020 file does not carry: on a VAX 11/780, redrawing a fully changed screen was about 0.12 seconds of CPU; typing a screenful with the standard program was about 0.025 seconds; Emacs averaged about 0.004 CPU seconds per keystroke. Algorithm 6 is the stripped Algorithm 5, still on the string-to-string correction result, and still better than the ad-hoc approach. More: [HN 22850973](https://news.ycombinator.com/item?id=22850973).

↑ [`../README.md`](../README.md)
