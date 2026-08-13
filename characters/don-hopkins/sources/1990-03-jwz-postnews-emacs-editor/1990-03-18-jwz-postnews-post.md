# Jamie Zawinski — "the editor" (PostNews, 18 Mar 1990)

**From:** Jamie Zawinski \<heaven!next!teak.Berkeley.EDU!jwz@NeXT.COM\>  
**To:** heaven!!heaven!PostNews@cs.UMD.EDU  
**Reply-To:** heaven!PostNews@NeXT.COM  
**Subject:** the editor  
**Date:** 18 March 1990, 01:49 GMT+1

Usenet / **PostNews** thread — Glenn on PostScript spooled news; jwz's Emacs soapbox.

---

**Glenn writes:**

> I wonder if this means we'll have to write entirely new news-readers to be able to treat the contents of a spooled news file as PostScript, or if we can hack it into something like "rn" without doing too much work.

**Jamie Zawinski:**

> Well, if you use a newsreader which runs inside of **Emacs**, this sort of thing is pretty close to trivial. You just hack up some lisp that fires up a pipe to the postscript interpreter, and bind it to a key, or patch it into a before-display-message hook. If you hate lisp, (well, you're a weenie but) most of this can be written in an external C program that the editor invokes and communicates with over a stream.
>
> **Emacs is not just an editor, it is an environment**, that's why you can do stuff like this. [end soapbox mode.]
>
> -- Jamie

↑ [Bundle README](README.md)
