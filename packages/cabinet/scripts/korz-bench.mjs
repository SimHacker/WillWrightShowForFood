// The PDP-7 at every Korz level, on the same workloads: Pdp7 (switch statements), KorzPdp7 with the
// resolver's tables, and KorzPdp7 searching the sea. Run `npm run build` first.
//   node scripts/korz-bench.mjs [workload...] [--steps N] [--level pdp7|resolve|interpret] [--record]
// Workloads: unix (UNIX v0 boot), hand (ULTIMATE-HAND in Forth: DataHand, 340, Ultimate Machine).
// --record appends one JSON line per level and workload to bench-results/korz.jsonl.
import { execSync, spawnSync } from "node:child_process";
import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import { cpus } from "node:os";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import { Cabinet } from "../dist/cabinet.js";
import { assembleForthKernel, bootForth, compileForth } from "../dist/forth.js";
import { KorzPdp7 } from "../dist/korz/pdp7.js";
import { DataHand } from "../dist/plugins/datahand.js";
import { syntheticHand, wavingHand } from "../dist/plugins/hand.js";
import { Pdp7 } from "../dist/plugins/pdp7.js";
import { parseRbImage } from "../dist/plugins/rb09.js";
import { Teletype } from "../dist/plugins/teletype.js";
import { Type340 } from "../dist/plugins/type340.js";
import { UltimateMachine } from "../dist/plugins/ultimate.js";
import { bootUnixV0 } from "../dist/unixv0.js";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
	const i = args.indexOf(name);
	return i < 0 ? undefined : Number(args[i + 1]);
};
const named = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--steps" && args[i - 1] !== "--level");
const only = args.includes("--level") ? args[args.indexOf("--level") + 1] : undefined;
if (only && !["pdp7", "resolve", "interpret"].includes(only)) throw new Error(`--level pdp7, resolve or interpret, not ${only}`);

const tapes = new URL("../tapes/", import.meta.url);
const text = (f) => readFileSync(new URL(f, tapes), "utf8");

const platter = gunzipSync(readFileSync(new URL("unixv0/image.fs.gz", tapes)));
const bootTape = readFileSync(new URL("unixv0/boot.rim", tapes));

function unix(cpu) {
	const u = bootUnixV0({ image: parseRbImage(platter), bootTape, cpu });
	return { box: u.box, cpu: u.cpu, result: () => `pc ${u.cpu.pc.toString(8)}` };
}

let handImage = null;
const fist = [1, 1, 1, 1, 1];
const pose = (curls) => ({ ...syntheticHand({ curls, x: 0.5, y: 0.8, size: 0.3, handedness: "right" }), aspect: 4 / 3 });
/** A 16-second round: nobody, the demo's ghost, your fist, the middle finger up to press, fist, gone. */
function session(t) {
	const s = t % 16;
	if (s < 1) return null;
	if (s < 3) return { ...wavingHand(t), synthetic: true };
	if (s < 6) return pose(fist);
	if (s < 11) return pose([1, 1, 0, 1, 1]);
	if (s < 13) return pose(fist);
	return null;
}

function hand(make) {
	handImage ??= compileForth({
		kernel: assembleForthKernel({
			sop: text("pdp7unix/sop.s"),
			kernel: text("pdp7forth/kernel-names-full.s"),
			end: text("pdp7forth/end.s"),
			kernelName: "kernel-names-full.s",
		}),
		sources: ["prelude.fs", "does.fs", "turtle.fs", "code.fs", "tags.fs", "clip.fs", "turtle3d.fs", "datahand.fs", "ultimate-hand.fs"].map(
			(f) => text(`pdp7forth/${f}`),
		),
	});
	const cpu = make({ coreWords: 8192 });
	let frames = 0;
	const t340 = new Type340({ fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w), onFrame: () => (frames += 1) });
	const tty = new Teletype({ printCycles: 1000 });
	const dh = new DataHand({ source: session });
	const um = new UltimateMachine({ wait: 40_000, open: 60_000, reach: 100_000, press: 40_000, return: 80_000, close: 60_000, rest: 200_000 });
	const box = new Cabinet({ cpu, devices: [t340, tty, dh, um] });
	t340.clock = () => box.cycles;
	bootForth(cpu, handImage);
	box.run(300_000);
	for (const ch of "ULTIMATE-HAND\r") tty.type(ch.charCodeAt(0) | 0o200);
	box.run(1_000_000);
	frames = 0;
	return {
		box,
		cpu,
		result: () => `pc ${cpu.pc.toString(8)} presses ${um.presses} aborts ${um.aborts} latched ${dh.latches} 340 frames ${frames}`,
	};
}

const workloads = {
	unix: { title: "UNIX v0 boot", steps: 3_000_000, build: (cpu) => unix(cpu) },
	hand: { title: "ULTIMATE-HAND, procedural hand", steps: 10_000_000, build: (cpu) => hand(cpu ?? ((o) => new Pdp7(o))) },
};

const levels = [
	["pdp7", "Pdp7", undefined],
	["resolve", "KorzPdp7 resolve", (o) => new KorzPdp7({ ...o, korz: "resolve" })],
	["interpret", "KorzPdp7 interpret", (o) => new KorzPdp7({ ...o, korz: "interpret" })],
];

const commit = (() => {
	try {
		return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
	} catch {
		return "unknown";
	}
})();
const machine = cpus()[0]?.model ?? "unknown";

// Each workload and level runs in its own process, so V8's feedback from one doesn't slow another.
const child = flag("--child");
for (const name of named.length ? named : Object.keys(workloads)) {
	const w = workloads[name];
	if (!w) throw new Error(`no workload ${name}: ${Object.keys(workloads).join(", ")}`);
	const steps = opt("--steps") ?? w.steps;
	if (!child) console.log(`${w.title}, ${steps.toLocaleString()} steps, Node ${process.version}, ${machine}, best of 3, one process each`);
	for (const [key, level, cpu] of levels) {
		if (only && key !== only) continue;
		if (!child) {
			const pass = ["--steps", String(steps), ...(flag("--record") ? ["--record"] : [])];
			const r = spawnSync(process.execPath, [...process.execArgv, fileURLToPath(import.meta.url), name, "--level", key, "--child", ...pass], { stdio: "inherit" });
			if (r.status !== 0) process.exit(r.status ?? 1);
			continue;
		}
		let best = Infinity;
		let result = "";
		for (let round = 0; round < 3; round += 1) {
			const m = w.build(cpu);
			const t = performance.now();
			m.box.run(steps);
			best = Math.min(best, performance.now() - t);
			result = m.result();
		}
		const mps = steps / best / 1000;
		const ns = (best * 1e6) / steps;
		console.log(`  ${level.padEnd(20)} ${mps.toFixed(2).padStart(7)} M steps/s ${ns.toFixed(0).padStart(5)} ns/step  ${result}`);
		if (flag("--record")) {
			mkdirSync(new URL("../bench-results/", import.meta.url), { recursive: true });
			const line = { date: new Date().toISOString(), commit, node: process.version, machine, workload: name, level, steps, mps: +mps.toFixed(3), ns: +ns.toFixed(1), result };
			appendFileSync(new URL("../bench-results/korz.jsonl", import.meta.url), `${JSON.stringify(line)}\n`);
		}
	}
}
