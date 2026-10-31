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
});
