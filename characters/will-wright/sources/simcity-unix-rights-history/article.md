# SimCity Unix — rights, contracts, and DUX history

*Don Hopkins to Charles Normann (EA), 16 December 2006. Primary source for how Micropolis open-source clearance worked. Raw: [`simcity-unix.txt`](../../../../DonHopkins/temp/old-email/simcity-unix.txt).*

---

## Why Chuck asked

EA's **Charles Normann** needed to trace who owned the **Unix/X11 SimCity** port before GPL release for OLPC. Don had kept copies of contracts Maxis couldn't find.

---

## Contract timeline

| Date | Parties | Terms |
|------|---------|-------|
| **19 Jul 1991** | Maxis (Sim-Business) ↔ **DUX Software** | Exclusive license to convert SimCity to Unix/X; **10-year term** → expired **19 Jul 2001** |
| **18 Feb 1992** | DUX ↔ **Don Hopkins** | Don contracted to develop SimCity for Unix |

Both contracts completed without complication. DUX no longer in business; EA holds SimCity IP via Maxis acquisition.

---

## Two Unix products Don built

1. **HyperNeWS / HyperLook** (NeWS) — Sun-focused; pie menus; 1993 FTP sales  
   - http://www.donhopkins.com/home/catalog/hyperlook/SimCity.README  
2. **X11 / TCL/Tk** — scriptable; **multiplayer** vote/build; ported to Sun, SGI, HP, DEC, IBM, NCD, Linux  
   - http://www.donhopkins.com/home/catalog/simcity/simcity-announcement.html  
   - Unix World review Apr 1993 p.105; Unix Review **Outstanding Product 1993** p.52

---

## Demonstrations (proof of educational + multiplayer value)

| Event | Notes |
|-------|-------|
| **InterCHI '93** Amsterdam | Two SGI Indigos, networked multiplayer |
| **Electric Carnival / Lollapalooza '94** | Interval Research tent; SGI + NCD X Terminal kiosks |
| **MIT Media Lab Digital Life** May 2001 | "Public Process in the Digital Age" |
| **Columbia OPTIMUS** Nov 2002 | NSF — scripting for earth-science experiments |

Video: [Multi Player SimCityNet for X11 on Linux](https://www.youtube.com/watch?v=_fVl4dGwUrA)

---

## Proprietary bits (easy to remove)

- **Elan License Manager** — already ripped out  
- **Node-lock** by username/hostname — trivial to strip for GPL build  
- Don: *"All the rest of the code is stuff I wrote, and would be happy to publish as open source."*

---

## EA business case (Don's pitch)

- OLPC + open source community get educational non-violent killer app  
- Columbia curriculum + measured enrollment in hard sciences  
- **Positive publicity** for EA/Maxis brand  
- Classic open source **stimulates sales** of latest SimCity (cites SC2000 spike when classic still sold)

Contract excerpt in thread begins at typed **SOFTWARE LICENSING/DEVELOPMENT AGREEMENT** (scan offered to Chuck — not in public git).

---

## Related

- [`../simcity-open-source-saga/`](../simcity-open-source-saga/README.md) — Gilmore → Will → Rod same month  
- [`../2006-12-simcity-olpc-introducing-the-players/`](../2006-12-simcity-olpc-introducing-the-players/README.md)  
- [`../multiplayer-simcity-ui-network/article.md`](../multiplayer-simcity-ui-network/article.md)

## Gaps

- [x] DUX contracts — published in [`characters/don-hopkins/career/contracts/`](../../../../don-hopkins/career/contracts/README.md)
- [ ] Exhibit A excerpt article from [`olpc-ea-contract.pdf`](../../../../don-hopkins/career/contracts/olpc-ea-contract.pdf)
- [ ] Link scanned signatures if Don has cleaner scans than email paste
