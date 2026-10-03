# Methodology of Window Management (1985/86)

**The book:** F R A Hopgood, D A Duce, E V C Fielding, K Robinson, A S Williams (eds.), *Methodology of Window Management*. It is the proceedings of the Alvey Workshop at Cosener's House, Abingdon, held from 29 April to 1 May 1985. Springer-Verlag published it in 1986, and it is free online at Chilton Computing:
<http://www.chilton-computing.org.uk/inf/literature/books/wm/overview.htm>

Don has recommended it on Hacker News more than thirty times since 2014. Of everything he cites, it is probably the source he cites most. This page collects what he says about it and which chapters he points to. It then connects those chapters to the rooms in this house.

## Why Don keeps citing it

> "One book that deeply impressed and influenced me, and made me realize how many extremely different approaches and ways of thinking about user interfaces there were, was "Methodology of Window Management", the proceedings of a 1985 workshop where an amazing group of brilliant pioneers got together and discussed a wide range of vastly different approaches and ways of thinking about user interface architecture and software design."
> — [HN 7758677](https://news.ycombinator.com/item?id=7758677), 2014

> "...it's still valuable and amusing reading, just to get the perspective that people haven't always agreed on basic concepts like what an icon is, or what you can do with a window, and that there is still a lot of room to innovate if only we stop rehashing old ideas."
> — same comment

> "They used to have whole conferences on window management!"
> — [HN 44838734](https://news.ycombinator.com/item?id=44838734), 2025, on *Window Activation*

> "Back to the drawing board!"
> — [HN 20376976](https://news.ycombinator.com/item?id=20376976), 2019, on *The death watch for the X Window System has probably started*

Don uses the book against **cargo-cult interface design**:
> "Things weren't always the way they are now, and there are many different ways of doing things, that are a hell of a lot better than the status quo."
> — [HN 22506237](https://news.ycombinator.com/item?id=22506237), 2020, repeated in [HN 38474858](https://news.ycombinator.com/item?id=38474858), 2023

## Don's favourite chapters

| Ch. | Title | Author | Link | Rooms |
|---|---|---|---|---|
| 3 | A Comparison of Some Window Managers | Tony Williams | [p003](http://www.chilton-computing.org.uk/inf/literature/books/wm/p003.htm) | It compares PERQ PNX, Apollo, SunWindows, MG-1, Sapphire, Blit, Smalltalk, Interlisp-D, Star and more |
| 4 | Ten Years of Window Systems: A Retrospective View | Warren Teitelman | [p004](http://www.chilton-computing.org.uk/inf/literature/books/wm/p004.htm) | [warren-teitelman](../../warren-teitelman/), [alan-kay](../../alan-kay/) (Kay's corrections) |
| 5 | SunDew: A Distributed and Extensible Window System | James Gosling | [p005](http://www.chilton-computing.org.uk/inf/literature/books/wm/p005.htm) | [james-gosling](../../james-gosling/), [owen-densmore](../../owen-densmore/) (NeWS) |
| 9 | Interface to GKS | | [p009 §9.3](http://www.chilton-computing.org.uk/inf/literature/books/wm/p009.htm#c9p3) | Don calls it "dated and laughable" but still worth reading |
| 12 | System Aspects of Low-Cost Bitmapped Displays | Rosenthal & Gosling (Andrew, CMU) | [p012](https://www.chilton-computing.org.uk/inf/literature/books/wm/p012.htm) | [david-rosenthal](../../david-rosenthal/) |
| 13 | A Window Manager for Bitmapped Displays and Unix | Gosling & Rosenthal (Andrew, a tiling WM) | [p013](https://www.chilton-computing.org.uk/inf/literature/books/wm/p013.htm) | According to Don, the first known use of "Gorilla effect" in graphics |
| 17 | User Interface Working Group Discussions | | [p017](http://www.chilton-computing.org.uk/inf/literature/books/wm/p017.htm) | [scott-jenson](../../scott-jenson/) (tiling vs overlap) |
| 18 | User Interface Working Group Final Report | | [p018](http://www.chilton-computing.org.uk/inf/literature/books/wm/p018.htm) | §18.8.4 Icons; [Rosenthal's Alvey icon/selection table](../../david-rosenthal/02-alvey-1985-icon-selection-table.md) |
| 19 | Architecture Working Group Discussions | | [p019](http://www.chilton-computing.org.uk/inf/literature/books/wm/p019.htm) | Downloadable procedures, i.e. "AJAX" in 1985 |
| 20 | Architecture Working Group Final Report | | [p020](http://www.chilton-computing.org.uk/inf/literature/books/wm/p020.htm) | |
| 21 | Application Program Interface Task Group | | [p021](http://www.chilton-computing.org.uk/inf/literature/books/wm/p021.htm) | |

The usual list is in [HN 14182061](https://news.ycombinator.com/item?id=14182061), [HN 15333967](https://news.ycombinator.com/item?id=15333967) and [HN 44838734](https://news.ycombinator.com/item?id=44838734). The usual footnoted version, [1] to [6], is in [HN 13783967](https://news.ycombinator.com/item?id=13783967) and [HN 22506237](https://news.ycombinator.com/item?id=22506237).

## Threads Don pulls out of it

### 1. AJAX in 1985: downloadable procedures
From the Architecture Working Group (ch. 19), as Don quotes it in [HN 7758677](https://news.ycombinator.com/item?id=7758677):
> "There was a general view that the ability to download procedures to the window manager was a good way to tailor facilities to applications, for example to filter out all mouse events for a particular application. The same effects can be obtained through table-driven systems, though downloading was felt to be more elegant. However, there is still more work to be done in this area."

And as he quotes it in [HN 13783967](https://news.ycombinator.com/item?id=13783967):
> "The possibility of allowing the client process to download a procedure to be executed in response to a specific class of input events was discussed, and felt to be desirable in principle. However, more work was needed to establish the practicality in general of programmable window managers. The success of Jim Gosling's SunDew project would be an indicator..."

Don's line on this: "AJAX was not invented in 2005 -- that's just a recent buzzword for a much older good idea." The same thread runs through [HN 29104860](https://news.ycombinator.com/item?id=29104860) ("5.3.4 Client Interaction") and [HN 34256293](https://news.ycombinator.com/item?id=34256293), where he extends it to NeFS, i.e. sending PostScript to the file system.

### 2. Policy outside the window system
From Gosling's SunDew §5.1, quoted in [HN 18695275](https://news.ycombinator.com/item?id=18695275) and [HN 33728301](https://news.ycombinator.com/item?id=33728301):
> "What is usually thought of as the user interface of the window system is explicitly outside the design of the window system. User interface includes such things as how menu title bars are drawn and what the desktop background looks like and whether or not the user can stretch a window by clicking the left button in the upper right hand corner of the window outline. All these issues are addressed by implementing appropriate procedures in the PostScript."

This is the argument that runs from SunDew through NeWS to Wayland. In [HN 20304763](https://news.ycombinator.com/item?id=20304763) Don says "Wayland didn't learn from the lessons on NeWS". [HN 47397280](https://news.ycombinator.com/item?id=47397280) (2026) is on *Separating the Wayland compositor and window manager*, and there Don pairs the SunDew paper with the ICCCM section of *The X-Windows Disaster*.

### 3. Synchronous input: the focus problem
[HN 37829387](https://news.ycombinator.com/item?id=37829387) (2023) is on *Firefox tooltip bug fixed after 22 years*. Don traces the fix back to SunDew §5.3.3 ("User Interaction - Input"): NeWS could block the input queue synchronously, "where asynchronous X11 window managers fall flat on their face by definition."

### 4. Tiling vs overlapping was a non-issue
From the UI Working Group, §17.2, quoted in [HN 15333967](https://news.ycombinator.com/item?id=15333967):
> "Some of the issues supplied to the Working Group were felt not to be issues at all; as an example, tiled and overlapped windows were seen to be merely options that the user interface designer could use if appropriate. Indeed, a user connected to more than one host, one providing a tiling environment and the other not, might well have both mechanisms to interact with at the same time."

This is why the book belongs in the **[Scott Jenson room](../../scott-jenson/)**. Scott's KDE Akademy talks reopen this question, and in 1985 the workshop had already said both answers are fine and the designer should choose. The same section also covers subwindows, grouping and title lines as subwindows, which is roughly Scott's box model forty years earlier.

### 5. What is an icon? Nobody agreed
From §18.8.4, quoted in [HN 7758677](https://news.ycombinator.com/item?id=7758677):
> "Icons are regular (small) pictograms which may be defined and changed by applications. They can serve many functions, frequently to conserve screen real estate. They can be used as an alternative to a window as in Cedar; as an alternative representation (perhaps concurrently visible) of the window (Sapphire); or as a representation of a task to be invoked or data which is to be operated on (STAR, ..."

Rosenthal's room has the full vocabulary table: [02-alvey-1985-icon-selection-table.md](../../david-rosenthal/02-alvey-1985-icon-selection-table.md). The fight over "selection" is the seed of the **[Unnatural Selection panel](../../../repo-shows/unnatural-selection/README.md)**, Ted Nelson × DSHR × Don, which is traced in [selection-clipboard-lineage.md](../../david-rosenthal/selection-clipboard-lineage.md).

### 6. "Gorilla effect"
Don repeats a Kasahara origami quote three times ([HN 29610274](https://news.ycombinator.com/item?id=29610274), [HN 33310872](https://news.ycombinator.com/item?id=33310872), [HN 36909609](https://news.ycombinator.com/item?id=36909609)), each time linking ch. 13:
> "You will get a better Gorilla effect if you use as big a piece of paper as possible." — Kunihiko Kasahara, *Creative Origami*

[HN 44050165](https://news.ycombinator.com/item?id=44050165) (2025) explains the link. Gosling & Rosenthal's Andrew chapter is "the first known use of the term 'Gorilla effect' as it applies to computer graphics". That comment also tells the story of how SunDew "convinced David to leave CMU and join him at Sun."

### 7. Standards guy vs PostScript
From [HN 34305868](https://news.ycombinator.com/item?id=34305868):
> "I love how James gently humors the standards guy (P. Bono) who suggests he should have considered the glorious "CGI graphics model" ... and seems incredulous that he is "ignoring the standards" by choosing PostScript over his favorite standard of the day in 1985, CGI."

See SunDew §5.4 Discussion. The transcripts of the discussions are the best part of the book.

### 8. Teitelman, corrected by Kay
[HN 34302718](https://news.ycombinator.com/item?id=34302718) is on Medley Interlisp. Don says Warren "was the manager of Sun's Multimedia Group in which I worked on NeWS, and his contributions to programming environments and user interface design at Xerox PARC were important and underrated."

[HN 34305506](https://news.ycombinator.com/item?id=34305506) points to Don's Medium compilation [*Alan Kay on web browsers, document viewers… NeWS*](https://donhopkins.medium.com/alan-kay-on-should-web-browsers-have-stuck-to-being-document-viewers-and-a-discussion-of-news-5cb92c7b3445). It contains Alan Kay's corrections to Teitelman's chapter, Rosenthal's corrections to Kay, and Sproull & Sutherland's *A Clipping Divider*. Rooms: [alan-kay](../../alan-kay/), [ivan-sutherland](../../ivan-sutherland/), [warren-teitelman](../../warren-teitelman/), [david-rosenthal](../../david-rosenthal/) ([window-systems-lineage.md](../../david-rosenthal/window-systems-lineage.md)).

### 9. Other SunDew-only citations
- [HN 11481228](https://news.ycombinator.com/item?id=11481228): "James Gosling wrote the original SunDew interpreter in a weekend, but the graphics stuff took years to get right." Don also proposes a clean-room NeWS in JavaScript.
- [HN 15680904](https://news.ycombinator.com/item?id=15680904): Pratt's Conix and Taylor's Pixscene, cited in the SunDew paper.
- [HN 19731713](https://news.ycombinator.com/item?id=19731713) and [HN 20304763](https://news.ycombinator.com/item?id=20304763): NeWS is not Display PostScript.
- [HN 22939432](https://news.ycombinator.com/item?id=22939432), [HN 22939768](https://news.ycombinator.com/item?id=22939768) and [HN 22947202](https://news.ycombinator.com/item?id=22947202) (PizzaTool): NeWS wasn't designed to replace X11; SunDew's goals came first.
- [HN 13783900](https://news.ycombinator.com/item?id=13783900) and [HN 13786536](https://news.ycombinator.com/item?id=13786536) (Unix-Haters): the AJAX lineage.
- [HN 29094938](https://news.ycombinator.com/item?id=29094938): Don's X11 window manager written in NeWS. He wanted a HyperLook WM; "Sun management wasn't having it".
- [HN 27485454](https://news.ycombinator.com/item?id=27485454) (Forth in 512 bytes), [HN 45512139](https://news.ycombinator.com/item?id=45512139) (Lua) and [HN 38477558](https://news.ycombinator.com/item?id=38477558) (browser on bare metal; the Wayland walls [Simon Schneegans](../../simon-schneegans/) hit).

## Every citation

These are Don's HN comments that link the book, in date order:
[7758677](https://news.ycombinator.com/item?id=7758677) ·
[11481228](https://news.ycombinator.com/item?id=11481228) ·
[13783900](https://news.ycombinator.com/item?id=13783900) ·
[13783967](https://news.ycombinator.com/item?id=13783967) ·
[13786536](https://news.ycombinator.com/item?id=13786536) ·
[14182061](https://news.ycombinator.com/item?id=14182061) ·
[15333967](https://news.ycombinator.com/item?id=15333967) ·
[15680904](https://news.ycombinator.com/item?id=15680904) ·
[18695275](https://news.ycombinator.com/item?id=18695275) ·
[19731713](https://news.ycombinator.com/item?id=19731713) ·
[20304763](https://news.ycombinator.com/item?id=20304763) ·
[20376976](https://news.ycombinator.com/item?id=20376976) ·
[22456710](https://news.ycombinator.com/item?id=22456710) ·
[22506237](https://news.ycombinator.com/item?id=22506237) ·
[22939432](https://news.ycombinator.com/item?id=22939432) ·
[22939768](https://news.ycombinator.com/item?id=22939768) ·
[22947202](https://news.ycombinator.com/item?id=22947202) ·
[27485454](https://news.ycombinator.com/item?id=27485454) ·
[29094938](https://news.ycombinator.com/item?id=29094938) ·
[29104860](https://news.ycombinator.com/item?id=29104860) ·
[29610274](https://news.ycombinator.com/item?id=29610274) ·
[33310872](https://news.ycombinator.com/item?id=33310872) ·
[33728301](https://news.ycombinator.com/item?id=33728301) ·
[33827923](https://news.ycombinator.com/item?id=33827923) ·
[34256293](https://news.ycombinator.com/item?id=34256293) ·
[34302718](https://news.ycombinator.com/item?id=34302718) ·
[34305506](https://news.ycombinator.com/item?id=34305506) ·
[34305868](https://news.ycombinator.com/item?id=34305868) ·
[36909609](https://news.ycombinator.com/item?id=36909609) ·
[37829387](https://news.ycombinator.com/item?id=37829387) ·
[38474858](https://news.ycombinator.com/item?id=38474858) ·
[38477558](https://news.ycombinator.com/item?id=38477558) ·
[40617894](https://news.ycombinator.com/item?id=40617894) ·
[44050165](https://news.ycombinator.com/item?id=44050165) ·
[44838734](https://news.ycombinator.com/item?id=44838734) ·
[45512139](https://news.ycombinator.com/item?id=45512139) ·
[47397280](https://news.ycombinator.com/item?id=47397280)

## Who in the house was there or is downstream

- **There in 1985:** [James Gosling](../../james-gosling/) (SunDew, Andrew), [David Rosenthal](../../david-rosenthal/) (Andrew), [Warren Teitelman](../../warren-teitelman/) (retrospective).
- **In the lineage:** [Alan Kay](../../alan-kay/) (Smalltalk; corrected Teitelman), [Ivan Sutherland](../../ivan-sutherland/) (Clipping Divider), [Neil Wiseman](../../neil-wiseman/) (Cambridge graphics), [Owen Densmore](../../owen-densmore/) (NeWS toolkit).
- **The questions are still open:** [Scott Jenson](../../scott-jenson/) (tiling vs overlap, again), [Brad Myers](../../brad-myers/) (UI toolkits; his window-manager taxonomy), [Ben Shneiderman](../../ben-shneiderman/) (direct manipulation), [Ted Nelson](../../ted-nelson/) (the invisible clipboard), [Simon Schneegans](../../simon-schneegans/) (Wayland walls).
