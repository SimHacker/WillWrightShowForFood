# ICCCM — the XWindows treaty

DSHR: *"You wrote the XWindows treaty."*

Don has snarkily called ICCCM **I39L** — starts with I, way too many letters, ends with L — in the unix-haters X-Windows ICCCM section. He's made peace with it. Also made peace with **Jim Gettys** (OLPC). David has thick skin; Don has utmost respect, admiration, fondness. 

---

## What ICCCM is

The **Inter-Client Communication Conventions Manual** (~1988, David S. H. Rosenthal) — Part III of Scheifler & Gettys. X's world = clients + server + **window manager**. WM allocates decoration;
clients must negotiate cut/paste, drag-drop hints, colormaps, focus — without a kernel message bus.
ICCCM is the **treaty** between hostile sovereigns who must share a desktop.

---



## Treaty metaphors (pick one on air)


| Treaty                          | Why it fits                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Treaty of Westphalia (1648)** | Many independent states agree to coexist; each retains sovereignty; endless appendices on borders |
| **Congress of Vienna (1815)**   | After a war nobody won cleanly; status quo restored with extra paperwork                          |
| **Versailles (1919)**           | Punitive complexity imposed on losers; seeds decades of resentment (NeWS → X11?)                  |
| **Sykes-Picot**                 | Arbitrary lines drawn through incompatible territories; everyone pretends it's natural now        |
| **Geneva Conventions**          | Rules for humane behavior between parties that would rather shoot each other                      |


**Ask David:** which real treaty is closest? 

---



## Selection atoms (the treaty articles)


| Atom             | Role                           | Parker gripe                               |
| ---------------- | ------------------------------ | ------------------------------------------ |
| `XA_PRIMARY`     | Highlight + middle-click paste | "All anyone does is COPY TEXT"             |
| `XA_SECONDARY`   | Modal alternate                | "Who uses SECONDARY?"                      |
| `XA_CLIPBOARD`   | Ctrl+C persistence             | Confused with PRIMARY on modern desktops   |
| `CUT_BUFFER0..7` | Original X11 paste (root properties); `XRotateBuffers` / RotateProperties | Predates selections |
| `TARGETS`        | Format negotiation             | SelectionNotify vs property type ambiguity |


Implementor rant: `[sources/conrad-parker-icccm-rant-2001.md](sources/conrad-parker-icccm-rant-2001.md)`

---



## NeWS counterfactual

NeWS inter-client = **PostScript programs in flight** — not Atom carrier pigeons. Lost political war
to X11; DSHR built **both sides**. `[../don-hopkins/sources/1991-09-news-tnt-icccm-death-match.md](../don-hopkins/sources/1991-09-news-tnt-icccm-death-match.md)`

---



## Repo beat: transclude don't copy

Audience challenge: **don't name it ClipRepo** — invent a word that illuminates replacing invisible
clipboard with **git-visible** transfer. Throw to guests + chat.

↑ [00-START-HERE](00-START-HERE.md)