import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { listBasic } from "./basic.js";
import { D64 } from "./d64.js";
import { exportHouse, FIELDS, House, importHouse, MOVE_IN, readText } from "./lcp.js";

const DISKS = new URL("../../disks/c64/little-computer-people/", import.meta.url);
const disk = (name: string) => new D64(new Uint8Array(readFileSync(new URL(name, DISKS))));
const house = (name: string) => new House(disk(name));

test("d64: the directory of an original Little Computer People disk", () => {
	const d = disk("lcp-a131.d64");
	assert.equal(d.diskName, "RESEARCH PROJECT");
	assert.equal(d.entries.length, 48);
	assert.deepEqual(d.entries.slice(0, 3).map((e) => [e.name, e.type, e.blocks]), [
		["HOUSE", "PRG", 1],
		["AB", "PRG", 17],
		["{c}LIL", "PRG", 16],
	]);
});

test("basic: CREATE NEW LCP draws house number digits from 0 to >", () => {
	const listing = listBasic(disk("lcp-h-stephen-7-times-started.d64").read("CREATE NEW LCP"));
	assert.match(listing, /^52 FORI=1TO8:PRINT#2,CHR\$\(48\+INT\(RND\(1\)\*15\)\);:NEXT$/m);
	assert.match(listing, /^53 PRINT#15,"U2:"2;0;18;17$/m);
});

test("lcp: LCP EVICTOR's DATA is the move-in record", () => {
	const listing = listBasic(disk("lcp-tools-side-b.d64").read("LCP EVICTOR"));
	const data = [...listing.matchAll(/DATA ?([0-9,]+)/g)].flatMap((m) => m[1]!.split(",").map(Number));
	assert.deepEqual(Uint8Array.from(data), MOVE_IN);
});

test("lcp: every original disk ships the move-in record, each with its own house number", () => {
	const numbers = new Set<string>();
	for (const n of [131, 132, 133, 134, 135, 136, 137, 138, 139]) {
		const h = house(`lcp-a${n}.d64`);
		assert.ok(h.hasRecord && h.moveInTemplate, `a${n}`);
		numbers.add(h.houseNumber);
	}
	assert.equal(numbers.size, 9);
	assert.equal(house("lcp-a131.d64").houseNumber, "57923930");
	assert.equal(readText(MOVE_IN, FIELDS.name), "Zeke");
	assert.equal(readText(MOVE_IN, FIELDS.researcher), "Billy Bob Binkle");
});

test("lcp: the lived-in houses", () => {
	const people = ["lcp-h-stephen-7-times-started.d64", "lcp-cr-sphinx.d64", "lcp-cr-sca.d64"].map((f) => {
		const h = house(f);
		assert.ok(h.hasRecord && !h.moveInTemplate, f);
		return [readText(h.record, FIELDS.name), readText(h.record, FIELDS.researcher)];
	});
	assert.deepEqual(people, [
		["Rob", "Stephen"],
		["Ivan", "Rainer Huhn _"],
		["Fritz", "Sca Cracks All"],
	]);
	assert.equal(house("lcp-h-stephen-7-times-started.d64").houseNumber, "=8336>76");
	assert.equal(house("lcp-cr-snail.d64").hasRecord, false);
});

test("lcp: a resident moves into another house byte for byte, and keeps edits and comments", () => {
	const from = house("lcp-h-stephen-7-times-started.d64");
	const files = exportHouse(from);
	const to = house("lcp-a132.d64");
	importHouse(files, to);
	assert.deepEqual(to.record, from.record);
	assert.equal(to.houseNumber, from.houseNumber);

	const path = "characters/rob/CHARACTER.yml";
	files.set(path, files.get(path)!.replace("name: Rob", "# renamed by hand\nname: Robert"));
	importHouse(files, to);
	assert.equal(readText(to.record, FIELDS.name), "Robert");
	assert.deepEqual(to.record.subarray(0, FIELDS.name.at), from.record.subarray(0, FIELDS.name.at));
	const again = exportHouse(to, { existing: files });
	assert.match(again.get(path)!, /# renamed by hand\nname: Robert/);
});
