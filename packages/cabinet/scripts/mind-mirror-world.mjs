// A Mind Mirror Apple II disk as a directory with each saved life as a character, and back.
// The core is src/apple2/mind-mirror.ts.
// Usage: node scripts/mind-mirror-world.mjs export DISK DIR      (.dsk or .woz; merges into DIR)
//        node scripts/mind-mirror-world.mjs import DIR BASE_DISK OUT.dsk
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { Dos33Volume } from "../dist/apple2/dos33.js";
import { exportDisk, importDisk } from "../dist/apple2/mind-mirror.js";
import { wozToDsk } from "../dist/apple2/woz.js";
import { readTree, sha1, writeTree } from "./world-files.mjs";

function openDisk(path) {
	const bytes = new Uint8Array(readFileSync(path));
	if (!/\.woz$/i.test(path)) return { bytes, volume: new Dos33Volume(bytes) };
	const { image, missing } = wozToDsk(bytes);
	if (missing.length) console.error(`${path}: unreadable sectors ${missing.join(" ")}`);
	return { bytes, volume: new Dos33Volume(image) };
}

const [cmd, a, b, c] = process.argv.slice(2);
if (cmd === "export" && a && b) {
	const { bytes, volume } = openDisk(a);
	writeTree(b, exportDisk(volume, { source: basename(a), sha1: sha1(bytes), existing: readTree(b) }));
} else if (cmd === "import" && a && b && c) {
	const { volume } = openDisk(b);
	importDisk(readTree(a), volume);
	writeFileSync(c, volume.image);
	console.error(`wrote ${c}`);
} else {
	console.error("usage: mind-mirror-world.mjs export DISK DIR | import DIR BASE_DISK OUT.dsk");
	process.exit(2);
}
