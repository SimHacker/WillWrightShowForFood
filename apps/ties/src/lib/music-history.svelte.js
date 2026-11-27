// Every music config a machine's dance settled on, oldest first, one list per machine, in this
// browser's localStorage, so a jiggle or a paste never loses the one before it. A config is
// the seed's digits and the dance's style, tempo and Eno tracks. Going back and changing
// something adds at the end; nothing is cut off but the oldest, past LIMIT.

/** @typedef {{ seed: string, style: string, bpm: number, loops: number }} MusicConfig */
/** @typedef {MusicConfig & { n: number }} Kept `n` numbers it among the unsaved: "Unsaved #n". */

const LIMIT = 500;

/** @param {MusicConfig} a @param {MusicConfig} b */
export const sameMusic = (a, b) => a.seed === b.seed && a.style === b.style && a.bpm === b.bpm && a.loops === b.loops;

export class MusicHistory {
	/** @type {Kept[]} */
	list = $state([]);
	/** The config the music is at now, by index; -1 before the first. */
	at = $state(-1);
	#next = 1;
	#key;

	/** @param {string} machine */
	constructor(machine) {
		this.#key = `music-history-${machine}`;
		try {
			const kept = JSON.parse(globalThis.localStorage?.getItem(this.#key) ?? 'null');
			if (Array.isArray(kept?.list)) {
				this.list = kept.list.filter(
					(/** @type {Kept} */ c) => typeof c?.seed === 'string' && typeof c.style === 'string' && typeof c.bpm === 'number' && typeof c.loops === 'number' && typeof c.n === 'number'
				);
				this.#next = Math.max(1, Number(kept.next) || 1, ...this.list.map((c) => c.n + 1));
				this.at = Math.min(this.list.length - 1, Number.isInteger(kept.at) ? kept.at : this.list.length - 1);
			}
		} catch {
			/* Unreadable: start empty. */
		}
	}

	#save() {
		try {
			globalThis.localStorage?.setItem(this.#key, JSON.stringify({ list: this.list, at: this.at, next: this.#next }));
		} catch {
			/* Storage full or forbidden: the history lasts until the page goes. */
		}
	}

	/** The music settled on `c`: point at it if the history has it, else add it at the end. @param {MusicConfig} c */
	record(c) {
		const i = this.list.findIndex((k) => sameMusic(k, c));
		if (i >= 0) {
			if (i !== this.at) {
				this.at = i;
				this.#save();
			}
			return;
		}
		const list = [...this.list, { seed: c.seed, style: c.style, bpm: c.bpm, loops: c.loops, n: this.#next++ }];
		this.list = list.slice(Math.max(0, list.length - LIMIT));
		this.at = this.list.length - 1;
		this.#save();
	}

	/** Point at entry `i` and return it, for the caller to play. @param {number} i */
	go(i) {
		const c = this.list[i];
		if (!c) return undefined;
		this.at = i;
		this.#save();
		return c;
	}

	/** Forget every entry. */
	clear() {
		this.list = [];
		this.at = -1;
		this.#next = 1;
		this.#save();
	}
}

/** One history per machine, shared by every control on the page. @type {Map<string, MusicHistory>} */
const stores = new Map();

/** @param {string} machine */
export function musicHistory(machine) {
	let s = stores.get(machine);
	if (!s) stores.set(machine, (s = new MusicHistory(machine)));
	return s;
}
