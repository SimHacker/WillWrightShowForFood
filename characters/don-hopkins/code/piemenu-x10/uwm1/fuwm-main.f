requires xutil.f
requires string-equals.f
requires uwm.f
requires sh.f
requires random.f

: rnd random 2/ ;

variable this-mh

: mh this-mh @ ;

struct ( menu-header )
  addr mh_next
  addr mh_name
  addr mh_func
  addr mh_menuinfo
  Window mh_window
  int mh_mask
  int mh_button
  int mh_x
  int mh_y
  int mh_cur
  addr mh_curaddr
  int mh_hi_lite
  int mh_mapped
  int mh_answer
constant /menu-header

struct ( timeval )
  long tv_sec
  long tv_usec
constant /timeval
: timeval /timeval field ;

variable started

create start-time /timeval allot
create stop-time /timeval allot

create down-time /timeval allot
create up-time /timeval allot

: elapsed ( >start-timeval >stop-timeval --- ms_elapsed )
  2dup tv_sec @ swap tv_sec @ - 1000000 *
  swap tv_usec @ rot tv_usec @ - + ;

: get-time ( >timeval --- )
  _get_time drop ;

variable log.out

: log.emit 
  log.out @ fputc ;

: log.type
  log.out @ fputs ;

: <log
  ['] log.emit is emit
  ['] log.type is type
;

: log>
  ['] emit1 is emit
  ['] unix-type is type
;

variable ms-field  10 ms-field !

: .ms ( ms --- addr len )
  <# # # # # # # ascii . hold #s #> 
  ms-field @ over - 0 max spaces type ."  sec " 
;

variable mouse_x  variable mouse_y  variable mouse_subw

: ?pending ( --- n )
  _XPending ret ;

: ?pending-mouseup ( --- b )
  begin ?pending while
    _button_event _XNextEvent
    xevent_type @ ButtonReleased = if
      _button_event _XPutBackEvent drop
      -1 exit then
  repeat
  0 ;

decimal
: update-mouse-click
  _button_event xevent_x w@ mouse_x !
  _button_event xevent_y w@ mouse_y !
;

: ?pending-mousedown ( --- b )
  begin ?pending while
    _button_event _XNextEvent
    xevent_type @ ButtonPressed = if
      _button_event _XPutBackEvent drop
      -1 exit then
  repeat
  0 ;

: c"count ( c_string --- len )
  dup begin
    count 0= until
  over - 1- ;

: cs"= ( c_string forth_string --- b )
  count rot cscount	\ fs_addr fs_len cs_addr cs_len
  2 pick = if		\ fs_addr fs_len cs_addr
    swap comp 0=		\ b
  else			\ fs_addr fs_len cs_addr
    2drop drop 0 then ;	\ b

: find-menu ( name --- menu )
  _Menus @ 			\ name mlink
  begin ?dup while		\ name mlink
    dup mlink_menu @		\ name mlink menuinfo
    dup mi_name @ 		\ name mlink menuinfo menuname
    3 pick cs"=	if		\ name mlink menuinfo
      nip nip exit then
    drop mlink_next @		\ name next_mlink
  repeat				\ name
  cr ." Can't find menu '" count type ." '!" abort ;

: update-mouse
  mouse_subw mouse_y mouse_x RootWindow _XUpdateMouse 2drop 2drop ;

: ?map-menu ( --- )
  mh mh_mapped @ 0= if
    mh mh_y @
    mh mh_x @
    mh mh_menuinfo @
    _MapMenu 2drop drop
    mh mh_mapped on
    _XFlush
  then ;

: ?unmap-menu ( --- )
  mh mh_mapped @ if
    mh mh_menuinfo @ _UnmapMenu drop 
    mh mh_mapped off
    _XFlush
  then ;

: center-menu ( --- )
  mh mh_menuinfo @ >r
  mouse_y @  
  dup mh mh_x !
  r@ mi_center_y @ - 0 max
  mouse_x @
  dup mh mh_y !
  r@ mi_center_x @ - 0 max
  r> mi_w @
  _XMoveWindow
  drop 2drop ;

: place-menu ( --- )
  begin
    ?pending-mousedown 0= while
    update-mouse center-menu
    ?map-menu
    _XFlush
  repeat
;

variable MH  0 MH !

: menu-header ( function name --name )
  here swap over over c@ 1+ dup allot cmove
  create
  MH @ 
  here MH !
  , , ,
  /menu-header 3 /n * - allot
;

: test-menu-header ( answer function name --name )
  menu-header  MH @ mh_answer !
;

: init-menu-headers
  MH begin
    @ ?dup while
    dup mh_name @ find-menu over mh_menuinfo !
  repeat ;

defer show-choice
defer do-delay

variable cheating
variable cell-number
variable menu-number
variable this-menu
variable test-control
variable dumdu-menus  1 dumdu-menus !

defer do-demo
defer do-record
defer do-control
defer do-hosts
requires menulist.f

create name-buf
," log.out." 40 allot
name-buf c@ constant /name-prefix

: append-string ( dest$ addr len --- )  
  2 pick count + swap dup >r cmove
  dup c@ r> + swap c!
;

: init-wm
  init-fregs
  0 0 1 _init_uwm drop 2drop 
  init-menu-headers
  4 test-control !	\ Nothing
  /name-prefix name-buf c!
  name-buf  _getpid ret (.)  append-string
;

alias init-uwm init-wm

defer track-menu

: track-menu-highlight ( --- )
  random drop
  mouse_y @  mouse_x @
  mh mh_cur  mh mh_menuinfo @
  _Track				\ y x >cur menu
  mh mh_mapped @ if
    mh mh_hi_lite  rot rot		\ y x >hi_lite >cur menu
    _Highlight drop then
  2drop 2drop ;

: track-menu-place ( --- )
  mh mh_mapped @ if
    mh mh_menuinfo @ >r
    mouse_y @  r@ mi_center_y @ -  _MBorderWidth @ -
    mouse_x @  r@ mi_center_x @ -  _MBorderWidth @ -
    r> mi_w @
    _XMoveWindow drop 2drop
  then
;

: get-selection ( event --- )
  begin
    ?pending while
    _button_event _XNextEvent
    xevent_type @ over and if
      drop exit then
  repeat
  ?map-menu
  begin
    begin
      update-mouse track-menu
      do-delay
      ?pending until
    _button_event _XNextEvent
    xevent_type @ over and until
  drop
;
    
: grab-mouse
    [ ButtonPressed ButtonReleased MouseMoved or or ] literal
    mh mh_menuinfo @ mi_piemenu @ if _SliceCursor else _MenuCursor then @
    RootWindow
    _XGrabMouse ret
    0= if cr ." _XGrabMouse lossage." cr quit then
    2drop drop 
;

: ungrab-mouse
  _XUngrabMouse ;

: init-mh
    _button_event xevent_window @  mh mh_window !
    _button_event xevent_detail w@
    dup KeyMask mh mh_mask !
    ButtonValue mh mh_button !
    _button_event xevent_x w@  dup mh mh_x !  _MenuCenterX !
    _button_event xevent_y w@  dup mh mh_y !  _MenuCenterY !
    mh mh_cur off
    mh mh_hi_lite off
    mh mh_mapped off
;

100 stack: mh-stack

: push-mh-stack ( menu --- )
  this-mh @ mh-stack push
  this-mh !
  init-mh
;

: pop-mh-stack
  ?unmap-menu
  mh-stack pop this-mh ! ;

: track-release
    ['] track-menu-highlight is track-menu
    ButtonReleased get-selection
    update-mouse-click
    track-menu
;

: track-transition
    ['] track-menu-highlight is track-menu
    ButtonReleased ButtonPressed or get-selection
    update-mouse-click
    track-menu
;

: track-place
    ['] track-menu-place is track-menu
    ButtonPressed get-selection
    update-mouse-click
    track-menu
;

: choose-from-menu ( --- result )
  track-transition

  dumdu-menus @ if
    mh mh_cur @ 0= if
      track-transition then
  then

  mh mh_cur @
  mh mh_func @ execute
  ?unmap-menu
;

: do-menu ( menu --- )
  push-mh-stack
  grab-mouse
  choose-from-menu
  ungrab-mouse
  pop-mh-stack
;

: do-place-menu ( menu --- )
  push-mh-stack
  grab-mouse
  track-place
  init-mh
  choose-from-menu
  ungrab-mouse
  pop-mh-stack
;

: do-test-menu
  down-time get-time
  started @ 0= if
    down-time start-time /timeval cmove then
  1 started !
  this-menu @ do-menu
;

: do-test
  test-control @ case
    1 of do-test-menu endof
    2 of DemoPie-mh do-menu endof
    3 of PracticePie-mh do-menu endof
    4 of 7 emit endof
    5 of PracticePullDown-mh do-menu endof
    6 of DemoPullDown-mh do-menu endof
    cr ." Bad test-control: " test-control ? warm
  endcase
;

: :case
  !csp create ] does> swap /token * + @ execute ;

:case hosts-submenus-case 0
  brillig-mh haigha-mh gyre-mh mome-mh
  tumtum-mh crayola-mh ballast-mh mimsy-mh ;

defer hosts-do-menu
' do-menu is hosts-do-menu

: (do-hosts ( host# --- )
  hosts-submenus-case ?dup if
    hosts-do-menu
  then
;
' (do-hosts is do-hosts

: f.forth
  sp0 @ sp!  rp0 @ rp! 
  cr ." Whammo! You're in Forth, now!" 
  warm ;

: zow
  begin
    _button_event _GetButton 
    xevent_type @ ButtonPressed = until
  _uwm_poop
;

defer keymask-dispatch

20 constant /subject-number  create subject-number /subject-number allot
80 constant /subject-name  create subject-name  /subject-name allot

variable randomness  50 randomness ! 

6 constant /cells
5 constant menus/cell
create cell-offsets 0 , 5 , 10 , 15 , 20 , 25 ,

: rnd-cell
  rnd /cells mod /l * cell-offsets + ;

: randomize-cells
  randomness @ 0 do
    rnd-cell dup @ rnd-cell dup @
    -rot ! swap !
  loop
;

create no-choice ," [No choice]"

: menu-line-name ( mh item --- addr len )
  ?dup 0= if
    no-choice count
  else  
    swap mh_menuinfo @ mi_line 
    begin
      @ swap 1- ?dup while swap repeat
    ml_name @ c"count
  then
;

: home
  27 emit ." [H" 
;

: cleos
  27 emit ." [J"
;

: announce-menu
  this-menu @ 
  dup mh_name @ count
  <log ." Menu " type ." :" cr log>
  dup mh_answer @
  home cleos
  cr ."                            Choose '"
  menu-line-name 2dup type ." '." cr cr
  <log ." Choose '" type ." '." cr log>
;

: menu-addr ( --- addr )
  cell-number @ /l * cell-offsets + @
  menu-number @ +
  /l * menu-sequence + 
;

: init-menu
  menu-addr @ this-menu !
  announce-menu
  0 started !
;

: init-menu-sequence
  randomize-cells
  0 cell-number !
  0 menu-number !
  init-menu
;

: start-test
  cr cr
  begin
    ." Subject number? " subject-number /subject-number expect
    span @ until
  begin
    ." And what's the name? " subject-name /subject-name expect
    span @ until
  cr ." Well let's get started then." cr 

  log.out @ ?dup if 
    close  0 log.out ! then
  name-buf delete drop
  name-buf make
  name-buf write open ?dup if
    log.out !
  else
    ." Error opening " name-buf count type warm then

  <log ." Subject number: " subject-number c"count type cr
       ." Subject name: " subject-name c"count type cr cr log>

  init-menu-sequence
;

: button-number ( --- n )
  _button_event xevent_detail w@ 
  3 and ;

: (do-control ( selection --- )
  ?dup if
    dup test-control ! 
    1 = if
      ?unmap-menu ungrab-mouse _XFlush start-test then
  then ;

' (do-control is do-control

defer get-button

: (get-button
  begin
    do-delay
    pause
    ?pending until
  _button_event _GetButton
;

' (get-button is get-button

: wm
  begin
    begin
      get-button
      xevent_type @ ButtonPressed = until
    _button_event xevent_detail w@ 
    KeyMask 11 >> keymask-dispatch
    _XFlush
  again
;

: test
  init-wm wm
;

: (show-choice ( choice --- )
  ." Menu '" mh mh_name @ count type
  ." ' item '" mh swap menu-line-name type ." '." cr
;

' (show-choice is show-choice

:case play-menu-case ( n --- menu )
  Percent-mh Hosts-mh Pull-mh
;

: do-play-menu
  button-number play-menu-case do-menu ;
;

: do-control-menu
  Control-mh do-menu
;

: (do-demo
  drop
;

' (do-demo is do-demo

create alldone.cmd
," rcp " 80 allot
alldone.cmd c@ constant /alldone.cmd
create alldone.dest
,"  tove.callahan:/u/callahan/tests/subject."
create alldone.dot
," ."

: all-done
  cr cr 
  ." You're all done with the test." cr cr
  7 emit 7 emit 7 emit 7 emit
  4 test-control !
  <log ." Test completed." cr log>
  log.out @ close  0 log.out !
  ?unmap-menu ungrab-mouse _XFlush
  /alldone.cmd alldone.cmd c!
  alldone.cmd name-buf count append-string
  alldone.cmd alldone.dest count append-string
  alldone.cmd subject-number c"count append-string
  alldone.cmd alldone.dot count append-string
  alldone.cmd _getpid ret (.) append-string
  alldone.cmd -sh
;

: (do-record
  up-time get-time
  down-time up-time elapsed
  <log ." Time: " .ms 
  3 spaces ." Selected: " this-menu @ over menu-line-name 2dup type cr log>
  ."         Selected: " type cleos 13 emit
  mh mh_answer @ <> cheating @ 0= and if 
    7 emit exit then
  start-time up-time elapsed
  ."    Correct!" cleos cr
  <log ." Total time: " .ms cr cr log>
  1 menu-number +!
  menu-number @ menus/cell = if
    0 menu-number !
    1 cell-number +!
      cell-number @ /cells = if
        all-done exit then then
  init-menu
;

' (do-record is do-record

:case test-keymask-dispatch
\	---		SL		SH		SH SL
	do-test		_uwm_poop	do-play-menu 	_uwm_poop
\	M		M SL		M SH		M SH SL
	_uwm_poop	_uwm_poop	_uwm_poop	_uwm_poop
\	C		C SL		C SH		C SH SL
	_uwm_poop	_uwm_poop	_uwm_poop 	_uwm_poop
\	C M		C M SL		C M SH		C M SH SL
	do-control-menu	_uwm_poop	_uwm_poop	_uwm_poop
;

' test-keymask-dispatch is keymask-dispatch

