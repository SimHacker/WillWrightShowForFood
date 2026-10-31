// Timothy Leary's Mind Mirror (Electronic Arts, 1985), Apple II: saved lives as character
// directories, and back. A save is a DOS 3.3 B file named for the person, loaded at $040C by
// SAVE.OVR: a flag byte, seventeen signed 16-bit scores, ten bytes, then the name, ending in 0.
// What each score measures is in SAVE.OVR and the R*.OVR overlays, not yet decoded.

import { hexRows, fromHexRows, mergeYaml, slug, type Plain, type WorldFiles } from "@wwsff/bridge";
import { parse } from "yaml";
import { Dos33Volume, type DosEntry } from "./dos33.js";

export const SAVE_ADDRESS = 0x040c;
export const SAVE_LENGTH = 252;
/** The game writes $0101 into the DOS header of its one-sector saves; new saves copy it. */
export const SAVE_DECLARED_LENGTH = 0x0101;
const SCORES_AT = 1, SCORES = 17, BYTES_AT = 35, BYTES = 10, NAME_AT = 45, NAME_MAX = 32;

/** Game files: the FILE* text and the *.OVR overlays. Any other B file is a save. */
export const isGameFile = (name: string) => /^FILE/.test(name) || /\.OVR$/.test(name);

export interface Save {
	flag: number;
	scores: number[];
	bytes: number[];
	name: string;
	/** Bytes after the name that aren't zero, as hex; absent on every save seen. */
	rest?: string;
}

export function decodeSave(b: Uint8Array): Save {
	const v = new DataView(b.buffer, b.byteOffset, b.length);
	const end = b.indexOf(0, NAME_AT);
	const nameEnd = end < 0 ? b.length : end;
	const tail = b.subarray(nameEnd);
	const s: Save = {
		flag: b[0] ?? 0,
		scores: Array.from({ length: SCORES }, (_, i) => v.getInt16(SCORES_AT + 2 * i, true)),
		bytes: Array.from(b.subarray(BYTES_AT, BYTES_AT + BYTES)),
		name: String.fromCharCode(...b.subarray(NAME_AT, nameEnd)),
	};
	if (tail.some((x) => x)) s.rest = hexRows(tail, 32);
	return s;
}

/** The save over `base` (the file as it is on disk, or zeros): only what differs is written. */
export function encodeSave(s: Partial<Save>, base: Uint8Array = new Uint8Array(SAVE_LENGTH)): Uint8Array {
	const b = base.slice();
	const v = new DataView(b.buffer);
	const old = decodeSave(base);
	if (s.flag !== undefined) b[0] = s.flag;
	s.scores?.forEach((x, i) => {
		if (i < SCORES && x !== old.scores[i]) v.setInt16(SCORES_AT + 2 * i, x, true);
	});
	s.bytes?.forEach((x, i) => {
		if (i < BYTES && x !== old.bytes[i]) b[BYTES_AT + i] = x;
	});
	if (s.rest !== undefined) b.set(fromHexRows(s.rest).subarray(0, b.length - NAME_AT - (s.name ?? old.name).length), NAME_AT + (s.name ?? old.name).length);
	if (s.name !== undefined && s.name !== old.name) {
		if (s.name.length > NAME_MAX) throw new Error(`name "${s.name}" is longer than ${NAME_MAX} characters`);
		b.fill(0, NAME_AT, NAME_AT + Math.max(old.name.length, s.name.length) + 1);
		b.set(Uint8Array.from(s.name, (c) => c.charCodeAt(0)), NAME_AT);
	}
	return b;
}

export interface ExportOptions {
	source?: string;
	sha1?: string;
	existing?: WorldFiles;
}

/** A catalog entry whose track/sector list is off the disk: the save stopped after the name. */
const unfinished = (vol: Dos33Volume, e: DosEntry) => e.tsl[0] >= 35 || vol.sectorsOf(e).length === 0;

/** The disk as DISK.yml and each save as characters/<name>/CHARACTER.yml. */
export function exportDisk(vol: Dos33Volume, o: ExportOptions = {}): WorldFiles {
	const files: WorldFiles = new Map();
	const old = o.existing;
	const saves = vol.entries.filter((e) => !e.deleted && e.type === "B" && !isGameFile(e.name));
	const pathOf = new Map<string, string>();
	for (const [p, text] of old ?? []) {
		const m = /^characters\/[^/]+\/CHARACTER\.yml$/.exec(p);
		const file = m && ((parse(text) ?? {}) as { mind_mirror?: { file?: string } }).mind_mirror?.file;
		if (file) pathOf.set(file, p);
	}
	for (const e of saves) if (!pathOf.has(e.name)) pathOf.set(e.name, `characters/${slug(e.name, "save")}/CHARACTER.yml`);
	files.set(
		"DISK.yml",
		mergeYaml(
			old?.get("DISK.yml"),
			{
				game: "Timothy Leary's Mind Mirror",
				platform: "Apple II",
				source: o.source ?? null,
				sha1: o.sha1 ?? null,
				volume: vol.volume,
				saves: saves.map((e) => ({ file: e.name, character: pathOf.get(e.name)!, ...(unfinished(vol, e) ? { unfinished: true } : {}) })),
				files: vol.entries.map((e) => ({ name: e.name, type: e.type, sectors: e.sectors, ...(e.deleted ? { deleted: true } : {}) })),
			},
			{ header: " A Mind Mirror disk. Saves are characters; import writes them back. This file is a description.", identity: ["file", "name"], owned: () => true },
		),
	);
	for (const e of saves) {
		const path = pathOf.get(e.name)!;
		const broken = unfinished(vol, e);
		const mm: { [key: string]: Plain } = { file: e.name };
		let name = e.name;
		if (broken) mm.saved = false;
		else {
			const { address, bytes } = vol.binary(e);
			const s = decodeSave(bytes);
			name = s.name || e.name;
			Object.assign(mm, { address, flag: s.flag, scores: s.scores, bytes: s.bytes, ...(s.rest ? { rest: s.rest } : {}) });
		}
		files.set(
			path,
			mergeYaml(
				old?.get(path),
				{ name, home: "DISK.yml", location: `DISK.yml#saves/${e.name}`, mind_mirror: mm },
				{
					header: ` ${name}, a life saved by Mind Mirror. The scores are the game's; what each measures is not decoded yet.`,
					owned: (p, k) => p.length === 1 && p[0] === "mind_mirror" && ["rest", "saved"].includes(k),
					flow: (p, v) => Array.isArray(v) && p.length === 2,
					note: (p) => {
						if (p.length === 1 && p[0] === "name") return "the name inside the save, from offset 45";
						if (p.length !== 2 || p[0] !== "mind_mirror") return undefined;
						return {
							file: "the DOS file the game lists and loads",
							address: "$040C, where SAVE.OVR loads it",
							flag: "offset 0",
							scores: "17 signed 16-bit words from offset 1",
							bytes: "offsets 35-44",
							saved: `the catalog entry points at track ${e.tsl[0]}, off the disk: the save stopped after the name`,
						}[p[1] as string];
					},
				},
			),
		);
	}
	return files;
}

/** Writes each character's save into the volume, over its file or as a new one. */
export function importDisk(files: WorldFiles, vol: Dos33Volume): void {
	for (const [path, text] of files) {
		if (!/^characters\/[^/]+\/CHARACTER\.yml$/.test(path)) continue;
		let c: { [key: string]: Plain };
		try {
			c = (parse(text) ?? {}) as { [key: string]: Plain };
		} catch (e) {
			throw new Error(`${path}: ${(e as Error).message}`);
		}
		const mm = c.mind_mirror as { [key: string]: Plain } | undefined;
		if (!mm || mm.saved === false) continue;
		const file = typeof mm.file === "string" ? mm.file : typeof c.name === "string" ? c.name : undefined;
		if (!file) throw new Error(`${path}: mind_mirror.file or name needed`);
		const e = vol.find(file);
		const current = e && !unfinished(vol, e) ? vol.binary(e) : undefined;
		const base = new Uint8Array(SAVE_LENGTH);
		if (current) base.set(current.bytes.subarray(0, SAVE_LENGTH));
		const s: Partial<Save> = {};
		if (typeof mm.flag === "number") s.flag = mm.flag;
		if (Array.isArray(mm.scores)) s.scores = mm.scores as number[];
		if (Array.isArray(mm.bytes)) s.bytes = mm.bytes as number[];
		if (typeof c.name === "string") s.name = c.name;
		if (typeof mm.rest === "string") s.rest = mm.rest;
		const bytes = encodeSave(s, base);
		vol.writeBinary(file, typeof mm.address === "number" ? mm.address : current?.address ?? SAVE_ADDRESS, bytes, current?.length ?? SAVE_DECLARED_LENGTH);
	}
}
