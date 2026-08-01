#
#	$Header: Makefile,v 10.3 86/02/02 14:10:11 jg Exp $
#

#/***********************************************************************
#*									*
#*		      Placed in the public domain by			*
#*		Digital Equipment Corporation, Maynard, MA		*
#*									*
#*	The information in this software is subject to change without	*
#*	notice and should not be construed as a commitment by Digital	*
#*	Equipment Corporation.  Digital makes no representations	*
#*	about suitability of this software for any purpose. It is	*
#*	supplied "as is" without express or implied warranty.		*
#*									*
#************************************************************************/
#
#/*
#* MODIFICATION HISTORY
#*
#* 000 -- M. Gancarz, DEC Ultrix Engineering Group
#*/
#
# $Header: Makefile,v 10.3 86/02/02 14:10:11 jg Exp $
#

# SCCSID="@(#)Makefile	3.7	1/23/86"
#
#	Makefile for 'uwm' window manager (client of X windowing system)
#
#

DESTDIR=
CONFDIR= /tumtum/forth/uwm
UWMDIR= /usr/new/lib/X/uwm
INCLUDES= -I../include
CURSORDIR= /usr/src/new/X/cursors
CFLAGS= -g $(INCLUDES) -I$(CURSORDIR)
YFLAGS= -d
LLIB= -ll
MLIB= -lm
XLIB= ../Xlib/libX.a

SRCS=	gram.y lex.l globals.c Beep.c Bindings.c CircleDown.c CircleUp.c\
	Focus.c GetButton.c Iconify.c Lower.c Menu.c Move.c\
	MoveOpaque.c NewIconify.c Pause.c Push.c Error.c Raise.c Refresh.c\
	Resize.c Restart.c StoreBox.c StoreGridBox.c StoreCursors.c StoreZap.c\
	XError.c 

OBJS1=	gram.o lex.o globals.o Beep.o Bindings.o CircleDown.o CircleUp.o
OBJS2=	Focus.o GetButton.o Iconify.o Lower.o Menu.o Move.o MoveOpaque.o
OBJS3=	NewIconify.o Pause.o Push.o Error.o Raise.o Refresh.o Resize.o Restart.o
OBJS4=	StoreBox.o StoreGridBox.o StoreCursors.o StoreZap.o XError.o 
OBJS=	$(OBJS1) $(OBJS2) $(OBJS3) $(OBJS4) 

all:	wm.exe

objs1:	$(OBJS1}
objs2:	$(OBJS2}
objs3:	$(OBJS3}
objs4:	$(OBJS4}
objs:	objs1 objs2 objs3 objs4

uwm:	objs uwm.o
	$(CC) ${CFLAGS} $(OBJS) uwm.o $(LLIB) $(MLIB) ${XLIB} -o uwm

fuwm.exe: fuwm.out load-fuwm.f uwm.f X.f Xlib.f ctypes.f
	forth load-fuwm.f -s '"" $@ save-forth'

wm.exe: fuwm.exe fuwm-main.f
	forth fuwm.exe fuwm-main.f -s '"" $@ save-forth'

fuwm.out: $(OBJS) Forth.o fuwm.o ../forthmacs/me.out
	ld -r $(OBJS) Forth.o fuwm.o ../forthmacs/me.out $(LLIB) $(MLIB) $(XLIB) -o $@

install: uwm default.uwmrc menuless.uwmrc mono.uwmrc ${DESTDIR}${UWMDIR}
	install -c -s -m 755 uwm ${DESTDIR}${CONFDIR}
	install -c -m 644 default.uwmrc ${DESTDIR}${UWMDIR}/default.uwmrc
	install -c -m 644 menuless.uwmrc ${DESTDIR}${UWMDIR}/menuless.uwmrc
	install -c -m 644 mono.uwmrc ${DESTDIR}${UWMDIR}/mono.uwmrc
	install -c -m 644 jg.uwmrc ${DESTDIR}${UWMDIR}/jg.uwmrc

${DESTDIR}${UWMDIR}:
	mkdir ${DESTDIR}${UWMDIR}
	chmod 755 ${DESTDIR}${UWMDIR}

$(OBJS) uwm.o fuwm.o: uwm.h

lex.o: uwm.h lex.l

StoreCursors.o: uwm.h\
	$(CURSORDIR)/arrow_cross.cursor\
	$(CURSORDIR)/arrow_cross_mask.cursor\
	$(CURSORDIR)/xterm.cursor\
	$(CURSORDIR)/xterm_mask.cursor\
	$(CURSORDIR)/icon.cursor\
	$(CURSORDIR)/icon_mask.cursor\
	menu.cursor\
	menu_mask.cursor\
	leftbutton.cursor\
	middlebutton.cursor\
	rightbutton.cursor\
	button_mask.cursor

$(XLIB):
	@echo "Cannot make the Ultrix Window Manager without a valid X library."

clean:
	-rm -f *.o lex.yy.c core y.output y.tab.h uwm *.bak *.sav tmp* \#* *~
