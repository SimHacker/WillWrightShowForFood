import { CAMBRIDGE_SYMBOLS, PDP7_SYMBOLS } from "./asm.js";

/**
 * One PDP-7 word as an instruction: `lac i 1234`, `cla!cll`, `law 17770`,
 * `idla`, an unnamed EAE word as plain octal. Microinstructions are joined
 * with `!`, so without symbols the text assembles back to the same word in
 * either dialect of asm.ts (the tests check all of them). Memory-reference operands
 * go through `symbolic`, so a caller with a symbol table gets `jms setup`
 * or `dac tab+3`; without one they are octal.
 *
 * Every word decodes as something. Whether it is an instruction at all
 * (versus data, a display word, a return address) the word cannot say;
 * that is the source map's job.
 */

const MEMREF = ["cal", "dac", "jms", "dzm", "lac", "xor", "add", "tad", "xct", "isz", "and", "sad", "jmp"];

// Whole-word names for IOT, EAE and OPR, first name wins. Names that are
// only a base for OR-ing (opr, iot, law, i) are left out.
const EXACT = new Map<number, string>();
for (const table of [PDP7_SYMBOLS, CAMBRIDGE_SYMBOLS]) {
	for (const [name, value] of Object.entries(table)) {
		if (["opr", "iot", "law", "i", "lam"].includes(name)) continue;
		if (value >= 0o640000 && !EXACT.has(value)) EXACT.set(value, name);
	}
}

const o = (n: number): string => n.toString(8);

/** OPR microinstructions, in the order the DEC listings combine them. */
function opr(w: number): string {
	const parts: string[] = [];
	if (w & 0o10000) parts.push("cla");
	if (w & 0o4000 && w & 0o2 && !(w & 0o10000)) parts.push("stl");
	else {
		if (w & 0o4000) parts.push("cll");
		if (w & 0o2) parts.push("cml");
	}
	const reverse = (w & 0o1000) !== 0;
	if (w & 0o100) parts.push(reverse ? "spa" : "sma");
	if (w & 0o200) parts.push(reverse ? "sna" : "sza");
	if (w & 0o400) parts.push(reverse ? "szl" : "snl");
	if (reverse && !(w & 0o700)) parts.push("skp");
	const twice = (w & 0o2000) !== 0;
	if (w & 0o10) parts.push(twice ? "rtl" : "ral");
	if (w & 0o20) parts.push(twice ? "rtr" : "rar");
	if (twice && !(w & 0o30)) parts.push("opr!2000");
	if (w & 0o4) parts.push("oas");
	if (w & 0o1) parts.push("cma");
	if (w & 0o40) parts.push("hlt");
	return parts.length ? parts.join("!") : "nop";
}

export function disassemble(word: number, symbolic: (addr: number) => string = o): string {
	const w = word & 0o777777;
	const exact = EXACT.get(w);
	if (exact) return exact;
	const op = w >>> 14;
	const indirect = (w & 0o20000) !== 0;
	const addr = w & 0o17777;
	if (op <= 0o14) {
		const name = MEMREF[op] as string;
		if (op === 0) return `cal${indirect ? " i" : ""}${addr ? ` ${o(addr)}` : ""}`;
		return `${name}${indirect ? " i" : ""} ${symbolic(addr) || o(addr)}`;
	}
	if (op === 0o15) return o(w);
	if (op === 0o16) return `iot ${o(w & 0o37777).padStart(4, "0")}`;
	if (indirect) return `law ${o(addr)}`;
	return opr(w);
}
