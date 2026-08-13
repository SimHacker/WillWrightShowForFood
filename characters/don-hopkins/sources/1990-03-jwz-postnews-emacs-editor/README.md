# jwz — PostNews / Emacs soapbox (Mar 1990)

**Post:** [1990-03-18-jwz-postnews-post.md](1990-03-18-jwz-postnews-post.md)  
**Forum:** PostNews@cs.UMD.EDU  
**Date:** 18 March 1990

Glenn asks whether PostScript spooled news needs new readers or can be hacked into **rn**; jwz: use Emacs — pipe to PostScript interpreter, bind a key, *environment not editor*.

## Receipt chain

| Who | Line |
|-----|------|
| **Glenn** (likely Reid) | New newsreaders for PostScript spool vs hacking **rn**? |
| **jwz** | Emacs + lisp → pipe to PS interpreter; or C over a stream; *"you're a weenie"* if you hate lisp |
| **jwz** | *Emacs is not just an editor, it is an environment* — [end soapbox mode] |

## Context — PostNews (1990)

**PostNews** was the PostScript-in-mail/news experiment on NeWS-makers / UMD — compress + btoa PostScript over 7-bit ASCII. See [Amanda Walker — PostNews arc](../../amanda-walker/sources/1989-1991-news-makers-and-postnews.md).

Glenn's question: if news *is* PostScript, do we rebuild readers or extend **rn**?

jwz's answer: don't rebuild the world — embed in **Emacs** (NeXT-era bang paths in headers).

## Related in repo

- [Glenn Reid — Distillery / PostNews](../../glenn-reid/README.md) · [Distillery correspondence](../../glenn-reid/sources/distillery-pdf-correspondence.md)
- [Amanda Walker — NeWS-makers & PostNews (1989–1991)](../../amanda-walker/sources/1989-1991-news-makers-and-postnews.md)
- [Emacs in a browser — Don mail (2011)](../2011-06-emacs-in-browser-mail-thread/README.md) — jwz on CC; Don's shell prompt newline workaround
- [PostScript / PdB / Java](../2018-12-postscript-pdb-java-leigh-klotz/README.md) · [Computational feces — jwz](../2011-05-jwz-computational-feces-comment-thread/README.md)
- [Don ↔ jwz mail (2019–2025)](../2019-09-don-jwz-ping-mozilla-tamales/README.md)

## Show hooks

- Read Glenn's question — PostScript as the message format
- jwz soapbox — Emacs environment vs rn rewrite (1990 vs 2011 Blandy thread)
- Pair with Amanda's PostNews *"like good whiskey, second time through"*

↑ [Don Hopkins sources](../README.md)
