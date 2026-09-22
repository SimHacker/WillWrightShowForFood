import { readFileSync } from "node:fs";
import { createTinyTeco } from "./its.js";

const file = process.argv[2];
if (!file) {
	console.error("usage: pnpm --filter @wwsff/tiny-teco cli <program.teco>");
	process.exit(2);
}

const bytes = new Uint8Array(readFileSync(file));
const engine = createTinyTeco();
engine.load(bytes);
try {
	engine.run();
} catch (err) {
	console.error(err);
	process.exit(1);
}
process.stdout.write(engine.output.join("\n"));
if (engine.output.length) process.stdout.write("\n");
console.error(`halted pc=${engine.pc} point=${engine.buffer.point} qQ=${engine.qregs.get("q").numeric}`);
