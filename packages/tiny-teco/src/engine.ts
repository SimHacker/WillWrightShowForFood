import { EditBuffer } from "./buffer.js";
import { UnimplementedCommandError, TecoHaltError } from "./errors.js";
import { QRegisterBank, type QName } from "./qregs.js";

export const ESC = 0x1b;
export const CTRL_CARET = 0x1e; // ITS ^^ as one byte in the Ancell dump
export const EVACUATED_CR = 0xee;

export type CommandResult = "ok" | "exit-iter" | "halt";

export interface Command {
	readonly name: string;
	/** First bytes that dispatch here (after digits / ^^ are consumed). */
	readonly codes: readonly number[];
	execute(ctx: TinyTeco): CommandResult;
}

export class CommandTable {
	private readonly byCode = new Map<number, Command>();

	register(command: Command): this {
		for (const code of command.codes) this.byCode.set(code, command);
		return this;
	}

	get(code: number): Command | undefined {
		return this.byCode.get(code);
	}

	has(code: number): boolean {
		return this.byCode.has(code);
	}
}

interface Iteration {
	start: number;
	remaining: number | null;
}

export class TinyTeco {
	readonly buffer = new EditBuffer();
	readonly qregs = new QRegisterBank();
	readonly table: CommandTable;
	program: Uint8Array = new Uint8Array(0);
	pc = 0;
	output: string[] = [];
	lastSearchOk = true;
	/** Last numeric result, for `;` and `"E`. */
	lastValue = 0;
	private arg: number | null = null;
	private op: "+" | "-" | null = null;
	private neg = false;
	private readonly stack: Iteration[] = [];
	halted = false;

	constructor(table: CommandTable) {
		this.table = table;
	}

	load(bytes: Uint8Array | string): void {
		this.program = typeof bytes === "string" ? new TextEncoder().encode(bytes) : new Uint8Array(bytes);
		this.pc = 0;
		this.halted = false;
		this.arg = null;
		this.op = null;
		this.neg = false;
		this.stack.length = 0;
		this.output = [];
	}

	peek(): number | undefined {
		return this.program[this.pc];
	}

	take(): number {
		const b = this.program[this.pc];
		if (b === undefined) throw new TecoHaltError("unexpected end of program");
		this.pc += 1;
		return b;
	}

	/** Text until ESC, not including the ESC. */
	takeString(): string {
		const start = this.pc;
		while (this.pc < this.program.length && this.program[this.pc] !== ESC) this.pc += 1;
		const slice = this.program.subarray(start, this.pc);
		if (this.program[this.pc] === ESC) this.pc += 1;
		return new TextDecoder("latin1").decode(slice);
	}

	takeQName(): QName {
		const b = this.take();
		if (b === ESC || b === 0x1d) {
			const raw = String.fromCharCode(this.take());
			const nameReg = /[A-Za-z]/.test(raw) ? raw.toLowerCase() : raw;
			const text = this.qregs.get(nameReg).text;
			if (text.length === 0) throw new TecoHaltError(`empty Q-register name in ${nameReg}`);
			return text[0] ?? nameReg;
		}
		const ch = String.fromCharCode(b);
		return /[A-Za-z]/.test(ch) ? ch.toLowerCase() : ch;
	}

	pushArg(n: number): void {
		const signed = this.neg ? -n : n;
		this.neg = false;
		if (this.op === "+") this.arg = (this.arg ?? 0) + signed;
		else if (this.op === "-") this.arg = (this.arg ?? 0) - signed;
		else this.arg = signed;
		this.op = null;
		this.lastValue = this.arg;
	}

	/** Consume the pending numeric argument; default if none. Lone `-` is -1. */
	takeArg(defaultValue: number): number {
		let n: number;
		if (this.neg && this.arg === null) n = -1;
		else if (this.neg && this.arg !== null) n = -Math.abs(this.arg);
		else n = this.arg ?? defaultValue;
		this.arg = null;
		this.op = null;
		this.neg = false;
		this.lastValue = n;
		return n;
	}

	hasArg(): boolean {
		return this.arg !== null;
	}

	clearArg(): void {
		this.arg = null;
		this.op = null;
		this.neg = false;
	}

	beginIter(count: number | null): void {
		this.stack.push({ start: this.pc, remaining: count });
	}

	endIter(): void {
		const frame = this.stack[this.stack.length - 1];
		if (!frame) return;
		if (frame.remaining === null) {
			this.pc = frame.start;
			return;
		}
		frame.remaining -= 1;
		if (frame.remaining > 0) this.pc = frame.start;
		else this.stack.pop();
	}

	exitIter(): void {
		this.stack.pop();
		let depth = 0;
		while (this.pc < this.program.length) {
			const b = this.take();
			if (b === 0x3c) depth += 1; // <
			else if (b === 0x3e) {
				if (depth === 0) return;
				depth -= 1;
			}
		}
	}

	write(s: string): void {
		this.output.push(s);
	}

	step(): CommandResult {
		if (this.halted) return "halt";
		if (this.pc >= this.program.length) return "halt";
		const b = this.take();
		if (isIgnorable(b)) return "ok";
		if (b >= 0x30 && b <= 0x39) {
			this.accumulateDigit(b - 0x30);
			return "ok";
		}
		if (b === CTRL_CARET) {
			this.pushArg(this.take());
			return "ok";
		}
		if (b === 0x2b) {
			this.op = "+";
			return "ok";
		}
		if (b === 0x2d) {
			if (this.arg !== null && this.op === null) this.op = "-";
			else this.neg = true;
			return "ok";
		}
		const cmd = this.table.get(b);
		if (!cmd) throw new UnimplementedCommandError(b, this.pc - 1);
		const result = cmd.execute(this);
		if (result === "halt") this.halted = true;
		return result;
	}

	private accumulateDigit(d: number): void {
		if (this.op !== null) {
			this.pushArg(d);
			return;
		}
		this.arg = (this.arg ?? 0) * 10 + d;
		this.lastValue = this.neg && this.arg !== null ? -this.arg : this.arg;
	}

	run(limit = 1_000_000): void {
		for (let i = 0; i < limit; i += 1) {
			const r = this.step();
			if (r === "halt" || this.pc >= this.program.length) return;
		}
		throw new TecoHaltError(`step limit ${limit}`);
	}
}

export function isIgnorable(b: number): boolean {
	return b === 0x09 || b === 0x0a || b === 0x0d || b === 0x20 || b === EVACUATED_CR;
}
