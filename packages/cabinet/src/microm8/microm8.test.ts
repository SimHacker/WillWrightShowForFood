import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, test } from "node:test";
import { Dos33Volume } from "../apple2/dos33.js";
import { appleKey, FRAME_BYTES, textRows, type MicroM8 } from "./microm8.js";
import { haveMicroM8, startMicroM8Node } from "./node.js";

const DOS33 = new URL("../../disks/apple2/dos33/dos-3.3-january-1983.dsk", import.meta.url);

test("microm8: keys map to Apple codes", () => {
	assert.equal(appleKey({ key: "a" }), 0x61);
	assert.equal(appleKey({ key: "Enter" }), 13);
	assert.equal(appleKey({ key: "ArrowRight" }), 21);
	assert.equal(appleKey({ key: "c", ctrlKey: true }), 3);
	assert.equal(appleKey({ key: "r", metaKey: true }), null);
	assert.equal(appleKey({ key: "Shift" }), null);
	assert.equal(appleKey({ key: "a" }, true), 0x41);
	assert.equal(appleKey({ key: "1" }, true), 0x31);
	assert.equal(appleKey({ key: "c", ctrlKey: true }, true), 3);
	// Alt is a pushbutton held down; the key is the one under the finger, not Option's character.
	assert.equal(appleKey({ key: "ƒ", code: "KeyF", altKey: true }), 0x66);
	assert.equal(appleKey({ key: "Ï", code: "KeyF", altKey: true, shiftKey: true }), 0x46);
	assert.equal(appleKey({ key: "Dead", code: "KeyE", altKey: true }, true), 0x45);
	assert.equal(appleKey({ key: "¡", code: "Digit1", altKey: true, shiftKey: true }), 0x21);
	assert.equal(appleKey({ key: "«", code: "Backslash", altKey: true }), 0x5c);
	assert.equal(appleKey({ key: "x", code: "KeyX", altKey: true, ctrlKey: true }), 0x18);
	assert.equal(appleKey({ key: "Enter", code: "Enter", altKey: true }), 13);
});

test("microm8: the text page reads in Apple row order, inverse and flashing as plain", () => {
	const page = new Uint8Array(0x400).fill(0xa0);
	page.set([0xc8, 0xc9], 0); // row 0, normal "HI"
	page.set([0x01, 0x42], 0x80); // row 1, inverse A, flashing B
	page.set([0xda], 0x28 + 0x380 + 39); // row 15, last column, normal Z
	const rows = textRows(page);
	assert.equal(rows[0]!.trimEnd(), "HI");
	assert.equal(rows[1]!.trimEnd(), "AB");
	assert.equal(rows[15]!.at(-1), "Z");
});

describe("microm8 module", { skip: !haveMicroM8() && "microm8/dist not built" }, () => {
	let m: MicroM8;
	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
	const until = async (what: string, ok: () => boolean, seconds = 30) => {
		for (let t = 0; t < seconds * 10; t++) {
			if (ok()) return;
			await sleep(100);
		}
		assert.fail(`timed out waiting for ${what}:\n${m.text().join("\n")}`);
	};
	const screen = () => m.text().join("\n");

	before(async () => {
		m = await startMicroM8Node();
	});
	after(async () => {
		await m?.stop();
	});

	test("with no disk it is an Apple //e", async () => {
		await until("6502", () => m.status().pureBoot);
	});

	test("boots DOS 3.3 and lists its catalog", async () => {
		m.boot("dos33.dsk", new Uint8Array(readFileSync(DOS33)));
		await until("prompt", () => /COPYRIGHT APPLE/.test(screen()) && /^\]/m.test(screen()));
		m.type("CATALOG\n");
		await until("catalog", () => /\bHELLO\b/.test(screen()) && /\bMUFFIN\b/.test(screen()));
		const frame = new Uint8Array(FRAME_BYTES);
		await until("frame", () => m.frame(frame));
		assert.ok(frame.some((v, i) => i % 4 !== 3 && v > 0), "frame has lit pixels");
	});

	test("a program SAVEd by DOS comes back in the disk image", async () => {
		m.type('10 PRINT "WWSFF"\nSAVE WWSFF\n');
		await until("save", () => new Dos33Volume(m.disk("dos33.dsk")!).entries.some((e) => e.name === "WWSFF"), 60);
	});

	test("the bell comes out of the speaker", async () => {
		const samples = new Float32Array(48000);
		await sleep(500);
		m.audio(samples);
		m.type("PRINT CHR$(7)\n");
		let heard = 0;
		await until("bell", () => {
			const n = m.audio(samples);
			for (let i = 0; i < n; i++) if (samples[i]) heard++;
			return heard > 100;
		}, 10);
		assert.equal(m.audioRate(), 48000);
	});

	test("paddles and pushbuttons read back in Applesoft; POKEs set the annunciators", async () => {
		m.paddle(0, 200);
		m.paddle(3, 40);
		m.button(0, true);
		m.button(2, true);
		m.type("HOME:PRINT PDL(0);\" \";PDL(3);\" \";PEEK(49249);\" \";PEEK(49250);\" \";PEEK(49251)\n");
		let got: number[] = [];
		await until("game port line", () => {
			const line = m.text().find((l) => /^\d+ \d+ \d+ \d+ \d+/.test(l.trim()));
			if (line) got = line.trim().split(/\s+/).map(Number);
			return !!line;
		}, 10);
		const [p0, p3, b0, b1, b2] = got;
		assert.ok(Math.abs(p0! - 200) <= 4, `PDL(0) ${p0}`);
		assert.ok(Math.abs(p3! - 40) <= 4, `PDL(3) ${p3}`);
		assert.ok(b0! >= 128 && b1! < 128 && b2! >= 128, `buttons ${b0} ${b1} ${b2}`);
		m.button(0, false);
		m.button(2, false);

		m.type("POKE 49240,0:POKE 49243,0:POKE 49244,0:POKE 49247,0\n");
		await until("annunciators", () => m.annunciators() === 0b1010, 10);
		m.type("POKE 49241,0:POKE 49246,0\n");
		await until("AN0 on, AN3 off", () => m.annunciators() === 0b0011, 10);
	});
});
