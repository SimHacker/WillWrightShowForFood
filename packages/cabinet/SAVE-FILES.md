# Save files: the whole machine, at rest

A save file holds everything needed to resume a machine exactly where it stopped, and nothing that
can be recomputed from it. Tools read, edit, render and compare it without running the emulator, from
the command line, from TypeScript in Node or the page, and from the cabinet's panels; running the
machine from it is one more operation.

The format is the same for every machine on the backplane. The Apple ][ is the first full user
([microm8/STACK.md](microm8/STACK.md)); the PDP-7, whose state today is a core image plus a
replayable session ([SIMH-MAP.md](SIMH-MAP.md)), moves to it next. It follows the rules in
[WEB-BENCH.md](WEB-BENCH.md): portable by construction, written only while the machine is paused,
kept in the browser's origin private file system.

## What is saved, what is not

| Kind | Examples | In the save file |
|---|---|---|
| **State** | registers, cycle count, memory banks, soft switches, every unit's and card's state, the input queue | yes, always |
| **Media** | disk images, tapes, cassettes | by hash; embedded when the save is exported on its own |
| **Derived** | page tables (from the soft switches), the picture (from memory and modes), the disassembly, typed views | no; recomputed on load or on demand |
| **History-derived** | heat maps, last reader, writer and executor, traces, profiles | no; recomputed by replaying a session that ends at this save |
| **Authored** | annotations, type maps, source maps, tours, notes | no; they are layers in the graph ([microm8/TEACHING.md](microm8/TEACHING.md)), and the save links to them by hash |

The rule for state: if leaving it out changes what the machine does next, it is saved. If it only
changes what a person sees, it is derived, and a tool can make it again. A derived result may be
cached next to the save, keyed by the save's hash, and thrown away at any time.

Overlays come from history, not from a single moment. A save that wants them keeps its history: an
earlier save plus the cycle-stamped inputs since, which is the cabinet's session
([`src/session.ts`](src/session.ts)). Replaying the session with the overlays on regenerates them
exactly ([microm8/TRANSPARENCY.md](microm8/TRANSPARENCY.md#time-rewind-without-recording-everything)).

## The layout

A save is a directory. The same directory zipped is the single-file form for downloads, the browser's
storage and links. Text is YAML; memory and other bulk bytes are raw files, so a 64K bank is 64K on
disk, not a quarter of a million characters of numbers.

```
lode-runner.save/
  SAVE.yml               format, version, machine, cycle, made by, when, from which save; every part with its schema version and hash
  cpu.yml                registers, variant, cycle, interrupt lines
  memory/
    main.bin             64K, raw
    aux.bin              64K, raw (a //e)
    lc.bin               language card RAM
  units/
    iou.yml              soft switches: text, mixed, page 2, hires, 80 columns, aux read and write, language card banks
    video.yml            beam position, flash phase
    keyboard.yml         latch, strobe, queued keys
    speaker.yml          level
    gameport.yml         paddle timers, buttons, annunciators
    cassette.yml         level, tape position
  slots/
    3-videx/
      state.yml          6845 registers R0-R17 (R16, R17 are the light pen), selected register, RAM page
      ram.bin            2K screen RAM
    6-disk2/
      state.yml          card latches, sequencer state, motor, selected drive
      drive-1.yml        head phase and quarter track, bit position, write protect, media hash
      drive-2.yml
  media/
    sha256-1f3a….woz     only in an exported save; otherwise found by hash in the media store
  inputs.yml             inputs queued for future cycles, and service requests not yet answered
  links.yml              hashes of the authored layers this save belongs with
```

Every part says which unit wrote it and at what schema version. The manifest's hash covers the
parts' hashes, so two saves can be compared part by part without opening them, and rewind
snapshots and lockstep catch-up share unchanged parts instead of copying them.

## Plugging in a card adds its state

A unit declares its state as data, with a schema, a version and the defaults for a new unit:

```ts
export const videx = defineCard({
  name: "videx-videoterm",
  version: 1,
  state: {
    reg: bytes(18),          // 6845 R0-R17; R16 and R17 are the light pen address
    sel: u8(),               // the 6845 register selected
    page: u8(),              // which 512 bytes of screen RAM are at $CC00
    ram: blob(2048),         // saved as ram.bin
  },
  migrate: { },              // version n to n+1, when the state changes shape
  ...
});
```

Plugging a card into a slot creates its part from those defaults; removing it removes the part.
A save that contains a card the current build doesn't know is still loaded: the card's part is
kept as it is, shown as an unknown card, and written back unchanged, so a save never loses state
because a plugin is missing. A part at an older version is upgraded by the card's migrations;
a part at a newer version than the plugin understands is kept and the card stays out of the
machine until the plugin is updated.

microM8 does the same per card with `GetYAML` and `SetYAML` on every slot card; the Videx state
above is the one our patch already saves (`core/hardware/apple2/videx.go`). Its freeze file
(`freeze/freeze.go`: registers, compressed memory, memory and video modes, disks by name, blobs)
is read by an importer, so a microM8 freeze becomes a save.

## Reading and writing a save, at every level

One library does all of this, in Node and in the page, and the command line is a thin layer over
it. None of it needs the emulator, except running.

| Level | What it works with | Examples |
|---|---|---|
| Container | files, hashes, the manifest | list parts; check hashes; pack and unpack the zip; compare two saves |
| Parts | a unit's state by path | read `cpu.pc`; set `slots.3.reg.12`; list a card's fields with their meanings from its schema |
| Memory | addresses as the CPU sees them | read `$D000` with the language card banking the soft switches select; or a bank by offset |
| Typed views | memory read as what it is | the text page as 24 lines; the hires page as an image; page zero as named variables; the Applesoft program as its `LIST`; the Videx screen as 80 columns |
| Media | what is in the drives | catalog the disk in drive 1; read a file from it; the bit stream under the head |
| Edits | changes that keep the machine consistent | insert or eject a disk; queue keys; set a paddle; plug or pull a card; replace a BASIC line, retokenised and relinked |
| Derived layers | computed from the save | render the screen with the reference decoder; disassemble; the graph's live values at this moment |
| History | a session ending at the save | replay with overlays on; heat map; trace; profile |
| Running | the emulator, loaded only now | step one instruction, run a million cycles, run until a PC or a breakpoint, and write the result as a new save |

From the command line (`node scripts/save.mjs`, short form `save` here):

```
save info  lode-runner.save                    manifest, parts, sizes, hashes
save get   lode-runner.save cpu.pc
save set   lode-runner.save slots.3.reg.12 0
save peek  lode-runner.save '$400' 40 --as text
save poke  lode-runner.save '$3F2' 00 03
save view  lode-runner.save text | hires --png out.png | zero-page | basic | videx
save cat   lode-runner.save 6:1                catalog of slot 6, drive 1
save card  lode-runner.save add 3 videx-videoterm
save disk  lode-runner.save insert 6:1 game.woz
save diff  a.save b.save                       parts, fields, memory pages
save run   lode-runner.save --cycles 1000000 -o later.save
save derive session/ heat --png heat.png       replay a session, compute an overlay
save import microm8.freeze -o imported.save
```

Every command that changes a save writes a new one, with `from` in its manifest pointing at the
old one, unless told to change it in place. A chain of saves is a history you can walk back.

## Where saves live

- **In the page**: the origin private file system, with `navigator.storage.persist()` asked for.
  Media live in one store by hash, so many saves share one copy of a disk.
- **In Node and on disk**: directories, readable with ordinary tools.
- **In git**: a save directory is small (a //e is about 130K of raw banks plus a few kilobytes of
  YAML) and commits as it is, no Git LFS. A demo state in a cartridge is a save, and a link can open
  the cabinet already running it.
- **As a download**: the zip, with media embedded.

## The disk and the drive

A disk is its own file, as it is in life. The drive's part of the save holds the head, the motor and
the hash of the disk it holds. Writes go to the disk's working copy in the media store, and the
save records that copy's new hash. An exported save embeds the disks as they are at that moment.

## Exactness

- **Saved between instructions**, with the machine paused. Units that run mid-instruction state
  (the Disk II's sequencer, a 6522's timers) save it as data, so nothing is lost.
- **The cycle count is saved**, so units that catch up by elapsed cycles resume where they were.
- **Host-dependent inputs** (a clock card reading the time, a service's answer) are inputs in the
  log, never read again on restore, so a restored machine continues the same way.
- **Round trip**: saving, loading and saving again gives the same bytes, and running a restored save
  gives the same state hashes as running the original. Both are tests
  ([microm8/PLAN.md](microm8/PLAN.md#11-rewind-and-sessions)).

↑ [README](README.md) · [microm8/STACK](microm8/STACK.md) · [CARTRIDGES](CARTRIDGES.md) · [WEB-BENCH](WEB-BENCH.md)
