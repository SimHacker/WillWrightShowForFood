# Source: Bobo's Brain UI — beta screenshots thread, 31 May 2021

*Post:* [Maxis Alumni screenshot](2021-05-31-maxis-alumni-brain-ui-post.jpg) — Don Hopkins, 11 reactions, 29 comments

Don posted the YouTube video **"The Sims — Beta/Alpha Screenshot Compilation"** to Maxis Alumni
(exact video URL not captured in the screenshot — to be filled in), flagging one frame in particular:

> "Including a snapshot of **Bobo's Brain User Interface**! @1:43 Jan-Feb 1999 'Blue mood indicator,
> Brain UI Build'"

The resulting thread produced the **Brain UI design spec**, the **origin of the Plumbob**, and the
best bug story in the archive. *"Bobo"* is the in-house nickname for
[Eric Bowman](../../../eric-bowman/), who is in the thread.

## The Brain — from Design Document Draft 7

Don quoted the spec for the discarded interface. Before Live Mode's panels became bars and tabs, the
character panel was **a brain with four clickable lobes**:

> **The Brain**
>
> The brain has four clickable areas/buttons representing the four Live Mode subpanels: motives,
> personality, skills and relationships. The Motive brain button is the default. Each button has the
> letter corresponding to its name overdrawn on it. P for personality, etc. The title of the brain
> section will appear as tooltips upon rollover. Charles will try icons for the letters.
>
> **Stimulation:** when the selected character has an interaction with an object or with another
> character, the section(s) of the brain that is stimulated will flicker with a rapid on and off. […]
> This is meant to clearly connect the action in the game with the elements of the characters. For
> example, when a character is preparing a meal, the skills section of the brain would flicker, when
> the character is eating the meal, the motive section would flicker. It is possible to have multiple
> sections flickering at the same time as you would find when a character is having a conversation
> where the relationship, motive and possibly, skill areas are being stimulated.
>
> Each brain button must have the following states: • Stimulated • Unstimulated • Selected brain
> button will be shown with a frame around it
>
> **Brain Subpanels:** When you click on (select) a brain section, that subpanel (motive panel,
> personality panel, etc.) opens to the right. When a specific element in the subpanel is being
> stimulated, the red and green arrows will pulse on either side of the gauge.
>
> NOTE: Personality will never flicker because it is not "stimulated" but it is selectable so the
> personality bars can be viewed. Also, interests are tracked, but are not displayed on CP. **Should
> flicker personality whenever it effects something. Flicker on read as well as write. Would be a
> shame for one lobe to look dead! Lots of flicker!**
>
> **Need a smooth throbbing brain effect that combines instantanious blinking flicker with smooth
> glowing decay over time.**
>
> — [The Sims Design Document Draft 7](https://donhopkins.com/home/TheSims/TheSimsDesignDocumentDraft7-1998-10-02-DonsReview.pdf)

Read this as interface design and it is remarkable: the panel was to be a **live readout of the
simulation reading and writing itself**. Not a status display but a debugger for the soul, wired so
that *"flicker on read as well as write"* — the UI lighting up when the AI merely *consults* a value.
The design's own stated fear is aesthetic rather than functional: *"Would be a shame for one lobe to
look dead!"*

Note also **"Charles will try icons for the letters"** — that is Charles London, three sentences
before the section of history where his placeholder art becomes the franchise logo.

Same Draft 7 that appears in the [same-sex relationships record](../../../patrick-j-barrett-iii/same-sex-relationships-the-record.md),
read here for an entirely different reason.

## The Plumbob was placeholder art nobody was allowed to fix

The thread turned to why the shipped UI renders at 800×600 with a border rather than natively at
1024×768. **Mats Vederhus** raised it; **Eric Bowman** guessed performance and effort (*"There was a
LOT to do at the end and the final UI came together pretty late"*), then asked Charles directly.
**Charles London**:

> "As I recall it was a performance decision at first, and when the issue came up again near ship
> we'd hit **art lock**, which our EP was very stringent about. So stringent that **the placeholder
> art I'd made for the active character indicator was forbidden to be updated**, regardless of any
> amount of my cajoling. **We call it the Plumbob now and it's the symbol of the whole franchise.**"

Followed by: *"The plumbob replaced the arrow."* Eric asked whether Don gets the art credit;
Charles: *"Nope, it was me."*

**The most recognizable symbol in life-sim games is a placeholder that shipped because a process
rule wouldn't let its own author improve it.** Art lock as accidental canon.

Don's adjacent credit, which is *not* the Plumbob:

> "No, but I made the **Spinning Arrow Of Shame** that was accidentally featured in one of the
> trailer videos. The nice sharp edges were proof that my exporter could finally handle **smoothing
> groups**!"

That is the same exporter whose debug output is
[`archie-suit.txt`](../2022-05-18-archie-suit-cmx-whitman/README.md) — the arrow it replaced, and the
proof-of-smoothing-groups that made it, are two halves of one toolchain story.

And on the mood indicator's color, **Eric Hedman** ([room](../../../eric-hedman/)) asked *"Why
Blue?"* Don:

> "nobody ever got fired for choosing Big Blue!"

## The Memorial Foosball Table — Will joke, 20 years later

Mid-thread, photos of a **Tornado** table with a brass **"JIM MACKRAZ MEMORIAL FOOSBALL TABLE"**
plaque surfaced. The alumni treated it as an epitaph until Jim typed back. Eric Bowman: *"You have to
love a Will joke that comes home to roost 20 years later."* Jim asked Jason Haber for the table back;
Bradford Smith admitted he'd played on it for years without knowing Jim was alive.

Full thread, photos, and open leads:
[`memorial-foosball-table.md`](../../../jim-mackraz/memorial-foosball-table.md).

## Censorship shipped before nakedness

**Jim Mackraz** ([room](../../../jim-mackraz/)) — *"Don, have you got any of the shower door?
**#stillproud**"* — prompting Don to the stippled shower door around **13:30** in
[The Sims Steering Committee, June 4 1998](https://www.youtube.com/watch?v=zC52jE60KjY&t=13m30s)
(archived: [that build's page](../1998-06-04-sims-steering-committee-demo/README.md)). Then the
story:

> "We had **Censorship** implemented, but we hadn't implemented **Nakedness** yet, so he sat down on
> the toilet with his pants on, and pooped his pants while censored (thank god), and then took a
> shower with all his clothes on."

A perfect artifact of implementation order: the mosaic existed before the thing it was built to
obscure, so the game dutifully censored a fully clothed Sim. **Eric Bowman** added his own period
detail — *"Nice shots of the lamp effect and the thick walls that could never ever have their
graphics updated because they violated the laws of physics."*

## Links Don gathered in the thread

Preservation resources, worth keeping together:

- [Prerelease: The Sims (Windows)](https://tcrf.net/Prerelease:The_Sims_(Windows)) — The Cutting Room Floor
- [The Sims (Windows) / Unused Animations](https://tcrf.net/The_Sims_(Windows)/Unused_Animations)
- [The Sims (Windows) / Unused Sounds](https://tcrf.net/The_Sims_(Windows)/Unused_Sounds)
- [ModTheSims: Sims 1 Beta discussion / Pre-Release Sims Footage Pics](https://modthesims.info/showthread.php?t=615258)
- [Sims Webcam Archive 8.18.99 \[6/6\]](https://www.youtube.com/watch?v=uiwvwTcaukg)
- [Sims 1 Complete Collection Widescreen Patcher](https://github.com/FaithBeam/Sims-1-Complete-Collection-Widescreen-Patcher) (Mats Vederhus)

**Bonnie Murphy** in the thread: *"This is amazing. Sharing with my daughter, who is training to be
game digital artist. Her peers in her program at NonPareil will love this!"*

## Who needs a room

**Charles London** has no character directory here and clearly should — Plumbob author, Brain UI
icon work, and a first-hand account of art lock. Same for **Mats Vederhus**, who does careful
technical archaeology on the shipped UI.

## Repo orbit

- [`archie-suit.txt` — the CMX exporter](../2022-05-18-archie-suit-cmx-whitman/README.md) — smoothing groups, Spinning Arrow Of Shame
- [Steering committee demo, June 1998](../1998-06-04-sims-steering-committee-demo/README.md) — the shower door build
- [Same-sex relationships record](../../../patrick-j-barrett-iii/same-sex-relationships-the-record.md) — the other reading of Draft 7
- [Eric Bowman](../../../eric-bowman/) (*Bobo*) · [Jim Mackraz](../../../jim-mackraz/) · [Eric Hedman](../../../eric-hedman/)
