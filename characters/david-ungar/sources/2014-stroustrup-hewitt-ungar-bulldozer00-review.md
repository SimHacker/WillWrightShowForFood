# Bulldozer00 review — Stroustrup × Hewitt × Ungar (Oct 2014)

Readable edition of Anthony DaSilva Jr's contemporaneous blog post. **Secondary source** for Don's async revisit article — not a substitute for the primary video.

| | |
|--|--|
| **Author** | Anthony DaSilva Jr ([bulldozer00](https://bulldozer00.blog/about-me/)) |
| **Published** | 22 October 2014 |
| **URL** | https://bulldozer00.blog/2014/10/22/a-fascinating-conversation/ |
| **Primary bundle** | [`2014-stroustrup-hewitt-ungar-conversation.md`](2014-stroustrup-hewitt-ungar-conversation.md) |

---

## Why this receipt matters

Bulldozer00 watched the conversation **three times** and saved the MP3 to a USB stick for his commute — same energy as Don's bike-route re-listen. His post is a crisp 2014 lay summary of three incompatible multicore philosophies. Useful as:

- A **checksum** when Don writes listening notes (did we hear what contemporaries heard?)
- **Question fodder** for David Ungar async replies — especially the Ungar hardware-memory position
- Evidence the talk was **immediately recognized** as exceptional (not only rediscovered in 2026)

*(Blog tags misspell "Dave Ungar" as "Bill Ungar" — ignore.)*

---

## Bulldozer00's framing

> *"A Conversation with Bjarne Stroustrup, Carl Hewitt, and Dave Ungar" is the most fascinating technical video I've seen in years.*

**Primary focus:** how to write applications that efficiently leverage **multicore processors**.

**Historical setup:** when physics stopped clock-speed gains in the 90s, vertical scaling halted and horizontal scaling (more cores) took over — and kept going.

---

## Lock vs synchronization

Much discussion over the difference between a **"lock"** and **"synchronization"**.

Even if your language shields you with high-level, task-based message passing instead of cooperative threading with locks, **some physical form of under-the-hood memory synchronization** must occur for cores to communicate through shared memory without data races — because main memory is physically shared on SMP hardware.

*Don's article can pair this with the video segment + 2026 Rust ownership / JS event-loop / actor-runtime landscape.*

---

## Three positions (Bulldozer00's layman's take)

| Speaker | 2014 position (as summarized by Bulldozer00) |
|---------|-----------------------------------------------|
| **Carl Hewitt** | We need **new, revolutionary, actor-based programming languages** that abandon the traditional sequential Von Neumann model. The current crop of languages won't cut it as cores-per-processor keeps increasing. |
| **David Ungar** | We need **incoherent, unsynchronized hardware memory architectures** with **background cache error correction**. Build a reliable system out of unreliable parts. |
| **Bjarne Stroustrup** | Revolutions happen much less than people think. Build up and experiment with **efficient concurrency abstractions in layered libraries** that increasingly hide locks and core-to-memory synchronization from programmers — the C++ threads → tasks → *"next?"* approach. |

---

## Comment thread (Nov 2014)

**phillipneumiller** — pro-Hewitt:

- GPU/MOONEYA parallelism "kicked the conventional architecture's butt" for many numeric problems
- Time for Harvard architecture and Von Neumann bottleneck to die
- Wants processor creativity: actors materialize hardware from "computing Ether," garbage-collected when the actor dies; ideally on quantum hardware for non-deterministic automata

**bulldozer00** reply — brief; mentions Mike Borden "coming back into the fold."

*Article hook:* the comment section is already a mini **2026 revisit** — GPUs won for numeric parallelism; actors won in production message systems; Ungar's incoherent-memory bet is the weird idea worth asking about again.

---

## Questions for David (async — pick any)

Bulldozer00's Ungar summary is the most **hardware-radical** of the three. Worth asking David:

1. Is Bulldozer00's one-liner fair — or a caricature of a more nuanced point you made on camera?
2. Ten years on: any of that incoherent-memory / cache-correction vision you'd still defend?
3. Does Self's **maps/PICs** lineage (reliable fast paths from adaptive runtime work) relate — or is that a different axis?
4. Stroustrup's "revolutions are rare" vs Hewitt's "new languages" — where do you sit **now**?

Add answers inline below when ready:

**David's reply:** *(pending)*

---

## Navigate

| Link | Why |
|------|-----|
| [Primary source bundle](2014-stroustrup-hewitt-ungar-conversation.md) | Video mirrors |
| [Article scaffold](2026-08-stroustrup-hewitt-followup-article-scaffold.md) | Don's deep dive outline |
| [Carl Hewitt memorial](../../carl-hewitt/memorial.md) | Actor model |
| [Ken Kahn](../../ken-kahn/README.md) | Hewitt PhD lineage |
| [2014 async revisits index](2014-async-revisits-index.md) | Both Lang.NEXT talks |

↑ [sources](README.md) · [character](../README.md)
