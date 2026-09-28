import { Cabinet } from "./cabinet.js";
import { Clock } from "./plugins/clock.js";
import { PaperTape, readInAndGo } from "./plugins/papertape.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { Rb09 } from "./plugins/rb09.js";
import { Teletype } from "./plugins/teletype.js";

/** Bell Labs loaded Phil Budne's bootstrap at the user origin; it reads the system from track 180. */
export const UNIXV0_BOOT_ORIGIN = 0o10000;

export type UnixV0Opts = {
	/** The RB09 platter, from `parseRbImage(image.fs)`. Written in place. */
	image: Uint32Array;
	/** `boot.rim` from pdp7-unix/build. */
	bootTape: Uint8Array;
	/** Paper output, echo included, one character at a time. */
	onPaper?: (char: string) => void;
};

/**
 * PDP-7 UNIX (1969), from DoctorWkt/pdp7-unix, as SIMH's build/unixv0.simh
 * sets it up: 8K and EAE, the KSR-33 in `set tti unix` mode, the clock,
 * the paper tape reader, and the RB09 at device 71. The Graphic-2 is not
 * plugged in; its IOTs no-op and the kernel's display code stays idle.
 */
export function bootUnixV0(opts: UnixV0Opts) {
	const cpu = new Pdp7({ coreWords: 8192 });
	let paper = "";
	const print = (c: number): void => {
		const ch = String.fromCharCode(c & 0o177);
		paper += ch;
		opts.onPaper?.(ch);
	};
	const tty = new Teletype({ onPrint: print });
	const disk = new Rb09({ cpu, image: opts.image });
	const box = new Cabinet({ cpu, devices: [new Clock({ cpu }), tty, new PaperTape(), disk] });
	const start = readInAndGo(cpu, opts.bootTape, UNIXV0_BOOT_ORIGIN);
	if (start === null) throw new Error("boot.rim ends in HLT, not a JMP");
	cpu.pc = start;

	/** A key, as SIMH's UNIX-mode TTI delivers it; the KSR-33 prints it locally (half duplex). */
	const key = (ch: string): void => {
		const code = unixKey(ch.charCodeAt(0));
		print(code === 0o375 ? 0o33 : code); // SIMH echoes the ESC it was given
		tty.type(code);
	};
	let mark = 0;
	return {
		cpu,
		tty,
		disk,
		box,
		key,
		/** Type a line or a few keys, running the machine between strokes so the kernel can read each. */
		type(text: string, cyclesPerKey = 20_000): void {
			for (const ch of text) {
				key(ch);
				box.run(cyclesPerKey);
			}
		},
		/** Run until the paper shows `text` after the last match, or give up. */
		runUntil(text: string, maxCycles = 20_000_000, slice = 50_000): boolean {
			for (let n = 0; n < maxCycles; n += slice) {
				if (paper.indexOf(text, mark) >= 0) {
					mark = paper.indexOf(text, mark) + text.length;
					return true;
				}
				if (box.run(slice).halt) return false;
			}
			return false;
		},
		paper: (): string => paper,
	};
}

/** SIMH `set tti unix`: seven bits, mark parity, CR and LF swapped, ESC becomes ALT MODE. */
export function unixKey(c: number): number {
	const k = (c & 0o177) | 0o200;
	if (k === 0o215) return 0o212;
	if (k === 0o212) return 0o215;
	if (k === 0o233) return 0o375;
	return k;
}
