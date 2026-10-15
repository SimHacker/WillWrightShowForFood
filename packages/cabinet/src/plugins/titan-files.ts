import type { Device, Iot, IotReply } from "../bus.js";

const WMASK = 0o777777;

/**
 * tiny-titan's file service: device 24, beside the 1972 link on 22-23 (TINY-TITAN.md, "Files").
 * Titan's job at Cambridge was remembering what PIXIE drew; this gives any PDP-7 program the
 * same thing by name, without the blocklet handshake. A cabinet extension, not 1972.
 *
 * The PDP-7 fills a request block in core and hands its address over; the host does the whole
 * transfer by direct memory access, as a disc controller would, and raises a flag:
 *
 *   word 0   operation: 1 READ, 2 WRITE, 3 SIZE, 4 DELETE, 5 LIST
 *   word 1   the path's address: one character per word, as Forth's S" leaves it
 *   word 2   offset into the file, in 18-bit words
 *   word 3   length in words (READ: at most; WRITE: exactly)
 *   word 4   core address of the data (15 bits: any bank of a 32K machine)
 *   word 5   result, written by the host: words moved or the size, or negative for an error
 *   word 6   the path's length in characters
 *
 * A file is a sequence of 18-bit words. Paths name where it lives; `.gz` on the end stores it
 * compressed, transparently. Paths are case-insensitive, as the PDP-7's teletype has no lower
 * case: they are folded to lower case before they reach a mount. LIST writes the names under a directory, one per line, as
 * characters, one per word.
 *
 * IOTs, device 24, grouped by 060 as the 340's are; bit 010 is the CPU's, clearing AC:
 *
 *   702401 FSF  skip if the last request has finished
 *   702412 FRS  read the last result (word 5 of the block, again); 010 clears AC first
 *   702404 FGO  start the request whose block is at AC (15 bits)
 *   702444 FCF  clear the flag
 */
export const FILES_DEVICE = 0o24;

export const FILE_OP = { read: 1, write: 2, size: 3, delete: 4, list: 5 } as const;

/** Errors, as negative results. */
export const FILE_ERR = { noFile: -1, badPath: -2, badOp: -3, readOnly: -4, full: -5, failed: -6 } as const;

/**
 * Where files live. A mount answers for every path under its prefix; the longest prefix wins.
 * Async, since browser storage and the network are; the device waits, the PDP-7 polls FSF.
 */
export interface FileMount {
	read(path: string): Promise<Uint32Array | undefined>;
	write?(path: string, data: Uint32Array): Promise<void>;
	delete?(path: string): Promise<boolean>;
	list?(dir: string): Promise<string[]>;
}

/** Files in a Map: the default for /tmp and tests. */
export class MemoryMount implements FileMount {
	files = new Map<string, Uint32Array>();
	async read(path: string): Promise<Uint32Array | undefined> {
		return this.files.get(path);
	}
	async write(path: string, data: Uint32Array): Promise<void> {
		this.files.set(path, data);
	}
	async delete(path: string): Promise<boolean> {
		return this.files.delete(path);
	}
	async list(dir: string): Promise<string[]> {
		const pre = dir.endsWith("/") ? dir : `${dir}/`;
		return [...this.files.keys()].filter((k) => k.startsWith(pre)).map((k) => k.slice(pre.length)).sort();
	}
}

/**
 * Read-only files made on demand, like Unix's /proc: each name is a function of the cabinet's
 * state at the moment it's read. Text comes out one character per word.
 */
export class ProcMount implements FileMount {
	constructor(readonly entries: Record<string, () => Uint32Array | string>) {}
	async read(path: string): Promise<Uint32Array | undefined> {
		const f = this.entries[path.replace(/^\/+/, "")];
		if (!f) return undefined;
		const v = f();
		return typeof v === "string" ? textWords(v) : v;
	}
	async list(): Promise<string[]> {
		return Object.keys(this.entries).sort();
	}
}

/** One character a word, as Forth's strings and the teletype have them. */
export function textWords(s: string): Uint32Array {
	return Uint32Array.from(s, (c) => c.charCodeAt(0) & 0o177);
}
export function wordsText(w: ArrayLike<number>): string {
	return Array.from(w, (c) => String.fromCharCode(c & 0o177)).join("");
}

/**
 * 18-bit words as bytes, three bytes a word, big-endian: what goes into browser storage, a
 * download, or a .gz. Words are masked to 18 bits.
 */
export function wordsToBytes(w: ArrayLike<number>): Uint8Array {
	const b = new Uint8Array(w.length * 3);
	for (let i = 0; i < w.length; i += 1) {
		const v = (w[i] ?? 0) & WMASK;
		b[3 * i] = v >> 16;
		b[3 * i + 1] = (v >> 8) & 0xff;
		b[3 * i + 2] = v & 0xff;
	}
	return b;
}
export function bytesToWords(b: Uint8Array): Uint32Array {
	const w = new Uint32Array(Math.floor(b.length / 3));
	for (let i = 0; i < w.length; i += 1) w[i] = ((b[3 * i]! << 16) | (b[3 * i + 1]! << 8) | b[3 * i + 2]!) & WMASK;
	return w;
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
	// The DOM and Node stream typings disagree; at run time both are web streams.
	// biome-ignore lint/suspicious/noExplicitAny: bridging the two typings
	const out = new Blob([new Uint8Array(bytes)]).stream().pipeThrough(stream as any);
	// biome-ignore lint/suspicious/noExplicitAny: as above
	return new Uint8Array(await new Response(out as any).arrayBuffer());
}
export const gzip = (b: Uint8Array) => pipe(b, new CompressionStream("gzip"));
export const gunzip = (b: Uint8Array) => pipe(b, new DecompressionStream("gzip"));

/**
 * Bytes under string keys: localStorage in the browser, or a Map in a test. Files are stored
 * as base64 of their three-bytes-a-word form, gzipped first if the name ends in .gz.
 */
export interface ByteStore {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
	readonly length: number;
	key(i: number): string | null;
}

const b64 = (b: Uint8Array) => {
	let s = "";
	for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
	return btoa(s);
};
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

/** Files kept in a ByteStore (the browser's localStorage) under `prefix`, surviving a reload. */
export class StorageMount implements FileMount {
	constructor(
		readonly store: ByteStore,
		readonly prefix = "cabinet-files:",
	) {}
	async read(path: string): Promise<Uint32Array | undefined> {
		const v = this.store.getItem(this.prefix + path);
		if (v === null) return undefined;
		let bytes: Uint8Array = unb64(v);
		if (path.endsWith(".gz")) bytes = await gunzip(bytes);
		return bytesToWords(bytes);
	}
	async write(path: string, data: Uint32Array): Promise<void> {
		let bytes: Uint8Array = wordsToBytes(data);
		if (path.endsWith(".gz")) bytes = await gzip(bytes);
		this.store.setItem(this.prefix + path, b64(bytes));
	}
	async delete(path: string): Promise<boolean> {
		const had = this.store.getItem(this.prefix + path) !== null;
		this.store.removeItem(this.prefix + path);
		return had;
	}
	async list(dir: string): Promise<string[]> {
		const pre = this.prefix + (dir.endsWith("/") || dir === "" ? dir : `${dir}/`);
		const out: string[] = [];
		for (let i = 0; i < this.store.length; i += 1) {
			const k = this.store.key(i);
			if (k?.startsWith(pre)) out.push(k.slice(pre.length));
		}
		return out.sort();
	}
}

/** Core, as the device reaches it: 15-bit addresses, any bank. */
export type CoreAccess = { read(addr: number): number; write(addr: number, word: number): void };

export type TitanFilesOpts = {
	core: CoreAccess;
	/** Path prefix to mount, longest prefix first; "/tmp" etc. Paths are relative to the mount. */
	mounts?: Record<string, FileMount>;
};

/** The device: a request block, a flag, and the host doing the transfer. */
export class TitanFiles implements Device {
	readonly name = "titan-files";
	readonly iots = [FILES_DEVICE];

	readonly mounts: [string, FileMount][];
	private readonly core: CoreAccess;
	flag = true;
	result = 0;
	/** The request in flight, for a test to await. */
	pending: Promise<void> | null = null;

	constructor(opts: TitanFilesOpts) {
		this.core = opts.core;
		this.mounts = Object.entries(opts.mounts ?? { "/tmp": new MemoryMount() }).sort((a, b) => b[0].length - a[0].length);
	}

	/** Which mount, and the path within it. */
	resolve(path: string): [FileMount, string] | undefined {
		if (!path.startsWith("/") || path.includes("..")) return undefined;
		for (const [pre, m] of this.mounts) {
			if (path === pre) return [m, ""];
			if (path.startsWith(pre.endsWith("/") ? pre : `${pre}/`)) return [m, path.slice(pre.length).replace(/^\/+/, "")];
		}
		return undefined;
	}

	iot(req: Iot): IotReply {
		let ac = req.ac;
		let skip = false;
		const op = req.pulse & 0o7;
		switch (req.pulse & 0o60) {
			case 0o00:
				if (op & 0o1) skip = this.flag;
				if (op & 0o2) ac |= this.result & WMASK;
				if (op & 0o4) this.start(req.ac & 0o77777);
				break;
			case 0o40:
				if (op & 0o4) this.flag = false;
				break;
		}
		return { ac, skip };
	}

	private start(block: number): void {
		this.flag = false;
		const done = (r: number) => {
			this.result = r;
			this.core.write((block + 5) & 0o77777, r & WMASK);
			this.flag = true;
		};
		this.pending = this.run(block).then(done, () => done(FILE_ERR.failed));
	}

	private async run(block: number): Promise<number> {
		const w = (i: number) => this.core.read((block + i) & 0o77777) & WMASK;
		const s18 = (v: number) => (v & 0o400000 ? v - 0o1000000 : v);
		const op = w(0);
		// A VARIABLE's or CREATE's address may be in LAW form, negative: bank 0, 13 bits.
		const addr = (v: number) => (v & 0o400000 ? v & 0o17777 : v & 0o77777);
		const pathAt = addr(w(1));
		const count = Math.min(w(6), 256);
		const path = wordsText(Array.from({ length: count }, (_, i) => this.core.read((pathAt + i) & 0o77777))).toLowerCase();
		const offset = Math.max(0, s18(w(2)));
		const length = Math.max(0, s18(w(3)));
		const data = addr(w(4));
		const at = this.resolve(path);
		if (!at) return FILE_ERR.badPath;
		const [mount, rel] = at;
		switch (op) {
			case FILE_OP.read: {
				const f = await mount.read(rel);
				if (!f) return FILE_ERR.noFile;
				const n = Math.max(0, Math.min(length, f.length - offset));
				for (let i = 0; i < n; i += 1) this.core.write((data + i) & 0o77777, f[offset + i]! & WMASK);
				return n;
			}
			case FILE_OP.write: {
				if (!mount.write) return FILE_ERR.readOnly;
				const old = (await mount.read(rel)) ?? new Uint32Array(0);
				const f = new Uint32Array(Math.max(old.length, offset + length));
				f.set(old);
				for (let i = 0; i < length; i += 1) f[offset + i] = this.core.read((data + i) & 0o77777) & WMASK;
				await mount.write(rel, f);
				return length;
			}
			case FILE_OP.size: {
				const f = await mount.read(rel);
				return f ? f.length : FILE_ERR.noFile;
			}
			case FILE_OP.delete:
				if (!mount.delete) return FILE_ERR.readOnly;
				return (await mount.delete(rel)) ? 0 : FILE_ERR.noFile;
			case FILE_OP.list: {
				if (!mount.list) return FILE_ERR.badOp;
				const text = textWords((await mount.list(rel)).map((n) => `${n}\n`).join(""));
				const n = Math.min(length, text.length);
				for (let i = 0; i < n; i += 1) this.core.write((data + i) & 0o77777, text[i]!);
				return n;
			}
			default:
				return FILE_ERR.badOp;
		}
	}

	reset(): void {
		this.flag = true;
	}
}
