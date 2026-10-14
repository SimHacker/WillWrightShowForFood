\ GLOVE: a hand on device 57 (src/plugins/glove.ts), drawn by the 3D
\ turtle (turtle3d.fs). The device reports the hand the way the turtle
\ walks it: start at the wrist in the palm's frame, then for each finger
\ four bones of YAW, PITCH and FWD. Five branches from one REMEMBER.
\ Under it, the flex of each finger, 0 straight to 16384 curled, as a
\ DataGlove's fibre-optic sensors measured it. VPL's RB2 did the same:
\ glove values to skeleton joints (Body Electric), joints to pictures.
\
\ GLOVE runs until a key. 30 VIEW turns the hand to be seen from the
\ side; 3 SPINNING ! turns it round, three degrees a frame.
\
\ Needs code.fs (IOT words), tags.fs (hover names) and turtle3d.fs.

octal
705701 iot-skip  glove-new?    \ GSF ( -- flag ) a new frame waits
705712 iot-read  glove-status  \ GRS ( -- n ) 1 a hand, 2 a right one
705704 iot-pulse glove-latch   \ GLT ( -- ) take it, clear the flag
705721 iot-skip  glove-hand?   \ GSH ( -- flag ) the latched frame has one
705732 iot-read  glove@+       \ GRD ( -- n ) register, step the index
705724 iot-write glove-index!  \ GLI ( n -- )
705744 iot-pulse glove-ack     \ GCF ( -- ) clear the flag
705764 iot-write glove-ie!     \ GIE ( flag -- ) interrupt on a new frame
700601 iot-skip  dsp-stopped?  \ IDSI ( -- flag ) at the end of its list
700604 iot-write dsp-start     \ IDLA ( addr -- ) run the list at addr
decimal

\ The registers (glove.ts has the full table).
1 constant g-wrist   73 constant g-flex   78 constant g-pinch
: reg ( n -- value ) glove-index! glove@+ ;

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
  g-wrist glove-index!
  glove@+ 16 *  glove@+ 16 *  glove@+ 16 *  t3 2 + ! t3 1+ ! t3 !
  9 0 do glove@+ hv i + ! loop  pivot remember ;
: bone ( landmark -- ) glove@+ yaw  glove@+ pitch  glove@+ fwd  mark ;
: finger ( f -- ) recall  4 * 5 1 do dup i + bone loop  4 + tip ;
: hand ( -- )
  palm  0 mark  13 glove-index!
  tag" Thumb" 0 finger    tag" Index finger" 1 finger
  tag" Middle finger" 2 finger   tag" Ring finger" 3 finger
  tag" Little finger" 4 finger
  tag" Knuckles" 5 spot beam  9 spot line  13 spot line  17 spot line ;

\ The flex meters: an outline drawn once, the level drawn each frame.
: meter-x ( f -- x ) 170 * 112 + ;
: outline ( f -- ) meter-x dup 60 over 50 + 200 rect ;
: level ( f -- ) dup g-flex + reg 140 16384 */ 60 + y1 !  meter-x
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

variable spinning
: captions ( -- )
  0 reg 2 and if s" RIGHT" else s" LEFT" then 512 990 centred
  g-pinch reg 40 < if s" PINCH" 512 960 centred then ;
: frame ( -- )
  rewind  spinning @ spin +!
  glove-hand? if hand captions else s" NO HAND" 512 600 centred then
  tag" Flex" 5 0 do i level loop  notag ;
: show ( -- ) dsp-stopped? if dlist dsp-start then ;

\ GLOVE ( -- )  until a key is typed.
: glove ( -- )
  3 vnum !  4 vden !  128 vox !  240 voy !
  backdrop  begin show glove-new? if glove-latch frame then key? until ;
