\ ULTIMATE DATAHAND: Minsky's Ultimate Machine, and you are its hand.
\ Needs code.fs, tags.fs, clip.fs, turtle3d.fs and datahand.fs, and two
\ devices: the box (56, src/plugins/ultimate.ts) in manual press mode,
\ and the hand (57).
\
\ First person, looking down into the box: its front edge at the bottom
\ of the screen, the switch near the far edge, at the top. Show the
\ camera your hand, palm away, fingers up, and the box switches itself
\ on. The lid opens, and the arm carries your hand out until it is under
\ the switch; then it waits. Touch the switch with any fingertip, with
\ any flourish, for as long as you like: the touch is the press, and the
\ arm takes your hand home. The arm places the hand; where your hand
\ is in the camera doesn't matter, only its shape. To go again, take
\ your hand away until the box has rested, then show it again: so one
\ appearance is one round, and WAIT and REST take up the jitter.
\
\ No lamps or meters: the box is the whole display.

octal
705601 iot-skip  um-on?       \ UMSF ( -- flag ) the lever is on
705604 iot-pulse um-on        \ UMON ( -- )
705624 iot-pulse um-off       \ UMOF ( -- ) the touch, in manual press
705632 iot-read  um-phase     \ UMRP ( -- 0..7 )
705652 iot-read  um-lid       \ UMRL ( -- 0..1000 )
705672 iot-read  um-arm       \ UMRA ( -- 0..1000 )
705661 iot-write um-timing!   \ UMLT ( w -- ) 1, phase 0: manual press
decimal

\ The box, in screen pixels. Front edge at the bottom, far edge at the
\ top; the hand rests in the middle and reaches up to the switch.
160 constant bx0   864 constant bx1   60 constant by0   900 constant by1
512 constant swx   840 constant swy   48 constant swr
\ The arm: the wrist at rest, and how far up it reaches at full stretch.
512 constant wrest   140 constant wbase   330 constant wreach

\ The hole: open at the far end, where the lid is. Shut, the lid's edge
\ is at 760, closing it; opening slides it down to the near end, so
\ nothing lies between the hand coming out and the switch.
100 constant hole0   760 constant hole1
: box ( -- )
  tag" The box"  bx0 by0 bx1 by1 rect
  bx0 40 + hole1 beam  bx0 40 + hole0 line  bx1 40 - hole0 line
  bx1 40 - hole1 line ;
: lid ( -- )
  tag" The lid"  um-lid 1000 swap - hole1 hole0 - 1000 */ hole0 + >r
  bx0 40 + r@ beam  bx1 40 - r> line ;
\ The switch: a plate, and its lever over to ON or OFF.
: switch ( -- )
  tag" The switch"  swx swr - swy swr - swx swr + swy swr + rect
  swx swy beam  um-on? if 30 else -30 then swx + swy 36 + line
  um-on? if s" ON" else s" OFF" then swx swy 70 + centred ;

\ A real hand, not the demo's (status bit 4).
: real? ( -- flag ) hand-seen? if 0 reg 4 and 0= else 0 then ;

\ The hand rides on the arm: its wrist is pinned to the top of the arm,
\ where the arm says, and the camera gives only its shape and turn. The
\ scale is set when a round starts, from FIT's box around the hand, so
\ curling a finger doesn't swell the rest; NULL sets it again.
variable wy   variable rden   400 rden !
: null ( -- ) fit  vden @ rden ! ;
: arm-y ( -- y ) um-arm wreach 1000 */ wbase + ;
\ Yours at 360 pixels across at most, the demo's smaller, well inside.
: place-hand ( -- )
  arm-y wy !  real? if 360 else 260 then vnum !  rden @ vden !  0 pivz !
  h-wrist reg 16 * pivx !
  wrest  h-wrist reg vnum @ rden @ */ -  vox !
  wy @  h-wrist 1+ reg vnum @ rden @ */ -  voy ! ;
: arm ( -- )
  tag" The arm"  wrest 24 - hole0  wrest 24 + wy @ 14 - rect
  wrest 40 - wy @ 14 -  wrest 40 + wy @ rect ;

\ A fingertip on the switch: within its plate, by where the turtle drew
\ the tip (datahand.fs's SPOT).
: on-plate? ( x y -- flag )
  swy - abs swr 12 + <  swap swx - abs swr 12 + <  and ;
: touching? ( -- flag )
  0  5 0 do  i 4 * 4 + spot on-plate? or  loop ;

\ The game. A real hand while the box is OFF switches it on, once per
\ appearance: ARMED is cleared when the round starts and set again only
\ after the box has rested with no hand in view.
variable armed   -1 armed !
3 constant ph-reach   0 constant ph-off
: control ( -- )
  um-phase ph-off = if
    real? 0= if -1 armed ! then
    real? armed @ and if 0 armed !  null  um-on then
  then
  um-phase ph-reach = um-arm 1000 = and if
    real? if touching? if um-off then then
  then
  \ Only your hand opens the box or touches the switch. Take it away any
  \ time before the press and the box gives up at once: RETRACT (UMLT
  \ mode word, 2) sends the arm and lid home from wherever they are.
  um-phase dup 0> swap 4 < and if real? 0= if 3 um-timing! then then ;

: prompt ( -- )
  um-phase ph-off = if
    real? if s" TAKE YOUR HAND AWAY, THEN SHOW IT AGAIN"
    else s" SHOW THE CAMERA YOUR HAND, FINGERS UP" then 512 30 centred
  then
  um-phase ph-reach = um-arm 1000 = and if
    s" TOUCH THE SWITCH" 512 30 centred
  then ;

\ Brightness: from vector mode, escape to a parameter word (mode 1,
\ vectors next; bit 14 sets the intensity to 0..7), then go on.
: bright! ( 0..7 -- ) 131072 dl,  8 + 32768 + dl, ;
: uframe ( -- )
  new-frame  5 bright!  s" THE ULTIMATE MACHINE DATA HAND" 512 975 centred
  box  switch
  \ Yours is sized when the round starts; the demo's always by itself.
  um-phase ph-off = real? 0= or if hand-seen? if null then then
  \ Your hand brightest, over the box; the demo's a dim ghost.
  hand-seen? if real? if 7 else 1 then bright!
    place-hand hand notag  5 bright! then
  arm notag
  lid notag  prompt ;

\ ULTIMATE-HAND ( -- )  until a key is typed.
: ultimate-hand ( -- )
  1 um-timing!  0 spin !
  begin show  hand-new? if hand-latch then  control  uframe
  key? until ;
