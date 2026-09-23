---TM State Table---
Program: "BB5.TM"
INITIAL STATE:
1
STATE TABLE:
  1 0   1 L  2 -   This is a contender for the title of 5-state
  1 1   1 L  1 -   Busy-Beaver, as of August 1989.
  2 0   1 R  3 -   It was devised by a program devised by
  2 1   1 R  2 -   Heiner Marxen (Technical University of Berlin),
  3 0   1 L  1 -   who reported it to Allen Brady (Univ Nevada),
  3 1   1 R  4 -   who passed it on to A. K. Dewdney, who announced
  4 0   1 L  1 -   a related machine in Dec 1989 SCIENTIFIC
  4 1   1 R  5 -   AMERICAN.
  5 0   1 R  0
  5 1   0 R  3 -   This machine takes 11,798,826 steps to print out
  6            -   4,098 ones on an initially all-zero tape, before
  7            -   it halts.
  9            -   Total tape excursion = 6,145 squares, so it
 10            -   should be started on TM*'s 10,000 square tape
 11            -   at around - 2,000 squares to the left of square
 12            -   zero.
 15            -   (For a 2-state Busy-Beaver, and
 15            -    references with information on
 15            -    the Busy-Beaver concept, see
 15            -    BUSY2.TM  on TM*)
