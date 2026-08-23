# Slower phosphor, not faster refresh — quieter computing (HN, Aug 2026)

**Thread:** [I Dream of Quieter Computing](https://news.ycombinator.com/item?id=49405682) — [Henry From Online](https://henry.codes/writing/i-dream-of-quieter-computing/) (Aug 2026). A small-web manifesto: forested internet, hand-made webrings, hackable hardware, personal computers made personal again — not nostalgia, a build-forward dream.

**Parent comment:** [mrob](https://news.ycombinator.com/item?id=49406990), replying to Henry's "glass and refresh rates" line — argues the *opposite* hardware fix: higher refresh rate is metaphorically *quieter* because discrete frames introduce latency, phantom-array strobe, and sample-and-hold blur; a tool that disappears into the body needs **at least 1000 Hz**.

**Don's reply:** [49407686](https://news.ycombinator.com/item?id=49407686) — two sentences and a receipt.

---

## The comment (verbatim)

> We don't need faster refresh rates, we need slower phosphor.
>
> https://youtu.be/1EWQYAfuMYw?t=832

---

## The riff

Three answers to "quieter computing" sit in one thread:

| Voice | Prescription | Axis |
|-------|--------------|------|
| [Henry](https://henry.codes/writing/i-dream-of-quieter-computing/) | Smaller web, handmade sites, hackable hardware | **Culture** — less feed, more forest |
| [mrob](https://news.ycombinator.com/item?id=49406990) | 1000 Hz displays | **Frame rate** — kill strobe and sample-and-hold |
| **Don** | Slower phosphor | **Persistence** — let the beam leave a trail |

Henry and mrob are not wrong; they are optimizing different quietnesses. Henry wants less *social* noise. mrob wants less *temporal* quantization — the display as a strobe rather than a continuous field. Don's correction names a third variable mrob's frame-rate math leaves out: **afterglow**.

Modern LCD/OLED panels chase Hz because they have almost no persistence. Each frame is a snapshot; motion blur and phantom arrays are the price of holding a still image between refreshes. Old radar and scope tubes — and the [PDP-1](https://www.computerhistory.org/revolution/digital-logic/12/261) display at the [Computer History Museum](https://www.computerhistory.org/) — worked the other way: the **P7 phosphor** flashes blue-white on impact, then decays through yellow-green over hundreds of milliseconds. The image *integrates* in time. [Spacewar!](https://www.masswerk.at/spacewar/) ships and exhaust leave comet trails not because the game draws motion blur, but because the tube remembers.

That is the link Don pasted: [CuriousMarc — Lyle Bickley explains the PDP-1](https://www.youtube.com/watch?v=1EWQYAfuMYw) at **13:52** ([`?t=832`](https://youtu.be/1EWQYAfuMYw?t=832)), loading and playing the original [Steve Russell](https://en.wikipedia.org/wiki/Spacewar!) game. Lyle calls out the **P7** explicitly (~7:47 in the same video): short-timescale white flash, long-timescale yellow-green persistence — a radar tube repurposed as the first bitmap game monitor. The cone hoods on old radar scopes existed to make the afterglow readable; [Star Trek's](https://en.wikipedia.org/wiki/Star_Trek:_The_Original_Series) bridge displays were the same callback.

So "quieter" can mean: fewer frames fighting your eye (**mrob**), or fewer frames *needed* because the phosphor smooths between them (**Don**). Persistence is temporal low-pass filtering built into the display chemistry — the opposite of glass-and-Hz modernism. [Norbert Landsteiner's browser PDP-1](https://www.masswerk.at/spacewar/) and the [FPG-1 Verilog replica](https://github.com/hrvach/fpg1) still cheat with software trails; the real tube did it for free.

Thread neighbors worth the same quiet:

- [lproven](https://news.ycombinator.com/item?id=49407429) → [Ascetic Computing](https://ratfactor.com/ascetic-computing) — adjacent manifesto, different monastery
- [benrutter](https://news.ycombinator.com/item?id=49406210) → [What is the small web?](https://ar.al/2020/08/07/what-is-the-small-web/) — Henry's forest, named
- [walrus01](https://news.ycombinator.com/item?id=49407273) — serious talk moved to Signal; shitposting stays on the ruins

---

## Show hooks

| Beat | Guest / prop |
|------|----------------|
| Play Spacewar on the restored PDP-1 (or Landsteiner sim) while Henry's essay scrolls | [Lyle Bickley](https://www.youtube.com/watch?v=1EWQYAfuMYw) / CHM |
| P7 vs sample-and-hold — draw the triangle: persistence × refresh × cognitive load | Don + display historian |
| "Artisan internet" vs "artisan phosphor" — Henry's small web meets Don's radar tube | Calm-tech episode — [`connectedtv-touch-tuning-finger-pies.md`](connectedtv-touch-tuning-finger-pies.md) |
| mrob's 1000 Hz vs Don's slower phosphor — live demo with motion test patterns | Audience vote |

---

## Repo context

| File | Why |
|------|-----|
| [`connectedtv-touch-tuning-finger-pies.md`](connectedtv-touch-tuning-finger-pies.md) | Calm technology in the dark — same "disappearing into the body" axis |
| [`../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md`](../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md) | Early interactive graphics lineage (PDP-7 PIXIE → pie menus) |
| [`../lars-brinkhoff/ideas.md`](../lars-brinkhoff/ideas.md) | PDP restoration orbit — Landsteiner, CHM, FPGA Spacewar |
| [`hypercard-network-hyperlook-hn-2026.md`](hypercard-network-hyperlook-hn-2026.md) | Sibling HN archive — handmade microworlds vs feed troughs |

## External receipts

| What | URL |
|------|-----|
| HN story | https://news.ycombinator.com/item?id=49405682 |
| Don's comment | https://news.ycombinator.com/item?id=49407686 |
| Henry's essay | https://henry.codes/writing/i-dream-of-quieter-computing/ |
| CuriousMarc PDP-1 tour | https://www.youtube.com/watch?v=1EWQYAfuMYw |
| Phosphor moment (Spacewar load) | https://youtu.be/1EWQYAfuMYw?t=832 |
| P7 phosphor callout (~7:47) | https://youtu.be/1EWQYAfuMYw?t=467 |
| Browser Spacewar | https://www.masswerk.at/spacewar/ |
| Inside Spacewar! (Landsteiner) | https://masswerk.at/spacewar/inside/ |
| FPG-1 Verilog PDP-1 | https://github.com/hrvach/fpg1 |
| Computer History Museum | https://www.computerhistory.org/ |
| Steven Levy — *Hackers* (Spacewar chapter) | https://en.wikipedia.org/wiki/Hackers:_Heroes_of_the_Computer_Revolution |
