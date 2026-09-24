import type { Cpu } from "./bus.js";

/**
 * DEC PDP-4/PDP-7 assembler, the dialect of the 1964 program library
 * listings (DEC-4-45-M and its OUTNOX). Two passes. What it accepts:
 *
 *   name,          label at the current location
 *   name=expr      parameter assignment
 *   expr/          set the location counter (no space before the slash)
 *   / text         comment (slash at the start or after white space)
 *   (expr          literal; the closing paren is optional, as DEC wrote it
 *   .              the location counter
 *   a b, a+b, a-b  a space adds; arithmetic is ones' complement, so -0 is 777777
 *   start          end of a tape; further tapes continue the same program
 *
 * Literals go after the last tape, then one word for each symbol that
 * was used and never defined: the listings rely on this for their
 * temporaries (OUTNOX never defines t1x..t69x). `variables` reports
 * them, which is also how a mistranscribed name shows up.
 */

const M = 0o777777;
const DEFAULT_ORIGIN = 0o20;

export const PDP7_SYMBOLS: Readonly<Record<string, number>> = {
	cal: 0o000000, dac: 0o040000, jms: 0o100000, dzm: 0o140000,
	lac: 0o200000, xor: 0o240000, add: 0o300000, tad: 0o340000,
	xct: 0o400000, isz: 0o440000, and: 0o500000, sad: 0o540000,
	jmp: 0o600000, i: 0o020000, law: 0o760000, iot: 0o700000,
	opr: 0o740000, nop: 0o740000, cma: 0o740001, cml: 0o740002,
	oas: 0o740004, ral: 0o740010, rar: 0o740020, hlt: 0o740040,
	sma: 0o740100, sza: 0o740200, snl: 0o740400, skp: 0o741000,
	spa: 0o741100, sna: 0o741200, szl: 0o741400, rtl: 0o742010,
	rtr: 0o742020, cll: 0o744000, stl: 0o744002, rcl: 0o744010,
	rcr: 0o744020, cla: 0o750000, las: 0o750004, glk: 0o750010,
	ion: 0o700042, iof: 0o700002,
};

export type AsmTape = { name: string; text: string };

export type AsmLine = { tape: string; line: number; addr: number | null; word: number | null; source: string };

export type AsmResult = {
	words: Array<[addr: number, word: number]>;
	symbols: Map<string, number>;
	literals: Array<{ addr: number; text: string; word: number }>;
	variables: Array<{ name: string; addr: number }>;
	listing: AsmLine[];
	errors: string[];
	/** From `start expr` on the last tape that gave one. */
	start: number | null;
};

const ocAdd = (a: number, b: number): number => {
	const s = (a & M) + (b & M);
	return s > M ? (s + 1) & M : s;
};
const ocNeg = (a: number): number => ~a & M;

type Stmt =
	| { kind: "word"; expr: string }
	| { kind: "origin"; expr: string }
	| { kind: "assign"; name: string; expr: string }
	| { kind: "start"; expr: string }
	| { kind: "none" };

type Parsed = { tape: string; line: number; source: string; labels: string[]; stmt: Stmt };

/** Split a source line into labels and one statement, dropping the comment. */
function parseLine(raw: string): { labels: string[]; stmt: Stmt } {
	let rest = raw.replace(/\s+$/, "");
	const labels: string[] = [];
	for (;;) {
		const m = rest.match(/^\s*([a-z][a-z0-9]*),/);
		if (!m) break;
		labels.push(m[1] as string);
		rest = rest.slice(m[0].length);
	}
	let body = "";
	let origin = false;
	for (let k = 0; k < rest.length; k += 1) {
		const c = rest[k] as string;
		if (c === "/") {
			const before = body.trim();
			const prev = k > 0 ? (rest[k - 1] as string) : " ";
			if (before !== "" && !/\s/.test(prev)) origin = true;
			break;
		}
		body += c;
	}
	body = body.trim();
	if (origin) return { labels, stmt: { kind: "origin", expr: body } };
	if (body === "") return { labels, stmt: { kind: "none" } };
	const assign = body.match(/^([a-z][a-z0-9]*)\s*=\s*(.*)$/);
	if (assign) return { labels, stmt: { kind: "assign", name: assign[1] as string, expr: assign[2] as string } };
	const start = body.match(/^start\b\s*(.*)$/);
	if (start) return { labels, stmt: { kind: "start", expr: start[1] as string } };
	return { labels, stmt: { kind: "word", expr: body } };
}

type Term = { sign: 1 | -1; kind: "num" | "sym" | "dot" | "lit"; text: string };

function tokenize(expr: string): Term[] {
	const terms: Term[] = [];
	let k = 0;
	let sign: 1 | -1 = 1;
	while (k < expr.length) {
		const c = expr[k] as string;
		if (/\s/.test(c) || c === "+") {
			k += 1;
			continue;
		}
		if (c === "-") {
			sign = sign === 1 ? -1 : 1;
			k += 1;
			continue;
		}
		if (c === "(") {
			let depth = 1;
			let j = k + 1;
			while (j < expr.length && depth > 0) {
				if (expr[j] === "(") depth += 1;
				else if (expr[j] === ")") depth -= 1;
				if (depth > 0) j += 1;
			}
			terms.push({ sign, kind: "lit", text: expr.slice(k + 1, j).trim() });
			k = j + 1;
			sign = 1;
			continue;
		}
		if (c === ".") {
			terms.push({ sign, kind: "dot", text: "." });
			k += 1;
			sign = 1;
			continue;
		}
		const m = expr.slice(k).match(/^[a-z0-9]+/);
		if (!m) throw new Error(`bad character '${c}' in "${expr}"`);
		const text = m[0];
		terms.push({ sign, kind: /^[0-9]/.test(text) ? "num" : "sym", text });
		k += text.length;
		sign = 1;
	}
	return terms;
}

/** Assemble one or more tapes into one program. Never throws: problems go to `errors`. */
export function assemble(tapes: readonly AsmTape[], opts: { symbols?: Record<string, number> } = {}): AsmResult {
	const errors: string[] = [];
	const perm = new Map<string, number>(Object.entries({ ...PDP7_SYMBOLS, ...(opts.symbols ?? {}) }));
	const user = new Map<string, number>();
	const referenced = new Set<string>();
	// "." in a literal is the referring word's location (OUTNOX: lac (jmp .+4), so those are per site.
	const litKey = (text: string, loc: number): string => (text.includes(".") ? `${text}@${loc}` : text);
	const literalSites = new Map<string, { text: string; loc: number }>();
	const parsed: Parsed[] = [];

	for (const tape of tapes) {
		const lines = tape.text.split("\n");
		for (let n = 0; n < lines.length; n += 1) {
			const source = lines[n] as string;
			try {
				const { labels, stmt } = parseLine(source.toLowerCase());
				parsed.push({ tape: tape.name, line: n + 1, source, labels, stmt });
				if (stmt.kind === "start") break;
			} catch (e) {
				errors.push(`${tape.name}:${n + 1}: ${(e as Error).message}`);
			}
		}
	}

	const lookup = (name: string): number | undefined => user.get(name) ?? perm.get(name);

	// Pass 1 needs values only for origins and assignments; words just take a location.
	const evaluate = (expr: string, loc: number, where: string, pass: 1 | 2, litAddr?: (key: string) => number): number => {
		let v = 0;
		for (const t of tokenize(expr)) {
			let x: number;
			if (t.kind === "num") {
				if (/[89]/.test(t.text)) throw new Error(`non-octal digit in ${t.text}`);
				x = Number.parseInt(t.text, 8) & M;
			} else if (t.kind === "dot") {
				x = loc;
			} else if (t.kind === "lit") {
				const key = litKey(t.text, loc);
				if (pass === 1) {
					if (!literalSites.has(key)) literalSites.set(key, { text: t.text, loc });
					for (const s of tokenize(t.text)) if (s.kind === "sym") referenced.add(s.text);
					x = 0;
				} else {
					x = litAddr ? litAddr(key) : 0;
				}
			} else {
				referenced.add(t.text);
				const s = lookup(t.text);
				if (s === undefined) {
					if (pass === 2) throw new Error(`undefined symbol ${t.text} in ${where}`);
					x = 0;
				} else x = s;
			}
			v = ocAdd(v, t.sign === 1 ? x : ocNeg(x));
		}
		return v;
	};

	let loc = DEFAULT_ORIGIN;
	for (const p of parsed) {
		const where = `${p.tape}:${p.line}`;
		try {
			for (const l of p.labels) {
				if (user.has(l)) errors.push(`${where}: ${l} defined twice`);
				user.set(l, loc);
			}
			const s = p.stmt;
			if (s.kind === "origin") loc = evaluate(s.expr, loc, where, 1) & 0o17777;
			else if (s.kind === "assign") user.set(s.name, evaluate(s.expr, loc, where, 1));
			else if (s.kind === "word") {
				evaluate(s.expr, loc, where, 1);
				loc = (loc + 1) & 0o17777;
			} else if (s.kind === "start" && s.expr) evaluate(s.expr, loc, where, 1);
		} catch (e) {
			errors.push(`${where}: ${(e as Error).message}`);
		}
	}

	const literals: AsmResult["literals"] = [];
	const litIndex = new Map<string, number>();
	const litLoc = new Map<number, number>();
	for (const [key, site] of literalSites) {
		litIndex.set(key, loc);
		litLoc.set(loc, site.loc);
		literals.push({ addr: loc, text: site.text, word: 0 });
		loc = (loc + 1) & 0o17777;
	}
	const variables: AsmResult["variables"] = [];
	for (const name of [...referenced].sort()) {
		if (lookup(name) !== undefined) continue;
		user.set(name, loc);
		variables.push({ name, addr: loc });
		loc = (loc + 1) & 0o17777;
	}
	const litAddr = (key: string): number => litIndex.get(key) ?? 0;

	// Pass 2: re-run assignments in order so forward references settle, then emit.
	const words = new Map<number, number>();
	const listing: AsmLine[] = [];
	let start: number | null = null;
	const put = (addr: number, word: number, where: string): void => {
		if (words.has(addr)) errors.push(`${where}: location ${addr.toString(8)} written twice`);
		words.set(addr, word);
	};
	loc = DEFAULT_ORIGIN;
	for (const p of parsed) {
		const where = `${p.tape}:${p.line}`;
		const s = p.stmt;
		let addr: number | null = null;
		let word: number | null = null;
		try {
			if (s.kind === "origin") loc = evaluate(s.expr, loc, where, 2, litAddr) & 0o17777;
			else if (s.kind === "assign") user.set(s.name, evaluate(s.expr, loc, where, 2, litAddr));
			else if (s.kind === "word") {
				addr = loc;
				word = evaluate(s.expr, loc, where, 2, litAddr);
				put(addr, word, where);
				loc = (loc + 1) & 0o17777;
			} else if (s.kind === "start" && s.expr) start = evaluate(s.expr, loc, where, 2, litAddr) & 0o17777;
		} catch (e) {
			errors.push(`${where}: ${(e as Error).message}`);
		}
		listing.push({ tape: p.tape, line: p.line, addr, word, source: p.source });
	}
	for (const lit of literals) {
		try {
			lit.word = evaluate(lit.text, litLoc.get(lit.addr) ?? lit.addr, `literal (${lit.text})`, 2, litAddr);
		} catch (e) {
			errors.push((e as Error).message);
		}
		put(lit.addr, lit.word, `literal (${lit.text})`);
	}
	for (const v of variables) put(v.addr, 0, `variable ${v.name}`);

	return {
		words: [...words.entries()].sort((a, b) => a[0] - b[0]),
		symbols: user,
		literals,
		variables,
		listing,
		errors,
		start,
	};
}

/** Deposit an assembled program. */
export function loadAsm(cpu: Cpu, result: AsmResult): void {
	for (const [addr, word] of result.words) cpu.write(addr, word);
}

/** A listing in the old layout: location, word, source. */
export function formatListing(result: AsmResult): string {
	const o = (n: number, w: number) => n.toString(8).padStart(w, "0");
	const out: string[] = [];
	for (const l of result.listing) {
		const left = l.addr === null ? "            " : `${o(l.addr, 5)} ${o(l.word ?? 0, 6)}`;
		out.push(`${left}\t${l.source}`);
	}
	out.push("", "literals");
	for (const l of result.literals) out.push(`${o(l.addr, 5)} ${o(l.word, 6)}\t(${l.text})`);
	out.push("", "variables");
	for (const v of result.variables) out.push(`${o(v.addr, 5)}\t${v.name}`);
	return out.join("\n");
}
