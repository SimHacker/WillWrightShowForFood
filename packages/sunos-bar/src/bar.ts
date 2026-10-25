/**
 * Reading SunOS 4 bar archives ("Backup Archival Program", bar(1), derived from tar).
 *
 * The layout, as SunOS 4.1's bar.c reads it:
 *
 *   A bar archive is a run of 512-byte blocks. Each file is a header block, then its data rounded
 *   up to whole blocks. The header's first 65 bytes are tar's: mode, uid, gid, size, mtime,
 *   checksum and rdev as octal ASCII, then a link flag. Then come fields only the volume header
 *   uses (zero in file headers):
 *
 *     offset  size  field
 *     0       8     mode
 *     8       8     uid
 *     16      8     gid
 *     24      12    size        bytes of data that follow (as stored, so compressed size)
 *     36      12    mtime       seconds since 1970
 *     48      8     chksum      sum of the 512 header bytes, chksum counted as spaces
 *     56      8     rdev        device number of a special file
 *     64      1     linkflag    '0' file, '1' hard link, '2' symlink, '3' special file
 *     65      2     bar_magic   'V' in a volume header
 *     67      4     volume_num  volume number, ASCII
 *     71      1     compressed  '1' if files on this volume were compressed with compress(1)
 *     72      12    date        when the archive was made, ASCII
 *     84      ...   the name, NUL-terminated, then the link name, NUL-terminated
 *
 *   Unlike tar, names have no fixed field: they start at byte 84 and, if they don't fit in the
 *   header, run on into the following blocks. A volume header ('V' at byte 65) starts each volume,
 *   with the archive's label where a file header has its name. The archive ends at a header whose
 *   name is empty.
 *
 * bar.c computes the checksum with char, which was signed on the 68000 and SPARC, so bytes of 128
 * and above count as negative. Both readings are accepted.
 */

import { isCompressed, uncompress } from "./lzw.js";

export const BLOCK = 512;
const NAME_AT = 84;

export type BarKind = "file" | "directory" | "hardlink" | "symlink" | "special";

export interface BarVolume {
	/** Byte offset of the volume header in the input. */
	offset: number;
	volume: number;
	/** Files on this volume were compressed with compress(1) when they were archived. */
	compressed: boolean;
	/** The archive date as written, mmddhhmm plus whatever followed it. */
	date: string;
	/** The volume's label, if the archive was given one. */
	label: string;
}

export interface BarEntry {
	/** Byte offset of the header in the input. */
	offset: number;
	name: string;
	/** Target of a hard link or symlink. */
	linkName: string;
	kind: BarKind;
	mode: number;
	uid: number;
	gid: number;
	/** Bytes stored on tape. For a compressed file, the compressed size. */
	size: number;
	mtime: Date;
	rdev: number;
	/** The checksum matched (signed or unsigned reading). */
	checksumOk: boolean;
	/** The data is compress(1) output: on a compressed volume and starting with 1f 9d. */
	compressed: boolean;
	/** The volume this entry is on. */
	volume: BarVolume | null;
	/** The bytes as stored. */
	raw: Uint8Array;
	/** The file's contents, uncompressed if it was stored compressed. */
	contents(): Uint8Array;
}

export interface BarWarning {
	offset: number;
	message: string;
}

export interface BarArchive {
	volumes: BarVolume[];
	entries: BarEntry[];
	warnings: BarWarning[];
	/** Offset just past the end-of-archive header, or the end of input if none was found. */
	end: number;
}

const ascii = new TextDecoder("latin1");

function field(block: Uint8Array, at: number, len: number): string {
	let s = "";
	for (let i = at; i < at + len; i++) {
		const c = block[i] as number;
		if (c === 0) break;
		s += String.fromCharCode(c);
	}
	return s;
}

function octal(block: Uint8Array, at: number, len: number): number {
	const s = field(block, at, len).trim();
	if (s === "") return 0;
	if (!/^[0-7]+$/.test(s)) return Number.NaN;
	return parseInt(s, 8);
}

/** The two checksums bar could have written: bytes summed as unsigned, and as signed char. */
export function headerChecksums(block: Uint8Array): { unsigned: number; signed: number } {
	let unsigned = 0;
	let signed = 0;
	for (let i = 0; i < BLOCK; i++) {
		const c = i >= 48 && i < 56 ? 0x20 : (block[i] as number);
		unsigned += c;
		signed += c > 127 ? c - 256 : c;
	}
	return { unsigned, signed };
}

function isZero(block: Uint8Array): boolean {
	for (let i = 0; i < block.length; i++) if (block[i] !== 0) return false;
	return true;
}

/**
 * Read a NUL-terminated string starting at `pos`, running on into following blocks if needed.
 * Returns the string and the position just past its NUL.
 */
function readName(data: Uint8Array, pos: number): { text: string; next: number } {
	let end = pos;
	while (end < data.length && data[end] !== 0) end++;
	return { text: ascii.decode(data.subarray(pos, end)), next: end + 1 };
}

function kindOf(linkflag: number, mode: number, name: string): BarKind {
	// bar.c writes '3' for block, character and FIFO devices, but the 1992 Turing Institute tape
	// also has seven directories flagged '3' with junk in rdev. The mode is the better witness.
	if (linkflag === 0x33 && (mode & 0o170000) === 0o040000) return "directory";
	switch (String.fromCharCode(linkflag)) {
		case "1":
			return "hardlink";
		case "2":
			return "symlink";
		case "3":
			return "special";
	}
	if ((mode & 0o170000) === 0o040000 || name.endsWith("/")) return "directory";
	return "file";
}

function checksumAt(data: Uint8Array, pos: number): { ok: boolean; stored: number; unsigned: number; signed: number } {
	const block = data.subarray(pos, pos + BLOCK);
	const stored = octal(block, 48, 8);
	const sums = headerChecksums(block);
	return { ok: stored === sums.unsigned || stored === sums.signed, stored, ...sums };
}

/**
 * Options for readBar.
 *
 * resync: when the block where a header should be fails its checksum, look for the nearest block
 * that is a valid header, starting `lookBack` blocks before the expected position (but never
 * inside the previous header), and carry on from there. The previous file is cut to the bytes
 * actually on tape. This is how a file that changed size while bar was copying it, or a damaged
 * stretch of tape, is read past. Off, the reader stops at the first bad header.
 */
export interface ReadBarOptions {
	resync?: boolean;
	lookBack?: number;
}

export function readBar(data: Uint8Array, options: ReadBarOptions = {}): BarArchive {
	const resync = options.resync ?? true;
	const lookBack = options.lookBack ?? 64;
	const volumes: BarVolume[] = [];
	const entries: BarEntry[] = [];
	const warnings: BarWarning[] = [];
	let volume: BarVolume | null = null;
	let pos = 0;
	/** Where the previous entry's data began, so a resync can cut it short. */
	let prev: { entry: BarEntry; dataStart: number } | null = null;

	while (pos + BLOCK <= data.length) {
		let block = data.subarray(pos, pos + BLOCK);
		if (isZero(block)) {
			// An all-zero block is end of archive, as in tar.
			return { volumes, entries, warnings, end: pos + BLOCK };
		}

		let check = checksumAt(data, pos);
		if (!check.ok && resync) {
			const floor = prev ? prev.dataStart : 0;
			let found = -1;
			for (let p = Math.max(floor, pos - lookBack * BLOCK); p + BLOCK <= data.length; p += BLOCK) {
				if (p !== pos && !isZero(data.subarray(p, p + BLOCK)) && checksumAt(data, p).ok) {
					found = p;
					break;
				}
			}
			if (found < 0) {
				warnings.push({ offset: pos, message: "bad header and no valid header after it; stopping" });
				return { volumes, entries, warnings, end: pos };
			}
			if (prev && found < pos) {
				// Blocks are missing from the previous file: dropped by the tape read, or the file
				// shrank while bar copied it. Either way the file's last block was still the last
				// written, so its length is the stated size less the missing blocks.
				const e = prev.entry;
				const onTape = Math.max(0, found - prev.dataStart);
				const missing = Math.ceil(e.size / BLOCK) - onTape / BLOCK;
				const length = Math.max(0, Math.min(onTape, e.size - missing * BLOCK));
				warnings.push({
					offset: e.offset,
					message: `${e.name}: ${missing} block(s) missing (header says ${e.size} bytes, ${onTape} on tape before the next header); kept ${length} bytes`,
				});
				const raw = data.subarray(prev.dataStart, prev.dataStart + length);
				const z = e.compressed;
				e.raw = raw;
				e.contents = () => (z ? uncompress(raw) : raw);
			} else {
				warnings.push({ offset: pos, message: `skipped ${found - pos} bytes of unreadable data` });
			}
			pos = found;
			block = data.subarray(pos, pos + BLOCK);
			check = checksumAt(data, pos);
		}
		const stored = check.stored;
		const sums = check;
		const checksumOk = check.ok;

		if (block[65] === 0x56 /* 'V' */) {
			const label = readName(data, pos + NAME_AT);
			volume = {
				offset: pos,
				volume: parseInt(field(block, 67, 4), 10) || 0,
				compressed: block[71] === 0x31 /* '1' */,
				date: field(block, 72, 12),
				label: label.text,
			};
			volumes.push(volume);
			prev = null;
			if (!checksumOk) warnings.push({ offset: pos, message: `volume header checksum ${stored}, computed ${sums.unsigned} or ${sums.signed}` });
			pos += Math.max(BLOCK, Math.ceil((label.next - pos) / BLOCK) * BLOCK);
			continue;
		}

		const name = readName(data, pos + NAME_AT);
		if (name.text === "") return { volumes, entries, warnings, end: pos + BLOCK };
		const link = readName(data, name.next);
		const headerEnd = pos + Math.max(BLOCK, Math.ceil((link.next - pos) / BLOCK) * BLOCK);

		const mode = octal(block, 0, 8);
		const linkflag = block[64] as number;
		const kind = kindOf(linkflag, mode, name.text);
		let size = octal(block, 24, 12);
		if (!Number.isFinite(size) || size < 0) {
			warnings.push({ offset: pos, message: `unreadable size field "${field(block, 24, 12)}"` });
			size = 0;
		}
		if (!checksumOk) warnings.push({ offset: pos, message: `${name.text}: header checksum ${stored}, computed ${sums.unsigned} or ${sums.signed}` });

		// A hard link has no data on tape, whatever its size field says (bar.c's passtape).
		const dataBytes = kind === "hardlink" ? 0 : size;
		const dataEnd = headerEnd + Math.ceil(dataBytes / BLOCK) * BLOCK;
		if (headerEnd + dataBytes > data.length) {
			warnings.push({ offset: pos, message: `${name.text}: truncated, ${dataBytes} bytes promised, ${Math.max(0, data.length - headerEnd)} present` });
		}
		const raw = data.subarray(headerEnd, Math.min(headerEnd + dataBytes, data.length));
		const compressed = (volume?.compressed ?? false) && kind === "file" && isCompressed(raw);

		const entry: BarEntry = {
			offset: pos,
			name: name.text,
			linkName: link.text,
			kind,
			mode: Number.isFinite(mode) ? mode : 0,
			uid: octal(block, 8, 8) || 0,
			gid: octal(block, 16, 8) || 0,
			size,
			mtime: new Date((octal(block, 36, 12) || 0) * 1000),
			rdev: octal(block, 56, 8) || 0,
			checksumOk,
			compressed,
			volume,
			raw,
			contents: () => (compressed ? uncompress(raw) : raw),
		};
		entries.push(entry);
		prev = { entry, dataStart: headerEnd };
		pos = dataEnd;
	}
	return { volumes, entries, warnings, end: data.length };
}

/** A line per entry, in the style of `tar tv`. */
export function formatListing(entry: BarEntry): string {
	const t = entry.kind === "directory" ? "d" : entry.kind === "symlink" ? "l" : entry.kind === "hardlink" ? "h" : entry.kind === "special" ? "c" : "-";
	const perms = [6, 3, 0]
		.map((s) => {
			const b = (entry.mode >> s) & 7;
			return (b & 4 ? "r" : "-") + (b & 2 ? "w" : "-") + (b & 1 ? "x" : "-");
		})
		.join("");
	const when = entry.mtime.toISOString().slice(0, 16).replace("T", " ");
	const z = entry.compressed ? " Z" : "  ";
	const tail = entry.kind === "symlink" ? ` -> ${entry.linkName}` : entry.kind === "hardlink" ? ` link to ${entry.linkName}` : "";
	return `${t}${perms} ${String(entry.uid).padStart(5)}/${String(entry.gid).padEnd(5)} ${String(entry.size).padStart(9)}${z} ${when} ${entry.name}${tail}`;
}
