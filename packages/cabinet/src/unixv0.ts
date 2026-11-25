import { Cabinet } from "./cabinet.js";
import { Clock } from "./plugins/clock.js";
import { PaperTape, readInAndGo } from "./plugins/papertape.js";
import { Pdp7, type Pdp7Opts } from "./plugins/pdp7.js";
import { Rb09 } from "./plugins/rb09.js";
import { Teletype } from "./plugins/teletype.js";
import { type DemoScript, type Focus, wait } from "./symelec-demo.js";

/** Bell Labs loaded Phil Budne's bootstrap at the user origin; it reads the system from track 180. */
export const UNIXV0_BOOT_ORIGIN = 0o10000;

export type UnixV0Opts = {
	/** The RB09 platter, from `parseRbImage(image.fs)`. Written in place. */
	image: Uint32Array;
	/** `boot.rim` from pdp7-unix/build. */
	bootTape: Uint8Array;
	/** Paper output, echo included, one character at a time. */
	onPaper?: (char: string) => void;
	/** Build the CPU: `Pdp7` by default, `KorzPdp7` for the differential tests. */
	cpu?: (opts: Pdp7Opts) => Pdp7;
	/** Tick every unit every cycle, the oracle for the event-driven backplane. */
	everyCycle?: boolean;
};

/**
 * PDP-7 UNIX (1969), from DoctorWkt/pdp7-unix, as SIMH's build/unixv0.simh
 * sets it up: 8K and EAE, the KSR-33 in `set tti unix` mode, the clock,
 * the paper tape reader, and the RB09 at device 71. The Graphic-2 is not
 * plugged in; its IOTs no-op and the kernel's display code stays idle.
 */
export function bootUnixV0(opts: UnixV0Opts) {
	const cpu = (opts.cpu ?? ((o) => new Pdp7(o)))({ coreWords: 8192 });
	let paper = "";
	const print = (c: number): void => {
		const ch = String.fromCharCode(c & 0o177);
		paper += ch;
		opts.onPaper?.(ch);
	};
	const tty = new Teletype({ onPrint: print });
	const disk = new Rb09({ cpu, image: opts.image });
	const box = new Cabinet({ cpu, everyCycle: opts.everyCycle ?? false, devices: [new Clock({ cpu }), tty, new PaperTape(), disk] });
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

/** What the KSR-33 prints for a key under `set tti unix`: Return feeds the line, as the kernel then sends CR. */
export function unixEcho(c: number): number {
	const k = c & 0o177;
	if (k === 0o15) return 0o12;
	if (k === 0o12) return 0o15;
	return k;
}

export interface UnixHost extends Focus {
	/** Type on the teletype, lower case as it comes; newline is Return. */
	type: (text: string) => void;
}

/**
 * Daisy Bell (Harry Dacre, 1892), the song an IBM 7094 sang at Bell Labs in 1961, as a tune
 * the bus dance plays off the paper (TUNE_LINE in dance.ts): a letter a step, `-` holding,
 * `'` and `,` before a note sending it up or down. A quarter note is two steps, a bar of 3/4 six.
 */
export const DAISY: readonly string[] = [
	"g-----e-----c-----g-----a-b-c-a---c-g---------",
	"'d-----g-----e-----c-----a-b-c-d---e-d---------",
	"e-f-e-d-g---e-d-c-----d-e---c-a---c-a-g-------",
	"g-c---e-d---,g-c---e-d---e-f-g-e-c-d---,g-c-----------",
];

/** Cycles a sixteenth of the dance takes at 120 beats a minute and the PDP-7's own speed. */
const STEP = 72_000;

/**
 * Log in as ken and look around: ls, the date the clock thinks it is, and a file of ken's. Then
 * write Daisy Bell with ed and cat it, for the dance to play off the paper, and let UNIX
 * assemble its own kernel from ken's sources, as his sys.rc does, and print the symbols.
 */
export function* unixDemo(h: UnixHost): DemoScript {
	const say = function* (caption: string, line: string, cycles: number): DemoScript {
		yield caption;
		h.type(`${line}\n`);
		yield* wait(cycles);
	};
	h.show?.("tty");
	yield "The paper tape bootstrap has read UNIX off the RB09's track 180. It asks who you are";
	yield* wait(2_500_000);
	yield* say("Log in as ken, Ken Thompson", "ken", 2_000_000);
	yield* say("The password is ken too. The KSR-33 prints it: it is half duplex", "ken", 4_000_000);
	yield* say("@ is the shell's prompt. List ken's directory", "ls", 8_000_000);
	yield* say("The clock starts at the epoch, 1 January 1970", "date", 5_000_000);
	yield* say("sys.rc: how ken rebuilt the kernel, with as", "cat sys.rc", 8_000_000);
	yield* say("The commands, in ken's system directory", "ls system", 16_000_000);
	yield* say("With DANCE on, the paper is a sequencer: a character a step, a kick at each line feed. Now a song, written with ed", "ed daisy", 3_000_000);
	yield* say("a appends lines. Each is a tune: note names, - holds, ' and , jump an octave", "a", 1_000_000);
	for (const line of DAISY) yield* say("Daisy Bell, 1892. An IBM 7094 sang it at Bell Labs in 1961", line, line.length * STEP + 1_000_000);
	yield* say("A dot alone ends the text; w writes it to the disk", ".", 1_000_000);
	yield* say("w writes the file; ed prints how many characters", "w daisy", 6_000_000);
	yield* say("q quits ed", "q", 2_000_000);
	yield* say("cat prints the file, and the teletype plays it", "cat daisy", (DAISY.join("").length + 8) * STEP + 2_000_000);
	yield* say("UNIX assembles itself: ken's kernel, s1.s to s8.s, the way his sys.rc did. Two and a half minutes at the PDP-7's speed; speed up to hurry it", "as sop.s s1.s s2.s s3.s s4.s s5.s s6.s s7.s s8.s", 90_000_000);
	yield* say("nm prints the kernel's symbols, from n.out. The dance listens to some of them, uniqpid and u.pid among them", "nm n.out", 8_000_000);
	yield "Your turn: click the paper and type. Files you write stay on the disk until you reload the page";
	yield* wait(1_000_000);
}
