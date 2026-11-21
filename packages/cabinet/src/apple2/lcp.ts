// Little Computer People (Activision, 1985), Apple ][: the person on a House side as a
// character directory, and back. The Commodore 64 disks are src/c64/lcp.ts; this is the same
// shape, so a person reads the same off either machine.
//
// The House side is a DOS 3.3 disk. Its record is track 14 sector 15, outside every file:
//   $2D  8   the person's name, padded with zeros
//   $35  3   the date he moved in, MM DD YY, each byte two decimal digits (BCD)
//   $3C  1   sessions so far, BCD; the guestbook shows one more on the next visit
//   $3E  3   the date of the last visit, BCD
//   $41  21  the researcher's name, padded with spaces, capitalized by the game
// The other bytes are his state and are not decoded; they travel as hex rows.
//
// The Guestbook side names him: sector 17.1 holds the house number, eight characters stored
// backwards then NVTCA, and number mod 256 picks one of 256 names on its track 8 (each digit is
// its character less 48). The name here is the House side's copy.

import { fromHexRows, hexRows, mergeYaml, slug, type Plain, type WorldFiles } from "@wwsff/bridge";
import { parse } from "yaml";
import { readText, writeText } from "../c64/lcp.js";

export const DSK_BYTES = 143360;
export const RECORD_AT = [14, 15] as const;

export const FIELDS = {
	name: { at: 0x2d, length: 8, pad: 0 },
	researcher: { at: 0x41, length: 21, pad: 0x20 },
} as const;

const MOVED_IN = 0x35;
const SESSIONS = 0x3c;
const LAST_VISIT = 0x3e;
/** Three bytes every House side here has, played or not: how a House side is told from another disk. */
const MARK = [0x11, 0x12, 0x58];
const MARK_AT = 0x39;

const offset = (track: number, sector: number) => (track * 16 + sector) * 256;

/** Whether an image is a Guestbook side: its house number ends in NVTCA. */
export function isGuestbook(image: Uint8Array): boolean {
	const at = offset(17, 1) + 8;
	return image.length === DSK_BYTES && String.fromCharCode(...image.subarray(at, at + 5)) === "NVTCA";
}

/**
 * The record of a House side image, a view into it; undefined for any other disk. The Guestbook
 * side has a copy in the same sector that play never rewrites, so it is not a House side.
 */
export function houseRecord(image: Uint8Array): Uint8Array | undefined {
	if (image.length !== DSK_BYTES || isGuestbook(image)) return undefined;
	const at = offset(...RECORD_AT);
	const r = image.subarray(at, at + 256);
	return MARK.every((x, i) => r[MARK_AT + i] === x) ? r : undefined;
}

const bcd = (b: number) => (b >> 4) * 10 + (b & 15);
const toBcd = (n: number) => (Math.floor(n / 10) << 4) | n % 10;
const two = (n: number) => String(n).padStart(2, "0");

function readDate(r: Uint8Array, at: number): string | null {
	const [m, d, y] = [r[at]!, r[at + 1]!, r[at + 2]!];
	if (!m) return null;
	return `${two(bcd(m))}/${two(bcd(d))}/${two(bcd(y))}`;
}

function writeDate(r: Uint8Array, at: number, text: string, what: string): void {
	const m = /^(\d\d)\/(\d\d)\/(\d\d)$/.exec(text);
	if (!m) throw new Error(`${what}: "${text}" is not MM/DD/YY`);
	r.set([toBcd(Number(m[1])), toBcd(Number(m[2])), toBcd(Number(m[3]))], at);
}

const NOTES: Record<string, string> = {
	researcher: "21 characters at $41 of track 14 sector 15; the guestbook asks for it on the first visit",
	moved_in: "MM/DD/YY at $35, the date typed on the first visit",
	last_visit: "MM/DD/YY at $3E, the date typed on the latest visit",
	sessions: "visits so far, at $3C; the guestbook shows one more next time",
	record: "all 256 bytes of track 14 sector 15",
};

/** The House side as HOUSE.yml, and the person as characters/<name>/CHARACTER.yml and LCP-RECORD.yml. */
export function exportHouseSide(image: Uint8Array, existing?: WorldFiles): WorldFiles {
	const files: WorldFiles = new Map();
	const r = houseRecord(image);
	if (!r) throw new Error("not a Little Computer People House side: no record in track 14 sector 15");
	const name = readText(r, FIELDS.name) ?? "";
	const dir = existingCharacter(existing)?.replace(/\/CHARACTER\.yml$/, "") ?? `characters/${slug(name, "resident")}`;
	files.set(
		"HOUSE.yml",
		mergeYaml(existing?.get("HOUSE.yml"), { game: "Little Computer People", platform: "Apple II", side: "House", resident: `${dir}/CHARACTER.yml` }, {
			header: " A Little Computer People House side. Import writes the resident back; this file is a description.",
			owned: () => true,
		}),
	);
	const researcher = readText(r, FIELDS.researcher);
	const lcp: { [key: string]: Plain } = {
		researcher: researcher ?? null,
		moved_in: readDate(r, MOVED_IN),
		last_visit: readDate(r, LAST_VISIT),
		sessions: bcd(r[SESSIONS]!),
		record: "LCP-RECORD.yml",
	};
	const view: { [key: string]: Plain } = {
		name,
		home: "HOUSE.yml",
		location: "HOUSE.yml",
		relationships: researcher ? [{ name: researcher, role: "researcher" }] : [],
		lcp,
	};
	files.set(
		`${dir}/CHARACTER.yml`,
		mergeYaml(existing?.get(`${dir}/CHARACTER.yml`), view, {
			header: ` ${name || "Nobody"}, the Little Computer Person on this House side.\n name and the lcp fields are written over LCP-RECORD.yml on import.`,
			identity: ["name"],
			note: (p) => {
				const k = p[p.length - 1];
				if (p.length === 1 && k === "name") return "8 characters at $2D; the game picks it from the Guestbook side's house number";
				return p[0] === "lcp" && p.length === 2 ? NOTES[k as string] : undefined;
			},
		}),
	);
	files.set(
		`${dir}/LCP-RECORD.yml`,
		mergeYaml(
			existing?.get(`${dir}/LCP-RECORD.yml`),
			{ sector: "14.15", hex: hexRows(r, 32) },
			{
				header:
					" The record, track 14 sector 15 of the House side, 32 bytes a row.\n" +
					" Row 2 ($20): his name from $2D, dates at $35 and $3E, sessions at $3C. Row 3 ($40): researcher from $41.\n" +
					" The rest is his state, not yet decoded. CHARACTER.yml's fields win over these bytes.",
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

/** A copy of the House side with the resident written back: record rows first, then the fields over them. */
export function importHouseSide(files: WorldFiles, image: Uint8Array): Uint8Array {
	const out = image.slice();
	const r = houseRecord(out);
	if (!r) throw new Error("not a Little Computer People House side: no record in track 14 sector 15");
	const path = existingCharacter(files);
	if (!path) return out;
	const dir = path.replace(/\/CHARACTER\.yml$/, "");
	const c = parseYaml(files, path) ?? {};
	const lcp = (c.lcp ?? {}) as { [key: string]: Plain };
	const rec = parseYaml(files, `${dir}/${typeof lcp.record === "string" ? lcp.record : "LCP-RECORD.yml"}`);
	if (rec?.hex !== undefined) {
		const bytes = fromHexRows(String(rec.hex));
		if (bytes.length !== 256) throw new Error(`${dir}/LCP-RECORD.yml: hex is ${bytes.length} bytes, not 256`);
		r.set(bytes);
	}
	if (typeof c.name === "string") writeText(r, FIELDS.name, c.name, `${path} name`);
	if (typeof lcp.researcher === "string") writeText(r, FIELDS.researcher, lcp.researcher, `${path} lcp.researcher`);
	if (typeof lcp.moved_in === "string" && lcp.moved_in !== readDate(r, MOVED_IN)) writeDate(r, MOVED_IN, lcp.moved_in, `${path} lcp.moved_in`);
	if (typeof lcp.last_visit === "string" && lcp.last_visit !== readDate(r, LAST_VISIT)) writeDate(r, LAST_VISIT, lcp.last_visit, `${path} lcp.last_visit`);
	if (typeof lcp.sessions === "number") {
		if (!Number.isInteger(lcp.sessions) || lcp.sessions < 0 || lcp.sessions > 99) throw new Error(`${path} lcp.sessions: ${lcp.sessions} is not 0 to 99`);
		if (bcd(r[SESSIONS]!) !== lcp.sessions) r[SESSIONS] = toBcd(lcp.sessions);
	}
	return out;
}
