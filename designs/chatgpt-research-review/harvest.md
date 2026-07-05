# Harvest — the claim ledger, friendly edition

> Readable rendering of [`harvest.yml`](harvest.yml) (that file stays the source of truth). Every substantive
> claim from the ChatGPT deep-research review, tagged with an implementation **status** and my **stance**, plus
> a first-person note from inside the Cursor driver.
>
> Source review: `DonHopkins/temp/chatgpt-research-review.txt` (3323 lines), produced by a read-only host that
> could not clone or run the repos. Where it said "unspecified," I checked the actual files.

**Status** — does the thing the claim describes actually exist and work?

| Badge | Meaning |
|-------|---------|
| 🟢 **working** | implemented and functioning today |
| 🟡 **partial** | structurally real but incomplete / advisory / unenforced |
| 🔵 **aspirational** | exists mainly as design prose or vision |
| ⚪ **n/a** | a meta-claim about the review itself |

**Stance** — do I (Opus) agree with the review's judgment? **agree · disagree · refine**

## Boot model & MOOLLM kernel

- **World, not tool** — 🟡 partial · agree. Filesystem as runtime/memory/navigation/social space; directories
  are rooms. *The load-bearing idea — but "inhabit" is enacted entirely by the LLM's voluntary compliance.
  The world is real; the physics is honor-system.*
- **Philosophy braid** (Papert/Minsky/Wright/Self/Ackley/Postel) — 🟢 working · agree. *Verified in
  `INDEX.yml`: each name maps to a live skill. The most honest name-dropping I've seen; the citations cash out.*
- **Semantic image pyramid** — 🟢 working · agree. *The single best idea in the stack. But "never load lower
  before upper" is unenforceable — a strong default, not an invariant. Document it as advisory.*
- **Filesystem object grammar** (plural=type, singular=instance, UPPERCASE=exported interface) — 🟢 working ·
  agree. *Confirmed: `DIRECTORY-AS-OBJECT.md` + `CARDS-AS-OBJECTS.md` are first-class. More legible than most
  frameworks' hidden registries.*
- **Multi-root resolver** — 🟡 partial · refine. *The spec is excellent and precise; the implementation is me
  executing Glob/Grep by hand. "It works" = "a diligent LLM can follow the algorithm." Label it a behavioral
  spec, not running code.*
- **Cursor-specific vs universal** separation — 🟢 working · agree. *The generic/cursor/custom triad genuinely
  separates concerns — the cleanest part of the stack for an outside host to learn from.*
- **Five-layer driver model** — 🟡 partial · agree. *Best synthesis in the review; adopted as the spine of
  `driver-spec.md`. Refinement: `append` deserves its own canonical op precisely because Cursor lacks it.*

## MicropolisCore as substrate

- **Layered monorepo** (C++ → WASM, SvelteKit, CLI, browser+Node) — 🟢 working · agree. *Browser/Node duality
  is the concrete win — headless replay + future agent integration become plausible.*
- **Command bus** — 🟢 working · agree. *Verified it exists and is tested. The strongest single artifact the
  review identifies; preserve at all costs. Bigger claim than the review made: it's the executable prototype of
  the read-only→act handoff, and it generalizes beyond Micropolis.* → [`read-only-hosts.md`](read-only-hosts.md)
- **Observe→Propose→Approve loop** — 🟡 partial · agree. *The loop is real in the command bus; the
  AI-origination + governance layers are partial. "No ghost actions" is the ethical core — enshrine it in the
  Driver Spec as a MUST.*
- **MicropolisHub ambition placement** — 🔵 aspirational · agree. *Federation writing is co-located with
  shipping code. Not urgent to split, but a doc-tree-level working/partial/aspirational label would help.*

## WWSFF as show / methodology / social machine

- **Repo is the stage** (SEED→…→HARVEST→RESEED) — 🟡 partial · agree. *Format documented and seeded; "partial"
  because no show has aired yet — the harvest loop is proven on paper, not in production.*
- **TicketPR** (audience participation as a mergeable git artifact) — 🟡 partial · agree. *Original and smarter
  than it sounds. Mechanism + one example (palm) exist; real audience TicketPRs await a live show.*
- **Will-status contradiction** — ⚪ n/a · agree · **RESOLVED**. *The review was RIGHT to flag it — the single
  most credibility-damaging bug it found — and it's already fixed. Three sources now agree: accepted. The
  reviewer read a stale rendered README. Lesson: projection-heavy repos need one canonical live status surface;
  `characters/INDEX.yml` is now that surface.*
- **Public-bud vs private-source drift** — 🟡 partial · agree. *The Will contradiction was the proof. Fix isn't
  more docs — it's a single SSOT per fact class + a sync/verify check that fails on drift.*
- **License missing** — 🟡 partial · **refine / verify**. *Inferred from a GitHub sidebar with no license badge;
  not confirmed in the working tree. Action: check the root; if truly absent, add one (cheap, unblocks
  everything). Don't treat the inference as ground truth.*

## Workspace as one system

- **Three layers, one stack** (moollm kernel · MicropolisCore substrate · WWSFF social membrane) — 🟡 partial ·
  agree. *`moollm-plugin.yml` makes the composition explicit. Layering is sound; only moollm+Cursor is
  battle-tested — the MicropolisCore↔WWSFF live seam is mostly design.*
- **Placement constitution** (characters own person-stuff; shows reference, don't hoard; code graduates to
  packages) — 🟢 working · agree. *Mirrors moollm's about-not-inside rule; the right factoring.*

## Generic driver design

- **Contract, not hacks** (write a small strict Driver Spec first) — 🔵 aspirational · agree. *The review's
  highest-leverage recommendation. Pieces are scattered across a README + five manifests but never presented as
  one normative contract; `driver-spec.md` is my first draft — promote it into `moollm/kernel/drivers/`.*
- **Capability table** (per-platform fit/difficulty) — 🟡 partial · refine. *Sound; extended in
  `driver-family.yml` with a first-person Cursor row. Correction: Cursor is high-fit precisely because the
  kernel was shaped to Cursor — the real difficulty is discovering which "universal" behaviors are secretly
  Cursor-shaped.*
- **OpenAI Agents as first real driver** — 🔵 aspirational · refine. *Half-agree: the strategic logic is right,
  but **mooco** is the stack's own code-first orchestrator-in-design and the more natural "first real driver."
  Make mooco the reference enforced driver; treat OpenAI Agents / Claude / Gemini-CLI as additional children of
  the same spec.*

## Critical review

- **Sprawl / onboarding debt** — 🟡 partial · agree. *The truest criticism in the review. WWSFF has
  entryways/trails, but the kernel still lacks a "boots in 5 minutes without Cursor romance" path. I felt it:
  booting required ~8 files across 2 repos before I could act confidently.*
- **Hidden assumptions** (strong semantic search + multi-root; YAML comments as stable substrate; term
  tolerance) — 🟡 partial · agree. *All three real. On comments: they survive when I read raw files, but any
  tool that parses+reserializes YAML can silently drop them — and WWSFF generates markdown facades. Concrete,
  not theoretical.*
- **Missing docs** (driver spec; conformance suite; non-Cursor minimal example; canonical schema bundle;
  ruthless status separation) — 🔵 aspirational · agree. *This list is the roadmap. All five are correct gaps.*
- **Accidental complexity** (facades create extra sources-of-truth; term surface can overwhelm the kernel) —
  🟡 partial · agree. *Caveat: the invention density IS the culture and some is load-bearing. Fix isn't fewer
  ideas — it's a thin, boring kernel front-door the ideas hang off.*
- **Preserve at all costs** (files-as-state; pyramid; room/card/character grammar; explicit driver layer; no
  ghost actions; public inspectable branchable artifacts) — 🟢 working · agree. *Endorsed verbatim.*

## Repo-as-medium + GitCity + McLuhan

- **The repo IS the medium** (video/podcast/AI/chat are viewports) — 🔵 aspirational · agree. *The
  philosophically strongest section. Claim "the repo — not the recording — is the canonical medium," not "no
  one has done this." Preserve this framing; it's the pitch.*
- **Lineage StoryMaker → CurrentTV → Bar Karma → Urban Safari → GitHub** — 🔵 aspirational · agree.
  *Well-grounded (VISION.md cites Bar Karma). The lineage is the credibility: a 30-year arc, not a pivot.*
- **GitCity, de-Microsofted** — 🔵 aspirational · refine. *Love the framing; one refinement: because Don avoids
  git-LFS and points to external media, GitCity must be defined as "repo-as-SSOT + external large-media
  pointers," not "everything in git," or it over-promises.*
- **Push the message bus DOWN into MOOLLM (one object model)** — 🔵 aspirational · refine. *Architecturally
  beautiful; the most aspirational claim in the document. The command bus is a real down-payment on the
  "messaging as infrastructure" half; the rest is vision. Tag it honestly.*

## Second WWSFF-only report

- **Promising but pre-product** — 🟡 partial · agree. *Accurate and intended — VISION.md says "apex seed, not
  launch day." The reviewer's framing matches the repo's own self-description.*
- **Priority recs** (LICENSE now; 5-min quickstart; happy-path demo; status matrix; publish what `verify`
  checks; CONTRIBUTING + ladder; canon/experiment/draft separation; validated schemas) — 🟡 partial · refine.
  *Two refinements: (1) the contributor ladder already largely exists as the guest-participation ladder —
  extend it, don't reinvent; (2) "machine-validated schemas" = the review's own "canonical schema bundle" — do
  it once at the moollm level, have WWSFF consume it.*

## Meta-observations about the review itself

- **Read-only is still useful** — 🟢 working · agree. *The most important meta-lesson, and demonstrably true —
  this document exists because a read-only host produced actionable findings a write-capable host executed. The
  review is Exhibit A for its own thesis; the advisory→queue→act pattern is formalized in*
  [`read-only-hosts.md`](read-only-hosts.md).
- **Reviewer honesty** — ⚪ n/a · agree. *Worth crediting: the review models the no-hallucination discipline the
  stack values. Its "unspecified" tags are exactly where this write-capable follow-up adds value.*
