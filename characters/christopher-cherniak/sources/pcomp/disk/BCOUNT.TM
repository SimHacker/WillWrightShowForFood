---TM State Table---
Program: "BCOUNT.TM"
INITIAL STATE:
1
STATE TABLE:
  1 0   0 R  1 - find the end-marker of the number
  1 1   1 L  2 - keep the end-marker and continue the count
  2 0   1 R  1 - place the next 1 on the correct digit to count up
  2            -      (this is like carrying the 1 to add by 1)
  2 1   0 L  2 - zero the rightmost consecutive 1's to place the next
  2            -      carry to the right digit
  3            - -------------------------------------------------------
  3            - PURPOSE:
  3            -    Counts up in binary, indefinitely.
  3            - STARTING POSITION:
  3            -    The read/write head can initially point to the
  3            -    1 on an otherwise all zero tape, or anywhere to
  3            -    the left of the 1.
  3            - INITIAL STATE:
  3            -    State 1
  3            - -------------------------------------------------------
