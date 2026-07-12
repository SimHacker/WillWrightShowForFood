# Selection, clipboard, and inter-client data

Per-system taxonomy for the **unnatural-selection** show: Ted Nelson (anti-invisible-clipboard) × David Rosenthal (ICCCM author) × Don (NeWS/TNT trenches).  
Machine index: [`selection-clipboard-lineage.yml`](selection-clipboard-lineage.yml) · **Consent:** `not_yet_asked`

**Show:** [unnatural-selection](../../repo-shows/unnatural-selection.yml) · **Alvey 1985:** [window-systems lineage](window-systems-lineage.md#alvey-workshop-1985)

---

## Nomenclature wild west

At the **1985 Alvey Methodology of Window Management** workshop, working groups fought over vocabulary — window vs viewport vs panel vs icon vs gadget — before architecture. **Teitelman's** retrospective named a dozen systems in one room; each had shipped its own words for the same gestures.

**Teitelman covers:** Smalltalk, Interlisp-D, Tajo, Cedar Viewers, SunWindows, SunDew

**Show beat:** Walk the table — what did each system call an "icon"? What counted as "selection"?

---

## Ted Nelson — invisible clipboard

**Copy-and-paste to an invisible clipboard is evil** — Ted's recurring Repo Show hook. Hypertext should show **visible parallel connections** (Xanalogical links), transclusion, documents you can see — not shovel bytes into a hidden scrap.

| Resource | Link |
|----------|------|
| Catalog | [invisible-clipboard-rant-catalog.yml](../ted-nelson/sources/invisible-clipboard-rant-catalog.yml) |
| Flagship video | [YouTube](https://www.youtube.com/watch?v=u5NECkdOSqs) |
| Scissors demo | [YouTube](https://www.youtube.com/watch?v=6_35RDA6r3g) |
| Invitation | [ted-nelson/invitation.md](../ted-nelson/invitation.md) |

**Contrast Mac:** Lisa/Mac scrap — separate from X11 primary selection; Ted + Don align against invisible buffer.

**Show ask:** Is primary selection (highlight + middle-click) more "visible" than Ctrl+C clipboard? Or same sin?

---

## X11 / ICCCM model

**Author:** David S. H. Rosenthal (~1988) — *Inter-Client Communication Conventions Manual*, Part III of Scheifler & Gettys.

**Why it exists:** X user environment = clients + X server + **window manager**. WM allocates windows; clients must negotiate cut/paste, drag-drop hints, session, colormaps, focus — without a kernel message bus. ICCCM is the treaty.

### Selection atoms

| Atom | What | Parker gripe |
|------|------|--------------|
| **PRIMARY** | Highlighted text — traditionally mouse-select, middle-click paste | "All anyone ever fucking does with the selection is COPY TEXT!!" |
| **SECONDARY** | Alternate selection — largely unused | "Who the fuck uses the SECONDARY selection?" |
| **CLIPBOARD** | Explicit copy (Ctrl+C) — persists after source exits if owner saves it | Often confused with PRIMARY on modern desktops |

### Protocol pain

- Everything is **Atoms** (integer names for strings)
- TARGETS negotiation — request formats before transfer
- Incremental transfer for large data — property chunks + DELETE_PROPERTY
- SelectionNotify type vs property type ambiguity
- TIMESTAMP for ordering concurrent selection claims
- **CUT_BUFFER0..7** — original X11 paste (root-window properties); XStoreBuffer/XFetchBuffer; **XRotateBuffers** rotates slots via RotateProperties

**Xmu magic atoms:** Xmu routines query selection owner for HOSTNAME, IP_ADDRESS, USER — "About as reliable as cleaning your motherboard with fried eel" (Parker).

→ [Conrad Parker rant (2001)](sources/conrad-parker-icccm-rant-2001.md) · [Sun Deskset flame (1990)](sources/1990-10-sun-deskset-flame.md)

---

## XRotateBuffers

**XRotateBuffers** — Xlib wrapper for protocol **RotateProperties**. Rotates CUT_BUFFER0..7 property assignments on the root window (n → n+1 mod 8) without copying data. Cut buffers predate PRIMARY/CLIPBOARD; original X11 paste via XStoreBuffer/XFetchBuffer. Obsolete but protocol remains. **Not** pixmap double-buffering.

**Show beat:** "Sit on it and rotate, Ralf"

---

## Systems taxonomy

Research notes for on-air correction by guests — not authoritative history.

| System | Selection model | Icon / term |
|--------|-----------------|-------------|
| **Sketchpad** (1963) | Light pen + constraints; no clipboard | Pre-icon vocabulary |
| **Smalltalk** (76–80) | Morph/object selection; inspectors on selected object | Icons as **Morphs**; Teitelman Alvey anchor |
| **Interlisp-D** | DWIM on text; Teitelman client–server windows | D-Lisp windows; Warren → Don's NeWS Toolkit manager |
| **Cedar / Xerox** | Viewers — strongly typed | Cedar/Viewers ecosystem |
| **Star** (1981) | Object selection + property sheets | Desktop **icons** — document-centric; Mac influence |
| **ViewPoint** | Document + icon desktop | Office-metaphor icons |
| **Tajo** | Teitelman retrospective entry | Less documented than Smalltalk/Star |
| **Andrew** (CMU 83–86) | Andrew WM + datastream metaphors | Andrew **icons**; Gosling + Rosenthal Alvey 1985 paper |
| **X10** (MIT 1986) | Early X selection; DSHR Sun/1 port | Terminology still fluid; NeWS 1.0 shipped X10 layer |
| **X11 / ICCCM** (87–88) | PRIMARY/SECONDARY/CLIPBOARD treaty | WM_ICON_NAME, WM_HINTS |
| **SunView** | SunView selection + SunWindows | Deskset ancestor |
| **NeWS** (1987) | PostScript-level selections; send code not atoms | Lost political war to X11; co-author Rosenthal |
| **InterViews** (Stanford 88) | C++ InterViews widgets | **Glyphs** — icon avoided? |
| **Motif / Xt** | Xt selection APIs; XmClipboard_* | Vendor shell icons |
| **XDE** (Xerox) | Star/ViewPoint document model | Not "X Desktop Environment" — confirm on air |
| **Mac / Lisa** (1983) | Scrap **clipboard** — Ted's target | Susan Kare desktop icons |

**Show beat:** East coast office metaphor (Star) vs West coast Unix (X) vs Smalltalk objects.

### Deskset / calm computing

→ [Deskset flame](05-deskset-weiser-vickie-context.md) · [Don XBugTool](../don-hopkins/sources/xbugtool-bug-1059974.md) · Weiser/Vickie — ask consent before on-air

---

## Classic flames

| Who | Role |
|-----|------|
| [Conrad Parker (2001)](https://github.com/porridgewithraisins/x11cp/blob/main/rant) | Implementor vs ICCCM |
| [David Rosenthal (1990)](https://www.donhopkins.com/home/catalog/unix-haters/slowlaris/deskset.html) | Author vs Deskset whizzy |
| Theo / many-eyes | HN sidebar — ESR/Linus takedown |
| Mark Crispin / Emacs | "Defaults must not change" — parallel Grr tradition |

---

## Show questions

1. Ted — reprise invisible-clipboard rant; is PRIMARY selection any better?
2. DSHR — why PRIMARY and SECONDARY and CLIPBOARD? What would you delete in 2026?
3. What did Andrew do before ICCCM froze the X11 answer?
4. NeWS inter-client — code in flight vs Atom carrier pigeons
5. Alvey 1985 — did the nomenclature working group ever agree on "icon"?
6. XRotateBuffers — cut buffers predate ICCCM selections
7. Deskset Lichtenstein PS — calm computing before Weiser named it?
8. Who still queries TARGETS? Who uses XA_SECONDARY?
9. Transclusion vs selection — can a Repo Show demo both in one repo?

↑ [00-START-HERE](00-START-HERE.md) · [window-systems lineage](window-systems-lineage.md) · [ideas](ideas.md)
