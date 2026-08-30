# Emacs TinyMUD clients: the dig

Cached copies of the Emacs-family TinyMUD clients, September 1989 to
1999, with provenance for each file. The point of this directory is
comparison: three separate lineages of "play a MUD inside your text
editor" existed within months of TinyMUD's launch (19 August 1989),
and one of them is Don's and is not like the others.

## The census

| File | Language | Author(s) | Date | Where it was found |
|---|---|---|---|---|
| `tinymud-1989-09.el` | GNU Emacs Lisp | unattributed (CMU line, see below) | 24 Sep 1989 | embedded in Don's letter to MLY, [`../tinymud-forwards.txt`](../tinymud-forwards.txt) |
| `tinymud-1990-07.el` | GNU Emacs Lisp | James Aspnes, Stewart Clamen | 1989-1990 | comp.sources.games distribution, July 1990, via [BartMassey-upstream/tinymud](https://github.com/BartMassey-upstream/tinymud) `clients/` |
| `tinymud.ml` | Mocklisp (UniPress Emacs) | Don Hopkins | late 1989 / 1990 | Don's own tree, `PieMenus/Misc/tinymud.ml` (copy; original stays put) |
| `tinytalk-goehring-0.6.el` | GNU Emacs Lisp | Scott Goehring, Robert Earl; maint. Alex Schroeder (1999) | 1990s | Alex Schroeder's Geocities page, preserved at [oocities.org](https://www.oocities.org/timessquare/6120/wiki/TinyTalk.html) |
| `comp-sources-games-1990-README.txt` | text | Bill Randle (moderator) | 27 Jul 1990 | same distribution as `tinymud-1990-07.el` |

## Lineage 1: the CMU elisp client (Aspnes, Clamen, then Curtis)

The canonical `tinymud.el` was written at CMU alongside the server.
Aspnes's own "TinyMUD has moved" notice of 28 November 1989 (in
[`../tinymud-forwards.txt`](../tinymud-forwards.txt)) treats it as the
default way people connect: "If you are running tinymud.el under GNU
Emacs, the only thing you need to change is the setting of
tinymud-server."

Two revisions are cached here, and the diff is a time-lapse of the
game's first year:

| | Sep 1989 (124 lines) | Jul 1990 (462 lines) |
|---|---|---|
| Author header | none | "by James Aspnes ... and Stewart Clamen ... 1989, 1990" |
| Default server | `lancelot.avalon.cs.cmu.edu` | `daisy.learning.cs.cmu.edu` |
| Core loop | filter with word-wrap, send, quit, macro alist | same code, extended |
| Page detection | no | `tinymud-page-regexp`, optional pop-to-buffer |
| Cyberportals | no | `#### Please reconnect to ... ####` regexp, auto-reconnect, multi-world |
| Login | manual `connect` | auto-login machinery |

The cyberportal support is Stewart Clamen's claim to fame: the LP-Talk
documentation credits him with inventing portals and adding them "into
the GNU Emacs-based client (tinymud.el)," and the July 1990 file is
where that landed. Portals let one MUD hand your client off to another
server, which is a 1990 hyperlink between worlds.

The line did not stop there. The client was later generalized into
`mud.el`, whose header (quoted in several surviving indexes) reads:

    ;;; Major Mode for talking to MUDs
    ;;; by James Aspnes (asp@cs.cmu.edu) and Stewart Clamen (clamen@cs.cmu.edu)
    ;;; and Pavel Curtis (pavel@parc.xerox.com)
    ;;; 1989, 1990, 1991

That third name matters: Pavel Curtis co-maintained the Emacs MUD
client before founding LambdaMOO (1990-91). The tool for visiting
other people's worlds was maintained by the man about to build the
most consequential one. `mud.el` was distributed from
`parcftp.xerox.com:/pub/MOO/clients/` and
`ftp.math.okstate.edu:/pub/muds/clients/UnixClients/`; both hosts are
dead, the Wayback Machine holds no capture of either path, and no full
copy has been recovered yet. Open hunt.

### Provenance chain for `tinymud-1990-07.el`

lancelot.avalon.cs.cmu.edu pub directory -> posted to
comp.sources.games by moderator Bill Randle, 27 July 1990 (his README
is cached beside it, and states "tinymud.el and tint came from
lancelot.avalon.cs.cmu.edu") -> preserved by Bart Massey in 2003
("These are here for completeness only") -> GitHub mirror
BartMassey-upstream/tinymud -> here. The same distribution carries
Anton Rang's `tinytalk` C client and a VMS client, not cached here.

## Lineage 2: the MIT elisp client (Goehring's "TinyTalk.el")

`tinytalk-goehring-0.6.el` is a trap for archaeologists: it circulated
under the name TinyTalk.el (the 1990s rec.games.mud FAQ lists it at
v0.5, distinct from MUD.el), but its internal header says `tinymud.el
-- a MUSH/MUD client`, by Scott Goehring (goehring@churchy.ai.mit.edu)
and Robert Earl (rearl@wookumz.ai.mit.edu), GPL, maintained in 1999 by
Alex Schroeder. It is a from-scratch codebase, not a fork of the CMU
client: world registry via `add-world`, per-world auto-login,
password prompting, ANSI-era conveniences. Two different files named
tinymud.el, two different files named TinyTalk: naming collisions are
not a modern invention, which is a very GUID-registry moral.

## Lineage 3: Don's Mocklisp client for UniPress Emacs

`tinymud.ml` is the client Don describes in the 20 December 1989
mapping-droids letter (in
[`../tinymud-forwards.txt`](../tinymud-forwards.txt)): "My 'real' job
is writing a hypertext authoring tool in Emacs (UniPress, so I am
using mlisp). ... In my spare time, I've connected the emacs hypertext
authoring tool up to tinymud." UniPress Emacs is the commercial
descendant of Gosling Emacs, written at CMU before James Gosling left
for Sun; its extension language is Mocklisp, not Emacs Lisp. So the
CMU thread runs through both lineages twice over: Aspnes wrote the
game and the GNU client at CMU, and Don scripted his client in the
language of an Emacs that was itself born at CMU.

It is not a port of the CMU client. It is a different kind of program:

- **Transport through NeWS.** The connection is opened with
  `setenv NEWSSERVER <addr>.<port> ; /usr/NeWS/bin/psh`, abusing the
  NeWS PostScript shell as a network pipe. The telnet spawn is present
  but commented out. The MUD login is then driven by an output-filter
  handoff (`#mud-connect-filter` sends `connect name password` and
  swaps in `#mud-output-filter`).
- **Trigger tables as editable buffers.** Incoming lines are matched
  against two plain-text action files, `tinymud-line-actions` (whole
  line -> mlisp form) and `tinymud-name-actions` (first word -> mlisp
  form), and matching entries are passed to `eval-mlisp`. The trigger
  database is just a buffer you edit; the client greps it live. This
  is the scripting feature TinyFugue would later make famous, running
  in December 1989 inside a text editor.
- **Mouse bindings.** `mud-mouse-look` on middle-click, room creation
  on meta-middle: point at a thing in the transcript and look at it.
- **Hypertext integration.** `mud-author-room` and `mud-update-room`
  build a node per room in Don's UniPress hypertext authoring system
  (the day-job tool): room text is parsed, known articles become
  `~links~`, pictures become `.picture <...>` directives, unknown
  names become `.mud <look ...>` command buttons. The letter's claim,
  "I'm creating my own database that parallels the TinyMUD universe,"
  is implemented right there, including per-player log buffers
  (`mud-name-log`) and an "it" selection that parses `(#123)` object
  numbers off the ends of lines.
- **Datable.** The default server is daisy (so the file as saved
  post-dates the 28 November 1989 move), with uokmax.ecn.uoknor.edu
  (TinyHELL, opened mid-October 1989) commented out as the alternate.

The September 1989 letter also answers Don's own question about
whether he wrote a GNU Emacs client: what he mailed MLY was the CMU
elisp client ("suck the following code up into your big fat emacs"),
twelve days after Todd Masco first pointed him at the game. Don
distributed the elisp one; his original work went into the Mocklisp
one, where the ideas were bigger than the transport.

## Open hunts

- `mud.el` with the Pavel Curtis credit line: no live mirror found
  (parcftp.xerox.com, ftp.math.okstate.edu, ferkel.ucsb.edu all dead;
  no Wayback captures of the FTP paths). Candidate sources: old CD-ROM
  shovelware images of FTP mirrors on archive.org, private tapes.
- TinyTalk.el v0.5 as listed in the rec.games.mud FAQ, to confirm the
  Goehring v0.6 lineage.
- LPmud.el, CLPmud.el, MyMud.el from the same FAQ census, if the era's
  other elisp clients are ever wanted for comparison.

## In memoriam

Todd Masco (tm2b@andrew.cmu.edu), whose 12 September 1989 "tinyMUD!"
announcement to the elbows list is the first document in this archive
and the reason Don found TinyMUD at all, has passed away. He opened
with "Everybody with an internet connection should: telnet
128.2.242.79 4201" and signed off "Good luck!" -- the oldest file here
exists because he sent that.

## Related in this repo

- [`../README.md`](../README.md) -- the 1989 TinyMUD archive index
- [`../tinymud-forwards.txt`](../tinymud-forwards.txt) -- the letters
  both elisp snapshots and the mapping-droids description came from
- [`../../../../andrew-plotkin/README.md`](../../../../andrew-plotkin/README.md)
  -- the MIDgaard thread, the other half of December 1989
