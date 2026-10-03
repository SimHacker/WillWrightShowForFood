/**
 * Whole core, as files. Three forms of one thing, all with location 0 at the start:
 *
 *   raw   4 bytes a word, little-endian, upper 14 bits zero: exactly the Uint32Array the
 *         emulator holds. Byte 3 of every word is 0, so a raw core always contains NUL,
 *         which is how a reader tells it from text.
 *   json  { format, version, wordBits, words: [numbers] }, location 0 first.
 *   yaml  rows of eight octal words keyed by octal address; all-zero rows are left out,
 *         so a sparse core stays short. Words are strings, so no YAML parser can read
 *         them as decimal.
 *
 * Tags and shadow layers (DESIGN.md, "Shadow memory") are never written here.
 */

export const CORE_FORMAT = "pdp7-core";
const WMASK = 0o777777;
const ROW = 8;

export type CoreDoc = {
	format: typeof CORE_FORMAT;
	version: 1;
	wordBits: 18;
	program?: string;
	words?: number[];
	rows?: Record<string, string>;
};

const oct = (n: number, d: number) => n.toString(8).padStart(d, "0");

export function readAll(read: (addr: number) => number, words: number): Uint32Array {
	const core = new Uint32Array(words);
	for (let a = 0; a < words; a += 1) core[a] = read(a) & WMASK;
	return core;
}

export function coreToRaw(core: ArrayLike<number>): Uint8Array {
	const bytes = new Uint8Array(core.length * 4);
	const view = new DataView(bytes.buffer);
	for (let a = 0; a < core.length; a += 1) view.setUint32(a * 4, (core[a] ?? 0) & WMASK, true);
	return bytes;
}

export function rawToCore(bytes: Uint8Array): Uint32Array {
	if (bytes.length % 4 !== 0) throw new Error(`raw core is ${bytes.length} bytes, not a multiple of 4`);
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const core = new Uint32Array(bytes.length / 4);
	for (let a = 0; a < core.length; a += 1) {
		const w = view.getUint32(a * 4, true);
		if (w > WMASK) throw new Error(`word ${oct(a, 5)} is ${w.toString(8)}, wider than 18 bits`);
		core[a] = w;
	}
	return core;
}

export function coreToJson(core: ArrayLike<number>, program?: string): string {
	const doc: CoreDoc = { format: CORE_FORMAT, version: 1, wordBits: 18, ...(program ? { program } : {}), words: Array.from(core, (w) => w & WMASK) };
	return JSON.stringify(doc);
}

export function coreToYaml(core: ArrayLike<number>, program?: string): string {
	const lines = [`format: ${CORE_FORMAT}`, "version: 1", "wordBits: 18", `length: ${core.length}`];
	if (program) lines.push(`program: ${program}`);
	lines.push("rows:");
	let any = false;
	for (let a = 0; a < core.length; a += ROW) {
		const row: string[] = [];
		let zero = true;
		for (let i = 0; i < ROW && a + i < core.length; i += 1) {
			const w = (core[a + i] ?? 0) & WMASK;
			if (w) zero = false;
			row.push(oct(w, 6));
		}
		if (zero) continue;
		any = true;
		lines.push(`  "${oct(a, 5)}": "${row.join(" ")}"`);
	}
	if (!any) lines[lines.length - 1] = "rows: {}";
	return `${lines.join("\n")}\n`;
}

/** A parsed JSON or YAML core document, into core. Words may be numbers or octal strings. */
export function coreFromData(data: unknown, words = 8192): Uint32Array {
	const doc = data as Partial<CoreDoc> & { length?: number };
	if (!doc || doc.format !== CORE_FORMAT) throw new Error(`not a ${CORE_FORMAT} document`);
	const word = (v: unknown): number => {
		const n = typeof v === "number" ? v : Number.parseInt(String(v).replace(/^0o/, ""), 8);
		if (!Number.isInteger(n) || n < 0 || n > WMASK) throw new Error(`not an 18-bit word: ${String(v)}`);
		return n;
	};
	if (Array.isArray(doc.words)) return Uint32Array.from(doc.words, word);
	const core = new Uint32Array(doc.length ?? words);
	for (const [at, row] of Object.entries(doc.rows ?? {})) {
		const base = Number.parseInt(at, 8);
		String(row)
			.trim()
			.split(/\s+/)
			.forEach((w, i) => {
				if (base + i >= core.length) throw new Error(`row ${at} runs past ${oct(core.length, 5)}`);
				core[base + i] = word(w);
			});
	}
	return core;
}

/** Raw if it holds a NUL (text never does), else text handed to `parse` (JSON.parse, or a YAML parser). */
export function readCore(bytes: Uint8Array, parse: (text: string) => unknown = JSON.parse): Uint32Array {
	if (bytes.includes(0)) return rawToCore(bytes);
	return coreFromData(parse(new TextDecoder().decode(bytes)));
}
