import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Cabinet } from "./cabinet.js";
import { assembleLander, bootLander, LANDER, type LanderState, landerDemo, landerPilot, landerStep } from "./lander.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { Teletype } from "./plugins/teletype.js";
import { DemoPlayer } from "./symelec-demo.js";

const program = assembleLander(readFileSync(new URL("../tapes/lander/lander.s", import.meta.url), "utf8"));

function machine() {
	const cpu = new Pdp7({ coreWords: 8192 });
	const tty = new Teletype({ printCycles: 100 });
	const box = new Cabinet({ cpu, devices: [tty] });
	bootLander(cpu, program);
	let mark = 0;
	const paper = (): string => {
		const all = tty.printed();
		const s = all.slice(mark);
		mark = all.length;
		return s;
	};
	const type = (s: string, cycles = 60_000): string => {
		for (const c of s) {
			tty.type(c.charCodeAt(0) | 0o200);
			box.run(2_000);
		}
		box.run(cycles);
		return paper();
	};
	box.run(100_000);
	return { cpu, paper, type };
}

const alt = (h2: number): string => `${h2 >> 1}${h2 & 1 ? ".5" : ""}`;
const line = (s: LanderState): string => `T ${s.secs}  ALT ${alt(s.h2)}  VEL ${s.v}  FUEL ${s.fuel}`;
const rating = (vi: number): string =>
	vi < 3 ? "PERFECT LANDING." : vi < 10 ? "GOOD LANDING." : vi < 30 ? "HARD LANDING. THE LEGS ARE BENT." : "CRASHED.";

/** Fly a list of burns on the machine and on the model; the paper must match line for line. */
function flyBoth(burns: number[]): { paper: string; contact: number } {
	const m = machine();
	assert.match(m.paper(), /^LANDER, FOR THE PDP-7 TELETYPE\.\r\n[\s\S]*PRESS RETURN TO START\.$/);
	let s: LanderState = { h2: LANDER.h2, v: LANDER.v, fuel: LANDER.fuel, secs: 0 };
	let out = m.type("\r");
	assert.equal(out, `\r\n${line(s)}  BURN? `);
	let all = out;
	for (const b of burns) {
		const r = landerStep(s, b);
		out = m.type(`${b}\r`);
		all += out;
		if (r.contact !== null) {
			assert.equal(out, `\nCONTACT AT ${r.contact} FT/S, ${r.state.fuel} UNITS LEFT.\r\n${rating(r.contact)}\r\nRETURN TO FLY AGAIN.`);
			return { paper: all, contact: r.contact };
		}
		s = r.state;
		if (s.fuel === 0) {
			const f = landerStep(s, 0).contact as number;
			assert.equal(out, `\n${line(s)}\r\nOUT OF FUEL.\r\nCONTACT AT ${f} FT/S, 0 UNITS LEFT.\r\n${rating(f)}\r\nRETURN TO FLY AGAIN.`);
			return { paper: all, contact: f };
		}
		assert.equal(out, `\n${line(s)}  BURN? `, `after burn ${b}`);
	}
	throw new Error("still flying");
}

test("lander assembles clean and starts at 100", () => {
	assert.deepEqual(program.errors, []);
	assert.equal(program.start, 0o100);
});

test("lander: free fall from 500 feet at 50 ft/s meets the ground at 86 ft/s", () => {
	assert.equal(flyBoth(Array(20).fill(0)).contact, 86, "sqrt(50^2 + 2*5*500) = 86.02");
});

test("lander: the tracking pilot lands, and the machine agrees with the model every second", () => {
	const m = machine();
	m.type("\r");
	let s: LanderState = { h2: LANDER.h2, v: LANDER.v, fuel: LANDER.fuel, secs: 0 };
	const burns: number[] = [];
	for (;;) {
		const b = landerPilot(s);
		burns.push(b);
		const r = landerStep(s, b);
		if (r.contact !== null || r.state.fuel === 0) break;
		s = r.state;
	}
	const { contact } = flyBoth(burns);
	assert.ok(contact < 3, `pilot landed at ${contact} ft/s with burns ${burns.join(" ")}`);
});

test("lander: random burns, including burning more than is left, match the model", () => {
	let seed = 7;
	const rand = (n: number): number => {
		seed = (seed * 1103515245 + 12345) % 2147483648;
		return seed % n;
	};
	for (let game = 0; game < 12; game += 1) flyBoth(Array.from({ length: 40 }, () => rand(31)));
});

test("lander: over 30 is refused and asked again; Return alone burns nothing", () => {
	const m = machine();
	m.type("\r");
	assert.equal(m.type("31\r"), "\n30 AT MOST.\r\nT 0  ALT 500  VEL -50  FUEL 60  BURN? ");
	assert.equal(m.type("99999999\r"), "\n30 AT MOST.\r\nT 0  ALT 500  VEL -50  FUEL 60  BURN? ", "a long number does not wrap");
	assert.equal(m.type("\r"), "\nT 1  ALT 447.5  VEL -55  FUEL 60  BURN? ");
});

test("lander: a burn that touches down and lifts off inside one second is a landing", () => {
	// 1 foot up at -20 ft/s, burn 30: a = 55, h(t) = 1 - 20t + 27.5t^2 is -2.6 at its low point, t = 0.36.
	const r = landerStep({ h2: 2, v: -20, fuel: 60, secs: 0 }, 30);
	assert.ok(r.state.h2 > 0 && r.state.v > 0, "ends the second above the surface, rising");
	assert.equal(r.contact, 17, "sqrt(400 - 55*2) = 17.03 is the touchdown speed");
	const clear = landerStep({ h2: 4, v: -10, fuel: 60, secs: 0 }, 30);
	assert.equal(clear.contact, null, "2 feet at -10 ft/s with burn 30 turns around at 1.1 feet");
});

test("lander demo: the scripted pilot lands", () => {
	const cpu = new Pdp7({ coreWords: 8192 });
	const tty = new Teletype({ printCycles: 1000 });
	const box = new Cabinet({ cpu, devices: [tty] });
	bootLander(cpu, program);
	const player = new DemoPlayer(landerDemo({ cpu, type: (s) => { for (const c of s) tty.type(c.charCodeAt(0) | 0o200); } }, program));
	let spent = 0;
	while (!player.done && spent < 40_000_000) spent += player.advance((n) => box.run(n), 20_000);
	assert.ok(player.done);
	assert.match(tty.printed(), /CONTACT AT [0-2] FT\/S, \d+ UNITS LEFT\.\r\nPERFECT LANDING\./);
});
