---TM State Table---
Program: "BUSY5.TM"
INITIAL STATE:
1
STATE TABLE:
  1 0   1 R  2
  1 1   1 L  3
  2 0   0 L  1
  2 1   0 L  4
  3 0   1 L  1
  3 1   1 L  0
  4 0   1 L  2
  4 1   1 R  5
  5 0   0 R  4
  5 1   0 R  2
  6            - A 5-state Busy-Beaver is a Turing machine with 5
  6            - states that prints the greatest possible number of
  6            - ones on an initially all zero tape and then halts.
  6            - The 5-state Turing machine that you just loaded is
  6            - the 2nd best currently-known (1990) candidate for
  6            - the 5-state Busy-Beaver.  It will take 2,133,492
  6            - steps to print 1915 ones.
  6            - (For more information about Busy-Beavers, see
  6            -  "Computer Recreations,"  Scientific American,
  6            -  August 1984 and March & April 1985.)
  6            - For the BEST current candidate for 5-state
  6            - Busy-Beaver,  see  BB5.TM  on TM*
