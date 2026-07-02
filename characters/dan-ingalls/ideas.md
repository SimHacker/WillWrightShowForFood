# Ideas to explore with Dan Ingalls 🪟

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in Dan's
public work and documented shared interests. Things Don would love to follow **with** Dan;
not quotes, not claims about what he thinks.*
[Portrayal standards](../../schemas/portrayal-standards.yml) · invitation guest

## What Dan has done

**Dan Ingalls** — principal architect of five generations of **Smalltalk**; inventor of
**BitBlt** and **pop-up menus**; co-creator of **Squeak**; builder of **Fabrik** (visual
dataflow) and the **Lively Kernel** (live coding in the browser); host of the **Smalltalk Zoo**
at the Computer History Museum. ACM Grace Murray Hopper and Software System awards.

## Shared ground

**Alan Kay** introduced Don to Dan via the **Fabrik** paper (2018) — pop-up/gesture menus as
cousins of pie menus. The thread deepened through Fabrik's modular-time dataflow, the Pie Menus
retrospective, and Dan's reflection on the missed leap from Squeak to a web-borne live system
(the lineage: Lively → SqueakJS → **Livelymerge** at Ink & Switch with Alex Warth). Don shared
UnityJS bridge notes (path expressions, query templates) and **High Fidelity distributed JavaScript
plugins** (voting box, text chat, diffusion-limited aggregation — JSON message passing, script
everywhere) in the same orbit as **Vanessa Freudenberg**'s SqueakJS work. Don's collaboration stack:
**YAML Jazz** repos + **GitHub-as-MMORPG** + stream — see
[`yaml-jazz-collaboration-stack.md`](../../process/trails/yaml-jazz-collaboration-stack.md). See
[`correspondence.yml`](correspondence.yml).

## The hooks

### 1. Pop-up menus ↔ pie menus — direct-manipulation cousins
Not a debate — a **family portrait**. Dan invented pop-ups in Smalltalk; Don **cooked up and
studied** pie menus at UMD CHI'88 (after **PIXIE**, 1969 — see Heinz U. Lemke episode).
[`pie-menus-and-pop-ups.md`](pie-menus-and-pop-ups.md) as the show handout.

### 2. Smalltalk Zoo walkthrough — edit history live in the browser
Dan hosts 48 years of Smalltalk at CHM. On-air: pick a historical image, change it, feel the
**liveness** that NeWS and HyperCard almost had.

### 3. Fabrik visual dataflow — modular time, not just boxes-and-wires
The Fabrik paper Alan forwarded is the anchor. How visual languages teach **time** and **dataflow**
— relevant to Snap!, SimCity rules, and MOOLLM skill graphs.

### 4. Ink & Switch — Livelymerge, YAML Jazz, and collaboration in the LLM age ★
**The topic Don most wants to explore with Dan** — what you're building at **Ink & Switch** with
Alex Warth: **Livelymerge** (Smalltalk-like liveness on **Automerge**, local-first mergeable live
objects).

How should **data representation**, **organization**, **workflows**, and **collaboration** work when
humans, LLMs, **GitHub**, and **Twitch** share one microworld? Don's YAML Jazz bet: **comments** as
a semantically meaningful overlay of intent and annotations — accessible and generatable by humans
and LLMs — on top of mergeable structure.

| Layer | Don's stack | Dan's stack (to compare on air) |
|-------|-------------|----------------------------------|
| **In-session** | MOOLLM microworld liveness | **Automerge / Livelymerge** |
| **Published** | **YAML Jazz** — comment overlay of intent + annotations (human + LLM) | ? — can a Lively page export cleanly? |
| **Durable** | **GitHub-as-MMORPG** — branches, PRs, issues | Ink & Switch publish model |
| **Live** | Repo Show + stream | Ink & Switch + classroom? |

Compare historical stacks (**Croquet**, **[Philip Rosedale](philip-rosedale/)**'s HiFi JSON plugins,
**UnityJS**, Pantomime VR JSON) for what each got right — but the **center of gravity** is Dan's
current Ink & Switch work, not a metaverse retrospective.

Show question: which state belongs **in Automerge** vs **in-repo** (yaml-jazz + git)? Can collaborators
(including LLM agents) merge live *and* publish inspectable artifacts? Trail:
[`yaml-jazz-collaboration-stack.md`](../../process/trails/yaml-jazz-collaboration-stack.md).

### 5. Live-in-the-browser: Lively → SqueakJS → Caffeine
The arc from Dan's Lively Kernel to **Craig Latta**'s Caffeine (WASM livecoding). **Vanessa
Freudenberg** memorial segment as the bridge figure.

### 6. BitBlt and the graphics substrate everything sat on
Why every window system since owes a debt to the BitBlt design — and what that means for
**browser-native** tool stacks today.

### 7. Squeak as "Smalltalk written in itself"
Bootstrapping, mirrors, and the moral: systems you can **change while they run**. Constructionism
as engineering discipline, not pedagogy only.

## Sources (public)

- [`correspondence.yml`](correspondence.yml) · [`pie-menus-and-pop-ups.md`](pie-menus-and-pop-ups.md)
- [`invitation.md`](invitation.md) · Show seed: [`repo-shows/dan-ingalls/`](../../repo-shows/dan-ingalls/)
- [`media/from-mail/MANIFEST.yml`](media/from-mail/MANIFEST.yml) — Fabrik paper, thread pages
- [`yaml-jazz-collaboration-stack.md`](../../process/trails/yaml-jazz-collaboration-stack.md) — **Ink & Switch flagship topic**
- CHM Smalltalk Zoo: https://smalltalkzoo.thechm.org/
