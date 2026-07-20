# Vanessa's JIT Brain Dumps — SqueakJS Performance Notes

> Peep my brain dumps and experiments at https://squeak.js.org/docs/jit.md.html
> — [Vanessa Freudenberg, HN, December 2023](https://news.ycombinator.com/item?id=38774277)

Preserved here exactly as she published them, so they survive even if squeak.js.org or the
GitHub wiki ever goes away. Full thread context in
[`../hn-thread-2023-croquet-jasmine.md`](../hn-thread-2023-croquet-jasmine.md).

## What these are

Vanessa's working notes on making the SqueakJS JIT emit JavaScript that the *JavaScript*
JIT can optimize well — her deliberate alternative to rewriting the VM in WebAssembly:

> I just love coding and debugging in a dynamic high-level language. The only thing we
> could potentially gain from WASM is speed, but we would lose a lot in readability,
> flexibility, and to be honest, fun.

The notes cover context mapping (compiling Smalltalk contexts to real JS stack frames and
reconstructing Context objects only when the image looks at `thisContext`), inline caching,
handling interrupts and process switches, the maximum-call-stack-size problem, non-local
returns via exceptions, and stack capture/restoration for snapshots — with live runnable
mockups measuring millions of sends per second.

## Files

| File | What | Source | sha256 |
|---|---|---|---|
| [`jit.md`](jit.md) | The main brain dump, March 2021 (updated November 2023), extracted to plain Markdown for reading here | body of `jit.md.html` | `4587755f…` |
| [`jit.md.html`](jit.md.html) | The original [Markdeep](https://casual-effects.com/markdeep/) file, verbatim | [squeak.js.org/docs/jit.md.html](https://squeak.js.org/docs/jit.md.html) | `a93fe2f0…` |
| [`jit-ideas-wiki.md`](jit-ideas-wiki.md) | The earlier "before" sketch she linked from the top of the brain dump | [SqueakJS wiki: JIT Ideas…](https://github.com/codefrau/SqueakJS/wiki/JIT-Ideas-...) | `7d548284…` |
| [`jit-perf.js`](jit-perf.js) | The benchFib mockup benchmark (November 2023 update) — hand-written "JIT output" showing the optimizations in runnable form | [gh-pages/docs/jit-perf.js](https://github.com/codefrau/SqueakJS/blob/gh-pages/docs/jit-perf.js) | `d0913645…` |
| [`jit-perf.html`](jit-perf.html) | Harness page that runs `jit-perf.js` | [squeak.js.org/docs/jit-perf.html](https://squeak.js.org/docs/jit-perf.html) | `252d349b…` |

All fetched 2026-07-20. Full hashes:

```
7d5482840401ba6b23b99d2e7aa6d69847917e8c623dde9884a7728138317e42  jit-ideas-wiki.md
252d349ba0b1aa915b9e5ce5dafe0961cf02a0c0024c0ba6fafb37a0e553ae5a  jit-perf.html
d0913645d21ee23e91e9cf989ab42c79fcff43589a9945ce8fdf60027902afaf  jit-perf.js
4587755fed8f72527dca673f2428d36eebe1c5f269b5abe80ee711862983d77a  jit.md
a93fe2f08b78c36767cb79b33b371867ea84f211c142ab08f5c5620f9d8499ac  jit.md.html
```

The brain dump also links four live CodePen mockups that we could not archive here
(CodePen blocks non-browser fetches); they remain at
[JjbmVGw](https://codepen.io/codefrau/pen/JjbmVGw) (context mapping),
[RwomBOK](https://codepen.io/codefrau/pen/RwomBOK) (interrupt checks),
[bGBXpPN](https://codepen.io/codefrau/pen/bGBXpPN) (stack depth),
[YzNWpxO](https://codepen.io/codefrau/pen/YzNWpxO) (non-local returns) — but the
consolidated November 2023 mockup incorporating these ideas is `jit-perf.js`, preserved
above.

## Where the work went

The design in these notes became the SqueakJS v2 effort — see the
[v2 README](https://github.com/codefrau/SqueakJS/blob/v2/README.md) and
[pull request #168](https://github.com/codefrau/SqueakJS/pull/168), which the brain dump
closes by pointing to.
