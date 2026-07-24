#!/bin/bash
# usage: mkcrops.sh NNN
n=$1
src=pages/page-$n.png
for i in 0 1 2 3; do
  y=$((i*580))
  magick "$src" -crop 1300x640+520+$y +repage .crops/p$n-b${i}L.png
  magick "$src" -crop 1450x640+1620+$y +repage .crops/p$n-b${i}R.png
done
