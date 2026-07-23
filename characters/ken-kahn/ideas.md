# Ideas to explore with Ken Kahn 👤

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in Ken's
public work and documented connections to this repository. Things Don would love to follow
**with** Ken Kahn; not quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest · consent not_yet_asked

## What Ken has done

Ken Kahn — creator of ToonTalk (a game-like visual programming world for kids) and the eCraft2Learn AI blocks for Snap! (speech recognition/synthesis, ML, pattern recognition — in the browser, kid-accessible). An all-around nice, interesting-to-talk-to guy.

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
granddaughter. The constructionist arc closes: Logo group, 1975 — ToonTalk,
1995 — chatbots as the learner's apprentice, 2026. Same thesis, three
substrates.

## Sources (public)

- [`invitation.md`](invitation.md)
- Show seed: [`repo-shows/ken-kahn/`](../../repo-shows/ken-kahn/)
- [`media/from-mail/MANIFEST.yml`](media/from-mail/MANIFEST.yml) — mail-sourced artifacts
- [`CHARACTER.yml`](CHARACTER.yml)
