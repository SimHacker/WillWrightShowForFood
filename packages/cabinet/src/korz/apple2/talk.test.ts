import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { Korz6502 } from "../m6502.js";
import { DiskII } from "./disk2.js";
import { Apple2Plus } from "./plus.js";
import { COUT1, ScreenTalk, Talk, speakable, textRows } from "./talk.js";

const file = (p: string): Uint8Array => new Uint8Array(readFileSync(new URL(`../../../${p}`, import.meta.url)));

const say = (t: Talk, text: string, at: number, waiting = false) => {
	for (const ch of text) t.print(ch.charCodeAt(0) | 0x80, at++, waiting);
	return at;
};

test("talk: an echo is the key the program read, printed next; the rest is said", () => {
	const t = new Talk({ quiet: 100 });
	let at = say(t, "WHAT NOW?", 0);
	t.key(0x6e, at);
	at = say(t, "N", at, true);
	at = say(t, "N", at);
	t.key(0x0d, at);
	at = say(t, "\r", at);
	assert.deepEqual(
		t.take(at),
		{ said: ["WHAT NOW?N"], typed: ["N"] },
		"an N printed while the key waits is the program's; the echo, with its Return, is what was typed, and the Return ends the line"
	);
	t.key(0x41, at);
	at = say(t, "B", at);
	assert.deepEqual(t.take(at + 200), { said: ["B"], typed: [] }, "a key read and not echoed is forgotten, and a quiet line is said");
	assert.equal(speakable("I'M IN A FOREST.   ------"), "i'm in a forest.");
	assert.equal(speakable("Hello THERE"), "Hello THERE");
});

function apple(disk?: string) {
	const board = new Apple2Plus(file("roms/apple2/apple2plus.rom"));
	board.installLanguageCard();
	if (disk) {
		const drives = new DiskII(file("roms/apple2/diskii.rom"));
		drives.insert(1, file(disk), disk);
		board.plug(6, drives);
	}
	const cpu = new Korz6502(board, { korz: "compile" });
	cpu.reset();
	return { board, cpu };
}

test("talk: Applesoft says what it prints, and what was typed is the echo", () => {
	const { board, cpu } = apple();
	const t = new Talk();
	const run = (n: number) => {
		for (const end = board.cycles + n; board.cycles < end; ) {
			cpu.step();
			if (cpu.pc === COUT1) t.print(cpu.a, board.cycles, board.key >= 0x80);
		}
	};
	run(3e6);
	for (const ch of 'PRINT "HELLO"\r') {
		board.press(ch.charCodeAt(0));
		t.key(ch.charCodeAt(0), board.cycles);
		run(60_000);
	}
	run(1e6);
	const { said, typed } = t.take(board.cycles);
	assert.deepEqual(typed, ['PRINT "HELLO"']);
	assert.ok(said.includes("HELLO"), said.join(" | "));
	assert.ok(!said.some((s) => s.includes("PRINT")), "the echo is not said");
});

test("talk: Adventureland draws its own text, and the screen is read", () => {
	const { board, cpu } = apple("disks/apple2/collection/scott-adams/adventures-1-5.dsk");
	const t = new ScreenTalk();
	const said: string[] = [];
	const typed: string[] = [];
	const run = (n: number) => {
		for (let end = board.cycles + n, look = board.cycles; board.cycles < end; ) {
			cpu.step();
			if (board.cycles - look < 100_000) continue;
			look = board.cycles;
			t.look(textRows((a) => board.peek(a)), board.cycles);
			const h = t.take(board.cycles);
			said.push(...h.said);
			typed.push(...h.typed);
		}
	};
	const type = (keys: string) => {
		for (const ch of keys) {
			board.press(ch.charCodeAt(0));
			t.key(ch.charCodeAt(0));
			run(300_000);
		}
	};
	run(40e6);
	type("A");
	run(80e6);
	type("N\r");
	run(40e6);
	assert.ok(said.includes("I'LL BE YOUR PUPPET IN THIS ADVENTURE."), said.join(" | "));
	type("\r");
	run(40e6);
	assert.ok(said.includes("I'M IN A FOREST. VISIBLE ITEMS:"), said.join(" | "));
	type("GO NORTH\r");
	run(20e6);
	assert.deepEqual(typed, ["N", "GO NORTH"], "the menu's A was taken without an echo");
	assert.ok(!said.some((s) => s.includes("GO NORTH") || s.endsWith("? N")), `the echoes are not said: ${said.join(" | ")}`);
});
