# Self, V8, and the lost art of compilable language design — a 2006 conversation with Tom Lord (HN, Nov 2022)

**Thread:** [The influence of Self](https://news.ycombinator.com/item?id=33502897) (Nov 2022).

**Don's comment:** [33527618](https://news.ycombinator.com/item?id=33527618) (4 points) — quoting a message Don wrote to **Tom Lord in 2006**, two years before Lars Bak built V8 at Google, after running into **Dave Ungar** while he was interviewing at Laszlo Systems.

This is the treasured receipt cited in [The Part Where It Compiles](../don-hopkins/the-part-where-it-compiles-hn-2026.md): JavaScript credits Self for its prototypes while missing everything else the paper was about.

*This document lives in [Tom Lord's memorial room](README.md) because it is primarily about him: his ear was the one Don was bending in 2006, and the conversation is part of his record.*

---

## The comment

I wrote this in a discussion with Tom Lord in 2006 (a couple years before Lars Bak developed V8 at Google), after I ran into Dave when he was interviewing at Laszlo Systems, and he showed a demo of his latest Self system:

> I just ran into Dave Ungar (of Self fame), and mentioned how ironic it was that JavaScript pointed to Self as its inspirational prototype (vis-a-vis JavaScript's prototype based object system), but JavaScript totally missed the boat on efficient compile-ability, which is the most interesting thing about Self. (I mean, anybody can make a prototype oop system that runs slow, but it takes a fucking genius to come up all the brilliant stuff in Self, like the aggressive inlining compiler (it has no byte code interpreter, just a bad-ass compiler), incremental compilation, polymorphic inline cache, coupled with dynamic de-optimization to make it debuggable).
>
> He gave a cool Self demo of writing a straightforward factorial function, then editing the source to the system's multiplication operator, so it would return a different result if you multiplied something by 1,000,000. Then he showed how it affected the factorial function, as well as the rest of the system, which incrementally recompiled itself as needed. All that and perfect debuggability, too!
>
> About JavaScript, he retorted that it was actually possible to efficiently compile JavaScript if you were really devious enough. Too bad the art of designing languages so you don't have to be devious in order to compile them, was lost of so many popular bad language designers (PHP, JavaScript, Perl, etc).

V8 (JavaScript engine), Wikipedia:

https://en.wikipedia.org/wiki/V8_(JavaScript_engine)

---

## Why this one matters

- **Provenance:** written in 2006, before V8 existed. The claim that Self's real contribution was compilability, not prototypes, was made in advance, not in hindsight.
- **The demo beat:** Ungar live-editing the system's multiplication operator and watching factorial (and the whole system) incrementally recompile, with perfect debuggability. The best 30-second summary of Self that exists.
- **The Ungar retort:** "possible to efficiently compile JavaScript if you were really devious enough" — the exact deviousness V8 later shipped.
- **The punchline:** the lost art is designing languages so you don't HAVE to be devious to compile them.

Note: the 2006 message is preserved verbatim, typos and all ("come up all the brilliant stuff", "was lost of so many"). It's a historical quote; don't clean it.

## Repo context

| File | Why |
|------|-----|
| [`memorial.md`](memorial.md) | Tom's tribute, which this conversation feeds |
| [`../don-hopkins/the-part-where-it-compiles-hn-2026.md`](../don-hopkins/the-part-where-it-compiles-hn-2026.md) | Cites this as the treasured receipt in the Self section |
| [`../don-hopkins/self-interest-narcissas-mirror-david-ungar.md`](../don-hopkins/self-interest-narcissas-mirror-david-ungar.md) | Dream Repo Show episode with Ungar |
| [`../don-hopkins/java-25-self-hotspot-jens-monig-hn-2021.md`](../don-hopkins/java-25-self-hotspot-jens-monig-hn-2021.md) | The Lars Bak / HotSpot side of the same story |
| [`../don-hopkins/import-self-from-self.md`](../don-hopkins/import-self-from-self.md) | Self → MOOLLM prototype lineage |
