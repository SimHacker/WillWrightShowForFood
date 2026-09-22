/** Mask a JS number to the cabinet's word width. Bits are unsigned. */
export function maskWord(value: number, bits: number): number {
	return value & ((1 << bits) - 1);
}

export function octal(n: number): string {
	return n.toString(8).padStart(6, "0");
}
