// A Wizardry scenario disk as a directory of YAML Jazz files, and back.
// The core is src/apple2/wizardry-world.ts; this reads and writes the disk and the directory.
// Usage: node scripts/wizardry-world.mjs export DISK DIR            (.dsk, .po or .woz; merges into DIR)
//        node scripts/wizardry-world.mjs import DIR BASE_DISK OUT.dsk
//        node scripts/wizardry-world.mjs maze DISK LEVEL
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { PascalVolume } from "../dist/apple2/pascal.js";
import { MAZE_KEY, mazeArt, Scenario } from "../dist/apple2/wizardry.js";
import { exportWorld, importWorld } from "../dist/apple2/wizardry-world.js";
import { wozToDsk } from "../dist/apple2/woz.js";
import { readTree, sha1, writeTree } from "./world-files.mjs";

function openDisk(path) {
	const bytes = new Uint8Array(readFileSync(path));
	if (/\.woz$/i.test(path)) {
		const { image, missing } = wozToDsk(bytes);
		if (missing.length) console.error(`${path}: unreadable sectors ${missing.join(" ")}`);
		return { bytes, volume: new PascalVolume(image) };
	}
	return { bytes, volume: new PascalVolume(bytes, !/\.po$/i.test(path)) };
}

const [cmd, a, b, c] = process.argv.slice(2);
if (cmd === "export" && a && b) {
	const { bytes, volume } = openDisk(a);
	writeTree(b, exportWorld(new Scenario(volume), { source: basename(a), sha1: sha1(bytes), existing: readTree(b) }));
} else if (cmd === "import" && a && b && c) {
	const { volume } = openDisk(b);
	importWorld(readTree(a), new Scenario(volume));
	writeFileSync(c, volume.image());
	console.error(`wrote ${c}`);
} else if (cmd === "maze" && a && b) {
	const sc = new Scenario(openDisk(a).volume);
	const m = sc.maze(Number(b));
	console.log(`${sc.game}, level ${b}\n${MAZE_KEY}\n`);
	console.log(mazeArt(m, m.square_type).map);
} else {
	console.error("usage: wizardry-world.mjs export DISK DIR | import DIR BASE_DISK OUT.dsk | maze DISK LEVEL");
	process.exit(2);
}
