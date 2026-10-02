import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { adventToRings, ringsToAdvent } from "./advent-ring.js";
import { pointersResolve } from "./cells.js";
import { fromJson, fromYaml, saveInto, toJson, toYaml } from "./graph.js";
import { graphToRing, ringToGraph } from "./graph-ring.js";
import { decodeTransfer, encodeTransfer, relocate } from "./image.js";
import { parseAdventMap, parseArpaMap, writeAdventMap, writeArpaMap } from "./psiber.js";

const psiber = fileURLToPath(new URL("../../../characters/don-hopkins/code/psiber/", import.meta.url));
const arpaPs = readFileSync(`${psiber}cyber/arpa.map`, "latin1");
const adventPs = readFileSync(`${psiber}cyber/advent.map`, "latin1");
const same = (a: unknown, b: unknown): void => assert.equal(JSON.stringify(a), JSON.stringify(b));

for (const [name, ps, parse, write] of [
	["arpa", arpaPs, parseArpaMap, writeArpaMap],
	["advent", adventPs, parseAdventMap, writeAdventMap],
] as const) {
	test(`${name}.map: PostScript, YAML and JSON round-trip`, () => {
		const g = parse(ps);
		assert.equal(write(g), ps);
		same(fromYaml(toYaml(g)), g);
		same(fromJson(toJson(g)), g);
	});
}

test("arpa.map: one ring image, relocatable", () => {
	const g = parseArpaMap(arpaPs);
	const ring = graphToRing(g);
	assert.ok(pointersResolve(ring));
	same(ringToGraph(ring), g);
	same(ringToGraph(relocate(decodeTransfer(encodeTransfer(ring)), 0o4000)), g);
});

test("advent.map: topology ring plus description overlays, each within 8K", () => {
	const g = parseAdventMap(adventPs);
	const rings = adventToRings(g);
	assert.ok(rings.descriptions.length >= 1);
	for (const image of [rings.topology, ...rings.descriptions]) {
		assert.ok(image.end <= 0o20000);
		assert.ok(pointersResolve(image));
	}
	same(ringsToAdvent(rings), g);
	same(
		ringsToAdvent({
			topology: relocate(decodeTransfer(encodeTransfer(rings.topology)), 0o4000),
			descriptions: rings.descriptions.map((o) => relocate(o, 0o200)),
		}),
		g,
	);
});

test("saveInto keeps comments and hand-added keys", () => {
	const g = parseArpaMap(arpaPs);
	const hand = toYaml(g)
		.replace("nodes:", "# hand comment\nnodes:")
		.replace("{ id: ARPA, label: ARPA IMP,", "{ id: ARPA, lat: 38.88, long: -77.1, label: ARPA IMP,");
	const first = g.nodes.find((n) => n.id === "ARPA");
	assert.ok(first);
	first.props.label = "ARPA hub";
	const out = saveInto(hand, g, { prune: false });
	assert.match(out, /# hand comment/);
	const back = fromYaml(out);
	const arpa = back.nodes.find((n) => n.id === "ARPA");
	assert.equal(arpa?.props.lat, 38.88);
	assert.equal(arpa?.props.label, "ARPA hub");
	assert.equal(fromYaml(saveInto(hand, g)).nodes.find((n) => n.id === "ARPA")?.props.lat, undefined);
});
