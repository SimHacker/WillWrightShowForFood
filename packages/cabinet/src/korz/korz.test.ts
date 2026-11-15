import assert from "node:assert/strict";
import { test } from "node:test";
import { AmbiguityError, bits, Sea, span, TABLE_LIMIT } from "./korz.js";

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

for (const limit of [TABLE_LIMIT, 160])
test(`korz: the resolved table gives the interpreter's answer, errors included, on random seas, limit ${limit}`, () => {
	let seed = 7;
	let byKind = 0;
	const r = (n: number): number => {
		seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;
		return (seed >>> 8) % n;
	};
	const run = (by: string) => (c: C, next: () => number): number => (c.addr & 3) === 0 ? next() * 3 + by.length : by.length;
	for (let trial = 0; trial < 60; trial += 1) {
		const sea = new Sea<C>(dims);
		sea.install([{ selector: "read", by: "base", run: () => 1 }]);
		for (let k = 0; k < 12; k += 1) {
			const guard = r(3) === 0 ? { addr: bits(0xf0, r(16) << 4), who: r(3) } : r(2) ? { addr: span(r(200), 1 + r(56)) } : { addr: r(256) };
			const layer = (["observe", "patch", "machine"] as const)[r(3)]!;
			try {
				sea.install([{ selector: "read", guard, layer, by: `s${trial}.${k}`, run: run(`s${trial}.${k}`) }]);
			} catch {
				// ambiguous at install: skip it
			}
		}
		const resolved = sea.resolve("read", limit);
		if (resolved === null) continue;
		if (Object.keys(resolved.kinds).length > 0) byKind += 1;
		for (let addr = 0; addr < 256; addr += 1)
			for (let who = 0; who < 3; who += 1) {
				const c = ctx(addr, who);
				let a: string;
				let b: string;
				try { a = String(sea.dispatch("read", c)); } catch (e) { a = (e as Error).message; }
				try { b = String(resolved.call(c)); } catch (e) { b = (e as Error).message; }
				if (a !== b) assert.equal(b, a, `trial ${trial} at ${addr} ${who}`);
			}
	}
	if (limit < TABLE_LIMIT) assert.ok(byKind >= 30, `${byKind} tables by kind`);
});

test("korz: a wide dimension with a few special values is indexed by kind", () => {
	const sea = new Sea<C>([{ name: "addr", width: 18 }, ...dims.slice(1)]);
	sea.install([
		{ selector: "read", by: "ram", run: () => 1 },
		{ selector: "read", guard: { addr: 0o1234, who: "cpu" }, by: "watch", run: (_, next) => 10 + next() },
		{ selector: "read", guard: { addr: [0o1234, 0o4321] }, layer: "observe", by: "count", run: (_, next) => 100 + next() },
	]);
	const r = sea.resolve("read")!;
	assert.deepEqual(r.kinds, { addr: 3 });
	assert.equal(r.size, 12);
	assert.deepEqual(sea.shape("read"), { dims: ["addr", "who"], size: 12, table: true, kinds: { addr: 3 } });
	const go = {} as { read: (c: C) => number };
	sea.bind(go, ["read"]);
	assert.equal(go.read(ctx(0o1234)), 111);
	assert.equal(go.read(ctx(0o1234, 1)), 101);
	assert.equal(go.read(ctx(0o4321)), 101);
	assert.equal(go.read(ctx(0o7777)), 1);
});

test("korz: a dispatcher rebuilds its table after an install, and drops irrelevant dimensions", () => {
	const sea = new Sea<C>(dims);
	sea.install([{ selector: "read", by: "ram", run: () => 0 }]);
	const read = sea.dispatcher("read");
	assert.equal(read(ctx(0xc0)), 0);
	assert.equal(sea.resolve("read")!.size, 1);
	sea.install([{ selector: "read", guard: { addr: 0xc0 }, by: "keyboard", run: () => 0x41 }]);
	assert.equal(read(ctx(0xc0)), 0x41);
	const r = sea.resolve("read")!;
	assert.deepEqual(r.dims, ["addr"]);
	assert.equal(r.size, 256);
	assert.equal(r.chains, 2);
});

test("korz: bind swaps in new tables after install and remove; too large a table falls back to the interpreter", () => {
	const sea = new Sea<C>(dims);
	sea.install([{ selector: "read", by: "ram", run: () => 0 }]);
	const go = {} as { read: (c: C) => number };
	sea.bind(go, ["read"]);
	assert.equal(go.read(ctx(5)), 0);
	const [watch] = sea.install([{ selector: "read", guard: { addr: 5 }, layer: "observe", by: "watch", run: (_, n) => n() + 100 }]);
	assert.equal(go.read(ctx(5)), 100);
	assert.equal(go.read(ctx(6)), 0);
	sea.remove(watch!);
	assert.equal(go.read(ctx(5)), 0);
	assert.equal(sea.resolve("read", 1)!.size, 1, "no slot guards addr now");
	sea.install([{ selector: "read", guard: { addr: 5 }, by: "rom", run: () => 7 }]);
	assert.equal(sea.resolve("read", 1), null);
	const small = {} as { read: (c: C) => number };
	sea.bind(small, ["read"], 1);
	assert.equal(small.read(ctx(5)), 7);
});
