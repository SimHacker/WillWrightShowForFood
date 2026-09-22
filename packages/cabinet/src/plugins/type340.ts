import type { Device, Iot, IotReply } from "../bus.js";

/**
 * DEC Type 340 Precision Incremental CRT — as a display processor.
 *
 * Ported nearly line-by-line from SIMH display/type340.c (Philip L. Budne
 * 2003-2018, MIT license), with the PDP-7 IOT glue specified by SYMELEC's
 * own listing rather than by pdp18b_dpy.c, whose pen and edge paths were
 * stubs. Where this file diverges from SIMH, the divergence is stated at
 * the site and the 1972 listing is the authority.
 *
 * The one architectural difference, by design (DESIGN.md): SIMH draws
 * pixels; we emit Segments with provenance — the display-file address and
 * backplane cycle that drew each stroke — and pen-test segments. The
 * segment log is the one stream: canvas, SVG, YAML capture, video, and
 * the pen all consume it.
 */

/* Status bits — same values as SIMH type340.h (PDP-10 CONI layout). */
export const ST340_VEDGE = 0o4000; /* y ran off grid — SYMELEC's EDGEV adjusts YCROSS */
export const ST340_LPHIT = 0o2000;
export const ST340_HEDGE = 0o1000; /* x ran off grid — SYMELEC's EDGEH adjusts XCROSS */
export const ST340_STOP_INT = 0o400;
export const ST340_STOPPED = 0o400000;

export const MODE = {
	PARAM: 0,
	POINT: 1,
	SLAVE: 2,
	CHAR: 3,
	VECTOR: 4,
	VCONT: 5,
	INCR: 6,
	SUBR: 7,
} as const;
export type Mode = (typeof MODE)[keyof typeof MODE];

/* Type 347 jump types (bits 0-1 of a SUBR-mode word). */
const DJP = 2;
const DJS = 3;
const DDS = 1;

/* DEC bit numbering: bit 0 is the MSB. Keep it verbatim; it is where the bugs live. */
const TESTBIT = (w: number, b: number): boolean => (w & (1 << (17 - b))) !== 0;
const GETFIELD = (w: number, start: number, end: number): number =>
	(w >> (17 - end)) & ((1 << (end - start + 1)) - 1);

export type SegmentKind = "point" | "vector" | "incr" | "char";

/** One stroke, with provenance: enough to draw it, pen-test it, and debug it. */
export type Segment = {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
	intensify: boolean;
	kind: SegmentKind;
	/** Display-file address of the word that drew this. */
	addr: number;
	/** Backplane cycle when it was drawn — a seekable address into machine time. */
	cycle: number;
	/** Refresh frame index (IDLA-to-IDLA span). */
	frame: number;
	/** Innermost DJS target while drawing, or -1 — becomes the SVG <g>. */
	subr: number;
	intensity: number;
	scale: number;
};

export type Frame = {
	index: number;
	cycleStart: number;
	cycleEnd: number;
	segments: Segment[];
};

/**
 * Pen input adapter — position in 340 grid coordinates, tested per fresh
 * stroke. The 340 takes any number of pens: electrically this is photocell
 * amplifiers ORed onto the one Type 370 input, which would have worked on
 * the real iron too. All pens share the single LPHIT flag and IDRC
 * readback, so 1972 software cannot tell and does not need to — the
 * tracking cross follows whoever holds it while a second pen pokes
 * lightbuttons. Which pen fired is provenance (`lastHitPen`), below the
 * ISA — and one instruction above it: IDPN (dev 011, a free code; pulse 1
 * skip-if-latched, pulse 012 clear-and-read pen number, 1..8, 0 = none).
 * A backwards-compatible extension — no 1972 program issues dev 011 — so
 * hackers can reassemble PIXIE for multiple pens, a tribute to
 * Engelbart's multiple cursors. The demanding program that unlocked it,
 * per the corpus rule: Don's 22 Sep 2026 mail to Heinz, Roy, and Alan.
 */
export type PenInput = {
	enabled: boolean;
	x: number;
	y: number;
	aperture: number;
	/** For provenance and the bench UI: "mouse", "sim-heinz", ... */
	name?: string | undefined;
};

export type Type340Opts = {
	fetch: (addr: number) => number;
	store: (addr: number, word: number) => void;
	pens?: PenInput[];
	/** Backplane clock for cycle stamps. Wire to () => cabinet.cycles. */
	clock?: () => number;
	/** Every stroke, as drawn. The recorder's tap. */
	onSegment?: (s: Segment) => void;
	/** Every completed refresh frame (closed by the next IDLA). */
	onFrame?: (f: Frame) => void;
	/** Display words executed per backplane tick. Real ratio ~1; hardwired. */
	wordsPerTick?: number;
};

export class Type340 implements Device {
	readonly name = "type340";
	readonly iots = [0o05, 0o06, 0o07, 0o10, 0o11];

	/* 340 state — names follow SIMH's struct type340. */
	dac = 0;
	status = ST340_STOPPED;
	x = 0;
	y = 0;
	mode: Mode = MODE.PARAM;
	lpEna = false;
	scale = 1;
	intensity = 4;
	/* Type 342 */
	shift = 0;
	width = 6;
	height = 11;
	/* Type 347 */
	asr = 0;
	saveFF = false;

	/** No cycling until the program says IDLA. SIMH gets this from sim_activate. */
	enabled = false;

	/** Current frame's strokes; completed frames go through onFrame. */
	segments: Segment[] = [];
	/** The last completed frame — the "print screen" source. */
	lastFrame: Frame | null = null;
	frame = 0;
	private frameStart = 0;

	/** Beam position latched at pen hit, for IDRC readback. */
	penX = 0;
	penY = 0;
	/** The segment the pen hit — provenance answers "what was hit". */
	lastHit: Segment | null = null;
	/** Which pen fired — provenance answers "who hit it". */
	lastHitPen: PenInput | null = null;

	pens: PenInput[];
	clock: () => number;
	onSegment: ((s: Segment) => void) | undefined;
	onFrame: ((f: Frame) => void) | undefined;
	private readonly fetch: (addr: number) => number;
	private readonly store: (addr: number, word: number) => void;
	private readonly wordsPerTick: number;
	private subr = -1;
	private ownClock = 0;

	constructor(opts: Type340Opts) {
		this.fetch = opts.fetch;
		this.store = opts.store;
		this.pens = opts.pens ?? [];
		this.clock = opts.clock ?? (() => this.ownClock);
		this.onSegment = opts.onSegment;
		this.onFrame = opts.onFrame;
		this.wordsPerTick = opts.wordsPerTick ?? 1;
	}

	tick(): void {
		this.ownClock += 1;
		if (!this.enabled) return;
		for (let i = 0; i < this.wordsPerTick && this.status === 0; i += 1) {
			const word = this.fetch(this.dac);
			const addr = this.dac;
			this.dac = (this.dac + 1) & 0o7777;
			this.instruction(word, addr);
		}
	}

	/** Interrupt on pen hit, stop-with-interrupt, or either edge — SYMELEC's INT skip-chain. */
	irq(): boolean {
		return (this.status & (ST340_LPHIT | ST340_STOP_INT | ST340_VEDGE | ST340_HEDGE)) !== 0;
	}

	reset(): void {
		this.status = ST340_STOPPED;
		this.enabled = false;
		this.mode = MODE.PARAM;
		this.x = 0;
		this.y = 0;
		this.scale = 1;
		this.shift = 0;
		this.saveFF = false;
		this.subr = -1;
	}

	iot(req: Iot): IotReply {
		let ac = req.ac;
		let skip = false;
		switch (req.device) {
			case 0o05: /* IDVE 700501 skip on v-edge · IDRS 700504 resume */
				if (req.pulse & 0o1) skip = (this.status & ST340_VEDGE) !== 0;
				if (req.pulse & 0o2) ac |= this.dac;
				if (req.pulse & 0o4) {
					/* IDRS: resume in place. Clears the freeze causes a resume can
					   answer for. SIMH's glue cleared only LPHIT; SYMELEC's edge
					   handlers restart via IDLA instead, so this covers pen + edges. */
					this.status &= ~(ST340_LPHIT | ST340_VEDGE | ST340_HEDGE);
					this.enabled = true;
				}
				break;
			case 0o06: /* IDSI 700601 skip on stop · IDLA 700606 load address and go */
				if (req.pulse & 0o1) skip = (this.status & ST340_STOPPED) !== 0;
				if (req.pulse & 0o4) {
					/* IDLA is a restart: SYMELEC's PEN3, EDGEV, and EDGEH all
					   recover with LAW LB; IDLA. SIMH's glue cleared only
					   STOPPED|STOP_INT and would wedge after a pen hit or edge
					   violation; the listing (5406, 5602, 5616) says clear all. */
					if ((req.pulse & 0o10) === 0) this.setDac(ac & 0o7777);
					this.status = 0;
					this.enabled = true;
					this.closeFrame();
				} else if (req.pulse & 0o2) {
					this.setDac(0);
				}
				break;
			case 0o07: /* IDSP 700701 skip on pen · IDRC 700712 read beam coords */
				if (req.pulse & 0o1) skip = (this.status & ST340_LPHIT) !== 0;
				if (req.pulse & 0o2) {
					/* The packing TRCR (listing 5467-5501) unrotates:
					   IDRC; CLL+RAL; AND 1776 -> TEMPY   (y, LSB dropped)
					   IDRC; RTR x4;  AND 1776 -> TEMPX   (x, LSB dropped)
					   so AC = (x>>1)<<9 | (y>>1) — nine significant bits per
					   axis; the 1776 mask exists because the hardware drops
					   each coordinate's LSB. SIMH's glue: `dat |= 0; // X, Y`. */
					const packed = (((this.penX >> 1) & 0o777) << 9) | ((this.penY >> 1) & 0o777);
					if (req.pulse & 0o10) ac = packed;
					else ac |= packed;
				}
				if (req.pulse & 0o4) this.status = 0;
				break;
			case 0o10: /* IDHE 701001 skip on h-edge */
				if (req.pulse & 0o1) skip = (this.status & ST340_HEDGE) !== 0;
				if (req.pulse & 0o2) ac |= this.asr;
				break;
			case 0o11: /* IDPN 701112 — cabinet extension: which pen fired? */
				if (req.pulse & 0o1) skip = this.lastHitPen !== null;
				if (req.pulse & 0o2) {
					const n = this.lastHitPen ? this.pens.indexOf(this.lastHitPen) + 1 : 0;
					if (req.pulse & 0o10) ac = n;
					else ac |= n;
				}
				break;
		}
		return { ac, skip };
	}

	private setDac(addr: number): void {
		this.dac = addr & 0o7777;
		this.mode = MODE.PARAM;
		this.subr = -1;
	}

	private closeFrame(): void {
		if (this.segments.length === 0) return;
		const done: Frame = {
			index: this.frame,
			cycleStart: this.frameStart,
			cycleEnd: this.clock(),
			segments: this.segments,
		};
		this.lastFrame = done;
		this.onFrame?.(done);
		this.segments = [];
		this.frame += 1;
		this.frameStart = this.clock();
	}

	/** Execute one display word. Structure follows ty340_instruction verbatim. */
	instruction(inst: number, addr: number): void {
		/* cleared by RFD */
		this.status &= ~(ST340_HEDGE | ST340_VEDGE);
		if (this.status & ST340_STOPPED) return;

		let escape = false;
		switch (this.mode) {
			case MODE.PARAM: {
				this.mode = GETFIELD(inst, 2, 4) as Mode;
				if (TESTBIT(inst, 5)) this.lpEna = TESTBIT(inst, 6);
				if (TESTBIT(inst, 14)) this.intensity = GETFIELD(inst, 15, 17);
				if (TESTBIT(inst, 11)) this.scale = 1 << GETFIELD(inst, 12, 13);
				if (TESTBIT(inst, 7)) {
					this.status |= ST340_STOPPED;
					if (TESTBIT(inst, 8)) this.status |= ST340_STOP_INT;
				}
				break;
			}
			case MODE.POINT: {
				this.mode = GETFIELD(inst, 2, 4) as Mode;
				if (TESTBIT(inst, 5)) this.lpEna = TESTBIT(inst, 6);
				if (TESTBIT(inst, 1)) this.y = GETFIELD(inst, 8, 17);
				else this.x = GETFIELD(inst, 8, 17);
				if (TESTBIT(inst, 7)) this.emit(this.x, this.y, this.x, this.y, true, "point", addr);
				break;
			}
			case MODE.SLAVE: {
				/* no Type 343: set mode and halt without requesting data */
				this.mode = GETFIELD(inst, 2, 4) as Mode;
				this.status |= ST340_STOPPED;
				break;
			}
			case MODE.CHAR: {
				escape =
					this.character(GETFIELD(inst, 0, 5), addr) ||
					this.character(GETFIELD(inst, 6, 11), addr) ||
					this.character(GETFIELD(inst, 12, 17), addr);
				break;
			}
			case MODE.VECTOR: {
				escape = TESTBIT(inst, 0);
				if (
					this.vector(
						TESTBIT(inst, 1),
						TESTBIT(inst, 2),
						GETFIELD(inst, 3, 9),
						TESTBIT(inst, 10),
						GETFIELD(inst, 11, 17),
						addr,
					)
				)
					escape = true;
				break;
			}
			case MODE.VCONT: {
				/* repeat until raster violation. Guard: a zero-delta VCONT would
				   spin forever; the real machine would too, but we log-and-stop. */
				let guard = 4096;
				while (
					!this.vector(
						TESTBIT(inst, 1),
						TESTBIT(inst, 2),
						GETFIELD(inst, 3, 9),
						TESTBIT(inst, 10),
						GETFIELD(inst, 11, 17),
						addr,
					)
				) {
					guard -= 1;
					if (guard === 0) {
						this.status |= ST340_STOPPED;
						break;
					}
				}
				escape = true;
				break;
			}
			case MODE.INCR: {
				const i = TESTBIT(inst, 1);
				escape =
					this.ipoint(i, GETFIELD(inst, 2, 5), addr) ||
					this.ipoint(i, GETFIELD(inst, 6, 9), addr) ||
					this.ipoint(i, GETFIELD(inst, 10, 13), addr) ||
					this.ipoint(i, GETFIELD(inst, 14, 17), addr);
				if (!escape && TESTBIT(inst, 0)) escape = true;
				break;
			}
			case MODE.SUBR: {
				/* Type 347 subroutine facility */
				this.mode = GETFIELD(inst, 2, 4) as Mode;
				const target = GETFIELD(inst, 5, 17);
				switch (GETFIELD(inst, 0, 1)) {
					case DJS:
						this.asr = this.dac;
						this.saveFF = true;
						this.subr = target;
						this.dac = target & 0o7777;
						break;
					case DJP:
						this.dac = target & 0o7777;
						break;
					case DDS:
						/* Deposit "DJP <return>" into core. PIXIE reads locations
						   3 and 5 to tell lightbutton from drawing — the display
						   file's embedded CPU JMPs are its pen-dispatch table. */
						this.store(target, (DJP << 16) | this.asr);
						/* SIMH asks `/* clear SAVE_FF? *​/` — SYMELEC's lightbutton
						   file (LBD, listing page 1-2) answers yes: each DDS;
						   char; ESC block must fall through sequentially, not
						   return through the save register. */
						this.saveFF = false;
						/* The deposited linkage is this block's pen-dispatch
						   identity — what location 3 would say if the pen hit
						   here. Group the strokes under it: each lightbutton
						   becomes its own SVG <g>. */
						this.subr = this.asr;
						break;
				}
				break;
			}
		}

		if (escape) {
			this.mode = MODE.PARAM;
			if (this.saveFF) {
				this.dac = this.asr;
				this.saveFF = false;
				this.subr = -1;
			}
		}
	}

	/**
	 * Edge convention, diverging from SIMH's point()/ipoint()/character():
	 * SYMELEC's handlers (listing 5571, 5605) bind EDGEV<->Y (adjusts YCROSS)
	 * and EDGEH<->X (adjusts XCROSS). SIMH's vector() already agrees; its
	 * point() sets the opposite flags. The 1972 software is the authority:
	 * x violation -> HEDGE, y violation -> VEDGE, everywhere.
	 */
	private vector(
		intensify: boolean,
		sy: boolean,
		dy: number,
		sx: boolean,
		dx: number,
		addr: number,
	): boolean {
		const x0 = this.x;
		const y0 = this.y;
		let flags = 0;
		let x1 = sx ? x0 - dx * this.scale : x0 + dx * this.scale;
		if (x1 < 0) {
			x1 = 0;
			flags |= ST340_HEDGE;
		} else if (x1 > 1023) {
			x1 = 1023;
			flags |= ST340_HEDGE;
		}
		let y1 = sy ? y0 - dy * this.scale : y0 + dy * this.scale;
		if (y1 < 0) {
			y1 = 0;
			flags |= ST340_VEDGE;
		} else if (y1 > 1023) {
			y1 = 1023;
			flags |= ST340_VEDGE;
		}
		this.emit(x0, y0, x1, y1, intensify, "vector", addr);
		this.x = x1;
		this.y = y1;
		this.status |= flags;
		return flags !== 0;
	}

	private ipoint(intensify: boolean, byte: number, addr: number): boolean {
		if (byte & 0o10) {
			this.x += byte & 0o4 ? -this.scale : this.scale;
			if (this.x < 0 || this.x > 1023) {
				this.x = this.x < 0 ? 0 : 1023;
				this.status |= ST340_HEDGE; /* x -> HEDGE (SIMH ipoint says VEDGE) */
				return true;
			}
		}
		if (byte & 0o2) {
			this.y += byte & 0o1 ? -this.scale : this.scale;
			if (this.y < 0 || this.y > 1023) {
				this.y = this.y < 0 ? 0 : 1023;
				this.status |= ST340_VEDGE;
				return true;
			}
		}
		if (intensify) this.emit(this.x, this.y, this.x, this.y, true, "incr", addr);
		return false;
	}

	private character(c: number, addr: number): boolean {
		const s = this.scale;
		const glyph = CHARS[c | this.shift] ?? CHARS[0]!;
		const flags = glyph[5] ?? 0;

		if (flags === CH_LF) {
			this.y -= this.height * s;
			if (this.y < 0) {
				this.status |= ST340_VEDGE; /* y -> VEDGE (SIMH says HEDGE here) */
				this.y = 0;
			}
			return false;
		}
		if (flags === CH_CR) {
			this.x = 0;
			return false;
		}
		if (flags === CH_UC) {
			this.shift = 0;
			return false;
		}
		if (flags === CH_LC) {
			this.shift = 0o100;
			return false;
		}
		if (flags === CH_ESC) return true;
		if (flags === CH_NSPC && this.x >= this.width * s) this.x -= this.width * s;
		if (flags === CH_D) this.y -= 2 * s;
		if (flags === CH_SUB) {
			this.y -= (this.width * s) >> 1;
			return false;
		}
		if (flags === CH_SUP) {
			this.y += (this.width * s) >> 1;
			return false;
		}
		for (let col = 0; col < 5; col += 1) {
			for (let row = 0; row < 7; row += 1) {
				if ((glyph[col] ?? 0) & (2 << row)) {
					this.emit(
						this.x + col * s,
						this.y + row * s,
						this.x + col * s,
						this.y + row * s,
						true,
						"char",
						addr,
					);
				}
			}
		}
		this.x += flags === CH_BS ? -this.width * s : this.width * s;
		if (flags === CH_D) this.y += 2 * s;
		if (this.x > 1023) {
			this.x = 1023;
			this.status |= ST340_HEDGE; /* x -> HEDGE (SIMH says VEDGE here) */
		}
		return false;
	}

	private emit(
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		intensify: boolean,
		kind: SegmentKind,
		addr: number,
	): void {
		const seg: Segment = {
			x0,
			y0,
			x1,
			y1,
			intensify,
			kind,
			addr,
			cycle: this.clock(),
			frame: this.frame,
			subr: this.subr,
			intensity: this.intensity,
			scale: this.scale,
		};
		this.segments.push(seg);
		this.onSegment?.(seg);
		if (intensify && this.lpEna) {
			for (const pen of this.pens) {
				if (!pen.enabled) continue;
				const a = pen.aperture;
				if (dist2(pen.x, pen.y, x0, y0, x1, y1) <= a * a) {
					/* A pen saw the blue flash: hit means freshly intensified,
					   never afterglow. It freezes the display (status != 0)
					   until IDRS resumes or IDLA restarts. First pen wins the
					   coordinate latch, as the first photocell pulse would. */
					this.status |= ST340_LPHIT;
					this.penX = x1;
					this.penY = y1;
					this.lastHit = seg;
					this.lastHitPen = pen;
					break;
				}
			}
		}
	}

	/** Node-safe canvas stroke of the given segments (default: current frame). */
	stroke(ctx: StrokeTarget, segments: readonly Segment[] = this.segments): void {
		for (const s of segments) {
			if (!s.intensify) continue;
			ctx.beginPath();
			ctx.moveTo(s.x0, 1023 - s.y0);
			ctx.lineTo(s.x1, 1023 - s.y1);
			ctx.stroke();
		}
	}
}

/** CanvasRenderingContext2D, or anything with the same three calls. Node-safe. */
export type StrokeTarget = {
	beginPath(): void;
	moveTo(x: number, y: number): void;
	lineTo(x: number, y: number): void;
	stroke(): void;
};

/** Squared distance from point to segment — the pen's aperture test. */
export function dist2(
	px: number,
	py: number,
	x0: number,
	y0: number,
	x1: number,
	y1: number,
): number {
	const dx = x1 - x0;
	const dy = y1 - y0;
	const len2 = dx * dx + dy * dy;
	if (len2 === 0) {
		const ex = px - x0;
		const ey = py - y0;
		return ex * ex + ey * ey;
	}
	let t = ((px - x0) * dx + (py - y0) * dy) / len2;
	if (t < 0) t = 0;
	else if (t > 1) t = 1;
	const hx = px - (x0 + t * dx);
	const hy = py - (y0 + t * dy);
	return hx * hx + hy * hy;
}

/* Type 342 special-character codes (column 5 of the glyph table). */
const CH_LF = 0o001;
const CH_CR = 0o002;
const CH_UC = 0o003;
const CH_LC = 0o004;
const CH_ESC = 0o005;
const CH_NSPC = 0o006;
const CH_D = 0o007;
const CH_BS = 0o010;
const CH_SUB = 0o011;
const CH_SUP = 0o012;

/*
 * Type 342 glyphs, verbatim from SIMH display/type340.c. Each entry is five
 * vertical stripes (bit 7 = top row, bit 1 = bottom) plus a flag byte.
 * Uppercase set from the 340 programming manual (DECUS 7-13 p.24); the
 * lowercase letterforms are Lars Brinkhoff's film archaeology — recovered
 * frame by frame from MIT AI lab footage ("AI film 75", "AI film 104"),
 * with Knight TV fills where the film never showed a letter.
 */
const CHARS: readonly (readonly number[])[] = [
	[0o070, 0o124, 0o154, 0o124, 0o070, 0], /* 00 blob */
	[0o176, 0o220, 0o220, 0o220, 0o176, 0], /* 01 A */
	[0o376, 0o222, 0o222, 0o222, 0o154, 0], /* 02 B */
	[0o174, 0o202, 0o202, 0o202, 0o104, 0], /* 03 C */
	[0o376, 0o202, 0o202, 0o202, 0o174, 0], /* 04 D */
	[0o376, 0o222, 0o222, 0o222, 0o222, 0], /* 05 E */
	[0o376, 0o220, 0o220, 0o220, 0o220, 0], /* 06 F */
	[0o174, 0o202, 0o222, 0o222, 0o134, 0], /* 07 G */
	[0o376, 0o020, 0o020, 0o020, 0o376, 0], /* 10 H */
	[0o000, 0o202, 0o376, 0o202, 0o000, 0], /* 11 I */
	[0o004, 0o002, 0o002, 0o002, 0o374, 0], /* 12 J */
	[0o376, 0o020, 0o050, 0o104, 0o202, 0], /* 13 K */
	[0o376, 0o002, 0o002, 0o002, 0o002, 0], /* 14 L */
	[0o376, 0o100, 0o040, 0o100, 0o376, 0], /* 15 M */
	[0o376, 0o100, 0o040, 0o020, 0o376, 0], /* 16 N */
	[0o174, 0o202, 0o202, 0o202, 0o174, 0], /* 17 O */
	[0o376, 0o220, 0o220, 0o220, 0o140, 0], /* 20 P */
	[0o174, 0o202, 0o212, 0o206, 0o176, 0], /* 21 Q */
	[0o376, 0o220, 0o230, 0o224, 0o142, 0], /* 22 R */
	[0o144, 0o222, 0o222, 0o222, 0o114, 0], /* 23 S */
	[0o200, 0o200, 0o376, 0o200, 0o200, 0], /* 24 T */
	[0o374, 0o002, 0o002, 0o002, 0o374, 0], /* 25 U */
	[0o370, 0o004, 0o002, 0o004, 0o370, 0], /* 26 V */
	[0o376, 0o004, 0o010, 0o004, 0o376, 0], /* 27 W */
	[0o202, 0o104, 0o070, 0o104, 0o202, 0], /* 30 X */
	[0o200, 0o100, 0o076, 0o100, 0o200, 0], /* 31 Y */
	[0o226, 0o232, 0o222, 0o262, 0o322, 0], /* 32 Z */
	[0, 0, 0, 0, 0, CH_LF],
	[0, 0, 0, 0, 0, CH_CR],
	[0, 0, 0, 0, 0, CH_UC],
	[0, 0, 0, 0, 0, CH_LC],
	[0, 0, 0, 0, 0, CH_ESC],
	[0o000, 0o000, 0o000, 0o000, 0o000, 0], /* 40 space */
	[0o000, 0o000, 0o372, 0o000, 0o000, 0], /* 41 ! */
	[0o000, 0o340, 0o000, 0o340, 0o000, 0], /* 42 " */
	[0o050, 0o376, 0o050, 0o376, 0o050, 0], /* 43 # */
	[0o144, 0o222, 0o376, 0o222, 0o114, 0], /* 44 $ */
	[0o306, 0o310, 0o220, 0o246, 0o306, 0], /* 45 % */
	[0o154, 0o222, 0o156, 0o004, 0o012, 0], /* 46 & */
	[0o000, 0o000, 0o300, 0o340, 0o000, 0], /* 47 ' */
	[0o000, 0o070, 0o104, 0o202, 0o000, 0], /* 50 ( AI film 104 */
	[0o000, 0o202, 0o104, 0o070, 0o000, 0], /* 51 ) AI film 104 */
	[0o104, 0o050, 0o174, 0o050, 0o104, 0], /* 52 * AI film */
	[0o020, 0o020, 0o174, 0o020, 0o020, 0], /* 53 + */
	[0o000, 0o032, 0o034, 0o000, 0o000, 0], /* 54 , AI film 104 */
	[0o020, 0o020, 0o020, 0o020, 0o020, 0], /* 55 - */
	[0o000, 0o006, 0o006, 0o000, 0o000, 0], /* 56 . */
	[0o004, 0o010, 0o020, 0o040, 0o100, 0], /* 57 / */
	[0o174, 0o212, 0o222, 0o242, 0o174, 0], /* 60 0 */
	[0o000, 0o102, 0o376, 0o002, 0o000, 0], /* 61 1 */
	[0o116, 0o222, 0o222, 0o222, 0o142, 0], /* 62 2 */
	[0o104, 0o202, 0o222, 0o222, 0o154, 0], /* 63 3 */
	[0o020, 0o060, 0o120, 0o376, 0o020, 0], /* 64 4 */
	[0o344, 0o222, 0o222, 0o222, 0o214, 0], /* 65 5 */
	[0o174, 0o222, 0o222, 0o222, 0o114, 0], /* 66 6 */
	[0o306, 0o210, 0o220, 0o240, 0o300, 0], /* 67 7 */
	[0o154, 0o222, 0o222, 0o222, 0o154, 0], /* 70 8 */
	[0o144, 0o222, 0o222, 0o222, 0o174, 0], /* 71 9 */
	[0o000, 0o066, 0o066, 0o000, 0o000, 0], /* 72 : */
	[0o000, 0o332, 0o334, 0o000, 0o000, 0], /* 73 ; */
	[0o020, 0o050, 0o104, 0o202, 0o000, 0], /* 74 < */
	[0o050, 0o050, 0o050, 0o050, 0o050, 0], /* 75 = */
	[0o000, 0o202, 0o104, 0o050, 0o020, 0], /* 76 > */
	[0o100, 0o200, 0o236, 0o220, 0o140, 0], /* 77 ? */
	/* shifted set (shift = 0o100): lowercase and specials */
	[0o070, 0o124, 0o154, 0o124, 0o070, 0], /* 00 blob */
	[0o034, 0o042, 0o042, 0o074, 0o002, 0], /* 01 a AI film 75 */
	[0o376, 0o042, 0o042, 0o042, 0o034, 0], /* 02 b AI film 75 */
	[0o034, 0o042, 0o042, 0o042, 0o024, 0], /* 03 c */
	[0o034, 0o042, 0o042, 0o042, 0o376, 0], /* 04 d AI film 75 */
	[0o034, 0o052, 0o052, 0o052, 0o030, 0], /* 05 e AI film 75 */
	[0o020, 0o176, 0o220, 0o200, 0o100, 0], /* 06 f Knight TV */
	[0o160, 0o212, 0o212, 0o212, 0o174, CH_D], /* 07 g AI film 75 */
	[0o376, 0o040, 0o040, 0o040, 0o036, 0], /* 10 h AI film 75 */
	[0o000, 0o042, 0o276, 0o002, 0o000, 0], /* 11 i AI film 75 */
	[0o000, 0o004, 0o042, 0o274, 0o000, 0], /* 12 j */
	[0o376, 0o010, 0o030, 0o044, 0o002, 0], /* 13 k AI film 75 */
	[0o000, 0o202, 0o376, 0o002, 0o000, 0], /* 14 l AI film 75 */
	[0o076, 0o040, 0o036, 0o040, 0o036, 0], /* 15 m */
	[0o076, 0o020, 0o040, 0o040, 0o036, 0], /* 16 n AI film 75 */
	[0o034, 0o042, 0o042, 0o042, 0o034, 0], /* 17 o AI film 75 */
	[0o376, 0o210, 0o210, 0o210, 0o160, CH_D], /* 20 p Knight TV */
	[0o160, 0o210, 0o210, 0o210, 0o376, CH_D], /* 21 q Knight TV */
	[0o076, 0o020, 0o040, 0o040, 0o020, 0], /* 22 r AI film 75 */
	[0o022, 0o052, 0o052, 0o052, 0o044, 0], /* 23 s */
	[0o040, 0o374, 0o042, 0o002, 0o004, 0], /* 24 t AI film 75 */
	[0o074, 0o002, 0o002, 0o004, 0o076, 0], /* 25 u AI film 75 */
	[0o070, 0o004, 0o002, 0o004, 0o070, 0], /* 26 v Knight TV */
	[0o074, 0o002, 0o034, 0o002, 0o074, 0], /* 27 w AI film 75 */
	[0o042, 0o024, 0o010, 0o024, 0o042, 0], /* 30 x */
	[0o360, 0o012, 0o012, 0o012, 0o374, CH_D], /* 31 y AI film 75 */
	[0o042, 0o056, 0o052, 0o072, 0o042, 0], /* 32 z Knight TV */
	[0, 0, 0, 0, 0, CH_LF],
	[0, 0, 0, 0, 0, CH_CR],
	[0, 0, 0, 0, 0, CH_UC],
	[0, 0, 0, 0, 0, CH_LC],
	[0, 0, 0, 0, 0, CH_ESC],
	[0o000, 0o000, 0o000, 0o000, 0o000, 0], /* 40 space */
	[0o376, 0o376, 0o376, 0o376, 0o376, 0],
	[0o376, 0o376, 0o376, 0o376, 0o376, 0],
	[0o100, 0o200, 0o100, 0o040, 0o100, 0], /* 43 ~ */
	[0o376, 0o376, 0o376, 0o376, 0o376, 0],
	[0o376, 0o376, 0o376, 0o376, 0o376, 0],
	[0o040, 0o100, 0o376, 0o100, 0o040, 0], /* 46 up arrow */
	[0o020, 0o020, 0o124, 0o070, 0o020, 0], /* 47 left arrow */
	[0o010, 0o004, 0o376, 0o004, 0o010, 0], /* 50 down arrow */
	[0o020, 0o070, 0o124, 0o020, 0o020, 0], /* 51 right arrow */
	[0o100, 0o040, 0o020, 0o010, 0o004, 0], /* 52 \ */
	[0o000, 0o376, 0o202, 0o202, 0o000, 0], /* 53 [ */
	[0o000, 0o202, 0o202, 0o376, 0o000, 0], /* 54 ] */
	[0o000, 0o020, 0o154, 0o202, 0o000, 0], /* 55 { */
	[0o000, 0o202, 0o154, 0o020, 0o000, 0], /* 56 } */
	[0o376, 0o376, 0o376, 0o376, 0o376, 0],
	[0o002, 0o002, 0o002, 0o002, 0o002, 0], /* 60 _ */
	[0o376, 0o376, 0o376, 0o376, 0o376, 0],
	[0o000, 0o000, 0o376, 0o000, 0o000, 0], /* 62 | */
	[0o376, 0o376, 0o376, 0o376, 0o376, 0],
	[0o376, 0o376, 0o376, 0o376, 0o376, 0],
	[0o376, 0o376, 0o376, 0o376, 0o376, 0],
	[0o000, 0o200, 0o100, 0o040, 0o000, CH_NSPC], /* 66 ` */
	[0o040, 0o100, 0o200, 0o100, 0o040, CH_NSPC], /* 67 ^ */
	[0o376, 0o376, 0o376, 0o376, 0o376, 0],
	[0o376, 0o376, 0o376, 0o376, 0o376, 0],
	[0, 0, 0, 0, 0, CH_BS],
	[0o376, 0o376, 0o376, 0o376, 0o376, CH_SUB],
	[0o376, 0o376, 0o376, 0o376, 0o376, 0],
	[0o376, 0o376, 0o376, 0o376, 0o376, 0],
	[0o376, 0o376, 0o376, 0o376, 0o376, 0],
	[0o376, 0o376, 0o376, 0o376, 0o376, CH_SUP],
];
