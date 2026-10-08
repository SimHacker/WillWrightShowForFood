---
title: Food Transfer Protocol
synonyms:
  - ftp
  - ts ftp
  - food transfer protocol
  - kmp ftp
definition: "Kent Pitman's FTP parody for MIT-MC, 1982–85: CONNECT to a restaurant, set your BITE size, read the MENU. Restored from the ITS binary and running in this page."
---

```yaml page
src: ftp/index.html
title: "FTP.127 — Food Transfer Protocol, restored from AI:HUMOR;TS FTP"
height: fill
caption: "Click the screen and type. Tab or Esc completes, ? lists the choices, Return sends. Try: connect mary-chungs, then status, then menu."
```

**What it is.** In 1982 Kent Pitman (KMP) wrote a MacLisp program on MIT-MC, the AI Lab's PDP-10 running ITS, that dresses a restaurant guide up as the ARPANET's File Transfer Protocol. You don't fetch files; you open a *connection* to a restaurant. Its banner was `FTP.127 (Food Transfer Protocol)`, it answered `Bugs/Gripes to KMP@MIT-MC`, and its commands are FTP's with the obvious substitutions:

- **CONNECT** to a site, **DISCONNECT**, **STATUS** to describe the connection.
- **BITE** sets the transfer size, SMALL, MEDIUM or LARGE, the way FTP sets byte size. Uno's has a different menu for each.
- **MENU** lists what the connected server offers. **SITES** lists the active network.
- **NETWORK** edits which servers are considered, with filters (TYPE, LOCATION, QUALITY in stars, NOT, ALL, NONE) that combine like a query: `network set type chinese`, then `network add type pizza`.
- **TIME** prints the time; restaurants that are closed answer "Host unavailable due to scheduled down."

The joke runs through every message: "Host not responding. Still trying...", "Attempt to open connection to server timed out.", "Warning: Site being debugged." The data is not a joke. Each of the 78 entries is a real Boston or Cambridge restaurant near MIT, with address, phone, subway stop, hours, cost, stars, notes ("Won't seat partial groups; latecomers can't join a seated group") and sometimes the whole menu: Mary Chung's, Joyce Chen's Small Eating Place, Legal Sea Foods, Toscanini's, the Middle East, Joe's Pizza Truck. The entries are dated from August 1977 to January 1985.

**Mary Chung's** was one of the AI Lab hackers' favorite restaurants: a Szechuan place on Mass Ave between Main Street and Central Square, a short walk from Tech Square, where late-night dinners of dun dun noodles, suan la chow show and Peking ravioli fed generations of MIT hackers. FTP gives it four stars, notes "Good dimsum," and carries its menu: try `connect mary-chungs`, then `menu`.

**Where it ran.** MIT-MC, one of the ITS machines at Tech Square, in 1982–85. The 1982 directory maps list Kent's source as `KMP; FTP 94` and the data as `KMP; FTPDAT 21`, compiled and dumped as `HUMOR; TS FTP` within five minutes on 18 July 1982. The surviving binary is a later build, from `BMT1;FTP 127`. The command line is Kent's own completing reader, `LIBDOC; COMRD`, which other ITS programs used too: the INQUIR source plans "fancier search criteria ala KMP's food transfer protocol."

**How it was restored.** Only the executable survives, in [PDP-10/its-vault](https://github.com/PDP-10/its-vault/blob/master/files/humor/ts.ftp); the source and the data file are lost.

1. Lars Brinkhoff's [pdp10-its-disassembler](https://github.com/larsbrinkhoff/pdp10-its-disassembler) reads it as an ITS PDUMP: a saved MacLisp that shares its pure pages with `SYS: PURQIO`, Lisp version 4132.
2. Plain `strings` finds nothing, since a PDP-10 word holds five 7-bit characters. Read that way, the text comes out interleaved, because MacLisp keeps a symbol's name as a linked list of words. Following those links gives back 1,015 whole strings: every command, help line and message.
3. Each restaurant is a Lisp symbol whose property list holds its fields. Walking the heap (symbols, fixnums, flonums for half hours, lists, dotted pairs for cost ranges) rebuilds all 78 entries as JSON. A fragment of the original data file, left in a buffer, has the Kabuki and Al Capone's entries as source; the rebuilt data matches them exactly.
4. The page above uses only what was recovered for its messages, and follows Kent's COMRD for the command line. A few things the binary can't tell us, such as the prompt and the help layout, are marked "guessed" in the code.

It is a parody of a protocol, a restaurant guide, and a piece of MIT history. It is also an early example of a program you talk to by completion and `?`, the way TOPS-20 users expected.

**More.**

- [Run it on its own page](/ftp/index.html) — the same program, full window.
- [Analysis and archive request](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/its/ftp/ANALYSIS-AND-ARCHIVE-REQUEST.md) — what is missing (the source, `FTPDAT`) and the scoped request to MIT's Tapes of Tech Square for it.
- [The files](https://github.com/SimHacker/WillWrightShowForFood/tree/main/packages/cabinet/its/ftp) — the binary, its disassembly, the recovered strings, the extractor and the page.
- [Kent Pitman](https://en.wikipedia.org/wiki/Kent_Pitman) — MacLisp, the Common Lisp condition system, and much of ITS's Lisp culture.
- ~PDP-7~ and ~PIXIE live~ — the other machine restored in this database.
