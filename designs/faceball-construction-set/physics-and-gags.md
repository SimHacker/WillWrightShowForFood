# Physics, gags, and the Faceball machine

*Part of [`designs/faceball-construction-set/`](README.md). The elaborative half — fluids, stage
gags, and the game the kit turns into once the panel grid stops being a grid. Kept out of the main
design so that page stays about the parts.*

The credit being spent here is **[The Incredible Machine and Incredible Toons](inspirations.md#the-incredible-machine-and-incredible-toons--dynamix)**: parts that know only
physics, colliding in ways the author did not plan, with the comedy coming from the collisions. See
[`inspirations.md`](inspirations.md#the-incredible-machine-and-incredible-toons--dynamix).

## Sanspiel — the pluggable fluid and particle layer

**Sanspiel** is the simulation pass that runs beside the compositor in WebGPU. Its whole point is that
adding a new gag is a YAML file, not a subsystem: name an anchor, a fluid type, a gravity and
viscosity, a splash radius, a duration, and a target list.

```
particles/guest-<slug>-<gag>.yml   → register in the episode roster → it exists
```

Built-ins, all of them the same emitter with different parameters:

| Gag | Anchor | Note |
|---|---|---|
| Tears | eye | Crosses cells; drenches the panel *below* |
| Vomit | mouth | Parabolic arc, fired by the barf meter |
| Sweat | brow | Slow seep |
| Snot | nostril | Sneeze button |
| Spit take | mouth | Shock beat |
| Confetti | cannon or hand | Rip Taylor's "Dear!" |

**It breaks the Brady Bunch grid, and that is the feature.** Fluids ignore cell borders. The
video-call grid is the default layout; Sanspiel is the escape hatch, and the moment pulp crosses from
one cell into another the show stops looking like a Zoom call.

### Defenses, which are also gags

Every fluid needs something to defeat it, and the defense is funnier than the attack:

- **Umbrella hat** — a layover accessory that protects a precious hairdo from anything falling from
  above. Deployed mid-roast: the hair survives, the dignity does not.
- **Plastic tarp** — Gallagher-era splash protection draped over the low seats and front row.
- **Plexiglass barrier** — Robot Wars arena guard rails between the panel grid and the audience row.
  Fluids splat the glass; the crew behind it stays dry.

### Stage gags

- **Watermelon smash** — Sledge-O-Matic energy, showering the guests and the front row. The archetype
  is recast, not the man: the gag gets stolen shamelessly, the racist does not get credited.
- **Rip Taylor's confetti cannon** on "Dear!"

## The barf meter

**Dizziness tracking** accumulates *barf pressure* per avatar from angular velocity, penalty-wheel
spin, tumble collisions, flipper impulse, and optionally a phone gyroscope. Cross the threshold and
the vomit emitter fires, the eyes spiral, and the pressure only **partially** resets — so you can barf
again. It is an endurance game, not a one-shot.

The threshold is a **per-avatar constitution stat**, which makes it a creature-creator parameter
rather than a global constant: `iron_stomach` raises it, `weak_constitution` lowers it, and a comedy
guest can pick the bad one on purpose.

Displays: a per-cell pressure bar, and a leaderboard of time since last barf.

## The Faceball machine

A pinball table crossed with the panel grid. Every player gets **two flippers**; avatars are not locked
to their cells but can move around inside the playfield as physics bodies, or drive as vehicles with
wheels, treads, fins, or rotors.

**The Twitch game: *How Long Can You Last Without Barfing?*** Spin, bump, flipper-frenzy, pressure
rises, hold on. Barf and you are out or penalized. Last face standing wins. Chat votes on flipper
slaps, machine tilt, and whether to call the watermelon round.

Audience members participate as **balls** — sometimes a panel cell, sometimes literally a rigid or
soft body in the sim, colliding, rolling, and getting drenched. Self-authored audience characters
only.

## Choreography modes

Scripted chaos, then a deadpan reset. This is the part that is closest to pure whimsy and the part
most likely to actually land on camera.

- **Penalty spin** — lock an avatar to a torture-wheel rig, cranking barf pressure. Available as
  punishment *and* for fun. Sync modes: all clockwise (synchronized swimmers), counter-rotating pairs
  (asymmetric pressure), or every cell at a different rate and phase (chaos).
- **Formation swoop** — after the synchronized spin, avatars swoop in formation. Figure-eight, conga,
  diamond, pinball ballet. The grid becomes a swim meet.
- **Musical chairs** — music stops, everyone drives back to a panel seat under manual control, dizzy
  meters decaying. **One seat has been removed.** The avatar left standing falls off the machine, and
  *nobody ever speaks of them again* — no eulogy, no recap, no acknowledgment. The host moves on.
  Camp cruelty, not real harm.
- **Multi-user appendage frenzy** — every player steers a shared slithering appendage; heads pop
  through each other's cells. Ben Shneiderman's direct manipulation as a party game.

**The reset is the joke.** Cut back to the video-call grid: everyone in a seat, mouths closed, as if
none of it happened.

## Creature avatars as players

The Spore credit gets spent here. A puppet starts as a portrait or procedural face, then pops on a
mouth, eyes, brows — and then **capabilities**: tools, armor plates, vehicular limbs, and modules that
change the physics or the game verbs. Snap points are named (`head`, `mouth`, `eye_l`, `eye_r`, `brow`,
`shoulder_l`, `shoulder_r`, `chassis`, `mount_n`), so a confetti cannon and an arm mount the same way.

Vehicular chassis options exist mostly because they are funny: shopping cart, office chair on treads,
terrapin shell.

Export a creature by PR-ing its YAML into a character or audience directory. Build one, then survive
the barf machine on stream.

## Character states

The state a puppet is in decides what the eyes, mouth, and particles do: `awake`, `asleep` (frozen
eyes, snore particles from the nostril anchors), `bored`, `dizzy`, `spinning`, `choreographed`,
`barfed` (shame badge), `eliminated` (never spoken of again). States are triggered from the button
board, the roster, a cue, an audience PR, the barf meter, or a choreography mode.

## See also

- [`README.md`](README.md) — the kit and its parts
- [`inspirations.md`](inspirations.md) — who did the fluids and the sandboxes first
- [`mask-and-reveal.md`](mask-and-reveal.md) — the anonymizing overlay, and losing it as a game state
- [`apps/performance-space/squares-in-a-box.yml`](../../apps/performance-space/squares-in-a-box.yml) — the grid these gags break
