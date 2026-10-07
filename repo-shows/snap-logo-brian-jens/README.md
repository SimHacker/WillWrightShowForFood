# Repo Show — Brian Harvey & Jens Mönig

**Type:** Group (collegial creative partners — interview together)  
**Guests:** [Brian Harvey](../../characters/brian-harvey/README.md) · [Jens Mönig](../../characters/jens-monig/README.md)  
**Invitations:** [`brian-harvey/invitation.md`](../../characters/brian-harvey/invitation.md) · [`jens-monig/invitation.md`](../../characters/jens-monig/invitation.md)

## Pitch

**Snap!** and the **Logo → Scheme → Smalltalk** lineage, told by the two people who carried it forward.
Jens **builds** Snap! (first-class everything — the Y combinator in blocks — on his own Morphic.js);
Brian **shapes and documents** it, and has spent a career making computing teachable (Berkeley Logo,
*CS Logo Style*, *Simply Scheme*, CS 61A, and the **Beauty and Joy of Computing**).

Not a couple — **colleagues joined at the heart** by the work. The 2024 ACM Karl V. Karlstrom
Outstanding Educator Award to Brian (with Dan Garcia, for BJC) cites Snap! and names Jens as its
principal developer — so a pair show tells the shared story once, together, instead of diluting it
across two solo episodes.

**Policy:** [`process/couple-and-solo-shows.md`](../../process/couple-and-solo-shows.md) — clean
single names in `characters/`; pair shows for natural partnerships; optional solos for deep verticals
only.

**Source artifacts:** [`brian-harvey/sources/`](../../characters/brian-harvey/sources/README.md) · [`jens-monig/sources/`](../../characters/jens-monig/sources/README.md)

**Field notebook:** Palm's [worm expedition](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/palm-on-worms-fieldnotes.md) — Theo the Logo Turtle, computational zoo — natural cross-ref for the Logo lineage episode.

**2018 thread:** Don's Micropolis × Snap! correspondence ([digest](../../characters/brian-harvey/sources/micropolis-snap-2018.yml)) — still an open demo beat.

**Snap! as the front end** for three engines, each one a block palette (commands poke, reporters
peek, hats fire on events):

- **Micropolis**: MicropolisCore's `MicropolisReactive` bridge (`poke`, `peek`, callbacks,
  `getSnapshot()`) already has the right shape for this. Zone a city and write tax policy from blocks;
  the simulator as a glass box.
- **CAM6**: a rule is a ring, and compiling it is a higher-order block that fills the lookup
  table. The table stays the same from Forth to C to JavaScript to blocks, so each step checks
  the last.
- **The emulator cabinet**: blocks to load a cartridge, step, peek and poke core, type at the
  teletype, and draw the 340's picture on the stage. Snap!'s turtle and the PDP-7 Forth turtle
  draw the same square. A Snap! script can even be the cabinet's
  [native CPU](../../packages/cabinet/ARCHITECTURE-AND-LINEAGE.md) and drive the devices directly.

The cabinet is also how the other engines arrive. Its CPUs and devices can wrap existing
TypeScript libraries: CAM-6, Micropolis, the Turing machine with Minsky's universal machine, Dave
Ackley's Movable Feast Machine, and von Neumann's 29-state CA with its universal constructor. Each
wrapper gets run, step, trace and recording from the cabinet, and a block palette in Snap!.

Designs: [Snap! as visual front end](https://github.com/SimHacker/moollm/blob/main/designs/snap/snap-visual-engines-fundable-goals.md) ·
[Micropolis constraint bridge](https://github.com/SimHacker/moollm/blob/main/designs/snap/micropolis-svelte-snap-constraint-bridge.md) ·
[cabinet TODO](../../packages/cabinet/TODO.md)

**Snap!Con 2025:** Brian's [Karlstrom evening address](https://www.youtube.com/watch?v=pDK2PE_pkqQ) — introduced by Jens — is the pair show's emotional spine: CCUS and no grades vs curriculum hoops; lambda in Snap!; "computing is your birthright." Digests: [Brian](../../characters/brian-harvey/sources/snapcon-2025-karlstrom-address.md) · [Jens hosts](../../characters/jens-monig/sources/snapcon-2025-karlstrom-intro.md).

**Metaprogramming / macros:** [technical digest](../../characters/brian-harvey/sources/snap-macros-metaprogramming.yml) — rings as quote, AST since v8, Lisp-family macros (partial). [Palm audience questions (readable)](audience/palm/questions.md) · [YAML SSOT](audience/palm/questions.yml) for the pair interview.

**Logo archaeology (Don):** [LLogo MacLISP rescue](../../characters/don-hopkins/sources/llogo-maclisp-its.md) · [full source](../../characters/don-hopkins/sources/llogo-maclisp-its/llogo.lisp.txt) · [C64 Logo Adventure](../../characters/don-hopkins/sources/logo-adventure-c64-terrapin.md) · [HN digest](../../characters/don-hopkins/sources/logo-archaeology-hn-digest.md) · [Palmhoo shelf](../../palmhoo/history-and-lore/logo-llogo-and-c64-adventure.md) — Brian teaches Logo in CSLS; Don shipped the first commercial game and stashed the lab implementation. Lars Brinkhoff's [PDP-10/ITS#620](https://github.com/PDP-10/its/issues/620) revival is the preservation beat.

## Episode seeds

See [`SHOW.yml`](SHOW.yml).

## Optional solos (deep verticals only)

- **Jens** — Snap! internals, schemas (Don's Snap!Con Barcelona talk), distributed/actor systems.
- **Brian** — his books and lifelong Logo work.

Neither substitutes for this pair interview of the shared Snap!/BJC/Logo story.
