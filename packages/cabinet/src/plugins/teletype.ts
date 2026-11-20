import type { Device, Iot, IotReply } from "../bus.js";
import { gate, type IopBus, type KorzDevice, skipIf, timed } from "../korz/iop.js";

export type TeletypeOpts = {
	/** Cycles from TLS to done-flag. Real KSR-33 ≈ 100ms ≈ 57000 cycles. */
	printCycles?: number;
	/** Where printed characters go. */
	onPrint?: (char: number) => void;
};

export type TeletypeState = {
	kbdFlag: boolean;
	kbdBuf: number;
	ttoFlag: boolean;
	printing: number;
	printBuf: number;
	pending: number[];
	output: number[];
	printCycles: number;
};

/**
 * Keyboard (device 03: KSF 700301, KRB 700312) and teleprinter
 * (device 04: TSF 700401, TCF 700402, TLS 700406) as one box, the KSR-33.
 * Semantics from SIMH pdp18b_stddev.c tti()/tto(): pulse&1 skip-on-flag,
 * pulse&2 clear flag (keyboard also ORs buffer into AC), pulse&4 load & print.
 *
 * Placement: the flags, buffers and print timing are the bus side. The far side is `onPrint`
 * (each character, synchronously) and `type` (a key, applied when called, between steps). Remote,
 * `onPrint` becomes a posted stream and `type` must carry the cycle it applies at, so replay stays
 * exact. DESIGN.md, "Placement: what can run where".
 */
export class Teletype implements Device, KorzDevice {
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

	/** Keys typed that the program has not read with KRB yet. */
	get waiting(): number {
		return this.pending.length + (this.kbdFlag ? 1 : 0);
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

	korzSlots(bus: IopBus) {
		return [
			timed(bus, 0o03, "keyboard"),
			skipIf(0o03, "keyboard KSF: skip on a key", () => this.kbdFlag),
			gate(0o03, 2, "keyboard KRB: the key into AC, take the next", (c) => {
				this.kbdFlag = false;
				c.ac |= this.kbdBuf;
				this.deliver();
			}),
			timed(bus, 0o04, "teleprinter"),
			skipIf(0o04, "teleprinter TSF: skip when done", () => this.ttoFlag),
			gate(0o04, 2, "teleprinter TCF: clear done", () => { this.ttoFlag = false; }),
			gate(0o04, 4, "teleprinter TLS: print AC", (c) => {
				this.printBuf = c.ac & 0o377;
				this.printing = this.printCycles;
			}),
		];
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

	/** The character being printed finishes; idle, nothing happens until TLS or a key. */
	nextEvent(): number {
		return this.printing < 0 ? Infinity : this.printing + 1;
	}

	irq(): boolean {
		return this.kbdFlag || this.ttoFlag;
	}

	reset(): void {
		this.kbdFlag = false;
		this.ttoFlag = false;
		this.printing = -1;
	}

	/** The paper and the keys still waiting are part of the device. `printCycles` is how it was built. */
	capture(): TeletypeState {
		return {
			kbdFlag: this.kbdFlag,
			kbdBuf: this.kbdBuf,
			ttoFlag: this.ttoFlag,
			printing: this.printing,
			printBuf: this.printBuf,
			pending: this.pending.slice(),
			output: this.output.slice(),
			printCycles: this.printCycles,
		};
	}

	restore(s: TeletypeState): void {
		if (s.printCycles !== this.printCycles) {
			throw new Error(`teletype print time is ${s.printCycles}, this one is ${this.printCycles}`);
		}
		this.kbdFlag = s.kbdFlag;
		this.kbdBuf = s.kbdBuf;
		this.ttoFlag = s.ttoFlag;
		this.printing = s.printing;
		this.printBuf = s.printBuf;
		this.pending = s.pending.slice();
		this.output = s.output.slice();
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
