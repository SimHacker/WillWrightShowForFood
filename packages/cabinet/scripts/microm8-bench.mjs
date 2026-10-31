// How fast microM8's WebAssembly Apple runs, and where the time goes. Boots DOS 3.3, then runs
// each workload flat out (speed 100) and reports emulated MHz; 1.02 is a real Apple.
//
//   node scripts/microm8-bench.mjs                  workloads, MHz
//   node scripts/microm8-bench.mjs --profile        also a CPU profile of the run, summarised by
//                                                   function and by part of the machine; needs
//                                                   the named build (microm8-wasm.mjs --names)
//   node scripts/microm8-bench.mjs --seconds 8      measure each workload this long (default 5)
//
// Needs `npm run build` (dist/microm8/node.js) and a built module.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
 
const cabinet = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const seconds = Number(args[args.indexOf("--seconds") + 1]) || 5;

if (args.includes("--profile") && !process.env.MICROM8_BENCH_CHILD) {
	const named = join(cabinet, "microm8/dist/microm8-names.wasm");
	const dir = mkdtempSync(join(tmpdir(), "m8prof-"));
	const run = spawnSync(process.execPath, ["--cpu-prof", `--cpu-prof-dir=${dir}`, fileURLToPath(import.meta.url), ...args], {
		stdio: "inherit",
		env: { ...process.env, MICROM8_BENCH_CHILD: "1", MICROM8_WASM: process.env.MICROM8_WASM ?? named },
	});
	if (run.status !== 0) process.exit(run.status ?? 1);
	summarise(JSON.parse(readFileSync(join(dir, readdirSync(dir)[0]), "utf8")));
	rmSync(dir, { recursive: true });
	process.exit(0);
}

const { startMicroM8Node } = await import(join(cabinet, "dist/microm8/node.js"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const m = await startMicroM8Node();
const DOS = join(cabinet, "disks/apple2/dos33/dos-3.3-january-1983.dsk");

async function until(what, ok, limit = 30) {
	for (let t = 0; t < limit * 10; t++) {
		if (ok()) return;
		await sleep(100);
	}
	throw new Error(`timed out waiting for ${what}`);
}

/** Emulated MHz over `seconds`, with the timing taken from the cycle counter. */
async function measure() {
	const a = m.status();
	const t = performance.now();
	await sleep(seconds * 1000);
	const b = m.status();
	return (b.cycles - a.cycles) / ((performance.now() - t) * 1000);
}

const workloads = [
	["prompt", "Applesoft waiting for a key (the keyboard poll loop)", null],
	["basic", "an Applesoft floating-point loop, text screen", "10 A=A*1.0001+1:GOTO 10\nRUN\n"],
	["hires", "Applesoft drawing lines on the hires screen", "HGR\n10 HCOLOR=RND(1)*8:HPLOT RND(1)*279,RND(1)*159 TO RND(1)*279,RND(1)*159:GOTO 10\nRUN\n"],
	["text", "Applesoft printing, scrolling the text screen", "TEXT:HOME\n10 PRINT \"MICROM8 BENCH \";:GOTO 10\nRUN\n"],
];

m.boot("dos.dsk", new Uint8Array(readFileSync(DOS)));
await until("DOS prompt", () => m.text().some((l) => /^\]/.test(l)));
await sleep(1500);
m.speed(100);

const results = [];
for (const [id, what, program] of workloads) {
	m.reset();
	await sleep(300);
	m.type("NEW\n");
	await sleep(300);
	if (program) m.type(program);
	await sleep(1000);
	const mhz = await measure();
	results.push({ id, mhz });
	console.log(`${id.padEnd(7)} ${mhz.toFixed(2).padStart(6)} MHz  ${(mhz / 1.020484).toFixed(2)}x an Apple  ${what}`);
}
await m.stop();

/**
 * Where a V8 CPU profile's time went: self time by function, and total time by part of the
 * machine (a function counts once per sample however deep it recurs).
 */
function summarise(p) {
	const byId = new Map(p.nodes.map((n) => [n.id, n]));
	const parent = new Map();
	for (const n of p.nodes) for (const c of n.children ?? []) parent.set(c, n.id);
	const time = new Map();
	p.samples.forEach((s, i) => time.set(s, (time.get(s) ?? 0) + (p.timeDeltas[i] ?? 0)));
	const name = (id) => byId.get(id).callFrame.functionName || "(program)";
	const short = (f) => f.replace(/^paleotronic\.com_/, "").replace(/__([A-Za-z0-9]+)_\./, "$1.");

	let total = 0;
	const self = new Map();
	const inclusive = new Map();
	for (const [id, t] of time) {
		total += t;
		const f = short(name(id));
		self.set(f, (self.get(f) ?? 0) + t);
		const seen = new Set();
		for (let q = id; q !== undefined; q = parent.get(q)) {
			const g = short(name(q));
			if (seen.has(g)) continue;
			seen.add(g);
			inclusive.set(g, (inclusive.get(g) ?? 0) + t);
		}
	}
	const pct = (t) => ((100 * t) / total).toFixed(1).padStart(5);
	const top = (map, n, keep = () => true) =>
		[...map].filter(([f]) => keep(f)).sort((a, b) => b[1] - a[1]).slice(0, n).map(([f, t]) => `${pct(t)}%  ${f}`).join("\n");

	console.log("\nself time, top 30 functions:\n" + top(self, 30));
	console.log("\ntotal time, machine functions (includes what they call):\n" + top(inclusive, 30, (f) => /^core_|^runtime\.(gcBgMarkWorker|mallocgc)$/.test(f)));

	// What a function's total time is made of: each direct callee's total, and its own.
	const parts = (fn) => {
		const into = new Map();
		for (const [id, t] of time) {
			let below = null;
			for (let q = id; q !== undefined; q = parent.get(q)) {
				if (short(name(q)) === fn) {
					const k = below === null ? "(self)" : short(name(below));
					into.set(k, (into.get(k) ?? 0) + t);
					break;
				}
				below = q;
			}
		}
		return into;
	};
	for (const fn of ["core_hardware_apple2.Apple2IOChip.Increment", "core_hardware_apple2.IOCardDiskII.Increment", "core_memory.MemoryManagementUnit.ProcessListeners", "core_hardware_cpu_mos6502.Core6502.FetchExecute"]) {
		console.log(`\n${fn}, made of:\n` + top(parts(fn), 10));
	}
	// Who allocates: the nearest machine function above each allocation.
	const allocators = new Map();
	for (const [id, t] of time) {
		if (!/^runtime\.(mallocgc|newobject|growslice|makeslice|concatstrings)/.test(name(id))) continue;
		let q = parent.get(id);
		while (q !== undefined && /^runtime\.|^(now|syscall)/.test(name(q))) q = parent.get(q);
		const k = q === undefined ? "?" : short(name(q));
		allocators.set(k, (allocators.get(k) ?? 0) + t);
	}
	console.log("\nallocation self time, by the machine function asking:\n" + top(allocators, 12));

	const gc = [...self].filter(([f]) => /^runtime\.(gc|mark|scan|sweep|malloc|memclr|bgsweep|bulkBarrier|wbBuf|greyobject|findObject|heapBits|nextFreeFast|newobject|growslice|makeslice)/.test(f)).reduce((s, [, t]) => s + t, 0);
	console.log(`\nGo runtime allocation and garbage collection, self time: ${pct(gc)}%`);
	console.log(`idle (waiting on timers, nothing to run): ${pct(self.get("(idle)") ?? 0)}%`);
}
