// Bench-side diagnosis: where does the SYMELEC boot spin?
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
const display = {
	name: "display",
	iots: [0o05, 0o06, 0o07, 0o10],
	seen: [],
	iot(req) {
		this.seen.push([req.device, req.pulse]);
		return { ac: req.ac };
	},
};
const tty = new Teletype({ printCycles: 1000 });
const clock = new Clock({ cpu });
const box = new Cabinet({ cpu, devices: [display, tty, clock, titan] });

cpu.pc = 0o22;
const pcCount = new Map();
const iotLog = [];
for (let i = 0; i < 500_000; i += 1) {
	const pc = cpu.pc;
	pcCount.set(pc, (pcCount.get(pc) ?? 0) + 1);
	const s = box.step();
	if (s.iot && iotLog.length < 40) iotLog.push({ i, pc: pc.toString(8), dev: s.iot.device.toString(8), pulse: s.iot.pulse.toString(8) });
	if (s.halt) {
		console.log("HALT at", pc.toString(8), "step", i);
		break;
	}
}

const top = [...pcCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
console.log("hottest PCs:");
for (const [pc, n] of top) {
	const w = cpu.read(pc);
	console.log(`  ${pc.toString(8).padStart(5, "0")}  ${w.toString(8).padStart(6, "0")}  ×${n}`);
}
console.log("first IOTs:", iotLog);
console.log("tty printed:", JSON.stringify(tty.printed()));
console.log("display IOTs:", display.seen.slice(0, 10));
console.log("final pc:", cpu.pc.toString(8), "ion:", cpu.ion, "loc0:", cpu.read(0).toString(8), "loc1:", cpu.read(1).toString(8));
