# The Apple ][ section

The cabinet's first machine that isn't DEC's. It runs on microM8, compiled to WebAssembly
([MICROM8.md](MICROM8.md)), and boots real disks.

| Where | What |
|---|---|
| [microm8/](microm8/README.md) | Our changes to microM8 as patches on their repo ([FORK.yml](microm8/FORK.yml)), kept apart from the cabinet's packaging of it |
| [disks/apple2/](disks/apple2/DISKS.yml) | The disks and manuals, each with its size, SHA-1 and library path |
| [disks/apple2/LIBRARY.tsv](disks/apple2/LIBRARY.tsv) | microM8's whole shared library as walked on 31 October 2026: 27,687 files in 2,442 folders |
| [scripts/a2disk.mjs](scripts/a2disk.mjs) | Lists, extracts, adds, deletes and checks files on DOS 3.3, ProDOS and Pascal disks, and formats new ones ([Disk images](#disk-images)) |
| [scripts/woz-to-dsk.mjs](scripts/woz-to-dsk.mjs) | Decodes a 5.25" WOZ flux image to a .dsk ([src/apple2/woz.ts](src/apple2/woz.ts)) |
| [scripts/wizardry-world.mjs](scripts/wizardry-world.mjs) | Exports a Wizardry scenario disk to a directory of YAML Jazz and imports it back, byte for byte |
| [worlds/wizardry/](worlds/wizardry/README.md) | The three played scenario disks as worlds: maze, items, monsters, rewards, messages, one CHARACTER.yml per character |
| [scripts/mind-mirror-world.mjs](scripts/mind-mirror-world.mjs) | Exports the saved lives on a Mind Mirror disk as characters and imports them back |
| [worlds/mind-mirror/](worlds/mind-mirror/README.md) | RAVEN, a saved life, and RAITAN, a save that never finished |
| [scripts/lcp-world.mjs](scripts/lcp-world.mjs) | The same for a Commodore 64 Little Computer People house and the person in it |
| [worlds/little-computer-people/](worlds/little-computer-people/README.md) | Three lived-in houses (Rob, Ivan, Fritz), an unplayed one, and a fan tool disk |

## Disks

- `dos33/`, `prodos/`: DOS 3.3 (August 1980, January 1983), ProDOS 8 2.0.3, the ProDOS 1.1.1
  user's disk and BASIC examples.
- `pascal/`: Apple Pascal disks APPLE0 to APPLE3, the operating system reference manual, two
  addenda, and seven Apple technical notes on Pascal.
- `logo/`: Apple Logo II, MIT Logo (1981), Terrapin Logo 1.0, Krell Logo, and an Apple Logo
  image not yet checked against the 1983 English release.
- `little-computer-people/`, `mind-mirror/`: Activision's Little Computer People (originals as
  WOZ flux images, each with its own house number; the 4am, Circle K and French Touch cracks) and
  Timothy Leary's Mind Mirror (the Digital Gang and 4am cracks; flux captures of a boxed copy
  with two save disks). The Commodore 64, Atari, ZX Spectrum and PC versions are in
  [`disks/c64/`](disks/c64/DISKS.yml), [`disks/atari8/`](disks/atari8/DISKS.yml),
  [`disks/zx/`](disks/zx/DISKS.yml) and [`disks/pc/`](disks/pc/DISKS.yml).
- `wizardry/`: Proving Grounds of the Mad Overlord, Knight of Diamonds and Legacy of Llylgamyn,
  two disks each, with a scenario editor and WizFix; the original Proving Grounds and Llylgamyn
  scenario disks as WOZ flux images, rosters empty as shipped; Sir-Tech's character statistics
  printout program.

## Wizardry

Wizardry is written in Apple Pascal. Thomas William Ewers reconstructed its Pascal and assembly
source, which compiles to the shipped `WIZARDRY.CODE` and `SYSTEM.STARTUP`, and Eric Labelle's
[snafaru/Wizardry.Code](https://github.com/snafaru/Wizardry.Code) builds on it: version 3.2
(March 2026), over a hundred fixes, five disks of source. Its `WIZ.TEXT` declares the records of
`SCENARIO.DATA`:

- `TSCNTOC`, the table of contents: the game's name, then for each section (mazes, monsters,
  rewards, items, characters, special characters, experience) its records per two blocks,
  records on disk, and block offset.
- `TCHAR`, 208 bytes: name, password, race, class, age in weeks, status, alignment, six
  attributes, gold, eight possessions with equipped, cursed and identified flags, experience,
  level, hit points, spells known, mage and priest spell points, armor class, and where the
  character was lost in the maze.
- `TOBJREC`, 78 bytes, an item; `TMAZE`, a 20 by 20 level: four walls per square (open, wall,
  door, hidden door), an encounter flag, and one of sixteen square kinds per square.

[`src/apple2/wizardry-schema.ts`](src/apple2/wizardry-schema.ts) declares those records as data
for the record layout in [`@wwsff/bridge`](../bridge/README.md), and
[`src/apple2/wizardry-world.ts`](src/apple2/wizardry-world.ts) turns a scenario disk into
[a directory of YAML Jazz](worlds/wizardry/README.md) and back, in the browser or under Node.
The three scenario disks here still hold the characters of whoever last played them: twenty on
Proving Grounds (JIB, a level 11 human fighter with a Dragon Slayer and the Blue Ribbon; DIRK
THE DARING; SAM THE SHAM, level 50), eighteen on Knight of Diamonds (HELLFIRE, an elf bishop at
level 249), and twenty roster slots named UNSET on Legacy of Llylgamyn.

A character written back into `SCENARIO.DATA` is loaded by the real game, so the same
character can move between Wizardry and another world and back: the kind of crossing Soul City's
[bridges](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-BRIDGES.md)
describe for The Sims.

Rebuilding `WIZARDRY.CODE` from source needs Apple Pascal 1.1 on a //e with 80 columns and four
drives. Playing it does not: the shipped game is the two disks, and
[`src/apple2/games.ts`](src/apple2/games.ts) boots them.

## Playing one

A game names its disks, the disk the people live on, and the devices it needs. `Play` puts
those disks in a running microM8 and boots. Export and import then run that game's bridge on
the bytes the guest just wrote, and remount the result. Wizardry I and Mind Mirror are wired
that way. Don's Forth starts on the `apple2-plus-videx` profile: the wasm build has the Videx
card ([VIDEX.md](VIDEX.md)). The paddles and annunciators are already there. Little Computer
People is the same kind of bridge on a Commodore disk, [`src/c64/lcp.ts`](src/c64/lcp.ts), not
an Apple image.

## Saved lives

Mind Mirror and Little Computer People bridge the same way as Wizardry: a saved person becomes a
character directory, and import writes it back into any copy of the game. The disks keep what
their players left. One Mind Mirror disk holds RAVEN's life and another the name of RAITAN,
whose save never finished ([worlds/mind-mirror](worlds/mind-mirror/README.md)). On the Commodore
64, three Little Computer People houses are lived in: Stephen's Rob, Rainer Huhn's Ivan, and
Fritz in the house of a Swiss cracking group
([worlds/little-computer-people](worlds/little-computer-people/README.md)). None of the Apple II
Little Computer People disks was played.

## Disk images

The three Apple II file systems, read and written in TypeScript, so the same code runs at build
time under Node and in the page next to the emulator. That is how files get onto a disk before
it boots: a saved person into a game's save disk, a block of Forth source onto Don's disk.

| Module | Does |
|---|---|
| [`src/apple2/disk.ts`](src/apple2/disk.ts) | Sector orders (DOS order `.dsk`/`.do`, block order `.po`/`.hdv`), the 2MG wrapper, which file system an image holds |
| [`src/apple2/prodos.ts`](src/apple2/prodos.ts) | ProDOS: seedling, sapling and tree files, subdirectories that grow, the volume bitmap, GS/OS lower-case names, forked files' data forks, delete, rename, file types, format, check |
| [`src/apple2/dos33.ts`](src/apple2/dos33.ts) | DOS 3.3: every file type with its header, files longer than one track/sector list, delete (undeletable, as DOS does it), rename, lock, format, check |
| [`src/apple2/pascal.ts`](src/apple2/pascal.ts) | Apple Pascal: contiguous files, `.TEXT` files in the editor's page format, delete, rename, krunch, format, check |

`check()` lists what is wrong with a volume: a block or sector two files claim, one a file uses
that the bitmap calls free, counts that disagree. `unclaimed()` lists space marked used that no
file holds, which on a game disk is usually the game's own data. Every ProDOS and Pascal disk in
the library checks clean; the DOS 3.3 reports are the cracked Logo disk's damaged track/sector
lists and six Little Computer People sides whose catalog sectors hold game data.

The tests ([`src/apple2/disks.test.ts`](src/apple2/disks.test.ts)) read Don's Forth disk in both
orders and the Apple Pascal disks, write every kind of file, and, with `CP2` set to CiderPress
II's `cp2` command, have CiderPress II test and extract every image they write.

The file systems are written from their documentation: Apple's *ProDOS 8 Technical Reference
Manual* and ProDOS 8 Technical Notes #25, #28 and #30, GS/OS Technical Note #8, Don Worth and
Pieter Lechner's *Beneath Apple DOS* and *Beneath Apple ProDOS*, and the *Apple Pascal Operating
System Reference Manual*. Andy McFadden's [CiderPress II](https://github.com/fadden/CiderPress2)
(Apache 2.0) is the reference they are checked against, its file system notes
(`DiskArc/FS/*-notes.md`) and its `cp2` command. [AppleCommander](https://applecommander.github.io)
(Rob Greene, John B. Matthews and contributors) and microM8's disk package (Paleotronic) do the
same work in Java and Go.

## Apple Pascal disks

Volumes are 140K, read in ProDOS block order; the directory is blocks 2 to 5, 26 bytes an
entry, and files are contiguous. [`src/apple2/pascal.ts`](src/apple2/pascal.ts) reads and writes
them, and `scripts/a2disk.mjs` lists and extracts their files.

## Don's Forth

Don Hopkins's 6502 fig-FORTH terminal for ProDOS drives a Videx Videoterm in expansion slot 3. The wasm
build has the card, on the `apple2-plus-videx` profile ([VIDEX.md](VIDEX.md)): boot `forth.po`
and block 4 draws its banner on the card, then runs `term`, the H19 terminal, on the serial card
in expansion slot 4 (patch `0006-serial-2651-card`): a 2651 at `$CE00` in the expansion slot's `$C800` space, which
the page reaches with `serialSend` and `serialTake`. Left and right Option are the keyboard's two
buttons, Meta and the terminal's command shift; right Option-F enters Forth. Both disks,
`forth/forth.po` and `forth/forth-ok.po` (stops at the Forth prompt), are on the page's disk menu,
which restarts on the disk's profile from [DISKS.yml](disks/apple2/DISKS.yml). The light pen, one pointer with a
Videx driver and a paddle driver, is in [LIGHTPEN.md](LIGHTPEN.md). The disk and its analysis:
[Apple2Forth](../../characters/don-hopkins/artifacts/Apple2Forth/README.md).
