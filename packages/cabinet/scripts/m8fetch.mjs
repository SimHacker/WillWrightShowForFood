// Fetch disk images from the microM8 server's shared library (the /appleii mount; LIBRARY.tsv
// is the whole library) into disks/apple2, and print each one's DISKS.yml row. The server sends
// some files gzipped; they are stored unpacked.
//
//   node scripts/m8fetch.mjs OUT "library path" [OUT "library path" ...]
//
// OUT is a path under disks/apple2, such as zork/zork-i-r88b-4am.dsk.
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { gunzipSync } from "node:zlib";

const ROOT = join(import.meta.dirname, "../disks/apple2");
const SERVER = "http://microm8.paleotronic.com:6582/files/legacy/";

const pairs = process.argv.slice(2);
if (pairs.length === 0 || pairs.length % 2) {
	console.error('usage: m8fetch.mjs OUT "library path" [OUT "library path" ...]');
	process.exit(2);
}
let failed = 0;
for (let i = 0; i < pairs.length; i += 2) {
	const [out, path] = [pairs[i], pairs[i + 1]];
	const url = SERVER + path.split("/").map(encodeURIComponent).join("/");
	const res = await fetch(url);
	if (!res.ok) {
		console.error(`# ${out}: ${res.status} ${res.statusText} for ${path}`);
		failed++;
		continue;
	}
	let bytes = new Uint8Array(await res.arrayBuffer());
	if (bytes[0] === 0x1f && bytes[1] === 0x8b) bytes = new Uint8Array(gunzipSync(bytes));
	mkdirSync(dirname(join(ROOT, out)), { recursive: true });
	writeFileSync(join(ROOT, out), bytes);
	const sha1 = createHash("sha1").update(bytes).digest("hex");
	console.log(`  - file: ${out}\n    bytes: ${bytes.length}\n    sha1: ${sha1}\n    source: ${JSON.stringify(path)}`);
}
process.exit(failed ? 1 : 0);
