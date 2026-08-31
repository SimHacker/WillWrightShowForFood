# The Crutchfield Machine — 1984's rig, rebuilt as a GPU instrument 🦋🎛️

*Annex note by Don Hopkins describing a third-party open-source project. Everything here
is sourced from the public repository. It is not Jim's work and not his words.*
[Portrayal standards](../../schemas/portrayal-standards.md)

> **[splashkes/crutchfield-machine](https://github.com/splashkes/crutchfield-machine)** —
> "Modern GPU focused implementation of early (and later) video feedback looping
> experiments." MIT licensed. C++ / GLSL, ~88 commits, 11 releases.
> By **Simon Plashkes**, with **Claude** listed as a co-contributor.

Somebody read the 1984 paper, took its parameter list literally, and built the rig in
fragment shaders. Not a demoscene homage — a **parameter-faithful reimplementation**
with a `CREDITS.md` that cross-references each shader uniform back to the equation,
table, or appendix paragraph it came from.

## The thing itself

The operator `T` is split into **12 toggleable layers**, each its own `.glsl` file under
`shaders/layers/`, composed by an orchestrator behind an enable bitmask the host
uploads. Layers hot-reload from disk while it runs (`\`), so you tune the loop the way
you'd reach over and turn a knob on a physical mixer. Toggle keys are `F1`–`F10`.

| Layer | What it is |
|---|---|
| `warp` | zoom, rotation, translation — Crutchfield's `b`, `φ`, pan |
| `thermal` | noise-driven UV displacement, deliberately placed *between* warp and optics because in the physical world it's the air between camera and monitor |
| `optics` | anisotropic Gaussian blur — defocus as the spatial diffusion rate |
| `physics` | luminance inversion (`s = ±1`), sensor gamma, saturation knee, RGB cross-coupling |
| `color`, `contrast`, `decay`, `noise` | hue rate, contrast, storage decay `L`, noise floor |
| `couple` | the multi-field ring — Kaneko territory |
| `external` | live webcam (`F9`), Media Foundation / AVFoundation / V4L2 |
| `inject` | hold a pattern in front of the loop and let it metabolize it |

A camera-in-the-loop layer plus a frame-buffer pipeline is **variation (6) of §5**,
built: *"inserting a digital computer into the feedback loop via a video frame buffer."*
The paper proposed it as future work in 1984; here it's the default architecture, and
the camera is the optional part.

## The credits document is the interesting artifact

[`CREDITS.md`](https://github.com/splashkes/crutchfield-machine/blob/main/CREDITS.md)
maps **Table I** of the Physica D paper — the eight-to-ten knobs on a physical
camera-monitor rig — onto named uniforms, one row per control: `zoom (b) → uZoom`,
`rotation (φ) → uTheta`, `focus → blurX/Y/blurAngle`, `storage decay (L) → uDecay`,
`diffusion (a), eq. 2 → the Gaussian kernel in optics.glsl`, `noise floor (Appendix) →
uNoise`.

The four knobs in the `physics` layer come from the parts of the paper people usually
skip: **luminance inversion** `s = -1` from eqs. 1 and 3, the **off-diagonal `L̄`
color-channel crosstalk** from eq. 5, and **photoconductor response `i₀ ∝ Iᵢ^γ`** plus
the **saturation threshold `I_sat`** from the Appendix. The stated reference visuals for
those knobs are **Plates 6 and 7** — the luminance-inverted pinwheels and the
Belousov-Zhabotinsky-like color waves, [scanned here](papers/README.md#the-plates),
shot on Larry Cuba's loaned equipment.

The document closes with a line worth quoting at anyone who ships research code:

> Implementations should not be cited where the underlying papers exist.

## Where it goes past 1984

**Precision as a dynamical parameter.** `--precision 8 / 16 / 32` runs the entire loop in
RGBA8, half-float, or float. The argument in the docs: `L` is a per-iteration multiplier,
and at 16 bits, decay values above ~0.998 quantize into indistinguishability from 1.0 —
which **caps how long a cascade can be**. At 32 bits, 0.99999 stays distinct. The 8-bit
mode exists to show what an HDMI capture card does *to the dynamics* when it sits in the
feedback path rather than just the output. That is a genuinely new experiment: the paper's
Appendix budgets a color video system at roughly **20 bits per pixel including the noise
floor**, and this turns that budget into a slider.

Set that against the footnote everyone remembers — the 7-second limit cycle *"allowed to
oscillate for two hours"* one evening — and the pitch is: the analog rig's transient
lengths were partly a **bit-depth artifact**, and nobody could test that until now.

**Kaneko's lattice, made explicit.** `--fields 1..4` runs up to four coupled feedback
fields in a ring, each reading its neighbor's previous frame through `couple.glsl`, with
**mirrored symmetry breaking** — fields 0,2 take `+θ` and 1,3 take `−θ`; hue rate mirrors
the same way. Without the mirroring the ring synchronizes and coupling becomes a no-op.
Preset `05_kaneko_cml.ini` is the regime; `03_turing_blobs.ini` is the reaction-diffusion
one. This is [Crutchfield & Kaneko 1987](https://csc.ucdavis.edu/~chaos/) turned into a
command-line flag.

**Recording that doesn't cost the live experience.** Lossless half-float EXR sequences to
a bounded queue on a writer thread with its own GL context; encode to MP4 afterwards. The
stated design rule — *the instrument is not allowed to sacrifice what it's showing you in
order to preserve a record of it* — is the right rule for a show.

**A music engine coupled both ways.** Strudel mini-notation patterns read live feedback
scalars (`fb.zoom` flips chord direction, `fb.theta` sweeps filter cutoff), and every drum
hit drives a decaying envelope uniform that the noise layer's dropout mode turns into a
per-instrument glitch flavor. Kick punches wide black blocks, hats speckle green. The
feedback loop and the sequencer are inside each other's loops.

## Why this lives in this repo

**It's the answer to Don's open question, from a stranger.** In
[the January 2025 mail to Jim](sources/2025-01-25-psychedelic-graphics-hn.md), off the
back of the Psychedelic Graphics HN thread, Don asked whether a good **WebGL/WebGPU
browser simulator** existed for this kind of play. The honest status: this is *not* that —
it's native OpenGL, a download rather than a URL. (The `js/` directory is a misleading
tell: it holds one 406-line clean-room Strudel-compatible pattern engine running under
vendored QuickJS, for the music side. There is no web build.) But
it is everything else that was being asked for, and it arrived unprompted, from someone
outside the room, eighteen months later. The browser port is the remaining gap, and
[the Korz CA case study](../david-ungar/korz/case-cellular-automata.md) already sketches
the shape of it: camera → WebGPU compute pipeline → canvas → camera, 1984's knobs as
shader uniforms.

**It's the whole reading list, executable.** The credits trace to people who already have
rooms here: **[Turing](../alan-turing/README.md)** (the reaction-diffusion framing),
**[Ken Perlin](../ken-perlin/README.md)** (the thermal layer's value noise, gradient
displacement, curl rotation), **[Wolfram](../stephen-wolfram/README.md)** (computational
irreducibility as the reason the instrument is worth building), and the
**[Vasulkas](../steina-vasulka/README.md)** — whose archive is where the 1984 paper found
a home outside the physics literature, and where the project's own copy of the PDF came
from.

**Injection is an instrument, and they built the instrument.** The
[papers annex](papers/README.md#why-this-paper-and-film-live-in-this-repo) argues that
holding things in front of the camera is the real way to play a feedback loop. This has a
`Space`-held inject layer with ten patterns, animated bouncers, shape obstacles, and a
webcam layer — the analog move and the digital move on the same keyboard.

**It's a fully-crystallized `T` you can diff.** Every knob in the operator is a named
uniform in a file. For the CA playground plan with
**[Norman Margolus](../norman-margolus/README.md)**, that's a working reference for what
"modular, hackable, hot-reloadable" looks like — the thing the CAM6 TypeScript rewrite is
aiming at, already built for the feedback half of the family.

## The issue we sent them 📬

`CREDITS.md` closes by asking for corrections — *"accurate attribution is more important
than convenience"* — so we took them up on it. Five points, in descending order of
importance. Full text:
[`outreach/crutchfield-machine-issue-draft.md`](outreach/crutchfield-machine-issue-draft.md).

1. **Ralph Abraham is missing.** Neither `CREDITS.md` nor `research/README.md` mentions
   **Abraham, R. H. (1976), "Simulation of cascades by video feedback,"** Springer *Lecture
   Notes in Mathematics* **525**, pp. 10–14
   ([DOI 10.1007/BFb0077841](https://doi.org/10.1007/BFb0077841)) — the UCSC paper that
   published the camera-at-monitor loop as mathematics eight years before Crutchfield
   formalized it. Two pieces of evidence from inside the 1984 paper itself: Abraham is
   **reference `[1]`**, the first entry in the bibliography, and the Acknowledgements open
   with him — *"I am particularly indebted to Ralph Abraham for introducing me to video
   feedback a number of years ago."* Companion piece in the same volume: "Macroscopy of
   resonance," pp. 1–9 ([DOI 10.1007/BFb0077840](https://doi.org/10.1007/BFb0077840)). The
   lineage is written up in
   [`abraham-video-feedback-lineage.md`](abraham-video-feedback-lineage.md). Abraham died
   19 September 2024; [`../ralph-abraham/memorial.md`](../ralph-abraham/memorial.md).
2. **"Variations on a fight theme" is an OCR ghost.** `CREDITS.md` quotes §5 that way, and
   so does the scan in [our own papers directory](papers/README.md) — the Physica D
   scan-to-text mangles it. The
   [Vasulka *Eigenwelt* reprint](https://www.vasulka.org/Kitchen/PDF_Eigenwelt/pdf/191-207.pdf)
   reads **"Variations on a light theme."** The pun was the point.
3. **`research/PHILOSOPHY.md` contradicts their own ADR on default precision.** PHILOSOPHY
   says *"The default is RGBA16F (half-float)"*; `development/ADR/0001-rgba32f-default-precision.md`
   is **Accepted** and says default RGBA32F, with 16 as the performance option and 8 as the
   studies option. The README agrees with the ADR, so PHILOSOPHY is the stale document —
   and it inverts the project's own headline argument about decay resolution.
4. **The film citation has the wrong title on the right link.** `CREDITS.md` lists
   *"Dynamics in the space of images"* (1984, 16 min) at the YouTube URL that is actually
   ***Space-Time Dynamics in Video Feedback*** (1984, 16 min). Two different tapes: the
   paper's own reference list gives *Dynamics in the Space of Images* as **1983, 12
   minutes**, U-matic / VHS / Beta.
5. **The Winfree citation is garbled.** *"Singular filaments organize chemical waves in
   three dimensions: parts 1, 2, and 3. Physica D, 8, 9"* collapses a three-part series
   across two volumes into one entry with no page numbers. The paper's reference list has
   it exactly: **Physica 8D (1983) 35; 9D (1983) 65; and to be published.**

The issue also says what the credits get right, because they get a lot right. The Kaneko
1984 entry in `research/README.md` is honestly labeled ⚠️ **paywalled — could not
download** (Oxford Academic blocks it), which is the correct way to report a gap rather
than cite something you haven't read — and a small monument to how much of the foundational
chaos literature is still behind a Cloudflare challenge.

## Show beats

1. **Run it live next to the film.** Roll the 1984 film in one window and the rig in
   another; Jim points at a shot, Don sets the knobs to match. The plates are the target
   images and the uniforms are the controls.
2. **The bit-depth experiment.** Same seed, same `T`, `--precision 8` vs `16` vs `32`,
   side by side. How much of what analog video "was doing" was the signal chain's
   resolution? Ask the person who ran the two-hour limit cycle.
3. **Grade the credits on air.** Open `CREDITS.md` next to the paper and let Jim mark the
   mapping — every row is a claim about his own equations. Homefun for everyone watching.
4. **Four coupled fields.** `--fields 4` is a regime no physical rig reached. Jim and
   Kaneko wrote the phenomenology in 1987; nobody has watched this particular version of it.
5. **The browser gap.** The one thing still missing is the URL you can send to a class.
   Turn it into the jam: WebGPU port, Jim's structural-complexity readouts (excess entropy,
   ε-machines) as a HUD layer next to the existing ones.

## See also

- [`papers/README.md`](papers/README.md) — the 1984 paper, the film, the plates
- [`abraham-video-feedback-lineage.md`](abraham-video-feedback-lineage.md) — the 1976 → 1984 handoff the credits doc is missing
- [`sources/2025-01-25-psychedelic-graphics-hn.md`](sources/2025-01-25-psychedelic-graphics-hn.md) — the open question this partly answers
- [`outreach/`](outreach/README.md) — the issue draft sent upstream
- [Scott Draves](../scott-draves/README.md) — the loop as art · [Norman Margolus](../norman-margolus/README.md) — the loop as CA hardware
- Upstream: [repo](https://github.com/splashkes/crutchfield-machine) ·
  [`CREDITS.md`](https://github.com/splashkes/crutchfield-machine/blob/main/CREDITS.md) ·
  [`research/`](https://github.com/splashkes/crutchfield-machine/tree/main/research)
