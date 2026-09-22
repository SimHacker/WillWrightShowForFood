import { readFileSync } from "node:fs";
import { createItsEngine } from "./its.js";

const file = process.argv[2];
if (!file) {
	console.error("usage: pnpm --filter @wwsff/teco cli <program.teco>");
	process.exit(2);
}

const bytes = new Uint8Array(readFileSync(file));
const engine = createItsEngine();
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
