# Viewpoint, the demo (Stanford PhD, 1987–88)

[Video](https://www.youtube.com/watch?v=9G0r7jL3xl8), posted by Scott Kim on 3 August 2013:
"a computer system that imagines how computers might be different had they been designed by
visual thinkers instead of mathematicians. Caution: this is basic research, not a proposal for a
practical piece of software." Notes from the transcript, Don's paste, 4 October 2026.

## What it shows

- **Visibility.** "The pixels on the screen are literally the state of the system." The computer
  reads the screen to decide what to do, instead of a hidden variable: "what you see is not only
  what you get, it's also what the computer gets."
- **The machine.** Cedar on a Dorado at Xerox PARC: colour screen, black-and-white screen,
  keyboard, three-button mouse. Colours are transparent so the cursor never hides anything.
  Colour carries kind: red for the cursor and key highlights (all user input), green for the
  selection, black for what you draw. Blue lines divide the screen into 10 by 10 pixel cells.
- **Three buttons.** Left draws (black, or white on a black cell; a mixed cell turns black, so
  click twice for white). Middle selects a cell, magnified in the **puff box**, where drawing
  edits the selected cell; any cell, even a border or a key's letter, can be redrawn. Right
  copies the selected cell to the cursor, which with a black and a white cell makes drawing
  unnecessary.
- **Typing is copying.** A key press lights the key on the screen, copies the character drawn in
  that key to the cursor, and moves right. Redraw the C on the keyboard and you type a bold C.
- **Word wrap reads the keyboard.** Wrap happens when the cursor reaches a cell that isn't a
  character, and "character" means a cell that is on the on-screen keyboard right now. Copy the
  border onto the keyboard and typing runs through the border; copy the processor's nose onto it
  and the nose becomes typeable.
- **Two programs, one screen.** The user program reads keyboard and mouse and writes the red
  cursor and highlights; the processor program sees an **interlock** drawn in front of its name,
  wakes, finds the red marks and acts. They talk only through the screen.
- **The visual boot** (12:22). From a blank screen with only the interlock, selection and
  cursor, he finds the puff box by drawing and selecting, draws its border, finds each key by
  holding it down, draws the key, then a letter in it, then types with it, even inside the key
  itself. "After you've used Viewpoint a while you learn to look at images as collections of
  tiles that can be copied to make other pictures."
- **The claim.** Viewpoint "challenges a deep belief in computer science that the pixels on the
  screen are mere shadows of real data structures. Only by treating the screen itself as a first
  class citizen will we be able to build computers that are truly for visual thinkers."

## Where it shows up here

- The PDP-7 cabinet's CA tile engine:
  [packages/cabinet/DESIGN.md, Tiles are subroutines](../../../packages/cabinet/DESIGN.md#tiles-are-subroutines-drawn-by-the-forth-turtle).
  The tile table is the keyboard, a tile is a key's cell, the 340 is the puff box, and editing a
  tile while the rule runs restyles every cell in that state.
- Don's defence of Viewpoint as visual-programming research on
  [HN 22978454](https://news.ycombinator.com/item?id=22978454) (April 2020), with Jaron Lanier's
  1999 "user interface all the way to the bottom" mail as the parallel
  ([body-electric-1999-jaron-email.md](../../don-hopkins/body-electric-1999-jaron-email.md)).

## Other sources

- *Programmers at Work* (Susan Lammers, 1986), interviewed 1985:
  [programmersatwork.net/scott-kim](https://www.programmersatwork.net/scott-kim). Lammers on his
  goal: a computer that works directly, "with the same notation on screen and in the computer's
  memory", Viewpoint's thesis two years early. Kim there: no fundamental difference between
  programming and using a computer, a continuum; and with MacPaint, words and pictures come back
  together after Gutenberg split them.
- Martin Gardner papers, Stanford University Archives (SC0647), Game Files, Scott Kim, Box 52,
  folders 8–12: correspondence 1981–1996, symmetry art and lettering 1979–1981, word inversions
  and reflections, his queens problem, problems (snakes and others):
  [archives.stanford.edu](https://archives.stanford.edu/catalog/sc0647_aspace_ref1849_75b).
