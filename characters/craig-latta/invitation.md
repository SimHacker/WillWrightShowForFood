---
status: in_conversation
character_id: craig-latta
public: true
consent: warm — rehearsed the Vanessa tribute together 2026-07-20; has seen and cheered the repo plans; formal show ask pending
show_seed: repo-shows/craig-latta/
also_shows: [repo-shows/openlaszlo/]
memorial_arc: repo-shows/remembering-vanessa-freudenberg/remembering-vanessa-freudenberg.yml
format: remote_or_in_person
---

# Repo Show invitation — Craig Latta

*Craig has already rehearsed the Vanessa tribute with Don and cheered the repo plans — this
letter turns that momentum into concrete show formats. He may edit, decline, delay, or request removal at any time.*  
[Portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md) — also covers direct repo access, the quiet-mode publication plan, and easy onboarding.

Craig —

I'd like to do a **Repo Show** with you — stage is a public GitHub repo, following through to
working, live-coded artifacts. **Remote screencast is perfect** if you're not in Amsterdam when
we record. Format flexible: the **Vanessa memorial** we've already rehearsed, **Caffeine /
liveness solo**, the
**[OpenLaszlo reunion → Declare](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/openlaszlo/README.md)**
(prototypes + live objects with Ungar / Brad Myers / Temkin), or whatever works.

**Will Wright is in — he's signed on to do the [premiere](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md) and more.**

---

## Option A — Remembering Vanessa: the memorial edition, at your pace

We already rehearsed this — July 20, reading Vanessa's SqueakJS paper together on a screencast,
which is the session that exposed the problem: every public copy of her DLS '14 paper (Most
Notable Paper 2024) still carried her deadname. By the end of that day a **memorial edition**
existed with her correct name on the byline — original preserved bit-for-bit beside it, every
change hashed and disclosed — and the hunt for precedent surfaced her own 2021 Hacker News
comment asking, in her own words, not to be deadnamed in citations. She had asked for exactly
this.

So here's the show: **you screen-share the
[memorial edition](https://github.com/SimHacker/moollm/blob/main/designs/prestoration/sources/Freudenberg-2014-SqueakJS-memorial-edition.pdf)
and scroll through it at your own pace** — you set the tempo, we talk about whatever each page
brings up: the VM, the design choices, the stories behind them. Other papers of hers are welcome
in the same sitting — her [JIT brain dumps](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/vanessa-freudenberg/sources/jit-notes)
are preserved in the repo too.

Then a second act if you're up for it: **the adventure of making the memorial edition** — the
twenty minutes of font-subset archaeology, kern-split greps, and glyph inventories; how
[cursor-mirror](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) let the agent
read its own session transcript afterwards; and how that write-up became the reusable
[change-name skill](https://github.com/SimHacker/moollm/tree/main/skills/change-name) — SCAN →
DISCUSS → EDIT → VERIFY → PUBLISH, with the ethics gate built in. The full case study lives at
[designs/prestoration/](https://github.com/SimHacker/moollm/tree/main/designs/prestoration).

**Dan Ingalls and Alan Kay are warmly invited** to linked segments in the same arc — not a panel
ambush, friends who knew her work and love the same live-object lineage. Memorial mode: we
*represent and discuss* — we never speak as her. See
[`characters/vanessa-freudenberg/`](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/vanessa-freudenberg)
and [`repo-shows/remembering-vanessa-freudenberg/`](https://github.com/SimHacker/WillWrightShowForFood/tree/main/repo-shows/remembering-vanessa-freudenberg).

## Option B — Group: OpenLaszlo reunion → Declare (+ what prototypes *are*)

With **David Temkin**, **Henry Minsky**, **Oliver Steele**, me, optionally **Dave Ungar**,
**Brad Myers** (Garnet / PBD / pull constraints), and other Laszlo/UI people. Live OL 5.0 +
Declare calendar. Your angle: **live objects** — Morphic / Squeak / Caffeine next to Self
prototypes, Garnet prototypes, LZX instance-first, and Declare's standing constraints. We could
really get into **what prototypes are** without the word becoming mush.

Stage: [`repo-shows/openlaszlo/`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/openlaszlo/README.md)

**And Korz.** I just had a wonderful chat with Dave Ungar. He made an even *selfisher* language
called **Korz** — unintentionally an anagram of Zork. If Smalltalk is molecules and Self is
atoms, **Korz is quarks**: subjective programming — instead of decomposing everything into
objects, it's a sea of slots you can view and group in many ways along parameterized
dimensions. Kind of like, but better than, aspect-oriented programming and generic templates.
He built it at IBM, presented it at Microsoft's LANG.NEXT
([*Dancing with Symmetry*](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/david-ungar/sources/2014-lang-next-korz-dancing-with-symmetry.md)),
and wrote some mind-blowing papers
([Onward! 2014](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/david-ungar/sources/korz-2014-onward.pdf) ·
[FOOL 2014](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/david-ungar/sources/fool2014-korz-foundation.pdf)).
My working notes, questions, and the LLM-age redesign:
[korz-notes.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/david-ungar/korz-notes.md) ·
[korz-prime.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/david-ungar/korz-prime.md).
Smalltalk → Self → Korz next to Morphic / Caffeine / Catalyst — that's a conversation I'd love
to have with you, with or without the full reunion cast.

## Option C — Solo: Caffeine / Keep / Cursor vs liveness

- **Caffeine** — livecoding the web with SqueakJS + dynamically generated WebAssembly. Bring your
  laptop — livecode on air.
- **MicropolisCore + MOOLLM** — Smalltalk-grade liveness applied to a city sim and AI tutors.
- **Keep** — Smalltalk whiteroom port of Hugh Pyle's graph memory.
  [`keep.md`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/craig-latta/keep.md)
- **Cursor vs live systems** — IDE chrome vs the object that stays alive in the browser.
- **Korz** — Ungar's sea of slots and subjective dispatch (see Option B) from the Smalltalker's
  side: what would a Korz image feel like to livecode?

## Option D — Whatever works

Memorial-only, reunion-only, Caffeine-only, shorter call, or "not now" — all honored.

---

**Materials:**  
[Memorial edition PDF](https://github.com/SimHacker/moollm/blob/main/designs/prestoration/sources/Freudenberg-2014-SqueakJS-memorial-edition.pdf) ·
[Prestoration case study](https://github.com/SimHacker/moollm/tree/main/designs/prestoration) ·
[OpenLaszlo reunion](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/openlaszlo/README.md) ·
[`repo-shows/craig-latta/`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/craig-latta) ·
[Keep](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/craig-latta/keep.md) ·
[live-objects trail](https://github.com/SimHacker/WillWrightShowForFood/blob/main/process/trails/live-objects.md)

**Your response:** yes (memorial / reunion / Caffeine / combo / something else), later, too busy,
or no — all honored gracefully.

— Don Hopkins *(the User Interface Flower Child)* 🌸🌀

`☕ Caffeine live` · `🟦 OpenLaszlo reunion` · `🪞 prototypes` · `🕯️ Vanessa + SqueakJS` · `🖱️ Cursor vs liveness`

*P.S. — Caffeine's on me — the molecule **and** the VM.*

*P.S. The repo is in quiet mode while invitations go out — please don't share links publicly just yet.*
