# Pie Menu FUD and Misconceptions (Medium, May 2018)

**Author:** Don Hopkins · **Published:** May 17 2018
**URL:** https://donhopkins.medium.com/pie-menu-fud-and-misconceptions-be8afc49d870

Primary source for the marking-menu patent story, with Bill Buxton and Gordon Kurtenbach
replying **in the comments** — both sides on the record in one document.

## Marking menus are derivative, not independent

By their own definition (Kurtenbach, Sellen & Buxton 1993), marking menus are **pie menus
plus an ink trail** — with novice pop-up rehearsal. Not an independent invention: the 1993
paper cites Hopkins throughout (17× in Kurtenbach's thesis), and Kurtenbach's 1990 letters
to Don frame the work explicitly as building on pie menus.

The distinguishing features they claimed — mark-ahead, novice→expert rehearsal,
reselection — **were already pie menu features**, and they knew it. Don had explained
mouse-ahead, rehearsal, and reselection to Kurtenbach in detail in their 1990
correspondence (receipts: Don's emails to Gordon + prior published writings — the 1987
;login: summary, the [April 1988 UMD proposal](1988-04-10-umd-tech-writing-proposal.md)
("rapidly mouse ahead through familiar menus, without having to look at the screen" — with
PIXIE in its bibliography and chunking credited to Buxton), and the Dr. Dobb's article, all
describing mouse-ahead and browsing/reselection). And behind the writings, **running code from
June 1986**: the standalone X10 prototype had mouse-ahead out of the box, and the X10 uwm
window manager had mouse-ahead display preemption, screen-edge cursor warping, nested submenus
to any depth, and browsing/reselection — demonstrated on video (BayCHI'98 showed the tape),
**source still in Don's archive**. Implementation predates every publication in the dispute.
Kurtenbach's own 1990 reply proves the knowledge: "expert can mouse ahead like you've
talked about but they get an ink trail." The ink trail was the genuine novelty; the rest
was repackaging pie menu properties as marking-menu-unique.

## Two-level FUD (Don's account)

The misrepresentation operated at two levels:

1. **To the patent office and research record** — false distinctions in the patent,
   publications, and demo videos, made knowing they were untrue, to get an illegitimate
   patent granted:
   - Claimed pie menus select by *pointing at items* (like linear menus or PIXIE) rather
     than direction of motion.
   - Claimed the novice pop-up / expert mark transition as unique to marking menus.
   - Implied pies lack mouse-ahead display suppression (distance-trigger straw man in the
     Kurtenbach demo video).
2. **To customers and competitors** — Alias marketing misrepresented the patent's scope
   even beyond its already-misleading text: "patented marking menus" implied the whole
   technique was owned, when the claims covered only the radial/linear overflow combo.

- **US 5,689,667** (Kurtenbach, Alias/SGI, filed 1995, issued Nov 1997): radial + linear
  combo menu. Don's position: the covered technique (linear overflow items) was obvious,
  and the "typical pie menus" framing was false per the above.
- **GDC late '90s**: Kinetix (3D Studio Max) told Don users wanted pie menus but Alias
  "patented marking menus" so they were afraid. Alias booth sales confirmed "of course
  they are!" then weaseled; pointed to Buxton, not Kurtenbach.
- **Buxton call**: stonewalled — "no patent on marking menus" (coy; patents pending are
  secret). Don's framing: FUD in Buxton's name kept pie menus out of 3DS Max and scared
  the Blender community for decades (forum threads counting down patent expiry).
- **Kurtenbach's later concession** (quoted): "Had you at the time said 'as long we don't
  use the overflows we are not infringing' that would have been fine… they never read the
  patent claims." Also: "given that Max was the main rival, we didn't want to do them any
  favors."
- EA shipped The Sims with pie menus in 2000; never heard a peep from Alias.
- Irony: Autodesk now owns both Alias and 3DS Max; "patented marking menus" still in
  marketing brochures long after expiry. Radially (pie menu editor for 3ds Max) finally
  shipped January 2018.

**Full claim-by-claim autopsy of the 1993 paper:**
[`kurtenbach-sellen-buxton-1993-claims-analysis.md`](kurtenbach-sellen-buxton-1993-claims-analysis.md)
— its own Table 1 shows the ink trail (the sole novel feature) changed nothing: RT 1.10s vs
1.10s, errors not significantly different, "very few behavioral differences were found
between the two groups."

## Receipt: piemenus.com references page (Wayback, Dec 2001)

Don's contemporaneous public warning, archived at
[web.archive.org (2001)](https://web.archive.org/web/20011211122715/http://www.piemenus.com/piemenu-references.html):

> **NOTE: Alias|Wavefront lawyers will threaten to sue you if you use "marking menus", so use
> pie menus instead.**
>
> "Marking menu" (also known as **"marketing menu"**) is a term that was coined in order to
> differentiate from pie menus. In their earlier papers, Buxton attempted to define the
> difference between marking menus and pie menus, but he mistakenly assumed that pie menus did
> not implement certain techniques that he thought distinguished marking menus. **I've had to
> explain that pie menus had features like "mouse ahead" or "mark ahead" all along**, and we
> were just using different words for the same obvious well-known techniques.
>
> …it appears to me that they **distorted and concealed relevant prior art from the patent
> office**. So I think their marking menu patent is probably invalid, **and they know it**.
> That explains why I was sure they would not sue EA if I used pie menus in The Sims.

Written 17 years before the Medium article — the account has been consistent and public since
the patent was in force. The same page's reference list opens with PIXIE 1969.

## Publishing the receipts (May 2018 emails)

Before posting the retrospective, Don asked **Mike Godwin** (first EFF staff counsel, ex-Wikimedia
general counsel) about publishing Kurtenbach's 1990 emails. Godwin: legally probably fine
(excerpt/paraphrase if worried about copyright); ethically no prohibition; "I'm not big on
asking permission to publish things I already have. The temptation is for people to say no."

**Ben Shneiderman** (15 May 2018) counseled defining goals, documenting contributions with Brad
Myers, fixing Wikipedia ("Marking menus combine pie menus with gesture recognition" — Ben
suggested Don correct it), and: "don't let the bastards get you down… or maybe as Randy Pausch
once told me: 'When people are arguing over apples and oranges, **bring them a watermelon**.'"

Don's stated goals (15 May 2018, CHI'88 30th anniversary): "get the whole truth out there, well
documented, with lots of supporting evidence… dispel the myths and false statements that
[Kurtenbach] and Buxton have used their well funded high profile platform to spread."

## Buxton's rebuttal (comments, May 20 2018)

- Everything from the U Toronto research (Kurtenbach thesis, papers) was deliberately
  published into the public domain — "Alias did not patent marking menus, nor could have."
- The Alias patent covers only the radial/linear combo, invented at Alias, not at the
  university; employment contract required filing.
- Correction in a second comment: there was **also** a Xerox-filed patent (marking menus
  with graphical keyboards) pending in the same period — which he says explains why he
  could not discuss patent questions at all (pending patents secret; employees must not
  characterize issued patents).
- His advice: "take your patent questions to your lawyer, not the competition's marketing
  people." Closes with respect for Don's work (cited 17× in Kurtenbach's thesis) but
  "no constructive conversation to be had."

Don's 2025 reply attaches a ChatGPT analysis arguing Buxton's account shifts blame and
never addresses the original ridicule/evasion; Don claims archived emails prove both knew
the pie-vs-marking distinctions in the papers/patents were untrue.

## Ersatz pie menus catalog

Definitional section — what is *not* a pie menu:

- **Surface Dial / carousels / rockers**: turning ≠ stroking. Linear O(n) vs pie O(1).
- Rectangular label targets instead of full wedges.
- Distance- or timeout-triggered selection (no kinesthetic delimiter).
- Menus not centered on the cursor ("the mountain should come to Muhammad").
- Improper screen-edge and mouse-ahead handling (warp only when actually displayed).

## Fanged Apple frame

Opens with the 1989 Apple look-and-feel lawsuit, Gilmore/Stallman's fanged-Apple protest
button, and the League for Programming Freedom — situating the patent story inside the
larger interface-copyright fight.

## The no-patent dividend (Don, 16 Jul 2026)

Don on the May 1987 decision, on the record and unrepentant:

> I DO NOT regret that. It enabled me to use pie menus at Sun, DUX, Maxis, EA, ConnectedTV,
> and many other companies and projects and proprietary and free open source software, which
> would not have been possible if UMD patented them. Even if they would license it back to me
> for one penny — at each of those companies it would have cost tens of thousands just for
> legal fees to evaluate the patent and pay that one penny, times how many times and different
> companies I used them at.

The penny-license argument is the sharp end: the license fee is never the cost — the **legal
evaluation overhead at every employer, every project, forever** is. A patent wouldn't have
paid Don; it would have taxed him out of his own invention.

**The warning to students** being pushed to patent by their universities:

> Giving it away to everyone is giving it away to yourself. You'll be the expert who knows how
> to use them best, and bring something useful you can contribute to many other jobs you have
> in your lifetime, and also open source projects. It will help you much more than the paltry
> scraps they will give you for filing a patent with the university — or rather a company that
> handles all the patents for the university, then gives scraps to the uni after taking their
> professional patent-troll fee, then the university may give some to you, or may not.

**The licensing futility proof:** the Alias/Kurtenbach marking-menu promotional video
([youtube.com/watch?v=dtH9GdFSQaw](https://www.youtube.com/watch?v=dtH9GdFSQaw)) — which also
made the false pie menu claims to fluff up the patent — went **nowhere**. Nobody wanted to
license marking menus. The patent that was worth lying for turned out to be worth nothing;
meanwhile the unpatented technique shipped in The Sims to tens of millions of people.

## Show beats

- **Derivative dressed as distinct** — marking menus = pies + ink trail by their own 1993
  definition; the "unique" features were pie menu features Don explained to Kurtenbach in
  1990, on the record. Not independent invention; knowing misrepresentation with receipts
- **Patents vs open microworlds** — the Repo Show repossession thesis in miniature; Don
  chose publication over the UMD patent office in 1987 (see timeline digest) and it worked:
  The Sims shipped free of fear
- Buxton comment thread = adversarial-committee segment ready-made; both principals on record
- Pairs with [`2008-2023-pixie-buxton-patent-thread.md`](2008-2023-pixie-buxton-patent-thread.md)
  (Buxton also sat on the PIXIE paper/film scans for a decade — same actor, both lineage
  suppression stories)

→ [`pie-menus-30-year-retrospective.md`](pie-menus-30-year-retrospective.md) ·
[`pie-menu-timeline.md`](pie-menu-timeline.md)
