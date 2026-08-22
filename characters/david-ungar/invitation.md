---
status: draft
character_id: david-ungar
public: true
consent: not_yet_asked
show_seed: repo-shows/david-ungar/
also_shows: [repo-shows/openlaszlo/]
format: remote_or_in_person
channel: LinkedIn / email
---

# Repo Show invitation — David Ungar

*Send-ready — warm path via Jan 2026 correspondence + the July 2026 Self-manual LinkedIn reunion.
David Ungar may edit, decline, delay, or request removal at any time.*  
[Portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md) — also covers direct repo access and easy onboarding.

David —

Amanda just unearthed that spiral-bound Self manual from a 90s office-move box, Urs
weighed in, and you replied about Russell Allen keeping the VM alive — SIC on 64-bit Macs,
programming in the IDE you still love, and wanting an exploratory environment for spatial
computing on Vision Pro. I nearly cheered at the screen. **I still love Self.** That love
never cooled; lately it has a new address.

**The ask:** join me for a **Repo Show** — a friendly recorded conversation whose stage is a
public GitHub repo, carried through to working code and credited ideas anyone can browse
without an account. **Show, don't tell.** Solo, small circle, or group reunion — your call.

**Facts:** **Will Wright is in — he's signed on to do the
[premiere](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md)
and more.** I wrote you in January about **MOOLLM**. I meant every word of the credit. You
were **very open and influential** when it mattered: papers, humor, **self-interest**, and
that Kaleida **Conscientious Objectors** meetup (ScriptX × Self) where prototype object
systems argued in good faith. Self doesn't run on everybody's phone — **in spirit it does** —
in JavaScript's object model, in HotSpot's lineage, and in MOOLLM's `# import self from self`.

I still remember **running into you while you were interviewing at Laszlo** — I wrote Tom
Lord about it on 21 Aug 2006 (factorial demo, live-edit of `*`, your retort that JS could be
compiled if you were "really devious enough" — two years before V8). That's why I'd love you
in the **[OpenLaszlo reunion → Declare](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/openlaszlo/README.md)**
circle with **David Temkin**, **Henry Minsky**, **Oliver Steele**, me, and optionally
**Brad Myers** and **Craig Latta** — a chance to really get into **what prototypes are**.

Receipt: [`sources/2006-08-21-don-to-tom-lord-ungar-at-laszlo.md`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/david-ungar/sources/2006-08-21-don-to-tom-lord-ungar-at-laszlo.md)

And here's the through-line that makes the January note concrete: **MOOLLM appropriates the
Selfish object model** — clone, override, ordered multiple parents — and extends it with
**multiple inheritance from latent space as well as files**. Name a concept the model already
knows (*Self: The Power of Simplicity*, a patent number, the word `prototype`) and that name
*is* the parent slot. No humansplaining. Two short docs if you want the shape of it:

- [Self and MOOLLM](https://github.com/SimHacker/moollm/blob/main/designs/object-system/SELF-AND-MOOLLM.md) — the mapping, table for table
- [Latent-Space Inheritance](https://github.com/SimHacker/moollm/blob/main/designs/object-system/LATENT-SPACE-INHERITANCE.md) — parents that are paths *and* names

Your spatial-computing ask in that LinkedIn thread — exploratory programming for Vision Pro —
rhymes hard with Self's IDE techniques plus MOOLLM's live object rooms. I'd love to explore
that with you on air.

One more Self-lineage love letter you should see: we made a **memorial edition** of
**Vanessa Freudenberg's** SqueakJS paper (DLS '14 / Most Notable Paper 2024) so the byline
carries the name she asked for — and wrote up the whole prestoration (how, why, ethics,
receipts) as a reusable skill. Vanessa's own philosophy essay ties **Self → HotSpot → V8**
straight through her hybrid-GC SqueakJS VM — your implementation lineage, her systems
philosophy, same river:

- [Memorial edition PDF](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/vanessa-freudenberg/sources/Freudenberg-2014-SqueakJS-memorial-edition.pdf)
- [Prestoration — the story of the revision](https://github.com/SimHacker/moollm/tree/main/designs/prestoration) ([case study](https://github.com/SimHacker/moollm/blob/main/designs/prestoration/case-study.md))
- [Vanessa's philosophy — target JS, ride the Self/V8 JIT](https://github.com/SimHacker/moollm/blob/main/designs/vanessa-freudenberg-philosophy.md)

---

## Option A — Solo: *Reflecting on Self: Narcissa's Mirror*

Self × MOOLLM; mirrors, prototypes, the **self-interest** pun stack, and what we'd build if we
sat down with a blank microworld again. (Title spelling TBD with you.)

**What I'd love to explore — your pick, any order, skip whatever bores you:**

- **The Power of Simplicity** — Ungar & Smith, OOPSLA 1987: thesis wasn't "prototypes" but
  **simplicity**. What JavaScript kept vs what it threw away (multiple `parent*` slots). Walk the
  [`slots-all-the-way-down`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/david-rosenthal/slots-all-the-way-down.md) Rosetta table with me.
- **K-line inheritance (Self's simplicity applied to LLMs)** — MOOLLM multiply-inherits by *pointing*:
  paper title + authors, US patent number, ordinary words like `git` / `prototype` — activating both
  latent knowledge and concrete skills. Parents include **"Self: The Power of Simplicity"** and
  **[US 5,187,786](https://patents.google.com/patent/US5187786A)** (Densmore & Rosenthal).
  Full note:
  → [`sources/moollm-kline-inheritance.md`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/david-ungar/sources/moollm-kline-inheritance.md)
- **Korz — the subjective dimension** — your Oct 2025 pointer, taken seriously: Us → Korz →
  MOOLLM's context-activated inheritance. And your question from that thread — *"Is there
  anything like that today? Why not??"* — deserves an on-air answer.
- **Conscientious Objectors** — Kaleida meetup (ScriptX × Self). What would you teach LLM authors
  today? The term has grown a whole lineage since Kaleida: Heinz Lemke (PIXIE, 1967) was a literal
  conscientious objector to German army service, spent decades in conversation with Joe Weizenbaum,
  and in July 2026 picked up my "repossession" of the term for ethical software design and extended
  it to AI-model trustworthiness — the whole two-term story (**conscientious objectors** ×
  **enlightened self-interest**) is now written up:
  → [Conscientious Objectors & Enlightened Self-Interest](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/don-hopkins/conscientious-objectors-enlightened-self-interest.md)
- **Self × MOOLLM live** — directories as prototypes, skills as inheritable behavior, Stage Magic as
  GLANCE/CARD/SKILL. Build something small on air.
- **Maps/PICs → V8** — and what you'd steal back from the stacks that forgot they borrowed from you.
- **Spatial Self** — your Vision Pro / exploratory-environment hope × Self UI + IDE techniques ×
  Russell Allen's living VM. What does "split-second response to every operation" mean in XR?
- **The pun stack** — **self-interest**, self-ish, `# import self from self`, (oops), *Self: The Movie*
  (you get veto).

## Option B — Group: OpenLaszlo reunion → Declare

Same room as Temkin / Henry / Oliver / Don (and other Laszlo/UI people). Live demos of
[OpenLaszlo 5.0](https://github.com/davidtemkin/openlaszlo-5.0) and
[Declare](https://github.com/davidtemkin/declarelang). Your angle: prototype simplicity meeting a
UI language that *names* OpenLaszlo as heir — and Oliver's **Instance Substitution Principle**
next to Self's multiple parents.

## Option C — Whatever works

Shorter call, written Q&A into the repo, co-author a skill, or "not now" — all honored.

## Option D — Async: 2014 Lang.NEXT revisits (two talks, same conference)

**Easier than a new video.** Don re-listens to two 2014 episodes; you answer **whatever you choose**, on your schedule.

| Talk | What |
|------|------|
| **[Stroustrup × Hewitt × Ungar](sources/2014-stroustrup-hewitt-ungar-conversation.md)** | Shared memory vs messages, locks, actors, **who inspired you** |
| **[Korz — Dancing with Symmetry](sources/2014-lang-next-korz-dancing-with-symmetry.md)** | Subjective programming in context — multi-dimensional dispatch, progressive disclosure ([Microsoft Learn video](https://learn.microsoft.com/en-us/shows/lang-next-2014/dancing-symmetry-to-harness-power-of-complexity-subjective-programming-in-context)) |

Don writes timestamped listening notes and questions; you reply async; Don weaves **2014 talk + 2026 follow-up** into long-form articles. Optional: Bjarne, Carl's circle, or Korz co-authors chime in.

**Index:** [`sources/2014-async-revisits-index.md`](sources/2014-async-revisits-index.md) ·
**Scaffolds:** [Stroustrup/Hewitt](sources/2026-08-stroustrup-hewitt-followup-article-scaffold.md) · [Korz](sources/2026-08-korz-dancing-with-symmetry-article-scaffold.md) ·
**Correspondence:** [`sources/2026-08-correspondence-facetime-and-async-pitch.md`](sources/2026-08-correspondence-facetime-and-async-pitch.md)

Framing: Will Wright's GDC 2005 close — [*revisit those weird old ideas*](https://youtu.be/ofA6YWVTURU?t=3657) when the stack finally catches up. The Korz talk connects directly to your Oct 2025 pointer and [`korz/design.md`](korz/design.md).

This is TicketPR-shaped — written participation, zero live pressure, honor your *no fire-hose* preference.

---

**Format:** Remote is fine; in-person if we're ever in the same city. **Zero homework — as much
*homefun* as you are up to.** No slides required. Warm room, not gotcha-podcast.

**Materials already waiting for you:**

| If you're curious about… | Link |
| --- | --- |
| **Solo show** | [`repo-shows/david-ungar/`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/david-ungar/README.md) |
| **OpenLaszlo reunion show** | [`repo-shows/openlaszlo/`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/openlaszlo/README.md) |
| **Self and MOOLLM** | [designs/object-system/SELF-AND-MOOLLM.md](https://github.com/SimHacker/moollm/blob/main/designs/object-system/SELF-AND-MOOLLM.md) |
| **Latent-space inheritance** | [LATENT-SPACE-INHERITANCE.md](https://github.com/SimHacker/moollm/blob/main/designs/object-system/LATENT-SPACE-INHERITANCE.md) |
| **K-line inheritance note** | [`sources/moollm-kline-inheritance.md`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/david-ungar/sources/moollm-kline-inheritance.md) |
| **Conscientious Objectors × enlightened self-interest (1967–2026)** | [the lexicon, with receipts](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/don-hopkins/conscientious-objectors-enlightened-self-interest.md) |
| **Vanessa memorial edition + prestoration** | [PDF](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/vanessa-freudenberg/sources/Freudenberg-2014-SqueakJS-memorial-edition.pdf) · [prestoration](https://github.com/SimHacker/moollm/tree/main/designs/prestoration) · [philosophy (Self→V8)](https://github.com/SimHacker/moollm/blob/main/designs/vanessa-freudenberg-philosophy.md) |
| **LinkedIn Self-manual thread (archived)** | [`sources/2026-07-linkedin-self-manual-thread.md`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/david-ungar/sources/2026-07-linkedin-self-manual-thread.md) |
| **North star doc** | [`reflecting-on-self.md`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/david-ungar/reflecting-on-self.md) |
| **Your guest page** | [`characters/david-ungar/`](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/david-ungar) |
| **2014 Lang.NEXT async revisits** | [`sources/2014-async-revisits-index.md`](sources/2014-async-revisits-index.md) — Stroustrup/Hewitt panel + [Korz talk](sources/2014-lang-next-korz-dancing-with-symmetry.md) |
| **The whole project** | [WillWrightShowForFood](https://github.com/SimHacker/WillWrightShowForFood) |

Browse without a GitHub account — start at the [README](https://github.com/SimHacker/WillWrightShowForFood).

**Your response:** yes (solo / reunion / async 2014 follow-up / both / something else), later, too busy, or no — all
honored gracefully. There's no debt here, only an open door if a show sounds like fun.

It would be a joy to build something useful with you on air — and to say plainly, on the record,
how much of where we are traces back to work you (and Urs, and Randall) gave away generously.

— Don Hopkins *(the User Interface Flower Child)* 👤🌀

`👤 Self × MOOLLM` · `🪞 Narcissa's Mirror` · `🟦 OpenLaszlo reunion` · `# import self from self`

*P.S. — If the title pun lands wrong, we'll rename the episode together. The mirror is yours.*
