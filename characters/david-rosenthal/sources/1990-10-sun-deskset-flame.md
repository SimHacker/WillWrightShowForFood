# David Rosenthal — Sun Deskset environment flame (18 Oct 1990)

**From:** `dshr@Eng` (David Rosenthal)
**Newsgroups:** `sun.open-windows`
**Subject:** Re: Deskset environment
**Date:** 18 Oct 90 17:02:39 GMT

**Preserved by:** Don Hopkins — [unix-haters catalog: Deskset Environment](https://www.donhopkins.com/home/catalog/unix-haters/slowlaris/deskset.html)
**Leak:** forwarded to **unix-haters** mailing list (circa 1991); cited in *The UNIX-Haters Handbook* X-Windows chapter and recurring HN threads ([example 2024](https://news.ycombinator.com/item?id=38768724), [2025 CDE thread](https://news.ycombinator.com/item?id=44741539)).

**Context:** DSHR co-authored **NeWS** with Gosling and wrote **ICCCM** for X11. This mail is an *internal Sun* critique of OpenWindows **Deskset** — whizzy trade-show demos vs tools you can actually **use** to give a talk on another subject.

## The Roy Lichtenstein PS (calm computing ante litteram)

> PS - I notice that someone filed a bug today pointing out that even your example of dropping a mail message on CM doesn't work if CM is closed. That's a symptom of the kind of arrogance that all the deskset tools seem to show - they're so whizzy and important that they deserve acres of screen real estate. **Why can't they just shut up and do their job efficiently and inconspicuously?** Why do they have to shove their bells and whistles in my face all the time?
>
> They're like 50's American cars - huge and covered with fins. What I want is more like a BMW, small, efficient, elegant and understated. Your focus on the whizzy demos may look great at trade shows, but who wants to have their tools screaming at them for attention all the time? **It's like having a Roy Lichtenstein painting on your bedroom wall.**

**Show bridge:** Mark Weiser's **calm / ubiquitous computing** — tools that recede. DSHR's LOCKSS co-founder **Victoria Reich** was Mark Weiser's widow. Not a quote from Mark; a **pre-echo** Don can raise gently with David's consent.

## Earlier body — customization vs cold-war deskset

> I don't want to show people how whizzy the standard default desktop environment is. That's your job. I want to give a talk about a quite different subject. I merely want to *use* the desktop environment to achieve my own ends. And as soon as I try to actually *use* it for something instead of merely showing off the glitz, it falls to pieces in my hands.

> The reason Unix was such an advance over previous operating systems was that you could customize your environment in arbitrary ways. With just a few shell scripts, for example. Its just like the cold war - in our anxiety to compete with the enemy we've ended up losing the things that made our way of life worth defending in the first place. Like the freedom to disagree with the authorities.

Concrete failures he filed bugs for: PostScript-on-print-tool drop, `/etc/filetype` shell binding, icon editor core dump.

## Pair with ICCCM thread

| Deskset flame | ICCCM / selection |
|---------------|-------------------|
| Whizzy demos vs **using** the environment | Spec completeness vs **copying a string** |
| Drag-drop mail on CM (must be open) | Selection owner must respond to `TARGETS` |
| Fins and Lichtenstein | Atoms and `SelectionNotify` ambiguity |
| BMW / calm | Primary selection (middle-click) as **visible** gesture? |

## Repo Show beats

1. DSHR: intended audience? regret leak? still true of modern desktops?
2. Ted Nelson: whizzy UI vs **documents** — same enemy, different angle?
3. Don: NeWS/TNT team lived both — deskset politics + ICCCM cage ([`1991-09-news-tnt-icccm-death-match.md`](../../don-hopkins/sources/1991-09-news-tnt-icccm-death-match.md))

## See also

- [`conrad-parker-icccm-rant-2001.md`](conrad-parker-icccm-rant-2001.md)
- [`../selection-clipboard-lineage.md`](../selection-clipboard-lineage.md)
- [`../window-systems-lineage.md`](../window-systems-lineage.md)
