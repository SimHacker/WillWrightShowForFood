hex
variable buf
here 0f + 0fff0 and buf !
buf @ 200 + buf - 10 + allot

30 ul-delay !

: up
  999 0 do
    ul-delay @ 4 * 0 do
      mbuff> if >term ?update-videx
      else relax then
      do-cur
    loop
    vidoff
    60 buf @ i [ prodos ] read-block [ forth ]
    vidon
    if cr ." Error " . cr leave
    else 
      ." Block " i . cr
      buf @ 200 dump
      cr
    then
  loop
;
