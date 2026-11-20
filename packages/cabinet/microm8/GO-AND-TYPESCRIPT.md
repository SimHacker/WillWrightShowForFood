# Go and TypeScript for this job

Neither language wins on every point. For the cabinet's goals (live coding, debugging, plugins,
memory mapping, one heap shared with the panels) TypeScript is the better fit. Go's advantages are
that microM8 already works in it, it is April and Melody's language, and its native desktop build is
faster than either browser build will be.

## Concurrency and parallelism

- **Go compiled to WebAssembly runs on one thread.** Go's `js/wasm` port has no WebAssembly threads,
  so microM8's 167 goroutine launches and 371 mutex and channel sites all run interleaved on one
  thread. They cost scheduling and buy no parallelism.
- **That concurrency causes trouble in the page.** The CPU's `RequestSuspend` busy-waits with
  `time.Sleep(5ms)`; our boot waits a number of scheduler turns rather than seconds, because hidden
  tabs throttle timers; frames cross into JavaScript by copy (`CopyBytesToJS`).
- **Go's speed is its threads, and the Wasm port cannot say that.** A native Go program is swift
  because goroutines run on real threads. `GOARCH=wasm` has no Wasm threads, so the same
  goroutines take turns on one thread. They cost a scheduler and buy no parallelism. There is no
  faster browser build of this Go program waiting to be unlocked. It waits in line behind the Korz
  rungs ([below](#the-wasm-build-waits)).
- **One Apple could not spend those threads on its inner loop anyway.** The CPU and every device
  advance together, cycle by cycle. Threads help with several machines, rendering, audio and the
  network.
- **TypeScript gets parallelism the browser's way**: a machine per Web Worker, sound in an
  AudioWorklet, video on the GPU ([STACK.md](STACK.md#video-on-the-gpu)), shared banks through
  `SharedArrayBuffer` with cross-origin isolation.
- **One thread is often what we want.** Linked machines on one backplane share memory with no
  coherence protocol, and a session replays exactly from cycle counts. Goroutine scheduling is
  nondeterministic, which works against exact replay and lockstep
  ([TRANSPARENCY.md](TRANSPARENCY.md#lockstep-send-the-inputs)).

## Speed and size

- **Measured for Go**: the module is 41,316,183 bytes; the wrapper's comments put the browser's top
  speed near 1.7 MHz; patch 0004 found reads below `$10000` allocating, because the value pointer
  escapes into listener interfaces ([FORK.yml](FORK.yml)). At warp 100, on the same three
  workloads as the Korz rungs, the Wasm Apple runs at 2.5× to 2.9× a real Apple ][+
  ([below](#the-wasm-build-waits)).
- **Measured for the Korz rungs**: a 6502 with byte banks and no allocation in the loop does run
  many times a real Apple. The switch leads on a DOS boot and on Applesoft. The compiler leads on
  a two-instruction loop. The numbers are below.
- **TypeScript's risks**: deoptimization when a call site sees too many shapes, garbage-collection
  pauses if the hot loop allocates, and no fast 64-bit integers (`BigInt` is slow). None of these
  matter to an 8-bit machine that keeps 8-bit banks and 32-bit planes.
- **Native Go beats both on the desktop.** That lead stays on the desktop. The browser does not
  get it by recompiling the same program to Wasm.

## The Wasm build waits

The page's fast engine is the Korz compiler. microM8 stays the oracle: the same floppies, its own
picture, a large download. This is a comparison of the two engines as they run. No Go is being
written. A fast wait, such as Little
Computer People moving in, runs on the compiler: one picture a game second, the speaker left as a
phase and a click count ([../src/korz/apple2/README.md](../src/korz/apple2/README.md#a-fast-wait)).

Times a real Apple ][+, whose clock is 1.020 MHz. Node 20.19, Apple M4 Max. The Korz figures are
the quicker round after a cold one (`scripts/apple-bench.mjs`). microM8 is warp 100, two seconds
of its cycle counter once the program is spinning, and the whole boot for DOS.

| Workload | switch | compile | resolve | microM8 | interpret |
|---|---:|---:|---:|---:|---:|
| DEX / JMP in RAM | 128× | 150× | 88× | 2.9× | 1.7× |
| DOS 3.3 boot to `]` | 80× | 38× | 70× | 2.5× | 1.9× |
| Applesoft `10 GOTO 10` | 93× | 78× | 68× | 2.9× | 2.1× |

On the tight loop the Wasm Apple is ahead of the Korz interpreter and far behind the switch. The
language is not a fifty-fold tax. A heavy interpreter in Go, compiled to Wasm, lands next to a
heavy interpreter in JavaScript.

What the 2.9× is paying for, each on the way from a guest instruction to a finished cycle:

- **The picture is built inside the instruction.** Every byte fetched calls `Apple2IOChip.Increment`,
  and that calls `CaptureMem` whenever the beam moves, which is nearly every cycle. The speaker,
  the cassette and every card are ticked in the same call. The Korz switch also computes the beam
  address on each bus cycle, and it still runs near 130 million cycles a second, because that
  address is a few arithmetic operations and a RAM read. microM8 stores pixels on those cycles.
  The measurement never asked JavaScript for a frame. The frame was built anyway.
- **The 6502 is an interpreter with interfaces.** `FetchExecute` calls out through Go interfaces
  for memory and devices. An interface call stays indirect. Reads below `$10000` were allocating,
  because a pointer escaped into a listener. The Korz switch is one function, numeric fields, and
  no allocation in the loop.
- **The Go runtime is inside the Wasm module, on one thread.** The scheduler, the garbage
  collector and the goroutine launches all interleave there. The CPU loop calls `time.Since` every
  hundred iterations and returns to JavaScript every 500 ms of wall time. `wasm_exec.js` is the
  other side of that return, and a call across it is not inlined.
- **The module is the whole desktop program**, about 41 MB. The hot loop is a small part of a
  program that also contains the debugger, the disk and the recorder.

V8 compiles JavaScript and Wasm through different front ends, and both can lower into TurboFan.
Wasm also has Liftoff, and hot functions are tiered up from how often they run. That optimizer
sees the emulator. Wasm types are already concrete integers, so there is less to speculate about
than in JavaScript, where V8 learns the shape of one cpu object and keeps a field in a register.
The guest program counter is a value in memory. TurboFan can tighten `FetchExecute`. It cannot
turn "the Apple is spinning at `$0800`" into a native loop, because those opcode bytes are data.
The Korz compiler does that step itself: it writes a JavaScript function for the hot block, and
V8 specializes that function. That is the optimization the Wasm module does not get to invent.

The switch is ahead of the compiler on the DOS boot and on Applesoft, which is the shape of a
program full of calls. The compiler is ahead when a block stays in RAM and repeats. The page
still runs the compiler. Those two numbers say where the compiler has work left. They are not a
reason to go back and speed up the Wasm build.

## Expressiveness and understanding

- **Go** is explicit, uniformly formatted, statically checked, and readable by anyone; it is also
  verbose, and microM8's structure has grown monolithic around it: `Interpretable` has about 355
  methods, `settings` holds 102 global arrays indexed by VM slot, and machine state lives at fixed
  addresses in a 1 MB word space per VM slot.
- **TypeScript**'s union types, generics, closures and object literals make declarations short:
  typed memory regions, codecs, opcode tables, soft-switch tables and cartridge YAML fit naturally.
  The types vanish at run time and don't catch everything, so readability depends on discipline.
- **The structure matters more than the language.** A TypeScript copy of microM8's globals and god
  interface would inherit the same problems. The gain comes from re-cutting along the cabinet's
  seams ([STACK.md](STACK.md#the-rules)).

## Debugging the running machine

- **Go in WebAssembly is close to opaque to the browser's tools.** No breakpoint in Go source in the
  page, no inspecting a Go struct, no watching a variable. Whatever the page needs is exported by
  hand through `syscall/js`, and the module rebuilt.
- **TypeScript is visible all the way down**: breakpoints and conditional breakpoints in the opcode
  handlers, live objects in the console, the profiler showing real function names, heap snapshots.
  The machine, its panels and the debugger share one heap, so a panel reads the Apple's RAM as a
  typed array with no copy and no call.
- **Native Go has good tools** (delve, pprof, the race detector), but outside the browser, where they
  never meet the cabinet's panels.

## Extending it without recompiling

This is where the difference is largest.

- **Go** has no `eval`, and its `plugin` package doesn't work on WebAssembly. A new hook means
  editing Go, rebuilding the 41 MB module, reloading the page, and losing the machine's state.
- **TypeScript can change the running machine**: replace an opcode entry or a soft-switch handler on
  the live object, add a watch or a plane, load a plugin with `import()` mid-session, generate code
  with `new Function`, and keep the machine running across edits with hot module replacement.
- **Code generation becomes possible**: hot 6502 blocks compiled into JavaScript that the browser's
  JIT then optimizes, Vanessa Freudenberg's approach in SqueakJS applied to a 6502. Her reasons, in
  her words: "I just love coding and debugging in a dynamic high-level language. The only thing we
  could potentially gain from WASM is speed, but we would lose a lot in readability, flexibility,
  and to be honest, fun." And: "I'd much rather make the SqueakJS JIT produce code that the
  JavaScript JIT can optimize well." ([HN 38774277](https://news.ycombinator.com/item?id=38774277),
  December 2023.)
- **The cost**: live patches must record who made them, or the machine becomes impossible to reason
  about ([STACK.md](STACK.md#the-rules)).

## What Go keeps

- **It works now**: about 338,000 lines, not counting vendored packages.
- **Upstream stays one code base**, in April and Melody's language, and fixes flow both ways.
- **Translation is expensive and risky**: it forks the code away from upstream and can bring back
  bugs they have already fixed. The oracles in [PLAN.md](PLAN.md) are how we catch those.
- **The desktop build is fast**: native speed, with GL, PortAudio, serial ports and real threads.
- **WebAssembly still fits hot, stable kernels.** Vanessa said the same in that comment: she would
  use WebAssembly for BitBlt and leave the VM in JavaScript. For us the equivalent kernel, video
  decoding, goes to the GPU in shaders instead.
- **The Go BASIC and Logo interpreters**, about 51,000 lines, can stay in WebAssembly beside the
  TypeScript machine until each one is worth translating ([MODULE-MAP.md](MODULE-MAP.md)).

↑ [STACK](STACK.md) · [README](README.md)
