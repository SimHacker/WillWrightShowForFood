import assert from "node:assert/strict";
import test from "node:test";

import { Cabinet } from "./cabinet.js";
import { hoverAt, strokeText } from "./hover.js";
import { Monitor } from "./monitor.js";
import { Clock } from "./plugins/clock.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { Teletype } from "./plugins/teletype.js";
import { TinyTitan } from "./plugins/tiny-titan.js";
import { charText, Type340 } from "./plugins/type340.js";
import { loadSymelec } from "./symelec-fixtures.js";

test("monitor: symbols, offsets, peek and poke, arrays, bad input", () => {
	const cpu = new Pdp7({ coreWords: 8192 });
	const pokes: [number, readonly number[]][] = [];
	const m = new Monitor({
		memory: cpu,
		symbols: [
			{ name: "fuel", addr: 0o100 },
			{ name: "V", addr: 0o102 },
		],
		onPoke: (a, w) => pokes.push([a, w]),
	});
	assert.equal(m.resolve("fuel"), 0o100);
	assert.equal(m.resolve("FUEL"), 0o100, "case-folded when there is no exact match");
	assert.equal(m.resolve("fuel+2"), 0o102);
	assert.equal(m.resolve("v-2"), 0o100);
	assert.equal(m.resolve("5641"), 0o5641, "bare digits are octal");
	assert.equal(m.resolve(20000), 20000 % 8192, "numbers wrap to core");
	assert.equal(m.resolve("nope"), undefined);
	assert.equal(m.resolve("fuel+9"), undefined, "9 is not an octal digit");

	assert.equal(m.poke("fuel", 0o777), 0o100);
	assert.equal(m.peek("fuel"), 0o777);
	m.poke("fuel+1", [1, 2, -1]);
	assert.deepEqual(m.peekWords("fuel+1", 3), [1, 2, 0o777776], "-1 goes in as ones' complement");
	m.poke(0o200, 0o1777777);
	assert.equal(m.peek(0o200), 0o777777, "masked to 18 bits");
	assert.equal(m.poke("nope", 1), undefined);
	assert.equal(pokes.length, 3, "only pokes that landed are reported");
	assert.deepEqual(pokes[1], [0o101, [1, 2, 0o777776]]);

	assert.equal(m.label(0o100), "fuel");
	assert.equal(m.label(0o101), "fuel+1");
	assert.equal(m.label(0o77), "77", "below every symbol: octal");
});

test("char codes spell text", () => {
	assert.equal([0o20, 0o11, 0o30, 0o11, 0o05].map(charText).join(""), "PIXIE");
	assert.equal(charText(0o101), "a");
	assert.equal(charText(0o63), "3");
});

test("hover: SYMELEC's display list names its own lightbuttons", () => {
	const cpu = new Pdp7({ coreWords: 8192 });
	loadSymelec(cpu, ["pix", "core8k"]);
	const t = new Type340({ fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w) });
	const box = new Cabinet({ cpu, devices: [t, new Teletype({ printCycles: 1000 }), new Clock({ cpu }), new TinyTitan()] });
	t.clock = () => box.cycles;
	cpu.pc = 0o22;
	for (let i = 0; i < 40; i += 1) box.run(100_000);
	const segs = t.lastFrame?.segments ?? [];

	const groups = new Map<number, string>();
	for (const s of segs) if (s.intensify && s.subr >= 0) groups.set(s.subr, "");
	for (const k of groups.keys()) groups.set(k, strokeText(segs.filter((s) => s.subr === k)));
	const names = [...groups.values()];
	for (const b of ["DR", "HV", "RU", "SF", "PO", "AT", "IN", "SC", "CA", "RE", "RO", "EN", "PIXIE"]) {
		assert.ok(names.includes(b), `the ${b} lightbutton is its own group`);
	}
	assert.equal(groups.get(0o53), "S", "ring slot LBD+4 is S, start segment");
	assert.equal(groups.get(0o116), "S", "ring slot LBD+47 is the other S, the switch symbol");

	const pixie = segs.find((s) => s.subr === 0o5266)!;
	const h = hoverAt(segs, pixie.x0, pixie.y0)!;
	assert.equal(h.text, "PIXIE");
	assert.ok(h.box.x1 < 200, "the name's group stops at its stop code, not in WAREA's box");
	assert.ok(h.group.every((s) => s.pen), "lightbuttons are pen-enabled");

	const cross = segs.find((s) => s.block === 0o5637)!;
	const c = hoverAt(segs, cross.x0, cross.y0)!;
	assert.equal(c.key, 0o5307, "the cross stays one DDS block through its vector escapes");
	assert.equal(c.group.length, segs.filter((s) => s.intensify && s.subr === 0o5307).length);
});
