\ CREATE ... DOES>, with Open Firmware's and CForth's names: (DOES>),
\ >BODY and LASTACF. Needs the full-names kernel, where a word's body is
\ at xt+1 (kernel-names-full.s); load it after prelude.fs.
\
\ A CREATEd word is a colon word, xt+1: (CREATE), xt+2: the DOES> slot,
\ xt+3: the data. (CREATE) pushes the data's address, then goes on into
\ the DOES> code if the slot names any. ;CODE is DOES> with machine code
\ after it, and waits for a PDP-7 assembler written in Forth.
variable lastacf  \ the xt of the latest CREATEd word
: (create) ( -- a ) r> dup 2 + swap 1+ @ ?dup if >r then ;
: create ( "name" -- )
  create  here 1- dup lastacf !  ['] (create) compile,  0 ,
  dup @ -3585 and swap ! ;  \ tag 0: a colon word
: >body ( xt -- a ) 3 + ;
: (does>) ( -- ) r> lastacf @ 2 + ! ;
: does> ( -- ) ['] (does>) compile, ; immediate
