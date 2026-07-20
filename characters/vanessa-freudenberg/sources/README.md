# Sources — Vanessa Freudenberg 🕯️

## SqueakJS paper — memorial edition

[`Freudenberg-2014-SqueakJS-memorial-edition.pdf`](Freudenberg-2014-SqueakJS-memorial-edition.pdf) —
**"SqueakJS: A Modern and Practical Smalltalk That Runs in Any Browser"**, DLS '14
(SPLASH, Portland, October 2014). Winner of the ACM SIGPLAN **DLS Most Notable Paper
Award, 2024** — credited to *Vanessa Freudenberg, Dan Ingalls, Tim Felgentreff, Tobias
Pape, Robert Hirschfeld*.

This is the author's version from Vanessa's own site, with the front-page byline updated
to **Vanessa Freudenberg**, matching her 2020 name change and the DLS 2024 award credit.
The technical content is byte-for-byte unchanged. Edits, all made 2026-07-20 for the
memorial project:

- Page 1 byline: "Bert Freudenberg" → "Vanessa Freudenberg" (re-centered over her
  affiliation column)
- Page 1 email: → `vanessa@codefrau.net` (her address per freudenbergs.de)
- Page 4 footnote 2 + link: `github.com/bertfreudenberg/SqueakJS` →
  [`github.com/codefrau/SqueakJS`](https://github.com/codefrau/SqueakJS/), where the
  repository actually lives today
- PDF Author metadata updated to match; a `Note` field in the document info records
  this provenance

### Provenance

- Original preserved here unmodified as
  [`Freudenberg-2014-SqueakJS-original.pdf`](Freudenberg-2014-SqueakJS-original.pdf) —
  primary source, exactly as she published it at
  `https://freudenbergs.de/vanessa/publications/Freudenberg-2014-SqueakJS.pdf`
  (site currently unreachable), via the
  [Wayback Machine snapshot of 2025-01-19](https://web.archive.org/web/20250119071632/https://freudenbergs.de/vanessa/publications/Freudenberg-2014-SqueakJS.pdf)
- Original sha256: `a5a91c1d840a772cad2a49d03c045874ab25e0de15af05b2e873e1ef7ebaf11d`
- All Wayback snapshots of that URL (2024-07 → 2025-01) share one digest: the PDF was
  never re-typeset with her name during her lifetime. This edition fills that gap for
  memorial use.

### The canonical fix still worth pursuing

The [ACM name-change policy](https://www.acm.org/publications/policies/author-name-changes)
(option 3, "Updated Identity") lets ACM post a corrected version of record in the Digital
Library ([doi:10.1145/2661088.2661100](https://doi.org/10.1145/2661088.2661100), which still
says "Bert"). It normally requires the author's verified request; posthumously, the
co-authors — Dan Ingalls, Tim Felgentreff, Tobias Pape, Robert Hirschfeld — are the right
people to petition, and the HPI co-authors likely still hold the LaTeX source for a proper
re-typeset. That would be a fitting, permanent memorial act.

## The paper she asked us to cite — in her own words

[`Ingalls-2020-Evolution-of-Smalltalk-Zoo-corrected.pdf`](Ingalls-2020-Evolution-of-Smalltalk-Zoo-corrected.pdf) —
Dan Ingalls, ***The Evolution of Smalltalk: From Smalltalk-72 through Squeak*** (HOPL IV, 2020),
in the **updated Smalltalk Zoo edition** Dan published at
[smalltalkzoo.thechm.org](https://smalltalkzoo.thechm.org/papers/EvolutionOfSmalltalk.pdf).

In November 2021, Don linked the original HOPL version on Hacker News, and **Vanessa replied
herself** ([codefrau, HN 29125515](https://news.ycombinator.com/item?id=29125515)):

> Dan published an updated version of that paper here:
> https://smalltalkzoo.thechm.org/papers/EvolutionOfSmalltalk.pdf
> Would be great if you could cite that one next time. **The main improvement for me is not
> being deadnamed.** There are other corrections as well.

This comment is a primary source twice over: it documents the corrected edition, and it
documents *her own wish*, stated publicly — the wish the memorial edition above carries out
for the one paper that never got the same treatment.

The **complete thread** — including the two parent comments she was replying to (Don's
appreciation of her hybrid GC design, quoting her paper at length, and his follow-up quoting
Appendix A.5 of Dan's original HOPL paper) — is preserved verbatim in
[`hn-thread-2021-squeakjs.md`](hn-thread-2021-squeakjs.md), with parentage verified against
the HN API. Notably, the parent comment already called her **Vanessa** nine days before her
reply, while every link and quotation in it still said "Bert" — the version-of-record gap in
a single screenful.

- Downloaded 2026-07-20; sha256: `c8bbbaa9c96f04c16407bc158af849c41efb80ddfe542ab2e059727f6e4896c6`
- Verified: the Zoo edition's text credits **Vanessa Freudenberg** throughout — the
  Smalltalk-78 resurrection, SqueakJS, and the acknowledgments
- Wrinkle: its **reference list still cites her old name** for the 2014 SqueakJS and
  Reviving Smalltalk-78 papers, because citations follow ACM's uncorrected version of
  record — the same gap the ACM petition (above) would close

## The 2023 Croquet Jasmine thread — her VM philosophy, in her own words

[`hn-thread-2023-croquet-jasmine.md`](hn-thread-2023-croquet-jasmine.md) — the December
2023 HN exchange between Don and Vanessa on the *Croquet: Live, network-transparent 3D
gaming* story: her Croquet Jasmine resurrection (the version Alan Kay used for his 2004
Turing Award lecture), the SqueakJS hybrid GC, why she chose JavaScript over WebAssembly
("we would lose a lot in readability, flexibility, and to be honest, fun"), Self's dynamic
deoptimization, and the Lars Bak lineage from Self to V8. Includes the X thread with Dan
Ingalls's "Yay Vanessa!" and Don's later HN recaps
([40917424](https://news.ycombinator.com/item?id=40917424),
[42133745](https://news.ycombinator.com/item?id=42133745)) that kept it circulating.

## Her JIT brain dumps

[`jit-notes/`](jit-notes/) — the "brain dumps and experiments" she pointed to in that
thread, preserved verbatim: the main performance notes from
[squeak.js.org/docs/jit.md.html](https://squeak.js.org/docs/jit.md.html) (March 2021,
updated November 2023) in both original Markdeep and extracted Markdown, the earlier
[JIT Ideas wiki page](https://github.com/codefrau/SqueakJS/wiki/JIT-Ideas-...), and the
runnable `jit-perf.js` benchFib mockup with its harness page. Context mapping, inline
caching, non-local returns via exceptions, stack capture — the design that became the
SqueakJS v2 effort.

## Where her name is already correct

- [DLS Most Notable Paper Award 2024](https://dynamic-languages-symposium.org/index.html) — credits Vanessa Freudenberg
- [squeak.js.org](https://squeak.js.org/) — "SqueakJS by Vanessa Freudenberg"
- [wiki.squeak.org/squeak/5822](http://wiki.squeak.org/squeak/5822) — paper page crediting Vanessa
- [Her publications page](http://freudenbergs.de/bert/publications/) — "I changed my name … to Vanessa Freudenberg in 2020"
