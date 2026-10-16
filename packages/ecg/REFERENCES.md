# ECG — references 🔺

Every citation here was checked (Google Patents, Crossref DOIs, live links) on 16 October 2026.
Where a link is dead, it says so; please add a working one if you find it.

## The source

- **J. Thomas Ngo, Bruce Randall Donald.** *System for image manipulation and animation using
  embedded constraint graphics.* US Patent 5,933,150. Interval Research Corp. Filed
  1996-08-06, granted 1999-08-03, expired 2016-08-06.
  [Google Patents](https://patents.google.com/patent/US5933150) · close reading in
  [PATENT-NOTES.md](PATENT-NOTES.md)
- **Ngo, Cutrell, Dana, Donald, Loeb, Zhu.** *Accessible animation and customizable graphics
  via simplicial configuration modeling.* SIGGRAPH 2000.
  [doi:10.1145/344779.344964](https://doi.org/10.1145/344779.344964). The published paper on
  the same ideas; read it alongside the patent. (Surnames from Crossref; add first names from
  the paper.)

## Interval context

- **Golan Levin**, *Mouther* — speech-driven cartoon faces drawn in Tom's ECG editor, with
  Malcolm Slaney on speech. [flong.com](https://www.flong.com/archive/projects/mouther/)
- **Don Hopkins**, ECG and G9.js comment, Hacker News, September 2016.
  [item 12572696](https://news.ycombinator.com/item?id=12572696) · write-up in
  [ECG at Interval](../../characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md)
- **moultano**, *The Hunt for Dark Breakfast* — the egg/milk/flour simplex.
  [blog](https://moultano.wordpress.com/) · Don's ECG reply in
  [Breakfast simplex](../../characters/don-hopkins/breakfast-simplex-barycentric-direct-manipulation.md)

## Differential manipulation (the prior art ECG improves on)

- **Michael Gleicher.** *A Differential Approach to Graphical Interaction.* PhD thesis,
  CMU-CS-94-217, Carnegie Mellon, 1994. Cited by the patent. *The old CMU reports-archive URL
  is dead; find a current copy.*
- **Michael Gleicher, Andrew Witkin.** *Through-the-lens camera control.* SIGGRAPH 1992.
  [doi:10.1145/133994.134088](https://doi.org/10.1145/133994.134088). The same Jacobian idea
  applied to dragging a camera by what you see through it.
- **Andrew Witkin, Michael Gleicher, William Welch.** *Interactive dynamics.* I3D 1990.
  [doi:10.1145/91385.91400](https://doi.org/10.1145/91385.91400)
- **Michael Gleicher, Andrew Witkin.** *Snap Together Mathematics.* Advances in
  Object-Oriented Graphics I, 1991.
  [doi:10.1007/978-3-642-76303-8_2](https://doi.org/10.1007/978-3-642-76303-8_2)

## Solving the drag (pseudo-inverse, damping)

- **Samuel R. Buss.** *Introduction to Inverse Kinematics with Jacobian Transpose, Pseudoinverse
  and Damped Least Squares methods.* Tutorial notes.
  [PDF](https://mathweb.ucsd.edu/~sbuss/ResearchWeb/ikmethods/iksurvey.pdf). The friendliest
  derivation; Lesson 4 follows it.
- **Samuel R. Buss, Jin-Su Kim.** *Selectively Damped Least Squares for Inverse Kinematics.*
  Journal of Graphics Tools, 2005.
  [doi:10.1080/2151237x.2005.10129202](https://doi.org/10.1080/2151237x.2005.10129202)
- **Charles W. Wampler.** *Manipulator Inverse Kinematic Solutions Based on Vector Formulations
  and Damped Least-Squares Methods.* IEEE Trans. SMC, 1986.
  [doi:10.1109/tsmc.1986.289285](https://doi.org/10.1109/tsmc.1986.289285)
- **Yoshihiko Nakamura, Hideo Hanafusa.** *Inverse Kinematic Solutions With Singularity
  Robustness for Robot Manipulator Control.* J. Dyn. Sys., Meas., Control, 1986.
  [doi:10.1115/1.3143764](https://doi.org/10.1115/1.3143764)
- Background: [Moore–Penrose inverse](https://en.wikipedia.org/wiki/Moore%E2%80%93Penrose_inverse)
  · [Inverse kinematics](https://en.wikipedia.org/wiki/Inverse_kinematics)

## Example-based blending (the same family, later)

- **J.P. Lewis, Matt Cordner, Nickson Fong.** *Pose Space Deformation.* SIGGRAPH 2000.
  [doi:10.1145/344779.344862](https://doi.org/10.1145/344779.344862). Same conference as Ngo
  et al.
- **J.P. Lewis, Ken Anjyo.** *Direct Manipulation Blendshapes.* IEEE CG&A, 2010.
  [doi:10.1109/mcg.2010.41](https://doi.org/10.1109/mcg.2010.41). ECG's idea applied to
  facial blend shapes — the Faceball and morph-target thread.
- **Ken Anjyo, Hideki Todo, J.P. Lewis.** *A Practical Approach to Direct Manipulation
  Blendshapes.* Journal of Graphics Tools, 2012.
  [doi:10.1080/2165347x.2012.689747](https://doi.org/10.1080/2165347x.2012.689747)
- **Charles Rose, Michael Cohen, Bobby Bodenheimer.** *Verbs and Adverbs: Multidimensional
  Motion Interpolation.* IEEE CG&A, 1998.
  [doi:10.1109/38.708559](https://doi.org/10.1109/38.708559)
- **Peter-Pike Sloan, Charles Rose, Michael Cohen.** *Shape by Example.* I3D 2001.
  [doi:10.1145/364338.364382](https://doi.org/10.1145/364338.364382)
- Background: [Morph target animation](https://en.wikipedia.org/wiki/Morph_target_animation)

## Coordinates and weights (for later lessons)

- [Barycentric coordinates](https://en.wikipedia.org/wiki/Barycentric_coordinate_system) ·
  [Simplicial complex](https://en.wikipedia.org/wiki/Simplicial_complex)
- **Michael S. Floater.** *Mean value coordinates.* CAGD, 2003.
  [doi:10.1016/s0167-8396(03)00002-5](https://doi.org/10.1016/s0167-8396(03)00002-5).
  Barycentric-like weights for polygons with more than three corners.
- **Alec Jacobson, Ilya Baran, Jovan Popović, Olga Sorkine.** *Bounded Biharmonic Weights for
  Real-Time Deformation.* SIGGRAPH 2011.
  [doi:10.1145/1964921.1964973](https://doi.org/10.1145/1964921.1964973)
- **Björn Ottosson.** *A perceptual color space for image processing* (OKLab).
  [blog](https://bottosson.github.io/posts/oklab/). For blending colours.

## Ancestors and cousins

- **Ivan Sutherland.** *Sketchpad: A man-machine graphical communication system.* 1963.
  Reprint: [doi:10.1145/62882.62943](https://doi.org/10.1145/62882.62943). Constraints and
  direct manipulation, the root of the tree.
- **James Gosling.** *The Algebraic Manipulation of Constraints.* CMU PhD thesis, report
  CMU-CS-83-13 (as cited in Don's 2016 comment). *Not re-verified: the CMU scan link in
  [ECG at Interval](../../characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md)
  now returns 404. Find a current copy and confirm the title and report number.*
- **G9.js** (2016) — gradient descent on drag constraints for differentiable graphics.
  [GitHub](https://github.com/bijection/g9)
- **Bret Victor.** *Explorable Explanations.*
  [worrydream.com](https://worrydream.com/ExplorableExplanations/). The courseware model this
  package aims at.
