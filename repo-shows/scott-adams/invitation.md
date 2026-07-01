---

## status: warm
character_id: scott-adams
public: true
consent: correspondence_verified
show_seed: repo-shows/scott-adams/
format: remote_or_in_person

# Repo Show invitation — Scott Adams

*Public invitation — written after our January correspondence. Scott Adams may edit, decline,
delay, or request removal at any time.*
[Portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.yml)

*(Scott Adams the **adventure-game pioneer** — Adventureland, Adventure International — not the anti-vax cartoonist.)*

Scott —

I'm still smiling about your note back in January — that MOOLLM **sucked you in**, that you see
**tremendous potential** in it. That meant a lot. We'd already found each other before on that Hacker News thread about memory palaces (`[29330901](https://news.ycombinator.com/item?id=29330901)`); your reply there was warm and
generous, and the email thread that followed felt like picking up a conversation that should
never have paused.

Since then I've been thinking about what you told me you're building: a **biography** fed by
NotebookLM and Gemini over a lifetime of material — emails, interviews, articles, the threads
that don't show up in a casual web search until someone hands them to you. And you're structuring
it not as one flat scroll, but as **mini-adventures on webpages** — the reader has to *play* a little to unlock the next room of the story, picking up your ideas they find along the way and adding them to their inventory.

That's the same world I care about. Different toolchain, same architecture.

In 1978 you didn't ship a monolithic program for every machine — you shipped **adventure-as-data**
and a tiny interpreter that could run it anywhere. A whole world in sixteen kilobytes. Verb. Noun.
Legible. Portable. I followed that idea into Terrapin **Logo Adventure** (the Logo REPL as the
parser) and, forty years later, into an **adventure compiler** and **MOOLLM** — a microworld OS
where directories are rooms, YAML files are objects with behavior, and an LLM walks the palace
with you instead of grepping blindly.

You said you're **also thinking about MOOLLM** now. I'd love to make that thinking *visible* — not
as a pitch, but as a **Repo Show**: a Micropolis Class conversation whose stage is a public GitHub
repo, following through to working code anyone can browse without an account. **Show, don't tell.**

**What I'd love to explore with you — your pick, any order, skip whatever bores you:**

- **The engine was always a compiler.** Adventure-as-database + portable driver → Logo Adventure →
adventure compiler → MOOLLM. Same idea, four decades; we trace it on air and make it *run* in a
browser before the stream ends.
- **A world in 16K.** How brutal memory limits shaped your maps, your grammar, your puzzles — and
what modern authoring tools (and modern LLMs) should steal from that discipline.
- **Two-word parser vs. the LLM.** What verb-noun legibility bought you; what free-form language buys authors now; whether you can have both without losing the player. 
- How this flows into human and llm driven cli interfaces, domain specific command line languages, and composable Anthropic / MOOLLM skill wrappers.
- **Your biography as playable rooms.** You're already designing unlockable narrative on the web.
I want to build **compiler tooling you can actually use** for that — YAML in, self-contained
mini-adventure pages out — and document the collaboration in the open repo. Mutual seed exchange,
not me lecturing you about your own life.
- **Adventure + AI, from the person who invented the genre's plumbing.** Not hype — craft. What
helps an author; what makes a world model *trustworthy*; what you'd never let an model make up
about your story.

**Format:** Remote is fine — Platteville and Amsterdam are both real places on the internet. In-person
if we ever overlap. **Zero homework.** No slides required. If homeplay (instead of homework) sounds fun, we compile a tiny adventure together and ship the page; if not, we just talk. Warm room, not gotcha-podcast.

**Materials already waiting for you:**


| If you're curious about…         | Link                                                                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **This show** (segment ideas)    | [repo-shows/scott-adams/](SHOW.yml)                                                                                                      |
| **Your guest page**              | [characters/scott-adams/](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/scott-adams)                           |
| **Conversation hooks**           | [ideas.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/scott-adams/ideas.md)                                 |
| **The adventure-compiler trail** | [don-hopkins/career/lineage.yml](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/don-hopkins/career/lineage.yml) |
| **MOOLLM** (the repo itself)     | [github.com/SimHacker/moollm](https://github.com/SimHacker/moollm)                                                                       |
| **The whole Repo Show project**  | [WillWrightShowForFood](https://github.com/SimHacker/WillWrightShowForFood)                                                              |


Browse without a GitHub account — start at the [README](https://github.com/SimHacker/WillWrightShowForFood).

**Your response:** yes, later, too busy, or no — all honored gracefully. You've already given me
more encouragement than I had any right to expect; there's no debt here, only an open door if a
show sounds like fun.

It would be a joy to build something useful with you on air — and to watch the pioneer who taught
the industry how to fit a world in sixteen K help invent what comes next.

— Don Hopkins *(the User Interface Flower Child)* 🗺️🌀

`🗺️ adventure-as-data` · `📦 compile once, run everywhere` · `🥧 play to unlock the next room` · `🌐💻 biography meets microworld OS`

*P.S. — When you're ready, we can start anywhere: your engine, your biography rooms, or a blank
YAML file and see what the compiler makes of it.*