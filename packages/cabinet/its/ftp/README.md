# AI:HUMOR;TS FTP — the Food Transfer Protocol

An ITS executable from [PDP-10/its-vault `files/humor/ts.ftp`](https://github.com/PDP-10/its-vault/blob/master/files/humor/ts.ftp):
a MacLisp program that parodies FTP. You `CONNECT` to a restaurant, set the `BITE` size, read its `MENU`, check
`STATUS`, list active `SITES`, and `DISCONNECT`. The data is a real 1977–1985 guide to Boston and Cambridge
restaurants near MIT.

## Files

| File | What it is |
|------|-----------|
| [`ts.ftp`](ts.ftp) | The executable, byte for byte from its-vault (ITS 36-bit words, five bytes each) |
| [`ts.ftp.dis`](ts.ftp.dis) | Whole-image disassembly by Lars Brinkhoff's [pdp10-its-disassembler](https://github.com/larsbrinkhoff/pdp10-its-disassembler): `dis10 -Wits -Fpdump -Sall -mKA10ITS ts.ftp` |
| [`pnames.txt`](pnames.txt) | 1,015 strings and symbol names rebuilt from MacLisp print names (address, text) |
| [`strings-ascii7.txt`](strings-ascii7.txt) | Raw 7-bit ASCII runs, five characters per word, in memory order |

## What the dump says

- **Format:** ITS PDUMP, start `JRST 167`. Pure pages are shared from `SYS: PURQIO 2138`, so this is a dumped
  MacLisp (the "LOSE!! Cannot find file with pure pages for the LISP which this job was dumped from (version 4132)"
  message is MacLisp's own).
- **Source:** `BMT1;FTP 127`, reading its data file `FTPDAT` and an init file. Bugs and gripes go to `KMP@MIT-MC`
  (Kent Pitman), whose `LIBDOC;COMRD` completing reader and `TIME` library are loaded into it.
- **Banner:** `FTP.~A (Food Transfer Protocol) - Type "?" for a list of commands.`
- **Commands:** CONNECT, DISCONNECT, BITE, MENU, STATUS, SITES, TIME, HELP, QUIT, and NETWORK (ADD, REMOVE, SET,
  SHOW, HELP), plus network filters.
- **The protocol joke, in its format strings:** "Connection open to ~A. Bite size is ~A.", "Host not responding.
  Still trying...", "Host unavailable due to scheduled down.", "Attempt to open connection to server timed out.",
  "Will use ~A transfer mode. (BITE command can change this)", "Warning: Site being debugged.", "Unexpected error
  packet seen. Connection to ~A being closed."
- **Sites (`DEFINE-SITE`):** about 120 places, among them Mary Chung's, Joyce Chen's Small Eating Place, the
  Middle East Restaurant, Legal Sea Foods (Kendall, Boston, Chestnut Hill, with a menu), Uno's (small, medium and
  large menus), Pinocchio, Bel Canto, Steve's, Toscanini's, Durgin-Park, Al Capone's, Kabuki, Joe's Pizza Truck and
  the No-Name Restaurant. Each has type, location down to the square, subway stop, hours, cost, phone, notes and
  `LAST-UPDATE`.
- **Dates:** entries are stamped 1-Aug-77 to 17-Jan-85.

## How the text was recovered

Running `strings` on the file finds nothing, because each 36-bit word holds five 7-bit characters. Even read
that way, the program's text comes out interleaved: MacLisp keeps a symbol's print name as a list of words, each
cons cell pointing (CAR) at five characters and (CDR) at the next cell. `pnames.txt` follows those chains, which
gives back whole strings: the site names, addresses, menus, hours and the program's messages.
