# Window Manager Flames — the ICCCM, OWM, and piewm (Unix-Haters X-Windows lore)

Don's window-manager chapter from the Unix-Haters X-Windows material:
"The ICCCM Sucks" (I39L = the hash for
Inter-Client-Communication-Conventions-Manual), the TkWM reply, the OWM
design notes, the input-focus indictment, the xinit rant, and the piewm
documentation. Live copies:
[art.net](http://www.art.net/~hopkins/Don/unix-haters/x-windows/i39l.html) ·
[donhopkins.com i39l.txt](https://donhopkins.com/home/archive/NeWS/i39l.txt).

Quote nesting below is transcribed from the original HTML blockquote
structure — the indentation carries the attribution. In the TkWM thread,
one level deep is David Herron, two levels deep is whoever Herron is
quoting, and Don's replies are flush left.

## Why this matters

- **The OWM design doc, in public.** "OWM is the 'Open Window Manager' we
  prototyped in NeWS. We enhanced the NeWS window frames so they sported
  **indexing tabs, pie menus, rooms, and a scrolling virtual desktop**.
  Many of our enhancements were separately developed, and **plugged
  together orthogonally like legos**… the Open Window Manager wrapped X
  clients in the same frames that NeWS windows got!" The source itself is
  archived in [Josh Siegel's room](../../josh-siegel/sources/owm.ps), the
  frames in [Don's code room](../code/news-tnt/README.md).
- **Why NeWS should manage the windows**: pinned TNT menus stay put while
  I39L-managed X menus "disappear… and come back at a different place, at
  a different size, with a different look and feel"; PizzaTool's round
  popup window whose shape is **a method of the window object**
  ("completely impossible with an I39L window manager"); rubber-band
  feedback without grabbing the server.
- **The input-focus indictment**: "It's **criminally negligent** to ship a
  product that is incapable of keeping the input focus up to date with the
  cursor position, when you have the technology to do so" — followed by
  the xtrek reactor-meltdown / photon-torpedo scenario.
- **The Sun epitaph**, in the TkWM reply: "We were just to that point with
  NeWS, and even had a really fancy prototype ICCCM X11 window manager
  implemented completely in the server… **when Sun cut our throats for the
  final time.**" With the Buxton line Don endorsed: "it is an unworthy
  design objective to aim for anything less than trying to do to the
  Macintosh what the Macintosh did to the previous state of the art."
- **piewm documented**: the pie menu syntax for the modified tvtwm —
  `piemenu "Pan"`, `@ 45` initial angles, `f.piemenu`, pixmap labels —
  the X11 pie menus users could actually run.
- **The xinit rant** ends with ExitTool, "actually empowering the user to
  drag'n'drop from YesTool… and cut'n'paste from NoTool (actually
  implemented… as a *subclass* of YesTool!)" — Don c(^;

## HN retellings

Where Don has linked this document or told its story. Broader sweep across
window managers, tabs, pies, HyperCard, and HyperLook:
[HN harvest](hn-window-management-harvest.md).

| Comment | Thread | What it adds |
|---|---|---|
| [2025-05-25](https://news.ycombinator.com/item?id=44090952) | Plwm — X11 WM in Prolog | Links [owm.ps.txt](https://donhopkins.com/home/archive/NeWS/owm.ps.txt) **and** [i39l.txt](https://donhopkins.com/home/archive/NeWS/i39l.txt) together: "an X11 window manager, with pie menus and tabbed windows, entirely written in object oriented NeWS PostScript, from around 1991" |
| [2025-05-26](https://news.ycombinator.com/item?id=44098598) | Plwm (follow-up) | "It was fun to write and run. But we couldn't talk Sun into letting us ship it for some reason! ;)" — links the catalog copy of this doc |
| [2020-03-06](https://news.ycombinator.com/item?id=22501696) | The X-Windows Disaster (1994) | The "calling it X-Windows to piss people off since June 1988" confession; links owm.ps.txt, this doc on art.net, `piewm.tar.Z`, `tkpie.tar.gz`, and the uwm FORTH pies |
| [2021-11-03](https://news.ycombinator.com/item?id=29094938) | How X Window Managers Work | The lineage in one comment: 1987 uwm X10 WM "extensible and scriptable in FORTH" → owm.ps.txt |
| [2019-01-06](https://news.ycombinator.com/item?id=18837730) | Tree Style Tabs | Tabbed windows in 1988 for NeWS and UniPress Emacs, "long before Gnu Emacs did"; links [old-xnews-tab.ps](../code/news-tnt/old-xnews-tab.ps) + owm.ps.txt |
| [2017-09-25](https://news.ycombinator.com/item?id=15327339) | X and NeWS history | Long-form NeWS history; links owm.ps.txt + the catalog copy of this doc |
| [2017-03-08](https://news.ycombinator.com/item?id=13817649) | The Unix-Haters Handbook [pdf] | "We did support shaped windows!… rooms, virtual scrolling desktops, tabbed windows, pie menus… easily extensible and deeply customisable" |
| [2014-07-16](https://news.ycombinator.com/item?id=8042726) | Side Tabs productivity hack | Earliest found link to this doc: drag the tabs to any place along any edge |

## The document, verbatim

### The ICCCM Sucks

The ICCCM, abbreviated I39L, sucks. I39L is a hash for the acronymic expansion of ICCCM for "Inter-Client Communication Conventions Manual". Please read it if you don't believe me that it sucks! It really does. However, we must live with it. But how???

### Some notes about TkWM

```
To: comp-lang-tcl@berkeley.edu
Subject: Re: Extensible Tk Window Manager?
```

"David Herron" \<DAVID@twg.com\> writes:

> Somebody else writes:
>
> > Who's interested in a extensible Tk ICCCM window manager?
>
> Me me me me ...
>
> In fact I've been tempted more than once to type ^X^Ftkwm.c and see what happened ;-) (just like Tom LaStrange suggested once somewhere..)

But remember, he also warned that you'll regret it for the rest of your life. ICCCM is not the prettiest of protocols. (Your adaptable natural language driven multi media email interface should now play the user definable sound effect you have elected to hear whenever someone makes a gross understatement.)

> Actually what sounds more interesting is a Tk extension to X11. You'd embed a TCL/TK interpretor into the X server and use that to build the UI. Some little applications (calculator programs) would be able to run completely within the server, while others would communicate with a back end using higher level commands of some sort.

Hey, that sounds familiar. Might as well put in multitasking, a high level event handling mechanism, networking support, assorted Byzantine interfaces to X server internals, a device independent stencil paint imaging model, a structured graphics editor, an object oriented programming system, persistent objects, an extensible user interface toolkit that runs in the server, that is editable by the user at run-time, and whose image can be captured as a PostScript drawing, with warehouses full of useful graphical componant prototypes with you can cut and paste into editable interfaces like HyperCard stacks, with a scripting language with C-like syntax (like PdB), and customizable property sheets for configuring each user interface component.

Once you have all that stuff, _then_ it's time to write a window manager. We were just to that point with NeWS, and even had a really fancy protype ICCCM X11 window manager implement completely in the server, using The NeWS Toolkit window frames (subclassed to support a virtual scrolling desktop, rooms, pie menus, and moveable title tabs), and an optimizing object oriented ANSI-C to PostScript compiler (PdB) that allows human beings to write scripts to customize the user interface, when Sun cut our throats for the final time.

Well fortunatly, PdB binaries are now available for the sun4 and rs6000 via anonymous ftp from ftp.uu.net (in "graphics/NeWS/pdb2.1.1.*") and bongo.garnet.cs.cmu.edu (in "pub/PdB").

> > So users can construct custom envoronments by composing X applications and programmable window management widgets like close buttons, menus of keyboard or mouse macros, drag and drop targets, post-it notes, shared white boards, graphics editors, etc...
>
> I think he's got the fever!!!

Bill Buxton put it well: it is an unworthy design objective to aim for anything less than trying to do to the Macintosh what the Macintosh did to the previous state of the art.

-Don

PS: If you're really interested in this kind of stuff, and actually running OpenWindows 3.0, you should check out the free HyperLook demo, "HyperLook1.5-runtime.tar.Z", available via anonymous ftp from ftp.uu.net in "graphics/NeWS", or bongo.garnet.cs.cmu.edu in "pub/HyperLook". The runtime system is free, but the user interface editor isn't included in the demo. It does include a fully functional structured PostScript graphics editor that imports and exports EPS (which is a user interface component you can use in your own HyperLook applications and property sheets). There are also some PostScript files describing the system, and several demos showing what it can do. One of the demos (HyperLook-Clocks.tar.Z, the NeatClocks stack) is a warehouse of customizable clock components, whose property sheet has three structured graphics editors, for the face and the hands. The clock scales and rotates the graphics (like a clipped image of Alan Turing's head for the clock face, or a Zapf Dingbat pointing hand) to display the time. You can press the "Props" key over a clock face to edit its graphical properties, or "Help" to see the specialized help text that also tells the current time and date. This kind of stuff really is down to earth and practical (I haven't yet described the far out blue sky stuff), and incredibly fun to build and use!

### Who Should Manage the Windows, X11 or NeWS?

This is a discussion of ICCCM Window Management for X11/NeWS. One of the horrible problems of X11/NeWS was window management. The X people wanted to wrap NeWS windows up in X frames (that is, OLWM). The NeWS people wanted to do it the other way around, and prototyped an ICCCM window manager in NeWS (mostly object oriented PostScript, and a tiny bit of C), that wrapped X windows up in NeWS window frames.

Why wrap X windows in NeWS frames? Because NeWS is much better at window management than X. On the surface, it was easy to implement lots of cool features. But deeper, NeWS is capable of synchronizing input events much more reliably than X11, so it can manage the input focus perfectly, where asynchronous X11 window managers fall flat on their face by definition.

Our next step (if you'll pardon the allusion) was to use HyperNeWS (renamed HyperLook, a graphical user interface system like HyperCard with PostScript) to implemented a totally customizable X window manager!

### Some notes about OWM

OWM is the "Open Window Manager" we prototyped in NeWS. We enhanced the NeWS window frames so they sported indexing tabs, pie menus, rooms, and a scrolling virtual desktop. Many of our enhancements were separatly developed, and plugged together orthogonally like legos. All NeWS applications could use these fancy frames, and the Open Window Manager wrapped X clients in the same frames that NeWS windows got!

This way, factoring the window frames out as a part of the toolkit, and implementing the X window manager separately, NeWS applications don't have to know a thing about X window management, and X clients can go on doing the same nasty things they've always done, and everybody get the benefits of dynamic extensibility, and a consistent user interface, by using the default window class!

I39L window management complicates pinned menus enormously. TNT menus pin correctly, so that when you push the pin in, the menu window simply stays up on the screen, just like you'd expect. This is not the case with XView or even OLWM. Under an I39L window manager, the Open Look pinned menu metaphor completely breaks down. When you pin an X menu, it dissappears from the screen for an instant, then comes back at a different place, at a different size, with a different look and feel. If you're not running just the right window manager, pinned menus don't even have pins! There is no need for such "ICCCM compliant" behavior with TNT menus. When they're pinned, they can just stay there and manage themselves. But were TNT windows managed by an external I39L window manager, they would have to degenerate to the level of X menus.

Under the OWM solution, pinned TNT menus work correctly, and they inherit their pinned window behavior from ClassPopupWindow, the same class managing pinned X menus. The look and feel is high quality, consistant, maintainable, and intentionally extensible.

If I39L window management has such a negative impact on pinned menus, how else will it impact other parts of the toolkit and applications?

Will it effect popup notices? Since they need keyboard input for the buttons, will they have to play the I39L window management game? How do we get the notice tail (a separate canvas) to line up, if the window manager decides to wrap a frame around the notice window?

It is impossible to know how it will effect TNT applications, because the toolkit was specifically designed to be subclassed and extended in areas that overlap with I39L window management. NeWSRoom and the TNT virtual window manager are examples of simple, interesting extensions to the window class that are in direct conflict with I39L window management. We would be giving up a lot of actual and potential functionality, that we designed the toolkit to support in the first place. We need to redesign the window class for greater flexbility and easier subclassability, but those goals are at odds with I39L window management. The result of a cross of these two opposing goals would be massivly complex and would sacrifice most of the important advantages of the TNT approach. However, the OWM approach to window management, wrapping X windows in instances of the TNT window class, synergizes with extensions to the window classes. As an extreme example, you can make OWM wrap window frames with title tabs that pop up pie menus full of handy window management functions around all your X windows.

There are several other technological advantages of managing X windows internally with NeWS, over managing them externally with X. By an external window manager, I mean one that is in a separate address space as the windows. Relative to the server, all windows are internal, all X "Xlib" and NeWS "wire service" clients are external, and NeWS canvas objects and light weight processes are internal. But an external X window manager is in a different address space must try to manage many shared resources at a distance, an intrinsicly difficult task, imposing limitations on the whole system and unavoidably restricting the user interface possibilities.

The management of arbitrarily shaped windows becomes very complicated under an I39L window manager. In contrast, PizzaTool has a popup pizza preview window, whose shape is a rectangular frame around a round (or semi-circular, depending on your appetite) pizza window, with the space between the inside of the frame and the pizza cut out. It was very easy to implement, by subclassing ClassPopupWindow and overriding the /path method to cut out the inside of the frame and ask the center pizza client to add its shape to the path. When you move or stretch the window, you see a rubber-band preview of the actual shape the window will take when you release the button. The pizza path procedure knows to maintain a 1:1 aspect ratio (no oval pizzas), that centers the round pizza in the frame as you drag the resize corner around. The shape of a TNT window is not simply defined by curves or bitmaps -- it is defined by a method of the window object, which can apply constraints and may depend on the state of other objects in the system, like the size or number of slices of the pizza inside the frame. All this nice interactive feedback is totally trivial to implement with TNT, and is completely impossible with an I39L window manager. And even if an I39L window manager could be programmed to perform such custom feedback, it would still have to grab the server and lock out all other animation in the process, instead of using nondestructive overlays like TNT.

X11 window managers must grab the server in order to animate rubber-band feedback over the screen when resizing and moving windows. This grabbing causes many problems with NeWS synchronous interests, that can be demonstrated by pressing the "Help" key while dragging out a rectangle on the root background. NeWS can do a much better job at managing global resources in the server because it is in the same address space and it has facilities like the overlay plane specifically designed to implement such window management functions, without even grabbing the server. This antisocial server grabbing behavior is just one symptom of a general class of problems with external X window management, including other important issues such as keyboard and colomap focus.

If NeWS alone manages the input focus, it can manage it perfectly. An X window manager alone cannot, because it runs in a foreign address space, and is not in a position to synchronously block the input queue and directly effect the distribution of events the way NeWS is. But even worse is when an X window manager *and* NeWS both try to manage the input focus at once, which is the situation we are in today. The input focus problem could be solved in several ways: OWM solves the problem elegantly, as PSWM did in the past; OLWM could be made NeWS aware, so that when our own customers run our own external X window manager on our own server that we ship preinstalled on the disks of our own computers, OLWM could download some PostScript and let NeWS handle the focus management the way it was designed.

It's criminally negligent to ship a product that is incapable of keeping the input focus up to date with the cursor position, when you have the technology to do so. Your xtrek has paged the window manager out of core, and the console beeps and you suddenly need to move the cursor into the terminal emulator and type the command to keep the reactor from melting down, but the input focus stays in the xtrek for three seconds while the window manager pages in, but you keep on typing, and the keys slip right through to xtrek, and you accidentally fire off your last photon torpedoe and beam twelve red shirt engineers into deep space!

### Some Questions About xinit

> ```
> Date: Tue,  4 Jun 1991 04:12:49 -0400 (EDT)
> From: Pat_Barron@transarc.com
> To: Don.Hopkins@Eng (Don Hopkins)
> Subject: Re: xinit
> ```
>
> Excerpts from mail: 4-Jun-91 xinit Don Hopkins@Eng.Sun.COM (81)
>
> > Could somebody please explain why xinit exists? Does anybody use it? Why?
>
> I'm not really sure what you're asking. If you're asking why people don't just use xdm or something, I can tell you that (at least in my environment) I don't always want the window system running, at all. Also, I have at least one user here who alternates back and forth between X11 and Suntools, so he needs to log in on the console and manually start whatever window system he needs to use that day.
>
> --Pat.

I'm interested to know if there's something special about they way xinit sets things up and takes things down that makes people want to use it, or if it's that they simply want to be able to log in on the console and run whatever window system they choose.

It's trying to solve several problems, and it imposes a certain model, so I'd like to know what problems people need xinit to solve, and what non-problems people don't need xinit to solve but it tries to solve anyway.

In particular, one problem it tries to solve is the "start up the window system from the command line" problem. Another is the "shut down the window system from the user interface" problem. Along the way, it makes a stab at the "initialize the window system" problem, which generally includes the "start up the managers" and "start up the clients" problems. Depending on the way you have things set up, xinit might fire off any number of managers and clients, or just hand the responsibility off to one manager or shell script who starts off the whole show. What happens at this point is private matter between you and your site administrator.

The thing I want to question is xinit's solution to the "shut down the window system from the user interface" problem. Its policy is to hang around until the "last long lived program started (usually a window manager or terminal emulator)" has exited. Or is that a mechanism? I'm sorry, these days it's hard to tell, what with all the patriotism that's going around. Anyway, what I wanna know, is why is xinit trying to solve a *user interface* problem? What is the documented "user interface" for indicating to xinit that you are done, and that it should solve the "shut down the window system" problem? Simple: you cause a shell script to exit. That's certainly intuitive and easy!

[Well, it's intuitive if your site administrator has everything nicely set up so that one *special* xterm automatically comes up in AutoIconify mode with blinking text and a huge banner in bright bright red 48 point ***RockyHorror-BoldItalic*** saying ***"!!!DEATH TERM!!!"*** (blinking, in the original). Well, it's easy if your window manager is so tough that it laughs maniacally whenever it gets hit by a SEGV, and has a popup confirmation dialog hard wired to the exit button, saying "You mess with me, and I'll blow your whole god damned window system out of the water, sucker!!! (make my day) (cancel)".]

In other words, what are the *problems* people use xinit to solve, that make them need to use xinit instead of some other solution? I don't care so much about the particular solutions themselves. [Of course I'm not interested in anybody else's solution, because in my spare time, I'm developing ExitTool, a fully customizable point and click graphical user interface to exiting the window system, which has a special private interclient communication protocol to rendevous with other applications subscribing to compatible desktop metaphors, actually empowering the user to drag'n'drop from YesTool (a full featured graphical adaptation of the classic unix utility), and cut'n'paste from NoTool (actually implemented using trendy and powerful object oriented programming techniques as a *subclass* of YesTool!)]

-Don c(^;

### Some Notes on piewm

An X window manager is a special X program that lets you interact with windows of many other X programs at once. A workstation has resources like the mouse, the keyboard, and space on the screen, that X programs must share.

The window manager usually puts frames around the windows, with controls on them for moving, resizing, and iconifying the window. It provides menus for selecting commands and running programs. It also lets you invoke programs and function from the keyboard or various combinations of mouse clicks and shift keys.

Because they have so many different tasks to perform, and everyone wants them to behave differently, window managers usualy have some sort of customization language. With the "twm" window manager (and its descendants), you can define its behavior by binding events like mouse clicks and keys to build-in functions and external programs. You can create menus and buttons and attach them to window frames and backgrounds. There are zillions of options you can configure, like fonts, colors, patterns, icons, styles, measurements, modes, and all sorts of ideosynchratic behaviors.

The "twm" window manager reads the file called ".twmrc" in your home directory when it starts up. The twm manual explains the exact syntax and all the options in detail. I will briefly demonstrate the syntax by giving a few simple examples.

```
# Comments start with hash marks.

# Set modes by writing the name of the mode:
NoGrabServer

# Set variables by writing the name of the variable, 
# one or more spaces or tabs, then the value.
TitleFont "lucidasans-bold-14"
BorderWidth 1
```

There are all kinds of modes and variables you can set, but many of them are unimportant or simply too bizarre to mention. Look at the commented example .twmrc file to find out about the interesting ones. For some reason, you have to set the fonts and colors before you set the other variables. That's just the way it is, unfortunatly.

The color variables should take on different values depending on whether the screen is color or monochrome. You can set color and monochrome values appropriatly for the screen you're using like this:

```
# If we're on a color screen, use these color settings.
Color {
  BorderColor "slategray"
  DefaultBackground "pukegreen"
  # ...etc
}

# If we're on a monochrome screen, use these color settings.
Monochrome {
  BorderColor "black"
  DefaultBackground "white"
  # ...etc
}
```

There are several other options that require lists as arguments (like lists of cursors, icons, or window names), and they all use braces in the same manner as the "Color" and "Monochrome" commands. Look in the example and the manual to find out more, since most of those options are pretty advanced or esoteric.

The kind of customization you're going to want to do most is defining menus. Each menu has a name and a list of items. Each item has a label and an action. The action is a built-in function that performs some window management task, or pops up another sub-menu, or runs a shell command.

```
# This is a simple top level menu, with entries that invoke submenus.
menu "Windows" {
  "Programs"            f.menu "Programs"
  "Quit"                f.menu "Quit"
}

# This is a menu with entries that invoke shell commands. 
menu "Programs" {
  "Terminal"            !"xterm -sb -sl 500 &"
  "Editor"              !"gnu-emacs &"
  "Adventure"           !"xterm -sb -sl 2000 -e /usr/games/adventure &"
  "Who's On"            !"xterm -sb -e /bin/csh -c 'finger | more ; cat' &"
}

# This is a menu with entries that invoke built-in functions. 
menu "Quit" {
  "Oops, never mind."   f.beep
  "Yes, I'm sure!"      f.quit
}
```

Once you've defined some menus, you still have to tell the window manager what you do to invoke them. Any menu can be invoked as a submenu of any of the other menus, but initially there must be a way to call up the top level menu. To make that possible, you bind it to some input event like a mouse click or function key, in some particular context, like a window frame, button, or background.

Menus aren't the only way to invoke functions -- you can bind input events directly to functions. In fact popping up a menu is just another function. You create a binding by specifying an input event, a set of modifier keys, a context, and a function. The event is the name of a mouse button or function key (Button1, Button2, Button3, "F1", "Home"). The modifier key set specifies which of the modifier keys (shift, meta, control) must be held down to invoke this binding. The context defines where on the screen this binding is in effect (window, title, icon, root, all). The function of a binding is just like a menu action.

```
#Button = KEYS : CONTEXT : FUNCTION
#-----------------------------------------------
Button1 =      : root    : f.menu "Windows"
Button1 =      : title   : f.raiselower
Button2 =      : title   : f.move
Button3 =      : title   : f.menu "Frame"
Button1 =      : icon    : f.iconify
Button2 =      : icon    : f.move
Button3 =      : icon    : f.menu "Frame"
"F1" =         : all     : f.raiselower
"F2" =         : all     : f.iconify
```

Another way you can invoke functions is by clicking on buttons in the title bars of your windows. You can define your own title buttons and bind them to any function. Your buttons are added to the left or right side of the title bar, in the order you specify. To define a button you must give the name of a bitmap file or one of the built-in bitmaps, which is used to draw the button.

```
LeftTitleButton ":dot" = f.iconify
RightTitleButton ":resize" = f.resize
```

The "tvtwm" window manager runs your ".twmrc" file through the "m4" macro preprocessor, defining certain useful constants that describe the envoronment. This allows you to include other files, define macros and symbolic names, and conditionalize parts of your ".twmrc" file depending on the environment. It's very powerful, and it lets you write one .tvtwm file that works across many different systems, but it can get pretty hairy. Read the "m4" and "tvtwm" manuals for more information.

My modified version of "tvtwm" has pie menus. The labels of a pie menu are arranged in a circle around the cursor, and the menu selection is based on the direction you move between clicking the button. They are fast and easy to use because each of the target areas is a large wedge shaped area adjacent to the cursor. You can also display pixmaps as pie menu labels, by using a label beginning with an underscore followed by a bitmap or pixmap file name. You define pie menus the same way as regular linear menus, except using the word "piemenu" instead of "menu". There is an extra optional argument following the menu name and an "@" sign, that specifies the direction of the first menu item, defaulting to 0 (to the right, increasing counter-clockwise). To pop up a pie menu (in a binding or as a submenu), use the "f.piemenu" function instead of the "f.menu" function. Pie menus can be submenus of linear menus, and the other way around, too.

```
# The first item goes at 0 degrees (to the right) and the rest are
# layed out counter-clockwise evenly spaced around the circle.
# (In directions appropriate for their function.)  
piemenu "Pan" {
  "Right"       f.scrollright
  "Goto"        f.menu "TwmWindows"
  "Up"          f.scrollup
  "Home"        f.scrollhome
  "Left"        f.scrollleft
  "Back"        f.scrollback
  "Down"        f.scrolldown
  "Quad"        f.piemenu "Quad"
}

# The first item of this menu will be to the north-east, as the 
# label suggests.  You can select between four quadrants, and the
# virtual screen pans there. 
piemenu "Quad" @ 45 {
  "NE"          f.scroll "+1+0"
  "NW"          f.scroll "+0+0"
  "SW"          f.scroll "+0+1"
  "SE"          f.scroll "+1+1"
}

# The first item of this menu will be at the top, so it's like an
# on/off switch (in the US at least, they're the other way around
# in other countries, so you can change the number after the @ to 
# 270 if it'll make you feel more at home). 
piemenu "Key Click" @ 90 {
  "On"          !"xset c on"
  "Off"         !"xset c off"
}
```

↑ [Sources index](README.md) · [owm.ps source](../../josh-siegel/sources/owm.ps) · [tab.ps + NDE tabs](../code/news-tnt/README.md) · [Josh Siegel's room](../../josh-siegel/README.md) · [1991 ICCCM death match](1991-09-news-tnt-icccm-death-match.md) · [Don's room](../README.md)
