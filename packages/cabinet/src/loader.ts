import type { Cpu } from "./bus.js";

/**
 * `.oct` — Roy's converter output: one `addr word` pair per line, octal,
 * whitespace-padded. Paper tape was hardware read-in, not a device
 * (SYMELEC issues no reader IOTs), so loading is a bench-side act.
 */
export function parseOct(text: string): Array<[addr: number, word: number]> {
	const out: Array<[number, number]> = [];
	for (const line of text.split("\n")) {
		const t = line.trim();
		if (t === "" || t.startsWith(";") || t.startsWith("#")) continue;
		const m = t.match(/^([0-7]+)\s+([0-7]+)$/);
		if (!m) throw new Error(`unparseable .oct line: "${line}"`);
		out.push([Number.parseInt(m[1] as string, 8), Number.parseInt(m[2] as string, 8)]);
	}
	return out;
}

export function loadOct(cpu: Cpu, text: string): { low: number; high: number; count: number } {
	const pairs = parseOct(text);
	let low = Number.POSITIVE_INFINITY;
	let high = -1;
	for (const [addr, word] of pairs) {
		cpu.write(addr, word);
		if (addr < low) low = addr;
		if (addr > high) high = addr;
	}
	return { low, high, count: pairs.length };
}
