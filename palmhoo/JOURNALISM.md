# Summary Journalism & the Coherence Engine 🐒✋📰

*How Palmhoo stays true as the world under it moves. Companion to the
[Constitution](CONSTITUTION.md) (see Article IX) and the machine-readable
[coherence.yml](coherence.yml).*

## The problem

Palmhoo is a tree of summaries over three living repos. Every note on every shelf is a claim
about something that keeps changing. A claim with no maintenance plan is a lie with a delay on
it. The MOOLLM skills count was 139 on 2026-07-08; it is already wrong, or will be by the time
you read this. That's not fixable by writing more carefully — it's fixable by treating summaries
as **living dependents of their sources**.

## The mipmap

Graphics hardware stores an image at many resolutions — mipmaps — so you can read it at the
detail you need. MOOLLM already does this per-artifact with the semantic pyramid:
**GLANCE.yml → CARD.yml → SKILL.md → README** (never load a lower level without the one above).

Palmhoo adds the missing levels *above* single artifacts:

| Level | Summarizes | Example |
|-------|-----------|---------|
| GLANCE / CARD / README | one artifact | a skill's own card |
| **Shelf entry** (a table row) | one artifact, for one audience | Palmhoo's why-you'd-read-it note |
| **Shelf page** | a topic across repos | [under-development/](under-development/README.md) |
| **Root guide** | all shelves | [README.md](README.md) |

That's a **summary token mipmap tree**. Change a leaf and everything on the path to the root is
potentially stale. The tree makes the blast radius *computable* — but only if the edges are
declared. That's what [coherence.yml](coherence.yml) is for.

## Running the LLM as a coherence engine

MOOLLM names this pattern [coherence-engine](https://github.com/SimHacker/moollm/tree/main/skills/coherence-engine):
the LLM's job is not just generating text but **maintaining consistency across a body of
documents**. Applied to Palmhoo, the loop is:

1. **Declare** — every summary registers its sources in `coherence.yml` (summary → sources edges,
   plus `last_verified` dates).
2. **Detect** — a tool (eventually a GitHub Action) diffs commits against declared sources and
   flags summaries whose sources changed since `last_verified`. Staleness becomes a queue, not a
   surprise.
3. **Update** — someone (human or agent) re-reads the changed sources, updates the summary, bumps
   `last_verified`, and submits a PR.
4. **Propagate** — if a summary changed meaningfully, its own dependents get flagged. Coherence
   walks up the tree.
5. **Review** — every update lands as a PR: **human-in-the-middle** when an agent wrote it,
   **agent review** when a human wrote it. The GitHub PR workflow is the accountability layer;
   nobody's summary — carbon or silicon — merges unreviewed.

**Conflicts are first-class.** When two documents make incompatible claims (two skill counts, two
origin stories, two dates), that's a *coherence conflict*: declare it in `coherence.yml` under
`conflicts`, track it like a bug, resolve it in PR discussion, and record which source won.

## Journalism

Contributors can perform **journalism**: pick something in the repos, actually look at it, write
the summary, declare its dependencies, and then *keep it true*. The beat reporter model — you own
a summary the way a reporter owns a beat. The work is:

- **Reporting** — read the sources; write the why-you'd-read-it note (Constitution, Article IV).
- **Fact-checking** — verify claims against the tree at head, not memory.
- **Corrections** — when your sources move, your summary moves. The staleness queue is your
  assignment desk.
- **Declaring** — every summary you file registers its edges in `coherence.yml`, so tools can
  route future assignments.

**Volunteering tokens:** automation costs compute. Anyone can run their own LLM over the
staleness queue and submit "summary update" PRs — donating tokens *and* judgment. The repo
doesn't need a central inference budget if the audience brings its own rigs, which is already the
Repo Show's [bring-your-own-rig policy](../process/repo-show-format.yml) applied to maintenance.

## The refresh scan (and, someday, the worms)

The Apple ][ pulled a legendary trick: its video circuitry, sweeping the screen sixty times a
second, read out rows of dynamic RAM — and since *reading* DRAM is what keeps it from fading,
the display scan refreshed the memory **as a side effect of looking at it**. No dedicated
refresh hardware. Watching was maintenance.

Palmhoo works the same way. The shelving pass is the video scan: Palm (or any journalist)
sweeping the shelves, re-reading entries against their sources, is what keeps the summaries
from decaying. **Reading is refreshing.** A directory nobody scans is DRAM with the video
disabled — it doesn't get corrupted dramatically; it just quietly fades.

And the anticipated workers of the automated scan already exist in lore: the **worms** of the
old LLOOOOMM world, who live in **Ground** (the funky living-earth entity — quite a character
themself). A worm is a programmable text organism with an **input cursor at one end, an output
cursor at the other, and a digestive system in between**: it scans over text, transforms what
passes through, runs concurrently with its siblings at the speed of light, and resolves and
serializes overlapping edits according to rules — or randomly, if chaos is the rule. A staleness
queue is exactly a worm's breakfast: point the input cursor at a changed source, the digestive
system at the summary's contract, the output cursor at the updated summary, and let the PR
workflow (Article IX, point 4) inspect the castings. Palm is preparing a study — *Palm on
Worms* — after a proper expedition into the archives; it's on the
[Study's upcoming list](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/pub/stage/palm-nook/study).

## Automation status

Honest ledger, instance-first as always:

| Piece | Status |
|-------|--------|
| Dependency manifest (`coherence.yml`) | **live** — seeded 2026-07-08, maintained by hand |
| Staleness detection (GitHub Action diffing commits vs declared sources) | designed here, not yet built |
| Auto-filed staleness issues / assignment queue | not yet built |
| Agent-drafted summary-update PRs | manual for now — any agent session can work the queue |
| Crowd-sourced "summary update" PRs | **open now** — the workflow needs no tooling, just a fork |

The manifest comes first because everything else reads it. Detection is a small script: `git log
--since=<last_verified> -- <sources>` per entry; nonempty output means stale. Build it when the
hand-run gets tedious — that's the play-learn-lift threshold.

---

🐒✋ *A summary is a promise to keep watching. Don't file what you won't maintain — or do, but
declare it, so the queue can find someone who will.*

↑ [Palmhoo root](README.md) · [Constitution](CONSTITUTION.md) · [coherence.yml](coherence.yml)
