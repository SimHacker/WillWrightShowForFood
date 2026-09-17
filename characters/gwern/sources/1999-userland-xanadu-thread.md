# "Re: Xanadu — some initial reactions" — UserLand, 27 August 1999

**Author:** Don Hopkins · **Posted:** 27 Aug 1999, 9:50–9:59 PM · **Venue:** UserLand's first
discussion group, run by Dave Winer, archived at `static.userland.com`

Don's review of the **August 1999 Udanax release** — the Xanadu source code, finally published as
open source. It began as email to Dave Winer, who asked him to post it publicly. It ran as **five
consecutive messages** because the board capped a post at roughly 6K characters. Here it is in one
piece.

That reassembly is the whole point of the file, not a courtesy. Don's 1999 charge was that Xanadu
never used itself to hold its own material, and every republication of these posts since has had to
be a copy-and-paste: to [Hacker News in 2018](https://news.ycombinator.com/item?id=16224154), into a
Facebook message in 2026, and now into this repo. Transclusion would have made each of those a
reference instead of a copy — which is exactly the argument Gwern's essay ends up making from the
other direction.

**Verbatim, with the original spelling** — "browseable", "boycot", "port-mortems", "random turist".
Line breaks follow the original. Quoted email headers are set in monospace. Nothing is corrected,
cut, or reordered; the archive's own page header and footer are the only things dropped.

## Who cites it

| Citation | What it takes |
|----------|---------------|
| [Gwern, *Project Xanadu: Even More Hindsight*](https://gwern.net/xanadu) | Two footnotes, by name — the "Sheez" passage and the document-its-own-source-code question. Digest: [`2025-xanadu-even-more-hindsight.md`](2025-xanadu-even-more-hindsight.md) |
| [Don's HN post, Feb 2018](https://news.ycombinator.com/item?id=16224154) | Links all five messages, because there was no way to include them |
| [Roger Gregory's invitation, Sep 2026](../../roger-gregory/invitation.md) | Asks the man who built it to correct the account — lineage questions in [`udanax-lineage-questions.md`](../../roger-gregory/sources/udanax-lineage-questions.md) |

## What is unsettled in it

Kept because the point of an archive is that it does not improve with age.

**The Smalltalk-to-C++ account.** Don's later formulation — Xanadu written in Smalltalk, compiled to
C++, and the compiler output released — was corrected in public by Ted Nelson, who separates the
earlier **Green / Xu88** system from **Gold**, and attributes the dual Smalltalk/C++ Gold
implementation to the later XOC team, under neither Ted's direction nor Roger Gregory's. The 1999
posts do not draw that distinction anywhere.

**Which demo Don saw, and when.** Part 2 records a hypertext demo at the **MIT AI Lab in the 1980s,
running on an Ann Arbor Ambassador**, where he first met Hugh Daniel — that is the Green lineage. He
separately remembers Roger Gregory demonstrating a **Smalltalk** Xanadu at the Xanadu offices years
later. Two demos, decades apart, and the 1999 text silently merges them into "presumably the same
code they've finally released."

**"Did you have to install Python."** About the 1999 release's build and run harness, not about
Xanadu itself.

---

## Part 1 of 5 — msg 010163

*Don Hopkins · 8/27/1999; 9:50:10 PM · <http://static.userland.com/userlanddiscussarchive/msg010163.html>*

I sent this to Dave and he insisted I post it, but I'm not sure it will fit, so I'm posting it in parts...  
I suppose Xanadu would solve all these problems, but hey we're stuck with the World Wide Web today, so you're all going to have to SUFFER!!! Condolences in advance.

-Don

```
From: Hopkins, Don <DHopkins@maxis.com>
To: <dave@scripting.com>
Sent: Wednesday, August 25, 1999 7:59 PM
Subject: RE: Ted Nelson Returns
```

Sheez.  
You don't actually believe anybody will be able to do anything useful with all that source code, do you?  
Take a look at the code. It's mostly uncommented glue gluing glue to glue.  
Nothing reusable there.

Have you gotten it running? The documentation included was not very helpful.  
Is there a web page that tells me how to run Xanadu?  
Did you have to install Python, and run it in a tty window?

What would be much more useful, would be some well written design documents and port-mortems,  
comparisons with current technologies like DHTML, XML, XLink, XPath, HyTime, XSL, etc,  
and proposals for extending current technologies and using them to capture the good ideas of Xanadu.

Has Xanadu been used to document its own source code?  
How does it compare to, say, the browseable cross-referenced mozilla source code?  
Or Knuth's classic Literate Programming work with TeX?

Most of the stuff that's going on with XML is much more down-to-earth, up-to-date and interesting.

A simple, reusable library like Jim Clark's Expat XML parser gets me a lot  
closer to my goal, than all that hot air about grandiose theories that have  
never been tested in the real world.

	-Don

```
From: Dave Winer [mailto:dave@userland.com]
Sent: Wednesday, August 25, 1999 8:06 PM
To: Hopkins, Don
Subject: Re: Ted Nelson Returns
```

I agree with you, but let them have a little bit of sunshine. Ted Nelson was  
a big influence on me, and for that I am grateful. Dave

[To be continued in the next message...]

---

## Part 2 of 5 — msg 010164

*Don Hopkins · 8/27/1999; 9:54:35 PM · <http://static.userland.com/userlanddiscussarchive/msg010164.html>*

[Continued from previous message...]

```
From: Hopkins, Don <DHopkins@maxis.com>
To: 'Dave Winer' <dave@userland.com>
Cc: Hopkins, Don <DHopkins@maxis.com>
Sent: Wednesday, August 25, 1999 8:58 PM
Subject: RE: Ted Nelson Returns
```

I suppose they deserve all the attention they can get.  
It's just disheartening how the open source cheerleaders are ooohing and aaahing about it without seeing it for what it is.  
It makes me worry about them...

Last time I saw Ted Nelson talk (a few years ago at Ted Selker's NPUC workshop at IBM Almaden), he was quite bitter, but he didn't have anything positive to contribute.  
He talked about how he invented everything before anyone else, but everyone thought he was crazy, and how the world wide web totally sucks, but it's not his fault, if only they would have listened to him.  
And he verbally attacked a nice guy from Netscape (Martin Haeberli -- Paul's brother) for lame reasons, when there were plenty of other perfectly valid things to rag the poor guy about.

Don't get me wrong -- I've got my own old worn-out copy of the double sided Dream Machines / Computer Lib, as well as Literary Machines, which I enjoyed and found very inspiring.  
I first met the Xanadu guys some time ago in the 80's, when they were showing off Xanadu at the MIT AI lab.

I was a "random turist" high school kid visiting the AI lab on a pilgrimage.  
That was when I first met Hugh Daniel: this energetic excited big hairy hippie guy in a Xanadu baseball cap with wings, who I worked with later, hacking NeWS.  
Hugh and I worked together for two different companies porting NeWS to the Mac.

I "got" the hypertext demo they were showing (presumably the same code they've finally released -- that they were running on an Ann Arbor Ambassador, of course).  
I thought Xanadu was neat and important, but an obvious idea that had been around in many forms, that a lot of people were working on.  
It reminded me of the "info" documentation browser in emacs (but it wasn't programmable).

The fact that Xanadu didn't have a built-in extension language was a disappointment, since extensibility was an essential ingredient to the success of Emacs, HyperCard, Director, and the World Wide Web.

[To be continued in next message...]

---

## Part 3 of 5 — msg 010165

*Don Hopkins · 8/27/1999; 9:56:09 PM · <http://static.userland.com/userlanddiscussarchive/msg010165.html>*

[Continued from previous message...]

I programmed a lot of stuff in PostScript with the NeWS window system, including toolkits and graphical user interfaces (pie menus, The NeWS Toolkit, etc), extensible text editors like Emacs (both UniPress and Gnu), hypermedia browsers and authoring systems (HyperTIES, GoodNeWS/HyperNeWS/HyperLook), visual programming (PSIBER), and games (SimCity).

I wrote NeWS display drivers and user interface stuff for Emacs (at UniPress, and later for Gnu Emacs), and did a lot of user interface programming for Emacs, eventually using it to implement another hypermedia authoring system (HyperTIES).  
I optimized the Emacs NeWS display driver to run well over a slow modem connection, by downloading PostScript code to the NeWS server to implement as much local intelligence and interactivity as possible.  
For example, it could pop up and track menus, and give real-time text selection feedback, without incurring any client/server round trips.

Emacs has always had a built-in hypertext facility called "info", which has evolved over the years, between different versions of Emacs.  
Originally, it was written in Teco, but it's been rewritten in many different forms, in MockLisp, Lisp Machine Lisp, Gnu Emacs Lisp, C and other languages.

UniPress Emacs stored the info nodes in an ndbm database, and UniPress enhanced it a lot by adding many features borrowed from HyperCard.  
It had a messaging system like HyperCard events, and facilities for storing named resources in info nodes.  
The resources could include executable MockLisp code, that was called in response to events like displaying nodes and following links.  
Or arbitrary text data that the MockLisp code could transform, to dynamically fill out the info page template, and stuff like that.  
Or PostScript code that was downloaded to the window server, to describe interactive behaviors like nested trees of pie menus.  
The PostScript code, MockLisp code, text resources, and the resulting info page itself could be dynamically generated by Emacs.

You could use Info to describe a tree of interactive menus and other applets as interlinked "info" nodes in Emacs.  
It was possible to use the menus through the Info browser built into Emacs.  
But you could also compile them into either pie or linear menus, that were downloaded into the NeWS server and bound to Emacs functions through virtual function keys.  
Since menu items were bound to virtual function keys, you could include menu selections in keyboard macros, get help on menu items using the normal emacs describe-key command, and undo/redo the effects of menu commands.

I wrote MockLisp code that compiled the info database (think of it like an XML model of a menu tree and actions) into PostScript code (that was data describing the nested pie menus, to be downloaded to the NeWS server) and MockLisp code (that defined the virtual function keys and menu item to key bindings, that emacs would execute to bind the menus to emacs functions).

Then it stored the dynamically generated PostScript and MockLisp code in another info resource, that could be quickly downloaded and executed the next time you start up Emacs.  
So the user was able to use the standard "info" hypertext editing facility in Emacs to construct their own custom menus for Emacs, including binding items to function keys, MockLisp code (executed by emacs), PostScript code (executed in the window server), as well as submenus (handled locally in the server without causing any network traffic).

While at the University of Maryland, I worked on HyperTIES at Ben Shneiderman's Human Computer Interaction Lab.  
HyperTIES was a hypertext browsing and authoring system, that we developed for Unix, using Sun's NeWS (Gosling's window system programmed in PostScript) and UniPress Emacs (Gosling's text editor programmed in MockLisp).  
HyperTIES formatted pages into PostScript display lists, with interactive NeWS user interface components embedded on the page like "applets".

I wrote a formatting library in C that downloaded dynamically generated PostScript code to the NeWS server.  
We implemented a markup language with conditional text and macros, that I first prototyped in Forth, then we rewrote in C.  
Then I built an authoring tool with UniPress Emacs written in MockLisp (and other graphical image mapping tools written in NeWS).

Then I used HyperTIES and Emacs to create several works of "intertwingled" text and graphics.  
I made a database about a collection of public domain NeWS software I put together, that categorized it and gave credit to the authors, and let you browse the documentation, view pictures, and run many of the programs by clicking links.  
I also used it to write some interactive papers about pie menus, that were illustrated with embedded examples (like "applets", but programmed in NeWS instead of Java.)  
It's funny how I was using two of Gosling's older languages (MockLisp and NeWS), to do the same thing that Java (another of his later languages) is used for today.

We had a nice "Hubbell Space Telescope" demo that had an articulated image map of the different parts of the telescope, that popped up cookie-cutter shaped targets with drop shadow when you pointed at parts of the image with the mouse.  
I made a general purpose pop-up image map component in NeWS, and an authoring tool that let you create links in an image by drawing arbitrary PostScript paths around different parts of an image, adjust the pop-up scale and offset, etc.

It was typical academic research project: a huge heap of ugly tangled together code in many different languages.  
I learned a lot from programming and using it, but the time it would take anyone else to detangle it all and make any sense out of it, would be much better spend redesigning something else from scratch.

[Continued in next message...]

---

## Part 4 of 5 — msg 010166

*Don Hopkins · 8/27/1999; 9:57:05 PM · <http://static.userland.com/userlanddiscussarchive/msg010166.html>*

[Continued from previous message...]

I would be much more interested in reading about why Xanadu failed, and how it was found to be inadequate, than how great it would have been if only it had taken over the world.

I've done a lot of work that's been flushed down the toilet of history, but I think it would be more interesting and respectful of other peoples time for me to simply describe what it did and what I think was interesting about it, than to distribute the now-useless source code.

Several years ago, I went out to Glasgow to work on HyperLook with Arthur van Hoff at the Turing Institute.  
(Arthur later went on to write the Java compiler in Java, AWT, Hot Java, Bongo, and founded Marimba.)  
We developed a product for NeWS called "HyperLook", which was a totally user configurable GUI system, that I used to port SimCity to Unix.  
There's some stuff on the web about it at http://www.catalog.com/hopkins/hyperlook/index.html

HyperLook was inspired by HyperCard, but based on PostScript graphics and scripting, instead of bitmaps and HyperTalk.  
At the same time we were developing HyperLook, I also ported SimCity to Unix and rewrote the GUI in PostScript, to prove that HyperLook was robust enough to support a real game.  
Actually, it wasn't when we started, but having an application like SimCity to push the development of the GUI made it possible to release them both at the same time!

I wrote an audio server that mixed sounds dynamically and allowed multiple networked applications to share and control the sound hardware.  
And a fast shared memory client-side image animation library, with a server-side component that supported zooming and panning multiple views.  
I also integrated Open Look components from The NeWS Toolkit, designed a plug-in user interface editor component that could be removed to build a non-editable runtime, constructed property sheets and wrote scripts to allow users to configure and customize the components, and stocked object warehouses with user-customizable sample components.

You could think of the NeWS window server as the web browser, the remote application as the web server, PostScript as JavaScript, and HyperLook as HTML.  
A HyperLook "stack" was a window whose shape, contents and behavior were defined by PostScript, that could be connected over the network to a remote application.  
Stacks were downloaded into the NeWS server, drew themselves and interacted with the user locally, but could send messages over the network to remote applications written in C, Prolog, or other languages.  
There was a library that application programmers could use to send and receive messages and data between the remote application on the network and the local HyperLook stacks in the window server.

The HyperLook user (as well as the application developer) could flip a stack into edit mode, then rearrange, cut, copy, paste, and edit components, properties, graphics and scripts of any component on the stack, insert new pre-configured components from object warehouses, print the stack as color PostScript, copy its image as structured graphics onto the clipboard, paste it into the graphics editor, iconify any stack to a miniature dynamically updated icon, etc.

For example, you could close the SimCity window into an icon, and still see the live city view surrounded by tiny user interface components, animating in the icon.

HyperLook also had a help system, class browser, documentation browser, stack manager, print spooler, customizable clock components you could paste into your window frames, and all kinds of other desktop tools and utilities.

HyperLook could be distributed as a run-time GUI framework (without the dynamic user interface editing capabilities), which I included with SimCity.  
The run-time included a fully functional PostScript graphics editor, that we used to create all the graphics in the user interface, and was even useful for editing and annotating pictures of your city before you print them.  
The free graphics editor also gave people a reason to download the HyperLook demo, because there weren't any comparable graphics editors for the Sun at the time.

[Continued in next message...]

---

## Part 5 of 5 — msg 010167

*Don Hopkins · 8/27/1999; 9:59:16 PM · <http://static.userland.com/userlanddiscussarchive/msg010167.html>*

[Continued from previous message...]

Anyway, my take on all this hyper-crap is that it's useless without a good scripting language.  
I think that's why Emacs was so successful, why HyperCard was so important, what made NeWS so interesting, why HyperLook was so powerful, why Director has been so successful, how it's possible for you to read this discussion board served by Frontier, and what made the World Wide Web what it is today: they all had extension languages built into them.

So what's Xanadu's scripting language story?  
Later on, in the second version, they obviously recognized the need for an interactive programming language like Smalltalk, for development.

But a real-world system like the World Wide Web is CONSTANTLY in development (witness all the stupid "under construction" icons), so the Xanadu back and front end developers aren't the only people who need the flexibility that only an extension language can provide.  
As JavaScript and the World Wide Web have proven, authors (the many people writing web pages) need extension languages at least as much as developers (the few people writing browsers and servers).

Ideally, an extension language should be designed into the system from day one.  
JavaScript kind of fits the bill, but was really just nailed onto the side of HTML as an afterthought, and is pretty kludgey compared to how it could have been.

Even better, is the ability to dynamically plug-in any scripting language, without recompiling.  
I'm pretty impressed by some of the COM interfaces that Microsoft has developed (like IScriptingEngine), that make it possible to plug scripting language engines into the web browser and other applications, and program them in any language like VBScript, JScript, Perl, TCL, etc.

Plug-in extension languages are a great idea, because there is no such thing as the "One True Language" that solves all problems for all people, so systems should be designed from the ground up to support many different languages at once, and to smoothly integrate new languages as they are invented.

Integrating different languages together is exactly what COM (aka ActiveX) is all about.  
A lot of people reflexively criticize it, because they know nothing about it, other than the fact that it's from Microsoft, and the hysterical myths that Sun promotes by trying to compare it with Java.  
But the problem with Java, is that it was specifically DESIGNED to be the "One True Language", and NOT to integrate with other languages.  
Rewrite all your other languages and software in "100% Pure Java", they'll tell you. Ha.

That's Xanadu's problem too -- it tries to explain the entire universe from creation to collapse in terms of one grand unified theory, when all we need now are some practical techniques for rubbing sticks together to make fire, building shelters over our heads to keep the rain out, and convincing people to be nice and stop killing each other.  
The grandiose theories of Xanadu were certainly ahead of their time.

It's the same old story of gross practicality winning out over pure idealism.

It's ironic how Microsoft's COM-based Java VM subverted Sun's unwholesome intentions of making Java hard to integrate with any other language.  
Sun still has bees in their bonnet about that, and they have totally cut off their nose to spite their face, refusing to admit that there's anything useful about COM.  
(My opinion of Bill Gates is like Al Franken's opinion of Arianna Huffington: Totally evil, but very clever, practical and funny. While Scott McNealy's like Rush Limbaugh: a loud airbag Bill Clinton/Gates hater and jealous wanna-be.)

In the mean time, Netscape and almost every other company doing plug-ins has adopted COM in one form or another (Netscape XP/COM, Macromedia MOA, mFactory MOM, the list goes on and on), simply because it doesn't suck, and it solves the problems it was designed to solve well.

COM made it possible for Microsoft to develop Internet Explorer so quickly to where it is today, with all its support for scripting languages, dynamic html, and script-accessable properties and methods.

Even though Netscape loudly announced their official plans to boycot COM/OLE/ActiveX, and instead support OpenDoc, CORBA, IFC, Java Beans, rewrite the browser in "100% Pure Java", and all that other "Anti-Microsoft" stuff, they eventually gave up on all the impractical untested vapour-ware, and bought into COM (or XP/COM as they call it), for good practical reasons.

There's no use in comparing ActiveX to Java, since they were designed to solve very different (almost complementary) problems.

COM is a tool for software developers. Java is a weapon in the war against Microsoft. They were designed for different purposes. If your business plan calls for vanquishing Microsoft before you produce any deliverable software, then by all means, use Java!

Anyway, my point, as it relates to Xanadu, and is illustrated by COM (which has its own, more down-to-earth set of ideals), is that it's the interfaces, and the ideas and protocols behind them, that are important.  
Not the implementation. Code is (and should be) throw-away.

There's nothing wrong with publishing old code for educational purposes, to learn from its successes and mistakes, but don't waste your time trying to make it into something it's not.

	-Don

[Finally, I've gotten sick of watching myself type! Condolences in retreat.]


---

↑ [`../CHARACTER.yml`](../CHARACTER.yml) · [Gwern's essay digest](2025-xanadu-even-more-hindsight.md)
· [Roger Gregory](../../roger-gregory/README.md) · [Ted Nelson](../../ted-nelson/README.md) ·
[Hugh Daniel](../../hugh-daniel/README.md) · [Ben Shneiderman](../../ben-shneiderman/README.md)
