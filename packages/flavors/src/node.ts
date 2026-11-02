import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { FlavorError, type Instance, type Source } from "./flavors.js";
import { build, image, type BuildOptions, type Built } from "./recipe.js";

// Every file under root, skipping dot-directories and node_modules.
export function dirSource(root: string): Source {
	const paths: string[] = [];
	const walk = (rel: string): void => {
		for (const e of readdirSync(join(root, rel), { withFileTypes: true })) {
			if (e.name.startsWith(".") || e.name === "node_modules") continue;
			const p = rel ? `${rel}/${e.name}` : e.name;
			if (e.isDirectory()) walk(p);
			else if (e.isFile()) paths.push(p);
		}
	};
	walk("");
	return { paths: () => paths, read: (p) => readFileSync(join(root, p)) };
}

export interface BakeOptions extends BuildOptions {
	clean?: boolean; // empty a non-empty directory first; without it, a non-empty directory is refused
}

// Build time ends here: the instance's files, templates rendered, the recipe run over them,
// written into a plain directory. That directory is all run time reads.
export async function bake(instance: Instance, out: string, options: BakeOptions): Promise<{ written: string[]; built: Built[] }> {
	const img = image(instance);
	const built = await build(instance, img, options);
	if (existsSync(out) && readdirSync(out).length > 0) {
		if (!options.clean) throw new FlavorError(`${out} is not empty; bake into an empty directory, or clean it`);
		rmSync(out, { recursive: true, force: true });
	}
	const written: string[] = [];
	for (const [path, content] of img) {
		mkdirSync(dirname(join(out, path)), { recursive: true });
		writeFileSync(join(out, path), content);
		written.push(path);
	}
	return { written: written.sort(), built };
}
