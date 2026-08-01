# The NeWS vendor census — gnu@toad.com to Don and Stan Switzer (20 May 1989)

John Gilmore's rough census of every known NeWS vendor, licensee, and
shipping application, sent to Don Hopkins and Stan Switzer (Bellcore),
cc tech@toad.com. A snapshot of the entire NeWS commercial ecosystem at its
1989 high-water mark.

**Provenance note:** the 1989 email itself says "Please don't post it, it's
way too rough for that" — a request about the then-current draft census,
preserved here 37 years later as history. Flagged for Don's judgment on
placement.

## Why this matters

- **Third LGATE/Siegel receipt.** The census closes with Josh Siegel
  (Los Alamos, siegel@hc.dspo.gov): "SDI simulation; LLNL [sic — LANL] is
  doing a number of interesting things w/NeWS both military (**battle
  station simulation**) and in the Earth resources/medical fields." Chain:
  [1988 SUG program](1988-09-14-sug-southwest-lgate-sdi-news.md) →
  [Rosenthal's 1989 Usenix eyewitness](1989-02-05-rosenthal-news-pipes-spike-sdi-usenix.md) →
  this census entry, via Darlene Mann.
- **Mike Gallaher, "Chief Wizard," UniPress.** The UniPress Software entry
  (CtoPS C-to-PostScript compiler; NEmacs, the NeWS-based Emacs) lists
  Mike Gallaher as Chief Wizard — the same Mike Gallaher whose "Everything
  is a story" line anchors §0 of the MOOLLM constitution
  (`moollm/kernel/constitution-core.md`, `moollm/designs/mike-gallaher-ideas.md`).
  NeWS Emacs wizard in 1989; MOOLLM many-voices philosopher decades later.
- **The port census**: Silicon Graphics (Mark Callow, Peter Broadwell),
  Pixar (NeWS on a Transputer board fronting the renderer), AmigaNeWS
  (Ameristar), SCO Xenix (Al Conrad), TGV "Two Guys & a Vax" VMS port
  (David Kashtan), Solbourne, Grasshopper Group Macintosh A/UX, Parallax
  PNeWS, Architec OS/2, Cogent Research XTM (Wm Leler — constraint-systems
  author), plus a bare licensee list including **Microsoft, Acorn,
  Philips, Turing Institute, Whitechapel** and "AT&T — 8 NeWS licences."
- **Application census**: SoftQuad publishing (Ian Darwin), MFTI
  ClientFocus, Sun cg3270, Graphics Computer Systems ACE statistics (and
  "gambling front ends in NeWS," Melbourne), Chris White's FaceKit UI
  builder + Prolog-NeWS bridge at Applied Logic, Roy Marantz's Rutgers
  structured-drawing system, Michael Paddon's Melbourne forms/hypertext
  browser.
- **Period texture**: NewScrip (a NeWS clone for IBM PCs, factory control),
  Darlene Mann as the scene's human router, and booth logistics for what
  reads like a SUG/Usenix expo push (OVA mentions).

## The email, verbatim

```
From: gnu@toad.com
Subject: Here's the list of NeWS servers and applications.
Date: 20 May 1989 at 08:24:41 GMT+2
To: Don Hopkins <don@brillig.umd.edu>
To: sjs@ctt.bellcore.com (Stan Switzer)
Cc: tech@toad.com

It's rough but it's here.  Corrections welcome.  Please don't post it,
it's way too rough for that.

	John

Shipping NeWS Vendors
---------------------

Architec	-------- OS/2
	(212/979-5337) 	FAX(718/622-9205)
	[80 E. 11th St. Suite 222 NYNY 10003]
	Maurice Balick, Chairman <sun!suneast!dreamon!maurice>
	Sal Cataudella,
	Jennifer Richards, Sales, Booths and the like
	Anthony Flinn,	Marketing (knows about Non-Profits)
	Scott Manville, Bizness stuff and OVA h(212/228-6427) w(212/420-6444)

Cogent Research inc. --	XTM (PIX)
	(503/690-1450) [1100 NW Compton Dr. Beverton OR97006]
	Dr. Wm Leler, Head of development <wm@ogccse.ogc.edu>
	Philip, Wm's right hand man?
	Gary Brand, Sales

Grasshopper Group -----	Macintosh A/UX
	(415/668-5998) [210 Clayton St., San Francisco CA 94117]
	(408/266-4783) Orders & shipping
	Hugh Daniel, 
	Keith Henson, Bizness Manager
	John Gilmore,

Silicon Graphics	-- SGI graphics workstations
	(415/960-1980) [N. Bayshore? Mountain View, CA]
	Mark Callow, Window Group Manager (did NeWS port) <msc@canth.sgi.com>
	Rafael Carty, Marketing Director of Window Systems products 964-1459x4051
	Peter Broadwell (MTS), did NeWS port with Mark, most of GL stuf.

Sun Microsystems	-------	Sun4, Sun3, Sun2
	(415/960-1300) [2554 Garcia MV CA]
	Steve Messino, NeWS Marketing
	see separate folk.sun listing

Alliant/RasterTech ----	 Alliant V??
	(24 bits!)

Parallex Graphics  ---- PNeWS
	(408/727-2228) [Santa Clara CA]
	Greg Baker, Director of Sales <gb@parallax.com>
	Marty  <picco@parallax.com>
	Darling Dawson, Sales?

Other NeWS Licencies
--------------------
Ameristar Technology inc. --	AmigaNeWS
	(516/698-0834) [47 Whittier Avenue, Medford NY11763]
	Rick Spanbauer,	<root@sbcs.sunysb.edu> <...!sbcs!ameristar!rick>
	Richard Neill, <...!sbcs!ameristar!rneill>

Santa Cruz Oper -------	Xenix
	(408/425-7222) [ Santa Cruz CA]
	Ken Pomper  (gone from the company)
	Greg Tarbox -- marketing
	Al Conrad -- (imported from UC Santa Cruz, did the port)
	Mark Coleman -- marketing (maybe can handle for ex-Ken Pomper)
	
Pixar		-- Have NeWS running, but using it for custom systems only
	Running it on a Transputer board as a front end to their rendering
	engine (hosted on a Sun).  Dunno if it will become a product or
	what.
	(415/258-8100) [ San Rafael CA]
	Mile Russell, <...!{ucbvax,r2d2,sun}!pixar!mike>
	Kinney Strong, Pixel pusher
	Glen Speckert <pixar!glen>, Project team leader

TGV  --  Two Guys & a Vax
	VAX VMS Port
	David Kashtan, home(408/353-1643) sri(415/859-5830)

Queen Marys College
Turing Institute
Wedge
Microsoft
Acorn
Whitechapel Workstations
Phillips

Solbourne Computer, Inc.
	multiprocessor Sun4 Clone
	(303/772-3400, 303/447-2861, 303/772-3646 Fax)
	2190 Miller Drive, Longmont, CO80501
	Anne C. Skamrock <{nbires,boulder}!stan!skam> Senior Systems Engineer
		Anne did the testing at Connectathon '89 though she's mostly
		an NFS person, not a NeWS person.
	Steve Kowalski, Marketing x382

Columbia
	Chris Mayo

UCSC
	Al Conrad  <conrad@saturn.ucsc.edu> 
	Al is on staff at UC Santa Cruz.  He did the SCO port, but
	it appears to be going nowhere.  He has students using it at
	UCSC and has ported it to the ISI workstations.

AT&T
	8 NeWS licences

NeWS Related folk
-----------------
Technology Applications Group  --  NewScrip (NeWS clone) on IBM-PC's
	Their applications tend to be factory control and such.
	(213/430-9792) [10621 Blooomfield St., suite 33; Los Alamitos CA90720]
	Bob (Robert A.) McGill, Marketing Director
	John Sosoka, Tech

Imagesoft	-- PostScript Products Reseller
	Eddie Currie <edward.currie@cup.portal.com>
	Imagesoft
	2 Haven Ave. Port Washtion NY11050
	516/767-2233
	FAX: +1 516 767 9067

Columbia Univ.  Chris Maio
	chris@cs.columbia.edu


Real Shipping Products that run under NeWS
------------------------------------------

Unipress Software
	Phone:	+1 201 985 8000
	Product: CtoPS, 'C' to PostScript compiler
	Product: NEmacs, NeWS based Emacs editor
	People:
		Mark S. Krieger	President	<msk@unipress.com>
		David Kiticski  Show Tech
		Mike Gallaher   Chief Wizard	<mike@unipress.com>
		Rehmi Post	programmer	<rehmi@unipress.com>
		(GONE-gnu knows where) Marilyn R. Kilinski <unipress!pookie>

MFTI
	Address: Market Focus Technologies Inc.
		 5964 LaPlace Court, Suite 100
		 Carlsbad CA 92008
	Nets:	(619/431-9400) <sun!suntan!fajita!doc>
	Product: ClientFocus, Sales and marketing tool
	People:
		Patrick J. Lupia  Director of Sales
		Dockery Thomas W. Systems Programer <sun!suntan!fajita!doc>
		Win ???? Sales?
		Tom Scrivner, President <sun!suntan!fajita!tom>

Sun Microsystems
	Address: 2550 Garcia Ave
		San Francisco, CA  94043
	Phone:	+1 415 960 1300
	Product: cg3270, IBM 3270 series terminal emulator
	People:
		Renee Nelson <reneenelson@sun.com>, Project Manager

SoftQuad
	Phone:	+1 416 963 8337
	Snail:	SoftQuad
		720 Spadina Ave.
		Toranto, Ontario
		Canada M5S 2T9
	FAX:	+1 416 963 9575
	People:
		Ian Darwin, head of development	<utzoo!sq!ian>
		David Seaman, Marketing Technical Representative

	Product:
		SoftQuad Publishing Software.  Fills the same shoes
		as AT&T's DWB. Troff, eqn, tbl pic and grap.  Much
		better character layout, full kerning, etc.  For serious
		publishing companies.

Graphics Computer Systems
	Phone:	+61 3 862 2511
	FAX:	+61 3 862 2092
	Address:
		260 High Street, Kew, Melbourne, Australia 3101
	Product:
		ACE (Analytical Computing Environment), Statistical
		and Graphical methods for data analysis.  Runs on Sun 3,4,386i
		through NeWS.  Based on enhanced AT&T "S" statistical system.
		Also, gambling front ends in NeWS
	Found:	Via an ad in the May 1989 Sun Observer page 34.
	People:	Geoff Coker



----  Maybe Products
--------------------

Applied Logic Systems
	Phone:	+1 315 471 3900
	Snail:	PoBox 90 University Station Syracuse NY13210
		Suite 209 407 University Ave. Syracuse NY13210
	People: Ken Bowne Pres. (John Sosoka of TAG said to talk to him)
		  kabowen@logiclab.cis.syr.edu
		Keith Hughs, programmer
		Chris White, chris@logiclab.syr.edu
			author of FaceKit, a User Interface Bulider
		  Chris is going to work at sun in the nde group
		  Chris also did the Prolog<->NeWS interface.
	Product: (via Hugh May89)
		Prolog with some sort of NeWS interface (Not out yet)
		They don't know what to do with FaceKit yet.
		(via Darlene Mann, May89)
		Chris has roughly 7 apps in various stages ranging from a
		SpreadSheet to simulations of strategic board games. His apps
		are mostly for resale to the government, so I don't know if he
		could participate, but he should at minimum be interested in
		OVA.
	Found:	Via John Sosoka of TAG, via Darlene Mann, May89

^_?? Frame Technology
	Cathy DeBridge 	+1 408 433 3311


Pete Delaney
UNIX consultant on site at:
NIXDORF Computer
peter@relay.nixctc.de

	via Darlene Mann, May89
	He's working on a Network Manager/Debugger

Y. Bernard
Philips Research Lab
bernard@prlb2.uucp

	via Darlene Mann, May89
	NeWSillustrator

Roy Marants
Rutgers University CCIS
marantz@aramis.rutgers.edu

	via Darlene Mann, May89
	Hierarchical drawing program of class-based graphical objects,
	wholly implemented in NeWS.  Supports drawing of large
	structured pictures (e.g. maps)

Al Conrad
CIS Board, UCSC
conrad@juptier.uscs.edu

	via Darlene Mann, May89
	Image archiver: faculty research app for X & NeWS which allows
	browsing through image archives via "postage stamps"

Michael Paddon
Dept. of Computer Science
Univ. of Melbourne
mwp@munnari.oz.au

	via Darlene Mann, May89
	full featured forms-based interface to large commercial
	database (probably not for booth).  Also, a document browser
	w/some hypertext facilities

Josh Siegel
Los Alamos Nat'l Lab
siegel@hc.dspo.gov
+1 505 667 8495

	via Darlene Mann, May89
	SDI simulation; LLNL is doing a number of interesting things
	w/NeWS both military (battle station simulation) and in the
	Earth resources/medical fields.  Josh could probably give you a
	handle on which groups are "approachable" for the booth.
```

↑ [Sources index](README.md) · [LGATE receipt (1988)](1988-09-14-sug-southwest-lgate-sdi-news.md) · [Rosenthal eyewitness (1989)](1989-02-05-rosenthal-news-pipes-spike-sdi-usenix.md) · [Don's room](../README.md)
