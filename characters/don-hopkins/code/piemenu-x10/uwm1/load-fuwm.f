.( Loading...) cr
requires tasking.f
requires uwm.f
requires clink.f
.( Linking...) cr
"" fuwm.out clink
.( Linked!) cr
: cstring,  ( string -- )
   count tuck  here  swap cmove   ( len )
   dup allot 0 c,
;

create argstring  "" dontexit  cstring,
create progname   "" micro-emacs cstring,

create argv  progname ,  argstring ,  0 ,

: edit  ( -- )
   0 argv 2  _emacs_main
   2drop drop
;
alias ed edit

requires fcall.f

: get-centry ( #args #returns -- entry ) ( Input stream: name )
  bl word  ( #args #returns str )
  dup cname "copy ( #args #returns str )
  find 0= if interpret-do-undefined then  ( #args #returns cfa )
  makebody   ( #args ip )
  here -rot  ( entry-point #args ip )
  swap make-c-entry ( entry-point )
;

: f_error ( n --- )
  cr ." Got uwm error # " decimal . cr
  abort" Bailing out." ;

: f_exec ( --- )
  _F_exec_string @ 
  dup begin count 0= until
  'tib @ >r >in @ >r #tib @ >r
  over - 1- #tib !
  'tib ! >in off interpret 
  r> #tib ! r> >in ! r> 'tib ! ;

: f_exit ( status --- )
  cr ." Exit uwm with status " decimal . cr
  ." Bailing out." warm ;

1 0 get-centry f_error  _F_error !
0 0 get-centry f_exec   _F_exec !
1 0 get-centry f_exit	_F_exit !
