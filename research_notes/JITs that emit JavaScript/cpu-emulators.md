# CPU emulators that emit JavaScript

Checked against repository source and author write-ups as of 20 November 2026. “Dormant” means no substantive commits for years; a later README-only edit is noted separately. Static generation of the emulator’s own opcode handlers is not treated as compilation of a guest program.

## Does Andrea Griffini's js6502 generate JavaScript functions from 6502 machine code, cache them, and invalidate them on writes? What is unimplemented?

### Takeaway
Yes. `6502.js` compiles a short run of guest bytes into a JavaScript function with `eval`, caches that function by entry address, and drops cached functions when `STA`, `STX`, `STY`, `INC`, or `DEC` write a byte those functions cover. The project is dormant (last commit 15 October 2023). It is a bare 6502 plus demos, not an Apple II.

### Cited Findings
- Repository `6502/js6502`, author Andrea Griffini, copyright 2012 in the compiler file. Default branch `master`. Last commit `3a767967` on 2023-10-15, message “updated demos”. — [repo](https://github.com/6502/js6502), [6502.js](https://github.com/6502/js6502/blob/master/6502.js), [commits](https://github.com/6502/js6502/commits/master)
- The README says: “Not an interpreter, but a JIT compiler to Javascript.” It also says self-modifying code “works only if the memory change is done using STA, STX, STY, INC or DEC,” and that “special locations” used for I/O “do work only if accessed using STA abs / LDA abs instructions.” — [README](https://github.com/6502/js6502/blob/master/README), same text on [the project page](https://6502.github.io/js6502/)
- `jit()` builds a string starting `(function(){`, appends JavaScript for each opcode, closes with `})`, and compiles it with `eval`. The block stops at `jmp`, `jsr`, `rts`, or `brk`, and otherwise stops after `NN = 2` instructions, then plants `ip=<next>`. — [6502.js `jit`](https://github.com/6502/js6502/blob/master/6502.js) lines 190 and 271–314
- The cache is `jitcode[]`, keyed by the entry `ip`. The run loop is `(current_f=(jitcode[ip]||(jitcode[ip]=jit())))();`. — [6502.js `run`](https://github.com/6502/js6502/blob/master/6502.js) lines 68 and 505–521
- Every byte a compiled function covers is recorded in `jitmap`. `maykill(address)` pops functions that cover that address, clears `jitcode[f.ip0]`, and if the function currently running is killed sets `alive = false` so the generated store/inc/dec returns to the dispatcher. `sta`, `stx`, `sty`, `inc`, and `dec` emit a `maykill(...)` call. — [6502.js `maykill` and stores](https://github.com/6502/js6502/blob/master/6502.js) lines 152–156, 179–181, 254–268
- These opcode generators `throw "Not implemented"`: `cli`, `php`, `plp`, `rti`, `sed`, `sei`. `brk` compiles to an `alert` and sets `ip=0`. Unimplemented opcodes (`___`) compile the text `{*Invalid opcode*}`, which is not valid JavaScript. — [6502.js opcode table](https://github.com/6502/js6502/blob/master/6502.js) lines 130, 146–178
- `sty` contains `m.susbtr(...)`, a misspelling of `substr`. Compiling an `STY` therefore throws when that line runs. — [6502.js `sty`](https://github.com/6502/js6502/blob/master/6502.js) line 181
- File comment: “special read/write only works for LDA/STA absolute.” `ADC`/`SBC` never consult the `d` decimal flag; only `cld` writes `d=0`, and `sed` throws. — [6502.js](https://github.com/6502/js6502/blob/master/6502.js) lines 28, 132, 147, 175, 277–288
- The tree is a CPU, a tiny assembler, a disassembler, and canvas demos (`demo0.asm`, `demo1.asm`, `demo2.asm`, `6502.html`). There is no Apple II ROM, disk, or language-card model. — [tree](https://github.com/6502/js6502)

### Inferences
- Invalidation is real but narrow: only those five store/RMW opcodes call `maykill`. A write done by `JSR`/`PHA` or by poking `m[]` from outside the generated code does not invalidate, which matches the README’s “only if” sentence.
- Blocks are at most two instructions unless a control-flow stopper ends them sooner. This is a function cache of tiny straight-line fragments, not a trace that turns guest loops into JavaScript loops.

### Gaps
- Whether the upward stack (`PHA` does `sp=(sp+1)&255`) is intentional was not compared to a 6502 test ROM. The source does that, but no author note was found explaining it.

## Does Guillaume Cédric Marty's jsSMS compile Z80 to JavaScript via new Function, with an AST and basic blocks? Does its documentation credit Shumway?

### Takeaway
Yes. The compiler parses Z80 into an Esprima-compatible AST, splits it into functions at jump targets and unconditional jumps, and installs each function with `new Function`. `src/compiler/README.md` says the internals were inspired by Shumway’s AVM2. The repository is dormant (last commit 26 February 2018).

### Cited Findings
- `gmarty/jsSMS`, “JavaScript Sega Master System & Game Gear dynamic recompiling emulator.” Last commit on `master`: 2018-02-26, “Remove license from top of files.” — [repo](https://github.com/gmarty/jsSMS), [commits](https://github.com/gmarty/jsSMS/commits/master)
- Compiler README, first technical paragraph: “Most of the internals of jsSMS were inspired by [Shumway](https://github.com/mozilla/shumway/tree/master/src/avm2).” — [src/compiler/README.md](https://github.com/gmarty/jsSMS/blob/master/src/compiler/README.md) line 9
- Same file: at load time a static recompiler runs Parser, Analyzer, Optimizer, Generator. “Later at runtime, JavaScript functions are generated from new instructions using dynamic recompilation.” The analyzer “breaks the instructions into functions” when “the instruction is a jump target” or “the instruction does a unconditional jump,” and “adds JavaScript AST to each instruction.” The generator’s “strings are evaluated through `new Function()`.” — [src/compiler/README.md](https://github.com/gmarty/jsSMS/blob/master/src/compiler/README.md) lines 23–25, 71–93, 97–124
- The same README says the AST “is compatible with Esprima.” A TODO says the analyzer does not yet “Rearrange parsed instructions to make use of JavaScript control flow constructs (`if`, `else if`, `while`, `break`…).” — [src/compiler/README.md](https://github.com/gmarty/jsSMS/blob/master/src/compiler/README.md) lines 72 and 89
- Marty’s Mozilla Hacks post (22 October 2013): the analyser “groups instructions into blocks (e.g. a jump instruction closes a block and open a new one) and output an AST.” Components listed: Parser, Analyser, Optimiser, Generator. — [Fast retro gaming on mobile](https://hacks.mozilla.org/2013/10/fast-retro-gaming-on-mobile/)
- `recompiler.js` does `new Function('return ' + self.generateCodeFromAst(body))()` both for the static pass (`cpu.branches[page]`) and for `recompileFromAddress` (`cpu.branches[romPage]`). — [recompiler.js](https://github.com/gmarty/jsSMS/blob/master/src/compiler/recompiler.js) lines 49–66 and 99–118
- `analyzer.js` sets `isFunctionEnder` and starts a new function when `bytecode.isJumpTarget` or the previous bytecode ended a function. — [analyzer.js](https://github.com/gmarty/jsSMS/blob/master/src/compiler/analyzer.js) lines 146–160
- Author limits, same README: static analysis cannot always see the next PC; paging is hard to track; code can run from RAM at PC ≥ `0xC000`. Otherwise the interpreter runs. Dynamic recompilation “only parses a single function.” — [src/compiler/README.md](https://github.com/gmarty/jsSMS/blob/master/src/compiler/README.md) lines 11–27 and 103–108

### Inferences
- “Basic blocks” in the Hacks post are the units the analyzer turns into separate JavaScript functions, closed by jumps. They are not basic blocks nested inside one JavaScript function with `if`/`while`. That rearrangement is still marked TODO.
- The Shumway credit is inspiration for the compiler pipeline (AVM2), not a claim that jsSMS is a copy of Shumway. Shumway itself is a Flash/SWF runtime, not a Z80 emulator. — [mozilla/shumway](https://github.com/mozilla/shumway/)

### Gaps
- No opcode-by-opcode audit of which Z80 prefixes the compiler emits versus which stay in `src/z80.js`. The compiler directory does contain `opcodes.js`, `opcodes-CB.js`, `opcodes-ED.js`, and `opcodes-DD-FD.js`.

## Does Paul Holden's n64js (MIPS R4300) emit JavaScript shaped for V8 inlining, and turn guest self-loops into JavaScript loops bounded by event deadlines?

### Takeaway
Yes, on current `main`. Fragments are compiled to JavaScript source and installed with `new Function`. Register writes are inlined as typed-array stores because helper calls blow V8’s inlining budget. A guest self-loop becomes a `do`/`while` that stops at the next event-queue deadline. The project is active (commit on 19 November 2026).

### Cited Findings
- `hulkholden/n64js`, `package.json` author “Paul Holden”. Last commit seen: `7edee62c69`, 2026-11-19, “Use integer division in GBI vertex count and index decoders (#502)”. README: “Interpreter & dynamic recompiler (JIT)” is checked; cycle accuracy is not. — [package.json](https://github.com/hulkholden/n64js/blob/main/package.json), [README](https://github.com/hulkholden/n64js/blob/main/README.md)
- `compileFragment` builds a string `return function fragment_<pc>_<ops>() { ... }` and installs it with `fragment.func = new Function("c", "cpu1", "rsp", code)(cpu0, cpu1, rsp);`. — [src/cpu/r4300.js](https://github.com/hulkholden/n64js/blob/main/src/cpu/r4300.js) lines 3117–3142
- Generator comment, verbatim, in `compileTraceSteps`:

  > Compiles a fragment's recorded `traceSteps` in a single pass. When `selfLoop` is true, emits intra-iteration exits relative to `opsExecuted` and wraps the body in a do-while loop that runs until the next scheduled event deadline (`cyclesToFirstEvent`) or an early exit.

  The emitted loop is ``do { ... opsExecuted += ${totalOps}; } while (c.canContinueSelfLoop(opsExecuted, ${totalOps}));``. — [src/cpu/recompiler.js](https://github.com/hulkholden/n64js/blob/main/src/cpu/recompiler.js) lines 394–420
- `canContinueSelfLoop` returns `opsExecuted + loopOps <= this.fragmentCycles + this.eventQueue.cyclesToFirstEvent`. — [src/cpu/r4300.js](https://github.com/hulkholden/n64js/blob/main/src/cpu/r4300.js) lines 547–551
- Comment on `canCompileAsSelfLoop`: a fragment is wrapped only if it “ends in the exact same PC and delay-slot state it started in, did not bail out to the interpreter, and its body is short enough (`<= kMaxSelfLoopBodyOps`) to stay within the JS JIT's inlining budget.” — [src/cpu/r4300.js](https://github.com/hulkholden/n64js/blob/main/src/cpu/r4300.js) lines 3107–3115
- V8 comment, verbatim, above `genSetRegS64LoHi`:

  > Emit direct constant-indexed typed-array stores instead of calling setRegS64LoHi / setRegS32Extend: those helpers exceed V8's small-function inlining threshold and quickly exhaust the fragment's inlining budget.

  — [src/cpu/recompiler.js](https://github.com/hulkholden/n64js/blob/main/src/cpu/recompiler.js) lines 702–709
- Holden’s 2012 blog describes the same idea at an earlier stage: record a hot trace, “create a Function object,” and associate it with the entry PC. A September 2012 commit moved off `eval` because “the results of eval() are no longer optimised” in Chrome 23 (V8 issue 2315). — [I wrote an N64 emulator - in JavaScript!](https://n64js.blogspot.com/2012/08/i-wrote-an-n64-emulator-in-javascript.html), [commit b5a49df](https://github.com/hulkholden/n64js/commit/b5a49df52b02ae1ae596990bcfcaa1167d7f5934)

### Inferences
- The deadline is the emulator’s event queue (`cyclesToFirstEvent`), not `requestAnimationFrame` itself. Writes that can schedule an event set `bailOut` so the fragment returns and the deadline is rechecked (`generateCop0TimingSync`).
- Self-loops are a special case of fragments that return to their own entry state. Other control flow still leaves the fragment and looks up the next one.

### Gaps
- `kMaxSelfLoopBodyOps` and `kFragmentLengthLimit` were not copied out of the constants file, so the numeric caps are not quoted here.

## Do 1964js, eNGE, jspspemu, and JSX actually construct JavaScript functions from guest MIPS?

### Takeaway
All four do. 1964js writes `<script>` elements whose text is generated from R4300 instructions. eNGE’s current `rec.js` builds a function per block with `new Function` and invalidates it on self-modifying RAM writes. jspspemu’s `FunctionGenerator` uses `new Function` and is archived. JSX’s `Recompiler` uses `new Function` but panics on much of the ISA, including the GTE, and has not been updated since 20 November 2012.

### Cited Findings
- **1964js** (`schibo/1964js`, Joel Middendorf, copyright 2012 in `gen.coffee`). README: “This project is still in the early stages.” “1964js dynamically writes JavaScript to the web page by reversing MIPS code to JavaScript. This JavaScript represents blocks of ROM code.” — [README](https://github.com/schibo/1964js/blob/master/README.md)
- `decompileBlock` starts `string = fnName + "=(r,h,m,t)=>{"`, appends the string returned by `CPU_instruction` for each word, then `document.createElement("script")`, `g.text = string`, and stores `self[fnName]` in `@fnLut`. `run` calls that function, or `decompileBlock` on a miss. `flushDynaCache` removes those script nodes and `eval`s a `delete` of the function name. — [coffee/1964.coffee](https://github.com/schibo/1964js/blob/master/coffee/1964.coffee) lines 506–515 and 570–603, [coffee/gen.coffee](https://github.com/schibo/1964js/blob/master/coffee/gen.coffee)
- Opcode handlers return JavaScript source, not host operations. Example: `r4300i_j` sets `@stopCompiling = true` and returns a string that updates `t.p[0]` and `return self._<target>`. `UNUSED` logs “warning: UNUSED” and returns `""`. `r4300i_syscall` logs “todo: r4300i_syscall” and returns `""`. — [coffee/1964.coffee](https://github.com/schibo/1964js/blob/master/coffee/1964.coffee) lines 756–774 and 819–825
- Last commit that touched `coffee/1964.coffee`: 2018-07-10, “Fix reading wrong byte for TV System.” The 2025-09-27 commit `a622f999` only changes `README.md` (+1/−3). Not archived. Treat the emulator as dormant since 2018. — [1964.coffee history](https://github.com/schibo/1964js/commits/master/coffee/1964.coffee), [a622f999](https://github.com/schibo/1964js/commit/a622f9994c)
- **eNGE** (`kootstra-rene/enge-js`). Active: last commit seen `17a31de2`, 2026-11-11, “Merge pull request #171”. Release notes in `readme.md` through 2026-10-30 describe game fixes, not a rewrite of the CPU. — [repo](https://github.com/kootstra-rene/enge-js), [readme.md](https://github.com/kootstra-rene/enge-js/blob/main/readme.md)
- `code/psx/rec.js` `createFunction` builds `'use strict';` plus `return function $<PC>(psx) { ... }` and runs `new Function(lines.join('\n'))()`. `compileBlock` calls it. A comment describes `codeWords`: a RAM store of an instruction word calls `invalidateCodeWord()`, and entries are reset to `lazyCompile` rather than deleted because “compiled blocks hold direct references to their jump targets.” — [code/psx/rec.js](https://github.com/kootstra-rene/enge-js/blob/main/code/psx/rec.js) lines 71–84, 725–748, 752–769
- An older path `docs/psx-core/recompiler.js` existed in 2022 commits and is gone from `main`. The live compiler is `code/psx/rec.js`. There is also an interpreter-side `code/psx/cpu.js` (8.5 KB) plus `rec-smc.spec.js`. — [tree](https://github.com/kootstra-rene/enge-js)
- **jspspemu** (`soywiz-archive/jspspemu`). Archived, last push 2021-03-27 (`514634c`, “Type function generation”). README on `develop` still says: “It JITs the cpu (though still slow because loops, function calls, and returns are not JITted yet) (just compiles basic blocks without any kind of control flow).” — [README](https://github.com/soywiz-archive/jspspemu/blob/develop/README.md), [repo metadata](https://github.com/soywiz-archive/jspspemu)
- `src/core/cpu/cpu_core.ts` `FunctionGenerator.getFunction` does `new Function('args', \`return function func_${startHex}(state) { "use strict"; ${code.code} }\`)(code.args)`. The same file looks up `this.instructionCache.getFunction(targetAddress, level + 1)` when emitting a call. `cpu_ast.ts` and `cpu_codegen.ts` build an AST of instructions, including a `BranchFlagStm`. — [cpu_core.ts](https://github.com/soywiz-archive/jspspemu/blob/develop/src/core/cpu/cpu_core.ts) around lines 1300–1422 and 1583
- Soywiz’s own post shows generated functions: a `while (true) switch (label)` state machine, and an inner `while (true)` for a `bgtzl` loop, plus direct `args.cache_0x....execute(state)` calls. — [JsPspEmu: New added optimizations](https://soywiz.com/jspspemu-new-added-optimizations/)
- **JSX** (`fay59/jsx`). Last commit 2012-11-20, “Fixed Mardown formatting”. Dormant since the week it was published. README: “The CPU core dynamically translates MIPS R3000a machine code into JS.” “While most of the core instruction set has been implemented, instructions from the Geometry Transformation Engine are notably missing.” “Currently, JSX is able to execute some of the BIOS code and gets stuck when it would need the GPU to actually do something.” Branches are a `switch` inside a loop; jumps `return` the next address. `FunctionCache` drops functions after RAM writes. — [README](https://github.com/fay59/jsx/blob/master/README.md)
- `js/core/recompiler.js` `recompileFunction` concatenates a `while (true) { switch (pc) { ... } }` string and does `new Function("pc", "context", jsCode)`. `recompileOne` does `new Function("context", code)`. `panic("... is not implemented")` covers, among others, `avsz3`, `avsz4`, `beql`, `bgezal`, `bltzal`, `lwl`, `lwr`, `swl`, `swr`, `mult`, `xor`, `xori`, and the GTE ops `rtps`, `rtpt`, `nclip`, `mvmva`, `dpcs`, `gpl`. — [js/core/recompiler.js](https://github.com/fay59/jsx/blob/master/js/core/recompiler.js) lines 12–78 and the `panic` lines from 601 onward
- `js/core/compiled.js` `FunctionCache.invoke` recompiles when the address is missing or `functionDirty` (invalidation map newer than `jitTime`). `invalidate` stamps the 256-byte page. — [js/core/compiled.js](https://github.com/fay59/jsx/blob/master/js/core/compiled.js)

### Inferences
- 1964js is a real guest-to-JavaScript compiler, but an early one: unknown opcodes become empty strings, so they are skipped rather than trapped, and `syscall` is a logged TODO. The 2025 commit did not revive the CPU.
- eNGE is the only one of the four that is both a MIPS-to-JavaScript compiler and under active development in 2026. Completeness of every R3000 opcode was not audited; the file has no “not implemented” strings, and the project’s own notes describe commercial games running.
- jspspemu’s README and its `develop` compiler disagree. The README says basic blocks with no control flow. The compiler source and Soywiz’s post show generated functions that contain loops and direct calls. The README was not updated to match. The project is archived.
- JSX does construct functions, and then refuses a large part of the instruction set, including the coprocessor games need to draw. It is not a playable PS1 emulator.

### Gaps
- 1964js: no inventory of which R4300 opcodes return real JavaScript versus `""` or a log line. `opcodeMap.coffee` wires a full decode table, including many `UNUSED` slots.
- eNGE: did not diff `rec.js` opcode map against a R3000 manual.
- jspspemu: did not measure how much of the VFPU is emitted by `cpu_codegen.ts` versus left to the interpreter (`cpu_interpreter.ts` is only 908 bytes, so the interpreter is not the main core).

## Did Sebastian Macke's jor1k OpenRISC-to-JavaScript dynarec lose to the interpreter, and did a later experiment move to WebAssembly?

### Takeaway
Yes. Macke’s own wiki page says the 2014 JavaScript dynarec was more than ten times slower than the interpreter and crashed browsers. In 2017 he switched to recompiling a whole user-mode ELF to asm.js and then to WebAssembly with Binaryen, demonstrated on one program. A separate 2019 “webassembly cpu core” is a C CPU compiled with Emscripten, not a guest dynarec. The repository’s last commit is 27 July 2022 (dormant). The current `dynamiccpu.js` fetches a Wasm binary and calls `WebAssembly.instantiate`.

### Cited Findings
- Wiki page “Breaking the 1 billion instructions per second barrier via Dynamic Recompilation and WebAssembly,” on `s-macke/jor1k`: “jor1k is still based on ordinary machine code interpretation.” Section “The first naive attempt (2014)”: the experiment “is completely based on JavaScript, because WebAssembly was not available at that time,” commit [5245fe71](https://github.com/s-macke/jor1k/commit/5245fe71ae62ed1d2dca3b66c8ddd8f743df2360). “The code was more than ten times slower than without dynamic recompilation.” “I have never seen browsers crashing so fast than with this code.” “With these seemingly insoluble problems I gave up for more than two years.” — [wiki](https://github.com/s-macke/jor1k/wiki/Breaking-the-1-billion-instructions-per-second-barrier-via-Dynamic-Recompilation-and-WebAssembly)
- That commit, 2014-11-15, message “CPU: Initial commit to check the usability of a dynamically recompiling CPU,” adds `js/worker/cpu/dynamic/dynamiccpu.js` and `recompile.js`. — [5245fe71](https://github.com/s-macke/jor1k/commit/5245fe71ae62ed1d2dca3b66c8ddd8f743df2360)
- Same wiki, “The second less naive attempt (2017)”: recompile “the whole binary executable before it is executed.” “At the moment, it writes an asm.js file and compiles it via Binaryen. In the future the CPU will autogenerate the WebAssembly binary directly.” “At the moment only one program is supported,” `fbdemo`, started with `recompile /usr/bin/fbdemo` against a `cpu=dynamic` demo. — [wiki](https://github.com/s-macke/jor1k/wiki/Breaking-the-1-billion-instructions-per-second-barrier-via-Dynamic-Recompilation-and-WebAssembly)
- Current `js/worker/or1k/dynamic/dynamiccpu.js` (42,323 bytes, still on `master`) defines `FetchAndInstantiate(url, importObject)`, which `fetch`es `url` and calls `WebAssembly.instantiate(bytes, importObject)`. Setting a recompile pid logs `recompile pid` / `recompilepath` and builds an import object whose `env.memory` is the guest RAM. This is Wasm instantiation, not `eval` of JavaScript. — [dynamiccpu.js](https://github.com/s-macke/jor1k/blob/master/js/worker/or1k/dynamic/dynamiccpu.js) `FetchAndInstantiate` and `SetSPR`
- Commit `5075e05`, 2019-04-06, “Add webassembly cpu core,” compiles `js/wasm/or1k.c` with `emcc -s WASM=1 ... -o demos/or1k.wasm` and adds `createCPUWasm`, which instantiates that module and exports `Step`, `Init`, `ProgressTime`, and the usual interpreter hooks. `or1k.c` is hand-written C that imports `Read32`/`Write32`/… . That is a precompiled CPU core, not translation of a guest basic block at runtime. — [5075e05](https://github.com/s-macke/jor1k/commit/5075e059c0f06dadeafe7740bb5561c194dca87c), [js/wasm/or1k.c](https://github.com/s-macke/jor1k/blob/master/js/wasm/or1k.c)
- The fast path that actually boots Linux in the classic demo remains the asm.js interpreter `js/worker/or1k/fastcpu.js`, plus `safecpu.js`. Last commit on the repo: `3c7103ba`, 2022-07-27, “Merge pull request #174 from s-macke/networking-bugtracker.” — [tree](https://github.com/s-macke/jor1k), [commits](https://github.com/s-macke/jor1k/commits/master)

### Inferences
- “Lost to the interpreter” matches Macke’s wording: more than 10× slower than “without dynamic recompilation,” and he abandoned it for two years. The winner he names in the same page is the existing asm.js interpreter (over 100 million instructions per second).
- The later Wasm work is two different things. The 2017 experiment is ahead-of-time recompilation of one ELF user program to asm.js/Wasm. The 2019 core is Emscripten of a C CPU. Neither is a general OpenRISC-to-JavaScript dynarec, and the 2014 JavaScript dynarec is not what `dynamiccpu.js` does now.

### Gaps
- Did not re-run `fbdemo` or confirm the 2017 Binaryen output is still generated by current `dynamiccpu.js` rather than only loaded from a URL. The file fetches bytes; the generator that produces those bytes was not opened beyond the wiki’s description and the gist link in that page.
- Did not confirm `or1k.c` is a pure interpreter instruction by instruction. Its build line and `Step` export show a static Wasm module, which is enough to say it is not a JavaScript dynarec.

## Does v86's current dynamic compiler emit WebAssembly rather than JavaScript?

### Takeaway
Yes. Guest x86 is translated to WebAssembly modules. JavaScript in the `gen/` directory only generates the emulator’s own Rust backends from an instruction table. The project is active (commit 30 October 2026).

### Cited Findings
- `copy/v86` README, as returned from the repository page: “v86 emulates an x86-compatible CPU and hardware. Machine code is translated to WebAssembly modules at runtime in order to achieve decent performance.” — [README](https://github.com/copy/v86/blob/master/README.md)
- `docs/how-it-works.md` is written entirely in terms of Wasm limits and Wasm codegen: structured control flow, `brtable`, the stackifier, “Code-generation happens in two passes. The first pass finds all basic block boundaries, the second generates code for each basic block.” “The remaining code generation is mostly a straight-forward, 1-to-1 translation of x86 to wasm.” Hot pages are compiled; there is an interpreted mode that only finds entry points. — [docs/how-it-works.md](https://github.com/copy/v86/blob/master/docs/how-it-works.md)
- `src/rust/jit.rs` calls `codegen_finalize` with a Wasm table index and a pointer/length of generated bytes. The Rust `wasmgen` module builds Wasm sections (`\0asm`, version, type/import/function/code). — [src/rust/jit.rs](https://github.com/copy/v86/blob/master/src/rust/jit.rs), [how-it-works.md on paging and flags](https://github.com/copy/v86/blob/master/docs/how-it-works.md)
- The same doc says instruction decoding “is generated by a set of scripts from a table of instructions” under `gen/`, and that those scripts also generate tests. That is build-time generation of the emulator, shared by the analyzer, interpreter, and JIT. — [docs/how-it-works.md](https://github.com/copy/v86/blob/master/docs/how-it-works.md), [gen/](https://github.com/copy/v86/tree/master/gen)
- Last commit seen: `315b2b0b75`, 2026-10-30, “Focus window on mouse click to ensure keys are captured”. — [commits](https://github.com/copy/v86/commits/master)

### Inferences
- A claim that current v86 JITs guest code to JavaScript is false. The guest compiler’s output is a Wasm module. JavaScript is the page and the build scripts.

### Gaps
- The historical C JIT, before the Rust port, was not opened. This answer is about the current `master` compiler only. The README raw URL failed once with HTTP 404 during fetch; the same README text was retrieved by the repository page search, and `docs/how-it-works.md` plus `jit.rs` were fetched directly.

## Is there a complete Apple II emulator whose 6502 guest programs are dynamically translated to JavaScript?

### Takeaway
No such emulator was found. js6502 translates 6502 to JavaScript but does not emulate an Apple II. apple2js runs guest code by dispatching one instruction at a time through `@whscullin/cpu6502`. jsbeeb is a BBC Micro emulator: it builds one JavaScript function per opcode when the CPU module loads, then still fetches and dispatches every guest opcode.

### Cited Findings
- js6502’s tree has no Apple II machine model. See the first section. — [6502/js6502](https://github.com/6502/js6502)
- `whscullin/apple2js` `package.json` depends on `"@whscullin/cpu6502": "file:submodules/cpu6502"`. — [apple2js package.json](https://github.com/whscullin/apple2js/blob/main/package.json)
- `cpu6502.ts` `CPU6502.step` does `this.op = this.opary[this.readBytePC()]; this.op.fn();`. `opary` is filled from object maps `OPS_6502`, `OPS_65C02`, `OPS_NMOS_6502`, and so on. A search of that file found no `new Function`. — [js/cpu6502.ts](https://github.com/whscullin/cpu6502/blob/main/js/cpu6502.ts) constructor around lines 250–284 and `step` at line 1443
- `mattgodbolt/jsbeeb` describes itself as “A BBC Micro and other 8-bit Acorn emulator,” not an Apple II. — [README](https://github.com/mattgodbolt/jsbeeb/blob/main/README.md)
- `src/6502.opcodes.js` `generate6502JumpTable` loops `opcodeNum` from 0 to 255 and does `new Function(\`return function ${name}(cpu) { ... }\`)()` once per opcode. The returned `exec(opcode)` is `funcs[opcode].call(this, this.cpu)`. `src/6502.js` `execute` calls `this.runner.run(opcode)` for the opcode just fetched. The strings come from `InstructionGen` templates (`LDA`, `STA`, addressing modes), not from a guest PC. — [src/6502.opcodes.js](https://github.com/mattgodbolt/jsbeeb/blob/main/src/6502.opcodes.js) `InstructionGen` at line 39 and `generate6502JumpTable` around lines 1490–1510, [src/6502.js](https://github.com/mattgodbolt/jsbeeb/blob/main/src/6502.js) `execute` near line 607 and `run(opcode)` near lines 613, 1923, 1952

### Inferences
- jsbeeb’s `new Function` calls are a host-side jump table: 256 handlers, built from the opcode list, still selected by a fetched opcode byte. A guest loop still pays a dispatch per instruction. That is the opposite of js6502, which caches a function for a particular guest address.
- apple2js is a complete Apple II (and more) whose CPU is an interpreter. js6502 is a 6502 JIT without the Apple II.

### Gaps
- No evidence of another Apple II emulator, outside these three, that dynarecs 6502 to JavaScript. The search was “apple2js cpu6502 jsbeeb 6502 JavaScript dynamic recompiler” plus the js6502 repository. A private or unindexed project would not have shown up.

## Is there any PDP-7, PDP-8, or PDP-11 emulator that JITs guest machine code to JavaScript?

### Takeaway
None was found. The PDP-7, PDP-8, and PDP-11 emulators opened here interpret one instruction at a time. The Will Wright cabinet says so explicitly for its PDP-7. Robert O’Callahan’s 2010 runtime-codegen demo is an imaginary instruction set, not a PDP.

### Cited Findings
- Cabinet architecture note: “Cabinet does **not** currently compile PDP-7 programs into JavaScript; it interprets guest instructions and tests their behavior. SqueakJS's guest-language JIT is a useful precedent, not a feature Cabinet already has.” — [packages/cabinet/ARCHITECTURE-AND-LINEAGE.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/ARCHITECTURE-AND-LINEAGE.md)
- `paulnank/pdp11-js` `pdp11.js` line 8: “This code emulates the function of a PDP 11/70 CPU.” The file defines `readWordByVirtual`, `writeWordByVirtual`, `trap`, flag helpers, and operand decode. A search of that file for `new Function`, `eval(`, `function step`, `this.step`, and `execute(` found no matches. Last commit seen 2026-03-02. The project is alive and is an interpreter. — [pdp11.js](https://github.com/paulnank/pdp11-js/blob/master/pdp11.js), [repo](https://github.com/paulnank/pdp11-js)
- `MircoT/js-pdp8` is archived. README: “An emulator of PDP 8 (simplified) written in Javascript.” `lib/pdp8.js` advances `this.status.cycle = "FETCH"`. No `new Function` or `eval(` in the lines searched. `pdp8-compiled.js` is the library build, not a guest JIT. — [README](https://github.com/MircoT/js-pdp8/blob/master/README.md), [lib/pdp8.js](https://github.com/MircoT/js-pdp8/blob/master/lib/pdp8.js)
- emulators.org’s PDP-7 and PDP-8 pages document `cpu.step()` as one instruction and show the register file as ordinary JavaScript fields. Those pages are a host site, not the emulator author’s compiler. They agree with the cabinet and js-pdp8 sources and do not describe a JIT. — [PDP-7](https://emulators.org/emulator/pdp7/), [PDP-8](https://emulators.org/emulator/pdp8/)
- Robert O’Callahan, 1 November 2010, “Implementing A High-Performance Emulator In Javascript Using Run-Time Code Generation”: he defined “a really simple imaginary CPU instruction set,” built traces as strings, and `eval`’d them (then `new Function`). Not a PDP-7, PDP-8, or PDP-11. — [blog post](https://robert.ocallahan.org/2010/11/implementing-high-performance-emulator_01.html)

### Inferences
- A search for a PDP-to-JavaScript JIT turns up interpreters and one imaginary-ISA sketch. It does not turn up a dynarec.

### Gaps
- Not every PDP emulator on the web was opened. SIMH itself is native C. A JavaScript port that JITs and is not indexed under “PDP-11 JavaScript emulator JIT” would have been missed. The three machines named in the question were checked in the cabinet, `pdp11-js`, `js-pdp8`, and the emulators.org step-loop descriptions.
