#!/usr/bin/env node
/**
 * sunos-bar: list and extract SunOS 4 bar archives, such as raw dumps of 1/4" Sun tapes.
 *
 *   sunos-bar info    <archive>               volumes, counts, warnings
 *   sunos-bar list    <archive>               a line per entry, like tar tv
 *   sunos-bar extract <archive> <dir> [prefix...]
 *
 * Extraction never writes outside <dir>: leading slashes are dropped, and names with ".."
 * components are skipped. Compressed files are written uncompressed. Symlinks are made as
 * symlinks only if their target stays inside <dir>; otherwise the target is written to
 * <name>.symlink. Special files are recorded in <dir>/.bar-special.txt rather than created.
 */

import { appendFileSync, existsSync, linkSync, lstatSync, mkdirSync, readFileSync, symlinkSync, unlinkSync, utimesSync, writeFileSync } from "node:fs";
import { dirname, join, normalize, relative, resolve, sep } from "node:path";
import { formatListing, readBar, type BarEntry } from "./bar.js";

function usage(): never {
	console.error("usage: sunos-bar info|list <archive>\n       sunos-bar extract <archive> <dir> [prefix...]");
	process.exit(2);
}

/** The path under root an entry would go to, or null if it would escape. */
export function safePath(root: string, name: string): string | null {
	const cleaned = name.replace(/^\/+/, "").replace(/\/+$/, "");
	if (cleaned === "" || cleaned.split("/").some((p) => p === "..")) return null;
	const full = resolve(root, cleaned);
	const rel = relative(resolve(root), full);
	if (rel.startsWith("..") || rel.startsWith(sep)) return null;
	return full;
}

function isSymlink(p: string): boolean {
	try {
		return lstatSync(p).isSymbolicLink();
	} catch {
		return false;
	}
}

function extract(entries: BarEntry[], root: string, prefixes: string[]): void {
	mkdirSync(root, { recursive: true });
	const wanted = (n: string) => prefixes.length === 0 || prefixes.some((p) => n.replace(/^\/+/, "").startsWith(p.replace(/^\/+/, "")));
	let written = 0;
	let skipped = 0;
	for (const e of entries) {
		if (!wanted(e.name)) continue;
		const out = safePath(root, e.name);
		if (!out) {
			console.error(`skip (unsafe name): ${e.name}`);
			skipped++;
			continue;
		}
		try {
			if (e.kind === "directory") {
				mkdirSync(out, { recursive: true });
			} else if (e.kind === "file") {
				mkdirSync(dirname(out), { recursive: true });
				// On a case-insensitive disk, a symlink "foo -> Foo" made earlier now sits where Foo
				// goes. Keep the file, and keep the link as text.
				if (isSymlink(out)) {
					unlinkSync(out);
					console.error(`case collision: ${e.name} replaces a symlink of the same name in another case`);
				}
				writeFileSync(out, e.contents());
				utimesSync(out, e.mtime, e.mtime);
			} else if (e.kind === "symlink") {
				mkdirSync(dirname(out), { recursive: true });
				const target = normalize(join(dirname(out), e.linkName));
				const inside = !e.linkName.startsWith("/") && safePath(root, relative(root, target)) !== null;
				// A link to its own name in another case points at itself on a case-insensitive disk.
				const selfCase = target.toLowerCase() === out.toLowerCase();
				if (inside && !selfCase) symlinkSync(e.linkName, out);
				else writeFileSync(`${out}.symlink`, `${e.linkName}\n`);
			} else if (e.kind === "hardlink") {
				const from = safePath(root, e.linkName);
				mkdirSync(dirname(out), { recursive: true });
				if (from && existsSync(from)) linkSync(from, out);
				else writeFileSync(`${out}.hardlink`, `${e.linkName}\n`);
			} else {
				appendFileSync(join(root, ".bar-special.txt"), `${e.name}\tmode ${e.mode.toString(8)}\trdev ${e.rdev}\n`);
			}
			written++;
		} catch (err) {
			console.error(`error: ${e.name}: ${(err as Error).message}`);
			skipped++;
		}
	}
	console.error(`${written} extracted, ${skipped} skipped`);
}

function main(argv: string[]): void {
	const [cmd, file, ...rest] = argv;
	if (!cmd || !file) usage();
	const archive = readBar(new Uint8Array(readFileSync(file)));
	if (cmd === "list") {
		for (const e of archive.entries) console.log(formatListing(e));
	} else if (cmd === "info") {
		for (const v of archive.volumes) {
			console.log(`volume ${v.volume} at ${v.offset}: date "${v.date}", ${v.compressed ? "compressed" : "not compressed"}${v.label ? `, label "${v.label}"` : ""}`);
		}
		const kinds = new Map<string, number>();
		for (const e of archive.entries) kinds.set(e.kind, (kinds.get(e.kind) ?? 0) + 1);
		console.log(`${archive.entries.length} entries: ${[...kinds].map(([k, n]) => `${n} ${k}`).join(", ")}`);
		console.log(`${archive.entries.filter((e) => e.compressed).length} stored compressed`);
		console.log(`archive ends at byte ${archive.end}`);
	} else if (cmd === "extract") {
		const [dir, ...prefixes] = rest;
		if (!dir) usage();
		extract(archive.entries, dir, prefixes);
	} else usage();
	for (const w of archive.warnings) console.error(`warning at ${w.offset}: ${w.message}`);
}

if (process.argv[1] && resolve(process.argv[1]).endsWith(`${sep}cli.js`)) main(process.argv.slice(2));
