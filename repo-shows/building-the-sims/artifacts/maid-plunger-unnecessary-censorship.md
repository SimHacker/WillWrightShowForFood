---
id: maid-plunger-unnecessary-censorship
title: "Maid, plunger, unnecessary censorship"
hook: "Pixelation + plunger motion between a pooping Sim's legs looked like manual sex work."
category: [censorship, maid, simantics, qa-comedy]
status: fixed-pre-ship
heat: high
guests: [jamie-doornbos, don-hopkins, chris-trottier, claire-curtin]
---

# Maid, plunger, and unnecessary censorship

## Hook

The modesty bar made the maid's toilet repair *worse* — vigorous plunger work between a seated,
pixelated Sim read like an SNL **Unnecessary Censorship** sketch.

## Story

Before **bathroom privacy** existed:

1. Sim needs potty → bathroom → body pixelates → sits on toilet.
2. Sim has bowel movement **in trousers** (no pants-off state — see
   [`pooping-in-pants-on-toilet.md`](pooping-in-pants-on-toilet.md)).
3. Toilet becomes dirty and **clogged**.
4. **Maid** enters (no privacy lock yet).
5. Maid produces plunger from **hammerspace**, thrusts between Sim's legs, pumps handle up and down.
6. Censorship shimmer + animation → players' imaginations do the rest.

Fixed before ship with heavy **SimAntics** work (Don's memory). No known surviving video.

## Chain

[`clogged-toilet-summons-maid.md`](clogged-toilet-summons-maid.md) →
[`bathroom-privacy-blocks-maid.md`](bathroom-privacy-blocks-maid.md) →
[`simantics-maid-plunger-fix.md`](simantics-maid-plunger-fix.md)

## Ask on air

- Who wrote the original maid service graph? (Summer intern — name?)
- What SimAntics nodes changed — privacy, interrupt, toilet state, or plunger routing?
- Did QA file this as severity 1 or as comedy relief?

## Integrated spine

Full chain + reunion prompts: [`../maid-plunger-incident.yml`](../maid-plunger-incident.yml)

Flipbook B-roll: [`../../flipbook-maid-plunger-incident/README.md`](../../flipbook-maid-plunger-incident/README.md)

## Primary source (Don HN, verbatim)

[`../sources/maid-plunger-incident-hn-2022.md`](../sources/maid-plunger-incident-hn-2022.md)

> She would then stroll over to toilet, whip out a plunger from "hammerspace", and thrust it into
> the toilet between the pooping Sim's legs, and proceed to move it up and down vigorously by its
> wooden handle. The "Unnecessary Censorship" strongly implied that the maid was performing a manual
> act of digital sex work. That little bug required quite a lot of SimAntics programming to fix!

## Sources

- [`../pixelation-and-modesty.md`](../pixelation-and-modesty.md)
- HN https://news.ycombinator.com/item?id=30359560
- Unnecessary Censorship: https://www.youtube.com/watch?v=6axflEqZbWU
- Prototype plunger mesh: `MicropolisCore/content/vitamoo/sims-prototype-1998/xskin-suit-plunger.cmx`
