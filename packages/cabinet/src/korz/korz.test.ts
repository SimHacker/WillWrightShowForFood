import assert from "node:assert/strict";
import { test } from "node:test";
import { AmbiguityError, bits, Sea, span } from "./korz.js";

type C = { addr: number; who: number; value: number };
const dims = [{ name: "addr", width: 8 }, { name: "who", width: 2, names: ["cpu", "device", "debugger"] }];
const ctx = (addr: number, who = 0): C => ({ addr, who, value: 0 });

test("korz: the most specific slot runs, next reaches the rest of the chain", () => {
	const sea = new Sea<C>(dims);
	sea.install([
		{ selector: "read", by: "ram", run: () => 1 },
		{ selector: "read", guard: { addr: span(0xc0, 16) }, by: "soft switches", run: (_, next) => 100 + next() },
		{ selector: "read", guard: { addr: 0xc0 }, by: "keyboard", run: (_, next) => 1000 + next() },
	]);
	assert.equal(sea.dispatch("read", ctx(0x10)), 1);
	assert.equal(sea.dispatch("read", ctx(0xc5)), 101);
	assert.equal(sea.dispatch("read", ctx(0xc0)), 1101);
});

test("korz: layers run outermost first, whatever their specificity", () => {
	const sea = new Sea<C>(dims);
	const log: string[] = [];
	sea.install([
		{ selector: "read", by: "ram", run: () => { log.push("ram"); return 7; } },
		{ selector: "read", guard: { addr: 0x20 }, layer: "patch", by: "patch", run: (_, n) => { log.push("patch"); return n() + 1; } },
		{ selector: "read", layer: "observe", by: "trace", run: (_, n) => { log.push("trace"); return n(); } },
	]);
	assert.equal(sea.dispatch("read", ctx(0x20)), 8);
	assert.deepEqual(log, ["trace", "patch", "ram"]);
});

test("korz: enum names, masks and lists are guards", () => {
	const sea = new Sea<C>(dims);
	sea.install([
		{ selector: "read", by: "ram", run: () => 0 },
		{ selector: "read", guard: { who: "debugger" }, by: "peek", run: () => 9 },
		{ selector: "read", guard: { addr: bits(0x0f, 0x0f), who: ["cpu", "device"] }, by: "odd tails", run: () => 5 },
	]);
	assert.equal(sea.dispatch("read", ctx(0x3f, 2)), 9);
	assert.equal(sea.dispatch("read", ctx(0x3f, 0)), 5);
	assert.equal(sea.dispatch("read", ctx(0x3e, 1)), 0);
});

test("korz: overlapping guards, neither inside the other, fail at install unless a third covers the overlap", () => {
	const sea = new Sea<C>(dims);
	sea.install([{ selector: "read", by: "ram", run: () => 0 }]);
	const a = { selector: "read", guard: { addr: span(0xb0, 16) }, by: "card A", run: () => 1 };
	const b = { selector: "read", guard: { who: "cpu" }, by: "card B", run: () => 2 };
	assert.throws(() => sea.install([a, b]), AmbiguityError);
	assert.equal(sea.slots("read").length, 1, "the failed install left nothing behind");
	const both = { selector: "read", guard: { addr: span(0xb0, 16), who: "cpu" }, by: "arbiter", run: () => 3 };
	sea.install([a, b, both]);
	assert.equal(sea.dispatch("read", ctx(0xb4, 0)), 3);
	assert.equal(sea.dispatch("read", ctx(0xb4, 1)), 1);
	assert.equal(sea.dispatch("read", ctx(0x04, 0)), 2);
});

test("korz: equal guards replace when the installer is the same, conflict when not", () => {
	const sea = new Sea<C>(dims);
	sea.install([{ selector: "read", by: "ram", run: () => 0 }]);
	sea.install([{ selector: "read", guard: { addr: 1 }, by: "rom", run: () => 1 }]);
	const g = sea.generation;
	sea.install([{ selector: "read", guard: { addr: 1 }, by: "rom", run: () => 2 }]);
	assert.equal(sea.dispatch("read", ctx(1)), 2);
	assert.ok(sea.generation > g);
	assert.throws(() => sea.install([{ selector: "read", guard: { addr: 1 }, by: "other", run: () => 3 }]), AmbiguityError);
	assert.equal(sea.remove("rom"), 1);
	assert.equal(sea.dispatch("read", ctx(1)), 0);
});

test("korz: why says which slot ran and what ruled the others out; view finds slots by guard", () => {
	const sea = new Sea<C>(dims);
	sea.install([
		{ selector: "read", by: "ram", run: () => 0 },
		{ selector: "read", guard: { addr: span(0xc0, 16) }, by: "soft switches", run: (_, n) => n() },
		{ selector: "read", guard: { who: "debugger" }, layer: "observe", by: "peek", run: (_, n) => n() },
	]);
	const why = sea.why("read", ctx(0xc3));
	assert.deepEqual(why.map((w) => [w.slot, w.order]), [["ram", 1], ["soft switches", 0], ["peek", -1]]);
	assert.match(why[2]!.reason, /who = 0/);
	assert.deepEqual(sea.view({ addr: 0xc8 }).map((s) => s.by), ["ram", "soft switches", "peek"]);
	assert.deepEqual(sea.view({ addr: 0x08, who: 0 }).map((s) => s.by), ["ram"]);
});
