# MOOLLM skill K-lines — the operational magic words

> A **curated** field guide to the skill vocabulary that actually does work — not all 131 skills, just the
> **magic words** an operator needs: the imperative verbs you invoke, the tokens that gate behavior, and the
> handful of mental-model terms everything else hangs off. Each skill's **directory name is itself a K-line**
> (a name that activates a cluster of knowledge); the verbs in `ALL-CAPS` are the invocation tokens defined in
> the skills' `CARD.yml` / `SKILL.md`. Source of truth: `[skills/INDEX.yml](../../../../../Leela/git/moollm/skills/INDEX.yml)`
> (131 skills, dated 2026-07-03).
>
> How to read the rest: `GLANCE.yml` (is this relevant?) → `CARD.yml` (what can it do?) → `SKILL.md` (how?).
> This doc is the GLANCE across the operational subset.



## The mental model (know these first)


| K-line              | What it means                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| **moollm**          | the substrate itself; the "soul" skill — self-explanation, navigation, philosophy.                     |
| **skill**           | the meta-skill: how skills inherit, instantiate, compose. Read it to understand all others.            |
| **k-lines**         | Minsky's "names activate clusters of knowledge." The semantic backbone: a filename *is* an activator.  |
| **room**            | a directory *is* a context; navigation is movement; **presence activates content**.                    |
| **memory-palace**   | method of loci — directories are rooms, files are knowledge items you walk to.                         |
| **constructionism** | Papert: learn by building. The filesystem is a microworld; skills are constructions.                   |
| **prototype**       | Ungar's Self: **clone, don't instantiate.** Everything inherits by delegation, not classes.            |
| **yaml-jazz**       | comments are first-class semantic data (humans + LLMs + machines read different layers).               |
| **naming**          | **big-endian binding** — `MicropolisCity_HaightAshbury`, coarse→fine, so names sort and activate well. |
| **card**            | portable capability (index/trading/business/punch card at once); the CARD.yml middle of the pyramid.   |


The **semantic image pyramid** is the paging discipline: `GLANCE → CARD → SKILL → README`, coarsest first,
refine on demand. Its apex is idempotent (glance twice, same answer — see the `I → I` note in
`[NOMENCLATURE-HEISENBERGIAN-ACRONYMS.md](NOMENCLATURE-HEISENBERGIAN-ACRONYMS.md)`).

## The operational verbs (the magic words you actually type)


| Skill               | Magic words                                                                                 | What they do                                                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **play-learn-lift** | `PLAY` · `LEARN` · `LIFT`                                                                   | the core methodology: explore freely → notice patterns → crystallize into a reusable skill. "Jazz first, then standards."                                                           |
| **artifactory**     | `CREATE` · `READ` · `EDIT` · `DESTROY` · `PERSIST` · `INSTANTIATE` · `TIMELINE` · `COMPOSE` | the **Engine of Creation**: the CRUD + persistence + git-timeline substrate every other skill calls. `INSTANTIATE` = clone a prototype; `TIMELINE` = commit/branch/PR with a `why`. |
| **mount**           | `MOUNT on --mode grant                                                                      | afflict`·`UNMOUNT`                                                                                                                                                                  |
| **worm**            | `EAT` · `CHOMP` · `POOP` · `BARF` · `STICK-UP-BUM` (+ `MOVE-HEAD`/`MOVE-ASS`)               | a two-pointer reversible cursor for traversal and pipelines. "Every `EAT` has a `POOP`." Reversible basis = undo/redo, serialize/deserialize.                                       |
| **speed-of-light**  | (mode)                                                                                      | simulate **many turns inside one LLM call** — batch the loop instead of round-tripping.                                                                                             |
| **sister-script**   | (doctrine)                                                                                  | doc-first automation: **the script IS the documentation**; the top-of-file comment is the CLI's API.                                                                                |
| **honest-forget**   | tombstones                                                                                  | graceful forgetting: **summarize before you drop**, leave a tombstone so the gap is visible, not silent.                                                                            |
| **inventory**       | carry / **set down**                                                                        | carry lightweight pointers; **"set down = materialize."; instead of invisible cut/copy/paste to clipboard or drag-n-drop.                                                           |
| **self-repair**     | (checklist)                                                                                 | heal missing files / invalid state instead of crashing (see also `robust-first`).                                                                                                   |
| **return-stack**    | (continuation)                                                                              | navigation history; Self-style deoptimization — walk back where you came from.                                                                                                      |




## Governance & safety (the words that gate behavior)


| K-line                     | Magic word / token                                                                                | What it gates                                                                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **plan-then-execute**      | frozen plan + **approval gate**                                                                   | freeze a plan, get human sign-off before acting — the security seam.                                                                                                      |
| **artifactory / governor** | **PITM** (Player-in-the-Middle)                                                                   | destructive ops and rule changes require human approval; git is the undo; every artifact stamped with provenance.                                                         |
| **skill-snitch**           | `SCAN` · `AUDIT` · `SNITCH`                                                                       | static scan → deep audit → runtime surveillance of skill behavior (dual-use + bias detection).                                                                            |
| **skill-test**             | (runner)                                                                                          | per-skill structure + live tests; companion to skill-snitch.                                                                                                              |
| **trekify**                | **🖖** flag · `MASK` · `UNMASK` · `SCAN` · `PROBE`                                                | privacy through technobabble: mask secrets/infra with a visible `🖖` marker (explicit, never hidden).                                                                     |
| **ontology**               | **being tags** (`real` · `fictional` · `historical` · `mythic` · `abstract` · `robot` · `animal`) | composable ethics tags; the **most restrictive** composed tag wins.                                                                                                       |
| **hero-story**             | `HERO-STORY` protocol                                                                             | activate a *tradition* not a private person (the "YAML-Coltrane" safe-reference rule).                                                                                    |
| **no-ai-***                | the **NO-AI™ suite**                                                                              | ambient hygiene: `slop` (syntactic), `gloss` (semantic), `sycophancy` (social), `hedging` (epistemic), `moralizing` (ethical), `bias` (cognitive). Always-on constraints. |
| **thoughtful-commitment**  | (commit)                                                                                          | git commits that capture **intent and reasoning**, not just a diff.                                                                                                       |




## Orchestration & introspection


| K-line                          | What it means                                                                                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **mooco**                       | **MOO Custom Orchestrator** — the sovereign host that runs MOOLLM with explicit context, safe sandboxed tools, and skill portability (see `[../mooco/](../mooco/)`). |
| **cursor-mirror**               | deep IDE introspection: tool provenance, timeline, post-mortems ("watch yourself think").                                                                            |
| **mooco-mirror**                | the cross-orchestrator version — compare MOOCO and Cursor traces at higher fidelity.                                                                                 |
| **coherence-engine**            | the LLM-as-orchestrator: maintains consistency across a simulation (the "CG"/context-gathering heartbeat).                                                           |
| **session-log** / **skill-log** | append-only audit trail (whole session) and per-skill structured logs under `.moollm/`.                                                                              |




## Sims mechanics (Will Wright's wisdom, as invokable K-lines)


| K-line               | Magic word                     | What it means                                                                                                                   |
| -------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **advertisement**    | scored broadcast               | objects **advertise** actions with a relevance score → plug-in behavior architecture (the Sims trick); selected from pie menus. |
| **needs**            | **lowest need wins**           | decaying motivations drive behavior; the most-starved need selects the next action.                                             |
| **action-queue**     | `URGENT` jumps the line        | a task scheduler where urgent tasks preempt.                                                                                    |
| **economy**          | **MOOLAH** · karma · favor     | parallel non-fungible currencies (money, reputation, obligation).                                                               |
| **simulator-effect** | "implication beats simulation" | Wright's insight: **imagination renders the detail** — ship seeds, not full simulations.                                        |




## Communication


| K-line        | What it means                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------- |
| **postal**    | universal addressing — mail to files, YAML keys, even functions.                                  |
| **soul-chat** | everything speaks: **YAML comments as inner monologue** (a character's thoughts live in the `#`). |




## See also

- `[NOMENCLATURE-ONBOARDING-GLOSSARY.md](NOMENCLATURE-ONBOARDING-GLOSSARY.md)` — plain one-liners for the *acronyms* (MOOLLM, CARD, mooco, MOOFS…).
- `[NOMENCLATURE-HEISENBERGIAN-ACRONYMS.md](NOMENCLATURE-HEISENBERGIAN-ACRONYMS.md)` — why these borrowed terms are chosen (K-line leverage) and stay polysemous on purpose.
- `[skills/INDEX.yml](../../../../../Leela/git/moollm/skills/INDEX.yml)` — the full 131-skill registry this curates from.

