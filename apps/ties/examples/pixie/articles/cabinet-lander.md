---
title: LANDER
synonyms:
  - cabinet-lander
  - lunar lander
definition: "A lunar landing game for the PDP-7 teletype, written for this cabinet in 2026. Each second, type how much fuel to burn."
---

A lunar landing game on the PDP-7's teletype, written for this cabinet in 2026. My first programmable calculator game was a lunar lander, on a TI that read its programs from magnetic strips, and the integration loop in it is the one I have used in physics simulations ever since.

You are 500 feet up, falling at 50 feet a second, with 60 units of fuel. The moon pulls 5 ft/s every second; each unit you burn pushes back 2.

**Fly.** Click the teletype paper so it has the keyboard, press Return, and then each second type a burn, 0 to 30, and Return. Return alone burns nothing.

    T 3  ALT 327.5  VEL -65  FUEL 60  BURN? 3
    T 4  ALT 263  VEL -64  FUEL 57  BURN? 6
    ...
    T 11  ALT 5.5  VEL -9  FUEL 12  BURN? 6
    CONTACT AT 2 FT/S, 6 UNITS LEFT.
    PERFECT LANDING.

Under 3 ft/s is perfect, under 10 good, under 30 hard, and 30 or more a crash. Falling without a burn meets the ground at 86 ft/s. Brake early and the tank runs dry high up; wait, then burn hard.

The touchdown speed is taken at the instant of contact, not at the end of the second, so a lander that touches and lifts off again inside one second still counts as landed. Everything is integer arithmetic on an 18-bit machine with no multiply instruction: altitude is kept in half feet, multiplying is shift and add, and the square root is a subroutine.

**Demo** reboots and lets a scripted pilot fly one descent. **The readout** is altitude, velocity and fuel, read from the program's variables in core every frame; they are zero until you press Return, because that is when LANDER sets them. **Memory**, source view, is `lander.s` with 👉 on the line running.
