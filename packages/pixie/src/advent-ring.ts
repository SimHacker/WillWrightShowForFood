import type { Graph, GraphNode, Link, Props, Value } from "./graph.js";
import type { RingImage } from "./image.js";
import { car, cdr, RingBuilder, toArray } from "./cells.js";
import { packChars, unpackChars } from "./graph-ring.js";
import { ADVENT_META } from "./psiber.js";
import { addrOf, AMASK, isAtom } from "./words.js";

/**
 * Colossal Cave as PIXIE rings, sized for 13-bit core. The generic
 * graph ring spends ~8K on topology alone and the descriptions pack
 * to ~8.4K by themselves, so the cave goes out as a topology image
 * plus description overlays, the way a PDP-7 program would page text
 * off disk:
 *
 *   topology  SAVINS = list (vocabulary, rooms)
 *     vocabulary  list of (verb# . list of name blocks)
 *     room        (room# . list of travel)
 *     travel      (target . (when . list of verb#))
 *                 target: room name, or atom n — a room with no entry,
 *                 special 300+n, or message 500+n, as in the source
 *   overlay   SAVINS = list of (room# . list of line blocks)
 *
 * Everything else in meta is ADVENT_META, restored on the way back.
 */
export type AdventRings = { topology: RingImage; descriptions: RingImage[] };

const CORE = AMASK + 1;

export function adventToRings(graph: Graph, beg = 0o100): AdventRings {
	return { topology: topology(graph, beg), descriptions: overlays(graph, beg) };
}

function topology(graph: Graph, beg: number): RingImage {
	const b = new RingBuilder(beg);
	const strings = new Map<string, number>();
	const str = (s: string): number => {
		let name = strings.get(s);
		if (name === undefined) strings.set(s, (name = b.block(packChars(s))));
		return name;
	};

	const verbs = graph.meta.verbs as Props;
	const numbers = new Map<string, number>();
	const vocabulary = b.list(
		Object.entries(verbs).map(([k, names]) => {
			for (const n of names as string[]) if (!numbers.has(n)) numbers.set(n, Number(k));
			return b.cell(b.atom(Number(k)), b.list((names as string[]).map(str)));
		}),
	);

	const verbLists = new Map<string, number>();
	const verbList = (vs: Value[]): number => {
		const nums = vs.map((v) => (typeof v === "number" ? v : numbers.get(String(v))));
		if (nums.some((n) => n === undefined)) throw new Error(`unknown verb in ${JSON.stringify(vs)}`);
		const sig = nums.join(",");
		let name = verbLists.get(sig);
		if (name === undefined) verbLists.set(sig, (name = b.list(nums.map((n) => b.atom(n!)))));
		return name;
	};

	const rooms = new Map(graph.nodes.map((n) => [Number(n.id), b.cell(b.atom(Number(n.id)), 0)]));
	const target = (l: Link): number => {
		if (l.to !== undefined) return rooms.get(Number(l.to)) ?? b.atom(Number(l.to));
		const p = l.props;
		return b.atom(typeof p.special === "number" ? p.special + 300 : Number(p.message) + 500);
	};

	for (const n of graph.nodes) {
		const travel = n.links.map((l) => {
			const when = typeof l.props.when === "number" ? l.props.when : 0;
			return b.cell(target(l), b.cell(b.atom(when), verbList(l.props.verbs as Value[])));
		});
		b.setCdr(rooms.get(Number(n.id))!, b.list(travel));
	}
	b.savins = b.list([vocabulary, b.list([...rooms.values()])]);
	return b.build();
}

/** Greedy first-fit by room, in graph order; each overlay fills one 8K core. */
function overlays(graph: Graph, beg: number): RingImage[] {
	const out: RingImage[] = [];
	let batch: GraphNode[] = [];
	let used = 0;
	let seen = new Set<string>();

	const flush = (): void => {
		if (batch.length === 0) return;
		const b = new RingBuilder(beg);
		const blocks = new Map<string, number>();
		const line = (s: string): number => {
			let name = blocks.get(s);
			if (name === undefined) blocks.set(s, (name = b.block(packChars(s))));
			return name;
		};
		b.savins = b.list(batch.map((n) => b.cell(b.atom(Number(n.id)), b.list(lines(n).map(line)))));
		out.push(b.build());
		batch = [];
		used = 0;
		seen = new Set();
	};

	// SAVINS list cell + room cell + a list cell per line + each block not yet in this overlay.
	const cost = (ls: string[]): number =>
		4 + 2 * ls.length + [...new Set(ls)].filter((s) => !seen.has(s)).reduce((a, s) => a + 2 + Math.ceil(s.length / 2), 0);

	for (const n of graph.nodes) {
		const ls = lines(n);
		if (ls.length === 0) continue;
		if (beg + used + cost(ls) > CORE) flush();
		used += cost(ls);
		for (const s of ls) seen.add(s);
		batch.push(n);
	}
	flush();
	return out;
}

function lines(n: GraphNode): string[] {
	const d = n.props.description;
	return Array.isArray(d) ? d.map(String) : [];
}

export function ringsToAdvent(rings: AdventRings): Graph {
	const t = rings.topology;
	const [vocabName, roomsName] = toArray(t, t.savins);
	if (vocabName === undefined || roomsName === undefined) throw new Error("topology root is not a pair");

	const verbs: { [n: string]: Value[] } = {};
	const names = new Map<number, string>();
	for (const entry of toArray(t, vocabName)) {
		const n = car(t, entry);
		const ns = toArray(t, cdr(t, entry)).map((blk) => unpackChars(t, blk));
		verbs[String(n)] = ns;
		names.set(n, ns[0]!);
	}

	const descriptions = new Map<number, Value[]>();
	for (const o of rings.descriptions) {
		for (const entry of toArray(o, o.savins)) {
			descriptions.set(car(o, entry), toArray(o, cdr(o, entry)).map((blk) => unpackChars(o, blk)));
		}
	}

	const roomCells = toArray(t, roomsName);
	const ids = new Map(roomCells.map((r) => [addrOf(r), car(t, r)]));
	const nodes = roomCells.map((r): GraphNode => {
		const id = car(t, r);
		const links = toArray(t, cdr(t, r)).map((tr): Link => {
			const target = car(t, tr);
			const rest = cdr(t, tr);
			const when = car(t, rest);
			const props: Props = {};
			const n = isAtom(target) ? target : ids.get(addrOf(target))!;
			if (n > 500) props.message = n - 500;
			else if (n > 300) props.special = n - 300;
			props.verbs = toArray(t, cdr(t, rest)).map((v) => names.get(v) ?? v);
			if (when !== 0) props.when = when;
			return n <= 300 ? { to: n, props } : { props };
		});
		return { id, props: { description: descriptions.get(id) ?? [] }, links };
	});
	return { meta: { ...ADVENT_META, verbs }, nodes };
}
