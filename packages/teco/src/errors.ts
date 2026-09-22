export class UnimplementedCommandError extends Error {
	readonly code: number;
	readonly pc: number;

	constructor(code: number, pc: number) {
		const ch = code >= 32 && code < 127 ? String.fromCharCode(code) : `0x${code.toString(16)}`;
		super(`TECO command not implemented: ${ch} at pc ${pc}`);
		this.name = "UnimplementedCommandError";
		this.code = code;
		this.pc = pc;
	}
}

export class TecoHaltError extends Error {
	constructor(message = "TECO halt") {
		super(message);
		this.name = "TecoHaltError";
	}
}
