import type { Cpu, Device, Iot, IotReply } from "../bus.js";
import { gate, type IopBus, type KorzDevice, skipIf, timed } from "../korz/iop.js";

export type ClockOpts = {
	cpu: Cpu;
	/** Cycles per clock tick. PDP-7 ≈ 571k cycles/s at 60Hz ≈ 9500. */
	cyclesPerTick?: number;
};

/**
 * Type KW01 line clock, device 00 (the CPU intercepts ION/IOF on the same
 * device code). Semantics from SIMH pdp18b_stddev.c clk(): CLSF (pulse&1)
 * skips on flag; pulse&4 clears the flag and turns the clock on (pulse&040,
 * CLON) or off (CLOF). Each tick increments core location 7; overflow to 0
 * raises the flag. The counter living in core is the period detail programs
 * exploit: SYMELEC presets 7 to control the blink rate.
 */
export class Clock implements Device, KorzDevice {
	readonly name = "clock";
	readonly iots = [0o00];

	flag = false;
	on = false;

	private readonly cpu: Cpu;
	private readonly cyclesPerTick: number;
	private accum = 0;

	constructor(opts: ClockOpts) {
		this.cpu = opts.cpu;
		this.cyclesPerTick = opts.cyclesPerTick ?? 9500;
	}

	iot(req: Iot): IotReply {
		let skip = false;
		if (req.pulse & 0o1) skip = this.flag; // CLSF
		if (req.pulse & 0o4) {
			this.flag = false;
			this.on = (req.pulse & 0o40) !== 0; // CLON / CLOF
		}
		return { ac: req.ac, skip };
	}

	/** CLSF on IOP1; IOP4 clears the flag and sets the clock on or off by pulse bit 040. */
	korzSlots(bus: IopBus) {
		return [
			timed(bus, 0o00, "clock"),
			skipIf(0o00, "clock CLSF: skip on tick", () => this.flag),
			gate(0o00, 4, "clock CLOF: clear flag, stop", () => { this.flag = false; this.on = false; }, [0, 1]),
			gate(0o00, 4, "clock CLON: clear flag, run", () => { this.flag = false; this.on = true; }, [2, 3]),
		];
	}

	tick(cycles: number): void {
		this.accum += cycles;
		while (this.accum >= this.cyclesPerTick) {
			this.accum -= this.cyclesPerTick;
			if (!this.on) continue;
			const n = (this.cpu.read(0o7) + 1) & 0o777777;
			this.cpu.write(0o7, n);
			if (n === 0) this.flag = true;
		}
	}

	irq(): boolean {
		return this.flag;
	}

	reset(): void {
		this.flag = false;
		this.on = false;
		this.accum = 0;
	}
}
