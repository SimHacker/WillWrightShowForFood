\ Memory past 8K: words to fetch, store and copy anywhere in up to 32K
\ of core, the Type 148 memory extension (reference/GUIDE-PDP7.md,
\ "Memory beyond 8K"). Needs code.fs. The design and the next steps
\ are in FORTH-HIGH-MEMORY.md.
\
\ Mitch's kernel lives in bank 0 and never leaves it: every pointer it
\ keeps (IP, RP, SP, HERE, the links) is 13 bits, and indirect addresses
\ stay in the current bank while extend mode is off, which is how the
\ kernel runs. These words turn extend mode on (EEM) only around their
\ own indirect fetches and stores, and off again (LEM) before the next
\ thread cell, so the kernel never sees it on.
\
\ An interrupt turns extend mode off. interrupt.fs's handler returns
\ with EMIR, which puts it back as it was, so a copy interrupted half
\ way goes on in extend mode. Any other handler must do the same.
\
\ An extended address is an ordinary number, 0 to 32767: the bank in the
\ top two bits, 8192 words a bank. 24576 X@ reads bank 3's first word.
\ A VARIABLE pushes its address as "law addr", 76xxxx, negative: these
\ words take any negative address as that, in bank 0, so VARIABLEs work.
\
\   XMEM?  ( -- flag )            the extension is there (more than 8K)
\   X@     ( xaddr -- w )         fetch from anywhere
\   X!     ( w xaddr -- )         store anywhere
\   XMOVE  ( from to n -- )       copy n words, any bank to any bank,
\                                 overlapping or not, as MOVE does
\   XHERE, XALLOT, X,, XROOM      high memory handed out as HERE is
\
\ A copy up the addresses uses auto-index 015 and 016, free in the
\ kernel: LAC I 015, DAC I 016, ISZ, about seven cycles a word. A
\ 63-word hand pose is about 450 cycles, a whole bank about 60,000. A
\ copy whose destination overlaps the end of its source runs down the
\ addresses instead, with two pointers stepped by hand: about twice as
\ slow.

octal

: eem, ( -- ) 707702 , ;   \ extend mode on
: lem, ( -- ) 707704 , ;   \ extend mode off
: sem, ( -- ) 707701 , ;   \ skip if extend mode is on

variable xm-a   variable xm-n   variable xm-p   variable xm-q
variable xm-1   1 xm-1 !
variable xm--1  -1 xm--1 !
variable xm-13  17777 xm-13 !
variable xm-15  77777 xm-15 !

\ AC to a 15-bit address, a subroutine (JMS): negative is a LAW-form
\ address in bank 0, 13 bits; anything else keeps its 15.
create xm-norm
  0 ,
  spa,  xm-13 and,  xm-15 and,
  xm-norm ind jmp,

\ XMEM? ( -- flag )  EEM does nothing on a machine with only 8K, so SEM
\ doesn't skip, SKP skips CMA, and AC stays 0. With the extension, SEM
\ skips SKP and CMA makes AC -1.
code xmem?
  cla,  eem,  sem,  skp,  cma,  lem,
  push,
end-code

\ X@ ( xaddr -- w )
code x@
  pop,  xm-norm jms,  xm-a dac,
  eem,  xm-a ind lac,  lem,
  push,
end-code

\ X! ( w xaddr -- )
code x!
  pop,  xm-norm jms,  xm-a dac,  pop,
  eem,  xm-a ind dac,  lem,
  next,
end-code

\ Up the addresses, a subroutine (JMS). 015 and 016 are one less than
\ the first source and destination words, since an auto-index register
\ steps before it is used; XM-N is minus the count, for ISZ.
create xm-up
  0 ,
  eem,
  here
    15 ind lac,  16 ind dac,
    xm-n isz,  jmp,
  lem,
  xm-up ind jmp,

\ Down the addresses, a subroutine (JMS): XM-P and XM-Q are the last
\ source and destination words, stepped down by hand.
create xm-down
  0 ,
  eem,
  here
    xm-p ind lac,  xm-q ind dac,
    xm-p lac,  xm--1 tad,  xm-p dac,
    xm-q lac,  xm--1 tad,  xm-q dac,
    xm-n isz,  jmp,
  lem,
  xm-down ind jmp,

\ (XMOVE-UP) ( from to n -- ) and (XMOVE-DOWN) ( from-last to-last n -- ),
\ n at least 1, addresses already 15 bits.
code (xmove-up)
  pop,  cma,  xm-1 tad,  xm-n dac,
  pop,  xm--1 tad,  16 dac,
  pop,  xm--1 tad,  15 dac,
  xm-up jms,  next,
end-code
code (xmove-down)
  pop,  cma,  xm-1 tad,  xm-n dac,
  pop,  xm-q dac,
  pop,  xm-p dac,
  xm-down jms,  next,
end-code

decimal

\ XA ( addr -- xaddr )  as XM-NORM does it.
: xa ( addr -- xaddr ) dup 0< if 8191 and else 32767 and then ;

\ XMOVE ( from to n -- )  copy n words from anywhere to anywhere. Down
\ the addresses only when the destination starts inside the source, so
\ no word is overwritten before it is copied.
variable xm-f   variable xm-t
: xmove ( from to n -- )
  dup 0> 0= if drop 2drop exit then
  >r  xa xm-t !  xa xm-f !
  xm-t @ xm-f @ -  dup 0>  swap r@ <  and if
    xm-f @ r@ + 1-  xm-t @ r@ + 1-  r> (xmove-down)
  else
    xm-f @  xm-t @  r> (xmove-up)
  then ;

\ High memory handed out from bank 1 up, as HERE hands out bank 0.
\ Nothing lives there but what a program puts there. The cabinet's
\ extended machines have all 32K; with only 8K, XROOM is 0.
variable xhere   8192 xhere !
: xlimit ( -- n ) xmem? if 32767 1+ else 8192 then ;
: xroom ( -- n ) xlimit xhere @ - ;
: xallot ( n -- ) xhere +! ;
: x, ( w -- ) xhere @ x!  1 xallot ;
