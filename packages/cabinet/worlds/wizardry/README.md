# Wizardry worlds

The Proving Grounds scenario disk exported to YAML Jazz with
[scripts/wizardry-world.mjs](../../scripts/wizardry-world.mjs). Importing the directory onto
that disk gives the disk back byte for byte.

| World | Disk | Characters |
|---|---|---|
| [proving-grounds/](proving-grounds/) | [wizardry-i-proving-grounds-disk-2.dsk](../../disks/apple2/wizardry/wizardry-i-proving-grounds-disk-2.dsk) | 20 |

```
node scripts/wizardry-world.mjs export DISK DIR             # .dsk, .po or .woz; merges into DIR
node scripts/wizardry-world.mjs import DIR BASE_DISK OUT.dsk
node scripts/wizardry-world.mjs maze DISK LEVEL
```

Export merges into files that are already there: comments, key order and keys the exporter
doesn't write (`notes:`, anything a soul adds) stay. Import writes only what the files say,
over the base disk, so a directory holding just `characters/` moves those characters onto
another disk. The original Proving Grounds disk has an empty roster; importing
`proving-grounds/characters/` onto
[wizardry-i-scenario-original.woz](../../disks/apple2/wizardry/wizardry-i-scenario-original.woz)
gives a fresh scenario with these 20 people in the castle.

## What a played disk remembers

A scenario disk is written as the game is played, not just the roster:

- **Boltac's stock** (`boltac_stock` in ITEMS.yml): 15 items on the played Proving Grounds
  disk differ from the original, among them STAFF OF MOGREF, EVIL CHAIN + 2 and DEADLY RING.
- **Unique monsters** (`unique` in MONSTERS.yml): monster 100 is 0 on the played disk, 1 on
  the original.
- **Maze specials** count down as they are used, and a used-up one turns NORMAL (SPCMISC
  writes the level back with GETRECW). The played Proving Grounds maze still matches the
  original; specials shipped at 0, like message 159 on level 6, never fire.
- **Characters left in the maze**: `location` is where they were left (LOSTXYL), and
  PARTIES.yml groups them. No one is lost on these disks.

The game keeps no automap: the maze is scenario data, the same for every player.

## The played Proving Grounds roster

Eight characters have every spell bit set, including bit 0, which no spell uses, and 9
points at every spell level: JASON, JAKE, ROB, KILLER, HENRY, GIMLI, SAM THE SHAM, BOB.
A character editor made those. The other twelve look played: JIB, GOR, DIRK THE DARING,
STYX, QUIOP WERT, WOW!, SALA WHO, PAPERBOY, DUMP, MR.T, SNOPPY, THAYER. WOW!, a level 10
mage, knows exactly the first 14 mage spells; SNOPPY, a level 10 priest, the priest spells
of levels 1-4 and DIALMA, KANDI and BADI of level 5.

## Not yet readable

- PICTURES.yml is hex until the picture format is read from the source (ENEMYPIC in
  COMBAT, PIC2SCRN in REWARDS).
