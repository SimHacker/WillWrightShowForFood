import { strict as assert } from "node:assert";
import { test } from "node:test";
import { bool, decode, encode, enumOf, f, int, keyed, long, packed, range, record, sizeOf, str } from "./records.js";
import { fromHexRows, hexRows, locationRef, parseLocation, slug } from "./world.js";
import { parse } from "yaml";
import { makeYaml, mergeYaml } from "./yaml-jazz.js";

test("packed arrays put floor(16/bits) elements in a word and never split one", () => {
	const t = packed(4, range(18));
	assert.equal(sizeOf(t), 4);
	const b = new Uint8Array(4);
	encode(t, [1, 2, 3, 4], b, 0);
	assert.deepEqual(decode(t, b, 0), [1, 2, 3, 4]);
	assert.equal(b[0]! | (b[1]! << 8), 1 | (2 << 5) | (3 << 10));
	assert.equal(b[2], 4);
});

test("bool arrays are bit strings, keyed bool arrays are lists of keys", () => {
	const b = new Uint8Array(4);
	encode(packed(20, bool), "1010", b, 0);
	assert.equal(decode(packed(20, bool), b, 0), "10100000000000000000");
	const classes = keyed(["FIGHTER", "MAGE", "PRIEST"], bool, true);
	encode(classes, ["MAGE"], b, 0);
	assert.deepEqual(decode(classes, b, 0), ["MAGE"]);
});

test("encoding overlays the base, so missing keys and odd words survive", () => {
	const t = record(f("name", "NAME", str(5)), f("n", "N", int), f("gold", "GOLD", long(3, 10000)));
	assert.equal(sizeOf(t), 6 + 2 + 6);
	const b = Uint8Array.from([3, 65, 66, 67, 0xee, 0xee, 7, 0, 0x10, 0x27, 0, 0, 0, 0]);
	const v = decode(t, b, 0) as { [k: string]: unknown };
	assert.deepEqual(v, { name: "ABC", n: 7, gold: [10000, 0, 0] });
	const out = b.slice();
	encode(t, { name: "ABC" }, out, 0);
	assert.deepEqual(out, b);
	encode(t, { gold: 1_2345_6789 }, out, 0);
	assert.equal((decode(t, out, 0) as { gold: number }).gold, 1_2345_6789);
	assert.throws(() => encode(enumOf(["A", "B"]), "C", out, 0, "kind"), /at kind: C is not one of A, B/);
});

test("merge keeps comments, order and keys the program doesn't own", () => {
	const first = makeYaml({ name: "JIB", hp: 89, inventory: [{ item: "HELM" }] }, { note: (p) => (p.join(".") === "hp" ? "hit points" : undefined) });
	assert.match(first, /hp: 89 # hit points/);
	const edited = `# a fighter from the played disk\n${first}notes: met SNOPPY on level 4 # by hand\n`;
	const merged = mergeYaml(edited, { name: "JIB", hp: 97, inventory: [{ item: "HELM" }, { item: "SHIELD" }], location: "castle" }, { owned: (_p, k) => k === "location" });
	assert.match(merged, /^# a fighter from the played disk/);
	assert.match(merged, /hp: 97 # hit points/);
	assert.match(merged, /notes: met SNOPPY on level 4 # by hand/);
	assert.match(merged, /SHIELD/);
	assert.ok(merged.indexOf("location") > merged.indexOf("hp"));
	const moved = mergeYaml(merged, { name: "JIB", hp: 97, inventory: [] }, { owned: (_p, k) => k === "location" });
	assert.doesNotMatch(moved, /location/);
	assert.match(moved, /notes:/);
});

test("lists with an identity key merge by entry", () => {
	const text = "slots:\n  - slot: 0\n    name: JIB # the first\n  - slot: 1\n    name: GOR\n";
	const merged = mergeYaml(text, { slots: [{ slot: 1, name: "GOR" }, { slot: 0, name: "JIB" }] }, { identity: ["slot"] });
	assert.match(merged, /name: JIB # the first/);
	assert.ok(merged.indexOf("GOR") < merged.indexOf("JIB"));
});

test("locations, slugs and hex rows", () => {
	assert.equal(locationRef("MAZE.yml", "level-3", "4,7"), "MAZE.yml#level-3/4,7");
	assert.deepEqual(parseLocation("MAZE.yml#level-3/4,7"), { file: "MAZE.yml", path: ["level-3", "4,7"] });
	assert.equal(slug("WOW!"), "wow");
	assert.equal(slug("QUIOP WERT"), "quiop-wert");
	const bytes = Uint8Array.from({ length: 40 }, (_, i) => i);
	assert.deepEqual(fromHexRows(hexRows(bytes, 16)), bytes);
});

test("yaml-jazz: DEL and C1 controls come out escaped and read back the same", () => {
	const raw = "a\x99b\x7f\x85\x11c";
	const text = makeYaml({ text: [raw] });
	assert.ok(!/[\x7f-\x84\x86-\x9f]/.test(text), text);
	assert.match(text, /\\x99/);
	assert.match(mergeYaml(text, { text: [raw] }), /\\x99/);
	assert.match(mergeYaml(makeYaml({ text: ["plain"] }), { text: [raw] }), /\\x99/);
	assert.deepEqual(parse(text), { text: [raw] });
});

test("yaml-jazz: control characters in a note become visible escapes", () => {
	const text = makeYaml({ n: 1 }, { note: () => 'message "\x11\x99"' });
	assert.ok(!/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x84\x86-\x9f]/.test(text), text);
	assert.deepEqual(parse(text), { n: 1 });
});

test("yaml-jazz: NEL and tabs stay inside their scalar, also in a merged file", () => {
	const raw = "a\tb\x85c\u2028d";
	const text = mergeYaml(makeYaml({ text: ["x"], other: "a\tb" }, { note: () => "say \x85 here" }), { text: [raw], other: "a\tb" });
	assert.ok(!/[\x85\u2028]/.test(text), text);
	assert.deepEqual(parse(text), { text: [raw], other: "a\tb" });
});
