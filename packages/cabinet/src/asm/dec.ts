import type { AsmLine, AsmResult, AsmTape } from "./core.js";
import { CAMBRIDGE_SYMBOLS, DISPLAY_SYMBOLS, PDP7, PDP7_SYMBOLS } from "./pdp7.js";

/**
 * The DEC-family assembler for the PDP-4 and PDP-7: two passes, one language, two dialects.
 *
 * `DEC_1964` is the dialect of DEC's 1964 program library listings
 * (DEC-4-45-M and its OUTNOX). What it accepts:
 *
 *   name,          label at the current location
 *   name=expr      parameter assignment
 *   expr/          set the location counter (no space before the slash);
 *                  a statement may follow on the same line
 *   / text         comment (slash at the start or after white space)
 *   (expr          literal; the closing paren is optional, as DEC wrote it
 *   .              the location counter
 *   a b, a+b, a-b  a space adds; arithmetic is ones' complement, so -0 is 777777
 *   a!b            inclusive OR
 *   start          end of a tape; further tapes continue the same program
 *   text "ABC"     one word per character, the KSR-33 code with the eighth
 *                  bit set, upper case. A cabinet extension for programs
 *                  written here (tapes/hilo); the 1964 listings have none
 *
 * Literals go after the last tape, then one word for each symbol that
 * was used and never defined, in alphabetical order: the listings rely on
 * this for their temporaries (OUTNOX never defines t1x..t69x).
 *
 * `CAMBRIDGE_1972` is the Cambridge University CAD Group Assembler that built
 * PIXIE on Titan in 1972, read off its listing. On top of DEC's:
 *
 *   ,              inside an operand, the location counter (JMP , 3)
 *   name=JMS,      a label that is a value plus the location
 *   DISP / NODISP  turn the Type 340 display vocabulary on and off
 *   VEC m.. dx dy  a vector word: dx and dy packed sign-magnitude
 *   PAUSE          end of a tape segment; emits nothing
 *   a digit 8 or 9 in a number is an error and the word is 0, as in 1972
 *
 * Undefined symbols become variables in order of first use, placed
 * before the literal pool (the listing's pages 104-106).
 *
 * `variables` reports the allocated names, which is also how a
 * mistranscribed name shows up. It never throws: problems go to `errors`,
 * and a word that fails still takes its location, so nothing after it moves.
 */

const M = 0o777777;
const DEFAULT_ORIGIN = 0o20;

/** What one DEC-family dialect adds to the common language. */
export type Dialect = {
	name: string;
	symbols: Readonly<Record<string, number>>;
	/** `name=JMS,`: a label whose value is an expression plus the location. */
	labelsWithValues: boolean;
	/** `JMP , 3`: a comma inside an operand is the location counter. */
	commaIsDot: boolean;
	/** `text "ABC"`. */
	text: boolean;
	/** `start expr` ends a tape. */
	start: boolean;
	/** DISP, NODISP, PAUSE and VEC. */
	display: boolean;
	/** How variables (used, never defined) are ordered, and whether they go before the literals. */
	variableOrder: "alphabetical" | "first-use";
	variablesFirst: boolean;
};

export const DEC_1964: Dialect = {
	name: "dec",
	symbols: {},
	labelsWithValues: false,
	commaIsDot: false,
	text: true,
	start: true,
	display: false,
	variableOrder: "alphabetical",
	variablesFirst: false,
};

export const CAMBRIDGE_1972: Dialect = {
	name: "cambridge",
	symbols: CAMBRIDGE_SYMBOLS,
	labelsWithValues: true,
	commaIsDot: true,
	text: false,
	start: false,
	display: true,
	variableOrder: "first-use",
	variablesFirst: true,
};

const DIALECTS: Record<string, Dialect> = { dec: DEC_1964, cambridge: CAMBRIDGE_1972 };

export type AsmOpts = {
	dialect?: "dec" | "cambridge" | Dialect;
	symbols?: Record<string, number>;
	/** Where the location counter starts. Default 20. */
	origin?: number;
};

const ocAdd = (a: number, b: number): number => {
	const s = (a & M) + (b & M);
	return s > M ? (s + 1) & M : s;
};
const ocNeg = (a: number): number => ~a & M;

type Stmt =
	| { kind: "word"; expr: string }
	| { kind: "assign"; name: string; expr: string }
	| { kind: "start"; expr: string }
	| { kind: "text"; chars: number[] }
	| { kind: "none" };

const stmtWords = (s: Stmt): number => (s.kind === "word" ? 1 : s.kind === "text" ? s.chars.length : 0);

/** `name,` is the location; Cambridge `name=JMS,` is JMS plus the location. */
type Label = { name: string; plus: string | null };

type Parsed = {
	tape: string;
	line: number;
	source: string;
	labels: Label[];
	origin: string | null;
	/** `nobfxx, nobfxx+300/`: the label is set first, then the origin, which may use it. */
	originAfterLabels: boolean;
	stmt: Stmt;
	disp: boolean;
	endsSegment: boolean;
};

const NAME = "[a-z][a-z0-9]*";

/** Split a source line into labels, an optional origin, and one statement, dropping the comment. */
type Line = { labels: Label[]; origin: string | null; originAfterLabels: boolean; stmt: Stmt };

function parseLine(raw: string, dialect: Dialect): Line {
	const { labels, origin, stmt } = splitLine(raw, dialect);
	const leading = /^\s*([0-7]+|[a-z][a-z0-9]*(?:[+-][0-7]+)?)\/(?=\s|$)/.test(raw);
	return { labels, origin, originAfterLabels: origin !== null && !leading, stmt };
}

function splitLine(raw: string, dialect: Dialect): { labels: Label[]; origin: string | null; stmt: Stmt } {
	let rest = raw.replace(/\s+$/, "");
	const labels: Label[] = [];
	let origin: string | null = null;
	const om = rest.match(/^\s*([0-7]+|[a-z][a-z0-9]*(?:[+-][0-7]+)?)\/(?=\s|$)/);
	if (om) {
		origin = om[1] as string;
		rest = rest.slice(om[0].length);
	}
	for (;;) {
		// In Cambridge "JMP , 3" the comma is an operand; only a name glued to its comma is a label.
		const m = rest.match(
			dialect.labelsWithValues ? new RegExp(`^\\s*(${NAME})(?:=([a-z0-9+\\- ]+))?,`) : new RegExp(`^\\s*(${NAME}),`),
		);
		if (!m) break;
		labels.push({ name: m[1] as string, plus: m[2]?.trim() || null });
		rest = rest.slice(m[0].length);
	}
	const tm = dialect.text ? rest.match(/^\s*text\s+"([^"]*)"/) : null;
	if (tm) {
		const chars = [...(tm[1] as string).toUpperCase()].map((c) => (c.charCodeAt(0) & 0o177) | 0o200);
		return { labels, origin, stmt: { kind: "text", chars } };
	}
	let body = "";
	for (let k = 0; k < rest.length; k += 1) {
		const c = rest[k] as string;
		if (c === "/") {
			const prev = k > 0 ? (rest[k - 1] as string) : " ";
			if (body.trim() !== "" && !/\s/.test(prev) && origin === null) {
				origin = body.trim();
				body = "";
				continue;
			}
			break;
		}
		body += c;
	}
	body = body.trim();
	if (body === "") return { labels, origin, stmt: { kind: "none" } };
	const assign = body.match(new RegExp(`^(${NAME})\\s*=\\s*(.*)$`));
	if (assign) return { labels, origin, stmt: { kind: "assign", name: assign[1] as string, expr: assign[2] as string } };
	if (dialect.start) {
		const start = body.match(/^start\b\s*(.*)$/);
		if (start) return { labels, origin, stmt: { kind: "start", expr: start[1] as string } };
	}
	return { labels, origin, stmt: { kind: "word", expr: body } };
}

type Term = { sign: 1 | -1; op: "add" | "or"; kind: "num" | "sym" | "dot" | "lit"; text: string };

function tokenize(expr: string, dialect: Dialect): Term[] {
	const terms: Term[] = [];
	let k = 0;
	let sign: 1 | -1 = 1;
	let op: Term["op"] = "add";
	const push = (kind: Term["kind"], text: string): void => {
		terms.push({ sign, op, kind, text });
		sign = 1;
		op = "add";
	};
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
		if (c === "!") {
			op = "or";
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
			push("lit", expr.slice(k + 1, j).trim());
			k = j + 1;
			continue;
		}
		if (c === "." || (c === "," && dialect.commaIsDot)) {
			push("dot", ".");
			k += 1;
			continue;
		}
		const m = expr.slice(k).match(/^[a-z0-9]+/);
		if (!m) throw new Error(`bad character '${c}' in "${expr}"`);
		const text = m[0];
		push(/^[0-9]/.test(text) ? "num" : "sym", text);
		k += text.length;
	}
	return terms;
}

/** Type 340 vector word: escape/intensify from the modifiers, dy and dx sign-magnitude. */
function vectorWord(mods: number, dx: number, dy: number): number {
	const mag = (v: number) => Math.min(Math.abs(v), 0o177);
	return (mods | (dy < 0 ? 0o100000 : 0) | (mag(dy) << 8) | (dx < 0 ? 0o200 : 0) | mag(dx)) & M;
}

/** Assemble one or more tapes into one program. Never throws: problems go to `errors`. */
export function assemble(tapes: readonly AsmTape[], opts: AsmOpts = {}): AsmResult {
	const dialect: Dialect = typeof opts.dialect === "object" ? opts.dialect : DIALECTS[opts.dialect ?? "dec"] ?? DEC_1964;
	const origin0 = opts.origin ?? DEFAULT_ORIGIN;
	const errors: string[] = [];
	const perm = new Map<string, number>(Object.entries({ ...PDP7_SYMBOLS, ...dialect.symbols, ...(opts.symbols ?? {}) }));
	const display = new Map<string, number>(Object.entries(DISPLAY_SYMBOLS));
	const user = new Map<string, number>();
	// First use, in source order; the Cambridge assembler allocates variables in this order.
	const referenced = new Map<string, number>();
	const refer = (name: string): void => {
		if (!referenced.has(name)) referenced.set(name, referenced.size);
	};
	// "." in a literal is the referring word's location (OUTNOX: lac (jmp .+4), so those are per site.
	const litKey = (text: string, loc: number): string => (/[.,]/.test(text) ? `${text}@${loc}` : text);
	const literalSites = new Map<string, { text: string; loc: number; disp: boolean }>();
	const parsed: Parsed[] = [];

	let disp = false;
	for (const tape of tapes) {
		const lines = tape.text.split("\n");
		for (let n = 0; n < lines.length; n += 1) {
			const source = lines[n] as string;
			const at = { tape: tape.name, line: n + 1, source };
			try {
				const { labels, origin, originAfterLabels, stmt } = parseLine(source.toLowerCase(), dialect);
				if (dialect.display && stmt.kind === "word") {
					const op = stmt.expr.trim();
					if (op === "disp" || op === "nodisp" || op === "pause") {
						if (op === "disp") disp = true;
						if (op === "nodisp") disp = false;
						parsed.push({ ...at, labels, origin, originAfterLabels, stmt: { kind: "none" }, disp, endsSegment: op === "pause" });
						continue;
					}
				}
				parsed.push({ ...at, labels, origin, originAfterLabels, stmt, disp, endsSegment: false });
				if (stmt.kind === "start") break;
			} catch (e) {
				errors.push(`${tape.name}:${n + 1}: ${(e as Error).message}`);
			}
		}
	}

	const lookup = (name: string, inDisp: boolean): number | undefined =>
		user.get(name) ?? (inDisp ? display.get(name) : undefined) ?? perm.get(name);

	const termValue = (
		t: Term,
		loc: number,
		where: string,
		pass: 1 | 2,
		inDisp: boolean,
		litAddr?: (key: string) => number,
	): number => {
		if (t.kind === "num") {
			if (/[89]/.test(t.text)) throw new Error(`non-octal digit in ${t.text}`);
			return Number.parseInt(t.text, 8) & M;
		}
		if (t.kind === "dot") return loc;
		if (t.kind === "lit") {
			const key = litKey(t.text, loc);
			if (pass === 1) {
				if (!literalSites.has(key)) literalSites.set(key, { text: t.text, loc, disp: inDisp });
				for (const s of tokenize(t.text, dialect)) if (s.kind === "sym") refer(s.text);
				return 0;
			}
			return litAddr ? litAddr(key) : 0;
		}
		refer(t.text);
		const s = lookup(t.text, inDisp);
		if (s === undefined) {
			if (pass === 2) throw new Error(`undefined symbol ${t.text} in ${where}`);
			return 0;
		}
		return s;
	};

	const evaluate = (
		expr: string,
		loc: number,
		where: string,
		pass: 1 | 2,
		inDisp: boolean,
		litAddr?: (key: string) => number,
	): number => {
		const terms = tokenize(expr, dialect);
		if (inDisp && terms[0]?.kind === "sym" && terms[0].text === "vec" && terms.length >= 3) {
			const signed = (t: Term) => {
				const x = termValue(t, loc, where, pass, inDisp, litAddr);
				return t.sign === 1 ? x : -x;
			};
			let mods = 0;
			for (const t of terms.slice(1, -2)) mods = ocAdd(mods, termValue(t, loc, where, pass, inDisp, litAddr));
			return vectorWord(mods, signed(terms[terms.length - 2] as Term), signed(terms[terms.length - 1] as Term));
		}
		let v = 0;
		for (const t of terms) {
			const x = termValue(t, loc, where, pass, inDisp, litAddr);
			if (t.op === "or") v |= t.sign === 1 ? x : ocNeg(x);
			else v = ocAdd(v, t.sign === 1 ? x : ocNeg(x));
		}
		return v;
	};

	const setOrigin = (p: Parsed, loc: number, pass: 1 | 2, litAddr?: (key: string) => number): number =>
		p.origin === null ? loc : evaluate(p.origin, loc, `${p.tape}:${p.line}`, pass, p.disp, litAddr) & 0o17777;

	let loc = origin0;
	for (const p of parsed) {
		const where = `${p.tape}:${p.line}`;
		try {
			if (!p.originAfterLabels) loc = setOrigin(p, loc, 1);
			for (const l of p.labels) {
				const v = l.plus === null ? loc : ocAdd(evaluate(l.plus, loc, where, 1, p.disp), loc);
				if (user.has(l.name) && user.get(l.name) !== v) errors.push(`${where}: ${l.name} defined twice`);
				user.set(l.name, v);
			}
			if (p.originAfterLabels) loc = setOrigin(p, loc, 1);
			const s = p.stmt;
			if (s.kind === "assign") user.set(s.name, evaluate(s.expr, loc, where, 1, p.disp));
			else if (s.kind === "word") evaluate(s.expr, loc, where, 1, p.disp);
			else if (s.kind === "start" && s.expr) evaluate(s.expr, loc, where, 1, p.disp);
		} catch (e) {
			errors.push(`${where}: ${(e as Error).message}`);
		}
		loc = (loc + stmtWords(p.stmt)) & 0o17777;
	}

	const literals: AsmResult["literals"] = [];
	const litIndex = new Map<string, number>();
	const litSite = new Map<number, { loc: number; disp: boolean }>();
	const placeLiterals = (): void => {
		for (const [key, site] of literalSites) {
			litIndex.set(key, loc);
			litSite.set(loc, site);
			literals.push({ addr: loc, text: site.text, word: 0 });
			loc = (loc + 1) & 0o17777;
		}
	};
	const variables: AsmResult["variables"] = [];
	const placeVariables = (): void => {
		const names = [...referenced.keys()];
		if (dialect.variableOrder === "alphabetical") names.sort();
		for (const name of names) {
			if (lookup(name, false) !== undefined || display.has(name)) continue;
			user.set(name, loc);
			variables.push({ name, addr: loc });
			loc = (loc + 1) & 0o17777;
		}
	};
	if (dialect.variablesFirst) {
		placeVariables();
		placeLiterals();
	} else {
		placeLiterals();
		placeVariables();
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
	loc = origin0;
	for (const p of parsed) {
		const where = `${p.tape}:${p.line}`;
		const s = p.stmt;
		let addr: number | null = null;
		let word: number | null = null;
		let emitted: number[] = [];
		try {
			loc = setOrigin(p, loc, 2, litAddr);
			if (s.kind === "assign") user.set(s.name, evaluate(s.expr, loc, where, 2, p.disp, litAddr));
			else if (s.kind === "start" && s.expr) start = evaluate(s.expr, loc, where, 2, p.disp, litAddr) & 0o17777;
			else if (s.kind === "word") {
				addr = loc;
				word = evaluate(s.expr, loc, where, 2, p.disp, litAddr);
			} else if (s.kind === "text") {
				addr = loc;
				emitted = s.chars;
				for (const c of s.chars) {
					put(loc, c, where);
					loc = (loc + 1) & 0o17777;
				}
			}
		} catch (e) {
			errors.push(`${where}: ${(e as Error).message}`);
			if (s.kind === "word") {
				addr = loc;
				word = 0;
			}
		}
		if (addr !== null && word !== null) {
			put(addr, word, where);
			emitted = [word];
			loc = (loc + 1) & 0o17777;
		}
		listing.push({ tape: p.tape, line: p.line, addr, word, words: emitted, source: p.source, ...(p.endsSegment ? { endsSegment: true } : {}) });
	}
	for (const lit of literals) {
		const site = litSite.get(lit.addr) ?? { loc: lit.addr, disp: false };
		try {
			lit.word = evaluate(lit.text, site.loc, `literal (${lit.text})`, 2, site.disp, litAddr);
		} catch (e) {
			errors.push((e as Error).message);
		}
		put(lit.addr, lit.word, `literal (${lit.text})`);
	}
	for (const v of variables) put(v.addr, 0, `variable ${v.name}`);

	return {
		machine: PDP7,
		words: [...words.entries()].sort((a, b) => a[0] - b[0]),
		symbols: user,
		literals,
		variables,
		listing,
		errors,
		start,
	};
}
