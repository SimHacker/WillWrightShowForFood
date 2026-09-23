import type { RingImage } from "./image.js";
import { addrOf, AMASK, isAtom, isNil, NIL, NONITEM, pointer, WMASK } from "./words.js";

/**
 * The cell layer, read off RSPPIX's own accessors (listing 2312-2406):
 * an item is a two-word cell — CDR reaches its field with `TAD (1` —
 * a "name" is a 13-bit address ORed with the JMS opcode so the machine
 * can indirect through it, and CAR 7 follows sign-bit "nonitems" by
 * their low 13 bits before trusting what it read.
 *
 * Status: interpreted from the listing, self-consistent under test.
 * The serve-back rung — 1972 SYMELEC walking a structure this module
 * built — is the referee that promotes it to verified.
 */

/** Follow nonitem forwarding the way CAR 7 does. */
function resolve(image: RingImage, addr: number): number {
	let a = addr & AMASK;
	let w = read(image, a);
	let guard = 64;
	while (w & NONITEM) {
		a = w & AMASK;
		w = read(image, a);
		guard -= 1;
		if (guard === 0) throw new Error("nonitem forwarding loop");
	}
	return a;
}

function read(image: RingImage, addr: number): number {
	const i = (addr & AMASK) - image.beg;
	const w = image.words[i];
	if (w === undefined) throw new Error(`address ${addr.toString(8)} outside image`);
	return w & WMASK;
}

export function car(image: RingImage, name: number): number {
	return read(image, resolve(image, addrOf(name)));
}

export function cdr(image: RingImage, name: number): number {
	return read(image, resolve(image, addrOf(name)) + 1);
}

/** Walk a NIL-terminated list of names, returning the car words. */
export function toArray(image: RingImage, name: number): number[] {
	const out: number[] = [];
	let p = name;
	let guard = 8192;
	while (!isNil(p)) {
		out.push(car(image, p));
		p = cdr(image, p);
		guard -= 1;
		if (guard === 0) throw new Error("unterminated list");
	}
	return out;
}

/**
 * Builds ring images the way GETSP hands out cells: two words each,
 * consecutive from BEG. Addresses are assigned at allocation so cells
 * can reference each other; build() emits the finished image.
 */
export class RingBuilder {
	readonly beg: number;
	private words: number[] = [];
	savins = NIL;

	constructor(beg: number) {
		this.beg = beg & AMASK;
	}

	/** A bare 13-bit value — chars, counts, coordinates. */
	atom(v: number): number {
		if ((v & WMASK) >>> 13 !== 0) throw new Error(`not an atom: ${v.toString(8)}`);
		return v & AMASK;
	}

	/** Allocate one two-word cell; returns its name. */
	cell(carWord: number, cdrWord: number): number {
		const addr = this.beg + this.words.length;
		this.words.push(carWord & WMASK, cdrWord & WMASK);
		return pointer(addr);
	}

	/** A NIL-terminated list. Cells allocate in reverse so cars are eager. */
	list(items: number[]): number {
		let tail = NIL;
		for (let i = items.length - 1; i >= 0; i -= 1) {
			tail = this.cell(items[i]!, tail);
		}
		return tail;
	}

	/** A printname: char atoms as COPIN stores them — mark-parity ASCII. */
	printname(text: string): number {
		return this.list([...text].map((ch) => this.atom(ch.charCodeAt(0) | 0o200)));
	}

	build(): RingImage {
		return {
			beg: this.beg,
			end: this.beg + this.words.length,
			savins: this.savins,
			words: [...this.words],
		};
	}
}

/** Every pointer in the image lands inside the image. Atoms, NILs and
 * block-header raw data are exempt, mirroring the relocation pass. */
export function pointersResolve(image: RingImage): boolean {
	const end = image.beg + image.words.length;
	for (let i = 0; i < image.words.length; i += 1) {
		const w = image.words[i]! & WMASK;
		if (isAtom(w) || isNil(w)) continue;
		if ((w & ~AMASK) === 0o20000) {
			i += w & AMASK; // block header: raw words are not pointers
			continue;
		}
		const a = addrOf(w);
		if (a < image.beg || a >= end) return false;
	}
	return true;
}
