\ Minsky's Ultimate Machine on the Type 340, with the light pen on its
\ switch. Needs turtle.fs (the display list words), code.fs,
\ interrupt.fs and tags.fs. ULTIMATE runs it until a key is typed.
\
\ The box is device 56 (src/plugins/ultimate.ts). It keeps its own
\ state: the phase, and how far the lid and the arm have come, each
\ 0 .. UM-MAX. Every frame is drawn from those registers, so the picture
\ follows the device and never the reverse, and how long the hand takes
\ is the device's business (UM-TIME! changes it).
\
\ The pen: the switch's plate is drawn with the 340's light pen enabled,
\ and nothing else is. When the pen sees it, the 340 freezes and raises
\ its flag; the interrupt handler counts the hit and lets the 340 go on,
\ and the frame loop flips the lever once per touch.
\
\ Every part is tagged (tags.fs), so hovering it in the cabinet names
\ it, and the lamps are captioned with their phases in 342 text.

octal

\ Device 56, the box.
705601 iot-skip  um-on?       \ UMSF ( -- flag ) is the lever on?
705612 iot-read  um-presses   \ UMRC ( -- n ) times the hand has won
705604 iot-pulse um-on        \ UMON ( -- ) the lever on
705621 iot-skip  um-busy?     \ UMSB ( -- flag ) the mechanism is out
705632 iot-read  um-phase     \ UMRP ( -- 0..ph-max )
705624 iot-pulse um-off       \ UMOF ( -- ) the lever off
705641 iot-skip  um-changed?  \ UMSI ( -- flag ) the phase has changed
705652 iot-read  um-lid       \ UMRL ( -- 0..um-max )
705644 iot-pulse um-ack       \ UMCF ( -- ) clear that flag
705661 iot-write um-timing!   \ UMLT ( w -- ) phase<<15 | length/64
705672 iot-read  um-arm       \ UMRA ( -- 0..um-max )
705664 iot-write um-ie!       \ UMIE ( flag -- ) interrupt on phase change
705501 iot-skip  um-bound?    \ selected binding exists
705512 iot-read  um-binding  \ selected binding index
705504 iot-write um-binding! \ select installed binding while OFF

\ The 340 and its pen.
700601 iot-skip  dsp-stopped? \ IDSI ( -- flag ) at the end of its list
700604 iot-write dsp-start    \ IDLA ( addr -- ) run the list at addr
700701 iot-skip  pen-hit?     \ IDSP ( -- flag ) frozen where the pen saw
700504 iot-pulse dsp-resume   \ IDRS ( -- ) go on from there

decimal

\ The ranges the drawing keys off.
1000 constant um-max
0 constant ph-off     1 constant ph-wait    2 constant ph-open
3 constant ph-reach   4 constant ph-press   5 constant ph-return
6 constant ph-close   7 constant ph-rest   ph-rest constant ph-max

\ UM-TIME! ( steps/64 phase -- )  how long a phase lasts, in units of
\ 64 cabinet steps: 1563 ph-reach UM-TIME! makes the reach 100032 steps.
create phase-bits  \ phase << 15
0 , 32768 , 65536 , 98304 , 131072 , 163840 , 196608 , 229376 ,
: um-time! ( n phase -- ) phase-bits + @ +  um-timing! ;

\ Drawing in screen coordinates: the beam's place is kept here, and
\ turtle.fs's VEC lays down the vectors to the next one, bright or not
\ as its PEN says.
variable bx   variable by
: (go) ( x y bright -- ) pen !  2dup by @ - swap bx @ - swap vec  by ! bx ! ;
: beam ( x y -- ) 0 (go) ;    \ move there, dark
: line ( x y -- ) -1 (go) ;   \ draw to there

variable x0   variable y0   variable x1   variable y1
: rect ( x0 y0 x1 y1 -- ) y1 ! x1 ! y0 ! x0 !
  x0 @ y0 @ beam  x1 @ y0 @ line  x1 @ y1 @ line
  x0 @ y1 @ line  x0 @ y0 @ line ;
: square ( x y size -- ) >r  over r@ +  over r> +  rect ;

\ Type 342 text at the beam, scale 2, the pen blind: escape to
\ parameters, CHAR mode, three 6-bit codes a word, the 342's ESC (37
\ octal) back to parameters, and on with vectors at scale 1. The beam
\ ends past the last letter, 12 a letter. Upper case only.
variable tw   variable tn
: >342 ( c -- code ) dup 96 > if 32 - then  dup 63 > if 64 - then ;
: char, ( code -- )
  tw @ 64 * + tw !  1 tn +!  tn @ 3 = if tw @ dl,  0 tw !  0 tn ! then ;
: text ( c-addr u -- )
  131072 dl,  28752 dl,  0 tw !  0 tn !  dup 12 * bx +!
  0 do dup i + c@ >342 char, loop drop
  31 char,  begin tn @ while 0 char, repeat  36928 dl, ;
: centred ( c-addr u cx y -- ) >r  over 6 * -  r> beam  text ;

\ A new display list: parameters (scale 1, bright, light pen off), the
\ beam to 0,0, then vectors. DL, keeps a terminator after each word.
: new-frame ( -- )
  12367 dlist !  8192 dlist 1+ !  98304 dlist 2 + !
  131072 dlist 3 + !  1024 dlist 4 + !
  dlist 3 + dl> !  0 bx !  0 by !  -1 display ! ;

\ An escape to parameter mode, and back to vectors with the pen on or off.
: lp-on ( -- ) 131072 dl,  38912 dl, ;
: lp-off ( -- ) 131072 dl,  36864 dl, ;

\ What the registers say, read once a frame.
variable ph   variable arm   variable fx   variable fy   variable on
: of-arm ( n -- n*arm/um-max ) arm @ um-max */ ;
: read-box ( -- )
  um-phase ph !  um-arm arm !  um-on? on !
  \ the fingertip: from 575,380 inside the box, up and over in an arc,
  \ to 370,512, where the lever's tip is when it is off
  575 205 of-arm - fx !
  380 132 of-arm +  180 of-arm sin 120 16384 */ +  fy ! ;

\ The box, side on: the switch at the left of the top, the lid at the
\ right, hinged at 680 and 210 long, so the opening starts at 470, left of
\ where the arm crosses the top (488 at the most). Open, it swings up 100
\ degrees.
: body ( -- )
  tag" The box"  470 460 beam  312 460 line  312 300 line  712 300 line
  712 460 line  680 460 line ;
: lid ( -- )
  tag" The lid"  um-lid 100 um-max */
  680 460 beam
  dup cos 210 16384 */ negate 680 +  swap sin 210 16384 */ 460 +  line ;

\ The lever leans right, at 430, when on, and left, at 370, when off. On
\ its way the finger pushes it over: its tip stays left of the finger.
\ The plate under it is where the pen turns it on and off.
: tip ( -- x ) on @ if fx @ 430 min 370 max else 370 then ;
: plate ( -- )
  lp-on  tag" The switch: tap it with the pen"
  380 460 beam  385 470 line  415 470 line  420 460 line   \ the boss
  360 400 440 440 rect                                     \ the plate
  4 0 do 360 i 8 * 408 + beam  440 i 8 * 408 + line loop
  lp-off ;
: lever ( -- )
  tag" The lever"  400 470 beam  tip 512 line
  tip 4 - 508 8 square ;

\ The arm from its shoulder inside the box, the hand, and one finger.
: hand ( -- )
  arm @ 0= if exit then
  tag" The hand"  600 380 beam  fx @ 45 + fy @ line
  fx @ 25 + fy @ 10 -  fx @ 45 + fy @ 10 +  rect
  fx @ 25 + fy @ beam  fx @ fy @ line ;

\ A square per phase, OFF to REST, each tagged and captioned with its
\ name above it; the current one crossed out. 88 apart, centred on the
\ tube, leaves room for RETURN, 72 wide at 12 a letter.
: name ( p -- c-addr u )
  dup 0 = if drop s" OFF" exit then   dup 1 = if drop s" WAIT" exit then
  dup 2 = if drop s" OPEN" exit then  dup 3 = if drop s" REACH" exit then
  dup 4 = if drop s" PRESS" exit then
  dup 5 = if drop s" RETURN" exit then
  dup 6 = if drop s" CLOSE" exit then  drop s" REST" ;
: lamp-x ( p -- x ) 88 * 192 + ;
: lamps ( -- )
  ph-max 1+ 0 do
    i name tagged  i lamp-x 200 24 square
    i name  i lamp-x 12 +  232 centred
  loop ;
: lamp ( -- )
  ph @ name tagged  ph @ lamp-x x0 !
  x0 @ 200 beam  x0 @ 24 + 224 line
  x0 @ 224 beam  x0 @ 24 + 200 line ;

\ The lid and the arm as bars 0 .. 400 long for 0 .. UM-MAX, between
\ end stops, and a tally of the times the hand has won.
: stops ( y -- )
  >r  312 r@ 6 - beam  312 r@ 6 + line
  712 r@ 6 - beam  712 r> 6 + line ;
: meter ( n y -- ) >r  312 r@ beam  400 um-max */ 312 + r> line ;
: labels ( -- )
  tag" How far the lid is open"  s" LID" 280 153 centred
  tag" How far the arm is out"  s" ARM" 280 123 centred ;
: tally ( -- )
  tag" Times the hand has won"  um-presses 40 min ?dup if
    0 do i 10 * 312 + 80 beam  i 10 * 312 + 104 line loop
  then ;

\ The display list is the backdrop, drawn once, and then what moves,
\ drawn again each frame after it. A vector costs a couple of thousand
\ steps here (no multiply in the PDP-7), so this is most of a frame
\ saved. STILL remembers where the backdrop ends: the list pointer and
\ the beam. The 340 may be part way through the list while it is redrawn,
\ so the terminator goes back down first, and DL, keeps one ahead.
variable still   variable still-x   variable still-y
: backdrop ( -- )
  new-frame  body plate lamps  160 stops  130 stops  labels  notag
  dl> @ still !  bx @ still-x !  by @ still-y ! ;
: rewind ( -- )
  131072 still @ !  1024 still @ 1+ !
  still @ dl> !  still-x @ bx !  still-y @ by ! ;
\ ON or OFF under the plate, as the lever says.
: caption ( -- )
  tag" The switch: tap it with the pen"
  on @ if s" ON" else s" OFF" then  400 376 centred ;
: frame ( -- )
  read-box  rewind
  lid lever caption hand lamp
  tag" The lid"  um-lid 160 meter  tag" The arm"  arm @ 130 meter
  tally  notag ;

\ The interrupt handler: who wants what? A skip chain.
variable hits      \ pen hits on the switch, since the last frame
variable changes   \ phase changes the box has reported
variable claimed
: on-interrupt ( -- )
  0 claimed !
  pen-hit? if 1 hits +!  dsp-resume  -1 claimed ! then
  um-changed? if um-ack  1 changes +!  -1 claimed ! then
  tty-done? if tty-ack  -1 claimed ! then
  key? if interrupts-off  -1 claimed ! then   \ leave the key for KEY
  claimed @ 0= if interrupts-off then ;

\ One flip per touch: a held pen sees the switch frame after frame, so
\ the lever flips when the pen first sees it, and not again until the
\ pen has been away for a few frames.
\
\ TAKE-HITS ( -- n ) the count, zeroed in the same breath. In Forth,
\ "hits @ 0 hits !" is not safe: the handler runs at NEXT, between any
\ two cells, and while the pen sits on the plate the hits come so fast
\ that the frame loop can stall between the @ and the ! for the whole
\ of the 340's pass, and the ! wipes them all. Between two machine
\ instructions no Forth handler can run, so this one is a CODE word.
code take-hits
  hits lac,  hits dzm,  push,
end-code
variable held
: toggle ( -- ) um-on? if um-off else um-on then ;
: pen-check ( -- )
  take-hits if held @ 0= if toggle then  4 held !
  else held @ 1- 0 max held ! then ;

\ Start the 340 over whenever it has reached the end of the list.
: show ( -- ) dsp-stopped? if dlist dsp-start then ;

\ ULTIMATE ( -- )  until a key is typed. CS brings the turtle back.
: ultimate ( -- )
  0 hits !  0 held !  backdrop
  ['] on-interrupt interrupt-vector !  -1 um-ie!  interrupts-on
  begin frame show pen-check key? until
  interrupts-off  0 um-ie!  pendown ;
