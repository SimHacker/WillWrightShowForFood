# Read-only hosts: the advisory → queue → act handoff

> **Thesis:** a read-only run (Deep Research, ChatGPT without workspace write, Cursor Ask-mode, a CI
> analyzer) is not a dead end. If it writes its findings into a **structured queue** with a schema and
> statuses, a **write-capable** driver can pick them up, gate them through the command bus, and act. This
> turns "observer" hosts into first-class participants without giving them write access to the world.
>
> **This document is self-demonstrating.** The ChatGPT review under harvest was produced by a read-only
> host; this bundle is a write-capable host acting on it. The pattern already works by accident — here we
> make it deliberate infrastructure.

---

## The problem the review surfaced

Deep Research / ChatGPT could read the repos (via rendered GitHub pages) but could not clone, run, or
mutate. Its own words: *"I can't responsibly produce a deep evaluation… I don't want to pretend I've read
code that I haven't"* and the WWSFF file inventory tagged **"unspecified until inspected."** That honesty is
correct behavior (robust-first, no-hallucination) — but left as-is, the value evaporates into a chat log.

Two failure modes to avoid:
1. **Ghost advice** — a read-only host describes changes as if made. Forbidden (no-ghost-actions).
2. **Lost advice** — good findings die in a transcript nobody re-ingests.

The fix is the same shape as MicropolisCore's command bus: **separate proposing from executing**, and make
the proposal an inspectable object.

---

## The pattern

```
READ-ONLY HOST                      QUEUE (git, inspectable)              WRITE-CAPABLE HOST
(Deep Research,     ── writes ──▶   findings/<topic>/<id>.finding.yml  ──▶  (Cursor, mooco, Claude Code)
 ChatGPT, Ask-mode)                 status: proposed                        reads, verifies on real FS,
                                                                            routes through command bus,
                                    status: accepted | rejected | acted ◀── patches files, logs intent
```

- The read-only host emits **findings**, never edits. Each finding is a small YAML object: a claim, an
  evidence pointer, a proposed action, a confidence, and `status: proposed`.
- The queue lives **in git** (or a PR). It is inspectable, forkable, reviewable — the medium is the repo,
  exactly as the repo-as-medium thesis demands. A finding is a **TicketPR for machines**: same move WWSFF
  makes for audience questions, applied to AI analysis.
- A write-capable driver reads findings, **verifies each against the actual working tree** (the read-only
  host only saw rendered pages, so verification is mandatory — this is precisely where the `license-missing`
  and `unspecified` items get upgraded or corrected), then acts through the normal governed loop
  (Observe→Explain→Preview→Propose→Approve→Execute→Log). It updates `status` and back-links the commit.

---

## Finding schema (draft)

```yaml
# findings/<topic>/<slug>.finding.yml
finding:
  id: read-only-2026-07-05-license
  produced_by: "deep-research"          # a driver-family child, tier ≤2
  produced_at: 2026-07-05
  claim: "No LICENSE file in repo root; reuse rights unspecified."
  evidence:
    - { kind: rendered_page, ref: "github.com/SimHacker/WillWrightShowForFood (sidebar: no license badge)" }
  confidence: 0.6                        # read-only inference, NOT filesystem-verified
  proposed_action:
    op: write
    target: LICENSE
    why: "Unblock outside contribution/reuse/sponsorship (review priority #1)."
  requires_verification: true            # MUST be checked on the real FS before acting
  status: proposed                       # proposed → accepted | rejected | acted | superseded
  # ── filled in by the write-capable host ──
  verification: null                     # e.g. "confirmed absent 2026-07-05 by Glob LICENSE*"
  resolution: null                       # commit sha / reason for rejection
  acted_by: null                         # driver-family child, tier ≥4
```

Minimal, YAML-Jazz, comments carry intent. `confidence` + `requires_verification` encode the read-only
host's epistemic limits so the writer knows what to double-check. This is the same discipline `harvest.yml`
applies by hand (e.g. the `license-missing` item is tagged `refine / verify` with empty `evidence`).

---

## Why this is more than a convenience

1. **It makes every host useful at its real tier.** A Tier-2 host contributes findings; a Tier-4/6 host
   contributes edits. Nobody has to pretend to be something they are not (driver-spec.md §6 honesty rule).
2. **It preserves provenance.** Each change traces to a finding traces to a read-only run. The chain is
   inspectable — no ghost actions, full lineage. This is the append-only/no-ghost-actions ethic extended
   across the advisory/enforced boundary.
3. **It is the same primitive three times.** MicropolisCore's command bus (world mutation), WWSFF's TicketPR
   (audience participation), and this findings queue (cross-host analysis) are one pattern: *propose an
   inspectable object; a governed step executes it.* The stack should name this pattern once and reuse it.
   Candidate name: **Proposal Object** (command / ticket / finding are its three faces).

---

## Concrete next step

Add a tiny `findings/` convention to the Driver Spec and one worked example:
- take three real findings from this very review (`license-missing`, `resolver-is-behavioral-not-code`,
  `tiny-reference-workspace-missing`),
- write them as `.finding.yml`,
- have a Cursor session verify + act on one end-to-end,
- capture the boot+act trace as the reference for how read-only and write-capable drivers compose.

That worked example is small, high-signal, and doubles as a conformance demo for the read-only tier. Tracked
in [`roadmap.md`](roadmap.md).
