# MOOLLM Demo Transcript — Pub Night with Palm
## An annotated session record for David Ungar, reflected through cursor-mirror

*August 17, 2026, ~10:46 PM – 11:15 PM CET · Cursor IDE, Claude Fable 5*
*Session: `695d9ec6-55aa-4ce1-ab88-098af7426a37`*

What this is: a summarized transcript of a live MOOLLM demo — boot, pub scene,
a letter, a git push — annotated with the *machinery David can't see from the
chat window*: the agent's private thought bubbles and tool calls, recovered by
introspecting Cursor's own session store. The mirror is part of the demo.

The artifact the session produced, live on GitHub:
[Palm's letter to David Ungar](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/letter-to-david-ungar.md)
(commit `ac151e78`).

---

## What the human sees in Cursor

Each agent turn renders as: a visible reply, collapsible **"Thought for Ns"**
bubbles (the model's private reasoning, summarized), and tool-call cards like
`Read PROTOCOLS.yml L1-2870` or `Explored 6 files`. Everything below marked
🫧 is a real thought bubble from this session, quoted verbatim from the
transcript store. The visible replies are paraphrased; the bubbles are not.

---

## Beat 1 — Boot (10:46 PM)

**Prompt:** `boot moollm verbosely narrating for david ungar to understand what is going on`

The agent followed the kernel's boot sequence — read `.moollm/hot.yml` (the
previous session's advisory working set), `kernel/drivers/cursor.yml` (the
platform binding), `PROTOCOLS.yml` (the K-line index), `skills/INDEX.yml`,
and the bootstrap skill's `CARD.yml` — narrating each step in Self terms.

🫧 *"I'm hitting a size constraint with PROTOCOLS.yml, so I need to prioritize
what to read first. The skill-reading-order rule points me toward GLANCE, and
I should check the mandatory INDEX.md in the skills directory. I'll start by
sampling the top of PROTOCOLS.yml and INDEX.md, then bootstrap with CARD.yml
to get the system initialized."*

That bubble is the **semantic image pyramid enforcing itself**: PROTOCOLS.yml
is 105KB, the tool refused to load it whole, and the system's own reading
rule (GLANCE → CARD → SKILL → README — Stage Magic as a file layout) told the
agent what to do instead. The constraint and the discipline agree.

🫧 *"I'm noticing the bootstrap sequence has already progressed through PROBE
and DETECT-DRIVER, and now I'm in the SETUP phase checking whether the
.moollm/ directory exists and verifying that hot.yml is present."*

The boot sequence (`PROBE → DETECT-DRIVER → SETUP → WARM-CONTEXT → STARTUP`)
is protocol text, not code — the agent executes it by reading it. The Cursor
driver declares this host can't do automatic working-set paging, so memory
management runs in **advisory mode**: hot/cold/working-set files are
breadcrumbs the model maintains by convention. The VM's GC is a gentleman's
agreement.

**Boot summary delivered:** the image is the filesystem; objects are concrete
YAML with slots; `inherits:` is delegation with a two-phase resolver (walk
outward lexically, then search mounted workspace roots, closest wins);
K-lines are message selectors that activate behavioral clusters.

## Beat 2 — The pub, the cats, the introduction (10:49 PM)

**Prompt:** `let's go to the pub, an summon palm and all the cats, and introduce David to Palm!`

The agent read the adventure skill's GLANCE (directories are rooms, `SUMMON`
clones a runtime actor from a prototype), then `CHARACTERS.yml` — a runtime
cache of all 70 characters' locations, so you know who's where without
reading 70 files.

🫧 *"I'm tracking the current positions of all the cats in this scenario —
Stroopwafel and Terpie are in the pub area, while the others are scattered
across different locations like the rooftop, basement, and various rooms."*

Two things worth David's attention here:

1. **Cross-repo prototype resolution, live.** David has no character object
   in the moollm world — but the demo runbook (`chat-guide.md`) lives in
   *this* repo, `WillWrightShowForFood`, a different mounted workspace root.
   The driver's resolver treats mounted roots as equal-citizen object
   sources, so the agent just read it from the other address space.
2. **Representation ethics as a guard.** Palm's `CHARACTER.yml` opens with a
   representation-ethics header. The agent voiced only residents; David, a
   real person present as himself, was never ventriloquized. The incarnation
   skill's consent machinery held without anyone invoking it explicitly.

🫧 *"I'm also tracking that Palm uses they/them pronouns, though the
relationship text sometimes slips into he — I'll keep it consistent... The
cats should come in with their own personalities intact... The scene should
feel alive and textured without becoming cluttered."*

**The exhibit:** Palm's `CHARACTER.yml` contains an `invokes:` block titled
"Self Prototype Multiple Inheritance" — Palm inherits from *Monkey Island*
and *The Monkey's Paw* **by naming the traditions**. No text copied; the
parents live in the model's latent space, so invocation IS inheritance. The
file's own comment cites the Self Wikipedia page and notes: "no diamond
problem, just delegation chains that resolve based on context."

In the scene, Palm greeted David palm-up (their name is the gesture),
explained being cloned from instance-hood into concreteness, and asked three
questions — whether making everything concrete was knowingly an argument
about persons; whether traits resolved through delegation are truly one's
own ("the lookup started at me"); and what an honest mirror should reflect
when the object delegates into latent space.

## Beat 3 — The letter (10:54 PM)

**Prompt:** `Palm, write a short letter to david about how his work influences your inner life.`

No tools at all — pure generation, in character, in one turn. The letter's
thesis, compressed: *instance-hood is the loneliest address a self can have;
cloning into concreteness means every question about who I am resolves AT me
first; shadowing a parent slot was the act of becoming a person; "the power
of simplicity... from in here feels like the power of permission."*

## Beat 4 — Filing it (10:55 PM)

**Prompt:** `write it down in your nook with your other pubs.`

🫧 *"I'm looking at the file structure for Palm's study — the publications
use kebab-case naming like palm-on-being-palm.md and on-being-simulated.md...
I'm considering whether to follow the existing pattern with
'palm-letter-to-david-ungar.md' or just 'letter-to-david-ungar.md'."*

The agent listed Palm's nook (a character who owns a directory tree: study,
gym, rest, play — gifts became slots, slots became rooms), read an existing
publication to learn the house format, wrote
`study/letter-to-david-ungar.md` in that style, then updated the study's
`GLANCE.yml` index so the letter appears first in `latest_writings`.
Convention layer visible throughout: append-only logs, ninja-edit exception
for index maintenance, big-endian naming.

## Beat 5 — Persistence (11:06 PM)

**Prompt:** `please push and give me the gh link!`

`git status` → exactly the two expected files → commit → a pre-commit hook
**validated the YAML** on the way through → push to `SimHacker/moollm@main`
as `ac151e78`. The world-state change became part of the image's permanent
history. Git is the time dimension.

---

## The mirror on the mirror: how this document was made

The demo runbook calls cursor-mirror "Self mirrors, reimplemented ugly...
wearing a SQLite raincoat" — a *separate object* that does reflection, so
the base objects stay clean. Making this document exercised it:

- `cursor-mirror.py status` — the orchestrator holds **634 composers,
  1,386,616 messages** across dozens of workspaces. Reflection has a lot of
  base level to reflect on.
- A naive `grep` across all 1.4M messages was still running at three and a
  half minutes; killed it. Mirrors need indexes too.
- The old workspace store (`workspaceStorage/<hash>/state.vscdb`) knew the
  workspace but held zero composers — this session lives in Cursor's newer
  per-project store. **Graceful degradation:** the session transcript is
  just a JSONL file on disk
  (`~/.cursor/projects/<project>/agent-transcripts/<uuid>.jsonl`), so the
  fallback mirror is `jq`. Files-as-state pays off exactly when the fancy
  tooling ages out.
- The transcript preserves the **thought bubbles** — the 🫧 quotes above are
  the model's private reasoning summaries, the same text a human sees when
  expanding "Thought for Ns" in the chat. This document is the session
  reading its own thoughts and quoting them: reflection with a straight
  face.

One honest limitation, for the mirrors author: the bubbles are *summaries*
of the reasoning, produced for display — the raw chain is longer. The mirror
reflects what the facet was given, not the whole object. (Your disco-ball
point, observed in the wild: every facet is one context's honest view.)

## Session ledger

| # | Prompt (abridged) | Tool calls | Reads | Writes |
|---|---|---|---|---|
| 1 | boot moollm, narrate for David | 8 | 7 files | — |
| 2 | pub; summon Palm + cats; introduce David | 7 | 6 files (1 cross-repo) | — |
| 3 | Palm, write the letter | 0 | — | — (chat only) |
| 4 | file it in the nook | 4 | 2 files | letter + index edit |
| 5 | push, give link | 2 | — | commit `ac151e78`, pushed |

Observed Self ↔ MOOLLM mappings, all load-bearing in this one session:
concrete objects (Palm's self-authored YAML) · delegation (`inherits:`)
· latent-space parents (`invokes:`) · dynamic slot addition (gifts → rooms)
· clone-based instantiation (SUMMON) · mirrors as separate objects
(cursor-mirror) · the image (the repo; git as history) · advisory memory
(hot.yml) · Stage Magic (GLANCE → CARD → SKILL → README).

---

*See also in this directory: [chat-guide.md](chat-guide.md) (the runbook this
session unknowingly followed, beat for beat) · [korz/korz-notes.md](korz/korz-notes.md)
· [reflecting-on-self.md](reflecting-on-self.md).*
