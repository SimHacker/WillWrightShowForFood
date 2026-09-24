import type { Cpu, Step } from "../bus.js";
import { maskWord } from "../word.js";
import type { Trace } from "../trace.js";

const WORD = 18;
const WMASK = (1 << WORD) - 1; // 0o777777
const SIGN = 1 << 17; // 0o400000
const LINKBIT = 1 << 18; // link lives above the word, SIMH-style
const LACMASK = LINKBIT | WMASK;
const ADDR = 0o17777; // 13 bits, 8K bank

// Top 4 bits. Matches SIMH (IR >> 14) & 017 / DEC IR<0:3>.
const OP = {
	cal: 0o00,
	dac: 0o01,
	jms: 0o02,
	dzm: 0o03,
	lac: 0o04,
	xor: 0o05,
	add: 0o06,
	tad: 0o07,
	xct: 0o10,
	isz: 0o11,
	and: 0o12,
	sad: 0o13,
	jmp: 0o14,
	eae: 0o15,
	iot: 0o16,
	opr: 0o17,
} as const;

const XCT_MAX = 16;

export type Pdp7Opts = {
	coreWords?: number;
};

/**
 * PDP-7 instruction-set plugin. Semantics ported from Open SIMH
 * PDP18B/pdp18b_cpu.c (Bob Supnik), the reference oracle — see SIMH-MAP.md.
 * Implements what SYMELEC uses (DESIGN.md); the rest of the 18b family
 * (extend mode, API, user mode) is deliberately absent.
 */
export class Pdp7 implements Cpu {
	readonly wordBits = WORD;
	readonly coreWords: number;
	pc = 0;
	ac = 0;
	link = 0;
	mq = 0; // EAE multiplier-quotient
	sc = 0; // EAE step counter
	ion = false; // interrupt enable
	ionDefer = 0; // instructions to execute before interrupts may fire
	irqLine = false; // ORed device requests, set by the Cabinet each step
	halted = false;
	/** The console's eighteen ACCUMULATOR switches, read by OAS/LAS. SYMELEC never reads them; DUEL's players do. */
	switches = 0;
	/** When set, every fetch is recorded: the instruction stream. */
	trace: Trace | null = null;
	private readonly core: Uint32Array;

	constructor(opts: Pdp7Opts = {}) {
		this.coreWords = opts.coreWords ?? 8192;
		this.core = new Uint32Array(this.coreWords);
	}

	reset(): void {
		this.pc = 0;
		this.ac = 0;
		this.link = 0;
		this.mq = 0;
		this.sc = 0;
		this.ion = false;
		this.ionDefer = 0;
		this.irqLine = false;
		this.halted = false;
		this.core.fill(0);
	}

	skip(): void {
		this.pc = (this.pc + 1) & ADDR;
	}

	read(addr: number): number {
		return this.core[addr & (this.coreWords - 1)] ?? 0;
	}

	write(addr: number, word: number): void {
		this.core[addr & (this.coreWords - 1)] = maskWord(word, WORD);
	}

	deposit(addr: number, words: readonly number[]): void {
		for (let i = 0; i < words.length; i += 1) this.write(addr + i, words[i] ?? 0);
	}

	step(): Step {
		if (this.halted) return { halt: true };

		// PDP-7 program interrupt: save PC (link in the sign bit) at 0,
		// jump to 1, interrupts off. One level, no vectors.
		if (this.irqLine && this.ion && this.ionDefer === 0) {
			this.write(0, this.jmsWord());
			this.ion = false;
			this.pc = 1;
		}

		const ir = this.read(this.pc);
		this.trace?.record(this.pc, ir, this.ac);
		this.pc = (this.pc + 1) & ADDR;
		if (this.ionDefer > 0) this.ionDefer -= 1;
		return this.exec(ir, 0);
	}

	private exec(ir: number, xctCount: number): Step {
		const op = (ir >> 14) & 0o17;
		const indirect = ((ir >> 13) & 1) === 1;
		let ea = ir & ADDR;
		if (op === OP.cal) ea = 0o20; // CAL ignores the address field
		if (indirect && op <= OP.jmp) ea = this.resolveIndirect(ea);

		switch (op) {
			case OP.cal:
				// CAL (I) is exactly JMS (I) 20 on the PDP-7.
				return this.jms(ea);
			case OP.dac:
				this.write(ea, this.ac);
				return {};
			case OP.jms:
				return this.jms(ea);
			case OP.dzm:
				this.write(ea, 0);
				return {};
			case OP.lac:
				this.ac = this.read(ea);
				return {};
			case OP.xor:
				this.ac = (this.ac ^ this.read(ea)) & WMASK;
				return {};
			case OP.add: {
				// Ones' complement add with end-around carry; overflow sets link.
				const mb = this.read(ea);
				let t = (this.ac & WMASK) + mb;
				if (t > WMASK) t = (t + 1) & WMASK;
				if (((~this.ac ^ mb) & (this.ac ^ t)) & SIGN) this.link = 1;
				this.ac = t;
				return {};
			}
			case OP.tad: {
				// Twos' complement add into link'AC.
				const sum = this.lac() + this.read(ea);
				this.setLac(sum & LACMASK);
				return {};
			}
			case OP.and:
				this.ac = (this.ac & this.read(ea)) & WMASK;
				return {};
			case OP.sad:
				if (this.ac !== this.read(ea)) this.pc = (this.pc + 1) & ADDR;
				return {};
			case OP.isz: {
				const n = (this.read(ea) + 1) & WMASK;
				this.write(ea, n);
				if (n === 0) this.pc = (this.pc + 1) & ADDR;
				return {};
			}
			case OP.jmp:
				this.pc = ea;
				return {};
			case OP.xct: {
				if (xctCount >= XCT_MAX) {
					this.halted = true;
					throw new Error(`XCT chain exceeds ${XCT_MAX} at pc=${this.pc.toString(8)}`);
				}
				return this.exec(this.read(ea), xctCount + 1);
			}
			case OP.eae:
				this.eae(ir);
				return {};
			case OP.iot:
				return this.iot(ir);
			case OP.opr:
				return this.opr(ir);
			default:
				return {};
		}
	}

	/** Indirect resolution with auto-indexing: 0o10–0o17 increment before use. */
	private resolveIndirect(ma: number): number {
		let t: number;
		if ((ma & ADDR & ~0o7) === 0o10) {
			t = (this.read(ma) + 1) & WMASK;
			this.write(ma, t);
		} else {
			t = this.read(ma);
		}
		return t & ADDR;
	}

	/** JMS/CAL/interrupt save word: link in the sign bit, then PC. */
	private jmsWord(): number {
		return ((this.link & 1) << 17) | (this.pc & ADDR);
	}

	private jms(ea: number): Step {
		this.write(ea, this.jmsWord());
		this.pc = (ea + 1) & ADDR;
		return {};
	}

	// 19-bit link'AC composition, the SIMH LAC representation.
	private lac(): number {
		return ((this.link & 1) << 18) | (this.ac & WMASK);
	}

	private setLac(v: number): void {
		this.link = (v >> 18) & 1;
		this.ac = v & WMASK;
	}

	/* OPR, opcode 74; LAW, opcode 76. Port of pdp18b_cpu.c cases 036/037. */
	private opr(ir: number): Step {
		if ((ir >> 13) & 1) {
			// LAW: AC = the instruction word itself.
			this.ac = ir & WMASK;
			return {};
		}
		let lac = this.lac();
		let skp = false;

		switch ((ir >> 6) & 0o17) { // skip group, IR<8:11>
			case 0o00: break;
			case 0o01: skp = (lac & SIGN) !== 0; break; // SMA
			case 0o02: skp = (lac & WMASK) === 0; break; // SZA
			case 0o03: skp = (lac & WMASK) === 0 || (lac & SIGN) !== 0; break; // SZA|SMA
			case 0o04: skp = lac >= LINKBIT; break; // SNL
			case 0o05: skp = lac >= SIGN; break; // SNL|SMA
			case 0o06: skp = lac >= LINKBIT || lac === 0; break; // SNL|SZA
			case 0o07: skp = lac >= SIGN || lac === 0; break; // SNL|SZA|SMA
			case 0o10: skp = true; break; // SKP
			case 0o11: skp = (lac & SIGN) === 0; break; // SPA
			case 0o12: skp = (lac & WMASK) !== 0; break; // SNA
			case 0o13: skp = (lac & WMASK) !== 0 && (lac & SIGN) === 0; break; // SNA&SPA
			case 0o14: skp = lac < LINKBIT; break; // SZL
			case 0o15: skp = lac < SIGN; break; // SZL&SPA
			case 0o16: skp = lac < LINKBIT && lac !== 0; break; // SZL&SNA
			case 0o17: skp = lac < SIGN && lac !== 0; break; // SZL&SNA&SPA
		}

		switch (((ir >> 9) & 0o14) | (ir & 0o3)) { // CLA/CLL/CMA/CML, IR<5:6,16:17>
			case 0o00: break;
			case 0o01: lac = lac ^ WMASK; break; // CMA
			case 0o02: lac = lac ^ LINKBIT; break; // CML
			case 0o03: lac = lac ^ LACMASK; break; // CML CMA
			case 0o04: lac = lac & WMASK; break; // CLL
			case 0o05: lac = (lac & WMASK) ^ WMASK; break; // CLL CMA
			case 0o06: lac = lac | LINKBIT; break; // STL
			case 0o07: lac = (lac | LINKBIT) ^ WMASK; break; // CLL CML CMA
			case 0o10: lac = lac & LINKBIT; break; // CLA
			case 0o11: lac = lac | WMASK; break; // STA
			case 0o12: lac = (lac & LINKBIT) ^ LINKBIT; break; // CLA CML
			case 0o13: lac = (lac | WMASK) ^ LINKBIT; break; // CLA CML CMA
			case 0o14: lac = 0; break; // CLA CLL
			case 0o15: lac = WMASK; break; // CLA CLL CMA
			case 0o16: lac = LINKBIT; break; // CLA CLL CML
			case 0o17: lac = LACMASK; break; // CLA CLL CML CMA
		}

		if (ir & 0o4) lac |= this.switches; // OAS; LAS is CLA OAS

		switch (((ir >> 8) & 0o4) | ((ir >> 3) & 0o3)) { // rotates, IR<7,13:14>
			case 0o1: lac = ((lac << 1) | (lac >> 18)) & LACMASK; break; // RAL
			case 0o2: lac = ((lac >> 1) | (lac << 18)) & LACMASK; break; // RAR
			case 0o5: lac = ((lac << 2) | (lac >> 17)) & LACMASK; break; // RTL
			case 0o6: lac = ((lac >> 2) | (lac << 17)) & LACMASK; break; // RTR
			case 0o3:
			case 0o7:
				this.halted = true;
				throw new Error(`undefined PDP-7 rotate combination ${ir.toString(8)}`);
		}

		this.setLac(lac);
		if (ir & 0o40) this.halted = true; // HLT
		if (skp) this.pc = (this.pc + 1) & ADDR;
		return this.halted ? { halt: true } : {};
	}

	/* EAE, opcode 64. Port of pdp18b_cpu.c case 032/033. */
	private eae(ir: number): void {
		let lac = this.lac();
		let mq = this.mq;

		if (ir & 0o20000) lac = ((lac << 1) & LINKBIT) | (lac & WMASK); // AC0 to L
		if (ir & 0o10000) mq = 0; // clear MQ
		const eaeAcSign = (ir & 0o4000) !== 0 && (lac & SIGN) !== 0 ? LINKBIT : 0;
		if (ir & 0o2000) mq = (mq | lac) & WMASK; // or AC into MQ
		else if (eaeAcSign) lac = lac ^ WMASK; // |AC|
		if (ir & 0o1000) lac = lac & LINKBIT; // clear AC
		const linkInit = lac & LINKBIT;
		const fill = linkInit ? WMASK : 0;
		const esc = ir & 0o77;

		switch ((ir >> 6) & 0o7) {
			case 0: // setup (LACQ, LACS, CLQ…)
				if (ir & 0o4) mq = mq ^ WMASK;
				if (ir & 0o2) lac = lac | mq;
				if (ir & 0o1) lac = lac | ((-this.sc) & 0o77);
				break;
			case 1: { // multiply: operand is the next word
				const mb = this.read(this.pc);
				this.pc = (this.pc + 1) & ADDR;
				if (eaeAcSign) mq = mq ^ WMASK;
				lac = lac & WMASK;
				let sc = esc;
				do {
					if (mq & 1) lac = lac + mb;
					mq = (mq >> 1) | ((lac & 1) << 17);
					lac = lac >> 1;
					sc = (sc - 1) & 0o77;
				} while (sc !== 0);
				if (eaeAcSign ^ linkInit) {
					lac = lac ^ WMASK;
					mq = mq ^ WMASK;
				}
				this.sc = 0;
				break;
			}
			case 3: { // divide: operand is the next word
				const mb = this.read(this.pc);
				this.pc = (this.pc + 1) & ADDR;
				if (eaeAcSign) mq = mq ^ WMASK;
				if ((lac & WMASK) >= mb) {
					lac = (lac - mb) | LINKBIT; // overflow: set link
					this.sc = 0;
					break;
				}
				lac = lac & WMASK;
				let t = 0;
				let sc = esc;
				do {
					lac = (t ? lac + mb : lac - mb) & LACMASK;
					t = (lac >> 18) & 1;
					if (sc > 1) lac = ((lac << 1) | (mq >> 17)) & LACMASK;
					mq = ((mq << 1) | (t ^ 1)) & WMASK;
					sc = (sc - 1) & 0o77;
				} while (sc !== 0);
				if (t) lac = (lac + mb) & LACMASK;
				if (eaeAcSign) lac = lac ^ WMASK; // sign of remainder = dividend
				if (eaeAcSign ^ linkInit) mq = mq ^ WMASK;
				this.sc = 0;
				break;
			}
			case 4: { // normalize
				let sc = esc;
				while (((lac & SIGN) === ((lac << 1) & SIGN))) {
					lac = (lac << 1) | ((mq >> 17) & 1);
					mq = (mq << 1) | (linkInit >> 18);
					sc = (sc - 1) & 0o77;
					if (sc === 0) break;
				}
				lac = linkInit | (lac & WMASK);
				mq = mq & WMASK;
				this.sc = sc & 0o77;
				break;
			}
			case 5: // long right shift
				if (esc < 18) {
					mq = ((lac << (18 - esc)) | (mq >> esc)) & WMASK;
					lac = ((fill << (18 - esc)) | (lac >> esc)) & LACMASK;
				} else {
					mq = esc < 36 ? ((fill << (36 - esc)) | (lac >> (esc - 18))) & WMASK : fill;
					lac = linkInit | fill;
				}
				this.sc = 0;
				break;
			case 6: // long left shift
				if (esc < 18) {
					lac = linkInit | (((lac << esc) | (mq >> (18 - esc))) & WMASK);
					mq = ((mq << esc) | (fill >> (18 - esc))) & WMASK;
				} else {
					lac = linkInit | (esc < 36 ? ((mq << (esc - 18)) | (fill >> (36 - esc))) & WMASK : fill);
					mq = fill;
				}
				this.sc = 0;
				break;
			case 7: // AC left shift
				lac = linkInit | (esc < 18 ? ((lac << esc) | (fill >> (18 - esc))) & WMASK : fill);
				this.sc = 0;
				break;
			default:
				this.halted = true;
				throw new Error(`unimplemented EAE word ${ir.toString(8)}`);
		}

		this.setLac(lac);
		this.mq = mq & WMASK;
	}

	/* IOT, opcode 70. device = IR<6:11>, pulse = IR & 067, bit 010 = clear AC. */
	private iot(ir: number): Step {
		const device = (ir >> 6) & 0o77;
		const pulse = ir & 0o67;
		if (ir & 0o10) this.ac = 0; // clear AC before the pulse

		if (device === 0) {
			// Interrupt system lives in the CPU; clock pulses pass through.
			if (pulse === 0o02) {
				this.ion = false; // IOF
				return {};
			}
			if (pulse === 0o42) {
				this.ion = true; // ION, one-instruction delay
				this.ionDefer = 1;
				return {};
			}
		}
		return { iot: { device, pulse, ac: this.ac } };
	}
}

/** Assemble a memory-reference word. `op` is the 4-bit opcode. */
export function mr(op: number, addr: number, indirect = false): number {
	return ((op & 0o17) << 14) | (indirect ? 1 << 13 : 0) | (addr & ADDR);
}

export const pdp7 = {
	cal: OP.cal,
	dac: OP.dac,
	jms: OP.jms,
	dzm: OP.dzm,
	lac: OP.lac,
	xor: OP.xor,
	add: OP.add,
	tad: OP.tad,
	xct: OP.xct,
	isz: OP.isz,
	and: OP.and,
	sad: OP.sad,
	jmp: OP.jmp,
	iot: OP.iot,
	mr,
	iotWord(device: number, pulse = 0): number {
		return (OP.iot << 14) | ((device & 0o77) << 6) | (pulse & 0o77);
	},
	law(value: number): number {
		return (0o17 << 14) | (1 << 13) | (value & ADDR);
	},
};
