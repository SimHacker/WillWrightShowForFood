# Upload from an Apple ][ to Unix, May 1990

Files from Don's `a2/upload` directory, all dated May 25, 1990. Two days earlier Rich Skrenta had
posted *a2*, an Apple II emulator in C, to alt.sources (Message-ID `<122@blekko.UUCP>`, May 23,
1990), writing: "I can't post the ROM images, they're copyrighted, so keep in mind that you'll need
them before you can do anything interesting with the emulator." These files are the other end of
that: Apple memory and disk blocks, typed out over a terminal line from a real Apple and captured
on the Unix side.

| File | What it is |
|------|-----------|
| [`snarf.f`](snarf.f) | Don's Forth word `up`, written in `hex`. For blocks `$0` to `$998` it reads a ProDOS block from unit `$60` (slot 6, drive 1) into a `$200`-byte buffer and `dump`s it, stopping at the first read error. Between blocks it services the terminal (`mbuff>`, `>term`, `?update-videx`), and it brackets each read with `vidoff` and `vidon`. |
| [`forth`](forth) | A capture of `up` running: the Forth `Ok.` prompt, then the dumps of blocks 0 to 4. |
| [`apple.1`](apple.1), [`auto.1`](auto.1), [`disk.1`](disk.1) | Listings, in the Apple Monitor's `addr- bytes` format, of the Applesoft BASIC ROM (from `$D000`), the Autostart Monitor ROM (from `$F800`) and the Disk II boot PROM (from `$C600`). |

The original directory also had `term`, a symlink to `/u/forth/pforth/term`, which no longer
resolves.

The disks this Forth ran from are one level up: [`../forth.dsk`](../forth.dsk) and
[`../f.dsk`](../f.dsk) (ProDOS volume `/H19`, May 30, 1990).
