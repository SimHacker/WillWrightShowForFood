#!/usr/bin/env node
/**
 * catalog — read the catalog files under some directories.
 *
 *   catalog tree [path]            the tree, or the part under path
 *   catalog find [text] [k=v ...]  entries matching the text and every facet given
 *   catalog facets                 each facet's values and counts
 *   catalog by <facet>             the tree by one facet
 *   catalog url <url>              what a URL opens, its mixins, values and what was ignored
 *
 *   --root <dir>   where to look (repeatable; default: the current directory)
 *   --base <path>  the URL prefix (default /cabinet/)
 *   --json         machine-readable output
 */
import { type Catalog, type CatalogNode } from "./catalog.js";
import { parseLaunch } from "./launch.js";
import { loadCatalog } from "./node.js";

function printTree(node: CatalogNode, depth = 0, out: string[] = []): string[] {
	if (depth > 0 || node.path) {
		const mark = node.entry ? (node.entry.runs ? "▶" : "·") : "▸";
		const link = node.link ? ` → ${node.entry?.path}` : "";
		out.push(`${"  ".repeat(depth)}${mark} ${node.title}  [${node.slug}]${link}`);
	}
	for (const c of node.children) printTree(c, depth + (depth > 0 || node.path ? 1 : 0), out);
	return out;
}

function report(catalog: Catalog): void {
	for (const p of catalog.problems) console.error(`problem: ${p.source ?? "?"}: ${p.message}`);
}

function main(argv: string[]): number {
	const roots: string[] = [];
	let base = "/cabinet/";
	let json = false;
	const args: string[] = [];
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i] ?? "";
		if (a === "--root") roots.push(argv[++i] ?? ".");
		else if (a === "--base") base = argv[++i] ?? base;
		else if (a === "--json") json = true;
		else args.push(a);
	}
	const [command = "tree", ...rest] = args;
	const catalog = loadCatalog(roots.length ? roots : ["."]);
	report(catalog);
	const show = (value: unknown, text: () => string) => console.log(json ? JSON.stringify(value, null, 2) : text());

	switch (command) {
		case "tree": {
			const node = catalog.tree(rest[0] ?? "");
			if (!node) return console.error(`nothing at ${rest[0]}`), 1;
			show(node, () => printTree(node).join("\n"));
			return 0;
		}
		case "find": {
			const tags: Record<string, string[]> = {};
			const words: string[] = [];
			for (const r of rest) {
				const m = /^([^=]+)=(.*)$/.exec(r);
				if (m?.[1] !== undefined) (tags[m[1]] ??= []).push(...(m[2] ?? "").split(","));
				else words.push(r);
			}
			const found = catalog.find({ text: words.join(" "), tags });
			show(found, () => found.map((e) => `${e.runs ? "▶" : "·"} ${e.path}  ${e.title}`).join("\n"));
			return 0;
		}
		case "facets": {
			const facets = catalog.facets();
			show(facets, () =>
				Object.entries(facets)
					.map(([f, vs]) => `${f}: ${Object.entries(vs).map(([v, n]) => `${v} (${n})`).join(", ")}`)
					.join("\n")
			);
			return 0;
		}
		case "by": {
			if (!rest[0]) return console.error("by <facet>"), 1;
			const node = catalog.byFacet(rest[0]);
			show(node, () => printTree(node).join("\n"));
			return 0;
		}
		case "url": {
			if (!rest[0]) return console.error("url <url>"), 1;
			const u = new URL(rest[0], "http://catalog.invalid");
			const launch = parseLaunch(catalog, u.pathname, u.search, { base });
			if (!launch) return console.error(`nothing at ${u.pathname}`), 1;
			show(launch, () =>
				[
					`opens: ${launch.entry ? `${launch.entry.title} (${launch.entry.id})` : `folder ${launch.folder?.title}`}`,
					launch.redirect ? `redirect: ${launch.redirect}` : "",
					launch.with.length ? `with: ${launch.with.join(", ")}` : "",
					...Object.entries(launch.values).map(([k, v]) => `${k} = ${JSON.stringify(v)}`),
					...launch.ignored.map((i) => `ignored ${i.param}=${i.value}: ${i.reason}`)
				]
					.filter(Boolean)
					.join("\n")
			);
			return 0;
		}
		default:
			console.error(`unknown command ${command}: tree, find, facets, by, url`);
			return 1;
	}
}

process.exitCode = main(process.argv.slice(2));
