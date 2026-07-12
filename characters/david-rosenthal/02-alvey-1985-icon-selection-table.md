# Alvey 1985 — icon vs selection (expandable table)

**Workshop:** *Methodology of Window Management* — 29 April – 1 May 1985, Cosener's House, Abingdon  
**Proceedings:** [Springer](https://link.springer.com/book/10.1007/978-3-642-70919-7) · [Chilton index](http://www.chilton-computing.org.uk/inf/literature/books/wm/index.htm)

Day 1: invited papers (Gosling, Rosenthal, Teitelman, …). Day 2: working groups fight vocabulary.
Day 3: reports. **Add rows and columns in discussion** — this table is a living show prop.

---

## Table


| System              | Era         | What is an **icon**?             | What is **selection**?          | Clipboard / transfer        | Notes                                                  |
| ------------------- | ----------- | -------------------------------- | ------------------------------- | --------------------------- | ------------------------------------------------------ |
| **Sketchpad**       | 1963        | (none)                           | Light pen + constraints         | None                        | Direct manipulation                                    |
| **Smalltalk**       | 76–80       | **Morph** (object in world)      | Selected morph → inspector      | Duplicate object ref        | Teitelman anchor                                       |
| **Interlisp-D**     | 70s–80s     | D-Lisp windows                   | Text + DWIM                     | Advice streams              | Teitelman                                              |
| **Cedar / Viewers** | Xerox       | **Viewer** glyphs                | Typed viewer selection          | Cedar integration           | Not Mac icons                                          |
| **Star**            | 1981        | Desktop **document icons**       | Object + property sheet         | Office scrap metaphor       | Mac lineage                                            |
| **ViewPoint**       | Xerox       | Desktop icons (Star successor)   | Document-centric                | Office metaphor             |                                                        |
| **Tajo**            | Xerox       | (workshop list)                  | Teitelman retrospective         |                             | Less public docs                                       |
| **Andrew**          | CMU 83–86   | Andrew **icons** in networked FS | WM + datastreams                | Distributed env             | **Gosling + Rosenthal**                                |
| **X10**             | MIT 1986    | Terminology fluid                | Early X selection               |                             | DSHR Sun/1 port                                        |
| **X11 + ICCCM**     | 87–88       | `WM_HINTS` pixmap+mask           | PRIMARY / SECONDARY / CLIPBOARD | Atoms, TARGETS, incremental | **DSHR treaty**                                        |
| **SunView**         | 1980s       | SunWindows toolbars              | SunView selection               |                             | Deskset ancestor                                       |
| **SunDew → NeWS**   | 1987+       | PostScript-drawn                 | PS-level state                  | **Send code** not atoms     | Gosling; lost to X11                                   |
| **InterViews**      | Stanford 88 | **Glyphs**?                      | C++ widget selection            |                             | Verify on air                                          |
| **Motif / Xt**      | 80s–90s     | Vendor shell icons               | `XmClipboard_`*                 | ICCCM wrapper               | Parker-era pain                                        |
| **XDE**             | Xerox       | Star/ViewPoint dev environment   | ?                               |                             | **Xerox Development Environment** — OS/UI/IDE for Star |
| **Mac / Lisa**      | 1983        | Kare desktop icons               | Highlight + **invisible scrap** | Ted's rant target           |                                                        |
| **NeWS Toolkit**    | ~1990       | PS classes                       | TNT selection model             | vs ICCCM politics           | Don + Owen + Teitelman manager                         |


---



## Discussion prompts for David + James

1. Did the nomenclature working group ever agree on **icon**?
2. What did Andrew call selection before ICCCM froze the X11 answer?
3. **XDE** — what terms did Star/ViewPoint developers use in the Xerox Development Environment?
4. Add a column: **drag-and-drop** — who had it, who faked it?
5. Add a row: **Andrew WM paper** vs **SunDew paper** — same room, different futures

---



## XRotateBuffers — cut buffers, not double-buffering

Two levels:

| Layer | Name |
|-------|------|
| Xlib | `XRotateBuffers(display, rotate)` |
| Protocol | **RotateProperties** — server-side request |

`XRotateBuffers()` is not client-side pixmap double-buffering. It sends **RotateProperties** to the
server to rotate the eight predefined cut-buffer properties on the **root window**:
`CUT_BUFFER0` … `CUT_BUFFER7`.

Conceptually the slots become `CUT_BUFFERn` → `CUT_BUFFER(n+1 mod 8)` **without copying data** —
the server rotates property assignments only. `rotate` may be positive or negative.

**History:** Cut buffers **predate** PRIMARY / CLIPBOARD selections. They were X11's original
copy/paste — eight root-window properties, typically via `XStoreBuffer()` / `XFetchBuffer()`.
Obsolete today, superseded by the selection protocol; **RotateProperties** remains for compatibility.

A server-side rotate primitive for paste is unusual — one of those odd 1980s X corners that belongs
in the "how much X11 for a paste?" riff. Show beat: *Sit on it and rotate, Ralf.*

---

↑ [00-START-HERE](00-START-HERE.md)