# Onboarding glossary — the boring front door

> The ramp for human newcomers. One line per term, plain language, no cleverness. Where a term is a
> **heizronym** (multiple valid expansions on purpose — see
> `[NOMENCLATURE-HEISENBERGIAN-ACRONYMS.md](NOMENCLATURE-HEISENBERGIAN-ACRONYMS.md)`) it's marked ⊛ and you
> are told: you don't have to pick one reading.
>
> This exists because the stack's nomenclature is a real onboarding cost for people (LLMs get most of it free
> from training). If you read only one page before contributing, read this one.

---

## The names you'll hit first


| Term                       | One-line plain meaning                                                                                                                                    | Notes                                                                                                                                                                                                                          |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **MOOLLM** ⊛               | The kernel/OS these repos boot: a portable "cognitive filesystem" where directories are places, files are objects, and skills are abilities an LLM loads. | Soft-official front door: **"Microworld Object-Oriented LLM"** (literally *MOO + LLM* — a MUD-style object world an LLM inhabits). No single *canonical* expansion — that's intentional; several domain readings are co-valid. |
| **MOO**                    | A text-world lineage (multi-user object-oriented worlds) MOOLLM borrows its "rooms and objects" feel from.                                                | The MUD/MOO tradition.                                                                                                                                                                                                         |
| **driver**                 | The adapter that lets MOOLLM run on a specific host (Cursor, ChatGPT, Claude Code, mooco). Maps MOOLLM's ideas onto that host's real tools.               | See `[../driver-spec.md](../driver-spec.md)`.                                                                                                                                                                                  |
| **skill**                  | A folder that packages a capability: how and when to use it, plus any code. LLMs "load" skills like tools.                                                | Has a `CARD.yml`, often a `SKILL.md`.                                                                                                                                                                                          |
| **CARD.yml** ⊛             | The short interface file for a skill: what it does, when to use it, what it can do.                                                                       | Read as index card / trading card / business card — all true at once.                                                                                                                                                          |
| **K-line** ⊛               | A name that, when mentioned, "switches on" a whole cluster of related knowledge.                                                                          | Minsky's term (1980). MOOLLM uses it for semantic activation + YAML anchors.                                                                                                                                                   |
| **ambient skill**          | A skill that's always on in the background, shaping behavior without being explicitly called (e.g. the "no AI slop" style rules).                         | Injected into context automatically.                                                                                                                                                                                           |
| **semantic image pyramid** | The rule for how much to read: GLANCE → CARD → SKILL → README, coarse to fine, only going deeper when you need to.                                        | Saves context/attention.                                                                                                                                                                                                       |
| **YAML Jazz**              | MOOLLM's writing style where the *comments* in a YAML file carry real meaning for both humans and LLMs, not just decoration.                              | Comments are data.                                                                                                                                                                                                             |
| **repo-as-medium**         | The idea that the git repository itself is the real artifact/medium; video, chat, and AI are just windows onto it.                                        | See `[../framing/FRAMING-REPO-AS-MEDIUM.md](../framing/FRAMING-REPO-AS-MEDIUM.md)`.                                                                                                                                            |




## MicropolisCore / simulation terms


| Term                      | One-line plain meaning                                                                                                                             |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **MicropolisCore**        | The open-source SimCity-derived city simulator (C++ engine compiled to WASM) plus its web app.                                                     |
| **command bus**           | The single, inspectable channel through which *all* changes to the simulation flow — so every action can be checked, approved, logged, and undone. |
| **Micropolis Federation** | The planned network/site where people share and download city content, hosted officially by Don, self-hostable by schools.                         |




## mooco / future-runtime terms


| Term                                             | One-line plain meaning                                                                                                                                                                                                             |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **mooco** ⊛                                      | "MOO Custom Orchestrator" — the future runtime that will *own* the whole LLM loop (unlike Cursor, which MOOLLM only advises). The flagship driver. See `[../mooco/MOOCO-DRIVER-DEEP-DIVE.md](../mooco/MOOCO-DRIVER-DEEP-DIVE.md)`. |
| **CG / Context Gatherer / Treasure Collector** ⊛ | mooco's engine that finds the *relevant* knowledge and pulls it into attention — the mirror-image of a garbage collector (which finds the *dead* stuff and frees it). Backwards GC.                                                |
| `why` **convention**                             | Every tool/action carries a short reason. In mooco it's *required and enforced*; on Cursor it's a good habit.                                                                                                                      |
| **cursor-mirror / mooco-mirror**                 | Tools that read back past sessions (from Cursor's or mooco's stored history) so you can reflect on what happened.                                                                                                                  |
| **moorl / moo skill**                            | A way to address files across repos with `moollm://…` URLs, fetched on demand — think "URLs for the whole federation of repos."                                                                                                    |




## WWSFF / show terms


| Term                                  | One-line plain meaning                                                                                                                                                                                           |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **WWSFF / Will Wright Show For Food** | The public "repo show" format + methodology: build these systems in the open with invited guests as episodes/artifacts.                                                                                          |
| **Repo Show**                         | A show whose canonical form is a git repo — episodes are commits/PRs, not just videos.                                                                                                                           |
| **TicketPR**                          | Audience participation done as a structured pull request: propose a change, it gets reviewed/approved like any PR.                                                                                               |
| **heizronym**                         | A name with several valid meanings on purpose (MOOLLM, UBIK), selected by context. You don't have to choose one.                                                                                                 |
| **grounded acronym**                  | An acronym that "bottoms out" (NASA) — the opposite of a *recursive* acronym (GNU = "GNU's Not Unix").                                                                                                           |
| **recursive auto-antonym**            | A name that flipped over time into a self-referential *negation* of its old meaning: YAML ("Yet Another Markup Language" → "YAML Ain't Markup Language"), WINE ("WINdows Emulator" → "Wine Is Not an Emulator"). |


---



## If you're a brand-new contributor, in order

1. Read this glossary.
2. Read `[../README.md](../README.md)` (what this whole review bundle is).
3. Read `[../framing/FRAMING-REPO-AS-MEDIUM.md](../framing/FRAMING-REPO-AS-MEDIUM.md)` (the core idea in one sitting).
4. Then follow the semantic image pyramid: GLANCE/CARD before SKILL/README, everywhere.

You will not understand every heizronym on day one. That's expected. Hold the ambiguity; it resolves as you
work.