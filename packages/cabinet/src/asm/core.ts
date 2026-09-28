import type { Cpu } from "../bus.js";

/**
 * The back end every assembler here shares, whatever its syntax or machine: what an assembly
 * produces, and how it is loaded. The writers (listing.ts, ../source.ts) read only this.
 */

/** What the back end knows about the hardware. Digit counts follow from the bits and the radix. */
export type Machine = {
	name: string;
	wordBits: number;
	addrBits: number;
	radix: 8 | 16;
};

export type AsmTape = { name: string; text: string };

export type AsmLine = {
	tape: string;
	line: number;
	/** Where the line's first word went, or null if it emitted none. */
	addr: number | null;
	/** Its first word. A line of several words (`text`, a 6502 `.byte`) has them all in `words`. */
	word: number | null;
	words: number[];
	source: string;
	/** The line ends a tape segment (Cambridge PAUSE): the listing numbers the next line 1. */
	endsSegment?: boolean;
};

export type AsmResult = {
	machine: Machine;
	words: Array<[addr: number, word: number]>;
	symbols: Map<string, number>;
	literals: Array<{ addr: number; text: string; word: number }>;
	variables: Array<{ name: string; addr: number }>;
	listing: AsmLine[];
	errors: string[];
	/** From `start expr` on the last tape that gave one. */
	start: number | null;
};

export const addrMask = (m: Machine): number => 2 ** m.addrBits - 1;
export const digits = (m: Machine, bits: number): number => Math.ceil(bits / Math.log2(m.radix));

/** Deposit an assembled program. */
export function loadAsm(cpu: Cpu, result: AsmResult): void {
	for (const [addr, word] of result.words) cpu.write(addr, word);
}

/** The plain listing: location, word, source, then the literals and variables. */
export function formatListing(result: AsmResult): string {
	const m = result.machine;
	const o = (n: number, w: number) => n.toString(m.radix).padStart(w, "0");
	const aw = digits(m, m.addrBits);
	const ww = digits(m, m.wordBits);
	const out: string[] = [];
	for (const l of result.listing) {
		const left = l.addr === null ? " ".repeat(aw + ww + 1) : `${o(l.addr, aw)} ${o(l.word ?? 0, ww)}`;
		out.push(`${left}\t${l.source}`);
	}
	out.push("", "literals");
	for (const l of result.literals) out.push(`${o(l.addr, aw)} ${o(l.word, ww)}\t(${l.text})`);
	out.push("", "variables");
	for (const v of result.variables) out.push(`${o(v.addr, aw)}\t${v.name}`);
	return out.join("\n");
}
