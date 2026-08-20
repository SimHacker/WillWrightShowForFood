# Korz′ (Korz-Prime): Korz for the Age of LLMs

A design sketch for the demo conversation. Premise borrowed from David
Temkin's **Declare**: design the language *from the start* for three
readers — humans, LLMs, and deterministic machines — instead of
retrofitting. Declare redid the UI declaration layer that way; this
sketch redoes the dispatch semantics. Prior art it leans on:
[korz-notes](korz-notes.md), the
[deep dive](sources/korz-paper-deep-dive-moollm-mapping.md),
[SELF-AND-MOOLLM](https://github.com/SimHacker/moollm/blob/main/designs/object-system/SELF-AND-MOOLLM.md),
[MOODY](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md),
[LATENT-SPACE-INHERITANCE](https://github.com/SimHacker/moollm/blob/main/designs/object-system/LATENT-SPACE-INHERITANCE.md).

The name, after Bourland's E-Prime: Korz minus the assumption that
dispatch must be decidable. Alternative naming scheme, via the
anagram: the deterministic tier is **Korz**, the LLM tier is **Zork**.
Korz compiles; Zork improvises.

## One semantics, two dispatchers

Keep the Korz model exactly: a sea of slots, guards over named
dimensions, sends dispatched symmetrically through an implicit
context, no receiver, no classes. Change nothing about *what* a
program means. Add a second executor:

| | Strict tier (Korz) | Soft tier (Zork) |
|---|---|---|
| Dispatcher | deterministic VM | LLM |
| Coordinate match | type/subtype, exact | semantic — "stormy" satisfies `weather: bad` |
| Guard language | decidable predicates | prose allowed ("when the player seems frustrated") |
| Multiple matches | unique most-specific or **error** | **sample** by relevance — or **blend** the matching slots |
| No match | doesNotUnderstand | **fall through to latent space** — improvise a slot from training |
| Slot body | code | code, prose, or both |

The two tiers are not rivals; they are **JIT tiers**. This is the
Self playbook run one level up. The LLM is the interpreter: slow,
expensive, handles everything, understands prose guards. The VM is
the optimizing compiler: fast, cheap, handles only slots whose guards
and bodies have been made decidable. Between them, two movements:

- **Crystallize** (compile up): a latent improvisation or prose slot
  that runs hot and stable gets rewritten — by the LLM, reviewed by a
  human — into decidable guards and executable body, and enters the
  strict tier. Speculative, like any JIT: the compiled slot carries
  the *envelope* of contexts it was crystallized from.
- **Deoptimize** (bail down): a send whose context leaves the
  envelope — a coordinate the compiled guard never saw, an ambiguity
  the lattice can't order — doesn't error. It bails to the model,
  which improvises, and the result is a candidate for
  re-crystallization. Deopt in Self rescued speed without losing
  semantics; deopt in Korz′ rescues *determinism* without losing
  meaning.

Crystallization already has a shipped precedent: the
[adventure compiler](https://github.com/SimHacker/moollm/blob/main/skills/adventure/ADVENTURE-COMPILER.md)
compiles adventure YAML — rooms, objects, guards — into deterministic
JavaScript and Python that runs standalone or tethered to an LLM for
creative decisions. The next step is a **Zork compiler** that emits
deterministic, executable **Korz** instead of (or as well as) JS and
Python — the strict tier's slot space as a compilation target, not
just a hand-authored one. Zork improvises, the compiler crystallizes,
Korz runs: the anagram becomes a toolchain.

Endosymbiosis, stated mechanically: the deterministic program lives
inside the model the way mitochondria live inside the cell, doing the
high-throughput metabolism, with gene transfer (crystallization) in
one direction and rescue (deopt) in the other.

Prior art for the tier philosophy, in one sentence of Vanessa
Freudenberg's (SqueakJS, on riding the JavaScript JIT rather than
fighting it): *"My plan is to do as little as necessary to leverage
the enormous engineering achievements in modern JS runtimes."*
Replace "JS runtimes" with "language models" and that is Korz′'s
soft tier ([her room](../vanessa-freudenberg/README.md), her
[jit notes](../vanessa-freudenberg/sources/jit-notes/) — which cite
the Hölzle–Chambers–Ungar deoptimization paper directly).

**What would Vanessa think of this?** A question for her friends, not
for the model — memorial mode applies to design discussions too. We
don't ask an LLM to simulate her; we ask the people who knew her to
remember her and imagine what she would say, to remember what she
*did* say, and to go over her notes, papers, code, and live
environments — the [jit notes](../vanessa-freudenberg/sources/jit-notes/)
with their runnable mockups, the
[DLS '14 paper](https://github.com/SimHacker/moollm/blob/main/designs/prestoration/sources/Freudenberg-2014-SqueakJS-memorial-edition.pdf),
SqueakJS itself still live in the browser. She had strong documented
opinions exactly here — she chose readable, debuggable, *fun* JS over
a WASM rewrite, and rode the platform's JIT instead of fighting it.
Would she read the soft tier as the same bet one level up, or as the
thing she warned about — losing readability and flexibility to an
opaque optimizer? Her friends get to argue it; she gets quoted, not
synthesized. A beat for the
[memorial arc](../../repo-shows/remembering-vanessa-freudenberg/).

## The surface: slots are data

No new syntax. Slots are YAML; the sea is a directory tree; git is
the persistence, history, and diff of the sea. One artifact, three
readings: the machine parses structure, the human reads names and
comments, the LLM reads everything — comments are load-bearing in the
soft tier (YAML jazz) and free in the strict tier.

```yaml
# sea/troll/greet.yml — three slots, one selector
greet:
  guards: {rcvr: troll*, world: zork}      # constrained × 2
  do: The troll brandishes his axe and blocks the passage.

greet:
  guards: {rcvr: troll*, world: adventure}
  do: The troll demands payment before you may cross the bridge.

greet:
  guards:
    rcvr: troll*
    mood:              # bare name — bind whatever mood is present
  do: |                # prose body: soft tier only, for now
    Greet in a way that fits {mood}; lead with menace if provoked,
    grudging respect if the visitor has beaten you before.
```

The strict compiler takes the first two, refuses the third (prose
body, unbounded coordinate), and the refusal is the *partition
criterion*: what compiles is exactly what has been made decidable.
The third runs on the model until its observed behavior crystallizes
into per-mood variants — or never does, and stays soft forever, which
is fine.

**Containment is a guard.** A slot file living under `worlds/zork/`
gets `world: zork` for free from its address — the directory tree
supplies default coordinates the way MOOLLM's typed container
directories supply inherited metadata. Location is a guard; moving a
file re-guards it; `git log` is the time dimension.

**Names are inheritance.** Dimensions and coordinates are ordinary
words — `mood`, `weather`, `era`, `trust` — and in the soft tier a
word is a K-line: `mood: gezellig` imports everything the training
data knows about gezelligheid, no definition required. The strict
tier treats the same word as an opaque symbol. One name, prepaid
latent semantics above, free interning below.

## What the soft tier adds to Korz's open problems

The paper's future work asked for dimensions that alter the
interpreter. Take that seriously and standardize three:

- **`ambiguity:`** — what to do on multiple most-specific matches:
  `error` (Korz), `arbitrary` (Linda), `sample` (LLM), `blend` (LLM
  method combination: merge the matching bodies — the composition
  operator no deterministic dispatcher can offer, because it requires
  understanding what the bodies *mean*). `blend` already has a running
  specimen: the
  [Cross-Platform Troll](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/troll)
  can front one mind — zork-mind or adventure-mind — or blend between
  them, mixing the minds together with different **weights**. The
  weights are just more context bindings: `{world: {zork: 0.7,
  adventure: 0.3}}` turns a coordinate into a distribution, dispatch
  into a mixture, and the sample/blend distinction into a continuum —
  sampling is blending with all the weight on one slot.
- **`temperature:`** — how adventurous sampling and improvisation may
  be. Ambient; a room can set it (MOODY). Zero recovers determinism:
  strict Korz is the corner case Korz′ reaches at temperature 0 with
  decidable guards.
- **`provenance:`** — who wrote this slot (human, model, session,
  date) and how trusted it is. Korzybski's time-binding as a
  dimension; also the mechanism for *defaults without rules* — a
  well-provenanced slot wins ties without ever becoming mandatory.

And the IDE problem — "what does this code do in all contexts?" was
Korz's hardest usability question — inverts: the soft tier's mirror
is conversational. Ask the model to cut any subjective plane through
the sea and narrate it. The disco ball talks.

## What each reader gets

- **Humans** read YAML files with English names and jazz comments,
  diff them in git, and review crystallizations like pull requests.
- **LLMs** read the same files as activations (names are K-lines,
  comments are semantics), write new slots as data not code, execute
  the soft tier natively — MOOLLM already runs this loop for the
  Selfish prototype model; Korz′ just gives the dispatch a guard
  algebra.
- **Machines** parse the structure, compile the decidable subset,
  and run it fast, deterministically, offline — with deopt as the
  escape hatch instead of a crash.

## Testing it

The experiment ladder for all of this —
[KORZ-LLM-EVALS](https://github.com/SimHacker/moollm/blob/main/designs/KORZ-LLM-EVALS.md):
mechanical dispatch against a reference implementation (with an
anti-Korz control spec to separate rule-following from training
prior), soft matching against human panels, latent inheritance under
precedence rules, and the Sims advertisement economy as the
integration test — a poison buff that advertises "cure me" to anyone
guarded `skill: medical`.

## ASK David

- Does the JIT framing land? Crystallize/deopt is Self's speculative
  optimization applied to *semantics* — is that a continuation of the
  Self VM work or an abuse of it?
- Where does the tier boundary want to sit? His VM instincts on what
  "hot and stable enough to compile" means when the interpreter is a
  language model.
- Should `blend` frighten us? Method combination by semantic merge is
  either the answer to Korz's composition problem or a new kind of
  bug no debugger can see.
- Is prose-in-guards a feature or a moral hazard? (The strict tier's
  refusal to compile it is the only discipline on offer.)
