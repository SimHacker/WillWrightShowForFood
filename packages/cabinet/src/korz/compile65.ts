import { cpuInterrupt, cpuPerform, type M6502 } from "../m6502/m6502.js";

/**
 * The 6502 compiler. A block is the straight-line run from one opcode until a branch, a jump,
 * a store, or an opcode this file does not inline. The generated function writes each bus cycle
 * out as a read or a write, so the scanner and the disk still see it, and V8 sees one function
 * rather than a call per operand. The opcode bytes are only peeked, to choose the block; the
 * guard reads them again and throws the block away when one has changed.
 *
 * What is inlined is the common straight-line set: loads, stores, the logic ops, compare,
 * transfers, increment and decrement, the flag ops, NOP, branches, and absolute JMP. A store
 * ends the block, so a write onto the next instruction is compiled after it lands. Everything
 * else is one call to the switch. A branch back to the block's own address repeats there, up
 * to a bound, and then the call returns. The poll runs between instructions. A pin that wins
 * is taken there, and the instruction it beat is left for later.
 */

type Tmpl = { len: number; body: string; stop: boolean };

const NZ = (reg: string): string => `m.p=(m.p&0x7d)|(${reg}&0x80)|(${reg}===0?2:0);`;

/** One fetch: the byte at PC, then PC advances. `name` holds the byte. */
const nextInto = (name: string): string =>
	`const pc_${name}=m.pc;m.pc=(pc_${name}+1)&65535;m.lastByte=pc_${name};let ${name}=0;do{m.cycles++;${name}=m.bus.read(pc_${name})&255;}while(!m.ready);`;

/** A read that leaves PC alone. The second cycle of an implied opcode. */
const readAt = (name: string, addr: string): string =>
	`let ${name}=0;do{m.cycles++;${name}=m.bus.read(${addr})&255;}while(!m.ready);`;

const TEMPLATES: (Tmpl | undefined)[] = [];

function op(code: number, len: number, body: string, stop = false): void {
	TEMPLATES[code] = { len, body, stop };
}

function implied(code: number, rest: string): void {
	op(code, 1, `${nextInto("op")}${readAt("pad", "m.pc")}${rest}`);
}

function load(code: number, len: number, reg: string, fetch: string): void {
	op(code, len, `${fetch}m.${reg}=v;${NZ("v")}`);
}

function store(code: number, len: number, reg: string, fetch: string): void {
	op(code, len, `${fetch}m.cycles++;m.bus.write(a,m.${reg}&255);`, true);
}

function alu(code: number, len: number, expr: string, fetch: string): void {
	op(code, len, `${fetch}m.a=${expr};${NZ("m.a")}`);
}

function cmp(code: number, len: number, reg: string, fetch: string): void {
	op(code, len, `${fetch}const d=(m.${reg}-v)&0xffff;m.p=(m.p&0x7c)|(d&0x80)|((d&0xff)===0?2:0)|((d&0xff00)===0?1:0);`);
}

function branch(code: number, cond: string): void {
	op(code, 2,
		`${nextInto("op")}${nextInto("rel")}if(${cond}){const target=(m.pc+(rel<128?rel:rel-256))&65535;${readAt("pad", "m.pc")}if((target&65280)!==(m.pc&65280)){${readAt("fix", "(m.pc&65280)|(target&255)")}}else m.irqDelay=true;m.pc=target;}`,
		true);
}

const IMM = `${nextInto("op")}${nextInto("v")}`;
const ZP = `${nextInto("op")}${nextInto("z")}${readAt("v", "z")}`;
const ABS = `${nextInto("op")}${nextInto("lo")}${nextInto("hi")}${readAt("v", "(hi<<8)|lo")}`;
const ZP_A = `${nextInto("op")}${nextInto("a")}`;
const ABS_A = `${nextInto("op")}${nextInto("lo")}${nextInto("hi")}const a=(hi<<8)|lo;`;

load(0xa9, 2, "a", IMM);
load(0xa2, 2, "x", IMM);
load(0xa0, 2, "y", IMM);
load(0xa5, 2, "a", ZP);
load(0xa6, 2, "x", ZP);
load(0xa4, 2, "y", ZP);
load(0xad, 3, "a", ABS);
load(0xae, 3, "x", ABS);
load(0xac, 3, "y", ABS);

store(0x85, 2, "a", ZP_A);
store(0x86, 2, "x", ZP_A);
store(0x84, 2, "y", ZP_A);
store(0x8d, 3, "a", ABS_A);
store(0x8e, 3, "x", ABS_A);
store(0x8c, 3, "y", ABS_A);

alu(0x29, 2, "m.a&v", IMM);
alu(0x09, 2, "(m.a|v)&0xff", IMM);
alu(0x49, 2, "m.a^v", IMM);
alu(0x25, 2, "m.a&v", ZP);
alu(0x05, 2, "(m.a|v)&0xff", ZP);
alu(0x45, 2, "m.a^v", ZP);
alu(0x2d, 3, "m.a&v", ABS);
alu(0x0d, 3, "(m.a|v)&0xff", ABS);
alu(0x4d, 3, "m.a^v", ABS);

cmp(0xc9, 2, "a", IMM);
cmp(0xe0, 2, "x", IMM);
cmp(0xc0, 2, "y", IMM);
cmp(0xc5, 2, "a", ZP);
cmp(0xe4, 2, "x", ZP);
cmp(0xc4, 2, "y", ZP);
cmp(0xcd, 3, "a", ABS);
cmp(0xec, 3, "x", ABS);
cmp(0xcc, 3, "y", ABS);

implied(0xea, "");
implied(0xe8, `m.x=(m.x+1)&0xff;${NZ("m.x")}`);
implied(0xca, `m.x=(m.x-1)&0xff;${NZ("m.x")}`);
implied(0xc8, `m.y=(m.y+1)&0xff;${NZ("m.y")}`);
implied(0x88, `m.y=(m.y-1)&0xff;${NZ("m.y")}`);
implied(0xaa, `m.x=m.a;${NZ("m.x")}`);
implied(0xa8, `m.y=m.a;${NZ("m.y")}`);
implied(0x8a, `m.a=m.x;${NZ("m.a")}`);
implied(0x98, `m.a=m.y;${NZ("m.a")}`);
implied(0xba, `m.x=m.s;${NZ("m.x")}`);
implied(0x9a, "m.s=m.x;");
implied(0x18, "m.p&=~1;");
implied(0x38, "m.p|=1;");
implied(0x58, "m.p&=~4;");
implied(0x78, "m.p|=4;");
implied(0xd8, "m.p&=~8;");
implied(0xf8, "m.p|=8;");
implied(0xb8, "m.p&=~64;");

branch(0x10, "(m.p&128)===0");
branch(0x30, "(m.p&128)!==0");
branch(0x50, "(m.p&64)===0");
branch(0x70, "(m.p&64)!==0");
branch(0x90, "(m.p&1)===0");
branch(0xb0, "(m.p&1)!==0");
branch(0xd0, "(m.p&2)===0");
branch(0xf0, "(m.p&2)!==0");

op(0x4c, 3, `${nextInto("op")}${nextInto("lo")}${nextInto("hi")}m.pc=(hi<<8)|lo;`, true);

const MAX_INSNS = 24;
/** A branch back to the same address stays in this call, so the caller is not paid per iteration. */
const STAY = 64;

type Gen = (m: M6502, perform: typeof cpuPerform, interrupt: typeof cpuInterrupt) => number;

/** A machine the compiler can fall back into: one sea step. */
export type Compilable = M6502 & { one(): void; lastRun: number };

/** The poll, in the block, so a pin is seen between instructions without a call. */
function pollAt(at: number): string {
	return `if(m.nmi&&!m.nmiPrev)m.nmiPending=true;m.nmiPrev=m.nmi;{const delayed=m.irqDelay;m.irqDelay=false;if(m.nmiPending){m.nmiPending=false;m.pc=${at};interrupt(m,0xfffa);return n+1;}if(!delayed&&m.irq&&(m.p&4)===0){m.pc=${at};interrupt(m,0xfffe);return n+1;}}`;
}

/** A block as a browser sees it: where it starts, its opcodes, and its source. */
export type Block65 = { readonly entry: number; readonly size: number; readonly source: string };

export class Compiler65 {
	/** Blocks built and blocks dropped because an opcode under them changed, since the machine was made. */
	built = 0;
	invalidated = 0;
	private readonly blocks = new Map<number, Gen>();
	private readonly sources = new Map<number, Block65>();
	private hotPc = -1;
	private hotFn: Gen | null = null;

	constructor(private readonly cpu: Compilable) {}

	/** The blocks in use, by entry address. */
	list(): Block65[] {
		return [...this.sources.values()].sort((a, b) => a.entry - b.entry);
	}

	flush(): void {
		this.blocks.clear();
		this.sources.clear();
		this.hotPc = -1;
		this.hotFn = null;
	}

	/**
	 * One block. A branch back to its own address repeats inside the block, up to a bound,
	 * so the caller is not paid per iteration. The count is switch steps. A changed opcode
	 * drops the block and one sea step runs in its place.
	 */
	step(): number {
		const pc = this.cpu.pc & 0xffff;
		const fn = this.block(pc);
		if (!fn) {
			this.cpu.one();
			return this.cpu.lastRun;
		}
		const n = fn(this.cpu, cpuPerform, cpuInterrupt);
		if (n < 0) {
			this.blocks.delete(pc);
			this.sources.delete(pc);
			this.invalidated += 1;
			this.hotPc = -1;
			this.hotFn = null;
			this.cpu.one();
			return this.cpu.lastRun;
		}
		return n;
	}

	private block(pc: number): Gen | null {
		if (pc === this.hotPc) return this.hotFn;
		let fn = this.blocks.get(pc);
		if (!fn) {
			const peek = this.cpu.bus.peek?.bind(this.cpu.bus);
			if (!peek) return null;
			fn = this.compile(pc, peek);
			this.blocks.set(pc, fn);
			if (this.blocks.size > 1024) {
				const oldest = this.blocks.keys().next().value;
				if (oldest !== undefined) {
					this.blocks.delete(oldest);
					this.sources.delete(oldest);
				}
			}
		}
		this.hotPc = pc;
		this.hotFn = fn;
		return fn;
	}

	private compile(entry: number, peek: (addr: number) => number): Gen {
		const guards: string[] = [];
		const parts: string[] = [];
		let at = entry & 0xffff;
		for (let i = 0; i < MAX_INSNS; i++) {
			const opcode = peek(at) ?? 0;
			guards.push(`m.bus.peek(${at})!==${opcode}`);
			const tmpl = TEMPLATES[opcode];
			const poll = pollAt(at);
			if (!tmpl) {
				if (i === 0) parts.push(`{${poll}${nextInto("op")}perform(m,op);n++;}`);
				break;
			}
			parts.push(`{${poll}${tmpl.body}n++;}`);
			at = (at + tmpl.len) & 0xffff;
			if (tmpl.stop) break;
		}
		const hex = entry.toString(16).padStart(4, "0");
		const source = `"use strict";let n=0;if(${guards.join("||")})return -1;const entry=m.pc;for(let spins=0;spins<${STAY};spins++){\n${parts.join("\n")}\nif(m.pc!==entry)return n;}\nreturn n;\n//# sourceURL=korz65/blk-${hex}.js`;
		const fn = new Function("m", "perform", "interrupt", source) as Gen;
		this.sources.set(entry, { entry, size: parts.length, source });
		this.built += 1;
		return fn;
	}
}
