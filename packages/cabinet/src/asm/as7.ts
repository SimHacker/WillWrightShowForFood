import type { AsmLine, AsmResult, AsmTape } from "./core.js";
import { PDP7 } from "./pdp7.js";

/**
 * Ken Thompson's `as`, the PDP-7 UNIX assembler, as pdp7-unix's `as7` reads it and as Mitch
 * Bradley's Forth is written in. A front end on the shared back end (core.ts). Written here from
 * the language; pdp7-unix's Perl `as7` (GPL) is the oracle it is tested against, not its source.
 *
 *   name:          a label; several may start a line. `1:` is a relative label, found by `1f`
 *                  (the next one after here) and `1b` (the last one before here)
 *   name = expr    an assignment; `.=expr` moves the location counter
 *   expr           a word, at `.`; `;` separates statements on a line
 *   " text         a comment
 *   a b            juxtaposition ORs; `+a` adds and `-a` subtracts, 18-bit two's complement
 *   0123           octal (a leading 0); 123 is decimal
 *   <c  c>  >c     a character: <c is its code shifted left 9, c> and >c the code itself
 *   @local name    the name is local to this file, as is any label starting with L
 *
 * Labels are cut to 8 characters. Names given by assignment, which is how `sop.s` defines the
 * opcodes, win over labels of the same name. `.` starts relative (0 plus the flag); `..`, 4096,
 * is added to relative locations and words when they are placed. Mitch's kernel sets `.=010`
 * first, so everything in it is absolute.
 */

const M = 0o777777;

type Value = { v: number; rel: boolean };

/** Built in, before any tape: the relocation base and UNIX's system call numbers. */
export const SYSCALLS: Record<string, number> = {
	save: 1, getuid: 2, open: 3, read: 4, write: 5, creat: 6, seek: 7, tell: 8, close: 9, link: 10,
	unlink: 11, setuid: 12, rename: 13, exit: 14, time: 15, intrp: 16, chdir: 17, chmod: 18,
	chown: 19, sysloc: 21, capt: 23, rele: 24, status: 25, smes: 27, rmes: 28, fork: 29,
};

/** The instructions `as7` knows without `sop.s`: memory reference, EAE, operate. */
export const BUILTIN_OPS: Record<string, number> = {
	sys: 0o020000, i: 0o020000,
	dac: 0o040000, jms: 0o100000, dzm: 0o140000, lac: 0o200000, xor: 0o240000, add: 0o300000,
	tad: 0o340000, xct: 0o400000, isz: 0o440000, and: 0o500000, sad: 0o540000, jmp: 0o600000,
	eae: 0o640000, osc: 0o640001, omq: 0o640002, cmq: 0o640004, div: 0o640323, norm: 0o640444,
	lls: 0o640600, clls: 0o641600, als: 0o640700, lrs: 0o640500, ecla: 0o641000, lacs: 0o641001,
	lacq: 0o641002, abs: 0o644000, divs: 0o644323, clq: 0o650000, frdiv: 0o650323, lmq: 0o652000,
	mul: 0o653122, idiv: 0o653323, idivs: 0o657323, frdivs: 0o654323, muls: 0o657122,
	norms: 0o660444, gsm: 0o664000, lrss: 0o660500, llss: 0o660600, alss: 0o660700,
	opr: 0o740000, nop: 0o740000, cma: 0o740001, cml: 0o740002, oas: 0o740004, ral: 0o740010,
	rar: 0o740020, hlt: 0o740040, xx: 0o740040, sma: 0o740100, sza: 0o740200, snl: 0o740400,
	skp: 0o741000, spa: 0o741100, sna: 0o741200, szl: 0o741400, rtl: 0o742010, rtr: 0o742020,
	cll: 0o744000, stl: 0o744002, rcl: 0o744010, rcr: 0o744020, cla: 0o750000, clc: 0o750001,
	las: 0o750004, glk: 0o750010, law: 0o760000,
};

export type As7Opts = {
	/** Where relative locations and words are moved to. Default 4096, as in `as7`. */
	base?: number;
};

/** Assemble tapes in order, as `as7 a.s b.s ...` does. Never throws: problems go to `errors`. */
export function assembleAs7(tapes: readonly AsmTape[], opts: As7Opts = {}): AsmResult & { vars: Map<string, number> } {
	const errors: string[] = [];
	const vars = new Map<string, Value>();
	const globals = new Map<string, Value>();
	const locals = new Map<string, Map<string, Value>>();
	const localNames = new Map<string, Set<string>>();
	const relative = new Map<string, number[]>();
	const words = new Map<number, number>();
	const source = new Map<number, string>();
	const listing: AsmLine[] = [];

	const reset = (): void => {
		vars.clear();
		for (const [k, v] of Object.entries({ ...SYSCALLS, ...BUILTIN_OPS })) vars.set(k, { v, rel: false });
		vars.set(".", { v: 0, rel: true });
		vars.set("..", { v: opts.base ?? 4096, rel: false });
	};
	const isLocal = (tape: string, name: string): boolean => name.startsWith("L") || !!localNames.get(tape)?.has(name);
	const setLabel = (tape: string, name: string, at: Value): void => {
		const n = name.slice(0, 8);
		if (isLocal(tape, n)) {
			if (!locals.has(tape)) locals.set(tape, new Map());
			(locals.get(tape) as Map<string, Value>).set(n, at);
		} else globals.set(n, at);
	};
	const getLabel = (tape: string, name: string): Value | undefined => {
		const n = name.slice(0, 8);
		return locals.get(tape)?.get(n) ?? globals.get(n);
	};
	const place = (x: Value): number => (x.rel ? ((x.v & M) + ((vars.get("..") as Value).v & M)) & M : x.v & M);

	for (const pass of [1, 2] as const) {
		reset();
		for (const tape of tapes) {
			const lines = tape.text.split("\n");
			for (let n = 0; n < lines.length; n += 1) {
				const raw = (lines[n] as string).replace(/\r$/, "");
				const where = `${tape.name}:${n + 1}`;
				let rest = raw;
				let first: number | null = null;
				const emitted: number[] = [];
				const fail = (msg: string): void => {
					if (pass === 2) errors.push(`${where}: ${msg}`);
				};
				const eol = (): boolean => rest === "" || rest.startsWith('"');

				/** One expression off the front of `rest`: syllables ORed, or added or subtracted. */
				const expression = (): Value => {
					let word = 0;
					let rel = false;
					for (;;) {
						rest = rest.replace(/^\s+/, "");
						if (rest === "" || rest[0] === '"' || rest[0] === ";") return { v: word | 0, rel };
						let op: "|" | "+" | "-" = "|";
						if (rest[0] === "-" || rest[0] === "+") {
							op = rest[0] as "+" | "-";
							rest = rest.slice(1);
						}
						let syl: Value = { v: 0, rel: false };
						let m: RegExpMatchArray | null;
						if ((m = rest.match(/^<([\s\S])/))) syl = { v: (m[1] as string).charCodeAt(0) << 9, rel: false };
						else if ((m = rest.match(/^([\s\S])>/))) syl = { v: (m[1] as string).charCodeAt(0), rel: false };
						else if ((m = rest.match(/^>([\s\S])/))) syl = { v: (m[1] as string).charCodeAt(0), rel: false };
						else if ((m = rest.match(/^[A-Za-z_.][A-Za-z0-9_.]*/))) {
							const s = m[0];
							const found = vars.get(s) ?? getLabel(tape.name, s);
							if (found) syl = found;
							else fail(`${s} not defined`);
						} else if ((m = rest.match(/^(\d+)([fb])/))) {
							if (pass === 2) {
								const dot = (vars.get(".") as Value).v;
								const at = relative.get(m[1] as string) ?? [];
								const hit = m[2] === "f" ? at.find((a) => a > dot) : [...at].reverse().find((a) => a < dot);
								if (hit === undefined) fail(`relative label ${m[1]}${m[2]} not found`);
								else syl = { v: hit, rel: (vars.get(".") as Value).rel };
							}
						} else if ((m = rest.match(/^\d+/))) {
							const d = m[0];
							const v = d.startsWith("0") ? [...d].reduce((a, c) => a * 8 + Number(c), 0) : Number(d);
							syl = { v: v & M, rel: false };
						} else {
							fail(`huh? '${rest}'`);
							rest = "";
							return { v: word, rel };
						}
						rest = rest.slice(m[0].length);
						const x = syl.v & M;
						if (op === "+") {
							word += x;
							rel ||= syl.rel;
						} else if (op === "-") {
							word -= x;
							if (rel && syl.rel) rel = false;
							else if (!rel && syl.rel) fail("absolute value minus relative");
						} else {
							word |= x;
							rel ||= syl.rel;
						}
						word &= M;
					}
				};

				for (;;) {
					if (eol()) break;
					rest = rest.replace(/^\s+/, "");
					if (rest.startsWith("@")) {
						const d = rest.match(/^@local\s+(\S+)/);
						if (d) {
							if (!localNames.has(tape.name)) localNames.set(tape.name, new Set());
							(localNames.get(tape.name) as Set<string>).add(d[1] as string);
						}
						break;
					}
					let lm: RegExpMatchArray | null;
					while ((lm = rest.match(/^([A-Za-z0-9_.]+):\s*/))) {
						const name = lm[1] as string;
						const dot = vars.get(".") as Value;
						if (/^\d+$/.test(name)) {
							if (pass === 1) relative.set(name, [...(relative.get(name) ?? []), dot.v]);
						} else setLabel(tape.name, name, { ...dot });
						rest = rest.slice(lm[0].length);
					}
					if (eol()) break;
					const am = rest.match(/^([^;= \t]+)\s*=/);
					if (am) {
						rest = rest.slice(am[0].length);
						vars.set(am[1] as string, expression());
					} else {
						const w = expression();
						if (pass === 2) {
							const loc = place(vars.get(".") as Value);
							const word = place(w);
							words.set(loc, word);
							if (first === null) {
								first = loc;
								source.set(loc, raw);
							} else if (!source.has(loc)) source.set(loc, "");
							emitted.push(word);
						}
						const dot = vars.get(".") as Value;
						vars.set(".", { v: dot.v + 1, rel: dot.rel });
					}
					rest = rest.replace(/^\s*;?/, "");
				}
				if (pass === 2) listing.push({ tape: tape.name, line: n + 1, addr: first, word: emitted[0] ?? null, words: emitted, source: raw });
			}
		}
	}

	const symbols = new Map<string, number>();
	for (const [k, v] of [...globals.entries()].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))) symbols.set(k, place(v));
	const assigned = new Map<string, number>();
	for (const [k, v] of vars) if (!(k in SYSCALLS) && !(k in BUILTIN_OPS) && k !== "." && k !== "..") assigned.set(k, v.v & M);
	return {
		machine: PDP7,
		words: [...words.entries()].sort((a, b) => a[0] - b[0]),
		symbols,
		literals: [],
		variables: [],
		listing,
		errors,
		start: null,
		vars: assigned,
	};
}

/** `as7 -o` output: `addr: word<TAB>source`, the source on a line's first word only. */
export function formatA7out(result: AsmResult): string {
	const src = new Map<number, string>();
	for (const l of result.listing) {
		if (l.addr === null) continue;
		l.words.forEach((_, k) => {
			const a = ((l.addr as number) + k) & M;
			src.set(a, k === 0 ? l.source : "");
		});
	}
	const o = (n: number) => n.toString(8).padStart(6, "0");
	return result.words.map(([a, w]) => `${o(a)}: ${o(w)}\t${src.get(a) ?? ""}\n`).join("");
}

/** The `Labels:` table that ends `as7 -f list`. */
export function formatAs7Labels(result: AsmResult): string {
	const out = ["", "Labels:"];
	for (const [name, addr] of result.symbols) out.push(`${name.padEnd(8).slice(0, 8)} ${addr.toString(8).padStart(6, "0")} `);
	return `${out.join("\n")}\n`;
}
