# riperiperi — The Sims Legacy Collection Technical Overview (gist digest)

**Source:** [gist.github.com/riperiperi/78c843b7fc3b11a92e3d5585a7815fee](https://gist.github.com/riperiperi/78c843b7fc3b11a92e3d5585a7815fee)  
**Author:** Rhys Simpson ([riperiperi](https://github.com/riperiperi)) — FreeSO / Simitone  
**Cited by:** [LGR — Sims 1 & 2 Legacy Collection Review](https://www.youtube.com/watch?v=ZUDt4BoMg-s) (~3:02)  
**Local mirror:** Cursor upload `78c843b7fc3b11a92e3d5585a7815fee-0.md`  
**Patches tracked in gist:** EA notes 04-02, 06-02, 12-02, 20-02 2025; author update 2025-04-11 (Mar 14 resolution/scaling rework)

Not legal advice. Verify before on-air. Companion to Exchange-gap pack in this folder (different lens: **renderer/OS**, not Exchange omission).

---

## Verdict in one paragraph

EA did **not** ship a DXVK wrap of Complete Collection. For Sims 1 they replaced the D3D6+DirectDraw hybrid with a **native Vulkan** path: sprites as RGBA8 textures, hardware depth (`gl_FragDepth` + sprite Z), full-screen redraw every frame, 24-bit lighting, DPI integer scales (1×/2×/3×) with 3D Sims/roofs at native res and point-filtered 2D. Faithful to original aesthetic limits (2 lights, objects/terrain unlit). Launch was rough; Feb–Apr 2025 patches closed many UI/Vulkan/AMD holes and adopted the gist’s fractional-scaling idea. Remaining structural gaps: **no Exchange**, grass DPI, no runtime res change, tool/registry breakage, no Edith.

---

## Complete Collection baseline (what broke)

| Layer | Behavior |
|-------|----------|
| Characters | D3D6 |
| Architecture / terrain / objects | Software + dirty rectangles |
| Sprites | RLE + 256-color palette; separate alpha RLE; per-pixel Z sprites |
| Res | 800×600 / 1024×768 (`-r1024x768`); higher = fan mods |
| Saves | Install dir → needs admin on modern Windows |
| FS | Alt-tab / fullscreen / DirectDraw fragility |

Multi-tile objects = single-tile parts; seams kill the illusion. Alpha sort sometimes wrong. Still “great game, rotten host OS.”

---

## Legacy Collection — platform changes

| Change | Detail |
|--------|--------|
| DRM | Steam; `steam_appid.txt` with `3314060` (or `SteamAppId` env) keeps process open for RenderDoc |
| Saves | `%HOME%\Saved Games\Electronic Arts\The Sims 25` — copies UserData + UserData2–8 on first launch |
| Cloud | No Steam Cloud (size / mods / Downloads folder risk) |
| Registry | No install-path HKLM for tools. Config: `HKCU\Software\Electronic Arts\The Sims 25`. Old tools expect `HKLM\...\Maxis\The Sims\InstallPath` |
| Res | Match primary display; DPI scale 1× (≤1080p), 2× (1440p), 3× (4K). Alt+Enter cycles windowed scales + fullscreen |

**Show beat:** “They fixed the folder that Windows hates. They deleted the registry key every community tool depends on.”

---

## New Vulkan renderer (the real story)

Minimum GPUs = earliest vendor Vulkan SKUs ([EA help](https://help.ea.com/en/help/the-sims/the-sims-legacy-collection/the-sims-minimum-requirements/)) — not “Sims 1 needs a 4070.”

**Frame sketch (gist):**

1. Game RT — Floor 1: floor sprites BT→FT (no batching); terrain/grass batches of 512 tris; grass edges; walls/fences; static objects  
2. Floor 2: walls; floors+statics; roofs; Sims; “dynamic” sprites (recent graphic changes / overlaps)  
3. Some UI (UCP, queue, translucent) at 1× into own RTs  
4. Composite game → main → UI (scaled) → backbuffer  

**Depth:** sprite depth + offset → `gl_FragDepth`; floors/shadows often vertex depth.  
**Lighting:** fragment shader, **nearest two lights**, 3D distance; zero if absent — matches original hard limit; diagonal walls now get falloff (original used ambient). Objects/terrain still unlit. 24-bit = smoother gradients.  
**Characters:** CPU animation; Vulkan = transform/light static meshes. Room for GPU skinning / interpolation (FreeSO/Simitone already do more).  
**Terrain:** full-res 3D mesh (less stair-step on lot edges vs old reduced-res 16-bit dither).  
**Grass:** looping screen-space texture (`gl_FragCoord` + scroll) + liveness lookup — **not** per-blade on terrain verts. Edges: second repeating texture. Medium/far = noisier LODs. Terrain Detail still exists but medium≠faster under texture strategy. **Grass ignores DPI** — looks short/thin at 2×/3×; first thing players “glance” as broken. Grid = 1px dots at all scales.

**Faithful failure modes preserved / mutated:** greedy tile culling (tops of tall objects clip); autoroof edge case draws differently (mesh skip vs repeated quarter tiles).

---

## Bugs → patches (gist + comments timeline)

| Issue | Status (per gist / comments) |
|-------|------------------------------|
| Subhood travel dialogs (click/graphic) | Fixed ~4 Feb 2025 |
| Stretched panel backgrounds / motive arrows | Fixed ~6 Feb (3-slice stretch: L/R fixed, mid stretches) |
| Intro video focus freeze | Fixed ~20 Feb — same Vulkan context; later JPEG frame package |
| PIP (pie head, close btn, scale) | Fixed by ~20 Feb |
| NVIDIA DXGI present pixel scramble | Driver/NVCP “Prefer native” Vulkan present — not EA |
| AMD Windows perf (Deck ~15fps) | Much better post early patches; RADV was always faster |
| Pool far-zoom @ 3× | Fixed by Mar 14 update |
| Fractional scale (1.5× mid zoom @ 4K) | Mar 14: render at next integer up, downscale — gist wishlist adopted |
| In-game resolution options | Mar 14: yes; effective res needs restart; window freely resizable with letterbox |
| Grass DPI / screen-locked grass | **Still open** (Apr 2025 author note) |
| Runtime resolution change | Still open |
| Expansion first-lot spam dialogs | Unfixed wishlist |
| Edith | “please 😇” |

**Aspect:** `-maxaspect:w:h` added; old `-rWxH` still ignored for “pick a small window for object work.”

---

## Unimportant-but-telling diffs

- Default-neighborhood Sims interests fixed (were all 0 in CC — friendship hell for Bob/Betty/Goths)  
- Sim thumbnail camera farther + aliased vs original premade thumbs  
- PIP got fade in/out (comment)  
- Intro nostalgia path broken: video pipeline rewritten (JPEG sequence) — community can’t drop classic `.avi` intros like on CC ([YouTube nostalgia thread in gist comments](https://www.youtube.com/watch?v=cR_E-gw1GmE))

---

## Community comments that matter for WWSFF

1. **Install discovery for Simitone/tools** — Steam: Valve InstallPath → `libraryfolders.vdf` → `appmanifest_3314060.acf` → `installdir` ([henke37](https://gist.github.com/riperiperi/78c843b7fc3b11a92e3d5585a7815fee#gistcomment-5430000-ish); Steamworks `GetAppInstallDir`).  
2. **Sim Creator / old tools** — need fake `Maxis\The Sims\InstallPath`; LC only has EA The Sims 25 HKCU.  
3. **Terrain/grass color** — not in lot IFF; **house-number → grass type** lookup. riperiperi: [VMTS1Activator.cs](https://github.com/riperiperi/FreeSO/blob/master/TSOClient/tso.simantics/Utils/VMTS1Activator.cs#L33). Edith terrain tweaker doesn’t survive import.  
4. **Russian locale 13** still blocked in exe (Orange-kun).  
5. **@DnfJeff** (Jeff Adkins) — 2025-03-01: testing Sim Enhancer / Career Creator vs Legacy; suspects character `.iff` layout differences; gathering money hex dumps. **Warm WWSFF guest already accepted** — this gist is a natural shared reference.  
6. **PARTYMANX** — sharp bilinear upsample shader alternative for non-integer scales ([partymod-thps2](https://github.com/PARTYMANX/partymod-thps2/blob/main/shader/framebuffer-sharp.frag.glsl)).

---

## LGR cross-read ([ZUDt4BoMg-s](https://www.youtube.com/watch?v=ZUDt4BoMg-s))

- Points audience at this gist for “what actually changed.”  
- Correct that TS1 is Vulkan; TS2 stays D3D9 (commenters: Deck stability ≈ Proton/DXVK, not the same rewrite).  
- Launch: crashy travel (TS1), CAS/load (TS2); pinned update — post-patches “solid for me.”  
- Framing: re-release not remaster; grateful table scraps; Ikea TS2 missing (fan restore).  
- 1440p sweet spot for TS1 on his hardware at review time — superseded partly by Mar resolution menu + scaling rework.

---

## Show / Soul City / FreeSO adjacency

| Beat | Why |
|------|-----|
| “Re-release vs remaster” | Vulkan is real engineering; Exchange still gone — two different axes of “complete” |
| Faithful limits | 2-light, unlit objects — aesthetic as constraint, not bug |
| Grass DPI | Perfect “they shipped GPU grass that forgot DPI” demo |
| Registry / tools | Why Simitone / SimObliterator / Jeff’s tools need Steam path sniff + optional registry shim |
| Edith | Community still asks; Volcanic is the FreeSO answer |
| Jeff ↔ riperiperi | Same problem space (IFF/saves/Legacy skew); don’t conflate codebases — cite both |
| Soul City | Official Steam TS1 is the **owned-game** substrate; companion fills Exchange gap this gist doesn’t cover |

**Catalog:** `catalogs/sims-open-source-info` → FreeSO/Simitone already credit riperiperi.  
**IP posture:** analyze EA binary behavior publicly; WWSFF reimplements cleanly; users bring own game files.
