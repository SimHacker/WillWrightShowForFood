\ DATAHAND: a hand on device 57 (src/plugins/datahand.ts), drawn by the 3D
\ turtle (turtle3d.fs). The device reports the hand the way the turtle
\ walks it: start at the wrist in the palm's frame, then for each finger
\ four bones of YAW, PITCH and FWD. Five branches from one REMEMBER.
\ Under it, the flex of each finger, 0 straight to 16384 curled, as a
\ DataGlove's fibre-optic sensors measured it. VPL's RB2 did the same:
\ datahand values to skeleton joints (Body Electric), joints to pictures.
\
\ DATAHAND runs until a key. 30 VIEW turns the hand to be seen from the
\ side; 3 SPINNING ! turns it round, three degrees a frame.
\
\ Needs code.fs (IOT words), tags.fs (hover names) and turtle3d.fs.

octal
705701 iot-skip  hand-new?    \ GSF ( -- flag ) a new frame waits
705712 iot-read  hand-status  \ GRS ( -- n ) 1 a hand, 2 right, 4 a demo
705704 iot-pulse hand-latch   \ GLT ( -- ) take it, clear the flag
705721 iot-skip  hand-seen?   \ GSH ( -- flag ) the latched frame has one
705732 iot-read  hand@+       \ GRD ( -- n ) register, step the index
705724 iot-write hand-index!  \ GLI ( n -- )
705744 iot-pulse hand-ack     \ GCF ( -- ) clear the flag
705764 iot-write hand-ie!     \ GIE ( flag -- ) interrupt on a new frame
700601 iot-skip  dsp-stopped?  \ IDSI ( -- flag ) at the end of its list
700604 iot-write dsp-start     \ IDLA ( addr -- ) run the list at addr
decimal

\ The registers (datahand.ts has the full table).
1 constant h-wrist   73 constant h-flex   78 constant h-pinch
: reg ( n -- value ) hand-index! hand@+ ;

\ Boxes, and Type 342 text at the beam, scale 2: three 6-bit codes a
\ word, the 342's ESC (37 octal) back to vectors. 12 pixels a letter.
variable x0   variable y0   variable x1   variable y1
: rect ( x0 y0 x1 y1 -- ) y1 ! x1 ! y0 ! x0 !
  x0 @ y0 @ beam  x1 @ y0 @ line  x1 @ y1 @ line
  x0 @ y1 @ line  x0 @ y0 @ line ;
variable txw   variable txn
: >342 ( c -- code ) dup 96 > if 32 - then  dup 63 > if 64 - then ;
: char, ( code -- )
  txw @ 64 * + txw !  1 txn +!  txn @ 3 = if txw @ dl,  0 txw !  0 txn ! then ;
: text ( c-addr u -- )
  131072 dl,  28752 dl,  0 txw !  0 txn !  dup 12 * bx +!
  0 do dup i + c@ >342 char, loop drop
  31 char,  begin txn @ while 0 char, repeat  36928 dl, ;
: centred ( c-addr u cx y -- ) >r  over 6 * -  r> beam  text ;

: new-frame ( -- )
  12367 dlist !  8192 dlist 1+ !  98304 dlist 2 + !
  131072 dlist 3 + !  1024 dlist 4 + !
  dlist 3 + dl> !  0 bx !  0 by !  -1 display ! ;

\ Where each landmark landed on the screen, as the turtle reached it.
create spots 42 allot
: mark ( n -- ) dup + spots + >r  at3 r@ 1+ !  r> ! ;
: spot ( n -- x y ) dup + spots + dup @ swap 1+ @ ;
: tip ( n -- ) spot 4 - swap 4 - swap 2dup beam
  over 8 + over line  over 8 + over 8 + line  over over 8 + line  line ;

\ The hand: the turtle to the wrist in the palm's frame, then a finger.
: palm ( -- )
  h-wrist hand-index!
  hand@+ 16 *  hand@+ 16 *  hand@+ 16 *  t3 2 + ! t3 1+ ! t3 !
  9 0 do hand@+ hv i + ! loop  pivot remember ;
: bone ( landmark -- ) hand@+ yaw  hand@+ pitch  hand@+ fwd  mark ;
: finger ( f -- ) recall  4 * 5 1 do dup i + bone loop  4 + tip ;
: hand ( -- )
  palm  0 mark  13 hand-index!
  tag" Thumb" 0 finger    tag" Index finger" 1 finger
  tag" Middle finger" 2 finger   tag" Ring finger" 3 finger
  tag" Little finger" 4 finger
  tag" Knuckles" 5 spot beam  9 spot line  13 spot line  17 spot line ;

\ The flex meters: an outline drawn once, the level drawn each frame.
: meter-x ( f -- x ) 170 * 112 + ;
: outline ( f -- ) meter-x dup 60 over 50 + 200 rect ;
: level ( f -- ) dup h-flex + reg 140 16384 */ 60 + y1 !  meter-x
  4 1 do dup i 12 * + dup 60 beam  y1 @ line loop drop ;
: names ( -- )
  s" THUMB" 137 30 centred   s" INDEX" 307 30 centred
  s" MIDDLE" 477 30 centred  s" RING" 647 30 centred
  s" PINKY" 817 30 centred ;

\ The backdrop is drawn once; STILL remembers where it ends, and each
\ frame goes on from there (terminator first: the 340 may be running).
variable still   variable still-x   variable still-y
: backdrop ( -- )
  new-frame  tag" Flex, 0 straight to 16384 curled"
  5 0 do i outline loop  names  notag
  dl> @ still !  bx @ still-x !  by @ still-y ! ;
: rewind ( -- )
  131072 still @ !  1024 still @ 1+ !
  still @ dl> !  still-x @ bx !  still-y @ by ! ;

\ FIT ( -- )  scale and centre the hand between the meters and the
\ captions, whatever its size in the camera, from the box around its
\ 21 points. Turns go about the hand's centre. A small hand is
\ enlarged at most 8 to 5.
79 constant h-points
variable lox   variable hix   variable loy   variable hiy
: widen ( v lo hi -- ) >r over over @ min swap !  r@ @ max r> ! ;
: fit ( -- )
  32767 lox !  -32767 hix !  32767 loy !  -32767 hiy !
  h-points hand-index!
  21 0 do hand@+ lox hix widen  hand@+ loy hiy widen  hand@+ drop
  loop
  hix @ lox @ -  hiy @ loy @ -  max  400 max  vden !  640 vnum !
  lox @ hix @ + 2 /  dup 16 * pivx !  vnum @ vden @ */ 512 swap - vox !
  loy @ hiy @ + 2 /  vnum @ vden @ */ 570 swap - voy !  0 pivz ! ;

\ FITTING off: the hand where the camera has it, the screen a mirror of
\ the picture; what is past the edge is clipped (turtle3d.fs's LINE), so
\ a hand can walk on from the side of the stage, fingers first.
variable fitting   -1 fitting !
: as-seen ( -- ) 1 vnum !  1 vden !  0 vox !  0 voy !  8192 pivx !  0 pivz ! ;

variable spinning
: flex ( finger -- n ) h-flex + reg ;
\ BIRD? ( -- flag )  the middle finger up, the other three down.
\ The thumb can do as it likes.
: bird? ( -- flag )
  2 flex 4096 <  1 flex 12288 > and
  3 flex 12288 > and  4 flex 12288 > and ;
: captions ( -- )
  0 reg 2 and if s" RIGHT" else s" LEFT" then 512 990 centred
  h-pinch reg 40 < if s" PINCH" 512 960 centred then
  bird? if s" THE BIRD" 512 930 centred then ;
: placed ( -- ) fitting @ if fit else as-seen then ;
: frame ( -- )
  rewind  spinning @ spin +!
  hand-seen? if placed hand captions else s" NO HAND" 512 600 centred then
  tag" Flex" 5 0 do i level loop  notag ;
: show ( -- ) dsp-stopped? if dlist dsp-start then ;

\ DATAHAND ( -- )  until a key is typed.
: datahand ( -- )
  3 vnum !  4 vden !  128 vox !  240 voy !
  backdrop  begin show hand-new? if hand-latch frame then key? until ;
