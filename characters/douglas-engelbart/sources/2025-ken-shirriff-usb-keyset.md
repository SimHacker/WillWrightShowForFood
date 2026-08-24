# Ken Shirriff — USB interface for Engelbart's chord keyset (2025)

Public write-up. Christina Engelbart loaned an original keyset. Shirriff built a Teensy 3.6 adapter so it types on a modern Mac.

- Full post: https://www.righto.com/2025/03/mother-of-all-demos-usb-keyset-interface.html
- Hackster: https://www.hackster.io/news/ken-shirriff-gets-douglas-engelbart-s-keyset-the-less-successful-mouse-companion-talking-usb-bcb6679810fc

## Hardware facts from the post

- Five microswitches, **DB-25**, common to ground; Teensy internal pull-ups.
- Leftmost line has ~**1.5 kΩ** to ground (maybe plug-present). He added a 1 kΩ pull-up so that pin is readable.
- Debounce: wait **100 ms** of stable chord before sending a character.
- Five keys = 32 codes. **Mouse buttons are shift** (NLS cue card): middle ≈ uppercase, left ≈ numbers/punctuation, others command/ctrl.
- Interface is USB **device** (keyboard + forwarded mouse motion) **and** USB **host** (read a modern mouse). Clicks used as keyset shift must **not** be forwarded as clicks.

## Chord encoding

ARC information sheet in the post: columns = mouse-button combinations. Specials include `<CD>` command-delete, `<BC>` backspace character, `<OK>`, `<BW>` backspace word, `<RC>` replace character, `<ESC>` filename completion. Viewspecs on the back of the sheet — Shirriff omitted them (no NLS to consume them).

## History notes worth keeping

- Bill English built the first mouse and ran the 1968 demo hardware (Eidophor, microwave links, Herman Miller desk).
- Alto keyset almost identical; Maze War was the popular Alto use (function keys more than full chording). David Liddle: keyset slowed people down once you left "hot" system programmers.
- MiniBASE (McDonnell Douglas, 1987) was one of the few PC apps that supported a keyset.
- Name "Mother of All Demos": Shirriff traces the Engelbart use to Steven Levy, *Insanely Great* (1994). Intel/Andy Grove used the phrase first (Comdex 1991). Markoff later attributed it to Andries van Dam; Shirriff thinks van Dam used it after Levy.

## Other public replica / USB work (linked from the post and comments)

- Eric Schlaepfer (TubeTimeUS) 3D-printed replica: https://github.com/schlae/engelbart-keyset — Ken says construction matches the original.
- Russ Nelson / PJRC: https://www.pjrc.com/engelbart-chording-keyset/ — emit character on **first release**; chord 31 = NOP.
- Hackaday: https://hackaday.io/project/185908-engelbart-keyset
- Pouya Kary, MIDI NLS keyset: https://github.com/pouyakary/nls-keyset-with-midi-keys

## DEI teaching page

https://dougengelbart.org/content/view/273/ — binary finger numbering (1, 2, 4, 8, 16), cue card, verb-noun commands (`t`+`w` = transpose word), 1969 demo sequel clip.
