\ Program interrupts, handled in Forth. Needs code.fs.
\
\ The PDP-7 has one interrupt level. With ION on, any device flag makes
\ the hardware do JMS 0: the PC goes into 0, execution goes on at 1, and
\ ION goes off. Forth can't run a word right there: the interrupted
\ primitive may be half way through a stack, or using the kernel's
\ scratch cells. So the machine-level handler does the least it can:
\
\   isr:       dac int-ac        keep AC; LAC and DAC leave the link be
\              lac hook          "jmp dispatch"
\              dac next          NEXT's first word, for one time round
\              lac int-ac
\              jmp i 0           back, interrupts still off
\
\ and the next time the interrupted thread reaches NEXT, where nothing is
\ half done, it lands in the dispatcher instead:
\
\   dispatch:  lac xct-word      "xct i 010": NEXT is itself again
\              dac next
\              lac 010           push IP, as nest (the CAL trap) does
\              dac i 011
\              lac entry         IP := (INTERRUPT)'s body - 1
\              dac 010
\              jmp next
\
\ (INTERRUPT) runs the word in INTERRUPT-VECTOR, then (RTI) turns
\ interrupts back on, if they are still wanted, and leaves through EXIT,
\ which pops the interrupted IP. The thread never knows.
\
\ The handler runs with interrupts off and must clear whatever
\ interrupted, or it interrupts again as soon as they are back on. Ask
\ each device in turn, a skip chain, as PDP-7 programs do. A primitive
\ that loops (KEY waiting for a character) never reaches NEXT, so a
\ handler waits until it returns.

octal

variable interrupts?        \ true while Forth wants ION after each handler
variable interrupt-vector   \ the handler's xt

\ (RTI) ( -- )  ION if wanted, then EXIT from (INTERRUPT).
code (rti)
  interrupts? lac,  sza,  700042 ,  ' exit 1+ jmp,
end-code

: (interrupt) ( -- ) interrupt-vector @ execute  (rti) ;

variable int-ac   variable hook   variable xct-word   variable entry
next-addr @ xct-word !
' (interrupt) entry !

create dispatch
  xct-word lac,  next-addr dac,
  ip# lac,  rp# ind dac,
  entry lac,  ip# dac,
  next,
dispatch 600000 or hook !   \ "jmp dispatch", for ISR to plant in NEXT

create isr
  int-ac dac,  hook lac,  next-addr dac,  int-ac lac,
  0 ind jmp,

\ INTERRUPTS-OFF ( -- )  the default handler too: an interrupt nobody
\ has claimed turns them off rather than coming back for ever.
: interrupts-off ( -- ) 0 interrupts? !  iof ;
' interrupts-off interrupt-vector !

\ INTERRUPTS-ON ( -- )  location 1 jumps to ISR; then ION.
: interrupts-on ( -- )
  isr 600000 or 1 !  -1 interrupts? !  ion ;

decimal
