// A Wizardry scenario disk as a directory of YAML Jazz files, and back.
//
//   SCENARIO.yml     table of contents, name tables, spells, experience per class
//   MAZE.yml         castle, level-1 … level-10: map art, one-way walls, specials, encounters
//   ITEMS.yml        MONSTERS.yml  REWARDS.yml  by index, as the game numbers them
//   MESSAGES.yml     SCENARIO.MESGS, one entry per message, by its first line
//   PICTURES.yml     the 20 monster pictures, as hex until their format is read
//   characters/<name>/CHARACTER.yml   one per roster slot, moollm's character layout
//   PARTIES.yml      who is lost where; derived, import ignores it
//
// Import writes the files over a base disk's bytes, so anything the files leave out (an
// empty roster slot, padding, string tails) keeps the base's value, and export followed by
// import onto the same disk gives the same bytes. Export into files that already exist
// merges, so comments and keys people added stay.

import {
	encode, fromHexRows, hexRows, locationRef, mergeYaml, parseLocation, sizeOf, slug,
	type JazzOptions, type Path, type Plain, type PType, type PValue, type WorldFiles,
} from "@wwsff/bridge";
import { parse } from "yaml";
import { LINES_PER_BLOCK, MAZE_KEY, mazeArt, parseMazeArt, Scenario, type MazeGrids, type OneWay, type Rec } from "./wizardry.js";
import { MESSAGE_LINE, PICTURE, SPELL_BY_HASH, TCHAR, TENEMY, TEXP, TMAZE, TOBJREC, TREWARD, TSCNTOC } from "./wizardry-schema.js";

export interface ExportOptions {
	/** Where the disk came from, written into SCENARIO.yml. */
	source?: string;
	sha1?: string;
	/** Files already in the world directory, to merge into. */
	existing?: WorldFiles;
}

const CASTLE = locationRef("MAZE.yml", "castle");
const FLOW_LIMIT = 100;

function leafy(v: Plain): boolean {
	const xs = Array.isArray(v) ? v : v && typeof v === "object" ? Object.values(v) : [];
	return xs.every((x) => x === null || typeof x !== "object") && JSON.stringify(v).length <= FLOW_LIMIT;
}

function fieldNotes(t: PType): Map<string, string> {
	const out = new Map<string, string>();
	if (t.k === "record") for (const x of t.fields) if (x.note) out.set(x.key, x.note);
	return out;
}

const lastKey = (p: Path) => (typeof p[p.length - 1] === "string" ? (p[p.length - 1] as string) : undefined);

function write(files: WorldFiles, existing: WorldFiles | undefined, path: string, value: Plain, o: JazzOptions): void {
	files.set(path, mergeYaml(existing?.get(path), value, { flow: (_p, v) => leafy(v), ...o }));
}

function describeSpecial(sc: Scenario, kind: string, aux: number[]): string | undefined {
	const [a0 = 0, a1 = 0, a2 = 0] = aux;
	switch (kind) {
		case "STAIRS":
		case "TRANSFER":
			return a0 === 0 ? `to the castle` : `to ${locationRef("MAZE.yml", `level-${a0}`, `${a2},${a1}`)}`;
		case "PIT":
		case "OUCHY":
		case "ROCKWATE":
			return `damage ${a0} + ${a2} rolls of d${a1}`;
		case "ENCOUNTE":
			return `monster ${a2} (${monsterName(sc, a2)}), ${a0} times left, range ${a1}`;
		case "BUTTONZ":
			return `buttons to levels ${a2}-${a1}`;
		case "SCNMSG": {
			const text = a1 >= 0 && a1 < sc.messageLines() ? sc.messageLine(a1).text.trim() : "";
			const said = `message ${a1}${text ? ` "${text}"` : ""}`;
			const item = (i: number) => `item ${i} (${sc.itemName(i)})`;
			const times = a0 < 0 ? "every time" : a0 === 0 ? "used up" : `${a0} more times`;
			const found = a0 <= -1000 ? Math.abs(a0 + 1000) : Math.abs(a0);
			switch (a2) {
				case 0: return said;
				case 1: return `${said}, ${times}`;
				case 2: return `${said}, gives ${item(Math.abs(a0))}`;
				case 3: return `${said}, a fountain (effect ${a0 === -1 ? "random" : a0})`;
				case 4: return `${said}, search: ${a0 > 0 ? `fight monster ${a0} (${monsterName(sc, a0)})` : a0 === 0 ? "used up" : `finds ${item(found)}`}`;
				case 5: return `only with ${item(a0)}`;
				case 6: return `alignment check ${a0}`;
				case 7: return `${said}, light ${a0}`;
				case 8: return `${said}, back to the shop, ${times}`;
				case 9: return `${said}, a lookout`;
				case 10: return `${said}, a riddle`;
				case 11: return `${said}, a fee`;
				default: return `${said}, action ${a2}`;
			}
		}
		default:
			return undefined;
	}
}

function monsterName(sc: Scenario, i: number): string {
	return i >= 0 && i < sc.count("ENEMY") ? String((sc.read("ENEMY", i, TENEMY) as Rec).name) : `#${i}`;
}

// Characters

function itemNames(sc: Scenario): Map<string, number[]> {
	const names = new Map<string, number[]>();
	sc.all("OBJECT", TOBJREC).forEach((r, i) => names.set(String(r.name), [...(names.get(String(r.name)) ?? []), i]));
	return names;
}

/** An item by name, or `NAME #index` when two items share the name. */
function itemRef(sc: Scenario, names: Map<string, number[]>, index: number): string {
	const name = sc.itemName(index);
	return (names.get(name)?.length ?? 0) > 1 ? `${name} #${index}` : name;
}

function characterView(sc: Scenario, names: Map<string, number[]>, slot: number, c: Rec): { [key: string]: Plain } {
	const lost = c.lostxyl as number[];
	const [w0 = 0, w1 = 0, w2 = 0, w3 = 0] = lost;
	const inMaze = w2 >= 1 && w2 <= sc.count("MAZE") && w0 >= 0 && w0 < 20 && w1 >= 0 && w1 < 20;
	const location = inMaze ? locationRef("MAZE.yml", `level-${w2}`, `${w0},${w1}`) : CASTLE;
	const awards = Array.from({ length: 16 }, (_, i) => i).filter((i) => (w3 >> i) & 1);
	const poss = c.possessions as { count: number; items: Rec[] };
	const inventory = poss.items.slice(0, Math.max(0, Math.min(poss.count, 8))).map((p) => ({
		item: itemRef(sc, names, Number(p.item)),
		equipped: Boolean(p.equipped),
		cursed: Boolean(p.cursed),
		identified: Boolean(p.identified),
	}));
	const spells = [...String(c.spells_known)].flatMap((bit, i) => (bit === "1" ? [sc.spellName(i) ?? i] : []));
	const { name, gold, possessions: _p, spells_known: _s, lostxyl: _l, ...rest } = c;
	const wizardry: { [key: string]: Plain } = { slot, ...(rest as { [key: string]: Plain }) };
	if (!inMaze && w0) wizardry.poison = w0;
	wizardry.awards = awards;
	const derived = inMaze ? [w0, w1, w2, w3] : [w0, 0, 0, w3];
	if (derived.some((w, i) => w !== lost[i])) wizardry.lostxyl = lost;
	return { name: name as string, home: CASTLE, location, gold: gold as Plain, inventory, spells, wizardry };
}

function itemIndex(sc: Scenario, names: Map<string, number[]>, item: Plain, where: string): number {
	if (typeof item === "number") return item;
	const s = String(item);
	const hash = /^(.*?) ?#(\d+)$/.exec(s);
	if (hash) {
		const i = Number(hash[2]);
		if (hash[1] && sc.itemName(i) !== hash[1]) throw new Error(`${where}: item ${i} is ${sc.itemName(i)}, not ${hash[1]}`);
		return i;
	}
	const found = names.get(s);
	if (!found) throw new Error(`${where}: no item named ${s}`);
	if (found.length > 1) throw new Error(`${where}: ${found.length} items are named ${s} (${found.join(", ")}); give the number`);
	return found[0]!;
}

function characterRecord(sc: Scenario, names: Map<string, number[]>, v: { [key: string]: Plain }, where: string): { slot: number; rec: { [key: string]: PValue } } {
	const w = (v.wizardry ?? {}) as { [key: string]: Plain };
	if (typeof w.slot !== "number") throw new Error(`${where}: wizardry.slot must be the roster slot number`);
	const { slot, poison, awards, lostxyl, ...rest } = w;
	const rec: { [key: string]: PValue } = { ...(rest as { [key: string]: PValue }) };
	if (v.name !== undefined) rec.name = String(v.name);
	if (v.gold !== undefined) rec.gold = v.gold as PValue;
	if (Array.isArray(v.inventory)) {
		if (v.inventory.length > 8) throw new Error(`${where}: a character carries at most 8 things`);
		rec.possessions = {
			count: v.inventory.length,
			items: v.inventory.map((p, i) => {
				const e = (p ?? {}) as { [key: string]: Plain };
				return { equipped: !!e.equipped, cursed: !!e.cursed, identified: !!e.identified, item: itemIndex(sc, names, e.item ?? null, `${where} inventory ${i + 1}`) };
			}),
		};
	}
	if (Array.isArray(v.spells)) {
		const bits = Array.from({ length: 64 }, () => "0");
		for (const s of v.spells) {
			let i = typeof s === "number" ? s : -1;
			if (typeof s === "string") for (let k = 1; k <= 50 && i < 0; k++) if (sc.spellName(k) === s) i = k;
			if (i < 0 || i >= 64) throw new Error(`${where}: no spell ${JSON.stringify(s)} in this scenario`);
			bits[i] = "1";
		}
		rec.spells_known = bits.join("");
	}
	if (Array.isArray(lostxyl)) rec.lostxyl = lostxyl as PValue;
	else {
		const awardBits = Array.isArray(awards) ? awards.reduce<number>((n, b) => n | (1 << Number(b)), 0) : 0;
		const loc = typeof v.location === "string" ? parseLocation(v.location) : undefined;
		const level = loc?.path[0]?.match(/^level-(\d+)$/);
		if (loc && level && loc.path[1]) {
			const [x, y] = loc.path[1].split(",").map(Number);
			rec.lostxyl = [x ?? 0, y ?? 0, Number(level[1]), awardBits];
		} else rec.lostxyl = [typeof poison === "number" ? poison : 0, 0, 0, awardBits];
	}
	return { slot, rec };
}

// Rewards: the seven-word variant shown by its meaning.

const GOLD_CALC = ["tries", "average", "min_add", "multiply", "tries2", "average2", "min_add2"];
const ITEM_CALC = ["min_index", "factor", "max_times", "range", "percent_bigger", "unused1", "unused2"];

function rewardView(r: Rec): Plain {
	const rewards = (r.rewards as Rec[]).map((x) => {
		const calc = x.calc as number[];
		const names = x.is_item ? ITEM_CALC : GOLD_CALC;
		return { chance: x.chance as number, [x.is_item ? "item" : "gold"]: Object.fromEntries(names.map((n, i) => [n, calc[i] ?? 0])) };
	});
	return { chest: r.chest as boolean, traps: r.traps as string, count: r.count as number, rewards };
}

function rewardRecord(v: { [key: string]: Plain }): PValue {
	const out: { [key: string]: PValue } = {};
	for (const k of ["chest", "traps", "count"]) if (v[k] !== undefined) out[k] = v[k] as PValue;
	if (Array.isArray(v.rewards))
		out.rewards = v.rewards.map((x) => {
			const e = (x ?? {}) as { [key: string]: Plain };
			const isItem = e.item !== undefined;
			const calc = (isItem ? e.item : e.gold) as { [key: string]: number } | undefined;
			const names = isItem ? ITEM_CALC : GOLD_CALC;
			return { chance: (e.chance ?? 0) as number, is_item: isItem, calc: names.map((n) => calc?.[n] ?? 0) };
		});
	return out;
}

// Export

export function exportWorld(sc: Scenario, o: ExportOptions = {}): WorldFiles {
	const files: WorldFiles = new Map();
	const old = o.existing;
	const { game, per_2_blocks, on_disk, unused, block_offset, race_names, class_names, status_names, align_names, spell_hash, spell_group, spell_kind } = sc.toc;
	const spells = (spell_hash as number[]).map((hash, index) => ({
		index, name: SPELL_BY_HASH.get(hash) ?? null, hash, group: (spell_group as number[])[index] ?? 0, kind: (spell_kind as string[])[index] ?? "GENERIC",
	}));
	write(files, old, "SCENARIO.yml", {
		game,
		volume: sc.volume.name,
		base: { source: o.source ?? null, sha1: o.sha1 ?? null },
		toc: { per_2_blocks, on_disk, unused, block_offset } as Plain,
		names: { race: race_names, class: class_names, status: status_names, alignment: align_names } as Plain,
		spells,
		experience: sc.read("EXP", 0, TEXP) as Plain,
	}, {
		header: ` ${game}\n The scenario's table of contents, name tables, spells and experience.\n spells: SPELLSKN bit n is the spell at index n; name follows hash and is not read back.`,
		identity: ["index"],
		note: (p) => (p[0] === "base" && p.length === 1 ? "the disk this world was exported from" : undefined),
	});

	const maze: { [key: string]: Plain } = {
		castle: { note: "Not on the disk. Characters not lost in the maze are here; stairs to level 0 lead here." },
	};
	for (let level = 1; level <= sc.count("MAZE"); level++) {
		const m = sc.maze(level);
		const kinds = m.square_type as string[];
		const { map, oneWay } = mazeArt(m as unknown as MazeGrids, kinds);
		maze[`level-${level}`] = {
			map,
			one_way: oneWay as unknown as Plain,
			specials: kinds.map((kind, index) => ({ index, kind, aux: [(m.aux0 as number[])[index] ?? 0, (m.aux1 as number[])[index] ?? 0, (m.aux2 as number[])[index] ?? 0] })),
			encounters: m.encounters as Plain,
		};
	}
	write(files, old, "MAZE.yml", maze, {
		header: ` The ten levels of ${game}.\n Locations: MAZE.yml#level-3/4,7 is x 4, y 7 of level 3.\n${MAZE_KEY.replace(/^/gm, " ")}`,
		identity: ["index", "x"],
		flow: (p, v) => (p.length === 3 && p[1] === "specials") || leafy(v),
		note: (p) => {
			if (p.length === 3 && p[1] === "specials") {
				const level = sc.maze(Number(String(p[0]).slice(6)));
				const i = Number(p[2]);
				return describeSpecial(sc, (level.square_type as string[])[i] ?? "", [(level.aux0 as number[])[i] ?? 0, (level.aux1 as number[])[i] ?? 0, (level.aux2 as number[])[i] ?? 0]);
			}
			return undefined;
		},
	});

	const tables: [string, string, "OBJECT" | "ENEMY" | "REWARD", PType, string][] = [
		["ITEMS.yml", "items", "OBJECT", TOBJREC, "Items, by the number characters and rewards use."],
		["MONSTERS.yml", "monsters", "ENEMY", TENEMY, "Monsters, by the number encounters use."],
		["REWARDS.yml", "rewards", "REWARD", TREWARD, "Treasure tables, by the number monsters' rewards use. A reward is gold or an item."],
	];
	for (const [file, key, section, type, header] of tables) {
		const notes = fieldNotes(type);
		const rows = sc.all(section, type).map((r, index) => ({ index, ...((section === "REWARD" ? rewardView(r) : r) as { [key: string]: Plain }) }));
		write(files, old, file, { [key]: rows }, {
			header: ` ${header}`,
			identity: ["index"],
			note: (p) => {
				const k = lastKey(p);
				if (p.length !== 3 || !k) return undefined;
				if (k === "spell_power") {
					const v = (rows[Number(p[1])] as { spell_power?: number })?.spell_power ?? 0;
					return v ? `casts ${sc.spellName(v) ?? v}` : undefined;
				}
				return notes.get(k);
			},
		});
	}

	const pictures = Array.from({ length: sc.count("SPCCHRS") }, (_, index) => ({ index, hex: hexRows(sc.bytes("SPCCHRS", index, sizeOf(PICTURE)), 32) }));
	write(files, old, "PICTURES.yml", { pictures }, { header: " Monster pictures, 512 bytes each, by the number monsters' picture uses.", identity: ["index"] });

	const messages: { [key: string]: Plain }[] = [];
	let lines: string[] = [], start = 0;
	for (let i = 0; i < sc.messageLines(); i++) {
		const { text, end } = sc.messageLine(i);
		if (!lines.length) start = i;
		lines.push(text);
		if (end) {
			messages.push({ line: start, text: lines });
			lines = [];
		}
	}
	if (lines.some((l) => l !== "")) messages.push({ line: start, text: lines, unterminated: true });
	write(files, old, "MESSAGES.yml", { messages }, {
		header: " SCENARIO.MESGS. Each message starts at line, 12 lines to a block; specials and items name the first line.",
		identity: ["line"],
		flow: () => false,
	});

	const existingSlots = new Map<number, string>();
	for (const [path, text] of old ?? []) {
		if (!/^characters\/[^/]+\/CHARACTER\.yml$/.test(path)) continue;
		const slot = (parse(text) as { wizardry?: { slot?: number } } | null)?.wizardry?.slot;
		if (typeof slot === "number") existingSlots.set(slot, path);
	}
	const used = new Set(existingSlots.values());
	const charNotes = fieldNotes(TCHAR);
	const parties = new Map<string, string[]>();
	const names = itemNames(sc);
	for (const { slot, rec } of sc.characters()) {
		const view = characterView(sc, names, slot, rec);
		let path = existingSlots.get(slot);
		if (!path) {
			path = `characters/${slug(String(view.name))}/CHARACTER.yml`;
			if (used.has(path)) path = `characters/${slug(String(view.name))}-${slot}/CHARACTER.yml`;
			used.add(path);
		}
		if (view.location !== CASTLE) parties.set(String(view.location), [...(parties.get(String(view.location)) ?? []), String(view.name)]);
		write(files, old, path, view, {
			header: ` ${view.name}: roster slot ${slot} of ${game}.\n Possessions name items in ITEMS.yml; spells name SCENARIO.yml spells.`,
			owned: (p, k) => p.length === 1 && p[0] === "wizardry" && ["poison", "lostxyl"].includes(k),
			note: (p) => {
				const k = lastKey(p);
				if (p.length === 1 && k === "location") return "where the character was left in the maze, or MAZE.yml#castle";
				if (p.length === 2 && p[0] === "wizardry" && k === "lostxyl") return "raw LOSTXYL words; overrides location, poison and awards. Delete to use them.";
				if (p.length === 2 && p[0] === "wizardry" && k === "awards") return "AWARDS[4] bits";
				return p.length === 2 && p[0] === "wizardry" && k ? charNotes.get(k) : undefined;
			},
		});
	}
	write(files, old, "PARTIES.yml", { lost: [...parties].map(([location, members]) => ({ location, members })) }, {
		header: " Characters left in the maze, grouped where they were left. Derived from the characters; import ignores this file.",
	});
	return files;
}

// Import

function parseFile(files: WorldFiles, path: string): { [key: string]: Plain } | undefined {
	const text = files.get(path);
	if (text === undefined) return undefined;
	try {
		return (parse(text) ?? {}) as { [key: string]: Plain };
	} catch (e) {
		throw new Error(`${path}: ${(e as Error).message}`);
	}
}

const byIndex = (rows: Plain, where: string): [number, { [key: string]: Plain }][] =>
	(Array.isArray(rows) ? rows : []).map((r, i) => {
		const x = (r ?? {}) as { [key: string]: Plain };
		if (typeof x.index !== "number") throw new Error(`${where} entry ${i + 1}: index must be a number`);
		const { index, ...rest } = x;
		return [index, rest];
	});

/** Writes the world's files into the scenario's volume. Files that are missing leave the base alone. */
export function importWorld(files: WorldFiles, sc: Scenario): void {
	const scen = parseFile(files, "SCENARIO.yml");
	if (scen) {
		const toc = (scen.toc ?? {}) as { [key: string]: PValue };
		const names = (scen.names ?? {}) as { [key: string]: PValue };
		const value: { [key: string]: PValue } = { ...toc };
		if (scen.game !== undefined) value.game = scen.game as PValue;
		for (const [k, field] of [["race", "race_names"], ["class", "class_names"], ["status", "status_names"], ["alignment", "align_names"]] as const)
			if (names[k] !== undefined) value[field] = names[k]!;
		if (Array.isArray(scen.spells)) {
			const hash: number[] = [...(sc.toc.spell_hash as number[])], group = [...(sc.toc.spell_group as number[])], kind = [...(sc.toc.spell_kind as string[])];
			for (const [i, s] of byIndex(scen.spells, "SCENARIO.yml spells")) {
				hash[i] = s.hash as number;
				group[i] = s.group as number;
				kind[i] = s.kind as string;
			}
			Object.assign(value, { spell_hash: hash, spell_group: group, spell_kind: kind });
		}
		encode(TSCNTOC, value, sc.data, 0, "SCENARIO.yml");
		if (scen.experience) sc.write("EXP", 0, TEXP, scen.experience as PValue, "SCENARIO.yml experience");
	}

	const maze = parseFile(files, "MAZE.yml");
	for (const [key, v] of Object.entries(maze ?? {})) {
		const level = /^level-(\d+)$/.exec(key);
		if (!level) continue;
		const n = Number(level[1]), where = `MAZE.yml ${key}`, l = (v ?? {}) as { [key: string]: Plain };
		const value: { [key: string]: PValue } = {};
		if (typeof l.map === "string") {
			try {
				Object.assign(value, parseMazeArt(l.map, (l.one_way ?? []) as unknown as OneWay[]));
			} catch (e) {
				throw new Error(`${where}: ${(e as Error).message}`);
			}
		}
		if (Array.isArray(l.specials)) {
			const cur = sc.maze(n);
			const kinds = [...(cur.square_type as string[])], aux = [0, 1, 2].map((a) => [...(cur[`aux${a}`] as number[])]);
			for (const [i, s] of byIndex(l.specials, `${where} specials`)) {
				kinds[i] = s.kind as string;
				(s.aux as number[] | undefined)?.forEach((x, a) => (aux[a]![i] = x));
			}
			Object.assign(value, { square_type: kinds, aux0: aux[0]!, aux1: aux[1]!, aux2: aux[2]! });
		}
		if (l.encounters) value.encounters = l.encounters as PValue;
		sc.write("MAZE", n - 1, TMAZE, value, where);
	}

	for (const [file, key, section, type] of [["ITEMS.yml", "items", "OBJECT", TOBJREC], ["MONSTERS.yml", "monsters", "ENEMY", TENEMY], ["REWARDS.yml", "rewards", "REWARD", TREWARD]] as const) {
		const doc = parseFile(files, file);
		for (const [i, r] of byIndex(doc?.[key] ?? [], file))
			sc.write(section, i, type, section === "REWARD" ? rewardRecord(r) : (r as PValue), `${file} ${key} ${i}`);
	}

	for (const [i, p] of byIndex(parseFile(files, "PICTURES.yml")?.pictures ?? [], "PICTURES.yml")) {
		const bytes = fromHexRows(String(p.hex ?? ""));
		if (bytes.length !== 512) throw new Error(`PICTURES.yml picture ${i}: ${bytes.length} bytes, not 512`);
		if (i >= sc.count("SPCCHRS")) throw new Error(`PICTURES.yml picture ${i}: there are ${sc.count("SPCCHRS")}`);
		sc.data.set(bytes, sc.offset("SPCCHRS", i, 512));
	}

	for (const [n, m] of ((parseFile(files, "MESSAGES.yml")?.messages ?? []) as { [key: string]: Plain }[]).entries()) {
		const start = m.line, text = m.text;
		if (typeof start !== "number" || !Array.isArray(text)) throw new Error(`MESSAGES.yml entry ${n + 1}: needs line and text`);
		text.forEach((t, i) => {
			const line = start + i;
			if (line >= sc.messageLines()) throw new Error(`MESSAGES.yml message at line ${start}: SCENARIO.MESGS has ${sc.messageLines()} lines (${sc.messageLines() / LINES_PER_BLOCK} blocks)`);
			encode(MESSAGE_LINE, { text: String(t ?? ""), end: i === text.length - 1 && !m.unterminated }, sc.mesgs, sc.messageOffset(line), `MESSAGES.yml line ${line}`);
		});
	}

	const names = itemNames(sc);
	for (const path of [...files.keys()].filter((p) => /^characters\/[^/]+\/CHARACTER\.yml$/.test(p)).sort()) {
		const { slot, rec } = characterRecord(sc, names, parseFile(files, path)!, path);
		sc.write("CHAR", slot, TCHAR, rec, path);
	}
}
