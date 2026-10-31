# `:TEACH;LISP` and the bright 12-year-olds

Don learned Lisp as a high school kid in Maryland, dialing the NBS TIP at 300
baud and connecting to MIT's PDP-10s over the ARPANET with no password. He
asked nicely for an account, got one the next day for free, and learned
MACLISP from Kent Pitman and Emacs from Richard Stallman (Don on HN,
[49387117](https://news.ycombinator.com/item?id=49387117)).

## The program that taught Lisp

`:TEACH;LISP` was a MACLISP program on ITS that taught you MACLISP. You ran
it, it loaded a lesson, and you typed Lisp at it while it watched. Don on HN
([38061207](https://news.ycombinator.com/item?id=38061207)):

> Here's Kent Pittman's :TEACH;LISP from ITS, which is a MACLISP program that
> teaches you how to program in MACLISP. (That's "Man And Computer Lisp" from
> "Project MAC", not "Macintosh Lisp".)

The source survives in the ITS restoration
([src/teach](https://github.com/PDP-10/its/tree/master/src/teach)): the driver
[teach.159](https://github.com/PDP-10/its/blob/master/src/teach/teach.159),
which looks for its files under `kmp/.teach` on TOPS-20, plus an error
handler, a lesson database, and lessons named for what they teach: `setq`,
`cond`, `defun`, `do`, `prog`, `lambda`, `eval`, `trace`, `fib`. Other lab
hackers wrote lessons for it; [lesson.intro](https://github.com/PDP-10/its/blob/master/src/teach/lesson.intro)
is "by Robert Kerns and Victoria Pigman 9/1/82", and opens:

> IF YOU NEED HELP, just type (HELP). If nothing happens, try typing
> control-G (^G) first. ^G is the magic quit character which will reset
> every thing to normal.

## The tourist policy, from the other side

The AI Lab let strangers use its machines. Not everyone repaid it. When the
MIT-MC hackers argued about Jerry Pournelle's account, Kent, by then at
Symbolics, wrote to [Christopher Stacy](../christopher-stacy/README.md)
on 31 May 1985 (from the mail Don published,
[How Jerry Pournelle got kicked off the ARPANET](http://www.art.net/~hopkins/Don/text/pourne-smut.html),
quoted on HN in [33356932](https://news.ycombinator.com/item?id=33356932)):

> Personally, I'd just turn off his account. It's not like it's the first
> time, and he not only flaunts his use of our machines but stabs us in the
> back with grumblings about why he doesn't like this or that program of ours
> when he gets a chance. (Am thinking particularly of an article he wrote
> which condemned Lisp for reasons amounting to little more than his
> ignorance, but which cited Teach-Lisp in a not-friendly light... The man has
> learned nothing from his presence on MC and sets a bad example of what
> people might potentially accomplish there. I'd rather recycle his account
> for some bright 12-yr-old...)

Don was one of the bright kids. Kent didn't only leave the door open; he
wrote the lessons, played the games, and, in
[the duel](eval-in-other-lisp.md), taught by reaching into Don's Lisp.

## Kent's own start

Kent learned to program "in a world almost devoid of computers", from
magazines and books about what computers would do. He read about an ANIMAL
program, tried to write one in BASIC, and "the difficulties I had primed me
to like Lisp when it came along" (Kent on HN, as netsettler,
[39486285](https://news.ycombinator.com/item?id=39486285)). Then his Lisp
class at MIT was taught by Joseph Weizenbaum ([DOCTOR](doctor-and-parry.md)).
A teacher who was taught by the author of ELIZA, who then wrote a program to
teach Lisp to kids he'd never meet.

↑ [Kent Pitman](README.md)
