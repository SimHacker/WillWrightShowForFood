import { strict as assert } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { printListing } from "../asm/listing.js";
import { assemble10 } from "./asm10.js";
import { ascii10, disassemble10, explain10, halves10, sixbit10 } from "./disasm10.js";
import { ItsMachine } from "./its.js";

const I = (op: number, ac: number, y: number, x = 0, ind = 0): bigint =>
	(BigInt(op) << 27n) | (BigInt(ac) << 23n) | (BigInt(ind) << 22n) | (BigInt(x) << 18n) | BigInt(y);
const text = (w: bigint, its = false) => disassemble10(w, () => "", { its }).text;

test("disasm10: instructions as MIDAS writes them", () => {
	assert.equal(text(I(0o254, 4, 0)), "HALT");
	assert.equal(text(I(0o254, 4, 0o1000)), "HALT 1000");
	assert.equal(text(I(0o200, 1, 0o100, 2, 1)), "MOVE 1,@100(2)");
	assert.equal(text(I(0o201, 0, 0o777777)), "MOVEI 777777");
	assert.equal(text(I(0o254, 0, 0o1000)), "JRST 1000");
	assert.equal(text(I(0o255, 0, 0)), "JFCL");
	assert.equal(text(I(0o255, 0o10, 0o200)), "JOV 200");
	assert.equal(text(I(0o145, 1, 0o201400)), "FADRI 1,201400");
	assert.equal(text(0o712140000200n), "DATAO TTY,200");
	assert.equal(text(0o700600002000n), "CONO PI,2000");
	assert.equal(text(0o712340000100n), "CONSO TTY,100");
	assert.equal(text(0o725140000000n), "DATAO 250,0");
	assert.equal(text(0o000003000004n), "3,,4");
	assert.equal(text(0o0n), "0");
	assert.equal(text(I(0o247, 1, 3)), "MUUO247 1,3");
	assert.equal(text(I(0o247, 1, 3), true), "CIRC 1,3");
	assert.equal(text(I(0o43, 0, 0o100), true), ".CALL 100");
	assert.equal(disassemble10(I(0o260, 0o17, 0o1234), (a) => (a === 0o1234 ? "TYPE" : "")).text, "PUSHJ 17,TYPE");
	assert.equal(disassemble10(I(0o260, 0o17, 0o1234)).target, 0o1234);
	assert.equal(disassemble10(I(0o201, 1, 0o1234)).target, null, "an immediate names no address");
	assert.equal(disassemble10(I(0o200, 1, 0o1234, 2)).target, null, "nor does an indexed one");
});

test("disasm10: words as halves, SIXBIT and ASCII", () => {
	const [hello] = assemble10([{ name: "t", text: "SIXBIT /HELLO/" }]).words.map(([, w]) => w);
	assert.equal(sixbit10(hello as number), "HELLO ");
	const hi = assemble10([{ name: "t", text: "ASCIZ /Hi!/" }]).words[0]?.[1] as number;
	assert.equal(ascii10(hi), "Hi!··");
	assert.equal(halves10(0o777777000001n), "777777,,1");
});

test("disasm10: explain says each instruction in English", () => {
	const say = (w: bigint, its = false) => explain10(w, (a) => (a === 0o100 ? "FOO" : ""), { its });
	assert.equal(say(I(0o270, 1, 0o100)), "AC 1 plus the word at FOO, into AC 1");
	assert.equal(say(I(0o271, 1, 5)), "AC 1 plus 5, into AC 1");
	assert.equal(say(I(0o202, 3, 0o100, 2)), "store AC 3 at FOO plus AC 2");
	assert.equal(say(I(0o200, 1, 0o100, 0, 1)), "copy the word at the address held in FOO into AC 1");
	assert.equal(say(I(0o321, 3, 0o100)), "jump to FOO if AC 3 < 0");
	assert.equal(say(I(0o254, 4, 0)), "halt; continuing starts at 0");
	assert.equal(say(I(0o260, 0o17, 0o100)), "call: push the return address onto the stack AC 17 points to, and jump to FOO");
	assert.equal(say(I(0o263, 0o17, 0)), "return: pop the stack AC 17 points to into the PC");
	assert.equal(say(0o712140000100n), "send the console teletype the word at FOO");
	assert.equal(say(I(0o602, 1, 0o10)), "skip if the bits of AC 1 under 10 (the right half) are all 0");
	assert.equal(say(I(0o253, 2, 0o100)), "add 1 to both halves of AC 2, then jump to FOO if it is still negative");
	assert.equal(say(I(0o247, 1, 3), true), "rotate AC 1 left and AC 2 right together, 3 places (ITS)");
	assert.equal(say(0n), "zero");
	for (let op = 0; op < 0o700; op++) {
		const s = explain10(I(op, 1, 0o100));
		assert.ok(s.length > 4 && !/undefined/.test(s), `${op.toString(8)}: ${s}`);
	}
});

// SIMH's names (Richard Cornwell's PDP10/kx10_sys.c, KA build), less what differs on a KA10:
// 100-127 are the KI10's additions, which trap here; SIMH's KA table also lists 102-107 one slot
// off (104 as JSYS). 133 is ADJBP on a KL with AC nonzero, IBP here. Mode 5 of the floating ops is
// immediate on a KA10 (FADRI); SIMH calls it long (FADRL). 247 is not in SIMH's table.
test("disasm10: the names agree with SIMH's table, but for the KA10's differences", () => {
	const fixture = readFileSync(new URL("../../src/ka10/simh-opcodes.txt", import.meta.url), "utf8");
	const ka = new Set(["JRSTF", "HALT", "JEN", "JFOV", "JCRY1", "JCRY0", "JCRY", "JOV", "IBP"]);
	let checked = 0;
	for (const line of fixture.split("\n")) {
		if (!line || line.startsWith("#")) continue;
		const [hi, cls, name] = line.split(" ") as [string, string, string];
		const w = BigInt(`0o${hi}`);
		const op = Number(w >> 27n);
		if (cls === "AC") {
			if ((op >= 0o100 && op <= 0o127) || op === 0o133) continue;
			if (op >= 0o140 && op < 0o200 && (op & 7) === 5) {
				assert.equal(text(w), `${name.replace(/L$/, "I")} 0`);
				continue;
			}
			assert.equal(text(w).split(" ")[0], op === 0 ? "0" : name, `opcode ${op.toString(8)}`);
		} else if (cls === "OP") {
			if (!ka.has(name)) continue;
			assert.equal(text(w), op === 0o133 ? "IBP 0" : name);
		} else assert.equal(text(w).split(" ")[0], name);
		checked++;
	}
	assert.ok(checked > 400, `checked ${checked}`);
});

test("asm10: every disassembly assembles back to its word", () => {
	const samples = [
		[0, 0, 0, 0],
		[1, 0o100, 0, 0],
		[0o17, 0o777777, 0o17, 1],
		[5, 0o400000, 3, 0],
		[0o10, 1, 0, 1],
	] as const;
	for (const its of [false, true]) {
		for (let op = 0; op < 512; op++) {
			for (const [ac, y, x, ind] of samples) {
				const w = I(op, ac, y, x, ind);
				const t = text(w, its);
				const r = assemble10([{ name: "t", text: t }], { its });
				assert.deepEqual(r.errors, [], `${t}`);
				assert.equal(BigInt(r.words[0]?.[1] ?? -1), w, `${op.toString(8)} ${t}${its ? " (ITS)" : ""}`);
			}
		}
	}
});

const HELLO = `TITLE HELLO
TTY=120
	LOC 100
GO:	MOVE 1,[POINT]		; the byte pointer, a literal
NEXT:	ILDB 2,1
	JUMPE 2,DONE
WAIT:	CONSZ TTY,20		; output busy
	JRST WAIT
	DATAO TTY,2
	JRST NEXT
DONE:	CONSZ TTY,20		; let the last character go
	JRST .-1
	HALT GO
POINT=440700,,MSG
MSG:	ASCIZ /HELLO, WORLD/
	END GO
`;

test("asm10: a program assembles, lists, and runs on the KA10", () => {
	const r = assemble10([{ name: "hello", text: HELLO }]);
	assert.deepEqual(r.errors, []);
	assert.equal(r.start, 0o100);
	assert.equal(r.symbols.get("DONE"), 0o107);
	assert.equal(r.literals.length, 1);
	assert.match(printListing(r, { pageLines: 0, date: new Date(2026, 10, 27, 15, 0, 0) }), /100\/ *200040000\d+ +GO:/);

	const m = new ItsMachine();
	m.cpu.reset();
	for (const [a, w] of r.words) m.cpu.deposit(a, BigInt(w));
	m.cpu.PC = r.start as number;
	for (let k = 0; k < 200 && m.cpu.run(10_000) !== "halt"; k++);
	assert.equal(m.output, "HELLO, WORLD");
	assert.equal(disassemble10(m.cpu.examine(0o111)).text, "HALT 100");
});

const dir = process.env.KA10_ITS ?? join(homedir(), "GroundUp/git/its/dl/pdp10-ka");

// With no packs mounted DSKDMP waits for the disk, so the code around its PC is the RP10's
// (device 250) wait loop: DATAO 250,..., DATAI 250,7, TRNN 7,776, JRST back.
test("disasm10: DSKDMP, read from its paper tape, disassembles to its disk loop", { skip: !existsSync(join(dir, "dskdmp.rim")) && "no dskdmp.rim" }, () => {
	const m = new ItsMachine();
	m.pt.attach(new Uint8Array(readFileSync(join(dir, "dskdmp.rim"))));
	m.bootPtr();
	const end = m.cpu.events.now + 30_000_000;
	while (m.cpu.events.now < end) assert.notEqual(m.cpu.run(10_000), "halt");
	const pc = m.cpu.PC;
	assert.ok(pc >= 0o776000, `DSKDMP runs at the top of memory, PC ${pc.toString(8)}`);
	const lines = Array.from({ length: 32 }, (_, k) => disassemble10(m.cpu.examine(pc - 16 + k), () => "", { its: true }));
	const all = lines.map((l) => l.text).join("\n");
	assert.ok(lines.filter((l) => l.kind === "io" && / 250,/.test(l.text)).length >= 3, all);
	assert.ok(lines.slice(12, 20).every((l) => l.kind === "insn" || l.kind === "io"), all);
	assert.ok(lines.some((l) => l.name === "JRST" && l.target !== null && Math.abs(l.target - pc) < 16), all);
});
