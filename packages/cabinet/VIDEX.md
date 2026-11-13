# A Videx Videoterm for microM8

The plan for adding a Videx Videoterm 80-column card to microM8, written to be carried out step by
step. The card is what Don's 1985 ProDOS Forth and its H19 terminal print on
([Apple2Forth](../../characters/don-hopkins/artifacts/Apple2Forth/README.md)); without it the
terminal draws into nothing. The firmware and character ROMs are already in the fork (patch 0002);
everything else is here.

Read first:

- [reference/apple2/videx/SPEC.md](reference/apple2/videx/SPEC.md): the card's addresses, 6845
  registers, character ROM format, cursor modes and the annunciator rule, each with its source.
  This plan doesn't repeat them.
- [reference/apple2/videx/README.md](reference/apple2/videx/README.md): the manual, the Soft Video
  Switch sheet and the 6845 datasheet, as PDFs and as searchable text.
- MAME's [`a2videoterm.cpp`](https://github.com/mamedev/mame/blob/master/src/devices/bus/a2bus/a2videoterm.cpp)
  (BSD-3): about 100 lines of logic, the reference for behavior.
- [microm8/FORK.yml](microm8/FORK.yml) and [microm8/README.md](microm8/README.md): how our
  changes to microM8 are kept as patches.

## Where things are

| What | Path |
|---|---|
| microM8 working copy (upstream's repo; never push there) | `~/GroundUp/git/microm8`, branch `wasm-scope` |
| Go module root (run `go` commands here) | `~/GroundUp/git/microm8/GoPath/src/paleotronic.com` |
| Apple I/O chip, soft switches, `$Cxxx` mapping | `core/hardware/apple2/apple2io.go`, `memcxxx.go` |
| Expansion card interface, `IOCard`, `CardFactory` | `core/hardware/apple2/card.go` |
| A small card to copy the shape of | `core/hardware/apple2/slot3card.go`, `parallel.go` |
| Memory blocks and listeners | `core/memory/mmu.go` |
| Embedded files (go-bindata, generated) | `octalyzer/assets/assets.go` |
| ROMs | `octalyzer/data/videx_fw24.rom`, `videx_chr.rom`, `videx_chr_inverse.rom` |
| Profile choice and the profile name lists | `core/producer.go` |
| The WebAssembly entry point and its JavaScript API | `wasm/main.go` |
| The TypeScript wrapper and its tests | WWSFF `packages/cabinet/src/microm8/microm8.ts`, `microm8.test.ts` |
| The page's Apple | WWSFF `apps/ties/src/lib/MicroM8.svelte`, `microm8.svelte.js` |
| Build the module | `node packages/cabinet/scripts/microm8-wasm.mjs` (from the WWSFF root) |
| Run the cabinet tests | `npm test` in `packages/cabinet` |

## What microM8 does today, and what's in the way

Found by reading the code; each item below is handled by a step.

1. **Card I/O.** `$C0B0`-`$C0BF` reach the expansion slot 3 card as `HandleIO(offset&0xf, &value, IOT_READ|IOT_WRITE)`
   (`memcxxx.go`, the `default:` cases of `RelativeRead`/`RelativeWrite`). That is all the 6845
   ports and the page select need.
2. **Expansion ROM.** A card with a `C8ROM` gets a read-only `MemoryBlockROM` named
   `slotexp<n>.rom` over `$C800`-`$CFFF` (`IOCard.LoadExpROM`). `AddressRead_Cxxx` (`memcxxx.go`
   ~985) maps it in with `PageSetREAD` when the expansion slot's `$Cnxx` page is read, and unmaps on a read
   of `$CFFF`. Only reads: nothing maps the `$C800` space for writes, so `STA $CC00,X` goes nowhere.
3. **Firmware blocks won't do for the RAM window.** `NewMemoryBlockFirmware` routes reads and
   writes to a card, but the 6502 core (`core6502.go` ~1295) calls `FirmwareExec` *instead of*
   executing any opcode fetched from such a block. The Videx ROM runs from `$C800`, so the whole
   `$C800` space can't be one. The RAM window goes through listeners instead (step 5).
4. **`$CFFF` on write.** The `$Cxxx` listener is registered for reads only (`apple2io.go` ~472).
   The firmware releases the space with `STA $CFFF`. Today that does nothing; harmless while expansion slot 3
   is the only card with a `$C800` ROM, wrong in general.
5. **Expansion slot 3 on a II+.** `SW_SLOTC3ROM()` is `!mr.DisableSW80 && …` (`memcxxx.go` 303). The II and
   II+ profiles set the option `sw80`, so `DisableSW80` is true and expansion slot 3's ROM can never be
   seen: `$C300` reads the internal ROM path (none on a II+), and the `$C800` select at
   `memcxxx.go` 1016 never fires for expansion slot 3. `IOCard.LoadROM` also starts `slot3.rom` in state
   `off`, and the older `ReconfigureMemoryMap` (`apple2io.go` ~1795) clears its read state when
   `SoftSwitch_SLOTC3ROM` is false.
6. **Assets can't be regenerated.** `assetbuild.sh` runs go-bindata over `fonts images profile
   data …`, but the `profile/` sources aren't in the repo, only their gzipped copies inside
   `assets.go`. Regenerating would drop every profile. `_bindata` is a package-level map, so a
   second file in `package assets` can add entries in `init()`.
7. **Profile names are hard-coded.** `ExecutorInit` (`producer.go` 920) only starts an Apple for
   `apple2e-en.yaml`, `apple2e-en-cpm.yaml`, `apple2-plus.yaml` and `apple2e.yaml`. The WOZ
   compatibility switches at `producer.go` ~1061 and ~1204 map a profile to a WOZ hardware bit.
8. **The wasm module always boots `apple2e-en.yaml`** (`settings.SpecFile`, set in
   `settings.init`), with no way to choose.

## Device I/O memory

What the 6502 can already read and write, and the two holes the card has to fill. The light pen
does not add an address: it latches R16/R17, which the 6502 reads through the `$C0B1` path below
([LIGHTPEN.md](LIGHTPEN.md)).

| Range | Today | Change |
|---|---|---|
| `$C000`-`$C0FF` | `Apple2IOChip.RelativeRead` and `RelativeWrite`, both live. `$C080` up calls `card.HandleIO` on read and on write (`memcxxx.go`, the `default:` cases) | None. `$C0B0`/`$C0B1` are the 6845, and any access to `$C0B0`-`$C0BF` selects the RAM page |
| `$C100`-`$C7FF` | Expansion slot ROM blocks, read-only. Expansion slot 3 starts in state `off` and `SW_SLOTC3ROM` hides it on a II+ (obstacle 5) | Step 4 makes `slot3.rom` readable. It stays ROM: writes there do nothing |
| `$C800`-`$CBFF` | Expansion ROM, `PageSetREAD` only, and only while expansion slot 3 owns `$C800` | None. The firmware executes from here, so this range must stay ordinary ROM. A firmware memory block would steal the opcode (`core6502.go` ~1295 calls `FirmwareExec` instead of the instruction) |
| `$CC00`-`$CDFF` | Same expansion ROM mapping, read-only, so a read returns firmware bytes (or 0) and a write vanishes | Step 5. Reads: `AddressRead_Cxxx` calls `RedirectedRead` and returns the card's RAM. Writes: a new listener, `"0xCXXX write"`, `$C800`-`$CFFF`, `MA_WRITE`, calls `RedirectedWrite`. Both go through the page the last `$C0Bx` access selected |
| `$CE00`-`$CFEF` | Open | Leave open |
| `$CFFF` | A read releases `$C800`. A write does not, because the `$Cxxx` listener is `MA_READ` only (`apple2io.go` ~472) | The write listener's `$CFFF` case calls the same `releaseC8()` as the read |

`wasm` `readMemory`/`writeMemory` already use this path. `Interpreter.GetMemory` calls
`ReadInterpreterMemory`, and for an address below `$10000` that is `BlockMapper.Do(MA_READ)`.
`SetMemory` calls `WriteInterpreterMemory`, which is `Do(MA_WRITE)`. So once step 5 is in, a
PEEK, a POKE, and a `readMemory`/`writeMemory` of `$C0B0` or `$CC00` all hit the card. Two
consequences:

- `readMemory($CC00)` sees one 512-byte page, whichever `$C0B0`/`$C0B4`/`$C0B8`/`$C0BC` selected
  last, and only while expansion slot 3 owns `$C800`. The whole 2K is `videxRAM` in step 7, not a loop of
  `readMemory`.
- Card RAM is not in the 64K array. `Do` returns the listener's value and does not store one.
  Don't also map a block over `$CC00`.

Nothing else in the card needs a new soft switch or a new address.

## Steps

Each step ends with a check. Build after every step:

```
cd ~/GroundUp/git/microm8/GoPath/src/paleotronic.com
GOOS=js GOARCH=wasm go build -tags nox -o /dev/null ./wasm && go vet -tags nox ./core/hardware/apple2/
```

### 1. The ROMs and a profile, reachable through `assets.Asset`

Make `octalyzer/data` a Go package that embeds only the Videx ROMs, so nothing is copied:

```go
// octalyzer/data/videx.go
package data

import "embed"

//go:embed videx_*.rom
var Videx embed.FS
```

Add `octalyzer/assets/extra.go` (package `assets`, beside the generated file; never edit
`assets.go`). In `init()`, for each file in `data.Videx`, add `_bindata["data/"+name]` returning
`&asset{bytes: b, info: bindataFileInfo{name: "data/" + name, size: int64(len(b)), mode: 0444}}`.
Do the same for every file in a second embed, `//go:embed profile-extra/*.yaml` (a directory
`octalyzer/assets/profile-extra/` inside the package), registered as `profile/<name>`, and add each
profile to `_bintree.Children["profile"].Children[name]` so the desktop's machine menu
(`octalyzer/ui/machines.go`, `AssetDir("profile")`) lists it.

The profile `apple2-plus-videx.yaml` is the II+ profile with expansion slot 3 added. Get the II+ profile out
of `assets.go` (it exists nowhere else):

```
python3 - <<'EOF'
import re, gzip, codecs
src = open('octalyzer/assets/assets.go', encoding='latin-1').read()
m = re.search(r'var _profileApple2PlusYaml = \[\]byte\("((?:[^"\\]|\\.)*)"\)', src)
t = gzip.decompress(codecs.escape_decode(m.group(1).encode('latin-1'))[0]).decode()
open('octalyzer/assets/profile-extra/apple2-plus-videx.yaml', 'w').write(t)
EOF
```

Then edit three things in it: `name: "Apple ][+ with Videx Videoterm"`, `id  : "apple2-plus-videx"`,
and under `slots:` after expansion slot 2:

```yaml
        3:
          driver: "videx"
          slotrom:
            source: "data/videx_fw24.rom"
            base: 0x300
            size: 0x100
          exprom:
            source: "data/videx_fw24.rom"
            base: 0x000
            size: 0x400
```

In `core/producer.go`, add `"apple2-plus-videx.yaml"` to the `ExecutorInit` case beside
`"apple2-plus.yaml"`, and to both WOZ `case "apple2-plus.yaml":` lines (hardware bit `0x0002`).
Grep for any other `"apple2-plus.yaml"` and treat the new name the same way.

Check: a Go test or a temporary `main` that calls `assets.Asset("data/videx_fw24.rom")` gets
1024 bytes, and `assets.Asset("profile/apple2-plus-videx.yaml")` parses with
`hardware.LoadSpec("apple2-plus-videx.yaml")`. (`CardFactory` doesn't know `videx` yet; booting
this profile panics until step 3.)

### 2. Choose the profile from JavaScript

In `wasm/main.go` `boot()`, before `backend.Run`:

```go
if p := js.Global().Get("microM8Profile"); p.Type() == js.TypeString && p.String() != "" {
	settings.SpecFile[slot] = p.String() + ".yaml"
}
```

In `microm8.ts`, add `profile?: string` to `StartOptions` and `microM8Profile?: string` to `Host`;
set `host.microM8Profile = options.profile ?? ""` beside `microM8Verbose`. Pass it through
`startMicroM8Node` (in `src/microm8/node.ts`) the same way.

Only one machine runs per JavaScript realm, and `node --test` runs each test file in its own
process, so the Videx tests go in a new file, `src/microm8/microm8-videx.test.ts`, which starts
with `{ profile: "apple2-plus-videx" }`. Add it to nothing: the `test` script already runs
`dist/microm8/*.test.js`.

Check: with `profile: "apple2-plus"` (not yet the Videx one), `m.status().pureBoot` comes true and
`PRINT PEEK(64435)` ($FBB3, the ROM version byte) prints `234` ($EA, II+), where the //e prints `6`.

### 3. The card

New file `core/hardware/apple2/videx.go`:

```go
type IOCardVidex struct {
	IOCard
	e       interfaces.Interpretable
	ram     [0x800]byte
	reg     [18]byte
	sel     int    // 6845 address register, 0-31
	page    int    // which 512 bytes of ram $CC00-$CDFF shows
	chr     [2][0x800]byte // normal set, alternate set (bit 7 of a screen byte)
	changed bool   // ram or a register changed since the last Render
}
```

- `NewIOCardVidex(mm *memory.MemoryMap, index int, ent interfaces.Interpretable)`: set `Name`
  `"IOCardVidex"`, `mm`, `index`, `e`; load `data/videx_chr.rom` and `data/videx_chr_inverse.rom`
  with `common.LoadData(name, 0, 0x800)` into `chr[0]` and `chr[1]`. If a load fails, log it and
  leave the set blank; don't panic.
- `HandleIO(register int, value *uint64, t IOType)`: `page = (register >> 2) & 3` on every call,
  then by `register & 1` and `t`: write of 0 sets `sel = int(*value) & 0x1f`; write of 1 calls
  `writeReg`; read of 1 returns `readReg()`; read of 0 returns 0.
- `writeReg(v byte)`: ignore `sel > 15`; mask to the register's width (SPEC table); store; set
  `changed`.
- `readReg() byte`: R14-R17 return their value. R16 and R17 stay 0 until the light pen latches them ([LIGHTPEN.md](LIGHTPEN.md)); the 6502 cannot write them (`writeReg` ignores `sel > 15`). The rest read as 0.
- `RedirectedRead(offset int) uint64` and `RedirectedWrite(offset int, value uint64)`: `offset` is
  from `$C800`; for `$400 <= offset < $600`, read or write `ram[(offset&0x1ff) + page*512]` (a write
  sets `changed`). Other offsets read 0 and ignore writes.
- `C8RAM(addr int) bool`: true for `$CC00 <= addr < $CE00`. This is the optional interface of
  step 5.
- `Reset()`: `page = 0`. Keep the RAM and registers (MAME's reset does the same).
- `ImA() string`: `"videx"`.
- `Init(slot int)`: call `IOCard.Init`. Clear nothing else; the firmware initializes the 6845.

Register it in `CardFactory` (`card.go`): `case "videx": return NewIOCardVidex(mm, index, ent)`.

Also add to `Apple2IOChip` (`apple2io.go`), for the wasm API:

```go
// Videx returns the Videx card if one is plugged in.
func (mr *Apple2IOChip) Videx() *IOCardVidex
```

scanning `mr.cards` with a type assertion.

Check: the `apple2-plus-videx` profile boots to the Applesoft `]` prompt (the step 2 test with the
new profile name).

### 4. Expansion slot 3's ROM visible on a II and II+

Change `SW_SLOTC3ROM()` so a machine without the //e's internal 80-column firmware treats expansion slot 3
like any expansion slot:

```go
func (mr *Apple2IOChip) SW_SLOTC3ROM() bool {
	return mr.DisableSW80 || (mr.memmode&MF_SLOTC3ROM) != 0
}
```

The //e profiles don't set `sw80`, so nothing changes for them. On the II+ with expansion slot 3 empty,
`$C3xx` now reads like any other empty expansion slot (floating bus, `memcxxx.go` 1100) instead of setting the
internal-ROM flag.

Then test whether `slot3.rom` is readable. If `$C300` still doesn't read `$2C`, the block is still
in state `off`: give `IOCardVidex` its own `LoadROM` that calls `IOCard.LoadROM` and then
`SetState("r")` on `mbm.Get("slot3.rom")`, and in `ReconfigureMemoryMap` skip the
`if !s.SoftSwitch_SLOTC3ROM` block when `mr.DisableSW80`. Change only what the test shows is needed.

Check (Applesoft, `apple2-plus-videx` profile):

- `PRINT PEEK(49920)` ($C300) prints `44` ($2C, ROM offset `$300`).
- `X=PEEK(49920):PRINT PEEK(51200)` ($C800 after selecting expansion slot 3) prints `173` ($AD, ROM offset 0).
- `X=PEEK(53247):PRINT PEEK(51200)` ($CFFF releases, then $C800) prints `0` (`c8RomEmpty`).
- With the plain `apple2-plus` profile, `PR#3` still hangs or does nothing as before (no card),
  and the existing //e tests still pass.

### 5. The writable `$CC00` window

In `card.go`, the optional interface:

```go
// C8RAMCard is a card with RAM in its $C800 space. Reads and writes there, while the card owns
// the space, go to RedirectedRead and RedirectedWrite with the offset from $C800.
type C8RAMCard interface {
	C8RAM(addr int) bool
}
```

Reads: in `AddressRead_Cxxx`, just before the final `mbm.Do(addr, memory.MA_READ, value)`, add

```go
if addr >= 0xCC00 && mr.GetRegC8ROMType() == c8RomDevice {
	if c, ok := mr.cards[mr.GetRegPeripheralROMSlot()].(C8RAMCard); ok && c.C8RAM(addr) {
		*value = mr.cards[mr.GetRegPeripheralROMSlot()].RedirectedRead(addr - 0xC800)
		return
	}
}
```

The listener returns `(false, false)`, so the MMU uses `*value` as set.

Writes: register a second listener in `apple2io.go` beside `"0xCXXX read"`:

```go
mbm.RegisterListener(&memory.MemoryListener{
	Label: "0xCXXX write", Start: 0xC800, End: 0xCFFF, Type: memory.MA_WRITE, Target: this,
})
```

and in `ProcessEvent` a case `"0xCXXX write"` calling a new `AddressWrite_Cxxx(addr, value)`:

- `addr == 0xCFFF`: do what `AddressRead_Cxxx` does for `$CFFF` (factor that block into a
  `releaseC8()` method and call it from both).
- else, if the owning card is a `C8RAMCard` claiming `addr` (same test as for reads), call
  `RedirectedWrite(addr-0xC800, *value)` and return `(false, false)`.
- otherwise return `(false, true)` so the write goes on as before.

Listeners are kept per 256-byte bank (`mmu.go` 1029), so this costs nothing for writes outside
`$C800`-`$CFFF`. Card RAM written this way is not in the memory change log, so live rewind won't
restore the Videx screen; step 9 covers saving it.

`WriteInterpreterMemory` calls `Do` for `$C800`-`$CFFF` even though that range has no write page
(`memorymodel.go`); that is what runs the listener. `primeC8` runs on a write as well as a read.
Forth's driver selects the expansion slot with `LDA $C3xx` and then `STA $CC00,Y`, and that write is the
strobe that turns the screen RAM on.

Check (Applesoft): `X=PEEK(49920):X=PEEK(49336):POKE 52224,65:PRINT PEEK(52224)` (select expansion slot 3,
page 2 via `$C0B8`, write `$CC00`) prints `65`; `X=PEEK(49328):PRINT PEEK(52224)` (page 0) prints
something else, and `X=PEEK(49336):PRINT PEEK(52224)` prints `65` again.

### 6. Draw the card in Go

In `videx.go`:

```go
const VidexWidth, VidexHeight = 720, 216

// Render draws the card's picture into dst (VidexWidth*VidexHeight*4 bytes, RGBA) and reports
// whether it differs from the last call. cycles is the 6502's cycle count, for the cursor blink.
func (c *IOCardVidex) Render(dst []byte, cycles int64) bool
```

- Columns `R1` (clamp 1-80), rows `R6` (clamp 1-24), lines per row `R9+1` (clamp 1-16). Draw
  `cols*9` by `rows*lines` from the top left; clear the rest of `dst` to black.
- Start `ma := int(reg[12]&0x3f)<<8 | int(reg[13])`. Cell `(x, y)` is
  `ram[(ma + y*cols + x) & 0x7ff]`.
- Glyph line `l` (0 to `lines-1`) of byte `b`: `bits := chr[b>>7][int(b&0x7f)*16 + (l & 15)]`;
  dots 0-7 are bits 7-0, dot 8 repeats bit 0. Lit is white (255,255,255,255), unlit black
  (0,0,0,255). The page can tint it later.
- Cursor: `cur := (int(reg[14]&0x3f)<<8 | int(reg[15])) & 0x7ff`; mode `reg[10]>>5 & 3`; lines
  `reg[10]&31` to `reg[11]&31`. Fields are `cycles / 17030` (65 cycles x 262 lines). Mode 0 shows;
  1 hides; 2 shows when `(field/8)&1 == 0`; 3 when `(field/16)&1 == 0`. Where shown, invert the
  dots of the cursor cell on the cursor lines.
- Changed = `c.changed` or the blink phase differs from the last call. Clear `c.changed`.

On `Apple2IOChip`:

```go
// VidexShowing is what the Soft Video Switch would put on the monitor: the card's picture when
// annunciator 0 is on and no graphics mode is.
func (mr *Apple2IOChip) VidexShowing() bool {
	return mr.Videx() != nil && mr.annunciators[0] && mr.SW_TEXT()
}
```

Check: a Go test (`videx_test.go`) that builds an `IOCardVidex` with `NewIOCardVidex(nil, 0, nil)`,
writes the firmware's init values (SPEC table) through `HandleIO`, puts `0x41` at `ram[0]`,
renders, and finds the `A` glyph's dots at the top left (lines 0-6 of the cell match
`videx_chr.rom` bytes `0x410`-`0x416`). If the package doesn't build natively
(`go test -tags nox ./core/hardware/apple2/ -run Videx`), skip the Go test and rely on step 8.

### 7. The WebAssembly API

In `wasm/main.go`:

```go
// videx(dst) copies the Videx card's picture (videxWidth x videxHeight RGBA) into dst and
// returns true, or returns false when there is no card or nothing changed.
"videx": js.FuncOf(func(this js.Value, args []js.Value) any { ... }),
"videxWidth":  apple2.VidexWidth,
"videxHeight": apple2.VidexHeight,
```

Keep a package-level `[]byte` of 720*216*4, render into it with
`apple2helpers.GetCPU(innermost()).GlobalCycles`, and `js.CopyBytesToJS` only when changed. Add to
`status`: `"videx": io.Videx() != nil` and `"videxShowing": io.VidexShowing()`.

In `microm8.ts`: `videx(dst: Uint8Array | Uint8ClampedArray): boolean` and the two sizes on
`MicroM8Api` and `MicroM8`; `videx` and `videxShowing` on `MicroM8Status`.

The tests read text, not pixels, and `readMemory` can't page through the card's RAM. So add
`"videxRAM"`, returning a 2050-byte `Uint8Array`: the 2K, then R12 and R13 (null when there's no
card). In TypeScript, `videxText(): string[]` decodes 24 rows of 80 from `(R12<<8 | R13) & 0x7ff`,
wrapping at 2K, each byte `& 0x7f`, control codes as spaces.

### 8. Tests

`src/microm8/microm8-videx.test.ts`, skipped like the others when `microm8/dist` isn't built,
starting the machine with `profile: "apple2-plus-videx"`:

1. **The ROMs show**: the three `PEEK` checks of step 4 and the page check of step 5.
2. **PR#3**: type `PR#3\n`, then `PRINT "HELLO FROM VIDEX"\n`. Wait until `videxText()` contains
   `HELLO FROM VIDEX`, `status().videxShowing` is true, and `annunciators() & 1` is 1.
3. **Registers**: after PR#3, `PEEK` through the 6845: `POKE 49328,15:PRINT PEEK(49329)` reads
   R15, the cursor's low byte; it changes after printing more text. `PEEK(1403)` ($57B) is the
   cursor column.
4. **Back to 40 columns**: Ctrl-Reset (`m.reset()`) leaves `annunciators() & 1` at 0 and
   `videxShowing` false (the Autostart reset reads `$C058`). `PR#3` again brings it back.
5. **Graphics wins**: after `PR#3`, `GR` makes `videxShowing` false while AN0 stays on.
6. **Pixels**: `m.videx(buf)` returns true once after PR#3, and `buf` has lit pixels.
7. **Don's Forth**: insert `characters/don-hopkins/artifacts/Apple2Forth/forth.dsk` as
   `forth.po` (it's ProDOS block order, volume `/H19`), reboot, and wait up to 60 s until
   `videxText()` shows the banner block 4 prints. The line that stays on the screen is
   `Duh, huh, it worked again!`. `term` then runs on the serial card in expansion slot 4, patch
   `0006-serial-2651-card`.

Run `npm test` in `packages/cabinet`: the new file passes and the existing 221 tests still pass.

### 9. Saving and rewind

`IOCard` has `GetYAML`/`SetYAML` for microM8's freeze files; `mousey.go` shows the pattern with
`gopkg.in/yaml.v2`. Save `ram`, `reg`, `sel`, `page`. Check: freeze and thaw through the desktop
build if available; otherwise note it in FORK.yml as untested.

### 10. The page

In `apps/ties/src/lib/microm8.svelte.js`, poll `status().videxShowing` with the annunciators, and
when it is true call `videx(buf)` each frame. In `MicroM8.svelte`, a second canvas of 720x216 in
the same box as the Apple's, shown instead of it while `videxShowing`, scaled to the same width
(the monitor's aspect, not square pixels). Run
`npx @sveltejs/mcp svelte-autofixer` on both files and `svelte-check` until clean. Check in the
browser: PR#3, type, and the picture switches; Reset switches back; the AN0 lamp follows.

### 11. Speed

Run `node packages/cabinet/scripts/microm8-bench.mjs` before step 4 and after step 7 and compare
the `prompt`, `basic`, `hires` and `text` rows. The new listener and the `$CC00` test in
`AddressRead_Cxxx` should cost nothing measurable; if a row drops more than 2%, look at them first.

### 12. Patch 0005 and the docs

Make the patch in a throwaway worktree so the working copy is untouched:

```
P=~/GroundUp/git/WillWrightShowForFood/packages/cabinet/microm8/patches
W=$(mktemp -d)/m8
git -C ~/GroundUp/git/microm8 worktree add --detach "$W" aaea81e7a5385c66e0378e2b93232534725b2558
cd "$W" && for p in "$P"/000[1-4]-*.patch; do git apply --binary "$p"; done
git add -A && git commit -qm base
# copy every file this plan created or changed from the working copy into $W, same paths
git add -A && git diff --cached --binary > "$P/0005-videx-videoterm.patch"
cd ~ && git -C ~/GroundUp/git/microm8 worktree remove --force "$W"
```

Check that it applies: a second worktree at `aaea81e`, `git apply` 0001 to 0005 in order, then the
wasm build.

Files the patch should hold: `octalyzer/data/videx.go`, `octalyzer/assets/extra.go`,
`octalyzer/assets/profile-extra/apple2-plus-videx.yaml`, `core/hardware/apple2/videx.go` (and
`videx_test.go` if it ran), `card.go`, `apple2io.go`, `memcxxx.go`, `core/memory/memorymodel.go`,
`core/producer.go`, `wasm/main.go`.

Then in WWSFF:

- [microm8/FORK.yml](microm8/FORK.yml): a `0005-videx-videoterm.patch` entry (what, `for: upstream`,
  status with the test count), and replace the Videx line under `next:` with what's left.
- [APPLE2.md](APPLE2.md), "Don's Forth": the card exists; how to boot the Forth with it.
- [Apple2Forth README](../../characters/don-hopkins/artifacts/Apple2Forth/README.md), TODO: tick
  the Videx item.

Don't commit or push unless Don asks.

## Open questions

- **Which Apple did the Forth run on?** A II+ with a Videx in expansion slot 3 is the usual pairing and what
  this plan builds. If it was a //e, the card needs the //e's `SLOTC3ROM` switch on (the //e's
  internal 80-column firmware owns expansion slot 3 by default), and the plan's step 4 change doesn't apply.
- **50 or 60 Hz firmware?** Our ROM is the 50 Hz build. MAME's 60 Hz v2.4 (`6.ic6.bin`, SHA-1
  `19f69011ed7d2551c39d5c1cac1f5a2defc8f8fb`) is a 2K dump from a clone card and isn't in patch
  0002. Nothing here depends on the timing registers.
- **Which alternate set?** The inverse set we have differs from MAME's dump (SPEC). Compare them
  glyph by glyph before choosing.
- **Desktop microM8.** The page draws the card; microM8's own GL window doesn't. Showing it there
  means a layer in its renderer, which is a separate piece of work.
- **Ultraterm and other 80-column cards** follow the same shape (6845, banked RAM at `$CC00`) and
  could reuse steps 4 and 5.

↑ [APPLE2](APPLE2.md) · [MICROM8](MICROM8.md) · [LIGHTPEN](LIGHTPEN.md) · [microm8/FORK.yml](microm8/FORK.yml) · [reference/apple2/videx](reference/apple2/videx/README.md)
