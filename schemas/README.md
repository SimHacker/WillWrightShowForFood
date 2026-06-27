# schemas/

**Contracts** — portrayal ethics, invitations, rig shape. Yaml canonical; this README invites humans in.

## Files

| Schema | Purpose | Used by |
|--------|---------|---------|
| [`portrayal-standards.yml`](portrayal-standards.yml) | Public-safe guest portrayals — tone, citations, subject rights | [`../characters/`](../characters/) |
| [`invitation-workflow.yml`](invitation-workflow.yml) | draft → review → sent → replied | all invitations |
| [`guest-invitation-status.yml`](guest-invitation-status.yml) | Status enum + consent fields | CHARACTER.yml |
| [`rig-schema.yml`](rig-schema.yml) | rigs/*.rig.yml + **required SETUP.md** | [`../rigs/`](../rigs/), drag race |
| [`rig-setup-dna.yml`](rig-setup-dna.yml) | SETUP.md viral DNA — emailable, LLM install protocol | [`../rigs/_TEMPLATE.SETUP.md`](../rigs/_TEMPLATE.SETUP.md) |
| [`markup-facade.yml`](markup-facade.yml) | Yaml girder → markdown views (LLM instance-first; deterministic bulk) | [`../process/markup-facades.yml`](../process/markup-facades.yml) |
| [`guest-skills-card.yml`](guest-skills-card.yml) | Universal CARD.yml — MTG abilities + Sims advertisements | [`../characters/*/CARD.yml`](../characters/) |

## Read order

1. [`GLANCE.yml`](GLANCE.yml)
2. [`portrayal-standards.yml`](portrayal-standards.yml) — once, before reading guests
3. [`rig-schema.yml`](rig-schema.yml) — if submitting a rig

## Related

↑ [`../characters/README.md`](../characters/README.md) · [`../process/FORMAT.md`](../process/FORMAT.md) · [`../rigs/README.md`](../rigs/README.md)
