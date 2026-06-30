# Keep — reflective memory, and Craig's Smalltalk graph

> **Craig (2026):** *"I had Opus 4.8 do a whiteroom port of Keep to Smalltalk, and it's been a lovely graph database for agentic memory. Much better than a pile of Markdown files…"*
> — [generalbusiness-ai/keep](https://github.com/generalbusiness-ai/keep)

**Upstream:** [keep](https://github.com/generalbusiness-ai/keep) · [docs](https://docs.generalbusiness.ai/) · PyPI: `keep-skill`

---

## What Keep is

**Keep** is *reflective memory for agents* — not a folder of notes, but a **semantic graph** you search by meaning, traverse by edges, and practice with across sessions.

On ingest it **summarizes, embeds, and tags** URLs, files, PDFs, code trees, and inline text. You retrieve by intent (`keep find "what's the rate limit?"`), by tags (`project`, `topic`, speech-act `act`/`status`), and by **graph traversal** (`keep find --deep`). Selected tags become **navigable edges** (speaker, author, cites, git_commit, custom inverses). Open commitments and past learnings can surface automatically when you `get` a note.

The bundled **SKILL.md** treats memory as **practice**, not storage: reflect before, during, and after action (`keep prompt reflect`); track intentions (`keep now`); capture learnings and breakdowns. The design is grounded in **Winograd & Flores** — work as commitment management, not information processing. That lineage sits comfortably next to live Smalltalk, MOOLLM skills, and constructionist microworlds.

**Interfaces:** CLI, Python API (`Keeper`), MCP (`keep_flow`, `keep_prompt`, `keep_help`), LangChain/LangGraph, hooks for Claude Code / Codex / Copilot / OpenClaw / Hermes. Local (Ollama, MLX) or hosted at [keep.generalbusiness.ai](https://keep.generalbusiness.ai).

---

## Why Craig's Smalltalk port matters here

Craig sits on the **[live_objects](../../process/trails/live-objects.md)** trail — objects that stay live in the browser via SqueakJS and WASM. **Keep in Smalltalk** is the same instinct applied to **agent memory**:

| Markdown pile | Keep graph |
|---------------|------------|
| Flat files, manual cross-links | Summaries + embeddings + version history |
| Search = grep or scroll | Semantic search + BM25 + edge follow |
| Context = whatever fits in the window | Standing queries, `now`, commitments, meta tags |
| No shared object model | Notes as objects with tags, parts, strings, provenance |

A **whiteroom port** (reimplementation from spec, no copied code) into **live Smalltalk** makes memory a **first-class object system** — the same world Craig already livecodes in with **Caffeine** and **Catalyst**. That's a natural show thread: *live objects in the page* meet *live objects in the agent's head*.

Don's **MOOLLM** microworld OS (filesystem as rooms, skills as prototypes, YAML jazz) and **MicropolisCore** AI tutors are wrestling the same problem from another angle: how does an agent **remember skillfully** across sessions without drowning in slop? Keep is one concrete answer Craig has been **using and re-hosting**.

---

## Show threads (Keep × Craig × Micropolis)

1. **Demo the practice** — `keep prompt reflect` on air; index the repo (`keep put ./my-project/ -r --watch`); search by meaning mid-conversation.
2. **Smalltalk port story** — What did Opus 4.8 port? What stayed Python, what became Smalltalk objects? What's *lovely* about a graph DB in the image?
3. **Live memory vs live UI** — Caffeine edits the **running page**; Keep edits the **running agent's context**. Same liveness ethic, different membrane.
4. **Commitment tracking** — Speech-act tags (`act=commitment`, `status=open`) vs MOOLLM's conversation patterns; agent handoff with `keep now` + `keep move`.
5. **Micropolis / MOOLLM fit** — Could a Keep store (or Craig's Smalltalk graph) back tutor memory for MicropolisCore? Index design docs, index the WASM build, surface open promises from past episodes.

---

## Quick reference (upstream)

```bash
uv tool install keep-skill    # or: pip install keep-skill
keep                          # first-run wizard (providers + agent hooks)

keep put "Rate limit is 100 req/min" -t topic=api
keep put ./my-project/ -r --watch
keep find "authentication flow" --deep
keep now "Debugging auth flow"
keep prompt reflect
```

**MCP:** three tools — `keep_flow`, `keep_prompt`, `keep_help`. Manual setup: bake `KEEP_STORE_PATH` into the launched `keep --store … mcp` command.

**Python:**

```python
from keep import Keeper
kp = Keeper()
kp.put("insight", tags={"kind": "learning", "project": "micropolis"})
results = kp.find("wasm bridge", limit=5)
```

Full docs: [QUICKSTART](https://github.com/generalbusiness-ai/keep/blob/main/docs/QUICKSTART.md) · [AGENT-GUIDE](https://github.com/generalbusiness-ai/keep/blob/main/docs/AGENT-GUIDE.md) · [EDGE-TAGS](https://github.com/generalbusiness-ai/keep/blob/main/docs/EDGE-TAGS.md) · [SKILL.md](https://github.com/generalbusiness-ai/keep/blob/main/SKILL.md)

---

## See also

- [invitation.md](invitation.md) — Amsterdam on-camera show seed
- [../../repo-shows/craig-latta/](../../repo-shows/craig-latta/README.md) — show YAML + README
- [../vanessa-freudenberg/](../vanessa-freudenberg/README.md) — SqueakJS foundation
- [../../process/trails/live-objects.md](../../process/trails/live-objects.md) — live object lineage
- [MOOLLM](https://github.com/SimHacker/moollm) — microworld OS / skills (parallel memory architecture)
