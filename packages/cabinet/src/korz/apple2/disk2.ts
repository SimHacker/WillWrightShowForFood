import { blockOrder, dosOrder, IMAGE_140K, openImage, type Order } from "../../apple2/disk.js";
import type { Card } from "./plus.js";

/**
 * The Disk II, for a sector image: `.dsk`, `.do`, `.po`, or a 2MG of one of those. A nibble image
 * and a WOZ are a different drive. On insert the sectors are written out as the bytes a formatted
 * track holds, because the P6 ROM and RWTS read those bytes at `$C0nC`. This card does not shift
 * a bit stream. The read loop polls the data register twice per byte; the poll in between reads
 * zero, so `BPL` waits, and the next poll is the byte with its high bit set.
 *
 * The ROM is the caller's. microM8's `apple2-plus` profile has the 16-sector boot ROM at `$C600`.
 */

/** The disk byte for each 6-bit value. The same table `woz.ts` reads real disks with. */
const WRITE62 = [
	0x96, 0x97, 0x9a, 0x9b, 0x9d, 0x9e, 0x9f, 0xa6, 0xa7, 0xab, 0xac, 0xad, 0xae, 0xaf, 0xb2, 0xb3,
	0xb4, 0xb5, 0xb6, 0xb7, 0xb9, 0xba, 0xbb, 0xbc, 0xbd, 0xbe, 0xbf, 0xcb, 0xcd, 0xce, 0xcf, 0xd3,
	0xd6, 0xd7, 0xd9, 0xda, 0xdb, 0xdc, 0xdd, 0xde, 0xdf, 0xe5, 0xe6, 0xe7, 0xe9, 0xea, 0xeb, 0xec,
	0xed, 0xee, 0xef, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff,
];

const DECODE62 = new Int16Array(256).fill(-1);
WRITE62.forEach((n, i) => (DECODE62[n] = i));

/**
 * Logical DOS sector stored under each address-field sector. The boot sector's translate table
 * is this map inverted, and it is the map `woz.ts` uses for a real track.
 */
const PHYSICAL_TO_DOS = [0, 7, 14, 6, 13, 5, 12, 4, 11, 3, 10, 2, 9, 1, 8, 15];

/**
 * Quarter-tracks the arm moves when phase `y` turns on while phase `x` was the last one on.
 * Two steps of a neighbour are one track. The boot ROM walks the phases backwards from `$50`.
 */
const STEP = [
	[0, 2, 4, -2],
	[-2, 0, 2, 4],
	[-4, -2, 0, 2],
	[2, -4, -2, 0],
];

/** About a second at 1.023 MHz. `$C0n8` arms this; `$C0n9` cancels it. */
const SPINDOWN = 1_023_000;

const TRACKS = 35;
const LAST_ARM = TRACKS * 4 - 1;

/** 256 bytes to the 343 disk bytes of a data field, checksum included. */
export function encode62(src: Uint8Array): Uint8Array {
	const buf = new Uint8Array(342);
	for (let i = 0; i < 256; i++) {
		const b = src[i] ?? 0;
		buf[86 + i] = b >> 2;
		const pair = ((b & 1) << 1) | ((b >> 1) & 1);
		const aux = i % 86;
		buf[aux] = (buf[aux] ?? 0) | (pair << (Math.floor(i / 86) * 2));
	}
	const out = new Uint8Array(343);
	let prev = 0;
	for (let i = 0; i < 342; i++) {
		const six = buf[i] ?? 0;
		out[i] = WRITE62[prev ^ six] ?? 0;
		prev = six;
	}
	out[342] = WRITE62[prev] ?? 0;
	return out;
}

/** The 256 bytes of a data field, or null when a byte or the checksum is wrong. */
export function decode62(nib: Uint8Array): Uint8Array | null {
	if (nib.length < 343) return null;
	const buf = new Uint8Array(343);
	let last = 0;
	for (let i = 0; i < 343; i++) {
		const v = DECODE62[nib[i] ?? 0] ?? -1;
		if (v < 0) return null;
		last ^= v;
		buf[i] = last;
	}
	if (last !== 0) return null;
	const out = new Uint8Array(256);
	for (let i = 0; i < 256; i++) {
		const low = ((buf[i % 86] ?? 0) >> (Math.floor(i / 86) * 2)) & 3;
		out[i] = ((buf[86 + i] ?? 0) << 2) | ((low & 1) << 1) | (low >> 1);
	}
	return out;
}

const fourAndFour = (value: number) => [(value >> 1) | 0xaa, value | 0xaa];

function volumeOf(dos: Uint8Array): number {
	const v = dos.subarray(17 * 4096, 17 * 4096 + 256);
	if (v[3] === 3 && v[0x34] === 35 && v[0x35] === 16) return v[6] ?? 254;
	return 254;
}

/** One track of disk bytes for each of the 35 tracks in a DOS-ordered 140K image. */
export function sectorTracks(dosOrdered: Uint8Array, volume = volumeOf(dosOrdered)): Uint8Array[] {
	const tracks: Uint8Array[] = [];
	for (let track = 0; track < TRACKS; track++) {
		const parts: number[] = [];
		const sync = (n: number) => {
			for (let i = 0; i < n; i++) parts.push(0xff);
		};
		for (let physical = 0; physical < 16; physical++) {
			sync(24);
			parts.push(0xd5, 0xaa, 0x96);
			const sum = volume ^ track ^ physical;
			for (const v of [volume, track, physical, sum]) parts.push(...fourAndFour(v));
			parts.push(0xde, 0xaa, 0xeb);
			sync(6);
			parts.push(0xd5, 0xaa, 0xad);
			const logical = PHYSICAL_TO_DOS[physical] ?? 0;
			const at = (track * 16 + logical) * 256;
			parts.push(...encode62(dosOrdered.subarray(at, at + 256)));
			parts.push(0xde, 0xaa, 0xeb);
		}
		sync(32);
		tracks.push(Uint8Array.from(parts));
	}
	return tracks;
}

/** Write whatever sectors a track still holds back into a DOS-ordered image. Returns how many. */
export function readTracks(tracks: Uint8Array[], into: Uint8Array): number {
	let found = 0;
	for (let track = 0; track < tracks.length && track < TRACKS; track++) {
		const b = tracks[track];
		if (!b) continue;
		for (let i = 0; i + 20 < b.length; i++) {
			if (b[i] !== 0xd5 || b[i + 1] !== 0xaa || b[i + 2] !== 0x96) continue;
			const f = (k: number) => (((b[i + 3 + k * 2] ?? 0) << 1) | 1) & (b[i + 4 + k * 2] ?? 0);
			const trk = f(1);
			const sec = f(2);
			if ((f(0) ^ trk ^ sec) !== f(3) || trk !== track || sec > 15) continue;
			for (let j = i + 11; j < i + 60 && j + 346 < b.length; j++) {
				if (b[j] !== 0xd5 || b[j + 1] !== 0xaa || b[j + 2] !== 0xad) continue;
				const data = decode62(b.subarray(j + 3, j + 346));
				if (data) {
					into.set(data, (track * 16 + (PHYSICAL_TO_DOS[sec] ?? 0)) * 256);
					found += 1;
				}
				break;
			}
		}
	}
	return found;
}

interface Drive {
	dos: Uint8Array | null;
	tracks: Uint8Array[];
	order: Order;
	arm: number;
	phase: number;
	head: number;
	protected: boolean;
	dirty: boolean;
}

const emptyDrive = (): Drive => ({
	dos: null,
	tracks: [],
	order: "dos",
	arm: 0,
	phase: 0,
	head: 0,
	protected: false,
	dirty: false,
});

export class DiskII implements Card {
	readonly rom: Uint8Array;
	/** The selected drive, 1 or 2. */
	drive = 1;
	motor = false;
	private spinDown = 0;
	private q7 = false;
	private latch = 0;
	private bus = 0;
	/** The poll between bytes. Zero until a data read has returned zero once. */
	private skip = 0;
	private readonly drives: [Drive, Drive] = [emptyDrive(), emptyDrive()];

	/** Where the selected drive's arm is, in the quarter or half steps it moves by. */
	get head(): number {
		return this.drives[this.drive - 1]?.arm ?? 0;
	}

	constructor(rom: Uint8Array) {
		if (rom.length !== 0x100) throw new Error(`Disk II ROM is ${rom.length} bytes; the card takes 256`);
		this.rom = rom.slice();
	}

	/** Put a 140K sector image in drive 1 or 2. */
	insert(drive: 1 | 2, file: Uint8Array, name = ""): void {
		const opened = openImage(file, name);
		if (opened.blocks.length !== IMAGE_140K) throw new Error(`the Disk II takes a 140K disk, not ${opened.blocks.length} bytes`);
		const dos = dosOrder(opened.blocks);
		const slot = this.drives[drive - 1]!;
		slot.dos = dos;
		slot.tracks = sectorTracks(dos);
		slot.order = opened.order;
		slot.head = 0;
		slot.protected = opened.twoImg?.locked ?? false;
		slot.dirty = false;
	}

	/** The write-protect tab on drive 1 or 2. */
	protect(drive: 1 | 2, on: boolean): void {
		this.drives[drive - 1]!.protected = on;
	}

	/** The image in the order it was inserted, after any sectors the drive has written. */
	image(drive: 1 | 2 = 1): Uint8Array | null {
		const slot = this.drives[drive - 1]!;
		if (!slot.dos) return null;
		this.flush(slot);
		return slot.order === "dos" ? slot.dos.slice() : blockOrder(slot.dos);
	}

	readSwitch(offset: number, cycles: number): number | null {
		this.catchUp(cycles);
		this.side(offset, cycles);
		if (offset & 1) return null;
		return this.latch;
	}

	writeSwitch(offset: number, value: number, cycles: number): void {
		this.catchUp(cycles);
		this.side(offset, cycles);
		this.bus = value & 0xff;
	}

	private side(offset: number, cycles: number): void {
		const phase = offset >> 1;
		if (phase < 4) {
			if (this.motor && offset & 1) this.step(phase);
			return;
		}
		if (offset === 0x8) {
			if (this.motor) this.spinDown = cycles + SPINDOWN;
			return;
		}
		if (offset === 0x9) {
			this.spinDown = 0;
			if (!this.motor) this.skip = 0;
			this.motor = true;
			return;
		}
		if (offset === 0xa || offset === 0xb) {
			this.drive = offset === 0xa ? 1 : 2;
			return;
		}
		if (offset === 0xc) this.pulse();
		else if (offset === 0xd) this.load();
		else if (offset === 0xe) this.q7 = false;
		else if (offset === 0xf) this.q7 = true;
	}

	/** `$C0n8` counts down from the access that armed it. A later access notices. */
	private catchUp(cycles: number): void {
		if (!this.spinDown || cycles < this.spinDown) return;
		this.spinDown = 0;
		this.motor = false;
		this.flush(this.drives[0]);
		this.flush(this.drives[1]);
	}

	private flush(slot: Drive): void {
		if (!slot.dirty || !slot.dos) return;
		readTracks(slot.tracks, slot.dos);
		slot.dirty = false;
	}

	private step(phase: number): void {
		const slot = this.drives[this.drive - 1]!;
		const before = slot.arm >> 2;
		slot.arm += STEP[slot.phase]![phase] ?? 0;
		if (slot.arm < 0) slot.arm = 0;
		if (slot.arm > LAST_ARM) slot.arm = LAST_ARM;
		slot.phase = phase;
		if (slot.arm >> 2 !== before) slot.head = 0;
	}

	/** Q6L. Every other read while reading is a zero; writing stores on every one. */
	private pulse(): void {
		const slot = this.drives[this.drive - 1]!;
		const deliver = this.skip !== 0 || this.q7;
		this.skip = (this.skip + 1) & 1;
		const track = this.motor ? slot.tracks[slot.arm >> 2] : undefined;
		if (!track || !track.length) {
			this.latch = 0;
			return;
		}
		if (!deliver) {
			this.latch = 0;
			return;
		}
		if (slot.head >= track.length) slot.head = 0;
		if (this.q7) {
			if (!slot.protected) {
				track[slot.head] = this.bus & 0xff;
				slot.dirty = true;
			}
		} else this.latch = track[slot.head] ?? 0;
		slot.head += 1;
	}

	/** Q6H. In read mode the next even read is `$FF` when the disk is write protected. */
	private load(): void {
		if (this.q7) return;
		const slot = this.drives[this.drive - 1]!;
		this.latch = slot.protected ? 0xff : (this.latch >> 1) & 0xff;
	}
}
