// List or extract files on an Apple Pascal volume. The reader is src/apple2/pascal.ts.
// Usage: node scripts/pascal-disk.mjs ls DISK.dsk
//        node scripts/pascal-disk.mjs get DISK.dsk NAME [OUT]   (.TEXT decoded, others raw)
import { readFileSync, writeFileSync } from "node:fs";
import { PascalVolume } from "../dist/apple2/pascal.js";

const [cmd, disk, name, out = name] = process.argv.slice(2);
if (!disk || !["ls", "get"].includes(cmd) || (cmd === "get" && !name)) {
	console.error("usage: pascal-disk.mjs ls DISK | get DISK NAME [OUT]");
	process.exit(2);
}
const vol = new PascalVolume(new Uint8Array(readFileSync(disk)), !/\.po$/i.test(disk));
if (cmd === "ls") {
	console.log(`${vol.name}:`);
	for (const e of vol.entries)
		console.log(`  ${e.name.padEnd(16)} ${e.kind.padEnd(6)} ${String(e.next - e.first).padStart(4)} blocks  ${e.date}`);
} else {
	writeFileSync(out, vol.find(name).kind === "text" ? vol.text(name) : vol.raw(name));
	console.log(out);
}
