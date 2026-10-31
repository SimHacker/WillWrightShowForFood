---
status: draft
character_id: april-ayres-griffiths
joint_with: melody-ayres-griffiths
public: true
consent: not_asked
format: remote_or_in_person
---

# Repo Show invitation — April and Melody Ayres-Griffiths

*April and Melody may edit, decline, delay, or request removal at any time — or take direct edit access. [Portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md) — also covers quiet mode and onboarding.*
**Subject:** microM8, a PDP-7, and a turtle between them

---

April and Melody —

You ported my old Logo Adventure to Apple Logo in 2018, and I've been telling people about microM8
ever since. It has become the inspiration for something I'm building: an emulator of the Cambridge
PDP-7 and its Type 340 display that runs in a web page, where Mitch Bradley's PDP-7 Forth and Heinz
Lemke's 1969 PIXIE run again ([the cabinet](https://hyperties.org/cabinet/)). Its manifesto credits
microM8 by name, for the idea that an emulator owes the person using it more than fidelity
([MANIFESTO](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/MANIFESTO.md#a-federation-of-emulators-after-microm8)).
Please correct anything I got wrong.

The plan is a federation rather than one big emulator: machines from different emulators talking
through a hub. The first demo I'd like to build is Forth on the PDP-7 sending a drawing through the
hub to microM8, where your 3D turtle draws it in the next window. Your MCP server can already take
it as typed Logo, and turtleSpaces' `api` socket can take it too: I'd like the 1975 ITS Logo floor
turtle's character stream to drive a turtleSpaces turtle, so anyone it hooks ends up with you ([the plan](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/TINY-TITAN.md#first-demo-pixie-rings-to-microm8s-3d-turtle)).
And anyone the cabinet's Logo turtle gets hooked, I'd like to send to turtleSpaces.

One more proposal, which I'd be glad to write myself and send as a pull request if you'd like it:
microM8's core built as a WebAssembly module with a small JavaScript API, so a web page can run it
and call it directly, no sockets: step it, read and write its memory through zero-copy views, take
snapshots and rewind, get callbacks. Then an Apple ][ and a PDP-7 can share memory in one page, and
every view either of us builds works on both. It's the pattern that already runs the SimCity engine in
[MicropolisCore](https://github.com/SimHacker/MicropolisCore): WebAssembly, callbacks into Svelte's
reactive state, and zero-copy views of the map. It would sit behind a build tag and leave the desktop
build alone; if cyanIIde already does this, even better
([the proposal](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/MICROM8.md#proposal-microm8-as-a-webassembly-module-called-directly)).

**Will Wright is in — he's signed on to do the [premiere](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md) and more.**

If you'd enjoy it, I'd like to invite you to a **Repo Show**, a recorded conversation whose stage is a
public GitHub repository: on microM8 and turtleSpaces, or as part of an emulation roundtable with Lars
Brinkhoff, David Rosenthal, Bob Supnik, Al Kossow, Thomas Cherryhomes and others
([proposal](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/emulation-roundtable/README.md)).
No preparation, and you see anything before it's published.

— Don

↑ [April](README.md) · [Melody](../melody-ayres-griffiths/README.md)
