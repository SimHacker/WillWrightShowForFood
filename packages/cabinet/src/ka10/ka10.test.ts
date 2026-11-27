import { strict as assert } from "node:assert";
import { existsSync, openSync, readFileSync, readSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { CRY1, OVR } from "./defs.js";
import { type BlockStore, ItsMachine } from "./devices.js";
import { Ka10, nlzero } from "./ka10.js";

/** An instruction word: opcode, AC, indirect, index, address. */
const I = (op: number, ac: number, y: number, x = 0, ind = 0): bigint =>
	(BigInt(op) << 27n) | (BigInt(ac) << 23n) | (BigInt(ind) << 22n) | (BigInt(x) << 18n) | BigInt(y);
const HALT = I(0o254, 4, 0);

function runProgram(words: bigint[], data: Record<number, bigint> = {}, its = false): Ka10 {
	const cpu = new Ka10({ memWords: 64 * 1024, its, mpx: false });
	cpu.reset();
	words.forEach((w, i) => cpu.deposit(0o100 + i, w));
	for (const [a, v] of Object.entries(data)) cpu.deposit(Number(a), v);
	cpu.PC = 0o100;
	assert.equal(cpu.run(1_000_000), "halt");
	return cpu;
}

test("MOVEI and ADDI add into an accumulator", () => {
	const cpu = runProgram([I(0o201, 1, 5), I(0o271, 1, 7), HALT]);
	assert.equal(cpu.examine(1), 0o14n);
});

test("ADDI past the largest positive word sets overflow and carry 1", () => {
	const cpu = runProgram([I(0o205, 1, 0o377777), I(0o541, 1, 0o777777), I(0o271, 1, 1), HALT]);
	assert.equal(cpu.examine(1), 0o400000000000n);
	assert.ok(cpu.FLAGS & OVR);
	assert.ok(cpu.FLAGS & CRY1);
});

test("JFFO counts leading zeros and jumps", () => {
	const cpu = runProgram([I(0o201, 1, 1), I(0o243, 1, 0o103), HALT, I(0o201, 3, 0o777), HALT]);
	assert.equal(cpu.examine(2), 35n);
	assert.equal(cpu.examine(3), 0o777n);
	assert.equal(nlzero(0o400000000000n), 0);
	assert.equal(nlzero(0n), 36);
});

test("IMULI, IDIVI and MUL", () => {
	const cpu = runProgram([
		I(0o201, 1, 3),
		I(0o221, 1, 5), // IMULI 1,5
		I(0o201, 4, 0o17),
		I(0o231, 4, 4), // IDIVI 4,4: 15/4 is 3 remainder 3
		I(0o205, 6, 0o200000), // MOVSI 6,200000: 2^34
		I(0o225, 6, 0o10), // MULI 6,10: 2^37, so AC6 = 2^2 >> 1 high, AC7 low
		HALT,
	]);
	assert.equal(cpu.examine(1), 0o17n);
	assert.equal(cpu.examine(4), 3n);
	assert.equal(cpu.examine(5), 3n);
	assert.equal(cpu.examine(6), 0o4n);
	assert.equal(cpu.examine(7), 0n);
});

test("ILDB and IDPB walk a byte pointer", () => {
	// A pointer to 7-bit bytes at 200, before the first byte: P=36, S=7.
	const ptr = (0o44n << 30n) | (0o07n << 24n) | 0o200n;
	const cpu = runProgram(
		[I(0o134, 1, 0o300), I(0o134, 2, 0o300), I(0o201, 3, 0o132), I(0o136, 3, 0o301), HALT],
		{ 0o200: (0o101n << 29n) | (0o102n << 22n), 0o300: ptr, 0o301: ptr },
	);
	assert.equal(cpu.examine(1), 0o101n);
	assert.equal(cpu.examine(2), 0o102n);
	assert.equal(cpu.examine(0o300), (0o26n << 30n) | (0o07n << 24n) | 0o200n);
	assert.equal(cpu.examine(0o200) >> 29n, 0o132n);
});

test("FADR adds 1.0 and 1.0", () => {
	const cpu = runProgram([I(0o200, 1, 0o200), I(0o144, 1, 0o200), HALT], { 0o200: 0o201400000000n });
	assert.equal(cpu.examine(1), 0o202400000000n);
});

test("PUSHJ and POPJ through a stack", () => {
	const cpu = runProgram([I(0o201, 0o17, 0o277), I(0o260, 0o17, 0o110), HALT, 0n, 0n, 0n, 0n, 0n, I(0o201, 2, 0o42), I(0o263, 0o17, 0)], {});
	assert.equal(cpu.examine(2), 0o42n);
	assert.equal(cpu.examine(0o300), 0o102n);
	assert.equal(cpu.examine(0o17), 0o277n);
});

test("state and memory saved mid-program resume in a fresh CPU", () => {
	// Sum 1..100 into AC1, counting AC2 down with SOJG.
	const prog = [I(0o201, 2, 100), I(0o270, 1, 0, 0), I(0o271, 1, 0, 2), I(0o367, 2, 0o102), HALT];
	const a = new Ka10({ memWords: 64 * 1024, its: true });
	a.reset();
	prog.forEach((w, i) => a.deposit(0o100 + i, w));
	a.PC = 0o100;
	a.step(57);
	const b = new Ka10({ memWords: 64 * 1024, its: true });
	b.reset();
	b.setState(JSON.parse(JSON.stringify(a.state())));
	b.loadMemory(a.saveMemory());
	assert.equal(a.run(100_000), "halt");
	assert.equal(b.run(100_000), "halt");
	assert.equal(a.examine(1), 5050n);
	assert.deepEqual(b.state(), a.state());
});

const dir = process.env.KA10_ITS ?? join(homedir(), "GroundUp/git/its/dl/pdp10-ka");

class ReadOnlyPack implements BlockStore {
	private readonly fd: number;
	private readonly dirty = new Map<number, BigUint64Array>();
	private readonly bytes = Buffer.alloc(1024);
	constructor(path: string) {
		this.fd = openSync(path, "r");
	}
	read(block: number, into: BigUint64Array): void {
		const kept = this.dirty.get(block);
		if (kept) return void into.set(kept);
		this.bytes.fill(0);
		readSync(this.fd, this.bytes, 0, 1024, block * 1024);
		for (let i = 0; i < 128; i++) into[i] = this.bytes.readBigUInt64LE(i * 8);
	}
	write(block: number, from: BigUint64Array): void {
		this.dirty.set(block, BigUint64Array.from(from));
	}
}

test("ITS boots from the PDP-10/its packs to IN OPERATION", { skip: !existsSync(join(dir, "rp03.0")) && "no ITS packs" }, () => {
	const m = new ItsMachine({ now: () => new Date(2026, 10, 26, 12, 0, 0) });
	["rp03.2", "rp03.3", "rp03.0", "rp03.1"].forEach((f, i) => m.dp.attach(i, new ReadOnlyPack(join(dir, f))));
	m.pt.attach(new Uint8Array(readFileSync(join(dir, "dskdmp.rim"))));
	m.bootPtr();
	const until = (text: string, from: number, seconds: number): void => {
		const end = m.cpu.events.now + seconds * 1_000_000;
		while (m.output.indexOf(text, from) < 0 && m.cpu.events.now < end) assert.notEqual(m.cpu.run(10_000), "halt");
		assert.ok(m.output.includes(text), `waited for ${text}, got ${m.output}`);
	};
	until("DSKDMP", 0, 20);
	let mark = m.output.length;
	m.cty.type("its\r");
	until("\n", mark, 5);
	mark = m.output.length;
	m.cty.type("\x1bg");
	until("IN OPERATION", mark, 90);
	assert.match(m.output, /KA ITS 1652/);
});
