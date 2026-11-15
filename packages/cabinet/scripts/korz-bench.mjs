// The PDP-7 at every Korz level, on the same UNIX v0 boot: Pdp7 (switch statements), KorzPdp7 with
// the resolver's tables, and KorzPdp7 searching the sea. Run `npm run build` first.
//   node scripts/korz-bench.mjs [steps]
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { bootUnixV0 } from "../dist/unixv0.js";
import { parseRbImage } from "../dist/plugins/rb09.js";
import { KorzPdp7 } from "../dist/korz/pdp7.js";

const steps = Number(process.argv[2] ?? 3_000_000);
const tapes = new URL("../tapes/unixv0/", import.meta.url);
const platter = gunzipSync(readFileSync(new URL("image.fs.gz", tapes)));
const bootTape = readFileSync(new URL("boot.rim", tapes));

const levels = [
	["Pdp7", undefined],
	["KorzPdp7 resolve", (o) => new KorzPdp7({ ...o, korz: "resolve" })],
	["KorzPdp7 interpret", (o) => new KorzPdp7({ ...o, korz: "interpret" })],
];

console.log(`UNIX v0 boot, ${steps.toLocaleString()} steps, Node ${process.version}, best of 3`);
for (const [name, cpu] of levels) {
	let best = Infinity;
	let pc = 0;
	for (let round = 0; round < 3; round += 1) {
		const u = bootUnixV0({ image: parseRbImage(platter), bootTape, cpu });
		const t = performance.now();
		u.box.run(steps);
		best = Math.min(best, performance.now() - t);
		pc = u.cpu.pc;
	}
	const mps = steps / best / 1000;
	console.log(`${name.padEnd(20)} ${mps.toFixed(2).padStart(7)} M steps/s ${((best * 1e6) / steps).toFixed(0).padStart(5)} ns/step  pc ${pc.toString(8)}`);
}
