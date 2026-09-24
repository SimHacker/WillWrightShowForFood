import { maskWord } from "./word.js";

export type SymbolEntry = { name: string; addr: number };

export type Memory = {
	read(addr: number): number;
	write(addr: number, word: number): void;
};

export type MonitorOpts = {
	memory: Memory;
	symbols?: readonly SymbolEntry[];
	/** Core size in words; addresses wrap to it. */
	size?: number;
	/** Every poke, after it lands: the session recorder's tap. */
	onPoke?: (addr: number, words: readonly number[]) => void;
};

/** An address: a number, or text like `fuel`, `putc+3`, `lbd-2`, `5641` (octal). */
export type Where = number | string;

/**
 * The console, out of band: look up symbols, peek and poke core, from
 * outside the machine. Nothing here runs an instruction or touches a
 * device; a poke is a deposit from the front panel. Bad addresses come
 * back undefined rather than throwing, so a typo at a command line is a
 * message and never a crash.
 */
export class Monitor {
	private readonly memory: Memory;
	private readonly size: number;
	private readonly onPoke: MonitorOpts["onPoke"];
	private exact = new Map<string, number>();
	private folded = new Map<string, number>();
	private byAddr = new Map<number, string[]>();
	private sorted: SymbolEntry[] = [];

	constructor(opts: MonitorOpts) {
		this.memory = opts.memory;
		this.size = opts.size ?? 8192;
		this.onPoke = opts.onPoke;
		this.setSymbols(opts.symbols ?? []);
	}

	setSymbols(symbols: readonly SymbolEntry[]): void {
		this.exact = new Map(symbols.map((s) => [s.name, s.addr]));
		this.folded = new Map();
		this.byAddr = new Map();
		for (const s of symbols) {
			const f = s.name.toUpperCase();
			if (!this.folded.has(f)) this.folded.set(f, s.addr);
			this.byAddr.set(s.addr, [...(this.byAddr.get(s.addr) ?? []), s.name]);
		}
		this.sorted = [...symbols].sort((a, b) => a.addr - b.addr);
	}

	/** A symbol's address; exact spelling first, then case-folded. */
	symbol(name: string): number | undefined {
		return this.exact.get(name) ?? this.folded.get(name.toUpperCase());
	}

	/** Every name defined at addr. */
	names(addr: number): string[] {
		return this.byAddr.get(addr) ?? [];
	}

	/** addr as `name` or `name+offset` (octal), from the nearest symbol at or below it; octal if none. */
	label(addr: number, maxOffset = 0o100): string {
		let lo = 0;
		let hi = this.sorted.length - 1;
		let best: SymbolEntry | undefined;
		while (lo <= hi) {
			const mid = (lo + hi) >> 1;
			const s = this.sorted[mid]!;
			if (s.addr <= addr) {
				best = s;
				lo = mid + 1;
			} else hi = mid - 1;
		}
		if (!best || addr - best.addr > maxOffset) return addr.toString(8);
		const name = this.names(best.addr)[0] ?? best.name;
		return addr === best.addr ? name : `${name}+${(addr - best.addr).toString(8)}`;
	}

	/** Resolve a Where to an address in core, or undefined. */
	resolve(where: Where): number | undefined {
		if (typeof where === "number") return Number.isInteger(where) ? this.wrap(where) : undefined;
		const m = where.trim().match(/^([A-Za-z.][\w.]*)?\s*(?:([+-])\s*([0-7]+))?$|^([0-7]+)$/);
		if (!m) return undefined;
		if (m[4] !== undefined) return this.wrap(parseInt(m[4], 8));
		if (m[1] === undefined) return undefined;
		const base = this.symbol(m[1]);
		if (base === undefined) return undefined;
		const off = m[3] ? parseInt(m[3], 8) * (m[2] === "-" ? -1 : 1) : 0;
		return this.wrap(base + off);
	}

	peek(where: Where): number | undefined {
		const a = this.resolve(where);
		return a === undefined ? undefined : this.memory.read(a);
	}

	/** count words starting at where. */
	peekWords(where: Where, count: number): number[] | undefined {
		const a = this.resolve(where);
		if (a === undefined || !Number.isInteger(count) || count < 0) return undefined;
		return Array.from({ length: count }, (_, i) => this.memory.read(this.wrap(a + i)));
	}

	/**
	 * Deposit one word or a run of words; returns the address, or undefined
	 * if where didn't resolve. A negative number goes in as ones' complement,
	 * the PDP-7's ADD arithmetic: -1 is 777776.
	 */
	poke(where: Where, words: number | readonly number[]): number | undefined {
		const a = this.resolve(where);
		if (a === undefined) return undefined;
		const word = (w: number) => {
			const n = Math.trunc(w);
			return n < 0 ? maskWord(~-n, 18) : maskWord(n, 18);
		};
		const run = (typeof words === "number" ? [words] : [...words]).map(word);
		run.forEach((w, i) => this.memory.write(this.wrap(a + i), w));
		this.onPoke?.(a, run);
		return a;
	}

	private wrap(addr: number): number {
		return ((addr % this.size) + this.size) % this.size;
	}
}
