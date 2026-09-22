import { ESC, type Command, type CommandResult, type TinyTeco } from "./engine.js";
import { TecoHaltError } from "./errors.js";

const C = (name: string, codes: number[], execute: (ctx: TinyTeco) => CommandResult): Command => ({
	name,
	codes,
	execute,
});

/** Insert text until ESC. Optional count (TECO `nItext$`). */
const insert = C("insert", [0x69, 0x49], (ctx) => {
	const n = ctx.hasArg() ? ctx.takeArg(1) : 1;
	const text = ctx.takeString();
	for (let i = 0; i < n; i += 1) ctx.buffer.insert(text);
	return "ok";
});

/** Jump: `J` → 0, `nJ` → n. */
const jump = C("jump", [0x6a, 0x4a], (ctx) => {
	ctx.buffer.jump(ctx.takeArg(0));
	return "ok";
});

/** Move point `nC` characters. */
const charMove = C("char", [0x63, 0x43], (ctx) => {
	ctx.buffer.move(ctx.takeArg(1));
	return "ok";
});

/** Delete `nD` chars right, or `-nD` / `-D` left. */
const del = C("delete", [0x64, 0x44], (ctx) => {
	ctx.buffer.delete(ctx.takeArg(1));
	return "ok";
});

const search = C("search", [0x73, 0x53], (ctx) => {
	const needle = ctx.takeString();
	const from = ctx.buffer.point;
	const hay = ctx.buffer.contents;
	const at = hay.indexOf(needle, from);
	if (at < 0) {
		ctx.lastSearchOk = false;
		ctx.lastValue = 0;
		return "ok";
	}
	ctx.lastSearchOk = true;
	ctx.lastValue = -1;
	ctx.buffer.jump(at + needle.length);
	return "ok";
});

const iterate = C("iterate", [0x3c], (ctx) => {
	const count = ctx.hasArg() ? ctx.takeArg(1) : null;
	if (count === 0) {
		ctx.exitIter();
		return "ok";
	}
	ctx.beginIter(count);
	return "ok";
});

const endIterate = C("end-iterate", [0x3e], (ctx) => {
	ctx.clearArg();
	ctx.endIter();
	return "ok";
});

/** `;` — leave the loop if last search failed or last value is 0. */
const semi = C("semi", [0x3b], (ctx) => {
	ctx.clearArg();
	if (!ctx.lastSearchOk || ctx.lastValue === 0) {
		ctx.exitIter();
		return "exit-iter";
	}
	return "ok";
});

/** `"E` … `'` — do the body if lastValue === 0. */
const ifEqual = C("if-equal", [0x22], (ctx) => {
	const kind = ctx.take();
	if (kind !== 0x45 && kind !== 0x65) {
		throw new TecoHaltError(`only "E is implemented, got ${kind}`);
	}
	const truth = ctx.lastValue === 0;
	if (truth) return "ok";
	let depth = 0;
	while (ctx.pc < ctx.program.length) {
		const b = ctx.take();
		if (b === 0x22) depth += 1;
		else if (b === 0x27) {
			if (depth === 0) return "ok";
			depth -= 1;
		}
	}
	return "ok";
});

const endIf = C("end-if", [0x27], (ctx) => {
	ctx.clearArg();
	return "ok";
});

const qGet = C("q-get", [0x71, 0x51], (ctx) => {
	const name = ctx.takeQName();
	ctx.pushArg(ctx.qregs.get(name).numeric);
	return "ok";
});

const qPut = C("q-put", [0x75, 0x55], (ctx) => {
	const n = ctx.takeArg(0);
	const name = ctx.takeQName();
	ctx.qregs.setNumeric(name, n);
	return "ok";
});

/** `:Iq` — if a number is pending, store that char as the Q-register text. */
const colon = C("colon", [0x3a], (ctx) => {
	const next = ctx.take();
	if (next !== 0x69 && next !== 0x49) throw new TecoHaltError(": only supports :I so far");
	const n = ctx.takeArg(0);
	const name = ctx.takeQName();
	ctx.qregs.setText(name, String.fromCharCode(n));
	return "ok";
});

/** `nXq` copy n lines (default 1) from point into Q-register q. Point stays. */
const extract = C("extract", [0x78, 0x58], (ctx) => {
	const lines = ctx.takeArg(1);
	let text = "";
	let p = ctx.buffer.point;
	for (let i = 0; i < lines; i += 1) {
		const end = ctx.buffer.lineEnd(p);
		text += ctx.buffer.contents.slice(p, end);
		if (end < ctx.buffer.size) text += "\n";
		p = end < ctx.buffer.size ? end + 1 : end;
	}
	const name = ctx.takeQName();
	ctx.qregs.setText(name, text.replace(/\n$/, ""));
	return "ok";
});

const line = C("line", [0x6c, 0x4c], (ctx) => {
	ctx.takeArg(1);
	ctx.buffer.nextLine();
	return "ok";
});

/** `nA` — ASCII of the character at point+n-1 (ITS / Emacs TECO). */
const ascii = C("ascii", [0x61, 0x41], (ctx) => {
	const n = ctx.takeArg(1);
	const ch = ctx.buffer.charAt(ctx.buffer.point + n - 1);
	ctx.pushArg(ch === undefined ? -1 : ch.charCodeAt(0));
	return "ok";
});

const macro = C("macro", [0x6d, 0x4d], (ctx) => {
	const name = ctx.takeQName();
	const text = ctx.qregs.get(name).text;
	if (text.length === 0) return "halt";
	runMacro(ctx, text);
	return ctx.halted ? "halt" : "ok";
});

const type = C("type", [0x74, 0x54], (ctx) => {
	ctx.takeArg(1);
	ctx.write(ctx.buffer.contents);
	return "ok";
});

const hom = C("h", [0x68, 0x48], (ctx) => {
	ctx.clearArg();
	const next = ctx.peek();
	if (next === 0x74 || next === 0x54) {
		ctx.take();
		ctx.write(ctx.buffer.contents);
		return "ok";
	}
	if (next === 0x6b || next === 0x4b) {
		ctx.take();
		ctx.buffer.kill();
		return "ok";
	}
	if (next === 0x78 || next === 0x58) {
		ctx.take();
		const name = ctx.takeQName();
		ctx.qregs.setText(name, ctx.buffer.contents);
		return "ok";
	}
	throw new TecoHaltError("H must be followed by T, K, or X");
});

const equals = C("equals", [0x3d], (ctx) => {
	ctx.write(String(ctx.takeArg(0)));
	return "ok";
});

/** `M` / insert already handle ESC as string end. Bare ESC is a no-op. */
const altmode = C("altmode", [ESC], (ctx) => {
	ctx.clearArg();
	return "ok";
});

function runMacro(ctx: TinyTeco, text: string): void {
	const savedProg = ctx.program;
	const savedPc = ctx.pc;
	ctx.program = new TextEncoder().encode(text);
	ctx.pc = 0;
	try {
		ctx.run();
	} finally {
		ctx.program = savedProg;
		ctx.pc = savedPc;
		ctx.halted = false;
	}
}

export function registerItsSubset(table: import("./engine.js").CommandTable): void {
	for (const c of [
		insert,
		jump,
		charMove,
		del,
		search,
		iterate,
		endIterate,
		semi,
		ifEqual,
		endIf,
		qGet,
		qPut,
		colon,
		extract,
		line,
		ascii,
		macro,
		type,
		hom,
		equals,
		altmode,
	]) {
		table.register(c);
	}
}
