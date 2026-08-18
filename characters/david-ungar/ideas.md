# Ideas to explore with David Ungar 👤

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in David's
public work and documented connections to this repository. Things Don would love to follow
**with** David Ungar; not quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest · consent not_yet_asked

## Show

| | |
|---|---|
| **Planted show** | [`repo-shows/david-ungar/`](../../repo-shows/david-ungar/) |
| **North star** | [`reflecting-on-self.md`](reflecting-on-self.md) |
| **Episode title** | *Reflecting on Self: Narcissa's Mirror* |
| **Live chat guide** | [`chat-guide.md`](chat-guide.md) — scrollable beat sheet with links |

## What David has done

**David Ungar** — co-creator (with **Randall B. Smith**) of **Self**: prototype-based objects,
no classes, **multiple named `parent*` slots**, dynamic reparenting. Pioneered **generation-scavenging**
GC (Berkeley PhD) and **adaptive/dynamic JIT** — **maps** and **polymorphic inline caches** with
Chambers, Hölzle, **Lars Bak** → HotSpot → **V8**. **Mirrors** for reflection. **Stage Magic
Principle** and **Idea Scavenging**. Stanford → Sun Labs → IBM Research. Dahl–Nygaard Prize.
*Self: The Movie*. Jan 2026: Don wrote about MOOLLM building on Self — warm correspondence thread.

## The hooks

### 1. Self × MOOLLM — `# import self from self`

Directories as prototypes; skills clone + delegate; serializable parent lists restore **multiple
inheritance** JavaScript threw away. Build one small fragment live. See
[`import-self-from-self.md`](../don-hopkins/import-self-from-self.md).

### 2. The Power of Simplicity (not just prototypes)

Ungar & Smith, OOPSLA 1987 — the thesis is **simplicity**. Prototypes are the means. JS ⊂ Self,
watered down: kept prototypes, lost MI and simplicity. Full Rosetta table:
[`slots-all-the-way-down.md`](../david-rosenthal/slots-all-the-way-down.md).

### 3. Narcissa's Mirror — Self mirrors + pun stack

Working episode title. **self-interest** mailing list (Don was on it). Live enumeration: self-ish,
(oops)/OOPS, *Self: The Movie*, Conscientious Objectors. David gets veto power on air.

### 4. Conscientious Objectors — Kaleida (ScriptX × Self)

Meetup where **ScriptX object-system design team** and **Self team** bounced prototype OO ideas.
Don coined the name; **enlightened self-interest** was the companion term — sharing ideas openly
with the "competing" team is the smartest thing you can do for your own system. Ethic: artisanal,
intentional craft vs opaque automation — applied to LLM orchestration. The term's full 1967–2026
lineage (Heinz Lemke's literal army objection → Weizenbaum → Kaleida → the 2026 repossession):
[`conscientious-objectors-enlightened-self-interest.md`](../don-hopkins/conscientious-objectors-enlightened-self-interest.md) ·
[`kaleida-scriptx-...`](../don-hopkins/kaleida-scriptx-dreamscape-multimedia-lisp-machine.md).

### 5. Maps/PICs → V8 — the implementation vindication

Self made delegation **fast** — and that lineage runs into the VMs that run the web. Delicious
irony: JavaScript runs fast today **because of Self's implementation tech** while keeping a
broken object model — a single prototype chain with **no multiple inheritance**, the central
Self quality whose fast compilation was the hard problem the PICs solved in the first place.
Pairs with [`norman-margolus`](../norman-margolus/) "who JITs the jitter?"

### 6. Stage Magic → GLANCE / CARD / SKILL

Show simple view; reveal complexity on demand. MOOLLM's semantic image pyramid is the operational
form. Build a skill advertisement live using the pyramid.

### 7. Idea Scavenging → persistent characters

Focus compute on persistent ideas — characters and skills that survive sessions. Repo Show guest
directories as the scavenging substrate.

### 8. Relativistic parallelism

*"Everything You Know (About Parallel Programming) Is Wrong!"* — tolerate approximate, race-y
computation. Fun argument: is git's causal-DAG partial order the disciplined version, or a warning?

### 9. K-line inheritance — Self's simplicity for LLMs
Point don't humansplain: paper title (**Self: The Power of Simplicity**), patent number
(**US 5,187,786**), mixin words (`git`, `prototype` → skill + latent Self). Skills as primary
words — instantiate, inherit, artifactory. Accessibility on **three axes** (human / LLM / program);
lean [yaml-jazz](https://github.com/SimHacker/moollm/tree/main/skills/yaml-jazz) — comments
respected, round-tripped, generated. → [`sources/moollm-kline-inheritance.md`](sources/moollm-kline-inheritance.md)

### 10. Spatial Self — Vision Pro × exploratory IDE

Ungar's Jul 2026 LinkedIn note: Swift apps for Vision Pro exist; what he *wants* is an
exploratory programming environment — Self UI + IDE techniques + implementation speed
("split second response… including changing, running optimized code"). Pair with Russell
Allen's living Self VM / SIC. Show beat: what would Self-in-XR look like, and does MOOLLM's
directory-as-prototype room model rhyme?

### 11. Korz — the subjective dimension (David's own pointer)

Oct 2025 email: David pointed Don at **Korz** (IBM Research, with Harold Ossher, Doug
Kimelman, Sam Adams; Onward! 2014) — "the natural extension of Self to multidimensional
(context | subjectivity)." Lineage beat: **Us** (Smith & Ungar) → **Korz** (symmetric,
multidimensional dispatch, no privileged receiver) → MOOLLM's context-activated inheritance
(parents from files *and* latent space, resolved in room context). Same email: "the value
of simplicity comes from context" — the Power of Simplicity thesis, refined 38 years later.
And his question about live exploratory environments — **"Is there anything like that
today? Why not??"** — is the show's thesis; answer it on air.
→ [`sources/2025-10-26-korz-email-hn-rollup.md`](sources/2025-10-26-korz-email-hn-rollup.md)

### 12. OpenLaszlo reunion → Declare (optional group)
**Receipt:** Don ran into Ungar interviewing at Laszlo — email to Tom Lord, 21 Aug 2006
([extract](sources/2006-08-21-don-to-tom-lord-ungar-at-laszlo.md) ·
[seeds](../tom-lord/sources/2006-08-21-lua-spidermonkey-ungar-at-laszlo.md); full letter private).
Join Temkin / Henry / Oliver / Don (+ Myers / Latta) for
[`repo-shows/openlaszlo/`](../../repo-shows/openlaszlo/) — or stay solo. Demo beat: factorial +
live-edit of `*`. ISP + Self next to Declare's "heir not port."

### 13. Pairings

- **[Alan Kay](../alan-kay/)** — messaging over objects; Self as live-object branch
- **[Dan Ingalls](../dan-ingalls/)** — Smalltalk substrate Self grew from
- **[Oliver Steele](../oliver-steele/)** — instance-first; LZX obeys what JS violates; ISP vs Declare
- **[David Temkin](../david-temkin/)** — OL 5.0 + Declare; reunion
- **[Henry Minsky](../henry-minsky/)** — Laszlo + Leela; reunion
- **[David Rosenthal](../david-rosenthal/slots-all-the-way-down.md)** — NeWS/fs pole vs Self pole; patent co-parent

### 14. 2014 Lang.NEXT async revisits (two talks)

Don's Aug 2026 pitch: re-listen to **two** Lang.NEXT 2014 episodes; write listening notes; David
answers any on his schedule; Don drafts deep articles. Will Wright's GDC 2005 hinge — *revisit
weird old ideas* when the stack catches up.

| Talk | Bundle |
|------|--------|
| **Stroustrup × Hewitt × Ungar** — concurrency, inspirations | [`2014-stroustrup-hewitt-ungar-conversation.md`](sources/2014-stroustrup-hewitt-ungar-conversation.md) · [Bulldozer00 review](sources/2014-stroustrup-hewitt-ungar-bulldozer00-review.md) |
| **Korz — Dancing with Symmetry** — subjective programming in context | [`2014-lang-next-korz-dancing-with-symmetry.md`](sources/2014-lang-next-korz-dancing-with-symmetry.md) · [Microsoft Learn](https://learn.microsoft.com/en-us/shows/lang-next-2014/dancing-symmetry-to-harness-power-of-complexity-subjective-programming-in-context) |

The Korz talk connects Oct 2025 email → [`korz-prime.md`](korz-prime.md) → MOOLLM specimens in [`chat-guide.md`](chat-guide.md) §5.

→ [`sources/2014-async-revisits-index.md`](sources/2014-async-revisits-index.md) · [`invitation.md` Option D](invitation.md)

## Sources (public)

- [`invitation.md`](invitation.md) · [`reflecting-on-self.md`](reflecting-on-self.md)
- [`sources/moollm-kline-inheritance.md`](sources/moollm-kline-inheritance.md)
- [`correspondence.yml`](correspondence.yml) — Jan 2026 + Aug 2026 digest
- [`sources/2014-async-revisits-index.md`](sources/2014-async-revisits-index.md) · [`sources/2014-lang-next-korz-dancing-with-symmetry.md`](sources/2014-lang-next-korz-dancing-with-symmetry.md)
- [`from-alan-kay.yml`](from-alan-kay.yml) — Kay lineage quotes
- [`repo-shows/david-ungar/`](../../repo-shows/david-ungar/) · [`repo-shows/openlaszlo/`](../../repo-shows/openlaszlo/)
- [Self: The Power of Simplicity](https://bibliography.selflanguage.org/self-power.html)
- [Wikipedia — David Ungar](https://en.wikipedia.org/wiki/David_Ungar)
