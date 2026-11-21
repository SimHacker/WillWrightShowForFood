// Make an Apple ][ Little Computer People disk for a person whose house number comes from
// another copy of the game: the Guestbook side with his house number, and the House side
// after he has moved in, played on the Korz Apple ][+ by scripts/lcp-angel.mjs from 4am's crack.
//
//   node scripts/lcp-apple-house.mjs CHARACTER.yml OUT-PREFIX [--date MMDDYY]   (after npm run build)
//
// CHARACTER.yml is a worlds/little-computer-people character: lcp.house_number and
// lcp.researcher are used. Writes OUT-PREFIX-guestbook.dsk and OUT-PREFIX-house.dsk.
//
// The Guestbook side keeps the house number in sector 17.1: eight characters stored backwards,
// then NVTCA. The game names the person from it: each character less 48 is a digit, and the
// number mod 256 picks one of 256 eight-byte names on track 8 of the same side, padded with
// dots. The House side keeps him in sector 14.15: his name at $2D, the date at $35 as three
// bytes that read as the typed digits in hex, the researcher at $41.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const cab = join(dirname(fileURLToPath(import.meta.url)), "..");
const disks = join(cab, "disks/apple2/little-computer-people");
const args = process.argv.slice(2);
const at = args.indexOf("--date");
const two = (n) => String(n).padStart(2, "0");
const today = new Date();
const date = at < 0 ? `${two(today.getMonth() + 1)}${two(today.getDate())}${two(today.getFullYear() % 100)}` : args.splice(at, 2)[1];
const [characterFile, prefix] = args;
if (!characterFile || !prefix || !/^\d{6}$/.test(date)) {
	console.error("usage: node scripts/lcp-apple-house.mjs CHARACTER.yml OUT-PREFIX [--date MMDDYY]");
	process.exit(1);
}

const character = parse(readFileSync(characterFile, "utf8"));
const house = String(character.lcp?.house_number ?? "");
if (!/^[0->]{8}$/.test(house)) throw new Error(`${characterFile}: lcp.house_number should be eight characters 0 to >`);
const researcher = String(character.lcp?.researcher ?? "")
	.replace(/[^A-Za-z .'-]/g, "")
	.trim()
	.toUpperCase();
if (!researcher) throw new Error(`${characterFile}: no lcp.researcher`);

const SECTOR = 256;
const sector = (track, s) => (track * 16 + s) * SECTOR;
const sideA = new Uint8Array(readFileSync(join(disks, "lcp-4am-side-a.dsk")));
const numberAt = sector(17, 1);
if (Buffer.from(sideA.subarray(numberAt + 8, numberAt + 13)).toString("latin1") !== "NVTCA") throw new Error("no house number in sector 17.1");
sideA.set(Buffer.from([...house].reverse().join(""), "latin1"), numberAt);

let number = 0;
for (const c of house) number = (number * 10 + c.charCodeAt(0) - 48) % 256;
const nameAt = sector(8, 0) + number * 8;
const expected = Buffer.from(sideA.subarray(nameAt, nameAt + 8)).toString("latin1").replace(/\.+$/, "");

const guestbook = `${prefix}-guestbook.dsk`;
const houseSide = `${prefix}-house.dsk`;
writeFileSync(guestbook, sideA);
console.log(`${guestbook}: house ${house}, number mod 256 = ${number}, so ${expected}`);

const frames = mkdtempSync(join(tmpdir(), "lcp-house-"));
execFileSync(
	process.execPath,
	[join(cab, "scripts/lcp-angel.mjs"), frames, "600", "--side-a", guestbook, "--name", researcher, "--date", date, "--save-b", houseSide],
	{ stdio: "inherit" }
);

const record = readFileSync(houseSide).subarray(sector(14, 15), sector(14, 15) + SECTOR);
const text = (from, n) => Buffer.from(record.subarray(from, from + n)).toString("latin1").replace(/[\0 ]+$/, "");
const name = text(0x2d, 8);
const hex = [...record.subarray(0x35, 0x38)].map((b) => b.toString(16).padStart(2, "0")).join("/");
console.log(`${houseSide}: ${name} lives here, researcher ${text(0x41, 21)}, ${hex}; frames in ${frames}`);
if (name !== expected) throw new Error(`the House side names ${name || "nobody"}, not ${expected}`);
