#!/usr/bin/env python3
"""Make tapes/pdp7forth/kernel-names-full-extended.s from kernel-names-full.s.

usage: make-forth-extended.py kernel-names-full.s kernel-names-full-extended.s

The -extended suffix names a parallel implementation that knows about the Type 148 memory
extension (FORTH-HIGH-MEMORY.md). The parent is copied line for line, and the changes are
applied as replacements that must match exactly once, so a change upstream is carried over by
rerunning this. Change the parent, not the output.
"""
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
    return "\n".join(out)


def replace(old, new):
    global L
    o = [norm(x) for x in old.strip("\n").split("\n")]
    k = len(o)
    hits = [j for j in range(len(L) - k + 1) if [norm(x) for x in L[j : j + k]] == o]
    if len(hits) != 1:
        sys.exit(f"{len(hits)} matches for: {o[0]} ... {o[-1]}")
    j = hits[0]
    L = L[:j] + new.strip("\n").split("\n") + L[j + k :]


def header(label, name, prev, tag="tag.prim"):
    """A full-names header: the name, then count|tag|link to the previous header."""
    count = len(name)
    return f"{packed(name)}\n{label}:\t0{count * 0o20000:06o}+{tag}+{label}-{prev}-1\t\" {name}"


# The file says what it is.
replace(
    '" From the repo root: "make" assembles to build/kernel.lst; "make run"',
    '''" kernel-names-full-extended.s: kernel-names-full.s with the Type 148 memory
" extension, made by scripts/make-forth-extended.py; edit the parent and
" rerun it. FORTH-HIGH-MEMORY.md has the design. The kernel itself still
" runs in bank 0 with extend mode off: only X@, X! and XMOVE turn it on,
" for their own references, and off again before NEXT.
"
" From the repo root: "make" assembles to build/kernel.lst; "make run"''',
)

# Auto-index 015 and 016 are XMOVE's now.
replace(
    '''0		" 015: free
0		" 016: free''',
    '''0		" 015: XMOVE's source, extended
0		" 016: XMOVE's destination, extended''',
)

# The new primitives, chained after .( so latest names the last of them.
NEW = f'''
" --- Memory past 8K (FORTH-HIGH-MEMORY.md) ---
" An extended address is 0..32767, the bank in its top two bits. A
" negative address is a VARIABLE's LAW form, in bank 0. EEM turns extend
" mode on, so an indirect reference is 15 bits; LEM turns it off before
" NEXT. An interrupt turns it off too: a handler that returns with EMIR
" puts it back (interrupt.fs).
xeem = 0707702
xlem = 0707704
xsem = 0707701

" xnorm: AC to a 15-bit address (JMS).
xnorm:	0
	spa
	and xm13
	and xm15
	jmp i xnorm
" xpop: AC := the top of the stack, popped (JMS). 012 is auto-index, so
" "lac i 012" would step it up: read through t4, then step SP down.
xpop:	0
	lac 012
	dac t4
	tad m1
	dac 012
	lac i t4
	jmp i xpop
xm13:	017777
xm15:	077777
xa:	0
xn:	0
xp:	0
xq:	0

" XMEM? ( -- flag )  true with the extension: EEM then SEM skips.
{header("h.xmemq", "XMEM?", "h.dotp")}
xmemq:	cla
	xeem
	xsem
	skp
	cma
	xlem
	dac i 012
	jmp next

" X@ ( xaddr -- w )
{header("h.xfetch", "X@", "h.xmemq")}
xfetch:	jms un
	jms xnorm
	dac xa
	xeem
	lac i xa
	xlem
	dac i t3
	jmp next

" X! ( w xaddr -- )
{header("h.xstore", "X!", "h.xfetch")}
xstore:	jms bin
	jms xnorm
	dac xa
	lac i t3	" w
	xeem
	dac i xa
	xlem
	lac 012		" drop w
	tad m1
	dac 012
	jmp next

" XMOVE ( from to n -- )  n words, any bank to any bank, as MOVE does:
" down the addresses only when the destination starts inside the
" source, so no word is overwritten before it is read.
{header("h.xmove", "XMOVE", "h.xstore")}
xmove:	jms xpop	" n
	dac xn
	jms xpop	" to
	jms xnorm
	dac xq
	jms xpop	" from
	jms xnorm
	dac xp
	lac xn		" nothing to do unless n > 0
	sma
	sna
	jmp next
	lac xq		" d = to - from
	cma
	tad d1
	tad xp
	cma
	tad d1
	sma		" d < 0: up
	sna		" d = 0: nothing to do
	jmp xmup
	cma		" d - n < 0, inside the source: down
	tad d1
	tad xn
	cma
	tad d1
	spa
	jmp xmdn
xmup:	lac xp		" 015, 016 one before the first words
	tad m1
	dac 015
	lac xq
	tad m1
	dac 016
	lac xn
	cma
	tad d1
	dac xn		" -n for ISZ
	xeem
xmu1:	lac i 015
	dac i 016
	isz xn
	jmp xmu1
	xlem
	jmp next
xmdn:	lac xp		" the last words, stepped down by hand
	tad xn
	tad m1
	dac xp
	lac xq
	tad xn
	tad m1
	dac xq
	lac xn
	cma
	tad d1
	dac xn
	xeem
xmd1:	lac i xp
	dac i xq
	lac xp
	tad m1
	dac xp
	lac xq
	tad m1
	dac xq
	isz xn
	jmp xmd1
	xlem
	jmp next
'''

replace(
    'latest:	h.dotp		" head of the dictionary chain',
    NEW + '\nlatest:	h.xmove		" head of the dictionary chain',
)

open(dst, "w").write("\n".join(L))
print(f"wrote {dst}")
