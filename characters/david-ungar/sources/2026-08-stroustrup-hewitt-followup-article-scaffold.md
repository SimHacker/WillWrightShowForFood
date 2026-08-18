# Article scaffold — Stroustrup × Hewitt × Ungar (2014 → 2026)

Working outline for Don Hopkins's planned deep dive. **Draft — not published.**
Fill listening notes in PRs; David Ungar answers inline when ready.

**Primary source:** [`2014-stroustrup-hewitt-ungar-conversation.md`](2014-stroustrup-hewitt-ungar-conversation.md)

---

## Working title options

- *Revisiting the Conversation: Stroustrup, Hewitt, and Ungar Ten Years On*
- *Shared Memory, Messages, and the Ideas That Wouldn't Stay Dead*
- *Where Did the Great Ideas Come From? — a 2014 panel, re-listened on a bicycle*

---

## Framing (lead)

Will Wright, closing [*The Future of Content* (GDC 2005, 1:00:57)](https://youtu.be/ofA6YWVTURU?t=3657):

> So I'd encourage all of you: if you've got some totally weird idea that is just so far
> outside the box that you think there's no way that would work — go back occasionally and
> revisit those ideas. Because you just never know where they might lead.

The 2014 panel is one of those revisits — three language designers arguing politely about
concurrency models while the industry was still pretending threads were fine.

---

## Section map

### 1. Why this talk, why now

- Under-appreciated Channel 9 / LangNEXT treasure ([mirrors](2014-stroustrup-hewitt-ungar-conversation.md))
- [Bulldozer00 contemporaneous review](2014-stroustrup-hewitt-ungar-bulldozer00-review.md) (Oct 2014) — three-position checksum before Don's listen
- Don's bike-route re-listen (spatial memory + argument structure)
- 2026 stack: actors in production, Rust ownership, JS event loop, LLM agents as message-passing swarms

### 2. What they said in 2014 (scene summary)

*Don fills from transcript — placeholder beats:*

- [ ] **Bulldozer00 checksum** — Hewitt actors vs Ungar incoherent memory vs Stroustrup layered libraries ([review](2014-stroustrup-hewitt-ungar-bulldozer00-review.md))
- [ ] Shared memory vs message passing — who argued what?
- [ ] Locks, synchronization, lock-free message passing
- [ ] C++ value semantics vs Self prototypes / actor isolation
- [ ] **Inspirations segment** — teachers, papers, moments that shaped each speaker

### 3. Don's listening notes (timestamped)

Template per comment:

```markdown
### [MM:SS] — short label

**What they said:** …

**Don's note:** …

**Question for David (optional):** …

**David's reply:** *(pending)*
```

### 4. David Ungar — 2026 replies

*Merged from email / PR when David chooses to answer.*

Suggested prompts (David picks any):

- What would you change in your 2014 positions?
- Self's message-like slots vs Hewitt's actors — same river?
- Did the inspirations segment leave anything out you'd name now?
- Korz (2014 onward) as a third act — subjective dispatch vs the panel's concurrency frame?

### 5. Optional voices

- **Bjarne Stroustrup** — C++11/14/20/23 in hindsight; coroutines vs actors
- **Carl Hewitt** — memorial; [Ken Kahn](../../ken-kahn/README.md) / [Alan Kay](../../alan-kay/README.md) as discussants?
- **Urs Hölzle** — Self VM → production runtime pragmatism

### 6. What changed in the world (receipt table)

| 2014 assumption | 2026 counter-evidence |
|-----------------|----------------------|
| … | … |

### 7. Pair with Korz article?

Same Lang.NEXT 2014 conference — [Dancing with Symmetry](2014-lang-next-korz-dancing-with-symmetry.md) talk.
See [`2014-async-revisits-index.md`](2014-async-revisits-index.md) · [Korz scaffold](2026-08-korz-dancing-with-symmetry-article-scaffold.md)

### 8. Repo Show coda

Link harvested article back to [david-ungar show](../../../repo-shows/david-ungar/README.md) and
[live objects trail](../../../process/trails/live-objects.md).

---

## Don's next actions

- [ ] Re-listen with timestamps; fill section 3
- [ ] Upload clean YouTube mirror + transcript
- [ ] Email question batch to David (small — honor no-fire-hose)
- [ ] Open PR with listening notes; invite David to comment inline
- [ ] Ask consent before publishing any reply verbatim

↑ [2014 source bundle](2014-stroustrup-hewitt-ungar-conversation.md) · [Korz talk scaffold](2026-08-korz-dancing-with-symmetry-article-scaffold.md) · [2014 revisits index](2014-async-revisits-index.md) · [correspondence digest](2026-08-correspondence-facetime-and-async-pitch.md)
