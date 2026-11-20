import { cpuInterrupt, cpuNext, cpuPerform, cpuPoll, M6502, type Bus, type M6502Flavor } from "../m6502/m6502.js";
import { Compiler65 } from "./compile65.js";
import { CpuHost, type Rung } from "./cpu.js";
import type { Dispatchers, Sea } from "./korz.js";

/**
 * The 6502 as a sea of slots. The switch in `m6502.ts` is the oracle. An opcode is one
 * coordinate, `op`, and each of the 256 values is an exact slot whose body is that opcode
 * in the switch. `interpret` searches the sea. `resolve` is the table. `compile` is
 * `compile65.ts`: a straight-line block, with this rung under anything it does not inline.
 *
 * The slot functions are shared by every machine. They reach theirs as `c.cpu`.
 */

export type K65 = { cpu: Korz6502; op: number };

export type Korz6502Opts = { korz?: Rung | undefined; flavor?: M6502Flavor | undefined };

const SLOTS = Array.from({ length: 256 }, (_, op) => ({
	selector: "exec",
	guard: { op },
	by: `$${op.toString(16).padStart(2, "0")}`,
	run: (c: K65) => {
		cpuPerform(c.cpu, op);
	},
}));

const k65 = (cpu: Korz6502): K65 => ({ cpu, op: 0 });

export class Korz6502 extends M6502 {
	readonly host: CpuHost<K65, "exec", "ix">;
	readonly sea: Sea<K65>;
	private readonly ix: K65;
	private readonly go: Dispatchers<K65, "exec">;
	/** With `korz: "compile"`. */
	compiler: Compiler65 | null = null;
	/** How many switch steps the last `step` matched. A compiled block may be more than one. */
	lastRun = 0;

	constructor(bus: Bus, opts: Korz6502Opts = {}) {
		super(bus, opts.flavor ?? "nmos");
		const host = new CpuHost<K65, "exec", "ix">({
			dims: [{ name: "op", width: 8 }],
			selectors: ["exec"],
			slots: SLOTS,
			context: () => k65(this),
			nests: ["ix"],
			rung: opts.korz ?? "resolve",
		});
		this.host = host;
		this.sea = host.sea;
		this.ix = host.nest.ix;
		this.go = host.go;
		if (opts.korz === "compile") this.compiler = new Compiler65(this);
	}

	override reset(): void {
		this.compiler?.flush();
		super.reset();
	}

	/** One instruction through the sea, or the interrupt the poll wins. */
	one(): void {
		const vector = cpuPoll(this);
		if (vector >= 0) {
			cpuInterrupt(this, vector);
			this.lastRun = 1;
			return;
		}
		this.ix.op = cpuNext(this);
		this.go.exec(this.ix);
		this.lastRun = 1;
	}

	override step(): void {
		if (this.compiler) {
			this.lastRun = this.compiler.step();
			return;
		}
		this.one();
	}
}
