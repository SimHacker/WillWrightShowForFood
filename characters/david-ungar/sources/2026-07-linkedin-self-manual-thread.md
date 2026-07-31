# LinkedIn — Self manual find (Jul 2026)

*Public comments harvested 2026-07-31. Source material from the people themselves and their admirers. Portrayal standards apply — not putting words in anyone's mouth beyond what they wrote here.*

| Field | Value |
|---|---|
| Spark | Amanda Walker — found spiral-bound Self manual in 90s office-move box |
| Also | Urs Hölzle (advisor story / manual writing apprenticeship); David Ungar reply |
| Related invite | [`../invitation.md`](../invitation.md) |
| Amanda room | [`../../amanda-walker/`](../../amanda-walker/) |
| Urs room | [`../../urs-hoelzle/`](../../urs-hoelzle/) |

## Amanda Walker (OP)

Going through a box that appears to be from an office move in the 90s. @Urs Hölzle when I
joined Google I knew your name was familiar…

Self was the first programming language I'd ever encountered that used prototype
inheritance rather than class-based inheritance.

*(Image of the spiral-bound Self manual.)*

## Urs Hölzle

That's how I learned to write in English… my advisor (David Ungar) asked me to expand the
draft sketch of a manual we had, and about 30 versions later, there we had it. Dave was an
excellent writer, and through the many rounds of his feedback I learned a lot! I should dig
up my own copy, which I *know* is somewhere 😉

I had trouble finding the original online, but v4 is here: https://lnkd.in/eCMbDnii

## David Ungar

Urs, thank you for this. Working with you was one of the best times of my career. Russell
Allen has kept the virtual machine alive, and recently gotten your SIC (simple inlining
compiler) working on 64-bit Macs. And I've been doing some programming in that IDE, which I
love so much. What a blast! It's up on Github for downloading.

I'm excited about spatial computing and wrote some apps in Swift for the Apple Vision Pro.
But I really want an exploratory programming environment for this activity. Guess what I'm
hoping to use?

I still believe that the implementation techniques from your dissertation coupled with the
Self UI techniques and the IDE techniques combine to make such a fun experience writing
programs! Split second response time to every operation, including changing, running
optimized code…

## Don Hopkins — reply to Michał Piszczek (posted 2026-07-31, two segments)

**Segment 1:** Self's prototype model didn't quietly win. Half a win is a loss with better
marketing. Self got it right the first time: no classes, no constructors, just objects with
slots and multiple named parents you can reparent at runtime. Simplicity was the thesis that
JavaScript totally missed the boat on — Ungar & Smith, "The Power of *Simplicity*" — not
"prototypes as a quirky alternative to classes." JavaScript misappropriated the word
"prototype," glued on constructor functions and `new`, forced a static single-inheritance
parent chain, and spent twenty years bolting `class` syntax back on top. Prototype theater.
The engines are brilliant (maps, PICs, adaptive JIT — Self's implementation lineage via
HotSpot into V8). The language design fumbled the thing it claimed to borrow. (Plus the
Eich equality-table / equal-rights coda: https://dorey.github.io/JavaScript-Equality-Table/)

**Segment 2:** Java and C# are the other fork of the same failure mode: keep the class
hierarchy Self deliberately threw away, then quietly absorb Self's VM tricks so the wrong
object model can run fast. Bastardized cheap imitations — of the speed story, not the
simplicity story. The spiral-bound printout had the real thing; the browsers run a castrated
cover version with a world-class band behind it. Then the MOOLLM pitch: a "Selfish" object
system for LLMs that multiply inherits from files *and* latent space — parents like
"The Power of Simplicity" or US patent 5,187,786 — with the SELF-AND-MOOLLM link.

*Correction needed: LinkedIn rendered the Owen Densmore mention as "@null" — edit the
comment so Owen M. Densmore gets his credit next to David S. H. Rosenthal.*

## Admirers / peers (selected)

**Michał Piszczek** — Self's prototype model quietly won, half of JavaScript's object system
traces straight back to it, strange to think a research language from a spiral bound
printout ended up running in every browser on the planet.

**Chris Laffra** — Self developed while he finished MSc / started PhD; influenced his
PROCOL (prototypes, not inheritance). Grateful for discussions with Urs, Craig, and Dave.
Hosted Ungar at Morgan Stanley ("C++ bastion… suits… not at all friendly towards his crazy
hippy ideas"). Cartoon-inspired animation in Self UI in early 1990s "just crazy for that
time."

**Elizabeth Markman** — "I remember it! Go/ursmanual IIRC."  
**Ralph Pearson** — thinks that's a different manual of 'self'…

**John Lunney** — used [Io](https://en.wikipedia.org/wiki/Io_(programming_language)), inspired by Self.

**Mathias R Baumgartner** — SGI / CC-NUMA / Sun Starfire era memories; "SELF was the father
of modern VMs and JIT."

**Alfred Spector** — "fun story, Urs."

**Pankaj Mehra** / **Naveen Ashish** / **Jin Huang** — intern / learning-by-doing side thread
(less Self-specific; kept for thread completeness).

## Show hooks mined here

1. Ungar still in the Self IDE (Russell Allen / SIC on 64-bit Macs) — live demo fuel
2. Spatial computing / Vision Pro — exploratory Self UI+IDE hope (ideas.md §10)
3. Urs's writing apprenticeship under Ungar — "30 versions" as craft ethic
4. Laffra: Self cartoon animation + visiting the C++ bastion — UI history beat
5. JS "quietly won" framing (Piszczek) — pair with Don's Self-vs-JS theater critique
6. Amanda as spark — Galaxy / PostScript friend who found the artifact
