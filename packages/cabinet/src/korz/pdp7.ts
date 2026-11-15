import type { Backplane, Clock, Device, Iot, Step } from "../bus.js";
import { incr, Pdp7, type Pdp7Opts } from "../plugins/pdp7.js";
import { maskWord } from "../word.js";
import { Compiler7, T7 } from "./compile7.js";
import { type Iop, type IopBus, isKorzDevice } from "./iop.js";
import { type Dim, type Dispatchers, Sea, span, type SlotSpec } from "./korz.js";

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
	/** A read is a data read or an instruction fetch; a watch on fetches guards `access: "fetch"`. */
	{ name: "access", width: 1, names: ["read", "fetch"] },
	{ name: "device", width: 6 },
	{ name: "pulse", width: 6 },
	/** Pulse bits 060: the group a device splits its codes into. */
	{ name: "sub", width: 2 },
	/** The timed pulse being fired: IOP1, IOP2 or IOP4. */
	{ name: "iop", width: 3 },
];

/**
 * One shape for every context, so V8 keeps one hidden class. Fields named for dimensions are
 * coordinates. `cpu` is the machine the context belongs to: slots reach their machine through the
 * context, so one slot function serves every machine and V8 sees the same call targets in all of them.
 */
export type K7 = {
	cpu: KorzPdp7;
	op: number; ind: number; skp: number; cc: number; rot: number;
	addr: number; who: number; access: number; device: number; pulse: number; sub: number; iop: number; skip: number;
	ir: number; at: number; xct: number; ea: number; lac: number; value: number; ac: number;
};

const SELECTORS = ["read", "write", "ea", "exec", "skip", "cc", "rot", "iot", "iop"] as const;
type Selector = (typeof SELECTORS)[number];

/**
 * `resolve` dispatches through tables rebuilt after each install; `interpret` searches the sea
 * every time; `compile` runs compiled blocks in batches, with the resolver beneath
 * (KORZ-COMPILER.md).
 */
export type KorzPdp7Opts = Pdp7Opts & { korz?: "interpret" | "resolve" | "compile" };

/** Shared results, so a step allocates nothing. */
const RAN: Step = Object.freeze({});
const WATCH = "backplane: units that read core hear of a write before it lands";
const HALTED: Step = Object.freeze({ halt: true });

const k7 = (cpu: KorzPdp7): K7 => ({ cpu, op: 0, ind: 0, skp: 0, cc: 0, rot: 0, addr: 0, who: 0, access: 0, device: 0, pulse: 0, sub: 0, iop: 0, skip: 0,
	ir: 0, at: 0, xct: 0, ea: 0, lac: 0, value: 0, ac: 0 });

/**
 * Placement: the sea lives with the CPU. The CPU's slots are shared by every machine in the process
 * and reach their machine as `c.cpu`; device slots are still closures over their devices' bus
 * sides. A function can't be posted, so a slot installed from another worker or host arrives as a
 * module name and arguments and is built here. The generated dispatch functions are per process.
 * DESIGN.md, "Placement: what can run where".
 */
export class KorzPdp7 extends Pdp7 implements IopBus {
	readonly sea = new Sea<K7>(PDP7_DIMS);
	/** Instructions, memory and IOTs nest, so each gets its own context. */
	private readonly ix = k7(this);
	private readonly mem = k7(this);
	private readonly io = k7(this);
	private pendingIot: Iot | null = null;
	private box: Backplane | null = null;
	private readonly go = {} as Dispatchers<K7, Selector>;
	private readonly coreMask = this.coreWords - 1;
	/** With `korz: "compile"`. */
	compiler: Compiler7 | null = null;
	/** The backplane's write watch, which compiled stores call directly. */
	writeWatch: ((addr: number) => void) | null = null;
	declare runBatch?: (clock: Clock) => Step;

	constructor(opts: KorzPdp7Opts = {}) {
		super(opts);
		this.sea.install(KorzPdp7.SLOTS);
		if (opts.korz === "interpret") for (const s of SELECTORS) this.go[s] = (c) => this.sea.dispatch(s, c);
		else this.sea.bind(this.go, SELECTORS);
		if (opts.korz === "compile") {
			const once = KorzPdp7.prototype.step;
			const j = new Compiler7(this, () => once.call(this), { read: KorzPdp7.prototype.read, write: KorzPdp7.prototype.write });
			this.compiler = j;
			this.sea.install([KorzPdp7.COMPILED_WRITE]);
			this.step = () => j.step();
			this.runBatch = (k) => j.run(k);
		}
	}

	override reset(): void {
		super.reset();
		this.compiler?.flush();
	}

	/** IOP1, IOP2, IOP4 in order, for the bits of the pulse; each goes to the `iop` selector. */
	pulses(c: Iop): void {
		const p = c.pulse;
		const k = c as K7;
		if (p & 1) { k.iop = 1; this.go.iop(k); }
		if (p & 2) { k.iop = 2; this.go.iop(k); }
		if (p & 4) { k.iop = 4; this.go.iop(k); }
	}

	/** The backplane's slots go into this CPU's sea: unclaimed codes, CAF, and every device's codes. */
	attach(box: Backplane): void {
		this.box = box;
		this.sea.remove("cpu: no backplane, hand the IOT out");
		this.sea.install(backplaneSlots(this, box));
	}

	override step(): Step {
		if (this.halted) return HALTED;
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
		this.mem.access = 1;
		const ir = this.go.read(this.mem);
		this.trace?.record(at, ir, this.ac);
		this.pc = incr(this.pc);
		if (this.ionDefer > 0) this.ionDefer -= 1;
		this.pendingIot = null;
		this.execute(ir, at, 0);
		if (this.pendingIot) return { iot: this.pendingIot };
		return this.halted ? HALTED : RAN;
	}

	override read(addr: number): number {
		this.mem.addr = addr & 0o77777;
		this.mem.who = 0;
		this.mem.access = 0;
		return this.go.read(this.mem);
	}

	override write(addr: number, word: number): void {
		this.mem.addr = addr & 0o77777;
		this.mem.who = 0;
		this.mem.value = word;
		this.go.write(this.mem);
	}

	/**
	 * An observe-layer slot on `write`: the backplane hears of each write before it lands. Hearing
	 * it can run a unit that reads core through this CPU's memory context, so the slot puts the
	 * write's coordinates back before it goes on.
	 */
	override watchWrites(before: ((addr: number) => void) | null): void {
		this.sea.remove(WATCH);
		this.writeWatch = before;
		if (!before) return;
		this.sea.install([{ selector: "write", layer: "observe", by: WATCH, emit: T7.watch, run: (c, next) => {
			const { addr, value, who, access } = c;
			before(addr);
			c.addr = addr;
			c.value = value;
			c.who = who;
			c.access = access;
			return next();
		} }]);
	}

	private execute(ir: number, at: number, xct: number): void {
		const x = this.ix;
		x.ir = ir;
		x.at = at;
		x.xct = xct;
		x.op = (ir >> 14) & 0o17;
		x.ind = (ir >> 13) & 1;
		x.ea = this.go.ea(x);
		this.go.exec(x);
	}

	/** With `korz: "compile"`, the store into core also forgets the blocks compiled from the word. */
	private static readonly COMPILED_WRITE: SlotSpec<K7> = { selector: "write", by: "core", emit: T7.coreWrite, run: (c) => {
		const m = c.cpu;
		const a = c.addr & m.coreMask;
		m.core[a] = maskWord(c.value, 18);
		const j = m.compiler!;
		if (j.marks[a] !== 0) j.touch(a);
	} };

	/** Every CPU slot, built once for every machine: each reaches its machine as `c.cpu`. */
	private static readonly SLOTS: readonly SlotSpec<K7>[] = KorzPdp7.slots();

	private static slots(): SlotSpec<K7>[] {
		const direct = (c: K7): number => (c.at & BANK) | (c.ir & ADDR);
		const cal = (m: KorzPdp7): number => (m.extend ? 0o20 : (m.pc & BANK) | 0o20);
		const jms = (m: KorzPdp7, ea: number): void => {
			m.write(ea, m.jmsWord());
			m.pc = incr(ea);
		};
		const op = (name: keyof typeof OP, run: (c: K7) => void): SlotSpec<K7> =>
			({ selector: "exec", guard: { op: OP[name] }, by: name.toUpperCase(), run, emit: (T7 as Record<string, unknown>)[name] });
		const skip = (skp: number, by: string, run: (c: K7) => number): SlotSpec<K7> =>
			({ selector: "skip", guard: { skp }, by, run, emit: T7.skip(skp) });
		const cc = (cc: number, by: string, run: (c: K7) => number): SlotSpec<K7> =>
			({ selector: "cc", guard: { cc }, by, run, emit: T7.cc(cc) });
		const rot = (rot: number, by: string, run: (c: K7) => number): SlotSpec<K7> =>
			({ selector: "rot", guard: { rot }, by, run, emit: T7.rot(rot) });
		return [
			{ selector: "read", by: "core", emit: T7.coreRead, run: (c) => c.cpu.core[c.addr & c.cpu.coreMask] ?? 0 },
			{ selector: "write", by: "core", run: (c) => { c.cpu.core[c.addr & c.cpu.coreMask] = maskWord(c.value, 18); } },

			// Effective address. Direct is the base case; indirect, auto-indexing, JMP I's extend restore and CAL override it.
			{ selector: "ea", by: "direct: the address field in this word's bank", run: direct, emit: T7.direct },
			{ selector: "ea", guard: { ind: 1, op: span(0, OP.jmp + 1) }, by: "indirect, auto-indexing 10-17",
				run: (c) => c.cpu.resolveIndirect(direct(c), false), emit: T7.indirect },
			{ selector: "ea", guard: { ind: 1, op: OP.jmp }, by: "JMP I: indirect, EMIR restores extend mode",
				run: (c) => c.cpu.resolveIndirect(direct(c), true), emit: T7.jmpIndirect },
			{ selector: "ea", guard: { op: OP.cal, ind: 0 }, by: "CAL: 20, absolute in extend mode", run: (c) => cal(c.cpu), emit: T7.calEa },
			{ selector: "ea", guard: { op: OP.cal, ind: 1 }, by: "CAL I: indirect through 20",
				run: (c) => c.cpu.resolveIndirect(cal(c.cpu), false), emit: T7.calIndirect },

			op("cal", (c) => jms(c.cpu, c.ea)),
			op("dac", (c) => c.cpu.write(c.ea, c.cpu.ac)),
			op("jms", (c) => jms(c.cpu, c.ea)),
			op("dzm", (c) => c.cpu.write(c.ea, 0)),
			op("lac", (c) => { const m = c.cpu; m.ac = m.read(c.ea); }),
			op("xor", (c) => { const m = c.cpu; m.ac = (m.ac ^ m.read(c.ea)) & WMASK; }),
			op("add", (c) => {
				const m = c.cpu;
				const mb = m.read(c.ea);
				let t = (m.ac & WMASK) + mb;
				if (t > WMASK) t = (t + 1) & WMASK;
				if (((~m.ac ^ mb) & (m.ac ^ t)) & SIGN) m.link = 1;
				m.ac = t;
			}),
			op("tad", (c) => { const m = c.cpu; m.setLac((m.lac() + m.read(c.ea)) & LACMASK); }),
			op("xct", (c) => {
				const m = c.cpu;
				if (c.xct >= XCT_MAX) {
					m.halted = true;
					throw new Error(`XCT chain exceeds ${XCT_MAX} at pc=${m.pc.toString(8)}`);
				}
				m.execute(m.read(c.ea), c.ea, c.xct + 1);
			}),
			op("isz", (c) => {
				const m = c.cpu;
				const n = (m.read(c.ea) + 1) & WMASK;
				m.write(c.ea, n);
				if (n === 0) m.pc = incr(m.pc);
			}),
			op("and", (c) => { const m = c.cpu; m.ac = m.ac & m.read(c.ea) & WMASK; }),
			op("sad", (c) => { const m = c.cpu; if (m.ac !== m.read(c.ea)) m.pc = incr(m.pc); }),
			op("jmp", (c) => { c.cpu.pc = c.ea; }),
			op("eae", (c) => c.cpu.eae(c.ir)),
			op("iot", (c) => {
				const m = c.cpu;
				const io = m.io;
				io.device = (c.ir >> 6) & 0o77;
				io.pulse = c.ir & 0o67;
				io.sub = (io.pulse >> 4) & 0o3;
				io.skip = 0;
				if (c.ir & 0o10) m.ac = 0;
				io.ac = m.ac;
				m.box?.sync(io.device, io.pulse);
				m.go.iot(io);
				m.ac = io.ac;
				if (io.skip) m.pc = incr(m.pc);
			}),
			{ selector: "exec", guard: { op: OP.opr, ind: 0 }, by: "OPR: skip, then clear and complement, OAS, rotate, HLT",
				run: (c) => c.cpu.operate(c), emit: T7.opr },
			{ selector: "exec", guard: { op: OP.opr, ind: 1 }, by: "LAW: AC is the instruction word",
				run: (c) => { c.cpu.ac = c.ir & WMASK; }, emit: T7.law },

			// The operate group's skip field, IR<8:11>.
			skip(0o00, "none", () => 0),
			skip(0o01, "SMA", (c) => +((c.lac & SIGN) !== 0)),
			skip(0o02, "SZA", (c) => +((c.lac & WMASK) === 0)),
			skip(0o03, "SZA SMA", (c) => +((c.lac & WMASK) === 0 || (c.lac & SIGN) !== 0)),
			skip(0o04, "SNL", (c) => +(c.lac >= LINKBIT)),
			skip(0o05, "SNL SMA", (c) => +(c.lac >= SIGN)),
			skip(0o06, "SNL SZA", (c) => +(c.lac >= LINKBIT || c.lac === 0)),
			skip(0o07, "SNL SZA SMA", (c) => +(c.lac >= SIGN || c.lac === 0)),
			skip(0o10, "SKP", () => 1),
			skip(0o11, "SPA", (c) => +((c.lac & SIGN) === 0)),
			skip(0o12, "SNA", (c) => +((c.lac & WMASK) !== 0)),
			skip(0o13, "SNA SPA", (c) => +((c.lac & WMASK) !== 0 && (c.lac & SIGN) === 0)),
			skip(0o14, "SZL", (c) => +(c.lac < LINKBIT)),
			skip(0o15, "SZL SPA", (c) => +(c.lac < SIGN)),
			skip(0o16, "SZL SNA", (c) => +(c.lac < LINKBIT && c.lac !== 0)),
			skip(0o17, "SZL SNA SPA", (c) => +(c.lac < SIGN && c.lac !== 0)),

			// CLA, CLL, CMA, CML, IR<5:6,16:17>.
			cc(0o00, "none", (c) => c.lac),
			cc(0o01, "CMA", (c) => c.lac ^ WMASK),
			cc(0o02, "CML", (c) => c.lac ^ LINKBIT),
			cc(0o03, "CML CMA", (c) => c.lac ^ LACMASK),
			cc(0o04, "CLL", (c) => c.lac & WMASK),
			cc(0o05, "CLL CMA", (c) => (c.lac & WMASK) ^ WMASK),
			cc(0o06, "STL", (c) => c.lac | LINKBIT),
			cc(0o07, "CLL CML CMA", (c) => (c.lac | LINKBIT) ^ WMASK),
			cc(0o10, "CLA", (c) => c.lac & LINKBIT),
			cc(0o11, "STA", (c) => c.lac | WMASK),
			cc(0o12, "CLA CML", (c) => (c.lac & LINKBIT) ^ LINKBIT),
			cc(0o13, "CLA CML CMA", (c) => (c.lac | WMASK) ^ LINKBIT),
			cc(0o14, "CLA CLL", () => 0),
			cc(0o15, "CLA CLL CMA", () => WMASK),
			cc(0o16, "CLA CLL CML", () => LINKBIT),
			cc(0o17, "CLA CLL CML CMA", () => LACMASK),

			// Rotates, IR<7,13:14>.
			{ selector: "rot", by: "no rotate", run: (c) => c.lac, emit: T7.rot(0) },
			rot(0o1, "RAL", (c) => ((c.lac << 1) | (c.lac >> 18)) & LACMASK),
			rot(0o2, "RAR", (c) => ((c.lac >> 1) | (c.lac << 18)) & LACMASK),
			rot(0o5, "RTL", (c) => ((c.lac << 2) | (c.lac >> 17)) & LACMASK),
			rot(0o6, "RTR", (c) => ((c.lac >> 2) | (c.lac << 17)) & LACMASK),
			{ selector: "rot", guard: { rot: [0o3, 0o7] }, by: "undefined rotate",
				run: (c) => {
					c.cpu.halted = true;
					throw new Error(`undefined PDP-7 rotate combination ${c.ir.toString(8)}`);
				} },

			// The CPU's own IOTs are slots on the same bus as the devices, more specific than the clock's device 0.
			{ selector: "iot", by: "cpu: no backplane, hand the IOT out",
				run: (c) => { c.cpu.pendingIot = { device: c.device, pulse: c.pulse, ac: c.ac }; } },
			{ selector: "iot", guard: { device: 0, pulse: 0o02 }, by: "IOF", run: (c) => { c.cpu.ion = false; } },
			{ selector: "iot", guard: { device: 0, pulse: 0o42 }, by: "ION, after one more instruction",
				run: (c) => { c.cpu.ion = true; c.cpu.ionDefer = 1; } },
			{ selector: "iot", guard: { device: 0o77 }, by: "memory extension: SEM, EEM, EMIR, LEM",
				run: (c) => {
					const m = c.cpu;
					if (m.coreWords <= 0o20000) return;
					if (c.pulse === 0o01 && m.extend) c.skip = 1;
					else if (c.pulse === 0o02) m.extend = true;
					else if (c.pulse === 0o42) m.extend = m.emirPending = true;
					else if (c.pulse === 0o04) m.extend = false;
				} },
		];
	}

	/** The operate group is three fields decoded at once; each field is its own selector, as the microcoded bits are. */
	private operate(c: K7): void {
		const ir = c.ir;
		c.lac = this.lac();
		c.skp = (ir >> 6) & 0o17;
		const skp = this.go.skip(c);
		c.cc = ((ir >> 9) & 0o14) | (ir & 0o3);
		c.lac = this.go.cc(c);
		if (ir & 0o4) c.lac |= this.switches; // OAS; LAS is CLA OAS
		c.rot = ((ir >> 8) & 0o4) | ((ir >> 3) & 0o3);
		this.setLac(this.go.rot(c));
		if (ir & 0o40) this.halted = true; // HLT
		if (skp) this.pc = incr(this.pc);
	}
}

/**
 * The backplane as slots. An unclaimed code and an unanswered pulse do nothing; CAF clears every
 * flag; a device with `korzSlots` installs them, and any other device answers through `iot()`. A
 * patch-layer slot per device code answers with `offIot` while the device's power is off.
 */
export function backplaneSlots(cpu: KorzPdp7, box: Backplane): SlotSpec<K7>[] {
	const call = (d: Device) => (c: K7): void => {
		const reply = d.iot({ device: c.device, pulse: c.pulse, ac: c.ac });
		c.ac = reply.ac;
		if (reply.skip) c.skip = 1;
	};
	const off = (d: Device) => (c: K7, next: () => number): number | void => {
		if (d.power !== false) return next();
		const reply = d.offIot?.({ device: c.device, pulse: c.pulse, ac: c.ac }) ?? { ac: c.ac };
		c.ac = reply.ac;
		if (reply.skip) c.skip = 1;
	};
	return [
		{ selector: "iot", by: "backplane: unclaimed IOTs do nothing", run: () => {} },
		{ selector: "iop", by: "backplane: no gate answers this pulse", run: () => {} },
		{ selector: "iot", guard: { device: 0o33, pulse: 0o02 }, by: "backplane: CAF clears every flag",
			run: () => box.resetDevices() },
		...box.devices.flatMap((d): SlotSpec<K7>[] => [
			...d.iots.map((device): SlotSpec<K7> =>
				({ selector: "iot", guard: { device }, layer: "patch", by: `power: ${d.name} off`, run: off(d) })),
			...(isKorzDevice(d)
				? d.korzSlots(cpu)
				: d.iots.map((device): SlotSpec<K7> => ({ selector: "iot", guard: { device }, by: `device ${d.name}: iot()`, run: call(d) }))),
		]),
	];
}
