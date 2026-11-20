import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { M6502 } from "../../m6502/m6502.js";
import { textRows } from "../../microm8/microm8.js";
import { haveMicroM8, startMicroM8Node } from "../../microm8/node.js";
import { Apple2Plus } from "./plus.js";
import { scanAddress } from "./scan.js";

/** A 12K ROM whose reset vector is `$F800`, with `code` planted there. */
function romAtReset(code: number[]): Uint8Array {
	const rom = new Uint8Array(0x3000);
	rom.set(code, 0xf800 - 0xd000);
	rom[0xfffc - 0xd000] = 0x00;
	rom[0xfffd - 0xd000] = 0xf8;
	return rom;
}

const screen = (board: Apple2Plus) => textRows(board.textPage()).map((row) => row.trimEnd()).filter((row) => row.length > 0);

test("apple ][+: RAM, ROM, the keyboard and the speaker", () => {
	const rom = romAtReset([
		0xa9, 0xdd, // LDA #']'  (normal video)
		0x8d, 0x00, 0x04, // STA $0400
		0xad, 0x51, 0xc0, // LDA $C051  text
		0xad, 0x30, 0xc0, // LDA $C030  speaker
		0x4c, 0x00, 0xf8, // JMP $F800
	]);
	const board = new Apple2Plus(rom);
	const cpu = new M6502(board);
	board.press(0x41);
	assert.equal(board.read(0xc000), 0xc1);
	assert.equal(board.read(0xc010), 0x41);
	assert.equal(board.read(0xc000), 0x41);
	board.write(0x1234, 0x55);
	assert.equal(board.read(0x1234), 0x55);
	const romByte = board.read(0xf800);
	board.write(0xf800, 0);
	assert.equal(board.read(0xf800), romByte);
	board.read(0xc050);
	assert.equal(board.graphics, true);
	board.read(0xc059);
	assert.equal(board.annunciators & 1, 1);
	cpu.reset();
	for (let i = 0; i < 5; i += 1) cpu.step();
	assert.equal(board.ram[0x400], 0xdd);
	assert.ok(textRows(board.textPage())[0]!.startsWith("]"));
	assert.equal(board.graphics, false);
	assert.equal(board.speakerClicks, 1);
	const cycle = board.cycles;
	const addr = scanAddress(cycle, board.mode());
	board.ram[addr] = 0x5a;
	assert.equal(board.read(0xc030), 0x5a);
	board.plug(6, { rom: Uint8Array.of(0x60), expansion: Uint8Array.of(0x11) });
	assert.equal(board.read(0xc600), 0x60);
	assert.equal(board.read(0xc800), 0x11);
	assert.equal(board.expansion, 6);
	board.read(0xcfff);
	assert.equal(board.expansion, 0);
	assert.ok(board.video.some((event) => event.graphics));
});

describe("apple ][+ ROM", { skip: !haveMicroM8() && "microm8/dist not built" }, () => {
	test("the Autostart ROM reaches the Applesoft prompt", async () => {
		const m = await startMicroM8Node({ profile: "apple2-plus" });
		const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
		try {
			let up = false;
			for (let t = 0; t < 100 && !up; t += 1) {
				up = m.status().pureBoot && m.peek(0xfbb3, 1)[0] === 0xea;
				if (!up) await sleep(100);
			}
			assert.ok(up, `microM8 did not reach the II+ ROM:\n${m.text().join("\n")}`);
			const rom = m.peek(0xd000, 0x3000);
			assert.equal(rom[0xfbb3 - 0xd000], 0xea, "II+ ROM version byte");
			const board = new Apple2Plus(rom);
			const cpu = new M6502(board);
			cpu.reset();
			let steps = 0;
			for (; steps < 2_000_000; steps += 1) {
				if (screen(board).some((row) => row.startsWith("]"))) break;
				cpu.step();
			}
			assert.ok(steps < 2_000_000, `no prompt after ${steps} instructions:\n${textRows(board.textPage()).join("\n")}`);
		} finally {
			await m.stop();
		}
	});
});
