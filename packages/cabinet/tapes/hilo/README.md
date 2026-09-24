# HILO

A number guessing game for the PDP-7 teletype, written for the cabinet
in 2026. It is not a period program. It exists to exercise the KSR-33
the way a 1960s program would, and as a test of the keyboard and
teleprinter that SYMELEC, the light pen test and DUEL do not give.

    HILO, FOR THE PDP-7 TELETYPE.
    I THINK OF A NUMBER FROM 0 TO 99. YOU GUESS IT.
    PRESS RETURN TO START.
    I HAVE ONE.
    GUESS? 50
    LOWER.
    GUESS? 25
    RIGHT. GUESSES: 2

- `hilo.s`: the program, DEC PDP-7 assembler syntax, start at 100.

It polls: KSF/KRB read a key, TLS/TSF print one, no interrupts. It is
half duplex like SYMELEC: the teletype prints what is typed, so HILO
never echoes, and after Return it prints only the line feed. Letters in
a number are skipped and an empty line asks again. The number is a
counter, 0 to 99, that runs while HILO waits for a key, so the
operator's timing picks it.

Strings use `text "..."`, a cabinet extension to the DEC dialect of
`src/asm.ts`: one word per character, the KSR-33 code with the eighth
bit set.

`src/hilo.ts` assembles and boots it and has the scripted demo, an
operator who halves the range. `src/hilo.test.ts` plays games against
the cabinet's Teletype device.

↑ [cabinet README](../../README.md)
