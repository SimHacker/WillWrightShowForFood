# Project Xanadu: Even More Hindsight (2025)

**Essay:** <https://gwern.net/xanadu>
**HN resurface:** <https://news.ycombinator.com/item?id=49559522> — posted by `andsoitis`, 4 Sep 2026

Gwern's post-mortem of Project Xanadu. It **quotes Don Hopkins twice, by name, in footnotes** — both
times from the 1999 UserLand thread ([`1999-userland-xanadu-thread.md`](1999-userland-xanadu-thread.md)).

## Citation 1 — on the 1999 source release

Footnote to a passage about the C++ codebase:

> I had a little trouble understanding the point of this, but apparently this really is what
> happened. This was presumably the same C++ codebase that was ultimately released as
> pseudo-open-source in August 1999. **Don Hopkins (who was very into early hypertext systems like
> NeWS and HyperTIES) says:** "They originally wrote Xanadu in Smalltalk, then implemented a
> Smalltalk to C++ compiler, and finally they released the machine generated output of that
> compiler, which was unreadable and practically useless. It completely missed the point and purpose
> of 'open source software'." and "Sheez. You don't actually believe anybody will be able to do
> anything useful with all that source code, do you? Take a look at the code. It's mostly
> uncommented glue gluing glue to glue. Nothing reusable there."

The "Sheez" quote is verbatim from msg010163 (27 Aug 1999). The Smalltalk-to-C++-compiler
formulation is from Don's later HN comments (Feb 2021, below).

## Citation 2 — the eat-your-own-dogfood charge

> Or as Hopkins charged in 1999: "Has Xanadu been used to document its own source code? How does it
> compare to, say, the browsable cross-referenced Mozilla source code? Or Knuth's classic Literate
> Programming work with TeX?"

Verbatim from msg010163 (original spelling: "browseable"). Gwern's surrounding argument is that
Xanadu never produced a demo or use-case you could put on paper — *"Where were the Xanadu demos and
use-cases laid out on paper with some scissors and glue, if need be?"*

## The passage that matters most to us

Not about Don at all. It is Gwern's alternative to Xanadu's UI, and it is the MOOLLM webtop thesis
stated in one sentence:

> I would say the flaw of Xanadu's UI was treating transclusion as 'horizontal' and side-by-side and
> assuming that all reading/writing must be done at the lowest raw level of text (motivating the
> 'tumblers' etc.), when it should have been **'vertical' with popups, and 'zooming in' and 'zooming
> out' at different levels of abstraction (link-icon → title → abstract → section etc.)** of the
> text (which motivates an entirely different set of concerns — being able to specify arbitrary
> ranges becomes much less important, especially as any key ranges can just be hoisted into a higher
> level).

And then the generalization:

> Once you have popups offering seamless navigation, you are in effect using transclusion
> everywhere — just inside the popups. And once you have gone all-in on the idea of offering
> abstracts for everything, it's natural to generalize it: if you have two versions of a URL, one
> 'small' (the abstract) and one 'large' (the whole URL), why not have a 'medium' as well?
>
> There is no natural stopping point here, so you can simply embrace a outliner-style hierarchical
> view of "semantic zoom".

**`link-icon → title → abstract → section` is the semantic pyramid.** Gwern's ladder bottoms out at a
link icon. Don's bottoms out one rung further: an emoji or SVG glyph small enough to be a **pie menu
slice**, a graph node, or a symbol on a high-level map.

## Footnote 174 — the ask

Attached to "there is no natural stopping point here":

> I think one of the reasons outliner approaches have not caught on for hypertext in general is that
> while useful, they wind up **foisting too much work on the author**. I am willing to do this work
> in part to explore website design, but the idea that many websites should be like English
> Wikipedia or Gwern.net is crazy. However, **LLMs open up many new design opportunities for
> automatically summarizing/expanding to build a full hierarchy while the human author writes just
> what is necessary**, which I think can resurrect many old 'tools for thought' ideas and finally
> make them usable.

Same thesis as the 2024 LessWrong Roam comment
([`2024-lesswrong-after-roam.md`](2024-lesswrong-after-roam.md)), two years later and applied to
hypertext structure rather than note-taking.

## Also in the essay

- **Design honesty:** the sidenote/outline experiment where "the lines were confusing clutter,
  especially as they crisscrossed" — a documented failure, kept in public.
- **Use-case-driven development:** "almost every feature was driven by a use-case I had (mostly
  because I am lazy); even with Said Achmiz, our approach has been to wait for several use-cases,
  and then implement it while enabling them all." Followed by the honest cost: as the site grew,
  "we discover edge-cases and have to revise the design, and for many changes, abandon them."
- **What he decided he did *not* need:** arbitrary-paragraph transclusion; atomic one-sentence pages
  nested in a table of contents longer than the contents ("like GNU Info encourages you to write").
- **Ancestry he credits:** Lupin's Wikipedia popups (~2005) — "but on steroids" — plus the
  observation that Gwern.net-style popups were technically possible in DHTML around 1997.

## HN thread, 4 Sep 2026

Nine comments at time of reading. Nothing from Don yet. Live threads worth answering:

- **`gritzko`** — "side-by-side diff view is a transclusion interface"; permalinks and cross-repo
  bidirectional links on top of git; CRDT merges as an incremental git upgrade. Adjacent to
  git-as-CMS and the repo-graph backlink index.
- **`kmeisthax`** — long argument that Xanadu is structurally an NLE: everything is a nondestructive
  transclusion off a permascroll, exactly like a film edit timeline off camera rushes. Blocked in
  practice by rights clearance, not technology.
- **`WillAdams`** — contrasts Xanadu's literature with hardware-era books that are candid about
  limits (*Soul of a New Machine*, *Revolution in the Valley*).

↑ [sources](README.md) · [`CHARACTER.yml`](../CHARACTER.yml)
