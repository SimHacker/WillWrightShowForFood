import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { wozToDsk } from "./woz.js";
import {
	HOPKINS_FORTH, MIND_MIRROR, WASM_DEVICES, WIZARDRY_I, missingDevices, Play,
	type AppleMachine,
} from "./games.js";

const DISKS = new URL("../../disks/apple2/", import.meta.url);
const read = (path: string) => new Uint8Array(readFileSync(new URL(path, DISKS)));

test("games: the wasm build can play Wizardry, Mind Mirror and Don's Forth", () => {
	assert.deepEqual(missingDevices(WIZARDRY_I.devices, WASM_DEVICES), []);
	assert.deepEqual(missingDevices(MIND_MIRROR.devices, WASM_DEVICES), []);
	assert.deepEqual(missingDevices(HOPKINS_FORTH.devices, WASM_DEVICES), []);
});

test("games: Wizardry's roster comes off the scenario disk and goes back byte for byte", () => {
	const original = read("wizardry/wizardry-i-proving-grounds-disk-2.dsk");
	const files = WIZARDRY_I.bridge!.export(original);
	assert.match(files.get("characters/jib/CHARACTER.yml") ?? "", /JIB/);
	assert.deepEqual(WIZARDRY_I.bridge!.import(files, original), original);
});

test("games: Mind Mirror's bridge names RAVEN", () => {
	const image = wozToDsk(read("mind-mirror/mm-flux-life-simulation-b.woz")).image;
	const files = MIND_MIRROR.bridge!.export(image);
	assert.match(files.get("characters/raven/CHARACTER.yml") ?? "", /RAVEN/);
	assert.deepEqual(MIND_MIRROR.bridge!.import(files, image), image);
});

test("games: Play boots Wizardry's two disks, and Don's Forth", () => {
	const mounted = new Map<string, Uint8Array>();
	let booted = "";
	const machine: AppleMachine = {
		insertDisk(name, bytes) { mounted.set(name, bytes); },
		boot(name, bytes) { mounted.set(name, bytes); booted = name; },
		disk: (name) => mounted.get(name) ?? null,
	};
	const scenario = read("wizardry/wizardry-i-proving-grounds-disk-2.dsk");
	const boot = read("wizardry/wizardry-i-proving-grounds-disk-1.dsk");
	const play = new Play(machine, WIZARDRY_I);
	play.start(new Map([
		["wizardry-i-proving-grounds-disk-1.dsk", boot],
		["wizardry-i-proving-grounds-disk-2.dsk", scenario],
	]));
	assert.equal(booted, "wizardry-i-proving-grounds-disk-1.dsk");
	assert.equal(mounted.get("wizardry-i-proving-grounds-disk-2.dsk"), scenario);
	const people = play.exportPeople();
	assert.match(people.get("characters/jib/CHARACTER.yml") ?? "", /JIB/);
	play.importPeople(people);
	assert.deepEqual(mounted.get("wizardry-i-proving-grounds-disk-2.dsk"), scenario);

	const forth = new Play(machine, HOPKINS_FORTH);
	forth.start(new Map([["forth.po", new Uint8Array(143360)]]));
	assert.equal(booted, "forth.po");
});
