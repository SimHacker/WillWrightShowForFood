import { readFileSync } from "node:fs";

import type { Cpu } from "./bus.js";
import { loadOct } from "./loader.js";

/** Heinz's 1972 listing artifacts — repo-relative from this module. */
export const SYMELEC_ARTIFACTS = new URL(
	"../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/",
	import.meta.url,
);

export function readSymelecOct(which: "symelec" | "symelec-literals"): string {
	return readFileSync(new URL(`${which}.oct`, SYMELEC_ARTIFACTS), "utf8");
}

/** Load symelec.oct then symelec-literals.oct; return the main image range. */
export function loadSymelec(cpu: Cpu): { low: number; high: number; count: number } {
	const main = loadOct(cpu, readSymelecOct("symelec"));
	loadOct(cpu, readSymelecOct("symelec-literals"));
	return main;
}
