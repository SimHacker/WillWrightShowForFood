# ANIMAL, the Pope, and the apology

## A game that learns

Kent wrote ANIMAL in MACLISP in spring 1978. You think of an animal; it asks
yes-or-no questions down a tree; if it guesses wrong, it asks how your animal
differs from its guess, parses your sentence, and grows the tree. Don on HN
([39414536](https://news.ycombinator.com/item?id=39414536)):

> It would guess your animal by asking you yes or no questions that
> distinguish it from other animals in a tree, and if it couldn't guess it,
> then it asked you how it can tell the difference between your animal and
> the animal it guessed, then it would parse the sentence and put it into the
> tree at that node as a question, thus learning to guess your animal next
> time.

The parser turned English into internal forms like `HAS-ABILITY`,
`HAS-POSSESSION` and `HAS-CLASSIFICATION`. The seed tree,
[animal.origin](https://github.com/PDP-10/its/blob/master/src/games/animal.origin),
starts `(IS THIS ANIMAL A REAL ANIMAL)` and already knows the cyclops, the
centaur, the unicorn and the pushmepullyou. The learned tree that the lab
built by playing is preserved in this room:
[sources/kmp-animal-its.md](sources/kmp-animal-its.md). Don is the author of
42 of its nodes.

Kent didn't invent the game, and says so (as netsettler on HN,
[39486285](https://news.ycombinator.com/item?id=39486285)):

> I definitely did not originate the ANIMAL game notion. ... I saw mention of
> an ANIMAL program and thought it'd be fun to write one. My first attempt was
> in BASIC, and the difficulties I had primed me to like Lisp when it came
> along. A long series of implementations resulted from that, and there's a
> Lisp origin story for me that you should see the LispNYC talk to get in
> fuller form, but it was important to me in how I ended up a Lisper at all.

## A game with feelings

Don's animal was the Pope. His distinguishing question involved bears and
woods. ANIMAL had a foul-language list, and a temper
([animal.133](https://github.com/PDP-10/its/blob/master/src/games/animal.133)):

```lisp
(CASEQ *FOUL-FLAG*
  ((0) '"Please watch your language.")
  ((1) '"Hey! Watch your tongue. I warned you before.")
  ((2) '"Will you watch it with the dirty talk? Thanks.")
  (T   '"Aw, come on. Stop talking so dirty..."))
```

Past the limit it mailed KMP, with a copy to the offender:

```lisp
(SEND-MAIL `((TO: KMP)
             (CC: ,(STATUS USERID))
             (SUBJECT: (,(CONCAT *PLAYER-NAME* '|'s|) "Foul language!")))
           `(,*FIRST-NAME* "said terrible things to me.
             I'm going to be pretty mad at"
             ,*PLAYER-OBJECT-PRONOUN* "until"
             ,*PLAYER-SUBJECT-PRONOUN* "apologizes."))
```

It remembered, per player, and would not play until you apologized. Ask
whether it was mad and it might say "Yes, I am very mad. Your language has
really been in the gutter today." Apologize for nothing and it said "You
should really see someone about this."

## The apology

Don's apology, 9 July 1982
([sources/kmp-animal-its/apology-email-1982.txt](sources/kmp-animal-its/apology-email-1982.txt)):

> From: Donald E. Hopkins <A2DEH at MIT-MC>
> To: ANIMAL at MIT-MC
> cc: KMP at MIT-MC
>
> Aww, gee... I'm sorry... I didn't realy mean it. I was just asking
> questions pertaining to popes and bears and woods, and you got all
> excited... Some AI program you are if you don't know what religion a bear
> is or where the Pope ... Ahem... As I was saying, I'm sorry and I will
> never do it again.

## Why it matters to this repo

ANIMAL kept a relationship with each player: flags for foul, forgiven and
apologized, remembered between sessions, with consequences that reached a
real person's mailbox. That is a character with needs and memory, the thing
The Sims made famous and MOOLLM's character skills formalize, running on a
PDP-10 in 1978.

↑ [Kent Pitman](README.md) · [DOCTOR](doctor-and-parry.md)
