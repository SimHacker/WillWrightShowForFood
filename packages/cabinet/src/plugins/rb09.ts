import type { Cpu, Device, Iot, IotReply } from "../bus.js";

export const RB_WORDS_PER_SECTOR = 64;
export const RB_SECTORS = 80;
export const RB_TRACKS = 200;
export const RB_WORDS_PER_TRACK = RB_SECTORS * RB_WORDS_PER_SECTOR;
export const RB_SIZE = RB_TRACKS * RB_WORDS_PER_TRACK; // 1,024,000 words
const RB_TRACKS_PER_LOCK = 10;

const STA_ERR = 0o400000;
const STA_PAR = 0o200000;
const STA_ILA = 0o100000; // illegal address
const STA_TIM = 0o040000;
const STA_NRY = 0o020000; // not ready
const STA_DON = 0o010000;
const STA_IE = 0o004000;
const STA_BSY = 0o002000;
const STA_WR = 0o001000;
const STA_XOR = STA_IE | STA_BSY | STA_WR;
const STA_MBZ = 0o000777;
const STA_EFLGS = STA_PAR | STA_ILA | STA_TIM | STA_NRY;

export type Rb09Opts = {
	cpu: Cpu;
	/** The platter, one 18-bit word per element. Absent means no disk: NRY on every transfer. */
	image?: Uint32Array;
	/** Cycles per word under the heads, SIMH rb_time. */
	wordCycles?: number;
	/** One bit per ten tracks, SIMH rb_wlk. */
	writeLock?: number;
};

/**
 * RB09, the Burroughs fixed-head disk on the Bell Labs PDP-7 that UNIX was
 * written on: 200 tracks of 80 sectors of 64 words, addressed in BCD, device
 * 71. Port of Open SIMH PDP18B/pdp18b_rb.c (Bob Supnik), including its
 * rotational latency and burst transfer: the whole block moves at once when
 * the first sector comes under the heads, then DONE.
 */
export class Rb09 implements Device {
	readonly name = "rb09";
	readonly iots = [0o71];

	sta = 0;
	/** Binary word address on the platter. The program sees BCD track and sector. */
	da = 0;
	ma = 0;
	wc = 0;
	writeLock: number;
	image: Uint32Array | null;
	/** Words written since mount: the bench saves the platter when this is set. */
	dirty = false;

	private readonly cpu: Cpu;
	private readonly wordCycles: number;
	private now = 0;
	private due = -1;

	constructor(opts: Rb09Opts) {
		this.cpu = opts.cpu;
		this.image = opts.image ?? null;
		this.wordCycles = opts.wordCycles ?? 10;
		this.writeLock = opts.writeLock ?? 0;
	}

	mount(image: Uint32Array | null): void {
		this.image = image;
		this.dirty = false;
	}

	iot(req: Iot): IotReply {
		let ac = req.ac;
		let skip = false;
		const sb = req.pulse & 0o60;
		if (req.pulse & 0o1) {
			if (sb === 0o00) this.sta &= ~(STA_ERR | STA_EFLGS | STA_DON); // DBCF
			if (sb === 0o20 && this.sta & (STA_ERR | STA_DON)) skip = true; // DBSF
			if (sb === 0o40) this.sta = 0; // DBCS
		}
		if (req.pulse & 0o2) {
			if (sb === 0o00) ac |= bcdAddress(this.da); // DBRD
			if (sb === 0o20) ac |= this.sta; // DBRS
			if (sb === 0o40) this.ma = ac & 0o77777; // DBLM
		}
		if (req.pulse & 0o4) {
			if (sb === 0o00) this.da = this.setAddress(ac); // DBLD
			if (sb === 0o20) this.wc = ac & 0o177777; // DBLW
			if (sb === 0o40) {
				// DBLS
				this.sta = (this.sta & STA_XOR) ^ (ac & ~STA_MBZ);
				if (this.sta & STA_BSY) {
					if (this.due < 0) this.due = this.now + this.latency();
				} else this.due = -1;
			}
		}
		this.update(0);
		return { ac, skip };
	}

	tick(cycles: number): void {
		this.now += cycles;
		if (this.due >= 0 && this.now >= this.due) {
			this.due = -1;
			this.transfer();
		}
	}

	irq(): boolean {
		return (this.sta & (STA_ERR | STA_DON)) !== 0 && (this.sta & STA_IE) !== 0;
	}

	reset(): void {
		this.sta = 0;
		this.da = 0;
		this.ma = 0;
		this.wc = 0;
		this.due = -1;
		this.update(0);
	}

	/** Cycles until the addressed word comes round, SIMH GET_POS. */
	private latency(): number {
		const pos = Math.floor(this.now / this.wordCycles) % RB_WORDS_PER_TRACK;
		let t = (this.da % RB_WORDS_PER_TRACK) - pos;
		if (t < 0) t += RB_WORDS_PER_TRACK;
		return t * this.wordCycles;
	}

	private transfer(): void {
		const image = this.image;
		if (!image) {
			this.update(STA_NRY | STA_DON);
			return;
		}
		do {
			if (this.sta & STA_WR) {
				const track = Math.floor(this.da / RB_WORDS_PER_TRACK);
				if ((this.writeLock >> Math.floor(track / RB_TRACKS_PER_LOCK)) & 1) {
					this.update(STA_ILA | STA_DON);
					return;
				}
				image[this.da] = this.cpu.read(this.ma);
				this.dirty = true;
			} else if (this.ma < this.cpu.coreWords) {
				this.cpu.write(this.ma, image[this.da] ?? 0);
			}
			this.wc = (this.wc + 1) & 0o177777;
			this.ma = (this.ma + 1) & 0o77777;
			this.da += 1;
			// SIMH wraps on da > RB_SIZE, one word late; the platter has no word RB_SIZE.
			if (this.da >= RB_SIZE) this.da = 0;
		} while (this.wc !== 0);
		this.update(STA_DON);
	}

	private setAddress(bcd: number): number {
		const t = fromBcd((bcd >> 8) & 0x1ff);
		const s = fromBcd(bcd & 0xff);
		if (t < 0 || t >= RB_TRACKS || s < 0 || s >= RB_SECTORS) {
			this.update(STA_ILA);
			return this.da;
		}
		return (t * RB_SECTORS + s) * RB_WORDS_PER_SECTOR;
	}

	private update(flags: number): void {
		this.sta = (this.sta | flags) & ~(STA_ERR | STA_MBZ);
		if (this.sta & STA_EFLGS) this.sta |= STA_ERR;
		if (this.sta & STA_DON) this.sta &= ~STA_BSY;
	}
}

function bcdAddress(da: number): number {
	const t = Math.floor(da / RB_WORDS_PER_TRACK);
	const s = Math.floor((da % RB_WORDS_PER_TRACK) / RB_WORDS_PER_SECTOR);
	return (toBcd(t) << 8) | toBcd(s);
}

function toBcd(n: number): number {
	let r = 0;
	for (let i = 0; n !== 0; n = Math.floor(n / 10), i += 4) r |= (n % 10) << i;
	return r;
}

function fromBcd(bcd: number): number {
	let r = 0;
	for (let i = 1; bcd !== 0; bcd >>= 4, i *= 10) {
		const d = bcd & 0xf;
		if (d >= 10) return -1;
		r += d * i;
	}
	return r;
}

/** SIMH attach format: one little-endian int32 per word. */
export function parseRbImage(bytes: Uint8Array): Uint32Array {
	const out = new Uint32Array(RB_SIZE);
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const n = Math.min(RB_SIZE, Math.floor(bytes.byteLength / 4));
	for (let i = 0; i < n; i += 1) out[i] = view.getUint32(i * 4, true) & 0o777777;
	return out;
}

export function rbImageBytes(image: Uint32Array): Uint8Array {
	const bytes = new Uint8Array(image.length * 4);
	const view = new DataView(bytes.buffer);
	for (let i = 0; i < image.length; i += 1) view.setUint32(i * 4, image[i] ?? 0, true);
	return bytes;
}
