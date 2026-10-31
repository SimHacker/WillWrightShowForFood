// The records of Wizardry's SCENARIO.DATA and SCENARIO.MESGS, transcribed from the TYPE
// section of Ewers' reconstructed source (snafaru/Wizardry.Code: WIZ.TEXT, REWARDS.TEXT,
// CAMP.TEXT). Keys are for people editing YAML; `pascal` keeps the source's name.

import { array, bool, enumOf, f, int, keyed, long, packed, range, record, sizeOf, str, type PType } from "@wwsff/bridge";

/** TWIZLONG: three words of four decimal digits, low first (ADDLONGS carries at 10000). */
export const wizlong = long(3, 10000);

export const SECTIONS = ["ZERO", "MAZE", "ENEMY", "REWARD", "OBJECT", "CHAR", "SPCCHRS", "EXP"] as const;
export const RACE = ["NORACE", "HUMAN", "ELF", "DWARF", "GNOME", "HOBBIT"] as const;
export const CLASS = ["FIGHTER", "MAGE", "PRIEST", "THIEF", "BISHOP", "SAMURAI", "LORD", "NINJA"] as const;
export const STATUS = ["OK", "AFRAID", "ASLEEP", "PLYZE", "STONED", "DEAD", "ASHES", "LOST"] as const;
export const ALIGN = ["UNALIGN", "GOOD", "NEUTRAL", "EVIL"] as const;
export const ATTRIBUTES = ["strength", "iq", "piety", "vitality", "agility", "luck"] as const;
export const OBJTYPE = ["WEAPON", "ARMOR", "SHIELD", "HELMET", "GAUNTLET", "SPECIAL", "MISC"] as const;
export const WALL = ["OPEN", "WALL", "DOOR", "HIDEDOOR"] as const;
export const SQUARE = ["NORMAL", "STAIRS", "PIT", "CHUTE", "SPINNER", "DARK", "TRANSFER",
	"OUCHY", "BUTTONZ", "ROCKWATE", "FIZZLE", "SCNMSG", "ENCOUNTE"] as const;
export const SPELL_KIND = ["GENERIC", "PERSON", "GROUP"] as const;

/** Spell names by the hash SCNTOC.SPELLHSH holds (CAMP.TEXT). CALFO and KANDI also by the
 * values the shipped disks have, which version 3.2 of the source changed. */
export const SPELL_BY_HASH: ReadonlyMap<number, string> = new Map([
	[4178, "HALITO"], [2409, "MOGREF"], [3983, "KATINO"], [3245, "DUMAPIC"], [3340, "DILTO"],
	[1953, "SOPIC"], [6181, "MAHALITO"], [4731, "MOLITO"], [4744, "MORLIS"], [3180, "DALTO"],
	[6156, "LAHALITO"], [7525, "MAMORLIS"], [6612, "MAKANITO"], [4925, "MADALTO"], [6587, "LAKANITO"],
	[4573, "ZILWAN"], [3990, "MASOPIC"], [1562, "HAMAN"], [3128, "MALOR"], [2597, "MAHAMAN"],
	[11157, "TILTOWAI"], [1449, "KALKI"], [2301, "DIOS"], [3675, "BADIOS"], [2889, "MILWA"],
	[2287, "PORFIC"], [3139, "MATU"], [1717, "CALFO"], [2619, "MANIFO"], [5970, "MONTINO"],
	[5333, "LOMILWA"], [2718, "DIALKO"], [6491, "LATUMAPI"], [5169, "BAMATU"], [761, "DIAL"],
	[1253, "BADIAL"], [9463, "LATUMOFI"], [4322, "MAPORFIC"], [1614, "DIALMA"], [2446, "BADIALMA"],
	[4396, "LITOKAN"], [1885, "KANDI"], [1185, "KANDI"], [180, "DI"], [382, "BADI"], [4296, "LORTO"],
	[547, "MADI"], [759, "MABADI"], [8330, "LOKTOFEI"], [5514, "MALIKTO"], [6673, "KADORTO"],
]);

/** THPREC: COUNT d SIDES + BONUS, as ENEMYCNT and the hit-point rolls use it. */
export const DICE = record(
	f("count", "LEVEL", int),
	f("sides", "HPFAC", int),
	f("bonus", "HPMINAD", int),
);

export const TSCNTOC = record(
	f("game", "GAMENAME", str(40)),
	f("per_2_blocks", "RECPER2B", keyed(SECTIONS, int)),
	f("on_disk", "RECPERDK", keyed(SECTIONS, int)),
	f("unused", "UNUSEDXX", keyed(SECTIONS, int)),
	f("block_offset", "BLOFF", keyed(SECTIONS, int)),
	f("race_names", "RACE", array(6, str(9))),
	f("class_names", "CLASS", array(8, str(9))),
	f("status_names", "STATUS", array(8, str(8))),
	f("align_names", "ALIGN", array(4, str(9))),
	f("spell_hash", "SPELLHSH", array(51, int)),
	f("spell_group", "SPELLGRP", packed(51, range(7))),
	f("spell_kind", "SPELL012", packed(51, enumOf(SPELL_KIND))),
);

export const TCHAR = record(
	f("name", "NAME", str(15)),
	f("password", "PASSWORD", str(15)),
	f("in_maze", "INMAZE", bool, "out on an expedition when the disk was saved"),
	f("race", "RACE", enumOf(RACE)),
	f("class", "CLASS", enumOf(CLASS)),
	f("age_weeks", "AGE", int),
	f("status", "STATUS", enumOf(STATUS)),
	f("alignment", "ALIGN", enumOf(ALIGN)),
	f("attributes", "ATTRIB", keyed(ATTRIBUTES, range(18), true)),
	f("luck_skill", "LUCKSKIL", packed(5, range(31))),
	f("gold", "GOLD", wizlong),
	f("possessions", "POSS", record(
		f("count", "POSSCNT", int),
		f("items", "POSSESS", array(8, record(
			f("equipped", "EQUIPED", bool),
			f("cursed", "CURSED", bool),
			f("identified", "IDENTIF", bool),
			f("item", "EQINDEX", int),
		))),
	)),
	f("experience", "EXP", wizlong),
	f("max_level", "MAXLEVAC", int),
	f("level", "CHARLEV", int),
	f("hp", "HPLEFT", int, "hit points left"),
	f("hp_max", "HPMAX", int),
	f("spells_known", "SPELLSKN", packed(64, bool), "bit n is the spell with SPELLHSH[n]; 50 entries and the word's padding"),
	f("mage_spells", "MAGESP", array(7, int), "spell points per level, 1 to 7"),
	f("priest_spells", "PRIESTSP", array(7, int)),
	f("hp_calc", "HPCALCMD", int),
	f("armor_class", "ARMORCL", int, "lower is better"),
	f("heal_points", "HEALPTS", int, "regeneration per move"),
	f("critical_hit", "CRITHITM", bool),
	f("swings", "SWINGCNT", int),
	f("damage", "HPDAMRC", DICE),
	f("vs_type_2", "WEPVSTY2", packed(2, packed(14, bool))),
	f("vs_type_3", "WEPVSTY3", packed(2, packed(7, bool))),
	f("vs_type", "WEPVSTYP", packed(14, bool)),
	f("lostxyl", "LOSTXYL", array(4, int), "variant: LOCATION x, y, level; POISNAMT[1]; AWARDS[4]"),
);

export const TOBJREC = record(
	f("name", "NAME", str(15)),
	f("name_unknown", "NAMEUNK", str(15), "shown until identified"),
	f("type", "OBJTYPE", enumOf(OBJTYPE)),
	f("alignment", "ALIGN", enumOf(ALIGN)),
	f("cursed", "CURSED", bool),
	f("special", "SPECIAL", int),
	f("change_to", "CHANGETO", int, "item it becomes when used up"),
	f("change_chance", "CHGCHANC", int),
	f("price", "PRICE", wizlong),
	f("boltac_stock", "BOLTACXX", int, "how many Boltac's has; -1 unlimited"),
	f("spell_power", "SPELLPWR", int, "index into SPELLHSH of the spell it casts"),
	f("class_use", "CLASSUSE", keyed(CLASS, bool, true)),
	f("heal_points", "HEALPTS", int),
	f("vs_type_2", "WEPVSTY2", packed(16, bool)),
	f("vs_type_3", "WEPVSTY3", packed(16, bool)),
	f("armor_mod", "ARMORMOD", int),
	f("to_hit", "WEPHITMD", int),
	f("damage", "WEPHPDAM", DICE),
	f("extra_swings", "XTRASWNG", int),
	f("critical_hit", "CRITHITM", bool),
	f("vs_type", "WEPVSTYP", packed(14, bool)),
);

export const TENEMY = record(
	f("name_unknown", "NAMEUNK", str(15)),
	f("name_unknown_plural", "NAMEUNKS", str(15)),
	f("name", "NAME", str(15)),
	f("name_plural", "NAMES", str(15)),
	f("picture", "PIC", int, "index into the pictures"),
	f("group_size", "CALC1", DICE, "declared TWIZLONG, used as THPREC dice by ENEMYCNT"),
	f("hp", "HPREC", DICE),
	f("class", "CLASS", int),
	f("armor_class", "AC", int),
	f("attack_count", "RECSN", int),
	f("attacks", "RECS", array(7, DICE)),
	f("experience", "EXPAMT", wizlong),
	f("drain", "DRAINAMT", int, "levels drained per hit"),
	f("heal_points", "HEALPTS", int),
	f("reward_wandering", "REWARD1", int),
	f("reward_lair", "REWARD2", int),
	f("partner", "ENMYTEAM", int, "monster that may join the group"),
	f("partner_chance", "TEAMPERC", int),
	f("mage_spells", "MAGSPELS", int),
	f("priest_spells", "PRISPELS", int),
	f("unique", "UNIQUE", int),
	f("breathe", "BREATHE", int),
	f("unaffected", "UNAFFCT", int, "spell resistance, percent"),
	f("resists", "WEPVSTY3", packed(16, bool)),
	f("abilities", "SPPC", packed(16, bool)),
);

export const TREWARDX = record(
	f("chance", "REWDPERC", int, "percent"),
	f("is_item", "BITEM", bool),
	f("calc", "REWDCALC", array(7, int),
		"variant. gold: TRIES AVEAMT MINADD MULTX TRIES2 AVEAMT2 MINADD2; item: MININDX MFACTOR MAXTIMES RANGE PERCBIGR"),
);

export const TREWARD = record(
	f("chest", "BCHEST", bool),
	f("traps", "BTRAPTYP", packed(8, bool)),
	f("count", "REWRDCNT", int),
	f("rewards", "REWARDXX", array(9, TREWARDX)),
);

const GRID = (of: PType) => packed(20, packed(20, of));

export const TMAZE = record(
	f("w", "W", GRID(enumOf(WALL))),
	f("s", "S", GRID(enumOf(WALL))),
	f("e", "E", GRID(enumOf(WALL))),
	f("n", "N", GRID(enumOf(WALL))),
	f("fights", "FIGHTS", GRID(range(1))),
	f("square", "SQREXTRA", GRID(range(15))),
	f("square_type", "SQRETYPE", packed(16, enumOf(SQUARE))),
	f("aux0", "AUX0", array(16, int)),
	f("aux1", "AUX1", array(16, int)),
	f("aux2", "AUX2", array(16, int)),
	f("encounters", "ENMYCALC", array(3, record(
		f("min_enemy", "MINENEMY", int),
		f("mult_worse", "MULTWORS", int),
		f("worse01", "WORSE01", int),
		f("range0n", "RANGE0N", int),
		f("perc_worse", "PERCWORS", int),
	))),
);

export const TEXP = keyed(CLASS, array(13, wizlong));
export const PICTURE = packed(512, range(255));
export const MESSAGE_LINE = record(f("text", "BUFF", str(38)), f("end", "ENDMSG", bool));

export const SIZES = {
	TSCNTOC: sizeOf(TSCNTOC), TCHAR: sizeOf(TCHAR), TOBJREC: sizeOf(TOBJREC), TENEMY: sizeOf(TENEMY),
	TREWARD: sizeOf(TREWARD), TMAZE: sizeOf(TMAZE), TEXP: sizeOf(TEXP), PICTURE: sizeOf(PICTURE),
	MESSAGE_LINE: sizeOf(MESSAGE_LINE),
} as const;
