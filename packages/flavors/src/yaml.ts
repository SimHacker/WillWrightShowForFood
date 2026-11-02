// YAML with its comments. A comment above a key is that key's `before`; a comment after a
// scalar or a one-line collection is its `after`.

import { Document, isMap, isScalar, isSeq, parseDocument, Scalar, YAMLMap, YAMLSeq, type Node, type Pair } from "yaml";
import { isMap as isPlainMap, pathKey, type Plain } from "./merge.js";
import type { Note, Notes } from "./notes.js";
import type { Syntax } from "./syntax.js";

function join(...parts: (string | null | undefined)[]): string | undefined {
	const kept = parts.filter((p): p is string => typeof p === "string" && p !== "");
	return kept.length ? kept.join("\n") : undefined;
}

function put(notes: Notes, path: string[], before: string | undefined, after: string | undefined): void {
	if (before === undefined && after === undefined) return;
	const n: Note = {};
	if (before !== undefined) n.before = before;
	if (after !== undefined) n.after = after;
	notes.set(pathKey(path), n);
}

function oneLine(node: unknown): boolean {
	return isScalar(node) || ((isMap(node) || isSeq(node)) && node.flow === true);
}

function read(node: unknown, path: string[], notes: Notes): void {
	if (isMap(node)) {
		for (const pair of node.items as Pair[]) {
			const key = isScalar(pair.key) ? String(pair.key.value) : String(pair.key);
			const at = [...path, key];
			const k = pair.key as Node | null;
			const v = pair.value as Node | null;
			const inline = v && oneLine(v);
			put(notes, at, join(k?.commentBefore, inline ? undefined : v?.commentBefore), inline ? join(v?.comment) : undefined);
			read(v, at, notes);
		}
	} else if (isSeq(node)) {
		(node.items as Node[]).forEach((item, i) => {
			const at = [...path, `[#${i}]`];
			put(notes, at, join(item?.commentBefore), oneLine(item) ? join(item?.comment) : undefined);
			read(item, at, notes);
		});
	}
}

function flowFits(v: Plain): boolean {
	const items = Array.isArray(v) ? v : isPlainMap(v) ? Object.values(v) : [];
	if (items.length === 0) return true;
	return items.every((x) => x === null || typeof x !== "object") && JSON.stringify(v).length <= 72;
}

function build(doc: Document, v: Plain, path: string[], notes: Notes | undefined): Node {
	if (Array.isArray(v)) {
		const seq = new YAMLSeq();
		seq.flow = flowFits(v);
		v.forEach((x, i) => {
			const at = [...path, `[#${i}]`];
			const item = build(doc, x, at, notes);
			const n = notes?.get(pathKey(at));
			if (!seq.flow) {
				if (n?.before) item.commentBefore = n.before;
				if (n?.after && oneLine(item)) item.comment = n.after;
			}
			seq.items.push(item);
		});
		return seq;
	}
	if (isPlainMap(v)) {
		const map = new YAMLMap();
		map.flow = Object.keys(v).length === 0 || (path.length > 0 && flowFits(v) && !hasNotesUnder(notes, path));
		for (const [k, x] of Object.entries(v)) {
			const at = [...path, k];
			const pair = doc.createPair(k, null) as Pair;
			const value = build(doc, x, at, notes);
			pair.value = value;
			const n = notes?.get(pathKey(at));
			const key = pair.key as Node;
			if (n?.before && !map.flow) key.commentBefore = n.before;
			if (n?.after) {
				if (oneLine(value)) value.comment = n.after;
				else key.commentBefore = join(key.commentBefore, n.after) ?? null;
			}
			map.items.push(pair);
		}
		return map;
	}
	const s = new Scalar(v);
	if (typeof v === "string" && v.includes("\n")) s.type = Scalar.BLOCK_LITERAL;
	return s;
}

function hasNotesUnder(notes: Notes | undefined, path: string[]): boolean {
	if (!notes) return false;
	const k = pathKey(path);
	for (const key of notes.keys()) if (key.startsWith(k + ".") || key.startsWith(k + "[")) return true;
	return false;
}

export const yaml: Syntax = {
	name: "yaml",
	extensions: [".yml", ".yaml"],
	parse(text) {
		const doc = parseDocument(text);
		if (doc.errors.length) throw new Error(doc.errors[0]!.message);
		const notes: Notes = new Map();
		const contents = doc.contents as Node | null;
		const header = join(doc.commentBefore, contents && !oneLine(contents) ? contents.commentBefore : undefined);
		if (header !== undefined) notes.set("", { before: header });
		read(contents, [], notes);
		return { value: (doc.toJS() ?? {}) as Plain, notes };
	},
	stringify(value, notes) {
		const doc = new Document();
		doc.contents = build(doc, value, [], notes) as never;
		const header = notes?.get("")?.before;
		if (header) doc.commentBefore = header;
		return doc.toString({ lineWidth: 0, minContentWidth: 0, flowCollectionPadding: false });
	},
};
