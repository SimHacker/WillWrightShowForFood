# Josh Siegel 📜🪟🏍️ *(NeWS interpreter rewriter · from WWIII simulations to window systems)*

*Portrayal of a real correspondent and old friend, written by Don — not Josh, and not his words.
Josh may correct, shape, reduce, or delete any of it.* [Portrayal standards](../../schemas/portrayal-standards.md)

**Point Josh here:** this directory is his room in the repo — character card, receipt trail,
interview beats, and draft invitation.

## Who

**Josh Siegel** — Don's old friend from the NeWS world. At **Los Alamos National Laboratory** he
did, in Don's words, "all kinds of nifty NeWS hacking… stuff that looks really nice and does lots
of things you can only do in NeWS" — including **LGATE**, the SDI war-game front end demoed at the
Pentagon, and a **conventional-warfare simulator front end** (MPM, "Tanks & AirPlains") that the
Joint Chiefs used to drive simulators running on Crays. In 1990 **James Gosling set up an
interview**, Don lobbied a friend at Sun to "tell him about the **peaceful things** he could be
doing," and Josh left LANL for the **NeWS group at Sun** — where he **rewrote the NeWS PostScript
interpreter** and worked with Don on **owm**. Later: **General Magic**, Magic Cap Core Technology
with Bill Atkinson and Andy Hertzfeld.

He once visited Don in Amsterdam by motorcycle.

## The LGATE receipt chain (five documents, 1988–1990)

| Receipt | What it shows |
|---------|---------------|
| [SUG Southwest program, Sep 1988](../don-hopkins/sources/1988-09-14-sug-southwest-lgate-sdi-news.md) | LGATE billed at the conference — Josh Siegel + Bret Thayler, LANL |
| [Rosenthal from Usenix, Feb 1989](../don-hopkins/sources/1989-02-05-rosenthal-news-pipes-spike-sdi-usenix.md) | "The Joint Chiefs are now using this to drive the simulators that run on Crays" — plus the Europe war panel |
| [Gilmore's NeWS census, May 1989](../don-hopkins/sources/1989-05-20-gilmore-news-vendor-census.md) | Siegel at LANL: SDI simulation, battle-station simulation, Earth resources/medical |
| [Usenix booth manifest, Jun 1989](../don-hopkins/sources/1989-06-07-hugh-daniel-usenix-news-booth.md) | In-booth: "LGATE-SDI, MPM (Tanks & AirPlains) — Josh Siegel, Bret Thaeler" |
| [The recruitment coda, Apr 1990](../don-hopkins/sources/1990-04-11-siegel-sun-interview-mousee-art.md) | Gosling arranges the Sun interview; "tell him about the peaceful things" |

Don's HN retelling: Josh wrote "MMPORG simulations of World War III for the Joint Chiefs of Staff
with a beautiful interactive NeWS front-end. (**Sun was lucky to steal him away from LANL to work
on NeWS instead of WWIII.**)" —
[zork-troll-flag-adventure-lineage-hn.md](../don-hopkins/sources/zork-troll-flag-adventure-lineage-hn.md)

## At Sun — the interpreter and owm 🪟

- **Rewrote the NeWS PostScript interpreter** from Gosling's original design.
- **owm** — the **Open Window Manager**, with Don: an X11 window manager written entirely in
  object-oriented NeWS PostScript (~1991), integrating **X11 and NeWS windows** under one roof
  with **tabbed frames** that wrap either kind of window, **pie menus** on frames and desktop,
  a **scrolling desktop**, and **multiple rooms**. Don still has source — and a copy now lives
  in this room:
  - [`sources/owm.ps`](sources/owm.ps) — **the window manager itself**, archived here
    (mirror: [owm.ps.txt](https://donhopkins.com/home/archive/NeWS/owm.ps.txt))
  - [Window Manager Flames](../don-hopkins/sources/i39l-window-manager-flames.md) — the design
    notes and emails: OWM, "The ICCCM Sucks", piewm
    (mirror: [i39l.txt](https://donhopkins.com/home/archive/NeWS/i39l.txt))
  - [`tab.ps`](../don-hopkins/code/news-tnt/tab.ps) — the tabbed frames, cached in
    [Don's code room](../don-hopkins/code/news-tnt/README.md)
    (mirror: [tab.ps](https://donhopkins.com/home/archive/NeWS/win/tab.ps))
- **The ICCCM death match (1991)**: after talking to David Rosenthal and Frame, Josh proposed
  pure-ICCCM TNT windows while Jonathan Payne's battle plan pitted "**OWM** (NeWS window manager
  wrapping X clients) vs Josh's ICCCM TNT windows" — the whole fight is preserved in
  [1991-09-news-tnt-icccm-death-match.md](../don-hopkins/sources/1991-09-news-tnt-icccm-death-match.md),
  where Josh (3 Sep 1991) quotes Chuck Price and Rosenthal's 1987 stability white paper.

## Invitation

Old friend, warm contact. Draft: [`invitation.md`](invitation.md) · beats: [`ideas.md`](ideas.md)

**NeWS reunion**: Josh belongs in the roll call with Gosling, Densmore, Rosenthal, van Hoff —
[old-band-back-together](../../process/old-band-back-together.yml), show seed
`news-postscript-window-system` in [REPO-SHOWS.yml](../../repo-shows/REPO-SHOWS.yml).

## Artifacts

| | Path |
|---|------|
| Character | [`CHARACTER.yml`](CHARACTER.yml) |
| Receipt trail | [`sources/README.md`](sources/README.md) |
| Show seed | [`../../repo-shows/REPO-SHOWS.yml`](../../repo-shows/REPO-SHOWS.yml) — news-postscript-window-system |

## Related

- [James Gosling](../james-gosling/README.md) — set up the Sun interview; NeWS creator
- [David Rosenthal](../david-rosenthal/README.md) — eyewitness to LGATE at Usenix; ICCCM debate correspondent
- [Owen Densmore](../owen-densmore/README.md) — object-oriented PostScript (class.ps) the interpreter ran
- [Don Woods](../don-woods/README.md) — Adventure lineage crossing in the [Zork harvest](../don-hopkins/sources/zork-troll-flag-adventure-lineage-hn.md)
