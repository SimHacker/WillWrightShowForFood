# Make a Magic Cookie for The Sims Transmogrifier

*Wayback capture Dec 2004 · Don Hopkins · thesimstransmogrifier.com*

---

## Purpose

A **Magic Cookie** is a unique 16-bit number assigned to each object producer (person or organization creating Sims objects). Combined with a random 16-bit suffix, it forms the 32-bit **Object ID** so fan objects do not collide in the catalog.

- **Not** used for identification or tracking  
- **Honor system** — register if you distribute objects for others to use  
- Optional: name/nickname + email for Transmogrifier update notifications (email not shared with third parties)

---

## Registry form fields (original site)

| Field | Required |
|-------|----------|
| Name (or nickname) | Yes |
| Email | Optional — update notifications only |

---

## Glossary rules (from docs)

- 65535 cookies; each allows fewer than 65536 unique objects  
- "Cookie hoarders will be banned and their magic cookies recycled"  
- Maxis-published object IDs treated as **reserved** regardless of cookie field  
- Transmogrifier retries random IDs until unique among known runtime objects  
- Future tools promised better cookie/ID management

---

## In Tutorial 1

Clone dialog defaults Magic Cookie to **0** if unset; enter your registered cookie so Transmogrifier remembers it in the registry for future clones.
