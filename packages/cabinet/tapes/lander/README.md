# LANDER

A lunar landing game for the PDP-7 teletype, written for the cabinet in
2026. It is not a period program. Each second the operator types how
many units of fuel to burn.

    LANDER, FOR THE PDP-7 TELETYPE.
    YOU ARE 500 FEET UP, FALLING AT 50 FT/S, WITH 60 UNITS OF FUEL.
    EACH SECOND TYPE A BURN, 0 TO 30, AND RETURN. A UNIT GIVES
    2 FT/S OF THRUST; THE MOON PULLS 5. RETURN ALONE BURNS NOTHING.
    PRESS RETURN TO START.
    T 0  ALT 500  VEL -50  FUEL 60  BURN? 0
    T 1  ALT 447.5  VEL -55  FUEL 60  BURN? 0
    T 2  ALT 390  VEL -60  FUEL 60  BURN? 0
    T 3  ALT 327.5  VEL -65  FUEL 60  BURN? 3
    T 4  ALT 263  VEL -64  FUEL 57  BURN? 6
    T 5  ALT 202.5  VEL -57  FUEL 51  BURN? 7
    T 6  ALT 150  VEL -48  FUEL 44  BURN? 6
    T 7  ALT 105.5  VEL -41  FUEL 38  BURN? 6
    T 8  ALT 68  VEL -34  FUEL 32  BURN? 7
    T 9  ALT 38.5  VEL -25  FUEL 25  BURN? 7
    T 10  ALT 18  VEL -16  FUEL 18  BURN? 6
    T 11  ALT 5.5  VEL -9  FUEL 12  BURN? 6
    CONTACT AT 2 FT/S, 6 UNITS LEFT.
    PERFECT LANDING.
    RETURN TO FLY AGAIN.

- `lander.s`: the program, DEC PDP-7 assembler syntax, start at 100.

The acceleration over a second is 2 burn - 5 ft/s². The step is exact
for constant acceleration, h = h + v + a/2 and v = v + a, with altitude
kept in half feet so it stays in integers. The touchdown speed is taken
at the instant of contact, not at the end of the second:
v² = v0² - 2 a h0, then an integer square root. The same test catches a
lander that touches the surface and lifts off again within one second.
With the tank empty the fall to the surface is computed in one step.

Under 3 ft/s is a perfect landing, under 10 good, under 30 hard; 30 or
more is a crash. Free fall from the start meets the ground at 86 ft/s.
A pilot who brakes early runs out of fuel; one who waits lands.

Two's complement arithmetic throughout, and a shift and add multiply, so
it needs no EAE. It polls the teletype and is half duplex, like HILO;
strings use the `text "..."` extension described there.

`src/lander.ts` assembles and boots it. It also has the same rules in
JavaScript (`landerStep`), the scripted pilot for the demo, which
tracks a descent speed of √(2kh), and the demo itself.
`src/lander.test.ts` flies random games on the cabinet and on the
JavaScript rules and requires the paper to match line for line.

↑ [cabinet README](../../README.md)
