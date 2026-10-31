// Apple DOS 3.3 volumes in DOS-order .dsk images: the VTOC at track 17 sector 0, the catalog
// chain it points to, and each file's track/sector list (Beneath Apple DOS, chapter 4).

export const DOS_TYPES: Record<number, string> = { 0: "T", 1: "I", 2: "A", 4: "B", 8: "S", 16: "R", 32: "a", 64: "b" };

export interface DosEntry {
	name: string;
	type: string;
	locked: boolean;
	sectors: number;
	/** Track and sector of the file's first track/sector list. */
	tsl: [number, number];
	/** Where the catalog entry is: catalog track, sector, entry 0-6. */
	at: [number, number, number];
	deleted: boolean;
}

export class Dos33Volume {
	readonly image: Uint8Array;
	readonly volume: number;
	readonly entries: DosEntry[] = [];

	constructor(image: Uint8Array) {
		this.image = image;
		const vtoc = this.sector(17, 0);
		if (vtoc[3] !== 3) throw new Error(`no DOS 3.3 VTOC at 17/0 (version byte ${vtoc[3]})`);
		this.volume = vtoc[6] ?? 0;
		let [t, s] = [vtoc[1] ?? 0, vtoc[2] ?? 0];
		const seen = new Set<string>();
		while ((t || s) && !seen.has(`${t}.${s}`) && t < 35 && s < 16) {
			seen.add(`${t}.${s}`);
			const c = this.sector(t, s);
			for (let e = 0; e < 7; e++) {
				const o = 0x0b + e * 35;
				const first = c[o] ?? 0;
				if (first === 0) continue;
				const deleted = first === 0xff;
				const kind = c[o + 2] ?? 0;
				const name = String.fromCharCode(...c.subarray(o + 3, o + 3 + 30).map((x) => x & 0x7f)).trimEnd();
				this.entries.push({
					name: deleted ? name.slice(0, -1).trimEnd() : name,
					type: DOS_TYPES[kind & 0x7f] ?? `$${(kind & 0x7f).toString(16)}`,
					locked: (kind & 0x80) !== 0,
					sectors: (c[o + 33] ?? 0) | ((c[o + 34] ?? 0) << 8),
					tsl: [deleted ? (c[o + 32] ?? 0) : first, c[o + 1] ?? 0],
					at: [t, s, e],
					deleted,
				});
			}
			[t, s] = [c[1] ?? 0, c[2] ?? 0];
		}
	}

	sector(track: number, sector: number): Uint8Array {
		const o = track * 4096 + sector * 256;
		return this.image.subarray(o, o + 256);
	}

	find(name: string): DosEntry | undefined {
		return this.entries.find((e) => !e.deleted && e.name === name);
	}

	/** The track/sector pairs of a file's data, in order; [0, 0] is a hole. */
	sectorsOf(entry: DosEntry): [number, number][] {
		const out: [number, number][] = [];
		let [t, s] = entry.tsl;
		const seen = new Set<string>();
		while ((t || s) && !seen.has(`${t}.${s}`) && t < 35 && s < 16) {
			seen.add(`${t}.${s}`);
			const l = this.sector(t, s);
			for (let i = 0x0c; i < 256; i += 2) out.push([l[i] ?? 0, l[i + 1] ?? 0]);
			[t, s] = [l[1] ?? 0, l[2] ?? 0];
		}
		while (out.length && out[out.length - 1]![0] === 0 && out[out.length - 1]![1] === 0) out.pop();
		return out;
	}

	/** The file's sectors joined, as DOS stores them: B files start with address and length,
	 * A and I files with length, T files run to the first zero. */
	raw(entry: DosEntry | string): Uint8Array {
		const e = typeof entry === "string" ? this.find(entry) : entry;
		if (!e) throw new Error(`${entry} not on volume ${this.volume}`);
		const parts = this.sectorsOf(e);
		const out = new Uint8Array(parts.length * 256);
		parts.forEach(([t, s], i) => (t || s) && out.set(this.sector(t, s), i * 256));
		return out;
	}

	/** A B file's load address and contents. */
	/** `length` is what the header says; `bytes` stops early when the sectors hold less. */
	binary(entry: DosEntry | string): { address: number; length: number; bytes: Uint8Array } {
		const r = this.raw(entry);
		const length = (r[2] ?? 0) | ((r[3] ?? 0) << 8);
		return { address: (r[0] ?? 0) | ((r[1] ?? 0) << 8), length, bytes: r.slice(4, 4 + length) };
	}

	/** Writes a B file: over its own sectors when it exists and fits, bytes past the end left
	 * as they were; otherwise as a new file in free sectors and the first empty catalog slot. */
	writeBinary(name: string, address: number, bytes: Uint8Array, length = bytes.length): void {
		const content = new Uint8Array(4 + bytes.length);
		content.set([address & 255, address >> 8, length & 255, length >> 8]);
		content.set(bytes, 4);
		const e = this.find(name);
		if (e) {
			const parts = this.sectorsOf(e);
			if (parts.length * 256 >= content.length && parts.every(([t, s]) => t || s)) {
				parts.forEach(([t, s], i) => {
					const chunk = content.subarray(i * 256, (i + 1) * 256);
					if (chunk.length) this.sector(t, s).set(chunk);
				});
				return;
			}
			throw new Error(`${name} has ${parts.length} sectors, ${Math.ceil(content.length / 256)} needed`);
		}
		const n = Math.ceil(content.length / 256);
		if (n > 122) throw new Error(`${name}: one track/sector list holds 122 sectors`);
		const free = this.allocate(n + 1);
		const [tslT, tslS] = free[0]!;
		const tsl = this.sector(tslT, tslS);
		tsl.fill(0);
		free.slice(1).forEach(([t, s], i) => {
			tsl.set([t, s], 0x0c + i * 2);
			const d = this.sector(t, s);
			d.fill(0);
			d.set(content.subarray(i * 256, (i + 1) * 256));
		});
		const slot = this.emptySlot();
		const c = this.sector(slot[0], slot[1]);
		const o = 0x0b + slot[2] * 35;
		c.set([tslT, tslS, 4], o);
		for (let i = 0; i < 30; i++) c[o + 3 + i] = (name.charCodeAt(i) || 0x20) | 0x80;
		c.set([(n + 1) & 255, (n + 1) >> 8], o + 33);
		this.entries.push({ name, type: "B", locked: false, sectors: n + 1, tsl: [tslT, tslS], at: slot, deleted: false });
	}

	/** Takes `n` free sectors from the VTOC bitmap, skipping track 17. */
	private allocate(n: number): [number, number][] {
		const vtoc = this.sector(17, 0);
		const out: [number, number][] = [];
		for (let t = 34; t >= 0 && out.length < n; t--) {
			if (t === 17) continue;
			for (let s = 15; s >= 0 && out.length < n; s--) {
				const byte = 0x38 + t * 4 + (s >= 8 ? 0 : 1), bit = 1 << (s & 7);
				if ((vtoc[byte] ?? 0) & bit) {
					vtoc[byte] = (vtoc[byte] ?? 0) & ~bit;
					out.push([t, s]);
				}
			}
		}
		if (out.length < n) throw new Error(`disk full: ${n} sectors needed`);
		return out;
	}

	private emptySlot(): [number, number, number] {
		const vtoc = this.sector(17, 0);
		let [t, s] = [vtoc[1] ?? 0, vtoc[2] ?? 0];
		const seen = new Set<string>();
		while ((t || s) && !seen.has(`${t}.${s}`) && t < 35 && s < 16) {
			seen.add(`${t}.${s}`);
			const c = this.sector(t, s);
			for (let e = 0; e < 7; e++) if (c[0x0b + e * 35] === 0) return [t, s, e];
			[t, s] = [c[1] ?? 0, c[2] ?? 0];
		}
		throw new Error("catalog full");
	}

	/** A T file as text, high bits cleared, carriage returns as newlines. */
	text(entry: DosEntry | string): string {
		const r = this.raw(entry);
		const end = r.indexOf(0);
		return String.fromCharCode(...r.subarray(0, end < 0 ? r.length : end).map((x) => x & 0x7f)).replace(/\r/g, "\n");
	}
}
