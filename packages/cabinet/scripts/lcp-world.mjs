// A Little Computer People Commodore 64 disk as a house directory with its resident as a
// character, and back. The core is src/c64/lcp.ts.
// Usage: node scripts/lcp-world.mjs export DISK.d64 DIR      (merges into DIR)
//        node scripts/lcp-world.mjs import DIR BASE.d64 OUT.d64
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { D64 } from "../dist/c64/d64.js";
import { exportHouse, House, importHouse } from "../dist/c64/lcp.js";
import { readTree, sha1, writeTree } from "./world-files.mjs";

const [cmd, a, b, c] = process.argv.slice(2);
if (cmd === "export" && a && b) {
	const bytes = new Uint8Array(readFileSync(a));
	writeTree(b, exportHouse(new House(new D64(bytes)), { source: basename(a), sha1: sha1(bytes), existing: readTree(b) }));
} else if (cmd === "import" && a && b && c) {
	const disk = new D64(new Uint8Array(readFileSync(b)));
	importHouse(readTree(a), new House(disk));
	writeFileSync(c, disk.image);
	console.error(`wrote ${c}`);
} else {
	console.error("usage: lcp-world.mjs export DISK.d64 DIR | import DIR BASE.d64 OUT.d64");
	process.exit(2);
}
