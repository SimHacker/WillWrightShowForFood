/**
 * Mitch's PDP-7 Forth dictionary, read from core by name, for watching a word from outside the
 * machine. A header word holds the name's length (bits 17-13), the kind of word (bits 11-9) and
 * the distance back to the previous header (bits 8-0); `latest` holds the newest header. Names
 * are six-bit characters (ASCII less 040), three to a word, and the two kernels keep them
 * differently:
 *
 * - kernel-names-full.s lays the whole name down before the header, and the body follows it;
 * - kernel.s keeps the length and the first three characters: one word after the header, then
 *   the body. Its labels have no `hbase`, mkhdr's note of where a full name starts.
 *
 * A VARIABLE's cell, and a CONSTANT's value, is the first word of the body.
 */

const A = 0o17777;
const LINK = 0o777;
const KINDS = ["colon", "prim", "const", "var"] as const;

export type ForthKind = (typeof KINDS)[number] | "other";
/** `name` is the whole name with the full-names kernel, its first three characters with kernel.s. */
export type ForthWord = { readonly name: string; readonly length: number; readonly header: number; readonly body: number; readonly kind: ForthKind };

const chars = (c: number, n: number) => [12, 6, 0].slice(0, n).map((s) => String.fromCharCode(((c >>> s) & 0o77) + 0o40)).join("");

/** Every word in the dictionary, newest first. */
export function forthWords(read: (addr: number) => number, labels: ReadonlyMap<string, number>): ForthWord[] {
	const latest = labels.get("latest");
	if (latest === undefined) return [];
	const full = labels.has("hbase");
	const out: ForthWord[] = [];
	let h = read(latest) & A;
	for (let n = 0; n < 4096 && h; n += 1) {
		const w = read(h);
		const len = (w >>> 13) & 0o37;
		let name = "";
		if (full) for (let i = Math.max(1, Math.ceil(len / 3)); i > 0; i -= 1) name += chars(read((h - i) & A), Math.min(3, len - name.length));
		else name = chars(read((h + 1) & A), Math.min(3, len));
		out.push({ name, length: len, header: h, body: (h + (full ? 1 : 2)) & A, kind: KINDS[(w >>> 9) & 7] ?? "other" });
		const link = w & LINK;
		if (link === 0) break;
		h = (h - link - 1) & A;
	}
	return out;
}

/**
 * The address to watch for `name`: a kernel label is its own cell (`dp`, `rfree`); a Forth
 * VARIABLE is its body's cell (`tx`, `dl>`); a CONSTANT that names a cell, as RFREE
 * and RBEG do, is the cell it names. Upper or lower case. -1 if there is no such word.
 */
export function forthCell(read: (addr: number) => number, labels: ReadonlyMap<string, number>, name: string): number {
	const label = labels.get(name) ?? labels.get(name.toLowerCase());
	if (label !== undefined) return label;
	const want = name.toUpperCase();
	const w = forthWords(read, labels).find((w) => w.length === want.length && want.startsWith(w.name));
	if (!w) return -1;
	if (w.kind === "var") return w.body;
	if (w.kind === "const") return read(w.body) & A;
	return -1;
}
