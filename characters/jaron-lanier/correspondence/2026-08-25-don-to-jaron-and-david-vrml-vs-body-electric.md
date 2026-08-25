---
type: correspondence
direction: outgoing
from: Don Hopkins <don@donhopkins.com>
to:
  - jaronlaniernews@jaronlanier.com
  - David Levitt <dlevitt@sonic.net>
cc: Don Hopkins <don@donhopkins.com>
date: 2026-08-25T09:33:42+02:00
subject: "VRML -vs- Body Electric"
status: sent, awaiting reply
open_question: >
  Did VPL stand for "Virtual Programming Languages" (Wikipedia's claim,
  citing C-SPAN) or "Visual Programming Language" (Don's recollection)?
  Don offered to ninja-edit the HN comment within the edit window if
  corrected. Update this file when Jaron or David answers.
research_answer: >
  RESOLVED BY RESEARCH (2026-08-25, pending Jaron's confirmation): BOTH,
  in Jaron's own words. In his April 2001 Scientific American article
  "Virtually There" (self-hosted at
  https://www.jaronlanier.com/cocodexintro/lanier01sciam.pdf) Jaron
  tells the founding story: Scientific American's September 1984 issue
  used one of his visual-programming experiments as the cover
  illustration; an editor called in a panic because contributors must
  list an affiliation; "I blurted out 'VPL Research' (for Visual
  Programming Language, or Virtual Programming Language), and thus was
  born VPL. After the issue's publication, investors came calling, and
  a company came to exist in reality." Singular "Language", Visual
  listed FIRST. Wikipedia's flat "Virtual Programming Languages"
  (plural, Virtual-only) misstates his own account, and its citations
  don't contain the claim: the C-SPAN organization page is just a video
  listing, and both C-SPAN transcripts (Digital Future 2015, Who Owns
  the Future 2013 — archived in ../sources/) never expand the acronym.
hn_thread: https://news.ycombinator.com/item?id=49426548
related:
  - ../../david-levitt/correspondence/README.md
  - ../../don-hopkins/body-electric-bounce-vr-stack.md
  - ../../don-hopkins/sources/1998-2000-bounce-notes-visual-programming.md
  - ../sources/2015-04-02-cspan-digital-future-engelbart-lanier-thrun.md
  - ../sources/2013-05-15-cspan-book-tv-who-owns-the-future-keplers.md
  - ../wikipedia-vpl-research-talk-post.md
  - ../../../repo-shows/rebounce/README.md
---

# Don → Jaron Lanier + David Levitt: VRML -vs- Body Electric (2026-08-25)

Fact-check and feedback request sent while the HN edit window was open.
Full text as sent, including the embedded Hacker News thread
([Vintage Artificial Intelligence: Before It Got Awkward](https://news.ycombinator.com/item?id=49426548)).

---

Hey Jaron and David, is Wikipedia correct about claiming that VPL stood for "Virtual Programming Languages" with Virtual instead of Visual and Languages instead of Language?

https://en.wikipedia.org/wiki/VPL_Research

>VPL Research was one of the first companies that developed and sold virtual reality products. It was founded by computer scientist Jaron Lanier in 1984.[1] "VPL" stood for "Virtual Programming Languages".[2] In 1990, VPL Research filed for bankruptcy and in 1998 all of its patents were bought by Sun Microsystems.[3]

> "VPL Research | C-SPAN.org". www.c-span.org. Retrieved 2021-01-22.

https://www.c-span.org/organization/?112710/VPL-Research

https://www.c-span.org/program/public-affairs-event/digital-future/395147

https://www.c-span.org/program/book-tv/who-owns-the-future/312065

I have always thought VPL stood for Visual Programming Language, but if it stands for Virtual Programming Languages or something else, I'll correct it. (I have an hour or so edit window so if you're online and can send me a quick correction I can ninja-edit the correction into the following post.)

Did I make any mistakes or omissions in this Hacker News discussion of AI an VR? Do you have anything else to add? I'd love to hear your feedback, and discuss it with you in more depth!

-Don

https://news.ycombinator.com/item?id=49426548

jonbaer 8 hours ago | prev | next [–]

https://en.wikipedia.org/wiki/Artificial_Intelligence_Markup...

DonHopkins 5 hours ago | parent | next [–]

AI was always awkward!

Long before I ever encountered Richard Wallace's AIML (which was quite unintentionally silly, but not actually a joke, unfortunately), around 1996 I wrote some joke web pages to parody VRML, announcing "AIML: Artificial Intelligence Marketing Language", by taking a couple of gushing articles about VRML, strategically replacing "VR" with "AI", and tweaking just a few words.

The point being that the VRML hype back then was as bad as the AI hype right now (well maybe not QUITE as bad). I don't have a very high opinion of VRML obviously! They didn't bother integrating it with an extension language at the time, so it was useless.

AIML: Artificial Intelligence Marketing Language

https://donhopkins.com/home/catalog/text/aiml.html

Support for AIML

https://donhopkins.com/home/catalog/text/SupportForAIML.html

To go along with the AIML parody, and give it a whiff of authentic scientific research, I formatted as html and published an actual AI research paper with the funniest title ever, by a company called Roanoke AI Laboratories, Inc., from The Journal of Theriogenology. (NSFW, unless you work in the Artificial Insemination industry!)

https://donhopkins.com/home/catalog/text/AILabratories.html

The author Jim Crump, Jr. actually found it by googling his name, and sent me a sincere email thanking me for formatting and publishing his AI paper on my web site, because his own publisher wouldn't allow him to publish his own paper on his own web site, due to draconian copyright restrictions. So I left it up because he was linking to it. Apparently it's well known in the AI Industry as the "Crump Technique". Attention is all horses need, too.

I miss the early days of the web...

mikestorrent 2 hours ago | unvote | root | parent | next [–]

Ahh VRML was pretty cool. The problem was that the VRML viewer plugins were slow, needed more RAM than anyone had, or needed to run Java and so you'd let the 486 kick that off and go get a snack and come back and it would still be thrashing the disk to swap hard enough to have a chance to start anything. Pity that they didn't get some demoscene guys to make an efficient implementation.

I had this ancient program called Virtual Homespace Builder https://archive.org/details/hmebuilder that was like an early Sketchup sorta thing and it would render VRML output, but I can't say as I ever managed to publish anything with it, being a young whelp at the time.

If VRML had been fast and efficient, something like Second Life / Metaverse might have emerged there...

DonHopkins 54 minutes ago | root | parent | next | edit | delete [–]

The disqualifying problem with VRML was that it was not extensible, and at the time it had no integration with JavaScript, Python, Lua, TCL, or even its own bespoke scripting language, and absolutely no plans to do so, so that made it TI (Turing Incomplete) and FU (Fundamentally Useless).

At the time, I had been working extensively with Bounce / Body Electric, which was developed by Chuck Blanchard at VPL Research, originally used for VR simulations with the DataGlove and EyePhone and a pair of SGI workstations, one to render each eye.

"Visual Programming Language" was not an afterthought nailed on the side, it was what the name of the company VPL stood for.

https://en.wikipedia.org/wiki/VPL_Research

>VPL Research was one of the first companies that developed and sold virtual reality products. It was founded by computer scientist Jaron Lanier in 1984. "VPL" stood for "Virtual Programming Languages". In 1990, VPL Research filed for bankruptcy and in 1998 all of its patents were bought by Sun Microsystems.

>VPL's funding came in part from Marvin Minsky.

Funny that you would mention it: Virtual Homespace Builder was precisely what I was making fun of, in fact that was what the article I was parodying was about, almost word for word -- I just went m-x replace-string Home => Head, and then went on from there:

>AI Labratories has entered into alliances with the likes of Microsoft, Apple, Intel, Creative Labs, NewTek, and Caligari to foster acceptance of the format. One of their partners, SexPression, offers the first AIML authoring program, Virtual Head Space Builder (VHSB) 1.0 Academic Edition ($495) for Windows. SexPression offers the final beta version for $49 and a paradigm-limited final beta via their Web site free of charge.

>Designed to accommodate nonprogrammers, VHSB creates AI Web sites, or "head spaces", that can be saved as AIML files or in SexPression's proprietary FASL file format. In addition to realtime interactive Artificial Intelligence, sites can include text, audio (WAV and RealAudio), MIDI, video, animation (AVI and FLI), cubes, spheres, pyramids, conic sections, and checkerboards -- in fact, SexPression suggests that VHSB makes a good expert system authoring tool as well. Any part of a knowledge base environment can act as a URL link, and evaluatable function modules can be associated. Head spaces can be opinionated with moods, including recurring and unpredictable swings, and with transparent prejudices. The software comes bundled with hundreds of clip-opinions, goals, interests, paridigms, taxonomies, ontologies, excuse templates, animal guessing trees, todo lists, top ten lists, hot lists, and shit lists; and custom content can be imported easily. A Virtual Head Space Evaluator is included.

The explicit comparison of AIML parody and VRML fact was this:

>Many people are extremely excited about AIML. But what is it, and how can you use it to spruce up your home page? AIML encapsulates the semantics of revolutionary AI research, much in the same way VRML trivializes the implementation of cutting edge VR research.

My point was: VRML trivialized VR.

Jaron Lanier made this point about Body Electric versus VRML on his VPL and Body Electric web page:

https://web.archive.org/web/20051217153424/http://www.advanced.org/jaron/vpl.html

>VPL had problems maintaining quality in our hardware- though I still sometimes find our headmounts and gloves in use. But our software was really great and can still offer a lot. A challenge to VRML people: Don't you DARE turn out more VR tools that aren't at least as good as this old stuff!

The VRML people spectacularly failed to rise to Jaron's challenge.

Here is an email discussion I had with him about Body Electric and VRML, describing what David Levitt and I did with Bounce (derived from Body Electric) at our company Levity and Paul Allen's think tank Interval Research, and Jaron criticized how terrible he thought VRML was, how it totally failed to address deep interactivity:

https://news.ycombinator.com/item?id=49358243

>There IS a community of Body Electric users. It is STILL building the most interactive 3D virtual worlds of any tool (though Alice, from Carnegie Mellon, is the other hot contender). That's SHAMEFUL! While BE sucks in every other way, all the more recent vr design tools, especially the vrml ones, simply avoid the problem of deep interactivity. How could the community be so whimpy, at this late date?

Jaron Lanier also wrote this review of John Markoff's 2005 book "What the Dormouse Said: How the Sixties Counterculture Shaped the Personal Computer Industry" in American Scientist:

https://web.archive.org/web/20110312232514/https://www.americanscientist.org/bookshelf/pub/early-computings-long-strange-trip

>The book also captures an important early conflict between two cultures of computing that seemed compatible on the surface but actually had opposing aims. On the one side was the human-centered design work of Engelbart, based initially at the Stanford Research Institute, and on the other was artificial intelligence culture, centered on the Stanford AI lab. Engelbart once told me a story that illustrates the conflict succinctly. He met Marvin Minsky—one of the founders of the field of AI—and Minsky told him how the AI lab would create intelligent machines. Engelbart replied, "You're going to do all that for the machines? What are you going to do for the people?" This conflict between machine- and human-centered design continues to this day.

VRML simply being fast and efficient wasn't enough. "Hello World" is fast and efficient, and it's not extensible, so useless for VR. It had to be TC (Turing Complete). No matter how fast and efficient it was, it was still FU: Fundamentally Useless.

Body Electric STARTED with a fully Turing Complete, extremely powerful and fun to use Visual Programming Language, and then added Swivel 3D skeletons, networking with UDP packet packers/unpackers and transmitter/receiver modules, Swivel 3D tree syncing over Ethernet to two SGI workstations, one for each eye, for rendering to the EyePhones, many different kinds of input and output device drivers for the EyePhones (like a module to configure how far apart your eyes are to adjust the two 3D renderers), DataGlove, Convolvotron 3D audio HRTF rendering device, MIDI, Flock of Birds 6 degree of freedom motion tracker, etc. David added Macromedia's Director MMP Player library (which later became Shockwave in the browser) so we could live code and orchestrate interactive 2D multimedia performances as well as VR.

And VPL didn't stop at two SGI workstations per person: their flagship product RB2, "Reality Built for Two", networked multiple users into a shared world — two workstations for each eye, and two more for each additional "I". Interacting with other people is what David Levitt (who was a research scientist and product manager at VPL, and with whom I later worked with at Levity, Interval, ConnectedMedia, and Pantomime) explained is one of the fundamental properties of good VR, along with the ability to reach in. I wrote about VPL's three prerequisites for good VR on HN back in 2014, quoting Pantomime's VR page (now archived):

https://news.ycombinator.com/item?id=8023893

https://web.archive.org/web/20240622093608/http://pantomimecorp.com/pantomime-technology/virtual-reality/

>When Pantomime co-founder Levitt was a research scientist and product manager with VPL Research, the inventors of virtual reality, they had three prerequisites for a VR system: 1) a way to reach in, in 3D 2) shared reality — support for multiple users and viewpoints 3) graphically and physically realistic worlds

>VPL offered a DataGlove to provide 3D input, while its flagship Reality Built for Two VR product offered networked multi-person worlds. Expensive graphics computers and custom hardware brought the full 1992 price to $500,000, which only a few huge corporations could afford.

>When Dr. Levitt joined VPL, thanks to an amazing infrastructure by lead VPL engineer Chuck Blanchard, he added realistic gravity, collisions, and throwing a ball into the VR system for physical realism.

Two decades later the systems calling themselves VR had punted on all three original criteria, which David memorably demonstrated by asking Facebook's VP of Infrastructure Engineering Jay Parikh about the Oculus acquisition:

>David Levitt: "I work in Virtual Reality, and everyone's wondering what you can say about your acquisition of Oculus VR. In particular, I've had demos of it: I could look around but I couldn't reach in. Do you have solutions for that that you can talk about?"

>Jay Parikh: "You can't interact with anything. These are big, hard problems … what you do with your hands, because you can't do anything with your hands — or it's hard to be using a controller when you can't see your hands and you have the goggles on — these are problems we have to solve in a good and seamless way."

We shipped Pantomime pursuing all three criteria — reaching into shared, physically realistic 3D worlds through the screens you already own, no headset required:

Pantomime – Interactive Multiplayer Virtual Reality:

https://www.youtube.com/watch?v=T43b5ywnYpo

Shipping it taught me how brutally hard "physically realistic" is over a network: merely 2mm translational resolution and 1/6 degree rotational resolution would totally ruin the physics simulation and sense of immersion and realism, because the Butterfly Effect cascades slight differences in initial conditions into enormous differences in later state. I wrote about that in detail here:

https://news.ycombinator.com/item?id=33572067

And about Pantomime's multitouch VR gesture tracking (rolling seamlessly between one, two, and three finger gestures, gyro-integrated inertia, steering wheel vs paddle grips) here:

https://news.ycombinator.com/item?id=17106103

More receipts on Jaron's pioneering VR hardware and software work:

https://news.ycombinator.com/item?id=24266722

VRML was not only missing the VPL, it was missing all the device drivers and hardware integration, the multi-user shared reality, and didn't even have stereo 3D rendering and head tracking. No way to reach in, nobody else in the world with you, and no physics. It was WI (Woefully Inadequate) as well as FU.

I brought this up numerous times with Mark Pesce and Owen Riley, and they were much more interested in creating a standard that was built into every web browser as soon as possible, than taking the time to create a standard that was actually good for anything, let alone looking at what other people had done in the past, like Body Electric, and why it was successful: because it was built on top of a visual programming language from day one.

At that time (and still today unfortunately), everybody thought the most important thing in the world was to create standards and get them universally accepted, while the idea of actually using something enough before you standardized it to learn the shape of the problem space was pooh-pooh as an inefficient waste of time on the Road to VR Standardization and Virtual World Domination.

But the correct approach around extensibility was exactly what Alan Kay and colleagues were taking with Croquet: STARTING with Smalltalk, networking it, dogfooding it, and iteratively improving it from real world experience. That's the same approach Richard Stallman took with Emacs (starting first with TECO, then later with Lisp), James Gosling took with NeWS (starting with PostScript), and John Ousterhout did with Tk (starting first with TCL).

But no, the VRML developers arrogantly thought their purposefully non-extensible approach was enough, and extension languages were a waste of time, directly at odds with standardizing on something as quickly as possible. They thought VRML didn't need an extension language, because in their Headspace, they got it right the first time, and they designed it to do just the demos they had in their heads at the time, and nothing more.

Again, I quote Alan Kay (talking about MVC, but it applies to so many other things):

"Things seem to hang on in computing just because they work a little bit." -Alan Kay

---

## Context

- The HN thread: [Vintage Artificial Intelligence: Before It Got Awkward](https://news.ycombinator.com/item?id=49426548) — Don's AIML-parody comment, mikestorrent's Virtual Homespace Builder reply, and Don's Body Electric answer above.
- The 1999 Don ↔ Jaron email about Body Electric, Bounce, and Sun's patents, republished by Don on HN: [housefly simulator comment](https://news.ycombinator.com/item?id=49358243).
- Don's firsthand stack history: [Body Electric / Bounce VR stack](../../don-hopkins/body-electric-bounce-vr-stack.md).
- The show this feeds: [Rebounce](../../../repo-shows/rebounce/README.md) — Jaron is the guest of honor for the origin story.
- Levitt's three prerequisites for good VR: [HN 2014](https://news.ycombinator.com/item?id=8023893) · [archived Pantomime VR page](https://web.archive.org/web/20240622093608/http://pantomimecorp.com/pantomime-technology/virtual-reality/).
