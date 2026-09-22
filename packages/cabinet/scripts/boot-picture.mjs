// Boot SYMELEC, let the 340 execute the display file it builds, and export
// the picture: SVG snapshot + YAML display-list capture into snapshots/.
// Usage: node scripts/boot-picture.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Cabinet } from "../dist/cabinet.js";
import { loadOct } from "../dist/loader.js";
import { toSvg, toYaml } from "../dist/media.js";
import { Clock } from "../dist/plugins/clock.js";
import { Pdp7 } from "../dist/plugins/pdp7.js";
import { Teletype } from "../dist/plugins/teletype.js";
import { Type340 } from "../dist/plugins/type340.js";

const dir = fileURLToPath(
	new URL("../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/", import.meta.url),
);
const cpu = new Pdp7({ coreWords: 8192 });
loadOct(cpu, readFileSync(`${dir}symelec.oct`, "utf8"));
loadOct(cpu, readFileSync(`${dir}symelec-literals.oct`, "utf8"));

const titan = { name: "titan", iots: [0o22, 0o23], iot: (req) => ({ ac: req.ac, skip: (req.pulse & 1) === 1 }) };
const t340 = new Type340({ fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w) });
const box = new Cabinet({
	cpu,
	devices: [t340, new Teletype({ printCycles: 1000 }), new Clock({ cpu }), titan],
});
t340.clock = () => box.cycles;

cpu.pc = 0o22;
for (let i = 0; i < 40 && t340.segments.length < 6000; i += 1) {
	box.run(100_000);
	if (cpu.halted) break;
}

const drawn = t340.lastFrame?.segments ?? t340.segments;
const lit = drawn.filter((s) => s.intensify);
console.log(`cycles=${box.cycles} segments=${drawn.length} lit=${lit.length}`);
console.log(`kinds:`, Object.fromEntries(["point", "vector", "incr", "char"].map((k) => [k, lit.filter((s) => s.kind === k).length])));
const groups = [...new Set(lit.map((s) => s.subr).filter((g) => g !== -1))];
console.log(`dispatch groups: ${groups.map((g) => "0o" + g.toString(8)).join(" ")}`);

const out = fileURLToPath(new URL("../snapshots/", import.meta.url));
mkdirSync(out, { recursive: true });
writeFileSync(`${out}symelec-boot.svg`, toSvg(drawn, { size: 768 }));
writeFileSync(
	`${out}symelec-boot.yml`,
	toYaml({ index: 0, cycleStart: 0, cycleEnd: box.cycles, segments: drawn }),
);
console.log(`wrote snapshots/symelec-boot.svg and .yml`);
