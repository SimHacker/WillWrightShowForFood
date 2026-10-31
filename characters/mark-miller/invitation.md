---
status: draft
character_id: mark-miller
public: true
consent: not_asked
format: remote_or_in_person
---

# Repo Show invitation — Mark S. Miller

*Mark may edit, decline, delay, or request removal at any time — or take direct edit access. [Portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md) — also covers quiet mode and onboarding.*
**Subject:** Least authority for LLM agents, and where my grants should be capabilities

---

Mark —

I'm Don Hopkins. I worked on pie menus with Ben Shneiderman at Maryland, on NeWS at Sun, and on
SimCity and The Sims with Will Wright, and I later released SimCity as free software,
[Micropolis](https://micropolisweb.com/). We overlap on Roger Gregory's Xanadu threads. I'm writing
because I'm building things where your work is the right lens, and I'd like you to tell me where I
have it wrong.

**MOOLLM** treats a git repository as a world that people and LLMs share: directories are rooms,
files are objects, and characters, played by a person or a model, act in it. Its access model,
[MOOAM](https://github.com/SimHacker/moollm/blob/main/designs/MOOAM.md), uses principals,
resources, grants and least privilege. It says plainly that inside one LLM call those declarations
are advisory, because you can't tell which character did what. It is ACL-shaped, not
capability-shaped, and I suspect "Capability Myths Demolished" describes the problem.

**Screen Angel** is an app that reads, scripts and extends other applications' interfaces from
outside, through accessibility APIs and pixels, for people and for agents. Its
[CAPABILITIES.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/CAPABILITIES.yml)
separates three layers: what the operating system grants the whole app; what the host enforces at
its own API boundary, where a module is an object calling a named method and the call site is
observable; and what agents and skills only declare and get audited on.
[APP-CONTROL.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/APP-CONTROL.yml)
makes input injection wait for consent, per application, revocable and logged. Driving The Sims is
not a grant to drive your mail.

An LLM agent driving real applications is the event-stream problem again, with a model choosing
which dependency to call. I'd like your view of where those grants should become references,
and what Hardened JavaScript and Endo would look like as the boundary between the host and the
things it hosts.

**Will Wright is in — he's signed on to do the [premiere](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md) and more.**

I'd like to invite you to a **Repo Show**: a recorded conversation whose stage is a public GitHub
repository, where what we discuss can be built and run afterward. Possible threads, your pick:

1. Least authority for LLM agents: what capabilities mean when a model chooses the calls.
2. A capability critique of MOOAM and Screen Angel's layers, live, with the files open.
3. From Udanax to E to JavaScript: how promises got into the language, and strict mode, Proxies and
   SES on the way to Hardened JavaScript.
4. Xanadu at Autodesk, with Roger Gregory, and remembering John Walker, who funded it.
5. Agoric Open Systems in 1988 and Agoric now: markets for computation.

Remote is fine. No preparation needed.

— Don Hopkins

---

## Everything else, if you want more

**The files**

- [MOOAM](https://github.com/SimHacker/moollm/blob/main/designs/MOOAM.md) ·
  [MOOLLM](https://github.com/SimHacker/moollm)
- Screen Angel:
  [SCREEN-ANGEL.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/SCREEN-ANGEL.yml) ·
  [CAPABILITIES.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/CAPABILITIES.yml) ·
  [APP-CONTROL.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/APP-CONTROL.yml) ·
  [AGENT.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/AGENT.yml)
- [An interface to agency](https://github.com/SimHacker/moollm/blob/main/designs/INTERFACE-TO-AGENCY.md):
  agents and people share the same visible controls

**Xanadu**

- [Roger Gregory](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/roger-gregory/README.md) ·
  [Udanax lineage questions](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/roger-gregory/sources/udanax-lineage-questions.md) ·
  [Ted Nelson](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/ted-nelson/README.md) ·
  [John Walker](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/john-walker/README.md)

**People**

- [Carl Hewitt](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/carl-hewitt/README.md) ·
  [Ken Kahn](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/ken-kahn/README.md) ·
  [Dan Bornstein](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/dan-bornstein/README.md)
- [Your page](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/mark-miller/README.md) — correct, extend or delete anything
- [Don Hopkins](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/don-hopkins/README.md)

*P.S. The repo is in quiet mode while invitations go out — please don't share links publicly just yet.*
