# PDP-7 UNIX, the platter and the bootstrap

Built from [DoctorWkt/pdp7-unix](https://github.com/DoctorWkt/pdp7-unix), commit `555eb30`, with
`make all` in `build/`:

- `image.fs.gz`: the RB09 platter `image.fs`, gzipped (4,096,000 bytes to 136 KB). It is in SIMH's
  attach format, one little-endian int32 per 18-bit word, 200 tracks × 80 sectors × 64 words.
  It holds the kernel on track 180 and the file system with ken's and dmr's files.
- `boot.rim`: Phil Budne's paper-tape bootstrap, read in at 010000. It reads the system from
  track 180 and jumps to it.

The pdp7-unix README: "The code in the original scans are (c) Micro Focus who own the rights to
the Unix source code. Everything that didn't come from the scanned files is GPLv3." The image is
that project's public source assembled, and it is here so that the web build, which runs on a
server from a git checkout, needs no Perl toolchain. Rebuild it with the command above.

The emulator and the tests: [../../UNIX-V0.md](../../UNIX-V0.md).
