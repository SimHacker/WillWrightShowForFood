import assert from "node:assert/strict";
import { test } from "node:test";
import { Apple2Plus } from "./plus.js";

/** A 12K ROM of `$D000 + i` so a banked read is obvious. Reset vector `$F800`. */
function rom(): Uint8Array {
	const out = new Uint8Array(0x3000);
	for (let i = 0; i < out.length; i++) out[i] = i & 0xff;
	out[0xfffc - 0xd000] = 0x00;
	out[0xfffd - 0xd000] = 0xf8;
	return out;
}

test("language card: two odd accesses arm a write, and the banks stay apart", () => {
	const board = new Apple2Plus(rom());
	const card = board.installLanguageCard();
	assert.equal(board.read(0xd010), 0x10, "power-up reads the motherboard ROM");
	board.read(0xc083);
	board.read(0x0000);
	board.write(0xd000, 0x99);
	assert.equal(card.bank2[0], 0, "one access does not enable writing");
	board.read(0xc083);
	assert.equal(board.read(0xd000), 0);
	board.write(0xd000, 0x11);
	board.write(0xe000, 0x77);
	assert.equal(board.read(0xd000), 0x11);
	assert.equal(board.read(0xe000), 0x77);
	board.read(0xc08b);
	board.read(0xc08b);
	board.write(0xd000, 0x22);
	board.read(0xc080);
	assert.equal(board.read(0xd000), 0x11, "bank 2");
	assert.equal(board.read(0xe000), 0x77, "the 12K is shared");
	board.read(0xc088);
	assert.equal(board.read(0xd000), 0x22, "bank 1");
	board.read(0xc082);
	assert.equal(board.read(0xd000), 0x00, "an even switch reads the ROM again");
	board.write(0xd000, 0x33);
	board.read(0xc080);
	assert.equal(board.read(0xd000), 0x11, "writing was off");
	assert.equal(card.writing, false);
});
