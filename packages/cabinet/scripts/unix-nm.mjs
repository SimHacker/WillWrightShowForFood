// PDP-7 UNIX's kernel symbols, from UNIX itself: boot the platter, log in as ken, assemble the
// kernel the way ken's sys.rc does (as sop.s s1.s ... s8.s), and print the namelist with nm.
// Writes tapes/unixv0/kernel.nm, the teletype's paper as nm printed it. Build first (npm run build).
//   node scripts/unix-nm.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { parseRbImage } from "../dist/plugins/rb09.js";
import { bootUnixV0 } from "../dist/unixv0.js";

const tapes = new URL("../tapes/unixv0/", import.meta.url);
const u = bootUnixV0({ image: parseRbImage(gunzipSync(readFileSync(new URL("image.fs.gz", tapes)))), bootTape: readFileSync(new URL("boot.rim", tapes)) });
const line = (text, until = "@ ", max = 40_000_000) => {
	u.type(`${text}\r`);
	if (!u.runUntil(until, max)) throw new Error(`no ${JSON.stringify(until)} after ${text}:\n${u.paper()}`);
};
if (!u.runUntil("login: ")) throw new Error(u.paper());
line("ken", "password: ");
line("ken");
const built = u.box.cycles;
line("as sop.s s1.s s2.s s3.s s4.s s5.s s6.s s7.s s8.s", "@ ", 3_000_000_000);
console.log(`as: ${u.box.cycles - built} cycles`);
const from = u.paper().length;
line("nm n.out", "@ ", 2_000_000_000);
const printed = u.paper().slice(from).replace(/\r/g, "");
const body = printed.split("\n").filter((l) => /^\S+\s+[0-7]{6}\s/.test(l));
writeFileSync(new URL("kernel.nm", tapes), `${body.join("\n")}\n`);
console.log(`kernel.nm: ${body.length} symbols`);
