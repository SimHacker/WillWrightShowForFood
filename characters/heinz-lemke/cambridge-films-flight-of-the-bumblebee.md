# Cambridge films → *Flight of the Bumblebee*

How David Chapman at Cambridge University Library recovered and digitized the 1969 PIXIE
films — and why that made Don's *Flight of the PIXIE* edit possible.

*Evidence room note. Primary export:* `DonHopkins/temp/HeinzLemke/messages/` *(msg-403–409, 410, 413–414).*

## The chain

1. **Bill Buxton's dead end (2008–2019)** — Dave Fleck (`dfleck@computer.org`) asked Don about PIXIE; Don connected him to Buxton, who said he had references and promised scans + digitized film to both. Buxton sent notes to Fleck, not Don; the film stayed inaccessible for more than a decade.
2. **Don goes direct to Cambridge (2019)** — Reference ticket `#91692` / `#43348`. Don contacted **David Chapman**, Reference Department, Cambridge University Library (`reference@lib.cam.ac.uk`).
3. **Chapman's detective work** — Chapman traced the films through the Computing Laboratory Rainbow group (copies in a member's office), St John's College biographical librarians (William Newman status), and the lab's own librarian. He coordinated digitisation via the University Libraries Digital Content Unit. Holdups through May–July 2019; films published July 2019.
4. **What came online** — Two PIXIE demonstration films (1969, Southampton CAD Conference paper accompaniment) plus scanned paper, at [cl.cam.ac.uk/library/archives.html](https://www.cl.cam.ac.uk/library/archives.html).
5. ***Flight of the PIXIE* (Don's edit)** — After publication, Don cut highlights from the digitized films, synchronized them in AfterEffects to Rimsky-Korsakov's *Flight of the Bumblebee* (Yuja Wang, piano), to show how fast and fluid PIXIE's radial menus were on the PDP-7 graphics terminal (apps on Titan over the link). [YouTube](https://www.youtube.com/watch?v=jDrqR9XssJI). Don credits Wiseman, Lemke, Hiles, **and Chapman** in the video dedication block.
6. **Heinz enters the picture** — Don reached Heinz Lemke (PIXIE programmer on the PDP-7) while documenting the films. Heinz appears in the footage; Don hopes for CHM oral history while first-hand memory remains.

## David Rosenthal — same Cambridge PDP-7/Titan

**David S. H. Rosenthal** (DSHR) was an undergraduate at Cambridge ~1970 on the **same PDP-7/340 + Titan** stack Heinz used for PIXIE. DSHR to Don (Mar 2020, Heinz export msg-408):

> *I was at Cambridge working on the PDP-7/340 display & Titan — I think starting in 1970. I definitely met Wiseman then, but I don't recall talking to him about PIXIE. I believe I saw a demo in those days.*

Don proposed DSHR interview Heinz for the Computer History Museum — both Cambridge alumni who later built **networked window systems** (Andrew → NeWS/X11). Don's HN comment on [DSHR's window-systems history](https://news.ycombinator.com/item?id=40196586) (Jun 2024): PIXIE's PDP-7/Titan distributed GUI directly influenced DSHR's later work.

**Show hook:** Heinz + Rosenthal on the same machine, different generations — what did the lab feel like? DSHR as interviewer (Don's suggestion). See [`../david-rosenthal/`](../david-rosenthal/) · NeWS reunion show seed.

## Production — *Flight of the PIXIE* edit

Don's YouTube edit is **not** the 1969 film — it is post-production on Chapman's digitized telecine.

| Step | Detail |
|------|--------|
| Source | Two films from Cambridge Univ Library archives (Chapman, 2019) |
| Edit | Adobe **After Effects** — highlight cuts synced to Yuja Wang *Flight of the Bumblebee* |
| Telecine feel | **Motion tracking** on the digitized film + blur/glow on text overlays to **match the jiggle** of old telecine at title/credit boundaries ([HN Mar 2020](https://news.ycombinator.com/item?id=22718422)) |
| Intent | Show radial-menu speed; homage credits Wiseman, Lemke, Hiles, Chapman |

### Repo Show post-production — same jiggle on titles and credits

For the **PIXIE Repo Show** (and any episode that intercuts Chapman's archive), apply the **exact
same After Effects motion track and filter stack** to episode graphics — not only to film inserts:

- **Opening title** — episode slug on a Cambridge Univ Library-style slate
- **Guest slates** — Heinz, David, Lars name cards
- **Segment cards** — emulation, same-machine memory, CARS bridge
- **Jokes and running gags** — lower thirds, dedication blocks, sign-off lines
- **End credits** — roll with the same telecine drift as the 1969 film head/tail

Goal: titles and credits look like they were **printed on the same old university film** as the
PIXIE demonstration reels — one visual language from archival clip through Bumblebee homage through
live show packaging. **Gag credits** (*Department of Research Simulation!*, **Ground Up Software**
consulting plugs, Light Pen Bureau, …) on the same jiggle track: [`../../repo-shows/ideas/gags/cambridge-gag-credits.yml`](../../repo-shows/ideas/gags/cambridge-gag-credits.yml). Canonical spec: [`../../process/post-production/cambridge-telecine-jiggle.yml`](../../process/post-production/cambridge-telecine-jiggle.yml). Pipeline detail: [`../will-wright/sources/don-youtube-jDrqR9XssJI-flight-of-pixie/production-notes.md`](../will-wright/sources/don-youtube-jDrqR9XssJI-flight-of-pixie/production-notes.md).

Munching Squares on living PDP-7/340 (AM radio music): https://www.youtube.com/watch?v=V4oRHv-Svwc

## Hardware docs

**Type 340 Display Programming Manual** (the fucking manual):

http://bitsavers.trailing-edge.com/pdf/dec/graphics/7-13_340_Display_Programming_Manual.pdf

Luxury options Don cites on HN: 342 Symbol Generator, 370 Light Pen, 347 Subroutine Option — see [PDP-10 types page](http://www.ultimate.com/phil/pdp10/types).

## HN threads (Don → PIXIE / pie menus)

| Item | Date | Note |
|------|------|------|
| [22346556](https://news.ycombinator.com/item?id=22346556) | Feb 2020 | Max/MSP thread — Chapman librarian, first HN PIXIE film post |
| [22718422](https://news.ycombinator.com/item?id=22718422) | Mar 2020 | TV logos / telecine — AfterEffects jiggle production note |
| [39217923](https://news.ycombinator.com/item?id=39217923) | Feb 2024 | Kando pie menu — full pie-menu retrospective + PIXIE |
| [40196586](https://news.ycombinator.com/item?id=40196586) | Apr 2024 | PDP-1 Spacewar — PIXIE + Titan + **Rosenthal Cambridge** |
| [38235871](https://news.ycombinator.com/item?id=38235871) | Nov 2023 | GIMP pie menus — distributed PIXIE on PDP-7/Titan |
| [41168858](https://news.ycombinator.com/item?id=41168858) | Aug 2024 | macOS pie menu — Flight dedication block |

Pull-in gaps (assets not yet in repo): [`pull-in-gaps.yml`](pull-in-gaps.yml)

## Why this matters for a Repo Show

- **Librarians as preservation heroes** — Chapman went out of his way; Don cc'd him on the Stanford CS547 resurrection email (Jan 2023) as a model of archive rescue.
- **Contrast with gatekeeping** — Buxton/Microsoft offered to pay digitization but never delivered to Don; Chapman actually did the work.
- **Show segment** — Ask Heinz: what was it like to see the films surface again after 50 years? Who is in the film? What did the light pen + radial "lightbuttons" feel like?
- **Don's layer** — The Bumblebee edit is commentary, not the original film; pie menus as "rapid flight."



## Key people


| Person          | Role                                                                    |
| --------------- | ----------------------------------------------------------------------- |
| David Chapman   | Cambridge Univ Library Reference; tracked, coordinated, published films |
| Heinz U. Lemke  | PIXIE co-author; programmed PDP-7; nightly Titan link for apps; in film |
| Neil E. Wiseman | PIXIE lead; paper co-author                                             |
| John O. Hiles   | PIXIE co-author                                                         |
| Bill Buxton     | Promised PIXIE refs/film digitization; did not deliver to Don           |
| David S. H. Rosenthal | Cambridge undergrad ~1970 on same PDP-7/340 + Titan; met Wiseman; later NeWS/X11/LOCKSS |
| Lars Brinkhoff | Co-guest — PDP-7 + Type 340 emulation; SIMH; make PIXIE runnable today |
| David S. H. Rosenthal | Co-guest — same Cambridge PDP-7/340 + Titan ~1970; PIXIE → NeWS/X11; LOCKSS |

## Runnable iron (show segment)

**Lars Brinkhoff** maps Type 340 + light pen to emulators; **David Rosenthal** holds Cambridge
~1970 memory on the same stack. Goal: radial menus demonstrably runnable on stream — not just
film archaeology. See [`../lars-brinkhoff/`](../lars-brinkhoff/) · [`../david-rosenthal/`](../david-rosenthal/).




## Hardware: PDP-7 + Type 340

PIXIE ran on a **PDP-7** with Type 340 vector display and light pen, linked as a graphics
satellite to **Titan** (Cambridge Multiple Access System). Heinz: *"I used this [Titan–PDP-7]
link for about 3 years on a daily basis (actually nightly basis) connecting PIXIE with some
application programs on Titan."* Wiseman's high-speed data link is often cited as early
distributed graphics / one of the first distributed CAD architectures — Rainbow group, Gray's
data structures, Lang's link software, circuit analysis on Titan while the user drew on PDP-7.

## Related thread: *Electronics* magazine (April 28, 1969)

John Gilmore sent Don a PDF scan of a McGraw-Hill **Electronics** article (subsection "Electronics International") about PIXIE — photo of young Heinz at the PDP-7. Heinz wanted a high-res scan. Export attachments failed to extract (SAVE-FAILED sidecars). **Ask Heinz to tell the US-trip + magazine story.**

## Links

- Films archive: https://www.cl.cam.ac.uk/library/archives.html
- *Flight of the PIXIE*: https://www.youtube.com/watch?v=jDrqR9XssJI
- PIXIE paper (Don's scan): https://www.donhopkins.com/home/documents/PIXIE%20a%20new%20approach%20to%20man-machine%20communication.pdf
- Don's retrospective: https://donhopkins.medium.com/pie-menus-936fed383ff1
- Cambridge Lab history (PDP-7/Titan CAD): https://www.cl.cam.ac.uk/events/EDSAC99/history.html
- Type 340 Display Programming Manual: http://bitsavers.trailing-edge.com/pdf/dec/graphics/7-13_340_Display_Programming_Manual.pdf
- DSHR on preservation: https://blog.dshr.org/2018/11/kids-today-have-no-idea.html
- Titan/PDP-7 link software: https://cucps.soc.srcf.net/titan/supplan/pd10.htm
