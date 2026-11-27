// The Zork games' own words for the text adventure angel: boots each disk on microM8, reads the
// story's dictionary out of the Apple's RAM (the interpreter loads it there whole; on the disk
// it is not in one piece), groups the verbs by the parser's verb number, then types each verb
// alone and reads the answer. A verb the game answers with "What do you want to ...?" waits for
// more, so its button types the word and a space and the player finishes it.
//
//   npm run build && node scripts/zork-words.mjs [--write] [--from /tmp/zork-words.json]
//
// --write puts the groups into angels/text-adventures/ANGEL.yml between its zork-words markers;
// without it they are printed. The answers are kept in /tmp/zork-words.json.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const cab = join(dirname(fileURLToPath(import.meta.url)), "..");
const { startMicroM8Node } = await import(join(cab, "dist/microm8/node.js"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const GAMES = [
	{ id: "zork-i", disk: "collection/infocom/zork-i-r88b-4am.dsk", release: 88, every: true },
	{ id: "zork-ii", disk: "collection/infocom/zork-ii-r48-4am.dsk", release: 48 },
	{ id: "zork-iii", disk: "collection/infocom/zork-iii-r17-4am.dsk", release: 17 },
];

// The dictionary keeps six letters; these are the words they were cut from.
const FULL = {
	activa: "activate", brandi: "brandish", comman: "command", consum: "consume", deflat: "deflate",
	descri: "describe", destro: "destroy", diagno: "diagnose", disemb: "disembark", disenc: "disenchant",
	dispat: "dispatch", enchan: "enchant", examin: "examine", exorci: "exorcise", exting: "extinguish",
	froboz: "frobozz", incine: "incinerate", inflat: "inflate", invent: "inventory", liquif: "liquify",
	lubric: "lubricate", northe: "northeast", northw: "northwest", odysse: "odysseus", procee: "proceed",
	punctu: "puncture", releas: "release", restar: "restart", restor: "restore", southe: "southeast",
	southw: "southwest", squeez: "squeeze", startl: "startle", superb: "superbrief", surpri: "surprise",
	swallo: "swallow", treasu: "treasure", ulysse: "ulysses", unatta: "unattach", unfast: "unfasten",
	unscri: "unscript", verbos: "verbose", versio: "version", winnag: "winnage", "$ve": "$verify",
};
// The word a group's button shows, when the group has it.
const PREFER = [
	"look", "take", "examine", "inventory", "go", "wait", "again", "attack", "kill", "put", "give", "drop",
	"read", "eat", "drink", "turn", "tie", "untie", "throw", "ask", "wake", "wave", "swim", "touch", "push",
	"pull", "break", "burn", "cut", "fix", "find", "follow", "climb", "curse", "hello", "jump", "incant",
	"say", "yell", "win", "quit", "superbrief", "fill", "extinguish", "exorcise", "ring", "lift", "squeeze",
	"smell", "hop", "xyzzy", "odysseus", "temple", "melt", "oil", "cross", "lubricate", "free", "mumble",
	"poke", "pour", "press", "answer", "restore", "barf", "board", "brush", "consume", "destroy",
];
// Not offered as buttons or shown in tips: profanity and sexual assault, kept as jokes in the
// parser; and IS, the parser's word for questions, not a command.
const LEAVE_OUT = new Set(["fuck", "shit", "rape", "molest", "is"]);
// Not typed while finding out what waits for more: they leave or rewind the game, or ask for a disk or printer.
const UNTRIED = new Set(["save", "restore", "restart", "quit", "script", "unscript", "$verify"]);

const A = ["abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", " \n0123456789.,!?_#'\"/\\-:()"];
function zword(b, at, len) {
	const zs = [];
	for (let i = 0; i < len; i += 2) {
		const w = (b[at + i] << 8) | b[at + i + 1];
		zs.push((w >> 10) & 31, (w >> 5) & 31, w & 31);
	}
	let s = "", shift = 0;
	for (let i = 0; i < zs.length; i++) {
		const z = zs[i];
		if (z === 0) s += " ";
		else if (z === 4 || z === 5) shift = z - 3;
		else if (shift === 2 && z === 6) { s += String.fromCharCode((zs[i + 1] << 5) | zs[i + 2]); i += 2; shift = 0; }
		else { s += A[shift][z - 6] ?? "?"; shift = 0; }
	}
	return s.trim();
}

/** The story's dictionary, from the Apple's RAM: { word, flags, verb } with verb the parser's verb number or null. */
function dictionary(ram, release) {
	let base = -1;
	for (let at = 0; at < ram.length; at += 256) {
		const digits = [...ram.subarray(at + 0x12, at + 0x18)].every((c) => c >= 0x30 && c <= 0x39);
		if (ram[at] === 3 && digits && ((ram[at + 2] << 8) | ram[at + 3]) === release) { base = at; break; }
	}
	if (base < 0) throw new Error(`release ${release}: no story header in RAM`);
	const s = ram.subarray(base);
	const r = (a) => (s[a] << 8) | s[a + 1];
	const dict = r(0x08);
	const nsep = s[dict];
	const elen = s[dict + 1 + nsep];
	const n = r(dict + 2 + nsep);
	const out = [];
	for (let i = 0; i < n; i++) {
		const e = dict + 4 + nsep + i * elen;
		const flags = s[e + 4];
		out.push({ word: zword(s, e, 4), flags, verb: flags & 0x40 ? ((flags & 3) === 1 ? s[e + 5] : s[e + 6]) : null });
	}
	return out;
}

const full = (w) => FULL[w] ?? w;
const rows = (m) => m.text().map((r) => r.trimEnd());
const lastRow = (t) => t.filter((r) => r.trim()).at(-1)?.trim() ?? "";

/** Type a command and wait for the next prompt; the answer's rows. */
async function ask(m, word) {
	const typed = `>${word.toUpperCase()}`;
	m.type(`${word.toUpperCase()}\r`);
	for (let t = 0; t < 60; t++) {
		await sleep(100);
		const now = rows(m).filter((r) => r.trim());
		const at = now.findLastIndex((r) => r.trim() === typed);
		// The answer is done when a bare prompt, with or without its cursor, follows it.
		if (at >= 0 && at < now.length - 2 && /^>.?$/.test(now.at(-1).trim())) return now.slice(at + 1, -1).join(" ").replace(/\s+/g, " ").trim();
	}
	return "(no prompt)";
}

const DIRS = { n: "n", north: "n", ne: "ne", northe: "ne", e: "e", east: "e", se: "se", southe: "se", s: "s", south: "s", sw: "sw", southw: "sw", w: "w", west: "w", nw: "nw", northw: "nw", u: "up", up: "up", d: "down", down: "down", in: "in", inside: "in", into: "in", out: "out" };
const WORD = { n: "NORTH", ne: "NORTHEAST", e: "EAST", se: "SOUTHEAST", s: "SOUTH", sw: "SOUTHWEST", w: "WEST", nw: "NORTHWEST", up: "UP", down: "DOWN", in: "IN", out: "OUT" };

// --from FILE: the answers a run kept, instead of booting the games again.
const from = process.argv[process.argv.indexOf("--from") + 1];
const found = process.argv.includes("--from") ? JSON.parse(readFileSync(from, "utf8")) : {};
for (const g of process.argv.includes("--from") ? [] : GAMES) {
	const m = await startMicroM8Node({});
	for (let t = 0; t < 100 && !m.status().pureBoot; t++) await sleep(100);
	m.speed(8);
	m.boot(g.disk, new Uint8Array(readFileSync(join(cab, "disks/apple2", g.disk))), false);
	for (let t = 0; t < 120 && !rows(m).some((r) => r.includes("80 COLUMNS?")); t++) await sleep(100);
	m.type("N");
	for (let t = 0; t < 120 && !/^>/.test(lastRow(rows(m))); t++) await sleep(100);
	const words = dictionary(m.peek(0, 0xc000), g.release);
	const groups = new Map();
	for (const w of words) if (w.verb !== null) (groups.get(w.verb) ?? groups.set(w.verb, []).get(w.verb)).push(full(w.word));
	const points = new Set(words.filter((w) => w.flags & 0x10).map((w) => DIRS[w.word]).filter(Boolean));
	// Zork III has no IN; ENTER is its word for going in.
	const compass = Object.fromEntries([...points].map((p) => [p, WORD[p]]));
	if (!points.has("in") && words.some((w) => w.word === "enter" && w.flags & 0x10)) compass.in = "ENTER";
	const verbs = [];
	for (const [n, names] of [...groups].sort((a, b) => b[0] - a[0])) {
		const kept = names.filter((w) => !LEAVE_OUT.has(w) && !/^[a-z]$/.test(w));
		if (!kept.length || names.includes("molest")) continue;
		const word = PREFER.find((p) => kept.includes(p)) ?? [...kept].sort()[0];
		const also = names.filter((w) => w !== word && !LEAVE_OUT.has(w));
		const answer = UNTRIED.has(word) ? null : await ask(m, word);
		// "(DOOR) ..." is the game choosing the object itself: the verb takes one.
		const then = answer !== null && /^((what|where|whom|who) do you want to |\()/i.test(answer);
		verbs.push({ n, word, also, answer, then });
	}
	found[g.id] = { compass, verbs };
	console.error(`${g.id}: ${verbs.length} verbs, ${verbs.filter((v) => v.then).length} wait for more; compass ${Object.keys(compass).join(" ")}`);
}
if (!process.argv.includes("--from")) writeFileSync("/tmp/zork-words.json", JSON.stringify(found, null, 1));

const q = (s) => (/^[A-Z][A-Z ]*$/.test(s) ? s : JSON.stringify(s));
const cmd = (v) => {
	const parts = [`word: ${q(v.word.toUpperCase())}`];
	if (v.then) parts.push("then: true");
	if (v.also.length) parts.push(`also: [${v.also.map((a) => q(a.toUpperCase())).join(", ")}]`);
	return `{ ${parts.join(", ")} }`;
};
let yml = "";
for (const g of GAMES) {
	const { compass, verbs } = found[g.id];
	yml += `  ${g.id}:\n    compass: &${g.id}-compass { ${Object.entries(compass).map(([p, w]) => `${p}: ${w}`).join(", ")} }\n`;
	yml += `    verbs: &${g.id}-verbs\n${verbs.sort((a, b) => a.word.localeCompare(b.word)).map((v) => `      - ${cmd(v)}`).join("\n")}\n`;
}
const BEGIN = "# zork-words: begin";
const END = "# zork-words: end";
if (process.argv.includes("--write")) {
	const file = join(cab, "angels/text-adventures/ANGEL.yml");
	const text = readFileSync(file, "utf8");
	const a = text.indexOf(BEGIN), b = text.indexOf(END);
	if (a < 0 || b < a) throw new Error(`${file}: no zork-words markers`);
	writeFileSync(file, text.slice(0, text.indexOf("\n", a) + 1) + "zork-words:\n" + yml + text.slice(b));
	console.error(`wrote ${file}`);
} else console.log(yml);
process.exit(0);
