# Invitation email — sharp top, fat README

[Portrayal standards](../schemas/portrayal-standards.md) · [Invitation workflow](../schemas/invitation-workflow.yml) ·
[Guest participation ladder](guest-participation-ladder.md)

**Inspiration:** [Danny Castonguay — How To Write an Email](https://blog.dannycastonguay.com/how-to-write-an-email/) ·
[HN thread](https://news.ycombinator.com/item?id=48847536) (BLUF, default action, one question at the end)

**Repo base URL (always use in `invitation.md`):**

`https://github.com/SimHacker/WillWrightShowForFood`

Files: `…/blob/main/characters/<slug>/invitation.md`  
Directories: `…/tree/main/characters/<slug>/`

---

## Three layers — do not collapse them

| Layer | Where | Job | Length |
|-------|-------|-----|--------|
| **1. Email** | Apple Mail | Get a decision in seconds | Copy from GitHub-rendered `invitation.md` — aim for **one screen** |
| **2. Invitation letter** | `characters/<slug>/invitation.md` | Public ask + links + next step | **BLUF first**; short sections OK; **no infodump** |
| **3. Portrait + payload** | `characters/<slug>/README.md` | Birds-eye + why invited + full story | Top = skim; **bottom = any length** |

**Private strategy** (pitch drafts, leverage, money, call agenda) stays in DonHopkins green room — never this repo.
See [invitation-workflow.yml](../schemas/invitation-workflow.yml) `publication_pattern`.

---

## The rule

**Email and `invitation.md` sell the decision. `README.md` holds the love letter.**

If you have a gatling-gun list, a decade of stories, or twelve co-guest ideas — that belongs in
`README.md` (or `ideas.md`), linked once from the invitation. Do not make the guest scroll through
your entire brain to learn what you want.

---

## `invitation.md` — emailable public letter

Copied from [GitHub's formatted view](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/_TEMPLATE/invitation.md)
into Apple Mail. Design for that path.

### The Will line — front-load it, one sentence, no overreach

One sentence carries it. Canonical:

> **Will Wright is in — he's signed on to do the premiere and more.**

- **Front-load it**: first line of the facts block (or woven into the ask). The mention does the work.
- **Don't spend more words on it** — no bragging, no elaboration ([portrayal standards](../schemas/portrayal-standards.md) "cool and factual").
- **Never promise Will's presence in the guest's episode** or a one-on-one with him. He has limited time; we won't wear him out. The honest shape: time-shifted videos are the baseline; one-on-ones, multi-guest groups, and live streams happen as they fit — we see how it goes. Don't explain this in the invitation; just don't write anything that implies otherwise.
- WWSFF is **Will's instance** of a Repo Show (the format generalizes) — background knowledge, not invitation copy.

### BLUF — first visible block (Castonguay + military BLUF)

1. **First sentence = the ask.** No warmup, no "I hope you're well," no story before the point.
2. **2–5 lines of facts:** the Will line first, proposed show name, one hook from *their* work.
3. **Recommendation / default action:** what happens if they don't reply — soft, not corporate.
   - *"I'll assume you're busy unless I hear otherwise — no reply needed."*
   - *"If this sounds fun, reply with a week that works; if not, a one-line no is plenty."*
4. **One clear question last** in the letter body (HN: response rate goes up when the ask is the final line).

### Links block — absolute URLs only

Relative links break in Apple Mail. Every link in `invitation.md` must be a full `https://github.com/SimHacker/WillWrightShowForFood/blob/main/…` or `/tree/main/…` URL.

Point to:

| Target | Why |
|--------|-----|
| **Guest room** | `characters/<slug>/` — birds-eye README |
| **Proposed show(s)** | `repo-shows/<show>/README.md` |
| **`ideas.md`** | Numbered conversation hooks (optional browse) |
| **Co-guests already invited** | Their `characters/<other>/` — social proof, ensemble pitch |
| **Portrayal standards** | One line — correct/expand/replace/remove rights + direct-access offer; the page also carries the quiet-mode publication plan and [onboarding links](../schemas/portrayal-standards.md#onboarding), so **never explain GitHub accounts or tools in the letter** |
| **Will premiere** | One line — flagship guest accepted |

### Formatting — Apple Mail + GitHub

- **No mermaid** in `invitation.md` (renders badly or not at all in Mail).
- **No HTML-dependent tricks** — stick to headings, short paragraphs, bullet lists, one simple table max.
- **Numbered lists** when you have 2+ distinct questions (HN: people answer `#1 #2 #3` cleanly).
- **Judicious emoji** — signifier in title OK; don't decorate every line.
- **No meta** in the letter — no "this is a discovery artifact," no process narration ([portrayal standards](../schemas/portrayal-standards.md)).
- **Quiet mode, one line** — every invitation carries the P.S.: *"The repo is in quiet mode while invitations go out — please don't share links publicly just yet."* Details (why, and the go-private-then-publish plan) live in [portrayal standards](../schemas/portrayal-standards.md#stealth-mode), not in the letter.

### Subject line (email only — not in the md file)

Triage fast. Put the conclusion in the subject when possible.

| Good | Weak |
|------|------|
| `Invitation: Repo Show — video feedback + CAM6` | `Quick question` |
| `Repo Show invite — Bounce/Rebounce jam` | `Following up` |
| `No pressure: async show invite (link inside)` | `Hi` |

Pattern: `[Invitation / No pressure:] [topic or show name]`

---

## `README.md` — birds-eye + infodump

Speaks to **the public** and **the guest** (anyone reading over their shoulder). Structure:

```markdown
# Name — one-line field

[Card / invitation / ideas links]

## Who
… public portrait for readers who don't know them …

## Why a Repo Show
… how their interests intersect this project — grounded, specific …

## Browse
… table: show seed, co-guests, sources, media …

---

## Deep dive
… everything that used to bloat invitation.md …
… gatling-gun lists, shared history, co-guest ensemble, memorial threads …
… addressed to the guest ("you and Don…") AND informative for the public …
```

**Top** = someone lands from email and orients in 60 seconds.  
**Bottom** = Don's full heart and research — unlimited length.

Move existing long `invitation.md` bodies here when refactoring (e.g. David Levitt).

---

## Castonguay checklist (invitation layer only)

| # | Rule | Repo Show application |
|---|------|------------------------|
| 1 | Start with the point | First sentence = invite to Repo Show + show hook |
| 2 | Bad news first | If portrayals might feel off: link standards + "correct anytime" early |
| 3 | Few words | Cut filler; link instead of paste |
| 4 | Be literal | No sarcasm they might miss in text |
| 5 | Be specific | Names, dates, papers, show titles — not "your important work" |
| 6 | One job | Invite to show — not fundraise + reminisce + tech spec in one email |
| 7 | Obvious next step | Reply / later / no — all honored |
| 8 | Facts ≠ judgment | "Will accepted July 2026" (fact) vs "you'd be perfect" (judgment) — keep both, separate |
| 9 | Forwardable | Reader who never saw prior thread understands from this page |
| 10 | No AI slop | Edit until it sounds like Don, not a template |
| 11 | Respect time | One screen for `invitation.md`; depth in README |
| 12 | Clear > polite | "No reply needed" beats vague "no pressure" paragraphs |
| 13 | Clean threads | New subject per guest; don't CC the world |
| 14 | Subject triages | See above |
| 15 | Default structure | Ask → facts → links → next step → sign-off |
| 17 | Long debate → call | Phone/video after they've read the link; email summarizes after |

---

## HN additions worth keeping

- **BLUF** — bottom line up front; rationale below for those who want it ([Wikipedia](https://en.wikipedia.org/wiki/BLUF_(communication))).
- **Default action** — *"I'll proceed with drafting the show seed unless you'd rather I wait"* beats limbo.
- **One question per email** when you need an answer; numbered list if you need several.
- **Subject = conclusion** — *"Invitation: Rebounce with David + Jaron"* not *"Update"*.

---

## Send workflow

1. **Draft** `invitation.md` (short) + expand `README.md` deep dive if needed.
2. **Review** in GitHub rendered view — that's what Mail will look like.
3. **Copy** rendered page → Apple Mail (fix anything that broke).
4. **Green room** — private call notes only; not committed.
5. **Update** frontmatter `status: sent`, `sent_at` in `invitation.md` + `CHARACTER.yml`.
6. **On accept** — upgrade invitation tone if guest blesses public showpiece (Will pattern).

---

## Anti-patterns (learned from current drafts)

| Don't | Do instead |
|-------|------------|
| Gatling-gun list in `invitation.md` | `README.md` § Deep dive + link "full list here" |
| Relative [`invitation`](invitation.md) in invite | Absolute blob URL |
| Mermaid flowchart in invite | Prose one-liner or link to `process/VISION.md` |
| Mansplain their whole career | One shared-alignment sentence + link to sources |
| "I hope this finds you well" | Delete |
| Three unrelated asks | One show invite; separate emails for separate jobs |
| Embed 2MB of context | Link to `sources/`, `media/`, `repo-shows/` |

**Refactor queue:** invitations longer than ~80 lines or ~1 screen — move body to README deep dive, leave sharp BLUF + links.

---

## Template

- [`characters/_TEMPLATE/invitation.md`](../characters/_TEMPLATE/invitation.md) — copy per guest
- Flagship (accepted, longer — exception): [`characters/will-wright/invitation.md`](../characters/will-wright/invitation.md)
- Good lean draft: [`characters/jim-crutchfield/invitation.md`](../characters/jim-crutchfield/invitation.md)

---

## See also

- [`schemas/portrayal-standards.md`](../schemas/portrayal-standards.md) — invitation documents §
- [`process/party-roster.yml`](party-roster.yml) — send batch tracking
- [`process/sync-with-donhopkins.md`](sync-with-donhopkins.md) — cream pass before first sends
