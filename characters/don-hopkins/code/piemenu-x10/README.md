# X10 pie menus — theta menus and FORTH uwm (cached)

Mirrored verbatim from
[donhopkins.com/home/archive/piemenu/](https://donhopkins.com/home/archive/piemenu/)
on 2026-08-01. The oldest pie menu code in the house: the 1986–87 UMD
X10 work that predates the NeWS implementations, told in the
[30 Year Retrospective](../../sources/pie-menus-30-year-retrospective.md)
and the [HN harvest](../../sources/hn-window-management-harvest.md).

| Dir | What |
|---|---|
| [theta.test/](theta.test/) | **Theta menu experiments** — standalone X10 test programs (`test.c`, `ntest.c`) with `theta.h`, theta cursors/masks, and `uwm_theta.h` for grafting into uwm; "theta menu" was the working name before "pie menu" |
| [uwm/](uwm/) | **uwm with pie menus, driven by FORTH** — `Menu.c` and friends hacked for round menus, with `X.f`, `Xlib.f`, `fuwm-init.f`, `call-emacs.f`: the window manager scripted in Mitch Bradley's Forthmacs, talking to Emacs |
| [uwm1/](uwm1/) | Sibling snapshot of the same FORTH-uwm tree — kept because the two diverge (`Makefile.uwm`, `bar.c`, `baz`) |

↑ [Code index](../README.md) · [Don's room](../../README.md)
