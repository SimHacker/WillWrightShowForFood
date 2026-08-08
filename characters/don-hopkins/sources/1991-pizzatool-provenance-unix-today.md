# PizzaTool — provenance letter, UNIX Today, mailpizzaserver (1991)

## Historical clarification (29 Apr 1991)

Sun engineers' letter to **UNIX Today** editor (Paul Simons et al.) correcting **15 Apr 1991** article *"Any Way You Slice It, Sun's Pizzatool Is Food For Thought"*:

| Who | Contribution |
|-----|----------------|
| **David LaValle** (NeXT) | Original idea — order food from workstation (1989) |
| **Ben Stoltz** | First functional **PizzaTool** in **Sun DevGuide** — price optimization, pop-up pizza menu, ingredients, **fax to Tony & Alba's** (Ed Un fax hook-in) |
| **Don Hopkins** | Reimplemented in **PostScript/TNT**; added **WYSIWYG spinning popup pizza** preview |

Signers: Sean English, Dave Evans, Don Hopkins, Paul Simons, Ben Stoltz, Ed Un.

*Not a Sun product announcement — engineers' opinions only.*

## Press / culture

- **Rick Levenson** (17 Apr 1991): UNIX Today back-page half-page on PizzaTool.
- **John Gilmore** / **SunWorld** (Mar 1991): Andy Bechtolsheim cited PizzaTool in multimedia interview (fax + email integration).
- Don's DDJ pitch (Sep 1991): demo videotapes include **PizzaTool** alongside pie menus and tab windows.

## mailpizzaserver incident (Aug 1991)

NeWS PizzaTool demo sent real email:

```
/usr/ucb/mail -s 'Pizza Order' 'pizza-server@poit.eng.sun.com'
```

- Order from Norway (`jeremy@eik.ii.uib.no`) bounced — `mailpizzaserver` unknown mailer error.
- **Bill Crane** (14 Aug): demo shouldn't mail Mt. View; grep shows `emailfield` in pizzatool PostScript — *"I think it should be pulled out."*

## Cross-links

- [`../career/work-history.yml`](../career/work-history.yml) — TNT/PizzaTool era
- [`1991-09-pie-menus-buxton-ddj-draft.md`](1991-09-pie-menus-buxton-ddj-draft.md) — Valdes wanted demo tapes
- [`../../../bits/gag-news-pizza-tool-fax/gag-news-pizza-tool-fax.yml`](../../../bits/gag-news-pizza-tool-fax/gag-news-pizza-tool-fax.yml)
