# Ideas to explore with Craig Latta 🎚️

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in Craig's
public work and documented connections to this repository. Things Don would love to follow
**with** Craig Latta; not quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest · consent warm (rehearsed the memorial 2026-07-20)

## What Craig has done

Craig Latta — livecoding composer and research computer scientist (UC Berkeley, CS + Music), founder of Black Page Digital. Creator of Caffeine (livecode the web — the SqueakJS Smalltalk VM bridged into browsers/Deno with dynamically generated WebAssembly), the Context minimal Squeak distribution, and Catalyst (a self-hosted WASM-GC Smalltalk VM with LLM-assisted method translation). Squeak Foundation board member, Appsterdam volunteer; divides his time between Amsterdam and Berkeley.

## The hooks

### ★ The memorial edition scroll-through (rehearsed — the lead)
We already read her DLS '14 SqueakJS paper together on the July 20 rehearsal — the session
that exposed the deadname problem and sparked the
[prestoration](https://github.com/SimHacker/moollm/tree/main/designs/prestoration). The show:
Craig screen-shares the
[memorial edition](https://github.com/SimHacker/moollm/blob/main/designs/prestoration/sources/Freudenberg-2014-SqueakJS-memorial-edition.pdf)
and scrolls at his own pace — his scrolling sets the tempo, the talk follows the pages. Other
papers welcome; her [JIT brain dumps](../vanessa-freudenberg/sources/jit-notes/) are in the
repo. Act two: the making-of adventure — font-subset archaeology,
[cursor-mirror](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) reading
its own transcript, play-learn-lift into the
[change-name skill](https://github.com/SimHacker/moollm/tree/main/skills/change-name).
Source: [`sources/2026-summer-rehearsal-and-messages.md`](sources/2026-summer-rehearsal-and-messages.md)

### 0. OpenLaszlo reunion → Declare (optional group)
[`invitation.md`](invitation.md) Option B. **What prototypes are** / live objects with Ungar +
Brad Myers + Temkin — Morphic / Caffeine next to Self, Garnet, LZX, Declare. Amsterdam-friendly.

### 0.5 Korz — Smalltalk molecules, Self atoms, Korz quarks
Don's fresh chat with Ungar (Aug 2026): **Korz**, the even-selfisher language — unintentional
anagram of Zork; subjective programming, a sea of slots grouped along parameterized dimensions
instead of decomposed into objects. Built at IBM, presented at Microsoft's LANG.NEXT. Deep
material already in the repo:
[korz-notes.md](../david-ungar/korz-notes.md) · [korz-prime.md](../david-ungar/korz-prime.md) ·
[Onward! 2014 paper](../david-ungar/sources/korz-2014-onward.pdf).
**Jam with Craig:** the lineage from the Smalltalker's side — what would a Korz image feel like
to livecode? Could Caffeine host a sea of slots the way Self hosted the Korz prototype?

### 1. Show seed: `repo-shows/craig-latta/`
Caffeine solo — walk the repo on air.

### 2. Caffeine (SqueakJS+WASM livecoding), Amsterdam
in-person on-camera; remember Vanessa

### 3. Morphic vs cargo-cult MVC — Don’s 2011 Reddit flame + Alan Kay
Harvest: [2011-reddit-mvc-flame-morphic.md](../don-hopkins/sources/2011-reddit-mvc-flame-morphic.md) ·
primaries: [Whatsa Controller Anyway? 2005–06](../don-hopkins/sources/2005-2006-whatssa-controller-anyway.md)
([Baypiggies Wayback](https://web.archive.org/web/20081027202900/https://deirdre.org/pipermail/baypiggies/2005-April/000918.html) ·
[lua-l MARC](https://marc.info/?l=lua-l&m=115687537130296))

Don (u/xardox) torching a “MVC for games” tutorial — controllers as Gilbert Godfrey on a date;
view owns drawing *and* reverse-projected input; Smalltalk moved on → **Morphic**. Thread includes
Alan Kay’s email (cameras/worlds good, machinery bad; **watchers**; unsolved inverter; HyperCard
construction). Roots: NeWS/ScriptX **tracking services**, DreamScape “no controllers.” Sibling:
[HN 2015 Kay/Morphic](../alan-kay/media/discussions/hn-mvc-morphic-watchers-2015.md).

**Jam with Craig:** what should the audience *see* in Caffeine that MVC tutorials never show? Where
would a Controller class go on a live page — and why doesn’t it? Kay’s watchers vs Morphic halos.
Constraints/prototypes (Garnet/Laszlo) vs Morphic stepping. Keep’s graph memory as instance-first
cousin?

## Sources (public)

- [`invitation.md`](invitation.md)
- Show seed: [`repo-shows/craig-latta/`](../../repo-shows/craig-latta/)
- [`CHARACTER.yml`](CHARACTER.yml)
- Don MVC→Morphic flame: [`../don-hopkins/sources/2011-reddit-mvc-flame-morphic.md`](../don-hopkins/sources/2011-reddit-mvc-flame-morphic.md)
- Reddit: https://www.reddit.com/r/programming/comments/qs3zp/for_those_starting_with_the_model_view_controller/
