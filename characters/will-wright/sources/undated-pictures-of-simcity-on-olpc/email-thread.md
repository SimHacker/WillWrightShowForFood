# Pictures Of Simcity On Olpc

*3 messages — verbatim from lots-of-chat.txt scoop.*

## 1 · Don Hopkins <dhopkins@DonHopkins.com>

        **Date:** 29 December 2006 at 16:13:34 GMT+1  
        **Subject:** Pictures of SimCity on OLPC  
        **To:** Lindsay Petrillose <lindsayp@laptop.org>

        Thanks for sending me the OLPC laptop! It's very cute, and works well. 

Here are some pictures of SimCity displaying on the X11 OLPC screen, running over the wireless network from my laptop running SimCity under Fedore Core in VMWare. 
The screen looks really great up close, but my webcam wouldn't focus on it close enough to show the detail of the hires mono and lower res color. 
It runs very smoothly and is quite playable over the net, even without the acceleration of shared memory that you'd get when running it locally. 
(It helps that the SimCity code was originally written to run fast on a C64!)

I have removed all the licensing key locking code from SimCity, so it no longer has to be unlocked with a key to play for more than a few minutes.
(Although you can still trigger the cellular automata city melting effect by selecting "Clipper" from the disasters menu). 
And I fixed the fonts so it works with the fonts installed on the OLPC X server. 
I had to kill the OLPC's funky Sugar window manager and run plain old twm to manage the multiple windows.

Actually running SimCity on the OLCP locally should be straightforward, now that it displays correctly over the net. 
One important task to do, in order to make something that we could give to other people to demo while it's running Sugar, would be to address the multiple window management issue somehow. 
And it would also be nice to fix up the fonts and support the sound mixer so it makes cool sound effects (it's not the real thing, without chopper one reporting heavy traffic all the time).

I'd like to know more about how Sugar's window manager works, please -- and if there's a way I can run a multi window application that overrides the Sugar window manager's making each window full screen and overlapping. 
Maybe I can set OverrideRedirect from Tk, or something like that, and manually lay the windows out in useful but fixed positions? 
But hopefully there's a more cooperative way to achieve the desired results. 
All my old X11 manuals got waterlogged and rotted after my garage flooded, and I've forgotten the nuances of ICCCM, so I'm just kind of winging it. 

In the longer term I would like to ditch the ancient TCL/Tk stuff and rewrite the user interface and scripting engine using Python, GTK and Cairo, integrating it into Sugar and taking advantage of all the cool features like journaling, the mesh network and messaging system. 

    -Don


Lindsay Petrillose wrote:

Dear Don, 

An OLPC B1 machine was sent to you this afternoon.  You should receive it tomorrow at the address you provided.  The DHL tracking# 19400248055, for your records. 

Additionally, I have attached B1 Release Notes that were put together by our technical team that can assist you with getting your machine up and running.   

B1 Release Notes:  http://wiki.laptop.org/go/BTest_Software_Notes 

Also, at this time we are exploring a potential power issue.  Until further testing and information is provided, please do the following: 

- Unplug the A/C adapter whenever you insert or remove the battery. 

If you have any questions or concerns, please feel free to contact Walter Bender at walter@laptop.org or Jim Gettys at jg@laptop.org. 

Thank you again and we look forward to your comments. 

Regards, 
Lindsay Petrillose 



Lindsay Petrillose
Special Assistant for International Affairs
One Laptop per Child
One Cambridge Center, 10th floor
Cambridge, MA 02142
www.laptop.org

olpc-simcity-01.jpgolpc-simcity-02.jpgolpc-simcity-03.jpgolpc-simcity-04.jpgolpc-simcity-05.jpg


Begin forwarded message:

---

## 2 · Matthew Allum <mallum@openedhand.com>

        **Date:** 30 December 2006 at 13:32:25 GMT+1  
        **Subject:** Re: Pictures of SimCity on OLPC  
        **To:** jg@laptop.org

        Hi;

On Fri, 2006-12-29 at 10:35 -0500, Jim Gettys wrote:

I'd like to know more about how Sugar's window manager works, please
-- and if there's a way I can run a multi window application that
overrides the Sugar window manager's making each window full screen
and overlapping. 
Maybe I can set OverrideRedirect from Tk, or something like that, and
manually lay the windows out in useful but fixed positions? 
But hopefully there's a more cooperative way to achieve the desired
results. 
All my old X11 manuals got waterlogged and rotted after my garage
flooded, and I've forgotten the nuances of ICCCM, so I'm just kind of
winging it.

There have been significant additions to the ICCCM: these are
discussed/documented on freedesktop.org.

Sugar is using Matchbox, which is a single window at a time window
manager.  Short of being anti-social and using override redirect on all
your windows I don't know if there is any other provision in Matchbox
for multiple windows.

Matthew Allum is Matchbox's author, so I've cc'ed him on this mail.


Matchbox is a restrictive stack based WM with only one 'app' window
visible at any time. That said however you can of course present
multiple windows at once just by making 'sub' windows dialogs transient
to the main application. Fullscreen windows are supported by the EWMH
fullscreen state hint [1]. You shouldn't have to rely on override
redirects. 

AFAIK sim city has been ported to pocketpc and palm which also feature
stack based WM's - less sophisticated and flexible than MB. Taking a
route like these ports do with the sim city UI should work well.

Do let me know if you need any more specific details, always happy to
help.

Many thanks;

 -- Matthew

[1] http://standards.freedesktop.org/wm-spec/1.3/ar01s05.html#id2522991





Begin forwarded message:

---

## 3 · Don Hopkins <dhopkins@DonHopkins.com>

        **Date:** 31 December 2006 at 12:12:13 GMT+1  
        **Subject:** Re: Pictures of SimCity on OLPC  
        **To:** Matthew Allum <mallum@openedhand.com>

        Thanks for the advice on window management and Sugar integration!

I've got SimCity running on the OLPC itself now (if you turn off the window manager), and I've started reworking the TCL/Tk window code to only use one top level window instead of multiple overlapping windows, so it will tile the maps and dialogs inside of the main window, and use transient windows for popups.
A fullscreen tiled sub-window approach will simplify the widow management a lot, although I'll have to disable the ability to create multiple maps and editors for the time being, until we figure out a way to let the user manage them from within the Tk window.
I'm making my top level window the same size as the screen -- is that just as good as setting the fullscreen flag, or would it be better to actually tell the window manager that I mean the window to be full screen?
Since I'm using a version of TCL/Tk from 1992 (Tk 2.3), it probably doesn't support the EWMH stuff, but I could hack it in.
Fortunately Tk 2.3 does support transient windows, at least!

First I'd like to first make a solid version of SimCity for the OLPC that uses the old TCL/Tk stuff, and integrates with Sugar as a full screen activity, without rewriting too much stuff or adding any new features.
That will make it possible for regular people to demonstrate and play with it soon.

Then I'd like to dump TCL/Tk and rewrite it to use Python, GTK and Cairo, then start taking advantage of all the nice stuff in Sugar.
I think SimCity will be a great way to showcase a lot of the cool features and educational aims of Sugar.

One of the nice things to come out of that effort will be a pie menu widget for GTK.
Somebody's already written a GTK pie menu, but it's kind of old, so I could probably use it as a basis for writing a GTK pie menu that uses Cairo for rendering.

I've been looking at the dbus stuff, and that looks like it will be great for making a multi player version of SimCity, that will operate differently than the current multi player mode (where one X11 client opens multiple X11 connections to different servers).
It would be best for all players to run their own local X11 SimCity clients, and those clients can communicate with each other and synchronize at a higher level than X11, using dbus.

And maybe a wee little http server for publishing cities, html interfaces, web services and ajax guis, so you can access and control the simulation over the web, as well as through the graphical desktop interface.
That's easier (and more fun) than falling off a log, with Python!

  -Don


Matthew Allum wrote:
Hi;

On Fri, 2006-12-29 at 10:35 -0500, Jim Gettys wrote:

I'd like to know more about how Sugar's window manager works, please
-- and if there's a way I can run a multi window application that
overrides the Sugar window manager's making each window full screen
and overlapping. Maybe I can set OverrideRedirect from Tk, or something like that, and
manually lay the windows out in useful but fixed positions? But hopefully there's a more cooperative way to achieve the desired
results. All my old X11 manuals got waterlogged and rotted after my garage
flooded, and I've forgotten the nuances of ICCCM, so I'm just kind of
winging it.       
There have been significant additions to the ICCCM: these are
discussed/documented on freedesktop.org.

Sugar is using Matchbox, which is a single window at a time window
manager.  Short of being anti-social and using override redirect on all
your windows I don't know if there is any other provision in Matchbox
for multiple windows.

Matthew Allum is Matchbox's author, so I've cc'ed him on this mail.



Matchbox is a restrictive stack based WM with only one 'app' window
visible at any time. That said however you can of course present
multiple windows at once just by making 'sub' windows dialogs transient
to the main application. Fullscreen windows are supported by the EWMH
fullscreen state hint [1]. You shouldn't have to rely on override
redirects. 
AFAIK sim city has been ported to pocketpc and palm which also feature
stack based WM's - less sophisticated and flexible than MB. Taking a
route like these ports do with the sim city UI should work well.

Do let me know if you need any more specific details, always happy to
help.

Many thanks;

 -- Matthew

[1] http://standards.freedesktop.org/wm-spec/1.3/ar01s05.html#id2522991




Well t hat is to the end of 2006 what an  excitin g year! I moved to amstterdam the next year and then simcity was finally released. 



Begin forwarded message:

---
