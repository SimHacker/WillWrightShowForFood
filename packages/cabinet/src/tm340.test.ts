import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { test } from "node:test";
import { Cabinet } from "./cabinet.js";
import { assembleForthKernel, bootForth, compileForth, type ForthImage } from "./forth.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { Teletype } from "./plugins/teletype.js";
import { TuringDevice } from "./plugins/turing.js";
import { charText, type Segment, Type340 } from "./plugins/type340.js";
import { readTag } from "./tags.js";
import { runTm } from "./tm.js";
import { char342, PCOMP_TM_HEADER, pdp7TmDeck, tm340Record, TM340_HOME } from "./tm340.js";
import { compileTmForth } from "./tmforth.js";

const tape = (name: string) => readFileSync(new URL(`../tapes/pdp7forth/${name}`, import.meta.url), "utf8");
const pcomp = () => compileTmForth(readFileSync(new URL("../tapes/turing/pcomp.tmf", import.meta.url), "utf8"));
const deckUrl = new URL("../tapes/pdp7forth/pcomp-tm.fs", import.meta.url);

test("pcomp-tm.fs is what pdp7TmDeck writes from pcomp.tmf (UPDATE=1 rewrites it)", () => {
	const deck = pdp7TmDeck(pcomp(), { prefix: "pcomp-", header: PCOMP_TM_HEADER });
	if (process.env.UPDATE) writeFileSync(deckUrl, deck);
	assert.equal(readFileSync(deckUrl, "utf8"), deck);
});

test("every line of turing.fs and pcomp-tm.fs fits Forth's 80-character line", () => {
	for (const f of ["turing.fs", "pcomp-tm.fs"]) for (const [i, l] of tape(f).split("\n").entries()) assert.ok(l.length <= 78, `${f}:${i + 1} is ${l.length} long`);
});

test("a record: header, the alphabet in 342 codes, the table, the tape packed round the middle", () => {
	const add = pcomp().find((p) => p.name === "pcomp-add")!;
	const r = tm340Record(add, 1, 7, "add");
	assert.deepEqual(r.slice(0, 3), [2, 3, add.start]);
	assert.equal(r[3], 2 ** 18 - TM340_HOME, "ORIGIN: the head is at 0 and window cell 192");
	assert.deepEqual(r.slice(9, 11), [0o60, 0o61], "'0' and '1' are 342 codes 60 and 61");
	assert.equal(r[6], 0o606060, "three blanks");
	assert.equal(char342("X"), 0o30);
	assert.throws(() => char342("xy"));
});

let image: ForthImage | null = null;
function turingImage(): ForthImage {
	image ??= compileForth({
		kernel: assembleForthKernel({
			sop: readFileSync(new URL("../tapes/pdp7unix/sop.s", import.meta.url), "utf8"),
			kernel: tape("kernel-names-full.s"),
			end: tape("end.s"),
			kernelName: "kernel-names-full.s",
		}),
		sources: ["prelude.fs", "does.fs", "turtle.fs", "code.fs", "interrupt.fs", "tags.fs", "turing.fs", "pcomp-tm.fs"].map(tape),
	});
	return image;
}

export function turingMachine() {
	const img = turingImage();
	const cpu = new Pdp7({ coreWords: 8192 });
	let paper = "";
	let last: Segment[] = [];
	const t340 = new Type340({
		fetch: (a) => cpu.read(a),
		store: (a, w) => cpu.write(a, w),
		onFrame: (f) => {
			const lit = f.segments.filter((s) => s.intensify);
			if (lit.length > 0) last = lit;
		},
	});
	const tty = new Teletype({ printCycles: 1000, onPrint: (c) => (paper += String.fromCharCode(c & 0o177)) });
	const tm = new TuringDevice({ fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w), rate: 1 / 3 });
	const box = new Cabinet({ cpu, devices: [t340, tty, tm] });
	t340.clock = () => box.cycles;
	bootForth(cpu, img);
	box.run(300_000);
	const type = (text: string) => {
		for (const ch of text) tty.type((ch === "\n" ? 0o15 : ch.toUpperCase().charCodeAt(0)) | 0o200);
	};
	const line = (text: string, max = 200): string => {
		const from = paper.length;
		type(`${text}\n`);
		for (let n = 0; n < max && !/ok\r\n$/.test(paper.slice(from)); n += 1) box.run(50_000);
		return paper.slice(from);
	};
	/** The 342 text on the tube, a line per baseline from the top, a glyph by the x of its first dot. */
	const screen = (): string[] => {
		const glyphs = new Map<number, { x: number; y: number; c: string }>();
		for (const s of last) {
			if (s.kind !== "char") continue;
			const g = glyphs.get(s.glyph);
			if (!g) glyphs.set(s.glyph, { x: s.x0, y: s.y0, c: charText(s.ch) });
			else {
				g.x = Math.min(g.x, s.x0);
				g.y = Math.min(g.y, s.y0);
			}
		}
		const rows = new Map<number, { x: number; c: string }[]>();
		for (const g of glyphs.values()) {
			const y = [...rows.keys()].find((k) => Math.abs(k - g.y) < 8) ?? g.y;
			rows.set(y, [...(rows.get(y) ?? []), g]);
		}
		return [...rows.entries()].sort((a, b) => b[0] - a[0]).map(([, gs]) => {
			gs.sort((a, b) => a.x - b.x);
			let out = "";
			let x = gs[0]!.x;
			for (const g of gs) {
				out += " ".repeat(Math.max(0, Math.round((g.x - x) / 12) - 1)) + g.c;
				x = g.x;
			}
			return out;
		});
	};
	return { cpu, box, tm, t340, line, type, paper: () => paper, frame: () => last, labels: img.labels, screen };
}


test("BUSY2 RUN: the 342 tape on the tube, the head over it, halted after 6 steps with four ones", () => {
	const m = turingMachine();
	assert.match(m.line("MACHINES"), /ADD BUSY2 BUSY5 BB5 BCOUNT EQUALS EQUALS-PATCHED SQUARE UTM/);
	m.line("BUSY2");
	let s = m.screen();
	assert.ok(s.includes("TURING MACHINE") && s.includes("BUSY2"), s.join("\n"));
	assert.ok(s.includes("0 ".repeat(38) + "0"), "a blank tape, 39 cells");
	assert.ok(s.includes("READS 0  WRITES 1  MOVES RIGHT  GOES TO Q2"), s.join("\n"));
	assert.ok(s.includes("READY: RUN OR STEP"));
	m.line("STEP");
	assert.ok(m.screen().includes("STEPS 1   HEAD AT 1"), m.screen().join("\n"));
	m.line("RUN");
	s = m.screen();
	assert.ok(s.includes("HALTED") && s.includes("STEPS 6   HEAD AT -2"), s.join("\n"));
	assert.equal(s.find((l) => /^[01 ]{77}$/.test(l))!.replace(/ /g, "").replace(/0/g, ""), "1111");
});

test("0 SPEED RUN lets the engine run free until a key, which RUN eats", () => {
	const m = turingMachine();
	m.line("BCOUNT");
	m.line("0 SPEED");
	m.type("RUN\n");
	m.box.run(3_000_000);
	const steps = () => Number(/STEPS (\d+)/.exec(m.screen().join("\n"))![1]);
	const a = steps();
	m.box.run(1_000_000);
	assert.ok(steps() > a && a > 1000, `${a} then ${steps()}`);
	assert.equal(m.line("X"), " ok\r\n  ok\r\n", "RUN's ok, then the empty line's: X only stopped it");
	assert.ok(m.screen().includes("READY: RUN OR STEP"));
});
