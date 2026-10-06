\ Tiny Scheme-in-Forth: arithmetic S-expression prototype, not full Scheme.
\ EVALCPS handles nested + and * over single-digit integers. Each operand
\ returns through an explicit Forth execution-token continuation.

variable SPTR
variable SEND
variable EVALXT
variable OUTERK
variable OPERAND
variable LEFTVAL
variable RIGHTVAL

: XSINIT ( c-addr u -- ) over SPTR ! + SEND ! ;

: SKIPWS
  begin SPTR @ SEND @ < while
    SPTR @ c@ bl = if 1 SPTR +! else exit then
  repeat ;

: NEXTCH ( -- c ) SKIPWS SPTR @ c@ 1 SPTR +! ;
: CLOSEP ( -- ) NEXTCH drop ;

: KRIGHT ( k-xt op-xt left right -- )
  RIGHTVAL !
  LEFTVAL !
  OPERAND !
  OUTERK !
  LEFTVAL @ RIGHTVAL @ OPERAND @ execute
  CLOSEP
  OUTERK @ execute ;

: KLEFT ( k-xt op-xt left -- )
  ['] KRIGHT EVALXT @ execute ;

: EVAL ( k-xt -- )
  >r NEXTCH
  dup [char] ( = if
    drop NEXTCH
    dup [char] + = if
      drop ['] +
    else
      dup [char] * = if drop ['] * else drop ['] + then
    then
    r> swap ['] KLEFT EVALXT @ execute
  else
    [char] 0 - r> execute
  then ;

: EVALCPS ( c-addr u k-xt -- ) >r XSINIT r> EVALXT @ execute ;

' EVAL EVALXT !

: KPLUS1 ( n -- ) 1 + . ;
: KEND ( n -- ) SPTR @ SEND @ = if . else drop -999 . then ;