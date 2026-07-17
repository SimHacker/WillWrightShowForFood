# microsoft/comic-chat (GitHub)

**URL:** https://github.com/microsoft/comic-chat
**License:** MIT
**Status:** Public archive (read-only as of ~2026-07-16)
**Contributors (release):** @RobStand (Robert Standefer), @shanselman (Scott Hanselman)
**Site:** https://microsoft.github.io/comic-chat/

## What it is

Microsoft IRC client (1996+) that rendered conversations as automatically generated comic strips —
expert system for character placement, gestures, facial expressions, balloon shape, panel layout.
Interoperable with text IRC; non–Comic Chat users got assigned characters.

## Snapshots in the tree

| Folder | Era |
|--------|-----|
| `v1.0-pre/`, `v1.0/` | Aug 1996 |
| `v2.1b/` | Feb 1998 |
| `v2.5-beta-1/` | Jun 1998 |
| `artifacts/` | SDK, JChat, Betty Bot, design docs |
| `v1.0-pre-modern/`, `v2.5-beta-1-modern/` | 2026 modernization examples |

## Modernization note (repo README)

Primary publication is historical. `*-modern` folders demonstrate: VS/MFC toolchain on a normal
machine; display scaling; Common Controls v6; modern IRC parsing; dead art-download servers
short-circuited to bundled art. Explicitly "exercise for the reader" — not production-hardened.

## Show hooks

1. Walk the version directories as archaeology on air
2. Diff original vs modern — what AI + humans actually had to change
3. Community forks already appearing (e.g. MaxChat on HN)
4. Cloud build workflow for unofficial modern clients
