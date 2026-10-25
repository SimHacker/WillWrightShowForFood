# Display devices: memory in, pixels, tiles or vectors out

A display device is a plug-in on the backplane that reads a range of some machine's memory through a
read-only [core link](CORE-LINKS.md) and turns it into something to look at: compact RGBA, indexed
colour, tiles from an atlas, or vectors. The machine doesn't know it's being watched. Each device is
configured for a size, a layout, a shape and a view, and several can read the same memory at once.
Design only, apart from the Type 340, which runs.

## Why core links

A video circuit is DMA: it reads memory the CPU wrote and paints from it. Modelling a display as a
read-only link means the same machinery serves the real display (the Apple's text page, the 340's
display list) and any number of invented ones (a heat map, a hex view drawn as tiles, the Apple's
memory as a picture), with the codec doing the conversion ([CORE-LINKS.md](CORE-LINKS.md#codecs-what-the-words-mean-on-each-side)).
A display never writes; the link is read-only, so a display can't disturb the program.

## Outputs

| Output | Good for | Example |
|---|---|---|
| **RGBA** | bitmaps that need their exact colours | Apple ][ hi-res with NTSC artefact colour, done once per frame on the GPU |
| **Indexed colour** | small palettes, cheap to recolour | Apple lo-res's sixteen colours; a palette swap as a microPAK does |
| **Tiles** | character and block screens, maps | the Apple text page from a character-set atlas; a SimCity map from its tile atlas |
| **Vectors** | stroke displays | the Type 340's display list as line segments (runs today) |

Tiles go through the tile renderer that draws Micropolis
([`@micropolis/tile-renderer`](https://github.com/SimHacker/MicropolisCore/tree/main/packages/tile-renderer)),
with its optional per-tile function ([tile-functions.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/tile-functions.md)).

## The Apple ][ screens as devices

- **Text, 40 columns**: memory `$400`–`$7FF` in the Apple's interleaved row order. The codec turns
  the interleave into rows; each byte is a tile from a character-set atlas. Characters `$00`–`$3F` are
  inverse and `$40`–`$7F` are `FLASH`: a tile function draws `FLASH` characters as their inverse on a
  duty cycle, the same mechanism as SimCity's power blink, with no copy of the screen.
- **Lo-res**: the same memory, each byte two blocks of sixteen colours; indexed colour.
- **Hi-res**: `$2000`–`$3FFF` (page 1), seven pixels a byte plus a colour-shift bit, interleaved;
  RGBA with a choice of monochrome, simple colour or NTSC artefact colour.
- **80 columns and double hi-res**, through the auxiliary memory bank, when the Apple has it.

Each is the same device type with a different codec and configuration, and microM8's screens could
come in the same way, through its [WebAssembly module](MICROM8.md#proposal-microm8-as-a-webassembly-module-called-directly).

## Configuration

A display device declares, in its cartridge or profile:

- **source**: domain, base address, length, and which bank;
- **codec**: interleave, bits per element, palette, character set;
- **output**: RGBA, indexed, tiles or vectors, at what size;
- **layout and shape**: rows and columns, tile size, aspect, a crop, a scroll, several pages side by
  side, a curved CRT or a flat panel;
- **view**: where it sits in the page or the 3D scene, and at what scale;
- **derivations**: a tile function; a heat map from the [access counters](MICROM8.md#what-wed-offer-back);
  differences from the last frame; the same memory as hex tiles, as a picture, or as a waveform.

## Derived displays

Because a display is just a codec over memory, the instructive ones are free:

- **The memory as a picture**: all 64K of the Apple, or a PDP-7 bank, a pixel per byte or word,
  coloured by value or by what last touched it.
- **Two views of one screen**: the hi-res page as the game shows it, and beside it the bytes that
  made it, linked so pointing at one lights the other.
- **The video chain itself**: the circuitry between memory and NTSC, drawn in 3D and driven by the
  same memory, as Don proposed to Paleotronic in 2018 ([CAUSE-AND-EFFECT.md](CAUSE-AND-EFFECT.md)).

## Order of work

1. A tile display device for the Apple text page, with `FLASH` as a tile function.
2. Lo-res and hi-res as indexed and RGBA devices.
3. The memory-as-a-picture device for any domain, with the heat map.
4. Configuration in cartridges; several devices on one memory.

↑ [README](README.md) · [CORE-LINKS](CORE-LINKS.md) · [MICROM8](MICROM8.md)
