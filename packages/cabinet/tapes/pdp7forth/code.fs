\ CODE words, written in Forth. There is no PDP-7 assembler in Forth
\ yet, so this is the least of one: each opcode word adds its operation
\ to an address and lays the instruction down at HERE with , as an
\ assembler would. Then defining words for the four shapes an IOT takes
\ from Forth: a pulse, a read, a skip and a write. Needs the full-names
\ kernel (a word's body at xt+1), prelude.fs and does.fs.
\
\ How the kernel runs code (kernel-names-full.s, NEXT):
\
\   next:  xct i 010    IP (010) steps on; run the thread cell
\          dac i 012    push AC: only LAC and LAW cells get here
\          jmp next
\
\ A colon word's cell is CAL (its bare address), a constant's LAC, a
\ variable's LAW, and a primitive's JMP to its body, which ends JMP
\ NEXT. So a CODE word is a header tagged "primitive" with machine
\ words after it, and nothing more. 010, 011 and 012 are IP, RP and SP,
\ auto-index registers: "dac i 012" pushes, but "lac i 012" would step
\ SP up, not pop, so POP, goes the long way round.
\
\ Machine code runs between thread cells, so nothing else (an interrupt
\ handler in interrupt.fs, say) sees a CODE word half done.

decimal

\ CODE ( "name" -- )  a primitive with no body yet. VARIABLE lays down a
\ header (tag 3, variable) and one cell; take the cell back and retag
\ the header 1, primitive. The tag is header bits 007000: -3585 is
\ 770777, the mask that clears it, and 512 is 001000.
: code ( "name" -- )
  variable  -1 allot
  here 1-  dup @ -3585 and 512 or  swap ! ;

\ END-CODE ( -- )  nothing to do: the last instruction jumped away.
: end-code ( -- ) ;

octal

\ Memory reference: ( addr -- ) lays down opcode+addr. Only the low 13
\ bits of addr count: a VARIABLE pushes its LAW cell, "law addr", which
\ is 76xxxx, and @ and ! look no further than 13 bits either. That LAW
\ word has the indirect bit (020000) set already, so IND can't be a bit
\ in the address: it is a flag the next opcode word takes, and "12 ind
\ dac," is "dac i 012".
variable indirect?
: ind ( addr -- addr ) -1 indirect? ! ;
: op: ( opcode "name" -- )
  create ,
  does> @ swap 17777 and +
        indirect? @ if 20000 or  0 indirect? ! then  , ;
200000 op: lac,   040000 op: dac,   340000 op: tad,   600000 op: jmp,
100000 op: jms,   440000 op: isz,   140000 op: dzm,   500000 op: and,
240000 op: xor,   540000 op: sad,   760000 op: law,

\ Operate: ( -- ) lays the one word down.
: opr: ( word "name" -- ) create , does> @ , ;
740000 opr: nop,  750000 opr: cla,  740001 opr: cma,  741000 opr: skp,
740200 opr: sza,  741200 opr: sna,  740100 opr: sma,  741100 opr: spa,
740040 opr: hlt,

\ The kernel's registers, and NEXT. Every primitive ends "jmp next";
\ DUP's body is "jms un, dac i 012, jmp next", so borrow its last word.
10 constant ip#   11 constant rp#   12 constant sp#
' dup 3 + @ constant jmp-next
jmp-next 17777 and constant next-addr
: next, ( -- ) jmp-next , ;

\ PUSH, ( -- )  push AC, then on to the next cell.
: push, ( -- ) sp# ind dac,  next, ;

\ POP, ( -- )  AC := the top of the stack, popped. "law 17777" is -1.
variable pop-t
: pop, ( -- )
  sp# lac,  pop-t dac,          \ the old SP points at the value
  17777 law,  sp# tad,  sp# dac,  \ SP := SP - 1
  pop-t ind lac, ;              \ AC := the value

\ IOT words. An IOT is 70DDPP: device DD, pulses PP. Bit 010 clears AC
\ before the pulses, so a read with it set is a plain read.
\   iot-pulse  name ( -- )       the pulses, nothing else
\   iot-read   name ( -- x )     AC cleared, the device ORs in, pushed
\   iot-skip   name ( -- flag )  cla; IOT; skp; cma: -1 if it skipped
\   iot-write  name ( x -- )     AC := x, then the pulses
: iot-pulse ( iot "name" -- ) code ,  next, ;
: iot-read ( iot "name" -- ) code 10 or ,  push, ;
: iot-skip ( iot "name" -- ) code cla, ,  skp, cma,  push, ;
: iot-write ( iot "name" -- ) code pop, ,  next, ;

\ The interrupt system (device 00, in the CPU) and the teletype.
700042 iot-pulse ion        \ interrupts on, after the next instruction
700002 iot-pulse iof        \ interrupts off
700301 iot-skip key?        \ KSF: a key is waiting; KEY still reads it
700401 iot-skip tty-done?   \ TSF: the teleprinter has finished a character
700402 iot-pulse tty-ack    \ TCF: clear that flag

decimal
