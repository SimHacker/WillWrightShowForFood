import { assemble, loadAsm, type AsmResult } from "./asm.js";
import type { Pdp7 } from "./plugins/pdp7.js";
import { type DemoScript, wait } from "./symelec-demo.js";

/**
 * HILO, a teletype number guessing game written for the cabinet
 * (tapes/hilo/hilo.s). Not a period program: it exercises the KSR-33
 * the way one would, polled and half duplex.
 */
export function assembleHilo(source: string): AsmResult {
	return assemble([{ name: "hilo.s", text: source }]);
}

/** Deposit the program and point the CPU at its start. Throws if it did not assemble clean. */
export function bootHilo(cpu: Pdp7, program: AsmResult): void {
	const e = program.errors;
	if (e.length > 0) throw new Error(`hilo did not assemble, ${e.length} errors:\n${e.join("\n")}`);
	loadAsm(cpu, program);
	cpu.pc = program.start ?? 0o100;
}

export interface TeletypeHost {
	cpu: Pdp7;
	/** Type on the keyboard, as the operator would: the paper shows it with local copy. */
	type: (text: string) => void;
}

/** An operator who halves the range each time. It reads the number from core only to know when to stop. */
export function* hiloDemo(h: TeletypeHost, program: AsmResult): DemoScript {
	const secret = () => h.cpu.read(program.symbols.get("secret") ?? 0) & 0o777777;
	yield "HILO prints its banner, then waits for a key";
	yield* wait(250_000);
	yield "Return: the number is whatever the counter held when it was pressed";
	h.type("\r");
	yield* wait(150_000);
	let lo = 0;
	let hi = 99;
	for (let n = 0; n < 8 && lo <= hi; n += 1) {
		const g = (lo + hi) >> 1;
		yield `Guess ${g}, halfway between ${lo} and ${hi}`;
		for (const c of `${g}\r`) {
			h.type(c);
			yield* wait(30_000);
		}
		yield* wait(120_000);
		const s = secret();
		if (g === s) break;
		if (g < s) lo = g + 1;
		else hi = g - 1;
	}
	yield "Halving finds any number from 0 to 99 in seven guesses. Your turn: click the paper";
	yield* wait(400_000);
}
