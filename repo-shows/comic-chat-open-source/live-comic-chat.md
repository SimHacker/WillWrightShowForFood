# Live Comic Chat — on-air segment

**Show:** [`SHOW.yml`](SHOW.yml) · **Guests:** DJ Kurlander · Robert Standefer · Scott Hanselman · host Don Hopkins

The interview is not only *about* Comic Chat. Part of the episode **is** a Comic Chat.

## Goal

Four people join a private IRC channel with Comic Chat (or a modernized build). Conversation
unfolds as comic panels. We screen-capture / export the strip and commit it into this show
directory as the episode's visual history — Repo Show meeting comic history.

## Why

- DJ's site: keep the characters extant (moral imperative, with a wink)
- Robert already used Comic Chat for a conference talk comic
- Scott's open-source framing: history that still runs
- Don: conversation → living artifact (panels in git = panels on the wall)

## Tech (draft — refine with guests)

| Piece | Plan |
|-------|------|
| **Client** | Prefer `v2.5-beta-1-modern` or unofficial modern build from [microsoft/comic-chat](https://github.com/microsoft/comic-chat); fallback Win98/XP VM + classic 2.5 |
| **Server** | Private channel on a known-good IRC host ([Mermaid Elizabeth's list](https://kurlander.net/DJ/Projects/ComicChat/resources) / community lists) — **not** a busy public lobby |
| **Channel** | e.g. `#wwsff-comic-chat` (invite-only / keyed) |
| **Capture** | OBS + guest screen shares; export panels/PNG sequence → `artifacts/live-session/` |
| **Art** | Default Woodring set; optional guest characters if Character Editor time allows |
| **Safety** | No CTCP spam on foreign servers; stay on our channel; warn about IRC culture scars |

## On-air beats (~15–25 min)

1. **Join** — each guest picks a character; Don narrates emotion wheel once
2. **Hello ritual** — greetings → waves (keyword rules live)
3. **Emotion wheel duel** — angry / LOL / ALL CAPS shout / `:-)` / self-point ("I") / other-point ("You")
4. **Creator tip** — DJ drives one non-obvious layout/balloon moment
5. **Open-source beat** — Robert/Scott type what they'd build next; panels record the wishlist
6. **Close** — commit strip to repo on air if logistics allow, or post-show PR

## Talk track around the live bit

Before/after: research→product, Jim Woodring reverse-engineering, MSN server shutdown, six-year OSS
arc, modernization honesty, Repo Show kinship. Live segment is the middle act — proof, not demo
theater.

## Artifacts to land in-repo

```
repo-shows/comic-chat-open-source/artifacts/live-session/
  README.md          # date, server, builds, cast
  panels/            # exported strip
  irc-log.txt        # optional text log
  obs-notes.md       # capture settings
```

## Consent

Live IRC is still a recorded show segment — guests OK recording + committing panels. Private
channel; no drive-by audience unless guests want an open watch party later.
