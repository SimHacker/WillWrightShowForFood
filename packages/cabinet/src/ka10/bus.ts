/**
 * What a KA10 device sees of the processor, and what the cabinet drives. Devices are written
 * against `Ka10Bus` alone, so the same console, tape, disk and clock plug into every rung: the
 * SIMH port, the halves switch, and the Korz rungs. A device never imports a CPU.
 */
import type { DevIo } from "./defs.js";
import type { Events } from "./events.js";
import type { Ka10State, Stop } from "./ka10.js";

export interface Ka10Bus {
	readonly its: boolean;
	readonly memWords: number;
	/** SIMH's event queue in SIMH's ticks; devices schedule their units on it. */
	readonly events: Events;
	/** SIMH's terminal poll interval, half a clock tick. */
	readonly tmxrPoll: number;
	/** Set by a boot loader that starts the machine. */
	PC: number;
	/** Claim a device code (0120, 0250, …) with its CONO/CONI/DATAO/DATAI routine and its reset. */
	attachDevice(devcode: number, io: DevIo, reset?: () => void): void;
	setInterrupt(dev: number, lvl: number): void;
	clrInterrupt(dev: number): void;
	/** Physical core, for data channels: undefined past the end. */
	readWord(addr: number): bigint | undefined;
	writeWord(addr: number, v: bigint): boolean;
	/** Console deposit: 0–17 are the accumulators. */
	deposit(addr: number, v: bigint): void;
	examine(addr: number): bigint;
}

/** A rung as the cabinet drives it. */
export interface Ka10Rung extends Ka10Bus {
	instructions: number;
	/** What the bus dance listens to, where a rung counts it (the halves rung does). */
	userInstructions?: number;
	readonly uuos?: Float64Array;
	readonly interrupts?: Float64Array;
	halted: boolean;
	readonly breakpoints: Set<number>;
	reset(): void;
	run(budget: number): Stop;
	step(n?: number): Stop;
	setHistory(n: number): void;
	showHistory(count?: number): string[];
	state(): Ka10State;
	setState(s: Ka10State): void;
	saveMemory(): Uint8Array;
	loadMemory(bytes: Uint8Array): void;
}
