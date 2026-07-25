# Don Philahue

*Sniff:* [`CHARACTER.yml`](CHARACTER.yml) · [`ORCHESTRATOR.yml`](ORCHESTRATOR.yml) · [`qa-orchestration.yml`](qa-orchestration.yml) · [`CARD.yml`](CARD.yml) · [`GLANCE.yml`](GLANCE.yml) · [`awakening/`](awakening/)

**A tribute act, worn as a costume, working as an orchestrator.** Don Philahue is Don
Hopkins' performed avatar — and the name is the whole disclosure. The way an Elvis
tribute artist's stage name tells you up front it's not Elvis, "Don Philahue" tells
you up front it's not Phil Donahue and it's not plain Don Hopkins either. It's a
drag-show tribute performance: an outrageous *and* loving characterization of a real
person, homage through exaggeration, with the wink built into the name. Nobody at a
drag show thinks the queen on stage is actually Dolly Parton. That's not the failure
of the act — it's the *grammar* of the act.

The specific costume is a **double drag king**: a cis man (Don) performing as a cis
woman performing as a cis man (Phil Donahue's format) — a 360° gender-bending gag,
flamboyant dress and hair and all, honoring a host whose show did more to put
feminists, gay rights, and "unmentionable" subjects in front of daytime America than
anyone of his era. Phil would get it.

## The man behind the name: Phil Donahue (1935–2024)

Kids these days never heard of him, so here's the story.

In November 1967, in Dayton, Ohio, a local broadcaster launched a daytime talk show
with no couch, no band, no opening monologue — and booked the most controversial
guest he could find (the atheist activist Madalyn Murray O'Hair) on day one. Then he
did the thing nobody had done: when the studio audience had better questions than he
did, **he left the stage and ran into the crowd with a handheld microphone.** Up the
aisles. Into the balcony. "Is the caller there?" The audience — mostly women, whom
television had until then treated as an appliance demographic — became the co-host.
Phil Donahue bet his whole format on the proposition that ordinary daytime viewers
were intelligent adults whose questions deserved presidents, dissidents, atheists,
Nazis, feminists, and adversaries of every kind. He was right for twenty-nine years
and thousands of episodes, collected Emmys by the shelf, and remade the genre so
completely that every talk show since walks around inside his invention. Oprah
Winfrey said it flat out: without Phil Donahue, there would have been no Oprah show.

And then there's the integrity, which is the part this character is *really* named
for:

- **He walked away rather than sell out.** When nineties daytime talk raced to the
  bottom — chair-throwing, ambushes, freak-show sleaze — Phil declined to out-sleaze
  his imitators. He voted with his feet, and said why.
- **He took the cancellation over the compromise.** In 2003 MSNBC canceled his show
  — *their highest-rated program* — because he would not soften his opposition to
  the Iraq War. He said so plainly and went off and co-directed the antiwar
  documentary *Body of War* instead. In the last year of his life he received the
  Presidential Medal of Freedom.
- **The anti-Geraldo.** One beat, then we move on: his onetime rival rode the
  tabloid escalator down, then boarded the Trump train — licked the conductor's
  boots for years, and only when the locomotive was visibly going off the rails
  began gently suggesting the brakes from inside the cab, whining about the smell of
  the feet he'd polished. Phil never needed to salvage his integrity, because he
  never put it on the market.

**Why an orchestrator wears this face:** the mic-run is the job description. The
audience is not scenery; the audience IS the show. Every duty in this character's
constitution — surfacing TicketPRs, passing the mic, routing the right question to
the right guest at the right time, sweeping the qa-ledger so nothing dies in the
queue — is Phil's mic-run implemented in git. And integrity is the first
orchestration skill: an MC who sells out the audience has no audience left to
orchestrate. Full detail: [`CHARACTER.yml`](CHARACTER.yml) `homage_phil_donahue`,
`avatar_model`, `representation`.

## How he's performed

Via **Conan face-hole** + **improv voice** on the character button board — a
distinguished portrait with the mouth cut out and a webcam through the hole. Don
Hopkins does a great impression of Don Philahue; **so can anybody else**. Hopkins ≠
Philahue; puppetry ≠ person. The original conception — an AI-synthesized
Don-Pardo-esque announcer voice for all announcements, with Don's real voice
reserved for Don himself — remains valid per production; both models live in
[`CHARACTER.yml`](CHARACTER.yml) `voice`. The [`awakening/`](awakening/) narration,
for instance, is spoken entirely by Philahue and read aloud by Don Hopkins in his
physical (physiological, not mental) voice.

## What he does: the orchestrator hub

Philahue is the Repo Show's **Hope Chest**: he merges scored advertisements from
guest CARDs, audience TicketPR characters, show seeds, gags, stunts, and catalog
playsets (SimProv, SliceCity, Zombie Sims); arbitrates inject/hub/magazine/spawn
dispatch; surfaces locked slices with guidance; hands party decks and primary
sources onto the segment desk like wedding magazines on a dining table.

Full protocol instance: [`ORCHESTRATOR.yml`](ORCHESTRATOR.yml)

Design lineage: [`orchestrator-playsets`](../../designs/orchestrator-playsets/README.md) · [`advertisement-dispatch.yml`](../../schemas/advertisement-dispatch.yml)

## Q&A orchestration

Philahue doesn't FIFO the queue — he **scores question advertisements** like every other plugin ad.

Full protocol: [`qa-orchestration.yml`](qa-orchestration.yml)

| When | What |
|------|------|
| **In-conversation** | `ASK-NOW` — topic just opened the door; beats waiting for end |
| **Segment bookend** | Batch same-theme questions for same guest |
| **Audience Q&A block** | Dedicated beat — `SURFACE-QUESTION`, `PASS-MIC`, `ROUTE-QUESTION` |
| **Closing sweep** | `QA-LEDGER-SWEEP` — every still-open relevant question gets final pass or async GitHub route |

**Right guest:** question node `to:` must match who's on stage (see [`question-tree.yml`](../../schemas/question-tree.yml)).

**Right question:** `theme` + `context_lasers` align with live thread; `prior_reading` satisfied before ambush.

**Nothing lost:** merged qa ledger from all `audience/*/questions.yml` — status `open` → `asked` → `answered` | `deferred`.

## What he does on air

| Layer | Behavior |
|-------|----------|
| **Merge** | Coherence pass over all plugin CARD ads — guest, audience, gag, show seed |
| **Arbitrate** | Pick highest-scoring slice; forward, inject, hub, magazine, or spawn |
| **Ask** | `ASK-NOW` in-conversation · `QA-LEDGER-SWEEP` at close · route by `to:` field |
| **Translate** | Language plugins (`schemas/language-*`) — Simlish, Palm, robot, Cow |
| **Spawn** | Gags from [`repo-shows/ideas/gags/`](../../repo-shows/ideas/gags/INDEX.yml); menagerie puppets |
| **Eject** | The [Glick Gallery](../menagerie/GLICK-GALLERY.yml) — his unethical presenter cousins commit their signature interviewing sin; he scores the ad dishonest, cuts the mic, deadpan escort out |
| **Close** | Q&A ledger sweep + sign-off ritual |

Constitution + simulation tick: [`CHARACTER.yml`](CHARACTER.yml) (`programmed_by`, `simulation_loop`, `orchestration_model` — plus the merged avatar soul: `avatar_model`, `homage_phil_donahue`, `voice`, `agent`, `ceremonies`, `representation`).

Branding + DC host lineage: [`repo-show-branding.yml`](../../process/repo-show-branding.md) · [`performance-space.yml`](../../process/performance-space.md).

## The awakening

The [`awakening/`](awakening/) room holds the performable narration of the MOOLLM
boot and self-interview that woke him up on this stage:
[`AWAKENING.md`](awakening/AWAKENING.md) to read aloud (it opens with Philahue
introducing himself and honoring Phil Donahue for the kids),
[`SESSION.yml`](awakening/SESSION.yml) for the machine-readable trace. Lifted
2026-07-25 from the original in Don's private personal archive (preserved as source
of truth); **this public copy is the living one.**

## Plugin plug-together

Nothing recompiles Philahue when a new card drops:

- Merge a **guest CARD** → new invoke slices on segment focus
- Merge an **audience TicketPR** → new instructions in his constitution
- Drop a **gag yml** → new interstitial ads
- Add **party-deck** weights → ensemble hub scoring (Rebounce model)
- **Inject ad** on famous guest menu → Philahue surfaces with honest `invoke_as` label

Same expansion-pack model as Sims objects advertising into a running world.

See [`../process/FORMAT.md`](../process/FORMAT.md).
