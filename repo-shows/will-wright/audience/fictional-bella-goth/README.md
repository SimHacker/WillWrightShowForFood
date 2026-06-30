# Bella Goth — TicketPR 👁️

*Sniff:* [`CHARACTER.yml`](CHARACTER.yml) · [`CARD.yml`](CARD.yml) · [`questions.yml`](questions.yml) · [`images/`](images/README.md)

**Missing since the loading screen.** Bella is a **planted fictional Sims character** — fan voice, not EA dialogue. She speaks **Simlish on air** (Don Philahue renders); her questions live in English here for readability.

This directory is the **worked example** for audience CARD **advertisements** — abilities as broadcast methods any orchestrator can invoke, same pattern as Sims object interactions.

> *"You put a MISSING poster of me on the box. Promise, or threat?"*

---

## Navigation

| | → |
|--|---|
| **Up** | [audience](../README.md) |
| **Show** | [will-wright show](../../README.md) |
| **Policy** | [FICTIONAL-AUDIENCE.md](../FICTIONAL-AUDIENCE.md) |
| **Template** | [_TEMPLATE/audience/](../../../_TEMPLATE/audience/README.md) |
| **Simlish schema** | [`language-simlish.yml`](../../../../schemas/language-simlish.yml) |

---

## CARD abilities (advertisements)

| Ability | When |
|---------|------|
| **ASK-WHERE-DID-I-GO** | Loading-screen lore — Strangetown, aliens, cow plant |
| **MORTIMER-MAC-AND-CHEESE** | Pleasantview domestic comedy |
| **CASSANDRA-PROM** | Teen drama from the other side of the mystery |
| **SIMLISH-HELLO** | `Sul sul... ooh be gah.` — signature spoken phrase |

Full CARD: [`CARD.yml`](CARD.yml) · schema: [`guest-skills-card.yml`](../../../../schemas/guest-skills-card.yml)

---

## Questions for Will

Five questions in [`questions.yml`](questions.yml) — an **output queue** addressed to `will-wright`.
When Will answers on air, replies append as `children` on that question (`kind: answer`, `by: will-wright`).
Other audience members may add `me_too`, `quorum`, or `discussion` — graphtal thread, HN-shaped.
Schema: [`question-tree.yml`](../../../../schemas/question-tree.yml).

**Disclosure:** `planted: true` · `running_gag: true` · on-air wink required.

---

## Images

Promo stills and 128² avatar — [`images/README.md`](images/README.md)

---

↑ [audience](../README.md) · [show](../../README.md) · [`CARD.yml`](CARD.yml)

*Raw directory:* [browse files in this folder](./)
