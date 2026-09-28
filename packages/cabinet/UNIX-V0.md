# UNIX v0 on the cabinet

PDP-7 UNIX (Thompson and Ritchie, 1969), as rebuilt by the
[pdp7-unix](https://github.com/DoctorWkt/pdp7-unix) project, boots on the cabinet from an emulated
RB09 fixed-head disk. From the paper-tape bootstrap to `login:` takes 1.25 million cycles, about
60 ms in node. Then ken logs in, and `ls`, `cat`, `cp`, `date` and the rest run. Files written to
the platter are still there after a reboot.

**Run it in the browser:** [hyperties.org/cabinet/unix/](https://hyperties.org/cabinet/unix/), the
machine alone, or the [UNIX v0 article](https://hyperties.org/databases/pixie/unix-v0/) with the
machine in it. Log in as `ken`, password `ken`, in lower case. **Demo** logs in and looks around.

```
login: ken
password: ken
@ date
Thu Jan 01 1970 00:00:31
@ ls system
..
adm
...
```

## What it took

- **The RB09**, [src/plugins/rb09.ts](src/plugins/rb09.ts), is a port of Open SIMH
  `PDP18B/pdp18b_rb.c`. It covers:
  - device 71, with the six Bell Labs mnemonics (`dscs dslw dslm dsld dsls dssf`) and `dsrs`;
  - BCD track and sector addresses, with ILA on a bad digit;
  - rotational latency from the cycle count, and a burst transfer when the sector comes round;
  - DONE and ERR interrupts, and write lock per ten tracks.
  
  The platter is 200 × 80 × 64 = 1,024,000 words. It is stored in SIMH's attach format, one
  little-endian int32 per word, so `image.fs` moves between SIMH and the cabinet unchanged.
- **HRI read-in that jumps.** `readInAndGo` is SIMH's `load boot.rim 010000`: it reads the tape in,
  then obeys the channel-7 word. For Phil Budne's bootstrap, that word is a JMP to 010000.
- **The keyboard in SIMH's `set tti unix` mode**: 7 bits with mark parity, CR and LF swapped, ESC
  sent as ALT MODE (0375), and half duplex, so the paper shows what was typed, as on a KSR-33.
- Everything else was already on the cabinet for SYMELEC and DUEL: the CPU with EAE, the clock
  counting in location 7, the teletype, the paper tape reader, and the interrupt chain.

The Graphic-2 display is not plugged in. Its IOTs do nothing, so the kernel's display code finds no
flags and stays idle. `ttt`, `display` and the other Graphic-2 programs will need it.

## Running it

```sh
cd packages/cabinet && npm test
```

The platter and the bootstrap are committed, gzipped, in [tapes/unixv0/](tapes/unixv0/README.md),
with where they came from and how to rebuild them from pdp7-unix. The web build runs on a server
from a git checkout, so it needs them there, not a Perl toolchain.

From code:

```ts
import { bootUnixV0, parseRbImage } from "@wwsff/cabinet";
const u = bootUnixV0({ image: parseRbImage(imageFs), bootTape: bootRim, onPaper: (c) => term.write(c) });
u.runUntil("login: ");
u.type("ken\r");
```

`u.disk.dirty` says the platter changed; `rbImageBytes(u.disk.image)` saves it.

## Next

- The platter in IndexedDB, and **Save disk** and **Load disk** buttons that read and write SIMH's
  format. Today a page keeps its writes across reboots until it reloads.
- **The JK09**, sn 129's disk. See below. It would sit beside the RB09 as a second plugin, so the
  cabinet can boot either Bell Labs' kernel or the Living Computer Museum's.
- The Graphic-2, for `ttt` and `display`. It is Bell Labs' display, not a 340. SIMH's
  `PDP18B/pdp18b_g2tty.c` only goes as far as a telnet text terminal, the console keyboard and
  its character output (G2IN, G2OUT); the vector display itself is not in SIMH.
- The display-buffer swap and shared segments, as planned in
  [DESIGN.md](DESIGN.md#the-application-layer--packagespixie-separate-module).
- B: `bi.s`, `bl.s` and Robert Swierczek's rebuilt compiler are on the image. Run a B program
  under the cabinet's trace.

## sn 129, the JK09, and who to ask

The Living Computer Museum ran UNIX v0 on a real PDP-7, serial 129. Boeing had used the machine
with an SDS-930 and a Type 340; Fred Yearian bought it at Boeing Surplus in 1979 for $500. The
museum's [blog of 1 November 2019](https://web.archive.org/web/20240424192104/https://livingcomputers.org/Blog/Restoring-UNIX-v0-on-a-PDP-7-A-look-behind-the-sce.aspx)
says how. sn 129 has no RB09, so Jeff Kaylin built a disk emulator, the **JK09**. It is modelled on
the RB09 and hooks into a custom DMA modification that Boeing had installed. Josh Dersch wrote a
new UNIX v0 driver for it, "likely the first new driver for UNIX Version 0 in the last 45 years".
It first booted on Monday 28 October 2019, and the first login was `dmr`. The JK09 and its driver
are not in the public pdp7-unix tree; Josh's commits there, from 2016, are his OCR of the kernel.

The museum closed in 2020 and for good in June 2024. Christie's sold part of the collection
online, 23 August to 12 September 2024. sn 129 went to the [Interim Computer Museum](https://icm.museum/) in Tukwila, where it is
being restored again
([ICM blog, "Boeing's PDP-7a"](https://icm.museum/blog/?p=352), September 2025). The ICM's page
says of it: "an emulated drum-like memory which was made compatible with UNICS (UNIX) Version 0
by Josh Dersch. The drum-like memory hardware was developed by Jeff Kaylin based on the DEC RB09."
[soemtron.org](https://www.soemtron.org/pdp7no129systeminfo.html) keeps its record: shipped to
Boeing in August 1966 with 8K, EAE, a 340 with the 342 character generator and the 347
subroutine interface, and a 370 light pen.

That options list is the cabinet. SYMELEC, DUEL and the AM radio all assume exactly that machine,
and now so does UNIX. So the ask goes to the ICM and SDF, to the people who did the 2019 work, and
to the pdp7-unix list.

### What sn 129 looks like now

SDF posted a photo of sn 129 at the ICM on 28 September 2026
([x.com/sdf_pubnix/status/2104408167606284621](https://x.com/sdf_pubnix/status/2104408167606284621)):
"Pairing a charles and ray eames chair with Boeing's DEC PDP-7 is a practical aesthetic choice."
Left to right it shows:

- the **Type 340**, its round screen at desk height in its own blue cabinet;
- a **Teletype** on its stand, paper running to the floor;
- the processor bays, with the paper tape reader high in the right-hand bay;
- the console with its switch rows, on a white desk wing with a placard and a photo on it;
- an Eames shell chair in front.

In the open bay above the console sit modern circuit boards with a green LED, where a 1966 machine
would have none. That is probably the JK09; ask. The Christie's photos we found show the Allen
collection's machines but not the 340, so this photo is the one to cite for the display.

### Who to ask

The Living Computer Museum was Paul Allen's, and it is gone, so the ask goes to its people.

| Who | Why | Route |
|---|---|---|
| **SDF and the Interim Computer Museum** | They have sn 129 now. The blog and the photo are theirs. | [icm.museum](https://icm.museum/), [@sdf_pubnix](https://x.com/sdf_pubnix) |
| **Jeff Kaylin** | Built the JK09 at the LCM | via the ICM |
| **Josh Dersch** | Wrote the JK09 driver for UNIX v0. Also wrote the LCM's Alto, Star and Imlac emulators (ContrAlto, Darkstar, sImlac), so an emulator author himself. | GitHub; via the ICM |
| **Stephen Jones** | The LCM's engineering manager in 2019, at the pickup from Fred's house. Check whether he is SDF's Stephen M. Jones. | via SDF |
| **Cynde Moya** | On the 2018 pickup crew | via the ICM |
| **Fred Yearian** | Owned sn 129 from 1979; still sends soemtron.org news and photos | via [soemtron.org](https://www.soemtron.org/sendsoemtron.html) |
| **Aaron Alcorn** | The LCM's curator (Wikipedia) | CHM or LinkedIn |
| **Marc Weber**, Computer History Museum | Don knows him; he was on the January 2023 CS547 thread. CHM has its own PDP-7 in storage, according to the LCM's 2019 blog. | direct |
| **Marc Etkind**, CHM | President and CEO since May 2025 | through Marc Weber |
| **Ben Shneiderman** | Offered his "good connections to the Computer History Museum and Charles Babbage Institute" (January 2022) | direct |

The CHM question is its own letter: is its PDP-7 complete, and does it have a 340? A second
machine to record for the AM radio, and a second witness for the display, would be worth a lot.

### Draft letter (not sent)

> **To:** the Interim Computer Museum; Jeff Kaylin, Josh Dersch, Stephen Jones and Fred Yearian.
> **Cc:** the pdp7-unix list (Warren Toomey, Phil Budne) and Lars Brinkhoff.
>
> **Subject:** sn 129's disk, in a browser: may we have the image, and would you like the
> emulator?
>
> Hello,
>
> I'm Don Hopkins. We've been building an emulator of the PDP-7 with a Type 340, called the
> cabinet. It is TypeScript, it runs in a web page or on a server, and it ports Open SIMH's PDP-7 and 340 device
> by device, with SIMH as the oracle. It already runs Heinz Lemke's 1972 PIXIE/SYMELEC drawing
> system from its listing, with the light pen, DUEL (1968) from the Oslo paper tape, and DEC's 1964
> Type 370 light pen test, with a virtual light pen, a demo, and tests that caught bugs of our own. This week
> it gained an RB09 and boots PDP-7 UNIX from the pdp7-unix image: login, ls, cp and date, files
> kept across reboots, 60 ms from the bootstrap tape to `login:`.
>
> sn 129 is the machine we emulate: 8K, EAE, the 340 with the 342 and 347, and the 370 pen. We
> have three things to ask, and one to offer.
>
> 1. **The disk image.** Could we have a copy of what was on the JK09 when UNIX ran on sn 129,
>    whatever state it was left in? We would keep it separate and credited, and publish it only
>    as you say.
> 2. **The JK09 itself.** Its IOTs, device code, status bits and timing, and how it differs from
>    the RB09. And Josh's driver, if it can be shared. With those, the cabinet could boot the
>    kernel that actually ran at the museum, not only the Bell Labs one, and a JK09 plugin would
>    sit beside our RB09. If SIMH has never had a JK09, we would offer one to SIMH too.
> 3. **Anything else from sn 129's software**: the Munching Squares, Spirograph and Life demos
>    whose videos survive, and any tapes.
>
> The offer: the emulator, for the museum to use as it likes. For example, a web twin of sn 129
> that visitors can log in to while the real machine is being restored. Or a way to check a tape
> or a disk image before it goes near the iron. It is free software, and we'd gladly change it to
> fit.
>
> And a live-coding system for the same machine, in the browser. Mitch Bradley's PDP-7 Forth
> already runs in the page, with turtle graphics on the 340: type `4 0 DO 200 FD 90 RT LOOP` at the
> teletype and watch it draw (https://hyperties.org/cabinet/forth/). UNIX runs the same way
> (https://hyperties.org/cabinet/unix/). Our TypeScript PDP-7 assembler runs in the page too, and
> the memory view shows each word beside the source line that made it. Next is a LIVE CODING
> panel: edit Forth's kernel or any program's source, rebuild, and rerun it in the running machine,
> with the trace stepping through the source. Whatever works in the page can then be punched to
> tape for sn 129.
>
> Our goal for the look is photorealistic, a skeuomorphic view built from photographs of your
> machine. If you could take a series of photos framed so that we can rebuild it as a 3D model in
> Blender and as a 2D interface in HTML, that would help enormously:
>
> - **Straight-on views** of each cabinet, the console, the 340 and the Teletype, from the front
>   at the height of their middles, with a tape measure or ruler in the shot. These become the 2D
>   page, so the closer to flat and square the better.
> - **The console panel close up**, square to the lens and sharp enough to read the labels, once
>   with the lamps dark and once running, so we can cut out every lamp and switch.
> - **An orbit for photogrammetry**: 50 to 100 overlapping shots walking round the whole machine
>   at three heights (knee, chest and overhead). Fixed exposure, soft even light, no flash.
> - **Details**: the Teletype keyboard from above, the paper tape reader, the light pen and its
>   cable, the 340's screen and bezel, and the green-LED boards in the bay above the console.
> - **A few measurements**: cabinet height, width and depth, and the desk wing's height.
>
> With the model, we would like to add a 3D animated Heinz Lemke, built with my character
> animation library from The Sims 1, sitting at the machine to work the Teletype and the light
> pen. It would show how people physically used it, which no emulator shows on its own.
>
> We would also like to work with you on the rest of the machine's senses:
>
> - **The phosphor.** Lars's GLSL crt-simulation of the P7 tube, driven by the 340's real segment
>   stream.
> - **The AM radio**, so the emulated machine plays munching tunes the way sn 129 did for a radio
>   at the museum. Our proposal and the few recordings we would ask for are in AM-RADIO.md.
> - **The panel lights, the teletype's sound, and the paper tape reader**, whatever you have
>   measured or recorded. A short video of the panel while it runs would give us the lamps'
>   flicker, and a recording of the Teletype and the reader would give us their sound.
>
> Everything is in git: https://github.com/SimHacker/WillWrightShowForFood (the emulator is in
> `packages/cabinet`, and it runs in the page at hyperties.org). Thank you for bringing sn 129
> back, twice.
>
> Don Hopkins

Before sending:

- Deploy hyperties.org first, so the link in the letter shows the UNIX and AM radio pages.
- Find current addresses. The ICM's contact page is on [icm.museum](https://icm.museum/). The
  pdp7-unix list is at the TUHS mailing lists.
- Decide whether the letter goes as one email or one message per person.

Nothing has been sent.
