# Upcycling formats: microPAK, cartridges, and what an old program needs to travel

A discussion paper for the [emulation roundtable](../../repo-shows/emulation-roundtable/README.md):
how microM8's microPAK and the cabinet's cartridges package an old program with everything that
makes it better than it was, how they compare with other emulators' configuration files and with a
git repository, how one can nest inside another without either being flattened, and what tools and
shared vocabulary would let them travel between emulators. Facts about microPAK are from
Paleotronic's [microPAK help page](https://paleotronic.com/software/microm8/help/micropak/) and
microM8's source ([microm8-cln](https://github.com/paleotronic/microm8-cln), MIT); facts about
cartridges from [CARTRIDGES.md](CARTRIDGES.md). Questions for April and Melody are at the end.

## microPAK, as it is

- **A ZIP with a `.PAK` extension.** microM8 opens a `.pak` as an `OctContainer`, which is its ZIP
  file provider (`files/octprovider.go`, `files/zipfileprovider.go`). It can hold "disk images, BASIC
  or binary code, data files, text files, images, music or audio."
- **Seven configuration files**: `audio.cfg`, `boot.cfg`, `camera.cfg`, `control.cfg`,
  `input.cfg`, `palette.cfg`, `video.cfg`. They are written in OGDL (Ordered Graph Data Language,
  parsed with `rveen/ogdl`) and read by microM8's `presentation` package, section by file and path by
  dotted key. `boot` gives the start file (`init.startfile`); `camera` gives `position`, `lookat`,
  `angle`, `fov`, `near`, `far`, `zoom`, `panx`, `pany`; `video` gives the display modes (`hgrmode`,
  `dhgrmode`, `shrmode`, `grmode`, `hgrntsc`, `tintmode`, `scanline`, `vertblend`, `voxeldepth`),
  lighting (`light.ambient`, `light.diffuse`), `font`, `aspect`, `bgcolor`, `highcontrast`;
  `palette` gives colours as `rgba`, `offset` and `depth`. A machine profile (`apple2e-en`) is the
  base the PAK's settings apply to.
- **Control programs.** `control.cfg` names Applesoft programs that load into virtual machines two,
  three and on (microM8 runs up to eight sessions), while the root program boots in slot one. With
  microM8's `@functions`, specifically the `@vm.*` family and `@vm.redirect`, a control program reads
  and changes the root machine's memory and settings: watch addresses for values, hold values fixed
  ("for cheating!"), change the presentation as the game goes.
- **Made and edited inside the emulator.** Shift-Control-P on a disk in the catalog makes a PAK with
  default settings; Shift-Control-P while a program runs makes one that captures the session's
  current settings. Control-Shift-O opens a PAK, Control-Shift-E edits a `.cfg` in place, and
  re-selecting the PAK reboots it. Settings are documented in `micropak-help.txt` in microM8's
  `/micropaks` folder.
- **Alongside it**: YAML "preset" files in `~/microM8` for global configuration, and a separate
  binary package container (`S8CT`, `files/package.go`) whose entries carry `name=value` metadata.

What microPAK is for, in Paleotronic's words: "new presentations for old games including
colour-remapping, 3D pixel shifting, music, backdrops, overlays, memory cheats, control programs."

## The cabinet's cartridge, as designed

- **A directory**, with `cartridge.yml`, its own files, and a `README.md` that HyperTIES shows as the
  help beside the machine. Today the cartridges are still JavaScript objects in
  `cabinet-programs.js`; the YAML is the design.
- **Machine wiring as well as presentation**: CPU, memory banks, devices, ports, mappings, timing,
  interrupts, host adapters.
- **Resources and build steps**: sources, tapes, images, symbols, listings and source maps;
  `assemble`, `tape-compile`, `patch`, `read-in`, with a cache.
- **`extends`**: a child cartridge names a parent and adds to it (`forth-flowers` extends `forth`).
- **Profiles** stacked in the URL (`/cabinet/forth/?profile=trace`), and **scenes** of several
  machines with the room and the people at them.
- **Live coding and git**: edits in the page are saved, become commits in your own repo, a pull
  request, CI, a deploy.
- **Small code of its own**: host-side handlers for one program, like the SIGWINCH constant written
  into Forth ([MANIFESTO](MANIFESTO.md#push-the-driver-out-into-the-host)).

## Side by side

| | microPAK | Cabinet cartridge |
|---|---|---|
| Container | one ZIP file | a directory; a ZIP or a git repo to move it |
| Syntax | OGDL, one file per concern | YAML, one manifest plus files |
| Scope | presentation and control of a program that runs unchanged | machine wiring, build, presentation, help, scenes |
| Base | a machine profile (`apple2e-en`) | `extends` another cartridge |
| Scripting | Applesoft with `@vm.*`, in sibling virtual machines on the same emulator | host TypeScript handlers, Forth on the machine, tiny-titan translators |
| Made by | capturing a running session, or from a disk in the catalog | writing YAML, or saving from the LIVE CODING panel |
| Edited | inside the emulator | in the page or in any editor |
| Provenance | file metadata in the ZIP | `VARIANTS.yml`, source maps, git history |
| Diff and merge | as a ZIP, no | line by line in git |
| Runs today | yes, for years | partly; the format is the target |

They meet in the middle. microPAK leads on presentation (3D, palettes, cameras, overlays, music)
and on in-machine control programs, and it already works. The cartridge leads on build, provenance
and git. Neither is wrong; they're organelles of the same cell.

## Others in the field

- **SIMH** `.ini` and do-files: commands (`SET`, `ATTACH`, `DEPOSIT`, `BOOT`) run in order, a script
  rather than a description. The cabinet's [SIMH map](SIMH-MAP.md) compares SIMH's model
  with the cabinet's; the cabinet doesn't run SIMH's command language yet.
- **MAME** software lists (XML, by checksum, with part and interface names) and per-system `.ini`
  files: the best catalogue of what a medium is; little about how to present it.
- **RetroArch** core options and per-game overrides, and playlists: layered settings by core, by
  directory and by game.
- **DOSBox** `.conf` with an `[autoexec]` section: settings plus a boot script.
- **The Internet Archive's Emularity** reads emulator settings from an item's metadata, so the
  archive item is the package.
- **WOZ** disk images (Applesauce) carry a `META` chunk of key and value pairs about the software:
  title, publisher, the machines it needs.
- **The cabinet's own** `VARIANTS.yml` (copies with provenance) and unpacked images (a disk as a git
  tree that repacks byte for byte, [PRESERVATION.md](PRESERVATION.md)).

## A git repo as the canonical form

A ZIP is a good way to carry a program and a poor way to work on one. The cabinet's answer
([PRESERVATION.md](PRESERVATION.md)) is to unpack everything into a git tree that packs back exactly:

- A PAK unzips into a directory, and that directory, with a `cartridge.yml` beside the original
  `.cfg` files, is a cartridge. Zipping it back gives the same PAK.
- Disk images inside unpack too (a ProDOS or DOS 3.3 disk into its files, with the layout recorded so
  it repacks), so a change to one BASIC program is one line in a diff, not a new binary.
- History, blame, branches and pull requests come free, and so does a public home where anyone can
  propose a better palette for Karateka.

## Organelles: nesting without flattening

From MOOLLM's soul model: an organelle keeps its own format inside a larger thing and is never
flattened into a common schema ([CHARACTER-ENDOSYMBIOSIS](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/CHARACTER-ENDOSYMBIOSIS.md)).
For emulator packages:

```
karateka/
  cartridge.yml          what it is, which organelles, how they map onto each other
  README.md              help, history, credits
  micropak/              microM8's organelle: the .cfg files and control programs, untouched
    boot.cfg  video.cfg  camera.cfg  palette.cfg  audio.cfg  input.cfg  control.cfg
    control/watch.bas
  media/
    karateka.woz         the disk, with its own META chunk
    karateka.dsk/        or unpacked, with the layout to repack it
  simh/ mame/            other emulators' organelles, when there are any
  views/                 the cabinet's typed-memory declarations, Dasher grammars, tours
```

Rules that keep it honest:

- **Keep originals byte for byte**, and say which files a tool may rewrite.
- **Preserve unknown keys.** A translator that doesn't understand a setting carries it through.
- **Translate, don't replace.** `cartridge.yml` may say "microM8's `video.voxeldepth` is our
  `presentation.depth`," and a tool can write either from the other, but both stay.
- **Nest freely.** A cartridge can contain a PAK; a PAK can be generated from a cartridge; a scene
  can hold cartridges for several machines that talk over [core links](CORE-LINKS.md).

## Upcycling metadata: a shared vocabulary

What both formats describe, grouped so each emulator can map its own names onto it:

| Group | Covers | microPAK today | Cabinet |
|---|---|---|---|
| **Identity and provenance** | title, authors, dates, source, checksums, rights | ZIP entries, filenames | Dublin Core terms, as Soul City's souvenirs use ([SOUVENIRS](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUVENIRS.md)); `VARIANTS.yml` |
| **Machine** | model, memory, cards, ROM set, speed | machine profile | `machine:` wiring |
| **Media** | disks, tapes, files, boot order | `boot.cfg` | `resources`, `build` |
| **Presentation** | palette, display modes, 3D, camera, lighting, overlays, backdrops, music | `video`, `camera`, `palette`, `audio` | profiles, panels, the portrait |
| **Input** | key maps, joystick and paddle mapping, mouse as joystick | `input.cfg` | the teletype's bindings, host devices |
| **Memory semantics** | what regions mean, values to watch, cheats as patches | control programs | typed memory, `patch` resources |
| **Behaviour** | scripts that watch and change the running program | Applesoft with `@vm.*` | host handlers, Forth words |
| **Access** | screen-reader text, captions, the grammar for Dasher and completion | | [TELETYPE-DASHER](TELETYPE-DASHER.md) |
| **Teaching** | help, tours, annotated views, sources | | README, HyperTIES, source maps, tours |

## Scripting: three places a script can live

1. **Inside a machine**, in its own language: microM8's control programs in Applesoft with `@vm.*`,
   or Forth on the PDP-7. Period-appropriate, runs at the machine's speed, needs the emulator's
   extensions.
2. **On the host**, in the emulator's language: the cabinet's TypeScript handlers; microM8's Go.
   Fast and complete, invisible to the old machine.
3. **Outside, over an API**: microM8's MCP tools and debug WebSocket ([MICROM8.md](MICROM8.md));
   the cabinet's tiny-titan. Any language, any process, an AI.

A common event model would let a script be written once and run in any of the three places:
**watch** an address or range for a condition, then **patch** memory, **send** keys, **set** a
setting, **switch** a view, or **send a message** to another machine. microM8's control programs
are already this, in Applesoft; the shared vocabulary would let the same watch-and-act rules be
expressed in a cartridge and run against microM8, or the other way round.

## Tools

What a federation of emulators would want, starting small:

- **Translate**: `pak ↔ cartridge` (unzip, read OGDL, write `cartridge.yml` mappings, keep the
  originals), and to and from SIMH do-files, MAME software-list entries and WOZ `META`.
- **Validate**: check a package against its schema and its checksums; warn on keys a tool doesn't
  know, never drop them.
- **Configure**: a settings panel generated from the schema, so a palette or a camera is edited
  with a picker, live, as microM8 does with its in-emulator editor.
- **Manage**: a catalogue across emulators, with what each package needs and which emulators can
  run it.
- **Package and publish**: zip for microM8, a git repo for the cabinet, an Internet Archive item with
  a manifest of checksums and sources (as for [Severe Tire Damage](../../characters/mark-weiser/media/severe-tire-damage/README.md)).

A TypeScript package (`@wwsff/cartridge-tools`) would hold the first of these: a PAK reader and
writer over ZIP, an OGDL parser and serializer (OGDL is small), and the mapping tables.

## Questions for April and Melody

1. Is `micropak-help.txt` the full specification of the `.cfg` keys, and would they publish it beside
   the source so other tools can read and write PAKs?
2. Would they want a cartridge-to-PAK and PAK-to-cartridge translator, and tests that keep the two in
   step?
3. Could the `@vm.*` control-program functions be described as a small event model (watch, patch,
   set, send), so the same rules could run over MCP or the debug WebSocket?
4. How do they think about provenance and credit inside a PAK: who made the upcycle, from which
   disk, under what terms?
5. Would turtleSpaces projects want the same packaging, for the gallery and for export?
6. What's in the `S8CT` package format, and where is it used?

↑ [README](README.md) · [CARTRIDGES](CARTRIDGES.md) · [MICROM8](MICROM8.md) · [CORE-LINKS](CORE-LINKS.md) · [emulation roundtable](../../repo-shows/emulation-roundtable/README.md)
