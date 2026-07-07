# How PARC and VPRI actually worked — hiring, headcount, and what killed the spillover

*Guest hub:* [`../../README.md`](../../README.md) · *Recaps hub:* [`README.md`](README.md) · *Corpus map:*
[`quora-corpus-2023-index.md`](quora-corpus-2023-index.md)

**Sources:** Alan Kay's public **Quora** answers to (among others):
- *"What was the staff size at Parc?"*
- *"How did Alan Kay recruit and interview his researchers at VPRI?"* (Kay notes the question may have changed;
  his answer covers ARPA/PARC hiring and adds VPRI)
- *"Why did so many of the innovations at Xerox PARC not make it into mainstream computing until several
  decades later?"*
- *"Could Xerox PARC have been done remotely with today's technology?"*
- *"What became of the work done at VPRI?"*

**Nature:** Summary with **short verbatim quotes**; verify against Quora before formal citation. Credit:
**Quora**. Governed by [`portrayal-standards.md`](../../../../schemas/portrayal-standards.md).

> **Project tie-in:** feeds hook **#15**, the Repo-Show thesis on *how to run a lab*, and cross-links to
> **Bob Taylor**, **Butler Lampson**, **Dan Ingalls**, **Yoshiki Ohshima**, **Alex Warth**, **Bret Victor**.

---

## PARC scale — ~25 researchers, 1:1 support, "slots" not headcount

PARC had four labs (computer science, systems, physics, optical); the ARPA culture pervaded the first two.
**Butler Lampson** estimated ~**25 researchers** in the early peak years; balance of researchers to support
staff ~**1:1**. A few years later Kay could count ~40 researchers in the computing side.

Critical funding mechanic: Xerox allocated **"slots"** (like gold), not budget-driven headcount — when a slot
opened, hire a **star**. Unusual and effective lab makeup.

Salaries were **not high**, but yearly **hardware support per researcher exceeded salary** — the aim was to
"live in the future" by anticipating Moore's Law ~15 years out and **building that future** for researchers.
Low headcount made it affordable. Xerox paid for all of PARC many times over from **laser-printer profits
alone**.

## Bob Taylor's hiring philosophy — "great," not "good"

Taylor told Xerox he "didn't plan to hire any 'good' people" — only **'great'** people: you can't approximate
a great person with any number of good ones; good people need managing; computing research at PARC would be
relatively cheap because great people are scarce.

**January 1971 windfall:** Berkeley Computer Corporation collapse let Taylor hire the entire ~8–9 person group
— **Butler Lampson, Chuck Thacker, Peter Deutsch**, etc. — "in a flash" giving critical mass. Kay broke his
promise to CMU: "with Butler and Chuck and Peter … we can now do anything."

After that, hiring stayed **slow**: every existing staff member had to **really really want** the next hire —
eliminating rivalries. Taylor was "completely right" despite complaints about time taken.

Taylor on his job (research psychologist, not a technical computer person): get **self-driven** "lone wolves"
who aren't manageable; set up an environment where they **cooperate when it's a good idea** — without top-down
pressure. Kay and Butler rate Taylor a **"social genius"** for keeping talent original yet synergizing.

## Kay's group — cardboard Dynabook, "stars in their eyes," love

Kay oversimplifies: recruited **"by literally talking and literally handwaving"** — hand usually held the
**cardboard Dynabook** model from after meeting **Seymour Papert**. Only interested in people who got **"stars
in their eyes."**

Key hires (random + internships):
- **Dan Ingalls** and **Ted Kaehler** — hallway conversation, "stars in their eyes"; impact "cannot be
  overstated."
- **John Shoch** — Stanford student, summer intern, never left; major networking figure.
- **Adele Goldberg** — "truly top-class multidimensional force of nature"; brought **Steve Weyer**.
- **Diana Merry** — physics-lab PA; showed "programming kind of thinking" on a typing service; became one of
  the great "bulldogs."
- **Dave Robson** — reverse-engineered Smalltalk from vague descriptions as a student; summer intern, never
  went back.

Summary: **"pretty randomly,"** often via internships to test "depth and fun." The group had what Kay calls
**"love"** — huge personality differences, persists 50 years later.

Organization: very loose, not hierarchical or democratic. Argumentation to **expose points of view**, not win;
often deferred to whoever had the best view (voting rare).

## The "100 of anything" rule and minimal standardization

Pretty much everyone at PARC could design a language/OS (and did) — agreements minimal. But they decided to
make **"100" of anything invented** — 100 Altos, Ethernet with ≥100 taps — requiring more cohesion, still
without top-down planning. (Compare ARPA's Internet standards process.)

**Butler Lampson** urged engineering every PARC invention for real use; Kay credits Butler's software policy:
standardize only **disk format** (one crash-recovery program) and later **Ethernet packet format** — see
YootTower [`People.md`](https://github.com/YootTowerManagement/YootTower/blob/main/Yoot_Saito_Alan_Kay_Interview/People.md)
(Lampson entry).

## Why GUI and Ethernet spread but programming practices didn't

**Ethernet:** outside need (no workable LAN), straightforward path via DEC, 3Com, engineering on connectors.

**GUI:** "to see it was to get the basic idea" — bitmap + pointing + memory; **Steve Jobs** ~6 years after
Alto; Lisa ~3–4 years after Apple committed.

**Programming practices** from PARC: largely **not adopted** because "everyone in computing already thought
they knew how to program" — but they didn't know LANs or GUIs. Kay's bottom line: general **aversion to really
learning new things** — NIH from pride, faddism, laziness. ARPA/PARC community was better at adopting and
sharing good ideas (roots back to WWII-era community).

## Remote PARC? — problem-finding doesn't Zoom

Attempts to recreate "a Xerox Parc" haven't succeeded. The prior **ARPA community** shaped researchers who
formed PARC — many were **not replaceable**. Parc itself had projects for remote collaborative research
(Engelbart lineage, Negroponte's Arch-Mac).

"Today's technology (not necessarily methods)" matters — serious resources required (HP Halo, Cisco tools,
Ishii Liveboard, Applied Minds, etc.). Much of what PARC built would have been **unnecessary if remote
collaboration tech already existed**.

Kay's best answer: some fabrication could be remote; **main work** (problem finding and design) would be
"difficult to impossible" remotely. Remote collaboration must solve **"getting things done together"** and
**"arguing without alienation."**

## VPRI — after Disney, never miss payroll, tell the truth in special ways

VPRI started **"AD" (after Disney)** ~early 2000s as an NPO to stay with favorite colleagues post late-90s
bust. **Bran Ferren** got free space at **Applied Minds** (with Danny Hillis) on Disney's Imagineering lot.

Principles:
- **"Research means you can change your mind"** — avoid funder-posed problems (Kay stuck to this).
- **Kim Rose** essential; **"never miss payroll"** (sometimes Kay's savings).
- From **Dave Evans**: never lie to a funders — can't do "good science" if you lie; **"learn how to tell the
  truth in very special ways."**

Small scale but top talent: Etoys-in-schools investigations; random additions (Japan government talent-pool
work; **Yoshiki Ohshima** — "strong opinions … Great, I'll hire him right now!"; **Alex Warth** from UCLA
"mystery hour" class; **Bret Victor** — "this guy should have his own research group — VPRI is too small a
venue").

**What became of VPRI work:** papers at [vpri.org](http://www.vpri.org); ongoing via **Croquet.io**; Bret at
**worrydream.com**. Deep research (VPRI, Bret Victor, etc.) often **not incremental** — closed-source systems
with published papers (see Quora thread on why VPRI code stayed closed).

## Questions for Alan (show fodder)

- Could **"100 of anything"** work today — or did it require a monopoly profit center (laser printer) no one
  has now?
- Taylor's hiring rule — still the best advice, or impossible in today's HR?
- **VPRI closed source** — regret, or necessary to do non-incremental work?
- What would you tell someone trying to build **"PARC for microworlds"** in 2026 with $X and Y people?
- Remote work killed **problem-finding** — or did we never build the collaboration medium PARC would have
  invented first?
