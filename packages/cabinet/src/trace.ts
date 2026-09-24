/**
 * The instruction stream: a ring of the last `size` instructions the CPU
 * fetched, with the AC they found. A CPU with `trace` set records into it
 * on every fetch (XCT's target is not a fetch and is not recorded).
 */
export type TraceEntry = { pc: number; word: number; ac: number; n: number };

export class Trace {
	readonly size: number;
	private readonly pc: Uint16Array;
	private readonly word: Uint32Array;
	private readonly ac: Uint32Array;
	/** Instructions recorded since the trace started. */
	count = 0;

	constructor(size = 1 << 16) {
		this.size = size;
		this.pc = new Uint16Array(size);
		this.word = new Uint32Array(size);
		this.ac = new Uint32Array(size);
	}

	record(pc: number, word: number, ac: number): void {
		const i = this.count % this.size;
		this.pc[i] = pc;
		this.word[i] = word;
		this.ac[i] = ac;
		this.count += 1;
	}

	/** Up to `n` entries ending `back` instructions before the newest, oldest first. */
	window(n: number, back = 0): TraceEntry[] {
		const end = this.count - back;
		const start = Math.max(end - n, this.count - this.size, 0);
		const out: TraceEntry[] = [];
		for (let k = start; k < end; k += 1) {
			const i = k % this.size;
			out.push({ pc: this.pc[i] ?? 0, word: this.word[i] ?? 0, ac: this.ac[i] ?? 0, n: k });
		}
		return out;
	}

	/** How far back the ring reaches. */
	get held(): number {
		return Math.min(this.count, this.size);
	}

	clear(): void {
		this.count = 0;
	}
}
