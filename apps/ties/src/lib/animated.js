/**
 * AnimatedTarget, harvested from the .tn0 files. Hover starts the flipbook
 * (ClientEnter → StartAnimating). Leave stops it (ClientExit → StopAnimating).
 *
 * NeWS currenttime is in minutes. `.1 60 div` is 0.1s. Default `.02 60 div` is 20ms.
 *
 * blink-open / blink-close: showicon of the NeWS Icon font. The font is not in
 * the archive. The frame *names* and order are. Eyes are reincarnated as SVG.
 * bld = bloody. eye_bld3 / eye_bld2 / eye_bld1 are bloodshot, not lids.
 *
 * spin / pivot / chomp: NEWSHOME /smi/globes/globeN.im1, thirty rasters, now
 * images/globeN.im1.png. Pivot also rotated the globe; the thirty views are
 * that rotation. Chomp clipped a pac-man wedge whose half-angle is
 * abs(sin(frame/30 * 2π)) * 30°.
 */
export const ANIMATIONS = {
	'blink-open': {
		kind: 'icon',
		delayMs: 100,
		// blink-open.tn0 CanvasMaker
		frames: ['eye_bld3', 'eye_bld2', 'eye_bld1', 'eye', 'eye1', 'eye2', 'eye3', 'eye4']
	},
	'blink-close': {
		kind: 'icon',
		delayMs: 100,
		// blink-close.tn0 CanvasMaker — clear, then bloody
		frames: ['eye', 'eye1', 'eye2', 'eye3', 'eye4', 'eye_bld3', 'eye_bld2', 'eye_bld1']
	},
	spin: { kind: 'globe', delayMs: 40, frames: 30 },
	pivot: { kind: 'globe', delayMs: 40, frames: 30 },
	chomp: { kind: 'chomp', delayMs: 40, frames: 30 }
};

/** Converter leftover: a lone moveto-close (`M 0 1 Z`), not a hit region.
 *  Founder heads are implicit lineto: `M x y x y … Z` — no L, still a polygon. */
export function usablePath(d) {
	if (!d) return false;
	if (/[LlCcQqAaSsTtHhVv]/.test(d)) return true;
	const nums = String(d).match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi);
	return Boolean(nums && nums.length >= 6);
}

/** blink-open.tn0 ItemPath: 0 0 1 .5 rectpath */
export const BLINK_PATH = 'M 0 0 H 1 V 0.5 H 0 Z';

export function animationOf(name) {
	return ANIMATIONS[name] ?? null;
}

/** Chomp mouth half-angle in degrees. chomp.tn0: sin(abs) * 30. */
export function chompHalfAngle(frame, count) {
	return Math.abs(Math.sin(((frame % count) / count) * Math.PI * 2)) * 30;
}
