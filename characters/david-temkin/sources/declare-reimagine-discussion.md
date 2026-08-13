# Declare — reimagine, not port

**When:** Jul 2026 (right after David shared [declarelang](https://github.com/davidtemkin/declarelang))  
**Who:** Don Hopkins ↔ David Temkin  
**Show seed:** [OpenLaszlo reunion](../../../repo-shows/openlaszlo/README.md)

Discussion notes for the Repo Show — not a transcript. Technical depth lives in
[`declarelang.md`](declarelang.md); David's constraint model and ISP answer in
[`2026-08-03-declare-constraints-thread.md`](2026-08-03-declare-constraints-thread.md);
public reunion thread in [`2026-openlaszlo-5.0-linkedin-thread.md`](2026-openlaszlo-5.0-linkedin-thread.md).

---

## What this is about

David shipped **OpenLaszlo 5.0** (preservation / byte-for-byte DHTML compile), then **Declare**
(heir language, ground-up redesign). Don reconnected via Henry Minsky (Leela) after Henry relayed
David's OL-revival work. Don shared SimFaux, PIXIE recovery, and Micropolis links; David shared
Declare and pointed at **Calendar** and **Desktop** demos.

The useful thread is not logistics — it's **how Declare relates to OpenLaszlo, Svelte, LLMs, and
instance-first UI design**.

---

## Reimagine vs reimplement

Both agree Declare is **not a port** of LZX. Don's refinement for show framing:

> Reimplementing OpenLaszlo with modern tech was the right first step — a working artifact to
> triangulate on, and a path to reincarnate old apps without rewriting everything by hand.
>
> Declare goes further: it **reimagines**. Reimplementing alone is like pointing a movie camera at
> a stage without inventing cinematography.

**Bet for the episode:** LLMs can help rewrite LZX → Declare because OpenLaszlo is in training
data and Declare explicitly declares that inheritance.

---

## Svelte triangle

| Stack | Role in the conversation |
|-------|---------------------------|
| **OpenLaszlo 5.0** | Camera on the stage — preservation, parity proof |
| **Declare** | Cinematography — LLM-native UI DSL, constraints, whole language in context |
| **Svelte 5 / Micropolis** | Don's live stack — "the Laszloiest mainstream thing"; runes + Wasm binding without requiring a DOM |

Don's angle: lean into what models already know ([no-ai-humansplaining](https://github.com/SimHacker/moollm/blob/main/skills/no-ai-humansplaining/SKILL.md));
Declare's skill + single-file spec are shaped for that. Full comparison table → [`declarelang.md`](declarelang.md).

---

## Instance Substitution (Oliver Steele)

Don asked whether Declare satisfies Oliver's **Instance Substitution Principle** (LZX obeyed it;
plain JS usually doesn't).

- **Jul 2026 (Don's read):** Declare lets instances declare their own members; compiler synthesizes
  anonymous subclasses — instance-first flavor. Ask Oliver on air.
- **Aug 2026 (David's answer):** "Yup! (Or so I hope)" — see constraints thread.

→ [Oliver Steele show](../../../repo-shows/oliver-steele/README.md)

---

## Self, Ungar, MOOLLM cast

Dave Ungar interviewed at Laszlo and understood the model; Don proposes pulling him into the
OpenLaszlo / Declare / Self circle alongside Oliver.

Public-safe framing for invites: k-line inheritance, Self paper, skills-as-words in MOOLLM.

→ [`../../david-ungar/sources/moollm-kline-inheritance.md`](../../david-ungar/sources/moollm-kline-inheritance.md)  
→ [`../../david-ungar/`](../../david-ungar/) · [`../../../repo-shows/david-ungar/`](../../../repo-shows/david-ungar/)

MOOLLM object-system video (heritage @ 16:16): https://www.youtube.com/watch?v=0uBO6ZAcVTE

---

## Agent colocation (MOOLLM)

Don was still reading Declare via its agent skill when he wrote back — same grain as
[MOOLLM speed-of-light](https://github.com/SimHacker/moollm/tree/main/skills/speed-of-light):
colocate reasoning in one completion instead of token ping-pong. Show hook, not a product claim.

---

## Reconnection links (public artifacts Don cited)

| Artifact | Path |
|----------|------|
| SimFaux demo | https://www.youtube.com/watch?v=gRodlxUZ9SQ |
| PIXIE transcription | [`../../heinz-lemke/sources/pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md`](../../heinz-lemke/sources/pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md) |
| Facebook guessing game | [`../../don-hopkins/sources/2026-07-24-facebook-guessing-game.md`](../../don-hopkins/sources/2026-07-24-facebook-guessing-game.md) |
| Declare repo | https://github.com/davidtemkin/declarelang |

---

## Episode cast map (from this discussion)

**Temkin** (Declare + OL 5.0) · **Steele** (ISP / LZX lineage) · **Ungar** (Self × Laszlo) ·
**Don** (Svelte/Micropolis/MOOLLM) — three-way or sequential shows.

↑ [`declarelang.md`](declarelang.md) · [`sources/README.md`](README.md)
