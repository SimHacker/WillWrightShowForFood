import type { AsmResult, AsmTape } from "./core.js";
import { assembleAs7, BUILTIN_OPS, SYSCALLS } from "./as7.js";
import { CAMBRIDGE_1972, type Dialect, type Term, assemble, parseLine, tokenize } from "./dec.js";
import { DISPLAY_SYMBOLS, PDP7_SYMBOLS } from "./pdp7.js";

/**
 * Cambridge 1972 source to `as7` source, symbol for symbol. Each word keeps its
 * expression; the choice between as7's OR (a space) and add, and the ±1 that
 * ones' complement needs, is made by checking every step against the Cambridge
 * value. The result is assembled and compared with the Cambridge image word for word.
 */

const M = 0o777777;
const ocAdd = (a: number, b: number): number => {
	const s = (a & M) + (b & M);
	return s > M ? (s + 1) & M : s;
};
const ocNeg = (a: number): number => ~a & M;
const oct = (n: number): string => (n === 0 ? "0" : `0${n.toString(8)}`);

export type CambridgeToAs7Opts = {
	/** Starts every name the program defines, keeping it apart from as7's and other tapes'. */
	prefix: string;
	origin?: number;
	dialect?: Dialect;
	/** Names other tapes in the same as7 run define (sop.s, the Forth kernel). */
	reserved?: Iterable<string>;
};

export type CambridgeToAs7 = {
	text: string;
	cambridge: ReturnType<typeof assemble>;
	as7: AsmResult;
	/** Words written as octal because no expression in as7 gives the Cambridge value. */
	numeric: string[];
	/** Addresses where as7 and Cambridge disagree; empty when the translation is exact. */
	mismatches: string[];
};

type Op = "|" | "+" | "-";
type Syl = { text: string | null; value: number };

export function cambridgeToAs7(tapes: readonly AsmTape[], opts: CambridgeToAs7Opts): CambridgeToAs7 {
	const dialect = opts.dialect ?? CAMBRIDGE_1972;
	const prefix = opts.prefix;
	const cam = assemble(tapes, { dialect, origin: opts.origin ?? 0o22 });
	if (cam.errors.length) throw new Error(`Cambridge source has errors:\n${cam.errors.join("\n")}`);

	const perm = new Map<string, number>(Object.entries({ ...PDP7_SYMBOLS, ...dialect.symbols }));
	const display = new Map<string, number>(Object.entries(DISPLAY_SYMBOLS));
	const reserved = new Set<string>([...Object.keys(BUILTIN_OPS), ...Object.keys(SYSCALLS), ...(opts.reserved ?? [])]);
	const rows = new Map(cam.listing.map((l) => [`${l.tape}:${l.line}`, l]));

	type Parsed = { tape: string; line: number; raw: string; p: ReturnType<typeof parseLine> };
	const lines: Parsed[] = [];
	for (const tape of tapes) {
		tape.text.split("\n").forEach((raw, n) => lines.push({ tape: tape.name, line: n + 1, raw, p: parseLine(raw.toLowerCase(), dialect) }));
	}

	// Names the program defines: labels, assignments, variables. Aliases (FINDP=JMS,) are a label plus an opcode.
	const aliases = new Map<string, string>();
	const labels = new Set<string>();
	const assigned = new Set<string>();
	const firstValue = new Map<string, number>();
	for (const a of cam.assignments) if (!firstValue.has(a.name)) firstValue.set(a.name, a.value);
	for (const { p } of lines) {
		for (const l of p.labels) {
			labels.add(l.name);
			if (l.plus) aliases.set(l.name, l.plus.trim());
		}
		if (p.stmt.kind === "assign") {
			const t = tokenize(p.stmt.expr, dialect);
			if (t.length === 2 && t[0]?.kind === "sym" && t[1]?.kind === "dot") aliases.set(p.stmt.name, t[0].text);
			else assigned.add(p.stmt.name);
		}
	}
	const variables = new Set(cam.variables.map((v) => v.name));
	const defined = new Set([...labels, ...assigned, ...aliases.keys(), ...variables]);

	// Permanent and display names are written as themselves, defined once at the top unless as7 knows them.
	const prelude = new Map<string, number>();
	const permName = (name: string, value: number): string => {
		if (BUILTIN_OPS[name] === value) return name;
		const had = prelude.get(name);
		if (had !== undefined && had !== value) throw new Error(`${name} means ${oct(had)} and ${oct(value)}`);
		prelude.set(name, value);
		return name;
	};
	for (const [name, value] of [...perm, ...display]) if (!(BUILTIN_OPS[name] === value)) reserved.add(name);

	const names = new Map<string, string>();
	const taken = new Set<string>();
	for (const name of defined) {
		let as7 = `${prefix}${name}`;
		if (reserved.has(as7) || taken.has(as7.slice(0, 8))) as7 = `${as7}_`;
		if (as7.length > 8 || reserved.has(as7) || taken.has(as7)) throw new Error(`no as7 name for ${name}`);
		taken.add(as7);
		names.set(name, as7);
	}
	const poolLabel = new Map(cam.literals.map((lit, k) => [lit.addr, `${prefix}lit${k.toString(8).padStart(3, "0")}`]));
	for (const label of poolLabel.values()) if (taken.has(label) || reserved.has(label)) throw new Error(`pool label ${label} is taken`);

	// Plain addresses, for writing a literal's "." as label+offset.
	const labelAt: Array<[number, string]> = [];
	for (const name of labels) {
		if (aliases.has(name)) continue;
		const v = cam.symbols.get(name);
		if (v !== undefined) labelAt.push([v, names.get(name) as string]);
	}
	labelAt.sort((a, b) => a[0] - b[0]);
	const addressSyl = (addr: number): Syl[] => {
		let best: [number, string] | undefined;
		for (const e of labelAt) if (e[0] <= addr) best = e;
		if (!best) return [{ text: null, value: addr }];
		return addr === best[0] ? [{ text: best[1], value: addr }] : [{ text: best[1], value: best[0] }, { text: null, value: addr - best[0] }];
	};

	const current = new Map(firstValue);
	const opValue = (op: string): number => {
		const v = perm.get(op);
		if (v === undefined) throw new Error(`alias opcode ${op} unknown`);
		return v;
	};

	/** One Cambridge term as as7 syllables, ORed or added together, plus its Cambridge value. */
	const termSyls = (t: Term, loc: number, inDisp: boolean, lits: number[], next?: Term): { value: number; syls: Syl[]; or: boolean } => {
		if (t.kind === "num") {
			const v = Number.parseInt(t.text, 8) & M;
			return { value: v, syls: [{ text: null, value: v }], or: true };
		}
		if (t.kind === "dot") return { value: loc, syls: [{ text: ".", value: loc }], or: true };
		if (t.kind === "lit") {
			const addr = lits.shift();
			if (addr === undefined) throw new Error(`literal (${t.text} has no pool word`);
			return { value: addr, syls: [{ text: poolLabel.get(addr) as string, value: addr }], or: true };
		}
		const name = t.text;
		const alias = aliases.get(name);
		// `SETUP=JMS` / `SETUP-JMS` in an operand: the label alone, the opcode taken off by the next term.
		if (alias !== undefined && next?.kind === "sym" && next.sign === -1 && next.text === alias) {
			const v = cam.symbols.get(name) as number;
			skip.add(next);
			return { value: ocAdd(v, ocNeg(opValue(alias))), syls: [{ text: names.get(name) as string, value: (v - opValue(alias)) & M }], or: true };
		}
		if (alias !== undefined) {
			const v = cam.symbols.get(name) as number;
			const ov = opValue(alias);
			return { value: v, syls: [{ text: permName(alias, ov), value: ov }, { text: names.get(name) as string, value: (v - ov) & M }], or: true };
		}
		if (defined.has(name)) {
			const v = current.get(name) ?? cam.symbols.get(name);
			if (v === undefined) throw new Error(`${name} has no value`);
			return { value: v, syls: [{ text: names.get(name) as string, value: v }], or: true };
		}
		if (inDisp && display.has(name)) {
			const v = display.get(name) as number;
			return { value: v, syls: [{ text: permName(name, v), value: v }], or: true };
		}
		const v = perm.get(name);
		if (v === undefined) throw new Error(`${name} undefined`);
		return { value: v, syls: [{ text: permName(name, v), value: v }], or: true };
	};

	const apply = (av: number, op: Op, v: number): number => (op === "|" ? av | v : op === "+" ? (av + v) & M : (av - v) & M);

	const skip = new Set<Term>();

	/** Render terms so that as7, left to right, reaches the Cambridge value at every step. */
	const render = (terms: Term[], loc: number, inDisp: boolean, lits: number[]): { text: string; value: number } | null => {
		let cv = 0;
		let av = 0;
		const out: Array<{ op: Op; syl: Syl }> = [];
		for (const [k, t] of terms.entries()) {
			if (skip.delete(t)) continue;
			const { value, syls } = termSyls(t, loc, inDisp, lits, terms[k + 1]);
			cv = t.op === "or" ? cv | (t.sign === 1 ? value : ocNeg(value)) : ocAdd(cv, t.sign === 1 ? value : ocNeg(value));
			const disjoint = syls.every((s, k) => (s.value & (av | syls.slice(0, k).reduce((a, x) => a | x.value, 0))) === 0);
			const candidates: Array<{ op: Op; adj: number }> =
				t.sign === -1
					? [{ op: "-", adj: 0 }, { op: "-", adj: -1 }, { op: "-", adj: 1 }]
					: [...(disjoint || t.op === "or" ? [{ op: "|" as Op, adj: 0 }] : []), { op: "+", adj: 0 }, { op: "+", adj: 1 }];
			const hit = candidates.find(({ op, adj }) => ((syls.reduce((a, s) => apply(a, op, s.value), av) + adj) & M) === cv);
			if (!hit) return null;
			const last = syls.length - 1;
			syls.forEach((s, k) => {
				let syl = s;
				if (k === last && hit.adj !== 0 && s.text === null) {
					syl = { text: null, value: s.value + (hit.op === "-" ? -hit.adj : hit.adj) };
				} else if (k === last && hit.adj !== 0) {
					out.push({ op: hit.op, syl: s });
					out.push({ op: hit.adj > 0 ? "+" : "-", syl: { text: null, value: 1 } });
					return;
				}
				out.push({ op: hit.op, syl });
			});
			av = cv;
		}
		const text = out
			.map(({ op, syl }, k) => {
				const s = syl.text ?? oct(syl.value);
				return op === "|" ? (k === 0 ? s : ` ${s}`) : `${op}${s}`;
			})
			.join("");
		return { text, value: av };
	};

	const numeric: string[] = [];
	const statementFor = (expr: string, loc: number, inDisp: boolean, lits: number[], want: number, where: string): string => {
		const terms = tokenize(expr, dialect);
		const head = terms[0]?.kind === "sym" ? terms[0].text : "";
		if (inDisp && head === "vec" && terms.length >= 3) {
			const coords = terms.slice(1);
			let mods = 0;
			const modNames: string[] = [];
			while (coords[0]?.kind === "sym" && display.has(coords[0].text)) {
				const name = (coords.shift() as Term).text;
				mods |= display.get(name) as number;
				modNames.push(permName(name, display.get(name) as number));
			}
			if ((want & mods) === mods) return [...modNames, oct(want & ~mods & M)].join(" ");
		} else if (head === "law" && terms.length > 1) {
			const operand = render(terms.slice(1), loc, inDisp, [...lits]);
			const masked = want & 0o17777;
			if (operand && operand.value === masked && !operand.text.startsWith("-")) return `law ${operand.text}`;
			// LAW -n: Cambridge keeps the operand to 13 bits; as7 has no field, so write 017777-n.
			if (operand && (operand.value & 0o17777) === masked && operand.text.startsWith("-")) {
				const inner = render(terms.slice(1).map((t) => ({ ...t, sign: (t.sign === 1 ? -1 : 1) as 1 | -1 })), loc, inDisp, [...lits]);
				if (inner && ((0o17777 - inner.value) & M) === masked && !inner.text.startsWith("-")) return `law 017777-${inner.text}`;
			}
			if (operand && (operand.value & 0o17777) === masked) return `law ${oct(masked)}`;
			numeric.push(where);
			return `law ${oct(masked)}`;
		} else {
			const r = render(terms, loc, inDisp, lits);
			if (r && r.value === want) return r.text;
		}
		numeric.push(where);
		return oct(want);
	};

	const out: string[] = [];
	const hoisted: string[] = [];
	const body: string[] = [];
	const firstUse = new Map<string, number>();
	lines.forEach(({ p }, k) => {
		const exprs = [p.stmt.kind === "word" || p.stmt.kind === "assign" ? p.stmt.expr : "", p.origin ?? ""];
		for (const e of exprs) {
			for (const t of e ? tokenize(e, dialect) : []) {
				const syms = t.kind === "lit" ? tokenize(t.text, dialect).filter((x) => x.kind === "sym") : t.kind === "sym" ? [t] : [];
				for (const s of syms) if (!firstUse.has(s.text)) firstUse.set(s.text, k);
			}
		}
	});
	const assignedAt = new Map<string, number>();
	lines.forEach(({ p }, k) => {
		if (p.stmt.kind === "assign" && assigned.has(p.stmt.name) && !assignedAt.has(p.stmt.name)) assignedAt.set(p.stmt.name, k);
	});

	let disp = false;
	let loc = opts.origin ?? 0o22;
	let started = false;
	const assignmentsByLine = new Map(cam.assignments.map((a) => [`${a.tape}:${a.line}`, a]));
	const usesByLine = new Map<string, number[]>();
	for (const u of cam.literalUses) usesByLine.set(u.where, [...(usesByLine.get(u.where) ?? []), u.addr]);
	const comment = (raw: string, at: number | null): string => (at === null ? "" : raw.slice(at + 1).trimEnd());
	const emit = (code: string, note: string): void => {
		if (!code) body.push(note ? `" ${note}` : "");
		else body.push(note ? `${code.padEnd(36)}" ${note}` : code);
	};

	lines.forEach(({ tape, line, raw, p }, k) => {
		const where = `${tape}:${line}`;
		const row = rows.get(where);
		const note = comment(raw, p.commentAt);
		const lits = [...(usesByLine.get(where) ?? [])];
		const expr = p.stmt.kind === "word" ? p.stmt.expr.trim() : "";
		if (expr === "disp" || expr === "nodisp" || expr === "pause") {
			if (expr === "disp") disp = true;
			if (expr === "nodisp") disp = false;
			emit("", `${expr}${note ? ` ${note}` : ""}`);
			return;
		}
		if (p.stmt.kind === "word" && row?.addr === null) {
			emit("", `variable ${p.stmt.expr.trim()}${note ? ` ${note}` : ""}`);
			return;
		}
		const parts: string[] = [];
		const originCode = (origin: string): string => {
			const target = row?.addr ?? null;
			const r = render(tokenize(origin, dialect), loc, disp, lits);
			if (!r) throw new Error(`${where}: origin ${origin} has no as7 form`);
			loc = r.value & 0o17777;
			if (target !== null && p.stmt.kind === "word" && target !== loc) throw new Error(`${where}: origin went to ${oct(loc)}, Cambridge ${oct(target)}`);
			started = true;
			return `.=${r.text}`;
		};
		if (p.origin !== null && !p.originAfterLabels) body.push(originCode(p.origin));
		const defines = p.stmt.kind === "word" || p.labels.length > 0 || (p.stmt.kind === "assign" && aliases.has(p.stmt.name));
		if (!started && defines) {
			body.push(`.=${oct(loc)}`);
			started = true;
		}
		for (const l of p.labels) parts.push(`${names.get(l.name)}:`);
		if (p.origin !== null && p.originAfterLabels) parts.push(originCode(p.origin));
		if (p.stmt.kind === "assign") {
			const name = p.stmt.name;
			if (aliases.has(name)) parts.push(`${names.get(name)}:`);
			else {
				const value = (assignmentsByLine.get(where) as { value: number }).value;
				const r = render(tokenize(p.stmt.expr, dialect), loc, disp, lits);
				if (!r || r.value !== value) throw new Error(`${where}: ${name}=${p.stmt.expr} has no as7 form`);
				current.set(name, value);
				const text = `${names.get(name)}=${r.text}`;
				parts.push(text);
				if ((firstUse.get(name) ?? Infinity) < (assignedAt.get(name) ?? -1) && assignedAt.get(name) === k) {
					hoisted.push(`${text.padEnd(36)}" used before line ${line} of ${tape}`);
				}
			}
		} else if (p.stmt.kind === "word" && row && row.addr !== null && row.word !== null) {
			if (row.addr !== loc) throw new Error(`${where}: as7 at ${oct(loc)}, Cambridge at ${oct(row.addr)}`);
			parts.push(statementFor(p.stmt.expr, row.addr, disp, lits, row.word, where));
			loc = (loc + 1) & 0o17777;
		}
		emit(parts.join(" "), note);
	});

	const variablesAt = cam.variables[0]?.addr;
	if (variablesAt !== undefined && variablesAt !== loc) body.push(`.=${oct(variablesAt)}`);
	body.push('" variables, in order of first use');
	for (const v of cam.variables) body.push(`${names.get(v.name)}: 0`);
	body.push('" literals');
	for (const lit of [...cam.literals].sort((a, b) => a.addr - b.addr)) {
		const site = cam.literalSites.get(lit.addr) ?? { loc: lit.addr, disp: false };
		const terms = tokenize(lit.text, dialect);
		const hasDot = terms.some((t) => t.kind === "dot");
		let code: string;
		if (hasDot) {
			const syl = addressSyl(site.loc);
			const dotTerm = syl.map((s) => s.text ?? oct(s.value)).join("+");
			const r = render(terms.filter((t) => t.kind !== "dot"), site.loc, site.disp, []);
			code = r ? `${dotTerm}${r.text.startsWith("-") ? "" : "+"}${r.text}` : oct(lit.word);
		} else {
			code = statementFor(lit.text, site.loc, site.disp, [], lit.word, `literal ${oct(lit.addr)}`);
		}
		body.push(`${`${poolLabel.get(lit.addr)}: ${code}`.padEnd(36)}" (${lit.text}`);
	}

	if (prelude.size) {
		out.push('" names as7 does not know, as the Cambridge assembler defined them');
		for (const [name, value] of [...prelude].sort()) out.push(`${name}=${oct(value)}`);
	}
	if (hoisted.length) {
		out.push('" assignments used before they are made: Titan gave forward references the first value');
		out.push(...hoisted);
	}
	const text = `${[...out, ...body].join("\n")}\n`;

	const as7 = assembleAs7([{ name: tapes.map((t) => t.name.replace(/\.asm$/, ".s")).join("+"), text }], { base: 0 });
	const want = new Map(cam.words);
	const got = new Map(as7.words);
	const mismatches: string[] = [...as7.errors];
	for (const a of new Set([...want.keys(), ...got.keys()])) {
		if (want.get(a) !== got.get(a)) mismatches.push(`${oct(a)}: as7 ${oct(got.get(a) ?? 0)}, Cambridge ${oct(want.get(a) ?? 0)}`);
	}
	return { text, cambridge: cam, as7, numeric, mismatches };
}
