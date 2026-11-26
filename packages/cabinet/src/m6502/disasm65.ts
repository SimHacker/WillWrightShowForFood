/**
 * The 6502 disassembler: an opcode and its operand bytes as the assembler would write them,
 * `LDA $C000`, `STA ($28),Y`, `BNE $FD0E`, with an address named when `symbolic` knows it.
 * NMOS opcodes, the undocumented ones included under their usual names; `undocumented` says
 * which. The length of every opcode is checked against the Korz sea's (disasm65.test.ts).
 */

export type Mode65 = "imp" | "acc" | "imm" | "zp" | "zpx" | "zpy" | "izx" | "izy" | "abs" | "abx" | "aby" | "ind" | "rel";

const SIZE: Record<Mode65, number> = { imp: 1, acc: 1, imm: 2, zp: 2, zpx: 2, zpy: 2, izx: 2, izy: 2, rel: 2, abs: 3, abx: 3, aby: 3, ind: 3 };

// One row per high nibble, as the datasheet draws the matrix.
const MATRIX = `
BRK imp|ORA izx|JAM imp|SLO izx|NOP zp|ORA zp|ASL zp|SLO zp|PHP imp|ORA imm|ASL acc|ANC imm|NOP abs|ORA abs|ASL abs|SLO abs
BPL rel|ORA izy|JAM imp|SLO izy|NOP zpx|ORA zpx|ASL zpx|SLO zpx|CLC imp|ORA aby|NOP imp|SLO aby|NOP abx|ORA abx|ASL abx|SLO abx
JSR abs|AND izx|JAM imp|RLA izx|BIT zp|AND zp|ROL zp|RLA zp|PLP imp|AND imm|ROL acc|ANC imm|BIT abs|AND abs|ROL abs|RLA abs
BMI rel|AND izy|JAM imp|RLA izy|NOP zpx|AND zpx|ROL zpx|RLA zpx|SEC imp|AND aby|NOP imp|RLA aby|NOP abx|AND abx|ROL abx|RLA abx
RTI imp|EOR izx|JAM imp|SRE izx|NOP zp|EOR zp|LSR zp|SRE zp|PHA imp|EOR imm|LSR acc|ALR imm|JMP abs|EOR abs|LSR abs|SRE abs
BVC rel|EOR izy|JAM imp|SRE izy|NOP zpx|EOR zpx|LSR zpx|SRE zpx|CLI imp|EOR aby|NOP imp|SRE aby|NOP abx|EOR abx|LSR abx|SRE abx
RTS imp|ADC izx|JAM imp|RRA izx|NOP zp|ADC zp|ROR zp|RRA zp|PLA imp|ADC imm|ROR acc|ARR imm|JMP ind|ADC abs|ROR abs|RRA abs
BVS rel|ADC izy|JAM imp|RRA izy|NOP zpx|ADC zpx|ROR zpx|RRA zpx|SEI imp|ADC aby|NOP imp|RRA aby|NOP abx|ADC abx|ROR abx|RRA abx
NOP imm|STA izx|NOP imm|SAX izx|STY zp|STA zp|STX zp|SAX zp|DEY imp|NOP imm|TXA imp|ANE imm|STY abs|STA abs|STX abs|SAX abs
BCC rel|STA izy|JAM imp|SHA izy|STY zpx|STA zpx|STX zpy|SAX zpy|TYA imp|STA aby|TXS imp|TAS aby|SHY abx|STA abx|SHX aby|SHA aby
LDY imm|LDA izx|LDX imm|LAX izx|LDY zp|LDA zp|LDX zp|LAX zp|TAY imp|LDA imm|TAX imp|LXA imm|LDY abs|LDA abs|LDX abs|LAX abs
BCS rel|LDA izy|JAM imp|LAX izy|LDY zpx|LDA zpx|LDX zpy|LAX zpy|CLV imp|LDA aby|TSX imp|LAS aby|LDY abx|LDA abx|LDX aby|LAX aby
CPY imm|CMP izx|NOP imm|DCP izx|CPY zp|CMP zp|DEC zp|DCP zp|INY imp|CMP imm|DEX imp|SBX imm|CPY abs|CMP abs|DEC abs|DCP abs
BNE rel|CMP izy|JAM imp|DCP izy|NOP zpx|CMP zpx|DEC zpx|DCP zpx|CLD imp|CMP aby|NOP imp|DCP aby|NOP abx|CMP abx|DEC abx|DCP abx
CPX imm|SBC izx|NOP imm|ISC izx|CPX zp|SBC zp|INC zp|ISC zp|INX imp|SBC imm|NOP imp|SBC imm|CPX abs|SBC abs|INC abs|ISC abs
BEQ rel|SBC izy|JAM imp|ISC izy|NOP zpx|SBC zpx|INC zpx|ISC zpx|SED imp|SBC aby|NOP imp|ISC aby|NOP abx|SBC abx|INC abx|ISC abx
`;

/** The NMOS opcodes MOS documented; the rest of the 256 are `undocumented`. */
const DOCUMENTED = new Set(
	`00 01 05 06 08 09 0A 0D 0E 10 11 15 16 18 19 1D 1E 20 21 24 25 26 28 29 2A 2C 2D 2E 30 31 35 36 38 39 3D 3E
	40 41 45 46 48 49 4A 4C 4D 4E 50 51 55 56 58 59 5D 5E 60 61 65 66 68 69 6A 6C 6D 6E 70 71 75 76 78 79 7D 7E
	81 84 85 86 88 8A 8C 8D 8E 90 91 94 95 96 98 99 9A 9D A0 A1 A2 A4 A5 A6 A8 A9 AA AC AD AE B0 B1 B4 B5 B6 B8
	B9 BA BC BD BE C0 C1 C4 C5 C6 C8 C9 CA CC CD CE D0 D1 D5 D6 D8 D9 DD DE E0 E1 E4 E5 E6 E8 E9 EA EC ED EE F0
	F1 F5 F6 F8 F9 FD FE`
		.split(/\s+/)
		.map((h) => parseInt(h, 16)),
);

export type Op65 = { readonly mnemonic: string; readonly mode: Mode65; readonly bytes: number; readonly undocumented: boolean };

export const OPS65: readonly Op65[] = MATRIX.trim()
	.split("\n")
	.flatMap((row) => row.split("|"))
	.map((cell, op) => {
		const [mnemonic, mode] = cell.trim().split(" ") as [string, Mode65];
		return { mnemonic, mode, bytes: SIZE[mode], undocumented: !DOCUMENTED.has(op) };
	});

export type Line65 = {
	readonly at: number;
	/** The opcode and its operands, as many as the opcode takes. */
	readonly bytes: readonly number[];
	readonly op: Op65;
	/** `LDA $C000`, or `LDA KBD` when `symbolic` names it. */
	readonly text: string;
	/** The address the instruction names, a branch's destination included; null for none. */
	readonly target: number | null;
};

export const hex2 = (n: number) => (n & 0xff).toString(16).toUpperCase().padStart(2, "0");
export const hex4 = (n: number) => (n & 0xffff).toString(16).toUpperCase().padStart(4, "0");

/** The instruction at `at`. `peek` reads a byte with no side effects; `symbolic` names an address or returns "". */
export function disassemble65(peek: (addr: number) => number, at: number, symbolic: (addr: number) => string = () => ""): Line65 {
	at &= 0xffff;
	const code = peek(at) & 0xff;
	const op = OPS65[code]!;
	const bytes = [code];
	for (let i = 1; i < op.bytes; i++) bytes.push(peek((at + i) & 0xffff) & 0xff);
	const lo = bytes[1] ?? 0;
	const word = lo | ((bytes[2] ?? 0) << 8);
	const name = (addr: number, wide: boolean) => symbolic(addr) || `$${wide ? hex4(addr) : hex2(addr)}`;
	let operand = "";
	let target: number | null = null;
	switch (op.mode) {
		case "imp":
			break;
		case "acc":
			operand = "A";
			break;
		case "imm":
			operand = `#$${hex2(lo)}`;
			break;
		case "zp":
			operand = name((target = lo), false);
			break;
		case "zpx":
			operand = `${name((target = lo), false)},X`;
			break;
		case "zpy":
			operand = `${name((target = lo), false)},Y`;
			break;
		case "izx":
			operand = `(${name((target = lo), false)},X)`;
			break;
		case "izy":
			operand = `(${name((target = lo), false)}),Y`;
			break;
		case "abs":
			operand = name((target = word), true);
			break;
		case "abx":
			operand = `${name((target = word), true)},X`;
			break;
		case "aby":
			operand = `${name((target = word), true)},Y`;
			break;
		case "ind":
			operand = `(${name((target = word), true)})`;
			break;
		case "rel":
			operand = name((target = (at + 2 + ((lo << 24) >> 24)) & 0xffff), true);
			break;
	}
	return { at, bytes, op, text: operand ? `${op.mnemonic} ${operand}` : op.mnemonic, target };
}

/**
 * Where the instruction before `at` starts. Code has no marks between instructions, so this
 * walks forward from up to 32 bytes back and keeps the first walk that lands on `at` exactly;
 * walks from different starts fall into step within a few instructions.
 */
export function before65(peek: (addr: number) => number, at: number): number {
	at &= 0xffff;
	for (let back = 32; back >= 1; back--) {
		let pc = (at - back) & 0xffff;
		let last = -1;
		for (let walked = 0; walked < back; ) {
			const n = OPS65[peek(pc) & 0xff]!.bytes;
			last = pc;
			pc = (pc + n) & 0xffff;
			walked += n;
			if (walked === back) return last;
		}
	}
	return (at - 1) & 0xffff;
}
