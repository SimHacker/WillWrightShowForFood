create Xlib.f
requires ctypes.f
requires X.f

alias Status int
alias XId long

struct ( XEvent )
    long xevent_type
    Window xevent_window
    short xevent_time
    short xevent_detail
    alias xevent_mask xevent_detail
    short xevent_x
    alias xevent_expose_width xevent_x
    short xevent_y
    alias xevent_expose_height xevent_y
    Window xevent_subwindow
    short xevent_expose_y
    alias xevent_location xevent_expose_y
    short xevent_expose_x
constant /XEvent
: XEvent /XEvent field ;

struct ( qevent )
    addr qevent_next;
    XEvent qevent_event;
constant /QEvent
: QEvent /QEvent field ;

struct ( display )
    int display_fd
    Window display_root
    int display_vnumber
    int display_dtype
    int display_dplanes
    int display_dcells
    addr display_head
    addr display_tail
    int display_qlen
    int display_request
    addr display_lastdraw
    addr display_buffer
    addr display_bufptr
    addr display_bufmax
    int display_squish
    Pixmap display_black
    Pixmap display_white
    addr display_displayname
    int display_width
    int display_height
constant /Display
: Display /Display field ;

struct ( x_assoc )
    addr xassoc_next
    addr xassoc_prev
    addr xassoc_display
    XId xassoc_x_id
    addr xassoc_data
constant /XAssoc
: XAssoc /XAssoc field ;

struct ( x_assoc_table )
	addr x_assoctab_table
	int x_assoctab_size
constant /XAssocTable
: XAssocTable /XAssocTable field ;

struct ( WindowInfo )
    short windowinfo_width
    short windowinfo_height
    short windowinfo_x
    short windowinfo_y
    short windowinfo_bdrwidth
    short windowinfo_mapped
    short windowinfo_type
    Window windowinfo_assoc_wind
constant /WindowInfo
: WindowInfo /WindowInfo field ;

struct ( FontInfo )
    Font fontinfo_id
    short fontinfo_height
    short fontinfo_width
    short fontinfo_baseline
    short fontinfo_fixedwidth
    char fontinfo_firstchar
    char fontinfo_lastchar
    addr fontinfo_widths
constant /FontInfo
: FontInfo /FontInfo field ;

struct ( Color )
    int color_pixel
    short color_red
    short color_green
    short color_blue
constant /Color
: Color /Color field ;

struct ( TileFrame )
    int tileframe_pixel
    Pixmap tileframe_pixmap
constant /TileFrame
: TileFrame /TileFrame field ;

struct ( OpaqueFrame )
    Window opaqueframe_self
    short opaqueframe_x
    short opaqueframe_y
    short opaqueframe_width
    short opaqueframe_height
    short opaqueframe_bdrwidth
    Pixmap opaqueframe_border
    Pixmap opaqueframe_background
constant /OpaqueFrame
: OpaqueFrame /OpaqueFrame field ;

struct ( TransparentFrame )
    Window transparentframe_self
    short transparentframe_x
    short transparentframe_y
    short transparentframe_width
    short transparentframe_height
constant /TransparentFrame
: TransparentFrame /TransparentFrame field ;

struct ( BatchFrame )
    short batchframe_type
    Window batchframe_parent
    Window batchframe_self
    short batchframe_x
    short batchframe_y
    short batchframe_width
    short batchframe_height
    short batchframe_bdrwidth
    Pixmap batchframe_border
    Pixmap batchframe_background
constant /BatchFrame
: BatchFrame /BatchFrame field ;

struct ( XErrorEvent )
    /l +			\ not used
    long xerror_serial
    char xerror_error_code
    char xerror_request_code
    char xerror_func
    /l +			\ not used
    Window xerror_window
    /l 2* +			\ not used
constant /XErrorEvent
: XErrorEvent /XErrorEvent field ;

alias Pattern long
