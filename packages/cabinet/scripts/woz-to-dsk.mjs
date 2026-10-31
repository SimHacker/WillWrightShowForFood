// Decode a 5.25" WOZ flux image to a 140K .dsk in DOS 3.3 order. The decoder is src/apple2/woz.ts.
// Usage: node scripts/woz-to-dsk.mjs IN.woz [OUT.dsk]
import { readFileSync, writeFileSync } from "node:fs";
import { wozToDsk } from "../dist/apple2/woz.js";

const [input, output = input?.replace(/\.woz$/i, ".dsk")] = process.argv.slice(2);
if (!input || output === input) {
	console.error("usage: woz-to-dsk.mjs IN.woz [OUT.dsk]");
	process.exit(2);
}
const { image, missing } = wozToDsk(new Uint8Array(readFileSync(input)));
writeFileSync(output, image);
console.log(`${output}${missing.length ? `  (${missing.length} sectors not found: ${missing.join(" ")})` : ""}`);
