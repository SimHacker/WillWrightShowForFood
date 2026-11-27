import {
	ADR_BREAK,
	ADR_DFETCH,
	ADR_IFETCH,
	ADR_STOP,
	ADR_WRITE,
	ADRFLT,
	AOB,
	BIT7,
	BIT8,
	BIT9,
	BIT17_N,
	BYTI,
	C1,
	CCM,
	CM,
	CMASK,
	CONI,
	CONO,
	CRY0,
	CRY1,
	DATAI,
	DATAO,
	EXPO,
	FLTOVR,
	FLTUND,
	FMASK,
	FP1BIT,
	FPFMASK,
	FPHBIT,
	FPNBIT,
	FPRBIT1,
	FPRBIT2,
	FPRMASK,
	FPSBIT,
	LMASK,
	MANT,
	MMASK,
	NODIV,
	ONEP,
	OVR,
	PCHNG,
	PMASK,
	PUBLIC,
	PURE,
	RMASK,
	RMASK_N,
	RSIGN,
	RSIGN_N,
	SMASK,
	SOB,
	SWAP,
	TRP1,
	TRP2,
	U64,
	USER,
	USERIO,
	oct,
	shl,
	shr,
	type DevIo,
} from "./defs.js";
import { Events, type Unit } from "./events.js";

export type Ka10Opts = {
	/** Words of core, 16K to 1024K. ITS on MIT-AI's configuration wants 1024K. */
	memWords?: number;
	/** MIT's paging box, which ITS needs. Off is DEC's relocation pair. */
	its?: boolean;
	/** MIT's channel 1 multiplex: seven more interrupt levels, at 62–77. */
	mpx?: boolean;
};

/** One line of SIMH's instruction history, the fields `show history` prints. */
export type HistEntry = { pc: number; ea: number; ir: bigint; ac: bigint; flags: number; mb: bigint; fmb: bigint; second: boolean };

/** Why `run` stopped. */
export type Stop = "budget" | "halt" | "breakpoint";

const HIST_PC2 = 0x80000000;

/** Saved processor state, YAML-shaped: numbers, and 36-bit words as octal strings. */
export type Ka10State = Record<string, number | string | number[] | string[]>;

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

/**
 * A KA10, the reference rung: a line-for-line TypeScript port of the KA10 and
 * ITS paths of SIMH's PDP10/kx10_cpu.c (Richard Cornwell), with MIT's paging
 * box and channel 1 multiplex. Register names, flag names and the order of
 * every memory reference are SIMH's, so an instruction history from this and
 * one from SIMH's `pdp10-ka` line up. See PDP10.md.
 */
export class Ka10 {
	readonly memWords: number;
	readonly its: boolean;
	readonly mpx: boolean;
	readonly M: BigUint64Array;
	readonly FM = new BigUint64Array(16);
	readonly events = new Events();
	readonly devTab: DevIo[] = [];
	private readonly resets: (() => void)[] = [];

	AR = 0n;
	MQ = 0n;
	BR = 0n;
	AD = 0n;
	MB = 0n;
	AB = 0;
	PC = 0;
	IR = 0;
	AC = 0;
	FLAGS = 0;
	SW = 0n;
	MI = 0n;
	MI_flag = 0;
	MI_disable = 0;
	AS = 0;
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
	opc = 0n;
	mar = 0n;
	qua_time = 0;
	maoff = 0;
	watch_stop = 0;
	readonly dev_irq = new Uint16Array(128);

	/** sim_instr's locals that live from one instruction to the next. */
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

	/** Stopped by HALT; `run` returns until cleared. */
	halted = false;
	/** Instructions executed, counted where SIMH counts a step. */
	instructions = 0;
	/** Stop when PC reaches one of these, as SIMH's `break`. */
	readonly breakpoints = new Set<number>();
	private broke = false;

	private hist: HistEntry[] = [];
	private histLen = 0;
	private histP = 0;

	readonly rtc: Unit = { name: "rtc", svc: () => this.rtcSrv() };
	readonly qua: Unit = { name: "qua", svc: () => this.quaSrv() };
	/** SIMH recalibrates this from the clock; here it is half a tick, as rtc_srv sets it. */
	tmxrPoll = 0;
	rtcTps = 60;

	constructor(opts: Ka10Opts = {}) {
		this.memWords = opts.memWords ?? 256 * 1024;
		this.its = opts.its ?? true;
		this.mpx = opts.mpx ?? this.its;
		this.M = new BigUint64Array(this.memWords);
		for (let i = 0; i < 128; i++) this.devTab[i] = (dev, data) => this.nullDev(dev, data);
		this.devTab[0] = (dev, data) => this.devApr(dev, data);
		this.devTab[1] = (dev, data) => this.devPi(dev, data);
		this.tmxrPoll = Math.floor((1_000_000 / this.rtcTps) * this.events.ticksPerUsec) / 2;
	}

	/** Plug a device's I/O routine in at its device code (0120 for the console, 0250 for the RP10…). */
	attachDevice(devcode: number, io: DevIo, reset?: () => void): void {
		this.devTab[devcode >> 2] = io;
		if (reset) this.resets.push(reset);
	}

	/** Every device's reset, as SIMH's reset_all(1) after the CPU. */
	resetDevices(): void {
		for (const r of this.resets) r();
	}

	/** The power-on reset of SIMH's cpu_reset, then every device. */
	reset(): void {
		this.RUNreset();
		this.resetDevices();
	}

	private RUNreset(): void {
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
	}

	/** Keep the last `n` instructions, as SIMH's `set cpu history=n`. */
	setHistory(n: number): void {
		this.histLen = n;
		this.histP = 0;
		this.hist = n ? Array.from({ length: n }, () => ({ pc: 0, ea: 0, ir: 0n, ac: 0n, flags: 0, mb: 0n, fmb: 0n, second: false })) : [];
	}

	/** The history oldest first, printed like SIMH's `show history` without the disassembly. */
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

	// ---- interrupts ---------------------------------------------------------

	setInterrupt(dev: number, lvl: number): void {
		lvl &= 7;
		if (lvl) {
			this.dev_irq[dev >> 2] = 0o200 >> lvl;
			this.pi_pending = 1;
			this.IOB_PI |= 0o200 >> lvl;
		}
	}

	setInterruptMpx(dev: number, lvl: number, mpx: number): void {
		lvl &= 7;
		if (lvl) {
			this.dev_irq[dev >> 2] = 0o200 >> lvl;
			if (lvl === 1 && mpx !== 0) this.dev_irq[dev >> 2]! |= mpx << 8;
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

	private devPi(dev: number, data: bigint): bigint {
		switch (dev & 3) {
			case CONO: {
				const res = Number(data & RMASK);
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
				return BigInt(this.PIE | (this.pi_enable << 7) | (this.PIH << 8)) | (BigInt(this.parity_irq) << 15n);
			case DATAO:
				this.MI = data;
				this.MI_flag = this.MI_disable ? 0 : 1;
				return data;
			default:
				return data;
		}
	}

	private nullDev(dev: number, data: bigint): bigint {
		switch (dev & 3) {
			case CONI:
			case DATAI:
				return 0n;
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

	private devApr(dev: number, data: bigint): bigint {
		switch (dev & 3) {
			case CONI: {
				let res = this.apr_irq | (((this.FLAGS & OVR) !== 0 ? 1 : 0) << 3) | (this.ov_irq << 4);
				res |= (((this.FLAGS & FLTOVR) !== 0 ? 1 : 0) << 6) | (this.fov_irq << 7);
				res |= (this.clk_flg << 9) | (this.clk_en << 10) | (this.nxm_flag << 12);
				res |= (this.mem_prot << 13) | (((this.FLAGS & USERIO) !== 0 ? 1 : 0) << 15);
				res |= (this.adr_flag << 14) | (this.push_ovf << 16) | (this.maoff >> 1);
				return BigInt(res);
			}
			case CONO: {
				const res = Number(data & RMASK);
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
			case DATAO:
				this.Rh = Number(0o377n & (data >> 1n)) << 10;
				this.Rl = Number(0o377n & (data >> 10n)) << 10;
				this.Pflag = Number(1n & (data >> 18n));
				this.Ph = (Number(0o377n & (data >> 19n)) << 10) + 0o1777;
				this.Pl = (Number(0o377n & (data >> 28n)) << 10) + 0o1777;
				return data;
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

	private loadQuantum(): void {
		if (this.events.isActive(this.qua)) {
			const us = Math.floor(this.events.usecsLeft(this.qua));
			this.qua_time = us > BIT17_N ? BIT17_N : (BIT17_N - us) & RMASK_N;
			this.events.cancel(this.qua);
		}
	}

	private getQuantum(): number {
		let t = this.qua_time;
		if (this.events.isActive(this.qua)) {
			const us = Math.floor(this.events.usecsLeft(this.qua));
			t = (BIT17_N - us) & RMASK_N;
		}
		return t;
	}

	// ---- memory -----------------------------------------------------------------

	private addressConditions(fetch: number, write: number): void {
		const cond = fetch ? ADR_IFETCH : write ? ADR_WRITE : ADR_DFETCH;
		if (this.adr_cond & cond) {
			if (this.adr_cond & ADR_STOP) this.watch_stop = 1;
			if (this.adr_cond & ADR_BREAK) this.adr_flag = 1;
		}
		this.checkAprIrq();
	}

	private getReg(r: number): bigint {
		return this.FM[r & 0o17]!;
	}

	private setReg(r: number, v: bigint): void {
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
		let data = this.M[entry]!;
		if (page & 1) {
			data &= ~0o36000n;
			data |= BigInt(this.age & 0o17) << 10n;
		} else {
			data &= ~(0o36000n << 18n);
			data |= BigInt(this.age & 0o17) << 28n;
		}
		this.M[entry] = data;
		if ((page & 1) === 0) data >>= 18n;
		tlb[idx] = Number(data & RMASK);
		this.pag_reload = (this.pag_reload + 1) & 0o17;
		return false;
	}

	/** Translate through MIT's pager: the physical address, or -1 on a fault. */
	private pageLookupIts(addr: number, flag: number, wr: number, cur_context: number, fetch: number, modify: number): number {
		let data = 0;
		const page = (RMASK_N & addr) >> 10;
		let uf = (this.FLAGS & USER) !== 0 ? 1 : 0;
		const fstr = (this.fault_data & 0o770) === 0;
		let loc = 0;

		if (this.adr_cond && addr === this.AS) this.addressConditions(fetch, wr);
		if (!this.page_enable) return addr;

		if (flag) uf = 0;
		else if (this.xct_flag !== 0 && !cur_context) {
			if (((this.xct_flag & 2) !== 0 && wr !== 0) || ((this.xct_flag & 1) !== 0 && (wr === 0 || modify))) uf = 1;
		}
		wr |= modify;

		if (BigInt(addr) === (this.mar & RMASK) && uf === (((this.mar >> 18n) & 4n) !== 0n ? 1 : 0)) {
			switch (Number((this.mar >> 18n) & 3n)) {
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
			const acc = (data >> 16) & 3;
			switch (acc) {
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
			this.PC = (this.PC + 1) & RMASK_N;
		}
		return -1;
	}

	private pageLookupKa(addr: number, flag: number, wr: number, fetch: number): number {
		if (this.adr_cond && addr === this.AS) this.addressConditions(fetch, wr);
		if (!flag && (this.FLAGS & USER) !== 0) {
			if (addr <= this.Pl) return (addr + this.Rl) & RMASK_N;
			if (this.twoseg && (addr & 0o400000) !== 0 && addr <= this.Ph) {
				if (this.Pflag === 0 || (this.Pflag === 1 && wr === 0)) return (addr + this.Rh) & RMASK_N;
			}
			this.mem_prot = 1;
			this.checkAprIrq();
			return -1;
		}
		return addr;
	}

	/** SIMH's Mem_read: true if the reference failed. */
	memRead(flag: number, cur_context: number, fetch: number, mod: number): boolean {
		if (this.AB < 0o20) {
			if (this.its && (this.xct_flag & 1) !== 0 && !cur_context) {
				this.MB = this.M[(this.ac_stack & 0o1777777) + this.AB]!;
				if (fetch === 0 && this.histLen) this.hist[this.histP]!.mb = this.MB;
				return false;
			}
			this.MB = this.getReg(this.AB);
		} else {
			const addr = this.its ? this.pageLookupIts(this.AB, flag, 0, cur_context, fetch, mod) : this.pageLookupKa(this.AB, flag, mod, fetch);
			if (addr < 0) return true;
			if (addr >= this.memWords) {
				this.nxm_flag = 1;
				this.checkAprIrq();
				return true;
			}
			if (this.watchReads && this.watchReads.has(this.AB)) this.watch_stop = 1;
			this.events.now++;
			this.MB = this.M[addr]!;
			this.last_addr = addr;
			this.modify = mod;
		}
		if (fetch === 0 && this.histLen) this.hist[this.histP]!.mb = this.MB;
		return false;
	}

	/** SIMH's Mem_write: true if the reference failed. */
	memWrite(flag: number, cur_context: number): boolean {
		if (this.AB < 0o20) {
			if (this.its && (this.xct_flag & 2) !== 0 && !cur_context) {
				this.M[(this.ac_stack & 0o1777777) + this.AB] = this.MB;
				return false;
			}
			this.setReg(this.AB, this.MB);
			return false;
		}
		if (this.its && this.modify) {
			this.M[this.last_addr] = this.MB;
			this.modify = 0;
			return false;
		}
		const addr = this.its ? this.pageLookupIts(this.AB, flag, 1, cur_context, 0, 0) : this.pageLookupKa(this.AB, flag, 1, 0);
		if (addr < 0) return true;
		if (addr >= this.memWords) {
			this.nxm_flag = 1;
			this.checkAprIrq();
			return true;
		}
		if (this.watchWrites && this.watchWrites.has(this.AB)) this.watch_stop = 1;
		this.events.now++;
		this.M[addr] = this.MB;
		return false;
	}

	/** Physical memory, for devices: false if past the end of core. */
	readWord(addr: number): bigint | undefined {
		return addr < this.memWords ? this.M[addr]! : undefined;
	}

	writeWord(addr: number, v: bigint): boolean {
		if (addr >= this.memWords) return false;
		this.M[addr] = v;
		return true;
	}

	/** Core in SIMH's format, the KA10's save format for every rung: one little-endian uint64 per word. */
	saveMemory(): Uint8Array {
		const out = new Uint8Array(this.memWords * 8);
		const view = new DataView(out.buffer);
		for (let i = 0; i < this.memWords; i++) view.setBigUint64(i * 8, this.M[i]!, true);
		return out;
	}

	loadMemory(bytes: Uint8Array): void {
		const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
		const n = Math.min(this.memWords, Math.floor(bytes.byteLength / 8));
		for (let i = 0; i < n; i++) this.M[i] = view.getBigUint64(i * 8, true) & FMASK;
		this.M.fill(0n, n);
	}

	/** The processor's saved state: SIMH's globals, the loop's locals and the clock. Words are octal strings. */
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
		for (const k of STATE_WORDS) if (typeof s[k] === "string") this[k] = BigInt(`0o${s[k] as string}`);
		const words = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);
		const nums = (v: unknown): number[] => (Array.isArray(v) ? (v as number[]) : []);
		words(s.FM).forEach((w, i) => (this.FM[i] = BigInt(`0o${w}`)));
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

	/** Watched addresses, as SIMH's `break -r` and `break -w`. */
	watchReads: Set<number> | undefined;
	watchWrites: Set<number> | undefined;

	/** Examine a word the way the console does: 0–17 are the accumulators. */
	examine(addr: number): bigint {
		return addr < 0o20 ? this.FM[addr]! & FMASK : (this.M[addr] ?? 0n) & FMASK;
	}

	deposit(addr: number, v: bigint): void {
		if (addr < 0o20) this.FM[addr] = v & FMASK;
		else this.M[addr] = v & FMASK;
	}

	// ---- the instruction loop ---------------------------------------------------

	/**
	 * Run until `budget` more ticks of SIMH time have passed, or HALT, or a
	 * breakpoint. One pass of the loop is one pass of SIMH's sim_instr loop.
	 */
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
			if (this.watch_stop) {
				this.watch_stop = 0;
				return "breakpoint";
			}
			this.cycle();
			if (this.halted) return "halt";
		}
		return "budget";
	}

	/** Run whole instructions, as SIMH's `step n`. */
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
			// 0: fetch, 1: no_fetch, 2: the indirect chain, 3: last
			if (entry === 0) {
				if (this.its && this.pi_cycle === 0 && this.mem_prot === 0) {
					this.opc = BigInt(this.PC + this.FLAGS * 0o1000000);
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
				this.IR = Number((this.MB >> 27n) & 0o777n);
				this.AC = Number((this.MB >> 23n) & 0o17n);
				this.AD = this.MB;
				this.IA = this.AB;
				this.BYF5 = 0;
				entry = 2;
			}
			if (entry === 2) {
				let failed = false;
				let ind = 0;
				do {
					ind = (this.MB & 0o20000000n) !== 0n ? 1 : 0;
					this.AR = this.MB;
					this.AB = Number(this.MB & RMASK);
					const ix = Number((this.MB >> 18n) & 0o17n);
					if (ix) {
						this.AR = this.MB = (BigInt(this.AB) + this.getReg(ix)) & FMASK;
						this.AB = Number(this.MB & RMASK);
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
						h.ir = this.AD;
						h.flags = (this.FLAGS << 5) | (this.clk_flg << 2) | (this.nxm_flag << 1) | (this.mem_prot << 4) | (this.push_ovf << 3);
						h.mb = this.AR;
						h.ac = this.getReg(this.AC);
					}
					this.f_inst_fetch = 1;
					this.f_load_pc = 1;
					this.nrf = 0;
					this.fxu_hold_set = 0;
					this.modify = 0;
					this.f_pc_inh = 0;
					this.BR = this.getReg(this.AC);
					this.execute();
					if (this.histLen) this.hist[this.histP]!.fmb = this.AR;
					entry = 3;
				}
			}
			// last:
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

	/** The code after SIMH's `last:` label. True means `goto no_fetch`. */
	private last(): boolean {
		this.modify = 0;
		if (!this.f_pc_inh && !this.pi_cycle) this.PC = (this.PC + 1) & RMASK_N;
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

	/** The UUO cases: `muuo` true is a monitor UUO, through 40 in exec mode. */
	private uuo(muuo: boolean): void {
		if (muuo) this.uuo_cycle = 1;
		this.MB = (BigInt(this.IR) << 27n) | (BigInt(this.AC) << 23n) | BigInt(this.AB);
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

	/** Unassigned opcodes trap through 60. */
	private unasign(): void {
		this.MB = (BigInt(this.IR) << 27n) | (BigInt(this.AC) << 23n) | BigInt(this.AB);
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

	private ldbPtr(): void {
		this.f_load_pc = 0;
		this.f_inst_fetch = 0;
		this.f_pc_inh = 1;
		this.FLAGS |= BYTI;
		this.BYF5 = 1;
		if (this.its && this.pi_cycle === 0 && this.mem_prot === 0) this.opc = BigInt(this.PC + this.FLAGS * 0o1000000);
	}

	/** Read the operand for the four modes of a floating instruction: false if the read failed. */
	private fpOperand(): boolean {
		switch (this.IR & 7) {
			case 5:
				this.AR &= RMASK;
				this.AR = SWAP(this.AR);
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

	private negate(): void {
		this.flag1 = this.flag3 = 0;
		this.AD = CM(this.AR) + 1n;
		if ((CCM(this.AR) + 1n) & SMASK) {
			this.FLAGS |= CRY1;
			this.flag1 = 1;
		}
		if (this.AD & C1) {
			this.FLAGS |= CRY0;
			this.flag3 = 1;
		}
		if (this.flag1 !== this.flag3 && !this.pi_cycle) this.FLAGS |= OVR | TRP1;
		this.AR = this.AD & FMASK;
	}

	private smear(x: bigint): bigint {
		return x & SMASK ? x | EXPO : x & MANT;
	}

	private getExpo(x: bigint): number {
		return (x & SMASK ? 0o377 : 0) ^ Number((x >> 27n) & 0o377n);
	}

	private fadd(): void {
		this.flag3 = 0;
		this.SC = Number((this.BR >> 27n) & 0o777n);
		if ((this.BR & SMASK) === (this.AR & SMASK)) this.SCAD = this.SC + (Number((this.AR >> 27n) & 0o777n) ^ 0o777) + 1;
		else this.SCAD = this.SC + Number((this.AR >> 27n) & 0o777n);
		this.SCAD &= 0o777;
		if ((this.BR & SMASK) !== 0n === ((this.SCAD & 0o400) !== 0)) {
			this.AD = this.AR;
			this.AR = this.BR;
			this.BR = this.AD;
		}
		if ((this.SCAD & 0o400) === 0) {
			if ((this.AR & SMASK) === (this.BR & SMASK)) this.SCAD = ((this.SCAD ^ 0o777) + 1) & 0o777;
			else this.SCAD = this.SCAD ^ 0o777;
		} else if ((this.AR & SMASK) !== (this.BR & SMASK)) this.SCAD = (this.SCAD + 1) & 0o777;
		this.SC = this.getExpo(this.AR);
		this.AR = this.smear(this.AR);
		this.BR = this.smear(this.BR);
		this.AR = shl(this.AR, 34);
		this.BR = shl(this.BR, 34);
		if (this.SCAD & 0o400) {
			this.SCAD = 0o1000 - this.SCAD;
			if (this.SCAD < 61) {
				this.AD = this.BR & FPSBIT ? FPFMASK : 0n;
				this.BR = shr(this.BR, this.SCAD) | shl(this.AD, 61 - this.SCAD);
			} else if (this.SCAD < 65) this.BR = this.BR & FPSBIT ? FPFMASK : 0n;
			else this.BR = 0n;
		}
		this.AR = U64(this.AR + this.BR);
		this.flag1 = (this.AR & FPSBIT) !== 0n ? 1 : 0;
		this.fnorm();
	}

	/** SIMH's `fnorm:` label: normalize, round, and store a floating result. */
	private fnorm(): void {
		if ((this.AR & FPSBIT) !== 0n !== ((this.AR & FPNBIT) !== 0n)) {
			this.SC += 1;
			this.flag3 = Number(this.AR & 1n);
			this.AR = (this.AR & FPHBIT) | (this.AR >> 1n);
		}
		if (this.AR !== 0n) {
			this.AR &= ~0o77n;
			if (((this.SC & 0o400) !== 0) !== ((this.SC & 0o200) !== 0)) this.fxu_hold_set = 1;
			if (this.IR !== 0o130 && this.IR !== 0o247) {
				for (;;) {
					while (this.AR !== 0n && (this.AR & FPSBIT) !== 0n === ((this.AR & FPNBIT) !== 0n) && (this.AR & FPNBIT) !== 0n === ((this.AR & FP1BIT) !== 0n)) {
						this.SC--;
						this.AR = shl(this.AR, 1);
					}
					if ((this.AR & 0o777777777600000000000n) === (FPSBIT | FPNBIT)) {
						this.SC++;
						this.AR = (this.AR & FPHBIT) | (this.AR >> 1n);
					}
					if (!this.nrf && (this.IR & 4) !== 0) {
						const f = (this.AR & FP1BIT) !== 0n;
						if ((this.AR & FPRBIT2) !== 0n) {
							if (((this.IR & 0o70) !== 0o70 && (this.AR & FPSBIT) !== 0n && (this.AR & FPRMASK) !== FPRBIT2) || (this.AR & FPSBIT) === 0n || (this.AR & FPRMASK) !== FPRBIT2)
								this.AR = U64(this.AR + FPRBIT1);
							this.nrf = 1;
							this.AR &= ~FPRMASK & FPFMASK;
							this.flag3 = 0;
							if ((this.AR & FP1BIT) !== 0n !== f) {
								this.SC += 1;
								this.flag3 = Number(this.AR & 1n);
								this.AR = (this.AR & FPHBIT) | (this.AR >> 1n);
							}
							continue;
						}
					}
					break;
				}
			}
			this.MQ = this.AR & FPRMASK;
			this.AR >>= 34n;
			if (this.flag1) this.AR |= SMASK;
		} else {
			this.AR = this.MQ = 0n;
			this.SC = 0;
		}
		if ((this.SC & 0o400) !== 0 && !this.pi_cycle) {
			this.FLAGS |= OVR | FLTOVR | TRP1;
			if (!this.fxu_hold_set) {
				this.FLAGS |= FLTUND;
				this.MQ = 0n;
			}
			this.checkAprIrq();
		}
		this.SCAD = this.SC ^ (this.AR & SMASK ? 0o377 : 0);
		this.AR &= SMASK | MMASK;
		this.AR |= BigInt(this.SCAD & 0o377) << 27n;
		if ((this.IR & 7) === 1) {
			this.SC = (this.SC + (0o777 ^ 26)) & 0o777;
			if ((this.SC & 0o400) !== 0) this.MQ = 0n;
			this.MQ = (this.MQ >> 7n) & MMASK;
			if (this.MQ !== 0n) {
				this.SC ^= this.SC & Number(SMASK & 0o777n) ? 0o377 : 0;
				this.MQ |= BigInt(this.SC & 0o377) << 27n;
			}
		}
		if ((this.AR & MMASK) === 0n) this.AR = 0n;
		if (this.IR === 0o130) {
			this.setReg(this.AC + 1, this.AR);
			return;
		}
		if (this.IR === 0o127 || this.IR === 0o132) {
			this.setReg(this.AC, this.AR & FMASK);
			return;
		}
		this.fpStore(true);
	}

	/** Where a floating result goes, by mode; `long` is whether mode 1 stores MQ in AC+1. */
	private fpStore(long: boolean): void {
		switch (this.IR & 7) {
			case 1:
				if (long) this.setReg(this.AC + 1, this.MQ & FMASK);
			// falls through
			case 5:
			case 0:
			case 4:
				this.setReg(this.AC, this.AR & FMASK);
				break;
			case 2:
			case 6:
				this.MB = this.AR;
				this.memWrite(0, 0);
				break;
			case 3:
			case 7:
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				this.setReg(this.AC, this.AR & FMASK);
				break;
		}
	}

	/** SIMH's `skip_op:` label. */
	private skipOp(): void {
		this.AR = this.AD & FMASK;
		this.f |= (this.AR === 0n ? 1 : 0) << 1;
		this.f = this.f & this.IR;
		if (((this.IR & 4) !== 0) === (this.f === 0)) this.PC = (this.PC + 1) & RMASK_N;
		if ((this.IR & 0o60) !== 0 && this.AC !== 0) this.setReg(this.AC, this.AR);
		if ((this.IR & 0o40) !== 0) {
			this.MB = this.AR;
			this.memWrite(0, 0);
		}
	}

	/** SIMH's `jump_op:` label. */
	private jumpOp(): void {
		this.AD &= FMASK;
		this.AR = this.AD;
		this.f |= (this.AD === 0n ? 1 : 0) << 1;
		this.f = this.f & this.IR;
		if (((this.IR & 4) !== 0) === (this.f === 0)) {
			if (this.its && this.FLAGS & USER) this.jpc = this.PC;
			this.PC = this.AB;
			this.f_pc_inh = 1;
		}
		this.AR &= FMASK;
		if ((this.IR & 0o40) !== 0) this.setReg(this.AC, this.AR);
	}

	/** A boolean result: 0 to AC, 1 to AC immediate, 2 to memory, 3 to both. */
	private boolOp(fn: (a: bigint, b: bigint) => bigint, mode: number, readMem: boolean): void {
		switch (mode) {
			case 0:
				if (readMem) {
					if (this.memRead(0, 0, 0, 0)) return;
					this.AR = this.MB;
				}
				this.AR = fn(this.AR, this.BR);
				this.setReg(this.AC, this.AR);
				return;
			case 1:
				this.AR &= RMASK;
				this.AR = fn(this.AR, this.BR);
				this.setReg(this.AC, this.AR);
				return;
			case 2:
				if (readMem) {
					if (this.memRead(0, 0, 0, 1)) return;
					this.AR = this.MB;
				}
				this.AR = fn(this.AR, this.BR);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			default:
				if (readMem) {
					if (this.memRead(0, 0, 0, 1)) return;
					this.AR = this.MB;
				}
				this.AR = fn(this.AR, this.BR);
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				this.setReg(this.AC, this.AR);
				return;
		}
	}

	private execute(): void {
		const IR = this.IR;
		switch (IR) {
			case 0o052:
			case 0o053:
			case 0o000:
			case 0o040:
			case 0o041:
			case 0o042:
			case 0o043:
			case 0o044:
			case 0o045:
			case 0o046:
			case 0o047:
			case 0o050:
			case 0o051:
			case 0o054:
			case 0o055:
			case 0o056:
			case 0o057:
			case 0o060:
			case 0o061:
			case 0o062:
			case 0o063:
			case 0o064:
			case 0o065:
			case 0o066:
			case 0o067:
			case 0o070:
			case 0o071:
			case 0o072:
			case 0o073:
			case 0o074:
			case 0o075:
			case 0o076:
			case 0o077:
				this.uuo(true);
				return;
			case 0o001:
			case 0o002:
			case 0o003:
			case 0o004:
			case 0o005:
			case 0o006:
			case 0o007:
			case 0o010:
			case 0o011:
			case 0o012:
			case 0o013:
			case 0o014:
			case 0o015:
			case 0o016:
			case 0o017:
			case 0o020:
			case 0o021:
			case 0o022:
			case 0o023:
			case 0o024:
			case 0o025:
			case 0o026:
			case 0o027:
			case 0o030:
			case 0o031:
			case 0o032:
			case 0o033:
			case 0o034:
			case 0o035:
			case 0o036:
			case 0o037:
				this.uuo(false);
				return;

			case 0o100:
			case 0o101:
			case 0o104:
				this.unasign();
				return;

			case 0o102: /* ITS LPM: load and store the pager's registers */
				if (this.its && (this.FLAGS & USER) === 0) {
					this.lpm();
					return;
				}
				this.unasign();
				return;

			case 0o103: /* ITS XCTR */
				if (this.its && (this.FLAGS & USER) === 0) {
					this.f_load_pc = 0;
					this.f_pc_inh = 1;
					this.xct_flag = this.AC;
					return;
				}
				this.unasign();
				return;

			case 0o247: /* ITS CIRC */
				if (this.its) {
					this.BR = this.AR & RMASK;
					this.AR = this.getReg(this.AC);
					if (this.histLen) this.hist[this.histP]!.mb = this.AR;
					this.MQ = this.getReg(this.AC + 1);
					this.SC = (this.AB & RSIGN_N ? (0o777 ^ this.AB) + 1 : this.AB) & 0o777;
					if (this.SC === 0) return;
					this.SC = this.SC % 72;
					if (this.AB & RSIGN_N) this.SC = 72 - this.SC;
					while (this.SC > 0) {
						this.AD = ((this.AR << 1n) | (this.MQ & 1n)) & FMASK;
						this.MQ = ((this.MQ >> 1n) | (this.AR & SMASK)) & FMASK;
						this.AR = this.AD;
						this.SC--;
					}
					this.setReg(this.AC, this.AR);
					this.setReg(this.AC + 1, this.MQ);
					return;
				}
				this.unasign();
				return;

			case 0o105:
			case 0o106:
			case 0o107:
			case 0o110:
			case 0o111:
			case 0o112:
			case 0o113:
			case 0o114:
			case 0o115:
			case 0o116:
			case 0o117:
			case 0o120:
			case 0o121:
			case 0o122:
			case 0o123:
			case 0o124:
			case 0o125:
			case 0o126:
			case 0o127:
				this.unasign();
				return;

			case 0o133: /* IBP */
			case 0o134: /* ILDB */
			case 0o136: /* IDPB */
				if ((this.FLAGS & BYTI) === 0) {
					if (this.memRead(0, this.its ? 0 : 1, 0, 1)) return;
					this.AR = this.MB;
					this.SCAD = Number((this.AR >> 30n) & 0o77n);
					this.SC = Number((this.AR >> 24n) & 0o77n);
					this.SCAD = (this.SCAD + (0o777 ^ this.SC) + 1) & 0o777;
					if (this.SCAD & 0o400) {
						this.SCAD = ((0o777 ^ this.SC) + 0o44 + 1) & 0o777;
						this.AR = (this.AR + 1n) & FMASK;
					}
					this.AR &= PMASK;
					this.AR |= BigInt(this.SCAD & 0o77) << 30n;
					this.MB = this.AR;
					if (this.memWrite(0, this.its ? 0 : 1)) return;
					if ((IR & 4) === 0) return;
					this.ldbPtr();
					return;
				}
				this.byteOp();
				return;
			case 0o135: /* LDB */
			case 0o137: /* DPB */
				this.byteOp();
				return;

			case 0o131: /* DFN */
				if (this.memRead(0, 0, 0, 0)) return;
				this.BR = this.MB;
				this.AR = this.getReg(this.AC);
				this.AD = (CM(this.BR) + 1n) & FMASK;
				this.SC = Number((this.BR >> 27n) & 0o777n);
				this.BR = this.AR;
				this.AR = this.AD;
				this.AD = (CM(this.BR) + ((this.AD & MANT) === 0n ? 1n : 0n)) & FMASK;
				this.AR &= MANT;
				this.AR |= BigInt(this.SC & 0o777) << 27n;
				this.BR = this.AR;
				this.AR = this.AD;
				this.MB = this.BR;
				this.setReg(this.AC, this.AR);
				this.memWrite(0, 0);
				return;

			case 0o132: /* FSC */
				this.BR = this.AR & RMASK;
				this.AR = this.getReg(this.AC);
				this.SC = (this.AB & RSIGN_N ? 0o400 : 0) | (this.AB & 0o377);
				this.SCAD = this.getExpo(this.AR);
				this.SC = (this.SCAD + this.SC) & 0o777;
				this.flag1 = 0;
				if (this.AR & SMASK) this.flag1 = 1;
				this.AR = this.smear(this.AR);
				this.AR = shl(this.AR, 34);
				this.fnorm();
				return;

			case 0o150:
			case 0o151:
			case 0o152:
			case 0o153:
			case 0o154:
			case 0o155:
			case 0o156:
			case 0o157: /* FSB */
				if (!this.fpOperand()) return;
				this.AD = (CM(this.AR) + 1n) & FMASK;
				this.AR = this.BR;
				this.BR = this.AD;
				this.fadd();
				return;

			case 0o130:
			case 0o140:
			case 0o141:
			case 0o142:
			case 0o143:
			case 0o144:
			case 0o145:
			case 0o146:
			case 0o147: /* UFA, FAD */
				if (!this.fpOperand()) return;
				this.fadd();
				return;

			case 0o160:
			case 0o161:
			case 0o162:
			case 0o163:
			case 0o164:
			case 0o165:
			case 0o166:
			case 0o167: /* FMP */
				if (!this.fpOperand()) return;
				this.SC = ((this.BR & SMASK ? 0o777 : 0) ^ Number((this.BR >> 27n) & 0o777n)) & 0o777;
				this.SCAD = ((this.AR & SMASK ? 0o777 : 0) ^ Number((this.AR >> 27n) & 0o777n)) & 0o777;
				this.SC = (this.SC + this.SCAD + 0o600) & 0o777;
				this.flag1 = 0;
				this.flag3 = 0;
				if (this.AR & SMASK) {
					if ((this.AR & MMASK) === 0n) {
						this.AR = BIT9;
						this.SC++;
					} else this.AR = CM(this.AR) + 1n;
					this.flag1 = 1;
					this.flag3 = 1;
				}
				if (this.BR & SMASK) {
					if ((this.BR & MMASK) === 0n) {
						this.BR = BIT9;
						this.SC++;
					} else this.BR = CM(this.BR) + 1n;
					this.flag1 = this.flag1 ? 0 : 1;
				}
				this.AR &= MMASK;
				this.BR &= MMASK;
				this.AR = U64(this.AR * this.BR) << 7n;
				this.AR = U64(this.AR);
				if (this.flag1) this.AR = U64((this.AR ^ FPFMASK) + 1n);
				this.fnorm();
				return;

			case 0o170:
			case 0o172:
			case 0o173:
			case 0o174:
			case 0o175:
			case 0o176:
			case 0o177: /* FDV */
				this.fdv();
				return;

			case 0o171: /* FDVL */
				this.fdvl();
				return;

			case 0o200: /* MOVE */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.setReg(this.AC, this.AR);
				return;
			case 0o201: /* MOVEI */
				this.AR &= RMASK;
				this.setReg(this.AC, this.AR);
				return;
			case 0o202: /* MOVEM */
				this.MB = this.BR;
				this.memWrite(0, 0);
				return;
			case 0o203: /* MOVES */
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = this.MB;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;
			case 0o204: /* MOVS */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = SWAP(this.MB);
				this.setReg(this.AC, this.AR);
				return;
			case 0o205: /* MOVSI */
				this.AR &= RMASK;
				this.AR = SWAP(this.AR);
				this.setReg(this.AC, this.AR);
				return;
			case 0o206: /* MOVSM */
				this.AR = SWAP(this.getReg(this.AC));
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o207: /* MOVSS */
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = SWAP(this.MB);
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;

			case 0o214: /* MOVM */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				if ((this.AR & SMASK) !== 0n) {
					this.negate();
					if (this.flag1 !== this.flag3 && !this.pi_cycle) this.checkAprIrq();
				}
				this.setReg(this.AC, this.AR);
				return;
			case 0o215: /* MOVMI */
				this.AR &= RMASK;
				this.setReg(this.AC, this.AR);
				return;
			case 0o216: /* MOVMM */
				this.AR = this.getReg(this.AC);
				if ((this.AR & SMASK) !== 0n) {
					this.negate();
					if (this.flag1 !== this.flag3 && !this.pi_cycle) this.checkAprIrq();
				}
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o217: /* MOVMS */
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = this.MB;
				if ((this.AR & SMASK) !== 0n) {
					this.negate();
					if (this.flag1 !== this.flag3 && !this.pi_cycle) this.checkAprIrq();
				}
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;
			case 0o210: /* MOVN */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.negate();
				if (this.flag1 !== this.flag3 && !this.pi_cycle) this.checkAprIrq();
				this.setReg(this.AC, this.AR);
				return;
			case 0o211: /* MOVNI */
				this.AR &= RMASK;
				this.negate();
				if (this.flag1 !== this.flag3 && !this.pi_cycle) this.checkAprIrq();
				this.setReg(this.AC, this.AR);
				return;
			case 0o212: /* MOVNM */
				this.AR = this.getReg(this.AC);
				this.negate();
				if (this.flag1 !== this.flag3 && !this.pi_cycle) this.checkAprIrq();
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o213: /* MOVNS */
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = this.MB;
				this.negate();
				if (this.flag1 !== this.flag3 && !this.pi_cycle) this.checkAprIrq();
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

			case 0o240: /* ASH */ {
				this.SC = (this.AB & RSIGN_N ? (0o377 ^ this.AB) + 1 : this.AB) & 0o377;
				if (this.SC === 0) return;
				this.AR = this.BR;
				this.AD = this.AR & SMASK ? FMASK : 0n;
				if (this.AB & RSIGN_N) {
					if (this.SC < 35) this.AR = (shr(this.AR, this.SC) | shl(this.AD, 36 - this.SC)) & FMASK;
					else this.AR = this.AD;
				} else {
					if ((shl(this.AD, this.SC) & ~CMASK & U64(-1n)) !== (shl(this.AR, this.SC) & ~CMASK & U64(-1n))) {
						this.FLAGS |= OVR | TRP1;
						this.checkAprIrq();
					}
					this.AR = (shl(this.AR, this.SC) & CMASK) | (this.AR & SMASK);
				}
				this.setReg(this.AC, this.AR);
				return;
			}
			case 0o241: /* ROT */
				this.SC = this.AB & RSIGN_N ? (this.AB & 0o377 ? ((0o377 ^ this.AB) + 1) & 0o377 : 0o400) : this.AB & 0o377;
				if (this.SC === 0) return;
				this.SC = this.SC % 36;
				if (this.AB & RSIGN_N) this.SC = 36 - this.SC;
				this.AR = (shl(this.BR, this.SC) | shr(this.BR, 36 - this.SC)) & FMASK;
				this.setReg(this.AC, this.AR);
				return;
			case 0o242: /* LSH */
				this.SC = (this.AB & RSIGN_N ? (0o377 ^ this.AB) + 1 : this.AB) & 0o377;
				if (this.SC !== 0) {
					if (this.SC > 36) this.BR = 0n;
					else if (this.AB & RSIGN_N) this.BR = shr(this.BR, this.SC);
					else this.BR = shl(this.BR, this.SC) & FMASK;
				}
				this.AR = this.BR;
				this.setReg(this.AC, this.AR);
				return;
			case 0o243: /* JFFO */
				this.SC = 0;
				if (this.BR !== 0n) {
					if (this.its && this.FLAGS & USER) this.jpc = this.PC;
					this.PC = this.AB;
					this.f_pc_inh = 1;
					this.SC = nlzero(this.BR);
				}
				this.setReg(this.AC + 1, BigInt(this.SC));
				return;
			case 0o244: /* ASHC */
				this.ashc();
				return;
			case 0o245: /* ROTC */
				this.AR = this.BR;
				this.MQ = this.getReg(this.AC + 1);
				this.SC = this.AB & RSIGN_N ? (this.AB & 0o377 ? ((0o377 ^ this.AB) + 1) & 0o377 : 0o400) : this.AB & 0o377;
				if (this.SC === 0) return;
				this.SC = this.SC % 72;
				if (this.AB & RSIGN_N) this.SC = 72 - this.SC;
				if (this.SC >= 36) {
					this.AD = this.MQ;
					this.MQ = this.AR;
					this.AR = this.AD;
					this.SC -= 36;
				}
				this.AD = (shl(this.AR, this.SC) | shr(this.MQ, 36 - this.SC)) & FMASK;
				this.MQ = (shl(this.MQ, this.SC) | shr(this.AR, 36 - this.SC)) & FMASK;
				this.AR = this.AD;
				this.setReg(this.AC, this.AR);
				this.setReg(this.AC + 1, this.MQ);
				return;
			case 0o246: /* LSHC */
				this.AR = this.BR;
				this.MQ = this.getReg(this.AC + 1);
				this.SC = (this.AB & RSIGN_N ? (0o377 ^ this.AB) + 1 : this.AB) & 0o377;
				if (this.SC === 0) return;
				if (this.SC > 71) {
					this.AR = 0n;
					this.MQ = 0n;
				} else {
					if (this.SC > 36) {
						if (this.AB & RSIGN_N) {
							this.MQ = this.AR;
							this.AR = 0n;
						} else {
							this.AR = this.MQ;
							this.MQ = 0n;
						}
						this.SC -= 36;
					}
					if (this.AB & RSIGN_N) {
						this.MQ = (shr(this.MQ, this.SC) | shl(this.AR, 36 - this.SC)) & FMASK;
						this.AR = shr(this.AR, this.SC);
					} else {
						this.AR = (shl(this.AR, this.SC) | shr(this.MQ, 36 - this.SC)) & FMASK;
						this.MQ = shl(this.MQ, this.SC) & FMASK;
					}
				}
				this.setReg(this.AC, this.AR);
				this.setReg(this.AC + 1, this.MQ);
				return;

			case 0o250: /* EXCH */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.MB = this.BR;
				if (this.memWrite(0, 0)) return;
				this.setReg(this.AC, this.AR);
				return;

			case 0o251: /* BLT */
				this.blt();
				return;

			case 0o252: /* AOBJP */
				this.AR = AOB(this.BR);
				if ((this.AR & SMASK) === 0n) {
					if (this.its && this.FLAGS & USER) this.jpc = this.PC;
					this.PC = this.AB;
					this.f_pc_inh = 1;
				}
				this.AR &= FMASK;
				this.setReg(this.AC, this.AR);
				return;
			case 0o253: /* AOBJN */
				this.AR = AOB(this.BR);
				if ((this.AR & SMASK) !== 0n) {
					if (this.its && this.FLAGS & USER) this.jpc = this.PC;
					this.PC = this.AB;
					this.f_pc_inh = 1;
				}
				this.AR &= FMASK;
				this.setReg(this.AC, this.AR);
				return;

			case 0o254: /* JRST */
				this.jrst();
				return;

			case 0o255: /* JFCL */
				if ((this.FLAGS >> 9) & this.AC) {
					if (this.its && this.FLAGS & USER) this.jpc = this.PC;
					this.PC = Number(this.AR & RMASK);
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

			case 0o257: /* MAP */
				return;

			case 0o260: /* PUSHJ */
				this.MB = ((BigInt(this.FLAGS) << 23n) & LMASK) | (BigInt(this.PC + (this.pi_cycle ? 0 : 1)) & RMASK);
				this.BR = AOB(this.BR);
				this.FLAGS &= ~(BYTI | ADRFLT | TRP1 | TRP2);
				if (this.BR & C1) {
					this.push_ovf = 1;
					this.checkAprIrq();
				}
				this.AB = Number(this.BR & RMASK);
				if (this.histLen) this.hist[this.histP]!.mb = this.MB;
				if (this.memWrite(this.uuo_cycle | this.pi_cycle, 0)) return;
				if (this.uuo_cycle | this.pi_cycle) {
					this.FLAGS &= ~(USER | PUBLIC);
					if (this.its && this.one_p_arm) {
						this.FLAGS |= ONEP;
						this.one_p_arm = 0;
					}
				}
				if (this.its && this.FLAGS & USER) this.jpc = this.PC;
				this.PC = Number(this.AR & RMASK);
				this.f_pc_inh = 1;
				this.AR = this.BR & FMASK;
				this.setReg(this.AC, this.AR);
				return;
			case 0o261: /* PUSH */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.BR = AOB(this.BR);
				if (this.BR & C1) {
					this.push_ovf = 1;
					this.checkAprIrq();
				}
				this.AB = Number(this.BR & RMASK);
				this.MB = this.AR;
				if (this.histLen) this.hist[this.histP]!.mb = this.MB;
				if (this.memWrite(0, 0)) return;
				this.AR = this.BR & FMASK;
				this.setReg(this.AC, this.AR);
				return;
			case 0o262: /* POP */
				this.AB = Number(this.BR & RMASK);
				if (this.memRead(0, 0, 0, 0)) return;
				if (this.histLen) this.hist[this.histP]!.mb = this.MB;
				this.AB = Number(this.AR & RMASK);
				this.MQ = this.BR;
				this.BR = SOB(this.BR);
				this.AR = this.BR & FMASK;
				this.setReg(this.AC, this.AR);
				if (this.memWrite(0, 0)) {
					this.setReg(this.AC, this.MQ);
					return;
				}
				if ((this.BR & C1) === 0n) {
					this.push_ovf = 1;
					this.checkAprIrq();
				}
				return;
			case 0o263: /* POPJ */
				this.AB = Number(this.BR & RMASK);
				this.BR = SOB(this.BR);
				if (this.histLen) this.hist[this.histP]!.ea = this.AB;
				if (this.memRead(0, 0, 0, 0)) return;
				if (this.its && this.FLAGS & USER) this.jpc = this.PC;
				this.f_pc_inh = 1;
				this.PC = Number(this.MB & RMASK);
				if ((this.BR & C1) === 0n) {
					this.push_ovf = 1;
					this.checkAprIrq();
				}
				this.AR = this.BR & FMASK;
				this.setReg(this.AC, this.AR);
				return;
			case 0o264: /* JSR */
				this.AR &= RMASK;
				this.MB = ((BigInt(this.FLAGS) << 23n) & LMASK) | (BigInt(this.PC + (this.pi_cycle ? 0 : 1)) & RMASK);
				if (this.uuo_cycle | this.pi_cycle) this.FLAGS &= ~(USER | PUBLIC);
				if (this.memWrite(0, 0)) return;
				this.FLAGS &= ~(BYTI | ADRFLT | TRP1 | TRP2);
				if (this.its && this.FLAGS & USER) this.jpc = this.PC;
				this.PC = Number((this.AR + 1n) & RMASK);
				this.f_pc_inh = 1;
				return;
			case 0o265: /* JSP */
				this.AD = ((BigInt(this.FLAGS) << 23n) & LMASK) | (BigInt(this.PC + (this.pi_cycle ? 0 : 1)) & RMASK);
				this.FLAGS &= ~(BYTI | ADRFLT | TRP1 | TRP2);
				if (this.uuo_cycle | this.pi_cycle) this.FLAGS &= ~(USER | PUBLIC);
				if (this.its && this.FLAGS & USER) this.jpc = this.PC;
				this.PC = Number(this.AR & RMASK);
				this.AR = this.AD;
				this.f_pc_inh = 1;
				this.setReg(this.AC, this.AR);
				return;
			case 0o266: /* JSA */
				this.AR = ((this.AR & RMASK) << 18n) | BigInt((this.PC + 1) & RMASK_N);
				this.MB = this.BR;
				this.setReg(this.AC, this.AR);
				if (this.uuo_cycle | this.pi_cycle) this.FLAGS &= ~(USER | PUBLIC);
				if (this.its && this.FLAGS & USER) this.jpc = this.PC;
				this.PC = this.AB;
				this.memWrite(0, 0);
				return;
			case 0o267: /* JRA */ {
				const ad = this.AB;
				this.AB = Number((this.getReg(this.AC) >> 18n) & RMASK);
				if (this.memRead(this.uuo_cycle | this.pi_cycle, 0, 0, 0)) return;
				this.setReg(this.AC, this.MB);
				if (this.its && this.FLAGS & USER) this.jpc = this.PC;
				this.PC = ad & RMASK_N;
				this.f_pc_inh = 1;
				return;
			}

			case 0o270:
			case 0o271:
			case 0o272:
			case 0o273: /* ADD */
				if (!this.addSubOperand()) return;
				this.flag1 = this.flag3 = 0;
				if (((this.AR & CMASK) + (this.BR & CMASK)) & SMASK) {
					this.FLAGS |= CRY1;
					this.flag1 = 1;
				}
				this.AR = this.AR + this.BR;
				if (this.AR & C1) {
					if (!this.pi_cycle) this.FLAGS |= CRY0;
					this.flag3 = 1;
				}
				this.addSubDone();
				return;
			case 0o274:
			case 0o275:
			case 0o276:
			case 0o277: /* SUB */
				if (!this.addSubOperand()) return;
				this.flag1 = this.flag3 = 0;
				if ((CCM(this.AR) + (this.BR & CMASK) + 1n) & SMASK) {
					this.FLAGS |= CRY1;
					this.flag1 = 1;
				}
				this.AR = CM(this.AR) + this.BR + 1n;
				if (this.AR & C1) {
					if (!this.pi_cycle) this.FLAGS |= CRY0;
					this.flag3 = 1;
				}
				this.addSubDone();
				return;

			case 0o300:
			case 0o301:
			case 0o302:
			case 0o303:
			case 0o304:
			case 0o305:
			case 0o306:
			case 0o307: /* CAI */
				this.AR &= RMASK;
				this.compare();
				this.skipOp();
				return;
			case 0o310:
			case 0o311:
			case 0o312:
			case 0o313:
			case 0o314:
			case 0o315:
			case 0o316:
			case 0o317: /* CAM */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.compare();
				this.skipOp();
				return;
			case 0o320:
			case 0o321:
			case 0o322:
			case 0o323:
			case 0o324:
			case 0o325:
			case 0o326:
			case 0o327: /* JUMP */
				this.AD = this.BR;
				this.BR = this.AR & RMASK;
				this.f = (this.AD & SMASK) !== 0n ? 1 : 0;
				this.jumpOp();
				return;
			case 0o330:
			case 0o331:
			case 0o332:
			case 0o333:
			case 0o334:
			case 0o335:
			case 0o336:
			case 0o337: /* SKIP */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.AD = this.AR;
				this.f = (this.AD & SMASK) !== 0n ? 1 : 0;
				this.skipOp();
				return;
			case 0o340:
			case 0o341:
			case 0o342:
			case 0o343:
			case 0o344:
			case 0o345:
			case 0o346:
			case 0o347:
			case 0o360:
			case 0o361:
			case 0o362:
			case 0o363:
			case 0o364:
			case 0o365:
			case 0o366:
			case 0o367: /* AOJ, SOJ */
				this.flag1 = this.flag3 = 0;
				this.AD = IR & 0o20 ? FMASK : 1n;
				if (((this.BR & CMASK) + (this.AD & CMASK)) & SMASK) {
					if (!this.pi_cycle) this.FLAGS |= CRY1;
					this.flag1 = 1;
				}
				this.AD = this.BR + this.AD;
				if (this.AD & C1) {
					if (!this.pi_cycle) this.FLAGS |= CRY0;
					this.flag3 = 1;
				}
				if (this.flag1 !== this.flag3 && !this.pi_cycle) {
					this.FLAGS |= OVR | TRP1;
					this.checkAprIrq();
				}
				this.f = (this.AD & SMASK) !== 0n ? 1 : 0;
				this.jumpOp();
				return;
			case 0o350:
			case 0o351:
			case 0o352:
			case 0o353:
			case 0o354:
			case 0o355:
			case 0o356:
			case 0o357:
			case 0o370:
			case 0o371:
			case 0o372:
			case 0o373:
			case 0o374:
			case 0o375:
			case 0o376:
			case 0o377: /* AOS, SOS */
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = this.MB;
				this.flag1 = this.flag3 = 0;
				this.AD = IR & 0o20 ? FMASK : 1n;
				if (((this.AR & CMASK) + (this.AD & CMASK)) & SMASK) {
					if (!this.pi_cycle) this.FLAGS |= CRY1;
					this.flag1 = 1;
				}
				this.AD = this.AR + this.AD;
				if (this.AD & C1) {
					if (!this.pi_cycle) this.FLAGS |= CRY0;
					this.flag3 = 1;
				}
				if (this.flag1 !== this.flag3 && !this.pi_cycle) {
					this.FLAGS |= OVR | TRP1;
					this.checkAprIrq();
				}
				this.f = (this.AD & SMASK) !== 0n ? 1 : 0;
				this.skipOp();
				return;

			case 0o400:
			case 0o401: /* SETZ */
				this.AR = 0n;
				this.setReg(this.AC, this.AR);
				return;
			case 0o402: /* SETZM */
				this.MB = this.AR = 0n;
				this.memWrite(0, 0);
				return;
			case 0o403: /* SETZB */
				this.MB = this.AR = 0n;
				if (this.memWrite(0, 0)) return;
				this.setReg(this.AC, this.AR);
				return;
			case 0o404:
			case 0o405:
			case 0o406:
			case 0o407:
				this.boolOp((a, b) => a & b, IR & 3, true);
				return;
			case 0o410:
			case 0o411:
			case 0o412:
			case 0o413:
				this.boolOp((a, b) => a & CM(b), IR & 3, true);
				return;
			case 0o415: /* SETMI */
				this.AR &= RMASK;
				this.setReg(this.AC, this.AR);
				return;
			case 0o414: /* SETM */
			case 0o417: /* SETMB */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.setReg(this.AC, this.AR);
				return;
			case 0o416: /* SETMM */
				if (this.memRead(0, 0, 0, 1)) return;
				if (this.memWrite(0, 0)) return;
				this.AR = this.MB;
				return;
			case 0o420:
			case 0o421:
			case 0o422:
			case 0o423:
				this.boolOp((a, b) => CM(a) & b, IR & 3, true);
				return;
			case 0o424:
			case 0o425: /* SETA */
				this.AR = this.BR;
				this.setReg(this.AC, this.AR);
				return;
			case 0o426: /* SETAM */
				this.AR = this.BR;
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o427: /* SETAB */
				this.AR = this.BR;
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				this.setReg(this.AC, this.AR);
				return;
			case 0o430:
			case 0o431:
			case 0o432:
			case 0o433:
				this.boolOp((a, b) => a ^ b, IR & 3, true);
				return;
			case 0o434:
			case 0o435:
			case 0o436:
			case 0o437:
				this.boolOp((a, b) => CM(CM(a) & CM(b)), IR & 3, true);
				return;
			case 0o440:
			case 0o441:
			case 0o442:
			case 0o443:
				this.boolOp((a, b) => CM(a) & CM(b), IR & 3, true);
				return;
			case 0o444:
			case 0o445:
			case 0o446:
			case 0o447:
				this.boolOp((a, b) => CM(a ^ b), IR & 3, true);
				return;
			case 0o450:
			case 0o451: /* SETCA */
				this.AR = CM(this.BR);
				this.setReg(this.AC, this.AR);
				return;
			case 0o452: /* SETCAM */
				this.AR = CM(this.BR);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o453: /* SETCAB */
				this.AR = CM(this.BR);
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				this.setReg(this.AC, this.AR);
				return;
			case 0o454:
			case 0o455:
			case 0o456:
			case 0o457:
				this.boolOp((a, b) => CM(CM(a) & b), IR & 3, true);
				return;
			case 0o460:
			case 0o461:
			case 0o462:
			case 0o463:
				this.boolOp((a) => CM(a), IR & 3, true);
				return;
			case 0o464:
			case 0o465:
			case 0o466:
			case 0o467:
				this.boolOp((a, b) => CM(a & CM(b)), IR & 3, true);
				return;
			case 0o470:
			case 0o471:
			case 0o473:
				this.boolOp((a, b) => CM(a & b), IR & 3, true);
				return;
			case 0o472: /* ORCBM reads without the modify cycle, as SIMH does */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = CM(this.MB & this.BR);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o474:
			case 0o475: /* SETO */
				this.AR = FMASK;
				this.setReg(this.AC, this.AR);
				return;
			case 0o476: /* SETOM */
				this.MB = this.AR = FMASK;
				this.memWrite(0, 0);
				return;
			case 0o477: /* SETOB */
				this.MB = this.AR = FMASK;
				if (this.memWrite(0, 0)) return;
				this.setReg(this.AC, this.AR);
				return;

			default:
				if (IR >= 0o500 && IR < 0o600) {
					this.halfword();
					return;
				}
				if (IR >= 0o600 && IR < 0o700) {
					this.test();
					return;
				}
				this.io();
				return;
		}
	}

	private byteOp(): void {
		if ((this.FLAGS & BYTI) === 0 || !this.BYF5) {
			if (this.memRead(0, this.its ? 0 : 1, 0, 0)) return;
			this.AR = this.MB;
			this.SC = Number((this.AR >> 24n) & 0o77n);
			this.SCAD = Number((this.AR >> 30n) & 0o77n);
			this.ldbPtr();
			return;
		}
		const f = (this.IR & 6) === 6 ? 1 : 0;
		this.AB = Number(this.AR & RMASK);
		this.MQ = (1n << BigInt(this.SC)) - 1n;
		if (this.memRead(0, 0, 0, f)) return;
		this.AR = this.MB;
		if ((this.IR & 6) === 4) {
			this.AR = shr(this.AR, this.SCAD);
			this.AR &= this.MQ;
			this.setReg(this.AC, this.AR);
		} else {
			this.BR = this.getReg(this.AC);
			this.BR = shl(this.BR, this.SCAD);
			this.MQ = shl(this.MQ, this.SCAD);
			this.AR &= U64(CM(this.MQ));
			this.AR |= this.BR & this.MQ;
			this.MB = this.AR & FMASK;
			if (this.memWrite(0, 0)) return;
		}
		this.FLAGS &= ~BYTI;
		this.BYF5 = 0;
	}

	private lpm(): void {
		const AC = this.AC;
		const M = this.M;
		if (AC & 1) {
			if (this.AB + 8 >= this.memWords) {
				this.fault_data |= 0o400;
				this.mem_prot = 1;
				this.checkAprIrq();
				return;
			}
			this.MB = (BigInt(this.age) << 27n) | (BigInt(this.fault_addr & 0o777) << 18n) | BigInt(this.jpc);
			M[this.AB] = this.MB;
			this.AB = (this.AB + 1) & RMASK_N;
			this.MB = this.opc;
			M[this.AB] = this.MB;
			this.AB = (this.AB + 1) & RMASK_N;
			this.MB = (this.mar & 0o777607777777n) | (BigInt(this.pag_reload) << 21n);
			M[this.AB] = this.MB;
			this.AB = (this.AB + 1) & RMASK_N;
			this.MB = BigInt(this.getQuantum()) | (BigInt(this.fault_data) << 18n);
			M[this.AB] = this.MB;
			this.AB = (this.AB + 1) & RMASK_N;
			this.MB = (BigInt(this.fault_addr & 0o760000) << 13n) | BigInt(this.dbr1);
			M[this.AB] = this.MB;
			this.AB = (this.AB + 1) & RMASK_N;
			this.MB = (BigInt(this.fault_addr & 0o37000) << 17n) | BigInt(this.dbr2);
			M[this.AB] = this.MB;
			this.AB = (this.AB + 1) & RMASK_N;
			this.MB = BigInt(this.dbr3);
			M[this.AB] = this.MB;
			this.AB = (this.AB + 1) & RMASK_N;
			this.MB = BigInt(this.ac_stack);
			M[this.AB] = this.MB;
		} else {
			if (this.AB + 8 >= this.memWords) {
				this.fault_data |= 0o400;
				this.mem_prot = 1;
				this.checkAprIrq();
				return;
			}
			this.MB = M[this.AB]!;
			this.age = Number((this.MB >> 27n) & 0o17n);
			this.jpc = Number(this.MB & RMASK);
			this.fault_addr = Number((this.MB >> 18n) & 0o777n);
			this.AB = (this.AB + 1) & RMASK_N;
			this.MB = M[this.AB]!;
			this.opc = this.MB;
			this.AB = (this.AB + 1) & RMASK_N;
			this.MB = M[this.AB]!;
			this.mar = this.MB;
			this.pag_reload = 0;
			this.AB = (this.AB + 1) & RMASK_N;
			this.MB = M[this.AB]!;
			this.qua_time = Number(this.MB & RMASK);
			this.setQuantum();
			this.fault_data = Number((this.MB >> 18n) & RMASK);
			this.mem_prot = 0;
			if ((this.fault_data & 0o777772) !== 0) this.mem_prot = 1;
			this.AB = (this.AB + 1) & RMASK_N;
			this.MB = M[this.AB]!;
			this.dbr1 = Number(0o377777777n & this.MB);
			this.fault_addr |= Number((this.MB >> 13n) & 0o760000n);
			this.AB = (this.AB + 1) & RMASK_N;
			this.MB = M[this.AB]!;
			this.fault_addr |= Number((this.MB >> 17n) & 0o37000n);
			this.dbr2 = Number(0o377777777n & this.MB);
			this.AB = (this.AB + 1) & RMASK_N;
			this.MB = M[this.AB]!;
			this.dbr3 = Number(0o377777777n & this.MB);
			this.AB = (this.AB + 1) & RMASK_N;
			this.MB = M[this.AB]!;
			this.ac_stack = Number(this.MB & 0xffffffffn);
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

	private fdv(): void {
		if (!this.fpOperand()) return;
		this.flag1 = 0;
		this.flag3 = 0;
		this.SC = ((this.BR & SMASK ? 0o777 : 0) ^ Number((this.BR >> 27n) & 0o777n)) & 0o777;
		this.SCAD = ((this.AR & SMASK ? 0o777 : 0) ^ Number((this.AR >> 27n) & 0o777n)) & 0o777;
		if ((this.BR & MMASK) === 0n) {
			if (this.BR === SMASK) {
				this.BR = BIT9;
				this.SC--;
			} else {
				this.AR = this.BR;
				return;
			}
		}
		if (this.BR & SMASK) {
			this.BR = CM(this.BR) + 1n;
			this.flag1 = 1;
		}
		if (this.AR & SMASK) {
			if ((this.AR & MMASK) === 0n) {
				this.AR = BIT9;
				this.SC--;
			} else this.AR = CM(this.AR) + 1n;
			this.flag1 = this.flag1 ? 0 : 1;
		}
		this.SC = (this.SC + ((0o777 ^ this.SCAD) + 1) + 0o201) & 0o777;
		this.AR &= MMASK;
		this.BR &= MMASK;
		if (this.BR >= this.AR << 1n) {
			if (!this.pi_cycle) {
				this.FLAGS |= OVR | NODIV | FLTOVR | TRP1;
				this.checkAprIrq();
			}
			return;
		}
		this.BR = this.BR << 28n;
		this.MB = this.AR;
		this.AR = this.BR / this.AR;
		if (this.AR !== 0n) {
			if ((this.AR & BIT7) !== 0n) this.AR >>= 1n;
			else this.SC--;
			if (((this.SC & 0o400) !== 0) !== ((this.SC & 0o200) !== 0) || this.SC === 0o600) this.fxu_hold_set = 1;
			if (this.IR & 4) this.AR++;
			this.AR >>= 1n;
			while ((this.AR & BIT9) === 0n) {
				this.AR <<= 1n;
				this.SC--;
			}
		} else if (this.flag1) {
			this.AR = SMASK | BIT9;
			this.SC++;
			this.flag1 = 0;
		} else {
			this.AR = 0n;
			this.SC = 0;
		}
		if (!this.pi_cycle && (this.SC & 0o400) !== 0) {
			this.FLAGS |= OVR | FLTOVR;
			if (!this.fxu_hold_set) this.FLAGS |= FLTUND;
			this.checkAprIrq();
		}
		if (this.flag1) {
			this.AR = ((this.AR ^ MMASK) + 1n) & MMASK;
			this.AR |= SMASK;
		}
		this.SCAD = this.SC ^ (this.AR & SMASK ? 0o377 : 0);
		this.AR |= BigInt(this.SCAD & 0o377) << 27n;
		this.fpStore(true);
	}

	private fdvl(): void {
		if (this.memRead(0, 0, 0, 0)) return;
		this.AR = this.MB;
		this.MQ = this.getReg(this.AC + 1);
		this.flag1 = this.flag3 = 0;
		this.SC = ((this.BR & SMASK ? 0o777 : 0) ^ Number((this.BR >> 27n) & 0o777n)) & 0o777;
		this.SC += ((this.AR & SMASK ? 0 : 0o777) ^ Number((this.AR >> 27n) & 0o777n)) & 0o777;
		this.SC = (this.SC + 0o201) & 0o777;
		this.FE = (((this.BR & SMASK ? 0o777 : 0) ^ Number((this.BR >> 27n) & 0o777n)) & 0o777) - 26;
		if (this.BR & SMASK) {
			this.MQ = (CM(this.MQ) + 1n) & MMASK;
			this.BR = CM(this.BR);
			if (this.MQ === 0n) this.BR = this.BR + 1n;
			this.flag1 = 1;
			this.flag3 = 1;
		}
		this.MQ &= MMASK;
		if (this.AR & SMASK) {
			this.AR = CM(this.AR) + 1n;
			this.flag1 = this.flag1 ? 0 : 1;
		}
		this.AR &= MMASK;
		this.BR &= MMASK;
		if (this.BR >= this.AR << 1n) {
			if (!this.pi_cycle) {
				this.FLAGS |= OVR | NODIV | FLTOVR | TRP1;
				this.checkAprIrq();
			}
			return;
		}
		this.BR = (this.BR << 27n) + this.MQ;
		this.MB = this.AR;
		this.AR <<= 27n;
		this.AD = 0n;
		if (this.BR < this.AR) {
			this.BR <<= 1n;
			this.SC--;
			this.FE--;
		}
		for (this.SCAD = 0; this.SCAD < 27; this.SCAD++) {
			this.AD <<= 1n;
			if (this.BR >= this.AR) {
				this.BR = this.BR - this.AR;
				this.AD |= 1n;
			}
			this.BR <<= 1n;
		}
		this.MQ = this.BR >> 28n;
		this.AR = this.AD;
		this.SC++;
		if (this.AR !== 0n) {
			if ((this.AR & BIT8) !== 0n) {
				this.SC++;
				this.FE++;
				this.AR >>= 1n;
			}
			while ((this.AR & BIT9) === 0n) {
				this.AR <<= 1n;
				this.SC--;
			}
			if (((this.SC & 0o400) !== 0) !== ((this.SC & 0o200) !== 0)) this.fxu_hold_set = 1;
			if (this.flag1) {
				this.AR = (this.AR ^ MMASK) + 1n;
				this.AR |= SMASK;
			}
		} else if (this.flag1) {
			this.FE = this.SC = 0;
		} else {
			this.AR = 0n;
			this.SC = 0;
			this.FE = 0;
		}
		if ((this.SC & 0o400) !== 0 && !this.pi_cycle) {
			this.FLAGS |= OVR | FLTOVR | TRP1;
			if (!this.fxu_hold_set) this.FLAGS |= FLTUND;
			this.checkAprIrq();
		}
		this.SCAD = this.SC ^ (this.AR & SMASK ? 0o377 : 0);
		this.AR &= SMASK | MMASK;
		this.AR |= BigInt(this.SCAD & 0o377) << 27n;
		if (this.MQ !== 0n) {
			this.MQ &= MMASK;
			if (this.flag3) {
				this.MQ = (this.MQ ^ MMASK) + 1n;
				this.MQ |= SMASK;
			}
			if (this.FE < 0) {
				this.MQ = 0n;
				this.FE = 0;
			} else this.FE ^= this.flag3 ? 0o377 : 0;
			this.MQ |= BigInt(this.FE & 0o377) << 27n;
		}
		this.setReg(this.AC + 1, this.MQ & FMASK);
		this.setReg(this.AC, this.AR & FMASK);
	}

	private mul(): void {
		switch (this.IR & 7) {
			case 1:
			case 5:
				this.AR &= RMASK;
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
		this.flag3 = 0;
		if (this.AR & SMASK) {
			this.AR = (CM(this.AR) + 1n) & FMASK;
			this.flag3 = 1;
		}
		if (this.BR & SMASK) {
			this.BR = (CM(this.BR) + 1n) & FMASK;
			this.flag3 = this.flag3 ? 0 : 1;
		}
		mul: if (this.AR === 0n || this.BR === 0n) {
			this.AR = this.MQ = 0n;
		} else {
			if (this.BR === SMASK) this.flag3 = this.flag3 ? 0 : 1;
			this.MQ = U64(this.AR * (this.BR & RMASK));
			this.AR = U64(this.AR * ((this.BR >> 18n) & RMASK));
			this.MQ = U64(this.MQ + ((this.AR << 18n) & LMASK));
			this.AR >>= 18n;
			this.AR = U64((this.AR << 1n) + (this.MQ >> 35n));
			this.MQ &= CMASK;
			if ((this.IR & 4) === 0) {
				if (this.AR > BigInt(this.flag3) && !this.pi_cycle) {
					this.FLAGS |= OVR | TRP1;
					this.checkAprIrq();
				}
				if (this.flag3) {
					this.MQ ^= CMASK;
					this.MQ++;
					this.MQ |= SMASK;
				}
				this.AR = this.MQ;
				break mul;
			}
			if ((this.AR & SMASK) !== 0n && !this.pi_cycle) {
				this.FLAGS |= OVR | TRP1;
				this.checkAprIrq();
			}
			if (this.flag3) {
				this.AR ^= FMASK;
				this.MQ ^= CMASK;
				this.MQ += 1n;
				if ((this.MQ & SMASK) !== 0n) {
					this.AR += 1n;
					this.MQ &= CMASK;
				}
			}
			this.AR &= FMASK;
			this.MQ = (this.MQ & ~SMASK) | (this.AR & SMASK);
			if (this.BR === SMASK && this.AR & SMASK) {
				this.FLAGS |= OVR | TRP1;
				this.checkAprIrq();
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
				break;
			case 2:
			case 6:
				this.MB = this.AR;
				this.memWrite(0, 0);
				break;
			case 3:
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				this.setReg(this.AC, this.AR);
				break;
		}
	}

	/** The divisor into BR and dividend into AR for the four modes of IDIV and DIV. */
	private divOperand(): boolean {
		switch (this.IR & 3) {
			case 0:
				this.AR = this.BR;
				if (this.memRead(0, 0, 0, 0)) return false;
				this.BR = this.MB;
				return true;
			case 1:
				this.MQ = this.AR & RMASK;
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
				break;
			case 2:
				this.MB = this.AR;
				this.memWrite(0, 0);
				break;
		}
	}

	private idiv(): void {
		if (!this.divOperand()) return;
		this.flag1 = 0;
		this.flag3 = 0;
		if (this.BR & SMASK) {
			this.BR = (CM(this.BR) + 1n) & FMASK;
			this.flag1 = this.flag1 ? 0 : 1;
		}
		if (this.BR === 0n) {
			this.FLAGS |= OVR | NODIV | TRP1;
			this.checkAprIrq();
			return;
		}
		if (this.AR === SMASK && this.BR === 1n) {
			this.FLAGS |= OVR | NODIV | TRP1;
			this.checkAprIrq();
			return;
		}
		if (this.AR & SMASK) {
			this.AR = (CM(this.AR) + 1n) & FMASK;
			this.flag1 = this.flag1 ? 0 : 1;
			this.flag3 = 1;
		}
		this.MQ = this.AR % this.BR;
		this.AR = this.AR / this.BR;
		if (this.flag1) this.AR = (CM(this.AR) + 1n) & FMASK;
		if (this.flag3) this.MQ = (CM(this.MQ) + 1n) & FMASK;
		this.divStore();
	}

	private div(): void {
		if (!this.divOperand()) return;
		this.MQ = this.getReg(this.AC + 1);
		this.flag1 = 0;
		if (this.AR & SMASK) {
			this.AD = (CM(this.MQ) + 1n) & FMASK;
			this.MQ = this.AR;
			this.AR = this.AD;
			this.AD = CM(this.MQ) & FMASK;
			this.MQ = this.AR;
			this.AR = this.AD;
			if ((this.MQ & CMASK) === 0n) this.AR = (this.AR + 1n) & FMASK;
			this.flag1 = 1;
		}
		if (this.BR & SMASK) this.AD = (this.AR + this.BR) & FMASK;
		else this.AD = (this.AR + CM(this.BR) + 1n) & FMASK;
		this.MQ = (this.MQ << 1n) & FMASK;
		this.MQ |= (this.AD & SMASK) !== 0n ? 1n : 0n;
		this.SC = 35;
		if ((this.AD & SMASK) === 0n) {
			this.FLAGS |= OVR | NODIV | TRP1;
			this.checkAprIrq();
			return;
		}
		while (this.SC !== 0) {
			if (((this.BR & SMASK) !== 0n) !== ((this.MQ & 1n) !== 0n)) this.AD = this.AR + CM(this.BR) + 1n;
			else this.AD = this.AR + this.BR;
			this.AR = (this.AD << 1n) | (this.MQ & SMASK ? 1n : 0n);
			this.AR &= FMASK;
			this.MQ = (this.MQ << 1n) & FMASK;
			this.MQ |= (this.AD & SMASK) === 0n ? 1n : 0n;
			this.SC--;
		}
		if (((this.BR & SMASK) !== 0n) !== ((this.MQ & 1n) !== 0n)) this.AD = this.AR + CM(this.BR) + 1n;
		else this.AD = this.AR + this.BR;
		this.AR = this.AD & FMASK;
		this.MQ = (this.MQ << 1n) & FMASK;
		this.MQ |= (this.AD & SMASK) === 0n ? 1n : 0n;
		if (this.AR & SMASK) {
			if (this.BR & SMASK) this.AD = (this.AR + CM(this.BR) + 1n) & FMASK;
			else this.AD = (this.AR + this.BR) & FMASK;
			this.AR = this.AD;
		}
		if (this.flag1) this.AR = (CM(this.AR) + 1n) & FMASK;
		if (this.flag1 !== ((this.BR & SMASK) !== 0n ? 1 : 0)) {
			this.AD = (CM(this.MQ) + 1n) & FMASK;
			this.MQ = this.AR;
			this.AR = this.AD;
		} else {
			this.AD = this.MQ;
			this.MQ = this.AR;
			this.AR = this.AD;
		}
		this.divStore();
	}

	private ashc(): void {
		this.AR = this.BR;
		this.MQ = this.getReg(this.AC + 1);
		this.SC = (this.AB & RSIGN_N ? (0o377 ^ this.AB) + 1 : this.AB) & 0o377;
		if (this.SC === 0) return;
		if (this.SC > 70) this.SC = 70;
		this.AD = this.AR & SMASK ? FMASK : 0n;
		this.AR &= CMASK;
		this.MQ &= CMASK;
		const NC = ~CMASK & U64(-1n);
		if (this.AB & RSIGN_N) {
			if (this.SC >= 35) {
				this.MQ = (shr(this.AR, this.SC - 35) | shl(this.AD, 70 - this.SC)) & FMASK;
				this.AR = this.AD;
			} else {
				this.MQ = (this.AD & SMASK) | shr(this.MQ, this.SC) | (shl(this.AR, 35 - this.SC) & CMASK);
				this.AR = ((this.AD & SMASK) | (shr(this.AR, this.SC) | shl(this.AD, 35 - this.SC))) & FMASK;
			}
		} else if (this.SC >= 35) {
			if ((shl(this.AD, this.SC) & NC) !== (shl(this.AR, this.SC) & NC)) {
				this.FLAGS |= OVR | TRP1;
				this.checkAprIrq();
			}
			this.AR = (this.AD & SMASK) | (shl(this.MQ, this.SC - 35) & CMASK);
			this.MQ = this.AD & SMASK;
		} else {
			if ((shl(this.AD & CMASK, this.SC) & NC) !== (shl(this.AR, this.SC) & NC)) {
				this.FLAGS |= OVR | TRP1;
				this.checkAprIrq();
			}
			this.AR = (this.AD & SMASK) | (shl(this.AR, this.SC) & CMASK) | shr(this.MQ, 35 - this.SC);
			this.MQ = (this.AD & SMASK) | (shl(this.MQ, this.SC) & CMASK);
		}
		this.setReg(this.AC, this.AR);
		this.setReg(this.AC + 1, this.MQ);
	}

	private blt(): void {
		this.AR = this.BR;
		this.BR = BigInt(this.AB);
		const ev = this.events;
		do {
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
			this.AB = Number((this.AR >> 18n) & RMASK);
			if (this.memRead(0, 0, 0, 0)) {
				this.f_pc_inh = this.its && (this.xct_flag & 4) !== 0 ? 0 : 1;
				if (this.its) this.setReg(this.AC, this.AR);
				return;
			}
			this.AB = Number(this.AR & RMASK);
			if (this.memWrite(0, 0)) {
				this.f_pc_inh = this.its && (this.xct_flag & 4) !== 0 ? 0 : 1;
				if (this.its) this.setReg(this.AC, this.AR);
				return;
			}
			this.AD = (this.AR & RMASK) + CM(this.BR) + 1n;
			this.AR = AOB(this.AR);
		} while ((this.AD & C1) === 0n);
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
		this.PC = Number(this.AR & RMASK);
		if (this.AC & 2) {
			this.FLAGS &= ~(OVR | NODIV | FLTUND | BYTI | FLTOVR | CRY1 | CRY0 | TRP1 | TRP2 | PCHNG | ADRFLT);
			const ar = Number((this.AR >> 23n) & 0o17777n);
			if ((this.FLAGS & (PUBLIC | USER)) === 0) this.FLAGS |= ar & (USER | USERIO | PUBLIC);
			if ((ar & USERIO) === 0) this.FLAGS &= ~USERIO;
			this.FLAGS |= ar & (OVR | NODIV | FLTUND | BYTI | FLTOVR | CRY1 | CRY0 | TRP1 | TRP2 | PUBLIC | PCHNG | ADRFLT);
			if (this.its) this.FLAGS |= ar & (PURE | ONEP);
			this.checkAprIrq();
		}
		if (this.AC & 1) this.FLAGS |= USER;
		this.f_pc_inh = 1;
	}

	private addSubOperand(): boolean {
		switch (this.IR & 3) {
			case 0:
				if (this.memRead(0, 0, 0, 0)) return false;
				this.AR = this.MB;
				return true;
			case 1:
				this.AR &= RMASK;
				return true;
			default:
				if (this.memRead(0, 0, 0, 1)) return false;
				this.AR = this.MB;
				return true;
		}
	}

	private addSubDone(): void {
		if (this.flag1 !== this.flag3) {
			if (!this.pi_cycle) {
				this.FLAGS |= OVR | TRP1;
				this.checkAprIrq();
			}
		}
		this.AR &= FMASK;
		if ((this.IR & 2) === 2) {
			this.MB = this.AR;
			if (this.memWrite(0, 0)) return;
		}
		if ((this.IR & 3) !== 2) this.setReg(this.AC, this.AR);
	}

	private compare(): void {
		this.f = 0;
		this.AD = CM(this.AR) + this.BR + 1n;
		if ((this.BR & SMASK) !== 0n && (this.AR & SMASK) === 0n) this.f = 1;
		if ((this.BR & SMASK) === (this.AR & SMASK) && (this.AD & SMASK) !== 0n) this.f = 1;
	}

	/** 500–577. Which half goes where, what fills the other half, and the mode are all fields of the opcode. */
	private halfword(): void {
		const IR = this.IR;
		const ext = (ar: bigint): bigint => {
			// What fills the other half: 0 nothing, 1 zeros, 2 ones, 3 the sign.
			const fill = (IR >> 3) & 3;
			const toRight = (IR & 0o40) !== 0;
			if (!toRight) {
				if (fill === 1) return ar & LMASK;
				if (fill === 2) return (ar & LMASK) | RMASK;
				return (ar & LMASK) | ((ar & SMASK) !== 0n ? RMASK : 0n);
			}
			if (fill === 1) return ar & RMASK;
			if (fill === 2) return LMASK | (ar & RMASK);
			return ((ar & RSIGN) !== 0n ? LMASK : 0n) | (ar & RMASK);
		};
		switch (IR) {
			case 0o500: /* HLL */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = (this.MB & LMASK) | (this.BR & RMASK);
				this.setReg(this.AC, this.AR);
				return;
			case 0o501: /* HLLI */
				this.AR &= RMASK;
				this.AR = (this.AR & LMASK) | (this.BR & RMASK);
				this.setReg(this.AC, this.AR);
				return;
			case 0o502: /* HLLM */
				this.AR = this.BR;
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = (this.AR & LMASK) | (this.MB & RMASK);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o503: /* HLLS */
			case 0o543: /* HRRS */
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = this.MB;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;
			case 0o547: /* HLRS */
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = this.MB;
				this.BR = SWAP(this.AR);
				this.AR = (this.AR & LMASK) | (this.BR & RMASK);
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;
			case 0o504: /* HRL */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = SWAP(this.MB);
				this.AR = (this.AR & LMASK) | (this.BR & RMASK);
				this.setReg(this.AC, this.AR);
				return;
			case 0o505: /* HRLI */
				this.AR &= RMASK;
				this.AR = SWAP(this.AR);
				this.AR = (this.AR & LMASK) | (this.BR & RMASK);
				this.setReg(this.AC, this.AR);
				return;
			case 0o506: /* HRLM */
				this.AR = this.BR;
				if (this.memRead(0, 0, 0, 1)) return;
				this.BR = this.MB;
				this.AR = SWAP(this.AR);
				this.AR = (this.AR & LMASK) | (this.BR & RMASK);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o507: /* HRLS */
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = this.MB;
				this.BR = SWAP(this.AR);
				this.AR = (this.BR & LMASK) | (this.AR & RMASK);
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;
			case 0o540: /* HRR */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = (this.BR & LMASK) | (this.MB & RMASK);
				this.setReg(this.AC, this.AR);
				return;
			case 0o541: /* HRRI */
				this.AR &= RMASK;
				this.AR = (this.BR & LMASK) | (this.AR & RMASK);
				this.setReg(this.AC, this.AR);
				return;
			case 0o542: /* HRRM */
				this.AR = this.BR;
				if (this.memRead(0, 0, 0, 1)) return;
				this.BR = this.MB;
				this.AR = (this.BR & LMASK) | (this.AR & RMASK);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o544: /* HLR */
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				this.BR = this.getReg(this.AC);
				this.AR = SWAP(this.AR);
				this.AR = (this.BR & LMASK) | (this.AR & RMASK);
				this.setReg(this.AC, this.AR);
				return;
			case 0o545: /* HLRI */
				this.AR &= RMASK;
				this.AR = SWAP(this.AR);
				this.AR = (this.BR & LMASK) | (this.AR & RMASK);
				this.setReg(this.AC, this.AR);
				return;
			case 0o546: /* HLRM */
				this.AR = this.BR;
				if (this.memRead(0, 0, 0, 1)) return;
				this.BR = this.MB;
				this.AR = SWAP(this.AR);
				this.AR = (this.BR & LMASK) | (this.AR & RMASK);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			case 0o566: /* HLROM reads without the modify cycle, as SIMH does */
				this.AR = this.BR;
				if (this.memRead(0, 0, 0, 0)) return;
				this.BR = this.MB;
				this.AR = SWAP(this.AR);
				this.AR = LMASK | (this.AR & RMASK);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
		}
		// The Z, O and E forms: HLLZ HRLZ HLLO HRLO HLLE HRLE and HRRZ HLRZ HRRO HLRO HRRE HLRE.
		const swap = (IR & 0o4) !== 0;
		switch (IR & 3) {
			case 0:
				if (this.memRead(0, 0, 0, 0)) return;
				this.AR = this.MB;
				if (swap) this.AR = SWAP(this.AR);
				this.AR = ext(this.AR);
				this.setReg(this.AC, this.AR);
				return;
			case 1:
				this.AR &= RMASK;
				if (swap) this.AR = SWAP(this.AR);
				this.AR = ext(this.AR);
				this.setReg(this.AC, this.AR);
				return;
			case 2:
				this.BR = this.AR & ((IR & 0o70) === 0o20 || (IR & 0o70) === 0o60 ? FMASK : RMASK);
				this.AR = this.getReg(this.AC);
				if (swap) this.AR = SWAP(this.AR);
				this.AR = ext(this.AR);
				this.MB = this.AR;
				this.memWrite(0, 0);
				return;
			default:
				if (this.memRead(0, 0, 0, 1)) return;
				this.AR = this.MB;
				if (swap) this.AR = SWAP(this.AR);
				this.AR = ext(this.AR);
				this.MB = this.AR;
				if (this.memWrite(0, 0)) return;
				if (this.AC !== 0) this.setReg(this.AC, this.AR);
				return;
		}
	}

	/** 600–677: test the masked bits, change them, and skip. */
	private test(): void {
		const IR = this.IR;
		if (IR & 0o10) {
			if (this.memRead(0, 0, 0, 0)) return;
			this.AR = this.MB;
		} else this.AR &= RMASK;
		if (IR & 1) this.AR = SWAP(this.AR);
		switch (IR & 0o60) {
			case 0o20:
				this.MQ = CM(this.AR) & this.BR;
				break;
			case 0o40:
				this.MQ = this.AR ^ this.BR;
				break;
			case 0o60:
				this.MQ = this.AR | this.BR;
				break;
		}
		this.AR &= this.BR;
		const f = ((this.AR === 0n ? 1 : 0) & ((IR >> 1) & 1)) ^ ((IR >> 2) & 1);
		if (f) this.PC = (this.PC + 1) & RMASK_N;
		this.AR = this.MQ;
		if ((IR & 0o60) !== 0) this.setReg(this.AC, this.AR);
	}

	/** 700–777: I/O, through the device table. */
	private io(): void {
		if ((this.FLAGS & (USER | USERIO)) === USER && !this.pi_cycle) {
			this.uuo(true);
			return;
		}
		const d = ((this.IR & 0o77) << 1) | ((this.AC & 0o10) !== 0 ? 1 : 0);
		const dev = this.devTab[d]!;
		this.AR &= RMASK;
		for (;;) {
			switch (this.AC & 7) {
				case 0: /* BLKI */
				case 2: /* BLKO */
					if (this.memRead(this.pi_cycle, 0, 0, 0)) return;
					this.AR = this.MB;
					if (this.histLen) this.hist[this.histP]!.mb = this.AR;
					this.AC |= 1;
					this.AR = AOB(this.AR);
					if (this.AR & C1) this.pi_ov = 1;
					else if (!this.pi_cycle) this.PC = (this.PC + 1) & RMASK_N;
					this.AR &= FMASK;
					this.MB = this.AR;
					if (this.memWrite(this.pi_cycle, 0)) return;
					this.AB = Number(this.AR & RMASK);
					continue;
				case 1: /* DATAI */
					this.AR = dev(DATAI | (d << 2), this.AR);
					this.MB = this.AR;
					this.memWrite(this.pi_cycle, 0);
					return;
				case 3: /* DATAO */
					if (this.memRead(this.pi_cycle, 0, 0, 0)) return;
					this.AR = this.MB;
					this.AR = dev(DATAO | (d << 2), this.AR);
					return;
				case 4: /* CONO */
					this.AR = dev(CONO | (d << 2), this.AR);
					return;
				case 5: /* CONI */
					this.AR = dev(CONI | (d << 2), this.AR);
					this.MB = this.AR;
					this.memWrite(this.pi_cycle, 0);
					return;
				case 6: /* CONSZ */
					this.AR = dev(CONI | (d << 2), this.AR);
					this.AR &= BigInt(this.AB);
					if (this.AR === 0n) this.PC = (this.PC + 1) & RMASK_N;
					return;
				default: /* CONSO */
					this.AR = dev(CONI | (d << 2), this.AR);
					this.AR &= BigInt(this.AB);
					if (this.AR !== 0n) this.PC = (this.PC + 1) & RMASK_N;
					return;
			}
		}
	}
}

/** Leading zeros in a 36-bit word, for JFFO. */
export function nlzero(w: bigint): number {
	if (w === 0n) return 36;
	let n = 0;
	if ((w & 0o777777000000n) === 0n) {
		n += 18;
		w <<= 18n;
	}
	if ((w & 0o777000000000n) === 0n) {
		n += 9;
		w <<= 9n;
	}
	if ((w & 0o770000000000n) === 0n) {
		n += 6;
		w <<= 6n;
	}
	if ((w & 0o700000000000n) === 0n) {
		n += 3;
		w <<= 3n;
	}
	if ((w & 0o600000000000n) === 0n) {
		n++;
		w <<= 1n;
	}
	if ((w & 0o400000000000n) === 0n) n++;
	return n;
}
