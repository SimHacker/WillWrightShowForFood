# DOCTOR, PARRY, and Weizenbaum's point

## Taught by the author of ELIZA

Kent's Lisp class at MIT was taught by
[Joseph Weizenbaum](../joe-weizenbaum/README.md). From the Pitmanual's
[funnies](https://www.maclisp.info/pitmanual/funnies.html), "Parrying Programs":

> I didn't write the original ELIZA program, although my Lisp class was taught
> by Joseph Weizenbaum, who did. I later wrote a very elaborate program of
> similar kind, which I just called DOCTOR, in order to play with some of the
> ideas.

The source is on ITS:
[games/doc.102](https://github.com/PDP-10/its/blob/master/src/games/doc.102).
Don played it as a tourist. Lars Brinkhoff found Kent's MACLISP ELIZA work,
and it is now part of the ELIZA genealogy project
([elizagen.org](https://sites.google.com/view/elizagen-org/#h.rle1hgawpigd);
HN, [39373567](https://news.ycombinator.com/item?id=39373567)).

## DOCTOR meets PARRY

Kenneth Colby's PARRY at Stanford simulated a paranoid patient. Kent never
linked the programs directly, but he did it once through a human typist:

> I never linked PARRY with my DOCTOR directly, but I did once do it
> indirectly through a manual typist. Part of my record of this exchange was
> garbled, but this is a partial transcript, picking up in the middle. Mostly
> it just shows PARRY was a better patient than my DOCTOR program was a doctor.

He kept PARRY's numbers after each line, and his reading of them:

> my belief has always been that the numeric values after each line are
> PARRY's level of Shame (SH), Anger (AN), Fear (FR), Disgust (DS),
> Insecurity (IN), and Joy (J).

Six emotional state variables on a 1970s chatbot, printed after every reply.
The transcript is on the funnies page. Don's HN posts on it:
[27332340](https://news.ycombinator.com/item?id=27332340) (2021),
[38906177](https://news.ycombinator.com/item?id=38906177) (2024),
[39414609](https://news.ycombinator.com/item?id=39414609) (2024).

## What Weizenbaum meant

Kent's later reflection, from elizagen.org (quoted on HN under the 2024 post):

> The thing about the DOCTOR program, while it was quite elaborate, was that
> it sort of missed the point of what Weizenbaum was trying to say. It's not
> that I didn't understand him, but it took me a long time to really come to
> viscerally understand the seriousness of his point. He said that
> (paraphrasing, maybe badly, from memory) long before we got to real AI, we
> would get to things that seemed smart but weren't, and we would overly
> trust systems that were not really smart. He was, for example, very worried
> about computerized launch of nuclear missiles using what was then thought
> to be AI. But the point of the original ELIZA was not to BE elaborate, it
> was to be simple, and to show how even a tiny, tiny program could seem
> smart. It was hard not to think it could be smarter if it were not so tiny,
> but that misses the point, which was about how easily we were confused, not
> about how much more effectively we could be confused if more energy were put
> in. So whether my DOCTOR or any other was making the right point was hard to
> say. My guess is not.

Written about a 1970s program, it reads as a description of large language
models: the question is "how easily we were confused, not ... how much more
effectively we could be confused if more energy were put in."

↑ [Kent Pitman](README.md) · [ANIMAL](animal.md)
