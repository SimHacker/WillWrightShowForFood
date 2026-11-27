# ITS on the cabinet's KA10

The PDP-10 page of the Machine Room (`/machine/systems/its/`) boots MIT's ITS on the cabinet's
KA10 (`src/ka10`, the halves rung) in a Web Worker, the way the PDP-10/its project's
`build/build.tcl` boots it on SIMH's `pdp10-ka`: DSKDMP off paper tape, `its`, Altmode G, then
`KA ITS 1652 IN OPERATION`. `catalog.yml` is its entries; `ftp/` is a separate study of ITS's
FTP program.

## What is here

| File | What | sha1 |
| --- | --- | --- |
| `dskdmp.rim` | DSKDMP, the disk loader, on RIM paper tape | `535f0325fb815fef4abc6805c28edc9f9536b177` |
| `hhtest.rim` | MAINT;HHTEST, the build's test of the 340 "hack hack"; passes by halting at 201 | `7d08b2a8ef1980325e6fbcc3da6e0d2abb2035a7` |
| `warm.json` | The pack chunks a boot, a login and each program's start read, which the page fetches first | |

Both tapes are unmodified output of the [PDP-10/its](https://github.com/PDP-10/its) build for
`pdp10-ka`, at commit `f2d00b83d7405c647547eb82e284aa66f3e3da69` (2026-10-13). They are
licensed under the GNU General Public License, version 3 or later, as that repository's
`COPYING` says; the sources are in that repository (`src/system/dskdmp.217`, `src/maint/hhtest.1`).

## The packs

The four RP03 packs are 82,534,400 bytes each, 330 MB together, so they are not in git. They
are the same build's `out/pdp10-ka/rp03.0` to `rp03.3`, unmodified, under the same licence:

| Pack | sha1 |
| --- | --- |
| `rp03.0` | `b4cbc05b4100c38c68faefe6788ed8cfed3b495e` |
| `rp03.1` | `c2936cde9ed1f80de1beb0c905a8e49f769db8f8` |
| `rp03.2` | `5ee23a921a03aea58de481ab33210a94b99b1cfb` |
| `rp03.3` | `429cce2984b9d9799786c2a9961383b7aecef27c` |

On the server they live once, outside every release, in `/data/releases/hyperties/packs/its/`;
`apps/ties/scripts/deploy-app.sh` links each release's `packs` to it, so Caddy serves them at
`/packs/its/rp03.N` with no change to its configuration. `scripts/its-packs-upload.sh` puts
them there. In `vite dev` the app serves them from `ITS_PACKS` (default
`~/GroundUp/git/its/dl/pdp10-ka`).

The worker reads a pack in 32 KB chunks with HTTP Range requests: first the chunks in
`warm.json`, eight at a time, then any other chunk the moment ITS reads it. A boot, a login and
MACSYMA's first prompt read about 6.4 MB. What ITS writes stays in the tab's memory and is gone
when the page is.

`node scripts/ka10-its-warm.mjs` remakes `warm.json` after the packs or the programs change.

## Checked in Node (`scripts/ka10-its.mjs --rung halves --login DON`)

- ITS comes up in 0.9 s of wall time; MACSYMA's `(C1)` in 2.2 s.
- MACSYMA: `diff(x^3,x);`, `factor(2^64-1);`, `integrate(1/(1+x^2),x);` (ATAN(X)), `quit();`.
- MacLisp: answer `Alloc?` with `n`; `(setq base 10. ibase 10. *nopoint t)`, then a factorial
  with `times` gives 30! as 265252859812191058636308480000000. With the fixnum `*`, 20! prints
  `220255_22`, which is not 20! modulo 2^36; not yet compared with SIMH.
- CLOGO: `MAKE "X" 7`, `PRINT PRODUCT :X :X` prints 49; `GOODBYE` logs out.
- HHTEST halts at 201 on both rungs, in 165,016 instructions.
