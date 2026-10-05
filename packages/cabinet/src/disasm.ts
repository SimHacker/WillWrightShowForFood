import { CAMBRIDGE_SYMBOLS, PDP7_SYMBOLS } from "./asm/pdp7.js";

/**
 * One PDP-7 word as an instruction: `lac i 1234`, `cla!cll`, `law 17770`,
 * `idla`, an unnamed EAE word as plain octal. Microinstructions are joined
 * with `!`, so without symbols the text assembles back to the same word in
 * either dialect of asm/dec.ts (the tests check all of them). Memory-reference operands
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

const MEMREF_SAYS = [
	"call through 20 (CAL)",
	"store AC into",
	"call subroutine at",
	"zero",
	"load AC from",
	"exclusive-or AC with",
	"add (ones' complement) to AC from",
	"add (two's complement) to AC from",
	"execute the instruction at",
	"add 1 to, skip if it becomes 0,",
	"and AC with",
	"skip if AC differs from",
	"jump to",
];

const WORDS_SAY: Readonly<Record<string, string>> = {
	nop: "do nothing", hlt: "halt", ion: "interrupts on", iof: "interrupts off", caf: "clear all device flags",
	clsf: "skip if the clock ticked", clof: "clock off", clon: "clock on",
	ksf: "skip if a key is ready", krb: "read the key into AC", tsf: "skip if the teletype is ready",
	tcf: "clear the teletype flag", tls: "print the character in AC",
	rsf: "skip if the tape reader has a frame", rrb: "read the tape frame into AC", rsa: "read a tape frame",
	idsi: "skip if the display stopped", idla: "start the display at the address in AC",
	idrs: "resume the display", idve: "skip if the beam ran off the top or bottom",
	idsp: "skip if the light pen fired", idrc: "read where the beam was when the pen fired",
	idhe: "skip if the beam ran off the side",
	lsf: "skip if the Titan link is ready", lcf: "clear the Titan link flag",
	mul: "multiply MQ by the next word", idiv: "divide AC MQ by the next word",
	lacq: "load AC from MQ", lmq: "load MQ from AC", gsm: "get the sign and magnitude of AC",
};

const OPR_SAY: ReadonlyArray<[string, string]> = [
	["cla", "clear AC"], ["cll", "clear the link"], ["stl", "set the link"], ["cml", "flip the link"],
	["sma", "skip if AC is negative"], ["spa", "skip if AC is positive"], ["sza", "skip if AC is 0"],
	["sna", "skip if AC is not 0"], ["snl", "skip if the link is set"], ["szl", "skip if the link is clear"],
	["skp", "skip"], ["ral", "rotate link and AC left"], ["rar", "rotate link and AC right"],
	["rtl", "rotate left twice"], ["rtr", "rotate right twice"], ["oas", "or the switches into AC"],
	["cma", "complement AC"], ["hlt", "halt"],
];

/**
 * One short English line for a PDP-7 word, for people who don't read PDP-7 assembly: "load AC
 * from tab+3". The word cannot say it is an instruction; the caller decides that.
 */
export function explain(word: number, symbolic: (addr: number) => string = o): string {
	const w = word & 0o777777;
	const text = disassemble(w, symbolic);
	const said = WORDS_SAY[text];
	if (said) return said;
	const op = w >>> 14;
	const indirect = (w & 0o20000) !== 0;
	const addr = w & 0o17777;
	if (op <= 0o14) {
		if (op === 0) return "call the routine whose address is in 20";
		const where = symbolic(addr) || o(addr);
		return `${MEMREF_SAYS[op]} ${indirect ? `the address held in ${where}` : where}`;
	}
	if (op === 0o15) return "arithmetic (EAE) operation";
	if (op === 0o16) return `device ${o((w >> 6) & 0o77)}, pulse ${o(w & 0o77)}`;
	if (indirect) return `load AC with ${o(addr)}`;
	const parts = text.split("!").map((p) => OPR_SAY.find(([n]) => n === p)?.[1] ?? p);
	return parts.join(", ");
}

const MODES = ["parameter", "point", "slave", "character", "vector", "vector-continue", "increment", "subroutine"];
const BIT = (w: number, b: number) => (w & (1 << (17 - b))) !== 0;
const FIELD = (w: number, a: number, b: number) => (w >> (17 - b)) & ((1 << (b - a + 1)) - 1);

/**
 * One short English line for a Type 340 display word read in `mode`, the mode the 340 is in when
 * it fetches it. A display word means nothing without its mode; the shadow 340 knows it.
 */
export function explainDisplay(word: number, mode: number, symbolic: (addr: number) => string = o): string {
	const w = word & 0o777777;
	const next = `, then ${MODES[FIELD(w, 2, 4)]} mode`;
	switch (mode) {
		case 0: {
			const parts: string[] = [];
			if (BIT(w, 5)) parts.push(`light pen ${BIT(w, 6) ? "on" : "off"}`);
			if (BIT(w, 11)) parts.push(`scale ${1 << FIELD(w, 12, 13)}`);
			if (BIT(w, 14)) parts.push(`intensity ${FIELD(w, 15, 17)}`);
			if (BIT(w, 7)) parts.push("stop");
			return `set ${parts.join(", ") || "nothing"}${next}`;
		}
		case 1:
			return `beam ${BIT(w, 1) ? "y" : "x"} to ${FIELD(w, 8, 17)}${BIT(w, 7) ? ", and draw a dot" : ""}${next}`;
		case 3:
			return "three characters";
		case 4:
		case 5: {
			const dy = FIELD(w, 3, 9) * (BIT(w, 2) ? -1 : 1);
			const dx = FIELD(w, 11, 17) * (BIT(w, 10) ? -1 : 1);
			return `${BIT(w, 1) ? "draw" : "move"} ${dx}, ${dy}${mode === 5 ? " to the edge" : ""}${BIT(w, 0) ? ", then back to parameter mode" : ""}`;
		}
		case 6:
			return "four short steps";
		case 7: {
			const kind = FIELD(w, 0, 1);
			const to = symbolic(FIELD(w, 5, 17)) || o(FIELD(w, 5, 17));
			const what = kind === 3 ? `call display subroutine ${to}` : kind === 2 ? `jump to ${to}` : kind === 1 ? `store a return jump in ${to} (pen dispatch)` : `tag ${to}`;
			return `${what}${next}`;
		}
		default:
			return "slave display";
	}
}
