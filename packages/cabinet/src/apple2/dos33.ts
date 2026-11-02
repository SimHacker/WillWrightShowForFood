// Apple DOS 3.3 volumes: read, write, delete, rename, lock, format, check. In the page and Node.
//
// Written from Worth and Lechner's Beneath Apple DOS (chapter 4, "Diskette Organization"), and
// checked against Andy McFadden's CiderPress II (DiskArc/FS/DOS-notes.md; Apache 2.0) and its
// cp2 command.
//
// A 140K disk is 35 tracks of 16 sectors. Track 17 sector 0 is the VTOC: where the catalog
// starts, the volume number, and a free-sector bitmap of 4 bytes a track (sectors 15-8, then
// 7-0, 1 = free). The catalog is a chain of sectors on track 17, each holding 7 entries of 35
// bytes: the file's first track/sector list, its type, a 30-character name with the high bits
// set, and its length in sectors. A track/sector list holds 122 track and sector pairs and a
// link to the next list; [0, 0] is a hole. A deleted entry's first byte is $FF, its track moved
// into the name's last character. B files begin with a load address and a length, A and I files
// with a length; T files run to the first zero.

import { appleText, blockOrder, dosOrder as toDosOrder, fromAppleText, openImage, saveImage, u16, type Order, type TwoImg } from "./disk.js";

export const DOS_TYPES: Record<number, string> = { 0: "T", 1: "I", 2: "A", 4: "B", 8: "S", 16: "R", 32: "a", 64: "b" };
const TYPE_CODES: Record<string, number> = Object.fromEntries(Object.entries(DOS_TYPES).map(([k, v]) => [v, Number(k)]));

export type DosType = "T" | "I" | "A" | "B" | "S" | "R" | "a" | "b";

export interface DosEntry {
	name: string;
	type: string;
	locked: boolean;
	sectors: number;
	/** Track and sector of the file's first track/sector list. */
	tsl: [number, number];
	/** Where the catalog entry is: catalog track, sector, entry 0-6. */
	at: [number, number, number];
	deleted: boolean;
}

export interface DosFile {
	type: string;
	/** Load address of a B file. */
	address?: number;
	/** What the header says, for B, A and I files. */
	length?: number;
	/** The contents without the header; a T file up to its first zero. */
	bytes: Uint8Array;
}

const TRACKS = 35;
const SECTORS = 16;
const PAIRS = 122;

export class Dos33Volume {
	/** The disk in DOS 3.3 sector order. Writes change it in place. */
	readonly image: Uint8Array;
	readonly volume: number;
	readonly entries: DosEntry[] = [];
	/** How `save()` writes the image back out. */
	order: Order = "dos";
	twoImg: TwoImg | undefined;

	/** `image` in DOS order; the volume reads and writes it in place. */
	constructor(image: Uint8Array) {
		this.image = image;
		const vtoc = this.sector(17, 0);
		if (vtoc[3] !== 3) throw new Error(`no DOS 3.3 VTOC at 17/0 (version byte ${vtoc[3]})`);
		this.volume = vtoc[6] ?? 0;
		this.reload();
	}

	/** A disk image in either order, or a 2MG; `save()` gives it back the same way. */
	static fromImage(file: Uint8Array, name = ""): Dos33Volume {
		const o = openImage(file, name);
		if (o.fs !== "dos33") throw new Error(`${name || "image"}: not a DOS 3.3 volume`);
		const v = new Dos33Volume(toDosOrder(o.blocks).slice());
		v.order = o.order;
		v.twoImg = o.twoImg;
		return v;
	}

	/**
	 * A new empty volume: VTOC, catalog on track 17. `boot` (tracks 0-2, a DOS image from
	 * another disk) is copied in; tracks 0-2 stay reserved for one unless `reserveBoot` is false.
	 */
	static format(volume = 254, options: { boot?: Uint8Array; reserveBoot?: boolean } = {}): Dos33Volume {
		const image = new Uint8Array(TRACKS * SECTORS * 256);
		if (options.boot) image.set(options.boot.subarray(0, 3 * SECTORS * 256));
		const vtoc = image.subarray(17 * 4096, 17 * 4096 + 256);
		vtoc.set([0, 17, 15, 3], 0);
		vtoc[6] = volume;
		vtoc[0x27] = PAIRS;
		vtoc[0x30] = 17;
		vtoc[0x31] = 1;
		vtoc.set([TRACKS, SECTORS, 0, 1], 0x34);
		const reserved = options.boot || options.reserveBoot !== false ? 3 : 1;
		for (let t = reserved; t < TRACKS; t++) if (t !== 17) vtoc.set([0xff, 0xff], 0x38 + t * 4);
		for (let s = 15; s >= 1; s--) {
			const c = image.subarray(17 * 4096 + s * 256, 17 * 4096 + s * 256 + 256);
			if (s > 1) c.set([0, 17, s - 1], 0);
		}
		return new Dos33Volume(image);
	}

	/** The image, in the order and wrapper it was read in. */
	save(): Uint8Array {
		return this.order === "dos" && !this.twoImg ? this.image.slice() : saveImage(blockOrder(this.image), this.order, this.twoImg);
	}

	/** Reads the catalog again. */
	reload(): void {
		this.entries.length = 0;
		for (const [t, s] of this.catalogSectors()) {
			const c = this.sector(t, s);
			for (let e = 0; e < 7; e++) {
				const o = 0x0b + e * 35;
				const first = c[o] ?? 0;
				if (first === 0) continue;
				const deleted = first === 0xff;
				const kind = c[o + 2] ?? 0;
				const name = String.fromCharCode(...c.subarray(o + 3, o + 3 + 30).map((x) => x & 0x7f)).trimEnd();
				this.entries.push({
					name: deleted ? name.slice(0, -1).trimEnd() : name,
					type: DOS_TYPES[kind & 0x7f] ?? `$${(kind & 0x7f).toString(16)}`,
					locked: (kind & 0x80) !== 0,
					sectors: (c[o + 33] ?? 0) | ((c[o + 34] ?? 0) << 8),
					tsl: [deleted ? (c[o + 32] ?? 0) : first, c[o + 1] ?? 0],
					at: [t, s, e],
					deleted,
				});
			}
		}
	}

	private catalogSectors(): [number, number][] {
		const vtoc = this.sector(17, 0);
		const out: [number, number][] = [];
		let [t, s] = [vtoc[1] ?? 0, vtoc[2] ?? 0];
		const seen = new Set<string>();
		while ((t || s) && !seen.has(`${t}.${s}`) && t < TRACKS && s < SECTORS) {
			seen.add(`${t}.${s}`);
			out.push([t, s]);
			const c = this.sector(t, s);
			[t, s] = [c[1] ?? 0, c[2] ?? 0];
		}
		return out;
	}

	sector(track: number, sector: number): Uint8Array {
		const o = track * 4096 + sector * 256;
		return this.image.subarray(o, o + 256);
	}

	find(name: string): DosEntry | undefined {
		return this.entries.find((e) => !e.deleted && e.name === name);
	}

	private need(entry: DosEntry | string): DosEntry {
		const e = typeof entry === "string" ? this.find(entry) : entry;
		if (!e) throw new Error(`${entry} not on volume ${this.volume}`);
		return e;
	}

	/** The track/sector lists of a file, in order. */
	private listsOf(entry: DosEntry): [number, number][] {
		const out: [number, number][] = [];
		let [t, s] = entry.tsl;
		const seen = new Set<string>();
		while ((t || s) && !seen.has(`${t}.${s}`) && t < TRACKS && s < SECTORS) {
			seen.add(`${t}.${s}`);
			out.push([t, s]);
			const l = this.sector(t, s);
			[t, s] = [l[1] ?? 0, l[2] ?? 0];
		}
		return out;
	}

	/** The track/sector pairs of a file's data, in order; [0, 0] is a hole. */
	sectorsOf(entry: DosEntry): [number, number][] {
		const out: [number, number][] = [];
		for (const [t, s] of this.listsOf(entry)) {
			const l = this.sector(t, s);
			for (let i = 0x0c; i < 256; i += 2) out.push([l[i] ?? 0, l[i + 1] ?? 0]);
		}
		while (out.length && out[out.length - 1]![0] === 0 && out[out.length - 1]![1] === 0) out.pop();
		return out;
	}

	/** The file's sectors joined, as DOS stores them: B files start with address and length,
	 * A and I files with length, T files run to the first zero. */
	raw(entry: DosEntry | string): Uint8Array {
		const e = this.need(entry);
		const parts = this.sectorsOf(e);
		const out = new Uint8Array(parts.length * 256);
		parts.forEach(([t, s], i) => (t || s) && t < TRACKS && s < SECTORS && out.set(this.sector(t, s), i * 256));
		return out;
	}

	/** A B file's load address and contents. */
	/** `length` is what the header says; `bytes` stops early when the sectors hold less. */
	binary(entry: DosEntry | string): { address: number; length: number; bytes: Uint8Array } {
		const r = this.raw(entry);
		const length = u16(r, 2);
		return { address: u16(r, 0), length, bytes: r.slice(4, 4 + length) };
	}

	/** A file's contents with its header read: B files' address and length, A and I files' length. */
	file(entry: DosEntry | string): DosFile {
		const e = this.need(entry);
		const r = this.raw(e);
		if (e.type === "B") {
			const { address, length, bytes } = this.binary(e);
			return { type: e.type, address, length, bytes };
		}
		if (e.type === "A" || e.type === "I") {
			const length = u16(r, 0);
			return { type: e.type, length, bytes: r.slice(2, 2 + length) };
		}
		if (e.type === "T") {
			const end = r.indexOf(0);
			return { type: e.type, bytes: r.slice(0, end < 0 ? r.length : end) };
		}
		return { type: e.type, bytes: r.slice() };
	}

	/** A T file as text, high bits cleared, carriage returns as newlines. */
	text(entry: DosEntry | string): string {
		return fromAppleText(this.raw(entry));
	}

	isFree(track: number, sector: number): boolean {
		const vtoc = this.sector(17, 0);
		return ((vtoc[0x38 + track * 4 + (sector >= 8 ? 0 : 1)] ?? 0) & (1 << (sector & 7))) !== 0;
	}

	private mark(track: number, sector: number, free: boolean): void {
		const vtoc = this.sector(17, 0);
		const byte = 0x38 + track * 4 + (sector >= 8 ? 0 : 1), bit = 1 << (sector & 7);
		vtoc[byte] = free ? (vtoc[byte] ?? 0) | bit : (vtoc[byte] ?? 0) & ~bit;
	}

	freeSectors(): number {
		let n = 0;
		for (let t = 0; t < TRACKS; t++) for (let s = 0; s < SECTORS; s++) if (this.isFree(t, s)) n++;
		return n;
	}

	/** Takes `n` free sectors, zeroed: tracks 18 up, then 16 down, the way DOS works outward from the catalog. Never track 0. */
	private allocate(n: number): [number, number][] {
		if (n > this.freeSectors()) throw new Error(`disk full: ${n} sectors needed, ${this.freeSectors()} free`);
		const tracks = [...Array.from({ length: TRACKS - 18 }, (_, i) => 18 + i), ...Array.from({ length: 16 }, (_, i) => 16 - i)];
		const out: [number, number][] = [];
		for (const t of tracks) {
			for (let s = SECTORS - 1; s >= 0 && out.length < n; s--) {
				if (this.isFree(t, s)) {
					this.mark(t, s, false);
					this.sector(t, s).fill(0);
					out.push([t, s]);
				}
			}
			if (out.length === n) break;
		}
		if (out.length < n) {
			for (const [t, s] of out) this.mark(t, s, true);
			throw new Error(`disk full: ${n} sectors needed outside track 0`);
		}
		return out;
	}

	private emptySlot(): [number, number, number] {
		for (const [t, s] of this.catalogSectors()) {
			const c = this.sector(t, s);
			for (let e = 0; e < 7; e++) if (c[0x0b + e * 35] === 0) return [t, s, e];
		}
		for (const [t, s] of this.catalogSectors()) {
			const c = this.sector(t, s);
			for (let e = 0; e < 7; e++) if (c[0x0b + e * 35] === 0xff) return [t, s, e];
		}
		throw new Error("catalog full");
	}

	private releaseFile(e: DosEntry): void {
		for (const [t, s] of this.sectorsOf(e)) if ((t || s) && t < TRACKS && s < SECTORS) this.mark(t, s, true);
		for (const [t, s] of this.listsOf(e)) this.mark(t, s, true);
	}

	/** Lays `content` into new sectors with its track/sector lists; returns the first list and the sector count. */
	private store(content: Uint8Array): { tsl: [number, number]; sectors: number } {
		const data = Math.max(1, Math.ceil(content.length / 256));
		const lists = Math.ceil(data / PAIRS);
		const got = this.allocate(data + lists);
		const listSectors = got.slice(0, lists);
		const dataSectors = got.slice(lists);
		listSectors.forEach(([t, s], li) => {
			const l = this.sector(t, s);
			const next = listSectors[li + 1];
			if (next) l.set(next, 1);
			l[5] = (li * PAIRS) & 255;
			l[6] = (li * PAIRS) >> 8;
			dataSectors.slice(li * PAIRS, (li + 1) * PAIRS).forEach(([dt, ds], i) => l.set([dt, ds], 0x0c + i * 2));
		});
		dataSectors.forEach(([t, s], i) => this.sector(t, s).set(content.subarray(i * 256, (i + 1) * 256)));
		return { tsl: listSectors[0]!, sectors: data + lists };
	}

	private setEntry(at: [number, number, number], name: string, type: string, locked: boolean, tsl: [number, number], sectors: number): void {
		const code = TYPE_CODES[type];
		if (code === undefined) throw new Error(`no DOS 3.3 file type ${type}`);
		const c = this.sector(at[0], at[1]);
		const o = 0x0b + at[2] * 35;
		c.set([tsl[0], tsl[1], code | (locked ? 0x80 : 0)], o);
		for (let i = 0; i < 30; i++) c[o + 3 + i] = (name.charCodeAt(i) || 0x20) | 0x80;
		c.set([sectors & 255, sectors >> 8], o + 33);
	}

	/** Content as DOS stores a file of `type`: B with address and length, A and I with length, T ending in a zero. */
	static content(type: DosType, bytes: Uint8Array, options: { address?: number; length?: number } = {}): Uint8Array {
		const length = options.length ?? bytes.length;
		if (type === "B") {
			const out = new Uint8Array(4 + bytes.length);
			const a = options.address ?? 0x2000;
			out.set([a & 255, a >> 8, length & 255, length >> 8]);
			out.set(bytes, 4);
			return out;
		}
		if (type === "A" || type === "I") {
			const out = new Uint8Array(2 + bytes.length);
			out.set([length & 255, length >> 8]);
			out.set(bytes, 2);
			return out;
		}
		if (type === "T") {
			const out = new Uint8Array(bytes.length + 1);
			out.set(bytes);
			return out;
		}
		return bytes;
	}

	/**
	 * Writes a file of `type`, `bytes` without its header (it is added). An existing file of that
	 * name is replaced in its catalog entry; a locked one is refused unless `force`.
	 */
	write(name: string, type: DosType, bytes: Uint8Array, options: { address?: number; length?: number; locked?: boolean; force?: boolean } = {}): DosEntry {
		return this.writeContent(name, type, Dos33Volume.content(type, bytes, options), options);
	}

	/** Writes a file whose `content` already has its header. */
	writeContent(name: string, type: DosType, content: Uint8Array, options: { locked?: boolean; force?: boolean } = {}): DosEntry {
		checkName(name);
		const old = this.find(name);
		if (old?.locked && !options.force) throw new Error(`${name} is locked`);
		const data = Math.max(1, Math.ceil(content.length / 256));
		const need = data + Math.ceil(data / PAIRS);
		const free = this.freeSectors() + (old ? this.sectorsOf(old).filter(([t, s]) => t || s).length + this.listsOf(old).length : 0);
		if (need > free) throw new Error(`disk full: ${name} needs ${need} sectors, ${free} free`);
		const at = old ? old.at : this.emptySlot();
		if (old) this.releaseFile(old);
		const stored = this.store(content);
		this.setEntry(at, name, type, options.locked ?? old?.locked ?? false, stored.tsl, stored.sectors);
		this.reload();
		return this.find(name)!;
	}

	/** Writes a B file: over its own sectors when it exists and fits, bytes past the end left
	 * as they were; otherwise as a new file, or replacing the old one. */
	writeBinary(name: string, address: number, bytes: Uint8Array, length = bytes.length): void {
		const content = Dos33Volume.content("B", bytes, { address, length });
		const e = this.find(name);
		if (e) {
			const parts = this.sectorsOf(e);
			if (parts.length * 256 >= content.length && parts.every(([t, s]) => t || s)) {
				parts.forEach(([t, s], i) => {
					const chunk = content.subarray(i * 256, (i + 1) * 256);
					if (chunk.length) this.sector(t, s).set(chunk);
				});
				return;
			}
		}
		this.writeContent(name, "B", content);
	}

	/** Writes text as a T file: carriage returns, high bits set. */
	writeText(name: string, text: string, options: { locked?: boolean; force?: boolean } = {}): DosEntry {
		return this.write(name, "T", appleText(text, true), options);
	}

	/** Deletes a file, the way DOS does: its sectors freed, its entry marked and its track kept for undeleting. */
	delete(name: string, options: { force?: boolean } = {}): void {
		const e = this.need(name);
		if (e.locked && !options.force) throw new Error(`${name} is locked`);
		this.releaseFile(e);
		const c = this.sector(e.at[0], e.at[1]);
		const o = 0x0b + e.at[2] * 35;
		c[o + 32] = c[o]!;
		c[o] = 0xff;
		this.reload();
	}

	rename(name: string, to: string): DosEntry {
		checkName(to);
		const e = this.need(name);
		if (this.find(to)) throw new Error(`${to} exists`);
		const c = this.sector(e.at[0], e.at[1]);
		const o = 0x0b + e.at[2] * 35;
		for (let i = 0; i < 30; i++) c[o + 3 + i] = (to.charCodeAt(i) || 0x20) | 0x80;
		this.reload();
		return this.find(to)!;
	}

	lock(name: string, locked = true): DosEntry {
		const e = this.need(name);
		const c = this.sector(e.at[0], e.at[1]);
		const o = 0x0b + e.at[2] * 35;
		c[o + 2] = locked ? c[o + 2]! | 0x80 : c[o + 2]! & 0x7f;
		this.reload();
		return this.find(name)!;
	}

	/**
	 * What is wrong with the volume, as sentences: a sector two files claim, a sector a file uses
	 * that the VTOC calls free, a track/sector list or catalog link that points off the disk, a
	 * sector count that disagrees with the file's lists. Empty when the volume is consistent.
	 */
	check(): string[] {
		return this.audit().problems;
	}

	/**
	 * Sectors the VTOC marks used, outside tracks 0-2 and 17, that no file holds. Copy-protected
	 * and game disks keep data there on purpose; on a disk only DOS has written, they are lost space.
	 */
	unclaimed(): [number, number][] {
		return this.audit().unclaimed;
	}

	private audit(): { problems: string[]; unclaimed: [number, number][] } {
		const problems: string[] = [];
		const owner = new Map<string, string>();
		const claim = (t: number, s: number, who: string): void => {
			const k = `${t}/${s}`;
			const prior = owner.get(k);
			if (prior) problems.push(`sector ${k} is used by ${prior} and ${who}`);
			else owner.set(k, who);
			if (this.isFree(t, s)) problems.push(`${who}: sector ${k} is marked free`);
		};
		const on = ([t, s]: [number, number]) => t < TRACKS && s < SECTORS;
		claim(17, 0, "VTOC");
		const catalog = this.catalogSectors();
		for (const [t, s] of catalog) claim(t, s, "catalog");
		const [lt, ls] = [this.sector(...catalog.at(-1)!)[1]!, this.sector(...catalog.at(-1)!)[2]!];
		if ((lt || ls) && !on([lt, ls])) problems.push(`the catalog links to sector ${lt}/${ls}, off the disk`);
		for (const e of this.entries) {
			if (e.deleted) continue;
			if (!on(e.tsl)) {
				problems.push(`${e.name}: its track/sector list is at ${e.tsl[0]}/${e.tsl[1]}, off the disk`);
				continue;
			}
			const lists = this.listsOf(e);
			const pairs = this.sectorsOf(e).filter(([t, s]) => t || s);
			const off = pairs.filter((p) => !on(p));
			const data = pairs.filter(on);
			lists.forEach(([t, s]) => claim(t, s, e.name));
			data.forEach(([t, s]) => claim(t, s, e.name));
			if (off.length) problems.push(`${e.name}: ${off.length} of its track/sector pairs point off the disk`);
			else if (lists.length + data.length !== e.sectors) problems.push(`${e.name}: catalog says ${e.sectors} sectors, ${lists.length + data.length} found`);
		}
		const unclaimed: [number, number][] = [];
		for (let t = 3; t < TRACKS; t++) {
			if (t === 17) continue;
			for (let s = 0; s < SECTORS; s++) if (!this.isFree(t, s) && !owner.has(`${t}/${s}`)) unclaimed.push([t, s]);
		}
		return { problems, unclaimed };
	}
}

function checkName(name: string): void {
	if (!name || name.length > 30) throw new Error(`${name}: a DOS 3.3 name is 1-30 characters`);
	if (!/^[\x20-\x7e]+$/.test(name) || name.includes(",") || !/^[A-Za-z]/.test(name)) throw new Error(`${name}: a DOS 3.3 name starts with a letter and has no commas`);
}
