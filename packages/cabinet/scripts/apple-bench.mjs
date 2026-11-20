// The Apple ][+ at every Korz rung, on the same work. Run `npm run build` first.
//   node scripts/apple-bench.mjs [jmp|dos|basic] [--level switch|compile|resolve|interpret]
// jmp:   DEX / JMP in RAM. The compiler's own loop.
// dos:   DOS 3.3 January 1983, from reset to the ] prompt. The disk sequencer runs.
// basic: that same boot, then Applesoft `10 GOTO 10`. The guest interpreter's loop.
// A Pac-Man attract loop is the same kind of measurement as basic, on
// disk images/games/p/pacman (1983)(atari).dsk. That image is not in this tree.
import { execSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { cpus, tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { M6502 } from "../dist/m6502/m6502.js";
import { Korz6502 } from "../dist/korz/m6502.js";
import { Apple2Plus } from "../dist/korz/apple2/plus.js";
import { DiskII } from "../dist/korz/apple2/disk2.js";
import { textRows } from "../dist/microm8/microm8.js";
import { haveMicroM8, startMicroM8Node } from "../dist/microm8/node.js";

const APPLE_HZ = 1_020_484;
const BLOCK = 24 * 64;
const DOS33 = new URL("../disks/apple2/dos33/dos-3.3-january-1983.dsk", import.meta.url);

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
	const i = args.indexOf(name);
	return i < 0 ? undefined : args[i + 1];
};
const named = args.filter((a, i) => !a.startsWith("--") && !["--level", "--rom", "--steps"].includes(args[i - 1] ?? ""));
const only = opt("--level");
if (only && !["switch", "compile", "resolve", "interpret"].includes(only)) {
	throw new Error(`--level switch, compile, resolve or interpret, not ${only}`);
}

const screenOf = (board) => textRows(board.textPage()).join("\n");
const atPrompt = (board) => /COPYRIGHT APPLE/.test(screenOf(board)) && /^\]/m.test(screenOf(board));

function boot(rom, slotRom, image, rung) {
	const board = new Apple2Plus(rom);
	board.installLanguageCard();
	const disk = new DiskII(slotRom);
	disk.insert(1, image, "dos-3.3-january-1983.dsk");
	board.plug(6, disk);
	const cpu = rung === "switch" ? new M6502(board) : new Korz6502(board, { korz: rung });
	cpu.reset();
	return { board, cpu };
}

function stepsOf(cpu) {
	cpu.step();
	return cpu instanceof Korz6502 ? cpu.lastRun : 1;
}

/** Exactly `n` instructions. A compiled block finishes one instruction at a time. */
function runExact(cpu, n) {
	const korz = cpu instanceof Korz6502 ? cpu : null;
	let done = 0;
	while (done < n) {
		if (korz?.compiler && n - done <= BLOCK) korz.one();
		else cpu.step();
		done += korz?.lastRun ?? 1;
	}
	if (done !== n) throw new Error(`ran ${done} instructions, wanted ${n}`);
}

function until(cpu, pred, cap) {
	let n = 0;
	while (n < cap && !pred()) n += stepsOf(cpu);
	return n;
}

function typeLine(cpu, board, text) {
	for (const ch of text) {
		board.press(ch.charCodeAt(0));
		until(cpu, () => (board.key & 0x80) === 0, 2_000_000);
		if (board.key & 0x80) throw new Error(`key ${JSON.stringify(ch)} was not read\n${screenOf(board)}`);
	}
}

/** Instructions from reset to the ] prompt, on the switch. */
function bootLength(rom, slotRom, image) {
	const { board, cpu } = boot(rom, slotRom, image, "switch");
	let steps = 0;
	for (; steps < 20_000_000; steps += 1) {
		if ((steps & 0x3fff) === 0 && atPrompt(board)) return steps;
		cpu.step();
	}
	throw new Error(`DOS did not prompt:\n${screenOf(board)}`);
}

function jmpMachine(rung) {
	const board = new Apple2Plus(new Uint8Array(0x3000));
	board.ram[0x800] = 0xca;
	board.ram[0x801] = 0x4c;
	board.ram[0x802] = 0x00;
	board.ram[0x803] = 0x08;
	const cpu = rung === "switch" ? new M6502(board) : new Korz6502(board, { korz: rung });
	cpu.pc = 0x800;
	return { board, cpu };
}

function timeInstructions(board, cpu, n) {
	const c0 = board.cycles;
	const t0 = performance.now();
	runExact(cpu, n);
	const ms = performance.now() - t0;
	return { ms, cycles: board.cycles - c0, instructions: n };
}

function rowOf(name, sample, shown) {
	const seconds = sample.ms / 1000;
	return {
		workload: name,
		level: only,
		mhz: sample.cycles / seconds / 1e6,
		times: sample.cycles / seconds / APPLE_HZ,
		minst: sample.instructions / seconds / 1e6,
		seconds,
		cycles: sample.cycles,
		instructions: sample.instructions,
		shown,
	};
}

/** Round 1 is cold. The figure is the quicker of the later rounds. */
function measure(name, rom, slotRom, image, bootSteps) {
	const rounds = name === "jmp" ? 3 : 2;
	const samples = [];
	let shown = "";
	for (let round = 0; round < rounds; round += 1) {
		if (name === "jmp") {
			const m = jmpMachine(only);
			samples.push(timeInstructions(m.board, m.cpu, 2_000_000));
			shown = `pc $${m.cpu.pc.toString(16)}`;
			continue;
		}
		const { board, cpu } = boot(rom, slotRom, image, only);
		if (name === "dos") {
			const sample = timeInstructions(board, cpu, bootSteps);
			if (!atPrompt(board)) throw new Error(`${only} did not reach the prompt:\n${screenOf(board)}`);
			samples.push(sample);
			shown = `pc $${cpu.pc.toString(16)} cycles ${board.cycles}`;
			continue;
		}
		runExact(cpu, bootSteps);
		if (!atPrompt(board)) throw new Error(`${only} did not reach the prompt:\n${screenOf(board)}`);
		typeLine(cpu, board, "10 GOTO 10\r");
		if (!/GOTO/.test(screenOf(board))) throw new Error(`the line did not appear:\n${screenOf(board)}`);
		typeLine(cpu, board, "RUN\r");
		runExact(cpu, 200_000);
		if (/SYNTAX/.test(screenOf(board))) throw new Error(`Applesoft rejected the line:\n${screenOf(board)}`);
		samples.push(timeInstructions(board, cpu, 1_000_000));
		shown = `pc $${cpu.pc.toString(16)}`;
	}
	const later = samples.slice(1);
	const best = later.reduce((a, b) => (a.ms < b.ms ? a : b));
	return rowOf(name, best, shown);
}

const needsRom = (name) => name !== "jmp";

if (flag("--child")) {
	const dir = opt("--rom") ?? "";
	const rom = needsRom(named[0]) ? readFileSync(join(dir, "rom")) : new Uint8Array();
	const slotRom = needsRom(named[0]) ? readFileSync(join(dir, "slot")) : new Uint8Array();
	const image = needsRom(named[0]) ? new Uint8Array(readFileSync(DOS33)) : new Uint8Array();
	console.log(JSON.stringify(measure(named[0], rom, slotRom, image, Number(opt("--steps") ?? 0))));
} else {
	await parent();
}

async function parent() {
	const want = named.length ? named : ["jmp", "dos", "basic"];
	for (const name of want) if (!["jmp", "dos", "basic"].includes(name)) throw new Error(`no workload ${name}`);
	let romDir = "";
	let bootSteps = 0;
	if (want.some(needsRom)) {
		if (!haveMicroM8()) throw new Error("microm8/dist is not built (node scripts/microm8-wasm.mjs)");
		const m = await startMicroM8Node({ profile: "apple2-plus" });
		const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
		try {
			let up = false;
			for (let t = 0; t < 100 && !up; t += 1) {
				up = m.status().pureBoot && m.peek(0xfbb3, 1)[0] === 0xea;
				if (!up) await sleep(100);
			}
			if (!up) throw new Error("microM8 did not reach the ][+ ROM");
			romDir = mkdtempSync(join(tmpdir(), "apple-bench-"));
			writeFileSync(join(romDir, "rom"), m.peek(0xd000, 0x3000));
			writeFileSync(join(romDir, "slot"), m.peek(0xc600, 0x100));
		} finally {
			await m.stop();
		}
		bootSteps = bootLength(readFileSync(join(romDir, "rom")), readFileSync(join(romDir, "slot")), new Uint8Array(readFileSync(DOS33)));
	}
	let commit = "unknown";
	try {
		commit = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
	} catch {
		/* HEAD is still the label when the tree is dirty */
	}
	console.log(`Apple ][+, Node ${process.version}, ${cpus()[0]?.model ?? "unknown"}, ${commit}`);
	if (bootSteps) console.log(`DOS 3.3 reaches ] in ${bootSteps.toLocaleString()} instructions`);
	console.log(`  ${"workload".padEnd(8)} ${"rung".padEnd(12)} ${"M cyc/s".padStart(8)} ${"× Apple".padStart(8)} ${"M inst/s".padStart(9)} ${"seconds".padStart(8)}`);
	const script = fileURLToPath(import.meta.url);
	try {
		for (const name of want) {
			for (const level of ["switch", "compile", "resolve", "interpret"]) {
				if (only && level !== only) continue;
				const pass = ["--child", "--level", level, "--steps", String(bootSteps), ...(romDir ? ["--rom", romDir] : []), name];
				const r = spawnSync(process.execPath, [...process.execArgv, script, ...pass], { encoding: "utf8" });
				if (r.status !== 0) {
					console.error(r.stderr || r.stdout);
					process.exitCode = r.status ?? 1;
					continue;
				}
				const row = JSON.parse(r.stdout.trim().split("\n").pop());
				console.log(
					`  ${row.workload.padEnd(8)} ${row.level.padEnd(12)} ${row.mhz.toFixed(1).padStart(8)} ${row.times.toFixed(1).padStart(8)} ${row.minst.toFixed(1).padStart(9)} ${row.seconds.toFixed(2).padStart(8)}  ${row.shown}`,
				);
			}
		}
	} finally {
		if (romDir) rmSync(romDir, { recursive: true });
	}
}
