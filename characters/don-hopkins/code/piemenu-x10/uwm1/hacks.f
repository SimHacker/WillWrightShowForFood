variable free-tasks
nuser next-free-task

create ntask  /l 2* allot

: new-task ( --- task )
  free-tasks @ ?dup if
    dup next-free-task local dup @  swap off  free-tasks !
  else
    default-task-size ntask /l + !
    ntask tfork
  then
;

: free-task ( --- )
  free-tasks @ next-free-task !
  up@ free-tasks !
  begin
    stop
    ." <<Free task " up@ . ." started!>>" cr
  again
;

defer do-hack

:case hack-keymask-dispatch
\	---		l		s		l|s
	do-hack		do-test		do-play-menu 	do-play-menu

\	m		l|m		s|m		l|s|m
	_uwm_poop	do-hack		_uwm_poop	do-hack

\	c		l|c		c|s		l|c|s
	_uwm_poop	do-hack		_uwm_poop 	do-hack

\	c|m		l|c|m		c|m|s		l|c|m|s
	do-hack		do-control-menu	do-hack		do-hack
;

' hack-keymask-dispatch is keymask-dispatch

variable fling-len  500 fling-len !

variable fling-delay  50000 fling-delay !

nuser t-info
/WindowInfo ualloc
nuser t-stop
nuser t-grav-x
nuser t-grav-y
nuser this-win
nuser t-max-x
nuser t-max-y
nuser t-x
nuser t-y
nuser t-xv
nuser t-yv
nuser t-friction
nuser t-down-x
nuser t-down-y
nuser t-mouse-power

: @negate! ( addr --- )
  dup @ negate swap ! ;

code 256/ ( n --- n/256 )
  sp ) d0 long move
  8 l# d1 long move
  d1 d0 long asr
  d0 sp ) long move
  next
;code

code 256* ( n --- n*256 )
  sp ) d0 long move
  8 l# d1 long move
  d1 d0 long asl
  d0 sp ) long move
  next
;code

create delay-time
/timeval allot

: delay ( sec usec --- )
  delay-time tv_usec !
  delay-time tv_sec !
  delay-time 0 0 0 0 _select drop drop drop drop drop
;

: (do-delay
  0 fling-delay @ delay
;

' (do-delay is do-delay

: fling
  t-xv @ t-friction @ * 256/ t-xv !
  t-grav-x @ t-xv +!

  t-yv @ t-friction @ * 256/ t-yv !
  t-grav-y @ t-yv +!

  t-xv @ 256/ t-x +!
  t-x @ 0< if  0 t-x !  t-xv @ abs  t-xv !  then
  t-x @ t-max-x @ >= if  t-max-x @ 1- t-x !  t-xv @ abs negate t-xv !  then

  t-yv @ 256/ t-y +!
  t-y @ 0< if  0 t-y !  t-yv @ abs t-yv !  then
  t-y @ t-max-y @ >= if  t-max-y @ 1- t-y !  t-yv @ abs negate t-yv !  then

  t-y @  t-x @  this-win @  _XMoveWindow  drop drop drop
  _XFlush
;

: .state
  ." x " t-x ?  ." y " t-y ?  ." t-xv " t-xv ?  ." t-yv " t-yv ?
  cr
;

: hack1
  _button_event xevent_subwindow @ this-win !
  this-win @ 0= if 7 emit exit then
  _button_event xevent_x w@ t-down-x !
  _button_event xevent_y w@ t-down-y !
  t-info this-win @ _XQueryWindow drop drop
  _ScreenWidth @ t-info windowinfo_width w@  - 2 - t-max-x ! 
  _ScreenHeight @ t-info windowinfo_height w@  - 2 - t-max-y ! 
  t-info windowinfo_x w@ t-x !
  t-info windowinfo_y w@ t-y !

  begin
    begin do-delay ?pending until
    _button_event _XNextEvent
    xevent_type @ ButtonReleased and
  until

  _button_event xevent_x w@  t-down-x @ -   t-mouse-power @ *  t-xv !
  _button_event xevent_y w@  t-down-y @ -   t-mouse-power @ *  t-yv !

  fling-len @ 0 do
    fling
    t-xv @ dup * 256/ t-yv @ dup * 256/ + 256/  t-stop @ < if leave then
    pause
  loop
;

: stopper
  stop ;

variable fling-stop  10 fling-stop !
variable fling-grav-x  0 fling-grav-x !
variable fling-grav-y  200 fling-grav-y !
variable fling-mouse-power  70 fling-mouse-power !  
variable fling-friction  252 fling-friction !

: init-fling
  fling-stop @ t-stop !
  fling-grav-x @ t-grav-x !
  fling-grav-y @ t-grav-y !
  fling-mouse-power @ t-mouse-power ! 
  fling-friction @ t-friction !
;

init-fling

up@ dup !

: bg-hack1
  begin
    init-fling
    hack1
    free-task
  again
;

variable cur-task

: start-hack
  multi
  new-task cur-task !
  ['] bg-hack1 cur-task @ start
  cur-task @ wake
  pause
;

' start-hack is do-hack

: l
  [""] hacks.f load ;
