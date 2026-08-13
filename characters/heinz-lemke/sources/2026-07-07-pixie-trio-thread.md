# PIXIE trio thread — source listing, architecture correction, Roy Eagleson (4–7 July 2026)

**Subject:** Re: Invitation to PIXIE Repo Show interview  
[Portrayal standards](../../../schemas/portrayal-standards.md)

Participants: Heinz U. Lemke, David S. H. Rosenthal, Don Hopkins, Lars Brinkhoff, Roy Eagleson (Cc), Franziska Schweikert (Cc), **Will Wright** (Cc on Don's 16:34 reply).

---

## David S. H. Rosenthal — 4 July 2026, 02:20

On 7/3/26 11:18, Don Hopkins wrote:

> I am presuming that most of the PDP-7 software from Cambridge was lost (I'd be thrilled if they found it, but that's another whole preservation project).

Like almost everything except simple games, the PDP-7 for PIXIE was simply a display terminal for a program running on Titan. See the diagram on page 465 of:

https://www.donhopkins.com/home/documents/PIXIE%20a%20new%20approach%20to%20man-machine%20communication.pdf

There is only so much you can do with 8K 18-bit words. Compare with the Blit, or Bob Sproull & Elaine Sonderegger's system for the Alto, or the CDC274 that I used at Imperial. The difference was the app specific set of primitives the program on the PDP-7 implemented versus the fixed set of primitives for these systems.

> But it would be fascinating to research and discuss how the hardware like the light pen and the networking works.

The light pen just noticed when the beam passed underneath it. IIRC the display processor got an interrupt when it detected the beam, and you had to figure out what you were drawing at that time.

David.

**Attachment (forwarded thread end):** `PIXIE Part 1.docx` — may overlap
[`1967-back-to-the-roots-part1.md`](1967-back-to-the-roots-part1.md) or a new installment.
See [`../pull-in-gaps.md`](../pull-in-gaps.md#pixie_part1_docx_dshr).

---

## Heinz U. Lemke — 7 July 2026, 06:42 (from Nagoya / CARS 40th)

Dear friends,

just returned from Japan where we celebrated the 40th anniversary of the CARS Congress.

Please note, I have the complete PIXIE program as a list of some 5000 words in Assembler/Machine code for the PDP 7 and DEC 340 Display. So, if you need to have a look at it, I will make preparations to copy this document in due course. It has all the details about light pen handling , interrupt management and interactive model building on the PDP 7.

Please also note, the PDP-7 for PIXIE was NOT simply a display terminal for a program running on Titan! The 5000 instructions where primarily designed to interactively built up data structures for graph theoretic models (these had to fit in the remaining 3000 words on the PDP 7) that could present electronic circuits, syntax graphs, control systems, etc, which were then send to the Titan computer for simulation and so on.

By pure chance, with my good friend Roy Eagleson, who teaches in his computer science courses at UWO also the history of computer graphics, I discussed PIXIE last week in Nagoya. He expressed interest to be included in our exchanges on PIXIE and graphics, for his interest in the beginning of computer graphics at MIT and Cambridge.

Best wishes,
Heinz

---

## Roy Eagleson — 7 July 2026, 13:01

**From:** Roy Eagleson \<eagleson@uwo.ca\>  
**To:** Heinz Lemke, David S. H. Rosenthal, Don Hopkins, Lars Brinkhoff

Incredible !!! I was JUST preparing my HCI lecture for today, where I would normally talk about Sutherland's Sketchpad, but now I'm incorporating your stories about PIXIE!

I was JUST on Hopkins' website reading about Buxton's abuse of the patent system, and then the page asked me to get a login code to read further. When I went to get the login code, I see that you have just sent me this email, Heinz

What a small world. It's going to be a great lecture today! I feel the vibes in the air. I should probably play the video set to the Flight of the Bumblebee, right?

---

## Heinz U. Lemke — 7 July 2026, 13:22

Dear Roy,

here it is, the work of art by Don Hopkins!

https://www.youtube.com/watch?v=jDrqR9XssJI

Hope you enjoy it.

Best,
Heinz

---

## Don Hopkins — 7 July 2026, 16:34

**From:** Don Hopkins \<don@donhopkins.com\>  
**To:** Heinz Lemke  
**Cc:** Don Hopkins, Roy Eagleson, David S. H. Rosenthal, Lars Brinkhoff, Franziska Schweikert (CARS), **Will Wright**

Words can't express how giddy with delight I am from hearing from both of you fresh from Japan, and that you've got the source code I was so skeptical about still possibly existing, containing the most interesting parts like lightpen drivers, which we need to use and test virtual lightpen drivers on an emulator we should implement!

The idea of this "Repo Show" interview is to upload all the evidence, papers, newspaper and magazine articles (like the one about PIXIE), and ESPECIALLY source code to the repo beforehand, look at it and talk about it during the interview, then brainstorm designs for how to bring it back to life, using and extending an existing emulator.

We can do this asynchronously with individual people recording their voice / face / screen / code / photos / videos, the Flight of the PIXIE video plus the long form original films that Dave Chapman the Columbia librarian/archivists kindly tracked down and digitized, plus one-on-one interviews (which are easier to schedule crossing time zones and respecting constraints than more than two people).

Of course time and scheduling permitting we can do multi-person interviews and even real time Twitch streaming, but the default is making it as easy as possible for everyone involved to fit it into their schedules, and I will do all the housekeeping and butchering and editing and mixing and cooking.

I can even repurpose the cool Flight of the PIXIE AfterEffects techniques to give it an old school black and white film grain with modern subtitles and credits matching the original ones on film (jiggling them automatically and correctly using AfterEffect's motion tracking)! That was my proudest moment of that music video, the title and credits text! And I want to make that a "house style" we can apply to all kinds of retro videos. (I bet Lars has some like that!)

-Don

*(Chapman is Cambridge Univ Library, not Columbia — Don's wording in the email.)*

---

## Artifacts in repo

| What | Where |
|------|-------|
| Don's async + evidence-room reply (7 Jul 16:34) | this file · [`../../../repo-shows/pixie-pie-menus-pdp7/README.md`](../../../repo-shows/pixie-pie-menus-pdp7/README.md) |
| Telecine jiggle house style | [`../../../process/post-production/cambridge-telecine-jiggle.yml`](../../../process/post-production/cambridge-telecine-jiggle.yml) |
| Virtual light pen / emulator goal | [`../pull-in-gaps.md`](../pull-in-gaps.md) · show seed `interview_center.the_source_listing` |
| Will Wright on thread (Cc) | [`../../will-wright/correspondence.yml`](../../will-wright/correspondence.yml) |
| Source listing + correction essay | [`../pixie-source-recovery.md`](../pixie-source-recovery.md) |
| DSHR Hex draft + Lem thread (3 Jul) | [`../../david-rosenthal/sources/2026-07-03-pixie-moollm-lem-rautavaara-thread.md`](../../david-rosenthal/sources/2026-07-03-pixie-moollm-lem-rautavaara-thread.md) |
| *Flight of the PIXIE* | [youtube.com/watch?v=jDrqR9XssJI](https://www.youtube.com/watch?v=jDrqR9XssJI) · [`../../will-wright/sources/don-youtube-jDrqR9XssJI-flight-of-pixie/`](../../will-wright/sources/don-youtube-jDrqR9XssJI-flight-of-pixie/) |
| Buxton patent thread | [`../../don-hopkins/sources/2008-2023-pixie-buxton-patent-thread.md`](../../don-hopkins/sources/2008-2023-pixie-buxton-patent-thread.md) |
| Roy Eagleson · educator room | [`../../roy-eagleson/`](../../roy-eagleson/) |
| Ivan Sutherland · Sketchpad north star | [`../../ivan-sutherland/`](../../ivan-sutherland/) |
| Show seed | [`../../../repo-shows/pixie-pie-menus-pdp7/README.md`](../../../repo-shows/pixie-pie-menus-pdp7/README.md) |
