---TM State Table---
Program: "BUSY2.TM"
INITIAL STATE:
1
STATE TABLE:
  1 0   1 R  2
  1 1   1 L  2
  2 0   1 L  1
  2 1   1 L  0
  3            - A 2-state Busy-Beaver is a Turing machine with 2
  3            - states that prints the greatest possible number of
  3            - ones on an initially all zero tape and then halts.
  3            - This 2-state Busy-Beaver takes 6 steps to print
  3            - 4 ones.
  4            - (For more information about Busy-Beavers, see
  5            -  "Computer Recreations," Scientific American,
  6            -  August 1984 and March & April 1985.)
  7            -  See also  BB5.TM  on TM*
