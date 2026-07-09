# Lift pipeline

[Play-learn-lift skill](https://github.com/SimHacker/moollm/tree/main/skills/play-learn-lift) · [Artifactory](artifactory.md) · [repo-show skill](../skills/repo-show/)

---

## The hook

WWSFF is the **dogfooding kitchen**; MOOLLM is the **public pantry**. Play concretely here, then **LIFT** proven core down into public MOOLLM skills.

**Use before abstract.** The concrete instance teaches the generic. Don't invent the generic first.

## Oliver Steele precedent — Instance-First Development

Implement for a single instance, then refactor instance into class supporting multiple instances. "Easier to generalize from two examples than from one." OpenLaszlo/LZX + Garnet lineage. Don: "tacking against the wind."

## Live example

| Concrete | Generic | Status |
|----------|---------|--------|
| `repo-show` skill | `show` skill | in_use — **do NOT lift yet** |

Rule: use repo-show enough that it surprises us; then lift proven core.

## Lift readiness checklist

- Used in anger more than once
- Use surfaced at least one surprise
- Can name what it's good for FROM USE
- Second real caller would be served
- Provenance points at actual logs

## Show hooks

- **Lift ceremony on stream:** repo-show → generic show skill when second franchise needs it.
- **Artifactory already lifted:** point at public MOOLLM skill as done example.

## Deeper links

| Topic | Where |
|-------|--------|
| YouTube bridge (TODO lift) | [youtube-bridge-skill.md](youtube-bridge-skill.md) |
| Live repo policy | [live-repo.md](live-repo.md) |
| Trails | [../TRAILS.md](../TRAILS.md) |

↑ [process index](README.md) · Girder: `lift-pipeline.yml`
