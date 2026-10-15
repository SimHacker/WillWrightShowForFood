\ High memory for kernel-names-full-extended.s, whose kernel already has
\ XMEM?, X@, X! and XMOVE as primitives. This is xmem.fs's remainder:
\ the words that hand out high memory, as HERE and ALLOT hand out bank 0.
\ FORTH-HIGH-MEMORY.md has the design.

decimal
variable xhere   8192 xhere !
: xlimit ( -- n ) xmem? if 32767 1+ else 8192 then ;
: xroom ( -- n ) xlimit xhere @ - ;
: xallot ( n -- ) xhere +! ;
: x, ( w -- ) xhere @ x!  1 xallot ;
