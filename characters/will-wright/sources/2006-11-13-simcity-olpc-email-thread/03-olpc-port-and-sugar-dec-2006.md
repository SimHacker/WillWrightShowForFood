# Part 3 — OLPC port and Sugar (Dec 2006)

Verbatim from Don Hopkins forwarded-mail archive.

---

## John Gilmore → Don Hopkins

**Date:** 12 December 2006, 10:27 GMT+1  
**Subject:** Re: Open Source SimCity for OLPC

> It's great you've got it working on FC6. That's what they based the OLPC on.
>
> They have their own window manager, etc ("Sugar"), and their screen is funky (user can switch it between reflective monochrome and backlit color, without changing pixel resolution).
>
> Chuck Normann called me and left a message last week but I haven't gotten back to him yet. Tues I'm getting a colonoscopy so I'll be sedated and otherwise not suitable for business calls. Wed or Thurs would be better for me.
>
> John

---

## Don Hopkins → John Gilmore, Will Wright

**Date:** 13 December 2006, 01:22 GMT+1  
**Subject:** Re: Open Source SimCity for OLPC

> The OLPC "Sugar" interface looks quite sweet and refreshing, and I think it would be a great fit for SimCity.
> Last week or so I wrote some notes about how SimCity could work with the OLPC interface -- if you didn't receive it then I can send you another copy!
> I've looked at some of the documentation on Sugar development, and tried to install it and run it on the fresh Fedore Core distribution that I compiled SimCity on.
> I got it to run in xnest and show the logo in the middle, but it didn't respond to any mouse or keyboard input.
> But I'll keep trying. Maybe the best approach is to compile and run SimCity in the pre-installed VMware image that Sugar runs in.
>
> It's great to hear that Chuck Norman called! That's encouraging, that they're taking this seriously.
> What action do you think will be required on their part to make this go forward? And what can I do?
>
> Will they need a copy of the source code? I can deliver an VMware image of it all compiled and running.
> I just wrote a ROADMAP.txt file the describes what and where all the source code is, and I cleaned it up and tossed out obsolete and proprietary stuff that wasn't being used (like the floating license server, and old libraries that are now included with the operating system).
>
> I'd really love to get permission to use the SimCity curriculum guides that Doreen Nelson wrote for Maxis, and get her involved with the project.
>
> -Don

---

## John Gilmore → Don Hopkins

**Date:** 19 December 2006, 22:39 GMT+1  
**Subject:** Re: John Gilmore: SimCity for OLPC

> I'd like to get Don's email address. Haven't talked to him for ages.
>
> dhopkins@donhopkins.com
>
> Check out his web site, too -- but be careful! You could fall in and lose yourself for days!
>
> John

---

## Walter Bender → John Gilmore

**Date:** 19 December 2006 (forwarded 22:42 GMT+1)  
**Subject:** Re: [Fwd: John Gilmore: SimCity for OLPC]

> This somehow slipped through through the cracks. It would of course be great to have Sim City on the laptop. (I actually always preferred the earlier versions myself, so that should make it easier. The only challenge is getting it into shape for Linux. That will take some work from someone, but I am certain we could get someone in the community interested. I am in Dubai en route to Islamabad. Back just before Christmas. What is the best way to follow up?
>
> thanks.
>
> -walter

---

## John Gilmore → [email redacted] (and cast)

**Date:** 20 December 2006, 00:31 GMT+1  
**Subject:** SimCity for OLPC -- introducing the players

> I've cc'd all the relevant parties (and a few more).
>
> Jim Getty <[email redacted]>, VP of Software Engineering, said:
> I forwarded your mail to Walter when I got it; Walter is traveling, and by his parsimonious mail it is clear he's not in communications much of the time.
>
> Thanks! Walter Bender <[email redacted]>, OLPC President, Software and Content, responded today from Dubai [...] and he'd be very happy to see SimCity ship on the OLPC:
>
> [... Walter quote above ...]
>
> Don Hopkins <dhopkins@donhopkins.com>, consultant, is the author of the SimCity Unix port, confidante of Will Wright who founded Maxis, and an old friend of mine. He's been hacking this code since the 1980s. [...] A few weeks ago he unearthed the source code from his old backup tapes. Then he ported it to FC6. Over the weekend he found the contracts (that Maxis hasn't yet found its own copies of) which provide Maxis with clear title to his port of the software that we're asking them free up. He wants to do the work to prepare it for OLPC.
>
> Chuck Normann <[email redacted]> is the point man for Electronic Arts [...]
>
> Doreen Nelson <[email redacted]>, Professor of Education at Cal Poly Pomona [...] wrote the SimCity curriculum guides for Maxis, which we hope can be freed up along with the software.
>
> I've asked Don to sign up for the OLPC developers' program and to ask Jim for a laptop. Don last ported the user interface to 1-bit and 8-bit Unix framebuffers, using TCL/TK and multiple windows. [...] Don already has the code running on FC6, under VMware on his own hardware. It will need some work to run cleanly on the OLPC screen and in Sugar, and to look good in both mono and color modes. [...] Once that's working, he then wants to rip out the TCL scripting and install Python; [...] This will make it integrate better with OLPC, reduce its disk and memory footprint, and make it easier for the kids to hack on.
>
> The game today allows multiple players to interact, including text chat and shared overlay "chalk" sketching; but it will also have to get hooked in to the OLPC's chat, proximity and friendship systems.
>
> Don has hacked a lot of great software over the years; his willingness to write & maintain great free code is only limited by his need to make a living. He's doing consulting to make ends meet. I'm willing to subsidize his work on OLPC SimCity -- once Maxis decides whether to free up the code.
>
> John Gilmore
>
> PS: When I last saw SimCity on Unix, it also included a nice interactive graphical cellular automata system (just because Don liked it). [...]
>
> PPS: Mitch Bradley is cc'd because he's working for OLPC and he also employed Don many years ago at Sun -- to plug the FORTH interpreter into a CAD package, as I recall!

---

## Charles Normann → John Gilmore

**Date:** 20 December 2006, 08:09 GMT+1  
**Subject:** RE: SimCity for OLPC -- introducing the players

> Thanks for this introduction, John.
>
> To get more specifics about OLPC, who should I contact?
>
> Also, it would be helpful to know, giving the engineering work needing to be done, when we need to have all particulars worked out so that we can make the initial shipment of laptops and/or key publicity dates.
>
> I'm very excited to be working on this and look forward to making it work.
>
> - Chuck

---

## John Gilmore → Charles Normann

**Date:** 20 December 2006, 09:11 GMT+1  
**Subject:** Re: SimCity for OLPC -- introducing the players

> Walter Bender is President of Software and Content. But OLPC is a very small organization (14 people, last time I looked); they try to do all their work in public [...]
>
> The OLPC wiki is a useful resource. [...]
>
> My guess is that if Don isn't occupied by other paying work, one to two months of full-time effort would suffice to adapt the program itself, starting after EA commits to releasing the code under a free license. [...] Call it three to four months of elapsed time from the moment of re-licensing.
>
> [... schedule working backwards: mass production July 1, freeze June 1, integrate April 1, start development by Feb 1 ...]
>
> John

---

## Walter Bender → Charles Normann

**Date:** 20 December 2006, 13:21 GMT+1  
**Subject:** Re: SimCity for OLPC -- introducing the players

> I am probably the right person to contact re working through the details on the OLPC front. I'm in Pakistan until Friday, but available by email and back in Cambridge between Christmas and New Years.
>
> thanks.
>
> -walter

---

## Walter Bender → Charles Normann

**Date:** 23 December 2006, 13:06 GMT+1

> If you think it would be helpful, I could ask Eben Moglen to help.
> Eben is General Counsel for the Free Software Foundation and adviser to OLPC. Let me know.
>
> thanks.
>
> -walter

---

## Don Hopkins → Walter Bender

**Date:** 21 December 2006, 10:07 GMT+1  
**Subject:** Re: SimCity for OLPC -- introducing the players

> Since SimCity already runs on FC6, I think we can have a playable, releasable, but not completely integrated version of SimCity running on the OLPC pretty soon, and then start addressing other issues in order of importance and complexity.
>
> Here are some tasks in order of complexity, from trivial to blue sky: fonts, sounds, screen formats, configuration and build system, internationalization, help, documentation and courseware, multi player collaboration, code refactoring, SWIG interface, Python scripting, Sugar integration, user interface components, interface customization, mesh networking, chatting, journaling and storytelling, image and data import/export and printing, custom graphics, user scripting and extensibility, user defined zones, sprites, disasters, tools and scenarios, visual programming, programming by example, cellular automata and agent simulation laboratory (think SimCity meets Robot Odyssey/Click and Play/KidSim/SimAntics/EToys/AgentSheets/LabView/Max/Body Electric).
>
> I think SimCity will be a wonderful driving force and proving application for the Sugar user interface, and inspire other people to give it a try and contribute to its development.
>
> -Don

---

## Don Hopkins → developer@laptop.org

**Date:** 21 December 2006, 11:21 GMT+1  
**Subject:** Application for OLPC developer's program, for developing SimCity

> Hello! I'd like to sign up for the OLPC developer's program, please.
>
> Name: Don Hopkins
> Email address: dhopkins@DonHopkins.com
> [...]
> Description of your plans for the machines(s):
> Port SimCity to OLPC and integrate with Sugar.
>
> Quantity of machines desired:
> 1 to start with, but eventually would like to test SimCity multi player user interface and networking with another laptop or other people's laptops.

---

## Lindsay Petrillose → Don Hopkins

**Date:** 27 December 2006, 21:29 GMT+1  
**Subject:** OLPC B1 Machine on its way...

> Dear Don,
>
> An OLPC B1 machine was sent to you this afternoon. You should receive it tomorrow at the address you provided. The DHL tracking# 19400248055, for your records.
>
> Additionally, I have attached B1 Release Notes [...]
> B1 Release Notes: http://wiki.laptop.org/go/BTest_Software_Notes
>
> Also, at this time we are exploring a potential power issue. Until further testing and information is provided, please do the following:
>
> - Unplug the A/C adapter whenever you insert or remove the battery.
>
> Regards,
> Lindsay Petrillose

---

## Charles Normann → Don Hopkins

**Date:** 28 December 2006, 01:11 GMT+1  
**Subject:** FW: SimCity for OLPC -- introducing the players

> Don, what was the initial reason for creating the Unix version? Was it published? If so, then by whom? Do you know of any proprietary software that was used in making the original SimCity? Is there anything in that code that EA would not have the right to pass on?
>
> Also, can you send me the copy of the code that you have?
>
> Thanks,
> - Chuck

---

## Don Hopkins → Lindsay Petrillose (and OLPC list)

**Date:** 29 December 2006, 16:13 GMT+1  
**Subject:** Pictures of SimCity on OLPC

> Thanks for sending me the OLPC laptop! It's very cute, and works well.
>
> Here are some pictures of SimCity displaying on the X11 OLPC screen, running over the wireless network from my laptop running SimCity under Fedore Core in VMWare. The screen looks really great up close, but my webcam wouldn't focus on it close enough to show the detail of the hires mono and lower res color. It runs very smoothly and is quite playable over the net, even without the acceleration of shared memory that you'd get when running it locally. (It helps that the SimCity code was originally written to run fast on a C64!)
>
> I have removed all the licensing key locking code from SimCity, so it no longer has to be unlocked with a key to play for more than a few minutes. (Although you can still trigger the cellular automata city melting effect by selecting "Clipper" from the disasters menu.) And I fixed the fonts so it works with the fonts installed on the OLPC X server. I had to kill the OLPC's funky Sugar window manager and run plain old twm to manage the multiple windows.
>
> Actually running SimCity on the OLCP locally should be straightforward, now that it displays correctly over the net. One important task to do, in order to make something that we could give to other people to demo while it's running Sugar, would be to address the multiple window management issue somehow. And it would also be nice to fix up the fonts and support the sound mixer so it makes cool sound effects (it's not the real thing, without chopper one reporting heavy traffic all the time).
>
> I'd like to know more about how Sugar's window manager works, please -- and if there's a way I can run a multi window application that overrides the Sugar window manager's making each window full screen and overlapping. Maybe I can set OverrideRedirect from Tk, or something like that, and manually lay the windows out in useful but fixed positions? But hopefully there's a more cooperative way to achieve the desired results. All my old X11 manuals got waterlogged and rotted after my garage flooded, and I've forgotten the nuances of ICCCM, so I'm just kind of winging it.
>
> In the longer term I would like to ditch the ancient TCL/Tk stuff and rewrite the user interface and scripting engine using Python, GTK and Cairo, integrating it into Sugar and taking advantage of all the cool features like journaling, the mesh network and messaging system.
>
> -Don

*(Images: [`images/SLIDESHOW.md`](images/SLIDESHOW.md) — scrollable gallery with captions; [`images/SLIDESHOW.yml`](images/SLIDESHOW.yml) metadata.)*

---

## Jim Gettys → Don Hopkins

**Date:** 29 December 2006, 16:35 GMT+1  
**Subject:** Re: Pictures of SimCity on OLPC

> Yup. The old machines focused our minds.
>
> Note we are using CSound on the machine: you can do arbitrary music synthesis up to the CPU limits of the system. [...]
>
> As far as fonts go, the easiest way to deal with them, TK after version 8.5 has optional Xft support; but TK has never dealt with serious I18N, the way that GTK has.
>
> Sugar is using Matchbox, which is a single window at a time window manager. Short of being anti-social and using override redirect on all your windows I don't know if there is any other provision in Matchbox for multiple windows.
>
> Matthew Allum is Matchbox's author, so I've cc'ed him on this mail.
>
> That's clearly the right long term plan, given the enormous amount of work that serious I18N would otherwise take. And several of our launch countries use complex scripts that TK won't be able to handle.
>
> - Jim

---

## Matthew Allum → Jim Gettys

**Date:** 30 December 2006, 13:32 GMT+1  
**Subject:** Re: Pictures of SimCity on OLPC

> Matchbox is a restrictive stack based WM with only one 'app' window visible at any time. That said however you can of course present multiple windows at once just by making 'sub' windows dialogs transient to the main application. Fullscreen windows are supported by the EWMH fullscreen state hint [1]. You shouldn't have to rely on override redirects.
>
> AFAIK sim city has been ported to pocketpc and palm which also feature stack based WM's - less sophisticated and flexible than MB. Taking a route like these ports do with the sim city UI should work well.
>
> -- Matthew
>
> [1] http://standards.freedesktop.org/wm-spec/1.3/ar01s05.html#id2522991

---

## Don Hopkins → Matthew Allum

**Date:** 31 December 2006, 12:12 GMT+1  
**Subject:** Re: Pictures of SimCity on OLPC

> Thanks for the advice on window management and Sugar integration!
>
> I've got SimCity running on the OLPC itself now (if you turn off the window manager), and I've started reworking the TCL/Tk window code to only use one top level window instead of multiple overlapping windows, so it will tile the maps and dialogs inside of the main window, and use transient windows for popups.
> A fullscreen tiled sub-window approach will simplify the widow management a lot, although I'll have to disable the ability to create multiple maps and editors for the time being, until we figure out a way to let the user manage them from within the Tk window.
> I'm making my top level window the same size as the screen -- is that just as good as setting the fullscreen flag, or would it be better to actually tell the window manager that I mean the window to be full screen?
> Since I'm using a version of TCL/Tk from 1992 (Tk 2.3), it probably doesn't support the EWMH stuff, but I could hack it in.
> Fortunately Tk 2.3 does support transient windows, at least!
>
> First I'd like to first make a solid version of SimCity for the OLPC that uses the old TCL/Tk stuff, and integrates with Sugar as a full screen activity, without rewriting too much stuff or adding any new features. That will make it possible for regular people to demonstrate and play with it soon.
>
> Then I'd like to dump TCL/Tk and rewrite it to use Python, GTK and Cairo, then start taking advantage of all the nice stuff in Sugar. I think SimCity will be a great way to showcase a lot of the cool features and educational aims of Sugar.
>
> One of the nice things to come out of that effort will be a pie menu widget for GTK.
>
> I've been looking at the dbus stuff, and that looks like it will be great for making a multi player version of SimCity, that will operate differently than the current multi player mode (where one X11 client opens multiple X11 connections to different servers). It would be best for all players to run their own local X11 SimCity clients, and those clients can communicate with each other and synchronize at a higher level than X11, using dbus.
>
> And maybe a wee little http server for publishing cities, html interfaces, web services and ajax guis, so you can access and control the simulation over the web, as well as through the graphical desktop interface. That's easier (and more fun) than falling off a log, with Python!
>
> -Don

---

## Ted Selker → Don Hopkins

**Date:** 29 December 2006, 22:59 GMT+1  
**Subject:** Re: Pictures of SimCity on OLPC

> you are such a god!

---

## User closing note (forwarded context)

> Well that is to the end of 2006 what an exciting year! I moved to amsterdam the next year and then simcity was finally released.

*(Micropolis — GPL release followed in Jan 2008.)*
