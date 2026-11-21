// Play Little Computer People headless on the Korz Apple ][+ with its screen angel, and print each
// state the angel enters with the machine time. The screen is painted the way the cabinet page
// paints it (apps/ties/src/lib/korz-apple.svelte.js), so a look that matches here matches there.
// Turns the disk over, signs the guestbook as A on 01/01/86, and saves a PNG at every state
// change and every 20 s after the first minute: the frames looks are cut from.
//
//   node scripts/lcp-angel.mjs [out dir] [seconds]      (after npm run build)
//     --side-a FILE --side-b FILE   the two sides; 4am's crack by default
//     --name NAME --date MMDDYY     what is typed when the guestbook asks
//     --save-b FILE                 the House side as the game has written it, at the end
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const cab = join(dirname(fileURLToPath(import.meta.url)), "..");
const { Apple2Plus, DiskII, glyphsFromRom, HIRES_PALETTE, hiresLine } = await import(join(cab, "dist/korz/apple2/index.js"));
const { Korz6502 } = await import(join(cab, "dist/korz/m6502.js"));
const { encodePng } = await import(join(cab, "dist/angel/png.js"));
const { Angel, parseAngel, loadLooks, APPLE_HZ } = await import(join(cab, "dist/angel/angel.js"));

const yml = join(cab, "angels/little-computer-people/ANGEL.yml");
const disks = join(cab, "disks/apple2/little-computer-people");
const args = process.argv.slice(2);
const opt = (k, d) => {
	const i = args.indexOf(k);
	if (i < 0) return d;
	const [, v] = args.splice(i, 2);
	return v;
};
const sideA = opt("--side-a", join(disks, "lcp-4am-side-a.dsk"));
const sideB = opt("--side-b", join(disks, "lcp-4am-side-b.dsk"));
const who = opt("--name", "A");
const when = opt("--date", "010186");
const saveB = opt("--save-b");
const out = args[0] ?? "/tmp/lcp-angel";
const until = Number(args[1] ?? 600);
mkdirSync(out, { recursive: true });
const spec = parseAngel(readFileSync(yml, "utf8"));
const angel = new Angel(spec, await loadLooks(spec.looks, async (p) => new Uint8Array(readFileSync(join(dirname(yml), p)))));

const W = 560, H = 192;
const BLACK = [0, 0, 0], WHITE = [0xf0, 0xf0, 0xf0];
const board = new Apple2Plus(new Uint8Array(readFileSync(join(cab, "roms/apple2/apple2plus.rom"))));
board.installLanguageCard();
const disk = new DiskII(new Uint8Array(readFileSync(join(cab, "roms/apple2/diskii.rom"))));
disk.insert(1, new Uint8Array(readFileSync(sideA)), "side-a.dsk");
board.plug(6, disk);
const cpu = new Korz6502(board, { korz: "compile" });
cpu.reset();
const face = glyphsFromRom(new Uint8Array(readFileSync(join(cab, "roms/apple2/chargen.rom"))));
const data = new Uint8ClampedArray(W * H * 4);
const screen = { width: W, height: H, data };
const hiresBytes = new Uint8Array(40);

function put(at, color) {
	data[at] = color[0];
	data[at + 1] = color[1];
	data[at + 2] = color[2];
	data[at + 3] = 255;
}

function paint(flash) {
	const mode = board.mode();
	const ram = board.ram;
	for (let y = 0; y < H; y++) {
		const hires = mode.graphics && mode.hires && !(mode.mixed && y >= 160);
		for (let col = 0; col < 40; col++) {
			const addr = hires
				? (mode.page2 ? 0x4000 : 0x2000) + (y & 7) * 0x400 + ((y >> 3) & 7) * 0x80 + (y >> 6) * 0x28 + col
				: (mode.page2 ? 0x800 : 0x400) + ((y >> 3) & 7) * 0x80 + (y >> 6) * 0x28 + col;
			const byte = ram[addr] ?? 0;
			if (hires) {
				hiresBytes[col] = byte;
				continue;
			}
			const inverse = byte < 0x40 || (byte < 0x80 && flash);
			const bits = (face[(byte & 0x3f) * 8 + (y & 7)] ?? 0) ^ (inverse ? 0x7f : 0);
			const x0 = (y * W + col * 14) * 4;
			for (let b = 0; b < 7; b++) {
				const color = (bits >> b) & 1 ? WHITE : BLACK;
				put(x0 + b * 8, color);
				put(x0 + b * 8 + 4, color);
			}
		}
		if (hires) {
			const colors = hiresLine(hiresBytes);
			for (let x = 0; x < W; x++) put((y * W + x) * 4, HIRES_PALETTE[colors[x]] ?? BLACK);
		}
	}
}

const keys = [];
const type = (s) => {
	for (const c of s) keys.push(c.charCodeAt(0));
};
const seconds = () => board.cycles / APPLE_HZ;
const shot = (name) => encodePng(screen).then((png) => writeFileSync(join(out, name), png));
let next = 0;
let flipAt = -1;
let lastShot = -1;
console.log(`0.0s ${angel.state.id}`);
while (seconds() < until) {
	cpu.step();
	if (keys.length && !(board.key & 0x80)) board.press(keys.shift());
	if (board.cycles < next) continue;
	next = board.cycles + APPLE_HZ / 5;
	const t = seconds();
	paint(((t * 2) | 0) % 2 === 0);
	const changed = angel.step(screen, t);
	if (changed) {
		console.log(`${t.toFixed(1)}s ${changed.id} [${[...angel.seen].join(" ")}]`);
		await shot(`t${t.toFixed(1).padStart(6, "0")}-${changed.id}.png`);
		if (changed.id === "flip") flipAt = t;
		if (changed.id === "name") type(`${who}\r`);
		if (changed.id === "date") type(`${when}\r`);
	}
	if (flipAt >= 0 && t - flipAt >= 1) {
		flipAt = -1;
		disk.insert(1, new Uint8Array(readFileSync(sideB)), "side-b.dsk");
		keys.push(0x20);
	}
	if (t > 60 && Math.floor(t / 20) !== lastShot) {
		lastShot = Math.floor(t / 20);
		await shot(`every-${String(Math.floor(t)).padStart(4, "0")}-${angel.state.id}.png`);
	}
}
console.log(`end ${seconds().toFixed(1)}s ${angel.state.id} [${[...angel.seen].join(" ")}]`);
if (saveB) writeFileSync(saveB, disk.image(1));
