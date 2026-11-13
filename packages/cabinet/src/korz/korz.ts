/**
 * Korz dispatch: one sea of guarded slots per machine. KORZ-DISPATCH.md is the design; this file is
 * step 1, the interpreter. Every dispatch searches the selector's slots, so it is slow and
 * obviously right, and it is the oracle the resolver and compiler are tested against.
 *
 * A dimension is a named coordinate over 0 .. 2^width - 1. A guard constrains some dimensions to
 * sets; an unmentioned dimension is its whole domain. A context is a point: an object whose fields
 * named for the dimensions hold numbers. Slot A is at least as specific as B when A's set is inside
 * B's on every dimension. A dispatch runs the most specific matching slot of each layer, outermost
 * layer first; `next` runs the rest of the chain.
 */

export type Bits = { readonly mask: number; readonly match: number };
export type Span = { readonly start: number; readonly length: number };
/** A number, an enum member's name, a mask and match, or a span. A list is their union. */
export type Coord = number | string | Bits | Span;
export type GuardSpec = Readonly<Record<string, Coord | readonly Coord[]>>;

export const bits = (mask: number, match: number): Bits => ({ mask, match });
export const span = (start: number, length: number): Span => ({ start, length });

export type Dim = {
	readonly name: string;
	readonly width: number;
	/** Enum members, in value order. A guard may name them. */
	readonly names?: readonly string[];
};

export const LAYERS = ["observe", "patch", "machine"] as const;
export type Layer = (typeof LAYERS)[number];

export type Next = () => number;
export type Run<C> = (c: C, next: Next) => number | void;

export type SlotSpec<C> = {
	readonly selector: string;
	readonly guard?: GuardSpec;
	readonly layer?: Layer;
	/** Who installed it. A slot installed again with the same selector, layer, guard and `by` replaces the old one. */
	readonly by: string;
	readonly run: Run<C>;
};

/** A set over one dimension's domain, as a bitset; `null` is the whole domain. */
type DimSet = Uint32Array | null;

export class Slot<C> {
	constructor(
		readonly selector: string,
		readonly layer: Layer,
		readonly by: string,
		readonly run: Run<C>,
		/** Per dimension, in the sea's dimension order. */
		readonly sets: readonly DimSet[],
		/** Indices of the dimensions this slot constrains. */
		readonly constrained: readonly number[],
	) {}
}

export class AmbiguityError extends Error {}

export type WhyLine = {
	slot: string;
	layer: Layer;
	matched: boolean;
	/** Why it ran, where it sits in the chain, or the first dimension that rules it out. */
	reason: string;
	/** Position in the chain that ran, or -1. */
	order: number;
};

export class Sea<C extends object> {
	readonly dims: readonly Dim[];
	/** Bumped by every install and remove; resolved tables record the generation they were built at. */
	generation = 0;
	/** Install-time checks too large to enumerate; the interpreter still throws if one ever happens. */
	readonly unchecked: string[] = [];
	private readonly index = new Map<string, number>();
	private readonly bySelector = new Map<string, Slot<C>[]>();

	constructor(dims: readonly Dim[]) {
		this.dims = dims;
		dims.forEach((d, i) => {
			if (d.width < 1 || d.width > 20) throw new Error(`dimension ${d.name}: width ${d.width} is outside 1..20`);
			this.index.set(d.name, i);
		});
	}

	slots(selector?: string): readonly Slot<C>[] {
		if (selector !== undefined) return this.bySelector.get(selector) ?? [];
		return [...this.bySelector.values()].flat();
	}

	/** Add slots as one transaction: all of them, or none and an AmbiguityError naming the conflict. */
	install(specs: readonly SlotSpec<C>[]): Slot<C>[] {
		const made = specs.map((s) => this.make(s));
		const saved = new Map([...this.bySelector].map(([k, v]) => [k, [...v]]));
		try {
			for (const s of made) {
				const list = this.bySelector.get(s.selector) ?? [];
				const same = list.findIndex((t) => t.layer === s.layer && equalGuards(s, t));
				if (same >= 0) {
					if (list[same]!.by !== s.by)
						throw new AmbiguityError(`${s.selector}: "${s.by}" and "${list[same]!.by}" have equal guards`);
					list.splice(same, 1);
				}
				list.push(s);
				this.bySelector.set(s.selector, list);
			}
			for (const s of made) this.check(s);
		} catch (e) {
			this.bySelector.clear();
			for (const [k, v] of saved) this.bySelector.set(k, v);
			throw e;
		}
		this.generation += 1;
		return made;
	}

	/** Remove slots by identity or by `by`. Returns how many went. */
	remove(which: Slot<C> | string): number {
		let n = 0;
		for (const [k, list] of this.bySelector) {
			const keep = list.filter((s) => (typeof which === "string" ? s.by !== which : s !== which));
			n += list.length - keep.length;
			this.bySelector.set(k, keep);
		}
		if (n) this.generation += 1;
		return n;
	}

	/** Run the chain for this context. A selector with no matching slot is an error: install a base case. */
	dispatch(selector: string, c: C): number {
		const chain = this.chain(selector, c);
		if (chain.length === 0) throw new Error(`${selector}: no slot matches ${this.describe(c)}`);
		const call = (i: number): number => {
			const s = chain[i];
			if (s === undefined) throw new Error(`${selector}: next() past the last slot, from "${chain[i - 1]!.by}"`);
			return s.run(c, () => call(i + 1)) ?? 0;
		};
		return call(0);
	}

	/** The slots that would run, in order. A layer whose matches have no single most specific slot throws. */
	chain(selector: string, c: C): Slot<C>[] {
		const matching = (this.bySelector.get(selector) ?? []).filter((s) => this.matches(s, c));
		const out: Slot<C>[] = [];
		for (const layer of LAYERS) {
			let rest = matching.filter((s) => s.layer === layer);
			let first = true;
			while (rest.length) {
				const min = rest.find((m) => rest.every((o) => o === m || le(m, o)));
				if (!min) {
					if (first) {
						const names = rest.map((s) => `"${s.by}"`).join(", ");
						throw new AmbiguityError(`${selector}: no single most specific slot among ${names} at ${this.describe(c)}`);
					}
					const names = rest.map((s) => `"${s.by}"`).join(", ");
					const at = this.describe(c);
					out.push(new Slot(selector, layer, "ambiguous next", () => {
						throw new AmbiguityError(`${selector}: next() has no single most specific slot among ${names} at ${at}`);
					}, [], []));
					break;
				}
				out.push(min);
				rest = rest.filter((s) => s !== min);
				first = false;
			}
		}
		return out;
	}

	/** Every slot of the selector, whether it matched, and why it ran, lost or was ruled out. */
	why(selector: string, c: C): WhyLine[] {
		let chain: Slot<C>[] = [];
		try {
			chain = this.chain(selector, c);
		} catch {
			chain = [];
		}
		return (this.bySelector.get(selector) ?? []).map((s) => {
			const order = chain.indexOf(s);
			const miss = s.constrained.find((d) => !has(s.sets[d]!, this.coord(c, d)));
			let reason: string;
			if (miss !== undefined) reason = `doesn't match on ${this.dims[miss]!.name} = ${this.coord(c, miss).toString(8)}`;
			else if (order === 0) reason = "runs first";
			else if (order > 0) reason = `runs if "${chain[order - 1]!.by}" calls next`;
			else reason = "matches, but no single most specific slot";
			return { slot: s.by, layer: s.layer, matched: miss === undefined, reason, order };
		});
	}

	/** Slots whose guards intersect the query: "everything that touches page 07", "everything the 340 installed". */
	view(query: GuardSpec, selector?: string): Slot<C>[] {
		const q = this.normalize(query);
		return this.slots(selector).filter((s) => s.sets.every((set, d) => !isEmpty(intersect(set, q[d]!))));
	}

	private make(spec: SlotSpec<C>): Slot<C> {
		const sets = this.normalize(spec.guard ?? {});
		const constrained = sets.flatMap((s, i) => (s === null ? [] : [i]));
		return new Slot(spec.selector, spec.layer ?? "machine", spec.by, spec.run, sets, constrained);
	}

	private normalize(guard: GuardSpec): DimSet[] {
		const sets: DimSet[] = this.dims.map(() => null);
		for (const [name, value] of Object.entries(guard)) {
			const i = this.index.get(name);
			if (i === undefined) throw new Error(`no dimension named ${name}`);
			const d = this.dims[i]!;
			const set = new Uint32Array(Math.max(1, (1 << d.width) >>> 5));
			for (const coord of Array.isArray(value) ? value : [value]) addCoord(set, d, coord);
			sets[i] = isFull(set, d.width) ? null : set;
		}
		return sets;
	}

	private matches(s: Slot<C>, c: C): boolean {
		for (const d of s.constrained) if (!has(s.sets[d]!, this.coord(c, d))) return false;
		return true;
	}

	private coord(c: C, d: number): number {
		return (c as Record<string, number>)[this.dims[d]!.name] ?? 0;
	}

	private describe(c: C): string {
		return this.dims.map((d, i) => `${d.name}=${this.coord(c, i).toString(8)}`).join(" ");
	}

	/**
	 * Install-time ambiguity: for each slot overlapping `s` in its selector and layer with neither
	 * more specific, every point of the overlap needs a slot more specific than both. Points are
	 * enumerated over the dimensions those slots constrain; past a million the pair is listed in
	 * `unchecked` and left to the interpreter.
	 */
	private check(s: Slot<C>): void {
		const peers = (this.bySelector.get(s.selector) ?? []).filter((t) => t !== s && t.layer === s.layer);
		for (const t of peers) {
			if (le(s, t) || le(t, s)) continue;
			const both = s.sets.map((x, d) => intersect(x, t.sets[d]!));
			if (both.some(isEmpty)) continue;
			const below = peers.concat([s]).filter((u) => u !== t && u !== s && le(u, s) && le(u, t));
			const dims = [...new Set([...s.constrained, ...t.constrained, ...below.flatMap((u) => u.constrained)])];
			const members = dims.map((d) => elements(both[d]!, this.dims[d]!.width));
			const total = members.reduce((n, m) => n * m.length, 1);
			if (total > 1_000_000) {
				this.unchecked.push(`${s.selector}: "${s.by}" and "${t.by}", ${total} points`);
				continue;
			}
			const point = new Array<number>(this.dims.length).fill(0);
			const walk = (k: number): void => {
				if (k === dims.length) {
					if (!below.some((u) => u.constrained.every((d) => has(u.sets[d]!, point[d]!)))) {
						const at = dims.map((d) => `${this.dims[d]!.name}=${point[d]!.toString(8)}`).join(" ");
						throw new AmbiguityError(`${s.selector}: "${s.by}" and "${t.by}" are ambiguous at ${at}`);
					}
					return;
				}
				for (const v of members[k]!) {
					point[dims[k]!] = v;
					walk(k + 1);
				}
			};
			walk(0);
		}
	}
}

function addCoord(set: Uint32Array, d: Dim, coord: Coord): void {
	const size = 1 << d.width;
	const put = (v: number): void => {
		if (v < 0 || v >= size) throw new Error(`${d.name}: ${v} is outside 0..${size - 1}`);
		set[v >>> 5]! |= 1 << (v & 31);
	};
	if (typeof coord === "number") put(coord);
	else if (typeof coord === "string") {
		const v = d.names?.indexOf(coord) ?? -1;
		if (v < 0) throw new Error(`${d.name}: no member named ${coord}`);
		put(v);
	} else if ("mask" in coord) {
		for (let v = 0; v < size; v += 1) if ((v & coord.mask) === coord.match) put(v);
	} else {
		for (let v = coord.start; v < coord.start + coord.length; v += 1) put(v);
	}
}

function has(set: DimSet, v: number): boolean {
	return set === null || ((set[v >>> 5]! >>> (v & 31)) & 1) === 1;
}

function isFull(set: Uint32Array, width: number): boolean {
	if (width < 5) return set[0] === (1 << (1 << width)) - 1;
	return set.every((w) => w === 0xffffffff);
}

function isEmpty(set: DimSet): boolean {
	return set !== null && set.every((w) => w === 0);
}

function intersect(a: DimSet, b: DimSet): DimSet {
	if (a === null) return b;
	if (b === null) return a;
	return a.map((w, i) => w & b[i]!);
}

function subset(a: DimSet, b: DimSet): boolean {
	if (b === null) return true;
	if (a === null) return false;
	return a.every((w, i) => (w & ~b[i]!) === 0);
}

function le<C>(a: Slot<C>, b: Slot<C>): boolean {
	return a.sets.every((s, d) => subset(s, b.sets[d]!));
}

function equalGuards<C>(a: Slot<C>, b: Slot<C>): boolean {
	return le(a, b) && le(b, a);
}

function elements(set: DimSet, width: number): number[] {
	const out: number[] = [];
	for (let v = 0; v < 1 << width; v += 1) if (has(set, v)) out.push(v);
	return out;
}
