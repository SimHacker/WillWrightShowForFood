# @wwsff/sunos-bar

Reads **bar** archives, the "Backup Archival Program" that came with SunOS 4, from raw dumps of
1/4-inch Sun cartridge tapes. TypeScript, no dependencies, runs in Node or a browser. Lists,
extracts, decompresses files stored with `compress(1)`, and reads past damaged stretches of tape.

bar was Sun's derivative of BSD `tar` for backups to tape and floppy. It keeps tar's first 65 header
bytes but adds a volume header, compression, and names of any length that run on past the header
block, so `tar` can't read it. Solaris `cpio -H bar` reads bar floppies; we found nothing that reads bar
tapes on a Mac or Linux machine. Al Kossow, who reads old tapes for
[bitsavers](http://bitsavers.org/) and the Computer History Museum, confirmed in November 2023
that bar "came with sunos 4".

## Use

```sh
pnpm --filter @wwsff/sunos-bar build
node packages/sunos-bar/dist/cli.js info    tape.dd
node packages/sunos-bar/dist/cli.js list    tape.dd
node packages/sunos-bar/dist/cli.js extract tape.dd out/ [prefix...]
```

```ts
import { readBar, formatListing } from "@wwsff/sunos-bar";

const archive = readBar(bytes);           // Uint8Array of the whole dump
for (const e of archive.entries) console.log(formatListing(e));
const text = archive.entries[3]?.contents(); // uncompressed if it was stored compressed
for (const w of archive.warnings) console.warn(w.offset, w.message);
```

Extraction stays inside the output directory: leading slashes are dropped, names with `..` are
skipped, and symlinks pointing outside become `name.symlink` text files. Device files are listed in
`.bar-special.txt`, not created.

## The format

Every block is 512 bytes. Each file is a header block (or more, for long names) and then its data
rounded up to whole blocks.

| Offset | Size | Field | |
|---|---|---|---|
| 0 | 8 | mode | octal ASCII, as in tar |
| 8 | 8 | uid | |
| 16 | 8 | gid | |
| 24 | 12 | size | bytes stored, so the compressed size for a compressed file |
| 36 | 12 | mtime | seconds since 1970 |
| 48 | 8 | chksum | sum of the 512 header bytes, with this field counted as spaces |
| 56 | 8 | rdev | device number of a special file |
| 64 | 1 | linkflag | `0` file, `1` hard link (no data follows), `2` symlink, `3` device |
| 65 | 2 | bar_magic | `V` in a volume header, zero in a file header |
| 67 | 4 | volume_num | volume header only |
| 71 | 1 | compressed | volume header only: `1` if files were compressed with `compress(1)` |
| 72 | 12 | date | volume header only: when the archive was made |
| 84 | … | name, link name | each NUL-terminated, continuing into the next blocks if needed |

A volume header starts each volume, with the archive's label in the name position. An empty name
or an all-zero block ends the archive.

Two details that matter on real tapes:

- **Signed checksums.** bar.c sums the header as `char`, which was signed on the 68000 and SPARC,
  so bytes of 128 and above count as negative. Both readings are accepted.
- **Compressed files.** On a volume flagged compressed, files whose data begins `1f 9d` were run
  through `compress(1)`. [lzw.ts](src/lzw.ts) decodes them, including compress's habit of padding
  each code-width change to the end of a group of eight codes.

## Reading damaged tapes

When the block where a header should be fails its checksum, the reader looks for the nearest valid
header, from up to 64 blocks back, and carries on from there. The file before it is cut to what's
actually on tape, and a warning says how many blocks are missing. `readBar(bytes, { resync: false })`
stops at the first bad header instead.

## Tested on

- Synthetic archives built the way bar.c writes them: volume headers, long names spilling into a
  second block, hard links, symlinks, devices, signed checksums, a dropped block, a file cut off at
  the end of the tape.
- `uncompress` against `/usr/bin/compress` output for a 680 KB input of text and random bytes, which
  takes the code width to 16 bits.
- A real dump: a 55 MB tape of a Turing Institute home directory archived on 12 November 1992,
  tape 1 of a set. All 1,130 entries read. Files that also appear on a later tape Al read were
  compared byte for byte: 514 are identical, and those that differ are later versions (mail files
  marked read, edited sources). One file was missing a block in the dump. The reader recovered
  everything around it and the result matches the later tape's copy with that block removed. The
  last file runs onto tape 2. Set `SUNOS_BAR_TAPE` to the dump's path to run that test.

## Next

- Read a set of volumes in order, joining a file split across tapes.
- An `--offset` option for dumps with junk before the first volume header.
- A browser drop target in the cabinet's web bench, so a tape dump can be opened in a page.
