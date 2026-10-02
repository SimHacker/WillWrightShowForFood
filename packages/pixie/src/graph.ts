import { Document, isMap, isScalar, isSeq, parseDocument } from "yaml";
import type { Node as YamlNode } from "yaml";

/**
 * The generic graph: named nodes with properties and ordered links.
 * One model, two text views (JSON, YAML) and one wire view (graph-ring.ts).
 * PSIBER's dictionary networks map onto it one dict to one node.
 *
 * Reserved keys: `nodes` at the top, `id` and `links` on a node, `to` on a link.
 */
export type Value = null | boolean | number | string | Value[] | { [k: string]: Value };
export type Key = string | number;
export type Props = { [k: string]: Value };
export type Link = { to?: Key; props: Props };
export type GraphNode = { id: Key; props: Props; links: Link[] };
export type Graph = { meta: Props; nodes: GraphNode[] };

type Data = { [k: string]: Value };

/** The plain-data shape both text views share. A link with no props is just its target. */
export function toData(graph: Graph): Data {
	return {
		...graph.meta,
		nodes: graph.nodes.map((n) => {
			const out: Data = { id: n.id, ...n.props };
			if (n.links.length > 0) {
				out.links = n.links.map((l): Value => {
					const empty = Object.keys(l.props).length === 0;
					if (empty && l.to !== undefined) return l.to;
					return l.to === undefined ? { ...l.props } : { to: l.to, ...l.props };
				});
			}
			return out;
		}),
	};
}

function isObject(v: unknown): v is Data {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isKey(v: unknown): v is Key {
	return typeof v === "string" || typeof v === "number";
}

export function fromData(data: unknown): Graph {
	if (!isObject(data)) throw new Error("graph: expected a mapping");
	const { nodes, ...meta } = data;
	if (!Array.isArray(nodes)) throw new Error("graph: `nodes` must be a sequence");
	return {
		meta,
		nodes: nodes.map((n, i) => {
			if (!isObject(n)) throw new Error(`graph: node ${i} is not a mapping`);
			const { id, links = [], ...props } = n;
			if (!isKey(id)) throw new Error(`graph: node ${i} has no id`);
			if (!Array.isArray(links)) throw new Error(`graph: node ${id} links must be a sequence`);
			return {
				id,
				props,
				links: links.map((l): Link => {
					if (isKey(l)) return { to: l, props: {} };
					if (!isObject(l)) throw new Error(`graph: node ${id} has a bad link`);
					const { to, ...rest } = l;
					if (to === undefined) return { props: rest };
					if (!isKey(to)) throw new Error(`graph: node ${id} link target is not a key`);
					return { to, props: rest };
				}),
			};
		}),
	};
}

export function toJson(graph: Graph): string {
	return `${JSON.stringify(toData(graph), null, "\t")}\n`;
}

export function fromJson(text: string): Graph {
	return fromData(JSON.parse(text));
}

/** Short all-scalar collections print on one line, the way a person would write them. */
function flowify(node: unknown, width = 72): boolean {
	if (isScalar(node)) return true;
	const items: unknown[] = isSeq(node)
		? node.items
		: isMap(node)
			? node.items.flatMap((p) => [p.key, p.value])
			: [];
	if (!isSeq(node) && !isMap(node)) return false;
	let simple = true;
	for (const it of items) if (!flowify(it, width)) simple = false;
	if (simple && String(node).length <= width) {
		node.flow = true;
		return true;
	}
	return false;
}

export function toDocument(graph: Graph): Document {
	const doc = new Document(toData(graph));
	flowify(doc.contents);
	return doc;
}

export function toYaml(graph: Graph): string {
	return toDocument(graph).toString({ lineWidth: 0 });
}

export function fromYaml(text: string): Graph {
	const doc = parseDocument(text);
	if (doc.errors.length > 0) throw doc.errors[0];
	return fromData(doc.toJS());
}

function keyOf(k: unknown): unknown {
	return isScalar(k) ? k.value : k;
}

function idOf(node: unknown): unknown {
	return isMap(node) ? node.get("id") : undefined;
}

/** Write `value` over `current`, reusing every node that survives so its comments do. */
function assign(doc: Document, current: unknown, value: unknown, prune: boolean): YamlNode {
	if (isObject(value) && isMap(current)) {
		for (const [k, v] of Object.entries(value)) {
			const pair = current.items.find((p) => keyOf(p.key) === k);
			if (pair) pair.value = assign(doc, pair.value, v, prune);
			else current.items.push(doc.createPair(k, v));
		}
		if (prune) current.items = current.items.filter((p) => String(keyOf(p.key)) in value);
		return current;
	}
	if (Array.isArray(value) && isSeq(current)) {
		const byId = value.every((v) => isObject(v) && isKey(v.id));
		if (byId) {
			const old = new Map(current.items.map((it) => [idOf(it), it]));
			const ids = new Set(value.map((v) => (v as Data).id));
			const kept = prune ? [] : current.items.filter((it) => !ids.has(idOf(it) as Key));
			current.items = [
				...value.map((v) => assign(doc, old.get((v as Data).id), v, prune)),
				...kept,
			];
			return current;
		}
		current.items = value.map((v, i) => assign(doc, current.items[i], v, prune));
		return current;
	}
	if (isScalar(current) && !isObject(value) && !Array.isArray(value)) {
		current.value = value;
		return current;
	}
	const fresh = doc.createNode(value);
	flowify(fresh);
	return fresh;
}

/**
 * Save a graph into existing YAML text, keeping its comments, key order
 * and hand formatting wherever the data still stands. Nodes match by id.
 * With `prune: false` keys and nodes the graph lacks are kept — hand
 * additions like coordinates survive a re-import from source.
 */
export function saveInto(text: string, graph: Graph, opts: { prune?: boolean } = {}): string {
	const doc = parseDocument(text);
	if (doc.errors.length > 0) throw doc.errors[0];
	doc.contents = assign(doc, doc.contents, toData(graph), opts.prune ?? true) as typeof doc.contents;
	return doc.toString({ lineWidth: 0 });
}
