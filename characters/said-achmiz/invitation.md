---
status: draft
character_id: said-achmiz
public: true
consent: not_yet_asked
show_seed: repo-shows/said-achmiz/
format: written_or_audio_or_repo
paired_guest: gwern
---

# Repo Show invitation — Said Achmiz

*Draft — not yet sent. Sent in parallel with, and independently of,
[gwern's](../gwern/invitation.md).*

*[Portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md) — correct, expand, replace, or remove your directory anytime, or take direct edit access; also covers quiet mode and onboarding.*

Said —

I found your architecture by reading your code, and it was mine.

Pinning a popup on gwern.net sets a **flag on the same window object** — no rewrap, no reparent, no
second class of thing. In the late 80s I built **TNT OPEN LOOK** pin-up menus the same way: menu
frames subclass window frames, promotion is a flag. It is the opposite of the olwm/ICCCM rewrap dance
X11 forced on everyone with a separate-process window manager and no shared class hierarchy. Two
lineages, decades apart, no contact, same answer — because the same constraint bit both of us.

That is the conversation I would like to have, and it is not the same conversation I would have with
gwern. **You are invited in your own right**, for the interface work.

**The ask:** join me for a **Repo Show** — a friendly recorded conversation whose stage is a public
GitHub repo, carried through to working code anyone can browse without an account. **Show, don't
tell.** [Will Wright](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md)
is signed on for the premiere.

Written answers, audio-only, altered voice — all first-class here, never accommodations. **And for
you specifically: a written exchange conducted entirely in the repo — issues, PRs, review comments —
counts as a show and might be the better format.** No camera, ever.

## On credit, before anything else

I originally called this my "WebTop reaction to Gwern." After reading the source and its history
that was plainly incomplete, so everything now says:

> Inspired by the publishing and hypertext system developed by **Gwern Branwen** and **Said Achmiz**
> at gwern.net.

Not "frontend by" — gwern's own word is **"tech co-creator."** And I am deliberately **not** guessing
which of you thought of what, because the public record does not support that division and guessing
would be the one unforgivable move here. My receipts are in
[`sources/gwern-net-credits.md`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/said-achmiz/sources/gwern-net-credits.md),
including a GreaterWrong misattribution I had to correct in my own first draft. **If the credit is
still wrong, tell me and I will fix it.**

## What I think may be new to you

I have tried hard not to explain your own system back to you. There is a route in the hub written for
you specifically, and it starts by naming the three things I think you do not already have, so you can
leave early if that is not enough:

**[The "If you are Said" route](https://github.com/SimHacker/moollm/tree/main/designs/webtop#if-you-are-said-achmiz)**

1. **Two disagreements with the current design**, not compliments. Pinned popups die on page
   navigation — if pinning is promotion, promotion should outlive the document, on a persistent
   serialized desk. And desktop popups versus mobile popovers are two windowing engines where one
   adaptive window class would do. You may have tried both and rejected them; if so, **why** is the
   artifact I actually want.
2. **Unpublished HyperTIES primary sources** — the mandatory 1988 article schema, the build scripts,
   the MockLisp authoring tool, and who wrote which implementation on which platform. I was on the
   team. Embedded menus and link previews, five years before the web.
3. **A navigation invariant stated as a lint**: every structural operation reachable by keyboard, pie
   menu, **and** drag, all three dispatching one named command. Your accesskeys and the gwern.net
   chord table are two of the few existing systems that would pass it — which is why you are the right
   person to tell me the lint is wrong.

Everything else in the hub is context you can skip.

## Two more things I would rather hear you attack than praise

**Your theme tweaker is the prior art for something I am designing.** Reader-adjustable brightness,
contrast, saturation, hue and inversion over nine themes, on mobile too — that is a reader taking
authority over presentation the author chose. I want the same move on *epistemic* state: a knob that
re-renders a corpus from clean narrative, to certainty markers and attribution, to exposed assumptions
and provenance, to expanded counterevidence. You shipped the presentation-layer version years ago.
I would like to know what it cost you in practice, because I suspect I am underestimating it.

**The OPEN LOOK pin rotation.** The push-in / pull-out animation is the affordance — it is what
teaches a first-time user what promotion means without a word of documentation. I want it back. You
may well have a good reason it should stay gone.

## Pick your shape

- **Solo, on implementation.** Popups as a window manager, transclusion and stable back navigation,
  sidenotes and the breakpoint math, keyboard chords, cross-browser reality. Screen share and walk
  the code if you want, or don't.
- **Joint with gwern.** The two-lineage popup story with both of you in the room. Only if you both
  want it — the invitations are deliberately separate so neither depends on the other.
- **Repo-only.** Open issues on my design docs and let the argument be the show. I will publish the
  thread as the episode, edits and all.
- **Panel.** [Ben Shneiderman](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/ben-shneiderman)
  on HyperTIES previews, [Ted Nelson](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/ted-nelson)
  on transclusion, [David Temkin](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/david-temkin)
  on in-browser window management as a language problem.

**Zero homework — as much *homefun* as you are up to.** One call or many, edited together, your call.

## Your links

- **Your room:** https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/said-achmiz/
- **Conversation hooks:** https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/said-achmiz/ideas.md
- **The hub, your route:** https://github.com/SimHacker/moollm/tree/main/designs/webtop#if-you-are-said-achmiz
- **The strongest case against all of it:** https://github.com/SimHacker/moollm/blob/main/designs/webtop/OBJECTIONS.md
- **Source-level inheritance study:** https://github.com/SimHacker/moollm/tree/main/designs/webtop-gwern-inheritance
- **Premiere (Will Wright):** https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md
- **Also invited, separately:** https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/gwern/

I have pointed you at my own objections file first on purpose. I would rather you attacked the design
than reconstructed my awareness of its weaknesses from scratch — so I wrote them down.

**Next step:** if this sounds fun, reply with a rough week, or "later," or nothing. Interested,
delayed, declined, and no reply are all honored.

— Don Hopkins *(User Interface Flower Child)*

*P.S. The repo is in quiet mode while invitations go out — please don't share links publicly just
yet.*
