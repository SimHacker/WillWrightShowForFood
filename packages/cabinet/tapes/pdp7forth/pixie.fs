\ PIXIE rings in Forth, on RSPPIX, the 1969 ring structure processor
\ (pixie.s has the low-level words, one for each RSPPIX routine). A ring
\ name is a cell holding a name, as RSPPIX's LAW X takes it: RSAVINS, REL,
\ REL1, RNM, or a VARIABLE. RSAVINS is the front door; the RINGS panel
\ starts there. Load after turtle.fs.
decimal

variable rx   variable ry   variable rn
: rings ( -- ) \ forget every ring; RSAVINS is an empty ring
  rsetup  rsavins rnullr ;
: same? ( cell cell -- flag ) @ swap @ xor 8191 and 0= ;
: rnext@ ( cell -- w ) \ the word after the named one, past nonitems
  @ 1+ begin dup @ 0< while @ 8191 and repeat @ ;

\ An element, as RSPPIX forms one: a head of one ring, an atname, and a
\ printname list whose first word names the atname back. ELEMENT puts it
\ in a ring just after the ring's start, as SYMELEC does with INSRT.
: element ( ring -- ) rfel  rel1 @ rx !  rx raddw  rx swap rinsrt ;
: pname ( c-addr u -- ) \ the printname, characters as COPIN keeps them
  begin dup 0> while
    rnm rcdr  over c@ 128 or rnm @ !  1- swap 1+ swap
  repeat 2drop ;
: named ( ring c-addr u -- ) rot element pname ;

\ Going round. RX names each element's ring word in turn, newest first.
: rfirst ( ring -- ) @ rx ! ;
: rnext ( ring -- more? ) rx rcar  rx same? 0= ;
: rcount ( ring -- n )
  0 rn !  dup rfirst  begin dup rnext while 1 rn +! repeat drop  rn @ ;
: .pname ( cell -- ) \ the printname of the element the cell is in
  @ ry !  ry rfindn  ry rcar
  begin ry rnext@ 32768 = 0= while ry rcdr  ry @ @ 127 and emit repeat ;
: .ring ( ring -- )
  dup rfirst  begin dup rnext while rx .pname space repeat drop ;

rings
