# Fw: Simcity For Olpc -- Source Code Drop

*1 messages — verbatim from lots-of-chat.txt scoop.*

## 1 · Don Hopkins <dhopkins@DonHopkins.com>

        **Date:** 28 December 2006 at 19:17:51 GMT+1  
        **Subject:** Re: FW: SimCity for OLPC -- source code drop  
        **To:** Don Hopkins <dhopkins@DonHopkins.com>

        Here is the secret URL to download for the SimCity source code, followed by the roadmap to the source code I wrote up:

http://www.DonHopkins.com/home/private_olpc/SimCityX11Source.zip

The files may have Unix line endings, so the Windows default text editor Notepad may choke on them, but Wordpad and Word or Visual Studio (or any decent text editor) should let you view or convert them.

I just received an actual OLPC laptop in the mail, to use for porting SimCity! They were very fast about sending it!
I can show it to you some time if you'd like to see it. It's very cute, green with little adjustable antenna ears.

  -Don


========================================================================

Roadmap of the SimCity source code.

========================================================================

SimCity designed and implemented by Will Wright,
Unix porting, optimization and multi player user interface design
by Don Hopkins (dhopkins@DonHopkins.com), for DUX Software.

========================================================================

Documentation:

manual
  User manual and help page templates.

src/notes
  Notes and screen snapshots.

Resources:

res

  Resources, data, TCL code, license keys, etc.

  Modified standard TCL/Tk widget libraries to support multiple
  displays, by removing uses of global variables, and instead
  storing screen-specific data in tk_priv map,
  keyed by "<variable>@<screen>" where screen is
  "[winfo screen $w]", the screen identifier.

  License keys:
    res/keys
    passwrds

  Data files:
    hexa.112
    hexa.232
    hexa.384
    hexa.385
    hexa.386
    hexa.387
    hexa.388
    hexa.456
    hexa.544
    hexa.563
    hexa.999

  Scenarios:
    snro.111
    snro.222
    snro.333
    snro.444
    snro.555
    snro.666
    snro.777
    snro.888

  String resources:
    stri.202
    stri.219
    stri.301
    stri.356

  Audio files:
    aaah.au
    a.au
    airport.au
    beep.au
    boing.au
    bop.au
    build.au
    bulldoze.au
    chalk.au
    coal.au
    com.au
    computer.au
    cuckoo.au
    e.au
    eraser.au
    expl-hi.au
    expl-low.au
    fire.au
    honk-hi.au
    honk-low.au
    honk-med.au
    ignition.au
    ind.au
    monster.au
    nuclear.au
    o.au
    oop.au
    park.au
    police.au
    quack.au
    query.au
    rail.au
    res.au
    road.au
    rumble.au
    seaport.au
    siren.au
    skid.au
    sorry.au
    stadium.au
    traffic.au
    uhuh.au
    unix.au
    whip.au
    wire.au
    woosh.au
    zone.au

  Modified TCL/Tk standard library code:
      button.tcl
      Modified to support multiple displays.
    menu.tcl
      Modified to support multiple displays.
    text.tcl
      Modified to support multiple displays.
    tk.tcl
      Modified to support multiple displays.
    buildidx.tcl
    entry.tcl
    init.tcl
    listbox.tcl
    mkindex.tcl
    parray.tcl
    tclinit.tcl
    tkerror.tcl
    wish.tcl
    wishx.tcl
    tclindex
    tcl.tdx
    tcl.tlb
    tk.tdx
    tk.tlb

  SimCity user interface code:

    simcity.tcl
      SimCity utilities and shared interface code.
    help.tcl
      SimCity help messages.
    wask.tcl
      Ask question window.
    wbudget.tcl
      Budget window.
    weditor.tcl
      Map editor window.
    weval.tcl
      Evaluation window.
    wfile.tcl
      File open window.
    wfrob.tcl
      Frob window (dynamic zone finder sliders).
    wgraph.tcl
      Graph window.
    whead.tcl
      Head main application window.
    whelp.tcl
      Help window.
    wkey.tcl
      Registration key window.
    wmap.tcl
      Map overview window.
    wnotice.tcl
      Notice message window.
    wplayer.tcl
      Add player window.
    wscen.tcl
      Choose scenario window.

  SimCity sound server code:

    sound.tcl
      Code loaded by sound server,
  which runs in another process,
  and is controlled via the TCL "send" command.
  No longer used.
  Sound should be built into SimCity, using a modern standard sound library (and file formats).

Base Libraries:

src/tcl
  TCL language interpreter.
  Free software.
  Modified for unix porting.

src/tk
  Tk user interface toolkit.
  Free software.
  Modified for unix porting, multiple display support, various extensions and bug fixes.

src/tclx
  Useful extensions to TCL/Tk.
  Free software.
  Modified for unix porting.

SimCity source code:

src/sim

src/sim/terrain

========================================================================



Begin forwarded message:

---
