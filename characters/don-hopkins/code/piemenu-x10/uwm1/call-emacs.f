\ Load in the Emacs object code.
\
\ EDIT		Execute EMACS
\
\ This version doesn't bother to define Forth names for all the
\ internal subroutines.

requires cload.small.f
requires clink.f

"" me.out clink
cload-base @ constant emacs-entry

code jsrto  ( addr -- )
   sp )+ a0 lmove
   a0 ) jsr
c;

: cstring,  ( string -- )
   count tuck  here  swap cmove   ( len )
   dup allot 0 c,
;

create argstring  "" dontexit  cstring,
create progname   "" micro-emacs cstring,

create argv  progname ,  argstring ,  0 ,

: edit  ( -- )
   0 argv 2  emacs-entry jsrto
   2drop drop
;
alias ed edit
