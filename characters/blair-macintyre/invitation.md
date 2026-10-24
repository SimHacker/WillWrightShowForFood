---
status: draft
character_id: blair-macintyre
public: true
consent: not_yet_asked
format: remote_or_in_person
---

# Repo Show invitation — Blair MacIntyre

*Blair may edit, decline, delay, or request removal at any time — or take direct edit access. [Portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md) — also covers quiet mode and onboarding.*
**Subject:** Your objection to aQuery is now in the design, credited

---

Blair —

Around 2013 Ben Shneiderman forwarded you my proposal for aQuery, a scripting layer over
accessibility APIs for reading, scripting and extending other applications' interfaces from
outside. You replied with the objection I've kept ever since: interfaces built by drilling down to
specific objects would break as applications updated, so bind to patterns and build libraries of
capabilities, with a layer for each application. You also saw that the layer could serve AR and
speech, not just HTML, the way Windows on the World put X windows into an AR space
([the thread](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/sources/2013-email-thread.md)).

The project is being built now, renamed Screen Angel, and your objection is in the design by name:
selectors deliberately leave out sibling and position selectors because they depend on unstable
ordering, and widgets sit over a swappable layer per application
([SCREEN-ANGEL.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/SCREEN-ANGEL.yml)).
Reading the accessibility tree, the selectors, a click-through overlay, a protocol, a command line
and an MCP server are working; recording and consent-gated input are next.

Some of the design is close to your own work, and I'd value your criticism:

- [LIVE-VIEWS.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/LIVE-VIEWS.yml):
  instead of arranging real windows, capture each one as a live GPU texture and compose them in a
  space of our own, which is Windows on the World turned inside out.
- [MOBILE-CAMERA.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/MOBILE-CAMERA.yml):
  point a phone at any screen and get the same layer through the camera.
- [AR-SDKS.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/AR-SDKS.yml):
  what to take from AR toolkits for tracking, authoring and effects.
- [OPTICAL-CHANNEL.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/OPTICAL-CHANNEL.yml):
  games with no API talk to the overlay by drawing codes on screen.

**Will Wright is in — he's signed on to do the [premiere](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md) and more.**

I'd like to invite you to a **Repo Show**: a recorded conversation whose stage is a public GitHub
repository, where what we discuss can be built afterward. Possible threads, your pick:

1. Your 2013 objection, thirteen years on: has an LLM that can recognize what a widget is for
   changed the answer?
2. Windows on the World, Argon and WebXR, and what desktop interfaces in a space of our own should
   learn from them.
3. Screen Angel through a phone camera: augmenting screens you don't control.
4. AR for agents: overlays that show what an AI is looking at and about to do.

I'm Don Hopkins; I worked on pie menus with Ben, on NeWS at Sun, and on SimCity and The Sims.
Remote is fine. No preparation needed.

— Don

---

## Everything else, if you want more

- Screen Angel:
  [SCREEN-ANGEL.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/SCREEN-ANGEL.yml) ·
  [LIVE-VIEWS.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/LIVE-VIEWS.yml) ·
  [MOBILE-CAMERA.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/MOBILE-CAMERA.yml) ·
  [AR-SDKS.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/AR-SDKS.yml) ·
  [OPTICAL-CHANNEL.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/OPTICAL-CHANNEL.yml)
- [The 2013 thread](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/sources/2013-email-thread.md)
- People: [Peter Korn](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/peter-korn/README.md) ·
  [Morgan Dixon](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/morgan-dixon/README.md) ·
  [James Fogarty](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/james-fogarty/README.md) ·
  [Ben Shneiderman](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/ben-shneiderman/README.md)
- [Your page](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/blair-macintyre/README.md) — correct, extend or delete anything

*P.S. The repo is in quiet mode while invitations go out — please don't share links publicly just yet.*
