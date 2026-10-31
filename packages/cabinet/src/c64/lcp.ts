// Little Computer People (Activision, 1985), Commodore 64: the house on the disk and the
// person living in it, as a character directory, and back.
// Sector 18.17 holds the house number, eight characters stored backwards and followed by
// "NVTCA" (ACTVN backwards). Sector 1.4 holds the research data, 256 bytes the game rewrites
// as the person lives: researcher's name at $B2, the person's name at $CA, a second copy of
// the researcher's name at $E6 on a played disk. The other bytes are the person's state, not
// yet decoded; they travel as hex rows.
// The fan tools on the "ASS PRESENTS:" disk read and write the same two sectors (LCP HOTEL,
// LCP CREATOR, LCP EVICTOR), which is where these offsets come from.

import { fromHexRows, hexRows, mergeYaml, slug, type Plain, type WorldFiles } from "@wwsff/bridge";
import { parse } from "yaml";
import { listBasic } from "./basic.js";
import { D64 } from "./d64.js";

export const HOUSE_NUMBER_AT = [18, 17] as const;
export const RECORD_AT = [1, 4] as const;

/** The research data every copy ships with and LCP EVICTOR writes back: an empty house
 * waiting for "Zeke", researcher "Billy Bob Binkle". The bytes from $E6 are leftover code. */
export const MOVE_IN = fromHexRows(`
ff030317030204036b4b0b0000016d000000000106010202020200000200002d
22020c11000f2400142800070006000f007a05000000000c0c00000c0d090101
07210410150b04000000ffff00000000080400000801010000a4a05a004640b5
8010200000e5e5a5e510100b09fe0002f6000000000036040000838302028300
0604050006040501010203040103020000fefdfbf7efdfbf7f01020408102040
8000422c160000000000000000000108318542696c6c7920426f622042696e6b
6c6500000000000000005a656b650000000000000000000000008f0000011200
0004590907002020000078a2ff9aa5028d9c59a205bd8d479dfaffca10f7a9e2`);

/** Bit masks at $91 that every research record has; how a house is told from a cracked disk without one. */
const MASKS = fromHexRows("fefdfbf7efdfbf7f0102040810204080");
const MASKS_AT = 0x91;

interface TextField {
	at: number;
	length: number;
	pad: number;
}

export const FIELDS = {
	researcher: { at: 0xb2, length: 21, pad: 0x20 },
	name: { at: 0xca, length: 13, pad: 0 },
	logged_on: { at: 0xe6, length: 21, pad: 0x20 },
} as const satisfies Record<string, TextField>;

const printable = (b: Uint8Array) => b.every((x) => x === 0 || (x >= 0x20 && x < 0x7f));

export function readText(record: Uint8Array, f: TextField): string | undefined {
	const b = record.subarray(f.at, f.at + f.length);
	const end = b.indexOf(0);
	const text = b.subarray(0, end < 0 ? b.length : end);
	if (!printable(text)) return undefined;
	return String.fromCharCode(...text).trimEnd();
}

/** Writes `text` unless the record already reads as `text`, so untouched padding stays byte for byte. */
export function writeText(record: Uint8Array, f: TextField, text: string, what: string): void {
	if (readText(record, f) === text) return;
	if (text.length > f.length) throw new Error(`${what}: "${text}" is longer than ${f.length} characters`);
	if (!printable(Uint8Array.from(text, (c) => c.charCodeAt(0)))) throw new Error(`${what}: "${text}" has characters the game can't show`);
	for (let i = 0; i < f.length; i++) record[f.at + i] = i < text.length ? text.charCodeAt(i) : f.pad;
}

export class House {
	readonly disk: D64;

	constructor(disk: D64) {
		this.disk = disk;
	}

	get record(): Uint8Array {
		return this.disk.sector(...RECORD_AT);
	}

	/** Whether sector 1.4 holds research data; one-file cracks keep the house inside their file. */
	get hasRecord(): boolean {
		return MASKS.every((x, i) => this.record[MASKS_AT + i] === x);
	}

	get houseNumber(): string {
		return String.fromCharCode(...this.disk.sector(...HOUSE_NUMBER_AT).subarray(0, 8)).split("").reverse().join("");
	}

	set houseNumber(n: string) {
		if (n.length !== 8) throw new Error(`house number "${n}" must be 8 characters`);
		this.disk.sector(...HOUSE_NUMBER_AT).set(Uint8Array.from(n.split("").reverse(), (c) => c.charCodeAt(0)));
	}

	get moveInTemplate(): boolean {
		return this.record.every((x, i) => x === MOVE_IN[i]);
	}
}

export interface ExportOptions {
	source?: string;
	sha1?: string;
	existing?: WorldFiles;
}

const isBasic = (prg: Uint8Array) => prg.length > 6 && prg[0] === 0x01 && prg[1] === 0x08;

/** The disk as HOUSE.yml, the resident as characters/<name>/, BASIC programs as programs/*.bas listings. */
export function exportHouse(house: House, o: ExportOptions = {}): WorldFiles {
	const files: WorldFiles = new Map();
	const old = o.existing;
	const d = house.disk;
	const programs: { [key: string]: Plain }[] = [];
	const entries = d.entries.map((e) => {
		const row: { [key: string]: Plain } = { name: e.name, type: e.type, blocks: e.blocks };
		const prg = e.type === "PRG" ? d.read(e) : undefined;
		if (prg && isBasic(prg)) {
			const path = `programs/${slug(e.name)}.bas`;
			files.set(path, listBasic(prg));
			row.listing = path;
			programs.push({ name: e.name, listing: path });
		}
		return row;
	});
	const residentPath = existingCharacter(old) ?? (house.hasRecord ? `characters/${slug(readText(house.record, FIELDS.name) ?? "", "resident")}/CHARACTER.yml` : undefined);
	files.set(
		"HOUSE.yml",
		mergeYaml(
			old?.get("HOUSE.yml"),
			{
				game: "Little Computer People",
				platform: "Commodore 64",
				source: o.source ?? null,
				sha1: o.sha1 ?? null,
				disk_name: d.diskName,
				disk_id: d.diskId,
				resident: residentPath ?? null,
				files: entries,
			},
			{
				header: " A Little Computer People disk. Import writes the resident back; this file is a description.",
				note: (p) =>
					p.length === 1 && p[0] === "resident"
						? residentPath
							? "the person living here"
							: "no research data in sector 1.4: this crack keeps the house inside its one file"
						: undefined,
				owned: () => true,
			},
		),
	);
	if (!house.hasRecord || !residentPath) return files;
	const dir = residentPath.replace(/\/CHARACTER\.yml$/, "");
	const r = house.record;
	const researcher = readText(r, FIELDS.researcher);
	const loggedOn = readText(r, FIELDS.logged_on);
	const lcp: { [key: string]: Plain } = {
		house_number: house.houseNumber,
		researcher: researcher ?? null,
		...(loggedOn !== undefined && !house.moveInTemplate ? { logged_on: loggedOn } : {}),
		move_in_template: house.moveInTemplate,
		record: "LCP-RECORD.yml",
	};
	const view: { [key: string]: Plain } = {
		name: readText(r, FIELDS.name) ?? "",
		home: "HOUSE.yml",
		location: "HOUSE.yml",
		relationships: researcher ? [{ name: researcher, role: "researcher" }] : [],
		lcp,
	};
	files.set(
		`${dir}/CHARACTER.yml`,
		mergeYaml(old?.get(`${dir}/CHARACTER.yml`), view, {
			header: ` ${view.name}, the Little Computer Person in ${d.diskName.trim() || "this house"}.\n name, lcp.researcher and lcp.logged_on are written over LCP-RECORD.yml on import.`,
			owned: (p, k) => p.length === 1 && p[0] === "lcp" && k === "logged_on",
			identity: ["name"],
			note: (p) => {
				const k = p[p.length - 1];
				if (p.length === 1 && k === "name") return "13 characters at $CA of sector 1.4";
				if (p[0] !== "lcp" || p.length !== 2) return undefined;
				return {
					house_number: "sector 18.17, stored backwards. LCP CREATOR and CREATE NEW LCP write a new one to get a new person",
					researcher: "21 characters at $B2. In the game: ask the person to log on to his computer to change it",
					logged_on: "a second copy at $E6; on a disk nobody has played, these bytes are leftover code",
					move_in_template: "true when the research data is what every disk ships with: nobody has moved in. Import ignores it",
					record: "all 256 bytes of sector 1.4",
				}[k as string];
			},
		}),
	);
	files.set(
		`${dir}/LCP-RECORD.yml`,
		mergeYaml(
			old?.get(`${dir}/LCP-RECORD.yml`),
			{ sector: "1.4", hex: hexRows(r, 32) },
			{
				header:
					" The research data, sector 1.4, 32 bytes a row.\n" +
					" Row 5 ($A0): researcher's name from $B2. Row 6 ($C0): person's name from $CA.\n" +
					" Row 7 ($E0): researcher's name again from $E6. Row 4 ($80): bit masks at $91.\n" +
					" The rest is the person's state, not yet decoded. CHARACTER.yml's names win over these bytes.",
			},
		),
	);
	return files;
}

function existingCharacter(files: WorldFiles | undefined): string | undefined {
	if (!files) return undefined;
	return [...files.keys()].find((p) => /^characters\/[^/]+\/CHARACTER\.yml$/.test(p));
}

const parseYaml = (files: WorldFiles, path: string): { [key: string]: Plain } | undefined => {
	const text = files.get(path);
	if (text === undefined) return undefined;
	try {
		return (parse(text) ?? {}) as { [key: string]: Plain };
	} catch (e) {
		throw new Error(`${path}: ${(e as Error).message}`);
	}
};

/** Writes the resident back into the house: record rows first, then the named fields over them. */
export function importHouse(files: WorldFiles, house: House): void {
	const path = existingCharacter(files);
	if (!path) return;
	const dir = path.replace(/\/CHARACTER\.yml$/, "");
	const c = parseYaml(files, path) ?? {};
	const lcp = (c.lcp ?? {}) as { [key: string]: Plain };
	const rec = parseYaml(files, `${dir}/${typeof lcp.record === "string" ? lcp.record : "LCP-RECORD.yml"}`);
	const r = house.record;
	if (rec?.hex !== undefined) {
		const bytes = fromHexRows(String(rec.hex));
		if (bytes.length !== 256) throw new Error(`${dir}/LCP-RECORD.yml: hex is ${bytes.length} bytes, not 256`);
		r.set(bytes);
	}
	if (typeof c.name === "string") writeText(r, FIELDS.name, c.name, `${path} name`);
	if (typeof lcp.researcher === "string") writeText(r, FIELDS.researcher, lcp.researcher, `${path} lcp.researcher`);
	if (typeof lcp.logged_on === "string") writeText(r, FIELDS.logged_on, lcp.logged_on, `${path} lcp.logged_on`);
	if (typeof lcp.house_number === "string" && lcp.house_number !== house.houseNumber) house.houseNumber = lcp.house_number;
}
