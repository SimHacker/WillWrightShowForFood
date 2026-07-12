# Conrad Parker — ICCCM selection mechanism rant (Jul 2001)

**Source:** leaked to `slug-chat` after Jeff Waugh told Sean Neakums to "Go read the ICCCM. Come back when you're done crying."
**Canonical copy:** [porridgewithraisins/x11cp `rant`](https://github.com/porridgewithraisins/x11cp/blob/main/rant)
**Author of ICCCM:** David S. H. Rosenthal — the implementor's pain vs the spec author's intent.

## Why this matters for the show

Parker's flame is the **implementor's-eye view** of what DSHR standardized in ICCCM (~1988): Atoms for everything, ambiguous `SelectionNotify` typing, incremental transfer, `XA_SECONDARY`, `TARGETS` queries nobody uses, `HOSTNAME`/`IP_ADDRESS`/`USER` via random selection owner. The rant circulates because **every X11 programmer hits the same wall** — copy text should be trivial; ICCCM makes it a medieval rack.

Pair with:
- Ted Nelson — **invisible clipboard is evil** (visible connections, not carrier pigeons)
- DSHR — **why** the spec looks like this; what X10/Andrew/NeWS already had; deskset whizzy vs calm tools

## Excerpt — the core complaint

> I don't know why I'm working with it, I just wanted to make a useful program. I didn't know what I was getting myself in to. Nobody knows until they try it. And once you start, you're unable to stop. You can't stop, if you stop then you haven't completed it to spec.

> Name one fucking program in the whole world that uses MULTIPLE selections by choice? … And `XA_SECONDARY`? Who the fuck uses the SECONDARY selection? and who actually queries TARGETS? All anyone ever fucking does with the selection is COPY TEXT!!

> The ICCCM is the coding equivalent of the Medieval rack, except its advertised as some kind of X11 swingers party.

## Acronym decode (Parker's version)

| Letter | Parker gloss |
|--------|----------------|
| **I** | Inter- — *internal bleeding* |
| **C** | Client — *see that guy with the limp* |
| **C** | Communications — *overengineered carrier pigeons* |
| **C** | Conventions — *not required, just do ALL OF IT or you SUCK* |
| **M** | Manual — *manual labour, pain* |

## Repo Show beats

1. **Don reads the rant aloud** — DSHR reacts: fair? unfair? what would you cut?
2. **Live demo:** primary selection (middle-click paste) vs clipboard (Ctrl+C) vs secondary — on modern Linux, does anyone still know?
3. **NeWS side:** did PostScript window systems avoid this mess, or trade it for different mess?
4. **Ted:** transclusion vs "share a STRING through twelve Atoms"

## See also

- [`../selection-clipboard-lineage.md`](../selection-clipboard-lineage.md)
- [`../../don-hopkins/sources/1991-09-news-tnt-icccm-death-match.md`](../../don-hopkins/sources/1991-09-news-tnt-icccm-death-match.md)
- [`1990-10-sun-deskset-flame.md`](1990-10-sun-deskset-flame.md) — same author, different target (Deskset whizzy vs calm)
