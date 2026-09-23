---TM State Table---
Program: "UTM.TM"
INITIAL STATE:
1
STATE TABLE:
  1 Y   Y R  2
  1 0   A L  1
  1 1   B L  1
  1 ?   ? L  1
  2 X   X R  7
  2 A   0 R  3
  2 B   1 R  4
  2 ?   ? R  2
  3 0   A L  5
  3 1   B R  6
  3 ?   ? R  3
  4 0   A R  6
  4 1   B L  5
  4 ?   ? R  4
  5 Y   Y R  2
  5 ?   ? L  5
  6 X   X L  1
  6 Y   Y R  0
  6 ?   ? R  6
  7 0   A L  8
  7 1   B L  9
  7 ?   ? R  7
  8 Y   Y R 11
  8 ?   ? L  8
  9 Y   Y R 10
  9 ?   ? L  9
 10 0   B R 12
 10 1   B R 12
 10 X   X L 13
 10 ?   ? R 10
 11 0   A R 12
 11 1   A R 12
 11 X   X L 14
 11 ?   ? R 11
 12 X   X R  7
 12 ?   ? R 12
 13 M   B R 15
 13 ?   ? L 13
 14 M   A R 15
 14 ?   ? L 14
 15 A   0 R 15
 15 B   1 R 15
 15 X   X R 16
 15 ?   ? R 15
 16 0   0 L 17
 16 1   1 L 17
 16 ?   ? R 16
 17 A   0 L 17
 17 B   1 L 17
 17 0   S L 18
 17 1   S L 19
 17 ?   ? L 17
 18 A   0 L 21
 18 B   0 R 20
 18 ?   ? L 18
 19 A   1 L 21
 19 B   1 R 20
 19 ?   ? L 19
 20 0   M R 22
 20 1   M R 23
 20 ?   ? R 20
 21 0   M R 22
 21 1   M R 23
 21 ?   ? L 21
 22 S   A L  1
 22 ?   ? R 22
 23 S   B L  1
 23 ?   ? R 23
 24            - -------------------------------------------------------
 24            -  Universal Turing Machine:
 24            -  a TM that can simulate any TM
 24            -  described on its input tape.
 24            -  This file is identical with the UTM
 24            -  invoked from TM* main menu by switching
 24            -  to "UTM mode."
 24            -  See Help in UTM mode for input tape format, etc.
 24            - -------------------------------------------------------
