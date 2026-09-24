---
title: HILO
synonyms:
  - cabinet-hilo
  - hi lo
definition: "A number guessing game for the PDP-7 teletype, written for this cabinet in 2026. Guess a number from 0 to 99."
---

A number guessing game on the PDP-7's teletype. It was written for this cabinet in 2026, not found in an archive: it is here to exercise the keyboard and teleprinter, which the period programs on the menu hardly touch. Hi-lo was one of my first programs.

**Play.** Click the teletype paper so it has the keyboard.

1. Press Return. HILO answers I HAVE ONE.
2. Type a guess and Return. It says HIGHER, LOWER or RIGHT, with the number of guesses.

A lucky game:

    GUESS? 50
    LOWER.
    GUESS? 25
    RIGHT. GUESSES: 2

The number is a counter that runs from 0 to 99 while HILO waits for your Return, so your timing picks it. Halving finds any number in seven guesses.

The teletype is half duplex, as a KSR-33 on a PDP-7 was: what you type is printed by the teletype itself, not echoed by the program. **LOCAL COPY** under the paper is that switch; turn it off and the paper shows only what HILO prints.

**Demo** reboots and lets a scripted operator play one game by halving. **The readout** is the guess count, read from the program's variable `tries`. **Memory**, source view, is `hilo.s` with 👉 on the line running; while it waits for a key, that is the loop polling the keyboard.
