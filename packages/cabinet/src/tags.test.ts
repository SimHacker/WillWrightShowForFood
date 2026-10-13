import assert from "node:assert/strict";
import { test } from "node:test";
import { hoverAt } from "./hover.js";
import { type Segment, Type340 } from "./plugins/type340.js";
import { readTag, safeTagUrl } from "./tags.js";

function run(list: number[], extra: Record<number, number> = {}): Segment[] {
	const core = new Array<number>(8192).fill(0);
	list.forEach((w, i) => (core[i] = w));
	for (const [a, w] of Object.entries(extra)) core[Number(a)] = w;
	const t = new Type340({ fetch: (a) => core[a] ?? 0, store: (a, w) => (core[a] = w) });
	t.iot({ device: 0o06, pulse: 0o04, ac: 0 });
	for (let n = 0; n < 100 && t.status === 0; n += 1) t.tick();
	return t.segments;
}

const POINT = 1 << 13;
const SUBR = 7 << 13;
const Y = 0o200000;
const LIT = 0o2000;

test("DTG: jump type 00 tags what follows until the next DTG; 0 untags", () => {
	const segs = run([
		POINT, // PARAM: point mode next
		SUBR | 100, // x 100, SUBR next
		POINT | 0o100, // DTG record 0o100, point mode next
		POINT | Y | LIT | 200, // tagged
		SUBR | LIT | 300, // tagged, SUBR next
		POINT, // DTG 0
		Y | LIT | 250, // untagged, PARAM next
		0o2000, // PARAM: stop
	]);
	assert.deepEqual(
		segs.map((s) => [s.x0, s.y0, s.tag]),
		[
			[100, 200, 0o100],
			[300, 200, 0o100],
			[300, 250, 0],
		],
	);
});

test("DTG: IDLA clears the tag, and every old program still draws the same (00 was never used)", () => {
	const segs = run([POINT, SUBR | 10, POINT | 0o100, Y | LIT | 20, 0o2000]);
	assert.equal(segs[0]?.tag, 0o100);
	const again = run([POINT, Y | LIT | 20, 0o2000]);
	assert.equal(again[0]?.tag, 0, "a fresh IDLA starts untagged");
});

test("readTag: a Forth counted string, and a full record with a 6-bit title, an ASCII link and an id", () => {
	const core: Record<number, number> = { 0o100: 3, 0o101: 76, 0o102: 73, 0o103: 68 };
	Object.assign(core, { 0o200: 0o140000 | 0o210, 0o201: 0o220, 0o202: 5, 0o203: 7 });
	Object.assign(core, { 0o210: 0o041717, 0o211: 0o223737 });
	[..."https://x.org/"].forEach((c, i) => (core[0o220 + i] = c.charCodeAt(0)));
	const read = (a: number) => core[a] ?? 0;
	assert.deepEqual(readTag(read, 0o100), { addr: 0o100, title: "LID" });
	assert.deepEqual(readTag(read, 0o200), { addr: 0o200, title: "DOOR", url: "https://x.org/", id: { hi: 5, lo: 7 } });
	assert.equal(readTag(read, 0), null);
	assert.ok(safeTagUrl("https://x.org/") && safeTagUrl("../page") && !safeTagUrl("javascript:alert(1)") && !safeTagUrl("data:x"));
});

test("hover groups a tagged stroke with everything else under its tag", () => {
	const segs = run([POINT, SUBR | 100, POINT | 0o100, POINT | Y | LIT | 200, LIT | 300, 0o2000]);
	const h = hoverAt(segs, 100, 200);
	assert.equal(h?.keyKind, "tag");
	assert.equal(h?.key, 0o100);
	assert.equal(h?.group.length, 2);
});
