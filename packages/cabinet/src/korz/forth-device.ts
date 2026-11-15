import type { SlotSpec } from "./korz.js";
import type { K7, KorzPdp7 } from "./pdp7.js";

/**
 * The Forth device (FORTH-DEVICE.md): Mitch Bradley's PDP-7 Forth, run by the machine itself.
 * Same image, same core, same stacks: the device answers the CPU's fetch of NEXT. It runs thread
 * cells itself, in TypeScript, on the stacks where the kernel keeps them, and hands the CPU a
 * `JMP` to any code word it doesn't do itself, which runs on the PDP-7 and comes back through
 * NEXT as always. It answers the fetch of `find` too, from a table of names kept beside the
 * dictionary in core. Nothing in core changes, so Mitch's kernel, running the same image with
 * the device off, is the oracle (forth-device.test.ts).
 */

const W = 0o777777;
const A = 0o17777;
const SIGN = 0o400000;
const IP = 0o10;
const RP = 0o11;
const SP = 0o12;
/** NEXT's first instruction: `xct i 010`. */
const XCT_NEXT = 0o420010;
const JMP = 0o600000;
const JMP_I = 0o620000;
const LAC = 0o200000;
const LAW = 0o760000;
/** A header's count field. */
const CMASK = 0o760000;
const LINK = 0o777;

export type ForthDeviceOpts = {
	/**
	 * Thread cells the device runs for each fetch of NEXT, which is one PDP-7 cycle. The default,
	 * one, is a Forth word per memory cycle, as Chuck Moore's Novix ran them.
	 */
	cellsPerCycle?: number;
};

export type ForthDeviceStats = {
	/** Thread cells the device ran. */
	cells: number;
	/** Code words handed to the CPU. */
	handoffs: number;
	/** Fetches of NEXT the device left to the CPU: a cell it doesn't run, or NEXT patched. */
	declined: number;
	finds: number;
	/** Of those, answered from the table without walking the chain in core. */
	hits: number;
};

/** Primitives the device runs itself, by the kernel's label for their code. */
const PRIMITIVES = ["ex.body", "bran", "qbran", "xdo", "xloop", "xi", "dup", "drop", "swap", "over", "tor", "rfrom", "rat",
	"fetch", "store", "plus", "minus", "and.b", "or.b", "xor.b", "invert", "negate", "equal", "ult", "less", "zeq", "zlt",
	"star", "slash", "mod"] as const;

/** Signed 18-bit two's complement. */
const signed = (x: number): number => (x & SIGN ? x - 0o1000000 : x);

export class ForthDevice {
	readonly stats: ForthDeviceStats = { cells: 0, handoffs: 0, declined: 0, finds: 0, hits: 0 };
	private cpu: KorzPdp7 | null = null;
	private readonly cellsPerCycle: number;
	private readonly next: number;
	private readonly code: ((() => boolean) | undefined)[] = new Array(A + 1);
	/** Names to headers, newest first: count field and name words, as `find` compares them. */
	private names = new Map<string, number>();
	/** `latest`, and its header's key, when `names` was last brought up to date. */
	private namesLatest = -1;
	private namesTop = "";

	constructor(private readonly labels: ReadonlyMap<string, number>, opts: ForthDeviceOpts = {}) {
		const next = labels.get("next");
		if (next === undefined) throw new Error("the Forth device needs the kernel's labels: no 'next'");
		this.next = next;
		this.cellsPerCycle = Math.max(1, opts.cellsPerCycle ?? 1);
	}

	/** Plug in: NEXT's fetch and `find`'s first fetch become the device's. */
	install(cpu: KorzPdp7): this {
		this.remove();
		this.cpu = cpu;
		this.code.fill(undefined);
		const prims = this.primitives(cpu);
		for (const name of PRIMITIVES) {
			const at = this.labels.get(name);
			if (at !== undefined) this.code[at & A] = prims[name];
		}
		const slots: SlotSpec<K7>[] = [{
			selector: "read", guard: { addr: this.next, access: "fetch", who: "cpu" }, by: "forth device: NEXT",
			run: (_c, next) => {
				const w = next();
				return w === XCT_NEXT && !cpu.extend ? this.inner(cpu) : w;
			},
		}];
		const find = this.labels.get("find");
		const latest = this.labels.get("latest");
		const tcnt = this.labels.get("tcnt");
		const tname = this.labels.get("tname");
		const tnbp = this.labels.get("tnbp");
		if (find !== undefined && latest !== undefined && tcnt !== undefined && tname !== undefined && tnbp !== undefined) {
			/** `find`'s first instruction, `lac latest`. */
			const first = LAC | latest;
			const p = this.labels.get("p");
			slots.push({
				selector: "read", guard: { addr: find + 1, access: "fetch", who: "cpu" }, by: "forth device: FIND",
				run: (_c, next) => {
					const w = next();
					if (w !== first || cpu.extend) return w;
					const xt = this.find(cpu, latest, tcnt, tname, tnbp);
					if (xt >= 0 && p !== undefined) cpu.write(p, xt);
					cpu.ac = xt < 0 ? W : xt;
					return JMP_I | find;
				},
			});
		}
		cpu.sea.install(slots);
		this.names.clear();
		this.namesLatest = -1;
		return this;
	}

	remove(): void {
		this.cpu?.sea.remove("forth device: NEXT");
		this.cpu?.sea.remove("forth device: FIND");
		this.cpu = null;
	}

	/**
	 * NEXT, run by the device: up to `cellsPerCycle` cells, then back to NEXT. A `JMP` to a code
	 * word it doesn't run goes to the CPU with IP already stepped, as NEXT's `xct` leaves it. A cell
	 * it doesn't know, or an interrupt waiting, leaves the fetch to the CPU's own NEXT.
	 */
	private inner(m: KorzPdp7): number {
		let ran = 0;
		while (ran < this.cellsPerCycle && !(m.irqLine && m.ion)) {
			const ip = (m.read(IP) + 1) & W;
			const cell = m.read(ip & A);
			const op = cell >>> 13;
			if (op === 0) {
				// Bare address: a colon word, CAL into nest. Push IP, enter the body.
				m.write(IP, ip);
				const rp = (m.read(RP) + 1) & W;
				m.write(RP, rp);
				m.write(rp & A, ip);
				m.write(IP, (cell - 1) & W);
			} else if (op === 0o10) {
				// LAC: a constant.
				m.write(IP, ip);
				const v = m.read(cell & A);
				this.push(m, SP, v);
				m.ac = v;
			} else if ((cell & LAW) === LAW) {
				// LAW: a variable's address.
				m.write(IP, ip);
				this.push(m, SP, cell);
				m.ac = cell;
			} else if (op === 0o30) {
				// JMP: a primitive. Run it here, or hand its code to the CPU.
				m.write(IP, ip);
				const target = cell & A;
				const run = this.code[target];
				if (run === undefined || !run()) {
					this.stats.cells += ran + 1;
					this.stats.handoffs += 1;
					return JMP | target;
				}
			} else break;
			ran += 1;
		}
		this.stats.cells += ran;
		if (ran > 0) return JMP | this.next;
		this.stats.declined += 1;
		return XCT_NEXT;
	}

	private push(m: KorzPdp7, reg: number, v: number): void {
		const s = (m.read(reg) + 1) & W;
		m.write(reg, s);
		m.write(s & A, v & W);
	}

	private pop(m: KorzPdp7, reg: number): number {
		const s = m.read(reg);
		m.write(reg, (s - 1) & W);
		return m.read(s & A);
	}

	/**
	 * What each primitive does to the stacks, IP and core, as its code in kernel-names-full.s does.
	 * False: leave it to the CPU (a divide by zero), with nothing changed yet.
	 */
	private primitives(m: KorzPdp7): Record<(typeof PRIMITIVES)[number], () => boolean> {
		const rd = (a: number): number => m.read(a & A);
		const wr = (a: number, v: number): void => m.write(a & A, v & W);
		const bran = (): boolean => {
			m.write(IP, rd((m.read(IP) + 1) & W));
			return true;
		};
		const skipInline = (): void => m.write(IP, (m.read(IP) + 1) & W);
		const un = (f: (x: number) => number) => (): boolean => {
			const s = m.read(SP);
			wr(s, f(rd(s)));
			return true;
		};
		const bin = (f: (a: number, b: number) => number) => (): boolean => {
			const s = m.read(SP);
			m.write(SP, (s - 1) & W);
			wr(s - 1, f(rd(s - 1), rd(s)));
			return true;
		};
		const flag = (t: boolean): number => (t ? W : 0);
		const divide = (pick: (q: number, r: number) => number) => (): boolean => {
			const s = m.read(SP);
			const b = signed(rd(s));
			if (b === 0) return false;
			const a = signed(rd(s - 1));
			const q = Math.trunc(a / b);
			m.write(SP, (s - 1) & W);
			wr(s - 1, pick(q, a - q * b));
			return true;
		};
		return {
			"ex.body": () => {
				m.write(IP, this.pop(m, RP));
				return true;
			},
			bran,
			qbran: () => (this.pop(m, SP) === 0 ? bran() : (skipInline(), true)),
			xdo: () => {
				const index = this.pop(m, SP);
				const limit = this.pop(m, SP);
				this.push(m, RP, limit);
				this.push(m, RP, index - limit);
				return true;
			},
			xloop: () => {
				const rp = m.read(RP);
				const n = (rd(rp) + 1) & W;
				wr(rp, n);
				if (n !== 0) return bran();
				m.write(RP, (rp - 2) & W);
				skipInline();
				return true;
			},
			xi: () => {
				const rp = m.read(RP);
				this.push(m, SP, rd(rp) + rd(rp - 1));
				return true;
			},
			dup: () => {
				this.push(m, SP, rd(m.read(SP)));
				return true;
			},
			drop: () => {
				m.write(SP, (m.read(SP) - 1) & W);
				return true;
			},
			swap: () => {
				const s = m.read(SP);
				const a = rd(s - 1);
				wr(s - 1, rd(s));
				wr(s, a);
				return true;
			},
			over: () => {
				this.push(m, SP, rd(m.read(SP) - 1));
				return true;
			},
			tor: () => {
				this.push(m, RP, this.pop(m, SP));
				return true;
			},
			rfrom: () => {
				this.push(m, SP, this.pop(m, RP));
				return true;
			},
			rat: () => {
				this.push(m, SP, rd(m.read(RP)));
				return true;
			},
			fetch: un((addr) => rd(addr)),
			store: () => {
				const s = m.read(SP);
				m.write(SP, (s - 1) & W);
				wr(rd(s), rd(s - 1));
				m.write(SP, (m.read(SP) - 1) & W);
				return true;
			},
			plus: bin((a, b) => a + b),
			minus: bin((a, b) => a - b),
			"and.b": bin((a, b) => a & b),
			"or.b": bin((a, b) => a | b),
			"xor.b": bin((a, b) => a ^ b),
			invert: un((x) => ~x),
			negate: un((x) => -x),
			equal: bin((a, b) => flag(a === b)),
			ult: bin((a, b) => flag(a < b)),
			less: () => {
				// The kernel flips both sign bits in place, then compares unsigned.
				const s = m.read(SP);
				const b = rd(s) ^ SIGN;
				m.write(SP, (s - 1) & W);
				wr(s, b);
				wr(s - 1, flag((rd(s - 1) ^ SIGN) < b));
				return true;
			},
			zeq: un((x) => flag(x === 0)),
			zlt: un((x) => flag((x & SIGN) !== 0)),
			star: bin((a, b) => (a * b) % 0o1000000),
			slash: divide((q) => q),
			mod: divide((_q, r) => r),
		};
	}

	/** A header's key: its count field and its name's words, as `find` compares them. */
	private headerKey(m: KorzPdp7, h: number): string {
		const cnt = m.read(h & A) & CMASK;
		const fn = Math.max(1, Math.ceil((cnt >>> 13) / 3));
		let key = String(cnt);
		for (let i = fn; i > 0; i -= 1) key += `,${m.read((h - i) & A)}`;
		return key;
	}

	/** Headers from `from` down the chain, newest first, until `stop` or the end. False if it never met `stop`. */
	private walk(m: KorzPdp7, from: number, stop: number, out: number[]): boolean {
		let h = from;
		for (let n = 0; n < A; n += 1) {
			if (h === stop) return true;
			out.push(h);
			const link = m.read(h & A) & LINK;
			if (link === 0) return stop < 0;
			h = (h - link - 1) & A;
		}
		return false;
	}

	/**
	 * `find`, from the table: the header address of the name in tcnt, tname and tnbuf, or -1. The
	 * table follows `latest`: words defined since are added, newest first; anything else (FORGET,
	 * a dictionary rewritten under it) rebuilds it from the chain in core. A hit is checked against
	 * its header in core before it is believed.
	 */
	private find(m: KorzPdp7, latest: number, tcnt: number, tname: number, tnbp: number): number {
		this.stats.finds += 1;
		const head = m.read(latest) & A;
		const cnt = m.read(tcnt) & CMASK;
		const fn = Math.max(1, Math.ceil((cnt >>> 13) / 3));
		const buf = m.read(tnbp) & A;
		let key = `${cnt},${m.read(tname)}`;
		for (let i = 1; i < fn; i += 1) key += `,${m.read(buf + i)}`;
		const fresh = head === this.namesLatest && this.headerKey(m, head) === this.namesTop;
		if (!fresh) {
			const added: number[] = [];
			const grew = this.namesLatest >= 0 && this.walk(m, head, this.namesLatest, added);
			if (!grew) {
				this.names.clear();
				added.length = 0;
				this.walk(m, head, -1, added);
				for (let i = added.length - 1; i >= 0; i -= 1) this.names.set(this.headerKey(m, added[i]!), added[i]!);
			} else {
				for (let i = added.length - 1; i >= 0; i -= 1) this.names.set(this.headerKey(m, added[i]!), added[i]!);
			}
			this.namesLatest = head;
			this.namesTop = this.headerKey(m, head);
		} else this.stats.hits += 1;
		const xt = this.names.get(key);
		if (xt !== undefined && this.headerKey(m, xt) !== key) {
			this.namesLatest = -1;
			return this.find(m, latest, tcnt, tname, tnbp);
		}
		return xt ?? -1;
	}
}
