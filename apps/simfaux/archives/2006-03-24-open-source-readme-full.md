# Open Source SimFaux OpenLaszlo Code Now Available via Subversion

**Published:** Fri, 2006-03-24 22:06 · Don Hopkins · Drupal node/123  
**Wayback:** https://web.archive.org/web/20070208025302/http://www.donhopkins.com/drupal/node/123  
**Tags (period):** Laszlo Applications · Pie Menu Applications · Downloadable Software  
**Cited by:** [2006-11-03 SimFaux demo email](2006-11-03-simfaux-demo-email.md)

I've published the source code and content of SimFaux as Open Source Software. It's available via read-only anonymous subversion. Here's the command to get all the source code and content:

```text
svn co svn://SimFaux.com/SimFaux/trunk/SimFaux
```

I've started writing a README.txt file, but that's about all the documentation there is so far.

---

## SimFaux 1.0 README

SimFaux is an interactive TV station simulator written in OpenLaszlo,
by Don Hopkins, for the HuffingtonPost Contagious Festival.

It's an open-ended framework for plugging together keyword tagged
multimedia character simulations, video, text, quotes, surveys,
interactive games and application.

It's configured with XML files, so non-programmers can easily add
characters, video and other types of content.

It includes tools for validating, processing and compressing the
content into appropriate file formats.

### Installation

[TODO]

Dependencies:
  OpenLaszlo.
  Python (checking and adding new content).
  Cygwin (rebuilding the content conversion tools).

Install OpenLaszlo 3.1.1 or newer.
  For this example, we will use version 3.1.1 in "C:\OpenLaszlo",
  and get the latest version of SimFaux out of the anonymous
  subversion server.

This will put the SimFaux directory into the lps directory,
so it's called: C:\OpenLaszlo\lps-3.1.1\SimFaux

```text
cd c:\OpenLaszlo\lps-3.1.1
svn co svn://SimFaux.com/SimFaux/trunk/SimFaux
```

### Running the SimFaux OpenLaszlo application

To build the OpenLaszlo code, just open the URL of the application
and run it:

```text
http://localhost:8080/lps-3.1.1/SimFaux/SimFaux.lzx
```

That will deposite the compiled swf file in:

```text
C:\OpenLaszlo\Server\lps-3.1.1\SimFaux\SimFaux.lzx.swf
```

You can deploy that OpenLaszlo "SOLO" application on your server
(along with the associated support files and content sub-directories
in the same directory).

When you run the SimFaux application, it's possible to pass it a
variety of parameters in the URL query string. Of course you must
quote the values according to standard URL quoting rules. SimFaux
supports the following parameters passed as URL query parameters:

**surfing=[flag: 0 or 1]**
  Controls the inital value of the surfing checkbox.
  Example: start up with surfing turned off:
  `http://localhost:8080/lps-3.1.1/SimFaux/SimFaux.lzx?surfing=0`

**program=[program name: symbol]**
  Starts up showing the named program.
  Example: Show the Bush Matrix program, without surfing away:
  `http://localhost:8080/lps-3.1.1/SimFaux/SimFaux.lzx?program=bushmatrix&surfing=0`

**channel=[channel: 1-8]**
  Starts up showing a random program on the given channel number.
  Only works if no program is specified.
  Example: Show the About channel, then surf away:
  `http://localhost:8080/lps-3.1.1/SimFaux/SimFaux.lzx?channel=8`

**gameZoomFactor=[zoom factor: 0.0 > factor >= 10, default 1.0]**
  Adjusts the game's zoom factor.
  Content is adjusted for the screen size, and scaled by this factor.
  `http://localhost:8080/lps-3.1.1/SimFaux/SimFaux.lzx?gameZoomFactor=0.1`

**contentServer=[url to content server]**
  The url is in the format supported by OpenLaszlo (with relative
  addressing), so you can pass "http:content/" to use the content
  sub-directory next to the SimFaux.lzx.swf application, or pass
  an abolute URL of another server.
  `http://localhost:8080/lps-3.1.1/SimFaux/SimFaux.lzx?contentServer=http:content/`

### Playing SimFaux

When SimFaux comes up, it starts out in "surf" mode,
so it randomly changes channels every few seconds.

You can sit back and watch the show without interacting with SimFaux,
or you can jump in at any time to take control.

Along the top edge on the right side is a row of channel buttons,
and a "Surf" checkbox.

You can press a button the switch to a different channel, and press
it again to change to another program on the same channel.

When you press a channel button, it automatically clears the "surf"
check box. You can check the surf check box to go back to surf mode,
and uncheck it to stop surfing.

You can control SimFaux with "pie menus".

[TODO]

### Building the content creation tools

To rebuild the content creation tools (the traceswf utility and the
libraries it requires), you will need to install cygwin. To run the
content checking and converstion scripts, you will need python
(preferrably 2.4).

If you just want to compile the Laszlo code and not the content
conversion tools, you probably don't need to install cygwin, but
cygwin and Python are required to add new content.

There's a pre-compiled Windows binary included called
"src/utils/traceswf.exe", so you only need to recompile it if you
want to make changes or create content on a non-Windows platform.

When I get a chance, I will provide an online web enabled version of
the conversion tool, which will be useful for adding small amounts
of content at a time. But if you're going to work with large amounts
of content, then it's worth using the content conversion and
checking tools. The libraries it uses are portable, so you should be
able to compile the code on Linux and Mac OS/X without too much
trouble.

### Tools

**src/scripts/CheckContent.py**

  Read and validates the XML files, checks for the existance of
  all the content, writes out an index of all keywords, etc.

  Audio:
    Driven by "src/xml/sounds.xml" and "src/xml/bites.xml".
    Checks mp3 auduo files in "src/audio".
    Checks flv audio files in "content/audio".
    Indexes bite keywords.

  Video:
    Driven by "src/xml/movies.xml".
    Checks wmv video files in "src/video".
    Checks flv video files in "content/video".
    Indexes movie keywords.

  Sprites, Characters, etc:
    To do.

**src/scripts/ConvertContent.py**

  Converts content source file formats for compiler and runtime.

  Reads png files with transparency, converts to swf files with
  outlines clipping jpeg images.

  Written in python, and uses the "traceswf" tool.

  Driven by "src/xml/sprites.xml" sprite database.

  Reads png sprites from and writes jpg and swf sprites to "src/sprites".

**src/utils/traceswf.exe**

  Reads in png and jpeg files, traces the outlines of the alpha
  channels into vector clipping regions, and converts images and
  clipping regions into to swf files.

  Has an option for making
  multi-frame vector based image maps over a single flat image, out
  of multi layered alpha channeled layered compositions (for
  efficient downloading and mouse hit detection). Written in C, and
  uses the libraries autotrace, ming, lpng and zlip.

**TODO:**

  To eliminate the need for installing Cygwin and building the
  tools, implement an online version of the sprite conversion
  tool.

  Users can upload png files with transparency, and download
  optimized swf files with jpeg images and outlines.

  Also measure the bitmaps, assemble them together in a zip file
  with the necessary XML.

  Make a simple graphical tool for creating and editing sets of
  jointed sprites (avitars, characters, bodies, accessories).

  Make characters and sprites more modular and stand-alone so they
  can be contained in separate files.

  Content building tool can merge all the used sprites together into
  one xml file, or load them into the database to be served up
  dynamically.

  Automatically make low and high resolution versions of sprites
  (with and without anti-aliased alpha channels, and with different
  resolutions).

  Make it easy to switch between compiling sprites into the
  application and dynamically downloading them.

  Resolve dynamically downloaded sprite switch flashing problem.

### Implementation

[TODO]

### Extending

[TODO]

  Adding programs.
  Adding characters.
  Adding sprites.
  Adding bites.
  Adding sounds.
  Adding movies.
  Adding quotes.
  Adding surveys.
  Adding chats.
  Adding graphs.
  Adding hangman games.
  Adding text messages.
  Adding new channel frame layouts.
  Adding new feed types.
  Defining and customizing pie menus.
  Managing keywords.

### Limitations

Because of the rules of the HuffingtonPost Contagious Festival,
SimFaux is currently limited to 15 megs of content, and must be
self contained and not use any web services except for streaming
static content.

### Ideas

Once the contest is over, and these limitations no longer apply,
SimFaux will be able to evolve in many ways, by incorporating
much larger libraries of content, and relying on server side
support for storage, computation, and communication.

Server side content database (instead of compiled-in XML datasets).
Live chat rooms and talk shows.
Shared channel broadcasts.
Streaming webcam video uploading and chatting.
Shared stations where different people play different characters.
Puppetry mixed with live and recorded video.
Like Space Ghost and Mystery Science Theater.
Verbal combat games.
Multimedia keyword tagged blogging.
User profiles with graphcial avitar heads and voice sound bites.

Content types:
  Still pictures, Flickr gateway.

  More backgrounds and overlays, static, animated and programmed.

  Keyword driven overlays, like lightning, fire, smoke, stonewalls, etc.

  Backgrounds with head and video positions and scales, to place
  characters, video feeds and web cams into pre-rendered backgrounds.

  Full screen vidoes with alpha channels that can break the frame.
    Duck comes down when somebody says the secret word.
    Stone wall comes up when somebody stonewalls.
    Smoke screen billows out when somebody smokescreens.
    Shoot bullet holes into the screen.
    Throw tomato at the screen.

User interface:

  Character selection pie menus should have graphical heads that
  expand when you highlight them.

  Make a full featured teleprompter for feeding lines to the player,
  and speaking on behalf of the characters.

User feedback:
  Rate vidoes, talking points, characters, programs, etc.

Program Guide:
  Index of all available programs on site,
  presented in a tv schedule format,
  allowing user to watch any progam at any time,
  or tune into a preset sequence of programs.

Games:
  Game shows focused on characters and content.
  Hangman, with relevent keyword and character's head in the noose.

    Play hangman with keywords.

    Put any head in a noose over a hangman background that
    animates from frame to frame as you guess letters.

    When you finish the game, the keyword goes into the mix.

    Play a horrible wretching sound when they hang.

    Make it very easy to just repeatedly hang the person
    again and again by typing all over the keyboard randomly.

    After the game is over and the word is shown, also display
    a definition and a link for more information.

  Celebrity squares. Tic Tac Faux.

    Play tic-tac-toe in the 3x3 Brady Bunch window.

    You and the computer place two different heads in
    the squares by clicking on them.

    How to decide which heads to play with?
      Put a game control area at the top of the screen.
      Give user a pie menu of heads.

    But right when you're about to beating the computer,
    it always cheats by stealing one of your squares.

  Angry-Libs

    Video Mad-Libs.
    Don Martin's Snappy Answers to Stupid Questions.
    Show a picture or video, and you write the caption.

    Fill out a form with your own words.
    Plug them into a funny script.
    Play the script back on the teleprompter while recording video.

    Read talking points into the camera.
      How to record and play back video? Red5.

    Upload streaming video from webcam to server,
    and share with others.

    Celebrity impersonations.

    Have people say out of context quotes, and enter keywords.
    Put people's quotes up against each other.
    Simulated interviews: mashed together out of context video clips.
    Jusxtoposition video clips of interviewers asking questions,
    players and celebrities answering them.

Shopping Channels:
  Informercials, shopping channels, shopping cart, order processing, etc.
  Sell related music, video, real world products, etc.
  Celebrities and writers plug their books, sold on Amazon.
    Incorpoate live book reviews, associate links.
  Viral greeting cards and personalized programs.
  Online pizza ordering.
  Downloadable content like Sims objects.

Content Authoring:
  Create, edit, save and share your own shows.
  Create, enrich and program simulated characters with
  graphics, sound bites, quotes, etc.
  Synthetic expressive speech editor.
  Create, edit and display other content types.
  Browse and maintain keywords.

Streaming video:
  Red5 open source RTMP server for streaming video, webcam upload,
  shared objects, dynamic content generation, etc.

### DHTML OpenLaszlo

Porting SimFaix to DHTML OpenLaszlo.

  Some feed types could be easily ported, others would be harder.

  Use a Flash player component to play videos, show webcam, etc.

  Composition of videos and characters with animated backgrounds and
  overlays is harder.

  Define a useful set of feed types that would work well in DHTML.

---

*Verbatim archive. Typos preserved ("deposite", "auduo", "SimFaix", "avitars", "Jusxtoposition", "graphcial", "Incorpoate", "progam", "relevent", "inital", "abolute", "converstion", "zlip", "vidoes"). Digest:* [2006-03-24-open-source-readme.md](2006-03-24-open-source-readme.md)
