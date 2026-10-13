import { charText } from "./plugins/type340.js";

/**
 * What a DTG tag says, read out of core. The 340 only carries the address;
 * this is the convention programs and the UI share (TAGS-AND-PIES.md §1).
 *
 * Two shapes, told apart by the first word:
 * - below 128: a Forth counted string, count then one ASCII character per
 *   word, which is what TAG" points at (a record's title is never that low
 *   in core: it would sit in the PDP-7's own low locations);
 * - otherwise a record: flags in bits 0-4 and the title pointer in 5-17,
 *   then the id/URL pointer and a 36-bit id.
 */
export type TagInfo = { addr: number; title: string; url?: string; id?: { hi: number; lo: number } };

const F_TITLE_ASCII = 0o20000; /* bit 4 */
const F_URL_ASCII = 0o40000; /* bit 3 */
const F_ID = 0o100000; /* bit 2 */
const PTR = 0o17777;
const LIMIT = 256;

function ascii(read: (a: number) => number, at: number): string {
	let out = "";
	for (let i = 0; i < LIMIT; i += 1) {
		const w = read((at + i) & PTR) & 0o377;
		if (w === 0) break;
		out += String.fromCharCode(w);
	}
	return out;
}

function sixbit(read: (a: number) => number, at: number): string {
	let out = "";
	for (let i = 0; i < LIMIT; i += 1) {
		const w = read((at + i) & PTR);
		if (w === 0) break;
		for (const sh of [12, 6, 0]) {
			const c = (w >> sh) & 0o77;
			if (c === 0o37) return out;
			if (c) out += charText(c);
		}
	}
	return out;
}

export function readTag(read: (addr: number) => number, addr: number): TagInfo | null {
	if (!addr) return null;
	const w0 = read(addr & PTR);
	if (w0 < 0o200) {
		const n = Math.min(w0, LIMIT);
		let title = "";
		for (let i = 1; i <= n; i += 1) title += String.fromCharCode(read((addr + i) & PTR) & 0o377);
		return { addr, title };
	}
	const titleAt = w0 & PTR;
	const info: TagInfo = { addr, title: titleAt ? (w0 & F_TITLE_ASCII ? ascii : sixbit)(read, titleAt) : "" };
	const urlAt = read((addr + 1) & PTR) & PTR;
	if (urlAt) info.url = (w0 & F_URL_ASCII ? ascii : sixbit)(read, urlAt);
	if (w0 & F_ID) info.id = { hi: read((addr + 2) & PTR), lo: read((addr + 3) & PTR) };
	return info;
}

/** Only http:, https: and relative links may be followed; never javascript: or data:. */
export function safeTagUrl(url: string): boolean {
	const m = /^([a-z][a-z0-9+.-]*):/i.exec(url.trim());
	return !m || /^https?$/i.test(m[1] ?? "");
}
