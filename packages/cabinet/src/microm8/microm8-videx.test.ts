// A II+ with a Videx Videoterm in slot 3. One machine per process, so this file starts its
// own: node --test runs each file separately. The card's picture is 720x216, the same kind
// of drawing as the //e's 80-column text: the character ROM, one dot per pixel.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, test } from "node:test";
import { VIDEX_BYTES, type MicroM8 } from "./microm8.js";
import { haveMicroM8, startMicroM8Node } from "./node.js";

const FORTH = new URL("../../disks/apple2/forth/forth.po", import.meta.url);
const FORTH_OK = new URL("../../disks/apple2/forth/forth-ok.po", import.meta.url);

describe("videx videoterm", { skip: !haveMicroM8() && "microm8/dist not built" }, () => {
	let m: MicroM8;
	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
	const atPrompt = () => m.text().some((r) => r.startsWith("]"));
	const dump = () => {
		const s = m.status();
		return `pc $${s.pc.toString(16)} cycles ${s.cycles} videx ${s.videx} showing ${s.videxShowing} an ${m.annunciators()}\n40:\n${m.text().join("\n")}\n80:\n${m.videxText().join("\n")}`;
	};
	const until = async (what: string, ok: () => boolean, seconds = 30) => {
		for (let t = 0; t < seconds * 10; t++) {
			if (ok()) return;
			await sleep(100);
		}
		assert.fail(`timed out waiting for ${what}\n${dump()}`);
	};
	const shown = (n: string) => m.text().some((r) => r.trim() === n);

	before(async () => {
		m = await startMicroM8Node({ profile: "apple2-plus-videx" });
		await until("6502", () => m.status().pureBoot);
		if (!atPrompt()) {
			await until("disk", () => atPrompt() || m.status().pc >> 8 === 0xc6 || m.text().some((r) => r.includes("APPLE")), 20);
			if (!atPrompt()) m.reset();
		}
		await until("prompt", atPrompt);
	});
	after(async () => {
		await m?.stop();
	});

	test("the slot ROM, the firmware and the screen RAM answer", async () => {
		m.type("PRINT PEEK(64435)\n");
		await until("II+ rom", () => shown("234"));
		m.type("PRINT PEEK(49920)\n");
		await until("slot rom", () => shown("44"));
		m.type("X=PEEK(49920):PRINT PEEK(51200)\n");
		await until("firmware", () => shown("173"));
		m.type("X=PEEK(53247):PRINT PEEK(51200)\n");
		await until("released", () => shown("0"));

		m.type('X=PEEK(49920):X=PEEK(49336):POKE 52224,65:PRINT "P";PEEK(52224)\n');
		await until("page 2", () => m.text().some((r) => r.includes("P65")));
		m.type('X=PEEK(49328):PRINT "P";PEEK(52224)\n');
		await until("page 0", () => m.text().some((r) => r.includes("P0")));
		m.type('X=PEEK(49336):PRINT "P";PEEK(52224)\n');
		await until("page 2 again", () => m.text().some((r) => /P65/.test(r) && m.text().filter((row) => row.includes("P65")).length >= 2));
	});

	test("PR#3 prints on the card and the monitor follows annunciator 0", async () => {
		m.type('PR#3\nPRINT "HELLO FROM VIDEX"\n');
		await until(
			"hello",
			() => m.videxText().some((r) => r.includes("HELLO FROM VIDEX")) && m.status().videxShowing && (m.annunciators() & 1) === 1,
		);
		const buf = new Uint8Array(VIDEX_BYTES);
		assert.equal(m.videx(buf), true);
		assert.ok(buf.some((v, i) => i % 4 !== 3 && v > 0), "videx frame has lit pixels");
	});

	test("the 6845 cursor register and the screen hole follow the cursor", async () => {
		const column = () => m.peek(0x57b)[0]!;
		m.type('POKE 49328,15:PRINT "R";PEEK(49329)\n');
		await until("cursor low", () => /R\d+/.test(m.videxText().join("")));
		const first = m.videxText().join("").match(/R(\d+)/)![1];
		m.type('PRINT "MORE"\nPOKE 49328,15:PRINT "R";PEEK(49329)\n');
		await until("cursor moved", () => {
			const found = [...m.videxText().join("").matchAll(/R(\d+)/g)];
			return found.length >= 2 && found.at(-1)![1] !== first;
		});
		// Both prints end with a return, so the column is the left edge both times.
		assert.ok(column() < 80);
	});

	test("Ctrl-Reset shows the Apple, and PR#3 brings the card back", async () => {
		m.reset();
		await until("40 columns", () => (m.annunciators() & 1) === 0 && !m.status().videxShowing);
		m.type("PR#3\n");
		await until("80 columns", () => m.status().videxShowing && (m.annunciators() & 1) === 1);
	});

	test("graphics mode wins over the card", async () => {
		m.type("GR\n");
		await until("graphics", () => !m.status().videxShowing && (m.annunciators() & 1) === 1);
	});

	test("Don's Forth prints its banner on the card", async () => {
		m.speed(8);
		m.boot("forth.po", new Uint8Array(readFileSync(FORTH)));
		// Block 4 prints this line, then runs `term`, the terminal on the slot 4 serial card.
		await until("banner", () => m.videxText().some((r) => r.includes("Duh, huh, it worked again!")), 90);
	});

	test("`term` shows what arrives on the serial card and sends the keys", async () => {
		await sleep(2000);
		m.serialTake();
		m.serialSend("login: \r\n");
		await until("received", () => m.videxText().some((r) => r.includes("login:")), 30);
		m.type("don");
		let sent = "";
		await until("sent", () => (sent += String.fromCharCode(...m.serialTake())).includes("don"), 30);
		// The terminal's commands are keys pressed with button 1 held; F enters Forth.
		// Button 0 is Meta: it sets bit 7 of the key it is pressed with.
		m.button(1, true);
		await sleep(300);
		m.key("F".charCodeAt(0));
		await sleep(1000);
		m.button(1, false);
		await until("[Forth]", () => m.videxText().some((r) => r.includes("[Forth]")), 10);
		m.type("2 3 + .\r");
		await until("5", () => m.videxText().some((r) => /2 3 \+ \. ?5\b/.test(r)), 30);
	});

	test("forth-ok.po, without `term` in block 4, starts at the Forth prompt", async () => {
		m.boot("forth-ok.po", new Uint8Array(readFileSync(FORTH_OK)));
		await until("the last test's screen cleared", () => !m.videxText().some((r) => r.includes("2 3 + .")), 60);
		await until("banner", () => m.videxText().some((r) => r.includes("Duh, huh, it worked again!")), 90);
		await until("warm start", () => m.videxText().some((r) => r.includes("Warm start.")), 30);
		// The first line after the warm start prints its echo and Ok. but not its output.
		m.type("\r");
		await sleep(1000);
		m.type("7 6 * .\r");
		await until("42", () => m.videxText().some((r) => /7 6 \* \. ?42\b/.test(r)), 30);
	});
});
