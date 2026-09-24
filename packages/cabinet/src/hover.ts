import { charText, dist2 } from "./plugins/type340.js";
import type { Segment } from "./plugins/type340.js";

/**
 * What is under the cursor, read off the display list. The 340 drew every
 * stroke from a display-file word, inside at most one subroutine (the 347
 * has one save register), with the pen enabled or not. Group the strokes
 * the way the program built them and the group is the thing a person
 * points at: a lightbutton, a letter string, a line of the drawing.
 */
export type Hover = {
	/** The stroke nearest the point. */
	hit: Segment;
	/** Every stroke of this frame drawn under the same identity as the hit. */
	group: Segment[];
	/** What the group's characters spell, in drawing order; "" if none. */
	text: string;
	/** subr if the hit was inside a subroutine or DDS block, otherwise the block entry. */
	key: number;
	keyKind: "subr" | "block";
	/** Group bounds, 340 grid. */
	box: { x0: number; y0: number; x1: number; y1: number };
};

/** The intensified stroke nearest (x, y) within radius, 340 grid units. */
export function strokeAt(segments: readonly Segment[], x: number, y: number, radius: number): Segment | null {
	let best: Segment | null = null;
	let bestD = radius * radius;
	for (const s of segments) {
		if (!s.intensify) continue;
		const d = dist2(x, y, s.x0, s.y0, s.x1, s.y1);
		if (d <= bestD) {
			best = s;
			bestD = d;
		}
	}
	return best;
}

/** The characters a run of strokes spells, one per glyph, in drawing order. */
export function strokeText(segments: readonly Segment[]): string {
	let out = "";
	let last = -1;
	for (const s of segments) {
		if (s.ch < 0 || s.glyph === last) continue;
		last = s.glyph;
		out += charText(s.ch);
	}
	return out;
}

export function hoverAt(segments: readonly Segment[], x: number, y: number, radius = 12): Hover | null {
	const hit = strokeAt(segments, x, y, radius);
	if (!hit) return null;
	const bySubr = hit.subr >= 0;
	const key = bySubr ? hit.subr : hit.block;
	const group = segments.filter((s) => s.intensify && (bySubr ? s.subr === key : s.subr < 0 && s.block === key));
	const box = { x0: 1023, y0: 1023, x1: 0, y1: 0 };
	for (const s of group) {
		box.x0 = Math.min(box.x0, s.x0, s.x1);
		box.y0 = Math.min(box.y0, s.y0, s.y1);
		box.x1 = Math.max(box.x1, s.x0, s.x1);
		box.y1 = Math.max(box.y1, s.y0, s.y1);
	}
	return { hit, group, text: strokeText(group), key, keyKind: bySubr ? "subr" : "block", box };
}
