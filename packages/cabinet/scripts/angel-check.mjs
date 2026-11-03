// Replay captured screens (angel-run.mjs names them t<seconds>-<state>.png) through an
// ANGEL.yml in time order: what it sees on each and the state it is in.
//
//   node scripts/angel-check.mjs path/to/ANGEL.yml frames-dir
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const cab = join(dirname(fileURLToPath(import.meta.url)), "..");
const { Angel, parseAngel, loadLooks } = await import(join(cab, "dist/angel/angel.js"));
const { decodePng } = await import(join(cab, "dist/angel/png.js"));

const [yml, dir] = process.argv.slice(2);
const spec = parseAngel(readFileSync(yml, "utf8"));
const angel = new Angel(spec, await loadLooks(spec.looks, async (png) => new Uint8Array(readFileSync(join(dirname(yml), png)))));
for (const f of readdirSync(dir).filter((f) => /^t[\d.]+-.*\.png$/.test(f)).sort()) {
	const t = Number(f.slice(1, f.indexOf("-")));
	angel.step(await decodePng(new Uint8Array(readFileSync(join(dir, f)))), t);
	console.log(`${f.padEnd(28)} ${angel.state.id.padEnd(12)} [${[...angel.seen].join(" ")}]`);
}
