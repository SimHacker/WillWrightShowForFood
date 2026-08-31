---
status: draft
character_id: norman-margolus
public: true
audience: "Norman Margolus (as the intended audience) — and anyone who wants to learn"
about: "Cleaned-up transcript of Don's 34-minute CAM6 Demo, with a glossary defining every term as it appears"
see_also:
  - the-cam6-demo-for-norman.md
  - ../don-hopkins/cam6-cellular-automata-machine.md
  - ../don-hopkins/warpomatic-video-background-removal.md
---

# The CAM6 Demo, transcribed — 34 minutes of playing your machine 🔲🌀

*Companion to [the letter](the-cam6-demo-for-norman.md). Lightly edited from the video's own
transcript: filler removed, sentences closed, speech-recognition errors corrected (it heard
"Tomaso toefully" for Tommaso Toffoli, "fourth" for Forth, "zabatinsky" for Zhabotinsky, and
"frog" for **frob**). Timestamps are the video's. Section headings are added for navigation
— Don didn't announce them.*
[Portrayal standards](../../schemas/portrayal-standards.md)

> **[CAM6 Demo](https://www.youtube.com/watch?v=LyLMHxRNuck)** — Don Hopkins, 34:20,
> uploaded 2 October 2022. Live app: [donhopkins.com/home/CAM6](https://donhopkins.com/home/CAM6) ·
> source: [CAM6.js](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js)

**Norman — this is the tape, written down.** You'll skip the parts you wrote. Everyone else
needs the vocabulary, so I've defined it as it comes up; the full
[glossary is at the bottom](#the-glossary-camsplaining-on-purpose). Where I say "your book"
I mean *Cellular Automata Machines: A New Environment for Modeling* (Toffoli & Margolus, MIT
Press, 1987).

## The book and the hardware (0:00)

> **0:00** — I'm introducing to you a cellular automata machine simulator that's based on
> this great book by Tommaso Toffoli and Norman Margolus, from MIT Press: *Cellular Automata
> Machines*. They made **hardware for the IBM PC** that executed a wide range of cellular
> automata at **60 frames a second**, and they were able to perform all these incredible
> experiments and documented them in the book. It uses **Forth** as a programming language
> for defining the rules.
>
> **0:32** — This is a really amazing book. I ran across the actual hardware, got the book,
> and kind of reverse-engineered it. They have Forth code in this book to define different
> rules, and I was using a Forth system and made a compatible programming language for that.

## Reading a rule as a picture (0:41)

> **0:41** — So here's a Forth program, `DIAMONDS`. You can see visually: north, west,
> center, east, south. There's almost **a visual programming language** here. Or plane zero
> — that's the whole definition of the rule. And the rule runs over all possible
> combinations of inputs and **makes a lookup table**, and the hardware loads the lookup
> table.
>
> **1:11** — This is the Forth software they used to program the IBM PC. Isn't it
> beautiful? I just love their **right-handed indentation style**. Nobody does this but
> these guys. It ends all arguments about indenting.

> **Camsplaining, for the room:** a **cellular automaton** is a grid of cells, each holding
> a small number, all updated at once by the same rule, where each cell can only see its
> immediate **neighborhood**. The trick that makes CAM-6 fast is that the rule is never
> evaluated in the inner loop. Instead you run it once over *every possible neighborhood*
> and store all the answers in a **lookup table**. Then running the universe is just: glue
> the neighbors' bits together into a number, use it as an index, read the answer. The
> hardware did that at video rate with off-the-shelf chips.

## Forth on the Sun, C underneath (1:34)

> **1:34** — Forth is really great at controlling hardware, and you can have assembly
> language. I had this nice Forth system on the Sun that can link in C libraries and call
> them directly, so I **wrote an emulator for the hardware in C**, linked it into Forth, and
> made Forth maps for all the data structures, and a wrapper around it. So I had this Forth
> that was running a simulator instead of hardware, and then I could define the same rules.

## Neighborhoods and address lines (2:13)

> **2:13** — This is the actual **rule compiler**. The hardware has these **address lines**,
> and the rules map neighborhoods onto different sets of address lines. The **Moore**
> neighborhood has all eight neighbors plus center. **Von Neumann** only has four. The
> **Margolus neighborhood** is very interesting — it's a rotationally symmetrical
> neighborhood that you define in terms of *me*, *my opposite*, *clockwise*, and
> *counterclockwise*. This is great for doing **billiard-ball simulations**. And then
> there's Margolus with the additional **phase of time** — even or odd step, or horizontal
> and vertical phase — which are different ways you can multiplex things.
>
> **3:09** — And then they have all these macros, like "what are my two bits of west."

> **Camsplaining:** the **Moore** neighborhood is the eight cells surrounding you plus
> yourself; **von Neumann** is just the four edge-adjacent ones. Norman's own
> **Margolus neighborhood** is the odd one out and the reason the physics works: instead of
> each cell looking at its neighbors, the grid is chopped into 2×2 **blocks** which are
> updated as units, and the block boundaries **shift by one cell on alternate time steps**.
> Because you rewrite a whole block at once, you can make the rule **reversible** and make
> it **conserve** things like particle count and momentum — which is what lets a CA behave
> like actual physics instead of merely looking like it.

## The rule zoo, and the rewrite (3:25)

> **3:25** — These are the rules. **Billiard ball** is a Margolus neighborhood — we figure
> out whether we should turn or not, and this makes little balls bouncing off each other.
> **Critters**, **Wavers**, **Tron**. And regular things like **Brain** and **Life**.
>
> **3:42** — I had rewritten it, eventually — C, then C++, then JavaScript. It's a huge file
> and a little out of control, and the user interface is arcane. But here's the theory of
> it, and where it's headed.

## Heat diffusion, histograms, color maps (3:58)

> **3:58** — Here it is running. What you see here, these are the cells, and we can paint
> in them if we like. This is running — not technically a cellular automaton, it's more of a
> **heat diffusion**, and it's **eight bits per cell**, so it's discrete. This is a
> **histogram** of how many cells are of each value, and a **color map**. This particular
> color map has some nice saturated colors at each end and then it fades, and it has nice
> high contrast — you'll see why that's important later.
>
> **4:39** — This rule is called **wavy**. Here's the user interface. I'm running a rule
> called **twistier marble**.

> **Camsplaining:** the **histogram** is a live bar chart of how many cells currently hold
> each of the 256 possible values — it's an instrument panel for the state of the whole
> universe at a glance, and Don steers by it throughout. The **color map** is the lookup
> from cell value to screen color; changing it changes nothing about the simulation and
> everything about what you can *see* in it. Later he cuts a deliberate notch into the color
> map so one narrow band of values flashes bright — an **X-ray slice** through the data.

## Anneal, Brian's Brain, and three automata sharing one space (4:48)

> **4:48** — There's lots of rules. Life — everybody's heard of Life, but **Life is so
> overrated**. Brian Silverman's **Brian's Brain** is much more exciting — it's all these
> gliders. **Rudy Rucker** came up with the nifty idea of combining Brian's Brain together
> with Life, and one called **anneal**.
>
> **5:20** — Anneal is this big cow-spotty thing. Basically it takes random stuff, counts
> how many neighbors are on, and **votes with the majority — unless it's almost a tie, in
> which case it votes against the majority**. That smooths down all the edges, keeps white
> things white and black things black.
>
> **5:41** — But then on the black places we run Brian's Brain, and on the white places we
> run Life. So it's **three different cellular automata sharing the same space** — one
> deciding which space the other two share. And the cool thing: this is not Life, this is
> **anti-Life**, or death, because it's the ones-complement of Life. So empty space of Brain
> looks like stimulus to Life, and empty space of Life looks like stimulus to Brain. **The
> shores are stimulating to each rule**, so that's breeding more gliders.

> **Camsplaining:** **anneal** is named after metallurgy — heat a metal and let it cool
> slowly and the crystal grains grow smooth. The near-tie inversion is the whole trick: pure
> majority voting freezes instantly, but flipping against the majority *only* when the vote
> is close keeps the boundaries alive and lets domains slowly eat each other. **Brian's
> Brain** (Brian Silverman) is a three-state rule — ready, firing, refractory — which makes
> everything move, because a firing cell must rest before it can fire again. And
> **ones-complement** means flipping every bit, so "alive" and "dead" trade places; the
> point of running Life against anti-Life is that each one's *boredom* is the other one's
> *food*, right along the shoreline where they meet.

## Layering: echo and heat pollution (6:32)

> **6:32** — This is a neat one, because it's composing several rules together and
> **layering**, and we can do a lot of interesting stuff with layering. And then the heat
> diffusions come in for that. If we did **Echo** — Echo simply echoes the last state; this
> isn't too visual. But **Echo-heat** puts a heat diffusion in the **leftover bits**.
>
> **7:05** — This is like a layer of heat diffusion on top, and the little critters happen
> to be causing heat and **polluting** things.

> **Camsplaining:** each cell is a byte — eight bits — and a rule like Life only needs one
> of them. **Bit planes** are the other seven, free real estate stacked in the same cell.
> **Echo** (your book, §3.2) shifts the old state up a plane each step, so a glider drags a
> fading comet-tail of its own history. Echo-heat goes further and runs an entirely
> different simulation — heat diffusion — in the upper bits, then lets the CA in the lower
> bits **leak** into it. Two universes in one byte, interacting.

## The Zhabotinsky worms (7:28)

> **7:28** — This is a **Zhabotinsky reaction**. Slime mold does this; all these chemical
> reactions tend to do this kind of thing. There's an attractor where a pattern starts
> spiraling out — there's a **feedback loop** here. We can make this less horrible-looking:
> this one has a **five-step phase**, so now we get certain patterns that start spiraling
> and sending waves out.
>
> **8:13** — These are **Yuppie worms** — see how they're all uptight and angular.
> **Hipster worms** are a little mellower, they've got some curvy things. But **Bohemian
> worms** are the really cool, rough, relaxed ones. I particularly prefer playing with the
> Bohemian worms.
>
> **8:43** — And then this is **John von Neumann's 29-state cellular automaton**, which can
> reproduce itself — but you have to give it exactly the right input state.

> **Camsplaining:** the **Belousov–Zhabotinsky reaction** is a real chemical soup that
> refuses to settle, cycling through colors and throwing off spiral waves — the standard
> example of an **excitable medium**, the same math as heart tissue and slime mold
> aggregation. A cell fires, then must rest, so waves can only travel outward and spirals
> become self-sustaining. **Von Neumann's 29-state automaton** is the 1940s proof that a
> machine can contain a complete description of itself and build a working copy — a
> universal constructor, worked out before the structure of DNA was known.

## Diffusion that refuses to lose the remainder (8:52)

> **8:52** — On to the heat diffusions. I was trying to get **the marble effect that you get
> inside of a book cover**, with the wiggly paint. If you average your eight neighbors the
> heat will spread out, but this kind of **dithers** — there's a leftover after you average.
> And what it does is, instead of **throwing that leftover heat away, it carries it over to
> the next**.
>
> **9:43** — Now if I make a really big brush and paint, see how we get these nice
> diffusion dither-like patterns. The whole system can be **heated up** like this — watch
> the histogram, it's going over to the right — and the whole system can be **cooled down**
> over time. And then **when you hit zero or 255 at the end, you wrap**.
>
> **10:22** — When it gets mostly the same color you start to get these nice little
> artifacts — kind of **quantum tunneling**, **action at a distance**. They interact with
> each other even though they're not next to each other, because the leftover is tunneling
> through multiple spaces per frame. **This is where it's not really like a cellular
> automaton, because you can't really get cellular automata to have action at a distance.**

> **Camsplaining:** this is the one place Don's engine deliberately breaks the CA contract,
> and it's worth understanding why it matters. Averaging eight integers rarely divides
> evenly. Round it off and the fraction is lost forever and the picture goes flat and banded.
> Keep the remainder and hand it to the next cell — **error diffusion**, the same idea as
> Floyd–Steinberg dithering in image processing — and the discarded information keeps
> traveling. But a cell's remainder can cross several cells within one frame, so influence
> propagates faster than the neighborhood should allow. A strict CA has a **speed limit**:
> nothing moves more than one cell per step. This has none, which is why it can shimmer in
> ways real CAs can't.

## Volcanoes, X-rays, and slamming into zero (11:03)

> **11:03** — I'll use the painting tools: circular brush, small size, high value. This is a
> heat simulation, so I'm going to put a high value — now it's getting **concentric rings**.
> Then if I go to a low value and paint in the middle, now this is sort of **shaped like a
> volcano** if you think of it as a **height map**. They'll smooth out eventually to all the
> same — see how the histogram shows them all trending toward the average. But if you paint
> in it, you've introduced these hills in the height map, or gradients in the heat map.
>
> **12:04** — The mouse wheel just adds heat or subtracts heat from the whole system. And
> here I put **a little niche in the color map**, so we can **X-ray one little slice**.
>
> **12:25** — **Wavy marble** is different from **fiery marble** — fiery marble goes up, of
> course. Fire.
>
> **12:48** — The cool thing: this is the histogram, the heat of the system slowing down
> lower and lower, and that's the **frob** that controls it — **frob target**. Now it's
> going toward zero. Watch what happens when it hits zero. Boom. **You get chaos** — random
> blobs, because the coolest part of the system suddenly has a really hot point in it that
> then diffuses out. It's kind of like raindrops. That adds all this nice chaos to the
> system.
>
> **14:11** — Basically it's a heat diffusion, but with **this weird mathematical twist at
> the edges, which has no parallel in physics or reality, but looks cool**.

> **Camsplaining:** a **frob** is hacker slang (from the MIT Jargon File) for a knob you
> twiddle — a continuously adjustable control with no particular dignity. The **wrap** is
> the point of this section: cell values live in 0–255, and instead of clamping at the ends,
> 255 + 1 rolls over to 0. So driving the whole universe down against zero doesn't freeze
> it, it makes the coldest cells suddenly maximally hot, injecting fresh chaos exactly where
> the system had gone quiet. It's a bug promoted to an instrument.

## Sixteen kernels, and how to steer them (14:30)

> **14:30** — There are other ones than fiery marble. **Freaky marble**, of course. The
> basic test is to just blast it with randomize — see how it cools things down, because that
> brings you to fifty percent. That's high contrast. Then heat it up a little and try
> drawing in it.
>
> **15:03** — The thing about these marbles is that **they're adjustable**. **Twisty
> marble** — once I got freaky working, I wanted to see if I could make it twist. Then there
> was **twistier marble**, because it wasn't twisting enough. **Fuzzy marble** — gee, that's
> fuzzy. And **funky flower** is a little different, in a different class.
>
> **15:52** — The way to do this is to dial all these down and show them one at a time. So
> what we have is **16 different convolution kernels**, and this is one of them, and
> obviously it goes down and to the right — and we can draw on it as it goes by. **Phase
> offset** picks which one of those you get. Here's down, down-to-the-left, left — we have
> all these directions, and then even faster in that direction.
>
> **16:46** — Right now everything's dialed down, so all that affects it is the phase
> offset. **This is like the DC voltage.**

> **Camsplaining:** a **convolution kernel** is a little grid of weights saying how much
> each neighbor contributes to your next value. Weight the north-west neighbors heavily and
> the whole image appears to drift south-east — the pattern moves because each cell is
> mostly inheriting from one side. Sixteen kernels means sixteen directions and speeds of
> flow. Everything that follows is about **what chooses the kernel**, cell by cell and
> moment by moment: a constant, the clock, the cell's own value, or its position.

## Modulating the phase: time, value, space (16:55)

> **16:55** — On top of the phase offset, **phase shift step** is **time**. So I'm dialing
> time into the equation: every so many steps it shifts to the next offset. Here's super
> slow. Now less slow. Now really fast. **This is stirring it** — how fast do we stir it.
>
> **17:53** — If I put it even lower, it looks like **turtle graphics where the world moves
> instead of you**. All I'm doing is drawing a point in one place in a wrapped world, and
> changing the convolution kernel is **moving the world out from under me**.
>
> **18:25** — Now, **phase shift cell** takes a cell's value into account. This is a subtle
> one — you need enough cell-value differences. Here's a good example, because we have a
> crease, and the crease comes from the fact that the cell value changed. See that
> **wrinkle in time**, so to speak — it's a wrinkle in phase, and the reason it changed
> phase was that we got to a lower cell value.
>
> **19:21** — Then there's the **spatial phase**. **Phase shift Y**: the Y position switches
> the phase, and we make it lower frequency, so we can have blocky or pretty fine. And X is
> similar. So if I draw in an X shape I get **zigzags** along X, and this controls the
> frequency of the zigzags. If I make Y zigzag the same as X, I get some nice freakiness —
> but it's kind of cool to make **different frequencies** of zigzags. Who would have ever
> thought.
>
> **20:32** — If you want to do a **Lucy in the Sky with Diamonds** effect... I don't
> recommend operating heavy machinery under the influence. Yeah, you might have a lower
> frequency Y by one, and — oh, **they look like people**. Oh my God.
>
> **21:03** — Now let's add a little **cell shift** to break up these regular patterns. If
> you have an irregular cell shift, it's kind of adding some noise to the mix — but it's
> **spatially coherent**.
>
> **21:35** — We haven't even put any **time shift** into it. It's nice if you leave it slow
> — it kind of **bakes in** the effect. With the faster time shifts you get this wavy stuff
> that might hurt your brain. And then when you slow time shifting down, **each effect gets
> more time to really express itself**.
>
> **22:14** — If you're doing this to music, it would be interesting to **synchronize it
> with the music's time instead of the simulation's time**.

> **Camsplaining:** this is the deepest idea in the demo and it's easy to miss under the
> psychedelia. The same sixteen kernels produce completely different worlds depending on
> *what selects them*. Select by a constant and the whole field flows one way. Select by the
> clock and the field stirs. Select by the cell's own value and the pattern folds along its
> own contour lines — structure becomes its own cause. Select by X and Y position and you
> get standing zigzags whose frequency you dial. Then run several selectors at once and
> they beat against each other. Don is describing **a modulation matrix**, the same
> architecture as a modular synthesizer: a small set of sources routed to a small set of
> destinations, where the interesting sound is in the routing rather than the parts.

## Painting the universe (22:44)

> **22:44** — There are other tools — **circular spray**, where you choose how many
> sprinkles and the size, just spraying random stuff. And what I kind of like is **the
> line** — making sweeps through these things is great.
>
> **23:20** — There are a lot of different rules here, and **each rule is totally
> adjustable**, because these rules just pick between 16 different kernels, and then each of
> those is similarly adjustable.
>
> **23:33** — Now there was this really weird rule, **funky flower**. Whoa. You **paint in
> the upper four bits which convolution kernel you want**. So the good way to demonstrate
> this — and I could kind of tell a story about painting a picture here.
>
> **23:50** — So, let's see. **First the universe was complete chaos.** And then we got a
> circular brush, made it kind of big, and made it zero — let's paint with zero, just a bit
> in the middle there. All these are running a random kernel, but this one is running
> **kernel zero**, and that's very even. **Think of this as space** — it just spreads out.
> But there's energy coming in from the chaotic edges. Right now there are these kind of
> **quantum fluctuations of space** bubbling.
>
> **24:48** — But we could decide to change the **frob target of the universe**. With a
> negative frob target things can be very chaotic. As you move to zero and then above zero —
> whoa, things can also be chaotic at the other end, but we have different colors now. Near
> the middle is zero, so things are gently coming into the center of the universe.
>
> **25:11** — And if you'll notice, **the universe wraps at the edges, like all good
> universes should**. So we will paint out some nice **wormholes** to the other side of the
> universe, but leave a nice **chaotic core** in the center — or rather the *anti*-center.
> There's only one core of chaos, but it is in all different directions, because the
> universe wraps.
>
> **25:49** — We use the mouse wheel to cool and heat the average temperature of the
> universe. But when we cool it too cold we get these **chaotic bubbles** — I'm banging it
> against the bottom of possible temperatures. And if I do that really hard, it just
> **crystallizes**.
>
> **26:22** — Now we've tried to achieve equilibrium. Coming out of the chaos is blooming
> this heat and energy into our universe. If we think of this as space with maybe electrons
> or photons tunneling through it, we can heat it up and this rainbow gets pulled out and we
> get more saturated colors. And at the top, think of this as **blue sky with some white
> clouds** in it — say that's 15. If I set the tool cell to 15, now **I can paint with just
> a cloud**, and the sky is trying to come in on it. Push those rainbows back.
>
> **27:14** — See, the trend is for everything to **encroach on the clouds** — the sky will
> eat the clouds, and then the green and the fire colors. But we can adjust the universe's
> target so that it heats up a little, and now it automatically percolates back up to the
> sky. Now it's bubbling against the other end. When I paint, it's kind of sparkling — **the
> sparkle comes from wrapping around**.
>
> **28:03** — I think what we need at this point are **some planets**. Let's go to the other
> end and pick this rule out of the nice high-contrast area, and make the tool size large
> enough to draw a planet with. So this **planet is spinning** — it's flowing down and to the
> right. We can adjust the temperature of the entire universe and see what effect that has
> on the planet. See how this heat is getting bled out into it, because **space conducts
> heat** — but these other areas are kind of isolated from each other. **It's its own
> fictional physics.**
>
> **28:51** — So we choose another kernel and try that one here — ah, that one's going just
> to the right. And then **give another planet a moon** over here. Oh, and look at that, it
> wrapped around. And maybe one here — oh, that's a different direction. Each region has a
> different flow going on.
>
> **29:40** — Of course I touched some of the chaos, that could be interesting. Let's try
> some of these lower rules — these are a little different, they don't move in any direction
> at all, they just kind of hang out, but they're sort of different **diffusion constants**
> in those areas. Some are affected very quickly by their neighbors and some are not.

## RISCA — the ridiculous instruction set (30:23)

> **30:23** — I'll take a left turn here and change to a **Ridiculous Instruction Set
> Cellular Automata** and see what happens. Whoa. This is another one where **the top four
> bits say which instruction to run, and the bottom four bits are what it runs it on**.
>
> **30:47** — For example, if I press and drag into here, I sample that, and I can **paint
> with Life**. See, this is Life. Okay, see this one here — I want to sample and then paint
> with it. Here I'll just sample the random stuff. So basically all these different colors —
> I can **paint with the heat diffusion** here, and that's right up next to Life, so it
> **stimulates Life, because it's a neighbor**.
>
> **31:25** — Let's try another random one. I think this is a **logic calculator** — watch
> what happens when Life runs into it. See how **the Life gets sucked up into it**.
>
> **31:48** — There are ones for **moving stuff around**, that just copy in a certain
> direction. So if we put that one down there and this one in the middle, see how **Life is
> getting copied off in that direction**. And that's copy in *this* direction — so we'll
> slurp the Life in that direction. And that's up, so we'll slurp this Life upward. So we've
> got a Life running, and it's being stimulated by these guys, and then it's hitting the edge
> and getting flung out in different directions. **This is sort of a parallel instruction
> set.** I said it was ridiculous.
>
> **32:50** — It could use a better user interface, I suppose. Some of this is meant to be
> programmed by scripting — but don't let it stop you.
>
> **33:05** — Especially the von Neumann 29-state, which is a historical cellular automaton
> that can reproduce itself — but you have to have very specific initial conditions for it
> to work.
>
> **33:30** — So you're basically **painting with cellular automata rules**. Oh, see, that
> is Life, and then I think we have a Brian's Brain — see, that's Brian's Brain next to
> Life, and this one's shooting little things into Brian's Brain. So **just by being
> adjacent to something, they communicate.**
>
> **34:05** — Anyway, there's not much documentation and there's not a lot of practical
> software that's been written with this, but it's interesting to play with. All right, I
> guess that's enough for now.

> **Camsplaining:** **RISCA** is a pun on RISC, Reduced Instruction Set Computer. Here the
> cell's byte is split: the **top four bits are an opcode** and the **bottom four are its
> operand**. So the rule a cell obeys is *stored in the cell itself*, which means you can
> **paint programs onto the grid with a brush** — a patch of Life here, a heat diffuser
> there, a copy-northward region over here — and they interact wherever they touch, with no
> API and no wiring, because adjacency *is* the calling convention. Don's "logic calculator
> sucks the Life into it" is two hand-painted programs discovering each other at a boundary.

## What the comments caught

Don's own annotations, added under the video:

- **The gray goo at 33:16 is `TORBEN`** — *"an even more swizzled version of `ANNEAL` with
  much more turbulence along the borders."* It's an opcode in the `RISCA` switch statement
  ([CAM6.js line 5114](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js#L5114)),
  and it starts taking over the world.
- **The transition to Funky Flower at 23:38 was an accident worth keeping** — *"produced a
  totally unexpected effect! The special 'phase 0' cavern emptied out and gasses from
  adjoining phases squirted in!"*

And from the room:

> *"right on!!!"* — **@peterdilworth2316**

That's **Pete Dilworth** — the person who brought a CAM-6 to a science fiction convention and
hacked Forth on it all night with Don, which is where this entire forty-year thread starts.
See [the letter](the-cam6-demo-for-norman.md).

> *"I have a copy of the same book from when I was a high school student, and I've known your
> name from your work on pie menus. Small world!"* — **@michaeljmcguffin**
>
> *"Life! Don't talk to me about life..."* — **@hangonsnoop**
>
> *"I have no clue, of course, but I love and respect the fun of it, and mysterious beauty."*
> — **@gladysblock3527**

That last one is the whole design brief for the browser rewrite, stated by someone who
doesn't know it. **She got everything she needed from watching, and nothing she could act
on.** Fixing that gap — mysterious beauty you can also *touch* — is
[Act 2](the-cam6-demo-for-norman.md#where-it-wants-to-go-chapter-playgrounds-built-ground-up).

## The glossary (camsplaining on purpose)

*Norman: skip. Everyone else: this is the vocabulary, in the order it becomes useful.*

| Term | What it means here |
|---|---|
| **Cellular automaton** | A grid of cells, each holding a small value, all updated simultaneously by one rule that sees only a cell's immediate neighbors. |
| **Neighborhood** | Which cells the rule is allowed to look at. **Moore** = 8 surrounding + self. **Von Neumann** = the 4 edge-adjacent. **Margolus** = 2×2 blocks updated as units, with the block grid shifting one cell every other step — the one that makes reversible, conserving physics possible. |
| **Lookup table** | Precomputed answers for every possible neighborhood. Glue the neighbor bits into an index, read the result. Turns "evaluate a rule" into "read memory," which is why 1987 hardware hit 60 fps. |
| **Rule compiler** | The program that runs your readable rule over all possible inputs to build that table. Forth in the book; JavaScript in Don's version. The table is the contract between them. |
| **Bit planes** | A cell is a byte; a simple rule uses one bit. The other seven can hold an entirely different simulation running in the same cells. |
| **Echo** | Shifting a cell's old state up into higher bit planes each step, so moving patterns leave fading trails of their own history. (Book §3.2.) |
| **Histogram** | Live bar chart of how many cells hold each value — the instrument panel for the whole universe. |
| **Color map** | Value-to-color lookup. Changes what you can see, not what happens. Notch it and you get an X-ray slice through one band of values. |
| **Convolution kernel** | A small grid of weights determining how much each neighbor contributes. Asymmetric weights make the whole image appear to flow in a direction. |
| **Phase** | Which kernel is active right now. It can be selected by a constant, by the clock, by the cell's own value, or by position — and that choice is where the character of each rule actually lives. |
| **Error diffusion** | When averaging leaves a remainder, hand it to the next cell instead of discarding it. Same idea as dithering in image processing. Side effect: influence outruns the neighborhood, giving "action at a distance" a real CA can't have. |
| **Wrapping** | Values roll over 255 → 0, and the grid's edges connect, so the world is a torus with no boundary. Both wraps get used as instruments. |
| **Anneal** | Majority-vote smoothing that inverts on near-ties, so domains stay alive and slowly consume each other instead of freezing. |
| **Brian's Brain** | Brian Silverman's three-state rule — ready, firing, refractory — where cells must rest after firing, so everything is in motion. |
| **Excitable medium / Belousov–Zhabotinsky** | A fire-then-rest system that produces self-sustaining spiral waves. Real chemistry, also heart tissue and slime mold. |
| **Von Neumann 29-state** | The 1940s self-reproducing automaton: a machine holding a description of itself, able to build a working copy. Predates knowing how DNA works. |
| **DLA** | Diffusion-limited aggregation. Particles random-walk until they touch the crystal and stick, growing coral-like branches. Book p. 167, §15.7, on Norman's neighborhood. |
| **RISCA** | Ridiculous Instruction Set Cellular Automata. Top four bits of a cell are an opcode, bottom four the operand — so you paint programs onto the grid and they interact by touching. |
| **Frob** | Hacker slang (MIT Jargon File) for a knob you twiddle. |

## See also

- [`the-cam6-demo-for-norman.md`](the-cam6-demo-for-norman.md) — the letter this transcribes the demo for
- [`../don-hopkins/cam6-cellular-automata-machine.md`](../don-hopkins/cam6-cellular-automata-machine.md) — the Don-side writeup: lineage, DLA, shared memory, show plan
- [`../don-hopkins/warpomatic-video-background-removal.md`](../don-hopkins/warpomatic-video-background-removal.md) — the continuous-warp half of the same workshop, transcribed the same way
- [`../jim-crutchfield/crutchfield-machine.md`](../jim-crutchfield/crutchfield-machine.md) — video feedback as a GPU instrument; §5 of the 1984 paper is the bridge between CA and feedback
