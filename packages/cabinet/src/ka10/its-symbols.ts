/**
 * ITS's own variables, found by name in a running system, the way its .EVAL finds them: the
 * word two before exec DDT holds an AOBJN pointer (-length,,address) to DDT's symbol table, pairs
 * of a name in SQUOZE (left-padded flags in the top four bits) and its value. The page uses this
 * to set what ITS keeps per terminal and where the system job types its log.
 */
import type { Ka10Bus } from "./bus.js";

/** Where exec DDT sits in the ITS the cabinet runs (SYSTEM; ITS: DDT=774000). */
export const ITS_DDT = 0o774000;

const SQUOZE = " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.$%";

/** A name as DDT's table spells it: six SQUOZE characters, blank-padded, in 32 bits. */
export function squoze(name: string): number {
	return [...name.toUpperCase().padEnd(6).slice(0, 6)].reduce((v, c) => v * 0o50 + Math.max(0, SQUOZE.indexOf(c)), 0);
}

/** A symbol's value, or null if the table is not there yet or does not have it. */
export function itsSymbol(bus: Ka10Bus, name: string, ddt = ITS_DDT): bigint | null {
	const ptr = bus.examine(ddt - 2);
	const count = 0o1000000 - Number(ptr >> 18n);
	const at = Number(ptr & 0o777777n);
	if (count <= 0 || count > 0o200000 || at + count > bus.memWords) return null;
	const want = BigInt(squoze(name));
	for (let i = 0; i < count; i += 2) if ((bus.examine(at + i) & 0xffffffffn) === want) return bus.examine(at + i + 1);
	return null;
}

/** A symbol's address, its value's right half: where a variable such as SYSCN lives. */
export function itsAddress(bus: Ka10Bus, name: string, ddt = ITS_DDT): number | null {
	const v = itsSymbol(bus, name, ddt);
	return v === null ? null : Number(v & 0o777777n);
}

/**
 * Where the system job types its log (LOGIN, GUNNER, the time…): the console (TTY 0) as ITS
 * starts, another TTY, or nowhere (-1), when its output goes to the null device (SYSJOB SYSCOP).
 * False if ITS is not far enough up to have its symbols.
 */
export function setSystemLog(bus: Ka10Bus, tty: number): boolean {
	const a = itsAddress(bus, "SYSCN");
	if (a === null) return false;
	bus.deposit(a, tty < 0 ? 0o777777777777n : BigInt(tty));
	return true;
}
