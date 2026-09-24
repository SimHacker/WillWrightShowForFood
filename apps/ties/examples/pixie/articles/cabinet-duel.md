---
title: DUEL
synonyms:
  - cabinet-duel
  - decus 7-40
definition: "DUEL, spacewar for two on one PDP-7, Cambridge 1968, loaded from the Oslo paper tape. Two players share the keyboard."
---

A space duel for two players on one PDP-7 and Type 340, written by Peterson and Viner at the Cambridge Mathematical Laboratory and distributed by DECUS in June 1968 as 7-40. The same lab, and the same kind of machine, that SYMELEC was written for four years later.

The binary tape survived at the University of Oslo and was read in 2026. The page loads it the way the machine did: a RIM loader reads the loader on the front of the tape, and that loader reads the game. The tape files are from ~Lars Brinkhoff~'s DUEL repository. Frode van der Meeren worked out the five words that let it run under an emulator's timing, and the page uses the same five.

**Play.** Click the tube so it has the keyboard, then:

- **Left ship:** A and D turn, W thrust, S back, Q fire.
- **Right ship:** ← and → turn, ↑ thrust, ↓ back, / or Enter fire.

The game reads the console switches, not the keyboard. Each key holds a switch down while pressed, and the switch row shows it; a control is active with its switch down. You can play it with the switches, as in 1968.

When a round ends the machine halts. Pull 🔄 down its track and let go to start a new round.

DUEL has no source here: the tape has no symbols, and no listing is known. **Memory**, code view, disassembles what the tape loaded.
