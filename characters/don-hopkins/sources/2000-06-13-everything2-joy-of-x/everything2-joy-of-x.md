# Everything2 — "The Joy of X" (ariels, 13 June 2000)

**Author:** [ariels](https://everything2.com/user/ariels) · **node:** https://everything2.com/node/603014  
**Title:** The Joy of X  
**Type:** idea  
**Date:** 13 June 2000  
**Tags (E2):** X sucks · X11 · Gay Games · XScreenSaver · Somebody Set Us Up · Monty Python

---

Ever wonder why so many bright people are writing all those nifty X GUI, UI, drawing, and graphics libraries? Why not just link against `-lX11 -lXext`? Here's a partial answer. I found it in `hacks/screenhack.h` in JWZ's amazing xscreensaver distribution. The screenhack files are supposed to make writing a simple graphics hack bearable. But why does it have to be so hard?

## Quote — Don Hopkins `.plan` via Jamie Zawinski `screenhack.h`

```c
/* Found in Don Hopkins' .plan file:
 *
 *   The color situation is a total flying circus.  The X approach to
 *   device independence is to treat everything like a MicroVax framebuffer
 *   on acid.  A truely portable X application is required to act like the
 *   persistent customer in the Monty Python ``Cheese Shop'' sketch.  Even
 *   the simplest applications must answer many difficult questions, like:
 *
 *   WHAT IS YOUR DISPLAY?
 *       display = XOpenDisplay("unix:0");
 *   WHAT IS YOUR ROOT?
 *       root = RootWindow(display, DefaultScreen(display));
 *   AND WHAT IS YOUR WINDOW?
 *       win = XCreateSimpleWindow(display, root, 0, 0, 256, 256, 1,
 *                                 BlackPixel(display, DefaultScreen(display)),
 *                                 WhitePixel(display, DefaultScreen(display)))
 *   OH ALL RIGHT, YOU CAN GO ON.
 *
 *   WHAT IS YOUR DISPLAY?
 *         display = XOpenDisplay("unix:0");
 *   WHAT IS YOUR COLORMAP?
 *         cmap = DefaultColormap(display, DefaultScreen(display));
 *   AND WHAT IS YOUR FAVORITE COLOR?
 *         favorite_color = 0; /* Black. */
 *         /* Whoops! No, I mean: */
 *         favorite_color = BlackPixel(display, DefaultScreen(display));
 *         /* AAAYYYYEEEEE!! (client dumps core & falls into the chasm) */
 *
 *   WHAT IS YOUR DISPLAY?
 *         display = XOpenDisplay("unix:0");
 *   WHAT IS YOUR VISUAL?
 *         struct XVisualInfo vinfo;
 *         if (XMatchVisualInfo(display, DefaultScreen(display),
 *                              8, PseudoColor, &vinfo) != 0)
 *            visual = vinfo.visual;
 *   AND WHAT IS THE NET SPEED VELOCITY OF AN XConfigureWindow REQUEST?
 *         /* Is that a SubStructureRedirectMask or a ResizeRedirectMask? */
 *   WHAT?! HOW AM I SUPPOSED TO KNOW THAT?
 *   AAAAUUUGGGHHH!!!! (server dumps core & falls into the chasm)
 */
```

## ariels (fair use note)

> This is a literal quote from the source file, which is (presumably) a literal quote from the quoted plan file. I'm considering this inclusion "fair use"; I've no idea how else I could possibly include this.

> A general rhetorical refutation of the position "X sucks"

## Provenance chain

| Layer | Source |
|-------|--------|
| **Origin** | Don Hopkins `.plan` file (finger / Usenet era) |
| **Code** | Jamie Zawinski — `hacks/screenhack.h` in [xscreensaver](https://www.jwz.org/xscreensaver/) |
| **Web republish** | ariels — [Everything2 node 603014](https://everything2.com/node/603014) (2000) |
| **X elders (2009)** | [Jim Gettys LinkedIn 25th thread](2009-03-x25-anniversary-linkedin-thread.md) — Don cites Google Code Search link to screenhack.h |
| **Don's public archive** | Unix-Haters X-Windows chapter — [`i39l-window-manager-flames.md`](../i39l-window-manager-flames.md) |

## Show hooks

| Angle | Bit |
|-------|-----|
| **Cheese Shop X** | Don reads the rant; demo why `-lX11` isn't enough |
| **JWZ × Don** | xscreensaver screenhack layer as citation culture |
| **NeWS vs I39L** | Same era as OWM / ICCCM flames — why Don went server-side |
| **2026 punchline** | Wayland threads repeat the sketch with different masks |
| **2009 Gettys thread** | Don tells X elders he's in screenhack.h — lost Boston screen dump |

↑ [Bundle README](README.md)
