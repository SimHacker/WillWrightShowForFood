# Apple HIG, the "<" submenu buffer, and the Fitts quiz (readable edition)

*Verifiable design history — the technical spine of the Tog × Don conversation.
**Source of truth:** [`apple-hig-and-menus.yml`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/bruce-tognazzini/sources/apple-hig-and-menus.yml) —
this page is rendered for humans; the YAML drives the machines.*

## The Apple Human Interface Guidelines

Tog joined Apple in 1978 (employee #66), founded the Human Interface Group, and wrote the Apple
Human Interface Guidelines through ~8 editions over 14 years. The 1987 edition explains and
JUSTIFIES its decisions — submenu delay values, drag-delay forgiveness — "required reading for
serious user interface designers, the same way serious art students should contemplate the Mona
Lisa" (Don, HN).

**Editions:**

- [1987 Apple Human Interface Guidelines](https://archive.org/details/applehumaninterf00appl) (Internet Archive)
- [1995 Macintosh HIG](http://interface.free.fr/Archives/Apple_HIGuidelines.pdf) (PDF)

**Key pages:** 1987 pp. 87–88 — submenu delay + drag delay, Figure 3-42 "Dragging diagonally to
a submenu item"; 1995 p. 79 — hierarchical menus, brief delay before submenus appear.

## The "<" submenu buffer — a 40-year provenance chain

Tog invented (1986) the "<"-shaped buffer zone so users can drag diagonally toward a slide-out
submenu, crossing sibling items, without the submenu vanishing.

| Link in the chain | Contribution |
|-------------------|--------------|
| **Jim Batson** | Worked out the math and coded it for Mac OS (per Tog) |
| **Frank Leahy** | Rewrote the Menu Manager for Mac SE / Mac II. Don worked with him at Current TV and told him the 1987 HIG documented that subtle feature — Frank was touched somebody noticed. Don didn't realize he was explaining Frank's own work to him; it was just an interesting topic to chat about, and Frank seemed to get it. |
| **NeXT regression** | The NeXT folks, coming to Apple, copied Windows rather than the Mac (Tog) |
| **Amazon** | Resurrected the algorithm in the mega-dropdown; Tog weighed in on the bjk5 post |
| **Brad Myers** | *Pick, Click, Flick!* p. 171 covers exactly this — diagonal-path frustration [Kobayashi 2003] and the delay-based fix — which is why Don mailed Brad the Tog/Leahy/Batson provenance in July 2023 |

**Links:**

- [Breaking down Amazon's mega-dropdown](https://bjk5.com/post/44698559168/breaking-down-amazons-mega-dropdown) (Tog comments in-thread)
- [Dropdown menus with more forgiving mouse movement paths](https://css-tricks.com/dropdown-menus-with-more-forgiving-mouse-movement-paths/) (CSS-Tricks)
- [Raymond Chen: why menu show delay](https://blogs.msdn.microsoft.com/oldnewthing/20080619-00/?p=21903)

## A Quiz Designed to Give You Fitts

[The classic column](https://www.asktog.com/columns/022DesignedToGiveFitts.html) — the mile-high
menu bar, the five biggest pixels, edge targets. Don's decades-long friendly counterpoint: pie
menus give the Fitts benefit in ALL directions without exiling the cursor; big/multiple monitors
break the infinite edge. Both agree on the law; the conversation is about the geometry.
[HN thread](https://news.ycombinator.com/item?id=32993307).

## Demo war stories

- Steve Jobs at EduCom '88 — pie menu demo, not convinced (Don + Ben Shneiderman)
- Don Norman at NPUC, early '90s — also not convinced
- Blender adopted pie menus and ran with them anyway

## See also

- [Correspondence digest](../correspondence.md)
- [Pie menus: CHI '88 and beyond](../../don-hopkins/pie-menus-chi-88-and-beyond.md)
- [Brad Myers — ideas](../../brad-myers/ideas.md)

↑ [Sources index](README.md) · [Tog's room](../README.md) · [Invitation](../invitation.md) · [Show seed](../../../repo-shows/ask-tog.md)
