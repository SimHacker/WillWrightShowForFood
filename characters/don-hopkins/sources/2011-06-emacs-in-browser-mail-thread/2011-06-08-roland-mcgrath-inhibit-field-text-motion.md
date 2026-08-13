# Email — Re: Emacs in a browser (Roland McGrath, 8 June 2011)

**From:** Roland McGrath \<roland@frob.com\>  
**To:** Don Hopkins \<don@DonHopkins.com\>  
**Cc:** Jim Blandy, Jaap Weel, Nick Papadakis, jwz, devon@csail.mit.edu, dhopkins@donhopkins.com, Ransom Williams  
**Subject:** Re: Emacs in a browser  
**Date:** Wednesday, 8 June 2011, 01:21:25 GMT+2

---

## Quoted — Don Hopkins

> I wish I understood how to turn off the artificial intelligence in emacs that figures out where your cursor will go when you use ^A or ^E on a line with a prompt in a shell window.

## Roland McGrath — answer

```elisp
(setq inhibit-field-text-motion t)
```

You may want it buffer local and set in `comint-mode-hook` or `shell-mode-hook`.

Of course, that also breaks `C-c C-a`, which used to be a distinguished useful command for the goto-after-prompt behavior before they made `C-a` mean that too. To get that back you can set `comint-use-prompt-regexp` (`comint-use-prompt-regexp-instead-of-fields` in v22), and then it only works if `comint-prompt-regexp` matches your prompt setting (as it used to be).

Of course, there's no telling any more what other strange magic might now rely on the `field` text property. So while only buffer-locally setting `inhibit-field-text-motion` seems appropriately conservative, it might diddle other weirdness in that buffer too. I haven't delved into what it would take to prevent the comint/shell-mode filters from applying the text properties in the first place, which is another possible approach.

Btw, we have **arcana@red-bean.com** for such Emacs subjects (kept private among old farts and away from unwashed masses such as the current Emacs maintainers).

— Roland

↑ [Thread README](README.md) · [Don's question](2011-06-08-don-hopkins-emacs-prompt-reply.md)
