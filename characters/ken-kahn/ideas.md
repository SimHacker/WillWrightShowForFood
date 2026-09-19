# Ideas to explore with Ken Kahn 👤

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in Ken's
public work and documented connections to this repository. Things Don would love to follow
**with** Ken Kahn; not quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest · consent not_yet_asked

## What Ken has done

Ken Kahn — taught AI to elementary school children in the MIT AI Lab's Logo Group between
1973 and 1979, and is still teaching AI to children in 2026. In between: Pictorial Janus, a
concurrent constraint language made visual (1990–91); ToonTalk, a game-like visual
programming world for kids (1995–); and the eCraft2Learn AI blocks for Snap! (speech
recognition/synthesis, ML, pattern recognition, LLMs — in the browser, kid-accessible). An
all-around nice, interesting-to-talk-to guy. [Spine and sourcing](sources/hn-2026-09-career-summary.md).

## Shared ground

*Topics that connect Ken Kahn's work to this repo — public themes only.*

- Snap! AI blocks: machine learning in visual programming
- ToonTalk: game-like visual programming (birds/nests as message channels — the direct inspiration for MOOLLM's bird IPC substrate; see hook 7)
- Amsterdam meeting: Westerpark area
- Don lent Ken an ebike for solo rides around Amsterdam (2026) — mobility parallel to MOOLLM [Lane Neverending](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/street/lane-neverending) bike rack
- Constructionist education: shared interest
- Machine learning for kids: accessible AI education
## The hooks

### 1. Show seed: `repo-shows/ken-kahn/`
walk the repo on air and build from the seed.

### 2. Snap! AI blocks: machine learning in visual programming

### 3. ToonTalk: game-like visual programming

### 4. Amsterdam meeting: Westerpark area

### 5. Constructionist education: shared interest

### 6. Machine learning for kids: accessible AI education

### 7. Birds & worms: co-designing a Bird skill for MOOLLM 🐦🪱

*The one Don is most excited to build together.*

ToonTalk concretizes concurrent constraint programming as a video-game city: a computation is a
city, a process is a **house**, a method is a **robot** trained by demonstration, and messages
are carried by **birds** flying to their **nests** (birds = channel transmit, nests = channel
receive — verified against the toontalk.com papers and Ken's Janus work with Saraswat & Levy).

MOOLLM has been growing **worms** — programmable text organisms that transform text in place
(digestion, map/reduce, self-rewriting DNA). Worms are the *compute*. What they need is the
*comms* — and Ken solved that decades ago with birds. So the proposal:

- **Adopt birds as MOOLLM's interprocess-communication / pub-sub / event-messaging substrate**,
  in loving debt to ToonTalk. A worm hands a casting to a bird; a worm waiting for input watches
  a nest; many birds to one nest is pub-sub; a bird's arrival is an event that wakes a worm.
- **Co-design a Bird skill *with* Ken**, to complement and feed off the Worm skill. Birds carry,
  worms compute — the pair is a complete concurrent-computing zoo (ToonTalk had both: robots AND
  birds). Credited, on air if Ken's willing, with Ken correcting the CS since he's the source.
- The through-line to the rest of the show: this is Alan Kay's "the big idea is messaging" and
  Hoare's CSP channels, rendered as wildlife — and it's the same *child-engineering the best
  ideas in computer science* that ToonTalk and Papert's turtle always did.

Ken's an **early bird** — he built message-passing-as-birds in the mid-1990s and is still at it
(AI blocks for Snap!). Field notes where this is sketched:
[Palm on Worms](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/palm-on-worms-fieldnotes.md)
(see the `birds` section).

The zoo has since gained its third animal: **Theo the Logo Turtle** (Papert's mascot, already a
MOOLLM resident) joined the party — worms transform, birds carry, turtles *draw*. The teaching
trinity is one move in three creatures: Papert's turtle (you ARE the cursor), Ken's robots and
birds (you train the worker; birds carry), MOOLLM's worms (you feed the transformer). See the
notebook's `turtles` section.

### 8. The essay the machines argued over — AI historiography as a contact sport

Ken's [two-claims essay](https://toontalk.github.io/misc/ai-history-two-claims.html)
(July 2026) took on the two myths he's disliked for fifty years — *Perceptrons*
killed neural nets; GOFAI was brittle rules until AlexNet — by having Claude
write it and ChatGPT review it, ping-ponging critique "until they were happy."
Full saga in [sources/2026-chatbot-experiments.md](sources/2026-chatbot-experiments.md).
Segment beats:

- **The witness and the training data.** Ken lived the history (MIT AI Lab,
  1973 on; Minsky and Papert reported on his committee) and says the result is
  "better than anything I could have created." What does an eyewitness add
  when the archive is in the weights? Answer from the transcript: he chose the
  targets, supplied the sources, and refereed the disagreements — editor-in-
  chief as the human role.
- **The models disagreeing is the good part.** Claude demanded a source for
  ChatGPT's confident claim about which spiral was on which side of the 1969
  cover; ChatGPT produced a page-379 receipt for the Rosenblatt funding
  tribute. Adversarial collaboration with citations — the exact production
  method of this repo, performed by the guest before we could invite him.
- **The spiral saga.** Neither model could draw the *Perceptrons* cover
  figure correctly — their "hard" spirals were easy for humans — until
  ChatGPT identified that the ambiguity must hide in the central
  entanglement, not the outer windings. The book's unsolvable-for-perceptrons
  figure, briefly unsolvable for LLMs at the drawing level while they wrote
  expert prose about its unsolvability. Show the failed spirals on screen.
- **Minsky, fixed by attribution.** The essay caught Minsky's own 1995
  bounded-fan-in claim overreaching and pinned it on him with a caveat rather
  than silently deleting it — the same portrayal ethic as this repo's rooms.
  Cross-link: the marvin-minsky room; Ken as memorial discussant who
  corrects the record *in both directions*.

### 9. NPUC — one photograph, eight chairs, thirty years

[The panel photo](sources/npuc-almaden-panel.md): Ken and Don two chairs
apart at Ted Selker's Almaden workshop; McCarthy, Bobrow, and Lakin in the
frame, all since gone; the comment thread's own dating dispute (1993 or
1996?) preserved as a tiny historiography lesson to match hook 8. Ted says
he has transcriptions, video, and audio of seven years of NPUC — an
archive-fishing expedition the show should mount. Ken's 1993 talk title,
"Sketches and Animations as Programs," is his whole career in five words.

### 10. The Learner's Apprentice, live

The book's thesis — anyone can co-create apps, adventures, and stories with
chatbots — demonstrated with his own artifacts: the word-age font extension,
the English-rules Lemmings game (Claude implementing, GPT Codex testing),
the unicorn adventure app built with Gemini for his 5-year-old
granddaughter. The constructionist arc closes: Logo group, 1973 — ToonTalk,
1995 — chatbots as the learner's apprentice, 2026. Same thesis, three
substrates.

### 11. The 1973 class — what happened when you taught AI to eight-year-olds

*The hook Don most wants on tape, because nobody has asked it.*

Between 1973 and 1979, as a graduate researcher in the Logo Group, Ken taught artificial
intelligence to elementary school children. Fifty-three years later the field debates whether
this is possible, and he has the longest-running data set in existence and was never asked
for it.

Questions with answers only he has:

- **What did you actually teach them?** In 1973 "AI" meant search, pattern matching,
  production rules, micro-worlds, maybe procedural semantics — not gradient descent. Which
  parts did children take to immediately, and which ones did adults assume were easy and
  turn out not to be?
- **What did the kids find obvious that the researchers found hard?** The reverse of the
  usual question, and the one that would tell us the most.
- **What did Papert and Minsky say about it at the time?** Was teaching AI to children
  understood as an experiment on the AI or on the children? Both are defensible and the
  answer is history.
- **Did any of them stay in the field?** Fifty-three years is long enough to find out, which
  makes this a longitudinal study nobody designed and no IRB approved.
- **What is genuinely different now?** Jens' answer at Snap!Con 2025 is that backpropagation
  can be brought down to a duplicable sprite and "might be the last algorithm we get to
  teach." Ken is the one person who can compare that to what the 1973 curriculum could reach
  — and say whether the ceiling moved or only the packaging.

Cross-link: [moollm closing-keynote-jens-neural-networks.md](https://github.com/SimHacker/moollm/blob/main/designs/snap/snapcon-2025/closing-keynote-jens-neural-networks.md)
and Alan Kay's trade-schools argument, where Ken is the person who has been paying the
unpaid half of the job the entire time.

### 12. Characters talking to each other, in blocks, in 2023

At Snap!Con Barcelona he led the LLM-integration session and showed extensions that wire
language models into Snap!'s speech recognition and synthesis and **orchestrate conversations
between different characters** —
[*Creative uses of Snap! blocks using large language models like GPT*](https://www.youtube.com/watch?v=d2rNGsbzkXI).

Which is the MOOLLM architecture with a palette on the front, built for children, before the
multi-agent-orchestration industry existed. Segment beat: put his blocks next to a modern
agent framework's YAML and ask the audience which one a twelve-year-old can debug.

The pairing with hook 7 is the real segment. Birds carry messages between houses; LLM
characters carry conversations between sprites. Same substrate, thirty years apart, same
author.

### 13. Where does the line fall between what you build and what the child grows?

His own statement of the divergence, from the Quora thread with Alan, September 2026:

> "But where my thinking has diverged from Alan's in the last decade is that growing that
> architecture of societies of interacting elements is more promising than building it 'by hand'."

**The question is not which side he is on, because his practice answers that already.** Pictorial
Janus was hand-built. ToonTalk's robots and birds were hand-built. The eCraft2Learn blocks and
courseware were hand-built. Fifty-three years of hand-building *interfaces to agency* so that
children could grow the behavior through them. So the hand-built part is the interface and the grown
part is what happens in the kid, and he has never once been confused about which is which.

Which makes him the only person who can answer the version that is actually hard: **where exactly
does the line fall, and how do you know you have put it in the right place?** He has the largest
sample anybody has — every layer he chose to author versus leave open, across five systems and five
decades, each with children's results attached.

Follow-ups worth having ready:

- **A case where you put the line in the wrong place and found out.** The interesting failure is a
  primitive you hand-built that the children needed to be *below*, or one you left open that nobody
  ever reached into.
- **Does an LLM move the line, or only make it cheaper to be wrong about?** If the machine can grow
  the middle layers now, the authored part shrinks — and the pedagogy lived in the authored part.
- **Would you let an agent use ToonTalk?** The fairness question, in his own system: if a model can
  drive the robots, should it do so through the same blocks and birds a child uses, or through an
  API the child has no access to. He designed the only surface where the question has a concrete
  answer.

The frame Don would bring, offered as a position to attack rather than a conclusion: *interfaces to
agency, not agents instead of interfaces* — humans and models exercising the same capabilities
through the same named commands, with surfaces differing by audience rather than by power. Written
up as [interfaces-to-agency](https://github.com/SimHacker/moollm/blob/main/skills/design-sense/lenses/interfaces-to-agency.md),
with the grow-versus-build reading in
[AXES-NOT-CAMPS](https://github.com/SimHacker/moollm/blob/main/designs/AXES-NOT-CAMPS.md).

Pairs with hook 12, since the LLM-character blocks are already the case where he had to decide how
much of the conversation to author, and with the crystallize/deoptimize loop in
[korz-prime](https://github.com/SimHacker/moollm/tree/main/designs/korz/korz-prime) — build what has
stabilized, grow what has not, and make the traffic between the two tiers the architecture.

## Sources (public)

- [`invitation.md`](invitation.md)
- Show seed: [`repo-shows/ken-kahn/`](../../repo-shows/ken-kahn/)
- [`media/from-mail/MANIFEST.yml`](media/from-mail/MANIFEST.yml) — mail-sourced artifacts
- [`CHARACTER.yml`](CHARACTER.yml)
