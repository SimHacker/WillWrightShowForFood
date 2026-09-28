# PizzaTool (cached)

Cached verbatim from
[donhopkins.com/home/archive/NeWS/](https://donhopkins.com/home/archive/NeWS/)
on 2026-08-01. The demo that stars in
[Window Manager Flames](../../sources/i39l-window-manager-flames.md):
a NeWS application with a round shaped window (a pizza) framed by tab
windows, ordering pizza by fax from Tony & Alba's — shipped as a Sun
demo, unrestricted license.

| File | What |
|---|---|
| [pizzatool.txt](pizzatool.txt) | The whole program — a `psh` shell script full of object-oriented PostScript |
| [pizzatool.6.txt](pizzatool.6.txt) | The man page, section 6 (games), as any serious pizza-ordering tool deserves |

## Where it came from: tatool (October 1990)

The idea, ordering food from a workstation, was David LaValle's, at NeXT in 1989. Ben Stoltz
built the first working one in Sun's DevGuide; Don reimplemented it in PostScript and TNT. That is
how the six engineers' 1991 letter to UNIX Today tells it:
[1991-pizzatool-provenance-unix-today.md](../../sources/1991-pizzatool-provenance-unix-today.md).
The October 1990 mail below is the first week of it.

On Saturday night, 20 October 1990, Ben Stoltz came by Don's office at
Sun, "jumped up and down and insisted I run this program he had just gotten working." It was
**tatool**, for Tony & Alba's, and its icon was their pizza box. Opening the box showed an OPEN
LOOK control panel already filled in with your name, phone and address; a Delivery menu (To Eat at
T&A, To Pick Up, Take & Bake, Please Deliver); an estimated cost; and a (Send Fax) menu with Tony
& Albas, AD Fax, or Email Only for testing. (New Pizza) pinned up a property sheet: size 10", 14",
16" or 18", whole or half, a Style menu (Cheese, Ala Gilroy, All Meat Combo, Garlic Clam & Tomato,
Keep Fit Special, Pesto Pizza Special, Tony's Gourmet, Tony's Special, Vegetarian Delight) that set
the checkboxes, then 14 meat and 13 vegetable toppings to adjust by hand.

Don built "a mondo pizza with lots of toppings I couldn't even pronounce", meant to pick Email
Only, fat-fingered Send Fax, and had to phone Tony & Alba's to tell them to ignore the fax. On
Tuesday the 23rd he ordered on purpose (an 18-inch Ala Gilroy with artichoke hearts and provolone,
to eat there), and the man at the counter said they'd had several tatool orders that day and showed
him a color screen dump someone had brought in.

On 24 October Don wrote it up for the net as "PizzaTool". That afternoon the replies asked for an
X version, for an FTP site, whether it would be in the next SunOS, and whether it could be
forwarded (Phil Budne). One said "Much MUCH better than MC:HUMOR;TS FTP". Don forwarded the pile
to Ben as "Me and my big mouth!", and Ben told another asker he didn't know the legal side of
giving it away, "the 'pizza' program is directly related to the work we are doing in this
department (I am serious, mostly.)... it looks like this is not a secret anymore."

Don's PizzaTool followed: a NeWS and TNT application with the round spinning pizza in a hollow
frame and a pizza menu editor for "authorized pizza parlor personell only", shipped as an
OpenWindows 3.0 demo in 1991 (the man page is dated 8 March 1991). Its BUGS section
still reads: "There is presently no way to pay off your tab."

Source: Don's mail of 23–24 October 1990 with Ben Stoltz and the replies; private copies, public
summary. See also the show bit [gag-news-pizza-tool-fax](../../../../bits/gag-news-pizza-tool-fax/gag-news-pizza-tool-fax.yml).

## To do: PizzaTool in the browser

Reincarnate PizzaTool in JS and HTML, and embed it in the HyperTIES NeWS demos
([apps/ties/examples/news-hyperties-docs](../../../../apps/ties/examples/news-hyperties-docs)),
beside the other NeWS artifacts:

- The main window, Topping, Preview and Menu Editor panels, with the OPEN LOOK look and the style
  menu setting the checkboxes, from the same pizza menu data as [pizzatool.txt](pizzatool.txt).
- The round window: the pizza suspended in its hollow frame, resizable, spun with SELECT, with a
  pie menu of styles on MENU.
- A "Pizza Parlor" menu of pizza servers, and an Order! button that composes the order as the 1990
  email did, without sending a fax to anyone.
- tatool's pizza-box icon as the way in.

↑ [Code index](../README.md) · [Don's room](../../README.md)
