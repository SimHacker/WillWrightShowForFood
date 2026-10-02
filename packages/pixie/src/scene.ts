import { parse as parseYaml } from "yaml";

import { fromData } from "./graph.js";
import { graphToRing } from "./graph-ring.js";
import { decodeTransfer, PXID_BYTES, unpackWords } from "./image.js";
import type { RingImage } from "./image.js";
import { addrOf, AMASK, blockLen, classify, isBlockHeader, isNil, NIL, NONITEM, pointer, WMASK } from "./words.js";

/**
 * A ring image as a 3D model. Renderer-agnostic: positions and edges,
 * no canvas, no GPU. The walk starts at SAVINS, the structure's front
 * door, and follows names the way RSPPIX does: cdr chains become rings
 * (when they close on themselves) or lists (when they reach NIL), car
 * pointers hang sub-structures one level down, blocks are slabs, and
 * sign-bit nonitems are forwarding posts. Same image, same model:
 * the layout is deterministic so a character can point at a cell and
 * find it in the same place next frame.
 */
export type Vec3 = [number, number, number];

export type NodeKind = "cell" | "block" | "forward" | "outside";
export type ChainKind = "ring" | "list" | "block" | "forward" | "outside";
export type EdgeKind = "car" | "cdr" | "close" | "forward";

export type SceneNode = {
	addr: number;
	kind: NodeKind;
	/** The car word (a cell), the header (a block), the nonitem (a forward). */
	word: number;
	cdrWord?: number;
	/** Block raw length. */
	len?: number;
	label: string;
	chain: number;
	pos: Vec3;
};

export type SceneEdge = { from: number; to: number; kind: EdgeKind };

export type Chain = {
	id: number;
	kind: ChainKind;
	cells: number[];
	depth: number;
	parent: number;
	/** A printname spelled by the cars, or a block's packed string. */
	text?: string;
	center: Vec3;
	radius: number;
};

export type Scene = {
	image: RingImage;
	root: number;
	nodes: SceneNode[];
	edges: SceneEdge[];
	chains: Chain[];
	/** Bounding radius about the origin, for the camera. */
	radius: number;
};

/** Spacing between cells, and between levels. */
const S = 1;
const LEVEL = 2.5;

function octal(w: number): string {
	return (w & WMASK).toString(8);
}

/** A mark-parity ASCII char atom, as COPIN stores it. */
function charOf(w: number): string | null {
	if ((w & ~0o377) !== 0 || (w & 0o200) === 0) return null;
	const c = w & 0o177;
	return c >= 32 && c < 127 ? String.fromCharCode(c) : null;
}

function cellLabel(car: number): string {
	const k = classify(car);
	if (k === "nil") return "NIL";
	if (k === "atom") return charOf(car) ?? octal(car);
	return "";
}

/** The graph-ring string packing: length, then two 9-bit chars per word. */
function blockText(raw: number[]): string | undefined {
	const [len, ...rest] = raw;
	if (len === undefined || len === 0 || len > rest.length * 2) return undefined;
	let s = "";
	for (const w of rest) s += String.fromCharCode(w >>> 9, w & 0o777);
	s = s.slice(0, len);
	return /^[\x20-\x7e]*$/.test(s) ? s : undefined;
}

export function ringToScene(image: RingImage, roots: number[] = [image.savins]): Scene {
	const end = image.beg + image.words.length;
	const inImage = (a: number): boolean => a >= image.beg && a < end;
	const w = (a: number): number => image.words[a - image.beg]! & WMASK;
	const cellAt = (a: number): boolean =>
		inImage(a) && inImage(a + 1) && !(w(a) & NONITEM) && !isBlockHeader(w(a));

	const nodes = new Map<number, SceneNode>();
	const edges: SceneEdge[] = [];
	const chains: Chain[] = [];
	const pending: { addr: number; from: number; parent: number; kind: EdgeKind }[] = [];
	for (const r of roots) if (classify(r) === "pointer") pending.push({ addr: addrOf(r), from: -1, parent: -1, kind: "car" });

	const chain = (kind: ChainKind, parent: number): Chain => {
		const c: Chain = {
			id: chains.length,
			kind,
			cells: [],
			depth: parent < 0 ? 0 : chains[parent]!.depth + 1,
			parent,
			center: [0, 0, 0],
			radius: S / 2,
		};
		chains.push(c);
		return c;
	};
	const add = (c: Chain, n: Omit<SceneNode, "chain" | "pos">): void => {
		nodes.set(n.addr, { ...n, chain: c.id, pos: [0, 0, 0] });
		c.cells.push(n.addr);
	};

	for (let i = 0; i < pending.length; i += 1) {
		const { addr, from, parent, kind } = pending[i]!;
		if (from >= 0) edges.push({ from, to: addr, kind });
		if (nodes.has(addr)) continue;
		if (!inImage(addr)) {
			add(chain("outside", parent), { addr, kind: "outside", word: 0, label: octal(addr) });
			continue;
		}
		const head = w(addr);
		if (head & NONITEM) {
			const c = chain("forward", parent);
			add(c, { addr, kind: "forward", word: head, label: `→${octal(head & AMASK)}` });
			pending.push({ addr: head & AMASK, from: addr, parent: c.id, kind: "forward" });
			continue;
		}
		if (isBlockHeader(head)) {
			const len = blockLen(head);
			const raw = image.words.slice(addr - image.beg + 1, addr - image.beg + 1 + len).map((x) => x & WMASK);
			const c = chain("block", parent);
			const text = blockText(raw);
			if (text !== undefined) c.text = text;
			add(c, { addr, kind: "block", word: head, len, label: text ?? `[${len}]` });
			continue;
		}
		if (!cellAt(addr)) {
			add(chain("outside", parent), { addr, kind: "outside", word: head, label: octal(addr) });
			continue;
		}
		const c = chain("list", parent);
		const members = new Set<number>();
		let a = addr;
		for (;;) {
			const car = w(a);
			const cdr = w(a + 1);
			members.add(a);
			add(c, { addr: a, kind: "cell", word: car, cdrWord: cdr, label: cellLabel(car) });
			if (classify(car) === "pointer") pending.push({ addr: addrOf(car), from: a, parent: c.id, kind: "car" });
			if (isNil(cdr) || classify(cdr) !== "pointer") break;
			const t = addrOf(cdr);
			if (members.has(t)) {
				c.kind = "ring";
				edges.push({ from: a, to: t, kind: "close" });
				break;
			}
			if (nodes.has(t) || !cellAt(t)) {
				pending.push({ addr: t, from: a, parent: c.id, kind: "cdr" });
				break;
			}
			edges.push({ from: a, to: t, kind: "cdr" });
			a = t;
		}
		const chars = c.cells.map((n) => charOf(nodes.get(n)!.word));
		if (chars.length > 1 && chars.every((ch) => ch !== null)) c.text = chars.join("");
	}

	const list = [...nodes.values()];
	const radius = layout(chains, nodes);
	return { image, root: roots[0] === undefined ? -1 : addrOf(roots[0]), nodes: list, edges, chains, radius };
}

/**
 * A tidy tree over chains: siblings side by side in x, levels down in y,
 * lists running away in z, rings as circles lying in the xz plane.
 */
function layout(chains: Chain[], nodes: Map<number, SceneNode>): number {
	const kids: number[][] = chains.map(() => []);
	for (const c of chains) if (c.parent >= 0) kids[c.parent]!.push(c.id);
	for (const c of chains) c.radius = c.kind === "ring" ? Math.max(S, (c.cells.length * S) / (2 * Math.PI)) : S / 2;
	const own = (c: Chain): number => (c.kind === "ring" ? 2 * c.radius + S : S + (c.kind === "block" ? S : 0));
	const width: number[] = new Array(chains.length).fill(0);
	for (let i = chains.length - 1; i >= 0; i -= 1) {
		const sum = kids[i]!.reduce((s, k) => s + width[k]!, 0);
		width[i] = Math.max(own(chains[i]!), sum);
	}
	const place = (id: number, x0: number): void => {
		const c = chains[id]!;
		const cx = x0 + width[id]! / 2;
		const y = -c.depth * LEVEL;
		c.center = [cx, y, c.kind === "ring" ? c.radius : ((c.cells.length - 1) * S) / 2];
		c.cells.forEach((addr, i) => {
			const n = nodes.get(addr)!;
			if (c.kind === "ring") {
				const t = (2 * Math.PI * i) / c.cells.length;
				n.pos = [cx + c.radius * Math.sin(t), y, c.radius - c.radius * Math.cos(t)];
			} else n.pos = [cx, y, i * S];
		});
		const sum = kids[id]!.reduce((s, k) => s + width[k]!, 0);
		let x = x0 + (width[id]! - sum) / 2;
		for (const k of kids[id]!) {
			place(k, x);
			x += width[k]!;
		}
	};
	let x = 0;
	for (const c of chains) {
		if (c.parent >= 0) continue;
		place(c.id, x);
		x += width[c.id]!;
	}
	if (nodes.size === 0) return S;
	const lo: Vec3 = [Infinity, Infinity, Infinity];
	const hi: Vec3 = [-Infinity, -Infinity, -Infinity];
	for (const n of nodes.values()) {
		for (let k = 0; k < 3; k += 1) {
			lo[k] = Math.min(lo[k]!, n.pos[k]!);
			hi[k] = Math.max(hi[k]!, n.pos[k]!);
		}
	}
	const mid = lo.map((v, k) => (v + hi[k]!) / 2) as Vec3;
	let r = S;
	const shift = (p: Vec3): void => {
		for (let k = 0; k < 3; k += 1) p[k] = p[k]! - mid[k]!;
	};
	for (const n of nodes.values()) {
		shift(n.pos);
		r = Math.max(r, Math.hypot(...n.pos));
	}
	for (const c of chains) shift(c.center);
	return r + S;
}

/** Cells whose words differ between two photographs of the same area. */
export function changedCells(prev: RingImage | null, next: RingImage): Set<number> {
	const out = new Set<number>();
	if (!prev || prev.beg !== next.beg) return out;
	for (let i = 0; i < next.words.length; i += 1) {
		if (prev.words[i] !== next.words[i]) {
			const a = next.beg + i;
			out.add(a);
			out.add(a - 1);
		}
	}
	return out;
}

function wordOf(v: unknown): number {
	if (typeof v === "number") return v & WMASK;
	if (typeof v === "string") return Number.parseInt(v.replace(/^0o/, ""), 8) & WMASK;
	throw new Error(`not a word: ${JSON.stringify(v)}`);
}

/**
 * Whatever you have, as a ring image: the binary transfer stream
 * (3 bytes a word), a transfer as a list of words, a RingImage as
 * JSON or YAML ({beg, savins, words}), or any graph document
 * ({nodes: [...]}) built into rings by graphToRing.
 */
export function readRings(input: string | Uint8Array): RingImage {
	if (typeof input !== "string") {
		if (PXID_BYTES.every((b, i) => input[i] === b)) return decodeTransfer(unpackWords(input));
		input = new TextDecoder().decode(input);
	}
	// YAML reads JSON too, and short graphs come out of toYaml in flow style.
	const data: unknown = parseYaml(input);
	if (Array.isArray(data)) return decodeTransfer(data.map(wordOf));
	if (data && typeof data === "object" && Array.isArray((data as { words?: unknown }).words)) {
		const d = data as { beg?: unknown; end?: unknown; savins?: unknown; words: unknown[] };
		const beg = d.beg === undefined ? 0o100 : wordOf(d.beg) & AMASK;
		const words = d.words.map(wordOf);
		return {
			beg,
			end: d.end === undefined ? beg + words.length : wordOf(d.end) & AMASK,
			savins: d.savins === undefined ? (words.length ? pointer(beg) : NIL) : wordOf(d.savins),
			words,
		};
	}
	return graphToRing(fromData(data));
}
