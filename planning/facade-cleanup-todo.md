# Facade cleanup — stop linking humans to girders

> **Status:** in progress (2026-08-18)  
> **Policy anchor:** [Curb appeal meets brutalism](../process/vision-and-ambition.md#curb-appeal-meets-brutalism) · [What we are not doing](../process/vision-and-ambition.md#what-we-are-not-doing)  
> **Registry:** [`process/markup-facades.yml`](../process/markup-facades.yml) — deterministic yaml→md is **temporary fallback**, not the human layer

Humans read markdown facades (warm, images, links). Machines read yaml girders. **Do not link visitors to girders.** Do not script-generate markdown when a hand-authored instance is cheaper and 10× better.

---

## Priority order

| # | Task | Status | Notes |
|---|------|--------|-------|
| **P0** | [Policy + stop the bleeding](#p0-policy--stop-the-bleeding) | done | Vision doc + repo-shows README |
| **P1** | [Gosling media readable editions](#p1-gosling-media-readable-editions) | done | Template for photo sidecars |
| **P2** | [Quarantine readme-from-yml.py](#p2-quarantine-readme-from-yml) | done | hand-authored marker + no silent overwrite |
| **P3** | [Hand-author repo-show-format.md](#p3-hand-author-repo-show-format) | done | Readable prose; instance_first in registry |
| **P4** | [Retire remaining GENERATED process facades](#p4-retire-generated-process-facades) | done | all 7 instance_first; fallback list empty |
| **P5** | [Fix vision + entry high-traffic yml links](#p5-fix-high-traffic-yml-links) | in progress | vision prose cleaned; TRAILS reactor link done |
| **P6** | [Triage 63 script-generated show READMEs](#p6-triage-script-show-readmes) | done | Tier A: 6/6 hand-authored |
| **P7** | [Media sidecar sweep](#p7-media-sidecar-sweep) | in progress | Will Wright priority bucket (5 sidecars + head-shot gallery) |
| **P8** | [Character scaffold README uplift](#p8-character-scaffold-readmes) | pending | 128 boilerplate guest pages — upgrade on invitation priority |

---

## P0 — Policy + stop the bleeding

- [x] Add to **What we are not doing**: no linking humans to yaml girders; no script-generated markdown when hand-authored facades exist
- [x] Add to **Curb appeal meets brutalism**: facade = `.md` humans read; girder = `.yml` machines read; link to `.md`
- [x] **`repo-shows/README.md`**: remove "run readme-from-yml.py to regenerate" — replace with hand-author-first policy
- [x] **`skills/repo-show/SKILL.md`**: hand-authored facade policy; `.md` links not `.yml` girders

**Done when:** a new contributor reading repo-shows/ or vision-and-ambition never gets told to run yaml→md scripts for human pages.

---

## P1 — Gosling media readable editions

- [x] **`characters/james-gosling/media/gosling-young-pdp8-hotrod.md`**
- [x] **`characters/james-gosling/media/gosling-hobees-lunch.md`**
- [x] Repoint links: vision, james-gosling README/invitation/ideas, richard-stallman README
- [x] **`media/README.md`**: link to `.md` editions first
- [x] **`gosling-hobees-lunch.yml` see_also**: point at `.md` sibling

**Done when:** [PDP-8 hotrod](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/james-gosling/media/gosling-young-pdp8-hotrod.md) opens as a readable page with the photo visible on GitHub.

---

## P2 — Quarantine readme-from-yml.py

- [x] Script header: **DEPRECATED for human facades** — bootstrap empty dirs only
- [x] Refuse to overwrite README if file contains `<!-- hand-authored -->`
- [x] Refuse `--force` on non-stub READMEs (no `machine reading (seed spec)` marker)
- [ ] Remove `--force` from docs entirely; rename to `--bootstrap-only` (optional follow-up)

**Done when:** `python3 scripts/repo-shows/readme-from-yml.py` cannot destroy ebike-safari/README.md.

---

## P3 — Hand-author repo-show-format.md

- [x] Replace GENERATED tree-dump with readable prose (keep yaml girder for machines)
- [x] Mark `render.mode: llm` / `instance_first` in `markup-facades.yml`
- [x] Replace inline `.yml` links with `.md` companions where they exist
- [x] Delete `<!-- GENERATED -->` banner

**Done when:** repo-show-format.md reads like vision-and-ambition.md, not a yaml printout.

---

## P4 — Retire remaining GENERATED process facades

Hand-author or mark `instance_first` (skip generator):

| File | Girder | Status |
|------|--------|--------|
| `process/micropolis-ai-drag-race.md` | micropolis-ai-drag-race.yml | done |
| `process/ai-offs.md` | ai-offs.yml | done |
| `process/manual-transmission.md` | manual-transmission.yml | done |
| `process/homefun-grading.md` | homefun-grading.yml | done |
| `process/brain-stream.md` | brain-stream.yml | done |
| `process/orchestration-gold.md` | orchestration-gold.yml | done |
| `process/challenges/retrocomputing-drive.md` | retrocomputing-drive.yml | done |

**P4 complete:** `fallback_deterministic` list in `markup-facades.yml` is empty.

---

## P5 — Fix high-traffic yml links

Audit top offenders (2026-08-18 scan):

| Links | File | Action |
|------:|------|--------|
| 65 | `process/repo-show-format.md` | done (P3) |
| 42 | `process/vision-and-ambition.md` | prose links → `.md` (girder footers + K-lines OK) — batch 2 done |
| 59 | `process/README.md` | girder table intentional; fallback list updated |
| 29 | `process/micropolis-ai-drag-race.md` | done (P4) |

Rule: **public prose links to `.md`**. Girder links only in "machine reading" footers or maintainer sections.

---

## P6 — Triage script-generated show READMEs

~63 of ~132 `repo-shows/*/README.md` match script fingerprint (`machine reading (seed spec)`, flat tie dumps).

**Tier A — hand-author first** (linked from ENTRYWAYS, vision, HN-bound):

- will-wright-premiere ✓ (`<!-- hand-authored -->`)
- ebike-safari ✓ (`<!-- hand-authored -->`)
- james-gosling ✓ (hand-authored; PDP-8 hotrod → `.md` sidecar)
- micropolis-ai-drag-race ✓ (hand-authored; process links → `.md`)
- remembering-douglas-engelbart ✓ (hand-authored; yml ties removed)
- terry-winograd ✓ (`<!-- hand-authored -->`)

**Tier B — stub is fine** until show is scheduled: mark README with `<!-- seed-stub: run hand-author before linking publicly -->` or delete script README and leave only yml + note in INDEX.

**Tier C — bulk**: leave as internal seeds; ensure nothing in ENTRYWAYS/vision links to them yet.

---

## P7 — Media sidecar sweep

Pattern for every `characters/*/media/*.yml` photo sidecar:

```
artifact.png
artifact.yml   ← machine girder (verify, MOOLLM)
artifact.md    ← human facade: image + caption + context + see also
```

Priority buckets after Gosling:

1. will-wright media — **in progress:** ant-farm, transmogrifier, simcity box, gallium Pac-Man, head-shot progression; plus short-form-clips + adorable-minutes-ae + make-play-tools-show README
2. don-hopkins media heroes linked from vision/trails
3. memorial / remembering-* show artifacts

---

## P8 — Character scaffold README uplift

~128 character READMEs share scaffold boilerplate. Upgrade when:

- Invitation sent or accepted
- Linked from a live show README
- Named in ENTRYWAYS museum map

Not urgent for seeds with `consent: not_yet_asked` and no inbound links.

---

## Scripts inventory (for reference)

| Script | Role | Target state |
|--------|------|--------------|
| `scripts/repo-shows/readme-from-yml.py` | Show README generator | Bootstrap-only; never clobber hand work |
| `scripts/generate-markup-facades.py` | Process yaml→md | Skip all `instance_first`; shrink fallback list to zero |
| `scripts/repo-shows/promote-show-links.py` | yml → README links | Keep; but READMEs must be readable |
| `scripts/scaffold-invitation-characters.mjs` | Guest dir bootstrap | OK for stubs; not public facade |
| `scripts/scaffold-guest-skills-cards.py` | CARD/skill stubs | OK |

---

## Hand-authored shows (do not overwrite)

| Show | Notes |
|------|-------|
| `repo-shows/ebike-safari/` | `<!-- hand-authored -->` on README |
| `repo-shows/will-wright-premiere/` | Flagship — `<!-- hand-authored -->` |
| `repo-shows/james-gosling/` | `<!-- hand-authored -->` |
| `repo-shows/micropolis-ai-drag-race/` | `<!-- hand-authored -->` |
| `repo-shows/remembering-douglas-engelbart/` | `<!-- hand-authored -->` |
| `repo-shows/terry-winograd/` | `<!-- hand-authored -->` |

---

↑ [`../process/vision-and-ambition.md`](../process/vision-and-ambition.md) · [`../repo-shows/README.md`](../repo-shows/README.md)
