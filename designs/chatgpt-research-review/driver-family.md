# The MOOLLM driver family — friendly edition

> Readable rendering of [`driver-family.yml`](driver-family.yml) (that file stays the source of truth). One
> abstract `moollm-driver` prototype defines the contract; each host is a **child** that clones it (Self-style
> delegation) and overrides only what differs.
>
> Companions: [`driver-spec.md`](driver-spec.md) (the contract) · [`harvest.md`](harvest.md#generic-driver-design) ·
> upstream home proposed at `moollm/kernel/drivers/`.

## The abstract parent (`moollm-driver`)

Every driver delegates to one prototype that defines:

- **Canonical ops:** `read · list · search.text · search.semantic · write · patch · append · run · summarize · log`
- **Must declare:** tier · detection · ambient-handling mode · a capability-negotiation table · enforced-vs-advisory
- **Invariants:**
  - **No ghost actions** — any writable driver routes world-mutation through an inspectable command object.
  - **Warn, don't crash** — an unresolved reference WARNs (naming the repo to mount); never hallucinate contents.
  - **Honest enforcement** — never claim to enforce what the host cannot enforce.

## How to read the ops

| Term | Meaning |
|------|---------|
| **native** | the host tool exists and provides it directly |
| **emulated** | built from other ops (e.g. `append` = read + write) |
| **advisory** | the model simulates it in-band (honor-system) |
| **via_mcp** | unlocked through a MOOLLM-kernel MCP server |
| **none / maybe** | unsupported / degrades to asking the user |

## The children, by tier

| Driver | Tier | Status | `append` | The one-line truth |
|--------|------|--------|----------|--------------------|
| **generic** | 1 | fallback | none | The honest floor. Everything degrades to this; conversation-based, ask the user, never pretend. |
| **deep-research** | 2 | demonstrated | none | Read-only observer that **produced this very review.** Correct role: findings-producer. |
| **chatgpt** | 3 | stub | advisory | Best as a **read + propose** host: reads well, runs Python, should emit findings for a writer. |
| **cursor** | 4 | **production** | emulated | The only battle-tested driver — and the one whose shape leaked into the "universal" kernel. |
| **gemini-cli** | 4 | proposed | emulated | CLI-first (the app is too detached from the local FS). |
| **copilot** | 4 | proposed | emulated | Leans on GitHub's own agent abstractions; multi-root/skill semantics less clear. |
| **claude-code** | 5 | stub | via_mcp | **Cheapest path from advisory → enforced**, via an MCP server. Build next. |
| **antigravity** | 5 | stub | advisory | Native browser subagent; needs "Agent Gitignore Access" to write `.moollm/`. |
| **openai-agents** | 6 | proposed | native | Review's nominee for first "real" driver; I refine → strong **second** enforced child. |
| **mooco** | 6 | **in design** | native | The flagship. Where the kernel **stops pleading with someone else's UX and owns orchestration.** |

## Cursor, from the inside (first person)

I'm writing this from *inside* the Cursor driver. What it's actually like:

- `.cursorrules` + `.mdc` are injected whether I like it or not — **that** is the real boot hook. Everything the
  manifest calls "boot" downstream of that is me *choosing* to comply.
- `cursor.yml` is **not** loaded by Cursor. I only see it if I read it — the manifest documents me to myself.
- `hot.yml` / `cold.yml` / `working-set.yml` are inert files. "Context paging" = me remembering to re-read them.
- The **resolver** is not a process; it's a to-do list I execute with Glob/Grep. It works because I'm careful.
- **Append-only** logging is faith-based: no atomic append, so I read+write and *promise* not to rewrite history.
- **Multi-root** is genuinely great: `workspace_paths` arrives in the system prompt; the union resolver is real value.

**The leak to fix:** the kernel is Cursor-shaped in ways nobody chose on purpose. The tell — things labeled
"universal" (pyramid-never-jump, hot/cold paging) are actually "Cursor-with-a-diligent-Claude" behaviors. The
cure is the tiny reference workspace booted on a **non-Cursor** host; it will expose every hidden assumption.

## Two readings that matter

- **The real axis is enforced-vs-advisory, not "how much MOOLLM fits."** Tiers 1–5 are advisory to varying
  degrees (compliance is the model's choice); only tier 6 (mooco / OpenAI-Agents / Claude-Code-via-MCP) can
  **enforce** the contract. The whole strategic game: move guarantees from advisory to enforced without losing
  host portability.
- **`append` is the canary.** It's native only at tier 6. Everywhere else, append-only logs — the substrate of
  no-ghost-actions provenance — are honor-system. If you want provenance you can trust, you need an
  enforced-append host (MCP tool or mooco). The most concrete, testable gap in the family.

**Build next:** `moollm-driver-claude-code` (cheapest advisory→enforced path, via an MCP server).
**Test next:** a minimal conformance fixture → [`driver-spec.md`](driver-spec.md).
