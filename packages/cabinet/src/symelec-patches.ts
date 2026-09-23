import type { Cpu } from "./bus.js";

/** [address, word as printed, word loaded]. A patch skips any word that is not as printed. */
export type PatchWord = readonly [number, number, number];

/**
 * Departures from the 1972 image as printed. The .oct files stay exactly what
 * the listing says; every change is named here. See BUG-JOURNAL.md.
 */
export const SYMELEC_PATCHES: Readonly<Record<string, readonly PatchWord[]>> = {
	/* SEQ 70: the source word 201128 has an 8 in it; the assembler stored 0 and
	   Heinz circled it in pencil, 12.7.72. P I X in 340 character code is 20 11 30. */
	pix: [[0o5270, 0, 0o201130]],
	/* SEQ 746-754: as assembled, PERMDF gets 77 words (12301-12400) and the free
	   list 337 (12441-13000). One line fills the display file; the second trips
	   ERRDF twice and SYMELEC restarts, blank. Heinz wrote the 8K layout in the
	   comment beside each word; this loads what he wrote. */
	core8k: [
		[0o5157, 0o12400, 0o13300], // DFE
		[0o5160, 0o12440, 0o13400], // DFERES
		[0o5161, 0o12400, 0o13300], // DFENOR
		[0o5162, 0o12441, 0o13401], // BEG
		[0o5163, 0o13000, 0o17200], // END
		[0o5164, 0o13100, 0o17300], // ENDRES
		[0o5165, 0o13000, 0o17200], // ENDNOR
	],
};

export function applySymelecPatches(cpu: Cpu, names: readonly string[] = Object.keys(SYMELEC_PATCHES)): void {
	for (const name of names) {
		for (const [addr, printed, word] of SYMELEC_PATCHES[name] ?? []) {
			if (cpu.read(addr) === printed) cpu.write(addr, word);
		}
	}
}
