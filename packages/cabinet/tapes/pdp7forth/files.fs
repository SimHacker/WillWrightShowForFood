\ Files by name, through tiny-titan's file service, device 24
\ (src/plugins/titan-files.ts, TINY-TITAN.md "Files"). Needs code.fs.
\
\ A file is 18-bit words. A path picks where it lives: /tmp in memory,
\ /browser kept in the browser across reloads, /proc made on demand,
\ /user yours. A name ending .gz is stored compressed. Addresses may be
\ 15 bits, so with the memory extension a file can go straight to and
\ from any bank (FORTH-HIGH-MEMORY.md).
\
\   S" /browser/pose" ADDR N 0 WRITE-WORDS  ( -- n )   store N words
\   S" /browser/pose" ADDR N 0 READ-WORDS   ( -- n )   load up to N
\   S" /browser/pose" FILE-SIZE             ( -- n )   words, or -1
\   S" /browser/pose" DELETE-FILE           ( -- r )   0, or -1
\   S" /browser" ADDR N LIST-FILES          ( -- n )   names, a line each
\
\ A result is the number of words moved, or negative: -1 no such file,
\ -2 a bad path, -3 a bad operation, -4 read-only, -6 failed. The
\ PDP-7 waits for the host with FSF, as a program waits for a disc.

octal
702401 iot-skip  file-done?   \ FSF ( -- flag ) the request has finished
702404 iot-write file-go      \ FGO ( block -- ) start it
702412 iot-read  file-result  \ FRS ( -- n )
702444 iot-pulse file-ack     \ FCF ( -- )
decimal

\ The request block: op, path, offset, length, data, result, path length.
create freq 7 allot
: file-wait ( -- n ) begin file-done? until  file-result
  dup 131072 and if 262144 - then ;
\ The path is S"'s ( c-addr u ), passed as both.
: file-op ( c-addr u addr n offset op -- n )
  freq !  freq 2 + !  freq 3 + !  freq 4 + !  freq 6 + !  freq 1+ !
  freq file-go  file-wait ;
: read-words ( c-addr u addr n offset -- n ) 1 file-op ;
: write-words ( c-addr u addr n offset -- n ) 2 file-op ;
: file-size ( c-addr u -- n ) 0 0 0 3 file-op ;
: delete-file ( c-addr u -- r ) 0 0 0 4 file-op ;
: list-files ( c-addr u addr n -- n ) 0 5 file-op ;
\ TYPE-WORDS ( addr n -- )  print text read one character a word.
: type-words ( addr n -- )
  dup 0> if 0 do dup i + @ emit loop else drop then drop ;
