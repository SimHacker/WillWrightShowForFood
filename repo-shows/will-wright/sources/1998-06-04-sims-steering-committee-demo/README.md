# Source: The Sims Steering Committee demo (1998-06-04)

A pre-release build of **The Sims** demoed to the **steering committee at Electronic Arts on
June 4, 1998** — almost two years before launch (Feb 4, 2000). Don Hopkins kept the original
*"The Sims Steering Committee Installer.exe,"* ran it on a virtual machine decades later, and
**uploaded the screen-recorded demo to YouTube (July 17, 2019)**. A rare, narrated look at The Sims
while it was still scenario-based and visibly under construction — and, crucially, **with Edith and
the SimAntics live-programming/debugging environment switched on.**

- Video (Don's narration): <https://www.youtube.com/watch?v=zC52jE60KjY>
- Uploaded by Don Hopkins, July 17 2019; demo build dated June 4 1998.

## Find the build (do not host in repo)

| Where | URL |
|-------|-----|
| **Internet Archive** | https://archive.org/details/the-sims-steering-committee |
| **TCRF** | https://tcrf.net/Proto:The_Sims_(Windows)/The_Sims_Steering_Committee |
| **Hidden Palace** | https://hiddenpalace.org/The_Sims_(Jun_4,_1998_prototype) |

**Run locally (from IA readme):** extract; shortcut to `DATA/Sims.exe` with `-w`, 16-bit color, administrator. Installer optional. **Not compatible** with retail Sims 1. Compare later build: [1999-01-06 alpha](../1999-01-06-sims-alpha-prototype/).

**Show:** [Sims team reunion — play it live](../../sims-team-steering-committee-playthrough/SHOW.yml) with Jamie, Bobo, Irk, Patrick, Don (+ Will?).

- The full machine-generated transcript is available on the video; cleaned highlights below.

## Relationship to the first show (read this first)

The **1996 Winograd talk remains the single centerpiece** of the kickoff Will show
(`../1996-04-26-winograd-interfacing-to-microworlds/`) — this demo does **not** displace it. It's a
distinct primary source, best used for a **Sims post-mortem / Edith deep-dive** segment: the 1996
talk *previews* Dollhouse and the advertisement-driven object idea; this 1998 build *shows that idea
running* in Edith, two years before release.

## What it shows

- **Edith + SimAntics live.** The build ships with **Edith**, the in-house editor/debugger. Don opens
  the module inspector, **traces a Sim's SimAntics behavior** (the return-stack "digital programming
  debugger"), and walks the **aquarium "feed fish"** program node-by-node (route to the fish, check
  if hungry, play the feeding sound, set state). The same **advertisement-driven, data-driven object
  behavior** Will described in 1996 — here you watch it execute and get edited live.
- **The scenario system (later dropped).** The Sims was, at this point, **scenario/level-based** (0–4).
  "Magic invisible objects" run each scenario: an *outside* object cycles day/dusk/night (crickets,
  dogs barking); a *tutorial* object monitors a Sim named **Ross** and nudges the player ("Ross is
  getting hungry… dirty… needs the bathroom… lonely — have him call a friend"). Levels include *"the
  girls just want to have fun"* (Samantha & Mercedes; Sadie awaiting an inheritance), *"the kiss,"*
  and a *Lakeview* dream-house build. The shipped game became open-ended instead.
- **Pie menus already in** — but smaller than the final, with a head in the middle ("I don't know if
  this is Comic Sans or not").
- **Rough edges, narrated honestly:** no **plumb bob** yet; a "sketchy" UI; right-click did a weird
  zoom/rotate they later cut; a "horrible scream" on scroll; sparse stand-in catalog; the **creepy
  hand** move-tool whose finger animates faster on a faster CPU; the infamous **"every wall is
  adjacent to outdoors"** wallpaper bug Don never got around to fixing.
- **Bobo's undo.** Infinite undo/redo, courtesy **Eric "Bobo" Bowman**.
- **Motives & personality scaffolding:** hunger/bladder/energy/etc.; personality axes (IQ, energy,
  neat, outgoing, active, playful, nice/temper, appetite); interests (food, sports, politics,
  religion); skills (gardening). No action queue yet — "they just do stuff and you hope they get
  around to it." **"Internet pizza but better"** (pizza appears, no delivery person yet).
- **Spawning characters** via the Edith object browser → *new object instance*: the original test
  cast — Ross, Mercedes, Samantha, Sadie, Sigmund, Fritz, the Colonel, the Duchess.

## The Edith credits (from the About box, ~9:13)

The build's Edith "About" box reads (cleaned from the auto-captions): **Edith version 6, © 1997**,
**designed by Will Wright; programmed by Jamie Doornbos, Eric Bowman, Jim Mackraz, and Don Hopkins.**
A primary-source snapshot of the core Sims engine/tools team.

## Notable moments

- **The "Archie Bunker" test character (~2:19).** An Archie Bunker stand-in was used during
  development and removed — "kids don't smoke cigars or be racist… he was a bad influence." A small
  window onto the team's content sensibilities (cf. the same-sex-romance inclusion work elsewhere).
- **"Reticulating splines"** gets a nod — the loading-screen joke that shipped.
- **Stippled transparency** for walls ("not sure if you shipped with that, but it was a cool idea").
- **Number keys 0–4** for sim speed.
- **The Level-4 gag (~1:00).** The on-screen scenario blurb jokingly says *"now take it to the next
  level of anal"* (about optimizing for efficiency). Don's own note on the video confirms: **that
  scenario did NOT ship** with The Sims.

## Why it matters

- **Edith/SimAntics is the visual-programming-language-in-action** that Will mused about wanting in
  the 1996 talk — the live, inspectable, user-extensible object-behavior system. Direct kin to the
  Crazy Idea Jam's *scriptable simulators* and the 1996 *advertisement-driven objects* thread.
- **Pie menus shipping in The Sims** — Don's contribution, visible here in an early form.
- **Design history:** the scenario→sandbox pivot is a teachable post-mortem on what The Sims became.
- **Credits as evidence:** names the people who built the engine and tools.

## Provenance + ethics

Don's own build, his own upload, his own narration — a faithful primary source (source, don't
paraphrase). The Edith credits and on-screen text are quoted/cleaned from the video; auto-caption
garbles (e.g. "James Gore boss" → Jamie Doornbos, "air Bowman" → Eric Bowman, "Jim backrest" → Jim
Mackraz) are corrected against the known Sims team and the About box. Using it in a show falls within
the show's consent flow (`../../invitation.md`).

## See also

- `../1996-04-26-winograd-interfacing-to-microworlds/` — the centerpiece talk that previews Dollhouse → The Sims.
- `../../../../characters/don-hopkins/` — pie menus, Edith/SimAntics tools, the uploader.
- `../../../../process/crazy-idea-jam.yml#scriptable_simulators` — the modern echo of SimAntics' user-extensible objects.
