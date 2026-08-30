# "A Conversation with Andrew Plotkin" (Digital Antiquarian, 6 Dec 2024)

Jimmy Maher's long interview with Zarf, covering childhood Infocom
fandom through IFTF and NarraScope, plus the comment thread.
Source: <https://www.filfre.net/2024/12/a-conversation-with-andrew-plotkin/>

Digest and quotations only, no local copy (Maher's text, his site).
This is the closest thing to an authorized career narrative in Zarf's
own words, which makes it the right document to read the 1989 TinyMUD
primary record against.

## Biographical spine

| When | What |
|---|---|
| 1970 | Born Syracuse, NY; raised New Jersey then Washington DC area |
| ~1979 | Meets *Adventure* on a teletype at his father's office; suggests the golden-eggs solution to the troll bridge |
| ~1980 | Apple II Plus at home; Scott Adams games, *Zork*, Microsoft's *Adventure* port |
| 1980s | Plays every Infocom release as it ships (skips *Plundered Hearts*, "I was a seventeen-year-old boy"); writes BASIC parodies *Enchanter II* (lost) and *Inhumane* |
| 1988-1992 | **Carnegie Mellon** ("I got rejected by MIT!"); first Unix, Mac, Internet, C; roguelikes; **Praser 5** |
| 1992-1995 | Job in the **CMU computer science department**, sharing an apartment with classmates; buys first Mac; writes *System's Twilight* (Cliff Johnson homage) as shareware |
| 1993-94 | Finds an open-source Infocom interpreter and rec.arts.int-fiction; writes his own Z-machine interpreter for X Windows over Mark Howell's ZIP engine, then ports it to Mac |
| 1995 | Moves to Washington DC (Magnet Interactive, 3DO-to-Mac ports); reads the Inform 5 manual "five times in a week"; *A Change in the Weather* co-wins the first IF Competition |
| 1996-2000 | *So Far*, *Lists and Lists*, *The Space Under the Window*, *Spider and Web*, *Hunter, in Darkness*, *Shade*; Glk (1998); **Glulx spec published 1 April 1999** |
| 1999-2005 | Pittsburgh startup acquired by Red Hat, moved to North Carolina, fired, back to Pittsburgh; filesystem company 2000-2005 |
| 2005 | Moves to Boston; falls in with Nick Montfort at MIT |
| 2004 | *The Dreamhold*, deliberately an outreach game ("None of it actually worked") |
| 2010 | Get Lamp premieres at PAX East; Zarf on the panel with Lebling, Moriarty, Meretzky; Jason Scott tells him to do a Kickstarter; **$30,000 raised**; quits day job |
| 2011 | *Meanwhile* iPhone app (Jason Shiga collaboration) |
| 2013 | **Seltani**: "I got totally knocked over by the idea of doing a hypertext MUD. I spent a year writing that." |
| 2014 | *Hadean Lands* ships |
| 2016 | **IFTF** founded with Jason McIntosh, Chris Klimas, Carolyn VanEseltine, Flourish Klink; Zarf first treasurer |
| 2017-2019 | Threaded-NPC-dialog product with Emily Short and Aaron Reed ("management at that company sucked and everybody bailed") |
| 2019 | **NarraScope** at MIT, his idea: ~250 people, $85 admission, broke even (he covered $2000 for the closing bar) |
| 2020s | Dialog engineer at game studios; Shiga "Adventuregame Comics" ports |
| Dec 2024 | Available for contract or full-time work, per Maher's note |

## What the interview does not contain: MIDgaard

The origin story Zarf tells Maher begins in 1993-94, with the
open-source Infocom interpreter and rec.arts.int-fiction. **MIDgaard is
never mentioned.** Neither is TinyMUD.

That is the archaeological point of this file. In December 1989 Zarf
announced, to the TinyMUD list, a Multi-Implementor Dungeon with
object-oriented rooms, programmable object behavior in "a cheapo
Pascalish language," and a real multi-word parser with indirect objects
(see [1989-12-midgaard-what-could-be.md](1989-12-midgaard-what-could-be.md)).
Thirty-five years later, the canonical career narrative starts four
years after that and does not look back. Either it never shipped, or it
did not survive as a story worth telling.

Which makes Don's copy of the announcement a primary source that the
subject's own retrospective omits. Not a contradiction, just a gap, and
gaps are where the interesting questions live. The 1989 letter is also
the only place where the *stated design intent* survives, and the
interview reveals that its author went on to solve the same problems
at a different seam.

## Praser 5: the filesystem as a MUD, at CMU, circa 1990

The find in this interview. Asked about *Praser 5*, Zarf explains it
was not originally a parser game at all:

> That was not originally a parser-based text adventure. It was a
> puzzle stuck inside the CMU filesystem. Every "room" was a directory,
> connected by symlinks. You literally CDed into the directory and
> typed "ls," and the description would pop up in the file listing.
> Then you would type, "cd up," "cd left," whatever, to follow symlinks
> to other directories. It was an experiment in using the tools of a
> shared computer system to make an embedded game. The riddles were a
> matter of running a small executable which was linked in each
> directory. I used file permissions to give people access to more
> things as they solved more puzzles.

Directories as rooms. Symlinks as exits. `ls` as `look`. Executables in
each room as its verbs. File permissions as the progression gate. On a
shared multi-user system, so other people are in there with you.

That is [MOOLLM's](https://github.com/SimHacker/moollm) premise
verbatim, twenty-five years early, and it is the same seam Don was
working the same year: the December 1989 mapping-droids letter
describes building "my own database that parallels the TinyMUD
universe," one Emacs window per room, in a hypertext authoring tool
(see [the client dig](../../don-hopkins/sources/1989-tinymud-archive/clients/README.md)).
Two CMU-adjacent people in the same twelve months, both deciding that
the right substrate for a room graph is the tool you already live
inside: one chose the filesystem, the other chose Emacs.

### The patent it independently converges with

Owen Densmore and David Rosenthal filed
[US 5,187,786](https://patents.google.com/patent/US5187786A/en) at Sun
on 5 April 1991, granted 16 February 1993: "implementing a class
hierarchy of objects in a hierarchical file system." Classes and
instances are directories, **path files** carry the delegation chain
(the shell PATH used as a dictionary stack, with Self and Super),
executables in the directory are the methods, and the instance
variables are files reachable only through those methods.

Praser 5 is contemporaneous and independent, and makes the same three
moves on the same substrate. The link is the only thing that differs:
Densmore and Rosenthal read an edge as **inheritance**, walk it to find
the method; Plotkin read it as **movement**, walk it to be somewhere
else. In a hierarchical filesystem those are the same arrow, which is
why MOOLLM can be both at once, a directory being a room you enter and
a prototype you delegate to.

Both designs also refuse to extend the filesystem. The patent's
abstract insists it "does not require the support of additional file
attributes"; Praser 5 was "an experiment in using the tools of a shared
computer system." `cd`, `ls`, symlink, `chmod`, and run-the-executable-
sitting-right-here, treated as a complete object protocol that ships
preinstalled on every machine. Full comparison table in
[the send-code-not-commands trail](../../../process/trails/send-code-not-commands.md).

And the permission trick has a direct descendant: Plotkin gated puzzle
progression with Unix file permissions, which is what MOOAM generalizes
into principals, resources, and grants over rooms and skills.

Zarf later rebuilt it as a conventional Inform 6 parser game, and in
the comments declines to recommend the original as a filesystem
teaching aid, on grounds that are very much his:

> I'm not sure it would be a great introduction to the filesystem. I
> was trying to *subvert* the idea of the filesystem by making it look
> more like a text adventure.

The original still exists, in pre-ANSI K&R C.

## The seam: Don proposed Glk in 1989, Zarf shipped it in 1998

Zarf's account of how Glk came to exist:

> So, now I had this matrix, right? I've got an X Windows front-end and
> a Mac front-end, and they both slap onto the Z-Machine and the TADS
> virtual machine. In a pretty clear way, these things are just plug
> and play. All the virtual machine does is accept text input and
> generate text output. ... And the front-end presents that text in a
> way that suits the platform on which it's running. I was doing the
> same thing that Infocom did, just slicing it into more layers.

Don, to the same mailing list, 20 December 1989, arguing for a tagged
robot protocol on a second port:

> Every string it sends that comes from the database (room
> descriptions, success and fail messages, etc) could have a unique ID
> in the tag so I can instantly know if I've seen it before ... You
> should be able to tell if a packet contains a room name, a room
> description, a player, the name of an object, a message from " or :,
> a page, a status message, the reply to a command, something that can
> be safely ignored (like "Contents:"), or whatever. (Idealy I'd like
> to be able to download PostScript procedures to the mud server that
> tell it what format to send messages back to me. **The standard
> text-based user interface would be just one such procedure.**)

Same insight, nine years apart, from two people on the same list: stop
conflating the world model with its presentation; type the output
stream so any front end can render it; treat the familiar scrolling
terminal as one renderer among many, not as the medium itself. Don
reached for NeWS, where you download PostScript to the display and the
interface is code that travels. Zarf reached for a C API with a
capability model, which is the version that shipped, got ported
everywhere, and is still under Inform 7 today.

The 1989 exchange has usually been read as Don giving Zarf language
advice. The interview shows they were independently circling the same
architectural seam, and only one of them built it.

## Lists and Lists: he hates Lisp

Don's 4 December 1989 letter recommends Scheme, PostScript, or Forth as
the embedded language, and calls Lisp "Ho hum. Scheme is more elegant."
Maher asks Zarf whether he has a special relationship with Lisp:

> Yes! I hate it! I had taken functional-programming courses in college
> and learned LISP. But I just did not jibe with it at all.

He then notes the irony himself, since ZIL descends from MDL, "an MIT
thing, but it was not my thing." And yet *Lists and Lists* (1996) is a
Lisp tutorial implemented as interactive fiction, with a Lisp
interpreter running inside the Z-machine's 64K:

> I had written a LISP interpreter as a programming exercise during my
> first or second year in college.

So the man who was told in 1989 to embed an existing interactive
language went and embedded a Lisp in a game VM in 1996, for a language
he dislikes, as a teaching exercise. That is a better punchline than
either of them could have written on purpose.

### The mirror image: Logo Adventure ran the game inside the language

Don had already shipped the other half of that idea, thirteen years
earlier and from the opposite direction.
[Logo Adventure](../../don-hopkins/sources/logo-adventure-c64-terrapin.md)
(1983, on Terrapin's C64 utilities disk, written at seventeen) has no
engine and no parser: `LOOK`, `N`, `S`, `TAKE`, and `EXAMINE` are Logo
procedures, the world is Logo data, and the Logo read-eval-print loop is
the command processor. Don, on HN: "there was no 'main program' or
parser, it just extended the Logo interpreter top level to be an
adventure game!"

Put the two side by side and they are the same conviction pointed in
opposite directions:

| | Lists and Lists (1996) | Logo Adventure (1983) |
|---|---|---|
| Host | the game VM hosts the language | the language hosts the game |
| The interpreter is | a Lisp written in Inform, inside the Z-machine's 64K | Logo itself, unmodified |
| The parser is | the Z-machine parser, wrapping a REPL | the REPL, no parser at all |
| Rooms and objects are | Inform objects | Logo lists |
| Author's feeling about the language | "Yes! I hate it!" | recommended Scheme to Zarf six years later |
| Why | teach Lisp to IF players | show list processing and functional Logo to kids expecting a turtle |

The 1989 letter reads differently once you know this. When Don told
Zarf "It's got to be an interactive language if you're going to use it
to program an adventure game ... You should be able to type in little
chunks of code to see what happens," he was not theorizing. He had
shipped the existence proof at seventeen, and did not mention it. Zarf
took the long way around, built the language into the machine, and
arrived at the same place: a player typing expressions at a fiction.

Third time for the same move: MOOLLM makes the LLM chat REPL the
parser, directories the rooms, and skills the procedures. Which is why
the [Praser 5 convergence](#the-patent-it-independently-converges-with)
and this one are the same story told in two substrates, filesystem and
interpreter.

## On the argument's actual outcome

Don's advice was: do not invent a language, do not write the manual,
reuse someone else's implementation. What Zarf actually did:

- **Did not invent a language.** He reused Inform: "I ripped apart the
  Inform 6 compiler so it could compile to Glulx from the same game
  source code." Inform 7 later targeted Glulx too.
- **Did invent the layers underneath**, on the theory that generic and
  simple beats the Z-machine's hard-coded object tables: "It adds
  complexity to the compiler, but the compiler already needs code to
  generate object tables in a specific format. ... Then, if we ever
  need to change the format, no problem. We just change the compiler."
- **Wrote the manuals**, which became the field's specifications, which
  is the thing Don warned was worst of all, and is now the reason the
  ecosystem outlived its authors' attention spans.

## The AI exchange (Dec 2024), relevant to MOOLLM

Maher raises LLMs as a possible natural-language front end for old
parser games. Zarf reports the experiment exists and says where the
real gap is:

> Someone did do that as an experiment and posted about it on the
> forum. Experimenting both with using LLMs on the input side to
> translate natural language into parserese, and also on the output
> side to translate generic room descriptions into more flowery,
> expanded text. I'm more interested in the input side because I like
> hand-crafted output ...

> The people who are interested in making parser games are mostly
> old-fashioned artisans who want to hand-craft everything and are not
> motivated to dive into AI as a shiny new pool. It might be different
> if someone who was an established parser-game author jumped in and
> wholeheartedly tried to make it happen. **Revolutions are the result
> of one person getting involved and building something that takes off.
> Someone has to actually do the work.** And to this point, nobody has
> done that. It's very possible the whole AI thing will collapse in six
> months anyway.

Also in the thread, a commenter ("stepped pyramids") reports doing both
directions successfully: "it's kind of fun to translate 'kiss my butt!'
to 'say insult to guard', but I don't know that it's worth the latency."

Zarf's own position on the input/output split (mechanize the parse,
hand-craft the prose) is a sharper statement of the same line the
[soul-chat and VPRL designs](../../../catalogs/soul-city/object-shops.md)
draw: the model routes intent, the human authors the artifact.

## Other threads worth pulling

- **Community trajectory.** Outreach around 2005 failed ("None of it
  actually worked"); growth came from Twine and ChoiceScript after
  2010, and from Inform 7 bringing in authors rather than players.
  A retro-parser cohort now writes small games for real 8-bit
  machines, which forced Inform's version 3 Z-machine support to be
  repaired.
- **Institution building.** IFTF's founding motive is the exact
  problem the Soul City preservation argument names: everything ran on
  "somebody's pocket" with "no fallback plan," e.g. IFDB stalling
  because Mike Roberts had a day job.
- **NarraScope's design values.** Catered lunch so people stay and
  talk, long breaks, and badges that do not distinguish speakers from
  attendees: "we're all here, and we're not going to have superstars."
  Directly usable as Repo Show format precedent.
- **Money, said plainly.** *Hadean Lands* and Bob Bates's *Thaumistry*
  Kickstarters drew nearly identical backer counts and totals: "It's
  the same crowd showing up: 'Yeah, we still love ya!' But they're not
  enough to make a living from."
- **Second acts.** "I never wanted to be a person who was only famous
  for writing games ... I really didn't want to be a person who was
  famous for having been a big game writer in the 1990s. That's a sucky
  position to be stuck in. There needs to be a second act."
- **Possible client-dig crossover.** Commenter **Matt Campbell**
  (screen-reader accessibility, NarraScope 2022 talk) shares a name and
  a niche with the "Matthew Campbell <mattcampbell@pobox.com>" credited
  with pre-RCS modifications in `rmoo.el`, the Emacs MOO mode
  descended from the same client family as the
  [TinyMUD Emacs clients](../../don-hopkins/sources/1989-tinymud-archive/clients/README.md).
  Plausible, unverified; worth one question rather than an assertion.
- **CMU witnesses.** Commenter "Bruce" recalls playing Praser 5 at CMU
  and complaining about it over Zephyr, which dates and corroborates
  the filesystem version.

## Related in this repo

- [1989-12-midgaard-what-could-be.md](1989-12-midgaard-what-could-be.md) -- the thread this interview omits
- [2019-04-what-is-zil-anyway.md](2019-04-what-is-zil-anyway.md) -- Zarf on the Infocom stack
- [../ideas.md](../ideas.md) -- show hooks, several sharpened by this interview
- [TinyMUD archive](../../don-hopkins/sources/1989-tinymud-archive/README.md) and [the Emacs client dig](../../don-hopkins/sources/1989-tinymud-archive/clients/README.md)
