# Ideas to explore with Jim Crutchfield 🦋♾️

*Interview hooks. The letter — `[positive-feedback.md](positive-feedback.md)` — carries the
tribute and the single ask; this file carries the questions. Citations:
`[positive-feedback.yml](positive-feedback.yml)`.*
[Portrayal standards](../../schemas/portrayal-standards.md)

## What Jim has done

James P. Crutchfield — physicist, UC Davis, director of the Complexity Sciences Center.
Santa Cruz "Dynamical Systems Collective" with Doyne Farmer, Norman Packard, and Rob Shaw.
**"Space-Time Dynamics in Video Feedback"** (*Physica D* **10** (1984) 229) — the paper this
whole thread hangs on. Coined **causal states**, the **ε-machine**, **statistical
complexity**, **computational mechanics**, and **intrinsic computation**.

## 1. Point your own tools at your own apparatus

**The best question we have.** He wrote the video feedback paper in 1984. He invented
computational mechanics *afterward* — causal states and ε-machines arrive in 1989, the full
machinery through the 1990s. So the tools that could say what the video loop is actually
computing did not exist when he built the video loop.

*What happens if we point them at it now?* Reconstruct an ε-machine from the output of a
live feedback loop, on air, while somebody turns the zoom ring. Nobody has done this, it's
buildable in a browser, and he's the only person who could say whether the answer means
anything. Forty-two years is a long time to leave an experiment running.

## 2. What does a system compute when nobody designed it to?

**Intrinsic computation** is his central idea and the least understood one outside his field:
not *what can we program this to do*, but *what information is this thing already storing,
transmitting, and transforming on its own?* A feedback loop isn't a computer we're using. It's
a process with memory that we're watching.

Good territory: how much of the answer is in the system versus in the observer's choice of
measurement; whether "computation" is the right word for what a dripping faucet does; what he
means by a process having a *machine* at all.

**Don asked this question first, badly, in 1989.** First time playing SimCity — at UMD, under
Shneiderman and Weiser, the same year he took PSIBER to Monterey — up all night stoned,
watching a city do things nobody told it to do, and asking *what is this thing computing on
its own?* No vocabulary for it. Jim spent a career building the vocabulary.
([The lineage entry](../don-hopkins/career/simcity-lineage.yml) — it's the first node of a
thirty-seven-year arc that ends at [the CAM Construction
Set](../don-hopkins/cam-construction-set.md).)

So the question to put to him: **was that a real question before it was measurable?** A player
at 3 a.m. and a physicist with an ε-machine reconstructor are pointing at the same thing; one
of them can prove it. Does the intuition count for anything on its own, or is "this system is
computing something" just a feeling until you can put a number on the memory?

It also cuts both ways on the instrument thesis, which is why it's worth the airtime. SimCity
had **no meters on the front panel** and the question surfaced anyway — evidence that people
reach for it unprompted. And it stayed unanswered for thirty-seven years, which is what a
missing instrument costs.

*(⚠️ Don's recollection, offered in conversation.)*

## 3. What goes on the front panel?

The design question, and the one we'd actually build from his answer.

The relevant science is sharp and worth getting on tape properly. A **single scalar over rule
space** — λ, the fraction of rule-table entries mapping to a non-quiescent state — turned out
not to explain which systems compute. Mitchell, Hraber & Crutchfield (*Complex Systems* **7**
(1993) 89, **Melanie Mitchell first author**) evolved cellular automata to do density
classification and found the good ones didn't cluster where the λ story predicted. The
constructive half is the memorable part: using computational mechanics they showed the evolved
CA compute by forming **regular domains** whose boundaries act as **particles**, with the work
happening in **particle collisions** — a mechanism you can point at in a space-time diagram,
offered in place of a number.
*(⚠️ Land & Belew later proved no perfect two-state density classifier exists — Phys. Rev.
Lett. **74** (1995) 5148. Verify before citing.)*

Which is precisely why the instrument wants **two meters and not one knob position**. "Random
is not the same as complex" is the claim that one number can't do it. Entropy rate h_\mu
and statistical complexity C_\mu are two numbers, measured over *behavior* rather than
over rule space, and their independence **is** the distinction. So:

- If a scalar over rule space is the wrong object, what's the right thing to show a stranger
in ten seconds? Two meters is our guess; he may have a better one.
- **What do we label them?** h_\mu and C_\mu, or "randomness" and "structure," or both
with the symbols small? Plain words are learnable instantly and slightly wrong; the symbols
are exact and repel the people who most need the distinction.
- The C_\mu curve — low for perfect order, low for perfect randomness, humped in between
— is the whole thesis as a *shape*. Is putting that shape on screen, live, honest, or does
it oversell a quantity that's delicate to estimate?

*(The knob half of "two meters and a knob" has a design already: [Turn
Tables](../don-hopkins/turn-tables.md) — one angular control that reads as a pie menu when it's
quantized and as a continuous parameter dial when it isn't, and that keeps moving when your hand
comes off it. The meters are the half we need him for.)*

## 4. Is "edge of chaos" good pedagogy even where it failed as measurement?

The proposed teaching move is **use it, then break it**: let a stranger's hand
find the interesting region with a knob, let them feel it's a real place, then show them why
the knob's position doesn't explain what they found. Honest teaching, or a slogan getting a
second life it hasn't earned?

*(The term is **Norman Packard's**, from Adaptation Toward the Edge of Chaos (1988), and
**Chris Langton** popularized it with λ — Physica D **42** (1990) 12. Crutchfield & Young's
"Computation at the Onset of Chaos" (1990) is the rigorous treatment of the underlying
intuition.)*

## 5. The 1984 room

His video feedback rig was at the Los Alamos workshop where **Toffoli presented CAM**, and his
Acknowledgements thank the participants who played with the demonstration.

- Who played with it? Does he remember what they did?
- **Variation (6)** — his §5 describes the lookup-table contract that CAM-6 implemented twelve
pages away in the same volume. Did he know at the time? Did anyone say it out loud?
- The volume also carries Wolfram, Kauffman, and Hillis. What did that room feel like?

### …and the 1987 room, three years downstream

Worth putting next to it, because it's the same hardware after it left physics. By **August
1987** a CAM-6 could be bought by a math department: **[Rudy Rucker](../rudy-rucker/README.md)**
got San José State to order one from Systems Concepts for about $1500, and it arrived as a bare
board in a bag of styrofoam peanuts — no cable, no software, no documentation. Toffoli mailed him
the Forth. That October Rucker took it to **Hackers 3.0**, the annual Hackers conference at a camp
near Saratoga, with the board in his AT, and demoed all night. The hackers made him pull it out of
the machine to look at it, and told him what it actually was: **a few latches and a lot of fast
RAM** — the [whole partial-evaluation
argument](../don-hopkins/cam-construction-set.md#the-move-has-a-name-partial-evaluation-and-one-more-thing)
delivered as a shrug. He went home from that conference hired by **John Walker** to write
**CA Lab**, which is how the CAM-6 rule catalog reached people who would never see a physics
volume.

**Don was in that room too** — he met Rucker at Hackers and they traded demos, which seeded a long
CA correspondence and a good deal of what's in this repo. *(⚠️ Don doesn't remember which year;
Rucker's own account puts his CAM-6 night at Hackers 3.0, 1987. Confirm before it goes on air.
Rucker's telling: [CelLab manual, ch. 5](https://www.fourmilab.ch/cellab/manual/chap5.html).)*

So the question for Jim, who was in the *first* room: what did he expect would happen to CAM when
it left the workshop? Three years later it's a $1500 card in a hobbyist's PC at a camp in the
mountains, and the people looking at it care about the latches, not the physics. Does an
instrument have to escape its field to teach anything, and does it survive the trip?

## 6. Naming things

Craft questions, useful to anyone naming anything — which is most of this repo's audience.

- **What makes a term keep its definition?** He has coinages that held — causal state,
ε-machine, statistical complexity, computational mechanics, intrinsic computation — in a
field where neighboring terms became vibes. Is it the math being unavoidable, the name being
unglamorous, the community being small, or luck?
- **What do you do when one quantity gets discovered five times?** **Excess entropy** is also
**effective measure complexity** (Grassberger, 1986), also **predictive information**
(Bialek, Nemenman & Tishby, 2001), also stored information. He co-wrote the archaeology —
"Regularities Unseen, Randomness Observed," *Chaos* **13** (2003) 25. Does synonymy ever get
resolved? Is rediscovery a failure of the literature or evidence the quantity is real?
*(⚠️ sidecar flags this cluster as unverified-detail.)*

## 7. Geometry from a time series

Packard, Crutchfield, Farmer & Shaw, *Phys. Rev. Lett.* **45** (1980) 712 — reconstruct the
state space of a system from a **single measured observable**, by embedding its own delayed
values. One wiggling number in, the shape of the underlying dynamics out.

Forty-six years later the observable we have is a webcam pointed at its own output. What does
he think delay embedding does to a spatially extended system, where every pixel is a
coordinate and the interesting structure is *between* them rather than in any one of them? He
has watched this technique get used and misused for four decades.

## 8. Thermodynamics of computation

His recent line of work — information engines, Maxwellian ratchets, what it actually costs to
compute. ⚠️ *(Confirm the current framing before the interview; this is the area, not a
specific citation.)*

Two live hooks into what we're building. The
[CAM Construction Set](../don-hopkins/cam-construction-set.md) Ising station uses a **Creutz
demon** — a few bits per cell carrying an energy currency, so the model is closed and
temperature becomes a measured output rather than a set input. That's a demon on screen, in a
grid, and he works on demons. And the reversible CA next door raise the same question from the
other side: **what does erasing a bit cost, and what does refusing to erase buy you?**

## Adjacent hooks

- **Rob Shaw's dripping faucet** and the Santa Cruz habit of building the apparatus first —
the direct ancestor of the argument that an instrument can teach a distinction.
- **[Ralph Abraham's 1976 video feedback paper](abraham-video-feedback-lineage.md)** — the
citation thread already in flight.
- **Larry Cuba's borrowed equipment**, behind Plates 6 and 7.

