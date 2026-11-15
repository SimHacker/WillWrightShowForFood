// The PDP-7 at every Korz level, on the same workloads: Pdp7 (switch statements), KorzPdp7 compiled,
// KorzPdp7 with the resolver's tables, and KorzPdp7 searching the sea. Run `npm run build` first.
//   node scripts/korz-bench.mjs [workload...] [--steps N] [--rounds N] [--level pdp7|compile|resolve|interpret] [--display switch|slots] [--mixed] [--record] [--check]
// Workloads: unix (UNIX v0 boot), hand (ULTIMATE-HAND in Forth: DataHand, 340, Ultimate Machine),
// turing (the Turing engine running BCOUNT free while Forth draws its tape on the 340).
// --display slots gives the Korz levels a 340 that decodes its words from slots (KorzType340);
// the default is Type340's switch on every level.
// --record appends one JSON line per level and workload to bench-results/korz.jsonl.
// --check compares with the last recorded run on the same machine, Node, workload, level and step count,
// and exits 1 if the result changed or the steady figure is more than 10% slower.
import { execSync, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { cpus } from "node:os";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import { Cabinet } from "../dist/cabinet.js";
import { assembleForthKernel, bootForth, compileForth } from "../dist/forth.js";
import { KorzPdp7 } from "../dist/korz/pdp7.js";
import { KorzType340 } from "../dist/korz/type340.js";
import { DataHand } from "../dist/plugins/datahand.js";
import { syntheticHand, wavingHand } from "../dist/plugins/hand.js";
import { Pdp7 } from "../dist/plugins/pdp7.js";
import { parseRbImage } from "../dist/plugins/rb09.js";
import { Teletype } from "../dist/plugins/teletype.js";
import { TuringDevice } from "../dist/plugins/turing.js";
import { Type340 } from "../dist/plugins/type340.js";
import { UltimateMachine } from "../dist/plugins/ultimate.js";
import { bootUnixV0 } from "../dist/unixv0.js";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
	const i = args.indexOf(name);
	return i < 0 ? undefined : Number(args[i + 1]);
};
const named = args.filter((a, i) => !a.startsWith("--") && !["--steps", "--level", "--rounds", "--display"].includes(args[i - 1] ?? ""));
const displayKind = args.includes("--display") ? args[args.indexOf("--display") + 1] : "switch";
if (!["switch", "slots"].includes(displayKind)) throw new Error(`--display switch or slots, not ${displayKind}`);
const display = (cpu, o) => (displayKind === "slots" && cpu instanceof KorzPdp7 ? new KorzType340(o) : new Type340(o));
const only = args.includes("--level") ? args[args.indexOf("--level") + 1] : undefined;
if (only && !["pdp7", "compile", "resolve", "interpret"].includes(only)) throw new Error(`--level pdp7, compile, resolve or interpret, not ${only}`);

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
	const t340 = display(cpu, { fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w), onFrame: () => (frames += 1) });
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

let turingImage = null;
/** The Turing engine running BCOUNT free (0 SPEED), drawing its tape on the 340 while Forth waits for a key. */
function turing(make) {
	turingImage ??= compileForth({
		kernel: assembleForthKernel({
			sop: text("pdp7unix/sop.s"),
			kernel: text("pdp7forth/kernel-names-full.s"),
			end: text("pdp7forth/end.s"),
			kernelName: "kernel-names-full.s",
		}),
		sources: ["prelude.fs", "does.fs", "turtle.fs", "code.fs", "interrupt.fs", "tags.fs", "turing.fs", "pcomp-tm.fs"].map(
			(f) => text(`pdp7forth/${f}`),
		),
	});
	const cpu = make({ coreWords: 8192 });
	let paper = "";
	const t340 = display(cpu, { fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w) });
	const tty = new Teletype({ printCycles: 1000, onPrint: (c) => (paper += String.fromCharCode(c & 0o177)) });
	const tm = new TuringDevice({ fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w), rate: 1 / 3 });
	const box = new Cabinet({ cpu, devices: [t340, tty, tm] });
	t340.clock = () => box.cycles;
	bootForth(cpu, turingImage);
	box.run(300_000);
	const line = (s) => {
		const from = paper.length;
		for (const ch of `${s}\r`) tty.type(ch.charCodeAt(0) | 0o200);
		for (let n = 0; n < 100 && !/ok\r\n$/.test(paper.slice(from)); n += 1) box.run(50_000);
	};
	line("BCOUNT");
	line("0 SPEED");
	for (const ch of "RUN\r") tty.type(ch.charCodeAt(0) | 0o200);
	box.run(200_000);
	const e = tm.engine;
	return { box, cpu, result: () => `pc ${cpu.pc.toString(8)} transitions ${e.count} state ${e.state} head ${e.head}` };
}

const workloads = {
	unix: { title: "UNIX v0 boot", steps: 3_000_000, build: (cpu) => unix(cpu) },
	hand: { title: "ULTIMATE-HAND, procedural hand", steps: 10_000_000, build: (cpu) => hand(cpu ?? ((o) => new Pdp7(o))) },
	turing: { title: "Turing engine, BCOUNT running free", steps: 5_000_000, build: (cpu) => turing(cpu ?? ((o) => new Pdp7(o))) },
};

const levels = [
	["pdp7", "Pdp7", undefined],
	["compile", "KorzPdp7 compile", (o) => new KorzPdp7({ ...o, korz: "compile" })],
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
const recordFile = new URL("../bench-results/korz.jsonl", import.meta.url);
const recorded = () => (existsSync(recordFile) ? readFileSync(recordFile, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);

// Each workload and level runs in its own process, so V8's feedback from one doesn't slow another.
// Round 1 is cold: its first tenth shows the cost before V8 has tiered up. The steady figure is the
// best of the later rounds. --mixed first runs every workload at every level for a while in the same
// process, the way a page with several machines in it does.
const child = flag("--child");
const rounds = Math.max(2, opt("--rounds") ?? 5);
const mixed = flag("--mixed");
const ns = (ms, n) => (ms * 1e6) / n;
const col = (v) => v.toFixed(0).padStart(5);
for (const name of named.length ? named : Object.keys(workloads)) {
	const w = workloads[name];
	if (!w) throw new Error(`no workload ${name}: ${Object.keys(workloads).join(", ")}`);
	const steps = opt("--steps") ?? w.steps;
	if (!child) {
		console.log(`${w.title}, ${steps.toLocaleString()} steps, Node ${process.version}, ${machine}, ${rounds} rounds, one process each${mixed ? ", mixed" : ""}, 340 ${displayKind}`);
		console.log(`  ${"".padEnd(20)} ${"M steps/s".padStart(9)}  ns/step: steady first-tenth round-1`);
	}
	for (const [key, level, cpu] of levels) {
		if (only && key !== only) continue;
		if (!child) {
			const pass = ["--steps", String(steps), "--rounds", String(rounds), ...(flag("--record") ? ["--record"] : []), ...(flag("--check") ? ["--check"] : []), ...(mixed ? ["--mixed"] : []), "--display", displayKind];
			const r = spawnSync(process.execPath, [...process.execArgv, fileURLToPath(import.meta.url), name, "--level", key, "--child", ...pass], { stdio: "inherit" });
			if (r.status !== 0) process.exitCode = r.status ?? 1;
			continue;
		}
		if (mixed) {
			for (const other of Object.values(workloads)) for (const [, , c] of levels) other.build(c).box.run(500_000);
		}
		let first = 0;
		let tenth = 0;
		let best = Infinity;
		let result = "";
		for (let round = 0; round < rounds; round += 1) {
			const m = w.build(cpu);
			if (round === 0) {
				const t0 = performance.now();
				m.box.run(Math.floor(steps / 10));
				tenth = performance.now() - t0;
				m.box.run(steps - Math.floor(steps / 10));
				first = performance.now() - t0;
			} else {
				const t = performance.now();
				m.box.run(steps);
				best = Math.min(best, performance.now() - t);
			}
			result = m.result();
		}
		const mps = steps / best / 1000;
		console.log(`  ${level.padEnd(20)} ${mps.toFixed(2).padStart(9)}  ${col(ns(best, steps))}  ${col(ns(tenth, Math.floor(steps / 10)))}  ${col(ns(first, steps))}  ${result}`);
		// Every round is a new machine. The first pays for warm-up, so a later machine slower than it
		// means V8 specialized on the first machine's objects and is paying to generalize.
		if (best > first * 1.1) console.log(`  ${"".padEnd(20)} later machines run ${((best / first - 1) * 100).toFixed(0)}% slower than the first`);
		if (flag("--check")) {
			const last = recorded().findLast(
				(r) => r.machine === machine && r.node === process.version && r.workload === name && r.level === level && r.steps === steps && r.mixed === mixed && (r.display ?? "switch") === displayKind,
			);
			const now = ns(best, steps);
			if (!last) console.log(`  ${"".padEnd(20)} nothing recorded for this machine and Node to check against`);
			else {
				if (last.result !== result) {
					console.log(`  ${"".padEnd(20)} RESULT CHANGED from "${last.result}" (${last.commit})`);
					process.exitCode = 1;
				}
				if (now > last.ns * 1.1) {
					console.log(`  ${"".padEnd(20)} SLOWER: ${now.toFixed(1)} ns against ${last.ns} ns at ${last.commit}`);
					process.exitCode = 1;
				} else console.log(`  ${"".padEnd(20)} ${((now / last.ns - 1) * 100).toFixed(0)}% against ${last.ns} ns at ${last.commit}`);
			}
		}
		if (flag("--record")) {
			mkdirSync(new URL("../bench-results/", import.meta.url), { recursive: true });
			const line = {
				date: new Date().toISOString(), commit, node: process.version, machine, workload: name, level, steps, rounds, mixed,
				...(displayKind === "slots" ? { display: "slots" } : {}),
				mps: +mps.toFixed(3), ns: +ns(best, steps).toFixed(1), coldTenthNs: +ns(tenth, Math.floor(steps / 10)).toFixed(1), round1Ns: +ns(first, steps).toFixed(1), result,
			};
			appendFileSync(recordFile, `${JSON.stringify(line)}\n`);
		}
	}
}
