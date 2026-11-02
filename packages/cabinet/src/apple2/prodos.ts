// ProDOS volumes: read, write, make directories, delete, rename, check. In the page and Node.
//
// Written from Apple's ProDOS 8 Technical Reference Manual (chapter B, "File Organization"),
// Worth and Lechner's Beneath Apple ProDOS, ProDOS 8 Technical Notes #25, #28 and #30, and GS/OS
// Technical Note #8 (lower-case names), checked against Andy McFadden's CiderPress II
// (DiskArc/FS/ProDOS-notes.md; Apache 2.0) and its cp2 command.
//
// A volume is 512-byte blocks. Blocks 0-1 boot; the volume directory starts at block 2 (four
// linked blocks by convention) and the free-block bitmap follows it (block 6), one bit per block,
// 1 = free, high bit first. A directory block is a previous and a next block number, then 13
// entries of 39 bytes; the first entry of a directory's key block is its header. A file of up to
// 512 bytes is a seedling (the key block is the data), up to 128K a sapling (the key block is an
// index of 256 block numbers, low bytes in its first half, high bytes in its second), and up to
// 16M a tree (a master index of index blocks). A zero block number in an index is a hole that
// reads as zeros. A forked GS/OS file (storage 5) has an extended key block with a mini-entry for
// each fork.

import { BLOCK, openImage, put16, put24, saveImage, u16, u24, type Order, type TwoImg } from "./disk.js";

export const STORAGE = { deleted: 0, seedling: 1, sapling: 2, tree: 3, pascal: 4, forked: 5, dir: 0xd, dirHeader: 0xe, volumeHeader: 0xf } as const;

/** File type names, from the ProDOS File Type Notes. */
export const PRODOS_TYPES: Record<number, string> = {
	0x00: "NON", 0x01: "BAD", 0x04: "TXT", 0x06: "BIN", 0x08: "FOT", 0x0f: "DIR", 0x19: "ADB", 0x1a: "AWP", 0x1b: "ASP",
	0xb3: "S16", 0xc0: "PNT", 0xc1: "PIC", 0xe0: "LBR", 0xef: "PAS", 0xf0: "CMD", 0xfa: "INT", 0xfb: "IVR", 0xfc: "BAS",
	0xfd: "VAR", 0xfe: "REL", 0xff: "SYS",
};

export function prodosType(t: number | string): number {
	if (typeof t === "number") return t & 0xff;
	const hex = /^\$([0-9a-f]{1,2})$/i.exec(t);
	if (hex) return parseInt(hex[1]!, 16);
	const hit = Object.entries(PRODOS_TYPES).find(([, n]) => n === t.toUpperCase());
	if (!hit) throw new Error(`no ProDOS file type ${t}`);
	return Number(hit[0]);
}

export const ACCESS = { destroy: 0x80, rename: 0x40, backup: 0x20, invisible: 0x04, write: 0x02, read: 0x01, unlocked: 0xe3, locked: 0x21 } as const;

const ENTRY = 0x27;
const PER_BLOCK = 0x0d;
const NAME = /^[A-Z][A-Z0-9.]{0,14}$/;

export interface ProDOSEntry {
	name: string; // with GS/OS lower-case flags applied
	path: string; // from the volume, "/" between names, no leading slash
	storage: number;
	type: number;
	typeName: string;
	aux: number;
	key: number;
	blocksUsed: number;
	eof: number;
	access: number;
	created?: Date;
	modified?: Date;
	dir: boolean;
	/** Where the entry is: its directory block and slot (0-12; slot 0 of a key block is the header). */
	at: { block: number; slot: number };
	/** Key block of the directory that holds it. */
	parent: number;
}

export interface WriteOptions {
	type?: number | string; // default BIN
	aux?: number; // default 0: a BIN file's load address, a SYS file's $2000, a TXT file's record length
	access?: number; // default $E3, unlocked
	created?: Date; // default none, so a rebuilt disk is the same bytes
	modified?: Date;
}

/** A ProDOS date and time: two words, YYYYYYYMMMMDDDDD and 000HHHHH00MMMMMM; years 0-39 are 2000-2039 (Tech Note #28). */
export function packDate(d: Date | undefined): [number, number] {
	if (!d) return [0, 0];
	const y = d.getFullYear();
	if (y < 1940 || y > 2039) throw new Error(`ProDOS dates run 1940-2039, not ${y}`);
	return [((y % 100) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(), (d.getHours() << 8) | d.getMinutes()];
}

export function unpackDate(date: number, time: number): Date | undefined {
	if (!date) return undefined;
	const yy = date >> 9, month = (date >> 5) & 15, day = date & 31;
	if (!month || month > 12 || !day) return undefined;
	const year = yy < 40 ? 2000 + yy : yy < 100 ? 1900 + yy : 2000 + yy - 100;
	return new Date(year, month - 1, day, (time >> 8) & 31, time & 63);
}

/** A name ProDOS accepts, upper-cased, and its GS/OS lower-case flags (0 when there is no lower case). */
export function prodosName(name: string): { upper: string; flags: number } {
	const upper = name.toUpperCase();
	if (!NAME.test(upper)) throw new Error(`${name}: a ProDOS name is 1-15 letters, digits and periods, starting with a letter`);
	let flags = 0;
	for (let i = 0; i < name.length; i++) if (name[i] !== upper[i]) flags |= 0x4000 >> i;
	return { upper, flags: flags ? 0x8000 | flags : 0 };
}

/** Blocks a file of `length` bytes takes: its data blocks, and an index or a master index and its indexes. */
export function blocksFor(length: number): number {
	if (length > 0xffffff) throw new Error(`a ProDOS file holds at most 16M - 1 bytes, not ${length}`);
	const count = Math.max(1, Math.ceil(length / BLOCK));
	return count + (count > 1 ? 1 : 0) + (count > 256 ? Math.ceil(count / 256) : 0);
}

function applyCase(upper: string, flags: number): string {
	if (!(flags & 0x8000)) return upper;
	let out = "";
	for (let i = 0; i < upper.length; i++) out += flags & (0x4000 >> i) ? upper[i]!.toLowerCase() : upper[i]!;
	return out;
}

export class ProDOSVolume {
	readonly data: Uint8Array;
	order: Order;
	twoImg: TwoImg | undefined;

	/** `blocks` in block order; the volume keeps its own copy. */
	constructor(blocks: Uint8Array, order: Order = "prodos", twoImg?: TwoImg) {
		this.data = blocks.slice();
		this.order = order;
		this.twoImg = twoImg;
		const h = this.header();
		if (h[0]! >> 4 !== STORAGE.volumeHeader) throw new Error("no ProDOS volume directory at block 2");
	}

	/** A disk image in any order or a 2MG; `image()` gives it back the same way. */
	static fromImage(file: Uint8Array, name = ""): ProDOSVolume {
		const o = openImage(file, name);
		if (o.fs !== "prodos") throw new Error(`${name || "image"}: not a ProDOS volume`);
		return new ProDOSVolume(o.blocks, o.order, o.twoImg);
	}

	/** A new empty volume. `boot` is copied into blocks 0-1 (a ProDOS boot loader from another disk). */
	static format(name: string, totalBlocks = 280, options: { boot?: Uint8Array; created?: Date; order?: Order } = {}): ProDOSVolume {
		if (totalBlocks < 7 || totalBlocks > 65535) throw new Error(`a ProDOS volume is 7 to 65535 blocks, not ${totalBlocks}`);
		const data = new Uint8Array(totalBlocks * BLOCK);
		if (options.boot) data.set(options.boot.subarray(0, 2 * BLOCK));
		for (let b = 2; b <= 5; b++) {
			const at = b * BLOCK;
			put16(data, at, b === 2 ? 0 : b - 1);
			put16(data, at + 2, b === 5 ? 0 : b + 1);
		}
		const { upper, flags } = prodosName(name);
		const h = data.subarray(2 * BLOCK + 4, 2 * BLOCK + 4 + ENTRY);
		h[0] = (STORAGE.volumeHeader << 4) | upper.length;
		for (let i = 0; i < upper.length; i++) h[1 + i] = upper.charCodeAt(i);
		put16(h, 0x16, flags);
		const [d, t] = packDate(options.created);
		put16(h, 0x18, d);
		put16(h, 0x1a, t);
		h[0x1e] = 0xc3;
		h[0x1f] = ENTRY;
		h[0x20] = PER_BLOCK;
		put16(h, 0x23, 6);
		put16(h, 0x25, totalBlocks);
		const bitmapBlocks = Math.ceil(totalBlocks / 4096);
		const firstFree = 6 + bitmapBlocks;
		for (let b = firstFree; b < totalBlocks; b++) data[6 * BLOCK + (b >> 3)]! |= 0x80 >> (b & 7);
		return new ProDOSVolume(data, options.order ?? "prodos");
	}

	/** The image, in the order and wrapper it was read in. */
	image(): Uint8Array {
		return saveImage(this.data, this.order, this.twoImg);
	}

	block(n: number): Uint8Array {
		if (n < 0 || n >= this.totalBlocks) throw new Error(`block ${n} is past the end of a ${this.totalBlocks}-block volume`);
		return this.data.subarray(n * BLOCK, (n + 1) * BLOCK);
	}

	private header(): Uint8Array {
		return this.data.subarray(2 * BLOCK + 4, 2 * BLOCK + 4 + ENTRY);
	}

	get name(): string {
		const h = this.header();
		return applyCase(String.fromCharCode(...h.subarray(1, 1 + (h[0]! & 15))), u16(h, 0x16));
	}

	get totalBlocks(): number {
		return u16(this.header(), 0x25);
	}

	get bitmapStart(): number {
		return u16(this.header(), 0x23);
	}

	get created(): Date | undefined {
		const h = this.header();
		return unpackDate(u16(h, 0x18), u16(h, 0x1a));
	}

	isFree(n: number): boolean {
		const byte = this.data[this.bitmapStart * BLOCK + (n >> 3)] ?? 0;
		return (byte & (0x80 >> (n & 7))) !== 0;
	}

	private mark(n: number, free: boolean): void {
		const at = this.bitmapStart * BLOCK + (n >> 3);
		if (free) this.data[at]! |= 0x80 >> (n & 7);
		else this.data[at]! &= ~(0x80 >> (n & 7));
	}

	freeBlocks(): number {
		let n = 0;
		for (let b = 0; b < this.totalBlocks; b++) if (this.isFree(b)) n++;
		return n;
	}

	/** Takes the lowest free block, zeroed. */
	private allocate(): number {
		for (let b = 0; b < this.totalBlocks; b++) {
			if (this.isFree(b)) {
				this.mark(b, false);
				this.block(b).fill(0);
				return b;
			}
		}
		throw new Error(`${this.name}: disk full`);
	}

	private release(n: number): void {
		if (n) this.mark(n, true);
	}

	private dirBlocks(key: number): number[] {
		const out: number[] = [];
		const seen = new Set<number>();
		for (let b = key; b && !seen.has(b) && b < this.totalBlocks; b = u16(this.block(b), 2)) {
			seen.add(b);
			out.push(b);
		}
		return out;
	}

	private slot(block: number, slot: number): Uint8Array {
		const o = block * BLOCK + 4 + slot * ENTRY;
		return this.data.subarray(o, o + ENTRY);
	}

	private entry(block: number, slot: number, dirKey: number, dirPath: string): ProDOSEntry {
		const e = this.slot(block, slot);
		const storage = e[0]! >> 4;
		const flags = u16(e, 0x1c);
		const name = applyCase(String.fromCharCode(...e.subarray(1, 1 + (e[0]! & 15))), flags);
		const type = e[0x10]!;
		const out: ProDOSEntry = {
			name,
			path: dirPath ? `${dirPath}/${name}` : name,
			storage,
			type,
			typeName: PRODOS_TYPES[type] ?? `$${type.toString(16).toUpperCase().padStart(2, "0")}`,
			aux: u16(e, 0x1f),
			key: u16(e, 0x11),
			blocksUsed: u16(e, 0x13),
			eof: u24(e, 0x15),
			access: e[0x1e]!,
			dir: storage === STORAGE.dir,
			at: { block, slot },
			parent: dirKey,
		};
		const created = unpackDate(u16(e, 0x18), u16(e, 0x1a));
		const modified = unpackDate(u16(e, 0x21), u16(e, 0x23));
		if (created) out.created = created;
		if (modified) out.modified = modified;
		return out;
	}

	/** The entries of the directory with key block `key`, deleted ones left out. */
	private entries(key: number, dirPath: string): ProDOSEntry[] {
		const out: ProDOSEntry[] = [];
		this.dirBlocks(key).forEach((b, i) => {
			for (let s = i === 0 ? 1 : 0; s < PER_BLOCK; s++) {
				const e = this.slot(b, s);
				if (e[0]! >> 4 !== STORAGE.deleted) out.push(this.entry(b, s, key, dirPath));
			}
		});
		return out;
	}

	private parts(path: string): string[] {
		const parts = path.split("/").filter(Boolean);
		if (path.startsWith("/") && parts[0]?.toUpperCase() === this.name.toUpperCase()) parts.shift();
		return parts;
	}

	/** The directory at `path` ("" is the volume directory): its key block and path. */
	private dirAt(path: string): { key: number; path: string } {
		let key = 2;
		let at = "";
		for (const p of this.parts(path)) {
			const e = this.entries(key, at).find((x) => x.name.toUpperCase() === p.toUpperCase());
			if (!e) throw new Error(`${at ? at + "/" : ""}${p}: no such directory`);
			if (!e.dir) throw new Error(`${e.path} is a file, not a directory`);
			key = e.key;
			at = e.path;
		}
		return { key, path: at };
	}

	/** The entries in a directory, in catalog order. */
	list(path = ""): ProDOSEntry[] {
		const d = this.dirAt(path);
		return this.entries(d.key, d.path);
	}

	/** Every entry on the volume, each directory's entries after it. */
	walk(): ProDOSEntry[] {
		const out: ProDOSEntry[] = [];
		const visit = (key: number, path: string, depth: number): void => {
			if (depth > 64) throw new Error(`${path}: directories nest too deep`);
			for (const e of this.entries(key, path)) {
				out.push(e);
				if (e.dir) visit(e.key, e.path, depth + 1);
			}
		};
		visit(2, "", 0);
		return out;
	}

	find(path: string): ProDOSEntry | undefined {
		const parts = this.parts(path);
		const name = parts.pop();
		if (!name) return undefined;
		let d;
		try {
			d = this.dirAt(parts.join("/"));
		} catch {
			return undefined;
		}
		return this.entries(d.key, d.path).find((e) => e.name.toUpperCase() === name.toUpperCase());
	}

	private need(path: string | ProDOSEntry): ProDOSEntry {
		const e = typeof path === "string" ? this.find(path) : path;
		if (!e) throw new Error(`${path}: not on /${this.name}`);
		return e;
	}

	/** Data blocks of a seedling, sapling or tree, in file order; 0 is a hole. */
	private dataBlocks(storage: number, key: number, eof: number): number[] {
		const count = Math.max(1, Math.ceil(eof / BLOCK));
		if (storage === STORAGE.seedling) return [key];
		const index = (b: number, n: number): number[] => {
			if (!b) return new Array<number>(n).fill(0);
			const blk = this.block(b);
			return Array.from({ length: n }, (_, i) => blk[i]! | (blk[256 + i]! << 8));
		};
		if (storage === STORAGE.sapling) return index(key, Math.min(256, count));
		if (storage === STORAGE.tree) {
			const out: number[] = [];
			const master = index(key, Math.ceil(count / 256));
			master.forEach((ix, i) => out.push(...index(ix, Math.min(256, count - i * 256))));
			return out;
		}
		throw new Error(`storage type ${storage} holds no data blocks`);
	}

	/** Index blocks of a sapling or tree. */
	private indexBlocks(storage: number, key: number, eof: number): number[] {
		if (storage === STORAGE.sapling) return [key];
		if (storage !== STORAGE.tree) return [];
		const master = this.block(key);
		const out = [key];
		for (let i = 0; i < Math.ceil(Math.max(1, Math.ceil(eof / BLOCK)) / 256); i++) {
			const b = master[i]! | (master[256 + i]! << 8);
			if (b) out.push(b);
		}
		return out;
	}

	private readFork(storage: number, key: number, eof: number): Uint8Array {
		const out = new Uint8Array(eof);
		this.dataBlocks(storage, key, eof).forEach((b, i) => {
			if (b && i * BLOCK < eof) out.set(this.block(b).subarray(0, Math.min(BLOCK, eof - i * BLOCK)), i * BLOCK);
		});
		return out;
	}

	/** A file's data fork. */
	read(path: string | ProDOSEntry): Uint8Array {
		const e = this.need(path);
		if (e.dir) throw new Error(`${e.path} is a directory`);
		if (e.storage === STORAGE.forked) {
			const x = this.block(e.key);
			return this.readFork(x[0]!, u16(x, 1), u24(x, 5));
		}
		return this.readFork(e.storage, e.key, e.eof);
	}

	/** A forked file's resource fork; empty for other files. */
	readResource(path: string | ProDOSEntry): Uint8Array {
		const e = this.need(path);
		if (e.storage !== STORAGE.forked) return new Uint8Array(0);
		const x = this.block(e.key).subarray(256);
		return this.readFork(x[0]!, u16(x, 1), u24(x, 5));
	}

	/** A TXT file as a string. */
	text(path: string | ProDOSEntry): string {
		let s = "";
		for (const c of this.read(path)) s += String.fromCharCode((c & 0x7f) === 13 ? 10 : c & 0x7f);
		return s;
	}

	/** Lays `bytes` into new blocks; returns the storage type, key block and blocks used. */
	private store(bytes: Uint8Array): { storage: number; key: number; used: number } {
		const count = Math.max(1, Math.ceil(bytes.length / BLOCK));
		const need = blocksFor(bytes.length);
		if (need > this.freeBlocks()) throw new Error(`${this.name}: ${need} blocks needed, ${this.freeBlocks()} free`);
		const data: number[] = [];
		for (let i = 0; i < count; i++) {
			const b = this.allocate();
			this.block(b).set(bytes.subarray(i * BLOCK, (i + 1) * BLOCK));
			data.push(b);
		}
		const index = (blocks: number[]): number => {
			const ix = this.allocate();
			const blk = this.block(ix);
			blocks.forEach((b, i) => {
				blk[i] = b & 255;
				blk[256 + i] = b >> 8;
			});
			return ix;
		};
		if (count === 1) return { storage: STORAGE.seedling, key: data[0]!, used: 1 };
		if (count <= 256) return { storage: STORAGE.sapling, key: index(data), used: count + 1 };
		const indexes: number[] = [];
		for (let i = 0; i < count; i += 256) indexes.push(index(data.slice(i, i + 256)));
		return { storage: STORAGE.tree, key: index(indexes), used: count + indexes.length + 1 };
	}

	private releaseFork(storage: number, key: number, eof: number): void {
		for (const b of this.dataBlocks(storage, key, eof)) this.release(b);
		for (const b of this.indexBlocks(storage, key, eof)) this.release(b);
	}

	private releaseEntry(e: ProDOSEntry): void {
		if (e.dir) for (const b of this.dirBlocks(e.key)) this.release(b);
		else if (e.storage === STORAGE.forked) {
			const x = this.block(e.key);
			this.releaseFork(x[0]!, u16(x, 1), u24(x, 5));
			this.releaseFork(x[256]!, u16(x, 257), u24(x, 261));
			this.release(e.key);
		} else this.releaseFork(e.storage, e.key, e.eof);
	}

	private countFiles(key: number, delta: number): void {
		const h = this.slot(key, 0);
		put16(h, 0x21, Math.max(0, u16(h, 0x21) + delta));
	}

	/** A free slot in a directory, extending a subdirectory by a block when it is full. */
	private freeSlot(key: number): { block: number; slot: number } {
		const blocks = this.dirBlocks(key);
		for (const [i, b] of blocks.entries()) {
			for (let s = i === 0 ? 1 : 0; s < PER_BLOCK; s++) if (this.slot(b, s)[0]! >> 4 === STORAGE.deleted) return { block: b, slot: s };
		}
		if (key === 2) throw new Error(`/${this.name}: the volume directory is full (${blocks.length * PER_BLOCK - 1} entries)`);
		const last = blocks[blocks.length - 1]!;
		const fresh = this.allocate();
		put16(this.block(fresh), 0, last);
		put16(this.block(last), 2, fresh);
		const h = this.slot(key, 0);
		const parentEntry = this.slot(u16(h, 0x23), h[0x25]! - 1);
		put16(parentEntry, 0x13, u16(parentEntry, 0x13) + 1);
		put24(parentEntry, 0x15, u24(parentEntry, 0x15) + BLOCK);
		return { block: fresh, slot: 0 };
	}

	private fill(e: Uint8Array, name: string, storage: number, type: number, key: number, used: number, eof: number, options: WriteOptions, dirKey: number): void {
		const { upper, flags } = prodosName(name);
		e.fill(0);
		e[0] = (storage << 4) | upper.length;
		for (let i = 0; i < upper.length; i++) e[1 + i] = upper.charCodeAt(i);
		e[0x10] = type;
		put16(e, 0x11, key);
		put16(e, 0x13, used);
		put24(e, 0x15, eof);
		const [cd, ct] = packDate(options.created);
		put16(e, 0x18, cd);
		put16(e, 0x1a, ct);
		put16(e, 0x1c, flags);
		e[0x1e] = options.access ?? ACCESS.unlocked;
		put16(e, 0x1f, options.aux ?? 0);
		const [md, mt] = packDate(options.modified ?? options.created);
		put16(e, 0x21, md);
		put16(e, 0x23, mt);
		put16(e, 0x25, dirKey);
	}

	/** Makes a directory and any missing ones above it; an existing directory is returned as it is. */
	mkdir(path: string, options: Pick<WriteOptions, "created" | "access"> = {}): ProDOSEntry {
		const parts = this.parts(path);
		if (!parts.length) throw new Error("mkdir needs a name");
		let key = 2;
		let at = "";
		let made: ProDOSEntry | undefined;
		for (const p of parts) {
			const found = this.entries(key, at).find((x) => x.name.toUpperCase() === p.toUpperCase());
			if (found && !found.dir) throw new Error(`${found.path} is a file, not a directory`);
			if (found) {
				made = found;
			} else {
				const { upper } = prodosName(p);
				if (this.freeBlocks() < 2) throw new Error(`${this.name}: disk full`);
				const where = this.freeSlot(key);
				const dirKey = this.allocate();
				const h = this.slot(dirKey, 0);
				h[0] = (STORAGE.dirHeader << 4) | upper.length;
				for (let i = 0; i < upper.length; i++) h[1 + i] = upper.charCodeAt(i);
				h[0x10] = 0x75;
				const [d, t] = packDate(options.created);
				put16(h, 0x18, d);
				put16(h, 0x1a, t);
				h[0x1e] = 0xc3;
				h[0x1f] = ENTRY;
				h[0x20] = PER_BLOCK;
				put16(h, 0x23, where.block);
				h[0x25] = where.slot + 1;
				h[0x26] = ENTRY;
				this.fill(this.slot(where.block, where.slot), p, STORAGE.dir, 0x0f, dirKey, 1, BLOCK, { ...options, aux: 0 }, key);
				this.countFiles(key, 1);
				made = this.entry(where.block, where.slot, key, at);
			}
			key = made.key;
			at = made.path;
		}
		return made!;
	}

	/**
	 * Writes a file, making missing directories above it. An existing file is replaced in its
	 * own catalog slot, keeping its type, aux type and access unless `options` sets them.
	 */
	write(path: string, bytes: Uint8Array, options: WriteOptions = {}): ProDOSEntry {
		const parts = this.parts(path);
		const name = parts.pop();
		if (!name) throw new Error("write needs a file name");
		prodosName(name);
		const dir = parts.length ? this.mkdir(parts.join("/")) : undefined;
		const dirKey = dir ? dir.key : 2;
		const dirPath = dir ? dir.path : "";
		const old = this.entries(dirKey, dirPath).find((e) => e.name.toUpperCase() === name.toUpperCase());
		if (old?.dir) throw new Error(`${old.path} is a directory`);
		const merged: WriteOptions = {
			type: options.type ?? old?.type ?? "BIN",
			aux: options.aux ?? old?.aux ?? 0,
			access: options.access ?? old?.access ?? ACCESS.unlocked,
		};
		const created = options.created ?? old?.created;
		if (created) merged.created = created;
		if (options.modified) merged.modified = options.modified;
		const need = blocksFor(bytes.length);
		const free = this.freeBlocks() + (old ? old.blocksUsed : 0);
		if (need > free) throw new Error(`${this.name}: ${name} needs ${need} blocks, ${free} free`);
		if (old) this.releaseEntry(old);
		const where = old ? old.at : this.freeSlot(dirKey);
		const stored = this.store(bytes);
		this.fill(this.slot(where.block, where.slot), name, stored.storage, prodosType(merged.type!), stored.key, stored.used, bytes.length, merged, dirKey);
		if (!old) this.countFiles(dirKey, 1);
		return this.entry(where.block, where.slot, dirKey, dirPath);
	}

	/** Writes text as a TXT file: carriage returns, high bits clear. */
	writeText(path: string, text: string, options: WriteOptions = {}): ProDOSEntry {
		const s = text.replace(/\r\n?/g, "\n");
		const bytes = new Uint8Array(s.length);
		for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i) === 10 ? 13 : s.charCodeAt(i) & 0x7f;
		return this.write(path, bytes, { type: "TXT", ...options });
	}

	/** Deletes a file, or a directory: empty, or everything in it with `recursive`. */
	remove(path: string, options: { recursive?: boolean } = {}): void {
		const e = this.need(path);
		if (e.dir) {
			const inside = this.entries(e.key, e.path);
			if (inside.length && !options.recursive) throw new Error(`${e.path} is not empty`);
			for (const x of inside) this.remove(`${e.path}/${x.name}`, options);
		}
		this.releaseEntry(e);
		this.slot(e.at.block, e.at.slot).fill(0);
		this.countFiles(e.parent, -1);
	}

	rename(path: string, name: string): ProDOSEntry {
		const e = this.need(path);
		const dirPath = e.path.includes("/") ? e.path.slice(0, e.path.lastIndexOf("/")) : "";
		const clash = this.entries(e.parent, dirPath).find((x) => x.name.toUpperCase() === name.toUpperCase() && x.key !== e.key);
		if (clash) throw new Error(`${clash.path} exists`);
		const { upper, flags } = prodosName(name);
		const write = (s: Uint8Array, storage: number): void => {
			s[0] = (storage << 4) | upper.length;
			s.fill(0, 1, 16);
			for (let i = 0; i < upper.length; i++) s[1 + i] = upper.charCodeAt(i);
		};
		const slot = this.slot(e.at.block, e.at.slot);
		write(slot, e.storage);
		put16(slot, 0x1c, flags);
		if (e.dir) write(this.slot(e.key, 0), STORAGE.dirHeader);
		return this.entry(e.at.block, e.at.slot, e.parent, dirPath);
	}

	setInfo(path: string, info: Pick<WriteOptions, "type" | "aux" | "access" | "modified">): ProDOSEntry {
		const e = this.need(path);
		const slot = this.slot(e.at.block, e.at.slot);
		if (info.type !== undefined) slot[0x10] = prodosType(info.type);
		if (info.aux !== undefined) put16(slot, 0x1f, info.aux);
		if (info.access !== undefined) slot[0x1e] = info.access;
		if (info.modified) {
			const [d, t] = packDate(info.modified);
			put16(slot, 0x21, d);
			put16(slot, 0x23, t);
		}
		return this.entry(e.at.block, e.at.slot, e.parent, e.path.includes("/") ? e.path.slice(0, e.path.lastIndexOf("/")) : "");
	}

	/**
	 * What is wrong with the volume, as sentences: a block two files claim, a block a file uses
	 * that the bitmap calls free, a blocks-used or file-count field that disagrees with what is
	 * there. Empty when the volume is consistent.
	 */
	check(): string[] {
		return this.audit().problems;
	}

	/** Blocks the bitmap marks used that nothing holds: lost space, or data a program keeps outside files. */
	unclaimed(): number[] {
		return this.audit().unclaimed;
	}

	private audit(): { problems: string[]; unclaimed: number[] } {
		const problems: string[] = [];
		const owner = new Map<number, string>();
		const claim = (b: number, who: string): void => {
			if (!b) return;
			if (b >= this.totalBlocks) return void problems.push(`${who}: block ${b} is past the end`);
			const prior = owner.get(b);
			if (prior) problems.push(`block ${b} is used by ${prior} and ${who}`);
			else owner.set(b, who);
			if (this.isFree(b)) problems.push(`${who}: block ${b} is marked free`);
		};
		for (let b = 0; b < 2; b++) if (!this.isFree(b)) owner.set(b, "boot");
		for (let b = 0; b < Math.ceil(this.totalBlocks / 4096); b++) claim(this.bitmapStart + b, "bitmap");
		const visit = (key: number, path: string): void => {
			const blocks = this.dirBlocks(key);
			blocks.forEach((b) => claim(b, `/${this.name}${path ? "/" + path : ""}`));
			const list = this.entries(key, path);
			if (u16(this.slot(key, 0), 0x21) !== list.length) problems.push(`${path || "/" + this.name}: header counts ${u16(this.slot(key, 0), 0x21)} files, ${list.length} are there`);
			for (const e of list) {
				let used = 0;
				const take = (b: number): void => {
					claim(b, e.path);
					if (b) used++;
				};
				if (e.dir) {
					this.dirBlocks(e.key).forEach(() => used++);
					visit(e.key, e.path);
				} else if (e.storage === STORAGE.forked) {
					take(e.key);
					const x = this.block(e.key);
					for (const o of [0, 256]) {
						const st = x[o]!, k = u16(x, o + 1), eof = u24(x, o + 5);
						if (!k) continue;
						this.dataBlocks(st, k, eof).forEach(take);
						this.indexBlocks(st, k, eof).forEach(take);
					}
				} else if (e.storage >= STORAGE.seedling && e.storage <= STORAGE.tree) {
					this.dataBlocks(e.storage, e.key, e.eof).forEach(take);
					this.indexBlocks(e.storage, e.key, e.eof).forEach(take);
				}
				if (used !== e.blocksUsed && e.storage !== STORAGE.pascal) problems.push(`${e.path}: blocks used says ${e.blocksUsed}, ${used} found`);
			}
		};
		visit(2, "");
		const unclaimed: number[] = [];
		for (let b = 2; b < this.totalBlocks; b++) if (!this.isFree(b) && !owner.has(b)) unclaimed.push(b);
		return { problems, unclaimed };
	}
}
