# Gesture space — multitouch constraints, inertia, and self-revealing vs graffiti

Multitouch is not "a mouse with extra buttons." It is **maintaining geometric constraints** between
finger locations on glass and locations in the modeled world — pan, zoom, rotate, flick, and the
messy roll between 1-, 2-, and N-finger modes when fingers lift in arbitrary order.

Primary essay: [Gesture Space](https://medium.com/@donhopkins/gesture-space-842e3cdc7102) (Medium).

## The user model (map example)

Two fingers on a map should preserve correspondence: where each finger touched the map stays under
that finger while you pan, scale, and rotate together.

| Approach | What breaks |
|----------|-------------|
| **Ideal** | Pan + zoom + rotate; constraint maintained |
| **Google Maps (no rotate)** | Projects gesture space onto pan+zoom only; rotation makes the map "slide out from under" fingers |
| **Bad apps** | Lock into zoom OR pan mid-gesture; can't combine or switch |

Apple's discrete recognizers (tap, pinch, rotation, swipe, pan, long press) are **not easily
composable** into one integrated tracker. Well-written apps write special-purpose state machines.

## Pantomime — inertia, gyros, steering wheel vs paddle

Don implemented full-screen multitouch for [**Pantomime**](https://www.youtube.com/watch?v=T43b5ywnYpo)
(Unity + TouchScript on iOS/Android):

- One finger: pan through virtual world (paddling)
- Two fingers: rotate around vertical axis through screen center (steering wheel)
- **Inertial flick** on release; rotational inertia when lifting during a twist
- **Device gyros**: spin the iPad in real space to rotate objects (often easier than dragging)
- **Mode switching** via in-world tools — overlay shows how to hold the device (walking vs paddling)
- Flat-on-table detection → different tracking (not holding it like a steering wheel)

Demos: [Help Monoliths / gravity cans](https://www.youtube.com/watch?v=ma9CsOLnux0) ·
[four-year-old player](https://www.youtube.com/watch?v=3ilhH2hDyQc)

TouchScript library: [Unity Asset Store](https://assetstore.unity.com/packages/tools/input-management/touchscript-7394) (MIT). Separate drag + rotate recognizers that must "know about each other" to roll between modes — ugly but instructive.

→ Pantomime lineage: [`../david-levitt/ideas.md`](../david-levitt/ideas.md) · media [`media/pantomime/`](media/pantomime/)

## Pie menus vs invisible gestures (self-revealing vs graffiti)

**Graffiti gestures** — undiscoverable stroke alphabets with no on-screen affordance. Users can't
learn what they can't see.

**Self-revealing gestures** — pie menus display all options radially; user learns direction + muscle
memory through rehearsal ("mark ahead" / "mouse ahead"). Solves discoverability **and** speed.

Don's HN framing ([37902412](https://news.ycombinator.com/item?id=37902412),
[37904328](https://news.ycombinator.com/item?id=37904328)) ties this to Norman's elderly-UI critique:
good ergonomics help everyone; mystery-meat icons and hidden gestures hurt novices **and** elders.

Historical receipts:

| Event | Link |
|-------|------|
| Jobs @ EduCom 1988 — "That sucks! … Wow, that's neat!" | NeWS booth demo with Ben Shneiderman |
| Norman @ Ted Selker NPUC — SimCity pie menu argument | [Workshop video](https://www.youtube.com/watch?v=5GCPQxJttf0) |
| "Linear menus caused the meltdown" | [X11 SimCity pie demo](https://www.youtube.com/watch?v=Jvi98wVUmQA) |

→ [`pie-menus-chi-88-and-beyond.md`](pie-menus-chi-88-and-beyond.md) · ConnectedTV **Finger Pies**
(stroke-with-feedback): [`connectedtv-touch-tuning-finger-pies.md`](connectedtv-touch-tuning-finger-pies.md)

## Fitts's Law and steering

Fitts: target time ∝ distance / width. **Screen edges = infinite width** (Mac menu bar classic).

Pie menus exploit **constant angular width** per slice — direction matters more than distance.
Steering law extends Fitts to curved paths (important for stroke gestures and radial selection).

HN threads mined: [16613903](https://news.ycombinator.com/item?id=16613903) ·
[16614889](https://news.ycombinator.com/item?id=16614889) · pie retrospective
[17098179](https://news.ycombinator.com/item?id=17098179).

## Hiroo Iwata — when software can't push the finger

You can't warp a finger like a mouse pointer. **Hiroo Iwata**'s movable multitouch haptic screen
exerts friction forces so virtual object edges push back:

- [3DOF Multitouch Haptic Interface](https://www.youtube.com/watch?v=YCZPmj7NtSQ) (AsiaHaptics 2016)
- [Food simulator](https://www.wired.com/2003/08/slideshow-wonders-aplenty-at-s/) (Wired)

Guest candidate: [`../bill-buxton/`](../bill-buxton/) (if created) or haptics researchers circle.

## Hammer.js, Daniel Vogel, Michael Naimark

- **hammer.js** — Don built a pie-menu recognizer; mouse "track while button up" was awkward on touch-first APIs ([browser support minefield](http://hammerjs.github.io/browser-support/))
- **Daniel Vogel** — [Pinch-to-Zoom Plus](https://www.youtube.com/watch?v=x-hFyzdwoL8); [foot menu](https://www.youtube.com/watch?v=pqycjWHoI2w) for exercise while coding
- **Michael Naimark** — VR/AR fundamentals series on touch and input ([part 3](https://medium.com/@michaelnaimark/vr-ar-fundamentals-3-other-senses-touch-smell-taste-mind-f2d5d959aa4d), [part 4](https://medium.com/@michaelnaimark/vr-ar-fundamentals-4-input-interactivity-792e6757a985))

## Show seeds

| Show seed | Hook |
|-----------|------|
| [`../../repo-shows/gesture-space-self-revealing-ui/gesture-space-self-revealing-ui.yml`](../../repo-shows/gesture-space-self-revealing-ui/gesture-space-self-revealing-ui.yml) | Gesture space + pie menus vs graffiti; Norman/Jobs receipts; live constraint tracker |
| [`../../repo-shows/pie-menus-retrospective.yml`](../../repo-shows/INDEX.yml) | Redesign pie menus from scratch (MicropolisCore holodeck) |
| David Levitt group | Pantomime multitouch + ConnectedTV Finger Pies |

## Dream guests

| Guest | Why |
|-------|-----|
| **Donald Norman** | Elderly UI thread — constructive debate on self-revealing vs criticism-only |
| **Ted Selker** | NPUC workshop host; input languages |
| **David Levitt** | Pantomime + ConnectedTV stroke design |
| **Daniel Vogel** | Pinch-zoom research + foot menu |
| **Bill Buxton** | Multitouch history (if char dir exists) |
