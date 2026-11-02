// A syntax turns text into values and comments, and back. Every flavor and every
// structured file goes through one, so a YAML parent can have a JSON or OGDL child and the
// result can be written in any of them. Add a syntax by passing it in the options.

import type { Plain } from "./merge.js";
import type { Notes } from "./notes.js";

export interface Parsed {
	value: Plain;
	notes?: Notes;
}

export interface Syntax {
	name: string;
	extensions: readonly string[]; // with the dot; the first is used when writing a new file
	parse(text: string): Parsed;
	stringify(value: Plain, notes?: Notes): string;
}

export const json: Syntax = {
	name: "json",
	extensions: [".json"],
	parse: (text) => ({ value: JSON.parse(text) as Plain }),
	stringify: (value) => JSON.stringify(value, null, "\t") + "\n",
};

export function syntaxFor(path: string, syntaxes: readonly Syntax[]): { syntax: Syntax; stem: string } | undefined {
	let best: { syntax: Syntax; stem: string } | undefined;
	const lower = path.toLowerCase();
	for (const syntax of syntaxes) {
		for (const ext of syntax.extensions) {
			if (lower.endsWith(ext.toLowerCase()) && path.length > ext.length) {
				if (!best || path.length - ext.length < best.stem.length) best = { syntax, stem: path.slice(0, -ext.length) };
			}
		}
	}
	return best;
}

export function syntaxNamed(name: string, syntaxes: readonly Syntax[]): Syntax {
	const s = syntaxes.find((x) => x.name === name || x.extensions.includes(name.startsWith(".") ? name : "." + name));
	if (!s) throw new Error(`no syntax named ${name}; have ${syntaxes.map((x) => x.name).join(", ")}`);
	return s;
}

const decoder = new TextDecoder();

export function text(content: string | Uint8Array): string {
	return typeof content === "string" ? content : decoder.decode(content);
}
