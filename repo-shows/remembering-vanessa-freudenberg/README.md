# Remembering Vanessa Freudenberg — SqueakJS, WASM, and Live Objects in the Browser

> Honor Vanessa Freudenberg (d. 2025) — SqueakJS, Etoys, Croquet/Multisynq, her WASM insights after SqueakJS — with the people who knew her and carry the lineage …

| Field | Value |
|-------|-------|
| **Status** | rehearsed (2026-07-20) |
| **Type** | memorial_arc |
| **Host** | Don Hopkins |
| **Consent** | Craig warm — rehearsed the tribute; Dan + Alan not yet asked |

## Topic

Honor Vanessa Freudenberg (d. 2025) — SqueakJS, Etoys, Croquet/Multisynq, her WASM insights after
SqueakJS — with the people who knew her and carry the lineage forward. Craig's Caffeine builds on
her VM; Dan's Smalltalk Zoo credits SqueakJS; Alan's constructionist microworld arc runs through
the same live-object thread.

## The rehearsal — and what it sparked

On July 20, 2026, Don and Craig recorded a rehearsal screencast reading her SqueakJS paper
(DLS '14, Most Notable Paper 2024) — and found that every public copy still carried her
deadname. That became the founding case of the
[prestoration](https://github.com/SimHacker/moollm/tree/main/designs/prestoration): a
[memorial edition](https://github.com/SimHacker/moollm/blob/main/designs/prestoration/sources/Freudenberg-2014-SqueakJS-memorial-edition.pdf)
with her correct name, the original preserved bit-for-bit beside it, every change hashed and
disclosed — and the discovery of her own 2021 HN comment asking not to be deadnamed in
citations. The session was lifted into the
[change-name skill](https://github.com/SimHacker/moollm/tree/main/skills/change-name) via
[cursor-mirror](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror).

## The show

**Act 1:** Craig screen-shares the memorial edition and scrolls through it at his own pace —
his scrolling sets the tempo, the conversation follows the pages. Other papers of hers are
welcome in the same sitting; her
[JIT brain dumps](../../characters/vanessa-freudenberg/sources/jit-notes/) are preserved in
the repo.

**Act 2:** the adventure of making the memorial edition — the font-subset archaeology,
cursor-mirror reading its own session transcript, and play-learn-lift turning the one-off
surgery into the reusable change-name skill.

## A design beat: what would Vanessa think of Korz′?

[The Korz′ design](../../characters/david-ungar/korz/design.md) leans on her SqueakJS
one-liner — *"My plan is to do as little as necessary to leverage the enormous
engineering achievements in modern JS runtimes"* — as prior art for its soft tier,
and poses the question without answering it. This is where it gets argued, because
memorial mode applies to design discussions too: we don't ask an LLM to simulate
her. We ask the people who knew her to remember what she *did* say and imagine what
she would say, working from her notes, papers, code, and live environments — the
[jit notes](../../characters/vanessa-freudenberg/sources/jit-notes/) with their
runnable mockups (which cite the Hölzle–Chambers–Ungar deoptimization paper
directly), the
[DLS '14 memorial edition](https://github.com/SimHacker/moollm/blob/main/designs/prestoration/sources/Freudenberg-2014-SqueakJS-memorial-edition.pdf),
SqueakJS itself still live in the browser.

She had strong documented opinions at exactly this fault line: she chose readable,
debuggable, *fun* JS over a WASM rewrite, and rode the platform's JIT instead of
fighting it. Would she read Korz′'s soft tier as the same bet one level up, or as
the thing she warned about — readability and flexibility lost to an opaque
optimizer? Her friends get to argue it; she gets quoted, not synthesized.

## Memorial mode


Represent and discuss documented work + stories friends tell. Do not interview Vanessa; do not speak as her.


## Related

- [memorial.md](characters/vanessa-freudenberg/memorial.md)
- [invitation.md](characters/craig-latta/invitation.md)
- [invitation.md](characters/dan-ingalls/invitation.md)
- [invitation.md](characters/alan-kay/invitation.md)
- [live-objects.md](process/trails/live-objects.md)

## In this directory

- [`remembering-vanessa-freudenberg.yml`](remembering-vanessa-freudenberg.yml) — machine reading (seed spec)
- `SHOW.yml` — *not yet*; add when ready to run the show (lazy prototype promotion)

↑ [`../README.md`](../README.md) · [`../INDEX.yml`](../INDEX.yml)
