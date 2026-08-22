# Grig texts: the Open Intent Layer — and Don sends him Korz

**Date:** 2026-08-17 (text thread; screenshot:
[images/2026-08-17-open-intent-layer-text.png](images/2026-08-17-open-intent-layer-text.png))

## Grig's problem statement (verbatim)

> I am working on a problem for the Open Intent Layer: how can a global
> public pool of intent accept new structured data from anyone without
> breaking shared meaning?
>
> It should use exact matches when it can, then public mappings or
> semantic matches when different schemas mean close enough to the same
> thing. No central system decides the format. The mappings need to be
> open, traceable, and optional, so the most trusted ones can become
> defaults without becoming rules.
>
> If you get the basic idea, let me know what you think or you want
> more detail.

## Don's reply

Don pointed him at Korz — Dave Ungar (whom Grig would know from the
Laszlo orbit: Ungar interviewed at Laszlo in 2006) prototyped it in
Self, and there's a free copy of the paper on Bret Victor's site
(another Laszlo user — his t-shirt design app and interactive demos):

> Remember Dave Ungar at Laszlo, who also made Self? He just told me
> about another paper about an even more powerful language that he
> prototyped in Self (ha ha see what I did there ;)! Korz.
>
> There is a copy of his paper on Brett Victor's site (remember he also
> used OpenLaszlo, to make an awesome t-shirt design app, and some
> other cool interactive demos). So you know it must be cool! ;)
> [worrydream.com/refs/Ungar_2014…](https://worrydream.com/refs/Ungar_2014_-_Korz_Simple,_Symmetric,_Subjective,_Context-Oriented_Programming.pdf)

(Editorial: Korz is an *anagram* of Zork, not an acronym — the paper's
Appendix A derives the name from Korzybski. And Bret spells it with
one t. The thread also carried a Bakelite aside: the piece came from
the founder/curator of the Amsterdam Bakelite Collection.)

## Why the match is real

Grig's requirements map almost line-for-line onto Korz's stated open
problems and MOOLLM's working answers:

| Open Intent Layer requirement | Korz / MOOLLM counterpart |
|---|---|
| Accept new structured data from anyone without breaking shared meaning | Korz's open problem: **global dimension names** and **merging slot spaces** — new dimensions arrive without touching intermediate code |
| Exact matches when possible, semantic matches when "close enough" | The dispatch spectrum: decidable guards at the bottom, **judged relevance** (LLM semantic match) above — deterministic COP as the corner case |
| No central system decides the format | Korz: no dominant decomposition, no dimension outranks another; MOOLLM: Postel — accept liberally, emit conservatively |
| Mappings open, traceable, optional | MOOLLM: provenance on every merge; symbolic references, never embedded objects |
| Most trusted mappings become **defaults without becoming rules** | The advertisement economy's endgame verbatim: **ads that learn earn trust**; find-best-N keeps defaults overridable — a default that can't be declined is a rule |

That last row is the one to text back: "defaults without becoming
rules" is the exact design point of scored-but-dithered dispatch — a
trusted mapping wins most auctions but never owns the outcome.

## Links

- The Korz paper (shareable): [worrydream.com/refs/…Korz…](https://worrydream.com/refs/Ungar_2014_-_Korz_Simple,_Symmetric,_Subjective,_Context-Oriented_Programming.pdf) · [ACM](https://dl.acm.org/doi/10.1145/2661136.2661147)
- The full analysis: [david-ungar deep dive](../../david-ungar/sources/korz-paper-deep-dive-moollm-mapping.md) · [Don's Korz Q&A](../../david-ungar/korz/korz-notes.md)
- Grig's constellation: [CHARACTER.yml](../CHARACTER.yml) — Universal Manifest, Web of Worlds, EverArchive

↑ [character](../README.md)
