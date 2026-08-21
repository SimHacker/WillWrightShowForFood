# Korz′ proof of concept — cauldron

> Status: **draft** — Phase 1 (melting). Do not execute anything from this file
> directly; wait for LADLE to produce playbooks.
>
> Started: 2026-08-21. Skill: moollm `skills/cauldron` (MELT).
> Design source: [korz-prime.md](korz-prime.md). This monolith plans the
> **runnable, unoptimized proof of concept**: YAML jazz schemas defined by
> example, a deterministic interpreter over a git repo substrate, and the
> LLM ping-pong loop for everything the strict tier refuses.

---

## 1. Current state: what is wrong

korz-prime.md is ~1200 lines of design with zero running code. Every claim
about the strict tier — guards match decidably, ambiguity errors, dispatch
traces as plain text, doesNotUnderstand promoted to peer dispatcher — is
currently prose. The Self prototype needed an image and an IDE; Korz′ claims
it needs neither, only files, git, and a model. That claim is testable and
untested.

The honest framing of the bootstrap: **IDE-less is aspirational; the actual
IDE is Cursor.** The LLM half of the two-dispatcher semantics arrives for
free as the agent in the editor. That is not cheating — it is the design:
the strict engine is a program, the soft dispatcher is whoever is reading
the events, and today that reader lives in the Cursor chat pane.

Precedent for the loop already exists in this ecosystem: the MOOLLM
adventure compiler ping-pongs between deterministic traversal/validation
(emit warnings and errors as text) and LLM passes that translate prose into
code the JS/Py engine can run, iterating until the model validates. The
Korz′ PoC is the same loop with dispatch instead of adventure traversal.

## 2. Target model

Two processes, one repo, ping-pong via files:

1. **The strict engine** (deterministic, boring, proud of it) scans the
   soup — YAML jazz slot files in a directory tree — executes sends,
   writes traces, and on any failure of decidability emits an **event
   file**: `doesNotUnderstand`, `ambiguous`, `malformed`, `unknownDimension`.
   It never guesses. It exits 0 having reported honestly.
2. **The LLM** (in Cursor) reads open events, does what the strict tier
   cannot — writes the missing slot, resolves the ambiguity by adding a
   guard, translates a prose slot into code, or declares the send out of
   scope — commits, and re-runs the engine. Repeat until the events
   directory is quiet.

The engine is also the **round-trip custodian**: it may rewrite values but
must preserve comments and, as far as practical, formatting. Comments are
semantic (YAML jazz); losing one is data loss.

git supplies the rest: history is the time dimension, commits are the write
barrier, PR review is the human-and-agent-in-the-middle integrity check.

## 3. Preliminary schemas, by example

Schemas are defined **by example plus comments**, not by JSON Schema — the
examples in this section are normative until M1 hardens them. All engine
I/O must round-trip these files comment-intact.

### 3.1 DIMENSIONS.yml — the dimension registry

```yaml
# DIMENSIONS.yml — names the dimensions this soup dispatches on.
# The engine treats unknown dimensions in guards as an `unknownDimension` event.
dimensions:
  character:          # who acts — the Zork/Sims "me"
    kind: tree        # values form a hierarchy; enables character-parent fall-through (M4)
    root: characters/
  place:
    kind: tree
    root: rooms/
  mood:
    kind: enum
    values: [grumpy, sunny]   # open enum — a novel value is doesNotUnderstand fuel, not an error
  time:
    kind: ordered     # spine is git history; PoC treats it as opaque labels until M4
```

### 3.2 Slot files — the sea

```yaml
# greet.slots.yml — every slot that answers the message `greet`.
# File-per-message is a convention, not a rule; the file boundary is chrome.
slots:
  - guard: {character: troll, place: bridge}
    value: "None shall pass!"            # data slot: dispatch returns the value

  - guard: {character: troll, place: bridge, mood: sunny}
    value: "Fine day for a toll, eh?"    # 3 dims > 2 dims: wins when mood matches

  - guard: {character: troll}
    method:                              # code slot: the strict tier executes this
      lang: js
      params: [traveler]
      body: return traveler.gold >= 5 ? "pass, friend" : "SPLASH";

  - guard: {character: troll, mood: poetic}
    prose: |                             # prose slot: strict tier CANNOT run this —
      The troll waxes lyrical about      # emits a `needsCrystallization` event
      bridges he has known.              # asking the LLM to translate prose → method
```

### 3.3 Sends and traces

```yaml
# sends/0007-greet.send.yml — a send is a file; drop it in, run the engine
send: greet
context:
  character: troll
  place: bridge
  mood: grumpy
```

```yaml
# sends/0007-greet.trace.yml — written by the engine; append-only sibling
send: greet
matched: {slot: "greet.slots.yml#/slots/0", specificity: 2}
considered: 4
result: "None shall pass!"
```

### 3.4 Events — the flare the strict tier fires

```yaml
# events/0012-doesNotUnderstand.yml
event: doesNotUnderstand
send: serenade
context: {character: troll, place: bridge}
nearest:                       # engine's best forensics, no interpretation
  - {slot: "greet.slots.yml#/slots/2", note: "message differs, guard matches"}
ask: |
  No slot answers `serenade` under this context. Write one, alias
  serenade -> greet, or mark it out of scope.
status: open                   # LLM flips to `resolved`, adds `commit: <sha>`
```

`ambiguous` events carry the tied slots; `needsCrystallization` carries the
prose slot; every event has `status: open|resolved|declined` so the events
directory doubles as the work queue and the audit log.

## 4. Language decision

**TypeScript, with [`yaml`](https://eemeli.org/yaml/) (eemeli's) as the
parser.** Confidence: 85%.

- Comment round-trip is the binding constraint, and eemeli's `yaml` is the
  best *programmatic* comment API of the candidates: the Document/AST keeps
  `commentBefore`/`comment` on every node, is designed for parse-edit-
  stringify workflows, and exposes a CST layer when byte-exactness matters.
- One language spans the whole arc: node CLI engine now, browser demo later,
  and the WebGPU crystallization target korz-prime already names — camera
  in the loop, no port required.
- Dynamic enough for soup semantics, typed enough to encode the schemas.

Runners-up, honestly assessed:

- **Python + ruamel.yaml** — ruamel's default round-trip fidelity is
  excellent (best-in-class at *preserving*), but its comment-*editing* API
  is awkward and under-documented (`ca` attribute surgery). Python stays in
  the picture as the PyTorch crystallization head; the engine may grow a
  twin, and the troll has two heads for exactly this reason.
- **Go + yaml.v3** — has Head/Line/FootComment on nodes but round-trip
  formatting fidelity is patchy, and Go is stiff clay for dispatch
  experiments. Declined.
- **PDP-7 assembly** — declined; resubmit as a Code Bakelite acquisition
  around 2045.

## 5. Comment round-trip discipline

- **M0 gate, before any dispatch code:** load → save with no edits must be
  byte-identical (or a documented, minimal set of canonicalization diffs)
  across a corpus of jazz-heavy files harvested from moollm and this repo.
- The engine's writes are **surgical**: touch the value node, leave every
  comment node alone. New machine-written keys (trace fields, `status`
  flips) get their own comments explaining themselves.
- If the high-level API proves lossy, drop to the CST. If that proves
  lossy, the persistence layer diffs at the text level and refuses to save
  a file whose comments shrank — robust-first: degrade to read-only and
  emit an event rather than eat a comment.

## 6. Milestones

| # | Deliverable | Proves |
|---|---|---|
| M0 | Round-trip harness + corpus test | comments survive the custodian |
| M1 | Data-slot dispatch: specificity = guard dimension count, ties → `ambiguous` event | strict tier exists |
| M2 | Event loop demo in Cursor: send `serenade`, engine flares, LLM writes the slot, engine answers | the ping-pong |
| M3 | Method slots (js bodies via `node:vm`), `needsCrystallization` prose → code | two tiers, one soup |
| M4 | Tree-dimension fall-through: guard matches value or ancestor (sparse shadow delegation) | dimension-parents |
| M5 | Troll-bridge adventure on the Zork five dimensions | it plays |
| M6 | Crystallization spike: compile a rule-table subset to a lookup table or WGSL | korz-prime §crystallization, live |

Repo: start as `korz-poc/` inside a sandbox, graduate to its own GitHub
repo at M2 when the ping-pong is demonstrable.

---

## Appendix A. Design wisdom and conventions (cross-cutting)

- **The engine never guesses.** Every failure of decidability is an event,
  every event is a file, every file is the LLM's inbox. (Adventure
  compiler discipline.)
- **Comments are data.** A serializer that loses a comment has corrupted
  the database.
- **The file boundary is chrome.** Slot identity is `path#/slots/N`, not
  the file; reorganizing files must not change dispatch.
- **Traces beside sends.** Debugging symmetric dispatch means reading the
  trace file, not stepping a debugger — korz-prime's IDE-audit table, made
  real.

## Appendix B. Questions still awaiting a decision

### B.1 Already resolved (kept here for audit)

- **Language:** TypeScript + eemeli `yaml` (§4). Python twin deferred to
  the PyTorch crystallization milestone.
- **Schema style:** by example + comments, normative examples in §3, no
  JSON Schema until the examples stabilize.

### B.2 Still open — not blocking

- **Specificity metric.** Default: count of guard dimensions; more is more
  specific; equal counts with different dimensions = tie = `ambiguous`.
  Alternative: per-dimension precedence order (Self-style parent
  priorities). Default stands until M4 forces the issue.
- **Slot granularity.** Default: file-per-message with a `slots:` list;
  also accept one-slot-per-file for big method slots. Engine must treat
  both identically (file boundary is chrome).
- **Where does context come from in M5?** Default: the send file carries
  the full context explicitly; ambient context assembly (cwd-as-place,
  git-author-as-character) is a later parlor trick.
- **Sandboxing method slots.** Default: `node:vm` with no require, PoC
  honor system. Real isolation is out of scope until someone besides us
  runs a soup.
- **Event numbering.** Default: zero-padded sequence per directory; git
  history disambiguates collisions.

### B.3 New questions raised by later deep-dives

*(empty at MELT)*

### B.4 Questions confirmed or declined during drafting

- **Declined:** inventing a comment-preserving YAML dialect of our own.
  Two mature libraries exist; the PoC's job is dispatch, not parsing.

### B.5 Convention for tracking questions going forward

Every substantive question gets logged here with a default. Resolutions
move from B.2/B.3 to B.1; nothing is deleted. Drafting-phase confirmations
move to B.4.
