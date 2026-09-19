---
title: The X11/NeWS Merge
synonyms:
  - X11/NeWS
  - NeWS/X
  - NeWSeX
definition: A merged window server supporting both X11 and NeWS protocols.
source: doc/demos/newsx.st0
---

Date: Sat 12 Dec 1987 17:01:36 EST

From: David Rosenthal <dshr@Sun.COM>

Subject: Extensions for "documetnation graphics"

To: xtensions@athena.mit.edu, xpert@athena.mit.edu

There has been some discussion recently of the need to extend X11 to support ``documentation graphics''.  I believe that what people need is,  in effect,  access to both the X11 and the PostScript (TM Adobe Systems) language imaging models.

The implications of the recent deal between Sun and AT&T are relevant to this debate.  As part of the deal,  Sun will be supplying to AT&T,  and AT&T including in their Unix source licensing program,  a merged server supporting both X11 and NeWS protocols.  If you are a Unix licensee,  you will be getting this code as part of the normal AT&T source distributions,  and it will,  therefore,  be a part of "standard Unix".  No license with Sun will be required.

Robin Schaufler will discuss the details of the implementation of the merged server at the X conference at MIT in January.  Briefly, it will support:

-	Vanilla X11 clients .nl -	Vanilla NeWS clients .nl -	A single window tree accessible to both .nl -	A single event distribution mechanism accessible to both .nl -	The use of PostScript programs and operators to image onto X11 windows. .nl

The C source code will include:

-	X11 protocol interpreter .nl -	PostScript language interpreter,  with NeWS extensions .nl -	Window tree and event management core shared by both .nl -	A complete implementation of the high-performance imaging library that supports them both,  for memory framebuffers.  (This is an improved version of the imaging library that currently supports the NeWS product) .nl

The intention behind this arrangement is to ensure that those who need the PostScript language imaging model will have it available. There will be no reason not to support this capability for those who are Unix licensees,  since they will be getting it, already integrated with X11,  as part of their Unix source distribution.  Almost all significant companies in the computer industry are Unix licensees.

I hope that this will reassure those who need ``documentation graphics'' that the X11 servers they talk to are likely to support the capabilities they need,  and that there is no need to design new extensions to address this area.

David.
