# schemas/

**Contracts** — portrayal ethics, invitations, rig shape. Yaml canonical; this README invites humans in.

## Files

| Schema | Purpose | Used by |
|--------|---------|---------|
| [`portrayal-standards.yml`](portrayal-standards.yml) | Public-safe guest portrayals — tone, citations, subject rights | [`../characters/`](../characters/README.md) |
| [`audience-character.yml`](audience-character.yml) | Self-authored TicketPR MOOLLM characters — per show, not guest portrayal | [`../repo-shows/_TEMPLATE/audience/`](../repo-shows/_TEMPLATE/audience/README.md) |
| [`fictional-audience.yml`](fictional-audience.yml) | Sims characters, repo bots, tool-ghosts — ethics for seeded fictional TicketPRs | [`../repo-shows/will-wright/audience/`](../repo-shows/will-wright/audience/README.md) |
| [`audience-ethics-experiments.yml`](audience-ethics-experiments.yml) | Spectrum: game chars · consented real self-author · self-aware AI · family · historical · theological | audience/ |
| [`language-plugin.yml`](language-plugin.yml) | Base for pluggable audience languages — drop a `language-*` in; Don auto-discovers + translates | [`../characters/don-philahue/`](../characters/don-philahue/README.md) |
| [`language-simlish.yml`](language-simlish.yml) | Simlish (all Sims) — spoken-rendering; origins (Kearin/Lawlor) | audience `questions.yml` |
| [`language-palm-emoji.yml`](language-palm-emoji.yml) | Palm's Emoji Soul Tongue — dense glyphs; links into MOOLLM | [`palm/`](../repo-shows/will-wright/audience/palm/README.md) |
| [`language-robot.yml`](language-robot.yml) | Robolinguistics — dialects (beeps/glitch/wire); MCP endgame for Slats | bots |
| [`language-cow.yml`](language-cow.yml) | The Cow Plant's MOO (knows no English — Don must interpret) | cow-plant |
| [`../process/repo-show-regulars.yml`](../process/repo-show-regulars.yml) | Cross-show balcony regulars + recurring audience mascots | [`../repo-shows/will-wright/audience/`](../repo-shows/will-wright/audience/README.md) |
| [`invitation-workflow.yml`](invitation-workflow.yml) | draft → review → sent → replied | all invitations |
| [`guest-invitation-status.yml`](guest-invitation-status.yml) | Status enum + consent fields | CHARACTER.yml |
| [`rig-schema.yml`](rig-schema.yml) | rigs/*.rig.yml + **required SETUP.md** | [`../rigs/`](../rigs/README.md), drag race |
| [`rig-setup-dna.yml`](rig-setup-dna.yml) | SETUP.md viral DNA — emailable, LLM install protocol | [`../rigs/_TEMPLATE.SETUP.md`](../rigs/_TEMPLATE.SETUP.md) |
| [`markup-facade.yml`](markup-facade.yml) | Yaml girder → markdown views (LLM instance-first; deterministic bulk) | [`../process/markup-facades.yml`](../process/markup-facades.yml) |
| [`guest-skills-card.yml`](guest-skills-card.yml) | Universal CARD.yml — MTG abilities + Sims advertisements | [`../characters/*/CARD.yml`](../characters/README.md) |

## Read order

1. [`GLANCE.yml`](GLANCE.yml)
2. [`portrayal-standards.yml`](portrayal-standards.yml) — once, before reading guests
3. [`rig-schema.yml`](rig-schema.yml) — if submitting a rig

## Related

↑ [`../characters/README.md`](../characters/README.md) · [`../process/FORMAT.md`](../process/FORMAT.md) · [`../rigs/README.md`](../rigs/README.md)
