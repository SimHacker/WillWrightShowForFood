import assert from "node:assert/strict";
import test from "node:test";

import { RingBuilder } from "./cells.js";
import { toJson, toYaml } from "./graph.js";
import type { Graph } from "./graph.js";
import { encodeTransfer, packWords, relocate } from "./image.js";
import { changedCells, readRings, ringToScene } from "./scene.js";
import { DEFAULT_CAMERA, drawList, paint, pick } from "./view.js";
import type { Pen } from "./view.js";
import { NIL, NONITEM } from "./words.js";

function sample() {
	const b = new RingBuilder(0o100);
	const name = b.printname("PIX");
	const slab = b.block([3, 0o777, 0o123]);
	const c1 = b.cell(name, NIL);
	const c2 = b.cell(slab, NIL);
	const c3 = b.cell(0o17, c1);
	b.setCdr(c1, c2);
	b.setCdr(c2, c3);
	b.savins = c1;
	return b.build();
}

test("a closed cdr chain is a ring; car pointers hang below it", () => {
	const s = ringToScene(sample());
	const ring = s.chains[0]!;
	assert.equal(ring.kind, "ring");
	assert.equal(ring.cells.length, 3);
	assert.ok(s.edges.some((e) => e.kind === "close"));
	const pn = s.chains.find((c) => c.text === "PIX");
	assert.equal(pn?.kind, "list");
	assert.equal(pn?.depth, 1);
	assert.ok(s.chains.some((c) => c.kind === "block"));
	assert.equal(s.nodes.length, 3 + 3 + 1);
});

test("layout is deterministic and centred", () => {
	const a = ringToScene(sample());
	const b = ringToScene(relocate(sample(), 0o4000));
	assert.deepEqual(
		a.nodes.map((n) => n.pos),
		b.nodes.map((n) => n.pos),
	);
	for (const n of a.nodes) assert.ok(Math.hypot(...n.pos) < a.radius);
});

test("nonitems forward, and pointers out of the image stay visible", () => {
	const b = new RingBuilder(0o100);
	const c = b.cell(0o5, NIL);
	const img = b.build();
	img.words.push(NONITEM | 0o100, 0o100000 | 0o7000, NIL);
	img.end += 3;
	img.savins = 0o100102;
	const s = ringToScene(img, [0o100102, 0o100103]);
	assert.ok(s.nodes.some((n) => n.kind === "forward"));
	assert.ok(s.edges.some((e) => e.kind === "forward" && e.to === (c & 0o17777)));
	assert.ok(s.nodes.some((n) => n.kind === "outside" && n.addr === 0o7000));
});

test("readRings takes YAML, JSON, word lists and bytes alike", () => {
	const g: Graph = { meta: { title: "t" }, nodes: [{ id: "a", props: { n: 1 }, links: [{ to: "a", props: {} }] }] };
	const fromY = readRings(toYaml(g));
	const fromJ = readRings(toJson(g));
	assert.deepEqual(fromY, fromJ);
	const xfer = encodeTransfer(sample());
	assert.deepEqual(readRings(JSON.stringify(xfer)), sample());
	assert.deepEqual(readRings(packWords(xfer)), sample());
	assert.deepEqual(readRings(JSON.stringify(sample())), sample());
	assert.ok(ringToScene(fromY).nodes.length > 0);
});

test("changes light up, and the painter draws with any pen", () => {
	const a = sample();
	const b = { ...a, words: [...a.words] };
	b.words[0] = 0o17;
	assert.ok(changedCells(a, b).has(0o100));
	const s = ringToScene(b);
	const marks = drawList(s, DEFAULT_CAMERA, 400, 300, changedCells(a, b));
	let calls = 0;
	const pen = new Proxy({} as Pen, {
		get: (t, k) => (k in t ? t[k as keyof Pen] : () => (calls += 1)),
		set: (t, k, v) => Reflect.set(t, k, v),
	});
	paint(pen, marks, 100);
	assert.ok(calls > marks.length);
	const node = marks.find((m) => m.type === "node")!;
	assert.equal(node.type === "node" && pick(marks, node.x, node.y) !== null, true);
});
