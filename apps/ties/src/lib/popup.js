/**
 * PopupTarget, harvested from the .tn0 argument lists.
 * `{ dx dy scale raster }` — ClientEnter maps the popped canvas.
 * HoleColor defaults to 25% gray. We clip the *applied* picture, not the
 * NeWS .cc cache.
 *
 * target.ps has no class default for PopX / PopY / PopScale: /new takes
 * them from the instance. Founder heads are 2×; Hubble instruments are 1×
 * plus a few percent of slide. The class fallback is Hubble's idiom
 * (slight lift, no explode), not Larry's.
 *
 * PopY is NeWS y-up. The reader is y-down, so the chip translates −dy.
 */
import { fold } from './corpus.js';

export const POPUPS = {
	'founder.larry': { dx: 0, dy: 0.1, scale: 2 },
	'founder.moe': { dx: -0.02, dy: 0.13, scale: 2 },
	'founder.curly': { dx: -0.05, dy: 0.1, scale: 2 },
	'miscellaneous.bunny': { dx: -0.05, dy: -0.07, scale: 1.4 },
	'miscellaneous.planet': { dx: 0, dy: 0.05, scale: 1.4 },
	'miscellaneous.puzzle': { dx: 0.03, dy: 0.07, scale: 1.4 },
	'miscellaneous.table': { dx: 0.03, dy: -0.03, scale: 1 },
	'miscellaneous.top': { dx: 0, dy: 0.08, scale: 1.5 },
	'miscellaneous.violin': { dx: -0.03, dy: 0.05, scale: 1.4 },
	'miscellaneous.widget': { dx: -0.03, dy: -0.05, scale: 1.3 },
	'sun3160c.display': { dx: -0.09, dy: 0.05, scale: 1.7 },
	'sun3160c.keyboard': { dx: -0.03, dy: 0.08, scale: 1.5 },
	'sun3160c.mouse': { dx: 0.02, dy: 0.07, scale: 1.6 },
	'sun3160c.mousepad': { dx: 0.02, dy: 0.06, scale: 1.5 },
	'orbital view - shape telescope': { dx: 0.03, dy: 0.03, scale: 1 },
	'Main view -  shape FGS': { dx: 0.018, dy: -0.01, scale: 1 },
	'Main view -  shape FOC': { dx: -0.01, dy: 0.015, scale: 1 },
	'Main view -  shape FOS': { dx: 0.01, dy: 0.02, scale: 1 },
	'Main view -  shape HRS': { dx: 0.01, dy: -0.015, scale: 1 },
	'Main view -  shape HSP': { dx: -0.013, dy: -0.013, scale: 1 },
	'Main view -  shape OTA': { dx: 0.012, dy: 0.025, scale: 1 },
	'Main view -  shape WFPC': { dx: -0.005, dy: 0.02, scale: 1 }
};

const BY_FOLD = Object.fromEntries(Object.entries(POPUPS).map(([k, v]) => [fold(k), v]));

/** Hubble's telescope: a 3% slide, no scale-up. Unknown PopupTargets get this, not 2×. */
export const CLASS_POP = { dx: 0.03, dy: 0.03, scale: 1 };

export const HOLE = '#404040'; // 0.25 0.25 0.25 rgbcolor

/**
 * geometry may be the resolved target `{ class, popup, d }` or a class string
 * (older call sites).
 */
export function popupOf(name, geometry) {
	const stamped = geometry && typeof geometry === 'object' ? geometry.popup : null;
	if (stamped) return stamped;
	const cls = typeof geometry === 'string' ? geometry : geometry?.class;
	const hit = POPUPS[name] ?? BY_FOLD[fold(name)];
	if (hit) return hit;
	if (cls === 'PopupTarget') return CLASS_POP;
	return null;
}

/** SVG transform matching PopupChip: scale around centroid, then slide. */
export function popSvgTransform(d, dx, dy, scale) {
	const c = pathCentroid(d);
	return `translate(${c.x + dx} ${c.y - dy}) scale(${scale}) translate(${-c.x} ${-c.y})`;
}

/** Bbox center of a 0..1 path. Enough for transform-origin. */
export function pathCentroid(d) {
	const nums = [...String(d).matchAll(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)].map(Number);
	const xs = [];
	const ys = [];
	for (let i = 0; i + 1 < nums.length; i += 2) {
		xs.push(nums[i]);
		ys.push(nums[i + 1]);
	}
	if (!xs.length) return { x: 0.5, y: 0.5 };
	return {
		x: (Math.min(...xs) + Math.max(...xs)) / 2,
		y: (Math.min(...ys) + Math.max(...ys)) / 2
	};
}
