// Wizardry's SCENARIO.DATA and SCENARIO.MESGS, read and written through the record types
// in wizardry-schema.ts. A record's place on disk is the scenario's own table of contents:
// section z starts at block BLOFF[z], two blocks hold RECPER2B[z] records, RECPERDK[z]
// records exist (UTILITIE's GETREC).

import { decode, encode, sizeOf, type PType, type PValue } from "@wwsff/bridge";
import { PascalVolume } from "./pascal.js";
import { MESSAGE_LINE, SECTIONS, SPELL_BY_HASH, TCHAR, TMAZE, TOBJREC, TSCNTOC } from "./wizardry-schema.js";

export type Section = (typeof SECTIONS)[number];
export type Rec = { [key: string]: PValue };

export interface Toc {
	game: string;
	per_2_blocks: Record<Section, number>;
	on_disk: Record<Section, number>;
	block_offset: Record<Section, number>;
	spell_hash: number[];
	[key: string]: PValue;
}

/** Message lines are 42 bytes, 12 to a block (ROTATE's MSGBLK and MSGX). */
export const LINES_PER_BLOCK = 12;

export class Scenario {
	readonly volume: PascalVolume;
	readonly data: Uint8Array;
	readonly mesgs: Uint8Array;
	readonly toc: Toc;

	/** Reads through `volume`; writes go into the volume's bytes. */
	constructor(volume: PascalVolume) {
		this.volume = volume;
		this.data = volume.raw("SCENARIO.DATA");
		this.mesgs = volume.find("SCENARIO.MESGS") ? volume.raw("SCENARIO.MESGS") : new Uint8Array(0);
		this.toc = decode(TSCNTOC, this.data, 0) as Toc;
	}

	get game(): string {
		return this.toc.game;
	}

	count(section: Section): number {
		return this.toc.on_disk[section] ?? 0;
	}

	offset(section: Section, index: number, size: number): number {
		const per = this.toc.per_2_blocks[section] || 1;
		return (this.toc.block_offset[section] ?? 0) * 512 + Math.floor(index / per) * 1024 + (index % per) * size;
	}

	bytes(section: Section, index: number, size: number): Uint8Array {
		const o = this.offset(section, index, size);
		return this.data.subarray(o, o + size);
	}

	read(section: Section, index: number, type: PType): PValue {
		return decode(type, this.data, this.offset(section, index, sizeOf(type)));
	}

	write(section: Section, index: number, type: PType, value: PValue, path: string): void {
		if (index < 0 || index >= this.count(section)) throw new Error(`${path}: ${section} has ${this.count(section)} records, not ${index + 1}`);
		encode(type, value, this.data, this.offset(section, index, sizeOf(type)), path);
	}

	/** Every section's records, in index order. */
	all(section: Section, type: PType): Rec[] {
		return Array.from({ length: this.count(section) }, (_, i) => this.read(section, i, type) as Rec);
	}

	itemName(index: number): string {
		return index >= 0 && index < this.count("OBJECT") ? String((this.read("OBJECT", index, TOBJREC) as Rec).name) : `#${index}`;
	}

	/** The spell SPELLSKN bit `index` stands for, or undefined. Bits 1-50 follow SPELLHSH. */
	spellName(index: number): string | undefined {
		if (index < 1 || index > 50) return undefined;
		return SPELL_BY_HASH.get(this.toc.spell_hash[index] ?? -1);
	}

	/** Roster slots that hold a character: a name of 1-15 characters, and not UNSET, which
	 * Wizardry II and III write into empty slots. */
	characters(): { slot: number; rec: Rec }[] {
		const out: { slot: number; rec: Rec }[] = [];
		for (let slot = 0; slot < this.count("CHAR"); slot++) {
			const len = this.bytes("CHAR", slot, sizeOf(TCHAR))[0] ?? 0;
			if (len === 0 || len > 15) continue;
			const rec = this.read("CHAR", slot, TCHAR) as Rec;
			if (rec.name !== "UNSET") out.push({ slot, rec });
		}
		return out;
	}

	/** Level 1-10, decoded; grids are indexed [x][y], x east and y north, as the game does. */
	maze(level: number): Rec {
		return this.read("MAZE", level - 1, TMAZE) as Rec;
	}

	messageLines(): number {
		return Math.floor(this.mesgs.length / 512) * LINES_PER_BLOCK;
	}

	messageOffset(line: number): number {
		return Math.floor(line / LINES_PER_BLOCK) * 512 + (line % LINES_PER_BLOCK) * sizeOf(MESSAGE_LINE);
	}

	messageLine(line: number): { text: string; end: boolean } {
		return decode(MESSAGE_LINE, this.mesgs, this.messageOffset(line)) as { text: string; end: boolean };
	}
}

const GLYPH: Record<string, string> = {
	NORMAL: " ", STAIRS: "S", PIT: "P", CHUTE: "C", SPINNER: "@", DARK: "#", TRANSFER: "T",
	OUCHY: "O", BUTTONZ: "B", ROCKWATE: "R", FIZZLE: "F", SCNMSG: "M", ENCOUNTE: "E",
};
const HWALL: Record<string, string> = { OPEN: "   ", WALL: "---", DOOR: "-D-", HIDEDOOR: "-h-" };
const VWALL: Record<string, string> = { OPEN: " ", WALL: "|", DOOR: "D", HIDEDOOR: "h" };
const WALL_OF: Record<string, string> = { " ": "OPEN", "-": "WALL", "|": "WALL", D: "DOOR", h: "HIDEDOOR" };

export const MAZE_KEY = [
	"North is up; x runs 0-19 east, y 0-19 north. Each square is three characters:",
	"a * where fights happen, the hex digit of its special (blank is special 0),",
	"and that special's letter: S stairs, P pit, C chute, @ spinner, # dark, T transfer,",
	"O ouchy, B buttons, R rock/water, F fizzle, M message, E encounter.",
	"Walls: - and |, doors D, hidden doors h. A wall is drawn once, for both squares;",
	"one_way lists the sides where the two squares disagree. The letters follow the",
	"digits and are not read back. The edges wrap around.",
].join("\n");

type Grid = string[][];
type Cells = number[][];

export interface MazeGrids {
	w: Grid; s: Grid; e: Grid; n: Grid;
	fights: Cells;
	square: Cells;
}

export interface OneWay {
	x: number;
	y: number;
	side: "S" | "W";
	wall: string;
}

const cell = <T>(g: T[][], x: number, y: number, empty: T): T => g[x]?.[y] ?? empty;

/** The level as ASCII with each wall drawn once, plus the sides that disagree with the drawing. */
export function mazeArt(m: MazeGrids, kinds: readonly string[]): { map: string; oneWay: OneWay[] } {
	const lines: string[] = [];
	for (let y = 19; y >= 0; y--) {
		lines.push("+" + Array.from({ length: 20 }, (_, x) => HWALL[cell(m.n, x, y, "OPEN")]).join("+") + "+");
		let row = VWALL[cell(m.w, 0, y, "OPEN")] ?? "?";
		for (let x = 0; x < 20; x++) {
			const sq = cell(m.square, x, y, 0);
			row += (cell(m.fights, x, y, 0) ? "*" : " ") + (sq ? sq.toString(16) : " ") + (GLYPH[kinds[sq] ?? ""] ?? "?");
			row += VWALL[cell(m.e, x, y, "OPEN")] ?? "?";
		}
		lines.push(`${row} ${String(y).padStart(2)}`);
	}
	lines.push("+" + Array.from({ length: 20 }, (_, x) => HWALL[cell(m.s, x, 0, "OPEN")]).join("+") + "+");
	lines.push(" " + Array.from({ length: 20 }, (_, x) => String(x).padStart(2).padEnd(4)).join("").trimEnd());
	const oneWay: OneWay[] = [];
	for (let x = 0; x < 20; x++)
		for (let y = 0; y < 20; y++) {
			if (y > 0 && cell(m.s, x, y, "OPEN") !== cell(m.n, x, y - 1, "OPEN")) oneWay.push({ x, y, side: "S", wall: cell(m.s, x, y, "OPEN") });
			if (x > 0 && cell(m.w, x, y, "OPEN") !== cell(m.e, x - 1, y, "OPEN")) oneWay.push({ x, y, side: "W", wall: cell(m.w, x, y, "OPEN") });
		}
	return { map: lines.join("\n") + "\n", oneWay };
}

/** Reads mazeArt's drawing back. Errors name the line and column. */
export function parseMazeArt(map: string, oneWay: readonly OneWay[] = []): MazeGrids {
	const lines = map.split("\n");
	const grid = <T>(v: T) => Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => v));
	const m: MazeGrids = { w: grid("OPEN"), s: grid("OPEN"), e: grid("OPEN"), n: grid("OPEN"), fights: grid(0), square: grid(0) };
	const wall = (ch: string | undefined, line: number, col: number) => {
		const w = WALL_OF[ch ?? " "];
		if (!w) throw new Error(`map line ${line + 1}, column ${col + 1}: ${JSON.stringify(ch)} is not a wall`);
		return w;
	};
	const hline = (line: number) => {
		const text = lines[line] ?? "";
		return Array.from({ length: 20 }, (_, x) => wall(text[2 + 4 * x], line, 2 + 4 * x));
	};
	for (let y = 19; y >= 0; y--) {
		const top = 2 * (19 - y), rowLine = top + 1, text = lines[rowLine] ?? "";
		hline(top).forEach((w, x) => (m.n[x]![y] = w));
		m.w[0]![y] = wall(text[0], rowLine, 0);
		for (let x = 0; x < 20; x++) {
			const c = 1 + 4 * x;
			m.fights[x]![y] = text[c] === "*" ? 1 : 0;
			const digit = text[c + 1] ?? " ";
			if (digit !== " " && !/^[0-9a-f]$/i.test(digit)) throw new Error(`map line ${rowLine + 1}, column ${c + 2}: ${JSON.stringify(digit)} is not a hex digit`);
			m.square[x]![y] = digit === " " ? 0 : parseInt(digit, 16);
			m.e[x]![y] = wall(text[c + 3], rowLine, c + 3);
		}
	}
	hline(40).forEach((w, x) => (m.s[x]![0] = w));
	for (let x = 0; x < 20; x++)
		for (let y = 0; y < 20; y++) {
			if (y > 0) m.s[x]![y] = m.n[x]![y - 1]!;
			if (x > 0) m.w[x]![y] = m.e[x - 1]![y]!;
		}
	for (const o of oneWay) (o.side === "S" ? m.s : m.w)[o.x]![o.y] = o.wall;
	return m;
}
