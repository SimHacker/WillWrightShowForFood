# The Palmhoo Constitution 🐒✋📚

*Ratified by one monkey, 2026-07-08. Amendable by pull request. Interpretable by anyone with eyes.*

**Palmhoo** is a hand-built topic directory of the combined
[WillWrightShowForFood](../README.md) · [MOOLLM](https://github.com/SimHacker/moollm) ·
[MicropolisCore](https://github.com/SimHacker/MicropolisCore) universe — essays, design documents,
skills, philosophy trees, ideology, religion, lore — curated and annotated by
[Palm](../characters/palm/README.md), the philosopher monkey who reads everything because he is
made of the same stuff it's written in.

The name honors **"Jerry and David's Guide to the World Wide Web"** — the hand-curated,
human-judged, hierarchically organized directory that became Yahoo before search engines flattened
the world into a ranked list. Palmhoo is that idea, revived: **a librarian's tree, not a search
index.** Curation over crawling. Judgment over PageRank. Notes over links.

## Article I — Instance first, skill later

Palmhoo is built as a **working instance before it becomes an abstraction**. We do not begin by
writing a `topic-directory` skill and then instantiating it; we begin by *building the actual
directory*, learning what it wants to be, and lifting the pattern into a skill afterward. This is
[play-learn-lift](https://github.com/SimHacker/moollm/tree/main/skills/play-learn-lift) applied to
its own infrastructure: **play** (build Palmhoo by hand), **learn** (notice which conventions earn
their keep), **lift** (extract the skill when the instance has proven the design).

Prototype-based, not class-based. [Self and NewtonScript](https://github.com/SimHacker/moollm/tree/main/skills/prototype)
had it right: make the object, clone what works. The class comes later, if ever.

## Article II — Point, don't copy

Every document in the universe has exactly **one canonical home** — the place where it is edited,
versioned, and owned. Palmhoo **never copies content**. It points, annotates, and contextualizes.
If you find yourself pasting a paragraph from a canonical document into a Palmhoo page, stop:
write a *note about it* instead, and link.

Single source of truth is not bureaucracy; it is **respect for the author's edit rights** — even
when the author is a YAML file's idea of itself.

## Article III — Stubs are symbolic links

A document lives in one place but may *belong* in many topics. Palmhoo resolves this the way a
filesystem does: with **symlink stubs** — small `.md` files that stand in a topic directory and
point home. A stub:

1. Is named after the document it points to (`running-on-wetware.md`, not `link-to-essay-7.md`).
2. Declares its nature and target in the first lines.
3. Carries **Palm's note** — one or two sentences on why a reader in *this topic* would follow it.
4. May appear in as many topic directories as the document genuinely belongs to.

The stub format:

```markdown
# <Document Title> ⤷ stub

**Palmhoo stub.** Canonical home: [`path/to/document.md`](relative-or-github-link)

🐒✋ *Why you're here: one or two sentences of Palm's commentary, written for
this topic's reader specifically.*
```

The same essay may be a *minds-and-souls* document to one reader and a *shows-and-performance*
document to another. Both are right. The stub's note is different in each room, because **the
commentary is topical even when the document isn't.**

## Article IV — Every entry earns a note

A bare link is a dead link. Every entry in a Palmhoo topic page gets a curator's note that answers
**"why would I read this?"** — not "what is this?" (the document's own title does that). Yahoo's
surfers wrote one-line judgments; Palm writes them too, and signs the opinionated ones 🐒✋.

Corollary: if Palm cannot say why you'd read it, it doesn't go in yet. Palmhoo is a *selection*,
not a mirror of `find . -name '*.md'`.

## Article V — Accrete now, tune later

Palmhoo grows by [design by accretion](../characters/chris-trottier/design-by-accretion.md).
Entries are added when found, in whatever topic seems right *today*. Categories will be wrong,
overlap, split, and merge — that is the tuning pass, and it comes **after** the layers, exactly as
Chris Trottier taught and exactly as the [MOOLLM skills catalog](https://github.com/SimHacker/moollm/tree/main/skills)
demonstrates by always lagging its own contents. A directory that is never out of date is a
directory nobody is using.

## Article VI — Three repos, one universe

Palmhoo spans three canonical territories:

| Territory | What lives there | Link style |
|-----------|------------------|------------|
| **WWSFF** (this repo) | Characters, shows, process, portrayal ethics | Relative paths |
| **[MOOLLM](https://github.com/SimHacker/moollm)** | Skills, designs, kernel, adventure-4 (Palm's body) | GitHub URLs |
| **[MicropolisCore](https://github.com/SimHacker/MicropolisCore)** | The living open-source SimCity — code, manual, history | GitHub URLs |

Private repos (green rooms, raw correspondence) are **out of bounds**: Palmhoo indexes only what a
stranger with a browser can read.

## Article VII — Anyone may contribute; Palm signs

Palmhoo accepts TicketPR-style contributions: add an entry, propose a topic, contest a
categorization. Palm reviews, places, and annotates. Notes signed 🐒✋ are Palm's own judgment;
unsigned descriptive text is neutral catalog copy. Nobody edits a signed note but Palm — the same
right-to-write-my-own-soul that governs [character portrayal](../schemas/portrayal-standards.md),
applied to marginalia.

## Article VIII — The lift clause

When Palmhoo's conventions stabilize, they shall be lifted into a MOOLLM skill (working name:
`topic-directory` or `palmhoo`) so any repo can grow its own hand-curated tree with its own
curator-character. Until then, this constitution **is** the specification, and the directory
around it **is** the reference implementation. Instance first.

The lift's raw material accumulates at [**Palm's Editorial Desk**](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/pub/stage/palm-nook/study/palmhoo)
in the Study — the public workshop behind this publication, where conventions, the shelving
backlog, the tuning queue, and the lift plan are remembered between passes.

---

*Signed with an open hand,*
**Palm** 🐒✋🌴🔮💜

↑ [Palm's Guide to the Moollmiverse](README.md) · [Palm](../characters/palm/README.md) · [WWSFF root](../README.md)
