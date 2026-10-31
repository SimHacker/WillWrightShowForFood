# Little Computer People worlds

Each directory is one Commodore 64 disk of Activision's Little Computer People (1985): a
`HOUSE.yml` describing the disk, the person living there as `characters/<name>/` with a
`CHARACTER.yml` and the raw research data in `LCP-RECORD.yml`, and listings of the disk's BASIC
programs in `programs/`. The core is [`src/c64/lcp.ts`](../../src/c64/lcp.ts); the disks are in
[`disks/c64/little-computer-people/`](../../disks/c64/DISKS.yml).

| World | Disk | Researcher | Person |
|---|---|---|---|
| [stephen-and-rob](stephen-and-rob/) | "h stephen 7 times started" | Stephen | Rob |
| [sphinx-ivan](sphinx-ivan/) | Sphinx crack, disk name DIRK SCHMIDT | Rainer Huhn | Ivan |
| [sca-fritz](sca-fritz/) | SCA (Swiss Cracking Association) crack | Sca Cracks All | Fritz |
| [a131-move-in](a131-move-in/) | an original, as shipped | Billy Bob Binkle | Zeke, not moved in |
| [tools-side-b](tools-side-b/) | "ASS PRESENTS:" tool disk | | |
| [snail-one-file](snail-one-file/) | Snail crack, one file | | |

```sh
node scripts/lcp-world.mjs export disks/c64/little-computer-people/lcp-cr-sca.d64 worlds/little-computer-people/sca-fritz
node scripts/lcp-world.mjs import worlds/little-computer-people/sca-fritz disks/c64/little-computer-people/lcp-a132.d64 /tmp/fritz-moved.d64
```

Import writes two sectors and nothing else, so a person moves into any copy of the game.
Exporting merges into what is there: comments and keys someone added survive.

## What a house remembers

**House number**, sector 18.17: eight characters stored backwards, then `NVTCA` (ACTVN
backwards) and `$01` to the end of the sector. Every copy has its own; the nine originals a131
to a139 have nine. LCP CREATOR and CREATE NEW LCP write a new number together with an empty
house to get a new person. CREATE NEW LCP draws each character as `CHR$(48+INT(RND(1)*15))`,
`0` to `>`, which is why Rob's house is `=8336>76`. The Apple II disks keep the same eight
characters in sector 17.1: 318 (the "project" disk 1 and the 4am crack made from it), 443, 712
(house-on-a-disc), 314 (the Circle K crack), 2493 and 47 (French Touch).

**Research data**, sector 1.4, 256 bytes:

| Offset | Bytes | What |
|---|---|---|
| $91 | 16 | bit masks `FE FD FB … 7F 01 02 … 80`, the same in every record |
| $B2 | 21 | the researcher's name, padded with spaces |
| $CA | 13 | the person's name, padded with zeros |
| $E6 | 21 | the researcher's name again on a played disk; leftover code on an unplayed one |

The rest is the person's state and is not decoded. Every original ships the same record, an
empty house waiting for "Zeke" with researcher "Billy Bob Binkle"; LCP EVICTOR writes it back to
start over. On the Apple II the same template is on track 8 ("Billy" at 8.0 $D8, "Zeke" at 8.7
$F8) and is identical on every Apple image here, so none of them was played.

## The tool disk

`tools-side-b` is a fan disk, "ASS PRESENTS:", with thanks to COYOTE and GRUMPS and hello to
ROTH and ZILCH. Its BASIC programs are the source for the offsets above:

- LCP HOTEL V1.1 saves a person to a data disk as `LCP.<name>` (the name from $CA, the eight
  house number digits, 41 random digits, twenty characters) and writes them back: the house number
  into 18.17 and its own copy of the research data into 1.4.
- LCP CREATOR writes a new house number of digits 0 to 9 and the empty-house record: "DR.
  FRANKENSTEIN LIVES!"
- LCP EVICTOR writes only the empty-house record, "to watch the 'moving in' process".
- LCP GENERATOR is CREATE NEW LCP; LCP KEYS is INSTRUCTIONS LCP, the control keys (F food, W
  water, A alarm clock, D dog food, C phone, P pet, R record, B book).

## Not yet readable

- The person's state in the record: moods, needs, house.
- One-file cracks (Snail, TGS, ABC, Radwar, TAC, the plain image) keep the house inside their
  file; Snail and TGS have the move-in record at a shifted offset.
- The Apple II record layout on track 8, the Atari disk, and the two ZX Spectrum snapshots,
  which hold the move-in names in memory.
