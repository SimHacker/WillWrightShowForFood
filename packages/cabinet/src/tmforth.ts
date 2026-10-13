import { encodeEntry, parseTapeText, parseTmStarFile, parseTmStarTape, qbits, type TmMove, type TmProgram, type TmTape } from "./tm.js";
import { PDP7_TM_SHAPE, type TmShape } from "./plugins/turing.js";

/**
 * TM-Forth: a small Forth whose output is Turing machine tables in the engine's memory format,
 * as Toffoli and Margolus's CAM Forth compiled rules into the CAM-6's lookup tables. A rule is a
 * Forth word run once for every scanned symbol; what it says to do becomes that door's entry.
 * TURING-ENGINE.md, "TM-Forth", is the reference. A compact example:
 *
 *   tm: busy2
 *   symbols: 0 1 ;                 \ the first symbol is the blank
 *   states: a b ;                  \ halt is state 0; these are 1, 2
 *   state: a  0 = if 1 write right b goto else 1 write left b goto then ;
 *   state: b  0 = if 1 write left a goto else 1 write left halt goto then ;
 *   a start
 *   end-tm
 *
 * In a rule body, the scanned symbol is on the stack ( sym -- ). The door it opens is:
 *
 *   write ( s -- )  the symbol to write   default: leave the cell as it is
 *   left right stay                       default: stay
 *   goto ( q -- )   the next state        default: this state
 *   undefined                             this symbol has no door; the engine stops UNDEF
 *
 * A rule that does none of these leaves the door undefined too. Besides `state:` rules:
 *
 *   symbols: a b c ;      the alphabet; each name becomes a word pushing its index. Names are
 *                         case-sensitive and shadow numbers: `0` is the symbol 0, which is the
 *                         number 0 only because the blank is listed first.
 *   codes: 060 061 ;      cell codes for the host character set (Type 342 codes on a PDP-7)
 *   states: q1 q2 ;       declare states, so rules can name states defined later
 *   row: q1 y0L1 00L1 …   Minsky's TECO rows: read, write, L/R/N, next state number
 *   tm*-table … end-table Cherniak's TM* rows, verbatim: CST INP OUT MOV NST - comment, `?` wild
 *   m-state ( args… n xt -- q )  the state that runs `xt` with n arguments: Turing's m-functions.
 *                         Each distinct argument list is one state, made on first use.
 *   start ( q -- )   tape: 000^0111   origin ( n -- )   note" text"
 */

export type TmForthOpts = { shape?: TmShape };

export class TmForthError extends Error {
	constructor(
		message: string,
		readonly line: number,
	) {
		super(`line ${line}: ${message}`);
	}
}

type Ins =
	| { k: "call"; w: Word }
	| { k: "lit"; v: number }
	| { k: "br"; to: number }
	| { k: "0br"; to: number }
	| { k: "of"; to: number }
	| { k: "do" }
	| { k: "?do"; to: number }
	| { k: "loop"; to: number; plus: boolean }
	| { k: "leave"; to: number }
	| { k: "unloop" }
	| { k: "exit" };

type Word = {
	name: string;
	immediate?: boolean;
	prim?: (f: TmForth) => void;
	code?: Ins[];
	xt: number;
};

type Door = { write?: number; move?: TmMove; next?: number; touched: boolean; undef: boolean };

type Rule =
	| { kind: "word"; w: Word; args: number[] }
	| { kind: "rows"; doors: Map<number | "?", { write: number | "?"; move: TmMove; next: number }> };

type Machine = {
	name: string;
	line: number;
	symbols: string[] | null;
	codes: number[] | null;
	states: string[];
	rules: (Rule | null)[];
	start: number | null;
	tapeText: string | null;
	origin: number;
	notes: string[];
	memo: Map<string, number>;
	/** tm*-table: the alphabet grows as rows mention symbols. */
	open: boolean;
};

const STEP_LIMIT = 50_000_000;

class TmForth {
	stack: number[] = [];
	rstack: number[] = [];
	mem: number[] = [];
	base = 10;
	dict = new Map<string, Word>();
	xts: Word[] = [];
	out: string[] = [];
	programs: TmProgram[] = [];
	m: Machine | null = null;
	/** The dictionary before `tm:`; a machine's symbols, states and helper words end with it. */
	private outer: Map<string, Word> | null = null;
	door: Door | null = null;

	private src = "";
	private pos = 0;
	private compiling: { w: Word; cs: (number | number[] | string)[]; rule: string | null } | null = null;
	private budget = STEP_LIMIT;
	private depth = 0;

	constructor(readonly shape: TmShape) {
		this.core();
		this.tmWords();
	}

	/* ---------- the outer interpreter ---------- */

	run(src: string): TmProgram[] {
		this.src = src;
		this.pos = 0;
		for (;;) {
			const t = this.token();
			if (t === null) break;
			this.interpret(t);
		}
		if (this.compiling) this.fail(`unterminated definition of ${this.compiling.w.name}`);
		if (this.m) this.endTm();
		return this.programs;
	}

	get line(): number {
		let n = 1;
		for (let i = 0; i < this.pos && i < this.src.length; i += 1) if (this.src[i] === "\n") n += 1;
		return n;
	}

	fail(msg: string): never {
		throw new TmForthError(msg, this.line);
	}

	token(): string | null {
		const s = this.src;
		while (this.pos < s.length && /\s/.test(s[this.pos]!)) this.pos += 1;
		if (this.pos >= s.length) return null;
		const a = this.pos;
		while (this.pos < s.length && !/\s/.test(s[this.pos]!)) this.pos += 1;
		return s.slice(a, this.pos);
	}

	needToken(what: string): string {
		const t = this.token();
		if (t === null) this.fail(`expected ${what}`);
		return t;
	}

	/** Up to (not including) the delimiter; skips one leading space. */
	parse(delim: string): string {
		if (this.src[this.pos] === " ") this.pos += 1;
		const end = this.src.indexOf(delim, this.pos);
		const stop = end < 0 ? this.src.length : end;
		const text = this.src.slice(this.pos, stop);
		this.pos = end < 0 ? stop : stop + delim.length;
		return text;
	}

	/** Tokens up to a lone `;`. */
	list(): string[] {
		const out: string[] = [];
		for (;;) {
			const t = this.needToken("`;`");
			if (t === ";") return out;
			out.push(t);
		}
	}

	interpret(t: string): void {
		const w = this.dict.get(t);
		if (w) {
			if (this.compiling && !w.immediate) this.emit({ k: "call", w });
			else this.execute(w);
			return;
		}
		const n = this.number(t);
		if (n === null) this.fail(`unknown word ${t}`);
		if (this.compiling) this.emit({ k: "lit", v: n });
		else this.push(n);
	}

	number(t: string): number | null {
		let base = this.base;
		let s = t;
		if (s.startsWith("#")) (base = 10), (s = s.slice(1));
		else if (s.startsWith("$")) (base = 16), (s = s.slice(1));
		else if (s.startsWith("%")) (base = 2), (s = s.slice(1));
		else if (/^-?0o/.test(s)) (base = 8), (s = s.replace("0o", ""));
		const neg = s.startsWith("-");
		if (neg) s = s.slice(1);
		if (!s) return null;
		let v = 0;
		for (const ch of s.toLowerCase()) {
			const d = parseInt(ch, 36);
			if (Number.isNaN(d) || d >= base) return null;
			v = v * base + d;
		}
		return neg ? -v : v;
	}

	/* ---------- the inner interpreter ---------- */

	execute(w: Word): void {
		if (w.prim) w.prim(this);
		else this.exec(w.code!);
	}

	exec(code: Ins[]): void {
		if (++this.depth > 1000) this.fail("return stack overflow (runaway recursion?)");
		try {
			let pc = 0;
			while (pc < code.length) {
				if (--this.budget < 0) this.fail("ran too long (an endless loop in a rule?)");
				const i = code[pc++]!;
				switch (i.k) {
					case "call":
						this.execute(i.w);
						break;
					case "lit":
						this.push(i.v);
						break;
					case "br":
						pc = i.to;
						break;
					case "0br":
						if (this.pop() === 0) pc = i.to;
						break;
					case "of": {
						const v = this.pop();
						if (this.peek() === v) this.pop();
						else pc = i.to;
						break;
					}
					case "do":
					case "?do": {
						const start = this.pop();
						const limit = this.pop();
						if (i.k === "?do" && start === limit) pc = i.to;
						else this.rstack.push(limit, start);
						break;
					}
					case "loop": {
						const r = this.rstack;
						const limit = r[r.length - 2]!;
						const before = r[r.length - 1]!;
						const step = i.plus ? this.pop() : 1;
						const after = before + step;
						r[r.length - 1] = after;
						const crossed = step >= 0 ? before < limit && after >= limit : before >= limit && after < limit;
						if (crossed) r.length -= 2;
						else pc = i.to;
						break;
					}
					case "leave":
						this.rstack.length -= 2;
						pc = i.to;
						break;
					case "unloop":
						this.rstack.length -= 2;
						break;
					case "exit":
						return;
				}
			}
		} finally {
			this.depth -= 1;
		}
	}

	push(...vs: number[]): void {
		this.stack.push(...vs);
	}

	pop(): number {
		if (!this.stack.length) this.fail("stack underflow");
		return this.stack.pop()!;
	}

	peek(): number {
		if (!this.stack.length) this.fail("stack underflow");
		return this.stack[this.stack.length - 1]!;
	}

	/* ---------- compiling ---------- */

	emit(i: Ins): number {
		this.compiling!.w.code!.push(i);
		return this.compiling!.w.code!.length - 1;
	}

	here(): number {
		return this.compiling!.w.code!.length;
	}

	define(name: string, prim: (f: TmForth) => void, immediate = false): Word {
		const w: Word = { name, prim, xt: this.xts.length, ...(immediate ? { immediate } : {}) };
		this.xts.push(w);
		this.dict.set(name, w);
		return w;
	}

	constant(name: string, v: number): void {
		this.define(name, (f) => f.push(v));
	}

	begin(name: string, rule: string | null): void {
		if (this.compiling) this.fail(`${name} inside a definition`);
		const w: Word = { name, code: [], xt: this.xts.length };
		this.xts.push(w);
		this.compiling = { w, cs: [], rule };
	}

	private compileOnly(name: string): void {
		if (!this.compiling) this.fail(`${name} outside a definition`);
	}

	private cs(): (number | number[] | string)[] {
		return this.compiling!.cs;
	}

	private csPop(want: "num" | "case" | "do"): number | number[] {
		const v = this.cs().pop();
		if (v === undefined) this.fail("unbalanced control structure");
		if (want === "case" && !Array.isArray(v)) this.fail("endof/endcase without case");
		if (want === "num" && typeof v !== "number") this.fail("unbalanced control structure");
		if (want === "do") {
			if (v !== "do") this.fail("loop without do");
			const leaves = this.cs().pop();
			const dest = this.cs().pop();
			if (!Array.isArray(leaves) || typeof dest !== "number") this.fail("loop without do");
			return [dest, ...leaves];
		}
		return v as number | number[];
	}

	private patch(at: number, to: number): void {
		const i = this.compiling!.w.code![at]!;
		if (i.k === "br" || i.k === "0br" || i.k === "of" || i.k === "?do" || i.k === "leave") i.to = to;
	}

	private core(): void {
		const b = (a: boolean) => (a ? -1 : 0);
		const bin = (name: string, fn: (a: number, b: number) => number) =>
			this.define(name, (f) => {
				const y = f.pop();
				const x = f.pop();
				f.push(fn(x, y));
			});
		const un = (name: string, fn: (a: number) => number) => this.define(name, (f) => f.push(fn(f.pop())));

		bin("+", (x, y) => x + y);
		bin("-", (x, y) => x - y);
		bin("*", (x, y) => x * y);
		bin("/", (x, y) => {
			if (y === 0) this.fail("division by zero");
			return Math.floor(x / y);
		});
		bin("mod", (x, y) => {
			if (y === 0) this.fail("division by zero");
			return x - y * Math.floor(x / y);
		});
		this.define("/mod", (f) => {
			const y = f.pop();
			const x = f.pop();
			if (y === 0) f.fail("division by zero");
			f.push(x - y * Math.floor(x / y));
			f.push(Math.floor(x / y));
		});
		bin("min", Math.min);
		bin("max", Math.max);
		bin("and", (x, y) => x & y);
		bin("or", (x, y) => x | y);
		bin("xor", (x, y) => x ^ y);
		bin("lshift", (x, y) => x << y);
		bin("rshift", (x, y) => x >>> y);
		bin("=", (x, y) => b(x === y));
		bin("<>", (x, y) => b(x !== y));
		bin("<", (x, y) => b(x < y));
		bin(">", (x, y) => b(x > y));
		bin("<=", (x, y) => b(x <= y));
		bin(">=", (x, y) => b(x >= y));
		un("0=", (x) => b(x === 0));
		un("0<", (x) => b(x < 0));
		un("0>", (x) => b(x > 0));
		un("negate", (x) => -x);
		un("abs", Math.abs);
		un("invert", (x) => ~x);
		un("1+", (x) => x + 1);
		un("1-", (x) => x - 1);
		un("2*", (x) => x * 2);
		un("2/", (x) => Math.floor(x / 2));
		un("cells", (x) => x);
		this.constant("true", -1);
		this.constant("false", 0);
		this.constant("bl", 32);

		this.define("dup", (f) => f.push(f.peek()));
		this.define("?dup", (f) => {
			if (f.peek()) f.push(f.peek());
		});
		this.define("drop", (f) => void f.pop());
		this.define("swap", (f) => {
			const y = f.pop();
			const x = f.pop();
			f.push(y, x);
		});
		this.define("over", (f) => {
			const y = f.pop();
			const x = f.peek();
			f.push(y, x);
		});
		this.define("nip", (f) => {
			const y = f.pop();
			f.pop();
			f.push(y);
		});
		this.define("tuck", (f) => {
			const y = f.pop();
			const x = f.pop();
			f.push(y, x, y);
		});
		this.define("rot", (f) => {
			const z = f.pop();
			const y = f.pop();
			const x = f.pop();
			f.push(y, z, x);
		});
		this.define("-rot", (f) => {
			const z = f.pop();
			const y = f.pop();
			const x = f.pop();
			f.push(z, x, y);
		});
		this.define("pick", (f) => {
			const n = f.pop();
			if (n < 0 || n >= f.stack.length) f.fail("pick out of range");
			f.push(f.stack[f.stack.length - 1 - n]!);
		});
		this.define("2dup", (f) => {
			const y = f.pop();
			const x = f.pop();
			f.push(x, y, x, y);
		});
		this.define("2drop", (f) => {
			f.pop();
			f.pop();
		});
		this.define("2swap", (f) => {
			const d = f.pop();
			const c = f.pop();
			const bb = f.pop();
			const a = f.pop();
			f.push(c, d, a, bb);
		});
		this.define("depth", (f) => f.push(f.stack.length));
		this.define(">r", (f) => f.rstack.push(f.pop()));
		this.define("r>", (f) => {
			if (!f.rstack.length) f.fail("return stack underflow");
			f.push(f.rstack.pop()!);
		});
		this.define("r@", (f) => f.push(f.rstack[f.rstack.length - 1] ?? f.fail("return stack underflow")));
		this.define("i", (f) => f.push(f.rstack[f.rstack.length - 1] ?? f.fail("i outside a loop")));
		this.define("j", (f) => f.push(f.rstack[f.rstack.length - 3] ?? f.fail("j outside a nested loop")));

		/* memory: a flat array of cells, `here` grows with , and allot */
		this.define("here", (f) => f.push(f.mem.length));
		this.define(",", (f) => void f.mem.push(f.pop()));
		this.define("allot", (f) => {
			const n = f.pop();
			for (let k = 0; k < n; k += 1) f.mem.push(0);
		});
		this.define("@", (f) => f.push(f.mem[f.pop()] ?? 0));
		this.define("!", (f) => {
			const a = f.pop();
			f.mem[a] = f.pop();
		});
		this.define("+!", (f) => {
			const a = f.pop();
			f.mem[a] = (f.mem[a] ?? 0) + f.pop();
		});
		this.define("constant", (f) => {
			const name = f.needToken("a name");
			f.constant(name, f.pop());
		});
		this.define("variable", (f) => {
			const name = f.needToken("a name");
			const a = f.mem.length;
			f.mem.push(0);
			f.constant(name, a);
		});
		this.define("create", (f) => f.constant(f.needToken("a name"), f.mem.length));

		this.define("decimal", (f) => void (f.base = 10));
		this.define("octal", (f) => void (f.base = 8));
		this.define("hex", (f) => void (f.base = 16));
		this.define("base", (f) => f.push(f.base));
		this.define(".", (f) => void f.out.push(f.pop().toString(f.base)));
		this.define("emit", (f) => void f.out.push(String.fromCharCode(f.pop())));
		this.define("cr", (f) => void f.out.push("\n"));
		this.define('."', (f) => {
			const text = f.parse('"');
			if (f.compiling) f.emit({ k: "call", w: { name: '."', prim: (g) => void g.out.push(text), xt: -1 } });
			else f.out.push(text);
		}, true);

		/* comments */
		this.define("\\", (f) => void f.parse("\n"), true);
		this.define("(", (f) => void f.parse(")"), true);

		/* definitions */
		this.define(":", (f) => f.begin(f.needToken("a name"), null));
		this.define(";", (f) => f.semicolon(), true);
		this.define("exit", (f) => {
			f.compileOnly("exit");
			f.emit({ k: "exit" });
		}, true);
		this.define("recurse", (f) => {
			f.compileOnly("recurse");
			f.emit({ k: "call", w: f.compiling!.w });
		}, true);
		this.define("'", (f) => {
			const name = f.needToken("a name");
			const w = f.dict.get(name) ?? f.fail(`unknown word ${name}`);
			f.push(w.xt);
		});
		this.define("[']", (f) => {
			f.compileOnly("[']");
			const name = f.needToken("a name");
			const w = f.dict.get(name) ?? f.fail(`unknown word ${name}`);
			f.emit({ k: "lit", v: w.xt });
		}, true);
		this.define("execute", (f) => {
			const xt = f.pop();
			f.execute(f.xts[xt] ?? f.fail(`bad execution token ${xt}`));
		});

		/* control flow */
		this.define("if", (f) => {
			f.compileOnly("if");
			f.cs().push(f.emit({ k: "0br", to: -1 }));
		}, true);
		this.define("else", (f) => {
			f.compileOnly("else");
			const orig = f.csPop("num") as number;
			f.cs().push(f.emit({ k: "br", to: -1 }));
			f.patch(orig, f.here());
		}, true);
		this.define("then", (f) => {
			f.compileOnly("then");
			f.patch(f.csPop("num") as number, f.here());
		}, true);
		this.define("begin", (f) => {
			f.compileOnly("begin");
			f.cs().push(f.here());
		}, true);
		this.define("until", (f) => {
			f.compileOnly("until");
			f.emit({ k: "0br", to: f.csPop("num") as number });
		}, true);
		this.define("again", (f) => {
			f.compileOnly("again");
			f.emit({ k: "br", to: f.csPop("num") as number });
		}, true);
		this.define("while", (f) => {
			f.compileOnly("while");
			f.cs().push(f.emit({ k: "0br", to: -1 }));
		}, true);
		this.define("repeat", (f) => {
			f.compileOnly("repeat");
			const orig = f.csPop("num") as number;
			f.emit({ k: "br", to: f.csPop("num") as number });
			f.patch(orig, f.here());
		}, true);
		const doLoop = (kind: "do" | "?do") => (f: TmForth) => {
			f.compileOnly(kind);
			const at = f.emit(kind === "do" ? { k: "do" } : { k: "?do", to: -1 });
			f.cs().push(f.here(), kind === "?do" ? [at] : [], "do");
		};
		this.define("do", doLoop("do"), true);
		this.define("?do", doLoop("?do"), true);
		const endLoop = (plus: boolean) => (f: TmForth) => {
			f.compileOnly(plus ? "+loop" : "loop");
			const [dest, ...leaves] = f.csPop("do") as number[];
			f.emit({ k: "loop", to: dest!, plus });
			for (const l of leaves) f.patch(l, f.here());
		};
		this.define("loop", endLoop(false), true);
		this.define("+loop", endLoop(true), true);
		this.define("leave", (f) => {
			f.compileOnly("leave");
			const cs = f.cs();
			const at = cs.lastIndexOf("do");
			if (at < 1) f.fail("leave outside do");
			(cs[at - 1] as number[]).push(f.emit({ k: "leave", to: -1 }));
		}, true);
		this.define("unloop", (f) => {
			f.compileOnly("unloop");
			f.emit({ k: "unloop" });
		}, true);
		this.define("case", (f) => {
			f.compileOnly("case");
			f.cs().push([]);
		}, true);
		this.define("of", (f) => {
			f.compileOnly("of");
			f.cs().push(f.emit({ k: "of", to: -1 }));
		}, true);
		this.define("endof", (f) => {
			f.compileOnly("endof");
			const of = f.csPop("num") as number;
			const exits = f.csPop("case") as number[];
			exits.push(f.emit({ k: "br", to: -1 }));
			f.patch(of, f.here());
			f.cs().push(exits);
		}, true);
		const dropWord = this.dict.get("drop")!;
		this.define("endcase", (f) => {
			f.compileOnly("endcase");
			const exits = f.csPop("case") as number[];
			f.emit({ k: "call", w: dropWord });
			for (const e of exits) f.patch(e, f.here());
		}, true);
	}

	semicolon(): void {
		const c = this.compiling;
		if (!c) this.fail("; outside a definition");
		if (c.cs.length) this.fail(`unbalanced control structure in ${c.w.name}`);
		this.compiling = null;
		if (c.rule === null) {
			this.dict.set(c.w.name, c.w);
			return;
		}
		const m = this.machine("state:");
		const q = this.stateNumber(c.rule, true);
		if (m.rules[q]) this.fail(`state ${c.rule} is defined twice`);
		m.rules[q] = { kind: "word", w: c.w, args: [] };
	}

	/* ---------- the Turing machine vocabulary ---------- */

	machine(word: string): Machine {
		if (!this.m) this.fail(`${word} outside tm: … end-tm`);
		return this.m;
	}

	private needSymbols(word: string): string[] {
		const m = this.machine(word);
		if (!m.symbols) this.fail(`${word} before symbols:`);
		return m.symbols;
	}

	stateNumber(name: string, declare: boolean): number {
		const m = this.machine("a state");
		const at = m.states.indexOf(name);
		if (at >= 0) return at;
		if (!declare) this.fail(`unknown state ${name}`);
		return this.addState(name);
	}

	addState(name: string): number {
		const m = this.m!;
		const q = m.states.length;
		if (q >= 2 ** qbits(this.shape)) this.fail(`more than ${2 ** qbits(this.shape)} states`);
		m.states.push(name);
		m.rules.push(null);
		this.constant(name, q);
		return q;
	}

	addSymbol(name: string): number {
		const m = this.m!;
		m.symbols ??= [];
		if (m.symbols.includes(name)) return m.symbols.indexOf(name);
		if (m.symbols.length >= 2 ** this.shape.symBits) this.fail(`more than ${2 ** this.shape.symBits} symbols`);
		m.symbols.push(name);
		this.constant(name, m.symbols.length - 1);
		return m.symbols.length - 1;
	}

	actOn(word: string): Door {
		if (!this.door) this.fail(`${word} outside a state rule`);
		this.door.touched = true;
		return this.door;
	}

	private tmWords(): void {
		this.define("tm:", (f) => {
			if (f.m) f.endTm();
			const name = f.needToken("a machine name");
			f.outer = new Map(f.dict);
			f.m = {
				name,
				line: f.line,
				symbols: null,
				codes: null,
				states: ["halt"],
				rules: [null],
				start: null,
				tapeText: null,
				origin: 0,
				notes: [],
				memo: new Map(),
				open: false,
			};
			f.constant("halt", 0);
		});
		this.define("end-tm", (f) => {
			f.machine("end-tm");
			f.endTm();
		});
		this.define("symbols:", (f) => {
			const m = f.machine("symbols:");
			if (m.symbols) f.fail("symbols: twice");
			const names = f.list();
			if (!names.length) f.fail("an empty alphabet");
			if (new Set(names).size !== names.length) f.fail("a symbol is listed twice");
			for (const n of names) f.addSymbol(n);
		});
		this.define("codes:", (f) => {
			const m = f.machine("codes:");
			const syms = f.needSymbols("codes:");
			const codes = f.list().map((t) => f.number(t) ?? f.fail(`bad code ${t}`));
			if (codes.length !== syms.length) f.fail(`${codes.length} codes for ${syms.length} symbols`);
			if (new Set(codes).size !== codes.length) f.fail("two symbols share a code");
			const max = 2 ** f.shape.cellBits;
			for (const c of codes) if (c < 0 || c >= max) f.fail(`code ${c} does not fit a ${f.shape.cellBits}-bit cell`);
			m.codes = codes;
		});
		this.define("states:", (f) => {
			f.machine("states:");
			for (const n of f.list()) {
				if (f.m!.states.includes(n)) f.fail(`state ${n} declared twice`);
				f.addState(n);
			}
		});
		this.define("state:", (f) => {
			f.needSymbols("state:");
			const name = f.needToken("a state name");
			f.stateNumber(name, true);
			f.begin(name, name);
		});
		this.define("start", (f) => void (f.machine("start").start = f.pop()));
		this.define("origin", (f) => void (f.machine("origin").origin = f.pop()));
		this.define("tape:", (f) => void (f.machine("tape:").tapeText = f.needToken("a tape")));
		this.define('note"', (f) => void f.machine('note"').notes.push(f.parse('"')));
		this.define("nsym", (f) => f.push(f.needSymbols("nsym").length));

		this.define("write", (f) => {
			const s = f.pop();
			if (s < 0 || s >= f.m!.symbols!.length) f.fail(`write ${s}: not a symbol`);
			f.actOn("write").write = s;
		});
		this.define("left", (f) => void (f.actOn("left").move = "L"));
		this.define("right", (f) => void (f.actOn("right").move = "R"));
		this.define("stay", (f) => void (f.actOn("stay").move = "N"));
		this.define("goto", (f) => {
			const q = f.pop();
			if (q < 0 || q >= f.m!.states.length) f.fail(`goto ${q}: not a state`);
			f.actOn("goto").next = q;
		});
		this.define("undefined", (f) => {
			const d = f.actOn("undefined");
			d.undef = true;
		});
		this.define("m-state", (f) => {
			const xt = f.pop();
			const n = f.pop();
			const w = f.xts[xt] ?? f.fail(`bad execution token ${xt}`);
			if (n < 0 || n > f.stack.length) f.fail("m-state: not that many arguments");
			const args = f.stack.splice(f.stack.length - n, n);
			const key = `${w.name}(${args.join(",")})`;
			const m = f.machine("m-state");
			let q = m.memo.get(key);
			if (q === undefined) {
				q = f.addState(key);
				m.memo.set(key, q);
				m.rules[q] = { kind: "word", w, args };
			}
			f.push(q);
		});
		this.define("row:", (f) => f.minskyRow());
		this.define("tm*-table", (f) => f.tmStarTable());
	}

	private rows(q: number): Map<number | "?", { write: number | "?"; move: TmMove; next: number }> {
		const m = this.m!;
		const r = m.rules[q];
		if (r?.kind === "word") this.fail(`state ${m.states[q]} has both a rule and rows`);
		if (r) return r.doors;
		const doors = new Map<number | "?", { write: number | "?"; move: TmMove; next: number }>();
		m.rules[q] = { kind: "rows", doors };
		return doors;
	}

	/** row: q y0L1 00L1 …  one TECO group per symbol, as Minsky typed them. */
	minskyRow(): void {
		const syms = this.needSymbols("row:");
		const qt = this.needToken("a state");
		const q = /^\d+$/.test(qt) ? this.numberedState(Number(qt)) : this.stateNumber(qt, true);
		const doors = this.rows(q);
		for (let k = 0; k < syms.length; k += 1) {
			const g = this.needToken(`a group for symbol ${k}`);
			const m = /^(.)(.)([LRN])(\d+)$/.exec(g);
			if (!m) this.fail(`bad row group ${g}: want read, write, L/R/N, next`);
			const read = syms.indexOf(m[1]!);
			const write = syms.indexOf(m[2]!);
			if (read < 0 || write < 0) this.fail(`row group ${g}: symbol not in the alphabet`);
			if (doors.has(read)) this.fail(`row group ${g}: ${m[1]} twice`);
			doors.set(read, { write, move: m[3] as TmMove, next: this.numberedState(Number(m[4])) });
		}
	}

	/** State n by number, as TM* and Minsky name them: declares q1…qn as needed. */
	numberedState(n: number): number {
		const m = this.m!;
		if (n === 0) return 0;
		while (m.states.length <= n) this.addState(`q${m.states.length}`);
		return n;
	}

	/** Cherniak's rows, verbatim, until `end-table`. */
	tmStarTable(): void {
		const m = this.machine("tm*-table");
		if (!m.symbols) {
			m.open = true;
			this.addSymbol("0");
		}
		for (;;) {
			const line = this.parse("\n");
			const text = line.trim();
			if (!text) {
				if (this.pos >= this.src.length) this.fail("tm*-table without end-table");
				continue;
			}
			if (text === "end-table") break;
			const row = /^(\d+)\s+(\S)\s+(\S)\s+([LRN])\s+(\d+)\s*(?:-\s?(.*))?$/.exec(text);
			if (row) {
				const q = this.numberedState(Number(row[1]));
				const sym = (s: string): number | "?" => {
					if (s === "?") return "?";
					if (m.open) return this.addSymbol(s);
					const at = m.symbols!.indexOf(s);
					if (at < 0) this.fail(`symbol ${s} is not in the alphabet`);
					return at;
				};
				const inp = sym(row[2]!);
				const out = sym(row[3]!);
				const doors = this.rows(q);
				if (doors.has(inp)) this.fail(`state ${row[1]} has input ${row[2]} twice`);
				doors.set(inp, { write: out, move: row[4] as TmMove, next: this.numberedState(Number(row[5])) });
				continue;
			}
			const note = /^(\d+)\s+-\s?(.*)$/.exec(text);
			if (note) m.notes.push(note[2]!.trimEnd());
			else this.fail(`bad TM* row: ${text}`);
		}
		m.open = false;
	}

	/** Run every rule for every symbol, building states that m-states make on the way. */
	endTm(): void {
		const m = this.m!;
		this.m = null;
		if (this.compiling) this.fail(`end-tm inside ${this.compiling.w.name}`);
		const syms = m.symbols ?? this.fail(`machine ${m.name} has no symbols:`);
		const n = syms.length;
		const table: number[] = [];
		this.m = m;
		try {
			for (let q = 0; q < m.states.length; q += 1) {
				const r = m.rules[q] ?? null;
				for (let s = 0; s < n; s += 1) {
					let door: { write: number; move: TmMove; next: number } | null = null;
					if (q === 0) door = null;
					else if (r?.kind === "rows") {
						const d = r.doors.get(s) ?? r.doors.get("?");
						if (d) door = { write: d.write === "?" ? s : d.write, move: d.move, next: d.next };
					} else if (r?.kind === "word") door = this.runRule(m, q, r.w, r.args, s);
					table.push(door ? encodeEntry(this.shape, door.move, door.write, door.next) : 0);
				}
			}
		} finally {
			this.m = null;
			if (this.outer) this.dict = this.outer;
			this.outer = null;
		}
		const start = m.start ?? (m.states.length > 1 ? 1 : 0);
		let tape: TmTape | null = null;
		if (m.tapeText !== null) {
			try {
				tape = parseTapeText(syms, m.tapeText, m.origin);
			} catch (e) {
				this.fail((e as Error).message);
			}
		}
		this.programs.push({
			name: m.name,
			symbols: [...syms],
			codes: m.codes,
			states: [...m.states],
			start,
			table,
			shape: this.shape,
			tape,
			notes: m.notes,
		});
	}

	private runRule(m: Machine, q: number, w: Word, args: number[], s: number): { write: number; move: TmMove; next: number } | null {
		const base = this.stack.length;
		this.door = { touched: false, undef: false };
		try {
			this.stack.push(...args, s);
			this.execute(w);
			if (this.stack.length !== base) {
				this.fail(`rule ${m.states[q]} left ${this.stack.length - base} items on the stack for symbol ${m.symbols![s]} (want ( sym -- ))`);
			}
			const d = this.door;
			if (!d.touched || d.undef) return null;
			return { write: d.write ?? s, move: d.move ?? "N", next: d.next ?? q };
		} finally {
			this.door = null;
			this.stack.length = Math.min(this.stack.length, base);
		}
	}
}

/** Compile TM-Forth source; every `tm: … end-tm` is one program. */
export function compileTmForth(src: string, opts: TmForthOpts = {}): TmProgram[] {
	return new TmForth(opts.shape ?? PDP7_TM_SHAPE).run(src);
}

/** The one program in `src`, or the one named. */
export function compileTm(src: string, name?: string, opts: TmForthOpts = {}): TmProgram {
	const all = compileTmForth(src, opts);
	const p = name === undefined ? all[0] : all.find((x) => x.name === name);
	if (!p) throw new Error(name ? `no machine ${name}` : "no machine in the source");
	return p;
}

/**
 * A TM* file from Cherniak's disk as TM-Forth: its rows verbatim inside `tm*-table`, and
 * optionally a TM* tape file's tape. Compile the result like any other source.
 */
export function tmStarSource(tmFile: string, opts: { name?: string; tapeFile?: string } = {}): string {
	const f = parseTmStarFile(tmFile);
	const lines = tmFile.replace(/\r/g, "").split("\n");
	const at = lines.findIndex((l) => /^STATE TABLE:/.test(l));
	const rows = lines.slice(at + 1).filter((l) => l.trim() && !/^---/.test(l));
	const name = opts.name ?? f.program.replace(/\.TM$/i, "").toLowerCase();
	const out = [`tm: ${name}`, "tm*-table", ...rows, "end-table", f.initial ? `q${f.initial} start` : "halt start"];
	if (opts.tapeFile) out.push(`tape: ${parseTmStarTape(opts.tapeFile).tape}`);
	out.push("end-tm");
	return out.join("\n");
}
