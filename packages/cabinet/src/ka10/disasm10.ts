import type { Machine } from "../asm/core.js";

/**
 * KA10 words as MIDAS writes them, and in English. `MOVE 1,@FOO(2)` is the opcode, the
 * accumulator, indirection, the address and the index register, the way every PDP-10 listing
 * and DDT print them, and the text assembles back to the same word with asm10.ts (the tests
 * check every opcode). `explain10` says the same thing for people who don't read PDP-10
 * assembly: "add the word at FOO to AC 1".
 *
 * The opcodes are the ones the KA10 here executes (ka10.ts, after SIMH's KA build): the KI10's
 * additions (DMOVE, FIX, DFAD...) trap on a KA10, so they print as MUUOs; with `its` the three
 * instructions MIT added (LPM, XCTR, CIRC) and ITS's system calls (.IOT, .OPEN...) have names.
 * Mode 5 of the floating-point ops is immediate on a KA10 (FADRI), as DEC's manual names it;
 * SIMH calls it FADRL. Like the PDP-7's, a word cannot say whether it is an instruction.
 */

export const KA10: Machine = { name: "KA10", wordBits: 36, addrBits: 18, radix: 8 };

export type Word10 = number | bigint;
export type Opts10 = { its?: boolean };

/** The fields of an instruction word, bit 0 the most significant as DEC numbers them. */
export type Fields10 = { op: number; ac: number; i: boolean; x: number; y: number };

const W = (w: Word10): bigint => BigInt.asUintN(36, BigInt(w));

export function fields10(w: Word10): Fields10 {
	const n = W(w);
	const l = Number(n >> 18n);
	return { op: l >>> 9, ac: (l >>> 5) & 0o17, i: ((l >>> 4) & 1) === 1, x: l & 0o17, y: Number(n & 0o777777n) };
}

/** How an opcode uses E: as an address, as a number (immediate), or as a jump target. */
type Use = "mem" | "imm" | "jump" | "none";
type Op10 = { name: string; use: Use; group: string; mode: string };

const OPS: (Op10 | undefined)[] = new Array(512);
const def = (op: number, name: string, group: string, mode = "", use: Use = "mem") => {
	OPS[op] = { name, group, mode, use };
};

for (let op = 1; op <= 0o37; op++) def(op, `LUUO${op.toString(8).padStart(2, "0")}`, "luuo");
const DEC_UUO = "CALL INITI MUUO42 MUUO43 MUUO44 MUUO45 MUUO46 CALLI OPEN TTCALL MUUO52 MUUO53 MUUO54 RENAME IN OUT SETSTS STATO STATUS GETSTS INBUF OUTBUF INPUT OUTPUT CLOSE RELEAS MTAPE UGETF USETI USETO LOOKUP ENTER".split(" ");
DEC_UUO.forEach((n, k) => def(0o40 + k, n, "muuo"));
for (let op = 0o100; op <= 0o127; op++) def(op, `MUUO${op.toString(8)}`, "muuo");
"UFA DFN FSC IBP ILDB LDB IDPB DPB".split(" ").forEach((n, k) => def(0o130 + k, n, n === "UFA" || n === "DFN" || n === "FSC" ? n : "byte", "", n === "FSC" ? "imm" : "mem"));
"FAD FSB FMP FDV".split(" ").forEach((n, g) =>
	["", "L", "M", "B", "R", "RI", "RM", "RB"].forEach((m, k) => def(0o140 + g * 8 + k, n + m, "float", m, m === "RI" ? "imm" : "mem")),
);
const IMB = ["", "I", "M", "B"];
const IMS = ["", "I", "M", "S"];
"MOVE MOVS MOVN MOVM".split(" ").forEach((n, g) => IMS.forEach((m, k) => def(0o200 + g * 4 + k, n + m, n, m, m === "I" ? "imm" : "mem")));
"IMUL MUL IDIV DIV".split(" ").forEach((n, g) => IMB.forEach((m, k) => def(0o220 + g * 4 + k, n + m, n, m, m === "I" ? "imm" : "mem")));
"ASH ROT LSH JFFO ASHC ROTC LSHC".split(" ").forEach((n, k) => def(0o240 + k, n, n, "", n === "JFFO" ? "jump" : "imm"));
def(0o247, "MUUO247", "muuo");
"EXCH BLT AOBJP AOBJN JRST JFCL XCT MAP".split(" ").forEach((n, k) =>
	def(0o250 + k, n, n, "", n === "AOBJP" || n === "AOBJN" || n === "JRST" || n === "JFCL" ? "jump" : "mem"),
);
"PUSHJ PUSH POP POPJ JSR JSP JSA JRA".split(" ").forEach((n, k) => def(0o260 + k, n, n, "", n === "POPJ" ? "none" : n === "PUSH" || n === "POP" ? "mem" : "jump"));
"ADD SUB".split(" ").forEach((n, g) => IMB.forEach((m, k) => def(0o270 + g * 4 + k, n + m, n, m, m === "I" ? "imm" : "mem")));
const SKIPS = ["", "L", "E", "LE", "A", "GE", "N", "G"];
"CAI CAM JUMP SKIP AOJ AOS SOJ SOS".split(" ").forEach((n, g) =>
	SKIPS.forEach((m, k) => def(0o300 + g * 8 + k, n + m, n, m, n === "CAI" ? "imm" : n === "JUMP" || n === "AOJ" || n === "SOJ" ? "jump" : "mem")),
);
const BOOL = "SETZ AND ANDCA SETM ANDCM SETA XOR IOR ANDCB EQV SETCA ORCA SETCM ORCM ORCB SETO".split(" ");
BOOL.forEach((n, g) => IMB.forEach((m, k) => def(0o400 + g * 4 + k, n + m, "bool", m, m === "I" ? "imm" : "mem")));
const HALF = "HLL HRL HLLZ HRLZ HLLO HRLO HLLE HRLE HRR HLR HRRZ HLRZ HRRO HLRO HRRE HLRE".split(" ");
HALF.forEach((n, g) => IMS.forEach((m, k) => def(0o500 + g * 4 + k, n + m, "half", m, m === "I" ? "imm" : "mem")));
for (let op = 0o600; op <= 0o677; op++) {
	const how = "NZCO"[(op >> 4) & 3] as string;
	const lr = op & 0o10 ? (op & 1 ? "S" : "D") : op & 1 ? "L" : "R";
	const skip = ["", "E", "A", "N"][(op >> 1) & 3] as string;
	def(op, `T${lr}${how}${skip}`, "test", `${lr}${how}${skip}`, lr === "R" || lr === "L" ? "imm" : "mem");
}

const ITS_UUO = ".IOT .OPEN .OPER .CALL .USET .BREAK .STATUS .ACCESS".split(" ");
const ITS_OPS: Record<number, Op10> = {
	0o102: { name: "LPM", group: "LPM", mode: "", use: "mem" },
	0o103: { name: "XCTR", group: "XCTR", mode: "", use: "mem" },
	0o247: { name: "CIRC", group: "CIRC", mode: "", use: "imm" },
};
ITS_UUO.forEach((n, k) => (ITS_OPS[0o40 + k] = { name: n, group: "its", mode: "", use: "mem" }));

const opOf = (op: number, its: boolean): Op10 | undefined => (its ? (ITS_OPS[op] ?? OPS[op]) : OPS[op]);

/** Names the accumulator field picks for JRST and JFCL, on a KA10. */
const JRST_AC: Record<number, string> = { 0o2: "JRSTF", 0o4: "HALT", 0o12: "JEN" };
const JFCL_AC: Record<number, string> = { 0o1: "JFOV", 0o2: "JCRY1", 0o4: "JCRY0", 0o6: "JCRY", 0o10: "JOV" };

export const IO_FUNCTIONS = ["BLKI", "DATAI", "BLKO", "DATAO", "CONO", "CONI", "CONSZ", "CONSO"] as const;

/** Device numbers as written (the 7-bit device times 4), and what they are. */
export const DEVICES10: Readonly<Record<string, { code: number; says: string }>> = {
	APR: { code: 0o000, says: "the processor" },
	PI: { code: 0o004, says: "the priority interrupt system" },
	PTP: { code: 0o100, says: "the paper tape punch" },
	PTR: { code: 0o104, says: "the paper tape reader" },
	TTY: { code: 0o120, says: "the console teletype" },
	LPT: { code: 0o124, says: "the line printer" },
	DIS: { code: 0o130, says: "the display" },
};
const DEVICE_NAME = new Map(Object.entries(DEVICES10).map(([n, d]) => [d.code, n]));
const DEVICE_SAYS = new Map<number, string>([
	...Object.values(DEVICES10).map((d) => [d.code, d.says] as [number, string]),
	[0o250, "the RP10 disk"],
	[0o500, "the clock (device 500)"],
]);

/** Every name the disassembler prints, with its value, for the assembler. */
export function symbols10(opts: Opts10 = {}): Map<string, bigint> {
	const out = new Map<string, bigint>();
	const its = opts.its ?? false;
	for (let op = 0; op < 512; op++) {
		const o = opOf(op, its);
		if (o && !(op >= 0o700)) out.set(o.name, BigInt(op) << 27n);
	}
	if (!its) for (const n of ITS_UUO) out.delete(n);
	for (const [ac, n] of Object.entries(JRST_AC)) out.set(n, (0o254n << 27n) | (BigInt(ac) << 23n));
	for (const [ac, n] of Object.entries(JFCL_AC)) out.set(n, (0o255n << 27n) | (BigInt(ac) << 23n));
	IO_FUNCTIONS.forEach((n, f) => out.set(n, (0o7n << 33n) | (BigInt(f) << 23n)));
	for (const [n, d] of Object.entries(DEVICES10)) out.set(n, BigInt(d.code));
	return out;
}

/** The disassembly of one word. */
export type Line10 = {
	/** `MOVE 1,@FOO(2)`, `HALT`, `DATAO TTY,CHR`, or `3,,4` for a word that is not an instruction. */
	readonly text: string;
	readonly name: string | null;
	readonly fields: Fields10;
	/** The address E names when it is used as an address (no index, no indirection), else null. */
	readonly target: number | null;
	readonly kind: "insn" | "io" | "uuo" | "data";
};

const o = (n: number): string => n.toString(8);

/** A halfword pair as MIDAS writes it: `3,,4`, or just `4` when the left half is 0. */
export function halves10(w: Word10): string {
	const n = W(w);
	const l = Number(n >> 18n);
	const r = Number(n & 0o777777n);
	return l === 0 ? o(r) : `${o(l)},,${o(r)}`;
}

/** The six SIXBIT characters of a word. */
export function sixbit10(w: Word10): string {
	const n = W(w);
	let s = "";
	for (let k = 5; k >= 0; k--) s += String.fromCharCode(Number((n >> BigInt(6 * k)) & 0o77n) + 0o40);
	return s;
}

/** The five 7-bit ASCII characters of a word (bit 35 is left over), unprintables as `·`. */
export function ascii10(w: Word10): string {
	const n = W(w);
	let s = "";
	for (let k = 4; k >= 0; k--) {
		const c = Number((n >> BigInt(7 * k + 1)) & 0o177n);
		s += c >= 0o40 && c < 0o177 ? String.fromCharCode(c) : "·";
	}
	return s;
}

/** An I/O instruction's device (bits 3-9) as written: the device number times 4. */
const ioDevice = (f: Fields10): number => (((f.op & 0o77) << 1) | (f.ac >> 3)) << 2;

function operand(f: Fields10, symbolic: (addr: number) => string): string {
	return `${f.i ? "@" : ""}${symbolic(f.y) || o(f.y)}${f.x ? `(${o(f.x)})` : ""}`;
}

/** One word as an instruction, in MIDAS's syntax. `symbolic` names an address, or returns "". */
export function disassemble10(w: Word10, symbolic: (addr: number) => string = () => "", opts: Opts10 = {}): Line10 {
	const f = fields10(w);
	const its = opts.its ?? false;
	const target = (use: Use): number | null => (use !== "imm" && use !== "none" && !f.i && !f.x ? f.y : null);
	if (f.op >= 0o700) {
		const dev = ioDevice(f);
		const func = IO_FUNCTIONS[f.ac & 7] as string;
		const name = DEVICE_NAME.get(dev) ?? o(dev);
		const use: Use = func === "CONO" || func === "CONSZ" || func === "CONSO" ? "imm" : "mem";
		return { text: `${func} ${name},${operand(f, symbolic)}`, name: func, fields: f, target: target(use), kind: "io" };
	}
	const op = opOf(f.op, its);
	if (!op) return { text: halves10(w), name: null, fields: f, target: null, kind: "data" };
	const alias = f.op === 0o254 ? JRST_AC[f.ac] : f.op === 0o255 ? JFCL_AC[f.ac] : undefined;
	const bare = !f.i && !f.x && f.y === 0;
	if (alias) return { text: bare ? alias : `${alias} ${operand(f, symbolic)}`, name: alias, fields: f, target: target(op.use), kind: "insn" };
	if (f.op === 0o255 && f.ac === 0 && bare) return { text: "JFCL", name: "JFCL", fields: f, target: null, kind: "insn" };
	const text = `${op.name} ${f.ac ? `${o(f.ac)},` : ""}${operand(f, symbolic)}`;
	const kind = op.group === "luuo" || op.group === "muuo" || op.group === "its" ? "uuo" : "insn";
	return { text, name: op.name, fields: f, target: target(op.use), kind };
}

const SKIP_IF: Record<string, string> = { L: "<", E: "=", LE: "≤", GE: "≥", N: "≠", G: ">" };
const BOOL_SAYS: Record<string, string> = {
	SETZ: "0",
	AND: "A and B",
	ANDCA: "B and not A",
	SETM: "B",
	ANDCM: "A and not B",
	SETA: "A",
	XOR: "A xor B",
	IOR: "A or B",
	ANDCB: "not A and not B",
	EQV: "A eqv B (1s where they agree)",
	SETCA: "not A",
	ORCA: "B or not A",
	SETCM: "not B",
	ORCM: "A or not B",
	ORCB: "not A or not B",
	SETO: "all ones",
};
const ITS_SAYS: Record<string, string> = {
	".IOT": "transfer on I/O channel",
	".OPEN": "open a file or device on channel",
	".OPER": "ITS system call",
	".CALL": "ITS system call, named by the block at",
	".USET": "read or set a job variable, channel",
	".BREAK": "stop and return to the superior (DDT)",
	".STATUS": "read the status of channel",
	".ACCESS": "set the file position of channel",
};

/**
 * One short English line for a KA10 word read as an instruction: "add the word at FOO to AC 1",
 * "jump to LOOP if AC 3 < 0". Words that are not instructions get their halves, SIXBIT and ASCII.
 */
export function explain10(w: Word10, symbolic: (addr: number) => string = () => "", opts: Opts10 = {}): string {
	const l = disassemble10(w, symbolic, opts);
	const f = l.fields;
	const a = `AC ${o(f.ac)}`;
	const a1 = `AC ${o((f.ac + 1) & 0o17)}`;
	const named = symbolic(f.y) || o(f.y);
	const base = f.x ? `${named} plus AC ${o(f.x)}` : named;
	const e = f.i ? `the address held in ${base}` : base;
	const num = f.i ? `the number held in ${base}` : f.x ? base : named;
	const at = `the word at ${e}`;
	if (l.kind === "data") return W(w) === 0n ? "zero" : `${halves10(w)} (sixbit "${sixbit10(w).trimEnd()}", ascii "${ascii10(w)}")`;
	if (l.kind === "io") {
		const dev = ioDevice(f);
		const d = DEVICE_SAYS.get(dev) ?? `device ${o(dev)}`;
		switch (l.name) {
			case "BLKI":
				return `read a word from ${d} into the next place of the block the pointer at ${e} counts`;
			case "BLKO":
				return `send ${d} the next word of the block the pointer at ${e} counts`;
			case "DATAI":
				return `read a word from ${d} into ${e}`;
			case "DATAO":
				return `send ${d} ${at}`;
			case "CONO":
				return `set ${d}'s conditions to ${num}`;
			case "CONI":
				return `read ${d}'s conditions into ${e}`;
			case "CONSZ":
				return `skip if ${d}'s conditions under the mask ${num} are all 0`;
			default:
				return `skip if any of ${d}'s conditions under the mask ${num} is 1`;
		}
	}
	const op = opOf(f.op, opts.its ?? false) as Op10;
	const src = op.mode === "I" ? num : at;
	const into = (what: string) => {
		switch (op.mode) {
			case "M":
				return `${what}, into ${e}`;
			case "B":
				return `${what}, into both ${a} and ${e}`;
			case "S":
				return `${what}, back into ${e}${f.ac ? ` and into ${a}` : ""}`;
			default:
				return `${what}, into ${a}`;
		}
	};
	const skip = (cond: string, what: string) => (op.mode === "A" ? "skip the next instruction" : op.mode === "" ? "do nothing (never skips)" : `skip if ${what} ${SKIP_IF[op.mode]} ${cond}`);
	const jump = (what: string) => (op.mode === "A" ? `jump to ${e}` : op.mode === "" ? "never jump" : `jump to ${e} if ${what} ${SKIP_IF[op.mode]} 0`);
	switch (op.group) {
		case "luuo":
			return `user UUO ${o(f.op)}: put this instruction at 40 and do the instruction at 41`;
		case "muuo":
			return f.op === 0o247 || (f.op >= 0o100 && f.op <= 0o127) ? "not a KA10 instruction: traps to the monitor" : `monitor call ${op.name}: traps to the monitor`;
		case "its":
			return `${ITS_SAYS[op.name]} ${op.name === ".BREAK" ? "" : f.ac ? o(f.ac) : ""}${op.name === ".CALL" ? ` ${e}` : ""}`.replace(/\s+$/, "");
		case "LPM":
			return `load the pager's registers from the block at ${e} (ITS)`;
		case "XCTR":
			return `do the instruction at ${e}, its memory references in the user's space (ITS)`;
		case "CIRC":
			return `rotate ${a} left and ${a1} right together, ${num} places (ITS)`;
		case "MOVE":
			return op.mode === "S" ? `copy ${at}${f.ac ? ` into ${a}` : " (does nothing to it)"}` : op.mode === "M" ? `store ${a} at ${e}` : `copy ${src} into ${a}`;
		case "MOVS":
			return op.mode === "M" ? `store ${a}, halves swapped, at ${e}` : into(`${src}, halves swapped`);
		case "MOVN":
			return op.mode === "M" ? `store minus ${a} at ${e}` : into(`minus ${src}`);
		case "MOVM":
			return op.mode === "M" ? `store the magnitude of ${a} at ${e}` : into(`the magnitude of ${src}`);
		case "ADD":
			return into(`${a} plus ${src}`);
		case "SUB":
			return into(`${a} minus ${src}`);
		case "IMUL":
			return into(`${a} times ${src}`);
		case "MUL":
			return op.mode === "M" ? `${a} times ${src}, high word into ${e}` : `${a} times ${src}, the double-length product into ${a} and ${a1}${op.mode === "B" ? ` and the high word into ${e}` : ""}`;
		case "IDIV":
		case "DIV":
			return `${op.group === "DIV" ? `${a} and ${a1}` : a} divided by ${src}: the quotient into ${op.mode === "M" ? e : a}${op.mode === "B" ? ` and ${e}` : ""}, the remainder into ${a1}`;
		case "bool": {
			const formula = (BOOL_SAYS[op.name.replace(/[IMB]$/, "")] ?? op.name).replace(/\bA\b/g, a).replace(/\bB\b/g, src);
			return into(formula);
		}
		case "half": {
			const n = op.name.replace(/[IMS]$/, "");
			const from = n[1] === "L" ? "left" : "right";
			const to = n[2] === "L" ? "left" : "right";
			const rest = n[3] === "Z" ? "zeros" : n[3] === "O" ? "ones" : n[3] === "E" ? "the sign of the half copied" : "";
			const dst = op.mode === "M" || op.mode === "S" ? e : a;
			const s = op.mode === "M" ? a : op.mode === "I" ? `${num} (as 0,,E)` : at;
			const other = rest ? `, and fill its ${to === "left" ? "right" : "left"} half with ${rest}` : "";
			return `copy the ${from} half of ${s} into the ${to} half of ${dst}${other}${op.mode === "S" && f.ac ? `, and also into ${a}` : ""}`;
		}
		case "test": {
			const [lr, how, sk] = [op.mode[0], op.mode[1], op.mode.slice(2)];
			const mask = lr === "R" ? `${num} (the right half)` : lr === "L" ? `${num} in the left half` : lr === "D" ? at : `${at}, halves swapped`;
			const act = how === "Z" ? "then clear those bits" : how === "C" ? "then flip those bits" : how === "O" ? "then set those bits" : "";
			const cond = sk === "E" ? `skip if the bits of ${a} under ${mask} are all 0` : sk === "N" ? `skip if any bit of ${a} under ${mask} is 1` : sk === "A" ? "skip the next instruction" : "";
			return [cond, act].filter(Boolean).join(", ") || "do nothing";
		}
		case "CAI":
		case "CAM":
			return skip(src, a);
		case "JUMP":
			return jump(a);
		case "SKIP":
			return `${skip("0", at)}${f.ac ? `; copy it into ${a}` : ""}`;
		case "AOJ":
		case "SOJ":
			return `${op.group === "AOJ" ? "add 1 to" : "subtract 1 from"} ${a}, then ${jump("it")}`;
		case "AOS":
		case "SOS":
			return `${op.group === "AOS" ? "add 1 to" : "subtract 1 from"} ${at}${f.ac ? ` and copy it into ${a}` : ""}, then ${skip("0", "it")}`;
		case "ASH":
		case "ROT":
		case "LSH":
			return `${{ ASH: "shift", ROT: "rotate", LSH: "shift logically" }[op.group]} ${a} by ${num} places (left if positive)`;
		case "ASHC":
		case "ROTC":
		case "LSHC":
			return `${{ ASHC: "shift", ROTC: "rotate", LSHC: "shift logically" }[op.group]} ${a} and ${a1} together by ${num} places (left if positive)`;
		case "JFFO":
			return `if ${a} is not 0, count its leading zeros into ${a1} and jump to ${e}`;
		case "EXCH":
			return `swap ${a} with ${at}`;
		case "BLT":
			return `copy a block: from the address in ${a}'s left half, to the address in its right half, up to ${e}`;
		case "AOBJP":
		case "AOBJN":
			return `add 1 to both halves of ${a}, then jump to ${e} if it is ${op.group === "AOBJN" ? "still negative" : "now 0 or more"}`;
		case "JRST":
			if (f.ac === 0o4) return `halt; continuing starts at ${e}`;
			if (f.ac === 0o2) return `jump to ${e}, restoring the flags from the left half of the word that held the address`;
			if (f.ac === 0o12) return `jump to ${e}, restoring the flags, and dismiss the interrupt`;
			return f.ac ? `jump to ${e} (AC field ${o(f.ac)})` : `jump to ${e}`;
		case "JFCL": {
			if (f.ac === 0) return "do nothing (a no-op)";
			const flags = [f.ac & 0o10 && "overflow", f.ac & 4 && "carry 0", f.ac & 2 && "carry 1", f.ac & 1 && "floating overflow"].filter(Boolean).join(", ");
			return `jump to ${e} if any of ${flags} is set, and clear them`;
		}
		case "XCT":
			return `do the instruction at ${e}`;
		case "MAP":
			return "a KI10 instruction; it does nothing on a KA10";
		case "PUSHJ":
			return `call: push the return address onto the stack ${a} points to, and jump to ${e}`;
		case "PUSH":
			return `push ${at} onto the stack ${a} points to`;
		case "POP":
			return `pop the stack ${a} points to into ${e}`;
		case "POPJ":
			return `return: pop the stack ${a} points to into the PC`;
		case "JSR":
			return `call: store the flags and PC at ${e} and jump to the word after it`;
		case "JSP":
			return `call: put the flags and PC in ${a} and jump to ${e}`;
		case "JSA":
			return `call: store ${a} at ${e}, put E,,return in ${a}, and jump to the word after E`;
		case "JRA":
			return `return: reload ${a} from the address in its left half, and jump to ${e}`;
		case "byte": {
			const ptr = `the byte pointer at ${e}`;
			if (op.name === "IBP") return `advance ${ptr} to the next byte`;
			if (op.name === "ILDB") return `advance ${ptr}, then load the byte it points to into ${a}`;
			if (op.name === "LDB") return `load the byte ${ptr} points to into ${a}`;
			if (op.name === "IDPB") return `advance ${ptr}, then store ${a}'s low bits in the byte it points to`;
			return `store ${a}'s low bits in the byte ${ptr} points to`;
		}
		case "UFA":
			return `floating add ${at} to ${a}, unnormalized, into ${a1}`;
		case "DFN":
			return `negate the double float in ${a} and ${at}`;
		case "FSC":
			return `scale the float in ${a} by 2 to the ${num}`;
		case "float": {
			const verb = { FAD: "plus", FSB: "minus", FMP: "times", FDV: "divided by" }[op.name.slice(0, 3)] as string;
			const m = op.mode;
			const round = m.startsWith("R") ? ", rounded" : "";
			const s = m === "RI" ? `${num} (as E,,0, a float)` : at;
			const dest = m === "L" ? `${a} and ${a1}, double length` : m.endsWith("M") ? e : m.endsWith("B") ? `both ${a} and ${e}` : a;
			return `floating ${a} ${verb} ${s}${round}, into ${dest}`;
		}
		default:
			return op.name;
	}
}
