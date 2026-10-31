// Apple Pascal (UCSD p-System) volumes on 140K Apple II disk images.
// A .dsk/.do image is in DOS 3.3 sector order; Pascal reads ProDOS block order, so the
// image is reordered first (.po images already are). The directory is blocks 2-5: a
// 26-byte volume entry, then 26-byte file entries. Files are contiguous runs of blocks.

const DOS_TO_PRODOS = [0, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 15];
const IMAGE_140K = 143360;

export const PASCAL_KINDS = ["volume", "bad", "code", "text", "info", "data", "graf", "foto", "secure"] as const;

export interface PascalEntry {
	name: string;
	first: number;
	next: number;
	kind: string;
	lastBytes: number;
	date: string;
}

export function dosOrder(blocks: Uint8Array): Uint8Array {
	if (blocks.length !== IMAGE_140K) return blocks;
	const out = new Uint8Array(IMAGE_140K);
	let o = 0;
	for (let t = 0; t < 35; t++)
		for (let s = 0; s < 16; s++) {
			out.set(blocks.subarray(o, o + 256), t * 4096 + (DOS_TO_PRODOS[s] ?? 0) * 256);
			o += 256;
		}
	return out;
}

export function blockOrder(image: Uint8Array, dosOrder = true): Uint8Array {
	if (!dosOrder || image.length !== IMAGE_140K) return image;
	const out = new Uint8Array(IMAGE_140K);
	let o = 0;
	for (let t = 0; t < 35; t++)
		for (let s = 0; s < 16; s++) {
			const at = t * 4096 + (DOS_TO_PRODOS[s] ?? 0) * 256;
			out.set(image.subarray(at, at + 256), o);
			o += 256;
		}
	return out;
}

export function u16(b: Uint8Array, o: number): number {
	return (b[o] ?? 0) | ((b[o + 1] ?? 0) << 8);
}

export function i16(b: Uint8Array, o: number): number {
	const v = u16(b, o);
	return v & 0x8000 ? v - 0x10000 : v;
}

export function latin1(b: Uint8Array): string {
	return String.fromCharCode(...b);
}

/** A Pascal STRING: a length byte, then the characters. */
export function pstring(b: Uint8Array, o: number, max = 255): string {
	return latin1(b.subarray(o + 1, o + 1 + Math.min(b[o] ?? 0, max)));
}

function pascalDate(w: number): string {
	const month = w & 15, day = (w >> 4) & 31, year = w >> 9;
	if (!month) return "";
	const two = (n: number) => String(n).padStart(2, "0");
	return `19${two(year)}-${two(month)}-${two(day)}`;
}

export class PascalVolume {
	readonly data: Uint8Array;
	readonly name: string;
	readonly entries: PascalEntry[] = [];
	readonly dosOrder: boolean;

	/** `dosOrder` is false for .po images. The volume keeps its own copy of the bytes. */
	constructor(image: Uint8Array, dosOrder = true) {
		this.dosOrder = dosOrder;
		this.data = blockOrder(image, dosOrder).slice();
		const d = this.data.subarray(1024, 3072);
		this.name = latin1(d.subarray(7, 7 + (d[6] ?? 0)));
		const count = u16(d, 16);
		for (let i = 1; i <= count; i++) {
			const e = d.subarray(i * 26, i * 26 + 26);
			const kind = u16(e, 4) & 15;
			this.entries.push({
				name: latin1(e.subarray(7, 7 + (e[6] ?? 0))),
				first: u16(e, 0),
				next: u16(e, 2),
				kind: PASCAL_KINDS[kind] ?? String(kind),
				lastBytes: u16(e, 22),
				date: pascalDate(u16(e, 24)),
			});
		}
	}

	find(name: string): PascalEntry {
		const e = this.entries.find((x) => x.name.toUpperCase() === name.toUpperCase());
		if (!e) throw new Error(`${name} not on ${this.name}:`);
		return e;
	}

	/** The file's bytes, as a view: writing into it changes the volume. */
	raw(name: string): Uint8Array {
		const e = this.find(name);
		const body = this.data.subarray(e.first * 512, e.next * 512);
		return e.lastBytes ? body.subarray(0, body.length - 512 + e.lastBytes) : body;
	}

	/** The disk image, in the sector order it was read in. */
	image(): Uint8Array {
		return this.dosOrder ? dosOrder(this.data) : this.data.slice();
	}

	/** A .TEXT file: a 2-block editor header, then pages of CR-ended lines; DLE n is n-32 spaces. */
	text(name: string): string {
		const b = this.raw(name).subarray(1024);
		let out = "";
		for (let i = 0; i < b.length; i++) {
			const c = b[i] ?? 0;
			if (c === 16 && i + 1 < b.length) out += " ".repeat(Math.max(0, (b[++i] ?? 32) - 32));
			else if (c === 13) out += "\n";
			else if (c) out += String.fromCharCode(c);
		}
		return out;
	}
}
