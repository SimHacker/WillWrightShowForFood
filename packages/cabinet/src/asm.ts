import type { Cpu } from "./bus.js";

/**
 * PDP-4/PDP-7 assembler. Two passes, two dialects.
 *
 * `dec` is the dialect of DEC's 1964 program library listings
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
 *
 * Literals go after the last tape, then one word for each symbol that
 * was used and never defined, in alphabetical order: the listings rely on
 * this for their temporaries (OUTNOX never defines t1x..t69x).
 *
 * `cambridge` is the Cambridge University CAD Group Assembler that built
 * PIXIE on Titan in 1972, read off its listing. On top of `dec`:
 *
 *   ,              inside an operand, the location counter (JMP , 3)
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

export type Dialect = "dec" | "cambridge";

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
	rcr: 0o744020, cla: 0o750000, clc: 0o750001, las: 0o750004,
	glk: 0o750010, lam: 0o777777,
	// Program interrupt, clock, console.
	ion: 0o700042, iof: 0o700002, caf: 0o703302,
	clsf: 0o700001, clof: 0o700004, clon: 0o700044,
	rsf: 0o700101, rrb: 0o700112, rsa: 0o700104,
	psf: 0o700201, pcf: 0o700202, psa: 0o700204,
	ksf: 0o700301, krb: 0o700312, krs: 0o700322,
	tsf: 0o700401, tcf: 0o700402, tls: 0o700406,
	// Type 340 display.
	idsi: 0o700601, idla: 0o700606, idrs: 0o700504, idve: 0o700501,
	idsp: 0o700701, idrc: 0o700712, idhe: 0o701001,
	// Type 177 extended arithmetic element.
	osc: 0o640001, omq: 0o640002, cmq: 0o640004, lacs: 0o641001,
	lacq: 0o641002, abs: 0o644000, gsm: 0o664000, clq: 0o650000,
	lmq: 0o652000, mul: 0o653122, muls: 0o657122, div: 0o640323,
	divs: 0o644323, idiv: 0o653323, idivs: 0o657323, frdiv: 0o650323,
	frdivs: 0o654323, norm: 0o640444, norms: 0o660444, lrs: 0o640500,
	lrss: 0o660500, lls: 0o640600, llss: 0o660600, als: 0o640700,
	alss: 0o660700,
};

/**
 * The Cambridge link to Titan, devices 22 and 23 (see plugins/tiny-titan.ts).
 * LLAM, LLB18 and LKE appear in the listing only OR'd with another name
 * (LRB18!LLAM 702276, LLB18!LLAM 702264, LKE!LLB6 702364); their own values
 * are the smallest that give those words.
 */
export const CAMBRIDGE_SYMBOLS: Readonly<Record<string, number>> = {
	lsf: 0o702201, lcf: 0o702222, llam: 0o702224, llb18: 0o702240,
	lrb18: 0o702252, lsa: 0o702301, lke: 0o702320, lkd: 0o702322,
	llb6: 0o702344,
};

/**
 * Type 340 display words after DISP, as the 1972 listing assembles them.
 * Word types: PAR (parameter) and POH are 0, POV and DDS 200000, DJP
 * 400000, DJS 600000; VEC is 0 and takes dx dy. The next-mode fields:
 * PA parameter, PO point, VE vector, CH character, SB subroutine (mode 7).
 * PN/PF light pen on/off, SCn scale n, INn intensity n, ES escape.
 */
export const DISPLAY_SYMBOLS: Readonly<Record<string, number>> = {
	par: 0o000000, poh: 0o000000, pov: 0o200000, dds: 0o200000,
	djp: 0o400000, djs: 0o600000, vec: 0o000000,
	pa: 0o000000, po: 0o020000, ve: 0o100000, ch: 0o060000, sb: 0o160000,
	pn: 0o014000, pf: 0o010000, es: 0o400000,
	sc0: 0o100, sc1: 0o120, sc2: 0o140, sc3: 0o160,
	in0: 0o10, in1: 0o11, in2: 0o12, in3: 0o13, in4: 0o14, in5: 0o15, in6: 0o16, in7: 0o17,
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

export type AsmOpts = {
	dialect?: Dialect;
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
	| { kind: "none" };

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
			dialect === "cambridge" ? new RegExp(`^\\s*(${NAME})(?:=([a-z0-9+\\- ]+))?,`) : new RegExp(`^\\s*(${NAME}),`),
		);
		if (!m) break;
		labels.push({ name: m[1] as string, plus: m[2]?.trim() || null });
		rest = rest.slice(m[0].length);
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
	if (dialect === "dec") {
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
		if (c === "." || (c === "," && dialect === "cambridge")) {
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
	const dialect: Dialect = opts.dialect ?? "dec";
	const origin0 = opts.origin ?? DEFAULT_ORIGIN;
	const errors: string[] = [];
	const perm = new Map<string, number>(
		Object.entries({ ...PDP7_SYMBOLS, ...(dialect === "cambridge" ? CAMBRIDGE_SYMBOLS : {}), ...(opts.symbols ?? {}) }),
	);
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
			try {
				const { labels, origin, originAfterLabels, stmt } = parseLine(source.toLowerCase(), dialect);
				if (dialect === "cambridge" && stmt.kind === "word") {
					const op = stmt.expr.trim();
					if (op === "disp" || op === "nodisp" || op === "pause") {
						if (op === "disp") disp = true;
						if (op === "nodisp") disp = false;
						parsed.push({ tape: tape.name, line: n + 1, source, labels, origin, originAfterLabels, stmt: { kind: "none" }, disp });
						continue;
					}
				}
				parsed.push({ tape: tape.name, line: n + 1, source, labels, origin, originAfterLabels, stmt, disp });
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
		if (p.stmt.kind === "word") loc = (loc + 1) & 0o17777;
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
		if (dialect === "dec") names.sort();
		for (const name of names) {
			if (lookup(name, false) !== undefined || display.has(name)) continue;
			user.set(name, loc);
			variables.push({ name, addr: loc });
			loc = (loc + 1) & 0o17777;
		}
	};
	if (dialect === "cambridge") {
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
		try {
			loc = setOrigin(p, loc, 2, litAddr);
			if (s.kind === "assign") user.set(s.name, evaluate(s.expr, loc, where, 2, p.disp, litAddr));
			else if (s.kind === "start" && s.expr) start = evaluate(s.expr, loc, where, 2, p.disp, litAddr) & 0o17777;
			else if (s.kind === "word") {
				addr = loc;
				word = evaluate(s.expr, loc, where, 2, p.disp, litAddr);
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
			loc = (loc + 1) & 0o17777;
		}
		listing.push({ tape: p.tape, line: p.line, addr, word, source: p.source });
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
