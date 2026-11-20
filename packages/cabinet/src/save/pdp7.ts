import { parse } from "yaml";
import { coreToRaw, rawToCore, readAll } from "../core.js";
import { Pdp7, type Pdp7Registers } from "../plugins/pdp7.js";
import { MemoryStore } from "./store.js";
import { toYaml } from "./yaml.js";

const STATE = "cpus/pdp7/state.yml";
const CORE = "cpus/pdp7/core.bin";

export type Pdp7Snapshot = {
	format: "snapshot";
	version: 1;
	id: string;
	requires: { cpu: "pdp7" };
	cycles: number;
};

/** Write the paused CPU. `cycles` is the cabinet clock, kept on the snapshot. */
export function savePdp7(store: MemoryStore, cpu: Pdp7, cycles = 0, id = "pdp7"): void {
	const snap: Pdp7Snapshot = { format: "snapshot", version: 1, id, requires: { cpu: "pdp7" }, cycles };
	const regs = cpu.registers();
	store.put("SNAPSHOT.yml", toYaml(snap));
	store.put(STATE, toYaml({ ...regs, coreWords: cpu.coreWords, core: "core.bin", encoding: "uint32-le" }));
	store.put(CORE, coreToRaw(readAll((a) => cpu.read(a), cpu.coreWords)));
}

/** Load into an existing CPU of the same core size. Core is written through `write`. */
export function loadPdp7(store: MemoryStore, cpu: Pdp7): Pdp7Snapshot {
	const snap = parse(store.text("SNAPSHOT.yml")) as Pdp7Snapshot;
	if (snap?.format !== "snapshot" || snap.version !== 1 || snap.requires?.cpu !== "pdp7") {
		throw new Error("not a pdp7 snapshot");
	}
	const doc = parse(store.text(STATE)) as Pdp7Registers & { coreWords: number; core: string; encoding: string };
	if (doc.encoding !== "uint32-le" || doc.core !== "core.bin") throw new Error(`unknown core encoding in ${STATE}`);
	if (doc.coreWords !== cpu.coreWords) throw new Error(`snapshot core is ${doc.coreWords} words, cpu is ${cpu.coreWords}`);
	const raw = store.get(CORE);
	if (!raw) throw new Error(`snapshot has no ${CORE}`);
	const words = rawToCore(raw);
	if (words.length !== cpu.coreWords) throw new Error(`${CORE} is ${words.length} words, cpu is ${cpu.coreWords}`);
	cpu.restoreRegisters(doc);
	cpu.deposit(0, words);
	return snap;
}
