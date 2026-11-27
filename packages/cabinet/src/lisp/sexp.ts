import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

/**
 * S-expressions, independent of any machine: a reader for MACLISP's syntax, a printer, and the
 * same data as JSON and YAML. ka10/cons10.ts puts them in a KA10's core as cons cells and reads
 * them back out.
 *
 * Symbols are interned (`sym("DOG") === sym("DOG")`), so a structure that mentions DOG a thousand
 * times mentions one symbol. A Pair is a cons; the same Pair reached twice is shared structure,
 * and a Pair reached from inside itself is a cycle. The printer writes both as Common Lisp's
 * labels, `#1=(A . #1#)`, which the reader reads back. NIL is null; () reads as null.
 *
 * Two dialects of the reader and printer. MACLISP (the default for ITS's files): `/` quotes the
 * next character (`PEOPLE/'S`), `|...|` quotes a whole symbol, `;` starts a comment, `'x` is
 * `(QUOTE x)`, and integers are read in `ibase`, 8 unless a trailing `.` makes one decimal.
 * Common Lisp: `\` quotes the next character, `#| ... |#` is a comment, `#'f` is `(FUNCTION f)`,
 * backquote, comma and comma-at read as `(BACKQUOTE x)`, `(UNQUOTE x)`, `(UNQUOTE-SPLICING x)`,
 * `#\a` is a character, `#(...)` a vector, `:key` a symbol with its colon, and numbers are
 * decimal integers, floats (`1.5`, `1e3`) and ratios (`1/3`, read as their value). Both read
 * strings in double quotes, and `#n=` / `#n#` labels. Franz Lisp (Berkeley's, for the Unix
 * machines to come) reads as Common Lisp does but keeps case: `foo` and `Foo` are two symbols,
 * and `nil` is NIL.
 *
 * To come: Scheme (R7RS: #t and #f, #; datum comments, #u8 bytevectors, case kept, Racket's
 * brackets), Emacs Lisp (?a characters, [vectors]), Clojure's EDN ([] {} #{} :keywords, commas
 * as whitespace), and Interlisp (% as the escape).
 */

export class Sym {
	private constructor(readonly name: string) {}
	static readonly table = new Map<string, Sym>();
	static of(name: string): Sym {
		let s = Sym.table.get(name);
		if (!s) Sym.table.set(name, (s = new Sym(name)));
		return s;
	}
}
export const sym = (name: string): Sym => Sym.of(name);

export class Pair {
	constructor(
		public car: Sexp,
		public cdr: Sexp,
	) {}
}

/** A character, as Common Lisp's `#\\a` reads it. */
export class Char {
	constructor(readonly char: string) {}
}

/** A vector: Common Lisp's `#(...)`, and a MACLISP array's elements. */
export class Vec {
	constructor(readonly items: Sexp[]) {}
}

/**
 * A MACLISP hunk, printed `(a . b . c .)`, in that printed order: the first is (CXR 1), the next
 * (CXR 2), and the last (CXR 0). ANIMAL keeps each sentence it reads in one.
 */
export class Hunk {
	constructor(readonly items: Sexp[]) {}
}

export type Sexp = null | Sym | string | number | Char | Vec | Hunk | Pair;
export type Dialect = "maclisp" | "cl" | "franz";

export const cons = (car: Sexp, cdr: Sexp): Pair => new Pair(car, cdr);
export const list = (...xs: Sexp[]): Sexp => xs.reduceRight<Sexp>((d, a) => new Pair(a, d), null);
export const isPair = (x: Sexp): x is Pair => x instanceof Pair;

/** The elements of a list, and what ends it (null for a proper list). Stops at a cycle. */
export function elements(x: Sexp): { items: Sexp[]; tail: Sexp } {
	const items: Sexp[] = [];
	const seen = new Set<Pair>();
	while (x instanceof Pair && !seen.has(x)) {
		seen.add(x);
		items.push(x.car);
		x = x.cdr;
	}
	return { items, tail: x };
}

export type ReadOpts = { dialect?: Dialect; ibase?: 8 | 10 };

/** Every top-level form in `text`. */
export function readAll(text: string, opts: ReadOpts = {}): Sexp[] {
	const dialect = opts.dialect ?? "maclisp";
	const cl = dialect !== "maclisp";
	const r = new Reader(text, opts.ibase ?? (cl ? 10 : 8), cl, dialect !== "franz");
	const out: Sexp[] = [];
	for (;;) {
		r.skip();
		if (r.done()) return out;
		out.push(r.form());
	}
}

/** The first form in `text`. */
export function read(text: string, opts: ReadOpts = {}): Sexp {
	const forms = readAll(text, opts);
	if (!forms.length) throw new SyntaxError("nothing to read");
	return forms[0] as Sexp;
}

const PLACEHOLDER = Symbol("label");
type Hole = { [PLACEHOLDER]: number };

class Reader {
	private k = 0;
	private readonly labels = new Map<number, Sexp | Hole>();
	constructor(
		private readonly s: string,
		private readonly ibase: number,
		/** Common Lisp's syntax (Franz's too): backslash, #|, #', backquote, #\\, #(. */
		private readonly cl: boolean,
		/** Read symbols in upper case, as MACLISP and Common Lisp do; Franz keeps case. */
		private readonly fold: boolean,
	) {}
	/** A symbol the reader makes up (QUOTE, FUNCTION...), in the dialect's case. */
	private sym(name: string): Sym {
		return sym(this.fold ? name : name.toLowerCase());
	}
	private get esc(): string {
		return this.cl ? "\\" : "/";
	}
	done(): boolean {
		return this.k >= this.s.length;
	}
	skip(): void {
		for (;;) {
			const c = this.s[this.k];
			if (c === undefined) return;
			if (c === ";") {
				while (this.k < this.s.length && this.s[this.k] !== "\n") this.k++;
			} else if (this.cl && c === "#" && this.s[this.k + 1] === "|") {
				let depth = 0;
				do {
					if (this.s.startsWith("#|", this.k)) {
						depth++;
						this.k += 2;
					} else if (this.s.startsWith("|#", this.k)) {
						depth--;
						this.k += 2;
					} else this.k++;
				} while (depth > 0 && this.k < this.s.length);
			} else if (/\s/.test(c)) this.k++;
			else return;
		}
	}
	private fail(msg: string): never {
		const line = this.s.slice(0, this.k).split("\n").length;
		throw new SyntaxError(`${msg} (line ${line})`);
	}
	form(): Sexp {
		this.skip();
		const c = this.s[this.k];
		if (c === undefined) this.fail("unexpected end");
		if (c === "(") {
			this.k++;
			return this.rest();
		}
		if (c === ")") this.fail("unexpected )");
		if (c === "'") {
			this.k++;
			return list(this.sym("QUOTE"), this.form());
		}
		if (c === '"') return this.string();
		if (this.cl) {
			const wrap = (name: string, skip: number) => {
				this.k += skip;
				return list(this.sym(name), this.form());
			};
			if (c === "`") return wrap("BACKQUOTE", 1);
			if (c === "," && this.s[this.k + 1] === "@") return wrap("UNQUOTE-SPLICING", 2);
			if (c === ",") return wrap("UNQUOTE", 1);
			if (c === "#" && this.s[this.k + 1] === "'") return wrap("FUNCTION", 2);
			if (c === "#" && this.s[this.k + 1] === "(") {
				this.k += 2;
				const { items } = elements(this.rest());
				return new Vec(items);
			}
			if (c === "#" && this.s[this.k + 1] === "\\") {
				this.k += 2;
				const m = this.s.slice(this.k).match(/^(.[A-Za-z0-9-]*)/u) as RegExpMatchArray;
				const name = m[1] as string;
				this.k += name.length;
				const NAMED: Record<string, string> = { SPACE: " ", NEWLINE: "\n", TAB: "\t", RETURN: "\r", LINEFEED: "\n", PAGE: "\f", BACKSPACE: "\b", RUBOUT: "\x7f", NUL: "\0" };
				return new Char([...name].length === 1 ? name : (NAMED[name.toUpperCase()] ?? this.fail(`unknown character #\\${name}`)));
			}
		}
		if (c === "#") {
			const m = this.s.slice(this.k).match(/^#(\d+)([=#])/);
			if (m) {
				this.k += m[0].length;
				const n = Number(m[1]);
				if (m[2] === "#") {
					if (!this.labels.has(n)) this.fail(`#${n}# before #${n}=`);
					return this.labels.get(n) as Sexp;
				}
				const hole: Hole = { [PLACEHOLDER]: n };
				this.labels.set(n, hole);
				const x = this.form();
				this.labels.set(n, x);
				if (x instanceof Pair) patch(x, hole, x);
				return x;
			}
		}
		return this.atom();
	}
	private rest(): Sexp {
		const items: Sexp[] = [];
		let tail: Sexp = null;
		for (;;) {
			this.skip();
			const c = this.s[this.k];
			if (c === undefined) this.fail("missing )");
			if (c === ")") {
				this.k++;
				break;
			}
			if (c === "." && /[\s()]/.test(this.s[this.k + 1] ?? " ") && items.length) {
				this.k++;
				tail = this.form();
				this.skip();
				if (this.s[this.k] === ")") {
					this.k++;
					break;
				}
				if (items.length === 1 && this.s[this.k] === ".") return this.hunk([items[0] as Sexp, tail]);
				this.fail("expected ) after the dotted tail");
			}
			items.push(this.form());
		}
		return items.reduceRight<Sexp>((d, a) => new Pair(a, d), tail);
	}
	/** The rest of a hunk, `(a . b . c .)`, from the dot after b. */
	private hunk(items: Sexp[]): Hunk {
		for (;;) {
			this.skip();
			if (this.s[this.k] !== ".") this.fail("expected . in a hunk");
			this.k++;
			this.skip();
			if (this.s[this.k] === ")") {
				this.k++;
				return new Hunk(items);
			}
			items.push(this.form());
		}
	}
	private string(): string {
		let out = "";
		this.k++;
		for (;;) {
			const c = this.s[this.k++];
			if (c === undefined) this.fail("missing closing quote");
			if (c === '"') return out;
			if (c === "\\" || (!this.cl && c === "/")) out += this.s[this.k++] ?? "";
			else out += c;
		}
	}
	private atom(): Sexp {
		let name = "";
		let quoted = false;
		for (;;) {
			const c = this.s[this.k];
			if (c === undefined || /[\s()';"]/.test(c) || (this.cl && /[`,]/.test(c))) break;
			this.k++;
			if (c === this.esc) {
				name += this.s[this.k++] ?? "";
				quoted = true;
			} else if (c === "|") {
				const end = this.s.indexOf("|", this.k);
				if (end < 0) this.fail("missing closing |");
				name += this.s.slice(this.k, end);
				this.k = end + 1;
				quoted = true;
			} else name += this.fold ? c.toUpperCase() : c;
		}
		if (!quoted) {
			const n = name.match(/^([+-]?)(\d+)(\.?)$/);
			if (n) return Number.parseInt(`${n[1]}${n[2]}`, n[3] ? 10 : this.ibase);
			if (this.cl) {
				const ratio = name.match(/^([+-]?\d+)\/(\d+)$/);
				if (ratio) return Number(ratio[1]) / Number(ratio[2]);
				if (/^[+-]?(\d+\.\d*|\.\d+|\d+)([eEdDfFsSlL][+-]?\d+)?$/.test(name)) return Number(name.replace(/[dDfFsSlL]/, "e"));
			} else if (/^[+-]?\d*\.\d+([eE][+-]?\d+)?$/.test(name)) return Number(name);
			if (name === "NIL" || name === "nil") return null;
		}
		return sym(name);
	}
}

/** Replace a #n= placeholder with what it labels, through what was read inside it. */
function patch(x: Pair, hole: Hole, value: Sexp): void {
	const seen = new Set<Pair>();
	const todo: Pair[] = [x];
	while (todo.length) {
		const p = todo.pop() as Pair;
		if (seen.has(p)) continue;
		seen.add(p);
		if ((p.car as unknown) === hole) p.car = value;
		else if (p.car instanceof Pair) todo.push(p.car);
		if ((p.cdr as unknown) === hole) p.cdr = value;
		else if (p.cdr instanceof Pair) todo.push(p.cdr);
	}
}

/**
 * How much the printer writes: past `depth` levels or `length` elements it writes `...`, and it
 * stops at `maxChars`. `dialect` picks the escapes; Common Lisp's also prints (QUOTE x) as 'x.
 */
export type PrintOpts = { depth?: number; length?: number; maxChars?: number; dialect?: Dialect };

/** Pairs reached more than once, which get labels. */
function shared(x: Sexp): Set<Pair> {
	const seen = new Set<Pair>();
	const twice = new Set<Pair>();
	const todo: Sexp[] = [x];
	while (todo.length) {
		const y = todo.pop() as Sexp;
		if (y instanceof Vec || y instanceof Hunk) todo.push(...y.items);
		if (!(y instanceof Pair)) continue;
		if (seen.has(y)) {
			twice.add(y);
			continue;
		}
		seen.add(y);
		todo.push(y.cdr, y.car);
	}
	return twice;
}

const PLAIN = /^[A-Z0-9*+\-<>=!?$%&^_~:.@]+$/;

const CHAR_NAMES: Record<string, string> = { " ": "Space", "\n": "Newline", "\t": "Tab", "\r": "Return", "\f": "Page", "\b": "Backspace", "\x7f": "Rubout", "\0": "Nul" };

export function printAtom(x: Exclude<Sexp, Pair | Vec | Hunk>, dialect: Dialect = "maclisp"): string {
	if (x === null) return dialect === "franz" ? "nil" : "NIL";
	if (typeof x === "number") return dialect === "maclisp" && Number.isInteger(x) ? `${x}.` : String(x);
	if (typeof x === "string") return `"${x.replace(/["\\]/g, "\\$&")}"`;
	if (x instanceof Char) return `#\\${CHAR_NAMES[x.char] ?? x.char}`;
	const n = x.name;
	if (n === "") return "||";
	const plain = dialect === "cl" ? /^:?[A-Z0-9*+\-<>=!?$%&^_~.@/]+$/ : dialect === "franz" ? /^[A-Za-z0-9*+\-<>=!?$%&^_~.@/:]+$/ : PLAIN;
	return plain.test(n) && !/^[+-]?\d+\.?$/.test(n) && n !== "." && n.toUpperCase() !== "NIL" ? n : `|${n.replace(/\|/g, dialect === "maclisp" ? "/|" : "\\|")}|`;
}

/** An s-expression as text, labelling shared and circular structure. */
export function print(x: Sexp, opts: PrintOpts = {}): string {
	const labels = new Map<Pair, number>();
	const twice = shared(x);
	const depthMax = opts.depth ?? Infinity;
	const lengthMax = opts.length ?? Infinity;
	const out: string[] = [];
	let chars = 0;
	const max = opts.maxChars ?? Infinity;
	const put = (s: string): boolean => {
		out.push(s);
		chars += s.length;
		return chars < max;
	};
	const label = (p: Pair): string | null => {
		if (!twice.has(p)) return "";
		const n = labels.get(p);
		if (n !== undefined) return null;
		labels.set(p, labels.size + 1);
		return `#${labels.size}=`;
	};
	const dialect = opts.dialect ?? "maclisp";
	const QUOTES: Record<string, string> = { QUOTE: "'", FUNCTION: "#'", BACKQUOTE: "`", UNQUOTE: ",", "UNQUOTE-SPLICING": ",@" };
	const go = (y: Sexp, depth: number): boolean => {
		if (y instanceof Vec) {
			if (!put("#(")) return false;
			for (const [k, it] of y.items.entries()) {
				if (k >= lengthMax) return put("...)");
				if ((k && !put(" ")) || !go(it, depth + 1)) return false;
			}
			return put(")");
		}
		if (y instanceof Hunk) {
			if (!put("(")) return false;
			for (const it of y.items) if (!go(it, depth + 1) || !put(" . ")) return false;
			out[out.length - 1] = " .";
			return put(")");
		}
		if (!(y instanceof Pair)) return put(printAtom(y, dialect));
		const q = y.car instanceof Sym && dialect !== "maclisp" ? QUOTES[y.car.name.toUpperCase()] : undefined;
		if (q && y.cdr instanceof Pair && y.cdr.cdr === null && !twice.has(y) && !twice.has(y.cdr)) return put(q) && go(y.cdr.car, depth);
		const l = label(y);
		if (l === null) return put(`#${labels.get(y)}#`);
		if (depth >= depthMax) return put(`${l}(...)`);
		if (!put(`${l}(`)) return false;
		let p: Sexp = y;
		let n = 0;
		for (;;) {
			const q: Pair = p as Pair;
			if (n >= lengthMax) return put("...)");
			if (!go(q.car, depth + 1)) return false;
			n++;
			p = q.cdr;
			if (p === null) return put(")");
			if (!(p instanceof Pair) || twice.has(p)) {
				if (!put(" . ")) return false;
				if (!go(p, depth + 1)) return false;
				return put(")");
			}
			if (!put(" ")) return false;
		}
	};
	go(x, 0);
	const s = out.join("");
	return s.length > max ? `${s.slice(0, Math.max(0, max - 3))}...` : s;
}

/**
 * JSON-ready data: a proper list is an array, a dotted pair `{car, cdr}`, a symbol
 * `{symbol: name}`, a string a string, a number a number, NIL null. Shared or circular structure
 * gets `{id: n, ...}` where it is first written and `{ref: n}` after.
 */
export type Data = null | number | string | Data[] | { [k: string]: Data };

export function toData(x: Sexp): Data {
	const twice = shared(x);
	const ids = new Map<Pair, number>();
	const go = (y: Sexp): Data => {
		if (y === null || typeof y === "number" || typeof y === "string") return y;
		if (y instanceof Sym) return { symbol: y.name };
		if (y instanceof Char) return { char: y.char };
		if (y instanceof Vec) return { vector: y.items.map(go) };
		if (y instanceof Hunk) return { hunk: y.items.map(go) };
		const id = ids.get(y);
		if (id !== undefined) return { ref: id };
		let mine: number | undefined;
		if (twice.has(y)) ids.set(y, (mine = ids.size + 1));
		const { items, tail } = elementsUntilShared(y, twice);
		const body: Data = tail === null ? { list: items.map(go) } : items.length === 1 ? { car: go(items[0] as Sexp), cdr: go(tail) } : { list: items.map(go), tail: go(tail) };
		if (mine === undefined && tail === null) return (body as { list: Data[] }).list;
		return mine === undefined ? body : { id: mine, ...(body as object) };
	};
	return go(x);
}

/** Like elements, but a shared pair in the cdr chain ends the run, so it can be labelled. */
function elementsUntilShared(x: Pair, twice: Set<Pair>): { items: Sexp[]; tail: Sexp } {
	const items: Sexp[] = [x.car];
	let p: Sexp = x.cdr;
	while (p instanceof Pair && !twice.has(p)) {
		items.push(p.car);
		p = p.cdr;
	}
	return { items, tail: p };
}

export function fromData(d: unknown): Sexp {
	const ids = new Map<number, Pair>();
	const pending: { pair: Pair; side: "car" | "cdr"; ref: number }[] = [];
	const go = (v: unknown, into?: { pair: Pair; side: "car" | "cdr" }): Sexp => {
		if (v === null || v === undefined) return null;
		if (typeof v === "number" || typeof v === "string") return v;
		if (Array.isArray(v)) return chain(v, null);
		if (typeof v !== "object") throw new TypeError(`cannot read ${String(v)}`);
		const o = v as Record<string, unknown>;
		if (typeof o.symbol === "string") return sym(o.symbol);
		if (typeof o.char === "string") return new Char(o.char);
		if (Array.isArray(o.vector)) return new Vec(o.vector.map((it) => go(it)));
		if (Array.isArray(o.hunk)) return new Hunk(o.hunk.map((it) => go(it)));
		if (typeof o.ref === "number") {
			const p = ids.get(o.ref);
			if (p) return p;
			if (into) pending.push({ ...into, ref: o.ref });
			return null;
		}
		const head = new Pair(null, null);
		if (typeof o.id === "number") ids.set(o.id, head);
		const items = Array.isArray(o.list) ? o.list : "car" in o ? [o.car] : [];
		const tailData = "cdr" in o ? o.cdr : o.tail;
		fill(head, items, tailData);
		return head;
	};
	const fill = (head: Pair, items: unknown[], tailData: unknown) => {
		let p = head;
		items.forEach((it, k) => {
			p.car = go(it, { pair: p, side: "car" });
			if (k < items.length - 1) {
				const next = new Pair(null, null);
				p.cdr = next;
				p = next;
			}
		});
		p.cdr = go(tailData, { pair: p, side: "cdr" });
	};
	const chain = (items: unknown[], tail: unknown): Sexp => {
		if (!items.length) return go(tail);
		const head = new Pair(null, null);
		fill(head, items, tail);
		return head;
	};
	const out = go(d);
	for (const f of pending) f.pair[f.side] = ids.get(f.ref) ?? null;
	return out;
}

export const toJson = (x: Sexp, space = 1): string => JSON.stringify(toData(x), null, space);
export const fromJson = (text: string): Sexp => fromData(JSON.parse(text));
export const toYaml = (x: Sexp): string => stringifyYaml(toData(x), { aliasDuplicateObjects: false });
export const fromYaml = (text: string): Sexp => fromData(parseYaml(text));
