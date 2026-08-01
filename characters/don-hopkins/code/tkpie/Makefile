TK_LIB = /usr/local/src/tk
TCL_LIB = /usr/local/src/tcl
XPM_LIB = /usr/local/src/xpm
LIBS = $(TK_LIB)/libtk.a $(TCL_LIB)/libtcl.a $(XPM_LIB)/libXpm.a -lm -lX11 -lXext
INCLUDES = -I$(TK_LIB) -I$(TCL_LIB) -I$(XPM_LIB)
CC = acc
CFLAGS = -g $(INCLUDES)

piesh: main.o tkPieMenu.o
	$(CC) $(CFLAGS) main.o tkPieMenu.o $(LIBS) $(XLIB) -o piesh

clean:
	rm -f main.o tkPieMenu.o piesh
