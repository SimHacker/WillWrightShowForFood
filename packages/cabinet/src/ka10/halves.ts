import { BIT17_N, BYTI, CONI, CONO, CRY0, CRY1, DATAI, DATAO, FLTOVR, FLTUND, NODIV, ONEP, OVR, PURE, USER, USERIO, oct, type DevIo } from "./defs.js";
import { Events, type Unit } from "./events.js";
import { exactFloat, type FloatStore, type FloatUnit } from "./float.js";
import { Ka10, type HistEntry, type Ka10State, type Stop } from "./ka10.js";

/*
 * Words here are numbers below 2^36, exact in a double. Core is two Uint32Arrays of 18-bit halves,
 * the layout of the Korz rungs. The bitwise operators work on 32 bits, so logic goes through
 * halves: `x & RM` is the right half of any integer below 2^53, because ToInt32 keeps the low 32
 * bits, and LH(x) is bits 18 to 35.
 */
const TWO18 = 262144;
const TWO35 = 34359738368;
const TWO36 = 68719476736;
const RM = 0o777777;
const RSIGN = 0o400000;
const FMASK = TWO36 - 1;
const CMASK = TWO35 - 1;
const SMASK = TWO35;
const POW2: readonly number[] = Array.from({ length: 73 }, (_, i) => 2 ** i);

const LH = (x: number): number => (x / TWO18) & RM;
const m36 = (x: number): number => LH(x) * TWO18 + (x & RM);
const neg = (x: number): boolean => (LH(x) & RSIGN) !== 0;
const c1 = (x: number): boolean => ((x / TWO36) & 1) !== 0;
const lo35 = (x: number): number => (LH(x) & 0o377777) * TWO18 + (x & RM);
const and = (a: number, b: number): number => (LH(a) & LH(b)) * TWO18 + (a & b & RM);
const or = (a: number, b: number): number => (LH(a) | LH(b)) * TWO18 + ((a | b) & RM);
const xor = (a: number, b: number): number => (LH(a) ^ LH(b)) * TWO18 + ((a ^ b) & RM);
const CM = (x: number): number => FMASK - x;
const CCM = (x: number): number => CMASK - lo35(x);
const SWAP = (x: number): number => (x & RM) * TWO18 + LH(x);
/** Shift a 36-bit word left by 0 to 36, dropping what passes bit 35. */
const shl36 = (x: number, n: number): number => (n >= 36 ? 0 : (x % POW2[36 - n]!) * POW2[n]!);
const shr = (x: number, n: number): number => Math.floor(x / POW2[n]!);

const HIST_PC2 = 0x80000000;

/** The SIMH port, as the halves switch's coprocessor: its memory is the halves switch's. */
class Coprocessor extends Ka10 {
	constructor(private readonly host: Ka10Halves) {
		super({ memWords: 16, its: true, mpx: false });
	}

	override memRead(flag: number, cur: number, fetch: number, mod: number): boolean {
		const h = this.host;
		if (this.AB < 0o20 && !(h.its && (h.xct_flag & 1) !== 0 && !cur)) {
			this.MB = this.FM[this.AB]!;
			h.MB = Number(this.MB);
			if (fetch === 0) h.histMb(h.MB);
			return false;
		}
		h.AB = this.AB;
		if (h.memRead(flag, cur, fetch, mod)) return true;
		this.MB = BigInt(h.MB);
		return false;
	}

	override memWrite(flag: number, cur: number): boolean {
		const h = this.host;
		if (this.AB < 0o20 && !(h.its && (h.xct_flag & 2) !== 0 && !cur)) {
			this.FM[this.AB] = this.MB;
			return false;
		}
		h.AB = this.AB;
		h.MB = Number(this.MB & 0o777777777777n);
		return h.memWrite(flag, cur);
	}

	override checkAprIrq(): void {
		this.host.FLAGS = this.FLAGS;
		this.host.checkAprIrq();
	}
}

/** The floating instructions: 130 to 177 less the byte instructions. */
const isFloat = (ir: number): boolean => ir >= 0o130 && ir <= 0o177 && (ir < 0o133 || ir > 0o137);

/** Opcodes the halves switch still hands to the SIMH port: ASHC, whose overflow test leans on C's 64-bit shifts, and floating point when no unit is plugged in. */
const onCoprocessor = (ir: number): boolean => ir === 0o244;

/**
 * A KA10 with MIT's pager and multiplex, written by hand in halves. It follows the SIMH port
 * (ka10.ts) step for step, memory reference for memory reference, so the two run in lockstep and
 * their event queues tick together; it differs in how a word is held. Instructions that need
 * more than 53 bits in the middle (floating point, MUL, DIV and the double shifts) still run on
 * the SIMH port, as a coprocessor, until they are written here.
 */
export class Ka10Halves {
	readonly memWords: number;
	readonly its: boolean;
	readonly mpx: boolean;
	readonly L: Uint32Array;
	readonly R: Uint32Array;
	readonly FM = new Float64Array(16);
	readonly events = new Events();
	private readonly devTab: ((dev: number, data: number) => number)[] = [];
	private readonly resets: (() => void)[] = [];
	private readonly cop: Coprocessor;
	/** Instructions handed to the coprocessor, by opcode. */
	readonly coprocessed = new Float64Array(0o1000);
	/** The floating point unit, a dimension of the machine: undefined hands floating instructions to the SIMH port. */
	float: FloatUnit | undefined;

	AR = 0;
	MQ = 0;
	BR = 0;
	AD = 0;
	MB = 0;
	AB = 0;
	PC = 0;
	IR = 0;
	AC = 0;
	FLAGS = 0;
	SW = 0;
	MI = 0;
	MI_flag = 0;
	BYF5 = 0;
	uuo_cycle = 0;
	SC = 0;
	SCAD = 0;
	FE = 0;
	last_addr = 0;
	Pl = 0o1777;
	Ph = 0o1777;
	Rl = 0;
	Rh = 0;
	Pflag = 0;
	twoseg = true;
	push_ovf = 0;
	mem_prot = 0;
	nxm_flag = 0;
	nxm_stop = 0;
	adr_flag = 0;
	adr_cond = 0;
	AS = 0;
	clk_flg = 0;
	ov_irq = 0;
	fov_irq = 0;
	IOB_PI = 0;
	PIR = 0;
	PIH = 0;
	PIE = 0;
	pi_cycle = 0;
	pi_enable = 0;
	parity_irq = 0;
	pi_pending = 0;
	pi_enc = 0;
	apr_irq = 0;
	clk_en = 0;
	clk_irq = 0;
	pi_restore = 0;
	pi_hold = 0;
	modify = 0;
	xct_flag = 0;
	pi_vect = 0;
	readonly e_tlb = new Uint32Array(512);
	readonly u_tlb = new Uint32Array(546);
	page_enable = 0;
	ac_stack = 0;
	pag_reload = 0;
	fault_data = 0;
	mpx_enable = 0;
	dbr1 = 0;
	dbr2 = 0;
	dbr3 = 0;
	jpc = 0;
	age = 0;
	fault_addr = 0;
	opc = 0;
	mar = 0;
	qua_time = 0;
	maoff = 0;
	watch_stop = 0;
	readonly dev_irq = new Uint16Array(128);

	private f_load_pc = 1;
	private f_inst_fetch = 1;
	private f_pc_inh = 0;
	private pi_rq = 0;
	private pi_ov = 0;
	private one_p_arm = 0;
	private IA = 0;
	private nrf = 0;
	private fxu_hold_set = 0;
	private flag1 = 0;
	private flag3 = 0;
	private f = 0;

	halted = false;
	instructions = 0;
	readonly breakpoints = new Set<number>();
	private broke = false;
	private hist: HistEntry[] = [];
	private histLen = 0;
	private histP = 0;

	readonly rtc: Unit = { name: "rtc", svc: () => this.rtcSrv() };
	readonly qua: Unit = { name: "qua", svc: () => this.quaSrv() };
	tmxrPoll = 0;
	rtcTps = 60;

	constructor(opts: { memWords?: number; its?: boolean; mpx?: boolean; float?: FloatUnit | undefined } = {}) {
		this.float = "float" in opts ? opts.float : exactFloat;
		this.memWords = opts.memWords ?? 256 * 1024;
		this.its = opts.its ?? true;
		this.mpx = opts.mpx ?? this.its;
		this.L = new Uint32Array(this.memWords);
		this.R = new Uint32Array(this.memWords);
		for (let i = 0; i < 128; i++) this.devTab[i] = (dev) => ((dev & 3) === CONI || (dev & 3) === DATAI ? 0 : this.AR);
		this.devTab[0] = (dev, data) => this.devApr(dev, data);
		this.devTab[1] = (dev, data) => this.devPi(dev, data);
		this.tmxrPoll = Math.floor((1_000_000 / this.rtcTps) * this.events.ticksPerUsec) / 2;
		this.cop = new Coprocessor(this);
	}

	attachDevice(devcode: number, io: DevIo, reset?: () => void): void {
		this.devTab[devcode >> 2] = (dev, data) => Number(BigInt.asUintN(53, io(dev, BigInt(data))));
		if (reset) this.resets.push(reset);
	}

	resetDevices(): void {
		for (const r of this.resets) r();
	}

	reset(): void {
		this.BYF5 = this.uuo_cycle = 0;
		this.Pl = this.Ph = 0o1777;
		this.Rl = this.Rh = this.Pflag = 0;
		this.push_ovf = this.mem_prot = 0;
		this.page_enable = 0;
		this.adr_flag = 0;
		this.MI_flag = this.nxm_flag = this.clk_flg = 0;
		this.IOB_PI = this.PIR = this.PIH = this.PIE = this.pi_enable = this.parity_irq = 0;
		this.pi_pending = this.pi_enc = this.apr_irq = 0;
		this.ov_irq = this.fov_irq = this.clk_en = this.clk_irq = 0;
		this.pi_restore = this.pi_hold = 0;
		this.FLAGS = 0;
		this.ac_stack = 0;
		this.dev_irq.fill(0);
		this.e_tlb.fill(0);
		this.u_tlb.fill(0);
		this.events.activate(this.rtc, 1000);
		this.mpx_enable = 0;
		this.halted = false;
		this.f_load_pc = 1;
		this.f_inst_fetch = 1;
		this.pi_cycle = 0;
		this.pi_rq = 0;
		this.pi_ov = 0;
		this.resetDevices();
	}

	setHistory(n: number): void {
		this.histLen = n;
		this.histP = 0;
		this.hist = n ? Array.from({ length: n }, () => ({ pc: 0, ea: 0, ir: 0n, ac: 0n, flags: 0, mb: 0n, fmb: 0n, second: false })) : [];
	}

	showHistory(count = this.histLen): string[] {
		const out: string[] = [];
		let di = this.histP - count;
		if (di < 0) di += this.histLen;
		for (let k = 0; k < count; k++) {
			const h = this.hist[++di % this.histLen]!;
			if (!h.pc) continue;
			const ir = h.second ? "" : oct(h.ir, 12);
			out.push(`${oct(h.pc & 0o777777, 6)}   ${oct(h.ac, 12)}  ${oct(h.ea, 6)}     ${oct(h.mb, 12)}  ${oct(h.fmb, 12)}  ${oct(h.flags, 6)}  ${ir}`.trimEnd());
		}
		return out;
	}

	/** Record a data read in the history, as SIMH's Mem_read does. */
	histMb(v: number): void {
		if (this.histLen) this.hist[this.histP]!.mb = BigInt(v);
	}

	// ---- interrupts ---------------------------------------------------------

	setInterrupt(dev: number, lvl: number): void {
		lvl &= 7;
		if (lvl) {
			this.dev_irq[dev >> 2] = 0o200 >> lvl;
			this.pi_pending = 1;
			this.IOB_PI |= 0o200 >> lvl;
		}
	}

	clrInterrupt(dev: number): void {
		this.dev_irq[dev >> 2] = 0;
		let lvl = 0;
		for (let i = 0; i < 128; i++) lvl |= this.dev_irq[i]!;
		this.IOB_PI = lvl;
	}

	private checkIrqLevel(): number {
		if (this.xct_flag !== 0) return 0;
		if (this.pi_enable === 0) {
			if (this.PIR !== 0) {
				this.pi_enc = 1;
				for (let lvl = 0o100; lvl !== 0; lvl >>= 1) {
					if (lvl & this.PIH) break;
					if (this.PIR & lvl) return 1;
					this.pi_enc++;
				}
			}
			return 0;
		}
		let lvl = this.IOB_PI;
		if (lvl === 0) this.pi_pending = 0;
		const pi_req = (lvl & this.PIE) | this.PIR;
		if (this.mpx_enable && this.mpx && pi_req & 0o100 && (this.PIH & 0o100) === 0) {
			this.pi_enc = 0o10;
			for (let i = 0; i < 128; i++) {
				if (this.dev_irq[i]! & 0o100) {
					const l = this.dev_irq[i]! >> 8;
					if (l !== 0 && l < this.pi_enc) this.pi_enc = l;
				}
			}
			if (this.pi_enc !== 0o10) {
				this.pi_enc += 0o10;
				return 1;
			}
		}
		let i = 1;
		for (lvl = 0o100; lvl !== 0; lvl >>= 1, i++) {
			if (lvl & this.PIH) break;
			if (pi_req & lvl) {
				this.pi_enc = i;
				return 1;
			}
		}
		return 0;
	}

	private restorePiHold(): void {
		if (!this.pi_enable) return;
		for (let lvl = 0o100; lvl !== 0; lvl >>= 1) {
			if (lvl & this.PIH) {
				this.PIR &= ~lvl;
				this.PIH &= ~lvl;
				break;
			}
		}
		this.pi_pending = 1;
	}

	private setPiHold(): void {
		let pi = this.pi_enc;
		if (this.mpx_enable && this.mpx && pi > 7) pi = 1;
		this.PIR &= ~(0o200 >> pi);
		if (this.pi_enable) this.PIH |= 0o200 >> pi;
	}

	private devPi(dev: number, data: number): number {
		switch (dev & 3) {
			case CONO: {
				const res = data & RM;
				if (res & 0o10000) {
					this.PIR = this.PIH = this.PIE = 0;
					this.pi_enable = 0;
					this.mpx_enable = 0;
					this.parity_irq = 0;
				}
				if (res & 0o200) this.pi_enable = 1;
				if (res & 0o400) this.pi_enable = 0;
				if (res & 0o1000) this.PIE &= ~(res & 0o177);
				if (res & 0o2000) this.PIE |= res & 0o177;
				if (res & 0o4000) {
					this.PIR |= res & 0o177;
					this.pi_pending = 1;
				}
				if (res & 0o20000 && this.mpx) this.mpx_enable = 1;
				if (res & 0o40000) this.parity_irq = 1;
				if (res & 0o100000) this.parity_irq = 0;
				this.checkAprIrq();
				return data;
			}
			case CONI:
				return this.PIE | (this.pi_enable << 7) | (this.PIH << 8) | (this.parity_irq << 15);
			case DATAO:
				this.MI = data;
				this.MI_flag = 1;
				return data;
			default:
				return data;
		}
	}

	checkAprIrq(): void {
		if (this.nxm_stop && this.nxm_flag) this.halted = true;
		if (this.pi_enable && this.apr_irq) {
			let flg = 0;
			this.clrInterrupt(0);
			flg |= ((this.FLAGS & OVR) !== 0 ? 1 : 0) & this.ov_irq;
			flg |= ((this.FLAGS & FLTOVR) !== 0 ? 1 : 0) & this.fov_irq;
			flg |= this.nxm_flag | this.mem_prot | this.push_ovf | this.adr_flag;
			if (flg) this.setInterrupt(0, this.apr_irq);
		}
	}

	private devApr(dev: number, data: number): number {
		switch (dev & 3) {
			case CONI: {
				let res = this.apr_irq | (((this.FLAGS & OVR) !== 0 ? 1 : 0) << 3) | (this.ov_irq << 4);
				res |= (((this.FLAGS & FLTOVR) !== 0 ? 1 : 0) << 6) | (this.fov_irq << 7);
				res |= (this.clk_flg << 9) | (this.clk_en << 10) | (this.nxm_flag << 12);
				res |= (this.mem_prot << 13) | (((this.FLAGS & USERIO) !== 0 ? 1 : 0) << 15);
				res |= (this.adr_flag << 14) | (this.push_ovf << 16) | (this.maoff >> 1);
				return res;
			}
			case CONO: {
				const res = data & RM;
				this.clk_irq = this.apr_irq = res & 7;
				this.clrInterrupt(0);
				if (res & 0o10) this.FLAGS &= ~OVR;
				if (res & 0o20) this.ov_irq = 1;
				if (res & 0o40) this.ov_irq = 0;
				if (res & 0o100) this.FLAGS &= ~FLTOVR;
				if (res & 0o200) this.fov_irq = 1;
				if (res & 0o400) this.fov_irq = 0;
				if (res & 0o1000) {
					this.clk_flg = 0;
					this.clrInterrupt(4);
				}
				if (res & 0o2000) {
					this.clk_en = 1;
					if (this.clk_flg) this.setInterrupt(4, this.clk_irq);
				}
				if (res & 0o4000) {
					this.clk_en = 0;
					this.clrInterrupt(4);
				}
				if (res & 0o10000) this.nxm_flag = 0;
				if (res & 0o20000) this.mem_prot = 0;
				if (res & 0o40000) this.adr_flag = 0;
				if (res & 0o200000) {
					this.mpx_enable = 0;
					this.resetDevices();
				}
				if (res & 0o400000) this.push_ovf = 0;
				this.checkAprIrq();
				return data;
			}
			case DATAO: {
				const lh = LH(data);
				this.Rh = ((data >> 1) & 0o377) << 10;
				this.Rl = (shr(data, 10) & 0o377) << 10;
				this.Pflag = lh & 1;
				this.Ph = (((lh >> 1) & 0o377) << 10) + 0o1777;
				this.Pl = (((lh >> 10) & 0o377) << 10) + 0o1777;
				return data;
			}
			default:
				return this.SW;
		}
	}

	// ---- clocks ---------------------------------------------------------------

	private rtcSrv(): void {
		this.events.activateAfter(this.rtc, 1_000_000 / this.rtcTps);
		this.tmxrPoll = Math.floor(((1_000_000 / this.rtcTps) * this.events.ticksPerUsec) / 2);
		this.clk_flg = 1;
		if (this.clk_en) this.setInterrupt(4, this.clk_irq);
	}

	private quaSrv(): void {
		if ((this.fault_data & 1) === 0 && this.pi_enable && !this.pi_pending && (this.FLAGS & USER) !== 0) {
			this.mem_prot = 1;
			this.checkAprIrq();
		}
		this.qua_time = BIT17_N;
	}

	private setQuantum(): void {
		this.events.cancel(this.qua);
		if (this.qua_time & BIT17_N) return;
		this.events.activateAfter(this.qua, BIT17_N - this.qua_time);
	}

	private getQuantum(): number {
		let t = this.qua_time;
		if (this.events.isActive(this.qua)) {
			const us = Math.floor(this.events.usecsLeft(this.qua));
			t = (BIT17_N - us) & RM;
		}
		return t;
	}

	// ---- memory -----------------------------------------------------------------

	private rd(a: number): number {
		return this.L[a]! * TWO18 + this.R[a]!;
	}

	private wr(a: number, v: number): void {
		this.L[a] = LH(v);
		this.R[a] = v & RM;
	}

	private getReg(r: number): number {
		return this.FM[r & 0o17]!;
	}

	private setReg(r: number, v: number): void {
		this.FM[r & 0o17] = v;
	}

	private itsLoadTlb(reg: number, page: number, tlb: Uint32Array, idx: number): boolean {
		const len = (reg >>> 19) & 0o177;
		const entry = (reg & 0o1777777) + ((page & 0o377) >> 1);
		if (page >> 1 > len) {
			this.fault_data |= 0o200;
			return true;
		}
		if (entry >= this.memWords) {
			this.nxm_flag = 1;
			this.fault_data |= 0o400;
			this.checkAprIrq();
			return true;
		}
		this.events.now++;
		let half: number;
		if (page & 1) {
			half = (this.R[entry]! & ~0o36000) | ((this.age & 0o17) << 10);
			this.R[entry] = half;
		} else {
			half = (this.L[entry]! & ~0o36000) | ((this.age & 0o17) << 10);
			this.L[entry] = half;
		}
		tlb[idx] = half;
		this.pag_reload = (this.pag_reload + 1) & 0o17;
		return false;
	}

	private pageLookupIts(addr: number, flag: number, wr: number, cur_context: number, fetch: number, modify: number): number {
		let data = 0;
		const page = (RM & addr) >> 10;
		let uf = (this.FLAGS & USER) !== 0 ? 1 : 0;
		const fstr = (this.fault_data & 0o770) === 0;
		let loc = 0;

		if (this.adr_cond && addr === this.AS) this.checkAprIrq();
		if (!this.page_enable) return addr;

		if (flag) uf = 0;
		else if (this.xct_flag !== 0 && !cur_context) {
			if (((this.xct_flag & 2) !== 0 && wr !== 0) || ((this.xct_flag & 1) !== 0 && (wr === 0 || modify))) uf = 1;
		}
		wr |= modify;

		const marl = LH(this.mar);
		if (addr === (this.mar & RM) && uf === ((marl & 4) !== 0 ? 1 : 0)) {
			switch (marl & 3) {
				case 0:
					break;
				case 1:
					if (fetch) {
						this.mem_prot = 1;
						this.fault_data |= 2;
						this.checkAprIrq();
					}
					break;
				case 2:
					if (!wr) break;
				// falls through
				case 3:
					this.mem_prot = 1;
					this.fault_data |= 2;
					this.checkAprIrq();
					break;
			}
		}

		let faulted = false;
		if (!uf) {
			if ((page & 0o200) === 0 || (this.fault_data & 4) === 0) return addr;
			data = this.e_tlb[page - 0o200]!;
			if (data === 0) {
				if (this.itsLoadTlb(this.dbr3, page - 0o200, this.e_tlb, page - 0o200)) faulted = true;
				else data = this.e_tlb[page - 0o200]!;
			}
		} else {
			data = this.u_tlb[page]!;
			if (data === 0) {
				if (page & 0o200) {
					if (this.itsLoadTlb(this.dbr2, page - 0o200, this.u_tlb, page)) faulted = true;
				} else if (this.itsLoadTlb(this.dbr1, page, this.u_tlb, page)) faulted = true;
				if (!faulted) data = this.u_tlb[page]!;
			}
		}
		if (!faulted) {
			loc = ((data & 0o1777) << 10) + (addr & 0o1777);
			switch ((data >> 16) & 3) {
				case 0:
					this.fault_data |= 0o10;
					break;
				case 1:
					if (!wr) return loc;
					if ((this.fault_data & 0o770) === 0) this.fault_data |= 0o100;
					break;
				case 2:
					if (fetch && this.FLAGS & PURE) {
						this.fault_data |= 0o20;
						break;
					}
					if (!wr) return loc;
					if ((this.fault_data & 0o770) === 0) this.fault_data |= 0o40;
					break;
				case 3:
					if (fetch && this.FLAGS & PURE) {
						this.fault_data |= 0o20;
						break;
					}
					return loc;
			}
		}
		if (fstr) this.fault_addr = page | (uf ? 0o400 : 0) | ((data & 0o1777) << 9);
		if ((this.xct_flag & 4) === 0) {
			this.mem_prot = 1;
			this.fault_data |= 0o1000;
			this.checkAprIrq();
		} else {
			this.PC = (this.PC + 1) & RM;
		}
		return -1;
	}

	private pageLookupKa(addr: number, flag: number, wr: number): number {
		if (!flag && (this.FLAGS & USER) !== 0) {
			if (addr <= this.Pl) return (addr + this.Rl) & RM;
			if (this.twoseg && (addr & 0o400000) !== 0 && addr <= this.Ph) {
				if (this.Pflag === 0 || (this.Pflag === 1 && wr === 0)) return (addr + this.Rh) & RM;
			}
			this.mem_prot = 1;
			this.checkAprIrq();
			return -1;
		}
		return addr;
	}

	memRead(flag: number, cur_context: number, fetch: number, mod: number): boolean {
		if (this.AB < 0o20) {
			if (this.its && (this.xct_flag & 1) !== 0 && !cur_context) {
				this.MB = this.rd((this.ac_stack & 0o1777777) + this.AB);
				if (fetch === 0) this.histMb(this.MB);
				return false;
			}
			this.MB = this.FM[this.AB]!;
		} else {
			const addr = this.its ? this.pageLookupIts(this.AB, flag, 0, cur_context, fetch, mod) : this.pageLookupKa(this.AB, flag, mod);
			if (addr < 0) return true;
			if (addr >= this.memWords) {
				this.nxm_flag = 1;
				this.checkAprIrq();
				return true;
			}
			this.events.now++;
			this.MB = this.L[addr]! * TWO18 + this.R[addr]!;
			this.last_addr = addr;
			this.modify = mod;
		}
		if (fetch === 0) this.histMb(this.MB);
		return false;
	}

	memWrite(flag: number, cur_context: number): boolean {
		if (this.AB < 0o20) {
			if (this.its && (this.xct_flag & 2) !== 0 && !cur_context) {
				this.wr((this.ac_stack & 0o1777777) + this.AB, this.MB);
				return false;
			}
			this.FM[this.AB] = this.MB;
			return false;
		}
		if (this.its && this.modify) {
			this.wr(this.last_addr, this.MB);
			this.modify = 0;
			return false;
		}
		const addr = this.its ? this.pageLookupIts(this.AB, flag, 1, cur_context, 0, 0) : this.pageLookupKa(this.AB, flag, 1);
		if (addr < 0) return true;
		if (addr >= this.memWords) {
			this.nxm_flag = 1;
			this.checkAprIrq();
			return true;
		}
		this.events.now++;
		this.L[addr] = LH(this.MB);
		this.R[addr] = this.MB & RM;
		return false;
	}

	readWord(addr: number): bigint | undefined {
		return addr < this.memWords ? BigInt(this.rd(addr)) : undefined;
	}

	writeWord(addr: number, v: bigint): boolean {
		if (addr >= this.memWords) return false;
		this.wr(addr, Number(v & 0o777777777777n));
		return true;
	}

	examine(addr: number): bigint {
		return BigInt(addr < 0o20 ? this.FM[addr]! : addr < this.memWords ? this.rd(addr) : 0);
	}

	deposit(addr: number, v: bigint): void {
		const n = Number(v & 0o777777777777n);
		if (addr < 0o20) this.FM[addr] = n;
		else this.wr(addr, n);
	}

	saveMemory(): Uint8Array {
		const out = new Uint8Array(this.memWords * 8);
		const view = new DataView(out.buffer);
		for (let i = 0; i < this.memWords; i++) {
			view.setUint32(i * 8, ((this.L[i]! & 0o37777) << 18) | this.R[i]!, true);
			view.setUint32(i * 8 + 4, this.L[i]! >>> 14, true);
		}
		return out;
	}

	loadMemory(bytes: Uint8Array): void {
		const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
		const n = Math.min(this.memWords, Math.floor(bytes.byteLength / 8));
		for (let i = 0; i < n; i++) {
			const lo = view.getUint32(i * 8, true);
			const hi = view.getUint32(i * 8 + 4, true) & 0o17;
			this.R[i] = lo & RM;
			this.L[i] = (lo >>> 18) | (hi << 14);
		}
		this.L.fill(0, n);
		this.R.fill(0, n);
	}

	state(): Ka10State {
		const s: Ka10State = { now: this.events.now, instructions: this.instructions };
		for (const k of STATE_NUMBERS) s[k] = this[k];
		for (const k of STATE_WORDS) s[k] = this[k].toString(8);
		s.FM = Array.from(this.FM, (w) => w.toString(8));
		s.dev_irq = Array.from(this.dev_irq);
		s.e_tlb = Array.from(this.e_tlb);
		s.u_tlb = Array.from(this.u_tlb);
		s.rtc = this.events.timeLeft(this.rtc);
		s.qua = this.events.isActive(this.qua) ? this.events.timeLeft(this.qua) : -1;
		return s;
	}

	setState(s: Ka10State): void {
		for (const k of STATE_NUMBERS) if (typeof s[k] === "number") this[k] = s[k] as number;
		for (const k of STATE_WORDS) if (typeof s[k] === "string") this[k] = parseInt(s[k] as string, 8);
		const words = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);
		const nums = (v: unknown): number[] => (Array.isArray(v) ? (v as number[]) : []);
		words(s.FM).forEach((w, i) => (this.FM[i] = parseInt(w, 8)));
		nums(s.dev_irq).forEach((v, i) => (this.dev_irq[i] = v));
		nums(s.e_tlb).forEach((v, i) => (this.e_tlb[i] = v));
		nums(s.u_tlb).forEach((v, i) => (this.u_tlb[i] = v));
		if (typeof s.now === "number") this.events.now = s.now;
		if (typeof s.instructions === "number") this.instructions = s.instructions;
		this.events.cancel(this.rtc);
		this.events.activate(this.rtc, typeof s.rtc === "number" ? s.rtc : 1000);
		this.events.cancel(this.qua);
		if (typeof s.qua === "number" && s.qua >= 0) this.events.activate(this.qua, s.qua);
	}

	// ---- the instruction loop ---------------------------------------------------

	run(budget: number): Stop {
		const ev = this.events;
		const end = ev.now + budget;
		this.broke = false;
		this.halted = false;
		this.watch_stop = 0;
		while (ev.now < end) {
			if (ev.now >= ev.next) ev.process();
			if (this.halted) return "halt";
			if (this.f_load_pc && this.breakpoints.size && this.breakpoints.has(this.PC) && !this.broke) {
				this.broke = true;
				return "breakpoint";
			}
			this.broke = false;
			this.cycle();
			if (this.halted) return "halt";
		}
		return "budget";
	}

	step(n = 1): Stop {
		const ev = this.events;
		const goal = this.instructions + n;
		this.halted = false;
		while (this.instructions < goal) {
			if (ev.now >= ev.next) ev.process();
			if (this.halted) return "halt";
			this.cycle();
			if (this.halted) return "halt";
		}
		return "budget";
	}

	private cycle(): void {
		if (this.f_load_pc) {
			this.modify = 0;
			this.xct_flag = 0;
			this.AB = this.PC;
			this.uuo_cycle = 0;
			this.f_pc_inh = 0;
		}
		let entry = this.f_inst_fetch ? 0 : 2;
		for (;;) {
			if (entry === 0) {
				if (this.its && this.pi_cycle === 0 && this.mem_prot === 0) {
					this.opc = this.PC + this.FLAGS * TWO18;
					if ((this.FLAGS & ONEP) !== 0) {
						this.one_p_arm = 1;
						this.FLAGS &= ~ONEP;
					}
				}
				if (this.memRead(this.pi_cycle | this.uuo_cycle, 1, 1, 0)) {
					this.pi_rq = this.checkIrqLevel();
					if (this.pi_rq) {
						this.stPi();
						entry = 0;
						continue;
					}
					entry = 3;
				} else entry = 1;
			}
			if (entry === 1) {
				const lh = LH(this.MB);
				this.IR = lh >> 9;
				this.AC = (lh >> 5) & 0o17;
				this.AD = this.MB;
				this.IA = this.AB;
				this.BYF5 = 0;
				entry = 2;
			}
			if (entry === 2) {
				let failed = false;
				let ind = 0;
				do {
					const lh = LH(this.MB);
					ind = (lh >> 4) & 1;
					this.AR = this.MB;
					this.AB = this.MB & RM;
					const ix = lh & 0o17;
					if (ix) {
						this.AR = this.MB = m36(this.AB + this.FM[ix]!);
						this.AB = this.MB & RM;
					}
					if (ind && !this.pi_rq) {
						if (this.memRead(this.pi_cycle | this.uuo_cycle, 1, 0, 0)) {
							failed = true;
							break;
						}
					}
					if (++this.events.now >= this.events.next) this.events.process();
					if (!this.pi_cycle && this.pi_pending) this.pi_rq = this.checkIrqLevel();
				} while (ind && !this.pi_rq);
				if (failed) entry = 3;
				else if (this.pi_rq) {
					this.stPi();
					entry = 0;
					continue;
				} else {
					if (this.histLen) {
						if (this.PC !== 0o17) this.histP = this.histP + 1;
						if (this.histP >= this.histLen) this.histP = 0;
						const h = this.hist[this.histP]!;
						h.pc = 0x40000000 | (this.BYF5 ? HIST_PC2 | this.PC : this.IA);
						h.second = this.BYF5 !== 0;
						h.ea = this.AB;
						h.ir = BigInt(this.AD);
						h.flags = (this.FLAGS << 5) | (this.clk_flg << 2) | (this.nxm_flag << 1) | (this.mem_prot << 4) | (this.push_ovf << 3);
						h.mb = BigInt(this.AR);
						h.ac = BigInt(this.FM[this.AC]!);
					}
					this.f_inst_fetch = 1;
					this.f_load_pc = 1;
					this.nrf = 0;
					this.fxu_hold_set = 0;
					this.modify = 0;
					this.f_pc_inh = 0;
					this.BR = this.FM[this.AC]!;
					this.execute();
					if (this.histLen) this.hist[this.histP]!.fmb = BigInt(this.AR);
					entry = 3;
				}
			}
			if (this.last()) {
				entry = 1;
				continue;
			}
			return;
		}
	}

	private stPi(): void {
		this.pi_cycle = 1;
		this.pi_rq = 0;
		this.pi_hold = 0;
		this.pi_ov = 0;
		this.AB = 0o40 | (this.pi_enc << 1) | this.maoff;
		this.xct_flag = 0;
		this.pi_vect = this.AB;
	}

	private last(): boolean {
		this.modify = 0;
		if (!this.f_pc_inh && !this.pi_cycle) this.PC = (this.PC + 1) & RM;
		if (this.its && this.one_p_arm && (this.FLAGS & BYTI) === 0) {
			this.fault_data |= 0o2000;
			this.mem_prot = 1;
			this.one_p_arm = 0;
			this.checkAprIrq();
		}
		if (this.pi_cycle) {
			if ((this.IR & 0o700) === 0o700 && (this.AC & 4) === 0) {
				this.pi_hold = this.pi_ov;
				if (!this.pi_hold && this.f_inst_fetch) {
					this.pi_cycle = 0;
				} else {
					this.AB = this.pi_vect | this.pi_ov;
					this.memRead(1, 0, 1, 0);
					return true;
				}
			} else if (this.pi_hold && !this.f_pc_inh) {
				if ((this.IR & 0o700) === 0o700) {
					if (this.checkIrqLevel()) this.pi_vect = 0o40 | (this.pi_enc << 1) | this.maoff;
				}
				this.AB = this.pi_vect | this.pi_ov;
				this.pi_ov = 0;
				this.pi_hold = 0;
				this.memRead(1, 0, 1, 0);
				return true;
			} else {
				if (!this.its || this.f_pc_inh) this.setPiHold();
				this.pi_cycle = 0;
				this.f_inst_fetch = 1;
				this.f_load_pc = 1;
			}
		}
		if (this.pi_restore) {
			this.restorePiHold();
			this.pi_restore = 0;
		}
		this.events.now++;
		if (this.f_load_pc && !this.pi_cycle) this.instructions++;
		return false;
	}

	// ---- instructions -----------------------------------------------------------

	private uuo(muuo: boolean): void {
		if (muuo) this.uuo_cycle = 1;
		this.MB = (this.IR * 16 + this.AC) * 0o40000000 + this.AB;
		this.AB = 0o40;
		if (this.maoff && this.uuo_cycle) this.AB |= this.maoff;
		this.memWrite(this.uuo_cycle, 1);
		this.AB += 1;
		this.f_load_pc = 0;
		if (this.its && this.one_p_arm) {
			this.FLAGS |= ONEP;
			this.one_p_arm = 0;
		}
		this.f_pc_inh = 1;
	}

	private unasign(): void {
		this.MB = (this.IR * 16 + this.AC) * 0o40000000 + this.AB;
		this.AB = 0o60 | this.maoff;
		this.uuo_cycle = 1;
		this.memWrite(this.uuo_cycle, 0);
		this.AB += 1;
		if (this.its && this.one_p_arm) {
			this.FLAGS |= ONEP;
			this.one_p_arm = 0;
		}
		this.f_load_pc = 0;
	}

	/** Hand the decoded instruction to the SIMH port, and take back what it changed. */
	private coprocess(): void {
		const c = this.cop;
		this.coprocessed[this.IR]!++;
		c.AR = BigInt(this.AR);
		c.BR = BigInt(this.BR);
		c.MQ = BigInt(this.MQ);
		c.MB = BigInt(this.MB);
		c.AB = this.AB;
		c.IR = this.IR;
		c.AC = this.AC;
		c.FLAGS = this.FLAGS;
		c.pi_cycle = this.pi_cycle;
		c.uuo_cycle = this.uuo_cycle;
		c.xct_flag = this.xct_flag;
		for (let i = 0; i < 16; i++) c.FM[i] = BigInt(this.FM[i]!);
		c.executeDecoded();
		this.AR = Number(c.AR & 0o777777777777n);
		this.MB = Number(c.MB & 0o777777777777n);
		this.MQ = Number(c.MQ & 0o777777777777n);
		this.SC = c.SC;
		this.FLAGS = c.FLAGS;
		for (let i = 0; i < 16; i++) this.FM[i] = Number(c.FM[i]!);
	}

	/** IMUL and MUL: the 70-bit product of the magnitudes, exact from 18-bit pieces. */
	private mul(): void {
		switch (this.IR & 7) {
			case 1:
			case 5:
				this.AR = this.AR & RM;
				break;
			case 0:
			case 4:
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				break;
			default:
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = this.MB;
				break;
		}
		let flag3 = 0;
		if (this.AR >= SMASK) {
			this.AR = (CM(this.AR) + 1) % TWO36;
			flag3 = 1;
		}
		if (this.BR >= SMASK) {
			this.BR = (CM(this.BR) + 1) % TWO36;
			flag3 ^= 1;
		}
		if (this.AR === 0 || this.BR === 0) {
			this.AR = this.MQ = 0;
		} else {
			if (this.BR === SMASK) flag3 ^= 1;
			const a1 = Math.floor(this.AR / TWO18);
			const a0 = this.AR % TWO18;
			const b1 = Math.floor(this.BR / TWO18);
			const b0 = this.BR % TWO18;
			const mid = a1 * b0 + a0 * b1;
			const t = a0 * b0 + (mid % TWO18) * TWO18;
			let hi = (a1 * b1 + Math.floor(mid / TWO18)) * 2 + Math.floor(t / TWO35);
			let lo = t % TWO35;
			if ((this.IR & 4) === 0) {
				if (hi > flag3 && !this.pi_cycle) {
					this.FLAGS |= OVR;
					this.checkAprIrq();
				}
				if (flag3) {
					const v = CMASK - lo + 1;
					lo = v >= SMASK ? v : v + SMASK;
				}
				this.MQ = lo;
				this.AR = lo;
			} else {
				if (hi >= SMASK && !this.pi_cycle) {
					this.FLAGS |= OVR;
					this.checkAprIrq();
				}
				if (flag3) {
					hi = FMASK - hi;
					lo = CMASK - lo + 1;
					if (lo >= SMASK) {
						hi += 1;
						lo -= SMASK;
					}
				}
				hi %= TWO36;
				this.AR = hi;
				this.MQ = lo + (hi >= SMASK ? SMASK : 0);
				if (this.BR === SMASK && hi >= SMASK) {
					this.FLAGS |= OVR;
					this.checkAprIrq();
				}
			}
		}
		switch (this.IR & 7) {
			case 7:
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
			// falls through
			case 5:
			case 4:
				this.setReg(this.AC + 1, this.MQ);
			// falls through
			case 1:
			case 0:
				this.setReg(this.AC, this.AR);
				return;
			case 2:
			case 6:
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 3:
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				this.setReg(this.AC, this.AR);
				return;
		}
	}

	/** The divisor into BR and the dividend into AR, for the four modes of IDIV and DIV. */
	private divOperand(): boolean {
		switch (this.IR & 3) {
			case 0:
				this.AR = this.BR;
				if (this.memRead(0, 0, 0, 0)) return false;
				this.BR = this.MB;
				return true;
			case 1:
				this.MQ = this.AR & RM;
				this.AR = this.BR;
				this.BR = this.MQ;
				return true;
			default:
				this.AR = this.BR;
				if (this.memRead(0, 0, 0, 1)) return false;
				this.BR = this.MB;
				return true;
		}
	}

	private divStore(): void {
		switch (this.IR & 3) {
			case 3:
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
			// falls through
			case 1:
			case 0:
				this.setReg(this.AC, this.AR);
				this.setReg(this.AC + 1, this.MQ);
				return;
			case 2:
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
		}
	}

	private idiv(): void {
		if (!this.divOperand()) return;
		let flag1 = 0;
		let flag3 = 0;
		if (this.BR >= SMASK) {
			this.BR = (CM(this.BR) + 1) % TWO36;
			flag1 = 1;
		}
		if (this.BR === 0 || (this.AR === SMASK && this.BR === 1)) {
			this.FLAGS |= OVR | NODIV;
			this.checkAprIrq();
			return;
		}
		if (this.AR >= SMASK) {
			this.AR = (CM(this.AR) + 1) % TWO36;
			flag1 ^= 1;
			flag3 = 1;
		}
		// Exact: with both below 2^36 the double quotient can't round up to the next integer.
		const q = Math.floor(this.AR / this.BR);
		const r = this.AR - q * this.BR;
		this.MQ = r;
		this.AR = q;
		if (flag1) this.AR = (CM(this.AR) + 1) % TWO36;
		if (flag3) this.MQ = (CM(this.MQ) + 1) % TWO36;
		this.divStore();
	}

	/** DIV: the 72-bit AC,AC+1 by E, bit by bit as SIMH does it; nothing passes 2^38. */
	private div(): void {
		if (!this.divOperand()) return;
		const bit35 = (x: number): boolean => Math.floor(x / TWO35) % 2 === 1;
		this.MQ = this.getReg(this.AC + 1);
		let flag1 = 0;
		if (this.AR >= SMASK) {
			this.AD = (CM(this.MQ) + 1) % TWO36;
			this.MQ = this.AR;
			this.AR = this.AD;
			this.AD = CM(this.MQ);
			this.MQ = this.AR;
			this.AR = this.AD;
			if (this.MQ % TWO35 === 0) this.AR = (this.AR + 1) % TWO36;
			flag1 = 1;
		}
		const bneg = this.BR >= SMASK;
		const ncb = CM(this.BR) + 1;
		this.AD = (bneg ? this.AR + this.BR : this.AR + ncb) % TWO36;
		this.MQ = (this.MQ % TWO35) * 2 + (this.AD >= SMASK ? 1 : 0);
		this.SC = 35;
		if (this.AD < SMASK) {
			this.FLAGS |= OVR | NODIV;
			this.checkAprIrq();
			return;
		}
		while (this.SC !== 0) {
			this.AD = bneg !== (this.MQ % 2 === 1) ? this.AR + ncb : this.AR + this.BR;
			this.AR = ((this.AD * 2) % TWO36) + (this.MQ >= SMASK ? 1 : 0);
			this.MQ = (this.MQ % TWO35) * 2 + (bit35(this.AD) ? 0 : 1);
			this.SC--;
		}
		this.AD = bneg !== (this.MQ % 2 === 1) ? this.AR + ncb : this.AR + this.BR;
		this.AR = this.AD % TWO36;
		this.MQ = (this.MQ % TWO35) * 2 + (bit35(this.AD) ? 0 : 1);
		if (this.AR >= SMASK) {
			this.AD = (bneg ? this.AR + ncb : this.AR + this.BR) % TWO36;
			this.AR = this.AD;
		}
		if (flag1) this.AR = (CM(this.AR) + 1) % TWO36;
		if (flag1 !== (bneg ? 1 : 0)) {
			this.AD = (CM(this.MQ) + 1) % TWO36;
			this.MQ = this.AR;
			this.AR = this.AD;
		} else {
			this.AD = this.MQ;
			this.MQ = this.AR;
			this.AR = this.AD;
		}
		this.divStore();
	}

	/** The floating instructions: fetch per mode, let the unit compute, store per mode. */
	private floating(): void {
		const u = this.float!;
		const IR = this.IR;
		let r: FloatStore;
		if (IR === 0o131) {
			this.dfn();
			return;
		}
		if (IR === 0o132) {
			this.BR = this.AR & RM;
			this.AR = this.getReg(this.AC);
			r = u.fsc(this, this.AB);
		} else if (IR === 0o171) {
			if (this.memRead(0, 0, 0, 0)) return;
			this.AR = this.MB;
			this.MQ = this.getReg(this.AC + 1);
			r = u.fdvl(this);
		} else {
			if (!this.fpOperand()) return;
			r = IR < 0o150 ? u.fad(this) : IR < 0o160 ? u.fsb(this) : IR < 0o170 ? u.fmp(this) : u.fdv(this);
		}
		switch (r) {
			case "ac1":
				this.setReg(this.AC + 1, this.AR);
				return;
			case "ac":
				this.setReg(this.AC, this.AR);
				return;
			case "pair":
				this.setReg(this.AC + 1, this.MQ);
				this.setReg(this.AC, this.AR);
				return;
			case "store":
				this.fpStore();
				return;
		}
	}

	/** The operand of a floating instruction by mode: immediate (5) is E in the left half. */
	private fpOperand(): boolean {
		switch (this.IR & 7) {
			case 5:
				this.AR = (this.AR & RM) * TWO18;
				return true;
			case 0:
			case 1:
			case 4:
				if (this.memRead(0, 0, 0, 0)) return false;
				this.AR = this.MB;
				return true;
			default:
				if (this.memRead(0, 0, 0, 1)) return false;
				this.AR = this.MB;
				return true;
		}
	}

	/** Mode 1 (long) also puts MQ in AC+1; 2 and 6 store to memory; 3 and 7 to both. */
	private fpStore(): void {
		switch (this.IR & 7) {
			case 1:
				this.setReg(this.AC + 1, this.MQ);
			// falls through
			case 5:
			case 0:
			case 4:
				this.setReg(this.AC, this.AR);
				return;
			case 2:
			case 6:
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			default:
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				this.setReg(this.AC, this.AR);
		}
	}

	/** DFN: negate the double word AC (high) and E (low), keeping E's exponent. */
	private dfn(): void {
		if (this.memRead(0, 0, 0, 0)) return;
		this.BR = this.MB;
		this.AR = this.getReg(this.AC);
		this.AD = (CM(this.BR) + 1) % TWO36;
		this.SC = Math.floor(this.BR / 134217728) & 0o777;
		this.BR = this.AR;
		this.AR = this.AD;
		this.AD = (CM(this.BR) + (this.AD % 134217728 === 0 ? 1 : 0)) % TWO36;
		this.AR = (this.AR % 134217728) + (this.SC & 0o777) * 134217728;
		this.BR = this.AR;
		this.AR = this.AD;
		this.MB = this.BR;
		this.setReg(this.AC, this.AR);
		this.memWrite(0, 0);
	}

	private ldbPtr(): void {
		this.f_load_pc = 0;
		this.f_inst_fetch = 0;
		this.f_pc_inh = 1;
		this.FLAGS |= BYTI;
		this.BYF5 = 1;
		if (this.its && this.pi_cycle === 0 && this.mem_prot === 0) this.opc = this.PC + this.FLAGS * TWO18;
	}

	private byteOp(): void {
		if ((this.FLAGS & BYTI) === 0 || !this.BYF5) {
			if (this.memRead(0, this.its ? 0 : 1, 0, 0)) return;
			this.AR = this.MB;
			const lh = LH(this.AR);
			this.SC = (lh >> 6) & 0o77;
			this.SCAD = lh >> 12;
			this.ldbPtr();
			return;
		}
		const f = (this.IR & 6) === 6 ? 1 : 0;
		this.AB = this.AR & RM;
		const sh = this.SCAD & 63;
		if (this.memRead(0, 0, 0, f)) return;
		this.AR = this.MB;
		if ((this.IR & 6) === 4) {
			const v = sh >= 36 ? 0 : shr(this.AR, sh);
			this.AR = this.SC >= 36 ? v : v % POW2[this.SC]!;
			this.setReg(this.AC, this.AR);
		} else {
			this.BR = this.getReg(this.AC);
			if (sh < 36) {
				const end = Math.min(sh + this.SC, 36);
				const width = end - sh;
				if (width > 0) {
					const old = (shr(this.AR, sh) % POW2[width]!) * POW2[sh]!;
					this.AR = this.AR - old + (this.BR % POW2[width]!) * POW2[sh]!;
				}
			}
			this.MB = this.AR;
			if (this.memWrite(0, 0)) return;
		}
		this.FLAGS &= ~BYTI;
		this.BYF5 = 0;
	}

	private skipOp(): void {
		this.AR = m36(this.AD);
		this.f |= (this.AR === 0 ? 1 : 0) << 1;
		this.f = this.f & this.IR;
		if (((this.IR & 4) !== 0) === (this.f === 0)) this.PC = (this.PC + 1) & RM;
		if ((this.IR & 0o60) !== 0 && this.AC !== 0) this.setReg(this.AC, this.AR);
		if ((this.IR & 0o40) !== 0) {
			this.MB = this.AR;
			this.memWrite(0, 0);
		}
	}

	private jumpOp(): void {
		this.AD = m36(this.AD);
		this.AR = this.AD;
		this.f |= (this.AD === 0 ? 1 : 0) << 1;
		this.f = this.f & this.IR;
		if (((this.IR & 4) !== 0) === (this.f === 0)) {
			if (this.its && this.FLAGS & USER) this.jpc = this.PC;
			this.PC = this.AB;
			this.f_pc_inh = 1;
		}
		if ((this.IR & 0o40) !== 0) this.setReg(this.AC, this.AR);
	}

	private boolOp(fn: (a: number, b: number) => number, mode: number): void {
		switch (mode) {
			case 0:
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = fn(this.MB, this.BR);
				this.setReg(this.AC, this.AR);
				return;
			case 1:
				this.AR = fn(this.AR & RM, this.BR);
				this.setReg(this.AC, this.AR);
				return;
			case 2:
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = fn(this.MB, this.BR);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			default:
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = fn(this.MB, this.BR);
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				this.setReg(this.AC, this.AR);
				return;
		}
	}

	private negate(): void {
		this.flag1 = this.flag3 = 0;
		this.AD = CM(this.AR) + 1;
		if (CCM(this.AR) + 1 >= TWO35) {
			this.FLAGS |= CRY1;
			this.flag1 = 1;
		}
		if (this.AD >= TWO36) {
			this.FLAGS |= CRY0;
			this.flag3 = 1;
		}
		if (this.flag1 !== this.flag3 && !this.pi_cycle) this.FLAGS |= OVR;
		this.AR = this.AD >= TWO36 ? this.AD - TWO36 : this.AD;
		if (this.flag1 !== this.flag3 && !this.pi_cycle) this.checkAprIrq();
	}

	private execute(): void {
		const IR = this.IR;
		if (IR < 0o100) {
			this.uuo(IR === 0 || IR >= 0o40);
			return;
		}
		if (isFloat(IR) && this.float) {
			this.floating();
			return;
		}
		if (onCoprocessor(IR) || isFloat(IR)) {
			this.coprocess();
			return;
		}
		switch (IR) {
			case 0o100:
			case 0o101:
			case 0o104:
				this.unasign();
				return;
			case 0o102:
				if (this.its && (this.FLAGS & USER) === 0) {
					this.lpm();
					return;
				}
				this.unasign();
				return;
			case 0o103:
				if (this.its && (this.FLAGS & USER) === 0) {
					this.f_load_pc = 0;
					this.f_pc_inh = 1;
					this.xct_flag = this.AC;
					return;
				}
				this.unasign();
				return;
			case 0o133:
			case 0o134:
			case 0o136:
				if ((this.FLAGS & BYTI) === 0) {
					if (this.memRead(0, this.its ? 0 : 1, 0, 1)) return;
					this.AR = this.MB;
					const lh = LH(this.AR);
					this.SCAD = lh >> 12;
					this.SC = (lh >> 6) & 0o77;
					this.SCAD = (this.SCAD + (0o777 ^ this.SC) + 1) & 0o777;
					if (this.SCAD & 0o400) {
						this.SCAD = ((0o777 ^ this.SC) + 0o44 + 1) & 0o777;
						this.AR = this.AR === FMASK ? 0 : this.AR + 1;
					}
					this.AR = (this.AR % POW2[30]!) + (this.SCAD & 0o77) * POW2[30]!;
					this.MB = this.AR;
					if (this.memWrite(0, this.its ? 0 : 1)) return;
					if ((IR & 4) === 0) return;
					this.ldbPtr();
					return;
				}
				this.byteOp();
				return;
			case 0o135:
			case 0o137:
				this.byteOp();
				return;
			case 0o200:
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.setReg(this.AC, this.AR);
				return;
			case 0o201:
				this.AR &= RM;
				this.setReg(this.AC, this.AR);
				return;
			case 0o202:
				this.MB = this.BR;
				this.memWrite(0, 0);
				return;
			case 0o203:
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = this.MB;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;
			case 0o204:
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = SWAP(this.MB);
				this.setReg(this.AC, this.AR);
				return;
			case 0o205:
				this.AR = (this.AR & RM) * TWO18;
				this.setReg(this.AC, this.AR);
				return;
			case 0o206:
				this.AR = SWAP(this.getReg(this.AC));
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o207:
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = SWAP(this.MB);
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;
			case 0o210:
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.negate();
				this.setReg(this.AC, this.AR);
				return;
			case 0o211:
				this.AR &= RM;
				this.negate();
				this.setReg(this.AC, this.AR);
				return;
			case 0o212:
				this.AR = this.getReg(this.AC);
				this.negate();
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o213:
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = this.MB;
				this.negate();
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;
			case 0o214:
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				if (neg(this.AR)) this.negate();
				this.setReg(this.AC, this.AR);
				return;
			case 0o215:
				this.AR &= RM;
				this.setReg(this.AC, this.AR);
				return;
			case 0o216:
				this.AR = this.getReg(this.AC);
				if (neg(this.AR)) this.negate();
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o217:
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = this.MB;
				if (neg(this.AR)) this.negate();
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;
			case 0o220:
			case 0o221:
			case 0o222:
			case 0o223:
			case 0o224:
			case 0o225:
			case 0o226:
			case 0o227: /* IMUL, MUL */
				this.mul();
				return;
			case 0o230:
			case 0o231:
			case 0o232:
			case 0o233: /* IDIV */
				this.idiv();
				return;
			case 0o234:
			case 0o235:
			case 0o236:
			case 0o237: /* DIV */
				this.div();
				return;
			case 0o245: /* ROTC */ {
				this.AR = this.BR;
				this.MQ = this.getReg(this.AC + 1);
				this.SC = this.AB & RSIGN ? (this.AB & 0o377 ? ((0o377 ^ this.AB) + 1) & 0o377 : 0o400) : this.AB & 0o377;
				if (this.SC === 0) return;
				this.SC = this.SC % 72;
				if (this.AB & RSIGN) this.SC = 72 - this.SC;
				if (this.SC >= 36) {
					const t = this.MQ;
					this.MQ = this.AR;
					this.AR = t;
					this.SC -= 36;
				}
				const sc = this.SC;
				this.AD = shl36(this.AR, sc) + shr(this.MQ, 36 - sc);
				this.MQ = shl36(this.MQ, sc) + shr(this.AR, 36 - sc);
				this.AR = this.AD;
				this.setReg(this.AC, this.AR);
				this.setReg(this.AC + 1, this.MQ);
				return;
			}
			case 0o246: /* LSHC */
				this.AR = this.BR;
				this.MQ = this.getReg(this.AC + 1);
				this.SC = (this.AB & RSIGN ? (0o377 ^ this.AB) + 1 : this.AB) & 0o377;
				if (this.SC === 0) return;
				if (this.SC > 71) {
					this.AR = 0;
					this.MQ = 0;
				} else {
					const right = (this.AB & RSIGN) !== 0;
					if (this.SC > 36) {
						if (right) {
							this.MQ = this.AR;
							this.AR = 0;
						} else {
							this.AR = this.MQ;
							this.MQ = 0;
						}
						this.SC -= 36;
					}
					const sc = this.SC;
					if (right) {
						this.MQ = shr(this.MQ, sc) + shl36(this.AR, 36 - sc);
						this.AR = shr(this.AR, sc);
					} else {
						this.AR = shl36(this.AR, sc) + shr(this.MQ, 36 - sc);
						this.MQ = shl36(this.MQ, sc);
					}
				}
				this.setReg(this.AC, this.AR);
				this.setReg(this.AC + 1, this.MQ);
				return;
			case 0o247: /* ITS CIRC */
				if (!this.its) {
					this.unasign();
					return;
				}
				this.BR = this.AR & RM;
				this.AR = this.getReg(this.AC);
				this.histMb(this.AR);
				this.MQ = this.getReg(this.AC + 1);
				this.SC = (this.AB & RSIGN ? (0o777 ^ this.AB) + 1 : this.AB) & 0o777;
				if (this.SC === 0) return;
				this.SC = this.SC % 72;
				if (this.AB & RSIGN) this.SC = 72 - this.SC;
				while (this.SC > 0) {
					this.AD = (this.AR % TWO35) * 2 + (this.MQ % 2);
					this.MQ = Math.floor(this.MQ / 2) + (this.AR >= SMASK ? SMASK : 0);
					this.AR = this.AD;
					this.SC--;
				}
				this.setReg(this.AC, this.AR);
				this.setReg(this.AC + 1, this.MQ);
				return;
			case 0o240: /* ASH */ {
				this.SC = (this.AB & RSIGN ? (0o377 ^ this.AB) + 1 : this.AB) & 0o377;
				if (this.SC === 0) return;
				this.AR = this.BR;
				const n = neg(this.AR);
				if (this.AB & RSIGN) {
					if (this.SC < 35) this.AR = shr(this.AR, this.SC) + (n ? (POW2[this.SC]! - 1) * POW2[36 - this.SC]! : 0);
					else this.AR = n ? FMASK : 0;
				} else {
					const s = this.SC & 63;
					let ovr: boolean;
					if (s <= 17) ovr = Math.floor(((n ? FMASK : 0) * POW2[s]!) / TWO35) !== Math.floor((this.AR * POW2[s]!) / TWO35);
					else {
						const hi = (x: number): bigint => BigInt.asUintN(64, BigInt(x) << BigInt(s)) >> 35n;
						ovr = hi(n ? FMASK : 0) !== hi(this.AR);
					}
					if (ovr) {
						this.FLAGS |= OVR;
						this.checkAprIrq();
					}
					this.AR = (s < 35 ? (this.AR % POW2[35 - s]!) * POW2[s]! : 0) + (n ? SMASK : 0);
				}
				this.setReg(this.AC, this.AR);
				return;
			}
			case 0o241: /* ROT */
				this.SC = this.AB & RSIGN ? (this.AB & 0o377 ? ((0o377 ^ this.AB) + 1) & 0o377 : 0o400) : this.AB & 0o377;
				if (this.SC === 0) return;
				this.SC = this.SC % 36;
				if (this.AB & RSIGN) this.SC = 36 - this.SC;
				this.AR = (this.BR % POW2[36 - this.SC]!) * POW2[this.SC]! + shr(this.BR, 36 - this.SC);
				this.setReg(this.AC, this.AR);
				return;
			case 0o242: /* LSH */
				this.SC = (this.AB & RSIGN ? (0o377 ^ this.AB) + 1 : this.AB) & 0o377;
				if (this.SC !== 0) {
					if (this.SC > 36) this.BR = 0;
					else if (this.AB & RSIGN) this.BR = shr(this.BR, this.SC);
					else this.BR = shl36(this.BR, this.SC);
				}
				this.AR = this.BR;
				this.setReg(this.AC, this.AR);
				return;
			case 0o243: /* JFFO */
				this.SC = 0;
				if (this.BR !== 0) {
					if (this.its && this.FLAGS & USER) this.jpc = this.PC;
					this.PC = this.AB;
					this.f_pc_inh = 1;
					const lh = LH(this.BR);
					this.SC = lh ? Math.clz32(lh) - 14 : 18 + Math.clz32(this.BR & RM) - 14;
				}
				this.setReg(this.AC + 1, this.SC);
				return;
			case 0o250: /* EXCH */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.MB = this.BR;
				if (this.memWrite(0, 0)) return;
				this.setReg(this.AC, this.AR);
				return;
			case 0o251:
				this.blt();
				return;
			case 0o252: /* AOBJP */
			case 0o253: /* AOBJN */
				this.AR = this.BR + 0o1000001;
				if (neg(this.AR) === (IR === 0o253)) {
					if (this.its && this.FLAGS & USER) this.jpc = this.PC;
					this.PC = this.AB;
					this.f_pc_inh = 1;
				}
				this.AR = m36(this.AR);
				this.setReg(this.AC, this.AR);
				return;
			case 0o254:
				this.jrst();
				return;
			case 0o255: /* JFCL */
				if ((this.FLAGS >> 9) & this.AC) {
					if (this.its && this.FLAGS & USER) this.jpc = this.PC;
					this.PC = this.AR & RM;
					this.f_pc_inh = 1;
				}
				this.FLAGS &= 0o37777 ^ (this.AC << 9);
				return;
			case 0o256: /* XCT */
				this.f_load_pc = 0;
				this.f_pc_inh = 1;
				this.xct_flag = 0;
				if (this.its && this.one_p_arm) {
					this.FLAGS |= ONEP;
					this.one_p_arm = 0;
				}
				return;
			case 0o257:
				return;
			case 0o260: /* PUSHJ */
				this.MB = ((this.FLAGS << 5) & RM) * TWO18 + ((this.PC + (this.pi_cycle ? 0 : 1)) & RM);
				this.BR = this.BR + 0o1000001;
				this.FLAGS &= ~BYTI;
				if (c1(this.BR)) {
					this.push_ovf = 1;
					this.checkAprIrq();
				}
				this.AB = this.BR & RM;
				this.histMb(this.MB);
				if (this.memWrite(this.uuo_cycle | this.pi_cycle, 0)) return;
				if (this.uuo_cycle | this.pi_cycle) {
					this.FLAGS &= ~USER;
					if (this.its && this.one_p_arm) {
						this.FLAGS |= ONEP;
						this.one_p_arm = 0;
					}
				}
				if (this.its && this.FLAGS & USER) this.jpc = this.PC;
				this.PC = this.AR & RM;
				this.f_pc_inh = 1;
				this.AR = m36(this.BR);
				this.setReg(this.AC, this.AR);
				return;
			case 0o261: /* PUSH */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.BR = this.BR + 0o1000001;
				if (c1(this.BR)) {
					this.push_ovf = 1;
					this.checkAprIrq();
				}
				this.AB = this.BR & RM;
				this.MB = this.AR;
				this.histMb(this.MB);
				if (this.memWrite(0, 0)) return;
				this.AR = m36(this.BR);
				this.setReg(this.AC, this.AR);
				return;
			case 0o262: /* POP */
				this.AB = this.BR & RM;
				if (this.memRead(0, 0, 0, 0)) return;
				this.histMb(this.MB);
				this.AB = this.AR & RM;
				this.MQ = this.BR;
				this.BR = this.BR + 0o777776777777;
				this.AR = m36(this.BR);
				this.setReg(this.AC, this.AR);
				if (this.memWrite(0, 0)) {
					this.setReg(this.AC, this.MQ);
					return;
				}
				if (!c1(this.BR)) {
					this.push_ovf = 1;
					this.checkAprIrq();
				}
				return;
			case 0o263: /* POPJ */
				this.AB = this.BR & RM;
				this.BR = this.BR + 0o777776777777;
				if (this.histLen) this.hist[this.histP]!.ea = this.AB;
				if (this.memRead(0, 0, 0, 0)) return;
				if (this.its && this.FLAGS & USER) this.jpc = this.PC;
				this.f_pc_inh = 1;
				this.PC = this.MB & RM;
				if (!c1(this.BR)) {
					this.push_ovf = 1;
					this.checkAprIrq();
				}
				this.AR = m36(this.BR);
				this.setReg(this.AC, this.AR);
				return;
			case 0o264: /* JSR */
				this.AR &= RM;
				this.MB = ((this.FLAGS << 5) & RM) * TWO18 + ((this.PC + (this.pi_cycle ? 0 : 1)) & RM);
				if (this.uuo_cycle | this.pi_cycle) this.FLAGS &= ~USER;
				if (this.memWrite(0, 0)) return;
				this.FLAGS &= ~BYTI;
				if (this.its && this.FLAGS & USER) this.jpc = this.PC;
				this.PC = (this.AR + 1) & RM;
				this.f_pc_inh = 1;
				return;
			case 0o265: /* JSP */
				this.AD = ((this.FLAGS << 5) & RM) * TWO18 + ((this.PC + (this.pi_cycle ? 0 : 1)) & RM);
				this.FLAGS &= ~BYTI;
				if (this.uuo_cycle | this.pi_cycle) this.FLAGS &= ~USER;
				if (this.its && this.FLAGS & USER) this.jpc = this.PC;
				this.PC = this.AR & RM;
				this.AR = this.AD;
				this.f_pc_inh = 1;
				this.setReg(this.AC, this.AR);
				return;
			case 0o266: /* JSA */
				this.AR = (this.AR & RM) * TWO18 + ((this.PC + 1) & RM);
				this.MB = this.BR;
				this.setReg(this.AC, this.AR);
				if (this.uuo_cycle | this.pi_cycle) this.FLAGS &= ~USER;
				if (this.its && this.FLAGS & USER) this.jpc = this.PC;
				this.PC = this.AB;
				this.memWrite(0, 0);
				return;
			case 0o267: /* JRA */ {
				const ad = this.AB;
				this.AB = LH(this.getReg(this.AC));
				if (this.memRead(this.uuo_cycle | this.pi_cycle, 0, 0, 0)) return;
				this.setReg(this.AC, this.MB);
				if (this.its && this.FLAGS & USER) this.jpc = this.PC;
				this.PC = ad & RM;
				this.f_pc_inh = 1;
				return;
			}
			case 0o270:
			case 0o271:
			case 0o272:
			case 0o273: /* ADD */
				if (!this.operand()) return;
				this.flag1 = this.flag3 = 0;
				if (lo35(this.AR) + lo35(this.BR) >= TWO35) {
					this.FLAGS |= CRY1;
					this.flag1 = 1;
				}
				this.AR = this.AR + this.BR;
				if (this.AR >= TWO36) {
					if (!this.pi_cycle) this.FLAGS |= CRY0;
					this.flag3 = 1;
				}
				this.addSubDone();
				return;
			case 0o274:
			case 0o275:
			case 0o276:
			case 0o277: /* SUB */
				if (!this.operand()) return;
				this.flag1 = this.flag3 = 0;
				if (CCM(this.AR) + lo35(this.BR) + 1 >= TWO35) {
					this.FLAGS |= CRY1;
					this.flag1 = 1;
				}
				this.AR = CM(this.AR) + this.BR + 1;
				if (this.AR >= TWO36) {
					if (!this.pi_cycle) this.FLAGS |= CRY0;
					this.flag3 = 1;
				}
				this.addSubDone();
				return;
		}
		if (IR >= 0o300 && IR < 0o400) {
			this.cmpJumpSkip();
			return;
		}
		if (IR >= 0o400 && IR < 0o500) {
			this.logic();
			return;
		}
		if (IR >= 0o500 && IR < 0o600) {
			this.halfword();
			return;
		}
		if (IR >= 0o600 && IR < 0o700) {
			this.test();
			return;
		}
		this.io();
	}

	private operand(): boolean {
		switch (this.IR & 3) {
			case 0:
				if (this.memRead(0, 0, 0, 0)) return false;
				this.AR = this.MB;
				return true;
			case 1:
				this.AR &= RM;
				return true;
			default:
				if (this.memRead(0, 0, 0, 1)) return false;
				this.AR = this.MB;
				return true;
		}
	}

	private addSubDone(): void {
		if (this.flag1 !== this.flag3 && !this.pi_cycle) {
			this.FLAGS |= OVR;
			this.checkAprIrq();
		}
		this.AR = m36(this.AR);
		if ((this.IR & 2) === 2) {
			this.MB = this.AR;
			if (this.memWrite(0, 0)) return;
		}
		if ((this.IR & 3) !== 2) this.setReg(this.AC, this.AR);
	}

	private compare(): void {
		this.f = 0;
		this.AD = CM(this.AR) + this.BR + 1;
		const bn = neg(this.BR);
		const an = neg(this.AR);
		if (bn && !an) this.f = 1;
		if (bn === an && neg(this.AD)) this.f = 1;
	}

	/** 300–377: CAI, CAM, JUMP, SKIP, AOJ, AOS, SOJ, SOS. */
	private cmpJumpSkip(): void {
		const IR = this.IR;
		switch (IR & 0o70) {
			case 0o00:
				this.AR &= RM;
				this.compare();
				this.skipOp();
				return;
			case 0o10:
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.compare();
				this.skipOp();
				return;
			case 0o20:
				this.AD = this.BR;
				this.BR = this.AR & RM;
				this.f = neg(this.AD) ? 1 : 0;
				this.jumpOp();
				return;
			case 0o30:
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.AD = this.AR;
				this.f = neg(this.AD) ? 1 : 0;
				this.skipOp();
				return;
			case 0o40:
			case 0o60:
				this.addOne(this.BR);
				this.jumpOp();
				return;
			default:
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = this.MB;
				this.addOne(this.AR);
				this.skipOp();
				return;
		}
	}

	/** AD = x + 1 or x - 1, by bit 20 of the opcode, with SIMH's carry flags. */
	private addOne(x: number): void {
		this.flag1 = this.flag3 = 0;
		const d = this.IR & 0o20 ? FMASK : 1;
		if (lo35(x) + lo35(d) >= TWO35) {
			if (!this.pi_cycle) this.FLAGS |= CRY1;
			this.flag1 = 1;
		}
		this.AD = x + d;
		if (this.AD >= TWO36) {
			if (!this.pi_cycle) this.FLAGS |= CRY0;
			this.flag3 = 1;
		}
		if (this.flag1 !== this.flag3 && !this.pi_cycle) {
			this.FLAGS |= OVR;
			this.checkAprIrq();
		}
		this.f = neg(this.AD) ? 1 : 0;
	}

	/** 400–477, the sixteen boolean functions of AC and E, in four modes. */
	private logic(): void {
		const IR = this.IR;
		const fn = (IR >> 2) & 0o17;
		const mode = IR & 3;
		switch (fn) {
			case 0: /* SETZ */
				this.AR = 0;
				if (mode === 2 || mode === 3) {
					this.MB = 0;
					if (this.memWrite(0, 0)) return;
					if (mode === 2) return;
				}
				this.setReg(this.AC, 0);
				return;
			case 3: /* SETM */
				if (mode === 1) {
					this.AR &= RM;
					this.setReg(this.AC, this.AR);
					return;
				}
				if (mode === 2) {
					if (this.memRead(0, 0, 0, 1)) return;
					if (this.memWrite(0, 0)) return;
					this.AR = this.MB;
					return;
				}
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.setReg(this.AC, this.AR);
				return;
			case 5: /* SETA */
			case 0o12: /* SETCA */
			case 0o17: /* SETO */ {
				this.AR = fn === 5 ? this.BR : fn === 0o12 ? CM(this.BR) : FMASK;
				if (mode === 2 || mode === 3) {
					this.MB = this.AR;
					if (this.memWrite(0, 0)) return;
					if (mode === 2) return;
				}
				this.setReg(this.AC, this.AR);
				return;
			}
			case 0o16: /* ORCB */
				if (mode === 2) {
					if (this.memRead(0, 0, 0, 0)) return;
					this.AR = CM(and(this.MB, this.BR));
					this.MB = this.AR;
					this.memWrite(0, 0);
					return;
				}
				this.boolOp((a, b) => CM(and(a, b)), mode);
				return;
		}
		this.boolOp(LOGIC[fn]!, mode);
	}

	private halfword(): void {
		const IR = this.IR;
		switch (IR) {
			case 0o500: /* HLL */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = LH(this.MB) * TWO18 + (this.BR & RM);
				this.setReg(this.AC, this.AR);
				return;
			case 0o501:
				this.AR = this.BR & RM;
				this.setReg(this.AC, this.AR);
				return;
			case 0o502: /* HLLM */
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = LH(this.BR) * TWO18 + (this.MB & RM);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o503:
			case 0o543:
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = this.MB;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;
			case 0o547: /* HLRS */
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = LH(this.MB) * TWO18 + LH(this.MB);
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;
			case 0o504: /* HRL */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = (this.MB & RM) * TWO18 + (this.BR & RM);
				this.setReg(this.AC, this.AR);
				return;
			case 0o505:
				this.AR = (this.AR & RM) * TWO18 + (this.BR & RM);
				this.setReg(this.AC, this.AR);
				return;
			case 0o506: /* HRLM */
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = (this.BR & RM) * TWO18 + (this.MB & RM);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o507: /* HRLS */
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = (this.MB & RM) * TWO18 + (this.MB & RM);
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;
			case 0o540: /* HRR */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = LH(this.BR) * TWO18 + (this.MB & RM);
				this.setReg(this.AC, this.AR);
				return;
			case 0o541:
				this.AR = LH(this.BR) * TWO18 + (this.AR & RM);
				this.setReg(this.AC, this.AR);
				return;
			case 0o542: /* HRRM */
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = LH(this.MB) * TWO18 + (this.BR & RM);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o544: /* HLR */
				if (this.memRead(0, 0, 0, 0)) return;
				this.BR = this.getReg(this.AC);
				this.AR = LH(this.BR) * TWO18 + LH(this.MB);
				this.setReg(this.AC, this.AR);
				return;
			case 0o545: /* HLRI: the left half of an immediate is 0 */
				this.AR = LH(this.BR) * TWO18;
				this.setReg(this.AC, this.AR);
				return;
			case 0o546: /* HLRM */
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = LH(this.MB) * TWO18 + LH(this.BR);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o566: /* HLROM reads without the modify cycle, as SIMH does */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = RM * TWO18 + LH(this.BR);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
		}
		// The Z, O and E forms. Bit 040 is the destination half, 004 the source half, 030 the fill.
		const fill = (IR >> 3) & 3;
		const toRight = (IR & 0o40) !== 0;
		const fromLeft = toRight === ((IR & 4) !== 0);
		const ext = (src: number): number => {
			if (!toRight) {
				const f = fill === 1 ? 0 : fill === 2 ? RM : src & RSIGN ? RM : 0;
				return src * TWO18 + f;
			}
			const f = fill === 1 ? 0 : fill === 2 ? RM : src & RSIGN ? RM : 0;
			return f * TWO18 + src;
		};
		const half = (w: number): number => (fromLeft ? LH(w) : w & RM);
		switch (IR & 3) {
			case 0:
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = ext(half(this.MB));
				this.setReg(this.AC, this.AR);
				return;
			case 1:
				this.AR = ext(half(this.AR & RM));
				this.setReg(this.AC, this.AR);
				return;
			case 2:
				this.AR = ext(half(this.getReg(this.AC)));
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			default:
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = ext(half(this.MB));
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;
		}
	}

	private test(): void {
		const IR = this.IR;
		if (IR & 0o10) {
			if (this.memRead(0, 0, 0, 0)) return;
			this.AR = this.MB;
		} else this.AR &= RM;
		if (IR & 1) this.AR = SWAP(this.AR);
		switch (IR & 0o60) {
			case 0o20:
				this.MQ = and(CM(this.AR), this.BR);
				break;
			case 0o40:
				this.MQ = xor(this.AR, this.BR);
				break;
			case 0o60:
				this.MQ = or(this.AR, this.BR);
				break;
		}
		this.AR = and(this.AR, this.BR);
		const f = ((this.AR === 0 ? 1 : 0) & ((IR >> 1) & 1)) ^ ((IR >> 2) & 1);
		if (f) this.PC = (this.PC + 1) & RM;
		this.AR = this.MQ;
		if ((IR & 0o60) !== 0) this.setReg(this.AC, this.AR);
	}

	private blt(): void {
		this.AR = this.BR;
		this.BR = this.AB;
		const ev = this.events;
		for (;;) {
			if (ev.now >= ev.next) {
				ev.process();
				if (this.pi_pending) {
					this.pi_rq = this.checkIrqLevel();
					if (this.pi_rq) {
						this.f_pc_inh = 1;
						this.setReg(this.AC, this.AR);
						return;
					}
				}
			}
			this.AB = LH(this.AR);
			if (this.memRead(0, 0, 0, 0)) {
				this.f_pc_inh = this.its && (this.xct_flag & 4) !== 0 ? 0 : 1;
				if (this.its) this.setReg(this.AC, this.AR);
				return;
			}
			this.AB = this.AR & RM;
			if (this.memWrite(0, 0)) {
				this.f_pc_inh = this.its && (this.xct_flag & 4) !== 0 ? 0 : 1;
				if (this.its) this.setReg(this.AC, this.AR);
				return;
			}
			const done = (this.AR & RM) >= this.BR;
			this.AD = (this.AR & RM) + CM(this.BR) + 1;
			this.AR = this.AR + 0o1000001;
			if (done) return;
		}
	}

	private jrst(): void {
		if (this.uuo_cycle | this.pi_cycle) {
			this.FLAGS &= ~USER;
			if (this.its && this.one_p_arm) {
				this.FLAGS |= ONEP;
				this.one_p_arm = 0;
			}
		}
		if (this.AC & 0o10) {
			if ((this.FLAGS & (USER | USERIO)) === USER) {
				this.uuo(true);
				return;
			}
			this.pi_restore = 1;
		}
		if (this.AC & 4) {
			if ((this.FLAGS & (USER | USERIO)) === USER) {
				this.uuo(true);
				return;
			}
			this.halted = true;
		}
		if (this.its && this.FLAGS & USER) this.jpc = this.PC;
		this.PC = this.AR & RM;
		if (this.AC & 2) {
			this.FLAGS &= ~(OVR | NODIV | FLTUND | BYTI | FLTOVR | CRY1 | CRY0);
			const ar = shr(this.AR, 23) & 0o17777;
			if ((this.FLAGS & USER) === 0) this.FLAGS |= ar & (USER | USERIO);
			if ((ar & USERIO) === 0) this.FLAGS &= ~USERIO;
			this.FLAGS |= ar & (OVR | NODIV | FLTUND | BYTI | FLTOVR | CRY1 | CRY0);
			if (this.its) this.FLAGS |= ar & (PURE | ONEP);
			this.checkAprIrq();
		}
		if (this.AC & 1) this.FLAGS |= USER;
		this.f_pc_inh = 1;
	}

	private lpm(): void {
		const AC = this.AC;
		if (this.AB + 8 >= this.memWords) {
			this.fault_data |= 0o400;
			this.mem_prot = 1;
			this.checkAprIrq();
			return;
		}
		const next = (): void => {
			this.AB = (this.AB + 1) & RM;
		};
		if (AC & 1) {
			const put = (v: number): void => {
				this.MB = v;
				this.wr(this.AB, v);
			};
			put((this.age & 0o17) * POW2[27]! + (this.fault_addr & 0o777) * TWO18 + this.jpc);
			next();
			put(this.opc);
			next();
			put(and(this.mar, 0o777607777777) + this.pag_reload * POW2[21]!);
			next();
			put(this.getQuantum() + this.fault_data * TWO18);
			next();
			put((this.fault_addr & 0o760000) * POW2[13]! + this.dbr1);
			next();
			put((this.fault_addr & 0o37000) * POW2[17]! + this.dbr2);
			next();
			put(this.dbr3);
			next();
			put(this.ac_stack);
		} else {
			const get = (): number => (this.MB = this.rd(this.AB));
			get();
			this.age = shr(this.MB, 27) & 0o17;
			this.jpc = this.MB & RM;
			this.fault_addr = LH(this.MB) & 0o777;
			next();
			this.opc = get();
			next();
			this.mar = get();
			this.pag_reload = 0;
			next();
			get();
			this.qua_time = this.MB & RM;
			this.setQuantum();
			this.fault_data = LH(this.MB);
			this.mem_prot = 0;
			if ((this.fault_data & 0o777772) !== 0) this.mem_prot = 1;
			next();
			get();
			this.dbr1 = this.MB % POW2[26]!;
			this.fault_addr |= shr(this.MB, 13) & 0o760000;
			next();
			get();
			this.fault_addr |= shr(this.MB, 17) & 0o37000;
			this.dbr2 = this.MB % POW2[26]!;
			next();
			get();
			this.dbr3 = this.MB % POW2[26]!;
			next();
			get();
			this.ac_stack = this.MB % POW2[32]!;
			this.page_enable = 1;
			this.checkAprIrq();
		}
		if (AC & 2) {
			this.e_tlb.fill(0);
			this.u_tlb.fill(0, 0, 512);
			this.mem_prot = 0;
			this.checkAprIrq();
		}
		if (AC & 4) {
			this.mem_prot = 1;
			this.checkAprIrq();
		}
	}

	private io(): void {
		if ((this.FLAGS & (USER | USERIO)) === USER && !this.pi_cycle) {
			this.uuo(true);
			return;
		}
		const d = ((this.IR & 0o77) << 1) | ((this.AC & 0o10) !== 0 ? 1 : 0);
		const dev = this.devTab[d]!;
		this.AR &= RM;
		for (;;) {
			switch (this.AC & 7) {
				case 0:
				case 2:
					if (this.memRead(this.pi_cycle, 0, 0, 0)) return;
					this.AR = this.MB;
					this.histMb(this.AR);
					this.AC |= 1;
					this.AR = this.AR + 0o1000001;
					if (c1(this.AR)) this.pi_ov = 1;
					else if (!this.pi_cycle) this.PC = (this.PC + 1) & RM;
					this.AR = m36(this.AR);
					this.MB = this.AR;
					if (this.memWrite(this.pi_cycle, 0)) return;
					this.AB = this.AR & RM;
					continue;
				case 1:
					this.AR = dev(DATAI | (d << 2), this.AR);
					this.MB = this.AR;
					this.memWrite(this.pi_cycle, 0);
					return;
				case 3:
					if (this.memRead(this.pi_cycle, 0, 0, 0)) return;
					this.AR = this.MB;
					this.AR = dev(DATAO | (d << 2), this.AR);
					return;
				case 4:
					this.AR = dev(CONO | (d << 2), this.AR);
					return;
				case 5:
					this.AR = dev(CONI | (d << 2), this.AR);
					this.MB = this.AR;
					this.memWrite(this.pi_cycle, 0);
					return;
				case 6:
					this.AR = and(dev(CONI | (d << 2), this.AR), this.AB);
					if (this.AR === 0) this.PC = (this.PC + 1) & RM;
					return;
				default:
					this.AR = and(dev(CONI | (d << 2), this.AR), this.AB);
					if (this.AR !== 0) this.PC = (this.PC + 1) & RM;
					return;
			}
		}
	}
}

/** The boolean functions by bits 2–5 of the opcode, as functions of (E, AC). SETZ, SETM, SETA, SETCA, ORCB and SETO are written out. */
const LOGIC: readonly ((a: number, b: number) => number)[] = [
	() => 0,
	(a, b) => and(a, b),
	(a, b) => and(a, CM(b)),
	(a) => a,
	(a, b) => and(CM(a), b),
	(_a, b) => b,
	(a, b) => xor(a, b),
	(a, b) => or(a, b),
	(a, b) => and(CM(a), CM(b)),
	(a, b) => CM(xor(a, b)),
	(_a, b) => CM(b),
	(a, b) => or(a, CM(b)),
	(a) => CM(a),
	(a, b) => or(CM(a), b),
	(a, b) => CM(and(a, b)),
	() => FMASK,
];

const STATE_WORDS = ["AR", "MQ", "BR", "AD", "MB", "SW", "MI", "opc", "mar"] as const;
const STATE_NUMBERS = [
	"AB", "PC", "IR", "AC", "FLAGS", "BYF5", "uuo_cycle", "SC", "SCAD", "FE", "last_addr",
	"Pl", "Ph", "Rl", "Rh", "Pflag", "push_ovf", "mem_prot", "nxm_flag", "adr_flag", "clk_flg",
	"ov_irq", "fov_irq", "IOB_PI", "PIR", "PIH", "PIE", "pi_cycle", "pi_enable", "parity_irq",
	"pi_pending", "pi_enc", "apr_irq", "clk_en", "clk_irq", "pi_restore", "pi_hold", "modify",
	"xct_flag", "pi_vect", "page_enable", "ac_stack", "pag_reload", "fault_data", "mpx_enable",
	"dbr1", "dbr2", "dbr3", "jpc", "age", "fault_addr", "qua_time", "maoff",
	"f_load_pc", "f_inst_fetch", "f_pc_inh", "pi_rq", "pi_ov", "one_p_arm", "IA", "nrf",
	"fxu_hold_set", "flag1", "flag3", "f",
] as const;
