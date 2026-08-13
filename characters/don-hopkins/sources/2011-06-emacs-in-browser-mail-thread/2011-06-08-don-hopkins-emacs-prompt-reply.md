# Email — Re: Emacs in a browser (Don Hopkins, 8 June 2011)

**From:** Don Hopkins \<don@DonHopkins.com\>  
**To:** Jim Blandy \<jimb@red-bean.com\>  
**Cc:** Jaap Weel \<jaapweel@gmail.com\>, Roland McGrath \<roland@frob.com\>, Nick Papadakis \<nick@mit.edu\>, jwz@livejournal.com, devon@csail.mit.edu, dhopkins@donhopkins.com, Ransom Williams \<auvergnerw@gmail.com\>  
**Subject:** Re: Emacs in a browser  
**Date:** Wednesday, 8 June 2011, 00:29:04 GMT+2

---

I wish I understood how to turn off the artificial intelligence in emacs that figures out where your cursor will go when you use ^A or ^E on a line with a prompt in a shell window.

I worked around that problem years ago by terminating my prompt with a newline, so each command starts on its own line, for easy line oriented cutting and pasting, without any chance of schizophrenic confusion about where the prompt ends and the command begins.

-Don

---

**Answer:** Roland McGrath — [`2011-06-08-roland-mcgrath-inhibit-field-text-motion.md`](2011-06-08-roland-mcgrath-inhibit-field-text-motion.md) · `(setq inhibit-field-text-motion t)`

## Quoted — Jim Blandy, 7 June 2011, 7:49 AM

Mixing languages is always going to be clumsy, for fundamental, inescapable reasons. People who say, "Oh, you just need a common VM" are missing a lot; a common runtime architecture doesn't begin to address the real reasons an interface implemented in one language will always have an "accent" in another language. It's better to look at which language has the best scene and just go along with it, instead of trying to embed your favorite language in another language's world.

In my opinion, JavaScript's not that bad; it's just taken folks a while to realize that it's not Java without types. JavaScript requires an entirely different style, one which ends up looking rather lispy. It's got s-expressions (object and array literals). It's got real closures. The best JavaScript code (jQuery; Prototype) uses them both liberally and expressively.

Modern browsers have pretty sexy display machinery that a lot of people have hacked on to make fast and general. I think it would actually be pretty cool to write an editor as a Firefox add-on and really take advantage of that to properly show (say) patches; version control annotations; profiler output; and so on.

Chris Lattner gave a presentation at FOSDEM this year in which he claimed that LLVM and Clang (the back end and C++ front end of Apple's toolchain, which is Free software) are set up to permit the kind of incremental lexing, parsing, and analysis of C++ that you want from an IDE. If it's true, that would be another hard piece of the puzzle addressed.

Emacs is... kind of depressing. I don't get the impression the folks active in its development have much exposure to the coolest stuff that's being done these days. I suspect that the folks that do have that exposure have moved on to other environments.

↑ [Thread README](README.md)
