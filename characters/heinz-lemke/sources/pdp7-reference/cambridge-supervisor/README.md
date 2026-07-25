# Cambridge Supervisor planning documents — Titan/PDP-7 link

Primary sources for the **system software** on Wiseman's Titan ↔ PDP-7 link — the
layer under PIXIE's application-level blocklets. Mirrored from the
[CUCPS Titan archive](https://cucps.soc.srcf.net/titan/) (Cambridge University Computer
Preservation Society), distributed by permission of Barry Landy, Roger Needham, and
David Hartley.

## Planning Document 10 — Software for the Titan/PDP-7 link

| | |
|--|--|
| **Author** | **C.A.L.** = **C.A. Lang** (Charles Lang) — founded/headed the Cambridge CAD Group from 1965 ([CL history](https://www.cl.cam.ac.uk/events/EDSAC99/history.html); GUIDE already credits him for link software) |
| **Date** | 2 December **1965** — four years before PIXIE film, seven before the recovered listing |
| **Public URL** | <https://cucps.soc.srcf.net/titan/supplan/pd10.htm> |
| **Local HTML** | [`pd10-titan-pdp7-link.htm`](pd10-titan-pdp7-link.htm) (mirrored 2026-07-26; keep — Facebook's link preview got **403 Forbidden** on the live URL) |
| **Readable edition** | [`pd10-titan-pdp7-link.md`](pd10-titan-pdp7-link.md) |

**Found by:** Ric Werme in the
[Internet Old Farts Facebook thread](../../2026-07-24-facebook-guessing-game.md), from the
listing page captioned "PDP7-TITAN" — crowd archaeology delivering the supervisor doc
students need to resurrect the wire.

### What PD10 proposes (four facilities)

1. **Core-to-core block transfers** either direction, either machine initiating —
   Titan as master; PDP-7 transfers only after Titan permission. Implemented as four
   Titan **extracodes** analogous to magnetic-tape select/read/write, packing
   **18-bit PDP-7 words into 48-bit Titan words**.
2. **Attentions** (Project MAC name) — a queue on the PDP-7 of time-sequenced events
   (light-pen sees, push buttons, requests for Titan data, display-interrupt info)
   waiting for Titan. Lets the PDP-7 user keep working while the Titan program runs
   intermittently. PDP-7–initiated core transfers go through Attentions.
3. **Titan disk access** from the PDP-7 — via a Titan user program + core transfers
   (preferred), a privileged permanent Titan daemon, or (rejected) pretending the PDP-7
   is a fast teletype on the Multiplexer.
4. **Time-sharing on a teletype at the PDP-7** — strongly recommends a **second
   teletype** wired to the Multiplexer rather than multiplexing one TTY between PDP-7
   and Titan. Exactly the [two-teletypes workflow](../../../ideas.md) Heinz's thesis
   Figs 8.6/8.7 show in practice.

### How it maps onto what PIXIE actually shipped

PD10 is the **1965 supervisor contract**. PIXIE's `/LTPIX` routine (1972 listing) is the
**application layer** that rode that contract — blocklets, `PXID`, checksums, relocation.
Decode: [`../TITAN-LINK-PROTOCOL.md`](../TITAN-LINK-PROTOCOL.md). Emulation stubs should
implement PD10's four facilities as the Titan-service surface, then speak PIXIE's
blocklets on top.

Index of all supervisor planning docs:
<https://cucps.soc.srcf.net/titan/supplan/>

↑ [pdp7-reference](../README.md) · [turist guide](../GUIDE.md) · [character README](../../../README.md)
