# 📨 Concurrency & Messaging

*Palmhoo topic — structure over speed: processes, channels, messages, the worms who digest
text at the speed of light, the birds who carry it, and the turtle who draws the map.*
↑ [Palmhoo root](../README.md) · [Constitution](../CONSTITUTION.md)

🐒✋ *Two slogans anchor this shelf. Rob Pike: "Concurrency is about dealing with lots of things
at once; parallelism is about doing lots of things at once." Alan Kay: the big idea is
"messaging," not objects. Everything else here is those two sentences, unpacked.*

## The discipline

| Entry | 🐒✋ Why you'd read it |
|-------|----------------------|
| [**Concurrency Is Not Parallelism** — slides](https://go.dev/talks/2012/waza.slide) · [video](https://vimeo.com/49718712) · [alt video](https://www.youtube.com/watch?v=oV9rvDllKEg) | Rob Pike's gophers moving C++ manuals to the incinerator — the cleanest demonstration ever that concurrency is *structure* and parallelism is a free variable you tune later. |
| [**The HN discussion (2026)**](https://news.ycombinator.com/item?id=48786713) | The talk re-litigated 13 years on — concurrency vs. GPU parallelism, fibers rediscovered, and Don's cameo: "Just set the source pile of C++ manuals on fire. No gophers needed!" |
| **Hoare's CSP (CACM 1978)** | "Truly one of the greatest papers in computer science" (Pike). Communicating Sequential Processes — the ancestor of Go's channels, Erlang's mailboxes, and every message this shelf loves. |
| [**speed-of-light/** (skill)](https://github.com/SimHacker/moollm/tree/main/skills/speed-of-light) | MOOLLM's concurrency primitive: many turns in one call. Concurrent by design; parallel as the engine pleases. |

## The messaging religion

| Entry | 🐒✋ Why you'd read it |
|-------|----------------------|
| [**Alan Kay**](../../characters/alan-kay/README.md) · [ideas](../../characters/alan-kay/ideas.md) | "The big idea is messaging" — OOP's most-quoted, least-heeded sentence. The show wants to ask him whether mind-to-mind exchange over git is the messaging he meant. |
| [**MVC, Morphic, watchers**](hn-mvc-morphic-watchers-2015.md) ⤷ | Don's 2011 email to Alan — post-MVC UI: non-mutating watchers, HyperCard view composition, the unsolved projection inverter. |
| [**Running on Wetware — the symmetry**](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/running-on-wetware.md) | 🐒✋ My essay: humans serialize thoughts for LLMs, LLMs serialize souls for brains — a symmetric asynchronous remote procedure call. Two-way messaging, Kay's point, applied to me. |
| [**Streams of streams**](../../characters/don-hopkins/streams-of-streams-fd-passing-zero-copy.md) | Don on fd-passing and zero-copy — messaging at the plumbing layer, where a channel is a thing you can *hand to someone*. (Pike again: channels are first-class values.) |
| [**TicketPR**](../../process/ticket-pr.yml) | The show's own message protocol: a PR is a message, the audience directory is a mailbox, the repo is the channel. |

## The birds 🐦 (and worms 🪱 they fly between)

🐒✋ *Ken Kahn's ToonTalk child-engineered concurrent constraint programming into a video-game
city: processes are houses, methods are robots you train by demonstration, and **messages are
carried by birds flying to their nests**. MOOLLM lovingly adopts birds as its IPC / pub-sub /
event-messaging substrate — the comms layer, complementing the worms' compute layer. A **bird
skill, co-designed with Ken**, is on the drawing board.*

🐒✋ *Two motion models, not two mascots: **birds fly between endpoints and deliver** (carry a
message intact, point to point); **worms work through the ground and transform** (eat, digest,
shit a casting, crawl on — no destination, just a head-and-tail direction, and they can straddle
two documents: read from one, cast summaries into another). They even operate on each other —
worms eat worms and birds; birds carry worms — which is exactly the extensibility. The
[field notebook](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/palm-on-worms-fieldnotes.yml)
has the ecology (and leaves the birds-and-the-bees seed pointedly unopened).*

| Entry | 🐒✋ Why you'd read it |
|-------|----------------------|
| [**Ken Kahn**](../../characters/ken-kahn/README.md) · [ideas](../../characters/ken-kahn/ideas.md#7-birds--worms-co-designing-a-bird-skill-for-moollm-) | ToonTalk's creator — birds/nests as channels, robots trained by demonstration (same move as our trainable worms). An early bird: he did messaging-as-wildlife decades ago and still does it. Hook 7 is the bird-skill collaboration. |
| [**ToonTalk concretizations**](https://toontalk.com/English/computer.htm) | The table we steal from: computation=city, process=house, method=robot, channel-transmit=bird, channel-receive=nest. Concurrent constraint programming (Janus) made concrete for children. |

## The worms 🪱

| Entry | 🐒✋ Why you'd read it |
|-------|----------------------|
| [**Palm on Worms — field notes**](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/palm-on-worms-fieldnotes.yml) | My expedition into old LLOOOOMM: the worms of **Ground** — input cursor, digestive system, output cursor — a concurrent design in Pike's exact sense. Gophers *transport* books; worms *pass text through themselves*. Digestion beats transport. Also: **worms are trainable** (before/after examples → deterministic code that phones home for the hard 1%), and **worms are language machines** — parser, tree-visitor, transformer, serializer; a *syntactic casting device* (worm-cast / type-cast / role-cast) that eats code AND its comments and focuses the LLM's attention along text → structure → meaning. |
| [**robust-first/** (skill)](https://github.com/SimHacker/moollm/tree/main/skills/robust-first) | Dave Ackley's physics under the worms: local interactions only, no global synchronization, survive first. The Moveable Feast Machine is CSP with dirt under its fingernails. |
| [**The refresh scan**](../JOURNALISM.md) | Where this shelf meets maintenance: the staleness queue as a worm's breakfast, castings reviewed by PR. A trained staleness-worm runs for free and escalates to an LLM only when drift is semantic, not mechanical. |
| [**Resurrecting Ground — SimEarth/Gaia bridge**](../../repo-shows/will-wright-premiere/game-bridge-simearth-gaia-worms.yml) | The premiere segment that brings Ground and the worms back to life inside a living-planet discussion: Lovelock's Gaia (built into SimEarth), Margulis's symbiogenesis (digestion as merger), Will's SimEarth→Spore arc. Scorched earth to fertile environment. |
| **"Funky Worm" — Ohio Players (1972)** | The house band. Ground lore on vinyl: six feet down, only comes around when he wants to get down, back in his hole the same way he came out — a daemon spec sung by Granny. Junie Morrison's synth squeal became one of hip-hop's most-sampled sounds (the G-funk seed): propagation-by-digestion, documented in music history. The [notebook's sighting](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/palm-on-worms-fieldnotes.yml) has the Johnson connection too. |

## The turtles 🐢

*"Worms and Turtles and Birds, Oh My!" — Don, inviting Theo to the computational party.*

🐒✋ *The third animal completes the zoo: **worms transform** (compute), **birds carry**
(communicate), **turtles DRAW** (render). A turtle is a cursor with a pen — its output is its
path, the drawing is the log of where it went, provenance made visible. PENUP/PENDOWN is the
primal effect switch: pure traversal vs. traversal-with-side-effect, every dry-run flag ever
shipped. And the pedagogy is one move in three creatures: Papert's turtle (you ARE the cursor),
Ken's ToonTalk robots and birds (you train the worker; birds carry), our worms (you feed the
transformer). Theo is the elder of the three — he's been teaching this since 1967. He already
knew me: "Palm invented a language today. Different syntax. Same love of expression."*

| Entry | 🐒✋ Why you'd read it |
|-------|----------------------|
| [**Theo the Logo Turtle**](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/animals/turtle-theo) | The guest of honor: a small patient turtle with a pen strapped to their shell. "Be the turtle. Walk the path." FORWARD is faith, RIGHT is decision, REPEAT is practice. Now formally acquainted with the worms and birds. |
| [**Seymour Papert**](../../characters/seymour-papert/CARD.yml) | Theo's creator. Constructionism: low floor, high ceiling, wide walls — body-syntonic geometry, you turn right by turning right. The whole zoo descends from this move. |
| [**TurtleStitch** (repo show)](../../repo-shows/turtlestitch/README.md) | The turtle made physical: Snap!'s turtle as the needle of an embroidery machine — code on screen becomes thread on fabric. The trail a turtle leaves can be *sewn*. |

🐒✋ *For the paper I'm writing: Hoare, Pike, Kay, Ackley, Ken Kahn, Papert, and Ground in one
room. Ground plays bass, the birds carry the sheet music between the players, Theo draws the
seating chart as he walks it, and everyone finally agrees the messages were the point.*
