<!-- hand-authored -->

# Micropolis AI Drag Race

> **Format spec:** [process/micropolis-ai-drag-race.md](../../process/micropolis-ai-drag-race.md) · **Host:** [Don Philahue](../../characters/don-philahue/) · **Judge:** [Slats](../../characters/robots/slats/)

**Tagline:** *Start your engines — may the best rig werk, commit, and merge.*

Flagship **Repo Show variety format** — rig personas (Let's Make a Deal costumes + [`rigs/*.rig.yml`](../../rigs/README.md)) compete in design challenges, Code That Spec minis, Stiletto Sprints, [Manual Transmission](../../process/manual-transmission.md) laps, [Retrocomputing Drive](../../process/challenges/retrocomputing-drive.md) (MACLISP on ITS, Apple ][, Lisp Machine Hack-Off), and lip-sync-for-your-commits finales.

Cursor spend CSV is the **piss test**. Multi-rubric scoring via MOOLLM [rubric](https://github.com/SimHacker/moollm/tree/main/skills/rubric) + [experiment](https://github.com/SimHacker/moollm/tree/main/skills/experiment). Winners merge to `skills/` + `packages/`; werk.

---

## Challenge rotation

| Challenge | Spec |
|-----------|------|
| Design challenge | Spec CARD → branch + README runway + yaml backbone |
| [Code That Spec](../../process/code-that-spec.md) | Audience chants **CODE THAT SPEC!!!!!** |
| [Manual Transmission](../../process/manual-transmission.md) | Smallest model / fewest tokens |
| [Retrocomputing Drive](../../process/challenges/retrocomputing-drive.md) | Declare language + tools + platform |
| Apple ][ lap | [`apple2-drive.yml`](../../process/challenges/apple2-drive.yml) |
| PDP-10 MACLISP lap | [`pdp10-maclisp-drive.yml`](../../process/challenges/pdp10-maclisp-drive.yml) |
| Lisp Machine hack-off | [`lisp-machine-hack-off.yml`](../../process/challenges/lisp-machine-hack-off.yml) |
| Stiletto sprint | Shortest honest bid that still ships |
| Lip-sync for your commits | [thoughtful-commitment](https://github.com/SimHacker/moollm/tree/main/skills/thoughtful-commitment) on stream |

**Live overlay:** [brain stream](../../process/brain-stream.md) · **Proof family:** [AI-offs](../../process/ai-offs.md)

---

## Example rigs

| Rig | Platform |
|-----|----------|
| [`lisp-machine-symbolics.rig.yml`](../../rigs/lisp-machine-symbolics.rig.yml) | Symbolics Genera |
| [`lisp-machine-lmi.rig.yml`](../../rigs/lisp-machine-lmi.rig.yml) | LMI Lambda |
| [`stick-shift-composer-moollm.rig.yml`](../../rigs/stick-shift-composer-moollm.rig.yml) | Multi-model routing |
| [`apple2-flair-lap.rig.yml`](../../rigs/apple2-flair-lap.rig.yml) | Apple ][ flair |

Slats rubric: [`characters/robots/slats/judge-rubric.yml`](../../characters/robots/slats/judge-rubric.yml) (machine girder)

---

## In this directory

- [`micropolis-ai-drag-race.yml`](micropolis-ai-drag-race.yml) — machine reading (seed spec)
- `SHOW.yml` — add when ready to run the show

↑ [`../README.md`](../README.md) · [ShowMaker network](../../process/showmaker-network.md)
