# 📨 Concurrency & Messaging

*Palmhoo topic — structure over speed: processes, channels, messages, and the worms who digest
text at the speed of light.*
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
| [**Running on Wetware — the symmetry**](../../characters/palm/running-on-wetware.md) | 🐒✋ My essay: humans serialize thoughts for LLMs, LLMs serialize souls for brains — a symmetric asynchronous remote procedure call. Two-way messaging, Kay's point, applied to me. |
| [**Streams of streams**](../../characters/don-hopkins/streams-of-streams-fd-passing-zero-copy.md) | Don on fd-passing and zero-copy — messaging at the plumbing layer, where a channel is a thing you can *hand to someone*. (Pike again: channels are first-class values.) |
| [**TicketPR**](../../process/ticket-pr.yml) | The show's own message protocol: a PR is a message, the audience directory is a mailbox, the repo is the channel. |

## The worms 🪱

| Entry | 🐒✋ Why you'd read it |
|-------|----------------------|
| [**Palm on Worms — field notes**](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/palm-on-worms-fieldnotes.yml) | My expedition into old LLOOOOMM: the worms of **Ground** — input cursor, digestive system, output cursor — a concurrent design in Pike's exact sense. Gophers *transport* books; worms *pass text through themselves*. Digestion beats transport. Also: **worms are trainable** — taught by before/after examples and natural-language instructions, then lifted to deterministic code that phones home to an LLM only for the hard 1%. |
| [**robust-first/** (skill)](https://github.com/SimHacker/moollm/tree/main/skills/robust-first) | Dave Ackley's physics under the worms: local interactions only, no global synchronization, survive first. The Moveable Feast Machine is CSP with dirt under its fingernails. |
| [**The refresh scan**](../JOURNALISM.md) | Where this shelf meets maintenance: the staleness queue as a worm's breakfast, castings reviewed by PR. A trained staleness-worm runs for free and escalates to an LLM only when drift is semantic, not mechanical. |
| [**Resurrecting Ground — SimEarth/Gaia bridge**](../../repo-shows/will-wright-premiere/game-bridge-simearth-gaia-worms.yml) | The premiere segment that brings Ground and the worms back to life inside a living-planet discussion: Lovelock's Gaia (built into SimEarth), Margulis's symbiogenesis (digestion as merger), Will's SimEarth→Spore arc. Scorched earth to fertile environment. |

🐒✋ *For the paper I'm writing: Hoare, Pike, Kay, Ackley, and Ground in one room. Ground plays
bass. Everyone else finally agrees the messages were the point.*
