# Mind Mirror worlds

Each directory is one Apple II disk of Timothy Leary's Mind Mirror (Electronic Arts, 1985) with
a saved life on it: `DISK.yml` describes the disk, and each save is a character in
`characters/<name>/CHARACTER.yml`. The core is
[`src/apple2/mind-mirror.ts`](../../src/apple2/mind-mirror.ts); the disks are in
[`disks/apple2/mind-mirror/`](../../disks/apple2/DISKS.yml).

| World | Disk | Save |
|---|---|---|
| [life-simulation-b](life-simulation-b/) | a user's copy of Disk 2 Side B, labeled Life Simulation B | RAVEN |
| [raitan](raitan/) | a blue disk with one catalog entry | RAITAN, unfinished |

Both are flux captures in archive.org's `electronic-arts-mind-mirror-a2-ph`, collection
`flux_capacity_hagstrom`.

```sh
node scripts/mind-mirror-world.mjs export disks/apple2/mind-mirror/mm-flux-life-simulation-b.woz worlds/mind-mirror/life-simulation-b
node scripts/mind-mirror-world.mjs import worlds/mind-mirror/life-simulation-b disks/apple2/mind-mirror/mm-flux-disk-2-side-b.woz /tmp/raven.dsk
```

Import writes each save over its own file, or as a new file on a disk without it, so RAVEN
moves onto a clean Disk 2 Side B. On its own disk, export then import leaves every byte as it was.

## A save

A DOS 3.3 B file named for the person, loaded at $040C by `SAVE.OVR`. One data sector:

| Offset | What |
|---|---|
| 0 | a flag, 1 in RAVEN |
| 1 | seventeen signed 16-bit scores |
| 35 | ten bytes |
| 45 | the name, ending in 0; zeros to the end |

RAVEN's scores are 1, -9, 5, 3, -1, 9, 5, 27, 39, 100, 7, 13, -10, 0, 9, 8, 16. The game writes
$0101 as the length in the DOS header though the file has one 252-byte sector; import keeps the
header as it finds it, and gives a new save the same.

RAITAN's catalog entry points its track/sector list at track 111, off the disk, and the VTOC
marks track 18 allocated with nothing written there: the save stopped after the name.

## Disks without saves

Life Simulation A (the same as Disk 2 Side A), the other flux disks, the Digital Gang crack's
three disks (disk 3 differs from the flux Disk 2 Side B only inside FILE31C and in one unowned
sector), the 4am crack, the three Commodore 64 disks, and the PC version's SAVE.DAT, a formatted
disk with nothing on it.

## Not yet readable

What each score measures. The game's text is compressed, so `SAVE.OVR` and the realm overlays
`R1.OVR` to `R4.OVR` need disassembling to name them.
