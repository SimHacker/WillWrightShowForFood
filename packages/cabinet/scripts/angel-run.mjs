// Play an Apple app headless with its screen angel: boot its first start, make the angel's
// automatic moves, answer its asks, and save every screen that changes as a PNG named by machine
// time and state. Used to cut templates (looks) and to check an ANGEL.yml's state machine.
//
//   node scripts/angel-run.mjs <app id> <out dir> [--seconds 600] [--speed 100]
//        [--answer name=DON] [--keys "text@seconds" ...] [--move "label@seconds" ...] [--every 2]
//
// Needs `npm run build` and the microM8 wasm (scripts/microm8-wasm.mjs).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const cab = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(cab, "../..");
const { startMicroM8Node } = await import(join(cab, "dist/microm8/node.js"));
const { FRAME_WIDTH: W, FRAME_HEIGHT: H } = await import(join(cab, "dist/microm8/microm8.js"));
const { Angel, parseAngel, loadLooks, askKeys, fillNow, APPLE_HZ } = await import(join(cab, "dist/angel/angel.js"));
const { encodePng } = await import(join(cab, "dist/angel/png.js"));

const args = process.argv.slice(2);
const opt = (k, d) => {
	const i = args.indexOf(k);
	if (i < 0) return d;
	const v = args[i + 1];
	args.splice(i, 2);
	return v;
};
const many = (k) => {
	const out = [];
	for (let v; (v = opt(k)) !== undefined; ) out.push(v);
	return out;
};
const seconds = Number(opt("--seconds", "600"));
const speed = Number(opt("--speed", "100"));
const every = Number(opt("--every", "2"));
const answers = Object.fromEntries(many("--answer").map((a) => [a.slice(0, a.indexOf("=")), a.slice(a.indexOf("=") + 1)]));
const keys = many("--keys").map((k) => {
	const at = k.lastIndexOf("@");
	return { text: k.slice(0, at).replace(/\\r/g, "\r"), at: Number(k.slice(at + 1)), done: false };
});
const moves = many("--move").map((k) => {
	const at = k.lastIndexOf("@");
	return { label: k.slice(0, at), at: Number(k.slice(at + 1)), done: false };
});
const [appId, out] = args;
if (!appId || !out) throw new Error("usage: angel-run.mjs <app id> <out dir>");

const apps = parse(readFileSync(join(cab, "disks/apple2/APPS.yml"), "utf8")).apps;
const app = apps.find((a) => a.id === appId);
if (!app) throw new Error(`no app ${appId}`);
const disk = (id) => {
	const file = app.disks[id].file;
	return { name: file.split("/").pop(), bytes: new Uint8Array(readFileSync(join(cab, "disks/apple2", file))) };
};

let angel = null;
if (app.angel) {
	const yml = join(repo, app.angel);
	const spec = parseAngel(readFileSync(yml, "utf8"));
	angel = new Angel(spec, await loadLooks(spec.looks, async (png) => new Uint8Array(readFileSync(join(dirname(yml), png)))));
}

mkdirSync(out, { recursive: true });
const m = await startMicroM8Node(app.profile ? { profile: app.profile } : {});
const start = app.starts[0];
start.drives.slice(1).forEach((id, i) => {
	const d = disk(id);
	m.insertDisk(d.name, d.bytes, i + 1);
});
const boot = disk(start.drives[0]);
m.boot(boot.name, boot.bytes);
m.speed(speed);

const act = (label) => {
	const a = app.actions?.find((x) => x.label === label);
	if (!a) return console.log(`  no move ${label}`);
	for (const [drive, id] of Object.entries(a.insert ?? {})) {
		const d = disk(id);
		m.insertDisk(d.name, d.bytes, drive === "drive2" ? 1 : 0);
	}
	if (a.keys) m.type(a.keys);
	console.log(`  move: ${label}`);
};

const px = new Uint8Array(W * H * 4);
let last = null;
let lastAt = -Infinity;
let pending = null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (;;) {
	await sleep(100);
	const t = m.status().cycles / APPLE_HZ;
	if (t > seconds) break;
	m.frame(px);
	const screen = { width: W, height: H, data: px };
	for (const k of keys) if (!k.done && t >= k.at) (k.done = true), m.type(k.text), console.log(`  keys at ${t.toFixed(1)}: ${JSON.stringify(k.text)}`);
	for (const v of moves) if (!v.done && t >= v.at) (v.done = true), act(v.label);
	const changed = angel?.step(screen, t);
	if (changed) {
		console.log(`${t.toFixed(1)}s ${changed.id} [${[...angel.seen].join(" ")}]`);
		if (changed.auto) pending = { at: t + 1, run: () => act(changed.auto) };
		if (changed.ask) {
			const v = answers[changed.id] ?? fillNow(changed.ask.default ?? "");
			pending = { at: t + 1, run: () => (m.type(askKeys(changed.ask, v)), console.log(`  answered ${changed.id}: ${v}`)) };
		}
	}
	if (pending && t >= pending.at) pending.run(), (pending = null);
	let diff = 0;
	if (last) for (let i = 0; i < px.length; i += 4) if (px[i] !== last[i] || px[i + 1] !== last[i + 1] || px[i + 2] !== last[i + 2]) diff++;
	if ((!last || diff > W * H * 0.002) && t - lastAt >= every) {
		last = px.slice();
		lastAt = t;
		const name = `t${t.toFixed(1).padStart(6, "0")}-${angel?.state.id ?? "screen"}.png`;
		writeFileSync(join(out, name), await encodePng({ width: W, height: H, data: px }));
	}
}
console.log(`end at ${seconds}s in ${angel?.state.id ?? "-"} [${[...(angel?.seen ?? [])].join(" ")}]`);
await m.stop();
process.exit(0);
