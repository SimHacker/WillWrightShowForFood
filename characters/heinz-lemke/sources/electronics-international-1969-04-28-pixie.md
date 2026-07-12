# Electronics International — PIXIE (28 April 1969)

Public-safe source summary. Full OCR + image placeholders in private archive.

## Metadata

| Field | Value |
|-------|-------|
| Publication | *Electronics International* (McGraw-Hill) |
| Date | 28 April 1969 |
| Pages | 158–159 |
| Credit | Neil Wiseman, Heinz Lemke, John Hiles — Cambridge University Mathematical Laboratory |
| Provenance | Received from Heinz Lemke via email attachment, 10 July 2026 |
| Private archive | `DonHopkins/.../heinz-lemke/electronics-international-1969-04-28-pixie.md` |
| Keywords | PIXIE, PDP-7, DEC 340, light pen, CAD, Cambridge, satellite computer |

## Summary

Trade-press account of PIXIE: a **PDP-7 + DEC 340** satellite handles interactive schematic
drawing with **light-pen-only input**; the **ICL Atlas** mainframe runs analysis only after the
designer commits. Three manipulation levels in Pixie 1 (elements, nodes, subcircuits); Pixie 2
planned with eight. The piece gave PIXIE international visibility and led to invited lectures at
**20+ US R&D institutions** — including MIT, where Heinz met Joe Weizenbaum in 1969.

Heinz's 2026 correction: the PDP-7 was not a dumb terminal — ~5000 instructions on the PDP-7
built graph models interactively before Titan simulation. See [`pixie-source-recovery.md`](../pixie-source-recovery.md).

## Key quote (photo caption, p 158)

> Light writing. Heinz Lemke of the Cambridge University Mathematical Laboratory developed the
> command scheme for the Pixie CRT System. Only the light pen — there are no buttons to push — is
> used to change designs.

`[IMAGE: electronics-1969-p158-light-writing — filed as media/from-mail/roy-eagleson-identified-heinz-pdp7-light-pen.png]`

## Architecture (from article)

- Main: ICL Atlas Mark 2, 120K words × 48 bits, Cambridge multi-access
- Satellite: DEC PDP-7, 8K words × 18 bits + DEC 340 display
- Workflow: temporary display file → up-compiler → permanent display file
- Modes: drawing ↔ pointing (blink-on-aim, erase, move, assign values)

## Show use

- Historic episode: US research-lab tour seeded by this article
- Pair with [`cambridge-films-flight-of-the-bumblebee.md`](../cambridge-films-flight-of-the-bumblebee.md)
- Pair with Roy Eagleson's Sketchpad → PIXIE lecture pivot (July 2026)

↑ [`correspondence.md`](../correspondence.md) · [`pull-in-gaps.md`](../pull-in-gaps.md)
