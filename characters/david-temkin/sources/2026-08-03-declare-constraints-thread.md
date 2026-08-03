# David Temkin — Declare constraints, push vs pull, scheduling (Aug 2026)

**Primary:** David Temkin → Don Hopkins, 3 August 2026, 16:58 GMT+2  
**Subject:** Re: OpenLaszlo lives, Declare, Mesa -- and a formal invitation

Scheduling thread: Jul 31 invite → Aug 1 David accepts → Aug 2 Don confirms **Wednesday 6:00 PM Don time**.

---

## David Temkin (3 Aug 2026) — Declare model

### Push constraints (spreadsheet model)

Declare is **push**, compiler-driven, like OpenLaszlo with type checking:

- Spreadsheet mental model: a cell changes → dependents update → their dependents, recursively.
- Dependency tree is **compiler-derived**; compiler sees into functions and tracks cells that might affect a constraint expression.
- Programmer specifies constraint expression per constrained value; no manual "recalculate" or "push to dependents."
- Like **Garnet** in that constraint expressions are parsed — but **no pull code**; non-reactive slot changes propagate when the change occurs.

> "This is pretty much like OpenLaszlo, no surprise, but comes with type checking."

### Svelte runes

David had heard of runes (Claude mentioned) but was not sure what they are. Don's prior message (below) explained runes + MicropolisCore wasm bridge.

### Non-visual components and data binding

Inside a Declare program: wire anything to anything; constraints need not attach to visual components. UI objects and layouts are **Declare classes** — not platform flexbox. Platform layouts are developer-extensible in Declare.

**Baseline:** Declare is for UI, but faceless "business logic" classes with constraints/data binding are possible. Data binding is view-aware (e.g. 100K dataset, 50 visible rows — does not instantiate all views upfront).

**Outside world / embedding:**

| Mechanism | Status |
|-----------|--------|
| Embed Declare app in existing web page | Yes |
| Embed web content inside Declare (island, no iframe) | Yes — limited connectivity today |
| Declare inside Declare | Yes — separate worlds with demarcation |
| Svelte/React as data source | **Bridge not built** — binding works off JSON (network or baked in); could load over bridge from on-page code or worker |
| wasm + rendering in worker (Don's Micropolis pattern) | David has similar in Mesa (worker → offscreen buffer → main); cross-boundary reactivity via **JSON datasets** is the supported direction |

> "Declare is best for self-contained things with coarse-grained connections to the outside world. It's not a good added layer or framework to be used with combo-plate JS/CSS/HTML."

Not pursuing free-form JS library arbitrarily intermixed — OpenLaszlo model: **"build an app this way."**

### Instance-first

Don asked about Oliver's Instance Substitution Principle. David: **"Yup! (Or so I hope)"**

### No HTML/CSS — OpenLaszlo kernel analogy

Same bet as OpenLaszlo:

- Thin **kernel**: low-level Flash/DHTML constructs (rendering, hit testing — not layout/widgets).
- All UI objects, keyboard navigation, layout = Declare classes; **no platform layout engines**.
- Escape hatch **discouraged** except DOM islands or embedding Declare in larger HTML app.
- Reasons: keep language small; compiler can analyze whole program (also helps LLM reasoning).

### Window manager stress test

Don proposed **Kando**-style overlay WM (Electron transparent window, pie menus, native window frames). David:

- Would need Electron desktop bridge projecting **"cells"** into Declare for constraint expressions — compiler must be taught external cells.
- Ideal: Declare window objects data-bound to native windows via bridge.
- **Z-order** vs native windows is hard; overlay on whole desktop is easier.
- **Beyond current Declare design** — meant for web apps today.
- **Inside** a Declare app: full WM is doable — see **Desktop demo** on Declare homepage.

Don cited 1991 NeWS PostScript ICCCM WM (tabbed frames, pie menus, XCalc digit iconification) + merged article:

https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/don-hopkins/sources/articles/pie-menus-window-management.md

David: crazy idea (WM over WM) but conceivable if native host provides hooks; macOS permissions are restrictive.

> "Thanks for all the links below! I am reading."

---

## Don Hopkins (embedded in thread) — article pack

Don sent four deduplicated articles + Micropolis OpenLaszlo retrospective, in reply to David's constraint questions:

| Article | URL |
|---------|-----|
| Pie Menus and Window Management | [pie-menus-window-management.md](../../don-hopkins/sources/articles/pie-menus-window-management.md) |
| Constraints and Prototypes in Garnet and OpenLaszlo | [constraints-garnet-openlaszlo.md](../../don-hopkins/sources/articles/constraints-garnet-openlaszlo.md) |
| What is OpenLaszlo, and What's It Good For? | [what-is-openlaszlo.md](../../don-hopkins/sources/articles/what-is-openlaszlo.md) |
| Instance-First Development | [instance-first-development.md](../../don-hopkins/sources/articles/instance-first-development.md) |
| Svelte 5 Runes, Heir of OpenLaszlo | [svelte-runes-openlaszlo-heir.md](../../don-hopkins/sources/articles/svelte-runes-openlaszlo-heir.md) |
| Micropolis in OpenLaszlo (MicropolisCore) | https://github.com/SimHacker/MicropolisCore/blob/main/documentation/openlaszlo/README.md |

Don's framing in the message:

- **Garnet:** pull constraints, CMU CL + KR + expression parsing + CLX hooks.
- **OpenLaszlo:** push — fastest for Flash player workload (Laszlo team explanation).
- **Svelte 5:** push (fine-grained signals); runes escape component boundary — non-visual Simulator component wrapping wasm C++ via Emscripten/Embind; same plumbing drives node server bridge.

---

## Scheduling thread (Jul 31 – Aug 2)

| Date | Who | What |
|------|-----|------|
| 31 Jul | Don | Formal Repo Show invite (OpenLaszlo reunion, Declare, Ungar/Self, Mesa); Drag Queen Olympics same day; I DO DECLARE + Lady Bracknell clips |
| 1 Aug 22:28 | David | **Yes** — talk first; **Wednesday 6:00 PM Don's time** |
| 2 Aug 11:12 | Don | Confirmed; invite sent; glad clips landed |
| 3 Aug 16:58 | David | Technical reply above |

Invitation doc: [../invitation.md](../invitation.md)  
Show seed: [../../../repo-shows/openlaszlo/README.md](../../../repo-shows/openlaszlo/README.md)

---

## Show hooks (from this thread)

- Live **push vs pull** taxonomy with David reading Don's Garnet/OL article on air
- **Declare Desktop demo** vs Don's NeWS/Kando WM lineage — same crazy idea, different era
- **JSON bridge** as integration story: Declare ↔ Svelte runes ↔ wasm Simulator
- **Compiler sees whole program** — LLM reasoning affordance (David explicit)
- **ISP scorecard** — David certifies Declare; Oliver still to adjudicate on air
- Pre-call reading list already sent — good async episode spine

↑ [David Temkin README](../README.md) · [declarelang.md](declarelang.md)
