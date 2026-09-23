---TM State Table---
Program: "SQUARE.TM"
INITIAL STATE:
1
STATE TABLE:
  1 1   1 L  1 - Place an S to the imediate      ---|
  1 ?   S R  2 -    left of the series of ones.     |
  2 1   X R  3 - Mark the first count of copying.   |--INITIAL SETUP
  3 1   1 R  3 - Point to the rightmost 1 and start |
  3 ?   ? L  4 -    making multiple copies of the   |
  3            -    original series of ones.     ---|
  4 Y   Y L  4 - -----|
  4 A   A L  4 -      |
  4 C   C L  4 -      |
  4 1   C R  5 -      |
  4 X   Y R  5 -      |---Append a copy of the original N number of
  4 S   S R  6 -      |   ones to the right.
  5 A   A R  5 -      |
  5 Y   Y R  5 -      |
  5 C   C R  5 -      |
  5 ?   A L  4 - -----|
  6 Y   X R  6 - --------|
  6 C   X R  7 -         |
  6 A   A L  8 -         |---Do the above copy N number of times.
  7 C   1 R  7 -         |
  7 A   A L  4 - --------|
  8 Y   0 L  8 - -----|
  8 X   0 L  8 -      |
  8 S   0 R  9 -      |
  9 0   0 R  9 -      |---Clean up so that only the N-square number
  9 A   1 R 10 -      |   of ones remain on the tape.
 10 A   1 R 10 -      |
 10 ?   ? N  0 - -----|
 11            - -------------------------------------------------------
 11            - PURPOSE:
 11            -    Given N contiguous 1's on an otherwise all
 11            -    zero tape, compute N-square by printing N-square
 11            -    number of contiguous 1's (N must be greater than 0)
 11            -    Roughly, the program copies
 11            -    the N 1's, N number of times; then it
 11            -    cleans up the tape of all its "note taking,"
 11            -    leaving only the N-square number of 1's
 11            -    on the tape.
 11            - STARTING POSITION:
 11            -    The read/write head can initially point to any
 11            -    one of the 1's.
 11            - INITIAL STATE:
 11            -    State 1
 11            - -------------------------------------------------------
 11            - EXAMPLE:
 11            -    input:  ...000^111000...
 11            -    output: ...000111111111^000...
 11            -    (That is, 3-square equals 9.)
