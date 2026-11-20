import assert from "node:assert/strict";
import test from "node:test";
import { Cabinet } from "../cabinet.js";
import type { ByteStore } from "../plugins/titan-files.js";
import { Pdp7, pdp7 } from "../plugins/pdp7.js";
import { SnapshotLibrary } from "./library.js";
import { ByteShelf, DirectoryShelf, type DirHandle, type FileHandle, MemoryShelf } from "./shelf.js";
import { MemoryStore } from "./store.js";
import { packZip, unpackZip } from "./zip.js";

function machine(word: number): { cpu: Pdp7; box: Cabinet } {
	const cpu = new Pdp7({ coreWords: 64 });
	cpu.write(0, pdp7.mr(pdp7.jmp, 0));
	cpu.write(3, word);
	cpu.pc = 0;
	const box = new Cabinet({ cpu });
	box.run(4);
	return { cpu, box };
}

class MapBytes implements ByteStore {
	private readonly map = new Map<string, string>();
	getItem(key: string): string | null {
		return this.map.get(key) ?? null;
	}
	setItem(key: string, value: string): void {
		this.map.set(key, value);
	}
	removeItem(key: string): void {
		this.map.delete(key);
	}
	get length(): number {
		return this.map.size;
	}
	key(index: number): string | null {
		return [...this.map.keys()][index] ?? null;
	}
}

class MemFile implements FileHandle {
	kind = "file";
	private bytes = new Uint8Array();
	async getFile(): Promise<{ arrayBuffer(): Promise<ArrayBuffer> }> {
		const copy = this.bytes.slice();
		return { arrayBuffer: async () => copy.buffer };
	}
	async createWritable(): Promise<{ write(data: Uint8Array): Promise<void>; close(): Promise<void> }> {
		const chunks: Uint8Array[] = [];
		return {
			write: async (data) => {
				chunks.push(data.slice());
			},
			close: async () => {
				const size = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
				const out = new Uint8Array(size);
				let at = 0;
				for (const chunk of chunks) {
					out.set(chunk, at);
					at += chunk.length;
				}
				this.bytes = out;
			},
		};
	}
}

class MemDir implements DirHandle {
	kind = "directory";
	private readonly kids = new Map<string, MemDir | MemFile>();
	async getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<DirHandle> {
		let child = this.kids.get(name);
		if (!child && options?.create) {
			child = new MemDir();
			this.kids.set(name, child);
		}
		if (!(child instanceof MemDir)) throw new Error(`not a directory: ${name}`);
		return child;
	}
	async getFileHandle(name: string, options?: { create?: boolean }): Promise<FileHandle> {
		let child = this.kids.get(name);
		if (!child && options?.create) {
			child = new MemFile();
			this.kids.set(name, child);
		}
		if (!(child instanceof MemFile)) throw new Error(`not a file: ${name}`);
		return child;
	}
	async removeEntry(name: string): Promise<void> {
		this.kids.delete(name);
	}
	async *entries(): AsyncGenerator<[string, { kind: string } & Partial<DirHandle & FileHandle>]> {
		for (const [name, child] of this.kids) yield [name, child];
	}
}

test("snapshots: create, rename, replace, load, and delete, per cartridge", async () => {
	const lib = new SnapshotLibrary(new MemoryShelf());
	const first = machine(0o111);
	const saved = await lib.create(first.box, { name: "Mid drawing", cartridge: "symelec" });
	assert.equal(saved.slug, "mid-drawing");
	assert.equal(saved.cycles, 4);
	const again = await lib.create(machine(0o222).box, { name: "Mid drawing", cartridge: "symelec" });
	assert.equal(again.slug, "mid-drawing-2");
	await lib.create(machine(0o333).box, { name: "At login", cartridge: "unix" });
	assert.deepEqual(
		(await lib.list("symelec")).map((row) => row.slug).sort(),
		["mid-drawing", "mid-drawing-2"],
	);

	const renamed = await lib.rename(saved.slug, "After lunch");
	assert.equal(renamed.slug, "after-lunch");
	assert.equal((await lib.list("symelec")).some((row) => row.slug === "mid-drawing"), false);

	const next = machine(0);
	await lib.load(renamed.slug, next.box);
	assert.equal(next.cpu.read(3), 0o111);
	assert.equal(next.box.cycles, 4);
	next.cpu.write(3, 0o444);
	next.box.run(2);
	const replaced = await lib.replace(renamed.slug, next.box);
	assert.equal(replaced.slug, renamed.slug);
	assert.equal(replaced.cycles, 6);
	const third = machine(0);
	await lib.load(renamed.slug, third.box);
	assert.equal(third.cpu.read(3), 0o444);

	await lib.remove(renamed.slug);
	assert.equal((await lib.list("symelec")).length, 1);
});

test("snapshots: a byte shelf and a directory shelf keep the same files", async () => {
	const live = machine(0o123);
	const memory = new SnapshotLibrary(new MemoryShelf());
	const saved = await memory.create(live.box, { name: "Held", cartridge: "duel" });
	const zip = await memory.exportZip(saved.slug);

	for (const shelf of [new ByteShelf(new MapBytes()), new DirectoryShelf(new MemDir())]) {
		const lib = new SnapshotLibrary(shelf);
		const imported = await lib.importZip(zip.bytes);
		assert.equal(imported.cartridge, "duel");
		assert.equal(imported.name, "Held");
		const box = machine(0).box;
		await lib.load(imported.slug, box);
		assert.equal(box.cpu.read(3), 0o123);
		const out = await lib.exportZip(imported.slug);
		const back = await unpackZip(out.bytes);
		const from = await unpackZip(zip.bytes);
		assert.equal(back.files.size, from.files.size);
		for (const [path, bytes] of from.files) assert.deepEqual(back.get(path), bytes);
	}
});

test("snapshots: a deflated zip and a wrapping folder both load", async () => {
	const lib = new SnapshotLibrary(new MemoryShelf());
	const saved = await lib.create(machine(0o77).box, { name: "Flat", cartridge: "forth" });
	const plain = await lib.exportZip(saved.slug);
	const folder = new MemoryStore();
	const inner = await unpackZip(plain.bytes);
	for (const [path, bytes] of inner.files) folder.put(`flat/${path}`, bytes);
	const wrapped = await packZip(folder);
	const deflated = await packZip(inner, "deflate");
	for (const bytes of [wrapped, deflated]) {
		const imported = await lib.importZip(bytes);
		const box = machine(0).box;
		await lib.load(imported.slug, box);
		assert.equal(box.cpu.read(3), 0o77);
	}
});
