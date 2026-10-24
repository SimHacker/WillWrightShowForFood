---
status: draft
character_id: james-fogarty
public: true
consent: not_yet_asked
format: remote_or_in_person
---

# Repo Show invitation — James Fogarty

*James may edit, decline, delay, or request removal at any time — or take direct edit access. [Portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md) — also covers quiet mode and onboarding.*
**Subject:** Prefab, interaction proxies, and an app that repairs interfaces from outside

---

James —

I'm Don Hopkins. I worked on pie menus with Ben Shneiderman at Maryland, on NeWS at Sun, and on
SimCity and The Sims. For about thirteen years I've been trying to build a layer that reads,
scripts and extends other applications' interfaces from outside, and your group's work is what
convinced me it can be done: Prefab, which you built with Morgan Dixon, and interaction proxies,
which repair accessibility while an app runs.

It's being built now as Screen Angel. It reads accessibility trees on macOS and Windows, has a
selector language and a click-through overlay, and the pixel side is next. Two parts are close to
your work:

- [ACCESSIBLIFY.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/ACCESSIBLIFY.yml):
  adding accessibility to apps that don't expose it, by recognizing widgets from pixels (starting
  from Prefab's prototype matching) and building a shadow HTML and ARIA surface that screen readers
  can use, with deduced information always marked as deduced.
- [AGENT.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/AGENT.yml):
  an AI agent that reads the screen and the tree and acts only with granted tools, through the
  same controls a person sees.

LLMs make the recognition practical in a way it wasn't in 2010, but a model guessing what a widget
is for doesn't replace knowing exactly where it is, every frame. I'd like to hear how you'd combine
the two, and what your research on human-AI interaction says about letting agents use these
interfaces.

**Will Wright is in — he's signed on to do the [premiere](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md) and more.**

I'd like to invite you to a **Repo Show**: a recorded conversation whose stage is a public GitHub
repository, where what we discuss can be built afterward. Possible threads, your pick:

1. Prefab and interaction proxies in the age of vision models.
2. Accessibility repair from outside: what works, what breaks, and who should be allowed to do it.
3. Agents using accessibility APIs: the same trees, a new kind of user.
4. With Morgan Dixon, and perhaps Richard Potter, whose Triggers drove Mac applications from pixels
   in 1991.

Remote is fine. No preparation needed.

— Don Hopkins

---

## Everything else, if you want more

- Screen Angel:
  [SCREEN-ANGEL.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/SCREEN-ANGEL.yml) ·
  [ACCESSIBLIFY.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/ACCESSIBLIFY.yml) ·
  [AGENT.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/AGENT.yml) ·
  [the Prefab bibliography](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/sources/prefab-bibliography.md)
- [An interface to agency](https://github.com/SimHacker/moollm/blob/main/designs/INTERFACE-TO-AGENCY.md)
- People: [Morgan Dixon](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/morgan-dixon/README.md) ·
  [Richard Potter](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/richard-potter/README.md) ·
  [Peter Korn](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/peter-korn/README.md)
- [Your page](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/james-fogarty/README.md) — correct, extend or delete anything

*P.S. The repo is in quiet mode while invitations go out — please don't share links publicly just yet.*
