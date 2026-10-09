import {
	AMASK,
	blockLen,
	classify,
	isBlockHeader,
	JMS,
	NIL,
	NONITEM,
	PXID,
	WMASK,
} from "./words.js";

/**
 * A ring image: the data-structure core area as it crosses the wire.
 * The blocklet transfer ships this verbatim — 4 stream-heading words
 * (PXID, DSBEG, DSEND, SAVINS) then the raw words from BEG upward —
 * and the receiver runs one relocation pass to make the pointers true
 * at their new address. Wire-compatible, not RAM-byte-compatible:
 * this object *is* the interchange format.
 */
export type RingImage = {
	/** Where the words lived (or will live) in core. */
	beg: number;
	/** One past the data-structure area, as the END variable holds it. */
	end: number;
	/** The entry name — SYMELEC's SAVINS, the structure's front door. */
	savins: number;
	words: number[];
};

/**
 * Where SYMELEC keeps the variables that describe its own data
 * structure — the three words a camera needs.
 */
export type CoreVars = {
	beg: number;
	end: number;
	savins: number;
};

export const SYMELEC_VARS: CoreVars = { beg: 0o5162, end: 0o5163, savins: 0o5146 };

/**
 * Photograph the ring structure straight out of live core. No wire:
 * an in-process Titan can see all of the emulated PDP-7's memory, so
 * capture is a read loop over [BEG, END). The result is the same
 * RingImage the blocklet transfer would carry — encodeTransfer(photo)
 * IS the read-direction RW stream, ready to serve back.
 */
export function photograph(read: (addr: number) => number, vars: CoreVars = SYMELEC_VARS): RingImage {
	const beg = read(vars.beg) & AMASK;
	const end = read(vars.end) & AMASK;
	const savins = read(vars.savins) & WMASK;
	const words: number[] = [];
	for (let a = beg; a < end; a += 1) words.push(read(a) & WMASK);
	return { beg, end, savins, words };
}

/** [PXID, DSBEG, DSEND, SAVINS, ...data] — what RW actually carries. */
export function encodeTransfer(image: RingImage): number[] {
	return [
		PXID,
		image.beg & WMASK,
		image.end & WMASK,
		image.savins & WMASK,
		...image.words.map((w) => w & WMASK),
	];
}

export function decodeTransfer(words: number[]): RingImage {
	const [id, beg, end, savins, ...data] = words;
	if (id !== PXID) {
		throw new Error(`not PIXIE data: stream heading ${id?.toString(8)} != ${PXID.toString(8)}`);
	}
	if (beg === undefined || end === undefined || savins === undefined) {
		throw new Error("stream heading truncated");
	}
	return { beg, end, savins, words: data };
}

/**
 * 18-bit words as bytes for files and sockets: three bytes a word,
 * big-endian, top six bits zero. A transfer stream therefore starts
 * with the bytes of PXID, which is how a reader knows it.
 */
export function packWords(words: number[]): Uint8Array {
	const out = new Uint8Array(words.length * 3);
	words.forEach((w, i) => {
		out[i * 3] = (w >>> 16) & 0o3;
		out[i * 3 + 1] = (w >>> 8) & 0xff;
		out[i * 3 + 2] = w & 0xff;
	});
	return out;
}

export function unpackWords(bytes: Uint8Array): number[] {
	if (bytes.length % 3 !== 0) throw new Error(`not whole words: ${bytes.length} bytes`);
	const out: number[] = [];
	for (let i = 0; i < bytes.length; i += 3) out.push(((bytes[i]! << 16) | (bytes[i + 1]! << 8) | bytes[i + 2]!) & WMASK);
	return out;
}

export const PXID_BYTES = [...packWords([PXID])];

/**
 * The 1972 relocation pass, verbatim in spirit: skip atoms and NILs,
 * add RELCON to every pointer, and on a block header skip the block's
 * raw data using its embedded length. RELCON = newBeg - image.beg
 * (the listing computes it with complement arithmetic; same number).
 * SAVINS is a pointer too and moves with the rest.
 */
export function relocate(image: RingImage, newBeg: number): RingImage {
	const relcon = (newBeg - image.beg) & WMASK;
	const words: number[] = [];
	for (let i = 0; i < image.words.length; i += 1) {
		const w = image.words[i]! & WMASK;
		const kind = classify(w);
		words.push(kind === "pointer" ? (w + relcon) & WMASK : w);
		if (isBlockHeader(w)) {
			// Raw data rides untouched — coordinates are not pointers.
			for (let n = blockLen(w); n > 0 && i + 1 < image.words.length; n -= 1) {
				i += 1;
				words.push(image.words[i]! & WMASK);
			}
		}
	}
	return {
		beg: newBeg & AMASK,
		end: (image.end + (newBeg - image.beg)) & AMASK,
		savins: (image.savins + relcon) & WMASK,
		words,
	};
}

/**
 * The cells a running machine keeps its ring area in: as CoreVars, plus RSPPIX's free list
 * (FREE), the end of the reserve it runs on into (ENDRES), and the permanent name list
 * (BOT up to the word TOP+1 names).
 */
export type RingCells = CoreVars & { free?: number; endres?: number; bot?: number; top?: number };

/**
 * Put a ring image into a running machine, as the 1972 receiver did: relocate it to the
 * machine's own BEG, write it there (less any free list it ends in), and point the root
 * cell (SAVINS) at its entry. Every
 * other permanent name gets a fresh NIL item, as RINIT gives one, so nothing still names the
 * old structure. The rest of the area becomes the free list, laid as RSETUP lays it: each
 * word a nonitem naming the next, on past END to ENDRES. Returns the image as placed.
 */
export function implant(
	image: RingImage,
	read: (addr: number) => number,
	write: (addr: number, word: number) => void,
	cells: RingCells,
): RingImage {
	const beg = read(cells.beg) & AMASK;
	const end = read(cells.end) & AMASK;
	const endres = cells.endres === undefined ? end : read(cells.endres) & AMASK;
	const names: number[] = [];
	if (cells.bot !== undefined && cells.top !== undefined) {
		const last = read(cells.top + 1) & AMASK;
		for (let a = read(cells.bot) & AMASK; a < last; a += 1) {
			const cell = read(a) & AMASK;
			if (cell !== cells.savins) names.push(cell);
		}
	}
	// A photograph of a whole area ends in its free list: nonitems each naming the next word,
	// the last naming END. Leave that off; the free list is laid afresh here.
	let used = image.words.length;
	while (used > 0) {
		const w = image.words[used - 1]! & WMASK;
		const next = image.beg + used;
		if (!(w & NONITEM) || ((w & AMASK) !== next && (w & AMASK) !== image.end)) break;
		used -= 1;
	}
	const kept = { ...image, words: image.words.slice(0, used), end: image.beg + used };
	if (used + 2 * names.length > end - beg) {
		throw new Error(`${used.toString(8)} words won't fit in ${beg.toString(8)}-${end.toString(8)}`);
	}
	const moved = relocate(kept, beg);
	moved.words.forEach((w, i) => write(beg + i, w & WMASK));
	let free = beg + moved.words.length;
	for (const cell of names) {
		write(free, NIL);
		write(free + 1, NIL);
		write(cell, JMS | free);
		free += 2;
	}
	for (let a = free; a < endres; a += 1) write(a, (NONITEM | (a + 1)) & WMASK);
	if (cells.free !== undefined) write(cells.free, free);
	write(cells.savins, moved.savins & WMASK);
	return { ...moved, end: beg + moved.words.length };
}
