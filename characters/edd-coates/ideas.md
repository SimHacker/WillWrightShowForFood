# Ideas to explore with Edd Coates 👤

*Conversation hooks — **Don's proposed topics**, grounded in Edd's public work. Not quotes
put in Edd's mouth.*
[Portrayal standards](../../schemas/portrayal-standards.md) · friend · consent not_yet_asked

Audience README: [README.md](README.md) · North star: [game-ui-archive.md](game-ui-archive.md) ·
Queer Oui: [Queer Oui for the Straight GUI](../don-hopkins/queer-oui-for-the-straight-gui.md) ·
Jojo quality: [Jojo on UI](../don-hopkins/jojo-on-ui.md)

---

## Shows


| Episode | Seed |
| -------- | ---- |
| **Game UI Database & ethical archives** | [repo-shows/edd-coates/](../../repo-shows/edd-coates/) · [SHOW.yml](../../repo-shows/edd-coates/SHOW.yml) · [game-ui-archive.md](game-ui-archive.md) |
| **Pie menus, Gonzo, PieCraft** | [pie-menus-piecraft.yml](../../repo-shows/edd-coates/pie-menus-piecraft.yml) · [discussion notes](../../repo-shows/edd-coates/pie-menus-discussion-notes.md) · [Queer Oui for the Straight GUI](../don-hopkins/queer-oui-for-the-straight-gui.md) |
| **PIXIE / emulators / PadCrafter blinkenlights** | [pixie-pie-menus-pdp7.yml](../../repo-shows/pixie-pie-menus-pdp7.yml) · [Lars](../lars-brinkhoff/) · [Heinz](../heinz-lemke/) · [Engelbart](../douglas-engelbart/) |
| **The Two Catalogs** (pair) | [brad-and-edd-interaction-catalogs](../../repo-shows/brad-and-edd-interaction-catalogs.md) · [Brad Myers](../brad-myers/) |


---



## What would a Gonzo UI even be?

Don's working definition (open for Edd to shred):

> UI that reports from **inside** the interaction — subjective, stunt-capable, sincerely weird —
> classical HCI (visible state,
> [Fitts](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/pie-menus-fitts-law.md),
> reversibility) with **nap left on the felt**. Shop name from The Sims Framework shell (`Gonzo`);
> method from gonzo journalism; stagecraft from felt creatures.
> Manifest: [GONZO-UI-MANIFEST.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/GONZO-UI-MANIFEST.md)

Hooks for Edd:

- Pull a [GUIDB](https://www.gameuidatabase.com/) screen that is *sterile SaaS in a game costume* — what would Gonzo refuse? → [Queer Oui for the Straight GUI](../don-hopkins/queer-oui-for-the-straight-gui.md)
- Pull a GUIDB screen that is *already Gonzo* without knowing it — inhabited chrome, honest errors, stunt affordances
- Where does “beautiful art + dead hands” show up most in the catalog (inventory? settings? crafting?)?
- Can “felt creatures” (sparse signals, fat projection) be taught as a reading skill for GUIDB screens?
- [PadCrafter](https://www.padcrafter.com/) already makes control schemes *legible* — is that Gonzo’s cousin on the input side?

---



## Bridge skins — Soul City hub-and-spoke

[Soul City](https://github.com/SimHacker/moollm/tree/main/examples/soul-city) is the hub; each game
is a spoke ([federation peers](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/federation-peer-games.md) ·
[INDEX bridges](../../repo-shows/INDEX.yml)). Bridge operator UIs should **match the game at a glance**
when several bridges are open and souls / content move between them.

| Layer | Job |
| ----- | --- |
| **Gonzo kernel** | [Pies](https://github.com/SimHacker/MicropolisCore/tree/main/documentation/designs/piecraft), [tabbed frames](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/notes/PIE-TAB-WINDOWS.md), [nine-slice](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/ui-frame-nine-slice.md), DM, a11y — game-agnostic ([manifest](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/GONZO-UI-MANIFEST.md)) |
| **Skin pack** | Palette, atlas, fonts, cursors, splash voice — game-legible |
| **GUIDB brief** | Cite a real [GUIDB](https://www.gameuidatabase.com/) screen as the costume reference (no ripped assets) — [Queer Oui for the Straight GUI](../don-hopkins/queer-oui-for-the-straight-gui.md) |

Hooks:

- Glance test: Sims + Stardew + Tiny Life windows open — which three cues from GUIDB make them unmistakable?
- First skin: **Sims-evoking** (not EA assets) — what does Edd’s catalog say “reads as Sims” in 200 ms? ([pie lineage](../don-hopkins/pie-menus-chi-88-and-beyond.md))
- [Micropolis](https://github.com/SimHacker/MicropolisCore) / city-sim chrome vs life-sim chrome — different silhouette languages?
- When a character is *in transit* on the hub, what should the UI wear — heavenly host skin or last-game residue?
- Does [PadCrafter](https://www.padcrafter.com/)’s multi-platform pad metaphor map to multi-bridge chrome (same actions, different faces)?

---



## Queer Oui for the Straight GUI

Full write-up (Don’s room): **[queer-oui-for-the-straight-gui.md](../don-hopkins/queer-oui-for-the-straight-gui.md)** · ep.2
[pie-menus-piecraft.yml](../../repo-shows/edd-coates/pie-menus-piecraft.yml) ·
[Gonzo](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/GONZO-UI-MANIFEST.md) ·
[GUIDB](https://www.gameuidatabase.com/) · [Fitts](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/pie-menus-fitts-law.md) ·
[PieCraft](https://github.com/SimHacker/MicropolisCore/tree/main/documentation/designs/piecraft) ·
[PIE-TAB-WINDOWS](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/notes/PIE-TAB-WINDOWS.md) ·
[Soul City](https://github.com/SimHacker/moollm/tree/main/examples/soul-city) ·
[heartbeat](../../process/brainstorm-heartbeat.md)

Whiteboard: [GUIDB](https://www.gameuidatabase.com/) miss → keep **Soul and Skin** (costume), replace
the **hands** with Gonzo ([pies](https://github.com/SimHacker/MicropolisCore/tree/main/documentation/designs/piecraft) /
[tabs](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/notes/PIE-TAB-WINDOWS.md) /
[Fitts](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/pie-menus-fitts-law.md)).
Slogans: *"Queer Oui for the Straight GUI"* · *"Put the SaS into SaaS"* (SaS = Soul and Skin).
No dunking — redesign briefs with attribution.

---



## Episode 1 hooks — archive & ethics



### Building GUIDB

- Lockdown 2020 → Guinness Nov 2022 (42,706 / 1,013) → GUIDB 2.0 Aug 2024 → still growing
- Taxonomy craft: screen types, materials/patterns, colour search — what tags paid off?
- Contribution pipeline: quality vs coverage; how to refuse bad crops without becoming a gate cult
- Studio adoption claims — what “used in the UI pipeline” looks like day-to-day



### Ethical AI / anti-slop

- GUIDB is built for **human designers**. How should archives treat AI training / scraping?
- Metadata labor is the product — taxonomy, curation, search — not raw pixels alone
- Opt-in **Truffle**-style corpora: expert-verified, attributed, compensated
- Repo Show complementarity: screenshots vs runnable artifacts — both need consent paths
- Edd leads on wording; we cite, we don’t scrape



### *The Game UI Bible*

- Translating interactive screens to print — what dies, what becomes clearer?
- Why a physical tome when patches rewrite HUDs weekly?
- Chapters Don would kill to see: radials; inventory; diegetic vs non-diegetic; failure screens



### PadCrafter

- From making UI to making tools for UI designers — what pain forced the tool?
- 2.0: KB/M, Steam Deck, chords, SVG export — what’s still missing?
- PieCrafter cousin? Shareable pie loadouts with the same “URL is the file” trick



### Executable vs screenshot archives

- Map Micropolis / Sims shell into GUIDB taxonomy live
- What categories is GUIDB missing that PieCraft / Gonzo would need?

---



## Episode 2 hooks — pies, radials, PieCraft

See `[pie-menus-discussion-notes.md](../../repo-shows/edd-coates/pie-menus-discussion-notes.md)`.

- How many pie / radial / wheel examples in the catalog? Tags that would help
- The Sims pies — Don’s firsthand; how they read in GUIDB
- Monster Hunter World — high-skill customizable radials under pressure
- Failure modes: moving targets, slice overload, previewless mystery meat, input mismatch
- Stable 8/12-way directions; items move *inside* slices
- Ultimate editable pie — loadouts, sharing, a11y, teaching mode that scores layout
- **PieCraft** — craftable / damageable pies; Fitts as gameplay; bad layout = death
- Expert-annotated pie corpus for ethical licensing (Edd’s call on GUIDB inclusion)

---



## PIXIE, PDP-7, light pens, Engelbart, emulators, PadCrafter blinkenlights

A third spine (or a fat middle of ep.2): **old-school interactive graphics as game UI ancestry** —
and [PadCrafter](https://www.padcrafter.com/) as the tool that makes dead iron’s *controls* legible again.

Deep show seed already planted: `[pixie-pie-menus-pdp7.yml](../../repo-shows/pixie-pie-menus-pdp7.yml)`
(buds: [Heinz Lemke](../heinz-lemke/), **[Lars Brinkhoff](../lars-brinkhoff/)**, [David Rosenthal](../david-rosenthal/)).
Edd is the [GUIDB](https://www.gameuidatabase.com/) / PadCrafter lens on that iron.
Audience map: [README § PIXIE](README.md#pixie--emulator--padcrafter-blinkenlights-episode-3-spine).

### PIXIE radial menus (1969)

- Cambridge PDP-7 + Type 340 vector display + light pen — radial “lightbuttons” before CHI ’88 ([hardware stack](../lars-brinkhoff/media/reference/cambridge-pixie-hardware-stack.yml))
- Co-authors / stack: [Neil Wiseman](../neil-wiseman/), [Heinz Lemke](../heinz-lemke/), [John Hiles](../john-hiles/); Titan link
- How would Edd *tag* PIXIE if it were a GUIDB entry — screen type, input modality, material?
- Continuity vs rediscovery: PIXIE → CHI ’88 pies ([Don’s lineage](../don-hopkins/pie-menus-chi-88-and-beyond.md)) → Sims → [MicropolisCore PieCraft](https://github.com/SimHacker/MicropolisCore/tree/main/documentation/designs/piecraft)
- Film / [Flight of the PIXIE](../yuja-wang/sources/flight-of-the-pixie-tribute.md) as motion reference ([CHM/TLG notes](../don-hopkins/sources/2020-04-06-flight-of-pixie-chm-tlg-broadcast.md)) — GUIDB 2.0 video support as cousin



### Spacewar! / blinkenlight play culture

- *Spacewar!* lineage (PDP-1 classic; vector / console demo culture that still shapes “game UI”)
- What modern GUIDB screens still secretly speak that language — sparse vectors, diegetic status, cockpit grammar?
- Contrast: 1960s front-panel + CRT vs 2020s settings walls



### Light pens → virtual light pen

- PIXIE was point-*at*-the-label with a light pen, not only mouse-ahead slices
- Lars’s thread: emulate Type 370 light pen on SIMH / PDP-7 so radial menus run on stream again ([pdp7-development](../lars-brinkhoff/pdp7-development.md))
- Design question for Edd: what does a **virtual light pen** UI look like in 2026 — tablet stylus? mouse with tracking cross? pie that lights under the pen?
- GUIDB hunt: games that still use “point at the glowing thing” (diegetic reticles, laser pointers, VR beams)



### Engelbart — keyset, mouse, chord keyboard

- Mother of All Demos: mouse + **chord keyset** as simultaneous hands ([Engelbart room](../douglas-engelbart/) · [mouse & keyset](../douglas-engelbart/engelbart-mouse-and-keyset.md))
- How did that plug into PDP-era machines? (research beat with Lars / [memorial Engelbart show](../../repo-shows/remembering-douglas-engelbart.yml))
- PadCrafter today maps pads and KB/M — could it sketch an **Engelbart keyset** chord chart the way it sketches DualSense?
- Gonzo angle: inhabited chrome + chord rehearsal = stunt affordance from 1968 ([GONZO-UI-MANIFEST](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/GONZO-UI-MANIFEST.md))



### Emulators + Lars Brinkhoff

- Lars: PDP-7 / Type 340 / ITS preservation — make PIXIE **runnable**, not only discussed
- Room: `[characters/lars-brinkhoff/](../lars-brinkhoff/)` · [pdp7-development.md](../lars-brinkhoff/pdp7-development.md) · [invitation](../lars-brinkhoff/invitation.md)
- Screen-share fantasy: GUIDB modern radial ↔ live PDP-7 emulator pie on the same desk
- Emulator UX as game UI — pause menus, CRT shaders, save states — does GUIDB already catalog “emulator chrome”?



### PadCrafter for blinkenlight front panels

The fun provocation:

> [PadCrafter](https://www.padcrafter.com/) already documents gamepad / KB layouts for living games. What if we use it (or a
> sibling mode) to design **old-school computer front panels** for emulators — toggle switches,
> sense switches, blinkenlight registers, deposit/examine, RUN/STOP — as shareable URL layouts?

Hooks for Edd:

- Is a PDP-7 / PDP-8 / PDP-10 front panel just another “control scheme” with weird buttons?
- Templates: blinkenlights row, switch register, light-pen arming, Type 340 mode bits
- Export SVG into emulator HUD skins / museum kiosk overlays / Repo Show swag
- Same “no account, share the URL” trick — historians and emulator authors iterate like game teams
- Pair with Gonzo: front-panel skin pack for [MicropolisCore](https://github.com/SimHacker/MicropolisCore) / [Soul City](https://github.com/SimHacker/moollm/tree/main/examples/soul-city) “retro organelle” bridges
- [Dave Maynard](../dave-maynard/) / Engelbart keyset hardware stories as tactile contrast to on-screen PadCrafter

Live jam (if Edd bites): open PadCrafter → mock a minimal PDP-7 operator panel → map actions to
emulator hotkeys → compare to a GUIDB “pause menu” from a modern game that pretends to be a cockpit.

**With Lars:** sense switches that change **Munching Tunes** — see
[AM radio simulator proposal](../lars-brinkhoff/am-radio-simulator-proposal.md)
([Munching + AM](https://web.archive.org/web/20200419194925/https://www.youtube.com/watch?v=V4oRHv-Svwc) ·
[Life + AM](https://web.archive.org/web/20200413075431/https://www.youtube.com/watch?v=hB78NXH77s4) ·
[Spacewar!](https://www.youtube.com/watch?v=1EWQYAfuMYw)).

---



## Wild cards (if energy)

- Afterlife / heaven-hell UI grammar → Soul City heavenly hub chrome
- Diegetic UI that *is* the game world vs chrome that lies about authorship
- Colourblind / accessibility filters in GUIDB 2.0 → Gonzo a11y as first-class, not a skin afterthought
- “UI trends across 1,000+ games” — what died, what returned, what’s cargo-cult
- Fan UI mods as a fifth column — when community chrome beats shipped chrome
- Brad Myers pairing cold open: one technique from *Pick, Click, Flick!* → find three GUIDB screens that prove or break it
- Chord keyboards in fighting games / musou radials — Engelbart’s ghost in modern pads

---



## Pairings

- [The Two Catalogs](../../repo-shows/brad-and-edd-interaction-catalogs.md) — GUIDB × *Pick, Click, Flick!*
- [PIXIE on PDP-7](../../repo-shows/pixie-pie-menus-pdp7.yml) — Heinz + **Lars** + DSHR; Edd as GUIDB/PadCrafter co-bud or cold-open
- [Lars Brinkhoff](../lars-brinkhoff/) — emulator iron; virtual light pen
- [Remembering Engelbart](../../repo-shows/remembering-douglas-engelbart.yml) — keyset / mouse memorial thread
- Don reimplements pies — `[pie-menus-retrospective](../../repo-shows/INDEX.yml)`
- PIXIE + Ben — `[ben-and-heinz-pie-menus](../../repo-shows/ben-and-heinz-pie-menus.yml)`
- CMU pie guest lecture — `[brad-myers-garnet-vpl](../../repo-shows/INDEX.yml)`

---



## Sources

- `[README.md](README.md)` · `[invitation.md](invitation.md)` · `[CHARACTER.yml](CHARACTER.yml)`
- `[suggested-questions.yml](../../repo-shows/edd-coates/suggested-questions.yml)`
- [gameuidatabase.com](https://www.gameuidatabase.com/) · [padcrafter.com](https://www.padcrafter.com/) · [eddcoatesdesign.com](https://www.eddcoatesdesign.com/)
- [GONZO-UI-MANIFEST](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/GONZO-UI-MANIFEST.md)
- `[pixie-pie-menus-pdp7.yml](../../repo-shows/pixie-pie-menus-pdp7.yml)` · `[lars-brinkhoff/](../lars-brinkhoff/)`

