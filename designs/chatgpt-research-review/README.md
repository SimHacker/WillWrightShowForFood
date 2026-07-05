# ChatGPT research review — harvest, analysis, and Opus perspective

> **What this is:** a harvest and critique of a ChatGPT deep-research review of the whole SimHacker
> stack (moollm + MicropolisCore + WillWrightShowForFood), plus first-person analysis added by
> Claude Opus running *inside* Cursor — MOOLLM's native driver environment.
>
> **Source under review:** `DonHopkins/temp/chatgpt-research-review.txt` (3323 lines).
> **Produced:** 2026-07-05. **Author of this bundle:** Claude Opus (Cursor session). **Uncommitted** — for Don's review.

---

## Read order (semantic image pyramid)

| Level | File | Question it answers |
|-------|------|---------------------|
| 👁️ GLANCE | this `README.md` | What is this bundle and why does it exist? |
| 📇 harvest | [`harvest.yml`](harvest.yml) · friendly: [`harvest.md`](harvest.md) | What did the review actually claim, and is each claim true/agreed? |
| 📜 spec | [`driver-spec.md`](driver-spec.md) | What is the generic MOOLLM Driver contract? *(highest-leverage deliverable)* |
| 📜 family | [`driver-family.yml`](driver-family.yml) · friendly: [`driver-family.md`](driver-family.md) | One prototype + per-platform children (Cursor is written first-person). |
| 📜 hosts | [`read-only-hosts.md`](read-only-hosts.md) | How does a read-only run (like the one that produced the review) become actionable? |
| 📜 eval | [`stack-evaluation.md`](stack-evaluation.md) | Honest working / partial / aspirational verdict, with a preserve-at-all-costs list. |
| 📜 roadmap | [`roadmap.md`](roadmap.md) | Highest-leverage next steps for cross-platform adoption. |

Start with `harvest.yml` if you want the fastest map of "what was said vs what I think." Start with
`driver-spec.md` if you want the one thing most worth building next.

## Deeper dives (added this session)

Extracted from Don's direction to harvest *all* the good/bad ideas, framing, and hard decisions into
named artifacts and dirs. Each is standalone; read the one you need.

| Dir / file | What it covers |
|------------|----------------|
| 🏆 [`mooco/MOOCO-DRIVER-DEEP-DIVE.md`](mooco/MOOCO-DRIVER-DEEP-DIVE.md) | Why **mooco** is the flagship Tier-6 driver: it *owns the loop*, so the 8 capabilities other drivers can only advise become enforced. Read from the mounted `mooco` repo (~17k lines of design). |
| 🏆 [`mooco/MOOCO-CAPABILITY-BAR.yml`](mooco/MOOCO-CAPABILITY-BAR.yml) · friendly: [`mooco/MOOCO-CAPABILITY-BAR.md`](mooco/MOOCO-CAPABILITY-BAR.md) | The yardstick: per-capability `native / virtualize / simulate / stub` matrix across mooco / Claude Code / Cursor / ChatGPT / Deep Research. |
| 🧩 [`mooco/MOOCO-COMPOSABLE-FILESYSTEM.md`](mooco/MOOCO-COMPOSABLE-FILESYSTEM.md) | Compose many repos into one **hermetically sealed** namespace from `(repo+ref+path+mount)` tuples — "docker mounts but better," ref-pinned + reproducible. |
| 🧩 [`mooco/MOOCO-LIVE-CONTROL-SURFACES.md`](mooco/MOOCO-LIVE-CONTROL-SURFACES.md) | The **filesystem is the API**: magic self-describing YAML files (Linux `/proc`, Apple ][ `$C000`, NeWS magic dictionaries); read reflects, write steers; mooco-mirror. |
| 🧩 [`mooco/MOOCO-SKILL-CLI-SANDBOX.md`](mooco/MOOCO-SKILL-CLI-SANDBOX.md) | Skills declare **sanitary sister-script CLIs** invoked through scoped sandboxed tools instead of raw shell — makes auditing/cursor-snitch computable. |
| 🔤 [`nomenclature/NOMENCLATURE-HEISENBERGIAN-ACRONYMS.md`](nomenclature/NOMENCLATURE-HEISENBERGIAN-ACRONYMS.md) | Heizronyms as a feature: MOOLLM, UBIK, CARD, K-line. Field theory of acronyms; RMS/DUGHUF/Wolfram + Scott/Amy Jo Kim corners; why LLM-variable expansion is designed-in. |
| 🔤 [`nomenclature/NOMENCLATURE-ONBOARDING-GLOSSARY.md`](nomenclature/NOMENCLATURE-ONBOARDING-GLOSSARY.md) | The boring front door: one plain line per term for human newcomers. |
| 🔤 [`nomenclature/NOMENCLATURE-SKILL-KLINES.md`](nomenclature/NOMENCLATURE-SKILL-KLINES.md) | Curated field guide to the operational skill magic words (PLAY/LEARN/LIFT, MOUNT, EAT/POOP, 🖖, being tags…) — the K-lines you invoke, not all 131. |
| 🎬 [`framing/FRAMING-REPO-AS-MEDIUM.md`](framing/FRAMING-REPO-AS-MEDIUM.md) | The genuinely original idea: the repo is a world you enter/fork/improve. |
| 🎬 [`framing/FRAMING-REPOSHOW-AS-NEW-MEDIUM.md`](framing/FRAMING-REPOSHOW-AS-NEW-MEDIUM.md) | The flagship: RepoShow as a **new medium** (peer to blog/podcast/video/stream) with its own verb — *reposhowing* — and its soul: **repossession** of authorship from AI. The word as heizronym; reappropriation lineage (punk/queer); "A RepoShow is always intense." |
| 🎬 [`framing/FRAMING-GITCITY-MCLUHAN.md`](framing/FRAMING-GITCITY-MCLUHAN.md) | McLuhan: "the pull request is the message"; GitCity; de-Microsoftify as survivability. |
| 🎬 [`framing/FRAMING-PITCH-AND-LINEAGE.md`](framing/FRAMING-PITCH-AND-LINEAGE.md) | The Primeagen pitch ("Construction is king") + StoryMaker→CurrentTV→Bar Karma→Urban Safari→GitHub lineage. |
| 🎬 [`framing/FRAMING-ONE-OBJECT-MODEL-SELF.md`](framing/FRAMING-ONE-OBJECT-MODEL-SELF.md) | Self underneath everything: one prototype-object universe; the deepest (and most aspirational) claim. |
| ⭐ [`IDEAS-STRONGEST-AND-WEAKEST.yml`](IDEAS-STRONGEST-AND-WEAKEST.yml) · friendly: [`IDEAS-STRONGEST-AND-WEAKEST.md`](IDEAS-STRONGEST-AND-WEAKEST.md) | The honest scorecard: crown jewels to protect, risks to watch, disputes with the review. |

---

## What the review was

Five stacked documents inside one text file, in order:

1. **The original "Boot MOOLLM" mission prompt** — Phases 1–7 + Final Reflection (repeated verbatim
   three times at the tail; the review body appears once, up front).
2. **A ChatGPT deep-research report** on the three repos as one system: boot model, MicropolisCore as
   world substrate, WWSFF as show/methodology/social machine, a workspace architecture, a
   **generic driver design with a per-platform capability table**, a critical review, roadmap, reflection.
3. **A "two different ideas" essay** — the genuinely original claim isolated: *the repository is the
   medium*; video/podcast/AI/chat are viewports.
4. **A Primeagen pitch + the StoryMaker → CurrentTV → Bar Karma → Urban Safari → GitHub lineage**, and a
   McLuhan / **GitCity** reframing ("the pull request is the message"; de-Microsoft the concept).
5. **A second deep-research report on WWSFF alone** — executive summary, priority-recommendation table,
   ecosystem opportunities, file inventory (based only on the rendered README + GitHub sidebar).

## Who produced it, and why that matters

The review was written by **ChatGPT / Deep Research working from GitHub-rendered pages** — it could not
clone or execute the repos, and it says so plainly (it treats the WWSFF file inventory as "unspecified
until inspected"). That read-only posture is not a footnote; it is the central design lesson. The review
is a **living instance of the advisory→act handoff** this bundle formalizes: a read-only host produced a
findings document, and a write-capable host (me, in Cursor) is now acting on it. See
[`read-only-hosts.md`](read-only-hosts.md).

## Why Opus, not ChatGPT

ChatGPT reviewed the stack from outside the glass. I am inside it — this session booted through
`moollm/.cursorrules`, has the multi-root workspace mounted, and can read/patch/run. So my added value is
first-person: what the Cursor driver is actually like to *inhabit*, where it leaks, and how to turn the
review's "make a Driver Spec" plea into a real, conformance-oriented contract. That is what
`driver-spec.md` and `driver-family.yml` deliver.

---

## Ground truth already settled (not re-litigated here)

- **Will Wright accepted (July 2026)** and is the confirmed kickoff guest. The review flagged a
  README status contradiction ("draft, not sent" vs "accepted") — already fixed in a prior session.
  `characters/INDEX.yml#flagship.will-wright` (`invitation_status: accepted`) is the SSOT;
  `process/VISION.md` and `process/guest-participation-ladder.yml#early_guests_july_2026.will-wright`
  agree. The review's "Will contradiction" finding is logged in `harvest.yml` as **resolved**.
- **The guest participation ladder exists** (`process/guest-participation-ladder.yml`, tiers 0–5,
  franchise model, full-service repo, warm-intro-via-Will deferred). Referenced, not duplicated.
- **The driver manifests exist**: `moollm/kernel/drivers/{README.md,generic.yml,cursor.yml,claude-code.yml,custom.yml,antigravity.yml}`.
  `custom.yml` is the mooco-shaped "real driver" (Tier 6, enforced `why`, append-only, ambient injection).

---

## The one-sentence verdict

The review is **substantively correct and unusually insightful for a read-only pass**; its single best
recommendation — "publish a short, strict Driver Spec and a tiny non-Cursor reference workspace" — is the
right call, and this bundle takes the first step by drafting that spec. The stack's load-bearing ideas
(files-as-state, semantic image pyramid, command bus / no-ghost-actions, repo-as-medium) are real and
worth preserving; its main debt is **onboarding and the advisory-vs-enforced gap**, not concept quality.

See [`stack-evaluation.md`](stack-evaluation.md) for the full accounting and
[`roadmap.md`](roadmap.md) for what to do about it.
