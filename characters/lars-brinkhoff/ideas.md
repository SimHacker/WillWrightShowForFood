# Ideas to explore with Lars Brinkhoff 🖥️

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in Lars's
public work and documented connections to this repository. Things Don would love to follow
**with** Lars Brinkhoff; not quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest · consent not_yet_asked

## What Lars has done

Lars Brinkhoff — preservationist and prolific hacker (Gothenburg, Sweden).
Lead contributor to [PDP-10/its](https://github.com/PDP-10/its): rebuilding the
Incompatible Timesharing System from source for KA10/KL10/KS10 emulators. nocrew.org
— Emacs history, lbForth, awesome-cpus, GCC/glibc on PDP-10. Collaborated with Don
on MIT AI Lab film / Logo history threads (Banks CA rule, ITS #1866). Natural pair
with Thomas Cherryhomes — Lars makes emulated ITS boot; Thomas wires retro machines
to the modern net (FujiNet, IRATA.ONLINE).

## Intro sequence — get the ball rolling on PDP-10

**Use this chain to open the Lars thread** — then roll into async PDP-10/ITS discussion. Break
every beat into **small digestible short-form videos** (attention atoms — shorter than TikTok;
shotgun-blast intercut in post). See [`couple-and-solo-shows.yml#async-production`](../../process/couple-and-solo-shows.md#async-production) · [`repo-show-branding.yml#attention-atoms`](../../process/repo-show-branding.md#attention-atoms).

| # | Atom | What |
|---|------|------|
| 1 | *The Americans* **ARPANET** | Professor explains the network; camera pans up to **PDP-10** — "It's like God." Gets the ball rolling. [`cultural-excerpts#americans-arpanet-pdp10`](../../process/repo-show-branding.md#cultural-excerpts#americans-arpanet-pdp10) |
| 2 | **Worf / Deck Ten** | Don asks: *"Worf, what is your favorite 36-bit computer?"* — short **ST:TNG** clip: Worf in the elevator, loud and clear: **"Deck Ten!"** (PDP-10 pun) |
| 3 | **DIGEX @ USENIX** | Don replies, quoting old friend **DIGEX** (East Coast commercial internet — see [`upbringing.yml#networking`](../don-hopkins/portrayal/upbringing.yml#dc-metro#networking)): at **USENIX**, teased the 32-bit VAX weenies with: *"If you're not playing with 36 bits, you're not playing with a full DEC."* |
| 4 | **Lars's t-shirt** | Don on camera in a tee from [Lars's t-shirt emporium](https://github.com/larsbrinkhoff/t-shirts) — among others the orange **LISP MACHINE MANUAL** (*LISP CHINE NUAL* — [`don-hopkins/media.md`](../don-hopkins/media.md)) |

Then: Lars async segments — boot ITS, Type 340, munching squares, Engelbart hook — each its own short clip.

## The hooks

### 1. Show seed: `repo-shows/lars-brinkhoff/`
walk the repo on air and build from the seed.

### 2. PDP-10/ITS
challenge make it so for pdp10-maclisp-drive; pair with Thomas Cherryhomes. **Intro sequence above** sets the table.

### 3. PIXIE / PDP-7 + Type 340 — join Heinz Lemke's show
Co-guest on [`pixie-pie-menus-pdp7.yml`](../../repo-shows/pixie-pie-menus-pdp7/README.md): Heinz tells
1969 Cambridge history; Lars maps Type 340 vector display + light pen to SIMH/emulation —
**make radial menus runnable on stream**. Local manual:
[`media/reference/dec-7-13-type-340-display-programming-manual.pdf`](media/reference/dec-7-13-type-340-display-programming-manual.pdf)
· bitsavers mirror linked in sidecar. Living PDP-7/340 demos.
[`../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md`](../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md)

**July 2026:** Lars replied **yes/later** (Swedish July vacation). Don pivoted to **async 1-on-1**
recordings intercut in post — see [`correspondence.yml`](correspondence.yml).

### 4. Emulation design hooks (async segment with Don)

| Hook | Notes |
|------|--------|
| SIMH PDP-7/340 | 340 device ok; light pen likely easy add-on |
| PDP-7 munching squares | Lars revising from PDP-10 Type 340 + Knight TV code |
| Cambridge software | Presumed lost — separate preservation project if found |
| Light pen + Titan networking | Research hardware; write PDP-7 test code on air |
| Label pie menus | Point-at-label light pen menus without float trig |
| Mouse → light pen | Emulator interpolates modern mouse into pen hits — design interview |
| Engelbart I/O | How mouse + keyset attached to PDP-10 — compare to Type 340 pen |

Deliverable: jam + notes in the repo. **No code obligation.** Demo only if something already works and Lars feels like showing it.

### 5. AM Radio Simulator beside throttled big iron — **propose to Lars**

Full write-up + video links: [`am-radio-simulator-proposal.md`](am-radio-simulator-proposal.md)

- Emulators **throttled to real time** so compute rate lands where AM RFI used to sing
- **AM radio simulator** (beeps/boops / Munching Tunes) as a sibling organelle — not an afterthought
- **[GNU Radio](https://www.gnuradio.org/)** AM TX/RX in software ([tutorial](https://wiki.gnuradio.org/index.php/Simulation_example:_AM_transmitter_and_receiver))
- A/B with classic demos: [Munching Squares + AM (Wayback)](https://web.archive.org/web/20200419194925/https://www.youtube.com/watch?v=V4oRHv-Svwc) · [Life + AM (Wayback)](https://web.archive.org/web/20200413075431/https://www.youtube.com/watch?v=hB78NXH77s4) · live [Spacewar! / PDP-1](https://www.youtube.com/watch?v=1EWQYAfuMYw)
- Pair [Edd / PadCrafter blinkenlights](../edd-coates/ideas.md#pixie-pdp-7-light-pens-engelbart-emulators-padcrafter-blinkenlights) — switches that change the tune

## Sources (public)

- [`invitation.md`](invitation.md)
- [`am-radio-simulator-proposal.md`](am-radio-simulator-proposal.md) — AM radio + throttle + video playlist
- [`correspondence.yml`](correspondence.yml)
- [`pdp7-development.md`](pdp7-development.md)
- Show seed: [`repo-shows/lars-brinkhoff/`](../../repo-shows/lars-brinkhoff/)
- [`CHARACTER.yml`](CHARACTER.yml)
