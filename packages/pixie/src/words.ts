/**
 * PIXIE's 18-bit ring words, classified the way the 1972 relocation
 * pass classifies them (TITAN-LINK-PROTOCOL.md; /LTPIX listing pages
 * 21-24; RSPPIX's CAR/CDR at 2347-2406):
 *
 *   atom          top 5 bits zero — a bare 13-bit value (chars, counts)
 *   block header  20000 + 13-bit length; that many raw words follow
 *   NIL           the JMS opcode value 100000 — a pointer to address 0
 *   pointer       JMS-tagged 13-bit address; relocation adds RELCON
 *
 * NIL-as-JMS is not a pun, it is the machine: a "name" is an address
 * ORed with the JMS opcode so that indirecting through it works, and
 * the null name points at address zero.
 */

export const WMASK = 0o777777;
export const AMASK = 0o17777;
export const JMS = 0o100000;
export const NIL = JMS;
export const PXID = 0o767676;
export const BLOCK = 0o20000;
/** Sign bit: a "nonitem" — CAR 7 follows its low 13 bits instead. */
export const NONITEM = 0o400000;

export type WordKind = "atom" | "nil" | "pointer" | "block";

export function isAtom(w: number): boolean {
	return (w & WMASK) >>> 13 === 0;
}

export function isBlockHeader(w: number): boolean {
	return ((w & WMASK) & ~AMASK) === BLOCK;
}

export function isNil(w: number): boolean {
	return (w & WMASK) === NIL;
}

export function classify(w: number): WordKind {
	if (isAtom(w)) return "atom";
	if (isBlockHeader(w)) return "block";
	if (isNil(w)) return "nil";
	return "pointer";
}

/** Tag a 13-bit address as a name the machine can indirect through. */
export function pointer(addr: number): number {
	return JMS | (addr & AMASK);
}

export function addrOf(name: number): number {
	return name & AMASK;
}

export function blockHeader(len: number): number {
	return BLOCK | (len & AMASK);
}

export function blockLen(w: number): number {
	return w & AMASK;
}
