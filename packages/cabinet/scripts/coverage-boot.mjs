// Coverage evidence: which EAE words, OPR words, and IOTs does SYMELEC
// actually execute, and what display file does IDLA point at?
import { readFileSync } from "node:fs";
import { Cabinet } from "../dist/cabinet.js";
import { loadOct } from "../dist/loader.js";
import { Clock } from "../dist/plugins/clock.js";
import { Pdp7 } from "../dist/plugins/pdp7.js";
import { Teletype } from "../dist/plugins/teletype.js";

const dir = "../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/";
const cpu = new Pdp7({ coreWords: 8192 });
loadOct(cpu, readFileSync(new URL(`${dir}symelec.oct`, import.meta.url), "utf8"));
loadOct(cpu, readFileSync(new URL(`${dir}symelec-literals.oct`, import.meta.url), "utf8"));

const titan = {
	name: "titan",
	iots: [0o22, 0o23],
	iot: (req) => ({ ac: req.ac, skip: (req.pulse & 1) === 1 }),
};
let idlaAddr = -1;
const display = {
	name: "display",
	iots: [0o05, 0o06, 0o07, 0o10],
	iot(req) {
		if (req.device === 0o06 && req.pulse === 0o06 && idlaAddr < 0) idlaAddr = req.ac;
		return { ac: req.ac };
	},
};
const tty = new Teletype({ printCycles: 1000 });
const clock = new Clock({ cpu });
const box = new Cabinet({ cpu, devices: [display, tty, clock, titan] });

cpu.pc = 0o22;
const eae = new Map();
const opr = new Map();
const iots = new Map();
for (let i = 0; i < 2_000_000; i += 1) {
	const w = cpu.read(cpu.pc);
	const op = (w >> 14) & 0o17;
	if (op === 0o64 >> 2) eae.set(w, (eae.get(w) ?? 0) + 1);
	if (op === 0o74 >> 2) opr.set(w, (opr.get(w) ?? 0) + 1);
	if (op === 0o70 >> 2) iots.set(w, (iots.get(w) ?? 0) + 1);
	const s = box.step();
	if (s.halt) {
		console.log("HALT at step", i, "pc", cpu.pc.toString(8));
		break;
	}
}

const show = (m) =>
	[...m.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([w, n]) => `${w.toString(8).padStart(6, "0")}×${n}`)
		.join(" ");
console.log("EAE words executed:", show(eae) || "(none)");
console.log("OPR words executed:", show(opr));
console.log("IOT words executed:", show(iots));
console.log("IDLA display file address:", idlaAddr.toString(8));
if (idlaAddr >= 0) {
	const words = [];
	for (let a = idlaAddr; a < idlaAddr + 24; a += 1)
		words.push(`${a.toString(8)}:${cpu.read(a).toString(8).padStart(6, "0")}`);
	console.log("display file head:", words.join(" "));
}
