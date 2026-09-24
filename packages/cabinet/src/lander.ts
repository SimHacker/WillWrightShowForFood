import { assemble, loadAsm, type AsmResult } from "./asm.js";
import type { TeletypeHost } from "./hilo.js";
import type { Pdp7 } from "./plugins/pdp7.js";
import { type DemoScript, wait } from "./symelec-demo.js";

/**
 * LANDER, a lunar landing game for the teletype, written for the cabinet
 * (tapes/lander/lander.s). Not a period program.
 */
export function assembleLander(source: string): AsmResult {
	return assemble([{ name: "lander.s", text: source }]);
}

/** Deposit the program and point the CPU at its start. Throws if it did not assemble clean. */
export function bootLander(cpu: Pdp7, program: AsmResult): void {
	const e = program.errors;
	if (e.length > 0) throw new Error(`lander did not assemble, ${e.length} errors:\n${e.join("\n")}`);
	loadAsm(cpu, program);
	cpu.pc = program.start ?? 0o100;
}

/** The rules of lander.s, in half feet, for tests and the demo pilot. */
export const LANDER = { h2: 1000, v: -50, fuel: 60, maxBurn: 30, gravity: 5, thrust: 2 } as const;

export interface LanderState {
	h2: number;
	v: number;
	fuel: number;
	secs: number;
}

export type LanderStep = { state: LanderState; contact: number | null };

export function isqrt(d: number): number {
	let r = 0;
	for (let odd = 1; d >= odd; odd += 2) {
		d -= odd;
		r += 1;
	}
	return r;
}

/** One second of flight, as lander.s computes it. `contact` is the speed at touchdown, or null if still flying. */
export function landerStep(s: LanderState, burn: number): LanderStep {
	if (s.fuel === 0) return { state: s, contact: isqrt(s.v * s.v + LANDER.gravity * s.h2) };
	const b = Math.min(burn, s.fuel);
	const a = LANDER.thrust * b - LANDER.gravity;
	const next = { h2: s.h2 + 2 * s.v + a, v: s.v + a, fuel: s.fuel - b, secs: s.secs + 1 };
	const d = s.v * s.v - a * s.h2;
	const touched = next.h2 <= 0 || (s.v < 0 && next.v >= 0 && d >= 0);
	return { state: next, contact: touched ? isqrt(d) : null };
}

/** A pilot who tracks a descent speed of sqrt(2 k h): larger k waits longer and brakes harder. */
export function landerPilot(s: LanderState, k = 8): number {
	let best = 0;
	let bestErr = Number.POSITIVE_INFINITY;
	for (let b = 0; b <= Math.min(LANDER.maxBurn, s.fuel); b += 1) {
		const a = LANDER.thrust * b - LANDER.gravity;
		const h = (s.h2 + 2 * s.v + a) / 2;
		if (h < 0) continue;
		const err = Math.abs(s.v + a + Math.max(1, Math.sqrt(2 * k * h)));
		if (err < bestErr) {
			bestErr = err;
			best = b;
		}
	}
	return best;
}

/** The scripted pilot flies one descent, reading altitude, speed and fuel from core as the operator reads the paper. */
export function* landerDemo(h: TeletypeHost, program: AsmResult): DemoScript {
	const word = (name: string): number => {
		const w = h.cpu.read(program.symbols.get(name) ?? 0) & 0o777777;
		return w & 0o400000 ? w - 0o1000000 : w;
	};
	yield "LANDER prints its rules, then waits for Return";
	yield* wait(400_000);
	h.type("\r");
	yield* wait(150_000);
	for (let n = 0; n < 40; n += 1) {
		const s = { h2: word("h2"), v: word("v"), fuel: word("fuel"), secs: word("secs") };
		if (s.fuel === 0) break;
		const b = landerPilot(s);
		yield b === 0 ? `Falling at ${-s.v} ft/s from ${s.h2 / 2} feet: no burn yet` : `Burn ${b}: aiming for about ${Math.round(Math.sqrt(8 * s.h2))} ft/s at this height`;
		for (const c of `${b}\r`) {
			h.type(c);
			yield* wait(30_000);
		}
		yield* wait(150_000);
		if (landerStep(s, b).contact !== null) break;
	}
	yield "The pilot waited, then braked hard. Your turn: click the paper";
	yield* wait(400_000);
}
