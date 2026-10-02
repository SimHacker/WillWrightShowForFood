import type { Graph, GraphNode, Key, Link, Props, Value } from "./graph.js";
import type { RingImage } from "./image.js";
import { blockWords, car, cdr, RingBuilder, toArray } from "./cells.js";
import { addrOf, isAtom, NIL } from "./words.js";

/**
 * The graph as a PIXIE ring structure. Every value is a cell whose car
 * is a type atom and whose cdr is the payload; links are real pointers
 * to node cells, so the wire image is the network itself, not a table
 * that names it. Strings pack two 9-bit chars per word in a block,
 * which relocation leaves alone. Values are hash-consed: equal strings,
 * lists and maps share one structure, so a ring is a DAG under its nodes
 * and repeated verb lists or empty maps cost one cell, not one per use.
 *
 *   graph   list (meta-map, list of nodes)       — SAVINS names it
 *   node    cell (id-value . list (props-map, list of links))
 *   link    list (target, props-map)  target: NODE ref, key, or NULL
 *   map     list of pairs, pair = cell (key-string . value)
 */
const T = { NULL: 0, FALSE: 1, TRUE: 2, INT: 3, NUM: 4, STR: 5, LIST: 6, MAP: 7, NODE: 8 } as const;

const ATOM_MAX = 0o17777;

/** A string as block raw words: its length, then two 9-bit chars per word. */
export function packChars(s: string): number[] {
	const raw = [s.length];
	for (let i = 0; i < s.length; i += 2) {
		const hi = s.charCodeAt(i);
		const lo = i + 1 < s.length ? s.charCodeAt(i + 1) : 0;
		if (hi > 0o777 || lo > 0o777) throw new Error(`char beyond 9 bits in ${JSON.stringify(s)}`);
		raw.push((hi << 9) | lo);
	}
	return raw;
}

export function unpackChars(image: RingImage, block: number): string {
	const [len = 0, ...raw] = blockWords(image, block);
	let s = "";
	for (const w of raw) s += String.fromCharCode(w >>> 9, w & 0o777);
	return s.slice(0, len);
}

export function graphToRing(graph: Graph, beg = 0o100): RingImage {
	const b = new RingBuilder(beg);
	const strings = new Map<string, number>();
	const ids = new Map<Key, number>();

	const str = (s: string): number => {
		const have = strings.get(s);
		if (have !== undefined) return have;
		const name = b.cell(T.STR, b.block(packChars(s)));
		strings.set(s, name);
		return name;
	};

	const shared = new Map<string, number>();
	const value = (v: Value): number => {
		if (typeof v === "string") return str(v);
		const sig = JSON.stringify(v);
		const have = shared.get(sig);
		if (have !== undefined) return have;
		const name = fresh(v);
		shared.set(sig, name);
		return name;
	};

	const fresh = (v: Value): number => {
		if (v === null) return b.cell(T.NULL, NIL);
		if (v === false) return b.cell(T.FALSE, NIL);
		if (v === true) return b.cell(T.TRUE, NIL);
		if (typeof v === "number") {
			if (Number.isInteger(v) && v >= 0 && v <= ATOM_MAX) return b.cell(T.INT, b.atom(v));
			return b.cell(T.NUM, str(String(v)));
		}
		if (typeof v === "string") return str(v);
		if (Array.isArray(v)) return b.cell(T.LIST, b.list(v.map(value)));
		return b.cell(T.MAP, b.list(Object.entries(v).map(([k, x]) => b.cell(str(k), value(x)))));
	};

	const map = (props: Props): number => value(props);

	const key = (k: Key): number => value(k);

	const refs = new Map<Key, number>();
	const ref = (k: Key): number => {
		let name = refs.get(k);
		if (name === undefined) refs.set(k, (name = b.cell(T.NODE, ids.get(k)!)));
		return name;
	};

	const link = (l: Link): number => {
		const target = l.to === undefined ? value(null) : ids.has(l.to) ? ref(l.to) : key(l.to);
		return b.list([target, map(l.props)]);
	};

	// Node cells first, so links anywhere can point at any of them.
	const nodeNames = graph.nodes.map((n) => {
		if (ids.has(n.id)) throw new Error(`duplicate node id ${n.id}`);
		const name = b.cell(key(n.id), NIL);
		ids.set(n.id, name);
		return name;
	});
	graph.nodes.forEach((n, i) => {
		b.setCdr(nodeNames[i]!, b.list([map(n.props), b.list(n.links.map(link))]));
	});
	b.savins = b.list([map(graph.meta), b.list(nodeNames)]);
	return b.build();
}

export function ringToGraph(image: RingImage): Graph {
	const nodeIds = new Map<number, Key>();

	const text = (name: number): string => unpackChars(image, cdr(image, name));

	const value = (name: number): Value => {
		const tag = car(image, name);
		if (!isAtom(tag)) throw new Error(`value at ${addrOf(name).toString(8)} has no type atom`);
		switch (tag) {
			case T.NULL:
				return null;
			case T.FALSE:
				return false;
			case T.TRUE:
				return true;
			case T.INT:
				return cdr(image, name);
			case T.NUM:
				return Number(text(cdr(image, name)));
			case T.STR:
				return text(name);
			case T.LIST:
				return toArray(image, cdr(image, name)).map(value);
			case T.MAP:
				return map(name);
			default:
				throw new Error(`unknown type atom ${tag} at ${addrOf(name).toString(8)}`);
		}
	};

	const map = (name: number): Props => {
		const out: Props = {};
		for (const pair of toArray(image, cdr(image, name))) {
			out[text(car(image, pair))] = value(cdr(image, pair));
		}
		return out;
	};

	const key = (name: number): Key => {
		const v = value(name);
		if (typeof v !== "string" && typeof v !== "number") throw new Error("node id is not a key");
		return v;
	};

	const [metaName, nodesName] = toArray(image, image.savins);
	if (metaName === undefined || nodesName === undefined) throw new Error("graph root is not a pair");
	const nodeNames = toArray(image, nodesName);
	for (const n of nodeNames) nodeIds.set(addrOf(n), key(car(image, n)));

	const nodes = nodeNames.map((n): GraphNode => {
		const [props, links] = toArray(image, cdr(image, n));
		return {
			id: nodeIds.get(addrOf(n))!,
			props: map(props!),
			links: toArray(image, links!).map((l): Link => {
				const [target, lprops] = toArray(image, l);
				const tag = car(image, target!);
				const props = map(lprops!);
				if (tag === T.NODE) return { to: nodeIds.get(addrOf(cdr(image, target!)))!, props };
				if (tag !== T.NULL) return { to: key(target!), props };
				return { props };
			}),
		};
	});
	return { meta: map(metaName), nodes };
}
