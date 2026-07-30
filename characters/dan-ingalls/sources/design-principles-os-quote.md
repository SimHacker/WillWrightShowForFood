# Design Principles — "There shouldn't be one"

*Dan Ingalls, August 1981 — Don's reading for Repo Show prep. Not a claim about what Dan thinks of MOOLLM.*

## The quote

> An operating system is a collection of things that don't fit into a language. There shouldn't be one.

**Source:** Dan Ingalls, *Design Principles Behind Smalltalk*, Byte Magazine, August 1981 (Smalltalk issue). Also in the Smalltalk-80 materials and widely cited from there.

**Context in the paper:** Ingalls is arguing against the programmer having to *leave* a consistent object/message framework and drop into a "very primitive" environment. Smalltalk absorbed filesystem, scheduling, display, keyboard, debugger, and GUI into the language/runtime so the same communicating-objects metaphor runs "all the way up."

**Companion line (POPL 1978):** *"In this way, the underlying metaphor of communicating objects can be seen to operate all the way up to the level which corresponds to a conventional operating system."*

## Why it keeps resurfacing

| Era | What people map it onto |
|-----|-------------------------|
| 1981 | Unix vs integrated Smalltalk image |
| 2000s | Emacs as OS joke; Lisp Machines that didn't mainstream |
| 2013+ | Kell & Pike, *The operating system: should there be one?* — postmodern Unix, files as objects |
| 2026 | Emacs "everything looks like a service"; Cursor agents orchestrating shell/MCP/git |

The HN Emacs thread (Charles Choi, Jul 2026) reframes Emacs as orchestration above the kernel — client/server to wttr.in, shell commands, TCP — not a kernel replacement. Ingalls' point was never "no layer below you." It was **don't fracture the cognitive model** when you cross a boundary.

## Don's bridge (proposed show topic — ask Dan)

**MOOLLM** as microworld OS for agent work: things that don't fit in a single prompt or a single repo language.

| Ingalls absorbed into Smalltalk | MOOLLM absorbs into the skill filesystem |
|----------------------------------|------------------------------------------|
| Filesystem | Rooms, YAML Jazz repos, git archaeology |
| Debugger | cursor-mirror — session thinking, tool calls |
| Scheduler / processes | Skills composing (thoughtful-commitment, skill-snitch) |
| Device / network edge | MCP, shell, ssh, gh — everything looks like a service |
| UI | Cursor / Claude Code / mooco as the live frame |

**Cursor** is filling the place of Emacs in Don's workflow: terminals, CLI utilities, ssh, stdin/stdout glue — same orchestration pattern, different century. Skills are composable modules; the LLM is `eval()`.

**Show questions for Dan:**

1. Did Ingalls mean *eliminate* the OS boundary, or *raise* the abstraction floor so you rarely fall through?
2. When Automerge/Livelymerge holds live state and git holds published intent — where is "the OS" now? Two languages? One microworld?
3. Is an agent IDE (Cursor) the new Smalltalk image — or the new Unix shell — or both?
4. Natural Selection (closing principle in the same Byte article): do skill ecosystems that compose win over monolithic agent scripts?

## Public sources

- [Design Principles Behind Smalltalk (HTML)](https://archive.esug.org/HistoricalDocuments/Smalltalk80/DesignPrinciples/DesignPrinciples.html)
- [Byte Aug 1981 issue context (Curlie)](https://www.curlie.org/en/Computers/Programming/Languages/Smalltalk/)
- Kell & Pike (2013): [The operating system: should there be one?](https://dl.acm.org/doi/10.1145/2525528.2525534)
- Choi (2026): [In Emacs, Everything Looks Like a Service](https://yummymelon.com/notes/devnull/emacs-everything-looks-like-a-service.html)
- Don's stack: [MOOLLM](https://github.com/SimHacker/moollm) · [cursor-mirror](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) · [mooco](https://github.com/SimHacker/mooco)

## See also

- [`../ideas.md`](../ideas.md) — conversation hooks
- [`../../process/trails/live-objects.md`](../../../process/trails/live-objects.md) — live-object lineage
- [`../../process/trails/yaml-jazz-collaboration-stack.md`](../../../process/trails/yaml-jazz-collaboration-stack.md) — published vs in-session layers
