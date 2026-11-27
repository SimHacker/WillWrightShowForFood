/**
 * SIMH's event queue, in its units: one tick wherever SIMH decrements
 * `sim_interval`, that is per memory reference and per instruction. A unit is
 * scheduled some ticks ahead; scheduling a unit that is already waiting does
 * nothing, as in SIMH. Time in microseconds converts at a fixed rate instead
 * of SIMH's wall-clock calibration, so a run is the same every time.
 */

export type Unit = { readonly name: string; svc: () => void; due?: number | undefined };

export class Events {
	now = 0;
	/** Ticks per simulated microsecond. A KA10 core cycle was about a microsecond. */
	ticksPerUsec = 1;
	private queue: Unit[] = [];
	/** The earliest due time, or Infinity: the CPU compares against it every check. */
	next = Infinity;

	isActive(u: Unit): boolean {
		return u.due !== undefined;
	}

	activate(u: Unit, ticks: number): void {
		if (u.due !== undefined) return;
		this.insert(u, this.now + Math.max(0, Math.floor(ticks)));
	}

	/** Like SIMH's sim_activate_abs: reschedule even if waiting. */
	activateAbs(u: Unit, ticks: number): void {
		this.cancel(u);
		this.insert(u, this.now + Math.max(0, Math.floor(ticks)));
	}

	activateAfter(u: Unit, usec: number): void {
		this.activate(u, usec * this.ticksPerUsec);
	}

	cancel(u: Unit): void {
		if (u.due === undefined) return;
		const i = this.queue.indexOf(u);
		if (i >= 0) this.queue.splice(i, 1);
		u.due = undefined;
		this.next = this.queue[0]?.due ?? Infinity;
	}

	/** Ticks until the unit is due, or 0 if it isn't waiting. */
	timeLeft(u: Unit): number {
		return u.due === undefined ? 0 : Math.max(0, u.due - this.now);
	}

	usecsLeft(u: Unit): number {
		return this.timeLeft(u) / this.ticksPerUsec;
	}

	/** Fire every unit that is due, earliest first, ties in the order they were scheduled. */
	process(): void {
		while (this.queue.length > 0 && this.queue[0]!.due! <= this.now) {
			const u = this.queue.shift()!;
			u.due = undefined;
			this.next = this.queue[0]?.due ?? Infinity;
			u.svc();
		}
		this.next = this.queue[0]?.due ?? Infinity;
	}

	pending(): readonly string[] {
		return this.queue.map((u) => `${u.name}@${u.due! - this.now}`);
	}

	private insert(u: Unit, due: number): void {
		u.due = due;
		let i = this.queue.length;
		while (i > 0 && this.queue[i - 1]!.due! > due) i--;
		this.queue.splice(i, 0, u);
		this.next = this.queue[0]!.due!;
	}
}
