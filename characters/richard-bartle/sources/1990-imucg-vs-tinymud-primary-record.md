# Bartle against the primary record: a forensic reading of the TinyMUD verdict

An assessment of Richard Bartle's scholarship -- the 1990 British
Telecom survey, the 1996 player-type taxonomy, and *Designing Virtual
Worlds* (2003) -- tested against four primary artifacts from CMU
TinyMUD, December 1989 through April 1990, preserved in
[Don Hopkins's TinyMUD archive](../../don-hopkins/sources/1989-tinymud-archive/README.md).

Method: every Bartle quotation below is verbatim from documents he
publishes at [mud.co.uk](https://mud.co.uk/richard/imucg.htm). Every
counter-exhibit is a dated primary source in this repository. Claims
about influence and reception are marked where they rest on secondary
literature. Per [portrayal standards](../../../schemas/portrayal-standards.md):
public sources only, no fabricated quotes, and Bartle -- who has
[consented to his Adventure-4 incarnation](../CHARACTER.yml) -- may
request correction or removal of any of this.

## 1. The corpus under examination

**"Interactive Multi-User Computer Games" (December 1990).** A field
survey commissioned by British Telecom, written by Bartle under the
banner of MUSE Ltd, the company he co-founded with Roy Trubshaw to
sell MUD2 commercially. Publicly released after a six-month commercial
delay, with contact lists struck out
([abstract](https://mud.co.uk/richard/imucg0.htm)). Section 5.6
reviews TinyMUD; section 7 discusses why people play, stop playing,
and pay.

**"Hearts, Clubs, Diamonds, Spades: Players Who Suit MUDs" (1996).**
The player-type taxonomy -- Achievers, Explorers, Socialisers, Killers
-- distilled from a long-running debate among senior players of a UK
commercial MUD, published in the *Journal of MUD Research*. Spread
far beyond its evidence base by the 1996 Bartle Test (Andreasen and
Downey), which operationalized it as a quiz.

**"Designing Virtual Worlds" (New Riders, 2003).** The field's first
real textbook: design vocabulary, codebase genealogies, a long
treatment of governance and player rights, and the taxonomy expanded
to eight types along an implicit/explicit axis. Later companion
volumes (*MMOs from the Inside Out* and *Outside In*, 2016) restate
and extend the program.

**The counter-archive.** Four files, contemporaneous, unedited:
the [First TinyMUD Robotics Conference minutes](../../don-hopkins/sources/1989-tinymud-archive/meeting.log.txt)
(9 December 1989); the [command encyclopedia and in-game email manual](../../don-hopkins/sources/1989-tinymud-archive/mud-log.txt);
the [Rec Room exit crawl](../../don-hopkins/sources/1989-tinymud-archive/mud-map.txt)
(200+ player-built portals); and the
[email corpus](../../don-hopkins/sources/1989-tinymud-archive/tinymud.txt)
containing Hopkins's language-selection letter and robot-protocol
proposals. Bartle wrote his survey roughly a year after the earliest
of these and had access to none of them.

## 2. The verdict, verbatim

Section 5.6 of the 1990 report concludes:

> This evolutionary view of things completely misses the point: in
> order for room-creation to be worth anything, there has to be a
> user: commodities are valueless if they cannot be sold. TinyMUDs
> have no-one using the products of creation, and are therefore
> little more than chatlines with rooms as conversation pieces. ...
> TinyMUDs are indeed limited only by the imagination of the builder
> -- with heavy emphasis on the word "limited".

And, closing the section:

> By giving game-writing powers to anyone and everyone, it was hoped
> that TinyMUD would be a means of promoting individual expression
> and group interaction. It was a brave attempt, but it didn't work.
> Instead, TinyMUD has probably done more harm than good...

The entire automation culture of TinyMUD receives one sentence:

> TinyMUD has several clients written for it -- most of which work
> with all its descendents -- and half a dozen or so bots. Some of
> these bots are tightly coupled to the program, able to dispense
> pennies etc., and thus are prone to causing crashes.

## 3. What the primary record shows instead

**Against "half a dozen or so bots... prone to causing crashes":**
the conference minutes list twenty-five named attendees, chaired by
fur (Roy Riggs), with TinyMUD's author Jim Aspnes present as the
Wizard, conducting what is in substance a systems workshop: a
language census (C, Emacs Lisp, Pascal, BASIC, lex/yacc), a
sockets-versus-pipes tutorial, publication of three separate
open-source robot codebases by FTP, a proposal for a dedicated robot
server, and a sustained ethics debate -- rate limiting, consent to be
mapped, whether trapping robots is sport or harassment. flexi's
automaton interpreter enforced "an artificial 3 second wait between
MUDAL commands" so robots would not crowd out humans; Fuzzy's Gloria
scaled her waits from one second to five minutes by context; the
Wizard confirmed v1.4 throttles hogging. This is not a bug
report about penny dispensers. It is among the earliest documented
conferences held inside a virtual world on the governance of software
agents in virtual worlds, and the report reduced it to a hazard note.

**Against "commodities are valueless if they cannot be sold":** the
command encyclopedia documents a functioning postal system built
entirely from game primitives -- registered mailboxes, sticky-object
return receipts, drop-chutes, a hand-maintained white pages --
operated by players for players, priced in nothing but reciprocity.
Gloria sold directions, quotes, and charity for pennies nobody
needed. The Rec Room crawl shows two hundred builders competing for
attention with room descriptions, jokes, traps, and puzzles. Value
circulated as recognition. Bartle, evaluating for a telephone company
that billed by the minute, had no column for that currency; the
history of Second Life, Minecraft, Roblox, and The Sims custom
content economy -- the branch descended from exactly this culture --
supplied the column later.

**Against "no-one using the products of creation":** the artifacts
are the products of creation being used. furBot's map answered player
pages with shortest paths. The email system carried real
correspondence. The exit crawl is one player consuming two hundred
other players' work in a single sitting and archiving it.

## 4. What Bartle got right, on his own evidence and ours

A forensic reading obliges symmetry, and the report earns it. Bartle's
*diagnosis* is repeatedly confirmed by the primary record; it is his
*prognosis* that failed.

He wrote that TinyMUD offered "no facilities for game management,"
that quality was unmanageable ("most people are not good
room-describers"), and that databases grew until maintainers gave up.
His own exhibit is devastating and honestly reported: Islandia, seeded
from the 1000-object TinyBASE, reached 14,900 rooms and 3,271 players
by October 1990, of which only 7,503 rooms were used that month; its
maintainers closed it in November, "wearying of trying to trim the
database in the face of its relentless growth towards full capacity."
The minutes corroborate the failure mode from the other side: a macro
on TinyHELL created 1,500 junk rooms in one evening.

All of that was true. The inference -- therefore open creation "didn't
work" -- was the miss. The record shows the community already
inventing the missing infrastructure in real time: mapping robots,
OUTPUTPREFIX/OUTPUTSUFFIX response framing, Hopkins's proposal for a
typed, tagged robot protocol with stable object IDs, Harrison's
etiquette rules. The cure for unmanageable user creation was not
retreat to authored worlds; it was tooling -- curation, attribution,
identity, rate limits, build systems. Bartle saw the disease clearly
and prescribed amputation. The patients built prosthetics instead,
and the prosthetics became an industry.

The structural explanation is visible in the report's own framing: it
is a commercial survey, written by the co-owner of a company selling
a competing authored world, for a telco interested in billable
minutes. Bartle disclosed the commercial orientation plainly, which
is to his credit. But the lens made unpaid maker culture legible only
as churn, and made a robotics conference legible only as a crash
risk.

## 5. The taxonomy, read against the Robot Room

"Hearts, Clubs, Diamonds, Spades" has no cell for the builder and
none for the bot-author, because it was distilled from a commercial
combat MUD where building was staff privilege. Tested against the
minutes, the four types describe the *robots* better than their
authors: Gloria is a Socialiser-Explorer selling directions for
pennies, furBot a pure Explorer, Terminator a Killer -- but "only on
the behalf of a human player," per flexi in the minutes. The people,
meanwhile, were doing something the taxonomy
cannot see: instrumenting the world, extending the construction set
("It effectively extends the power of the construction set" -- Vern,
in the minutes), and arguing about the ethics of automation. Nick
Yee's later empirical work found that player motivations do not
factor into Bartle's four types; the 1989 minutes suggest a simpler
problem -- the sample frame never contained the people who make
things. The eight-type revision in *Designing Virtual Worlds* added
an implicit/explicit axis, not a maker axis.

The loop closes on the record: Will Wright cites Bartle's player
types on camera in the December 2025 Dev Diaries
([source](../../will-wright/sources/2025-12-will-wright-dev-diaries/bartle-player-types.yml))
-- the designer of the construction-set franchise reaching for the
vocabulary of the man who said construction sets don't work, because
it is still the only vocabulary with a brand.

## 6. Quality assessment

Stated flatly, with the evidence above as warrant:

- **As survey:** the 1990 report is the only comprehensive
  contemporaneous census of the field, with real numbers (Islandia's
  monthly actives, TinyBASE's seed size) nobody else recorded. As
  primary-adjacent evidence it is excellent and honestly caveated.
- **As judgment:** its TinyMUD verdict is the largest documented
  missed call in virtual-world criticism -- wrong about the branch
  that produced the commercially and culturally dominant descendants,
  for identifiable structural reasons rather than carelessness.
- **As theory:** the taxonomy is generative, memorable, weakly
  supported, and structurally blind to makers and automata -- the two
  populations the primary record shows defining TinyMUD culture.
- **As textbook:** *Designing Virtual Worlds* remains required
  reading; its governance and rights chapters anticipate debates
  (whose world is it, what do players own) that this project's
  [membership model](../../../catalogs/soul-city/membership-model.md)
  and character petitions inherit directly.

Bartle's standing does not rest on being right about TinyMUD, and
this analysis does not diminish the debt: he co-built the first one.
The point is narrower and more useful -- when the field's canonical
historian and the field's primary record disagree, the record wins,
and this repository holds the record.

## 7. From the Robot Room to here

The through-line from the artifacts to this project, item by item:

| 1989-90 primary record | Descendant |
|------------------------|------------|
| Hopkins's letter: use an existing interactive language for object behavior | MOO's embedded language (1990); SimAntics at Maxis; the [plugin ladder and VPRL](../../../catalogs/soul-city/object-shops.md) |
| Tagged-packet robot protocol with typed messages and stable IDs | LambdaMOO-era client protocols; [GUID registry reference descriptors](../../../catalogs/soul-city/guid-registry.md) |
| Robot ethics: rate limits, consent, do not crowd out humans | Consent-gated tooling and [identification rewards](../../../catalogs/soul-city/rendering-and-rights.md) |
| Islandia's database fatigue; TinyHELL's 1,500-room macro | The [content pipeline](../../../catalogs/soul-city/content-pipeline.md): curation, provenance, builds instead of trimming by hand |
| In-game email built from sticky objects | About slices and object pages backed by real issue trackers |
| "Extends the power of the construction set" | Transmogrifier (1999-2004); the TMog suite |
| Rec Room as 200-exit portal hub | Soul City districts and the sims1 suburbia of shared saves |

Bartle wrote that room-creation is worthless without a user. The Sims
shipped ten years later and demonstrated that the builder *is* the
user, the audience, and the economy -- and thirty-six years later the
maintainers of Islandia would have had a build system.

## Sources

- Bartle, R. *Interactive Multi-User Computer Games*, MUSE Ltd /
  British Telecom, December 1990:
  [contents](https://mud.co.uk/richard/imucg0.htm) -
  [section 5 (TinyMUD review)](https://mud.co.uk/richard/imucg5.htm) -
  [section 7 (discussion)](https://mud.co.uk/richard/imucg7.htm)
- Bartle, R. "Hearts, Clubs, Diamonds, Spades: Players Who Suit
  MUDs," *Journal of MUD Research* 1(1), 1996:
  [mud.co.uk/richard/hcds.htm](https://mud.co.uk/richard/hcds.htm)
- Bartle, R. *Designing Virtual Worlds*, New Riders, 2003
- Yee, N. "Motivations for Play in Online Games," *CyberPsychology &
  Behavior* 9(6), 2006 (empirical critique of the taxonomy's factor
  structure)
- [The TinyMUD archive](../../don-hopkins/sources/1989-tinymud-archive/README.md)
  (primary artifacts, this repository)
- [Will Wright Dev Diaries citation of Bartle types](../../will-wright/sources/2025-12-will-wright-dev-diaries/bartle-player-types.yml)
