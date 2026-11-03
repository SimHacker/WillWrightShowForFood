/**
 * Catalog files from the file system: every `catalog.yml` (or `.yaml`, `.json`) under the
 * given directories, skipping node_modules, dist, build and dot directories. Sources are paths
 * relative to `base`, so problems name the file.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { parse } from "yaml";
import { Catalog } from "./catalog.js";

const NAMES = new Set(["catalog.yml", "catalog.yaml", "catalog.json"]);
const SKIP = new Set(["node_modules", "dist", "build", ".svelte-kit"]);

/** Every catalog file under the directories, in a stable order. */
export function findCatalogFiles(dirs: readonly string[]): string[] {
	const out: string[] = [];
	const walk = (dir: string) => {
		let names: string[];
		try {
			names = readdirSync(dir).sort();
		} catch {
			return;
		}
		for (const name of names) {
			if (name.startsWith(".") || SKIP.has(name)) continue;
			const path = join(dir, name);
			let isDir = false;
			try {
				isDir = statSync(path).isDirectory();
			} catch {
				continue;
			}
			if (isDir) walk(path);
			else if (NAMES.has(name)) out.push(path);
		}
	};
	for (const d of dirs) walk(d);
	return out;
}

/** Load the files into a catalog (a new one unless given). A file that won't parse is a problem. */
export function loadCatalogFiles(files: readonly string[], { base = process.cwd(), catalog = new Catalog() } = {}): Catalog {
	for (const file of files) {
		const source = relative(base, file);
		try {
			catalog.add(parse(readFileSync(file, "utf8")), source);
		} catch (e) {
			catalog.problems.push({ source, message: e instanceof Error ? e.message : String(e) });
		}
	}
	return catalog;
}

/** Find and load every catalog file under the directories. */
export function loadCatalog(dirs: readonly string[], options: { base?: string; catalog?: Catalog } = {}): Catalog {
	return loadCatalogFiles(findCatalogFiles(dirs), options);
}
