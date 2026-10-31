# The duel: `EVAL-IN-OTHER-LISP`

Kent didn't stop at writing a program to teach Lisp. He taught Don in person,
over the ARPANET, by challenging him to a duel.

## Don's account

From Don's 2012 Reddit comment, quoted again on HN in 2023
([38061207](https://news.ycombinator.com/item?id=38061207)):

> KMP kindly took the time to personally teach me some LISP, by challenging me
> to a dual! We both ran our own LISP processes, and loaded a function called
> EVAL-IN-OTHER-LISP that used "core link interrupts" to send s-expressions
> from one LISP to another, so we could evaluate code in each other's LISP.
> That made it easy for him to define and call functions in my LISP, which was
> quite fun, but then he set my numeric output base to roman numerals! He won
> that dual.

That was a real MACLISP feature. The Pitmanual on `BASE`: "BASE may also be
the symbol ROMAN, meaning to use roman numeral output where possible." And on
`IBASE`: "(setq ibase 'roman base 'roman) => ROMAN (+ v v) => X (* vi vii) =>
XLII" ([Pitmanual, I/O](https://www.maclisp.info/pitmanual/io.html)). Kent
set it in Don's Lisp, from his own.

## How it worked

ITS had **core links**: a small buffer in the system that one job writes and
another reads, named like a file. The **CLI** device ("core link interrupt")
does one more thing: opening `CLI: uname jname` creates the link *and
interrupts the job* with that user name and job name. The interrupted job
reads the message from `CLA:` ("core link answer"). Kent's notes: "It is
normally the case that other jobs will send directly to a user's HACTRN. If,
however, Lisp is interrupted by a CLI message, it can elect to handle the
interrupt in an arbitrary way."
([ITS reference, §3.4.3](https://web.archive.org/web/20110720170137/http://www.sigfs.org/its-reference/its-reference-1.5.html),
quoted by Don on HN, [20267415](https://news.ycombinator.com/item?id=20267415).)

A MACLISP job could take that interrupt itself. Kent's code is in the
Pitmanual's
[system chapter](https://www.maclisp.info/pitmanual/system.html), as a
"Web-Only Note" of sample code "found in my notes":

```lisp
(defun eval-cli-msg (ignore) ;alternate handler
  (iota ((stream '((cla)) '(block cla)))
    (do ((i 0 (1+ i))) ((= i 8)) (tyi stream))
    (do ((f (read stream nil) (read stream nil)))
        ((null f))
      (errset (eval f) nil)))) ;Quietly evaluate forms...

;; Assumes the other lisp will have EVAL-CLI-MSG as value of CLI-MESSAGE

(defun eval-in-other-lisp (uname jname s-expression)
  (iota ((stream `((cli) ,uname ,jname) '(out ascii block)))
    (print s-expression stream)))
```

Both players do `(setq cli-message 'eval-cli-msg)` and `(sstatus cli t)`.
After that, `(eval-in-other-lisp 'A2DEH 'LISP '(setq base 'roman))` is the
whole attack: `PRINT` an s-expression down a core link, and the other Lisp
`READ`s it and `EVAL`s it, "quietly".

`IOTA` is Kent's macro for I/O that closes its files on the way out
("IOTA: Macros for doing I/O correctly. Bugs/suggestions/complaints to
KMP@MC"), which Don linked when someone on HN wanted "one iota" of their
experience to carry over to Lisp ([29804075](https://news.ycombinator.com/item?id=29804075)).

## Why it matters now

Two programs evaluating each other's s-expressions over a channel is a
message-passing object system in a dozen lines. MOO verbs, NeWS PostScript
sent to the server, and an LLM handing tool calls to an interpreter are all
the same move: send code, not just data, and let the other side run it.
Kent made it into a game, and Don lost the game in Roman numerals.

↑ [Kent Pitman](README.md) · [TEACH;LISP](teach-lisp.md)
