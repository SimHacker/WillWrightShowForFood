# WarpOMatic — real-time video background removal in the feedback loop 🎥✂️

*Don's own work — the videos are public and the code exists.*
[Portrayal standards](../../schemas/portrayal-standards.md)

**Real-time video background removal plus video feedback**, running live on a Mac. Pull the
person out of their room, then feed the result back into itself and warp it. Four videos,
all Don Hopkins, posted January 2016 and later:

| Video | Length | What |
|---|---|---|
| [WarpOMatic Demo 1](https://www.youtube.com/watch?v=qME6aniaPRg) | 5:22 | The one with the Rikki Sawyer psychedelic dub. *"you are a genius, man!"* — @tobymdev |
| [WarpOMatic Demo 2](https://www.youtube.com/watch?v=DJoPn1h_ibk) | — | Second pass |
| [WarpOMatic Demo 3](https://www.youtube.com/watch?v=f-EdTFmRZ34) | 4:10 | Set to Bootsy Collins, "Party Lick-A-Ble's" (Norman Cook version) |
| [WarpOMatic Explanation](https://www.youtube.com/watch?v=ikFF1frSFRg) | — | How it works, narrated |

Also collected in the Medium piece
[Empowered Pie Menu Performance at CHI'90, and Other Weird Stuff](https://donhopkins.medium.com/empowered-pie-menu-performance-at-chi90-and-other-weird-stuff-869ccb75ad).

## Why background removal is not a garnish

A raw camera-at-monitor loop feeds back **everything** — you, your room, the lamp, the
laundry. The attractor is beautiful but it is an attractor of your whole visual field, and
the human in front of it is just one more texture getting smeared.

Pull the background out and the loop changes character completely. Now the thing being
iterated is **you, isolated**, composited over whatever the feedback has already produced.
The person becomes an *injected signal* rather than part of the scene — which is exactly
the move the [papers annex](../jim-crutchfield/papers/README.md#why-this-paper-and-film-live-in-this-repo)
calls the real way to play a feedback loop: hold something in front of the camera and make
the system believe it was always there. Background removal is what turns "hold something up"
from a smear into a **cut-out with edges the loop can lock onto**.

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
immediately wonderful happens with your face. No reading, no parameters, no vocabulary. The
canonical test case: *someone picks up their cat and holds it in front of the laptop.*
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

## What's changed since 2016

WarpOMatic was a native Mac app. The reasons it stayed one have expired:

- **Segmentation got free and fast.** Browser-side person segmentation now runs at frame
  rate on ordinary hardware. In 2016 this was the hard part; it is now a library call.
- **WebGPU exists.** Compute shaders in a tab, which is what the CA half of the family wants
  (lookup tables, integer state, exact neighborhoods) and what fragment shaders make awkward.
- **`getUserMedia` is universal**, with a permission prompt everyone recognizes.

Which is the Will Wright rule from the Spore talk, which the whole show runs on: dust off
your old ideas every few years, because the world moves underneath them and the reasons you
shelved them expire. *Things have changed.*

## See also

- [`cam6-cellular-automata-machine.md`](cam6-cellular-automata-machine.md) — the CA half of the same workshop, and the [CAM6 Demo](https://www.youtube.com/watch?v=LyLMHxRNuck) made for Norman Margolus
- [`../jim-crutchfield/crutchfield-machine.md`](../jim-crutchfield/crutchfield-machine.md) — a desktop GPU rig that solves the feedback half, with the citations attached
- [`../jim-crutchfield/papers/README.md`](../jim-crutchfield/papers/README.md) — the 1984 paper and film; injection as an instrument
- [`../subutai-ahmad/README.md`](../subutai-ahmad/README.md) — the real-time motion tracking and segmentation lineage: Interval → Me2Cam → browser
