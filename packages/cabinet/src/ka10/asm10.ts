import type { AsmLine, AsmResult, AsmTape } from "../asm/core.js";
import { KA10, type Opts10, symbols10 } from "./disasm10.js";

/**
 * A KA10 assembler for the subset of MIDAS that small programs use, onto the back end every
 * assembler here shares (asm/core.ts), so asm/listing.ts prints its listings.
 *
 *   LABEL:  MOVE 1,@FOO(2)     ; opcode, AC, indirect, address, index
 *           DATAO TTY,CHR      ; I/O: the device in the AC position
 *           3,,4               ; halfwords
 *   FOO=100                    ; assignment (also FOO==100)
 *           LOC 1000           ; set the location (. is the location)
 *           SIXBIT /HELLO/     ; ASCII /.../, ASCIZ /.../, BLOCK n
 *           MOVEI 1,[ASCIZ /HI/]   ; a literal, placed after the program
 *           END GO
 *
 * Numbers are octal; a trailing point makes one decimal (10.). Expressions take + - * / and
 * MIDAS's ! (or) and & (and), with <> for grouping. A word is the sum of its fields as in MIDAS:
 * the field before a comma goes in the AC (for I/O instructions, the device bits), @ sets the
 * indirect bit, (x) adds x swapped into the index, and in an instruction the address is cut to
 * 18 bits. Whatever disasm10.ts prints assembles back to the same word.
 */

export type Asm10Opts = Opts10 & { origin?: number; symbols?: Readonly<Record<string, number | bigint>> };

const M36 = (1n << 36n) - 1n;
const M18 = 0o777777n;

export function assemble10(tapes: readonly AsmTape[], opts: Asm10Opts = {}): AsmResult {
	const builtin = symbols10(opts);
	for (const [k, v] of Object.entries(opts.symbols ?? {})) builtin.set(k.toUpperCase(), BigInt(v));
	const user = new Map<string, bigint>();
	const errors: string[] = [];
	const look = (name: string): bigint | undefined => user.get(name) ?? builtin.get(name);

	type Stmt = { tape: string; line: number; source: string; labels: string[]; body: string };
	const stmts: Stmt[] = [];
	for (const t of tapes) {
		t.text.split("\n").forEach((raw, k) => {
			let s = stripComment(raw);
			const labels: string[] = [];
			for (;;) {
				const m = s.match(/^\s*([A-Za-z.%$][\w.%$]*):(?!:)/);
				if (!m) break;
				labels.push((m[1] as string).toUpperCase());
				s = s.slice(m[0].length);
			}
			stmts.push({ tape: t.name, line: k + 1, source: `${raw}\n`, labels, body: s.trim() });
		});
	}

	let literals: { text: string; value: bigint }[] = [];
	let litBase = 0;
	let start: number | null = null;
	let words: Array<[number, number]> = [];
	let listing: AsmLine[] = [];

	// Pass 1 twice, so a symbol assigned from a later label (POINT=440700,,MSG) is right by pass 2.
	for (const pass of [1, 1, 2]) {
		let loc = opts.origin ?? 0;
		const lits: { text: string; value: bigint }[] = [];
		words = [];
		listing = [];
		const where = (s: Stmt) => `${s.tape}:${s.line}`;
		const err = (s: Stmt, msg: string) => {
			if (pass === 2) errors.push(`${where(s)}: ${msg}`);
		};
		let ended = false;
		for (const s of stmts) {
			if (ended) break;
			for (const l of s.labels) {
				if (pass === 1 && user.has(l) && user.get(l) !== BigInt(loc)) err(s, `${l} defined twice`);
				user.set(l, BigInt(loc));
			}
			const out: number[] = [];
			const at = loc;
			const ev = (text: string): bigint =>
				evaluate(text, {
					look,
					dot: BigInt(loc),
					literal: (inner) => {
						const value = statement(inner, ev);
						const k = lits.length;
						lits.push({ text: inner, value: value[0] ?? 0n });
						return BigInt(litBase + k);
					},
					fail: (m) => err(s, m),
					pass,
				});
			const b = s.body;
			const assign = b.match(/^([A-Za-z.%$][\w.%$]*)\s*==?\s*(.+)$/);
			const pseudo = b.match(/^(\S+)\s*(.*)$/);
			const word = (pseudo?.[1] ?? "").toUpperCase();
			if (!b) {
			} else if (assign) {
				user.set((assign[1] as string).toUpperCase(), statement(assign[2] as string, ev, (m) => err(s, m))[0] ?? 0n);
			} else if (word === "LOC") {
				loc = Number(ev(pseudo?.[2] ?? "0") & M18);
			} else if (word === "BLOCK") {
				loc = (loc + Number(ev(pseudo?.[2] ?? "0") & M18)) & 0o777777;
			} else if (word === "END") {
				if (pseudo?.[2]) start = Number(ev(pseudo[2]) & M18);
				ended = true;
			} else if (word === "TITLE" || word === "CONSTANTS" || word === "VARIABLES") {
			} else {
				for (const v of statement(b, ev, (m) => err(s, m))) out.push(Number(v & M36));
			}
			out.forEach((w, k) => words.push([(at + k) & 0o777777, w]));
			loc = (loc + out.length) & 0o777777;
			listing.push({ tape: s.tape, line: s.line, addr: out.length ? at : null, word: out[0] ?? null, words: out, source: s.source });
		}
		litBase = loc;
		literals = lits;
		if (pass === 2) lits.forEach((l, k) => words.push([(litBase + k) & 0o777777, Number(l.value & M36)]));
	}

	return {
		machine: KA10,
		words,
		symbols: new Map([...user].map(([k, v]) => [k, Number(v & M36)])),
		literals: literals.map((l, k) => ({ addr: (litBase + k) & 0o777777, text: l.text, word: Number(l.value & M36) })),
		variables: [],
		listing,
		errors,
		start,
	};
}

function stripComment(s: string): string {
	let quote: string | null = null;
	for (let k = 0; k < s.length; k++) {
		const c = s[k] as string;
		if (quote) {
			if (c === quote) quote = null;
		} else if (c === ";") return s.slice(0, k);
		else if (c === "/" && /(SIXBIT|ASCIZ|ASCII)\s*$/i.test(s.slice(0, k))) quote = "/";
	}
	return s;
}

/** A statement's words: text pseudo-ops, halfwords, or one instruction word. */
function statement(b: string, ev: (t: string) => bigint, fail: (m: string) => void = () => {}): bigint[] {
	const text = b.match(/^(SIXBIT|ASCIZ|ASCII)\s*(.)(.*)\2\s*$/i);
	if (text) return textWords((text[1] as string).toUpperCase(), text[3] as string);
	const hw = splitTop(b, ",,");
	if (hw.length === 2) return [((ev(hw[0] as string) & M18) << 18n) | (ev(hw[1] as string) & M18)];
	const m = b.match(/^(\S+)\s+(.*)$/);
	if (!m) return [ev(b) & M36];
	let op = ev(m[1] as string);
	let rest = (m[2] as string).trim();
	const io = op >> 33n === 7n;
	const acParts = splitTop(rest, ",");
	if (acParts.length > 2) fail(`too many commas in ${b}`);
	if (acParts.length === 2) {
		const ac = ev(acParts[0] as string);
		op += io ? (ac & 0o774n) << 24n : (ac & 0o17n) << 23n;
		rest = (acParts[1] as string).trim();
	}
	if (rest.startsWith("@")) {
		op |= 1n << 22n;
		rest = rest.slice(1).trim();
	}
	const x = rest.match(/^(.*)\(([^()]*)\)\s*$/);
	if (x) {
		op += (ev(x[2] as string) & 0o17n) << 18n;
		rest = (x[1] as string).trim();
	}
	return [(op + (rest ? ev(rest) & M18 : 0n)) & M36];
}

function textWords(kind: string, s: string): bigint[] {
	const out: bigint[] = [];
	if (kind === "SIXBIT") {
		for (let k = 0; k < s.length || k === 0; k += 6) {
			let w = 0n;
			for (let j = 0; j < 6; j++) {
				const c = s.toUpperCase().charCodeAt(k + j);
				w = (w << 6n) | BigInt(Number.isNaN(c) ? 0 : (c - 0o40) & 0o77);
			}
			out.push(w);
		}
		return out;
	}
	const codes = [...s].map((c) => c.charCodeAt(0) & 0o177);
	if (kind === "ASCIZ") codes.push(0);
	for (let k = 0; k < codes.length; k += 5) {
		let w = 0n;
		for (let j = 0; j < 5; j++) w = (w << 7n) | BigInt(codes[k + j] ?? 0);
		out.push(w << 1n);
	}
	return out.length ? out : [0n];
}

/** Split at `sep` outside <>, () and []. */
function splitTop(s: string, sep: string): string[] {
	const out: string[] = [];
	let depth = 0;
	let from = 0;
	for (let k = 0; k < s.length; k++) {
		const c = s[k] as string;
		if ("<([".includes(c)) depth++;
		else if (">)]".includes(c)) depth--;
		else if (depth === 0 && s.startsWith(sep, k) && !(sep === "," && (s[k + 1] === "," || s[k - 1] === ","))) {
			out.push(s.slice(from, k));
			from = k + sep.length;
			k += sep.length - 1;
		}
	}
	out.push(s.slice(from));
	return out;
}

type Env = { look: (n: string) => bigint | undefined; dot: bigint; literal: (inner: string) => bigint; fail: (m: string) => void; pass: number };

/** An expression: numbers, symbols, `.`, [literals], <groups>, and + - * / ! & left to right. */
function evaluate(text: string, env: Env): bigint {
	let k = 0;
	const s = text.trim();
	const ws = () => {
		while (s[k] === " " || s[k] === "\t") k++;
	};
	const term = (): bigint => {
		ws();
		const c = s[k];
		if (c === "-") {
			k++;
			return -term();
		}
		if (c === "+") {
			k++;
			return term();
		}
		if (c === "<") {
			const end = matching(s, k, "<", ">");
			const v = evaluate(s.slice(k + 1, end), env);
			k = end + 1;
			return v;
		}
		if (c === "[") {
			const end = matching(s, k, "[", "]");
			const v = env.literal(s.slice(k + 1, end).trim());
			k = end + 1;
			return v;
		}
		const num = s.slice(k).match(/^(\d+)(\.?)/);
		if (num && !/^[\d]+[A-Za-z%$]/.test(s.slice(k))) {
			k += num[0].length;
			return num[2] ? BigInt(num[1] as string) : BigInt(`0o${num[1]}`.replace(/[89]/g, () => (env.fail(`${num[1]} is not octal`), "0")));
		}
		const sym = s.slice(k).match(/^[A-Za-z.%$][\w.%$]*/);
		if (sym) {
			k += sym[0].length;
			if (sym[0] === ".") return env.dot;
			const v = env.look(sym[0].toUpperCase());
			if (v === undefined) {
				if (env.pass === 2) env.fail(`${sym[0]} is not defined`);
				return 0n;
			}
			return v;
		}
		env.fail(`cannot read "${s.slice(k)}"`);
		k = s.length;
		return 0n;
	};
	let v = term();
	for (;;) {
		ws();
		const c = s[k];
		if (c === undefined) break;
		k++;
		const r = term();
		if (c === "+") v += r;
		else if (c === "-") v -= r;
		else if (c === "*") v *= r;
		else if (c === "/") v = r === 0n ? 0n : v / r;
		else if (c === "!") v = BigInt.asUintN(36, v) | BigInt.asUintN(36, r);
		else if (c === "&") v = BigInt.asUintN(36, v) & BigInt.asUintN(36, r);
		else {
			env.fail(`cannot read "${c}" in ${s}`);
			break;
		}
	}
	return BigInt.asUintN(36, v);
}

function matching(s: string, from: number, open: string, close: string): number {
	let depth = 0;
	for (let k = from; k < s.length; k++) {
		if (s[k] === open) depth++;
		else if (s[k] === close && --depth === 0) return k;
	}
	return s.length;
}
