# Claims analysis — Kurtenbach, Sellen & Buxton 1993 (HCI 8(1), "marking menus")

**Paper:** "An empirical evaluation of some articulatory and cognitive aspects of 'marking
menus'," *Human-Computer Interaction* 8(1), 1–23, Jan 1993.
**Copy analyzed:** https://billbuxton.com/PieMenus.html (Buxton's own HTML; abstract has
transcription gaps — "which makes .", truncated sentences — artifacts of the page, not the paper).

The most revealing document in the dispute: it contains **both** the seed of the false
uniqueness claim **and** the data that refutes it.

## Honest claims (confirmed)

| Claim | Assessment |
|-------|------------|
| "an extension of 'pie menus'… pie menus in which the path of the cursor leaves an ink trail" | The definitional admission of derivation, sentences 1–2 of the abstract. Everything but the ink is inherited. |
| Empirical results: even sizes beat odd; 8 and 12 facilitated (compass/clock); trackball worst; hidden-menu learning converges on exposed baseline | Sound, novel-in-literature, useful. Consistent with what Don had already credited to Kurtenbach in DDJ Dec 1991. |
| "Markings themselves do not afford reselection, whereas **the mechanism of the pie menus does**" | Their own attribution of reselection to the pie menu mechanism — undercuts later claims. |
| "Clearly many of the subjects in the Marking group were not thinking of the task as making marks per se, but of making selections from menus that they had to imagine" | The marking *metaphor* failed empirically; subjects did hidden pie menu selection. |

## The self-refutation in Table 1

The ink trail — the **sole novel feature** — produced no measurable behavioral difference:

- RT: Hidden 1.10s, Marking 1.10s (identical)
- Errors: 3.27 vs 3.76 per 40 trials — post hoc (Tukey) **no difference** between hidden groups
- Stroke shape: "The presence or absence of an ink trail did not appear to make any
  discernable difference"
- Their summary: "**very few behavioral differences were found between the two groups**"

The one exception — stylus faster than mouse in the Marking group — they themselves attribute
to a **pressure-feedback artifact** of the Wacom stylus ("it is often difficult to perceive
when enough pressure is being applied… a stylus with audio or tactile feedback… might have
fared better in all groups"). A hardware workaround, not a cognitive benefit of marking.

## False / misleading claims

### 1. "Marking menus are also **unique** in that they ease the transition from novice to expert user. Novices can 'pop-up' a menu and make a selection, whereas experts can simply make the corresponding mark without waiting for the menu to appear."

Known-false at writing. The mechanism is pie menu mouse-ahead with display preemption, in
print repeatedly before Jan 1993:

| Receipt | Text |
|---------|------|
| Jun 1986 X10 code + video | Prototype had **mouse-ahead out of the box**; the uwm version added **display preemption, cursor warping, nested submenus to any depth, browsing and reselection** — implemented before any publication; source survives, demo on video (shown at BayCHI'98) |
| 1987 ;login: | Directional selection, mouse-ahead |
| Apr 1988 [UMD proposal](1988-04-10-umd-tech-writing-proposal.md) | "rapidly **mouse ahead** through familiar menus, without having to look at the screen"; muscle memory; chunking credited to Buxton 1986; **PIXIE in the bibliography** |
| Mar 1988 "How to Choose with Pie Menus" | "If you are fast enough, and release the button before the menu pops up, **you may not even see the menu on the screen**" |
| 1989 PSIBER (Usenix) | "**mouse ahead display suppression**" |
| Dec 1991 DDJ ([digest](ddj-1991-design-implementation-pie-menus.md)) | "mark ahead so fast that the menu doesn't even pop up… **novices soon become experts**, because every time you select from a pie menu, you practice the motion to mark ahead" |
| 1990 Kurtenbach → Don email | "expert can mouse ahead **like you've talked about** but they get an ink trail" |

The abstract is the 1990 email sentence with "like you've talked about" deleted and "unique"
inserted. The only defensible referent of "unique" is the ink trail — which Table 1 shows
does nothing.

### 2. Rehearsal claimed as their insight

"The user… **actually rehearses the physical movement** involved in making the mark every
time a selection from the menu is made. We believe that this further enhances the
association." — The rehearsal identity is Hopkins 1988/1991 (with Lanier's "the mind may
forget, but the body remembers"), explained to Kurtenbach in 1990. Their own accelerator-key
analogy concedes the concept predates them; only the attribution is missing.

### 3. Literature erasure

"To date there is little research on the use of pie menus in human-computer interaction" —
citing **only** Callahan et al. 1988. Absent: Hopkins 1987 ;login:, 1988 UMD TR, 1989 PSIBER,
Dec 1991 DDJ (over a year before this issue). The missing documents are precisely the ones
containing mark-ahead, display suppression, rehearsal, and reselection. The "unique" claim
survives review only because the refuting record isn't in the references.

### 4. Inverted lineage

"We suggest that 'pie menus' can be used to make marking self-revealing" — pie menus framed
as a component adopted into their marking framework. Mechanically the reverse: the menu, the
dwell/suppression, the rehearsal transition, and mark-ahead **are** the pie menu; the mark is
the addition. "We refer to this as being self-revealing" also reads as coinage — the term is
on the DDJ 1991 cover treatment ("Fast, Easy, and Self-Revealing"); Ted Nelson credits it to
Klaus Landberg (Datapoint) before either
([note](2020-ted-nelson-klavs-landberg-self-revealing.md)).

## The pre-publication rebrand receipt

DDJ Dec 1991, Don's text: "**Gordon Kurtenbach carried out an experiment comparing pie
menus** with different visual feedback styles, numbers of slices, and input devices" — even
beats odd, eight optimal, pen > mouse > trackball. Same factors, same results as this paper.

Sequence: Don publicized the study, collegially, as **pie menu research** in a national
magazine (1991) → it appeared in 1993 rebranded as validation of "marking menus," with the
pie menu feature set declared "unique" to the rebrand. **Don credited them before they
de-credited him.**

## Downstream

This paper is the publication leg under patent **US 5,689,667** (filed 1995, granted 1997)
and the Alias marketing. The escalation pattern: the 1993 paper contains the admissions
(extension; reselection is the pie menu mechanism; ink trail changed nothing) alongside one
word of spin; the patent and marketing kept the spin and dropped the admissions —
[two-level FUD](pie-menu-fud-misconceptions.md).

Funding note: work supported by NSERC, DEC, and **Xerox PARC** — Mark Weiser's employer and
CHI'88 co-author institution.

## Show beat

Three documents read aloud, no commentary: the DDJ 1991 "Kurtenbach carried out an
experiment comparing pie menus" paragraph → the 1993 abstract's "Marking menus are also
unique…" → the 1990 email's "like you've talked about." Then Table 1: ink trail, 1.10 vs
1.10.

→ [`ddj-1991-design-implementation-pie-menus.md`](ddj-1991-design-implementation-pie-menus.md) ·
[`pie-menu-fud-misconceptions.md`](pie-menu-fud-misconceptions.md) ·
[`pie-menu-timeline.md`](pie-menu-timeline.md) ·
[`2008-2023-pixie-buxton-patent-thread.md`](2008-2023-pixie-buxton-patent-thread.md)
