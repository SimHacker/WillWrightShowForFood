import type { Ka10Rung } from "./bus.js";
import { Cty, PaperTape, PdClock, Rp10 } from "./devices.js";
import { Ka10Halves } from "./halves.js";
import { Ka10 } from "./ka10.js";

/** Which engine steps the processor: SIMH's code ported, or the hand-written halves. */
export type RungName = "simh" | "halves";

export function makeRung(rung: RungName): Ka10Rung {
	const opts = { memWords: 1024 * 1024, its: true, mpx: true };
	return rung === "halves" ? new Ka10Halves(opts) : new Ka10(opts);
}

/**
 * The ITS machine of the PDP-10/its project's SIMH recipe: a KA10 with MIT's pager and
 * multiplex, the console, the paper tape reader and punch, the RP10 and the clock. The
 * network, the terminals and the displays come later.
 */
export class ItsMachine {
	readonly cpu: Ka10Rung;
	readonly cty: Cty;
	readonly pt: PaperTape;
	readonly dp: Rp10;
	readonly pd: PdClock;
	output = "";

	constructor(opts: { rung?: RungName; now?: () => Date; print?: (ch: number) => void } = {}) {
		this.cpu = makeRung(opts.rung ?? "simh");
		this.cty = new Cty(this.cpu, (ch) => {
			this.output += String.fromCharCode(ch);
			opts.print?.(ch);
		});
		this.pt = new PaperTape(this.cpu);
		this.dp = new Rp10(this.cpu);
		this.pd = new PdClock(this.cpu, opts.now);
	}

	/** `boot ptr`: reset everything, then load DSKDMP's RIM loader from the tape. */
	bootPtr(): void {
		this.cpu.reset();
		this.pt.boot();
	}
}
