# Butler Lampson — Kay's Quora sketch (companion to YootTower People.md)

*Guest hub:* [`../../README.md`](../../README.md) · *Recaps hub:* [`README.md`](README.md)

**Source:** Alan Kay's public **Quora** answer to *"What is the significance of Butler Lampson's work?"* — explicitly
**in progress** ("I will return here periodically … `<more to come>`") in the Nov 2023 corpus.

**Cross-ref:** YootTower [`People.md` — Butler Lampson](https://github.com/YootTowerManagement/YootTower/blob/main/Yoot_Saito_Alan_Kay_Interview/People.md)
(has GENIE, CAL-TSS, BCC→PARC, KiddiKomp/Alto bet, minimal standardization, Turing Award). PARC hiring:
[`parc-vpri-how-research-worked.md`](parc-vpri-how-research-worked.md).

**Nature:** Summary of the Quora thread as it stood in 2023; verify quotes against Quora. Credit: **Quora**.
Governed by [`portrayal-standards.yml`](../../../../schemas/portrayal-standards.yml).

---

## Kay's one-line definition of "computer scientist"

Asked for an example of a top computer scientist: **"Look at Butler to see an example … it's hard to put into
exact words, but he is one."** A grad student during a Butler talk: *"You know, it's just a privilege to know
someone like Butler."*

Quintessential **"brilliant"** — "the term seems to have been coined for him." Great thinker + doer + larger-than-life
personality "almost literally dragged the whole field forward."

## Scope of work (Quora list)

OSes (**SDS-940, Tenex**), computers (**MAXC, Alto**), networks (**Ethernet, Internet**), languages (**Mesa**).
Turing Award (1992) citations + Wikipedia + Microsoft publication list as starting points. 100+ papers worth
reading for **content and crystal-clear style**.

## Project Genie / SDS-940 — designed to fail safely

Berkeley ~1964: walked into "wrong door," joined **Project Genie** with **Peter Deutsch**; became main OS
designer, ARPA co-PI. ARPA pushed commercialization → **SDS-940** (Engelbart's 1968 demo machine; TYMSHARE;
recapped as **Tenex** on PDP-10).

On ~0.5 MIP, 64K words, shaky HW: OS had to be comprehensive, lightweight, **fail-safe**.

**Designed to fail:** mark pages dirty/clean, continuously write clean pages → crash recovery usually swift;
fast/slow queue rewards accurate working-set predictions — ran **dozens of users** on 192KB for Engelbart demo.

Hobby: **CAL** — optimized JOSS, "sweet spot" for public interactive computing. Essentially Butler's PhD;
advisors **Harry Huskey**, **Dave Evans** let him "run free."

## Design philosophy (partial — answer truncated)

Key Lampson principle Kay repeats: **"In computing, design rules change dramatically every few years"** (Moore's
Law + learning) — carrying old ideas forward is fraught; Butler redid designs for new situations (Genie memory
map; **CDC 6400 capabilities OS without HW support** — *On Reliable And Extendable Operating Systems*, 1969).

## PARC thresholds — Butler's 100-user rule

At PARC founding, Butler urged engineering inventions usable by **≥100 users** — 100 Altos, 100 Ethernet taps,
SW documented/supported for 100 users. Same spirit as ARPA Internet thresholds. (See PARC recap.)

## What the Quora answer doesn't yet cover

Kay promised more history/stories — corpus ends mid-CDC 6400 section. YootTower `People.md` + *Early History
of Smalltalk* fill Alto/KiddiKomp, SLOT, cosmic-ray protection, distributive computing naming.

## Questions for Alan (show fodder)

- You called Butler the quintessential computer scientist — **what one habit** should every researcher copy?
- **Capabilities on 6400 without HW** — blueprint for software caps on today's hostile net?
- Did the **100-user threshold** help or hurt ideas that needed 100,000 (HyperCard-scale)?
- Will you ever finish the Quora answer — or is YootTower `People.md` the continuation?
