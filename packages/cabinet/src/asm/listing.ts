import { type AsmResult, addrMask, digits } from "./core.js";

/**
 * Listings in the house style of the Cambridge assembler's 1972 listings, as on Heinz Lemke's
 * SYMELEC (packages/cabinet/tapes/symelec/symelec-listing.txt):
 *
 *   /SYMELEC   ASSEMBLED 12 2 72 AT 12,44,57 BY HL1470   PAGE  1
 *      10      24/ 212257  BEGRTP,  LAC (JMP INT               /INTERRUPT ENTRY
 *
 * Each row is a sequence number, which starts again at 1 after each tape segment, then the
 * address, the word and the source line as written. Then come the variables and the literals, in
 * address order, and the symbol table on a page of its own, four symbols to a row, sorted as
 * Titan sorted, letters before digits. A `*` marks a value too big to be an address, such as
 * JMS plus one. Any machine: the widths follow from its word and address sizes and its radix.
 */
export type ListingOpts = {
	/** Default: the first tape's name. */
	title?: string;
	/** Who assembled it; several are comma separated (`PETERSON,VINER`). Omitted if empty. */
	user?: string;
	/** Default: now. */
	date?: Date;
	/** Rows per page, 58 as in 1972; 0 for one continuous listing, headed once. */
	pageLines?: number;
	/** Start each page after the first with a form feed, for a printer. */
	formFeed?: boolean;
	/** Print names and the title in upper case. Default: whichever case the source mostly uses. */
	upperCase?: boolean;
};

const two = (n: number): string => String(n).padStart(2, "0");

/** Letters before digits, and a name before its extensions: U, UNSTAK, U1. */
const titanKey = (name: string): string =>
	[...name.toLowerCase()].map((c) => (/[a-z]/.test(c) ? String.fromCharCode(0x41 + c.charCodeAt(0) - 0x61) : /[0-9]/.test(c) ? String.fromCharCode(0x61 + Number(c)) : c)).join("");

export function printListing(result: AsmResult, opts: ListingOpts = {}): string {
	const m = result.machine;
	const num = (n: number): string => n.toString(m.radix).toUpperCase();
	const aw = digits(m, m.addrBits) + 3;
	const ww = digits(m, m.wordBits) + 1;
	const source = result.listing.map((l) => l.source).join("");
	const upper = opts.upperCase ?? (source.replace(/[^A-Z]/g, "").length >= source.replace(/[^a-z]/g, "").length);
	const cased = (s: string): string => (upper ? s.toUpperCase() : s);
	const title = cased(opts.title ?? result.listing[0]?.tape ?? "");
	const d = opts.date ?? new Date();
	const when = `ASSEMBLED ${d.getDate()} ${d.getMonth() + 1} ${two(d.getFullYear() % 100)} AT ${two(d.getHours())},${two(d.getMinutes())},${two(d.getSeconds())}`;
	const by = opts.user ? ` BY ${opts.user}` : "";
	const pageLines = opts.pageLines ?? 58;

	const out: string[] = [];
	let page = 0;
	let onPage = 0;
	const newPage = (): void => {
		page += 1;
		onPage = 0;
		out.push(page > 1 && opts.formFeed ? "\f" : "", `/${title}   ${when}${by}${pageLines > 0 ? `   PAGE  ${page}` : ""}`);
	};
	const row = (text: string): void => {
		if (page === 0 || (pageLines > 0 && onPage === pageLines)) newPage();
		out.push(text.trimEnd());
		onPage += 1;
	};
	const blank = " ".repeat(aw + 1 + ww);

	let seq = 0;
	let tape = result.listing[0]?.tape;
	for (const l of result.listing) {
		if (l.tape !== tape) {
			tape = l.tape;
			seq = 0;
		}
		seq += 1;
		const n = String(seq).padStart(5);
		if (l.addr === null || l.words.length === 0) row(`${n}${blank}  ${l.source}`);
		else {
			row(`${n}${num(l.addr).padStart(aw)}/${num(l.words[0] as number).padStart(ww)}  ${l.source}`);
			for (let k = 1; k < l.words.length; k += 1) row(`     ${num((l.addr + k) & addrMask(m)).padStart(aw)}/${num(l.words[k] as number).padStart(ww)}`);
		}
		if (l.endsSegment) seq = 0;
	}

	const pool = [
		...result.variables.map((v) => ({ addr: v.addr, text: `${num(v.addr)}/${"0".padStart(ww)}  ${cased(v.name)}` })),
		...result.literals.map((l) => ({ addr: l.addr, text: `${num(l.addr)}/ ${num(l.word)}` })),
	].sort((a, b) => a.addr - b.addr);
	for (const p of pool) row(p.text);

	const names = [...result.symbols.entries()].sort((a, b) => (titanKey(a[0]) < titanKey(b[0]) ? -1 : titanKey(a[0]) > titanKey(b[0]) ? 1 : 0));
	if (pageLines > 0 && names.length > 0) onPage = pageLines;
	else if (names.length > 0) row("");
	const cell = ([name, v]: [string, number]): string =>
		`${cased(name).padEnd(7)}=${v > addrMask(m) ? "*" : " "}${num(v).padStart(digits(m, m.addrBits))}`.padEnd(22);
	for (let k = 0; k < names.length; k += 4) row(names.slice(k, k + 4).map(cell).join(""));
	return out.join("\n") + "\n";
}
