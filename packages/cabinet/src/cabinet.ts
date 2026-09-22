import type { Cpu, Device, Iot, IotReply, Step } from "./bus.js";

export type CabinetOpts = {
	cpu: Cpu;
	devices?: Device[];
	/** SIMH stop_inst=0. Unplugged IOTs do nothing. */
	unknownIot?: "noop";
};

/**
 * The backplane. One CPU plugin, devices on the IOT bus.
 * Plugins never see each other — only Words, IOTs, and (for the pen) segments.
 */
export class Cabinet {
	readonly cpu: Cpu;
	readonly devices: Device[];
	cycles = 0;

	constructor(opts: CabinetOpts) {
		this.cpu = opts.cpu;
		this.devices = opts.devices ?? [];
	}

	device(name: string): Device | undefined {
		return this.devices.find((d) => d.name === name);
	}

	step(): Step {
		// One IRQ line: the OR of every raised device flag. The ISA owns
		// what an interrupt does; the backplane only carries the wire.
		this.cpu.irqLine = this.devices.some((d) => d.irq?.() ?? false);

		const result = this.cpu.step();
		if (result.iot) {
			const reply = this.dispatch(result.iot);
			this.cpu.ac = reply.ac;
			if (reply.skip) this.cpu.skip();
		}
		for (const d of this.devices) d.tick?.(1);
		this.cycles += 1;
		return result;
	}

	run(max = 100_000): Step {
		let last: Step = {};
		for (let i = 0; i < max; i += 1) {
			last = this.step();
			if (last.halt) return last;
		}
		return last;
	}

	/** CAF territory: clear every device flag. */
	resetDevices(): void {
		for (const d of this.devices) d.reset?.();
	}

	private dispatch(iot: Iot): IotReply {
		// CAF 703302 — clear all flags. Backplane-level, like SIMH's reset_all.
		if (iot.device === 0o33 && iot.pulse === 0o02) {
			this.resetDevices();
			return { ac: iot.ac };
		}
		const box = this.devices.find((d) => d.iots.includes(iot.device));
		if (!box) return { ac: iot.ac };
		return box.iot(iot);
	}
}
