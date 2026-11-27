import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { Angel, commandKeys, commandSpec, loadLooks, parseAngel, placeOf } from "./angel.js";

const cabinet = join(dirname(fileURLToPath(import.meta.url)), "../..");
const yml = join(cabinet, "angels/text-adventures/ANGEL.yml");
const blank = { width: 1, height: 1, data: new Uint8Array(4) };
const gameOf = (a: Angel): string | undefined => a.game?.id;

async function textAngel(): Promise<Angel> {
	const spec = parseAngel(readFileSync(yml, "utf8"));
	return new Angel(spec, await loadLooks(spec.looks, () => Promise.reject(new Error("no pictures here"))));
}

// Zork I's first screen on the 40-column Apple, as the text page holds it.
const ZORK_I = [
	"WEST OF HOUSE            SCORE: 0/0",
	"ZORK I: THE GREAT UNDERGROUND EMPIRE",
	"COPYRIGHT (C) 1981, 1982, 1983 INFOCOM,",
	"INC. ALL RIGHTS RESERVED.",
	"ZORK IS A REGISTERED TRADEMARK OF",
	"INFOCOM, INC.",
	"RELEASE 88 / SERIAL NUMBER 840726",
	"",
	"WEST OF HOUSE",
	"YOU ARE STANDING IN AN OPEN FIELD WEST",
	"OF A WHITE HOUSE, WITH A BOARDED FRONT",
	"DOOR.",
	"THERE IS A SMALL MAILBOX HERE.",
	"",
	">",
];

test("the text adventure angel knows Zork I by its banner and keeps it", async () => {
	const a = await textAngel();
	assert.equal(gameOf(a), undefined);
	a.step(blank, 1, ZORK_I);
	assert.equal(gameOf(a), "zork-i");
	assert.equal(a.state.id, "playing");
	assert.equal(placeOf(a.game!, ZORK_I), "WEST OF HOUSE");

	const later = ["NORTH OF HOUSE           SCORE: 0/1", ">NORTH", "NORTH OF HOUSE", "YOU ARE FACING THE NORTH SIDE", ">"];
	a.step(blank, 2, later);
	assert.equal(gameOf(a), "zork-i", "the banner has scrolled away; the game is still Zork I");
	assert.equal(placeOf(a.game!, later), "NORTH OF HOUSE");

	a.step(blank, 3, ["INSIDE THE BARROW        SCORE: 0/0", "ZORK II: THE WIZARD OF FROBOZZ", ">"]);
	assert.equal(gameOf(a), "zork-ii");
	a.reset(4);
	assert.equal(gameOf(a), undefined);
});

test("with no banner on the screen, the disk in drive 1 says which game it is", async () => {
	const a = await textAngel();
	const south = ["SOUTH OF HOUSE           SCORE: 0/2", "YOU ARE FACING THE SOUTH SIDE OF A WHITE", ">"];
	a.step(blank, 1, south);
	assert.equal(gameOf(a), undefined);
	a.step(blank, 2, south, "collection/infocom/zork-i-r88b-4am.dsk");
	assert.equal(gameOf(a), "zork-i");
	assert.equal(a.state.id, "playing");
});

test("the angel sees [MORE] and the 80-column question", async () => {
	const a = await textAngel();
	a.step(blank, 1, ["80 COLUMNS? (Y/N):"]);
	assert.equal(a.state.id, "columns");
	a.step(blank, 2, ["AS IN A DREAM, YOU SEE YOURSELF TUMBLING", "ZORK III: THE DUNGEON MASTER", "[MORE]"]);
	assert.equal(a.state.id, "more");
	assert.equal(gameOf(a), "zork-iii");
});

test("every Zork has a rose and LOOK; Zork I has every verb", async () => {
	const a = await textAngel();
	for (const g of a.spec.games ?? []) {
		for (const p of ["n", "s", "e", "w", "up", "down", "in", "out"] as const) assert.ok(g.compass?.[p], `${g.id} goes ${p}`);
		assert.equal(g.center, "LOOK");
	}
	const every = a.spec.games?.find((g) => g.id === "zork-i")?.groups?.find((g) => g.label === "Every Zork I verb");
	assert.ok(every && every.words.length >= 120, `Zork I's verbs: ${every?.words.length}`);
	const take = every.words.find((w) => commandSpec(w).word === "TAKE");
	assert.ok(take && commandKeys(take) === "TAKE ", "TAKE asks what, so it waits for more");
	const inventory = every.words.find((w) => commandSpec(w).word === "INVENTORY");
	assert.ok(inventory && commandKeys(inventory) === "INVENTORY\r");
});
