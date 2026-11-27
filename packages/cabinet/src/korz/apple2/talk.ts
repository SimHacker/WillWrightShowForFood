/**
 * What the Apple prints, split into what the program says and what the person typed, for
 * reading aloud. Every character that reaches the screen through the Monitor passes COUT1
 * ($FDF0) with the character in A, after DOS has taken out its own commands; the runner
 * calls `print` when the 6502 stands there. A program that writes the screen itself is not
 * heard.
 *
 * The keyboard echo goes through COUT1 too. Once the program has read a key (the strobe at
 * $C010 is clear), the next character printed is its echo if it is that key: it goes to what
 * the person typed, not to what the program said. Otherwise the program took the key without
 * echoing it, and it is forgotten; so is a key still unread after `stale` cycles.
 */

export const COUT1 = 0xfdf0;

const CR = 0x0d;
const BS = 0x08;

export type TalkLimits = {
	/** Cycles of quiet after which a line without a Return is said: a prompt waiting for input. */
	quiet: number;
	/** Cycles after which a key the program never echoed is forgotten. */
	stale: number;
	/** Longest line kept; a program printing without Returns is cut there. */
	longest: number;
};

export const TALK_DEFAULTS: TalkLimits = { quiet: 400_000, stale: 2_000_000, longest: 400 };

export type Heard = { said: string[]; typed: string[] };

const upper = (c: number) => (c >= 0x61 && c <= 0x7a ? c - 0x20 : c);

export class Talk {
	private line = "";
	private input = "";
	private said: string[] = [];
	private typed: string[] = [];
	private keys: { code: number; at: number }[] = [];
	private printedAt = 0;
	private readonly limits: TalkLimits;

	constructor(limits: Partial<TalkLimits> = {}) {
		this.limits = { ...TALK_DEFAULTS, ...limits };
	}

	/** A key went to the Apple at this cycle. */
	key(code: number, cycle: number): void {
		this.keys = this.keys.filter((k) => cycle - k.at < this.limits.stale);
		this.keys.push({ code: upper(code & 0x7f), at: cycle });
	}

	/**
	 * The 6502 is at COUT1 with `a` in its A register. `waiting`: the keyboard's strobe is still
	 * set, so the program has not read the key yet and nothing it prints now is the key's echo.
	 */
	print(a: number, cycle: number, waiting = false): void {
		const c = a & 0x7f;
		this.printedAt = cycle;
		while (this.keys.length && cycle - this.keys[0]!.at >= this.limits.stale) this.keys.shift();
		const next = waiting ? undefined : this.keys.shift();
		if (next && upper(c) === next.code) {
			this.echo(c);
			return;
		}
		if (c === CR) this.endLine();
		else if (c === BS) this.line = this.line.slice(0, -1);
		else if (c >= 0x20 && c < 0x7f) {
			this.line += String.fromCharCode(c);
			if (this.line.length >= this.limits.longest) this.endLine();
		}
	}

	private echo(c: number): void {
		if (c === CR) {
			if (this.input.trim()) this.typed.push(this.input.trim());
			this.input = "";
			this.endLine();
		} else if (c === BS) this.input = this.input.slice(0, -1);
		else if (c >= 0x20 && c < 0x7f) this.input += String.fromCharCode(c);
	}

	private endLine(): void {
		if (/[A-Za-z0-9]/.test(this.line)) this.said.push(this.line.trim());
		this.line = "";
	}

	/**
	 * The lines finished since the last call, in order, and the line so far once the program
	 * has printed nothing for `quiet` cycles: the prompt it now waits at.
	 */
	take(cycle: number): Heard {
		if (this.line.trim() && cycle - this.printedAt >= this.limits.quiet) this.endLine();
		const heard = { said: this.said, typed: this.typed };
		this.said = [];
		this.typed = [];
		return heard;
	}

	/** Forget everything: a reboot, or reading aloud turned off. */
	clear(): void {
		this.line = "";
		this.input = "";
		this.said = [];
		this.typed = [];
		this.keys = [];
	}
}

/**
 * The 40-column text page's 24 rows as text, as the ][+'s 64-glyph character generator shows
 * them: inverse and flashing letters read as letters, and $60-$7F as space to ?, so a cursor a
 * program blinks by writing $E0 is a space and trims away.
 */
export function textRows(page: (addr: number) => number, base = 0x400): string[] {
	const rows: string[] = [];
	for (let y = 0; y < 24; y++) {
		const at = base + (y & 7) * 0x80 + (y >> 3) * 40;
		let s = "";
		for (let x = 0; x < 40; x++) {
			const b = page(at + x);
			let c = b & 0x7f;
			if (c >= 0x60) c -= 0x40;
			if (c < 0x20) c += 0x40;
			s += String.fromCharCode(c);
		}
		rows.push(s.trimEnd());
	}
	return rows;
}

/**
 * Reading the text screen, for a program that draws its own text and never passes COUT1.
 * `look` is given the rows now and then; once they have held still for `quiet` cycles, the
 * rows that were not on the screen when it last spoke are said, top to bottom, counted as a
 * multiset, so a line scrolled up is not said again. What the person typed comes from the
 * keys: printable keys up to a Return are a line, Backspace takes one back, and a screen
 * that changes without a row growing to end with the line took the keys unechoed. Nothing is said
 * while a line is being typed. Its echo is cut off the end of the line it appears on, and a
 * prompt that is all that is left, already said, is not said again.
 */
export class ScreenTalk {
	private spoken: string[] = [];
	private seen: string[] = [];
	private seenAt = 0;
	private input = "";
	private typed: string[] = [];
	private recent: string[] = [];
	private readonly quiet: number;

	constructor(limits: Partial<Pick<TalkLimits, "quiet">> = {}) {
		this.quiet = limits.quiet ?? TALK_DEFAULTS.quiet;
	}

	key(code: number): void {
		const c = upper(code & 0x7f);
		if (c === CR) {
			if (this.input.trim()) {
				this.typed.push(this.input.trim());
				this.recent = [...this.recent.slice(-3), this.input.trim()];
			}
			this.input = "";
		} else if (c === BS || c === 0x7f) this.input = this.input.slice(0, -1);
		else if (c >= 0x20 && c < 0x7f) this.input += String.fromCharCode(c);
	}

	look(rows: string[], cycle: number): void {
		if (rows.length !== this.seen.length || rows.some((r, i) => r !== this.seen[i])) {
			const input = this.input.trimEnd();
			const grown = (r: string, i: number) => {
				const was = (this.seen[i] ?? "").trimEnd();
				const now = r.trimEnd();
				const added = now.slice(was.length).replace(/ /g, "").length;
				return now.toUpperCase().endsWith(input) && now.startsWith(was) && added <= input.replace(/ /g, "").length;
			};
			if (input && !rows.some(grown)) this.input = "";
			this.seen = rows.slice();
			this.seenAt = cycle;
		}
	}

	take(cycle: number): Heard {
		const said: string[] = [];
		const still = this.seen.length && cycle - this.seenAt >= this.quiet && !this.input;
		if (still && this.seen.some((r, i) => r !== this.spoken[i])) {
			const left = new Map<string, number>();
			for (const r of this.spoken) left.set(r, (left.get(r) ?? 0) + 1);
			const before = new Set(this.spoken.map((r) => r.trim()));
			for (const r of this.seen) {
				const n = left.get(r) ?? 0;
				if (n > 0) left.set(r, n - 1);
				else {
					let line = r.trim();
					for (const t of this.recent) if (line.toUpperCase().endsWith(t)) line = line.slice(0, line.length - t.length).trim();
					if (line && /[A-Za-z0-9]/.test(line) && !(line !== r.trim() && before.has(line))) said.push(line);
				}
			}
			this.spoken = this.seen.slice();
		}
		const heard = { said, typed: this.typed };
		this.typed = [];
		return heard;
	}

	clear(): void {
		this.spoken = [];
		this.seen = [];
		this.input = "";
		this.typed = [];
		this.recent = [];
	}
}

/**
 * A printed line as words to speak: an all-capitals line in lower case, so a voice reads
 * words rather than letters; runs of rule characters dropped; spaces folded.
 */
export function speakable(text: string): string {
	let t = text.replace(/([-=*_#~+.:!])\1{2,}/g, " ").replace(/\s+/g, " ").trim();
	if (!/[a-z]/.test(t)) t = t.toLowerCase();
	return t;
}
