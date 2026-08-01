create X.f

alias Window long
alias Font long
alias Bitmap long
alias Pixmap long
alias Cursor long
alias Locator long

struct ( Vertex )
    short vertex_x
    short vertex_y
    short vertex_flags
constant /Vertex
: Vertex /Vertex field ;

struct ( ColorDef )
    short colordef_pixel
    short colordef_red
    short colordef_green
    short colordef_blue
constant /ColorDef
: ColorDef /ColorDef field ;


\ Input event codes 
hex
0000 constant NoEvent
0001 constant KeyPressed
0002 constant KeyReleased
0004 constant ButtonPressed
0008 constant ButtonReleased
0010 constant EnterWindow
0020 constant LeaveWindow
0040 constant MouseMoved
0080 constant ExposeWindow
0100 constant ExposeRegion
0200 constant ExposeCopy
0400 constant RightDownMotion
0800 constant MiddleDownMotion
1000 constant LeftDownMotion
2000 constant UnmapWindow
4000 constant FocusChange

\ Event detail bits

4000 constant ControlMask
2000 constant MetaMask
1000 constant ShiftMask
0800 constant ShiftLockMask
0400 constant LeftMask
0200 constant MiddleMask
0100 constant RightMask
00ff constant ValueMask

decimal

: KeyState ( n --- m )
  [ ControlMask MetaMask ShiftMask or or ] literal and 12 >> ;

: FullKeyState ( n --- m )
  [ ControlMask MetaMask ShiftMask ShiftLockMask or or or ] literal and 11 >> ;

: ButtonState ( n --- m )
  [ LeftMask MiddleMask RightMask or or ] literal and 8 >> ;

\ Button event detail codes

0 constant RightButton
1 constant MiddleButton
2 constant LeftButton

\ Enter/Leave event detail codes

1 constant IntoOrFromSubwindow
2 constant VirtualCrossing

\ These are the error codes

1 constant BadRequest
2 constant BadValue
3 constant BadWindow
4 constant BadPixmap
5 constant BadBitmap
6 constant BadCursor
7 constant BadFont
8 constant BadMatch
9 constant BadTile
10 constant BadGrab
11 constant BadAccess
12 constant BadAlloc
13 constant BadColor

\ for monochrome applications

0 constant BlackPixel
1 constant WhitePixel

\ graphics functions

hex
00 constant GXclear
01 constant GXand
02 constant GXandReverse
03 constant GXcopy
04 constant GXandInverted
05 constant GXnoop
06 constant GXxor
07 constant GXor
08 constant GXnor
09 constant GXequiv
0a constant GXinvert
0b constant GXorReverse
0c constant GXcopyInverted
0d constant GXorInverted
0e constant GXnand
0f constant GXset

decimal

0 constant TileModeAbsolute
1 constant TileModeRelative

\ Used in X_ClipMode

0 constant ClipModeClipped
1 constant ClipModeDrawThru

\ Used in X_QueryWindow reply

0 constant IsUnmapped
1 constant IsMapped
2 constant IsInvisible

0 constant IsTransparent
1 constant IsOpaque
2 constant IsIcon

\ Used in X_Draw

0 constant DrawSolidLine
1 constant DrawDashedLine
2 constant DrawPatternedLine

\ The meanings of the flag bits.  If the bit is 1 the predicate is true

hex
0001 constant VertexRelative
0002 constant VertexDontDraw
0004 constant VertexCurved
0008 constant VertexStartClosed
0010 constant VertexEndClosed
0020 constant VertexDrawLastPoint

decimal

