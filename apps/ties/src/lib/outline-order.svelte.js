/**
 * The order of a machine page's top-level outline nodes, the person's to change and kept in
 * this browser. Every machine page has one (ApplePanels.svelte, Pdp10Machine.svelte,
 * CabinetApplet.svelte); Outline.svelte's grip and Alt+Up and Alt+Down call `move`.
 */
export class OutlineOrder {
	/** @type {string[]} */
	order = $state([]);

	/** @param {string} key where it is kept @param {string[]} all every node, in the order a page first comes in */
	constructor(key, all) {
		this.key = key;
		this.all = all;
		this.order = this.#kept();
	}

	#kept() {
		try {
			const kept = JSON.parse(globalThis.localStorage?.getItem(this.key) ?? '[]');
			const known = Array.isArray(kept) ? kept.filter((k) => this.all.includes(k)) : [];
			// A node added since the order was kept goes after the one it follows in `all`.
			for (const [i, k] of this.all.entries()) if (!known.includes(k)) known.splice(i ? known.indexOf(this.all[i - 1]) + 1 : 0, 0, k);
			return known;
		} catch {
			return [...this.all];
		}
	}

	/**
	 * Move node `id` before node `to`, or past the next node up (-1) or down (1) that is on the
	 * page: a node with nothing to show now (the viewer with nothing open, a program's own panel
	 * when it has none) keeps its place but is stepped over.
	 * @param {string} id @param {string | number} to
	 */
	move = (id, to) => {
		const from = this.order.indexOf(id);
		if (from < 0) return;
		let at;
		if (typeof to === 'number') {
			const on = (/** @type {string} */ k) => !globalThis.document || !!document.querySelector(`[data-outline="${CSS.escape(k)}"]`);
			let i = from + to;
			while (i >= 0 && i < this.order.length && !on(this.order[i])) i += to;
			if (i < 0 || i >= this.order.length) return;
			at = i;
		}
		const rest = this.order.filter((k) => k !== id);
		if (at === undefined) at = rest.indexOf(/** @type {string} */ (to));
		if (at < 0) return;
		rest.splice(at, 0, id);
		this.order = rest;
		try {
			globalThis.localStorage?.setItem(this.key, JSON.stringify(this.order));
		} catch {
			/* Storage forbidden: the order lasts until the page goes. */
		}
	};
}
