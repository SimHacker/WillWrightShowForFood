# Svelte 5 Runes, Heir of OpenLaszlo

The canonical merge of the Svelte passages from years of Hacker News comments: why
Svelte, alone among modern frameworks, recreates the OpenLaszlo groove; why React is
not actually reactive; how runes escape the component boundary; and the working
proof, a C++ city simulator in WebAssembly driven entirely by rune-based reactive
plumbing. All prior versions are listed in [Provenance](#provenance). Sibling
articles:
[Constraints and Prototypes in Garnet and OpenLaszlo](constraints-garnet-openlaszlo.md) ·
[What is OpenLaszlo?](what-is-openlaszlo.md) ·
[Instance-First Development](instance-first-development.md)

## Contents

- [The claim](#the-claim)
- [React does not react, it repeats](#react-does-not-react-it-repeats)
- [The fair counterpoint](#the-fair-counterpoint)
- [Runes escape the component boundary](#runes-escape-the-component-boundary)
- [The proof: MicropolisCore](#the-proof-micropoliscore)
- [Push and pull, revisited](#push-and-pull-revisited)
- [What Svelte still misses](#what-svelte-still-misses)
- [Provenance](#provenance)

## The claim

Of all the frameworks I have learned about, Svelte is the most like OpenLaszlo,
philosophically. Both have a compiler that parses your code and wires up reactive
constraint dependencies automatically, rather than tracking them at runtime. Using
Svelte finally gets me back into the joyous productive groove I used to enjoy so
much developing with OpenLaszlo — prototypical, instance-first-flavored, declarative
constraint based programming, beyond what the kids call "reactive" these days — but
with standard unbastardized JavaScript and HTML instead of Flash and XML.

The tradition Svelte inherits is described in the sibling articles: the
[constraint lineage](constraints-garnet-openlaszlo.md) from Sketchpad through Garnet
to OpenLaszlo, and the [platform](what-is-openlaszlo.md) that carried it to the web
the first time.

## React does not react, it repeats

Rich Harris's talk
[Rethinking Reactivity](https://www.youtube.com/watch?v=AdNJ3fydeao) starts with
spreadsheets as the archetypal reactive system, defines reactivity as values
automatically updating according to dependency relationships, and contrasts that
with React's model of rerunning component functions and diffing virtual DOM trees:
"React doesn't have any understanding of the values running through your app. It is
not Reactive." His companion essay is
[Virtual DOM is pure overhead](https://svelte.dev/blog/virtual-dom-is-pure-overhead).

React tracks component renders; reactive systems track data dependencies. React
does not react, it repeats. I think React should have been called "Repeat",
"Re-Run", "Regurgitate", or "Retch".

To spreadsheet users and Garnet and OpenLaszlo veterans this is not a new
observation; "reactive programming" is what spreadsheets had been doing for decades.
But Harris moved reactivity into the compiler, which is exactly the move OpenLaszlo
made in 2001 and Garnet made with Lisp macros in 1990: the constraint systems that
feel magical are the ones where a compiler does the wiring.

## The fair counterpoint

Honesty requires the other side. Ryan Carniato's
[How React isn't reactive, and why you shouldn't care](https://dev.to/this-is-learning/how-react-isn-t-reactive-and-why-you-shouldn-t-care-152m)
argues that React's scheduler is just a form of buffering: the same events drive the
whole system, so React passes the general criteria "only if you view reactivity as a
push-only mechanism... It is definitely not typical reactivity. Know what else
isn't? Svelte."

Fair. Neither React nor Svelte is purely reactive. But at least Svelte does not have
the audacity to falsely claim it is reactive in its own name, like React does. And I
give Svelte credit for being quite self-referentially svelte, which is something
React definitely is not. Another way of stating the difference: Svelte does not
attempt to plug the leaky abstractions that already exist in JavaScript. JavaScript
is riddled with huge footguns that are not even exotic use cases, and if you remove
or paper over them, it is not JavaScript any more. React's biggest, most obvious
leaky abstraction is that React is not actually reactive.

## Runes escape the component boundary

Svelte 5's runes (`$state`, `$derived`, `$effect`) are especially powerful because
they let reactivity escape the component boundary. The same reactive model works
everywhere, whether you are updating the DOM or building plain application logic.
You can write completely non-visual components: pure business logic, services,
stores, no DOM anywhere.

Runes work in plain `.ts` modules, not just `.svelte` templates. The one gotcha: the
file has to be named `*.svelte.ts` so the runes compile under the same
Vite/SvelteKit pipeline as the app. A plain `.ts` file breaks in Node with
"$state is not defined".

This matters because it turns Svelte from a view library into what OpenLaszlo was: a
general reactive programming system that happens to be excellent at views.

## The proof: MicropolisCore

The working demonstration is
[MicropolisCore](https://github.com/SimHacker/MicropolisCore), the SimCity engine
lineage running in the browser: C++ compiled to WebAssembly with Emscripten, glued
to TypeScript with Embind, driven by a non-visual rune-based reactive bridge.

The architecture, layer by layer:

- **Embind surface, kept narrow on purpose**
  ([emscripten.cpp](https://github.com/SimHacker/MicropolisCore/blob/main/packages/micropolis-engine/src/emscripten.cpp)):
  core simulation logic, game state, and direct memory access are exposed;
  rendering, file I/O, and networking are left to the web platform.
- **A strict callback interface**
  ([js_callback.h](https://github.com/SimHacker/MicropolisCore/blob/main/packages/micropolis-engine/src/js_callback.h)):
  in the old NeWS/HyperLook, TCL/Tk/X11, SWIG/Python, and OpenLaszlo/Flash versions
  this was a stringly typed general purpose event callback interface; it is now a
  strict C++ interface with a corresponding TypeScript interface, so Embind can
  integrate it safely.
- **The non-visual reactive component**
  ([MicropolisReactive.svelte.ts](https://github.com/SimHacker/MicropolisCore/blob/main/apps/micropolis/src/lib/MicropolisReactive.svelte.ts)):
  a plain module of runes that the HUD, command bus, node server bridge, and Vitest
  suite all import. C++ fires callbacks with enough context for the UI; TypeScript
  handlers update `$state`; components read the reactive facade instead of calling
  Embind or touching `HEAP*` directly.
- **Direct memory views, not copies**: the WebGPU tile renderer reads tile indices
  and flags from views into WASM linear memory each frame, rather than per-frame
  Embind copies. Design docs:
  [wasm bridge and testing trajectory](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/wasm-bridge-and-testing-trajectory.md),
  [unified WebGPU renderer](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/unified-webgpu-renderer.md).

Automation and UI share one simulator through one reactive model. That is the same
trick OpenLaszlo's data binding pulled with XML datasets, upgraded to shared memory:
the [Micropolis OpenLaszlo retrospective](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/openlaszlo/README.md)
maps the two eras onto each other in detail. Live demo:
[micropolisweb.com](https://micropolisweb.com).

## Push and pull, revisited

Garnet pulled lazily because X11 round trips were expensive and unread values were
common. OpenLaszlo pushed eagerly because in a rendering runtime nearly every value
is read every frame. (Full mechanics in
[Pull versus push](constraints-garnet-openlaszlo.md#pull-versus-push).) Svelte 5
lands on a hybrid: sources push invalidation eagerly, `$derived` values recompute
lazily on read, and effects are batched by a scheduler. It is the first mainstream
system with the luxury of choosing per construct rather than per platform — and
WASM shared memory removed the latency cliff that once made the choice existential.

## What Svelte still misses

Instance-first development. Svelte components feel instance-first, but there is no
instance creation syntax parallel to the component definition syntax: you cannot
swap an inline definition for a component tag without lifting it out into its own
file, so Oliver Steele's instance substitution principle fails at the syntactic
level. Almost, but not quite. The full principle, and who gets it right, is in
[Instance-First Development](instance-first-development.md). There is still a lot to
be learned from OpenLaszlo and applied to new systems; it would be great to inspire
somebody to take instance-first development and run with it in a modern framework.

## Provenance

This article merges and deduplicates the following versions, oldest first. Links in
older versions were checked and updated with archive.org substitutes where dead.

- **Instance-First Development (2004)** (HN, 2020-01-14): [22048896](https://news.ycombinator.com/item?id=22048896)
  (Svelte the most like OpenLaszlo philosophically)
- **Rich Harris / Vercel thread** (HN, 2021-11-12): [29198119](https://news.ycombinator.com/item?id=29198119)
  (leaky abstractions, dev.to counterpoint, back in the groove)
- **HTML as a programming language** (HN, 2022-01-16): [29953932](https://news.ycombinator.com/item?id=29953932)
  (preferring Svelte for its Genshi/OpenLaszlo similarities)
- **WASM port thread** (HN, 2026-06-15): [48542767](https://news.ycombinator.com/item?id=48542767)
  (the whole MicropolisCore bridge architecture)
- **Runes comment** (HN, 2026-06-24): [48658503](https://news.ycombinator.com/item?id=48658503)
  (Rethinking Reactivity quotes; "Repeat, Re-Run, Regurgitate, Retch")
