# The Apple ][ section

The cabinet's first machine that isn't DEC's. It runs on microM8, compiled to WebAssembly
([MICROM8.md](MICROM8.md)), and boots real disks.

| Where | What |
|---|---|
| [microm8/](microm8/README.md) | Our changes to microM8 as patches on their repo ([FORK.yml](microm8/FORK.yml)), kept apart from the cabinet's packaging of it |
| [disks/apple2/](disks/apple2/DISKS.yml) | The disks and manuals, each with its size, SHA-1 and library path |
| [disks/apple2/LIBRARY.tsv](disks/apple2/LIBRARY.tsv) | microM8's whole shared library as walked on 31 October 2026: 27,687 files in 2,442 folders |
| [scripts/pascal-disk.mjs](scripts/pascal-disk.mjs) | Lists and extracts files on Apple Pascal volumes |
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
level 249), and twenty slots named UNSET on Legacy of Llylgamyn.

A character written back into `SCENARIO.DATA` is loaded by the real game, so the same
character can move between Wizardry and another world and back: the kind of crossing Soul City's
[bridges](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-BRIDGES.md)
describe for The Sims.

Rebuilding `WIZARDRY.CODE` from source needs Apple Pascal 1.1 on a //e with 80 columns and four
drives.

## Saved lives

Mind Mirror and Little Computer People bridge the same way as Wizardry: a saved person becomes a
character directory, and import writes it back into any copy of the game. The disks keep what
their players left. One Mind Mirror disk holds RAVEN's life and another the name of RAITAN,
whose save never finished ([worlds/mind-mirror](worlds/mind-mirror/README.md)). On the Commodore
64, three Little Computer People houses are lived in: Stephen's Rob, Rainer Huhn's Ivan, and
Fritz in the house of a Swiss cracking group
([worlds/little-computer-people](worlds/little-computer-people/README.md)). None of the Apple II
Little Computer People disks was played.

## Apple Pascal disks

Volumes are 140K, read in ProDOS block order; the directory is blocks 2 to 5, 26 bytes an
entry, and files are contiguous. [`src/apple2/pascal.ts`](src/apple2/pascal.ts) reads them. For writing: CiderPress II and
AppleCommander, and the `ucsd-psystem-fs` tools (version 1.22).

## Don's Forth

Don Hopkins's 6502 fig-FORTH terminal for ProDOS drives a Videx Videoterm in slot 3, which
microM8 doesn't emulate yet ([FORK.yml, next](microm8/FORK.yml)). The disk and its analysis:
[Apple2Forth](../../characters/don-hopkins/artifacts/Apple2Forth/README.md).
