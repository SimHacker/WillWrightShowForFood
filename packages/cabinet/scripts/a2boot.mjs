// Boot a sector image on the Korz Apple ][+ (64K, Disk II in slot 6) and print what it shows:
// the video mode, how much of each hi-res page is lit, the PC, and the 40-column text screen.
// For checking that a disk boots before it goes in APPS.yml. Run `npm run build` first.
//
//   node scripts/a2boot.mjs DISK [--cycles 60e6] [--keys 'text\r'] [--then 30e6] [--drive2 DISK]
//   node scripts/a2boot.mjs DISK --m8 e|PROFILE [--seconds 30] [--keys 'text\r'] [--drive2 DISK]
//
// --keys are typed after --cycles, one every 300,000 cycles, then the Apple runs --then more.
// --m8 boots on microM8 instead (the //e, or a profile such as apple2-plus), which also reads
// nibble and WOZ images, for --seconds of real time at 8x; its keys go in after.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Korz6502 } from "../dist/korz/m6502.js";
import { Apple2Plus } from "../dist/korz/apple2/plus.js";
import { DiskII } from "../dist/korz/apple2/disk2.js";
import { startMicroM8Node } from "../dist/microm8/node.js";

const flags = new Map();
const args = [];
for (let i = 2; i < process.argv.length; i++) {
	const a = process.argv[i];
	if (a.startsWith("--")) flags.set(a.slice(2), process.argv[++i]);
	else args.push(a);
}
const [disk] = args;
if (!disk) {
	console.error("usage: a2boot.mjs DISK [--cycles 60e6] [--keys 'text\\r'] [--then 30e6] [--drive2 DISK]");
	process.exit(2);
}
if (flags.has("m8")) {
	const profile = flags.get("m8") === "e" ? undefined : flags.get("m8");
	const m = await startMicroM8Node(profile ? { profile } : {});
	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
	for (let t = 0; t < 100 && !m.status().pureBoot; t++) await sleep(100);
	m.speed(8);
	if (flags.has("drive2")) m.insertDisk("drive2" + flags.get("drive2").replace(/.*\//, ""), new Uint8Array(readFileSync(flags.get("drive2"))), 1);
	m.boot(disk.replace(/.*\//, ""), new Uint8Array(readFileSync(disk)));
	await sleep(Number(flags.get("seconds") ?? 30) * 1000);
	const keys = (flags.get("keys") ?? "").replace(/\\r/g, "\n");
	if (keys) {
		for (const ch of keys) {
			m.type(ch);
			await sleep(150);
		}
		await sleep(10_000);
	}
	const lit = (from) => m.peek(from, 0x2000).reduce((n, b) => n + (b & 0x7f ? 1 : 0), 0);
	console.log(`microM8 ${profile ?? "//e"}; hi-res lit ${lit(0x2000)} / ${lit(0x4000)}; pc $${m.status().pc.toString(16)}`);
	console.log(m.text().filter((r) => r.trim()).join("\n"));
	m.stop();
	process.exit(0);
}

const rom = (name) => new Uint8Array(readFileSync(join(import.meta.dirname, "../roms/apple2", name)));
const board = new Apple2Plus(rom("apple2plus.rom"));
board.installLanguageCard();
const drives = new DiskII(rom("diskii.rom"));
drives.insert(1, new Uint8Array(readFileSync(disk)), disk);
if (flags.has("drive2")) drives.insert(2, new Uint8Array(readFileSync(flags.get("drive2"))), flags.get("drive2"));
board.plug(6, drives);
const cpu = new Korz6502(board, { korz: "compile" });
cpu.reset();

const run = (n) => {
	for (const end = board.cycles + n; board.cycles < end; ) cpu.step();
};
run(Number(flags.get("cycles") ?? 60e6));
const keys = (flags.get("keys") ?? "").replace(/\\r/g, "\r");
for (const ch of keys) {
	board.press(ch.charCodeAt(0));
	run(300_000);
}
if (keys) run(Number(flags.get("then") ?? 30e6));

const lit = (from) => {
	let n = 0;
	for (let a = from; a < from + 0x2000; a++) if (board.peek(a) & 0x7f) n++;
	return n;
};
const v = board.video?.at?.(-1) ?? {};
const rows = [];
for (let y = 0; y < 24; y++) {
	const base = 0x400 + (y & 7) * 0x80 + (y >> 3) * 40;
	let s = "";
	for (let x = 0; x < 40; x++) {
		const c = board.peek(base + x) & 0x7f;
		s += String.fromCharCode(c < 0x20 ? c + 0x40 : c);
	}
	rows.push(s.trimEnd());
}
console.log(
	`graphics=${v.graphics} hires=${v.hires} mixed=${v.mixed} page2=${v.page2}; hi-res lit ${lit(0x2000)} / ${lit(0x4000)}; pc $${cpu.pc.toString(16)}`
);
console.log(rows.filter((r) => r.trim()).join("\n"));
