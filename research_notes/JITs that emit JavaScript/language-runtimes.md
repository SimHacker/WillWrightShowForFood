# Language runtimes that compile guest execution into JavaScript

Scope is systems in the lineage of Vanessa Freudenberg’s SqueakJS that turn guest code into JavaScript while the guest is running. Design notes are kept separate from compilers that are actually checked in and invoked. Status is as of November 2026. Every finding below was taken from an author repository, author note, paper, or talk slides that were opened for this pass. Secondary write-ups were not used as the source of a claim.

## What does Freudenberg say about targeting the JavaScript JIT, and what does the checked-in SqueakJS compiler actually emit?

### Takeaway
Freudenberg’s own JIT notes (March 2021, updated November 2023, with a June 2024 implementation note) argue that SqueakJS should emit JavaScript that looks like ordinary JavaScript — temps and arguments instead of a Smalltalk stack — so the host JavaScript JIT can optimize it. The compiler on the default `main` branch, and the `jit.js` still present on the `v2` branch, does not do that: it is a single-pass, bytecode-by-bytecode template compiler that keeps the interpreter’s program counter, stack pointer, and context objects. Mapping contexts onto JavaScript locals is a design with mockups, not the shipped compiler. The 2014 SqueakJS paper’s object memory is ordinary JavaScript objects with direct references, not a byte-addressed heap.

### Cited Findings
- The notes are titled “Some thoughts on improving SqueakJS performance, by Vanessa in March 2021 (updated: November 2023)” and are published at [squeak.js.org/docs/jit.md.html](https://squeak.js.org/docs/jit.md.html).
- On targeting the host JIT, the notes say the current compiler “is single-pass, and simply concatenates template strings for every bytecode. No analysis is performed.” They then say: “we are not compiling to low-level machine code that will be executed as-is. We are targetting the Javascript JIT compiler, which will apply its own arsenal of optimizations to the code we give it. We just need to make it possible for it to do so.” The stated principle is “to keep our own optimizations to a minimum in order to have quick compiles, but structure the generated code in a way so that the host JIT can perform its own optimizations well.” — [jit.md](https://squeak.js.org/docs/jit.md.html)
- The same section uses `3 + 4` as the example. The current generator writes `stack[++vm.sp] = lit[1]` and then tests `typeof a === 'number'`. The proposed form puts `3` and `4` in temps so the host JIT can delete the type test and fold the addition. That contrast is presented as an argument for “context-to-var mapping instead of using a stack.” — [jit.md](https://squeak.js.org/docs/jit.md.html)
- “Context-to-Var mapping” is explicitly a proposal: “when a send invokes the function of a JIT-compiled method, then instead of allocating a new context object, we would just pop the arguments off the context stack into temp vars.” The notes include mockups (codepens, and a November 2023 `benchFib` mockup at [jit-perf.js](https://github.com/codefrau/SqueakJS/blob/gh-pages/docs/jit-perf.js)) and say a yielding-generator version and an exception-unwind version were measured, not merged. The June 2024 update says: “I started implementing this in the [v2 branch](https://github.com/codefrau/SqueakJS/blob/v2/README.md).” — [jit.md](https://squeak.js.org/docs/jit.md.html)
- The `v2` README, read from that branch, lists the high-performance JIT as a wanted change, not as done: “new high-performance JIT without per-frame context allocation, but instead using direct function calls, function temps as stack, args passed directly via function parameters.” It points back at the same notes and at [issue 121](https://github.com/codefrau/SqueakJS/issues/121). A separate item, per-instance-variable properties, is marked implemented and then called impractical as of a September 2025 update. — [v2/README.md](https://github.com/codefrau/SqueakJS/blob/v2/README.md)
- The checked-in compiler header, identical in substance on `main` and on `v2`, says: “It transcribes bytecodes 1-to-1 into equivalent JavaScript code using templates (and thus can even support single-stepping). It uses the interpreter's stack pointer (SP) and program counter (PC), actual context objects just like the interpreter, no register mapping, it does not optimize sends, etc.” The generated shape is `while (true) switch (vm.pc)`, with `stack[++vm.sp]` and `return` back to the main loop when a send changes `vm.activeContext`. Compilation is `return new Function(source)()`. Copyright line on `main` is “2014-2025 Vanessa Freudenberg.” — [main/jit.js](https://github.com/codefrau/SqueakJS/blob/main/jit.js), [v2/jit.js](https://github.com/codefrau/SqueakJS/blob/v2/jit.js)
- Default branch of the repository is `main`. Last push observed via the GitHub API was 2025-09-19. The project is not archived. — [codefrau/SqueakJS](https://github.com/codefrau/SqueakJS)
- SqueakJS 0.5, October 2014, is described on the project site as adding “a simple, fast-compiling, non-optimizing JIT compiler.” — [squeak.js.org](https://squeak.js.org/)
- The DLS 2014 paper lists, as a highlighted result, “the mapping of Squeak objects in the VM to JavaScript objects with direct references.” Section 3.1 says the Potato scheme is reused: objects are JavaScript objects whose slots include `hash`, `format`, `class` (an object), optional `pointers` / `words` / `bytes` arrays, `oop`, `mark`, and `nextObject` (an object, old space only). “We chose an array for storing instance variables rather than named JavaScript properties because the bytecodes reference them by index, not by name. SmallIntegers are directly represented by JavaScript numbers.” There is no contiguous object heap; enumeration uses `nextObject` links because JavaScript then had no weak pointers. — [Freudenberg-2014-SqueakJS.pdf](https://freudenbergs.de/bert/publications/Freudenberg-2014-SqueakJS.pdf)

### Inferences
- “Targeting the JavaScript JIT,” in Freudenberg’s notes, means shaping the emitted JavaScript so the browser’s own optimizing compiler can see numbers, temps, and direct calls. It does not mean SqueakJS emits machine code, asm.js, or WebAssembly.
- The context-to-local-variable compiler is still a design. Both `main` and `v2` `jit.js` headers still describe interpreter-style state. The `v2` README’s “I want to change” list is the author’s own statement that the new JIT is not the compiler in that branch.

### Gaps
- Pull request 168 was not reviewed line by line, so this pass does not claim anything about uncommitted experiments beyond the `v2` README and the `v2` `jit.js` header.
- The 2014 paper predates, or at most coincides with, the October 2014 JIT. It describes the object memory and the interpreter-shaped VM, not the later context-to-var proposal.

## Did Gnusto, and then Parchment, compile Z-machine instructions to JavaScript?

### Takeaway
Yes. The checked-in Gnusto engine compiles one or more Z-machine instructions into a string of JavaScript, turns that string into a function, runs it, and caches the function when the address is in static memory. Parchment, as Atul Varma and the Parchment project described it, was a browser shell around that same Gnusto engine, not a second compiler. The “written in 2002” date is on IFWiki, not in the engine file that was opened.

### Cited Findings
- `gnusto-engine.js` header: “The Gnusto JavaScript Z-machine library.” Copyright “2003-2009 The Gnusto Contributors.” CVS header records `$Date: 2005/04/26`. — [gnusto-engine.js](https://github.com/curiousdannii/gnusto/blob/master/gnusto-engine.js)
- Opcode handlers “return a string of JS … which can be evaluated to do the job of that opcode.” `_compile()` “returns a string of JavaScript code representing the instruction at the program counter (and possibly the next few instructions, too).” — [gnusto-engine.js](https://github.com/curiousdannii/gnusto/blob/master/gnusto-engine.js)
- `run()` looks up `this.m_jit[start_pc]`. On a miss it does `jscode=eval('with (this) {dummy='+this._compile()+'}')`, then “Store it away, if it's in static memory (there's not much point caching JIT from dynamic memory!)” when `start_pc >= this.m_stat_start`, and calls `jscode()`. — [gnusto-engine.js](https://github.com/curiousdannii/gnusto/blob/master/gnusto-engine.js)
- The author’s project page: “Gnusto is actually a just-in-time compiler: it translates Z-machine instructions to JavaScript on the fly, so that subsequent executions of the same code will run at speeds close to that of pure JavaScript.” — [batmantis.com/gnusto](http://www.batmantis.com/gnusto/)
- Repository README, by the later maintainer Dannii Willis: Thurman “originally designed Gnusto as a Mozilla/Firefox extension,” work stopped in 2005, Atul Varma in 2008 “used the VM engine code and built a new interpreter interface around it. Parchment … was no longer a extension, but now a webpage.” Willis split Gnusto from Parchment in 2009 and “in 2011 he started working on ifvms.js instead. Gnusto is no longer maintained.” The GitHub repository is archived. Last push observed: 2024-07-08, which is the archive action rather than new compiler work. — [curiousdannii/gnusto](https://github.com/curiousdannii/gnusto/)
- The Parchment Google Code archive describes the site as “powered by Thomas Thurman's Gnusto engine, which uses just-in-time compilation to speed up the processing of z-code.” — [code.google.com/archive/p/parchment](https://code.google.com/archive/p/parchment/)
- Atul Varma’s own portfolio note says he “repurposed Gnusto, a Z-Machine interpreter embedded in a Firefox extension, and encased it in a new Web-based shell.” — [portfolio.toolness.org/parchment](https://portfolio.toolness.org/parchment/)
- IFWiki says Gnusto “was first written in 2002 by Marnanel Thurman and Eric Liga,” that it “works by compiling Z-machine code into JavaScript the first time a routine is needed,” and that Parchment later replaced Gnusto with ZVM. — [ifwiki.org/Gnusto](https://www.ifwiki.org/Gnusto)
- The engine changelog in the repository “started July 2009.” — [CHANGES](https://github.com/curiousdannii/gnusto/blob/master/CHANGES)

### Inferences
- Parchment did not replace Gnusto’s compilation model. It reused the engine. The later Parchment default is ZVM from ifvms.js, which is a different compiler (next section).
- Static-versus-dynamic caching in Gnusto is the same idea Quixe later applies to ROM versus RAM: do not keep a compiled function for memory the game can rewrite.

### Gaps
- The 2002 date was not found in `gnusto-engine.js`, the changelog, or the README. The file’s own dates start at the 2003 copyright and a 2005 CVS stamp. IFWiki is a tertiary wiki for that year.
- Eric Liga’s role was not re-derived from a source he wrote. IFWiki lists him as a developer.

## Does Quixe `compile_path` build cached JavaScript functions, with stack and locals lowered, and different treatment of immutable versus writable memory? When did Plotkin describe this?

### Takeaway
Yes for the first two, with a narrower reading of the third. In Quixe 2.2.6, `compile_path` emits a straight-line path of Glulx opcodes as JavaScript statements, compiles them with `new Function('self', ...)`, and stores that function only when the start address is below `ramstart`. Stack values and locals are held in JavaScript temporaries (`offstack` / `offloc`) and written back only when analysis must stop. Immutable ROM is treated differently from writable RAM for caching of functions, paths, and string decoders, and Glulx has distinct RAM-relative addressing modes, but `compile_path` does not constant-fold general ROM loads into literals. Plotkin described the JIT publicly on 25 May 2015 and the `func(self)` calling convention on 29 May 2015. The `compile_path` / offstate / ROM-cache comments live in the source; this pass did not date those comments with blame.

### Cited Findings
- File header: “Designed by Andrew Plotkin,” copyright “2010-2024,” library version in the same file is `2.2.6`. — [quixe.js](https://github.com/erkyrath/quixe/blob/master/src/quixe/quixe.js)
- `compile_path` comment: “A path is a sequence of JS statements (eval'ed into a JS function) which implement the opcodes at that address. We compile as many opcodes as we efficiently can; compilation stops at the first call, return, unconditional branch, or so on.” It also stops at an address that is already a branch destination, because “you can't jump into the middle of a JS function.” “After executing a path, the VM state (pc, stack, etc) are set appropriately for the end of the path. However, we don't maintain that state opcode by opcode inside the path.” The function returns `make_code(...)`. — [quixe.js](https://github.com/erkyrath/quixe/blob/master/src/quixe/quixe.js)
- `make_code`: “Turn a string containing JS statements into a function object.” “This function used to use eval().” It now does `new Function('self', val)` (optional extra arguments). “The function runs in global scope… the function's first argument must be `self`.” — [quixe.js](https://github.com/erkyrath/quixe/blob/master/src/quixe/quixe.js)
- `execute_loop` caches the result: `path = pathtab[self.pc]`; on a miss it calls `compile_path` and, only `if (self.pc < ramstart)`, stores it in `pathtab`. `enter_function` likewise stores a `VMFunc` in `vmfunc_table` only `if (addr < ramstart)`. The `VMFunc` comment: “If the function is not in ROM, we still create this, but we will not add it to the permanent vmfunc_table.” — [quixe.js](https://github.com/erkyrath/quixe/blob/master/src/quixe/quixe.js)
- Offstate lecture in the same file: the compiler keeps “what values are on top of the VM stack” and “what values are in all the local variables” as `offstack` and `offloc`, containing “both numeric literals and (Javascript) temporary variables.” “When we add a value to the offstack, we delay generating the code that pushes it into the real (VM) stack.” “Temporary variables are considered immutable as long as they remain in the offstate.” Jumps, calls, and returns “unload the offstate.” — [quixe.js](https://github.com/erkyrath/quixe/blob/master/src/quixe/quixe.js)
- Operand parsing quotes immediate constants with `QuoteMem1` / `QuoteMem2` / `QuoteMem4` into JavaScript number literals. Local operands read `self.frame.locals[addr]` and then record the hold variable in `offloc`. Memory operands distinguish “main memory RAM” (modes 13–15, address plus `ramstart`) from “main memory” (modes 5–7, absolute address). Both memory cases emit a runtime call, `self.Mem4(addr)` or `self.Mem1` / `self.Mem2`, not a literal taken from the image. — [quixe.js](https://github.com/erkyrath/quixe/blob/master/src/quixe/quixe.js)
- Strings: `stream_string` compiles and caches a string function only when `addr < ramstart`. Otherwise it recompiles every time. A string table is given a decoding tree only when `self.stringtable+tablelen <= ramstart` (“If the table is entirely in ROM”). A comment on indirect string nodes says a ROM type-test “could” be precomputed “and it'd be mostly okay if we weren't caching this JIT code. But those aren't the common cases, so let's not bother.” — [quixe.js](https://github.com/erkyrath/quixe/blob/master/src/quixe/quixe.js)
- Plotkin, 25 May 2015, “Javascript wonkery”: “Imagine that this is an IF virtual machine interpreter, like Quixe. We're doing just-in-time (JIT) compilation. We take a Glulx function — that is, a string of Glulx opcodes — and convert it into a Javascript function.” The toy caches the function after `eval`. He then explains why `new Function` drops the closure, and why he was moving VM state onto an explicit `self`. Update the same post, 29 May 2015: “I've given each generated function an explicit `self` argument, and called them all as `func(self)`.” Reported speedups: 65% Safari, 55% Chrome, 10% Firefox. — [blog.zarfhome.com/2015/05/javascript-wonkery](https://www.blog.zarfhome.com/2015/05/javascript-wonkery)

### Inferences
- The May 2015 post is about making already-generated functions optimizable by the host JIT (no `eval` in the caller, no `bind`, an explicit `self` parameter). It matches `make_code` as it exists now. It does not itself document offstate or the `ramstart` cache rule; those are documented in the source comments.
- “Different treatment of immutable versus writable memory” is real for caching and for RAM-relative operand modes. It is not a general ROM constant-folder inside `compile_path`.

### Gaps
- Git blame for the `compile_path` comment was not retrieved, so the year those comments were written is not established beyond the file’s 2010–2024 copyright and the 25 May 2015 blog.
- Quixe’s last-commit date was not fetched. The source header’s copyright runs through 2024 and the in-file version is 2.2.6, so it is not being treated as dormant.

## What pipeline does ifvms.js / ZVM enable, and which higher-level reconstructions are explicitly not enabled?

### Takeaway
The enabled pipeline disassembles Z-code into an AST and compiles that AST to a cached JavaScript function with `new Function`. The generated function still uses the engine stack and a locals array. Reconstructing Inform `if` blocks and `while` loops into JavaScript control structure is implemented in `idioms.js` but commented out of the disassembler, and the README says that mapping is “currently not enabled.”

### Cited Findings
- README: “the ifvms.js VMs include a Just-In-Time disassembler/compiler. What justifies the third generation label is that the disassembler generates an Abstract Syntax Tree, allowing Inform idioms, for example for and while loops, to be identified and mapped to Javascript control structures (currently not enabled).” Glulx and TADS are “plans,” not implementations. ZVM is what Parchment and Lectrote use. — [README.md](https://github.com/curiousdannii/ifvms.js/blob/master/README.md)
- `src/zvm.js` `run()`: if `this.jit[pc]` is missing, `compile()`, then `this.jit[pc](this)`. `compile()` does `var context = this.disassemble()` and `this.jit[context.pc] = new Function('e', '' + context)`. — [src/zvm.js](https://github.com/curiousdannii/ifvms.js/blob/master/src/zvm.js)
- `disassembler.js` header: “disassembles zcode into an AST.” The call that would invoke `idiom_if_block` is inside a block comment. The disassembler stops at a “stopper” opcode unless that idiom call returns true, which it cannot, because the call is commented out. — [disassembler.js](https://github.com/curiousdannii/ifvms.js/blob/master/src/zvm/disassembler.js)
- `idioms.js` header TODO: “loops / doesn't work yet because of storers before the branch.” `idiom_if_block` can set `brancher.keyword = 'while'` when the body ends in a jump back to the branch. Nothing in the enabled disassembler calls it. — [idioms.js](https://github.com/curiousdannii/ifvms.js/blob/master/src/common/idioms.js)
- `ast.js`: “toString() functions are used to generate JIT code.” `RoutineContext.toString` prepends `var l=e.l,s=e.s,t=0;` and then joins opcode strings. `Variable.toString` emits `s[--e.sp]` for the stack and `l[n]` for locals. Callers emit `e.call(...)`. A `Context` is the place a loop body would go, but that only matters if an idiom builds one. — [ast.js](https://github.com/curiousdannii/ifvms.js/blob/master/src/common/ast.js)
- Willis’s 2013 forum post (the design pitch, earlier than the README’s “not enabled”) said ifvms.js “can compile a loop in place” and “At the moment it only recognises idioms for if blocks and while loops.” That post describes the intended pipeline, not the commented-out state of the current tree. — [intfiction.org topic 3044](https://intfiction.org/t/parchment-update-ifvms-js-zvm-new-default-engine/3044)
- GitHub API: repository last pushed 2025-07-12, not archived. npm package metadata seen in search listed version 1.1.6 and an update on 2022-06-19. — [curiousdannii/ifvms.js](https://github.com/curiousdannii/ifvms.js)

### Inferences
- What ships is an AST so that opcode objects can print themselves as JavaScript statements, then one `Function` per routine fragment, cached by PC. Stack and locals stay in engine arrays (`e.s`, `e.l`). That is a compiler, and it is not the control-flow reconstruction the README uses to justify “third generation.”
- The 2013 forum description and the current source disagree on whether idiom reconstruction is on. The source and the README win: the call is commented out and the README says “currently not enabled.”

### Gaps
- Whether any build flag defines `DEBUG` and `debugflags.noidioms` in a way that could re-enable the commented call was not checked past the comment markers. In the file as fetched, the whole `if` is inside `/* */`, so a flag cannot turn it on without editing the source.

## What do St-Amour and Guo actually say about cloning `Vector.forEach`?

### Takeaway
The ECOOP 2015 paper uses Shumway as a story about a hand-written JavaScript method, not as a description of an ActionScript-to-JavaScript compiler pass. A single `Vector.forEach` shared by every element type was polymorphic, so the JavaScript JIT would not treat element accesses and the callback call as monomorphic and would not inline them. The Shumway engineers cloned `forEach` for the hot typed variants, such as integer vectors, so those sites became monomorphic. The paper separately says that coaching a JavaScript-targeting compiler such as Shumway is future work.

### Cited Findings
- Vincent St-Amour and Shu-yu Guo, “Optimization Coaching for JavaScript,” ECOOP 2015, LIPIcs, DOI 10.4230/LIPIcs.ECOOP.2015.271, pages 271–295. Section 2.1, “A Tale from the Trenches”: “The Shumway project, an open-source implementation of Adobe Flash in JavaScript, provides an implementation of ActionScript’s parametrically polymorphic Vector API, which includes a forEach method. This method takes a unary kernel function f as its argument and calls it once for each element in the vector.” “Initially, the Shumway implementors wrote a single implementation of the forEach method and used it for all typed variants of Vector.” “If the compiler observes code to be polymorphic, it may not apply crucial optimizations. For instance, the compiler may be unable to determine a monomorphic context for the element accesses and the calling of the kernel function, prohibiting optimizations such as inlining.” “They determined that performance could be recouped by cloning forEach’s implementation for variants that needed high performance (e.g., vectors of integers), as the JIT would then observe monomorphic accesses and call sites.” — [LIPIcs.ECOOP.2015.271.pdf](https://drops.dagstuhl.de/storage/00lipics/lipics-vol037-ecoop2015/LIPIcs.ECOOP.2015.271/LIPIcs.ECOOP.2015.271.pdf)
- Section 9.2, footnote 18: machine-generated JavaScript “is not intended to be read or edited by humans; it is therefore not suitable for coaching.” “It would, however, be possible to use coaching to improve the code generation of Emscripten or other compilers that target JavaScript, such as Shumway. This is a direction for future work.” — same PDF
- The paper’s evaluation is on Octane benchmarks (Richards, DeltaBlue, RayTrace, Splay, NavierStokes, PdfJS, Crypto, Box2D), not on Shumway. Speedups reported there are about 1.02× to 1.20× on those benchmarks. — same PDF

### Inferences
- Cloning `Vector.forEach` is a manual edit of Shumway’s JavaScript library code so SpiderMonkey (and, by the authors’ generalization, similar JITs) will specialize a call site. The paper does not say that Shumway’s AVM2 compiler emits a clone of `forEach` per guest method, and it does not show generated ActionScript-to-JavaScript for that method.
- The footnote is the paper’s actual statement that Shumway is a compiler targeting JavaScript, and that coaching that compiler had not been done.

### Gaps
- Shumway’s own compiler sources were not opened in this pass, so what AVM2 bytecode Shumway lowers to (traces, methods, interpreters) is unverified here. The Mozilla Shumway documentation URL in the paper’s footnote 6 was not re-fetched.

## Does DoppioJVM have a real JIT from hot Java bytecode to JavaScript functions?

### Takeaway
Yes. On `master`, hot straight-line bytecode traces are emitted as JavaScript and compiled with `new Function("f", "t", "u", emitted)`. Cold code, failed compiles, and single-opcode traces stay on the interpreter. This is later than the 2013 technical report, which describes an interpreter only. hrj landed the trace JIT in May 2016; John Vilk edited it afterward. The repository’s last push was 6 December 2022.

### Cited Findings
- `src/jit.ts` and `src/methods.ts` are both in `master`. `JitInfo.emit` returns a JavaScript source string. Loads emit `var sN=f.locals[i]`. — [jit.ts](https://github.com/plasma-umass/doppio/blob/master/src/jit.ts)
- `Method` constructor: “jit threshold. we countdown to zero from here.” `this.numBBEntries = codeLength > 3 ? 200 : 1000 * codeLength`. `getOp` compiles only once `numBBEntries <= 0`, caches the function in `compiledFunctions[pc]`, and otherwise returns `codeBuffer[pc]`, the interpreted opcode. — [methods.ts](https://github.com/plasma-umass/doppio/blob/master/src/methods.ts)
- `jitCompileFrom` walks opcodes from `startPC`, adds those that have `opJitInfo`, and closes the trace when `jitInfo.hasBranch` is set or an invoke opcode is reached. Invokes are included as the last operation of the trace, then the trace ends. Unknown opcodes also end the trace and set `failedCompile`. — [methods.ts](https://github.com/plasma-umass/doppio/blob/master/src/methods.ts)
- `Trace.close`: if the trace has more than one opcode, it builds a symbolic stack, emits assignments, and `return new Function("f", "t", "u", emitted)` with the comment “f = frame, t = thread, u = util”. A one-opcode trace returns `null` (“Trace was cancelled”). — [methods.ts](https://github.com/plasma-umass/doppio/blob/master/src/methods.ts)
- Commit history for `src/jit.ts`: hrj, 2016-05-06, “jit support: trace creation and invocation of traced functions” and “jit: added emitters for several common opcodes”; John Vilk, 2016-05-20, “Remove needless PC increments from JIT”; hrj, 2016-08-12, “JIT: Add space between operator in emitted code”; John Vilk, 2016-10-22, TypeScript 2.0 update. — [commits for src/jit.ts](https://github.com/plasma-umass/doppio/commits/master/src/jit.ts)
- Pull request 443, which is the design write-up rather than a substitute for the merged code, says Doppio “interprets JVM byte code one at a time” and proposes compiling opcode sequences to a JS function, then a stackless form, then inlined assignments such as `const s2 = s0 + s1`, via `eval` or `new Function`, restricted to methods whose opcode-execution count exceeds a threshold. Traces are “a contiguous block of opcodes that don't branch nor yield.” — [PR 443](https://github.com/plasma-umass/doppio/pull/443)
- The 2013 UMass report: “DOPPIO is an interpreter that implements the entire set of JVM bytecodes.” “it is an untuned interpreter running on top of JavaScript.” — [UM-CS-2013-011.pdf](https://web.cs.umass.edu/publication/docs/2013/UM-CS-2013-011.pdf)
- GitHub API: `pushed_at` 2022-12-06, not archived. No author README statement that the project is retired was opened. — [plasma-umass/doppio](https://github.com/plasma-umass/doppio)

### Inferences
- This is a shipped trace JIT, not an unmerged proposal. The 2013 paper should not be cited as the current execution strategy.
- Generated code still reads `f.locals` and spills back to `f.opStack` at trace boundaries. It lowers the operand stack inside a trace. It does not turn a whole Java method into one JavaScript function with a JavaScript local per JVM local.
- As of 2026 the tree is stale (no pushes since December 2022) but the authors have not, in a source opened here, called it dormant.

### Gaps
- Whether every opcode in `opJitInfo` has a correct emitter was not audited. The control structure (threshold, trace cut at branches, `new Function`) was.
- hrj’s full name was not established from a profile. The git author string on those commits is `hrj`.

## Does PyPy.js emit JavaScript or asm.js at runtime from PyPy traces, and is that different from compiling the interpreter to JavaScript?

### Takeaway
Both layers exist, and they are different. Emscripten compiles the PyPy interpreter itself to JavaScript / asm.js ahead of time. A separate RPython JIT backend turns hot traces into asm.js source at runtime and compiles that source with `new Function`. Ryan Kelly described the split on 8 August 2013. The project README says development is sleeping; the last push was 19 March 2019.

### Cited Findings
- Kelly, 8 August 2013: the plan is “using Emscripten to translate PyPy into JavaScript” and “having its JIT backend emit specialized asm.js code at runtime.” For the proof-of-concept regex matcher, after a hot loop, “The JIT backend renders the trace into a string of asm.js source code and invokes `new Function()` to compile it. Subsequent iterations of the loop execute the new specialized function rather than the generic matcher code.” He distinguishes the host JavaScript JIT, which is running the translated interpreter, from the guest JIT, which “triggers a JIT compilation to produce new JavaScript and feeds it up into the host interpreter.” The non-JIT `rpython --backend=js` run is the interpreter translated ahead of time, with no second “successfully compiled asm.js” line at runtime. — [rfk.id.au/blog/entry/pypy-js-poc-jit](https://www.rfk.id.au/blog/entry/pypy-js-poc-jit/)
- README of the support repository: “PyPy. Compiled into JavaScript. JIT-compiling to JavaScript at runtime.” “experimental emscripten/asmjs backend for PyPy.” “Development is sleeping at the moment,” pointing at issue 213, and pointing readers at Pyodide. — [pypyjs/pypyjs README](https://github.com/pypyjs/pypyjs/blob/master/README.rst)
- Project site: “the PyPy python interpreter, compiled for the web via emscripten, with a custom JIT backend that emits asm.js code at runtime.” — [pypyjs.org](https://pypyjs.org/)
- On the `pypyjs` branch, `ASMJSBuilder` builds a trace as an asm.js module: `function M(stdlib, foreign, heap){`, `"use asm";`, typed-array views of the heap, then `function F(frame, tladdr, label)`. `CompiledFuncASMJS.reassemble` ends with `jssrc = bldr.finish()` and `support.jitRecompile(self.compiled_funcid, jssrc)`. — [jsbuilder.py](https://github.com/pypyjs/pypy/blob/pypyjs/rpython/jit/backend/asmjs/jsbuilder.py), [assembler.py](https://github.com/pypyjs/pypy/blob/pypyjs/rpython/jit/backend/asmjs/assembler.py)
- The browser side, `library_jit.js` `jitRecompile`, reads the source string out of the Emscripten heap and does `var mkfunc = new Function("return (" + source + ")");` then `mkfunc()(stdlib, Module, buffer)`. — [library_jit.js](https://github.com/pypyjs/pypy/blob/pypyjs/rpython/jit/backend/asmjs/library_jit.js)
- `support.py` `compile_asmjs` parses asm.js into Python for the untranslated test interpreter. That path is the test double, not the browser compiler. — [support.py](https://github.com/pypyjs/pypy/blob/pypyjs/rpython/jit/backend/asmjs/support.py)
- GitHub API for `pypyjs/pypyjs`: `pushed_at` 2019-03-19, not archived. — [pypyjs/pypyjs](https://github.com/pypyjs/pypyjs)

### Inferences
- “Emits JavaScript” and “emits asm.js” are both accurate if asm.js is named as the subset. The runtime artifact is an asm.js module (`"use asm"`), not general JavaScript and not WebAssembly.
- Compiling the interpreter with Emscripten does not, by itself, compile guest Python to JavaScript. Guest Python becomes JavaScript only when the trace backend runs.

### Gaps
- Issue 213 was not opened, so the README’s “sleeping” is the dormancy statement used here; the issue thread may say more.
- Whether a later revision replaced asm.js with WebAssembly was not found. The branch that was opened still emits asm.js, and the README still says the project is sleeping.

## Does Moonshine compile Lua bytecode to JavaScript, and is the JIT off by default?

### Takeaway
The shipped VM both interprets Lua bytecode and, when the flag is on, translates a Lua function prototype’s instructions into a JavaScript function. The flag defaults off. Paul Cuthbertson’s 2013 talk listed “JIT?” as future work; the repository later contains the compiler. His November 2014 comment that Moonshine “is not a compiler” means it does not compile Lua source to bytecode.

### Cited Findings
- `vm/src/jit.js`, copyright “2013-2015 Gamesys Limited,” author “Paul Cuthbertson”: “Flag with which to switch JIT compiler on and off.” `shine.jit.enabled = shine.jit.enabled || false`. A function is compiled after `shine.jit.INVOCATION_TOLERANCE` invocations, which is `2`. `compile` does `var js = shine.jit.toJS(func)` and `shine.operations.evaluateInScope(js, func._vm)`. — [jit.js](https://github.com/gamesys/moonshine/blob/master/vm/src/jit.js)
- `toJS` walks `func._data.instructions` four bytes at a time and calls `shine.jit.TRANSLATORS[opcode]`. Translators still target a register file, for example `setR(R, a, R[b])` and `setR(R, a, gettable_internal(...))`. The emitted string is `function(A0, A1, ...){ ... while(1){switch(pc){ case N: ... }}}`. — [jit.js](https://github.com/gamesys/moonshine/blob/master/vm/src/jit.js)
- Cuthbertson, 27 November 2014, on a Moonshine issue: “Moonshine only interprets Lua bytecode; it is not a compiler.” The surrounding thread is about compiling Lua source text to bytecode inside Node, which he says is done by Yueliang / `luac`, not by Moonshine. — [issue 28](https://github.com/gamesys/moonshine/issues/28)
- The 2013 “Lua and the Web” slides: Moonshine “Runs Lua bytecode. Reimplements the Lua bytecode instruction set.” Under “Future:” the first bullet is “JIT?”. — [paulcuth.me.uk/slides/lua-and-the-web](https://paulcuth.me.uk/slides/lua-and-the-web/)
- GitHub API: last push 2021-05-28, not archived. Latest release listed in search was 0.1.4 on 2014-11-14. In the 2017 comment on the same issue, Cuthbertson points later arrivals at Starlight. — [gamesys/moonshine](https://github.com/gamesys/moonshine), [issue 28](https://github.com/gamesys/moonshine/issues/28)

### Inferences
- What the JIT emits is still a bytecode dispatcher (`switch(pc)` over register operations), not Lua syntax lowered to idiomatic JavaScript locals. It is nonetheless a runtime translation of guest bytecode into a JavaScript function, and it is off unless `shine.jit.enabled` is set.
- The 2013 slide is a proposal. The checked-in `jit.js` is the later implementation. As of 2026 the repository has had no pushes since May 2021; the author did not, in the files opened here, label the project dormant, but he redirected a missing feature to Starlight in 2017.

### Gaps
- `evaluateInScope` was not opened, so the exact `eval` versus `new Function` call that turns the `toJS` string into a function object was not quoted. `compile`’s callback treats the result as the function later invoked by `compiled.apply`.
- Whether the default build concatenates `jit.js` into `vm/moonshine.js` was not checked. The flag’s default is in `jit.js` itself.

## What does TurboWarp’s compiler documentation say about type analysis?

### Takeaway
TurboWarp’s documentation says the compiler turns Scratch scripts into JavaScript functions, including generators when a script must yield. A compiler released 20 September 2025 tracks the kinds of values each variable may have at each point in a script, including through loops and conditionals, and deletes numeric coercions when the analysis says they are redundant. That analysis is abandoned when another script might run in the middle and change a variable. The documentation credits Tacodiva with almost all of the new compiler work.

### Cited Findings
- “How TurboWarp runs Scratch projects 10-100x faster”: “TurboWarp's compiler removes all of that overhead by converting scripts directly to JavaScript functions.” The example for a forever loop that yields is `return function* () { ... yield; }`. A non-yielding bubble-sort script is `return function fun1_sort () { ... }`. The page says the host JIT “can theoretically optimize accordingly” if a variable is always a number, and that the generated code stays compatible with Scratch edge cases. Live editing does not see block edits until the script restarts, because the running form is one JavaScript function. — [docs.turbowarp.org/how](https://docs.turbowarp.org/how)
- “New Compiler,” dated in the page as released 20 September 2025, used on the website, the packager, and desktop app v1.15.0 and later: “the compiler analyzes scripts to determine what kinds of values each variable may have at each point in the script. This allows it to remove unnecessary type conversions and generate more specialized code. The old compiler tried to do this too, but was unable to reason about loops or conditionals.” The old output for a summing loop is `((+sum.value || 0) + (+i.value || 0))`. The new output, when the script is “run without screen refresh” and the warp timer is disabled, is `(sum.value + i.value)`, and the repeat count is treated as an integer (`a0 > 0` rather than `a0 >= 0.5`). — [docs.turbowarp.org/new-compiler](https://docs.turbowarp.org/new-compiler)
- Same page, the limit: “If warp timer is enabled or the script is not marked as ‘run without screen refresh’, the new compiler generates the same code as the old compiler. This is because the repeat block might pause before it finishes all iterations, so other scripts have the opportunity to change variables in unknown ways.” The example is another script storing a string into `i`, which would make `i.value + 1` concatenate. “Credits: Tacodiva did almost all the work.” — [docs.turbowarp.org/new-compiler](https://docs.turbowarp.org/new-compiler)
- The JavaScript-download page says the generated code “is not designed to be read or edited by humans” and points people who want readable JavaScript at leopardjs. — [docs.turbowarp.org/javascript](https://docs.turbowarp.org/javascript)

### Inferences
- Type analysis here is an intraprocedural, dataflow-style lattice over Scratch values, used to delete coercions and to pick integer loop tests. It is not a claim that every variable becomes a JavaScript number. The documentation’s own condition is that the script must not yield to other scripts.
- The `function*` form is the yielding compiler output. The non-yielding form is an ordinary function. Both are in the current “how it works” page, which was updated far enough to include the September 2025 benchmark numbers (Chromium 140).

### Gaps
- The compiler implementation (`irgen.js` / `iroptimizer.js` were named only in a GitHub compare snippet, which was not used as evidence) was not opened. The claims above are the documentation’s claims.
- Thomas Weber / GarboMuffin is not named on the two documentation pages that were opened. Those pages attribute the new compiler’s implementation to Tacodiva. Weber’s role as project author was not re-verified from a source in this pass.

## What argument does Egorov’s invokedynamic.js make about generic `Send` versus specialized send sites, and did Freudenberg cite it?

### Takeaway
Egorov’s JSConf EU 2014 slides argue that one generic `Send` is too polymorphic for V8 to optimize, and that each send site should be its own relinkable function, specialized on the observed types, because JavaScript assignment already is invokedynamic’s relink step. Freudenberg cites that talk in the SqueakJS JIT notes and says the inline-cache scheme in those notes is partly inspired by it. That citation is in the design notes, not in `jit.js`.

### Cited Findings
- Slides, “invokedynamic.js,” with the parenthetical “(Vyacheslav Egorov, 16.09.2014)”: a naive `Send(self, message)` implemented as `self[message].apply(...)` makes `Vector.prototype.dot` correct and slow. The slide’s d8 numbers: direct JavaScript `lensum` at 30,034 ops/sec, generic `Send` at 6.30 ops/sec, annotated “that's 4767x slower” and “`Send()` is too polymorphic & can't be optimized by V8.” — [mrale.ph/talks/jsconfeu2014](https://mrale.ph/talks/jsconfeu2014/)
- The replacement is one global per send site (`ΣSend$00`, `ΣSend$01`, …). `SendSite.prototype.bootstrap` compiles a handler with `Function('return ' + src)()()` and `link` stores it by assigning `global[this.name] = handler`. After that split, the same slide deck reports 9,267 ops/sec, “now only ~3x slower.” A single `Number.prototype['+']` is then called “CONGESTION” because every numeric send shares it. The specialized handler checks `typeof lhs === "number" && typeof rhs === "number"` and otherwise calls `Handler.site.miss`. Reported result: 22,738 ops/sec, “~25% slower.” Object sends check `self.constructor === ctor` and relink on the miss. Closing line of the talk: “JavaScript is `invokedynamic` / totally enough expressivity / almost enough optimizations.” — [mrale.ph/talks/jsconfeu2014](https://mrale.ph/talks/jsconfeu2014/)
- The same slides say the talk “was never intended to really be about compiling Smalltalk to JavaScript. It's about primitives that could make such translation easier,” and that non-local return is a separate, unsolved cost. — [mrale.ph/talks/jsconfeu2014](https://mrale.ph/talks/jsconfeu2014/)
- Conference page for the same talk, title “invokedynamic.js,” speaker Vyacheslav Egorov, JSConf EU 2014. — [2014.jsconf.eu speakers](https://2014.jsconf.eu/speakers/vyacheslav-egorov-invokedynamic-js.html)
- Freudenberg, in the inline-cache section of the JIT notes: “Regarding optimal performance, we should pay attention to Slava Egorov's JS Conf talk about dynamic dispatch” with links to the JSConf speaker page and to `http://mrale.ph/talks/jsconfeu2014/`. Next sentence: “The scheme outlined here is partly inspired by that talk.” The scheme in that section is a per-send-site `cachedClass` / `cachedFunc` (or a cache array) updated by assignment, which the notes explicitly cannot do by patching the middle of a JavaScript function. — [jit.md](https://squeak.js.org/docs/jit.md.html)
- The checked-in compiler header says the current compiler “does not optimize sends” and still uses `vm.send`. A search of SqueakJS issues did not turn up the Egorov citation; the citation that was found is in the notes. — [jit.js](https://github.com/codefrau/SqueakJS/blob/main/jit.js)

### Inferences
- The argument Freudenberg is using is the relinkable per-site function, not the generic `Send`. Her notes say the current JIT and the interpreter share one `send()` and that inline caches are future work, with polymorphic inline caches explicitly “a future optimization.”
- Egorov’s numeric results are slide-deck measurements on a modified d8, including a V8 inlining heuristic he edited. They are not measurements of SqueakJS.

### Gaps
- The talk video was not transcribed independently. The slides page is the source used for the argument and the numbers.
- No sentence in `jit.js` cites Egorov. The citation is only in the notes.
