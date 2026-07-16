# OLPC book viewer — Brewster Kahle devel-list post (21 January 2007)

**Author:** Brewster Kahle (`brewster@archive.org`)  
**List:** `devel@laptop.org`  
**Date:** Sun 21 Jan 2007, 10:52:30 EST  
**Subject:** proposal/wishlist for OLPC book viewer (was Re: do the directional pad work on B1 hardware?)

**URLs:**
- Wayback (primary): https://web.archive.org/web/20070228082343/http://mailman.laptop.org/pipermail/devel/2007-January/003674.html
- Original (may be dead): http://mailman.laptop.org/pipermail/devel/2007-January/003674.html

## Context (thread)

Brewster asked on **Library@laptop.org** (20 Jan) whether OLPC **directional pad** buttons send key events for a tablet-mode book-page demo. **Jim Gettys** replied: yes, they act as keyboard keys; rotation recently landed; multi-key on BTest-1 may glitch (fixed BTest-2). Suggested **devel@** for low-level, **sugar@** for UI.

Brewster asked whether quickest demo path is **browser/JavaScript** vs **Python GTK**.

## Internet Archive book format (Brewster, 21 Jan)

At that time IA had **~100k books**, scanning **>12k/month**. PDFs and DJVUs share **MRC**-style structure:

| Layer | Role |
|-------|------|
| Text | OCR with position — search + cut-and-paste |
| Background | Low-res JPEG |
| Foreground | 1-bit JBIG — black-and-white text plane |
| Color mask | Very low-res foreground color when JBIG isn't black |

**xbook** did not work from IA website on latest OLPC build at post time. **Flip-book JavaScript viewer** worked but pages should be one-up, rotated, full-screen.

## Example book (Flatland)

| Format | URL |
|--------|-----|
| Archive item | http://www.archive.org/details/flatlandromanceo00abbouoft |
| Flip book | http://www.openlibrary.org/details/flatlandromanceo00abbouoft |
| PDF | http://www.archive.org/download/flatlandromanceo00abbouoft/flatlandromanceo00abbouoft.pdf |

## Wishlist — OLPC book viewer

- View **PDFs** (IA format): rotated **one-page-up**; not rotated **two-up**; fill screen
- **Tablet mode**: d-pad page navigation; zoom; search entry
- **Streaming**: start viewing before full download (HTTP/1.1; optional server plugin for jump-around like DJVU)
- Search **inside book** and across **full library**
- Advanced: Michael Hawley **1-bit-font scrollbar** view; annotations; reviews
- Link back to **embedded metadata URL** in PDF (attribution)
- Launch from **clicking PDF on a website**

**PS:** IA sponsored Java DJVU viewer (inactive): http://sourceforge.net/projects/javadjvu/ — PDF + JS flip book had more momentum.

## Thread participants (named in post)

- **Bert Freudenberg** — asked about OCR vs bitmap; text-specific compression
- **Jim Gettys** — OLPC input / list routing
- **Brewster Kahle** — Digital Librarian, Internet Archive

## Related WWSFF material

- Don → IA OLPC offer (27 Jan) + Brewster lunch reply (30 Jan): [`olpc-internet-archive-2007.md`](olpc-internet-archive-2007.md)

↑ [sources index](README.md)
