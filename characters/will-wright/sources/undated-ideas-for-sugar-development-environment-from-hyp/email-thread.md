# Ideas For Sugar Development Environment From Hyperlook Simcity

*1 messages — verbatim from lots-of-chat.txt scoop.*

## 1 · Don Hopkins <dhopkins@DonHopkins.com>

        **Date:** 28 December 2006 at 16:58:09 GMT+1  
        **Subject:** Ideas for Sugar development environment from HyperLook SimCity  
        **To:** sugar@laptop.org, gnu@toad.com, Don Hopkins <dhopkins@DonHopkins.com>, Walter Bender <walter@media.mit.edu>

        I love the ideas behind Smalltalk, EToys and HyperCard, and would like to combine them with ideas from visual programming languages like Robot Odyssey, KidSim, Klik-and-Play, SimAntics, Body Electric/Bounce, Max/MSP/Jitter, etc.

Here are some ideas about HyperLook and other systems, that could be applied to Sugar:

HyperLook was a PostScript-based user interface development environment for the NeWS window system, which Arthur van Hoff created at the Turing Institute in Glasgow.
http://www.donhopkins.com/home/catalog/hyperlook/

I helped develop HyperLook into a commercial product, with a editable user interface development environment, as well as a redistributable non-editable runtime, and I used it to port SimCity to Unix, and develop other components and applications .
http://www.donhopkins.com/home/catalog/hyperlook/
http://www.donhopkins.com/home/catalog/hyperlook/HyperLook-SimCity.gif

HyperLook was inspired by HyperCard, but it additionally provided a client/server programming model, and more powerful graphics and scripting based on NeWS's object oriented dialect of PostScript.
http://www.donhopkins.com/home/catalog/hyperlook/TalkInterfacing.gif

The NeWS window system was like AJAX, but with:
1) PostScript code instead of JavaScript code
2) PostScript graphics instead of DHTML graphics, and
3) PostScript data instead of XML data.

It had a unified programming/graphics/data/networking model based on NeWS's extended multi-threaded object-oriented dialect of PostScript, instead of a hodge-podge of accidental technologies. (Although I will be the first to admit the X11/NeWS merge was quite a hodge-podge and huge-kludge!)
NeWS had an object system based on the simple dynamic ideas of Smalltalk, implemented with the PostScript dictionary stack, supporting multiple inheritance and runtime modification of objects and classes.
http://www.donhopkins.com/home/catalog/hyperlook/HyperLookInfo10.gif

HyperLook was a gui development framework and desktop environment, that extended NeWS with a user-editable structured PostScript graphics format, a persistence system, a HyperCard-like delegation model using a network based client/server library, that passed messages from button to page to background to stack, and finally over the network to the application (and back), and an entire user interface toolkit, window manager, gui editor, clipboard and other desktop tools and services, all designed around the PostScript graphics format and message passing system.
http://www.donhopkins.com/home/catalog/hyperlook/TalkInterfacing.gif
http://www.donhopkins.com/home/catalog/hyperlook/HyperLookInfo2.gif
http://www.donhopkins.com/home/catalog/hyperlook/HyperLookInfo11.gif
http://www.donhopkins.com/home/catalog/hyperlook/HyperLookInfo13.gif

Users could create their own integrated applications, task oriented interfaces, presentations and journals, by cutting and pasting high level components and graphics together, configuring them with property sheets and graphical editors, scripting them with PostScript message handlers, sending and receiving messages between other stacks and applications, and customizing applications to suit their needs.
http://www.donhopkins.com/home/catalog/hyperlook/HappyProps.gif

It provided a user-editable window manager, that allowed you to draw and shape the window frame with arbitrary PostScript graphics, cut and paste you own resize corners, close boxes, menus, buttons, pie menus and other controls, as well as combining and scripting together multiple application components and custom graphics.
Because everything was based on PostScript, you could print any window to a PostScript printer or copy it to the clipboard, and iconified windows were just live miniaturized views.
http://www.donhopkins.com/home/catalog/hyperlook/Clipboard.gif

Developers could create back-end services (like audio mixing) and applications (like SimCity) that could send messages back and forth, use shared memory for efficient bitmap animation, and share services like audio mixing with other applications.
http://www.donhopkins.com/home/catalog/hyperlook/TalkGraph.gif
http://www.donhopkins.com/home/catalog/hyperlook/TalkView.gif

I developed SimCity in parallel with HyperLook, so there was a powerful synergy, SimCity drove the development of many of HyperLook's features, and the other way around.
SimCity extended HyperLook with client/server based components like the city editor, map view, graph display, which could be copied and pasted and placed anywhere in the interface.
It was great to have a demanding application like SimCity as an acid test, to shake out bugs and limitations of the platform, and prove the abilities of general purpose components like bitmap animation and audio mixing.
http://www.donhopkins.com/home/catalog/hyperlook/TalkIntro.gif
http://www.donhopkins.com/home/catalog/hyperlook/TalkNewCity.gif

HyperLook was a commercial product, with a WYSIWYG interface development environment for developers, and a freely redistributable non-editable runtime.
We released it at the same time as SimCity (using SimCity as bait to entice people to try out the included HyperLook runtime).
http://www.donhopkins.com/home/catalog/hyperlook/HyperLook.README
http://www.donhopkins.com/home/catalog/hyperlook/SimCity.README

The user interface development environment could be stripped out of the system to create a non-editable binary-encoded runtime version for shipping turn-key commercial products, which I delivered with SimCity.
But if you had the development version, you could create your own stacks, put the interface into edit mode, cut and paste user interface components around, and edit their scripts (enabling user interface vandalism).
Personally, I think all users should have a user-editable development environment, but it's important to be able to lock it down and constrain it, so casual user's can't accidentally break the system, or get confused with unnecessary details.
http://www.donhopkins.com/home/catalog/hyperlook/TalkRunTime.gif

HyperLook included a "warehouse" of pre-configured object templates, which you could cut and paste into your own stacks, and configure and script to create your own HyperLook applications, custom interfaces, interactive presentations, etc.
http://www.donhopkins.com/home/catalog/hyperlook/ButtonIdeas5.gif
http://www.donhopkins.com/home/catalog/hyperlook/Warehouse3.gif

Like HyperCard, you could copy and paste components around (including per-object customizations like scripts, properties and graphics) to construct and edit your own interfaces.
Like HyperCard, you could open up a property sheet or script editor on any object.
Unlike HyperCard, the scripts were written in object oriented PostScript. (Arthur van Hoff also wrote PdB, an object oriented C to PostScript compiler, and later went on to write the first Java compiler in Java at Sun!)
Unlike HyperCard, the property sheets were implemented as HyperLook stacks themselves, which made it easy to develop new components or customize property sheets for existing components (i.e. simplified for kids, graphically oriented for designers, advanced for developers), and the user interface editor itself was even a plug-in component that could be removed or replaced (to make a non-editable runtime, or to plug in simpler or more advanced gui editors).

HyperLook was able to implement its own property sheets as stacks, because it had a sufficiently rich set of built-in components including text and graphics editors, and stacks could be scripted to import and export properties to control settings (to convert between data types and control values, implement apply/cancel, change detection, and selecting previously edited objects).

HyperLook included a nice little PostScript graphics editor component that you could integrate into your own applications and property sheets.
For example, there is a user-customizable clock that lets you edit its face and hands (by incorporating three graphics editors in its property sheet), and there are some example clocks, pre-configured in the warehouse.
You can copy them into your own stacks, place and stretch them (since they're scalable PostScript graphics),  modify their appearance with the clock editor property sheet, and paste your original creations back into the warehouse to use again:
http://www.donhopkins.com/home/catalog/hyperlook/NeatClockProps.gif
http://www.donhopkins.com/home/catalog/hyperlook/NeatClocks.gif

Here's a cellular automata laboratory that uses the shared memory raster animation library to integrate a Toffoli/Margolis CAM-6 simulator I wrote in C with the PostScript graphics editor (so you can cut and paste PostScript graphics into live running cellular automata, and copy the cells into the graphics editor, and generate garish but seamlessly tiled screen backgrounds, and place a live bubbling cellular automata view component clipped into a lava-lamp shaped window!):
http://www.donhopkins.com/home/catalog/hyperlook/CAM.gif

The nice thing about having a standard PostScript based structured graphics format, is that the entire system supports it, so you are free to do fun stuff like making a clock face out of a cellular automata or SimCity map, copying an entire window including its user interface components as structured graphics, clipping and stretching it in in the graphics editor, and using it as a clock hand, or whatever else you can think of.

Here's a transcript and video demo of HyperLook SimCity, cellular automata,  user interface and graphics editing, and cutting and pasting graphics between various HyperLook applications.
http://www.donhopkins.com/home/catalog/simcity/hyperlook-demo.html
http://www.donhopkins.com/home/movies/HyperLookDemo.mov

It is extremely important that the base system includes a standard user-editable structured graphics format (higher level that raw PostScript, but including Encapsulated PostScript or modern equivalents like PDF, SVG, PNG, etc).
It's also essential to have a reusable structured graphics editor component, and also that all of the property sheets and applications take full advantage of it, so you can edit every visual aspect of the user interface, and copy any graphics to the clipboard with their structure intact.

HyperLook's graphics editor (HyperDraw) was not too fancy, but it was really easy to use for the stuff you want to do 90% of the time.
A bitmap image editor would have been really nice too, but that was hard to build into the NeWS server without a C client, unfortunately, so we never got around to that (although the CAM stack has some simple drawing tools for  playing with the live cellular automata pixels through shared memory).
Something like Photoshop or GIMP would be too complicated and monolithic, unless it could be stripped down and re-packaged as an light-weight, easy-to-use, plug-in component.

I've worked on and programmed in some interesting visual programming languages like Bounce (aka Body Electric, VPL's VR scripting language), SimAntics (The Sims behavior scripting language) and PSIBER (visual PostScript and NeWS debugger), and played around with others like Max/MSP/Jitter, ProGraph and KidSim (aka Cocoa, Stagecraft Creator, which was at once point actually implemented in ProGraph!).

Visual programming languages are great fun, and can be extremely productive at their finest, but they tend to be quirky, nonstandard, have more differences than similarities, and extremely weird ways of looking at the world.
There is no one best way to design the ultimate visual programming language, but there are many good ideas to be tried (and bad ideas to be avoided) from previous systems, that could be recombined in interesting ways.

There will never be one true visual programming language, just like there will never be one true text programming language, so I think the system should be designed to accommodate different languages and skill levels.
In the same way Lisp is excellent for meta-programming application specific mini-languages, I would like a similarly enlightened system for creating application specific visual programming languages (like the Eclipse Visual Editor project, but for a nice dynamic language like Python, instead of Java).

Microsoft's IScriptingEngine interface lets you plug different scripting languages like Visual Basic Script, JScript, Perl and Python into the web browser and other applications.
But COM/ActiveX/OLE Automation isn't the only way to do that.
I am quite happy that Sugar is using Python, because it makes a great common runtime and "virtual machine language," for implementing visual programming languages and integrating software modules (especially with tools like SWIG for integrating native libraries and C++ code).

My ultimate fantasy gui environment would support plugging in different script editors, with not only easy-to-use but also advanced visual programming interfaces, tailored to specific tasks and skill levels (like handling and sending events, solving constraints, processing signals, playing music, controlling robots, blinking lights, dancing bears, etc).

Python will serve well as the internal "machine language" that you compile the visual graph notations into (or interpret the visual languages directly in Python, if practical).
So kids could easily create a high-level graphical scripts like The Learning Company's "Robot Odyssey" or Maxis's "Klik-and-Play", and developers could meticulously create low-level behind-the-scenes scripts in visual languages like "Body Electric" and "Max", or text language like Python (or a hybrid of the visual and text languages -- check out how PSIBER implements a new visual interface to the existing PostScript language, and how Cycling 74's Max/Jitter integrates JavaScript with the visual programming language: JS code inside icons, JS objects on wires!):
http://en.wikipedia.org/wiki/Klik_&_Play
http://www.cycling74.com/products/jitter
http://www.cycling74.com/download/JavascriptInMax.pdf

Just imagine a visually scriptable version of SimCity, that lets you clone and edit the monster, and reprogram him to tend the forests instead of stomping on buildings!

  -Don


Some notes on alternatives to Python:

I love Python, and it's my primary scripting language of choice, but I'm not a monolinguist or strict interpretationalist, so I think some other languages are worth considering and learning from, in the long term:

Lua:

Lua is an excellent, well designed and implemented scripting language, that's extremely light weight and efficient, truly open source, and is also nicely supported by SWIG.
It's well worth considering if you're starting from a clean slate, and don't need all of Python's modules, and do care a lot about speed and size, and want to tightly integrate the scripting language with the application, without requiring the installation of a bunch of external files, resources and libraries.
It's very popular in the game industry, widely used in World of Warcraft, inspired by Lisp but without the macros, easy to learn and to read, has a pretty good JIT that works on x86 systems, and has a bunch of useful extensions (but not nearly as many as Python).
Lua has an extremely flexible roll-your-own object system (not one standard oop paradigm, but the basis for making all different kinds, but very simple, not nearly as powerful and general purpose as CLOS, not quite as elegant and minimal (nor as bloated a runtime) as Self).

SWIG supports Lua objects at a kind of low level, but can be extended to nicely support higher level objects, given a particular model.
But SWIG does not work as well out of the box with Lua as it does with Python (since Python's object system is well known and not a moving target subject to the whims of the application programmer).
The fact that Lua doesn't have Python's huge set of modules is both a blessing and a curse, but Lua actually a bit faster and much smaller than Python, vastly simpler, has a few weird but tolerable quirks (like one-based array indexing), and is conceptually cleaner and Lispier than Python in some nice ways.
According to the computer language shoot-out, it's one of the fastest and smallest interpreted scripting languages (and presumably even faster with the JIT, which is not included in that benchmark).
Lua's ratio to C's speed is 6.6, compared to Python's 7.3, which comes in right behind Lua.

http://shootout.alioth.debian.org/gp4/benchmark.php?test=all&lang=all

JavaScript:

JavaScript is a horribly designed and implemented language, although it's ubiquitous, never going away, well worth learning, and good enough to get a lot of stuff done in (Lisp with C syntax, without macros).
However, SpiderMonkey (the original JavaScript interpreter, and the one in Firefox) is extremely inefficient and wasteful of memory.
According to the computer language shoot-out, it's absolutely the worst language benchmarked, by a long shot.
SpiderMonkey's ratio to C's speed is 31, compared to Ruby's 16, which is the next slowest language.
Incredibly, its memory usage is even worse compared to other languages (ratio to C's size is 32, compared to the next worst Smalltalk VisualWork's 13), so it's not like it's making a memory-vs-speed trade-offs to be that slow.

http://shootout.alioth.debian.org/gp4/benchmark.php?test=all&lang=all

I have a hard time believing that JavaScript will ever run as fast or small as Lua, simply because Lua was well designed to be fast and small on purpose (and thus avoids inefficient pitfalls by design), and JavaScript wasn't designed at all, it just happened accidentally.
It would be better to take all the cleverness that you'd have to apply to JavaScript to make it fast, and apply it to Lua instead -- you'd be way ahead of the game, you wouldn't be fighting against but remaining compatible with bad designs, and you'd end up with a much nicer language.
Another important thing that would make me choose Python or Lua over SpiderMonkey/JavaScript, regardless of the speed and size differences, is that SWIG supports Python and Lua well, and it doesn't currently support SpiderMonkey.

However, there is an interesting recent development in JavaScript's favor:
Adobe has donated the source code for the ActionScript VM that's in the Flash 9 (AVM2)!

http://www.mozilla.org/projects/tamarin/
http://developers.slashdot.org/article.pl?sid=06/11/07/1324224
http://blogs.business2.com/utilitybelt/2006/11/web_20_bombshel.html

It turns out that AVM2 does not totally suck. (There are no benchmarks available comparing it to other JavaScript VM's, but you can easily see and feel the huge difference between Flash 8 and Flash 9).
The previous versions of Flash were based on an absolutely horrible and inefficient virtual machine, which has finally been entirely rewritten by grown-ups, and includes a JIT, so it has drastically better performance.
They have not made the entire Flash player open source, just the ActionScript byte code VM, which does not include an actual JavaScript source code to AVM2 byte code compiler.
(Although they are developing a prototype JavaScript compiler in JavaScript, it is not fully complete and tested, although it's a great ambitious idea.)
Adobe has their own ActionScript to VM byte code compiler, but it's not open source.
Of course a web browser needs a JavaScript compiler, since it downloads JavaScript in source code form.
But it also totally doesn't suck to be able to download pre-compiled binary JavaScript byte code (i.e. SWF files).

OpenLaszlo is developing its own open source JavaScript to AMV2 byte code compiler (the Legals project), so OpenLaszlo will be able to compile code that it will run in AVM2.
The Mozilla project plans on incorporating AVM2 into the browser to accelerate JavaScript, but there's still a lot of work to be done.
But I think that AVM2 is a great long term strategy to solve the performance problems of SpiderMonkey in the web browser, that will dovetail with OpenLaszlo, and be useful for developing efficient AJAX applications, using a completely open source software stack.

http://www.openlaszlo.org




Here are some references to work I've done in the past, describing some ideas that might be applied to Sugar.

NeWS is James Gosling's "Network extensible Window System", which was based on a multithreaded, networked, object oriented dialect of PostScript.
I developed pie menus for NeWS at the UMCP HCIL, worked on the Open Look NeWS Toolkit at Sun, and various NeWS tools and applications for other companies.
http://www.donhopkins.com/drupal/node/92

I developed lots of other fun stuff with NeWS, including various implementations of pie menus and tab windows:
http://www.donhopkins.com/drupal/node/92
http://www.piemenu.com/DDJPieMenuArticle.html
http://www.piemenu.com/

The NeWS Toolkit was an Open Look user interface toolkit written entirely in NeWS PostScript, which I helped develop at Sun, and integrated with HyperLook, and used to develop pie menus and tab windows.
http://www.donhopkins.com/home/catalog/images/tnt.gif

Pizza Tool was a graphical Open Look gui for editing and ordering pizzas via FAX, that I wrote as a programming demo for The NeWS Toolkit:
http://www.donhopkins.com/home/catalog/images/pizzatool.gif

The HyperTIES hypermedia browser, with pie menus and "applets" scripted in PostScript (for Ben Shneiderman at the UMCP HCIL):
http://donhopkins.com/drupal/taxonomy/term/61

Emacs "thin wire" NeWS display driver for UniPress Emacs (and later Gnu Emacs), with pie menus and multiple tab windows, and an authoring tool for HyperTIES:
http://donhopkins.com/drupal/node/101

HyperLook (aka HyperNeWS and GoodNeWS) was a HyperCard-like user interface development environment for the NeWS window system.
I worked on HyperLook with Arthur van Hoff at the Turing Institute, and used it for various applications.
http://www.donhopkins.com/home/catalog/hyperlook/

SimCity is a constructive simulation game from Maxis.
I ported SimCity to HyperLook and X11, and designed a multi player scriptable user interface using TCL/Tk.
http://www.donhopkins.com/home/catalog/simcity/index.html

PSIBER is a visual interface to PostScript and interactive debugger for NeWS.
I developed it at the UMCP HCIL and Grasshopper Group.
http://www.donhopkins.com/drupal/node/97

Bounce (aka Body Electric) is a real time data flow visual programming language, developed at VPL by Chuck Blanchard and used by Jaron Lanier and others for integrating midi and various i/o devices, driving 3d rendering engines, scripting VR, scientific, training and artistic simulations.
I programmed multimedia and character simulations in Bounce, ported it to PowerPC, developed its user interface, a COM plug-in and type extension system, and multimedia support, with David Levitt at Levity and Interval Research Corporation.
http://www.donhopkins.com/home/catalog/lang/bounce/bounce.html

SimAntics is the visual programming language for scripting AI and behavior in The Sims, pie menus (aka marking menus, compass menus) are an efficient Fitts'-law-friendly menu selection technique.
I programmed in SimAntics, ported it from the Mac to Windows, and developed its user interface (Edith) and primitives (character animation, etc), with Will Wright at Maxis:
http://www.donhopkins.com/drupal/taxonomy/term/35

The Dumbold Voting Machine is an educational agit-prop plug-in for The Sims, that I programmed in SimAntics to educate people about real voting machine problems -- check out the "high concept" stuff at the end of the page:
It's meant to stimulate discussion, illustrate how computer programming is free speech, and why all election software should be open source and publicly inspectable.
http://www.dumbold.com/dumbold

This is a movie that demonstrates the character animation system, pie menus, direct manipulation object placement and architectural editing tools that I developed for The Sims, as well as an in-depth demo of SimAntics visual programming with the Edith tool (stepping through the Satan Generator code):
http://www.donhopkins.com/home/movies/TheSimsPieMenus.mov






Begin forwarded message:

---
