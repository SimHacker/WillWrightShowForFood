# Simcity For Olpc -- Sugar Integration Ideas

*1 messages — verbatim from lots-of-chat.txt scoop.*

## 1 · Don Hopkins <dhopkins@DonHopkins.com>

        **Date:** 21 December 2006 at 12:29:15 GMT+1  
        **Subject:** Re: SimCity for OLPC -- Sugar integration ideas  
        **To:** walter@laptop.org, Don Hopkins <dhopkins@DonHopkins.com>, Will Wright <willdude@gmail.com>, John Gilmore <gnu@toad.com>

        Walter Bender wrote:
This all sounds great. Let me mull over your trivial to blue sky list on the flight home tomorrow. Shall we plan to talk between Christmas and New Years?

-walter

That will be a great time to talk!

Since I've been working on this project a long time, I have a bunch of old ideas and notes about stuff I'd love to do with SimCity, a lot of which is much easier to do now that the technology has matured. 
And I read over the wiki about the Sugar interface and thought of all kinds of new and interesting ways SimCity could take advantage of Sugar's design and features.
I'd like to know which you think are important features to focus on first, please. 

I think the journaling/storytelling angle is extremely important, and powerfully educational. 
Please check out what The Sims Exchange has done by enabling players to publish Family Albums (players take in-game screen snapshots, write stories in their Family Albums, and publish them on the web, along with save files that other players can download and play with). 

http://thesims.ea.com/us/exchange/

In the long term, I think we could totally rethink the approach to cooperative multi player SimCity, in the context of the grid network and Sugar interface, applying ideas about user generated content, journaling, storytelling, web publishing and blogging, "Massively Single Player Games",  inspired by ideas and lessons from Will Wright's other projects like The Sims Exchange, The Sims Online and Spore. 

http://en.wikipedia.org/wiki/Massively_Single-Player

I think the original version of SimCity rang like a bell, and has this wonderful approachable simplicity that was lost in the later more advanced versions. 
I've been careful not to do anything that breaks the original algorithms and game play, and I've tried to extend it in ways that maintain the original design and simplicity as much as possible. 

For example, for the multi player version, it would have been too complex to add the concept of zone ownership to the user interface and simulation. So instead, all the players are on the same "team", share the same funds and glories and disasters, and have to agree unanimously on building expensive zones and changing the tax rate. I layered a cooperative political game on top of SimCity with conferencing and voting interfaces, instead of changing the simulation itself, or trying to support player -vs- player competition. I wanted it to be useful for teaching and exercising social, planning, writing and debating skills. 

Here are some more ideas from some notes I made about multi player SimCity and Sugar! 

    -Don



I updated the code and fixed a few bugs, and now have multi player SimCity compiled on the latest version of Redhat Linux (Fedore Core 6), and running (fast!) on X11 under the VMWare virtual machine on my Windows laptop. 
If anyone's interested, I can give you a copy of the VMWare disk image that you can run in the free VMWare player. 
(It's kinda big, since it includes an entire Linux operating system and development environment, but I can put it up for ftp on my server, or meet you with a disk drive some time.) 

I'm available to discuss this by phone any time this week, or in person on Monday or Friday (or during the weekend). 
Is there a good time this week to discuss this with John Gilmore too? 

Here are a few people who I think will be interested in Open Source SimCity for the One Laptop Per Child project. 
I'd like to solicit their help and advice. When do you think would be a good time to contact these people about it? 

Mike Perry, long time Maxis employee, developed the SimCity ActiveX control, and all around great guy who introduced me to Parappa the Rapper. 
http://forio.com/cgi-bin/links/dclinks.cgi?action=rate&id=269 

Ted Selker, MIT Media Lab, invited me to demonstrate Multi Player SimCity to Media Lab sponsors a few years ago, involved with OLPC, co-director of MIT/Caltech Voting Project, friend of Will's. 
selker@media.mit.edu 
http://web.media.mit.edu/~selker/ 

Upmanu Lall, Columbia University Earth Science Department, invited me to New York to discuss simulation software a few years ago, interested in educational uses of SimCity. 
ula2@columbia.edu 
http://www.columbia.edu/~ula2/ 

Eric Scharff, Institute for the Study of Society and Environent, write PhD thesis about open source software, and discussed the uses of SimCity source code. 
scharff@atd.ucar.edu 
http://www.isse.ucar.edu/scharff/ 

Doreen Nelson, Maxis employee who worked on SimCity, and wrote curriculum guides for teachers. 
doreennelson@earthlink.net 
http://www.csupomona.edu/~dnelson/doreen.html 

Alan Kay, involved with OLPC, MIT, UCLA, invented OOP, and did all kinds of other cool stuff. 
http://en.wikipedia.org/wiki/Alan_Kay 

   -Don 


Here are some ideas and notes I've written on how the OLPC human 
interface guidelines could be applied to multi player SimCity.

It seems like a match made in heaven! 

   -Don 

http://wiki.laptop.org/go/OLPC_Human_Interface_Guidelines 

The multi player version of SimCity fits nicely into the focus of the OLPC user interface: collaboration and expression, journaling and iteration. 

Activities, not Applications. 
 Focuses on activities, not applications or documents or files. (Building and playing with a city.) 

Presence is Always Present 
 Collaboration is the core of the user experience. (Multi Player SimCity has SimPolitics: an interpersonal game layered on top of SimCity.) 
 Exchanging ideas among peers. (Voting on city development and policy. Chat, chalk board map overlay, voting dialogs. Make a proposal, convince other people to support it.) 
 Focuses on the creation of some type of object (a city). 
 Exchange ideas among peers (import and export cities, and share live cities, over the network). 
 Send friends a link to your city: a live link that allows them to join and play with your own city, or download a clone of your city and play it themselves. 

Tools of Expression 
 Creative expression. (Enhance conferencing interface with support for journaling, storytelling, publishing, etc.) 
 Collaborative critique of expression, iterate upon expressions. (Checkpoint and restore city state (rewind history and do-over), and exchange saved cities over the net. Write notes and comments on your own and other peoples cities.) 

Journaling 
 Make a rich chronicle of all activities. 
 Enhance the simulation to journal all interesting events, that script writers can handle and respond to, as well as raw and cooked data that players can export an analyze. 

Performance, Usability, Simplicity, Reliability 
 Pie menus are fast, reliable and self revealing, and have been successfully used in SimCity and The Sims. 

Recoverability 
 Fundamental to encouraging exploration. Journaling, checkpointing, rewinding and replaying edits. 

Audience: 
 Inexperienced children. Support exploration, discovery, experimentation, expression. 
 Discoverable, intuitive, clear interface metaphors. 
 Activities that scale well across all age levels. 

Zoom metaphor: 
 Zoom in and out of the mesh community: Neighborhood / Friends / Home / Activity 

Bulletin Boards, Spatially Contextual Chatting Interface, an Environment for Sharing, 

Hardware: 
Make efficient use of CPU power and memory. 
Support monochrome and color displays. 

Software: 
 Transparency. View source. Python scripting language. 
 TODO: Replace TCL interpreter in SimCity with Python, and use SWIG to interface scripting langauge(s) with C code. 

The Frame Components and Organization 
 Current view in the middle. (overall map with overlays, close-up map editor, graphs, notices, details, etc) 
 Top edge: Places (cities, map locations) 
 Bottom edge: Actions (editing, control, notification) 
 Left edge: Objects (buildings, saved cities, etc) 
 Right edge: People (other players, collaboration, publishing) 

The Multi Player SimCity interface focuses on collaboration, conferencing, and shared creative expressing and cooperative design and building. 

Journal and time stamp the simulation events, chat log, editing commands and chalk board drawings. 
Publish your journal, so other people can read and review and comment on your decisions. 

Sharing cities: 
Enable players to checkpoint and rewind city histories, easily exchange cities over the net, and compare the results of the simulating same city under different conditions. 

Storytelling and publishing: 
Apply the lessons learned from the web based chat enabled ActiveX version of SimCity, The Sims Exchange, and The Sims Online. 
Add a text and graphical note overlay to SimCity maps. 
Place signs and time stamped notes on the map. 
Publish maps with stories and drawings attached. 
Geo-blogging: RSS feed of time stamped geo coded blog postings on a SimCity map. 




Multi Player SimCity / Sugar Integration Ideas:
print dialog
  Newspaper printing and publishing metaphore. 

  Optionally save a snapshot of the city state, to link to from the newspaper article. 

  Publish in newspaper, print on paper, save to disk, copy to clipboard, 
  add to journal, blog, etc.

  Allow user to enter text to be printed along with an image, like blogging. 
  Can print any map or editor view with data overlay and chalk drawings, 
  entire map (fit on one page, or split across multiple pages), 
  or other windows like graph, evaluation, notices, messages, chat log, etc. 

  Export text content as html with embedded images. 

  Make an html/image city overview and journal, like The Sims family view and scrapbook. 

  Printable windows and views should have a "print" button or function that pops up a 
  pie menu of possible destinations, for quickly making snapshots in your journal, etc.

  Publish illustrated newspapers in the game, like The Sims storybook, with newspaper 
  articles composed of pictures of the city, text excerpts from chat logs, etc. 

  A player could be a "reporter" interviewing other player politicians via chat,
  before and after the vote on building a stadium, asking them to make their case for
  or against the stadium, and publish the interviews in the game's newspaper, the
  "SimCity Journal".

  Players can browse each others newspapers over the net, and download the city snapshots 
  the articles write about. 

  Flash: Monster invades SimCity, near nuclear reactor! 
  (story and link to saved city so you can read the story, then bring up the city and 
  play it live from the point the story was written)

network city browsing and sharing
  "What-If?" history tree.
  Publish your cities on the net.
  Download other peoples cities.
  Use a URL to point to a saved city. 
  Grab a live snapshot of somebody's running city.
  Checkpoint and branch timelines.
  Save a city back to the point where it branched, 
  to create an alternate history that other players can load.
  Multiple players build a tree of saved cities with branching alternate histories.
    Like the parallel universes in Niven's All the Myriad Ways.
  Rewind any city up the tree and select available alternate histories at each branch point. 
  Play back alternate histories edit by edit, stop them at any point and take over, 
  making a new branch point at that location.
  When you play together in the same city, you have to discuss and agree with other players 
  about what to do, and convince other people of your ideas.
  You can try an idea out yourself, by branching your own private history, 
  giving your idea a try, and reporting back to the other players in the main shared timeline
  what happened (with links to the save file and history so other players can see for themselves). 
  GUI: Branching history tree outline viewer of saved files. 
  Drag and drop a history point into the chat log which other players can click on to open a 
  live view playing that history. 

Keep and export logs of simulation values
  r, c, i demand
  evaluation
  tax rate, collected
  funds
  funding levels
  event logs
    simulation events
      extend simulator to log all interesting simulation events, 
      so newspaper reporters can write stories about them
    editing commands
      Log enough information to replay all edits against a save file to recreate same city.
      This is the key to high level multi player protocol between
      multiple parallel lock-step simulations, like The Sims Online,
      better than using low level x11 to implement the multi player
      interface)
      Treat any editing command as a "what-if" branch point where it could go another way.
      Give players an easy interface to replay a simulation up to a branch point, and 
      and re-make the decision, to see how it would turn out differently. 
  chat logs
  everything else of course
  web service to access logs
  export logs as xml for programs or csv for spreadsheets
  import and export chalk overlay as vector drawing
  support image overlays with transparency (begs for photoshop-like drawing interface)?
    Careful how far down that road you go, because you could use it to paint the image of
    a happy emerald green city over a dreary industrial wasteland. 
    The simple white chalk overlay has the advantage that you always know what's chalk and what's not. 
  opml outline with geo-codes
    store city overlay information in opml
    register the corners of the map with real-world lat/long values
      allow rotation and scaling but not arbitrary shearing or distortion
    register nodes of the opml outline at lat/long points and areas on the map
      what's a good way to associate an opml node with an arbitrary area on the map? 
      an attribute with a polygon in lat/long coordinates?
      a list of rectangles in lat/long coordinates?
      a list of tiles in row/col coordinates?
    associate geo-coded opml nodes with features on the map like 
    zones, buildings, streets, neighborhoods
      use opml nodes to give names to features, 
	take notes about them, 
	attach pictures to them,
	write stories about them,
      support overlapping features, so roads can cross, 
      and each tile can belong to any number of features.
    allow users to plant signs on the map, like simcity 2000. 
      represent signs with an opml node. 
        signs can contains arbitrary opml outlines
          with links to other opml nodes
	    like a sign at a crossroad, linked to the nodes representing each road, 
	    and the regions of the city that the roads bring you to.
      use opml to write a city guide
      attach chalk overlays and signs to opml nodes so you can show and hide them hierarchically






Don Hopkins wrote:
Hello, Rod. Thanks for responding and contacting me about this! 
Will, I really appreciate your support and initiative, and thank you for creating SimCity in the first place, and letting me tinker around with it! 

My phone number is (510) 418-4968, and I'm in Berkeley. 
John Gilmore's phone number is (415) 221-6524, and he's in San Francisco. 

Here are some pictures:

SimCity for Unix running in the HyperLook environment on the NeWS window system:
http://www.donhopkins.com/home/images/HyperLook-SimCity.gif

SimCity for Unix running on the X11 window system:
http://www.donhopkins.com/home/images/SimCity-For-X11.gif

Multi Player SimCityNet running on three different X11 displays (SGI Indigo, NCD X Terminal, Sun):
http://www.donhopkins.com/home/images/SimCity-Indigo.gif
http://www.donhopkins.com/home/images/SimCity-NCD.gif
http://www.donhopkins.com/home/images/SimCity-Sun.gif

My background is in user interface design and programming. 
I designed and developed pie menus at Ben Shneiderman's Human Computer Interaction Lab at the University of Maryland, and worked on the HyperTIES hypermedia browser and authoring tool. 
Jack Callahan, Mark Weiser, Ben Shneiderman and I published a paper at CHI'88 about an experiment we performed showing pie menus to be significantly faster and less error prone than linear menus. 
Professionally, I worked on the Emacs extensible text editor at UniPress, the NeWS Open Look user interface toolkit at Sun, SimCity for DUX Software, the HyperLook user interface environment at the Turing Institute, the ScriptX multimedia programming language at Kaleida, secret fun stuff at Interval Research, The Sims at Maxis, Slats' robot brain and talking toys at the Stupid Fun Club, and I'm currently working on the OpenLaszlo "AJAX" web user interface programming language (among other stuff). 

When I first played SimCity on a Mac at HCIL in the late 80's, it hugely inspired and affected me in many ways, on many levels. 
As a user interface designer, programmer and researcher, I was intrigued at the possibilities it suggested, and I had a lot of ideas that I really wanted to try out with SimCity: 
Pie menus, information visualization, cooperative multi player collaboration, conferencing, voting and building, visual programming, and open-ended extensibility with a scripting language, to control and monitor the simulation, and integrate it with other applications. 

I met Will in 1991, when I was working for DUX Software, who licensed the rights to distribute SimCity on Unix.  
Once I finally had a chance to try out my ideas, I put many years into porting the original Mac version of SimCity to Unix workstations (twice), and developing two products that we distributed over the early Internet:

The first version was for the NeWS window system on SunOS and Solaris, using the HyperLook user interface system that I helped develop at the Turing Institute.
We released the HyperLook version of SimCity as a product, and sold it over the Internet via FTP in 1993.
It had an unlockable demo that let you play for a few minutes then melted the city, compelling you to call the 800 number and buy a license over the phone to unlock the game.

The second version was for the X11 window system, using the TCL/Tk scripting language and gui toolkit.
TCL/Tk provided scriptability and a nice network based gui toolkit, which I used to design and implement a cooperative multi player user interface.
I then ported it to various platforms like SunOS/Solaris, SGI Irix, HP/UX, DEC OSF/1, NCD X Terminal, Desqview/X, Linux, etc. 

We sold multi player "SimCityNet" as a commercial product online and by mail order, distributing a fully playable time limited demo via CDROM and FTP download, with unlockable single or multi player capability, and a node locked or floating network license. 

DUX handled selling the license keys by credit card over the phone and mail order, and I did all the user interface design, programming, documentation, installation, CD layout, Internet publication, online promotion, demos, etc. 
I've demonstrated the multi player user interface at various trade shows, academic conferences like SIGCHI InterCHI'93 Interactive Experience, and to the public at Interval Research's "Electric Carnival" at Lollapalooza. 

SimCityNet: a Cooperative Multi User City Simulation (InterCHI'93 Interactive Experience Proposal)
http://www.art.net/~hopkins/Don/simcity/simcitynet.html

In 1997, Will invited me to work on The Sims at Maxis with his small team in San Mateo. 
I developed the character animation system, visual programming tools, house editing tools, user interface and pie menus (of course). 
Before we shipped, I developed the "SimShow" tool that enables players to make their own skins.
After we shipped, I developed the "Transmogrifier" tool that enables players to make their own objects. 
Later I helped with The Sims Online by porting The Sims source code to Linux. 

The contract between DUX Software and Maxis to sell SimCity for Unix has long since expired (it had a limited term that was up around the turn of the century, and DUX is no longer in business), so I can no longer sell the product I developed. 
I still have the source code, which I have ported to Linux, and optimized to run impractically fast (on an old 500 MHZ laptop, it can simulate 1000 years per minute or 1,000,000 years in under a day). 

When it's running so fast, it's extremely important to keep your fire department fully funded, because fires can spread through the whole city in the blink of an eye! 
It's actually quite fun and exciting to run the simulation at high speed, and I've designed the user interface to support a real time "twitch game" style of play, so multiple players can work together without interrupting each other:

The gestural pie menus make it much easier to quickly switch tools and edit the map without moving the cursor back and forth to the tool palette. 
The field that displays the year and month blurs the month and lower digits when it's running fast, so it doesn't have to update the screen every month. 
The tax rate dialog doesn't pause the game, so you can drag the taxes up and down while it's running, and watch the buildings (and your coffers) instantly rise and fall in real time. 
The map overlays are partially transparent, and you can open up multiple overall map windows with different overlays, and multiple close-up editors on different parts of the map. 
When a notice pops up about a problem in the city, it includes a live map view that you can click on to scroll your main map to that location. 

The intent of my design for the multi player SimCity user interface was to introduce collaboration, conferencing, interpersonal politics and gridlock into the game, but not to change the way the simulation worked in any way (don't mess with a good thing). 
When there are multiple players, everyone must vote unanimously on building expensive zones like stadiums or power plants, or changing the tax rate. 
Any player can place a building proposal, but instead of instantly creating it, the proposed building bounces up and down in the air over the lot, to attract everyone's attention. 
A non-interruptive dialog opens up on everyone's screen to vote on the proposal, with an inset live view of the bouncing building. 
Players don't have to respond immediately -- they are free to keep doing whatever they're doing and ignore the proposal. 
Once everybody votes yes (by clicking the vote button or building the same building in the same spot), the building finally settles down to earth and opens up for business. 
In the mean time, players can plead their case, argue about the proposal, make different proposals, and discuss other issues via text chat and by drawing on the map with the chalk overlay tool. 

The "Dynamic Zone Finder" is an interactive "Information Visualization" feature I added to SimCity, inspired by Chris Williamson's and Ben Shneiderman's "Dynamic Home Finder".
SimCity maintains many layers of additional information about the state of the city, and the zone finder lets you perform real-time dynamic queries on that data, intuitively displaying the results on the map. 
It has a "washboard filter" with a bunch of min/max range sliders that filter the zones along many dimensions like pollution, land value, population density, traffic, crime rate, distance to a police or fire station, etc. 
You can combine filters to see which zones have high traffic, pollution and crime rate, or close to fire and police stations, medium land value, low but non-zero population density, etc. 
As you slide the minimum and maximum ranges of the filters around, the map dynamically animates so you can see regions expanding and contracting, and spot trends and patterns.
And it looks really cool when the simulation's running really fast and the filtered results animate in response to changes in the simulation, as well as changes to the query. 

One of the most interesting and powerful aspects of this version of SimCity is that it has a built-in scripting language (TCL/Tk). 
Scriptable SimCity opens up a huge range of possibilities, and that's how I was able to implement the multi player user interface, talking pie menus, information visualizations, and other features. 

Beyond user interface and simulation programming, the scripting language in SimCity has many practical educational uses. 
For example: Columbia University's Earth Science department is interested in using a SimCity in their courses. 
They would like to take advantage of a scripting language in SimCity so students can configure and run controlled experiments, collect data, and export it into spreadsheets to analyze with other tools. 
SimCity encourages experimentation, stimulates discussion and motivates students to learn how to analyze real-world problems and data, and better understand complex dynamic systems. 

I would be glad to contribute all of my work on SimCity to the One Laptop Per Child project as Open Source. 
The source code is in good shape, with clean and well organized C and TCL code, but I haven't compiled or tested it in a long time. 
But in the mean time the software environment and hardware platforms have changed a lot, so it will take some effort to retrofit it with up-to-date libraries, remove the license locking code, and make it production quality and "kid proof". 

For example, it needs some work to properly support modern 16, 24 and 32 bit screens, but it works well on 8 bit colormap displays and monochrome displays. 
The support for monochrome is still useful, because some of the inexpensive OLPC computers may have monochrome screens. 

Some major improvements that are possible include:
Switching to a better scripting language than TCL, like Lua or Python.
Using a better graphics engine than X11, like OpenGL or Flash. 
Implementing a better user interface, with more control and monitoring features, like a web based multi player OpenLaszlo "AJAX" interface.
Opening it up and refactoring it so players can add their own buildings and program their own behaviors. 
Developing scripts and course-ware for lessons, experiments and projects that students can work on. 
Storytelling, chatting and web publishing features (applying lessons learned from the ActiveX SimCity chat, The Sims Exchange and The Sims Online), so SimCity can be used for creative writing, geo-blogging, etc. 

Making the SimCity source code open source would certainly be the best way to enable that work to be done, and SimCity would be a fun but practical contribution to the One Laptop Per Child project!

    -Don

---
