---
title: "NetScape IFC vs Marimba Bongo — A Comparison"
author: Don Hopkins
character_id: don-hopkins
canonical_url: https://donhopkins.com/home/interval/ifc-vs-bongo.html
machine_index: history/interval-research.yml
---

# NetScape's Internet Foundation Classes and Marimba's Bongo

**Don Hopkins · Interval Research Corporation · written 1996–1997**

| | |
|---|---|
| **Era** | Interval (Camelot) — alongside [MediaFlow](mediaflow-design-comments.md), [Pluggers](https://donhopkins.com/home/interval/pluggers), Bounce COM-on-wires |
| **Method** | Reading, analyzing, reflecting — comparing **two Java UI frameworks from experience**: one bad, one good *(in that order)* |
| **Original** | [donhopkins.com/home/interval/ifc-vs-bongo.html](https://donhopkins.com/home/interval/ifc-vs-bongo.html) |
| **Machine index** | [`history/interval-research.yml`](history/interval-research.yml) |
| **Topics** | IFC · Bongo · Marimba · Castanet · HyperLook · Java · Arthur van Hoff · property sheets · component wars |

---

## Preface — a bad framework and a good one

Same impulse as [MediaFlow](mediaflow-design-comments.md#preface--reading-design-as-a-journey): **read expert work closely, write the journey of interpretation.** Here the subject is not Lisp but **Java UI frameworks** — two contemporaries Don had actually used.

**IFC first** (Netscape's Internet Foundation Classes) — the **bad** one in this comparison: string-based Target notifications, duplicated AWT wrappers, modal-dialog poison, metadata baked into Java source without a macro preprocessor. NeXTStep refugees painting themselves into a pre–JDK 1.1 corner.

**Bongo second** (Marimba) — the **good** one: HyperLook's ideas **reimplemented in Java** instead of PostScript, by the **same architect** who built HyperLook — who also wrote the **Java compiler in Java** and worked on **AWT** at Sun. **AWT** reached far more people; Don suspects Arthur is **prouder of HyperLook** (smaller audience, bigger microworld). Bongo/Castanet carry that HyperLook spirit into Java deliberately.

Don knew [**Arthur van Hoff**](../arthur-van-hoff/README.md) from the **Turing Institute in Glasgow** (HyperLook era) and worked with him again later at **Jaunt VR in Palo Alto**. This essay is friendship plus craft criticism, not a vendor whitepaper.

**Navigate:** [MediaFlow — Bongo persistence §](mediaflow-design-comments.md#namespaces-persistence-and-the-web) · [Interval overview](interval-research-pluggers-and-mediaflow.md) · [Arthur van Hoff](../arthur-van-hoff/README.md) · [YAML Jazz trail](../../process/trails/yaml-jazz-collaboration-stack.md)

---

## Introduction

**Bongo lineage** (Arthur van Hoff, one continuous thread):

```text
HyperCard → GoodNeWS → HyperNeWS → HyperLook (NeWS/PostScript) → Bongo (Java)
```

Same person at each step where it mattered: **HyperLook** at the Turing Institute; **Java compiler in Java**, **AWT**, **HotJava** at Sun/First Person; **Bongo + Castanet** at **Marimba**. **Danny Goodman** wrote *The Complete HyperCard Handbook* **and** *The Official Marimba Guide to Bongo* — he totally **gets it**: stack authoring → push channels → visual Java UI. Don's [MediaFlow essay](mediaflow-design-comments.md) cites Bongo's dictionary persistence — this document is the full **IFC vs Bongo** analysis behind that paragraph.

> **MOOLLM echo (2026):** Bongo's **`getProperties`** — persistence **and** user-level metadata in one interface, dynamic property sheets from dictionaries — maps to **yaml-jazz**: CARD.yml metadata, comments as intent. [`import-self-from-self.md`](import-self-from-self.md)

Arthur's **Jan 1997 email** reply is [appended below](#arthur-van-hoff-responds-jan-1997).

*Below: the 1996–1997 comparison, inlined. Original voice preserved.*

---

## Contents

- [Preface — a bad framework and a good one](#preface--a-bad-framework-and-a-good-one)
- [Introduction](#introduction)

1. [Executive summary](#executive-summary)
2. [Origins — NeXTStep vs HyperLook](#origins--nextstep-vs-hyperlook)
3. [Messages, metadata, and reflection](#messages-metadata-and-reflection)
4. [Persistence and property sheets](#persistence-and-property-sheets)
5. [Containers and inheritance](#containers-and-inheritance)
6. [IFC critique — design and bugs](#ifc-critique--design-and-bugs)
7. [Component framework wars](#component-framework-wars)
8. [Arthur van Hoff responds](#arthur-van-hoff-responds-jan-1997)
9. [See also](#see-also)

---

## Executive summary

This is a comparison of two component frameworks for Java: **IFC** and **Bongo**.

| | **IFC** | **Bongo** |
|---|---------|-----------|
| **From** | Netscape (former NeXT — **bad** fork in Don's experience) | Marimba — **Bongo + Castanet** (**good** fork) |
| **Lineage** | NeXTStep (Objective C) | HyperCard → GoodNeWS → HyperNeWS → **HyperLook** → **Bongo** (Java) |
| **Architect** | Netscape/IFC team | [**Arthur van Hoff**](../arthur-van-hoff/README.md) — Turing Glasgow · Java compiler · AWT · HyperLook · Marimba |

**Don's verdict (1996–1997):**

> It was **too early** to write a Java toolkit before **JDK 1.1**. IFC went and did a lot of its own stuff, which would have to be **drastically changed** to take advantage of new language features. Bongo is not as far down the road of painting itself into a corner. If effort is put into bringing Bongo up to date with JDK 1.1, it will be a **better framework** than IFC.

**Java Beans** remained a big unknown — Don feared it would push competing frameworks out of the limelight instead of providing a low-level substrate (like the TNT ClassCanvas). Arthur agreed Beans was "big" but believed it was the right integration path at coarser granularity.

**History note:** IFC's trajectory became **Swing**; Bongo was overshadowed by the JavaBeans announcement — predictions in this doc were largely right about the mess, wrong about ActiveX winning the web.

---

## Origins — NeXTStep vs HyperLook

### IFC — NeXTStep in Java (the wrong fork)

**IFC (Internet Foundation Classes)** — Netscape. Former **NeXT** developers (company Netscape acquired). Lineage: **NeXTStep** (Objective C). Don's read: too early, too many parallel class hierarchies, wrong abstraction level for Java.

### Bongo — HyperLook in Java (the right fork)

**Bongo** — **Marimba** (`Bongo` + **Castanet** push channels). Not a random Sun exodus product — deliberate port of the **HyperLook** microworld stack from PostScript to Java:

| Stage | What |
|-------|------|
| **HyperCard** | Stacks, messages, direct manipulation authoring |
| **GoodNeWS → HyperNeWS** | NeWS window system experiments |
| **HyperLook** | Arthur van Hoff + Don at **Turing Institute, Glasgow** — HyperCard on NeWS/PostScript; PdB compiler; SimCity front-end; shaped windows |
| **Bongo** | Same ideas, **Java instead of PostScript** — Marimba, mid-1990s |

**Arthur van Hoff** — architect throughout: HyperLook (the work he'd likely point to first), **Java compiler written in Java**, **AWT** and **HotJava** at First Person/Sun (widely deployed; Bongo stayed AWT-friendly on purpose — see his Jan '97 mail). Jonathan Payne on Bongo text editor (Jove, HotJava).

**Danny Goodman** — *The Complete HyperCard Handbook* **and** *The Official Marimba Guide to Bongo* (Castanet channel authoring in the same stack-and-script spirit). When Marimba picked Danny to document Bongo, that was a signal: HyperCard lineage carried forward on purpose, not accident.

Don and Arthur: **Turing Institute (Glasgow)** → Interval-era this essay → **Jaunt VR (Palo Alto)** later. [Arthur's guest room](../arthur-van-hoff/README.md).

Bongo was **fresh and clean**, well matched with Java, but still had a long way to go.

---

## Messages, metadata, and reflection

### IFC — string-based Target notifications

IFC's **Target** notification model is **cheezy**, based on **command strings**. OLE at least binds names to more efficient tokens. Components cannot expose metadata about notification messages they handle, except via **ExtendedTarget** — and only for *particular* messages, not a list of all messages.

IFC blurs **class metadata** with **object state**: e.g. text fields answer "no" to paste/copy when not editable — instead of exposing editability as a property.

> To be easily reusable, an object must be able to send an arbitrary message to another object **without knowing the type** of the receiving object.

Static Java interfaces don't support runtime data-driven dispatch — hence message strings.

**IFC doesn't enumerate** supported message strings. Visual programming tools can't discover what messages are sometimes valid.

### Bongo — compile-time binding via script editor

Bongo has **no separate message-dispatch interface**. Handlers invoke methods directly — the **script editor dynamically compiles Java** that defines handlers and can send any message to any object. Message names bind at **script compile time**, not string compare at runtime.

Bongo should use **JDK 1.1 reflection** rather than invent an ad-hoc anemic messaging interface like IFC.

### What components need to expose

Reflection alone is **too low level** for ActiveX-grade frameworks. Components need:

- Grouping properties/methods into categories  
- Ranges, constraints, preconditions, postconditions  
- Enumerated types with meaningful labels  
- Custom property sheets and editors  

**OLE type libraries** (and MIDL) address this; Java needed one coherent metadata story — Sun was late; Microsoft had been deploying COM type libraries for years.

---

## Persistence and property sheets

> *This section is why the [MediaFlow essay](mediaflow-design-comments.md#namespaces-persistence-and-the-web) cites Bongo — persistence and UI metadata in one mechanism.*

**Bongo** exposes component properties through the persistence mechanism's **`getProperties`** method. The interface editor's property sheet gets names, values, and metadata (e.g. enumerated choice mappings) through that single path — **combining persistence with user-level property metadata, killing two birds with one stone.**

IFC has similar persistence, but Bongo exports **higher-level** information (enumerated choices; default values when undefined). Don wanted even richer metadata: value ranges, time types, custom editors — e.g. a **four-edge glue** widget, or a foreground/background color editor with **Mr. Yuck / Smiley Face** contrast feedback.

**Bongo component lifecycle** (as in MediaFlow):

1. Created **uninitialized** without arguments  
2. Given a **dictionary** to initialize from  
3. On persist, returns a **dictionary** of all state it cares about  
4. Property sheet **generated dynamically** from dictionary + metadata  

**MOOLLM read:** yaml files + CARD.yml + GLANCE→CARD→SKILL pyramid = the same pattern for **skills and character rooms** — externalized state, machine-readable metadata, human-editable property sheets without a separate persistence format.

Bongo lacks HyperLook's **Send** delegation (component → card → background → stack → net). Don wanted Castanet messaging integration and encapsulation of presentations by high-level messages.

Both Bongo and IFC can **hide internal runtime state** from persistence (e.g. text cursor blink flag) — only user-relevant subset exposed.

---

## Containers and inheritance

**Bongo** supports inheriting properties (colors, fonts) from the **containment hierarchy** as well as the class hierarchy — **container inheritance**. IFC doesn't; even OLE lets components inherit from containers.

**User-level vs implementation-level contents:** ScriptX and Bongo containers keep a separate **`contents`** instance variable for user-level widgets vs chrome (title bars, scroll bars). Scrolling panels need two levels: scroll bars stay fixed; contents sub-view moves. **ContainerWidget** vs simple **GroupWidget** (`container` = `this`).

IFC doesn't distinguish — adorned windows need dishonest special-case APIs, harder to subclass.

---

## IFC critique — design and bugs

Selected issues from Don's 1996 review (full detail in [original HTML](https://donhopkins.com/home/interval/ifc-vs-bongo.html)).

### Graphics and AWT

- **drawRect / drawRoundedRect / drawOval** subtract 1 from width/height for X11-style "bonus pixels" — surprises when porting AWT code; **drawArc** and **drawPolygon** inconsistent  
- Wrapper classes around AWT (**Graphics**, **Bitmap**, **Color**, **Event**, **Font**) — memory, speed, learning curve; mostly implement **Codable** persistence, not higher abstraction  
- Glyph fonts as many tiny bitmaps instead of one atlas + sub-rectangles  

### Interaction

- **RootView** filters mouse **chords** — pretends one button; throws away information  
- **Modal dialog** hacks — "horrible"; toolkit shouldn't encourage toxic single-threaded modality; use tabs, cards, outliners instead (*Mayan temples of OK buttons*)  
- **InternalWindow** — wants a **Background** layer behind Default  
- **DragView** `startAnimatingRejectedDrag` — diagonal drag bug (`deltaX == deltaY` fence instead of post)  

### Duplication and metadata in code

- **Hashtable, Vector, Enumeration…** — reimplemented Java basics because persistence isn't systemic  
- **encode** vs **builderEncode** duplicated — e.g. Button `isBuffered` inconsistency  
- **BuilderInfo** hardwires modifier keys for drag-drop — too device-specific  
- **TextView** `_keyDown` — huge if-cascade; printable keys tested last  
- **ExtendedTarget** — only TextView, RootView, TargetChain; font/color chooser special cases  
- **BezelBorder** — Don prefers **Bevel**; please no cute **blur** as opposite of **focus**  

### Architecture

- **FoundationApplet** `pushIFCContext` / `popIFCContext` — gross; compare IE's **IScriptingEngine** multi-language model  
- **performCommandLater** — over-OOP, probably slow  
- **SystemImages** run-length encoding — no standard resource packaging for GIFs with code  

Don: IFC's string notification won't **scale** to sophisticated inspectors, scripting, and visual programming — designed like a **non-OO C system**, not Java.

---

## Component framework wars

The long-form analysis of **CORBA vs ActiveX vs OpenDoc vs Java Beans vs IFC vs Bongo** — component frameworks as **moving targets** that cripple each other on contact.

**Netscape** going in all directions: CORBA, OpenDoc, applets, Java Beans, Castanet, IFC, Navigator plug-ins, ActiveX, own JNI… without Microsoft's mass to support incompatible strategies.

**CORBA:** "Just talk, talk, talk… you can't get something to work without using it." Don: Netscape should swallow pride and embrace **ActiveX and MIDL** — or use **CORBA IDL** if serious about OpenDoc opposition to Microsoft.

**MIDL / type libraries:** Describe interfaces once; J++ maps COM to Java; metadata for VB, scripting, persistence, DCOM. vs embedding metadata in Java source like IFC (OLE MFC without a macro preprocessor — "up a very deep creek").

**Java Beans:** "Vapour" putting IFC and Bongo design on hold; tries to do too much; Sun too late. **OpenDoc vs OLE** integration nightmares (WordPerfect, Novell, IBM) — Sun promising to integrate all three to a lower common denominator.

**Microsoft:** Focused on Java + ActiveX + DCOM on Win32, Mac, Unix — **Metrowerks collaboration** for Java/ActiveX on Mac (Don's Bounce COM work same era). Don at Interval also wrote the [Pluggers survey](https://donhopkins.com/home/interval/pluggers) cataloging this soup.

> One unavoidable law: each component framework does its damnedest to **cripple** any other it touches. The worst outcome: *n* factorial interoperability glue loaded at once — staples, glue, epoxy, **Bondo**, velcro…

**Exhibits:** Sun's SunView/NeWS merge promises vs delivered X11/NeWS merged window system.

---

## Arthur van Hoff responds (Jan 1997)

Email to Don, Mon 6 Jan 1997 (Arthur at Marimba):

- Built **AWT-friendly** toolkit — minimal gratuitous differences; anticipating **JDK 1.1** integration  
- **IFC's huge mistake** reinventing Event, Graphics, Color — hard to mix IFC with existing AWT apps  
- **PC look & feel** by default — positive feedback; custom L&F still possible  
- **JavaBeans is the right way** at coarser granularity — not a widget framework, but integrates vendor components  
- Roadmap: JDK 1.1, Beans, business widgets, layout, content-oriented builder, time-based media, paint in builder  

> *Have fun,* — Arthur van Hoff

→ [Arthur van Hoff guest room](../arthur-van-hoff/README.md) · [HyperLook / GoodNeWS lineage](../arthur-van-hoff/ideas.md)

---

## Appendix — bongo-interest list (Jan 1997)

Tim Triemstra on **IFC vs Bongo market anxiety** — Netscape pushing IFC/SuperCede/Visual Cafe while allied with Marimba; `.gui` backward compatibility; Castanet pricing. Klaas Waslander (Marimba) replied: Bongo built **on** AWT (IFC's separate graphics model incompatible); Bongo best for **Castanet channels**; not an IDE but pairs with one.

---

## See also

| Link | Why |
|------|-----|
| [MediaFlow — Bongo persistence paragraph](mediaflow-design-comments.md#namespaces-persistence-and-the-web) | Same dictionary + property-sheet idea in the hypermedia flow essay |
| [Interval Research overview](interval-research-pluggers-and-mediaflow.md) | Camelot era — MediaFlow, Bounce, Director, ECG |
| [Pluggers survey (1996)](https://donhopkins.com/home/interval/pluggers) | COM, OLE, CORBA, OpenDoc, Java — the landscape this comparison assumes |
| [Arthur van Hoff](../arthur-van-hoff/README.md) | Bongo architect; HyperLook; Java/AWT/HotJava |
| [YAML Jazz collaboration stack](../../process/trails/yaml-jazz-collaboration-stack.md) | Modern echo of dictionary persistence + semantic metadata |
| [`import-self-from-self.md`](import-self-from-self.md) | MOOLLM externalized state + CARD metadata |
| [`history/interval-research.yml`](history/interval-research.yml) | Machine-readable distill |

*Original publication: [donhopkins.com/home/interval/ifc-vs-bongo.html](https://donhopkins.com/home/interval/ifc-vs-bongo.html)*
