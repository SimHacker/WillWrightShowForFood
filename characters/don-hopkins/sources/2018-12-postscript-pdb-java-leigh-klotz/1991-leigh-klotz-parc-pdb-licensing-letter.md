# Leigh Klotz — PARC/Xerox PdB licensing inquiry (1991)

**From:** Leigh L. Klotz Jr. · PARC:Xerox  
**To:** tim@turing.ac.uk:Xerox, arthur@turing.ac.uk:Xerox  
**Cc:** Leigh L. Klotz:PARC:Xerox  
**Subject:** RE: HyperNeWS PdB  
**In-reply-to:** tim@turing.ac.uk:Xerox's message of Tue, 13 Aug 1991 16:07:37 PDT  
**Surfaced in:** [2018-12-29 mail thread](2018-12-29-postscript-defense-mail-thread.md) · Leigh to Arthur, 29 Dec 2018

Leigh notes they eventually received source and paid a license fee — **$2000** he thinks. Tim Niblett was involved.

---

I hope all went well with the c2ps manuals, after all.

I'm now ready to answer the question that Tim posed. I can't of course officially ask that you hold this information in confidence, as non-disclosure and all that would put an unreasonable burden on both of us; however, this is the sort of information that we would not normally disclose (for example, in a net-news message).

> Could you explain why you want a language other than PostScript?
> We wanted a scripting language for a NeWS-based system that let
> users slip into the water gradually. There do seem to benefits
> if you are writing a large PS application in terms of safety and
> comprehensibility but it took us some time to realize that.

Here at PARC, we are examining what sorts of computer systems to put into future generations of reprographic devices, which are the mainstay of Xerox's business. I recognized PostScript's power as a general purpose scripting language about a year ago, in conjunction with other investigations. We're interested in using PostScript inside reprographic devices as a generalized language for controlling not only printing, but other actions that generalized devices might be capable of. We are extending an implementation of PostScript with primitives to suit our needs, and plan to write both code directly in PostScript and also to build some special-purpose graphical interfaces for producing PostScript (not unlike the way that non-NeWS WSYWIG editors produce PostScript).

A large portion of our demonstration code here is currently written in Scheme. We pursued the idea of maintaining a Scheme system and writing a Scheme-to-PS translator, but have abandoned the approach. We expect to recode the existing Scheme code directly in PostScript.

However, we feel that there will be many people using our system (and at least one working here with us at PARC) who will have difficulty writing code in PostScript. Indeed, with appropriate compilation technology, we realized that it would not be necessary to write PostScript code by hand at all. One of my colleagues who follows GUI discussions forwarded this note:

> PostScript (in NeWS) is apparently not considered to be a serious
> scripting language. I have to disagree. ...
> I have been working on an alternative language for HyperNeWS scripts.
> The language is called PdB. The syntax and semantics are very much like ANSI-C. ...

When you kindly sent your manual and we saw the care you had put into making the language extensions programmable, we realized that PdB would be an excellent system for allowing easier development of PS-based routines for our system.

We are putting together a development kit for use in programming these products. Initially the toolkit will be used inside Xerox (and Rank Xerox and Fuji Xerox), but it is likely that the toolkit will be eventually be distributed outside Xerox, not unlike NeWS or the Microsoft Windows developers kit. We would very much like to evaluate PdB for inclusion. I can't make agreements about product licensing and fees and such, but I can say that we've been discussing similar issues with providers of other software that we might include in our development and run-time systems.

Please let me know how you feel about this use of PdB, whether you would be willing to let us try an evaluation copy, and what you feel about licensing it to Xerox for sale.

Looking forward to hearing from you,

Leigh.

↑ [Bundle README](README.md)
