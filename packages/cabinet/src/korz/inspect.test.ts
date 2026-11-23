import assert from "node:assert/strict";
import { test } from "node:test";
import { compiler65Node, compiler7Node, dispatchNode, lister65, sea65Node, seaNode, type KorzNode } from "./inspect.js";
import { Korz6502 } from "./m6502.js";
import { KorzPdp7 } from "./pdp7.js";

const kids = (n: KorzNode): KorzNode[] => n.children?.() ?? [];
const find = (list: KorzNode[], id: string): KorzNode => {
	const n = list.find((k) => k.id === id);
	assert.ok(n, `no ${id} in ${list.map((k) => k.id).join(", ")}`);
	return n;
};

/** LAC 200, TAD 201, DAC 200, JMP 100: a loop the compiler turns into one block. */
function looping(): KorzPdp7 {
	const m = new KorzPdp7({ coreWords: 0o20000, korz: "compile" });
	[0o200200, 0o340201, 0o040200, 0o600100].forEach((w, i) => m.write(0o100 + i, w));
	m.write(0o201, 1);
	m.pc = 0o100;
	const clock = { cycles: 0, next: 1000, until: 1000 };
	while (clock.cycles < clock.until) {
		m.runBatch!(clock);
		clock.cycles += 1;
	}
	return m;
}

test("inspect: the compiler's block for a loop, with its PDP-7 words and its JavaScript", () => {
	const m = looping();
	const root = compiler7Node(m.compiler!, (a) => `${a.toString(8)} ${m.read(a).toString(8)}`);
	assert.match(root.note ?? "", /built/);
	const blk = find(kids(find(kids(root), "blocks")), "00100");
	assert.equal(blk.addr, 0o100);
	assert.match(blk.text ?? "", /\/\/ 100 200200/);
	assert.match(blk.text ?? "", /function korz7_blk_100/);
	assert.ok(kids(find(kids(root), "accessors")).length > 0);
});

test("inspect: a sea's selectors, their table and slots, and the dispatch methods", () => {
	const m = looping();
	const sea = seaNode("cpu", "PDP-7 CPU", m.sea);
	const sels = kids(sea);
	assert.ok(sels.length > 0);
	for (const s of sels) {
		const [table, ...slots] = kids(s);
		assert.ok(table && /table|interpreted/.test(table.label), s.id);
		assert.ok(slots.every((k) => /\/\/ run:/.test(k.text ?? "")), s.id);
	}
	assert.ok(kids(dispatchNode()).some((k) => /^korz_/.test(k.label)));
});

class Ram {
	readonly mem = new Uint8Array(0x10000);
	read(a: number): number {
		return this.mem[a & 0xffff]!;
	}
	write(a: number, v: number): void {
		this.mem[a & 0xffff] = v & 0xff;
	}
	peek(a: number): number {
		return this.read(a);
	}
}

test("inspect: the 6502 sea names its slots' wins as opcodes, and says why for the next one", () => {
	const ram = new Ram();
	ram.mem.set([0xa2, 0x0a, 0xca, 0xd0, 0xfd, 0x4c, 0x00, 0x08], 0x800);
	const cpu = new Korz6502(ram, { korz: "compile" });
	cpu.pc = 0x800;
	for (let i = 0; i < 100 && cpu.pc !== 0x805; i++) cpu.step();
	const root = sea65Node(cpu);
	const exec = find(kids(root), "exec");
	const lda = kids(exec).find((k) => k.label === "LDA")!;
	assert.match(lda.note ?? "", /wins 8/);
	assert.match(lda.text ?? "", /A5 LDA zp/);
	const tya = kids(exec).find((k) => k.label === "TYA")!;
	assert.match(tya.text ?? "", /shadows \(they run only if it calls next\): flags/);
	const next = find(kids(root), "next");
	assert.match(next.label, /^next, at \$0805: 4C JMP abs/);
	assert.match(next.text ?? "", /runs\s+JMP abs/);
	const row = find(kids(find(kids(root), "opcodes")), "row 10");
	assert.match(row.note ?? "", /^LDY LDA LDX LAX/);

	const compiler = compiler65Node(cpu.compiler!, lister65(cpu));
	const blk = find(kids(find(kids(compiler), "blocks")), "$0800");
	assert.match(blk.text ?? "", /\$0800  A2 0A\s+LDX #imm/);
	assert.match(blk.note ?? "", /ran [1-9]/);
	ram.mem[0x800] = 0xa0;
	cpu.pc = 0x800;
	cpu.step();
	const dropped = kids(find(kids(compiler), "dropped"));
	assert.match(dropped[0]?.note ?? "", /\$0800 was A2 LDX #imm, now A0 LDY #imm/);
});
