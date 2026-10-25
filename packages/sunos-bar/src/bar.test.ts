import { strict as assert } from "node:assert";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { BLOCK, headerChecksums, readBar } from "./bar.js";
import { safePath } from "./cli.js";
import { uncompress } from "./lzw.js";

// --- building bar archives the way bar.c writes them --------------------------------------

const enc = new TextEncoder();

function put(block: Uint8Array, at: number, text: string): void {
	block.set(enc.encode(text), at);
}

function sealChecksum(block: Uint8Array, signed = false): void {
	const sums = headerChecksums(block);
	put(block, 48, `${(signed ? sums.signed : sums.unsigned).toString(8).padStart(6, " ")}\0 `);
}

function volumeHeader(opts: { compressed?: boolean; label?: string } = {}): Uint8Array {
	const b = new Uint8Array(BLOCK);
	put(b, 24, "0");
	b[65] = 0x56; // 'V'
	put(b, 67, "1");
	b[71] = opts.compressed ? 0x31 : 0x30;
	put(b, 72, "9211121117");
	put(b, 84, `${opts.label ?? ""}\0`);
	sealChecksum(b);
	return b;
}

interface Spec {
	name: string;
	data?: Uint8Array;
	mode?: number;
	flag?: string;
	link?: string;
	size?: number;
	signed?: boolean;
}

/** A header (plus continuation blocks if the names don't fit) and the data, padded. */
function fileRecord(s: Spec): Uint8Array {
	const data = s.data ?? new Uint8Array(0);
	const names = enc.encode(`${s.name}\0${s.link ?? ""}\0`);
	const headerBlocks = Math.max(1, Math.ceil((84 + names.length) / BLOCK));
	const out = new Uint8Array(headerBlocks * BLOCK + Math.ceil(data.length / BLOCK) * BLOCK);
	const h = out.subarray(0, BLOCK);
	put(h, 0, `${(s.mode ?? 0o100644).toString(8).padStart(6, " ")} \0`);
	put(h, 8, "    17 \0");
	put(h, 16, "   222 \0");
	put(h, 24, `${(s.size ?? data.length).toString(8).padStart(11, " ")} `);
	put(h, 36, `${(694_000_000).toString(8).padStart(11, " ")} `);
	h[64] = (s.flag ?? "0").charCodeAt(0);
	out.set(names, 84);
	sealChecksum(h, s.signed);
	out.set(data, headerBlocks * BLOCK);
	return out;
}

function concat(...parts: Uint8Array[]): Uint8Array {
	const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
	let at = 0;
	for (const p of parts) {
		out.set(p, at);
		at += p.length;
	}
	return out;
}

const END = new Uint8Array(BLOCK * 2);

// --- tests -------------------------------------------------------------------------------

test("reads a volume header, files, a directory, links and the end", () => {
	const hello = enc.encode("hello from 1992\n");
	const big = new Uint8Array(1300).map((_, i) => i & 0xff);
	const archive = concat(
		volumeHeader({ label: "home" }),
		fileRecord({ name: "arthur/", mode: 0o40755 }),
		fileRecord({ name: "arthur/hello.txt", data: hello }),
		fileRecord({ name: "arthur/big", data: big }),
		fileRecord({ name: "arthur/again", flag: "1", link: "arthur/hello.txt", size: hello.length }),
		fileRecord({ name: "arthur/sym", flag: "2", link: "hello.txt" }),
		END,
	);
	const a = readBar(archive);
	assert.equal(a.volumes.length, 1);
	assert.deepEqual({ ...a.volumes[0], offset: 0 }, { offset: 0, volume: 1, compressed: false, date: "9211121117", label: "home" });
	assert.deepEqual(
		a.entries.map((e) => [e.name, e.kind, e.size]),
		[
			["arthur/", "directory", 0],
			["arthur/hello.txt", "file", hello.length],
			["arthur/big", "file", 1300],
			["arthur/again", "hardlink", hello.length],
			["arthur/sym", "symlink", 0],
		],
	);
	assert.equal(new TextDecoder().decode(a.entries[1]?.contents()), "hello from 1992\n");
	assert.deepEqual(a.entries[2]?.contents(), big);
	assert.equal(a.entries[3]?.linkName, "arthur/hello.txt");
	assert.equal(a.entries[3]?.raw.length, 0, "a hard link has no data on tape");
	assert.equal(a.entries[4]?.linkName, "hello.txt");
	assert.equal(a.entries[0]?.uid, 0o17);
	assert.equal(a.entries[0]?.gid, 0o222);
	assert.ok(a.entries.every((e) => e.checksumOk));
	assert.deepEqual(a.warnings, []);
});

test("a directory flagged as a special file is still a directory", () => {
	const a = readBar(concat(volumeHeader(), fileRecord({ name: "arthur/etc/", mode: 0o40755, flag: "3" }), fileRecord({ name: "dev/null", mode: 0o20666, flag: "3" }), END));
	assert.deepEqual(a.entries.map((e) => e.kind), ["directory", "special"]);
});

test("a name too long for the header runs on into the next block", () => {
	const long = `arthur/${"deep/".repeat(120)}file.txt`;
	const archive = concat(volumeHeader(), fileRecord({ name: long, data: enc.encode("x") }), fileRecord({ name: "after", data: enc.encode("y") }), END);
	const a = readBar(archive);
	assert.deepEqual(a.entries.map((e) => e.name), [long, "after"]);
	assert.equal(new TextDecoder().decode(a.entries[1]?.contents()), "y");
});

test("accepts the signed-char checksum the 68000 and SPARC wrote", () => {
	const name = "café-ü";
	const archive = concat(volumeHeader(), fileRecord({ name, data: enc.encode("z"), signed: true }), END);
	const a = readBar(archive);
	assert.equal(a.entries[0]?.checksumOk, true);
	assert.deepEqual(a.warnings, []);
});

test("resyncs past a block dropped from the middle of a file", () => {
	const blocks = 5;
	const data = new Uint8Array(blocks * BLOCK - 100).map((_, i) => (i * 7) & 0xff);
	const rec = fileRecord({ name: "damaged", data });
	// Drop the third data block, as the 1992 tape dump did.
	const dropped = concat(rec.subarray(0, BLOCK * 3), rec.subarray(BLOCK * 4));
	const archive = concat(volumeHeader(), dropped, fileRecord({ name: "next", data: enc.encode("ok") }), END);
	const a = readBar(archive);
	assert.deepEqual(a.entries.map((e) => e.name), ["damaged", "next"]);
	const got = a.entries[0]?.contents() as Uint8Array;
	assert.equal(got.length, data.length - BLOCK);
	assert.deepEqual(got.subarray(0, 2 * BLOCK), data.subarray(0, 2 * BLOCK));
	assert.deepEqual(got.subarray(2 * BLOCK), data.subarray(3 * BLOCK));
	assert.equal(new TextDecoder().decode(a.entries[1]?.contents()), "ok");
	assert.match(a.warnings[0]?.message ?? "", /1 block\(s\) missing/);
	assert.equal(readBar(archive, { resync: false }).entries.length, 1, "without resync it stops at the bad header");
});

test("reports a file cut off at the end of the tape", () => {
	const data = new Uint8Array(3000).fill(65);
	const rec = fileRecord({ name: "cut", data });
	const a = readBar(concat(volumeHeader(), rec.subarray(0, BLOCK * 3)));
	assert.equal(a.entries[0]?.raw.length, 2 * BLOCK);
	assert.match(a.warnings[0]?.message ?? "", /truncated, 3000 bytes promised, 1024 present/);
});

// compress(1) output for "TOBEORNOTTOBEORTOBEORNOT", made with /usr/bin/compress.
const SMALL_Z = Uint8Array.from([
	0x1f, 0x9d, 0x90, 0x54, 0x9e, 0x08, 0x29, 0xf2, 0x44, 0x8a, 0x93, 0x27, 0x54, 0x02, 0x0e, 0x2c, 0xa8, 0x90, 0xa0, 0x41, 0x84,
]);

test("uncompress decodes compress(1) output", () => {
	assert.equal(new TextDecoder().decode(uncompress(SMALL_Z)), "TOBEORNOTTOBEORTOBEORNOT");
});

test("uncompress matches /usr/bin/compress across code widths and clears", { skip: !existsSync("/usr/bin/compress") }, () => {
	const dir = mkdtempSync(join(tmpdir(), "sunos-bar-"));
	let seed = 7;
	const rand = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff);
	const words = ["tape", "bar", "sun", "news", "hyper", "look", "glasgow", "turing", "arthur", "al", "bitsavers"];
	// Text, then noise, so the table fills to 16 bits and compress issues a clear.
	const text = Array.from({ length: 40000 }, () => words[rand() % words.length]).join(" ");
	const noise = Uint8Array.from({ length: 300000 }, () => rand() & 0xff);
	const input = concat(enc.encode(text), noise, enc.encode(text));
	const path = join(dir, "in");
	writeFileSync(path, input);
	const z = new Uint8Array(execFileSync("/usr/bin/compress", ["-c", path]));
	assert.deepEqual(uncompress(z), input);
});

test("files on a compressed volume are uncompressed on read", { skip: !existsSync("/usr/bin/compress") }, () => {
	const dir = mkdtempSync(join(tmpdir(), "sunos-bar-"));
	const path = join(dir, "in");
	const text = enc.encode("Thanks for the lovely fir. Here is some dutch money for you.\n".repeat(50));
	writeFileSync(path, text);
	const z = new Uint8Array(execFileSync("/usr/bin/compress", ["-c", path]));
	const a = readBar(concat(volumeHeader({ compressed: true }), fileRecord({ name: "letter", data: z }), END));
	assert.equal(a.entries[0]?.compressed, true);
	assert.equal(a.entries[0]?.size, z.length);
	assert.deepEqual(a.entries[0]?.contents(), text);
});

test("extraction paths cannot escape the output directory", () => {
	assert.equal(safePath("/out", "../etc/passwd"), null);
	assert.equal(safePath("/out", "a/../../b"), null);
	assert.equal(safePath("/out", "/etc/passwd"), "/out/etc/passwd");
	assert.equal(safePath("/out", "arthur/Mail/don"), "/out/arthur/Mail/don");
});

// The real tape, when it's on this machine: a Turing Institute home directory, tape 1 of a set,
// read and dumped by Al Kossow. Set SUNOS_BAR_TAPE to its path to run this.
const TAPE = process.env.SUNOS_BAR_TAPE;
test("the 1992 Turing Institute tape", { skip: !TAPE || !existsSync(TAPE) }, () => {
	const a = readBar(new Uint8Array(readFileSync(TAPE as string)));
	assert.equal(a.volumes.length, 1);
	assert.equal(a.entries.length, 1130);
	assert.equal(a.warnings.length, 2, "one dropped block, and the last file runs onto tape 2");
});

test("a directory with a leftover link flag and no target is a directory", () => {
	const a = readBar(concat(volumeHeader(), fileRecord({ name: "arthur/info/", mode: 0o40775, flag: "1" }), fileRecord({ name: "arthur/NeWS/", mode: 0o40755, flag: "2" }), END));
	assert.deepEqual(a.entries.map((e) => e.kind), ["directory", "directory"]);
});
