import { readFileSync } from "node:fs";

import type { Cpu } from "./bus.js";
import { loadOct } from "./loader.js";
import { applySymelecPatches } from "./symelec-patches.js";

/** Heinz's 1972 listing artifacts — repo-relative from this module. */
export const SYMELEC_ARTIFACTS = new URL(
	"../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/",
	import.meta.url,
);

export function readSymelecOct(which: "symelec" | "symelec-literals"): string {
	return readFileSync(new URL(`${which}.oct`, SYMELEC_ARTIFACTS), "utf8");
}

/** Load symelec.oct then symelec-literals.oct, then the named patches (default none: as printed). */
export function loadSymelec(cpu: Cpu, patches: readonly string[] = []): { low: number; high: number; count: number } {
	const main = loadOct(cpu, readSymelecOct("symelec"));
	loadOct(cpu, readSymelecOct("symelec-literals"));
	applySymelecPatches(cpu, patches);
	return main;
}
