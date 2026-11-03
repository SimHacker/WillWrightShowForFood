// Cut a screen angel look out of a captured screen: the rectangle x y w h of frame.png, with
// any --clear rectangles (in screen coordinates) made transparent so they are not compared.
//
//   node scripts/angel-cut.mjs frame.png x y w h out.png [--clear x,y,w,h ...]
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const cab = join(dirname(fileURLToPath(import.meta.url)), "..");
const { decodePng, encodePng, crop } = await import(join(cab, "dist/angel/png.js"));

const args = process.argv.slice(2);
const clears = [];
for (let i; (i = args.indexOf("--clear")) >= 0; ) clears.push(args.splice(i, 2)[1].split(",").map(Number));
const [frame, x, y, w, h, out] = args;
const [X, Y, Wd, Ht] = [x, y, w, h].map(Number);
const cut = crop(await decodePng(new Uint8Array(readFileSync(frame))), X, Y, Wd, Ht);
for (const [cx, cy, cw, ch] of clears) {
	for (let yy = Math.max(cy, Y); yy < Math.min(cy + ch, Y + Ht); yy++)
		for (let xx = Math.max(cx, X); xx < Math.min(cx + cw, X + Wd); xx++) cut.data[((yy - Y) * cut.width + (xx - X)) * 4 + 3] = 0;
}
writeFileSync(out, await encodePng(cut));
console.log(`${out}: ${cut.width}x${cut.height} at [${X}, ${Y}]`);
