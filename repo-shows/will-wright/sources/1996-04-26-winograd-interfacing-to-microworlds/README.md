# Source: Will Wright — "Interfacing to Microworlds" (Winograd seminar, 1996-04-26)

The single most important seed document for the Will Wright Repo Show — and a
direct artifact of a **forebear** (Terry Winograd's open public Stanford UI
seminar; see `../../../../process/design-in-public.yml#forebears`).

This episode is the preserved centerpiece of the larger **Terry Winograd / CS547 archive** ("the treasure trove"). See the dedicated forebear show
`../../../terry-winograd/` — its [`ARCHIVE.md`](../../../terry-winograd/ARCHIVE.md) / [`archive.yml`](../../../terry-winograd/archive.yml) hold the **full catalog of 339 talks** (15 with online scans, 25 by people who are WWSFF characters): the shoulders we stand on — Terry as dragon + Will + James Gosling (Java, 1995) + S. Joy Mountford (1994) + Jef Raskin + Donald Norman + Alan Kay + Ted Selker + Scott Kim + ~290 others.

## What this is

Will Wright's talk to Terry Winograd's CS547 user-interface class at Stanford,
**April 26, 1996** — postmortems of SimEarth, SimAnt, SimCity 2000, then an
early public preview of **Dollhouse** (which became **The Sims**, 2000). Don was in
the audience, asked Will questions on camera, and **later preserved the record**:
uploaded the video to YouTube (Jan 2023, from Stanford Archives), cleaned the
transcript, and wrote the Medium article. A **proto-Repo-Show**.

This was the **first** of Will's CS547 talks, not his only one — he returned on **2003-05-02**
with **"Games and Simulation"** (CS547 Winograd 5). Both are catalogued in the
[CS547 archive](../../../terry-winograd/ARCHIVE.md); this 1996 talk remains the show's single
centerpiece by design (see `../../SHOW.yml#topic_less_by_design`).

- `transcript.md` — Don's hand-perfected transcript with table of contents and section headers.
- `transcript-summary.md` — same text, plain layout (no navigation).
- `medium-article.md` — Don's Medium article, woven around the video with slides.
- Video: <https://www.youtube.com/watch?v=nsxoZXaYJSk>
- Stanford: <https://searchworks.stanford.edu/view/yj113jt5999>
- Medium: <https://donhopkins.medium.com/designing-user-interfaces-to-simulation-games-bd7a9d81e62d>
- Use/reproduction: Stanford Archives materials are open for research use and may be used freely for non-commercial purposes with attribution; transcript by Don.

## The pivotal moment (the one Don flagged)

After the postmortems + audience Q&A, a student asked the **$5-billion question** ([The Sims franchise has since passed $5 billion in lifetime sales](https://www.gamesindustry.biz/the-sims-franchise-surpasses-usd5b-in-lifetime-sales)) —
*what are you working on now?* — and Will was **genuinely, warmly taken aback**
(took a few steps back, "Oh, God…"), then took a swing at it and rolled into the
epic **Dollhouse** demo. The exact exchange:

> **Student:** What projects are you working on now… what projects or models had you considered before that were kind of interesting that you didn't do?
>
> **Will Wright:** You mean like what systems have I considered modeling?
>
> **Student:** Right. And also what systems are you currently working on, if you can talk about them?
>
> **Will Wright:** Oh, God… Okay, well one thing we're working on, is a — we've been kind of interested in our company for a long time about the idea of **data portability**. Really, let me back up just a little bit here, and this might be a little bit more of an answer than you were looking for, but…

…and then: *"This is a game I call Dollhouse. And if this looks familiar, it's because I've just loaded a SimCity file into here."* The birth of The Sims, in public, answering a student's question.

## Why it's THE seed for the first show (full circle)

This is the talk that sent Don to Maxis to work on The Sims. Doing the **first
Repo Show with Will** — `../../SHOW.yml` (topic-less kickoff) — closes that loop
~30 years on. The kickoff can literally open by replaying this moment: *the
question that unspooled The Sims.*

**The CENTERPIECE (single artifact, keep focused).** The first show is
anything-goes, but it **starts with and orbits this one video + article** — no
other videos; there's more than enough here already. It's the shared seed for
asking Will questions and making comments.

**The arc — this show completes the 1996 talk's own shape.** The 1996 talk
looked *back* with three post-mortems — a constellation of **easy / hard /
just-right** (SimAnt too easy · SimEarth too complex · SimCity 2000 just right)
— then **pivoted the direction of time** to look *forward* and preview The Sims.
This show, ~26 years later (The Sims 1 shipped 2000), can finally be the
long-overdue **post-mortem on The Sims 1** itself. The forward-preview gets its
backward post-mortem, same two people in the room. (See `../../SHOW.yml#the_arc`.)

## Threads this ONE talk seeds (show ideas — maybe several)

- **Anatomy of a simulation game** — the tight coupling Will names: simulation × game × interface × **user's mental model** ("the computer model is just a compiler for the mental model"). A whole episode.
- **The Simulator Effect / story as medium** — players narrate causal chains Will *knows* don't exist; "they're using it as a medium to tell stories." (Don's line, on camera.) The game runs on **two computers**: the shallow tame one on the desk, and the deep wild one in the **player's head** (apophenia — we read patterns and meaning that were never coded). Good design **masks the machinery and offloads the simulation to the player's brain**, which fills in richer detail than you could ever simulate — *implication is more efficient than simulation* (see Reverse-over-engineering below), and you never simulate more than one layer below what the player can observe. Direct kin to **Scott McCloud's _Understanding Comics_**: **masking** (simple, iconic forms invite the reader to project themselves into the character) and **closure** (the mind fills the gap between frames, in the gutter). Same trick — the medium supplies just enough; the audience completes it. → also WHY the Repo Show works: a medium for telling creators' stories.
- **Toys, not games — possibility space** — Will designs open-ended *software toys* with no imposed win state, and sculpts the **possibility space** of what players can do; goals and meaning come from the player. Emergent complexity from simple, legible rules; the **Long Zoom** across scales (cell → creature → city → galaxy) in Spore.
- **The Julie doll → ambiguity beats literalism (a failure mode seeds Simlish)** — Will's anecdote, on camera, is a **failure mode he turned into a design seed**: Worlds of Wonder's **Julie doll** ($250, voice-recognition — "the only doll I've ever seen that appealed to grown men — a hacker's doll") went into focus groups with girls who played with it a while, then **took the batteries out and kept playing**. The doll's literal, understandable speech was meant to be *structure* for their fantasy, but instead **dictated** it — "telling them what the fantasy was, conflicting with what the girls were saying, interfering with their play." His fix: keep characters at a **local state-machine / Braitenberg level** (angry, hungry, sleepy) with **structural ambiguity like the Peanuts adults' "mwa mwa mwa"** — you read the emotion and fill in the words yourself. The direct seed of **Simlish**: deliberately *not* understandable English, so the player's imagination supplies the meaning — Will had reasoned the whole abstraction fix through **intentionally**, years before The Sims shipped it. It's the same insight from every angle in this talk: **abstraction** and **masking** (less detail invites more projection), the **Simulator Effect** (the deep computer runs in the player's head), and **reverse-over-engineering** (players invent the story that explains the system). Leave the gaps — the player fills them.
- **Advertisement-driven objects (SimAntics)** — Will, 1996: objects "advertising" *"If you're angry, pick up me and throw me!", "If you're hungry, eat me!"* — behavior distributed in the environment, data-driven, user-extensible, postable to the net. THIS IS THE EXACT MECHANISM the Repo Show uses for audience **question-advertisements** (moollm `advertisement` skill) AND the Sims⇔Stardew **bridge** + **characters-as-hydrogen** (objects/characters move between games). One 1996 talk → multiple project threads.
- **Reverse-over-engineering SimCity** — Will: "implication is more efficient than simulation"; Chaim Gingold's reverse diagrams. → pairs with the Chaim show + design-by-accretion (Will even says SimEarth "grew through accretion"!).
- **Failure modes + the Calvin Syndrome** — kids fail joyfully, adults fear failure; players poke the city with a bulldozer to test if it's real. Design-of-learning episode (constructionism).
- **"One vision, not committee"** — Will: "I've never seen a product design through a committee that came out well." (Resonates with the solo-dev + auteur themes.)
- **Data portability / hobby model** — games as train sets; persistent data moving between games. → directly the bridge / MSPO-RPG / universal-character thesis.

## Provenance + ethics

Faithful capture of Will's own words (the heartbeat: source, don't paraphrase).
Non-commercial use with attribution; attribute Stanford Archives + Don's transcript. Using it in a show =
within the show's consent flow (`../../invitation.md`).

**How it was preserved.** The talk survived as a DVD in Stanford Library's archive of Terry Winograd's
CS547 collection — listed in the catalog but not yet scanned. At the start of COVID, Don emailed Terry
about it; once the library reopened, the archivists scanned the DVD and posted it to SearchWorks, where
Don found it. He mirrored it to YouTube with attributions, proofread the machine-generated transcript,
and transcluded the transcript + screen snapshots here. The `medium-article.md` layers Don's real-time
notes from the talk (one layer written just after The Sims shipped) — elaborated over the years into the
published article.
