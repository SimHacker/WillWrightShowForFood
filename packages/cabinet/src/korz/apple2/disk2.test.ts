import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { M6502 } from "../../m6502/m6502.js";
import { Korz6502, type Korz6502Opts } from "../m6502.js";
import { textRows } from "../../microm8/microm8.js";
import { haveMicroM8, startMicroM8Node } from "../../microm8/node.js";
import { Apple2Plus } from "./plus.js";
import { DiskII, decode62, encode62, readTracks, sectorTracks } from "./disk2.js";

const DOS33 = new URL("../../../disks/apple2/dos33/dos-3.3-january-1983.dsk", import.meta.url);
const FORTH = new URL("../../../disks/apple2/forth/forth.po", import.meta.url);

test("disk II: a sector survives the trip onto the track and back", () => {
	const src = new Uint8Array(256);
	for (let i = 0; i < 256; i++) src[i] = i;
	const zeros = encode62(new Uint8Array(256));
	assert.equal(zeros.length, 343);
	assert.ok(zeros.every((b) => b === 0x96));
	assert.deepEqual(decode62(encode62(src)), src);
	const dos = new Uint8Array(readFileSync(DOS33));
	const back = new Uint8Array(dos.length);
	assert.equal(readTracks(sectorTracks(dos), back), 35 * 16);
	assert.deepEqual(back, dos);
});

test("disk II: .dsk and .po come back out in the order they went in", () => {
	const card = new DiskII(new Uint8Array(0x100));
	const dsk = new Uint8Array(readFileSync(DOS33));
	const po = new Uint8Array(readFileSync(FORTH));
	card.insert(1, dsk, "dos.dsk");
	card.insert(2, po, "forth.po");
	assert.deepEqual(card.image(1), dsk);
	assert.deepEqual(card.image(2), po);
});

/** A compiled block repeats at most 24 instructions, 64 times. Stay under that with `one`. */
const BLOCK = 24 * 64;

/** The same cabinet the switch boots: a fresh board, the language card, and drive 1. */
function bootCabinet(rom: Uint8Array, slotRom: Uint8Array, image: Uint8Array, korz?: Korz6502Opts["korz"]): { board: Apple2Plus; cpu: M6502 } {
	const board = new Apple2Plus(rom);
	board.installLanguageCard();
	const disk = new DiskII(slotRom);
	disk.insert(1, image, "dos-3.3-january-1983.dsk");
	board.plug(6, disk);
	const cpu = korz ? new Korz6502(board, { korz }) : new M6502(board);
	cpu.reset();
	return { board, cpu };
}

/** `n` instructions. The compiler's `step` retires a block; near the end, one instruction. */
function runInstructions(cpu: M6502, n: number): void {
	const korz = cpu instanceof Korz6502 ? cpu : null;
	let done = 0;
	while (done < n) {
		if (korz?.compiler && n - done <= BLOCK) korz.one();
		else cpu.step();
		done += korz?.lastRun ?? 1;
	}
	assert.equal(done, n);
}

describe("disk II boot", { skip: !haveMicroM8() && "microm8/dist not built" }, () => {
	test("each rung reboots DOS 3.3 to the prompt the switch reached", { timeout: 300_000 }, async () => {
		const m = await startMicroM8Node({ profile: "apple2-plus" });
		const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
		try {
			let up = false;
			for (let t = 0; t < 100 && !up; t += 1) {
				up = m.status().pureBoot && m.peek(0xfbb3, 1)[0] === 0xea;
				if (!up) await sleep(100);
			}
			assert.ok(up, "microM8 did not reach the II+ ROM");
			const rom = m.peek(0xd000, 0x3000);
			const slotRom = m.peek(0xc600, 0x100);
			const image = new Uint8Array(readFileSync(DOS33));
			const { board, cpu } = bootCabinet(rom, slotRom, image);
			let steps = 0;
			const screen = () => textRows(board.textPage()).join("\n");
			for (; steps < 20_000_000; steps += 1) {
				if ((steps & 0x3fff) === 0 && /COPYRIGHT APPLE/.test(screen()) && /^\]/m.test(screen())) break;
				cpu.step();
			}
			assert.ok(steps < 20_000_000, `DOS did not prompt after ${steps} instructions:\n${screen()}`);
			const page = new Uint8Array(board.textPage());

			for (const rung of ["interpret", "resolve", "compile"] as const) {
				const again = bootCabinet(rom, slotRom, image, rung);
				runInstructions(again.cpu, steps);
				assert.equal(again.cpu.pc, cpu.pc, rung);
				assert.equal(again.cpu.a, cpu.a, rung);
				assert.equal(again.cpu.x, cpu.x, rung);
				assert.equal(again.cpu.y, cpu.y, rung);
				assert.equal(again.cpu.s, cpu.s, rung);
				assert.equal(again.cpu.p, cpu.p, rung);
				assert.equal(again.cpu.cycles, cpu.cycles, rung);
				assert.equal(again.board.cycles, board.cycles, rung);
				assert.deepEqual(again.board.textPage(), page, rung);
			}
		} finally {
			await m.stop();
		}
	});
});
