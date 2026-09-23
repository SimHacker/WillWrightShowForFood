---TM State Table---
Program: "ADD.TM"
INITIAL STATE:
1
STATE TABLE:
  1 0   0 R  1 - find the leftmost 1
  1 1   0 R  2 - clear the leftmost 1
  2 0   1 L  0 - replace the 0 that was initially between the two unary
  2            -      integers with a 1
  2 1   1 R  2 - find the 0 separating the two unary integers
  3            - -------------------------------------------------------
  3            - PURPOSE:
  3            -    Add two positive unary numbers separated by a 0,
  3            -    on an otherwise all zero tape.  The addition is
  3            -    performed by simply connecting the two numbers
  3            -    by moving the leftmost 1 of the first number to
  3            -    the 0 that separates the two integers.
  3            - STARTING POSITION:
  3            -    The read/write head must initially point to the
  3            -    leftmost 1, or anywhere to the left of it.
  3            - INITIAL STATE:
  3            -    State 1
  3            - -------------------------------------------------------
