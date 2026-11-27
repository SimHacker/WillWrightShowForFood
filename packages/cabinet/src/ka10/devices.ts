/**
 * The KA10's devices for ITS, each a port of its SIMH file: the console
 * teletype (kx10_cty.c), the paper tape reader and punch (kx10_pt.c), the
 * RP10 disk controller and its DF10 data channel (kx10_dp.c, kx10_df.c), and
 * Paul DeCoriolis's clock (ka10_pd.c). Timings are SIMH's, in its ticks.
 */
import { CONI, CONO, DATAI, DATAO, FMASK, RMASK } from "./defs.js";
import type { Unit } from "./events.js";
import type { Ka10Bus } from "./bus.js";

// ---- console teletype, device 120 ------------------------------------------

const TEL_RDY = 0o10;
const TEL_BSY = 0o20;
const KEY_RDY = 0o40;
const KEY_BSY = 0o100;
const KEY_TST = 0o4000;
const CTY_DEVNUM = 0o120;

export class Cty {
	private oStatus = 0;
	private oData = 0;
	private oPia = 0;
	private iStatus = 0;
	private iData = 0;
	private readonly keys: number[] = [];
	readonly out: Unit = { name: "ctyo", svc: () => this.outSvc() };
	readonly inp: Unit = { name: "ctyi", svc: () => this.inSvc() };
	wait = 10000;

	/** Every character ITS types, as SIMH's 7B mode passes it: the high bit cleared. */
	constructor(
		private readonly cpu: Ka10Bus,
		private readonly print: (ch: number) => void,
	) {
		cpu.attachDevice(CTY_DEVNUM, (dev, data) => this.io(dev, data), () => this.reset());
	}

	/** Queue keystrokes, picked up at SIMH's keyboard poll rate. */
	type(s: string): void {
		for (const c of s) this.keys.push(c.charCodeAt(0) & 0o177);
	}

	get typeahead(): number {
		return this.keys.length;
	}

	private io(dev: number, data: bigint): bigint {
		switch (dev & 3) {
			case CONI: {
				let res = this.oPia | (this.oStatus & (TEL_RDY | TEL_BSY));
				res |= this.iStatus & (KEY_RDY | KEY_BSY);
				res |= this.oStatus & KEY_TST;
				return BigInt(res);
			}
			case CONO: {
				const res = Number(data & RMASK);
				this.oPia = res & 7;
				this.oStatus &= ~((res >> 4) & (TEL_RDY | TEL_BSY));
				this.oStatus |= res & (TEL_RDY | TEL_BSY | KEY_TST);
				this.iStatus &= ~((res >> 4) & (KEY_RDY | KEY_BSY));
				this.iStatus |= res & (KEY_RDY | KEY_BSY);
				if (this.oStatus & TEL_RDY || this.iStatus & KEY_RDY) this.cpu.setInterrupt(dev, this.oPia);
				else this.cpu.clrInterrupt(dev);
				return data;
			}
			case DATAI: {
				const res = this.iData & 0xff;
				this.iStatus &= ~KEY_RDY;
				if ((this.oStatus & TEL_RDY) === 0) this.cpu.clrInterrupt(dev);
				return BigInt(res);
			}
			default:
				this.oData = Number(data & 0x7fn);
				this.oStatus &= ~TEL_RDY;
				this.oStatus |= TEL_BSY;
				if ((this.iStatus & KEY_RDY) === 0) this.cpu.clrInterrupt(dev);
				this.cpu.events.activate(this.out, this.wait);
				return data;
		}
	}

	private outSvc(): void {
		if (this.oData !== 0) this.print(this.oData & 0o177);
		this.oStatus &= ~TEL_BSY;
		this.oStatus |= TEL_RDY;
		this.cpu.setInterrupt(CTY_DEVNUM, this.oPia);
	}

	private inSvc(): void {
		this.cpu.events.activate(this.inp, this.cpu.tmxrPoll);
		if (this.iStatus & KEY_RDY) return;
		const ch = this.keys.shift();
		if (ch === undefined) return;
		this.iData = ch & 0o177;
		this.iStatus |= KEY_RDY;
		this.cpu.setInterrupt(CTY_DEVNUM, this.oPia);
	}

	private reset(): void {
		this.oStatus &= ~(TEL_RDY | TEL_BSY);
		this.iStatus &= ~(KEY_RDY | KEY_BSY);
		this.cpu.clrInterrupt(CTY_DEVNUM);
		this.cpu.events.activate(this.inp, this.cpu.tmxrPoll);
	}
}

// ---- Knight kludge, 16 terminal lines, device 600 (ka10_tk10.c) -----------

const TK10_DEVNUM = 0o600;
const TK10_LINES = 16;
const TK10_PIA = 0o7;
const TK10_RQINT = 0o10;
const TK10_ODONE = 0o20;
const TK10_STOP = 0o20;
const TK10_IDONE = 0o40;
const TK10_TYI = 0o7400;
const TK10_TYO = 0o170000;
const TK10_INT = 0o200000;
const TK10_CLEAR = 0o200000;
const TK10_SELECT = 0o400000;
const TK10_CONI_BITS = TK10_PIA | TK10_INT | TK10_TYI | TK10_ODONE | TK10_IDONE;
/** SIMH's tmxr_getc_ln marks a character as valid with bit 15; ITS masks it off. */
const TMXR_VALID = 0o100000;

/** One line: what is plugged in, its typeahead, and when its character in flight finishes. */
type Tk10Line = { conn: boolean; keys: number[]; txdone: boolean; txNext: number; rxNext: number; charTicks: number };

/**
 * The TK10, ITS's TTYs 1 to 16 on AI's KA10. ITS selects a line, then reads or writes it; the
 * scanner goes round the lines and interrupts for the first that finished a character or has one
 * waiting. Each line runs at its own baud rate, in simulated time: a character takes ten bit
 * times, out and in, so typing never runs ahead of the line.
 */
export class Tk10 {
	private status = 0;
	private scan = 0;
	readonly lines: Tk10Line[] = Array.from({ length: TK10_LINES }, () => ({ conn: false, keys: [], txdone: false, txNext: 0, rxNext: 0, charTicks: 0 }));
	readonly unit: Unit = { name: "tk10", svc: () => this.svc() };
	/** SIMH's scan interval in ticks: about 480 scans a simulated second. */
	interval = 2083;

	/** Every character ITS sends a line, 7 bits as SIMH's 7B mode passes them, NULs included. */
	constructor(
		private readonly cpu: Ka10Bus,
		private readonly print: (line: number, ch: number) => void,
	) {
		cpu.attachDevice(TK10_DEVNUM, (dev, data) => this.io(dev, data), () => this.reset());
	}

	/** Plug a terminal into line 0–15 (ITS's TTY 1–16), or pull it out; a pulled line drops its typeahead. */
	connect(line: number, on = true): void {
		const l = this.lines[line]!;
		l.conn = on;
		if (!on) l.keys.length = 0;
	}

	/** A line's speed in bits a second, 0 for as fast as ITS sends. */
	setBaud(line: number, baud: number): void {
		this.lines[line]!.charTicks = baud > 0 ? Math.round((10 * 1_000_000 * this.cpu.events.ticksPerUsec) / baud) : 0;
	}

	type(line: number, s: string): void {
		const l = this.lines[line]!;
		if (l.conn) for (const c of s) l.keys.push(c.charCodeAt(0) & 0o377);
	}

	typeahead(line: number): number {
		return this.lines[line]!.keys.length;
	}

	private get port(): number {
		return (this.status & TK10_TYO) >> 12;
	}

	private irq(): void {
		if (this.status & TK10_INT) this.cpu.setInterrupt(TK10_DEVNUM, this.status & TK10_PIA);
		else this.cpu.clrInterrupt(TK10_DEVNUM);
	}

	private io(dev: number, data: bigint): bigint {
		switch (dev & 3) {
			case CONI:
				return BigInt(this.status & TK10_CONI_BITS);
			case CONO: {
				const d = Number(data & RMASK);
				if (d & TK10_CLEAR) this.status &= ~TK10_INT;
				if (d & TK10_STOP) {
					this.status &= ~TK10_ODONE;
					if (!(this.status & TK10_IDONE)) this.status &= ~TK10_INT;
				}
				if (d & TK10_RQINT) {
					this.status &= ~TK10_TYI;
					this.status |= ((this.status & TK10_TYO) >> 4) | TK10_ODONE | TK10_INT;
				}
				if (d & TK10_SELECT) this.status = (this.status & ~TK10_TYO) | (d & TK10_TYO);
				this.status = (this.status & ~TK10_PIA) | (d & TK10_PIA);
				this.irq();
				return data;
			}
			case DATAO: {
				const l = this.lines[this.port]!;
				if (l.conn) this.print(this.port, Number(data & 0o177n));
				l.txdone = false;
				l.txNext = this.cpu.events.now + l.charTicks;
				this.status &= ~TK10_ODONE;
				if (!(this.status & TK10_IDONE)) this.status &= ~TK10_INT;
				this.irq();
				return data;
			}
			default: {
				const l = this.lines[this.port]!;
				const ch = l.keys.shift();
				if (ch !== undefined) l.rxNext = this.cpu.events.now + l.charTicks;
				this.status &= ~TK10_IDONE;
				if (!(this.status & TK10_ODONE)) this.status &= ~TK10_INT;
				this.irq();
				return BigInt(ch === undefined ? 0 : ch | TMXR_VALID);
			}
		}
	}

	private flag(port: number, done: number): void {
		this.status = (this.status & ~TK10_TYI) | (port << 8) | TK10_INT | done;
		this.cpu.setInterrupt(TK10_DEVNUM, this.status & TK10_PIA);
	}

	private svc(): void {
		this.cpu.events.activate(this.unit, this.interval);
		const now = this.cpu.events.now;
		for (let i = 0; i < TK10_LINES; i++) {
			this.scan = (this.scan + 1) & 0o17;
			const l = this.lines[this.scan]!;
			if (!l.txdone && (!l.conn || l.txNext <= now)) {
				l.txdone = true;
				this.flag(this.scan, TK10_ODONE);
				return;
			}
			if (l.conn && l.keys.length > 0 && l.rxNext <= now) {
				this.flag(this.scan, TK10_IDONE);
				return;
			}
		}
	}

	private reset(): void {
		this.status = 0;
		this.cpu.clrInterrupt(TK10_DEVNUM);
		this.cpu.events.activate(this.unit, this.interval);
	}
}

// ---- paper tape reader 104 and punch 100 -----------------------------------

const PP_DEVNUM = 0o100;
const PR_DEVNUM = 0o104;
const PI_DONE = 0o7;
const DONE_FLG = 0o10;
const BUSY_FLG = 0o20;
const BIN_FLG = 0o40;
const NO_TAPE_PP = 0o100;
const TAPE_PR = 0o400;

export class PaperTape {
	private rStatus = 0;
	private rChr = 0;
	private rChl = 0;
	private tape: Uint8Array | undefined;
	private pos = 0;
	private pStatus = 0;
	private pChr = 0;
	/** Everything punched. */
	readonly punched: number[] = [];
	readonly reader: Unit = { name: "ptr", svc: () => this.readerSvc() };
	readonly punch: Unit = { name: "ptp", svc: () => this.punchSvc() };
	wait = 10000;

	constructor(private readonly cpu: Ka10Bus) {
		cpu.attachDevice(PR_DEVNUM, (dev, data) => this.readerIo(dev, data), () => this.readerReset());
		cpu.attachDevice(PP_DEVNUM, (dev, data) => this.punchIo(dev, data), () => this.punchReset());
	}

	attach(tape: Uint8Array): void {
		this.tape = tape;
		this.pos = 0;
		this.rStatus |= TAPE_PR;
	}

	/** SIMH's ptr_boot: load the RIM10 loader at the front of the tape, then start the reader. */
	boot(): void {
		let word = this.readWord();
		let wc = Number((word >> 18n) & RMASK);
		let addr = Number(word & RMASK);
		while (wc !== 0) {
			wc = (wc + 1) & 0o777777;
			addr = (addr + 1) & 0o777777;
			word = this.readWord();
			this.cpu.deposit(addr, word);
		}
		this.cpu.deposit(addr, word);
		this.rStatus = BUSY_FLG | BIN_FLG | TAPE_PR;
		this.rChr = 0;
		this.rChl = 0;
		this.cpu.events.activate(this.reader, this.wait);
		this.cpu.PC = Number(word & RMASK);
	}

	private getc(): number {
		if (!this.tape || this.pos >= this.tape.length) return -1;
		return this.tape[this.pos++]!;
	}

	private readWord(): bigint {
		let word = 0n;
		for (let i = 0; i < 6; ) {
			const ch = this.getc();
			if (ch < 0) return word;
			if (ch & 0o200) {
				word = (word << 6n) | BigInt(ch & 0o77);
				i++;
			}
		}
		return word;
	}

	private readerIo(dev: number, data: bigint): bigint {
		switch (dev & 3) {
			case CONI:
				return BigInt(this.rStatus);
			case CONO:
				this.cpu.clrInterrupt(dev);
				this.rStatus = (PI_DONE | DONE_FLG | BUSY_FLG | BIN_FLG) & Number(data & RMASK);
				if (this.tape) this.rStatus |= TAPE_PR;
				if (this.rStatus & BUSY_FLG) {
					this.rChr = 0;
					this.rChl = 0;
					this.cpu.events.activate(this.reader, this.wait);
				}
				if (this.rStatus & DONE_FLG) this.cpu.setInterrupt(dev, this.rStatus);
				return data;
			case DATAI: {
				let res = data;
				if (this.rStatus & DONE_FLG) {
					res = (BigInt(this.rChl) << 18n) | BigInt(this.rChr);
					this.rStatus &= ~DONE_FLG;
					this.cpu.clrInterrupt(dev);
					this.cpu.events.activate(this.reader, this.wait);
				}
				this.rStatus |= BUSY_FLG;
				return res;
			}
			default:
				return data;
		}
	}

	private readerSvc(): void {
		let count = this.rStatus & BIN_FLG ? 6 : 1;
		this.rStatus &= ~BUSY_FLG;
		this.rStatus |= DONE_FLG;
		this.cpu.setInterrupt(PR_DEVNUM, this.rStatus);
		if (!this.tape) return;
		let word = 0n;
		while (count > 0) {
			const temp = this.getc();
			if (temp < 0) {
				this.rStatus &= ~TAPE_PR;
				break;
			}
			if (this.rStatus & BIN_FLG) {
				if (temp & 0o200) {
					word = (word << 6n) | BigInt(temp & 0o77);
					count--;
				}
			} else {
				word |= BigInt(temp);
				count--;
			}
		}
		this.rChl = Number((word >> 18n) & RMASK);
		this.rChr = Number(word & RMASK);
	}

	private readerReset(): void {
		this.rChr = 0;
		this.rChl = 0;
		this.rStatus = 0;
		this.cpu.clrInterrupt(PR_DEVNUM);
		this.cpu.events.cancel(this.reader);
	}

	private punchIo(dev: number, data: bigint): bigint {
		switch (dev & 3) {
			case CONI:
				return BigInt(this.pStatus);
			case CONO:
				this.cpu.clrInterrupt(dev);
				this.pStatus = (PI_DONE | DONE_FLG | BUSY_FLG | BIN_FLG) & Number(data & RMASK);
				this.pStatus |= NO_TAPE_PP;
				if (this.pStatus & BUSY_FLG) {
					this.pChr = 0;
					this.cpu.events.activate(this.punch, this.wait);
				}
				if (this.pStatus & DONE_FLG) this.cpu.setInterrupt(dev, this.pStatus);
				return data;
			case DATAO:
				if ((this.pStatus & BUSY_FLG) === 0) {
					this.pChr = Number(data & 0o377n);
					if (this.pStatus & BIN_FLG) this.pChr = (this.pChr & 0o77) | 0o200;
					this.pStatus |= BUSY_FLG;
					this.pStatus &= ~DONE_FLG;
					this.cpu.clrInterrupt(dev);
					this.cpu.events.activate(this.punch, this.wait);
				}
				return data;
			default:
				return 0n;
		}
	}

	private punchSvc(): void {
		this.pStatus &= ~BUSY_FLG;
		this.pStatus |= DONE_FLG;
		this.cpu.setInterrupt(PP_DEVNUM, this.pStatus & 7);
		this.pStatus |= NO_TAPE_PP;
	}

	private punchReset(): void {
		this.pChr = 0;
		this.pStatus = 0;
		this.cpu.clrInterrupt(PP_DEVNUM);
		this.cpu.events.cancel(this.punch);
	}
}

// ---- DF10 data channel ------------------------------------------------------

const ICWA = 0o776;
const PI_ENABLE = 0o10;
const BUSY = 0o20;
const CCW_COMP = 0o40;

/** SIMH's struct df10 and its functions, KA10 with the ITS address extension. */
export class Df10 {
	status = 0;
	cia = 0;
	ccw = 0;
	wcr = 0;
	cda = 0;
	buf = 0n;
	readonly amask = 0o777777;
	readonly wmask = 0o777777;
	readonly cshift = 18;

	constructor(
		private readonly cpu: Ka10Bus,
		readonly devnum: number,
		readonly nxmerr: number,
	) {}

	init(): void {
		this.status = 0;
	}

	setirq(): void {
		this.status |= PI_ENABLE;
		this.cpu.setInterrupt(this.devnum, this.status);
	}

	writecw(): void {
		if (this.wcr !== 0) this.cda++;
		const wrd = (BigInt(this.ccw & this.wmask) << BigInt(this.cshift)) | BigInt(this.cda & this.amask);
		this.cpu.writeWord(this.cia | 1, wrd);
	}

	finishOp(flags: number): void {
		this.status &= ~BUSY;
		this.status |= flags;
		this.writecw();
		this.setirq();
	}

	setup(addr: number): void {
		this.cia = addr & ICWA;
		this.ccw = this.cia;
		this.wcr = 0;
		this.status |= BUSY;
	}

	fetch(): boolean {
		let data = this.cpu.readWord(this.ccw);
		if (data === undefined) {
			this.finishOp(this.nxmerr);
			return false;
		}
		const wm = BigInt(this.wmask) << BigInt(this.cshift);
		const am = BigInt(this.amask);
		while ((data & wm) === 0n) {
			if ((data & am) === 0n || Number(data & am) === this.ccw) {
				this.finishOp(0);
				return false;
			}
			this.ccw = Number(data & am);
			data = this.cpu.readWord(this.ccw);
			if (data === undefined) {
				this.finishOp(1 << this.nxmerr);
				return false;
			}
		}
		if (this.cpu.its) {
			this.wcr = (Number((data >> BigInt(this.cshift)) & 0o77777n) | 0o700000) >>> 0;
			this.cda = Number(data & RMASK);
			this.cda |= Number((data >> 15n) & 0o7000000n) ^ 0o7000000;
			this.ccw = (this.ccw + 1) & this.amask;
			return true;
		}
		this.wcr = Number((data >> BigInt(this.cshift)) & BigInt(this.wmask));
		this.cda = Number(data & am);
		this.ccw = (this.ccw + 1) & this.amask;
		return true;
	}

	read(): boolean {
		if (this.wcr === 0 && !this.fetch()) return false;
		this.wcr = (this.wcr + 1) & this.wmask;
		let data = 0n;
		if (this.cda !== 0) {
			if (this.cda > this.cpu.memWords) {
				this.finishOp(1 << this.nxmerr);
				return false;
			}
			this.cda = this.cpu.its ? ((this.cda + 1) & 0o777777) | (this.cda & 0o7000000) : (this.cda + 1) & this.amask;
			const d = this.cpu.readWord(this.cda);
			if (d === undefined) {
				this.finishOp(1 << this.nxmerr);
				return false;
			}
			data = d;
		}
		this.buf = data;
		if (this.wcr === 0) return this.fetch();
		return true;
	}

	write(): boolean {
		if (this.wcr === 0 && !this.fetch()) return false;
		this.wcr = (this.wcr + 1) & this.wmask;
		if (this.cda !== 0) {
			if (this.cda > this.cpu.memWords) {
				this.finishOp(1 << this.nxmerr);
				return false;
			}
			this.cda = this.cpu.its ? ((this.cda + 1) & 0o777777) | (this.cda & 0o7000000) : (this.cda + 1) & this.amask;
			if (!this.cpu.writeWord(this.cda, this.buf)) {
				this.finishOp(1 << this.nxmerr);
				return false;
			}
		}
		if (this.wcr === 0) return this.fetch();
		return true;
	}
}

// ---- RP10 disk controller, device 250, with RP03 packs ------------------------

/** A disk pack in SIMH's format: blocks of 128 words, each word a little-endian uint64. */
export interface BlockStore {
	read(block: number, into: BigUint64Array): void;
	write(block: number, from: BigUint64Array): void;
}

/** A pack held in memory; writes land in the same bytes. */
export class MemoryPack implements BlockStore {
	constructor(readonly bytes: Uint8Array) {}

	read(block: number, into: BigUint64Array): void {
		const view = new DataView(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength);
		const base = block * RP_NUMWD * 8;
		for (let i = 0; i < RP_NUMWD; i++) {
			const off = base + i * 8;
			into[i] = off + 8 <= this.bytes.byteLength ? view.getBigUint64(off, true) : 0n;
		}
	}

	write(block: number, from: BigUint64Array): void {
		const view = new DataView(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength);
		const base = block * RP_NUMWD * 8;
		for (let i = 0; i < RP_NUMWD; i++) {
			const off = base + i * 8;
			if (off + 8 <= this.bytes.byteLength) view.setBigUint64(off, from[i]!, true);
		}
	}
}

const RP_NUMWD = 128;
const DP_DEVNUM = 0o250;
const NUM_UNITS_DP = 8;
const SEEK_DONE = 0o100;
const SEEK_STATE = 0o200;
const DONE = 0o400;
const SUF_ERR = 0o100;
const SEC_ERR = 0o200;
const ILL_CMD = 0o400;
const ILL_WR = 0o1000;
const NOT_RDY = 0o2000;
const PRT_ERR = 0o4000;
const NXM_ERR = 0o10000;
const SRC_ERR = 0o40000;
const END_CYL = 0o200000;
const SRC_DONE = 0o400000;
const CLRMSK = 0o177710;
const CLRMSK2 = 0o176000000;
const SECTOR = 0o170000n;
const CYL256 = 0o200000n;
const SURFACE = 0o17400000n;
const WR_HD_LK = 0o1000000n;
const SEL_RP03 = 0o2000n;
const SEL_CYL256 = 0o4000n;
const SEL_SEC = 0o760000n;
const NO_DRIVE = 0o4000000;
const DRV_ONLINE = 0o20000000n;
const ON_CYL = 0o40000000n;
const RD = 0;
const WR = 1;
const RV = 2;
const WH = 3;
const SK = 4;
const CL = 5;
const NO = 6;
const RC = 7;
const RP03 = { sect: 10, surf: 20, cyl: 406 };

type DpUnit = Unit & {
	CUR_CYL: number;
	DATAPTR: number;
	UFLAGS: number;
	STATUS: number;
	hwmark: number;
	pack: BlockStore | undefined;
};

const EMPTY = 0xffffffff;

export class Rp10 {
	readonly units: DpUnit[];
	readonly df10: Df10;
	private cur = 0;
	private sectCount = 0;
	private readonly buf = new BigUint64Array(RP_NUMWD);
	/** SIMH's `set dp headers`: off, as ITS's packs are run. */
	writeHeaders = false;
	/** Blocks read and written, for the cabinet to show. */
	reads = 0;
	writes = 0;

	constructor(private readonly cpu: Ka10Bus) {
		this.df10 = new Df10(cpu, DP_DEVNUM, 12);
		this.units = Array.from({ length: NUM_UNITS_DP }, (_, i) => {
			const u: DpUnit = { name: `dpa${i}`, svc: () => this.svc(u), CUR_CYL: 0, DATAPTR: 0, UFLAGS: 0, STATUS: 0, hwmark: EMPTY, pack: undefined };
			return u;
		});
		cpu.attachDevice(DP_DEVNUM, (dev, data) => this.io(dev, data), () => this.reset());
	}

	/** SIMH's dp_attach. */
	attach(unit: number, pack: BlockStore): void {
		const u = this.units[unit]!;
		u.pack = pack;
		u.CUR_CYL = 0;
		u.UFLAGS = (NO << 3) | SEEK_DONE;
		this.df10.status |= PI_ENABLE;
		this.cpu.setInterrupt(DP_DEVNUM, this.df10.status);
	}

	private reset(): void {
		for (const u of this.units) {
			u.UFLAGS = 0;
			u.STATUS = 0;
			u.CUR_CYL = 0;
		}
		this.df10.init();
	}

	private io(dev: number, data: bigint): bigint {
		const df10 = this.df10;
		let unit = this.cur;
		let u = this.units[unit]!;
		switch (dev & 3) {
			case CONI:
				return BigInt((df10.status | u.STATUS) >>> 0);
			case CONO: {
				const d = Number(data & RMASK);
				this.cpu.clrInterrupt(dev);
				df10.status &= ~7;
				df10.status |= d & 7;
				if (d & BUSY) {
					this.cpu.events.cancel(u);
					df10.finishOp(0);
					u.STATUS &= ~BUSY;
				}
				u.STATUS &= ~(d & CLRMSK);
				if (d & PRT_ERR) u.STATUS &= ~CLRMSK2;
				if (d & CCW_COMP) {
					df10.writecw();
					df10.status |= CCW_COMP;
				}
				if (d & PI_ENABLE) {
					u.UFLAGS &= ~DONE;
					let tmp = 1;
					for (unit = 0; unit < NUM_UNITS_DP; unit++) {
						u = this.units[unit]!;
						if (u.UFLAGS & SEEK_DONE) {
							tmp = 0;
							break;
						}
					}
					if (tmp) df10.status &= ~PI_ENABLE;
					else df10.setirq();
					// SIMH's loop leaves its pointer on the next controller's first drive, which is off and reads 0.
					if (unit === NUM_UNITS_DP) return data;
				}
				if ((u.UFLAGS & DONE) !== 0) df10.setirq();
				return data;
			}
			case DATAI: {
				let res = BigInt(unit) << 33n;
				if (!this.writeHeaders) res |= WR_HD_LK;
				res |= SEL_RP03;
				if (u.pack) {
					res |= DRV_ONLINE;
					const cyl = u.CUR_CYL;
					res |= BigInt(cyl & 0o377) << 25n;
					if (cyl & 0o400) res |= SEL_CYL256;
					if (this.sectCount > 20) this.sectCount = 0;
					res |= SEL_SEC & BigInt(this.sectCount << 13);
					this.sectCount++;
					if ((u.UFLAGS & SEEK_STATE) === 0) res |= ON_CYL;
				}
				for (let i = 0; i < NUM_UNITS_DP; i++) if (this.units[i]!.UFLAGS & SEEK_DONE) res |= BigInt(0o400 >> i);
				return res;
			}
			default: {
				if (df10.status & BUSY) {
					u.STATUS |= ILL_CMD;
					return data;
				}
				this.cpu.clrInterrupt(dev);
				df10.status &= ~(PI_ENABLE | CCW_COMP);
				unit = Number((data >> 30n) & 7n);
				this.cur = unit;
				u = this.units[unit]!;
				if ((u.STATUS & NOT_RDY) === 0)
					u.STATUS &= ~(SUF_ERR | SEC_ERR | SRC_ERR | NXM_ERR | ILL_WR | NO_DRIVE | NOT_RDY | ILL_CMD | END_CYL | SRC_DONE);
				let cyl = Number((data >> 22n) & 0o377n);
				if (data & CYL256) cyl += 0o400;
				let tmp = Number((data >> 33n) & 7n);
				switch (tmp) {
					case WH:
						if (!this.writeHeaders) {
							u.UFLAGS |= DONE;
							u.STATUS |= ILL_WR;
							df10.setirq();
							return data;
						}
						data &= ~SECTOR & FMASK;
					// falls through
					case WR:
					case RD:
					case RV:
						if (!u.pack) {
							u.UFLAGS |= DONE;
							u.STATUS |= NOT_RDY;
							df10.setirq();
							return data;
						}
						u.UFLAGS = Number((data & (SURFACE | SECTOR)) >> 3n) | (cyl << 20) | (tmp << 3);
						u.DATAPTR = 0;
						u.hwmark = EMPTY;
						df10.setup(Number(data & 0xffffffffn));
						u.STATUS |= BUSY;
						break;
					case RC:
						cyl = 0;
					// falls through
					case SK:
						u.STATUS |= NOT_RDY;
						if (!u.pack) return data;
						u.UFLAGS = (cyl << 20) | (tmp << 3) | SEEK_STATE;
						break;
					case CL:
						u.UFLAGS &= ~DONE;
						for (let i = 0; i < NUM_UNITS_DP; i++) if (data & BigInt(0o400 >> i)) this.units[i]!.UFLAGS &= ~SEEK_DONE;
					// falls through
					default:
						tmp = 0;
						for (let i = 0; i < NUM_UNITS_DP; i++)
							if (this.units[i]!.UFLAGS & SEEK_DONE) {
								tmp = 1;
								break;
							}
						if (tmp) df10.setirq();
						return data;
				}
				this.cpu.events.activate(u, 150);
				return data;
			}
		}
	}

	private blockOf(cyl: number, surf: number, sect: number): number {
		return (cyl * RP03.surf + surf) * RP03.sect + sect;
	}

	private svc(u: DpUnit): void {
		const df10 = this.df10;
		const ev = this.cpu.events;
		const cmd = (u.UFLAGS & 0o70) >> 3;
		let sect = u.UFLAGS >> 9;
		let surf = (sect >> 5) & 0o37;
		const cyl = (u.UFLAGS >> 20) & 0o777;
		sect &= 0o17;
		switch (cmd) {
			case WR:
			case RV:
			case RD: {
				if (u.hwmark === EMPTY) {
					u.STATUS |= SRC_DONE;
					if (u.STATUS & END_CYL) {
						if (cmd === WR && df10.read()) df10.read();
						u.UFLAGS |= DONE;
						u.STATUS &= ~BUSY;
						df10.finishOp(0);
						return;
					}
					if (sect >= RP03.sect) {
						u.STATUS &= ~BUSY;
						u.STATUS |= SEC_ERR;
					}
					if (surf >= RP03.surf) {
						u.STATUS &= ~BUSY;
						u.STATUS |= SUF_ERR;
					}
					if (cyl !== u.CUR_CYL) {
						u.STATUS &= ~BUSY;
						u.STATUS |= SRC_ERR;
					}
					if ((u.STATUS & BUSY) === 0) {
						u.UFLAGS |= DONE;
						df10.finishOp(0);
						return;
					}
					if (cmd !== WR) {
						u.pack!.read(this.blockOf(cyl, surf, sect), this.buf);
						this.reads++;
						u.hwmark = RP_NUMWD;
						u.DATAPTR = 0;
						sect = sect + 1;
						if (sect >= RP03.sect) {
							sect = 0;
							surf = surf + 1;
							if (surf >= RP03.surf) u.STATUS |= END_CYL;
							else {
								u.UFLAGS &= ~0o1757000;
								u.UFLAGS |= surf << 14;
							}
						} else {
							u.UFLAGS &= ~0o17000;
							u.UFLAGS |= sect << 9;
						}
					} else {
						u.DATAPTR = 0;
						u.hwmark = 0;
					}
					ev.activate(u, 50);
					return;
				}
				let r: boolean;
				if (cmd === WR) {
					r = df10.read();
					if (r) u.hwmark = u.DATAPTR;
					this.buf[u.DATAPTR] = df10.buf;
				} else {
					df10.buf = this.buf[u.DATAPTR]!;
					r = df10.write();
				}
				u.DATAPTR++;
				if (u.DATAPTR >= RP_NUMWD || !r) {
					if (cmd === WR) {
						const da = this.blockOf(cyl, surf, sect);
						for (; u.DATAPTR < RP_NUMWD; u.DATAPTR++) this.buf[u.DATAPTR] = 0n;
						u.pack!.write(da, this.buf);
						this.writes++;
						u.STATUS |= SRC_DONE;
						sect = sect + 1;
						if (sect >= RP03.sect) {
							sect = 0;
							surf = surf + 1;
							if (surf >= RP03.surf) u.STATUS |= END_CYL;
							else {
								u.UFLAGS &= ~(0o1757 << 9);
								u.UFLAGS |= surf << 14;
							}
						} else {
							u.UFLAGS &= ~(0o17 << 9);
							u.UFLAGS |= sect << 9;
						}
					}
					u.DATAPTR = 0;
					u.hwmark = EMPTY;
				}
				if (r) ev.activate(u, 25);
				else {
					u.STATUS &= ~(SRC_DONE | END_CYL | BUSY);
					u.UFLAGS |= DONE;
				}
				return;
			}
			case RC:
			case SK: {
				if ((u.UFLAGS & SEEK_STATE) === 0) return;
				const diff = cyl - u.CUR_CYL;
				const diffs = diff < 0 ? -1 : 1;
				const done = (): void => {
					u.UFLAGS |= SEEK_DONE;
					u.UFLAGS &= ~SEEK_STATE;
					u.STATUS &= ~NOT_RDY;
					if ((df10.status & BUSY) === 0) df10.setirq();
				};
				if (diff === 0) done();
				else if (diff < 10 && diff > -10) {
					u.CUR_CYL += diffs;
					if (u.CUR_CYL < 0) {
						u.CUR_CYL = 0;
						done();
					} else if (u.CUR_CYL > RP03.cyl) {
						u.CUR_CYL = RP03.cyl;
						done();
					} else ev.activate(u, 500);
				} else if (diff > 100 || diff < -100) {
					u.CUR_CYL += diffs * 100;
					ev.activate(u, 4000);
				} else {
					u.CUR_CYL += diffs * 10;
					ev.activate(u, 1000);
				}
				return;
			}
			default:
				return;
		}
	}
}

// ---- Paul DeCoriolis's clock, device 500 -------------------------------------

const PD_DEVNUM = 0o500;
const PIA_FLG = 0o7;
const CLK_IRQ = 0o10;

export class PdClock {
	private pia = 0;
	readonly unit: Unit = { name: "pd", svc: () => this.svc() };

	/** `now` gives the wall-clock date; a fixed date makes a run repeatable. */
	constructor(
		private readonly cpu: Ka10Bus,
		private readonly now: () => Date = () => new Date(),
	) {
		cpu.attachDevice(PD_DEVNUM, (dev, data) => this.io(dev, data));
	}

	/** Sixtieths of a second since the start of the year, local time. */
	ticks(): bigint {
		const t = this.now();
		const start = new Date(t.getFullYear(), 0, 1);
		const yday = Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime() - start.getTime()) / 86_400_000);
		const seconds = 86400 * yday + 3600 * t.getHours() + 60 * t.getMinutes() + t.getSeconds();
		return 60n * BigInt(seconds);
	}

	private io(dev: number, data: bigint): bigint {
		switch (dev & 7) {
			case DATAI:
				return this.ticks();
			case CONI:
				return BigInt(this.pia & (CLK_IRQ | PIA_FLG));
			case CONO:
				this.pia &= ~PIA_FLG;
				this.pia |= Number(data & BigInt(PIA_FLG));
				if (this.pia & PIA_FLG && !this.cpu.events.isActive(this.unit)) this.cpu.events.activate(this.unit, 10000);
				if (data & BigInt(CLK_IRQ)) {
					this.pia &= ~CLK_IRQ;
					this.cpu.clrInterrupt(PD_DEVNUM);
				}
				return data;
			default:
				return data;
		}
	}

	private svc(): void {
		this.cpu.events.activateAfter(this.unit, 1_000_000 / 60);
		if (this.pia & PIA_FLG) {
			this.pia |= CLK_IRQ;
			this.cpu.setInterrupt(PD_DEVNUM, this.pia);
		} else this.cpu.events.cancel(this.unit);
	}
}
