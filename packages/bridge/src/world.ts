// A bridged world is a directory of YAML files, held in memory as path → text so the same
// code runs in a browser, a test, or a CLI that reads and writes a real directory.
// Places inside a file are addressed like URLs, file plus fragment, as the moollm wumpus
// topologies do: `MAZE.yml#level-3/4,7` is square 4,7 of the `level-3` key of MAZE.yml.
// A character is a directory with a CHARACTER.yml, which moollm reads as is.

export type WorldFiles = Map<string, string>;

export interface Location {
	file: string;
	path: string[];
}

export function locationRef(file: string, ...path: (string | number)[]): string {
	return path.length ? `${file}#${path.join("/")}` : file;
}

export function parseLocation(ref: string): Location {
	const hash = ref.indexOf("#");
	if (hash < 0) return { file: ref, path: [] };
	return { file: ref.slice(0, hash), path: ref.slice(hash + 1).split("/").filter(Boolean) };
}

/** A name as a directory name: lower case, runs of anything else become one hyphen. */
export function slug(name: string, fallback = "unnamed"): string {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || fallback;
}

/** Bytes as hex, `width` bytes per line, for byte blobs that have no structure yet. */
export function hexRows(bytes: Uint8Array, width = 32): string {
	const rows: string[] = [];
	for (let o = 0; o < bytes.length; o += width)
		rows.push(Array.from(bytes.subarray(o, o + width), (x) => x.toString(16).padStart(2, "0")).join(""));
	return rows.join("\n") + "\n";
}

export function fromHexRows(text: string): Uint8Array {
	const hex = text.replace(/\s+/g, "");
	if (!/^([0-9a-fA-F]{2})*$/.test(hex)) throw new Error("hex rows must be pairs of hex digits");
	return Uint8Array.from(hex.match(/../g) ?? [], (h) => parseInt(h, 16));
}
