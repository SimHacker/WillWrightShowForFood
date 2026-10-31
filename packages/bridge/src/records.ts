// Binary records declared as data, decoded to plain values and encoded back over the
// original bytes. The layout rules are UCSD Pascal's (Apple Pascal 1.1), which Wizardry and
// the rest of the p-System software use; other ABIs get their own rules beside these.
// Unpacked: INTEGER, BOOLEAN, enumerations and subranges are 16-bit little-endian words;
// STRING[n] is a length byte and n characters, rounded up to whole words; records and
// arrays are the sum of their parts. PACKED ARRAY of a scalar that fits in b < 16 bits
// puts floor(16/b) elements in each word from the low bit up, never splitting one across
// words; packed arrays of anything else lay out as unpacked.
// Arrays of BOOLEAN read as bit strings ("0110…", element 0 first) unless they are keyed.
// Encoding writes over a base buffer, so bytes no field describes (string tails, padding
// at the end of a block) keep their values and a round trip is byte for byte.

export type PType =
	| { k: "int" }
	| { k: "bool" }
	| { k: "enum"; names: readonly string[] }
	| { k: "range"; max: number }
	| { k: "string"; n: number }
	| { k: "long"; words: number; base: number }
	| { k: "array"; count: number; of: PType; packed?: boolean; keys?: readonly string[] }
	| { k: "record"; fields: readonly Field[] };

export interface Field {
	/** The key in YAML. */
	key: string;
	/** The field's name in the Pascal source. */
	pascal: string;
	type: PType;
	/** A YAML Jazz comment written beside the key when a file is first made. */
	note?: string;
}

export const int: PType = { k: "int" };
export const bool: PType = { k: "bool" };
/** A number kept as `words` 16-bit digits in `base`, lowest first (Wizardry's TWIZLONG is long(3, 10000)). */
export const long = (words: number, base: number): PType => ({ k: "long", words, base });
export const enumOf = (names: readonly string[]): PType => ({ k: "enum", names });
export const range = (max: number): PType => ({ k: "range", max });
export const str = (n: number): PType => ({ k: "string", n });
export const array = (count: number, of: PType): PType => ({ k: "array", count, of });
export const packed = (count: number, of: PType): PType => ({ k: "array", count, of, packed: true });
/** An array read as a map from `keys` to values; an array of BOOLEAN, as the list of keys that are true. */
export const keyed = (keys: readonly string[], of: PType, isPacked = false): PType =>
	({ k: "array", count: keys.length, of, packed: isPacked, keys });
export const record = (...fields: Field[]): PType => ({ k: "record", fields });
export const f = (key: string, pascal: string, type: PType, note?: string): Field =>
	note === undefined ? { key, pascal, type } : { key, pascal, type, note };

/** Bits an element takes in a packed array, or 0 if it doesn't pack. */
export function packBits(t: PType): number {
	switch (t.k) {
		case "bool":
			return 1;
		case "enum":
			return Math.max(1, Math.ceil(Math.log2(t.names.length)));
		case "range":
			return t.max >= 0x8000 ? 0 : Math.max(1, Math.ceil(Math.log2(t.max + 1)));
		default:
			return 0;
	}
}

export function sizeOf(t: PType): number {
	switch (t.k) {
		case "int":
		case "bool":
		case "enum":
		case "range":
			return 2;
		case "string":
			return (t.n + 2) & ~1;
		case "long":
			return t.words * 2;
		case "record":
			return t.fields.reduce((s, x) => s + sizeOf(x.type), 0);
		case "array": {
			const bits = t.packed ? packBits(t.of) : 0;
			if (bits && bits < 16) return Math.ceil(t.count / Math.floor(16 / bits)) * 2;
			return t.count * sizeOf(t.of);
		}
	}
}

const rd = (b: Uint8Array, o: number) => (b[o] ?? 0) | ((b[o + 1] ?? 0) << 8);
const wr = (b: Uint8Array, o: number, v: number) => {
	b[o] = v & 0xff;
	b[o + 1] = (v >> 8) & 0xff;
};
const signed = (v: number) => (v & 0x8000 ? v - 0x10000 : v);

export type PValue = number | boolean | string | PValue[] | { [key: string]: PValue };

function scalarOut(t: PType, raw: number): PValue {
	switch (t.k) {
		case "bool":
			return raw !== 0;
		case "enum":
			return t.names[raw] ?? raw;
		default:
			return t.k === "int" ? signed(raw) : raw;
	}
}

function scalarIn(t: PType, v: PValue): number {
	if (t.k === "bool") return v === true || v === 1 ? 1 : 0;
	if (t.k === "enum" && typeof v === "string") {
		const i = t.names.indexOf(v);
		if (i < 0) throw new Error(`${v} is not one of ${t.names.join(", ")}`);
		return i;
	}
	if (typeof v !== "number") throw new Error(`expected a number, got ${JSON.stringify(v)}`);
	return v & 0xffff;
}

export function decode(t: PType, b: Uint8Array, o: number): PValue {
	switch (t.k) {
		case "int":
		case "bool":
		case "enum":
		case "range":
			return scalarOut(t, rd(b, o));
		case "string":
			return String.fromCharCode(...b.subarray(o + 1, o + 1 + Math.min(b[o] ?? 0, t.n)));
		case "long": {
			// Words out of their base read as the raw list, so a round trip still keeps them.
			const words = Array.from({ length: t.words }, (_, i) => rd(b, o + i * 2));
			if (words.some((w) => w >= t.base)) return words;
			return words.reduceRight((n, w) => n * t.base + w, 0);
		}
		case "record": {
			const out: { [key: string]: PValue } = {};
			let at = o;
			for (const x of t.fields) {
				out[x.key] = decode(x.type, b, at);
				at += sizeOf(x.type);
			}
			return out;
		}
		case "array": {
			const elems = decodeElements(t, b, o);
			if (t.keys) {
				if (t.of.k === "bool") return t.keys.filter((_, i) => elems[i] === true);
				return Object.fromEntries(t.keys.map((key, i) => [key, elems[i] ?? 0]));
			}
			if (t.of.k === "bool") return elems.map((x) => (x ? "1" : "0")).join("");
			return elems;
		}
	}
}

function decodeElements(t: Extract<PType, { k: "array" }>, b: Uint8Array, o: number): PValue[] {
	const bits = t.packed ? packBits(t.of) : 0;
	const out: PValue[] = [];
	if (bits && bits < 16) {
		const per = Math.floor(16 / bits), mask = (1 << bits) - 1;
		for (let i = 0; i < t.count; i++)
			out.push(scalarOut(t.of, (rd(b, o + Math.floor(i / per) * 2) >> ((i % per) * bits)) & mask));
	} else {
		const size = sizeOf(t.of);
		for (let i = 0; i < t.count; i++) out.push(decode(t.of, b, o + i * size));
	}
	return out;
}

/** Writes `v` over `b` at `o`. Missing record keys and array tails leave the base bytes alone. */
export function encode(t: PType, v: PValue | undefined, b: Uint8Array, o: number, path = ""): void {
	if (v === undefined) return;
	// A value that reads the same as the base leaves the base's bytes, so a TRUE kept as -1,
	// or a length byte past the string's room, survives a round trip.
	if (t.k !== "record" && t.k !== "array" && JSON.stringify(decode(t, b, o)) === JSON.stringify(v)) return;
	try {
		switch (t.k) {
			case "int":
			case "bool":
			case "enum":
			case "range":
				wr(b, o, scalarIn(t, v));
				return;
			case "string": {
				const s = String(v);
				if (s.length > t.n) throw new Error(`longer than ${t.n}: ${s}`);
				b[o] = s.length;
				for (let i = 0; i < s.length; i++) b[o + 1 + i] = s.charCodeAt(i) & 0xff;
				return;
			}
			case "long": {
				if (Array.isArray(v)) {
					v.forEach((w, i) => i < t.words && wr(b, o + i * 2, Number(w)));
					return;
				}
				if (typeof v !== "number" || v < 0 || !Number.isInteger(v)) throw new Error(`expected a whole number, got ${JSON.stringify(v)}`);
				if (v >= t.base ** t.words) throw new Error(`${v} does not fit in ${t.words} base-${t.base} words`);
				for (let i = 0, n = v; i < t.words; i++, n = Math.floor(n / t.base)) wr(b, o + i * 2, n % t.base);
				return;
			}
			case "record": {
				if (typeof v !== "object" || Array.isArray(v)) throw new Error("expected a map");
				let at = o;
				for (const x of t.fields) {
					encode(x.type, v[x.key], b, at, `${path}.${x.key}`);
					at += sizeOf(x.type);
				}
				return;
			}
			case "array": {
				v = elementsIn(t, v);
				if (v.length > t.count) throw new Error(`more than ${t.count} entries`);
				const bits = t.packed ? packBits(t.of) : 0;
				if (bits && bits < 16) {
					const per = Math.floor(16 / bits), mask = (1 << bits) - 1;
					v.forEach((x, i) => {
						if (x === undefined) return;
						const at = o + Math.floor(i / per) * 2, shift = (i % per) * bits;
						wr(b, at, (rd(b, at) & ~(mask << shift)) | ((scalarIn(t.of, x) & mask) << shift));
					});
				} else {
					const size = sizeOf(t.of);
					v.forEach((x, i) => encode(t.of, x, b, o + i * size, `${path}[${i}]`));
				}
				return;
			}
		}
	} catch (e) {
		if (e instanceof Error && !e.message.startsWith("at ")) throw new Error(`at ${path || "(top)"}: ${e.message}`);
		throw e;
	}
}

function elementsIn(t: Extract<PType, { k: "array" }>, v: PValue): PValue[] {
	if (t.keys) {
		const keys = t.keys;
		if (t.of.k === "bool") {
			if (!Array.isArray(v)) throw new Error(`expected a list of ${keys.join(", ")}`);
			for (const x of v) if (!keys.includes(String(x))) throw new Error(`${x} is not one of ${keys.join(", ")}`);
			return keys.map((key) => v.includes(key));
		}
		if (typeof v !== "object" || Array.isArray(v)) throw new Error(`expected a map of ${keys.join(", ")}`);
		const unknown = Object.keys(v).filter((key) => !keys.includes(key));
		if (unknown.length) throw new Error(`unknown keys ${unknown.join(", ")}`);
		return keys.map((key) => v[key]) as PValue[];
	}
	if (t.of.k === "bool" && typeof v === "string") {
		if (!/^[01]*$/.test(v)) throw new Error(`expected a bit string, got ${v}`);
		return [...v].map((c) => c === "1");
	}
	if (!Array.isArray(v)) throw new Error("expected a list");
	return v;
}
