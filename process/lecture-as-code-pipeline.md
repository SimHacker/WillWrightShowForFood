# Lecture as code — one source, two backends, and a microworld at the end

[Constructionist SimCity response](constructionist-simcity-response.md) · [Live repo](live-repo.md) · [Linguistic motherboard](https://github.com/SimHacker/moollm/blob/main/designs/postscript/LINGUISTIC-MOTHERBOARD.md)

---

## The hook

Explainer videos are rendered artifacts: fix a mistake and you re-render, and a viewer can never poke the thing being explained. Write the lecture as **source** instead and both problems change shape. Corrections become diffs with visible history, and the same source can drive an interactive version alongside the video.

This is Warnock's argument one level up. PostScript was the expressive language and PDF was the inert output; keep the language in the middle and let the flat file be one export among several.

## Two backends, one source

A lecture source in [YAML Jazz](https://github.com/SimHacker/moollm/tree/main/skills/yaml-jazz) — narration beats paired with scene operations — compiling to:

| Backend | Licence | Role |
|---------|---------|------|
| **Manim Community** (Python) | MIT | Offline renders: video, stills, print figures |
| **Motion Canvas** (TypeScript) | MIT | Browser version: scrub, pause, poke, inspect |

Both are open. Do not build the open pipeline on [Remotion](https://www.remotion.dev/) — its licence is company-issued, not MIT. [Theatre.js](https://www.theatrejs.com/) (Apache-2.0) is a reasonable sequencer if hand-tuned timing is needed.

## What Manim is actually good at

Better fit for this material than its reputation suggests, because most of what we explain is boxes and arrows:

- **Graphs as first-class objects** — `networkx`-backed `Graph`/`DiGraph` mobjects with animated re-layout. Delegation chains, message sends, prototype parent slots, object graphs.
- **SVG as editable vectors** — `SVGMobject` turns paths into ordinary manipulable objects, so slides exported through PDF to SVG animate piece by piece instead of arriving as flat images.
- **Transform between arbitrary shapes** — the morph that makes an equation and a picture the same statement.

Weak at prose layout (Pango and LaTeX, not a typesetting engine), no video inside a scene, and no event model at all. It renders; it cannot be poked. Architecturally it is a retained scene graph with time-keyed animation — closer to OpenLaszlo than to NeWS.

Browser-native Manim is not on the table: native C extensions (`pycairo`, `manimpango`, `skia-pathops`, `moderngl`) plus a LaTeX install. Closed commercial WebGPU ports exist. An open browser-native equivalent does not, which is why the second backend is a different library rather than a port.

## Why the vocabulary is the asset

LLM-generated animation code breaks on API churn and positioning guesswork. What makes generation reliable is a **small vetted helper vocabulary plus worked examples** — [Instance-First Development](../characters/oliver-steele/) in Oliver Steele's sense: write the working instances, then discover the schema by refactoring what the examples already share. Everyone who builds this discovers the same thing; the difference is whether the vocabulary ships published or stays a moat.

## The end state is a microworld, not a video

Micropolis already runs in the browser under WebAssembly. For Will Wright's design ideas the artifact should be **the running simulation with annotation overlays and a narration track that drives it** — not a video of a simulation. The narration points at mechanisms while the mechanisms are live and the viewer can take the wheel mid-sentence.

The complaint people make about lecture video is that it removes access to the expert. A microworld does not restore the expert, but it restores the thing the expert was pointing at. Papert's argument, with thirty years of receipts and a glass-box SimCity to run it in.

## Further than ARK

For the Self material this is not an aspiration, it is a lineage with unfinished business. [Randall Smith](../characters/randall-smith/) built the **Alternate Reality Kit** at PARC — a physics microworld you programmed by grabbing things — and wrote the CHI 1987 paper naming the **tension between literalism and magic**. Then Smith and John Maloney built **Morphic** for Self 4.0, whose UIST 1995 paper is literally titled *Directness and Liveness*, and Morphic jumped to Squeak, Etoys, and the Snap! that already drives Micropolis. **Kansas** put everyone in one shared flat world for distance learning in the 1990s. Animating a Self object graph in a render pipeline would be a step backwards from work finished thirty years ago.

So the target is Morphic-lineage direct manipulation, going further on the axes ARK and Morphic left open:

| Axis | What they had | Further |
|------|---------------|---------|
| **Persistence** | Liveness with snapshots — you poke a live world and save an image | Every manipulation emits **source**: a diff you can review, revert, replay, and narrate. Directness *and* provenance. |
| **Sharing** | Kansas got there first, on a 1990s network | Browser and WASM, with asymmetric roles — lecturer and students inhabiting one world, the narration track a first-class inhabitant |
| **Magic** | Literal metaphors break exactly where magic is needed, and the magic stays mute | A model inside the world can **explain the magic in words** and write the delegation on request. Randy had two options; there are three now. |
| **Tour** | No notion of a scripted path through a world | A time track that drives the world and can be taken over mid-sentence |

The interaction layer is Don's own entry in that argument: a pie menu is a magic act wearing a literal costume.

Korz — dimensional slicing — is the test case for whether interaction is first-class in the source language rather than bolted on, because slicing *is* the interaction.

## Candidate first pieces

- **Will Wright's design ideas** — Micropolis running, overlays naming the mechanisms. Glass box, per the [constructionist response](constructionist-simcity-response.md).
- **Self, prototypes and delegation** — renders only for the family tree (ARK → Morphic → Squeak → Etoys → Snap!); the explainer itself is a live Morphic-lineage world. [David Ungar](../characters/david-ungar/) · [Randall Smith](../characters/randall-smith/).
- **Korz dimensional slicing** — the interaction *is* the subject, so it is the honest test of the source language.
- **PostScript to PDF, via the Distillery** — partial evaluation with loops unrolled, already written up in the trails.

## Ground rules

Clear rights before rendering anyone's slides, artwork, or screen captures — see `catalogs/soul-city/rendering-and-rights.md`. Prototype one short piece on both backends before generalizing anything. Publish the vocabulary.

↑ [process index](README.md) · Girder: `lecture-as-code-pipeline.yml`
