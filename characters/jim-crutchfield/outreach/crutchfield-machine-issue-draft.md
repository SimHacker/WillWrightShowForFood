First: this is lovely work, and `CREDITS.md` is the best part of it.

Most reimplementations of a famous paper are homages. This one is a *mapping* — a table with one row per knob, `zoom (b) → uZoom`, `focus → blurX/Y/blurAngle`, `storage decay (L) → uDecay`, the Appendix's photoconductor response and saturation threshold broken out into their own toggleable layer. Somebody read Table I and the Appendix and took both literally. The line at the end —

> Implementations should not be cited where the underlying papers exist.

— is a better attribution policy than most published research code manages, and marking the Kaneko 1984 entry ⚠️ **"could not download"** instead of citing something you didn't read is the honest move.

Two things I think are genuinely new, not just faithful: **precision as a dynamical parameter** (the argument that `L` above ~0.998 quantizes into indistinguishability at 16 bits, so bit depth caps cascade length, is a real experiment the analog era couldn't run — and the Appendix budgets a color video system at ~20 bits/pixel including the noise floor, so you've turned that budget into a slider), and running `--precision 8` to show what an HDMI capture card does *to the dynamics* rather than just to the output.

Some context for where this is coming from: I'm Don Hopkins. A hand-copied videotape of Crutchfield's 1984 film reached me around 1990 — my office mate at Sun handed it to me, correctly guessing I'd love it — and it rewired how I thought about pointing a system at itself. My CAM6 cellular-automata performance platform — a JavaScript descendant of the CAM-6 hardware in Toffoli and Margolus's *Cellular Automata Machines* — grew in its afterglow. So this repo landed somewhere very specific for me. I've been keeping a research annex on the paper and film here: https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/jim-crutchfield

Which brings me to the one substantive thing I want to suggest.

---

## The missing credit: Ralph Abraham (1976)

Neither `CREDITS.md` nor `research/README.md` mentions **Ralph Abraham**, and he's the person who put the camera-at-monitor loop into the mathematical literature — eight years before the Physica D paper.

Two pieces of evidence from inside Crutchfield's own paper:

**1. Abraham is reference `[1]`.** Literally the first entry in the bibliography:

> `[1]` R. Abraham, "Simulation of Cascades by Video Feedback", Lect. Notes in Math. **525** (1976) 10.

**2. The Acknowledgements open with him:**

> "I am particularly indebted to **Ralph Abraham** for introducing me to video feedback a number of years ago."

Same campus (UC Santa Cruz), one generation apart — Abraham was faculty in mathematics, Crutchfield a grad student in the Dynamical Systems Collective. Abraham handed the field the demo as a *laboratory instrument for dynamics*: point a camera at its own monitor and the analog loop **simulates a cascade**, i.e. a discrete dynamical system you can watch bifurcate in real time. Crutchfield took that instrument and produced the formal spatiotemporal treatment — the models, the taxonomy, the video physics, the CA connection.

If the project's principle is "cite the ideas, not the implementation," then the idea's first published appearance belongs in the chain.

Ralph Abraham died 19 September 2024, aged 88, in Santa Cruz. It'd be a nice thing to get his name in there.

### Suggested citation

```
Abraham, R. H. (1976). "Simulation of cascades by video feedback."
In P. Hilton (ed.), Structural Stability, the Theory of Catastrophes,
and Applications in the Sciences: Proceedings of the Conference held at
Battelle Seattle Research Center 1975. Lecture Notes in Mathematics,
vol. 525, pp. 10-14. Springer-Verlag, Berlin/Heidelberg.
DOI: 10.1007/BFb0077841
```

Companion piece by Abraham in the same volume, worth a "see also" — it's the resonance/bifurcation framing the video paper sits inside:

```
Abraham, R. H. (1976). "Macroscopy of resonance."
Lecture Notes in Mathematics, vol. 525, pp. 1-9.
DOI: 10.1007/BFb0077840
```

Volume DOI: 10.1007/BFb0077839 · Softcover ISBN 978-3-540-07791-6 · eBook ISBN 978-3-540-38254-6

Also relevant for anyone following the thread further: Abraham & Shaw, *Dynamics: The Geometry of Behavior* (Aerial Press, 1982) — the visual-dynamics program the 1976 paper belongs to, and itself cited in Crutchfield's reference list.

### Suggested text for `CREDITS.md`

Something like this, as a subsection under "Primary scholarly basis" ahead of the Crutchfield entry:

> ### Abraham (1976): the camera-at-monitor loop enters the literature
>
> > Abraham, R. H. (1976). "Simulation of cascades by video feedback." In *Structural Stability, the Theory of Catastrophes, and Applications in the Sciences*, Lecture Notes in Mathematics 525, pp. 10–14. Springer. https://doi.org/10.1007/BFb0077841
>
> Crutchfield's reference `[1]`, and the first name in his acknowledgements: *"I am particularly indebted to Ralph Abraham for introducing me to video feedback a number of years ago."* Abraham, at UC Santa Cruz, published the camera-pointed-at-monitor rig as a way to **simulate a cascade** — a discrete dynamical system realized in analog hardware and observed directly. Nothing in this codebase implements Abraham specifically, because what he contributed is the framing every parameter here inherits: **the loop is a dynamical system and its knobs are its control parameters.** Crutchfield formalized it; Abraham pointed the camera first.

And for `research/README.md`, an entry ahead of #1 — the volume is in Springer's Book Archive, so it's paywalled per-chapter like the Kaneko one, and deserves the same honest ⚠️.

---

## Four smaller citation fixes

While I had the paper open next to `CREDITS.md`:

**1. "Variations on a fight theme" is an OCR ghost.** `CREDITS.md` describes §5 that way, and so does the OCR layer of the Physica D scan — but the printed section title is **"Variations on a light theme."** (Confirmed against the Vasulka *Eigenwelt der Apparate-Welt* reprint: https://www.vasulka.org/Kitchen/PDF_Eigenwelt/pdf/191-207.pdf) It's a pun, and "fight" loses it.

**2. The film citation has the wrong title on the right link.** `CREDITS.md` has:

> Crutchfield, J. P. (1984). "Dynamics in the space of images." 16-minute videotape, U-matic. Available: https://www.youtube.com/watch?v=B4Kn3djJMCE

Those are two different films. The one at that URL is **_Space-Time Dynamics in Video Feedback_** (Entropy Productions, Santa Cruz, 1984; 16 min; U-matic transferred to digital) — the paper's companion. *Dynamics in the Space of Images* is an earlier, separate tape, cited in the paper's own reference list as **1983, 12 minutes** (U-matic, VHS, and Beta). Suggest splitting them, and adding the third from the same shop, *Chaotic Attractors of Driven Oscillators* (1982): https://youtu.be/Sq8Vu40Bw1g

**3. The Winfree "singular filaments" entry is garbled.** `CREDITS.md` gives *"parts 1, 2, and 3. Physica D, 8, 9"* with no pages. The paper's reference list has it precisely:

```
Winfree, A. T. (1983). "Singular Filaments Organize Chemical Waves in
Three Dimensions: Parts 1, 2, and 3."
Physica 8D (1983) 35; 9D (1983) 65; and to be published.
```

The Scientific American one is right as given: *"Sudden Cardiac Death: A Problem in Topology,"* Sci. Amer. **248**(5) (1983) 144.

**4. `research/PHILOSOPHY.md` contradicts ADR-0001 on the default precision.** PHILOSOPHY says *"RGBA32F internal precision, optional. The default is RGBA16F (half-float)."* But `development/ADR/0001-rgba32f-default-precision.md` is **Accepted** and says the opposite — default `GL_RGBA32F`, with `--precision 16` as the performance option and `--precision 8` as the studies option — and `README.md` agrees with the ADR. So PHILOSOPHY is the stale one. Worth fixing because it's the document a new reader hits first for the *why*, and it inverts the project's own headline argument about decay resolution.

---

Happy to open a PR with all of the above if that's easier than doing it yourselves — say the word and I'll keep it to the citation text and leave the prose alone.

---

## Where this is leading, for me

One more reason I care about the browser question, since it's the only real gap left.

The other book that rewired me is **Toffoli and Margolus's *Cellular Automata Machines: A New Environment for Modeling*** (MIT Press, 1987) — the CAM-6 manual that taught a generation to treat a rule as an instrument you play rather than a program you run. **Norman Margolus has given me permission to turn its chapters into interactive instructional and artistic web apps.** That's the thing I'm building toward: rewrite my old monolithic CAM6 simulator as modular TypeScript, then make each chapter something you open in a tab and touch.

Jim Crutchfield and I have talked about that plan — including what a structural-complexity layer on top of Norman's rules would look like: excess entropy, ε-machines, 1D CAs with their 1+1D space-time diagrams. Which is the same conversation as this repo, not an adjacent one. §5 of the 1984 paper says so outright: rotation and magnification give you **nonlocal neighborhoods**, focus sets the **neighborhood radius**, and variation (6) — a computer in the loop via a frame buffer — generalizes the rig to arbitrary lookup-table rules and lattice dynamical systems. Video feedback and cellular automata are one family, and Crutchfield wrote the bridge himself.

So your layer architecture interests me well beyond the feedback loop: twelve independent files, an enable bitmask, hot reload from disk, each layer toggleable so you can *feel* what it contributes. That is exactly the shape the CA playgrounds want, and you've built it for the feedback half of the family with the citations attached. If a WebGPU build ever happens, the two halves are one workshop — and it's the version I can hand to a whole room at once instead of a whole room of installers.

Thanks for building this. Genuinely glad it exists.
