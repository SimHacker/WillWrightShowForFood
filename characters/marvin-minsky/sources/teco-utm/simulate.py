#!/usr/bin/env python3
"""Step Minsky's 7-state 4-symbol UTM as encoded in the 1981 TECO mail.

Table and tape come from the Ancell dump. State 0 is halt (no row).
Symbols: 0 1 y A. Paper X is y; paper B is A.
"""

from __future__ import annotations

# read write dir next — four groups per state, order y 0 1 A
ROWS = {
    1: "y0L1 00L1 11L2 A1L1",
    2: "y0L1 0yR2 1AR2 AyR6",
    3: "yyL3 00L0 1AL3 A1L4",
    4: "yyL4 0yR5 11L7 A1L4",
    5: "yyR5 0yL3 1AR5 A1R5",
    6: "yyR6 0AL3 1AR6 A1R6",
    7: "y0R7 0yR6 11R7 A0R2",
}

SYMBOLS = ("y", "0", "1", "A")


def parse_rows() -> dict[int, dict[str, tuple[str, int, int]]]:
    table: dict[int, dict[str, tuple[str, int, int]]] = {}
    for state, line in ROWS.items():
        groups = line.split()
        if len(groups) != 4:
            raise ValueError(f"state {state} has {len(groups)} groups")
        row = {}
        for sym, group in zip(SYMBOLS, groups):
            if group[0] != sym:
                raise ValueError(f"state {state}: expected read {sym}, got {group}")
            write = group[1]
            direction = -1 if group[2] == "L" else 1
            nxt = int(group[3])
            row[sym] = (write, direction, nxt)
        table[state] = row
    return table


def initial_tape() -> tuple[list[str], int]:
    rules = list("110101110000010011011")
    work = list("yyAyyAyy")
    blank = ["0"] * 32
    tape = rules + work + blank
    head = len(rules)  # first y
    return tape, head


def step(table, tape: list[str], head: int, state: int):
    if state == 0:
        return tape, head, state, True
    if head < 0:
        tape = ["0"] + tape
        head = 0
    elif head >= len(tape):
        tape = tape + ["0"]
    read = tape[head]
    write, direction, nxt = table[state][read]
    tape[head] = write
    head += direction
    return tape, head, nxt, nxt == 0


def run(limit: int = 100_000) -> dict:
    table = parse_rows()
    tape, head = initial_tape()
    state = 1
    for n in range(1, limit + 1):
        tape, head, state, halted = step(table, tape, head, state)
        if halted:
            significant = "".join(tape).rstrip("0")
            return {
                "steps": n,
                "state": state,
                "head": head,
                "tape": "".join(tape),
                "significant": significant,
            }
    raise RuntimeError(f"no halt in {limit} steps")


if __name__ == "__main__":
    result = run()
    print(f"halt after {result['steps']} transitions")
    print(f"head={result['head']} state={result['state']}")
    print(f"significant: {result['significant']}")
    print(f"tape: {result['tape']}")
