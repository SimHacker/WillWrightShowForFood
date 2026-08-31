# WarpOMatic — real-time video background removal in the feedback loop 🎥✂️

*Don's own work — the videos are public and the code exists.*
[Portrayal standards](../../schemas/portrayal-standards.md)

**Real-time video background removal plus video feedback**, running live on a Mac. Pull the
person out of their room, then feed the result back into itself and warp it. Three demos
(8 January 2016) and one narrated explanation (3 August 2019):

**Start here — [WarpOMatic Explanation](https://www.youtube.com/watch?v=ikFF1frSFRg)
(8:07)** — how it works, narrated, cleaned-up transcript below. Watch this first and the
demos become legible: you can see which artifact is the matte and which is the loop.

Then the demos, which are performances, not tutorials:

| Video | Length | What |
|---|---|---|
| [Demo 1](https://www.youtube.com/watch?v=qME6aniaPRg) | 5:22 | Rikki Sawyer, "Numb (On the Inside)" psychedelic dub. *"you are a genius, man!"* — @tobymdev |
| [Demo 2](https://www.youtube.com/watch?v=DJoPn1h_ibk) | 2:56 | Second pass, no soundtrack |
| [Demo 3](https://www.youtube.com/watch?v=f-EdTFmRZ34) | 4:10 | Bootsy Collins, "Party Lick-A-Ble's" (Norman Cook version) |

Also collected in the Medium piece
[Empowered Pie Menu Performance at CHI'90, and Other Weird Stuff](https://donhopkins.medium.com/empowered-pie-menu-performance-at-chi90-and-other-weird-stuff-869ccb75ad).

### Which order, for whom

Explanation-first for a technical audience. A programmer asked to watch three weird videos
cold has no model to hang them on, so they pattern-match to "screensaver" and stop. Give
them the mechanism and they spend the demos doing the thing you actually want — reverse-
engineering which parameter produced which artifact.

Demo-first for everyone else, and for a cold room. Curb appeal has to land before anyone
consents to an explanation.

The two orders are the same tension the whole project is about — see the three-depths
argument below. The difference is that the browser version doesn't have to choose: the
demo *is* the explanation when the viewer's own face is the input and the knobs are right
there.

## The explanation, transcribed 🎙️

*Lightly edited from the video's own transcript: filler words removed, sentences closed,
one off-topic aside elided. Timestamps are the video's. Everything below is Don talking
while the thing runs.*

> **0:03** — Whoops. Oh my goodness. Uh oh. Sorry about that. I didn't have time for a
> segue. Rude transition.
>
> **0:11** — Anyway, my name is Don Hopkins. I wrote that code, called WarpOMatic, with
> background removal. What it does is remove the blue sheet I have hung in the background,
> which you can't see, and then take that masked image and feed it back into a memory
> buffer using a transformation.
>
> **0:41** — And then this is this magical recursive rotation. You can do any transform on
> it, and you can smoothly interpolate between any transform. And the neat thing is, around
> the edges it is mirrored. See how I'm a little like a little frog in a pond. Greedy.
>
> **1:03** — So there are no seams, because of the mirroring. Oops — well, there's a little
> seam. That's a bug. But ostensibly there are no seams.
>
> **1:15** — The other thing you may notice is that the feedback parameters are changing in
> response to my motion. There's this recursive transformation, but it's modified by where
> I am in the picture. So I'm kind of like a **virtual joystick** — when I move up and down
> and left and right, and also when I increase the area of my image. When I increase the
> area, it zooms in more. So if I get right up close like this. Let's see. Hello. Now
> that's a big close zoom. Even more — that's just the area. Then when I go out, see how
> it's magnifying. Then as the area gets smaller, it falls in to just my hand.
>
> **2:18** — And when I hold still, it settles into its recursive pattern. But then when I
> move, all these copies are delayed over time a different amount.
>
> **2:41** — It's really like a paint program that has memory, that's recursive. There's
> some blending going on so that it blends in with the past value, and that's controllable
> — all the way on, or all the way off, or anywhere in between. And that controls how the
> fading accumulates.
>
> **3:02** — So you can just paint into this buffer using a flower as a paintbrush. And
> things that have lots of space around them are good, because then it leaves lots of room
> for the recursion.
>
> **3:18** — So the parameters of the recursion are changed by where the flowers are. When
> you smoothly move them around like this, it interpolates smoothly. Now watch me go. Okay,
> this will be one field. When this other guy comes on the edge, he'll pull it over to him.
>
> **3:48** — **No instructions required, really. You just start playing around with it, and
> you're the painting tool.**
>
> **3:58** — Hands are good, because you can make puppets, and if you get on the edge you
> can use another color for some contrast. But I like the CD, because it serves as a
> mirror. You can just paint with an image of the room.
>
> **4:25** — Anyway, this is just one setting, and all these other parameters can change
> over time. Let's see here. Whoa. Am I a talking head or what? Let's see. Whoa. Whoa. Here
> we go. Just kind of explore. And when you hold still, it's always kind of quivering —
> it's just like a big blob of mirror jello or something.
>
> **5:11** — **Think of it like a clay turning wheel for light. Basically, it slows down
> light enough that you can capture it and push it around with your hand.**
>
> **5:24** — Play with it. Here's my fern. That's a good eraser tool — I can just erase the
> background, the fern texture. Now, when there's nothing there, it starts relaxing. It's
> just kind of blurring and relaxing and neutralizing. But then you can see the vortex.
>
> **5:43** — Then if I bring something on, like Bootsy here, now you can see how the scale
> is affected by Bootsy's area. And the little lady here, for some contrast. See, when
> they're close up to the camera, it scales out a lot. So you get these big zooms, and then
> as you move out, it falls into itself in the spiraling fractal. But not necessarily — it
> could be much more warped than this. This is just one particularly pleasing thing.
> Configurations can be smoothly interpolated between, of course.
>
> **6:30** — And **cellular automata could be mixed in on top**, but I think that might be
> going a little too far, because probably just let people play with whatever they brought
> with them and use their imagination. Also, if you have some branding you want to do, it'd
> be great to take the toy of the week and just put on a puppet show. Kind of goes: *"Oh,
> we seem to be in a strange sea of holes."*
>
> **7:21** — Well, anyway, I've got to play with this some more and send this tape off. So
> I'll talk to you later. Look forward to seeing you later. Bye-bye. Goodbye.
>
> **7:33** — **Oh, here's my cat.** Whoa. Mug for the camera. Yeah. Whoa. All right, you
> can go. Bye-bye.

> *"Damn. I don't need to smoke up tonight after this. Thanks!"* — @occularmalice

## What the explanation already settles

Seven years before this file existed, the video answered most of the design questions.

**The person is the control parameter, not just the content.** This is the part that isn't
in anyone else's video feedback rig, and it's the reason to keep saying "WarpOMatic" instead
of "a feedback demo." Don's **position in frame steers the transform, and the *area* of his
silhouette drives the zoom** — get close, it zooms hard; back off, it falls into a spiral;
shrink to just a hand, the whole regime follows the hand. The human is not perturbing the
system from outside. **The human is inside the loop, and the matte is what makes them
legible to it** — you can only measure a centroid and an area if you already know which
pixels are the person. Background removal is not there to look clean. It is the sensor.

**Mirrored edges instead of clamped ones.** The buffer reflects at the boundary, so the
recursion has no seam to reveal itself at. *"See how I'm a little like a little frog in a
pond."* Cheap trick, enormous difference — a visible frame edge tells your eye "this is a
video effect" and kills the illusion that the space is real.

**Decay was always there, and he described it exactly.** *"A paint program that has memory,
that's recursive... it blends in with the past value, and that's controllable... that
controls how the fading accumulates."* That is Crutchfield's storage decay `L`, arrived at
from the paint-program side rather than the physics side, and named after what it feels
like rather than what it is.

**Multiple fields, in 2019.** *"This will be one field. When this other guy comes on the
edge, he'll pull it over to him."* Two objects, two regimes, coupling at the boundary —
Kaneko's coupled map lattice discovered by holding up two flowers.

**He already saw the CA merge and deliberately deferred it.** *"Cellular automata could be
mixed in on top, but I think that might be going a little too far."* The instinct was right
for a 2019 tape and is wrong for a 2026 browser page, where "too far" is one layer toggle
that most visitors never touch and the rest of them find.

**The curb-appeal thesis, verbatim.** *"No instructions required, really. You just start
playing around with it, and you're the painting tool."*

**And the cat is already in it.** At **7:33** the tape is over, he's said goodbye — and then
he picks up the cat and holds it to the camera. Cat-in-the-loop is not a hypothetical
acceptance test invented for this document. It is what the person who built the thing did,
unprompted, in the last twenty seconds of his own explanation, because that is what everyone
does. Build the front door for that.

## Why background removal is not a garnish

A raw camera-at-monitor loop feeds back **everything** — you, your room, the lamp, the
laundry. The attractor is beautiful, but it is an attractor of your whole visual field, and
the human in front of it is just one more texture getting smeared.

Pull the background out and the loop changes character completely. Now the thing being
iterated is **you, isolated**, composited over whatever the feedback has already produced.
The person becomes an *injected signal* rather than part of the scene — which is exactly
the move the [papers annex](../jim-crutchfield/papers/README.md#why-this-paper-and-film-live-in-this-repo)
calls the real way to play a feedback loop: hold something in front of the camera and make
the system believe it was always there. Background removal is what turns "hold something up"
from a smear into a **cut-out with edges the loop can lock onto** — and, per the transcript
above, into a **measurable object whose position and area can drive the parameters**.

It is also, bluntly, what makes it *readable*. A stranger looking at raw feedback sees
pretty noise. A stranger looking at themselves cut out and multiplied into a mandala sees
**themselves**, instantly, and understands the whole idea in under a second.

## The actual goal: anyone, anywhere, no install

The target is not a VJ tool and not a physics apparatus, though it should satisfy both. It's
a **browser page with webcam access** that gives you something delightful in the first
second and rewards you for weeks.

Three requirements, and they are not in tension — they're the same requirement at three
depths:

**Instant curb appeal.** You open the URL, you grant camera access, and something
immediately wonderful happens with your face. No reading, no parameters, no vocabulary —
*"no instructions required, really."* The canonical test case is the one the 2019 tape
performs at 7:33: *someone picks up their cat and holds it in front of the laptop.*
**Cat-in-the-loop.** If a person's first instinct is to grab their pet and see what the
system does with it, the front door is built correctly. That instinct is not a distraction
from the science — it *is* the experimental method. Crutchfield perturbed his rig by hand
too.

**It teaches.** Every knob is a real parameter of a real dynamical system, and the interface
says so. Zoom and rotation are the neighborhood. Focus is the diffusion rate. Decay is how
long the past survives. You can put the citation on the slider — see
[`crutchfield-machine.md`](../jim-crutchfield/crutchfield-machine.md), whose `CREDITS.md`
does exactly this for a desktop app.

**It opens up.** Past the front door there is the whole space: layer stacks, coupled fields,
CA rules alongside continuous warps, save and share a regime as a URL. The same page a kid
uses to make their cat into a kaleidoscope is the page a grad student uses to run the
bit-depth experiment.

The VJ interface is how you get all three at once. A VJ interface is *already* the solution
to "expose a large parameter space to a human in real time, under performance pressure,
without a manual" — which is the same problem as teaching. That's why the
[crutchfield-machine](../jim-crutchfield/crutchfield-machine.md) control surface is worth
studying: `ui.yaml` with sections, pins, and a live layer visualizer; every action named and
rebindable from key, MIDI, or gamepad; usage telemetry to find the controls nobody touches.

## What's changed since 2019

WarpOMatic was a native Mac app **that required a blue sheet hung behind you**. That sheet
is the whole distance between this and "anyone, anywhere":

- **The sheet is gone.** Browser-side person segmentation now runs at frame rate on ordinary
  hardware, no chroma key, no studio, no lighting setup. In 2019 the matte was the hard
  part and it cost you a bedsheet; it is now a library call against whatever wall you happen
  to be sitting in front of. This single change is what converts a demo you *send someone a
  tape of* into a URL they open.
- **WebGPU exists.** Compute shaders in a tab, which is what the CA half of the family wants
  (lookup tables, integer state, exact neighborhoods) and what fragment shaders make awkward
  — so the merge Don deferred at 6:30 is now cheap.
- **`getUserMedia` is universal**, with a permission prompt everyone recognizes.

Which is the Will Wright rule from the Spore talk, which the whole show runs on: dust off
your old ideas every few years, because the world moves underneath them and the reasons you
shelved them expire. *Things have changed.*

## See also

- [`cam6-cellular-automata-machine.md`](cam6-cellular-automata-machine.md) — the CA half of the same workshop, and the [CAM6 Demo](https://www.youtube.com/watch?v=LyLMHxRNuck) made for Norman Margolus
- [`../jim-crutchfield/crutchfield-machine.md`](../jim-crutchfield/crutchfield-machine.md) — a desktop GPU rig that solves the feedback half, with the citations attached
- [`../jim-crutchfield/papers/README.md`](../jim-crutchfield/papers/README.md) — the 1984 paper and film; injection as an instrument
- [`../subutai-ahmad/README.md`](../subutai-ahmad/README.md) — the real-time motion tracking and segmentation lineage: Interval → Me2Cam → browser
