import assert from "node:assert/strict";
import { test } from "node:test";
import { APPLE_HZ } from "../../angel/angel.js";
import { Korz6502 } from "../m6502.js";
import { Apple2Plus } from "./plus.js";
import { CYCLES_PER_FRAME } from "./scan.js";
import { runWatch, type WatchFrame } from "./pace.js";

/** LDA $C030 / JMP $0800. The speaker clicks, and the picture is whatever RAM holds. */
function clicking(board: Apple2Plus): Korz6502 {
	board.ram[0x800] = 0xad;
	board.ram[0x801] = 0x30;
	board.ram[0x802] = 0xc0;
	board.ram[0x803] = 0x4c;
	board.ram[0x804] = 0x00;
	board.ram[0x805] = 0x08;
	board.graphics = true;
	board.hires = true;
	board.ram[0x2000] = 0xff;
	const cpu = new Korz6502(board, { korz: "compile" });
	cpu.pc = 0x800;
	return cpu;
}

test("a fast watch paints at the asked rate and keeps the speaker as clicks", () => {
	const board = new Apple2Plus(new Uint8Array(0x3000));
	const cpu = clicking(board);
	const frames: WatchFrame[] = [];
	const watched = runWatch(board, cpu, APPLE_HZ, APPLE_HZ / 4, (frame) => frames.push(frame));
	assert.equal(frames.length, 4);
	assert.equal(watched.frames, 4);
	assert.equal("samples" in watched, false);
	assert.ok(watched.clicks > 0);
	assert.equal(frames[0]!.picture[0], 1);
	for (let i = 0; i < frames.length; i += 1) {
		const mark = (APPLE_HZ / 4) * (i + 1);
		assert.ok(frames[i]!.cycle >= mark);
		assert.ok(frames[i]!.cycle < mark + CYCLES_PER_FRAME);
	}
});
