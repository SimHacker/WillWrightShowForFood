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

You ported my old Logo Adventure to Apple Logo in 2018. I wrote to the magazine to thank you then,
and I've been telling people about microM8 ever since. Congratulations on the IIGS and the Apple
III; I asked on Facebook whether an Apple I is next, and I'd still love to play with one. It has become the inspiration for something I'm building: an emulator of the Cambridge
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

I've also built microM8 as a WebAssembly module: a headless //e that runs in a web page and is
called directly from JavaScript, no sockets ([try it](https://hyperties.org/microm8/)). It's
seven patches on your September 2025 source, kept apart from your tree
([the patches](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/microm8/FORK.yml)):
build tags that keep the network client and cgo out of the js/wasm build and leave the desktop
build alone, the headless machine, a Videx Videoterm in slot 3 (the card my old Apple ][+ Forth
and terminal emulator used), the 2651 serial card that Forth drives, annunciators AN0-AN3, a
Disk II write-protect tab that now takes effect, and two speed fixes found by profiling. Whatever
you'd like goes back to you as pull requests, one subject each; the rest stays ours. Your public
repo is still at the 2025 release, so if you publish the IIGS and Apple III source, I'll rebase
onto it first.

Having microM8 in the page is what makes the rest possible. A "screen angel" sits beside it and
watches the same 560x192 frame the canvas shows, matching small pictures cut from the screen, so
it knows where a game is from what's on the screen, with a state machine written as data, one
file per game. For Little Computer People it turns the disk over for you, and when the guestbook
asks for the researcher's name and the date, it puts an ordinary HTML field under the screen
(the date already filled in), and types the answer into the Apple when you press OK. Once he has
moved in, the game's Control-key commands become buttons, and a chat field sends him requests
like PLEASE PLAY THE PIANO. It can speak what the game wants, speed through the long move-in, and
turned off, it leaves the machine and the keyboard to you
([the angel](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/angels/little-computer-people/ANGEL.yml),
[the guide](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/guides/little-computer-people.md)).
That's accessibility for games that never had any: spoken prompts, plain fields and buttons,
and no need to know a 1985 keyboard convention. The disks live in memory too, so per-game bridges
read and write the saves the guest just wrote. To start, they wrap Little Computer People, Mind
Mirror and Wizardry: each adds its own subdirectory to your Soul City character's directory (the
Little Computer Person, the Mind Mirror life, the Wizardry adventurer), imports back into any copy
of the game, and can move what one game knows about a character into another.

That is one bridge, the Apple ][, with sub-bridges for each game, inside a larger plan I call
SoulAngel: one companion for many machines and many games, with bridges to the PDP-7 and other
CPUs in the cabinet and the games on them, and out to games running natively on your own
computer, starting with The Sims 1, under a programmable transparent full-screen overlay that
does the same watching, asking and typing
([SoulAngel](https://github.com/SimHacker/WillWrightShowForFood/blob/main/catalogs/soul-city/soul-angel.md)).
The emulator in the browser is where it's easiest to get right: exact pixels, a keyboard we can
type into, saves we can read, and runs we can repeat.

Watching your 2016 KansasFest talk on PERCOL-8 again, I found you'd been there before me: 32 bits
for every Apple byte, with the 24 spare holding colour, font size and extended characters, and
memory synced between machines over the network, with one player's paddle 0 remapped to the
other's paddle 1. The cabinet keeps each 18-bit PDP-7 word in 32 bits and uses the 14 spare for
tags the machine never sees, and its next step is machines mapping each other's memory, after the
interface MIT's AI Lab built between its PDP-10 and PDP-11s
([MAPPING](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/MAPPING.md)).

**Will Wright is in — he's signed on to do the [premiere](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md) and more.**

If you'd enjoy it, I'd like to invite you to a **Repo Show**, a recorded conversation whose stage is a
public GitHub repository: on microM8 and turtleSpaces, or as part of an emulation roundtable with Lars
Brinkhoff, David Rosenthal, Bob Supnik, Al Kossow, Thomas Cherryhomes and others
([proposal](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/emulation-roundtable/README.md)).
No preparation, and you see anything before it's published.

— Don

↑ [April](README.md) · [Melody](../melody-ayres-griffiths/README.md)
