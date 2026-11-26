/**
 * The 6502's instruction stream: a ring of the last `size` instructions it started, with the
 * registers it found. The PDP-7's is `Trace` in trace.ts; this one keeps the operand bytes,
 * since a 6502 instruction is one to three of them, and A, X, Y, P and S.
 */
export type Trace65Entry = { pc: number; bytes: number[]; a: number; x: number; y: number; p: number; s: number; n: number };

export class Trace65 {
	readonly size: number;
	private readonly pc: Uint16Array;
	/** Opcode, then two operand bytes, whatever the length. */
	private readonly code: Uint8Array;
	/** A, X, Y, P, S. */
	private readonly regs: Uint8Array;
	/** Instructions recorded since the trace started. */
	count = 0;

	constructor(size = 1 << 16) {
		this.size = size;
		this.pc = new Uint16Array(size);
		this.code = new Uint8Array(size * 3);
		this.regs = new Uint8Array(size * 5);
	}

	record(pc: number, b0: number, b1: number, b2: number, a: number, x: number, y: number, p: number, s: number): void {
		const i = this.count % this.size;
		this.pc[i] = pc;
		this.code.set([b0, b1, b2], i * 3);
		this.regs.set([a, x, y, p, s], i * 5);
		this.count += 1;
	}

	/** Up to `n` entries ending `back` instructions before the newest, oldest first. `bytes` is all three; the disassembler takes what the opcode needs. */
	window(n: number, back = 0): Trace65Entry[] {
		const end = this.count - back;
		const start = Math.max(end - n, this.count - this.size, 0);
		const out: Trace65Entry[] = [];
		for (let k = start; k < end; k += 1) {
			const i = k % this.size;
			const r = this.regs.subarray(i * 5, i * 5 + 5);
			out.push({ pc: this.pc[i] ?? 0, bytes: [...this.code.subarray(i * 3, i * 3 + 3)], a: r[0]!, x: r[1]!, y: r[2]!, p: r[3]!, s: r[4]!, n: k });
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
