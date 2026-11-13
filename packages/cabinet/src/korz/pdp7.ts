import type { Backplane, Device, Iot, Step } from "../bus.js";
import { incr, Pdp7, type Pdp7Opts } from "../plugins/pdp7.js";
import { maskWord } from "../word.js";
import { type Dim, Sea, span, type SlotSpec } from "./korz.js";

/**
 * The PDP-7 as a sea of slots (KORZ-DISPATCH.md, step 1). Registers and the EAE's arithmetic come
 * from `Pdp7`; everything that decides what runs is a slot: instruction dispatch, addressing, the
 * operate group's three fields, memory, and the IOT bus, where the CPU's own IOTs and every device
 * on the backplane meet in one selector. `Pdp7` is the oracle (src/korz/pdp7.test.ts).
 */

const WMASK = 0o777777;
const SIGN = 0o400000;
const LINKBIT = 1 << 18;
const LACMASK = LINKBIT | WMASK;
const ADDR = 0o17777;
const BANK = 0o60000;
const XCT_MAX = 16;

/** IR<0:3>. */
const OP = { cal: 0o00, dac: 0o01, jms: 0o02, dzm: 0o03, lac: 0o04, xor: 0o05, add: 0o06, tad: 0o07,
	xct: 0o10, isz: 0o11, and: 0o12, sad: 0o13, jmp: 0o14, eae: 0o15, iot: 0o16, opr: 0o17 } as const;

export const PDP7_DIMS: readonly Dim[] = [
	{ name: "op", width: 4 },
	{ name: "ind", width: 1 },
	/** OPR skip group, IR<8:11>. */
	{ name: "skp", width: 4 },
	/** OPR CLA/CLL/CMA/CML, IR<5:6,16:17>. */
	{ name: "cc", width: 4 },
	/** OPR rotates, IR<7,13:14>. */
	{ name: "rot", width: 3 },
	{ name: "addr", width: 15 },
	{ name: "who", width: 2, names: ["cpu", "device", "debugger"] },
	{ name: "device", width: 6 },
	{ name: "pulse", width: 6 },
];

/** One shape for every context, so V8 keeps one hidden class. Fields named for dimensions are coordinates. */
export type K7 = {
	op: number; ind: number; skp: number; cc: number; rot: number;
	addr: number; who: number; device: number; pulse: number;
	ir: number; at: number; xct: number; ea: number; lac: number; value: number; ac: number;
};

const k7 = (): K7 => ({ op: 0, ind: 0, skp: 0, cc: 0, rot: 0, addr: 0, who: 0, device: 0, pulse: 0,
	ir: 0, at: 0, xct: 0, ea: 0, lac: 0, value: 0, ac: 0 });

export class KorzPdp7 extends Pdp7 {
	readonly sea = new Sea<K7>(PDP7_DIMS);
	/** Instructions, memory and IOTs nest, so each gets its own context. */
	private readonly ix = k7();
	private readonly mem = k7();
	private readonly io = k7();
	private pendingIot: Iot | null = null;

	constructor(opts: Pdp7Opts = {}) {
		super(opts);
		this.sea.install([...this.memorySlots(), ...this.addressingSlots(), ...this.instructionSlots(),
			...this.operateSlots(), ...this.iotSlots()]);
	}

	/** The backplane's slots go into this CPU's sea: unclaimed codes, CAF, and one slot per device code. */
	attach(box: Backplane): void {
		this.sea.remove("cpu: no backplane, hand the IOT out");
		this.sea.install(backplaneSlots(this, box));
	}

	override step(): Step {
		if (this.halted) return { halt: true };
		if (this.irqLine && this.ion && this.ionDefer === 0) {
			this.write(0, this.jmsWord());
			this.ion = false;
			this.extend = false;
			this.emirPending = false;
			this.pc = 1;
		}
		const at = this.pc;
		this.mem.addr = at;
		this.mem.who = 0;
		const ir = this.sea.dispatch("fetch", this.mem);
		this.trace?.record(at, ir, this.ac);
		this.pc = incr(this.pc);
		if (this.ionDefer > 0) this.ionDefer -= 1;
		this.pendingIot = null;
		this.execute(ir, at, 0);
		if (this.pendingIot) return { iot: this.pendingIot };
		return this.halted ? { halt: true } : {};
	}

	override read(addr: number): number {
		this.mem.addr = addr & 0o77777;
		this.mem.who = 0;
		return this.sea.dispatch("read", this.mem);
	}

	override write(addr: number, word: number): void {
		this.mem.addr = addr & 0o77777;
		this.mem.who = 0;
		this.mem.value = word;
		this.sea.dispatch("write", this.mem);
	}

	private execute(ir: number, at: number, xct: number): void {
		const x = this.ix;
		x.ir = ir;
		x.at = at;
		x.xct = xct;
		x.op = (ir >> 14) & 0o17;
		x.ind = (ir >> 13) & 1;
		x.ea = this.sea.dispatch("ea", x);
		this.sea.dispatch("exec", x);
	}

	private memorySlots(): SlotSpec<K7>[] {
		const mask = this.coreWords - 1;
		return [
			{ selector: "read", by: "core", run: (c) => this.core[c.addr & mask] ?? 0 },
			{ selector: "write", by: "core", run: (c) => { this.core[c.addr & mask] = maskWord(c.value, 18); } },
			{ selector: "fetch", by: "core: a fetch is a read", run: (c) => this.read(c.addr) },
		];
	}

	/** Effective address. Direct is the base case; indirect, auto-indexing, JMP I's extend restore and CAL override it. */
	private addressingSlots(): SlotSpec<K7>[] {
		const direct = (c: K7): number => (c.at & BANK) | (c.ir & ADDR);
		const cal = (): number => (this.extend ? 0o20 : (this.pc & BANK) | 0o20);
		return [
			{ selector: "ea", by: "direct: the address field in this word's bank", run: direct },
			{ selector: "ea", guard: { ind: 1, op: span(0, OP.jmp + 1) }, by: "indirect, auto-indexing 10-17",
				run: (c) => this.resolveIndirect(direct(c), false) },
			{ selector: "ea", guard: { ind: 1, op: OP.jmp }, by: "JMP I: indirect, EMIR restores extend mode",
				run: (c) => this.resolveIndirect(direct(c), true) },
			{ selector: "ea", guard: { op: OP.cal, ind: 0 }, by: "CAL: 20, absolute in extend mode", run: cal },
			{ selector: "ea", guard: { op: OP.cal, ind: 1 }, by: "CAL I: indirect through 20",
				run: () => this.resolveIndirect(cal(), false) },
		];
	}

	private instructionSlots(): SlotSpec<K7>[] {
		const op = (name: keyof typeof OP, run: (c: K7) => void): SlotSpec<K7> =>
			({ selector: "exec", guard: { op: OP[name] }, by: name.toUpperCase(), run });
		const jms = (ea: number): void => {
			this.write(ea, this.jmsWord());
			this.pc = incr(ea);
		};
		return [
			op("cal", (c) => jms(c.ea)),
			op("dac", (c) => this.write(c.ea, this.ac)),
			op("jms", (c) => jms(c.ea)),
			op("dzm", (c) => this.write(c.ea, 0)),
			op("lac", (c) => { this.ac = this.read(c.ea); }),
			op("xor", (c) => { this.ac = (this.ac ^ this.read(c.ea)) & WMASK; }),
			op("add", (c) => {
				const mb = this.read(c.ea);
				let t = (this.ac & WMASK) + mb;
				if (t > WMASK) t = (t + 1) & WMASK;
				if (((~this.ac ^ mb) & (this.ac ^ t)) & SIGN) this.link = 1;
				this.ac = t;
			}),
			op("tad", (c) => this.setLac((this.lac() + this.read(c.ea)) & LACMASK)),
			op("xct", (c) => {
				if (c.xct >= XCT_MAX) {
					this.halted = true;
					throw new Error(`XCT chain exceeds ${XCT_MAX} at pc=${this.pc.toString(8)}`);
				}
				this.execute(this.read(c.ea), c.ea, c.xct + 1);
			}),
			op("isz", (c) => {
				const n = (this.read(c.ea) + 1) & WMASK;
				this.write(c.ea, n);
				if (n === 0) this.pc = incr(this.pc);
			}),
			op("and", (c) => { this.ac = this.ac & this.read(c.ea) & WMASK; }),
			op("sad", (c) => { if (this.ac !== this.read(c.ea)) this.pc = incr(this.pc); }),
			op("jmp", (c) => { this.pc = c.ea; }),
			op("eae", (c) => this.eae(c.ir)),
			op("iot", (c) => {
				const io = this.io;
				io.device = (c.ir >> 6) & 0o77;
				io.pulse = c.ir & 0o67;
				if (c.ir & 0o10) this.ac = 0;
				io.ac = this.ac;
				this.ac = this.sea.dispatch("iot", io);
			}),
			{ selector: "exec", guard: { op: OP.opr, ind: 0 }, by: "OPR: skip, then clear and complement, OAS, rotate, HLT",
				run: (c) => this.operate(c) },
			{ selector: "exec", guard: { op: OP.opr, ind: 1 }, by: "LAW: AC is the instruction word",
				run: (c) => { this.ac = c.ir & WMASK; } },
		];
	}

	/** The operate group is three fields decoded at once; each field is its own selector, as the microcoded bits are. */
	private operate(c: K7): void {
		const ir = c.ir;
		c.lac = this.lac();
		c.skp = (ir >> 6) & 0o17;
		const skp = this.sea.dispatch("skip", c);
		c.cc = ((ir >> 9) & 0o14) | (ir & 0o3);
		c.lac = this.sea.dispatch("cc", c);
		if (ir & 0o4) c.lac |= this.switches; // OAS; LAS is CLA OAS
		c.rot = ((ir >> 8) & 0o4) | ((ir >> 3) & 0o3);
		this.setLac(this.sea.dispatch("rot", c));
		if (ir & 0o40) this.halted = true; // HLT
		if (skp) this.pc = incr(this.pc);
	}

	private operateSlots(): SlotSpec<K7>[] {
		const skips: [string, (l: number) => boolean][] = [
			["none", () => false], ["SMA", (l) => (l & SIGN) !== 0], ["SZA", (l) => (l & WMASK) === 0],
			["SZA SMA", (l) => (l & WMASK) === 0 || (l & SIGN) !== 0], ["SNL", (l) => l >= LINKBIT],
			["SNL SMA", (l) => l >= SIGN], ["SNL SZA", (l) => l >= LINKBIT || l === 0],
			["SNL SZA SMA", (l) => l >= SIGN || l === 0], ["SKP", () => true], ["SPA", (l) => (l & SIGN) === 0],
			["SNA", (l) => (l & WMASK) !== 0], ["SNA SPA", (l) => (l & WMASK) !== 0 && (l & SIGN) === 0],
			["SZL", (l) => l < LINKBIT], ["SZL SPA", (l) => l < SIGN], ["SZL SNA", (l) => l < LINKBIT && l !== 0],
			["SZL SNA SPA", (l) => l < SIGN && l !== 0],
		];
		const clears: [string, (l: number) => number][] = [
			["none", (l) => l], ["CMA", (l) => l ^ WMASK], ["CML", (l) => l ^ LINKBIT], ["CML CMA", (l) => l ^ LACMASK],
			["CLL", (l) => l & WMASK], ["CLL CMA", (l) => (l & WMASK) ^ WMASK], ["STL", (l) => l | LINKBIT],
			["CLL CML CMA", (l) => (l | LINKBIT) ^ WMASK], ["CLA", (l) => l & LINKBIT], ["STA", (l) => l | WMASK],
			["CLA CML", (l) => (l & LINKBIT) ^ LINKBIT], ["CLA CML CMA", (l) => (l | WMASK) ^ LINKBIT],
			["CLA CLL", () => 0], ["CLA CLL CMA", () => WMASK], ["CLA CLL CML", () => LINKBIT], ["CLA CLL CML CMA", () => LACMASK],
		];
		const rotate = (name: string, rot: number, f: (l: number) => number): SlotSpec<K7> =>
			({ selector: "rot", guard: { rot }, by: name, run: (c) => f(c.lac) & LACMASK });
		return [
			...skips.map(([name, f], skp): SlotSpec<K7> => ({ selector: "skip", guard: { skp }, by: name, run: (c) => +f(c.lac) })),
			...clears.map(([name, f], cc): SlotSpec<K7> => ({ selector: "cc", guard: { cc }, by: name, run: (c) => f(c.lac) })),
			{ selector: "rot", by: "no rotate", run: (c) => c.lac },
			rotate("RAL", 0o1, (l) => (l << 1) | (l >> 18)),
			rotate("RAR", 0o2, (l) => (l >> 1) | (l << 18)),
			rotate("RTL", 0o5, (l) => (l << 2) | (l >> 17)),
			rotate("RTR", 0o6, (l) => (l >> 2) | (l << 17)),
			{ selector: "rot", guard: { rot: [0o3, 0o7] }, by: "undefined rotate",
				run: (c) => {
					this.halted = true;
					throw new Error(`undefined PDP-7 rotate combination ${c.ir.toString(8)}`);
				} },
		];
	}

	/** The CPU's own IOTs are slots on the same bus as the devices, more specific than the clock's device 0. */
	private iotSlots(): SlotSpec<K7>[] {
		return [
			{ selector: "iot", by: "cpu: no backplane, hand the IOT out",
				run: (c) => { this.pendingIot = { device: c.device, pulse: c.pulse, ac: c.ac }; return c.ac; } },
			{ selector: "iot", guard: { device: 0, pulse: 0o02 }, by: "IOF", run: (c) => { this.ion = false; return c.ac; } },
			{ selector: "iot", guard: { device: 0, pulse: 0o42 }, by: "ION, after one more instruction",
				run: (c) => { this.ion = true; this.ionDefer = 1; return c.ac; } },
			{ selector: "iot", guard: { device: 0o77 }, by: "memory extension: SEM, EEM, EMIR, LEM",
				run: (c) => {
					if (this.coreWords <= 0o20000) return c.ac;
					if (c.pulse === 0o01 && this.extend) this.pc = incr(this.pc);
					else if (c.pulse === 0o02) this.extend = true;
					else if (c.pulse === 0o42) this.extend = this.emirPending = true;
					else if (c.pulse === 0o04) this.extend = false;
					return c.ac;
				} },
		];
	}
}

/** The backplane as slots: an unclaimed code does nothing, CAF clears every flag, each device answers its codes. */
export function backplaneSlots(cpu: KorzPdp7, box: Backplane): SlotSpec<K7>[] {
	const call = (d: Device) => (c: K7): number => {
		const req = { device: c.device, pulse: c.pulse, ac: c.ac };
		const reply = d.power === false ? d.offIot?.(req) ?? { ac: c.ac } : d.iot(req);
		if (reply.skip) cpu.skip();
		return reply.ac;
	};
	return [
		{ selector: "iot", by: "backplane: unclaimed IOTs do nothing", run: (c) => c.ac },
		{ selector: "iot", guard: { device: 0o33, pulse: 0o02 }, by: "backplane: CAF clears every flag",
			run: (c) => { box.resetDevices(); return c.ac; } },
		...box.devices.flatMap((d) => d.iots.map((device): SlotSpec<K7> =>
			({ selector: "iot", guard: { device }, by: `device ${d.name}`, run: call(d) }))),
	];
}
