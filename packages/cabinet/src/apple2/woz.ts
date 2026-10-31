// WOZ 1 and 2 flux images of 5.25" disks, decoded to a 140K image in DOS 3.3 sector order.
// Each track is a bit stream; nibbles are read the way the Disk II's sequencer reads them
// (shift bits in until the top bit is set). A sector is an address field (D5 AA 96, then
// volume, track, sector, checksum in 4-and-4) and a data field (D5 AA AD, 342 nibbles and a
// checksum in 6-and-2). Copy-protected tracks that don't follow that format are left zeroed
// and reported.

const PHYSICAL_TO_DOS = [0, 7, 14, 6, 13, 5, 12, 4, 11, 3, 10, 2, 9, 1, 8, 15];

const DECODE62 = (() => {
	const t = new Int16Array(256).fill(-1);
	const write = [
		0x96, 0x97, 0x9a, 0x9b, 0x9d, 0x9e, 0x9f, 0xa6, 0xa7, 0xab, 0xac, 0xad, 0xae, 0xaf, 0xb2, 0xb3,
		0xb4, 0xb5, 0xb6, 0xb7, 0xb9, 0xba, 0xbb, 0xbc, 0xbd, 0xbe, 0xbf, 0xcb, 0xcd, 0xce, 0xcf, 0xd3,
		0xd6, 0xd7, 0xd9, 0xda, 0xdb, 0xdc, 0xdd, 0xde, 0xdf, 0xe5, 0xe6, 0xe7, 0xe9, 0xea, 0xeb, 0xec,
		0xed, 0xee, 0xef, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff,
	];
	write.forEach((n, i) => (t[n] = i));
	return t;
})();

export interface WozDecode {
	image: Uint8Array;
	/** Sectors not found, as "track.sector". */
	missing: string[];
}

function u32(b: Uint8Array, o: number): number {
	return ((b[o] ?? 0) | ((b[o + 1] ?? 0) << 8) | ((b[o + 2] ?? 0) << 16) | ((b[o + 3] ?? 0) << 24)) >>> 0;
}

function u16(b: Uint8Array, o: number): number {
	return (b[o] ?? 0) | ((b[o + 1] ?? 0) << 8);
}

/** The track's bit stream, for whole tracks 0-34. */
function trackBits(woz: Uint8Array, track: number): { bits: Uint8Array; count: number } | undefined {
	const version = String.fromCharCode(...woz.subarray(0, 4));
	if (version !== "WOZ1" && version !== "WOZ2") throw new Error(`not a WOZ image: ${version}`);
	const chunks = new Map<string, number>();
	for (let o = 12; o + 8 <= woz.length; ) {
		const id = String.fromCharCode(...woz.subarray(o, o + 4));
		const size = u32(woz, o + 4);
		chunks.set(id, o + 8);
		o += 8 + size;
	}
	const tmap = chunks.get("TMAP"), trks = chunks.get("TRKS");
	if (tmap === undefined || trks === undefined) throw new Error("WOZ image without TMAP or TRKS");
	const index = woz[tmap + track * 4] ?? 0xff;
	if (index === 0xff) return undefined;
	if (version === "WOZ1") {
		const at = trks + index * 6656;
		return { bits: woz.subarray(at, at + 6646), count: u16(woz, at + 6648) };
	}
	const entry = trks + index * 8;
	const start = u16(woz, entry) * 512, blocks = u16(woz, entry + 2);
	return { bits: woz.subarray(start, start + blocks * 512), count: u32(woz, entry + 4) };
}

/** Nibbles from a bit stream, read twice around so sectors crossing the index are whole. */
function nibbles(bits: Uint8Array, count: number): number[] {
	const out: number[] = [];
	let shift = 0;
	for (let i = 0; i < count * 2; i++) {
		const k = i % count;
		const bit = ((bits[k >> 3] ?? 0) >> (7 - (k & 7))) & 1;
		if (shift === 0 && !bit) continue;
		shift = (shift << 1) | bit;
		if (shift & 0x80) {
			out.push(shift);
			shift = 0;
		}
	}
	return out;
}

const fourAndFour = (a: number, b: number) => ((a << 1) | 1) & b;

function decodeData(n: number[], at: number): Uint8Array | undefined {
	const buf = new Uint8Array(343);
	let last = 0;
	for (let i = 0; i < 343; i++) {
		const v = DECODE62[n[at + i] ?? 0] ?? -1;
		if (v < 0) return undefined;
		last ^= v;
		buf[i] = last;
	}
	if (last !== 0) return undefined;
	const out = new Uint8Array(256);
	for (let i = 0; i < 256; i++) {
		const aux = buf[i % 86] ?? 0;
		const shift = Math.floor(i / 86) * 2;
		const low = (aux >> shift) & 3;
		out[i] = ((buf[86 + i] ?? 0) << 2) | ((low & 1) << 1) | (low >> 1);
	}
	return out;
}

export function wozToDsk(woz: Uint8Array): WozDecode {
	const image = new Uint8Array(35 * 16 * 256);
	const missing: string[] = [];
	for (let track = 0; track < 35; track++) {
		const found = new Set<number>();
		const t = trackBits(woz, track);
		if (t) {
			const n = nibbles(t.bits, t.count);
			for (let i = 0; i + 14 < n.length; i++) {
				if (n[i] !== 0xd5 || n[i + 1] !== 0xaa || n[i + 2] !== 0x96) continue;
				const f = (k: number) => fourAndFour(n[i + 3 + k * 2] ?? 0, n[i + 4 + k * 2] ?? 0);
				const vol = f(0), trk = f(1), sec = f(2), sum = f(3);
				if ((vol ^ trk ^ sec) !== sum || trk !== track || sec > 15 || found.has(sec)) continue;
				for (let j = i + 11; j < i + 11 + 40 && j + 345 < n.length; j++) {
					if (n[j] !== 0xd5 || n[j + 1] !== 0xaa || n[j + 2] !== 0xad) continue;
					const data = decodeData(n, j + 3);
					if (data) {
						image.set(data, (track * 16 + (PHYSICAL_TO_DOS[sec] ?? 0)) * 256);
						found.add(sec);
					}
					break;
				}
			}
		}
		for (let s = 0; s < 16; s++) if (!found.has(s)) missing.push(`${track}.${s}`);
	}
	return { image, missing };
}
