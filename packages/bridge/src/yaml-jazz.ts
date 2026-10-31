// YAML Jazz files that programs rewrite without losing what people wrote in them.
// makeYaml writes a new file, with notes as comments. mergeYaml puts new values into an
// existing file: comments stay on the nodes they were written on, keys stay in their
// order, keys the program doesn't own (someone's `notes:`, a soul's annotations) are left
// alone, and a value that didn't change keeps its node and its formatting.

import { Document, isMap, isScalar, isSeq, parseDocument, Scalar, YAMLMap, YAMLSeq, type Node, type Pair } from "yaml";

export type Plain = null | boolean | number | string | Plain[] | { [key: string]: Plain };
export type Path = readonly (string | number)[];

export interface JazzOptions {
	/** Comment for the value at `path`, written when the node is first made. */
	note?: (path: Path) => string | undefined;
	/** Whether a collection is written on one line. Default: only scalars inside, and short. */
	flow?: (path: Path, value: Plain) => boolean;
	/** Keys that identify list entries (slot, index, level), so merged lists match by entry, not position. */
	identity?: readonly string[];
	/** Keys a program owns and may delete when its value no longer has them. Other missing keys are kept. */
	owned?: (path: Path, key: string) => boolean;
	/** Comment at the top of a new file. */
	header?: string;
}

const STRING_OPTIONS = { lineWidth: 0, minContentWidth: 0, flowCollectionPadding: false } as const;

// YAML's printable set leaves out the C0 controls but tab, LF and CR, DEL, and the C1 controls
// but NEL, and readers take NEL, LS and PS as line breaks, even inside a comment. The yaml
// package writes them raw. Strings with them are double-quoted, then escaped; in a comment
// the escape is just text. A tab in a one-line plain scalar is refused too, so those quote.
const UNPRINTABLE = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\u2028\u2029]/;
const UNPRINTABLE_ALL = new RegExp(UNPRINTABLE.source, "g");

function emit(doc: Document): string {
	return doc.toString(STRING_OPTIONS).replace(UNPRINTABLE_ALL, (c) => {
		const n = c.charCodeAt(0);
		return n < 0x100 ? `\\x${n.toString(16).padStart(2, "0")}` : `\\u${n.toString(16).padStart(4, "0")}`;
	});
}

const mustQuote = (v: string) => UNPRINTABLE.test(v) || (v.includes("\t") && !v.includes("\n"));

function styleString(s: Scalar, v: Plain): void {
	if (typeof v !== "string") return;
	if (mustQuote(v)) s.type = Scalar.QUOTE_DOUBLE;
	else if (v.includes("\n")) s.type = Scalar.BLOCK_LITERAL;
}

export function makeYaml(value: Plain, options: JazzOptions = {}): string {
	const doc = new Document();
	doc.contents = build(doc, value, [], options) as never;
	if (options.header) doc.commentBefore = options.header;
	return emit(doc);
}

/** `text` with `value` merged in. Empty or unparsable text makes a new file instead. */
export function mergeYaml(text: string | undefined, value: Plain, options: JazzOptions = {}): string {
	if (!text?.trim()) return makeYaml(value, options);
	const doc = parseDocument(text);
	if (doc.errors.length) throw new Error(`cannot merge into YAML with errors: ${doc.errors[0]?.message}`);
	doc.contents = update(doc, doc.contents as Node | null, value, [], options) as never;
	return emit(doc);
}

const isObject = (v: Plain): v is { [key: string]: Plain } => typeof v === "object" && v !== null && !Array.isArray(v);
const isLeaf = (v: Plain) => v === null || typeof v !== "object";

function defaultFlow(v: Plain): boolean {
	const leaves = Array.isArray(v) ? v : isObject(v) ? Object.values(v) : [];
	if (!leaves.every(isLeaf) || leaves.length === 0) return false;
	return JSON.stringify(v).length <= 72;
}

function build(doc: Document, v: Plain, path: Path, o: JazzOptions): Node {
	let node: Node;
	if (Array.isArray(v)) {
		const seq = new YAMLSeq();
		v.forEach((x, i) => seq.items.push(noted(build(doc, x, [...path, i], o), undefined, [...path, i], o)));
		seq.flow = v.length === 0 || (o.flow ?? ((_p, x) => defaultFlow(x)))(path, v);
		node = seq;
	} else if (isObject(v)) {
		const map = new YAMLMap();
		for (const [k, x] of Object.entries(v)) map.items.push(makePair(doc, k, x, [...path, k], o));
		map.flow = Object.keys(v).length === 0 || (o.flow ?? ((_p, x) => defaultFlow(x)))(path, v);
		node = map;
	} else {
		const s = new Scalar(v);
		styleString(s, v);
		node = s;
	}
	return node;
}

function makePair(doc: Document, k: string, x: Plain, path: Path, o: JazzOptions): Pair {
	const pair = doc.createPair(k, null) as Pair;
	pair.value = build(doc, x, path, o);
	noted(pair.value as Node, pair, path, o);
	return pair;
}

/** Puts the note for `path` on the line it describes: after a scalar or a one-line
 * collection, above the key of a block collection. */
function noted(node: Node, pair: Pair | undefined, path: Path, o: JazzOptions): Node {
	const note = o.note?.(path);
	if (!note) return node;
	const oneLine = isScalar(node) || ((isMap(node) || isSeq(node)) && node.flow);
	if (oneLine) node.comment = ` ${note}`;
	else if (pair && isScalar(pair.key)) pair.key.commentBefore = ` ${note}`;
	else node.commentBefore = ` ${note}`;
	return node;
}

function keyOf(p: Pair): string {
	return isScalar(p.key) ? String(p.key.value) : String(p.key);
}

function carryComments(from: Node, to: Node): Node {
	if (from.commentBefore) to.commentBefore = from.commentBefore;
	if (from.comment) to.comment = from.comment;
	return to;
}

function sameKind(node: Node | null, v: Plain): boolean {
	if (Array.isArray(v)) return isSeq(node);
	if (isObject(v)) return isMap(node);
	return isScalar(node);
}

function update(doc: Document, node: Node | null, v: Plain, path: Path, o: JazzOptions): Node {
	if (!node || !sameKind(node, v)) {
		const made = noted(build(doc, v, path, o), undefined, path, o);
		return node ? carryComments(node, made) : made;
	}
	if (isScalar(node)) {
		if (node.value !== v) {
			node.value = v;
			styleString(node, v);
		} else if (typeof v === "string" && mustQuote(v)) node.type = Scalar.QUOTE_DOUBLE;
		return node;
	}
	if (isMap(node) && isObject(v)) {
		const pairs = node.items as Pair[];
		const keys = Object.keys(v);
		for (const [i, k] of keys.entries()) {
			const at = pairs.findIndex((p) => keyOf(p) === k);
			const x = v[k] as Plain;
			if (at >= 0) {
				const p = pairs[at]!;
				p.value = update(doc, p.value as Node | null, x, [...path, k], o);
				continue;
			}
			// A new key goes after the nearest earlier key the file already has.
			let after = -1;
			for (let j = i - 1; j >= 0 && after < 0; j--) after = pairs.findIndex((p) => keyOf(p) === keys[j]);
			pairs.splice(after + 1, 0, makePair(doc, k, x, [...path, k], o));
		}
		node.items = pairs.filter((p) => hasKey(v, keyOf(p)) || !(o.owned?.(path, keyOf(p)) ?? false)) as never;
		return node;
	}
	if (isSeq(node) && Array.isArray(v)) {
		const items = node.items as Node[];
		const id = identityKey(v, o.identity);
		if (id) {
			const byId = new Map<string, Node>();
			for (const n of items) {
				const key = isMap(n) ? n.get(id) : undefined;
				if (key !== undefined) byId.set(String(key), n);
			}
			node.items = v.map((x, i) => {
				const old = byId.get(String((x as { [key: string]: Plain })[id]));
				return old ? update(doc, old, x, [...path, i], o) : noted(build(doc, x, [...path, i], o), undefined, [...path, i], o);
			}) as never;
		} else {
			node.items = v.map((x, i) => update(doc, items[i] ?? null, x, [...path, i], o)) as never;
		}
		return node;
	}
	return node;
}

function hasKey(v: { [key: string]: Plain }, k: string): boolean {
	return Object.prototype.hasOwnProperty.call(v, k);
}

function identityKey(v: Plain[], keys: readonly string[] | undefined): string | undefined {
	if (!keys || v.length === 0 || !v.every(isObject)) return undefined;
	return keys.find((k) => v.every((x) => isObject(x) && hasKey(x, k)));
}
