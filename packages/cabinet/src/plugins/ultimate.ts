import type { Device, Iot, IotReply, SwitchBinding } from "../bus.js";

/**
 * Minsky's Ultimate Machine (1952; Shannon built it at Bell Labs): a box with one switch. Switch
 * it on, the lid opens, a hand comes out, switches it off, and goes back in.
 *
 * The mechanism is a state machine with a phase and two positions, all of them registers a
 * program can read, so anything that draws it (PORTRAIT.md's front panel, ultimate.fs on the 340)
 * follows the device and never the reverse:
 *
 *   phase  OFF 0 · WAIT 1 · OPEN 2 · REACH 3 · PRESS 4 · RETURN 5 · CLOSE 6
 *   lid    0 shut .. UM_MAX open
 *   arm    0 inside .. UM_MAX finger on the switch
 *
 * WAIT, OPEN, REACH, PRESS, RETURN and CLOSE each last a configurable number of backplane steps.
 * The lever flips off when the arm reaches UM_MAX; the finger holds it down for PRESS, and while
 * it does the lever can't be switched on. Switched off by someone else on the way out, the hand
 * turns back from where it is; switched on again on the way in, it turns round and comes out.
 *
 * Power is the lever OR the mechanism away from home, as on the real box, where a limit switch
 * keeps the motor running until the arm is back and the lid shut. So the cabinet keeps ticking
 * it through RETURN and CLOSE, and it is truly off (no ticks, `offIot`) only when it is home.
 *
 * Cabinet extension on a free device code, 56. Pulses are grouped by bits 060 like the 340's;
 * the CPU's own bit 010 clears AC first, so 7056x2 reads OR into AC and 7056x2|010 just read:
 *
 *   705601 UMSF  skip if the lever is on        705612 UMRC  read the press count
 *   705604 UMON  lever on (a solenoid, a finger)
 *   705621 UMSB  skip if busy (phase not OFF)   705632 UMRP  read the phase
 *   705624 UMOF  lever off
 *   705641 UMSI  skip on the phase-change flag  705652 UMRL  read the lid
 *   705644 UMCF  clear the phase-change flag
 *   705661 UMLT  load a timing: AC<0:2> phase, AC<3:17> its length in UM_TICK steps;
 *                AC<0:2> 0 (no phase) sets the mode instead: AC<17> manual press,
 *                and AC<16> retract: give up now, the arm and lid going home from where they are
 *   705672 UMRA  read the arm                   705664 UMIE  interrupt on phase change iff AC<17>
 *
 * Manual press (off unless a program sets it): the arm reaches the lever and holds there, in
 * REACH at full travel, without moving it. Whoever switches the lever off then (the program,
 * seeing a finger on the switch) makes it the hand's press: PRESS, RETURN, CLOSE and REST follow
 * as usual. Switched off before the arm is all the way out, it is still an abort. So the program
 * drives that one transition and the machine every other. Retract (UMLT phase 0, AC<16>) gives
 * up at any point before the press, even with the finger at the lever: an abort, lever off.
 *
 * The lever, the counters and the registers are mechanical: they answer with the power off.
 * A PDP-7 program that switches it on, waits, and switches it on again is the two machines
 * arguing forever, which is the point.
 */

/** Full travel of the lid and the arm, in register units. */
export const UM_MAX = 1000;

/** Steps per unit of a UMLT timing word. */
export const UM_TICK = 64;

export const UM_PHASES = ["off", "wait", "open", "reach", "press", "return", "close", "rest"] as const;
export type UltimatePhase = (typeof UM_PHASES)[number];

/** Phase numbers, as UMRP reads them and ultimate.fs names them. */
export const UM_PHASE: { readonly [K in UltimatePhase]: number } = { off: 0, wait: 1, open: 2, reach: 3, press: 4, return: 5, close: 6, rest: 7 };

/** Steps each moving phase lasts. Zero is instant. */
export type UltimateTiming = { [K in Exclude<UltimatePhase, "off">]: number };

export const UM_DEFAULT_TIMING: Readonly<UltimateTiming> = {
	wait: 100_000,
	open: 150_000,
	reach: 250_000,
	press: 100_000,
	return: 200_000,
	close: 150_000,
	rest: 100_000,
};

export type UltimatePose = {
	phase: UltimatePhase;
	lever: boolean;
	/** 0 shut .. 1 open. */
	lid: number;
	/** 0 inside the box .. 1 finger on the switch. */
	arm: number;
};

export type UltimateOpts = Partial<UltimateTiming>;

const OFF = 0;
const WAIT = 1;
const OPEN = 2;
const REACH = 3;
const PRESS = 4;
const RETURN = 5;
const CLOSE = 6;
const REST = 7;

export class UltimateMachine implements Device {
	readonly name = "ultimate";
	readonly iots = [0o55, 0o56];

	readonly timing: UltimateTiming;
	private localLever = false;
	private bindings: readonly SwitchBinding[] = [];
	bindingIndex = 0;
	private observedLever = false;
	get lever(): boolean {
		const binding = this.bindings[this.bindingIndex];
		return binding ? binding.read() === binding.on : this.localLever;
	}
	set lever(on: boolean) {
		const binding = this.bindings[this.bindingIndex];
		if (binding) binding.write(on ? binding.on : binding.off);
		else this.localLever = on;
	}
	bindSwitches(bindings: readonly SwitchBinding[]): void {
		if (this.phase !== OFF) throw new Error("cannot rebind a moving Ultimate Machine");
		this.bindings = [...bindings];
		this.bindingIndex = 0;
		this.observedLever = false;
	}
	phase = OFF;
	/** Steps spent in WAIT or PRESS. */
	t = 0;
	/** Positions, 0..UM_MAX; fractional inside, rounded when read. */
	lid = 0;
	arm = 0;
	/** Times the hand switched it off. */
	presses = 0;
	/** Times somebody else switched it off while the hand was on its way out. */
	aborts = 0;
	/** Times it has been switched on, by anyone. */
	ons = 0;
	/** The arm waits at the lever for someone else to switch it off (UMLT with phase 0). */
	manualPress = false;
	/** Raised on every phase change; interrupts when `ie`. */
	flag = false;
	ie = false;

	constructor(opts: UltimateOpts = {}) {
		this.timing = { ...UM_DEFAULT_TIMING };
		for (const k of Object.keys(this.timing) as Array<keyof UltimateTiming>) {
			const v = opts[k];
			if (v !== undefined) this.timing[k] = Math.max(0, Math.floor(v));
		}
	}

	/** The lever, or the limit switch while the mechanism is away from home. */
	get power(): boolean {
		return this.lever || this.phase !== OFF;
	}
	/** Cabinet.setPower works the lever, as a hand would. */
	set power(v: boolean) {
		this.setLever(v);
	}

	/** CAF, and Cabinet.setPower on the way on: flags clear, the mechanism stays where it is. */
	reset(): void {
		this.flag = false;
		this.ie = false;
	}

	irq(): boolean {
		return this.flag && this.ie;
	}

	/** Somebody (not the hand) works the lever. Returns false if the finger is holding it down. */
	setLever(on: boolean): boolean {
		if (on && this.phase === PRESS) return false;
		this.lever = on;
		this.observeLever();
		this.run(0);
		return true;
	}

	private observeLever(): void {
		const on = this.lever;
		if (on === this.observedLever) return;
		this.observedLever = on;
		if (on) {
			if (this.phase === PRESS) {
				this.lever = false;
				this.observedLever = false;
				return;
			}
			this.ons += 1;
			if (this.phase === OFF) this.enter(WAIT);
			else if (this.phase === RETURN) this.enter(REACH);
			else if (this.phase === CLOSE) this.enter(OPEN);
		} else {
			if (this.manualPress && this.phase === REACH && this.arm >= UM_MAX) {
				this.presses += 1;
				this.enter(PRESS);
			} else if (this.phase === WAIT || this.phase === OPEN || this.phase === REACH) {
				this.aborts += 1;
				this.enter(this.arm > 0 ? RETURN : CLOSE);
			}
		}
	}

	switchOn(): boolean {
		return this.setLever(true);
	}

	switchOff(): boolean {
		return this.setLever(false);
	}

	tick(cycles = 1): void {
		for (let n = 0; n < cycles; n += 1) {
			this.observeLever();
			if (this.phase !== OFF) this.run(1);
		}
	}

	pose(): UltimatePose {
		return { phase: UM_PHASES[this.phase] ?? "off", lever: this.lever, lid: this.lid / UM_MAX, arm: this.arm / UM_MAX };
	}

	iot(req: Iot): IotReply {
		if (req.device === 0o55) {
			if (req.pulse & 0o4) {
				const index = req.ac & 0o777777;
				if (this.phase !== OFF || index >= this.bindings.length) return { ac: req.ac, skip: false };
				this.bindingIndex = index;
				this.observedLever = false;
			}
			return { ac: (req.pulse & 0o2) ? req.ac | this.bindingIndex : req.ac,
				skip: (req.pulse & 0o1) !== 0 && this.bindingIndex < this.bindings.length };
		}
		let ac = req.ac;
		let skip = false;
		const op = req.pulse & 0o7;
		switch (req.pulse & 0o60) {
			case 0o00:
				if (op & 0o1) skip = this.lever;
				if (op & 0o2) ac |= this.presses & 0o777777;
				if (op & 0o4) this.setLever(true);
				break;
			case 0o20:
				if (op & 0o1) skip = this.phase !== OFF;
				if (op & 0o2) ac |= this.phase;
				if (op & 0o4) this.setLever(false);
				break;
			case 0o40:
				if (op & 0o1) skip = this.flag;
				if (op & 0o2) ac |= Math.round(this.lid);
				if (op & 0o4) this.flag = false;
				break;
			case 0o60:
				if (op & 0o1) this.loadTiming(ac);
				if (op & 0o2) ac |= Math.round(this.arm);
				if (op & 0o4) this.ie = (ac & 1) !== 0;
				break;
		}
		return { ac, skip };
	}

	offIot(req: Iot): IotReply {
		return this.iot(req);
	}

	/** UMLT: AC<0:2> the phase (WAIT..REST), AC<3:17> its length in UM_TICK steps; phase 0, the mode. */
	private loadTiming(ac: number): void {
		const name = UM_PHASES[(ac >> 15) & 0o7];
		if (name === "off") {
			this.manualPress = (ac & 1) !== 0;
			if (ac & 2) this.retract();
			return;
		}
		if (!name) return;
		this.timing[name] = (ac & 0o77777) * UM_TICK;
	}

	/** Give up before the press: lever off, and home from wherever the arm and lid are. */
	private retract(): void {
		if (this.phase !== WAIT && this.phase !== OPEN && this.phase !== REACH) return;
		this.lever = false;
		this.observedLever = false;
		this.aborts += 1;
		this.enter(this.arm > 0 ? RETURN : CLOSE);
	}

	private enter(phase: number): void {
		this.phase = phase;
		this.t = 0;
		this.flag = true;
	}

	/** Advance `dt` steps (0 or 1); instant phases complete without using it. */
	private run(dt: number): void {
		for (let guard = 0; guard < 16; guard += 1) {
			const name = UM_PHASES[this.phase];
			if (!name || name === "off") return;
			const len = this.timing[name];
			const done = (): boolean => {
				if (len === 0) return true;
				this.t += dt;
				return this.t >= len;
			};
			const move = (pos: number, dir: 1 | -1): number => (len === 0 ? (dir > 0 ? UM_MAX : 0) : Math.min(UM_MAX, Math.max(0, pos + (dir * dt * UM_MAX) / len)));
			switch (this.phase) {
				case WAIT:
					if (!done()) return;
					this.enter(OPEN);
					break;
				case OPEN:
					this.lid = move(this.lid, 1);
					if (this.lid < UM_MAX) return;
					this.enter(REACH);
					break;
				case REACH:
					this.arm = move(this.arm, 1);
					if (this.arm < UM_MAX) return;
					if (this.manualPress) return;
					this.lever = false;
					this.observedLever = false;
					this.presses += 1;
					this.enter(PRESS);
					break;
				case PRESS:
					if (!done()) return;
					this.enter(RETURN);
					break;
				case RETURN:
					this.arm = move(this.arm, -1);
					if (this.arm > 0) return;
					this.enter(this.lever ? REACH : CLOSE);
					break;
				case CLOSE:
					this.lid = move(this.lid, -1);
					if (this.lid > 0) return;
					this.enter(REST);
					break;
				case REST:
					if (!done()) return;
					this.enter(this.lever ? WAIT : OFF);
					break;
			}
			dt = 0;
		}
	}
}
