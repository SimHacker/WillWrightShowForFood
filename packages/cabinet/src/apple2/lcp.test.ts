import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parse } from "yaml";
import { exportHouseSide, houseRecord, importHouseSide } from "./lcp.js";

const DISKS = new URL("../../disks/apple2/little-computer-people/", import.meta.url);
const disk = (name: string) => new Uint8Array(readFileSync(new URL(name, DISKS)));

test("LCP Apple: a House side's person reads as CHARACTER.yml", () => {
	const rob = exportHouseSide(disk("rob-house.dsk"));
	const c = parse(rob.get("characters/rob/CHARACTER.yml")!);
	assert.equal(c.name, "Rob");
	assert.deepEqual(c.lcp, { researcher: "Stephen", moved_in: "11/21/26", last_visit: "11/21/26", sessions: 1, record: "LCP-RECORD.yml" });
	assert.equal(parse(rob.get("HOUSE.yml")!).resident, "characters/rob/CHARACTER.yml");
	const fred = parse(exportHouseSide(disk("lcp-4am-side-b.dsk")).get("characters/fred/CHARACTER.yml")!);
	assert.equal(fred.lcp.researcher, "Creator Ofme");
	assert.equal(fred.lcp.moved_in, "09/13/85");
	assert.equal(parse(exportHouseSide(disk("lcp-side-b.dsk")).get("characters/darren/CHARACTER.yml")!).lcp.sessions, 14);
	assert.equal(houseRecord(disk("rob-guestbook.dsk")), undefined);
	assert.throws(() => exportHouseSide(disk("rob-guestbook.dsk")), /not a Little Computer People House side/);
});

test("LCP Apple: import writes back byte for byte, and edits land in the record", () => {
	for (const name of ["rob-house.dsk", "ivan-house.dsk", "fritz-house.dsk", "lcp-4am-side-b.dsk", "lcp-side-b.dsk"]) {
		const image = disk(name);
		assert.deepEqual(importHouseSide(exportHouseSide(image), image), image, name);
	}
	const image = disk("ivan-house.dsk");
	const files = exportHouseSide(image);
	const path = "characters/ivan/CHARACTER.yml";
	files.set(path, files.get(path)!.replace("researcher: Rainer Huhn", "researcher: Don Hopkins").replace("sessions: 1", "sessions: 12"));
	const c = parse(exportHouseSide(importHouseSide(files, image)).get(path)!);
	assert.equal(c.lcp.researcher, "Don Hopkins");
	assert.equal(c.lcp.sessions, 12);
	assert.equal(c.name, "Ivan");
});
