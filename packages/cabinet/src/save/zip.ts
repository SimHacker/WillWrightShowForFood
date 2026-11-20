import { MemoryStore } from "./store.js";

/**
 * A snapshot directory as a zip. Writing uses the store method, so the bytes are the files.
 * Reading also accepts deflate, which is what a desktop zip tool usually writes.
 */

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
	let c = n;
	for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
	CRC_TABLE[n] = c;
}

function crc32(data: Uint8Array): number {
	let c = 0xffffffff;
	for (let i = 0; i < data.length; i += 1) c = CRC_TABLE[(c ^ data[i]!) & 0xff]! ^ (c >>> 8);
	return (c ^ 0xffffffff) >>> 0;
}

function u16(view: DataView, at: number): number {
	return view.getUint16(at, true);
}
function u32(view: DataView, at: number): number {
	return view.getUint32(at, true);
}

async function deflateRaw(data: Uint8Array): Promise<Uint8Array> {
	const stream = new CompressionStream("deflate-raw");
	const out = new Blob([new Uint8Array(data)]).stream().pipeThrough(stream);
	return new Uint8Array(await new Response(out).arrayBuffer());
}

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
	const stream = new DecompressionStream("deflate-raw");
	const out = new Blob([new Uint8Array(data)]).stream().pipeThrough(stream);
	return new Uint8Array(await new Response(out).arrayBuffer());
}

/** Pack a snapshot. `deflate` is for a test of the reader; downloads use `store`. */
export async function packZip(store: MemoryStore, method: "store" | "deflate" = "store"): Promise<Uint8Array> {
	const locals: Uint8Array[] = [];
	const centrals: Uint8Array[] = [];
	let offset = 0;
	const how = method === "deflate" ? 8 : 0;
	for (const [path, raw] of store.files) {
		const name = new TextEncoder().encode(path);
		const data = how === 8 ? await deflateRaw(raw) : raw;
		const crc = crc32(raw);
		const local = new Uint8Array(30 + name.length + data.length);
		const view = new DataView(local.buffer);
		view.setUint32(0, 0x04034b50, true);
		view.setUint16(4, 20, true);
		view.setUint16(6, 0x800, true);
		view.setUint16(8, how, true);
		view.setUint32(14, crc, true);
		view.setUint32(18, data.length, true);
		view.setUint32(22, raw.length, true);
		view.setUint16(26, name.length, true);
		local.set(name, 30);
		local.set(data, 30 + name.length);
		locals.push(local);

		const central = new Uint8Array(46 + name.length);
		const cd = new DataView(central.buffer);
		cd.setUint32(0, 0x02014b50, true);
		cd.setUint16(4, 20, true);
		cd.setUint16(6, 20, true);
		cd.setUint16(8, 0x800, true);
		cd.setUint16(10, how, true);
		cd.setUint32(16, crc, true);
		cd.setUint32(20, data.length, true);
		cd.setUint32(24, raw.length, true);
		cd.setUint16(28, name.length, true);
		cd.setUint32(42, offset, true);
		central.set(name, 46);
		centrals.push(central);
		offset += local.length;
	}
	const cdSize = centrals.reduce((n, part) => n + part.length, 0);
	const end = new Uint8Array(22);
	const e = new DataView(end.buffer);
	e.setUint32(0, 0x06054b50, true);
	e.setUint16(8, centrals.length, true);
	e.setUint16(10, centrals.length, true);
	e.setUint32(12, cdSize, true);
	e.setUint32(16, offset, true);
	const out = new Uint8Array(offset + cdSize + 22);
	let at = 0;
	for (const part of [...locals, ...centrals, end]) {
		out.set(part, at);
		at += part.length;
	}
	return out;
}

function findEocd(bytes: Uint8Array): number {
	const start = Math.max(0, bytes.length - 22 - 0xffff);
	for (let i = bytes.length - 22; i >= start; i -= 1) {
		if (u32(new DataView(bytes.buffer, bytes.byteOffset + i, 4), 0) === 0x06054b50) return i;
	}
	throw new Error("not a zip");
}

/** A zip entry's path, or null for a directory or a path that leaves the snapshot. */
function entryPath(name: string): string | null {
	if (!name || name.endsWith("/")) return null;
	const parts = name.split("/").filter(Boolean);
	if (parts.some((part) => part === "..")) return null;
	return parts.join("/");
}

/** Read a zip into a snapshot directory. A single wrapping folder is stripped. */
export async function unpackZip(bytes: Uint8Array): Promise<MemoryStore> {
	const eocdAt = findEocd(bytes);
	const eocd = new DataView(bytes.buffer, bytes.byteOffset + eocdAt, 22);
	const count = u16(eocd, 10);
	let cd = u32(eocd, 16);
	const files = new Map<string, Uint8Array>();
	for (let n = 0; n < count; n += 1) {
		const central = new DataView(bytes.buffer, bytes.byteOffset + cd, 46);
		if (u32(central, 0) !== 0x02014b50) throw new Error("zip directory is damaged");
		const method = u16(central, 10);
		const compSize = u32(central, 20);
		const rawSize = u32(central, 24);
		const nameLen = u16(central, 28);
		const extraLen = u16(central, 30);
		const commentLen = u16(central, 32);
		const name = new TextDecoder().decode(bytes.subarray(cd + 46, cd + 46 + nameLen));
		const path = entryPath(name);
		const localAt = u32(central, 42);
		cd += 46 + nameLen + extraLen + commentLen;
		if (!path) continue;
		const local = new DataView(bytes.buffer, bytes.byteOffset + localAt, 30);
		if (u32(local, 0) !== 0x04034b50) throw new Error("zip entry is damaged");
		const dataAt = localAt + 30 + u16(local, 26) + u16(local, 28);
		const compressed = bytes.subarray(dataAt, dataAt + compSize);
		let data: Uint8Array;
		if (method === 0) data = compressed.slice();
		else if (method === 8) data = await inflateRaw(compressed);
		else throw new Error(`zip method ${method} is not supported`);
		if (data.length !== rawSize) throw new Error(`${path} is ${data.length} bytes, the zip says ${rawSize}`);
		files.set(path, data);
	}
	const paths = [...files.keys()];
	const top = paths[0]?.split("/")[0];
	const wrapped = !!top && paths.every((path) => path.startsWith(`${top}/`));
	const store = new MemoryStore();
	for (const [path, data] of files) store.put(wrapped ? path.slice(top.length + 1) : path, data);
	return store;
}
