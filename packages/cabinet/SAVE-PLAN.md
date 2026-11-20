# PDP-7 snapshots

A paused PDP-7 cabinet round-trips through a snapshot directory ([SAVE-FILES.md](SAVE-FILES.md)). Saving, loading, and saving again writes the same bytes. A restored machine and one that never stopped then agree, step for step. Three runs are the bar: UNIX mid-boot, the 340 mid-vector, and a paper tape mid-frame.

The Apple emulator is not part of this. The PDP-7 sources stay where they are.

## What a snapshot holds

The cabinet is flushed before the write, so no unit is mid-tick or running ahead. The schedule (`synced`, `due`, `next`) is rebuilt on the next `step` from each unit's `nextEvent`. It is not stored. Korz compiled blocks are a cache. Restoring core goes through `write`, which drops them. The 340's lookahead (`ahead`, `readAt`) is empty after the flush and is not stored. `irqLine` is the backplane's wire and is set again before the next instruction.

What is stored, because the next instruction or tick reads it:

| Unit | State | Bulk |
|---|---|---|
| Snapshot | `cycles`, the id, `requires` | |
| PDP-7 | `pc`, `ac`, `link`, `mq`, `sc`, `ion`, `ionDefer`, `extend`, `emirPending`, `halted`, `switches` | `core.bin`, uint32 little-endian, one word per core location. `core.ts` already writes this. |
| Clock | `flag`, `on`, `accum` | |
| Teletype | `kbdFlag`, `kbdBuf`, `ttoFlag`, `printing`, `printBuf`, `pending` | the paper, so the panel can show it without replaying |
| Paper tape | `flag`, `buf`, `pos`, `state`, `wait` | the tape |
| RB09 | `sta`, `da`, `ma`, `wc`, `due`, `dirty`, `writeLock` | the platter, when this snapshot overrides it |
| Type 340 | the fields its private `snapshot()` keeps, including `pending`, `dac`, the beam, and the current frame's `segments` | |
| Light pen | `x`, `y` | |
| DataHand | latched registers, flag, index | |
| Ultimate | phase, arm, lid, lever, the counters | |
| Tiny Titan | flag, the queued bytes, the blocklet checksum | |
| titan-files | flag, result, the file map | each file's words |
| Turing | the engine's head, state, window, and spill | |

`emirPending`, the clock's `accum`, the reader's `state` and `wait`, the teletype's `printing`, and the disk's `due` are private today. Each unit grows `capture` and `restore` on its own class so a snapshot does not reach into those fields from outside. The 340's pen test reads the current frame's segments, so those segments are state. The rendered picture is not.

Numbers in YAML are decimal. A bulk file is named from the unit's YAML, with `encoding: uint32-le` for core and for the platter.

## Steps

### 1. The CPU, in memory

A `MemoryStore` is the snapshot directory as a map of paths to bytes. `savePdp7` writes `SNAPSHOT.yml`, `cpus/pdp7/state.yml`, and `cpus/pdp7/core.bin`. `loadPdp7` reads them into an existing CPU of the same core size. `Pdp7.registers` and `restoreRegisters` include `emirPending`. Core is deposited through `write`.

**Done when** `src/save/pdp7.test.ts` passes: save, load, save gives the same bytes; a restored CPU matches one that kept running; a Korz CPU in compile mode, restored over a core it had already compiled, matches the plain CPU.

### 2. The cabinet clock

`cycles` is already on `SNAPSHOT.yml`. Loading a cabinet sets it and leaves the schedule empty, so the next `step` calls `nextEvent` again. The clock is the first device, because a wrong `accum` moves location 7.

**Done when** two cabinets with a running clock, one restored at a cycle between ticks, next raise the flag on the same step and leave the same word in location 7.

### 3. The UNIX devices

Teletype, paper tape, and RB09 get `capture` and `restore`. The tape's bytes and the platter travel with them. The reader's `state` is the half-assembled frame.

**Done when** a reader stopped between the three frames of one binary word delivers the same word after a restore, and an RB09 stopped between words of a transfer finishes the same core and the same platter.

### 4. UNIX mid-boot

`bootUnixV0`, run until the paper holds a proper prefix of the boot message and the disk is busy, snapshot, restore into a second cabinet, then type the same keys on both.

**Done when** the paper, the PC, the registers, and the platter match, and a second save of the restored cabinet matches a second save of the one that never stopped.

### 5. The 340 mid-vector

Flush, then capture, including `pending` and the segments drawn so far this frame.

**Done when** a display stopped inside a vector, restored, draws the same remaining points, and a light pen over a segment drawn before the snapshot still hits.

### 6. The other devices

DataHand, Ultimate, Tiny Titan, titan-files, and the Turing engine, each with one restore test that checks the field the next IOT or tick reads. A device this build does not know is kept and written back unchanged.

### 7. A directory on disk

The same paths, written with Node's file system from a file the browser bundle does not import. `package.json`'s test script includes `dist/save/*.test.js`.

**Done when** a snapshot written to a temporary directory loads back into a `MemoryStore` with the same bytes.

### 8. A shelf, a zip, and the SNAPSHOTS tab

A shelf holds many snapshots. Each is the directory from the steps above, and `SNAPSHOT.yml` also names it: `name`, `slug`, `cartridge`, and `time` in milliseconds. The list for a cartridge is those whose `cartridge` matches. Create, rename, replace, and delete. Rename keeps the bytes and changes the name and, when the name no longer spells the slug, the slug. Two snapshots of one name get `-2`, `-3`.

The shelf is a map, a string store (the browser's local storage, one key per file), or a directory. In the page the directory is the origin private file system. A zip of the same directory is what you download or upload. Writing the zip stores the bytes; reading it also accepts deflate.

The PDP-7 page grows a SNAPSHOTS panel, scoped to the program that is selected. Save pauses the machine and writes it. Load reads it back into the same devices. The paper is drawn again from the teletype.

**Done when** a library test creates, renames, replaces, loads, and deletes; a byte shelf and a directory shelf round-trip a zip; a deflated zip and a zip wrapped in one folder both load; the panel on the running PDP-7 does the same for the selected program.

Steps 1 to 8 are in the tree. A UNIX boot stopped at 600,000 cycles, restored, and run on, reaches the same `login:` with the same registers, paper, and platter, and a second save of each cabinet matches. A 340 stopped inside a vector, restored, draws the same remaining points, and a pen over the stroke drawn before the snapshot still hits. DataHand, the Ultimate Machine, Tiny Titan, titan-files, and the Turing engine each restore the field their next read uses. A device directory this build does not know is copied through unchanged. A snapshot written to a temporary directory loads back into a memory store with the same bytes. The same directory is a zip, a browser directory, or a string store, and the SNAPSHOTS panel creates, renames, replaces, loads, and deletes the ones that belong to the selected program. The RB09 moves a whole block in one tick, so the saved moment is the wait before that tick, with the block's address and word count still pending. The reader is saved between the three frames of one word. The Apple emulator is still not part of this.
