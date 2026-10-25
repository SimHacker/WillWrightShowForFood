# Logo Adventure for Apple Logo (Paleotronic, 10 November 2018)

Melody Ayres-Griffiths ported Don's 1983 Logo Adventure from C64 Terrapin Logo to Apple Logo and
published it in Paleotronic with a downloadable disk:
[Logo Adventure for Apple Logo](https://paleotronic.com/2018/11/10/logo-adventure-for-apple-logo/).

> "I wondered if the listing could be ported to Apple Logo (and if it would still work) and after
> some poking and prodding, I found out it does!"

The game's banner in her port:

```
TO ADVENTURE
 PR [WELCOME TO LOGO ADVENTURE]
 PR [WRITTEN BY DON HOPKINS 1983]
 PR [MODIFIED FOR APPLE LOGO BY]
 PR [MELODY AYRES-GRIFFITHS 2018]
```

What the port changed, from her listing: the item, move and room lists built with `MAKE` and
`LIST` instead of quoted lists; `IF ... [ ]` and `IFTRUE`/`IFFALSE` for Terrapin's `IF`, `IFT`,
`IFF`; `BUTFIRST` for `BF`; `THROW "TOPLEVEL` for Terrapin's `TOPLEVEL`; `?` for help; `AND` and
`OR` for `ALLOF` and `ANYOF`.

The disk image (`logo_adventure.dsk`, a 140K ProDOS volume `/LOGO` with Apple Logo and the game) is
no longer at its original link; the Wayback Machine has it
([capture of 9 September 2025](https://web.archive.org/web/20250909140107/https://paleotronic.com/logo_adventure.dsk),
SHA-1 `a4b23e115994c096e94675a03c62ccc9f512aaba`). It isn't copied here because it contains Apple
Logo.

The same week:

- Lars Brinkhoff spotted the article on the [PDP-10/its issue](https://github.com/PDP-10/its/issues/1268)
  where Alexey Slyusar had ported the game to LLOGO on ITS: "Someone else had the same idea!"
- On Hacker News, as empressplay: "I ported it to Apple Logo"
  ([HN](https://news.ycombinator.com/item?id=18409959)).
- Don wrote to thank her, which began the correspondence.

Paleotronic's related articles: "Lunarcy: A Lunar Lander in Apple Logo" and "Old Logo Turtle… New
microLogo Tricks!"

↑ [Melody Ayres-Griffiths](../../README.md)
