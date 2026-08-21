# Pie Menus with Edd Coates — Discussion Notes & Seeds

Working document for the PieCraft episode. Screen-sharing, whiteboarding, follow-up implementation.
[Portrayal standards](../../schemas/portrayal-standards.yml)

## Core questions (live)

**From the database**
- How many pie / radial / wheel examples in 73k+ screens?
- Current tags; would a dedicated "Radial / Pie Patterns" lens help?

**Success stories (pull up live)**
- The Sims pie menus — speed, context, in-world feedback
- Monster Hunter World radials — loadouts under pressure
- Other standouts (controller, mobile, PC, VR)

**Failure modes**
- Items move when the set changes (muscle memory destroyed)
- Too many slices; poor preview; mystery-meat radials
- Mouse designs that fail on controller (and vice versa)

**Reinterpret bad UIs (GUIDB-guided — the fun bit)**
- Pull a *beautiful but painful* screen from GUIDB; name what the costume is vs what the hands are doing wrong
- Redesign brief: keep game-legible identity (palette, panel silhouette, icon grammar); replace interaction with Gonzo pies + tabbed frames + visible state
- Bridge-skin rule: Soul City spoke for that game should pass the **glance test** next to another open bridge
- Cite GUIDB on-air; no scraping — Edd's archive is reference, not training fuel
- Manifest: [GONZO-UI-MANIFEST.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/GONZO-UI-MANIFEST.md) (skinnable kernel + GUIDB briefs)

**Don's principles (test with Edd)**
- Fix slice directions first (8-way / 12-way)
- Items inside slices — add/remove without rotating everything
- Mouse-ahead / gesture-ahead after rehearsal
- In-world feedback beats chrome
- Context-sensitive defaults; power-user overrides, save, share, version
- Skin ≠ fork — one pie/tab kernel; costume packs per game

**Ultimate editable pie brainstorm**
- Runtime drag-and-drop (prosumer mode)
- Per-context overrides; named loadouts; community library
- Accessibility; safe defaults + teaching mode that scores layout

**PieCraft as UI literacy game**
- Pies craftable / lootable / damageable; combat spills slices
- Good layout = survival; bad layout = death
- Fitts + muscle memory as *gameplay skills*
- Companion lesson from David Ungar: **motion is a foveation summons — only send it where you want the eye** ([fitts-and-foveation.md](../../characters/david-ungar/fitts-and-foveation.md)); score layouts on misdirected motion too
- MH players already optimize radials like pros

**Historical thread — PIXIE / PDP-7 / light pen / Engelbart / Lars**
- 1969 PIXIE (Heinz Lemke et al.) on Cambridge PDP-7 + Type 340 + light pen → CHI '88 → The Sims → PieCraft
- Continuous evolution vs periodic rediscovery
- Light pen = point-at-the-label; mouse pies = angle-at-release — both radials, different hands
- Engelbart mouse + chord keyset as the other ancestral “two hands” story
- Lars Brinkhoff: PDP-7 / Type 340 / light-pen emulation — runnable pies on stream
- *Spacewar!* / blinkenlight culture as GUIDB ancestry, not nostalgia cosplay

**PadCrafter blinkenlights jam**
- Treat a PDP-era front panel as a control scheme: switches, lights, deposit/examine, RUN/STOP
- Draft a PadCrafter (or sibling) template → SVG → emulator HUD / kiosk overlay
- Virtual light pen: stylus / tracking cross / pie that illuminates under the pen
- Engelbart keyset chord chart in PadCrafter next to DualSense — same tool, 1968 hands

**Licensing tie-back**
- Expert-annotated pie examples + runnable artifacts = Truffle-grade corpus
- How Edd wants GUIDB examples treated in licensed collections

## Artifacts to screen-share

- [Game UI Database](https://www.gameuidatabase.com/) live — especially bad radials, inventory traps, modal stacks worth rescuing
- [PadCrafter](https://www.padcrafter.com/) — mock a mini front panel live if energy
- [`pie-menus-chi-88-and-beyond.md`](../../characters/don-hopkins/pie-menus-chi-88-and-beyond.md)
- [PIXIE PDP-7 show](../pixie-pie-menus-pdp7/README.md) · [Lars room](../../characters/lars-brinkhoff/)
- [MicropolisCore piecraft/](https://github.com/SimHacker/MicropolisCore/tree/main/documentation/designs/piecraft)
- [GONZO-UI-MANIFEST.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/GONZO-UI-MANIFEST.md) — bridge skins + reinterpret table
- **[Queer Oui for the Straight GUI](../../characters/don-hopkins/queer-oui-for-the-straight-gui.md)** — *Queer Oui* / *SaS→SaaS* whiteboard format
- [PIE-TAB-WINDOWS.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/notes/PIE-TAB-WINDOWS.md) · [Fitts](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/pie-menus-fitts-law.md)
- Monster Hunter radial guides; [Kando](https://github.com/kando-menu/kando) (modern open-source pies)

## Desired outcomes

1. Annotated good/bad examples with GUIDB references (redesign briefs, not dunking for sport) — [Queer Oui show etiquette](../../characters/don-hopkins/queer-oui-for-the-straight-gui.md#show-etiquette)
2. At least one worked example: GUIDB miss → Gonzo reinterpret sketch (skin tokens + pie/tab layout) — [live format](../../characters/don-hopkins/queer-oui-for-the-straight-gui.md#live-format)
3. Co-designed requirements for next-gen editable pies + per-game skin packs
4. Taxonomy decision for radial patterns in GUIDB
5. Warm path to ethical licensing corpus for pie menu history
