import { assemble, loadAsm, type AsmResult } from "./asm.js";
import type { Pdp7 } from "./plugins/pdp7.js";

/**
 * DEC-4-45-M, the 370 light pen diagnostic (C. Stein, 1964), assembled
 * from tapes/lp370: the reconstructed page 6, the surviving listing, and
 * OUTNOX, in that order. See tapes/lp370/README.md.
 */
export const LP370_TAPES = ["page6.s", "lp370.s", "outnox.s"] as const;

export const LP370_START = 0o22;

/** AC switches, bit 0 leftmost, from the operating table on page 2. */
export const LP370_SWITCHES = {
	readout: 0o400000,
	sensitivity: 0o200000,
	follow: 0o040000,
	fieldOfView: 0o010000,
	/** Box corner = switches times 200 (octal). */
	boxX: (n: number) => (n & 7) << 8,
	boxY: (n: number) => (n & 7) << 4,
	intensity: (n: number) => n & 7,
} as const;

export function assembleLp370(sources: Readonly<Record<(typeof LP370_TAPES)[number], string>>): AsmResult {
	return assemble(LP370_TAPES.map((name) => ({ name, text: sources[name] })));
}

/** Deposit the program and point the CPU at 22. Throws if it did not assemble clean. */
export function bootLp370(cpu: Pdp7, program: AsmResult, switches = 0): void {
	const e = program.errors;
	if (e.length > 0) throw new Error(`lp370 did not assemble, ${e.length} errors:\n${e.join("\n")}`);
	loadAsm(cpu, program);
	cpu.switches = switches;
	cpu.pc = LP370_START;
}
