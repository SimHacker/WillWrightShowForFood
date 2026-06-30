# SimCity open source for the $100 laptop — how Micropolis happened

*Primary source: Don Hopkins email to Rod Humble, Will Wright, Scott Evans — 1 December 2006. Harvested from [old-email archive](../../../../DonHopkins/temp/old-email/sim-city-in-open-source-for-100-laptop.txt). Republished in [WillWrightShowForFood](https://github.com/SimHacker/WillWrightShowForFood).*

---

## Timeline (Nov–Dec 2006)

| Date | Who | What |
|------|-----|------|
| 13 Nov 2006 | **John Gilmore** → Don | OLPC needs learning games; SimCity Classic Unix port might be open-sourceable |
| 17 Nov 2006 | Don → **Will Wright** | "Is it possible for EA to release SimCity classic for OLPC?" |
| 18 Nov 2006 | Will → Don | "Let me check into it. I support the idea wholeheartedly." |
| 1 Dec 2006 | Will → Rod Humble, Scott Evans | Worthwhile at no risk to EA; asks Rod to move it forward |
| 1 Dec 2006 | **Rod Humble** → Don | Conference call requested |
| 1 Dec 2006 | Don → Rod | Phone numbers; **SimCityNet screenshots**; full career + pitch letter (below) |
| 1 Dec 2006 | Scott Evans → **Charles Normann** | "Chuck, can you please run with this?" |
| 2–16 Dec 2006 | Chuck ↔ Don | Unix version history; DUX/Maxis contracts (expired July 2001) |

Later threads (`simcity-for-olpc----introducing-the-players`) bring in **Walter Bender**, **Alan Kay**, EA QA sign-off, and the Sugar/Python path that became **Micropolis**.

---

## Why Don's pitch mattered

The December 2006 letter is not a vague permission ask. It bundles:

1. **Provenance** — NeWS/HyperLook port (1993), X11/TCL/Tk port, commercial **SimCityNet**
2. **Multiplayer UI design** — voting, bouncing proposals, non-interruptive play ([full exposition](../multiplayer-simcity-ui-network/article.md))
3. **Educational framing** — Columbia Earth Science scripting experiments; Constructionist goals later spelled out in OLPC lists
4. **Technical roadmap** — Python/Lua, OpenGL/Flash, **OpenLaszlo AJAX** web multiplayer, player-programmable behaviors
5. **Offer** — contribute all SimCity work as open source; remove license locks; kid-proof for XO hardware (including mono LCD)

Will and Rod's replies show EA leadership treated it as low-risk goodwill. Chuck Normann's contract archaeology cleared the DUX/Maxis Unix license path.

---

## Excerpt — offer to OLPC (Dec 2006)

> I would be glad to contribute all of my work on SimCity to the One Laptop Per Child project as Open Source. The source code is in good shape, with clean and well organized C and TCL code, but I haven't compiled or tested it in a long time. But in the mean time the software environment and hardware platforms have changed a lot, so it will take some effort to retrofit it with up-to-date libraries, remove the license locking code, and make it production quality and "kid proof".
>
> Some major improvements that are possible include: Switching to a better scripting language than TCL, like Lua or Python. Using a better graphics engine than X11, like OpenGL or Flash. Implementing a better user interface, with more control and monitoring features, like a **web based multi player OpenLaszlo "AJAX" interface**. Opening it up and refactoring it so players can add their own buildings and program their own behaviors. Developing scripts and course-ware for lessons, experiments and projects that students can work on. Storytelling, chatting and web publishing features (applying lessons learned from the ActiveX SimCity chat, The Sims Exchange and The Sims Online), so SimCity can be used for creative writing, geo-blogging, etc.
>
> Making the SimCity source code open source would certainly be the best way to enable that work to be done, and SimCity would be a fun but practical contribution to the One Laptop Per Child project!

---

## Links

- SimCityNet InterCHI'93 proposal: http://www.art.net/~hopkins/Don/simcity/simcitynet.html
- Don's catalog: http://www.donhopkins.com/home/catalog/simcity/simcitynet.html
- Open-sourcing SimCity (Medium): https://medium.com/@donhopkins/open-sourcing-simcity-58470a275446
- Chaim Gingold — *Building SimCity* (MIT Press, 2024)
- Guru / SC3K 3D context (why Maxis needed EA): [`../2026-simcity-3000-3d-preservation/`](../2026-simcity-3000-3d-preservation/README.md)

---

## Gaps

- [x] DUX/Don + DUX/Maxis contracts — [`characters/don-hopkins/career/contracts/`](../../../../don-hopkins/career/contracts/README.md)
- [x] EA↔OLPC PDF — `olpc-ea-contract.pdf` in contracts/
- [x] Transmogrifier **EA Tools EULA** — [`transmogrifier-ea-tools-eula.txt`](../../../../don-hopkins/career/contracts/transmogrifier-ea-tools-eula.txt)
- [x] Jan–May 2007 OLPC threads → [status](../2007-01-10-simcity-for-olpc-status/README.md) · [QA VM](../2007-01-29-olpc-simcity-ea-qa-vm/README.md) · [pre-contract QA](../2007-05-03-olpc-simcity-pre-contract-qa/README.md)
- [ ] Don: **distributor agreement** (separate from EULA) · name **EA executive** who flipped — see [micropolis-saga-don-draft](../micropolis-saga-don-draft/README.md)
- [ ] Don expanded first-person saga → merge draft into canonical article
