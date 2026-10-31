// Commodore 1541 disk images (.d64): 35 tracks of 21, 19, 18 and 17 sectors, the BAM and
// directory on track 18, files as chains of sectors whose first two bytes link the next.

export const SECTORS_PER_TRACK = (track: number): number => (track <= 17 ? 21 : track <= 24 ? 19 : track <= 30 ? 18 : 17);

export const FILE_TYPES = ["DEL", "SEQ", "PRG", "USR", "REL"] as const;

export interface D64Entry {
	name: string;
	type: string;
	closed: boolean;
	locked: boolean;
	track: number;
	sector: number;
	blocks: number;
	at: [number, number, number];
}

export class D64 {
	readonly image: Uint8Array;
	readonly diskName: string;
	readonly diskId: string;
	readonly entries: D64Entry[] = [];

	constructor(image: Uint8Array) {
		if (image.length < 174848) throw new Error(`a 35-track .d64 is 174848 bytes, not ${image.length}`);
		this.image = image;
		const bam = this.sector(18, 0);
		this.diskName = petscii(bam.subarray(0x90, 0xa0));
		this.diskId = petscii(bam.subarray(0xa2, 0xa7));
		let [t, s] = [bam[0] ?? 0, bam[1] ?? 0];
		const seen = new Set<string>();
		while (t && !seen.has(`${t}.${s}`) && t <= 35) {
			seen.add(`${t}.${s}`);
			const d = this.sector(t, s);
			for (let e = 0; e < 8; e++) {
				const o = e * 32, kind = d[o + 2] ?? 0;
				if (kind === 0) continue;
				this.entries.push({
					name: petscii(d.subarray(o + 5, o + 21)),
					type: FILE_TYPES[kind & 7] ?? `?${kind & 7}`,
					closed: (kind & 0x80) !== 0,
					locked: (kind & 0x40) !== 0,
					track: d[o + 3] ?? 0,
					sector: d[o + 4] ?? 0,
					blocks: (d[o + 30] ?? 0) | ((d[o + 31] ?? 0) << 8),
					at: [t, s, e],
				});
			}
			[t, s] = [d[0] ?? 0, d[1] ?? 0];
		}
	}

	offset(track: number, sector: number): number {
		let o = 0;
		for (let t = 1; t < track; t++) o += SECTORS_PER_TRACK(t) * 256;
		return o + sector * 256;
	}

	sector(track: number, sector: number): Uint8Array {
		const o = this.offset(track, sector);
		return this.image.subarray(o, o + 256);
	}

	/** The file's bytes, following the chain; a PRG's first two bytes are its load address. */
	read(entry: D64Entry | string): Uint8Array {
		const e = typeof entry === "string" ? this.entries.find((x) => x.name === entry) : entry;
		if (!e) throw new Error(`${entry} not on ${this.diskName}`);
		const parts: Uint8Array[] = [];
		let [t, s] = [e.track, e.sector];
		const seen = new Set<string>();
		while (t && !seen.has(`${t}.${s}`) && t <= 35) {
			seen.add(`${t}.${s}`);
			const d = this.sector(t, s);
			const [nt, ns] = [d[0] ?? 0, d[1] ?? 0];
			parts.push(nt ? d.subarray(2) : d.subarray(2, Math.max(2, ns + 1)));
			[t, s] = [nt, ns];
		}
		const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
		let o = 0;
		for (const p of parts) (out.set(p, o), (o += p.length));
		return out;
	}
}

/** PETSCII to ASCII for names: shifted space (0xA0) padding dropped, letters as upper case. */
export function petscii(b: Uint8Array): string {
	let s = "";
	for (const x of b) {
		if (x === 0xa0) break;
		const c = x >= 0xc1 && x <= 0xda ? x - 0x80 : x & 0x7f;
		s += c >= 32 && c < 127 ? String.fromCharCode(c) : `{${x.toString(16)}}`;
	}
	return s;
}
