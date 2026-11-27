// A machine page's toolbar under the screen, made by the person: anything in the outline
// with a 📌 by it can be put in the toolbar, and ⏏️ takes it out again. The toolbar shows a
// copy; the original stays at home in the outline, and both work.
//
// Two kinds, so a person picks the grain: a control (a button, a slider, a menu) goes on the
// toolbar's row, left to right; a panel (the panel's 15 bytes, the registers, the music seed)
// goes in a column under the row. Each keeps a bit, in the toolbar or not, and an index, its
// place. Putting one in gives it the place after the last; dragging it moves it among its
// kind. Kept per machine in this browser; until the person changes it, a machine's DEFAULTS.
// The row has two ends: most controls sit at its left, a readout (the speed) at its right, and
// dragging one onto the other end's items moves it there. A default the person has never had
// (one added since they arranged theirs) joins their toolbar; one they took out stays out.
//
// The component that owns a control or panel offers it (offer), as a snippet taking one
// argument: true for the toolbar's compact look, false for its home. One whose owner is not
// on the page (the dance before there is one) is left out of the toolbar until it comes back.
// A pinned panel opens and closes; closed, it shows its `brief` beside its title, if it offered
// one: a line of what matters and the buttons used most.

import { untrack } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { seekHome } from './outline-reveal.svelte.js';

/** @typedef {import('svelte').Snippet<[boolean]>} Control */
/** @typedef {'control' | 'panel'} Kind */
/** @typedef {'left' | 'right'} Side */
/** @typedef {import('svelte').Snippet} Brief */
/** @typedef {{ on: boolean, at: number, side?: Side, shut?: boolean }} Place */

/** The toolbar a new player gets, by machine: the machine, time, then what reaches it, the music; and how fast. */
const DEFAULTS = /** @type {Record<string, { left: string[], right: string[] }>} */ ({
	apple: { left: ['reboot', 'reset', 'pause', 'step', 'speed', 'mute', 'caps', 'joystick', 'dance-play', 'jiggle'], right: ['readout'] },
	pdp10: { left: ['restart', 'speed', 'tty-view', 'baud', 'tty-speak', 'altmode', 'ctrl-z', 'ctrl-g', 'copy-paper', 'dance-play', 'jiggle'], right: ['readout'] },
	pdp7: { left: ['dance-play', 'jiggle'], right: [] }
});

export class Toolbar {
	#key;
	#defaults;
	/** @type {Record<string, Place>} */
	places = $state({});
	/** What is on the page now, by id. @type {SvelteMap<string, { label: string, render: Control, kind: Kind, home: string[], brief?: Brief }>} */
	controls = new SvelteMap();
	/** How many toolbars show this one; with none, there is nowhere to put a control. */
	live = $state(0);
	/** What is in the toolbar, in order, by id. */
	pinned = $derived(
		Object.entries(this.places)
			.filter(([, p]) => p.on)
			.sort((a, b) => a[1].at - b[1].at)
			.map(([id]) => id)
	);

	/** @param {string} machine */
	constructor(machine) {
		this.#key = `toolbar-${machine}`;
		this.#defaults = DEFAULTS[machine] ?? { left: [], right: [] };
		let kept = null;
		try {
			kept = JSON.parse(globalThis.localStorage?.getItem(this.#key) ?? 'null');
		} catch {
			/* Unreadable: the defaults. */
		}
		if (kept && typeof kept === 'object') this.places = kept;
		this.#fill();
	}

	/** Put in the defaults the toolbar has never had a place for. */
	#fill() {
		for (const side of /** @type {Side[]} */ (['left', 'right'])) for (const id of this.#defaults[side]) if (!this.places[id]) this.#put(id, side);
	}

	/** Back to the machine's defaults, as a new player gets them. */
	reset() {
		this.places = {};
		this.#fill();
		try {
			globalThis.localStorage?.removeItem(this.#key);
		} catch {
			/* Storage forbidden: nothing kept to forget. */
		}
	}

	/** Which end of the row a control is at. @param {string} id @returns {Side} */
	side(id) {
		return this.places[id]?.side ?? 'left';
	}

	/** @param {string} id */
	has(id) {
		return !!this.places[id]?.on;
	}

	/** @param {string} id @param {Side} [side] */
	#put(id, side = 'left') {
		const last = Math.max(-1, ...Object.values(this.places).map((p) => p.at));
		this.places[id] = { on: true, at: last + 1, ...(side === 'right' ? { side } : {}) };
	}

	/**
	 * Put a control in the toolbar, last at the left end, always, wherever it was before: the 📌
	 * has one target, and the right end is what the person drags there.
	 * @param {string} id
	 */
	pin(id) {
		this.#put(id);
		this.#save();
	}

	/** Take a control out; its place goes when it is put back. @param {string} id */
	unpin(id) {
		const p = this.places[id];
		if (!p) return;
		p.on = false;
		this.#save();
	}

	/** Whether a pinned panel is closed to its title and brief. @param {string} id */
	isShut(id) {
		return !!this.places[id]?.shut;
	}

	/** Open or close a pinned panel. @param {string} id */
	toggleShut(id) {
		const p = this.places[id];
		if (!p) return;
		if (p.shut) delete p.shut;
		else p.shut = true;
		this.#save();
	}

	/** @param {string} id */
	toggle(id) {
		if (this.has(id)) this.unpin(id);
		else this.pin(id);
	}

	/**
	 * Move `id` before `to` (and to `to`'s end of the row), or one place back (-1) or on (1)
	 * among its neighbours at its end. The pinned of its kind have their places dealt out again
	 * in the new order, so the other kind keeps its own.
	 * @param {string} id @param {string | number} to
	 */
	move(id, to) {
		const kind = this.controls.get(id)?.kind;
		const list = this.pinned.filter((k) => this.controls.get(k)?.kind === kind);
		if (!list.includes(id)) return;
		const rest = list.filter((k) => k !== id);
		let at;
		if (typeof to === 'number') {
			const mine = list.filter((k) => this.side(k) === this.side(id));
			const next = mine[mine.indexOf(id) + to];
			if (!next) return;
			at = rest.indexOf(next) + (to > 0 ? 1 : 0);
		} else {
			at = rest.indexOf(to);
			if (at < 0) return;
			this.#side(id, this.side(to));
		}
		rest.splice(at, 0, id);
		const places = list.map((k) => this.places[k].at).sort((a, b) => a - b);
		rest.forEach((k, i) => (this.places[k].at = places[i]));
		this.#save();
	}

	/** Move a control to the end of the row's `side`, last there. @param {string} id @param {Side} side */
	toSide(id, side) {
		const p = this.places[id];
		if (!p?.on) return;
		this.#side(id, side);
		p.at = Math.max(-1, ...Object.values(this.places).map((q) => q.at)) + 1;
		this.#save();
	}

	/** @param {string} id @param {Side} side */
	#side(id, side) {
		const p = this.places[id];
		if (side === 'right') p.side = side;
		else delete p.side;
	}

	/**
	 * Offer a control or panel to the toolbar and its home; returns the withdrawal, for an
	 * $effect's cleanup.
	 * @param {string} id @param {string} label what the 📌 and ⏏️ tooltips call it @param {Control} render
	 * @param {Kind} [kind] a control goes on the row, a panel under it
	 * @param {string[]} [home] the outline nodes it is under, from the top down, opened to find it
	 * @param {Brief} [brief] a panel's line when it is closed in the toolbar
	 */
	offer(id, label, render, kind = 'control', home = [], brief = undefined) {
		// Untracked: the owner's $effect offers on what it reads, not on the registry it writes.
		untrack(() => this.controls.set(id, { label, render, kind, home, brief }));
		return () =>
			untrack(() => {
				if (this.controls.get(id)?.render === render) this.controls.delete(id);
			});
	}

	/** Go to a control or panel's home in the outline, opening the nodes it is under. @param {string} id */
	seek(id) {
		const c = this.controls.get(id);
		if (c) seekHome(c.home, id);
	}

	/** A toolbar shows this one; returns its going, for an $effect's cleanup. */
	show() {
		untrack(() => this.live++);
		return () => void untrack(() => this.live--);
	}

	#save() {
		try {
			globalThis.localStorage?.setItem(this.#key, JSON.stringify(this.places));
		} catch {
			/* Storage forbidden: the toolbar lasts until the page goes. */
		}
	}
}

/** @type {Map<string, Toolbar>} */
const toolbars = new Map();

/** The toolbar of one machine's pages, shared by everything on the page. @param {string} machine */
export function toolbar(machine) {
	let t = toolbars.get(machine);
	if (!t) toolbars.set(machine, (t = new Toolbar(machine)));
	return t;
}
