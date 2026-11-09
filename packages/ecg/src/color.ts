/**
 * Lesson: Blending things that aren't points: color.
 *
 *     red ●─────●─────● green          raw sRGB: the middle is #808000, olive
 *     red ●─────●─────● green          OKLab:    the middle is #d0a800, mustard
 *
 * Anything that can be added and scaled can be blended with the same weights as the points.
 * Colors can, but blending raw sRGB numbers goes muddy and dark in the middle, because sRGB is
 * not perceptually even. So convert to OKLab (Björn Ottosson, 2020), blend there, convert back.
 * Same weights, same simplex; only the space the numbers live in changes.
 */

import type { Weights } from "./barycentric.js";

export type Lab = [number, number, number];

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function hexToOklab(hex: string): Lab {
	const h = hex.replace("#", "");
	const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
	const [r, g, b] = [0, 2, 4].map((i) => toLinear(parseInt(full.slice(i, i + 2), 16) / 255));
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	return [
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
	];
}

export function oklabToHex([L, a, b]: Lab): string {
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	const rgb = [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	];
	return (
		"#" +
		rgb
			.map((c) => Math.round(Math.min(1, Math.max(0, toGamma(Math.max(0, c)))) * 255))
			.map((c) => c.toString(16).padStart(2, "0"))
			.join("")
	);
}

const hexToRgb = (hex: string): Lab => {
	const h = hex.replace("#", "");
	const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
	return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255) as Lab;
};

const rgbToHex = (rgb: Lab) =>
	"#" + rgb.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, "0")).join("");

/** Blend colors with ECG weights, in OKLab (or raw sRGB, to see why not). */
export function mixColors(colors: string[], weights: Weights, space: "oklab" | "srgb" = "oklab"): string {
	const [to, from] = space === "oklab" ? [hexToOklab, oklabToHex] : [hexToRgb, rgbToHex];
	const sum: Lab = [0, 0, 0];
	colors.forEach((c, i) => {
		const w = weights[i];
		if (!w) return;
		const x = to(c);
		for (let k = 0; k < 3; k++) sum[k] += w * x[k];
	});
	return from(sum);
}
