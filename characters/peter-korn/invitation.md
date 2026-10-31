---
status: draft
character_id: peter-korn
public: true
consent: not_asked
format: remote_or_in_person
---

# Repo Show invitation — Peter Korn

*Peter may edit, decline, delay, or request removal at any time — or take direct edit access. [Portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md) — also covers quiet mode and onboarding.*
**Subject:** aQuery, the idea I bounced off you, is now running

---

Peter —

Around 2013 I emailed you to bounce an idea off you: a scripting layer that would be to accessibility
APIs what jQuery is to the DOM, so people could select, script and extend the interfaces of
applications they don't control, drawing their own controls over them in a transparent overlay. You
replied that it sounded quite do-able and that you had a lot more to say. I've kept that thread, and
the idea, ever since
([the thread](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/sources/2013-email-thread.md)).

It's being built now, renamed Screen Angel: an Electron app with native addons that read the
accessibility tree, a selector language over it, a transparent click-through overlay, and a
protocol, command line and MCP server so scripts and agents can use it. Recording and
consent-gated input are next. The design is in
[SCREEN-ANGEL.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/SCREEN-ANGEL.yml).
Two parts I'd most like your opinion on:

- [ACCESSIBLIFY.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/ACCESSIBLIFY.yml):
  adding accessibility to applications that don't expose it. For web content we can repair it
  properly; for native apps we can't, so the plan is a shadow HTML and ARIA surface laid over the
  app, which VoiceOver and Narrator can read, built from what pixels and a vision model recognize,
  with deduced information always marked as deduced.
- [CAPABILITIES.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/CAPABILITIES.yml):
  what the OS grants, what we enforce, and what agents only declare, since one Accessibility grant
  covers every application on the machine.

The reason it's practical now is LLMs: recognizing what a widget is for, from its pixels and its
tree, was the part that stalled in 2013. An agent that reads the screen and the tree and acts with
granted tools is also an assistive technology, and I think accessibility people should shape it
before anyone else does.

**Will Wright is in — he's signed on to do the [premiere](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md) and more.**

I'd like to invite you to a **Repo Show**: a recorded conversation whose stage is a public GitHub
repository, where what we discuss can be built and tried afterward. Possible threads, your pick:

1. What you would have told me in 2013, and what's true now.
2. Repairing accessibility from outside: shadow surfaces, UIA proxy providers, and where it goes wrong.
3. AI agents as assistive technology: what accessibility APIs need to become now that models use them.
4. Thirty years of screen readers, from outSPOKEN and the Java Access Bridge to GNOME and VoiceView.

I'm Don Hopkins; I worked on pie menus with Ben Shneiderman, on NeWS at Sun, and on SimCity and
The Sims. Remote is fine. No preparation needed.

— Don

---

## Everything else, if you want more

- Screen Angel:
  [SCREEN-ANGEL.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/SCREEN-ANGEL.yml) ·
  [ACCESSIBLIFY.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/ACCESSIBLIFY.yml) ·
  [CAPABILITIES.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/CAPABILITIES.yml) ·
  [AGENT.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/AGENT.yml) ·
  [BROWSER.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/BROWSER.yml)
- [The 2013 thread](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/sources/2013-email-thread.md)
- [An interface to agency](https://github.com/SimHacker/moollm/blob/main/designs/INTERFACE-TO-AGENCY.md):
  agents and people share the same visible controls
- People: [Blair MacIntyre](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/blair-macintyre/README.md) ·
  [Morgan Dixon](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/morgan-dixon/README.md) ·
  [James Fogarty](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/james-fogarty/README.md) ·
  [Richard Potter](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/richard-potter/README.md)
- [Your page](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/peter-korn/README.md) — correct, extend or delete anything

*P.S. The repo is in quiet mode while invitations go out — please don't share links publicly just yet.*
