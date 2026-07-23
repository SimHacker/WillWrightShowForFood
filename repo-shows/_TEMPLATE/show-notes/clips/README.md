# Producer clips — sourced artifacts for Show Notes

Submit a **clip** when you have something the hosts should see: a quote, paper, screenshot,
HN thread, code snippet, video timestamp.

**Path:** `show-notes/clips/<your-github-username>/clip.yml`

**Required:** `source_url`, `context`, `why_it_matters`, `license_or_fair_use_note`

**Not a clip:** unsourced plots, "media deconstruction" without receipts, rage without fix.

Spec: [`../../../process/producers-and-show-notes.yml`](../../../process/producers-and-show-notes.yml)

Example:

```yaml
clip:
  title: "Long Now 2006 — two audience questions, one outcome"
  source_url: "https://github.com/SimHacker/WillWrightShowForFood/blob/main/process/ticket-pr.yml"
  context: "Stewart Brand curated written questions; Will said 'very open' to GPL"
  why_it_matters: "TicketPR lineage — audience questions changed software history"
  license_or_fair_use_note: "Project doc; link only"
```

Open a PR. Producer merges → Philahue may surface on air → credit in `SHOW-NOTES.yml`.
