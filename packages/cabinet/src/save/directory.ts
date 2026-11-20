import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { MemoryStore } from "./store.js";

/**
 * A snapshot as a directory of files. Node only: the browser bundle does not import this module.
 * The same paths `MemoryStore` uses, so a directory and a map are the same snapshot.
 */

export function writeDirectory(dir: string, store: MemoryStore): void {
	rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });
	for (const [path, bytes] of store.files) {
		const full = join(dir, ...path.split("/"));
		mkdirSync(dirname(full), { recursive: true });
		writeFileSync(full, bytes);
	}
}

export function readDirectory(dir: string): MemoryStore {
	const store = new MemoryStore();
	const walk = (rel: string) => {
		for (const ent of readdirSync(join(dir, ...rel.split("/").filter(Boolean)), { withFileTypes: true })) {
			const child = rel ? `${rel}/${ent.name}` : ent.name;
			if (ent.isDirectory()) walk(child);
			else store.put(child, Uint8Array.from(readFileSync(join(dir, ...child.split("/")))));
		}
	};
	walk("");
	return store;
}
