import type { Clock, Iot, Step } from "../bus.js";
import type { Sea, Slot } from "./korz.js";
import type { K7, KorzPdp7 } from "./pdp7.js";

/**
 * The fourth level (KORZ-COMPILER.md): runs of PDP-7 instructions compiled to JavaScript from the
 * chains the sea gives each instruction word, run in batches between device events. A slot's
 * `emit` is its template; a chain of one slot with a template is inlined, anything else is called
 * as the resolver calls it. The resolver steps whatever can't be compiled, and is the oracle.
 *
 * Generated code sees `m` (the CPU), `k` (the clock), `b` (its block), `M` (core), `X` (the core
 * mask), `C` (the code marks), `J` (this compiler) and `K` (its constants). Templates use `e` for a computed effective
 * address, `t` for an indirect word, and `l` for link'AC in the operate group.
 */

/** What a template is given: the instruction, and the compiler's view of memory. */
export type Gen7 = {
	readonly ir: number;
	readonly at: number;
	/** The pc after the fetch: `at + 1` within its bank. */
	readonly next: number;
	/** The effective address: a number when it is known now, else an expression. */
	readonly ea: number | string;
	/** For `read` and `write` templates: the 15-bit address, a number or an expression. */
	readonly addr: number | string;
	/** The core index for that address: a number, or an expression masked to core. */
	readonly index: number | string;
	/** For `write` templates: the word. */
	readonly value: string;
	/** An expression reading core through the `read` chain. */
	read(addr: number | string): string;
	/** Statements writing core through the `write` chain. */
	write(addr: number | string, value: string): string;
	/** The chain that answers `selector` here, as code; null unless every slot it reaches has a template. */
	field(selector: string, coords: Readonly<Record<string, number>>): Code7 | null;
	/** An expression naming `v` in the generated code. */
	constant(v: unknown): string;
};

/** A template's output. */
export type Code7 = {
	/** Statements, run in order. */
	readonly code?: string;
	/** An expression: an effective address, a word read, an operate-group field's result. */
	readonly value?: number | string;
	/** An expression, evaluated after `code`: skip the next word. */
	readonly skip?: string;
	/** Where control goes instead of the next word: a number known now, or an expression. */
	readonly jump?: number | string;
	readonly halts?: boolean;
	/** Then the rest of the chain runs, as the slot's `run` calls `next`: an observe slot. */
	readonly next?: boolean;
	/**
	 * It can halt, hand out an IOT, change whether an interrupt can be taken, or let a unit store
	 * into core (an IOT): the block checks for each after it.
	 */
	readonly recheck?: boolean;
};

export type Emit7 = (g: Gen7) => Code7 | null;

const W = "0o777777";
const SIGN = "0o400000";
const LINK = "0o1000000";
const LACM = "0o1777777";
const ADDR = 0o17777;
const BANK = 0o60000;

const incr = (pc: number): number => (pc & BANK) | ((pc + 1) & ADDR);
const incrOf = (a: number | string): number | string =>
	typeof a === "number" ? incr(a) : `((${a} & 0o60000) | ((${a} + 1) & 0o17777))`;

/** The operate group's skip field, IR<8:11>, over `l`. */
const SKIP = [
	"false", `(l & ${SIGN}) !== 0`, `(l & ${W}) === 0`, `((l & ${W}) === 0 || (l & ${SIGN}) !== 0)`,
	`l >= ${LINK}`, `l >= ${SIGN}`, `(l >= ${LINK} || l === 0)`, `(l >= ${SIGN} || l === 0)`,
	"true", `(l & ${SIGN}) === 0`, `(l & ${W}) !== 0`, `((l & ${W}) !== 0 && (l & ${SIGN}) === 0)`,
	`l < ${LINK}`, `l < ${SIGN}`, `(l < ${LINK} && l !== 0)`, `(l < ${SIGN} && l !== 0)`,
];
/** CLA, CLL, CMA, CML, IR<5:6,16:17>. */
const CC = [
	"l", `(l ^ ${W})`, `(l ^ ${LINK})`, `(l ^ ${LACM})`, `(l & ${W})`, `((l & ${W}) ^ ${W})`, `(l | ${LINK})`, `((l | ${LINK}) ^ ${W})`,
	`(l & ${LINK})`, `(l | ${W})`, `((l & ${LINK}) ^ ${LINK})`, `((l | ${W}) ^ ${LINK})`, "0", W, LINK, LACM,
];
/** Rotates, IR<7,13:14>; the undefined ones have no template. */
const ROT: Readonly<Record<number, string>> = {
	0: "l",
	1: `(((l << 1) | (l >> 18)) & ${LACM})`,
	2: `(((l >> 1) | (l << 18)) & ${LACM})`,
	5: `(((l << 2) | (l >> 17)) & ${LACM})`,
	6: `(((l >> 2) | (l << 17)) & ${LACM})`,
};

const indirect = (jmp: boolean): Emit7 => (g) => {
	const d = (g.at & BANK) | (g.ir & ADDR);
	let code = (d & ADDR & ~0o7) === 0o10
		? `const t = (${g.read(d)} + 1) & ${W}; ${g.write(d, "t")}`
		: `const t = ${g.read(d)};`;
	if (jmp) code += " if (m.emirPending && (t & 0o200000) === 0) m.extend = false; m.emirPending = false;";
	return { code: `${code} const e = m.extend ? t & 0o77777 : ${d & BANK} | (t & 0o17777);`, value: "e" };
};

const jms: Emit7 = (g) => ({
	code: g.write(g.ea, `((m.link & 1) << 17) | (m.extend ? 0o200000 : 0) | ${g.next}`),
	jump: incrOf(g.ea),
});

/** The PDP-7's templates, one per slot that has one (`KorzPdp7.SLOTS`). */
export const T7 = {
	coreRead: ((g) => ({ value: `M[${g.index}]` })) as Emit7,
	coreWrite: ((g) =>
		typeof g.index === "number"
			? { code: `M[${g.index}] = (${g.value}) & ${W}; if (C[${g.index}] !== 0) J.touch(${g.index});` }
			: { code: `{ const w = ${g.index}; M[w] = (${g.value}) & ${W}; if (C[w] !== 0) J.touch(w); }` }) as Emit7,
	/** The backplane's write watch (`KorzPdp7.watchWrites`): hear of the store, then make it. */
	watch: ((g) => ({ code: `m.writeWatch(${g.addr});`, next: true })) as Emit7,

	direct: ((g) => ({ value: (g.at & BANK) | (g.ir & ADDR) })) as Emit7,
	indirect: indirect(false),
	jmpIndirect: indirect(true),
	calEa: ((g) => ({ code: `const e = m.extend ? 0o20 : ${(g.at & BANK) | 0o20};`, value: "e" })) as Emit7,
	calIndirect: ((g) => ({
		code: `const c0 = m.extend ? 0o20 : ${(g.at & BANK) | 0o20}; const t = ${g.read("c0")};`
			+ " const e = m.extend ? t & 0o77777 : (c0 & 0o60000) | (t & 0o17777);",
		value: "e",
	})) as Emit7,

	cal: jms,
	jms,
	dac: ((g) => ({ code: g.write(g.ea, "m.ac") })) as Emit7,
	dzm: ((g) => ({ code: g.write(g.ea, "0") })) as Emit7,
	lac: ((g) => ({ code: `m.ac = ${g.read(g.ea)};` })) as Emit7,
	xor: ((g) => ({ code: `m.ac = (m.ac ^ ${g.read(g.ea)}) & ${W};` })) as Emit7,
	add: ((g) => ({
		code: `const v = ${g.read(g.ea)}; let s = (m.ac & ${W}) + v; if (s > ${W}) s = (s + 1) & ${W};`
			+ ` if (((~m.ac ^ v) & (m.ac ^ s)) & ${SIGN}) m.link = 1; m.ac = s;`,
	})) as Emit7,
	tad: ((g) => ({
		code: `const s = ((((m.link & 1) << 18) | (m.ac & ${W})) + ${g.read(g.ea)}) & ${LACM}; m.link = (s >> 18) & 1; m.ac = s & ${W};`,
	})) as Emit7,
	and: ((g) => ({ code: `m.ac = m.ac & ${g.read(g.ea)} & ${W};` })) as Emit7,
	sad: ((g) => ({ skip: `m.ac !== ${g.read(g.ea)}` })) as Emit7,
	isz: ((g) => ({ code: `const n = (${g.read(g.ea)} + 1) & ${W}; ${g.write(g.ea, "n")}`, skip: "n === 0" })) as Emit7,
	jmp: ((g) => ({ jump: g.ea })) as Emit7,
	/** Multiply and divide take their operand from the next word and step past it. */
	eae: ((g) => {
		const kind = (g.ir >> 6) & 0o7;
		return { code: `m.pc = ${g.next}; m.eae(${g.ir});`, jump: kind === 1 || kind === 3 ? "m.pc" : undefined };
	}) as Emit7,
	law: ((g) => ({ code: `m.ac = ${g.ir & 0o777777};` })) as Emit7,
	/**
	 * The word executed is known only when it runs: Forth's NEXT is `XCT I 10`. Each XCT keeps the
	 * words it has executed, by address, compiled as single instructions, and checks the word is
	 * still the one compiled before it runs it.
	 */
	xct: ((g) => {
		const cells = g.constant(new Map());
		const e = typeof g.ea === "number" ? String(g.ea) : g.ea;
		return {
			code: `const w = ${g.read(g.ea)}; let x = ${cells}.get(${e}); if (x === undefined || x.w !== w) x = J.cell(${cells}, ${e}, w, ${g.next}); x.run(m);`,
			jump: "m.pc",
			recheck: true,
		};
	}) as Emit7,
	/** The IOT bus with its coordinates known: bring the unit up to date, then the pulses. */
	iot: ((g) => {
		const device = (g.ir >> 6) & 0o77;
		const pulse = g.ir & 0o67;
		return {
			code: `m.pc = ${g.next}; const io = m.io; io.device = ${device}; io.pulse = ${pulse}; io.sub = ${(pulse >> 4) & 0o3}; io.skip = 0;`
				+ `${g.ir & 0o10 ? " m.ac = 0;" : ""} io.ac = m.ac; if (m.box !== null) m.box.sync(${device}, ${pulse}); m.go.iot(io); m.ac = io.ac;`,
			skip: "io.skip !== 0",
			recheck: true,
		};
	}) as Emit7,
	opr: ((g) => {
		const ir = g.ir;
		const skp = g.field("skip", { skp: (ir >> 6) & 0o17 });
		const cc = g.field("cc", { cc: ((ir >> 9) & 0o14) | (ir & 0o3) });
		const rot = g.field("rot", { rot: ((ir >> 8) & 0o4) | ((ir >> 3) & 0o3) });
		if (!skp || !cc || !rot) return null;
		const sk = String(skp.value);
		let code = `let l = ((m.link & 1) << 18) | (m.ac & ${W});`;
		if (sk !== "false" && sk !== "true") code += ` const sk = ${sk};`;
		if (cc.value !== "l") code += ` l = ${cc.value};`;
		if (ir & 0o4) code += " l |= m.switches;";
		if (rot.value !== "l") code += ` l = ${rot.value};`;
		code += ` m.link = (l >> 18) & 1; m.ac = l & ${W};`;
		if (ir & 0o40) code += " m.halted = true;";
		return { code, skip: sk === "false" ? undefined : sk === "true" ? "true" : "sk", halts: (ir & 0o40) !== 0 };
	}) as Emit7,

	skip: (skp: number): Emit7 => () => ({ value: SKIP[skp]! }),
	cc: (cc: number): Emit7 => () => ({ value: CC[cc]! }),
	rot: (rot: number): Emit7 | undefined => (ROT[rot] === undefined ? undefined : () => ({ value: ROT[rot]! })),
};

/** What the compiler touches of the CPU, private fields included: generated code is plain JavaScript. */
type Machine7 = {
	pc: number;
	ion: boolean;
	ionDefer: number;
	irqLine: boolean;
	halted: boolean;
	trace: unknown;
	pendingIot: Iot | null;
	readonly core: Uint32Array;
	readonly coreMask: number;
	readonly sea: Sea<K7>;
	read(addr: number): number;
	write(addr: number, word: number): void;
};

/** A word one XCT executed, compiled. */
type Cell = { readonly w: number; readonly run: (m: Machine7) => void };

type Block = {
	readonly entry: number;
	valid: boolean;
	run: (m: Machine7, k: Clock) => number;
	/** The core words it was compiled from. */
	readonly words: number[];
	/** Instructions compiled into it, the next word of a skip included. */
	size: number;
	source: string;
	/** Calls into the block, and the instructions those calls retired, a loop's repeats included. */
	runs: number;
	retired: number;
	/** Its place in the order blocks were built, from 1. */
	readonly seq: number;
};

/** A block as a browser sees it. */
export type BlockInfo = {
	readonly entry: number;
	readonly size: number;
	readonly words: readonly number[];
	readonly source: string;
	readonly runs: number;
	readonly retired: number;
	readonly seq: number;
};
const info = (b: Block): BlockInfo => ({ entry: b.entry, size: b.size, words: b.words, source: b.source, runs: b.runs, retired: b.retired, seq: b.seq });

/** A block thrown away because a store hit a word it was compiled from. */
export type Dropped7 = { readonly entry: number; readonly size: number; readonly runs: number; readonly at: number };

const DROP_LOG = 32;

/** One instruction, compiled or not. */
type Ins = {
	readonly at: number;
	readonly ir: number;
	readonly next: number;
	readonly code: string;
	readonly skip?: string | undefined;
	readonly jump?: number | string | undefined;
	readonly halts: boolean;
	readonly recheck: boolean;
	/** No template: it runs through `execute` and ends the block. */
	readonly opaque: boolean;
	/** It stores into core, so the block checks it is still valid after it. */
	readonly wrote: boolean;
};

const RAN: Step = Object.freeze({});
const HALTED: Step = Object.freeze({ halt: true });
const UNBUILT = (): number => {
	throw new Error("korz7: block run before it was built");
};

/**
 * Generated `read` and `write`, one per source text for the whole process, reaching their machine
 * as `this`: a device's call site into `cpu.read` then sees one target in every machine.
 */
const ACCESSORS = new Map<string, unknown>();

/** The source of every generated `read` and `write`. */
export const generatedAccessors = (): string[] => [...ACCESSORS.keys()];

/** Longest block, in instructions. */
const MAX = 64;

const tick = (pc: number | string): string =>
	`if (k.cycles + 1 >= k.next || k.cycles + 1 >= k.until) { m.pc = ${pc}; return 1; } k.cycles += 1;`;
const still = (pc: number | string): string => `if (!b.valid) { m.pc = ${pc}; return 0; }`;

/** A chain as one piece of code: each observe slot's code, then the slot that answers. */
function compose(chain: readonly Slot<K7>[] | null, g: Gen7): Code7 | null {
	if (chain === null) return null;
	let code = "";
	for (const s of chain) {
		if (typeof s.emit !== "function") return null;
		const c = (s.emit as Emit7)(g);
		if (c === null) return null;
		if (c.next === true) {
			code += `${c.code ?? ""} `;
			continue;
		}
		return code === "" ? c : { ...c, code: `${code}${c.code ?? ""}` };
	}
	return null;
}

class Gen implements Gen7 {
	ir = 0;
	at = 0;
	next = 0;
	ea: number | string = 0;
	addr: number | string = 0;
	index: number | string = 0;
	value = "";
	wrote = false;
	constants: unknown[] = [];
	constructor(private readonly j: Compiler7) {}
	constant(v: unknown): string {
		this.constants.push(v);
		return `K[${this.constants.length - 1}]`;
	}
	read(addr: number | string): string {
		return this.j.emitRead(this, addr);
	}
	write(addr: number | string, value: string): string {
		this.wrote = true;
		return this.j.emitWrite(this, addr, value);
	}
	field(selector: string, coords: Readonly<Record<string, number>>): Code7 | null {
		return compose(this.j.chain(selector, coords), this);
	}
}

export class Compiler7 {
	/** Nonzero for a core word some block was compiled from. */
	readonly marks: Uint8Array;
	/** Blocks built and blocks invalidated by a store, since the machine was made. */
	built = 0;
	invalidated = 0;
	/** The last blocks thrown away, oldest first. */
	readonly dropped: Dropped7[] = [];
	private readonly m: Machine7;
	/** By entry address; null: the resolver steps this address (its fetch is watched). */
	private readonly blocks: (Block | null | undefined)[] = new Array(0o100000);
	private readonly users: (Block[] | undefined)[];
	private readonly gen = new Gen(this);
	private readonly solo = { cycles: 0, next: 1, until: 1 };
	/** The `read` and `write` chains for every CPU address, when no slot guards on the address; else null. */
	private reads: readonly Slot<K7>[] | null = null;
	private writes: readonly Slot<K7>[] | null = null;
	private readonly addrDim: number;

	constructor(cpu: KorzPdp7, private readonly once: () => Step, private readonly dispatched: Pick<Machine7, "read" | "write">) {
		this.m = cpu as unknown as Machine7;
		this.marks = new Uint8Array(cpu.coreWords);
		this.users = new Array(cpu.coreWords);
		this.addrDim = this.m.sea.dims.findIndex((d) => d.name === "addr");
		this.m.sea.onChange(() => this.flush());
		this.flush();
	}

	/** One instruction, as a batch of one. */
	step(): Step {
		this.solo.cycles = 0;
		return this.run(this.solo);
	}

	/** `Cpu.runBatch`: blocks where the entry conditions hold, the resolver's step where they don't. */
	run(k: Clock): Step {
		const m = this.m;
		m.pendingIot = null;
		for (;;) {
			if (m.ionDefer === 0 && !(m.irqLine && m.ion) && m.trace === null && !m.halted) {
				let b = this.blocks[m.pc];
				if (b === undefined) b = this.compile(m.pc);
				if (b !== null) {
					const before = k.cycles;
					b.runs += 1;
					const done = b.run(m, k);
					b.retired += k.cycles - before;
					if (done === 0) continue;
					if (m.pendingIot !== null) return { iot: m.pendingIot };
					return m.halted ? HALTED : RAN;
				}
			}
			const r = this.once();
			if (r.iot !== undefined || r.halt === true || k.cycles + 1 >= k.next || k.cycles + 1 >= k.until) return r;
			k.cycles += 1;
		}
	}

	/** A store into core word `a`, which some block was compiled from. */
	touch(a: number): void {
		const list = this.users[a];
		this.marks[a] = 0;
		this.users[a] = undefined;
		if (list === undefined) return;
		for (const b of list) {
			if (!b.valid) continue;
			b.valid = false;
			this.invalidated += 1;
			this.dropped.push({ entry: b.entry, size: b.size, runs: b.runs, at: a });
			if (this.dropped.length > DROP_LOG) this.dropped.shift();
			if (this.blocks[b.entry] === b) this.blocks[b.entry] = undefined;
		}
	}

	/** Forget every block: the sea changed, or core was cleared. */
	flush(): void {
		for (const b of this.blocks) if (b) b.valid = false;
		this.blocks.fill(undefined);
		this.users.fill(undefined);
		this.marks.fill(0);
		this.reads = this.everywhere("read", { who: 0, access: 0 });
		this.writes = this.everywhere("write", { who: 0 });
		this.accessors();
	}

	/** The generated source of the block at `pc`, for the debugger. */
	source(pc: number): string | null {
		return this.blocks[pc]?.source ?? null;
	}

	/** The blocks in use, by entry address, for a browser. */
	list(): BlockInfo[] {
		const out: BlockInfo[] = [];
		for (const b of this.blocks) if (b) out.push(info(b));
		return out;
	}

	/** The valid blocks compiled from core word `addr`, the entry's first. */
	containing(addr: number): BlockInfo[] {
		const list = this.users[addr & this.m.coreMask] ?? [];
		return list.filter((b) => b.valid).sort((a, b) => (a.entry === addr ? -1 : b.entry === addr ? 1 : 0)).map(info);
	}

	/** @internal The chain the interpreter would run at these coordinates; null where it would throw. */
	chain(selector: string, coords: Readonly<Record<string, number>>): readonly Slot<K7>[] | null {
		try {
			return this.m.sea.chain(selector, coords as unknown as K7);
		} catch {
			return null;
		}
	}

	/** @internal */
	emitRead(g: Gen, a: number | string): string {
		const c = this.memory(g, "read", a, { access: 0 });
		return c !== null && c.value !== undefined && !c.code ? String(c.value) : `(m.pc = ${g.next}, m.read(${a}))`;
	}

	/** @internal */
	emitWrite(g: Gen, a: number | string, value: string): string {
		g.value = value;
		const c = this.memory(g, "write", a, {});
		return c !== null && c.value === undefined ? (c.code ?? "") : `m.pc = ${g.next}; m.write(${a}, ${value});`;
	}

	/** The `read` or `write` chain for a CPU access to `a`, as code. */
	private memory(g: Gen, selector: "read" | "write", a: number | string, coords: Readonly<Record<string, number>>): Code7 | null {
		const chain = typeof a === "number"
			? this.chain(selector, { ...coords, addr: a & 0o77777, who: 0 })
			: selector === "read" ? this.reads : this.writes;
		g.addr = typeof a === "number" ? a & 0o77777 : a;
		g.index = typeof a === "number" ? a & this.m.coreMask : `(${a}) & X`;
		return compose(chain, g);
	}

	/**
	 * `read` and `write` for everyone who goes through the CPU to core, the devices' DMA included,
	 * compiled from the same chains; the dispatchers where a slot guards on the address.
	 */
	private accessors(): void {
		const g = this.gen;
		g.constants = [];
		g.next = this.m.pc;
		g.addr = "a";
		g.index = "a & X";
		g.value = "v";
		const r = compose(this.reads, g);
		const w = compose(this.writes, g);
		const make = (name: string, args: string, body: string): unknown => {
			const source = `return function korz7_${name}(${args}) {\nconst m = this, M = m.core, X = m.coreMask, J = m.compiler, C = J.marks;\n${body}\n};\n//# sourceURL=korz7/${name}.js`;
			let f = ACCESSORS.get(source);
			if (f === undefined) ACCESSORS.set(source, (f = new Function(source)()));
			return f;
		};
		this.m.read = r !== null && r.value !== undefined && !r.code
			? make("read", "a", `return ${r.value};`) as Machine7["read"]
			: this.dispatched.read;
		this.m.write = w !== null && w.value === undefined
			? make("write", "a, v", `a &= 0o77777;\n${w.code ?? ""}`) as Machine7["write"]
			: this.dispatched.write;
	}

	/** The chain for every address, if no slot of `selector` matching `coords` guards on the address. */
	private everywhere(selector: string, coords: Readonly<Record<string, number>>): readonly Slot<K7>[] | null {
		const v = this.m.sea.view(coords, selector);
		if (v.some((s) => s.constrained.includes(this.addrDim))) return null;
		return this.chain(selector, { ...coords, addr: 0 });
	}

	/**
	 * @internal The word `w` at `e`, executed by an XCT whose next word is `next`, as one
	 * instruction: it sets `pc` to wherever control goes. Kept in `cells` by address.
	 */
	cell(cells: Map<number, Cell>, e: number, w: number, next: number): Cell {
		const g = this.gen;
		g.constants = [];
		// An XCT of an XCT goes through `execute`, which counts the chain against its limit.
		const i = ((w >> 14) & 0o17) === 0o10 ? null : this.word(w, e, next);
		const n2 = incr(next);
		let code: string;
		if (i === null || i.opaque) code = `m.pc = ${next}; m.execute(${w}, ${e}, 1);`;
		else {
			const sk = i.skip;
			const after = sk === undefined ? next : sk === "true" ? n2 : `q ? ${n2} : ${next}`;
			code = `${i.code}${sk !== undefined && sk !== "true" ? ` const q = ${sk};` : ""} m.pc = ${i.jump ?? after};`;
		}
		const oct = e.toString(8);
		const source = `return function korz7_xct_${oct}(m) {\n${code}\n};\n//# sourceURL=korz7/xct-${oct}-${w.toString(8)}.js`;
		const cell: Cell = { w, run: new Function("M", "X", "C", "J", "K", source)(this.m.core, this.m.coreMask, this.marks, this, g.constants) };
		cells.set(e, cell);
		return cell;
	}

	private decode(at: number): Ins | null {
		const fetch = this.chain("read", { addr: at & 0o77777, who: 0, access: 1 });
		if (fetch === null || fetch.length !== 1 || fetch[0]!.emit !== T7.coreRead) return null;
		const m = this.m;
		return this.word(m.core[at & m.coreMask]!, at, incr(at));
	}

	/** Word `ir` as the instruction at `at`, with `next` where control goes after it. */
	private word(ir: number, at: number, next: number): Ins {
		const g = this.gen;
		g.ir = ir;
		g.at = at;
		g.next = next;
		g.ea = 0;
		g.wrote = false;
		const op = (ir >> 14) & 0o17;
		const ind = (ir >> 13) & 1;
		const ea = g.field("ea", { op, ind });
		let ex: Code7 | null = null;
		if (ea !== null) {
			g.ea = ea.value ?? 0;
			ex = g.field("exec", { op, ind });
		}
		if (ea === null || ex === null) return { at, ir, next: g.next, code: "", halts: false, recheck: false, opaque: true, wrote: false };
		return {
			at, ir, next: g.next,
			code: `${ea.code ?? ""} ${ex.code ?? ""}`.trim(),
			skip: ex.skip, jump: ex.jump, halts: ex.halts === true, recheck: ex.recheck === true, opaque: false, wrote: g.wrote,
		};
	}

	private compile(entry: number): Block | null {
		const constants = (this.gen.constants = []);
		let ins = this.decode(entry);
		if (ins === null) {
			this.blocks[entry] = null;
			return null;
		}
		const block: Block = { entry, valid: true, run: UNBUILT, words: [], size: 0, source: "", runs: 0, retired: 0, seq: this.built + 1 };
		const out: string[] = [];
		const seen = new Set<number>();
		let loops = false;
		const go = (t: number): string => {
			if (t === entry) {
				loops = true;
				return "continue;";
			}
			return `m.pc = ${t}; return 0;`;
		};
		const take = (i: Ins): void => {
			block.words.push(i.at & this.m.coreMask);
			block.size += 1;
		};
		/** Whether to follow on to `t` in this block, or leave for it. */
		const follow = (t: number): Ins | null => {
			if (seen.has(t) || block.size >= MAX) {
				out.push(go(t));
				return null;
			}
			const i = this.decode(t);
			if (i === null) out.push(go(t));
			return i;
		};
		while (ins !== null) {
			const i: Ins = ins;
			ins = null;
			seen.add(i.at);
			take(i);
			const n1 = i.next;
			const n2 = incr(n1);
			if (i.opaque) {
				out.push(`m.pc = ${n1}; m.pendingIot = null; m.execute(${i.ir}, ${i.at}, 0);`,
					"if (m.halted || m.pendingIot !== null) return 1;",
					"if (k.cycles + 1 >= k.next || k.cycles + 1 >= k.until) return 1; k.cycles += 1; return 0;");
				break;
			}
			out.push(`{ ${i.code}`);
			const sk = i.skip;
			if (sk !== undefined && sk !== "true") out.push(`const q = ${sk};`);
			const after = sk === undefined ? n1 : sk === "true" ? n2 : `q ? ${n2} : ${n1}`;
			if (i.halts) {
				out.push(`m.pc = ${after}; return 1; }`);
				break;
			}
			const to = i.jump ?? after;
			if (i.recheck) out.push(`if (m.halted || m.pendingIot !== null) { m.pc = ${to}; return 1; }`);
			out.push(tick(to));
			if (i.recheck) out.push(`if (m.ionDefer !== 0 || (m.irqLine && m.ion) || !b.valid) { m.pc = ${to}; return 0; }`);
			else if (i.wrote) out.push(still(to));
			if (typeof to === "number") {
				out.push("}");
				ins = follow(to);
				continue;
			}
			if (i.jump !== undefined || sk === undefined) {
				out.push(`m.pc = ${to}; return 0; }`);
				break;
			}
			// A skip: compile the next word under `if (!q)` when control comes back together after it.
			const x = block.size < MAX ? this.decode(n1) : null;
			if (x === null || x.opaque || x.halts || x.skip !== undefined) {
				out.push(`m.pc = ${to}; return 0; }`);
				break;
			}
			take(x);
			const xto = x.jump ?? n2;
			out.push(`if (!q) { ${x.code}`, tick(xto));
			if (x.wrote) out.push(still(xto));
			if (typeof xto !== "number") out.push(`m.pc = ${xto}; return 0;`);
			else if (xto !== n2) out.push(go(xto));
			out.push("} }");
			// Past a skip over a jump, the next word is reached only by skipping: it may be data.
			if (xto === n2) ins = follow(n2);
			else {
				out.push(go(n2));
				break;
			}
		}
		const oct = entry.toString(8);
		const body = out.join("\n");
		const source = `return function korz7_blk_${oct}(m, k) {\n${loops ? `for (;;) {\n${body}\n}` : body}\n};\n//# sourceURL=korz7/blk-${oct}.js`;
		block.source = source;
		block.run = new Function("b", "M", "X", "C", "J", "K", source)(block, this.m.core, this.m.coreMask, this.marks, this, constants) as Block["run"];
		this.blocks[entry] = block;
		for (const w of block.words) {
			this.marks[w] = 1;
			const list = this.users[w];
			if (list === undefined) this.users[w] = [block];
			else {
				if (list.length > 8) this.users[w] = list.filter((u) => u.valid);
				this.users[w]!.push(block);
			}
		}
		this.built += 1;
		return block;
	}
}
