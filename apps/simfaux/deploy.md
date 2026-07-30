# SimFaux deploy — bulky media on the server

**Do not rsync FLV / SWF / AVI / audio into this repo.** Point only. Screenshots and
YAML specs live in [`media/`](media/); recovered LZX goes in [`original-lzx/`](original-lzx/).

| What | Where |
|---|---|
| **URL base** | https://donhopkins.com/home/new/ |
| **Server path** | `/home/sites/DonHopkins/home/new/` (`dhopkins@donhopkins.com`) |
| **Compiled app** | https://donhopkins.com/home/new/SimFaux.lzx.swf |
| **Runtime audio** | https://donhopkins.com/home/new/content/audio/ |
| **Runtime video** | https://donhopkins.com/home/new/content/video/ |
| **YouTube demo** | https://www.youtube.com/watch?v=gRodlxUZ9SQ |
| **Laptop demos** (not in git) | `~/Movies/SimFauxDemo.wmv`, `SimFauxDemo1Video.avi`, `SimFauxDemo1Video.flv` |

SOLO layout (2006): `SimFaux.lzx.swf` + `embed.js` + `content/{audio,video,swf}/`.
Festival cut ~15 MB. Source tree was separate (`svn://SimFaux.com/...`) — see
[`archives/2006-03-24-open-source-readme.md`](archives/2006-03-24-open-source-readme.md).
