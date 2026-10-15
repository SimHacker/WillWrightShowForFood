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
\
\   XMEM?  ( -- flag )            the extension is there (more than 8K)
\   X@     ( xaddr -- w )         fetch from anywhere
\   X!     ( w xaddr -- )         store anywhere
\   >XMOVE ( addr xaddr n -- )    copy n words up, from bank 0
\   XMOVE> ( xaddr addr n -- )    copy n words down, into bank 0
\   XHERE, XALLOT, X,, XROOM      high memory handed out as HERE is
\
\ The copies use auto-index 015 and 016, free in the kernel: a word is
\ LAC I 015, DAC I 016 and ISZ, about seven cycles. A 63-word hand pose
\ is about 450 cycles, a whole bank about 60,000.

octal

: eem, ( -- ) 707702 , ;   \ extend mode on
: lem, ( -- ) 707704 , ;   \ extend mode off
: sem, ( -- ) 707701 , ;   \ skip if extend mode is on

variable xm-a   variable xm-n
variable xm-1   1 xm-1 !
variable xm--1  -1 xm--1 !

\ XMEM? ( -- flag )  EEM does nothing on a machine with only 8K, so SEM
\ doesn't skip, SKP skips CMA, and AC stays 0. With the extension, SEM
\ skips SKP and CMA makes AC -1.
code xmem?
  cla,  eem,  sem,  skp,  cma,  lem,
  push,
end-code

\ X@ ( xaddr -- w )
code x@
  pop,  xm-a dac,
  eem,  xm-a ind lac,  lem,
  push,
end-code

\ X! ( w xaddr -- )
code x!
  pop,  xm-a dac,  pop,
  eem,  xm-a ind dac,  lem,
  next,
end-code

\ The copy, a subroutine (JMS). 015 and 016 are one less than the first
\ source and destination words, since an auto-index register steps
\ before it is used; XM-N is minus the count, for ISZ.
create xm-loop
  0 ,
  xm-n lac,  sna,  xm-loop ind jmp,
  eem,
  here
    15 ind lac,  16 ind dac,
    xm-n isz,  jmp,
  lem,
  xm-loop ind jmp,

\ ( from to n -- ) off the stack into XM-N, 016 and 015, a subroutine.
create xm-args
  0 ,
  pop,  cma,  xm-1 tad,  xm-n dac,
  pop,  xm--1 tad,  16 dac,
  pop,  xm--1 tad,  15 dac,
  xm-args ind jmp,

\ >XMOVE ( addr xaddr n -- ) and XMOVE> ( xaddr addr n -- ): the same
\ copy. An address below 8192 is in bank 0 either way, so one word
\ would do; the two names say which end is the extended one.
code >xmove   xm-args jms,  xm-loop jms,  next,  end-code
code xmove>   xm-args jms,  xm-loop jms,  next,  end-code

decimal

\ High memory handed out from bank 1 up, as HERE hands out bank 0.
\ Nothing lives there but what a program puts there. The cabinet's
\ extended machines have all 32K; with only 8K, XROOM is 0.
variable xhere   8192 xhere !
: xlimit ( -- n ) xmem? if 32767 1+ else 8192 then ;
: xroom ( -- n ) xlimit xhere @ - ;
: xallot ( n -- ) xhere +! ;
: x, ( w -- ) xhere @ x!  1 xallot ;
