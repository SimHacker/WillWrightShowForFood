# Outreach drafts — Jim Crutchfield 🦋

Unsent drafts. Nothing here has been posted or mailed. Public-facing drafts live here;
correspondence bodies and working strategy notes live in Don's private archive.

## `crutchfield-machine-issue-draft.md`

An issue for **[splashkes/crutchfield-machine](https://github.com/splashkes/crutchfield-machine)**
— praise, plus a request to credit **Ralph Abraham (1976)**, plus four citation fixes.
Background: [`../crutchfield-machine.md`](../crutchfield-machine.md).

**Status:** draft, not posted. Awaiting Don's rewrite.

Suggested title:

```
Credit where the loop started: Ralph Abraham (1976), plus four small citation fixes
```

The file is the issue **body only** — no title, no front matter — so it can be piped
straight in once you're happy with it:

```bash
gh issue create \
  --repo splashkes/crutchfield-machine \
  --title "Credit where the loop started: Ralph Abraham (1976), plus four small citation fixes" \
  --body-file characters/jim-crutchfield/outreach/crutchfield-machine-issue-draft.md
```

Post under Don's own name — the draft says "I'm Don Hopkins" and links this repo.

### What it asks for

| # | Ask | Evidence |
|---|-----|----------|
| 1 | Add **Abraham 1976**, "Simulation of cascades by video feedback," LNM 525, pp. 10–14, [DOI 10.1007/BFb0077841](https://doi.org/10.1007/BFb0077841) | He is reference **`[1]`** in Crutchfield 1984, and the acknowledgements open: *"I am particularly indebted to Ralph Abraham for introducing me to video feedback a number of years ago."* Links out to [`../abraham-video-feedback-lineage.md`](../abraham-video-feedback-lineage.md) and [Ralph's memorial](../../ralph-abraham/memorial.md) |
| 2 | §5 is **"Variations on a light theme"** | The credits doc inherited "fight theme" from the Physica D scan's OCR; the [Vasulka *Eigenwelt* reprint](https://www.vasulka.org/Kitchen/PDF_Eigenwelt/pdf/191-207.pdf) has it right |
| 3 | Split the two films | Their entry puts the title *Dynamics in the Space of Images* (actually 1983, 12 min, per the paper's own reference list) on the YouTube URL for *Space-Time Dynamics in Video Feedback* (1984, 16 min) |
| 4 | Fix the Winfree entry | Paper's reference list: *"Singular Filaments Organize Chemical Waves in Three Dimensions: Parts 1, 2, and 3,"* Physica **8D** (1983) 35; **9D** (1983) 65 |
| 5 | Resolve the precision contradiction | `README.md` says the default is RGBA32F; `research/PHILOSOPHY.md` says RGBA16F |

It closes by offering to open the PR, and notes the browser build as the remaining gap.

## Heads-up mail to Jim

A short note letting him know the project exists and pointing at the issue. Body lives in
the private archive, per the repo's correspondence convention. Send **after** the issue is
posted, so the URL resolves.

## See also

- [`../crutchfield-machine.md`](../crutchfield-machine.md) — the annex this came out of
- [`../abraham-video-feedback-lineage.md`](../abraham-video-feedback-lineage.md) — the 1976 → 1984 handoff, which is the whole argument of the issue
- [`../../ralph-abraham/memorial.md`](../../ralph-abraham/memorial.md)
