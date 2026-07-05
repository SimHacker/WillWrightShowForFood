# MVC, Morphic, and "watchers" — Hacker News thread (Jan 2015)

*Guest hub:* [`../../README.md`](../../README.md) · *Media hub:* [`../README.md`](../README.md)

**Source:** Hacker News discussion on **["Smalltalk MVC Translated to JavaScript"](https://news.ycombinator.com/item?id=8839270)**
(Jan 2015). [Don Hopkins's comment](https://news.ycombinator.com/item?id=8841428) summarizes a **private email
exchange with Alan Kay** about MVC, Morphic, projection, and direct manipulation;
[doublec's reply](https://news.ycombinator.com/item?id=8841652) on Morphic vs MVC in Squeak/Self.

**Nature:** Alan's words below are **verbatim quotes from Don's HN comment** (email correspondence, 2015).
Don's HN text is attributed to Don. Forum reply attributed to **doublec**. Not Quora; not a live interview.
Credit: **Hacker News**. Governed by
[`portrayal-standards.yml`](../../../../schemas/portrayal-standards.yml).

> **Why it lives here:** complements the Quora MVC origin thread in
> [`../quora-recaps/oop-messaging-and-what-comes-next.md`](../quora-recaps/oop-messaging-and-what-comes-next.md)
> with Kay's **post-PARC** UI philosophy — watchers, view construction, and the unsolved "inverter" problem.

---

## Don's question (HN, Jan 2015)

Don asked Alan about the evolution of **MVC** and **Morphic**, and other important UI programming approaches.
Context Don cited:

- C2 wiki: [WhatsaControllerAnyway](http://c2.com/cgi/wiki?WhatsaControllerAnyway)
- Reddit thread on MVC for web development (Don's TL;DR: "Fuck MVC!" — two meanings: UI MVC vs web-server MVC)
- Morphic: originally Self, ported to Smalltalk — what makes it unique?

Don's framing: UI MVC is ~32 years old; "nobody can agree on what a controller is" except as a dumping ground
for brittle dependencies.

---

## Alan Kay (email, quoted on HN)

> Things seem to hang on in computing just because they work a little bit.

**MVC at PARC (~40 years ago then):**

- **Good part — philosophical:** adapt **"cameras" and "worlds"** from the original 3D graphics work at Utah
  (~45 years ago then).
- **Bad part — implementation:** "much too much machinery, etc."

**Since then (Viewpoints Research and related groups):**

- Have **not thought about MVC since**.
- Prefer **views as "watchers"** which **do not affect** what they are viewing — "lots of ways to do this."
- Similarly use **watchers** (context-sensitive to the views) to **catch needed inputs**.
- Have **never done a really satisfactory automatic inverter** for dealing with the **loss of "dimensions"**
  when a view is made — "but we have done some experimental ones."

**End-user composition:**

> One important criterion is for end-users of all kinds to be able to easily make their own views in a very
> powerful ad hoc way via construction. We have done a number of adaptations and generalizations of how this
> can be done in **Hypercard** — and this seems to work well (enough).

**Systems stance:**

- "Since we always roll our own languages and development systems, we don't care about problems that other
  systems might have. For example, we have very little knowledge about C#, etc. We do try to learn from the
  few good systems that are out there."

---

## Don's follow-up (HN) — projection, direct manipulation, Sk8

Don connected Alan's "projection" idea to notebooks he read at **David Levitt**'s place (Atari Cambridge
Research): a **two-way mapping/projection** between model and view.

Don's skepticism about the **controller** as extra baggage — the view knows most about drawing the model and
should know how to reverse user input back to the model. Today that is usually hand-written view + mouse
tracking ("a high art form").

**Ben Shneiderman's "direct manipulation"** — continuous representation, rapid reversible incremental actions
and feedback ([Wikipedia](https://en.wikipedia.org/wiki/Direct_manipulation_interface)) — as the UI style Kay
was getting at; DM could benefit from an automatic inverter but is usually ad hoc in the view.

**Smalltalk / Self / Morphic reflection** — editable UIs for booleans, numbers, colors; falls back to generic
widgets without semantic knowledge of the data.

Don played with **Sk8** at Kaleida — prototype-based, drill-down, see and modify everything, neat window shapes.

**Open questions Don raised:**

- What did Kay mean by **"projection"**?
- What are successful examples of **automatic bi-directional mapping** and powerful user composition?
- Projection = losing dimensions when flattening structure onto the screen (3D projection, scaling, filtering,
  infovis) — no affordance to edit every property without browsers, outliners, pop-up menus.

---

## doublec (HN reply)

> I was curious about the thoughts of Morphic vs MVC as well given that Squeak seems to have gone Morphic
> based and the Self GUI was entirely Morphic.

Praise for Self's **reflection approach** — "manipulating a soup of objects vs using an application."

---

## Show fodder — questions for Alan

- **Watchers vs controllers:** is a non-mutating watcher the replacement for MVC's controller, or a different
  axis entirely?
- **The inverter problem:** what would a "satisfactory" automatic inverter look like for DM / Morphic / Etoys?
  Why has it stayed experimental for 20+ years?
- **HyperCard as view composer:** you said HyperCard generalizations "work well (enough)" — enough for what,
  and what's still missing vs Sketchpad constraints?
- **Morphic today:** Squeak went Morphic; Self GUI was Morphic — is Morphic still the carrier for watchers,
  or something else in VPRI/STEPS lineage?
- **Projection vs messaging:** does the Utah "camera on a world" story connect to your later "relational rather
  than message-based" Sketchpad turn? (See [`../quora-recaps/oop-messaging-and-what-comes-next.md`](../quora-recaps/oop-messaging-and-what-comes-next.md).)

---

## Connects in the repo

| Who / what | Link |
|------------|------|
| MVC origin (Quora) | [`../quora-recaps/oop-messaging-and-what-comes-next.md`](../quora-recaps/oop-messaging-and-what-comes-next.md) |
| HyperCard end-user authoring | [`../quora-recaps/hypercard-personal-computing-breakthrough.md`](../quora-recaps/hypercard-personal-computing-breakthrough.md) |
| NeWS / HN (Don) | [`../quora-recaps/browsers-documents-news-hypercard-hyperlook.md`](../quora-recaps/browsers-documents-news-hypercard-hyperlook.md) |
| David Levitt (Atari Cambridge) | [`../../../david-levitt/`](../../../david-levitt/) · [`../../../david-levitt/media/from-mail/paper-pantomime-teaser.pdf`](../../../david-levitt/media/from-mail/paper-pantomime-teaser.pdf) |
| Ben Shneiderman (direct manipulation) | [`../../../ben-shneiderman/`](../../../ben-shneiderman/) |
| Dan Ingalls (Smalltalk/Morphic lineage) | [`../../../dan-ingalls/`](../../../dan-ingalls/) |
| David Ungar (Self/Morphic) | [`../../../david-ungar/`](../../../david-ungar/) |
| Terry Winograd (CS547 archive) | [`../../../terry-winograd/media/cs547-ARCHIVE.md`](../../../terry-winograd/media/cs547-ARCHIVE.md) |
