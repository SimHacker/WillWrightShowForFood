# Trail — YAML Jazz, GitHub-as-MMORPG, and live collaboration

> *How to represent, organize, and collaborate when humans, LLMs, GitHub, and Twitch share one microworld*

WWSFF and MOOLLM treat **data representation** as a first-class design problem — not an afterthought
once the demo works. Don's recommendation: **YAML Jazz** for durable artifacts; **GitHub-as-MMORPG**
for async world state; **Twitch** (or equivalent stream) for synchronous co-creation — bound by
**Repo Show** workflows that ship inspectable repos, not vaporware slides.

**Girder:** [`repo-show-spine.md`](repo-show-spine.md) · [`live-objects.md`](live-objects.md) · [`moollm-compose.md`](moollm-compose.md)

---

## The problem (2020s)

Virtual worlds, game saves, show runbooks, and character souls all need:

| Need | Why it hurts when wrong |
|------|-------------------------|
| **Human-readable** | Guests, educators, and future-you must edit without a parser degree |
| **LLM-friendly** | Agents load context from files — structure and comments are the API |
| **Semantically rich** | Comments = overlay of intent + annotations (humans *and* LLMs read/write) |
| **Mergeable** | Collaboration = git, Automerge, or both — pick layers deliberately |
| **Inspectable** | Browse without login; provenance visible in the repo |

JSON alone collapses comments and buries intent. Opaque binaries fail every row.

---

## YAML Jazz — Don's data representation recommendation

**YAML Jazz** ([moollm `skills/yaml-jazz`](https://github.com/SimHacker/moollm/tree/main/skills/yaml-jazz)):

> **Comments** are a **semantically meaningful overlay** of **intent and annotations** — accessible
> and generatable by **humans and LLMs**. Structure carries data; comments carry *why*.

Not decoration. Not `# TODO fix later`. An overlay both audiences can read *and* write — the
collaboration surface when git stores the artifact and Automerge holds the live session.

Principles that matter on air:
- **Structure guides relationship** — directories are rooms; filenames are K-lines
- **Semantic Image Pyramid** — GLANCE → CARD → SKILL → README; load depth on demand
- **Postel emit** — accept messy input from guests; produce clean, complete YAML out

Repo Show artifacts (invitations, show seeds, character souls, runbooks) are written YAML Jazz so
a guest *or* an LLM can navigate without Don in the loop.

---

## GitHub-as-MMORPG — durable async backbone

**GitHub-as-MMORPG** ([design doc](https://github.com/SimHacker/moollm/blob/main/designs/GITHUB-AS-MMORPG.md)):

| Game mechanic | Git affordance |
|---------------|----------------|
| World | Repository |
| Parallel timelines | Branches |
| Merge fate | Pull requests |
| Quests | Issues |
| Shards | Forks |
| Loot / artifacts | Commits, releases, tagged show episodes |

This is the **durable score** — auditable, forkable, classroom-friendly. Not a metaphor slapped on
git for hype; it's how MOOLLM loads **worlds as address space** (rooms = directories, paths not `#42`).

Pairs with **Automerge / Livelymerge** for in-session liveness — git for what you publish after the stream.

---

## Twitch + GitHub — two layers, one show

Repo Show workflow (see [`repo-show-format.yml`](../repo-show-format.yml)):

```
Twitch  →  happening-now: demo, chat steers, audience homeplay
GitHub  →  durable score: yaml-jazz indexes, merged PRs, credited ideas
LLM     →  speed-of-light orchestration inside the context window (the stage)
```

Do not replace git with chat, or chat with async PRs. **Both.**

MicropolisCore multiverse doc: [`github-as-mmorpg-multiverse.md`](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/github-as-mmorpg-multiverse.md)

---

## Guest episodes on this trail

**Primary episode:** [**Dan Ingalls**](../../characters/dan-ingalls/) at **Ink & Switch** —
Livelymerge is the live-object stack to compare against Don's YAML Jazz + GitHub-as-MMORPG publish
model. This trail was written *for* that conversation.

| Guest | Angle |
|-------|--------|
| [**Dan Ingalls**](../../characters/dan-ingalls/) ★ | **Ink & Switch / Livelymerge** — Automerge in-session vs yaml-jazz git publish; workflows with LLMs + stream |
| [**Philip Rosedale**](../../characters/philip-rosedale/) | SL avatar souls in yaml-jazz repos; HiFi JSON history as comparison point for Dan episode |
| [**Will Wright**](../../characters/will-wright/) | Data portability dream (1996 Winograd) → federated character/save bridges |
| [**Craig Latta**](../../characters/craig-latta/) | Caffeine livecoding vs Cursor; remote screencast as Twitch layer |

Show seeds: [`repo-shows/dan-ingalls/`](../../repo-shows/dan-ingalls/) · [`philip-rosedale-hifi-moollm.yml`](../../repo-shows/philip-rosedale-hifi-moollm.yml)

---

## Doorways

[Hacker](../entryways/hacker.md) · [Educator](../entryways/educator.md) · [Producer](../entryways/producer.md) · [AI coder](../entryways/ai-coder.md) · [Guest — anyone](../entryways/guest-any.md)

← [All trails](README.md) · [MOOLLM YAML Jazz skill](https://github.com/SimHacker/moollm/tree/main/skills/yaml-jazz)
