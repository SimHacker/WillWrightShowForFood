# Rosenthal on NeWS pipes, the Spike, and the LANL war panels (5 Feb 1989)

**David Rosenthal (Sun, NeWS co-developer, ICCCM author) to xnews-dev**,
cc Don, endorsing Don's NeWS-pipe RFE — then a postscript raving about what
"Don and friends" showed at Usenix (Winter Usenix, San Diego, Jan-Feb 1989),
all running on one 8 MB Sun 3/60.

## Why this matters

- **The Spike / PSIBER eyewitness receipt.** Rosenthal describes Don's
  PostScript browser and direct-manipulation programming interface as
  "better than anything I've ever seen (**Interlisp and Smalltalk
  included**)" — the Spike as a tabbed representation of the stack, live
  PostScript typing with immediate stack effects, mouse rearrangement,
  recursive Interlisp-style object displays with correct text scaling.
  Then the "browser for the right half of your brain": the radial,
  fractal-looking contents view with shape-coded icons (square int,
  triangle real, radial-line string scaled by length, envelope event),
  every icon a selectable window routing back to the left-brain view.
  This is the **Pseudo Scientific Visualizer** half of PSIBER, described
  by the ICCCM author months before "The Shape of PSIBER Space" was
  published. Lore hub: [palmhoo history-and-lore](../../../palmhoo/history-and-lore/README.md)
  ("NeWS → PSIBER → MOOLLM").
- **Second independent LGATE receipt.** "The Los Alamos control panel for
  SDI. **The Joint Chiefs are now using this** to drive the simulators that
  run on Crays… satellites and missile tracks and globes and maps." This
  corroborates both the [1988 SUG Southwest program](1988-09-14-sug-southwest-lgate-sdi-news.md)
  (Siegel/Thayler, "done for SDI at the Pentagon") and Don's HN retelling
  ("MMPORG simulations of World War III **for the Joint Chiefs of Staff**" —
  [zork-troll-flag-adventure-lineage-hn.md](zork-troll-flag-adventure-lineage-hn.md)).
- **A second LANL war panel, previously undocumented here:** conventional
  war in Europe — NATO and Warsaw Pact order-of-battle in **pull-right
  menus**, a single PostScript function drawing the map of Europe at any
  scale. Rosenthal's kicker: "you get the quality of interface you pay for,
  and the Pentagon can afford the best!"
- **The NeWS pipe RFE**: `(%pipe) (rw) file` — a file object two PostScript
  processes use to communicate, buffered. Rosenthal encouraging Don to send
  in his RFE list, and forwarding this one himself.
- **Period demos**: the bouncing globe that squashes on window edges and
  propels the window; the "rabbit" program using the X/NeWS Porsche.
- **Hardware color**: "the hardest-working Sun I've ever seen" (8 MB 3/60);
  Don "about to get a 4/260, which should encourage him to even greater
  heights."

## Rosenthal elsewhere in the archive

- [1991-09-news-tnt-icccm-death-match.md](1991-09-news-tnt-icccm-death-match.md) —
  Josh Siegel quoting Rosenthal's 1987 white paper on NeWS stability vs X.
- `DonHopkins/characters/james-gosling/CHARACTER.yml` — co_stars: "David
  Rosenthal (NeWS co-author)".

## The email, verbatim

```
From: David Rosenthal <dshr@Sun.COM>
Subject: NeWS pipes
Date: 5 February 1989 at 21:31:03 GMT+1
To: xnews-dev%windows@Sun.COM
Cc: don@brillig.umd.edu

Don Hopkins has a list of RFEs for NeWS that I'm encouraging him
to send in.  One that struck me as a really good idea is the
NeWS pipe:

	(%pipe) (rw) file

should generate a file object that two PostScript processes can
use to communicate.  Data written to the object should be buffered
waiting for some other process to read it.

	David.

PS - you really need to see the stuff that Don and friends were
showing off at Usenix.  Highlights include:

-	A bouncing globe demo.  The globe squashes when it hits
	the edge of the window,  and the window itself is propelled
	in the appropriate direction.

-	A version of the "rabbit" program that uses the X/NeWS Porsche...

-	A browser and direct-manipulation programming interface for
	NeWS that is better than anything I've ever seen (Interlisp and
	Smalltalk included).  Its called the Spike - the spike is a
	representation of the stack with a tabbed window for each object
	on it.  There's a window where you type PostScript and you see the
	effects on the stack immediately.  You can grab things on the the
	stack and re-arrange them with the mouse.  You can open compound
	objects by clicking on them to get Interlisp-style displays of
	their contents (and recursively,  with the text scaling correctly).
	You can select,  cut and paste between all these displays,  and
	the right things happen.

	But that's not all.  That's just the browser for the left side of
	your brain.  Integrated with it is also the browser for the right
	half of your brain.  This is a window that displays the selected
	object in the center.  Around it in a circle are the contents,  with
	little icons (square for int,  triangle for real,  radial line for
	string with length proportional to the string length,  envelope for
	event,  and so on).  And around them in a circle are their contents
	(properly scaled),  and so on ad infinitum.  Looks like a fractal.
	The amazing thing is that you can actually understand the image and
	get useful information from it.  And all the icons are windows and
	selectable,  and so you can get back to the left side....

-	The Los Alamos control panel for SDI.  The Joint Chiefs are now using
	this to drive the simulators that run on Crays and things to find out
	how (whether) SDI is going to work.  The displays are wonderful,  with
	satellites and missile tracks and globes and maps and ....

-	The Los Alamos control panel for conventional war in Europe,  with the
	Nato and Warsaw Pact order-of-battle in the pull-right menus,  a
	single PostScript funtion that draws the map of Europe at any scale in
	the background,  and so on.  Again,  you get the quality of interface you
	pay for,  and the Pentagon can afford the best!

I have to say that the 8M 3/60 they were using to run all this on was about
the hardest-working Sun I've ever seen.....  Don's about to get a 4/260,  which
should encourage him to even greater heights.
```

↑ [Sources index](README.md) · [LGATE receipt (1988)](1988-09-14-sug-southwest-lgate-sdi-news.md) · [Don's room](../README.md)
