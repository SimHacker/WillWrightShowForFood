create xutil.f
requires cstrings.f
requires Xlib.f

: RootWindow ( --- window )
  __XlibCurrentDisplay @ display_root @ ;
: BlackPixmap ( --- pixmap )
  __XlibCurrentDisplay @ display_black @ ;
: WhitePixmap ( --- pixmap )
  __XlibCurrentDisplay @ display_white @ ;
: QLength ( --- length )
  __XlibCurrentDisplay @ display_qlen @ ;

: ctype ( addr --- )
  begin count ?dup while emit repeat drop ;

variable win  win off

: makewin
  win @ ?dup if
    _XDestroyWindow drop then
  WhitePixmap BlackPixmap 4 80 80 40 40 RootWindow _XCreateWindow
  ret win !
  2drop 2drop 2drop 2drop ;
