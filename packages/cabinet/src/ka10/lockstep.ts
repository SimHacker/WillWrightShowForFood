import type { Ka10Rung } from "./bus.js";

/** The first place two rungs disagree, with both rungs' recent history. */
export type Divergence = {
	instruction: number;
	field: string;
	a: string;
	b: string;
	historyA: string[];
	historyB: string[];
};

const FIELDS = ["PC", "FLAGS", "AB", "MB", "IR", "AC", "pi_enable", "PIH", "PIR", "page_enable", "dbr1", "fault_data", "mem_prot"] as const;

/** Read a register as a number from either rung: the SIMH port keeps words as bigints. */
function reg(cpu: Ka10Rung, name: string): number {
	const v = (cpu as unknown as Record<string, number | bigint>)[name];
	return typeof v === "bigint" ? Number(v) : (v ?? NaN);
}

/**
 * Step two rungs one instruction at a time and compare them after every instruction: the
 * registers in FIELDS, the sixteen accumulators and the tick count. Every `memEvery`
 * instructions all of core is compared too. Returns the first divergence, or undefined after
 * `steps` instructions in agreement. `between` runs after each step, on both machines at once,
 * for typing at the console.
 */
export function lockstep(a: Ka10Rung, b: Ka10Rung, steps: number, opts: { memEvery?: number; history?: number; between?: (n: number) => void } = {}): Divergence | undefined {
	const history = opts.history ?? 40;
	a.setHistory(history);
	b.setHistory(history);
	const memEvery = opts.memEvery ?? 0;
	const diverge = (field: string, x: string, y: string): Divergence => ({
		instruction: a.instructions,
		field,
		a: x,
		b: y,
		historyA: a.showHistory(history),
		historyB: b.showHistory(history),
	});
	for (let n = 0; n < steps; n++) {
		a.step(1);
		b.step(1);
		if (a.events.now !== b.events.now) return diverge("ticks", String(a.events.now), String(b.events.now));
		for (const f of FIELDS) {
			const x = reg(a, f);
			const y = reg(b, f);
			if (x !== y) return diverge(f, x.toString(8), y.toString(8));
		}
		for (let i = 0; i < 16; i++) {
			const x = a.examine(i);
			const y = b.examine(i);
			if (x !== y) return diverge(`AC${i.toString(8)}`, x.toString(8), y.toString(8));
		}
		if (memEvery && n % memEvery === memEvery - 1) {
			const d = diffMemory(a, b);
			if (d) return d;
		}
		opts.between?.(n);
	}
	return memEvery ? diffMemory(a, b) : undefined;

	function diffMemory(x: Ka10Rung, y: Ka10Rung): Divergence | undefined {
		const mx = x.saveMemory();
		const my = y.saveMemory();
		for (let i = 0; i < mx.length; i += 8) {
			for (let j = 0; j < 8; j++) {
				if (mx[i + j] !== my[i + j]) {
					const addr = i / 8;
					return diverge(`core ${addr.toString(8)}`, x.examine(addr).toString(8), y.examine(addr).toString(8));
				}
			}
		}
		return undefined;
	}
}
