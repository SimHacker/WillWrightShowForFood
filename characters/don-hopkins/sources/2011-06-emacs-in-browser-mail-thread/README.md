# Mail thread — Emacs in a browser (June 2011)

**Subject:** Re: Emacs in a browser  
**Anchor date:** 8 June 2011  
**Participants (from headers):** Jim Blandy, Jaap Weel, Roland McGrath, Nick Papadakis, jwz, Devon (CSAIL), Ransom Williams, Don Hopkins

Thread about whether/how to modernize Emacs — browser runtimes, JavaScript as a lispy target, LLVM/Clang IDE incremental parsing, vs Emacs stagnation. Don's reply is a shell-window **prompt UX** war story.

## Jim Blandy — 7 June 2011, 7:49 AM

> Mixing languages is always going to be clumsy, for fundamental, inescapable reasons. People who say, "Oh, you just need a common VM" are missing a lot; a common runtime architecture doesn't begin to address the real reasons an interface implemented in one language will always have an "accent" in another language. It's better to look at which language has the best scene and just go along with it, instead of trying to embed your favorite language in another language's world.
>
> In my opinion, JavaScript's not that bad; it's just taken folks a while to realize that it's not Java without types. JavaScript requires an entirely different style, one which ends up looking rather lispy. It's got s-expressions (object and array literals). It's got real closures. The best JavaScript code (jQuery; Prototype) uses them both liberally and expressively.
>
> Modern browsers have pretty sexy display machinery that a lot of people have hacked on to make fast and general. I think it would actually be pretty cool to write an editor as a Firefox add-on and really take advantage of that to properly show (say) patches; version control annotations; profiler output; and so on.
>
> Chris Lattner gave a presentation at FOSDEM this year in which he claimed that LLVM and Clang (the back end and C++ front end of Apple's toolchain, which is Free software) are set up to permit the kind of incremental lexing, parsing, and analysis of C++ that you want from an IDE. If it's true, that would be another hard piece of the puzzle addressed.
>
> Emacs is... kind of depressing. I don't get the impression the folks active in its development have much exposure to the coolest stuff that's being done these days. I suspect that the folks that do have that exposure have moved on to other environments.

## Don Hopkins — 8 June 2011, 00:29:04 GMT+2

**To:** Jim Blandy \<jimb@red-bean.com\>  
**Cc:** Jaap Weel, Roland McGrath, Nick Papadakis, jwz, devon@csail.mit.edu, dhopkins@donhopkins.com, Ransom Williams

> I wish I understood how to turn off the artificial intelligence in emacs that figures out where your cursor will go when you use ^A or ^E on a line with a prompt in a shell window.
>
> I worked around that problem years ago by terminating my prompt with a newline, so each command starts on its own line, for easy line oriented cutting and pasting, without any chance of schizophrenic confusion about where the prompt ends and the command begins.
>
> -Don

Full notification-style archive: [`2011-06-08-don-hopkins-emacs-prompt-reply.md`](2011-06-08-don-hopkins-emacs-prompt-reply.md)

## Roland McGrath — 8 June 2011, 01:21:25 GMT+2

**To:** Don Hopkins  
**Cc:** same thread

The actual fix — and the archaeology:

```elisp
(setq inhibit-field-text-motion t)
```

Buffer-local via `comint-mode-hook` or `shell-mode-hook`. Tradeoffs: breaks `C-c C-a` goto-after-prompt unless you also set `comint-use-prompt-regexp` (v22: `comint-use-prompt-regexp-instead-of-fields`) with a matching `comint-prompt-regexp`. The `field` text property may have other side effects; Roland notes preventing comint filters from applying properties in the first place as another approach.

> Btw, we have **arcana@red-bean.com** for such Emacs subjects (kept private among old farts and away from unwashed masses such as the current Emacs maintainers).

Full archive: [`2011-06-08-roland-mcgrath-inhibit-field-text-motion.md`](2011-06-08-roland-mcgrath-inhibit-field-text-motion.md)

## Why this matters

| Voice | Line |
|-------|------|
| **Blandy** | Language mixing has an unavoidable "accent"; JS is secretly Lisp; browser editor add-ons; Emacs devs may have moved on |
| **Don** | Emacs "AI" for `^A`/`^E` in comint/shell prompts fights line-oriented editing — **newline-terminated prompts** as the workaround |
| **McGrath** | **`inhibit-field-text-motion`** — the knob Don didn't know; comint `field` property archaeology; arcana@red-bean.com for Emacs elders |

## Related in repo

- [Instance-First Development](articles/instance-first-development.md) — Blandy's "accent" argument rhymes with embedding vs native scene
- [Axis of Eval — send code, not commands](../../axis-of-eval-send-code-not-commands.md) — NeWS/JS vs command streams
- [jwz SimRogenous (2008)](../2008-05-jwz-simrogenous-street-view/README.md) — jwz on CC
- [Nick Papadakis forward (2008)](../2008-05-jwz-simrogenous-street-view/2008-05-16-nick-papadakis-forward-email.md) — same orbit
- [Computational feces (2011)](../2011-05-jwz-computational-feces-comment-thread/README.md) — jwz + English-like language pain, same month
- [PostNews Emacs soapbox (1990)](../1990-03-jwz-postnews-emacs-editor/README.md) — jwz: *environment not editor* — 21 years earlier

## Show hooks

- Don demonstrates prompt-newline discipline live in a shell buffer — then Roland's `inhibit-field-text-motion` fix
- Blandy vs Don vs Roland: grand editor architecture vs prompt heuristic vs comint field-property arcana
- 2011 snapshot: LLVM IDE hope, Firefox editor add-ons, Emacs depression — what shipped since?

↑ [Don Hopkins sources](../README.md)
