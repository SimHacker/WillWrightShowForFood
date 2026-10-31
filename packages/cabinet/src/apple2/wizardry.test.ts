import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parse } from "yaml";
import { PascalVolume } from "./pascal.js";
import { mazeArt, parseMazeArt, Scenario, type MazeGrids } from "./wizardry.js";
import { SIZES } from "./wizardry-schema.js";
import { exportWorld, importWorld } from "./wizardry-world.js";
import { wozToDsk } from "./woz.js";

const DISKS = new URL("../../disks/apple2/", import.meta.url);
const read = (path: string) => new Uint8Array(readFileSync(new URL(path, DISKS)));
const volume = (path: string) => new PascalVolume(read(path));
const PLAYED = "wizardry/wizardry-i-proving-grounds-disk-2.dsk";
const eden = () => new PascalVolume(wozToDsk(read("wizardry/wizardry-i-scenario-original.woz")).image);

test("pascal: the Wizardry I scenario disk's directory", () => {
	const v = volume(PLAYED);
	assert.equal(v.name, "WSV2.1");
	assert.deepEqual(v.entries.map((e) => [e.name, e.kind, e.next - e.first]), [
		["WIZARDRY.CODE", "code", 143],
		["SCENARIO.DATA", "data", 116],
		["SCENARIO.MESGS", "data", 15],
	]);
});

test("pascal: APPLE0 holds the system files", () => {
	const names = volume("pascal/apple-pascal-disk-0.dsk").entries.map((e) => e.name);
	assert.ok(names.includes("SYSTEM.PASCAL"), names.join(" "));
});

test("wizardry: record sizes computed from the source's types match the disk's packing", () => {
	assert.deepEqual(SIZES, { TSCNTOC: 504, TCHAR: 208, TOBJREC: 78, TENEMY: 158, TREWARD: 168, TMAZE: 894, TEXP: 624, PICTURE: 512, MESSAGE_LINE: 42 });
	const sc = new Scenario(volume(PLAYED));
	assert.equal(sc.game, "PROVING GROUNDS OF THE MAD OVERLORD!");
	assert.deepEqual(Object.values(sc.toc.on_disk), [1, 10, 101, 24, 101, 20, 20, 1]);
	assert.deepEqual(Object.values(sc.toc.block_offset), [0, 6, 26, 60, 68, 84, 94, 114]);
	const perTwo = Object.values(sc.toc.per_2_blocks);
	assert.deepEqual(perTwo.slice(1, 6), [1, 6, 6, 13, 4]);
});

test("wizardry: JIB exports with his inventory by name, and WOW! with the spells a level 10 mage knows", () => {
	const files = exportWorld(new Scenario(volume(PLAYED)));
	const jib = parse(files.get("characters/jib/CHARACTER.yml")!);
	assert.equal(jib.location, "MAZE.yml#castle");
	assert.equal(jib.gold, 2995);
	assert.deepEqual([jib.wizardry.race, jib.wizardry.class, jib.wizardry.alignment, jib.wizardry.level, jib.wizardry.hp, jib.wizardry.hp_max, jib.wizardry.experience],
		["HUMAN", "FIGHTER", "GOOD", 11, 89, 97, 174819]);
	assert.deepEqual(jib.wizardry.attributes, { strength: 17, iq: 14, piety: 8, vitality: 18, agility: 16, luck: 13 });
	assert.deepEqual(jib.inventory.filter((p: { equipped: boolean }) => p.equipped).map((p: { item: string }) => p.item),
		["HELM", "PLATE MAIL", "DRAGON SLAYER", "SHIELD + 1", "COPPER GLOVES"]);
	const wow = parse(files.get("characters/wow/CHARACTER.yml")!);
	assert.deepEqual(wow.spells, ["HALITO", "MOGREF", "KATINO", "DUMAPIC", "DILTO", "SOPIC", "MAHALITO", "MOLITO", "MORLIS", "DALTO", "LAHALITO", "MAMORLIS", "MAKANITO", "MADALTO"]);
	assert.equal([...files.keys()].filter((p) => p.startsWith("characters/")).length, 20);
});

test("wizardry: maze art reads back to the same walls, fights and squares", () => {
	const sc = new Scenario(volume(PLAYED));
	for (let level = 1; level <= 10; level++) {
		const m = sc.maze(level) as unknown as MazeGrids & { square_type: string[] };
		const { map, oneWay } = mazeArt(m, m.square_type);
		const back = parseMazeArt(map, oneWay);
		for (const k of ["w", "s", "e", "n", "fights", "square"] as const) assert.deepEqual(back[k], m[k], `level ${level} ${k}`);
	}
	const one = sc.maze(1) as unknown as MazeGrids & { square_type: string[] };
	const art = mazeArt(one, one.square_type).map.split("\n");
	assert.equal(art.length, 43);
	assert.match(art[39] ?? "", /^\| *\S?S/);
});

test("wizardry: export then import onto the same disk gives the same bytes", () => {
	const original = read(PLAYED);
	const files = exportWorld(new Scenario(new PascalVolume(original)));
	const target = new PascalVolume(original);
	importWorld(files, new Scenario(target));
	assert.deepEqual(target.image(), original);
});

test("wizardry: comments people write survive a re-export, and an edit survives import", () => {
	const sc = new Scenario(volume(PLAYED));
	const first = exportWorld(sc);
	const path = "characters/jib/CHARACTER.yml";
	const edited = first.get(path)!.replace("gold: 2995", "gold: 3000 # found behind the stairs") + "notes: the first fighter Soul City met\n";
	first.set(path, edited);
	const again = exportWorld(sc, { existing: first });
	assert.match(again.get(path)!, /gold: 2995 # found behind the stairs/);
	assert.match(again.get(path)!, /notes: the first fighter Soul City met/);
	const target = new Scenario(volume(PLAYED));
	importWorld(first, target);
	assert.equal(parse(exportWorld(target).get(path)!).gold, 3000);
});

test("wizardry: characters from the played disk move onto the original disk, which has none", () => {
	const played = exportWorld(new Scenario(volume(PLAYED)));
	const characters = new Map([...played].filter(([p]) => p.startsWith("characters/")));
	const target = new Scenario(eden());
	assert.equal(target.characters().length, 0);
	importWorld(characters, target);
	const moved = exportWorld(target);
	for (const [p, text] of characters) assert.deepEqual(parse(moved.get(p)!), parse(text), p);
});

test("woz: the original Proving Grounds scenario disk decodes whole, same maze as the played disk", () => {
	const { missing } = wozToDsk(read("wizardry/wizardry-i-scenario-original.woz"));
	assert.deepEqual(missing, []);
	const sc = new Scenario(eden());
	assert.equal(sc.game, "PROVING GROUNDS OF THE MAD OVERLORD!");
	assert.deepEqual(sc.maze(1), new Scenario(volume(PLAYED)).maze(1));
});
