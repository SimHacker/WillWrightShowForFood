# MVC flame → Morphic — Reddit r/programming (2011)

*Don (u/xardox) vs cargo-cult MVC for games; lands on Morphic, Alan Kay, Garnet/Laszlo constraints.*
[Portrayal standards](../../../schemas/portrayal-standards.md)

**Thread:** [For those starting with the model view controller pattern in games…](https://www.reddit.com/r/programming/comments/qs3zp/for_those_starting_with_the_model_view_controller/)  
**OP:** u/boxhacker (tutorial article) · **Don:** u/xardox · ~2011 (thread age ~15y as of 2026)

**Why harvest:** show fuel for **[Craig Latta](../../craig-latta/)** — Morphic / live objects / Caffeine — and the Alan Kay “watchers” line already mirrored on HN.

**Sibling (same Alan email, HN 2015):** [`../../alan-kay/media/discussions/hn-mvc-morphic-watchers-2015.md`](../../alan-kay/media/discussions/hn-mvc-morphic-watchers-2015.md)

---

## TL;DR (Don)

MVC is cargo-culted obsolete machinery. Controllers add brittle indirection; the view already knows how to draw, so it knows how to reverse-project input. Smalltalk invents MVC, then moves on — look at **Morphic**. Ask Alan Kay. Prefer **constraints + prototypes** (Garnet, OpenLaszlo) and **services** (NeWS / ScriptX tracking) over a Holy Trinity of three boxes.

Sound bites Don used in-thread:

- Controllers are like bringing **Gilbert Gottfried** along as a third leg on a date.
- Splitting drawing and input across view vs controller is **King Solomon cutting the baby in half**.
- The TV-remote metaphor for controllers is grasping at straws — the view doesn’t need to walk across the living room to change the channel.
- “We can all agree that Models model, and Views view. And of course Controllers control, but what does it even mean?”
- Stop limiting yourself to three boxes.

---

## Opening flame (condensed)

Against the OP’s game-MVC tutorial:

1. **Cargo cult.** Reheating obsolete ideas without understanding what controllers were for — or why modern frameworks and Smalltalk itself abandoned them.
2. **TV remote is wrong.** View and model can talk directly; an intermediate “button box” adds dependencies both ways.
3. **Input belongs with drawing.** The view knows screen geometry and semantics because it draws them — reverse projection lives there.
4. **A third object that knows model *and* view** makes “model mustn’t know the view” *worse*, not better.

---

## What instead? (Don’s constructive answer)

Reply to u/deafbybeheading (“what is state-of-the-art?”):

| Approach | Pointers Don gave |
|----------|-------------------|
| Data-driven presentation | Oliver Steele — *Rethinking MVC* (OpenLaszlo architect) |
| Constraints + prototypes | Don: [Constraints and Prototypes in Garnet and Laszlo](https://donhopkins.com/) (Garnet @ CMU with Brad Myers, 1992–3; OpenLaszlo later) |
| Soft skin / hard skeleton | Spend complexity budget polishing UX; keep a modular skeleton; allow encapsulation breaks when focus must land where users expect |
| Instance-first development | Steele — build a messy instance tree, then carve natural classes (prototypes win here) |
| Services, not Controllers | Kaleida **ScriptX Tracking Service** (mid-90s) on TNT/NeWS ideas — one mouse-tracking service; tracker mix-ins on views/models; delegation + matrix transforms |
| Swing lesson | Early Swing split view/controller, then **collapsed them into one UI delegate** — tight coupling made generic controllers impractical ([Swing Architecture Overview](https://www.oracle.com/java/technologies/javase/architecture-swing.html)) |

**Constraints soundbite:** programming without constraints is like writing in machine language — declarative formulas (`(parent.width - self.width) / 2`) beat scattered resize handlers and Rube Goldberg MVC update schemes.

**Prototype soundbite:** real power is methods/properties/handlers on *live instances*, not dummy off-screen prototypes used only as class stand-ins.

---

## Morphic (thread payoff)

u/ripter: Smalltalk abandoned MVC — what instead?  
u/naughty: **Search for Morphic** (Self → Squeak).  
u/boxhacker cites C2 [ModelViewControllerHistory](http://c2.com/cgi/wiki?ModelViewControllerHistory) (VisualWorks still had MVC).

Don’s arc in this thread: flame → Kay email → Morphic as the live-object answer the cargo cult never looked up.

---

## Alan Kay (email Don posted in-thread)

Same text Don later posted on HN (2015). Verbatim from Don’s Reddit comment:

> Hi Don  
>  
> Lots of different questions....  
>  
> Things seem to hang on in computing just because they work a little bit.  
>  
> MVC was originally done at PARC almost 40 years ago. The good part was philosophical -- the idea to adapt the notion of "cameras" and "worlds" in the original 3D graphics stuff I participated in at Utah 45 years ago. The bad part of MVC was how we implemented it -- much too much machinery, etc.  
>  
> We (my various groups since then, including Viewpoints Research) have not thought about MVC since, but have used and devised various viewing methods over the last 20+ years. I like to do views as "watchers" which do not affect what they are viewing. There are lots of ways to do this. Similarly, I like to also use "watchers" (context sensitive to the views) to catch needed inputs. We have never done a really satisfactory automatic inverter for dealing with the loss of "dimensions" that happen when a view is made (but we have done some experimental ones).  
>  
> One important criterion is for end-users of all kinds to be able to easily make their own views in a very powerful ad hoc way via construction. We have done a number of adaptations and generalizations of how this can be done in Hypercard -- and this seems to work well (enough).  
>  
> Since we always roll our own languages and development systems, we don't care about problems that other systems might have. For example, we have very little knowledge about C#, etc.  
>  
> We do try to learn from the few good systems that are out there.  
>  
> Cheers,  
>  
> Alan

---

## Web MVC ≠ UI MVC (why the thread went nuclear)

Long exchange with u/RevoltingX: Rails templates-as-views, “no code in the view,” “controller draws” — Don’s point is exactly that **redefining M/V/C per platform** is the disease. Interactive UI views have drawing *and* input code; Apple’s own `UIView` docs list touch handling; controllers as kitchen sinks are cargo cult. Summarize on air; don’t re-litigate the whole flame war.

Also cited by Don in-thread:

- C2: [WhatsaControllerAnyway](http://c2.com/cgi/wiki?WhatsaControllerAnyway)
- Lua list 2006-08-29 — Don: “Controllers can be like having Gilbert Godfrey along as a third leg on a date”; Smalltalk moved beyond MVC; Spring IoC / Laszlo binding as alternatives
- BayPiggies 2005 — “Whatsa Controller Anyway?”

---

## Show hooks — Craig Latta (Morphic / Caffeine)

*Don’s proposed topics — not claims about Craig’s views.*

| Beat | Ask / jam |
|------|-----------|
| **Morphic as the answer** | Reddit told people to “search Morphic” — what should a 2026 audience *see* in Caffeine that MVC tutorials never show? |
| **Kay’s watchers** | Non-mutating watchers + context-sensitive input watchers — how do those rhyme with Morphic halos / direct manipulation in SqueakJS? |
| **No third leg** | Live page in the browser: where would a Controller class go — and why doesn’t Caffeine need one? |
| **Inverter problem** | Kay: never solved automatic invert of projection loss — still open in Morphic / Etoys / Caffeine? |
| **Instance-first** | Prototypes + live instances vs one-class-per-widget — does Keep’s graph memory feel like the same move? |
| **Constraints** | Garnet/Laszlo formulas vs Morphic layout / stepping — what should MicropolisCore / Soul City steal? |
| **Vanessa / SqueakJS** | Memorial mode — Morphic-in-the-browser as her gift; Craig carrying WASM forward |

**Also good with:** [Dan Ingalls](../../dan-ingalls/) · [David Ungar](../../david-ungar/) · [Alan Kay](../../alan-kay/) · [Jens Mönig](../../jens-monig/) (Morphic.js / Snap!) · [Brad Myers](../../brad-myers/) (Garnet)

---

## Connects in the repo

| What | Link |
|------|------|
| Craig show seed | [`../../../repo-shows/craig-latta/`](../../../repo-shows/craig-latta/) |
| Craig ideas | [`../../craig-latta/ideas.md`](../../craig-latta/ideas.md) |
| HN 2015 Kay/Morphic | [`../../alan-kay/media/discussions/hn-mvc-morphic-watchers-2015.md`](../../alan-kay/media/discussions/hn-mvc-morphic-watchers-2015.md) |
| Kay Quora MVC origin | [`../../alan-kay/media/quora-recaps/oop-messaging-and-what-comes-next.md`](../../alan-kay/media/quora-recaps/oop-messaging-and-what-comes-next.md) |
| Garnet → Svelte bridge | [`micropolis-svelte-snap-constraint-bridge.md`](micropolis-svelte-snap-constraint-bridge.md) |
| Remembering Vanessa | [`../../../repo-shows/remembering-vanessa-freudenberg.yml`](../../../repo-shows/remembering-vanessa-freudenberg.yml) |

---

↑ [Don sources](README.md) · [Craig Latta](../../craig-latta/) · [Alan Kay discussions](../../alan-kay/media/discussions/)
