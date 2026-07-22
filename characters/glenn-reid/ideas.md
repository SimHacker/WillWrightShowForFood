# Glenn Reid — show hooks

## The million-dollar question → PDF

Don frames it: *how do you turn arbitrary PostScript into something flat, portable, and safe enough to exchange?* Glenn's **Distillery** (`still.ps`) was the working answer at Adobe — run the program, capture what it *draws*, emit Red Book code. Adobe later productized the same trick as **Acrobat Distiller** and **PDF** (imaging model without Turing-complete PS).

Glenn (Facebook chat with Don, 2016): Warnock's early **graphbind** prototype redefined operators to trace execution; Glenn generalized it. **"No real relationship"** to the PDF product roadmap — different goals — but retrospectively *"the value was (is) in the imaging model, not the programming language."*

**Live segment:** distill a pathological `.ps` in-browser (or show before/after), then ask Glenn what broke on Display PostScript vs printers vs NeWS.

## Don's NeWS re-distillery

Don ported Glenn's idea to OpenWindows/NeWS (`setbindoverride`), added **grouping** and coordinate-system metadata, used it for animation (ARPAnet pseudo-scientific visualizer → flat PS → zoom/spin raster dumps). See Don's 1989 paper: http://www.donhopkins.com/drupal/node/97

HN threads Don cites:
- https://news.ycombinator.com/item?id=13198492
- https://news.ycombinator.com/item?id=13701897

## PostNews — PostScript as netnews body

1990 mailing list Glenn ran with Don, Ross Jeynes (Adobe), Amanda Walker, Jamie Zawinski, Ben Cranston — constrained distilled PS as **editable, verifiable** message format vs raw PS trojan horses. Distillery as canonical filter. RFC1154 encoding header flirtation.

**Segment:** read one distilled message; `readps.c` text extraction demo (Ross → Glenn enhanced).

## TouchType — font appreciation

NeXT app (1990): per-glyph X/Y manipulation; ~6 weeks on Display PostScript. Glenn's entire design in one line:

> Each letter had its own X,Y location (you can add Z :) and you could move them around easily with various direct-manipulation tools.

Sold to Adobe (retail copy ≠ original NeXT app — [betaarchive thread](http://www.betaarchive.com/forum/viewtopic.php?t=24870)).

**Jan 2015:** Don dreamed up 3D VR TouchType — elastic Disney-style glyphs, physics, scrabble-tray baselines, Pantomime platform — cc [David Levitt](../david-levitt/) + [Eric Hedman](../eric-hedman/). Glenn declined VR entirely; now **motors, solenoids, washing machines**. Still gave Don the object-model punchline: instantiate **"128-point string with 1 glyph."**

Primary source: [`sources/2015-01-31-touchtype-vr-correspondence.md`](sources/2015-01-31-touchtype-vr-correspondence.md)

**Show beat:** Glenn on TouchType design; optional Don demo of 128-point strings in-browser; *no* VR pitch in the invite.

## Adobe ATG hallway — David Tristram (~2007)

Glenn's third Adobe stint (~2007, **Advanced Technology Group**): **David Tristram** was *"just down the hall."*
Don's Jan 2023 mail connected Glenn to Dave's **pre-release live liquid-painting** Photoshop work (Don
beta-tested — [`../dave-tristram/sources/live-canvas-effects-stub.md`](../dave-tristram/sources/live-canvas-effects-stub.md)).
Glenn noted **Fractal Design** liquid painting (Tom Hedges, Mark Zimmer) predated Adobe's surface scratch.

## Warnock fan mail

Glenn traded John Warnock's PostScript **sort tree** and **3d.ps** packages with Don (1989 mail in repo). Warnock as language hacker, not just CEO.

## macOS Preview as distillery

Glenn: double-click `.ps` → opens as PDF. Same partial-evaluation intuition in the wild.

## Cross-links

- [`../brian-reid/`](../brian-reid/) — brother; 1985 history vs 1989–90 engineering
- [`sources/distillery-pdf-correspondence.md`](sources/distillery-pdf-correspondence.md)
- [`../owen-densmore/`](../owen-densmore/) — linguistic motherboard / `class.ps`
- NeWS reunion: [`../../repo-shows/news-postscript-window-system.yml`](../../repo-shows/news-postscript-window-system.yml)
- MOOLLM: `private path (not in this repo) (Distillery → PDF section)
