# Ideas to explore with Arthur van Hoff 🎷

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in Arthur's
public work and documented connections to this repository. Things Don would love to follow
**with** Arthur van Hoff; not quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.yml) · invitation guest · consent not_yet_asked

## What Arthur has done

Arthur van Hoff — Dutch programmer; great long-time friend of Don with many shared projects. At the **Turing Institute (Glasgow)** he built **GoodNeWS → HyperNeWS → HyperLook** (a NeWS/PostScript reimagining of HyperCard) and **PdB** (C-to-PostScript). On the early **Java** team at Sun he wrote the **Java compiler in Java** and worked on **AWT** (widely used) and **HotJava**. Co-founded **Marimba** (**Castanet + Bongo**). **Danny Goodman** — *Complete HyperCard Handbook* **and** the Bongo/Castanet book; he totally **gets** the lineage. HyperLook reached fewer people than AWT — Don suspects it's the line Arthur is **prouder of**; good show question. Later: TiVo, Flipboard, Jaunt VR, Apple.

Don ↔ Arthur: **Turing (Glasgow)** → Don's **IFC vs Bongo** essay at Interval (1996–1997) → **Jaunt VR (Palo Alto)** contractor overlap (2016–2017).

## Shared ground

*Topics that connect Arthur van Hoff's work to this repo — public themes only.*

- HyperLook — HyperCard on NeWS; shaped windows; SimCity front-end; Axis of Eval
- Lineage: **HyperCard → GoodNeWS → HyperNeWS → HyperLook → Bongo (Java)**
- **Danny Goodman** — *Complete HyperCard Handbook* **and** *Official Marimba Guide to Bongo* / Castanet; he **gets it**
- [**IFC vs Bongo**](../don-hopkins/ifc-vs-bongo-comparison.md) — Don read/analyzed two Java UI frameworks from **experience**: IFC bad, Bongo good *(in that order)*; Arthur's **Jan 1997 email** in the doc
- [**MediaFlow**](../don-hopkins/mediaflow-design-comments.md) cites Bongo **`getProperties`** — persistence + property sheets → modern **yaml-jazz** / MOOLLM CARD.yml echo
- PdB · Freaky Putty · button sticking out of the frame

## The hooks

### 1. Show seed: `repo-shows/arthur-van-hoff/` / NeWS reunion arc

Walk the repo on air. Strong fit for [**NeWS reunion**](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/REPO-SHOWS.yml) with Gosling, Rosenthal, Owen Densmore — or solo **`arthur-van-hoff-hyperlook.yml`**.

### 2. HyperLook → Bongo — one thread, two languages

On air, walk the lineage Arthur actually shipped:

```text
HyperCard → GoodNeWS → HyperNeWS → HyperLook (PostScript) → Bongo (Java)
```

Same architect at the pivot. **HyperLook at Turing with Don**; **Bongo/Castanet at Marimba**. **Danny Goodman** wrote both the HyperCard handbook and the Bongo book — Marimba's doc choice proves the lineage. What transferred cleanly? What had to be reinvented leaving PostScript? [`hyperlook-news-postscript-simcity.md`](../don-hopkins/hyperlook-news-postscript-simcity.md)

### 3. ★ IFC vs Bongo — read two frameworks, compare on air

**Flagship episode material.** Don's full essay is inlined: [`ifc-vs-bongo-comparison.md`](../don-hopkins/ifc-vs-bongo-comparison.md).

Conversation starters *(Don's journey, not a debate scorecard)*:

| Topic | Why Arthur |
|-------|------------|
| **Bad vs good Java UI (in that order)** | Don used both at Interval — IFC's string Targets vs Bongo's compile-time scripts |
| **`getProperties`** — persistence **and** metadata | Property sheets from dictionaries; Arthur built it; Don links to **MOOLLM yaml-jazz** today |
| **Danny Goodman — HyperCard book → Bongo book** | He *gets* stack authoring → Castanet channels; ask Arthur why they picked Danny |
| **AWT vs HyperLook — reach vs pride** | AWT touched millions; HyperLook fewer — which lineage matters more to Arthur? |
| **JavaBeans vs Bongo vs IFC** | Who was right about the component-war mess? Swing happened; Castanet channel story |
| **Container inheritance** | Bongo feature IFC lacked — still relevant for declarative UI (Svelte `$derived`, MOOLLM rooms) |
| **HyperLook `Send` delegation** | Bongo lacked it — worth reviving for networked microworlds? |
| **Reading code as craft** | Don's preface pattern — study expert frameworks, write the interpretation (pairs with MediaFlow essay) |

**Arthur's Jan 1997 reply** is in the doc — revisit line by line: JDK 1.1, Beans, PC look-and-feel, content-oriented builder.

Cross-read: [MediaFlow Bongo §](../don-hopkins/mediaflow-design-comments.md#namespaces-persistence-and-the-web) · [Pluggers survey](https://donhopkins.com/home/interval/pluggers) · [YAML Jazz trail](../../process/trails/yaml-jazz-collaboration-stack.md)

### 4. Turing Glasgow → Jaunt Palo Alto — friendship thread

Not nostalgia — **continuity of collaboration**: HyperLook demos, Interval criticism (loving), later VR player work. What would HyperLook/Bongo look like with **Morphic.js / Snap! / MOOLLM rooms** now?

### 5. HyperLook article — hero-image, HyperCard, shaped windows

### 6. PdB — C-to-PostScript compiler; Axis of Eval

### 7. Freaky Putty — interactive image goo-ing toy

### 8. Button sticking out of the window frame

## Sources (public)

- [`invitation.md`](invitation.md)
- Don essays: [`ifc-vs-bongo-comparison.md`](../don-hopkins/ifc-vs-bongo-comparison.md) · [`mediaflow-design-comments.md`](../don-hopkins/mediaflow-design-comments.md)
- Show seeds: [`REPO-SHOWS.yml`](../../repo-shows/REPO-SHOWS.yml) (`arthur-van-hoff-hyperlook.yml`, NeWS reunion)
- [`CHARACTER.yml`](CHARACTER.yml) · correspondence: `correspondence/arthur-van-hoff.yml` (HyperLook review 2018, IFC-vs-Bongo 2019)
