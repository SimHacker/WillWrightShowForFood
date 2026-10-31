// A world directory as the path → text map the bridge cores read and write, and disk helpers
// the world scripts share.
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

/** The world's YAML files; a directory that doesn't exist yet is an empty world. */
export function readTree(dir) {
	const files = new Map();
	const walk = (d) => {
		for (const name of readdirSync(d)) {
			const p = join(d, name);
			if (statSync(p).isDirectory()) walk(p);
			else if (/\.ya?ml$/.test(name)) files.set(relative(dir, p).split("\\").join("/"), readFileSync(p, "utf8"));
		}
	};
	try {
		walk(dir);
	} catch (e) {
		if (e.code !== "ENOENT") throw e;
	}
	return files;
}

export function writeTree(dir, files) {
	for (const [path, text] of files) {
		mkdirSync(dirname(join(dir, path)), { recursive: true });
		writeFileSync(join(dir, path), text);
	}
	console.error(`${files.size} files in ${dir}`);
}

export const sha1 = (bytes) => createHash("sha1").update(bytes).digest("hex");
