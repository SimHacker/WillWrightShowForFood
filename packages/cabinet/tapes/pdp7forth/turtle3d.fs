\ A 3D turtle for the Type 340, after Abelson and diSessa's Turtle
\ Geometry (1981), chapter 3: a position and three unit vectors, H
\ (heading), L (left) and U (up), in the units turtle.fs's SIN and COS
\ already use, 16384 to 1. YAW turns right about U, PITCH noses up about
\ L, ROLL rolls right about H; FWD moves along H. Each turn is the same
\ two-vector rotation, so there is no gimbal lock and nothing to invert.
\ Needs turtle.fs (SIN, COS, VEC, DLIST) and clip.fs (CLIP, IN?).
\
\ Space is the screen's pixels, x right, y up, z toward the viewer; the
\ position is kept in 1/16 pixel so rounding doesn't add up. The picture
\ is the view from the front turned SPIN degrees about the pivot, then
\ scaled by VNUM/VDEN and offset by VOX, VOY: so a skeleton can be
\ walked once and looked at from any side.
decimal

create t3 12 allot   \ x y z, then H, L and U, each x y z
: hv ( -- addr ) t3 3 + ;   : lv ( -- addr ) t3 6 + ;
: uv ( -- addr ) t3 9 + ;

\ TURN ( degrees a b -- )  A' = A cos - B sin, B' = B cos + A sin.
\ (A' waits in T-A' rather than on the return stack, where I would see it.)
variable t-cos   variable t-sin   variable t-a   variable t-b   variable t-a'
: turn ( degrees a b -- ) t-b ! t-a !  dup cos t-cos !  sin t-sin !
  3 0 do
    t-a @ i + @  t-b @ i + @
    over t-cos @ 16384 */  over t-sin @ 16384 */ -  t-a' !
    t-cos @ 16384 */  swap t-sin @ 16384 */ +
    t-b @ i + !  t-a' @ t-a @ i + !
  loop ;
: yaw ( degrees -- ) hv lv turn ;     \ right; negative is left
: pitch ( degrees -- ) uv hv turn ;   \ up; negative is down
: roll ( degrees -- ) uv lv turn ;    \ right wing down

\ The view.
variable spin   variable pivx   variable pivz
variable vnum   variable vden   variable vox   variable voy
\ Places may be off the glass: LINE clips what it draws to it.
: place ( x y z -- sx sy ) \ 1/16 pixels in space to pixels on the screen
  pivz @ -  rot pivx @ -  spin @ cos 16384 */  swap spin @ sin 16384 */ +
  pivx @ +  vnum @ vden @ */ 16 /  vox @ +
  swap vnum @ vden @ */ 16 /  voy @ + ;
: at3 ( -- sx sy ) t3 @  t3 1+ @  t3 2 + @  place ;

\ Drawing on the screen. BX, BY is the beam, always on the glass (text
\ moves it too); GX, GY is where the pen is, which may be off it. LINE
\ draws only the part of its line on the glass (clip.fs), so a
\ hand can walk on from the edge, and BEAM goes nowhere until it's back.
variable bx   variable by   variable gx   variable gy
: (go) ( x y bright -- ) pen !  2dup by @ - swap bx @ - swap vec  by ! bx ! ;
: beam ( x y -- ) 2dup gy ! gx !
  over in? over in? and if 0 (go) else 2drop then ;
: line ( x y -- ) gx @ xa !  gy @ ya !  2dup yb ! xb !  gy ! gx !
  clip if  xa @ ya @ 0 (go)  xb @ yb @ -1 (go)  then ;

variable pen3
: step ( n -- ) 3 0 do dup hv i + @ 1024 */  t3 i + +! loop drop ;
: fwd ( n -- ) step  at3 pen3 @ if line else beam then ;
: jump ( n -- ) step  at3 beam ;
: moveto3 ( x y z -- ) 16 * t3 2 + !  16 * t3 1+ !  16 * t3 !  at3 beam ;

\ Facing up the screen, left to the left, up out of it toward you.
: upright ( -- )
  0 hv !  16384 hv 1+ !  0 hv 2 + !
  -16384 lv !  0 lv 1+ !  0 lv 2 + !
  0 uv !  0 uv 1+ !  16384 uv 2 + ! ;
: home3 ( -- ) upright  512 512 0 moveto3 ;

\ One saved turtle, for branching: REMEMBER at the fork, RECALL for
\ each branch.
create saved 12 allot
: remember ( -- ) 12 0 do t3 i + @  saved i + ! loop ;
: recall ( -- ) 12 0 do saved i + @  t3 i + ! loop  at3 beam ;

: view ( degrees -- ) spin ! ;
: pivot ( -- ) t3 @ pivx !  t3 2 + @ pivz ! ;
0 spin !  8192 pivx !  0 pivz !  -1 pen3 !
1 vnum !  1 vden !  0 vox !  0 voy !
