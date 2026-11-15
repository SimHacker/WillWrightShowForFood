import type { Clock, Cpu, Device, Iot, IotReply, Step, SwitchBinding } from "./bus.js";

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
 * A unit may answer `nextEvent` by running ahead, as the 340 does. Within a cycle the CPU runs
 * first and then the units in order, so a core write by the CPU at cycle s must be seen by every
 * unit from cycle s, and one by unit j at cycle s by the units after j from cycle s and by those
 * before it from s + 1. A unit with `coreWrite` that read the word too far ahead is brought back
 * to that point before the write lands.
 *
 * Placement: the one place where time passes. One thread steps the CPU and ticks every
 * device's bus side; `cycles` is the clock that ports stamp events with. A far side in a worker or
 * on another host sends events to be applied at a stated cycle and receives output through the
 * devices' callbacks; machines on separate sites meet only through links. Running to the next
 * stamped event uses the same schedule as `nextEvent`.
 * DESIGN.md, "Placement: what can run where".
 */
export class Cabinet implements Clock {
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
	/** The earliest `due`; a CPU running a batch stops before it. */
	next = 0;
	private byCode: number[] = new Array(64).fill(-1);
	/** The unit being ticked, or -1 while the CPU runs. */
	private ticking = -1;
	/** Units with `coreWrite`, which may have run ahead. */
	private watchers: number[] = [];
	private leads: boolean[] = [];
	private watching = false;
	/** A unit was brought back during `service`, which must look at it again. */
	private pulledBack = false;
	/** The cycle the current run stops at; no unit is asked to look past it. */
	until = 0;
	/** The CPU runs batches (`runBatch`) instead of single steps. */
	private batch = false;

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
		this.until = this.cycles + 1;
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
		this.until = this.cycles + max;
		this.resync();
		while (this.cycles < this.until) {
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

	sync(code: number, pulse: number): void {
		const i = this.byCode[code & 0o77]!;
		if (i >= 0 && !this.devices[i]!.answersAhead?.(code, pulse)) this.syncUnit(i);
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
			if (d.power !== false) d.tick?.(1, this.cycles);
		}
		this.cycles += 1;
		return result;
	}

	/**
	 * One CPU step, or a batch whose last step is finished here; units whose events fall due are
	 * ticked before the cycle count moves on.
	 */
	private advance(): Step {
		const cpu = this.cpu;
		cpu.irqLine = this.raisedCount > 0;
		const result: Step = cpu.power === false ? { halt: true } : this.batch ? cpu.runBatch!(this) : cpu.step();
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

	/**
	 * Tick every unit due by `end` up to it, then ask it again for its next event and its irq. A
	 * core write in one unit's tick can send an earlier unit back to be ticked again, hence the loop.
	 */
	private service(end: number): void {
		const devices = this.devices;
		for (;;) {
			this.pulledBack = false;
			let next = Infinity;
			for (let i = 0; i < devices.length; i += 1) {
				let due = this.due[i]!;
				if (due <= end) {
					const d = devices[i]!;
					this.tickTo(i, d, end);
					// A unit can switch itself off in its own tick, as the Ultimate Machine does.
					due = this.schedule(i, d, d.power !== false, end);
				}
				if (due < next) next = due;
			}
			if (this.pulledBack) for (let i = 0; i < devices.length; i += 1) if (this.due[i]! < next) next = this.due[i]!;
			this.next = next;
			if (next > end) return;
		}
	}

	private tickTo(i: number, d: Device, to: number): void {
		const from = this.synced[i]!;
		if (to < from) throw new Error(`${d.name}: asked back to cycle ${to} from ${from}`);
		if (d.power !== false && (from < to || this.leads[i])) {
			this.ticking = i;
			d.tick?.(to - from, from);
			this.ticking = -1;
		}
		this.synced[i] = to;
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
			const k = d.nextEvent!(this.watching ? Math.max(1, this.until - now) : 1);
			due = now + (k >= 1 ? k : 1);
		}
		this.due[i] = due;
		return due;
	}

	/** Bring one unit up to the current cycle and have it rescheduled at the end of this step. */
	private syncUnit(i: number): void {
		this.syncTo(i, this.cycles);
	}

	/** Bring one unit to `point`, back from ahead if need be, and have it rescheduled at the end of this step. */
	private syncTo(i: number, point: number): void {
		if (this.everyCycle) return;
		this.tickTo(i, this.devices[i]!, point);
		const due = this.cycles + 1;
		this.due[i] = due;
		if (due < this.next) this.next = due;
		this.pulledBack = true;
	}

	/** Ahead of each core write: bring back any unit that has read the word too far ahead. */
	private readonly beforeWrite = (addr: number): void => {
		const w = this.watchers;
		const by = this.ticking;
		for (let k = 0; k < w.length; k += 1) {
			const i = w[k]!;
			if (i === by) continue;
			const point = by >= 0 && i < by ? this.cycles + 1 : this.cycles;
			if (this.devices[i]!.coreWrite!(addr, point)) this.syncTo(i, point);
		}
	};

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
		this.batch = this.cpu.runBatch !== undefined;
		this.raisedCount = 0;
		this.watchers = [];
		this.leads = new Array(n).fill(false);
		let next = Infinity;
		for (let i = 0; i < n; i += 1) {
			const d = devices[i]!;
			for (const code of d.iots) this.byCode[code & 0o77] = i;
			this.kind[i] = !d.tick ? NO_TICK : d.nextEvent ? EVENT : EVERY;
			if (d.coreWrite) this.watchers.push(i);
		}
		// coreWrite takes 15-bit addresses; below 8K a 13-bit display address can alias one it never sees.
		const watch = this.watchers.length > 0 && this.cpu.watchWrites !== undefined && this.cpu.coreWords >= 8192;
		if (watch) for (const i of this.watchers) this.leads[i] = true;
		if (watch !== this.watching) {
			this.cpu.watchWrites?.(watch ? this.beforeWrite : null);
			this.watching = watch;
		}
		for (let i = 0; i < n; i += 1) {
			const d = devices[i]!;
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
			if (this.synced[i]! < this.cycles || this.leads[i]) this.tickTo(i, devices[i]!, this.cycles);
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
		const box = this.devices[i]!;
		if (!box.answersAhead?.(iot.device, iot.pulse)) this.syncUnit(i);
		if (box.power === false) return box.offIot?.(iot) ?? { ac: iot.ac };
		return box.iot(iot);
	}
}
