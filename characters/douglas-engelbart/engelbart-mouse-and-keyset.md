# Engelbart mouse and chord keyset — tactile NLS hardware

The **mouse** and **five-key chord keyset** were not side gadgets — they were half of Engelbart's **augmentation** stack: point at graphics with one hand, chord text with the other, NLS on a PDP-10 behind it.

This artifact tracks **living hardware**, **provenance**, and **reproduction** — not the feature-list reduction Bret Victor warns against, but the *felt* experience of bootstrapping.

Engelbart, after Marvin Minsky described what the AI lab would do for machines:

> "You're going to do all that for the machines? What are you going to do for the people?"

Jaron Lanier heard him tell it. Full review: [`../jaron-lanier/sources/2005-american-scientist-early-computings-long-strange-trip.md`](../jaron-lanier/sources/2005-american-scientist-early-computings-long-strange-trip.md). The keyset is the virtuosity half of that question.

---

## What they are

| Device | Role in NLS |
|--------|-------------|
| **Mouse** | SRI wooden/metal prototype lineage — two orthogonal wheels, discrete clicks against screw limits; RS232 dongle to lab machine |
| **Chord keyset** | One hand types via 5-bit chords — `"ABCDEFGHIJKLMNOPQRSTUVWXYZ!"` — Doug's demo alphabet |

**Tactile thesis (Don, 2023):** museums must not wear out originals, but the **rolling wheels clunking against screw limits** is worth reproducing — scan, mill, Bluetooth bridge in authentic RS232 shell, use daily at Starbucks.

---

## Provenance map (in-repo network)

| Holder | Story | Source |
|--------|-------|--------|
| **Don Hopkins** | Set from **Mark Lottor** (SRI — kept Engelbart's PDP-10 running for NLS demos). Mouse underside: **Cybernex, Palo Alto, SN M026, 8/76**. Koala sticker (whose is unknown). Netherlands. | [`sources/cybernex-palo-alto.md`](sources/cybernex-palo-alto.md) · [`media/don-cybernex-mouse-underside-sn-m026-1976-08.jpg`](media/don-cybernex-mouse-underside-sn-m026-1976-08.jpg) · [`sources/2022-2023-engelbart-mouse-alan-kay.md`](sources/2022-2023-engelbart-mouse-alan-kay.md) |
| **Mark Lottor** | Sold his set **2017 → $8,500 → Paul Allen Museum** (pre-Allen death). Network Wizards; NIC era. | same |
| **David Maynard** | **50-year-old mouse** photo on Facebook Internet Old Farts Club (2022). Had keyset; **donated to Harold C. Hohbach History of Science & Technology collection**, Stanford. | [`../dave-maynard/`](../dave-maynard/) |
| **Bill Daul / RR Auction #8002** | Engelbart gave this pair to **Bill Daul** (SRI ARC). Sold **2022-03-17** for **$54,904** incl. premium (est. $30,000+). *The Steve Jobs Revolution* (#632). **Not Don's set.** Catalog + photos: [`sources/2022-rr-auction-bill-daul-mouse-keyset.md`](sources/2022-rr-auction-bill-daul-mouse-keyset.md) | https://www.rrauction.com/auctions/lot-detail/345548606328002-douglas-engelbart-x-y-axis-mouse-and-coding-keyset/?li=345548606328002 |
| **Christie's 2024** | Living Computers / Paul Allen holdings sold after the museum closed. Public lot (Lottor said this was the set he sold in 2017). Catalog titles it **Cybernex, 1968** and prints **Serial number M026** — same number as Don's label. Do not collapse the two objects until compared. [`sources/cybernex-palo-alto.md`](sources/cybernex-palo-alto.md) | https://www.christies.com/en/lot/lot-6495041 |
| **Alan Kay** | Cardboard **Dynabook** model → Jack Goldman (PARC funder); later model for **Computer History Museum** (photos in Don↔Alan mail Dec 2022). | Alan Kay correspondence |
| **Glenn Edens** | GRiD/PARC/Lisa mouse lineage; Interval colleague; Dec 2022 consultation on Don's set (document, auction timing, koala sticker). | [`../glenn-edens/`](../glenn-edens/) |

RR studio photos of the **Daul** pair (cream keyset + 3-button mouse; underside 6-screw metal plate, stamps, **05 - 81 4**): [`media/rr-2022-bill-daul-pair.jpg`](media/rr-2022-bill-daul-pair.jpg) · [`media/rr-2022-bill-daul-mouse-underside.jpg`](media/rr-2022-bill-daul-mouse-underside.jpg)

---

## Community thread (Dec 2022)

Facebook **Internet Old Farts Club** — old mice discussion:

https://www.facebook.com/groups/internetoldfarts/posts/681963806784174

**David Maynard** posted his mouse; Don recognized the SRI lineage; Maynard on keyset donation and [`software-artist.com/keyset/`](https://www.software-artist.com/keyset/).

Maynard attended **Ted Nelson's tribute** to Doug; recommended *What the Dormouse Said*. Jaron's full 2005 review: [`../jaron-lanier/sources/2005-american-scientist-early-computings-long-strange-trip.md`](../jaron-lanier/sources/2005-american-scientist-early-computings-long-strange-trip.md).

---

## Doug's advice (Valerie Landau channel)

> Make sure that whatever you do is very modular… some of your ideas will endure, and some are not… separate the pieces so those pieces can carry on.

HN: https://news.ycombinator.com/item?id=17121629 · Video: https://www.youtube.com/watch?v=62ig8ecXlrA

---

## Public replica and USB work (do not reinvent)

These are **other people's published projects**, not Don's hardware.

| Project | What |
|---------|------|
| **Ken Shirriff, 2025** | Teensy 3.6 USB keyboard + USB-host mouse. Christina Engelbart loaned a keyset. DB-25, 1.5 kΩ on leftmost switch, mouse buttons as shift. Notes: [`sources/2025-ken-shirriff-usb-keyset.md`](sources/2025-ken-shirriff-usb-keyset.md). https://www.righto.com/2025/03/mother-of-all-demos-usb-keyset-interface.html |
| **Eric Schlaepfer / TubeTimeUS** | Accurate 3D-printed keyset; internals match the original. https://github.com/schlae/engelbart-keyset |
| **Russ Nelson / PJRC** | Teensy chording keyset; character on first release; chord 31 = NOP. https://www.pjrc.com/engelbart-chording-keyset/ |
| **DEI Historic Firsts** | Cue card, binary finger lesson, 1969 demo clip. https://dougengelbart.org/content/view/273/ |

---

## Reproduction plan (Don → Alan Kay, Jan 2023)

1. Professional disassembly + reverse-engineer electronics  
2. High-res 3D scan; print durable case; **mill** wheels (not sintered metal — feel matters)  
3. Authentic RS232 dongle housing **Bluetooth HID** thumb computer  
4. Limited run → Kickstarter scale  
5. Original locked safe; reproductions increase documented value of prototype  
6. Target hype window: **2028** — 60th anniversary of Mother of All Demos  

---

## Show segments

| Segment | Guests |
|---------|--------|
| **Feel the wheels** | Don demo (replica or video); compare to Buxton "straw man" — here authenticity is the point |
| **Chord alphabet live** | `"ABCDEFGHIJKLMNOPQRSTUVWXYZ!"` — Ted Nelson wedding / eulogy thread |
| **Collector roundtable** | **Dave Maynard** + Don — Old Farts Club, Stanford Hohbach donation, auction market |
| **Mark Lottor beat** | SRI PDP-10 demos; Paul Allen Museum sale (field contact) |
| **Alan Kay Dynabook models** | cardboard → CHM — intent vs artifact |
| **NLS emulator** | PDP-10 / emulator + replica input — don't wear originals |

→ [`../../repo-shows/remembering-douglas-engelbart/README.md`](../../repo-shows/remembering-douglas-engelbart/README.md) · [`memorial.md`](memorial.md) · [`../dave-maynard/invitation.md`](../dave-maynard/invitation.md)

---

## Video anchors

- Mother of All Demos: https://www.youtube.com/watch?v=yJDv-zdhzMY  
- Ted eulogy / Doug officiates Ted's wedding: https://www.youtube.com/watch?v=yMjPqr1s-cg  
- Valerie Landau / Doug's modular advice: https://www.youtube.com/watch?v=62ig8ecXlrA  
- Islandeweller Engelbart archive: https://www.youtube.com/user/islandeweller/videos  
