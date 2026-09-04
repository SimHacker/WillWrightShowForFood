# The Sims Online — stories to tell

*Don's firsthand TSO stories, sourced to his own public Hacker News posts. Told on HN in
**2016**, re-told in **2020** as a fencepost-error story and again in **2021**. Public by his own
hand, so quotable on air.*

Companion: [`../building-the-sims/team-stories.md`](../building-the-sims/team-stories.md) ·
[Portrayal standards](../../schemas/portrayal-standards.md)

## The housemate who put her tip jar at the end of the row

**The story in one line:** a delivery bot that filled *the next tip jar in the row* met a
bystander who added one more post to the fence.

Don's telling ([HN 11730181](https://news.ycombinator.com/item?id=11730181), 19 May 2016):

> One time when we were making a big delivery of cash, running the gauntlet of tip jars in our
> customer's living room (which I admit looked pretty fishy), and their housemate came home, saw
> what was happening, and wisely sussed up the situation that there was some kind of deal going
> down, that she wanted in on.
>
> So she put her own tip jar down at the end of her housemate's row of tip jars, and I blithely
> deposited $5000 into her tip jar several times, which she immediately snapped up.
>
> When I realized what happened, instead of contracting The Sims Mafia to do a hit on her, I
> congratulated her for her loose morals and ingenuity. It was such a great hack, and I totally
> fell for it, and had more Simoleons than I knew what to do with anyway. It's all about good
> customer service!

**Don's own framing, four years later** — he filed it under
[off-by-one error](https://en.wikipedia.org/wiki/Off-by-one_error):

> It's of a very different nature, but that reminds me of another "off by one" fencepost error
> exploit I encountered in the wild of The Sims Online.
> — [HN 22776515](https://news.ycombinator.com/item?id=22776515), 4 Apr 2020

That is the joke worth landing on air: **a fencepost error committed in furniture.** The loop
had no notion of *whose* jar was next, only that a next jar existed, so extending the row
extended the loop. Same bug class as `for (i = 0; i <= n; i++)`, except the attacker adds an
array element by walking into the living room and setting it down.

### Why the setup existed at all

The story only works because TSO's money transfer was deliberately rate-limited and physical:

| Constraint | Consequence |
|---|---|
| No in-game wire transfer | You had to **show up on the customer's lot at an agreed real-world time** |
| Hand-to-hand capped at $1,000 | A million Simoleons meant 1,000 handoffs |
| Tip jar holds $5,000, filled and emptied by pie menu | A million becomes **200 hand→jar→hand transfers** |

So the optimization was to line up jars and run the row — customer emptying behind him as the
bot filled ahead, then back to the start. Don's summary: *"200 $5000 hand=>jar=>hand transactions
instead of 1000 $1000 hand=>hand transactions."*

**The reusable insight:** production was automated and effectively free; *delivery* was the
entire cost. A capped transfer primitive converts a solved supply problem into a logistics
problem — the same shape as moving marriage licenses between lots in the
[life events playset](../../designs/orchestrator-playsets/life-events-playset.md).

The 2006 email names the ratio that makes the story land:

> …to generate more than $2,000,000 simoleans an hour. My friend and I made a little more than
> a real grand selling Simoleans on eBay…

Industrial virtual output, pizza-money real revenue. Delivery still took longer than
manufacturing. Then other people shipped their own bots, players found duping exploits, and
the market collapsed.

### The customers

Not sympathetic, and that's what makes it playable:

> The problem was that many of the customers were pouty temperamental 15-year-olds using their
> parent's eBay accounts, who would give scathing eBay reviews if their order wasn't delivered
> instantly, or they suffered some imagined slight.

A reputation system where the seller is hostage to teenagers with their parents' credentials —
which is exactly the territory of the two references Don attaches to the Sims Mafia:

- Bruce Schneier, [Virtual Mafia in Online Worlds](https://www.schneier.com/blog/archives/2009/11/virtual_mafia.html) (Nov 2009)
- Randy Farmer and Bryce Glass, *Building Web Reputation Systems* — [The Dollhouse Mafia, or "Don't Display Negative Karma"](http://buildingreputation.com/writings/2009/10/the_dollhouse_mafia.html)

The Dollhouse Mafia is the canonical TSO reputation-design story, and Randy Farmer is a bookable
guest. Pairing Don's delivery-side anecdote with Farmer's design-side account of why negative
karma had to be hidden is a whole segment.

## Why the maze game was automatable — asymmetric information, mechanized

The money game Don farmed was a **two-player asymmetric maze**:

> One player is lost in the maze and can see the local walls around them, and the other player
> can see an overall map of the maze without the player's position, and has to guide them around
> and figure out where they are and how to guide them out by asking them what they see and
> telling them which direction to move.

The reward was large *because it was laborious for two humans* — the design taxed coordination
and conversation, which was the entire point of TSO's "ham-fisted money making multi player
games that forced players to interact with each other." Don ran both sides:

> I would run two TSO clients at the same time, logged into different accounts in different
> windows. The bot attached to both of them, then screen scraped pixels and injected events to
> repeatedly solve mazes by moving the player around until it identified where they were, solving
> for the shortest path, and bringing them straight home quickly by machine-gun clicking on the
> arrow buttons.

**The design lesson, and it's a real question for Luc:** a mechanic whose difficulty is *social
coordination* pays out for solving a problem a single program finds trivial. Localization plus
shortest path is a homework assignment; getting two teenagers to describe walls to each other is
genuinely hard. The reward was priced against the human cost.

And the detail that makes it a story rather than a lecture:

> Plus it made cool bleeping and kaching sounds as it solved the mazes and printed money!

## The redemption arc — the bot got a real job

The same screen-scraper became **Simplifier**, which is the part that connects to live work:

> So the unemployed Sims bot wouldn't feel bored, I retrained it into a more practical assistive
> utility called "Simplifier", which knew how to recognize and navigate the Sims user interface
> to show, scroll through, and enumerate all the many items, wallpapers, floor tiles, etc, in the
> catalog.

It snapshotted icons and read title, price, and description off the screen — *"it was all in a
bitmap Comic Sans font, so it was easy for a bot to recognize, if not for your eyes to read"* —
producing a searchable illustrated database of built-in and downloaded content. It solved a real
problem: players downloaded thousands of objects, or built their own with
**Transmogrifier** and **RugOMatic**, and The Sims interface gave them no way to search.

Manual mode read descriptions aloud through a speech synthesizer, *"useful for kids learning to
read, old farts with bad eyesight, and snobby designers who hate Comic Sans."*

Demo: [youtu.be/Imu1v3GecB8?t=3m15s](https://youtu.be/Imu1v3GecB8?t=3m15s)

**This is not just history.** Simplifier is the direct ancestor of the SoulAngel catalog
crawler — same job, same font problem, twenty years later with `Windows.Media.Ocr` instead of a
hand-rolled glyph matcher. See
[`CATALOG-SCREEN-MATCH.yml`](../../apps/soul-angel/windows/CATALOG-SCREEN-MATCH.yml), which
already carries Simplifier's glyph matcher as a named fallback path, and
[`SIMSKIT-LINEAGE.yml`](../../apps/soul-angel/windows/SIMSKIT-LINEAGE.yml).

The arc for the show: **the bot built to drain the game got repurposed to make the game
accessible**, and the accessibility tool is the one that survived to be reimplemented.

## How it ended

> It was a fun experiment, but other bots and offshore farmers were starting to work the system
> too, and customer service and delivery problems made it not worth continuing.

## More where that came from — leads

Told-once stories worth chasing down and adding here:

| Lead | Where to look |
|---|---|
| The TSO pixelation / censorship story | [`characters/don-hopkins/sims-pixelation-censorship-hn-2022.md`](../../characters/don-hopkins/sims-pixelation-censorship-hn-2022.md) |
| TSO pixelation RNG desync | [`../building-the-sims/artifacts/tso-pixelation-rng-desync.md`](../building-the-sims/artifacts/tso-pixelation-rng-desync.md) |
| Other TSO exploits in the wild | Don's HN comment history — search `author_DonHopkins` for `Sims Online` |

These anecdotes are public — told by Don under his own name on HN in 2016 and in the 2006
email. Tell the story. Don't market the technique.
