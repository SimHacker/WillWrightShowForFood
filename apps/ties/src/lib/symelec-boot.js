/**
 * Browser-side SYMELEC loader. The .oct files live in the repo's characters tree;
 * vite inlines them at build time via ?raw. Node tests use symelec-fixtures.ts instead.
 */
import { loadOct } from '@wwsff/cabinet';
import symelec from '../../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec.oct?raw';
import symelecLiterals from '../../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-literals.oct?raw';

/**
 * Patches applied over the image as printed. The .oct files stay exactly what the listing
 * says; every departure from it is named here. See packages/cabinet/BUG-JOURNAL.md.
 */
export const PATCHES = {
	// SEQ 70: the source word 201128 has an 8 in it; the assembler stored 0 and Heinz
	// circled it in pencil, 12.7.72. P I X in 340 character code is 20 11 30.
	pix: { addr: 0o5270, printed: 0, word: 0o201130 }
};

/** Load symelec.oct then symelec-literals.oct, then the named patches; return the main range. */
export function loadSymelec(cpu, patches = Object.keys(PATCHES)) {
	const main = loadOct(cpu, symelec);
	loadOct(cpu, symelecLiterals);
	for (const name of patches) {
		const p = PATCHES[name];
		if (p && cpu.read(p.addr) === p.printed) cpu.write(p.addr, p.word);
	}
	return main;
}
