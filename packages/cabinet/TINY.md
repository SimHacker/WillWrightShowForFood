# tiny: small, complete, and swappable

The cabinet's tiny-* pieces follow one rule: small enough to read in one sitting, complete
enough to use everywhere, and shaped so a bigger version can replace one, or never needs to.
In the other direction, a tiny piece can replace the big design that inspired it.

Richard Gabriel's [Worse is Better](https://www.dreamsongs.com/WorseIsBetter.html) says worse
won by being simple to implement at the cost of being incomplete. Tiny keeps the simplicity and
stays complete.

The worked example is Flite. At CMU, Alan Black and Kevin Lenzo rewrote Edinburgh's Festival
synthesizer (C++ with a Scheme interpreter) as small, fast C, and made it read the same voice
data. The runtime shipped in phones and, commercially, as Cepstral. Voice building stayed in
FestVox, the Scheme tools, which kept improving. Data compatibility let the small engine run in
production while the big one stayed in the workshop. The tiny pieces aim for the same split:
shared formats, so the small and the big version can trade places.

## The ensemble

| piece | what it is | swaps with |
| --- | --- | --- |
| tiny-titan | the Titan end of Wiseman's link ([TINY-TITAN.md](TINY-TITAN.md)) | an Atlas 2 emulator behind `TitanPort` |
| tiny-bus | commands, events, sources and sinks across tab, node and network ([TINY-TITAN.md](TINY-TITAN.md#tiny-bus-the-backplane-between-machines)) | the MicropolisCore command bus design |
| tiny-its | the command language for people, LLMs and PDP-7s ([TINY-ITS.md](TINY-ITS.md)) | ITS DDT, Open Firmware's command line |
| tiny-teco | ITS TECO, enough for Minsky's 1981 UTM ([package](../tiny-teco/README.md)) | full ITS TECO ([FULL-ITS-TECO.md](../tiny-teco/FULL-ITS-TECO.md)) |
| tiny-tag | tags and focus, what pies attach to ([TAGS-AND-PIES.md](TAGS-AND-PIES.md)) | an accessibility tree |
| tiny-pie | Target, Pie, Slice, Item, with callbacks and placement policies ([ROADMAP §9](ROADMAP.md#9-the-first-pie-target-pie-slice-item-in-a-news-11-skin)) | jquery-pie, the Unity pie menus |
| tiny-cursor | virtual cursors, grab, warp, park, one per pen | the MicropolisCore virtual cursor design |
| tiny-win | windows: frame, focus, stacking, the definition window | a NeWS-style window manager |
| tiny-tab | tabs and the pages behind them, one bus reach | browser tabs, HyperTIES frames |
| tiny-tape | the recorder: events by machine cycle, replayed exactly | a full session store |

↑ [README](README.md) · [DESIGN](DESIGN.md) · [TINY-TITAN](TINY-TITAN.md) · [TINY-ITS](TINY-ITS.md)
