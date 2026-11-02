// Recipes: the build steps that run over an instance's image before it is baked.
//
// An image is the instance's files in memory, templates rendered, by path. The instance's
// `recipe` value is a list of steps, combined by `id`, so a mixin adds a step, replaces one
// (same id) or drops one (remove: true). A step names its builder (`step: zip`) and the
// builder's options. `before: <id>` or `after: <id>` hangs a step on another step, the way a
// Flavors :before or :after daemon hangs on a primary method.
//
// `output` steps write the composed values into the image, one format each: any syntax, or
// `full`, the full form (full.ts). A recipe with no output step gets one: the marker, in YAML.
//
// Builders are plugins. output, zip and unzip come with the package and run in Node and the
// page; builders that run a tool (AppleCommander, Packer) live with the code that has the tool.

import { unzipSync, zipSync } from "fflate";
import { isMap, type Plain, type PlainMap } from "./merge.js";
import { FlavorError, type Content, type Instance } from "./flavors.js";
import { syntaxNamed, type Syntax } from "./syntax.js";
import { FULL } from "./full.js";

export type Image = Map<string, Content>;

export interface Step extends PlainMap {
	id: string;
	step: string;
}

export interface BuildContext {
	image: Image;
	values: PlainMap;
	instance: Instance;
	syntaxes: readonly Syntax[];
}

export interface Builder {
	name: string;
	run(step: Step, context: BuildContext): void | Promise<void>;
}

export interface Built {
	id: string;
	step: string;
	wrote: string[];
	removed: string[];
}

export interface BuildOptions {
	syntaxes: readonly Syntax[];
	builders?: readonly Builder[]; // default output, zip, unzip
	marker?: string; // the default output's file name without extension; default "flavor"
	as?: string; // the default output's format; default yaml
}

export function image(instance: Instance): Image {
	const out: Image = new Map();
	for (const f of instance.files) out.set(f.path, f.load());
	return out;
}

// The steps in the order they run: steps without before or after in the order the recipe
// lists them, each daemon next to its step, daemons on one step in the order listed.
export function steps(recipe: Plain | undefined): Step[] {
	if (recipe === undefined || recipe === null) return [];
	if (!Array.isArray(recipe)) throw new FlavorError("recipe is a list of steps");
	const all = recipe.map((s, i): Step => {
		if (!isMap(s) || typeof s.id !== "string" || typeof s.step !== "string") {
			throw new FlavorError(`recipe step ${i + 1} needs an id and a step: ${JSON.stringify(s)}`);
		}
		if (s.before !== undefined && s.after !== undefined) throw new FlavorError(`recipe step ${s.id} has both before and after`);
		return s as Step;
	});
	const out = all.filter((s) => s.before === undefined && s.after === undefined);
	let waiting = all.filter((s) => s.before !== undefined || s.after !== undefined);
	const afters = new Map<string, number>();
	while (waiting.length) {
		const still: Step[] = [];
		for (const s of waiting) {
			const target = String(s.before ?? s.after);
			const at = out.findIndex((o) => o.id === target);
			if (at < 0) {
				still.push(s);
				continue;
			}
			if (s.before !== undefined) out.splice(at, 0, s);
			else {
				const n = afters.get(target) ?? 0;
				out.splice(at + 1 + n, 0, s);
				afters.set(target, n + 1);
			}
		}
		if (still.length === waiting.length) {
			throw new FlavorError(still.map((s) => `recipe step ${s.id} hangs on ${String(s.before ?? s.after)}, which is not in the recipe`).join("; "));
		}
		waiting = still;
	}
	return out;
}

// Runs the instance's recipe over its image. Returns what each step wrote and removed.
export async function build(instance: Instance, img: Image, options: BuildOptions): Promise<Built[]> {
	const builders = options.builders ?? defaultBuilders;
	const recipe = steps(instance.data.recipe);
	if (!recipe.some((s) => s.step === "output")) {
		const format = options.as ?? "yaml";
		const ext = format === FULL ? ".full.yml" : syntaxNamed(format, options.syntaxes).extensions[0]!;
		recipe.push({ id: "output", step: "output", format, to: (options.marker ?? "flavor") + ext });
	}
	const done: Built[] = [];
	for (const s of recipe) {
		const builder = builders.find((b) => b.name === s.step);
		if (!builder) throw new FlavorError(`recipe step ${s.id}: no builder ${s.step} (have ${builders.map((b) => b.name).join(", ")})`);
		const before = new Map(img);
		try {
			await builder.run(s, { image: img, values: instance.data, instance, syntaxes: options.syntaxes });
		} catch (e) {
			throw new FlavorError(`recipe step ${s.id} (${s.step}): ${(e as Error).message}`);
		}
		const wrote = [...img.keys()].filter((p) => before.get(p) !== img.get(p)).sort();
		const removed = [...before.keys()].filter((p) => !img.has(p)).sort();
		done.push({ id: s.id, step: s.step, wrote, removed });
	}
	return done;
}

export function bytes(content: Content): Uint8Array {
	return typeof content === "string" ? new TextEncoder().encode(content) : content;
}

function option(s: Step, key: string): string {
	const v = s[key];
	if (typeof v !== "string" || !v) throw new Error(`needs ${key}`);
	return v;
}

function under(img: Image, dir: string): string[] {
	const prefix = dir.endsWith("/") ? dir : dir + "/";
	return [...img.keys()].filter((p) => p.startsWith(prefix)).sort();
}

// { step: output, format: ogdl, to: micropak/machine.cfg }: the composed values, comments
// kept, in a syntax; or format: full, the full form as YAML.
export const output: Builder = {
	name: "output",
	run(s, { image: img, instance, syntaxes }) {
		const format = option(s, "format");
		if (format !== FULL) syntaxNamed(format, syntaxes);
		img.set(option(s, "to"), instance.render(format));
	},
};

// { step: zip, from: micropak/, to: game.pak, move?: true }: the files under `from`, at their
// paths below it, into the archive `to`. `move` takes them out of the image.
export const zip: Builder = {
	name: "zip",
	run(s, { image: img }) {
		const from = option(s, "from");
		const to = option(s, "to");
		const paths = under(img, from);
		if (!paths.length) throw new Error(`no files under ${from}`);
		const prefix = from.endsWith("/") ? from : from + "/";
		const entries: Record<string, Uint8Array> = {};
		for (const p of paths) entries[p.slice(prefix.length)] = bytes(img.get(p)!);
		if (s.move === true) for (const p of paths) img.delete(p);
		img.set(to, zipSync(entries, { mtime: new Date(1980, 0, 1) }));
	},
};

// { step: unzip, from: game.pak, to: micropak/, move?: true }: the archive's files under `to`.
// `move` takes the archive out of the image.
export const unzip: Builder = {
	name: "unzip",
	run(s, { image: img }) {
		const from = option(s, "from");
		const to = option(s, "to");
		const archive = img.get(from);
		if (archive === undefined) throw new Error(`no file ${from}`);
		const prefix = to === "" || to.endsWith("/") ? to : to + "/";
		for (const [name, data] of Object.entries(unzipSync(bytes(archive)))) {
			if (!name.endsWith("/")) img.set(prefix + name, data);
		}
		if (s.move === true) img.delete(from);
	},
};

export const defaultBuilders: readonly Builder[] = [output, zip, unzip];
