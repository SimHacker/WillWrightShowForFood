import type { ByteStore } from "../plugins/titan-files.js";
import { MemoryStore } from "./store.js";

/** One saved moment, as SNAPSHOT.yml names it. `time` is milliseconds. */
export type SnapshotInfo = {
	slug: string;
	name: string;
	cartridge: string;
	time: number;
	cycles: number;
};

/** Where a shelf keeps snapshot directories. The page and the tests share this. */
export interface SnapshotShelf {
	slugs(): Promise<string[]>;
	read(slug: string): Promise<MemoryStore>;
	write(slug: string, store: MemoryStore): Promise<void>;
	remove(slug: string): Promise<void>;
}

/** A shelf in a map. Tests use it, and a page with nowhere else to write. */
export class MemoryShelf implements SnapshotShelf {
	private readonly snaps = new Map<string, MemoryStore>();

	async slugs(): Promise<string[]> {
		return [...this.snaps.keys()].sort();
	}

	async read(slug: string): Promise<MemoryStore> {
		const found = this.snaps.get(slug);
		if (!found) throw new Error(`no snapshot ${slug}`);
		return copyStore(found);
	}

	async write(slug: string, store: MemoryStore): Promise<void> {
		this.snaps.set(slug, copyStore(store));
	}

	async remove(slug: string): Promise<void> {
		this.snaps.delete(slug);
	}
}

const b64 = (bytes: Uint8Array) => {
	let text = "";
	for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
	return btoa(text);
};
const unb64 = (text: string) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

/**
 * A shelf in a string store: the browser's localStorage when a snapshot fits there.
 * Each file is one key, `prefix/slug/path`.
 */
export class ByteShelf implements SnapshotShelf {
	constructor(
		private readonly bytes: ByteStore,
		readonly prefix = "cabinet-snapshots",
	) {}

	private parse(key: string): { slug: string; path: string } | null {
		const head = `${this.prefix}/`;
		if (!key.startsWith(head)) return null;
		const rest = key.slice(head.length);
		const cut = rest.indexOf("/");
		if (cut <= 0) return null;
		return { slug: rest.slice(0, cut), path: rest.slice(cut + 1) };
	}

	private keys(): { key: string; slug: string; path: string }[] {
		const out: { key: string; slug: string; path: string }[] = [];
		for (let i = 0; i < this.bytes.length; i += 1) {
			const key = this.bytes.key(i);
			if (!key) continue;
			const parsed = this.parse(key);
			if (parsed) out.push({ key, ...parsed });
		}
		return out;
	}

	async slugs(): Promise<string[]> {
		return [...new Set(this.keys().map((row) => row.slug))].sort();
	}

	async read(slug: string): Promise<MemoryStore> {
		const store = new MemoryStore();
		for (const row of this.keys()) {
			if (row.slug !== slug) continue;
			const text = this.bytes.getItem(row.key);
			if (text !== null) store.put(row.path, unb64(text));
		}
		if (store.files.size === 0) throw new Error(`no snapshot ${slug}`);
		return store;
	}

	async write(slug: string, store: MemoryStore): Promise<void> {
		await this.remove(slug);
		for (const [path, data] of store.files) this.bytes.setItem(`${this.prefix}/${slug}/${path}`, b64(data));
	}

	async remove(slug: string): Promise<void> {
		for (const row of this.keys()) if (row.slug === slug) this.bytes.removeItem(row.key);
	}
}

/** The bit of a directory handle the shelf uses. The origin private file system is one. */
export type DirHandle = {
	getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<DirHandle>;
	getFileHandle(name: string, options?: { create?: boolean }): Promise<FileHandle>;
	removeEntry(name: string, options?: { recursive?: boolean }): Promise<void>;
	entries(): AsyncIterable<[string, { kind: string } & Partial<DirHandle & FileHandle>]>;
};

export type FileHandle = {
	getFile(): Promise<{ arrayBuffer(): Promise<ArrayBuffer> }>;
	createWritable(): Promise<{ write(data: Uint8Array): Promise<void>; close(): Promise<void> }>;
};

/** A shelf in a directory: one subdirectory per snapshot, the same paths as a MemoryStore. */
export class DirectoryShelf implements SnapshotShelf {
	constructor(private readonly root: DirHandle) {}

	async slugs(): Promise<string[]> {
		const names: string[] = [];
		for await (const [name, handle] of this.root.entries()) if (handle.kind === "directory") names.push(name);
		return names.sort();
	}

	async read(slug: string): Promise<MemoryStore> {
		const store = new MemoryStore();
		await readTree(await this.root.getDirectoryHandle(slug), "", store);
		if (store.files.size === 0) throw new Error(`no snapshot ${slug}`);
		return store;
	}

	async write(slug: string, store: MemoryStore): Promise<void> {
		await this.remove(slug);
		const dir = await this.root.getDirectoryHandle(slug, { create: true });
		for (const [path, data] of store.files) await writeFile(dir, path, data);
	}

	async remove(slug: string): Promise<void> {
		try {
			await this.root.removeEntry(slug, { recursive: true });
		} catch {
			// Already gone.
		}
	}
}

async function readTree(dir: DirHandle, prefix: string, store: MemoryStore): Promise<void> {
	for await (const [name, handle] of dir.entries()) {
		const path = prefix ? `${prefix}/${name}` : name;
		if (handle.kind === "directory") await readTree(handle as DirHandle, path, store);
		else if (handle.getFile) {
			const file = await handle.getFile();
			store.put(path, new Uint8Array(await file.arrayBuffer()));
		}
	}
}

async function writeFile(dir: DirHandle, path: string, data: Uint8Array): Promise<void> {
	const parts = path.split("/");
	let at = dir;
	for (const part of parts.slice(0, -1)) at = await at.getDirectoryHandle(part, { create: true });
	const handle = await at.getFileHandle(parts[parts.length - 1]!, { create: true });
	const writer = await handle.createWritable();
	await writer.write(data);
	await writer.close();
}

/** The browser's origin private file system, under `cabinet-snapshots`. */
export async function openOpfsShelf(): Promise<SnapshotShelf> {
	const storage = (globalThis as { navigator?: { storage?: { getDirectory?: () => Promise<DirHandle> } } }).navigator?.storage;
	if (!storage?.getDirectory) throw new Error("no origin private file system");
	const root = await storage.getDirectory();
	return new DirectoryShelf(await root.getDirectoryHandle("cabinet-snapshots", { create: true }));
}

function copyStore(store: MemoryStore): MemoryStore {
	const copy = new MemoryStore();
	for (const [path, data] of store.files) copy.put(path, data);
	return copy;
}
