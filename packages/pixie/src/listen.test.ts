import assert from "node:assert/strict";
import test from "node:test";

import { RingBuilder } from "./cells.js";
import { changedNodes, ringPhrase, sayPhrase } from "./listen.js";
import { ringToScene } from "./scene.js";
import { addrOf, NIL } from "./words.js";

/** A ring of three under SAVINS, PIX's printname hung from the first; `more` adds HEX as a fourth. */
function drawing(more: boolean) {
	const b = new RingBuilder(0o100);
	const name = b.printname("PIX");
	const slab = b.block([3, 0o777, 0o123]);
	const c1 = b.cell(name, NIL);
	const c2 = b.cell(slab, NIL);
	const c3 = b.cell(0o17, NIL);
	b.setCdr(c1, c2);
	b.setCdr(c2, c3);
	if (more) {
		const c4 = b.cell(b.printname("HEX"), c1);
		b.setCdr(c3, c4);
	} else b.setCdr(c3, c1);
	b.savins = c1;
	return b.build();
}

test("listen: the whole ring plays in walk order, climbing along the ring, closing on its head", () => {
	const p = ringPhrase(ringToScene(drawing(false)));
	const kinds = p.tones.map((t) => t.kind);
	assert.deepEqual(kinds.slice(0, 4), ["cell", "cell", "cell", "close"], "the root ring first, then its close");
	assert.deepEqual(p.tones.slice(0, 3).map((t) => t.degree), [0, 1, 2]);
	assert.ok(kinds.includes("rest"), "a rest between chains");
	assert.ok(kinds.includes("block"));
	assert.deepEqual(p.names, ["PIX"]);
	assert.ok(p.tones.filter((t) => t.kind === "letter").every((t) => t.depth === 1), "the printname a level down");
	assert.equal(sayPhrase(p), `PIX: ${p.cells} cells and 1 block in ${p.chains} chains`);
});

test("listen: after a drawing, only what changed plays, and a name spells its own tune", () => {
	const before = drawing(false);
	const after = ringToScene(drawing(true));
	const only = changedNodes(after, before);
	const p = ringPhrase(after, only);
	assert.deepEqual(p.names, ["HEX"], "the new name, not the old one");
	assert.ok(!p.tones.some((t) => t.kind === "block"), "the untouched block is not heard");
	const steps = p.tones.filter((t) => t.kind === "letter").map((t) => t.degree);
	assert.deepEqual(steps, [..."HEX"].map((c) => c.charCodeAt(0) % 7), "a letter is always the same step");
	assert.equal(new Set(steps).size, 3);
	assert.equal(changedNodes(after, drawing(true)).size, 0, "nothing changed, nothing to hear");
});

test("listen: a long phrase is thinned to the limit, its first and last kept", () => {
	const b = new RingBuilder(0o100);
	const cells: number[] = [];
	for (let i = 0; i < 100; i += 1) cells.push(b.cell(i & 0o17, NIL));
	cells.forEach((c, i) => b.setCdr(c, cells[(i + 1) % cells.length]!));
	b.savins = cells[0]!;
	const scene = ringToScene(b.build());
	const p = ringPhrase(scene, null, { most: 16 });
	assert.equal(p.tones.length, 16);
	assert.equal(p.skipped, 101 - 16);
	assert.equal(p.tones[0]!.addr, addrOf(cells[0]!));
	assert.equal(p.tones[15]!.kind, "close");
	assert.equal(p.cells, 100);
});
