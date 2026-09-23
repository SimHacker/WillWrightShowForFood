---TM State Table---
Program: "COMPARE.TM"
INITIAL STATE:
1
STATE TABLE:
  1 0   0 L  1 - scan-left for 1           ---
  1 1   0 L  2 - erase 1, go left            |
  2 0   0 R  6 - exit loop, go right         |
  2 1   1 R  3 - stay in loop, go right      |
  3 0   0 R  3 - scan-right for 1            |----within loop
  3 1   0 R  4 - erase 1, go right           |
  4 0   0 L  7 - exit loop, go left          |
  4 1   1 L  5 - stay in loop, go left       |
  5 0   0 L  1 - go left, start all over     |
  5 1   1 N  5 - (ignore this)             ---
  6 0   0 R  6 - scan right for 1          ---
  6 1   0 R  0 - erase 1, go right, HALT     |----out of loop
  7 0   0 L  7 - scan left for 1             |
  7 1   0 L  0 - erase 1, go left, HALT    ---
  8            - -------------------------------------------------------
  8            - PURPOSE
  8            -    Accepts two positive nonzero integers in unary
  8            -    notation, separated by one zero (all other
  8            -    symbols on the tape must be zeroes).
  8            -    If the two positive integers are equal,
  8            -    then the machine halts pointing to a zero;
  8            -    else the machine halts pointing to a one.
  8            - STARTING POSITION
  8            -    The read/write head must initially point to the
  8            -    zero separating the two integers.
  8            - INITIAL STATE
  8            -    State 1
  8            - -------------------------------------------------------
