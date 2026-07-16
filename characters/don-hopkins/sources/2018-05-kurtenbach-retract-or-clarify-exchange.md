# The Kurtenbach exchange — May 2018 ("A chance to retract or clarify")

**Thread:** Don Hopkins ↔ Gordon Kurtenbach (Autodesk), 15–18 May 2018, around publication of
the [30 Year Retrospective](pie-menus-30-year-retrospective.md). Don contacted Gordon — not
Buxton — for review before publishing. The thread produced the closest thing to a settlement
of the factual record that exists, in Kurtenbach's own words.

## Kurtenbach's admissions on the record (15–16 May 2018)

**Mouse-ahead was known prior art.** "Yes, **I was aware that pie menus could do mouse-ahead
in 1990.**" His residual hedge — unsure whether Don had *coded* display suppression or relied
on OS event queuing — is answered by the July 1987 `piemenu.ps`
["Things to do" comment](1987-07-01-news-pie-menus-source-release.md) and Don's 30 Nov 1990
email offering to discuss "mouse ahead, menu display supression" tracking strategies.

**The claimed distinction shrinks to the ink trail.** "One thing that I thought was different…
was the use of the mark, so in the 1993 paper that's why I use the words 'corresponding
mark,' not mouse ahead or gesture." I.e., the 1993 "unique" sentence survives only if read as
claiming novelty for the ink trail alone — which is not what it says, and not how the field
read it (Samp 2010, Tomitsch 2003 propagated the broad reading).

**"Typical pie menus" were Alias's own naive reimplementations.** "What I found that alias
developers, if they didn't read any of your work or my work, did just code up pie display
menus with selection by location not direction — this is what I found was 'typical'." So the
straw man in the [2008 demo video](kurtenbach-marking-menu-demo-video-straw-man.md) is
admitted to describe in-house naive implementations, not Don's published, shipping designs —
while the video labels them "typical" without that qualification.

**Patent scope: overflow combo only.** "We did not and could not patent 'selection by
direction'… SGI patented the combination of a radial menu and overflow portion. The patent did
not limit you from using your pie menus." Which concedes Don's original point to Kinetix: the
FUD ("patented marking menus", full stop) claimed far more than the patent covered — and
"as an employee at SGI, I wasn't allowed to advise outsiders like you about patent coverage."
Corporate policy required the silence that let the FUD stand.

**Derivative, and proud of it.** "I always felt like I was building on the original pie menus
work, adding marks and overflows etc. That's why I wrote you in 1990, excited that I was using
your work." And his lineage, which Don endorsed as accurate: Newman/PIXIE → Hopkins pie menus
→ Kurtenbach marks vocabulary → Flow menus, Flower menus, SHARK.

**The Shneiderman UIST question.** Kurtenbach recalls Ben Shneiderman publicly asking him at a
UIST Q&A, in front of his peers, "why don't you acknowledge the work of Don Hopkins?" — which
he experienced as bullying, and which fed the Buxton camp's resentment ("ironic that while Ben
was accusing me… you guys didn't even reference the original PIXIE work"). Don first learned
of the UIST incident from this 2018 thread.

**How Kurtenbach learned of PIXIE:** from **William Newman in person at Xerox PARC, early
1990s** ("Yes, we did something like this in the old PIXIE system"). Same Newman & Sproull
route as everyone else — and later than Don's December 1986 discovery.

**The FUD was left standing on purpose — Max was the rival.** After Don's 66-point GDC
timeline (16 May 2018), Kurtenbach conceded the mechanism in one paragraph:

> At the time Bill or I could have said to you "off the record, its ok, just don't use the
> radial/linear combo". I think this was what Bill was trying to say when he said "there's no
> patent on marking menus". That was factually true. **However, given that Max was the main
> rival, we didn't want to do them any favors.** So those were the circumstances that lead to
> those events.

This is the closest thing to a confession in the whole record: the clarifying sentence that
would have dissolved the FUD existed, both men knew it, and it was withheld as a competitive
tactic against 3D Studio Max. "Marketing is marketing, and love to say in-precise things like
'patented marking menus'" — his words, same email. The corporate-policy explanation ("I wasn't
allowed to advise outsiders") and the competitive one ("didn't want to do them any favors")
sit side by side; the second explains why nobody sought an exception to the first.

## The Plaisant "mousy" explanation (14 May 2018)

Catherine Plaisant, who had pressed the marking-menu crew on this years earlier, supplies
their stated mechanism for the novelty claim: they knew the UMD video but **misinterpreted the
"mousy" separate-window demonstration** as evidence the pie menu was *always visible* even
during fast gestures. "Obviously wrong but that was their explanation." She also identifies a
published receipt: the Hyperties retrospective (HCIL-90-02, *Hypermedia* 1991, Shneiderman,
Plaisant, Botafogo, **Hopkins**, Weiland) states verbatim: "Experienced users can make
gestural selections from these menus so comfortably and rapidly that it is often unnecessary
to display the menu. This is called **'mouse ahead display suppression'**."

## Where it landed

Kurtenbach: "I'm sorry that this has all lead to hard feelings." Don, in reply: no grudge
against Gordon, appreciation for the AEEOSAACAOMM paper, an offer to keep collaborating on
radial menus — and a firm refusal to drop the Buxton material, because Buxton's conduct (the
GDC phone lie "there is no marking menu patent", the 2008 bullying, the broken promise on the
Wiseman paper) was a separate matter Gordon explicitly could not speak for. A mutual friend,
ex-Wavefront under Buxton, is quoted: "He is kinda a shiester… Bill completely stomped on
Wavefront research group."

Don also restated the reselection argument (from the 2010 Samp correction): pie menus base
selection purely on the direction between endpoints, so **every** possible gesture is a valid,
user-comprehensible selection and in-flight correction always works; shape-recognizing
hierarchic marking menus make most possible gestures unrecognized syntax errors.

→ [`kurtenbach-sellen-buxton-1993-claims-analysis.md`](kurtenbach-sellen-buxton-1993-claims-analysis.md) ·
[`pie-menu-fud-misconceptions.md`](pie-menu-fud-misconceptions.md) ·
[`2008-2023-pixie-buxton-patent-thread.md`](2008-2023-pixie-buxton-patent-thread.md)
