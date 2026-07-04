# Simcity For Olpc -- Introducing The Players

*1 messages — verbatim from lots-of-chat.txt scoop.*

## 1 · Jim Gettys <jg@laptop.org>

        **Date:** 21 December 2006 at 17:46:11 GMT+1  
        **Subject:** Re: SimCity for OLPC -- introducing the players  
        **To:** Don Hopkins <dhopkins@donhopkins.com>

        Cool.

Sugar is based on the GTK+/Pango/ATK/Cairo/X Window System stack of
technology, in concert with Python and Avahi (for presense).  There are
very serious efforts on increasing performance on each of these
components already underway, and real applications to drive that
performance work is very welcome.  You'll find Pango and Cairo possibly
the most directly useful to you (having not played SimCity, I have no
idea how much "conventional" gui widgets like menus, dialog boxes, etc,
are used, but I surmise by your comments the answer is "not much".)

You should look at Pango (based on top of Cairo) seriously for layout of
internationalized text; that is where much of the "hard stuff" for
serious internationalization is located, and does not require
significant use of GTK+ to use.

Cairo, I think you'll find very nice: it gives you a Postscript like 
API with a Porter/Duff alpha compositing imaging model (e.g. like PDF
1.4).  It does as well or better at quality 2D graphics as anything else
on the planet.  (see www.cairographics.org).  It also has back ends for
multiple platforms: Windows/Mac/Postscript/PDF/X Window System/OpenGL.
This ain't your X Window System of the 1980's with lame graphics anymore
(though unfortunately OpenGL is beyond us this generation).

Both Pango and Cairo have recently seen serious speedups over the last
few months: these are being pulled into our builds right now as they
land, even in advance of stable releases, and the whole Pango/Cairo/X
stack is open for performance work, and everyone in all of these
projects are now seriously engaged on making this technology stack run
faster and smaller; since we're pretty much "feature complete" relative
to Windows or Mac, everyone's eyes are turning to performance, partially
spurred by projects like ours, and embedded uses on platforms like the
Nokia 770. If you run into particular performance problems, I think
you'll find a ready and willing community of developers to help get what
SimCity needs running really fast, with very short turnaround on
performance improvements, and lots of advice about what will or will not
be able to be very fast.

If it would help to have a discussion with Chris Blizzard and myself to
go through the whole stack and your options in details, please let us
know.
                                       Best Regards,
                                              - Jim


On Thu, 2006-12-21 at 01:07 -0800, Don Hopkins wrote:
Since SimCity already runs on FC6, I think we can have a playable, 
releasable, but not completely integrated version of SimCity running on 
the OLPC pretty soon, and then start addressing other issues in order of 
importance and complexity.

Here are some tasks in order of complexity, from trivial to blue sky: 
fonts, sounds, screen formats, configuration and build system, 
internationalization, help, documentation and courseware, multi player 
collaboration, code refactoring, SWIG interface, Python scripting, Sugar 
integration, user interface components, interface customization, mesh 
networking, chatting, journaling and storytelling, image and data 
import/export and printing, custom graphics, user scripting and 
extensibility, user defined zones, sprites, disasters, tools and 
scenarios, visual programming, programming by example, cellular automata 
and agent simulation laboratory (think SimCity meets Robot Odyssey/Click 
and Play/KidSim/SimAntics/EToys/AgentSheets/LabView/Max/Body Electric).

I think SimCity will be a wonderful driving force and proving 
application for the Sugar user interface, and inspire other people to 
give it a try and contribute to its development.
It will be fun to integrate and extend SimCity to showcase Sugar's 
original user interface and advanced features like grid networking and 
journaling.
And I hope opening up SimCity to scripting will be a great way to make 
kids interested in pressing the "View Source" key and learning to program!

While I was first porting SimCity for Unix, I was also developing the 
NeWS HyperLook user interface toolkit at the Turing Institute, and there 
was a wonderful synergy between the SimCity app and HyperLook gui.
In the early 90's, SimCity played an important role in driving the 
development of important HyperLook features (like the client/server 
library, sound mixer server and shared memory animation library) which 
were useful to other programs.
We used SimCity to prove HyperLook's abilities and showcase its unique 
features (like zooming images, editing and printing PostScript graphics, 
etc.)

Real time games make extreme demands of the user interface toolkit than 
ordinary desktop applications usually don't stress, so games are great 
for driving the development of fun efficient user interfaces.
For example, SimCity forced me to develop pie menus, a sound mixer 
server, a shared memory image animation library, and flesh out TCL/Tk's 
support for multiple displays.
And SimCity was a fun incentive to get people to download and try out 
the HyperLook runtime, in the same way I think it will get people 
interesting in trying Sugar and learning about the OLPC project.

   -Don

-- 
Jim Gettys
One Laptop Per Child




Begin forwarded message:

---
