# Strongest & weakest ideas — the honest scorecard

> Friendly rendering of [`IDEAS-STRONGEST-AND-WEAKEST.yml`](IDEAS-STRONGEST-AND-WEAKEST.yml) (that file stays
> the source of truth). The good **and** the bad, ranked, no flattery. Ratings use the no-sycophancy
> calibration — **exceptional · good · adequate · flawed · wrong** — and the rule: *rate the idea, not the
> person; respect is not agreement.*
>
> Companions: [`stack-evaluation.md`](stack-evaluation.md) (longer prose) · [`harvest.md`](harvest.md) (full claim ledger).

## Strongest — the crown jewels (protect these)

### Repo-as-medium · **exceptional** · *working (framing) / partial (practice)*
The genuinely original core: a repo is a **world you enter/fork/improve**, not a file you watch. Reframes
everything downstream.
**Protect:** don't let episodes decay into "a video with a git URL." The medium is only as rich as its last
invitation to participate. → [`framing/FRAMING-REPO-AS-MEDIUM.md`](framing/FRAMING-REPO-AS-MEDIUM.md)

### Command Bus / no ghost actions · **exceptional** · *working*
AI safety through architecture: **every world mutation is an inspectable, approvable, logged, reversible
object.** Verified in code (`CommandBus.ts` + tests).
**Protect:** this is the ethical boundary between language and world. It generalizes to the **Proposal Object**
(PR / TicketPR / Finding). Never add a mutation path that bypasses it. → [`read-only-hosts.md`](read-only-hosts.md)

### Pull-request-as-message · **exceptional** · *working*
The McLuhan line that names what's new: a PR = social intent + proposed change + review + identity + history.
No prior medium had a **governed proposal as a native primitive.**
**Protect:** same primitive as the command bus + TicketPR — unify them; don't let them drift into three
vocabularies. → [`framing/FRAMING-GITCITY-MCLUHAN.md`](framing/FRAMING-GITCITY-MCLUHAN.md)

### Semantic image pyramid · **good** · *working (discipline) / aspirational (enforced paging)*
`GLANCE → CARD → SKILL → README` is a real, reusable LLM attention-paging discipline, portable beyond this
stack.
**Protect:** keep GLANCE/CARD genuinely short — the moment CARDs bloat, the pyramid stops paying for itself.
**Becomes real when:** mooco's CG engine turns it from a reading habit into actual paging.

### mooco owns the loop · **good** · *aspirational (design ≫ prototype)*
The only path from **advisory → enforced.** mooco can make why/gate/append/ambient/k-lines load-bearing
instead of honor-system.
**Protect:** ship the 2-capability wedge (enforced why+gate, CG heat loop) as proof **before** extending the
bar. Spec gravity is the enemy. → [`mooco/MOOCO-DRIVER-DEEP-DIVE.md`](mooco/MOOCO-DRIVER-DEEP-DIVE.md)

### Lean into the training data · **good** · *working*
Reusing famous, well-defined terms (K-line, room, character, card) means the model arrives **pre-taught** —
the name is itself a K-line.
**Protect:** keep coining to a minimum. Every neologism is onboarding debt an LLM can't pay from its weights.

### Heizronym ambiguity · **good** · *working (feature, by design)*
MOOLLM / UBIK / CARD as deliberately multi-expansion names. LLMs collapse them correctly per-domain — that's
the feature, not a bug.
**Protect:** do **not** pin one canonical expansion (it collapses the superposition globally); **do** provide a
boring-front-door glossary for humans. → [`nomenclature/NOMENCLATURE-HEISENBERGIAN-ACRONYMS.md`](nomenclature/NOMENCLATURE-HEISENBERGIAN-ACRONYMS.md)

### Self / one-object model · **good** · *aspirational*
The deepest unification: identity/config/messaging/deploy/sync/memory as prototype objects in one browsable
universe. Direct Ungar/Self lineage.
**Protect:** present as **north star, not as done.** Real for skills/rooms/characters; a thesis for the rest.
→ [`framing/FRAMING-ONE-OBJECT-MODEL-SELF.md`](framing/FRAMING-ONE-OBJECT-MODEL-SELF.md)

## Weakest — the risks and overrated bits (naming these is the point)

### Spec gravity · **flawed (risk)** · severity: **high**
Design docs vastly outrun implementation (mooco: ~17k lines of design vs a vibe-coded prototype; MOOFS/MOOT/CG
largely unbuilt).
**Risk:** "enforced" guarantees stay theoretical; the capability bar becomes unreachable even for mooco itself.
**Fix:** ship the smallest enforced loop first. Tag every doc working/partial/aspirational (as `harvest.yml`
does) so nobody mistakes design fiction for shipped.

### Onboarding debt · **flawed** · severity: **high**
The nomenclature surface is large (MOO, K-line, CARD, CG, moorl, MOOFS, MOOT, MOOKIE, TicketPR, heizronym…) —
great for LLMs, taxing for humans.
**Risk:** teachers, school IT, first-time contributors bounce off; the heizronym feature reads as "nobody will
tell me what this means."
**Fix:** the boring-front-door glossary (done) + a single linear onboarding path. Gate ambiguity behind a ramp.
→ [`nomenclature/NOMENCLATURE-ONBOARDING-GLOSSARY.md`](nomenclature/NOMENCLATURE-ONBOARDING-GLOSSARY.md)

### Cursor-dependence masquerading as universal · **flawed** · severity: **medium**
Behaviors described as "universal MOOLLM" are actually Cursor-shaped: the resolver is a hand-walk, append-only
is a promise, `cursor.yml` isn't even parsed by Cursor (`.cursorrules` is).
**Risk:** writing a non-Cursor driver reveals hidden dependencies late.
**Fix:** the tiny reference workspace + a second real driver (Claude-Code-via-MCP) surface these now; a
capability-negotiation table forces honesty. → [`driver-spec.md`](driver-spec.md)

### Proliferation of MOO-prefixed systems · **adequate (watch)** · severity: **medium**
mooco, moo, MOOT, MOOFS, MOOKIE, mooco-mirror, MOONUAL, MOOGLANCE, moocroworld… naming density risks confusion
even for fans.
**Risk:** cognitive load; unclear which are shipped vs sketched (`MOOCO-REPOS.md` itself retracted a 3400-line
MOOKIE/MOOT fiction).
**Fix:** one index stating, per MOO-thing: **shipped / prototype / design-only.** Prune retracted fiction.

### git-LFS & large media · **adequate** · severity: **low**
Repo-as-medium needs a clean large-file story. Don rejects git-lfs; prefers pointers to YouTube/SoundCloud/
cloud/Twitch.
**Risk:** pointer rot / dead links; the "canonical world" points at things that vanish.
**Fix:** a small pointer-manifest convention with archival fallback. Decide before many episodes accrue.

### License gap (unverified) · **adequate** · severity: **low**
The review claimed WWSFF has "no LICENSE file" — but that was a **GitHub-sidebar inference, not a filesystem
check.**
**Risk:** acting on an unverified claim; or shipping with an actually-missing license.
**Fix:** verify against the filesystem, then add correct per-zone LICENSE files.

### Invention over compression · **adequate** · severity: **medium**
The stack is better at inventing new primitives than compressing them. Command/TicketPR/Finding are one idea in
three costumes; CG has two names before it has one implementation.
**Fix:** name the shared primitive (**Proposal Object**) once and route the variants through it. Compression is
a feature, not a chore.

## Where I disagree with the original review

| Review claim | Verdict | Note |
|--------------|---------|------|
| "WWSFF has no LICENSE file." | **refine** | Unverified GitHub-sidebar inference presented as fact; needs a filesystem check. |
| "Will Wright's participation is contradictory/unconfirmed." | **resolved** | `characters/INDEX.yml` is the SSOT: `invitation_status = accepted`. The review lacked filesystem ground truth. |
| "Recommend an external SDK (e.g. OpenAI Agents) as the first real non-Cursor driver." | **refine** | mooco should be the Tier-6 flagship (ours; keeps leverage + IP boundary). External SDKs are strong **second** children of the same spec. |

## Carry forward

- **Protect at all costs:** repo-as-medium · command-bus/no-ghost-actions · pull-request-as-message
- **Ship next:** mooco enforced-why+gate · mooco CG heat loop · boring-front-door glossary
- **Watch closely:** spec gravity · onboarding debt · MOO-prefix proliferation
