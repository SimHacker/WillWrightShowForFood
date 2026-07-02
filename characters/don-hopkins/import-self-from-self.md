# import self from self — MOOLLM's Self object model

The MOOLLM constitution effectively declares:`import self from self`-- import Self's prototype-based object model **from Self itself**, not from Java's or JavaScript's castrated projections.

**Credit:** **David Ungar** (with Randall Smith) was very open and influential — Don says he deserves a huge amount of credit for where we are. Self doesn't run on everybody's phone; **in spirit it does** — prototype objects, adaptive JIT, mirrors, and simplicity live in JS, HotSpot, MOOLLM, and the stacks we actually ship.

## What that means

- **Directories are rooms; YAML files are objects; skills are inheritable prototypes** (Sims-style, LambdaMOO-style).
- **LLMs** (pretending or being — jury out) JIT a Self-simple VM — superset of Java/JS's bastardized copies.
- **Two inheritance modes:**
  1. **Files on disk** — tangible skills following MOOLLM naming; cost = tokens across GLANCE → CARD → SKILL → README.
  2. **Names in language** — mix in well-known APIs, protocols, concepts, or people by naming them; pointers into training data, not invented lore. *Most token-efficient.*

LLMs as universal translators, intention compilers, optimizers — describe the ideal VM verbally; lean into what the model already knows, by k-line reference.

## Self pun stack (load-bearing)

- **self-interest!** — original Self mailing list; Don was on it from the early days
- **self-ish** — Don's prototype config systems (Leela, MOOLLM shape)
- **(oops)** — triple pun: JS mistake; Owen's OOPS: Object Oriented PostScript
- **Reflecting on Self: Narcissa's Mirror** — dream Repo Show with David Ungar

**Guardrail:** inherit ideas, skills, style — never impersonate the person ([representation-ethics](https://github.com/SimHacker/moollm/tree/main/skills/representation-ethics)).

→ Full yaml: `[career/lineage.yml](career/lineage.yml)` (`import_self_from_self`, `self_pun_stack`) · Trail: `[../../process/trails/send-code-not-commands.md](../../process/trails/send-code-not-commands.md)`