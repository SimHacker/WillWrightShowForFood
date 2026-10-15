\ CLIP: line clipping for the Type 340, for drawings that may run off
\ the glass. Needs only the prelude. Loaded by DATAHAND ahead of
\ turtle3d.fs; turtle.fs leaves it out, as 8K is tight for cartridges
\ like the Turing machines that load the 2D turtle.
decimal

\ Clipping, Cohen and Sutherland's (1967): the line from XA,YA to XB,YB
\ in pixels is cut to the glass, 0 to 1023 each way. OC gives a point's
\ outcode: 8 below, 4 above, 2 left, 1 right. NUDGE slides the A end
\ along the line to the edge its code names; */ keeps the 36-bit product.
\ CLIP leaves true if any of the line is on the glass, and the ends cut
\ to it. A beam sent off the glass would set the 340's edge flag and stop
\ the picture, so nothing past the edge goes into the list.
variable xa   variable ya   variable xb   variable yb
variable oa   variable ob   variable tries
: oc ( x y -- code ) dup 0< 8 and  swap 1023 > 4 and +
  swap dup 0< 2 and  swap 1023 > 1 and  + + ;
: ends ( -- ) xa @ xb @ xa ! xb !  ya @ yb @ ya ! yb ! ;
: nudge ( code -- )
  dup 12 and if
    4 and if 1023 else 0 then
    dup ya @ -  xb @ xa @ -  swap  yb @ ya @ - */  xa +!  ya !
  else
    1 and if 1023 else 0 then
    dup xa @ -  yb @ ya @ -  swap  xb @ xa @ - */  ya +!  xa !
  then ;
: codes ( -- ) xa @ ya @ oc oa !  xb @ yb @ oc ob ! ;
: clip ( -- visible? )
  6 tries !
  begin codes  oa @ ob @ or 0<>  oa @ ob @ and 0= and  tries @ 0> and while
    -1 tries +!
    oa @ if oa @ nudge else ends ob @ nudge ends then
  repeat
  oa @ ob @ or 0= ;
: in? ( pixel -- flag ) dup 0< 0= swap 1024 < and ;
