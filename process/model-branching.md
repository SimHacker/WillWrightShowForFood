# Model branching

[Manual Transmission](manual-transmission.md) · [Brain stream](brain-stream.md) · [Orchestration gold](orchestration-gold.md)

---

## The hook

Git branches parallel universes; chat branches parallel models. **Snapshot a Cursor session, fork at bubble N, replay prompts to model B instead of model A.** If B ships better cheaper faster — keep that trajectory. Analyze cost, speed, tokens, rubric scores, merge quality.

Stick shift — but you can rewind and try another gear at the same corner.

## Workflow

1. **Before fork:** cursor-mirror export-prompts + export-chat; git commit at fork point
2. **Fork:** new composer, same prompts up to bubble, different model
3. **Compare:** spend CSV per branch, rubric SCORE, timeline diff
4. **Decide:** keep, sashay, or cherry-pick files from either world

## Speed run format

Manual Transmission + model branching — multi-model slalom with rewind. Audience sees fork live on brain-stream overlay. Declare branches before the run.

## Orchestration gold²

Labeled fork points + paired trajectories + thoughtful commits with thinking-refs = supervised when-to-switch-model signal.

Proposed layout: `experiments/model-branches/<run-id>/` — not shipped yet.

## Show hooks

- **Live fork at bubble 17:** Branch A premium vs Branch B mini on overlay.
- **Post-run forensics:** Side-by-side spend + rubric table.

## Deeper links

| Topic | Where |
|-------|--------|
| cursor-mirror skill | [MOOLLM](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) |
| AI-offs analysis | [ai-offs.md](ai-offs.md) |
| Experiment skill | [MOOLLM experiment](https://github.com/SimHacker/moollm/tree/main/skills/experiment) |

↑ [process index](README.md) · Girder: `model-branching.yml`
