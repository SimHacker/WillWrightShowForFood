// The cabinet's catalog: its catalog.yml files plus an entry per Apple disk (CARTRIDGES.md §7a).
//
//   node scripts/catalog.mjs             the tree
//   node scripts/catalog.mjs <path>      the tree under a path
//   node scripts/catalog.mjs by <facet>  the tree by one facet (machine, year, by, language, ...)
//
// Build first (npx tsc -p tsconfig.json). The generic CLI, without the disks: @wwsff/catalog's
// `catalog tree --root packages/cabinet`.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { loadCatalog } from "@wwsff/catalog/node";
import { diskEntries } from "../dist/apple2/disk-catalog.js";

const cabinet = join(dirname(fileURLToPath(import.meta.url)), "..");
const disks = join(cabinet, "disks/apple2");
const read = (p) => parse(readFileSync(p, "utf8"));

const catalog = loadCatalog([cabinet], { base: join(cabinet, "../..") });
const { entries, unplaced } = diskEntries(read(join(disks, "DISKS.yml")), read(join(disks, "catalog.yml")));
catalog.add({ entries }, "packages/cabinet/disks/apple2/DISKS.yml");
for (const p of catalog.problems) console.error(`problem: ${p.source}: ${p.message}`);
for (const f of unplaced) console.error(`no folder for ${f}`);

function print(node, depth = 0) {
	if (node.path) {
		const mark = node.entry ? (node.entry.runs ? "▶" : "·") : "▸";
		console.log(`${"  ".repeat(depth)}${mark} ${node.title}${node.link ? `  → ${node.entry.path}` : ""}`);
	}
	for (const c of node.children) print(c, node.path ? depth + 1 : depth);
}

const [a, b] = process.argv.slice(2);
const node = a === "by" ? catalog.byFacet(b ?? "machine") : catalog.tree(a ?? "");
if (!node) {
	console.error(`nothing at ${a}`);
	process.exitCode = 1;
} else print(node);
