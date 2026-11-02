#!/usr/bin/env node
// flavors <root> list | leaves | order <id> | instantiate <id> | bake <id> <dir> | why <id> <path> | full <id>
//   --marker NAME          marker file name without extension (default flavor)
//   --as FORMAT            instantiate: print in this format; bake: the default output's format
//                          (a syntax, or full; default yaml)
//   --output FORMAT=PATH   bake: add an output step (repeatable): --output full=flavor.full.yml
//   --overlay ID|FILE      pass-two overlay: a flavor id, or a file of values and parents
//   --rules FILE           { rules: [...], files: [...] } in any known syntax
//   --ext .cfg=ogdl        read an extension as a syntax
//   --clean                bake: empty a non-empty directory first

import { existsSync, readFileSync } from "node:fs";
import { Flavors, type FileRule, type Overlay } from "./flavors.js";
import { isMap, type PlainMap, type Rule } from "./merge.js";
import { bake, dirSource } from "./node.js";
import { ogdl } from "./ogdl.js";
import { json, syntaxFor, syntaxNamed, type Syntax } from "./syntax.js";
import { yaml } from "./yaml.js";

const USAGE = "usage: flavors <root> list | leaves | order <id> | instantiate <id> | bake <id> <dir> | why <id> <path> | full <id>\n";
const SWITCHES = new Set(["--clean"]);

async function main(argv: string[]): Promise<number> {
	const flags = new Map<string, string>();
	const exts: [string, string][] = [];
	const outputs: string[] = [];
	const args: string[] = [];
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i]!;
		if (SWITCHES.has(a)) flags.set(a.slice(2), "true");
		else if (a.startsWith("--")) {
			const v = argv[++i] ?? "";
			if (a === "--ext") exts.push(v.split("=") as [string, string]);
			else if (a === "--output") outputs.push(v);
			else flags.set(a.slice(2), v);
		} else args.push(a);
	}
	const [root, command, id, path] = args;
	if (!root || !command) {
		process.stderr.write(USAGE);
		return 2;
	}
	let syntaxes: Syntax[] = [yaml, json, ogdl];
	for (const [ext, name] of exts) {
		const s = syntaxNamed(name, syntaxes);
		syntaxes = syntaxes.map((x) => (x === s ? { ...x, extensions: [...x.extensions, ext.startsWith(".") ? ext : "." + ext] } : x));
	}
	const parse = (file: string): PlainMap => {
		const hit = syntaxFor(file, syntaxes);
		if (!hit) throw new Error(`${file}: unknown syntax`);
		const v = hit.syntax.parse(readFileSync(file, "utf8")).value;
		if (!isMap(v)) throw new Error(`${file}: not a map`);
		return v;
	};
	const ruleFile = flags.get("rules") ? parse(flags.get("rules")!) : {};
	const marker = flags.get("marker") ?? "flavor";
	const flavors = new Flavors(dirSource(root), {
		marker,
		syntaxes,
		...(Array.isArray(ruleFile.rules) ? { rules: ruleFile.rules as unknown as Rule[] } : {}),
		...(Array.isArray(ruleFile.files) ? { files: ruleFile.files as unknown as FileRule[] } : {}),
	});
	const out = (s: string): void => void process.stdout.write(s.endsWith("\n") ? s : s + "\n");
	const need = (): string => {
		if (!id) throw new Error(`${command} needs a flavor id`);
		return flavors.find(id);
	};
	const instance = () => {
		const overlays: Overlay[] = [];
		const o = flags.get("overlay");
		if (o !== undefined) overlays.push(existsSync(o) ? parse(o) : o);
		if (outputs.length) {
			const recipe = outputs.map((spec) => {
				const eq = spec.indexOf("=");
				if (eq < 1) throw new Error(`--output ${spec}: give FORMAT=PATH`);
				return { id: `output ${spec.slice(eq + 1)}`, step: "output", format: spec.slice(0, eq), to: spec.slice(eq + 1) };
			});
			overlays.push({ recipe });
		}
		return flavors.instantiate(need(), { overlay: overlays });
	};

	switch (command) {
		case "list":
			for (const f of flavors.ids()) out(`${f}${flavors.get(f).parents.length ? "  < " + flavors.parentsOf(f).join(", ") : ""}`);
			return 0;
		case "leaves":
			for (const f of flavors.leaves()) out(f);
			return 0;
		case "order":
			out(flavors.order(need()).join("\n"));
			return 0;
		case "instantiate":
			out(instance().render(flags.get("as") ?? "yaml"));
			return 0;
		case "full":
			out(instance().render("full"));
			return 0;
		case "bake": {
			if (!path) throw new Error("bake needs a directory to bake into");
			const { written, built } = await bake(instance(), path, {
				marker,
				syntaxes,
				clean: flags.has("clean"),
				...(flags.get("as") ? { as: flags.get("as")! } : {}),
			});
			for (const b of built) out(`${b.id} (${b.step}): ${[...b.wrote.map((w) => "+" + w), ...b.removed.map((r) => "-" + r)].join(" ") || "no change"}`);
			out(`${written.length} files in ${path}`);
			return 0;
		}
		case "why": {
			if (!path) throw new Error("why needs a value path, like machine.memory");
			const values = instance().full().values as PlainMap;
			const hits = Object.fromEntries(Object.entries(values).filter(([k]) => k === path || k.startsWith(path + ".") || k.startsWith(path + "[")));
			out(Object.keys(hits).length ? yaml.stringify(hits) : `${path}: never set`);
			return 0;
		}
	}
	process.stderr.write(`unknown command ${command}\n`);
	return 2;
}

main(process.argv.slice(2)).then(
	(code) => (process.exitCode = code),
	(e: unknown) => {
		process.stderr.write(`flavors: ${(e as Error).message}\n`);
		process.exitCode = 1;
	},
);
