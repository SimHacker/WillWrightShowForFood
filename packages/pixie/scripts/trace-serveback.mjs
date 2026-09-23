// Diagnose the serve-back session: where does the CPU halt?
import { readFileSync } from "node:fs";
import {
	BlockletHost,
	Cabinet,
	Clock,
	loadOct,
	Pdp7,
	Teletype,
	TinyTitan,
	Type340,
} from "@wwsff/cabinet";
import { encodeTransfer, photograph } from "../dist/index.js";

const dir = new URL(
	"../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/",
	import.meta.url,
);
const cpu = new Pdp7({ coreWords: 8192 });
loadOct(cpu, readFileSync(new URL("symelec.oct", dir), "utf8"));
loadOct(cpu, readFileSync(new URL("symelec-literals.oct", dir), "utf8"));

const t340 = new Type340({ fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w) });
const tty = new Teletype({ printCycles: 200 });
const titan = new TinyTitan();
const box = new Cabinet({ cpu, devices: [t340, tty, new Clock({ cpu }), titan] });
t340.clock = () => box.cycles;

cpu.pc = 0o22;
for (let i = 0; i < 30 && !t340.lastFrame; i += 1) box.run(100_000);
console.log("boot ok:", !!t340.lastFrame, "halted:", cpu.halted, "pc:", cpu.pc.toString(8));

const photo = photograph((a) => cpu.read(a));
console.log(
	"photo beg/end/savins:",
	photo.beg.toString(8),
	photo.end.toString(8),
	photo.savins.toString(8),
	"words:",
	photo.words.length,
);

const host = BlockletHost.serving(encodeTransfer(photo));
titan.port = host;
for (const ch of "TITAN") tty.type(ch.charCodeAt(0) | 0o200);
tty.type(0o215);

for (let i = 0; i < 100; i += 1) {
	box.run(100_000);
	if (cpu.halted) break;
}
console.log("halted:", cpu.halted, "pc:", cpu.pc.toString(8), "ac:", cpu.ac.toString(8));
console.log("controls:", host.controls.join(","), "disconnected:", host.disconnected);
console.log("tty:", JSON.stringify(tty.printed()));
const after = photograph((a) => cpu.read(a));
let diff = 0;
for (let i = 0; i < photo.words.length; i += 1) if (after.words[i] !== photo.words[i]) diff += 1;
console.log("beg/end/savins after:", after.beg.toString(8), after.end.toString(8), after.savins.toString(8), "changed words:", diff);
