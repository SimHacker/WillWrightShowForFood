# Rights

Who owns what in this repository, what we may publish, and what we point at instead. A
`LICENSE` file cannot say this, because four different parties hold rights here and only one
of them is us.

The governing principle is narrower than it sounds: **we host our own work and point at
everyone else's.** A timestamped link is unlimited, free, permanent, and needs nobody's
permission. Almost every rights problem in a show about other people's talks dissolves if you
never keep a copy.

See also [`schemas/portrayal-standards.md`](schemas/portrayal-standards.md) for how we portray
living people, which is a separate question from who owns the recordings.

## What we hold

| Material | Holder | License |
|---|---|---|
| Code: apps, packages, scripts, rigs, kernel | Don Hopkins | MIT |
| Our writing: designs, catalogs, show notes, episode structure, essays | Don Hopkins | CC-BY-4.0 |
| Our own photographs and video | Don Hopkins | CC-BY-4.0 |
| Character portrayals we authored | Don Hopkins, under [portrayal standards](schemas/portrayal-standards.md) | CC-BY-4.0 |
| Structured data: catalogs, indexes, timings, transcripts we made ourselves | Don Hopkins | CC0-1.0 |

Facts go CC0 deliberately: an index of who said what at which timestamp should be free to
copy, because attribution on a timecode is a toll booth on a fact.

## What we do not hold

| Material | Holder | What we may do |
|---|---|---|
| Will Wright's talks, slides, words, likeness | **Will Wright** | as granted in [`agreements/will-wright.md`](agreements/will-wright.md) |
| GDC talk **recordings** | **Informa / GDC** | link and embed freely; clips need permission |
| Long Now seminar **recordings** | **The Long Now Foundation** | link and embed; use their official shareable clips; re-uploads need permission |
| Other guests' talks, papers, images | each guest | invite, link, quote with citation |
| Game assets: SimCity, The Sims, Spore screenshots and footage | **Electronic Arts / Maxis** | quote briefly for commentary and criticism; never relicense |
| Third-party code under `node_modules`, `packages/vendor` | upstream authors | their own licenses, untouched |

**Will's grant does not cover the GDC recording.** This is the distinction that matters most
and the one most easily fumbled: Will owns his words, his slides, and his likeness, and can
license those to us. The *video* of him giving a talk at GDC is a separate copyrighted work
owned by the conference, whose rights he assigned when he agreed to be recorded. So a
transcript of what he said sits under his grant, while the twelve seconds of footage in which
he says it does not.

The same split applies to Long Now, whose seminars are **not** Creative Commons licensed --
free to watch is not free to reuse.

## Publication policy: point, do not host

In order of preference, because each rung down costs more rights:

1. **Timestamped link** to the official upload. `?t=` on YouTube, or the venue's own page.
   Zero rights required, and the watch time accrues to the rights holder, which is the point.
2. **Embed** the official player. Permitted by YouTube's terms and by Long Now's own
   shareable-clip feature. Still no copy, still no permission needed.
3. **Native YouTube Clip** of somebody else's video. YouTube's clip feature creates a
   shareable window into the original rather than a copy: the views count for the original
   uploader, and no file is duplicated. This is the correct tool for "watch these forty
   seconds" and it is criminally underused.
4. **Our own re-upload of a clip**, with commentary. Requires either permission or a genuine
   fair-use / quotation basis. Lives on the personal channel, never the official one. See below.
5. **Re-uploading somebody's whole talk.** Never. Not even ours to consider.

Transcripts and quotations are ours to publish when sourced and marked, and they are the
denser artifact anyway: a searchable, timestamped transcript that links into the official
video is more useful than the video and costs no rights at all.

## Two channels, and the risk they each carry

- **Official WWSFF channel — kept clean.** Long form and short form we produced, plus
  playlists that thread other people's official videos by reference. Every third-party frame
  it touches is either licensed, permitted, or embedded rather than copied. Nothing goes here
  that could earn a copyright strike, because this channel is the archive and it has to
  outlive the experiments.

- **Personal channel — where the experiments live.** Clips, remixes, commentary, cats. It
  absorbs the risk that must not touch the official channel.

**The tension worth naming: the channel you want to monetize is the channel taking the
risk.** Two mechanisms, and they are not the same thing:

- A **Content ID claim** is not a strike. It typically routes that video's revenue to the
  rights holder, or blocks it in some territories. Survivable, and invisible to viewers.
- A **copyright takedown** is a strike. Three live strikes terminate the channel and every
  video on it.

And the specific policy that bites this plan: YouTube's Partner Programme rejects channels
built mainly of **reused content** -- other people's footage without substantial original
commentary or transformation. A channel of well-chosen clips is exactly the shape that gets
declined, however good the taste behind the choosing. So on the personal channel, the
commentary is not decoration, it is the thing that makes the channel monetizable at all.

Which points at the cheap fix: **ask GDC and Long Now for clip permission the same way we
asked Will.** Both organizations exist to spread these ideas, both benefit from traffic to
their originals, and a written yes converts the entire risk calculation. Drafts are in
[`agreements/`](agreements/).

## Fair use, stated once and without pretending it is a plan

Short quotation for commentary, criticism, and scholarship is defensible in the US, and Dutch
and EU law has a narrower quotation right (*citaatrecht*, Auteurswet article 15a) requiring
attribution and proportionality. Both are defences, not permissions: they are what you argue
after a claim, not a reason to skip asking. We ask first, and we keep the ask on file.

## Permission log

Every grant lives in [`agreements/`](agreements/) as its own file, with the exact wording,
the date, and the scope. Nothing published relies on a remembered conversation.

| Party | Scope | Status |
|---|---|---|
| Will Wright | talks, slides, transcripts, likeness, portrayal | [`agreements/will-wright.md`](agreements/will-wright.md) — drafted, awaiting his reply |
| GDC / Informa | clips from GDC talk recordings | [`agreements/gdc.md`](agreements/gdc.md) — draft ask |
| Long Now Foundation | clips from SALT seminar recordings | [`agreements/long-now.md`](agreements/long-now.md) — draft ask |
| Electronic Arts | game footage and screenshots | not sought; quotation only |

## Removal

Anybody depicted, quoted, or recorded here can have their material removed by asking, without
argument or negotiation, including retroactively from the git history where that is what
removal honestly requires. That promise is worth more than any of the licenses above, and it
is the reason the material is worth trusting us with.
