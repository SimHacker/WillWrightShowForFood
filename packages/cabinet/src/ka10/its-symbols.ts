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

/** A SQUOZE name back to letters, trailing blanks dropped. */
export function unsquoze(code: number): string {
	let s = "";
	for (let n = code, k = 0; k < 6; k++, n = Math.floor(n / 0o50)) s = SQUOZE[n % 0o50] + s;
	return s.trimEnd();
}

/** One of DDT's symbols: its name, its value, and the four flag bits SQUOZE leaves on top. */
export type ItsSym = { name: string; value: number; flags: number };

/** Every symbol in exec DDT's table, in the table's order; empty before ITS has one. */
export function itsSymbols(bus: Ka10Bus, ddt = ITS_DDT): ItsSym[] {
	const ptr = bus.examine(ddt - 2);
	const count = 0o1000000 - Number(ptr >> 18n);
	const at = Number(ptr & 0o777777n);
	if (count <= 0 || count > 0o200000 || at + count > bus.memWords) return [];
	const out: ItsSym[] = [];
	for (let i = 0; i + 1 < count; i += 2) {
		const w = bus.examine(at + i);
		out.push({ name: unsquoze(Number(w & 0xffffffffn)), value: Number(bus.examine(at + i + 1)), flags: Number(w >> 32n) });
	}
	return out;
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

/**
 * Marks a terminal as typed on just now: its time of last input (TTITM, which the system itself
 * does not use) set to the system's clock (TIME, in 30ths of a second). GUNNER warns and then logs
 * out a user idle past 30 minutes of that clock, which at full speed is seconds of wall time.
 * False if ITS is not far enough up to have its symbols.
 */
export function keepTtyPresent(bus: Ka10Bus, tty: number): boolean {
	const ttitm = itsAddress(bus, "TTITM");
	const time = itsAddress(bus, "TIME");
	if (ttitm === null || time === null) return false;
	bus.deposit(ttitm + tty, bus.examine(time));
	return true;
}
