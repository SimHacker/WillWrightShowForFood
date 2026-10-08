#!/usr/bin/env python3
"""Make tapes/pdp7forth/kernel-names-full.s from kernel.s: usage: make-forth-names-full.py kernel.s kernel-names-full.s"""
import re, sys

src, dst = sys.argv[1], sys.argv[2]
L = open(src).read().split("\n")
norm = lambda s: re.sub(r"\s+", " ", s).strip()
six = lambda s: [ord(c) - 0o40 for c in s]


def packed(name):
    out = []
    for k in range(0, len(name), 3):
        g = name[k : k + 3]
        c = six(g.ljust(3))
        out.append(f"\t0{(c[0] << 12) | (c[1] << 6) | c[2]:06o}\t\" {g}")
    return out


# Headers: the whole name, in order, before the header word; the old name word after it goes.
out, i, n = [], 0, 0
while i < len(L):
    m = re.match(r"^(h\.[\w.]+):.*\" (.*)$", L[i])
    if m:
        out += packed(m.group(2).strip().upper())
        out.append(L[i])
        assert re.match(r"^\s+0[0-7]{6}\s*$", L[i + 1]), L[i + 1]
        i += 2
        n += 1
        continue
    out.append(L[i])
    i += 1
assert n == 84, n
L = out


def tabify(line):
    if not line.strip() or line.startswith('"'):
        return line
    m = re.match(r"^(\S+:)?\s+(\S.*?)?(\s+(\".*))?$", line)
    s = (m.group(1) or "") + "\t" + (m.group(2) or "")
    if m.group(4):
        col = (len(s.expandtabs(8)) // 8 + 1) * 8
        s += "\t"
        while col < 24:
            s += "\t"
            col += 8
        s += m.group(4)
    return s


def replace(old, new):
    global L
    o = [norm(x) for x in old.strip("\n").split("\n")]
    k = len(o)
    hits = [j for j in range(len(L) - k + 1) if [norm(x) for x in L[j : j + k]] == o]
    if len(hits) != 1:
        sys.exit(f"{len(hits)} matches for: {o[0]} ... {o[-1]}")
    j = hits[0]
    L = L[:j] + [tabify(x) for x in new.strip("\n").split("\n")] + L[j + k :]


replace(
    """
" PDP-7 Forth -- kernel
"
""",
    """
" PDP-7 Forth -- kernel, full names
"
" A copy of kernel.s (VARIANTS.yml) that keeps every character of a name.
" A word is [name] [header] [body]: the name, three SIXBIT characters a
" word, space-padded, lies just before the header, as in Open Firmware.
" The xt is still the header's address; the body is at xt+1, not xt+2.
" parse, find, mkcell, mkhdr, abort and WORDS differ from kernel.s.
"
""",
)

replace(
    """
1:      dac p
        dac 013
        lac i p
""",
    """
1:      dac p
        lac i p
""",
)

replace(
    """
2:      lac i 013       " name word at p+1
        sad tname
        jmp 5f
        jmp 3b
4:      lac m1          " not found
        jmp i find
5:      lac p           " found
        jmp i find

p:      0
tcnt:   0               " count field of the name being sought
tname:  0               " packed SIXBIT name word being sought
""",
    """
2:      lac tcnt        " the name is ceil(length/3) words before p
        cll
        lrs 13
        dac fk
        dzm fn
6:      isz fn
        lac fk
        tad m3
        dac fk
        sma sza
        jmp 6b
        lac fn
        cma
        tad d1
        tad p
        dac fq          " p - fn: the name's first word
        lac i fq
        sad tname
        skp
        jmp 3b
        lac fn          " then words 2..fn against tnbuf
        cma
        tad d2
        sna
        jmp 5f
        dac fk
        lac tnbp
        dac fr
7:      isz fq
        isz fr
        lac i fq
        sad i fr
        skp
        jmp 3b
        isz fk
        jmp 7b
        jmp 5f
4:      lac m1          " not found
        jmp i find
5:      lac p           " found
        jmp i find

p:      0
tcnt:   0               " count field of the name being sought
tname:  0               " first packed SIXBIT word of the name sought
fn:     0
fk:     0
fq:     0
fr:     0
""",
)

replace(
    """
" Returns AC = wlen (0 at end of line). Sets wptr and wlen, plus tcnt and
" tname (count field and case-folded SIXBIT of the first 3 characters,
" space-padded) ready for find. The count field keeps only the low 5
" bits of the length.
""",
    """
" Returns AC = wlen (0 at end of line). Sets wptr and wlen, plus tcnt,
" tnbuf and tnw (count field, and the token in case-folded SIXBIT three
" to a word, space-padded, in tnw words) and tname (tnbuf's first word),
" ready for find. The count field keeps only the low 5 bits of the length.
""",
)

replace(
    """
        lac wlen
        dac t4          " characters left to pack
        lac m3
        dac t5          " 3 slots
        dzm tname
6:      lac tname
        cll
        als 6
        dac tname
        lac t4
        sna
        jmp 7f          " pad with SIXBIT space (0)
        tad m1
        dac t4
        lac i 014
        jms fold
        tad om40
        and o77
        xor tname
        dac tname
7:      isz t5
        jmp 6b
5:      lac wlen
        jmp i parse
""",
    """
        lac wlen
        dac t4          " characters left to pack
        lac tnbm
        dac pq
        dzm tnw
8:      lac m3
        dac t5          " 3 slots
        dzm pw
6:      lac pw
        cll
        als 6
        dac pw
        lac t4
        sna
        jmp 7f          " pad with SIXBIT space (0)
        tad m1
        dac t4
        lac i 014
        jms fold
        tad om40
        and o77
        xor pw
        dac pw
7:      isz t5
        jmp 6b
        isz pq
        lac pw
        dac i pq
        isz tnw
        lac t4
        sza
        jmp 8b
        lac tnbuf
        dac tname
5:      lac wlen
        jmp i parse

pw:     0
pq:     0
tnw:    0               " words in tnbuf
""",
)

replace(
    """
" An xt is a header address (DESIGN.md, Threading). mkcell turns one
" into the thread cell that calls it: optab[tag] | (xt + 2).
""",
    """
" An xt is a header address (DESIGN.md, Threading). mkcell turns one
" into the thread cell that calls it: optab[tag] | (xt + 1).
""",
)

replace(
    """
        tad d2          " body
""",
    """
        tad d1          " body
""",
)

replace(
    """
" mkhdr: parse a name and lay down a header at dp with tag AC. If the
" name (its length and first three characters) is already defined, say
" "<name> redefined" first.
""",
    """
" mkhdr: parse a name and lay down the name, then a header, at dp with
" tag AC. If the name is already defined, say "<name> redefined" first.
""",
)

replace(
    """
1:      lac dp
        dac hadr
        lac latest
        cma
        tad dp          " link = distance - 1
        dac t5
        and lhigh       " must fit in 9 bits (DESIGN.md, Dictionary/headers)
        sza
        jmp far
        lac t5
        tad tcnt
        tad htag
        jms comp
        lac tname
        jms comp
        lac hadr
        jmp i mkhdr
""",
    """
1:      lac dp
        dac hbase
        lac tnw
        cma
        tad d1
        dac fk          " -tnw
        lac tnbm
        dac hq
2:      isz hq
        lac i hq
        jms comp
        isz fk
        jmp 2b
        lac dp
        dac hadr
        lac latest
        cma
        tad dp          " link = distance - 1
        dac t5
        and lhigh       " must fit in 9 bits (DESIGN.md, Dictionary/headers)
        sza
        jmp 3f
        lac t5
        tad tcnt
        tad htag
        jms comp
        lac hadr
        jmp i mkhdr
3:      lac hbase       " give the name back
        dac dp
        jmp far

hbase:  0               " dp before the name
hq:     0
""",
)

replace(
    """
        dac dp          " discard the partial definition
        dzm cdp
""",
    """
        lac hbase
        dac dp          " discard the partial definition and its name
        dzm cdp
""",
)

replace(
    """
" WORDS ( -- )  list the dictionary, newest first. A header keeps only
" the first three characters, so a longer name prints as those followed
" by one underscore per missing character (EXIT -> EXI_). Breaks lines
" at about 60 columns: a Model 33 doesn't wrap.
""",
    """
" WORDS ( -- )  list the dictionary, newest first, every name in full.
" Breaks lines at about 60 columns: a Model 33 doesn't wrap.
""",
)

replace(
    """
        lac m3
        dac wk          " stored characters left
        lac wp
        tad d1
        dac t6
        lac i t6        " packed name word
        lmq
2:      cla
        cll
        lls 6           " next SIXBIT character
        tad o40
        jms putc
        isz wr
        skp
        jmp 3f          " whole name printed
        isz wk
        jmp 2b
4:      lac o137        " '_' for each character not stored
        jms putc
        isz wr
        jmp 4b
3:      lac o40
""",
    """
        lac wcnt
        dac wk
        lac wp
        dac t6
4:      lac t6          " back one word for every three characters
        tad m1
        dac t6
        lac wk
        tad m3
        dac wk
        sma sza
        jmp 4b
6:      lac m3
        dac wk          " characters left in this word
        lac i t6        " packed name word
        lmq
        isz t6
2:      cla
        cll
        lls 6           " next SIXBIT character
        tad o40
        jms putc
        isz wr
        skp
        jmp 3f          " whole name printed
        isz wk
        jmp 2b
        jmp 6b
3:      lac o40
""",
)

replace(
    """
nbufp:  nbuf-1
""",
    """
nbufp:  nbuf-1
tnbm:   tnbuf-1
tnbp:   tnbuf
""",
)

replace(
    """
nbuf:   .=.+022         " digits for "." (18 in base 2)
""",
    """
nbuf:   .=.+022         " digits for "." (18 in base 2)
tnbuf:  .=.+033         " the parsed token, 3 SIXBIT characters a word (80 max)
""",
)

open(dst, "w").write("\n".join(L))
