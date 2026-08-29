# "I accidentally broke fire!" — 16 January 2009

*Source:* **Don Hopkins** to the **Maxis Alumni** Facebook group, **16 January 2009** —
[post screenshot](2009-01-16-maxis-alumni-post.png). Not from any YouTube upload.

> "In cleaning up the SimCity code, **I accidentally broke fire!**
>
> I noticed that the fires just would not go out because **they kept burning back into the previously
> toasted rubble.**
>
> I inspected the code and found that I'd screwed up some of the logic that decides where to spread a
> fire, so it **spread to unburnable tiles (like rubble)**. Oops! Fixed it so it works again."
>
> `http://code.google.com/.../MicropolisEngine/simulate.cpp…`

**This one is fully verifiable, and it verifies.** The bug, the fix, and the original code Don was
refactoring away from are all in git. Below is the whole chain.

## The fix commit

**`1954d98` · 2009-01-15 20:10:34 +0000 · `simhacker` · "Worked on gtk user interface, clean up,
renaming."**

The day before the post, in a 20-file sweep across the engine. The commit message says *"clean up,
renaming"* and the post says *"in cleaning up the SimCity code"* — same sweep, and the fire fix is
buried in it unmentioned.

Found by searching the history for the flag that broke:

```bash
git log --all -S "BURNBIT" -- "*simulate.cpp"
```

## What the original code did (1989 era, GPL release Jan 2008)

From `f270107`, the initial Micropolis GPL release — the C code as it came out of Maxis:

```c
if (c & BURNBIT) {

  if (c & ZONEBIT) {

    FireZone(Xtem, Ytem, c);

    if ((c & LOMASK) > IZB) { /* Explode */
      MakeExplosionAt((Xtem <<4) + 8, (Ytem <<4) + 8);
    }
  }

  Map[Xtem][Ytem] = FIRE + (Rand16() & 3) + ANIMBIT;
}
```

**Two nested tests, and the nesting is load-bearing.** The outer gate is `BURNBIT` — *can this tile
burn at all?* The inner gate is `ZONEBIT` — *is it a zone, so does it need the zone-damage and
explosion treatment?* The ignition statement, which writes a FIRE tile, sits **inside the outer
gate**, at the end. Nothing catches fire without passing `BURNBIT`.

## The regression

Somewhere in the 2008 cleanup, the two nested `if`s were flattened into one combined mask test:

```c
if ((c & (BURNBIT | ZONEBIT)) == (BURNBIT | ZONEBIT)) {
    // Neighbour is a zone and burnable
    fireZone(Xtem, Ytem, c);

    if ((c & LOMASK) > IZB) { /* Explode */
        makeExplosionAt(Xtem * 16 + 8, Ytem * 16 + 8);
    }
}

map[Xtem][Ytem] = randomFire();   // ← now outside every guard
```

**The flattening is correct for the zone branch and catastrophic for the ignition.** `BURNBIT &&
ZONEBIT` really is what guards `fireZone()`. But collapsing the nest left `randomFire()` with nowhere
to live except the bottom of the loop body — **outside the burnability test entirely.** Fire now
ignited any neighbour in bounds.

This is the classic shape of a refactoring regression: *the transformation preserved the condition and
lost the scope.* Both tests survive in the new code. What was destroyed is the fact that one of them
was an umbrella.

## Why it manifested as fire that would not go out

Don's symptom description is the interesting half, because the failure was not "fire spreads too
much." It was **fire is immortal.** The reason is at the bottom of the same function:

```c
// Decide whether to put out the fire.
if (getRandom(rate) == 0) {
    map[pos.posX][pos.posY] = randomRubble();
}
```

**Fire in SimCity dies by becoming rubble.** And rubble is defined so that it cannot burn:

```c
/** Generate a random Tiles::RUBBLE tile */
return (RUBBLE + (getRandom16() & 3)) | BULLBIT;
```

`BULLBIT` — bulldozable — and **no `BURNBIT`.** That single omitted flag is the entire termination
condition of the fire system. Rubble is the ash; ash doesn't burn; the fire runs out of map.

So when the `BURNBIT` gate broke, **the terminal state became fuel.** Every fire that burned out
converted its own tile into rubble, and the neighbouring fire immediately re-ignited that rubble,
which burned out into fresh rubble, which re-ignited. Don's phrase for it — *"they kept burning back
into the previously toasted rubble"* — is exact.

**The bug turned the stopping condition into the propagation condition.** A cellular automaton whose
absorbing state was quietly reclassified as flammable has no absorbing state, and the fire only stops
at the map edge.

## The fix

`1954d98` restores the umbrella as an early `continue`:

```c
if (!(c & BURNBIT)) {
    continue;
}

if (c & ZONEBIT) {
    // Neighbour is a zone and burnable
    fireZone(Position(xTem, yTem), c);

    if ((c & LOMASK) > IZB) { /* Explode */
        makeExplosionAt(xTem * 16 + 8, yTem * 16 + 8);
    }
}

map[xTem][yTem] = randomFire();
```

Same two tests as 1989, same nesting semantics, inverted into guard-clause form. **This is still the
shipping logic** — it survives verbatim in `MicropolisCore` today at
`packages/micropolis-engine/src/simulate.cpp`, in `Micropolis::doFire()`, now with `Position` and
`MapValue` types over the raw shorts.

*(Trivia from the diff: the three fix lines went in tab-indented, in a file that is otherwise four
spaces. Somebody has since fixed the whitespace and left the logic alone, which is the correct
priority.)*

## Why this is worth a page

**It's a debugging story where the bug is more interesting than the feature.** SimCity's fire is
four lines of cellular automaton; its correctness rests entirely on which flag gates which statement,
and the flag names (`BURNBIT`, `BULLBIT`, `ZONEBIT`) are how a 1989 codebase encoded its physics. Don
walked into that, flattened one nest, and the city burned forever.

It's also **a public bug report filed by the author against himself, to the alumni of the company that
wrote the original**, with a source link — three weeks into being maintainer of a codebase he'd spent
a year getting released under the GPL. Worth reading next to the
[Micropolis / SimCity open-source thread](../../../will-wright/sources/README.md#simcity-open-source--micropolis).

Good demo material: **break the `BURNBIT` guard live on air and watch a city become unquenchable.** It
is a one-line patch and a spectacular failure mode.

## Open

- [ ] The truncated `code.google.com` link is dead — **Google Code shut down in 2015.** Find it in the
      Wayback Machine and record the full URL and revision number.
- [ ] **Who flattened the nest?** The regression is in the 2008 cleanup, between `f270107` (Jan 2008)
      and `1954d98` (Jan 2009); Don and `alberth289346` were both refactoring `simulate.cpp` hard in
      that window. Bisect it. *Don blames himself in the post, which is evidence but not proof.*
- [ ] Were there other flag-scope regressions in the same sweep? `-S "BURNBIT"` found this one;
      try `CONDBIT`, `ZONEBIT`, `ANIMBIT`, `BULLBIT`.
- [ ] Record the animated-GIF version of the runaway fire, if anyone has one.

## Repo orbit

- [Micropolis / SimCity open source → Micropolis](../../../will-wright/sources/README.md#simcity-open-source--micropolis)
- [Don Hopkins resume (Medium, 2018)](../2018-05-24-don-hopkins-resume.md) — the OLPC/GPL release in his own summary
- [Weird Sims objects on a Windows XP VM (2019)](../2019-05-12-weird-sims-objects-20th-anniversary/README.md) — the other "I got the old code running" post
- [SimCity C64 floppy, Jenny Martin](../../../will-wright/sources/2017-04-28-simcity-c64-floppy/)
- [SimCity Graphics Set 2 box](../../../../catalogs/maxis/physical-artifacts.md) — the same tile engine, sold as scenery
