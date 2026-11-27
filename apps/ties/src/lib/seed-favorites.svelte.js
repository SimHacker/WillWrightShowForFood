// Named music seeds a person keeps, one list per machine, in this browser's localStorage.
// A favorite's `seed` is the seed's digits (30 hex for the Apple's panel, 0o and six octal for
// the PDP-7's switches), as Copy link puts in ?seed=.

/** @typedef {{ name: string, seed: string }} Favorite */

export class SeedFavorites {
	/** @type {Favorite[]} */
	list = $state([]);
	#key;

	/** @param {string} machine */
	constructor(machine) {
		this.#key = `seed-favorites-${machine}`;
		try {
			const kept = JSON.parse(globalThis.localStorage?.getItem(this.#key) ?? '[]');
			if (Array.isArray(kept)) this.list = kept.filter((f) => typeof f?.name === 'string' && typeof f?.seed === 'string');
		} catch {
			/* Unreadable: start with none. */
		}
	}

	#save() {
		try {
			globalThis.localStorage?.setItem(this.#key, JSON.stringify(this.list));
		} catch {
			/* Storage full or forbidden: the list lasts until the page goes. */
		}
	}

	/** @param {string} name @param {string} seed */
	add(name, seed) {
		this.list = [...this.list, { name, seed }];
		this.#save();
		return this.list.length - 1;
	}

	/** @param {number} i @param {string} name */
	rename(i, name) {
		this.list = this.list.map((f, j) => (j === i ? { ...f, name } : f));
		this.#save();
	}

	/** @param {number} i */
	remove(i) {
		this.list = this.list.filter((_, j) => j !== i);
		this.#save();
	}
}

/** One store per machine, shared by every control on the page. @type {Map<string, SeedFavorites>} */
const stores = new Map();

/** @param {string} machine */
export function seedFavorites(machine) {
	let s = stores.get(machine);
	if (!s) stores.set(machine, (s = new SeedFavorites(machine)));
	return s;
}
