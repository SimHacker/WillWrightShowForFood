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
- **Native Go has real threads, but one Apple can't use them.** The CPU and every device advance
  together, cycle by cycle. Threads help with several machines, rendering, audio and the network,
  not with the inner loop.
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
  escapes into listener interfaces ([FORK.yml](FORK.yml)).
- **Expected for TypeScript, to be measured**: a 6502 with byte banks, a page table, a 256-entry
  dispatch table and no allocation in the loop should run many times faster than a 1 MHz Apple. We
  are about 85% confident of that; [PLAN.md](PLAN.md) measures it against apple2js's MIT-licensed
  core and the Go build on the same workloads.
- **TypeScript's risks**: deoptimisation when a call site sees too many shapes, garbage-collection
  pauses if the hot loop allocates, and no fast 64-bit integers (`BigInt` is slow). None of these
  matter to an 8-bit machine that keeps 8-bit banks and 32-bit planes.
- **Native Go beats both on the desktop.**

## Expressiveness and understanding

- **Go** is explicit, uniformly formatted, statically checked, and readable by anyone; it is also
  verbose, and microM8's structure has grown monolithic around it: `Interpretable` has about 355
  methods, `settings` holds 102 global arrays indexed by VM slot, and machine state lives at fixed
  addresses in a 1 MB word space per slot.
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
  JIT then optimises, Vanessa Freudenberg's approach in SqueakJS applied to a 6502. Her reasons, in
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
