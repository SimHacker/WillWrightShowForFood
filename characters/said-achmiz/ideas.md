# Ideas to explore with Said Achmiz 📐

*Conversation hooks — Don's proposed topics, grounded in the public record.
Not quotes from Said.*
[Portrayal standards](../../schemas/portrayal-standards.md)

Implementation-weighted on purpose. The overlapping-but-differently-aimed companion is
[`../gwern/ideas.md`](../gwern/ideas.md), which takes the same material from the authoring and corpus
side. Credit line and receipts: [`sources/gwern-net-credits.md`](sources/gwern-net-credits.md).

## What Said has done (public record)

Much of gwern.net's design and JavaScript/CSS since 2017, per the site's own design page —
`sidenotes.js`, `image-focus.js`, and with **Shawn Presser** the generalized popup system. Themes and
much of the frontend JavaScript for **[GreaterWrong](https://www.greaterwrong.com/)** (built by
`clone of saturn`), plus its 2018 releases: appearance customization, theme tweaker, accesskeys,
adjustable text size, mobile layout. Publishes at [wiki.obormot.net](https://wiki.obormot.net/).
Gwern's word for the working relationship is **"tech co-creator."**

## The hooks

### 1. The pin test — two lineages, one architecture

Pinning a popup sets a **flag on the same window object**: no rewrap, no reparent, no second class of
thing. Identical to Don's **TNT OPEN LOOK** pin-up menus, where menu frames subclass window frames and
promotion is a flag — and the opposite of the olwm/ICCCM rewrap dance X11 imposed on separate-process
window managers with no shared class hierarchy.

The live question: is it convergent design under the same constraint, or does the browser's DOM make
it the *only* sane choice, in which case X11 was uniquely cursed? Don thinks the former. Worth arguing.

### 2. Pinned windows should outlive the page (the expensive one)

If pinning is promotion, promotion should survive navigation. A pinned popup belongs on a persistent,
**serialized** desk — reloadable, shareable, restorable — not to the document that spawned it.

This is the largest single change Don proposes to the current design and the one most likely to have a
hard reason it hasn't happened. Ask for the reason. See
[`READING-CURSORS.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop/READING-CURSORS.md).

### 3. One window class, adaptive chrome

Desktop popups and mobile popovers as two engines versus one class with viewport-dependent chrome.
Classic maintenance-versus-fidelity trade, and he has the only real data about whether the shared
abstraction survives contact with Safari.

### 4. The pin rotation, restored

OPEN LOOK's push-in / pull-out **rotation** animation as the affordance that teaches promotion.
Stagecraft with a pedagogical job. Cheap to add, easy to get wrong, possibly rejected already.

### 5. Theme tweaker → Know Knob: reader authority, one layer up

His theme tweaker gives readers brightness, contrast, saturation, hue and inversion over nine themes,
mobile included — reader authority over presentation the author chose. Don wants the same move on
**epistemic** state: a knob rendering a corpus as clean narrative → certainty markers and attribution
→ exposed assumptions and provenance → expanded counterevidence → full audit.

Gwern.net tags a page with the author's confidence. The knob asks *whose* confidence, in *which*
claim, on *what* evidence, and hands the control to the reader. Its counterpart is a **Wonder Knob**:
a question mark that grows with curiosity and can be switched to broadcast "answers wanted," making
ignorance a visible, actionable object rather than a blank.

What Don wants from Said here is not enthusiasm but the maintenance bill, since he has actually
shipped and supported reader-controlled rendering.

### 6. Keyboard, pie menu, drag — one named command each (the lint)

GreaterWrong's accesskeys and gwern.net's published chord table are two of the few systems that would
pass the webtop's invariant: **every structural operation reachable three ways, all dispatching the
same named command** — not three code paths that happen to agree.
[`TREE-NAVIGATION.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop/TREE-NAVIGATION.md).
Stated as a lint rather than a taste because that is the only form that survives a refactor. Most
likely document in the pack to contain an error he can spot on sight.

### 7. Sidenotes and the breakpoint argument

Gwern says publicly that he has repeatedly wanted sidenotes at narrower breakpoints and that Said
insists the pixels are not there "when all is said & done." Don would like to hear the actual
arithmetic — margin budget, readable measure, appropriate gutters — because the webtop faces the same
wall with a tab bar and a pie menu also competing for the frame.

Adjacent: the font-size ceiling caused by fractional sizes and rounding. Both are cases where the
implementor's *no* is the interesting artifact.

### 8. HyperTIES, 1988 — embedded menus and previews before the web

Unpublished primary sources from Don's own team: the mandatory article schema (title, synonyms,
description, body), the build scripts proving the definition was a separate compilation unit, the
MockLisp authoring tool, and the several implementations across platforms with different authors.
Link previews and embedded menus five years before the web, with a build step that pre-resolved them.
The ancestor of the popup, with receipts. See
[`hyperties/ARTICLE-SCHEMA.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop/hyperties/ARTICLE-SCHEMA.md).

### 9. Transclusion and stable back navigation

Recursive popups that survive being navigated inside — the hard part, and the part Xanadu argued about
for decades while gwern.net shipped a working subset. What breaks first at depth: focus, history, or
the reader's model of where they are?

### 10. The build-time answer to author burden

Gwern's Xanadu essay concludes that LLMs may finally absorb the authoring burden that kept
hierarchical hypertext and semantic zoom impractical. Don's version runs the model **at build time**
and ships a static artifact that needs no model to read —
[`TAGSONOMY-COMPILER.md`](https://github.com/SimHacker/moollm/blob/main/designs/TAGSONOMY-COMPILER.md).
For an implementor the interesting part is the failure mode: a synonym collision resolves silently to
a plausible wrong node, so it has to be a build-time lint with a distinctness filter, not a runtime
guess.

### 11. Bringing back visible links (HyperTIES had it)

HyperTIES could reveal every link on a page at once. Don wants that fused with animated chevrons
flowing between tab stops — a **focus flow** that renders the whole input-focus graph, keyboard
navigable through text and embedded graphics.
[`hyperties/FOCUS-FLOW.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop/hyperties/FOCUS-FLOW.md).
Honest cost, stated up front: it exposes bad tab order mercilessly. Don thinks that is a lint worth
having. An implementor may reasonably disagree.

## Show seeds

- Not yet planted. Formats offered in [`invitation.md`](invitation.md): solo on implementation, joint
  with gwern, repo-only (issues and PRs *as* the episode), or a panel with Shneiderman, Nelson, and
  Temkin.

## Sources

- [gwern.net/design](https://gwern.net/design) · [wiki.obormot.net](https://wiki.obormot.net/) ·
  [greaterwrong.com](https://www.greaterwrong.com/) ·
  [HN 37627557](https://news.ycombinator.com/item?id=37627557)
- [`sources/gwern-net-credits.md`](sources/gwern-net-credits.md) — everything above, checked by hand
- [`invitation.md`](invitation.md) · [`CHARACTER.yml`](CHARACTER.yml) · [`../gwern/ideas.md`](../gwern/ideas.md)
