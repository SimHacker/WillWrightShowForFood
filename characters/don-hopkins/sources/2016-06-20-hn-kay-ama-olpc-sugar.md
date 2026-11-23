# HN — Don on Sugar and OLPC, inside Alan Kay's AMA (20–23 Jun 2016)

Two comments on [Alan Kay's AMA](https://news.ycombinator.com/item?id=11939851). Kay did not reply. The AMA map is [`../../alan-kay/sources/2016-06-20-hn-ama.md`](../../alan-kay/sources/2016-06-20-hn-ama.md). The 2006 design notes this comment looks back on: [`2006-12-28-sugar-hyperlook-simcity-ideas.md`](2006-12-28-sugar-hyperlook-simcity-ideas.md).

## The ask ([11939851](https://news.ycombinator.com/item?id=11939851) thread, Don's parent comment)

icarito asked whether Sugar was appropriate for the Children's Machine, given OLPC's results. Don widened it: successes and failures of OLPC, what openings and obstacles made them, and where to go next. He had studied the Sugar design and source, written activities and widgets, wrapped the X11/Tcl/Tk SimCity as a thin Python activity, worked on e-book power, and written pie menus in Python/GTK/Cairo/Pango.

His frame is the Stone Soup story. Too many interdependent hardware and software problems to hit the original goals, and no way to hit them without tackling all of them. A lot of good came from trying. One result: Electronic Arts relicensed SimCity under GPLv3 so it could ship on the XO.

Power cut across everything. Mary Lou Jepsen's hybrid display and Mitch Bradley's Open Firmware were the designs he calls far ahead of their time. Red Hat's tickless kernel batched periodic interrupts so the CPU could stay down. John Gilmore's line, as Don reports it: OLPC lit a fire under laptop vendors, and the Chromebook is one consequence. The crank was silly.

Sugar's problem, in this comment: too many dependencies, all of them required to be perfect, and a revolutionary UI still sitting on X11, Python, and GTK. He loves Python. He thinks the moment called for the whole UI in JavaScript and HTML. Plugging xulrunner into Python through XPCOM and GTK objects was too complex and too expensive in power and memory. Cairo moved down into the browser anyway. No 3D, no OpenGL or WebGL, which game developers wanted and the power budget forbade.

Hippo, Sugar's canvas, was a Python/GTK-object mix on top of Cairo and Pango. Learning GTK objects in order to draw a circle was the wrong tax. He files Hippo with the other universal object-graphics APIs that did not win: PEX, PHIGS, GKS.

SimCity on Sugar launched the existing X11/Tcl/Tk binary as another process and passed a few messages. Scratch and Etoys went in the same way. The plan was to pull the UI off, talk to a C++ core through SWIG, then rewrite the UI in Sugar. What actually got built, independent of Sugar: the UI stripped, the core as C++, a pure GTK/Cairo interface in Python, and scriptable agents. The examples he names: a Pac-Man that follows the roads toward traffic and eats cars, and a Church of Pac-Mania whose worshippers make traffic and get eaten. That same Python core became a SimCity web server with a Flash client, which he says was a better multiplayer architecture than Sugar's collaboration APIs.

The line he wants kept: choose goals so that when they land on what is actually possible, you have still moved.

Links as posted: [SimCity on the OLPC wiki](http://wiki.laptop.org/go/SimCity) · [pie menus](http://www.donhopkins.com/drupal/node/128) · [Stone Soup](https://en.wikipedia.org/wiki/Stone_Soup) · the EA thread and the tickless-kernel note are the URLs in the comment (HAR2009 transcript, Red Hat power-management docs) · [Sugar notes](http://www.donhopkins.com/drupal/node/129) · [Pac-Man agent](https://github.com/SimHacker/micropolis/blob/master/MicropolisCore/src/pyMicropolis/micropolisEngine/micropolisrobot.py) and the church plugin beside it in that tree. (Paths may have moved; the repo is MicropolisCore.)

## The follow-up (23 Jun 2016)

icarito had found the port unplayable on the XO and said he wanted Kay on Sugar, not Don's port. Don asked what made it unplayable, said to turn disasters off, and asked that Sugar not be blamed for the look: the UI was a 1993 Tcl/Tk skin imitating Motif. Steve Strassmann's line, which Don quotes: Motif's style manual is the same one as the runway at Moscow International Airport. [Demo on the XO](https://www.youtube.com/watch?v=EpKhh10K-j0). The X11 multiplayer mode was unplayable for a different reason — xauth on the command line — and he removed it from the OLPC build. David Chapman's MIT-MAGIC-COOKIE-1 tutorial is not for children. He also disabled the Frob-O-Matic Dynamic Zone Finder, a prank for Ben Shneiderman. [Unix-Haters X chapter](http://www.art.net/~hopkins/Don/unix-haters/x-windows/disaster.html) · [multiplayer video](https://www.youtube.com/watch?v=_fVl4dGwUrA) · [Frob-O-Matic](https://www.youtube.com/watch?v=5X8XY9430fM).

## Rooms

[`../../walter-bender/`](../../walter-bender/) · [`../../mitch-bradley/`](../../mitch-bradley/) · [`../../alan-kay/`](../../alan-kay/) · [`../../seymour-papert/`](../../seymour-papert/) · [`../../ben-shneiderman/`](../../ben-shneiderman/) (the Frob-O-Matic tribute) · [`../../jaron-lanier/sources/2007-01-02-olpc-rebounce-keith-mcmillen.md`](../../jaron-lanier/sources/2007-01-02-olpc-rebounce-keith-mcmillen.md)
