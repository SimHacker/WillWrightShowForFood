# Deskset flame — DSHR, Don, Weiser, input focus

**DSHR source:** [`sources/1990-10-sun-deskset-flame.md`](sources/1990-10-sun-deskset-flame.md)  
**Don source:** *The UNIX-HATERS Handbook* — Chapter 7, *The X-Windows Disaster* (author)  
**Preserved by Don:** [unix-haters catalog — Deskset Environment](https://www.donhopkins.com/home/catalog/unix-haters/slowlaris/deskset.html)

---

## THE FLAME

**From:** `dshr@Eng` (David Rosenthal)  
**Newsgroups:** `sun.open-windows`  
**Subject:** Re: Deskset environment  
**Date:** 18 Oct 90 17:02:39 GMT

Nanette Simpson had replied with the standard Deskset demo script — Calendar template, mail drop on CM, GUIDE on the spot. David's reply (copied to openwindows-interest):

> Thank you, but you have completely missed the point. I don't want to show people how whizzy the standard default desktop environment is. That's your job. I want to give a talk about a quite different subject. I merely want to *use* the desktop environment to achieve my own ends. And as soon as I try to actually *use* it for something instead of merely showing off the glitz, it falls to pieces in my hands. Unfortunately, this is becoming all too common in Sun products these days, because we no longer *use* the things we build for anything but whizzy demos. Have you ever actually tried to *use* the desktop for anything? Like, say, printing a PostScript file? The answer has to be no — because dropping a PostScript file on the print tool doesn't work. Or binding a shell command to a pattern? Again no, because doing so depends on undocumented features of /etc/filetype. Even trying to create a new icon from the standard set causes the icon editor to dump core. I'm not joking when I say that I've been filing a bug report every couple of hours of trying to use the desktop. Its this kind of fragility that shows me that I'm treading on fresh snow. No-one else has walked this way. And that is a truly sad commentary on the state of Sun — no-one has been this way because no-one believes that there's anything worth doing over this way. The reason Unix was such an advance over previous operating systems was that you could customize your environment in arbitrary ways. With just a few shell scripts, for example. Its just like the cold war — in our anxiety to compete with the enemy we've ended up losing the things that made our way of life worth defending in the first place. Like the freedom to disagree with the authorities.

On user testing ("admins don't customize"):

> Testing whether people actually do customize their environment is beside the point. Of course they don't. In order to do it, I have to write C code using bizarre features of Xview, exercise all my shell wizardry, and dredge up undocumented features of the system from the source. And you're suprised when admins can't do this? I don't expect admins to do it. But I do expect ISVs and Sun's SEs to be able to do it, and right now they can't.

### PS — Roy Lichtenstein on your bedroom wall

> PS — I notice that someone filed a bug today pointing out that even your example of dropping a mail message on CM doesn't work if CM is closed. That's a symptom of the kind of arrogance that all the deskset tools seem to show — they're so whizzy and important that they deserve acres of screen real estate. **Why can't they just shut up and do their job efficiently and inconspicuously?** Why do they have to shove their bells and whistles in my face all the time?
>
> They're like 50's American cars — huge and covered with fins. What I want is more like a BMW, small, efficient, elegant and understated. Your focus on the whizzy demos may look great at trade shows, but who wants to have their tools screaming at them for attention all the time? **It's like having a Roy Lichtenstein painting on your bedroom wall.**

**Leak:** forwarded to **unix-haters**; cited in Don's *X-Windows Disaster* chapter. DSHR wrote **ICCCM** and co-authored **NeWS** — this is the author of the treaty torching the demo culture from inside Sun.

---

## Don — same era, same target, louder volume

Don wrote the **X-Windows Disaster** chapter for *The UNIX-HATERS Handbook* (Simson Garfinkel & Daniel Weise, IDG 1994). Same OpenWindows / Deskset / Motif / ICCCM zoo DSHR was fighting from inside Sun.

| Beat | Detail |
|------|--------|
| **Deskset whizzy** | Aligns with DSHR's BMW vs fins — tools screaming for attention |
| **ICCCM / I39L** | "Ice Cubed" treaty fixing what X forgot; cut/paste never works |
| **Motif self-abuse kit** | Moscow-airport runway borders; 17th color crashes $150k display |
| **NeWS counterfactual** | Send code not commands — what the web later approximated with AJAX |
| **File Manager bomb** | Core dumps shown as cute red bomb icons; **double-click opens editor on core** |
| **Drag bomb → debugger** | Pumps entire core (huge zero gap) through server into debugger — swap explodes, bigger core, file system full |

Medium republication: [The X-Windows Disaster](https://donhopkins.medium.com/the-x-windows-disaster-128d398ebd47)  
Unix-haters tree: [ls x-windows](http://www.art.net/~hopkins/Don/unix-haters/ls-x-windows.html) — `disaster`, `i39l`, `xbugtool`, `motif.angst`

HN threads where Don reprises this material: [22608295](https://news.ycombinator.com/item?id=22608295) (NsCDE), [21381226](https://news.ycombinator.com/item?id=21381226) (PizzaTool / xbugtool), [31820891](https://news.ycombinator.com/item?id=31820891) (NFS + OLWM grabs)

---

## XBugTool — input focus trap (Bug #1059974)

**XBugTool** — SunView BugTool run through an AWK script to become XView; the "monkey on the back of all Sun engineers." Required for filing bugs. Don's authentic report filed **against the X11/NeWS server** because XBugTool would not accept a bug against itself.

**Synopsis:** *I have no mouse motion and my input focus is stuck in xbugtool!!!*  
**Keywords:** *I have no mouth and I must scream* [Harlan Ellison]

What happened:

1. Fresh server; jets + cmdtool; launch xbugtool from a jet.
2. XBugTool "throbbed and grunted," busy window up — **no mouse motion** anywhere, only clicks.
3. **Input focus stuck in xbugtool** — click cmdtool, focus snaps back on button release (not click-to-type).
4. Scrolling lists → elmer bug server freaks → **X11 input queue lock** → whole window system frozen for minutes.
5. XBugTool core dumps and exits ("DWIM").

Mechanism (related): **OLWM server grab** while root menu displayed — queues all client output, blocks NeWS/X integration; documented in same era as bug #1059370.

Don's xbugtool rant: [XBUGTOOL horror stories](http://www.art.net/~hopkins/Don/unix-haters/x-windows/xbugtool.html)

**Show tie-in:** ICCCM selection/focus is one treaty layer; **focus management + server grab + input queue lock** is the user-visible hell underneath. Ted's invisible clipboard meets DSHR's invisible focus prison.

---

## Calm computing parallel

Don draws a parallel between DSHR's *"shut up and do their job inconspicuously"* and **Mark Weiser** ubiquitous/calm computing — tools that recede. Weiser named ubicomp after PKD's *Ubik* (inverted to calm tech).

**At time of flame (1990):** Mark Weiser was **alive** and married to **Vickie Reich** (later Victoria Reich — LOCKSS co-founder with David; Mark's widow).

---

## Publish with consent

| Person | Status |
|--------|--------|
| **Mark Weiser** | d. 1999 — memorial / historical context OK with care |
| **Vickie / Victoria Reich** | **Ask David** what she'd like published; respect wishes |
| **David Rosenthal** | Author of flame; wrote ICCCM — can respond on air |
| **Don Hopkins** | Unix-Haters chapter author; Sun engineer contemporaneous with DSHR |

Do **not** spring the marriage/widow thread in public material without David's and Vickie's OK. Don will ask.

---

## Show beats

1. **DSHR reads the Lichtenstein PS** — cold war paragraph optional; Don reads matching *X-Windows Disaster* (File Manager / bomb).
2. **Calm computing** — Weiser pre-echo; Victoria Reich / LOCKSS bridge (with consent).
3. **Focus vs selection** — PRIMARY paste vs focus stuck in xbugtool; who owns the keyboard?
4. **Server grab** — OLWM root menu vs NeWS TNT menus that pin without flicker (Don implemented those).
5. **Double-click the core dump** — whizzy demo vs survivable desktop.

↑ [00-START-HERE](00-START-HERE.md)
