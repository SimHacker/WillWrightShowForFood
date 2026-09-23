import type { Cabinet } from "./cabinet.js";
import type { Pdp7 } from "./plugins/pdp7.js";
import { type PaperTape, readIn } from "./plugins/papertape.js";

/** Frode van der Meeren's five words for SIMH: see tapes/duel/README.md. */
export const DUEL_PATCHES: readonly (readonly [number, number])[] = [
	[0o1446, 0o700606],
	[0o1447, 0o201650],
	[0o1467, 0o604002],
	[0o4002, 0o777776],
	[0o4006, 0o604006],
];

/** Console switches, bit 0 leftmost. A control is active with its switch down (0). */
export const DUEL_SWITCHES = {
	left: { turnLeft: 0o400000, turnRight: 0o200000, back: 0o100000, forward: 0o040000, fire: 0o020000 },
	right: { turnLeft: 0o000020, turnRight: 0o000010, back: 0o000004, forward: 0o000002, fire: 0o000001 },
} as const;

export const DUEL_START = 0o4000;
const RIM_ORIGIN = 0o17763;
const RIM_START = 0o17770;
const LOADED = 0o646;

/**
 * Read in the RIM loader, let it and the tape's FunnyFormat loader read
 * DUEL off the reader, stop at 646, patch, set all switches up. Returns
 * false if the load never reached 646.
 */
export function bootDuel(box: Cabinet, cpu: Pdp7, ptr: PaperTape, rim: Uint8Array, tape: Uint8Array, maxSteps = 2_000_000): boolean {
	readIn(cpu, rim, RIM_ORIGIN);
	ptr.mount(tape);
	cpu.pc = RIM_START;
	for (let n = 0; cpu.pc !== LOADED; n += 1) {
		if (cpu.halted || n >= maxSteps) return false;
		box.run(1);
	}
	for (const [a, w] of DUEL_PATCHES) cpu.write(a, w);
	cpu.switches = 0o777777;
	return true;
}
