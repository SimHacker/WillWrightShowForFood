\ A Turing machine on the Type 340. The engine, device 54, runs it in
\ core; Forth draws the tape with the 342 character generator, the head
\ over it, and what the machine is doing. Needs turtle.fs, code.fs and
\ tags.fs. The machines come after it, as records made on the host from
\ TM-Forth: src/tm340.ts writes pcomp-tm.fs.
\
\   BUSY2       load a machine (MACHINES lists them)
\   RUN         run it until it halts or a key is typed
\   STEP        one transition
\   n SPEED     transitions a frame; 0 lets the engine run free
\   DEMO        every machine in turn, until a key is typed
\
\ The window is 128 words of core, 384 cells, three 6-bit 342 codes a
\ word: what the 342 draws, so the tape on the tube is the window as it
\ is, copied into the display list a frame at a time. The head stays in
\ the middle and the tape slides under it. When the head leaves the
\ window the engine pages it by half, keeping the rest of the tape to
\ itself; cells the window doesn't hold are drawn as gaps.

octal

\ Device 54, the engine. Status: RUN 400000, HALT 200000, UNDEF 100000,
\ FAULT 040000, STEP 020000.
705401 iot-skip  tm-flag?     \ TMSF ( -- flag ) halted, stuck, stepped
705412 iot-read  tm-status    \ TMRS ( -- status )
705404 iot-write tm-go-at     \ TMLA ( tcb -- ) load the TCB and run
705421 iot-skip  tm-running?  \ TMSR ( -- flag )
705424 iot-pulse tm-go        \ TMGO ( -- ) reload, run
705441 iot-pulse tm-step      \ TMSS ( -- ) reload, one transition
705442 iot-write tm-mode!     \ TMLM ( mode -- ) 2: forget the old tape
705444 iot-pulse tm-stop      \ TMST ( -- ) stop, clear the flags

\ The 340.
700601 iot-skip  dsp-stopped? \ IDSI ( -- flag ) at the end of its list
700604 iot-write dsp-start    \ IDLA ( addr -- ) run the list at addr

decimal

\ The control block, the window, and the record they were loaded from
\ (tm340.ts has its layout). Strings are packed: a count, then 342
\ codes three a word, ending in the 342's ESC, for the 340 to DJS to.
create tcb 10 allot
128 constant wwords   384 constant wlen   192 constant middle
create window 128 allot
variable catalog   variable rec   variable speed   variable going
: r@@ ( i -- x ) rec @ + @ ;
: alpha ( -- a ) rec @ 9 + ;
: table ( -- a ) alpha 0 r@@ + ;
: names ( -- a ) table  0 r@@ 1 r@@ * +  5 r@@ + ;
: skip$ ( a -- a' ) dup @ 3 + 3 / + 1+ ;
: state$ ( q -- a )
  names skip$ skip$ swap  begin dup while 1- swap skip$ swap repeat drop ;

\ TM-LOAD ( rec -- )  blank the window, lay the tape in, fill the TCB.
\ TMLA wants to run: it gets state 0, halts at once, TMST wipes that,
\ and then the real start state goes in for TMSS and TMGO to reload.
: tm-load ( rec -- )
  rec !  7 r@@ speed !
  wwords 0 do 6 r@@ window i + ! loop
  5 r@@ ?dup if 0 do names 5 r@@ - i + @  window 4 r@@ + i + ! loop then
  0 tcb !  middle tcb 1+ !  3 r@@ tcb 2 + !  window tcb 3 + !
  wlen tcb 4 + !  table tcb 5 + !  0 r@@ tcb 6 + !  alpha tcb 7 + !
  0 tcb 8 + !  0 tcb 9 + !
  2 tm-mode!  tcb tm-go-at  tm-stop  2 r@@ tcb ! ;

\ Cell K of a word, 0 the high one. Words of 2^17 and up are negative
\ here, so the high cell is taken apart with AND, not division alone.
: field ( word k -- code )
  dup 0= if drop  dup 126976 and 4096 /  swap 0< 32 and +  exit then
  1 = if 4032 and 64 / else 63 and then ;
: scanned ( -- code ) tcb 1+ @  dup 3 / window + @  swap 3 mod field ;
: symbol ( code -- s ) \ -1 if it is not in the alphabet
  -1 swap  0 r@@ 0 do dup alpha i + @ = if swap drop i swap then loop
  drop ;
: >ascii ( code -- c ) dup 32 < if 64 + then ;
: .342 ( a -- ) \ a packed string, at the teletype
  dup @ 0 do dup 1+ i 3 / + @  i 3 mod field >ascii emit loop drop ;

\ A line of text built a piece at a time.
create lbuf 48 allot   variable ln
: <line ( -- ) 0 ln ! ;
: +c ( c -- ) lbuf ln @ + c!  1 ln +! ;
: +$ ( c-addr u -- )
  begin dup while over c@ +c  1- swap 1+ swap repeat 2drop ;
: line$ ( -- c-addr u ) lbuf ln @ ;

\ Numbers up to 36 bits: three base-512 limbs, divided by ten in turn.
variable la   variable lb   variable lc
create digs 12 allot   variable nd
: div10 ( -- r )
  la @ dup 10 / la !  10 mod
  512 * lb @ + dup 10 / lb !  10 mod
  512 * lc @ + dup 10 / lc !  10 mod ;
: +digits ( -- )
  0 nd !
  begin div10 48 + digs nd @ + !  1 nd +!  la @ lb @ or lc @ or 0= until
  begin nd @ while -1 nd +!  digs nd @ + @ +c repeat ;
: +n ( n -- ) dup 0< if 45 +c negate then  0 la !  0 lb !  lc !  +digits ;
: +count ( lo hi -- )
  la !  dup 511 and lc !  dup 130560 and 512 /  swap 0< 256 and +  lb !
  +digits ;

\ Drawing in screen coordinates, as in ultimate.fs.
variable bx   variable by
: (go) ( x y bright -- ) pen !  2dup by @ - swap bx @ - swap vec  by ! bx ! ;
: beam ( x y -- ) 0 (go) ;
: line ( x y -- ) -1 (go) ;
variable x0   variable y0   variable x1   variable y1
: rect ( x0 y0 x1 y1 -- ) y1 ! x1 ! y0 ! x0 !
  x0 @ y0 @ beam  x1 @ y0 @ line  x1 @ y1 @ line
  x0 @ y1 @ line  x0 @ y0 @ line ;

\ 342 text at scale 2, 12 a letter. PACK packs a string three codes a
\ word through SINK: into the display list (TEXT), or into the
\ dictionary (,342), counted, for SAY to DJS to: escape, SUBR mode at
\ scale 2, DJS with character mode next, and its ESC brings the 340
\ back here in parameter mode, for vectors again.
variable tw   variable tn   variable sink
: >342 ( c -- code ) dup 96 > if 32 - then  dup 63 > if 64 - then ;
: char, ( code -- )
  tw @ 64 * + tw !  1 tn +!
  tn @ 3 = if tw @ sink @ execute  0 tw !  0 tn ! then ;
: pack ( c-addr u -- )
  0 tw !  0 tn !  ?dup if 0 do dup i + c@ >342 char, loop then drop
  31 char,  begin tn @ while 0 char, repeat ;
: ,342 ( c-addr u -- ) dup ,  ['] , sink !  pack ;
: text ( c-addr u -- )
  131072 dl,  28752 dl,  dup 12 * bx +!  ['] dl, sink !  pack  36928 dl, ;
: say ( a -- )
  dup @ 12 * bx +!
  131072 dl,  57424 dl,  1+ 8191 and 221184 + dl,  36928 dl, ;
: at-mid ( n y -- ) >r  6 * 520 swap -  r> beam ;  \ n letters about 520
: mid ( c-addr u y -- ) over swap at-mid text ;
: say-mid ( a y -- ) over @ swap at-mid say ;

: new-frame ( -- )
  12367 dlist !  8192 dlist 1+ !  98304 dlist 2 + !
  131072 dlist 3 + !  1024 dlist 4 + !
  dlist 3 + dl> !  0 bx !  0 by !  -1 display ! ;

\ The tape: 13 window words, 39 cells, at scale 4, 24 a cell, the head's
\ cell always at 512. The first drawn is 19 left of the head, from the
\ word that holds it, K cells further left.
56 constant tx0   560 constant ty0
variable k   variable w0
: tape-word ( w -- word )
  dup 0< over wwords < 0= or if drop 133152 else window + @ then ;
\ The lines between the cells, up and down in turn: built once as a 340
\ subroutine of 40 lines, and called with DJS where the cells are.
create sep-sub 96 allot
: build-sep ( -- )
  sep-sub dl> !  0 bx !  0 by !
  40 0 do
    i 24 *  i 1 and if 48 beam i 24 * 0 line else 0 beam i 24 * 48 line then
  loop
  0 0 beam  131072 dl, ;
: tape ( -- )
  tcb 1+ @ 19 - 3000 + dup 3 mod k !  3 / 1000 - w0 !
  tx0 k @ 24 * - 4 - ty0 12 - beam
  131072 dl,  57344 dl,  sep-sub 8191 and 229376 + dl,  36928 dl,
  tx0 k @ 24 * - ty0 beam
  131072 dl,  28768 dl,  13 0 do w0 @ i + tape-word dl, loop
  126976 dl,  36928 dl,  936 bx +! ;

: head ( -- )
  504 544 536 600 rect  502 542 538 602 rect
  520 536 beam  506 508 line  534 508 line  520 536 line ;

\ What it does next: the entry for this state and the scanned symbol.
variable q
create no-rule s" NO RULE FOR THAT" ,342
: +move ( entry -- )
  dup 0< 2 and  swap 65536 and if 1+ then
  dup 1 = if drop s" RIGHT" +$ exit then
  2 = if s" LEFT" else s" STAY" then +$ ;
: rule ( -- )
  q @ 0= if exit then
  scanned symbol dup 0< if drop exit then
  q @ 0 r@@ * + table + @  ?dup 0= if no-rule 400 say-mid exit then
  <line s" READS " +$  scanned >ascii +c
  s"   WRITES " +$  dup 61440 and 4096 / alpha + @ >ascii +c
  s"   MOVES " +$  dup +move  s"   GOES TO " +$
  4095 and state$  dup @ ln @ + 400 at-mid  line$ text  say ;

create st-halt s" HALTED" ,342
create st-stuck s" STUCK: NO RULE" ,342
create st-fault s" FAULT" ,342
create st-run s" RUNNING" ,342
create st-ready s" READY: RUN OR STEP" ,342
: status ( -- a )
  tm-status
  dup 65536 and if drop st-halt exit then
  dup 32768 and if drop st-stuck exit then
  dup 16384 and if drop st-fault exit then
  0< going @ or if st-run exit then  st-ready ;

\ The backdrop is drawn when a machine is loaded, the rest each frame
\ after it, as in ultimate.fs.
create t-title s" TURING MACHINE" ,342
create t-none s" NO MACHINE LOADED: TYPE BUSY2" ,342
create t-help1 s" ANY KEY STOPS IT.  A MACHINE'S NAME LOADS IT:" ,342
create t-help2 s" BUSY2 BUSY5 BB5 ADD BCOUNT EQUALS SQUARE UTM" ,342
create t-help3 s" RUN  STEP  N SPEED (0 RUNS FREE)  MACHINES  DEMO" ,342
variable still   variable still-x   variable still-y
: backdrop ( -- )
  build-sep  new-frame
  tag" Turing machine"  t-title 960 say-mid
  rec @ if names 920 say-mid  names skip$ 880 say-mid then
  tag" The tape"  8 548 beam 1016 548 line  8 596 beam 1016 596 line
  tag" The head"  head
  tag" Type these at the teletype"
  t-help1 160 say-mid  t-help2 130 say-mid  t-help3 100 say-mid
  notag  dl> @ still !  bx @ still-x !  by @ still-y ! ;
: rewind ( -- )
  131072 still @ !  1024 still @ 1+ !
  still @ dl> !  still-x @ bx !  still-y @ by ! ;

: frame ( -- )
  rewind  tcb @ q !
  rec @ 0= if t-none 500 say-mid exit then
  tag" The tape"  tape
  tag" The state"  q @ state$ 480 say-mid
  tag" What it does next"  rule
  tag" Steps, and where the head is"
  <line s" STEPS " +$  tcb 8 + @ tcb 9 + @ +count
  s"    HEAD AT " +$  tcb 1+ @ tcb 2 + @ + +n  line$ 340 mid
  tag" The engine's status"  status 290 say-mid  notag ;

: show ( -- ) dsp-stopped? if dlist dsp-start then ;
: shown ( -- ) frame show ;

\ Running: SPEED transitions a frame, each a TMSS and a wait; or, at 0,
\ TMGO once, and the engine runs at its own pace while Forth draws.
: live? ( -- flag ) rec @ 0<>  tm-status 114688 and 0=  and ;
: one ( -- ) tm-step begin tm-running? 0= until ;
: advance ( -- )
  speed @ begin dup 0> while live? if one 1- else drop 0 then repeat drop ;
: going? ( -- flag ) speed @ if live? else tm-running? then ;
: (run) ( frames -- )
  -1 going !  speed @ 0= if live? if tm-go then then
  begin advance shown  1- dup 0=  going? 0= or  key? or until drop
  tm-running? if tm-stop then  0 going !  shown ;
: linger ( frames -- ) begin shown 1- dup 0= key? or until drop ;

: eat ( -- ) key? if key drop then ;  \ the key that stopped it
: run ( -- ) backdrop 0 (run) eat ;
: step ( -- ) live? if one then  shown ;
: (load) ( rec -- ) tm-load backdrop shown ;
: machines ( -- )
  rec @  catalog @
  begin dup @ while dup @ rec !  names .342 space  1+ repeat drop
  rec !  cr ;
: demo ( -- )
  begin
    catalog @ begin dup @ key? 0= and while
      dup @ (load)  8 r@@ (run)  key? 0= if 40 linger then  1+
    repeat drop
  key? until eat ;
