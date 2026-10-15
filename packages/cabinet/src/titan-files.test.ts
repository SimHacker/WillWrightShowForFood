import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Cabinet } from "./cabinet.js";
import { assembleForthKernel, bootForth, compileForth } from "./forth.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { Teletype } from "./plugins/teletype.js";
import { type ByteStore, MemoryMount, ProcMount, StorageMount, TitanFiles, bytesToWords, textWords, wordsText, wordsToBytes } from "./plugins/titan-files.js";

/** localStorage, in a test. */
class FakeStorage implements ByteStore {
	m = new Map<string, string>();
	getItem(k: string) { return this.m.get(k) ?? null; }
	setItem(k: string, v: string) { this.m.set(k, v); }
	removeItem(k: string) { this.m.delete(k); }
	get length() { return this.m.size; }
	key(i: number) { return [...this.m.keys()][i] ?? null; }
}

const tape = (f: string) => readFileSync(new URL(`../tapes/${f}`, import.meta.url), "utf8");
const image = compileForth({
	kernel: assembleForthKernel({
		sop: tape("pdp7unix/sop.s"),
		kernel: tape("pdp7forth/kernel-names-full-extended.s"),
		end: tape("pdp7forth/end.s"),
		kernelName: "kernel-names-full-extended.s",
	}),
	sources: ["prelude.fs", "does.fs", "turtle.fs", "code.fs", "xmem-extended.fs", "files.fs"].map((f) => tape(`pdp7forth/${f}`)),
});

function machine(storage = new FakeStorage()) {
	const cpu = new Pdp7({ coreWords: 32768 });
	let paper = "";
	const tty = new Teletype({ printCycles: 100, onPrint: (c) => (paper += String.fromCharCode(c & 0o177)) });
	const files = new TitanFiles({
		core: cpu,
		mounts: {
			"/tmp": new MemoryMount(),
			"/browser": new StorageMount(storage, "test:"),
			"/proc": new ProcMount({ uptime: () => `${cpu.read(7)} ticks\n`, banks: () => `${cpu.coreWords / 8192}\n` }),
		},
	});
	const box = new Cabinet({ cpu, devices: [tty, files] });
	bootForth(cpu, image);
	box.run(300_000);
	/** Type a line; run until Forth answers, letting the host's promises settle between slices. */
	const line = async (text: string): Promise<string> => {
		const from = paper.length;
		for (const ch of `${text}\r`) tty.type(ch.toUpperCase().charCodeAt(0) | 0o200);
		for (let n = 0; n < 400 && !/ok\r\n$|\?\r\n$/.test(paper.slice(from)); n += 1) {
			box.run(20_000);
			await files.pending;
			await new Promise((r) => setImmediate(r));
		}
		return paper.slice(from);
	};
	return { cpu, files, storage, line };
}

test("titan-files: words written by name come back, from bank 0 and from high memory", async () => {
	const m = machine();
	await m.line("CREATE POSE 5 ALLOT  CREATE BACK 5 ALLOT");
	await m.line(": FILL 5 0 DO I 100 * 7 + POSE I + ! LOOP ;  FILL");
	assert.match(await m.line('S" /tmp/pose" POSE 5 0 WRITE-WORDS .'), / 5\s+ok/, "5 words written");
	assert.match(await m.line('S" /tmp/pose" FILE-SIZE .'), / 5\s+ok/);
	assert.match(await m.line('S" /tmp/pose" BACK 5 0 READ-WORDS .'), / 5\s+ok/);
	assert.match(await m.line("BACK 4 + @ ."), / 407\s+ok/, "and read back");
	assert.match(await m.line('S" /tmp/pose" BACK 9 3 READ-WORDS . BACK @ .'), / 2 307\s+ok/, "from an offset, as many as there are");
	for (let i = 0; i < 5; i += 1) m.cpu.write(24576 + i, 9000 + i);
	assert.match(await m.line('S" /tmp/high" 24576 5 0 WRITE-WORDS . S" /tmp/high" 16384 5 0 READ-WORDS .'), / 5 5\s+ok/);
	assert.equal(m.cpu.read(16384 + 4), 9004, "bank 3 to a file to bank 2, no copy through bank 0");
});

test("titan-files: /browser survives a reload, compressed when the name ends .gz", async () => {
	const storage = new FakeStorage();
	const a = machine(storage);
	await a.line("CREATE BIG 300 ALLOT  : FILL 300 0 DO 42 BIG I + ! LOOP ;  FILL");
	assert.match(await a.line('S" /browser/plain" BIG 300 0 WRITE-WORDS .'), / 300\s+ok/);
	assert.match(await a.line('S" /browser/small.gz" BIG 300 0 WRITE-WORDS .'), / 300\s+ok/);
	const plain = storage.getItem("test:plain")!.length;
	const small = storage.getItem("test:small.gz")!.length;
	assert.ok(small < plain / 10, `.gz is stored compressed: ${small} vs ${plain} characters`);
	const b = machine(storage); // a fresh PDP-7, the same browser storage
	await b.line("CREATE BACK 300 ALLOT");
	assert.match(await b.line('S" /browser/small.gz" BACK 300 0 READ-WORDS . BACK 299 + @ .'), / 300 42\s+ok/, "back after a reload, uncompressed");
	await b.line("CREATE NAMES 40 ALLOT");
	assert.match(await b.line('S" /browser" NAMES 40 LIST-FILES NAMES SWAP TYPE-WORDS'), /plain\r?\nsmall\.gz/);
	assert.match(await b.line('S" /browser/plain" DELETE-FILE . S" /browser/plain" FILE-SIZE .'), / 0 -1\s+ok/);
});

test("titan-files: /proc is made on demand and can't be written; bad paths are refused", async () => {
	const m = machine();
	m.cpu.write(7, 1234);
	await m.line("CREATE TXT 20 ALLOT");
	assert.match(await m.line('S" /proc/uptime" TXT 20 0 READ-WORDS TXT SWAP TYPE-WORDS'), /1234 ticks/);
	assert.match(await m.line('S" /proc/banks" TXT 20 0 READ-WORDS TXT SWAP TYPE-WORDS'), /4/);
	assert.match(await m.line('S" /proc/uptime" TXT 1 0 WRITE-WORDS .'), / -4\s+ok/, "read-only");
	assert.match(await m.line('S" /nowhere/x" FILE-SIZE .'), / -2\s+ok/, "no such mount");
	assert.match(await m.line('S" /tmp/../proc/uptime" FILE-SIZE .'), / -2\s+ok/, "no climbing out");
	assert.match(await m.line('S" /tmp/none" FILE-SIZE .'), / -1\s+ok/, "no such file");
});

test("titan-files: 18-bit words pack three bytes each, and text one character a word", () => {
	const w = Uint32Array.from([0, 1, 0o777777, 0o123456]);
	assert.deepEqual([...bytesToWords(wordsToBytes(w))], [...w]);
	assert.equal(wordsText(textWords("PDP-7\n")), "PDP-7\n");
});
