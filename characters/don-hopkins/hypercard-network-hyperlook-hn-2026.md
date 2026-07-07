# HyperCard over the network — HyperLook had it (HN, Mar 2026)

**Thread:** [HyperCard discovery: Neuromancer, Count Zero, Mona Lisa Overdrive](https://news.ycombinator.com/item?id=47327641) (Mar 2026).

**jandrese** mused about **HyperCard loading cards or stacks from network resources** — and concluded it would have been an even bigger security nightmare than JavaScript; HyperCard predated consumer security thinking (five stack access levels only). Fantasy parallel: Apple shipping HyperCard for Windows 3.1 and beating QBasic — "Apple just chucked one of the most interesting beginner programming environments in the trash."

**Don's reply** ([47329682](https://news.ycombinator.com/item?id=47329682)): **HyperLook** already did the networked HyperCard-shaped thing on **NeWS** — PostScript graphics + scripting + **networking**. Don used it for **SimCity for Unix**.

> HyperLook was like HyperCard for NeWS, with PostScript graphics and scripting plus networking.

Name lineage: **GoodNeWS → HyperNeWS → HyperLook**.

**scroot** ([47334980](https://news.ycombinator.com/item?id=47334980)): "I knew I could get Don Hopkins to show up!"

**jasomill** ([47331406](https://news.ycombinator.com/item?id=47331406)): HyperCard access levels are edit protection (like Excel), not runtime sandboxing; Apple Events + file sharing for network stacks did consider users/passwords.

---

## Don's links in-thread

| Topic | URL |
|-------|-----|
| NeWS | https://en.wikipedia.org/wiki/NeWS |
| SimCity, Cellular Automata, Happy Tool for HyperLook | [HyperLook (nee HyperNeWS nee GoodNeWS)](https://donhopkins.medium.com/hyperlook-nee-hypernews-nee-goodnews-99f411e58ce4) |
| Alan Kay — browsers, HyperCard, NeWS, HyperLook | [Medium reformat](https://donhopkins.medium.com/alan-kay-on-should-web-browsers-have-stuck-to-being-document-viewers-and-a-discussion-of-news-5cb92c7b3445) |
| HyperLook catalog (donhopkins.com) | https://www.donhopkins.com/home/catalog/hyperlook/index.html |

---

## Repo context

| File | Why |
|------|-----|
| [`hyperlook-news-postscript-simcity.md`](hyperlook-news-postscript-simcity.md) | HyperCard → HyperLook → SimCity microworld on NeWS |
| [`axis-of-eval-send-code-not-commands.md`](axis-of-eval-send-code-not-commands.md) | Send-code-not-commands bet; NeWS vs X |
| [`../alan-kay/media/quora-recaps/browsers-documents-news-hypercard-hyperlook.md`](../alan-kay/media/quora-recaps/browsers-documents-news-hypercard-hyperlook.md) | Kay + Don thread — Hypertalk regret, send-a-program |
| [`../alan-kay/media/quora-recaps/hypercard-personal-computing-breakthrough.md`](../alan-kay/media/quora-recaps/hypercard-personal-computing-breakthrough.md) | HyperCard as end-user programming breakthrough |
| [`../arthur-van-hoff/`](../arthur-van-hoff/) | HyperLook author (Turing Institute) |
| [`../will-wright/sources/2006-11-13-simcity-olpc-email-thread/`](../will-wright/sources/2006-11-13-simcity-olpc-email-thread/README.md) | HyperLook SimCity port history (curated OLPC thread) |

---

## Show fodder

- **Networked stacks without the browser:** HyperLook shipped networked PostScript objects — what would Hypertalk-on-the-wire have looked like if Apple hadn't killed HyperCard?
- **Security then vs now:** jandrese's nightmare vs jasomill's "just file permissions" — vs NeWS delegation model (send code, not commands).
- **Alan Kay's Hypertalk regret:** Kay wished HyperLook had a real **end-user language** — connect to [`hypercard-personal-computing-breakthrough.md`](../alan-kay/media/quora-recaps/hypercard-personal-computing-breakthrough.md).
- **Live demo target:** three plugged-together HyperLook examples from Don's Medium post (SimCity + CA + Happy Tool).

---

## Thread map

| HN id | Author | Role |
|-------|--------|------|
| [47327641](https://news.ycombinator.com/item?id=47327641) | — | Story — Gibson HyperCard discovery |
| [47328862](https://news.ycombinator.com/item?id=47328862) | jandrese | Parent — networked HyperCard fantasy + security |
| [47329682](https://news.ycombinator.com/item?id=47329682) | DonHopkins | HyperLook answer |
| [47331406](https://news.ycombinator.com/item?id=47331406) | jasomill | Access levels ≠ sandbox |
| [47334980](https://news.ycombinator.com/item?id=47334980) | scroot | "I knew I could get Don Hopkins to show up!" |
