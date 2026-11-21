import { parse } from "yaml";
import { type Picture, decodePng } from "./png.js";

/**
 * A screen angel: watches a machine's screen as pixels, the same pixels the page's canvas
 * shows, and keeps a game's state from what it sees. Text, lo-res, hi-res and 80 columns all
 * look the same to it.
 *
 * What it looks for and what each state means are data, in an ANGEL.yml beside PNG templates
 * cut from the screen:
 *
 *   looks:            a tree. A look is a PNG and where it sits on the screen; its looks are
 *                     only tried while it is seen. Transparent pixels in a PNG are not compared,
 *                     so a dialog can be seen whether or not its field is filled in. A look
 *                     matches exactly; `tolerance` and `channel` make it fuzzy.
 *   states:           tried in order on every step; the first whose conditions hold is the state.
 *                     When none holds the angel stays where it is.
 *     when / unless   looks that must be seen / must not be
 *     from            states it may be entered from (itself always counts)
 *     after           seconds of machine time spent in the current state before it may be entered
 *     say, speak      what the page shows and says about it
 *     moves           the app's moves (APPS.yml action labels) that work in this state
 *     auto            a move the angel makes for you when it enters the state
 *     ask             a field the page asks for instead of the machine: its value is typed in
 *     lock            the machine's keyboard is off, so typing goes to the page
 *     speed           the machine's speed from entering the state on, on the oracle
 *     frames          pictures per game second while this state is a fast-forward
 *     probe           keys typed every few seconds while in the state, for a game that shows
 *                     on screen when it starts to listen: the next state looks for that
 */

/** A look matches exactly unless it says how fuzzy it may be. */
export interface LookSpec {
	id: string;
	png: string;
	at: [number, number];
	/** Fraction of compared pixels allowed to differ; 0, the default, is every pixel. */
	tolerance?: number;
	/** How far a red, green or blue value may be from the template's and still be the same; default 0. */
	channel?: number;
	looks?: LookSpec[];
}

export interface AskSpec {
	label: string;
	/** Shown under the field. */
	hint?: string;
	/** Filled in to start with; {MM} {DD} {YY} {hh} {mm} {AP} are now. */
	default?: string;
	/** Typed into the machine on OK; {value} is what was entered. */
	keys: string;
	speak?: string;
	/** Said on OK instead of the value; {value} is what was entered, as typed, and {when} the same as a spoken date. */
	reply?: string;
	/** Upper-case the value, for machines that only have capitals. */
	upper?: boolean;
	maxlength?: number;
	/** The field stays after OK, empty, for something entered again and again. */
	keep?: boolean;
	/** Things to enter, offered as links that fill the field without pressing OK. */
	examples?: string[];
	/** More of them, under headings. */
	groups?: { label: string; examples: string[] }[];
}

export interface StateSpec {
	id: string;
	when?: string | string[];
	unless?: string | string[];
	from?: string | string[];
	after?: number;
	say?: string;
	speak?: string;
	moves?: string[];
	auto?: string;
	ask?: AskSpec;
	lock?: boolean;
	/** The machine's speed on entering the state, as its speed buttons set it; kept after. */
	speed?: number;
	/** Pictures per game second during a fast-forward. One finishes the stretch soonest. */
	frames?: number;
	probe?: ProbeSpec;
}

export interface ProbeSpec {
	keys: string;
	/** Seconds of machine time between one typing and the next. */
	every: number;
}

export interface AngelSpec {
	title?: string;
	/** The screen size the looks were cut from. */
	screen: [number, number];
	looks: LookSpec[];
	states: StateSpec[];
}

export interface Look extends Omit<LookSpec, "looks"> {
	image: Picture;
	looks: Look[];
}

const list = (v: string | string[] | undefined): string[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

/**
 * The fraction of a look's opaque pixels that differ from the screen where it sits. Stops
 * counting once more than `give` of them differ, so an exact look fails at its first wrong pixel.
 */
export function mismatch(screen: Picture, look: Pick<Look, "image" | "at" | "channel">, give = 1): number {
	const { image, at } = look;
	const near = look.channel ?? 0;
	const [x0, y0] = at;
	if (x0 < 0 || y0 < 0 || x0 + image.width > screen.width || y0 + image.height > screen.height) return 1;
	let opaque = 0;
	for (let t = 3; t < image.data.length; t += 4) if (image.data[t]! >= 128) opaque++;
	if (!opaque) return 1;
	const limit = give * opaque;
	let differ = 0;
	for (let y = 0; y < image.height; y++) {
		for (let x = 0; x < image.width; x++) {
			const t = (y * image.width + x) * 4;
			if (image.data[t + 3]! < 128) continue;
			const s = ((y0 + y) * screen.width + x0 + x) * 4;
			if (
				Math.abs(image.data[t]! - screen.data[s]!) > near ||
				Math.abs(image.data[t + 1]! - screen.data[s + 1]!) > near ||
				Math.abs(image.data[t + 2]! - screen.data[s + 2]!) > near
			) {
				differ++;
				if (differ > limit) return differ / opaque;
			}
		}
	}
	return differ / opaque;
}

/** Whether a look is on the screen: exact by default, or within its tolerance and channel. */
export const sees = (screen: Picture, look: Look): boolean => {
	const give = look.tolerance ?? 0;
	return mismatch(screen, look, give) <= give;
};

/** The looks seen on a screen: a look's own looks are tried only when it is seen. */
export function recognize(screen: Picture, looks: Look[], seen = new Set<string>()): Set<string> {
	for (const look of looks) {
		if (sees(screen, look)) {
			seen.add(look.id);
			recognize(screen, look.looks, seen);
		}
	}
	return seen;
}

export function parseAngel(text: string): AngelSpec {
	const spec = parse(text) as AngelSpec;
	if (!spec || !Array.isArray(spec.states)) throw new Error("ANGEL.yml needs states");
	spec.looks ??= [];
	return spec;
}

/** Read every look's PNG; `read` gets the path as written in ANGEL.yml. */
export async function loadLooks(specs: LookSpec[], read: (png: string) => Promise<Uint8Array>): Promise<Look[]> {
	return Promise.all(
		specs.map(async (s) => ({ ...s, image: await decodePng(await read(s.png)), looks: await loadLooks(s.looks ?? [], read) }))
	);
}

/** {MM} {DD} {YY} {hh} {mm} {AP} from a date. */
export function fillNow(text: string, now = new Date()): string {
	const two = (n: number) => String(n).padStart(2, "0");
	const h = now.getHours();
	const fields: Record<string, string> = {
		MM: two(now.getMonth() + 1),
		DD: two(now.getDate()),
		YY: two(now.getFullYear() % 100),
		hh: two(h % 12 || 12),
		mm: two(now.getMinutes()),
		AP: h < 12 ? "A" : "P",
	};
	return text.replace(/\{(MM|DD|YY|hh|mm|AP)\}/g, (_, k: string) => fields[k]!);
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** MM/DD/YY (or MMDDYY) as "Saturday, November 21, 2026"; undefined when it is not a real day. YY under 50 is 20YY. */
export function sayDate(text: string): string | undefined {
	const m = /^(\d\d)\/?(\d\d)\/?(\d\d)$/.exec(text.trim());
	if (!m) return undefined;
	const [month, day, yy] = [Number(m[1]), Number(m[2]), Number(m[3])];
	const year = yy < 50 ? 2000 + yy : 1900 + yy;
	const d = new Date(year, month - 1, day);
	if (d.getMonth() !== month - 1 || d.getDate() !== day) return undefined;
	return `${WEEKDAYS[d.getDay()]}, ${MONTHS[month - 1]} ${day}, ${year}`;
}

/** An ask's reply for what was entered: {value} as typed, {when} as a spoken date when it is one. */
export const fillReply = (reply: string, value: string): string =>
	reply.split("{value}").join(value).split("{when}").join(sayDate(value) ?? value);

/** The keys an ask types for a value. */
export const askKeys = (ask: AskSpec, value: string): string => ask.keys.split("{value}").join(ask.upper ? value.toUpperCase() : value);

export class Angel {
	readonly spec: AngelSpec;
	readonly looks: Look[];
	state: StateSpec;
	/** Machine seconds when the current state was entered. */
	since = 0;
	seen = new Set<string>();
	/** Machine seconds of the last probe. */
	probed = -Infinity;

	constructor(spec: AngelSpec, looks: Look[]) {
		this.spec = spec;
		this.looks = looks;
		this.state = spec.states.find((s) => !s.when) ?? spec.states[0]!;
	}

	byId(id: string): StateSpec | undefined {
		return this.spec.states.find((s) => s.id === id);
	}

	/** Whether `s` may be the state, given what is seen and how long the current one has lasted. */
	holds(s: StateSpec, seconds: number): boolean {
		if (!list(s.when).every((id) => this.seen.has(id))) return false;
		if (list(s.unless).some((id) => this.seen.has(id))) return false;
		const from = list(s.from);
		if (from.length && s.id !== this.state.id && !from.includes(this.state.id)) return false;
		if (s.after !== undefined && s.id !== this.state.id && seconds - this.since < s.after) return false;
		return true;
	}

	/** Look at a screen at `seconds` of machine time. Returns the new state when it changed. */
	step(screen: Picture, seconds: number): StateSpec | null {
		this.seen = recognize(screen, this.looks);
		const next = this.spec.states.find((s) => (s.when !== undefined || s.from !== undefined) && this.holds(s, seconds));
		if (!next || next.id === this.state.id) return null;
		this.state = next;
		this.since = seconds;
		this.probed = -Infinity;
		return next;
	}

	/** The current state's probe keys when they are due at `seconds`, or null. */
	probe(seconds: number): string | null {
		const p = this.state.probe;
		if (!p || seconds - this.probed < p.every) return null;
		this.probed = seconds;
		return p.keys;
	}

	/** Start over, as after a reboot. */
	reset(seconds = 0): void {
		this.state = this.spec.states.find((s) => !s.when) ?? this.spec.states[0]!;
		this.since = seconds;
		this.seen = new Set();
		this.probed = -Infinity;
	}
}

/** Machine seconds from the Apple's cycle counter. */
export const APPLE_HZ = 1_020_484;
