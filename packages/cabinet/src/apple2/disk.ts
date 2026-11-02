// Apple II disk images: sector orders, the 2MG wrapper, and which file system a disk holds.
//
// A 140K 5.25" disk is 35 tracks of 16 sectors of 256 bytes. DOS 3.3 numbers the sectors one
// way and ProDOS and Pascal, which read 512-byte blocks, another, so the same disk can be saved
// in either order: .dsk and .do in DOS order, .po in ProDOS (block) order. Larger disks (800K,
// hard disk images, .hdv) are only ever in block order. A .2mg file is a 64-byte header, then
// the disk in one of those orders (Apple II File Type Note on 2IMG, and CiderPress II's notes).

export const IMAGE_140K = 143360;
export const BLOCK = 512;

/** The DOS 3.3 sector that holds each ProDOS-order sector: physical layout, Beneath Apple ProDOS table 3.1. */
const DOS_TO_PRODOS = [0, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 15];

export type Order = "dos" | "prodos";

/** A 140K image in block order, from DOS order; any other size is returned as it is. */
export function blockOrder(image: Uint8Array, fromDos = true): Uint8Array {
	if (!fromDos || image.length !== IMAGE_140K) return image;
	const out = new Uint8Array(IMAGE_140K);
	let o = 0;
	for (let t = 0; t < 35; t++)
		for (let s = 0; s < 16; s++) {
			const at = t * 4096 + DOS_TO_PRODOS[s]! * 256;
			out.set(image.subarray(at, at + 256), o);
			o += 256;
		}
	return out;
}

/** A 140K image in DOS order, from block order; any other size is returned as it is. */
export function dosOrder(blocks: Uint8Array): Uint8Array {
	if (blocks.length !== IMAGE_140K) return blocks;
	const out = new Uint8Array(IMAGE_140K);
	let o = 0;
	for (let t = 0; t < 35; t++)
		for (let s = 0; s < 16; s++) {
			out.set(blocks.subarray(o, o + 256), t * 4096 + DOS_TO_PRODOS[s]! * 256);
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

export function u24(b: Uint8Array, o: number): number {
	return u16(b, o) | ((b[o + 2] ?? 0) << 16);
}

export function u32(b: Uint8Array, o: number): number {
	return (u16(b, o) | (u16(b, o + 2) << 16)) >>> 0;
}

export function put16(b: Uint8Array, o: number, v: number): void {
	b[o] = v & 255;
	b[o + 1] = (v >> 8) & 255;
}

export function put24(b: Uint8Array, o: number, v: number): void {
	put16(b, o, v & 0xffff);
	b[o + 2] = (v >> 16) & 255;
}

export function put32(b: Uint8Array, o: number, v: number): void {
	put16(b, o, v & 0xffff);
	put16(b, o + 2, (v >>> 16) & 0xffff);
}

export function latin1(b: Uint8Array): string {
	let s = "";
	for (const c of b) s += String.fromCharCode(c);
	return s;
}

/** Text as an Apple II file holds it: carriage returns for newlines, high bit set for DOS 3.3, clear for ProDOS and Pascal. */
export function appleText(text: string, highBit: boolean): Uint8Array {
	const s = text.replace(/\r\n?/g, "\n");
	const out = new Uint8Array(s.length);
	for (let i = 0; i < s.length; i++) {
		const c = s.charCodeAt(i);
		out[i] = ((c === 10 ? 13 : c > 126 ? 0x3f : c) & 0x7f) | (highBit ? 0x80 : 0);
	}
	return out;
}

/** An Apple II text file as a string: high bits cleared, carriage returns as newlines, stopping at the first zero. */
export function fromAppleText(b: Uint8Array): string {
	const end = b.indexOf(0);
	let s = "";
	for (const c of end < 0 ? b : b.subarray(0, end)) s += String.fromCharCode((c & 0x7f) === 13 ? 10 : c & 0x7f);
	return s;
}

export interface TwoImg {
	creator: string;
	format: 0 | 1 | 2; // 0 DOS order, 1 ProDOS order, 2 nibbles
	flags: number;
	volume?: number; // DOS volume number, when flags bit 8 is set
	locked: boolean;
	blocks: number;
	comment: string;
	data: Uint8Array;
}

export function is2mg(file: Uint8Array): boolean {
	return file.length >= 64 && latin1(file.subarray(0, 4)) === "2IMG";
}

export function read2mg(file: Uint8Array): TwoImg {
	if (!is2mg(file)) throw new Error("not a 2MG image");
	const format = u32(file, 12);
	if (format > 2) throw new Error(`2MG image format ${format}`);
	const flags = u32(file, 16);
	const offset = u32(file, 24);
	const length = u32(file, 28);
	const commentAt = u32(file, 32);
	const out: TwoImg = {
		creator: latin1(file.subarray(4, 8)),
		format: format as 0 | 1 | 2,
		flags,
		locked: (flags & 0x80000000) !== 0,
		blocks: u32(file, 20),
		comment: commentAt ? latin1(file.subarray(commentAt, commentAt + u32(file, 36))) : "",
		data: file.subarray(offset, offset + length),
	};
	if (flags & 0x100) out.volume = flags & 0xff;
	return out;
}

export function write2mg(data: Uint8Array, options: { format: 0 | 1; creator?: string; volume?: number; locked?: boolean; comment?: string } = { format: 1 }): Uint8Array {
	const comment = new TextEncoder().encode(options.comment ?? "");
	const out = new Uint8Array(64 + data.length + comment.length);
	out.set(new TextEncoder().encode("2IMG"));
	out.set(new TextEncoder().encode((options.creator ?? "WWSF").padEnd(4).slice(0, 4)), 4);
	put16(out, 8, 64);
	put16(out, 10, 1);
	put32(out, 12, options.format);
	put32(out, 16, (options.locked ? 0x80000000 : 0) | (options.volume !== undefined ? 0x100 | (options.volume & 0xff) : 0));
	put32(out, 20, options.format === 1 ? data.length / BLOCK : 0);
	put32(out, 24, 64);
	put32(out, 28, data.length);
	if (comment.length) {
		put32(out, 32, 64 + data.length);
		put32(out, 36, comment.length);
	}
	out.set(data, 64);
	out.set(comment, 64 + data.length);
	return out;
}

export type FileSystem = "dos33" | "prodos" | "pascal";

export interface Opened {
	/** The disk in block order: ProDOS and Pascal read this. */
	blocks: Uint8Array;
	/** The order the image was saved in. */
	order: Order;
	fs: FileSystem | undefined;
	twoImg?: TwoImg;
}

function prodosAt(blocks: Uint8Array): boolean {
	const b = blocks.subarray(2 * BLOCK, 3 * BLOCK);
	return b.length === BLOCK && u16(b, 0) === 0 && (b[4]! >> 4) === 0xf && (b[4]! & 15) > 0 && b[0x23] === 0x27 && b[0x24] === 0x0d;
}

function pascalAt(blocks: Uint8Array): boolean {
	const d = blocks.subarray(2 * BLOCK, 3 * BLOCK);
	if (d.length < 26) return false;
	const nameLength = d[6]!;
	return u16(d, 0) === 0 && u16(d, 2) === 6 && (u16(d, 4) & 15) === 0 && nameLength > 0 && nameLength <= 7 && u16(d, 14) * BLOCK <= blocks.length + BLOCK && u16(d, 16) <= 77;
}

function dos33At(dosOrdered: Uint8Array): boolean {
	if (dosOrdered.length !== IMAGE_140K) return false;
	const v = dosOrdered.subarray(17 * 4096, 17 * 4096 + 256);
	return v[3] === 3 && v[1]! < 35 && v[2]! < 16 && v[0x34] === 35 && v[0x35] === 16;
}

/**
 * Opens an image: unwraps a 2MG, works out the sector order (from `name`'s extension when it
 * settles it, else by looking for each file system's catalog both ways), and names the file system.
 */
export function openImage(file: Uint8Array, name = ""): Opened {
	let data = file;
	let twoImg: TwoImg | undefined;
	let order: Order | undefined;
	if (is2mg(file)) {
		twoImg = read2mg(file);
		if (twoImg.format === 2) throw new Error("2MG nibble images are not sector images");
		data = twoImg.data;
		order = twoImg.format === 0 ? "dos" : "prodos";
	}
	const ext = name.toLowerCase().replace(/^.*\./, ".");
	if (!order && data.length !== IMAGE_140K) order = "prodos";
	if (!order && (ext === ".po" || ext === ".hdv")) order = "prodos";
	if (!order && ext === ".do") order = "dos";
	const asDos = data.length === IMAGE_140K && order !== "prodos" ? data : undefined;
	const asBlocks = order === "prodos" ? data : order === "dos" ? blockOrder(data) : undefined;
	if (order) {
		const blocks = asBlocks!;
		const fs: FileSystem | undefined = prodosAt(blocks) ? "prodos" : pascalAt(blocks) ? "pascal" : dos33At(order === "dos" ? data : dosOrder(blocks)) ? "dos33" : undefined;
		const out: Opened = { blocks, order, fs };
		if (twoImg) out.twoImg = twoImg;
		return out;
	}
	// A bare 140K .dsk: try each file system in each order.
	const fromDos = blockOrder(data);
	if (prodosAt(fromDos)) return { blocks: fromDos, order: "dos", fs: "prodos" };
	if (prodosAt(data)) return { blocks: data, order: "prodos", fs: "prodos" };
	if (asDos && dos33At(asDos)) return { blocks: fromDos, order: "dos", fs: "dos33" };
	if (pascalAt(fromDos)) return { blocks: fromDos, order: "dos", fs: "pascal" };
	if (pascalAt(data)) return { blocks: data, order: "prodos", fs: "pascal" };
	if (dos33At(dosOrder(data))) return { blocks: data, order: "prodos", fs: "dos33" };
	return { blocks: fromDos, order: "dos", fs: undefined };
}

/** The image bytes for blocks saved in `order`, wrapped in 2MG when `twoImg` is given. */
export function saveImage(blocks: Uint8Array, order: Order, twoImg?: Pick<TwoImg, "creator" | "volume" | "locked" | "comment">): Uint8Array {
	const data = order === "dos" ? dosOrder(blocks) : blocks;
	if (!twoImg) return data;
	const options: Parameters<typeof write2mg>[1] = { format: order === "dos" ? 0 : 1, creator: twoImg.creator, locked: twoImg.locked, comment: twoImg.comment };
	if (twoImg.volume !== undefined) options.volume = twoImg.volume;
	return write2mg(data, options);
}
