# Source: `archie-suit.txt` — Whitman in the bone report

*Sniff:* [`GLANCE.yml`](GLANCE.yml) · **The artifact:** [`archie-suit.txt`](archie-suit.txt) (276 lines) · **Skeleton excerpt:** [`archie-skeleton-dump.txt`](archie-skeleton-dump.txt)

Don's **CMX exporter** for The Sims, run with debugging enabled, wrote a human-readable report
alongside the binary. The debug format for **Archie Bunker's suit** interleaves the character's
skeleton, meshes, and animation with **Walt Whitman's "I Sing the Body Electric"**, and sings the
bone tree to the tune of *Dem Bones*.

- **The file itself:** [`archie-suit.txt`](archie-suit.txt) — 276 lines, 9,271 bytes. Re-fetched from
  [donhopkins.com/home/text/archie-suit.txt](https://donhopkins.com/home/text/archie-suit.txt)
  **2026-08-29** and confirmed byte-identical, `sha256 641bc8965446bd1bf0dbb8bfca2a2413863f4a9f41649cb238226dc557169554`
- **Header:** `Character File Report. Copyright 1997, Maxis Inc.` / `version 200` — **1997**, predating
  the [June 1998 steering committee build](../1998-06-04-sims-steering-committee-demo/README.md)
- **Posted:** [Maxis Alumni, 18 May 2022](../../media/2022-05-18-maxis-alumni-archie-suit-whitman-post.png) — 9 reactions, 27 comments
- **Binary counterpart:** [Sims Character Animation File Format (2004)](../2004-02-05-sims-character-animation-file-format/article.md) — the `CMX File → Skeleton → Bone` structures this report is the debug view of
- **Related:** [VitaBoy character animation docs](../2004-02-05-vitaboy-character-animation-docs/article.md) · [character animation rendering](../2004-02-05-sims-character-animation-rendering/article.md)

## The poem is not an epigraph — it's the section separators

Don said *"interleaving"* and he meant it literally. The poem is broken into stanzas that sit
**between the report's sections**, opening and closing the file. Reading only the poem lines, by
line number:

| Line | Poem | What it separates |
|---|---|---|
| 4–6 | *O my Body! / I dare not desert the likes of you in other men and women, / nor the likes of the parts of you.* | after the copyright header, before the counts |
| 17–18 | *I believe the likes of you are to stand or fall with the likes of the Soul, / (and that they are the Soul).* | after the counts, before the skeleton |
| 45–46 | *I believe the likes of you shall stand or fall with my poems -- / and that they are poems.* | after the 21 bones, before the suits |
| 92–93 | *Man's, woman's, child's, youth's, wife's, husband's, mother's, / father's, young man's, young woman's poems.* | after the suits, before the animation |
| 273–274 | *O I say, these are not the parts and poems of the Body only, but of the Soul, / O I say now these are the Soul!* | after the last motion — the file's final words |
| 276 | *- From 'I Sing the Body Electric', by Walt Whitman.* | attribution |

Whitman's poem is a **catalogue of body parts** insisting that the enumeration *is* the soul. Don
used it to punctuate a file that is also a catalogue of body parts, so each stanza lands on the
matching structure: *"the likes of the parts of you"* introduces the counts, *"stand or fall with my
poems / and that they are poems"* introduces the meshes, and the list of whose poems they are —
*man's, woman's, child's, youth's* — introduces the **animation**, the part that makes the body
move like somebody. The report ends, after 21 motions, on *"O I say now these are the Soul!"*

The joke is exact, and it is structural rather than decorative: a body-part list interleaved with
the poem about how a body-part list is a soul.

Eric Lennon Bowman ([room](../../../eric-bowman/)), in the thread:

> "Embedding and interleaving a Walt Whitman poem within the file format has got to be the single
> most 'this was The Sims team vibe' thing ever. Holy fucking shit."

Jim Mackraz ([room](../../../jim-mackraz/)) offered the complete review: **"Freak."**

## The skeleton sings

Full dump in [`archie-skeleton-dump.txt`](archie-skeleton-dump.txt). Every line is *Dem Bones*:

```
skeleton # 0
name: archie
bone count 21
The ROOT bone's connected to the NULL bone, length 2.82201, canTranslate 1, canRotate 1.
The TORSO bone's connected to the ROOT bone, length 0.469819, canTranslate 0, canRotate 1.
The NECK bone's connected to the TORSO bone, length 0.986622, canTranslate 0, canRotate 1.
The HEAD bone's connected to the NECK bone, length 0.246656, canTranslate 0, canRotate 1.
The HAIR bone's connected to the HEAD bone, length 0.840235, canTranslate 0, canRotate 1.
```

**The ROOT bone's connected to the NULL bone.** The song has to bottom out somewhere, and in a
parent-pointer hierarchy the bottom is a null pointer — so the debug format cheerfully sings the
skeleton down to nothing. Directly under a poem claiming the parts are the Soul, the last line of
the descent is `NULL`. Nobody designed that pairing; the data structure and the epigraph collided.

Four details in the dump worth reading as engineering:

- **21 bones**, and **`canTranslate 1` appears exactly once** — on `ROOT`. Everything else can only
  rotate. That is the whole contract of skeletal animation stated as data: one bone moves through
  the world, the other twenty are angles.
- **`HAIR` is a bone**, hanging off `HEAD` at length 0.840235 — longer than the head itself
  (0.246656). Sims hair was rigged and animated, not painted on. That it belongs to *Archie Bunker*,
  a famously balding man, is a bonus.
- **`RIGHT_HIP` and `LEFT_HIP` have length `9.79906e-008`** — zero-length pivots, floating-point
  noise standing in for 0. Structural joints with no bone, existing only to hold a rotation.
- **The tree branches at `TORSO`** (neck + two shoulders) and again at `ROOT` (torso + two hips), so
  the root is a pelvis and the spine is a child. Standard, and legible straight from the sung form.

## What else the file reports

The Facebook post showed only the skeleton. The full file has three more sections, and they explain
the textures Don posted alongside it.

```
skeleton count 1     archie
suit count 6         archie-head-sleep archie-head-mad archie-head-sad
                     archie-head-happy archie-head-normal archie
skill count 1        archie
material count 11    asleep amad asad ahappy aface ahips ajeans ashoes
                     atshirt atopskin aarmskin
```

**Mood is a whole suit, not just a repaint.** Each expression is its own suit binding a different
mesh to the `HEAD` bone:

```
suit # 1
    name: archie-head-mad
    skin count 1
        bone HEAD gets skin xskin-archie-head-mad-HEAD-HEAD04.msh
```

Five head meshes, `HEAD01`–`HEAD05`, for normal / happy / sad / mad / sleep — **geometry** swaps per
mood, with matching material bitmaps (`aface`, `ahappy`, `asad`, `amad`, `asleep`). The `amad.BMP`
and `aface.BMP` files in the [gallery](../../media/sims-prerelease-bunker-README.md) are two of
those eleven materials, so the posted textures and this report are two halves of one character.

The sixth suit is the body: `skin count 15`, one mesh per bone (`xskin-archie-ROOT-PELVIS.msh`,
`xskin-archie-LEFT_THIGH-LEFT_THIGH.msh`, and so on). Remaining materials are the wardrobe —
`ajeans`, `ashoes`, `atshirt`, `ahips` — plus `atopskin` and `aarmskin` for flesh.

**The animation is a single frame.** `skill # 0 / name: archie / motion count 21` — one motion per
bone, each `frames: 1`, `duration: 33`, `hasTranslation: 0`, `hasRotation: 1`. Thirty-three
milliseconds is one tick at 30fps: this is a **static pose**, twenty-one rotations and no
translation, exported as a degenerate animation. The rig, the wardrobe, and one held breath.

## Why this matters beyond the joke

The 2004 article documents the **binary** CMX layout. This is the **same format speaking English** —
a debug view designed to be read by a human at 2am. The pairing is a small argument about tool
design: the machine format and the human format were the same exporter, and the human one had room
for poetry.

There is also a straight line from here to the current work. Whitman's claim in the header is that
the body's parts *are* the soul, inseparable and portable. Twenty-five-odd years later Don is
building [**Soul City**](../../../../catalogs/soul-city/README.md) — infrastructure for moving
characters between games as **soul files**, so player-made people outlive whoever owns the servers.
The character format was quoting the thesis before the project existed.

## Assets from the same thread

Don also posted the surviving Max files and textures — *"Archie, Edith, The Colonel, Crazy Larry
(was he based on me?!?), The Dutchess, Dunne, Fritz, Gail, Sigmund, and Pizza Dude."*

**Gallery:** [`sims-prerelease-bunker-README.md`](../../media/sims-prerelease-bunker-README.md) —
15 images: the Bunker family face textures with mood variants, Archie's fishnet undershirt,
Jamie Doornbos's Satan, the pet duck, the cut family-selection panel, Ocean Quigley's neighborhood,
and cut UI buttons.

The **Bunker family** — Archie, Edith, Darren, Samantha — was the test household while the game was
still *Dollhouse*, which is why the animation rig is named `archie`. See
[1998-06-04 steering committee demo](../1998-06-04-sims-steering-committee-demo/README.md) for the
same era running live.

## Provenance note

The thread ends in private banter between Don and Eric Bowman ("the bust", "whatever happened to
'stays in Amsterdam??'", `FTFY BOBO`) attached to a deliberately pixelated photo. **Not archived
here** — it is personal, not Sims history, and Don had already censored it himself.

## Repo orbit

- [CMX binary format (2004)](../2004-02-05-sims-character-animation-file-format/article.md) · [VitaBoy docs](../2004-02-05-vitaboy-character-animation-docs/article.md)
- [Soul City catalog](../../../../catalogs/soul-city/README.md) — soul files as the descendant idea
- [Steering committee demo, June 1998](../1998-06-04-sims-steering-committee-demo/README.md) — Bunker-era build
- [Eric Bowman](../../../eric-bowman/) · [Jim Mackraz](../../../jim-mackraz/) — thread voices
- Jamie Doornbos — credited with `C_devil.bmp`; the same engineer whose zeroth-order interaction sketch is discussed in the [same-sex relationships record](../../../patrick-j-barrett-iii/same-sex-relationships-the-record.md)
