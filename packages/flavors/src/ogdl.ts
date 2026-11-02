// OGDL (ogdl.org), the indented-tree format microM8 keeps its microPAK .cfg files in.
//
//   init            a node whose children are all leaves is a value:
//     profile         one leaf, a scalar; several, a list
//       apple2e-en
//     layerpos
//       0
//       0
//
// Any other node is a map. A leaf beside non-leaves becomes an empty map, written back as
// the bare token. `a b c` on one line is a chain, a > b > c; commas separate siblings.
// '#' at the start of a token begins a comment. Numbers that print back unchanged are read
// as numbers; everything else is a string. Quoted strings stay strings.

import { isMap, pathKey, type Plain, type PlainMap } from "./merge.js";
import type { Note, Notes } from "./notes.js";
import type { Syntax } from "./syntax.js";

interface Tree {
	token: string;
	quoted: boolean;
	children: Tree[];
	before?: string;
	after?: string;
}

function tokenize(line: string): { groups: { token: string; quoted: boolean }[][]; comment?: string } {
	const groups: { token: string; quoted: boolean }[][] = [[]];
	let i = 0;
	while (i < line.length) {
		const c = line[i]!;
		if (c === " " || c === "\t") {
			i++;
		} else if (c === ",") {
			groups.push([]);
			i++;
		} else if (c === "#") {
			return { groups, comment: line.slice(i + 1) };
		} else if (c === '"' || c === "'") {
			let j = i + 1;
			let s = "";
			while (j < line.length && line[j] !== c) {
				if (line[j] === "\\" && j + 1 < line.length) {
					const e = line[j + 1]!;
					s += e === "n" ? "\n" : e === "t" ? "\t" : e;
					j += 2;
				} else s += line[j++];
			}
			groups[groups.length - 1]!.push({ token: s, quoted: true });
			i = j + 1;
		} else {
			let j = i;
			while (j < line.length && !" \t,".includes(line[j]!)) j++;
			groups[groups.length - 1]!.push({ token: line.slice(i, j), quoted: false });
			i = j;
		}
	}
	return { groups };
}

function parseTree(text: string): Tree {
	const root: Tree = { token: "", quoted: false, children: [] };
	const stack: { indent: number; node: Tree }[] = [{ indent: -1, node: root }];
	let pending: string[] = [];
	for (const raw of text.split(/\r?\n/)) {
		const body = raw.trimStart();
		if (body === "") continue;
		const indent = raw.length - body.length;
		const { groups, comment } = tokenize(body);
		const chains = groups.filter((g) => g.length > 0);
		if (chains.length === 0) {
			if (comment !== undefined) pending.push(comment);
			continue;
		}
		while (stack.length > 1 && stack[stack.length - 1]!.indent >= indent) stack.pop();
		const parent = stack[stack.length - 1]!.node;
		let tail: Tree = parent;
		chains.forEach((chain, n) => {
			let at = parent;
			for (const t of chain) {
				const node: Tree = { token: t.token, quoted: t.quoted, children: [] };
				at.children.push(node);
				if (at === parent && n === 0 && pending.length) {
					node.before = pending.join("\n");
					pending = [];
				}
				at = node;
			}
			tail = at;
		});
		if (comment !== undefined) tail.after = comment;
		stack.push({ indent, node: tail });
	}
	if (pending.length) root.after = pending.join("\n");
	return root;
}

function scalar(t: Tree): Plain {
	if (!t.quoted && t.token !== "" && String(Number(t.token)) === t.token) return Number(t.token);
	return t.token;
}

function note(notes: Notes, path: string[], ...from: Tree[]): void {
	const before = from.map((t) => t.before).filter((x) => x !== undefined);
	const after = from.map((t) => t.after).filter((x) => x !== undefined);
	if (!before.length && !after.length) return;
	const n: Note = {};
	if (before.length) n.before = before.join("\n");
	if (after.length) n.after = after.join(" ");
	notes.set(pathKey(path), n);
}

function valueOf(children: Tree[], path: string[], notes: Notes): Plain {
	if (children.length === 0) return {};
	if (path.length > 0 && children.every((c) => c.children.length === 0)) {
		if (children.length === 1) return scalar(children[0]!);
		return children.map((c, i) => {
			note(notes, [...path, `[#${i}]`], c);
			return scalar(c);
		});
	}
	const out: PlainMap = {};
	for (const c of children) {
		const at = [...path, c.token];
		const leafValue = c.children.length === 1 && c.children[0]!.children.length === 0;
		note(notes, at, ...(leafValue ? [c, c.children[0]!] : [c]));
		out[c.token] = valueOf(c.children, at, notes);
	}
	return out;
}

const BARE = /^[^\s,()"'#]+$/;

// A key is always a string, so a numeric key needs no quotes; a numeric string value does.
function token(v: Plain, key = false): string {
	if (typeof v === "number" || typeof v === "boolean") return String(v);
	const s = String(v);
	if (BARE.test(s) && (key || String(Number(s)) !== s)) return s;
	return '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\t/g, "\\t") + '"';
}

function emit(lines: string[], v: Plain, indent: number, path: string[], notes: Notes | undefined): void {
	const pad = " ".repeat(indent);
	const line = (s: string, n: Note | undefined, withBefore = true): void => {
		if (withBefore && n?.before !== undefined) for (const b of n.before.split("\n")) lines.push(`${pad}#${b}`);
		lines.push(n?.after !== undefined ? `${pad}${s}  #${n.after}` : `${pad}${s}`);
	};
	if (isMap(v)) {
		for (const [k, x] of Object.entries(v)) {
			const at = [...path, k];
			const n = notes?.get(pathKey(at));
			const inlineValue = x !== null && typeof x !== "object";
			line(token(k, true), inlineValue && n ? { ...(n.before !== undefined ? { before: n.before } : {}) } : n);
			if (inlineValue) {
				const after = n?.after;
				lines.push(after !== undefined ? `${pad}  ${token(x)}  #${after}` : `${pad}  ${token(x)}`);
			} else emit(lines, x, indent + 2, at, notes);
		}
	} else if (Array.isArray(v)) {
		v.forEach((x, i) => {
			const at = [...path, `[#${i}]`];
			if (x !== null && typeof x === "object") emit(lines, x, indent, at, notes);
			else line(token(x), notes?.get(pathKey(at)));
		});
	} else if (v !== null) {
		line(token(v), undefined);
	}
}

export const ogdl: Syntax = {
	name: "ogdl",
	extensions: [".ogdl"],
	parse(text) {
		const notes: Notes = new Map();
		const root = parseTree(text);
		const value = valueOf(root.children, [], notes);
		if (root.after !== undefined) notes.set("", { after: root.after });
		return { value, notes };
	},
	stringify(value, notes) {
		const lines: string[] = [];
		const root = notes?.get("");
		if (root?.before !== undefined) for (const b of root.before.split("\n")) lines.push(`#${b}`);
		emit(lines, value, 0, [], notes);
		if (root?.after !== undefined) for (const b of root.after.split("\n")) lines.push(`#${b}`);
		return lines.join("\n") + "\n";
	},
};
