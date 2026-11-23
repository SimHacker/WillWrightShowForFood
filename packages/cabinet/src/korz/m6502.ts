import { cpuInterrupt, cpuNext, cpuPoll, FLAGS, M6502, parts, type Bus, type M6502Flavor } from "../m6502/m6502.js";
import { Compiler65 } from "./compile65.js";
import { CpuHost, type Rung } from "./cpu.js";
import type { Dim, Dispatchers, GuardSpec, Sea, SlotSpec } from "./korz.js";

/**
 * The 6502 as a sea of slots. The switch in `m6502.ts` is the oracle. An opcode is three
 * coordinates, the fields the datasheet draws it by: `aaa` (bits 7-5), `bbb` (bits 4-2) and
 * `cc` (bits 1-0). `cc` picks a group; in a group, `aaa` is mostly the operation and `bbb` the
 * addressing mode.
 *
 * Two selectors. `exec` is the operation: a column of one group for a regular one ("LDA" is
 * `cc=alu aaa=5`, every mode), a row where the chip decodes by row (the branches, the flag
 * instructions), and an exact cell for each opcode the fields do not explain ("JMP (ind)",
 * "TXS", the undocumented ones). A cell is more specific than its column, so it wins with no
 * ordering. `mode` is the addressing cycles, by group and `bbb`, and returns the address; a
 * column calls it, with `c.store` set for stores and read-modify-write, which always pay the
 * indexed dummy read.
 *
 * Every body is the switch's own cycles and ALU (`parts`), so the two can only differ in which
 * pieces they pick. The test runs every opcode against the switch, bus cycle for bus cycle.
 *
 * `interpret` searches the sea. `resolve` is the table. `compile` is `compile65.ts`: a
 * straight-line block of hand-written templates. A block that starts on an opcode it does not
 * inline is one call to the switch, not to this sea; a dropped block's replacement step and a
 * cycle budget too short for a block (`one`) are the sea.
 *
 * The slot functions are shared by every machine. They reach theirs as `c.cpu`.
 */

export type K65 = { cpu: Korz6502; op: number; cc: number; aaa: number; bbb: number; store: boolean };

export type Korz6502Opts = { korz?: Rung | undefined; flavor?: M6502Flavor | undefined };

type Sel65 = "exec" | "mode";

/** A slot, and what a browser needs to name an opcode after it. */
export type Spec65 = SlotSpec<K65> & {
	/** The column calls `mode`; the opcode's name is this slot's and the mode's. */
	readonly moded?: boolean;
	/** One name per `aaa`, for a row: the branches, the flags. */
	readonly names?: readonly string[];
	/** Instruction bytes, opcode included, when the slot does not take them from `mode`. */
	readonly bytes?: number;
	/** Undocumented on the NMOS part. */
	readonly undocumented?: boolean;
};

const { C, Z, I, V, D, N } = FLAGS;
const {
	read, write, next, implied, setNZ, zp, zpXY, absolute, absoluteXY, indirectX, indirectY, indirect,
	adc, sbc, cmp, bit, asl, lsr, rol, ror, ora, and, eor, lda, ldx, ldy, lax,
	aslMem, lsrMem, rolMem, rorMem, incMem, decMem, slo, rla, sre, rra, dcp, isc, unstableStore,
	branch, brk, jsr, rts, rti, php, plp, pha, pla, jam, nop, flag, anc, alr, arr, sbx, ane, lxa, las,
} = parts;

export const GROUPS = ["control", "alu", "rmw", "combined"] as const;

export const DIMS: readonly Dim[] = [
	{ name: "cc", width: 2, names: GROUPS },
	{ name: "aaa", width: 3 },
	{ name: "bbb", width: 3 },
];

const ALL = [0, 1, 2, 3, 4, 5, 6, 7];

/** The operand, through `mode`. */
function load(c: K65): number {
	c.store = false;
	return read(c.cpu, c.cpu.go.mode(c));
}

/** The address, through `mode`, with the dummy read a store or read-modify-write always pays. */
function target(c: K65): number {
	c.store = true;
	return c.cpu.go.mode(c);
}

const exec = (by: string, guard: GuardSpec, doc: string, run: (c: K65) => void, more: Omit<Spec65, "selector" | "by" | "guard" | "doc" | "run"> = {}): Spec65 => ({
	selector: "exec",
	by,
	guard,
	doc,
	run,
	...more,
});

const column = (by: string, cc: number, aaa: number, bbb: readonly number[], doc: string, run: (c: K65) => void, undocumented = false): Spec65 =>
	exec(by, bbb.length === 8 ? { cc, aaa } : { cc, aaa, bbb }, doc, run, { moded: true, undocumented });

const cell = (by: string, cc: number, aaa: number, bbb: number, bytes: number, doc: string, run: (c: K65) => void, undocumented = false): Spec65 =>
	exec(by, { cc, aaa, bbb }, doc, run, { bytes, undocumented });

const ALU = 1;
const RMW = 2;
const CONTROL = 0;
const COMBINED = 3;

const BRANCH_FLAG = [N, V, C, Z];
const SET_FLAG = [C, I, V, D];

export const EXEC: readonly Spec65[] = [
	// cc=01, the accumulator group. Every column takes all eight modes.
	column("ORA", ALU, 0, ALL, "A |= operand. N, Z.", (c) => ora(c.cpu, load(c))),
	column("AND", ALU, 1, ALL, "A &= operand. N, Z.", (c) => and(c.cpu, load(c))),
	column("EOR", ALU, 2, ALL, "A ^= operand. N, Z.", (c) => eor(c.cpu, load(c))),
	column("ADC", ALU, 3, ALL, "A += operand + C, decimal when D is set (not on the NES). N, V, Z, C.", (c) => adc(c.cpu, load(c))),
	column("STA", ALU, 4, ALL, "operand = A. No flags.", (c) => write(c.cpu, target(c), c.cpu.a)),
	column("LDA", ALU, 5, ALL, "A = operand. N, Z.", (c) => lda(c.cpu, load(c))),
	column("CMP", ALU, 6, ALL, "A - operand, flags only. N, Z, C.", (c) => cmp(c.cpu, c.cpu.a, load(c))),
	column("SBC", ALU, 7, ALL, "A -= operand + !C, decimal when D is set. N, V, Z, C.", (c) => sbc(c.cpu, load(c))),
	cell("NOP #imm", ALU, 4, 2, 2, "STA has no immediate mode; $89 reads its operand and does nothing.", (c) => void next(c.cpu), true),

	// cc=10, shifts, X, increment and decrement.
	column("ASL", RMW, 0, [1, 3, 5, 7], "operand <<= 1, bit 7 to C. Reads, writes the old byte, writes the new. N, Z, C.", (c) => void aslMem(c.cpu, target(c))),
	column("ROL", RMW, 1, [1, 3, 5, 7], "operand rotated left through C. N, Z, C.", (c) => void rolMem(c.cpu, target(c))),
	column("LSR", RMW, 2, [1, 3, 5, 7], "operand >>= 1, bit 0 to C. N, Z, C.", (c) => void lsrMem(c.cpu, target(c))),
	column("ROR", RMW, 3, [1, 3, 5, 7], "operand rotated right through C. N, Z, C.", (c) => void rorMem(c.cpu, target(c))),
	column("STX", RMW, 4, [1, 3, 5], "operand = X. zp,X becomes zp,Y. No flags.", (c) => write(c.cpu, target(c), c.cpu.x)),
	column("LDX", RMW, 5, [0, 1, 3, 5, 7], "X = operand. zp,X and abs,X become zp,Y and abs,Y. N, Z.", (c) => ldx(c.cpu, load(c))),
	column("DEC", RMW, 6, [1, 3, 5, 7], "operand -= 1. N, Z.", (c) => void decMem(c.cpu, target(c))),
	column("INC", RMW, 7, [1, 3, 5, 7], "operand += 1. N, Z.", (c) => void incMem(c.cpu, target(c))),
	cell("ASL A", RMW, 0, 2, 1, "A <<= 1. N, Z, C.", (c) => {
		implied(c.cpu);
		c.cpu.a = asl(c.cpu, c.cpu.a);
	}),
	cell("ROL A", RMW, 1, 2, 1, "A rotated left through C. N, Z, C.", (c) => {
		implied(c.cpu);
		c.cpu.a = rol(c.cpu, c.cpu.a);
	}),
	cell("LSR A", RMW, 2, 2, 1, "A >>= 1. N, Z, C.", (c) => {
		implied(c.cpu);
		c.cpu.a = lsr(c.cpu, c.cpu.a);
	}),
	cell("ROR A", RMW, 3, 2, 1, "A rotated right through C. N, Z, C.", (c) => {
		implied(c.cpu);
		c.cpu.a = ror(c.cpu, c.cpu.a);
	}),
	cell("TXA", RMW, 4, 2, 1, "A = X. N, Z.", (c) => {
		implied(c.cpu);
		c.cpu.a = c.cpu.x;
		setNZ(c.cpu, c.cpu.a);
	}),
	cell("TAX", RMW, 5, 2, 1, "X = A. N, Z.", (c) => {
		implied(c.cpu);
		c.cpu.x = c.cpu.a;
		setNZ(c.cpu, c.cpu.x);
	}),
	cell("DEX", RMW, 6, 2, 1, "X -= 1. N, Z.", (c) => {
		implied(c.cpu);
		c.cpu.x = (c.cpu.x - 1) & 0xff;
		setNZ(c.cpu, c.cpu.x);
	}),
	cell("NOP", RMW, 7, 2, 1, "$EA, the documented NOP: one dummy read.", (c) => nop(c.cpu)),
	cell("TXS", RMW, 4, 6, 1, "S = X. No flags.", (c) => {
		implied(c.cpu);
		c.cpu.s = c.cpu.x;
	}),
	cell("TSX", RMW, 5, 6, 1, "X = S. N, Z.", (c) => {
		implied(c.cpu);
		c.cpu.x = c.cpu.s;
		setNZ(c.cpu, c.cpu.x);
	}),
	cell("SHX abs,Y", RMW, 4, 7, 3, "Stores X & (high byte of the address + 1); on a page cross that byte is also the high address.", (c) => {
		unstableStore(c.cpu, absoluteXY(c.cpu, c.cpu.y, true), c.cpu.x);
	}, true),
	exec("JAM", { cc: RMW, aaa: [0, 1, 2, 3], bbb: 0 }, "The chip stops: two reads, PC left on the opcode, until reset.", (c) => jam(c.cpu), { bytes: 1, undocumented: true }),
	exec("JAM", { cc: RMW, bbb: 4 }, "The chip stops: two reads, PC left on the opcode, until reset.", (c) => jam(c.cpu), { bytes: 1, undocumented: true }),
	exec("NOP #imm", { cc: RMW, aaa: [4, 6, 7], bbb: 0 }, "Reads its operand and does nothing.", (c) => void next(c.cpu), { bytes: 2, undocumented: true }),
	exec("NOP", { cc: RMW, aaa: [0, 1, 2, 3, 6, 7], bbb: 6 }, "One dummy read, like $EA.", (c) => nop(c.cpu), { bytes: 1, undocumented: true }),

	// cc=00, control. The columns here take only some modes; the rest of the group is rows and cells.
	exec("NOP", { cc: CONTROL }, "Undocumented where nothing else in the group answers: reads what its mode addresses.", (c) => void load(c), { moded: true, undocumented: true }),
	exec("branch", { cc: CONTROL, bbb: 4 }, "aaa>>1 picks N, V, C or Z; aaa&1 is the value that branches. 2 cycles, 3 taken, 4 taken across a page.", (c) => {
		const f = BRANCH_FLAG[c.aaa >>> 1]!;
		branch(c.cpu, ((c.cpu.p & f) !== 0) === ((c.aaa & 1) === 1));
	}, { bytes: 2, names: ["BPL", "BMI", "BVC", "BVS", "BCC", "BCS", "BNE", "BEQ"] }),
	exec("flags", { cc: CONTROL, bbb: 6 }, "aaa>>1 picks C, I, V or D; aaa&1 sets it or clears it.", (c) => {
		const f = SET_FLAG[c.aaa >>> 1]!;
		if (c.aaa & 1) flag(c.cpu, f, 0);
		else flag(c.cpu, 0, f);
	}, { bytes: 1, names: ["CLC", "SEC", "CLI", "SEI", "TYA", "CLV", "CLD", "SED"] }),
	cell("TYA", CONTROL, 4, 6, 1, "A = Y. N, Z. Where SEV would be, if there were one.", (c) => {
		implied(c.cpu);
		c.cpu.a = c.cpu.y;
		setNZ(c.cpu, c.cpu.a);
	}),
	cell("CLV", CONTROL, 5, 6, 1, "Clears V. The flags row's odd one out: aaa&1 is set, and it clears.", (c) => flag(c.cpu, 0, V)),
	cell("BRK", CONTROL, 0, 0, 1, "Pushes PC+2 and P with B set, sets I, jumps through $FFFE. The byte after BRK is skipped.", (c) => brk(c.cpu)),
	cell("JSR abs", CONTROL, 1, 0, 3, "Pushes the address of its own last byte, then jumps.", (c) => jsr(c.cpu)),
	cell("RTI", CONTROL, 2, 0, 1, "Pulls P, then PC.", (c) => rti(c.cpu)),
	cell("RTS", CONTROL, 3, 0, 1, "Pulls PC and adds one.", (c) => rts(c.cpu)),
	cell("PHP", CONTROL, 0, 2, 1, "Pushes P with B set.", (c) => php(c.cpu)),
	cell("PLP", CONTROL, 1, 2, 1, "Pulls P; B is dropped, bit 5 forced on.", (c) => plp(c.cpu)),
	cell("PHA", CONTROL, 2, 2, 1, "Pushes A.", (c) => pha(c.cpu)),
	cell("PLA", CONTROL, 3, 2, 1, "Pulls A. N, Z.", (c) => pla(c.cpu)),
	cell("DEY", CONTROL, 4, 2, 1, "Y -= 1. N, Z.", (c) => {
		implied(c.cpu);
		c.cpu.y = (c.cpu.y - 1) & 0xff;
		setNZ(c.cpu, c.cpu.y);
	}),
	cell("TAY", CONTROL, 5, 2, 1, "Y = A. N, Z.", (c) => {
		implied(c.cpu);
		c.cpu.y = c.cpu.a;
		setNZ(c.cpu, c.cpu.y);
	}),
	cell("INY", CONTROL, 6, 2, 1, "Y += 1. N, Z.", (c) => {
		implied(c.cpu);
		c.cpu.y = (c.cpu.y + 1) & 0xff;
		setNZ(c.cpu, c.cpu.y);
	}),
	cell("INX", CONTROL, 7, 2, 1, "X += 1. N, Z.", (c) => {
		implied(c.cpu);
		c.cpu.x = (c.cpu.x + 1) & 0xff;
		setNZ(c.cpu, c.cpu.x);
	}),
	column("BIT", CONTROL, 1, [1, 3], "A & operand sets Z; the operand's bits 7 and 6 become N and V.", (c) => bit(c.cpu, load(c))),
	cell("JMP abs", CONTROL, 2, 3, 3, "PC = the operand address.", (c) => {
		c.cpu.pc = absolute(c.cpu);
	}),
	cell("JMP (ind)", CONTROL, 3, 3, 3, "PC = the word at the operand. A pointer at $xxFF takes its high byte from $xx00.", (c) => {
		c.cpu.pc = indirect(c.cpu);
	}),
	column("STY", CONTROL, 4, [1, 3, 5], "operand = Y. No flags.", (c) => write(c.cpu, target(c), c.cpu.y)),
	cell("SHY abs,X", CONTROL, 4, 7, 3, "Stores Y & (high byte of the address + 1); on a page cross that byte is also the high address.", (c) => {
		unstableStore(c.cpu, absoluteXY(c.cpu, c.cpu.x, true), c.cpu.y);
	}, true),
	column("LDY", CONTROL, 5, [0, 1, 3, 5, 7], "Y = operand. N, Z.", (c) => ldy(c.cpu, load(c))),
	column("CPY", CONTROL, 6, [0, 1, 3], "Y - operand, flags only. N, Z, C.", (c) => cmp(c.cpu, c.cpu.y, load(c))),
	column("CPX", CONTROL, 7, [0, 1, 3], "X - operand, flags only. N, Z, C.", (c) => cmp(c.cpu, c.cpu.x, load(c))),

	// cc=11, undocumented: the group 1 and group 2 operations of the same aaa at once, in group 1's modes.
	column("SLO", COMBINED, 0, ALL, "ASL the operand, then ORA it.", (c) => slo(c.cpu, target(c)), true),
	column("RLA", COMBINED, 1, ALL, "ROL the operand, then AND it.", (c) => rla(c.cpu, target(c)), true),
	column("SRE", COMBINED, 2, ALL, "LSR the operand, then EOR it.", (c) => sre(c.cpu, target(c)), true),
	column("RRA", COMBINED, 3, ALL, "ROR the operand, then ADC it.", (c) => rra(c.cpu, target(c)), true),
	column("SAX", COMBINED, 4, ALL, "operand = A & X. zp,X becomes zp,Y.", (c) => write(c.cpu, target(c), c.cpu.a & c.cpu.x), true),
	column("LAX", COMBINED, 5, ALL, "A = X = operand. zp,X and abs,X become zp,Y and abs,Y.", (c) => lax(c.cpu, load(c)), true),
	column("DCP", COMBINED, 6, ALL, "DEC the operand, then CMP it.", (c) => dcp(c.cpu, target(c)), true),
	column("ISC", COMBINED, 7, ALL, "INC the operand, then SBC it.", (c) => isc(c.cpu, target(c)), true),
	cell("ANC #imm", COMBINED, 0, 2, 2, "AND, then C = bit 7.", (c) => anc(c.cpu), true),
	cell("ANC #imm", COMBINED, 1, 2, 2, "AND, then C = bit 7. The same as $0B.", (c) => anc(c.cpu), true),
	cell("ALR #imm", COMBINED, 2, 2, 2, "AND, then LSR A.", (c) => alr(c.cpu), true),
	cell("ARR #imm", COMBINED, 3, 2, 2, "AND, then ROR A, with C and V from bits 6 and 5.", (c) => arr(c.cpu), true),
	cell("ANE #imm", COMBINED, 4, 2, 2, "A = (A | $EE) & X & operand. The $EE is the unstable constant SingleStepTests models.", (c) => ane(c.cpu), true),
	cell("SHA (zp),Y", COMBINED, 4, 4, 2, "Stores A & X & (high byte + 1).", (c) => {
		unstableStore(c.cpu, indirectY(c.cpu, true), c.cpu.a & c.cpu.x);
	}, true),
	cell("TAS abs,Y", COMBINED, 4, 6, 3, "S = A & X, then stores S & (high byte + 1).", (c) => {
		c.cpu.s = c.cpu.a & c.cpu.x;
		unstableStore(c.cpu, absoluteXY(c.cpu, c.cpu.y, true), c.cpu.s);
	}, true),
	cell("SHA abs,Y", COMBINED, 4, 7, 3, "Stores A & X & (high byte + 1).", (c) => {
		unstableStore(c.cpu, absoluteXY(c.cpu, c.cpu.y, true), c.cpu.a & c.cpu.x);
	}, true),
	cell("LXA #imm", COMBINED, 5, 2, 2, "A = X = (A | $EE) & operand.", (c) => lxa(c.cpu), true),
	cell("LAS abs,Y", COMBINED, 5, 6, 3, "A = X = S = operand & S.", (c) => las(c.cpu), true),
	cell("SBX #imm", COMBINED, 6, 2, 2, "X = (A & X) - operand, without borrow. N, Z, C.", (c) => sbx(c.cpu), true),
	cell("USBC #imm", COMBINED, 7, 2, 2, "SBC #imm under another opcode.", (c) => sbc(c.cpu, next(c.cpu)), true),
];

const mode = (by: string, guard: GuardSpec, bytes: number, doc: string, run: (c: K65) => number): Spec65 => ({ selector: "mode", by, guard, doc, run, bytes });
const ODD = [ALU, COMBINED];
const EVEN = [CONTROL, RMW];

export const MODE: readonly Spec65[] = [
	mode("none", {}, 0, "A column asked for a mode its group does not have. The sea's own bug; the test would fail.", (c) => {
		throw new Error(`6502 sea: no addressing mode for $${c.op.toString(16)}`);
	}),
	mode("#imm", { cc: ODD, bbb: 2 }, 2, "The operand is the next byte.", (c) => imm(c.cpu)),
	mode("#imm", { cc: EVEN, bbb: 0 }, 2, "The operand is the next byte.", (c) => imm(c.cpu)),
	mode("zp", { bbb: 1 }, 2, "A zero-page address.", (c) => zp(c.cpu)),
	mode("abs", { bbb: 3 }, 3, "A 16-bit address, low byte first.", (c) => absolute(c.cpu)),
	mode("(zp,X)", { cc: ODD, bbb: 0 }, 2, "A dummy read of the zero-page byte, then the pointer at zp+X, wrapping in page zero.", (c) => indirectX(c.cpu)),
	mode("(zp),Y", { cc: ODD, bbb: 4 }, 2, "The pointer at zp, plus Y. The dummy read of the unfixed address on a page cross, or always for a store.", (c) => indirectY(c.cpu, c.store)),
	mode("zp,X", { bbb: 5 }, 2, "A dummy read of zp, then zp+X, wrapping in page zero.", (c) => zpXY(c.cpu, c.cpu.x)),
	mode("zp,Y", { cc: [RMW, COMBINED], aaa: [4, 5], bbb: 5 }, 2, "zp+Y, for the X-register columns, which cannot index by X.", (c) => zpXY(c.cpu, c.cpu.y)),
	mode("abs,Y", { cc: ODD, bbb: 6 }, 3, "abs+Y. The dummy read of the unfixed address on a page cross, or always for a store.", (c) => absoluteXY(c.cpu, c.cpu.y, c.store)),
	mode("abs,X", { bbb: 7 }, 3, "abs+X. The dummy read of the unfixed address on a page cross, or always for a store.", (c) => absoluteXY(c.cpu, c.cpu.x, c.store)),
	mode("abs,Y", { cc: [RMW, COMBINED], aaa: [4, 5], bbb: 7 }, 3, "abs+Y, for the X-register columns.", (c) => absoluteXY(c.cpu, c.cpu.y, c.store)),
];

/** `next`'s cycle, returning the address it read instead of the byte; the column reads it. */
function imm(cpu: M6502): number {
	const pc = cpu.pc;
	cpu.pc = (pc + 1) & 0xffff;
	cpu.lastByte = pc;
	return pc;
}

export const SLOTS: readonly Spec65[] = [...EXEC, ...MODE];

const k65 = (cpu: Korz6502): K65 => ({ cpu, op: 0, cc: 0, aaa: 0, bbb: 0, store: false });

/** An opcode as the sea's coordinates. */
export function fields(op: number): { cc: number; aaa: number; bbb: number } {
	return { cc: op & 3, aaa: op >>> 5, bbb: (op >>> 2) & 7 };
}

export type Opcode65 = {
	readonly op: number;
	/** "LDA zp,X", "BNE", "JMP (ind)". */
	readonly name: string;
	/** The `exec` slot that runs first, and the `mode` slot when it calls one. */
	readonly exec: string;
	readonly mode: string | null;
	readonly bytes: number;
	readonly undocumented: boolean;
	readonly doc: string;
	readonly modeDoc: string | null;
};

const specOf = (list: readonly Spec65[], by: string, doc: string | undefined): Spec65 | undefined => list.find((s) => s.by === by && s.doc === doc);

/** What the sea answers for an opcode, named after the slots that answer. Patches included. */
export function opcode65(sea: Sea<K65>, op: number): Opcode65 {
	const c = { ...fields(op), op, store: false } as K65;
	const top = sea.chain("exec", c)[0];
	if (top === undefined) throw new Error(`6502 sea: no exec slot for $${op.toString(16)}`);
	const spec = specOf(EXEC, top.by, top.doc);
	const m = spec?.moded ? sea.chain("mode", c)[0] : undefined;
	const mspec = m ? specOf(MODE, m.by, m.doc) : undefined;
	const name = spec?.names ? spec.names[c.aaa]! : m ? `${top.by} ${m.by}` : top.by;
	return {
		op,
		name,
		exec: top.by,
		mode: m?.by ?? null,
		bytes: (mspec ? mspec.bytes : spec?.bytes) ?? 1,
		undocumented: spec?.undocumented ?? false,
		doc: top.doc ?? "",
		modeDoc: m?.doc ?? null,
	};
}

export class Korz6502 extends M6502 {
	readonly host: CpuHost<K65, Sel65, "ix">;
	readonly sea: Sea<K65>;
	private readonly ix: K65;
	/** Public because `exec` slots call `mode` through their machine. */
	readonly go: Dispatchers<K65, Sel65>;
	/** With `korz: "compile"`. */
	compiler: Compiler65 | null = null;
	/** How many switch steps the last `step` matched. A compiled block may be more than one. */
	lastRun = 0;

	constructor(bus: Bus, opts: Korz6502Opts = {}) {
		super(bus, opts.flavor ?? "nmos");
		const host = new CpuHost<K65, Sel65, "ix">({
			dims: DIMS,
			selectors: ["exec", "mode"],
			slots: SLOTS,
			context: () => k65(this),
			nests: ["ix"],
			rung: opts.korz ?? "resolve",
		});
		this.host = host;
		this.sea = host.sea;
		this.ix = host.nest.ix;
		this.go = host.go;
		if (opts.korz === "compile") this.compiler = new Compiler65(this);
	}

	override reset(): void {
		this.compiler?.flush();
		super.reset();
	}

	/** One instruction through the sea, or the interrupt the poll wins. */
	one(): void {
		const vector = cpuPoll(this);
		if (vector >= 0) {
			cpuInterrupt(this, vector);
			this.lastRun = 1;
			return;
		}
		const ix = this.ix;
		const op = cpuNext(this);
		ix.op = op;
		ix.cc = op & 3;
		ix.aaa = op >>> 5;
		ix.bbb = (op >>> 2) & 7;
		this.go.exec(ix);
		this.lastRun = 1;
	}

	override step(): void {
		if (this.compiler) {
			this.lastRun = this.compiler.step();
			return;
		}
		this.one();
	}
}
