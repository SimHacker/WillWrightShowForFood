// Apple Pascal (UCSD p-System) volumes: read, write, delete, rename, krunch, format, check.
// In the page and Node.
//
// Written from the Apple Pascal Operating System Reference Manual and the UCSD p-System's
// directory declarations, checked against Andy McFadden's CiderPress II
// (DiskArc/FS/Pascal-notes.md; Apache 2.0) and its cp2 command.
//
// Pascal reads 512-byte blocks, so a DOS-order .dsk/.do image is reordered first (.po images
// already are). The directory is blocks 2-5: a 26-byte volume entry (first block 0, next block
// 6, name up to 7 characters, blocks on the volume, file count), then up to 77 file entries of
// 26 bytes (first block, block after the last, kind, name up to 15 characters, bytes used in
// the last block, date), kept in block order. A file is one contiguous run of blocks.

import { blockOrder, dosOrder, latin1, openImage, put16, saveImage, u16, type TwoImg } from "./disk.js";

export { blockOrder, dosOrder, i16, latin1, u16 } from "./disk.js";

export const PASCAL_KINDS = ["volume", "bad", "code", "text", "info", "data", "graf", "foto", "secure"] as const;
export type PascalKind = (typeof PASCAL_KINDS)[number];

const DIR_FIRST = 2;
const DIR_NEXT = 6;
const ENTRY = 26;
const MAX_FILES = 77;
const NAME = /^[A-Z0-9./_\-]{1,15}$/;
const VOLUME_NAME = /^[A-Z0-9./_\-]{1,7}$/;

export interface PascalEntry {
	name: string;
	first: number;
	next: number;
	kind: string;
	lastBytes: number;
	date: string;
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

/** A Pascal date word: month in bits 0-3, day 4-8, year (two digits) 9-15. */
export function packPascalDate(d: Date | undefined): number {
	if (!d) return 0;
	return ((d.getFullYear() % 100) << 9) | (d.getDate() << 4) | (d.getMonth() + 1);
}

/** A .TEXT file's contents: a 2-block header, then 1024-byte pages of CR-ended lines that never cross a page, leading spaces as DLE and 32 plus their count. */
export function pascalText(text: string): Uint8Array {
	const pages: number[][] = [];
	let page: number[] = [];
	for (const line of text.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n")) {
		const indent = line.length - line.trimStart().length;
		const body = line.trimStart();
		const bytes: number[] = [];
		let left = indent;
		while (left > 0) {
			const n = Math.min(left, 223);
			bytes.push(16, 32 + n);
			left -= n;
		}
		for (let i = 0; i < body.length; i++) bytes.push(body.charCodeAt(i) & 0x7f);
		bytes.push(13);
		if (bytes.length > 1023) throw new Error(`a Pascal text line holds at most 1022 characters`);
		if (page.length + bytes.length > 1023) {
			pages.push(page);
			page = [];
		}
		page.push(...bytes);
	}
	if (page.length || !pages.length) pages.push(page);
	const out = new Uint8Array(1024 + pages.length * 1024);
	pages.forEach((p, i) => out.set(p, 1024 + i * 1024));
	return out;
}

export class PascalVolume {
	readonly data: Uint8Array;
	readonly entries: PascalEntry[] = [];
	dosOrder: boolean;
	twoImg: TwoImg | undefined;

	/** `dosOrder` is false for .po images. The volume keeps its own copy of the bytes. */
	constructor(image: Uint8Array, dosOrder = true) {
		this.dosOrder = dosOrder;
		this.data = blockOrder(image, dosOrder).slice();
		const d = this.dir();
		if (u16(d, 0) !== 0 || u16(d, 2) !== DIR_NEXT || (u16(d, 4) & 15) !== 0 || !d[6] || d[6] > 7) throw new Error("no Pascal volume directory at block 2");
		this.reload();
	}

	/** A disk image in either order, or a 2MG; `image()` gives it back the same way. */
	static fromImage(file: Uint8Array, name = ""): PascalVolume {
		const o = openImage(file, name);
		if (o.fs !== "pascal") throw new Error(`${name || "image"}: not a Pascal volume`);
		const v = new PascalVolume(o.blocks, false);
		v.dosOrder = o.order === "dos";
		v.twoImg = o.twoImg;
		return v;
	}

	/** A new empty volume. `boot` is copied into blocks 0-1 (a Pascal boot loader from another disk). */
	static format(name: string, totalBlocks = 280, options: { boot?: Uint8Array; dosOrder?: boolean; date?: Date } = {}): PascalVolume {
		const upper = name.toUpperCase();
		if (!VOLUME_NAME.test(upper)) throw new Error(`${name}: a Pascal volume name is 1-7 letters, digits and . / _ -`);
		if (totalBlocks < 7 || totalBlocks > 65535) throw new Error(`a Pascal volume is 7 to 65535 blocks, not ${totalBlocks}`);
		const data = new Uint8Array(totalBlocks * 512);
		if (options.boot) data.set(options.boot.subarray(0, 1024));
		const d = data.subarray(DIR_FIRST * 512, DIR_NEXT * 512);
		put16(d, 2, DIR_NEXT);
		d[6] = upper.length;
		for (let i = 0; i < upper.length; i++) d[7 + i] = upper.charCodeAt(i);
		put16(d, 14, totalBlocks);
		put16(d, 20, packPascalDate(options.date));
		const dos = options.dosOrder ?? totalBlocks === 280;
		const v = new PascalVolume(data, false);
		v.dosOrder = dos && totalBlocks === 280;
		return v;
	}

	private dir(): Uint8Array {
		return this.data.subarray(DIR_FIRST * 512, DIR_NEXT * 512);
	}

	get name(): string {
		const d = this.dir();
		return latin1(d.subarray(7, 7 + (d[6] ?? 0)));
	}

	get totalBlocks(): number {
		return u16(this.dir(), 14);
	}

	/** Reads the directory again. */
	reload(): void {
		const d = this.dir();
		this.entries.length = 0;
		const count = Math.min(u16(d, 16), MAX_FILES);
		for (let i = 1; i <= count; i++) {
			const e = d.subarray(i * ENTRY, i * ENTRY + ENTRY);
			const kind = u16(e, 4) & 15;
			this.entries.push({
				name: latin1(e.subarray(7, 7 + Math.min(e[6] ?? 0, 15))),
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

	has(name: string): boolean {
		return this.entries.some((x) => x.name.toUpperCase() === name.toUpperCase());
	}

	/** The file's bytes, as a view: writing into it changes the volume. */
	raw(name: string): Uint8Array {
		const e = this.find(name);
		const body = this.data.subarray(e.first * 512, e.next * 512);
		return e.lastBytes && e.lastBytes < 512 ? body.subarray(0, body.length - 512 + e.lastBytes) : body;
	}

	/** The disk image, in the sector order (and 2MG wrapper) it was read in. */
	image(): Uint8Array {
		if (this.twoImg) return saveImage(this.data, this.dosOrder ? "dos" : "prodos", this.twoImg);
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

	private records(): Uint8Array[] {
		const d = this.dir();
		return Array.from({ length: Math.min(u16(d, 16), MAX_FILES) }, (_, i) => d.slice((i + 1) * ENTRY, (i + 2) * ENTRY));
	}

	private saveRecords(records: Uint8Array[]): void {
		const d = this.dir();
		records.sort((a, b) => u16(a, 0) - u16(b, 0));
		d.fill(0, ENTRY);
		records.forEach((r, i) => d.set(r, (i + 1) * ENTRY));
		put16(d, 16, records.length);
		this.reload();
	}

	/** The free runs of blocks, in order: [first, next). */
	gaps(): [number, number][] {
		const out: [number, number][] = [];
		let at = DIR_NEXT;
		for (const e of [...this.entries].sort((a, b) => a.first - b.first)) {
			if (e.first > at) out.push([at, e.first]);
			at = Math.max(at, e.next);
		}
		if (this.totalBlocks > at) out.push([at, this.totalBlocks]);
		return out;
	}

	freeBlocks(): number {
		return this.gaps().reduce((n, [a, b]) => n + b - a, 0);
	}

	/**
	 * Writes a file into the first free run that holds it, replacing a file of the same name.
	 * When no run is long enough but the free blocks add up, krunch first (`krunch: true`).
	 */
	write(name: string, bytes: Uint8Array, kind: PascalKind = "data", options: { date?: Date; krunch?: boolean } = {}): PascalEntry {
		const upper = name.toUpperCase();
		if (!NAME.test(upper)) throw new Error(`${name}: a Pascal file name is 1-15 letters, digits and . / _ -`);
		const code = PASCAL_KINDS.indexOf(kind);
		if (code < 1) throw new Error(`no Pascal file kind ${kind}`);
		const blocks = Math.max(1, Math.ceil(bytes.length / 512));
		const old = this.entries.find((x) => x.name.toUpperCase() === upper);
		const records = this.records().filter((r) => latin1(r.subarray(7, 7 + r[6]!)).toUpperCase() !== upper);
		if (!old && records.length >= MAX_FILES) throw new Error(`${this.name}: the directory holds ${MAX_FILES} files`);
		const saved = old ? this.raw(old.name).slice() : undefined;
		if (old) this.saveRecords(records);
		let gap = this.gaps().find(([a, b]) => b - a >= blocks);
		if (!gap && options.krunch && this.freeBlocks() >= blocks) {
			this.krunch();
			gap = this.gaps().find(([a, b]) => b - a >= blocks);
		}
		if (!gap) {
			if (old && saved) this.restore(old, saved, code);
			throw new Error(`${this.name}: ${name} needs ${blocks} contiguous blocks; the longest free run is ${Math.max(0, ...this.gaps().map(([a, b]) => b - a))}${this.freeBlocks() >= blocks ? " (krunch would make room)" : ""}`);
		}
		const first = gap[0];
		const body = this.data.subarray(first * 512, (first + blocks) * 512);
		body.fill(0);
		body.set(bytes);
		const r = new Uint8Array(ENTRY);
		put16(r, 0, first);
		put16(r, 2, first + blocks);
		put16(r, 4, code);
		r[6] = upper.length;
		for (let i = 0; i < upper.length; i++) r[7 + i] = upper.charCodeAt(i);
		put16(r, 22, bytes.length % 512 || (bytes.length ? 512 : 0));
		put16(r, 24, packPascalDate(options.date));
		this.saveRecords([...this.records(), r]);
		return this.find(upper);
	}

	private restore(old: PascalEntry, bytes: Uint8Array, code: number): void {
		const r = new Uint8Array(ENTRY);
		put16(r, 0, old.first);
		put16(r, 2, old.next);
		put16(r, 4, code);
		r[6] = old.name.length;
		for (let i = 0; i < old.name.length; i++) r[7 + i] = old.name.charCodeAt(i);
		put16(r, 22, old.lastBytes);
		this.data.set(bytes, old.first * 512);
		this.saveRecords([...this.records(), r]);
	}

	/** Writes text as a .TEXT file. */
	writeText(name: string, text: string, options: { date?: Date; krunch?: boolean } = {}): PascalEntry {
		return this.write(name, pascalText(text), "text", options);
	}

	delete(name: string): void {
		const e = this.find(name);
		this.saveRecords(this.records().filter((r) => u16(r, 0) !== e.first));
	}

	rename(name: string, to: string): PascalEntry {
		const upper = to.toUpperCase();
		if (!NAME.test(upper)) throw new Error(`${to}: a Pascal file name is 1-15 letters, digits and . / _ -`);
		if (this.has(upper)) throw new Error(`${upper} exists`);
		const e = this.find(name);
		const records = this.records();
		const r = records.find((x) => u16(x, 0) === e.first)!;
		r.fill(0, 6, 22);
		r[6] = upper.length;
		for (let i = 0; i < upper.length; i++) r[7 + i] = upper.charCodeAt(i);
		this.saveRecords(records);
		return this.find(upper);
	}

	/** Moves every file down to close the gaps between them, as the Filer's K(runch) does. */
	krunch(): void {
		const records = this.records().sort((a, b) => u16(a, 0) - u16(b, 0));
		let at = DIR_NEXT;
		for (const r of records) {
			const first = u16(r, 0), next = u16(r, 2), n = next - first;
			if (first !== at) {
				this.data.copyWithin(at * 512, first * 512, next * 512);
				put16(r, 0, at);
				put16(r, 2, at + n);
			}
			at += n;
		}
		this.data.fill(0, at * 512, this.totalBlocks * 512);
		this.saveRecords(records);
	}

	/** What is wrong with the directory, as sentences. Empty when it is consistent. */
	check(): string[] {
		const problems: string[] = [];
		const d = this.dir();
		if (u16(d, 16) > MAX_FILES) problems.push(`the directory counts ${u16(d, 16)} files; it holds ${MAX_FILES}`);
		if (this.totalBlocks * 512 > this.data.length) problems.push(`the volume says ${this.totalBlocks} blocks; the image has ${this.data.length / 512}`);
		let at = DIR_NEXT;
		for (const e of this.entries) {
			if (e.first < at) problems.push(`${e.name} starts at block ${e.first}, inside the file or directory before it`);
			if (e.next <= e.first) problems.push(`${e.name} ends before it starts`);
			if (e.next > this.totalBlocks) problems.push(`${e.name} runs past the end of the volume`);
			if (e.lastBytes > 512) problems.push(`${e.name}: ${e.lastBytes} bytes in its last block`);
			if (!NAME.test(e.name.toUpperCase()) && e.kind !== "bad") problems.push(`${e.name}: not a Pascal file name`);
			at = Math.max(at, e.next);
		}
		return problems;
	}
}
