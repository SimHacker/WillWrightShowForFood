# Snapshots: a machine's state, at rest

A snapshot is one moment of a cabinet's state. It is the file you keep, name, and pass around. A cabinet is the container: the CPUs and devices installed in it, the cartridge inserted in it, and the state of that combination. Reset throws the state away and boots the cartridge from empty. A snapshot is that state, kept.

A cartridge does not carry a machine image, and it does not repeat the device inventory. The devices are configured once, on the cabinet, from `devices/` and `cpus/`. The cartridge states what it requires and how its media and controls map onto those devices ([CARTRIDGES.md](CARTRIDGES.md#a-cartridge-boots-from-empty)). Many snapshots name the same cartridge. Each has its own state. Saving one leaves the others, the cartridge, and the cabinet's device list as they were.

A snapshot holds nothing that can be recomputed from it. It names the cabinet, cartridge, CPUs, and devices it requires, by id in the library. As a selfish object it may override any of them. Tools read, edit, render and compare it without running the emulator, from
the command line, from TypeScript in Node or the page, and from the cabinet's panels; running the
machine from it is one more operation.

The format is the same for every machine on the backplane. The Apple ][ is the first full user
([microm8/STACK.md](microm8/STACK.md)); the PDP-7, whose state today is a core image plus a
replayable session ([SIMH-MAP.md](SIMH-MAP.md)), moves to it first ([SAVE-PLAN.md](SAVE-PLAN.md)). It follows the rules in
[WEB-BENCH.md](WEB-BENCH.md): portable by construction, written only while the machine is paused,
kept in the browser's origin private file system.

## What is saved, what is not

| Kind | Examples | In the save file |
|---|---|---|
| **State** | registers, cycle count, memory banks, soft switches, the input queue, which device is in each slot | yes, always |
| **Devices** | a card, a drive, a disk, a stick: its own directory, kept whether or not it is plugged in | by id; embedded when the save is exported on its own |
| **Media** | the bytes inside a disk or a tape, when they are a file the device holds | by hash, inside that device; embedded on export |
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

On disk, a plural directory is an array of that type. `cabinets/` holds cabinets, `cartridges/` holds cartridges, `devices/` holds devices, `cpus/` holds CPUs, and `snapshots/` holds snapshots. The same rule nests: a Disk II holds `drives/`, and a drive holds `floppies/`. This is moollm's file-system object grammar. The plural name declares the element type, and the child's marker file confirms it. Each child is a selfish object. It keeps its own id, its own `inherits:`, and its own state, which is never inherited.

The device inventory lives on the cabinet, once. A cartridge names what it requires and how to map it. A snapshot of a run names that cabinet and that cartridge, and carries the state. `snapshots/lode-runner-playing` and `snapshots/lode-runner-title` both require `cartridges/lode-runner` in `cabinets/apple2e`, and each holds its own state. Devices stay in `devices/`. A snapshot references them and overrides the parts the run changed.

The snapshot directory is the zip you download or upload, and the value kept in the browser. Text is YAML. Memory and other bulk bytes are raw files, so a 64K bank is 64K on disk.

```
cabinets/
  apple2e/
    CABINET.yml             the devices installed once: cpu apple2, videx-7f3a in slot 3, diskii-9c1e in slot 6
cartridges/
  lode-runner/
    CARTRIDGE.yml           requires a disk II; maps its disk onto that drive. No device inventory. No image.
snapshots/
  lode-runner-playing/
    SNAPSHOT.yml            name, slug, time; requires cabinet apple2e, cartridge lode-runner, those devices. Overrides follow.
    inputs.yml              inputs queued for future cycles
    links.yml               hashes of the authored layers this cabinet belongs with
    cpus/
      apple2/
        CABINET.yml
        state.yml           registers, variant, cycle, interrupt lines
        main.bin            64K
        aux.bin             64K, a //e
        lc.bin              language card: the 8K, bank 1, bank 2
        units/
          iou/state.yml     soft switches, including which language-card bank is visible
          video/state.yml   beam position, flash phase
          keyboard/state.yml
          speaker/state.yml
          gameport/state.yml
          cassette/state.yml
    slots/
      3.yml                 device: videx-7f3a, as the cabinet installed it
      6.yml                 device: diskii-9c1e
    devices/
      videx-7f3a/           override: this run's RAM and registers. The device itself stays in devices/
      diskii-9c1e/
    uis/
      debugger/state.yml    breakpoints, the stopped cycle, which view is showing
devices/                    the library. Configured once, referenced by cabinets
cpus/                       the library of CPUs
```

A slot names a device id. The device's directory is the object. An empty slot is an absent file.

```
devices/
  videx-7f3a/
    DEVICE.yml              kind: videx-videoterm, name, id, schema version
    state.yml               6845 registers R0–R17, selected register, RAM page
    ram.bin                 2K screen RAM, still there after the card is pulled
  saturn-12b0/
    DEVICE.yml              kind: saturn-128k
    state.yml               which bank was selected, write enable
    banks/
      0.bin
      7.bin
  diskii-9c1e/
    DEVICE.yml              kind: diskiicard
    state.yml               latches, sequencer, motor, which drive is selected
    drives/
      1/
        DEVICE.yml          kind: diskii-drive
        state.yml           head, bit position, write protect
        floppies/
          lode-runner/
            DEVICE.yml      kind: floppy, name: Lode Runner
            image.woz
      2/
        DEVICE.yml
        state.yml           head parked, no floppies/ inside
  cdrom-2c8/
    DEVICE.yml              kind: cdrom
    state.yml               tray, head, speed
    discs/
      a/
        DEVICE.yml          kind: iso, name: a disc
        image.iso
```

A medium is an element of the plural inside the device that holds it. The floppy is one child of `floppies/`, and the ISO is one child of `discs/`. Ejecting moves that directory out to `devices/` or to `floppies/` at the top, and the bytes go with it. Inserting moves it back into the drive's plural. An empty drive has no `floppies/` directory.

Every module says which plugin wrote it and at what schema version. The manifest's hash covers the
modules' hashes, so two saves can be compared module by module without opening them, and rewind
snapshots and lockstep catch-up share unchanged modules instead of copying them.

## Comparing a run

A check is two saves and the ticks between them. Write the directory, run a stretch, write it again,
and diff the two by hash. The stretch is a count of ticks, or one video frame. A module whose hash
matches is skipped. A miss names the module, and the field or the first byte that differs.

The stretch starts long. On a miss it is halved and the run repeated from the earlier save, until
the window is small enough to read. Our own machine can step inside that window, writing the same
files as it goes. The 6502's own tests stay per instruction, because SingleStepTests already is one
instruction and a handful of bytes. The whole machine is compared at the ends of stretches.

microM8 stays the free-running build it is. At each end of a stretch the existing calls are the
oracle for what they can see: `status` for the registers and the cycle count, `readMemory` for the
bytes on the bus, `frame` and `videxRAM` for the picture. A language-card bank that is switched out,
and a card's private registers, are in our save. The check does not ask microM8 to grow a
single-step API or a full-state export.

## A rung keeps its own snapshot

The switch and the Korz rungs of one CPU share a snapshot. They are one processor, and `state()`
is the registers, the pins, and the cycle count. microM8 is another rung of the Apple, and it is
an organelle: its freeze file is kept in its own format. Registers, compressed memory, memory and video modes,
disks by name, and blobs (`freeze/freeze.go`) sit beside `cpus/apple2/state.yml`. Neither file is
rewritten into the other in order to be kept. That is the same rule as a cartridge's organelles
([UPCYCLING-FORMATS.md](UPCYCLING-FORMATS.md#organelles-nesting-without-flattening)).

Two ways the moments line up.

- **Run it there, and snapshot it there.** Bring microM8 to the moment, then let it write its own
  freeze. The cabinet snapshot and the freeze name the same cartridge and the same floppies.
  Nothing is translated. This is the way that works before a translator exists.
- **Translate, later.** A utility reads either format and writes the other. It copies a field both
  sides have: the program counter, A, X, Y, the stack pointer, the status, the cycle count, the
  RAM both can see, the disk by name. A field only one side has stays in that side's file. Unknown
  keys pass through. This utility is not written yet.

A rung with no snapshot still boots. The floppies are the medium, and they are already shared, so
the same disks go in the drives and that rung resets. A field is copied when the mapping is
obvious and the value is present. Everything else stays at that rung's power-on state. A missing
freeze, a missing `state.yml`, or a freeze this build cannot read is that case. It is not an
error, and it is not a guess at the disk sequencer or the language-card bank.

## A device exists on its own

A card, a drive, a disk, a stick and a hard disk are the same kind of object. Each is a directory in the drawer. The directory holds YAML a person or a model can read and edit, and binary files whose meaning the plugin names: a RAM bank, a track image, a 6845 register block. Making one copies the plugin's defaults into a new id. There is no fixed count of them.

The plugin declares that shape, with a schema, a version and the defaults:

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

Plugging writes the device's id into the slot. Unplugging clears the slot. The directory stays, so pulling a card, a drive or a CD-ROM does not clear it. One device is in one connector at a time.

What a device holds is nested inside it, and the nest is saved with it. A Disk II card holds two drives. Each drive holds one floppy. A CD-ROM holds one ISO. A cassette holds one tape. The inner directory is a device too, with its own YAML and its own bytes. Ejecting, or unmounting, lifts that directory out to the drawer. Inserting nests it again. Nothing in the nest is dropped because a machine was saved, a card was pulled, or a disc was ejected.

A card can nest a processor the same way. An Apple ][ SoftCard holds a Z-80. A 6809 card, such as Stellation Two's Mill, holds a 6809. The processor's saved state lives inside that card, and pulling the card takes the processor's registers and private RAM with it. The stepper is a code module the card plugin uses. It plugs in through the card. The card does not need a second entry on the `cpus/` shelf, and the cabinet's processor stays the 6502. The same module can later be the processor of a machine whose CPU it is, a Color Computer's 6809 among them. The instance state follows the instance: inside the card here, on that cabinet's processor there.

```
devices/
  softcard-4b2c/
    DEVICE.yml            plugin: microsoft-softcard, which uses the z80 module
    state.yml             which processor is on the bus
    cpu/
      state.yml           this card's Z-80: PC, registers, interrupt state
      ram.bin             memory that belongs to the card
  mill-1a90/
    DEVICE.yml            plugin: stellation-mill, which uses the m6809 module
    cpu/
      state.yml           this card's 6809
```

A processor can also plug into the cabinet itself and take no expansion slot. SWEET16 is that shape. The 6502 stays the cabinet's processor. The device engages when the 6502 JSRs to the SWEET16 entry and the bytes there are still Woz's interpreter, and it returns when the bytecode executes RTN. While it is engaged, its saved state is that it is inside the call, plus the 6502 registers the call must restore. The sixteen SWEET16 registers stay in page zero, where the ROM keeps them. Applesoft and Integer BASIC can be the same kind of device, either as one entry that runs a hot routine and writes the result back, or as a whole language that takes the prompt and hands the 6502 particular calls. microM8's Go Applesoft is the second kind: its own program counter and tokens, sharing the Apple's memory, halting the 6502 or starting it. It is not a trap on a ROM address.

A machine save names the devices that were plugged in, and the hash of each device as it was then. The drawer holds the working copy. An exported save embeds those devices, the way it embeds a disk. Loading a save that names a device this build does not know still loads: the directory is kept, shown as an unknown device, and written back unchanged. A device at an older schema version is upgraded by the plugin's migrations. A device at a newer version than the plugin understands is kept in the drawer and stays out of the slot until the plugin is updated.

microM8 does the same per card with `GetYAML` and `SetYAML` on every expansion card; the Videx state
above is the one our patch already saves (`core/hardware/apple2/videx.go`). Its freeze file stays
its own snapshot of that rung
([above](#a-rung-keeps-its-own-snapshot)).

## Reading and writing a save, at every level

One library does all of this, in Node and in the page, and the command line is a thin layer over
it. None of it needs the emulator, except running.

| Level | What it works with | Examples |
|---|---|---|
| Container | files, hashes, the manifest | list parts; check hashes; pack and unpack the zip; compare two saves |
| Parts | a module or a device by path | read `cpus.apple2.pc`; set `slots.3.reg.12`, which follows the device in that slot; edit `devices/videx-7f3a` while it is unplugged |
| Memory | addresses as the CPU sees them | read `$D000` with the language card banking the soft switches select; or a bank by offset |
| Typed views | memory read as what it is | the text page as 24 lines; the hires page as an image; page zero as named variables; the Applesoft program as its `LIST`; the Videx screen as 80 columns |
| Media | what is in the drives | catalog the disk in drive 1; read a file from it; the bit stream under the head |
| Edits | changes that keep the machine consistent | make a device; plug or unplug it; eject a disk from a drive; queue keys; set a paddle; replace a BASIC line, retokenised and relinked |
| Derived layers | computed from the save | render the screen with the reference decoder; disassemble; the graph's live values at this moment |
| History | a session ending at the save | replay with overlays on; heat map; trace; profile |
| Running | the emulator, loaded only now | step one instruction, run a million cycles, run until a PC or a breakpoint, and write the result as a new save |

From the command line (`node scripts/save.mjs`, short form `save` here):

```
save info  snapshots/lode-runner-playing                    manifest, parts, sizes, hashes
save get   snapshots/lode-runner-playing cpus.apple2.pc
save set   snapshots/lode-runner-playing slots.3.reg.12 0
save peek  snapshots/lode-runner-playing '$400' 40 --as text
save poke  snapshots/lode-runner-playing '$3F2' 00 03
save view  snapshots/lode-runner-playing text | hires --png out.png | zero-page | basic | videx
save cat   snapshots/lode-runner-playing 6:1                catalog of expansion slot 6, drive 1
save device new videx-videoterm --name "office videx"    a new id in the drawer, from the defaults
save device plug snapshots/lode-runner-playing 3 videx-7f3a
save device unplug snapshots/lode-runner-playing 3                 the slot clears, the directory stays
save device insert snapshots/lode-runner-playing 6:1 disk-lode-runner   nests the floppy inside drive 1
save device eject  snapshots/lode-runner-playing 6:1                  lifts it back to the drawer
save device mount  snapshots/lode-runner-playing 5 disc-a            nests an ISO inside the CD-ROM
save diff  a.save b.save                       parts, fields, memory pages
save run   snapshots/lode-runner-playing --cycles 1000000 -o snapshots/lode-runner-later
save derive session/ heat --png heat.png       replay a session, compute an overlay
save import microm8.freeze -o imported.save
```

Every command that changes a save writes a new one, with `from` in its manifest pointing at the
old one, unless told to change it in place. A chain of saves is a history you can walk back.

## Where saves live

- **In the page**: the browser's local storage when the cabinet fits there. A platter does not fit, so the drawer of large devices lives in the origin private file system, with `navigator.storage.persist()` asked for. Many cabinets can name the same device across time. The bytes of a disk sit once, by hash, inside the devices that hold them.
- **In Node and on disk**: directories, readable with ordinary tools.
- **In git**: a save directory is small (a //e is about 130K of raw banks plus a few kilobytes of
  YAML) and commits as it is, no Git LFS. A demo is a cabinet that names its cartridge, and a link can open
  it already running. The cartridge itself stays free of the image.
- **As a file you pass around**: a zip of the same directory. Download it, upload it, or drop it on the page.

## The nest

Writes go to the medium's own file, the `image.woz` or `image.iso` nested inside the drive that holds it. The drive's YAML keeps the head. An exported save embeds the nest as it was: the card, each drive, the floppy in it, the CD-ROM, the ISO mounted on it. Pulling the card, ejecting the floppy, or unmounting the ISO lifts a directory out and leaves every byte where that directory goes.

## Exactness

- **Saved between instructions**, with the machine paused. Units that run mid-instruction state
  (the Disk II's sequencer, a 6522's timers) save it as data, so nothing is lost.
- **The cycle count is saved**, so units that catch up by elapsed cycles resume where they were.
- **Host-dependent inputs** (a clock card reading the time, a service's answer) are inputs in the
  log, never read again on restore, so a restored machine continues the same way.
- **Round trip**: saving, loading and saving again gives the same bytes, and running a restored save
  gives the same state hashes as running the original. Both are tests
  ([microm8/PLAN.md](microm8/PLAN.md#11-rewind-and-sessions)).

↑ [README](README.md) · [SAVE-PLAN](SAVE-PLAN.md) · [CARTRIDGES](CARTRIDGES.md) · [microm8/STACK](microm8/STACK.md) · [WEB-BENCH](WEB-BENCH.md)
