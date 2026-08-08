# IE JScript HTC + XSLT pie menus — Punkemon and ConnectedTV Skin Editor

Museum of Obsolete Technology: pie menus as **XML + XSLT + JScript HTML Components (HTC)** on
Internet Explorer 5. Don's answer to the 2025 "XSLT native web" thread — the stack that predates
modern component frameworks.

HN: [44393817](https://news.ycombinator.com/item?id=44393817) (June 2025)

## Punkemon Pie Menus

| Piece | Role |
|-------|------|
| **`.xml`** | Menu structure + data |
| **`.xsl`** | XSLT transform to HTML |
| **`.htc`** | IE DHTML behaviors — pie menu tracking in JScript |
| **Demo** | [YouTube — Punkemon pie menus](https://www.youtube.com/watch?v=R5k4gJK-aWw) (IE 5 required) |

Repo: [SimHacker/IE-JScript-HTC-PieMenus](https://github.com/SimHacker/IE-JScript-HTC-PieMenus)

Also in repo: XML Schema–driven pie menu editor, ActiveX pie menu control (earlier), **Fasteroids**
(Asteroids comparing pie vs linear menus).

## ConnectedTV Skin Editor

Same HTC + XML + XSD stack — **WYSIWYG skin editor** for [**ConnectedTV**](connectedtv-touch-tuning-finger-pies.md)
(Palm TV guide + universal remote with **Finger Pies**).

- Custom IR remote layouts per device/page
- Trainable consumer IR + community sharing
- Finger-sized buttons: tap + up/down/left/right = five functions each
- Designed for **dark couch, no stylus** — self-revealing strokes vs invisible phone gestures

Repo: [SimHacker/ConnectedTVSkinEditor](https://github.com/SimHacker/ConnectedTVSkinEditor)

User guides (archived): [donhopkins.com/ConnectedTVUserGuide/](https://donhopkins.com/home/ConnectedTVUserGuide/Guide1-Overview.html)

Review: [Geoff Walker, PenComputing 2002](http://www.pencomputing.com/palm/Pen44/connectedTV.html)

## Lineage

| Link | Topic |
|------|-------|
| [`pie-menus-chi-88-and-beyond.md`](pie-menus-chi-88-and-beyond.md) | Pie menus through the decades |
| [`connectedtv-touch-tuning-finger-pies.md`](connectedtv-touch-tuning-finger-pies.md) | Touch Tuning + Finger Pies on Palm |
| [`gesture-space.md`](gesture-space.md) | Self-revealing vs graffiti gestures |
| [`../david-levitt/`](../david-levitt/README.md) | ConnectedMedia co-founder |
| Show | [`../../repo-shows/connectedtv-calm-technology/connectedtv-calm-technology.yml`](../../repo-shows/connectedtv-calm-technology/connectedtv-calm-technology.yml) |

## Show seed hook

Live port: XSD-driven pie menu editor → MicropolisCore holodeck pie layer (declarative menus, provenance-friendly YAML instead of XSLT).
