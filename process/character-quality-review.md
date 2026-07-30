# Character quality review ledger

Started: 2026-07-29 · Repo: WillWrightShowForFood  
Standards: [`schemas/portrayal-standards.md`](../schemas/portrayal-standards.md)  
Audit machine file: [`character-quality-audit.yml`](character-quality-audit.yml)  
HN harvest: [`hn-harvest/INDEX.md`](hn-harvest/INDEX.md)

## Goals

1. Memorials: ethical respect, basic characterization, ideas, public + personally shared info.
2. Invites / dream guests / discussants: similar quality floor (uneven depth OK).
3. Harvest Don's HN (`DonHopkins` + `SimHacker`) into an intertwingled accessible whole.

## Method

- Line-count + README/bio audit across 218 `CHARACTER.yml` rooms.
- Memorial mode: `type: memorial`, represent+discuss, no speaking-as, cite sources.
- Living public figures not yet asked: `consent_level: 3`, subject rights explicit.
- HN: Algolia author-scoped comment search; Firebase shows ~12,961 (DonHopkins) + ~607 (SimHacker) submitted items for a later full walk.

## Critical correction this pass

| Room | Issue | Fix |
|------|-------|-----|
| `rebecca-heineman` | Stubbed as **living**; public obituaries: died **2025-11-17** | Reclassified to **memorial**; full CHARACTER/memorial/README/ideas |
| `dame-stephanie-shirley` | Death year wrong in stub (2021); almost empty | Corrected to **1933–2025**; full memorial suite |
| `jennell-jaquays` | Birth year wrong (1949); almost empty | Corrected to **1956–2024**; full memorial suite |
| `lynn-conway` | Almost empty memorial | Full memorial suite + HN link |

## Enriched this pass (from starved stubs)

**Memorials:** dame-stephanie-shirley, lynn-conway, jennell-jaquays, rebecca-heineman  

**Living / invite:** audrey-tang, sophie-wilson, diana-merry-shapiro, don-norman, john-carmack, kim-cascone, art-medlar (README+ideas), syd-mac (README), nicholas-negroponte / brian-fox / tod-machover (README floors on already-rich CHARACTER.yml)

## HN harvest snapshot

| Character file | Comments (unique pairs) |
|----------------|-------------------------|
| will-wright | 441 (Will Wright + SimCity + The Sims + Maxis — **noisy**; curate) |
| don-hopkins | 220 (pie menu) |
| heinz-lemke | 152 (PIXIE + Heinz — PIXIE string broad) |
| seymour-papert | 112 |
| douglas-engelbart | 59 |
| lynn-conway | 19 |
| joe-weizenbaum | 9 |
| neil-wiseman | 9 |
| rebecca-heineman | 3 |
| sophie-wilson | 2 |
| audrey-tang | 1 |

**Total:** 1027 unique (character, comment) pairs in seed.  
**Next:** walk Firebase `submitted` lists; NER against full roster; copy curated excerpts into each room's `sources/hn/`.

## HN harvest (end of this session)

- Algolia per-character files: see [`hn-harvest/INDEX.md`](hn-harvest/INDEX.md) (~1k+ comment pairs on core queries; expanded pass added Fox/Norman/Harvey/Rucker/Pd/…)
- Firebase walk: DonHopkins recent **1500** + SimHacker **607** → **155** items with roster name hits → [`hn-harvest/FIREBASE-WALK.md`](hn-harvest/FIREBASE-WALK.md) + 40 `firebase-*.md` appendices
- Wired into rooms: Will, Heinz, Lynn Conway, Miller Puckette, Brian Fox, Don Norman

## Pass 2026-07-29c — Alan Kay deep polish

- **Girder gap fixed:** `CHARACTER.yml` had null Wikipedia / empty sources / invitation `draft` while INDEX said `warm` — now full bio (b. 1940-05-17, Turing 2003, Atari CS 1981–84), sources, `invitation.status: warm`, constellation `see_also`
- **from-alan-kay.yml** added: Bonnie MacBird, Andrew Armit, David Rosenthal (were pending)
- **people-index** updated (26 enriched); show seed + CARD relationships expanded
- **HN reviewed stub:** `process/hn-harvest/alan-kay.md` (staging remains `firebase-alan-kay.md`)
- Reverse links: Heinz, Armit, DSHR, Bonnie → Alan hub

## Pass 2026-07-29b (continue quality + link)

- **Kiwi / flagged archaeology:** closed. Won. No further effort.
- **Evidence corrections / fills:**
  - Bunten: exact dates 1949-02-19 – 1998-07-03; CGDA 1998 + AIAS HoF 2007; wiki URL `Danielle_Bunten_Berry`
  - Shirley: death day pinned **2025-08-09** (was month-only)
  - Jaquays ↔ Heineman: **spouse** link both ways (public obituaries / Wikipedia) — was missing
- **Enrichment:** Bunten memorial/ideas/README; Abraham `ideas.md`; Weizenbaum + Mike Jang `ideas.md`
- **Cross-links:** Will → Bunten / Abraham / Heineman IIgs; Lynn ↔ Levitt (MIT'78 photos); Brewster ↔ Art Medlar (WAIS/IA); Creator Network cohort mesh (syd/vixella/steph0)
- **Lynn VLSI image archive:** `characters/lynn-conway/sources/images/` (prior turn)

## Pass 2026-07-30 — Marvin Minsky SoM HN harvest

- Story [34100102](https://news.ycombinator.com/item?id=34100102) + Don [34110544](https://news.ycombinator.com/item?id=34110544)
- Digested into `characters/marvin-minsky/sources/2022-12-23-hn-society-of-mind.md`
- Reviewed IDs: `process/hn-harvest/marvin-minsky.md`
- ideas.md rebuilt (was stub); wired Drescher / Teitelman / Hewitt / Brand / Will
- Epstein/dead comments excluded from public digest

## Pass 2026-07-29f — Invite pack (Lampson / LRG / MVC / Utah film)

**Send-ready invitations** (`invitation.md`, INDEX `send_ready`, quiet mode):
- butler-lampson — Kay Quora blurb
- adele-goldberg + ted-kaehler — Smalltalk-80 / LRG pair
- trygve-reenskaug + alan-borning — MVC + ThingLab constraints
- henri-gouraud — Multipatch film tour with Armit

**Memorials (already + new):** Barton + Dahl/Nygaard (trinity); **steven-coons** (Utah/Armit lane)

Not sent yet — drafts only. Contact channels remain private (DonHopkins).

## Pass 2026-07-29e — People.md loose ends + Ivan/Alan/Will depth

- **New rooms:** trygve-reenskaug, stewart-brand, ed-cheadle (status unknown), bob-barton, carl-hewitt, warren-teitelman (1941–2013), ole-johan-dahl, kristen-nygaard
- **OOP trinity essay:** `characters/alan-kay/oop-trinity-sketchpad-simula-b5000.md` — Sketchpad · Simula · B5000 intertwingled
- **Ivan deepen:** HN reviewed index; ideas + README + CHARACTER links to trinity / Reenskaug / Will
- **Alan deepen:** see_also + people-index (enriched ~40+) + show pairings (trinity, MVC, Will/Papert)
- **Will deepen:** CHARACTER see_also + ideas Kay/Papert/Sketchpad adjacency (glass-box foil)
- **Map:** `yoot-people-wwsff-map.yml` refreshed
- **Teitelman:** was wrongly assumed living earlier — memorial confirmed (d. 2013-08-12)

## Pass 2026-07-29d — Ivan Sutherland + Yoot People.md harvest

- **Ivan Sutherland hero room deep:** full CHARACTER (b. 1938-05-16, Turing 1988), ideas, from-alan-kay (Yoot + Quora), CARD relationships (Evans/Warnock/Wes Clark/Armit), sketchpad essay Utah+E&S section; consent_level 3 citation room
- **Map:** [`yoot-people-wwsff-map.yml`](yoot-people-wwsff-map.yml) — People.md → rooms
- **PARC / Utah stubs wired into INDEX + alan-kay people-index (40 enriched):**
  - Living stubs: butler-lampson, adele-goldberg, ted-kaehler, l-peter-deutsch
  - Memorials: chuck-thacker, bob-taylor, wesley-clark, larry-tesler, john-warnock, dave-evans
- **Next from People.md:** Trygve Reenskaug, Ed Cheadle, Bob Barton, Carl Hewitt, Stewart Brand, Teitelman room, Ole-Johan Dahl / Simula root

## Still thin / next loop

Thin under ~100 lines: press (`liam-proven`, `thomas-claburn`), correspondence stubs, community creators (now linked; still need **primary-post** verification), Cambridge unknowns.

1. Press contacts — deepen correspondence summaries only
2. Creator Network rooms — fetch/verify each creator's own exit post before quotes
3. **Curate** noisy Algolia dumps into private DonHopkins first; public = reviewed IDs/excerpts only
4. Firebase: walk remaining ~11k DonHopkins submitted IDs (roster NER)
5. Status-unknown Cambridge co-authors — keep **not memorialized** until confirmed
6. Zero curated HN yet: Shirley, Jaquays, Bunten, Abraham, Machover, Art Medlar — personal archive / wider search
7. Living invites near floor (`don-norman`, `audrey-tang`, `sophie-wilson`, `john-carmack`) — deepen when show-adjacent

## Ethics checklist (ongoing)

- [x] No speaking-as for memorials
- [x] Trans pioneers use chosen names in present-tense memorial prose
- [x] No private contact info added
- [x] No HN karma in citations
- [x] Epstein/Media Lab note kept explicit on Negroponte (no gloss)
- [x] Spouse / family facts only from public record (Jaquays–Heineman)
- [ ] Family/colleague edit invitations outstanding on new memorials
- [ ] Quiet-mode: do not broadcast repo links publicly yet

## Uneven depth (intentional)

Will Wright and Heinz Lemke already far exceed the floor — do not flatten them. Others get at least: bio summary, sources, README, ideas/memorial, see_also. Extraordinary people get extraordinary rooms.
