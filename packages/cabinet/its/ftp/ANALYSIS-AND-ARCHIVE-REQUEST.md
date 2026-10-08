# TS FTP: what the binary tells us, what is missing, and where to ask

For Kent Pitman and Henry Minsky. This page records what we recovered from `AI:HUMOR;TS FTP`
(the "Food Transfer Protocol"), what we still lack, and a scoped request to MIT Distinctive Collections
for the source. It is meant to go alongside the request for Marvin Minsky's TECO Universal Turing Machine
files ([`tots-request.md`](../../../../characters/marvin-minsky/sources/teco-utm/tots-request.md)).
How we read the binary is covered in the [README](README.md).

## What we have

- **The executable:** [`ts.ftp`](ts.ftp), from
  [PDP-10/its-vault `files/humor/ts.ftp`](https://github.com/PDP-10/its-vault/blob/master/files/humor/ts.ftp)
  (244,579 bytes, ITS five-bytes-per-word).
- **A full disassembly:** [`ts.ftp.dis`](ts.ftp.dis). The file is an ITS PDUMP with start `JRST 167`, and its
  pure pages come from `SYS: PURQIO 2138`. It is a dumped MacLisp; its own loser message names Lisp version 4132.
- **1,015 strings:** [`pnames.txt`](pnames.txt), rebuilt from MacLisp print-name chains. They include:
  - every command name and its documentation string
  - every `FORMAT` control string, including the protocol joke messages
  - about 120 restaurant site names, with addresses, phone numbers, hours, notes and menus

## What the binary says about its own history

The loader left its `;Loading` messages and file names in memory:

| String in core | Meaning |
|---|---|
| `;Loading FTP 127` | The program was built from `FTP` version 127 |
| `BMT1;FTP 127_2.`, `BMT1;FTP 127_3.` | ...read from `BMT1;`, apparently in pieces (or with compiler temporaries) |
| `bmt1;ftp`, `FTPDAT` | The data file it reads at start-up |
| `*INIT-FILE*`, `No init file found: ~A` | A per-user init file is optional |
| `;Loading COMRD`, `LIBDOC;COMRD KMP1_3`, `KMP1_4` | Kent's completing reader, from `LIBDOC;` |
| `;Loading TIME 4` | The TIME library (date parsing, "It's now ~A.") |
| `;Loading SHARPM 82`, `;Loading DEFMAX 98` | MacLisp's `#` reader macros and `DEFMACRO` support |
| `Bugs/Gripes to ~A`, `KMP@MIT-MC` | Maintainer |
| `humor;ts ftp` | Where it dumped itself |

The `LAST-UPDATE` stamps in the site data run from **1-Aug-77 to 17-Jan-85**, so this dump dates from 1985 or later.

There is also a stray fragment of the data file's *source text* in core, left in a buffer: the end of one entry, a
complete `(define-site KABUKI ...)` (Japanese, Central Square, closed Sunday and Monday, updated 21-May-83), and the
file's EMACS `Local Modes` trailer (`Mode:LISP`). That shows the data file was a Lisp source of `DEFINE-SITE` forms,
one per restaurant, with these fields: TYPE, LOCATION, SUBWAY, ADDRESS, PRETTY-HOURS, HOURS, CLOSED, COST, PHONE,
NOTES, LAST-UPDATE, plus menus.

## What the tape maps say

The directory maps in its-vault (`files/maps/`) list the files as they stood on MC in August 1982:

| Map | Entry | Date |
|---|---|---|
| [`mc8208.2894`](https://github.com/PDP-10/its-vault/blob/master/files/maps/mc8208.2894) | `KMP; FTP 94` | 7/18/82 00:25 |
| same | `KMP; FTP FASL` | 7/18/82 00:26 |
| same | `KMP; FTPDAT 21` | 7/27/82 22:45 |
| [`mc8208.2890`](https://github.com/PDP-10/its-vault/blob/master/files/maps/mc8208.2890) | `HUMOR; TS FTP` | 7/18/82 00:30 |

So in July 1982 the source was `MC: KMP; FTP 94`. It was compiled to `FTP FASL` and dumped as `HUMOR; TS FTP`
within five minutes on 18 July 1982. By the time of the surviving binary, the source had reached version 127 and
was being loaded from `BMT1;`.

Other evidence:
- An ITS source comment in `INQUIR; INQEXM 101` (in both
  [PDP-10/its](https://github.com/PDP-10/its/blob/master/src/inquir/inqexm.101) and its-vault) plans "Fancier
  search criteria ala KMP's food transfer protocol". That confirms the name and the author.
- The libraries the program loads are already public in PDP-10/its: `src/libdoc/comrd.kmp1` and
  `src/libdoc/time.10`.

## What is missing

1. **The source, `FTP` (any version).** It is not in its-vault's `files/kmp/`, which holds only nine unrelated
   files, nor in PDP-10/its. There is no `BMT1` directory in its-vault at all. Version 94 (KMP;, 1982) and version
   127 (BMT1;, the build in the surviving binary) are named; every version in between would show how it grew.
2. **The data file, `FTPDAT`** (version 21 in 1982, later ones too). Most of its content survives in the binary,
   but only as Lisp objects. The source text would give the original layout, comments, and any entries or fields
   that were dropped at load time.
3. **`FTP FASL`.** It is less important than the source, but it would show which source version each dump came
   from.
4. **The init file convention.** We know the program looked for one; we don't know its name or format.
5. **Directory metadata.** We need creation, last-write and last-read dates for each version. Those are the only
   evidence of when the restaurant guide was edited and how long it stayed in use.

## Where the source probably is

- **Tapes of Tech Square (ToTS), MIT Distinctive Collections.** These are the MIT AI Lab and LCS backup tapes,
  covering MC, AI, ML and DM. The extracted tree is `tots/its20x`, and `itstar` reads the raw images. `MC: KMP;`
  and `MC: BMT1;` should both be there for 1982–1985 or later.
- **Kent's own copies.** He may still have personal backups or printouts of `FTP` or `FTPDAT`, which would be the
  quickest route.
- **Other dumps.** For example a Lisp Machine port, or a copy mailed to someone. The INQUIR comment shows the idea
  travelled.

## Scoped request: Food Transfer Protocol

Like the Minsky request, ask for listings and named hits, not a dump of whole directories.

**Search:** MC (also AI and ML in case of copies), all tape dates, mainly 1980–1988:

```
KMP;  FTP *       (every FN2: 94, 127 and all others; FASL)
KMP;  FTPDAT *
BMT1; FTP *
BMT1; FTPDAT *
HUMOR; TS FTP     (every dump)
any file containing:  DEFINE-SITE   "Food Transfer Protocol"   FTPDAT
```

**For each hit, and for every version:**
1. The raw ITS file, kept as a 36-bit image as well as any Unix extraction.
2. The DUMP directory line: create date, last-write, last-read, size, tape image name, and that tape's dump date.
   Unix copies lose all of these dates.
3. A directory listing (names and dates only) of `MC: KMP;` and `MC: BMT1;` on the same tapes, so related files
   such as init files and test data can be requested by name afterwards.

**What we will do with it:** add the source and data next to the binary in
[`packages/cabinet/its/ftp/`](README.md) and check that `FTP 127` compiles to the same functions as the binary. The
restaurant guide would also become structured data: a dated map of eating around MIT from 1977 to 1985.

## Draft Kent or Henry can send

Henry can send both requests together: he already has a working channel with Distinctive Collections for his
father's files. If Kent prefers to ask directly, the finding aid says original creators may request their own
files, and `KMP;` is his directory.

```
Subject: ToTS scoped requests — Marvin Minsky (TECO Turing machine) and Kent Pitman (Food Transfer Protocol)

Hello —

Two scoped searches of the Tapes of Tech Square collection, both
listings plus named files, not whole directories.

1. Marvin Minsky, AI:MINSKY; and MC:MINSKY; — his TECO Universal
   Turing Machine (11 March 1981 *BBOARD mail "Re: too-short
   programs") and AI Memo 33 drafts. Details and search strings in the
   attached tots-request page.

2. Kent Pitman's "Food Transfer Protocol" (MacLisp, MIT-MC, 1982–85):
     MC: KMP;  FTP *     (FTP 94 dated 7/18/82 in the 8/82 directory map)
     MC: KMP;  FTPDAT *  (FTPDAT 21, 7/27/82)
     MC: BMT1; FTP *     (the surviving binary loaded BMT1;FTP 127)
     MC: BMT1; FTPDAT *
     MC: HUMOR; TS FTP   (every dump)
   The executable survives publicly; the source and data file do not.

For every hit and every version (FN2), please include the raw ITS
file and its DUMP directory line (create, last-write, last-read,
size, tape image, tape date), and a names-and-dates listing of the
directory on that tape.

Thank you.
```

## Links

- The binary and the recovered text: [`README.md`](README.md), [`pnames.txt`](pnames.txt)
- The Minsky TECO UTM request: [`tots-request.md`](../../../../characters/marvin-minsky/sources/teco-utm/tots-request.md)
- Collection: [Tapes of Tech Square (ToTS)](https://archivesspace.mit.edu/repositories/2/resources/1265)
- Disassembler: [larsbrinkhoff/pdp10-its-disassembler](https://github.com/larsbrinkhoff/pdp10-its-disassembler)
