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
[Palm on Worms](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/palm-on-worms-fieldnotes.yml)
(see the `birds` section).

## Sources (public)

- [`invitation.md`](invitation.md)
- Show seed: [`repo-shows/ken-kahn/`](../../repo-shows/ken-kahn/)
- [`media/from-mail/MANIFEST.yml`](media/from-mail/MANIFEST.yml) — mail-sourced artifacts
- [`CHARACTER.yml`](CHARACTER.yml)
