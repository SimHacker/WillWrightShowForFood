import type { Cpu, Device, Iot, IotReply, Step, SwitchBinding } from "./bus.js";

export type CabinetOpts = {
	cpu: Cpu;
	devices?: Device[];
	/** SIMH stop_inst=0. Unplugged IOTs do nothing. */
	unknownIot?: "noop";
	switchBindings?: Readonly<Record<string, readonly SwitchBinding[]>>;
	/**
	 * Tick every unit every cycle and poll every `irq` every step, ignoring `nextEvent`: the
	 * backplane as it was, kept as the oracle for the event-driven schedule.
	 */
	everyCycle?: boolean;
};

/** How a unit is scheduled: never ticked, ticked every cycle, or ticked at its `nextEvent`. */
const NO_TICK = 0;
const EVERY = 1;
const EVENT = 2;

/**
 * The backplane. One CPU plugin, devices on the IOT bus.
 * Plugins never see each other — only Words, IOTs, and (for the pen) segments.
 *
 * Time is event-driven: a unit with `nextEvent` is ticked only when its next event is due, and
 * once, for all the cycles since it was last ticked. Before an IOT reaches it, before CAF, before
 * its power changes and at the end of every `step` or `run`, it is brought up to the current
 * cycle, so the CPU, the UI and the other units never see it behind. A unit's `irq` is asked
 * again only after something happened to it.
 *
 * Placement: the one place where time passes. One thread steps the CPU and ticks every
 * device's bus side; `cycles` is the clock that ports stamp events with. A far side in a worker or
 * on another host sends events to be applied at a stated cycle and receives output through the
 * devices' callbacks; machines on separate sites meet only through links. Running to the next
 * stamped event uses the same schedule as `nextEvent`.
 * DESIGN.md, "Placement: what can run where".
 */
export class Cabinet {
	readonly cpu: Cpu;
	readonly devices: Device[];
	cycles = 0;

	private readonly everyCycle: boolean;
	private kind: number[] = [];
	/** The cycle each unit has been ticked through. */
	private synced: number[] = [];
	/** The cycle each unit must next be ticked at. */
	private due: number[] = [];
	private raised: boolean[] = [];
	private raisedCount = 0;
	/** The earliest `due`. */
	private next = 0;
	private byCode: number[] = new Array(64).fill(-1);

	constructor(opts: CabinetOpts) {
		this.cpu = opts.cpu;
		this.devices = opts.devices ?? [];
		this.everyCycle = opts.everyCycle ?? false;
		for (const [name, bindings] of Object.entries(opts.switchBindings ?? {})) {
			const device = this.device(name);
			if (!device?.bindSwitches) throw new Error(`device ${name} cannot bind switches`);
			device.bindSwitches(bindings);
		}
		this.cpu.attach?.(this);
	}

	device(name: string): Device | undefined {
		return this.devices.find((d) => d.name === name);
	}

	step(): Step {
		if (this.everyCycle) return this.stepEveryCycle();
		this.resync();
		const result = this.advance();
		this.flush();
		return result;
	}

	run(max = 100_000): Step {
		let last: Step = {};
		if (this.everyCycle) {
			for (let i = 0; i < max; i += 1) {
				last = this.stepEveryCycle();
				if (last.halt) return last;
			}
			return last;
		}
		this.resync();
		for (let i = 0; i < max; i += 1) {
			last = this.advance();
			if (last.halt) break;
		}
		this.flush();
		return last;
	}

	/** CAF territory: clear every device flag. */
	resetDevices(): void {
		for (let i = 0; i < this.devices.length; i += 1) {
			this.syncUnit(i);
			this.devices[i]!.reset?.();
		}
	}

	/** Flip a unit's power switch, as the user or a script does. Switching on resets the unit. */
	setPower(name: string, on: boolean): void {
		const i = this.devices.findIndex((d) => d.name === name);
		if (i < 0) throw new Error(`no device named ${name}`);
		const d = this.devices[i]!;
		this.syncUnit(i);
		const was = d.power !== false;
		d.power = on;
		if (on && !was) d.reset?.();
	}

	sync(code: number): void {
		const i = this.byCode[code & 0o77]!;
		if (i >= 0) this.syncUnit(i);
	}

	private stepEveryCycle(): Step {
		// One IRQ line: the OR of every raised device flag. The ISA owns
		// what an interrupt does; the backplane only carries the wire.
		let irq = false;
		const devices = this.devices;
		for (let i = 0; i < devices.length && !irq; i += 1) {
			const d = devices[i]!;
			irq = d.power !== false && (d.irq?.() ?? false);
		}
		this.cpu.irqLine = irq;

		const result: Step = this.cpu.power === false ? { halt: true } : this.cpu.step();
		if (result.iot) {
			const reply = this.dispatch(result.iot);
			this.cpu.ac = reply.ac;
			if (reply.skip) this.cpu.skip();
		}
		for (let i = 0; i < devices.length; i += 1) {
			const d = devices[i]!;
			if (d.power !== false) d.tick?.(1);
		}
		this.cycles += 1;
		return result;
	}

	/** One CPU step; units whose events fall due are ticked before the cycle count moves on. */
	private advance(): Step {
		this.cpu.irqLine = this.raisedCount > 0;
		const result: Step = this.cpu.power === false ? { halt: true } : this.cpu.step();
		if (result.iot) {
			const reply = this.dispatch(result.iot);
			this.cpu.ac = reply.ac;
			if (reply.skip) this.cpu.skip();
		}
		const end = this.cycles + 1;
		if (end >= this.next) this.service(end);
		this.cycles = end;
		return result;
	}

	/** Tick every unit due by `end` up to it, then ask it again for its next event and its irq. */
	private service(end: number): void {
		const devices = this.devices;
		let next = Infinity;
		for (let i = 0; i < devices.length; i += 1) {
			let due = this.due[i]!;
			if (due <= end) {
				const d = devices[i]!;
				if (d.power !== false && this.synced[i]! < end) d.tick?.(end - this.synced[i]!);
				this.synced[i] = end;
				// A unit can switch itself off in its own tick, as the Ultimate Machine does.
				due = this.schedule(i, d, d.power !== false, end);
			}
			if (due < next) next = due;
		}
		this.next = next;
	}

	private schedule(i: number, d: Device, on: boolean, now: number): number {
		const r = on && (d.irq?.() ?? false);
		if (r !== this.raised[i]) {
			this.raised[i] = r;
			this.raisedCount += r ? 1 : -1;
		}
		const kind = this.kind[i]!;
		let due = Infinity;
		if (kind === EVERY) due = now + 1;
		else if (kind === EVENT && on) {
			const k = d.nextEvent!();
			due = now + (k >= 1 ? k : 1);
		}
		this.due[i] = due;
		return due;
	}

	/** Bring one unit up to the current cycle and have it rescheduled at the end of this step. */
	private syncUnit(i: number): void {
		if (this.everyCycle) return;
		const d = this.devices[i]!;
		const now = this.cycles;
		if (d.power !== false && this.synced[i]! < now) d.tick?.(now - this.synced[i]!);
		this.synced[i] = now;
		this.due[i] = now + 1;
		if (now + 1 < this.next) this.next = now + 1;
	}

	/** Take the units as they are now: anything outside the machine may have touched them since the last run. */
	private resync(): void {
		const devices = this.devices;
		const n = devices.length;
		if (this.kind.length !== n) {
			this.kind = new Array(n);
			this.synced = new Array(n);
			this.due = new Array(n);
			this.raised = new Array(n);
		}
		this.byCode.fill(-1);
		this.raisedCount = 0;
		let next = Infinity;
		for (let i = 0; i < n; i += 1) {
			const d = devices[i]!;
			for (const code of d.iots) this.byCode[code & 0o77] = i;
			this.kind[i] = !d.tick ? NO_TICK : d.nextEvent ? EVENT : EVERY;
			this.synced[i] = this.cycles;
			this.raised[i] = false;
			const due = this.schedule(i, d, d.power !== false, this.cycles);
			if (due < next) next = due;
		}
		this.next = next;
	}

	/** Tick every unit up to the current cycle, so whoever reads it next sees it as of now. */
	private flush(): void {
		const devices = this.devices;
		for (let i = 0; i < devices.length; i += 1) {
			if (this.synced[i]! < this.cycles) {
				const d = devices[i]!;
				if (d.power !== false) d.tick?.(this.cycles - this.synced[i]!);
				this.synced[i] = this.cycles;
			}
		}
	}

	private dispatch(iot: Iot): IotReply {
		// CAF 703302 — clear all flags. Backplane-level, like SIMH's reset_all.
		if (iot.device === 0o33 && iot.pulse === 0o02) {
			this.resetDevices();
			return { ac: iot.ac };
		}
		const i = this.devices.findIndex((d) => d.iots.includes(iot.device));
		if (i < 0) return { ac: iot.ac };
		this.syncUnit(i);
		const box = this.devices[i]!;
		if (box.power === false) return box.offIot?.(iot) ?? { ac: iot.ac };
		return box.iot(iot);
	}
}
