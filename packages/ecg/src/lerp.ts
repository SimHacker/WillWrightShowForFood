/**
 * Lesson 0: blend two pictures.
 *
 *     A ●━━━━━━━●━━━━━━━━━━━━━━━● B
 *       t = 0   t = 0.3          t = 1
 *
 * A drawing is a list of numbers (every point's x and y, one after another). Two drawings with
 * the same structure can be mixed: move each number part of the way from A toward B.
 *
 *     mix(A, B, t) = (1 − t)·A + t·B
 *
 * That's the whole of interpolation. Everything later is this, with more than two pictures.
 */

export type Configuration = number[];

export function lerp(a: number, b: number, t: number): number {
	return (1 - t) * a + t * b;
}

export function mix(a: Configuration, b: Configuration, t: number): Configuration {
	if (a.length !== b.length) {
		throw new Error(`can't mix configurations of length ${a.length} and ${b.length}: the drawings need the same structure`);
	}
	return a.map((ai, i) => lerp(ai, b[i], t));
}
