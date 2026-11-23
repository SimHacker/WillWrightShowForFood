import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { M6502 } from "../../m6502/m6502.js";
import { Korz6502 } from "../m6502.js";
import { DiskII } from "./disk2.js";
import { Apple2Plus } from "./plus.js";
import { VIDEX_PICTURE_HEIGHT, VIDEX_PICTURE_WIDTH, Videx } from "./videx.js";

const file = (p: string): Uint8Array => new Uint8Array(readFileSync(new URL(`../../../${p}`, import.meta.url)));

function videx(): Videx {
	return new Videx(file("roms/apple2/videx-fw24.rom"), file("roms/apple2/videx-chr.rom"));
}

test("videx: $C0Bx latches the RAM page, $CC00 is that page, the 6845 cursor registers read back", () => {
	const board = new Apple2Plus(file("roms/apple2/apple2plus.rom"));
	const card = videx();
	board.plug(3, card);
	assert.equal(board.read(0xc300), card.rom[0]);
	assert.equal(board.read(0xc800), card.expansion[0]);
	board.read(0xc0b8);
	board.write(0xcc05, 0x41);
	assert.equal(card.ram[2 * 512 + 5], 0x41);
	assert.equal(board.read(0xcc05), 0x41);
	assert.equal(board.peek(0xcc05), 0x41);
	board.read(0xc0b0);
	assert.equal(board.read(0xcc05), 0);
	board.write(0xc0b0, 15);
	board.write(0xc0b1, 0x77);
	assert.equal(board.read(0xc0b1), 0x77);
	board.write(0xc0b0, 1);
	assert.equal(board.read(0xc0b1), 0, "R1 is write-only");
	board.read(0xcfff);
	assert.notEqual(board.peek(0xcc05), 0x41, "$CFFF gives the $C800 space back");
});

/** Don's ProDOS Forth, `forth-ok.po`: boot to the Forth prompt on the Videx, then type at it. */
for (const rung of ["switch", "resolve", "compile"] as const) {
	test(`videx: Don's ProDOS Forth boots and computes on the ${rung} rung`, { timeout: 120_000 }, () => {
		const board = new Apple2Plus(file("roms/apple2/apple2plus.rom"));
		board.installLanguageCard();
		const disk = new DiskII(file("roms/apple2/diskii.rom"));
		disk.insert(1, file("disks/apple2/forth/forth-ok.po"), "forth-ok.po");
		board.plug(6, disk);
		const card = videx();
		board.plug(3, card);
		const cpu = rung === "switch" ? new M6502(board) : new Korz6502(board, { korz: rung });
		cpu.reset();
		const screen = (): string => card.text().join("\n");
		const run = (cycles: number, until: () => boolean): void => {
			const end = board.cycles + cycles;
			while (board.cycles < end && !until()) for (let i = 0; i < 10_000; i++) cpu.step();
		};
		run(60_000_000, () => /Warm start\./.test(screen()));
		assert.match(screen(), /Duh, huh, it worked again!/);
		assert.match(screen(), /Warm start\./);
		assert.ok(Videx.showing(board.annunciators, board.graphics), "annunciator 0 on, text mode: the monitor shows the Videx");
		// The first line after the warm start echoes and says Ok. without its output, in microM8 too.
		const keys = [..."\r7 6 * .\r"].map((c) => c.charCodeAt(0));
		let last = board.cycles;
		run(30_000_000, () => {
			if (keys.length && !(board.key & 0x80) && board.cycles - last > 200_000) {
				board.press(keys.shift()!);
				last = board.cycles;
			}
			return keys.length === 0 && /7 6 \* \. ?42 +Ok\./.test(screen());
		});
		const tail = card.text().map((r) => r.trimEnd()).filter((r) => r).slice(-4).join("\n");
		assert.match(tail, /7 6 \* \. ?42 +Ok\./, tail);
		const picture = new Uint8ClampedArray(VIDEX_PICTURE_WIDTH * VIDEX_PICTURE_HEIGHT * 4);
		card.paint(picture, 0);
		assert.ok(picture.some((v, i) => i % 4 === 1 && v === 0xff), "some dots lit");
	});
}
