# Ideas to explore with Thomas Cherryhomes 📡

*Conversation hooks for a Repo Show — grounded in Thomas's public FujiNet/IRATA work,
the Feb 2026 VCF SoCal "State of FujiNet" talk, and the repo's Retrocomputing Drive /
Apple ][ / Micropolis Class stacks. Proposed topics Don would love to riff on **with**
Thomas; not quotes, not claims about what he thinks.*

[Portrayal standards](../../schemas/portrayal-standards.yml) · invitation draft — not yet sent

## Why these ideas fit

FujiNet is the archetype of **repo-native, community-built, cross-platform retro
infrastructure** — open hardware, open firmware, a dozen vendors, 5,000+ users, and a
"giant tree fort" where people roll up their sleeves and ship. That matches Micropolis
Class design-in-public and the WillWrightShowForFood bridge episodes (emulated runtimes,
character round-trips, real iron on the wire). Thomas's life-message — *"We should not
argue to win. Rather, we should argue to give and gain insight."* — is good Repo Show
energy.

## The hooks

### 1. What FujiNet actually is (60-second truth, then live demo)

**FujiNet** is an ESP32-based multi-peripheral that sits on a vintage machine's I/O bus
(Atari SIO, Apple SmartPort, AdamNet, CoCo DriveWire/Becker, RS-232, parallel bus cards…)
and simultaneously emulates disk drives, printers, modems, clocks, and a novel **`N:` network
device** that offloads TCP/HTTP/HTTPS/TNFS/JSON to the ESP32 so 6502 code treats the
internet like a local peripheral.

Live segment: mount a disk from a TNFS server, boot it, show the web admin UI — same loop
Thomas demos with **fish** (search TNFS servers → select → boot).

### 2. FujiNet-PC + emulators — the show's browser-adjacent path

Three tiers for a Repo Show rig:

| Tier | Stack | Best for |
|------|-------|----------|
| **Atari 8-bit (easiest)** | [Fujisan](https://github.com/pedgarcia/fujisan) — bundles FujiNet-PC, enable NetSIO | Mac (best), Linux, Windows (v2+) |
| **Atari 8-bit (classic)** | atari800 + FujiNet-PC (`-netsio`) | Mac/Linux native builds |
| **Atari 8-bit (Windows classic)** | Altirra + FujiNet-PC | Windows-first accuracy |
| **Apple II** | AppleWin (FujiNet fork, Linux `sa2`) + FujiNet-PC + SPoverSLIP card | Linux VM or native; pairs with repo Apple ][ stack |
| **CoCo** | MAME/VCC/XRoar Becker port → FujiNet-PC on localhost:65504 | Cross-platform via MAME |
| **Browser-only (no FujiNet yet)** | POM2, AltirraSDL WASM, RetroAppleJS, bevy-atari | Audience play-along; no live N: device |

**NetSIO** bridges emulators to FujiNet-PC over UDP — emulating SIO pins the real hardware
uses. Fujisan (Paulo Garcia) embedded this so FujiNet "just works" inside the emulator UI.

Stretch: two-window demo with **Lars Brinkhoff** — ITS/MACLISP in one pane, FujiNet
Battleship or fish boot in another. Emulated AI Lab × networked tree fort.

### 3. Cross-platform multiplayer — FujiNet Battleship & the Game Lobby

Four unlike platforms playing **FujiNet Battleship** head-to-head (Atari, PC/RS-232, CoCo,
Apple II). Same reticle, three opponents, dog-pile strategy. Eric Carr's games + the lobby
as social glue across siloed retro communities.

Also: **five card stud**, **Fuji Llama**, Wade Ripkowski's productivity apps, Rich Stevens'
CoCo ports (Wikipedia, weather, ChatGPT-with-voice on a Color Computer 3).

### 4. fish — solving discoverability on a growing TNFS universe

Polish Atari contingent's **FujiNet interactive shell**: search term → scan multiple TNFS
servers → pick → mount → boot. Written in C, portable to other platforms. Community
infrastructure problem: as TNFS servers proliferate, how do you find software? fish is the
answer Thomas wants ported everywhere.

### 5. Netstream — when SIO latency isn't enough

**Midi Maze** over the internet — tunneling what was a local MIDI chain through UDP/TCP.
Atari pays two POKEY channels for serial streaming. Opens arcade-latency multiplayer for
platforms that need it. Contrast with platforms that don't need Netstream at all.

### 6. Bus-driven future — MSX, Intellivision, H89, ISA

The **ESP32 + RP2350** pattern: RP2350 wiggles timing-critical bus lines; ESP32 does WiFi.
MSX cartridge ROM streamed from a network server; Intellivision's bizarre CP1600 bus phases;
H89 community hardware (Norberto Quayado); RS-232 for MS-DOS drive letters from TNFS.

**Fuji Versal** — universal protocol between ESP32 and bus controllers. Refactoring year:
collapse duplicated bus/device code, add regression testing (`localtest` + JSON command spec).

### 7. NOS — disk-less DOS entirely on the network

Network Operating System: no physical drives, everything on TNFS/SMB. Two dozen DOS choices
on apps.irata.online with FujiNet tools preinstalled. **NLOAD** loading binaries from a
Windows SMB share — the closed loop Thomas demoed at VCF.

### 8. IRATA.ONLINE / PLATO / PLATOTerm — the other half of Thomas's public work

FujiNet is hardware; **IRATA.ONLINE** is a living PLATO-style service. **PLATOTerm** as
terminal. **Compute's Gazette** "FujiNet Report" column — cross-platform C examples, writing
articles *in AtariWriter* and uploading through FujiNet. Community gravity well: Atari people
meeting Apple people meeting CoCo people.

### 9. Community model — vendors, tree fort, "argue to gain insight"

5,000+ users, ~dozen vendors (Future Vision Research in the room at VCF), anyone can become
a vendor. Chris Osborne's refactor + regression tests; Rich Stevens "came in off the street";
Shunichi Kitahara quietly porting Battleship to Apple II. How open source + open hardware
scales without a single company gatekeeping.

### 10. Repo Show integration — Micropolis Class × retro bridges

Concrete episode angles for this repo:

- **apple2-drive** — real ][ on FujiNet vs browser emulators (POM2 WASM for audience,
  AppleWin+FujiNet-PC for Thomas's segment)
- **game-bridge-mind-mirror** — emulated Apple ][ binary in browser + FujiNet as the
  "real wire" variant
- **pdp10-maclisp-drive × thomas** — paired with Lars; preservation × playable infrastructure
- **yoot-tower-revival** — Thomas already listed; RE/emulator hackers + cross-platform C ethos
- Ship a **`rigs/fujinet-flair-lap.SETUP.md`** on stream — reproducible Fujisan or
  AppleWin+FujiNet-PC path others can fork

### 11. Technical debt as feature — the refactor nobody wants

Thomas's honest VCF moment: programmers hate documentation, testing, and refactoring —
but FujiNet's codebase is big enough that an Atari fix breaks Atom. **localtest** framework,
JSON command spec in the wiki, Chris Osborne leading the bus/device collapse. "Maybe not for
the rest of this year" on production releases — worth a frank thread on mature community
projects vs. new platform bringups.

### 12. Emulators on Mac, Windows, and browser — what's actually good in 2026?

**Mac:** Fujisan (FujiNet-first Atari), Atari800MacX, OpenEmu (limited net), MAME, POM2 native

**Windows:** Altirra (gold standard Atari + FujiNet-PC), Fujisan 2.0+ (catching up),
AppleWin (FujiNet fork primarily Linux), MAME/VCC (CoCo)

**Browser / WASM:** AltirraSDL (cycle-accurate Atari, multiplayer lobby), POM2 (Apple II
family, 3D voxel view, time-travel rewind), RetroAppleJS (Apple II+ IDE in JS), cyanIIde/microM8,
bevy-atari (Rust/WebGL2, good-enough XL/XE). **No production FujiNet-in-WASM yet** — browser
audience plays local; networked segments use native emulator + FujiNet-PC or real hardware.

**Gap to discuss:** what would it take to expose NetSIO or Becker port through WASM for a
fully browser-native FujiNet demo?

## Suggested live segments (pick 2–3)

1. **fish → Dig Dug** — search, mount, boot from TNFS (proves the internet-as-peripheral story)
2. **FujiNet Battleship** — 4-player cross-platform if guests available; otherwise solo + lobby tour
3. **Fujisan one-click** — enable NetSIO, show drive UI, printer to PDF
4. **AppleWin + SPoverSLIP** — tie to repo Apple ][ / Mind Mirror bridge episode
5. **NLOAD from SMB** — enterprise file share → 8-bit binary load (weird and wonderful)
6. **Compute's Gazette column** — show writing in AtariWriter, 11 KB chunk limit, upload via N:

## Pairings already in repo

- [**Lars Brinkhoff**](../lars-brinkhoff/) — emulated ITS × real retro net
- [**Yoot Tower revival**](../../repo-shows/yoot-tower-revival/) — RE/emulator summit
- [**apple2-drive**](../../process/challenges/apple2-drive.yml) — FujiNet real iron path

### 13. NetSIO — what it is and how hard is browser WASM?

**NetSIO** (FEP-003) is FujiNet's **UDP protocol on port 9997** that carries Atari **SIO bus
signals over the network** — not just bytes, but command ON/OFF, proceed, interrupt, motor,
speed changes, and a **credit/sync** system so ACK/NAK meets Atari's **16 ms** timing even
when FujiNet-PC is on another host.

```
Emulator (Atari 800)  ←→  NetSIO UDP  ←→  FujiNet-PC  ←→  WiFi/TNFS/Lobby/N:
     ↑ SIO pins emulated as messages, not a serial cable
```

**Already shipped (Atari):** atari800 upstream NetSIO (Mozzwald), Fujisan bundled FujiNet-PC,
Altirra via Python `netsio-hub.py` + custom `.atdevice`, FEP-003 spec updated Apr 2026.

**Apple II equivalent:** **SPoverSLIP** — SmartPort packets over SLIP/TCP to FujiNet-PC
(different bus, different bridge; same *virtual peripheral on the network* idea).

**NetSIO-in-WASM difficulty (Atari path — the template):**

| Layer | Effort | Notes |
|-------|--------|-------|
| Emulator core in WASM | **Large** (done for AltirraSDL, bevy-atari — without NetSIO) | Emscripten + SDL→canvas |
| NetSIO client in WASM | **Medium** | UDP from browser → **blocked**; needs **WebSocket relay** to a NetSIO hub |
| FujiNet-PC in WASM | **Very hard** | Full POSIX network stack, threads, TNFS/TLS — nobody has shipped this |
| **Pragmatic pattern** | **Medium** | Browser emu + **server-side FujiNet-PC** + WebSocket shim (same as Becker port :65504 for CoCo) |

**Confidence ~85%:** "NetSIO through WASM" really means **WASM emulator + sidecar FujiNet-PC**,
not FujiNet entirely in-tab. Fujisan proves the sidecar pattern on desktop; browser needs one
extra hop (WebSocket).

**Ask Thomas:** Is a **WebSocket→NetSIO hub** an acceptable FujiNet-side project? Would the
project bless a reference implementation for apple2js / AltirraSDL WASM?

### 14. Three tracks — hardware, native emulator, web platform

Thomas's world is intentionally **three parallel tracks**, not a single winner:

| Track | Role | FujiNet today |
|-------|------|---------------|
| **Real iron** | Shows, vendors, bus timing, community growth | Production ESP32 on SIO, SmartPort, AdamNet, RS-232… |
| **Native emu + FujiNet-PC** | Dev, CI, `localtest`, demos without hardware | Fujisan (Atari), AppleWin+SPoverSLIP (Apple), MAME Becker (CoCo) |
| **Browser WASM** | Audience scale, preservation URLs, Micropolis bridges | **No FujiNet yet** — POM2, IA/MAME, apple2js run local-only |

Repo Show segment: **same TNFS mount** on real Atari, Fujisan window, and (stretch) browser
client via sidecar — proves one network, three attachment styles.

### 15. Why FujiNet picked AppleWin (not "because Windows")

**Historical:** AppleWin is the **reference-grade** Apple II/IIe emulator — deep peripheral
model (Mockingboard, Phasor, RamWorks, debugger, WOZ/HDV). apple2js's README credits AppleWin
source as "a goldmine of useful references."

**Linux:** FujiNet did **not** port Windows AppleWin. They forked the **Linux SDL port**
([markjfisher/AppleWin](https://github.com/markjfisher/AppleWin) → [FujiNetWIFI/AppleWin](https://github.com/FujiNetWIFI/AppleWin)
`linux` branch, `sa2` binary) and added **fenrock's SPoverSLIP** card (slot type 25). Yes, the
name says Win; the FujiNet integration path is **Linux-first** (also in [fujinet-vm](https://github.com/FujiNetWIFI/fujinet-vm)).

**Why not POM2 or apple2js for FujiNet?** Those stacks weren't built with SmartPort→SLIP→FujiNet-PC
 plumbing. AppleWin already had SmartPort/IWM depth; fenrock bridged it to FujiNet-PC.

**Palace intrigue:** Active **AppleWin** development is on **upstream Windows** (Tom Charlesworth
team — v1.32.0 May 2026). Active **Linux port** is **audetto/AppleWin** (commits Jun 2026) —
**without** SPoverSLIP. The **FujiNet fork** is a **small integration branch** (~2025 merges),
not the main emulator effort. Risk: FujiNet AppleWin drifts from audetto/upstream.

### 16. Virtual FujiNet on Apple II — two layers of "drivers"

Yes — rigging requires **both** sides Thomas would recognize:

**A. On the emulated Apple (6502 software — same as real hardware):**

- ProDOS/DOS with **FujiNet tools** (mount, N: handlers, lobby clients) — from
  `fujinet-apps`, cc65-built, on `apps.irata.online`
- SmartPort firmware path expects a **SmartPort device** at the other end of the bus

**B. In the emulator (virtual hardware module):**

- **SPoverSLIP card** in an AppleWin slot — translates SmartPort/IWM traffic to **TCP SLIP**
  to localhost FujiNet-PC (~port 1985)
- **FujiNet-PC (APPLE build)** — same firmware logic as ESP32; web admin :8000; presents
  virtual drives, N:, modem, printer to the SLIP link

Real iron skips (B)'s SLIP card and uses physical SmartPort adapter instead. Software (A) is
largely the same. That's the "virtual FujiNet hardware that clicks into the network" model.

### 17. Apple II emulator landscape (2026) — alternatives, web, activity

| Emulator | Platform | Active? | Web | Hackable / bot-friendly | FujiNet |
|----------|----------|---------|-----|-------------------------|---------|
| **AppleWin** (upstream) | Windows | ✅ v1.32 (May 2026) | ❌ | Debugger; weak API | via FujiNet fork only |
| **audetto AppleWin** (`sa2`) | Linux, libretro | ✅ Jun 2026 | ❌ | ImGui debugger | ❌ (no SPoverSLIP) |
| **apple2js** (whscullin) | Browser, TS | ✅ Apr 2026 push | ✅ | **Best for TS hot-write** | ❌ |
| **apple2ts** (ct6502) | Browser, TS | ✅ Apr 2026 | ✅ | URL params, save-state, time travel | ❌ |
| **POM2** (habib256) | Browser WASM + native | ✅ active | ✅ | Rewind, 3D view; AI HTTP **native only** | ❌ |
| **MAME** (`apple2e`, etc.) | everywhere | ✅ constant | ✅ via Emularity | **Opaque** — CLI/config | Becker/CoCo path; not Apple SLIP in browser |
| **RetroAppleJS** | Browser JS | maintenance | ✅ | Full IDE in JS | ❌ |
| **KEGS** | Win/Mac/Linux | ✅ (IIGS) | ❌ | 16-bit GS, not 8-bit bridge focus | ❌ |
| **LinApple** | Linux | ⚠️ dormant | ❌ | superseded by audetto | ❌ |
| **AppleWin-rs** | Rust cross-platform | early | possible | **headless** for CI | ❌ greenfield |

**Scene vibe:** Apple II is **healthy but fragmented** — Windows AppleWin for fidelity,
audetto for Linux, TS emulators for web hackability, POM2 for wow-factor WASM, MAME for
archival breadth. No single center of gravity like Fujisan is becoming for Atari+FujiNet.

### 18. apple2js — is it the right direction?

**For Micropolis Class (disk I/O, hot-write, Mind Mirror, character bridges): YES.**

- MIT license, **TypeScript**, ~500 stars, last push **Apr 2026**
- Don's stack doc explicitly chose it over MAME-wasm: *"hackable TS lib we can drive + write into"*
- Live sector/disk buffer writes while running = Don's signature move
- Pairs with **apple2ts** (Chris Torrence) for save-state/time-travel ideas — watch, don't fork blindly

**Limits:** Not what Internet Archive ships at scale. IIe-focused maturity varies; not a
FujiNet integration path without new bridge work. Community smaller than MAME but **aligned
with constructionist hacking**, not archival CLI.

**Ask Thomas:** Does FujiNet care about a **SmartPort shim for apple2js**, or is apple2js
 strictly "parallel track" while FujiNet standardizes on AppleWin+SPoverSLIP for Apple?

### 19. Internet Archive ≠ apple2js — what IA actually uses

**Internet Archive / Emularity uses MAME (JSMESS/JSMAME)**, not apple2js.

- [Emularity](https://github.com/db48x/emularity) loader + prebuilt MAME WASM engines on archive.org
- Apple II Library (4am collection, etc.) → **MAME `apple2e`/`apple2c` drivers** + WOZ images
- Millions of users; **legal preservation at scale** already solved

**Why MAME for IA:** one framework → **hundreds of platforms** (Apple, PET, CoCo, arcade, consoles).
Split engines per machine to keep WASM size down (~many 2–10 MB builds vs one 60 MB blob).

**Why apple2js for us:** **transparent disk I/O layer** for character round-trips — MAME is an
opaque box unless you fork MAME itself (Don's stack: *"not a hackable TS library"*).

**Complementary strategy** (already in `apple2-emulator-stack.yml`): extend IA's reach with
**hackable layers on top**, talk to Thomas **before** Brewster — don't compete with Emularity.

### 20. Lars Brinkhoff ≠ MAME

**Lars uses SIMH** (PDP-10 KA10/KL10/KS10) for **ITS/MACLISP** — not MAME, not apple2js.
Different preservation lane: timesharing OS reconstruction vs 6502 userspace. Pairs with Thomas
as **emulated AI Lab × networked 8-bit**, not as shared emulator choice.

MAME **does** include many platforms (PET, TRS-80, Apple, PDP-1, etc.) — attractive for a
**one-engine retro drive** — but ITS lives in **SIMH + PDP-10/its**, not MAME's PDP-10 drivers
(different goal, different community).

### 21. MAME as unified engine — appeal and politics

**Appeal:** One codebase → Apple II + PET + CoCo + TRS-80 + arcade + …; IA already proved
browser WASM path; FujiNet already uses **MAME Becker port** for CoCo.

**Friction (documentable, not personal):**

- **License history:** long non-commercial period → **BSD-3-Clause** since 2016; years of
  community debate; downstream packagers and frontends (Emularity, Ample) navigate snapshots
- **Governance:** decentralized maintainer hierarchy — powerful for breadth, slow for cross-cutting
  features (e.g. generic "FujiNet slot" API across drivers)
- **Hackability:** config-driven, not TS library — wrong tool for **live disk hot-write** unless
  you commit to maintaining a MAME fork
- **Community culture:** large forums, strong opinions, preservationist identity — collaborate via
  **IA/Emularity lane**, not by expecting warm embrace of experimental AI bot layers inside MAME core

**Pragmatic split:** MAME for **breadth + IA alignment + CoCo Becker**; apple2js for **Apple ][
bridge organelles**; SIMH for **PDP-10/ITS**; AppleWin+SPoverSLIP for **FujiNet Apple dev**.

### 22. Project proposals to discuss with Thomas

| # | Proposal | Track | Ask |
|---|----------|-------|-----|
| **P1** | **`fujinet-vm` rig doc** — reproducible AppleWin+SPoverSLIP+FujiNet-PC for shows/CI | Native emu | OK to bless as reference SETUP? |
| **P2** | **WebSocket→NetSIO hub** (reference server) + browser emu client | Web + sidecar | FujiNet-approved protocol extension? |
| **P3** | **SPoverSLIP upstream to audetto/AppleWin** — end FujiNet fork drift | Native emu | Who owns merge — fenrock, Thomas, Chris Osborne? |
| **P4** | **apple2js L0–L2 disk stack** + optional FujiNet peer API (server FujiNet-PC) | Web | Parallel or integrated with FujiNet Apple software? |
| **P5** | **Emularity complement** — hot-write layer doc for IA collaboration pitch | Web + IA | Thomas intro before Brewster (per stack doc sequence) |
| **P6** | **`localtest` in CI** — apple2js headless tests + native FujiNet-PC integration job | CI | Chris Osborne's framework — accept external PRs? |
| **P7** | **Cross-platform Battleship segment** — apple2js or AppleWin client in lobby vs real iron | All three | Minimum client for Apple II lobby boot? |
| **P8** | **Mind Mirror bridge** — emulated runtime organelle + FujiNet "real wire" variant | Web + hw | ProDOS+FujiNet tools on mounted image — Thomas's cc65 path? |

### 23. Decision — AppleWin vs apple2js vs WASM

**Canonical plan:** [`process/apple2-fujinet-bridge.yml`](../../process/apple2-fujinet-bridge.yml)

One network (TNFS, lobby, N:), three attachment styles. **Do not pick one emulator to rule them all.**

| Need | Choose | Avoid |
|------|--------|-------|
| FujiNet-native Apple dev, CI, cc65 apps, Thomas demo | **AppleWin (`sa2`) + SPoverSLIP + FujiNet-PC** or **fujinet-vm** | Porting AppleWin to WASM first |
| Browser hot-write, bots, AI, Mind Mirror L0–L2 | **apple2js** (TS stack per DonHopkins `apple2-emulator-stack.yml`) | MAME-wasm as primary hack surface |
| IA-scale preservation, multi-machine breadth | **MAME + Emularity** (complement, don't compete) | Expecting in-core MAME disk surgery API |
| Audience wow in browser | **POM2 WASM** (parallel track) | POM2 as FujiNet integration path today |

**WASM + FujiNet truth:** Browsers cannot speak NetSIO UDP or SPoverSLIP TCP directly to FujiNet-PC.
The shipped pattern is **WASM emulator + server-side FujiNet-PC + WebSocket relay** (Fujisan does
sidecar on desktop; browser adds one hop). **FujiNet-PC-in-tab is not on anyone's roadmap.**

**Three phases (stub yml):**

1. **Native rig** — `apple2-fujinet-flair-lap.SETUP.md` (fujinet-vm or Linux sa2 + FujiNet-PC)
2. **apple2js L0–L2** + optional server FujiNet peer — character bridges, Thomas before Brewster
3. **Optional** — SPoverSLIP upstream merge, reference WebSocket hub — **not blocking 1–2**

**Decision rule:** If the task is *join FujiNet's network*, start Phase 1. If the task is *hack a
running disk for a character bridge*, start Phase 2. Phase 3 only after Thomas blesses protocol/merge scope.

## Sources (public)

- VCF SoCal Feb 2026 — "State of FujiNet" (Thomas Cherryhomes)
- https://fujinet.online · https://github.com/FujiNetWIFI/fujinet-firmware
- https://fujinetwifi.github.io/fujinet-docs/
- FEP-003 NetSIO: https://github.com/FujiNetWIFI/fujinet-firmware/wiki/FEP-003
- Fujisan: https://github.com/pedgarcia/fujisan
- FujiNet-PC + atari800 NetSIO: https://fujinet.online/2025/06/24/fujinet-pc-for-atari800-emulator/
- Virtual Apple II / CoCo wiki pages on GitHub
- apple2js: https://github.com/whscullin/apple2js · apple2ts: https://apple2ts.com/
- Emularity / IA: https://github.com/db48x/emularity · https://blog.archive.org/2016/03/04/saving-500-apple-ii-programs-from-oblivion/
- AppleWin 1.32: https://github.com/AppleWin/AppleWin · audetto Linux port
- POM2: https://github.com/habib256/POM2
- Don Hopkins apple2-emulator-stack: `SimHacker/DonHopkins/.../apple2-emulator-stack.yml`
