import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { assemble } from "./asm.js";
import { Cabinet } from "./cabinet.js";
import { assembleHilo, bootHilo, hiloDemo } from "./hilo.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { Teletype } from "./plugins/teletype.js";
import { DemoPlayer } from "./symelec-demo.js";

const program = assembleHilo(readFileSync(new URL("../tapes/hilo/hilo.s", import.meta.url), "utf8"));

function machine() {
	const cpu = new Pdp7({ coreWords: 8192 });
	const tty = new Teletype({ printCycles: 100 });
	const box = new Cabinet({ cpu, devices: [tty] });
	bootHilo(cpu, program);
	let mark = 0;
	/** What was printed since the last call. */
	const paper = (): string => {
		const all = tty.printed();
		const s = all.slice(mark);
		mark = all.length;
		return s;
	};
	const type = (s: string, cycles = 20_000): string => {
		for (const c of s) {
			tty.type(c.charCodeAt(0) | 0o200);
			box.run(2_000);
		}
		box.run(cycles);
		return paper();
	};
	const secret = (): number => cpu.read(program.symbols.get("secret") as number);
	return { cpu, tty, box, paper, type, secret };
}

test("asm: text is one KSR-33 code a word, upper case, eighth bit set", () => {
	const r = assemble([{ name: "t", text: '100/\nmsg,\ttext "Hi, 7/"\n\t0\n' }]);
	assert.deepEqual(r.errors, []);
	const w = new Map(r.words);
	assert.deepEqual([0o100, 0o101, 0o102, 0o103, 0o104, 0o105].map((a) => w.get(a)), [0o310, 0o311, 0o254, 0o240, 0o267, 0o257]);
	assert.equal(w.get(0o106), 0, "the next word follows the text");
});

test("hilo assembles clean and starts at 100", () => {
	assert.deepEqual(program.errors, []);
	assert.equal(program.start, 0o100);
});

test("hilo: banner, then a game played by halving, ended by RIGHT", () => {
	const m = machine();
	m.box.run(50_000);
	assert.match(m.paper(), /^HILO, FOR THE PDP-7 TELETYPE\.\r\nI THINK OF A NUMBER FROM 0 TO 99\. YOU GUESS IT\.\r\nPRESS RETURN TO START\.$/);
	assert.match(m.type("\r"), /^\r\nI HAVE ONE\.\r\nGUESS\? $/);
	const s = m.secret();
	assert.ok(s >= 0 && s <= 99, `secret ${s}`);
	let lo = 0;
	let hi = 99;
	for (let n = 1; n <= 7; n += 1) {
		const g = (lo + hi) >> 1;
		const out = m.type(`${g}\r`);
		if (g === s) {
			assert.match(out, new RegExp(`^\\nRIGHT\\. GUESSES: ${n}\\r\\nRETURN TO PLAY AGAIN\\.$`));
			return;
		}
		assert.match(out, g < s ? /^\nHIGHER\.\r\nGUESS\? $/ : /^\nLOWER\.\r\nGUESS\? $/);
		if (g < s) lo = g + 1;
		else hi = g - 1;
	}
	assert.fail("seven halvings did not find it");
});

test("hilo: an empty line asks again, and letters in a number are skipped", () => {
	const m = machine();
	m.box.run(50_000);
	m.type("\r");
	assert.equal(m.type("\r"), "\nGUESS? ", "no digits: ask again");
	const s = m.secret();
	const g = s === 42 ? 41 : 42;
	const out = m.type(`X${Math.floor(g / 10)}Y${g % 10}\r`);
	assert.match(out, g < s ? /^\nHIGHER\./ : /^\nLOWER\./, `X4Y2 reads as ${g}`);
});

test("hilo: the counter behind the number moves while the program waits", () => {
	const a = machine();
	a.box.run(50_000);
	a.type("\r", 20_000);
	const b = machine();
	b.box.run(50_000 + 3_000);
	b.type("\r", 20_000);
	assert.notEqual(a.secret(), b.secret(), "a key 3000 cycles later picks another number");
});

test("hilo demo: the scripted operator finds the number", () => {
	const cpu = new Pdp7({ coreWords: 8192 });
	const tty = new Teletype({ printCycles: 1000 });
	const box = new Cabinet({ cpu, devices: [tty] });
	bootHilo(cpu, program);
	const player = new DemoPlayer(hiloDemo({ cpu, type: (s) => { for (const c of s) tty.type(c.charCodeAt(0) | 0o200); } }, program));
	let spent = 0;
	while (!player.done && spent < 20_000_000) spent += player.advance((n) => box.run(n), 20_000);
	assert.ok(player.done);
	assert.match(tty.printed(), /RIGHT\. GUESSES: [1-7]\r\n/);
});
