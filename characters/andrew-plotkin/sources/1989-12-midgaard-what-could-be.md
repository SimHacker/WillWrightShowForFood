# The MIDgaard thread: Zarf announces, Don replies (December 1989)

Primary source: [`tinymud.txt`](../../don-hopkins/sources/1989-tinymud-archive/tinymud.txt)
in [the TinyMUD archive](../../don-hopkins/sources/1989-tinymud-archive/README.md).
Both messages are quoted verbatim from that file.

## 1. Zarf's announcement (3 December 1989)

From "Andrew C. Plotkin" `<ap1i+@ANDREW.CMU.EDU>` to `Tinymud@CS.CMU.EDU`,
replying to Erik Josowitz's "what could be..." prompt ("does anyone have any
thoughts on how the tinyMUD environment could develop?"):

> Moonchilde and I (Zarf) are beginning work on a new MUD. The big
> improvements are a) the environment is an object-oriented sort of thing,
> instead of a flat database, b) the responses of objects to commands are
> programmable (in a cheapo Pascalish language), and c) the parser will be
> a lot better (multi-word parsing, indirect objects as well as direct
> objects).
>
> The ADV system on mentor.cc.purdue.edu (port 12345) has the
> object-oriented system and programmable objects (I don't know about
> their parser). However, ADV is meant to have only a few builders -- most
> players will be mere mortals. (They may have done this already.) To we
> of tinyMUD, of course, that ruins the whole point of the game, so we're
> writing our own.
>
> (Actually, to distinguish the two sorts of games, we're calling ours a
> MID, for Multi-Implentor Dungeon. Tentative name for the universe :
> MIDgaard.)

Three design commitments in one paragraph: object orientation over a flat
database, user-programmable behavior, everyone a builder. That third one --
rejecting ADV's few-builders model as ruining "the whole point" -- is the
TinyMUD ideology stated as a requirement.

## 2. Don's reply: "what could be..." (4 December 1989, 1:37 AM)

To `ap1i+@ANDREW.CMU.EDU`. The full text is in the archive; the argument in
brief:

> I like your ideas for improvements, for the new MUD you're making.
> Especially the idea of having an embeded language to write object
> behavior. I'm afraid that the "cheapo Pascalish language" might get
> you into some trouble, though. ... language implementation is a bitch,
> and language design is a big hairy mother of a bitch. And of course the
> biggest nastiest bitch of them all is writing the manual.

The prescription: use a pre-existing *interactive* language ("C is right
out. It's not interactive."). The ranked candidates, with Don's verdicts:

| Candidate | Verdict |
|-----------|---------|
| PostScript / NeWS | Top pick -- lightweight processes, event queue, OO PostScript, "quite a potential for graphical adventures"; cites Rehmi Post's PreScript |
| Scheme | "Small, it's powerful, it's religiously correct" -- but lacks NeWS-style processes unless you build them |
| Forth | Mitch Bradley's 68000/SPARC system; "I've always wanted to write an adventure authoring system in Forth!" |
| Lisp | "Ho hum. Scheme is more elegant." |
| Perl | "Now there's a studly language!" -- the ultimate adventure *shell*, but the syntax is a mash |
| ZIL / MDL | Infocom lineage; "I'd do just about anything for original muddle Zork sources." |
| DDL | Dungeon Definition Language, found in 4.3BSD sources; not interactive but worth stealing ideas from |

## 3. What happened next

- **MIDgaard did not ship.** The embedded-language, everyone-builds MUD
  arrived as MOO (Stephen White, 1990; LambdaMOO, Pavel Curtis, 1990-91),
  vindicating the announcement's design and the letter's warning about the
  cost of getting there.
- **Plotkin became the person who does the hard part.** Glulx (the IF
  virtual machine that succeeded the Z-machine), Glk (the I/O standard),
  Blorb (the packaging format) -- each one an implementation *and* a
  manual, the two things the letter named as the torture. The manuals
  became the field's specs.
- **Seltani (2013)** shipped the MIDgaard premise on the web: a
  multiplayer hypertext world with player-writable Ages. Everyone a
  builder, twenty-four years later.
- **The Zork wish came true.** The original MDL sources are public now;
  Don keeps a checkout, forty-odd years after asking.
- The full context -- the robotics conference, the robot-protocol posts,
  the whole 1989 scene -- is indexed in
  [the TinyMUD archive README](../../don-hopkins/sources/1989-tinymud-archive/README.md)
  and read against Richard Bartle's contemporaneous survey in
  [the forensic analysis](../../richard-bartle/sources/1990-imucg-vs-tinymud-primary-record.md).
