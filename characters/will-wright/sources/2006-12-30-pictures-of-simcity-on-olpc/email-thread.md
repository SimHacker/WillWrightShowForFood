# Pictures of SimCity on OLPC

*29–31 December 2006 — first demo on the B1 laptop.*

## 1 · Don Hopkins → Lindsay Petrillose

**Date:** 29 December 2006, 16:13 GMT+1  
**Subject:** Pictures of SimCity on OLPC  
**To:** Lindsay Petrillose  
**Cc:** Walter Bender, Jim Gettys, John Gilmore, Chuck Normann, Will Wright, Ted Selker, others

Thanks for sending me the OLPC laptop! It's very cute, and works well.

Here are some pictures of SimCity displaying on the X11 OLPC screen, running over the wireless network from my laptop running SimCity under Fedore Core in VMWare. The screen looks really great up close, but my webcam wouldn't focus on it close enough to show the detail of the hires mono and lower res color. It runs very smoothly and is quite playable over the net, even without the acceleration of shared memory that you'd get when running it locally. (It helps that the SimCity code was originally written to run fast on a C64!)

I have removed all the licensing key locking code from SimCity, so it no longer has to be unlocked with a key to play for more than a few minutes. (Although you can still trigger the cellular automata city melting effect by selecting "Clipper" from the disasters menu.) And I fixed the fonts so it works with the fonts installed on the OLPC X server. I had to kill the OLPC's funky Sugar window manager and run plain old twm to manage the multiple windows.

Actually running SimCity on the OLCP locally should be straightforward, now that it displays correctly over the net. One important task to do, in order to make something that we could give to other people to demo while it's running Sugar, would be to address the multiple window management issue somehow. And it would also be nice to fix up the fonts and support the sound mixer so it makes cool sound effects (it's not the real thing, without chopper one reporting heavy traffic all the time).

I'd like to know more about how Sugar's window manager works, please — and if there's a way I can run a multi window application that overrides the Sugar window manager's making each window full screen and overlapping. Maybe I can set OverrideRedirect from Tk, or something like that, and manually lay the windows out in useful but fixed positions? But hopefully there's a more cooperative way to achieve the desired results. All my old X11 manuals got waterlogged and rotted after my garage flooded, and I've forgotten the nuances of ICCCM, so I'm just kind of winging it.

In the longer term I would like to ditch the ancient TCL/Tk stuff and rewrite the user interface and scripting engine using Python, GTK and Cairo, integrating it into Sugar and taking advantage of all the cool features like journaling, the mesh network and messaging system.

-Don

---

## 2 · Jim Gettys → Don Hopkins

**Date:** 29 December 2006, 16:35 GMT+1  
**Subject:** Re: Pictures of SimCity on OLPC

On the C64 performance note: Yup. The old machines focused our minds.

Note we are using CSound on the machine: you can do arbitrary music synthesis up to the CPU limits of the system. If you play with TamTam on the machine, you can get some sense of just how capable csound actually is.

As far as fonts go, the easiest way to deal with them, TK after version 8.5 has optional Xft support; but TK has never dealt with serious I18N, the way that GTK has.

Sugar is using Matchbox, which is a single window at a time window manager. Short of being anti-social and using override redirect on all your windows I don't know if there is any other provision in Matchbox for multiple windows. Matthew Allum is Matchbox's author, so I've cc'ed him on this mail.

On the Python/GTK/Cairo rewrite: That's clearly the right long term plan, given the enormous amount of work that serious I18N would otherwise take. And several of our launch countries use complex scripts that TK won't be able to handle.

Regards,  
- Jim

---

## 3 · Jim Gettys → Don Hopkins

**Date:** 29 December 2006, 23:08 GMT+1  
**Subject:** Re: Pictures of SimCity on OLPC

BTW, if you haven't looked at Cairo, you should. See www.cairographics.org.

Best Regards,  
- Jim

---

## 4 · Matthew Allum → Jim Gettys

**Date:** 30 December 2006, 13:32 GMT+1  
**Subject:** Re: Pictures of SimCity on OLPC

Matchbox is a restrictive stack based WM with only one 'app' window visible at any time. You can present multiple windows at once by making 'sub' windows dialogs transient to the main application. Fullscreen windows are supported by the EWMH fullscreen state hint.

AFAIK sim city has been ported to pocketpc and palm which also feature stack based WM's. Taking a route like these ports do with the sim city UI should work well.

-- Matthew

---

## 5 · Don Hopkins → Matthew Allum

**Date:** 31 December 2006, 12:12 GMT+1  
**Subject:** Re: Pictures of SimCity on OLPC

Thanks for the advice on window management and Sugar integration!

I've got SimCity running on the OLPC itself now (if you turn off the window manager), and I've started reworking the TCL/Tk window code to only use one top level window instead of multiple overlapping windows.

First I'd like to make a solid version of SimCity for the OLPC that uses the old TCL/Tk stuff, and integrates with Sugar as a full screen activity. Then I'd like to dump TCL/Tk and rewrite it to use Python, GTK and Cairo. I think SimCity will be a great way to showcase a lot of the cool features and educational aims of Sugar.

-Don
