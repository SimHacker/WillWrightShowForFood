# Distillery, PDF lineage — Don ↔ Glenn Reid correspondence (excerpts)

Primary material from Don Hopkins (2026 paste into WillWrightShowForFood). Full mail archives may live in DonHopkins repo. Portrayal: first-person Don where quoted; Glenn's words attributed.

---

## The question Don keeps asking

How do you turn arbitrary PostScript into something **flat**, **portable**, and safe enough to **edit** or **exchange** — without running a full Turing-complete program on every viewer?

Glenn Reid's **Distillery** was the working Adobe answer. Don reimplemented and extended it on **NeWS** (OpenWindows 2.0). The product line answer was **PDF** — imaging model, no interpreter.

---

## Glenn on Distillery vs PDF (Facebook, Feb 2016)

Don shared HN "Weaponizing PostScript" and asked about Distillery vs Adobe PDF.

**Glenn Reid:**

> No real relationship. John Warnock had written a simple bit of clever PS that redefined a built-in operator to accomplish some task (forget what) and I saw an opportunity to generalize it into a distillery. It was quite challenging, but I got almost all operations to work. Some great hacks like hiding things inside strings or on the stack so they would survive across save/restore 🙂

> PDF came about with much different goals, and in retrospect, kind of makes the case that the value was (is) in the imaging model, not the programming language. NeWS and DPS notwithstanding, you really don't need/want an interpreted language in there if you can help it.

> Did you know that the Preview app in MacOS X is essentially a distillery? You can double-click a .ps file and it opens as a PDF 🙂

**Show beat:** Glenn is the person most qualified to answer Don's question — with explicit nuance that PDF was parallel, not "Distillery shipped."

---

## Glenn on graphbind (email, Feb 1989)

> You asked if anyone had thought that something like that would be possible when the PostScript language was being designed, and as it turns out, the answer is yes. John Warnock (our president and sort of main architect of the language) wrote a very early prototype that he called "graphbind", that caught things like "moveto" and "gsave" and generated some pretty horrible code. It sat dormant for probably 5 years… He has also written 3-d packages in the PostScript language and sorting algorithms and some pretty amazing stuff.

Included `sort.ps` and `3d.ps` in mail to Don.

---

## Distillery → graphical editor (Mar 1989)

Glenn to Don on Barry Shein / Paul Asente NeWS-makers thread about editing random PS:

> I have been thinking about exactly that: an editor based on the output of the distillery. It is very feasible (in fact, it looks something like Adobe Illustrator's file format). The main weak point would be that many of the original semantics are lost…

Don replied with CyberSpace-deck visual PostScript debugger ideas (stack spike, mouse-sensitive dict windows).

---

## DPS portability (Mar 1990, PostNews list)

> The Distillery's main advantage… is that it takes non-portable code (even DPS extensions) and re-writes them in terms of Red Book code… It does just the opposite of locking people in to Display PostScript!

> Right now it works on printers but not on my display, so I need to fix it. It should run on ANY interpreter when it is completely debugged.

Don ported to NeWS same month (May 1990): selectable text via transparent canvases; joke segment "play PostScript as sound."

---

## TouchType (Jul 1990 NeXT demo; Jan 2015 VR thread)

1990: 20-minute Bay Area NeXT User Group demo — "font appreciation," per-glyph placement, PPD page sizes, ~6 weeks to write.

**Jan 2015** — Don pitched 3D VR TouchType (physics, elastic glyphs, scrabble-tray baselines); cc David Levitt + Eric Hedman / Pantomime. **Glenn:**

> That's not the original copy of TouchType, that was after I sold it to Adobe and they rebranded it…
> I couldn't be any less interested in virtual reality… firmly grounded in the real world… hacking on washing machines. Appliances. Motors. Solenoids.
> The only idea in it was that each letter had its own X,Y location (you can add Z :)… you probably haven't instantiated **"128-point string with 1 glyph"** as one of the objects.

Full thread: [`../../glenn-reid/sources/2015-01-31-touchtype-vr-correspondence.md`](../../glenn-reid/sources/2015-01-31-touchtype-vr-correspondence.md)

---

## Don's NeWS distillery extensions (Dec 1989, video contests mail)

> My new version puts in structural information (grouping), as well as information about the coordinate system in effect when the paths were originally drawn… read a distilled file back in, transform… clip… re-define some graphics operators… wire frame x-ray… and re-distill.

Based on Glenn's idea; uses NeWS `setbindoverride`.

---

## External pointers (Don)

| Resource | URL |
|----------|-----|
| 1989 paper (Distillery + NeWS) | http://www.donhopkins.com/drupal/node/97 |
| HN Weaponizing PostScript | https://news.ycombinator.com/item?id=13198492 |
| HN comments mirror | http://neilmagee.com/project/hn/comments.php?id=13701897 |
| MOOLLM Brian Reid history | `Leela/git/moollm/designs/postscript/BRIAN-REID-POSTSCRIPT-HISTORY.md` |
| MOOLLM linguistic motherboard | `Leela/git/moollm/designs/postscript/LINGUISTIC-MOTHERBOARD.md` |

---

## Robert Crowe / NeWSprint (Nov 1990)

Sun printing group asked Don about stdin→distillery→stdout and Adobe structuring conventions. Don: `~hopkins/ps/still.ps` on OpenWindows; loops unroll badly on hand-written fractal PS.

→ [`../glenn-reid/`](../../glenn-reid/) · [`../brian-reid/`](../../brian-reid/) · [`../../repo-shows/postscript-distillery-to-pdf/`](../../../repo-shows/postscript-distillery-to-pdf/)
