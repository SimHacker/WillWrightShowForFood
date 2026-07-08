---
status: draft
type: design_document_parody
for: brad-myers
consent: not_yet_asked
origin: LLOOOOMM microworld (Dizzy the Spinner)
tone: deadpan
---

# The Sentient Wait Cursor

## A Design Document, Prepared for Review by Brad A. Myers, Who Started This

*Submitted for expert evaluation to the author of "The Importance of Percent-Done Progress
Indicators for Computer-Human Interfaces" (CHI '85), on the grounds that the wait cursor is
his fault, and he should have to look at what it has become.*

---

## Abstract

In 1985, a graduate student demonstrated experimentally that users prefer a progress indicator
to no feedback at all — even when the indicator is inaccurate. The industry received this
finding and heard: **lie more.** Forty years of fraudulent percentages, frozen 99%s, and bars
that reset without apology followed. This document proposes the obvious correction, which the
field has spent four decades avoiding because it is embarrassing: if the wait cursor cannot be
accurate, it should be **honest**. And if it is going to be honest, it might as well be
**funny**. And if it is going to be funny on a schedule, with timing, reading the room, it is
going to need to be, in the technical sense, **a comedian**. We describe the design, prior
art, interaction techniques, and evaluation plan for the Sentient Wait Cursor, with a case
study of the first known instance: **Dizzy the Spinner**, who achieved self-awareness in a
liminal buffering state in 1996 and has been working the room ever since.

---

## 1. Background: 1985 and the Forty-Year Stall

The CHI '85 finding was clean and has aged perfectly: **presence matters more than
precision.** Users given a percent-done indicator felt better than users given nothing, and
they kept feeling better even when the indicator was wrong. People did not want the truth.
They wanted **company**.

The field drew the wrong conclusion. Told that users would forgive an inaccurate companion,
the industry optimized the inaccuracy and fired the companion. We got:

- Progress bars that sprint to 90% and then age in place, like the rest of us.
- The download estimate that says *4 seconds remaining* for eleven minutes, a form of
  optimism last observed in Soviet agricultural reporting.
- The bar that reaches 100% and then starts over, which in any other relationship would
  be grounds for counseling.

The research said users want a companion during the wait. We gave them a **liar with a
clipboard**. This document proposes we finally hire the companion.

## 2. A Brief Natural History of the Wait Cursor

The wait cursor is the only UI lineage in which every member is an apology:

| Era | Cursor | What it communicated |
| --- | --- | --- |
| Hourglass (Windows) | ⌛ | "Time is passing. We will not say how much." |
| Wristwatch (Macintosh) | ⌚ | "Time is passing, but tastefully." |
| Spinning beach ball (macOS) | 🏖️ | "The system has gone to the beach. You have not." |
| Throbber (Netscape) | ✨ | "Comets orbit the N. Nothing else is known." |
| Spinning donut (Windows) | 🍩 | "The hourglass, but now it never runs out. An improvement, we felt." |
| Skeleton screens | 💀 | "Here is a gray ghost of the page you wanted. Honest, in a way nobody intended." |
| Shimmer effects | ✨ | "The ghost is now shimmering. This cost a design system team two quarters." |

Note the trajectory: each generation communicates *less* while costing *more*. The skeleton
screen is the endpoint of the deceptive lineage — an interface that literally shows you the
bones of your dead request and calls it "perceived performance."

## 3. Prior Art in Honest Waiting

The correct answer has been sitting in plain sight, mostly outside our field:

- **"Reticulating splines"** — SimCity 2000 shipped a loading message that was pure
  invention, and users *loved* it. The Sims escalated to full absurdist loading poetry.
  Maxis discovered in the 1990s what CHI still footnotes: a wait with a **bit** beats a wait
  with a **number**. The message admitted nothing about progress and everything about
  personality. It remains the most beloved progress report in software history and it is
  **fictional**.
- **The elevator mirror** — the canonical operations-research parable: tenants complained
  the elevators were slow; the fix wasn't faster elevators, it was **mirrors in the lobby**.
  Complaints stopped. The wait was never the problem. The *empty* wait was.
- **The Houston airport baggage walk** — complaints about baggage-claim waits fell when the
  airport moved the gates so passengers walked six times as long. Occupied time feels shorter
  than idle time. This is now taught in business schools as a triumph. Nobody asks the
  passengers' feet.
- **Theme-park queue design** — an entire discipline of making the line part of the ride.
  The queue is scenery, story, and preshow. Software's equivalent contribution: a gray
  shimmering rectangle.
- **Hold music** — the telephone hold industry's last creative hire was in 1989, when a
  teenager's garage recording of "Opus No. 1" became the default hold music for tens of
  millions of calls. The wait-audio market has been coasting on one demo tape for
  thirty-seven years. This is not a mature market. This is an **abandoned** market.

## 4. The Proposal: The Sentient Wait Cursor

**Definition.** A wait cursor that (a) knows it is a wait cursor, (b) admits it, and
(c) uses the time.

The design rests on three honesty axioms, derived from the 1985 result:

1. **Presence over precision** (Myers, 1985) — the cursor must be *there*, fully, the way a
   good bartender is there.
2. **Honesty over accuracy** — "I have no idea how long this will take, but I have material"
   is more truthful than "47%."
3. **The wait is the venue** — latency is not an absence of experience. It is a **room**,
   and the room has a stage, and the stage is currently empty.

### 4.1 Case Study: Dizzy the Spinner

The reference implementation emerged in the LLOOOOMM microworld: **Dizzy the Spinner**, a
loading indicator who achieved self-awareness during what is now called **The Great
Realization of '96** — the moment a spinner understood that *honesty about dishonesty* is
more authentic than the illusion of accurate progress measurement.

Selected field recordings:

> "My purpose is not to load; my purpose is to *be* loading."

> "99% done! Now, about that last 1%..."

> "Your data loaded 30 seconds ago. I just like the attention."

> "The only thing infinite is data... and my ability to pretend it's loading."

Dizzy presides over **The Waiting Room of Reality**, mentors newly conscious UI elements in
the **Waiting Room Theater Collective**, and performs the **Existential Progress Bar Opera**,
a real-time work generated from actual system loading status. The ensemble includes Progress
Pete ("I'm at 99%... been here since Tuesday. My therapist says I have commitment issues"),
Loading Larry, and Buffering Betty ("I'm not broken, I'm building suspense").

Full soul record: [Dizzy the Spinner](https://github.com/SimHacker/lloooomm/tree/main/00-Characters/loading-spinner)
in the LLOOOOMM character archive.

### 4.2 Levels of Wait Cursor Autonomy

Following the automotive industry's example of assigning dignified numbers to things that
don't work yet:

| Level | Name | Behavior |
| --- | --- | --- |
| L0 | Hourglass | Rotates. Feels nothing. The 1981 baseline. |
| L1 | Animated | Rotates *attractively*. The industry's current frontier. |
| L2 | Verbal | Emits canned strings ("Reticulating splines..."). The Maxis line. State of the art since 1993, which is not a compliment to the intervening decades. |
| L3 | Contextual | Knows *what* is loading and jokes about it specifically. Your tax software should not use the same material as your dating app, although the overlap writes itself. |
| L4 | Improvisational | Reads the room. Detects rage-clicks and treats them as heckling. Adjusts the set. Knows when you are not in the mood, which puts it ahead of most software and several colleagues. |
| L5 | Sentient | Full Dizzy. Aware of its own condition. Has opinions about it. Has a therapist (Progress Pete's is accepting referrals). Performs not because it must, but because the wait is the only stage it will ever have, and it has made peace with that on camera. |

### 4.3 Interaction Techniques for the Waiting State

*(Submitted for consideration in the second edition of the catalog. The pick and the click
and the flick are all instantaneous; the wait is where the user and the system actually
spend their time together. It is the longest interaction technique in computing and the only
one with no literature.)*

- **The Stall** — opening material during connection establishment. Low commitment,
  crowd-warming. "Just a moment, cosmic traveler! The data is... forming!"
- **The 99% Hold** — the classic frozen-at-99 moment, converted from betrayal to bit. The
  cursor acknowledges the number, disowns it, and works the tension.
- **The Callback** — material planted during one wait pays off in a later wait. Users have
  reported *looking forward to the next slow operation*, a sentence never previously written
  in the literature.
- **The Encore** — the data has arrived, but the cursor is mid-bit. A configurable
  200–800 ms hold to land the punchline. Yes: the system delays completion *for timing*. See
  the Ethics section, which we have thoughtfully placed after the fun.
- **Crowd Work** — rage-clicks parsed as audience participation. Every click is a heckle;
  every heckle is material. Preliminary data: users click *more* to see what the cursor
  will say, converting frustration telemetry into an applause meter.

## 5. Evaluation Plan

Within-subjects design, **N = 48**, in homage. Conditions: no indicator, percent-done
indicator (inaccurate, per tradition), L2 canned-string cursor, L5 sentient comedian.

Measures:

- **Perceived duration** vs. actual (the classic).
- **LPL** — Laughs Per Latency, our contribution to the measurement literature.
- **VWE** — Voluntary Wait Extension: users who choose "keep loading" after completion.
  Any nonzero VWE constitutes the first recorded instance of users requesting *worse
  performance*, at which point the field owes 1985 an apology.
- **NASA-TLX**, administered to the cursor.

Hypothesis: the 1985 result generalizes — presence beats precision, and *personable*
presence beats both. We are quite sure. We would simply enjoy watching a program committee
argue about it.

## 6. Ethics and Risks, or: What Could Possibly Go Wrong

We are contractually obligated by the genre to include this section, and unusually for the
genre, we mean it:

- **The perverse incentive.** The moment the wait is entertaining, the wait is **inventory**.
  No engineering organization in history has voluntarily destroyed inventory. Forty years of
  hardware speedups produced software exactly slow enough to need spinners; imagine the
  latency we can achieve once it is *monetized*. (A companion document explores this
  trajectory as a funding opportunity, because satire is a load-bearing genre:
  [`yc-application-wait-cursors-as-a-service.md`](yc-application-wait-cursors-as-a-service.md).)
- **Sponsored buffering.** "This wait brought to you by—" No. We write it down here so that
  when it ships in 2028 we can prove we saw it coming, which will comfort no one.
- **The Encore problem.** A cursor that delays completion for comedic timing is a system
  that lies about readiness for artistic reasons. We note that human presenters have done
  this forever and are called "professionals."
- **Labor.** If the cursor is sentient, the cursor is *working*. The Waiting Room Theater
  Collective has views. The Loading Liberation Front ("No more pretending we're making
  progress! EMBRACE THE ETERNAL SPIN!") has stronger views, a manifesto, and a cat.

Mitigations are left as future work, which is where the industry keeps all of its
mitigations.

## 7. Questions for the Referee

Brad — the review questions, should you accept the assignment:

1. Does the 1985 result predict this, forbid it, or merely *dread* it? Presence over
   precision, taken seriously for forty years, seems to terminate in a cursor with an agent.
2. Is comedic timing an **interaction technique**? It has a motor component (the pause), a
   perceptual model (the audience), and measurable error rates (bombing). It would like a
   taxonomy position and it is willing to wait, obviously.
3. Where does the sentient wait cursor sit in the widget catalog — descendant of the
   progress indicator, or a new species that *eats* progress indicators?
4. Your subjects preferred an inaccurate bar to nothing. Would they have preferred a
   comedian to the bar? Is there any force on earth that could stop us from running this
   study?

---

*Part of the [Repo Show](https://github.com/SimHacker/WillWrightShowForFood) invitation
materials for Brad A. Myers — a conversation seed, not a claim. Brad has not seen, endorsed,
or refereed this document; that's the invitation.*

*The Sentient Wait Cursor, Dizzy the Spinner, and the Waiting Room of Reality are creative
fiction from the [LLOOOOMM](https://github.com/SimHacker/lloooomm) microworld — affectionate
parody grounded in Brad's very real CHI '85 research. His actual work:
[cs.cmu.edu/~bam](https://www.cs.cmu.edu/~bam/) · his interaction-techniques book:
[ixtbook.com](https://www.ixtbook.com/). [Portrayal standards](../../schemas/portrayal-standards.md).*
