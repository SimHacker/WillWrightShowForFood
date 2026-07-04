# Simcity For Olpc -- Introducing The Players

*3 messages — verbatim from lots-of-chat.txt scoop.*

## 1 · John Gilmore <gnu@toad.com>

        **Date:** 20 December 2006 at 00:31:01 GMT+1  
        **Subject:** SimCity for OLPC -- introducing the players  
        **To:** jg@laptop.org

        I've cc'd all the relevant parties (and a few more).

Jim Getty <jg@laptop.org>, VP of Software Engineering, said:
I forwarded your mail to Walter when I got it; Walter is traveling, and
by his parsimonious mail it is clear he's not in communications much of
the time.

Thanks!  Walter Bender <walter@media.mit.edu>, OLPC President,
Software and Content, responded today from Dubai to Mitch's copy of
my message, and he'd be very happy to see SimCity ship on the OLPC:

This somehow slipped through through the cracks. It would of course be great
to have Sim City on the laptop. (I actually always preferred the earlier
versions myself, so that should make it easier. The only challenge is
getting it into shape for Linux. That will take some work from someone, but
I am certain we could get someone in the community interested. I am in Dubai
en route to Islamabad. Back just before Christmas. What is the best way to
follow up?

Don Hopkins <dhopkins@donhopkins.com>, consultant, is the author of
the SimCity Unix port, confidante of Will Wright who founded Maxis,
and an old friend of mine.  He's been hacking this code since the
1980s.  He's pushing the SimCity for OLPC project along, both
technically and otherwise.  A few weeks ago he unearthed the source
code from his old backup tapes.  Then he ported it to FC6.  Over the
weekend he found the contracts (that Maxis hasn't yet found its own
copies of) which provide Maxis with clear title to his port of the
software that we're asking them free up.  He wants to do the work
to prepare it for OLPC.

Chuck Normann <CNormann@ea.com> is the point man for Electronic Arts,
which owns the SimCity code (it bought Maxis many years ago).  He's
poking around in the EA bureacracy to find out how easy or hard it
will be to relicense the code under the GNU General Public License.

Doreen Nelson <doreennelson@earthlink.net>, Professor of Education at
Cal Poly Pomona, http://www.csupomona.edu/~dnelson/doreen.html , wrote
the SimCity curriculum guides for Maxis, which we hope can be freed up
along with the software.  The NY Times called her "one of the thirty
most innovative educators in the USA."

I've asked Don to sign up for the OLPC developers' program and to ask
Jim for a laptop.  Don last ported the user interface to 1-bit and
8-bit Unix framebuffers, using TCL/TK and multiple windows.  (Before
that, Don made it run on NeWS using the HyperLook toolkit; before
that, it was Maxis' Macintosh version of SimCity.)  Don already has
the code running on FC6, under VMware on his own hardware.  It will
need some work to run cleanly on the OLPC screen and in Sugar, and to
look good in both mono and color modes.  (E.g. currently it decides at
startup whether it's running monochrome or color, and it doesn't know
about greyscale or contrast.)  Once that's working, he then wants to rip
out the TCL scripting and install Python; he's got years of experience
in doing just this sort of stuff, and he put TCL into it in the first
place.  This will make it integrate better with OLPC, reduce its disk
and memory footprint, and make it easier for the kids to hack on.

The game today allows multiple players to interact, including text
chat and shared overlay "chalk" sketching; but it will also have to
get hooked in to the OLPC's chat, proximity and friendship systems.
(This might require that Don find somebody else in the Bay Area who
has a laptop, to make sure it works on the mesh network.  And/or that
the OLPC network system be configurable to associate with other OLPCs
at great distances over the Internet.)

Don has hacked a lot of great software over the years; his willingness
to write & maintain great free code is only limited by his need to
make a living.  He's doing consulting to make ends meet.  I'm willing
to subsidize his work on OLPC SimCity -- once Maxis decides whether to
free up the code.

	John Gilmore

PS:  When I last saw SimCity on Unix, it also included a nice
interactive graphical cellular automata system (just because Don liked
it).  This fills the screen with beautiful evolving pictures,
interactively, using an invisible (pop-up) interface.  I hope that can
also make it into the OLPC, both for beauty and for the kids to learn from.

PPS: Mitch Bradley is cc'd because he's working for OLPC and he also
employed Don many years ago at Sun -- to plug the FORTH
interpreter into a CAD package, as I recall!



Begin forwarded message:

---

## 2 · John Gilmore [mailto:gnu@toad.com]

        **Date:**   
        **Subject:** SimCity for OLPC -- introducing the players  
        **To:** jg@laptop.org

        Normann, Charles; Doreen Nelson
Subject: SimCity for OLPC -- introducing the players

I've cc'd all the relevant parties (and a few more).

Jim Getty <jg@laptop.org>, VP of Software Engineering, said:
I forwarded your mail to Walter when I got it; Walter is traveling,
and
by his parsimonious mail it is clear he's not in communications much
of
the time.

Thanks!  Walter Bender <walter@media.mit.edu>, OLPC President,
Software and Content, responded today from Dubai to Mitch's copy of
my message, and he'd be very happy to see SimCity ship on the OLPC:

This somehow slipped through through the cracks. It would of course be
great
to have Sim City on the laptop. (I actually always preferred the
earlier
versions myself, so that should make it easier. The only challenge is
getting it into shape for Linux. That will take some work from
someone, but
I am certain we could get someone in the community interested. I am in
Dubai
en route to Islamabad. Back just before Christmas. What is the best
way to
follow up?

Don Hopkins <dhopkins@donhopkins.com>, consultant, is the author of
the SimCity Unix port, confidante of Will Wright who founded Maxis,
and an old friend of mine.  He's been hacking this code since the
1980s.  He's pushing the SimCity for OLPC project along, both
technically and otherwise.  A few weeks ago he unearthed the source
code from his old backup tapes.  Then he ported it to FC6.  Over the
weekend he found the contracts (that Maxis hasn't yet found its own
copies of) which provide Maxis with clear title to his port of the
software that we're asking them free up.  He wants to do the work
to prepare it for OLPC.

Chuck Normann <CNormann@ea.com> is the point man for Electronic Arts,
which owns the SimCity code (it bought Maxis many years ago).  He's
poking around in the EA bureacracy to find out how easy or hard it
will be to relicense the code under the GNU General Public License.

Doreen Nelson <doreennelson@earthlink.net>, Professor of Education at
Cal Poly Pomona, http://www.csupomona.edu/~dnelson/doreen.html , wrote
the SimCity curriculum guides for Maxis, which we hope can be freed up
along with the software.  The NY Times called her "one of the thirty
most innovative educators in the USA."

I've asked Don to sign up for the OLPC developers' program and to ask
Jim for a laptop.  Don last ported the user interface to 1-bit and
8-bit Unix framebuffers, using TCL/TK and multiple windows.  (Before
that, Don made it run on NeWS using the HyperLook toolkit; before
that, it was Maxis' Macintosh version of SimCity.)  Don already has
the code running on FC6, under VMware on his own hardware.  It will
need some work to run cleanly on the OLPC screen and in Sugar, and to
look good in both mono and color modes.  (E.g. currently it decides at
startup whether it's running monochrome or color, and it doesn't know
about greyscale or contrast.)  Once that's working, he then wants to rip
out the TCL scripting and install Python; he's got years of experience
in doing just this sort of stuff, and he put TCL into it in the first
place.  This will make it integrate better with OLPC, reduce its disk
and memory footprint, and make it easier for the kids to hack on.

The game today allows multiple players to interact, including text
chat and shared overlay "chalk" sketching; but it will also have to
get hooked in to the OLPC's chat, proximity and friendship systems.
(This might require that Don find somebody else in the Bay Area who
has a laptop, to make sure it works on the mesh network.  And/or that
the OLPC network system be configurable to associate with other OLPCs
at great distances over the Internet.)

Don has hacked a lot of great software over the years; his willingness
to write & maintain great free code is only limited by his need to
make a living.  He's doing consulting to make ends meet.  I'm willing
to subsidize his work on OLPC SimCity -- once Maxis decides whether to
free up the code.

	John Gilmore

PS:  When I last saw SimCity on Unix, it also included a nice
interactive graphical cellular automata system (just because Don liked
it).  This fills the screen with beautiful evolving pictures,
interactively, using an invisible (pop-up) interface.  I hope that can
also make it into the OLPC, both for beauty and for the kids to learn
from.

PPS: Mitch Bradley is cc'd because he's working for OLPC and he also
employed Don many years ago at Sun -- to plug the FORTH
interpreter into a CAD package, as I recall!




Begin forwarded message:

---

## 3 · Don Hopkins <dhopkins@DonHopkins.com>

        **Date:** 21 December 2006 at 10:07:25 GMT+1  
        **Subject:** Re: SimCity for OLPC -- introducing the players  
        **To:** walter@laptop.org

        Since SimCity already runs on FC6, I think we can have a playable, releasable, but not completely integrated version of SimCity running on the OLPC pretty soon, and then start addressing other issues in order of importance and complexity.

Here are some tasks in order of complexity, from trivial to blue sky: fonts, sounds, screen formats, configuration and build system, internationalization, help, documentation and courseware, multi player collaboration, code refactoring, SWIG interface, Python scripting, Sugar integration, user interface components, interface customization, mesh networking, chatting, journaling and storytelling, image and data import/export and printing, custom graphics, user scripting and extensibility, user defined zones, sprites, disasters, tools and scenarios, visual programming, programming by example, cellular automata and agent simulation laboratory (think SimCity meets Robot Odyssey/Click and Play/KidSim/SimAntics/EToys/AgentSheets/LabView/Max/Body Electric).

I think SimCity will be a wonderful driving force and proving application for the Sugar user interface, and inspire other people to give it a try and contribute to its development.
It will be fun to integrate and extend SimCity to showcase Sugar's original user interface and advanced features like grid networking and journaling.
And I hope opening up SimCity to scripting will be a great way to make kids interested in pressing the "View Source" key and learning to program!

While I was first porting SimCity for Unix, I was also developing the NeWS HyperLook user interface toolkit at the Turing Institute, and there was a wonderful synergy between the SimCity app and HyperLook gui.
In the early 90's, SimCity played an important role in driving the development of important HyperLook features (like the client/server library, sound mixer server and shared memory animation library) which were useful to other programs.
We used SimCity to prove HyperLook's abilities and showcase its unique features (like zooming images, editing and printing PostScript graphics, etc.)

Real time games make extreme demands of the user interface toolkit than ordinary desktop applications usually don't stress, so games are great for driving the development of fun efficient user interfaces.
For example, SimCity forced me to develop pie menus, a sound mixer server, a shared memory image animation library, and flesh out TCL/Tk's support for multiple displays.
And SimCity was a fun incentive to get people to download and try out the HyperLook runtime, in the same way I think it will get people interesting in trying Sugar and learning about the OLPC project.

  -Don





Begin forwarded message:

---
