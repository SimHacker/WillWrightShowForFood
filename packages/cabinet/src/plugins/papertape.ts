import type { Cpu, Device, Iot, IotReply } from "../bus.js";

export type PaperTapeOpts = {
	tape?: Uint8Array;
	/** Cycles per frame. The 444 reads 300 frames/s, about 1900 cycles; default is faster. */
	frameCycles?: number;
};

/**
 * Paper tape reader, device 01: RSF 700101, RRB 700112, RSA 700104,
 * RSB 700144. Semantics from SIMH pdp18b_stddev.c ptr()/ptr_svc(): RSA
 * reads one frame, RSB assembles three frames with channel 8 punched,
 * six bits each, skipping the rest. Not part of SYMELEC; DUEL loads from it.
 */
export class PaperTape implements Device {
	readonly name = "papertape";
	readonly iots = [0o01];

	flag = false;
	buf = 0;
	pos = 0;
	tape: Uint8Array;

	private readonly frameCycles: number;
	private state = 0; // bits still to assemble; 0 = alphanumeric
	private wait = -1;

	constructor(opts: PaperTapeOpts = {}) {
		this.tape = opts.tape ?? new Uint8Array();
		this.frameCycles = opts.frameCycles ?? 100;
	}

	mount(tape: Uint8Array): void {
		this.tape = tape;
		this.pos = 0;
		this.reset();
	}

	iot(req: Iot): IotReply {
		let ac = req.ac;
		let skip = false;
		if (req.pulse & 0o1) skip = this.flag; // RSF
		if (req.pulse & 0o2) {
			this.flag = false; // RRB, RCF
			ac |= this.buf;
		}
		if (req.pulse & 0o4) {
			this.state = req.pulse & 0o40 ? 18 : 0; // RSB : RSA
			this.flag = false;
			this.buf = 0;
			this.wait = this.frameCycles;
		}
		return { ac, skip };
	}

	tick(cycles: number): void {
		if (this.wait < 0) return;
		this.wait -= cycles;
		while (this.wait < 0) {
			if (this.pos >= this.tape.length) {
				this.wait = -1; // out of tape: the flag never comes
				return;
			}
			const frame = this.tape[this.pos++]!;
			if (this.state === 0) this.buf = frame;
			else if (frame & 0o200) {
				this.state -= 6;
				this.buf |= (frame & 0o77) << this.state;
			}
			if (this.state === 0) {
				this.flag = true;
				this.wait = -1;
				return;
			}
			this.wait += this.frameCycles;
		}
	}

	irq(): boolean {
		return this.flag;
	}

	reset(): void {
		this.flag = false;
		this.buf = 0;
		this.state = 0;
		this.wait = -1;
	}
}

/** Three binary frames (channel 8 punched) to a word; also the channel-7 bits. SIMH getword(). */
function* binaryWords(tape: Uint8Array): Generator<{ word: number; bits: number }> {
	let word = 0, bits = 0, n = 0;
	for (const ch of tape) {
		if (!(ch & 0o200)) continue;
		word = (word << 6) | (ch & 0o77);
		bits = (bits << 1) | ((ch >> 6) & 1);
		n += 1;
		if (n === 3) {
			yield { word, bits };
			word = bits = n = 0;
		}
	}
}

/**
 * Hardware read-in (the console's READ IN key): words go to consecutive
 * addresses from `origin` until one whose last frame has channel 7
 * punched. SIMH hri_load_7915(). Returns the address after the last word.
 */
export function readIn(cpu: Cpu, tape: Uint8Array, origin: number): number {
	let a = origin;
	for (const { word, bits } of binaryWords(tape)) {
		if (bits & 1) break;
		cpu.write(a, word);
		a += 1;
	}
	return a;
}
