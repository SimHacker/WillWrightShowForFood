# David Temkin

Invitation portrayal — **not** David Temkin. [Standards](../../schemas/portrayal-standards.md)

**Field:** Laszlo Systems / OpenLaszlo · OpenLaszlo 5.0 · **Declare** · Mesa · In Formation · Cola

[Invitation](invitation.md) (group **and/or** 1:1 — whatever works) ·
[Show seed](../../repo-shows/openlaszlo/README.md) · [CARD](CARD.yml) · [Sources](sources/README.md) ·
[Ideas](ideas.md)

Co-invitees: [Don Hopkins](../don-hopkins/) (host + cast) · [Henry Minsky](../henry-minsky/) ·
[Oliver Steele](../oliver-steele/) · optional: [David Ungar](../david-ungar/) ·
[Brad Myers](../brad-myers/) · [Craig Latta](../craig-latta/)

David founded **Laszlo Systems** (2000) and created **OpenLaszlo** — the **LZX** XML+JavaScript
language and Presentation Server for rich internet applications, which compiled to Flash or
DHTML/Ajax and was open-sourced in 2004. He later co-founded the mobile-communications company
**Cola**. Don worked with him (alongside Henry Minsky and Oliver Steele) on OpenLaszlo.

## OpenLaszlo 5.0 (2026)

David published **[OpenLaszlo 5.0](https://github.com/davidtemkin/openlaszlo-5.0)** under a
"Software Preservation Society" frame: Java removed, compiler + server ported to TypeScript,
LZX compiling **in the browser** (byte-for-byte vs 4.9 DHTML). Live Explorer:
https://davidtemkin.github.io/openlaszlo-5.0/

LinkedIn announcement + reunion thread:

→ [`sources/2026-openlaszlo-5.0-linkedin-thread.md`](sources/2026-openlaszlo-5.0-linkedin-thread.md)

## Declare (2026) — the heir, not a port

After the 5.0 binge, David built **[Declare](https://github.com/davidtemkin/declarelang)** —
a UI DSL whose whole surface fits an LLM context window. Live (homepage is a Declare app):
https://davidtemkin.github.io/declarelang/

- `[ … ]` = view tree; `{ … }` = TypeScript constraints that stay true
- No re-render / VDOM / hooks; no CSS-as-language; DOM **or** canvas
- Compiler in browser or Node; agent skill + `docs/declare.md`; `verify` ladder
- Lineage: **heir to OpenLaszlo**, ground-up redesign for LLMs — not a port / not a reimplementation
  of LZX. Don's frame: OL 5.0 = camera on the stage; Declare = **cinematography** (reimagine).
  Bet: LZX → Declare rewrites will be easy because the models align.

**Does it use Svelte?** No. **Resemble Svelte 5?** Spiritually yes (compile-time reactivity,
assignment notifies) more than React — but custom language, datapath replication, State/Spring
first-class. Open question for Oliver: does Declare obey the **Instance Substitution Principle**?
Pull **Dave Ungar** (interviewed at Laszlo and got it) into the circle.

Deep sniff + Svelte triangle: [`sources/declarelang.md`](sources/declarelang.md)  
DM spark (wet cement — ask before quoting on air): [`sources/2026-linkedin-dm-declare.md`](sources/2026-linkedin-dm-declare.md)

**Aug 2026:** David accepted the invite; **Wednesday 6:00 PM Don time** call scheduled. His Aug 3
email walks through Declare **push** constraints (spreadsheet / compiler-derived deps), embedding
limits, JSON-bridge integration, and the **Desktop** demo as in-app window manager — with Don's
[Garnet/OL/Svelte article pack](../don-hopkins/sources/articles/README.md) in reply:
[`sources/2026-08-03-declare-constraints-thread.md`](sources/2026-08-03-declare-constraints-thread.md)

## Mesa · In Formation · Claude Code game port

Spatial AI canvas, print satire revival, 1991 Mac stereo game → JS — Act IV material:

→ [`sources/mesa-and-in-formation.md`](sources/mesa-and-in-formation.md)

Micropolis historic LZX client:
https://github.com/SimHacker/MicropolisCore/tree/main/documentation/openlaszlo

## Primary sources (2006 mail)

Laszlo/OpenLaszlo engineering threads from Don's archive are held privately
pending hand curation. One public seed already planted:
[`sources/2006-don-tom-lord-openlaszlo-spidermonkey-seed.md`](sources/2006-don-tom-lord-openlaszlo-spidermonkey-seed.md)
(OL runtime / SpiderMonkey ambition + lisp-heads quote from Don→Tom Lord; full letter private).

Verifiable sources in `CHARACTER.yml`. Subject may request correction or removal anytime.
