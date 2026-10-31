# *LLOGO: An Implementation of LOGO in LISP*, revised (MIT AI Memo 307A, 1975)

Ira Goldstein, Henry Lieberman, Harry Bochner and Mark L. Miller. MIT Artificial Intelligence
Laboratory, AI Memo 307A and Logo Memo 11, June 27, 1974, revised March 4, 1975. 93 scanned pages.

- [The scan (PDF)](aim-307a-llogo-1975.pdf), from [MIT DSpace](https://dspace.mit.edu/handle/1721.1/6221)
- [OCR text](aim-307a-llogo-1975.ocr.txt), with a `=== scan page N ===` marker at each page
- [Metadata, structural index and the list of changes from 1974 (YAML)](aim-307a-llogo-1975.yml)

This is the whole memo as revised in March 1975. Sections 1 to 16 are the
[June 1974 memo](../aim-307-llogo-1974/README.md) with corrections and additions; read that page for
what LLOGO is, the Logo-versus-Lisp argument, the implementation and the devices. This page covers
what the revision changed, and the section it added: the turtle for Tom Knight's raster TV
terminals. Quotations are from the OCR, corrected against the scan.

## What changed

**The `TEST` flag became local.** In 1974 the memo criticised its own Logo: "In LLOGO, the flag set
by TEST is simply a LISP variable. Since it is global, TEST's in sub-procedures can affect IFTRUE's
in the super-procedure. This introduces a non-local nature to control structure." In 1975 the same
paragraph reads: "the scope of the flag set by a TEST is unclear. In LLOGO, this flag is a LISP
variable, local to the procedure in which the TEST occurs" (scan 8). The 1974 paragraph in Section
11 about 11LOGO's "one global test box" is gone.

[The surviving LLOGO source](../../../don-hopkins/sources/llogo-maclisp-its.md) shows how it was done.
`ADDLINE`, which stores a line of a procedure, adds `TESTFLAG` to the `PROG` variables of any
procedure containing a `TEST`, and `TESTFLAG` is in the file's `SPECIAL` declaration. So the fix is
a dynamic binding per procedure: a procedure that tests gets its own flag, and the procedures it
calls see that flag until one of them tests and binds its own. The comment above `DEFINE TEST` was
never updated and still says "IN LLOGO, TESTFLAG IS GLOBAL AND SUBS DO EFFECT SUPERPROCEDURE."

**Getting started was rewritten for beginners (Section 5, scans 16 to 18).** Notational conventions;
a step-by-step ITS login "intended to help very naive users", starting from "If it is a TV console,
turn it on using the switch on the gray box mounted on the wall" and typing `CALL` on a TV keyboard;
three versions to choose from, `LLOGO` (11LOGO vocabulary), `CLLOGO` (CLOGO vocabulary) and `NLLOGO`
("The very latest version of LISP LOGO. This is experimental, so we make no promises"); and a new
first start-up question at a TV console, "DO YOU WANT TO USE THE TV TURTLE?"

**Smaller changes.** Top-level history functions `LASTVALUE`, `LASTFORM` and `THISFORM` (scan 24).
Returning from a breakpoint now continues "from exactly the point at which it was interrupted and not
beginning with the next line of code", unlike 11LOGO's `CONTINUE` (scan 31). Section 8.6 became
"Other Debugging Facilities". Section 11 adds Lisp's conventions for decimal points and floating
point input. The compiler paragraph is unchanged: "For safety's sake, all variables are automatically
declared SPECIAL" (scan 34).

## Section 17: the Knight TV turtle

The Knight terminals were "raster scan televisions controlled by a PDP-11", and the section opens with
what that buys over a refreshed vector CRT like the 340: "Since the picture which appears on a user's
screen is stored in the 11's memory, one bit per point, the user can put up arbitrarily complicated
pictures containing any number of vectors, without causing flicker." Patterns of points make
shading. Programs "may test individual points being displayed, without necessitating computation of
intersection of vectors." The turtle gets "an 'eraser' in addition to a 'pen', a capability which
would prove difficult to implement in a vector display", and a split screen keeps graphics above and
typeout below. Like LLOGO's other packages it loads into a plain Lisp, as `TVRTLE FASL`.

- **Starting (scan 68).** `STARTDISPLAY` gives one turtle at the centre, pen down, heading zero, in
  split-screen mode; `NODISPLAY` ends it. `SAVEDISPLAY` exits to DDT without losing the picture, and
  redraws it when you continue.
- **The turtle (17.1).** A triangle drawn in XOR, so it shows against any picture. Its centre tells you
  what moving will do: a filled box if the pen is down, an outlined box for the eraser, an X for XOR
  mode. `MAKETURTLE` substitutes your own procedures for drawing and erasing the turtle: "to substitute
  a more lifelike picture to represent the turtle, to print state information on the screen instead
  of drawing a picture, or to record the turtle's wanderings." Those procedures run with `:SEETURTLE`
  bound to `NIL` "to prevent infinite recursion", and "All turtle state variables are rebound during the
  execution of user supplied turtle marker procedures, so that you can change them in the course of
  drawing a turtle." This is dynamic binding put to use.
- **Moving (17.2, 17.3).** `FORWARD`, `BACK`, `SETXY`, `DELX`, `DELY`, `HOME`. Leaving the screen is
  an error unless `WRAP` is on, which treats the screen "as if the screen was a torus". `WIPE` erases
  the picture but not the turtles.
- **Pen, eraser and XOR (17.5 to 17.7).** With the eraser down, retracing a line removes it, "drawing in
  the same color ink as the background". XOR mode turns points on that were off and off that were on,
  so "the same procedure [can] draw a line and erase it, leaving what was there before it undisturbed."
- **State (17.8).** `:XCOR`, `:YCOR` and `:HEADING` are floating point and unbounded: after `SETX 600`
  with wrap on and the right edge at 500, `:XCOR` is 600.0 while `XCOR` outputs -400, where the turtle
  appears. `HERE` and `SETTURTLE` save and restore state as a sentence.
- **Multiple turtles (17.9).** `HATCH` creates a named turtle and makes it current; `USETURTLE`
  switches. The first one is called `LOGOTURTLE`.
- **Navigation, trigonometry, text (17.10 to 17.12).** `RANGE`, `BEARING`, `TOWARDS`; `SINE`, `COSINE`,
  `ARCTAN` in degrees; `MARK` prints text at the turtle.
- **Points and circles (17.13).** `POINT` turns a point on or off. `POINTSTATE` reads the screen: it
  "will return whether the point being tested is on, regardless of how it was caused to appear -- by a
  line drawn by the turtle, text printed, shading, etc." `ARC` and `CIRCLE`.
- **Scaling (17.14).** The whole screen is 455 points high and 576 wide. `TVSIZE` sets the drawing
  area (default 300 by 300); `TURTLESIZE` maps it to turtle steps (default 1000 by 1000, so -500 to
  500); `SETHOME` moves the origin, per turtle.
- **Screen colour, windows, XGP, shading, invisible mode, extensions, implementation (17.15 to
  17.22).** These pages are also bound into the 1974 scan, and are described on
  [the 1974 memo's page, under "The devices"](../aim-307-llogo-1974/README.md#the-devices-sections-14-to-17).
  The implementation in 17.22, the TV-11's memory mapped into the PDP-10 job as a Lisp array, is the
  cabinet's model for shared memory between machines:
  [MAPPING.md, "LLOGO: a Lisp array that is the screen"](../../../../packages/cabinet/MAPPING.md#llogo-a-lisp-array-that-is-the-screen).
  The source is [`tvrtle.542` in the ITS repository](https://github.com/PDP-10/its/blob/master/src/llogo/tvrtle.542).

A year later Henry presented the same system to a graphics audience, with colour, as
[*The TV Turtle* (AIM-361, 1976)](../aim-361-tv-turtle-1976/README.md).

## Related

- [Henry Lieberman's page](../../README.md)
- [The June 1974 memo](../aim-307-llogo-1974/README.md)
- [*Logo Turtle Graphics for the Lisp Machine* (WP-214, 1981)](../wp-214-lisp-machine-turtle-1981/README.md),
  this TV turtle carried to the Lisp Machine
- [*History of Logo* (2020)](../../../cynthia-solomon/sources/history-of-logo-hopl-2020/README.md),
  Section 3.7, "Dynamic Scope"
- [Every device Logo drove, and the cabinet's plan to emulate each](../../../../packages/cabinet/LOGO-TURTLE.md#every-device-logo-drove-to-emulate)
