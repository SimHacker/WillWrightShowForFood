import assert from "node:assert/strict";
import { test } from "node:test";
import { compiler7Node, dispatchNode, seaNode, type KorzNode } from "./inspect.js";
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
