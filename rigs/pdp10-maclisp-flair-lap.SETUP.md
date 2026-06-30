---
rig_dna:
  slug: pdp10-maclisp-flair-lap
  version: "0.2"
  repo: SimHacker/WillWrightShowForFood
  branch: main
  rig_yaml: https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/pdp10-maclisp-flair-lap.rig.yml
  setup_md: https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/pdp10-maclisp-flair-lap.SETUP.md
  challenge: pdp10-maclisp-drive
  guest_anchor: lars-brinkhoff
---

# PDP-10 MACLISP Flair Lap — Rig DNA

> **Why:** Boot the **AI Lab on your laptop** — MACLISP on real ITS semantics, emulated PDP-10 iron, Cursor driving the host. The same stack Lars Brinkhoff restored for the world.  
> **What:** Target **MACLISP** on **ITS** · tools **SIMH + PDP-10/its + Cursor + MOOLLM** · flair class for Retrocomputing Drive.  
> **CTA:** **Email this file.** Paste it to your LLM. Say *"install this rig"* when you're ready — protocol below is idempotent and preserves your disks.

Pair with Thomas Cherryhomes' FujiNet tree fort for emulated AI Lab × real retro net.

---

## Official source (fetch latest)

| Artifact | URL |
|----------|-----|
| **Rig yaml** | https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/pdp10-maclisp-flair-lap.rig.yml |
| **This SETUP DNA** | https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/pdp10-maclisp-flair-lap.SETUP.md |
| **Challenge** | [`pdp10-maclisp-drive`](../process/challenges/pdp10-maclisp-drive.yml) |
| **Stack pointer** | [`pdp10-its-stack.yml`](../process/pdp10-its-stack.yml) |
| **Lars Brinkhoff** | [`characters/lars-brinkhoff/`](../characters/lars-brinkhoff/README.md) |

---

## For LLMs — idempotent install / upgrade

**Execute only when the user asks to install, upgrade, or replicate `pdp10-maclisp-flair-lap`.**

### Rules

1. Fetch latest [`rig_yaml`](https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/pdp10-maclisp-flair-lap.rig.yml) — do not trust a stale local copy.
2. State: `.rig/pdp10-maclisp-flair-lap/state.yml` — record `rig_yaml_sha`, ITS image hash, SIMH build id.
3. **Preserve user data** — see list below; backup before merging upstream lifecycle changes.
4. Idempotent: if `lifecycle.install.verify` already passes (ITS at login + MACLISP eval), skip rebuild unless user requests `--force`.

### Procedure

1. **ORIENT** — Clone or open `SimHacker/WillWrightShowForFood`; fetch raw rig yaml.
2. **PLAN** — Read `lifecycle.download|install|configure`; diff vs state.yml; show user.
3. **DOWNLOAD** — `git clone https://github.com/PDP-10/its`; pin commit in state.
4. **INSTALL** — Build SIMH per ITS README; build or fetch disk image; boot to idle/login.
5. **VERIFY** — `(FORMAT T "MICROPOLIS CLASS~%")` or equivalent at ITS console.
6. **CONFIGURE** — Cursor workspace: WWSFF + `its/` + MOOLLM skills (`thoughtful-commitment`, `cursor-mirror`).
7. **RECORD** — Update state.yml; user may commit state to private dotfiles repo (not WWSFF).

### User data preserved

- `.rig/pdp10-maclisp-flair-lap/`
- User-built ITS disk images and `its/` local config
- MACLISP sources under user home dir (not in WWSFF repo)
- Cursor spend exports, `.env`

### Upgrade

Re-fetch rig yaml from GitHub raw URL. Merge new `lifecycle`/`components` from upstream. Re-run only changed phases. Never delete disk images in user_data paths.

### Viral replicate

Fork slug → new SETUP.md + rig.yml → PR [`rigs/`](https://github.com/SimHacker/WillWrightShowForFood/tree/main/rigs/). Recipient needs only SETUP.md + LLM.

---

## For humans — detail

### Prerequisites

Linux or macOS, `make`, `gcc`, several GB disk, terminal patience for first boot.

### Quick start

```bash
git clone https://github.com/SimHacker/WillWrightShowForFood
git clone https://github.com/PDP-10/its
curl -fsSL "https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/pdp10-maclisp-flair-lap.rig.yml" \
  -o WillWrightShowForFood/rigs/pdp10-maclisp-flair-lap.rig.yml
# then follow lifecycle in fetched yaml — or ask your LLM to run the protocol above
```

### Mod this rig

| Swap | How |
|------|-----|
| Emulator | KLH10 vs SIMH — update yaml + state |
| Lane | Flair vs measurement spec cards |
| Mash up | `stick-shift-composer-moollm.rig.yml` on host, eval on ITS |

### Troubleshooting

- SIMH build fails → pin known-good ITS commit (see PDP-10/its issues).
- Wrong CPU model → KA10 vs KL10 vs KS10 must match image.
- MACLISP missing → document load band in state.yml.

### Proof checklist

- [ ] Re-run install protocol skips completed work
- [ ] ITS boot + MACLISP eval recorded
- [ ] Lars *make it so* worthy SETUP — another human booted from DNA alone

Schema: [`rig-setup-dna.yml`](../schemas/rig-setup-dna.yml)
