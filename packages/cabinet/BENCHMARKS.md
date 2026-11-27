# Benchmarks: the PDP-7 and the Apple ][

Every speed measurement of the cabinet's two emulated machines, in one place. The numbers are
copied from the notes where each was first measured, which are linked, and those notes have the
details of the method. When a number changes, change it there and here.

The real machines, for scale:

| Machine | Speed |
|---|---|
| PDP-7 | about 0.3 million instructions a second; a 1.75 µs memory cycle |
| Apple ][+ | 1.020 MHz |

## Running them

| Command | What it measures |
|---|---|
| `npm run bench:korz` | the PDP-7 on UNIX v0, every rung ([korz-bench.mjs](scripts/korz-bench.mjs)) |
| `node scripts/korz-bench.mjs hand` | the PDP-7 on `ULTIMATE-HAND` in Forth |
| `node scripts/korz-bench.mjs turing` | the PDP-7 with the Turing engine running free |
| `node scripts/apple-bench.mjs` | the Apple ][ on every Korz rung ([apple-bench.mjs](scripts/apple-bench.mjs)) |
| `node scripts/microm8-bench.mjs` | microM8's WebAssembly build ([microm8-bench.mjs](scripts/microm8-bench.mjs)) |

`korz-bench.mjs --record` appends a result to [bench-results/korz.jsonl](bench-results/korz.jsonl)
with the commit, the Node version and the machine. `--check` compares a run with the last one
recorded on the same machine, Node version, workload, rung and step count, and fails if the end
state changed or the time per step is more than 10% slower.

## The four rungs

The same core image runs on four implementations of the CPU, each checked against the one below
it on the same bytes.

- **switch**: `Pdp7`, a straight port of SIMH's PDP-7, a switch on the opcode
  ([plugins/pdp7.ts](src/plugins/pdp7.ts)). For the Apple, the hand-written 6502
  ([m6502.ts](src/m6502/m6502.ts)).
- **interpreter**: Korz, the instruction set as a table of guarded slots, searched on every
  dispatch. It is the oracle, slow on purpose.
- **resolver**: the same table compiled into one function per operation
  ([korz/pdp7.ts](src/korz/pdp7.ts), [korz/m6502.ts](src/korz/m6502.ts)).
- **compiler**: a straight run of instructions pasted into one JavaScript function
  ([compile7.ts](src/korz/compile7.ts), [compile65.ts](src/korz/compile65.ts)). The live pages
  run on this one.

## PDP-7

Nanoseconds per emulated instruction, including all the devices. Node 26, Apple M4 Max. A new
machine each round, best of rounds 2 to 5, devices event-driven, each workload and rung in its own
process. Repeated runs differ by up to 8%. From [KORZ-DISPATCH.md](KORZ-DISPATCH.md) and
[A sea of slots](SEA-OF-SLOTS.md#the-numbers).

| Workload | switch | compiler | resolver | interpreter |
|---|---:|---:|---:|---:|
| UNIX v0 boot, 3M instructions ([live](https://hyperties.org/machine/unix/)) | 11 | 5 | 30 | 777 |
| Forth with the 340, DataHand and Ultimate Machine, 10M ([live](https://hyperties.org/machine/ultimate-hand/)) | 21 | 13 | 44 | 763 |
| Turing engine running free, 5M ([live](https://hyperties.org/machine/turing/)) | 67 | 71 | 118 | 1,210 |

The same, in instructions a second:

| Workload | switch | compiler | resolver | interpreter |
|---|---:|---:|---:|---:|
| UNIX v0 boot | 92 M | 189 M | 34 M | 1.3 M |
| Forth, `ULTIMATE-HAND` | 47 M | 74 M | 23 M | 1.3 M |
| Turing engine | 15 M | 14 M | 8.5 M | 0.83 M |

On UNIX the compiler is about 600 times a real PDP-7, and the interpreter about four times. On the
Turing engine the compiler ties the switch, because the engine needs attention every three cycles,
so a compiled run is three instructions long. All four rungs end every workload in the same state:
the same PC, and on the other two workloads the same press count and frames, or the same
transition count, state and head.

### How it got there

From [KORZ-MACHINES.md](KORZ-MACHINES.md) and [KORZ-DISPATCH.md](KORZ-DISPATCH.md). UNIX v0 unless
it says otherwise.

| Change | Before | After |
|---|---:|---:|
| Profiling the resolver: inlined index computation, `bind` instead of a generation check, fetch as a coordinate on `read`, one set of generated functions shared by every machine | 105 ns | 46 ns |
| Event-driven devices: the resolver | 46 ns | 29 ns |
| Event-driven devices: the switch | 30 ns | 15 ns |
| The 340 running ahead from a snapshot, `ULTIMATE-HAND`: the switch | 75 ns | 23 ns |
| The 340 running ahead from a snapshot, `ULTIMATE-HAND`: the resolver | 102 ns | 43 ns |
| Node 20 to Node 26: the switch | 15 ns | 11 ns |
| The compiler, against the switch's 11 ns | | 5 ns |

A second machine in the same process once ran at 71–80 ns a step against the first one's 55,
because each machine's slots were its own closures and V8 gave up on call sites that saw a
second target. Building every slot function once per process fixed it. Now later machines are
faster than the first, which pays for warm-up.

### The Forth device

The device runs one Forth thread cell per fetch of NEXT. From [FORTH-DEVICE.md](FORTH-DEVICE.md).

| 30,000 passes of `I +` | PDP-7 cycles |
|---|---:|
| Mitch's kernel, in software | 890,000 |
| the Forth device, one cell a cycle | 107,000 |
| the Forth device, eight cells a cycle | 29,000 |

These are cycles of the emulated machine, not host time.

## Apple ][

Times a real Apple ][+. Node 20.19, Apple M4 Max. The Korz figures are the quicker round after a
cold one. microM8 is its WebAssembly build at warp 100: two seconds of its cycle counter once the
program is spinning, and the whole boot for DOS. From
[GO-AND-TYPESCRIPT.md](microm8/GO-AND-TYPESCRIPT.md#the-wasm-build-compared-with-the-korz-engines).

| Workload | switch | compiler | resolver | microM8 (Wasm) | interpreter |
|---|---:|---:|---:|---:|---:|
| `DEX` / `JMP` in RAM | 128× | 150× | 88× | 2.9× | 1.7× |
| DOS 3.3 boot to `]` | 80× | 38× | 70× | 2.5× | 1.9× |
| Applesoft `10 GOTO 10` | 93× | 78× | 68× | 2.9× | 2.1× |

Here the switch leads on the DOS boot and on Applesoft, and the compiler leads on the
two-instruction loop. The Korz switch computes the beam address on every bus cycle and still runs
near 130 million cycles a second. microM8's Wasm module is 41,316,183 bytes, and the Go runtime,
the scheduler and the garbage collector share its one thread with the CPU loop. Why it lands next
to the Korz interpreter is written up in
[GO-AND-TYPESCRIPT.md](microm8/GO-AND-TYPESCRIPT.md#the-wasm-build-compared-with-the-korz-engines).

### A fast wait

When Little Computer People moves in, the page runs the Apple at max and paints one picture a
game second ([src/korz/apple2/README.md](src/korz/apple2/README.md#a-fast-wait)). The page's
status line shows the speed it is getting. On 21 November 2026, in Chrome on the same M4 Max, it
read 88.04 MHz while the guestbook side loaded and 30.49 MHz in the house. Those are readings of a
live page, not a benchmark.

## Not measured yet

- The Apple ][ rungs under Node 26.
- Any of it in Firefox or Safari.
- A whole Forth colon definition compiled as one function, which is not built
  ([FORTH-DAY.md](FORTH-DAY.md#a-whole-colon-definition-as-one-function)).
