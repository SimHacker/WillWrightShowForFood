import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
	decodeEntry,
	disasmForth,
	disasmTeco,
	disasmTmStar,
	encodeEntry,
	parseTapeText,
	parseTmStarFile,
	parseTmStarTape,
	runTm,
	tmDiff,
	transitions,
	type TmProgram,
} from "./tm.js";
import { PDP7_TM_SHAPE } from "./plugins/turing.js";
import { compileTm, compileTmForth, tmStarSource, TmForthError } from "./tmforth.js";

const tapeFile = (name: string) => readFileSync(new URL(`../tapes/turing/${name}`, import.meta.url), "utf8");
const disk = (name: string) =>
	readFileSync(new URL(`../../../characters/christopher-cherniak/sources/pcomp/disk/${name}`, import.meta.url), "latin1");
const machines = new Map<string, TmProgram>();
for (const f of ["minsky-7x4.tmf", "pcomp.tmf"]) for (const p of compileTmForth(tapeFile(f))) machines.set(p.name, p);
const machine = (name: string) => {
	const p = machines.get(name);
	assert.ok(p, `no machine ${name}`);
	return p;
};

test("entries pack move, write and next into one word and back", () => {
	const e = encodeEntry(PDP7_TM_SHAPE, "L", 5, 0o1234);
	assert.equal(e, (2 << 16) | (5 << 12) | 0o1234);
	assert.deepEqual(decodeEntry(PDP7_TM_SHAPE, e), { move: "L", write: 5, next: 0o1234 });
	assert.equal(decodeEntry(PDP7_TM_SHAPE, 0), null, "move 0 is no door");
});

test("Minsky's 7x4 UTM: the TECO row: form and the rule form compile to one table", () => {
	const a = machine("minsky-7x4");
	const b = machine("minsky-7x4-rules");
	assert.equal(tmDiff(a, b), null);
	assert.equal(a.symbols.length, 4);
	assert.equal(a.states.length, 8, "halt and seven states");
	assert.deepEqual(a.codes, [0o60, 0o61, 0o31, 0o01], "cells are Type 342 codes: 0 1 Y A");
	const r = runTm(a);
	assert.equal(r.reason, "halt");
	assert.equal(r.steps, 1870);
	assert.equal(r.pictured, "11010111000001001101100000000000000000000000000yAAAA");
	const teco = disasmTeco(a);
	assert.equal(teco.split("\n").filter((l) => l.trim()).length >= 7, true, teco);
});

test("m-functions: parametrized states are made once and named by their arguments", () => {
	const p = machine("add-m");
	assert.deepEqual(p.states, ["halt", "fill", "end", "clip", "seek(0,1)", "seek(0,2)"]);
	const r = runTm(p);
	assert.equal(r.reason, "halt");
	assert.equal(r.steps, 11);
	assert.equal(r.pictured, "111111");
});

test("busy beavers: BB2 by rule and by Cherniak's table", () => {
	assert.equal(tmDiff(machine("bb2"), machine("pcomp-busy2")), null);
	const r = runTm(machine("bb2"));
	assert.equal(r.steps, 6);
	assert.equal(r.pictured, "1111");
});

const DISK: [file: string, machine: string][] = [
	["ADD.TM", "pcomp-add"],
	["BUSY2.TM", "pcomp-busy2"],
	["BUSY5.TM", "pcomp-busy5"],
	["BB5.TM", "pcomp-bb5"],
	["BCOUNT.TM", "pcomp-bcount"],
	["EQUALS.TM", "pcomp-equals"],
	["SQUARE.TM", "pcomp-square"],
	["UTM.TM", "pcomp-utm"],
];

for (const [file, name] of DISK) {
	test(`Cherniak's ${file}, read off the disk, is the same machine as ${name} in Forth`, () => {
		const text = disk(file);
		const fromDisk = compileTm(tmStarSource(text, { name }));
		const mine = machine(name);
		assert.equal(tmDiff(fromDisk, mine), null);
		assert.equal(fromDisk.start, mine.start);
		const reread = compileTm(tmStarSource(disasmTmStar(fromDisk), { name }));
		assert.equal(tmDiff(reread, fromDisk), null, "disasmTmStar reads back");
		assert.equal(parseTmStarFile(text).initial, mine.start);
	});
}

test("the PCOMP numbers: ADD, SQUARE, BUSY5", () => {
	const add = runTm(machine("pcomp-add"));
	assert.equal(add.steps, 5);
	assert.equal(add.pictured, "111111");
	const sq = runTm(machine("pcomp-square"));
	assert.equal(sq.reason, "halt");
	assert.equal(sq.steps, 155);
	assert.equal([...sq.pictured].filter((c) => c === "1").length, 9);
	const b5 = runTm(machine("pcomp-busy5"));
	assert.equal(b5.reason, "halt");
	assert.equal(b5.steps, 2_133_492);
	assert.equal([...b5.pictured].filter((c) => c === "1").length, 1915);
});

test("BB5 on TM*'s finite tape walks off the left end; with room it halts with 4098 ones", () => {
	const p = machine("pcomp-bb5");
	const off = runTm(p, { bounds: [-5000, 5000], maxSteps: 7_000_000 });
	assert.equal(off.reason, "bounds");
	assert.ok(Math.abs(off.steps - 6_503_981) <= 1, `left the tape at ${off.steps}`);
	const full = runTm(p, { tape: { cells: [], origin: -2000, head: -2000 }, wlen: 3000, maxSteps: 12_000_000 });
	assert.equal(full.reason, "halt");
	assert.equal(full.steps, 11_798_826);
	assert.equal([...full.pictured].filter((c) => c === "1").length, 4098);
});

test("EQUALS: Cherniak's COMPARE says equal by the scanned cell, and the patch fixes 3 vs 2", () => {
	const eq = machine("pcomp-equals");
	const run = (p: TmProgram, tape: string) =>
		runTm(p, { tape: compileTm(`tm: t symbols: ${p.symbols.join(" ")} ; states: ; halt start tape: ${tape} end-tm`).tape! });
	assert.equal(run(eq, "111^0111").scanned, "0", "3 = 3");
	assert.equal(run(machine("pcomp-equals-patched"), "111^011").scanned, "1", "3 != 2");
	assert.equal(run(eq, "111^01").reason, "halt");
});

test("BCOUNT counts forever", () => {
	const r = runTm(machine("pcomp-bcount"), { maxSteps: 100_000 });
	assert.equal(r.reason, "limit");
});

test("Cherniak's UTM runs his UTMADD and UTMBUSY tapes off the disk", () => {
	const utm = machine("pcomp-utm");
	const run = (file: string) => {
		const text = parseTmStarTape(disk(file)).tape;
		return runTm(utm, { tape: parseTapeText(utm.symbols, text) });
	};
	const add = run("UTMADD.INP");
	assert.equal(add.reason, "halt");
	assert.equal(add.steps, 3095);
	const busy = run("UTMBUSY.INP");
	assert.equal(busy.reason, "halt");
	assert.equal(busy.steps, 2931);
	assert.match(parseTmStarTape(disk("UTMADD.INP")).tape, /\^X/);
});

test("disasmForth writes TM-Forth that compiles back to the same table", () => {
	for (const name of ["minsky-7x4", "add-m", "pcomp-utm", "pcomp-square"]) {
		const p = machine(name);
		const back = compileTm(disasmForth(p));
		assert.equal(tmDiff(back, p), null, name);
		assert.equal(transitions(back).length, transitions(p).length);
	}
});

test("TM-Forth is a Forth: definitions, loops and the stack build tables", () => {
	const p = compileTm(`
		1 constant one
		: mark ( -- ) one write right ;
		: blank? ( sym -- f ) 0 = ;
		tm: counted  symbols: 0 1 ;  states: a ;
		state: a  blank? if mark else halt goto then ;
		a start  tape: ^0
		end-tm`);
	assert.equal(transitions(p).length, 2);
	const r = runTm(p, { maxSteps: 7 });
	assert.equal(r.pictured, "1111111");
});

test("TM-Forth errors say what went wrong", () => {
	const bad = (src: string, re: RegExp) => assert.throws(() => compileTmForth(src), (e: unknown) => e instanceof TmForthError && re.test(e.message));
	bad("tm: x symbols: 0 1 ; frobnicate end-tm", /frobnicate/);
	bad("tm: x symbols: 0 1 ; states: a ; state: a 1 2 ; a start end-tm", /stack|balance/i);
	bad("tm: x symbols: 0 1 ; states: a ; state: a drop 7 write ; a start end-tm", /not a symbol/);
	bad("tm: x symbols: 0 1 ; state: a drop ; state: a drop ; end-tm", /a/);
});
