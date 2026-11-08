# Procedural rhetoric: games argue with their rules, and The Sims changed lives with one

*Don Hopkins · November 2026*

Games make arguments. Not only with their words and pictures, but with their rules: what you can
do, what it costs, what gets rewarded, what persists, and what was left out. Those rules argue
whether or not the designer meant them to. The Sims is the clearest case I know of a rule
changing real lives, and I was on the team, so here is the theory, the people who named it, what
they built, and the evidence.

## The two terms, which mean the same thing

**[Procedural rhetoric](https://en.wikipedia.org/wiki/Procedural_rhetoric)** is
[Ian Bogost](https://en.wikipedia.org/wiki/Ian_Bogost)'s term, coined in his book
*[Persuasive Games: The Expressive Power of Videogames](https://mitpress.mit.edu/9780262026147/persuasive-games/)*
(MIT Press, 2007). He defines it as "the art of persuasion through rule-based representations and
interactions, rather than the spoken word, writing, images, or moving pictures." He later
summed up where it came from in The Atlantic:

> I developed my own design philosophy that I called procedural rhetoric, an unholy blend of
> Will Wright and Aristotle.

— Ian Bogost, ["Video Games Are Better Without Characters"](https://www.theatlantic.com/technology/archive/2015/03/video-games-are-better-without-characters/387556/), The Atlantic, 2015

**Simulation rhetoric** is [Gonzalo Frasca](https://en.wikipedia.org/wiki/Gonzalo_Frasca)'s term
for the same idea, from "Simulation versus Narrative: Introduction to Ludology" (2003). Wikipedia
says the two "should be considered synonymous." Frasca sees game authors as crafting laws, and
says they convey ideology "by adding or leaving out manipulation rules." He contrasts simulation
with narrative and drama: narrative is the form of the past, drama of the present, and simulation
"is the form of the future. It does not deal with what happened or is happening, but with what may
happen. Unlike narrative and drama, its essence lies on a basic assumption: change is possible."

Bogost took the word *procedural* from Janet Murray's *Hamlet on the Holodeck* (1997), where it
means the computer's "defining ability to execute a series of rules." Rules create "possibility
spaces, which can be explored through play," and those spaces become rhetoric as soon as a game
makes claims about human experience, **"whether they do so intentionally or inadvertently."** That
last part is the one every game designer needs to hear.

The idea is older than computers. Bogost's own example is hide-and-seek where the older kid counts
longer so the younger ones get a fair chance: a rule that argues for equity. Elizabeth Magie's
*The Landlord's Game*, the ancestor of Monopoly, was designed to teach players what monopoly
capitalism does to people.

## What they built, and what they criticized

Frasca and Bogost didn't just theorize. They made games that argue, and co-published the blog
Watercoolergames about them.

- **[September 12th](https://en.wikipedia.org/wiki/Gonzalo_Frasca)** (Frasca, 2003) is a response
to the September 11 attacks. You can fire missiles at terrorists in a crowded town, but the
missiles kill civilians, mourners become new terrorists, and the more you shoot the worse it
gets. It makes the argument that a military response breeds more terrorism, and it makes it
better than any op-ed could. Frasca is credited with coining the word *newsgame* for games like
it, and it won a Knight Foundation award in 2009.
- **Madrid** (Frasca, 2004), about the Madrid train bombings.
- **The Howard Dean for Iowa Game** (Bogost and Frasca, 2003), made for Dean's presidential
primary campaign. Bogost later said its rules expressed the "procedural rhetoric of politics," in
which "one amasses supporters in support of nothing more than support."
- **Bogost's studio, Persuasive Games**, made games about politics, health and airports, including
*Fatworld* (2007) and *Jetset* (2006). His *Cow Clicker* (2010) satirized Facebook games by
reducing them to their rules: click a cow, wait six hours, pay to skip the wait. It became a
hit with exactly the players it mocked.

They also read other people's games for their arguments:

- **America's Army**, the US Army's recruiting shooter, "serves as a convincing procedural rhetoric
for the chain of command": you accept your missions and do not question them.
- **Animal Crossing** puts rare items behind late-night play, so children negotiate with parents
("do your chores and I will let you stay up to get it"), and the game's rules reach out into the household.
- **Frasca's four levels of ideology** in a simulation start with representation: "a simple
switching of character skins could turn Quake into a deathmatch between Israelis and
Palestinians ... the rules of the game remain unchanged ... However, on an ideological level,
this game completely differs from the original." Then come the rules of what you can do, the
rules of what counts as winning, and the meta-rules: who gets to change the game, by modding,
editing, and source access.

The theory has serious critics, and they're worth reading too. Treanor and Mateas point out that
designers often don't think about the rhetoric their systems carry; Frasca's own *Madrid* makes
you click frantically, which works against the empathy it was built for. Miguel Sicart's
"Against Procedurality" argues that players change systems in ways the author never planned. Both
critiques make the same practical point as the theory itself: you are responsible for what your
rules say, including what they say by accident.

## How the theorists framed The Sims

When Frasca needed an example of a rule making an argument, he chose The Sims and its same-sex
relationships:

> [T]he way that The Sims's designers dealt with gay couples was not just through representation
> (for example, by allowing players to put gay banners on their yards), they also decided to build
> a rule about it. In this game, same-gender relationships are possible. ... By incorporating this
> rule, the designers are showing tolerance towards this sexual option.

— Gonzalo Frasca, "Simulation versus Narrative" (2003), quoted on [Wikipedia](https://en.wikipedia.org/wiki/Procedural_rhetoric#Education)

Bogost described his theory as "an unholy blend of Will Wright and Aristotle." SimCity (1989) was a software toy with no
win state and no enemies, whose model of land value, traffic, pollution and taxes was itself a set
of claims about how cities work. The Sims (2000) put the same kind of model inside a household.

## The rule, from the inside

Frasca's example is right, but the story of how the rule got there is the part that matters for
anybody building a game today. It got there because somebody read the code as an argument nine
years before the term existed.

**No design document ever said "no same-sex relationships."** It existed only as behavior in the
early prototype. When I had one woman try to kiss another, the other woman slapped her. Nobody had
written that down and nobody had decided it. I read the SimAntics code to confirm the rule was
really there, and in my review of Design Document Draft 3 (August 7, 1998) I wrote:

> The whole relationship design and implementation (I've looked at the tree code) is Heterosexist
> and Monosexist. We are going to be expected to do better than that after the SimCopter fiasco
> and the lip service that Maxis publically gave in response about not being anti-gay. The code
> tests to see if the sex of the people trying to romantically interact is the same, and if so,
> the result is a somewhat violent negative interaction, clearly homophobic. [...] It would be
> much more realistic to model it by two numbers from 0 to 100 for each person, which was the
> likelyhood of that person being interested in a romantic interaction with each sex. [...] and
> anyone offended by that needs to grow up and get a life, and hopefully our game will help them
> in that quest.

"And hopefully our game will help them in that quest." The 2026 analysis of the comments on
*Did The Sims make you gay?* [below](#the-proof-did-the-sims-make-you-gay) measures the impact
of that hope 27 years later.

Draft 5 (August 31, 1998) answered: "Currently the game only allows heterosexual romance. This
will not be the only type available ... Will is reviewing the code and will make recommendations
for how to implement homosexual romance as well." Patrick J. Barrett III implemented it. At E3 in
1999, two female Sims kissed autonomously during the live demo, and The Sims shipped in 2000 with
same-sex relationships working by the same rules as every other relationship.

That slap is the lesson. **Nobody intended it, and it was still an argument**, one that I
recognized because I'd been on the receiving end of it in life. The scanned, annotated documents
are public at [donhopkins.com/home/TheSims/](https://donhopkins.com/home/TheSims/).

- [How same-sex relationships really got into The Sims: the record](../patrick-j-barrett-iii/same-sex-relationships-the-record.md),
myth versus primary sources.
- [Reading the prototype's rhetoric, nine years before it had a name](sources/qgcon-inclusivity-paper/reading-the-prototype.md),
my own account, including the theory I actually had at the time, which was about suicide:
a place where a kid could play a life nobody would let them have, without the game raising an
eyebrow.

## The proof: "Did The Sims make you gay?"

A theory of persuasion is only as good as its evidence that people were persuaded. For The Sims,
the evidence exists, it's large, and it's in the players' own words.

In January 2023 Alexander Avila published a video essay,
**[Did The Sims make you gay?](https://www.youtube.com/watch?v=Xi-HWyh0Ybk)** It walks through
how The Sims handled queerness, with Butler on performativity, Althusser on ideology, and Lacan's
mirror stage, and it asks whether a game's rules can shape who players discover themselves to be.
It drew more than 1,712 comments, and I analyzed all of them into fourteen themes:
**[the full comment analysis](https://github.com/SimHacker/moollm/blob/main/designs/sims/sims-queer-identity-formation.md#community-response-comment-analysis)**.

| What commenters described | Share of comments, estimated |
|---|---|
| Recognizing, looking back, that The Sims was where they realized they were queer | 35% |
| Hiding queer play from their parents | 15% |
| Exploring gender through Create-a-Sim | 10% |
| Valuing a world where romance carried no labels and no homophobia | 10% |
| The Sims as their first queer media of any kind | 8% |
| "It didn't make me gay": straight players, or players who already knew | 5% |
| Too busy building to romance anybody | 5% |
| Disliking the 2022 fixed-orientation update | 5% |
| Asexual and aromantic players valuing that romance was optional | 3% |
| About the video itself | 4% |

The most-liked comment, 9,700 likes:

> I used to make wlw families in my Sims 2 games and make their homes lower than the ground level
> bc I thought it'd hide them from my parents

The moment a rule lands, 3,600 likes:

> ... at the time I was so unfamiliar with gay content in any of the media I consumed I remember
> being absolutely astonished that the game would let them do that at all. Not in the angry
> reactionary way but in the 'holy shit... they can just DO that????? and it's FINE???????!!!!!'
> kind of way.

Ephemeral queerness, 4,400 likes:

> Making my sim flirt with/date/kiss a female sim every day before quitting without saving so my
> parents wouldn't find it and so it didn't count is one of my gayest experiences.

Discovery through play, before any words for it:

> When I came out to my sister, the very first thing she said to me was '……. Is that why all your
> Sims were gay?'

> I used to spend all my time making trans men in the sims and it still took me 22 years to figure
> out I was trans

The counter-testimonies matter too, and they point the same way:

> No, I was gay before I played the sims. The Sims just gave me an outlet.

Read the whole analysis. The pattern is consistent across hundreds of people who never met each
other: they made queer Sims before they had words for themselves, they hid those households from
their families, and they remember the exact moment they found out the game would let them. The
1998 design intent was a non-judgmental place where same-sex relationships are simply normal.
Twenty-five years later, the players reported in their own words that it worked.

**This is what procedural rhetoric looks like when it succeeds.** Not a message, not a cutscene,
not a rainbow banner on a lawn. A rule that didn't check gender, in a game played by millions
of kids, many of them in homes where nothing else told them they were normal.

- [Did The Sims Make You Gay? (show)](../../repo-shows/did-the-sims-make-you-gay/README.md),
with Patrick Barrett's engine-room story alongside the testimonies.
- [I'm Queer Therefore I Sim](../../repo-shows/im-queer-therefore-i-sim/README.md)

## The Sims refuted GamerGate fourteen years before GamerGate

GamerGate in 2014 rested on claims that sounded empirical: women don't really play games;
inclusive design kills games commercially; inclusion is activists injecting ideology into neutral
games. The Sims had refuted all of them, in shipping product, since 2000.

It was the best-selling PC game of its time, with a majority-female audience and development teams
that were anything but a boys' club. Its inclusive rules weren't added late under outside
pressure: they were written in the design phase in 1998, and the game was a commercial success.
And if ideology in games were really the issue, the most deliberately ideological, most played,
most profitable game in the industry would have been ground zero. GamerGate left it alone, because
it disproved the premise.

As I wrote on [Hacker News](https://news.ycombinator.com/item?id=38396604) in 2023:

> The Sims is one of the top selling and most profitable game franchises of all time, the original
> and current teams were anything but a boys club, and it had and has a lot of women and LGBTQ+
> developers and artists working on it and players playing it. And it was around and successful
> long before your precious Gamergate.

### "Actually, it's about ethics in games journalism"

No, it wasn't, and the record shows that from the first day to the last. Every fact below is from
[Wikipedia's Gamergate article](https://en.wikipedia.org/wiki/Gamergate) and the sources it cites.

**It started as an ex-boyfriend's revenge post, and the ethics charge in it was false.** In August
2014 Eron Gjoni published "The Zoe Post", a long account of his breakup with the developer Zoë
Quinn, with their private chat logs, emails and texts. It implied that Quinn got a favorable
review of *Depression Quest* by sleeping with Kotaku reporter Nathan Grayson. **Grayson never
reviewed any of Quinn's games.** His only Kotaku article that mentioned them was published before
their relationship began. Gjoni himself later said he had "no evidence" of a conflict of interest.
The founding ethics scandal never happened.

**The people who started it said in their own chat logs what it was for.** Ars Technica read the
logs of the 4chan users who pushed the hashtag into the spotlight and reported that the goal was to
"perpetuate misogynistic attacks by wrapping them in a debate about ethics." The ethics framing
was the wrapper, chosen on purpose, and the same logs suggest sockpuppet Twitter accounts were
used to spread the hashtag.

**The targets were women, not journalists.** Quinn's record of threats grew a thousand-fold in less
than four months. Anita Sarkeesian, a critic, not a journalist, received rape and death threats,
and canceled a talk at Utah State University in October 2014 after a threat promised a "Montreal
Massacre style attack" on the attendees and the nearby Women's Center. Brianna Wu, a developer,
not a journalist, had her home address posted on 8chan and fled her home after rape and death
threats. Sarkeesian asked the obvious question: "if this 'movement' was about journalism, why
wasn't it journalists who had to deal with a barrage of rape and death threats?"

**When people measured it, it wasn't about journalists.** Newsweek analyzed Gamergate tweets and
found that "contrary to its stated goal, Gamergate spends more time tweeting negatively at game
developers than at game journalists." An academic analysis of a week of #Gamergate posts found
they were not "only or even primarily" concerned with ethics in games journalism.

**It ignored every real ethics problem in the industry.** As the developer David Hill pointed out,
the game industry really does have corruption, nepotism and excessive commercialism, and
GamerGate addressed none of it. It went after poor independent developers and critics, nearly all of them
women, instead of the giant publishers whose games its members bought. Every ethics question it
raised, as Vox put it, "has either been debunked or dealt with." The Columbia Journalism Review
concluded that "at core, the movement is a classic culture war."

And then there's The Sims. If GamerGate had been about ideology sneaking into games, the
best-selling PC game, with same-sex relationships written into its rules since 1998 by people who
said so in their design documents, would have been its first target. It never came up, because
The Sims disproved everything GamerGate claimed about who plays games and what sells. A campaign
about ethics would have dealt with that evidence. A harassment campaign looking for women to
attack just ignored it.

What refuted GamerGate wasn't a press release. It was the procedural rhetoric: a rule that let
everybody play, and the players who showed up because of it.

- [OG Cozy Games: The Sims, Soul City, Micropolis, and the cozy lineage Gamergate quietly avoided](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/og-cozy-games.md),
claim by claim, with sources.
- [My HN record on GamerGate](sources/hn-gamergate-sims-thesis.md)

## Objects that argue

After The Sims shipped, I kept making arguments in its rules, still without the vocabulary:

- **The SimProv Wedding Playset** (circa 2002) has a marriage contract that binds two Sims and
doesn't check gender. At the time, same-sex marriage wasn't legal in any US state.
- **The Dumbold Voting Machine** (2004) is a Sims voting machine full of real e-voting failure
modes and easter eggs you can exploit. It argues that election software must be open and
inspectable by letting you hack it yourself.
[The illustrated article](../will-wright/sources/2018-04-24-dumbold-voting-machine/medium-article.md).
- **The tombstone generator** let anyone put a memorial for a real person into the game, with a
photograph and an epitaph, for free, with no moderator.
- **SimShow, Transmogrifier, and RugOMatic** are tools, Frasca's meta-rule level: they argue that the shipped
game is a starting point that players can rewrite.

The whole chapter: [Objects that argue](sources/qgcon-inclusivity-paper/objects-that-argue.md).

## If you make games

Your rules are making an argument right now. If you don't know what it is, it's probably the
default argument of your genre, and the players who notice it will be the ones it hurts. The
prototype slap in The Sims wasn't malicious. It was the default, and it took somebody reading the
code as an argument to change it.

So read your own game's rules as an argument. Ask what they reward, what they make permanent, what
they leave out, who gets to change them, and who owns the save files and plugins. Then decide what 
you want them to say, and make them say it on purpose.

"I don't want to be political" is not an option, because every game has rules, and every rule
takes a position on something: who can love whom, who gets to win, what violence costs, what
lasts and what gets rebuilt. A game that avoids taking sides hasn't left politics out. It has
handed the decision to whatever defaults it inherited, which in the 1998 prototype of The Sims
meant a slap. Not deciding is a decision, made by nobody.

"I don't want to lose half my audience" assumes half your audience shares the worst opinion you're
afraid to contradict, which is an insult to them, and cowardly of you. The Sims made its position 
on same-sex relationships a rule of the world in 2000, years before any US state allowed same-sex
marriage, and it didn't lose half its audience. It became the best-selling PC game of its time, 
and players who had nowhere else to go found a home in it. If taking a position costs you the 
players who can't stand anybody else being included, that's not a loss. That's your game working.

## Read more

- [Procedural rhetoric](https://en.wikipedia.org/wiki/Procedural_rhetoric),
[Ian Bogost](https://en.wikipedia.org/wiki/Ian_Bogost),
[Gonzalo Frasca](https://en.wikipedia.org/wiki/Gonzalo_Frasca) on Wikipedia
- Ian Bogost, *[Persuasive Games](https://mitpress.mit.edu/9780262026147/persuasive-games/)*
(MIT Press, 2007) and ["The Rhetoric of Video Games"](https://se4n.org/papers/bogost-rhetoric.pdf)
(*The Ecology of Games*, 2008)
- Gonzalo Frasca, "Simulation versus Narrative: Introduction to Ludology" (2003)
- [Bogost citation page](../ian-bogost/sources/procedural-rhetoric-quote.md)
- *How Inclusivity Saved The Sims*, the QGCon paper this essay draws on:
[index](sources/qgcon-inclusivity-paper/README.md) ·
[theory](sources/qgcon-inclusivity-paper/procedural-rhetoric-theory.md) ·
[Soul City and Soul Saver](sources/qgcon-inclusivity-paper/soul-city-soul-saver-thesis.md)
