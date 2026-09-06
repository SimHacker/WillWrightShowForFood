# What the public record says about who built gwern.net

*Receipts for the credit line used in this directory and in
[`../gwern/`](../../gwern/README.md). Assembled 2026-09-06 by checking the site and the GitHub API
directly, because the question "who did what" is exactly the one it would be rude to guess at.*

[Portrayal standards](../../../schemas/portrayal-standards.md)

## The site's own credit line

From [gwern.net/design](https://gwern.net/design), verbatim:

> Much of Gwern.net design and JavaScript/CSS was developed by [Said
> Achmiz](https://wiki.obormot.net/), 2017–202?.

The open-ended end date is in the original. The credit links to
[wiki.obormot.net](https://wiki.obormot.net/), Said's own site — and gwern.net is additionally
mirrored at [gwern.obormot.net](https://gwern.obormot.net/), on that same domain.

Named components on the design page:

| Component | Credit as printed |
|---|---|
| Generalized tooltip popups | Said Achmiz, **Shawn Presser**; MIT |
| `sidenotes.js` | Said Achmiz, MIT |
| `image-focus.js` | Said Achmiz; GPL |

Shawn Presser is credited alongside Said on the popup system specifically, which is worth knowing
before attributing popups to one person.

## Gwern's own word for the relationship: "tech co-creator"

On Hacker News, replying in a thread about his site
([item 37627557](https://news.ycombinator.com/item?id=37627557)):

> (I am the website author & tech co-creator with Said Achmiz.)

That is a considerably stronger formulation than "frontend by," and it is the site author's own
phrasing rather than an outsider's inference. This directory follows it.

## Commit distribution, and what it does and does not show

Queried live from the GitHub API on 2026-09-06,
[`gwern/gwern.net`](https://github.com/gwern/gwern.net) contributors:

| Contributor | Commits |
|---|---|
| `gwern` | 6,523 |
| `achmizs` | 3,020 |
| `Said Achmiz` (second recorded identity) | 1,075 |
| four others, combined | 5 |
| **total** | **10,623** |

So Said's two identities together account for **4,095 of 10,623 commits**, about 39%.

**What this does not establish.** Commit counts measure activity, not authorship of ideas, and
comparing them would be a bad way to divide credit — commit granularity differs between people, a
build-script tweak and a new subsystem both count as one, and neither number says who proposed
anything. The honest conclusion is narrow and sufficient: **Said's involvement is structural and
sustained, not peripheral.** Which is all the credit line needs to assert.

## The collaboration is argumentative, and that is documented

Gwern describes losing and winning design arguments with Said in public, which is better evidence of
how the two of them work than any credit line. From the same HN thread:

> I'd like to increase the font a touch more, but Achmiz says that going a bit bigger is not doable
> due to fractional sizes and rounding; we'd have to go substantially larger, and that is too large
> for my tastes.

> This is an argument I've had with Achmiz several times. I feel that there's enough margin to work
> with at the current breakpoints that you could stuff sidenotes into them and show them to
> substantially more readers than we do now; he insists that no, there is not, when all is said &
> done, enough pixels left over to provide adequate, readable, appropriately-margined sidenotes and
> the breakpoint can't be lowered.

And on the typography, from [gwern.net/design](https://gwern.net/design), an argument that went the
other way:

> Said Achmiz convinced me to just switch to self-hosting the 'screen serif' Source family

Gwern also records the inflection the collaboration caused:

> When Said Achmiz lent his talents to adding features & enhancements and exploring novel tweaks,
> comments cropped up more frequently (consistent with the enormous increase in time spent on it);
> by 2019, the redesign had mostly stabilized and most of the signature features & visual design had
> been implemented

## GreaterWrong: a correction we had to make

**GreaterWrong is not Said's project alone, and describing him as its creator is wrong.** The
[launch announcement](https://www.greaterwrong.com/posts/66DXhQJyPEJNsXgfw/an-alternative-way-to-browse-lesswrong-2-0)
is by **`clone of saturn`**, and ends:

> Thanks to Said Achmiz for designing the themes and writing much of the frontend JavaScript.

Said then authored the subsequent feature announcements himself — 27 March 2018, 7 April 2018,
28 May 2018, and 1 October 2018 — covering appearance customization, the theme tweaker, accesskeys
for keyboard navigation, adjustable text size, pagination, mobile layout, and a ninth theme.

We had this wrong in a first draft, which called him "the creator or principal developer." Recorded
here because getting it wrong once is the reason the rest of this file was checked by hand.

↑ [said-achmiz](../README.md) · [gwern](../../gwern/README.md)
