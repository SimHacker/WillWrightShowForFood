import type { DemoScript } from "./symelec-demo.js";

/**
 * A recorded session: everything that reached the machine from outside,
 * stamped with machine cycles since boot. The emulator only advances by
 * cycles, so the same inputs at the same cycles after the same boot replay
 * the same run, at any speed.
 *
 * An event is [cycle, kind, ...args]. Kinds so far:
 *   sw   value                  console AC switches
 *   pen  x y down aperture      light pen, 340 grid; down 1 or 0
 *   tty  code...                teletype keys, 7-bit; the KSR-33 adds the eighth bit
 *   poke addr word...           a deposit from outside the machine (Monitor.poke)
 * A replayer applies the kinds it has handlers for and skips the rest, so
 * a session with new kinds (Tiny Titan messages, say) still plays on an
 * older page.
 */
export type SessionEvent = [cycle: number, kind: string, ...args: (number | string)[]];

export interface Session {
	version: 2;
	program: string;
	switches: number;
	events: SessionEvent[];
	cycles: number;
}

export type SessionHandlers = Record<string, (...args: (number | string)[]) => void>;

export class SessionRecorder {
	private readonly start: number;
	readonly session: Session;

	constructor(program: string, switches: number, now: number) {
		this.start = now;
		this.session = { version: 2, program, switches, events: [], cycles: 0 };
	}

	/** Two events of one kind at one cycle: only the later one ever reached the machine. */
	record(now: number, kind: string, ...args: (number | string)[]): void {
		const at = now - this.start;
		const last = this.session.events.at(-1);
		if (last && last[0] === at && last[1] === kind) this.session.events[this.session.events.length - 1] = [at, kind, ...args];
		else this.session.events.push([at, kind, ...args]);
	}

	finish(now: number): Session {
		this.session.cycles = now - this.start;
		return this.session;
	}
}

/** A demo script that plays a session back from a fresh boot. */
export function* replaySession(handlers: SessionHandlers, s: Session, caption: string): DemoScript {
	yield caption;
	handlers.sw?.(s.switches);
	let at = 0;
	for (const [cycle, kind, ...args] of s.events) {
		if (cycle > at) {
			yield cycle - at;
			at = cycle;
		}
		handlers[kind]?.(...args);
	}
	if (s.cycles > at) yield s.cycles - at;
}

export function isSession(x: unknown): x is Session {
	const s = x as Session;
	return (
		!!s &&
		s.version === 2 &&
		typeof s.program === "string" &&
		Number.isInteger(s.switches) &&
		Number.isInteger(s.cycles) &&
		Array.isArray(s.events) &&
		s.events.every((e) => Array.isArray(e) && Number.isInteger(e[0]) && typeof e[1] === "string")
	);
}
