create uwm.f
requires Xlib.f

struct ( Keyword )
    addr kw_name
    int kw_type
    addr kw_bptr
    addr kw_nptr
    addr kw_sptr
    addr kw_fptr
constant /Keyword

struct ( Binding )
    addr bi_next
    int bi_context
    short bi_mask
    short bi_button
    addr bi_func
    addr bi_menuname
    addr bi_menu
constant /Binding

struct ( NamedMask )
    addr nm_name
    short nm_mask
constant /NamedMask

struct ( MenuInfo )
    addr mi_name
    int mi_name_x
    int mi_name_y
    Window mi_w
    Bool mi_piemenu
    int mi_items
    int mi_initial_x
    int mi_initial_y
    int mi_radius
    int mi_center_x
    int mi_center_y
    int mi_iheight
    int mi_width
    int mi_height
    Pixmap mi_image
    addr mi_foreground
    addr mi_background
    addr mi_fghighlight
    addr mi_bghighlight
    Color mi_fg
    Color mi_bg
    Color mi_hlfg
    Color mi_hlbg
    addr mi_line
constant /MenuInfo

struct ( MenuLine )
    addr ml_next
    addr ml_name
    int ml_width
    int ml_type
    int ml_x_offset
    int ml_y_offset
    int	ml_quadrant
    double ml_slope
    addr ml_text
    addr ml_func
    addr ml_menu
    addr ml_foreground
    addr ml_background
    Color ml_fg
    Color ml_bg
constant /MenuLine
: MenuLine /MenuLine field ;

struct ( MenuLink )
    addr mlink_next
    addr mlink_menu
constant /MenuLink
: MenuLink /MenuLink field ;

: KeyMask ( mask --- keymask )
  [ ControlMask MetaMask ShiftMask ShiftLockMask or or or ] literal and ;

: ButtonValue ( mask --- buttonmask )
  [ LeftMask MiddleMask RightMask or or ] literal and 9 >> ;

