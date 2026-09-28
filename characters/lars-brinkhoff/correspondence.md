# Correspondence — Lars Brinkhoff × Don Hopkins

Public-safe digest. **Not** the full private thread.  
Machine index: [`correspondence.yml`](correspondence.yml) · [Portrayal standards](../../schemas/portrayal-standards.md)

**Span:** December 2017 — ITS, Type 340, RFI, Emacs, Logo; July 2026 — PIXIE Repo Show invitation response · **Consent:** `not_yet_asked`

---

## Gist

Lars replied **yes/later** to the PIXIE trio invitation — interesting, but heading into Swedish July vacation (much of Sweden offline for the month). Not sure what he can contribute; prefers unprepared/rambling format with someone prodding him.

**SIMH PDP-7 340 device is ok**; light pen may not be available yet — thinks it would be an **easy addition**. Can make **PDP-7 munching squares** — revised PDP-10 Type 340 and Knight TV versions; original YouTube link dead but survives on web archive.

Don pivoted production to **async 1-on-1 recordings** interlinked in post — rich intertwingled tapestry instead of one live group call across time zones.

---

## Before PIXIE ran (2017–2022)

**Dec 2017, TUHS "pre-UNIX legacy in UNIX?"** Lars: job control, and Control-Z, came from ITS.
Don added the ITS job-passing commands (`:DISOWN`, `:UJOB`, `:DETACH`, `:SNARF`): "you could pass
a job back and forth between users, like a joint!"

**GitHub, PDP-10/its.** In [#1339](https://github.com/PDP-10/its/issues/1339#issuecomment-428878039)
(Oct 2018, "Hackers finding their way to ITS") Lars posted Guy Steele's "I was a teen-age hacker":
the PDP-6 with MacHack's chess trophies, "two speakers and a stereo amplifier sitting on top of
it" playing Brandenburg no. 6, and color Spacewar!. In [#425](https://github.com/PDP-10/its/issues/425)
("ITS pictures") Lars posted DM's pager panel on 6 Oct 2019. Don: "There should have been a little
numbered knob that lets you adjust the number of Zorks allowed to run at once. (It would usually be
set to '2'.)" In Jan 2022 Lars posted a photo of Bill Gosper hacking Life on the PDP-6, from Steven
Levy by way of Mike Beeler.

**Aug 2019, AI:HUMOR;** Don asked for the MIT-AI humor directory. Lars pointed to
[its-vault/files/humor](https://github.com/PDP-10/its-vault/tree/master/files/humor/): ROCKY HOR
is there ([rocky.hor](https://github.com/PDP-10/its-vault/blob/master/files/humor/rocky.hor)),
LOGO TURTLE is not; Leigh Klotz has a copy
([HN 20805140](https://news.ycombinator.com/item?id=20805140)). Björn Victor noted UP is the PI
system, on the Internet Archive as KLH10-PI-ITS. On HN Lars added that LLOGO runs on a PDP-10
emulator with the Knight TV.

**Mar 2020, "PDP-7 Type 340 Display Emulator?"** Don introduced Lars and Heinz Lemke after finding
Lars's [simh#752](https://github.com/simh/simh/pull/752). Lars: the PDP-7 and its 340 "should
both be working quite well to the extent I could test them. I have no PDP-7 software using the
340", light pen support is there, and "I would like PDP-6/7/10 etc simulators to make the step to
the web for people to more easily interact with historical software. But I don't have time or
expertize to do this myself." Phil Budne wrote the 340 for the PDP-6/10; Lars added the PDP-7
parts. The 340 software that exists is MIT's: SHRDLU, MacHack VI, Life, a Datapoint emulator, two
Spacewar!s. For reading tapes he recommended the Living Computer Museum over CHM, and named its
engineering manager, Stephen Jones. He suggested writing a new game for the PDP-6 or 7 with a 340.

**18 Mar 2020, RFI.** Don: "Could you instrument simh to generate (or at least fake) RFI?" Lars:
"That's an interesting thought. But before that I'd like to get the regular music players to
work." He had just tried Emscripten (the Knight TV ran; sockets were the stumbling block) and
started [crt-simulation](https://github.com/larsbrinkhoff/crt-simulation) for the P7 phosphor,
noting masswerk's Spacewar! looked better than SIMH's 340. At the museum in 2019 the PDP-7 and 340
were not yet connected. This thread is where [AM-RADIO.md](../../packages/cabinet/AM-RADIO.md)
starts.

**Apr–May 2020.** Gosling Emacs history (Lars's
[emacs-history](https://github.com/larsbrinkhoff/emacs-history)) traded for NeWS sources; the
"You devil, you!" exchange below; the ITS Maze game running; Banks's rule in the MIT AI film on
Life, with Lars's notes in [PDP-10/its#1866](https://github.com/PDP-10/its/issues/1866). Lars on
restoration: "I generally prefer software simulators and hardware remakes... Something else that
bothers me are when people only restore the old stuff, but when they are finished they just let
it sit unused. I find it a delight to actually use ITS and write new programs."

**Oct 2020, "Is NeWS still around?"** **Apr 2022:** Lars always checks the Wikipedia talk page,
and posts to the Computer History Wiki instead, e.g.
[ITS on gunkies.org](https://gunkies.org/wiki/Incompatible_Timesharing_System).

---

## "You devil, you!" (14 Apr 2020)

Don sent Lars two of his HN posts. The first
([22840639](https://news.ycombinator.com/item?id=22840639)) spilled ITS DDT's secret: set
`:DDTSYM DPSTOK/-1`, then `$$^R` lets you write into other users' jobs, and DDT answers " OP? "
either way so onlookers think it failed. Lars: "Oh no, all the secrets are out in the open! ;-)"
Don: Stever had already blown it in 1989, asking whether knowing `DPSTOK/-1` followed by `$$^R`
proved the high moral principles the unix-haters list demanded; that message was the one
non-obscure Google hit for it. (This repo had it misspelled as `DPTSTOK` until 2026-09-28.)

The second ([22853920](https://news.ycombinator.com/item?id=22853920)) was Conway's Life on the
Living Computer Museum's PDP-7 with a Type 340, music by AM radio off the Type 347. Lars answered
in kind: "Speaking of music, I have a PDP-6 simulator making noises now"
([its-hackers, 2020](http://its.victor.se/pipermail/its-hackers_its.victor.se/2020/000578.html)).

---

## PIXIE invitation (2 Jul 2026)

| Item | Detail |
|------|--------|
| Response | yes_later |
| Constraints | Swedish July vacation — much of Sweden offline |
| Format | Unprepared/rambling — needs prodding on air |
| SIMH PDP-7/340 | 340 device ok |
| Light pen | May not be available yet — likely easy add-on |
| Munching squares | Can port from revised PDP-10 Type 340 + Knight TV code |

---

## Don async pivot (3 Jul 2026)

Async 1-on-1 videos whenever convenient; Don interlinks directories, artifacts, cuts in post. Presumes most Cambridge PDP-7 software lost (separate preservation project if found).

**Segment hooks:**

- Light pen + networking hardware research
- Implement/test PDP-7 code
- Label-target light-pen pie menus even without float trig
- Engelbart mouse/keyset on PDP-10 — how did hardware attach?
- Emulator mouse → light-pen interpolation
- Discuss designs on air; ship code later or demo if done

→ [Outbound draft](outbound-2026-07-03-async-pivot.md)

---

## Show hooks

- SIMH PDP-7/340 boot path — 340 ok, light pen as easy add-on
- PDP-7 munching squares — from revised PDP-10/Knight TV code
- Mouse → light pen interpolation in emulator
- Label-target light-pen pie menus without float trig libraries
- Engelbart mouse + keyset on PDP-10
- Unprepared/rambling segment — Don prods, Lars demonstrates

---

## Connects in repo

| Path | Why |
|------|-----|
| [invitation.md](invitation.md) | PIXIE trio invitation |
| [ideas.md](ideas.md) | Emulation + interview hooks |
| [../../repo-shows/pixie-pie-menus-pdp7/README.md](../../repo-shows/pixie-pie-menus-pdp7/README.md) | Show seed — async production |
| [../heinz-lemke/correspondence.md](../heinz-lemke/correspondence.md) | Trio invitation thread |
| [../david-rosenthal/correspondence.md](../david-rosenthal/correspondence.md) | Trio logistics + scope |
| [../douglas-engelbart/](../douglas-engelbart/) | Mouse + keyset PDP-10 hook |

↑ [README](README.md)
