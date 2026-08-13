# Declare (`declarelang`) — deep sniff for the Repo Show

**Repo:** https://github.com/davidtemkin/declarelang  
**Live:** https://davidtemkin.github.io/declarelang/  
**Skill (agent kernel):** https://github.com/davidtemkin/declarelang/blob/main/skill/SKILL.md  
**Whole language in one file:** https://github.com/davidtemkin/declarelang/blob/main/docs/declare.md  
**Docs root (LLM + human same prose):** https://github.com/davidtemkin/declarelang/blob/main/docs/README.md  
**Reference app:** `apps/calendar/calendar.declare` (continuous zoom across four views; LLM-authored)

David shared Declare (Jul 2026) after the OpenLaszlo 5.0 push; try **Calendar** and **Desktop** on the live site. Don's reply frame: Svelte is the Laszloiest mainstream stack; lean into training data ([no-ai-humansplaining](https://github.com/SimHacker/moollm/blob/main/skills/no-ai-humansplaining/SKILL.md)); Declare benefits because (1) it **declares** inheritance from OpenLaszlo without reimplementing it, (2) OpenLaszlo is in the training data. Discussion summary → [`declare-reimagine-discussion.md`](declare-reimagine-discussion.md).

---

## What it is (in one breath)

A **DSL for UIs** — "SQL for interfaces." Two delimiters: `[ … ]` = view tree (components, attributes, children); `{ … }` = TypeScript (values / handlers). `{ }` values are **constraints**: standing relationships the runtime keeps true. No re-render, no VDOM diff, no dependency arrays, no hooks. Reactive by construction; typed; real logic is ordinary TypeScript. One tree → **DOM or canvas** (WebGL next). Compiler runs in **browser or Node**; browse a `.declare` URL and it compiles. Designed so the **whole language fits an LLM context window**; agent skill + `declare-model.json` spine; every ` ```declare ` fence in docs is compiler-verified on CI.

**Lineage (David's own words):** heir to OpenLaszlo — declarative, reactive, ran at scale — but **not a port**. Ground-up redesign: statically typed, modern web, **shaped for LLMs from the start**.

**Don's refinement (Jul 2026):** "not a reimplement" = not a port — and better, a **reimagine**. See [`declare-reimagine-discussion.md`](declare-reimagine-discussion.md).

---

## Does Declare use Svelte? Resemble it?

| | Answer |
|---|---|
| **Uses Svelte?** | **No.** Own `runtime/` + `compiler/`; zero Svelte dependency. |
| **Resembles React?** | Surface temptation only — and the docs warn models *not* to extrapolate from React/CSS/HTML. |
| **Resembles Svelte (esp. 5 / runes)?** | **Spiritually yes** — compile-time reactivity, assignment notifies, no VDOM reconciliation as the mental model, fine-grained updates. |
| **Resembles OpenLaszlo?** | **Conceptually yes** — declarative tree, constraints, replication over data, states/modes; LZX was the ancestor; Declare is the heir, not a reimplementation. |

### Same grain as Svelte 5

- **Assignment is the update model** — `count = count + 1` sets *and* notifies (cf. `$state` / writing a rune).
- **Derived relationships stay true** — `{ parent.width - 40 }` is a standing constraint (cf. `$derived`).
- **Compiler extracts dependencies statically** — Declare goes further: unanalyzable constraints are **hard compile errors** (`DECLARE7001` residue), not silent runtime tracking.
- **No virtual DOM** as the story — both reject React's reconcile-the-world model.

### Where Declare is *not* Svelte

| Declare | Svelte 5 |
|---|---|
| Custom `[ ]` / `{ }` language | HTML-ish templates + JS/TS |
| **No CSS, no DOM in the language** — style is attributes; dual DOM/canvas backends | CSS/HTML first-class; DOM is the target |
| Children from **datapath replication** (`:rows[]`), not `{#each}` in the tree | `{#each}` / snippets in markup |
| `State` / `Spring` / layout-as-reactive-slot first-class | transitions/motion as separate concerns |
| Explicitly **LLM-shaped**: one-file spec ~10k tokens, skill, verify ladder, introspection | Not designed as "language for models" first |
| OpenLaszlo heir + training-data leverage | Independent lineage (Rich Harris / Ractive → …) |

**Show punchline:** Don to David — Svelte is the Laszloiest mainstream stack; Declare is David betting that the next Laszlo isn't a framework *inside* JS but a **small UI language** LLMs can hold whole, with TypeScript only inside the braces. Micropolis already uses Svelte 5 runes for Wasm binding *without* requiring a DOM (server-side sim) — same "relationships stay true" grain, different surface.

---

## Architecture sniff (for air / PRs)

1. **`runtime/`** — parser, reactive core, layout, animation, DOM + canvas backends (zero external deps).
2. **`compiler/`** — thin `.declare` → JS; depends one-way on runtime.
3. **`library/`** — controls/themes in `.declare` (auto-include by tag).
4. **`apps/`** — homepage, calendar, desktop, docs browser, inspector (all Declare apps).
5. **`skill/`** — Anthropic-compatible agent skill (Claude Code auto-discovers).
6. **`tools/verify`** — six-rung ladder: structure → resolution → typecheck → headless boot → real input → visual baselines.
7. **Docs as corpus** — category B prose identical for humans/LLMs; `declare-docs:` symbolic IDs; `declare-model.json` machine spine.

Hosting pattern rhymes with OpenLaszlo 5.0: browser compile, service worker, static GitHub Pages, program URL = app address.

---

## Killer demos for the episode

1. Live homepage (self-hosting Declare).
2. **Calendar** — four views, continuous zoom, drag/edit; "484 lines / 54 KB gzip / 0 lines by hand."
3. **Desktop** sample.
4. Inspector (`⌥⌘D`) — click a value → expression + live inputs; edit Declare live.
5. Side-by-side: OpenLaszlo 5.0 Explorer ↔ Declare calendar ↔ Micropolis Svelte 5 + Wasm.

---

## Instance Substitution Principle? (open question)

Oliver Steele's ISP: instance ≡ its own definition; LZX obeyed, JS often didn't
([oliver-steele show](../../../repo-shows/oliver-steele/README.md)).

Declare (`docs/declare.md` §4): any instance may declare its own members; compiler synthesizes
an anonymous subclass; promote to named `class` when you instantiate twice. **Looks instance-first.**
Whether that fully satisfies ISP — ask Oliver + David on air. Pull **Dave Ungar** (interviewed at
Laszlo, got it; Self × MOOLLM) — [`david-ungar`](../../david-ungar/).

## Episode thesis (draft)

**Act I — OpenLaszlo:** RIAs before Ajax was a word; constraints; David's 5.0 resurrection (camera on the stage).  
**Act II — Declare:** reimagine, not port — LLM-native DSL; same constraint soul; LZX→Declare rewrite bet.  
**Act III — Svelte 5 / Micropolis:** Don's "Laszloiest" mainstream cousin; runes outside the DOM; lean into training.  
**Act IV — Instance-first / Self:** Oliver ISP + Ungar Self + MOOLLM object system (video `0uBO6ZAcVTE` @ 16:16).  
**Act V — Mesa + In Formation:** spatial AI canvas vs chat-window future; print satire moral spine.

↑ [sources index](README.md) · [reimagine discussion](declare-reimagine-discussion.md) · [LinkedIn 5.0 thread](2026-openlaszlo-5.0-linkedin-thread.md)
