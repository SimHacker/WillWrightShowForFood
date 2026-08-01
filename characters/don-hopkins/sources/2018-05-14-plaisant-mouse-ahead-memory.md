# Mouse ahead — Plaisant's memory + the 1987 ;login: text (14 May 2018)

Don to **Catherine Plaisant**, cc **Ben Shneiderman** and **Brad Myers**,
answering the claim that mouse-ahead was never published before marking
menus — by pasting the complete text of his **June 1987 Usenix
work-in-progress summary** published in *;login:* (August 1987), with a
Google Books link showing it in print. Plaisant's same-day email preserves
her eyewitness memory of how the marking-menu crew justified their novelty
claim.

## Why this matters

- **The 1987 publication, verbatim, with the poem.** "Directional
  Selection is Easy as Pie Menus!" — *Simple Simon popped a Pie Menu upon
  the screen; / With directional selection, all is peachy keen!* — and the
  operative sentence: "**'Mousing ahead' with Pie Menus is very easy and
  reliable.** Experienced users can make selections quickly enough that
  **it is not actually necessary to display the menu on the screen**, if
  the mouse clicks that would determine the selection are already in the
  input queue." Mouse-ahead **and** display suppression, published August
  1987 — six years before Kurtenbach/Sellen/Buxton 1993 (see
  [kurtenbach-sellen-buxton-1993-claims-analysis.md](kurtenbach-sellen-buxton-1993-claims-analysis.md)).
- **Plaisant's eyewitness account of the misreading.** She remembers
  telling the marking-menu crew (probably Gordon) that pie menus had
  mouse-ahead first; their answer was that no publication described it,
  and that the 1991 video's "**mousy**" demo window proved the menu was
  "ALWAYS visible even when the gesture was fast. **Obviously wrong** but
  that was their explanation for the claim of marking menus' novelty."
  The mousy/mousee program itself is documented in
  [1990-04-11-siegel-sun-interview-mousee-art.md](1990-04-11-siegel-sun-interview-mousee-art.md)
  and [kurtenbach-marking-menu-demo-video-straw-man.md](kurtenbach-marking-menu-demo-video-straw-man.md).
- **A second print receipt from HCIL**: Plaisant points to the Hyperties
  browser paper (HCIL 90-02): "Experienced users can make gestural
  selections from these menus so comfortably and rapidly that it is often
  unnecessary to display the menu. This is called '**mouse ahead display
  suppression**'…" And she notes she'd just put the unpublished CACM paper
  online (HCIL 87-10) — the draft whose annotated text lives in
  [2019-02-08-pixie-references-receipts.md](2019-02-08-pixie-references-receipts.md).
- **Don's charge, stated plainly**: "They didn't do their homework, and
  they never bothered to ask me or anyone else. And they cultivated that
  ignorance in order to obtain illegitimate patents, which they unfairly
  used against their competitors." Plaisant's counsel: describe the facts,
  let readers draw conclusions, treat the patent effect separately.
- **Same-month sibling**: [2018-05-kurtenbach-retract-or-clarify-exchange.md](2018-05-kurtenbach-retract-or-clarify-exchange.md)
  — the direct exchange this thread runs alongside.

## The email, verbatim

```
From: Don Hopkins <don@donhopkins.com>
Subject: Re: Mouse ahead - and memory of discussion
Date: 14 May 2018 at 18:16:56 GMT+2
To: Catherine Plaisant <plaisant@cs.umd.edu>
Cc: Ben Shneiderman <ben@cs.umd.edu>, Brad Myers <bam@cs.cmu.edu>, Don Hopkins <don@donhopkins.com>

Their claim that we didn’t publish anything about mouse ahead is incorrect. I published it the Usenix “;login:” publication in 1987, and gave a talk about it at the Usenix work in progress sessions. 

They didn’t do their homework, and they never bothered to ask me or anyone else. And they cultivated that ignorance in order to obtain illegitimate patents, which they unfairly used against their competitors. And Buxton tried to give me a huge snow job and stonewalled about it. He knew he was wrong, and was trying to cover his ass for legal reasons, which is unethical. 

https://books.google.nl/books?id=9TZvjK1cYJsC&pg=PA177&lpg=PA177&dq=%22Directional+Selection+is+Easy+as+Pie+Menus%22&source=bl&ots=7OJXBy_ehJ&sig=LdYOrvdYio3VaoUcr1A_IKRrxO4&hl=en&sa=X&ved=0ahUKEwiO4ouzzIXbAhWGa1AKHcepAAAQ6AEIRjAF#v=onepage&q=%22Directional%20Selection%20is%20Easy%20as%20Pie%20Menus%22&f=false

Summary of Pie Menus at Usenix Work In Progress Session - June 1987

Directional Selection is Easy as Pie Menus!

Don Hopkins  
University of Maryland  
Heterogeneous Systems Laboratory  
College Park, MD 20742  
Written August 1987  

Simple Simon popped a Pie Men-  
u upon the screen;  
With directional selection,  
all is peachy keen!  

The choices of a Pie Menu are positioned in a circle around the cursor, instead of in a linear row or column. The choice regions are shaped like the slices of a pie. The cursor begins in the center of the menu, in an inactive region that makes no selection. The target areas are all adjacent to the cursor, but in a different directions.

Cursor direction defines the choice. The distance from the menu center to the cursor, because it's independent of the direction, may serve to modify the choice. The further away from the Pie Menu center the cursor is, the more precise the control of the selection is, as the Pie slice widens with distance.

With familiar menus, choices can be made without even seeing the menu, because it's the direction, not the distance, that's important. "Mousing ahead" with Pie Menus is very easy and reliable. Experienced users can make selections quickly enough that it is not actually necessary to display the menu on the screen, if the mouse clicks that would determine the selection are already in the input queue.

The circular arrangement of Pie Menu items is quite appropriate for certain tasks, such as inputing hours, minutes, seconds, angles, and directions. Choices may be placed in intuitive, mnemonic directions, with opposite choices across from each other, orthogonal pairs at right angles, and other appropriate arrangements.

Pie menus have been implemented for uwm, a window manager for X-Windows version 10, for the SunView window system, and for NeWS, Sun's extensible PostScript window system. Don Hopkins did the uwm and NeWS implementations, and Mark Weiser did the SunView implementation.

Jack Callahan has shown Pie Menus to be faster and more reliable than linear menus, in a controlled experiment using subjects with little or no mouse experience. Three types of eight-item menu task groupings were used: Pie tasks (North, NE, East, etc...), linear tasks (First, Second, Third, etc...), and unclassified tasks (Center, Bold, Italic, etc...). Subjects were presented menus in both linear and Pie formats, and told to make a certain selection from each. They were able to make selections 15% faster, with fewer errors, for all three task groupings, using Pie Menus. Ben Shneiderman gave advice on the design of the experiment, and Don Hopkins implemented it in Forth and C, on top of the X-Windows uwm.




On 14 May 2018, at 18:00, Catherine Plaisant <plaisant@cs.umd.edu> wrote:

Hi Don (and Ben, but I dropped Brad)
 
I have always been upset about this Pie vs. Marking menu controversy (i.e. inappropriate credit given to your work > patent claim that could be contested).
The only thing I can add to the reflection is that I remember clearly having a discussion with the marking menu crew (probably Gordon but it is more than 10 years ago so not completely sure): I made the point about pie menus having mouse-ahead before marking menus but they argued that there was no publication describing that feature.   I pointed to the video (which we only published in 91 but Ben mentions that it is older work).  They said that they knew the video but - after some confusing discussion – it became clear that they had misinterpreted your clever use of “mousy” (to demonstrate how pie menu worked in a separate window).  They saw it as evidence that the pie menu was ALWAYS visible even when the gesture was fast.  Obviously wrong but that was their explanation for the claim of marking menus’ novelty.
This is what I remember from the discussion.
 
I don’t think it helps anyone or anything to be angry.
I would encourage you to describe the facts, let readers draw their own conclusion about who should get credit.   
Could the effect of the patent be discussed separately?  You could make clear your strong disappointment that the patent officers did not find all the information on pie menus, but there are plenty of patents that claim novelty demonstrated by research teams but not protected.  Companies seem to think it is part of the game and hope that noone will have the legal team and resources to contest their claim. 
 
FYI: I recently put the unpublished CACM paper online as I was clearing up our old TR archive.  It is linked as a “related unpublished paper” in the CHI88 Pie Menu Tech Report page  https://hcil.umd.edu/pub-perm-link/?id=87-10
I do not see a description of mouse-ahead in it (but did not carefully read the document, may have missed it..).
 
On the other hand the last published Hyperties paper describes mouse-ahead succinctly: https://hcil.umd.edu/pub-perm-link/?id=90-02  Designing to facilitate browsing: a look back at the Hyperties work station browser:
“Experienced users can make gestural selections from these menus so comfortably and rapidly that it is often unnecessary to display the menu. This is called "mouse ahead display suppression", and its point is to reduce the perceptual distraction.”
 
Is it earliest/only publication of the mouse ahead idea? 
 
Catherine
 
 
From: Don Hopkins <don@donhopkins.com>
Date: Friday, May 11, 2018 at 3:40 PM
To: Don Hopkins <don@donhopkins.com>
Cc: Ben Shneiderman <ben@cs.umd.edu>, Catherine Plaisant <plaisant@cs.umd.edu>, Brad Myers <bam@cs.cmu.edu>
Subject: Re: Moving my stuff to Medium!
 
No, marking menus are not unique from pie menus because they ease the transition from novice to expert user. They both do. Because (as the abstract goes on to explain) the BOTH enable novices to “pop-up” a menu and experts to “mark ahead” or “mouse ahead” or whatever the input device allows and is called, without waiting for the menu to appear. 
```

↑ [Sources index](README.md) · [Kurtenbach exchange (May 2018)](2018-05-kurtenbach-retract-or-clarify-exchange.md) · [1993 claims analysis](kurtenbach-sellen-buxton-1993-claims-analysis.md) · [Don's room](../README.md)
