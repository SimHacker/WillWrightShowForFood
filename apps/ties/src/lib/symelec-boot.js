/**
 * Browser-side SYMELEC loader. The .oct files live in the repo's characters tree;
 * vite inlines them at build time via ?raw. Node tests use symelec-fixtures.ts instead.
 */
import { loadOct, applySymelecPatches } from '@wwsff/cabinet';
import symelec from '../../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec.oct?raw';
import symelecLiterals from '../../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-literals.oct?raw';

/** Load symelec.oct then symelec-literals.oct, then the named patches (default all); return the main range. */
export function loadSymelec(cpu, patches) {
	const main = loadOct(cpu, symelec);
	loadOct(cpu, symelecLiterals);
	applySymelecPatches(cpu, patches);
	return main;
}
