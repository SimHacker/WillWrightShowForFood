#!/bin/bash
# usage: mk2.sh NNN XOFF  -> bands L (x XOFF w1300) and R (x XOFF+1000 w1500)
n=$1; x=$2
for i in 0 1 2 3; do
  y=$((i*580))
  magick pages/page-$n.png -crop 1300x640+$x+$y +repage .crops/p$n-${i}L.png
  magick pages/page-$n.png -crop 1500x640+$((x+1000))+$y +repage .crops/p$n-${i}R.png
done
