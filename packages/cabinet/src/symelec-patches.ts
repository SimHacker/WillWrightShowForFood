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
		[0o5166, 0o13101, 0o17301], // BOT
		[0o5167, 0o13200, 0o17440], // TOP
		[0o5171, 0o13201, 0o17461], // LPBEG
		[0o5172, 0o13240, 0o17560], // LKBEG
		[0o5173, 0o13300, 0o17620], // LKEND
		[0o5174, 0o13301, 0o17621], // XSTBEG
		[0o5175, 0o13340, 0o17710], // YSTBEG
		[0o5176, 0o13400, 0o17750], // YSTEND
		[0o5177, 0o13401, 0o17751], // STSAVE
	],
	/* Ours, not Heinz's. core8k gives PERMDF 511 words and the free list 1919
	   cells. The demo picture needs about 730 of PERMDF; its free-list peak,
	   after garbage collection, leaves room. Move the boundary up 340 octal:
	   PERMDF 735, free list 1695. Stacks sit above END and SYMELEC masks
	   addresses to 13 bits, so the pool itself cannot grow. Applies on top of
	   core8k. */
	bigpic: [
		[0o5157, 0o13300, 0o13640], // DFE
		[0o5160, 0o13400, 0o13740], // DFERES
		[0o5161, 0o13300, 0o13640], // DFENOR
		[0o5162, 0o13401, 0o13741], // BEG
	],
};

export function applySymelecPatches(cpu: Cpu, names: readonly string[] = Object.keys(SYMELEC_PATCHES)): void {
	for (const name of names) {
		for (const [addr, printed, word] of SYMELEC_PATCHES[name] ?? []) {
			if (cpu.read(addr) === printed) cpu.write(addr, word);
		}
	}
}
