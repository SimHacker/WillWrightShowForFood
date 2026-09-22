import type { Frame, Segment } from "./plugins/type340.js";
import type { Type340 } from "./plugins/type340.js";

/**
 * Media exporters — consumers of the one stream (DESIGN.md: the segment
 * log is what snapshot, video, phosphor, and the pen all eat). Everything
 * here is a pure function over Segments; nothing reaches back into the
 * machine.
 */

const oct = (n: number): string => (n < 0 ? "-" : "") + "0o" + Math.abs(n).toString(8);

export type SvgOpts = {
	/** CSS pixel size of the square viewport. Grid stays 1024. */
	size?: number;
	background?: string;
	stroke?: string;
};

/**
 * Vector-to-vector, no rasterization between: a 340 display file is closer
 * to SVG than to pixels. A DJS subroutine becomes an SVG <g>, so PIXIE's
 * subpicture hierarchy is the export's hierarchy; provenance rides as
 * data- attributes — click a stroke in the inspector and read the
 * display-file address that drew it in 1972.
 */
export function toSvg(segments: readonly Segment[], opts: SvgOpts = {}): string {
	const size = opts.size ?? 1024;
	const background = opts.background ?? "#0a0f0a";
	const stroke = opts.stroke ?? "#9fe8a0";
	const out: string[] = [];
	out.push(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"` +
			` width="${size}" height="${size}">`,
		`<rect width="1024" height="1024" fill="${background}"/>`,
	);
	/* 340 y is up; SVG y is down. */
	const Y = (y: number): number => 1023 - y;
	let openSubr: number | null = null;
	for (const s of segments) {
		if (!s.intensify) continue;
		if (s.subr !== openSubr) {
			if (openSubr !== null) out.push("</g>");
			openSubr = s.subr === -1 ? null : s.subr;
			if (openSubr !== null) out.push(`<g data-subr="${oct(openSubr)}">`);
		}
		const attrs =
			`data-addr="${oct(s.addr)}" data-cycle="${s.cycle}" data-frame="${s.frame}"` +
			` stroke="${stroke}" stroke-opacity="${(Math.max(s.intensity, 1) / 7).toFixed(2)}"`;
		if (s.x0 === s.x1 && s.y0 === s.y1) {
			out.push(
				`<circle cx="${s.x0}" cy="${Y(s.y0)}" r="${s.scale * 0.75}"` +
					` fill="${stroke}" fill-opacity="${(Math.max(s.intensity, 1) / 7).toFixed(2)}"` +
					` data-addr="${oct(s.addr)}" data-cycle="${s.cycle}" data-frame="${s.frame}"/>`,
			);
		} else {
			out.push(
				`<line x1="${s.x0}" y1="${Y(s.y0)}" x2="${s.x1}" y2="${Y(s.y1)}"` +
					` stroke-width="1.5" stroke-linecap="round" ${attrs}/>`,
			);
		}
	}
	if (openSubr !== null) out.push("</g>");
	out.push("</svg>");
	return out.join("\n");
}

/**
 * Compact text display list, YAML. One flow row per stroke:
 * [addr, kind, x0, y0, x1, y1, intensity, scale, subr, cycle]
 * — diffable, greppable, and small enough to paste into a bug report.
 */
export function toYaml(frame: Frame): string {
	const out: string[] = [];
	out.push(`# type340 capture — rows: [addr, kind, x0, y0, x1, y1, int, scale, subr, cycle]`);
	out.push(`frame: ${frame.index}`);
	out.push(`cycles: [${frame.cycleStart}, ${frame.cycleEnd}]`);
	out.push(`segments:`);
	for (const s of frame.segments) {
		if (!s.intensify) continue;
		out.push(
			`  - [${oct(s.addr)}, ${s.kind}, ${s.x0}, ${s.y0}, ${s.x1}, ${s.y1},` +
				` ${s.intensity}, ${s.scale}, ${s.subr === -1 ? "~" : oct(s.subr)}, ${s.cycle}]`,
		);
	}
	return out.join("\n") + "\n";
}

/** The "print screen" key: SVG of the last completed frame (or the one in flight). */
export function printScreen(display: Type340, opts?: SvgOpts): string {
	return toSvg(display.lastFrame?.segments ?? display.segments, opts);
}

/**
 * Multi-frame capture: subscribes to frame completion, keeps a bounded
 * reel. Deterministic replay input for the debugger; WebM via
 * captureStream is the browser bench's job, fed from the same reel.
 */
export class Recorder {
	frames: Frame[] = [];
	readonly maxFrames: number;

	constructor(display: Type340, opts: { maxFrames?: number } = {}) {
		this.maxFrames = opts.maxFrames ?? 600;
		const prev = display.onFrame;
		display.onFrame = (f) => {
			prev?.(f);
			this.frames.push(f);
			if (this.frames.length > this.maxFrames) this.frames.shift();
		};
	}

	toYaml(): string {
		return this.frames.map(toYaml).join("---\n");
	}

	/** One JSON object per line, one line per frame — the JSONL segment log. */
	toJsonl(): string {
		return this.frames.map((f) => JSON.stringify(f)).join("\n") + "\n";
	}
}
