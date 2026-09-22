import type { Device, Iot, IotReply } from "../bus.js";

export type TeletypeOpts = {
	/** Cycles from TLS to done-flag. Real KSR-33 ≈ 100ms ≈ 57000 cycles. */
	printCycles?: number;
	/** Where printed characters go. */
	onPrint?: (char: number) => void;
};

/**
 * Keyboard (device 03: KSF 700301, KRB 700312) and teleprinter
 * (device 04: TSF 700401, TCF 700402, TLS 700406) as one box, the KSR-33.
 * Semantics from SIMH pdp18b_stddev.c tti()/tto(): pulse&1 skip-on-flag,
 * pulse&2 clear flag (keyboard also ORs buffer into AC), pulse&4 load & print.
 */
export class Teletype implements Device {
	readonly name = "teletype";
	readonly iots = [0o03, 0o04];

	kbdFlag = false;
	kbdBuf = 0;
	ttoFlag = false;
	output: number[] = [];

	private readonly printCycles: number;
	private readonly onPrint: ((char: number) => void) | undefined;
	private printing = -1; // cycles remaining; -1 = idle
	private printBuf = 0;
	private pending: number[] = [];

	constructor(opts: TeletypeOpts = {}) {
		this.printCycles = opts.printCycles ?? 1000;
		this.onPrint = opts.onPrint;
	}

	/** Bench-side: a key arrives. Queued if the program hasn't read the last one. */
	type(char: number): void {
		this.pending.push(char & 0o377);
		this.deliver();
	}

	typeString(s: string): void {
		for (const ch of s) this.type(ch.charCodeAt(0));
	}

	iot(req: Iot): IotReply {
		let ac = req.ac;
		let skip = false;
		if (req.device === 0o03) {
			if (req.pulse & 0o1) skip = this.kbdFlag; // KSF
			if (req.pulse & 0o2) {
				// KRB (pulse 012 = clear AC first, done by the CPU) / KRS
				this.kbdFlag = false;
				ac = ac | this.kbdBuf;
				this.deliver();
			}
		} else {
			if (req.pulse & 0o1) skip = this.ttoFlag; // TSF
			if (req.pulse & 0o2) this.ttoFlag = false; // TCF / TLS clear
			if (req.pulse & 0o4) {
				// TLS: load buffer, print completes after a delay
				this.printBuf = ac & 0o377;
				this.printing = this.printCycles;
			}
		}
		return { ac, skip };
	}

	tick(cycles: number): void {
		if (this.printing < 0) return;
		this.printing -= cycles;
		if (this.printing < 0) {
			this.output.push(this.printBuf);
			this.onPrint?.(this.printBuf);
			this.ttoFlag = true;
		}
	}

	irq(): boolean {
		return this.kbdFlag || this.ttoFlag;
	}

	reset(): void {
		this.kbdFlag = false;
		this.ttoFlag = false;
		this.printing = -1;
	}

	/** Printed output as a string (7-bit, high bit stripped). */
	printed(): string {
		return String.fromCharCode(...this.output.map((c) => c & 0o177));
	}

	private deliver(): void {
		if (!this.kbdFlag && this.pending.length > 0) {
			this.kbdBuf = this.pending.shift() as number;
			this.kbdFlag = true;
		}
	}
}
