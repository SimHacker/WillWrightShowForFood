---
status: draft
character_id: gwern
public: true
consent: not_yet_asked
show_seed: repo-shows/gwern/
format: written_or_audio_no_camera
paired_guest: said-achmiz
---

# Repo Show invitation — Gwern Branwen

*Draft — not yet sent. Sent in parallel with, and independently of,
[Said Achmiz's](../said-achmiz/invitation.md).*

*[Portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md) — correct, expand, replace, or remove your directory anytime, or take direct edit access. Written answers, audio-only, or altered voice are first-class formats here, not accommodations; no camera, ever. We portray the published work under the published name and do not research or discuss identity.*

Gwern —

Your Xanadu essay gave me a jolt: you cite my old Scripting News comments on the machine-generated
Xanadu C++ release, including the 1999 question **"Has Xanadu been used to document its own source
code?"** Being used as a primary source by someone building the best working argument for hypertext
currently on the web is a strange and good feeling.

I developed pie menus at UMD with Mark Weiser, and was on the HCIL **HyperTIES** team with   
Ben Shneiderman — embedded menus, link previews, and interactive PostScript applets,   
five years before the web — and did **NeWS**, **pie menus**, **TNT OPEN LOOK**, **HyperLook**, **SimCity**, 
**The Sims**, and **StoryMaker**. For the last stretch I have been building a publishing system 
that turns out to converge hard with gwern.net, and I wrote the design pack **before** writing 
this letter. The ask is to come argue with it.

**The ask:** join me for a **Repo Show** — a friendly recorded conversation whose stage is a public
GitHub repo, carried through to working code anyone can browse without an account. **Show, don't
tell.** [Will Wright](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md)
is signed on for the premiere.

## On credit, before anything else

I originally called this my "WebTop reaction to Gwern." After reading the source and its history that
was plainly incomplete, so everything now says:

> Inspired by the publishing and hypertext system developed by **Gwern Branwen** and **Said Achmiz**
> at gwern.net.

I am following **your** word — "tech co-creator" — rather than my earlier "frontend by," and I am
deliberately **not** guessing which of you thought of what, because the record does not support that
division. He has [a directory and an invitation of his own](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/said-achmiz/),
written to the interface work and sent independently, so that neither of you is an appendage to the
other. Receipts, including a GreaterWrong misattribution I had to correct in my own first draft:
`[said-achmiz/sources/gwern-net-credits.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/said-achmiz/sources/gwern-net-credits.md)`.

If any of that is still wrong, tell me and I will fix it.

## What is here that you do not already have

The hub is large and nobody should read it in file order, so its route for you **begins by naming what
is new**, and says explicitly that everything else is skippable. Your attention is the scarce resource
in this exchange and I have tried to treat it that way.

**[The "If you are Gwern" route](https://github.com/SimHacker/moollm/tree/main/designs/webtop#if-you-are-gwern)**

1. **Unpublished HyperTIES primary sources.** The mandatory 1988 article schema — title, **synonyms**,
  description, body — with build scripts proving the definition was a separate compilation unit. That
   is your semantic-zoom ladder shipped as a required schema thirty-eight years ago, by people who had
   to make it work on a 1988 machine. Plus the UniPress Emacs MockLisp authoring tool, and who wrote
    which implementation on which platform.
2. **Your architecture, shipped in 1992, editable from inside — plus Alan Kay's verdict on it.**
   HyperLook was a statically publishable corpus with a dynamically composed chrome layer, which is
   your shape. The difference is that you could flip a **running** program into edit mode, point at a
   widget, and read the script behind it. I ported SimCity to it and shipped it that way — as a
   sealed runtime, because live editability and publishable stability really are in tension, and you
   have chosen the same side of that trade I did. Kay's line on the whole affair is the one I would
   most like your reaction to: HyperCard *"deserved to be successful. And Apple blew it by not making
   the design framework the basis of a web browser."* He also handed my own group a criticism I think
   is correct — that we missed what HyperTalk's design meant for personal computing — and I have
   written that down rather than the praise:
   [`HYPERLOOK.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop/HYPERLOOK.md) and
   [`kay/`](https://github.com/SimHacker/moollm/tree/main/designs/webtop/kay).
3. **A build-time answer to the author-burden problem you raised.** Your Xanadu essay concludes that
  LLMs may finally absorb the authoring burden that kept hierarchical hypertext and semantic zoom
   impractical. My version runs the model **at build time** and ships a static artifact that needs no
   model to read — with four proof of concepts rather than a proposal, and an honest failure mode: a
   synonym collision resolves silently to a plausible wrong node, so it has to be a build-time lint
   with a distinctness filter.
4. **Two concrete disagreements, not compliments.** The semantic pyramid needs a rung *below* the link
  icon. And your site already keeps durable per-reader state in LocalStorage — and spends it on
   whether to animate a toolbar. Dark mode persists; the reader's place in the argument does not.



## The idea I would most like you to attack

**"Give the reader agency," taken literally.** Not an article that gets a room — an article that
**is** one. Characters in it who can be asked questions in context, so the corpus accumulates its own
FAQ as an artifact. Reading positions as first-class, shareable, forkable objects. Reading lists you
can remix, check off, annotate, argue with, and beat people over the head with.

One smaller thing that falls out of it, in case it is useful: an annotation should be **signed** —
somebody's assessment of a specific span, dated, with its evidence attached, free to sit next to a
conflicting one — rather than universal metadata on a node. Your per-page confidence tag is already
the best existing corpus of exactly that. It just does not say *whose* it is, and it is not
something a reader can turn.

The honest version of the thesis: **neutrality is impossible, so contestability is the obligation.**
Density is not the problem — sometimes the territory really is that large and the reader needs a
vehicle. What matters is whether the vehicle gives claims individually addressable handles, separates
evidence from inference, puts counterevidence where it will actually be met, lets the reader pick depth
and route, and permits annotation and forking. Your site does all of that, which is why it is the thing
worth inheriting from. The residual risk is only that good plumbing can manufacture authority by
itself, independent of what flows through it.

I have written down my own strongest objections so you do not have to reconstruct them:
`[OBJECTIONS.md](https://github.com/SimHacker/moollm/blob/main/designs/webtop/OBJECTIONS.md)`, which
takes Borretti's *Unbundling Tools for Thought* — which you endorsed — and turns it on this work.
**Read that first if you only read one thing.**

## Pick your shape

- **Solo.** The corpus as environment: semantic zoom, revision as method, annotation and local archives
against linkrot, and the design-graveyard discipline of publishing what you *rejected* — rarer and
more useful than any changelog.
- **Joint with Said.** The two-lineage popup story with both of you. Only if you both want it; the
invitations are deliberately separate.
- **Written only.** An exchange in the repo — issues, PRs, review comments — published as the episode.
Zero call required.
- **Panel.** [Ben Shneiderman](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/ben-shneiderman)
on HyperTIES, [Ted Nelson](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/ted-nelson)
on the transclusion you partially shipped while Xanadu argued,
[David Temkin](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/david-temkin)
on in-browser window management as a language problem.
- **Panel, the other half of it.**
[Will Wright](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/will-wright)
reads the way you do and publishes the opposite artifact: the same appetite for a research pile,
turned into something playable instead of something citable. He is also a user interface designer,
and the Sims object model — every object carrying its own code and advertising its own affordances to
whoever walks past — is the article-as-room thesis already shipped, at mass-market scale.
[Ian Bogost](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/ian-bogost)
on **procedural rhetoric**: rules and processes make arguments of their own, which means your
navigation design is already a rhetorical act and not merely an affordance — and that a reader given
a route is being argued with in a channel prose cannot reach. He is a literary critic as well as a
game designer, and of everyone listed he is the most likely to attack the entire premise. That is the
reason to have him.

**Zero homework — as much *homefun* as you are up to.**

## Your links

- **Your room:** [https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/gwern/](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/gwern/)
- **Conversation hooks:** [https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/gwern/ideas.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/gwern/ideas.md)
- **The hub, your route:** [https://github.com/SimHacker/moollm/tree/main/designs/webtop#if-you-are-gwern](https://github.com/SimHacker/moollm/tree/main/designs/webtop#if-you-are-gwern)
- **The case against all of it:** [https://github.com/SimHacker/moollm/blob/main/designs/webtop/OBJECTIONS.md](https://github.com/SimHacker/moollm/blob/main/designs/webtop/OBJECTIONS.md)
- **Source-level inheritance study:** [https://github.com/SimHacker/moollm/tree/main/designs/webtop-gwern-inheritance](https://github.com/SimHacker/moollm/tree/main/designs/webtop-gwern-inheritance)
- **Premiere (Will Wright):** [https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md)
- **Also invited, separately:** [https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/said-achmiz/](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/said-achmiz/)

In many ways it feels as though we have been working on different layers of the same unfinished system
for decades. You made hypertext into an exceptionally good reading instrument. I am trying to make a
corpus into a place you can inhabit, manipulate, program, and travel through. First I would simply love
to compare notes.

**Next step:** if this sounds fun, reply with a rough week, or "later," or nothing. Interested,
delayed, declined, and no reply are all honored.

— Don Hopkins *(User Interface Flower Child)*

*P.S. The repo is in quiet mode while invitations go out — please don't share links publicly just
yet.*