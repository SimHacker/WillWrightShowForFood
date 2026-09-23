#!/usr/bin/env python3
"""PCOMP (UMD CogSci Courseware Project, 1990) to YAML Jazz, three steppers, one verifier.

    python3 packages/turing/scripts/pcomp.py convert   # disk -> machines/ tapes/ ram/ abacus/
    python3 packages/turing/scripts/pcomp.py verify    # run every pcomp YAML, check expect:
    python3 packages/turing/scripts/pcomp.py verify --fast   # skip the 11.8M-step BB5 runs

The disk lives verbatim in characters/christopher-cherniak/sources/pcomp/disk/.
convert overwrites pcomp-*.yml; hand edits belong in PATCHES, TAPES, RAM_RUNS, AB_RUNS below.
verify steps the YAML, not the disk, and cross-checks each UTM tape against the
machine it encodes, stepped directly.

Semantics are TM*, RAM*, AB* as the 1999 help files describe them:
  TM*  states 1-99, 0 = HALT; "?" as INP = every symbol not listed in that state,
       "?" as OUT = leave the cell; moves L R N; tape -5000..5000; no row = ERROR.
  RAM* CARDIAC-style: 100 cells of sign + 3 digits, cell 00 hardwired +001,
       ops 0 INP 1 OUT 2 CLA 3 STO 4 ADD 5 SUB 6 SFT 7 JMP 8 TAC 9 HRS.
  AB*  registers A-J, -9999..9999; SET DEC INC GTO ZER CAL END; lines 1-99;
       CAL runs another .AB file on the same registers, recursion allowed.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parents[1]
ROOT = HERE.parents[1]
DISK = ROOT / "characters/christopher-cherniak/sources/pcomp/disk"
DISK_REL = "characters/christopher-cherniak/sources/pcomp/disk"

CREDIT = [
    "Christopher Cherniak, PCOMP, Philosophy and Computers, University of Maryland",
    "UMD Philosophy Dept. CogSci Courseware Project, Turbo Pascal 4.0, v2.0 June 1990",
]

TM_FILES = {
    "ADD.TM": ("pcomp-add", "Unary add"),
    "BUSY2.TM": ("pcomp-busy2", "2-state busy beaver"),
    "BUSY5.TM": ("pcomp-busy5", "5-state busy beaver, 2nd best known in 1990"),
    "BB5.TM": ("pcomp-bb5", "5-state busy beaver contender, Marxen 1989"),
    "BCOUNT.TM": ("pcomp-bcount", "Binary counter"),
    "EQUALS.TM": ("pcomp-equals", "Unary equality test"),
    "SQUARE.TM": ("pcomp-square", "Unary square"),
    "UTM.TM": ("pcomp-utm", "PCOMP Universal Turing Machine (after Minsky ch. 6-7)"),
}

# Tapes. expect values come from the disk's own comments where it makes a claim
# (marked "disk"); the rest follow from the machine's stated purpose.
TAPES = [
    dict(id="pcomp-add-3-plus-3", machine="pcomp-add", cells="011101110", head=0,
         why="The initial tape UTM.HLP gives for its adding-machine example: ...000^011101110",
         expect=dict(halt=True, pictured="111111")),
    dict(id="pcomp-busy2-blank", machine="pcomp-busy2", cells="", head=0,
         why="disk: 'takes 6 steps to print 4 ones'",
         expect=dict(halt=True, steps=6, ones=4)),
    dict(id="pcomp-busy5-blank", machine="pcomp-busy5", cells="", head=0,
         why="disk: 'It will take 2,133,492 steps to print 1915 ones.'",
         expect=dict(halt=True, steps=2133492, ones=1915)),
    dict(id="pcomp-bb5-offset", machine="pcomp-bb5", cells="", head=-2000, bounds=[-5000, 5000], slow=True,
         why="disk: 'started on TM*'s 10,000 square tape at around -2,000'; "
             "'11,798,826 steps to print out 4,098 ones'",
         expect=dict(halt=True, steps=11798826, ones=4098)),
    dict(id="pcomp-bb5-at-zero", machine="pcomp-bb5", cells="", head=0, bounds=[-5000, 5000], slow=True,
         why="Why the disk says to start at -2000: the head reaches +5001 and TM* stops with "
             "'ERROR:scanhead is too far to the right on tape'",
         expect=dict(error="right")),
    dict(id="pcomp-bcount-binary", machine="pcomp-bcount", source="BINARY.INP",
         why="BINARY.INP, the disk's tape for BCOUNT. Counts forever.",
         expect=dict(halt=False, after=2000)),
    dict(id="pcomp-equals-3-3", machine="pcomp-equals", cells="1110111", head=3,
         why="disk: 'If the two positive integers are equal, then the machine halts pointing to a zero'",
         expect=dict(halt=True, scanned="0")),
    dict(id="pcomp-equals-3-1", machine="pcomp-equals", cells="11101", head=3,
         why="disk: 'else the machine halts pointing to a one'",
         expect=dict(halt=True, scanned="1")),
    dict(id="pcomp-equals-3-2", machine="pcomp-equals", cells="111011", head=3,
         why="The disk's bug: when the left number is one more than the right, state 7 erases "
             "the extra 1 and steps left onto a 0, so 3 vs 2 reads as equal",
         expect=dict(halt=True, scanned="0")),
    dict(id="pcomp-equals-patched-3-2", machine="pcomp-equals-patched", cells="111011", head=3,
         why="Same tape on the patched machine: halts on the extra 1",
         expect=dict(halt=True, scanned="1")),
    dict(id="pcomp-square-3", machine="pcomp-square", cells="111", head=0,
         why="disk: 'input: ...000^111000...  output: ...000111111111^000...'",
         expect=dict(halt=True, pictured="111111111")),
    dict(id="pcomp-utm-add", machine="pcomp-utm", source="UTMADD.INP", utm=True,
         why="UTMADD.INP: ADD as a pseudo-TM on the UTM tape",
         expect=dict(halt=True)),
    dict(id="pcomp-utm-busy2", machine="pcomp-utm", source="UTMBUSY.INP", utm=True,
         why="UTMBUSY.INP: BUSY2 as a pseudo-TM. UTM.HLP: 'Try loading and running UTMBUSY.INP'",
         expect=dict(halt=True)),
    dict(id="pcomp-utm-bcount", machine="pcomp-utm", source="UTMBIN.INP", utm=True,
         why="UTMBIN.INP: BCOUNT as a pseudo-TM. Counts forever, slowly.",
         expect=dict(halt=False, after=200000)),
]

RAM_FILES = ["ADD.RAM", "MULT.RAM", "COUNTUP.RAM", "COUNTDN.RAM", "EQUALS.RAM", "BOOT.RAM", "FBOOT.RAM"]

ADD_RAM = {10: 30, 11: 31, 12: 230, 13: 431, 14: 332, 15: 132, 16: 910}
SLOW_BOOT_INPUT = [2, 700] + [x for a, w in ADD_RAM.items() for x in (a, w)]
FAST_BOOT_INPUT = [10] + list(ADD_RAM.values())

RAM_RUNS = {
    "ADD.RAM": [dict(input=[3, 4], expect=dict(halt=True, output=[7])),
                dict(input=[-5, 12], expect=dict(halt=True, output=[7]))],
    "MULT.RAM": [dict(input=[6, 7], expect=dict(halt=True, output=[42])),
                 dict(input=[-3, 5], expect=dict(halt=True, output=[-15]))],
    "COUNTUP.RAM": [dict(input=[], limit=40, expect=dict(halt=False, output=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))],
    "COUNTDN.RAM": [dict(input=[], expect=dict(halt=True, output=[-4, -3, -2, -1, 0]))],
    "EQUALS.RAM": [dict(input=[5, 3], expect=dict(halt=True, output=[5, 3])),
                   dict(input=[3, 5], expect=dict(halt=True, output=[5, 3])),
                   dict(input=[4, 4], expect=dict(halt=True, output=[0]))],
    "BOOT.RAM": [dict(pc=0, input=SLOW_BOOT_INPUT,
                      why="The slow-boot input stream in the listing: loads ADD.RAM into 10-16",
                      expect=dict(stop="input-exhausted", memory=ADD_RAM))],
    "FBOOT.RAM": [dict(input=FAST_BOOT_INPUT,
                       why="The fast-boot input stream in the listing: loads ADD.RAM into 10-16",
                       expect=dict(stop="input-exhausted", memory=ADD_RAM))],
}

AB_FILES = ["COUNT.AB", "COUNTDN.AB", "DESTADD.AB", "NDESTADD.AB", "MULT.AB",
            "XADD.AB", "XMULT.AB", "EXP.AB"]

# Every departure from the disk is named here and written into the YAML.
# TM patches produce a second machine, <id>-patched; the faithful machine stays as found.
TM_PATCHES = {
    "EQUALS.TM": dict(state=7, read="1", disk="1 0 L 0", here="1 1 N 0",
                      why="On the disk, a left number exactly one more than the right halts on a 0 "
                          "(reads as equal): 2/1, 3/2, 4/3 ... State 7 erased the extra 1 and stepped "
                          "off it. Halting on the 1 instead is right for every a, b in 1..7."),
}

PATCHES = {
    ("DESTADD.AB", 6): dict(
        disk="GTO", here="GTO 3",
        why="The disk line has no target. NDESTADD.AB, the same loop with a restore, has 'GTO 3'."),
}

AB_RUNS = {
    "COUNT.AB": [dict(registers={}, expect=dict(registers={"A": 0}, depth=1)),
                 dict(registers={"A": 5}, why="Recursion: COUNT calls COUNT once per unit of A",
                      expect=dict(registers={"A": 0}, depth=6))],
    "COUNTDN.AB": [dict(expect=dict(registers={"D": 0}))],
    "DESTADD.AB": [dict(expect=dict(registers={"A": 19, "B": 0}))],
    "NDESTADD.AB": [dict(expect=dict(registers={"A": 19, "B": 12, "C": 0}))],
    "MULT.AB": [dict(expect=dict(registers={"A": 66, "B": 11, "C": 0, "D": 0}))],
    "XADD.AB": [dict(registers={"A": 3, "B": 4}, expect=dict(registers={"A": 7, "B": 4, "C": 0}))],
    "XMULT.AB": [dict(registers={"A": 3, "B": 4}, expect=dict(registers={"A": 12, "B": 4, "D": 0}))],
    "EXP.AB": [dict(expect=dict(registers={"A": 81, "E": 0}))],
}


def read(name: str) -> list[str]:
    text = (DISK / name).read_bytes().decode("latin-1").replace("\x1a", "")
    return [l.rstrip() for l in text.replace("\r\n", "\n").split("\n")]


def q(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def comment(s: str) -> str:
    s = s.rstrip()
    return f"  # {s}" if s else ""


# TM*

TM_ROW = re.compile(r"^\s*(\d+) (\S)\s+(\S) ([LRN])\s+(\d+)\s*(?:- ?(.*))?$")
TM_NOTE = re.compile(r"^\s*(\d+)\s+- ?(.*)$")


def parse_tm(name: str) -> dict:
    lines = read(name)
    program = re.search(r'Program: "(.*)"', "\n".join(lines))
    start = int(lines[lines.index("INITIAL STATE:") + 1])
    body = lines[lines.index("STATE TABLE:") + 1:]
    items, rowstates = [], set()
    for l in body:
        m = TM_ROW.match(l)
        if m:
            st = int(m[1])
            rowstates.add(st)
            items.append(("row", st, m[2], m[3], m[4], int(m[5]), m[6] or ""))
        elif (n := TM_NOTE.match(l)):
            items.append(("note", int(n[1]), n[2]))
    return dict(program=program[1] if program else name, start=start, items=items, rowstates=rowstates)


def tm_yaml(name: str, patched: bool = False) -> str:
    mid, title = TM_FILES[name]
    patch = TM_PATCHES.get(name) if patched else None
    if patch:
        mid, title = mid + "-patched", title + " (patched)"
    p = parse_tm(name)
    rows = [i for i in p["items"] if i[0] == "row"]
    symbols = sorted({s for r in rows for s in (r[2], r[3]) if s != "?"} | {"0", "1"},
                     key=lambda s: (not s.isdigit(), s))
    header = [i[2] for i in p["items"] if i[0] == "note" and i[1] not in p["rowstates"]]
    out = [f"# {title}. Recovered from the PCOMP course disk: {DISK_REL}/{name}"]
    if p["program"] != name:
        out.append(f'# The file names itself "{p["program"]}".')
    out.append("# Generated by packages/turing/scripts/pcomp.py convert. Comments are Cherniak's, verbatim.")
    if header:
        out.append("#")
        out += [f"# {h}".rstrip() for h in header]
    out += ["", f"id: {mid}", f"name: {title}", "credits:"]
    out += [f"  - {c}" for c in CREDIT]
    out += [f"  - Source file {name}", "", 'blank: "0"',
            "symbols: [" + ", ".join(q(s) for s in symbols) + "]",
            'wildcard: "?"   # TM*: as read, every symbol not listed in this state; as write, leave the cell',
            f"start: q{p['start']}", "halt: [q0]",
            "missing: error  # TM* stops with 'ERROR:state ...' when a state has no row for the scanned symbol",
            "bounds: [-5000, 5000]  # TM*'s tape; leaving it is an error",
            "universality: { kind: standard }" if mid == "pcomp-utm" else "universality: { kind: none }"]
    if patch:
        out += ["patches:",
                f"  - {{ state: q{patch['state']}, read: {q(patch['read'])}, disk: {q(patch['disk'])}, here: {q(patch['here'])} }}",
                f"    # {patch['why']}"]
    out += ["", "states:"]
    seen: set[int] = set()
    for it in p["items"]:
        if it[0] == "row":
            _, st, inp, o, mv, nx, c = it
            if patch and st == patch["state"] and inp == patch["read"]:
                _, o, mv, nx = patch["here"].split()
                nx = int(nx)
                c = f"{c.rstrip()}  [patched; disk has {patch['disk']!r}]"
            if st not in seen:
                seen.add(st)
                out.append(f"  q{st}:")
            door = f"    {q(inp)}: {{ write: {q(o)}, move: {mv}, next: q{nx} }}"
            out.append(door + comment(c))
        elif it[1] in p["rowstates"]:
            if it[1] not in seen:
                seen.add(it[1])
                out.append(f"  q{it[1]}:")
            out.append(f"    # {it[2]}".rstrip())
    out.append("  q0: {}")
    return "\n".join(out) + "\n"


def parse_inp(name: str) -> tuple[str, int, str]:
    lines = read(name)
    s = lines[1]
    return s.replace("^", ""), s.index("^"), " ".join(l for l in lines[2:] if l)


def tape_yaml(t: dict) -> str:
    if "source" in t:
        cells, head, note = parse_inp(t["source"])
        origin = 0
        src = [f"# Recovered from the PCOMP course disk: {DISK_REL}/{t['source']}", f"# Disk note: {note}"]
    else:
        cells, origin = t["cells"], min(0, t["head"])
        head = t["head"]
        src = ["# Built from the PCOMP disk's own documentation for this machine."]
    out = src + ["# Generated by packages/turing/scripts/pcomp.py convert.", "",
                 f"id: {t['id']}", f"machine: {t['machine']}", 'blank: "0"',
                 f"cells: {q(cells)}", f"origin: {origin}", f"head: {head}"]
    if "bounds" in t:
        out.append(f"bounds: [{t['bounds'][0]}, {t['bounds'][1]}]")
    out.append(f"why: {q(t['why'])}")
    out.append("expect:")
    for k, v in t["expect"].items():
        out.append(f"  {k}: {q(v) if isinstance(v, str) else str(v).lower() if isinstance(v, bool) else v}")
    return "\n".join(out) + "\n"


class TapeError(Exception):
    pass


def step_tm(machine: dict, tape: dict, limit: int) -> dict:
    wild = machine.get("wildcard")
    blank = machine.get("blank", "0")
    states, halts = machine["states"], set(machine["halt"])
    lo, hi = tape.get("bounds") or machine.get("bounds") or (None, None)
    cells = {tape["origin"] + i: c for i, c in enumerate(tape["cells"]) if c != blank}
    head, st, n = tape["head"], tape.get("state") or machine["start"], 0
    result = "limit"
    while n < limit:
        if st in halts:
            result = "halt"
            break
        sym = cells.get(head, blank)
        doors = states.get(st) or {}
        door = doors.get(sym) or (doors.get(wild) if wild else None)
        if door is None:
            if machine.get("missing") == "halt":
                result = "halt"
                break
            raise TapeError(f"state {st} has no door for {sym!r}")
        w = sym if door["write"] == wild else door["write"]
        if w == blank:
            cells.pop(head, None)
        else:
            cells[head] = w
        head += {"L": -1, "R": 1, "N": 0}[door["move"]]
        st, n = door["next"], n + 1
        if lo is not None and not lo <= head <= hi:
            return dict(result="error", error="right" if head > hi else "left", steps=n, cells=cells, head=head)
    return dict(result=result, steps=n, cells=cells, head=head, state=st)


def pictured(cells: dict) -> str:
    if not cells:
        return ""
    return "".join(cells.get(i, "0") for i in range(min(cells), max(cells) + 1))


# UTM cross-check: decode the pseudo-TM from the tape, step it directly (Minsky:
# a missing quintuple halts), and compare with the pseudo-tape the UTM leaves.

def utm_parts(s: str) -> tuple[str, int, str, list[str]]:
    y1 = s.index("Y")
    x1 = s.index("X", y1)
    y2 = s.index("Y", x1)
    pseudo, cond = s[:y1], s[y1 + 1:x1]
    return pseudo, pseudo.index("M"), cond, s[x1 + 1:y2].split("X")


def utm_direct(s: str, limit: int) -> dict:
    pseudo, m, cond, quints = utm_parts(s)
    k = len(cond) - 1
    table = {(qq[:k], qq[k]): (qq[k + 1:2 * k + 1], qq[2 * k + 1], qq[2 * k + 2]) for qq in quints}
    cells = {i: c for i, c in enumerate(pseudo.replace("M", cond[-1])) if c != "0"}
    st, head, n = cond[:k], m, 0
    while n < limit:
        key = (st, cells.get(head, "0"))
        if key not in table:
            return dict(halt=True, steps=n, cells=cells, head=head)
        st, w, mv = table[key]
        if w == "0":
            cells.pop(head, None)
        else:
            cells[head] = w
        head += 1 if mv == "1" else -1
        n += 1
    return dict(halt=False, steps=n, cells=cells, head=head)


def utm_pseudo_after(cells: dict) -> tuple[dict, int]:
    lo = min(cells)
    s = "".join(cells.get(i, "0") for i in range(lo, max(cells) + 1))
    y1 = s.index("Y")
    pseudo, m, cond, _ = utm_parts(s)
    left = lo
    out = {left + i: c for i, c in enumerate(pseudo.replace("M", cond[-1])) if c != "0"}
    return out, left + m


# RAM*

RAM_LINE = re.compile(r"^\s*(\d+): ([+-]\d{3})\s?(.*)$")


def parse_ram(name: str) -> dict:
    lines = read(name)
    pc = int(re.match(r"PC=(\d+)", lines[1])[1])
    cells = []
    for l in lines[2:]:
        m = RAM_LINE.match(l)
        if m:
            c = m[3].strip()
            cells.append((int(m[1]), m[2], "" if c == "-" else c))
    return dict(pc=pc, cells=cells)


def ram_yaml(name: str) -> str:
    p = parse_ram(name)
    stem = "pcomp-ram-" + name.split(".")[0].lower()
    out = [f"# RAM* program, recovered from the PCOMP course disk: {DISK_REL}/{name}",
           "# Generated by packages/turing/scripts/pcomp.py convert. Comments are Cherniak's, verbatim.",
           "# Words are strings: sign + 3 digits, as RAM* shows them. Cells not listed hold +000.",
           "# Cell 00 is hardwired +001 (Hagelbarger's bootstrap). Ops: 0 INP 1 OUT 2 CLA 3 STO",
           "# 4 ADD 5 SUB 6 SFT(left,right) 7 JMP 8 TAC(jump if ACC<0) 9 HRS(set PC, halt).",
           "", f"id: {stem}", f"name: {name}", "machine: ram", "credits:"]
    out += [f"  - {c}" for c in CREDIT] + [f"  - Source file {name}", "", f"pc: {p['pc']}", "memory:"]
    for addr, word, c in p["cells"]:
        if word == "+000":
            if c:
                out.append(f"  # {addr:02}: {c}")
        else:
            out.append(f"  {addr}: {q(word)}" + comment(c))
    out.append("runs:")
    for r in RAM_RUNS[name]:
        out.append("  - input: [" + ", ".join(str(x) for x in r["input"]) + "]")
        if "pc" in r:
            out.append(f"    pc: {r['pc']}")
        if "limit" in r:
            out.append(f"    limit: {r['limit']}")
        if "why" in r:
            out.append(f"    why: {q(r['why'])}")
        e = r["expect"]
        parts = []
        if "halt" in e:
            parts.append(f"halt: {str(e['halt']).lower()}")
        if "stop" in e:
            parts.append(f"stop: {e['stop']}")
        if "output" in e:
            parts.append("output: [" + ", ".join(str(x) for x in e["output"]) + "]")
        out.append("    expect: { " + ", ".join(parts) + " }")
        if "memory" in e:
            out.append("    expect_memory: { " + ", ".join(f"{a}: {q(f'+{w:03}')}" for a, w in e["memory"].items()) + " }")
    return "\n".join(out) + "\n"


def word(s: str) -> int:
    return int(s)


def clip(v: int, digits: int) -> int:
    m = 10 ** digits
    return (abs(v) % m) * (1 if v >= 0 else -1)


def step_ram(prog: dict, inp: list[int], pc: int | None = None, limit: int = 100000) -> dict:
    mem = [0] * 100
    for a, w in (prog.get("memory") or {}).items():
        mem[int(a)] = word(w)
    mem[0] = 1
    acc, pc, out, feed, n = 0, prog["pc"] if pc is None else pc, [], list(inp), 0
    while n < limit:
        ir = mem[pc]
        pc = (pc + 1) % 100
        n += 1
        if ir < 0:
            return dict(stop="error", why=f"negative instruction {ir} at {pc - 1}", output=out, mem=mem)
        op, a = ir // 100, ir % 100
        if op == 0:
            if not feed:
                return dict(stop="input-exhausted", output=out, mem=mem, steps=n)
            if a:
                mem[a] = clip(feed.pop(0), 3)
            else:
                feed.pop(0)
        elif op == 1:
            out.append(mem[a])
        elif op == 2:
            acc = mem[a]
        elif op == 3:
            if a:
                mem[a] = clip(acc, 3)
        elif op == 4:
            acc = clip(acc + mem[a], 4)
        elif op == 5:
            acc = clip(acc - mem[a], 4)
        elif op == 6:
            left, right = a // 10, a % 10
            acc = clip(acc * 10 ** left, 4)
            acc = int(abs(acc) // 10 ** right) * (1 if acc >= 0 else -1)
        elif op == 7:
            pc = a
        elif op == 8:
            if acc < 0:
                pc = a
        elif op == 9:
            return dict(stop="halt", output=out, mem=mem, steps=n)
    return dict(stop="limit", output=out, mem=mem, steps=n)


# AB*

AB_INSTR = re.compile(r"^(SET|DEC|INC|GTO|ZER|CAL|END)\b\s*(.*)$")


def parse_ab(name: str) -> dict:
    lines = read(name)
    prog = []
    for l in lines[1:]:
        m = re.match(r"^\s*(\d+):(.*)$", l)
        if not m:
            continue
        ln, rest = int(m[1]), m[2].ljust(14)
        field, c = rest[1:14].strip(), rest[14:].strip()
        prog.append((ln, field, c))
    return dict(lines=prog)


def ab_yaml(name: str) -> str:
    stem = "pcomp-ab-" + name.split(".")[0].lower()
    p = parse_ab(name)
    calls = sorted({f.split()[1] for _, f, _ in p["lines"] if f.startswith("CAL")})
    out = [f"# AB* abacus/register machine program, recovered from the PCOMP course disk: {DISK_REL}/{name}",
           "# Generated by packages/turing/scripts/pcomp.py convert. Comments are Cherniak's, verbatim.",
           "# Registers A-J, -9999..9999, start at 0. SET R x, DEC R, INC R, GTO x, ZER R x (jump if 0),",
           "# CAL NAME (run NAME.AB on the same registers; recursion allowed), END (return or halt).",
           "# See Boolos & Jeffrey, Computability and Logic (1980) ch. 6; Jeffrey, Formal Logic (1981) ch. 6.",
           "", f"id: {stem}", f"name: {name.split('.')[0]}", "machine: abacus", "credits:"]
    out += [f"  - {c}" for c in CREDIT] + [f"  - Source file {name}", ""]
    if calls:
        out.append("calls: [" + ", ".join("pcomp-ab-" + c.lower() for c in calls) + "]")
    patches = [(ln, v) for (f, ln), v in PATCHES.items() if f == name]
    if patches:
        out.append("patches:")
        for ln, v in patches:
            out.append(f"  - {{ line: {ln}, disk: {q(v['disk'])}, here: {q(v['here'])} }}")
            out.append(f"    # {v['why']}")
    out.append("program:")
    for ln, f, c in p["lines"]:
        patch = PATCHES.get((name, ln))
        if patch:
            f = patch["here"]
            c = (c + "  " if c else "") + f"[patched; disk has {patch['disk']!r}]"
        if f:
            out.append(f"  {ln}: {q(' '.join(f.split()))}" + comment(c))
        elif c:
            out.append(f"  # {ln:02}: {c}")
    out.append("runs:")
    for r in AB_RUNS[name]:
        regs = r.get("registers", {})
        out.append("  - registers: {" + ", ".join(f" {k}: {v}" for k, v in regs.items()) + (" }" if regs else "}"))
        if "why" in r:
            out.append(f"    why: {q(r['why'])}")
        e = r["expect"]
        parts = ["registers: { " + ", ".join(f"{k}: {v}" for k, v in e["registers"].items()) + " }"]
        if "depth" in e:
            parts.append(f"depth: {e['depth']}")
        out.append("    expect: { " + ", ".join(parts) + " }")
    return "\n".join(out) + "\n"


def step_ab(progs: dict, main: str, regs: dict, limit: int = 1_000_000) -> dict:
    r = {k: 0 for k in "ABCDEFGHIJ"}
    r.update(regs)
    state = dict(n=0, depth=0, maxdepth=0)

    def run(pid: str) -> None:
        state["depth"] += 1
        state["maxdepth"] = max(state["maxdepth"], state["depth"])
        code = {int(k): v.split() for k, v in progs[pid]["program"].items()}
        pc = 1
        while pc <= 99:
            if state["n"] >= limit:
                raise TapeError("step limit")
            ins = code.get(pc)
            if not ins:
                pc += 1
                continue
            state["n"] += 1
            op = ins[0]
            if op == "END":
                break
            if op == "SET":
                r[ins[1]] = int(ins[2])
            elif op == "INC":
                r[ins[1]] = max(-9999, min(9999, r[ins[1]] + 1))
            elif op == "DEC":
                r[ins[1]] = max(-9999, min(9999, r[ins[1]] - 1))
            elif op == "GTO":
                pc = int(ins[1])
                continue
            elif op == "ZER":
                if r[ins[1]] == 0:
                    pc = int(ins[2])
                    continue
            elif op == "CAL":
                run("pcomp-ab-" + ins[1].lower())
            pc += 1
        state["depth"] -= 1

    run(main)
    return dict(registers=r, steps=state["n"], depth=state["maxdepth"])


# Commands

def convert() -> None:
    for d in ("machines", "tapes", "ram", "abacus"):
        (HERE / d).mkdir(exist_ok=True)
    for name, (mid, _) in TM_FILES.items():
        (HERE / "machines" / f"{mid}.yml").write_text(tm_yaml(name))
        if name in TM_PATCHES:
            (HERE / "machines" / f"{mid}-patched.yml").write_text(tm_yaml(name, patched=True))
    for t in TAPES:
        (HERE / "tapes" / f"{t['id']}.yml").write_text(tape_yaml(t))
    for name in RAM_FILES:
        (HERE / "ram" / f"pcomp-ram-{name.split('.')[0].lower()}.yml").write_text(ram_yaml(name))
    for name in AB_FILES:
        (HERE / "abacus" / f"pcomp-ab-{name.split('.')[0].lower()}.yml").write_text(ab_yaml(name))
    print(f"wrote {len(TM_FILES) + len(TM_PATCHES)} machines, {len(TAPES)} tapes, "
          f"{len(RAM_FILES)} RAM*, {len(AB_FILES)} AB*")


def load(p: Path) -> dict:
    return yaml.safe_load(p.read_text())


def verify(fast: bool) -> int:
    fails = 0

    def report(ok: bool, label: str, detail: str) -> None:
        nonlocal fails
        fails += not ok
        print(f"{'ok  ' if ok else 'FAIL'} {label}: {detail}")

    machines = {m["id"]: m for m in map(load, (HERE / "machines").glob("pcomp-*.yml"))}
    for tp in sorted((HERE / "tapes").glob("pcomp-*.yml")):
        t = load(tp)
        spec = next(s for s in TAPES if s["id"] == t["id"])
        if fast and spec.get("slow"):
            print(f"skip {t['id']}")
            continue
        e = t["expect"]
        limit = e.get("after", 50_000_000)
        r = step_tm(machines[t["machine"]], t, limit)
        ones = sum(1 for v in r["cells"].values() if v == "1")
        got = dict(halt=r["result"] == "halt", steps=r["steps"], ones=ones,
                   pictured=pictured(r["cells"]), scanned=r["cells"].get(r["head"], "0"),
                   error=r.get("error"))
        want = {k: v for k, v in e.items() if k != "after"}
        ok = all(got[k] == v for k, v in want.items())
        report(ok, t["id"], f"{r['result']} steps={r['steps']} ones={ones}"
               + ("" if ok else f" want {want} got { {k: got[k] for k in want} }"))
        if spec.get("utm") and r["result"] == "halt":
            d = utm_direct(t["cells"], 10_000_000)
            u, uhead = utm_pseudo_after(r["cells"])
            same = d["halt"] and pictured(d["cells"]) == pictured(u) and d["head"] - min(d["cells"] or {0: 0}) == uhead - min(u or {0: 0})
            report(same, t["id"] + " vs direct", f"UTM {r['steps']} steps = pseudo-TM {d['steps']} steps, pseudo-tape {pictured(u)!r}")

    for mid, want in (("pcomp-equals", [(a + 1, a) for a in range(1, 7)]), ("pcomp-equals-patched", [])):
        wrong = []
        for a in range(1, 8):
            for b in range(1, 8):
                r = step_tm(machines[mid], dict(cells="1" * a + "0" + "1" * b, origin=0, head=a), 100000)
                if r["result"] != "halt" or (r["cells"].get(r["head"], "0") == "0") != (a == b):
                    wrong.append((a, b))
        report(wrong == want, f"{mid} sweep 1..7", f"wrong on {wrong or 'none'}")

    for p in sorted((HERE / "ram").glob("pcomp-ram-*.yml")):
        prog = load(p)
        for i, run in enumerate(prog["runs"]):
            r = step_ram(prog, run["input"], run.get("pc"), run.get("limit", 100000))
            e = run["expect"]
            ok = True
            if "halt" in e:
                ok &= (r["stop"] == "halt") == e["halt"]
            if "stop" in e:
                ok &= r["stop"] == e["stop"]
            if "output" in e:
                ok &= r["output"][:len(e["output"])] == e["output"] if not e.get("halt", True) else r["output"] == e["output"]
            for a, w in (run.get("expect_memory") or {}).items():
                ok &= r["mem"][int(a)] == word(w)
            report(ok, f"{prog['id']}[{i}]", f"{r['stop']} output={r['output'][:10]}")

    progs = {m["id"]: m for m in map(load, (HERE / "abacus").glob("pcomp-ab-*.yml"))}
    for pid, prog in sorted(progs.items()):
        for i, run in enumerate(prog["runs"]):
            r = step_ab(progs, pid, run.get("registers") or {})
            e = run["expect"]
            ok = all(r["registers"][k] == v for k, v in e["registers"].items())
            if "depth" in e:
                ok &= r["depth"] == e["depth"]
            regs = {k: v for k, v in r["registers"].items() if v}
            report(ok, f"{pid}[{i}]", f"steps={r['steps']} depth={r['depth']} registers={regs}")

    print("all ok" if not fails else f"{fails} failed")
    return 1 if fails else 0


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "verify"
    if cmd == "convert":
        convert()
    elif cmd == "verify":
        sys.exit(verify("--fast" in sys.argv))
    else:
        print(__doc__)
        sys.exit(2)
