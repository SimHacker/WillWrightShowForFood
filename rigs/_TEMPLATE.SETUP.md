---
rig_dna:
  slug: your-rig-slug
  version: "0.1"
  repo: SimHacker/WillWrightShowForFood
  branch: main
  rig_yaml: https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/your-rig-slug.rig.yml
  setup_md: https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/your-rig-slug.SETUP.md
  schema: ../schemas/rig-setup-dna.yml
---

# Your Rig Name — Rig DNA

> **Why:** One sentence — why you'd pick this rig over bare Cursor.  
> **What:** Host orchestration + target platform + languages — your driver costume.  
> **CTA:** Email this file to a friend. Paste it into your LLM. *You* decide whether to run the install protocol below.

**Micropolis Class · Repo Show ·** declare [`rig_classes`](./your-rig-slug.rig.yml) honestly.

---

## Official source (fetch latest)

| Artifact | URL |
|----------|-----|
| **Rig yaml (canonical)** | https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/your-rig-slug.rig.yml |
| **This SETUP DNA** | https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/your-rig-slug.SETUP.md |
| **Browse rigs/** | https://github.com/SimHacker/WillWrightShowForFood/tree/main/rigs/ |
| **Challenge** | [`retrocomputing-drive`](../process/challenges/retrocomputing-drive.yml) |

Local copies go stale. Install/upgrade always pulls **latest yaml** from the raw URL unless you pin in `.rig/your-rig-slug/state.yml`.

---

## For LLMs — idempotent install / upgrade

**Run this section only when the user asks you to install, upgrade, or replicate this rig.**

### Rules

1. **Idempotent** — safe to re-run; skip completed phases if verify still passes.
2. **Preserve user data** — never delete or overwrite paths listed in [User data preserved](#user-data-preserved); backup before merging yaml changes.
3. **Fetch latest** — `GET` canonical `rig_yaml` URL above; compare SHA to `.rig/your-rig-slug/state.yml`.
4. **Plan first** — show diff summary + steps you'll run; wait for user OK unless they said "just do it".
5. **State file** — write `.rig/your-rig-slug/state.yml` (gitignored) with `{ installed_at, rig_yaml_sha, setup_md_sha, user_data_paths, user_overrides }`.

### Procedure

```
ORIENT   → Read sniffable head; fetch latest rig yaml + this SETUP from GitHub raw URLs
PLAN     → Load state.yml if exists; diff upstream yaml vs local; list skip/run/preserve
DOWNLOAD → lifecycle.download from rig yaml (clone repos, fetch images)
INSTALL  → lifecycle.install (+ verify string)
CONFIGURE→ lifecycle.configure (Cursor workspace, MOOLLM, components)
VERIFY   → Must pass rig lifecycle.install.verify
RECORD   → Update state.yml; optional thoughtful-commitment if committing to a repo
UPGRADE  → On re-run: merge new upstream yaml; apply user_overrides; re-verify only changed phases
```

### User data preserved

Do **not** clobber without explicit user request + backup:

- `.rig/your-rig-slug/` — local state, pins, notes
- User-created emulator disk images and local build artifacts
- `.env`, API keys, Cursor spend exports
- User-added `.cursor/rules` beyond what this rig template adds

Add rig-specific paths below:

- *(none yet — customize when you fork this DNA)*

### Viral replicate

To fork: copy this file + `your-rig-slug.rig.yml`, rename slug, rewrite sniffable head, PR to [WillWrightShowForFood/rigs/](https://github.com/SimHacker/WillWrightShowForFood/tree/main/rigs/). Recipient can bootstrap from **SETUP.md alone** + canonical yaml URL.

---

## For humans — detail

### Prerequisites

- OS / CPU
- Disk / RAM
- Tools (Node, brew, SIMH, …)

### Download

```bash
git clone https://github.com/SimHacker/WillWrightShowForFood
curl -fsSL "https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/your-rig-slug.rig.yml" \
  -o WillWrightShowForFood/rigs/your-rig-slug.rig.yml
# follow lifecycle.download in fetched yaml
```

### Install & verify

Follow `lifecycle.install` in the fetched rig yaml. Record pinned versions in `.rig/your-rig-slug/state.yml`.

### Configure & run spec CARD

See `lifecycle.use` in rig yaml. Challenge: [`retrocomputing-drive`](../process/challenges/retrocomputing-drive.yml).

### Mod this rig

Swap languages, tools, platform, emulator — update both yaml (PR upstream) and your local `user_overrides` in state.yml. Document in **Mod** section when you PR.

### Troubleshooting

*(Failures you hit — save the next driver an hour.)*

### Proof checklist (drag race / homefun)

- [ ] Idempotent re-run skips completed phases
- [ ] User data paths preserved on upgrade
- [ ] Verify passes on declared platform
- [ ] Optional: spend CSV + cursor-mirror composer id

---

Schema: [`rig-setup-dna.yml`](../schemas/rig-setup-dna.yml) · Rig: [`your-rig-slug.rig.yml`](./your-rig-slug.rig.yml)
