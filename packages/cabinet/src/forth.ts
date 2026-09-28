import type { AsmResult } from "./asm/core.js";
import { assembleAs7 } from "./asm/as7.js";
import { Cabinet } from "./cabinet.js";
import { PaperTape } from "./plugins/papertape.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { Teletype } from "./plugins/teletype.js";
import { type DemoScript, wait } from "./symelec-demo.js";

/**
 * Mitch Bradley's PDP-7 Forth: its kernel, either as `as7` left it (the `addr: word` image and
 * the listing's labels) or assembled here, and the Forth compiled into it.
 */
export type ForthTapes = (
	| { a7out: string; listing: string }
	| { kernel: AsmResult }
) & {
	/** Forth source compiled into the image before it starts, in order: prelude.fs, then turtle.fs. */
	sources: readonly string[];
};

/** Mitch's `make`: `as7 sop.s kernel.s end.s`, with our as7 front end. */
export function assembleForthKernel(tapes: { sop: string; kernel: string; end: string; kernelName?: string }): AsmResult {
	return assembleAs7([
		{ name: "sop.s", text: tapes.sop },
		{ name: tapes.kernelName ?? "kernel.s", text: tapes.kernel },
		{ name: "end.s", text: tapes.end },
	]);
}

export type ForthImage = {
	core: Uint32Array;
	cold: number;
	labels: Map<string, number>;
	/** What the compile printed: each tape line echoed, and its " ok". */
	log: string;
};

/** `as7 -o` output: one `addr: word` per line, octal, with the source after a tab. */
export function parseA7out(text: string): Array<[addr: number, word: number]> {
	const out: Array<[number, number]> = [];
	for (const line of text.split("\n")) {
		const m = line.match(/^([0-7]+):\s*([0-7]+)/);
		if (m) out.push([Number.parseInt(m[1] as string, 8), Number.parseInt(m[2] as string, 8)]);
	}
	return out;
}

/** The `Labels:` table at the end of an `as7 -f list` listing. */
export function parseAs7Labels(listing: string): Map<string, number> {
	const labels = new Map<string, number>();
	let inLabels = false;
	for (const line of listing.split("\n")) {
		if (line.startsWith("Labels:")) inLabels = true;
		else if (inLabels) {
			const [name, addr] = line.trim().split(/\s+/);
			if (name && addr && /^[0-7]+$/.test(addr)) labels.set(name, Number.parseInt(addr, 8));
		}
	}
	return labels;
}

/**
 * What Mitch's tools/prelude.py does under SIMH, done on the cabinet: boot the kernel at
 * `cold`, mount the sources on the paper tape reader with a ^D after them, type TAPE, and keep
 * the core once the reader is back at the keyboard. Throws with the offending line if any
 * tape line answers anything but " ok", as prelude.py does.
 */
export function compileForth(tapes: ForthTapes, maxCycles = 60_000_000): ForthImage {
	if ("kernel" in tapes && tapes.kernel.errors.length > 0) throw new Error(`the Forth kernel did not assemble:\n${tapes.kernel.errors.join("\n")}`);
	const labels = "kernel" in tapes ? new Map(tapes.kernel.symbols) : parseAs7Labels(tapes.listing);
	const cold = labels.get("cold");
	if (cold === undefined) throw new Error("no 'cold' label in the Forth kernel");
	const cpu = new Pdp7({ coreWords: 8192 });
	for (const [addr, word] of "kernel" in tapes ? tapes.kernel.words : parseA7out(tapes.a7out)) cpu.write(addr, word);
	let log = "";
	const tty = new Teletype({ printCycles: 100, onPrint: (c) => (log += String.fromCharCode(c & 0o177)) });
	const reader = new PaperTape({ frameCycles: 50 });
	const box = new Cabinet({ cpu, devices: [tty, reader] });
	const text = tapes.sources.join("\n").replace(/\r\n?/g, "\n") + "\n\x04";
	reader.mount(new TextEncoder().encode(text));
	cpu.pc = cold;
	box.run(200_000);
	for (const c of "TAPE\r") tty.type(c.charCodeAt(0) | 0o200);
	for (let n = 0; n < maxCycles; n += 100_000) {
		box.run(100_000);
		if (cpu.halted) throw new Error(`Forth halted while compiling:\n${log.slice(-400)}`);
		if (reader.pos >= reader.tape.length && tty.waiting === 0 && log.endsWith("ok\r\n")) break;
	}
	if (reader.pos < reader.tape.length) throw new Error(`Forth stopped reading the tape:\n${log.slice(-400)}`);
	const bad = log
		.split("\r\n")
		.slice(1, -1)
		.filter((l) => l.trim() !== "" && !/\sok$/.test(l) && !/^TAPE/.test(l));
	if (bad.length > 0) throw new Error(`Forth did not accept:\n${bad.join("\n")}`);
	const core = new Uint32Array(8192);
	for (let a = 0; a < core.length; a += 1) core[a] = cpu.read(a);
	return { core, cold, labels, log };
}

/** Deposit a compiled image and point the CPU at `cold`, which prints the banner and waits at the prompt. */
export function bootForth(cpu: Pdp7, image: ForthImage): void {
	for (let a = 0; a < image.core.length; a += 1) cpu.write(a, image.core[a] ?? 0);
	cpu.pc = image.cold;
}

/**
 * A SIGWINCH for a Forth that has never heard of one. WORDS starts a new line once its column
 * reaches -dm60 (60 in Mitch's kernel), and nothing else reads dm60, so the terminal writes its
 * own width there. The margin leaves room for the longest name in the dictionary, 11 characters
 * (CLEARSCREEN), and its space. Returns false if the listing has no dm60.
 */
export function setForthColumns(cpu: Pdp7, image: ForthImage, cols: number): boolean {
	const at = image.labels.get("dm60");
	if (at === undefined) return false;
	const limit = Math.max(8, Math.floor(cols) - 12);
	cpu.write(at, -limit & 0o777777);
	return true;
}

export interface ForthHost {
	/** Type a line on the teletype; Forth echoes it itself. */
	type: (text: string) => void;
}

/** A scripted session: arithmetic at the prompt, then the turtle, the way the pdp7forth README walks it. */
export function* forthDemo(h: ForthHost): DemoScript {
	const say = function* (caption: string, line: string, cycles: number): DemoScript {
		yield caption;
		h.type(`${line}\n`);
		yield* wait(cycles);
	};
	yield "Mitch Bradley's PDP-7 Forth prints its banner and waits at the teletype";
	yield* wait(600_000);
	yield* say("Arithmetic at the prompt: two, three, add, print", "2 3 + .", 1_000_000);
	yield* say("A loop right at the prompt draws a square with the turtle", "4 0 DO 200 FD 90 RT LOOP", 2_000_000);
	yield* say("Name it: a colon definition", ": SQ 4 0 DO 200 FD 90 RT LOOP ;", 1_000_000);
	yield* say("A flower is eight squares, each turned 45 degrees", ": FLOWER 8 0 DO SQ 45 RT LOOP ;", 1_000_000);
	yield* say("Clear the screen and draw it", "CS FLOWER", 3_000_000);
	yield* say("A star: five strokes, turning 144 degrees", ": STAR 5 0 DO 400 FD 144 RT LOOP ;", 1_000_000);
	yield* say("Pen up, step aside, pen down, and draw the star", "CS PU 200 BK 90 LT 200 FD 90 RT PD STAR", 2_500_000);
	yield* say("Both together, and hide the turtle", "CS FLOWER PU 450 BK PD STAR HT", 4_000_000);
	yield "Your turn: click the paper and type. WORDS lists every word; FD BK RT LT PU PD CS HOME draw";
	yield* wait(1_000_000);
}
