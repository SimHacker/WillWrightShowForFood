import assert from "node:assert/strict";
import { test } from "node:test";
import { lifeGeneration, lifeHost } from "./ca.js";
import { deviceSlots, type Unit } from "./device.js";
import { AmbiguityError, Sea } from "./korz.js";
import { KorzPdp7 } from "./pdp7.js";
import { binaryIncrementer, BLANK, decodeDoor, doorWord, L, ONE, R, TmTape, ZERO } from "./tm.js";

test("cpu host: the PDP-7's rung and its three contexts come from the host", () => {
	const interpreted = new KorzPdp7({ korz: "interpret" });
	assert.equal(interpreted.host.rung, "interpret");
	assert.equal(interpreted.host.nest.ix.cpu, interpreted);
	assert.notEqual(interpreted.host.nest.ix, interpreted.host.nest.mem);
	assert.notEqual(interpreted.host.nest.mem, interpreted.host.nest.io);
	assert.equal(new KorzPdp7().host.rung, "resolve");
	assert.equal(new KorzPdp7({ korz: "compile" }).host.rung, "compile");
});

test("life: B3/S23, and the interpreter and the resolver agree", () => {
	const slow = lifeHost("interpret");
	const fast = lifeHost("resolve");
	const stay = (center: number, n: number) => (center === 1 && (n === 2 || n === 3)) || (center === 0 && n === 3) ? 1 : 0;
	for (let center = 0; center < 2; center += 1) {
		for (let n = 0; n < 9; n += 1) {
			const c = { center, nb: 0, n };
			assert.equal(slow.sea.dispatch("cell", c), stay(center, n));
			assert.equal(fast.go.cell(c), stay(center, n));
		}
	}
	const w = 5;
	const rows = (picture: string) => {
		const cells = new Uint8Array(w * w);
		picture.split("\n").forEach((row, y) => [...row].forEach((ch, x) => { cells[y * w + x] = ch === "#" ? 1 : 0; }));
		return cells;
	};
	const show = (cells: Uint8Array) => {
		const lines: string[] = [];
		for (let y = 0; y < w; y += 1) {
			let s = "";
			for (let x = 0; x < w; x += 1) s += cells[y * w + x] ? "#" : ".";
			lines.push(s);
		}
		return lines.join("\n");
	};
	const blinker = rows(".....\n.###.\n.....\n.....\n.....");
	const upright = "..#..\n..#..\n..#..\n.....\n.....";
	assert.equal(show(lifeGeneration(fast, w, w, blinker)), upright);
	assert.equal(show(lifeGeneration(slow, w, w, rows(upright))), show(blinker));
	const block = rows(".....\n.##..\n.##..\n.....\n.....");
	assert.equal(show(lifeGeneration(fast, w, w, block)), show(block));
});

type BusCtx = { code: number; ac: number; skip: number };
type Reply = { ac: number; skip?: boolean };

test("device kit: slots, a plain call, and power off", () => {
	const seen: string[] = [];
	const lamp = { power: true, ac: 0 };
	const slotted: Unit<BusCtx, undefined, BusCtx, Reply> = {
		name: "lamp",
		codes: [1],
		get power() { return lamp.power; },
		slots: () => [{ selector: "io", guard: { code: 1 }, by: "lamp on", run: (c) => { seen.push("on"); c.ac = 7; } }],
		off: () => ({ ac: 0 }),
	};
	const plain: Unit<BusCtx, undefined, BusCtx, Reply> = {
		name: "bell",
		codes: [2],
		call: (c) => { seen.push("bell"); return { ac: c.ac + 1, skip: true }; },
	};
	const specs = deviceSlots({
		selector: "io",
		code: "code",
		bus: undefined,
		units: [slotted, plain],
		request: (c) => c,
		reply: (c, answer) => { c.ac = answer.ac; if (answer.skip) c.skip = 1; },
		silent: (c) => ({ ac: c.ac }),
		busSlots: [{ selector: "io", by: "unclaimed", run: () => { seen.push("idle"); } }],
		plainBy: (name) => `device ${name}: call()`,
	});
	const sea = new Sea<BusCtx>([{ name: "code", width: 4 }]);
	sea.install(specs);
	const go = (code: number) => {
		const c: BusCtx = { code, ac: 3, skip: 0 };
		sea.dispatch("io", c);
		return c;
	};
	assert.deepEqual(seen.splice(0), []);
	assert.deepEqual(go(1), { code: 1, ac: 7, skip: 0 });
	assert.deepEqual(seen, ["on"]);
	lamp.power = false;
	assert.deepEqual(go(1), { code: 1, ac: 0, skip: 0 });
	assert.deepEqual(go(2), { code: 2, ac: 4, skip: 1 });
	assert.deepEqual(go(9), { code: 9, ac: 3, skip: 0 });
	const other: Unit<BusCtx, undefined, BusCtx, Reply> = { name: "other", codes: [2], call: () => ({ ac: 0 }) };
	assert.throws(() => sea.install(deviceSlots({
		selector: "io", code: "code", bus: undefined, units: [other],
		request: (c) => c, reply: () => {}, silent: (c) => ({ ac: c.ac }),
	})), AmbiguityError);
});

test("turing: a binary incrementer, as a sea and as the engine's words", () => {
	const rule = binaryIncrementer();
	const words = rule.tabulate(3, 4);
	for (let q = 0; q < 3; q += 1)
		for (let s = 0; s < 4; s += 1) assert.equal(words[q * 4 + s], binaryIncrementer("interpret").door(q, s));
	assert.equal(words[0], 0);
	assert.equal(words[1 * 4 + BLANK], doorWord(L, BLANK, 2));
	assert.equal(words[1 * 4 + ONE], doorWord(R, ONE, 1));
	assert.equal(decodeDoor(words[2 * 4 + ONE]!).move, L);
	const why = rule.host.sea.why("door", { state: 0, sym: ONE });
	assert.equal(why.find((line) => line.order === 0)?.slot, "no transition");

	const inc = (digits: string) => {
		const tape = new TmTape(rule, { cells: [...digits].map((ch) => (ch === "1" ? ONE : ZERO)) });
		assert.equal(tape.run(), "halt");
		return tape.text();
	};
	assert.equal(inc("0"), "1");
	assert.equal(inc("1"), "10");
	assert.equal(inc("11"), "100");
	assert.equal(inc("111"), "1000");
	assert.equal(new TmTape(rule, { state: 0, cells: [ONE] }).step(), "halt");
});
