import { parse } from "yaml";
import { Cabinet } from "../cabinet.js";
import { loadCabinet, saveCabinet } from "./cabinet.js";
import { type SnapshotInfo, type SnapshotShelf } from "./shelf.js";
import { MemoryStore } from "./store.js";
import { toYaml } from "./yaml.js";
import { packZip, unpackZip } from "./zip.js";

/** Named snapshots of one cabinet, kept on a shelf and passed around as a zip. */
export class SnapshotLibrary {
	constructor(private readonly shelf: SnapshotShelf) {}

	/** Newest first. With a cartridge, only the snapshots of that cartridge. */
	async list(cartridge?: string): Promise<SnapshotInfo[]> {
		const rows: SnapshotInfo[] = [];
		for (const slug of await this.shelf.slugs()) {
			try {
				rows.push(await this.info(slug));
			} catch {
				// A directory that is not a snapshot stays on the shelf and out of the list.
			}
		}
		const mine = cartridge === undefined ? rows : rows.filter((row) => row.cartridge === cartridge);
		return mine.sort((a, b) => b.time - a.time || a.name.localeCompare(b.name));
	}

	async info(slug: string): Promise<SnapshotInfo> {
		return readInfo(await this.shelf.read(slug), slug);
	}

	/** Pause the cabinet first. The name becomes the slug, with a number if that slug is taken. */
	async create(box: Cabinet, opts: { name: string; cartridge: string }): Promise<SnapshotInfo> {
		const name = opts.name.trim() || "snapshot";
		const slug = await this.freshSlug(slugify(name));
		const store = new MemoryStore();
		saveCabinet(store, box, slug);
		const info: SnapshotInfo = { slug, name, cartridge: opts.cartridge, time: Date.now(), cycles: box.cycles };
		stamp(store, info);
		await this.shelf.write(slug, store);
		return info;
	}

	/** The same name and slug, the machine as it is now. */
	async replace(slug: string, box: Cabinet): Promise<SnapshotInfo> {
		const prev = await this.info(slug);
		const store = new MemoryStore();
		saveCabinet(store, box, slug);
		const info: SnapshotInfo = { ...prev, time: Date.now(), cycles: box.cycles };
		stamp(store, info);
		await this.shelf.write(slug, store);
		return info;
	}

	/** A new name, and a new slug when the old one no longer spells the name. */
	async rename(slug: string, name: string): Promise<SnapshotInfo> {
		const store = await this.shelf.read(slug);
		const prev = readInfo(store, slug);
		const next = name.trim() || prev.name;
		const taken = new Set((await this.shelf.slugs()).filter((id) => id !== slug));
		const info: SnapshotInfo = { ...prev, name: next, slug: uniqueSlug(taken, slugify(next)) };
		stamp(store, info);
		await this.shelf.write(info.slug, store);
		if (info.slug !== slug) await this.shelf.remove(slug);
		return info;
	}

	async remove(slug: string): Promise<void> {
		await this.shelf.remove(slug);
	}

	/** Load into a cabinet that already has the same devices. */
	async load(slug: string, box: Cabinet): Promise<SnapshotInfo> {
		const store = await this.shelf.read(slug);
		loadCabinet(store, box);
		return readInfo(store, slug);
	}

	async exportZip(slug: string): Promise<{ name: string; bytes: Uint8Array }> {
		const store = await this.shelf.read(slug);
		const info = readInfo(store, slug);
		return { name: `${info.slug}.zip`, bytes: await packZip(store) };
	}

	/** A zip of one snapshot. A missing cartridge becomes `cartridge`, when one is given. */
	async importZip(bytes: Uint8Array, cartridge?: string): Promise<SnapshotInfo> {
		const store = await unpackZip(bytes);
		if (!store.has("SNAPSHOT.yml")) throw new Error("zip has no SNAPSHOT.yml");
		const info = readInfo(store, "snapshot");
		if (!info.cartridge && cartridge) info.cartridge = cartridge;
		info.slug = await this.freshSlug(slugify(info.slug || info.name));
		info.name = info.name || info.slug;
		stamp(store, info);
		await this.shelf.write(info.slug, store);
		return info;
	}

	private async freshSlug(base: string): Promise<string> {
		return uniqueSlug(new Set(await this.shelf.slugs()), base);
	}
}

export function slugify(name: string): string {
	const slug = name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
	return slug || "snapshot";
}

function uniqueSlug(taken: Set<string>, base: string): string {
	if (!taken.has(base)) return base;
	for (let n = 2; ; n += 1) {
		const slug = `${base}-${n}`;
		if (!taken.has(slug)) return slug;
	}
}

function readInfo(store: MemoryStore, slug: string): SnapshotInfo {
	const doc = parse(store.text("SNAPSHOT.yml")) as {
		format?: string;
		id?: string;
		name?: string;
		slug?: string;
		cartridge?: string;
		time?: number;
		cycles?: number;
	};
	if (doc?.format !== "snapshot") throw new Error("not a snapshot");
	return {
		slug: String(doc.slug || slug),
		name: String(doc.name || doc.id || slug),
		cartridge: String(doc.cartridge ?? ""),
		time: typeof doc.time === "number" ? doc.time : 0,
		cycles: typeof doc.cycles === "number" ? doc.cycles : 0,
	};
}

function stamp(store: MemoryStore, info: SnapshotInfo): void {
	const doc = parse(store.text("SNAPSHOT.yml")) as Record<string, unknown>;
	store.put(
		"SNAPSHOT.yml",
		toYaml({ ...doc, id: info.slug, name: info.name, slug: info.slug, cartridge: info.cartridge, time: info.time }),
	);
}
