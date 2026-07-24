# Maid plunger incident — Don Hopkins HN primary source

Don's first-person account on Hacker News, Feb 16 2022. Parent thread: **Don't use text pixelation to
redact sensitive information** ([30350626](https://news.ycombinator.com/item?id=30350626), Bishop
Fox). Don's comment: [30359560](https://news.ycombinator.com/item?id=30359560).

**Integrated spine:** [`../maid-plunger-incident.yml`](../maid-plunger-incident.yml) · **Story card:**
[`../artifacts/maid-plunger-unnecessary-censorship.md`](../artifacts/maid-plunger-unnecessary-censorship.md)

## Full comment (verbatim)

> When I implemented the pixelation censorship effect in The Sims 1, I actually injected some random
> noise every frame, so it made the pixels shimmer, even when time was paused. That helped make it
> less obvious that it wasn't actually censoring penises, boobs, vaginas, and assholes, because the
> Sims were actually more like smooth Barbie dolls or GI-Joes with no actual naughty bits to censor,
> and the players knowing that would have embarrassed the poor Sims. The pixelized naughty bits
> censorship effect was more intended to cover up the humiliating fact that The Sims were not
> anatomically correct, for the benefit of The Sims own feelings and modesty, by implying that they
> were "fully functional" and had something to hide, not to prevent actual players from being
> shocked and offended and having heart attacks by being exposed to racy obscene visuals, because
> their actual junk that was censored was quite G-rated. (Or rather caste-rated.)
>
> But when we later developed The Sims Online based on the original The Sims 1 code, its use of pseudo
> random numbers initially caused the parallel simulations that were running in lockstep on the client
> and headless server to diverge (causing terribly subtle hard-to-track-down bugs), because the
> headless server wasn't rendering the randomized pixelization effect but the client was, so we had
> to fix the client to use a separate user interface pseudo random number generator that didn't have
> any effect on the simulation's deterministic pseudo random number generator.
>
> The Sims 1 Beta clip ♦ "Dana takes a shower, Michael seeks relief" ♦ March 1999:
> https://www.youtube.com/watch?v=ma5SYacJ7pQ
> (You can see the shimmering while Michael holds still while taking a dump. This is an early
> pre-release so he doesn't actually take his pants off, so he's really just sitting down on the
> toilet and pooping his pants. Thank God that's censored! I think we may have actually shipped with
> that "bug", since there was no separate texture or mesh for the pants to swap out, and they could
> only be fully nude or fully clothed, so that bug was too hard to fix, closed as "works as
> designed", and they just had to crap in their pants.)
>
> Will Wright on Sex at The Sims & Expansion Packs: https://www.youtube.com/watch?v=DVtduPX5e-8
>
> The other nasty bug involving pixelization that we did manage to fix before shipping, but that I
> unfortunately didn't save any video of, involved the maid NPC, who was originally programmed by a
> really brilliant summer intern, but had a few quirks: A Sim would need to go potty, and walk into
> the bathroom, pixelate their body, and sit down on the toilet, then proceed to have a nice
> leisurely bowel movement in their trousers. In the process, the toilet would suddenly become dirty
> and clogged, which attracted the maid into the bathroom (this was before "privacy" was
> implemented). She would then stroll over to toilet, whip out a plunger from "hammerspace" [1], and
> thrust it into the toilet between the pooping Sim's legs, and proceed to move it up and down
> vigorously by its wooden handle. The "Unnecessary Censorship" [2] strongly implied that the maid
> was performing a manual act of digital sex work. That little bug required quite a lot of SimAntics
> [3] programming to fix!

## Footnotes (from Don's comment)

| Ref | Link | Role in story |
|-----|------|---------------|
| [1] Hammerspace | https://tvtropes.org/pmwiki/pmwiki.php/Main/Hammerspace | Maid produces plunger from nowhere |
| [2] Unnecessary Censorship | https://www.youtube.com/watch?v=6axflEqZbWU | SNL sketch — pixel bar + motion = worse |
| [3] SimAntics | https://news.ycombinator.com/item?id=22987435 | Behavior-graph fix, not a render tweak |

## Related HN callbacks

| Item | Beat |
|------|------|
| [30360424](https://news.ycombinator.com/item?id=30360424) | Don's medium article index + Sims YouTube links from same thread |
| [48015146](https://news.ycombinator.com/item?id=48015146) | Gas City — Don's **Hot Coffee vs almost-Hot Potty** industry tangent |
| [46227422](https://news.ycombinator.com/item?id=46227422) | Vibe coding thread — Sims potty lore as entry for non-game-dev readers |

## Asset note

Prototype plunger mesh exists in Sims 1998 content: `xskin-suit-plunger.cmx` (MicropolisCore vitamoo
archive) — candidate flipbook / reconstruction reference.

## Show credit

Homage format: Jimmy Kimmel **Unnecessary Censorship** — see
[`DonHopkins/projects/willwrightshowforfood/strategy/RULES-AND-ETHICS.md`](https://github.com/SimHacker/DonHopkins/blob/main/projects/willwrightshowforfood/strategy/RULES-AND-ETHICS.md)
(homages credit originator by name).
