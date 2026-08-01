# JavaScript Pie Menus for Internet Explorer (2001) — XML + DHTML behavior component

Don's 2001 pie menu implementation for Internet Explorer 5+, distributed at
piemenu.com: pie menus as a plug-in Dynamic HTML behavior component
(`piemenu.htc`), specified in XML, rendered in DHTML, scripted from
JavaScript or VBScript. Live copy:
[donhopkins.com](https://www.donhopkins.com/home/PieMenu/JavaScriptPieMenus.html).

## Why this matters

- **The post-Sims web-era implementation.** Written after shipping pie
  menus in The Sims ("the top selling computer game The Sims from Maxis"),
  drawing on "years of user interface research" — the same design lineage
  as the 1986 uwm pies, 1988 NeWS pies, piewm, and TNT/OWM tabs.
- **Fair-comparison instrumentation built in.** Every menu can switch
  between pie and linear modes with the same XML, "to conduct fair user
  interface studies comparing the effectiveness of pie menus with linear
  menus" — plus Fasteroids, a game whose "real purpose is to compare the
  selection speeds and error rates" of the two. The Fitts' Law argument is
  spelled out up top.
- **The anti-patent paragraph, again**: "The ideas behind pie menus are
  not patented or restricted in any way… Don't bother patenting pie menus,
  because the idea has been around for a long time in many forms, and your
  patent will most likely be invalid and easy to challenge." Consistent
  with the [1991 DDJ draft](1991-09-19-ddj-pie-menus-draft-thread.md) and
  the [2007 "why no patent" answer](2007-11-11-james-tobias-why-no-pie-menu-patent.md).
- **The credits list is a receipt** naming the whole chain of support:
  "…Mike Gallaher, Mark Weiser, Jack Callahan, Ben Shneiderman, Mitch
  Bradley, Owen Densmore, Arthur van Hoff, James Gosling, Ted Selker,
  David Liddle, Brad Meyers, Bill Verplank, Craig Hubley, Bob Adams,
  David Levitt, Russel Nelson, John Gilmore, Hugh Daniel, **Josh Siegel**,
  Mary Hopkins, Levi Kruger, Jim Mackraz, Eric Bowman, Jamie Doornbos and
  Will Wright."
- **Second Choice** credits the MIT Media Lab "Cheese" demo for
  penultimate-choice timing; **Punkemon** shows XSL transforming an XML
  card database into a tree of pie menus.
- **The source is cached in this repo**:
  [`../code/javascript-pie-menus/`](../code/javascript-pie-menus/README.md)
  — `piemenu.htc`, Fasteroids, Punkemon, the schema editor, and the demo
  XML, verbatim from piemenu.com's archive.

## HN retellings

Where Don has linked this page or its code. Broader sweep:
[HN harvest](hn-window-management-harvest.md).

| Comment | Thread | What it adds |
|---|---|---|
| [2021-05-26](https://news.ycombinator.com/item?id=27288024) | Use native context menus on Mac OS | Why bet on browser APIs over niche toolkits ("quite clear to me in 1997"); links this page, [piemenu.htc](../code/javascript-pie-menus/piemenu.htc), [punkemon.xml](../code/javascript-pie-menus/punkemon.xml) + [xsl](../code/javascript-pie-menus/punkemon.xsl) |
| [2021-06-06](https://news.ycombinator.com/item?id=27411115) | Browsers standardizing plugins | "Plugin" vs "component" as historical accident, not CS category; links this page, piemenu.htc, and the earlier ActiveXPieMenus |
| [2015-04-26](https://news.ycombinator.com/item?id=9442098) | TrackPoint (2011) | Windows "Flicks" are pie menus by another name; links the [JavaScriptPieMenus.mov](http://donhopkins.com/home/movies/JavaScriptPieMenus.mov) demo video beside the HCIL 1991 and Sims pie menu films |

## The document, verbatim

```
JavaScript Pie Menus for Internet Explorer
By Don Hopkins ("xardox@mindspring.com")
What Are Pie Menus?
Pie menus are a naturally efficient user interface technique: directional selection of pie slice shaped targets. The cursor starts out in the center of the pie, so all targets are large, nearby, and in different directions. Fitts' Law explains the advantages of pie menus, relating their fast selection speed and low error rate to their large target size and small distance. Pie menus are easy for novice users, who just follow the directions, and efficient for experienced users, who can quickly "mouse ahead" once they know the way.

Why Pie Menus?
Q: Besides the obvious fact that Pie Menus are much faster and more reliable than linear menus, why is this new implementation of Pie Menus so compelling?
A: Because of the synergistic way that Pie Menus combine and leverage the capabilities of XML, DHTML, JavaScript, ActiveX and Internet Explorer.
Pie Menus are faster and more reliable than linear menus, because all of the items have large wedge shaped target areas, and each one is located adjacent to the cursor, but in a different direction. (More details.)
Pie Menus are specified in XML, so designers can easily understand and create them in a text editor, as well as using XML processing tools like XSL. (More details.)
Pie menus are easy to configure and customize in many ways, with default attributes that can be easily overridden and specified for a whole menu or any individual item. (More details.)
Pie menus are rendered with Dynamic HTML, which defines the appearance of the pie menu center and items, that is embeded inside of the XML specification, and can be dynamically modified in response to tracking events. (More details.)
Pie menus provide automatic adaptive layout (good look), and versatile reliable tracking (good feel), with callback hooks to provide rich real-time interactive application specific feedback (direct manipulation). (More details.)
Pie Menus are tightly integrated with the Internet Explorer web browser and ActiveX scripting environment, so they can leverage all of its capabilities, present and future. (More details.)
Pie Menus are FREE and UNRESTRICTED, so you may use them freely, and modify the source code as well as the design for your own purposes, even in commercial products and web sites. (More details.)
JavaScript Pie Menu Demos
Here are some examples that demonstrate the capabilities and advantages of pie menus. In order to run, they require Internet Explorer version 5 or above.

Test Pie Menus (uses testpiemenus.xml)
This demonstrates various kinds of simple pie menus, including an eight item menu, and submenus with different numbers of items.

It shows how to make pie menus on a web page, by using a Dynamic HTML "DIV" element, and setting the style attribute "behavior:url(piemenu.htc)" to create a pie menu behavior component. The content inside the "DIV" serves as a target that you click on to pop up the pie menu.

You can specify attributes that are passed as parameters to the pie menu. There are several event handler attributes like "onselect" and "onchange" for attaching JavaScript or VBScript code to the pie menu, in order to respond to high level user interface events that the pie menu behavior component generates.

The optional "piemenu" attribute indicates the id of the XML pie menu specification to use. Or you can simply embed an XML Data Island inside of the pie menu's DIV element, using an "XML" element.
The XML data that defines the pie menus can appear inline on the web page, or can be downloaded from an external XML file, or it can even be dynamically generated through the use of XSL, JavaScript, databases, etc.

Style Pie Menus (uses stylepiemenus.xml)
This demonstrates how pie menu tracking handlers written in JavaScript can dynamically change the appearance of the web page during tracking, to provide real-time interactive application specific feedback (direct manipulation).

It shows how you can easily integrate pie menus with other basic web technologies such as JavaScript, Visual Basic, Dynamic HTML and Cascading Style Sheets.

Direct Animation (uses directanimation.xml)
This is a demonstration of how you can easily integrate pie menus with other advanced web technologies like Direct Animation, to provide rich animated graphics and feedback.

Second Choice (uses secondchoice.xml)
Inspired by the "Cheese" demo at MIT Media Labs, this demonstrates how pie menus can try to guess at your second favorite choice, by timing how long you point at each item.

Linear Menus (uses linearmenus.xml)
This demonstrates how pie menus support both directional and linear menu items, or a combination of both.

Directional pie menu items are arranged in a circle around the cursor. Linear menu items are arranged to the left or right in a row, or up and down in a column.
It also demonstrates how pie menus can limit the number of directional items, and treat any extra overflow items as linear items.

One benefit of this implementation's seamless support for both linear and pie menu items, is that it makes it straightforward to conduct fair user interface studies comparing the effectiveness of pie menus with linear menus. The same menus can easily be switched between pie and linear modes, and callbacks can take statistics on browsing and selection time. This enables user interface researchers, web site designers and usability specialists to measurably demonstrate the effectiveness of pie menus over linear menus.

Another benefit is that even when you decide to use linear menus, you can still enjoy all the other advantages of XML, Dynamic HTML and web browser integration that this implementation provides.

Punkemon Pie Menus (uses punkemon.xml and punkemon.xsl)
This demonstrates how pie menu XML definitions can contain embeded Dynamic HTML to define their appearance. You can take full advantage of the web browser's capabilities, including Dynamic HTML, animated GIFs, Cascading Style Sheets and tables. Pie menu items and centers can be any size, and they can incorporate arbitrarily complex formatted multimedia documents.

Furthermore, it demonstrates how pie menu event handlers, written in JavaScript or VBScript, can respond to user input to provide rich feedback. You can dynamically change the JavaScript object properties, Dynamic HTML content and Cascading Style Sheet styles of the pie menu center, items and web page, to provide the user with rich, engaging interactive graphical feedback.

It also demonstrates how you can use an XSL style sheet to dynamically transform an application specific XML document (a database describing Punkemon character playing cards) into a web page with a complex tree of pie menus. The XML pie menus are programatically generated from the XML database by an XSL style sheet.

Pie Menu Schema Editor (uses piemenuschemaeditor.htc, piemenuschemaeditor.xsl, and piemenuxmlschema-1.0.xsd)
This is a pie menu editor, implemented as another Dynamic HTML Behavior Component. It lets you browse a tree of pie menus defined in XML, examine and edit any property of any pie menu or item, totally customize the look and feel of the user interface, then see what your pie menus look like and try them out.

It demonstrates the versatiliy of representing pie menus as XML, by browsing and editing the XML pie menu definitions directly. The editor dynamically generates a Dynamic HTML user interface based on a separate file containing an XML Schema, that allows you browse the tree of pie menus and items and edit any of their properties.

It also demonstrates the use of XSL for transforming a pie menu specification into a web page containing a pie menu editor on that pie menu. Any XML file containing a pie menu definition can point to the pie menu editor style sheet. When you open it up in Internet Explorer, it will dynamically generate a web page for editing the pie menu.

Fasteroids (uses fasteroids.htc)
Fasteroids is a free game using both pie menus and linear menus!

The goal of Fasteroids is to help the space ship blast away the asteroids. But its real purpose is to compare the selection speeds and error rates of directional "pie menus" versus traditional "linear menus". The actual point of the game is to give you a fun and fair way to test drive and compare pie menus and linear menus for yourself.

Supporting Details
Pie Menus are faster and more reliable than linear menus.
In scientific experiments comparing Pie Menus with linear menus, Pie Menus have been shown to be signifigantly faster and to have a lower error rate than linear menus.
Fitts' Law explains why pie menus are better than linear menus: because their item target areas are large and all adjacent to the mouse. The larger the target area and the closer the target, the faster you select with fewer errors.
Pie menus are optimized to exploit Fitts' Law, and linear menus are not; therefore linear menus are slower and more error prone than pie menus.

Pie Menus are specified in XML.
Standard, simple syntax for describing arbitrarily nested trees of pie menus. The syntax of XML pie menus is very obvious and easy to read, learn, modify and create.
Pie Menus are configured with reasonable defaults, so the XML menu descriptions are concise. And designers can easily override the defaults, and customize the properties, behavior and visual appearance of any pie menu, item or submenu.
XML Pie Menus can be automatically generated and used by many XML tools and applications, including XSL style sheets, web servers, databases and XML editors.
The Punkemon Pie Menus example shows how to use an XSL style sheet (punkemon.xsl) to automatically transform an XML database (view source of punkemon.xml) into a web page with nested pie menus (Punkemon Pie Menus).

Pie menus are easy to configure and customize in many ways.
Pie menus have default attributes that can be easily overridden and specified for a whole menu or any individual item.

Pie Menus are rendered using Dynamic HTML.
Arbitrary Dynamic HTML can be embeded in XML Pie Menu specifications, to define the appearance of the pie menu center and items. Anything you can describe in DHTML can be used to make pie menus.
Pie menus support arbitrarily shaped images in the pie menu center and items, as well as dynamic control over the background appearance, highlighting and transparency effects.
Pie menu callbacks can dynamically alter the content and appearance of the pie menu center, items and web page in response to user input. The Style Pie Menus demo shows how the pie menu callbacks can dynamically modify the properties of the text on the web page, to provide immediate and intuitive feedback.
Pie menus can be easily integrated with ActiveX, DirectAnimation, JPEG, animated GIF, PNG, MPEG, QuickTime, Flash, Java, and many other technologies supported by Internet Explorer. The Direct Animation demo shows how you can easily integrate pie menus and interactive structured graphics created with Direct Animation.
The Punkemon Pie Menus demo shows how pie menus can incorporate animated GIF images and dynamic HTML effects like scaling, as well as large pie menu items containing HTML tables and formatted text.

Pie menus have powerful user interface and sophisticated automatic layout features.
This implementation of pie menus draws from the first hand experience of using pie menus on a daily basis, performing years of user interface research, testing and refining their usability, developing pie menus for various gui toolkits, as well as shipping them in commercial products, including the top selling computer game The Sims from Maxis.
Supports penultimate choice tracking, inspired by the "Cheese" system demonstrated at MIT Media Labs. The Second Choice demo shows how pie menus can try to guess your second favorite choice, based on the amount of time you spend pointing at each menu item.
The direction and distance of cursor motion may be used as a continuous dynamic argument to the menu selection. This is useful for pulling out to select a font size with distance, rotating around to select an angle, or picking from a continuous color wheel.
Pie menus and items have many customizable parameters to control the layout, visual appearance and tracking behavior of every pie menu and item.
Pie menus support browsing arbitrarily deep nested submenus.
Supports an arbitrary number of pie menu or linear items, as well as limiting the number of pie menu items and overflowing extra items into linear menu items.
You can even create hybrid menus with a mixture of pie and linear menu items in the same menu, as well as pure linear and pure pie menus, pie menus with linear submenus, and linear menus with pie submenus.
Supports the layout out linear menu items in four directions (up, down, left and right), as well as centered in the middle of the menu.
The Linear Menus demo shows hybrid pie menus with linear overflow items, as well as various linear menu styles.
The XML pie menu specifications support the sharing of menus by inline nesting in the XML tree, indirect id reference, direct text inclusion, and external file references. This makes it possible to create libraries of reusable pie menus, and easily distribute and deploy them on the web.
The Test Pie Menus demo shows how to use indirect references to share pie menus in the same xml file, and load submenus from external xml files. The xml file testpiemenus.xml includes clockpiemenu.xml, and the clock pie menus uses an internal reference to share the minute submenu between all the different hour items.

Pie Menus are tightly integrated with the Internet Explorer web browser and ActiveX scripting environment.
Pie menus integrate seamlessly with Internet Explorer through ActiveX, so they can leverage all of its capabilities, present and future.
Pie menus are implemented as a modular plug-in Dynamic HTML Behavior Component, so it's easy to create pie menus on web pages without understanding the internal implementation. The piemenu.htc file actually contains XML that defines an ActiveX object interface with its own properties, methods and events, and JavaScript code that implements it.
It's easy to distribute applications that use pie menus over the Internet, since they run in the web browser and are configured by downloading xml.
Pie Menus are configured with XML Data Islands that can be embeded on the web page, downloaded from separate file references, generated dynamically from an XML database or web server, or procedurally generated with XSL style sheets, JavaScript, etc.
XML is a widely used, well supported data format that is excellent for describing the hierarchal tree structure of pie menus and items with nested submenus, as well as embedded XHTML content to describe the presentation. The XML "piemenu" and "item" elements nest inside of each other to build arbitrary menu trees, with "html" elements containing arbitrary Dynamic HTML. The elements may be assigned many attributes, but they all have reasonable default values, so you only have to specify the ones you need. The pie menu items inherit many of their default attributes from their parent piemenu, so you can specify properties for the whole piemenu, and override them for any individual item.
Dynamic HTML is a flexible, well known, widely supported and graphically expressive markup language, used by pie menus to define their visual appearance and interactive behavior. Pie menus support the XML-based XHTML standard, which is the new XML compliant version of Dynamic HTML, because it cleanly nests inside of XML pie menu specifications, and is easily generated by XSL style sheets and other XML processing software.
The pie menu component supports a full set of callback events, so JavaScript of VBScript code on the web page can dynamically track pie menu browsing and selection, to implement selection handlers and rich interactive application specific feedback.
The Pie Menu Editor demonstrates a Dynamic HTML user interface for interactivally editing and testing Pie Menus, in terms of their underlying XML specifications.
JavaScript pie menus are freely available, and implemented as a reusable Dynamic HTML behavior component. This modular approach cleanly separates the JavaScript pie menu implementation from the XML pie menu specifications, from the DHTML web page presentations, from the JavaScript pie menu editor, from the XML pie menu editor interface specification metadata, and from the JavaScript event handers.

Pie Menus are FREE and UNRESTRICTED,
Pie Menus are designed to be free, easy to learn, teach themselves, save time, reduce errors, prevent frustration, provide rich expressive feedback, support robust real-world applications, integrate easily into diverse workflow environments, serve as a free software design example as well as an inspiration for further research, and as a benefit to project managers, software developers, academic researchers, computer programmers, usability specialists, user interface designers, web browsers, game players, students, hobbiests, hackers, busy people with tight deadlines, limited budgets and ambitious projects to deliver, people who have better ways to spend their life that pushing a mouse around, pointing and pecking at tiny targets like trained chickens: most importantly the users.
You may use and modify the source code as well as the design for your own purposes, even in commercial products and web sites. You are only required preserve the copyright message.
Pie Menus for Internet Explorer 5.0 JScript. Copyright (C) 2001 by Don Hopkins. All rights reserved. Designed and implemented by Don Hopkins, ("xardox@mindspring.com"). Distributed at "www.piemenu.com".
This program is provided for unrestricted use, provided that this copyright message is preserved. There is no warranty, and no author or distributer accepts responsibility for any damage caused by this program.
The ideas behind pie menus are not patented or restricted in any way, and the interface and algorithms may be freely copied and improved upon. Don't bother patenting pie menus, because the idea has been around for a long time in many forms, and your patent will most likely be invalid and easy to challenge, therefore a waste of time and money. It would be much better to spend your resources innovating new ideas and developing great products instead of trying to patent obvious old ideas.
This code and the ideas behind it were developed over time by Don Hopkins, thanks to the support of: University of Maryland, UniPress Software, Sun Microsystems, DUX Software, Turing Institute, Carnegie Mellon University, Kaleida Labs, Interval Research Corporation, Maxis Software, Electronic Arts, Lush Creations, Mike Gallaher, Mark Weiser, Jack Callahan, Ben Shneiderman, Mitch Bradley, Owen Densmore, Arthur van Hoff, James Gosling, Ted Selker, David Liddle, Brad Meyers, Bill Verplank, Craig Hubley, Bob Adams, David Levitt, Russel Nelson, John Gilmore, Hugh Daniel, Josh Siegel, Mary Hopkins, Levi Kruger, Jim Mackraz, Eric Bowman, Jamie Doornbos and Will Wright.

Credits and Fine Print
For the complete credits, as well as some swell entertainment, please don't forget to read the fine print.

Amazon Honor System
By Don Hopkins (xardox@mindspring.com)
```

↑ [Sources index](README.md) · [pie menu timeline](pie-menu-timeline.md) · [1991 DDJ draft](1991-09-19-ddj-pie-menus-draft-thread.md) · [why no patent](2007-11-11-james-tobias-why-no-pie-menu-patent.md) · [Don's room](../README.md)
