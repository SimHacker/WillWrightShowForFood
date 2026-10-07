]633;E;printf '%s\\n' '# CAM6 Simulator (Don'"'"'s wiki page, full transcript)' '' '*The whole page as it stood, converted from the [raw Wayback copy](CAM6_Simulator.wayback-20180909.html) of' '`donhopkins.com/mediawiki/index.php/CAM6_Simulator` (last edited 25 Oct 2013, captured 9 Sep 2018). Unedited,' 'except that the HTML became Markdown and the article'"'"'s `==` dividers became `---`. The harvested, organised' 'versions are linked from [README.md](README.md).*' '' '---' '';205b953f-bdc5-434d-b9c5-752898c76105]633;C# CAM6 Simulator (Don's wiki page, full transcript)

*The whole page as it stood, converted from the [raw Wayback copy](CAM6_Simulator.wayback-20180909.html) of
`donhopkins.com/mediawiki/index.php/CAM6_Simulator` (last edited 25 Oct 2013, captured 9 Sep 2018). Unedited,
except that the HTML became Markdown and email addresses and phone numbers are redacted (the raw copy
keeps them as captured). The harvested, organised
versions are linked from [README.md](README.md).*

---

I have developed a **CAM6 Simulator** that emulates the [CAM-6 Cellular Automata Machine
Hardware](https://en.wikipedia.org/wiki/CAM-6) developed by [Tommaso
Toffoli](https://en.wikipedia.org/wiki/Tommaso_Toffoli) and [Norman
Margolis](https://en.wikipedia.org/wiki/Norman_Margolus) at MIT. I originally wrote it years ago in
a combination of C and Forth, but translated it to PostScript, C++, Python, and finally JavaScript.

Here is the [Cellular Automata Machine (CAM6)](http://www.donhopkins.com/home/CAM6/index.html)
simulator written in JavaScript that runs in the web browser.

You can get the source from GitHub at: <https://github.com/SimHacker/CAM6> and clone it with:

    
    
       git clone --recursive <https://github.com/SimHacker/CAM6.git>
    

I will write up some notes and documentation, but for now, I will copy and paste some raw text that
I've written to other people describing what it does and how it works.

It's not my fault it's fast! It's just that JavaScript is really really fast these days. I just
wrote the code to be simple. Not necessarily comprehensible, just simple!

Years ago, Will Wright mentioned a great CA optimization of making the grid of cells have an extra
one pixel border around the edge, then before applying the rule, copy the wrapping edges around the
border, and then applying the rule to the pixels inside the border, so the inner loop doesn't have
to check edge conditions and worry about wrapping!

And for each row I'm scrolling a 3x3 window of neighbors across the row of cells, and only loading
the 3 cells in the leading edge for each cell, so it doesn't do wasteful memory access.

Other than that, it's just written in a very simple, straightforward way!

Be sure to try using the mouse wheel to change all the cell values up and down, and see what happens
to them when they wrap around between 0 and 255!

The "frob" is the amount that's automatically added to all cell values, and you can tweak it up and
down with the mouse wheel, or adjust the "neutral frob" that the frob springs back to with the
slider.

It sure would be cool to use the webcam to draw in it!!!

I could dither the image of the webcam into the limited colormap of the cellular automata, and run
cellular automata over it to do all kinds of nifty effects!

Or do motion or edge detection, and use that to modify the cells in interesting ways!

Just put up a new version with a much better color map (black and fully saturated colors at the
extremes, interpolating to gray low saturation in the middle, and back to the opposite colors at the
extremes. Try drawing with 128 to get a soft gray out of which the sharper colors will emerge! Hard
to explain -- just play with it a bit!

Rudy Rucker: I feel like you might have some kind of bug in your update code, an off-by-one thing or
a problem with the buffer flipping. My reason is that I see persistent upward drift in the action,
like if I mouse drag a blob it generally moves up. Also the patterns appearing in the blob aren't
uniform. I mean...this IS supposed to be the 2D Rug rule, isn't it?

Oh it's supposed to have upwards drift! I was trying to simulate a flame!

But now I have rewritten it a bit, so not only do the different directions of drift cancel out so
there is no overall upward drift, and there is more shroomy wiggling effect, but also it's easily
configurable with 16 different convolution kernels for different drifting and diffusing effects,
which it switches between based on a combination of the phase offset, the x and y cell coordinates,
the cell value and the time step. Those inputs to the kernel selector may be shifted some number of
bits to the right, to lower their frequency, or sliding the shift sliders all the way to the right
removes their effect entirely, shifting them away to oblivion. The phase is the "dc component" not
shifted of course. So you can experience the pure effects of each of the 16 convolution kernels by
setting the shift sliders all the way to the right, then dragging the phase offset slider from 0 to
16, then you can turn back on each of the shifted phase inputs, one at a time, to see their effect
in isolation, by dragging that slider to the left.

The original version of this code written in C running on a Sun did have an interesting bug: I was
not initializing the "error" accumulator that carried the leftover of the average from cell to cell,
so when different kinds of background activities were happening on the Sun, the error accumulator
got initialized from the stack frame with a random undefined value! I noticed it when every time I
typed to a terminal window, the dithering shivered! It was really spooky until I figured out what
was going on!

In this version I am initializing the error accumulator to a random number to keep it shivering
consistently so it doesn't get stuck in local minima.

It gets very interesting when most of the pixels are the same color and the dithered pixels get
spread out and wiggle around like little fingers! Make the draw tool color one of the highly
frequent colors, possibly plus or minus one (now easy to do by clicking on the biggest peak on the
histogram), and draw with that to enjoy the weird strained edge conditions. The dithering violates
the rule of CA that interaction is strictly local -- it's like quantum tunneling of fractional
energy across the universe faster than the speed of light, effecting action at a distance!!

Oh yeah to play around with it in a mostly flat state, be sure to set the "frob neutral" to exactly
0 so it does not change the cell values up or down.

I'll port the code for the traditional Moore, Von Neumann and Margolis lookup table based
neighborhoods, and write some code so you can define them in JavaScript the same way you could
define them in CAM6 Forth, and it will compile them into rule tables for the simulator to crunch.
But it also supports hand written rules like this one, and this is my favorite, so I ported it
first!

Another rule of Rudy Rucker's I liked was one that multiplexed LIFE and BRAIN over space depending
on another plane in which it was running ANNEAL, calling ANNEAL=1 land and ANNEAL=0 sea, so BRAIN
swims in sea and LIFE crawls on land, and the sea/land masses anneal into big blobs like continents
(cow spots). I found that running ANTILIFE aka DEATH in the land phase was better, since then they
stimulated each other along the shores, since space for BRAIN looks like stimulus for DEATH, and
space for DEATH looks like stimulus for BRAIN -- so the shores are much foamier and exciting, and
the critters never die out. I like to think of the sea shores where the critters eat each other and
reproduce. And another trippy thing I added to that was to run RUGS + error diffusion in the 5
leftover bits (brain takes 2 and life takes 1), and include the life and brain bits in the
fractional input of the center and neighboring cells (i.e. don't mask them out when summing the
neighborhood), so that there is a continuous head diffusion field following the critters around,
that they make ripples in! I'll port that one too!

There's a new version up that has no upwards drift, and as a bonus, if you order before midnight
tonight, it also has a real time histogram showing the cells and the color map, that you can click
on to set the draw tool cell! Tweak the frob around with the mouse wheel or by dragging the "frob
neutral" slider to see how it raises and lowers the value of all of the cells in the histogram, and
what happens when it wraps! This evolved from one of the rules in CALab that Rudy will recognize:
rug -- but I mutated it to cultivate the shroomy paper marbling effect. Rugs performs an evenly
weighted average of the neighbors, and throws away the leftover of the average. But this has
multiple asymmetrical convolution kernels, and it switches between them on a per-cell basis, in a
kind of continuous yet chaotic way that you can adjust with the sliders as described above. And also
it takes the leftover of the weighted average and dithers it into the next cell, so it looks like 8
bit gif with error diffusion dither, an effect that I enjoy very much!

I just threw in some new rules: life, brain and eco (the combo anneal/brain/antilife), and they have
optional echo and heat diffusion overlays, with a pollutionShift parameter to adjust the magnitude
of how much pollution the critters emit into the heat overlay!

Rudy Rucker: You're going good. More nice rules (described in the [Cellab
manual](http://www.cs.sjsu.edu/faculty/rucker/cellab.htm)): FADERS, BALLOONS, ZHABO, and HODGE.

I've made the default rule be the anneal/life/brain + a layer of heat diffusion combo! I tweaked it
so the "frob" affects the land and water in opposite directions, so you will notice two combed humps
in the histogram that respond in opposite directions to the mouse wheel! So the land critters make
positive pollution, and the water critters make negative pollution, and the heat layer (pollution
diffusion field) has nice slopes toward the shoreline, where there is a lot of activity and its
consequent pollution because the land critters are stimulated by empty water, and the water critters
are stimulated by empty land, so there's a lot of activity at the shore.

Just added a cell histogram that shows the color map and cell population, and you can click it to
set the drawing tool! Use the mouse wheel to scroll the cell values up and down and see what happens
when it hits the edge!

The new dynamic cell/colormap histogram should make it more obvious what's going on. Not very
obvious, just more obvious than it was before, which was not obvious at all.

Chaim Gingold: I think you added the rule compiler since the last version I looked at (?). Being
able to switch the rules with a slider is cool (or I just found that). A GLSL shader that took the
compiled rules would allow absurdly huge canvases to run in real time.

I've got the Von Neumann, Margolis and Moore neighborhoods in now, and they have an optional bonus
"echo" and "heat" feature to control what it does with the higher leftover bits. The rules select a
neighborhood, set some flags and parameters, and provide a rule function, which takes a dict as
inputs whose keys are the neighbor names, as defined in the neighborhood. the function is iterated
over all possible combinations of neighbors and returns the cell state for each configuration, and
that is put into a table that the neighborhood's inner loop indexes into, by putting together the
bits for the index as defined by he neighborhood.

Now that I added the lookup-table based rules, it's really easy to add new rules! Also I implemented
the hard-coded [John von Neumann 29 state cellular
automata](https://en.wikipedia.org/wiki/Von_Neumann_cellular_automaton) \-- although the current
editing tools are not quite up to constructing a [universal
constructor](https://en.wikipedia.org/wiki/Von_Neumann_cellular_automaton)...

Also I added some comments, and cleaned up the jvn29 code so it has better variable names and is a
bit more self documenting. (for that that's worth -- it's still pretty esoteric!)

Chaim Gingold: Yeah I painted a bit and a universal constructor didn't come out. Hahaha.

Chaim Gingold: I want to be able to see the uncompiled js code on the web page for each
configuration! You might find [dat.gui](http://workshop.chromeexperiments.com/examples/gui/#1--
Basic-Usage) useful, which my class used for quick and dirty UI. I'm excited to read more of the CAM
book now . Also, [CodeMirror](http://codemirror.net/) might be useful for showing the js code (or
letting you edit it! though storing it in a server for others to play with would have some security
issues obviously).

How about adding a special cell that is an input port from the simulator into the world, and the
simulator can read files with instructions to send through the port, and "reach into the hole" with
a constructor arm and build things in the simulation, without actually taking up any space in the
world with a gigantic universal constructor! A universal nano-constructor cell!

Chaim Gingold: I dunno. Sounds like it might be dangerous.

I've cleaned up and commented and generalized the CAM6 code -- it's worth taking a look at now!

It now has a table of "neighborhoods" which contain the function that is run over all the cells to
compute the next state. They may be hard coded rules like Life or Brain or complex things like
(TODO) musical gas, and they may also be lookup-table based neighborhoods emulating and extending
the hardware neighborhoods that the CAM6 supported, including Moore (9 neighbors in of 1 bit: nw0 n0
ne0 w0 c0 e0 sw0 s0 se0 plus 3 extra center bits c1 c2 c3), von Neumann (n0 n1 s0 s1 w0 w1 e0 e1 c0
c1), and the awesome rotationally symmetrical Margolis which is great for gas and particle
simulations, spin glasses (magnetic fields in metal lattices, there are some really fascinating ones
of those I'll plug in soon), etc, with uses a square of two bits of four rotationally independent
neighbors, c0 c1 ("center") cw0 cw1 ("clockwise"), ccw0 ccw1 ("counter clockwise") and opp0 opp1
("opposite"), plus pha0 and pha1 which is the even/odd and odd/even time phase.

On top of that there is a table of "rules", which are that have the symbol of a neighborhood to use,
and other optional parameters to configure that neighborhood and the genereral purpose ca simulation
machinery (like "steps" is how many steps to compute between displaying, which is useful to set to 2
for rules that blink back and forth and would otherwise cause the user to freak out and spasm).

So some of the hard coded rules and also the lookup table rules have some optional parameters like
"echo" and "heat". If you set "echo" to true, it shifts the previous value of the two bits (I should
make that a configuration param) into the higher bits of the cell, so for a rule with 1 or 2 bits,
you get a history of its values in the higher bits, so you get trails in trippy colors (depending on
how your color maps is set up). If you set "heat" to true then it runs a dithered heat diffusion
simulation in the upper bits, and the lower bits that the rule runs in add heat to the simulation,
so you get a nice continuous field of "pollution" around the Life and Brain critters that spreads
out and dissipates with the "frob" parameter. The "heat shift polliution" parameter control how much
those combo-heat rules shift the low state bits before adding them into the heat layer. So if it's a
small shift (to the left) the critters don't generate much pollution, and if it's a big shift then
they pollute a lot more (exponentially, by powers of 2 of course).

The rules that use the lookup table based neighborhoods have a function that takes a "state" dict
whose keys are the neighbor names defined for the neighborhood, and values are 1 or 0 for the value
of those neighbors. Its job is to evaluate the CA rule for that configuration of cells, and return a
number for the next state of the cell. The rule compiler runs this function over every permutation
of the neighbor values and puts those results into the lookup table array (which it caches in the
rule so it only has to do it the first time). The index into the lookup table is the concatenation
of those neighbor value bits in the order given by the neighborhood's "neighbors" array.

Other rules like marble can be parameterized by any other data in the neighborhood dictionary and
the rule dictionary. For example, marble's neighborhood dict has a dict of named convolution
kernels, a 3x3 matrix of numbers that add up to 16, which it filters the pixels through. And it has
a parameterized function that decides which of those kernels to use for each cell, depending on the
cell's x and y spatial position, the time steps, the cell value, plus a phase shift constant. And
each rule can supply a list of 16 kernel names that it indexes with the "spatioTemporalCellPhase"
that the neighborhood computes. So it gently or violently varies the direction of diffusion over
space and time for a trippy effect, and there are several Marble variations for different effects.,
that just have different names in their list of kernel names.

And there is an array of editing tool dictionaries, for configuring and adding new editing tools.

The editing tools have a list of parameters that they depend on, so it can hide the parameters that
do not apply to the current editing tool.

Also the rules have a list of parameters they depend on so it can hide parameters that do not apply
to that rule.

And there is an array of parameter metadata describing all the parameters the user can change, their
range, functions to pretty print their value, convert to and from widget values, etc.

Also I added the dendrite rule with the Margolis neighborhood. It's a diagonal gas that lets you
draw several particles together into a solid mass that stays still, so you can draw walls that free
particles bounce around off of, and draw bottles that seal them in, then cut a hole in the bottle,
like the cute crude illustration in the CAM book.

The particles/solids are in bit plane 0, so draw with 1 and a thin brush or a sparse sprinkle to get
gas.

And draw with a thicker solid brush to get walls.

And then set the tool cell to 3, and draw a tiny dot somewhere some gas is flying by. Bit plane 1 is
"ice 9", and when you have ice on a particle (cell value 3) it freezes! And whenever a free particle
(or a solid piece) touches ice, it freezes into ice too, and the ice smoothly spreads through solid
objects, and beautiful dendrites like ice crystals slowly form in the gas (or quickly if it's high
pressure gas).

A cool experiment form the book to do is to draw a bottle with a neck, and densely pack it with gas,
with no gas outside. The draw a small ice crystal outside the bottle somewhere. You might want to
also draw a few solid bumpers here and there to mix things up (literally!). Then cut open the top of
the neck of the bottle (or anywhere else) and gas will start leaking out and bouncing around
outside, eventually finding the ice, and forming a crystal.

The cool thing is that the crystal will grow TOWARDS the source of gas, because that's where are the
particles are coming from, so that's the part that grows -- and eventually it will get to the neck
of the bottle, bend down, and jump down into the bottle and quickly freeze up all gas left inside,
if it doesn't just touch the bottle itself and freeze it, so the gas crystalizes as frost on the
inside of the bottle.

I was thinking of using that rule to make a cellular automata totally unique snowflake generator for
making holiday greeting cards or something!

You may notice that now the color map has 127=black and 128=white right in the middle of the faded
out gray colors, so you can spin the mouse wheel up and down to scroll the peak of the histogram to
the middle, and you'll see a nice "isothermal" black and white line wiggling around the cells of
value 127 and 128 -- it's a cool way to analyze the shape and contour of the cells by slicing them,
and looks great with the marble rules.

Rudy Rucker was right about there being an unintended upwards (and left) drift, on top of the
intended one -- sharp eye and good catch!

OMFG I just fixed a subtle bug in marble and now it's MUCH better! It was carrying over the leftover
from the average to the next cell, and that was causing a bias of heat to flow to the right and
down, because of the order that the cells were evaluated in. A proper error diffusion dither will do
a serpentine scan of rows left to right, then right to left, to cancel out the directional bias (or
at least the horizontal bias). But I came up with a simpler efficient way to do it -- I rotate the
direction of scan around clockwise 90 degrees every four frames, so first it scans
left>right/top>bottom, then top>bottom/right>left, then right>left/bottom>top, then
bottom>top/left>right! Now the marble rules are much nicer since there is no directional bias and
asymmetrical drift, and the "marble spin" is totally mind blowing, is I've made it the default! You
should shift-refresh the page to make sure you have the latest!

Oops -- an I also had to un-rotate the convolution kernels so the directional bias that they were
imposing on purpose stayed in the same direction every frame!

Rudy Rucker: Not to be tendentious, but I'm seeing a northwestward drift in the "heat" clouds in
Brain Heat and Life Heat. I don't see why you don't just do the update the "right" way and keep a
full buffer the size of the display and have a visible OldBuff and a hidden NewBuff and read through
OldBuff and put all the new values in NewBuff, and then swap the pointers so that now the former
NewBuff displays and you now update from the former NewBuff into the former OldBuff and so on. I
think you're overthinking things with your whirling scan update. But maybe I'm missing something.

Yep you're right, those I haven't fixed yet. I am using two buffers and swapping the pointers so I
don't have to copy the cells an extra time. And the buffers have an extra "gutter" around them so
they are two wider and taller than the cells, and I copy the edges across before computing the rule
so the inner loop of the neighborhood function does not have to worry about edge conditions.

The thing about the whirling scan is that it compensates for something that is not strictly a by-
the-book cellular automata effect, since the dithering is non-local. It is using a "past" and a
"future" buffer of course -- that is a common bug in CA implementations, to try to compute it "in
place" in the same buffer, which does not work because your w, nw, n, ne neighbors are not in the
past, but from the current step, since you just computed them in place and stored them back in the
same buffer. That will totally screw up a discrete ca rule, but is hard to spot with more continuous
image processing effects. The error diffusion dithering technique allows information to travel more
than one cell per frame (faster than the speed of light) by the leftover carrying over cells until
it finds one it can be absorbed into, and the direction of error diffusion travel depends on the
direction of scanning (and the diffusion kernel), since we only carry it to the right and eventually
down when we wrap. A normal 24 bit to 8 bit Floyd Steinberg error diffusion dither uses an extra one
scanline buffer to push the error down through a diffusion half-kernel, but it does not push the
error up, and a good implementation scans one row left to right, then the next row right to left, so
it pushes the error to the right, then to the left, so that it cancels out the rightward drift, and
doesn't have diagonal artifacts, however it doesn't cancel out the downward drift, but that doesn't
look bad, since a normal dithering algorithm is not iterative like a cellular automata and doesn't
build up from iteration. And of course a normal single frame dithering algorithm can't use this
rotate-90-degrees-each-time technique because it only does one pass, since it's not iterative. But
since a cellular automata is iterative, the drift builds up and is visible as you've noticed, and
rotating the scan order 90 degrees each frame does cancel it out nicely. For efficiency, this ca
carries all of the error to the next cell (which causes the right drift), and then across when it
wraps (which causes the down drift), instead of diffusing it to the scan line below through the scan
line error buffer, which is more computationally expensive. This article --
<https://en.wikipedia.org/wiki/Error_diffusion> \-- mentions one-dimensional diffusion, which is
what the ca is doing, and contrasts it with better but slower two dimensional dithering that needs
an extra scanline width buffer for errors and uses a two-d diffusion half-kernel. This article --
<https://en.wikipedia.org/>... -- mentions "boustrophedonic" dithering --
<https://en.wikipedia.org/wiki/Boustrophedon> \-- which scans back and forth, like an ox plows a
field. That gave me the idea to simply rotate 90 degrees each time to spread it out in all
directions over time, which is a good trade-off, since it's practically no more expensive, doesn't
use an extra scan line buffer or diffusion half-kernel, and since with a ca you are scanning again
and again you have the opportunity to spread it out over time instead of canceling it all out in one
frame, which is not possible with a single frame error diffusion dither. I find the animated
dithering patterns fascinating, and I've spend many hours staring at them, and now it's possible to
tweak and distort them in many ways with the new data driven marble rule!

I have finally implemented recording state snapshots and scripts, so I can record some sessions that
demonstrate some of the more (to me) beautiful and trippy things you can do by setting up the right
conditions and parameters. You can really get a lot of cool half-toning effects and patterns that
vary along a continuum from smooth and organic to geometric and digital!

    
    
    I've put up a new version with the spins-only rule, recording and playing back sessions (but there is not yet a way to save them to or load them from a server -- I'll do that soon!), and now there is automatically generated documentation of all the rules, neighborhoods, parameters, tools and commands, from the build-in metadata, with links to pages on my wiki that I will fill in with documentation, notes and more information, when I get the time. But for now, here's how to configure a particularly trippy marble configuration: Rule: Fuzzy Marble, Frob Target: cell change -0.00003 (after you click on the slider to set the focus, you can use the left and right arrow keys to fine-tune it, and it has a dead zone in the middle around zero, so drag it off the left edge of the dead zone and then use the arrow keys to dial in the negative number closest to zero that you can get -- later you might want to twiddle the Frob Target a bit more, but the closer to zero yet not zero it is, the more subtle effect you get. Phase Offset: shift 0 (for now), Phase Shift X and Phase Shift Y: shift 8, all the way to the right, to disable it by shifting it away to oblivion, Phase Shift Cell: 3 or so, you can fiddle with that to get different effects, lower is more granular, higher is chunkier, and it depends on the cell value, so it will break up gradients into different phases that are using different kernels and traveling in different directions), Phase Shift Step: shift 9 or so, smaller is faster shifting, and too fast tends to cancel out the effect, and slower tends to let each kernel iterate for a while and really impose its effect, then use the vertical mouse wheel to scroll the cells in the histogram so the big peak is centered on the center where the black and white lines are, so you'll see wiggly black and white isothermals or scattered fields in the cells depending on the slope. Now you can play around wit the "Phase Offset" slider to shift the phase around (the DC component that stays still) and you can also use the horizontal mouse wheel (i.e. two fingers touching the Mac trackpad dragging left and right) to shift the phase. Then you can use the drawing tool to put the cells into an interesting state so the rule can really titilate them: Tool: Circular Brush, Tool Cell: 127 or so, but then try other values near the center or at the extremes, Tool Size: 200 pixels so it's nice and big, then click in the middle of the cells to get a big circle, which will rapidly become quite fuzzy. Then try a Tool Cell of 255 or so, and watch it "peel the onion from the inside"  ... Then you can try switching to the "Twisty Marble" rule for a really trippy effect. When the cells are mostly the same value, try dragging the Phase Shift X and Phase Shift Y sliders to the left -- if they are on the same numbers you get diagonal diamond patterns whose size is smaller with smaller X and Y numbers, larger with larger X and Y numbers, but if they are at different values, you will see the patterns rotate so their slope is the ratio of x to y, and you can see them tear apart and form back together at the new angle in real time as you drag the x and y phase sliders around -- it's really cool!
    

Oh and now there is a cool new feature in the drawing tool, that's really useful: Shift-click the
drawing tool in the cells, and it will stay there and keep on drawing after you've released the
button! Then you can adjust the tool parameters with the slider while it's drawing. Eventually I'm
going to reify tools as objects that you can drag onto the cells and adjust by direct manipulation,
so you can have any number of different kinds of tools all drawing in the cells at once!

And scroll down to the bottom of the page to see the documentation! You can click on the lines with
a + to open up the outline -- there's a lot of stuff in there, even the JavaScript functions that
define the rules!

If this confuses you, the [source code](http://www.donhopkins.com/home/CAM6/CAM6.js) should make
everything clear!

* * *

The CAM-6 (Toffoli & Margolis's Cellular Automata Machine board for the PC) does 60 frames a second,
synched with a color video monitor. I think you can decouple it and run faster. It's 256x256 cells,
with 4 bits per cell. The colors change so rapidly at 60 frames a second that you see more colors
than are really in the color table with some rules (like the one on the cover of the book, oooh my
brain still tingles from seeing it on the real machine!).

You program the rules in Forth running on the PC, and it downloads the tables it generates from the
rules to the CAM card, and away it goes. I have written a somewhat compatible CAM rule description
language for Mitch Bradley's Sun Forth system (Sun-3 and Sun-4), so I can type in the rules from the
book and generate rule tables that you could download into the CAM hardware. I have a C program that
simulates the CAM hardware, that I can tell to read and write sun raster files, load rule tables,
apply rules, etc. It is not particularly efficient or portable, but it's a start. I am working on
linking it into the Forth system instead of as a separate program, so I can use it more
interactively.

It needs some cleaning up but if you're really interested in it, and have a descent Forth system, I
can send you the code I have now. I use it to generate long sequences of raster files on disk, then
play the movies back as fast as I can. Still nowhere near as fast as the hardware, but it allows me
to play around with the rules in Forth and see what they do!

Recently I have started rewriting the CAM simulator, so hopefully I will have the time to finish and
make it into something easier to use.

CAM Rules!

* * *

Here's a cellular automata laboratory that uses the shared memory raster animation library to
integrate a Toffoli/Margolis CAM-6 simulator I wrote in C with the PostScript graphics editor (so
you can cut and paste PostScript graphics into live running cellular automata, and copy the cells
into the graphics editor, and generate garish but seamlessly tiled screen backgrounds, and place a
live bubbling cellular automata view component clipped into a lava-lamp shaped window!):

<http://www.donhopkins.com/home/catalog/hyperlook/CAM.gif>

The nice thing about having a standard PostScript based structured graphics format, is that the
entire system supports it, so you are free to do fun stuff like making a clock face out of a
cellular automata or SimCity map, copying an entire window including its user interface components
as structured graphics, clipping and stretching it in in the graphics editor, and using it as a
clock hand, or whatever else you can think of.

* * *

I've been dragging that cellular automata machine engine code around for years, so I cleaned it up
to use as a proving application for the tile engine.

I was inspired by playing with one of Margolis and Toffoli's CAM-6 devices, which let you program
cellular automata rules in Forth on an IBM-PC, and run them in hardware at video rates.

So I read their beautiful Cellular Automata Machine book, which defined how the CAM-6 worked, and
had a lot of example rules written in Forth. I studied a copy of the Forth code that was used to
program the CAM-6, and wrote a compatible CAM-6 simulator in C. (Now rewritten in C++, but still
with lots of nasty macros.)

I used Mitch Bradley's Sun Forth system to develop and drive the C CAM-6 library, and to program
cellular automata rules (Sun Forth could link in and call libraries written in C).

It would run as a batch process and write out a bunch of Sun raster files, which I'd later animate
and zoom with PostScript in NeWS.

The CAM-6 had a high level language written in Forth for conveniently defining cellular automata
rules, which it compiled down into rule look-up tables, that it loaded into the CAM-6 hardware's
rule table memory.

The C++ simulator implements most of the neighborhoods and rule lookup table formats supported by
the hardware, so you could type in the Forth programs published in the book, and run them in
software without modification (and change them!).

I've rewritten the rule table compiler in Python, which is included in
MicropolisCore/src/CellEngine/python/cellrulecompiler.py with a few example rules.

The C++ code also has a whole bunch of different C++ "hard wired" cellular automata rules.

One of the interesting ones is John von Neumann's original 29 state cellular automata rule, which is
capable of self-replication (given an appropriate and enormous initial condition)!

There's some old stuff in there for simulating musical ambient audio gasses (which play
parameterized sounds when certain particles collide or other events happen, kind of like granular
synthesis, that lets you hear what's going on dynamically in the CA), which could be fixed up to
call back into Python to play the sounds with csound.

* * *

I just ran across the proceedings of the Automata 2008 conference, with lots of interesting articles
by several people whose stuff I've read before, and lots of other people.

<http://uncomp.uwe.ac.uk/free-books/automata2008reducedsize.pdf>

Andrew Wuensche makes these beautiful diagrams of the structure of cellular automata rule space.
When I worked at Interval Research Corporation, I ran across his beautiful book in the library
there, which you can now download:

<ftp://ftp.cogs.susx.ac.uk/pub/users/andywu/papers/global_dynamics_of_CA.pdf>

The pretty pictures start on page 98!

Somebody wrote another article about signal crossing and self reproducing von Neumann 29 state
cellular automata machines. It inspired me to implement the rule and some of his "signal crossing
organs" in OpenLaszlo so you can play with it in Flash:

<http://www.donhopkins.com/drupal/node/41>

And Tom Toffoli wrote about lattice gas -vs- cellular.

His book "Cellular Automata Machines" and his CAM-6 hardware inspired me to get into CA and
implement my own CAM-6 simulation and CA engine, many years ago.

I've published it as open source along with the SimCity code:

<http://code.google.com/p/micropolis/source/browse/#svn/trunk/MicropolisCore/src/CellEngine>

Check out the International Center for Unconventional Computing, where they have the PDF files for
the conference proceedings, and lots of other freaky stuff!

<http://uncomp.uwe.ac.uk/>

* * *

Tommaso Toffoli (Boston, USA): Lattice-gas v s cellular automata: the whole story at last:

“I do not know of any single instance where something useful for the work on lattice gases has been
borrowed from the cellular automata ﬁeld. Lattice gases diﬀer in essence from cellular automata. A
confusion of the two fields distorts our thinking, hides the special properties of lattice gases,
and makes it harder to develop a good intuition." [Michel Henon(1989)].

The political arena of fine-grained parallel computation seems to incite us to take sides for one of
two candidates—Cellular Automata (CA) and Lattice-Gas Automata (LG). What is the poor researcher
supposed to do? My presentation is intended to be a “Guide to the Perplexed."

Cellular automata provide a quick modeling route to phenomenological aspects of nature—especially
the emergence of complex behavior in dissipative systems. But lattice-gas automata are unmatched as
a source of fine-grained models of fundamental aspects of physics, especially for expressing the
dynamics of conservative systems.

In the above quote, one may well sympathize with Henon's annoyance: it turns out that dynamical
behavior that is synthesized with the utmost naturalness when using lattice gases as a “programming
language" become perversely hard to express in the cellular automata language. Yet, Henon's are
visceral feelings, not argued conclusions. With as much irritation one could retort, “How can
lattice gases diﬀer ‘in essence’ from cellular automata if they are merely a subset of them? What
are these CA legacies that may ‘distort our thinking’ and ‘hide the special properties of lattice
gases’ ? And aren’t there dynamical systems that are much more naturally and easily modeled as
cellular automata?"

Today, with the benefit of twenty years’ hindsight—and especially after the results of very recent
research—we are in a position to defuse the argument. Henon's appeal could less belligerently be
reworded as follows: “Even though CA and LG describe essentially the same class of objects, for
sound technical and pedagogical reasons it is expedient to deal with them in separate chapters—even
separate books for different audiences and applications. What is ox in the stable may well be beef
on the table."

The bottom-line message is that these two modeling approaches do not reflect mutually exclusive
strategies, but just opposite tradeoffs between the structural complexity of a piece of computing
machinery and its thermodynamic efficiency. By casting essential aspects of dynamics in a precise
formal context, it becomes possible to explicitly show why:

– total recycling of information waste can in principle be achieved even in non-invertable dynamics;

– at the same time, while waste is so easy to produce if one insists on using simple machinery
operating on a local scale, effective recycling of information waste may not be possible without
very complex machinery insuring coordination on a wide-range scale. Do we have a case for “Logic for
capitalists?" (cf. “Logic for conservatives: The heath-death of a computer," The Economist, 11 Feb
1989.)

* * *

A long time ago I got to play around with the CAM6, and I grabbed a copy of the floppy disks that
went with them. Forth at the time was one of my favorite programming languages! So I wrote my own
version of the Forth rule compiler with Sun Forth (Mitch Bradley's 68k forth, which later became the
boot ROMs of the SPARCStation, Mac, and even later the OLPC). And I wrote some C code to emulate the
CAM6 and also execute various rules directly, and plugged it into Forth, so I could type in the
Forth rules from the beautiful "Cellular Automata Machines" book and run them.

Here are the old floppy disks of the CAM6 with the RPN Forth assembler drivers for the hardware as
well as the higher level rule compiler, ui framework, and a bunch of rules:

<http://www.donhopkins.com/home/code/tomt-users-forth-scr.txt>

<http://www.donhopkins.com/home/code/tomt-cam-forth-scr.txt>

That's the stuff I based my CAM emulator on (plus the information about the hardware in the book),
so I have a bunch of the rules compiled by Forth saved as lookup tables
(<http://code.google.com/p/micropolis/source/browse/trunk/MicropolisCore/src/CellEngine/src/ruletables.cpp>
on google code), and I have rewritten the rule compiler in Python (
<http://code.google.com/p/micropolis/source/browse/trunk/MicropolisCore/src/pyMicropolis/cellEngine/cellrulecompiler.py>
), and translated some of the Forth rules to Python, so I can reproduce their lookup tables and run
them in the emulator.

I've also translated the "jvn" code (an MSDOS implementation of John von Neumann's 29 state CA rule)
to C++ and bult it into my CA machine, and then I rewrote it in JavaScript and implemented it in
OpenLaszlo so it runs in Flash: <http://www.donhopkins.com/drupal/?q=node/41> (Oops the OpenLaszlo
server is down so I will have to restart it!)

I have downloaded CAPOW and will check it out! Thanks!!

* * *

CALab Manual:

<http://www.fourmilab.ch/cellab/>

* * *

CodeMirror:

<http://codemirror.net/>

* * *

# ==

From: Don Hopkins < [email redacted]>

Sent: Monday, February 15, 1999 2:20 PM

To: Scott Snibbe < [email redacted]>

Subject: Cellular Automata in AfterEffects!

Hi, Scott! How's it going?

I've just ported my cellular automata machine engine to AfterEffects as a plug-in! It's already
making really cool movies, but I'm still trying to figure out how to create a useful interface to
all its generality. If you're interested, I could send you a copy, in exchange for your feedback and
advice!

Essentially, it's an 8 bit process, so it can only apply to one channel at a time. But I came up
with a cool, convenient way to map 8 bits to 32 bit rgba, to display the cellular automata in color!
The trick is to use a 2-d image as an interpolatable array of colormaps! I made a 2-d "Colormap"
layer argument and a "Colormap Phase" numeric argument. The colormap is defined by sampling a row of
pixels, and the phase controls the y-coordinate of the row to sample. So you can draw a 2-d animated
colormap, and cycle through it by changing the phase. I guess I might add a horizontal phase too, so
you can also do traditional "colormap rotation". Or a temporal phase, so you can use movies as
animated colormaps.

An even more general approach to using an image as a colormap, would be to specify two (x,y) points
to interpolate 256 samples between! I think I'm going to implement this technique, and use "colormap
phase" to cycle that. Then you can just animate the endpoints of the line bouncing around in the 2-d
colormap! I predict that pornographic images will work really well as 2-d animated colormap sources!

Another feature I'm trying to implement is how to draw into the cellular automata while it's
running. I have an "Overlay" layer argument, and an "Overlay Channel" argument, that composes the
selected channel of the overlay, through its alpha channel, into the cells. So you can play one
channel of a movie with an alpha channel into the cells! I need to add "Overlay Position" and
"Overlay Transformation" arguments so you can move the overlay around, and use it like a paint
brush. This will decouple the "drawing tool" problem so it can be address in a general way by
another plug-in. Do you know if a plug-in exists that captures 2-d mouse gestures or pressure
sensitive pen or joystick input over time, that I could use to animate points in AfterEffects? Or
should I write that one, too?

One big question is where do the cells live, and where does the initial configuration come from?
Right now, the source image at time 0 defines the initial configuration and the size of the cell
array. There's an argument to select which channel of the source image to use as the initial state.
It recomputes the frame you want by starting with the source image, and applying the required number
of rules, checking out the parameters over time, so you can animate all the arguments. The one
optimization is that it remembers the last frame it did, so it can start with that if you're moving
forward in time, and when it's rendering them in order, it only has to compute each frame once.

The destination image is just a view of the cells, it does not check out the previous value of the
source image in time. This is because all images in after effects are 32 bit, and my is optimized to
only on 8 bit images. So it keeps the cells in its own front and back buffers, and renders them into
the destination, via the colormap, or into one 8 bit channel.

Another way you might want to use the plug-in would be to use the source image as the initial state
each frame, sampled at the current time, and then run a certain number of rules on each frame. So
instead of snapshotting the first frame and running one application of melt per frame on it again
and again, you could take each frame and run one or more applications of melt on each one. Or even a
sequence of several different rules, although it might be easier to just add another cellular
automata plug-in for each rule you want to apply in sequence, than to make the user interface any
more complicated.

-Don 

# ==

From:  [email redacted] ( APL Consultant)

Newsgroups: comp.theory.cell-automata

Subject: Re: CAM-6 (Systems Concepts)

Keywords: CAM-6, Toffoli, Margolus, hardware, Systems Concepts

Date: 25 Sep 88 03:31:04 GMT

Organization: McKenney Associates, Richmond, Virginia

>From:  [email redacted] (the dirty vicar)

>Subject: CAM-6 (Systems Concepts)

>Date: 19 Sep 88 16:14:39 GMT

>Organization: State University of New York at Stony Brook

>Could someone please fill me in on the CAM-6 board from Systems Concepts as described in CELLULAR
AUTOMATA MACHINES by Toffoli and Margolus?? Specifically, how much does it cost, and what is the
address/phone of the company?? I imagine posting would be best since I'm probably not the only
person interested. Thanks.

>Dave Iannucci Computer Science, SUNY at Stony Brook, Long Island, New York

>************* UUCP: {allegra, philabs, <arpa-gateway>}!sbcs.sunysb.edu!dji

>* 4 months! * BITNET:  [email redacted]

>************* Internet or CSnet:  [email redacted]

The book didn't give you much to go on, did it? I finally tracked Systems Concepts down, and asked
them to send me any information they had on the CAM-6.

What came was a one-page technical summary and price list, along with a cover letter from a
gentleman named Oliver Graves (dated 30 June 88).

Prices were as follows:

CAM-6 Hardware and technical manual $1,400.00

CAM-6 Software, for one computer, and user's manual $ 150.00

Package price for hardware, software, programming, and user's manual $1,500.00

Book, "Cellular Automata Machines" $ 30.00

Sales Tax applied for California residents.

The CAM-6 board is described as fitting into an IBM PC, PC/XT, PC/AT, or compatible computer.
Nothing about speed limitations is mentioned, but if I were thinking about adding it to a 20MHz '386
machine, I might do some further checking before throwing my money at them.

It does have its own video connector, with a pass-through when the board is not operational. The
Tech sheet says it will drive an "IBM standard color monitor, or compatible (or enhanced monitor in
non-enhanced mode)". Video in/out are via a "standard" 9-pin plug and socket (one presumes a DB-9
connector).

Power is 1.5 amps at 5V (7.5 watts).

For further information, get in touch with either Oliver Graves or Steve McClure at:

Systems Concepts

55 Francisco Street

San Francisco, California 94133

[phone redacted]

It looks like a wonderful instrument for research into cellular automata, but a little beyond my
current budget limit for AI projects for this year. Fortunately, most of the programs in the book
look like they wouldn't be too hard [translation: too hard for the mythical "someone"] to implement
in C.

Hopes this helps. For those listening in who haven't read the book ("Cellular Automata Machines" by
Toffoli and Margolis, MIT Press), I highly recommend borrowing a copy from someone.

Frank McKenney

* * *

"Please summarize responses to the appropriate newsgroup"

Frank McKenney, President | {uunet,rti}!talos!mckenney | 

McKenney Associates | guest account - access | 

3464 Northview Place | provided as a courtesy by | 

Richmond, Virginia 23225 | Philip Morris USA | 

USA [phone redacted]

* * *

* * *

Newsgroups: comp.theory.cell-automata

From:  [email redacted] (David Hiebeler)

Subject: CAM-PC

Date: Fri, 20 Dec 1991 19:01:56 GMT

I had meant to send this out a long time ago, but it got buried in my "non-urgent" mail for a while.

You can write to " [email redacted]" for more information. Also, I was just talking to one of the
people at Automatrix recently, and apparently they have added another event counter to CAM-PC. (I
believe that feature has not been "officially announced" yet, but should be available soon).

NEWS RELEASE

AUTOMATRIX, INC. INTRODUCES WORLD'S FIRST SINGLE-BOARD, 24-MIPS CELLULAR AUTOMATA MACHINE FOR UNDER
$2000

REXFORD, NY, October 1, 1991 -- Automatrix, Inc., today announced the availability of the full
production version of CAM-PC: the first, single-board cellular automata machine (CAM) for under
$2000. Though a small number of CAMs of various architectures exist in research laboratories around
the world, CAM-PC is the first, mass-produced machine that installs in a standard platform. Designed
as an add-in board for IBM and compatible personal computers (PCs), CAM-PC will easily perform
simulations at speeds previously requiring expensive, high-end workstations and supercomputers.

CAM-PC comes with a complete operating and development environment and instructional textbook. In
addition to dozens of fully debugged experiments which can be used for demonstrations or programming
examples, specially created software greatly simplifies the task of writing custom programs. No
longer are cellular automata animations the exclusive domain of those fortunate enough to work with
only the fastest computers. CAM-PC and its powerful graphics will bring the universe of animated
cellular automata to everyone with a standard PC.

Cellular automata have a surprisingly wide range of applications. They have been used to simulate
many physical phenomena and have been most studied as lattice-gas models of fluids. They are also
particularly well-suited to applications in materials science, statistical mechanics, diffusion and
dispersion, granular flow and phase transitions. Cellular automata have also found use outside of
the physical sciences, including applications in signal processing, radar target tracking, economic
modeling, virus spreading and distributions, optimization problems, performance modeling of parallel
computer architectures and artificial life. For researchers and educators in these and many other
areas, CAM-PC will be an invaluable tool.

CAM-PC is conceptually different from any other computational device in its price range.
Traditionally, problems have been solved by arranging a model in a computer's memory and then
processing pieces of the model with long instruction sequences. This is inefficient and expensive
for many complex calculations. Fortunately, it is no longer necessary.

With a CAM, problems are solved by arranging a model in memory and processing the entire model with
simple RISC-like instructions. This works like a single-instruction multiple-data (SIMD) parallel
processor, such as the CM-2 from Thinking Machines Corporation. With this approach, all of the
computer's resources are efficiently brought to bear on the problem, greatly reducing computational
times.

CAM-PC achieves its phenomenal 24 MIPS performance by parallel processing and overlapping
operations. "It performs both a gather operation and a transform operation on two processors in a
single clock cycle" explains Mukesh Chatter, the lead engineer of the product design team.

CAM-PC's integrated graphics is specially designed for CA animations. A movie is easier to
understand by watching it run than by viewing the frames individually. In the same way, complicated,
non-linear dynamical systems are much easier to understand if calculations for their simulations are
graphically displayed as they evolve in real time. Explains David Cross, VP Application Software,
"Unfortunately most conventional computers can't display the results of complicated calculations as
[rapidly as] they occur. Users were faced with the choice of using either crude animations or very
expensive graphics hardware. CAM-PC now provides a third alternative." Because CAM-PC is tightly
coupled to its associated graphics display, the user can observe cellular automata simulations in
real time, as programs run and calculations occur. The advantages of combining cellular automata,
RISC-SIMD processing, and real-time visualization are obvious and have lead to the creation of a
powerful new tool for interactive experimentation: CAM-PC.

CAM-PC displays 65,536 cells on an ordinary TTL color monitor in 2 dimensions, arrayed 256 across
and 256 down. Cell states are mapped as different colors under user control. Programs are stored in
eight 64K-bit lookup tables for instantaneous processing. The whole array is scanned, displayed, and
updated 60 times/sec. The result is a smooth animation that brings the real-time computations to
life.

CAM-PC is implemented on a full-length PC/XT board with over 60 low-power IC's, including 20 custom
programmed parts. Because CAM-PC does most of the work, the board and its software operate in the
oldest and newest PC's with little difference in performance.

The programmable components are a unique feature of CAM-PC which allow future enhancements through
firmware upgrades. This design strategy has already proven its value. CAM-PC was originally released
in December 1990 to selected beta sites, and with firmware upgrades, all of these sites have the
latest circuit enhancements.

A CAM-PC program consists of a sequence of rules and models, or patterns, that are loaded into CAM-
PC at predetermined time intervals. The rules are applied to the patterns as the program runs. The
user may start, stop, retard, accelerate, or reverse the program, or make changes in the rules and
patterns at any time during its operation.

In addition to ordinary "cellular automata neighbors", CAM-PC rules can use inputs from temporal
phase bits", spatial parity bits" and a variety of additional inputs, including other CAM-PC boards
or user-supplied logic. CAM-PC is also the first machine to implement Margolus neighborhoods
directly in hardware.

Extensive gluing logic incorporated in CAM-PC allows multiprocessing with several boards. Up to four
can be combined in a single PC, and with an appropriate expansion bus, even more may be added. Thus,
large models are easily accommodated. Horizontal and vertical gluing allow spatial extension and
depth gluing provides additional bits per cell. CAM-PC's design offers the user maximum flexibility.

CAM-PC is available by mail order from Automatrix, Inc. The complete CAM-PC Package, including
hardware, software, documentation and the book "Cellular Automata Machines: A New Environment for
Modeling," by Toffoli and Margolus, sells for $1950. Payment may be made by check or money order, or
by purchase order from "Fortune 1000" companies, U.S. Government laboratories and accredited
educational institutions. With a current delivery of 2 to 4 weeks, CAM-PC makes animated,
interactive experimentation an affordable, easily obtainable option for everyone.

For more information or to place an order, write to: CAM-PC, Automatrix, Inc., P.O. Box 196,
Rexford, NY 12148-0196 or call the sales department at: [phone redacted].

\---

CAM-PC is a trademark of Automatrix, Inc. IBM PC and PC/XT are trademarks of International Business
Machines Corporation. CM-2 is a trademark of Thinking Machines Corporation.

  
\--

Dave Hiebeler | Internet:  [email redacted] 

Thinking Machines Corporation | UUCP: {uunet,harvard}!think!hiebeler 

245 First Street | Bitnet:  [email redacted] 

Cambridge, MA 02142 USA | Phone: [phone redacted] (work) 

