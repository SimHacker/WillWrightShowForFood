# microM8, package by package

Where each part of microM8 goes in the TypeScript stack ([STACK.md](STACK.md)). Line counts are Go
source lines in each package directory, tests and vendored code excluded, at the commit in
[FORK.yml](FORK.yml) with our patches applied. Paths are under `GoPath/src/paleotronic.com/`.

Verdicts:

- **translate**: port the code to TypeScript, closely, keeping its logic and its tests.
- **redesign**: keep what it does, build it differently, use the Go as the oracle.
- **replace**: the browser or Node already does this; use their API.
- **keep in Go**: leave it in the WebAssembly build, linked as a peer, until it is worth porting.
- **drop**: not needed in the cabinet.

## The machine

| Package | Lines | What it is | Verdict | Goes to |
|---|---:|---|---|---|
| `core/hardware/cpu/mos6502` | 4,682 | 6502 and 65C02: opcode table, addressing modes, firmware and call shims, breakpoints, `SpecialFlag` address flags | translate | the processor; its opcode table becomes the opcode surface; shims become traps |
| `core/hardware/cpu/mos6502/asm` | 1,048 | assembler and disassembler | redesign | a 6502 back end for the cabinet's assemblers ([ASSEMBLERS.md](../ASSEMBLERS.md)) |
| `core/memory` | 5,122 | `MemoryMap` (`uint64` cells, 1 MB words per VM slot), the MMU's 256 read and write pages, listeners, the heat map, `MappedRegion`, the share service | redesign | byte banks, page tables, watch flags, planes ([STACK.md](STACK.md#the-memory-map)); sharing goes to the peers ([TRANSPARENCY.md](TRANSPARENCY.md#peers-three-ways-to-share-a-machine)) |
| `core/hardware/apple2`: `apple2io.go`, `memcxxx.go` | 5,010 | the I/O chip, soft switches, language card, aux memory banking | redesign | the soft-switch table and the IOU unit |
| `core/hardware/apple2`: `apple2video.go`, `scanrenderer.go`, `apple2unified.go` | 2,100 | video modes, the scanner, per-segment memory capture | redesign | the mode log, and the shaders ([STACK.md](STACK.md#video-on-the-gpu)) |
| `core/hardware/apple2`: `speaker.go`, `speakerhq.go` | 397 | the speaker | redesign | timestamps into an AudioWorklet |
| `core/hardware/apple2`: `diskiicard.go`, `diskiidrive.go` | 2,502 | Disk II card, logic state sequencer, drives | translate | a card unit, catching up by elapsed cycles |
| `core/hardware/apple2/woz`, `woz2` | 2,307 | WOZ 1 and 2 images as bit streams | translate | storage; the cabinet's `woz.ts` decodes to sectors only today |
| `core/hardware/apple2`: the other cards | 3,464 | SmartPort, mouse, Mockingboard, Super Serial, 2651, Videx, parallel, SoftCard, Uthernet II, expansion slot 3 | translate | card units, one each; Videx and 2651 first, since we wrote them |
| `core/hardware/apple2`: `apple2rom.go`, `apple2zeropage.go`, `virtualvolume.go` | 716 | ROM loading, zero-page names, a virtual ProDOS volume | translate | the machine profile, the typed-memory map, storage |
| `core/hardware/common` | 6,537 | AY-3-8910, 6522, 6551, 6821, cassette, ESC/P and ImageWriter II printers, serial ports and telnet, virtual modem, W5100 Ethernet | translate the chips; redesign the I/O | chips as units; serial, telnet, modem and Ethernet become services ([TINY-TITAN.md](../TINY-TITAN.md#one-call-for-the-host-call-on-device-24)); printers render to the page |
| `core/hardware` (root), `spec.go` | 723 | machine specs, the device factory, freeze files, layer control | redesign | cartridges that read microM8's profiles as they are ([CARTRIDGES.md](../CARTRIDGES.md)) |
| `freeze` | 378 | freeze state | redesign | snapshots of unit state as data |
| `core/hardware/servicebus` | 300 | requests between the CPU and devices | redesign | direct calls; the debugger reaches units as objects |
| `core/hardware/apple2helpers` | 5,948 | helpers for the dialects: disk access, CPU wrappers (local and remote), the monitor, dithering, zones | redesign | split: the monitor and CPU control into the debugger; the rest follows the dialects |
| `core/interpreter`: recorder, player, `cpudelta` | 3,228 | rewind and 100% recording | redesign | snapshots plus the input log ([TRANSPARENCY.md](TRANSPARENCY.md#time-rewind-without-recording-everything)) |
| `core/interpreter`: `interpreter.go` and the rest | 6,992 | the `Interpretable` VM: about 355 methods covering BASIC, CPU, memory, files, video and sound | redesign | cut into the parts it already contains; no single interface survives |
| `core/settings` | 1,027 | 102 global arrays indexed by VM slot | redesign | each setting moves to the unit it configures, as state |
| `core` (root) | 5,290 | the VM, its launcher, tasks, the producer that runs VMs | redesign | the cabinet's machine list and scheduler |

## Other machines

| Package | Lines | What it is | Verdict | Goes to |
|---|---:|---|---|---|
| `core/hardware/cpu/z80`, `z80`, `z80/gen` | 1,225 + 19,752 + 19,990 | Z80 for the SoftCard and the Spectrum: Andrea Fazzi's MIT emulator and its generated tables | redesign | a Z80 processor, by translation or an MIT JavaScript core, chosen by the same tests |
| `core/hardware/spectrum`, `snapshot` | 4,206 | ZX Spectrum | later | a second machine profile once the Apple is exact |
| `core/hardware/bbc` | 523 | BBC Micro, partial | later | the same |

## Presentation and sound

| Package | Lines | What it is | Verdict | Goes to |
|---|---:|---|---|---|
| `core/hires` | 3,614 | hires, double hires and lores decoders | translate as reference | the TypeScript reference decoder; the shaders are tested against it |
| `octalyzer/video`, `font` | 7,620 | the renderer: voxels, layers, cameras, text | redesign | WebGPU renderer plugins |
| `glumby`, `glumbyclient`, `decalfont` | 5,883 | GL toolkit and the remote renderer client | replace | WebGPU; the remote renderer becomes a distributed device |
| `gl` | 31,849 | generated OpenGL bindings | replace | WebGPU, WebGL 2 |
| `core/vdu`, `vdu/net`, `vduconst`, `vduproto`, `vduserver` | 5,940 | the VDU layer, its network protocol, video and audio servers | redesign | renderer and input units over tiny-bus |
| `core/types` | 13,903 | shared types: text buffers, video attributes and palettes, cameras, layer specs, tokens, variables | split | video and layer types to the renderer; tokens and variables stay with the dialects |
| `presentation`, `accelimage` | 1,468 | presentation files, image helpers | redesign | renderer plugins, the canvas |
| `restalgia`, `control`, `driver` | 7,161 | Restalgia, microM8's synthesizer | translate | an audio source in the AudioWorklet |
| `microtracker`, `mock`, `tracker` | 4,974 | microTracker | translate | an audio source and a panel |
| `decoding/ogg` | 5,629 | Ogg Vorbis decoder | replace | the browser's audio decoding |

## Storage and files

| Package | Lines | What it is | Verdict | Goes to |
|---|---:|---|---|---|
| `disk` | 6,371 | DOS 3.3, ProDOS, Pascal, RDOS, 2MG, nibbles | redesign | the cabinet's `src/apple2/` already reads most of these; RDOS and gaps translate |
| `dskalyzer` | 5,230 | disk analyser and search | translate later | a Node tool and a panel |
| `files`, `filerecord` | 7,177 | file providers: local, network, packaged, autosave | replace | browser storage, tiny-titan file services, Node's file system |
| `core/editor` | 4,802 | the text editor | replace | the cabinet's editors |

## The languages

| Package | Lines | What it is | Verdict | Goes to |
|---|---:|---|---|---|
| `core/dialect/applesoft` | 16,239 | Applesoft, in Go | keep in Go | the WebAssembly peer; real Applesoft runs from ROM on the TypeScript machine |
| `core/dialect/appleinteger` | 4,594 | Integer BASIC, in Go | keep in Go | the same, with Woz's ROM on the TypeScript machine |
| `core/dialect/logo` | 22,189 | microM8's Logo | keep in Go | the WebAssembly peer; a TypeScript Logo is its own project |
| `core/dialect/plus` | 25,997 | the `@` commands and extensions | redesign | services and console commands with the same names |
| `core/dialect/shell`, `parcel`, `dialect` root, `octalyzer/tokenizer` | 8,048 | microM8's shell, parsing, tokeniser | keep in Go | with the dialects |

## Front ends and services

| Package | Lines | What it is | Verdict | Goes to |
|---|---:|---|---|---|
| `octalyzer`: `mcp_sdk.go` | 3,300 | 46 MCP tools | redesign | the same tool names, served from Node, driving the TypeScript machine |
| `octalyzer`: `api.go` | 1,100 | 49 HTTP control routes | redesign | the same routes, on Node |
| `debugger`, `debugtypes` | 3,372 | the web debugger's WebSocket server | redesign | the cabinet's debugger in the page; the protocol kept for existing clients |
| `remint` | 859 | headless interpreter server | redesign | headless machines on Node |
| `fastserv`, `client`, `ducktape`, `client`, `server`, `encoding/mempak`, `postoffice` | 3,797 | sharing and message transport | redesign | tiny-bus, lockstep and streaming peers |
| `octalyzer`: `main.go`, `keymap.go` | about 6,300 | the desktop program and keyboard map | redesign | the cabinet's page; the key map translates |
| `octalyzer/ui`, `chat`, `forumtool`, `octalyzer/clientperipherals` | 8,160 | menus, chat, forum client, peripherals | drop or redesign | menus become panels; chat and forum served Paleotronic's site |
| `api` | 3,444 | Paleotronic's online services | drop | |
| `octalyzer/assets` | 5,085 Go, plus profiles, ROMs, fonts | embedded assets | keep the data | profiles, ROMs and fonts load as files |
| `wasm` | 372 | our WebAssembly entry point | keep | the peer build |
| `update`, `doctorjavago`, `third_party`, `utils` | about 2,150 | updater, experiments, clipboard, helpers | drop | |

## Totals

About 41,000 lines make up the Apple: the 6502, memory, the I/O chip and soft switches, video and
the hires decoders, the speaker, Disk II and WOZ, the cards, the chips, recording and freeze. That is
the first translation ([PLAN.md](PLAN.md)). About 51,000 lines of interpreters (Applesoft, Integer
BASIC, Logo and the shell) stay in Go, and the 26,000 lines of `@` commands are redesigned as
services. About 55,000 lines (GL bindings, the Ogg decoder, glumby, file providers, the editor) are
replaced by what the browser and Node already provide.

↑ [STACK](STACK.md) · [PLAN](PLAN.md) · [README](README.md)
