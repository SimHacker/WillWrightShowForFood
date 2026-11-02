// Template engines: plugins that turn a template file into the file it names. A file whose
// name ends in an engine's extension (acia.fs.liquid) is rendered at bake time and written
// without it (acia.fs). Data files don't need templates: they are combined as values.

import { Liquid } from "liquidjs";
import type { PlainMap } from "./merge.js";

export interface TemplateContext {
	values: PlainMap; // the instance's composed values
	flavor: string; // the flavor the template file belongs to
	instance: string; // the flavor being instantiated
	path: string; // where the rendered file goes, relative to the image
}

export interface TemplateEngine {
	name: string;
	extensions: readonly string[]; // with the dot: [".liquid"]
	// `read` gives other files by their path in the source, the same path they have in the image.
	render(template: string, context: TemplateContext, read: (path: string) => string): string;
}

export function templateFor(path: string, engines: readonly TemplateEngine[]): { engine: TemplateEngine; out: string } | undefined {
	const lower = path.toLowerCase();
	for (const engine of engines) {
		for (const ext of engine.extensions) {
			if (lower.endsWith(ext.toLowerCase()) && path.length > ext.length) return { engine, out: path.slice(0, -ext.length) };
		}
	}
	return undefined;
}

// LiquidJS: Jinja's {{ }} and {% %}, safe for templates from strangers (no code runs), in
// Node and the page. A missing value or filter is an error, not an empty string.
// {% render "apple2/serial-slot4/acia-init.liquid" %} reads another file by its source path.
export function liquid(options: { name?: string; extensions?: readonly string[] } = {}): TemplateEngine {
	return {
		name: options.name ?? "liquid",
		extensions: options.extensions ?? [".liquid"],
		render(template, context, read) {
			const engine = new Liquid({
				strictVariables: true,
				strictFilters: true,
				relativeReference: false,
				extname: "",
				fs: {
					exists: async (p) => has(read, p),
					existsSync: (p) => has(read, p),
					readFile: async (p) => read(p),
					readFileSync: (p) => read(p),
					resolve: (_dir, file) => file,
					containsSync: () => true,
					contains: async () => true,
				},
				root: [""],
				partials: [""],
				layouts: [""],
				globals: { ...context },
			});
			return engine.parseAndRenderSync(template);
		},
	};
}

function has(read: (path: string) => string, path: string): boolean {
	try {
		read(path);
		return true;
	} catch {
		return false;
	}
}
