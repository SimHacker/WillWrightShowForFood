import type { Segment } from "./plugins/type340.js";

/**
 * Direct manipulation of what the 340 is drawing: move a corner between two vector words by
 * rewriting both words in core, so the corner moves and everything after it stays put. No
 * program cooperates; the next refresh draws the edit. A program that rebuilds its display
 * file (PIXIE, on finishing an element) replaces it; one that only appends (the Forth turtle)
 * keeps it.
 */

// DEC bit order: bit 0 is the most significant. Escape 0, bright 1, y sign 2, dy 3-9, x sign 10, dx 11-17.
const ESCAPE = 0o400000;
const BRIGHT = 0o200000;
const SIGN_Y = 0o100000;
const SIGN_X = 0o000200;
const MAX = 127;

export type VectorWord = { dx: number; dy: number; bright: boolean; escape: boolean };

export function decodeVector(w: number): VectorWord {
	const dy = (w >> 8) & MAX;
	const dx = w & MAX;
	return { dx: w & SIGN_X ? -dx : dx, dy: w & SIGN_Y ? -dy : dy, bright: !!(w & BRIGHT), escape: !!(w & ESCAPE) };
}

export function encodeVector(v: VectorWord): number {
	if (Math.abs(v.dx) > MAX || Math.abs(v.dy) > MAX) throw new Error(`a vector word moves at most ${MAX} each way`);
	return (
		(v.escape ? ESCAPE : 0) |
		(v.bright ? BRIGHT : 0) |
		(v.dy < 0 ? SIGN_Y : 0) |
		(Math.abs(v.dy) << 8) |
		(v.dx < 0 ? SIGN_X : 0) |
		Math.abs(v.dx)
	);
}

/** Where a pair of POINT words puts the beam: the words' addresses. */
export type Place = { xAt: number; yAt: number };

/**
 * A handle. Either the end of one vector word that is the start of the next (`into` set), or a
 * place set by POINT words (`place` set): moving it rewrites them, and `outOf`, the vector starting
 * there if any, absorbs the change so that line keeps its far end; anything else placed there
 * (text, dots, a button) moves along.
 */
export type Corner = { x: number; y: number; into: Segment | null; outOf: Segment | null; place: Place | null };

const FIELD = 0o1777;

/** The places POINT words set in a frame, at the coordinates the words hold now. */
export function placesIn(segments: readonly Segment[], read: (addr: number) => number): Corner[] {
	const seen = new Map<string, Corner>();
	for (const s of segments) {
		if (s.xAt < 0 || s.yAt < 0) continue;
		const key = `${s.xAt},${s.yAt}`;
		if (seen.has(key)) continue;
		const x = read(s.xAt) & FIELD;
		const y = read(s.yAt) & FIELD;
		const outOf = s.kind === "vector" && s.x0 === x && s.y0 === y ? s : null;
		seen.set(key, { x, y, into: null, outOf, place: { xAt: s.xAt, yAt: s.yAt } });
	}
	return [...seen.values()];
}

/**
 * The handle nearest (x, y) within radius, from a frame's segments in drawing order: vector
 * corners, and with `read`, places set by POINT words, which win a tie.
 */
export function cornerAt(segments: readonly Segment[], x: number, y: number, radius: number, read?: (addr: number) => number): Corner | null {
	let best: Corner | null = null;
	let bestD = radius * radius;
	for (let i = 0; i < segments.length; i += 1) {
		const s = segments[i]!;
		if (s.kind !== "vector") continue;
		const d = (s.x1 - x) ** 2 + (s.y1 - y) ** 2;
		if (d >= bestD) continue;
		const n = segments[i + 1];
		const outOf = n && n.kind === "vector" && n.x0 === s.x1 && n.y0 === s.y1 && n.addr !== s.addr ? n : null;
		best = { x: s.x1, y: s.y1, into: s, outOf, place: null };
		bestD = d;
	}
	if (read) {
		for (const p of placesIn(segments, read)) {
			const d = (p.x - x) ** 2 + (p.y - y) ** 2;
			if (d > bestD) continue;
			best = p;
			bestD = d;
		}
	}
	return best;
}

export type Box = { x0: number; y0: number; x1: number; y1: number };

/**
 * Where a corner can go: the 340 grid rectangle in which both words meeting there still hold their
 * deltas (127 each way, times scale). Null if a word's drawn end isn't its encoded end (clipped).
 */
export function cornerLimits(read: (addr: number) => number, c: Corner): Box | null {
	// A POINT word reaches the whole screen.
	let lo = { x: -c.x, y: -c.y };
	let hi = { x: 1023 - c.x, y: 1023 - c.y };
	if (c.into) {
		const s = c.into.scale || 1;
		const a = decodeVector(read(c.into.addr));
		if (c.into.x0 + a.dx * s !== c.into.x1 || c.into.y0 + a.dy * s !== c.into.y1) return null;
		lo = { x: (-MAX - a.dx) * s, y: (-MAX - a.dy) * s };
		hi = { x: (MAX - a.dx) * s, y: (MAX - a.dy) * s };
	}
	if (c.outOf) {
		const os = c.outOf.scale || 1;
		const b = decodeVector(read(c.outOf.addr));
		lo = { x: Math.max(lo.x, (b.dx - MAX) * os), y: Math.max(lo.y, (b.dy - MAX) * os) };
		hi = { x: Math.min(hi.x, (b.dx + MAX) * os), y: Math.min(hi.y, (b.dy + MAX) * os) };
	}
	return { x0: c.x + lo.x, y0: c.y + lo.y, x1: c.x + hi.x, y1: c.y + hi.y };
}

/** The nearest point to (x, y) that lies in the box and on the scale's grid from the corner. */
export function clampCorner(c: Corner, box: Box, x: number, y: number): { x: number; y: number } {
	const step = Math.max(c.into?.scale || 1, c.outOf?.scale || 1);
	const snap = (v: number, from: number, lo: number, hi: number) => {
		const k = Math.round((Math.min(hi, Math.max(lo, v)) - from) / step) * step + from;
		return k > hi ? k - step : k < lo ? k + step : k;
	};
	return { x: snap(x, c.x, box.x0, box.x1), y: snap(y, c.y, box.y0, box.y1) };
}

/**
 * The pokes that move a corner to (x, y): [address, word] pairs. The incoming word takes the new
 * end; the outgoing one, if any, absorbs the difference so the stroke after it ends where it did.
 * Null when a delta would not fit a word at this scale, or a clipped vector makes the drawn end
 * not the word's end.
 */
export function moveCorner(read: (addr: number) => number, c: Corner, x: number, y: number): Array<[number, number]> | null {
	const ddx = x - c.x;
	const ddy = y - c.y;
	const pokes: Array<[number, number]> = [];
	if (c.place) {
		if (x < 0 || x > 1023 || y < 0 || y > 1023) return null;
		const wx = read(c.place.xAt);
		const wy = read(c.place.yAt);
		pokes.push([c.place.xAt, (wx & ~FIELD) | x], [c.place.yAt, (wy & ~FIELD) | y]);
	}
	if (c.into) {
		const scale = c.into.scale || 1;
		if (ddx % scale || ddy % scale) return null;
		const a = decodeVector(read(c.into.addr));
		if (c.into.x0 + a.dx * scale !== c.into.x1 || c.into.y0 + a.dy * scale !== c.into.y1) return null;
		const na = { ...a, dx: a.dx + ddx / scale, dy: a.dy + ddy / scale };
		if (Math.abs(na.dx) > MAX || Math.abs(na.dy) > MAX) return null;
		pokes.push([c.into.addr, encodeVector(na)]);
	}
	if (c.outOf) {
		const os = c.outOf.scale || 1;
		if (ddx % os || ddy % os) return null;
		const b = decodeVector(read(c.outOf.addr));
		const nb = { ...b, dx: b.dx - ddx / os, dy: b.dy - ddy / os };
		if (Math.abs(nb.dx) > MAX || Math.abs(nb.dy) > MAX) return null;
		pokes.push([c.outOf.addr, encodeVector(nb)]);
	}
	return pokes;
}
