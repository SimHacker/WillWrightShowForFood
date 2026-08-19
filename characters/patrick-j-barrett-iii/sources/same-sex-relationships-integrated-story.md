# Same-sex relationships in The Sims — integrated story (Don + Patrick)

**Purpose:** Story spine for [`did-the-sims-make-you-gay`](../../../repo-shows/did-the-sims-make-you-gay/README.md)  
**Attestation:** Don Hopkins — marked-up design documents (primary source), plus **past conversations with Patrick comparing notes**, which the donhopkins.com sequence is based on. Patrick J. Barrett III — implementation + E3 (press interview, 2014). Patrick has a standing, no-pressure offer to correct or extend any of this, in any medium, at any pace — the story stands complete on the documents and those earlier conversations either way.

---

## Canonical record (design documents + Don/Patrick sequence)

This is the story supported by Don's **marked-up PDFs** and the sequence on [donhopkins.com/home/TheSims/](https://donhopkins.com/home/TheSims/) (written after Don and Patrick compared notes).

| When | Who | What |
|------|-----|------|
| Early prototype | Code | Same-sex romantic attempt → **slap**. Never in any spec — a zeroth-order sketch's unexamined default (probably Jamie Doornbos, no homophobe, zero blame). Don recognized the behavior, confirmed the rule in the **SimAntics source**, flagged it. Procedural rhetoric (Bogost): code argues what no document says — and why diverse teams catch each other's blind spots |
| 1998-08-07 | Don | [Draft 3 review](https://donhopkins.com/home/TheSims/TheSimsDesignDocumentDraft3-1998-08-07-DonsReview.pdf) — "Heterosexist and Monosexist"; proposes 0–100 romance likelihood per sex |
| 1998-08-31 | Design | [Draft 5](https://donhopkins.com/home/TheSims/TheSimsDesignDocumentDraft5-1998-08-31-DonsReview.pdf) — *"Currently the game only allows heterosexual romance. **This will not be the only type available**… Will is reviewing the code and will make recommendations for how to implement homosexual romance as well."* |
| 1998-10-02 | Design | [Draft 7](https://donhopkins.com/home/TheSims/TheSimsDesignDocumentDraft7-1998-10-02-DonsReview.pdf) — Same-Sex / Opposite-Sex section retained |
| ~1998-10-22 | Patrick hired | Tasked with implementing social interactions |
| Implementation | Patrick | Implemented same-sex romance **on his own initiative** — romantic tags; preference from **behavior over time**, not a fixed personality enum. **Production database had not yet spec'd Don's reviews** when Patrick started; Will had not yet returned with implementation recommendations |
| Review | Will | Liked interactions; glad same-sex support was **"back in the game"** (Barrett attestation) |
| 1999-04 E3 | Demo | Two female Sims **autonomously** kiss during live presentation; positive press |
| 2000-01-31 | Ship | Same-sex relationships from day one |
| 2014 | Press | Simon Parkin interviews Barrett — [*The New Yorker*](https://www.newyorker.com/tech/annals-of-technology/the-kiss-that-changed-video-games) |
| 2023– | Don publishes docs | Marked-up design reviews go public; reframes 2014 "accident" narrative |
| 2026 | Repo | Standing open invitation to Patrick — **both perspectives already integrated** from past Don + Patrick conversations; anything more he ever wants to add is welcome, in any form |

**Don's sequence (after talking with Patrick):**

1. Prototype lacked same-sex support → Don wrote reviews pushing for inclusion  
2. **Later written design documents explicitly promised** broader romance (not a quiet decision to drop it)  
3. Patrick hired; **production state had not caught up** to those written reviews  
4. Patrick implemented anyway — behavior-based, not personality-enum  
5. Don retrospect: Patrick's emergent model is **better gameplay** than Don's 1998 straw-man (aligns with Will's "optimize for gameplay")

---

## Press framing (Barrett via Parkin, 2014) — not canonical alone

Simon Parkin's [*The Kiss That Changed Video Games*](https://www.newyorker.com/tech/annals-of-technology/the-kiss-that-changed-video-games) (June 2014) and summaries ([Game Developer](https://www.gamedeveloper.com/design/the-story-of-how-i-the-sims-i-got-same-sex-relationships---in-1999), Kotaku, PC Gamer) reported Barrett's account roughly as:

- Handed an **outdated design document** that still allowed same-sex unions  
- Team had **debated dropping** same-sex romance as too controversial  
- Barrett implemented without knowing the debate; *"In hindsight, I probably should have questioned the design… But the design felt right, so I just implemented it."*  
- E3 kiss was a surprise; EA let it ride  

**Use this block for attribution and quotes — not as the documentary record of design intent.**

---

## Press discrepancies — who was "wrong"?

**Short answer:** Neither Patrick nor Parkin was simply "wrong." The 2014 story was **incomplete**, and Parkin **compressed** it into an accident/oversight narrative. Don's marked-up design documents (published later) show a different **written** trajectory than the press story implied.

| Claim (2014 press) | Document record (Don's reviews) | Reconciliation |
|--------------------|----------------------------------|----------------|
| Team **decided to drop** same-sex romance as too risky | Drafts 5 & 7 (Aug–Oct 1998) **explicitly say** heterosexual romance will **not** be the only type | Press conflates **heterosexist prototype code** + **production lag** with "team removed feature from the plan." There may have been **oral** debate about controversy; **written** docs were moving toward inclusion after Don's reviews |
| Patrick given **outdated doc with feature still in** while team had removed it | Don: **production database didn't reflect** Don's opinion when Patrick started; docs said inclusion was coming (TBD) | Patrick may have received **stale or incomplete onboarding material** and not seen Don's marked-up Draft 3/5/7 trail. "Outdated" ≠ "forbidden leftover" — gap between **written promise** and **production spec** |
| Feature was an **accident** / Barrett **mistakenly** implemented | Patrick **deliberately** coded romantic tags and same-sex paths; Will **approved** | Parkin's "accident" frame sells the E3 moment; implementation was **intentional**. E3 kiss was **autonomous Sim behavior** at a crowded demo — emergent, not a scripted wedding gone wrong |
| Don's role absent | Don flagged slap (Aug 1998), proposed inclusive model, docs updated | Patrick likely **did not know** the full review trail when interviewed in 2014; Don's PDFs were not yet public |

**Was the New Yorker wrong?** As **history of design intent**, yes — it overstated "team decided to omit" and understated Don's documented advocacy and the Aug–Oct 1998 drafts promising inclusion. As **Barrett's memory of his own hire and implementation**, largely fair: he built it, Will said "back in the game," E3 happened.

**Was Patrick wrong?** Not in bad faith. He may not have known Don's marked-up reviews or that **later** design documents had **already** recorded a decision to include same-sex romance in writing. His 2014 account describes **his** onboarding and coding experience; Don's PDFs describe **the paper trail** Patrick may never have been shown.

**Presentation rule:** Lead with **marked-up PDFs** for design intent; use **Barrett/Parkin** for implementation quotes and E3 color. The "which doc did you have?" question was already reconciled in outline when Don and Patrick compared notes (the donhopkins.com sequence); any further detail is Patrick's to add if and when he ever feels like it, by any medium.

---

## Side-by-side (show crib sheet)

| | **Don / design docs (primary)** | **Barrett / Parkin 2014 (press)** |
|---|--------------------------------|-----------------------------------|
| Starting code | Same-sex kiss → **slap** | (underplayed in press) |
| Written direction | Draft 5/7: **will not be only heterosexual** | "Team decided to leave it out" |
| Production state | DB **hadn't caught up** when Patrick started | "Outdated doc still had it" |
| Patrick's act | Implemented **anyway**, behavior-based | "Implemented without knowing debate" |
| Will | Glad support was **"back"** | Same quote — supports return-after-gap, not forbidden doc |
| E3 | Autonomous kiss, positive press | "Stole the show"; expected EA to kill it |

---

## Aftership: community + mods

The Sims **1** allowed same-sex romance but not marriage — **Simprov Wedding Playset** (Don,
Heather SimFreaks, Steve SimSlice, Donna SimBabes) extended the vision. See MOOLLM
[sims-queer-identity-formation.md](https://github.com/SimHacker/moollm/blob/main/designs/sims/sims-queer-identity-formation.md#the-simprov-wedding-playset-community-driven-inclusion).

---

## Show beats

*The episode stands on the documents, press quotes (credited), and past Don + Patrick
conversations. Beats marked (optional) only happen if Patrick ever wants to contribute, in any
medium — live, recorded, email, or a one-line text.*

1. Read Don's Draft 3 comments on stream (primary source)  
2. Show Draft 5/7 "will not be the only type" — contrast with 2014 press summary  
3. The interaction tree / romantic tags — from docs, press, and past conversations; (optional) Patrick adds detail in whatever form suits him  
4. E3 clip + fair-use commentary (autonomous kiss, not wedding-on-rails myth)  
5. Avila essay + **comment themes** from MOOLLM analysis  
6. Audience Q: builders/modders/storytellers — microworld solidarity  

---

## Sources

| Source | URL |
|--------|-----|
| Don's Sims design doc hub | https://donhopkins.com/home/TheSims/ |
| Draft 3 — Don's review | https://donhopkins.com/home/TheSims/TheSimsDesignDocumentDraft3-1998-08-07-DonsReview.pdf |
| Draft 5 — Don's review | https://donhopkins.com/home/TheSims/TheSimsDesignDocumentDraft5-1998-08-31-DonsReview.pdf |
| Draft 7 — Don's review | https://donhopkins.com/home/TheSims/TheSimsDesignDocumentDraft7-1998-10-02-DonsReview.pdf |
| New Yorker — Parkin interviews Barrett | https://www.newyorker.com/tech/annals-of-technology/the-kiss-that-changed-video-games |
| Game Developer summary | https://www.gamedeveloper.com/design/the-story-of-how-i-the-sims-i-got-same-sex-relationships---in-1999 |
| PC Gamer — docs vs Barrett account | https://www.pcgamer.com/unearthed-the-sims-design-docs-show-the-debate-over-same-sex-relationships/ |
| Don HN (Feb 2025) — TBD before production DB | https://news.ycombinator.com/item?id=43068114 |
