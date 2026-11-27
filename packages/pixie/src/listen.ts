import type { RingImage } from "./image.js";
import { changedCells } from "./scene.js";
import type { Scene, SceneNode } from "./scene.js";

/**
 * A ring structure as a phrase to hear: the music knows nothing of rings, and this knows
 * nothing of music. Each cell the walk reaches is a tone, in the order the ring view lays them
 * out from the root, so a phrase is the structure read aloud the way RSPPIX walks it.
 *
 * - Along a chain the tones climb, a step a cell, as the pen's strokes climb along a line.
 * - A printname's letters are each their own step, so a name always plays the same tune.
 * - A chain's depth below the root is its octave; a block is as loud as it is long.
 * - A ring closing on its head is a sound of its own; between chains there is a rest.
 * - Where the ring view draws a cell, left to right, is where it is heard.
 *
 * What a block's words mean to SYMELEC is not read here (TINY-TITAN.md: porting its down-
 * compiler's walk is to come); this hears the structure, not the shapes it draws.
 */

export type ToneKind = "cell" | "letter" | "block" | "forward" | "close" | "rest";

export type RingTone = {
	kind: ToneKind;
	/** Steps up the chord from the chain's first: the cell's place along its chain, or a letter's own. */
	degree: number;
	/** Levels below the root. */
	depth: number;
	/** 0 to 1. */
	weight: number;
	/** -1 left to 1 right, where the ring view draws it. */
	pan: number;
	addr: number;
	label: string;
};

export type RingPhrase = {
	tones: RingTone[];
	cells: number;
	blocks: number;
	chains: number;
	/** The printnames heard whole, in order: what was named. A name only relinked is not news. */
	names: string[];
	/** Tones left out to keep within `most`. */
	skipped: number;
};

export type ListenLimits = {
	/** The most tones a phrase plays; longer ones are thinned evenly, start and end kept. */
	most: number;
};

export const LISTEN_DEFAULTS: ListenLimits = { most: 48 };

/** How many steps a chain climbs before it starts low again. */
const CLIMB = 8;
/** A letter's step is its code mod 7: a cycle of seven, like a scale's, prime to the alphabet's runs. */
const SPELL = 7;

/** The scene's cells and blocks whose words changed since `prev`; every one when there is no `prev`. */
export function changedNodes(scene: Scene, prev: RingImage | null): Set<number> {
	if (!prev) return new Set(scene.nodes.map((n) => n.addr));
	const words = changedCells(prev, scene.image);
	const out = new Set<number>();
	if (words.size === 0) return out;
	for (const n of scene.nodes) {
		const span = n.kind === "block" ? (n.len ?? 0) + 1 : n.kind === "cell" ? 2 : 1;
		for (let a = n.addr; a < n.addr + span; a += 1)
			if (words.has(a)) {
				out.add(n.addr);
				break;
			}
	}
	return out;
}

const letterOf = (n: SceneNode): string | null => (n.kind === "cell" && /^[A-Za-z0-9]$/.test(n.label) ? n.label : null);

/** The phrase for the nodes in `only` (all of them when null), in the scene's walk order. */
export function ringPhrase(scene: Scene, only: Set<number> | null = null, limits: ListenLimits = LISTEN_DEFAULTS): RingPhrase {
	const picked = scene.nodes.filter((n) => n.kind !== "outside" && (!only || only.has(n.addr)));
	const byChain = new Map<number, SceneNode[]>();
	for (const n of picked) byChain.set(n.chain, [...(byChain.get(n.chain) ?? []), n]);
	const r = scene.radius || 1;
	const pan = (n: SceneNode) => Math.max(-1, Math.min(1, n.pos[0] / r));
	const tones: RingTone[] = [];
	const names: string[] = [];
	for (const [id, group] of byChain) {
		const chain = scene.chains[id]!;
		if (tones.length) tones.push({ kind: "rest", degree: 0, depth: chain.depth, weight: 0, pan: 0, addr: -1, label: "" });
		const depth = Math.min(3, chain.depth);
		if (chain.text && (!only || chain.cells.every((a) => only.has(a)))) names.push(chain.text);
		for (const n of group) {
			const at = Math.max(0, chain.cells.indexOf(n.addr));
			const letter = letterOf(n);
			const kind: ToneKind = letter ? "letter" : n.kind === "block" ? "block" : n.kind === "forward" ? "forward" : "cell";
			const degree = letter ? letter.toUpperCase().charCodeAt(0) % SPELL : at % CLIMB;
			const weight = kind === "block" ? Math.min(1, 0.3 + Math.log2((n.len ?? 0) + 1) / 6) : kind === "letter" ? 0.6 : kind === "forward" ? 0.4 : 0.5;
			tones.push({ kind, degree, depth, weight, pan: pan(n), addr: n.addr, label: n.label });
		}
		const last = group[group.length - 1]!;
		if (chain.kind === "ring" && last.addr === chain.cells[chain.cells.length - 1])
			tones.push({ kind: "close", degree: 0, depth, weight: 0.7, pan: pan(last), addr: chain.cells[0] ?? -1, label: "" });
	}
	const most = Math.max(2, limits.most);
	const kept = tones.length <= most ? tones : Array.from({ length: most }, (_, i) => tones[Math.round((i * (tones.length - 1)) / (most - 1))]!);
	return {
		tones: kept,
		cells: picked.filter((n) => n.kind === "cell").length,
		blocks: picked.filter((n) => n.kind === "block").length,
		chains: byChain.size,
		names,
		skipped: tones.length - kept.length,
	};
}

/** A phrase in a few words, to speak: "SQUARE: 12 cells in 2 chains". */
export function sayPhrase(p: RingPhrase): string {
	const n = (k: number, one: string, many: string) => `${k} ${k === 1 ? one : many}`;
	const parts = [n(p.cells, "cell", "cells")];
	if (p.blocks) parts.push(n(p.blocks, "block", "blocks"));
	const what = `${parts.join(" and ")}${p.chains > 1 ? ` in ${p.chains} chains` : ""}`;
	return p.names.length ? `${p.names.join(", ")}: ${what}` : what;
}
