# Application For Olpc Developer'S Program, For Developing Simcity

*1 messages — verbatim from lots-of-chat.txt scoop.*

## 1 · Don Hopkins <dhopkins@DonHopkins.com>

        **Date:** 21 December 2006 at 11:21:36 GMT+1  
        **Subject:** Application for OLPC developer's program, for developing SimCity  
        **To:** developer@laptop.org

        Hello! I'd like to sign up for the OLPC developer's program, please. 
I've read and understand the wiki page on the developer program:
http://wiki.laptop.org/go/Developer_program

Here are my answers, and some more information:

Name: Don Hopkins
Email address: dhopkins@DonHopkins.com
Employer: self
Shopping address and instructions:
Don Hopkins
1428 Neilson St.
Berkeley, CA 94702
USA
510 418 4968

Description of your plans for the machines(s):
Port SimCity to OLPC and integrate with Sugar. 

Quantity of machines desired:
1 to start with, but eventually would like to test SimCity multi player user interface and networking with another laptop or other people's laptops. 

Description of you experience, both with hardware and software:
Hardware experience: 
  Mainframes: DEC-10 (ITS, Tenex), DEC-20 (Tops-20/Twenex), IBM (VM/CMS) mainframe; 
  Minis: VAX (Unix, VMS), Xerox 8010 Dandelion (Star/Viewpoint/XDE) Lisp Machine (LMI, Genera); 
  Workstations: Sun, SGI, HP, DEC, NCD; 
  Micros: Apple ][, TRS-80, C64, Mac (MacOS, OS/X), PC (DOS/Windows/Linux); 
  Handhelds: Palm, PocketPC, J2ME phone, embedded systems. 
Software experience:

  Assembly languages: 6502, 6809, Z-80, 68k, x86, SPARC, PowerPC, StrongARM, various VMs, others. 

  Text programming languages: Python, OpenLaszlo, JavaScript, Forth, Pascal, Basic, Logo, Lisp, Scheme, PostScript, ScriptX, MaxScript, C, C++, Java, Lua, PHP, Perl, SWIG, XML technologies, others. 

  Visual programming languages: Hookup, Body Electric/Bounce, Max/MSP, SimAntics (The Sims), DirectShow Filter Graphs, PSIBER Graphical PostScript Interface. 

  Application programming: Emacs (Unipress, Gnu), HyperTIES Hypermedia Browser, Pie Menu Window Managers (X10, X11 and NeWS), PSIBER (NeWS visual PostScript programming environment), PizzaTool, HyperLook user interface environment, SimCity (NeWS and multi player X11), Body Electric/Bounce real time visual programming language, The Sims (character animation, user interface, visual programming, tools), SimShow, Transmogrifier  and RugOMatic user created content tools, Stupid Fun Club Robot Brain, Will Wright's Talking Toy Simulation, Laszlo Mail rich web application, SimFaux (Fox News interactive TV parody, streaming video, character simulation), Gnu Radio (SWIG wrappers for Python), Cellular Automata, 3D Studio Max plug-ins, AfterEffects plug-ins, real time video processing, adaptive background removal, video feedback, motion tracking, interactive art, web servers, Zope, Plone, TurboGears, NutritionQuest Project Alive! Email Intervention Program, Online Questionnaire System, Interactive Trade-Off Slider, Nutritional Analysis Software, others. 

  Library Programming: The NeWS Toolkit (OpenLook), HyperLook gui editor, sound mixer, client/server library, shared memory animation library, pie menus and tab windows for many toolkits, TCL/Tk extensions, various Python modules, Festival/Flite/Cepstral/Swift speech synthesizer, Microsoft Speech API, ActiveX components, Sims character animation system, DirectX, OpenGL, Linux and X11 APIs, Apache, MySQL, Tomcat Java Server, PHP Libraries and Classes, OpenLaszlo user interface and video streaming components and applications. 

Here's a message describing the project.

    -Don

John Gilmore wrote:
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
