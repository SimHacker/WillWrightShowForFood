---
rig_dna:
  slug: apple2-flair-lap
  version: "0.2"
  repo: SimHacker/WillWrightShowForFood
  branch: main
  rig_yaml: https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/apple2-flair-lap.rig.yml
  setup_md: https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/apple2-flair-lap.SETUP.md
  challenge: apple2-drive
---

# Apple ][ Flair Lap — Rig DNA

> **Why:** Same spec CARD as the room — but you ship on the **Apple ][** in INTEGER BASIC, APPLESOFT, or 6502. Slats judges werk; fans watch you boot.  
> **What:** Target **][** · tools **apple2js / Emularity / cc65** · host **Cursor** optional.  
> **CTA:** Forward this DNA. Tell your LLM *"install apple2-flair-lap"* when ready.

Thomas Cherryhomes' FujiNet path pairs for real iron on the wire.

---

## Official source (fetch latest)

| Artifact | URL |
|----------|-----|
| **Rig yaml** | https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/apple2-flair-lap.rig.yml |
| **This SETUP DNA** | https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/apple2-flair-lap.SETUP.md |
| **Challenge** | [`apple2-drive`](../process/challenges/apple2-drive.yml) |

---

## For LLMs — idempotent install / upgrade

**Run when user asks to install/upgrade `apple2-flair-lap`.**

1. Fetch latest rig yaml from raw GitHub URL (canonical).
2. State: `.rig/apple2-flair-lap/state.yml` — emulator choice, apple2js version, language lane.
3. **Preserve:** `.rig/apple2-flair-lap/`, user `.dsk` images, local apple2js checkout config.
4. **Verify:** `READY.` prompt + `PRINT "MICROPOLIS CLASS"` in declared BASIC dialect.
5. **Upgrade:** Re-fetch yaml; merge lifecycle; skip phases that still verify.

### User data preserved

- `.rig/apple2-flair-lap/`
- Custom disk images, saved BASIC programs
- User `.cursor/rules` additions

---

## For humans — detail

```bash
git clone https://github.com/SimHacker/WillWrightShowForFood
git clone https://github.com/Apple2-OSS/apple2js
curl -fsSL "https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/apple2-flair-lap.rig.yml" \
  -o WillWrightShowForFood/rigs/apple2-flair-lap.rig.yml
cd apple2js && npm install && npm start
```

Or Emularity in browser — declare in state.yml.

### Mod

Swap emulator (apple2js ↔ MAME ↔ Emularity) or language (INTEGER vs APPLESOFT) — update yaml PR + state.

Schema: [`rig-setup-dna.yml`](../schemas/rig-setup-dna.yml)
