# Real-time net jamming — the nettime scene, when it all just started to work

*Don's scene-painting of the turn-of-the-millennium moment (~1996–2001) when live video and musical
**net jamming** stopped being a dream and started actually running — machines on opposite sides of the
world trading live streams, mutating each other's signal, and re-patching the code **while it played.**
The town square was the **nettime** mailing list; the instruments were **Max/MSP**, **NATO.0+55+3d**,
**Image/ine**, and **Bounce/Body Electric**, wired to a whole nervous system of hardware. A warm,
firsthand portrait — verify names, dates, and quotes against the sources before airing.*
[Portrayal standards](../../schemas/portrayal-standards.md) ·
Trail: [visual-programming-patch-cord](../../process/trails/visual-programming-patch-cord.md)

## The feeling

For a few years around 2000, the future arrived early and let you touch it. Bandwidth had finally
caught up to ambition; the Mac had a **PowerPC** fast enough to push live video; and a small
international crowd of artists, programmers, and musicians realized — all at once — that you could
**perform together over the network, in real time, with the software open on stage.** Not render, not
upload, not wait. Jam. As one witness put it on Hacker News (usrusr): *"It was the last time for me that
the present felt like a prelude to the future."* That's the exact feeling this repo wants to bottle.

## The town square: nettime

**nettime** — the net-criticism/net-art mailing list (Geert Lovink and company) — was where the scene
argued, theorized, flamed, and fell in love with itself. It was equal parts manifesto and mosh pit.
Into that room walked **[Netochka Nezvanova](../netochka-nezvanova/README.md)** — "NN," *antiorp*,
*integer*, *=cw4t7abs* — trailing ASCII code-poetry, aggressive licensing, and a mystique she tended
like a garden. She was proof that on this network the **medium itself** — the mailing list, the
software license, the patch — could be the performance. Trolling as propaganda; information
architecture as material.

## The instruments

**Max / MSP** was the shared substrate — the visual patch-language ([Miller
Puckette](../miller-puckette/README.md)'s Max, with the MSP audio-DSP layer, commercialized through
Cycling '74). If you wanted to wire signal to sound to control to image, you did it in Max. Everyone met
there.

**NATO.0+55+3d** (1999, NN) was the one that made video *live*. It lived inside Max and turned it into a
real-time video-and-graphics instrument years before Cycling '74 shipped **Jitter** (2002). Its magic
was the **network**: "operators" exchanged live **QuickTime RTP** video streams back and forth — LAN and
open internet, near and far — jamming together, **mutating, remixing, and layering the video each hop**,
projecting it on screens, feeding it back and forth, all while **editing the patch in real time.** It
was gorgeous, notorious, and famously **fragile** — "so fragile, and easy to lose," as one VJ put it —
which only made a clean run feel like a high-wire act.

**Image/ine** (**STEIM**, Amsterdam, 1996–2001 — [Steina Vasulka](../steina-vasulka/README.md) + [Tom
Demeyer](../tom-demeyer/README.md)) had been drawing in the same direction just before NATO: real-time
video manipulation on the Mac, plug-in based, with the **PowerPC 8600** as "the dream machine." Its
ideas were later absorbed into **Isadora** ([Mark Coniglio](../mark-coniglio/README.md)) — the same
**patch-cord** lineage that runs back through **Hookup** to Max.

**Bounce / Body Electric** was the VR cousin at the same party. VPL's **Body Electric** (lead
designer/programmer [Chuck Blanchard](../chuck-blanchard/README.md); [Jaron
Lanier](../jaron-lanier/README.md)'s VPL), and [David Levitt](../david-levitt/README.md)'s **Bounce**
derivative that Don productized at Levity/Interval, did for **VR worlds** what NATO did for video: you
**live-coded a running simulation** — reach in, re-patch it, and it keeps going. Typed, colored wires
carried whole JSON-like objects; a Swivel 3D transform-tree *was* the skeleton; the projected parameters
flew over **UDP to two SGI renderers, one per eye.** Same instinct, different sense: performance you
edit while it runs. (Full stack: [Body Electric / Bounce VR stack](body-electric-bounce-vr-stack.md).)

## The nervous system: hardware, integrated

What made it feel like *jamming* and not *computing* was that the signal ran through real bodies and
real devices, fused live:

- **Sound & control:** MIDI everywhere; Max/MSP as the brain.
- **Video:** QuickTime **RTP** streams over the network — the thing NATO turned into an instrument.
- **VR & motion:** **DataGlove**, **Body Suit**, VPL **EyePhones**, **Polhemus**, **Ascension Flock of
  Birds**, **Spaceball**, and the **Convolvotron** for real-time 3D spatialized audio; **SGI** boxes
  rendering with the **Isaac** engine.
- **Transport:** **UDP over Ethernet** tying it all into one re-patchable, running whole.

One nervous system, many senses — and the patch on screen was the conductor.

## The culture

It was exclusive on purpose. NATO was distributed through outfits like **fiftyfifty.org**; NN was
invited to **Barcelona** more than once; licenses came at contentious fees and could be revoked if you
criticized the software in public. The mystique *was* the marketing. Around the edges sat the adjacent
scenes that shared the DNA — **Csound** and procedural music (BT's all-Csound *This Binary Universe*),
the **microsound**/glitch world ([Kim Cascone](../kim-cascone/README.md)), the **STEIM** hardware-hacker
ethos. Small, international, a little cultish, and absolutely certain it was early to something big.

## Why it belongs in the Repo Show

This is the Repo Show's ancestor. **Net jamming** — many people, many machines, editing and performing a
live shared thing across the network, competing and cooperating, every run public — is exactly what a
**repo jam** is, with git commits where the RTP streams used to be. The scene proved the feeling was
real; the tooling just wasn't durable or shareable yet. That's the gap [Rebounce](../../repo-shows/rebounce/README.md)
and the whole show set out to close.

## Sources & to-verify

- NN / NATO: [Nato.0+55+3d (Wikipedia)](https://en.wikipedia.org/wiki/Nato.0%2B55%2B3d) ·
  [Netochka Nezvanova (Wikipedia)](https://en.wikipedia.org/wiki/Netochka_Nezvanova_(author)) ·
  [Salon 2002](https://www.salon.com/2002/03/01/netochka/) ·
  [Rhizome anthology — m9ndfukc.0+99](https://anthology.rhizome.org/m9ndfukc-0-99) ·
  [nettime](https://www.nettime.org/)
- NATO on El Capitan (video): https://www.youtube.com/watch?v=X0kQcnetR9M ·
  Bornstein NATO write-up: http://www.bootsquad.com/old_site/nato/nato00.html
- Image/ine & STEIM: https://image-ine.org/ · https://v2.nl/archive/works/image-ine ·
  https://steim.org/ · Steina (Vimeo) https://vimeo.com/41196405
- Bounce / Body Electric: [1999 Jaron↔Don email + sources](body-electric-1999-jaron-email.md) ·
  [VR stack](body-electric-bounce-vr-stack.md)
- Key HN threads (Don): Max/MSP, Csound, Image/ine 33668198 — quotes here (the "fragile," the VJ
  interview, the "prelude to the future") are transcribed from those threads; **confirm exact wording
  and attribution before airing.**

*Status: firsthand scene-painting — true to the feeling and grounded in the tools and hardware; treat
specific dates, licensing details, and quoted lines as pointers to confirm on air with the people who
were there.*
